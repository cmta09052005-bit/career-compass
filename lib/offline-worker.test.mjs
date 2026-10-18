import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/offline-worker.js", import.meta.url), "utf8");
function harness({ version = "A", stores = new Map(), failure = false, clientPath = "/", offline = false, connection, active = false, quota = false } = {}) {
  const listeners = {}, messages = [];
  const manifest = {
    version, bytes: 4,
    resources: [
      { url: "/snapshot.html", key: "/", type: "page", bytes: 1 },
      { url: "/payload.rsc", key: "/payload.rsc", type: "rsc", bytes: 1 },
      { url: "/image.png", key: "/image.png", type: "asset", bytes: 1 },
      { url: "/offline.html", key: "/offline.html", type: "asset", bytes: 1 },
    ], routes: { "/": { rsc: "/payload.rsc", segments: {} } },
  };
  const caches = {
    keys: async () => [...stores.keys()], delete: async key => stores.delete(key),
    open: async key => {
      if (!stores.has(key)) stores.set(key, new Map());
      const entries = stores.get(key);
      return {
        put: async (url, response) => { if (quota && url === "/image.png") { const error = new Error("Full"); error.name = "QuotaExceededError"; throw error; } entries.set(url, response.clone()); },
        match: async url => entries.get(url)?.clone(),
      };
    },
    match: async (url, options) => stores.get(options.cacheName)?.get(url)?.clone(),
  };
  const self = {
    OFFLINE_MANIFEST: manifest, location: { origin: "https://test.local" },
    navigator: { connection }, registration: { active },
    clients: { matchAll: async () => [{ url: `https://test.local${clientPath}`, postMessage: message => messages.push(message) }], claim: async () => {} },
    addEventListener: (name, callback) => { listeners[name] = callback; },
    skipWaiting: async () => { self.skipped = true; },
  };
  vm.runInNewContext(source, { self, caches, URL, Response, Headers, AbortController, fetch: async url => { if (offline || (failure && url === "/image.png")) throw new Error("No connection"); return new Response(`body:${url}`); } });
  const dispatch = async (name, extra = {}) => {
    let promise, response;
    listeners[name]({ waitUntil: p => { promise = p; }, respondWith: p => { response = p; }, ...extra });
    if (promise) await promise;
    return response ? await response : undefined;
  };
  const fetchRequest = (pathname, headers = {}, mode = "navigate") => dispatch("fetch", { request: { url: `https://test.local${pathname}`, method: "GET", headers: new Headers(headers), mode } });
  return { self, stores, messages, dispatch, fetchRequest };
}

test("offline pages, RSC and optimized image requests resolve entirely from the completed copy", async () => {
  const installed = harness();
  await installed.dispatch("install"); await installed.dispatch("activate");
  const offline = harness({ stores: installed.stores, offline: true });
  assert.equal(await (await offline.fetchRequest("/?step=2")).text(), "body:/snapshot.html");
  const rsc = await offline.fetchRequest("/?_rsc=random", { RSC: "1" }, "cors");
  assert.equal(rsc.headers.get("content-type"), "text/x-component");
  assert.equal(await rsc.text(), "body:/payload.rsc");
  assert.equal(await (await offline.fetchRequest("/_next/image?url=%2Fimage.png&w=640&q=75", {}, "cors")).text(), "body:/image.png");
  assert.equal(await (await offline.fetchRequest("/not-saved")).text(), "body:/offline.html");
  assert.equal(await offline.fetchRequest("/api/results", {}, "cors"), undefined);
});

test("a failed replacement is removed while the ready previous build survives", async () => {
  const a = harness(); await a.dispatch("install"); await a.dispatch("activate");
  const b = harness({ version: "B", stores: a.stores, failure: true });
  await assert.rejects(b.dispatch("install"));
  assert.equal(a.stores.has("career-compass-offline-A"), true);
  assert.equal(a.stores.has("career-compass-offline-B"), false);
});

test("old builds survive preparation and are deleted only after the complete replacement activates", async () => {
  const a = harness(); await a.dispatch("install"); await a.dispatch("activate");
  const b = harness({ version: "B", stores: a.stores }); await b.dispatch("install");
  assert.equal(b.stores.size, 2);
  await b.dispatch("activate");
  assert.deepEqual([...b.stores.keys()], ["career-compass-offline-B"]);
});

test("an update is blocked by any assessment client, and disabling stops interception", async () => {
  const h = harness({ clientPath: "/journey/interests" }); await h.dispatch("install");
  let reply;
  await h.dispatch("message", { data: { type: "APPLY_UPDATE" }, ports: [{ postMessage: message => { reply = message; } }] });
  assert.equal(reply.type, "OFFLINE_UPDATE_BLOCKED"); assert.equal(h.self.skipped, undefined);
  await h.dispatch("message", { data: { type: "DISABLE" }, ports: [] });
  assert.equal(await h.fetchRequest("/"), undefined);
  assert.equal(h.stores.size, 0);
});

test("limited connections defer background downloads but an explicit update is allowed", async () => {
  const a = harness(); await a.dispatch("install"); await a.dispatch("activate");
  const b = harness({ version: "B", stores: a.stores, active: true, connection: { effectiveType: "2g" } });
  await assert.rejects(b.dispatch("install"));
  assert.equal(b.stores.has("career-compass-offline-B"), false);
  assert.equal(b.messages.at(-1).type, "OFFLINE_UPDATE_DEFERRED");
  await a.dispatch("message", { data: { type: "ALLOW_UPDATE" }, ports: [] });
  await b.dispatch("install");
  assert.equal(b.stores.has("career-compass-offline-B"), true);
});

test("quota failures roll back and cross-origin or POST requests are never intercepted", async () => {
  const h = harness({ quota: true });
  await assert.rejects(h.dispatch("install"));
  assert.equal(h.stores.size, 0);
  assert.equal(h.messages.at(-1).message, "storage");
  for (const request of [{ url: "https://external.test/image.png", method: "GET" }, { url: "https://test.local/", method: "POST" }]) {
    assert.equal(await h.dispatch("fetch", { request }), undefined);
  }
});
