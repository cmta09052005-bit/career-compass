# Revision 25b implementation report

Date: October 26, 2026, Asia/Manila. Branch v2-rebuild. No commit, dependencies, art, fonts or audio assets added. This report and rubric-revision-report.md supersede earlier phase descriptions of the retired scoring rules; earlier reports remain historical records.

## Tasks 1 to 4: changes

1. SKL-04 now reads exactly "I can keep track of money, records, budgets, files, books, and schedules carefully." Its ID, links and ratings are unchanged. No tests or verifier depended on the removed prefix. The sentence was checked on Forest statement 4 in the browser.

2. Removed the cluster bank and scoring field, cluster points, cluster completion flag and elective-card best-subject branch. The new route accepts only electives and bestSubjects, with bestSubjects restricted to COR-01 through COR-04. The internal field name remains bestSubjects; UI, evidence and PDF call them core subjects. Each elective's former cluster metadata is now a group label used only for display. Hashing automatically uses the smaller validated active route object. Ranking order and SHA-256 implementation are unchanged.

New academic = 4 per linked elective + 3 if the course's single core subject is selected + GWA once if either kind matches. Max academic 21, total 43. Old formula and maxima 16/38 are unchanged. The course mappings in links.json are byte-identical to the phase baseline.

Session normalization silently removes saved cluster and its flag and filters bestSubjects to actual core IDs. If no core remains, its confirmation is false and a completed active new Valley reopens as In Progress. Other shared answers, valid core answers, electives, identity and unrelated state remain. The v2 storage record is cleaned in place; no schema bump discards valid v2 progress. v1 migration still restarts scoring cleanly. A saved cluster step marker is removed. Added a pre-25b v2 fixture built from the earlier real witness shape, plus normalization/storage tests. Raw engine input with the retired field or elective best-subject IDs is rejected; saved sessions are normalized before the engine adapter is used.

3. Both Valley routes now have four steps. Old: Strand, Subjects, GWA, Certificates. New: Electives, Core subjects, GWA, Certificates. The new elective question and exclusive empty choice use the exact approved text. Core step renders only four source cards, choose 1 to 3. Existing grouped elective rows, selection trays, remove controls, fourth-pick rejection, deselect, keyboard activation, harvest/shake effects, sounds, exit modal and bounded inner scroll remain. Reload and Back restoration still use the existing named step storage. The briefing derives four steps and the map's Valley detail is "4 steps".

4. Removed cluster evidence and the PDF profile line. Core evidence uses only the course's linked core ID. Compare and PDF share schoolLabel/schoolNotes helpers: partial, weak-source, outdated, unverified and new-program may display; derived-location displays only for community-college rows; major-only never displays. Exact repeated campus/location/province segments are omitted without fuzzy location inference. Source school records, flags and order are unchanged. Repeated "Polangui - Polangui" is gone. Original salary strings still appear in compare; the previously approved PHP substitution remains PDF-only.

## Task 5: tests and reachability

```text
npm test
tests 80
pass 79
fail 0
skipped 1
```

The skipped case is the historical unused pilot-school test retained by earlier instruction. Revised tests prove all 85 old-course maxima 38 and all 85 new-course maxima 43 with academic maxima 16/21; all GWA boundaries; independent elective/core awards and once-only GWA; rejected elective best-subject values and cluster field; no cluster award; deterministic ranking and pure-JS hashing in browser-like and worker contexts; revised session flags; two witness-to-session journeys; report labels/models; and school-note/deduplication rules. New saved-v2 tests verify that core selections survive and an all-elective old best-subject array becomes unanswered. Existing old-engine/storage/translation tests still pass.

Targeted ESLint passed with no findings. git diff --check passed. All three verifiers passed:

- links: 85 course IDs, 4 core choices, all 70 scored elective rows and 425 links, unchanged Appendix mappings.
- details: 85 course details/index IDs, 463 salaries/careers, 2 careerNotes, 51 school rows and 297 valid school/course links; schools per course min 1, max 18.
- reachability: 170 PASS, 0 WARN, 0 TIE, 0 FAIL, all 170 real-engine re-scored. Each new witness has 1 to 3 target-linked electives, the target's core subject and GWA 100, without cluster. No mapping edits were made.

The seeded search varies elective count as well as selections. Extended search remains available for any non-PASS initial result; FAIL still means not found after extended search, never proven impossible. Witnesses demonstrate feasible strict leads, not optimality or observed recommendation frequency. The old Section 7 lead table was not carried over.

- old: 85 PASS, strict lead 3 to 19, maximum 1 candidate attempts; 0 extended-search cases.
- new: 85 PASS, strict lead 3 to 21, maximum 3 candidate attempts; 0 extended-search cases.

The links verifier's historical note about missing stems refers to the supplied source rubric. The approved screen fallback stems and INT-08 override remain unchanged by this revision.

## Task 6: rubric checklist

See rubric-revision-report.md for exact changes to the core rules, formula/awards, maxima and academic share, special cases, seed wording, flow, Forest statement 4, Section 5.5 A/B/C, Sections 6/7/9/10 and Appendix B/C. The source PDF was read and its hash checked; it was not edited.

Section 9 exact new = 3,634,079,904,000,000,000,000,000 = 3.634079904e24. Total across Grades 11 and 12 = 7,320,732,048,000,000,000,000,000 = 7.320732048e24. These match the requested approximate 3.63e24 and 7.32e24. The checklist supplies all six exact rows and the original counting factors, including that 14 now means core response sets, not group/cluster responses.

## Task 7: browser checks

The first sandboxed development server could not expose its local socket to the browser, causing initial connection timeouts. It was stopped and restarted with approved access using npm run dev. Browser checks then used localhost:3000 successfully. Existing parent package-lock and Node module-type warnings are unrelated; no package settings were changed. No browser console errors were captured on the successful check tab.

The existing saved new session normalized on entry: its valid General Mathematics selection remained and obsolete elective best-subject selections were absent. The new step showed exactly four core cards. The browser exercised keyboard Enter selection, the three-core limit, reload restoration, and the exclusive empty elective choice. Shared completed Mountains/Forest answers were preserved; the corrected Forest statement 4 was inspected without changing its saved rating.

New route completed with Not sure yet / None electives, General Mathematics, General Science and Effective Communication / Mabisang Komunikasyon, GWA 94.99, and three certificates. It completed Valley, ran Processing into Results and downloaded the PDF. Rank one was BS Information Technology. Old route then selected GAS, Computer / ICT, GWA 94.99 and None yet, completed Valley, ran Processing into Results and downloaded the PDF. Rank one was BS Electronics Engineering. The old subject tray was measured with three selections, then two were removed before completion. No browser state was injected by script.

Compare was checked with SCI02 and BUS02. Its national/private school row no longer shows derived-location, the school town no longer repeats, and major-only is absent. The positive community-college derived-location case is covered by the shared helper unit test, rather than a claim that these two browser courses exercised it.

### Valley measurements

Each line lists inner clientHeight/scrollHeight in this actual CSS viewport order: 1600x900, 1280x720, 950x900, 375x813. All 32 measurements had document vertical overflow 0, horizontal overflow 0 and an unclipped footer. Only bounded inner regions scroll. Elective, subject, core and certificate trays were measured with the selected states described above; the core measurement includes the fourth-pick limit notice.

- New electives: 504/3503, 326/3336, 509/3551, 382/7620.
- New core subjects: 522/522, 344/344, 525/525, 365/452.
- New GWA: 613/613, 435/435, 615/615, 512/512.
- New certificates: 500/691, 322/691, 502/742, 382/1536.
- Old strand: 613/613, 435/435, 615/615, 538/967.
- Old subjects: 542/565, 364/547, 544/598, 382/1816.
- Old GWA: 613/613, 435/435, 615/615, 512/512.
- Old certificates: 578/691, 400/691, 580/742, 477/1548.

Browser viewport overrides were reset after testing. The final page confirms that the Explorer Report downloaded.

### PDF checks

Both downloaded PDFs have six pages. pdfplumber extraction confirms no Cluster line, no Best subjects label, no percentages or numeric scores, the correct profile and GWA, and ordered sections. The new PDF has Core subjects and the exact Not sure yet / None elective label. The old PDF correctly retains Subjects for its 19-choice old bank; it is not relabeled Core subjects. Both omit major-only and repeated Polangui location text. Page numbers and text bounds pass. All twelve pages were rendered and visually inspected as a contact sheet, with no clipped text or overlaps.

New profile excerpt:

```text
Your Exploration Profile
Grade level: Grade 12
Curriculum: New curriculum - electives
Electives: Not sure yet / None
Core subjects: General Mathematics; General Science; Effective Communication / Mabisang
Komunikasyon
GWA: 94.99
Certificates: Coding, robotics, and ICT contests; Trade skills (welding, electrical, automotive, drafting);
Math, science, research, and invention contests (quiz bee, olympiad, science fair)
Career Compass | Page 3 of 6
```

Old school excerpt:

```text
Schools
Bicol University - Polangui - Albay. Confirm program availability.
Camarines Sur Polytechnic Colleges (CSPC) / Polytechnic State University of Bicol (PSUB) - Nabua,
Camarines Sur. Partial program list.
Catanduanes State University (CatSU) - Virac, Catanduanes
Ateneo de Naga University - Naga City - Camarines Sur. Partial program list.
School List Note
School lists are not complete. Confirm programs, campus availability and admission requirements with
the school.
```

Verified PDFs and rendered QA images are saved in the external task artifact directory, not added as product assets:

C:\Users\Charlene\.codex\visualizations\2026\10\25\01a173d3-51c9-7fc0-9c04-9a733c9fc398\revision25b-old.pdf

C:\Users\Charlene\.codex\visualizations\2026\10\25\01a173d3-51c9-7fc0-9c04-9a733c9fc398\revision25b-new.pdf

## DRAFT copy and translation follow-up

New or revised copy is DRAFT:

- "I can keep track of money, records, budgets, files, books, and schedules carefully."
- "Which electives do you take and feel strongest in?"
- "Which subjects are you strongest in?" (reused core question).
- "Not sure yet / None" and "Choose 1 to 3, or Not sure yet / None."
- "Core subjects" in the PDF and core step.
- Map "4 steps" and the existing briefing now rendering "4 steps. Add your subjects, general average, and certificates."

Certificates retain None yet. All four core card names, elective labels and group names are exact existing data. School-note wording is retained from Prompt 25; this revision changes visibility and duplicate location formatting only. No i18n catalog was edited.

The Filipino catalog contains neither the old full prefixed SKL-04 sentence nor the revised full sentence. The future translation key is exactly "I can keep track of money, records, budgets, files, books, and schedules carefully." Its Filipino value is NOT DETERMINED here. The existing legacy key "Managing money and budgets" translates to "Pamamahala ng pera at badyet" but is a separate old report summary, not the full v2 statement.

## NOT DETERMINED and deferred scope

There is no unresolved scoring or combination-count ambiguity. Physical touch hardware, independent screen-reader behavior and operating-system printing were not verified. Native keyboard interaction, small viewports, PDF generation/extraction and console logs were checked. English-only PDF and the previously approved PHP currency substitution remain as in Prompt 25.

Course Detail, landing and i18n catalogs remain unchanged and deferred to Prompt 26/later. Explore links still use v2 IDs while the old Course Detail destinations await that phase. Earlier reports contain superseded cluster/74-choice descriptions as historical records; current engine types and these revision reports describe the active rules. No source PDF or course mapping was changed.

## Files changed in this phase

- data/v2/items.json
- data/v2/witnesses.json
- docs/reachability-report.md
- lib/courseDataV2.js
- lib/explainMatch.js
- lib/itemsV2.js
- lib/recommendations.test.js
- lib/scoringV2/engine.test.js
- lib/scoringV2/fromSession.js
- lib/scoringV2/score.js
- lib/scoringV2/types.md
- lib/scoringV2/validate.js
- lib/sessionFlow.test.js
- lib/sessionSchema.js
- lib/valleySelection.js
- lib/valleySelection.test.js
- scripts/verify-links.mjs
- scripts/verify-reachability.mjs
- app/journey/academic/page.js
- app/journey/page.js
- app/results/page.js
- lib/assessmentValidation.js
- lib/browserStorage.js
- lib/explorerReport.js
- lib/useSessionAnswers.js

Created:

- docs/rubric-revision-report.md
- lib/fixtures/session-v2-pre-25b.json
- docs/revision-25b-report.md

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
?? docs/revision-25b-report.md
?? docs/rubric-revision-report.md
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

Nothing staged or committed. Status includes earlier phases.
