/**
 * Career Compass — Rule / Weight Scoring Table
 *
 * Data-only lookup tables for the rule-based engine (no functions).
 * Source: instructions.md Sections 5–6.
 *
 * CategoryScore(C) is the sum of points C receives from Interests + Skills +
 * Academic Performance. Match % = CategoryScore(C) / MaxPossibleScore(C) × 100.
 *
 * Category IDs (C1–C6) MUST stay aligned with items.json / courses.json labels.
 */

/** Full display names — match items.json / courses.json exactly. */
export const CATEGORY_LABELS = {
  C1: "Information Technology & Computing",
  C2: "Engineering & Technology",
  C3: "Business Administration & Related",
  C4: "Education Science & Teacher Training",
  C5: "Medical & Allied Health Sciences",
  C6: "Architecture, Fine Arts & Design",
};

/**
 * (a) Interests — INT-01…INT-08.
 * Each selected option awards +3 to exactly one category.
 * Coverage (32 options): C1×5, C2×4, C3×5, C4×6, C5×6, C6×6
 * → max interest points: C1:15, C2:12, C3:15, C4:18, C5:18, C6:18
 *
 * Option letters A–D are scoring keys. Scenario copy lives in items.json;
 * those option category tags MUST match this table.
 *
 * Confirmed from instructions.md Section 5 / docs/item-bank.md.
 */
export const INTERESTS_WEIGHTS = {
  points: 3,
  "INT-01": { A: "C3", B: "C4", C: "C5", D: "C6" },
  "INT-02": { A: "C1", B: "C4", C: "C5", D: "C6" },
  "INT-03": { A: "C1", B: "C2", C: "C5", D: "C6" },
  "INT-04": { A: "C1", B: "C2", C: "C3", D: "C6" },
  "INT-05": { A: "C1", B: "C2", C: "C3", D: "C4" },
  "INT-06": { A: "C2", B: "C3", C: "C4", D: "C5" },
  "INT-07": { A: "C3", B: "C4", C: "C5", D: "C6" },
  "INT-08": { A: "C1", B: "C4", C: "C5", D: "C6" },
};

/**
 * (b) Skills — SKL-01…SKL-10.
 * Each statement maps to one category. +2 only if slider ≥ 4 (1–5 scale).
 * Coverage: C1×1, C2×2, C3×2, C4×2, C5×2, C6×1
 * → max skill points: C1:2, C2:4, C3:4, C4:4, C5:4, C6:2
 *
 * Confirmed from instructions.md Section 5 / docs/item-bank.md.
 */
export const SKILLS_WEIGHTS = {
  points: 2,
  threshold: 4,
  "SKL-01": "C1",
  "SKL-02": "C2",
  "SKL-03": "C4",
  "SKL-04": "C3",
  "SKL-05": "C5",
  "SKL-06": "C6",
  "SKL-07": "C3",
  "SKL-08": "C2",
  "SKL-09": "C5",
  "SKL-10": "C4",
};

/**
 * (c) Strand (ACA-01) — single-select. +2 to each listed category.
 * Keys match Site Map / intake: Academic-STEM, Academic-ABM, Academic-HUMSS,
 * TVL, Arts & Design, Sports.
 */
export const STRAND_WEIGHTS = {
  points: 2,
  "Academic-STEM": ["C1", "C2", "C5"],
  "Academic-ABM": ["C3"],
  "Academic-HUMSS": ["C4"],
  TVL: ["C2"],
  "Arts & Design": ["C6"],
  Sports: ["C5"],
};

/**
 * (d) General Weighted Average (ACA-03).
 * Apply the first matching tier (highest minInclusive first):
 *   ≥90        → +2 to C1, C2, C5
 *   85–89.99   → +1 to C1, C2, C5  (encoded as ≥85 and <90)
 *   <85        → 0
 */
export const GWA_WEIGHTS = [
  {
    id: "gwa-90-plus",
    minInclusive: 90,
    maxExclusive: null,
    points: 2,
    categories: ["C1", "C2", "C5"],
  },
  {
    id: "gwa-85-to-89.99",
    minInclusive: 85,
    maxExclusive: 90,
    points: 1,
    categories: ["C1", "C2", "C5"],
  },
  {
    id: "gwa-below-85",
    minInclusive: null,
    maxExclusive: 85,
    points: 0,
    categories: [],
  },
];

/**
 * (e) Best-performing subjects (ACA-04) — multi-select, up to 3, +2 each.
 * Two options per category → max subject points = 4 per category.
 */
export const SUBJECTS_WEIGHTS = {
  points: 2,
  "Computer/ICT": "C1",
  "Statistics/Research": "C1",
  Physics: "C2",
  "TVL-Industrial Arts": "C2",
  "Business Math/Accounting": "C3",
  "Economics/Entrepreneurship": "C3",
  "English/Communication Arts": "C4",
  "Filipino/Araling Panlipunan": "C4",
  "Biology/General Science": "C5",
  "PE & Health": "C5",
  "MAPEH-Arts": "C6",
  "TVL-Arts & Design": "C6",
};

/**
 * (f) Precomputed MaxPossibleScore(C) — instructions.md Section 6.
 *
 * | Cat | Interests | Skills | Strand | GWA | Subjects | TOTAL |
 * | C1  | 15        | 2      | 2      | 2   | 4        | 25    |
 * | C2  | 12        | 4      | 2      | 2   | 4        | 24    |
 * | C3  | 15        | 4      | 2      | 0   | 4        | 25    |
 * | C4  | 18        | 4      | 2      | 0   | 4        | 28    |
 * | C5  | 18        | 4      | 2      | 2   | 4        | 30    |
 * | C6  | 18        | 2      | 2      | 0   | 4        | 26    |
 */
export const MAX_POSSIBLE_SCORES = {
  C1: 25,
  C2: 24,
  C3: 25,
  C4: 28,
  C5: 30,
  C6: 26,
};
