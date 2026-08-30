"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toggle from "@/components/Toggle";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";

const GUIDE_STORAGE_KEY = "careerCompassJourneyGuideSeen";

const ISLANDS = [
  {
    id: "interests",
    label: "Interests",
    mapLabel: "INTERESTS",
    description: "Discover what naturally draws your curiosity",
    route: "/journey/interests",
    icon: "✦",
  },
  {
    id: "skills",
    label: "Skills",
    mapLabel: "SKILLS",
    description: "Discover where your strengths lead",
    route: "/journey/skills",
    icon: "◆",
  },
  {
    id: "academic",
    label: "Academic Performance",
    mapLabel: "ACADEMICS",
    description: "See how your academic background supports your path",
    route: "/journey/academic",
    icon: "▲",
  },
];

function getIslandState(id, progress) {
  if (progress[id] === SECTION_STATUS.COMPLETED) return "completed";
  if (id === "interests") return "unlocked";
  if (
    id === "skills" &&
    progress.interests === SECTION_STATUS.COMPLETED
  ) {
    return "unlocked";
  }
  if (
    id === "academic" &&
    progress.skills === SECTION_STATUS.COMPLETED
  ) {
    return "unlocked";
  }
  return "locked";
}

function stateLabel(state, progressStatus) {
  if (state === "completed") return "Completed";
  if (state === "locked") return "Locked";
  return progressStatus === SECTION_STATUS.IN_PROGRESS
    ? "In Progress"
    : "Available";
}

export default function JourneyPage() {
  const router = useRouter();
  const { session, isReady, updateSession, resetSession } = useSessionAnswers();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const guideRef = useRef(null);
  const islandRefs = useRef({});
  const progress = session.journeyProgress;
  const completedCount = ISLANDS.filter(
    ({ id }) => progress[id] === SECTION_STATUS.COMPLETED,
  ).length;
  const allCompleted = completedCount === ISLANDS.length;
  const hasStarted = ISLANDS.some(
    ({ id }) => progress[id] !== SECTION_STATUS.NOT_STARTED,
  );
  const nextIsland = ISLANDS.find(
    ({ id }) => getIslandState(id, progress) === "unlocked",
  );
  const progressItems = ISLANDS.map((island) => {
    const state = getIslandState(island.id, progress);
    return {
      id: island.id,
      label: island.label,
      state,
      status: stateLabel(state, progress[island.id]),
      icon: state === "completed" ? "✓" : state === "locked" ? "⌕" : "•",
    };
  });

  useEffect(() => {
    if (!isReady || !guideRef.current || guideRef.current.open) return;
    try {
      if (!window.sessionStorage.getItem(GUIDE_STORAGE_KEY)) {
        guideRef.current.showModal();
      }
    } catch {
      // The guide remains available from its button if storage is unavailable.
    }
  }, [isReady]);

  function openGuide() {
    if (guideRef.current && !guideRef.current.open) {
      guideRef.current.showModal();
    }
  }

  function closeGuide() {
    try {
      window.sessionStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } catch {
      // Session storage is optional; closing the dialog should always work.
    }
    guideRef.current?.close();
  }

  function visitIsland(island) {
    if (getIslandState(island.id, progress) === "locked") return;
    if (progress[island.id] === SECTION_STATUS.NOT_STARTED) {
      updateSession({
        journeyProgress: { [island.id]: SECTION_STATUS.IN_PROGRESS },
      });
    }
    router.push(island.route);
  }

  function handlePrimaryAction() {
    if (allCompleted) {
      router.push("/processing");
      return;
    }
    if (nextIsland) visitIsland(nextIsland);
  }

  function locateNextIsland() {
    if (!nextIsland) return;
    const element = islandRefs.current[nextIsland.id];
    if (!element) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
      inline: "center",
    });
    element.focus({ preventScroll: true });
    element.animate(
      reduceMotion
        ? [{ opacity: 0.72 }, { opacity: 1 }]
        : [
            { transform: "scale(0.97)", opacity: 0.8 },
            { transform: "scale(1)", opacity: 1 },
          ],
      {
        duration: 250,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    );
  }

  function restartAssessment() {
    resetSession();
    setSettingsOpen(false);
  }

  return (
    <main className="explorer-map-screen relative isolate min-h-svh flex-1 overflow-hidden text-beige">
      {/* 14 — Map background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_55%,rgba(179,140,82,.14),transparent_46%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 -z-10 h-full w-full opacity-55"
      >
        <defs>
          <radialGradient id="island" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#f4d39f" stopOpacity=".4" />
            <stop offset="55%" stopColor="#2dbfb8" stopOpacity=".18" />
            <stop offset="100%" stopColor="#24150f" stopOpacity="0" />
          </radialGradient>
          <pattern id="waves" width="72" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 16 Q18 4 36 16 T72 16" fill="none" stroke="#f5ecd7" strokeOpacity=".09" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="1200" height="760" fill="url(#waves)" />
        <ellipse cx="250" cy="450" rx="235" ry="190" fill="url(#island)" />
        <ellipse cx="610" cy="250" rx="250" ry="200" fill="url(#island)" />
        <ellipse cx="970" cy="480" rx="235" ry="190" fill="url(#island)" />
        <path className="map-route" d="M250 450 C380 390 470 300 610 250 S850 360 970 480" fill="none" stroke="#f3d9b5" strokeOpacity=".62" strokeWidth="4" />
      </svg>

      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
        <header className="map-wood-bar flex items-start justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="map-ribbon text-[0.68rem] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
              Explorer&apos;s Log
            </p>
            <h1 className="mt-3 font-serif text-3xl text-beige sm:text-4xl">
              Your Journey Map
            </h1>
            {session.nickname ? (
              <p className="mt-1 text-sm text-beige/80">
                Welcome back, {session.nickname}.
              </p>
            ) : null}
          </div>

          <div className="relative flex gap-2">
            {/* 23 — Journey Guide icon */}
            <button
              type="button"
              onClick={openGuide}
              aria-label="Open Journey Guide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-beige/25 bg-navy/60 text-lg text-beige transition-[border-color,background-color,transform] duration-150 hover:border-teal hover:bg-teal/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.97]"
            >
              ?
            </button>

            {/* 19 — Settings icon */}
            <button
              type="button"
              onClick={() => setSettingsOpen((open) => !open)}
              aria-label="Open journey settings"
              aria-expanded={settingsOpen}
              aria-controls="journey-settings"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-beige/25 bg-navy/60 text-xl text-beige transition-[border-color,background-color,transform] duration-150 hover:border-gold hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal active:scale-[0.97]"
            >
              ⚙
            </button>
            {settingsOpen ? (
              <div
                id="journey-settings"
                className="absolute right-0 top-14 z-30 w-64 rounded-2xl border border-gold/30 bg-[#15213b] p-4 shadow-2xl"
              >
                <p className="font-serif text-lg">Journey Settings</p>
                <Toggle
                  label="Sound placeholder"
                  enabled={soundOn}
                  onClick={() => setSoundOn((enabled) => !enabled)}
                  className="mt-3"
                />
                <button
                  type="button"
                  onClick={restartAssessment}
                  className="mt-2 w-full rounded-lg border border-orange/50 px-3 py-2 text-left text-sm text-orange hover:bg-orange/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
                >
                  Restart Assessment
                </button>
              </div>
            ) : null}
          </div>
        </header>

        {/* 18 — Compass Points progress indicator */}
        <ProgressIndicator
          items={progressItems}
          completedCount={completedCount}
        />

        <section className="my-7 grid flex-1 content-center gap-5 md:grid-cols-3 md:gap-7">
          {/* 15 — Island marker 1: Interests */}
          {/* 16 — Island marker 2: Skills */}
          {/* 17 — Island marker 3: Academic Performance */}
          {ISLANDS.map((island, index) => {
            const state = getIslandState(island.id, progress);
            const status = stateLabel(state, progress[island.id]);
            const isLocked = state === "locked";
            const indicator = 15 + index;
            return (
              <article
                key={island.id}
                className={`relative ${index === 1 ? "md:-translate-y-10" : ""}`}
              >
                <Card
                  as="button"
                  ref={(element) => {
                    islandRefs.current[island.id] = element;
                  }}
                  variant="island"
                  state={state}
                  type="button"
                  disabled={!isReady || isLocked}
                  onClick={() => visitIsland(island)}
                  aria-label={`${island.label}: ${status}. ${island.description}`}
                  data-indicator={indicator}
                >
                  <Badge
                    state={state}
                    variant="icon"
                    icon={state === "completed" ? "✓" : isLocked ? "🔒" : island.icon}
                    aria-hidden="true"
                  />
                  <span className="map-ribbon mt-4 text-xs font-extrabold tracking-[0.16em]">
                    CHAPTER {index + 1} · {island.mapLabel}
                  </span>
                  <span className={`mt-3 text-sm font-semibold leading-5 ${isLocked ? "text-beige/65" : "text-[#4b3022]"}`}>
                    {island.description}
                  </span>
                  <Badge
                    state={state}
                    label={status}
                    className="mt-4"
                  />
                </Card>
              </article>
            );
          })}
        </section>

        <footer className="flex flex-col items-center gap-4 text-center">
          {/* 21 — Session reminder text */}
          <p className="text-xs text-beige/90">
            Your progress is temporary and not saved after this session.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {/* 24 — Locate Me button */}
            <Button
              label="◎ Locate Me"
              variant="map-secondary"
              onClick={locateNextIsland}
              disabled={!isReady || allCompleted}
            />

            {/* 20 — View My Results button (shown after all sections complete) */}
            {/* 22 — Start / Continue Assessment button */}
            <Button
              label={
                allCompleted
                  ? "View My Results"
                  : hasStarted
                    ? "Continue Assessment"
                    : "Start Assessment"
              }
              variant="map-primary"
              onClick={handlePrimaryAction}
              disabled={!isReady}
              className="font-bold tracking-[0.16em] transition-[background-color,transform] duration-150 active:scale-[0.97] disabled:cursor-wait disabled:opacity-50"
            />
          </div>
        </footer>
      </div>

      <dialog
        ref={guideRef}
        aria-labelledby="journey-guide-title"
        className="m-auto w-[min(90vw,32rem)] rounded-3xl border border-gold/35 bg-[#15213b] p-0 text-beige shadow-2xl backdrop:bg-[#080d18]/75"
        onCancel={(event) => {
          event.preventDefault();
          closeGuide();
        }}
      >
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">
            Journey Guide
          </p>
          <h2 id="journey-guide-title" className="mt-2 font-serif text-3xl">
            Follow the compass trail
          </h2>
          <p className="mt-3 text-sm leading-6 text-beige/90">
            Begin with Interests. Completing an island unlocks the next one.
            Completed islands display a checkmark, while locked islands show a
            lock. Use Locate Me whenever you need help finding your next stop.
          </p>
          <button
            type="button"
            onClick={closeGuide}
            className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          >
            Begin Exploring
          </button>
        </div>
      </dialog>
    </main>
  );
}
