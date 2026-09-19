"use client";

import { browserStorage } from "@/lib/browserStorage";


import Localized from "@/components/Localized";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import JourneyAccess from "@/components/JourneyAccess";
import TrailExit from "@/components/TrailExit";
import Card from "@/components/Card";
import StatementIcon from "./StatementIcon";
import GrowthSlider from "./GrowthSlider";
import ForestVine from "./ForestVine";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "./presentation.css";
import items from "@/data/items.json";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";
import { playSound } from "@/lib/sound";
import { isValidConfidence } from "@/lib/assessmentValidation";

gsap.registerPlugin(useGSAP);

const SKILL_ITEMS = items.filter((item) => item.section === "Skills");
const BRIEFING_KEY = "careerCompassForestBriefing";

export default function SkillsPage() {
  const router = useRouter();
  const scrollCard = useRef(null);
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
  const [activeStatement, setActiveStatement] = useState(null);
  const firstUnanswered = SKILL_ITEMS.findIndex(item => !isValidConfidence(session.skills[item.id]));
  const statementIndex = activeStatement ?? (firstUnanswered < 0 ? 9 : firstUnanswered);
  function setStatementIndex(next) {
    setActiveStatement(typeof next === "function" ? next(statementIndex) : next);
  }
  const [dismissedBriefing, setDismissedBriefing] = useState(false);
  let seenBriefing = false;
  try { seenBriefing = browserStorage.getItem(BRIEFING_KEY) === "seen"; } catch { /* In-memory dismissal remains available. */ }
  const showBriefing = !dismissedBriefing && !seenBriefing && !Object.keys(session.skills).length;
  const heading = useRef(null);
  const [attempted, setAttempted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [reviewingSavedAnswer, setReviewingSavedAnswer] = useState(false);
  const advancing = useRef(false);
  const lastRustle = useRef("");
  useEffect(() => {
    if (scrollCard.current) scrollCard.current.scrollTop = 0;
    if (isReady && !showBriefing) heading.current?.focus({ preventScroll: true });
  }, [statementIndex, isReady, showBriefing]);

  const currentItem = SKILL_ITEMS[statementIndex];
  const selectedValue = session.skills[currentItem.id];
  const hasSelectedValue = isValidConfidence(selectedValue);
  const isFinalStatement = statementIndex === SKILL_ITEMS.length - 1;
  useGSAP(() => {
    if (!confirming || !scrollCard.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(".forest-growth-stage[data-selected=true]", { boxShadow: "0 0 0px #bbc66300" }, { boxShadow: "0 0 24px #bbc663aa", duration: reduced ? 0 : .2 });
    gsap.delayedCall(.6, () => {
      if (statementIndex < SKILL_ITEMS.length - 1) {
        setAttempted(false);
        setReviewingSavedAnswer(false);
        setStatementIndex((index) => index + 1);
        setConfirming(false);
        advancing.current = false;
      } else {
        updateSession({ journeyProgress: { skills: SECTION_STATUS.COMPLETED } });
        router.push("/journey");
      }
    });
  }, { scope: scrollCard, dependencies: [confirming], revertOnUpdate: true });
  const flavor = statementIndex < 2 ? "Just sprouting" : statementIndex < 5 ? "Taking root" : statementIndex < 8 ? "Branching out" : "In full bloom";
  const visibleLeaves = statementIndex + (confirming ? 1 : 0);

  function selectConfidence(value) {
    if (!isReady || advancing.current || !isValidConfidence(value)) return;
    setAttempted(false);
    setActiveStatement(statementIndex);
    const stageKey = `${currentItem.id}:${value}`;
    if (lastRustle.current !== stageKey) {
      playSound("open");
      lastRustle.current = stageKey;
    }
    updateSession({
      skills: { [currentItem.id]: Number(value) },
      journeyProgress: { skills: SECTION_STATUS.IN_PROGRESS },
    });
  }

  function goBack() {
    if (advancing.current) return;
    if (statementIndex === 0) {
      router.push("/journey");
      return;
    }
    setAttempted(false);
    setReviewingSavedAnswer(true);
    setStatementIndex((index) => index - 1);
  }

  function commitConfidence(value = selectedValue) {
    if (!isReady || advancing.current) return;
    if (!isValidConfidence(value)) {
      setAttempted(true);
      scrollCard.current?.querySelector('[role="slider"]')?.focus();
      return;
    }
    selectConfidence(value);
    playSound(statementIndex === SKILL_ITEMS.length - 1 ? "unlock" : "confirm");
    advancing.current = true;
    setConfirming(true);
  }

  function goNext() {
    if (!isReady || !hasSelectedValue || advancing.current) return;
    if (statementIndex < SKILL_ITEMS.length - 1) {
      setReviewingSavedAnswer(isValidConfidence(session.skills[SKILL_ITEMS[statementIndex + 1].id]));
      setStatementIndex((index) => index + 1);
      return;
    }
    updateSession({ journeyProgress: { skills: SECTION_STATUS.COMPLETED } });
    router.push("/journey");
  }

  function beginTrail() {
    try { browserStorage.setItem(BRIEFING_KEY, "seen"); } catch { /* In-memory dismissal remains available. */ }
    setDismissedBriefing(true);
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests"]}><Localized as="main" className="trail-screen trail-forest game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
      <div className="forest-light" aria-hidden="true" style={{ opacity: statementIndex / 9 }} />
      <div className="forest-mist" aria-hidden="true" />
      <Localized as="div" className="forest-fireflies" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ left: ((index * 29 + 7) % 100) + "%", top: ((index * 17 + 13) % 90) + "%", animationDelay: (-index * 1.7) + "s", animationDuration: (11 + index % 4 * 2) + "s" }} />)}</Localized>

      {showBriefing ? <Card ref={scrollCard} className="forest-card forest-briefing relative max-w-3xl">
        {!confirming && <TrailExit onLeave={() => { discardSection("skills"); router.push("/journey"); }} />}
        <Localized as="h1">The Forest</Localized>
        <Localized as="p">10 statements. Slide to show how confident you feel. There&apos;s no pass or fail here, just be honest with yourself.</Localized>
        <Button label="BEGIN" onClick={beginTrail} />
      </Card> : <Card ref={scrollCard} className="forest-card relative max-w-3xl">
        {!confirming && <TrailExit onLeave={() => { discardSection("skills"); router.push("/journey"); }} />}
        {/* 34 — Section/progress label */}
        <Localized as="p" className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">
          The Forest · Statement {statementIndex + 1} of {SKILL_ITEMS.length}
        </Localized>
        <ForestVine leaves={visibleLeaves} />
        <Localized as="p" className="forest-flavor">{flavor}</Localized>

        <StatementIcon category={currentItem.category} />
        {/* 35 — Statement text */}
        <Localized as="h1" ref={heading} tabIndex={-1} id="forest-statement" className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">
          {currentItem.text}
        </Localized>

        <GrowthSlider key={currentItem.id} value={hasSelectedValue ? selectedValue : undefined} disabled={!isReady || confirming} onChange={selectConfidence} onCommit={commitConfidence} confirming={confirming} labelledBy="forest-statement" invalid={attempted && !hasSelectedValue} describedBy="forest-choice-help" />
        <Localized as="p" id="forest-choice-help" className={attempted && !hasSelectedValue ? "assessment-validation" : "forest-choice-help"} role="status">{attempted && !hasSelectedValue ? "Choose a confidence level from 1 to 5 before continuing." : "Slide or tap a level from 1 to 5, or use the arrow keys to choose a value."}</Localized>

        <Localized as="div" className="forest-actions">
          {/* 37 — Back button */}
          <Button
            label="Back"
            onClick={goBack}
            disabled={confirming}
            className="w-full sm:w-auto"
          />
          {/* Saved answers can be reviewed without selecting them again. */}
          {reviewingSavedAnswer && hasSelectedValue && !confirming && <Button
            label={isFinalStatement ? "Complete Skills" : "Next"}
            onClick={goNext}
            disabled={!isReady || confirming}
            className="w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          />}
        </Localized>
      </Card>}
    </Localized></JourneyAccess>
  );
}
