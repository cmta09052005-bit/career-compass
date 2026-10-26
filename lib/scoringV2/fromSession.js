import { validateAnswers } from "./validate.js";
import { isBasecampComplete } from "../routeResolution.js";
import { sessionAnswerFields, SESSION_SCHEMA_VERSION } from "../sessionSchema.js";

export function fromSession(session) {
  if (!session || typeof session !== "object" || Array.isArray(session)) return { ok: false, answers: null, errors: [{ code: "TYPE", path: "$", message: "Expected a saved session." }] };
  const fields = sessionAnswerFields(session);
  const answers = {
    ...fields,
    interests: fields.interests && typeof fields.interests === "object" ? { ...fields.interests } : fields.interests,
    skills: fields.skills && typeof fields.skills === "object" ? { ...fields.skills } : fields.skills,
    certificates: Array.isArray(fields.certificates) ? [...fields.certificates] : fields.certificates,
  };
  if (fields.old) answers.old = { ...fields.old, subjects: Array.isArray(fields.old.subjects) ? [...fields.old.subjects] : fields.old.subjects };
  if (fields.new) answers.new = { ...fields.new, electives: Array.isArray(fields.new.electives) ? [...fields.new.electives] : fields.new.electives, bestSubjects: Array.isArray(fields.new.bestSubjects) ? [...fields.new.bestSubjects] : fields.new.bestSubjects };
  const errors = [...validateAnswers(answers).errors];
  if (session.schemaVersion !== SESSION_SCHEMA_VERSION) errors.push({ code: "SESSION_VERSION", path: "schemaVersion", message: "Migrate the saved session before scoring." });
  // Basecamp resolves from grade and chosen curriculum; pilotSchoolId is unused.
  if (!isBasecampComplete(session)) errors.push({ code: "BASECAMP_INCOMPLETE", path: "route", message: "Complete Basecamp before scoring." });
  for (const key of ["gwa", "certificates"]) if (session.valleyProgress?.[key] !== true) errors.push({ code: "UNANSWERED", path: `valleyProgress.${key}`, message: "Confirm this Valley answer before scoring." });
  if (["old", "new"].includes(session.route)) {
    const keys = session.route === "old" ? ["strand", "subjects"] : ["electives", "bestSubjects"];
    for (const key of keys) if (session.valleyProgress?.[session.route]?.[key] !== true) errors.push({ code: "UNANSWERED", path: `valleyProgress.${session.route}.${key}`, message: "Confirm this Valley answer before scoring." });
  }
  return { ok: errors.length === 0, answers, errors };
}
