import Button from "@/components/Button";
import Card from "@/components/Card";

export default function JourneyAccess({ session, isReady, requires = [], children }) {
  const missing = requires.some((region) => session.journeyProgress[region] !== "Completed");
  if (isReady && session.strand && !missing) return children;
  return <main className="game-ui-screen explorer-map-screen flex min-h-svh items-center justify-center px-4 py-10"><Card className="text-center"><h1 className="font-serif text-3xl">{!isReady ? "Opening your journal" : !session.strand ? "Start at Basecamp" : "There is a trail to finish first"}</h1><p className="my-6" role="status">{!isReady ? "Restoring this tab's progress..." : !session.strand ? "Add your strand and choose an explorer to begin." : "Your map shows the next available region. Finish the trails before opening your results."}</p>{isReady && <Button href={session.strand ? "/journey" : "/intake"} label={session.strand ? "Back to The Atlas" : "Go to Basecamp"} />}</Card></main>;
}
