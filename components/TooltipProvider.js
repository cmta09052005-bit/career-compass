"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

// One parchment tooltip for every short hover/focus hint in the app.
export default function TooltipProvider() {
  const pathname = usePathname();
  const [hint, setHint] = useState(null);
  useEffect(() => {
    let owner;
    let previous;
    const hide = () => {
      if (owner) {
        if (previous) owner.setAttribute("aria-describedby", previous);
        else owner.removeAttribute("aria-describedby");
      }
      owner = null;
      setHint(null);
    };
    const show = event => {
      if (event.type === "pointerover" && (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover)").matches)) return;
      const element = event.target.closest?.("[data-tooltip], button[aria-label], a[aria-label]");
      if (!element || element.closest(".trail-screen, .atlas-region-art")) { hide(); return; }
      const iconOnly = !/[\p{L}\p{N}]/u.test(element.textContent.trim());
      const text = element.dataset.tooltip || (iconOnly ? element.getAttribute("aria-label") : "");
      if (!text) { hide(); return; }
      if (element === owner) return;
      hide();
      owner = element;
      previous = element.getAttribute("aria-describedby");
      element.setAttribute("aria-describedby", [previous, "compass-tooltip"].filter(Boolean).join(" "));
      const bounds = element.getBoundingClientRect();
      const width = Math.min(240, window.innerWidth - 24);
      setHint({ text, left: Math.max(12, Math.min(window.innerWidth - width - 12, bounds.left + bounds.width / 2 - width / 2)), top: bounds.bottom + 8, above: bounds.bottom > window.innerHeight - 100, bottom: window.innerHeight - bounds.top + 8, width });
    };
    const leave = event => { if (owner?.contains(event.target) && !owner.contains(event.relatedTarget)) hide(); };
    const key = event => { if (event.key === "Escape") hide(); };
    document.addEventListener("pointerover", show);
    document.addEventListener("focusin", show);
    document.addEventListener("pointerout", leave);
    document.addEventListener("focusout", leave);
    document.addEventListener("keydown", key);
    document.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", show);
      document.removeEventListener("focusin", show);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("focusout", leave);
      document.removeEventListener("keydown", key);
      document.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [pathname]);
  return hint && createPortal(<span ref={element => element?.showPopover?.()} popover="manual" id="compass-tooltip" role="tooltip" className="compass-tooltip" style={{ margin: 0, inset: "auto", left: hint.left, width: hint.width, ...(hint.above ? { bottom: hint.bottom } : { top: hint.top }) }}>{hint.text}</span>, document.body);
}
