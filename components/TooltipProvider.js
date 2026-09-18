"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Native hints remain limited to desktop/tablet controls without text labels.
export default function TooltipProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const titles = new Map();
    const selector = "button[aria-label], a[aria-label], [data-tooltip]";
    // Explicit hints share this provider; native hints elsewhere stay unchanged.
    const hint = document.createElement("div");
    hint.id = "plain-control-tooltip";
    hint.role = "tooltip";
    Object.assign(hint.style, { position: "fixed", zIndex: "1000", background: "black", color: "white", padding: ".35rem .5rem", font: "12px/1.4 sans-serif", maxWidth: "calc(100vw - 16px)", pointerEvents: "none" });
    let active = null;
    let touch = false;
    const hide = () => {
      if (active) active.removeAttribute("aria-describedby");
      active = null;
      hint.remove();
    };
    const show = element => {
      hide();
      active = element;
      hint.textContent = element.dataset.plainTooltip;
      document.body.append(hint);
      element.setAttribute("aria-describedby", hint.id);
      const rect = element.getBoundingClientRect();
      hint.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - hint.offsetWidth - 8))}px`;
      hint.style.top = `${rect.bottom + hint.offsetHeight + 8 < innerHeight ? rect.bottom + 6 : rect.top - hint.offsetHeight - 6}px`;
    };
    const over = event => {
      const element = event.target.closest("[data-plain-tooltip]");
      if (event.pointerType === "mouse" && element && active !== element) { touch = false; show(element); }
    };
    const out = event => { if (!touch && active && !active.contains(event.relatedTarget)) hide(); };
    const down = event => {
      const element = event.target.closest("[data-plain-tooltip]");
      touch = event.pointerType !== "mouse";
      if (touch && element) {
        if (active === element) hide(); else show(element);
      } else if (!element) hide();
    };
    const click = event => {
      const element = event.target.closest("[data-plain-tooltip]");
      if (element?.dataset.tooltipAction === "activate") { hide(); return; }
      if (touch && element) { event.preventDefault(); event.stopPropagation(); }
    };
    const key = event => { if (event.key === "Escape") hide(); };
    const focus = event => {
      const element = event.target.closest("[data-plain-tooltip]");
      if (!touch && element) show(element);
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("click", click, true);
    document.addEventListener("keydown", key);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", out);
    window.addEventListener("scroll", hide, true);
    const restore = element => {
      const original = titles.get(element);
      if (original === null) element.removeAttribute("title");
      else element.setAttribute("title", original);
      titles.delete(element);
    };
    const sync = () => {
      const eligible = new Set();
      if (desktop.matches) {
        document.querySelectorAll(selector).forEach(element => {
          if (element.hasAttribute("data-plain-tooltip")) return;
          if (!element.matches("button, a[href], input, [role='button'], [role='switch']")) return;
          if (/[\p{L}\p{N}]/u.test((element.innerText || "").trim())) return;
          const text = element.dataset.tooltip || element.getAttribute("aria-label");
          if (!text) return;
          eligible.add(element);
          if (!titles.has(element)) titles.set(element, element.getAttribute("title"));
          if (element.getAttribute("title") !== text) element.setAttribute("title", text);
        });
      }
      for (const element of titles.keys()) {
        if (!eligible.has(element)) restore(element);
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "data-tooltip", "class", "hidden"] });
    sync();
    const resize = () => { hide(); sync(); };
    window.addEventListener("resize", resize);
    return () => {
      hide();
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("click", click, true);
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", out);
      window.removeEventListener("scroll", hide, true);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      for (const element of titles.keys()) restore(element);
    };
  }, [pathname]);
  return null;
}
