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
    const value = Number(skills[itemId]);
    if (!Number.isFinite(value) || value < SKILLS_WEIGHTS.threshold) {
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

const TIE_BREAKER_BONUS = 5;

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

/**
 * Course-level +5% nudges within a winning category.
 * Finalized rules for C1–C6 (docs/scoring-table.md Section 6).
 *
 * @param {string} categoryId C1–C6
 * @param {string} courseId
 * @param {AssessmentAnswers} [answers]
 * @returns {number} 0 or 5 (spec allows up to two +5 nudges per course later)
 */
function courseTieBreakerBonus(categoryId, courseId, answers) {
  const input = answers ?? {};

  switch (categoryId) {
    case "C1": {
      // Template pattern for other categories: one case per courseId.
      switch (courseId) {
        case "BSIT-001":
          return hasSubject(input, "Computer/ICT") ? TIE_BREAKER_BONUS : 0;
        case "BSCS-001":
          return hasSubject(input, "Statistics/Research")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSIS-001":
          return 0;
        case "BSCpE-001": {
          const slider = Number(input.skills?.["SKL-02"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        default:
          return 0;
      }
    }

    case "C2": {
      switch (courseId) {
        case "BSCE-001": {
          const slider = Number(input.skills?.["SKL-08"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        case "BSEE-001":
          return hasSubject(input, "Physics") ? TIE_BREAKER_BONUS : 0;
        case "BSECE-001":
          return hasSubject(input, "TVL-Industrial Arts")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSME-001": {
          const slider = Number(input.skills?.["SKL-02"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        default:
          return 0;
      }
    }

    case "C3": {
      switch (courseId) {
        case "BSBA-001": {
          const slider = Number(input.skills?.["SKL-04"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        case "BSA-001":
          return hasSubject(input, "Business Math/Accounting")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSENT-001":
          return hasSubject(input, "Economics/Entrepreneurship")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSHRM-001": {
          const slider = Number(input.skills?.["SKL-07"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        default:
          return 0;
      }
    }

    case "C4": {
      switch (courseId) {
        case "BEED-001": {
          const slider = Number(input.skills?.["SKL-10"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        case "BSED-001":
          return hasSubject(input, "English/Communication Arts")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BTLE-001":
          return hasSubject(input, "TVL-Industrial Arts")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BPED-001":
          return hasSubject(input, "PE & Health") ? TIE_BREAKER_BONUS : 0;
        default:
          return 0;
      }
    }

    case "C5": {
      switch (courseId) {
        case "BSN-001": {
          const slider = Number(input.skills?.["SKL-09"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        case "BSPharma-001":
          return hasSubject(input, "Biology/General Science")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSMLS-001":
          return hasSubject(input, "Statistics/Research")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSRT-001":
          return hasSubject(input, "Physics") ? TIE_BREAKER_BONUS : 0;
        default:
          return 0;
      }
    }

    case "C6": {
      switch (courseId) {
        case "BFA-001":
          return hasSubject(input, "MAPEH-Arts") ? TIE_BREAKER_BONUS : 0;
        case "BSID-001":
          return hasSubject(input, "TVL-Arts & Design")
            ? TIE_BREAKER_BONUS
            : 0;
        case "BSMA-001": {
          const slider = Number(input.skills?.["SKL-06"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        case "BSArch-001": {
          const slider = Number(input.skills?.["SKL-08"]);
          return Number.isFinite(slider) && slider >= SKILLS_WEIGHTS.threshold
            ? TIE_BREAKER_BONUS
            : 0;
        }
        default:
          return 0;
      }
    }

    default:
      return 0;
  }
}

/**
 * Ranks the four courses in the top category.
 * Each course starts at the category Match %, then a documented rule may add a
 * +5% nudge. Displayed matchPercentage is capped at 100 (round after
 * Math.min(100, base + bonus)); uncapped raw is kept for sort/tie-break.
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
      const bonus = courseTieBreakerBonus(
        categoryId,
        course.courseId,
        answers,
      );
      const rawPercentage = basePercentage + bonus;
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
