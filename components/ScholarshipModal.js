"use client";

import Localized from "@/components/Localized";

import { useEffect, useId, useRef, useState } from "react";
import Button from "./Button";
import Card from "./Card";

export default function ScholarshipModal({ children }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeTimer = useRef(null);
  const pinned = useRef(false);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function show(pin) {
    clearTimeout(closeTimer.current);
    if (pin) {
      pinned.current = true;
      dialog.current.close();
      dialog.current.showModal();
    } else if (!dialog.current.open) dialog.current.show();
    setOpen(true);
  }

  function close() {
    clearTimeout(closeTimer.current);
    const restore = pinned.current;
    pinned.current = false;
    dialog.current.close();
    setOpen(false);
    if (restore) trigger.current.focus();
  }

  function leave() {
    clearTimeout(closeTimer.current);
    if (!pinned.current) closeTimer.current = setTimeout(close, 150);
  }

  return <div className="course-financials mt-5">
    <Button ref={trigger} label="Need help with school expenses?" variant="secondary" aria-haspopup="dialog" aria-expanded={open} onPointerEnter={(event) => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) show(false); }} onPointerLeave={leave} onClick={() => show(true)} />
    <dialog ref={dialog} className="scholarship-dialog" aria-labelledby={titleId} onPointerEnter={() => clearTimeout(closeTimer.current)} onPointerLeave={leave} onCancel={(event) => { event.preventDefault(); if (!pinned.current) close(); }}>
      <Card variant="popup" className="popup-card">
        <Localized as="button" className="popup-close" aria-label="Close scholarships" onClick={close}>×</Localized>
        <Localized as="h2" id={titleId}>Help with school expenses</Localized>
        {children}
      </Card>
    </dialog>
  </div>;
}
