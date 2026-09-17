export function journeyEntry(session) {
  const complete = ["interests", "skills", "academic"].every(key => session.journeyProgress?.[key] === "Completed");
  if (complete) return { href: "/results", label: "VIEW YOUR JOURNEY" };
  if (session.strand) return { href: "/journey", label: "CONTINUE YOUR JOURNEY" };
  return { href: "/intake", label: "START YOUR JOURNEY" };
}
