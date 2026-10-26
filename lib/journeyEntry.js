import { isBasecampComplete, isSectionValid, validatedProgress } from "./assessmentValidation.js";

export function journeyEntry(session) {
  const ready = isBasecampComplete(session);
  const progress = validatedProgress(session);
  const complete = ready && ["interests", "skills", "academic"].every(key => progress[key] === "Completed" && isSectionValid(session, key));
  if (complete) return { href: "/results", label: "VIEW YOUR JOURNEY" };
  if (ready) return { href: "/journey", label: "CONTINUE YOUR JOURNEY" };
  return { href: "/intake", label: "START YOUR JOURNEY" };
}

export function journeyLabel(entry, placement) {
  const labels = {
    hero: ["Begin Exploring", "Keep Exploring", "Open My Map"],
    ending: ["Find My Course Matches", "Finish My Matches", "See My Journey"],
    about: ["Try Career Compass", "Pick Up Where You Left Off", "Revisit My Journey"],
    how: ["Start the Assessment", "Resume the Assessment", "Review My Journey"],
  };
  return labels[placement]?.[entry.href === "/results" ? 2 : entry.href === "/journey" ? 1 : 0] || entry.label;
}
