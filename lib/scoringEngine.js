/**
 * Career Compass — category scoring engine (rule-based, no AI/ML).
 *
 * Recomputes CategoryScore(C) from scratch on every call
 * (instructions.md Section 6 / scoring-engine conventions).
 * Pure: no I/O, no mutation of inputs, same answers → same scores.
 */

import {
  CATEGORY_LABELS,
  GWA_WEIGHTS,
  INTERESTS_WEIGHTS,
  MAX_POSSIBLE_SCORES,
  SKILLS_WEIGHTS,
  STRAND_WEIGHTS,
  SUBJECTS_WEIGHTS,
} from "./weightTable.js";

const CATEGORY_IDS = ["C1", "C2", "C3", "C4", "C5", "C6"];

// Derived directly from weightTable.js so a future item-bank change (e.g.
// adding INT-09) is picked up automatically, with no second list to update.
const INTEREST_ITEM_IDS = Object.keys(INTERESTS_WEIGHTS).filter(
  (key) => key !== "points",
);

const SKILL_ITEM_IDS = Object.keys(SKILLS_WEIGHTS).filter(
  (key) => key !== "points" && key !== "threshold",
);

function emptyScores() {
  return { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0 };
}

function addPoints(scores, category, points) {
  if (!CATEGORY_IDS.includes(category) || !points) return;
  scores[category] += points;
}

function skillRating(skills, itemId) {
  const rating = Number(skills?.[itemId]);
  return Number.isFinite(rating) ? rating : null;
}

function matchGwaTier(gwa) {
  const value = Number(gwa);
  if (!Number.isFinite(value)) return null;

  for (const tier of GWA_WEIGHTS) {
    const minOk =
      tier.minInclusive == null || value >= tier.minInclusive;
    const maxOk =
      tier.maxExclusive == null || value < tier.maxExclusive;
    if (minOk && maxOk) return tier;
  }

  return null;
}

/**
 * Session answers from Interests + Skills + Academic Performance.
 *
 * Year level (ACA-02) is not scored and is ignored if present.
 *
 * @typedef {Object} AssessmentAnswers
 * @property {Object<string, string>} interests
 *   Selected option letter per interest item, e.g. `{ "INT-01": "A" }`.
 *   Letters A–D (case-insensitive). Missing / unknown letters add 0.
 * @property {Object<string, number>} skills
 *   Slider value (1–5) per skill item, e.g. `{ "SKL-01": 4 }`.
 *   Awards SKILLS_WEIGHTS.points only when value >= SKILLS_WEIGHTS.threshold.
 * @property {string} strand
 *   One of: "Academic-STEM", "Academic-ABM", "Academic-HUMSS",
 *   "TVL", "Arts & Design", "Sports".
 * @property {number} gwa
 *   General Weighted Average (ACA-03). Tiers: >=90 → +2 to C1,C2,C5;
 *   >=85 and <90 → +1 to C1,C2,C5; <85 → 0.
 * @property {string[]} subjects
 *   Best-performing subjects (ACA-04). Labels must match SUBJECTS_WEIGHTS
 *   keys (e.g. "Computer/ICT"). Up to 3 unique valid selections are scored;
 *   extras and unknown labels are ignored.
 */

/**
 * Sums raw category points from a full answer set.
 * Does not compute match percentages or course rankings.
 *
 * @param {AssessmentAnswers} [answers]
 * @returns {{ C1: number, C2: number, C3: number, C4: number, C5: number, C6: number }}
 */
export function calculateCategoryScores(answers) {
  const scores = emptyScores();
  const input = answers ?? {};
  const interests = input.interests ?? {};
  const skills = input.skills ?? {};

  for (const itemId of INTEREST_ITEM_IDS) {
    const letter = String(interests[itemId] ?? "")
      .trim()
      .toUpperCase();
    const category = INTERESTS_WEIGHTS[itemId]?.[letter];
    addPoints(scores, category, INTERESTS_WEIGHTS.points);
  }

  for (const itemId of SKILL_ITEM_IDS) {
    const value = skillRating(skills, itemId);
    if (value == null || value < SKILLS_WEIGHTS.threshold) {
      continue;
    }
    addPoints(scores, SKILLS_WEIGHTS[itemId], SKILLS_WEIGHTS.points);
  }

  const strandCategories = STRAND_WEIGHTS[input.strand];
  if (Array.isArray(strandCategories)) {
    for (const category of strandCategories) {
      addPoints(scores, category, STRAND_WEIGHTS.points);
    }
  }

  const gwaTier = matchGwaTier(input.gwa);
  if (gwaTier) {
    for (const category of gwaTier.categories) {
      addPoints(scores, category, gwaTier.points);
    }
  }

  const seenSubjects = new Set();
  let scoredSubjectCount = 0;
  const selectedSubjects = Array.isArray(input.subjects)
    ? input.subjects
    : [];

  for (const label of selectedSubjects) {
    if (scoredSubjectCount >= 3) break;
    if (typeof label !== "string" || seenSubjects.has(label)) continue;
    const category = SUBJECTS_WEIGHTS[label];
    if (!category) continue;
    seenSubjects.add(label);
    addPoints(scores, category, SUBJECTS_WEIGHTS.points);
    scoredSubjectCount += 1;
  }

  return scores;
}

/**
 * One category's match percentage for display and ranking.
 *
 * @typedef {Object} CategoryMatchPercentage
 * @property {string} category
 * @property {string} label
 * @property {number} percentage Rounded Match % (nearest integer)
 * @property {number} rawPercentage Unrounded Match % for tie-breaking
 */

/**
 * Converts raw category points to MatchPercentage(C)
 * = (CategoryScore(C) ÷ MaxPossibleScore(C)) × 100.
 *
 * Always returns C1–C6 in that order. Missing scores are treated as 0.
 * Does not rank or mutate `categoryScores`.
 *
 * @param {{ C1?: number, C2?: number, C3?: number, C4?: number, C5?: number, C6?: number }} [categoryScores]
 * @returns {CategoryMatchPercentage[]}
 */
export function calculateMatchPercentages(categoryScores) {
  const scores = categoryScores ?? {};

  return CATEGORY_IDS.map((category) => {
    const maxPossible = MAX_POSSIBLE_SCORES[category];
    const rawScore = Number(scores[category]);
    const safeScore = Number.isFinite(rawScore) ? rawScore : 0;
    const rawPercentage =
      maxPossible > 0 ? (safeScore / maxPossible) * 100 : 0;

    return {
      category,
      label: CATEGORY_LABELS[category],
      percentage: Math.round(rawPercentage),
      rawPercentage,
    };
  });
}

/**
 * Ranked category result with top-match flag.
 *
 * @typedef {CategoryMatchPercentage & { isTopMatch: boolean }} RankedCategoryResult
 */

/**
 * Sorts match rows highest → lowest rounded percentage.
 * Ties: higher rawPercentage, then alphabetical by label.
 * Only the first row after that sort is `isTopMatch: true`.
 * Does not mutate the input array or its objects.
 *
 * @param {CategoryMatchPercentage[]} [categoryPercentages]
 * @returns {RankedCategoryResult[]}
 */
export function rankResults(categoryPercentages) {
  const sorted = [...(categoryPercentages ?? [])].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    if (b.rawPercentage !== a.rawPercentage) {
      return b.rawPercentage - a.rawPercentage;
    }
    return String(a.label ?? "").localeCompare(String(b.label ?? ""));
  });

  return sorted.map((row, index) => ({
    ...row,
    isTopMatch: index === 0,
  }));
}

const CATEGORY_BASE_SCALE = 0.88;
const GWA_CATEGORIES = new Set(["C1", "C2", "C5"]);

const COURSE_PRIMARY_SIGNALS = {
  "BSIT-001": { type: "subject", value: "Computer/ICT" },
  "BSCS-001": { type: "subject", value: "Statistics/Research" },
  "BSIS-001": { type: "skill", value: "SKL-01" },
  "BSCpE-001": { type: "skill", value: "SKL-02" },
  "BSCE-001": { type: "skill", value: "SKL-08" },
  "BSEE-001": { type: "subject", value: "Physics" },
  "BSECE-001": { type: "subject", value: "TVL-Industrial Arts" },
  "BSME-001": { type: "skill", value: "SKL-02" },
  "BSBA-001": { type: "skill", value: "SKL-07" },
  "BSA-001": { type: "subject", value: "Business Math/Accounting" },
  "BSENT-001": { type: "subject", value: "Economics/Entrepreneurship" },
  "BSHRM-001": { type: "skill", value: "SKL-04" },
  "BEED-001": { type: "skill", value: "SKL-10" },
  "BSED-001": { type: "subject", value: "English/Communication Arts" },
  "BTLE-001": { type: "skill", value: "SKL-03" },
  "BPED-001": { type: "subject", value: "Filipino/Araling Panlipunan" },
  "BSN-001": { type: "skill", value: "SKL-09" },
  "BSPharma-001": { type: "subject", value: "PE & Health" },
  "BSMLS-001": { type: "subject", value: "Biology/General Science" },
  "BSRT-001": { type: "skill", value: "SKL-05" },
  "BSArch-001": { type: "subject", value: "Physics" },
  "BFA-001": { type: "subject", value: "MAPEH-Arts" },
  "BSID-001": { type: "subject", value: "TVL-Arts & Design" },
  "BSMA-001": { type: "skill", value: "SKL-06" },
};

const COURSE_SECONDARY_SIGNALS = {
  "BSIT-001": { type: "skill", value: "SKL-01" },
  "BSCS-001": { type: "skill", value: "SKL-03" },
  "BSIS-001": { type: "subject", value: "Business Math/Accounting" },
  "BSCpE-001": { type: "subject", value: "Physics" },
  "BSCE-001": { type: "subject", value: "Physics" },
  "BSEE-001": { type: "skill", value: "SKL-02" },
  "BSECE-001": { type: "skill", value: "SKL-01" },
  "BSME-001": { type: "skill", value: "SKL-08" },
  "BSBA-001": { type: "subject", value: "Economics/Entrepreneurship" },
  "BSA-001": { type: "skill", value: "SKL-04" },
  "BSENT-001": { type: "skill", value: "SKL-07" },
  "BSHRM-001": { type: "skill", value: "SKL-10" },
  "BEED-001": { type: "skill", value: "SKL-03" },
  "BSED-001": { type: "skill", value: "SKL-10" },
  "BTLE-001": { type: "skill", value: "SKL-08" },
  "BPED-001": { type: "subject", value: "PE & Health" },
  "BSN-001": { type: "skill", value: "SKL-05" },
  "BSPharma-001": { type: "subject", value: "Biology/General Science" },
  "BSMLS-001": { type: "subject", value: "Statistics/Research" },
  "BSRT-001": { type: "subject", value: "Physics" },
  "BSArch-001": { type: "skill", value: "SKL-08" },
  "BFA-001": { type: "skill", value: "SKL-06" },
  "BSID-001": { type: "skill", value: "SKL-02" },
  "BSMA-001": { type: "subject", value: "Computer/ICT" },
};

function resolveCategoryId(topCategory) {
  if (CATEGORY_IDS.includes(topCategory)) return topCategory;
  return (
    CATEGORY_IDS.find((id) => CATEGORY_LABELS[id] === topCategory) ?? null
  );
}

function toBasePercentage(categoryMatchPercentage) {
  if (
    typeof categoryMatchPercentage === "number" &&
    Number.isFinite(categoryMatchPercentage)
  ) {
    return categoryMatchPercentage;
  }
  if (
    categoryMatchPercentage &&
    typeof categoryMatchPercentage === "object"
  ) {
    const raw = Number(categoryMatchPercentage.rawPercentage);
    if (Number.isFinite(raw)) return raw;
    const rounded = Number(categoryMatchPercentage.percentage);
    if (Number.isFinite(rounded)) return rounded;
  }
  return 0;
}

function hasSubject(answers, label) {
  const subjects = answers?.subjects;
  return Array.isArray(subjects) && subjects.includes(label);
}

function primarySignalPoints(courseId, answers) {
  const signal = COURSE_PRIMARY_SIGNALS[courseId];
  if (!signal) return 0;
  if (signal.type === "subject") {
    return hasSubject(answers, signal.value) ? 6 : 0;
  }

  const rating = skillRating(answers?.skills, signal.value);
  if (rating === 5) return 6;
  if (rating === 4) return 4;
  return 0;
}

function secondarySignalPoints(courseId, answers) {
  const signal = COURSE_SECONDARY_SIGNALS[courseId];
  if (!signal) return 0;
  if (signal.type === "subject") {
    return hasSubject(answers, signal.value) ? 2 : 0;
  }

  const rating = skillRating(answers?.skills, signal.value);
  if (rating === 5) return 2;
  if (rating === 4) return 1;
  return 0;
}

function courseComponents(categoryId, courseId, answers) {
  const componentA = primarySignalPoints(courseId, answers);
  const strandCategories = STRAND_WEIGHTS[answers?.strand];
  const componentB = strandCategories?.includes(categoryId) ? 2 : 0;
  const gwaTier = GWA_CATEGORIES.has(categoryId)
    ? matchGwaTier(answers?.gwa)
    : null;
  const componentC = gwaTier?.points ?? 0;
  const componentD = secondarySignalPoints(courseId, answers);

  return {
    componentA,
    componentB,
    componentC,
    componentD,
    courseBonusPoints: componentA + componentB + componentC + componentD,
  };
}

/**
 * One course's category-based match result.
 *
 * @typedef {Object} CourseMatchResult
 * @property {string} courseId
 * @property {string} courseName
 * @property {string|null} categoryCode
 * @property {string} categoryName
 * @property {number} categoryMatchPercent Rounded category Match %
 * @property {number} [scaledCategoryBase] Debug-level category Match % × 0.88
 * @property {number} [componentA] Debug-level primary course signal points
 * @property {number} [componentB] Debug-level strand alignment points
 * @property {number} [componentC] Debug-level GWA tier alignment points
 * @property {number} [componentD] Debug-level secondary course evidence points
 * @property {number} [courseBonusPoints] Debug-level sum of components A, B, C, and D
 * @property {number} rawScoreBeforeRounding Uncapped scaled base plus bonus
 * @property {number} calculatedCourseMatchPercent Evidence-based score, rounded and capped at 100
 * @property {number} finalCourseMatchPercent Display score; top-five ties may be separated by hundredths
 * @property {number} [displayTieAdjustment] Display-only difference from the calculated score
 */

/**
 * Ranks all course matches highest to lowest without mutating the input.
 * Ties: higher unrounded raw score, then alphabetical by course name.
 * Exact raw-score ties are accepted (for example, when every course signal
 * in a category is maximized); no additional differentiation is invented.
 * Never truncates the ranked list.
 *
 * @param {CourseMatchResult[]} [courseMatches]
 * @returns {CourseMatchResult[]}
 */
export function rankAllCourses(courseMatches) {
  return [...(courseMatches ?? [])].sort((a, b) => {
    const aCalculated =
      a.calculatedCourseMatchPercent ?? a.finalCourseMatchPercent;
    const bCalculated =
      b.calculatedCourseMatchPercent ?? b.finalCourseMatchPercent;
    if (bCalculated !== aCalculated) {
      return bCalculated - aCalculated;
    }
    if (b.rawScoreBeforeRounding !== a.rawScoreBeforeRounding) {
      return b.rawScoreBeforeRounding - a.rawScoreBeforeRounding;
    }
    return String(a.courseName ?? "").localeCompare(
      String(b.courseName ?? ""),
    );
  });
}

/**
 * Separates equal displayed percentages in the top five by hundredths while
 * preserving each course's evidence-based score for audit and ranking.
 *
 * @param {CourseMatchResult[]} rankedMatches
 * @returns {CourseMatchResult[]}
 */
export function separateTopFiveDisplayTies(rankedMatches) {
  const matches = (rankedMatches ?? []).map((match) => ({ ...match }));
  const topCount = Math.min(5, matches.length);

  for (let start = 0; start < topCount; ) {
    const calculated = matches[start].calculatedCourseMatchPercent;
    let end = start + 1;
    while (
      end < topCount &&
      matches[end].calculatedCourseMatchPercent === calculated
    ) {
      end += 1;
    }

    const groupSize = end - start;
    for (let offset = 0; offset < groupSize; offset += 1) {
      const displayScore =
        calculated === 0
          ? (groupSize - offset - 1) / 100
          : calculated - offset / 100;
      matches[start + offset].finalCourseMatchPercent = Number(
        displayScore.toFixed(2),
      );
      matches[start + offset].displayTieAdjustment = Number(
        (displayScore - calculated).toFixed(2),
      );
    }

    start = end;
  }

  return matches;
}

export function formatMatchPercent(value) {
  const percentage = Number(value);
  if (!Number.isFinite(percentage)) return "0";
  return Number.isInteger(percentage)
    ? String(percentage)
    : percentage.toFixed(2);
}

/**
 * Computes course-level matches for every course in the dataset.
 * Each course uses 88% of its category's raw Match % as its base, then adds
 * primary, strand, applicable GWA, and secondary evidence components.
 *
 * @param {CategoryMatchPercentage[]} [categoryPercentages]
 * @param {AssessmentAnswers} [answers]
 * @param {Array<{ courseId: string, courseName: string, category: string }>} [courseList]
 * @returns {CourseMatchResult[]}
 */
export function calculateAllCourseMatches(
  categoryPercentages,
  answers,
  courseList,
) {
  const percentages = Array.isArray(categoryPercentages)
    ? categoryPercentages
    : [];

  const courseMatches = (courseList ?? []).map((course) => {
    const categoryCode = resolveCategoryId(course?.category);
    const categoryName = categoryCode
      ? CATEGORY_LABELS[categoryCode]
      : String(course?.category ?? "");
    const categoryMatch = percentages.find(
      (row) =>
        row?.category === categoryCode ||
        row?.category === categoryName ||
        row?.label === categoryName,
    );
    const basePercentage = toBasePercentage(categoryMatch);
    const scaledCategoryBase = basePercentage * CATEGORY_BASE_SCALE;
    const components = courseComponents(
      categoryCode,
      course?.courseId,
      answers,
    );
    const rawScoreBeforeRounding =
      scaledCategoryBase + components.courseBonusPoints;

    const calculatedCourseMatchPercent = Math.round(
      Math.min(100, rawScoreBeforeRounding),
    );

    return {
      courseId: course?.courseId,
      courseName: course?.courseName,
      categoryCode,
      categoryName,
      categoryMatchPercent: Math.round(basePercentage),
      scaledCategoryBase,
      ...components,
      rawScoreBeforeRounding,
      calculatedCourseMatchPercent,
      finalCourseMatchPercent: calculatedCourseMatchPercent,
      displayTieAdjustment: 0,
    };
  });

  return separateTopFiveDisplayTies(rankAllCourses(courseMatches));
}

/**
 * Builds the assessment result DTO with courses as the primary result and the
 * strongest category retained only as supplementary context.
 *
 * @param {CategoryMatchPercentage[]} [categoryPercentages]
 * @param {AssessmentAnswers} [answers]
 * @param {Array<{ courseId: string, courseName: string, category: string }>} [courseList]
 * @returns {{ topCourses: CourseMatchResult[], strongestCategory: RankedCategoryResult|null }}
 */
export function createRecommendationResult(
  categoryPercentages,
  answers,
  courseList,
) {
  return {
    topCourses: calculateAllCourseMatches(
      categoryPercentages,
      answers,
      courseList,
    ),
    strongestCategory: rankResults(categoryPercentages)[0] ?? null,
  };
}

/**
 * Ranks the four courses in the top category.
 * Each course starts at 88% of the category Match %, then adds its evidence
 * components. Displayed matchPercentage is capped at 100 after rounding.
 *
 * @param {string} topCategory Category id ("C1") or full CATEGORY_LABELS name
 * @param {number | { percentage?: number, rawPercentage?: number }} categoryMatchPercentage
 *   Category Match % (number), or a row from calculateMatchPercentages()
 * @param {AssessmentAnswers} [answers]
 * @param {Array<{ courseId: string, courseName: string, category: string }>} [courseList]
 * @returns {Array<{ courseId: string, courseName: string, matchPercentage: number }>}
 */
export function calculateCourseMatches(
  topCategory,
  categoryMatchPercentage,
  answers,
  courseList,
) {
  const categoryId = resolveCategoryId(topCategory);
  const categoryLabel = categoryId
    ? CATEGORY_LABELS[categoryId]
    : topCategory;
  const basePercentage = toBasePercentage(categoryMatchPercentage);

  const inTopCategory = (course) => {
    const field = course?.category;
    return (
      field === topCategory ||
      field === categoryId ||
      field === categoryLabel
    );
  };

  const ranked = (courseList ?? [])
    .filter(inTopCategory)
    .map((course) => {
      const scaledCategoryBase = basePercentage * CATEGORY_BASE_SCALE;
      const components = courseComponents(
        categoryId,
        course.courseId,
        answers,
      );
      const rawPercentage =
        scaledCategoryBase + components.courseBonusPoints;
      return {
        courseId: course.courseId,
        courseName: course.courseName,
        percentage: Math.round(Math.min(100, rawPercentage)),
        rawPercentage,
      };
    })
    .sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      if (b.rawPercentage !== a.rawPercentage) {
        return b.rawPercentage - a.rawPercentage;
      }
      return String(a.courseName ?? "").localeCompare(
        String(b.courseName ?? ""),
      );
    });

  return ranked.map((row) => ({
    courseId: row.courseId,
    courseName: row.courseName,
    matchPercentage: row.percentage,
  }));
}
