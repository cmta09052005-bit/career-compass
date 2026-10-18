"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Localized from "./Localized";

const STEPS = [
  { targets: ["avatar-pin"], title: "Welcome to your career map", text: "This is you. Your avatar moves by itself when you finish an assessment, so you never have to drag it." },
  { targets: ["route"], title: "Your path", text: "Finish three assessments in order: Mountains, Forest, then Valley. Fog and padlocks mean a stop is locked. They clear when your avatar arrives. A check means done. The Islands is the end, where your results are." },
  { targets: ["badges"], title: "Your badges", text: "You earn a badge for each assessment you finish. Hover over one to see what it is, or click it to open it." },
  { targets: ["main-action"], title: "Your main button", text: "This button always shows your next step: Start, then Continue, then Results. You'll press it in a moment." },
  { targets: ["locate-me", "journey-guide", "settings"], title: "Need help?", text: "Locate Me brings you back to your avatar. Journey Guide explains everything again. Settings has sound, restart and exit. You can also drag the map to look around." },
  { targets: ["avatar-pin"], title: "Ready", text: "That's it! Watch your avatar travel to the first stop. When it arrives, press Start to begin." },
];

function roundedHole({ x, y, width, height }) {
  const r = Math.min(12, width / 2, height / 2), right = x + width, bottom = y + height;
  return `M${x + r} ${y}H${right - r}Q${right} ${y} ${right} ${y + r}V${bottom - r}Q${right} ${bottom} ${right - r} ${bottom}H${x + r}Q${x} ${bottom} ${x} ${bottom - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}

// The browser's modal dialog supplies background inertness; Tab is also explicitly
// contained so focusing the heading never lets keyboard focus escape the card.
export default function AtlasTutorial({ step, replay, actionLabel, onStep, onFinish, onFlyover }) {
  const dialog = useRef(null);
  const card = useRef(null);
  const heading = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const measured = geometry !== null;
  const content = STEPS[step];
  const title = replay && step === 5 ? "All set" : content.title;
  const text = replay && step === 5 ? "Press your main button whenever you're ready." : replay && step === 3 ? `This button currently shows ${actionLabel}. It always shows your next step: Start, then Continue, then Results.` : content.text;

  useLayoutEffect(() => {
    const previous = document.activeElement;
    const modal = dialog.current;
    modal.showModal();
    return () => {
      modal.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => { if (measured) heading.current?.focus({ preventScroll: true }); }, [step, measured]);

  useEffect(() => {
    if (step !== 1) return;
    return onFlyover();
  }, [step, onFlyover]);

  useLayoutEffect(() => {
    let frame, last = "";
    let previousPlacement = null, previousViewport = "";
    const route = content.targets.includes("route") && document.querySelector('[data-tutorial-id="route"]');
    const routeLength = route ? route.getTotalLength() : 0;
    const routeSamples = route ? Array.from({ length: 201 }, (_, i) => route.getPointAtLength(routeLength * i / 200)) : [];
    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const boxes = content.targets.flatMap(id => {
        const target = document.querySelector(`[data-tutorial-id="${id}"]`);
        if (!target) return [];
        let box = (id === "avatar-pin" ? target.querySelector(".atlas-pin-silhouette") || target : target).getBoundingClientRect();
        if (id === "route") {
          // Highlight a visible section of the actual sampled trail, rather than
          // the SVG's entire offscreen world-sized bounding box.
          const svg = target.ownerSVGElement.getBoundingClientRect();
          let nearest = 0, best = Infinity;
          for (let i = 0; i < routeSamples.length; i++) {
            const p = routeSamples[i];
            const x = svg.x + p.x * svg.width / 1000, y = svg.y + p.y * svg.height / 1000;
            const error = (x - vw / 2) ** 2 + (y - vh / 2) ** 2;
            if (error < best) { best = error; nearest = i; }
          }
          const points = Array.from({ length: 15 }, (_, i) => {
            const p = routeSamples[Math.max(0, Math.min(200, nearest + i - 7))];
            return { x: svg.x + p.x * svg.width / 1000, y: svg.y + p.y * svg.height / 1000 };
          });
          box = { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
        }
        const x = Math.max(8, Math.min(vw - 52, box.left - 8));
        const y = Math.max(8, Math.min(vh - 52, box.top - 8));
        return [{ x, y, width: Math.max(44, Math.min(vw - x - 8, box.right + 8 - x)), height: Math.max(44, Math.min(vh - y - 8, box.bottom + 8 - y)) }];
      });
      const union = boxes.length ? { x: Math.min(...boxes.map(b => b.x)), y: Math.min(...boxes.map(b => b.y)), right: Math.max(...boxes.map(b => b.x + b.width)), bottom: Math.max(...boxes.map(b => b.y + b.height)) } : { x: vw / 2, y: 12, right: vw / 2, bottom: 12 };
      const sideSpace = Math.max(union.x - 28, vw - union.right - 28);
      const width = Math.min(360, vw - 24, sideSpace >= 220 ? sideSpace : Infinity);
      const maxHeight = sideSpace >= 220 ? vh - 24 : Math.min(vh - 24, Math.max(160, Math.max(union.y - 28, vh - union.bottom - 28)));
      const height = Math.min(maxHeight, card.current?.offsetHeight || 280);
      const candidates = [
        [union.right + 16, union.y], [union.x - width - 16, union.y],
        [union.x, union.bottom + 16], [union.x, union.y - height - 16],
        [12, 12], [vw - width - 12, 12], [12, vh - height - 12], [vw - width - 12, vh - height - 12],
      ].map(([x, y]) => ({ x: Math.max(12, Math.min(vw - width - 12, x)), y: Math.max(12, Math.min(vh - height - 12, y)) }));
      const overlap = p => boxes.reduce((area, b) => area + Math.max(0, Math.min(p.x + width, b.x + b.width) - Math.max(p.x, b.x)) * Math.max(0, Math.min(p.y + height, b.y + b.height) - Math.max(p.y, b.y)), 0);
      if (previousViewport !== `${vw},${vh}`) previousPlacement = null;
      // Keep navigation buttons still during the camera tour whenever their
      // current placement remains clear of the moving highlight.
      const placement = previousPlacement && previousPlacement.x + width <= vw - 12 && previousPlacement.y + height <= vh - 12 && overlap(previousPlacement) === 0 ? previousPlacement : candidates.reduce((best, p) => overlap(p) < overlap(best) ? p : best, candidates[0]);
      previousPlacement = placement;
      previousViewport = `${vw},${vh}`;
      const next = { boxes, x: placement.x, y: placement.y, width, maxHeight, vw, vh };
      const signature = JSON.stringify(next, (_, value) => typeof value === "number" ? Math.round(value * 2) / 2 : value);
      if (signature !== last) { last = signature; setGeometry(next); }
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [content]);

  function keyDown(event) {
    if (event.key === "Escape") { event.preventDefault(); onFinish(true); }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      onStep(Math.max(0, Math.min(5, step + (event.key === "ArrowRight" ? 1 : -1))));
    }
    if (event.key === "Tab") {
      const buttons = [...card.current.querySelectorAll("button:not(:disabled)")];
      const index = buttons.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); buttons[buttons.length - 1]?.focus(); }
      else if (!event.shiftKey && (index === -1 || index === buttons.length - 1)) { event.preventDefault(); buttons[0]?.focus(); }
    }
  }

  return <dialog ref={dialog} className="atlas-tutorial" aria-labelledby="atlas-tutorial-title" aria-describedby="atlas-tutorial-counter atlas-tutorial-text" onCancel={event => { event.preventDefault(); onFinish(true); }} onKeyDown={keyDown}>
    {geometry && <>
      <svg className="atlas-tutorial-shade" width={geometry.vw} height={geometry.vh} aria-hidden="true"><path fill="#1B2A4ACC" fillRule="evenodd" d={`M0 0H${geometry.vw}V${geometry.vh}H0Z${geometry.boxes.map(roundedHole).join("")}`} /></svg>
      {geometry.boxes.map((box, index) => <div key={index} className={`atlas-tutorial-ring ${step === 4 ? "is-help" : ""}`} style={{ left: box.x, top: box.y, width: box.width, height: box.height, "--tutorial-order": index }} aria-hidden="true" />)}
    </>}
    <Card ref={card} variant="popup" className="popup-card atlas-tutorial-card" style={geometry ? { left: geometry.x, top: geometry.y, width: geometry.width, maxHeight: geometry.maxHeight } : { visibility: "hidden" }}>
      <Localized as="p" id="atlas-tutorial-counter" className="atlas-tutorial-counter">TUTORIAL MODE · {step + 1} of 6</Localized>
      <Localized as="h2" id="atlas-tutorial-title" ref={heading} tabIndex={-1}>{title}</Localized>
      <Localized as="p" id="atlas-tutorial-text" aria-live="polite" aria-atomic="true">{text}{step === 0 && <Localized as="span" className="atlas-tutorial-intro">This quick tutorial shows you how everything works. You can skip it anytime.</Localized>}</Localized>
      <div className="atlas-tutorial-actions"><Button variant="secondary" label="Back" disabled={step === 0} onClick={() => onStep(step - 1)} /><Button label={step === 5 ? replay ? "Got it" : "Let's go" : "Next"} onClick={() => step === 5 ? onFinish(false) : onStep(step + 1)} /><Button variant="secondary" label="Skip" onClick={() => onFinish(true)} /></div>
    </Card>
  </dialog>;
}
