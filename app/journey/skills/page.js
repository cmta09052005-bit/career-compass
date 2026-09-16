"use client";

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
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";
import { playSound } from "@/lib/sound";

gsap.registerPlugin(useGSAP);

const SKILL_ITEMS = items.filter((item) => item.section === "Skills");
const BRIEFING_KEY = "careerCompassForestBriefing";

export default function SkillsPage() {
  const router = useRouter();
  const scrollCard = useRef(null);
  const { session, isReady, updateSession, discardSection } = useSessionAnswers();
  const [activeStatement, setActiveStatement] = useState(null);
  const firstUnanswered = SKILL_ITEMS.findIndex(item => !Number.isFinite(session.skills[item.id]));
  const statementIndex = activeStatement ?? (firstUnanswered < 0 ? 9 : firstUnanswered);
  function setStatementIndex(next) {
    setActiveStatement(typeof next === "function" ? next(statementIndex) : next);
  }
  const [dismissedBriefing, setDismissedBriefing] = useState(false);
  let seenBriefing = false;
  try { seenBriefing = sessionStorage.getItem(BRIEFING_KEY) === "seen"; } catch { /* In-memory dismissal remains available. */ }
  const showBriefing = !dismissedBriefing && !seenBriefing && !Object.keys(session.skills).length;
  const heading = useRef(null);
  const [confirming, setConfirming] = useState(false);
  const advancing = useRef(false);
  const lastRustle = useRef("");
  useEffect(() => {
    if (scrollCard.current) scrollCard.current.scrollTop = 0;
    if (isReady && !showBriefing) heading.current?.focus({ preventScroll: true });
  }, [statementIndex, isReady, showBriefing]);
  useUnsavedProgressWarning(true);

  const currentItem = SKILL_ITEMS[statementIndex];
  const selectedValue = session.skills[currentItem.id];
  const hasSelectedValue = Number.isFinite(selectedValue);
  const isFinalStatement = statementIndex === SKILL_ITEMS.length - 1;
  useGSAP(() => {
    if (!confirming || !scrollCard.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(".forest-growth-stage[data-selected=true]", { boxShadow: "0 0 0px #bbc66300" }, { boxShadow: "0 0 24px #bbc663aa", duration: reduced ? 0 : .2 });
    gsap.delayedCall(.6, () => {
      if (statementIndex < SKILL_ITEMS.length - 1) {
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
    if (!isReady || advancing.current) return;
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
    setStatementIndex((index) => index - 1);
  }

  function goNext(value = selectedValue) {
    if (!isReady || !Number.isFinite(value) || advancing.current) return;
    selectConfidence(value);
    playSound(statementIndex === SKILL_ITEMS.length - 1 ? "unlock" : "confirm");
    advancing.current = true;
    setConfirming(true);
  }

  function beginTrail() {
    try { sessionStorage.setItem(BRIEFING_KEY, "seen"); } catch { /* In-memory dismissal remains available. */ }
    setDismissedBriefing(true);
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests"]}><main className="trail-screen trail-forest game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-beige sm:px-6">
      {!confirming && <TrailExit onLeave={() => { discardSection("skills"); router.push("/journey"); }} />}
      <div className="forest-light" aria-hidden="true" style={{ opacity: statementIndex / 9 }} />
      <div className="forest-mist" aria-hidden="true" />
      <div className="forest-fireflies" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ left: ((index * 29 + 7) % 100) + "%", top: ((index * 17 + 13) % 90) + "%", animationDelay: (-index * 1.7) + "s", animationDuration: (11 + index % 4 * 2) + "s" }} />)}</div>

      {showBriefing ? <Card ref={scrollCard} className="forest-card forest-briefing relative max-w-3xl">
        <h1>The Forest</h1>
        <p>10 statements. Slide to show how confident you feel. There&apos;s no pass or fail here, just be honest with yourself.</p>
        <Button label="BEGIN" onClick={beginTrail} />
      </Card> : <Card ref={scrollCard} className="forest-card relative max-w-3xl">
        {/* 34 — Section/progress label */}
        <p className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">
          The Forest · Statement {statementIndex + 1} of {SKILL_ITEMS.length}
        </p>
        <ForestVine leaves={visibleLeaves} />
        <p className="forest-flavor">{flavor}</p>

        <StatementIcon category={currentItem.category} />
        {/* 35 — Statement text */}
        <h1 ref={heading} tabIndex={-1} id="forest-statement" className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">
          {currentItem.text}
        </h1>

        <GrowthSlider key={currentItem.id} value={selectedValue} disabled={!isReady || confirming} onChange={selectConfidence} onCommit={isFinalStatement ? undefined : goNext} confirming={confirming} labelledBy="forest-statement" />

        <div className="forest-actions">
          {/* 37 — Back button */}
          <Button
            label="Back"
            onClick={goBack}
            disabled={confirming}
            className="w-full sm:w-auto"
          />
          <Button label={isFinalStatement ? "Complete Forest" : "Next"} className="forest-complete" onClick={() => goNext()} disabled={!hasSelectedValue || confirming} />
        </div>
      </Card>}
    </main></JourneyAccess>
  );
}
