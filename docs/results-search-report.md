# Results search and filters report

Branch: v2-rebuild. October 26, 2026, Asia/Manila. Confidence: high for the implemented behavior and checked layouts; exact-height and device limits are listed below. No commit, staging, dependencies, art or audio assets added.

## Task 0: inspected source data before coding

- Relevant school fields: type, school, campus, location, province, group, courseIds, sourceLevel and flags. location is nullable free text, sometimes a city/town plus province. There is no separate city field or administrative region field. The recorded geographic group is bicol or national.
- Exact type values: ["public-suc","private","community-college","national"]. No type field is missing, but national is a source-list classification, not usable ownership information. The 13 national-list source rows (SCH-039 through SCH-051) do not establish public/private ownership. The filter says “National list (ownership unspecified)”; their card links show name/place without an ownership prefix. No ownership was inferred from school names.
- Exact province values, including null: ["Albay","Sorsogon",null,"Camarines Sur","Catanduanes","Camarines Norte","Masbate","Laguna","Ilocos Norte"]. Exact geographic group values: ["bicol","national"]. These usable source fields support the location filter, so the no-location stop condition did not apply. No city normalization, geocoding, distance, user location or new region was invented.
- Location options are Bicol, National list, and the eight non-null recorded provinces: Albay, Camarines Norte, Camarines Sur, Catanduanes, Ilocos Norte, Laguna, Masbate, Sorsogon. Group and province IDs use separate prefixes. The location field's mixed free-text composites are not turned into additional inferred provinces or cities.
- All 85 master courses have at least one listed school. None currently needs the missing-school fallback. Some national source rows name several institutions together; their original school field stays intact.
- Source flags include partial and weak-source. School source limitations remain unchanged. Default card selection considers those two flags exactly as requested; school filters do not silently exclude flagged records.
- course-details has no separate short-overview field. All 85 overview values are paragraphs with more than one sentence. Every card uses the exact first sentence, verified against Intl.Segmenter in Node tests, with CSS one-line truncation. No source prose was rewritten.
- Careers are ordered arrays of objects with jobTitle, salaryRange, notes and source-review fields. Their order is retained. The card takes the first jobTitle of three whitespace-separated words or fewer; otherwise the first full title. CSS performs truncation. No title is cut in JavaScript.
- No course detail contains “welding”. It returns no results; no alias or course mapping was invented. “teacher” matches seven source-backed education courses. EDU05, BS Exercise and Sports Sciences, has no teacher word in its indexed fields and is not forced into that result.
- The removed group tag was confirmed as labels.group inside .course-category in CourseMatch. It was the group tag, not a score or course name. The group remains indexed and filterable.

Existing Course Detail tabs, unchanged names and IDs:

| ID | Exact label |
| --- | --- |
| overview | Overview |
| study | What You'll Study |
| schools | Where Can You Study |
| careers | Where Can This Path Lead |
| guidance | Guidance Tips |
| aid | Financial Aid |

Previously active was local state initialized to 0, with button and arrow/Home/End navigation. URL state did not select a tab.

## Search and pure filters

lib/courseSearch.js builds an immutable display/search index from the master/details data and existing school records/index. Search uses course name, group, career job titles and study topics. Text is lowercased, Unicode combining accents are removed, and queries split into letter/number words. Every query word must prefix a source word in at least one field. There is no fuzzy matching, stemming, school-name or overview search. A whitespace/punctuation-only query has no words and behaves as empty. Match metadata identifies name/group/career/topic and retains the exact matching career/topic text for the hint.

The nine course-group options come from courses-master. School-type options come from the four actual type values. Location options come only from the two geographic groups and eight recorded provinces. Multiple choices within one filter use OR; search and the three filter categories use AND. Type and location must match the SAME school record. Synthetic tests explicitly reject a course with a private Sorsogon school and a public Albay school for Private plus Albay. All eight filter-category combinations are tested, including with a query.

Sort changes displayed order only: Best match first, Lowest match first, A to Z. Every card retains course.rank from buildRecommendations, and arcStrength still receives the FULL original ranking. The ranking and scoring modules are untouched. Sorting never mutates the original ranking.

User clarification: choosing either non-default sort automatically shows all 85 when no search/filter is active. Best match with no query/filter retains the default top five and Show all 85 courses toggle. Clear all resets query, filters, sort and expansion to the default five. No Has a Bicol school toggle existed; none was added because Bicol is already a location option.

## Cards, controls and minimal Detail change

Cards retain the true rank, rank-one landmark, unchanged relative arc and reveal/sound behavior. The group badge is removed. Three underlined source-text links sit below the name, in three desktop columns and three narrow-screen rows. Their full text remains in accessible names and titles. The school link uses a matching source record when school filters are active. A missing school produces the neutral non-link fallback. Matched-on hints appear only during text search, use exact source text and are deliberately hidden at widths of 480px and below to avoid crowding at the requested mobile size.

DRAFT representative-school rule: prefer Bicol; within that preference avoid partial/weak-source rows when an unflagged row exists; prefer Albay; preserve data order for ties. The user specifically confirmed that an unflagged Bicol school beats flagged Albay. With active school filters, use the first source row satisfying all school conditions. Never describe the result as nearest.

Controls use the existing navy, paper and gold visual language and shared Button component. A sticky toolbar stays inside the existing bounded results scroller. Filter menus have their own bounded, themed inner scrolling. On narrow screens they are behind Filters; controls wrap, and smaller button text keeps Sort, Filters and Clear all on one control row at 375px. Search has a label and Escape clears only the search. Sort has an explicit accessible name. Filter menus close on Escape and return focus to the summary. The count is an atomic polite live region. Controls, links and comparison toggles have visible focus outlines.

Only app/results/[courseId]/FieldJournal.js changed in Course Detail: one effect reads the overview/schools/careers hash on entry and hashchange, defaulting unknown or missing hashes to Overview; the existing bookmark effect records the active tab. Info links use #overview, #schools and #careers. Explore has no hash and still opens Overview. Tab names/order, keyboard navigation, content, layout, assets and transitions were not changed. app/results/[courseId]/page.js and journal.css are unchanged from the phase baseline.

Info links are separate real anchors, not nested controls. They stop click propagation and use Next Link navigation. Navigation clears Results exploration state without changing compare selections. Query, filters and sort are NOT written to storage or URLs and do not persist after leaving Results, including Back to Results from Detail. Navigation callbacks reset the controls; a pageshow handler also clears restored full-page history state. Map/report behavior and the two-course comparison limit remain.

## DRAFT copy

All new display/accessibility copy below is DRAFT. Existing source course/group/province/school/career text is reused, not newly written. No i18n catalog was edited.

- Search courses; Course, group, career or topic
- Sort courses; Best match first; Lowest match first; A to Z
- Filters; Clear all; Course group; School type on our list; Location on our list
- Public SUC; Community college; Private; National list (ownership unspecified); Bicol; National list
- {n} course / {n} courses; , top 5 shown; filter-summary count suffix ({n})
- Your Course Matches
- No courses on our list match. Try another search or clear the filters.
- Overview; School; Career; Careers (fallback label)
- No school on our list yet
- Matched on {name|group|career|topic}: {exact source text}
- {Overview|School|Career} for {course name}: {exact source text}
- On our list: Course group: {groups}; School type: {types}; Location: {locations}, with only active portions included

## Automated validation

Eight new tests cover prefix AND search, accents/spaces, nurse, seven teacher results, empty/no-match and absent welding; all filter combinations and query conjunction; same-record school matching; exact options/unknown ownership; all 85 first sentences and source careers; default quality/location/data-order selection and null/long-title cases; immutable ranks/sorts; actual info-link rendering across queries and filters including all 85 courses, with no nested controls, percent signs or numeric score strings. Rank numbers and course counts are allowed.

```text
ℹ tests 91
ℹ suites 0
ℹ pass 90
ℹ fail 0
ℹ cancelled 0
ℹ skipped 1
ℹ todo 0
ℹ duration_ms 2182.6278
```

The one skip is the pre-existing pilot-school test. Targeted ESLint passed. All existing verifiers passed: links; details (85 courses, 463 careers, 2 career notes, 51 school rows, 297 mappings); reachability (170 PASS, 0 WARN/TIE/FAIL); routes (96 HTML/RSC pairs); simulation integrity/repeat hashes; browser replay/PDF artifact checks (12/12 from the prior QA sample). The new browser feature checks below are separate from that prior PDF sample. No PDF behavior/content was changed.

The final production build passed with two build workers, using the existing configured fonts. Offline packaging generated 96 routes, 615 resources and 51,849,171 bytes; build KD8zZIUxLK8O8WQg0tROh. Both generated manifest and worker include all 85 detail routes. Generated public/offline-manifest.json, public/sw.js and the offline-build snapshot remain Git-ignored and unstaged. No new font family or source asset was added.

## Browser checks

npm run dev was invoked and detected the existing development server at localhost:3000 (PID 26336); the second instance exited. The updated Results page was inspected on that server. Full replay then used the final production artifacts through the existing local QA storage loader, which loads normal saved v2 sessions without typing answers. Old: BUS02 witness, Grade 12 old route. New: HLT01 witness, Grade 12 new route. The development and QA browser console error logs were empty.

Each flow first captured all 85 displayed personal ranks, arcs, overview text and career text. The following cases checked every displayed course against that flow's baseline: no rank, arc, overview or job text mismatch. School link text was allowed to change to a matching record.

| Check | Old count / example true rank | New count / example true rank |
| --- | --- | --- |
| Default | 5, BUS02 #1 | 5, HLT01 #1 |
| Show all | 85 | 85 |
| nurse | 1, HLT01 #79 | 1, HLT01 #1 |
| teacher | 7, EDU02 #24 | 7, EDU01 #41 |
| BS Marine Biology | 1, SCI02 #71 | 1, SCI02 #28 |
| Computing group | 3, ICT02 #13 | 3, ICT01 #45 |
| Private type | 17 | 17 |
| Albay location | 52 | 52 |
| Private plus Albay | 3: HLT03 #21, HLT02 #54, HLT01 #79 | 3: HLT01 #1, HLT02 #3, HLT03 #5 |
| No-result query | 0 and empty state | 0 and empty state |
| Clear all | 5, empty query and filters | 5, empty query and filters |
| Lowest match first | 85, ENG03 #85 first | 85, EDU03 #85 first |
| A to Z | 85, SOC08 #64 first | 85, SOC08 #39 first |

Private plus Albay school links all named a Private record in Albay. Filtered comparison selected two Computing courses on each flow; attempting the third kept exactly two and showed the existing limit notice. Comparison retained actual ranks (old #13/#59; new #45/#50). All three info links were checked on both flows: Overview selected journal-tab-overview, School journal-tab-schools, Career journal-tab-careers. Explore selected Overview with no hash. All six info-link returns restored an empty query, no checked filters, Best match and five cards. Info navigation did not toggle compare selections.

Escape cleared a query while retaining the Computing group filter and its three cards. Tab from Search focused the SELECT with accessible name Sort courses and a solid focus outline. Mobile Filters expanded/collapsed, school-type selection worked, and Escape closed its menu and focused the summary. Full info text remained in accessible names despite ellipsis; the query hint computed display:none on mobile. The visible Results text check found no percent or numeric score strings. At the end of the long inner list, scrollTop was 24,306.4px; the toolbar was sticky and fully inside the scroller viewport, with document overflow zero. Temporary viewport overrides were reset.

The QA harness remained running during build replacement. Its server log retained two ENOENT RSC prefetch requests for HLT02 and HLT10. Their exact timing/cause was not captured; these were not console errors. The final route verifier confirmed both HTML and RSC for every expected route. Fresh-server checks then opened HLT02 (BS Pharmacy) and HLT10 (Doctor of Veterinary Medicine) successfully on Overview; console logs remained empty and that fresh server logged no missing routes. No claim of an error-free original network trace is made.

### Layout measurements, final build

All 85 cards were expanded, filter controls collapsed, on BOTH loaded routes. Values below were identical for old and new. Every measurement had document horizontal overflow=0, document vertical overflow=0, and inner horizontal overflow=0 pixels. Only the results region scrolled vertically; filter menus use their own inner scrolling when needed.

| Actual CSS viewport | Inner clientHeight | Inner scrollHeight | Toolbar height |
| --- | --- | --- | --- |
| 1600x900 | 850 | 24977 | 170.4 |
| 1280x720 | 670 | 24977 | 170.4 |
| 950x900 | 850 | 24977 | 170.4 |
| 375x814 | 780 | 35523 | 191.6 |
| 375x812 | 778 | 35523 | 191.6 |

The browser tool rounded the requested 375x813 override to an actual innerHeight of 814. Retrying produced the same result, and fractional overrides are unsupported. The adjacent 375x812 size was also tested to bracket the request. Exact 375x813 was not verified and is not claimed. On mobile the Filters and Clear all tops matched at 280px, confirming one row. With a school menu open, document overflow remained zero and the menu's client/scroll heights were 191/191px.

## NOT DETERMINED / limits

- Exact 375x813 testing is unavailable through this browser tool's height rounding; actual adjacent heights are reported above.
- The representative-school default is a DRAFT display preference, not a finding of distance, current availability, eligibility or school quality. Its unflagged-Bicol priority was explicitly confirmed.
- Ownership of national-list rows and missing location/province values remain NOT DETERMINED. No name-based ownership or geographic inference was made.
- Welding is absent from the supplied detail text. No alias, content or mapping change was made to force a match. EDU05 does not match teacher under the specified indexed-field rule.
- Physical phones, touch hardware and screen-reader sessions were not tested. Keyboard, focus, accessibility names, DOM geometry and browser interactions were checked as described.
- New copy remains DRAFT for later translation. No bilingual aliases or translation-catalog edits were added to the English source index.

## Files and scope

Changed in this phase:

- app/results/CourseMatch.js
- app/results/[courseId]/FieldJournal.js
- app/results/page.js
- app/results/results.css

Created:

- lib/courseSearch.js
- lib/courseSearch.test.js
- lib/courseSearch.render.test.js
- app/results/CourseInfo.js
- app/results/ResultsControls.js
- docs/results-search-report.md

SHA-256 comparison against the phase-start snapshot found only the four listed existing-file changes. Scoring/ranking modules, all data/v2 files, Processing, PDF/report code, i18n catalogs, package files and Course Detail content files are unchanged. Existing changes from earlier prompts are preserved. Nothing was staged, committed or deployed.

Git status (includes pre-existing work):

```text
 M app/about/About.js
 M app/about/page.js
 M app/how-it-works/HowItWorks.js
 M app/how-it-works/page.js
 M app/intake/basecamp.css
 M app/intake/page.js
 M app/journey/academic/page.js
 M app/journey/academic/presentation.css
 M app/journey/interests/page.js
 M app/journey/page.js
 M app/journey/skills/ForestVine.js
 M app/journey/skills/StatementIcon.js
 M app/journey/skills/page.js
 M app/layout.js
 M app/page.js
 M app/processing/page.js
 M app/report/page.js
 M app/results/CourseMatch.js
 M app/results/[courseId]/FieldJournal.js
 M app/results/[courseId]/journal.css
 M app/results/[courseId]/page.js
 M app/results/page.js
 M app/results/results.css
 M components/AtlasTutorial.js
 M components/JourneyAccess.js
 M lib/assessmentValidation.js
 M lib/assessmentValidation.test.js
 M lib/browserStorage.js
 M lib/explorerReport.js
 M lib/journeyEntry.js
 M lib/useSessionAnswers.js
 M package.json
?? app/results/CourseInfo.js
?? app/results/ResultsControls.js
?? data/v2/
?? docs/assessment-screens-report.md
?? docs/chapter4-results-draft.md
?? docs/copy-inventory.md
?? docs/course-detail-copy-report.md
?? docs/data-conversion-report.md
?? docs/details-schools-report.md
?? docs/icon-inventory.md
?? docs/interest-stems-review.md
?? docs/qa/
?? docs/reachability-report.md
?? docs/results-pdf-report.md
?? docs/results-search-report.md
?? docs/revision-25b-report.md
?? docs/rubric-revision-report.md
?? docs/scoring-v2-report.md
?? docs/session-flow-report.md
?? docs/simulation-qa-report.md
?? lib/courseDataV2.js
?? lib/courseDetailModel.js
?? lib/courseDetailModel.test.js
?? lib/courseSearch.js
?? lib/courseSearch.render.test.js
?? lib/courseSearch.test.js
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
?? scripts/qa-replay-server.mjs
?? scripts/qa/
?? scripts/replay-witnesses.mjs
?? scripts/scan-data-sanity.mjs
?? scripts/simulate-profiles.mjs
?? scripts/simulate-recoverability.mjs
?? scripts/verify-browser-replay.mjs
?? scripts/verify-details.mjs
?? scripts/verify-links.mjs
?? scripts/verify-reachability.mjs
?? scripts/verify-routes.mjs
?? scripts/verify-simulation.mjs
?? scripts/write-simulation-reports.mjs
!! public/offline-manifest.json
!! public/sw.js
```
