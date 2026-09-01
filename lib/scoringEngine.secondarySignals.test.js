/**
 * Complete-profile regression for the secondary course-evidence formula.
 * Run with: node lib/scoringEngine.secondarySignals.test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  calculateCategoryScores,
  calculateMatchPercentages,
  createRecommendationResult,
} from "./scoringEngine.js";

const courses = JSON.parse(
  readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"),
);

const answers = {
  interests: {
    "INT-01": "B",
    "INT-02": "A",
    "INT-03": "A",
    "INT-04": "A",
    "INT-05": "A",
    "INT-06": "A",
    "INT-07": "B",
    "INT-08": "A",
  },
  skills: {
    "SKL-01": 4,
    "SKL-02": 3,
    "SKL-03": 3,
    "SKL-04": 2,
    "SKL-05": 2,
    "SKL-06": 3,
    "SKL-07": 2,
    "SKL-08": 3,
    "SKL-09": 2,
    "SKL-10": 5,
  },
  strand: "Academic-STEM",
  gwa: 88,
  subjects: ["Computer/ICT", "Physics", "English/Communication Arts"],
};

const scores = calculateCategoryScores(answers);
const percentages = calculateMatchPercentages(scores);
const result = createRecommendationResult(percentages, answers, courses);
const actual = result.topCourses.map((course) => [
  course.courseId,
  course.finalCourseMatchPercent,
]);
const expected = [
  ["BSIT-001", 87],
  ["BSIS-001", 84],
  ["BSCpE-001", 82],
  ["BSCS-001", 80],
  ["BSED-001", 39],
  ["BSEE-001", 38],
  ["BEED-001", 37],
  ["BSCE-001", 34],
  ["BSECE-001", 33],
  ["BSME-001", 32],
  ["BPED-001", 31],
  ["BTLE-001", 31],
  ["BSRT-001", 14],
  ["BSMLS-001", 12],
  ["BSN-001", 12],
  ["BSPharma-001", 12],
  ["BSArch-001", 6],
  ["BSHRM-001", 2],
  ["BSMA-001", 2],
  ["BFA-001", 0],
  ["BSA-001", 0],
  ["BSBA-001", 0],
  ["BSENT-001", 0],
  ["BSID-001", 0],
];

assert.deepEqual(scores, { C1: 22, C2: 8, C3: 0, C4: 10, C5: 3, C6: 0 });
assert.deepEqual(actual, expected);
assert.equal(new Set(actual.slice(0, 5).map(([, percent]) => percent)).size, 5);
assert.ok(result.topCourses.every((course) => Object.hasOwn(course, "componentD")));

const allZeroResult = createRecommendationResult(
  calculateMatchPercentages(calculateCategoryScores({})),
  {},
  courses,
);
const allZeroTopFive = allZeroResult.topCourses.slice(0, 5);
assert.deepEqual(
  allZeroTopFive.map((course) => course.calculatedCourseMatchPercent),
  [0, 0, 0, 0, 0],
);
assert.deepEqual(
  allZeroTopFive.map((course) => course.finalCourseMatchPercent),
  [0.04, 0.03, 0.02, 0.01, 0],
);
assert.equal(
  new Set(allZeroTopFive.map((course) => course.finalCourseMatchPercent)).size,
  5,
);
assert.ok(
  allZeroResult.topCourses.slice(5).every(
    (course) => course.finalCourseMatchPercent === 0,
  ),
);

console.log("PASS: complete sample profile matches all 24 expected course percentages.");
console.log("PASS: sample profile's top five displayed percentages are all distinct.");
console.log("PASS: even five identical zero scores receive unique top-five display percentages while their calculated scores remain unchanged.");
