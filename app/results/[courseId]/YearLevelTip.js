"use client";

import { useSessionAnswers } from "@/lib/useSessionAnswers";

const YEAR_LEVEL_TIPS = {
  "Grade 11":
    "Grade 11 tip: Explore electives and activities connected to this path while you still have time to test your interests.",
  "Grade 12":
    "Grade 12 tip: Start preparing application requirements, deadlines, and supporting documents now.",
};

export default function YearLevelTip() {
  const { session, isReady } = useSessionAnswers();
  if (!isReady) return null;

  const tip = YEAR_LEVEL_TIPS[session.yearLevel];
  if (!tip) return null;

  return (
    <p className="mt-4 rounded-xl border border-teal/30 bg-teal/10 p-4 text-sm leading-6 text-beige/85">
      {tip}
    </p>
  );
}
