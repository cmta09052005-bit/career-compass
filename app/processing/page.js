"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

const STATUS_MESSAGES = [
  "Analyzing interests...",
  "Mapping strengths...",
  "Reviewing academic trail...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const { session, isReady } = useSessionAnswers();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!isReady) return;

    const timers = [
      window.setTimeout(() => setStatusIndex(1), 850),
      window.setTimeout(() => setStatusIndex(2), 1700),
      window.setTimeout(() => router.replace("/results"), 2700),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [isReady, router]);

  return (
    <main className="relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-navy px-5 py-12 text-beige">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_42%,#305774_0%,#1b2a4a_42%,#10182b_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 [background-image:repeating-radial-gradient(circle_at_center,transparent_0,transparent_54px,rgba(212,160,23,0.16)_55px,transparent_56px)]"
      />

      <Card variant="processing">
        {/* 45 — Heading */}
        <h1 className="font-serif text-4xl leading-tight text-beige sm:text-5xl md:text-6xl">
          Charting Your Course
        </h1>

        {/* 46 — Supporting subtext */}
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-beige/90 sm:text-base">
          {session.nickname ? `${session.nickname}, your` : "Your"} compass
          points are coming together. We’re tracing the paths that best match
          your journey.
        </p>

        {/* 47 — Loading animation area */}
        <div
          className="relative mx-auto mt-10 flex h-32 w-32 items-center justify-center"
          aria-hidden="true"
        >
          <span className="processing-compass-pulse absolute inset-0 rounded-full border border-gold/45" />
          <span className="absolute inset-3 rounded-full border border-teal/35" />
          <svg
            viewBox="0 0 100 100"
            className="processing-compass h-24 w-24 drop-shadow-[0_0_20px_rgba(212,160,23,0.35)]"
          >
            <circle cx="50" cy="50" r="44" fill="#1b2a4a" stroke="#d4a017" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="#f5ecd7" strokeOpacity=".25" />
            <path d="M50 15 58 50 50 45 42 50Z" fill="#d4a017" />
            <path d="M50 85 58 50 50 55 42 50Z" fill="#2dbfb8" />
            <circle cx="50" cy="50" r="5" fill="#f5ecd7" />
          </svg>
        </div>

        {/* 48 — Staged status text */}
        <div className="mt-8" role="status" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold sm:text-base">
            {isReady ? STATUS_MESSAGES[statusIndex] : "Restoring your trail..."}
          </p>
          <div className="mx-auto mt-4 flex w-fit gap-2" aria-hidden="true">
            {STATUS_MESSAGES.map((message, index) => (
              <span
                key={message}
                className={`h-1.5 w-8 rounded-full transition-colors duration-200 ${
                  index <= statusIndex && isReady ? "bg-gold" : "bg-beige/15"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}
