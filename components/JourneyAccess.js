"use client";

import Localized from "@/components/Localized";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { isBasecampComplete, isSectionValid, validatedProgress } from "@/lib/assessmentValidation";

export default function JourneyAccess({ session, isReady, requires = [], children }) {
  const ready = isBasecampComplete(session);
  const progress = validatedProgress(session);
  const missing = requires.find((region) => progress[region] !== "Completed" || !isSectionValid(session, region));
  const regionName = { interests: "The Mountains", skills: "The Forest", academic: "The Valley" }[missing];
  if (isReady && ready && !missing) return children;
  return <main className="game-ui-screen explorer-map-screen flex min-h-svh items-center justify-center px-4 py-10"><Card className="text-center"><Localized as="h1" className="font-serif text-3xl">{!isReady ? "Opening your journal" : !ready ? "Start at Basecamp" : "There is a trail to finish first"}</Localized><Localized as="p" className="my-6" role="status">{!isReady ? "Restoring your saved progress..." : !ready ? "Choose your grade and curriculum at Basecamp." : `Complete all required answers in ${regionName} before continuing. Your map shows the next available region.`}</Localized>{isReady && <Button href={ready ? "/journey" : "/intake"} label={ready ? "Back to The Atlas" : "Go to Basecamp"} />}</Card></main>;
}
