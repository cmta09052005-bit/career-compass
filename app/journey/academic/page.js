"use client";

import Localized from "@/components/Localized";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import JourneyAccess from "@/components/JourneyAccess";
import TrailExit from "@/components/TrailExit";
import StatementIcon from "../skills/StatementIcon";
import { browserStorage } from "@/lib/browserStorage";
import { useSessionAnswers, SECTION_STATUS } from "@/lib/useSessionAnswers";
import { fromSession } from "@/lib/scoringV2/fromSession";
import { ROUTE_LABELS } from "@/lib/routeResolution";
import { STRANDS, OLD_SUBJECTS, CORE_SUBJECTS, ELECTIVES, CERTIFICATES } from "@/lib/itemsV2";
import { valleySteps, togglePicks, valleyPatch, stepComplete, validUiGwa } from "@/lib/valleySelection";
import iconMap from "@/data/v2/icon-map.json";
import { playSound } from "@/lib/sound";
import "./presentation.css";

gsap.registerPlugin(useGSAP);
const STEP_KEY = "careerCompassValleyStep";
const BRIEFING_KEY = "careerCompassValleyBriefing";
const TITLES = { strand: "Which strand are you taking?", subjects: "Which subjects are you strongest in?", electives: "Which electives do you take and feel strongest in?", bestSubjects: "Which subjects are you strongest in?", gwa: "What is your general average?", certificates: "Which certificates or awards do you have?" };
const ALL_CARDS = [...STRANDS, ...OLD_SUBJECTS, ...CORE_SUBJECTS, ...ELECTIVES, ...CERTIFICATES];
const electiveGroups = [...new Set(ELECTIVES.map(item => `${item.section}: ${item.group}`))].map(name => ({ name, items: ELECTIVES.filter(item => `${item.section}: ${item.group}` === name) }));

function SubjectFlight({ harvest, basketRef, onArrive }) {
  const flight = useRef(null);
  useGSAP(() => {
    if (!basketRef.current) return;
    const end = basketRef.current.getBoundingClientRect();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(flight.current, { x: reduced ? 0 : harvest.x - end.left - end.width / 2, y: reduced ? 0 : harvest.y - end.top - end.height / 2, opacity: 1 });
    const arrival = gsap.timeline({ onComplete: () => onArrive(harvest.id) });
    if (!reduced) arrival.to(flight.current, { x: 0, y: 0, duration: .75, ease: "power2.inOut" });
    arrival.to(flight.current, { opacity: 0, scale: reduced ? 1 : .45, duration: .15 });
  }, { scope: flight, dependencies: [harvest], revertOnUpdate: true });
  return <span ref={flight} className="valley-harvest-flight" aria-hidden="true"><StatementIcon icon={harvest.icon} /></span>;
}

export default function AcademicPage() {
  const router = useRouter();
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
  const steps = valleySteps(session.route);
  const [active, setActive] = useState(null);
  const [restored, setRestored] = useState(false);
  const [briefingSeen, setBriefingSeen] = useState(false);
  const [error, setError] = useState("");
  const [gwaDraft, setGwaDraft] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const inner = useRef(null), card = useRef(null), heading = useRef(null), basket = useRef(null), flightId = useRef(0);
  const step = steps.includes(active) ? active : steps[0];
  const index = Math.max(0, steps.indexOf(step));
  const shared = ["gwa", "certificates"].includes(step);
  const value = shared ? session[step] : session[session.route]?.[step];
  const confirmed = shared ? session.valleyProgress[step] : session.valleyProgress[session.route]?.[step];
  const selected = Array.isArray(value) ? value : [];
  const optional = ["electives", "certificates"].includes(step);
  const noneSelected = optional && confirmed && selected.length === 0;
  const showBriefing = restored && !briefingSeen && session.journeyProgress.academic === SECTION_STATUS.NOT_STARTED;
  const { contextSafe } = useGSAP({ scope: card });

  useEffect(() => {
    const restore = () => {
      let saved;
      try { saved = JSON.parse(browserStorage.getItem(STEP_KEY)); } catch { /* Old numeric step starts fresh. */ }
      const urlStep = new URLSearchParams(window.location.search).get("step");
      setActive(valleySteps(session.route).includes(urlStep) ? urlStep : saved?.route === session.route ? saved.step : null);
      setRestored(true);
      setBriefingSeen(browserStorage.getItem(BRIEFING_KEY) === "seen");
    };
    queueMicrotask(restore);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [session.route]);
  useGSAP(() => {
    if (!restored || showBriefing || !inner.current) return;
    inner.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(inner.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .28, clearProps: "transform,opacity" });
  }, { scope: card, dependencies: [step, restored, showBriefing], revertOnUpdate: true });

  function changeStep(next) {
    setError(""); setActive(next); setGwaDraft(null); setHarvests([]);
    browserStorage.setItem(STEP_KEY, JSON.stringify({ route: session.route, step: next }));
    window.history.pushState(null, "", `?step=${next}`);
    playSound("tap");
  }
  function beginTrail() { browserStorage.setItem(BRIEFING_KEY, "seen"); setBriefingSeen(true); changeStep(steps[0]); }
  function save(value, flag) { updateSession(valleyPatch(session, step, value, flag)); }
  function choose(id, event) {
    if (!isReady || submitting) return;
    setError("");
    if (step === "strand") {
      const deselect = id === value && confirmed;
      save(deselect ? null : id, !deselect);
      playSound("confirm");
      return;
    }
    const next = togglePicks(selected, id, noneSelected);
    if (next.limited) {
      setError("Choose up to 3. Remove a selection first.");
      const tile = event?.currentTarget;
      if (tile) contextSafe(() => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(tile, { x: -4 }, { x: 0, duration: .08, repeat: 3, yoyo: true, clearProps: "transform" }); })();
      return;
    }
    if (id && !selected.includes(id) && event) {
      const bounds = event.currentTarget.getBoundingClientRect();
      setHarvests(previous => [...previous, { id: ++flightId.current, x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2, icon: iconMap[id] || "neutral" }]);
    }
    save(next.values, next.confirmed); playSound("confirm");
  }
  function updateGwa(event) {
    const raw = event.target.value;
    setGwaDraft(raw);
    const valid = validUiGwa(raw);
    setError(valid || raw === "" ? "" : "Enter a number from 60 to 100 with up to 2 decimal places.");
    save(raw === "" ? null : Number(raw), valid);
  }
  function advance(event) {
    event.preventDefault();
    if (!isReady || submitting) return;
    if (!stepComplete(session, step)) { setError(step === "gwa" ? "Enter a number from 60 to 100 with up to 2 decimal places." : "Choose an answer before continuing."); return; }
    if (index < steps.length - 1) { changeStep(steps[index + 1]); return; }
    if (!steps.every(key => stepComplete(session, key))) { setError("Check each Valley step before finishing."); return; }
    const result = fromSession(session);
    if (!result.ok) { setError(`Please check your answers. ${result.errors.map(item => `${item.path}: ${item.message}`).join(" ")}`); return; }
    setSubmitting(true); playSound("unlock");
    updateSession({ journeyProgress: { academic: SECTION_STATUS.COMPLETED } });
    browserStorage.removeItem(STEP_KEY);
    router.push("/journey");
  }
  function option(item) {
    const checked = step === "strand" ? value === item.id : selected.includes(item.id);
    return <button type="button" key={item.id} className="valley-crop" data-selected={checked} aria-pressed={checked} disabled={!isReady || submitting} onClick={event => choose(item.id, event)}><StatementIcon icon={iconMap[item.id] || "neutral"} /><span className="valley-subject-name">{item.text}</span></button>;
  }
  const groups = step === "electives" ? electiveGroups : step === "bestSubjects" ? [{ name: "Core subjects", items: CORE_SUBJECTS }] : [{ name: null, items: step === "strand" ? STRANDS : step === "subjects" ? OLD_SUBJECTS : CERTIFICATES }];
  return <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills"]}><main className="trail-screen trail-valley game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
    <div className="valley-light" aria-hidden="true" /><div className="valley-pollen" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ left: `${(i * 29 + 7) % 100}%`, top: `${(i * 17 + 13) % 90}%`, animationDelay: `${-i * 2.7}s` }} />)}</div>
    {showBriefing ? <Card className="valley-briefing relative"><TrailExit onLeave={() => { discardSection("academic"); browserStorage.removeItem(STEP_KEY); router.push("/journey"); }} /><h1>The Valley</h1><p>{steps.length} steps. Add your subjects, general average, and certificates.</p><Button label="BEGIN" onClick={beginTrail} /></Card> : <Card ref={card} className="valley-card valley-v2 assessment-panel relative">
      <TrailExit onLeave={() => { discardSection("academic"); browserStorage.removeItem(STEP_KEY); router.push("/journey"); }} />
      <form onSubmit={advance} noValidate>
        <header><p className="map-ribbon">The Valley · Step {index + 1} of {steps.length}</p><p className="valley-route">{ROUTE_LABELS[session.route]}</p><h1 ref={heading} tabIndex={-1}>{TITLES[step]}</h1></header>
        <div ref={inner} className="valley-v2-inner" data-step={step}>
          {step === "gwa" ? <section className="valley-gauge"><label htmlFor="academic-gwa">General Weighted Average (GWA)</label><div className="valley-grade-number"><input id="academic-gwa" type="number" inputMode="decimal" min="60" max="100" step="0.01" value={gwaDraft ?? session.gwa ?? ""} onChange={updateGwa} aria-invalid={Boolean(error)} aria-describedby="valley-gwa-help" disabled={!isReady || submitting} /></div><p id="valley-gwa-help">60 to 100, up to 2 decimal places.</p></section> : <>
            <p className="valley-pick-help">{step === "strand" ? "Choose one. Tap again to deselect." : step === "certificates" ? "Choose up to 3, or None yet." : step === "electives" ? "Choose 1 to 3, or Not sure yet / None." : "Choose 1 to 3."}</p>
            {optional && <button type="button" className="valley-crop valley-none" data-selected={noneSelected} aria-pressed={noneSelected} disabled={!isReady || submitting} onClick={event => choose(null, event)}>{step === "certificates" ? "None yet" : "Not sure yet / None"}</button>}
            {groups.map((group, i) => <section className="valley-choice-group" key={group.name || i}>{group.name && <Localized as="h2">{group.name}</Localized>}<div className="valley-crops">{group.items.map(option)}</div></section>)}
          </>}
        </div>
        <footer className="valley-v2-footer">
          {Array.isArray(value) && <div className="valley-selected-tray"><div ref={basket} className="valley-tray-label"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m7 9 5-6 5 6 M3 9h18l-2 11H5z M9 13v3 M15 13v3" /></svg><span>{selected.length} of 3 selected</span>{harvests.map(harvest => <SubjectFlight key={harvest.id} harvest={harvest} basketRef={basket} onArrive={id => setHarvests(previous => previous.filter(item => item.id !== id))} />)}</div><div className="valley-tray-picks">{selected.map(id => <button type="button" key={id} disabled={submitting} onClick={() => choose(id)} aria-label={`Remove ${ALL_CARDS.find(item => item.id === id)?.text || id}`} title={ALL_CARDS.find(item => item.id === id)?.text}>{ALL_CARDS.find(item => item.id === id)?.text}<span aria-hidden="true"> ×</span></button>)}</div></div>}
          <p className="assessment-validation valley-v2-error" role="status">{error}</p>
          <div className="valley-v2-actions"><Button label="Back" disabled={submitting} onClick={() => index ? changeStep(steps[index - 1]) : router.push("/journey")} /><Button label={index === steps.length - 1 ? "Finish" : "Next"} type="submit" disabled={!isReady || submitting} /></div>
        </footer>
      </form>
    </Card>}
  </main></JourneyAccess>;
}
