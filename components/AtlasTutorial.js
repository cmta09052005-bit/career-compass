"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Localized from "./Localized";

const STOPS = [
  "1 of 4 · The Mountains. Answer 8 questions about your interests.",
  "2 of 4 · The Forest. Rate 15 skill statements.",
  "3 of 4 · The Valley. Complete 4 steps, including certificates & achievements.",
  "4 of 4 · The Islands. See your top 5 matches and explore all 85 courses.",
];
const STEPS = [
  { targets: ["avatar-pin"], title: "Welcome to your career map", text: "This is you. Your avatar moves by itself when you finish an assessment, so you never have to drag it." },
  { targets: [], title: "Your path" },
  { targets: ["profile"], title: "Your profile", text: "This is your explorer profile. Your portrait and name are here. The bar fills as you earn badges. Each seal below is one badge, one for every stop. Hover over one to see what it is, or click it to open it." },
  { targets: ["main-action"], title: "Your main button", text: "This button always shows your next step: Start, then Continue, then Results. You'll press it in a moment." },
  { targets: ["locate-me", "journey-guide", "settings"], title: "Need help?", text: "Locate Me brings you back to your avatar. Journey Guide explains everything again. Settings has sound, restart and exit. You can also drag the map to look around." },
  { targets: ["avatar-pin"], title: "Ready", text: "That's it! Watch your avatar travel to the first stop. When it arrives, press Start to begin." },
];

function roundedHole({ x, y, width, height }) {
  const r = Math.min(12, width / 2, height / 2), right = x + width, bottom = y + height;
  return `M${x + r} ${y}H${right - r}Q${right} ${y} ${right} ${y + r}V${bottom - r}Q${right} ${bottom} ${right - r} ${bottom}H${x + r}Q${x} ${bottom} ${x} ${bottom - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}

function targetBox(id) {
  const target = document.querySelector(`[data-tutorial-id="${id}"]`);
  if (!target) return null;
  const elements = id.startsWith("stop-") ? [...target.querySelectorAll(".atlas-region-art, .atlas-location-card")] : [id === "avatar-pin" ? target.querySelector(".atlas-pin-silhouette") || target : target];
  const rects = elements.map(element => element.getBoundingClientRect());
  return { left: Math.min(...rects.map(b => b.left)), right: Math.max(...rects.map(b => b.right)), top: Math.min(...rects.map(b => b.top)), bottom: Math.max(...rects.map(b => b.bottom)) };
}

// Wait for the rendered camera, including reduced-motion snaps and interrupted
// transitions. Callers own cancellation; no late callback may advance a new run.
function cameraSettled(signal) {
  return new Promise(resolve => {
    let last = "", stable = 0, frames = 0;
    const tick = () => {
      if (signal.aborted) { resolve(false); return; }
      const canvas = document.querySelector(".atlas-canvas");
      const value = canvas && getComputedStyle(canvas).transform;
      const moving = canvas?.getAnimations().some(animation => animation.playState === "running");
      stable = !moving && value === last ? stable + 1 : 0;
      last = value;
      if (++frames > 3 && stable >= 3) resolve(true);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function travelDot(from, to, signal) {
  const path = document.querySelector('[data-tutorial-id="route"]');
  if (!path || from === to) return () => {};
  const length = path.getTotalLength();
  const nearest = index => {
    const marker = document.querySelector(`[data-tutorial-id="stop-${index}"]`);
    const x = parseFloat(marker.style.left) * 10, y = parseFloat(marker.style.top) * 10;
    let best = 0, error = Infinity;
    for (let i = 0; i <= 1000; i++) {
      const p = path.getPointAtLength(length * i / 1000), distance = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (distance < error) { best = length * i / 1000; error = distance; }
    }
    return best;
  };
  const start = nearest(from), end = nearest(to);
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("class", "atlas-tour-dot");
  dot.setAttribute("r", "5");
  path.parentElement.appendChild(dot);
  let frame, began;
  const tick = now => {
    if (signal.aborted) { dot.remove(); return; }
    began ??= now;
    const fraction = Math.min(1, (now - began) / 1200);
    const p = path.getPointAtLength(start + (end - start) * fraction);
    dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y);
    if (fraction < 1) frame = requestAnimationFrame(tick);
    else dot.remove();
  };
  frame = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(frame); dot.remove(); };
}

export default function AtlasTutorial({ step, replay, actionLabel, onStep, onFinish, onFlyover }) {
  const dialog = useRef(null), card = useRef(null), heading = useRef(null);
  const walk = useRef(null), run = useRef(null), held = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const measured = geometry !== null;
  const [stop, setStop] = useState(0);
  const [settledStop, setSettledStop] = useState(null);
  const [progress, setProgress] = useState(0);
  const [resizeVersion, setResizeVersion] = useState(0);
  const advance = useRef(onStep);
  useLayoutEffect(() => { advance.current = onStep; });
  const content = STEPS[step];
  const title = replay && step === 5 ? "All set" : content.title;
  const text = step === 1 ? STOPS[stop] : replay && step === 5 ? "Press your main button whenever you're ready." : replay && step === 3 ? `This button currently shows ${actionLabel}. It always shows your next step: Start, then Continue, then Results.` : content.text;

  useLayoutEffect(() => {
    const previous = document.activeElement, modal = dialog.current;
    modal.showModal();
    return () => { modal.close(); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);

  useLayoutEffect(() => { if (measured) heading.current?.focus({ preventScroll: true }); }, [step, measured]);

  function cancelWalk() {
    run.current?.abort();
    held.current = null;
    walk.current?.restore();
  }

  function navigate(next, finish = false, skipped = false) {
    cancelWalk();
    if (next === 1) { setStop(0); setSettledStop(null); }
    setGeometry(previous => previous && { ...previous, boxes: [] });
    if (finish) onFinish(skipped);
    else onStep(next);
  }

  useEffect(() => {
    if (step !== 1) return;
    const controller = onFlyover();
    walk.current = controller;
    return () => { run.current?.abort(); held.current = null; controller.restore(); walk.current = null; };
  }, [step, onFlyover]);

  useEffect(() => {
    if (step !== 1) return;
    const abort = new AbortController();
    run.current = abort;
    let frame, clearDot = () => {};
    const begin = async () => {
      setSettledStop(null); setProgress(0);
      // Let the fixed card finish layout before the existing centering function
      // scores its reserved space. Only the text changes during the four stops.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (abort.signal.aborted) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced && held.current !== null) clearDot = travelDot(held.current, stop, abort.signal);
      walk.current?.move(stop, reduced);
      if (!await cameraSettled(abort.signal)) return;
      clearDot();
      held.current = stop;
      setSettledStop(stop);
      let began;
      const tick = now => {
        if (abort.signal.aborted) return;
        began ??= now;
        const fraction = Math.min(1, (now - began) / 2500);
        setProgress(fraction);
        if (fraction < 1) frame = requestAnimationFrame(tick);
        else if (stop < 3) setStop(stop + 1);
        else {
          setSettledStop(null);
          walk.current?.restore();
          cameraSettled(abort.signal).then(ready => { if (ready) advance.current(2); });
        }
      };
      frame = requestAnimationFrame(tick);
    };
    begin();
    const resize = () => { abort.abort(); clearDot(); setSettledStop(null); setProgress(0); setResizeVersion(value => value + 1); };
    window.addEventListener("resize", resize);
    return () => { abort.abort(); cancelAnimationFrame(frame); clearDot(); window.removeEventListener("resize", resize); };
  }, [step, stop, onFlyover, resizeVersion]);

  useLayoutEffect(() => {
    let frame, last = "", previousTransform = "", stable = 0;
    let previousPlacement = null, previousViewport = "";
    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const canvas = document.querySelector(".atlas-canvas");
      const transform = canvas && getComputedStyle(canvas).transform;
      const moving = canvas?.getAnimations().some(animation => animation.playState === "running");
      stable = !moving && transform === previousTransform ? stable + 1 : 0;
      previousTransform = transform;
      const ids = step === 1 ? settledStop === stop ? [`stop-${stop}`] : [] : content.targets;
      const boxes = stable < 3 ? [] : ids.flatMap(id => {
        const box = targetBox(id);
        if (!box || box.right <= 0 || box.bottom <= 0 || box.left >= vw || box.top >= vh) return [];
        const x = Math.max(8, box.left - 8), y = Math.max(8, box.top - 8);
        const width = Math.min(vw - x - 8, box.right + 8 - x), height = Math.min(vh - y - 8, box.bottom + 8 - y);
        if (step === 1 && width * height > vw * vh / 3) return [];
        return [{ x, y, width, height }];
      });
      const union = boxes.length ? { x: Math.min(...boxes.map(b => b.x)), y: Math.min(...boxes.map(b => b.y)), right: Math.max(...boxes.map(b => b.x + b.width)), bottom: Math.max(...boxes.map(b => b.y + b.height)) } : { x: vw / 2, y: 12, right: vw / 2, bottom: 12 };
      const sideSpace = Math.max(union.x - 28, vw - union.right - 28);
      const width = step === 1 ? Math.min(480, vw - 24) : Math.min(360, vw - 24, sideSpace >= 220 ? sideSpace : Infinity);
      const maxHeight = step === 1 ? Math.min(300, vh * .48) : sideSpace >= 220 ? vh - 24 : Math.min(vh - 24, Math.max(160, Math.max(union.y - 28, vh - union.bottom - 28)));
      const height = step === 1 ? maxHeight : Math.min(maxHeight, card.current?.offsetHeight || 280);
      const candidates = [
        [union.right + 16, union.y], [union.x - width - 16, union.y],
        [union.x, union.bottom + 16], [union.x, union.y - height - 16],
        [12, 12], [vw - width - 12, 12], [12, vh - height - 12], [vw - width - 12, vh - height - 12],
      ].map(([x, y]) => ({ x: Math.max(12, Math.min(vw - width - 12, x)), y: Math.max(12, Math.min(vh - height - 12, y)) }));
      const overlap = p => boxes.reduce((area, b) => area + Math.max(0, Math.min(p.x + width, b.x + b.width) - Math.max(p.x, b.x)) * Math.max(0, Math.min(p.y + height, b.y + b.height) - Math.max(p.y, b.y)), 0);
      if (previousViewport !== `${vw},${vh}`) previousPlacement = null;
      let placement = previousPlacement && overlap(previousPlacement) === 0 ? previousPlacement : candidates.reduce((best, p) => overlap(p) < overlap(best) ? p : best, candidates[0]);
      if (step === 1) {
        const x = (vw - width) / 2;
        const action = document.querySelector('[data-tutorial-id="main-action"]')?.getBoundingClientRect();
        const bottom = action && action.right + 12 > x && action.left - 12 < x + width ? Math.max(12, vh - action.top + 12) : 12;
        placement = { x, y: Math.max(12, vh - bottom - height) };
      }
      previousPlacement = placement; previousViewport = `${vw},${vh}`;
      const next = { boxes, x: placement.x, y: placement.y, width, maxHeight, vw, vh, height: step === 1 ? height : undefined };
      const signature = JSON.stringify(next, (_, value) => typeof value === "number" ? Math.round(value * 2) / 2 : value);
      if (signature !== last) { last = signature; setGeometry(next); }
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [content, step, settledStop, stop]);

  function back() {
    if (step === 1 && stop > 0) { cancelWalk(); setSettledStop(null); setStop(stop - 1); }
    else navigate(Math.max(0, step - 1));
  }

  function keyDown(event) {
    if (event.key === "Escape") { event.preventDefault(); navigate(step, true, true); }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      if (event.key === "ArrowLeft") back();
      else if (step < 5) navigate(step + 1);
    }
    if (event.key === "Tab") {
      const buttons = [...card.current.querySelectorAll("button:not(:disabled)")];
      const index = buttons.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); buttons[buttons.length - 1]?.focus(); }
      else if (!event.shiftKey && (index === -1 || index === buttons.length - 1)) { event.preventDefault(); buttons[0]?.focus(); }
    }
  }

  return <dialog ref={dialog} className={`atlas-tutorial ${step === 1 ? "is-path" : ""}`} aria-labelledby="atlas-tutorial-title" aria-describedby="atlas-tutorial-counter atlas-tutorial-text" onCancel={event => { event.preventDefault(); navigate(step, true, true); }} onKeyDown={keyDown}>
    {geometry && <>
      <svg className="atlas-tutorial-shade" width={geometry.vw} height={geometry.vh} aria-hidden="true"><path fill={step === 1 ? "#1B2A4A66" : "#1B2A4ACC"} fillRule="evenodd" d={`M0 0H${geometry.vw}V${geometry.vh}H0Z${geometry.boxes.map(roundedHole).join("")}`} /></svg>
      {geometry.boxes.map((box, index) => <div key={index} data-tutorial-stop={step === 1 ? settledStop : undefined} className={`atlas-tutorial-ring ${step === 4 ? "is-help" : ""}`} style={{ left: box.x, top: box.y, width: box.width, height: box.height, "--tutorial-order": index }} aria-hidden="true" />)}
    </>}
    <Card ref={card} variant="popup" className="popup-card atlas-tutorial-card" style={geometry ? { left: geometry.x, top: geometry.y, width: geometry.width, height: geometry.height, maxHeight: geometry.maxHeight } : { visibility: "hidden" }}>
      <Localized as="p" id="atlas-tutorial-counter" className="atlas-tutorial-counter">TUTORIAL MODE · {step + 1} of 6</Localized>
      <Localized as="h2" id="atlas-tutorial-title" ref={heading} tabIndex={-1}>{title}</Localized>
      <div className="atlas-tutorial-copy"><Localized as="p" id="atlas-tutorial-text" aria-live="polite" aria-atomic="true">{text}{step === 0 && <Localized as="span" className="atlas-tutorial-intro">This quick tutorial shows you how everything works. You can skip it anytime.</Localized>}</Localized>
      {step === 1 && <Localized as="p" className="atlas-tutorial-lock-note">Fog and padlocks mean a stop is locked. They clear when your avatar arrives. A check means done.</Localized>}</div>
      {step === 1 && <div className="atlas-tutorial-stop-progress" aria-label={`Stop ${stop + 1} of 4`}><span className="atlas-tutorial-dots" aria-hidden="true">{STOPS.map((_, index) => <span key={index} className={index === stop ? "is-current" : ""} />)}</span><svg width="24" height="24" viewBox="0 0 24 24" role="progressbar" aria-label="Time until next stop" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><circle cx="12" cy="12" r="9" fill="none" stroke="#1B2A4A" strokeWidth="2" /><circle cx="12" cy="12" r="9" fill="none" stroke="#D4A017" strokeWidth="3" pathLength="1" strokeDasharray={`${progress} 1`} transform="rotate(-90 12 12)" /></svg></div>}
      <div className="atlas-tutorial-actions"><Button variant="secondary" label="Back" disabled={step === 0} onClick={back} /><Button label={step === 5 ? replay ? "Got it" : "Let's go" : "Next"} onClick={() => navigate(step + 1, step === 5)} /><Button variant="secondary" label="Skip" onClick={() => navigate(step, true, true)} /></div>
    </Card>
  </dialog>;
}
