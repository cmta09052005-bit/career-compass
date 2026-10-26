# Filipino translation completion report

Branch: v2-rebuild. Prompts 29 and 29b. All new Filipino wording is a MACHINE DRAFT requiring owner review. No commit, staging, dependencies, fonts, art or audio assets were added.

## Coverage and method

- T1: 759 distinct UI and assessment strings, 0 missing.
- T2: 312 distinct course-prose and note strings, 0 missing.
- T3: 1,477 distinct terms intentionally preserved in English, 0 missing by policy.
- New catalogs: 344 entries in lib/i18n/fil-v2.js and 310 entries in lib/i18n/fil-v2-content.js. Counts include borrowed terms intentionally retained and the first-sentence overview previews; they are not counts of independently human-approved translations.
- scripts/i18n-missing.mjs scans app/, components/, the UI-producing lib modules, actual v2 item labels, course groups, elective-group headings, details, school flag notes and salary-source prose. It excludes technical selectors, paths, events, scoring internals and unused source-audit metadata. Runtime templates have numbered placeholders; populated counts, hints, summaries and ARIA strings have separate tests and browser checks.
- The coverage command exits nonzero for a missing T1 entry. Zero gaps means coverage of this enumerated source inventory, not proof of linguistic accuracy or every possible future dynamic input.
- docs/i18n-missing.json contains every entry, tier, source location and coverage status. The original legacy source-inventory.json and four old catalog files were retained.

## What changed

The v2 catalogs cover interest stems/options, skills, certificate categories, old subjects and strands, shared labels, both curriculum routes, Basecamp, the map and assessment screens, Processing, Results/search/filter/compare, Course Detail, school qualifications, PDF labels/errors and current offline UI copy. T2 covers all overviews and previews, interests/strengths, guidance, career conditions, careerNotes, salary methodology and update wording.

Localized translates nested native text and text attributes at the React render boundary. Values, IDs, scoring answers and handlers pass through. Explicit translate="no" content stays unchanged. Unknown strings silently fall back as whole English strings; substring substitution was removed so names cannot be partially translated. Dynamic catalog templates preserve placeholders and explicit patterns protect personal names.

PDF generation accepts a language argument, with English retained as the default for existing callers. Results and Report pass the selected language. Profile labels, selected old-subject/certificate labels, evidence, headings, prose, school notes, salary-source notes, disclaimer and page footers render in Filipino. Official elective/core labels remain unchanged. The previously approved PDF-only PHP substitution for the peso sign remains in place.

Course names, school names, job titles, study topics, official DepEd elective/core-subject names, CHED references, URLs and peso amounts stay as supplied. Common borrowed terms such as GWA, elective, strand, curriculum, Grade 11/12, STEM, ABM, HUMSS, GAS, TVL, PDF and CHED are retained. Recorded place names, including Bicol and Albay, stay unchanged. Dates saved in the session are factual values and remain as stored.

## Prompt 28 copy audit

All current source strings are inventoried and covered: search label and placeholder; course-group, school-type and location filter labels/options; sort label and all three sort options; Clear all; singular/plural result counts; polite atomic ARIA live status and the top-five suffix; active filter summary and tooltip; empty-state copy; matched-on hints; Overview/School/Career info labels; missing-school fallback; compare labels; close buttons; recommendation-region label; arc and info-link accessible labels.

The actual location options are Bicol, National list, Albay, Camarines Norte, Camarines Sur, Catanduanes, Ilocos Norte, Laguna, Masbate and Sorsogon. There are no "Near Bicol" or "Near Albay" strings in this implementation. No proximity claim or distance feature was added. Proper place names remain unchanged; National list is translated.

The resumed audit fixed the active filter summary parser: comma-containing group names now match complete source labels before translation. It also verified the nested search placeholder, select options and filter-menu accessible group labels. A dedicated Node test checks the source inventory, singular/plural counts, source-derived options and populated summary/hint/rank strings.

Search continues to index the English course name, English group, job titles and study topics. Filipino mode changes displayed copy only. Filipino keyword search was not built. This is listed under NOT DETERMINED for the owner's decision.

## Review files and uncertainty

docs/i18n-review.md has every T1 entry grouped by screen/source, followed by a separate T2 section. Each entry has English, Filipino, status and source locations. New catalog wording and newly written grammar are machine drafts. Exact runtime placeholders are shown as templates in the review.

There are 5 explicitly uncertain T1 entries and 5 explicitly uncertain T2 entries, with 0 T3 translation uncertainties because T3 is preserved. These ten flags identify the least-certain wording; they do not make the other drafts approved. Full English/Filipino pairs and reasons are also in docs/qa/i18n-uncertainties.json.

The ten least-certain entries are:

1. T1, "Limited source reliability": warning tone and source-reliability terminology.
2. T1, "Which electives do you take and feel strongest in?": naturalness of the strongest-in wording.
3. T1, "Trade skills (welding, electrical, automotive, drafting)": local technical-trade terminology.
4. T1, the Leadership and uniformed service certificate category: terminology across its varied examples.
5. T1, "I can keep track of money, records, budgets, files, books, and schedules carefully.": clarity of the long skills statement.
6. T2, the full "All amounts are estimated gross monthly salary ranges..." methodology: gross salary and benchmark terminology.
7. T2, "Professional practice may require meeting applicable registration rules.": preserving the conditional registration requirement.
8. T2, "after meeting applicable teacher qualification and licensure requirements": qualification/licensure wording.
9. T2, the Human Services overview: institution-dependent professional scope.
10. T2, the Anthropology overview: technical approaches and field-research terminology.

## Browser checks and measurements

Saved witness answers were LOADED through the local-only QA storage loader, not typed. They use the real session schema and app screens. Old route: BUS02, BS Management Accounting. New route: HLT01, BS Nursing. Language was changed with the normal settings selector. Only the old-route optional nickname was subsequently typed as "QA Niño Áéíóú Ñü" for actual-download glyph coverage; scoring answers were not changed.

The completed pre-interruption work covered both Basecamp steps, Mountains, Forest, all four Valley steps per route, old-route Results/search/sort/filter/compare, all six old-route detail tabs, and new-route Basecamp/assessment/Processing. The resumed pass completed new-route Results, links and detail checks, both actual downloads and old-route Processing. Prior completed work was retained.

Requested and actual viewport sizes:

- 1600 by 900: actual 1600 by 900.
- 1280 by 720: actual 1280 by 720.
- 950 by 900: actual 950 by 900.
- 375 by 813: browser rounded to actual 375 by 814. Exact 813-pixel height was not verified.

The saved log contains 214 layout observations across 55 named check states, all with lang=fil. No observation had document width above viewport width or a detected horizontally offscreen control. Checks include repeated states and diagnostic observations; 214 is not a count of distinct pages. DOM geometry supplements visual checks; it does not prove all text is readable without scrolling. Existing inner scroll areas remain in use.

New-route actions and observed results:

- Search "nurse": 1 course, BS Nursing, true rank #1; hint "Nagtugma sa trabaho: Staff nurse".
- Search "teacher": 7 courses, retaining true ranks #41, #44, #52, #53, #64, #75 and #85.
- Health group filter: 10 courses. Adding Public SUC and Albay gave 3 courses with true ranks #1, #2 and #4. The full summary displayed in Filipino, with Albay unchanged.
- Lowest match first displayed all 85, starting at #85, #84 and #83. A to Z displayed all 85, starting with Anthropology (BA/BS), BA Broadcasting and BA Communication, retaining ranks #39, #80 and #78.
- A normal language switch and identical sorting produced the same 85 unique course/rank pairs in English and Filipino. Hidden compare headings were excluded from the card comparison.
- BS Nursing and Doctor of Dental Medicine were compared. Course names, job titles and salary amounts remained unchanged; notes and labels were Filipino. Comparison remained scrollable within the dialog.
- The BS Nursing overview, school and career links opened #overview, #schools and #careers and selected journal-tab-overview, journal-tab-schools and journal-tab-careers respectively. Back to Results worked.
- All six detail tabs were checked at all four sizes: Overview, Study, Schools, Careers, Guidance and Financial Aid.
- Final browser console errors: 0, using the final-pass timestamp in the saved log.

Evidence: docs/qa/i18n-browser-checks.json, docs/qa/i18n-browser-downloads.json and docs/qa/i18n-mobile-results.png.

## Minimal CSS fix

One CSS rule changed, inside the existing mobile breakpoint in app/results/results.css: min-width:0 and overflow-wrap:anywhere on .course-info-label. The long Filipino Overview label now wraps within the existing 4rem column.

Before: the label expanded to 115 pixels and the overview link had 141 pixels. After: the label is 64 pixels and the link has 192 pixels at 375 by 814. The preview still uses the existing intentional one-line ellipsis. Its entire translated first sentence remains in the title tooltip, accessible label and Overview tab. No sentence was cut in JavaScript and no new whole-page scroll was added. No other CSS changed.

## Actual PDF downloads and glyph checks

Both browser downloads completed and reached the translated Report confirmation screen:

- Old BUS02: career-compass-explorer-report (24).pdf, copied to docs/qa/i18n-browser-old.pdf.
- New HLT01: career-compass-explorer-report (23).pdf, copied to docs/qa/i18n-browser-new.pdf.

Each is 6 pages. pypdf extraction confirms all expected section headings, route-specific profile labels and all five unchanged course names. Both have no percent signs, no numeric match-score phrases and no replacement/null glyphs. GWA, salaries, dates and ordinal ranks remain legitimate factual numbers, not match scores.

The old browser download preserves the exact accented QA nickname. A separate regular/bold Helvetica probe preserves and renders ñ, Ñ, á, é, í, ó, ú, Á, É, Í, Ó, Ú, ü and Ü. The new download does not happen to contain those characters in its QA nickname; the same font is checked by the probe and old actual download. No glyph problem was found for the tested characters. Rendered cover/profile/source pages and extracted text are saved under docs/qa/i18n-browser-*. The font probe is docs/qa/i18n-glyph-probe.pdf/.png. No font asset was added.

The verification uses bundled pypdf and PDFium. PyMuPDF was unavailable; the script uses the existing PDFium package instead, without installing anything. The PDF-only PHP currency substitution is unchanged.

## Automated verification

- node scripts/i18n-missing.mjs: PASS, T1/T2 gaps 0.
- npm test: 96 tests, 95 passed, 0 failed, 1 skipped.
- The one skipped test is the historical Grade 12 pilot-school case in lib/sessionFlow.test.js. git show HEAD:lib/sessionFlow.test.js already contains test.skip and the comment that pilot routing became unused in Prompt 24. It was not newly skipped for translation.
- Existing legacy translation-test expectations were updated only to allow Grade 11 and Grade 12 to remain English, matching the requested policy.
- verify-links: PASS.
- verify-details: PASS, 85 details, 463 careers and 2 careerNotes; school counts min 1, max 18.
- verify-reachability: PASS, all 170 cases, 0 WARN/TIE/FAIL.
- verify-simulation: PASS, 40,000 uniform profiles, 153,000 persona profiles, 510 course/route/p cells and existing repeatability hashes.
- verify-browser-replay: PASS, historical 12 English replay downloads. This is separate from the two new Filipino download checks.
- verify-routes: PASS, 96 HTML/RSC routes, 85 v2 course details, worker coverage.
- verify-i18n-pdf and scripts/qa/i18n-pdf-text.py --browser: PASS, both models/downloads and glyph probe.
- Existing scripts/qa/verify-chatgpt-flows.mjs: exit 0; unrelated flow-catalog outputs were retained.
- Final production/offline build: PASS with CIRCLE_NODE_TOTAL=2, build WtnpLBoZ8FM2Jx7Tx-kV8, 96 routes, 615 resources, 52,059,519 bytes.
- npm run dev was invoked; it identified the existing server on port 3000. The existing development app was checked without console errors. Production replay used the local static QA harness, whose image fallback serves original assets and does not test Next image optimization.

Operational failures were not counted as successful checks: an unconstrained build hit the host process limit, then passed with two workers. A simultaneous final test/verifier batch hit host memory limits; npm test, verify-simulation and verify-browser-replay passed when rerun without overlapping work. Two static-harness prefetch requests encountered ENOENT while build artifacts were being replaced; the harness was stopped for final checking and the final browser pass had no console errors. No scoring or content was tuned to address these resource failures.

Logs: docs/qa/i18n-test-output.txt, i18n-build-output.txt, i18n-verify-*.txt, i18n-browser-pdf-checks.json and i18n-pdf-checks.json.

## Files and protected scope

Changed existing files: app/journey/academic/page.js; app/report/page.js; app/results/ResultsControls.js; app/results/page.js; app/results/results.css; components/Localized.js; lib/explorerReport.js; lib/i18n/patterns.js; lib/i18n/translate.js; lib/i18n/translate.test.js.

Created implementation/tests/scripts: lib/i18n/fil-v2.js; lib/i18n/fil-v2-content.js; lib/i18n/policy.js; lib/i18n/v2.test.js; scripts/i18n-missing.mjs; scripts/i18n-prose-drafts.mjs; scripts/write-i18n-review.mjs; scripts/verify-i18n-pdf.mjs; scripts/qa/i18n-pdf-text.py. Created reports/inventories: this report, docs/i18n-review.md, docs/i18n-missing.json, and the i18n-prefixed evidence files in docs/qa/.

The source snapshot and numbered draft array support audit of the prose-authoring pass; the runtime catalog uses literal English keys, not a mutable course-ID binding. All 26 protected baseline files across data/v2/, lib/scoringV2/ and the four old catalog files are byte-unchanged. Package files are unchanged. The file audit is docs/qa/i18n-file-audit.json.

Git remains intentionally dirty with the ten existing-file changes and untracked translation/evidence files. Separate ChatGPT flow-catalog files under output/pdf/, tmp/pdfs/, scripts/qa/ and docs/qa/ predated this resumed task and were not edited as translation work. Full final status is docs/qa/i18n-git-status.txt. Nothing was staged or committed.

## NOT DETERMINED

- Owner approval and naturalness/technical accuracy of the machine drafts, especially the ten flagged entries.
- Whether Filipino keyword search should be added later. Current search uses English source fields in both languages; no Filipino keyword search was built.
- Exact layout at 375 by 813, because the browser rounded to 375 by 814.
- Native mobile-device rendering and all browser/font combinations beyond this browser sample.
- Future text or names containing characters outside the tested Helvetica character set.

Source facts, school qualifications and salary estimates were translated as supplied, without independently validating or changing them.
