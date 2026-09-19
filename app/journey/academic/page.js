"use client";

import { browserStorage } from "@/lib/browserStorage";


import Localized from "@/components/Localized";

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
import { playSound } from "@/lib/sound";
import { isValidGwa, isValidSubjects } from "@/lib/assessmentValidation";

gsap.registerPlugin(useGSAP);
const ACADEMIC_ITEMS = items.filter(item => item.section === "Academic Performance");
const STRAND_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-01");
const GWA_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-03");
const SUBJECTS_ITEM = ACADEMIC_ITEMS.find(item => item.id === "ACA-04");

function Basket({ subjects, basketRef, flightRef, harvest, limitNotice }) {
  const full = subjects.length === SUBJECTS_ITEM.maxSelect;
  return <Localized as="div" ref={basketRef} className="valley-basket" data-full={full}>
    <svg className="valley-basket-drawing" width="160" height="100" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision" aria-hidden="true"><path d="M25 42h110l-12 48H37z M45 42Q80-18 115 42 M45 57h70 M42 73h76 M60 44l4 44 M100 44l-4 44" /><path className="valley-basket-ribbon" d="M80 46C40 13 42 62 80 46C118 13 120 62 80 46l-10 30m10-30 10 30" /></svg>
    <Localized as="div" className="valley-basket-items">{subjects.map(value => <Localized as="span" key={value} aria-label={value} ><StatementIcon category={SUBJECTS_ITEM.options.find(option => option.value === value)?.category} /></Localized>)}</Localized>
    {harvest && <span ref={flightRef} className="valley-harvest-flight" aria-hidden="true"><StatementIcon category={harvest.category} /></span>}
    <Localized as="p" id="valley-subjects-help" role="status" className={limitNotice || !subjects.length ? "assessment-validation" : undefined}>{limitNotice ? "You can select up to 3 subjects. Deselect one before choosing another." : !subjects.length ? "Select at least 1 subject to continue. You can choose up to 3." : full ? "You've picked your 3. Tap one to swap it out." : "You can continue now, or choose up to 3 subjects."}</Localized>
  </Localized>;
}

export default function AcademicPage() {
  const router = useRouter();
  const scrollCard = useRef(null);
  const basket = useRef(null);
  const flight = useRef(null);
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
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
        setBriefingSeen(browserStorage.getItem("careerCompassValleyBriefing") === "seen");
        if (browserStorage.getItem("careerCompassValleyStep") === "2") setStep(2);
      } catch { /* In-memory state remains available. */ }
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
  const hasValidGwa = isValidGwa(session.gwa);
  const hasSubjects = isValidSubjects(session.subjects);
  const canSubmit = isReady && hasValidGwa && hasSubjects;
  const hasReachedSubjectLimit = session.subjects.length >= SUBJECTS_ITEM.maxSelect;
  const showBriefing = !briefingSeen && session.gwa === null && !session.subjects.length;
  const tier = !hasValidGwa ? "" : session.gwa < 85 ? "Good standing" : session.gwa < 90 ? "Strong performer" : session.gwa < 96 ? "Outstanding" : "Top of class";

  function changeStep(next) {
    setStep(next);
    try { browserStorage.setItem("careerCompassValleyStep", String(next)); } catch {}
  }
  function beginTrail() {
    try { browserStorage.setItem("careerCompassValleyBriefing", "seen"); } catch {}
    setBriefingSeen(true);
    changeStep(1);
  }
  const nod = contextSafe(() => {
    setGwaAttempted(true);
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
      setLimitNotice({ subject: option.value });
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
    if (!canSubmit) { basket.current?.scrollIntoView({ block: "nearest" }); scrollCard.current?.querySelector(".valley-crop input")?.focus(); return; }
    playSound("unlock");
    stamping.current = true;
    setSubmitting(true);
    updateSession({ journeyProgress: { academic: SECTION_STATUS.COMPLETED } });
    router.push("/journey");
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills"]}><Localized as="main" className="trail-screen trail-valley game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
      <div className="valley-light" aria-hidden="true" />
      <Localized as="div" className="valley-pollen" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ left: ((index * 29 + 7) % 100) + "%", top: ((index * 17 + 13) % 90) + "%", animationDelay: (-index * 2.7) + "s" }} />)}</Localized>
      {showBriefing ? <Card className="valley-briefing relative">{!submitting && <TrailExit onLeave={() => { discardSection("academic"); try { browserStorage.removeItem("careerCompassValleyStep"); } catch {} router.push("/journey"); }} />}<Localized as="h1">The Valley</Localized><Localized as="p">2 quick details. Add your grades and pick your strongest subjects. The ground the rest of your journey stands on.</Localized><Button label="BEGIN" onClick={beginTrail} /></Card> :
      <Card ref={scrollCard} className="valley-card relative max-w-4xl">
        {!submitting && <TrailExit onLeave={() => { discardSection("academic"); try { browserStorage.removeItem("careerCompassValleyStep"); } catch {} router.push("/journey"); }} />}
        <form onSubmit={submitAcademicProfile} noValidate>
          <Localized as="p" className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">The Valley · Step {step} of 2</Localized>
          <Localized as="h1" className="mt-3 font-serif text-3xl text-balance sm:text-4xl">Complete your academic profile</Localized>
          <Localized as="p" className="mt-3 max-w-2xl text-sm leading-6 text-beige/70 sm:text-base">Add your general average and choose 1 to 3 subjects where you perform best.</Localized>
          <div className="mt-8 grid gap-6">
            <div className="space-y-6" hidden={step !== 1}>
              <section className="valley-field-marker"><StatementIcon category={strand?.category[0]} /><div><Localized as="h2">{STRAND_ITEM.text}</Localized><Localized as="p">{strandLabel}</Localized><Localized as="small">Based on your student intake information</Localized></div></section>
              <Localized as={Link} className="valley-profile-link" href="/intake?step=1">Not right? Edit your profile</Localized>
              <section className="valley-gauge">
                <Localized as="label" htmlFor="academic-gwa">{GWA_ITEM.text}</Localized>
                <div className="valley-grade-number"><Localized as="input" id="academic-gwa" type="number" min={GWA_ITEM.min} max={GWA_ITEM.max} step="0.01" value={session.gwa ?? ""} onChange={updateGwa} onBlur={nod} placeholder="75–100" disabled={!isReady} aria-invalid={gwaAttempted && !hasValidGwa} aria-describedby="valley-gwa-help" /></div>
                <Localized as="p" className="valley-tier" aria-live="polite">{tier || "Enter your general average"}</Localized>
                <Localized as="input" className="valley-grade-slider" type="range" aria-label="General Weighted Average gauge" min={GWA_ITEM.min} max={GWA_ITEM.max} step="0.01" value={hasValidGwa ? session.gwa : GWA_ITEM.min} onChange={updateGwa} onPointerUp={nod} onKeyUp={nod} disabled={!isReady} />
                <div className="valley-gauge-ends"><Localized as="span">75</Localized><Localized as="span">100</Localized></div>
                <Localized as="p" id="valley-gwa-help" role="status" className={gwaAttempted && !hasValidGwa ? "assessment-validation" : undefined}>{gwaAttempted && !hasValidGwa ? "Enter your general average as a number between 75 and 100 to continue." : "Enter a value from 75 to 100."}</Localized>
              </section>
            </div>
            <fieldset hidden={step !== 2} className="valley-harvest" aria-describedby="valley-subjects-help" aria-invalid={!hasSubjects}>
              <Localized as="legend">Which subjects are you strongest in?</Localized>
              <Localized as="p" aria-live="polite">{session.subjects.length} of {SUBJECTS_ITEM.maxSelect} selected</Localized>
              <Localized as="div" className="valley-crops">
                {SUBJECTS_ITEM.options.map(option => {
                  const isSelected = session.subjects.includes(option.value);
                  return <Localized as="label" key={option.value} className="valley-crop" data-selected={isSelected} data-dimmed={!isSelected && hasReachedSubjectLimit}>
                    <input type="checkbox" value={option.value} checked={isSelected} disabled={!isReady || submitting} onChange={event => toggleSubject(option, event)} className="sr-only" />
                    <StatementIcon category={option.category} /><Localized as="span" className="valley-subject-name">{option.text}</Localized>
                    {limitNotice?.subject === option.value && <Localized as="span" className="assessment-validation" role="alert">Choose up to 3 subjects. Deselect one first.</Localized>}
                    {isSelected && <Localized as="span" className="valley-check" aria-hidden="true">✓</Localized>}
                  </Localized>;
                })}
              </Localized>
              <Basket subjects={session.subjects} basketRef={basket} flightRef={flight} harvest={harvest} limitNotice={limitNotice} />
            </fieldset>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button label="Back" onClick={() => step === 2 ? changeStep(1) : router.push("/journey")} className="w-full sm:w-auto" />
            <Button label={step === 1 ? "Choose my subjects →" : "Complete Academics"} type="submit" disabled={!isReady || submitting || (step === 2 && !hasSubjects)} aria-describedby={step === 2 ? "valley-subjects-help" : "valley-gwa-help"} className="w-full sm:w-auto" />
          </div>
        </form>
      </Card>}
    </Localized></JourneyAccess>
  );
}
