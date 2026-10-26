# Results and PDF cutover report

Phase 3c, Prompt 25. Branch v2-rebuild. No commit. No new dependencies, fonts, art or audio assets. The pre-existing dirty workspace is preserved.

## Changes by task

Task 0: the Valley cluster question is exactly "Which group of electives do you like most?" Only that string changed in Valley. Strand, subjects, electives, best subjects, GWA and certificates questions are unchanged. There was no existing cluster-copy-specific test to change; the exact wording was checked in the browser.

Task 1: lib/recommendations.js exports buildRecommendations(session), validating through fromSession then using the unchanged rankCourses engine. It returns ok, all 85 ranked courses with id/name/group/rank/total/breakdown, and errors. Scores remain internal. lib/courseDataV2.js centralizes master/details/careers/careerNotes/schools/salary sources; schools retain schools-by-course order and flags. lib/explainMatch.js returns exact matched source texts and skill ratings, with old/new academic evidence kept separate. GAS has no strand match. Evidence displayed in the PDF is up to three distinct exact texts, shortest first, restricted to 110 characters each; no text is truncated or paraphrased. Internal skill ratings are not printed as scores or evidence numbers.

Task 2: Processing readiness uses buildRecommendations. Existing compass oscillation, lock and transition timing, four section-status stages and sounds are unchanged. Invalid sessions retain sequential JourneyAccess guards with a route back to the map; an additional themed invalid-recommendation message is supplied inside Processing. The academic status icon now uses the existing v2 icon API.

Task 3: Results uses the same recommendations function. It starts with five cards, keeps the rank-one landmark and scroll-in reveal, and expands to all 85 without grouping, search or filters. Master-list group names replace category names. No strongestCategory calculation or legacy scoring remains in these pages. The old-route GAS note explains that its evidence comes from interests, skills, subjects and certificates. Explore links use /results/{v2 course ID} and intentionally await Prompt 26 destinations.

Task 4: comparison retains the existing two-course selection helper and rejects a third selection. It looks up v2 overviews, careers with unchanged original salary strings and notes, careerNotes and ordered schools with campus/location and flag notes. Stale old course IDs are filtered out of the active comparison, so they cannot consume a v2 selection slot. Source records and old helper tests are retained. The popup uses the existing blurred backdrop and boxless close; only its bounded inner card scrolls.

Task 5: Results and Report both call buildExplorerReport(session), which calls buildRecommendations. The PDF model contains top-five names/groups/ranks/evidence and exploration profile, without total or breakdown fields. English-only PDF order is cover, top five, profile, rank-one details, then guidance disclaimer. The cover uses existing branding text, optional nickname and date. Profile includes grade, exact curriculum label, active strand/subjects or electives/cluster/best subjects, actual GWA and certificates. Empty elective/cluster values print Not sure yet; empty certificates print None yet. Details include overview, study topics, interests/strengths, careers, careerNotes when present, ordered schools/campuses and short flag notes, CHED basis, guidance tips, shared salary methodology/source links and October 2026 update. School completeness/confirmation note is included. Wrapping, pagination and page numbers are retained. The profile starts on its own page to avoid splitting the heading and first fields across pages. Download celebration, blurred backdrop, re-download and Print controls remain.

The user explicitly chose "Use PHP in PDF only" after the font limitation was raised. PDF-only ₱ becomes PHP plus a space; all salary digits, commas, range separators and /month remain unchanged. Compare still displays the original ₱ strings. No font asset was added. Typographic quotation marks and em dashes in prose are normalized for the existing font; original salary en dashes remain. GWA prints the stored number without rounding. The numeric session schema does not retain cosmetic typed trailing zeros (94.90 becomes 94.9); this does not change the value.

## DRAFT arc rule

Use the full ranking's first and fifth totals as fixed anchors s1 and s5. For every course:

```text
strength = clamp(30 + 65 * (total - s5) / (s1 - s5), 15, 95)
if s1 == s5: strength = 95 for everyone
```

This entire visual rule is DRAFT. Expanding the list never changes these anchors. Numbers exist only in internal calculations and the aria-hidden SVG stroke. There are no student-facing score labels, percentages, score tooltips or numeric-score ARIA labels. Rank numbers, grade level, GWA, dates, CHED reference numbers and salary amounts remain their required non-score meanings. Arc accessibility text is "Relative match strength".

## Tests and verifiers

```text
npm test
tests 78
pass 77
fail 0
skipped 1
```

The one skipped test is the historical pilot-school routing test explicitly retained in Prompt 24. All old tests still pass. Eight new tests cover old/new real-witness ranking equality, exact evidence, invalid-session errors, fixed/clamped arc anchors including equal anchors, rendered result labels without percentages or numeric scores, compare data for SCI02/BUS02/HLT01/ICT01/ART01, SCI02 careerNotes, BUS02 single-school coverage, and both English report models/PDF creation with the approved currency substitution.

Targeted ESLint passed. git diff --check passed. npm run dev was invoked; the workspace already had its dev server at localhost:3000, PID 142932, so the second invocation exited and checks used the existing server. No browser console errors were captured. Existing Node MODULE_TYPELESS_PACKAGE_JSON and the dev-server warning about a parent package-lock remain unrelated; package files were not changed.

All three verifiers pass:

- links: 85 master IDs, all referenced IDs valid, 425 elective links, all Appendix changes verified.
- details: 85 detail/index IDs, 463 ranges/careers and 2 careerNotes, 51 school rows, 297 valid links; minimum 1 and maximum 18 schools per course.
- reachability: PASS 170, WARN 0, TIE 0, FAIL 0; 170/170 real-engine witnesses re-scored.

## Browser checks

New route used the existing completed shared Mountains/Forest answers and a valid new Valley profile, then ran Processing into top-five Results, expansion to 85, two-course compare and PDF download. The first run selected three certificates and ranked Materials Engineering first. The final PDF run used Coding/robotics/ICT only, the same three cross-group electives and three best subjects, Not sure yet cluster and GWA 60; it ranked Computer Engineering first. This final profile was measured again. Old route retained the shared answers, selected GAS, Computer/ICT, GWA 94.99 and None yet, completed Valley, ran Processing and downloaded its PDF with Electronics Engineering first. No session was injected through browser script.

Both flows exercised compare with SCI02 and BUS02; the source career note and the one-school case were visible. A third course selection was rejected. Fixed arcs were compared directly before/after expansion and stayed identical. Rendered current Results text and tooltip/ARIA strings were checked for percentages and numeric scores. Download and Download Again returned real browser PDF files and the Report confirmation page. Actual printing through the operating system was not performed.

Results measurements below are inner clientHeight/scrollHeight. The order in each line is 1600x900, 1280x720, 950x900, 375x813 (actual CSS viewport dimensions). Every measurement had document vertical overflow 0 and horizontal overflow 0. Only the themed recommendations region scrolled.

- New route, top 5: 850/2055, 670/2055, 850/2048, 779/2648.
- New route, all 85: 850/21735, 670/21735, 850/21728, 779/30590.
- Old GAS route, top 5: 850/2088, 670/2088, 850/2081, 779/2723.
- Old GAS route, all 85: 850/21768, 670/21768, 850/21761, 779/30665.

At 375x813 the open compare card measured clientHeight 753, scrollHeight 2475, top 24 and bottom 789, with zero document overflow. Controls remained within the viewport. Browser viewport overrides were reset after checks.

## PDF verification

The final downloaded old/new PDFs both have six pages. pdfplumber extraction confirmed section order, actual GWA values 94.99 and 60, matching curriculum labels, October 2026 source text, PHP salary rendering, no percentages and no numeric-score patterns. Every page has the correct page number. Text bounding boxes remain within page margins. All twelve pages were rendered to PNG, reviewed as a contact sheet, and selected full pages inspected. No clipped text, overlap or broken currency glyph was found. The profile is on page 3 in both final PDFs. Earlier pre-pagination test downloads are superseded.

Final verification copies and rendered images are in the external task artifact directory, not added to the repository:

- C:\Users\Charlene\.codex\visualizations\2026\10\25\01a173d3-51c9-7fc0-9c04-9a733c9fc398\old-route-report.pdf
- C:\Users\Charlene\.codex\visualizations\2026\10\25\01a173d3-51c9-7fc0-9c04-9a733c9fc398\new-route-report.pdf

### Old route: first 40 extracted lines

```text
CAREER COMPASS
Explorer Report
Prepared for Atlas tour test
October 26, 2026
Keep this report as a separate copy. Your answers are saved in this browser on this device.
Career Compass | Page 1 of 6
Your Top Course Matches
1. BS Electronics Engineering
Engineering and Technology
- Computer / ICT
- A useful gadget or machine
- Videos about apps and how to code
2. BS Computer Engineering
Engineering and Technology
- Computer / ICT
- A useful gadget or machine
- Make a simple app or online form
3. BS Computer Science
Computing
- Computer / ICT
- Make a simple app or online form
- Videos about apps and how to code
4. BS Information Systems
Computing
- Computer / ICT
- Make a simple app or online form
- Make an app or spreadsheet to keep track of information
5. BS Information Technology
Computing
- Computer / ICT
- Make a simple app or online form
- Videos about apps and how to code
Career Compass | Page 2 of 6
Your Exploration Profile
Grade level: Grade 12
Curriculum: Old curriculum - strand
Strand: Academic GAS
Subjects: Computer / ICT
GWA: 94.99
Certificates: None yet
```

### New route: first 40 extracted lines

```text
CAREER COMPASS
Explorer Report
Prepared for Atlas tour test
October 26, 2026
Keep this report as a separate copy. Your answers are saved in this browser on this device.
Career Compass | Page 1 of 6
Your Top Course Matches
1. BS Computer Engineering
Engineering and Technology
- General Mathematics
- A useful gadget or machine
- Make a simple app or online form
2. BS Information Systems
Computing
- General Mathematics
- Make a simple app or online form
- Coding, robotics, and ICT contests
3. BS Computer Science
Computing
- General Mathematics
- Make a simple app or online form
- Videos about apps and how to code
4. BS Electronics Engineering
Engineering and Technology
- General Mathematics
- A useful gadget or machine
- Videos about apps and how to code
5. BS Information Technology
Computing
- General Mathematics
- Make a simple app or online form
- Videos about apps and how to code
Career Compass | Page 2 of 6
Your Exploration Profile
Grade level: Grade 12
Curriculum: New curriculum - electives
Electives: Arts 1 (Visual, Literary, Media, Applied, Traditional Art); Marine Transportation (Support Level);
General Science 3, 4
Cluster: Not sure yet
Best subjects: General Mathematics; Arts 1 (Visual, Literary, Media, Applied, Traditional Art); Marine
```

## DRAFT copy

All new UI/report copy and the arc rule are DRAFT:

- "Which group of electives do you like most?" (exact rubric question).
- "Check your journey"; "Complete your saved assessment answers before opening your matches."; "Back to Journey Map".
- "Show all 85 courses"; "Show top 5 only"; "The compass arcs show relative match strength."; "Relative match strength".
- "GAS has no linked courses. Your matches come from your interests, skills, subjects and certificates."
- Compare headings "Overview", "Careers", "Schools", and "School lists are not complete. Confirm programs with the school."
- Flag notes: "Partial program list"; "Limited source reliability"; "Information may be outdated"; "Confirm program availability"; "Location inferred from the town name"; "New program; confirm availability"; "Major or specialization listed".
- PDF headings: "Explorer Report", "Your Top Course Matches", "Your Exploration Profile", "Your Top Course in Detail", "Overview", "What You'll Study", "Interests and Strengths", "Careers", "Career Notes", "Schools", "School List Note", "CHED Basis", "Guidance Tips", "Salary Sources", "Guidance Disclaimer".
- PDF profile labels: "Grade level", "Curriculum", "Strand", "Subjects", "Electives", "Cluster", "Best subjects", "GWA", "Certificates"; exact old/new curriculum labels; "None yet" and "Not sure yet".
- "Prepared for {nickname}"; "Keep this report as a separate copy. Your answers are saved in this browser on this device."; "Career Compass | Page x of y".
- "School lists are not complete. Confirm programs, campus availability and admission requirements with the school."
- "Salary estimates: Jobstreet Philippines career salary benchmarks. Updated October 2026."
- "This is a guidance tool, not a final decision - talk to your guidance counselor about what's right for you."

Source names, groups, source details, matched-evidence item texts, career notes, CHED references and source URLs are data, retained without paraphrase. Existing Processing status messages, landmark label, close/compare controls, download celebration and confirmation copy are unchanged.

## Remaining legacy references (file:line)

These are retained, not deleted. This source scan includes test references and the old PDF utility; documentation and generated artifacts are excluded.

```text
tmp/pdfs/verify.mjs:5:const courses=JSON.parse(readFileSync('data/explore-courses.json','utf8'));
scripts\check-strands.mjs:3:import { STRAND_WEIGHTS } from "../lib/weightTable.js";
scripts\check-strands.mjs:4:const items = JSON.parse(readFileSync(new URL("../data/items.json", import.meta.url), "utf8"));
lib\assessmentValidation.test.js:2:import items from "../data/items.json" with { type: "json" };
lib\assessmentValidation.js:1:import items from "../data/items.json" with { type: "json" };
scripts\verify-details.mjs:17:    readFile(new URL("../data/items.json", import.meta.url), "utf8").then(JSON.parse),
app\results\[courseId]\page.js:6:import courses from "@/data/explore-courses.json";
app\results\[courseId]\page.js:7:import courseCategories from "@/data/courses.json";
lib\reportEvidence.js:1:import items from "../data/items.json";
lib\reportEvidence.js:2:import { INTERESTS_WEIGHTS, SKILLS_WEIGHTS } from "./weightTable";
lib\scoringEngine.integration.test.js:3: * Run with: node lib/scoringEngine.integration.test.js
lib\scoringEngine.integration.test.js:14:} from "./scoringEngine.js";
lib\scoringEngine.integration.test.js:17:  readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"),
lib\i18n\translate.test.js:5:const items=JSON.parse(readFileSync(new URL('../../data/items.json',import.meta.url)));
lib\i18n\translate.test.js:6:const courses=JSON.parse(readFileSync(new URL('../../data/explore-courses.json',import.meta.url)));
lib\scoringEngine.js:17:} from "./weightTable.js";
lib\scoringEngine.js:21:// Derived directly from weightTable.js so a future item-bank change (e.g.
lib\scoringEngine.secondarySignals.test.js:3: * Run with: node lib/scoringEngine.secondarySignals.test.js
lib\scoringEngine.secondarySignals.test.js:13:} from "./scoringEngine.js";
lib\scoringEngine.secondarySignals.test.js:16:  readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"),
lib\scoringEngine.skillBoundary.test.js:3: * Run with: node lib/scoringEngine.skillBoundary.test.js
lib\scoringEngine.skillBoundary.test.js:14:} from "./scoringEngine.js";
lib\scoringEngine.skillBoundary.test.js:17:  readFileSync(new URL("../data/courses.json", import.meta.url), "utf8"),
lib\scoringEngine.test.js:5: *   node lib/scoringEngine.test.js
lib\scoringEngine.test.js:19:} from "./scoringEngine.js";
lib\scoringEngine.test.js:20:import { SKILLS_WEIGHTS } from "./weightTable.js";
```

Course Detail is explicitly deferred. assessmentValidation.js retains old field helper definitions, while active section validation uses v2. reportEvidence.js is a retained legacy utility with no active cutover-page import. check-strands.mjs is a retained old-data utility. verify-details.mjs intentionally reads the old item bank to check the seven fallback stems and the approved INT-08 override. tmp/pdfs/verify.mjs uses the old report model and old course data, so it is now an obsolete verification utility; it was not used for v2 PDF checks. Old-engine test imports remain intentionally in the test suite. Static legacy JSON files, weightTable and scoringEngine are unchanged.

## Known temporary breaks and NOT DETERMINED

Explore links use v2 IDs but app/results/[courseId] still uses the old 24-course dataset/static route list. Those destinations can be unavailable until Prompt 26. Landing/general copy and Course Detail are unchanged. i18n catalogs are unchanged; new groups/source items/copy have no new Filipino translations. PDF generation is deliberately English only, including its labels, disclaimer and methodology; Filipino PDF layout, font coverage and translations are deferred.

Physical touch hardware, screen-reader output and operating-system printing remain NOT DETERMINED. No scoring or ranking ambiguity remains. The PHP-only PDF currency choice is explicitly resolved by the user. Numeric GWA is retained without rounding, but the earlier number-based session schema cannot preserve cosmetic typed trailing zeros.

## Files changed in this phase

- app/journey/academic/page.js
- app/processing/page.js
- app/report/page.js
- app/results/CourseMatch.js
- app/results/page.js
- app/results/results.css
- lib/explorerReport.js

Created:

- lib/courseDataV2.js
- lib/explainMatch.js
- lib/recommendations.js
- lib/recommendations.test.js
- docs/results-pdf-report.md

## Git status

```text
 M app/intake/basecamp.css
 M app/intake/page.js
 M app/journey/academic/page.js
 M app/journey/academic/presentation.css
 M app/journey/interests/page.js
 M app/journey/page.js
 M app/journey/skills/ForestVine.js
 M app/journey/skills/StatementIcon.js
 M app/journey/skills/page.js
 M app/processing/page.js
 M app/report/page.js
 M app/results/CourseMatch.js
 M app/results/page.js
 M app/results/results.css
 M components/JourneyAccess.js
 M lib/assessmentValidation.js
 M lib/assessmentValidation.test.js
 M lib/browserStorage.js
 M lib/explorerReport.js
 M lib/journeyEntry.js
 M lib/useSessionAnswers.js
 M package.json
?? data/v2/
?? docs/assessment-screens-report.md
?? docs/data-conversion-report.md
?? docs/details-schools-report.md
?? docs/icon-inventory.md
?? docs/interest-stems-review.md
?? docs/reachability-report.md
?? docs/results-pdf-report.md
?? docs/scoring-v2-report.md
?? docs/session-flow-report.md
?? lib/courseDataV2.js
?? lib/explainMatch.js
?? lib/fixtures/
?? lib/itemIconsV2.js
?? lib/itemsV2.js
?? lib/recommendations.js
?? lib/recommendations.test.js
?? lib/routeResolution.js
?? lib/scoringV2/
?? lib/sessionFlow.test.js
?? lib/sessionSchema.js
?? lib/valleySelection.js
?? lib/valleySelection.test.js
?? scripts/verify-details.mjs
?? scripts/verify-links.mjs
?? scripts/verify-reachability.mjs
```

Branch v2-rebuild. Nothing staged or committed. Status includes earlier phases.
