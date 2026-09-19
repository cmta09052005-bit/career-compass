"use client";

import Localized from "@/components/Localized";

import { useEffect, useRef } from "react";
import usePopupState from "./usePopupState";
import Button from "@/components/Button";

export default function TrailExit({ onLeave }) {
  const dialog = useRef(null);
  const stay = useRef(null);
  const [open, setOpen] = usePopupState(false, ".trail-exit-dialog .popup-card");
  useEffect(() => { if (open) { dialog.current.showModal(); stay.current.focus(); } else dialog.current.close(); }, [open]);
  function close() { setOpen(false); }
  return <>
    <Localized as="button" type="button" className="trail-exit popup-close" aria-label="Exit trail to Atlas" onClick={() => setOpen(true)}>×</Localized>
    <dialog ref={dialog} className="trail-exit-dialog" aria-labelledby="trail-exit-title" aria-describedby="trail-exit-description" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="popup-card">
        <Localized as="button" type="button" className="popup-close" aria-label="Close dialog" onClick={close}>×</Localized>
        <Localized as="h2" id="trail-exit-title">Leave this trail?</Localized>
        <Localized as="p" id="trail-exit-description">Leaving this trail will discard your saved answers in this section.</Localized>
        <div className="popup-actions"><Button ref={stay} label="Stay" variant="secondary" onClick={close} /><Button label="Leave" onClick={() => setOpen(false, onLeave)} /></div>
      </div>
    </dialog>
  </>;
}
