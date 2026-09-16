"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Keep a popup mounted while its shared exit transition finishes.
export default function usePopupState(initial, selector) {
  const [value, setValue] = useState(initial);
  const pending = useRef(null);
  const animation = useRef(null);
  useEffect(() => () => { clearTimeout(pending.current); animation.current?.cancel(); }, []);
  const setPopup = useCallback((next, onClosed) => {
    clearTimeout(pending.current);
    animation.current?.cancel();
    const closing = next === null || next === false || (Array.isArray(next) && !next.length);
    const element = closing && document.querySelector(selector);
    if (!element) { setValue(next); onClosed?.(); return; }
    animation.current = element.animate([{ opacity: getComputedStyle(element).opacity }, { opacity: 0 }], { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" });
    pending.current = setTimeout(() => { setValue(next); animation.current?.cancel(); onClosed?.(); }, 200);
  }, [selector]);
  return [value, setPopup];
}
