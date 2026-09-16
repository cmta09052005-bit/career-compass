"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import JourneyAccess from "@/components/JourneyAccess";
import Card from "@/components/Card";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { playSound } from "@/lib/sound";
import { calculateCategoryScores, calculateMatchPercentages, createRecommendationResult } from "@/lib/scoringEngine";
import courses from "@/data/courses.json";
import StatementIcon from "@/app/journey/skills/StatementIcon";
import "./processing.css";

gsap.registerPlugin(useGSAP);

const STATUS_MESSAGES = [
  "Weighing what excites you...",
  "Looking at your skills...",
  "Checking your academic strengths...",
  "Matching you to the map...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const { session, isReady } = useSessionAnswers();
  const [statusIndex, setStatusIndex] = useState(0);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const compass = useRef(null);
  const canProcess = isReady && Boolean(session.strand) && Object.values(session.journeyProgress).every(value => value === "Completed");
  const resultsReady = useMemo(() => canProcess && createRecommendationResult(calculateMatchPercentages(calculateCategoryScores(session)), session, courses).topCourses.length > 0, [canProcess, session]);

  useGSAP(() => {
    if (!canProcess) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = gsap.timeline();
    if (!reduced) {
      gsap.set(".course-needle", { svgOrigin: "50 50", rotation: -32 });
      [-58, 37, -24, 46, -15, 12, -6, 3, 0].forEach((rotation, index) => {
        timeline.to(".course-needle", { rotation, duration: index < 4 ? .6 : .36, ease: "sine.inOut" });
      });
    }
    [0, 1.3, 2.6, 3.9].forEach((time, index) => timeline.call(() => setStatusIndex(index), [], time));
    [0, .6, 1.2, 1.8, 2.4, 3, 3.6].forEach(time => timeline.call(() => playSound("tap", { volume: .12 }), [], time));
    timeline.call(() => playSound("unlock", { volume: .38 }), [], 4.2);
    timeline.fromTo(".course-lock-ring", { opacity: 0, scale: 1 }, { opacity: .9, scale: reduced ? 1 : 1.12, duration: .25 }, 4.2)
      .to(".course-lock-ring", { opacity: .3, scale: 1, duration: .35 })
      .call(() => setSequenceComplete(true), [], 5.2);
  }, { scope: compass, dependencies: [canProcess], revertOnUpdate: true });
  useEffect(() => {
    if (sequenceComplete && resultsReady) router.replace("/results");
  }, [sequenceComplete, resultsReady, router]);

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills", "academic"]}><main className="processing-screen game-ui-screen explorer-map-screen relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden px-5 py-12 text-beige">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_42%,#305774_0%,#1b2a4a_42%,#10182b_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 [background-image:repeating-radial-gradient(circle_at_center,transparent_0,transparent_54px,rgba(212,160,23,0.16)_55px,transparent_56px)]"
      />

      <Card variant="processing" className="map-paper rounded-2xl p-8 sm:p-12">
        {/* 45 — Heading */}
        <h1 className="font-serif text-4xl leading-tight text-[#3b261c] sm:text-5xl md:text-6xl">
          Charting Your Course
        </h1>

        {/* 46 — Supporting subtext */}
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#604532] sm:text-base">
          {session.nickname ? `${session.nickname}, your` : "Your"} answers are being compared with the course list. Your matches will be ready in a moment.
        </p>

        {/* 47 — Loading animation area */}
        <div
          ref={compass}
          className="relative mx-auto mt-10 flex h-32 w-32 items-center justify-center"
          aria-hidden="true"
        >
          <span className="course-lock-ring absolute inset-0 rounded-full border border-gold/45" />
          <span className="absolute inset-3 rounded-full border border-teal/35" />
          <svg
            viewBox="0 0 100 100"
            className="h-24 w-24 drop-shadow-[0_0_20px_rgba(212,160,23,0.35)]"
          >
            <circle cx="50" cy="50" r="44" fill="#1b2a4a" stroke="#d4a017" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#f5ecd7" strokeOpacity=".25" />
            <g className="course-needle"><path d="M50 15 58 50 50 45 42 50Z" fill="#d4a017" />
            <path d="M50 85 58 50 50 55 42 50Z" fill="#2dbfb8" /></g>
            <circle cx="50" cy="50" r="5" fill="#f5ecd7" />
          </svg>
        </div>

        {/* 48 — Staged status text */}
        <div className="mt-8" role="status" aria-live="polite" aria-atomic="true">
          <p key={statusIndex} className="course-status text-sm font-semibold text-gold sm:text-base">
            {statusIndex === 2 ? <StatementIcon category="C4" /> : <Image src={statusIndex === 3 ? "/landing-compass.png" : `/icons/career-compass/${statusIndex === 0 ? "mountain-peak" : "pine-branch"}.svg`} width={32} height={32} alt="" />}
            {isReady ? STATUS_MESSAGES[statusIndex] : "Restoring your trail..."}
          </p>
          <div className="mx-auto mt-4 flex w-fit gap-2" aria-hidden="true">
            {STATUS_MESSAGES.map((message, index) => (
              <span
                key={message}
                data-active={index <= statusIndex && isReady}
                className="course-trail-segment"
              />
            ))}
          </div>
        </div>
      </Card>
    </main></JourneyAccess>
  );
}
