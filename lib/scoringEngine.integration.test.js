/**
 * Integration tests for the complete assessment-to-ranked-courses pipeline.
 * Run with: node lib/scoringEngine.integration.test.js
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

function runPipeline(answers) {
  const categoryScores = calculateCategoryScores(answers);
  const categoryPercentages = calculateMatchPercentages(categoryScores);
  const result = createRecommendationResult(
    categoryPercentages,
    answers,
    courses,
  );

  return { categoryScores, categoryPercentages, result };
}

function category(result, categoryCode) {
  return result.categoryPercentages.find(
    (row) => row.category === categoryCode,
  );
}

function course(result, courseId) {
  return result.result.topCourses.find((row) => row.courseId === courseId);
}

function courseRank(result, courseId) {
  return (
    result.result.topCourses.findIndex((row) => row.courseId === courseId) + 1
  );
}

const cases = [
  {
    name: "TEST CASE 1 — IT-leaning student",
    run() {
      const result = runPipeline({
        interests: {
          "INT-01": "B",
          "INT-02": "A",
          "INT-03": "A",
          "INT-04": "A",
          "INT-05": "A",
          "INT-06": "C",
          "INT-07": "B",
          "INT-08": "A",
        },
        skills: Object.fromEntries(
          Array.from({ length: 10 }, (_, index) => [
            `SKL-${String(index + 1).padStart(2, "0")}`,
            3,
          ]),
        ),
        strand: "Academic-STEM",
        gwa: 92,
        subjects: ["Computer/ICT"],
      });

      assert.equal(category(result, "C1").percentage, 84);
      assert.equal(course(result, "BSIT-001").scaledCategoryBase, 73.92);
      assert.equal(course(result, "BSIT-001").courseBonusPoints, 10);
      assert.equal(course(result, "BSIT-001").finalCourseMatchPercent, 84);
      assert.equal(courseRank(result, "BSIT-001"), 1);
      const expectedOrder = ["BSIT-001", "BSCpE-001", "BSCS-001", "BSIS-001"];
      assert.deepEqual(
        result.result.topCourses.slice(0, 4).map((match) => match.courseId),
        expectedOrder,
      );
      for (const courseId of expectedOrder.slice(1)) {
        const match = course(result, courseId);
        assert.equal(match.componentA, 0);
        assert.equal(match.componentD, 0);
        assert.equal(match.courseBonusPoints, 4);
        assert.equal(match.rawScoreBeforeRounding, 77.92);
        assert.equal(match.calculatedCourseMatchPercent, 78);
      }
      assert.deepEqual(
        result.result.topCourses
          .slice(0, 4)
          .map((match) => match.finalCourseMatchPercent),
        [84, 78, 77.99, 77.98],
      );

      return {
        c1: category(result, "C1"),
        topFour: result.result.topCourses.slice(0, 4),
      };
    },
  },
  {
    name: "TEST CASE 2 — Health-leaning, max-signal student",
    run() {
      const result = runPipeline({
        interests: {
          "INT-01": "C",
          "INT-02": "C",
          "INT-03": "C",
          "INT-06": "D",
          "INT-07": "C",
          "INT-08": "C",
        },
        skills: {
          "SKL-01": 3,
          "SKL-02": 3,
          "SKL-03": 3,
          "SKL-04": 3,
          "SKL-05": 5,
          "SKL-06": 3,
          "SKL-07": 3,
          "SKL-08": 3,
          "SKL-09": 5,
          "SKL-10": 3,
        },
        strand: "Sports",
        gwa: 87,
        subjects: ["Biology/General Science", "PE & Health"],
      });

      const c5 = category(result, "C5");
      const c5Courses = result.result.topCourses.slice(0, 4);
      const expectedOrder = [
        "BSN-001",
        "BSPharma-001",
        "BSMLS-001",
        "BSRT-001",
      ];

      assert.ok(
        Math.abs(c5.rawPercentage - 96.66666666666667) < Number.EPSILON * 100,
        `expected C5 raw 96.66666666666667%, received ${c5.rawPercentage}%`,
      );
      assert.equal(c5.percentage, 97);
      // Every C5 course's primary signal is maximized here. Honest score ties
      // use alphabetical order, then display separation makes ranks explicit.
      assert.deepEqual(
        c5Courses.map((row) => row.courseId),
        expectedOrder,
      );
      for (const courseId of expectedOrder) {
        const match = course(result, courseId);
        assert.equal(match.componentA, 6);
        assert.equal(match.componentB, 2);
        assert.equal(match.componentC, 1);
        const hasSecondary = ["BSN-001", "BSPharma-001"].includes(courseId);
        assert.equal(match.componentD, hasSecondary ? 2 : 0);
        assert.equal(match.courseBonusPoints, hasSecondary ? 11 : 9);
        assert.equal(
          match.calculatedCourseMatchPercent,
          hasSecondary ? 96 : 94,
        );
      }
      assert.deepEqual(
        c5Courses.map((match) => match.finalCourseMatchPercent),
        [96, 95.99, 94, 93.99],
      );

      return {
        c5,
        topFour: c5Courses,
      };
    },
  },
  {
    name: "TEST CASE 3 — Realistic partial-signal Architecture/Fine Arts student",
    run() {
      // A raw C6 baseline of exactly 64% is not attainable through integer
      // category points over MAX_POSSIBLE_SCORES.C6 = 26 (16/26 rounds to
      // 62%, while 17/26 rounds to 65%). Use the requested controlled baseline
      // here to isolate and prove the Option C course-level differentiation.
      const c6Courses = calculateAllCourseMatches(
        [
          {
            category: "C6",
            label: "Architecture, Fine Arts & Design",
            percentage: 64,
            rawPercentage: 64,
          },
        ],
        {
          skills: { "SKL-06": 4 },
          strand: "Arts & Design",
          gwa: 92,
          subjects: ["MAPEH-Arts", "TVL-Arts & Design"],
        },
        courses.filter(
          (entry) => entry.category === "Architecture, Fine Arts & Design",
        ),
      );
      const byId = Object.fromEntries(
        c6Courses.map((match) => [match.courseId, match]),
      );
      const expectedOrder = ["BFA-001", "BSID-001", "BSMA-001", "BSArch-001"];

      assert.deepEqual(
        c6Courses.map((match) => match.courseId),
        expectedOrder,
      );
      assert.deepEqual(
        c6Courses.map((match) => match.finalCourseMatchPercent),
        [65, 64, 62, 58],
      );
      assert.equal(byId["BSArch-001"].componentA, 0);
      assert.equal(byId["BFA-001"].componentA, 6);
      assert.equal(byId["BSID-001"].componentA, 6);
      assert.equal(byId["BSMA-001"].componentA, 4);
      for (const match of c6Courses) {
        assert.equal(match.scaledCategoryBase, 56.32);
        assert.equal(match.componentB, 2);
        assert.equal(match.componentC, 0);
      }
      assert.equal(byId["BFA-001"].componentD, 1);
      assert.equal(byId["BFA-001"].rawScoreBeforeRounding, 65.32);
      assert.equal(byId["BSID-001"].rawScoreBeforeRounding, 64.32);

      return {
        controlledCategoryMatchPercent: 64,
        rankedCourses: c6Courses,
      };
    },
  },
  // A student who maximizes every scoring input for a category can produce
  // identical evidence scores. Ranking remains deterministic and the top-five
  // display layer separates those ties by hundredths.
  {
    name: "REGRESSION — multiple course tie-breakers within one category can fire simultaneously and legitimately tie at the cap",
    run() {
      const result = runPipeline({
        interests: {
          "INT-03": "B",
          "INT-04": "B",
          "INT-05": "B",
          "INT-06": "A",
        },
        skills: {
          "SKL-01": 3,
          "SKL-02": 5,
          "SKL-03": 3,
          "SKL-04": 3,
          "SKL-05": 3,
          "SKL-06": 3,
          "SKL-07": 3,
          "SKL-08": 5,
          "SKL-09": 3,
          "SKL-10": 3,
        },
        strand: "TVL",
        gwa: 95,
        subjects: ["Physics", "TVL-Industrial Arts"],
      });

      const c2 = category(result, "C2");
      const expectedTieBreakers = [
        {
          courseId: "BSCE-001",
          condition: "SKL-08 >= 4",
        },
        {
          courseId: "BSEE-001",
          condition: 'subjects includes "Physics"',
        },
        {
          courseId: "BSECE-001",
          condition: 'subjects includes "TVL-Industrial Arts"',
        },
        {
          courseId: "BSME-001",
          condition: "SKL-02 >= 4",
        },
      ];
      const expectedOrder = [
        "BSCE-001",
        "BSEE-001",
        "BSME-001",
        "BSECE-001",
      ];
      const c2Courses = result.result.topCourses.slice(0, 4);

      assert.equal(c2.rawPercentage, 100);
      assert.equal(c2.percentage, 100);
      assert.deepEqual(
        c2Courses.map((row) => row.courseId),
        expectedOrder,
      );
      for (const { courseId } of expectedTieBreakers) {
        const match = course(result, courseId);
        assert.equal(match.componentA, 6);
        assert.equal(match.componentB, 2);
        assert.equal(match.componentC, 2);
        const hasSecondary = courseId !== "BSECE-001";
        assert.equal(match.componentD, hasSecondary ? 2 : 0);
        assert.equal(match.courseBonusPoints, hasSecondary ? 12 : 10);
        assert.equal(match.rawScoreBeforeRounding, hasSecondary ? 100 : 98);
        assert.equal(
          match.calculatedCourseMatchPercent,
          hasSecondary ? 100 : 98,
        );
      }
      assert.deepEqual(
        c2Courses.map((match) => match.finalCourseMatchPercent),
        [100, 99.99, 99.98, 98],
      );

      return {
        c2,
        tieBreakers: expectedTieBreakers,
        finalOrder: c2Courses.map((row) => ({
          courseId: row.courseId,
          courseName: row.courseName,
          rawScoreBeforeRounding: row.rawScoreBeforeRounding,
          finalCourseMatchPercent: row.finalCourseMatchPercent,
        })),
      };
    },
  },
];

let failures = 0;

for (const testCase of cases) {
  try {
    const actual = testCase.run();
    console.log(`PASS: ${testCase.name}`);
    console.log(JSON.stringify(actual, null, 2));
  } catch (error) {
    failures += 1;
    console.error(`FAIL: ${testCase.name}`);
    console.error(error.message);
  }
}

console.log(`\nIntegration summary: ${cases.length - failures}/${cases.length} passed.`);
process.exit(failures === 0 ? 0 : 1);
