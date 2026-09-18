import assert from "node:assert/strict";
import items from "../data/items.json" with { type: "json" };
import { isValidConfidence, isValidGwa, isValidInterest, isValidStrand, isValidSubjects, isSectionValid, validatedProgress } from "./assessmentValidation.js";

const subjectOptions = items.find(item => item.id === "ACA-04").options.map(option => option.value);
for (let count = 0; count <= 4; count++) {
  assert.equal(isValidSubjects(subjectOptions.slice(0, count)), count >= 1 && count <= 3, `${count} subjects`);
}
assert.equal(isValidSubjects([subjectOptions[0], subjectOptions[0]]), false);
assert.equal(isValidSubjects(["Unknown"]), false);
assert.equal(isValidSubjects(null), false);
for (const value of [null, "90", NaN, Infinity, 74.99, 100.01]) assert.equal(isValidGwa(value), false);
for (const value of [75, 85.5, 100]) assert.equal(isValidGwa(value), true);
for (const value of [undefined, 0, 1.5, 6, "4"]) assert.equal(isValidConfidence(value), false);
for (const value of [1, 2, 3, 4, 5]) assert.equal(isValidConfidence(value), true);
assert.equal(isValidStrand("Academic-STEM"), true);
assert.equal(isValidStrand("points"), false);
assert.equal(isValidStrand(""), false);
const interestItems = items.filter(item => item.section === "Interests");
assert.equal(isValidInterest(interestItems[0], "A"), true);
assert.equal(isValidInterest(interestItems[0], "Z"), false);

const complete = {
  strand: "Academic-STEM", gwa: 90, subjects: [subjectOptions[0]],
  interests: Object.fromEntries(interestItems.map(item => [item.id, "A"])),
  skills: Object.fromEntries(items.filter(item => item.section === "Skills").map(item => [item.id, 3])),
  journeyProgress: { interests: "Completed", skills: "Completed", academic: "Completed" },
};
assert.deepEqual(validatedProgress(complete), complete.journeyProgress);
for (const section of ["interests", "skills", "academic"]) assert.equal(isSectionValid(complete, section), true);
const missingInterest = { ...complete, interests: { ...complete.interests, "INT-03": undefined } };
assert.deepEqual(validatedProgress(missingInterest), { interests: "In Progress", skills: "In Progress", academic: "In Progress" });
const missingSkill = { ...complete, skills: { ...complete.skills, "SKL-10": 6 } };
assert.deepEqual(validatedProgress(missingSkill), { interests: "Completed", skills: "In Progress", academic: "In Progress" });
assert.equal(validatedProgress({ ...complete, subjects: [] }).academic, "In Progress");
assert.equal(validatedProgress({ ...complete, gwa: null }).academic, "In Progress");
assert.equal(validatedProgress({ ...complete, strand: "" }).interests, "In Progress");
assert.equal(complete.journeyProgress.academic, "Completed", "validation must not mutate the saved session");
console.log("Assessment validation: subject counts 0–4, invalid answers, and restored progression passed.");
