# CAREER COMPASS — PROJECT INSTRUCTIONS
## Living specification document for AI-assisted development (Claude + Cursor)
### Last updated: Phase 5, Step 5.2 (post Prompt 1/2 correction)

---

## 1. PROJECT OVERVIEW

Career Compass is a web-based decision support system that helps Senior High
School students in the Philippines identify suitable college courses and
career paths. Students complete a themed, "Explorer/Journey"-styled
assessment covering Interests, Skills, and Academic Performance. The system
applies a rule-based weighted scoring method (no AI/ML) to generate ranked
course and career recommendations, which can be downloaded as a printable
PDF ("Explorer Report"). Guidance counselors use these results as a
supporting reference during counseling sessions — the system does not make
final decisions for students.

Developed by: Charlene Mae T. Adille & Juno Alligah B. Romano
BSIT 3B, Bicol University Polangui — Capstone Project

Full source documents for everything below are also available in full at
docs/ in this repo — this file is the index + critical inline data; docs/
files are the complete originals.

---

## 2. HARD CONSTRAINTS (NEVER VIOLATE THESE)

- NO database of any kind (no Firebase, no Supabase, no Firestore, no SQL,
  no persistent server-side storage).
- NO login, NO account registration, NO authentication system, NO user roles
  requiring sign-in.
- NO admin dashboard / admin CMS as part of the deployed system.
- All data is either:
  (a) STATIC — bundled JSON files (items.json, courses.json), or
  (b) SESSION-ONLY — held in React state and/or browser sessionStorage,
      automatically cleared when the browser tab closes.
- Tech stack: Next.js (JavaScript, NOT TypeScript), Tailwind CSS, App Router,
  no backend server beyond static hosting (Vercel).
- Prefer functional components + pure functions (standard modern React
  convention) over class-based OOP, unless a specific module (e.g., the
  scoring engine) is explicitly asked to use a class for encapsulation.

If any prompt or generated code suggests a database, or login system. STOP and flag it — it violates the approved, ERB-cleared manuscript
scope and cannot be part of the graded system.

---

## 3. SITE MAP / INFORMATION ARCHITECTURE

(Full detail: docs/site-map.md)

1. LANDING / WELCOME PAGE — Explorer/Journey intro, description, "Start
   Your Journey" button
2. STUDENT INFO INTAKE (session-only) — Nickname, Strand, Year Level
   (non-scoring), Continue button
3. JOURNEY MAP / DASHBOARD — 3 island markers, sequential unlock (Interests
   → Skills → Academic, no free jumping), progress indicator, Journey
   Guide icon, Locate Me button, View Results button (enabled at 100%),
   Session Options, Start/Continue Assessment button
   3a. INTERESTS — 8 scenario cards
   3b. SKILLS — 10 confidence sliders
   3c. ACADEMIC PERFORMANCE — GWA + subjects form (Strand not re-entered)
4. PROCESSING / SUMMARY — loading transition, scoring computed in-session
5. RESULTS PAGE — globally ranked course cards, secondary strongest-field context, disclaimer,
   Back to Journey Map, Download Report
   5a. COURSE DETAIL VIEW — Overview, Schools, Careers, Guidance Tips
6. PDF REPORT CONFIRMATION — download/print complete

---

## 4. WIREFRAME — INDICATOR REFERENCE (1–68)

(Full detail with every element description: docs/wireframe-description.md)

Screen 1 (1–6): Brand, Headline, Description, CTA, Background, Nav Bar
Screen 2 (7–13): Panel heading, Subtext, Nickname, Strand, Year Level,
  Continue, Background frame
Screen 3 (14–24): Map bg, 3 islands, progress indicator, Settings, View
  Results, session reminder, Start button, Journey Guide, Locate Me
Screen 3a (25–33): Section label, mini progress, prompt, 4 option cards,
  Back/Next
Screen 3b (34–38): Section label, statement, slider, Back/Next
Screen 3c (39–44): Section label, Strand display, GWA field, Subjects
  checklist, Back, Submit
Screen 4 (45–48): Heading, subtext, loading animation, status text
Screen 5 (49–55): Heading, subtext, strongest-field note, ranked course cards,
  disclaimer, Back, Download
Screen 5a (56–63): Course title, Overview, Study subjects, Schools,
  Careers, Salary+source+date, Guidance Tips, Back
Screen 6 (64–68): Heading, subtext, Download, Print, Back

---

## 5. ASSESSMENT ITEM BANK — CONFIRMED FULL DATA

(Full source: docs/item-bank.md)

### Category Legend
C1 = Information Technology & Computing | C2 = Engineering & Technology
C3 = Business Administration & Related | C4 = Education Science & Teacher
Training | C5 = Medical & Allied Health Sciences | C6 = Architecture, Fine
Arts & Design

### SECTION 1: INTERESTS (8 items, 4 options each, +3 pts/option) — FULL TEXT

INT-01: "It's the weekend with completely free time. Which activity
appeals to you most?"
  a) Plan a small fundraiser/budget for your barkada → C3
  b) Tutor a sibling/neighbor in a subject you're good at → C4
  c) Volunteer at a community health/first-aid drive → C5
  d) Sketch, design, or redecorate a space → C6

INT-02: "Your class must create a project to help the school. Which task
would you volunteer for?"
  a) Build a simple app/online form for the school → C1
  b) Facilitate an orientation/training session for classmates → C4
  c) Set up a first-aid/wellness corner → C5
  d) Design the posters/visuals for the project → C6

INT-03: "Your group project is about improving your community. Which
contribution excites you most?"
  a) Build a tracking app/spreadsheet for community data → C1
  b) Design/build a physical model or prototype (e.g., drainage system) → C2
  c) Research health & sanitation practices for the plan → C5
  d) Create the visual concept/branding for the campaign → C6

INT-04: "A local competition invites SHS students to pitch an idea. Which
type would you want to develop?"
  a) A mobile app/software tool for an everyday problem → C1
  b) A gadget, machine, or engineering solution → C2
  c) A small business/startup concept with a marketing plan → C3
  d) An art, fashion, or design innovation → C6

INT-05: "Your favorite type of content to watch in your free time is
usually about..."
  a) Tech reviews, coding tutorials, app dev → C1
  b) DIY builds, machine teardowns, engineering explainers → C2
  c) Entrepreneurship, investing, business case studies → C3
  d) Teaching tips, motivational talks, study hacks → C4

INT-06: "You're asked to represent a profession at Career Day. Which would
you enjoy representing most?"
  a) An engineer explaining how bridges/circuits are built → C2
  b) An entrepreneur explaining how to start/grow a business → C3
  c) A teacher explaining how to guide young learners → C4
  d) A nurse explaining patient care → C5

INT-07: "Your group is running booths at a class fair. Which one would you
rather manage?"
  a) The "mini-store" booth — sales & budgeting → C3
  b) The "peer helpdesk" booth — answering classmates' questions → C4
  c) The "wellness check" booth — basic health screening → C5
  d) The "creative corner" booth — art/face painting displays → C6

INT-08: "Think of a problem in your community (traffic, waste, poor
internet, limited health services). How would you want to help solve it?"
  a) Build a digital tool/system to track and manage it → C1
  b) Create educational materials to raise awareness → C4
  c) Join a health/relief mission related to it → C5
  d) Design signage/campaign visuals about it → C6

Coverage check: C1×5, C2×4, C3×5, C4×6, C5×6, C6×6 (32 options total) ✅

### SECTION 2: SKILLS (10 items, +2 pts if slider >= 4) — CONFIRMED CATEGORIES

| Item | Category | Statement (full text where confirmed) |
|---|---|---|
| SKL-01 | C1 | "I can quickly figure out how a computer program, app, or website works, even without being taught." |
| SKL-02 | C2 | "I enjoy building, repairing, or taking apart machines/gadgets to see how they work." |
| SKL-03 | C4 | "I can explain a complicated topic simply so others understand it." |
| SKL-04 | C3 | "I am comfortable managing money, budgets, or tracking expenses for a project." |
| SKL-05 | C5 | "I can stay calm and think clearly when someone nearby is injured or unwell." |
| SKL-06 | C6 | [Visual/design expression — exact statement wording pending confirmation from docs/item-bank.md] |
| SKL-07 | C3 | [Persuading others — exact statement wording pending confirmation] |
| SKL-08 | C2 | [Following instructions to build — exact statement wording pending confirmation] |
| SKL-09 | C5 | [Caretaking others — exact statement wording pending confirmation] |
| SKL-10 | C4 | [Mentoring/guiding others — exact statement wording pending confirmation] |

NOTE: Categories and point rules for ALL 10 skill items are 100% confirmed
and safe to use for scoring logic. Only the exact display wording for
SKL-06–SKL-10 needs a final check against docs/item-bank.md before building
the frontend UI text (not needed for the scoring engine itself).

Coverage check: C1×1, C2×2, C3×2, C4×2, C5×2, C6×1 (10 items total) ✅

### SECTION 3: ACADEMIC PERFORMANCE (ACA-01 to ACA-04)

- ACA-01 Strand (single-select, +2 each):
  Academic-STEM → C1, C2, C5 | Academic-ABM → C3 | Academic-HUMSS → C4 |
  TVL → C2 | Arts & Design → C6 | Sports → C5
- ACA-02 Year Level: NON-SCORING — display/personalization only
- ACA-03 GWA: >=90 → C1,C2,C5 +2 each | 85–89.99 → C1,C2,C5 +1 each |
  <85 → 0
- ACA-04 Best-Performing Subjects (multi-select, up to 3, +2 each):
  Computer/ICT→C1, Statistics/Research→C1, Physics→C2,
  TVL-Industrial Arts→C2, Business Math/Accounting→C3,
  Economics/Entrepreneurship→C3, English/Communication Arts→C4,
  Filipino/Araling Panlipunan→C4, Biology/General Science→C5,
  PE & Health→C5, MAPEH-Arts→C6, TVL-Arts & Design→C6

Total: 22 scoreable items across all 3 sections.

---

## 6. SCORING ENGINE — FORMULAS & LOGIC

(Full source with 3 test personas: docs/scoring-table.md)

### Max Possible Score per Category
| Category | Interests | Skills | Strand | GWA | Subjects | TOTAL |
|---|---|---|---|---|---|---|
| C1 | 15 | 2 | 2 | 2 | 4 | 25 |
| C2 | 12 | 4 | 2 | 2 | 4 | 24 |
| C3 | 15 | 4 | 2 | 0 | 4 | 25 |
| C4 | 18 | 4 | 2 | 0 | 4 | 28 |
| C5 | 18 | 4 | 2 | 2 | 4 | 30 |
| C6 | 18 | 2 | 2 | 0 | 4 | 26 |

### Formulas

CategoryScore(C) = Σ (all points received by Category C from Interests +
Skills + Academic Performance)

MatchPercentage(C) = (CategoryScore(C) ÷ MaxPossibleScore(C)) × 100


### Course-Level Ranking
Each course receives 88% of its category's raw Match Percentage as a base,
then adds four evidence components: primary course signal (0/4/6), strand
alignment (0/2), applicable GWA alignment (0/1/2), and secondary course
evidence (0/1/2). CalculatedCourseMatchPercent is the rounded sum, capped at
100. If calculated percentages tie within the top five, their display values
are separated by 0.01 points in established rank order. The calculated score
is retained unchanged for auditability.

### Ranking & Tie-Breaking Rule
Rank by calculatedCourseMatchPercent, then rawScoreBeforeRounding, then
courseName. Secondary signals reduce ties using real assessment evidence.
Exact top-five display ties are separated by hundredths only after ranking.

### Re-calculation note
If a student revisits and edits an earlier section, the scoring engine
MUST recompute the FULL score fresh — no incremental/partial addition.

### Confirmed Implementation Status (as of Prompt 1 & 2)
- lib/weightTable.js: built, corrected with confirmed INTERESTS_WEIGHTS
  and SKILLS_WEIGHTS data above. STRAND_WEIGHTS, GWA_WEIGHTS,
  SUBJECTS_WEIGHTS, MAX_POSSIBLE_SCORES, CATEGORY_LABELS = high confidence,
  unchanged.
- lib/scoringEngine.js: calculateCategoryScores() implemented, high
  confidence, pure function, matches answers shape below.

### Confirmed `answers` object shape (used by calculateCategoryScores)

{
interests: { "INT-01": "A", /* … INT-08 / },
skills: { "SKL-01": 4, / … SKL-10, 1–5 */ },
strand: "Academic-STEM",
gwa: 91.5,
subjects: ["Computer/ICT", "Physics"],
}

Returns `{ C1, C2, C3, C4, C5, C6 }` raw points. Unknown/missing fields
contribute 0. Year level is ignored. Subject scoring = first 3 unique valid
labels found in SUBJECTS_WEIGHTS.

---

## 7. CATEGORY & COURSE STRUCTURE (24 courses, 6 categories, 4 each)

(Full detail — overviews, schools, careers, salary sources: docs/career-dataset.md)

C1 — IT & Computing: BSIT-001, BSCS-001, BSIS-001, BSCpE-001
C2 — Engineering & Technology: BSCE-001, BSEE-001, BSECE-001, BSME-001
C3 — Business Administration: BSBA-001, BSA-001, BSENT-001, BSHRM-001
C4 — Education Science: BEED-001, BSED-001, BTLE-001, BPED-001
C5 — Medical & Allied Health: BSN-001, BSPharma-001, BSMLS-001, BSRT-001
C6 — Architecture/Fine Arts/Design: BSArch-001, BFA-001, BSID-001, BSMA-001

Each course entry (courses.json) must contain: courseId, courseName,
category, overview, schools[] (name, location, type), careerOpportunities[]
(jobTitle, salaryRange, notes), salarySource, salaryAsOf, guidanceTips.

---

## 8. SYSTEM FEATURES AND FUNCTIONALITY (v1.0)

(Full detail: docs/features-table.md)

| ID | Feature | Status |
|---|---|---|
| F-01 | Explorer-Themed Landing Page | Planned |
| F-02 | Session-Only Student Info Intake | Planned |
| F-03 | Journey Map Navigation Hub | Planned |
| F-04 | Interests Assessment Module | Planned |
| F-05 | Skills Assessment Module | Planned |
| F-06 | Academic Profile Module | Planned |
| F-07 | Rule-Based Weighted Scoring Engine | Implemented (unit-tested, pending UI integration) |
| F-08 | Static Course/Career Dataset (24 courses, 6 categories) | Planned |
| F-09 | Ranked Results with Match Percentage | Planned |
| F-10 | Course Detail Explorer | Planned |
| F-11 | Printable PDF Report Generator | Planned |
| F-12 | Responsive Web Access | Planned |
| F-13 | Session Auto-Recovery (sessionStorage) | Planned |
| F-14 | Unsaved Progress Warning | Planned |
| F-15 | Guided Sequential Progression | Planned |

---

## 9. VISUAL/ART DIRECTION REFERENCE (Aspirational — Not Binding Spec)

(Full source: docs/ui-design-notes.md — use for tone, copy, color palette,
typography only; the full cinematic 3D/frame-sequence version was
intentionally simplified per Section 2 Hard Constraints.)

---

## 10. CHANGELOG
- [Phase 5, Step 5.0] Document created, consolidating all finalized Phase 4
  outputs.
- [Phase 5, Step 5.2] Expanded Section 5 with full confirmed
  INTERESTS_WEIGHTS/SKILLS_WEIGHTS data after Prompt 1 flagged placeholder
  uncertainty. Added docs/ folder references throughout. Marked F-07 "In
  Progress." Recorded confirmed answers object shape from Prompt 2.
 - [Phase 5, Step 5.2] Scoring engine complete — all 4 functions implemented,
 3 test personas PASS, match % capped at 100.
