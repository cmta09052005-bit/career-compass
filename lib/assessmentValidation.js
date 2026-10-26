import items from "../data/items.json" with { type: "json" };
import { validateSectionAnswers } from "./scoringV2/validate.js";
import { isBasecampComplete } from "./routeResolution.js";
import { sessionAnswerFields } from "./sessionSchema.js";
export { isBasecampComplete } from "./routeResolution.js";

const strand = items.find(item => item.id === "ACA-01");
const gwa = items.find(item => item.id === "ACA-03");
const subjects = items.find(item => item.id === "ACA-04");

export const isValidStrand = value => strand.options.some(option => option.value === value);
export const isValidInterest = (item, value) => item.options.some(option => option.key === value);
export const isValidConfidence = value => Number.isInteger(value) && value >= 1 && value <= 5;
export const isValidGwa = value => Number.isFinite(value) && value >= gwa.min && value <= gwa.max;
export const isValidSubjects = values => Array.isArray(values) && values.length >= 1 && values.length <= subjects.maxSelect && new Set(values).size === values.length && values.every(value => subjects.options.some(option => option.value === value));

export function isSectionValid(session, section) {
  if (!session || !validateSectionAnswers(sessionAnswerFields(session), section).valid) return false;
  if (section !== "academic") return true;
  const flags = session.valleyProgress;
  const active = session.route === "old" ? ["strand", "subjects"] : ["electives", "bestSubjects"];
  return flags?.gwa === true && flags?.certificates === true && active.every(key => flags?.[session.route]?.[key] === true);
}

// A saved completion flag must never unlock a region or report with missing answers.
export function validatedProgress(session) {
  const progress = { ...session.journeyProgress };
  let previousComplete = isBasecampComplete(session);
  for (const section of ["interests", "skills", "academic"]) {
    if (progress[section] === "Completed" && (!previousComplete || !isSectionValid(session, section))) progress[section] = "In Progress";
    previousComplete = previousComplete && progress[section] === "Completed";
  }
  return progress;
}
