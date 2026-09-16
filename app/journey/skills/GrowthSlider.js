"use client";

import { useRef } from "react";

export const CONFIDENCE_LABELS = ["Not really me", "A little", "Somewhat", "Mostly", "Definitely me"];

export function Plant({ stage }) {
  return <svg viewBox="0 0 120 130" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="60" cy="116" rx="35" ry="5" fill="#536645" opacity=".1" stroke="none" />
    <path d="M31 116q29-5 58 0" stroke="#7d7853" />
    {stage === 1 ? <><ellipse cx="60" cy="107" rx="7" ry="5" fill="#b59b62" /><path d="M60 105q-3-9 4-13" /></> : <>
      <path d={`M60 113 Q55 83 60 ${stage === 2 ? 77 : stage === 3 ? 58 : 35}`} />
      <path d="M59 96Q35 98 34 76q25 0 25 20Z" fill="#8baf6d" /><path d="M38 80l20 16" strokeWidth="1" />
      {stage >= 3 && <><path d="M58 82Q84 84 88 61q-25-2-30 21Z" fill="#91b86e" /><path d="M83 66L59 82" strokeWidth="1" /></>}
      {stage >= 4 && <><path d="M59 62Q37 65 35 45q20-2 24 17Z" fill="#6e995b" /><path d="M61 53Q80 51 81 37q-15-2-20 16Z" fill="#91b86e" /></>}
      {stage === 4 && <path d="M60 37q-12-13 0-20 12 7 0 20Z" fill="#c3c67c" />}
      {stage === 5 && <g className="forest-flower" stroke="#a47c37" strokeWidth="1.3">
        {[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cx="60" cy="19" rx="7" ry="11" transform={`rotate(${angle} 60 30)`} fill="#e9c76c" />)}
        <circle cx="60" cy="30" r="6" fill="#bd8d37" />
      </g>}
    </>}
  </svg>;
}

export function stageAtPointer(clientX, left, width) {
  return Math.max(1, Math.min(5, Math.round(((clientX - left) / width - .1) * 5) + 1));
}

export default function GrowthSlider({ value, disabled, onChange, onCommit, labelledBy, confirming }) {
  const dragging = useRef(null);
  const stage = Number.isFinite(value) ? value : null;
  const label = stage === null ? "Slide or tap to show how confident you feel." : CONFIDENCE_LABELS[stage - 1];
  function choose(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = stageAtPointer(event.clientX, bounds.left, bounds.width);
    onChange(next);
    return next;
  }
  function pointerDown(event) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    dragging.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    choose(event);
  }
  function pointerUp(event) {
    if (dragging.current !== event.pointerId) return;
    const next = choose(event);
    dragging.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onCommit?.(next);
  }
  function keyDown(event) {
    if (disabled) return;
    const next = { ArrowLeft: stage === null ? 1 : stage - 1, ArrowDown: stage === null ? 1 : stage - 1, ArrowRight: stage === null ? 1 : stage + 1, ArrowUp: stage === null ? 1 : stage + 1, Home: 1, End: 5 }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      onChange(Math.max(1, Math.min(5, next)));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (stage !== null) {
        onChange(stage);
        onCommit?.(stage);
      }
    }
  }
  return <div className="forest-growth" data-confirming={confirming}>
    <details className="forest-help"><summary aria-label="Confidence level">?</summary><p>This is about how sure you feel doing this, not how good you already are.</p></details>
    <output className="forest-growth-label" data-unanswered={stage === null} aria-live="polite">{label}</output>
    <div className="forest-growth-slider" role="slider" data-control="slider" tabIndex={disabled ? -1 : 0} aria-labelledby={labelledBy} aria-valuemin={1} aria-valuemax={5} aria-valuenow={stage ?? 1} aria-valuetext={label} aria-disabled={disabled}
      onPointerDown={pointerDown} onPointerMove={event => { if (dragging.current === event.pointerId && !disabled) choose(event); }} onPointerUp={pointerUp}
      onPointerCancel={() => { dragging.current = null; }} onLostPointerCapture={() => { dragging.current = null; }} onKeyDown={keyDown}>
      {[1, 2, 3, 4, 5].map(number => <span className="forest-growth-stage" data-stage={number} data-selected={number === stage} key={number}><Plant stage={number} /><span>{number}</span></span>)}
    </div>
  </div>;
}
