import items from "../data/items.json" with { type: "json" };

const interests = items.filter(item => item.section === "Interests");
const skills = items.filter(item => item.section === "Skills");
const strand = items.find(item => item.id === "ACA-01");
const gwa = items.find(item => item.id === "ACA-03");
const subjects = items.find(item => item.id === "ACA-04");

export const isValidStrand = value => strand.options.some(option => option.value === value);
export const isValidInterest = (item, value) => item.options.some(option => option.key === value);
export const isValidConfidence = value => Number.isInteger(value) && value >= 1 && value <= 5;
export const isValidGwa = value => Number.isFinite(value) && value >= gwa.min && value <= gwa.max;
export const isValidSubjects = values => Array.isArray(values) && values.length >= 1 && values.length <= subjects.maxSelect && new Set(values).size === values.length && values.every(value => subjects.options.some(option => option.value === value));

export function isSectionValid(session, section) {
  if (section === "interests") return interests.every(item => isValidInterest(item, session.interests?.[item.id]));
  if (section === "skills") return skills.every(item => isValidConfidence(session.skills?.[item.id]));
  if (section === "academic") return isValidStrand(session.strand) && isValidGwa(session.gwa) && isValidSubjects(session.subjects);
  return false;
}

// A saved completion flag must never unlock a region or report with missing answers.
export function validatedProgress(session) {
  const progress = { ...session.journeyProgress };
  let previousComplete = isValidStrand(session.strand);
  for (const section of ["interests", "skills", "academic"]) {
    if (progress[section] === "Completed" && (!previousComplete || !isSectionValid(session, section))) progress[section] = "In Progress";
    previousComplete = previousComplete && progress[section] === "Completed";
  }
  return progress;
}
