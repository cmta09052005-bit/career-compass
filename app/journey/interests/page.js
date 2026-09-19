"use client";

import Localized from "@/components/Localized";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import JourneyAccess from "@/components/JourneyAccess";
import TrailExit from "@/components/TrailExit";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import CelebrationEffects from "@/components/CelebrationEffects";
import { playSound } from "@/lib/sound";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./presentation.css";
import items from "@/data/items.json";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";
import { isValidInterest } from "@/lib/assessmentValidation";

gsap.registerPlugin(useGSAP);
const INTEREST_ITEMS = items.filter((item) => item.section === "Interests");
const ACKNOWLEDGMENTS = ["Choice noted.", "Got it.", "That one's in.", "All right, moving on.", "Noted for now.", "On it.", "Thanks for that.", "Ready for the next part."];
const SCENE_LABELS = ["Weekend plans", "Project tasks", "Tools for the community", "An idea to share", "Your content feed", "Career Day roles", "Class fair booths", "Around your community"];
const BRIEFING_KEY = "careerCompassMountainsBriefing";
const CATEGORY_ICONS = {
  C1: "M18 18h64v44H18z M10 72h80 M40 62v10 M60 62v10 M43 30l-9 9 9 9 M57 30l9 9-9 9",
  C2: "M30 18l14 14-12 12-14-14v20l18 12 30-30 16 16V28L64 16 50 30 M36 62l22 22 12-12-22-22",
  C3: "M20 76V50h14v26 M43 76V36h14v40 M66 76V20h14v56 M16 30l22-12 14 8 28-14",
  C4: "M50 28Q30 14 14 22v50q18-8 36 6 18-14 36-6V22q-16-8-36 6v50 M24 34l16 5 M24 46l16 5 M60 39l16-5 M60 51l16-5",
  C5: "M50 22c-10-16-32-8-32 12 0 24 32 44 32 44s32-20 32-44c0-20-22-28-32-12z M50 38v22 M39 49h22",
  C6: "M48 16c-22 4-34 22-30 42 3 16 16 26 32 24 6-.8 8-6 6-11-3-7 4-10 12-9 16 2 24-10 20-24C84 20 66 12 48 16z M34 36a5 5 0 110 10 5 5 0 010-10 M56 30a5 5 0 110 10 5 5 0 010-10 M44 54a5 5 0 110 10 5 5 0 010-10 M70 46a5 5 0 110 10 5 5 0 010-10",
};
const MOUNTAIN_PEAKS = [
  "M2 112 L18 86 L34 112 Z",
  "M20 112 L38 74 L56 112 Z",
  "M40 112 L58 62 L78 112 Z",
  "M60 112 L80 50 L102 112 Z",
  "M82 112 L102 40 L124 112 Z",
  "M100 112 L122 28 L144 112 Z",
  "M118 112 L136 18 L154 112 Z",
  "M128 112 L148 6 L166 112 Z",
];
const PEAK_DUST = [
  { left: "11%", top: "69%" },
  { left: "23%", top: "60%" },
  { left: "35%", top: "50%" },
  { left: "48%", top: "40%" },
  { left: "61%", top: "32%" },
  { left: "73%", top: "23%" },
  { left: "81%", top: "15%" },
  { left: "88%", top: "8%" },
];

export default function InterestsPage() {
  const router = useRouter();
  const scrollCard = useRef(null);
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const firstUnanswered = INTEREST_ITEMS.findIndex(item => !isValidInterest(item, session.interests[item.id]));
  const questionIndex = activeQuestion ?? (firstUnanswered < 0 ? 7 : firstUnanswered);
  function setQuestionIndex(next) {
    setActiveQuestion(typeof next === "function" ? next(questionIndex) : next);
  }
  const [dismissedBriefing, setDismissedBriefing] = useState(false);
  useEffect(() => {
    if (scrollCard.current) scrollCard.current.scrollTop = 0;
  }, [questionIndex, dismissedBriefing]);
  const [settling, setSettling] = useState(false);
  const advancing = useRef(false);
  const heading = useRef(null);
  useUnsavedProgressWarning(true);

  let seenBriefing = false;
  try { seenBriefing = sessionStorage.getItem(BRIEFING_KEY) === "seen"; } catch { /* Session memory still works. */ }
  const regionStarted = Object.keys(session.interests).length > 0;
  const showBriefing = !dismissedBriefing && !regionStarted && !seenBriefing;

  const currentItem = INTEREST_ITEMS[questionIndex];
  const selectedKey = session.interests[currentItem.id];
  const completedCount = INTEREST_ITEMS.filter(item => isValidInterest(item, session.interests[item.id])).length;
  const elevation = questionIndex < 2 ? "Base of the trail" : questionIndex < 5 ? "Halfway up" : questionIndex < 7 ? "Near the summit" : "You've reached the top";
  const summitWarmth = questionIndex / 7;
  const { contextSafe } = useGSAP(() => {
    if (!isReady || !scrollCard.current || showBriefing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) gsap.fromTo(".option-card", { rotation: () => gsap.utils.random(-8, 8), opacity: 0, y: 20 }, { rotation: 0, opacity: 1, y: 0, duration: .35, stagger: .08, ease: "back.out(1.4)", clearProps: "transform,opacity" });
    heading.current?.focus({ preventScroll: true });
  }, { scope: scrollCard, dependencies: [questionIndex, isReady, showBriefing], revertOnUpdate: true });
  useGSAP(() => {
    if (isReady && !showBriefing && scrollCard.current) gsap.fromTo(".mountain-elevation", { opacity: 0 }, { opacity: 1, duration: .18 });
  }, { scope: scrollCard, dependencies: [elevation, isReady, showBriefing], revertOnUpdate: true });

  function beginTrail() {
    try { sessionStorage.setItem(BRIEFING_KEY, "seen"); } catch { /* Session memory still works. */ }
    playSound("tap");
    setDismissedBriefing(true);
  }

  function tiltCard(event, reset = false) {
    contextSafe(() => {
    if (advancing.current || event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    gsap.to(card, { rotationX: reset ? 0 : (0.5 - (event.clientY - bounds.top) / bounds.height) * 12, rotationY: reset ? 0 : ((event.clientX - bounds.left) / bounds.width - .5) * 12, transformPerspective: 800, duration: .18, overwrite: "auto" });
    })();
  }

  function selectOption(key, card) {
    contextSafe(() => {
    if (advancing.current || !isReady || !isValidInterest(currentItem, key)) return;
    advancing.current = true;
    setActiveQuestion(questionIndex);
    setSettling(true);
    updateSession({
      interests: { [currentItem.id]: key },
      journeyProgress: { interests: SECTION_STATUS.IN_PROGRESS },
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const final = questionIndex === INTEREST_ITEMS.length - 1;
    playSound(final ? "unlock" : "confirm");
    gsap.killTweensOf(card);
    const sequence = gsap.timeline();
    sequence.to(card, { rotation: 0, rotationX: reduced ? 0 : -6, rotationY: 0, scale: reduced ? 1 : 1.08, opacity: 1, y: 0, duration: .12 }, 0)
      .to(card, { rotationX: 0, scale: 1, duration: .13 }, .12)
      .to(`.mountain-peak:nth-of-type(${questionIndex + 1})`, { scale: reduced ? 1 : 1.15, duration: .15 }, 0)
      .to(`.mountain-peak:nth-of-type(${questionIndex + 1})`, { scale: 1, duration: .15 }, .15);
    if (final && !reduced) sequence.to(".mountain-medallion", { scale: 1.18, filter: "drop-shadow(0 0 18px #e8b940)", duration: .25 }, 0)
      .to(".mountain-medallion", { scale: 1, filter: "drop-shadow(0 0 6px #e8b940)", duration: .35, ease: "back.out(1.4)" }, .25);
    sequence.call(() => {
      if (final) {
        updateSession({ journeyProgress: { interests: SECTION_STATUS.COMPLETED } });
        router.push("/journey");
      } else {
        playSound("tap");
        advancing.current = false;
        setSettling(false);
        setQuestionIndex(index => index + 1);
      }
    }, [], final ? 1.1 : .8);
    })();
  }

  function goBack() {
    if (advancing.current) return;
    if (questionIndex === 0) {
      router.push("/journey");
      return;
    }
    setQuestionIndex((index) => index - 1);
  }

  function goNext() {
    if (!isReady || !isValidInterest(currentItem, selectedKey) || advancing.current) return;
    if (questionIndex < INTEREST_ITEMS.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    updateSession({
      journeyProgress: { interests: SECTION_STATUS.COMPLETED },
    });
    router.push("/journey");
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={[]}><Localized as="main" style={{ "--summit-warmth": summitWarmth }} className="trail-screen trail-mountains game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
      <div className="mountain-sunrise" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 mountain-haze"
        aria-hidden="true"
      />

      {showBriefing ? (
      <Card ref={scrollCard} className="mountain-briefing-panel relative max-w-3xl">
        {!settling && <TrailExit onLeave={() => { discardSection("interests"); router.push("/journey"); }} />}
        <Localized as="p" className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">The Mountains</Localized>
        <Localized as="h1" className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">The Mountains</Localized>
        <Localized as="p" className="mountain-briefing-copy">8 situations. No right answers.{"\n\n"}Just pick whatever feels most like you. Every choice tells us something new.</Localized>
        <div className="mountain-actions mt-8 flex justify-center">
          <Button label="BEGIN" onClick={beginTrail} className="w-full sm:w-auto" />
        </div>
      </Card>
      ) : (
      <Card ref={scrollCard} className="mountain-question-panel relative max-w-3xl">
        {!settling && <TrailExit onLeave={() => { discardSection("interests"); router.push("/journey"); }} />}
        {/* 25 — Section/progress label */}
        <Localized as="p" className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">
          The Mountains · Question {questionIndex + 1} of {INTEREST_ITEMS.length}
        </Localized>

        <Localized as="div" className="mountain-progress" role="progressbar" aria-label="Wayfinder medallion" aria-valuemin={0} aria-valuemax={8} aria-valuenow={completedCount} aria-valuetext={completedCount + " of 8 scenarios answered"}>
          <Localized as="div" className="mountain-medallion" aria-hidden="true">
            <svg viewBox="0 0 168 124">
              <line x1="2" y1="112" x2="166" y2="112" />
              {MOUNTAIN_PEAKS.map((path, index) => (
                <path
                  key={INTEREST_ITEMS[index].id}
                  className="mountain-peak"
                  data-filled={Boolean(session.interests[INTEREST_ITEMS[index].id])}
                  data-filling={settling && index === questionIndex}
                  d={path}
                />
              ))}
              <g className="mountain-summit-flag" data-planted={completedCount === 8}>
                <line x1="148" y1="-16" x2="148" y2="6" />
                <path d="M148 -16 L164 -9 L148 -2 Z" />
              </g>
            </svg>
            {settling && <span className="mountain-dust" style={PEAK_DUST[questionIndex]}><CelebrationEffects /></span>}
          </Localized>
          <Localized as="p" className="mountain-elevation" key={elevation}>{elevation}</Localized>
        </Localized>

        {/* 27 — Scenario prompt text */}
        <Localized as="p" className="assessment-scene">{SCENE_LABELS[questionIndex]}</Localized>
        <Localized as="h1" ref={heading} tabIndex={-1} className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">
          {currentItem.text}
        </Localized>

        <Localized as="div"
          id="scenario-choices" key={currentItem.id}
          className="scenario-choices scenario-feed mt-8 grid gap-3 sm:grid-cols-2"
          aria-label="Answer options"
          role="radiogroup"
          aria-required="true"
          aria-describedby="mountain-choice-help"
        >
          {currentItem.options.map((option, optionIndex) => {
            const isSelected = selectedKey === option.key;
            return (
              <Card
                // 28–31 — Option cards 1–4
                key={option.key}
                as="button"
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={!isReady || settling}
                onClick={(event) => { event.stopPropagation(); selectOption(option.key, event.currentTarget); }}
                onPointerMove={tiltCard}
                onPointerLeave={event => tiltCard(event, true)}
                className={`option-card texture-${optionIndex} max-w-none rounded-2xl p-5 text-left transition-[border-color,background-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  isSelected
                    ? "border-gold bg-gold/20"
                    : "border-beige/20 bg-navy/35 hover:border-teal/70 hover:bg-teal/10"
                }`}
              >
                {isSelected && <Badge variant="icon" size="small" state="unlocked" className="mountain-selection-stamp" aria-hidden="true" icon={<Localized as="span" className="mountain-selection-check">✓</Localized>} />}
                {isSelected && settling && <span className="mountain-card-dust" aria-hidden="true"><CelebrationEffects /></span>}
                <span className="scenario-thumbnail" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={CATEGORY_ICONS[option.category]} /></svg></span>
                <span className="mountain-option-copy flex items-start gap-4">
                  <Localized as="span"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                      isSelected
                        ? "border-gold bg-gold text-navy"
                        : "border-beige/30 text-beige/70"
                    }`}
                    aria-hidden="true"
                  >
                    {option.key}
                  </Localized>
                  <Localized as="span" className="pt-1 text-sm leading-6 sm:text-base">
                    {option.text}
                  </Localized>
                </span>
              </Card>
            );
          })}
        </Localized>
        <Localized as="p" id="mountain-choice-help" className="assessment-note" role="status" aria-live="polite">{isValidInterest(currentItem, selectedKey) ? ACKNOWLEDGMENTS[questionIndex] : "Choose one option to continue. Your choice takes you to the next question."}</Localized>

        <Localized as="div" className="mountain-actions mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {/* 32 — Back button */}
          <Button
            label="Back"
            onClick={goBack}
            disabled={settling}
            className="w-full sm:w-auto"
          />
          {/* Saved answers can be reviewed without selecting them again. */}
          {isValidInterest(currentItem, selectedKey) && !settling && <Button
            label={
              questionIndex === INTEREST_ITEMS.length - 1
                ? "Complete Interests"
                : "Next"
            }
            onClick={goNext}
            disabled={!isReady || settling}
            className="w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          />}
        </Localized>
      </Card>
      )}
    </Localized></JourneyAccess>
  );
}
