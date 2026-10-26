export const ROUTE_LABELS = { old: "Old curriculum - strand", new: "New curriculum - electives" };
export function resolveRoute({ gradeLevel, chosenRoute }) {
  if (gradeLevel === 11) return { route: "new", locked: true, needsSchoolQuestion: false, needsRouteChoice: false };
  if (gradeLevel !== 12) return { route: null, locked: false, needsSchoolQuestion: false, needsRouteChoice: false };
  return { route: ["old", "new"].includes(chosenRoute) ? chosenRoute : null, locked: false, needsSchoolQuestion: false, needsRouteChoice: true };
}
export function isBasecampComplete(session) {
  if (!session || ![11, 12].includes(session.gradeLevel)) return false;
  const resolved = resolveRoute({ ...session, chosenRoute: session.route });
  return resolved.route !== null && session.route === resolved.route;
}
