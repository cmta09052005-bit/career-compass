"use client";

import Localized from "@/components/Localized";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { isValidStrand, isSectionValid } from "@/lib/assessmentValidation";

export default function JourneyAccess({ session, isReady, requires = [], children }) {
  const hasStrand = isValidStrand(session.strand);
  const missing = requires.find((region) => session.journeyProgress[region] !== "Completed" || !isSectionValid(session, region));
  const regionName = { interests: "The Mountains", skills: "The Forest", academic: "The Valley" }[missing];
  if (isReady && hasStrand && !missing) return children;
  return <main className="game-ui-screen explorer-map-screen flex min-h-svh items-center justify-center px-4 py-10"><Card className="text-center"><Localized as="h1" className="font-serif text-3xl">{!isReady ? "Opening your journal" : !hasStrand ? "Start at Basecamp" : "There is a trail to finish first"}</Localized><Localized as="p" className="my-6" role="status">{!isReady ? "Restoring your saved progress..." : !hasStrand ? "Choose your strand at Basecamp to begin." : `Complete all required answers in ${regionName} before continuing. Your map shows the next available region.`}</Localized>{isReady && <Button href={hasStrand ? "/journey" : "/intake"} label={hasStrand ? "Back to The Atlas" : "Go to Basecamp"} />}</Card></main>;
}
