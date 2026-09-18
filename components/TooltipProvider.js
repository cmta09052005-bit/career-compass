"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Native browser hints are limited to desktop/tablet controls without text labels.
export default function TooltipProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const titles = new Map();
    const selector = "button[aria-label], a[aria-label], [data-tooltip]";
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
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      for (const element of titles.keys()) restore(element);
    };
  }, [pathname]);
  return null;
}
