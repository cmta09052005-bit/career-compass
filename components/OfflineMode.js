"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { browserStorage, subscribeToStorage } from "@/lib/browserStorage";
import Card from "./Card";
import Button from "./Button";
import Localized from "./Localized";
import { marketingFonts } from "./marketingFonts";
import "./offline-mode.css";

const KEY = "careerCompassOfflineMode";
const PREFIX = "career-compass-offline-";
const OfflineContext = createContext(null);
function savedPreference() {
  try { return JSON.parse(browserStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function isOfflineWorker(worker) {
  return !!worker && new URL(worker.scriptURL).origin === location.origin && new URL(worker.scriptURL).pathname === "/sw.js";
}
function goodConnection() {
  const connection = navigator.connection;
  return navigator.onLine && !connection?.saveData && !["slow-2g", "2g", "3g"].includes(connection?.effectiveType);
}
function ask(worker, type) {
  return new Promise((resolve, reject) => {
    if (!worker) { reject(new Error("No offline worker")); return; }
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error("Offline worker did not answer")); }, 10000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    worker.postMessage({ type }, [channel.port2]);
  });
}
function preparedUpdate(reg) {
  if (reg.waiting) return Promise.resolve(reg.waiting);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { reg.removeEventListener("updatefound", watch); reject(new Error("Update did not finish")); }, 120000);
    const watch = () => {
      const worker = reg.installing;
      if (!worker) return;
      const changed = () => {
        if (worker.state === "installed") { clearTimeout(timer); reg.removeEventListener("updatefound", watch); resolve(worker); }
        if (worker.state === "redundant") { clearTimeout(timer); reg.removeEventListener("updatefound", watch); reject(new Error("Update did not finish")); }
      };
      worker.addEventListener("statechange", changed);
      changed();
    };
    reg.addEventListener("updatefound", watch);
    watch();
  });
}
async function clearOfflineCopy() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations.filter(reg => reg.scope === new URL("/", location.origin).href && [reg.active, reg.waiting, reg.installing].some(isOfflineWorker))) {
      await Promise.allSettled([reg.active, reg.waiting, reg.installing].filter(Boolean).map(worker => ask(worker, "DISABLE")));
      await reg.unregister();
    }
  }
  if ("caches" in window) await Promise.all((await caches.keys()).filter(key => key.startsWith(PREFIX)).map(key => caches.delete(key)));
}

export function OfflineButton() {
  const offline = useContext(OfflineContext);
  return <Button className="offline-entry" variant="secondary" label="Offline Mode" onClick={offline?.open} />;
}

export default function OfflineMode({ children }) {
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);
  const [state, setState] = useState("off");
  const [enabled, setEnabled] = useState(false);
  const [percent, setPercent] = useState(0);
  const [copy, setCopy] = useState(null);
  const [available, setAvailable] = useState(null);
  const [notice, setNotice] = useState("");
  const [detail, setDetail] = useState("");
  const [persistent, setPersistent] = useState(null);
  const modal = useRef(null);
  const registration = useRef(null);
  const working = useRef(false);
  const checkedUpdate = useRef(false);
  const removing = useRef(false);
  const previousFocus = useRef(null);

  useEffect(() => {
    return subscribeToStorage(key => {
      if (key !== KEY) return;
      if (removing.current) return;
      const preference = savedPreference();
      if (preference.preparing) { setState("downloading"); return; }
      if (!preference.enabled) { setEnabled(false); setState("off"); setAvailable(null); }
    });
  }, []);

  useEffect(() => {
    const changed = () => {
      const on = savedPreference().enabled;
      setNotice(navigator.onLine ? "You're back online." : on ? "You're offline. Everything still works." : "You're offline. Offline Mode isn't on, so some pages may not open.");
    };
    const external = event => {
      const link = event.target.closest?.("a[href]");
      if (!link || new URL(link.href).origin === location.origin || navigator.onLine) return;
      if (!/^https?:/.test(link.href)) return;
      event.preventDefault(); event.stopPropagation(); setNotice("Needs internet");
    };
    const labelLinks = () => document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (new URL(link.href).origin === location.origin) return;
      if (!navigator.onLine) {
        link.dataset.offlineLink = "true";
        link.setAttribute("aria-disabled", "true");
      } else if (link.dataset.offlineLink) {
        delete link.dataset.offlineLink;
        link.removeAttribute("aria-disabled");
      }
    });
    const connection = () => { changed(); labelLinks(); };
    labelLinks();
    const observer = new MutationObserver(labelLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    document.addEventListener("click", external, true);
    document.addEventListener("auxclick", external, true);
    document.addEventListener("contextmenu", external, true);
    return () => { observer.disconnect(); window.removeEventListener("online", connection); window.removeEventListener("offline", connection); document.removeEventListener("click", external, true); document.removeEventListener("auxclick", external, true); document.removeEventListener("contextmenu", external, true); };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let stopped = false;
    const receive = async event => {
      const data = event.data;
      if (!data?.type?.startsWith("OFFLINE_")) return;
      if (removing.current) return;
      if (data.type === "OFFLINE_PROGRESS") { setState("downloading"); setPercent(data.percent); }
      if (data.type === "OFFLINE_ERROR") {
        working.current = false;
        if (!savedPreference().enabled) { browserStorage.removeItem(KEY); registration.current?.unregister().catch(() => {}); }
        setState("error");
        setDetail(data.message === "storage" ? "There isn't enough free space on this device. Free some space and try again." : "");
      }
      if (data.type === "OFFLINE_READY") {
        working.current = false; setEnabled(true); setCopy(data); setPercent(100); setState("ready"); setAvailable(null);
        browserStorage.setItem(KEY, JSON.stringify({ enabled: true, version: data.version, bytes: data.bytes }));
      }
      if (data.type === "OFFLINE_COMPLETE") {
        working.current = false;
        setCopy(previous => previous || data);
        if (registration.current?.active) {
          setAvailable(data); setState("update");
          if (!savedPreference().enabled) {
            try { await ask(registration.current.installing || registration.current.waiting, "APPLY_UPDATE"); }
            catch { setState("error"); }
          }
        }
      }
      if (data.type === "OFFLINE_UPDATE_DEFERRED") { setAvailable(data); setState("update"); }
    };
    navigator.serviceWorker.addEventListener("message", receive);
    const restore = async () => {
      const preference = savedPreference();
      if (!preference.enabled && !preference.preparing) {
        // Clean up an interrupted opt-in without ever registering in Off mode.
        const leftover = await navigator.serviceWorker.getRegistration("/");
        if (isOfflineWorker(leftover?.active) || isOfflineWorker(leftover?.installing)) await clearOfflineCopy();
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration("/");
      if (stopped) return;
      if (preference.preparing && reg?.installing && !reg.active) { registration.current = reg; setState("downloading"); return; }
      if (!reg || !isOfflineWorker(reg.active)) { setState("error"); return; }
      registration.current = reg;
      const info = await ask(reg.active, "STATUS");
      if (stopped) return;
      if (!info.complete) { setState("error"); return; }
      setCopy(info); setEnabled(true); setState("ready");
      if (preference.preparing) browserStorage.setItem(KEY, JSON.stringify({ enabled: true, version: info.version, bytes: info.bytes }));
      if (reg.waiting) { setAvailable(await ask(reg.waiting, "STATUS")); setState("update"); }
      reg.onupdatefound = () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", async () => {
          if (worker.state === "installed" && reg.waiting) { setAvailable(await ask(reg.waiting, "STATUS")); setState("update"); }
        });
      };
      if (!checkedUpdate.current && goodConnection() && !/^\/(journey\/(interests|skills|academic)|processing)(\/|$)/.test(pathname)) { checkedUpdate.current = true; reg.update().catch(() => {}); }
    };
    restore().catch(() => { if (!stopped) setState("error"); });
    return () => { stopped = true; navigator.serviceWorker.removeEventListener("message", receive); };
  }, [pathname]);

  useEffect(() => {
    if (opened) { previousFocus.current = document.activeElement; modal.current.showModal(); }
    else if (modal.current?.open) { modal.current.close(); previousFocus.current?.focus({ preventScroll: true }); }
  }, [opened]);

  async function open() {
    setOpened(true);
    if (navigator.onLine) {
      try {
        const response = await fetch("/offline-manifest.json", { cache: "no-store", credentials: "omit" });
        if (!response.ok) return;
        const manifest = await response.json();
        const info = { version: manifest.version, bytes: manifest.bytes, resources: manifest.resources.length };
        if (enabled && copy?.version !== manifest.version) { setAvailable(info); setState("update"); }
        else if (!enabled) setCopy(info);
      } catch { /* The off panel also opens without a connection. */ }
    }
  }

  async function turnOn() {
    if (working.current) return;
    setDetail("");
    if (process.env.NODE_ENV !== "production") { setDetail("Offline Mode is available in the production version. Run the production build first."); return; }
    if (!navigator.onLine || !window.isSecureContext || !("serviceWorker" in navigator) || !("caches" in window)) { setState("error"); setDetail("Connect using HTTPS, or localhost, in a browser that supports offline storage."); return; }
    working.current = true; setState("downloading"); setPercent(0);
    try {
      setPersistent(navigator.storage?.persist ? await navigator.storage.persist() : false);
      const previous = savedPreference();
      browserStorage.setItem(KEY, JSON.stringify({ ...previous, preparing: true, enabled: !!previous.enabled }));
      // A disabled controller can remain attached until navigation. A new script
      // identity ensures opting in again installs a fresh, enabled worker.
      const reg = await navigator.serviceWorker.register(`/sw.js?opt-in=${Date.now()}`, { scope: "/", updateViaCache: "none" });
      registration.current = reg;
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "redundant") { working.current = false; setState("error"); }
        });
      });
      if (reg.active && !reg.installing) {
        const info = await ask(reg.active, "STATUS");
        if (!info.complete) throw new Error("Incomplete copy");
        setEnabled(true); setCopy(info); setState("ready"); working.current = false;
        browserStorage.setItem(KEY, JSON.stringify({ enabled: true, version: info.version, bytes: info.bytes }));
        await reg.update();
      }
    } catch { working.current = false; if (!enabled) browserStorage.removeItem(KEY); setState("error"); }
  }

  async function remove() {
    if (removing.current) return;
    removing.current = true;
    working.current = false;
    try {
      browserStorage.removeItem(KEY);
      await clearOfflineCopy();
      browserStorage.removeItem(KEY);
      registration.current = null; setEnabled(false); setAvailable(null); setState("off"); setPercent(0); setDetail("");
    } catch {
      setState("error"); setDetail("The browser couldn't remove the whole offline copy. Try Remove offline copy again.");
    } finally {
      removing.current = false;
    }
  }

  async function update() {
    const reload = () => location.reload();
    try {
      const reg = registration.current || await navigator.serviceWorker.getRegistration("/");
      if (!reg.waiting) {
        await ask(reg.active, "ALLOW_UPDATE");
        const prepared = preparedUpdate(reg);
        setState("downloading"); setPercent(0);
        await Promise.all([prepared, reg.update()]);
      }
      navigator.serviceWorker.addEventListener("controllerchange", reload, { once: true });
      const result = await ask(reg?.waiting, "APPLY_UPDATE");
      if (result.type === "OFFLINE_UPDATE_BLOCKED") { navigator.serviceWorker.removeEventListener("controllerchange", reload); setDetail("Finish or leave the assessment in every open tab before updating."); return; }
    } catch { navigator.serviceWorker.removeEventListener("controllerchange", reload); setDetail("Couldn't finish. Check your connection and try again."); }
  }

  return <OfflineContext.Provider value={{ open }}>
    {children}
    {notice && <Localized as="p" className="offline-notice" role="status" aria-live="polite">{notice}</Localized>}
    <dialog ref={modal} className={`offline-dialog ${marketingFonts}`} aria-labelledby="offline-title" onCancel={event => { event.preventDefault(); setOpened(false); }} onClick={event => { if (event.target === event.currentTarget) setOpened(false); }}>
      <Card variant="popup" className="popup-card offline-card">
        <Localized as="button" className="popup-close" aria-label="Close Offline Mode" onClick={() => setOpened(false)}>×</Localized>
        <Localized as="h2" id="offline-title">Offline Mode</Localized>
        <Localized as="p">Use Career Compass without internet. Turn this on while you&apos;re connected, and the whole system is saved on this device.</Localized>
        <Localized as="p" className="offline-state" role="status" aria-live="polite">{state === "ready" ? "Ready. Works without internet." : state === "downloading" ? `Downloading ${percent}%` : state === "error" ? "Couldn't finish. Check your connection and try again." : state === "update" ? "Update available" : "Off"}</Localized>
        {state === "downloading" && <div className="offline-progress" role="progressbar" aria-label="Offline download" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ transform: `scaleX(${percent / 100})` }} /></div>}
        {copy && <Localized as="p" className="offline-copy">About {(copy.bytes / 1048576).toFixed(1)} MB {enabled ? "on this device" : "to download"} · {copy.resources} resources<br />{enabled ? "Saved copy" : "Available copy"}: <span translate="no">{copy.version}</span></Localized>}
        {available && <Localized as="p">New copy: <span translate="no">{available.version}</span></Localized>}
        {persistent !== null && <Localized as="p">{persistent ? "This browser allowed protected storage." : "This browser may remove the offline copy when storage is low."}</Localized>}
        {detail && <Localized as="p" role="status">{detail}</Localized>}
        <div className="offline-actions">
          {(state === "off" || state === "error") && <Button label="Turn on Offline Mode" onClick={turnOn} />}
          {state === "update" && <Button label="Update now" onClick={update} />}
          {(enabled || state === "downloading") && <Button variant="secondary" label="Turn off" onClick={remove} />}
          <Button variant="secondary" label="Remove offline copy" onClick={remove} />
        </div>
      </Card>
    </dialog>
  </OfflineContext.Provider>;
}
