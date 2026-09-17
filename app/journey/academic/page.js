"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import JourneyAccess from "@/components/JourneyAccess";
import TrailExit from "@/components/TrailExit";
import Card from "@/components/Card";
import StatementIcon from "../skills/StatementIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./presentation.css";
import items from "@/data/items.json";
import { SECTION_STATUS, useSessionAnswers } from "@/lib/useSessionAnswers";
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";
import { playSound } from "@/lib/sound";

gsap.registerPlugin(useGSAP);
const ACADEMIC_ITEMS = items.filter(item => item.section === "Academic Performance");
const STRAND_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-01");
const GWA_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-03");
const SUBJECTS_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-04");

function Basket({ subjects, basketRef, flightRef, harvest, limitNotice }) {
  const full = subjects.length === SUBJECTS_ITEM.maxSelect;
  return <div ref={basketRef} className="valley-basket" data-full={full}>
    <svg className="valley-basket-drawing" width="160" height="100" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision" aria-hidden="true"><path d="M25 42h110l-12 48H37z M45 42Q80-18 115 42 M45 57h70 M42 73h76 M60 44l4 44 M100 44l-4 44" /><path className="valley-basket-ribbon" d="M80 46C40 13 42 62 80 46C118 13 120 62 80 46l-10 30m10-30 10 30" /></svg>
    <div className="valley-basket-items">{subjects.map(value => <span key={value} aria-label={value} ><StatementIcon category={SUBJECTS_ITEM.options.find(option => option.value === value)?.category} /></span>)}</div>
    {harvest && <span ref={flightRef} className="valley-harvest-flight" aria-hidden="true"><StatementIcon category={harvest.category} /></span>}
    <p role="status">{limitNotice ? "You can only pick 3. Tap one of your chosen subjects to swap it out first." : full ? "You've picked your 3. Tap one to swap it out" : "Pick 3 subjects to continue"}</p>
  </div>;
}

export default function AcademicPage() {
  const router = useRouter();
  const scrollCard = useRef(null);
  const basket = useRef(null);
  const flight = useRef(null);
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
  useUnsavedProgressWarning(true);
  const [step, setStep] = useState(1);
  const [briefingSeen, setBriefingSeen] = useState(false);
  const [gwaAttempted, setGwaAttempted] = useState(false);
  const [harvest, setHarvest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [limitNotice, setLimitNotice] = useState(0);
  const stamping = useRef(false);
  const { contextSafe } = useGSAP({ scope: scrollCard });
  useEffect(() => {
    queueMicrotask(() => {
      try {
        setBriefingSeen(sessionStorage.getItem("careerCompassValleyBriefing") === "seen");
        if (sessionStorage.getItem("careerCompassValleyStep") === "2") setStep(2);
      } catch { /* Session memory remains available. */ }
    });
  }, []);
  useEffect(() => {
    if (scrollCard.current) scrollCard.current.scrollTop = 0;
  }, [step]);
  useEffect(() => {
    if (!limitNotice) return;
    const timer = setTimeout(() => setLimitNotice(0), 3500);
    return () => clearTimeout(timer);
  }, [limitNotice]);
  useGSAP(() => {
    if (!harvest || !flight.current || !basket.current) return;
    const end = basket.current.getBoundingClientRect();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(flight.current, { x: harvest.x - end.left - end.width / 2, y: harvest.y - end.top - 30, opacity: 1, scale: 1 }, { x: 0, y: 0, opacity: 0, scale: .5, duration: reduced ? 0 : .5, ease: "power2.inOut" });
  }, { scope: scrollCard, dependencies: [harvest], revertOnUpdate: true });

  const strand = STRAND_ITEM.options.find(option => option.value === session.strand);
  const strandLabel = strand?.text || session.strand || "Not provided";
  const hasValidGwa = Number.isFinite(session.gwa) && session.gwa >= GWA_ITEM.min && session.gwa <= GWA_ITEM.max;
  const hasSubjects = session.subjects.length === SUBJECTS_ITEM.maxSelect;
  const canSubmit = isReady && hasValidGwa && hasSubjects;
  const hasReachedSubjectLimit = session.subjects.length >= SUBJECTS_ITEM.maxSelect;
  const showBriefing = !briefingSeen && session.gwa === null && !session.subjects.length;
  const tier = !hasValidGwa ? "" : session.gwa < 85 ? "Good standing" : session.gwa < 90 ? "Strong performer" : session.gwa < 96 ? "Outstanding" : "Top of class";

  function changeStep(next) {
    setStep(next);
    try { sessionStorage.setItem("careerCompassValleyStep", String(next)); } catch {}
  }
  function beginTrail() {
    try { sessionStorage.setItem("careerCompassValleyBriefing", "seen"); } catch {}
    setBriefingSeen(true);
    changeStep(1);
  }
  const nod = contextSafe(() => {
    if (!hasValidGwa) return;
    playSound("confirm");
  });
  function updateGwa(event) {
    const value = event.target.value;
    updateSession({ gwa: value === "" ? null : Number(value), journeyProgress: { academic: SECTION_STATUS.IN_PROGRESS } });
  }
  function toggleSubject(option, event) {
    if (!isReady || submitting) return;
    const isSelected = session.subjects.includes(option.value);
    if (!isSelected && hasReachedSubjectLimit) {
      setLimitNotice(current => current + 1);
      const tile = event.currentTarget.closest("label");
      contextSafe(() => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(tile, { x: -4 }, { x: 0, duration: .08, repeat: 3, yoyo: true, overwrite: true, clearProps: "transform" });
      })();
      return;
    }
    setLimitNotice(0);
    if (!isSelected) {
      const bounds = event.currentTarget.closest("label").getBoundingClientRect();
      setHarvest({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2, category: option.category });
      playSound("confirm");
    }
    updateSession({
      subjects: isSelected ? session.subjects.filter(subject => subject !== option.value) : [...session.subjects, option.value],
      journeyProgress: { academic: SECTION_STATUS.IN_PROGRESS },
    });
  }
  function submitAcademicProfile(event) {
    event.preventDefault();
    if (!isReady || stamping.current) return;
    if (!hasValidGwa) {
      setGwaAttempted(true);
      changeStep(1);
      contextSafe(() => {
        scrollCard.current.querySelector("#academic-gwa")?.focus();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(".valley-gauge", { x: -5 }, { x: 0, duration: .08, repeat: 3, yoyo: true, clearProps: "transform" });
      })();
      return;
    }
    if (step === 1) { changeStep(2); return; }
    if (!canSubmit) { basket.current?.scrollIntoView({ block: "nearest" }); return; }
    playSound("unlock");
    stamping.current = true;
    setSubmitting(true);
    updateSession({ journeyProgress: { academic: SECTION_STATUS.COMPLETED } });
    router.push("/journey");
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills"]}><main className="trail-screen trail-valley game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
      {!submitting && <TrailExit onLeave={() => { discardSection("academic"); try { sessionStorage.removeItem("careerCompassValleyStep"); } catch {} router.push("/journey"); }} />}
      <div className="valley-light" aria-hidden="true" />
      <div className="valley-pollen" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ left: ((index * 29 + 7) % 100) + "%", top: ((index * 17 + 13) % 90) + "%", animationDelay: (-index * 2.7) + "s" }} />)}</div>
      {showBriefing ? <Card className="valley-briefing"><h1>The Valley</h1><p>2 quick details. Add your grades and pick your strongest subjects. The ground the rest of your journey stands on.</p><Button label="BEGIN" onClick={beginTrail} /></Card> :
      <Card ref={scrollCard} className="valley-card relative max-w-4xl">
        <form onSubmit={submitAcademicProfile} noValidate>
          <p className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">The Valley · Step {step} of 2</p>
          <h1 className="mt-3 font-serif text-3xl text-balance sm:text-4xl">Complete your academic profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-beige/70 sm:text-base">Add your general average and choose three subjects where you perform best.</p>
          <div className="mt-8 grid gap-6">
            <div className="space-y-6" hidden={step !== 1}>
              <section className="valley-field-marker"><StatementIcon category={strand?.category[0]} /><div><h2>{STRAND_ITEM.text}</h2><p>{strandLabel}</p><small>Based on your student intake information</small></div></section>
              <Link className="valley-profile-link" href="/intake?step=1">Not right? Edit your profile</Link>
              <section className="valley-gauge">
                <label htmlFor="academic-gwa">{GWA_ITEM.text}</label>
                <div className="valley-grade-number"><input id="academic-gwa" type="number" min={GWA_ITEM.min} max={GWA_ITEM.max} step="0.01" value={session.gwa ?? ""} onChange={updateGwa} onBlur={nod} placeholder="75–100" disabled={!isReady} aria-invalid={gwaAttempted && !hasValidGwa} aria-describedby="valley-gwa-help" /></div>
                <p className="valley-tier" aria-live="polite">{tier || "Enter your general average"}</p>
                <input className="valley-grade-slider" type="range" aria-label="General Weighted Average gauge" min={GWA_ITEM.min} max={GWA_ITEM.max} step="0.01" value={hasValidGwa ? session.gwa : GWA_ITEM.min} onChange={updateGwa} onPointerUp={nod} onKeyUp={nod} disabled={!isReady} />
                <div className="valley-gauge-ends"><span>75</span><span>100</span></div>
                <p id="valley-gwa-help" role="status">{gwaAttempted && !hasValidGwa ? "Enter a number between 75 and 100" : "Enter a value from 75 to 100."}</p>
              </section>
            </div>
            <fieldset hidden={step !== 2} className="valley-harvest">
              <legend>Which subjects are you strongest in?</legend>
              <p aria-live="polite">{session.subjects.length} of {SUBJECTS_ITEM.maxSelect} selected</p>
              <div className="valley-crops">
                {SUBJECTS_ITEM.options.map(option => {
                  const isSelected = session.subjects.includes(option.value);
                  return <label key={option.value} className="valley-crop" data-selected={isSelected} data-dimmed={!isSelected && hasReachedSubjectLimit}>
                    <input type="checkbox" value={option.value} checked={isSelected} disabled={!isReady || submitting} onChange={event => toggleSubject(option, event)} className="sr-only" />
                    <StatementIcon category={option.category} /><span className="valley-subject-name">{option.text}</span>
                    {isSelected && <span className="valley-check" aria-hidden="true">✓</span>}
                  </label>;
                })}
              </div>
              <Basket subjects={session.subjects} basketRef={basket} flightRef={flight} harvest={harvest} limitNotice={limitNotice} />
            </fieldset>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button label="Back" onClick={() => step === 2 ? changeStep(1) : router.push("/journey")} className="w-full sm:w-auto" />
            <Button label={step === 1 ? "Choose my subjects →" : "Complete Academics"} type="submit" disabled={!isReady || submitting} className="w-full sm:w-auto" />
          </div>
        </form>
      </Card>}
    </main></JourneyAccess>
  );
}
