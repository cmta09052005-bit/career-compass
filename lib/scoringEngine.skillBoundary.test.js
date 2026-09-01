/**
 * Boundary/regression coverage for skill rating 4.
 * Run with: node lib/scoringEngine.skillBoundary.test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateAllCourseMatches,
  calculateCategoryScores,
  calculateMatchPercentages,
  createRecommendationResult,
} from "./scoringEngine.js";

const courses = JSON.parse(
  readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"),
);

const SKILL_BOUNDARY_CASES = [
  ["SKL-01", "C1", "BSIS-001"],
  ["SKL-02", "C2", "BSME-001"],
  ["SKL-03", "C4", "BTLE-001"],
  ["SKL-04", "C3", "BSHRM-001"],
  ["SKL-05", "C5", "BSRT-001"],
  ["SKL-06", "C6", "BSMA-001"],
  ["SKL-07", "C3", "BSBA-001"],
  ["SKL-08", "C2", "BSCE-001"],
  ["SKL-09", "C5", "BSN-001"],
  ["SKL-10", "C4", "BEED-001"],
];

for (const [skillId, category, courseId] of SKILL_BOUNDARY_CASES) {
  const answers = { skills: { [skillId]: 4 } };
  const scores = calculateCategoryScores(answers);
  assert.equal(scores[category], 2, `${skillId}=4 should add 2 to ${category}`);

  const match = calculateAllCourseMatches(
    [{ category, percentage: 0, rawPercentage: 0 }],
    answers,
    [courses.find((course) => course.courseId === courseId)],
  )[0];
  assert.equal(
    match.componentA,
    4,
    `${skillId}=4 should give ${courseId} componentA=4`,
  );
}

const reproductionAnswers = {
  interests: {
    "INT-02": "A",
    "INT-03": "A",
    "INT-04": "A",
    "INT-05": "A",
    "INT-08": "A",
  },
  skills: {
    "SKL-01": 4,
    "SKL-02": 3,
    "SKL-03": 3,
    "SKL-04": 3,
    "SKL-05": 3,
    "SKL-06": 3,
    "SKL-07": 3,
    "SKL-08": 3,
    "SKL-09": 3,
    "SKL-10": 3,
  },
  strand: "Academic-STEM",
  gwa: 88,
  subjects: ["Computer/ICT", "Physics", "English/Communication Arts"],
};
const reproductionScores = calculateCategoryScores(reproductionAnswers);
const reproductionPercentages = calculateMatchPercentages(reproductionScores);
const reproductionResult = createRecommendationResult(
  reproductionPercentages,
  reproductionAnswers,
  courses,
);
const c1 = reproductionPercentages.find((row) => row.category === "C1");
const c1Courses = Object.fromEntries(
  reproductionResult.topCourses
    .filter((course) => course.categoryCode === "C1")
    .map((course) => [course.courseId, course]),
);

assert.equal(reproductionScores.C1, 22);
assert.equal(c1.percentage, 88);
assert.equal(c1Courses["BSIT-001"].finalCourseMatchPercent, 87);
assert.equal(c1Courses["BSIS-001"].componentA, 4);
assert.equal(c1Courses["BSIS-001"].finalCourseMatchPercent, 84);
assert.equal(c1Courses["BSCpE-001"].finalCourseMatchPercent, 82);
assert.equal(c1Courses["BSCS-001"].finalCourseMatchPercent, 80);

console.log("PASS: SKL-01=4 adds 2 to CategoryScore(C1) and gives BSIS-001 componentA=4.");
console.log("PASS: secondary-signal formula produces C1=88%, BSIT=87%, BSIS=84%, BSCpE=82%, BSCS=80%.");
console.log("PASS: SKL-01 through SKL-10 all trigger category and course effects at exactly 4.");
