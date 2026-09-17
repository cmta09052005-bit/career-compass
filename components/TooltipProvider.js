"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// One parchment tooltip for every short hover/focus hint in the app.
export default function TooltipProvider() {
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
      const element = event.target.closest?.("[data-tooltip]");
      if (!element || element === owner) return;
      hide();
      owner = element;
      previous = element.getAttribute("aria-describedby");
      element.setAttribute("aria-describedby", [previous, "compass-tooltip"].filter(Boolean).join(" "));
      const bounds = element.getBoundingClientRect();
      const width = Math.min(240, window.innerWidth - 24);
      setHint({ text: element.dataset.tooltip, left: Math.max(12, Math.min(window.innerWidth - width - 12, bounds.left + bounds.width / 2 - width / 2)), top: bounds.bottom + 8, above: bounds.bottom > window.innerHeight - 100, bottom: window.innerHeight - bounds.top + 8, width });
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
  }, []);
  return hint && createPortal(<span id="compass-tooltip" role="tooltip" className="compass-tooltip" style={{ left: hint.left, width: hint.width, ...(hint.above ? { bottom: hint.bottom } : { top: hint.top }) }}>{hint.text}</span>, document.body);
}
