"use client";

import { useEffect, useId, useRef } from "react";
import Card from "./Card";
import Button from "./Button";
import CelebrationEffects from "./CelebrationEffects";
import "./celebrations.css";

export default function CelebrationDialog({ title, description, eyebrow, icon, major = false, theme, autoDismissMs = 0, className = "", onClose, actionLabel = "Continue", onAction = onClose }) {
  const dialog = useRef(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = setTimeout(() => close.current(), autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs]);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className="celebration-dialog" data-celebration="true" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <Card variant="popup" className={`popup-card popup-win celebration-card ${major ? "celebration-grand" : ""} ${className}`}>
      <button className="popup-close" aria-label="Close celebration" onClick={onClose}>×</button>
      <CelebrationEffects major={major} theme={theme}>{icon}</CelebrationEffects>
      {eyebrow && <p className="atlas-eyebrow">{eyebrow}</p>}
      <h2 id={titleId}>{title}</h2><p id={descriptionId}>{description}</p>
      {!autoDismissMs && <Button label={actionLabel} onClick={onAction} />}
    </Card>
  </dialog>;
}
