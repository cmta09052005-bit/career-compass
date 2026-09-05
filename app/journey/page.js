"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Toggle from "@/components/Toggle";
import { SECTION_STATUS, SESSION_STORAGE_KEY, useSessionAnswers } from "@/lib/useSessionAnswers";
import "./atlas.css";

gsap.registerPlugin(useGSAP);
const GUIDE_KEY = "careerCompassJourneyGuideSeen";
const EXPEDITION_KEY = "careerCompassExpeditionSeen";
const AVATARS = ["wanderer", "trailblazer", "scout", "cartographer", "ranger", "navigator"];
const REGIONS = [
  { id: "interests", name: "The Mountains", subject: "Interests", description: "Discover what pulls you forward.", detail: "8 scenarios", icon: "mountain-peak", badge: "Wayfinder", badgeIcon: "compass", left: 36, top: 50 },
  { id: "skills", name: "The Forest", subject: "Skills", description: "Find strength in what you can do.", detail: "10 statements", icon: "pine-branch", badge: "Skillcrafter", badgeIcon: "pine-branch", left: 57, top: 50 },
  { id: "academic", name: "The Valley", subject: "Academics", description: "What you've already built matters too.", detail: "Academic details", icon: "ribbon-scroll", badge: "Scholar", badgeIcon: "ribbon-scroll", left: 78, top: 50 },
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

function Explorer({ avatarId, className = "" }) {
  const index = Math.max(0, AVATARS.indexOf(avatarId));
  return <span aria-hidden="true" className={`atlas-explorer ${className}`} style={index >= 0 ? { backgroundImage: "url('/explorers.png')", backgroundPosition: `${index * 20}% 25%` } : undefined}>{index < 0 && <Icon name="compass" />}</span>;
}

export default function JourneyPage() {
  const router = useRouter();
  const { session, isReady, updateSession, resetSession } = useSessionAnswers();
  const root = useRef(null);
  const dialog = useRef(null);
  const nodes = useRef({});
  const results = useRef(null);
  const audio = useRef(null);
  const token = useRef(null);
  const mapWindow = useRef(null);
  const mapLayer = useRef(null);
  const drag = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [openNode, setOpenNode] = useState(null);
  const [panel, setPanel] = useState(null);
  const [sound, setSound] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [badgeToast, setBadgeToast] = useState([]);
  const [mapSize, setMapSize] = useState({ width: 1, height: 1, viewWidth: 1, viewHeight: 1 });
  const leaving = useRef(false);
  const progress = session.journeyProgress;
  const count = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED).length;
  const complete = count === 3;
  const percent = [0, 33, 66, 100][count];
  const started = REGIONS.some(({ id }) => progress[id] !== SECTION_STATUS.NOT_STARTED);
  const next = REGIONS.findIndex((_, index) => regionState(index, progress) === "active");
  const current = !started ? "basecamp" : complete ? "academic" : REGIONS[next]?.id;

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
    let timer;
    const show = () => {
      let seen = [];
      try { seen = JSON.parse(sessionStorage.getItem("careerCompassBadgeNotices")) || []; } catch { /* Optional storage. */ }
      if (!Array.isArray(seen)) seen = [];
      const earned = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED && !seen.includes(id));
      if (!earned.length) return;
      setBadgeToast(earned);
      try { sessionStorage.setItem("careerCompassBadgeNotices", JSON.stringify([...seen, ...earned.map(({ id }) => id)])); } catch { /* Optional storage. */ }
      timer = setTimeout(() => setBadgeToast([]), 6000);
    };
    timer = setTimeout(show, 350);
    return () => clearTimeout(timer);
  }, [isReady, progress, session.strand]);

  const tokenLeft = current === "basecamp" ? 18 : REGIONS.find(({ id }) => id === current)?.left || 36;

  useEffect(() => {
    if (!isReady || !token.current) return;
    let animation;
    try {
      const previous = Number(sessionStorage.getItem("careerCompassAtlasPosition")) || tokenLeft;
      if (previous < tokenLeft && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const delta = (previous - tokenLeft) / 100 * mapLayer.current.offsetWidth;
        animation = token.current.animate([{ transform: `translate(calc(-50% + ${delta}px), -50%)` }, { transform: "translate(-50%, -50%)" }], { duration: 500, easing: "cubic-bezier(0.77, 0, 0.175, 1)" });
      }
      sessionStorage.setItem("careerCompassAtlasPosition", String(tokenLeft));
    } catch { /* The token still works without storage. */ }
    return () => animation?.cancel();
  }, [isReady, tokenLeft]);

  const centerOnNode = useCallback(() => {
    if (!mapWindow.current || !mapLayer.current) return;
    const node = current === "basecamp" ? { left: 18, top: 50 } : { left: [36, 57, 78][REGIONS.findIndex(({ id }) => id === current)], top: 50 };
    setCamera({ x: Math.max(mapWindow.current.clientWidth - mapLayer.current.offsetWidth, Math.min(0, mapWindow.current.clientWidth / 2 - mapLayer.current.offsetWidth * node.left / 100)), y: Math.max(mapWindow.current.clientHeight - mapLayer.current.offsetHeight, Math.min(0, mapWindow.current.clientHeight / 2 - mapLayer.current.offsetHeight * node.top / 100)) });
  }, [current]);

  useEffect(() => {
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => ({ overflow: element.style.overflow, height: element.style.height }));
    elements.forEach((element) => { element.style.overflow = "hidden"; element.style.height = "100%"; });
    const resize = () => {
      setPortrait(window.innerWidth < 768 && window.innerHeight > window.innerWidth);
      setMapSize({ width: mapLayer.current.offsetWidth, height: mapLayer.current.offsetHeight, viewWidth: mapWindow.current.clientWidth, viewHeight: mapWindow.current.clientHeight });
      centerOnNode();
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    return () => {
      elements.forEach((element, index) => Object.assign(element.style, previous[index]));
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [centerOnNode]);

  function panStart(event) {
    if (!event.isPrimary || event.button !== 0 || event.target.closest("button, a, .atlas-popover")) return;
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
    const showWelcome = () => {
      if (handled || document.querySelector(".journey-portal[open]")) return;
      handled = true;
      try {
        if (complete && !sessionStorage.getItem(EXPEDITION_KEY)) {
          sessionStorage.setItem(EXPEDITION_KEY, "true");
          setCelebrate(true);
          timer = setTimeout(() => setCelebrate(false), 3200);
        } else if (!sessionStorage.getItem(GUIDE_KEY)) setPanel("guide");
      } catch { /* Help remains accessible when session storage is unavailable. */ }
    };
    const observer = new MutationObserver(showWelcome);
    observer.observe(document.body, { childList: true, subtree: true });
    timer = setTimeout(showWelcome, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isReady, complete, session.strand]);

  useEffect(() => {
    if (panel !== null && !dialog.current?.open) dialog.current?.showModal();
    if (panel === null && dialog.current?.open) dialog.current.close();
  }, [panel]);

  useEffect(() => {
    const silence = () => {
      if (!audio.current) return;
      if (document.hidden) audio.current.suspend();
      else if (sound) audio.current.resume().catch(() => {});
    };
    document.addEventListener("visibilitychange", silence);
    return () => document.removeEventListener("visibilitychange", silence);
  }, [sound]);
  useEffect(() => () => { audio.current?.close(); }, []);

  useGSAP(() => {
    if (panel === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".atlas-dialog-card", { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.23, ease: "power2.out" });
  }, { scope: root, dependencies: [panel], revertOnUpdate: true });

  function closePanel() {
    if (panel === "guide") {
      try { sessionStorage.setItem(GUIDE_KEY, "true"); } catch { /* Optional storage. */ }
    }
    setPanel(null);
  }

  function enter(index) {
    if (!isReady || index < 0 || regionState(index, progress) !== "active") return;
    const region = REGIONS[index];
    updateSession({ journeyProgress: { [region.id]: SECTION_STATUS.IN_PROGRESS } });
    router.push(`/journey/${region.id}`);
  }

  function locate() {
    centerOnNode();
  }

  async function toggleSound() {
    try {
      if (!audio.current) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        const context = new Audio();
        audio.current = context;
        const gain = context.createGain();
        gain.gain.value = 0.012;
        gain.connect(context.destination);
        [174.61, 261.63, 349.23].forEach((frequency) => {
          const oscillator = context.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          oscillator.connect(gain);
          oscillator.start();
        });
      }
      if (sound) await audio.current.suspend();
      else await audio.current.resume();
      setSound(!sound);
      setAudioError("");
    } catch { setAudioError("Sound is unavailable in this browser."); }
  }

  function leave(restart) {
    leaving.current = true;
    resetSession();
    try { sessionStorage.removeItem("careerCompassBadgeNotices"); sessionStorage.removeItem(GUIDE_KEY); sessionStorage.removeItem(EXPEDITION_KEY); sessionStorage.removeItem("careerCompassAtlasPosition"); } catch { /* Optional storage. */ }
    router.push(restart ? "/intake" : "/");
  }

  const target = REGIONS[next] || REGIONS[2];
  const targetX = camera.x + mapSize.width * target.left / 100;
  const targetY = camera.y + mapSize.height * target.top / 100 - 88;
  const offscreen = targetX < 0 || targetX > mapSize.viewWidth || targetY < 0 || targetY > mapSize.viewHeight;
  const edgeAngle = Math.atan2(targetY - mapSize.viewHeight / 2, targetX - mapSize.viewWidth / 2) * 180 / Math.PI;
  const earnedRegion = typeof panel === "number" ? REGIONS[panel] : null;

  return (
    <main ref={root} className={`explorer-map-screen atlas-page ${portrait ? "is-portrait" : ""}`} onPointerDownCapture={(event) => { if (!event.target.closest(".atlas-popover, .atlas-marker")) setOpenNode(null); }}>
      <header className="atlas-nameplate" aria-label="Your explorer profile">
        <button className="atlas-home" onClick={() => setPanel("exit")} aria-label="Exit to Home"><Icon name="compass" /></button>
        <div className="atlas-identity">
          <div className="atlas-name"><Explorer avatarId={session.avatarId} /><span>{session.nickname || "Explorer"}</span></div>
          <div className="atlas-progress-row"><div className="atlas-progress" role="progressbar" aria-label="Your Compass — journey mapped" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div><span className="atlas-percent">{percent}%</span></div>
          <div className="atlas-badges">{REGIONS.map((region, index) => <button key={region.id} className={`atlas-badge ${progress[region.id] === SECTION_STATUS.COMPLETED ? "earned" : ""}`} onClick={() => progress[region.id] === SECTION_STATUS.COMPLETED && setPanel(index)} aria-label={`${region.badge}: ${progress[region.id] === SECTION_STATUS.COMPLETED ? "earned, view badge" : "not yet earned"}`} title={`Finish ${region.name} to earn this.`}><Icon name="wax-seal-frame" /><Icon className="atlas-badge-fill" name={progress[region.id] === SECTION_STATUS.COMPLETED ? region.badgeIcon : region.icon} /><span className="atlas-badge-tooltip" role="tooltip">{progress[region.id] === SECTION_STATUS.COMPLETED ? `${region.badge} earned` : `Finish ${region.name} to earn this.`}</span></button>)}</div><p className="atlas-mapped-caption">{count} of 3 regions mapped</p><button className="atlas-list-link" onClick={() => setPanel("list")}>View as list</button>
        </div>
      </header>
      <nav className="atlas-utilities" aria-label="Map tools">
        <button onClick={() => setPanel("settings")} className="atlas-utility" aria-label="Settings" disabled={!isReady}><span><Icon name="settings-gear" /></span><small>Settings</small></button>
        <button onClick={locate} className="atlas-utility" aria-label="Locate Me" disabled={!isReady}><span><Icon name="flag-marker-pin" /></span><small>Locate Me</small></button>
        <button onClick={() => setPanel("guide")} className="atlas-utility" aria-label="Journey Guide" disabled={!isReady}><span><Icon name="magnifying-glass" /></span><small>Journey Guide</small></button>
      </nav>
      <section ref={mapWindow} className={`atlas-window ${dragging ? "is-dragging" : ""}`} aria-label="Journey map — drag to explore" tabIndex={0} onPointerDown={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd} onLostPointerCapture={panEnd}>
        <div ref={mapLayer} className="atlas-canvas" style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0)` }}>
          <div className="atlas-cartography" aria-hidden="true" />
          <svg className="atlas-trail" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M180 500 L360 500 L570 500 L780 500 L920 500" /></svg>
          <div className="atlas-basecamp"><div><span className="atlas-eyebrow">YOUR STARTING POINT</span><h2>Basecamp</h2><p>Explorer profile complete ✓</p></div></div>
          <div ref={token} className="atlas-you atlas-token" style={{ left: `${tokenLeft}%`, top: "50%" }}><Explorer avatarId={session.avatarId} /><span>You are here</span></div>
          {REGIONS.map((region, index) => {
            const state = regionState(index, progress);
            return <div key={region.id} className={`atlas-marker ${state}`} style={{ left: `${region.left}%`, top: `${region.top}%` }}>
              <button ref={(element) => { nodes.current[region.id] = element; }} className="atlas-region-art" aria-label={`${region.name} — ${state}`} aria-expanded={openNode === index} onClick={() => setOpenNode(index)} onPointerEnter={(event) => { if (event.pointerType === "mouse" && !drag.current) setOpenNode(index); }} onFocus={() => setOpenNode(index)}><Icon name={region.icon} /><span>{String(index + 1).padStart(2, "0")}</span></button>
              <span className="atlas-marker-label">{region.name}</span>
            </div>;
          })}
          <div className={`atlas-summit ${complete ? "revealed" : ""}`}><Icon name="mountain-peak" /><p className="atlas-eyebrow">BEYOND THE THREE REGIONS</p><h2>The Summit</h2><p>{complete ? "Your path is ready to reveal." : "Your next horizon is waiting."}</p></div>
          <p className="atlas-session">No account needed · Nothing is saved · Session ends when you close this tab</p>
        </div>
        {openNode !== null && <Card className="atlas-popover" role="dialog" aria-labelledby="atlas-node-title" onKeyDown={(event) => { if (event.key === "Escape") setOpenNode(null); }} style={{ left: `clamp(12px, calc(${REGIONS[openNode].left / 100} * max(180vw, 1800px) + ${camera.x}px - 160px), calc(100vw - 332px))`, top: `clamp(12px, calc(.5 * max(125vh, 800px) + ${camera.y}px + 65px), calc(100dvh - 245px))` }}>
          <button className="atlas-close" aria-label="Close region details" onClick={() => setOpenNode(null)}>×</button>
          <p className="atlas-eyebrow">REGION {String(openNode + 1).padStart(2, "0")} · {REGIONS[openNode].subject}</p>
          <h2 id="atlas-node-title">{REGIONS[openNode].name}</h2><p className="atlas-description">{REGIONS[openNode].description}</p><span className="atlas-detail">{REGIONS[openNode].detail}</span>
          <button className="atlas-node-action" disabled={!isReady || regionState(openNode, progress) === "locked"} onClick={() => regionState(openNode, progress) === "completed" ? setPanel(openNode) : enter(openNode)}>{regionState(openNode, progress) === "completed" ? `✓ Complete · ${REGIONS[openNode].badge}` : regionState(openNode, progress) === "locked" ? `Locked — finish ${REGIONS[openNode - 1].name} first.` : `Enter ${REGIONS[openNode].name} →`}</button>
        </Card>}
      </section>
      <nav className="atlas-actions" aria-label="Assessment actions">
        {!complete && <button className="atlas-round-action primary" disabled={!isReady} onClick={() => enter(next)}><span className="atlas-action-disc"><Icon name="explorer-backpack" /></span><span>{started ? "Continue" : "Start Assessment"}<b aria-hidden="true">→</b></span></button>}
        <button ref={results} className={`atlas-round-action ${complete ? "primary" : "is-locked"}`} disabled={!isReady || !complete} onClick={() => router.push("/processing")} aria-label={complete ? "View My Results" : "Results locked — complete all three regions"}><span className="atlas-action-disc"><Icon name="island-flag" />{!complete && <span className="atlas-lock"><Icon name="lock" /></span>}</span><span>{complete ? "View My Results" : "Results locked"}</span></button>
      </nav>
      {isReady && offscreen && <button className="atlas-edge-arrow" aria-label={`Locate ${target.name}`} onClick={locate} style={{ left: Math.max(22, Math.min(mapSize.viewWidth - 22, targetX)), top: Math.max(22, Math.min(mapSize.viewHeight - 22, targetY)) }}><span aria-hidden="true" style={{ transform: `rotate(${edgeAngle}deg)` }}>➜</span></button>}
      {badgeToast.length > 0 && <div className="atlas-badge-toast" role="status">{badgeToast.map((region) => <p key={region.id}>Badge Unlocked — {region.badge}</p>)}<button aria-label="Dismiss badge notification" onClick={() => setBadgeToast([])}>×</button></div>}
      <span className="atlas-scroll-hint" aria-hidden="true">DRAG TO EXPLORE ↔</span>
      <p className="sr-only" aria-live="polite">{percent}% mapped. {complete ? "All regions complete. Results unlocked." : `${REGIONS[next]?.name || "The Mountains"} is your next region.`}</p>
      {celebrate && <div className="atlas-expedition" role="status"><Icon name="sunburst" /><h2>Full Expedition!</h2><p>All three regions explored. Your path is ready.</p><button onClick={() => setCelebrate(false)}>Continue →</button></div>}
      <dialog ref={dialog} className="atlas-dialog" aria-labelledby="atlas-dialog-title" onCancel={(event) => { event.preventDefault(); closePanel(); }} onClick={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        <Card className="atlas-dialog-card">
          <button className="atlas-close" aria-label="Close dialog" onClick={closePanel}>×</button>
          <Icon className="atlas-dialog-icon" name={earnedRegion?.badgeIcon || (panel === "settings" ? "settings-gear" : "compass")} />
          {panel === "guide" && <><p className="atlas-eyebrow">JOURNEY GUIDE</p><h2 id="atlas-dialog-title">Welcome to The Atlas</h2><ul className="atlas-guide-steps"><li><span aria-hidden="true">🗺</span><span>This is your map. Drag it left or right to look around.</span></li><li><span aria-hidden="true">🔓</span><span>Finish regions in order: Mountains, then Forest, then Valley.</span></li><li><span aria-hidden="true">✨</span><span>A glowing region means it's ready. Tap it to start.</span></li><li><span aria-hidden="true">🧭</span><span>Lost? Tap Locate Me anytime to find your spot again.</span></li></ul><div className="atlas-guide-path">Mountains <span>···</span> Forest <span>···</span> Valley</div><Button label="Got it" onClick={closePanel} /></>}
          {panel === "list" && <><p className="atlas-eyebrow">YOUR REGIONS</p><h2 id="atlas-dialog-title">Journey list</h2><ul className="atlas-region-list">{REGIONS.map((region, index) => { const state = regionState(index, progress); return <li key={region.id}><div><strong>{region.name}</strong><span>{state === "active" ? "Ready" : state === "completed" ? "Done" : "Locked"}</span></div><Button label={state === "completed" ? "View badge" : state === "locked" ? "Locked" : "Enter region"} disabled={state === "locked" || !isReady} onClick={() => state === "completed" ? setPanel(index) : enter(index)} /></li>; })}</ul></>}
          {panel === "settings" && <><p className="atlas-eyebrow">YOUR SESSION</p><h2 id="atlas-dialog-title">Journey Settings</h2><Toggle label="Sound" enabled={sound} onClick={toggleSound} className="atlas-sound" />{audioError && <p role="status">{audioError}</p>}<div className="atlas-language"><span>Language</span><strong>English</strong></div><p className="atlas-setting-note">Filipino translation is planned for a future version.</p><button className="atlas-danger" onClick={() => setPanel("restart")}>Restart Assessment</button></>}
          {(panel === "restart" || panel === "exit") && <><p className="atlas-eyebrow">BEFORE YOU GO</p><h2 id="atlas-dialog-title">{panel === "restart" ? "Restart your journey?" : "Leave your journey?"}</h2><p>{panel === "restart" ? "This clears everything and can't be undone." : "This clears everything you've entered so far. Since nothing is saved, this can't be undone."}</p><div className="atlas-confirm-actions"><Button label="Keep Going" variant="secondary" onClick={closePanel} /><button className="atlas-danger" onClick={() => leave(panel === "restart")}>{panel === "restart" ? "Restart" : "Exit to Home"}</button></div></>}
          {earnedRegion && <><p className="atlas-eyebrow">BADGE EARNED: {earnedRegion.badge}</p><h2 id="atlas-dialog-title">{earnedRegion.name} — Complete</h2><p>View only — this leg of the journey is already mapped.</p><Button label="Back to The Atlas" onClick={closePanel} /></>}
        </Card>
      </dialog>
      {portrait && <div className="atlas-rotate" role="alert"><span aria-hidden="true">↻</span><p>The Atlas is easier to explore in landscape. Turn your phone sideways to continue.</p></div>}
    </main>
  );
}
