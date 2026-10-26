# Phase 1 data conversion and delta audit

Date: 2026-10-26, Asia/Manila. Confidence: high for extracted counts and links; medium for future integration; live browser measurements remain NOT DETERMINED.

## Scope and sources

Read both pasted prompts; their task text is identical. The user explicitly requested execution of that prompt. Source documents were treated as data, not as authorization to change the application. Read instructions.md, AGENTS.md, docs/new-curriculum-scoring-audit.md and docs/local-storage.md. No application, component, library, configuration, existing data, or existing documentation file was edited. No commit was made. Initial git status was clean.

Inputs were the supplied New Algorithm.pdf (26 pages), College_Courses_in_the_Philippines_85_Master_List.pdf (8 pages), and College Courses Information.docx. Paths are those supplied in the chat. No outside research was used to replace their wording or mappings. The Web Crypto specification was consulted only for the technical API question below.

The general instruction to put new files in data/v2/ is followed for data and the change register. The explicit Task 4 and Task 7 paths are used for scripts/verify-links.mjs and this report. Extraction scripts and source inspection intermediates are outside the repository.

## Task 1: master list - complete

Created data/v2/courses-master.json with 85 entries, 85 unique source IDs, exact program names, group labels and CHED basis text. PDF line wrapping is joined with spaces; CHED claims are transcribed, not independently validated.

Group counts in source order: Business and Management 10; Computing 3; Engineering and Technology 15; Science and Mathematics 11; Agriculture, Fisheries, and Food 4; Health and Allied Sciences 10; Education and Sports 8; Social Sciences, Communication, and Humanities 18; Arts, Design, and Architecture 6. Sum: 85.

Discrepancy: the prompt says **8** groups but enumerates **9** counts. The PDF has **9** groups and agrees with every enumerated count. Nine groups were preserved.

## Task 2: item banks - extracted, missing prompts explicitly marked

Created data/v2/items.json. Counts: 8 interest groups with 4 options each (32 exact option statements); 15 skills; 13 scored certificates plus None yet; 19 old subjects; 4 core subjects; 70 scored elective rows plus unscored Work Immersion; 14 named clusters plus Not sure yet; 6 GWA tiers; 10 strands including unlinked Academic GAS.

Stable IDs: INT-01-A through INT-08-D; SKL-01 through SKL-15; CER-01 through CER-13; ACA-01 through ACA-19; COR-01 through COR-04; ELE-01 through ELE-70; CLU-01 through CLU-14; GWA-01 through GWA-06; STR-01 through STR-10. Sentinel choices have descriptive IDs and scored:false. Work Immersion is deliberately excluded from the scored 70 and from the 74 best subjects.

Exact row text is retained in text. Labels split grouped semicolon titles outside parentheses; numbered shorthand such as Physics 1, 2, 3, 4 expands in labels to Physics 1, Physics 2, Physics 3, Physics 4, while remaining one scored row with one ID. These expanded labels are structural expansions, not replacement display wording. Each scored elective has its source cluster and Academic/TechPro section.

GWA intervals: below 75 gives 0; [75,80) gives 2; [80,85) gives 3; [85,90) gives 4; [90,95) gives 5; [95,100] gives 6. null lower bound means unbounded below, not a decision to accept negative grades. The top interval has upperExclusive:100 and upperInclusive:true as an explicit exception, plus includes100:true. Validation of actual student grade input is outside this phase.

**NOT DETERMINED:** Section 5.1 (PDF pages 3-5) supplies option statements and links but no question-prompt text for any of the 8 interest groups. Each question is null with an explanatory status. Nothing was copied from the old assessment or invented. Consequently this item bank is structurally usable for verification but is not a complete production question bank.

The bestSubjects metadata lists 4 core IDs and 70 elective IDs. Elective best-subject cards inherit the same links.json electives associations; no duplicate independently editable mapping was introduced.

## Task 3: links - complete

Created data/v2/links.json keyed by the 85 master IDs. Order of construction: original Section 5 tables, original strand table, Appendix A revised strands, then every Appendix B replacement. Core subject links are unchanged. All course names matched canonical names after joining page/line wraps; the wrapped Technical- / Vocational word was rejoined without introducing an alias to another program. No unresolved course or mapping remained.

Appendix B uses unique shortened elective references: Business 1, Business 2, Finite Mathematics, Physical Education 1, Physical Education 2, Arts 1, and Aesthetic Services row. Each resolves to exactly one full row title in Section 5.5. The semicolon-separated Agricultural Crops Production; Organic Agriculture Production is one grouped elective row, not two links. The register retains the source removal/addition strings as well as resolved IDs.

Created data/v2/applied-changes.json with all 22 source rows. Short applied-changes log (IDs resolve to exact text in items.json):

- SOC11: removed ELE-13, ELE-15, ELE-23; added ELE-03, ELE-11, ELE-31.
- SCI10: removed ELE-13, ELE-15; added ELE-21, ELE-25.
- SCI11: removed ELE-13, ELE-15; added ELE-21, ELE-25.
- HLT02: removed ELE-13, ELE-15; added ELE-25, ELE-37.
- AGR02: removed ELE-13; added ELE-25.
- ART04: removed ELE-20; added ELE-50.
- ART06: removed ELE-15; added ELE-01.
- SOC04: removed ELE-28; added ELE-14.
- AGR04: removed ELE-28; added ELE-25.
- BUS04: removed ELE-20, ELE-25; added ELE-16, ELE-14.
- SCI09: removed ELE-09; added ELE-20.
- SCI07: removed ELE-13, ELE-20; added ELE-27, ELE-21.
- ART05: removed ELE-32, ELE-34; added ELE-01, ELE-42.
- SOC09: removed ELE-01; added ELE-09.
- SOC03: removed ELE-38, ELE-58; added ELE-40, ELE-11.
- ENG06: removed ELE-68; added ELE-25.
- ENG07: removed ELE-68; added ELE-14.
- ENG08: removed ELE-68; added ELE-23.
- ENG09: removed ELE-68; added ELE-20.
- ENG10: removed ELE-68; added ELE-25.
- ENG11: removed ELE-68; added ELE-25.
- SCI02: removed ELE-68; added ELE-22.

Section 7 Rank 1 leads were not used as revised verification. Appendix A overrides its old strand assignments.

## Task 4: verification - pass

Created scripts/verify-links.mjs. It exits nonzero on a missing file, invalid JSON, wrong count, duplicate/unknown reference, uncovered elective, wrong strand total, or failed replacement postcondition. It also checks item counts, unique item IDs, the 74 best-subject references and representative GWA interval boundaries. Run from any directory with node and the script path; its data paths resolve relative to the script.

Executed `node scripts/verify-links.mjs`:

```text
PASS: 85 unique courses; all referenced IDs exist.
PASS: every course has 2 interests in different questions, 2 skills, 2 old subjects, 2 certificates, 1 non-GAS strand, 1 core subject, 5 electives.
PASS: Appendix A strand totals 17/11/20/7/5/7/9/7/2; GAS 0.
PASS: 425 elective links; all 70 scored rows covered; all 22 Appendix B replacements applied.
NOTE: 8 interest question prompts are NOT DETERMINED in the supplied rubric; structural verification does not establish content completeness or Rank 1 reachability.
```

No inconsistency was found in the final PDF link totals. A disposable copy outside the repository with BUS01's skill links removed exited 1 and reported the expected error; the delivered data was not mutated. These checks establish structural consistency, not academic relevance, real-student fairness or revised Rank 1 reachability. The PDF itself explicitly says the latter has not been reverified after the revisions.

## Task 5: information DOCX - inspected only

The DOCX contains 85 unique course ID headings and 85 course tables; all 85 master IDs are covered. Missing courses: none. Each table has exactly five fields: Course Overview; What You'll Study (curly apostrophe in source); Useful Interests and Strengths; Where Can This Path Lead?; Guidance Tips. All five appear 85 times. All 85 career fields contain monthly salary estimates.

Schools: absent for all 85. There are no Albay-specific lists, or any school lists, to convert. Do not treat their absence as evidence that no Albay school offers a program.

Salary source and year: not structured per course or career. Shared methodology names Jobstreet, Indeed and DBM resources and says the guide was updated in October 2026. It describes estimates widened from benchmarks and, for some roles, related occupational families. A per-career source URL, source date and traceable original benchmark are NOT DETERMINED. No salary claim was independently verified in this phase.

Licensure: no separate field or boolean. Forty-seven course tables contain license/licensure/PRC wording in narrative content, including generic advice; that is not a verified count of regulated degree programs. Shared PRC links and disclaimers exist. Per-course current licensure requirements and eligibility are NOT DETERMINED. No DOCX conversion or edits were performed.

## Task 6: delta audit

### 1. Valley viewport and scrolling

The application already fixes the assessment frame and hides document overflow at app/globals.css:491, then provides panel overflow-y:auto at app/globals.css:496 and the reusable .assessment-scroll inner scroll pattern at app/globals.css:497 (min-height:0, overscroll-behavior:contain, stable scrollbar gutter). The print override at app/globals.css:505 intentionally restores document flow.

Valley currently overrides its desktop card to height:min(640px,100dvh - 48px) and overflow:visible at app/journey/academic/presentation.css:74. Simply adding 70 cards would overflow that fixed card and be clipped by the enclosing frame. Use a flex column with a bounded, min-height:0, overflow-y:auto choice region and persistent heading/selection status/actions outside it. Group choices by cluster, expose selection count and keyboard access, and keep selections across groups/sub-steps. The existing .assessment-scroll pattern provides the basis. Search/filter is deferred as requested.

For the prior audit's viewport set, current CSS gives the following **calculated card content-box budget**, before heading, help, basket and action rows: 1920x1080: 590px; 1440x900: 590px; 1280x720: 590px; 950x900: 590px. Calculation: 640px card minus 48px vertical padding and 2px borders, from app/globals.css:550, components/Card.js:9 and presentation.css:74. At 375x813 the mobile maximum card border-box is 813 - 52 - 14 = 747px and maximum content box is 709px after 36px padding and 2px borders (app/globals.css:552). This is a maximum, not a measured actual card height.

**NOT DETERMINED:** fresh rendered Valley inner heights and the actual choice-region budget at those five viewports. npm run dev reached Ready on localhost:3000, but the browser tool reported connection refused/timed out. No fresh browser measurements were obtained. The older audit's measured 948/768/604/768/703px figures are Basecamp inner heights, not Valley heights (docs/new-curriculum-scoring-audit.md, Intake space); they must not be relabeled as Valley measurements. Seventy/74 choices require inner scrolling or grouping rather than all being visible simultaneously. Future bilingual wrapping and fit are NOT DETERMINED.

### 2. Repeatable tie-break hash

Web Crypto exposes SubtleCrypto in Window and Worker secure contexts and digest returns a Promise: [W3C Web Cryptography specification](https://www.w3.org/TR/WebCryptoAPI/). Digest computation itself needs no network, so a cached app on its secure origin can use it offline. Static prerendering does not inherently prohibit it. HTTP on an ordinary LAN origin is not equivalent to a secure HTTPS origin.

The existing offline service worker handles public resource caching, not scoring (public/offline-worker.js:1, public/offline-worker.js:17). There is no subtle.digest integration there. Current ranking is synchronous (lib/scoringEngine.js:381); adding digest directly changes its call contract and would require awaiting it in consumers. A small deterministic synchronous hash is operationally safer for preserving that synchronous contract, provided canonical answer serialization and fixed integer semantics are specified and tested. This is an engineering inference, not a claim that Web Crypto fails offline. A synchronous implementation of the same hash can also preserve cross-runtime results.

Executed the installed Node runtime's SHA-256 known vector for abc: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad. **NOT DETERMINED:** an actual browser service-worker digest test and an integrated static-build tie-break test; neither implementation exists. No claim of passing either test is made.

### 3. Map/progress with three Valley sub-steps

The map already has 5 checkpoints: Basecamp, 3 regions, Islands (app/journey/page.js:128), while assessment completion uses exactly the 3 regions (app/journey/page.js:123). Keep certificates inside academic, so no extra map node is required.

What breaks without changes: Valley's restore code accepts only step 2 (app/journey/academic/page.js:76), its caption says of 2 (app/journey/academic/page.js:169), and submission marks academic completed after existing GWA/subjects (app/journey/academic/page.js:157). Existing validation knows no electives, cluster, route or certificates (lib/assessmentValidation.js:18). Map/results access could therefore unlock before certificates or reject valid new-route profiles. Session defaults and answer projection omit the new fields (lib/useSessionAnswers.js:20, lib/useSessionAnswers.js:204); discarding academic only clears GWA/subjects (lib/useSessionAnswers.js:196). Update all of those plus saved-session migration, back navigation, briefing copy and completion guards. A None yet certificate choice must be distinguishable from an unanswered sub-step.

### 4. Basecamp order

Current step 1: optional nickname, required strand, optional year level (app/intake/page.js:130). Current step 2: optional avatar and Enter My Map (app/intake/page.js:146). Step restoration recognizes only ?step=2 (app/intake/page.js:55). Advancing and final entry require a strand (app/intake/page.js:78, app/intake/page.js:149).

For the requested post-avatar controls, keep identity/avatar first, then required grade level, route and pilot-school selection. Grade 11 selects new automatically; Grade 12 needs old/new with the pilot-school rule. Ask strand only for the old route. Replace the old strand-based readiness guards in Basecamp, JourneyAccess (components/JourneyAccess.js:9), map Basecamp completion (app/journey/page.js:129), validatedProgress (lib/assessmentValidation.js:26) and journeyEntry (lib/journeyEntry.js:4). Extend URLs, recap, saved schema and invalidation when route changes. The actual pilot-school options and list authority are **NOT DETERMINED** by these inputs; do not fabricate schools.

### 5. English copy counts

Method: count distinct English lookup keys in fil.js, fil-content.js, fil-courses.js and fil-notes.js; count distinct actual UI strings in source-inventory.json separately; exclude SVG paths, CSS classes and colors. Catalog keys use regex word-boundary 24, explicit 10 quick sliders/statements/skills, percent or %, and strand (case-insensitive). The counts identify review candidates, not automatic deletion targets.

- Catalogs: **14 distinct keys**: one mentions 24; three mention 10 skills/statements/sliders; three mention percentages (one progress label, two Interior Design licensure descriptions); seven mention strand (six general profile/label strings, one course-specific STEM preference). Eleven are in fil.js; three in fil-courses.js; none in fil-content.js or fil-notes.js. There is no literal percentage-based recommendation-score key in this set.
- Inventory: **9 distinct UI strings**: one 24, two 10-skill statements, one % progress label, five strand/profile strings. All nine are already among the catalog keys. Thus catalog+inventory union remains **14**, not 23.
- Dynamic grammar adds **one strand-only report pattern**, making **15** when patterns.js is included. It is not a literal catalog key or inventory entry (lib/i18n/patterns.js:28).

Locations: 24 at lib/i18n/fil.js:38 and lib/i18n/source-inventory.json:487. Skills at fil.js:37, fil.js:42, fil.js:44 and inventory:28, inventory:29. Percentage strings at fil.js:44, fil-courses.js:68, fil-courses.js:70 and inventory:4. Strand keys at fil.js:36, fil.js:39, fil.js:43, fil.js:45, fil-courses.js:12 and inventory:86, inventory:153, inventory:154, inventory:155, inventory:378.

Keep map completion percentages conceptually separate from recommendation scores. The two 70% licensure descriptions are source claims requiring their own review; they are not assessment match percentages. Strand remains relevant to the old route, so conditional copy is needed. The catalog-only short key 10 statements and Strand are absent from the inventory; the inventory is not an exhaustive substitute for catalog review.

### 6. Offline build and 85 detail routes

Detail routes are generated from data/explore-courses.json, not scored courses (app/results/[courseId]/page.js:16). Adding v2 scoring data alone creates no new routes. There are currently 24 detail entries; wiring all 85 would add 61 routes, or about 3.54 times as many detail routes.

scripts/build-offline.mjs:35 discovers emitted HTML without a fixed course limit. For each route it copies HTML and RSC, then discovers segment files (scripts/build-offline.mjs:43, scripts/build-offline.mjs:49), accumulates resource bytes and writes the manifest (scripts/build-offline.mjs:68). It assumes every emitted HTML route has an RSC file and a segments directory. The existing pattern can handle 85 routes if Next continues emitting that layout; no new route list is required in this script. More routes add file I/O, output bytes and offline download/cache work. The worker downloads four resources concurrently (public/offline-worker.js:32).

At least 122 additional HTML/RSC resources would result from 61 new routes, plus their segment resources; shared assets need not multiply per route. Exact bytes, segment count, prerender duration, offline-copy duration and total build-time increase are **NOT DETERMINED** until complete detail data and an 85-route build exist. A full build was not run: it would regenerate existing public/offline-manifest.json and public/sw.js, conflicting with this phase's preservation scope. next.config.mjs:2 does not specify output:export; the current script packages Next prerender output and must not be described as proof of a tested Next static export.

## Task 7: deliverables and preservation

Created only:

- data/v2/courses-master.json
- data/v2/items.json
- data/v2/links.json
- data/v2/applied-changes.json
- scripts/verify-links.mjs
- docs/data-conversion-report.md

No UI changes were made. npm run dev reached Ready and reported a pre-existing environment warning about C:/Users/Charlene/package-lock.json outside the Git repository. Browser console verification is **NOT DETERMINED** because localhost could not be reached through the browser tool. No application console-error-free claim is made.

Final preservation check: git diff --exit-code passed with no tracked modifications. Initial status was clean; final status contains only the six new files above (Git groups the four data files as data/v2/). No existing file was changed and no commit was made.

```text
?? data/v2/
?? docs/data-conversion-report.md
?? scripts/verify-links.mjs
```
