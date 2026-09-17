"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import CelebrationDialog from "@/components/CelebrationDialog";
import Card from "@/components/Card";
import { soundEnabled, setSoundEnabled } from "@/lib/sound";
import usePopupState from "@/components/usePopupState";
import Toggle from "@/components/Toggle";
import { SECTION_STATUS, SESSION_STORAGE_KEY, useSessionAnswers } from "@/lib/useSessionAnswers";
import "./atlas.css";

const GUIDE_KEY = "careerCompassJourneyGuideSeen";
const EXPEDITION_KEY = "careerCompassExpeditionSeen";
const BASECAMP = { id: "basecamp", left: 8, top: 52 };
const ISLANDS = { id: "islands", left: 88, top: 63, name: "The Islands" };
const ROAD = "M80 520 C85 465 105 425 135 420 C200 405 170 565 250 565 C300 565 300 430 360 440 C435 420 410 655 500 650 C555 650 565 535 620 550 C665 550 655 665 740 660 C800 660 800 595 855 625 L880 630";

const AVATARS = ["wanderer", "trailblazer", "scout", "cartographer", "ranger", "navigator"];
const REGIONS = [
  { id: "interests", name: "The Mountains", subject: "Interests", description: "Discover what pulls you forward.", detail: "8 scenarios", icon: "mountain-peak", badge: "Wayfinder", badgeIcon: "mountain-peak", left: 36, top: 44 },
  { id: "skills", name: "The Forest", subject: "Skills", description: "Find strength in what you can do.", detail: "10 statements", icon: "pine-branch", badge: "Skillcrafter", badgeIcon: "pine-branch", left: 50, top: 65 },
  { id: "academic", name: "The Valley", subject: "Academics", description: "What you've already built matters too.", detail: "Academic details", icon: "ribbon-scroll", badge: "Scholar", badgeIcon: "ribbon-scroll", left: 62, top: 55 },
];

function regionState(index, progress) {
  if (progress[REGIONS[index].id] === SECTION_STATUS.COMPLETED) return "completed";
  return REGIONS.slice(0, index).every(({ id }) => progress[id] === SECTION_STATUS.COMPLETED) ? "active" : "locked";
}

function Icon({ name, className = "" }) {
  if (name === "lock") return <svg className={`atlas-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 10V7a5 5 0 0 1 10 0v3" /><rect x="4" y="10" width="16" height="12" rx="2" fill="#1b2a4a" /><path d="M12 14v4" /></svg>;
  // Local illustrations retain their original proportions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`atlas-icon ${className}`} src={name === "compass" ? "/landing-compass.png" : `/icons/career-compass/${name}.svg`} alt="" draggable="false" />;
}

function LocationCard({ name, eyebrow, description }) {
  return <div className="atlas-location-card"><span className="atlas-location-eyebrow">{eyebrow || "\u00a0"}</span><h2>{name}</h2><p>{description || "\u00a0"}</p></div>;
}

function Explorer({ avatarId, className = "" }) {
  const index = Math.max(0, AVATARS.indexOf(avatarId));
  return <span aria-hidden="true" className={`atlas-explorer ${className}`} style={avatarId === "navigator" ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center 25%" } : index >= 0 ? { backgroundImage: "url('/explorers.png')", backgroundPosition: `${index * 20}% 25%` } : undefined}>{index < 0 && <Icon name="compass" />}</span>;
}

export default function JourneyPage() {
  const router = useRouter();
  const { session, isReady, updateSession, resetSession } = useSessionAnswers();
  const root = useRef(null);
  const dialog = useRef(null);
  const nodes = useRef({});
  const results = useRef(null);
  const token = useRef(null);
  const trail = useRef(null);
  const mapWindow = useRef(null);
  const mapLayer = useRef(null);
  const drag = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [walking, setWalking] = useState(false);
  const [position, setPosition] = useState(null);
  const [sequenceReady, setSequenceReady] = useState(false);
  const closingBadge = useRef(false);
  const [openNode, setOpenNode] = usePopupState(null, ".atlas-popover");
  const [panel, setPanel] = usePopupState(null, ".atlas-dialog-card");
  const [sound, setSound] = useState(false);
  const [celebrate, setCelebrate] = usePopupState(false, ".atlas-expedition");
  const [badgeToast, setBadgeToast] = usePopupState([], ".atlas-badge-toast");
  const [mapSize, setMapSize] = useState({ width: 1, height: 1, viewWidth: 1, viewHeight: 1 });
  const leaving = useRef(false);
  const entering = useRef(false);
  const progress = session.journeyProgress;
  const count = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED).length;
  const complete = count === 3;
  const percent = [0, 33, 66, 100][count];
  const started = REGIONS.some(({ id }) => progress[id] !== SECTION_STATUS.NOT_STARTED);
  const next = REGIONS.findIndex((_, index) => regionState(index, progress) === "active");
  const current = position || (!started ? "basecamp" : complete ? "academic" : REGIONS[next]?.id);
  const actionReady = isReady && sequenceReady && !walking && !badgeToast.length;

  useEffect(() => {
    if (!isReady) return;
    const recover = () => {
      if (leaving.current) return;
      let missing = !session.strand;
      try { const stored = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)); missing = missing || !stored?.strand; } catch { missing = true; }
      if (missing) { leaving.current = true; router.replace("/intake?session=ended"); }
    };
    recover();
    window.addEventListener("focus", recover);
    window.addEventListener("pageshow", recover);
    return () => { window.removeEventListener("focus", recover); window.removeEventListener("pageshow", recover); };
  }, [isReady, session.strand, router]);

  useEffect(() => {
    if (!isReady || !session.strand) return;
    const timer = setTimeout(() => {
      let seen = [];
      try { seen = JSON.parse(sessionStorage.getItem("careerCompassBadgeNotices")) || []; } catch { /* Optional storage. */ }
      if (!Array.isArray(seen)) seen = [];
      const earned = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED && !seen.includes(id));
      if (earned.length) {
        setPosition(earned[0].id);
        setSequenceReady(false);
        setBadgeToast(earned);
      } else {
        const destination = complete ? "islands" : !started ? "basecamp" : REGIONS[next]?.id;
        let previous;
        try { previous = Number(sessionStorage.getItem("careerCompassAtlasPosition")); } catch { /* Optional storage. */ }
        const from = REGIONS.find((region) => region.left === previous);
        const to = complete ? ISLANDS : REGIONS[next];
        setPosition(destination);
        if (from && to && from.left < to.left) setWalking({ from, to });
        else setSequenceReady(true);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [isReady, progress, session.strand, setBadgeToast, complete, next, started]);

  function closeBadge() {
    if (closingBadge.current || !badgeToast.length) return;
    closingBadge.current = true;
    const region = badgeToast[0];
    setBadgeToast([], () => {
      try {
        let seen = JSON.parse(sessionStorage.getItem("careerCompassBadgeNotices")) || [];
        if (!Array.isArray(seen)) seen = [];
        sessionStorage.setItem("careerCompassBadgeNotices", JSON.stringify([...new Set([...seen, region.id])]));
      } catch { /* Optional storage. */ }
      closingBadge.current = false;
      if (badgeToast.length > 1) {
        setPosition(badgeToast[1].id);
        setBadgeToast(badgeToast.slice(1));
        return;
      }
      const destination = REGIONS[REGIONS.indexOf(region) + 1] || ISLANDS;
      setPosition(destination === ISLANDS ? "islands" : destination.id);
      setWalking({ from: region, to: destination });
    });
  }

  const tokenTop = current === "islands" ? ISLANDS.top : current === "basecamp" ? BASECAMP.top : REGIONS.find(({ id }) => id === current)?.top || 38;
  const tokenLeft = current === "islands" ? ISLANDS.left : current === "basecamp" ? BASECAMP.left : REGIONS.find(({ id }) => id === current)?.left || 36;
  const tokenOffset = 0;

  useEffect(() => {
    if (!walking || !token.current || !mapLayer.current) return;
    const { from, to } = walking;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mapLayer.current.offsetWidth;
    const height = mapLayer.current.offsetHeight;
    const path = trail.current;
    const length = path.getTotalLength();
    const distanceAt = (node) => {
      let nearest = 0, best = Infinity;
      for (let step = 0; step <= 1000; step++) {
        const distance = length * step / 1000, point = path.getPointAtLength(distance);
        const error = (point.x - node.left * 10) ** 2 + (point.y - node.top * 10) ** 2;
        if (error < best) { best = error; nearest = distance; }
      }
      return nearest;
    };
    const start = distanceAt(from), end = distanceAt(to);
    const frames = Array.from({ length: 61 }, (_, index) => {
      const t = index / 60;
      const point = path.getPointAtLength(start + (end - start) * t);
      // A returning explorer already at the node takes a short step into it.
      const approach = Math.abs(end - start) < 2 ? Math.sin(Math.PI * t) * 24 : 0;
      return { transform: `translate(calc(-50% + ${(point.x / 1000 - to.left / 100) * width - approach}px), calc(-50% + ${(point.y / 1000 - to.top / 100) * height}px))` };
    });
    let cancelled = false;
    const animation = token.current.animate(reduced ? [{ opacity: .6 }, { opacity: 1 }] : frames, { duration: reduced ? 200 : 2400, easing: "ease-in-out", fill: "forwards" });
    animation.finished.then(() => {
      if (cancelled) return;
      try { sessionStorage.setItem("careerCompassAtlasPosition", String(to.left)); } catch { /* Optional storage. */ }
      setWalking(false);
      setSequenceReady(true);
      if (walking.enter) {
        updateSession({ journeyProgress: { [to.id]: SECTION_STATUS.IN_PROGRESS } });
        router.push(`/journey/${to.id}`);
      } else if (to !== ISLANDS) setPanel("next");
    }).catch(() => {});
    return () => { cancelled = true; animation.cancel(); };
  }, [walking, setPanel, updateSession, router]);

  const centerOnNode = useCallback(() => {
    if (!mapWindow.current || !mapLayer.current) return;
    const node = current === "islands" ? ISLANDS : current === "basecamp" ? BASECAMP : REGIONS.find(({ id }) => id === current);
    if (!node) return;
    setCamera({ x: Math.max(mapWindow.current.clientWidth - mapLayer.current.offsetWidth, Math.min(0, mapWindow.current.clientWidth / 2 - mapLayer.current.offsetWidth * node.left / 100)), y: Math.max(mapWindow.current.clientHeight - mapLayer.current.offsetHeight, Math.min(0, (mapWindow.current.clientHeight + 100) / 2 - mapLayer.current.offsetHeight * node.top / 100)) });
  }, [current]);

  useEffect(() => {
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => ({ overflow: element.style.overflow, height: element.style.height }));
    elements.forEach((element) => { element.style.overflow = "hidden"; element.style.height = "100%"; });
    const resize = () => {
      if (!mapLayer.current || !mapWindow.current) return;
      setMapSize({ width: mapLayer.current.offsetWidth, height: mapLayer.current.offsetHeight, viewWidth: mapWindow.current.clientWidth, viewHeight: mapWindow.current.clientHeight });
      centerOnNode();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mapWindow.current);
    observer.observe(mapLayer.current);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    return () => {
      elements.forEach((element, index) => Object.assign(element.style, previous[index]));
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [centerOnNode]);

  function panStart(event) {
    if (walking || !event.isPrimary || event.button !== 0 || event.target.closest("button, a, .atlas-popover")) return;
    setOpenNode(null);
    const matrix = new DOMMatrixReadOnly(getComputedStyle(mapLayer.current).transform);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cameraX: matrix.m41, cameraY: matrix.m42 };
    setCamera({ x: matrix.m41, y: matrix.m42 });
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function panMove(event) {
    if (drag.current?.id !== event.pointerId) return;
    setCamera({ x: Math.max(mapWindow.current.clientWidth - mapLayer.current.offsetWidth, Math.min(0, drag.current.cameraX + event.clientX - drag.current.x)), y: Math.max(mapWindow.current.clientHeight - mapLayer.current.offsetHeight, Math.min(0, drag.current.cameraY + event.clientY - drag.current.y)) });
  }

  function panEnd(event) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  useEffect(() => {
    if (!isReady || !session.strand) return;
    let timer;
    let handled = false;
    let noticesReady = false;
    const showWelcome = () => {
      if (!sequenceReady || walking || !noticesReady || handled || document.querySelector(".journey-portal[open], .atlas-badge-toast")) return;
      handled = true;
      try {
        if (complete && !sessionStorage.getItem(EXPEDITION_KEY)) {
          sessionStorage.setItem(EXPEDITION_KEY, "true");
          setCelebrate(true);

        } else if (!sessionStorage.getItem(GUIDE_KEY)) setPanel("guide");
      } catch { /* Help remains accessible when session storage is unavailable. */ }
    };
    const observer = new MutationObserver(showWelcome);
    observer.observe(document.body, { childList: true, subtree: true });
    timer = setTimeout(() => { noticesReady = true; showWelcome(); }, 400);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isReady, complete, session.strand, setCelebrate, setPanel, sequenceReady, walking]);

  useEffect(() => {
    if (panel !== null && !dialog.current?.open) dialog.current?.showModal();
    if (panel === null && dialog.current?.open) dialog.current.close();
    if (panel === "exit" || panel === "restart") dialog.current?.querySelector(".atlas-confirm-actions .game-button")?.focus();
  }, [panel]);

  useEffect(() => { queueMicrotask(() => setSound(soundEnabled())); }, []);

  function closePanel() {
    if (panel === "guide") {
      try { sessionStorage.setItem(GUIDE_KEY, "true"); } catch { /* Optional storage. */ }
    }
    setPanel(null);
  }

  function enter(index) {
    if (entering.current || !actionReady || index < 0 || regionState(index, progress) !== "active") return;
    entering.current = true;
    const region = REGIONS[index];
    const from = { left: tokenLeft, top: tokenTop };
    setOpenNode(null);
    setPanel(null, () => {
      if (current === region.id) {
        updateSession({ journeyProgress: { [region.id]: SECTION_STATUS.IN_PROGRESS } });
        router.push(`/journey/${region.id}`);
        return;
      }
      setPosition(region.id);
      setWalking({ from, to: region, enter: true });
    });
  }

  function locate() {
    centerOnNode();
  }

  function toggleSound() {
    setSoundEnabled(!sound);
    setSound(!sound);
  }

  function leave(restart) {
    leaving.current = true;
    setPanel(null, () => {
    if (restart) resetSession();
    if (restart) try { ["careerCompassBadgeNotices", GUIDE_KEY, EXPEDITION_KEY, "careerCompassAtlasPosition", "careerCompassMountainsBriefing", "careerCompassForestBriefing", "careerCompassValleyBriefing", "careerCompassValleyStep"].forEach(key => sessionStorage.removeItem(key)); } catch { /* Optional storage. */ }
    router.push(restart ? "/intake" : "/");
    });
  }

  const target = complete ? ISLANDS : REGIONS[next] || REGIONS[2];
  const targetX = camera.x + mapSize.width * target.left / 100;
  const targetY = camera.y + mapSize.height * target.top / 100 - 88;
  const offscreen = targetX < 0 || targetX > mapSize.viewWidth || targetY < 0 || targetY > mapSize.viewHeight;
  const edgeAngle = Math.atan2(targetY - mapSize.viewHeight / 2, targetX - mapSize.viewWidth / 2) * 180 / Math.PI;
  const earnedRegion = typeof panel === "number" ? REGIONS[panel] : null;

  return (
    <main ref={root} className="explorer-map-screen atlas-page" onPointerDownCapture={(event) => { if (!event.target.closest(".atlas-popover, .atlas-marker")) setOpenNode(null); }}>
      <header className="atlas-nameplate" aria-label="Your explorer profile">
        <div className="atlas-identity">
          <div className="atlas-name"><Explorer avatarId={session.avatarId} /><span>{session.nickname || "Explorer"}</span></div>
          <div className="atlas-progress-row"><div className="atlas-progress" role="progressbar" aria-label="Your Compass, journey mapped" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div><span className="atlas-percent">{percent}%</span></div>
          <div className="atlas-badges">{REGIONS.map((region, index) => <button key={region.id} className={`atlas-badge ${progress[region.id] === SECTION_STATUS.COMPLETED ? "earned" : ""}`} onClick={() => progress[region.id] === SECTION_STATUS.COMPLETED && setPanel(index)} aria-label={`${region.badge}: ${progress[region.id] === SECTION_STATUS.COMPLETED ? "earned, view badge" : "not yet earned"}`} data-tooltip={progress[region.id] === SECTION_STATUS.COMPLETED ? `${region.badge} earned` : `Finish ${region.name} to earn this.`}><Icon name="wax-seal-frame" /><Icon className="atlas-badge-fill" name={progress[region.id] === SECTION_STATUS.COMPLETED ? region.badgeIcon : region.icon} /></button>)}</div><p className="atlas-mapped-caption">{count} of 3 regions mapped</p><button className="atlas-list-link" onClick={() => setPanel("list")}>View as list</button>
        </div>
      </header>
      <nav className="atlas-utilities" aria-label="Map tools">
        <button onClick={() => setPanel("settings")} className="atlas-utility" aria-label="Settings" disabled={!isReady}><span><Icon name="settings-gear" /></span><small>Settings</small></button>
        <button onClick={locate} className="atlas-utility" aria-label="Locate Me" disabled={!isReady}><span><Icon name="flag-marker-pin" /></span><small>Locate Me</small></button>
        <button onClick={() => setPanel("guide")} className="atlas-utility" aria-label="Journey Guide" disabled={!isReady}><span><Icon name="question-mark" /></span><small>Journey Guide</small></button>
      </nav>
      <section ref={mapWindow} className={`atlas-window ${dragging ? "is-dragging" : ""}`} aria-label="Journey map, drag to explore" tabIndex={0} onPointerDown={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd} onLostPointerCapture={panEnd}>
        <div ref={mapLayer} className="atlas-canvas" style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0)` }}>
          <div className="atlas-cartography" aria-hidden="true" />
          <svg className="atlas-trail" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path ref={trail} d={ROAD} /></svg>
          <div className="atlas-basecamp atlas-location" style={{ left: `${BASECAMP.left}%`, top: `${BASECAMP.top}%` }}><Icon name="explorer-backpack" /><LocationCard name="Basecamp" eyebrow="YOUR STARTING POINT" description="Explorer profile complete ✓" /></div>
          <div ref={token} className="atlas-you atlas-token" style={{ visibility: position ? "visible" : "hidden", left: `${tokenLeft}%`, top: `calc(${tokenTop}% + ${tokenOffset}px)` }}><Explorer avatarId={session.avatarId} /><span>You are here</span></div>
          {REGIONS.map((region, index) => {
            const state = regionState(index, progress);
            return <div key={region.id} className={`atlas-marker atlas-location ${state} ${state === "active" && badgeToast.length ? "just-unlocked" : ""}`} style={{ left: `${region.left}%`, top: `${region.top}%` }}>
              <button ref={(element) => { nodes.current[region.id] = element; }} className="atlas-region-art" aria-label={`${region.name}, ${state}`} aria-expanded={state === "active" ? undefined : openNode === index} onClick={() => state === "active" ? enter(index) : setOpenNode(index)} onPointerLeave={event => { if (event.pointerType === "mouse" && !event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); }} onBlur={event => { if (!event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); }} onPointerEnter={(event) => { if (state !== "active" && event.pointerType === "mouse" && !drag.current) setOpenNode(index); }} onFocus={() => { if (state !== "active") setOpenNode(index); }}><Icon name={region.icon} /><span>{String(index + 1).padStart(2, "0")}</span></button>
              <LocationCard name={region.name} description={region.description} />
            </div>;
          })}
          <div className={`atlas-summit atlas-marker atlas-location ${complete ? "active revealed" : "locked"}`} style={{ left: `${ISLANDS.left}%`, top: `${ISLANDS.top}%` }}><button className="atlas-region-art" aria-label={`The Islands, ${complete ? "ready" : "locked"}`} onClick={() => complete && actionReady ? router.push("/processing") : setOpenNode("islands")} onPointerLeave={event => { if (event.pointerType === "mouse" && !event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); }} onBlur={event => { if (!event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); }} onPointerEnter={(event) => { if (!complete && event.pointerType === "mouse" && !drag.current) setOpenNode("islands"); }} onFocus={() => { if (!complete) setOpenNode("islands"); }}><Icon name="island-flag" /></button><LocationCard name="The Islands" eyebrow="BEYOND THE THREE REGIONS" description={complete ? "Your path is ready to reveal." : "Your next horizon is waiting."} /></div>

        </div>
        {typeof openNode === "number" && <Card variant="popup" className="atlas-popover popup-card" role="dialog" aria-labelledby="atlas-node-title" onPointerEnter={() => setOpenNode(openNode)} onPointerLeave={event => { if (event.pointerType === "mouse") setOpenNode(null); }} onKeyDown={(event) => { if (event.key === "Escape") setOpenNode(null); }} style={{ left: `clamp(12px, calc(${REGIONS[openNode].left / 100} * max(180vw, 1800px) + ${camera.x}px - 160px), calc(100vw - 332px))`, top: `clamp(12px, calc(${REGIONS[openNode].top / 100} * max(125vh, 800px) + ${camera.y}px + 65px), calc(100dvh - 245px))` }}>
          <button className="atlas-close" aria-label="Close region details" onClick={() => setOpenNode(null)}>×</button>
          <p className="atlas-eyebrow">REGION {String(openNode + 1).padStart(2, "0")} · {REGIONS[openNode].subject}</p>
          <h2 id="atlas-node-title">{REGIONS[openNode].name}</h2><p className="atlas-description">{REGIONS[openNode].description}</p><span className="atlas-detail">{REGIONS[openNode].detail}</span>
          <button className="atlas-node-action" disabled={!isReady || regionState(openNode, progress) === "locked"} onClick={() => regionState(openNode, progress) === "completed" ? setPanel(openNode) : enter(openNode)}>{regionState(openNode, progress) === "completed" ? `✓ Complete · ${REGIONS[openNode].badge}` : regionState(openNode, progress) === "locked" ? `Locked, finish ${REGIONS[openNode - 1].name} first.` : `Enter ${REGIONS[openNode].name} →`}</button>
        </Card>}
      </section>
      {openNode === "islands" && <Card variant="popup" className="atlas-popover popup-card" role="dialog" aria-labelledby="islands-info-title" onPointerEnter={() => setOpenNode("islands")} onPointerLeave={event => { if (event.pointerType === "mouse") setOpenNode(null); }} style={{ position: "fixed", right: 16, top: "35%", zIndex: 20 }} onKeyDown={(event) => { if (event.key === "Escape") setOpenNode(null); }}><button className="atlas-close" aria-label="Close region details" onClick={() => setOpenNode(null)}>×</button><p className="atlas-eyebrow">BEYOND THE THREE REGIONS</p><h2 id="islands-info-title">The Islands</h2><p className="atlas-description">This is where your results will appear. Complete The Mountains, The Forest, and The Valley to reveal your paths.</p></Card>}
      <p className="atlas-session">No account needed · Progress stays in this tab until you close it</p>
      <nav className="atlas-actions" aria-label="Assessment actions">
        {!complete && <button className="atlas-round-action primary" disabled={!actionReady} onClick={() => enter(next)}><span className="atlas-action-disc"><Icon name="compass" /></span><span>{started ? "Continue" : "Start Assessment"}<b aria-hidden="true">→</b></span></button>}
        <button ref={results} className={`atlas-round-action ${complete ? "primary" : "is-locked"}`} disabled={!actionReady || !complete} onClick={() => router.push("/processing")} aria-label={complete ? "View My Results" : "Results locked, complete all three regions"}><span className="atlas-action-disc"><Icon name="island-flag" />{!complete && <span className="atlas-lock"><Icon name="lock" /></span>}</span><span>{walking && complete ? "Walking to The Islands…" : complete ? "View My Results" : "Results locked"}</span></button>
      </nav>
      {isReady && offscreen && <button className="atlas-edge-arrow" aria-label={`Locate ${target.name}`} onClick={locate} style={{ left: Math.max(22, Math.min(mapSize.viewWidth - 22, targetX)), top: Math.max(22, Math.min(mapSize.viewHeight - 22, targetY)) }}><span aria-hidden="true" style={{ transform: `rotate(${edgeAngle}deg)` }}>➜</span></button>}
      {badgeToast.length > 0 && <CelebrationDialog key={badgeToast[0].id} className="atlas-badge-toast" autoDismissMs={3200} theme={{ interests: "wind", skills: "leaves", academic: "paper" }[badgeToast[0].id]} title={badgeToast[0].badge} eyebrow="Achievement unlocked" description={`${badgeToast[0].name} complete`} icon={<Icon name={badgeToast[0].badgeIcon} />} onClose={closeBadge} />}
      <span className="atlas-scroll-hint" aria-hidden="true">DRAG TO EXPLORE ↔</span>
      <p className="sr-only" aria-live="polite">{percent}% mapped. {complete ? "All regions complete. Results unlocked." : `${REGIONS[next]?.name || "The Mountains"} is your next region.`}</p>
      {celebrate && <CelebrationDialog className="atlas-expedition" major title="Full Expedition!" description="All three regions explored. Your path is ready." icon={<Icon name="sunburst" />} onClose={() => setCelebrate(false)} actionLabel="View My Results" onAction={() => setCelebrate(false, () => router.push("/processing"))} />}
      <dialog ref={dialog} className="atlas-dialog" data-popup-key={panel} aria-labelledby="atlas-dialog-title" onCancel={(event) => { event.preventDefault(); closePanel(); }} onClick={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        <Card key={panel} variant="popup" className="atlas-dialog-card popup-card">
          <button className="atlas-close" aria-label="Close dialog" onClick={closePanel}>×</button>
          <Icon className="atlas-dialog-icon" name={(panel === "next" ? REGIONS[next]?.icon : earnedRegion?.badgeIcon) || (panel === "settings" ? "settings-gear" : panel === "guide" ? "question-mark" : "compass")} />
          {panel === "next" && REGIONS[next] && <><p className="atlas-eyebrow">NEXT REGION UNLOCKED</p><h2 id="atlas-dialog-title">{REGIONS[next].name}</h2><p>Finish {REGIONS[next].name} to earn the {REGIONS[next].badge} badge.</p><Button label="Continue" onClick={() => enter(next)} /></>}
          {panel === "guide" && <><p className="atlas-eyebrow">JOURNEY GUIDE</p><h2 id="atlas-dialog-title">Welcome to The Atlas</h2><ul className="atlas-guide-steps"><li><Icon name="ribbon-scroll" /><span>This is your map. Drag it left or right to look around.</span></li><li><Icon name="mountain-peak" /><span>Finish regions in order: Mountains, then Forest, then Valley.</span></li><li><Icon name="sunburst" /><span>A glowing region means it&apos;s ready. Tap it to start.</span></li><li><Icon name="flag-marker-pin" /><span>Lost? Tap Locate Me anytime to find your spot again.</span></li></ul><div className="atlas-guide-path">Mountains <span>···</span> Forest <span>···</span> Valley</div><Button label="Got it" onClick={closePanel} /></>}
          {panel === "list" && <><p className="atlas-eyebrow">YOUR REGIONS</p><h2 id="atlas-dialog-title">Journey list</h2><ul className="atlas-region-list">{REGIONS.map((region, index) => { const state = regionState(index, progress); return <li key={region.id}><div><strong>{region.name}</strong><span>{state === "active" ? "Ready" : state === "completed" ? "Done" : "Locked"}</span></div><Button label={state === "completed" ? "View badge" : state === "locked" ? "Locked" : "Enter region"} disabled={state === "locked" || !isReady} onClick={() => state === "completed" ? setPanel(index) : enter(index)} /></li>; })}</ul></>}
          {panel === "settings" && <><p className="atlas-eyebrow">YOUR SESSION</p><h2 id="atlas-dialog-title">Journey Settings</h2><Toggle label="Sound" enabled={sound} onClick={toggleSound} className="atlas-sound" /><div className="atlas-language"><span>Language</span><strong>English</strong></div><p className="atlas-setting-note">Filipino translation is planned for a future version.</p><div className="atlas-settings-actions"><button className="atlas-danger" onClick={() => setPanel("restart")}>Restart Assessment</button><button className="atlas-danger" onClick={() => setPanel("exit")}>Exit</button></div></>}
          {(panel === "restart" || panel === "exit") && <><p className="atlas-eyebrow">BEFORE YOU GO</p><h2 id="atlas-dialog-title">{panel === "restart" ? "Restart your journey?" : "Leave The Atlas?"}</h2><p>{panel === "restart" ? "This clears everything and can't be undone." : "Your progress stays in this tab. Use Continue Your Journey on Home to return."}</p><div className="atlas-confirm-actions"><Button label={panel === "exit" ? "Stay" : "Keep Going"} autoFocus variant="secondary" onClick={closePanel} /><button className="atlas-danger" onClick={() => leave(panel === "restart")}>{panel === "restart" ? "Restart" : "Leave"}</button></div></>}
          {earnedRegion && <><p className="atlas-eyebrow">BADGE EARNED: {earnedRegion.badge}</p><h2 id="atlas-dialog-title">{earnedRegion.name}, Complete</h2><p>View only, this leg of the journey is already mapped.</p><Button label="Back to The Atlas" onClick={closePanel} /></>}
        </Card>
      </dialog>
    </main>
  );
}
