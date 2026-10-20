# Career Compass — current scoring and new-curriculum planning audit

Date: 2026-10-20 (Asia/Manila). Repository-only audit. No web research. The curriculum plan is draft context, not an implemented specification. No new curriculum behavior is implemented by this report.

## Findings in one page

1. Current scoring is category-first: a course receives 0.88 × its unrounded category percentage, then primary evidence A, strand alignment B, GWA alignment C, and secondary evidence D. Strand and GWA each enter both the category base and a separate course component.

2. The seven strands do not have an equal budget. STEM gives 6 category points across 3 categories; ABM, HUMSS, TVL, Arts & Design, and Sports each give 2 across 1; GAS gives 0. Strand adds another 2 course points to every aligned course.

3. Category maxima are hard-coded at C1=25, C2=24, C3=25, C4=28, C5=30, C6=26. Each includes 2 possible strand points. GAS retains these denominators. Changing shared denominators would change old-flow results.

4. Equal raw category budgets do not produce equal course-percentage gains: the current 2-point strand contribution plus course alignment adds between 7.866667 and 9.333333 uncapped course points in a boosted category, depending on its denominator.

5. The seeded 2000-profile sample found valid no-bonus top-four witnesses for all 24 courses. It does not establish empirical student fairness. Both full measurement runs were byte-identical.

6. At budget B=8 spread over 1 category, 11 of 12000 profile/subset trials exceeded a fixed category maximum. Category percentages have no 100 cap; course percentages do. Broader category unions did not consistently flatten rankings.

7. Adding a course inside an existing category does not require new category weights. Scored data, detail data and primary/secondary signal registrations are separate. There are 24 scored courses, 24 detail entries and a 36-course candidate list; 13 current primary signals use subjects and 11 use skills.

8. Results initially shows 4 courses, can expand to all, and displays relative arcs rather than numeric percentages. PDF prints 4 names/categories and details for the first course without numeric percentages. Detail data lacks structured salary source/year, CHED program basis and PRC licensure fields.

## 1. Scoring source map

| File:line | Function/table | Role |
| --- | --- | --- |
| `data/items.json:3` | JSON item bank | Copy, keys/categories, valid ranges and subject cap. |
| `data/courses.json:3` | JSON course list | Scored IDs/categories and comparison overview data. |
| `data/explore-courses.json:3` | JSON detail list | Detail routes and PDF course details; not scoring input. |
| `lib/weightTable.js:14` | CATEGORY_LABELS; INTERESTS_WEIGHTS; SKILLS_WEIGHTS; STRAND_WEIGHTS; GWA_WEIGHTS; SUBJECTS_WEIGHTS; MAX_POSSIBLE_SCORES | Authoritative runtime weights and hard-coded denominators. |
| `lib/scoringEngine.js:19` | CATEGORY_IDS; INTEREST_ITEM_IDS; SKILL_ITEM_IDS | Fixed category universe; item IDs derived from weight keys. |
| `lib/scoringEngine.js:31` | emptyScores; addPoints | Initialize fixed categories; reject unknown categories/falsy points. |
| `lib/scoringEngine.js:40` | skillRating; matchGwaTier | Coerce finite numeric values; choose matching GWA tier. |
| `lib/scoringEngine.js:91` | calculateCategoryScores | Recompute raw points from every point source. |
| `lib/scoringEngine.js:166` | calculateMatchPercentages | Return raw and rounded category percentages. |
| `lib/scoringEngine.js:200` | rankResults | Rank categories and mark the strongest. |
| `lib/scoringEngine.js:217` | CATEGORY_BASE_SCALE; GWA_CATEGORIES | Multiplier and eligible course-GWA categories. |
| `lib/scoringEngine.js:220` | COURSE_PRIMARY_SIGNALS; COURSE_SECONDARY_SIGNALS | Course-ID-specific A/D mappings. |
| `lib/scoringEngine.js:274` | resolveCategoryId; toBasePercentage | Resolve exact code/full label; prefer raw percentage. |
| `lib/scoringEngine.js:300` | hasSubject; primarySignalPoints; secondarySignalPoints; courseComponents | Calculate A/B/C/D. |
| `lib/scoringEngine.js:381` | rankAllCourses | Global ranking; never truncates. |
| `lib/scoringEngine.js:406` | separateTopFiveDisplayTies | Display-only hundredth separation in ranks 1–5. |
| `lib/scoringEngine.js:440` | formatMatchPercent | Numeric formatting; no current app/component caller found. |
| `lib/scoringEngine.js:458` | calculateAllCourseMatches | Course base/components, cap, rounding, ranking and display ties. |
| `lib/scoringEngine.js:519` | createRecommendationResult | All topCourses plus strongestCategory. |
| `lib/scoringEngine.js:546` | calculateCourseMatches | Legacy category-filtered path; no current app/component caller. Comment says four; code has no count limit. |
| `lib/assessmentValidation.js:9` | isValidStrand; isValidInterest; isValidConfidence; isValidGwa; isValidSubjects | UI/session validity against items.json. |
| `lib/assessmentValidation.js:15` | isSectionValid; validatedProgress | Validate completed assessments and sequential access. |
| `lib/useSessionAnswers.js:20` | createEmptySession; readStoredSession; writeStoredSession; normalizeSession; mergeSession; useSessionAnswers | Restore, normalize, persist and project answers; updateSession/resetSession/discardSection modify saved state. |
| `lib/browserStorage.js:2` | browserStorage; migrate; resetStoredJourney; subscribeToStorage | Local persistence/migration/clearing; not a score cache. |
| `lib/journeyEntry.js:1` | journeyEntry | Choose start/continue/results destination. |
| `components/JourneyAccess.js:8` | JourneyAccess | Require valid strand/completed assessments. |
| `app/intake/page.js:19` | IntakePage; chooseStrand; advance | Save strand key; separate labels from values. |
| `app/journey/interests/page.js:61` | Page/selection/advance handlers | Save valid option letters. |
| `app/journey/skills/page.js:83` | selectConfidence; commitConfidence | Save and validate integer skill ratings. |
| `app/journey/academic/page.js:25` | AcademicPage; updateGwa; toggleSubject; submitAcademicProfile | Read strand; save/validate GWA and subject values. |
| `app/processing/page.js:35` | ProcessingPage | Recompute as readiness check. |
| `app/results/page.js:55` | ResultsPage | Recompute rankings; default four; derive relative arcs. |
| `app/results/CourseMatch.js:15` | CourseMatch | Rank/name/category/arc; no numeric score text. |
| `app/report/page.js:29` | ReportPage; downloadAgain | Recompute before report/download/print. |
| `lib/explorerReport.js:222` | buildExplorerReport; createExplorerReport; downloadExplorerReport; printExplorerReport | DTO; display-score sort; four-course PDF. |
| `lib/explorerReport.js:33` | reportEvidence; printableText; addWrappedText; addPageIfNeeded; addSectionHeading; addPageNumbers | Evidence, translation, wrapping and pagination; no score changes. |
| `lib/reportEvidence.js:17` | buildReportEvidence | Duplicate standalone evidence helper; no app/component consumer found. |
| `app/results/[courseId]/page.js:16` | generateStaticParams; CourseDetailPage; studyFocus | Detail IDs/content from explore data; not scoring. |
| `lib/i18n/translate.js:14` | translate; catalog | Display text translation only. |
| `components/Localized.js:6` | Localized | Translate text/ARIA; forward values/handlers. |
| `scripts/check-strands.mjs:6` | Consistency assertions | Intake/item/weight list and mapping consistency; empty GAS. |

PDF carries strongestCategory in its DTO but does not render it. Supporting evidence uses the highest-ranked course category, not necessarily the independently strongest category.

## 2. Exact current algorithm

### Formulas and constants

lib/scoringEngine.js:217-217

```js
const CATEGORY_BASE_SCALE = 0.88;
```

lib/scoringEngine.js:173-180

```js
    const rawPercentage =
      maxPossible > 0 ? (safeScore / maxPossible) * 100 : 0;

    return {
      category,
      label: CATEGORY_LABELS[category],
      percentage: Math.round(rawPercentage),
      rawPercentage,
```

lib/scoringEngine.js:479-489

```js
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
```

The real path is `categoryRawPct = rawPoints / maximum * 100`; `courseRaw = 0.88 * categoryRawPct + A + B + C + D`; `calculatedCourseMatchPercent = Math.round(Math.min(100, courseRaw))`. This is a rule score, not a calibrated probability.

| Source | Input/mapping | Award | Caps/handling | Code |
| --- | --- | --- | --- | --- |
| Interests | INT-01…INT-08, option A–D → category | 3 each | One selection/item; missing or unknown zero. Engine trims/uppercases; UI requires exact allowed key. | `lib/scoringEngine.js:97` |
| Skills | SKL-01…SKL-10 → category | 2 at rating ≥4 | UI: integers 1–5. Engine: any finite numeric-coercible rating ≥4; no upper-bound clamp. | `lib/scoringEngine.js:105` |
| Strand | Exact string → array | 2 to every mapped category | Single value in UI. Empty GAS/unknown mapping: zero category points. | `lib/scoringEngine.js:113` |
| GWA | Numeric value → first matching tier | ≥90: 2; ≥85 and <90: 1; <85: 0; C1/C2/C5 only | UI: finite number 75–100. Engine coerces Number; top tier has no upper bound. | `lib/weightTable.js:92` |
| Subjects | ACA-04 option.value → category | 2 each | First 3 unique valid values, in supplied order. Duplicates/unknowns ignored; UI requires 1–3. | `lib/scoringEngine.js:127` |
| Personalization | Name/year/avatar | 0 | Year level can alter guidance wording, not scores. | `lib/useSessionAnswers.js:204` |

Mappings: `lib/weightTable.js:34`, `lib/weightTable.js:54`, `lib/weightTable.js:74`, `lib/weightTable.js:120`.

### Hard-coded category maximums

lib/weightTable.js:147-153

```js
export const MAX_POSSIBLE_SCORES = {
  C1: 25,
  C2: 24,
  C3: 25,
  C4: 28,
  C5: 30,
  C6: 26,
```

These literal constants are not recalculated from the item bank at runtime. The script counted the following derivation. Each maximum includes 2 possible strand points, including the denominator used for GAS. Subject maximum uses the smaller of the 3-choice cap and the category subject count.

| Category | Interest options ×3 | Skill items ×2 | Strand max | GWA max | Subject options ×2 | Sum / constant | No-strand raw maximum / raw % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | 5 × 3 = 15 | 1 × 2 = 2 | 2 | 2 | 2 × 2 = 4 | 15 + 2 + 2 + 2 + 4 = 25 | 23 / 92% |
| C2 | 4 × 3 = 12 | 2 × 2 = 4 | 2 | 2 | 2 × 2 = 4 | 12 + 4 + 2 + 2 + 4 = 24 | 22 / 91.666667% |
| C3 | 5 × 3 = 15 | 2 × 2 = 4 | 2 | 0 | 2 × 2 = 4 | 15 + 4 + 2 + 0 + 4 = 25 | 23 / 92% |
| C4 | 6 × 3 = 18 | 2 × 2 = 4 | 2 | 0 | 2 × 2 = 4 | 18 + 4 + 2 + 0 + 4 = 28 | 26 / 92.857143% |
| C5 | 6 × 3 = 18 | 2 × 2 = 4 | 2 | 2 | 2 × 2 = 4 | 18 + 4 + 2 + 2 + 4 = 30 | 28 / 93.333333% |
| C6 | 6 × 3 = 18 | 1 × 2 = 2 | 2 | 0 | 2 × 2 = 4 | 18 + 2 + 2 + 0 + 4 = 26 | 24 / 92.307692% |

Each category maximum is attainable separately; maximizing choices for different categories need not coexist. Course count does not add assessment points.

### Course components

| Slot | Decision | Values | Code |
| --- | --- | --- | --- |
| A | COURSE_PRIMARY_SIGNALS[courseId]; exact subject presence or numeric skill rating | Subject: 6; skill exactly 5: 6, exactly 4: 4; otherwise 0. | `lib/scoringEngine.js:305` |
| B | STRAND_WEIGHTS[answers.strand] includes course category | 2 or 0. Literal 2 is independent of STRAND_WEIGHTS.points. | `lib/scoringEngine.js:334` |
| C | GWA_CATEGORIES allows C1/C2/C5, then matching tier | 2/1/0; always 0 for C3/C4/C6. | `lib/scoringEngine.js:335` |
| D | COURSE_SECONDARY_SIGNALS[courseId]; exact subject presence or skill rating | Subject: 2; skill exactly 5: 2, exactly 4: 1; otherwise 0. | `lib/scoringEngine.js:318` |

Maximum A+B+C+D is `6+2+2+2=12` in GWA-eligible categories and `6+2+0+2=10` elsewhere. The scale reserves 12 globally; not every category has that full evidence budget. A/D tables are in scoringEngine.js, not weightTable.js.

### Rounding, caps, ranking and display

- Category rows preserve rawPercentage and use Math.round for percentage. There is no category 100 cap or lower clamp. Missing/non-finite supplied raw scores become zero. Negative supplied category scores remain negative; valid UI answers do not generate them. `lib/scoringEngine.js:166`.
- Category order: descending rounded percentage, descending rawPercentage, then label via localeCompare. First only is isTopMatch. `lib/scoringEngine.js:200`.
- Courses prefer the unrounded category percentage. Course sum is capped at 100 before integer rounding, with no lower clamp. Order: calculated percentage descending, uncapped rawScoreBeforeRounding descending, then courseName via localeCompare. `lib/scoringEngine.js:381`.
- Ranks 1–5 with tied calculated integers get display-only hundredth separation after ranking. Positive ties subtract offset/100; zero ties use (groupSize-offset-1)/100. Zero calculated scores can therefore have positive display values. Calculated scores and ordering remain unchanged. `lib/scoringEngine.js:406`.
- formatMatchPercent formats integers or 2 decimal places; no current runtime consumer was found. Results cards and PDF do not print numeric percentages. `lib/scoringEngine.js:440`.
- Results uses topCourses.slice(0,4), or the full list when expanded. Relative arc strength is 95 when the displayed scores are equal; otherwise 30+65*(score-weakest)/(strongest-weakest). Expanding changes the reference range. `app/results/page.js:66`; `app/results/page.js:174`.
- PDF sorts by finalCourseMatchPercent alone, then slices to 4, relying on established input order for equal values. First-course details come from explore data. `lib/explorerReport.js:122`; `lib/explorerReport.js:184`.

## 3. Item and mapping tables

### Interests

Current item-bank text, not older manuscript paraphrases. Each selected option gives 3 points to the shown category.

| Item/question | A | B | C | D |
| --- | --- | --- | --- | --- |
| INT-01: You have free time this weekend. What would you most like to do? | Plan how your barkada can raise and spend money → C3 | Help a sibling or neighbor with schoolwork → C4 | Volunteer at a community first-aid activity → C5 | Draw or redesign a room → C6 |
| INT-02: Your class is doing a project for the school. Which task would you choose? | Make a simple app or online form → C1 | Teach classmates how to do something new → C4 | Set up a first-aid corner → C5 | Design the project posters → C6 |
| INT-03: Your group wants to improve your community. How would you help? | Make an app or spreadsheet to keep track of information → C1 | Build a small model, such as a drainage system → C2 | Find ways to keep people healthy and the area clean → C5 | Create the campaign's look and posters → C6 |
| INT-04: You can enter an idea in a school competition. What would you make? | An app that solves an everyday problem → C1 | A useful gadget or machine → C2 | A small business plan and ways to find customers → C3 | A new clothing or art design → C6 |
| INT-05: What do you usually like watching in your free time? | Videos about apps and how to code → C1 | Videos about building or fixing things → C2 | Videos about running a business or managing money → C3 | Videos about teaching or study tips → C4 |
| INT-06: For Career Day, you can act as someone doing a job. Who would you choose? | An engineer showing how bridges or circuits work → C2 | A business owner explaining how to start a business → C3 | A teacher helping young students learn → C4 | A nurse showing how to care for patients → C5 |
| INT-07: Your class is running a fair. Which booth would you like to manage? | A small store where you sell things and handle money → C3 | A help desk where you answer classmates' questions → C4 | A health booth where you help with basic health checks → C5 | An art booth with drawings or face painting → C6 |
| INT-08: Your community has a problem, like too much waste or poor internet. How would you help? | Build an app to track the problem and help manage it → C1 | Make learning materials that explain the problem → C4 | Join a health or relief activity → C5 | Design signs or posters about it → C6 |

### Skills

Each rating at threshold 4 or above contributes 2 category points.

| ID | Statement | Category |
| --- | --- | --- |
| SKL-01 | I can work out how to use an app or website on my own. | C1 |
| SKL-02 | I enjoy building or fixing gadgets, or taking them apart to see how they work. | C2 |
| SKL-03 | I can explain a difficult topic in a way others understand. | C4 |
| SKL-04 | I feel comfortable planning a budget and keeping track of spending. | C3 |
| SKL-05 | I can stay calm and think clearly when someone is hurt or sick. | C5 |
| SKL-06 | I can show my ideas through drawings or designs. | C6 |
| SKL-07 | I can convince others to support an idea or plan. | C3 |
| SKL-08 | I can follow step-by-step instructions to build something. | C2 |
| SKL-09 | I enjoy looking after others, such as a younger sibling or someone who is sick. | C5 |
| SKL-10 | I enjoy patiently helping someone younger or new to a task. | C4 |

### Valley subjects

| Stored value/scoring key | Display text | Category |
| --- | --- | --- |
| Computer/ICT | Computer/ICT (Programming, Computer Systems Servicing) | C1 |
| Statistics/Research | Statistics / Research | C1 |
| Physics | Physics | C2 |
| TVL-Industrial Arts | TVL – Industrial Arts (Electronics, Welding, Automotive) | C2 |
| Business Math/Accounting | Business Math / Accounting | C3 |
| Economics/Entrepreneurship | Economics / Entrepreneurship | C3 |
| English/Communication Arts | English / Communication Arts | C4 |
| Filipino/Araling Panlipunan | Filipino / Araling Panlipunan | C4 |
| Biology/General Science | Biology / General Science | C5 |
| PE & Health | Physical Education & Health | C5 |
| MAPEH-Arts | MAPEH – Arts | C6 |
| TVL-Arts & Design | TVL – Arts & Design (Visual Arts, Fashion, Culinary Design) | C6 |

Display text is already separate from stored value. Changing text alone does not change matching keys.

### STRAND_WEIGHTS

| Stored strand | Categories | Raw award per mapped category |
| --- | --- | --- |
| Academic-STEM | ["C1","C2","C5"] | 2 |
| Academic-ABM | ["C3"] | 2 |
| Academic-HUMSS | ["C4"] | 2 |
| Academic-GAS | [] | 0 |
| TVL | ["C2"] | 2 |
| Arts & Design | ["C6"] | 2 |
| Sports | ["C5"] | 2 |

### Point-earning input counts

| Category | Interest options | Skill items | Subjects | Total mapped inputs |
| --- | --- | --- | --- | --- |
| C1 | 5 | 1 | 2 | 8 |
| C2 | 4 | 2 | 2 | 8 |
| C3 | 5 | 2 | 2 | 9 |
| C4 | 6 | 2 | 2 | 10 |
| C5 | 6 | 2 | 2 | 10 |
| C6 | 6 | 1 | 2 | 9 |

C1/C6 each have 1 skill item; the other categories each have 2. Interest coverage ranges from 4 options in C2 to 6 in C4/C5/C6. All have 2 subjects. Normalization does not make real or random response distributions identical.

## 4. Course table

Field set F is present on every scored entry: `courseId`, `courseName`, `category`, `overview`, `schools`, `careerOpportunities`, `salarySource`, `salaryAsOf`, `guidanceTips`. Nested school fields: `name`, `location`, `type`; career fields: `jobTitle`, `salaryRange`, `notes`. Presence was checked on all entries; this is not a formal schema validator.

| ID | Name | Category | A primary | D secondary | courses.json fields |
| --- | --- | --- | --- | --- | --- |
| BSIT-001 | BS Information Technology | C1 | subject: Computer/ICT | skill: SKL-01 | F (9 fields) |
| BSCS-001 | BS Computer Science | C1 | subject: Statistics/Research | skill: SKL-03 | F (9 fields) |
| BSIS-001 | BS Information Systems | C1 | skill: SKL-01 | subject: Business Math/Accounting | F (9 fields) |
| BSCpE-001 | BS Computer Engineering | C1 | skill: SKL-02 | subject: Physics | F (9 fields) |
| BSCE-001 | BS Civil Engineering | C2 | skill: SKL-08 | subject: Physics | F (9 fields) |
| BSEE-001 | BS Electrical Engineering | C2 | subject: Physics | skill: SKL-02 | F (9 fields) |
| BSECE-001 | BS Electronics Engineering | C2 | subject: TVL-Industrial Arts | skill: SKL-01 | F (9 fields) |
| BSME-001 | BS Mechanical Engineering | C2 | skill: SKL-02 | skill: SKL-08 | F (9 fields) |
| BSBA-001 | BS Business Administration | C3 | skill: SKL-07 | subject: Economics/Entrepreneurship | F (9 fields) |
| BSA-001 | BS Accountancy | C3 | subject: Business Math/Accounting | skill: SKL-04 | F (9 fields) |
| BSENT-001 | BS Entrepreneurship | C3 | subject: Economics/Entrepreneurship | skill: SKL-07 | F (9 fields) |
| BSHRM-001 | BS Hospitality Management | C3 | skill: SKL-04 | skill: SKL-10 | F (9 fields) |
| BEED-001 | Bachelor of Elementary Education | C4 | skill: SKL-10 | skill: SKL-03 | F (9 fields) |
| BSED-001 | Bachelor of Secondary Education | C4 | subject: English/Communication Arts | skill: SKL-10 | F (9 fields) |
| BTLE-001 | Bachelor of Technology and Livelihood Education | C4 | skill: SKL-03 | skill: SKL-08 | F (9 fields) |
| BPED-001 | Bachelor of Physical Education | C4 | subject: Filipino/Araling Panlipunan | subject: PE & Health | F (9 fields) |
| BSN-001 | BS Nursing | C5 | skill: SKL-09 | skill: SKL-05 | F (9 fields) |
| BSPharma-001 | BS Pharmacy | C5 | subject: PE & Health | subject: Biology/General Science | F (9 fields) |
| BSMLS-001 | BS Medical Laboratory Science | C5 | subject: Biology/General Science | subject: Statistics/Research | F (9 fields) |
| BSRT-001 | BS Radiologic Technology | C5 | skill: SKL-05 | subject: Physics | F (9 fields) |
| BSArch-001 | BS Architecture | C6 | subject: Physics | skill: SKL-08 | F (9 fields) |
| BFA-001 | Bachelor of Fine Arts | C6 | subject: MAPEH-Arts | skill: SKL-06 | F (9 fields) |
| BSID-001 | BS Interior Design | C6 | subject: TVL-Arts & Design | skill: SKL-02 | F (9 fields) |
| BSMA-001 | BS Multimedia Arts | C6 | skill: SKL-06 | subject: Computer/ICT | F (9 fields) |

| Category | Name | Courses | Subject primaries | Skill primaries | Missing D |
| --- | --- | --- | --- | --- | --- |
| C1 | Information Technology & Computing | 4 | 2 | 2 | 0 |
| C2 | Engineering & Technology | 4 | 2 | 2 | 0 |
| C3 | Business Administration & Related | 4 | 2 | 2 | 0 |
| C4 | Education Science & Teacher Training | 4 | 2 | 2 | 0 |
| C5 | Medical & Allied Health Sciences | 4 | 2 | 2 | 0 |
| C6 | Architecture, Fine Arts & Design | 4 | 3 | 1 | 0 |

Totals: 24 courses; 13 subject primaries; 11 skill primaries; 0 missing secondary signals. BPED primary is Filipino/Araling Panlipunan; Pharmacy primary is PE & Health; Architecture primary Physics is outside C6. These are current mappings, not claims of curricular appropriateness.

## 5. Data schemas and course registration

### Real JSON excerpts for BSIT-001

Actual values, with arrays trimmed to their first entry. No invented fields.

`data/courses.json`

```json
{
  "courseId": "BSIT-001",
  "courseName": "BS Information Technology",
  "category": "Information Technology & Computing",
  "overview": "Prepares students to plan, install, and manage IT systems and applications used by organizations. Key subjects include programming, networking, and systems administration.",
  "schools": [
    {
      "name": "Bicol University Polangui",
      "location": "Polangui, Albay",
      "type": "Public"
    }
  ],
  "careerOpportunities": [
    {
      "jobTitle": "IT Support Specialist",
      "salaryRange": "₱18,000–₱30,000/mo",
      "notes": "entry-level"
    }
  ],
  "salarySource": "JobStreet Philippines salary guide; DOLE regional wage data",
  "salaryAsOf": "2025",
  "guidanceTips": "Most HEIs require a general average of 80%+; TESDA/vendor certifications strengthen employability."
}
```

`data/explore-courses.json`

```json
{
  "courseId": "BSIT-001",
  "courseName": "BS Information Technology",
  "category": "INFORMATION TECHNOLOGY & COMPUTING",
  "overview": "BS Information Technology is a broad, hands-on tech course that trains students to install, manage, and troubleshoot the computer systems organizations depend on every day. It's not limited to one specialization, depending on the electives and specialization track a school offers, IT graduates can move into network administration, cybersecurity, systems/database administration, technical support, UI/UX design, or entry-level software and web development. The course emphasizes applying and maintaining existing technology to solve real business problems, making it a practical entry point into almost any tech-related career.",
  "schools": [
    {
      "name": "Bicol University Polangui",
      "location": "Polangui, Albay",
      "type": "Public",
      "notes": ""
    }
  ],
  "schoolNotes": [
    "Note: Currently, no public community college in Albay offers a full BSIT program. Students in far-flung municipalities can start with a TESDA Computer Systems Servicing NC II or Programming NC II short course (often available at local community colleges or TESDA centers) as an affordable first step before or alongside a 4-year IT degree."
  ],
  "careerOpportunities": [
    {
      "jobTitle": "IT Support Specialist/Technician",
      "salaryRange": "₱16,000–₱25,000/mo",
      "notes": "entry-level"
    }
  ],
  "guidanceTips": "Free introductory resources such as HTML and CSS tutorials on YouTube or Sololearn can help students get a feel for the technical side of IT early on. Some students only realize later that IT work tends to be logical and repetitive rather than exciting, so this kind of early exposure is worth the time. Once in college, TESDA or vendor certifications such as CompTIA or Cisco NetAcad can strengthen a graduate's chances when applying for a first job."
}
```

source-inventory.json is a flat array of 746 strings, not a course registry. Exact BSIT-001/course-name entries: 0. A course object here is NOT DETERMINED because the file has none. A real relevant excerpt is:

```json
[
  "Figures as of",
  "Salary source:",
  "Up to 24 course matches, ranked just for you"
]
```

| Dataset | Entries | Top-level fields |
| --- | --- | --- |
| courses.json | 24 | courseId, courseName, category, overview, schools, careerOpportunities, salarySource, salaryAsOf, guidanceTips |
| explore-courses.json | 24 | courseId, courseName, category, overview, schools, schoolNotes, careerOpportunities, guidanceTips |

Scored categories use full title-case labels; detail categories use uppercase labels. resolveCategoryId matches exact codes or exact CATEGORY_LABELS values. Using detail category labels for scoring would not resolve them. Current IDs match across datasets.

| Information | courses.json | explore-courses.json | Limits |
| --- | --- | --- | --- |
| CHED program basis / CMO reference | No dedicated field | No dedicated field | Category-level rationale in docs/category-course-master-list.md; no structured per-course CMO/verification URL. |
| PRC licensure | No dedicated field; some salarySource text mentions PRC | No dedicated field; prose may mention licensure | Applicability/correctness NOT DETERMINED; no external verification. |
| Schools | name, location, type | name, location, type, notes; schoolNotes[] | No structured offering-verification date/source URL. |
| Salary source | Present on 24 entries | Present on 0 entries | Scored attribution is text, not structured source links. |
| Salary year | Present on 24; distinct: 2025 | Present on 0 entries | Years embedded in detail career prose are not metadata fields. |
| General source references | No sourceReferences/verification field | No sourceReferences/verification field | No automatic factual verification. |

The detail page source/date block is conditional on fields absent from its imported explore data, so it is not shown. `app/results/[courseId]/page.js:93`. PDF prints detail salaries/notes, not the scored salarySource/salaryAsOf fields. `lib/explorerReport.js:197`.

### New-course registration and maintenance locations

| File:line | Role |
| --- | --- |
| `data/courses.json:3` | Required for ranking: unique ID, recognized category and content fields. |
| `lib/scoringEngine.js:220` | A registration for primary evidence; absence silently gives zero. |
| `lib/scoringEngine.js:247` | D registration for secondary evidence; absence silently gives zero. |
| `data/explore-courses.json:3` | Required for matching detail route and first-course PDF details. |
| `app/results/[courseId]/page.js:16` | No separate ID registry; IDs derive from explore data. Missing ID → notFound. |
| `app/results/page.js:62` | No fixed ID registry; matching/details derive from scored data. |
| `lib/explorerReport.js:184` | No fixed ID registry; detail lookup derives from explore data. |
| `lib/i18n/fil-courses.js:1` | New narrative translations; proper names may remain unchanged. |
| `lib/i18n/fil-notes.js:1` | New notes/display text translations. |
| `lib/i18n/translate.js:7` | Merged catalogs; missing text uses source/phrase fallback. |
| `lib/i18n/source-inventory.json:487` | Inventory maintenance, not runtime course registration. |
| `scripts/localize-ui.cjs:39` | Historical one-time migration writes source files; not run for this audit. |
| `docs/career-dataset.md:2` | Long-form course descriptions/content. |
| `docs/category-course-master-list.md:10` | Candidate code/name/category list. |
| `instructions.md:275` | Current IDs/count/category composition. |
| `docs/scoring-table.md:136` | Signal mappings and count documentation. |
| `scripts/build-offline.mjs:27` | Generated routes collected dynamically; rebuild needed. No fixed 24-ID registry. |

Hard-coded course-count references and test assumptions (unrelated coordinates, salary amounts, dates and the legitimate C2 maximum 24 are excluded):

| File:line | Matching source text |
| --- | --- |
| `app/page.js:25` | { id: "islands", name: "The Islands", title: "See where your journey can take you.", body: "Your interests, strengths, and grades connect to college courses worth checking out.", stat: "POSSIBLE COURSES", count: 24, motif: "island-flag", note: "POSSIBILITIES" }, |
| `app/how-it-works/HowItWorks.js:36` | ["Up to 24 course matches, ranked just for you", "island-flag"], |
| `lib/i18n/fil.js:38` | "Along the Way": "Sa Daan", "Every trail you finish": "Bawat landas na natatapos mo", "unlocks something.": "ay may bagong gantimpala.", "Small rewards along the way, so it never feels like you're just filling out a form.": "May maliliit na gantimpala sa daan upang maging higit pa sa pagsagot ng form ang karanasan.", "03 / Your next direction": "03 / Ang iyong susunod na direksiyon", "What You'll Get": "Ang Makukuha Mo", "Up to 24 course matches, ranked just for you": "Hanggang 24 na angkop na kurso, na nakaayos para sa iyo", "A match score for each one": "Marka ng pagtutugma para sa bawat kurso", "Details for every course, including schools, careers, and tips to get there": "Mga detalye ng bawat kurso, kabilang ang mga paaralan, karera, at gabay", "A downloadable report you can keep or show your guidance counselor": "Ulat na mada-download, maitatago, o maipapakita sa iyong tagapayo", "Good to Know": "Mabuting Malaman", "No login needed": "Hindi kailangang mag-log in", "Progress is saved on this device": "Naka-save ang progreso sa device na ito", "Free for all Senior High School students": "Libre para sa lahat ng mag-aaral ng Senior High School", "About 10 minutes, start to finish": "Mga 10 minuto mula simula hanggang matapos", "Ready to see your map?": "Handa ka na bang makita ang iyong mapa?", |
| `lib/i18n/source-inventory.json:487` | "Up to 24 course matches, ranked just for you", |
| `instructions.md:275` | ## 7. CATEGORY & COURSE STRUCTURE (24 courses, 6 categories, 4 each) |
| `instructions.md:305` | \| F-08 \| Static Course/Career Dataset (24 courses, 6 categories) \| Planned \| |
| `docs/features-table.md:20` | F-08	Static Course/Career Dataset	Reference data on 24 courses across 6 categories, including schools and career info	Planned |
| `docs/scoring-table.md:13` | 2.	Course-level scoring — computes a match for all 24 courses using each course's category Match % plus its own tie-breaker signal. |
| `docs/scoring-table.md:24` | This document applies the real, finalized content from your 22-item Assessment Item Bank (Item 3) and your 24-course Career Dataset (Item 5) — every number below is built from your actual system content, not generic placeholders. |
| `docs/scoring-table.md:150` | The system's primary result is the complete list of 24 courses ranked from highest to lowest calculated course match percentage. If two courses tie after rounding, the course with the higher raw score before rounding ranks first. If still exactly tied, course name alphabetical order is the final tie-breaker. After this order is fixed, ranks 1–5 receive the documented display-only hundredth-point separation when needed. Category rankings remain available only as supplementary context, with the strongest category shown below the primary course list. |
| `docs/site-map.md:45` | •	Global ranked list of all 24 recommended courses, initially showing the top 5 |
| `docs/site-map.md:47` | •	"See All 24 Courses" expansion control |
| `docs/wireframe-description.md:105` | 52	Global ranked course card list	Top 5 shown first with an option to expand to all 24. Each card contains rank, course code/name, match %, category badge, one-line explanation, and "Explore This Course" button |
| `docs/wireframe-description.md:134` | The generated PDF should contain, in order: a cover section (Career Compass branding, nickname if provided, date), a primary "Your Top Course Matches" summary, a supplementary strongest-field note, a "Your Exploration Profile" summary, the complete ranked list of 24 courses, and the same guidance disclaimer used on the Results Page. |
| `docs/offline-mode.md:15` | `app/results/[courseId]/page.js` now prebuilds the existing 24 course IDs. |
| `docs/offline-mode.md:27` | `/results` and `/report`. The 24 `/results/[courseId]` routes are listed with |
| `lib/scoringEngine.test.js:364` | allCourseMatches.length === 24 && |

Results expansion/Filipino expansion grammar use actual length. PDF has a four-course slice, not a 24-course limit. About and Journey Guide contain no fixed 24-course count or strand array.

### The candidate list

Source: `docs/category-course-master-list.md:6`. Category headings and CHED discipline notes are followed by code/name rows. Parsed entries: 36; absent from scored data: 12. Each candidate row itself has only ID/name and inherited category. It lacks overview, schools, careers/salaries, source/year, guidance, structured CHED/PRC basis and A/D signals. Existing runtime content below is in other files, not in these candidate rows.

| ID | Name | Category | Runtime data today | Missing in candidate row |
| --- | --- | --- | --- | --- |
| BSIT-001 | BS Information Technology | C1 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSCS-001 | BS Computer Science | C1 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSIS-001 | BS Information Systems | C1 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSCpE-001 | BS Computer Engineering* | C1 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSDS-001 | BS Data Science | C1 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSEMC-001 | BS Entertainment and Multimedia Computing | C1 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSCE-001 | BS Civil Engineering | C2 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSEE-001 | BS Electrical Engineering | C2 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSECE-001 | BS Electronics Engineering | C2 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSME-001 | BS Mechanical Engineering | C2 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSIE-001 | BS Industrial Engineering | C2 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSABE-001 | BS Agricultural and Biosystems Engineering | C2 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSBA-001 | BS Business Administration | C3 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSA-001 | BS Accountancy | C3 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSENT-001 | BS Entrepreneurship | C3 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSHRM-001 | BS Hospitality Management | C3 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSTM-001 | BS Tourism Management | C3 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSREM-001 | BS Real Estate Management | C3 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BEED-001 | Bachelor of Elementary Education | C4 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSED-001 | Bachelor of Secondary Education | C4 | Present in both JSON datasets | All fields beyond ID/name/category |
| BTLE-001 | Bachelor of Technology and Livelihood Education | C4 | Present in both JSON datasets | All fields beyond ID/name/category |
| BPED-001 | Bachelor of Physical Education | C4 | Present in both JSON datasets | All fields beyond ID/name/category |
| BECEd-001 | Bachelor of Early Childhood Education | C4 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSNEd-001 | Bachelor of Special Needs Education | C4 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSN-001 | BS Nursing | C5 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSPharma-001 | BS Pharmacy | C5 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSMLS-001 | BS Medical Laboratory Science | C5 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSRT-001 | BS Radiologic Technology | C5 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSPT-001 | BS Physical Therapy | C5 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSND-001 | BS Nutrition and Dietetics | C5 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSArch-001 | BS Architecture | C6 | Present in both JSON datasets | All fields beyond ID/name/category |
| BFA-001 | Bachelor of Fine Arts | C6 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSID-001 | BS Interior Design | C6 | Present in both JSON datasets | All fields beyond ID/name/category |
| BSMA-001 | BS Multimedia Arts | C6 | Present in both JSON datasets | All fields beyond ID/name/category |
| BLA-001 | Bachelor of Landscape Architecture | C6 | Absent in both; A/D absent | All fields beyond ID/name/category |
| BSFT-001 | BS Fashion and Textile Design | C6 | Absent in both; A/D absent | All fields beyond ID/name/category |

| Category | Candidate entries | Implemented | Candidate-only |
| --- | --- | --- | --- |
| C1 | 6 | 4 | 2 |
| C2 | 6 | 4 | 2 |
| C3 | 6 | 4 | 2 |
| C4 | 6 | 4 | 2 |
| C5 | 6 | 4 | 2 |
| C6 | 6 | 4 | 2 |

## 6. Where strand and curriculum are used today

| File:line | Read/write today | Second-input impact |
| --- | --- | --- |
| `lib/useSessionAnswers.js:24` | Default empty-string write. | New curriculum/cluster defaults and legacy compatibility would need definition. |
| `lib/useSessionAnswers.js:80` | Restore read/write: string only. | Cluster array needs normalization. |
| `lib/useSessionAnswers.js:98` | Generic patch spread, then updateSession persists JSON. | Retains unknown fields, but does not validate clusters. |
| `lib/useSessionAnswers.js:207` | Projection into scoring answers. | Unprojected cluster fields do not reach normal scoring calls. |
| `lib/browserStorage.js:2` | Whole session serialized/read/reset. | Same record can carry fields; schema/migration still needed. |
| `lib/assessmentValidation.js:5` | Read ACA-01 options. | No cluster validation source. |
| `lib/assessmentValidation.js:18` | Require valid strand for academic completion. | Cluster-only profile fails. |
| `lib/assessmentValidation.js:25` | Require strand to preserve sequential completion. | New intake type needs handling. |
| `app/intake/page.js:19` | Local seven-key list/order. | Old-flow list is separate from a future cluster list. |
| `app/intake/page.js:78` | Step 1 guard read. | Rejects missing strand. |
| `app/intake/page.js:90` | Write chosen key or empty string. | Multiple choices need different update behavior. |
| `app/intake/page.js:103` | Leaving-intake prompt read. | New intake progress needs recognition. |
| `app/intake/page.js:128` | Recap read/full GAS display. | Cluster summary absent. |
| `app/intake/page.js:137` | Value/checked read; short GAS/full accessible name. | Current single selection is not a cluster list. |
| `app/intake/page.js:149` | Entry guard reads strand again. | Cluster-only entry fails. |
| `components/JourneyAccess.js:9` | isValidStrand read gating assessment/results/report pages. | Needs intake-type-aware readiness. |
| `lib/journeyEntry.js:4` | Truthy read for continue route. | Does not recognize cluster-only intake. |
| `app/journey/page.js:129` | Basecamp completion marker read. | New intake type needs recognition. |
| `app/journey/page.js:151` | Read current and saved strand; redirect if missing. | Cluster-only profile redirects. |
| `app/journey/page.js:163` | Map initialization read. | New intake type needs recognition. |
| `app/journey/page.js:472` | Map progression/completion truthiness read. | New intake type needs recognition. |
| `app/journey/academic/page.js:90` | Read key; find full text/category. | No cluster card summary. |
| `app/journey/academic/page.js:174` | GAS icon branch. | Cluster icon handling absent. |
| `app/processing/page.js:34` | Strand/progress readiness; session passed to engine. | Cluster-only profile cannot process. |
| `lib/scoringEngine.js:113` | Read for category points. | Needs cluster contribution resolution or adapter. |
| `lib/scoringEngine.js:333` | Read for literal +2 course B. | Needs separate cluster alignment resolution. |
| `app/results/page.js:154` | GAS-only summary/icon read. | No general cluster summary. |
| `lib/explorerReport.js:170` | PDF answers/profile strand read/full GAS label. | No curriculum/cluster report text. |
| `lib/weightTable.js:74` | Seven exact keys and mappings. | No cluster/elective mapping. |
| `data/items.json:337` | Seven valid strand values/category arrays. | No curriculum selector/cluster bank. |
| `scripts/check-strands.mjs:6` | Read intake/items/weights for consistency. | Only strand checks exist. |
| `lib/i18n/fil-notes.js:38` | Strand names/subject-value translations. | New copy needs translation entries. |
| `lib/i18n/patterns.js:29` | PDF academic-line translation grammar. | Grammar is strand-specific. |

No implemented curriculum discriminator, cluster selection state, cluster score table or elective aggregator was found in app/lib/data. The draft lists 5 Academic and 10 TechPro clusters; policy claims were not independently verified. `docs/curriculum-upgrade-plan.md:44`.

Documentation discussing strand inputs (prose/example line lists, not runtime reads):

| File | Matching lines | Role |
| --- | --- | --- |
| instructions.md | 59, 67, 81, 88, 193, 194, 195, 216, 235, 253, 264 | Documentation; does not drive runtime scores. |
| docs/item-bank.md | 57, 62, 64, 65, 66, 67, 68 | Documentation; does not drive runtime scores. |
| docs/scoring-table.md | 62, 63, 64, 65, 66, 67, 91, 95, 117, 154, 162, 170 | Documentation; does not drive runtime scores. |
| docs/site-map.md | 19, 38 | Documentation; does not drive runtime scores. |
| docs/wireframe-description.md | 31, 82 | Documentation; does not drive runtime scores. |
| docs/ui-design-notes.md | 382, 384, 385, 386, 387, 403 | Documentation; does not drive runtime scores. |
| docs/career-dataset.md | 87 | Documentation; does not drive runtime scores. |
| docs/category-course-master-list.md | None | Documentation; does not drive runtime scores. |
| docs/curriculum-upgrade-plan.md | 20, 24, 25, 42, 51, 63, 65, 66, 67, 69, 71, 72, 73, 95, 109, 117, 119, 151, 159, 161, 188, 201, 213, 214, 223, 227, 228, 229, 230, 239, 262, 272, 274, 275, 307, 310, 325, 326, 329, 335, 336, 338, 350, 352, 353, 361, 368, 406, 407, 408, 415, 428, 432, 440, 444, 445, 449 | Draft only; GAS-missing description is stale. |

UI catalogs/source inventory contain strand copy; tests contain sample strand keys. Those are not extra scoring mappings. A complete runtime strand-reference line index is appended below.

## 7. Measurements

### Method, seed, reproducibility and limits

- Date: 2026-10-20; timezone Asia/Manila; seed 20261020; 2000 valid base profiles.
- Unsigned 32-bit LCG: `state = (Math.imul(1664525,state)+1013904223) >>> 0`; `random = state/4294967296`. Interests are uniform over each item’s options; skill integers uniform 1–5; GWA uniform over 2501 hundredth-point values 75.00–100.00. Subjects use Fisher–Yates shuffle and a uniform count 1–3. Real isSectionValid passed for every base profile in all assessments.
- Same profiles reused across strands; GAS baseline. GAS retains GWA and A/D evidence; only strand contributions are zero. Imported calculateCategoryScores, calculateMatchPercentages, rankResults and calculateAllCourseMatches execute the scoring. Formula is not reimplemented. Source signal literals are parsed only for tables.
- Synthetic mappings are added to the imported STRAND_WEIGHTS object in the measurement process only, then removed in finally blocks. Files are not rewritten. Synthetic keys bypass intake membership validation for these engine-only stand-ins; production intake does not accept them.
- Distributions use raw category percentages. Median averages the central sorted pair. SD is population SD. Table rates divide exact counts by stated trial counts; decimal displays round to 6 places. Comparisons use unrounded values. Top-four membership ignores order; ordered top-four compares the ID tuple.
- Uniform synthetic answers are a code-sensitivity experiment, not an empirical student population or a fairness/validity study.
- Profile JSON SHA-256: `01c3436fd8f51dfe97f9c7bb1f72fe12222e6fbf656269fed626bde2a887f335`. Full output SHA-256: `06ed4cf6d6d5dad0a49adb0fdbec451353e74e18125a9338832b6e216833f096`. Both complete outputs are byte-identical.
- Reproduce from repository root: `node "C:/Users/Charlene/.codex/visualizations/2026/10/20/01a15789-1ae2-7e11-80ea-0677702ed9c4/scoring-audit-temp/measure.mjs" measurements-1.json`, then repeat with measurements-2.json. Helper and raw outputs stay outside the repository at `C:/Users/Charlene/.codex/visualizations/2026/10/20/01a15789-1ae2-7e11-80ea-0677702ed9c4/scoring-audit-temp`. No dependency installed.

### 7a. Strand points in every category

Each cell is `raw category points / direct course B / uncapped course-score delta`. Isolated against the same empty-evidence, GWA=75, GAS profile. This isolates marginal contribution; it is not a completable UI profile. No cap is reached. High-scoring answers can lose part of the displayed benefit to the course cap.

| Strand | C1 | C2 | C3 | C4 | C5 | C6 |
| --- | --- | --- | --- | --- | --- | --- |
| Academic-STEM | 2 / 2 / 9.04 | 2 / 2 / 9.333333 | 0 / 0 / 0 | 0 / 0 / 0 | 2 / 2 / 7.866667 | 0 / 0 / 0 |
| Academic-ABM | 0 / 0 / 0 | 0 / 0 / 0 | 2 / 2 / 9.04 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| Academic-HUMSS | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 2 / 2 / 8.285714 | 0 / 0 / 0 | 0 / 0 / 0 |
| Academic-GAS | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| TVL | 0 / 0 / 0 | 2 / 2 / 9.333333 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| Arts & Design | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 2 / 2 / 8.769231 |
| Sports | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 2 / 2 / 7.866667 | 0 / 0 / 0 |

| Boosted category | Category % delta from +2 | Course raw delta including B |
| --- | --- | --- |
| C1 | 8 | 9.04 |
| C2 | 8.333333 | 9.333333 |
| C3 | 8 | 9.04 |
| C4 | 7.142857 | 8.285714 |
| C5 | 6.666667 | 7.866667 |
| C6 | 7.692308 | 8.769231 |

### 7b. Unequal strand budgets

| Strand | Categories boosted | Total raw category points | B summed across aligned courses | Raw course delta summed across dataset |
| --- | --- | --- | --- | --- |
| Academic-STEM | 3 | 6 | 24 | 104.96 |
| Academic-ABM | 1 | 2 | 8 | 36.16 |
| Academic-HUMSS | 1 | 2 | 8 | 33.142857 |
| Academic-GAS | 0 | 0 | 0 | 0 |
| TVL | 1 | 2 | 8 | 37.333333 |
| Arts & Design | 1 | 2 | 8 | 35.076923 |
| Sports | 1 | 2 | 8 | 31.466667 |

Last column is accounting across all courses, not one course score. Current 4 courses/category means direct B sums to 8 per boosted category. More courses change that sum, not the individual-course formula.

### 7c. Distribution and category rank-one frequency

GAS baseline raw category percentages:

| Category | Minimum % | Median % | Maximum observed % |
| --- | --- | --- | --- |
| C1 | 0 | 24 | 76 |
| C2 | 0 | 25 | 75 |
| C3 | 0 | 24 | 76 |
| C4 | 0 | 25 | 67.857143 |
| C5 | 0 | 26.666667 | 66.666667 |
| C6 | 0 | 23.076923 | 73.076923 |

Raw percentage distributions under every strand (same profiles):

| Strand | Category | Minimum % | Median % | Maximum observed % |
| --- | --- | --- | --- | --- |
| Academic-STEM | C1 | 8 | 32 | 84 |
| Academic-STEM | C2 | 8.333333 | 33.333333 | 83.333333 |
| Academic-STEM | C3 | 0 | 24 | 76 |
| Academic-STEM | C4 | 0 | 25 | 67.857143 |
| Academic-STEM | C5 | 6.666667 | 33.333333 | 73.333333 |
| Academic-STEM | C6 | 0 | 23.076923 | 73.076923 |
| Academic-ABM | C1 | 0 | 24 | 76 |
| Academic-ABM | C2 | 0 | 25 | 75 |
| Academic-ABM | C3 | 8 | 32 | 84 |
| Academic-ABM | C4 | 0 | 25 | 67.857143 |
| Academic-ABM | C5 | 0 | 26.666667 | 66.666667 |
| Academic-ABM | C6 | 0 | 23.076923 | 73.076923 |
| Academic-HUMSS | C1 | 0 | 24 | 76 |
| Academic-HUMSS | C2 | 0 | 25 | 75 |
| Academic-HUMSS | C3 | 0 | 24 | 76 |
| Academic-HUMSS | C4 | 7.142857 | 32.142857 | 75 |
| Academic-HUMSS | C5 | 0 | 26.666667 | 66.666667 |
| Academic-HUMSS | C6 | 0 | 23.076923 | 73.076923 |
| Academic-GAS | C1 | 0 | 24 | 76 |
| Academic-GAS | C2 | 0 | 25 | 75 |
| Academic-GAS | C3 | 0 | 24 | 76 |
| Academic-GAS | C4 | 0 | 25 | 67.857143 |
| Academic-GAS | C5 | 0 | 26.666667 | 66.666667 |
| Academic-GAS | C6 | 0 | 23.076923 | 73.076923 |
| TVL | C1 | 0 | 24 | 76 |
| TVL | C2 | 8.333333 | 33.333333 | 83.333333 |
| TVL | C3 | 0 | 24 | 76 |
| TVL | C4 | 0 | 25 | 67.857143 |
| TVL | C5 | 0 | 26.666667 | 66.666667 |
| TVL | C6 | 0 | 23.076923 | 73.076923 |
| Arts & Design | C1 | 0 | 24 | 76 |
| Arts & Design | C2 | 0 | 25 | 75 |
| Arts & Design | C3 | 0 | 24 | 76 |
| Arts & Design | C4 | 0 | 25 | 67.857143 |
| Arts & Design | C5 | 0 | 26.666667 | 66.666667 |
| Arts & Design | C6 | 7.692308 | 30.769231 | 80.769231 |
| Sports | C1 | 0 | 24 | 76 |
| Sports | C2 | 0 | 25 | 75 |
| Sports | C3 | 0 | 24 | 76 |
| Sports | C4 | 0 | 25 | 67.857143 |
| Sports | C5 | 6.666667 | 33.333333 | 73.333333 |
| Sports | C6 | 0 | 23.076923 | 73.076923 |

Observed sample maxima are not theoretical maxima. Category rank-one counts use real rankResults tie-breaks. Each row sums to 2000.

| Strand | C1 | C2 | C3 | C4 | C5 | C6 | Top course changed vs GAS | Top-four membership changed vs GAS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Academic-STEM | 454 | 486 | 239 | 220 | 404 | 197 | 417/2000 (20.85%) | 864/2000 (43.2%) |
| Academic-ABM | 285 | 309 | 611 | 272 | 279 | 244 | 280/2000 (14%) | 613/2000 (30.65%) |
| Academic-HUMSS | 301 | 314 | 310 | 519 | 302 | 254 | 231/2000 (11.55%) | 565/2000 (28.25%) |
| Academic-GAS | 333 | 353 | 356 | 327 | 337 | 294 | 0/2000 (0%) | 0/2000 (0%) |
| TVL | 280 | 621 | 308 | 276 | 265 | 250 | 351/2000 (17.55%) | 715/2000 (35.75%) |
| Arts & Design | 291 | 302 | 327 | 293 | 299 | 488 | 224/2000 (11.2%) | 553/2000 (27.65%) |
| Sports | 295 | 298 | 309 | 284 | 561 | 253 | 292/2000 (14.6%) | 642/2000 (32.1%) |

### 7d. Bonus-budget sensitivity

For each B/k, every distinct k-category subset is tested: 6 subsets at k=1; 15 subsets at k=2; 20 subsets at k=3. Each subset crosses all 2000 profiles. Each category receives B/k raw points. B=0 uses an empty mapping and is truly no bonus. Current denominators are retained.

Two paths share these category percentages. **Category-only** matches courses with GAS (B component zero). **Coupled** matches with the synthetic aligned key, adding today’s literal +2 B to courses in each selected category. This direct course alignment is outside the stated raw category budget. Neither path is an implemented cluster policy.

| B | k | Trials | Category-only top 1 change | Category-only top 4 membership change | Coupled top 1 change | Coupled top 4 membership change |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 | 12000 | 0/12000 (0%) | 0/12000 (0%) | 0/12000 (0%) | 0/12000 (0%) |
| 0 | 2 | 30000 | 0/30000 (0%) | 0/30000 (0%) | 0/30000 (0%) | 0/30000 (0%) |
| 0 | 3 | 40000 | 0/40000 (0%) | 0/40000 (0%) | 0/40000 (0%) | 0/40000 (0%) |
| 2 | 1 | 12000 | 1209/12000 (10.075%) | 3129/12000 (26.075%) | 1660/12000 (13.833333%) | 3745/12000 (31.208333%) |
| 2 | 2 | 30000 | 2337/30000 (7.79%) | 6891/30000 (22.97%) | 3563/30000 (11.876667%) | 9701/30000 (32.336667%) |
| 2 | 3 | 40000 | 2353/40000 (5.8825%) | 7341/40000 (18.3525%) | 4023/40000 (10.0575%) | 11744/40000 (29.36%) |
| 4 | 1 | 12000 | 2952/12000 (24.6%) | 5036/12000 (41.966667%) | 3469/12000 (28.908333%) | 5632/12000 (46.933333%) |
| 4 | 2 | 30000 | 4472/30000 (14.906667%) | 11380/30000 (37.933333%) | 5940/30000 (19.8%) | 13071/30000 (43.57%) |
| 4 | 3 | 40000 | 4500/40000 (11.25%) | 12485/40000 (31.2125%) | 6058/40000 (15.145%) | 15559/40000 (38.8975%) |
| 6 | 1 | 12000 | 4831/12000 (40.258333%) | 6952/12000 (57.933333%) | 5387/12000 (44.891667%) | 7447/12000 (62.058333%) |
| 6 | 2 | 30000 | 7135/30000 (23.783333%) | 14115/30000 (47.05%) | 8767/30000 (29.223333%) | 15296/30000 (50.986667%) |
| 6 | 3 | 40000 | 6324/40000 (15.81%) | 16032/40000 (40.08%) | 8144/40000 (20.36%) | 17821/40000 (44.5525%) |
| 8 | 1 | 12000 | 6527/12000 (54.391667%) | 8534/12000 (71.116667%) | 7059/12000 (58.825%) | 8924/12000 (74.366667%) |
| 8 | 2 | 30000 | 9696/30000 (32.32%) | 16200/30000 (54%) | 10978/30000 (36.593333%) | 17411/30000 (58.036667%) |
| 8 | 3 | 40000 | 8438/40000 (21.095%) | 18168/40000 (45.42%) | 10289/40000 (25.7225%) | 19470/40000 (48.675%) |

Ordered top-four changes, including reshuffling the same members:

| B | k | Category-only ordered top 4 change | Coupled ordered top 4 change |
| --- | --- | --- | --- |
| 0 | 1 | 0/12000 (0%) | 0/12000 (0%) |
| 0 | 2 | 0/30000 (0%) | 0/30000 (0%) |
| 0 | 3 | 0/40000 (0%) | 0/40000 (0%) |
| 2 | 1 | 3202/12000 (26.683333%) | 3764/12000 (31.366667%) |
| 2 | 2 | 8508/30000 (28.36%) | 10388/30000 (34.626667%) |
| 2 | 3 | 10394/40000 (25.985%) | 13518/40000 (33.795%) |
| 4 | 1 | 5036/12000 (41.966667%) | 5632/12000 (46.933333%) |
| 4 | 2 | 11737/30000 (39.123333%) | 13238/30000 (44.126667%) |
| 4 | 3 | 14233/40000 (35.5825%) | 16279/40000 (40.6975%) |
| 6 | 1 | 6952/12000 (57.933333%) | 7447/12000 (62.058333%) |
| 6 | 2 | 14253/30000 (47.51%) | 15422/30000 (51.406667%) |
| 6 | 3 | 16807/40000 (42.0175%) | 18340/40000 (45.85%) |
| 8 | 1 | 8534/12000 (71.116667%) | 8924/12000 (74.366667%) |
| 8 | 2 | 16339/30000 (54.463333%) | 17550/30000 (58.5%) |
| 8 | 3 | 18785/40000 (46.9625%) | 20005/40000 (50.0125%) |

Rates average profile/subset trials, not students affected by one particular cluster mapping. Subsets have equal experimental weight. Per-subset counts remain in the external output.

### 7e. Changed bonuses, denominators and old-flow compatibility

- STRAND_WEIGHTS.points changes raw contributions for every existing nonempty strand mapping; it does not change literal course B=2. MAX_POSSIBLE_SCORES changes percentages, bases and potentially rankings for old answers.
- New strand mappings do not recompute denominators. Empty GAS/unknown mappings add no category points. Current denominators reserve 2 possible intake points per category.
- If a category’s new maximum intake contribution is b and all other sources stay unchanged, its theoretical denominator is `oldMaximum - 2 + b`. For multiple selections, b depends on aggregation/deduplication/caps; those new policy rules are NOT DETERMINED.
- The following counts are trials with at least one exceedance, not individual course counts. Course raw means before the existing cap.

| B | k | Trials | Raw category exceeds fixed max | Raw category % exceeds 100 | Any course raw exceeds 100 |
| --- | --- | --- | --- | --- | --- |
| 0 | 1 | 12000 | 0 | 0 | 0 |
| 0 | 2 | 30000 | 0 | 0 | 0 |
| 0 | 3 | 40000 | 0 | 0 | 0 |
| 2 | 1 | 12000 | 0 | 0 | 0 |
| 2 | 2 | 30000 | 0 | 0 | 0 |
| 2 | 3 | 40000 | 0 | 0 | 0 |
| 4 | 1 | 12000 | 0 | 0 | 0 |
| 4 | 2 | 30000 | 0 | 0 | 0 |
| 4 | 3 | 40000 | 0 | 0 | 0 |
| 6 | 1 | 12000 | 0 | 0 | 0 |
| 6 | 2 | 30000 | 0 | 0 | 0 |
| 6 | 3 | 40000 | 0 | 0 | 0 |
| 8 | 1 | 12000 | 11 | 11 | 11 |
| 8 | 2 | 30000 | 0 | 0 | 0 |
| 8 | 3 | 40000 | 0 | 0 | 0 |

No observed exceedance is not proof of impossibility. A valid profile maximizing a category can reach the current maximum with 2 intake points. A larger allowed contribution can exceed that denominator even when random draws rarely align all evidence.

### 7f. Multiple cluster stand-ins

The stand-ins union existing strand arrays. Each category receives at most the current 2 raw points and +2 B. Overlapping STEM/TVL categories do not stack. This is not a real cluster map or a fixed-budget design. SD/gaps use uncapped raw scores to avoid conflating dispersion with display tie adjustment.

| Stand-ins | Union categories | Raw budget | Mean category SD | Mean course SD | Mean rank 1–4 gap | Mean distinct rounded scores | Rank 1 rounded tie count | Mean categories/top 4 | Top 1 changed vs GAS | Top 4 changed vs GAS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAS | None | 0 | 12.415795 | 11.783412 | 5.031628 | 13.947 | 477 | 1.433 | 0/2000 (0%) | 0/2000 (0%) |
| STEM | C1, C2, C5 | 6 | 13.153297 | 12.874035 | 4.947945 | 14.0955 | 498 | 1.443 | 417/2000 (20.85%) | 864/2000 (43.2%) |
| STEM + HUMSS | C1, C2, C5, C4 | 8 | 13.03955 | 12.700265 | 5.061058 | 14.0825 | 494 | 1.413 | 336/2000 (16.8%) | 736/2000 (36.8%) |
| STEM + TVL | C1, C2, C5 | 6 | 13.153297 | 12.874035 | 4.947945 | 14.0955 | 498 | 1.443 | 417/2000 (20.85%) | 864/2000 (43.2%) |
| STEM + HUMSS + ABM | C1, C2, C5, C4, C3 | 10 | 12.863513 | 12.422178 | 5.030037 | 14.0735 | 493 | 1.4175 | 196/2000 (9.8%) | 476/2000 (23.8%) |
| STEM + HUMSS + Arts | C1, C2, C5, C4, C6 | 10 | 12.719959 | 12.238322 | 5.032714 | 14.0335 | 480 | 1.4225 | 234/2000 (11.7%) | 552/2000 (27.6%) |

There is no general flattening result. All shown nonempty unions have higher mean course SD than GAS. Broader STEM unions lower SD relative to STEM in the shown cases; rank 1–4 gaps remain close to baseline. STEM+TVL is exactly the same scoring union as STEM. Summing instead of unioning could duplicate overlap; the current input API defines no such policy.

### 7g. Courses reachable in top four without strand bonus

All 24 of 24 have a valid GAS top-four witness. That establishes existence for every current course without exhaustive enumeration. Counts are sample appearances, not population probabilities.

| Course | Top 1 appearances | Top 4 appearances | Best rank | Witness sample index |
| --- | --- | --- | --- | --- |
| BSIT-001 | 96 | 320 | 1 | 2 |
| BSCS-001 | 86 | 341 | 1 | 2 |
| BSIS-001 | 88 | 382 | 1 | 2 |
| BSCpE-001 | 85 | 357 | 1 | 2 |
| BSCE-001 | 115 | 406 | 1 | 0 |
| BSEE-001 | 61 | 355 | 1 | 0 |
| BSECE-001 | 87 | 334 | 1 | 0 |
| BSME-001 | 93 | 392 | 1 | 0 |
| BSBA-001 | 96 | 362 | 1 | 3 |
| BSA-001 | 106 | 320 | 1 | 7 |
| BSENT-001 | 44 | 297 | 1 | 7 |
| BSHRM-001 | 83 | 355 | 1 | 3 |
| BEED-001 | 132 | 371 | 1 | 1 |
| BSED-001 | 71 | 300 | 1 | 1 |
| BTLE-001 | 45 | 340 | 1 | 1 |
| BPED-001 | 70 | 297 | 1 | 1 |
| BSN-001 | 146 | 393 | 1 | 4 |
| BSPharma-001 | 78 | 314 | 1 | 4 |
| BSMLS-001 | 89 | 348 | 1 | 4 |
| BSRT-001 | 53 | 362 | 1 | 4 |
| BSArch-001 | 44 | 241 | 1 | 8 |
| BFA-001 | 87 | 280 | 1 | 8 |
| BSID-001 | 75 | 253 | 1 | 8 |
| BSMA-001 | 70 | 280 | 1 | 9 |

The external JSON stores each witness’s complete valid answer set and top-four tuple. Indices are zero-based positions in the seeded profile array.

## 8. Technical feasibility notes

### Second bonus input

The arithmetic can remain normalization plus A/B/C/D, but current resolution cannot read clusters. calculateCategoryScores reads one strand string with one global point amount. courseComponents separately reads the same string and emits binary 2-point B. There is no per-category fractional alignment table, per-cluster budget, multi-selection cap or curriculum branch.

A second input requires session projection, validation/access gates, category contribution resolution, course B resolution and report/display handling. Exact old-flow compatibility requires identical old raw contributions, denominators and B values. Shared-table changes affect old profiles. Engineering effort/time is NOT DETERMINED; no second-input implementation or benchmark exists.

### Subject labels and optional electives

ACA-04 separates option.value from option.text. Valley saves value; validators, SUBJECTS_WEIGHTS and A/D subject signals match exact stored values. Text-only changes can preserve scoring if all keys remain unchanged. New display copy needs translations. Renaming a value requires updating mappings/signals/valid options and handling saved values.

Non-scoring electives could remain metadata without changing scoring arithmetic, but no elective field is currently projected into answers or rendered in the report. Unknown fields can survive session spreads; that is not a validated schema. Light scoring requires an explicit aggregate/table rule: current subjects award 2 per valid selected subject up to 3, not one normalized contribution independent of elective count. Unknown elective labels fail validation or contribute zero. A/D uses hasSubject over the entire supplied array, even beyond category scoring’s first-three cap, if validation is bypassed.

### More courses or a category

A new course in a known category needs no category-weight/maximum change; missing A/D silently contribute zero. An unknown category has no recognized base. New-category work includes CATEGORY_IDS, emptyScores, CATEGORY_LABELS, MAX_POSSIBLE_SCORES and valid item mappings; adding a JSON row or CATEGORY_LABELS alone is insufficient. GWA_CATEGORIES separately controls course C eligibility. StatementIcon and interests presentation have fixed category art maps. These registrations are independent.

### Intake space

Read-only measurements used current English intake and saved test profile. No new options were injected. `app/intake/basecamp.css:9` sets max-width 56.25rem; measured max is 900px. `app/intake/basecamp.css:24` sets form max-width 43.125rem; measured max is 690px. Final strand styles use centered wrapping, 48px height and 9px gaps. `app/intake/basecamp.css:243`.

| Viewport CSS px | Shell w × h | Form width | Button w × h | Current rows / group height | Current inner overflow | Continue bottom |
| --- | --- | --- | --- | --- | --- | --- |
| 1920 × 1080 | 900 × 994 | 690 | 165.75 × 48 | 2 / 105 | 0 | 776.34375 |
| 1440 × 900 | 900 × 814 | 690 | 165.75 × 48 | 2 / 105 | 0 | 775.546875 |
| 1280 × 720 | 900 × 634 | 690 | 165.75 × 48 | 2 / 105 | 0 | 666.328125 |
| 950 × 900 | 900 × 814 | 690 | 340.5 × 48 | 4 / 219 | 0 | 824.296875 |
| 375 × 813 | 343 × 741 | 283 | 137 × 48 | 4 / 219 | 117 | 880.46875 |

Breakpoints: ≤950px uses 2 strand columns; ≤768px changes shell/form/choice padding and some type; ≤479px changes shell padding/avatar layout; ≤800px height compresses form/shell spacing; ≤540px height changes the explorer-step overflow. Basecamp is fixed with overflow hidden; basecamp-inner scrolls. Sources: `app/intake/basecamp.css:247`, `app/intake/basecamp.css:230`, `app/intake/basecamp.css:69`, `app/intake/basecamp.css:123`, `app/intake/basecamp.css:141`.

Conditional pixel accounting for the contemplated 15 choices plus “not sure”: retain existing height/gap/columns and other content. Group height = rows*48+(rows-1)*9. Available inner height = shell.clientHeight minus computed vertical padding. Conditional overflow = max(0,current inner.scrollHeight+added group height-available inner height). These calculations were executed; this is not a rendered prototype.

| Viewport | Columns / rows for 16 | Group height | Added height | Available inner height | Conditional overflow |
| --- | --- | --- | --- | --- | --- |
| 1920 × 1080 | 4 / 4 | 219 | 114 | 948 | 0 |
| 1440 × 900 | 4 / 4 | 219 | 114 | 768 | 50 |
| 1280 × 720 | 4 / 4 | 219 | 114 | 604 | 112 |
| 950 × 900 | 2 / 8 | 447 | 228 | 768 | 212 |
| 375 × 813 | 2 / 8 | 447 | 228 | 703 | 345 |

That unchanged-box calculation fits the largest desktop but needs scrolling at the other measured sizes. Actual cluster-label wrapping, bilingual fit and any extra curriculum question are NOT DETERMINED: those controls are not implemented. No redesign was performed.

### Tests, scripts and baselines

| Existing file | Coverage |
| --- | --- |
| lib/scoringEngine.test.js | Personas; empty/partial/invalid answers; components/caps/ranking/DTO; fixed 24-course assertions. |
| lib/scoringEngine.integration.test.js | Full pipeline/ties and explicit GAS/no-strand equality. |
| lib/scoringEngine.skillBoundary.test.js | Rating-4 contributions and reproduction profile. |
| lib/scoringEngine.secondarySignals.test.js | Complete profile regression for D and course ordering. |
| lib/assessmentValidation.test.js | Membership/ranges, subject cap/deduplication and restored completion. |
| lib/browserStorage.test.js | Migration/reset/storage failures. |
| lib/courseComparison.test.js | Two-course comparison toggle/limit. |
| lib/i18n/translate.test.js | Prompt/narrative translations, proper names and dynamic copy. |
| lib/offline-worker.test.mjs | Offline behavior; not run for this scoring audit. |
| scripts/check-strands.mjs | Intake/item/weight consistency and empty GAS. |
| tmp/pdfs/verify.mjs | Existing ad hoc bilingual PDF helper writes outputs; not run in this audit. |

Executed: `node --test lib/scoringEngine*.test.js lib/assessmentValidation.test.js lib/i18n/translate.test.js lib/browserStorage.test.js lib/courseComparison.test.js`: 22 passes, 0 failures. `node scripts/check-strands.mjs`: pass. Logs remain outside the repo. package.json exposes dev/build/start/lint but no test script.

Missing future coverage: intake-mode discrimination; absent/unknown/duplicate clusters; fractional/equal budgets; overlaps/caps; elective aggregation; denominator compatibility; complete course/signal registration; new categories; bilingual UI/PDF; and full new-flow journey. These external experiments do not install permanent tests.

Old-flow snapshot: `C:/Users/Charlene/.codex/visualizations/2026/10/20/01a15789-1ae2-7e11-80ea-0677702ed9c4/gas-baseline.json`. It has 12 varied profiles across the original six strands, complete rankings and top-four records. All compare identically today. Adjacent gas-report-en.pdf, gas-report-fil.pdf and layout-verification.json are PDF/layout artifacts, not exhaustive scoring baselines. No new-curriculum fixtures exist there.

## 9. Open questions for the planner

- Does equal budget mean raw category points, course B, or combined normalized course gain? These are distinct today.
- What evidence/maps justify each real cluster? NOT DETERMINED: draft names exist, but no implemented cluster/category table. Policy was not independently checked.
- Is the multi-cluster budget per student or per selection, unioned, summed or capped? NOT DETERMINED by the single-strand API.
- How should denominators differ by intake type? Shared denominator changes affect old scores; larger numerators can exceed 100 before course capping.
- What one-time elective rule implements “not extra points per elective”? NOT DETERMINED: no rule, schema or reliability weight is implemented.
- Which courses/category will be added? NOT DETERMINED. Candidate names are not completed datasets or approved evidence mappings.
- Site-map/wireframe docs specify top five and a complete 24-course PDF. Current Results/PDF use four and omit numeric scores. strongestCategory is calculated but not displayed as described.
- The draft still says GAS is missing; code includes it. The draft says subject label text is the key; actual options separate value from display text. Code is authoritative for this audit.
- Scored/detail school lists, salaries and metadata differ. Detail source/year fields are absent. Current offerings, CHED program basis and PRC licensure are NOT DETERMINED by this audit.
- Validation and engine tolerance differ: rating 6 can earn category skill points but no A/D; numeric strings can be coerced by engine but rejected by UI. A/D subject presence scans beyond the category cap if supplied invalid extra values. Future adapters must not assume the pure engine enforces UI validity.
- Exact ties use localeCompare. Cross-runtime collation identity is NOT DETERMINED; repeatability runs used the same runtime. Display-only hundredths are not extra evidence.
- Engineering time, predictive validity, real-student fairness and actual rendered future-screen fit are NOT DETERMINED. These controlled measurements do not establish them.

### Runtime strand reference index

Generated line lists include repeated reads/writes, declarations, guards, comments, dependencies and JSX; grouped roles appear in Section 6.

| File | Matching lines |
| --- | --- |
| app/intake/page.js | 19, 66, 78, 80, 83, 90, 93, 103, 126, 128, 135, 136, 137, 138, 149 |
| app/journey/page.js | 20, 129, 151, 152, 159, 163, 200, 472, 491 |
| app/journey/academic/page.js | 26, 90, 91, 174 |
| app/processing/page.js | 34 |
| app/results/page.js | 154 |
| components/JourneyAccess.js | 6, 9, 12, 13 |
| lib/useSessionAnswers.js | 24, 80, 128, 143, 207 |
| lib/assessmentValidation.js | 5, 9, 18, 25 |
| lib/scoringEngine.js | 15, 72, 113, 114, 115, 116, 333, 334, 361, 451 |
| lib/weightTable.js | 70, 74, 79, 139 |
| lib/journeyEntry.js | 4 |
| lib/explorerReport.js | 170 |
| scripts/check-strands.mjs | 3, 6, 8, 9, 10, 11, 12 |

### File-integrity verification

Pre-existing changes: app/journey/academic/page.js and app/journey/academic/presentation.css modified; docs/curriculum-upgrade-plan.md untracked. Those earlier changes were preserved, not reverted. All 265 protected pre-existing files were compared by SHA-256 with their audit-start contents and are byte-identical. The two full measurement outputs were also compared byte-for-byte. This audit creates only docs/new-curriculum-scoring-audit.md in the repo. No source, data, config or existing document was changed; no commit made. Final Git status includes the pre-existing changes plus this report.
