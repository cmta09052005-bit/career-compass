"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Keep a popup mounted while its shared exit transition finishes.
export default function usePopupState(initial, selector) {
  const [value, setValue] = useState(initial);
  const pending = useRef(null);
  const animation = useRef(null);
  const afterClose = useRef(null);
  useEffect(() => () => { pending.current = null; animation.current?.cancel(); }, []);
  useLayoutEffect(() => {
    const callback = afterClose.current;
    afterClose.current = null;
    if (!callback) return;
    // React has removed the popup before any dependent navigation or motion starts.
    animation.current?.cancel();
    callback();
  }, [value]);
  const setPopup = useCallback((next, onClosed) => {
    pending.current = null;
    afterClose.current = null;
    animation.current?.cancel();
    const closing = next === null || next === false || (Array.isArray(next) && !next.length);
    const element = closing && document.querySelector(selector);
    if (!element || !element.getClientRects().length) { setValue(next); onClosed?.(); return; }
    const exit = element.animate([{ opacity: getComputedStyle(element).opacity }, { opacity: 0 }], { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" });
    animation.current = exit;
    pending.current = exit;
    exit.finished.then(() => {
      if (pending.current !== exit) return;
      pending.current = null;
      afterClose.current = () => {
        const dialog = element.closest("dialog");
        if (dialog?.open) dialog.close();
        onClosed?.();
      };
      setValue(next);
    }).catch(() => {});
  }, [selector]);
  return [value, setPopup];
}
