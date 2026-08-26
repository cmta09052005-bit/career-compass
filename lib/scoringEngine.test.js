/**
 * Manual dry-run personas from docs/scoring-table.md Section 8.
 *
 * No test framework in this repo — run with:
 *   node lib/scoringEngine.test.js
 *
 * Tied courses in C2–C6 are expected (no finalized course tie-breakers).
 * Also covers empty, partial, and invalid-answer edge cases.
 */

import {
  calculateCategoryScores,
  calculateCourseMatches,
  calculateMatchPercentages,
  rankResults,
} from "./scoringEngine.js";
import { SKILLS_WEIGHTS } from "./weightTable.js";

const COURSE_LIST = [
  { courseId: "BSIT-001", courseName: "BS Information Technology", category: "C1" },
  { courseId: "BSCS-001", courseName: "BS Computer Science", category: "C1" },
  { courseId: "BSIS-001", courseName: "BS Information Systems", category: "C1" },
  { courseId: "BSCpE-001", courseName: "BS Computer Engineering", category: "C1" },
  { courseId: "BSCE-001", courseName: "BS Civil Engineering", category: "C2" },
  { courseId: "BSEE-001", courseName: "BS Electrical Engineering", category: "C2" },
  { courseId: "BSECE-001", courseName: "BS Electronics Engineering", category: "C2" },
  { courseId: "BSME-001", courseName: "BS Mechanical Engineering", category: "C2" },
  { courseId: "BSBA-001", courseName: "BS Business Administration", category: "C3" },
  { courseId: "BSA-001", courseName: "BS Accountancy", category: "C3" },
  { courseId: "BSENT-001", courseName: "BS Entrepreneurship", category: "C3" },
  { courseId: "BSHRM-001", courseName: "BS Hospitality Management", category: "C3" },
  { courseId: "BEED-001", courseName: "Bachelor of Elementary Education", category: "C4" },
  { courseId: "BSED-001", courseName: "Bachelor of Secondary Education", category: "C4" },
  { courseId: "BTLE-001", courseName: "Bachelor of Technology and Livelihood Education", category: "C4" },
  { courseId: "BPED-001", courseName: "Bachelor of Physical Education", category: "C4" },
  { courseId: "BSN-001", courseName: "BS Nursing", category: "C5" },
  { courseId: "BSPharma-001", courseName: "BS Pharmacy", category: "C5" },
  { courseId: "BSMLS-001", courseName: "BS Medical Laboratory Science", category: "C5" },
  { courseId: "BSRT-001", courseName: "BS Radiologic Technology", category: "C5" },
  { courseId: "BSArch-001", courseName: "BS Architecture", category: "C6" },
  { courseId: "BFA-001", courseName: "Bachelor of Fine Arts", category: "C6" },
  { courseId: "BSID-001", courseName: "BS Interior Design", category: "C6" },
  { courseId: "BSMA-001", courseName: "BS Multimedia Arts", category: "C6" },
];

function skillsByCategory(highCategories, high = 5, low = 1) {
  const skills = {};
  for (const [itemId, category] of Object.entries(SKILLS_WEIGHTS)) {
    if (itemId === "points" || itemId === "threshold") continue;
    skills[itemId] = highCategories.includes(category) ? high : low;
  }
  return skills;
}

/** Student A — IT-leaning (docs/scoring-table.md). C1 wherever it exists. */
const studentA = {
  name: 'Student A ("IT-leaning")',
  answers: {
    interests: {
      "INT-01": "B", // no C1 → C4
      "INT-02": "A", // C1
      "INT-03": "A", // C1
      "INT-04": "A", // C1
      "INT-05": "A", // C1
      "INT-06": "A", // no C1 → C2
      "INT-07": "B", // no C1 → C4
      "INT-08": "A", // C1
    },
    skills: skillsByCategory(["C1", "C2", "C5"]),
    strand: "Academic-STEM",
    gwa: 92,
    subjects: ["Computer/ICT", "Statistics/Research"],
  },
  expectedTop: "C1",
  expectedPct: 100,
  pctTolerance: 0,
};

/**
 * Student B — Health-leaning. C5 wherever it exists.
 * INT-04 / INT-05 have no C5: C3 and C4 (same leftover pattern as the dry run).
 */
const studentB = {
  name: 'Student B ("Health-leaning")',
  answers: {
    interests: {
      "INT-01": "C", // C5
      "INT-02": "C", // C5
      "INT-03": "C", // C5
      "INT-04": "C", // no C5 → C3
      "INT-05": "D", // no C5 → C4
      "INT-06": "D", // C5
      "INT-07": "C", // C5
      "INT-08": "C", // C5
    },
    skills: skillsByCategory(["C5"]),
    strand: "Sports",
    gwa: 87,
    subjects: ["Biology/General Science", "PE & Health"],
  },
  expectedTop: "C5",
  expectedPct: 97,
  pctTolerance: 1,
};

/**
 * Student C — Business/Arts mix.
 * 4× C3 + 4× C6 interests; C3/C6 skills at 5; ABM; GWA 82 (no GWA bonus);
 * two C3 subjects + one C6 subject → C3 22/25 = 88%, C6 16/26 ≈ 61.5%.
 */
const studentC = {
  name: 'Student C ("Business/Arts mix")',
  answers: {
    interests: {
      "INT-01": "A", // C3
      "INT-02": "D", // C6
      "INT-03": "D", // C6
      "INT-04": "C", // C3
      "INT-05": "C", // C3
      "INT-06": "B", // C3
      "INT-07": "D", // C6
      "INT-08": "D", // C6
    },
    skills: skillsByCategory(["C3", "C6"]),
    strand: "Academic-ABM",
    gwa: 82,
    subjects: [
      "Business Math/Accounting",
      "Economics/Entrepreneurship",
      "MAPEH-Arts",
    ],
  },
  expectedTop: "C3",
  expectedPct: 88,
  pctTolerance: 1,
  expectedSecond: "C6",
};

function runPersona(persona) {
  const scores = calculateCategoryScores(persona.answers);
  const percentages = calculateMatchPercentages(scores);
  const ranked = rankResults(percentages);
  const top = ranked[0];
  const courses = calculateCourseMatches(
    top.category,
    top,
    persona.answers,
    COURSE_LIST,
  );

  const pctOk =
    Math.abs(top.percentage - persona.expectedPct) <= persona.pctTolerance;
  const topOk = top.category === persona.expectedTop && top.isTopMatch;
  const second = ranked[1];
  const secondOk =
    !persona.expectedSecond || second?.category === persona.expectedSecond;
  const verdict = topOk && pctOk && secondOk ? "PASS" : "FAIL";

  return { persona, scores, percentages, ranked, top, courses, verdict, topOk, pctOk, secondOk };
}

function uniqueCoursePercents(courses) {
  return [...new Set(courses.map((c) => c.matchPercentage))];
}

function logResult(result) {
  const { persona, scores, ranked, top, courses, verdict } = result;
  const divider = "============================================================";

  console.log(`\n${divider}`);
  console.log(persona.name);
  console.log(divider);
  console.log("Raw category scores:", scores);
  console.log("\nRanked categories:");
  for (const row of ranked) {
    const flag = row.isTopMatch ? "  ← Top Match" : "";
    console.log(
      `  ${row.category}  ${row.percentage}%  (raw ${row.rawPercentage.toFixed(2)}%)  ${row.label}${flag}`,
    );
  }
  console.log(`\nCourse matches in ${top.category}:`);
  for (const course of courses) {
    console.log(
      `  ${course.courseId.padEnd(12)}  ${String(course.matchPercentage).padStart(3)}%  ${course.courseName}`,
    );
  }

  if (top.category === "C1") {
    const ids = courses.map((c) => c.courseId);
    const byId = Object.fromEntries(courses.map((c) => [c.courseId, c]));
    const bsit = byId["BSIT-001"]?.matchPercentage;
    const bscs = byId["BSCS-001"]?.matchPercentage;
    const bsis = byId["BSIS-001"]?.matchPercentage;
    const bscpe = byId["BSCpE-001"]?.matchPercentage;
    const cappedOk = [bsit, bscs, bscpe].every((pct) => pct === 100);
    const bsisLast = ids[ids.length - 1] === "BSIS-001";
    const boostedAhead = ["BSIT-001", "BSCS-001", "BSCpE-001"].every((id) =>
      ids.indexOf(id) < ids.indexOf("BSIS-001"),
    );
    console.log("\nC1 tie-breaker check (display capped at 100):");
    console.log(
      `  BSIT/BSCS/BSCpE displayed as 100% (not 105%): ${cappedOk ? "PASS" : "FAIL"} (${bsit}/${bscs}/${bscpe})`,
    );
    console.log(`  BSIS-001 displayed: ${bsis}%`);
    console.log(
      `  Boosted courses sort ahead of BSIS-001 (uncapped raw): ${boostedAhead && bsisLast ? "PASS" : "FAIL"} [${ids.join(", ")}]`,
    );
    console.log(
      "  NOTE: SKL-02 is 5, so BSCpE-001 also receives the +5% nudge; after capping, all three boosted courses display 100% and share the same uncapped raw, so they sort alphabetically among themselves.",
    );
  } else {
    const distinct = uniqueCoursePercents(courses);
    console.log(
      `\nNOTE: ${top.category} has no finalized course tie-breakers. All ${courses.length} courses tied at ${courses[0]?.matchPercentage}% is expected, not a bug. Distinct % values: [${distinct.join(", ")}].`,
    );
  }

  console.log(
    `\n>>> ${verdict}: top category ${top.category} (expected ${persona.expectedTop}), ${top.percentage}% (expected ~${persona.expectedPct}%)`,
  );
  if (persona.expectedSecond) {
    console.log(
      `    2nd category ${ranked[1]?.category} (expected ${persona.expectedSecond}): ${result.secondOk ? "PASS" : "FAIL"}`,
    );
  }
}

function scoresEqual(actual, expected) {
  return ["C1", "C2", "C3", "C4", "C5", "C6"].every(
    (id) => actual?.[id] === expected[id],
  );
}

function runEdgeCase(name, answers, assertFn) {
  let threw = false;
  let error = null;
  let scores = null;
  try {
    scores = calculateCategoryScores(answers);
  } catch (err) {
    threw = true;
    error = err;
  }
  const { pass, expected, detail } = assertFn({ threw, error, scores });
  return { name, pass, threw, error, scores, expected, detail };
}

const ZEROS = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0 };

const edgeCases = [
  runEdgeCase(
    "Edge 1 — Empty answers",
    { interests: {}, skills: {}, subjects: [] },
    ({ threw, scores }) => {
      const pass = !threw && scoresEqual(scores, ZEROS);
      return {
        pass,
        expected: ZEROS,
        detail: threw
          ? "threw an error (should not)"
          : `got ${JSON.stringify(scores)}`,
      };
    },
  ),
  runEdgeCase(
    "Edge 2 — Partial answers (3 interests, 4 skills)",
    {
      interests: {
        "INT-02": "A", // C1 +3
        "INT-04": "A", // C1 +3
        "INT-06": "A", // C2 +3
      },
      skills: {
        "SKL-01": 5, // C1 +2
        "SKL-04": 5, // C3 +2
        "SKL-05": 5, // C5 +2
        "SKL-06": 5, // C6 +2
      },
    },
    ({ threw, scores }) => {
      // Missing strand / gwa / subjects contribute 0.
      const expected = { C1: 8, C2: 3, C3: 2, C4: 0, C5: 2, C6: 2 };
      const pass = !threw && scoresEqual(scores, expected);
      return {
        pass,
        expected,
        detail: threw
          ? "threw an error (should not)"
          : `got ${JSON.stringify(scores)}`,
      };
    },
  ),
  runEdgeCase(
    "Edge 3 — Invalid / unrecognized values",
    {
      interests: {
        "INT-01": "Z", // invalid letter → 0
        "INT-02": "A", // valid control → C1 +3
      },
      strand: "Not-A-Real-Strand",
      subjects: ["Underwater Basket Weaving"],
    },
    ({ threw, scores }) => {
      const expected = { C1: 3, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0 };
      const pass = !threw && scoresEqual(scores, expected);
      return {
        pass,
        expected,
        detail: threw
          ? "threw an error (should not)"
          : `got ${JSON.stringify(scores)}`,
      };
    },
  ),
];

function logEdgeCase(result) {
  const divider = "============================================================";
  console.log(`\n${divider}`);
  console.log(result.name);
  console.log(divider);
  if (result.threw) {
    console.log("Threw:", result.error);
  } else {
    console.log("Raw category scores:", result.scores);
    console.log("Expected:           ", result.expected);
  }
  console.log(`\n>>> ${result.pass ? "PASS" : "FAIL"}: ${result.detail}`);
}

const results = [studentA, studentB, studentC].map(runPersona);
results.forEach(logResult);
edgeCases.forEach(logEdgeCase);

const failedPersonas = results.filter((r) => r.verdict === "FAIL");
const failedEdges = edgeCases.filter((r) => !r.pass);
console.log("\n============================================================");
console.log(
  failedPersonas.length === 0
    ? "SUMMARY: all 3 personas PASS top category + percentage checks."
    : `SUMMARY: ${failedPersonas.map((r) => r.persona.name).join("; ")} FAILED.`,
);
console.log(
  failedEdges.length === 0
    ? "SUMMARY: all 3 edge cases PASS (empty / partial / invalid)."
    : `SUMMARY: edge case failures: ${failedEdges.map((r) => r.name).join("; ")}.`,
);
console.log(
  "Tied courses outside Category 1 are expected (no C2–C6 tie-breaker rules yet).",
);

process.exit(failedPersonas.length === 0 && failedEdges.length === 0 ? 0 : 1);
