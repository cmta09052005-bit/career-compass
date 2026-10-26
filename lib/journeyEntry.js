import { isBasecampComplete, isSectionValid, validatedProgress } from "./assessmentValidation.js";

export function journeyEntry(session) {
  const ready = isBasecampComplete(session);
  const progress = validatedProgress(session);
  const complete = ready && ["interests", "skills", "academic"].every(key => progress[key] === "Completed" && isSectionValid(session, key));
  if (complete) return { href: "/results", label: "VIEW YOUR JOURNEY" };
  if (ready) return { href: "/journey", label: "CONTINUE YOUR JOURNEY" };
  return { href: "/intake", label: "START YOUR JOURNEY" };
}
