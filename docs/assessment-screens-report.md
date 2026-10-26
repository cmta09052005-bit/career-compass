# Assessment screens v2 report

Phase 3b, Prompt 24. Branch: v2-rebuild. No commit, dependencies, art or audio assets added.

## Changes

Task 0: INT-08 uses the exact approved typhoon prompt. Grade 12 chooses a curriculum directly; Grade 11 automatically uses new. needsSchoolQuestion is always false. pilot-schools.json remains unchanged and pilotSchoolId remains in the schema, normalized to null and unused. Guards and fromSession use the shared route resolver. The historical pilot test is retained with an explicit skip comment. The same exact curriculum labels appear in choices, recap, automatic note and Valley header.

Task 1: lib/itemsV2.js exports the v2 banks; its interest view adds letter keys without changing text. Icon-map assignments are DRAFT. lib/itemIconsV2.js contains existing SVG paths only. See icon-inventory.md for all existing art and neutral assignments. Legacy data/items.json and scripts/check-strands.mjs are untouched and no longer supply item content to these screens. Legacy validation helpers remain available for deferred screens.

Task 2: Mountains renders eight exact prompts and 32 options, saves letters, and resolves art through the draft icon map. Existing option tilt, sound, auto-advance, dust, peak trail, close dialog and completion celebration are preserved. Deselect clears the current answer. Next is shown for saved answers only after Back.

Task 3: Forest renders all 15 exact statements. Vine leaves, accessibility maximum, light progress, briefing and map count use 15. Growth stages, keyboard and pointer controls, confirmation glow, auto-advance, Next after Back, sounds, instruction line, hover and fireflies are preserved. Shared partial validation requires every statement before completion unlocks Valley.

Tasks 4 to 6: Valley uses a fixed card with header, bounded choice scroller and separate footer. Old route: strand, 19 subjects, GWA, certificates. New route: 70 scored electives grouped in source order, 14 clusters, 4 core plus 70 elective best subjects, GWA, certificates. Each subject/elective is one source row, including combined labels. There are no searches or filters. Three-pick trays retain selections across groups and provide remove controls. Existing harvest flights, basket path, shake, pollen, sounds and shared boxless close/blurred exit modal are reused. Single and multiple choices use native buttons with aria-pressed and visible focus. Not sure yet and None yet exclusively confirm the empty canonical value; deselecting them clears confirmation. Changes save immediately to nested v2 fields and flags. No deprecated top-level strand or subjects access remains in Valley. Step names and route are saved under the existing Valley key; the URL and popstate restore Back/reload.

Task 7: GWA accepts 60 to 100 with at most two decimal places, including below 75, without rounding. The engine remains permissive from 0 to 100; this narrower range is a screen rule only. Certificates show the 13 exact full labels and None yet. Finish requires each active step, then validates through the real fromSession adapter, marks Valley complete and returns to the map. The map supplies the existing Scholar completion celebration. Validation failures remain visible.

Task 8: Updated Forest briefing and map count. Searched screen/map/guide/badge text for old counts, strand-only and 24-course wording; no additional affected region text remained. i18n catalogs were not edited.

## Validation

npm test:

```text
tests 70
pass 69
fail 0
skipped 1 (historical pilot routing, deliberately unused)
```

All prior tests still pass. Added pure selection/step/GWA tests and two full session journeys using real old/new reachability witnesses, each accepted by fromSession and exactly matching its canonical answers. Targeted ESLint passed with exit 0.

All three verifiers pass:

- links: 85 courses, 425 elective links, all IDs and Appendix changes verified.
- details: 85 details/index IDs; 463 ranges and careers, 2 careerNotes; 51 school rows, 297 links; min 1/max 18 schools. The verifier now recognizes the expressly approved INT-08 override and compares the other seven stems to the old bank.
- reachability: PASS 170, WARN 0, TIE 0, FAIL 0; 170/170 witnesses re-scored. Witness file unchanged. The generated reachability report updates its items.json input hash for the authorized stem edit.

The links verifier's historical note that rubric stems were absent is still accurate about the source rubric. The screens use the supplied fallback stems plus the approved INT-08 override.

npm run dev was invoked. It found the existing development server for this same workspace at localhost:3000 (PID 142932); the attempted second server exited, and browser checks used the existing server. No browser console errors were recorded across the checked flows. Node prints its existing MODULE_TYPELESS_PACKAGE_JSON warning; no dependency or package setting was changed to suppress it.

## Browser checks and measurements

Browser: in-app Chromium, local development server. Old route completed all eight Mountains questions and all fifteen Forest ratings, then GAS, three subjects, GWA 74.99 and None yet. The new route retained the shared Mountains/Forest answers when changing curriculum, then completed three electives across distant groups, Not sure yet cluster, three best subjects including two overlapping electives, GWA 60 and three certificates. Both returned to the map with all three assessment regions completed. The existing Scholar celebration was observed for the old completion. Existing map badges are not replayed once already awarded.

Checked Mountains deselection and Next after Back; Forest keyboard End/Enter auto-advance and Next after Back; Valley strand deselection, fourth-pick rejection, selected remove controls, exclusive sentinel values, invalid 74.999 with inline error, valid 74.99 and 60, footer Back, browser Back and reload restoration. The new-route check confirmed selected best-subject values after Back/reload.

Actual CSS viewport sizes were 1600x900, 1280x720, 950x900 and 375x813. Each following line lists inner clientHeight/scrollHeight in that order. All 36 measurements had document vertical overflow 0, horizontal overflow 0, and an unclipped footer. Offscreen choice cards are reachable through the bounded inner scroller. Selected trays have their own bounded scroll when needed. The old subjects measurement includes the three-pick tray and the limit notice; new elective, best-subject and certificate measurements include three picks.

- old / strand: 613/613, 435/435, 615/615, 538/971.
- old / subjects: 522/565, 344/547, 525/598, 362/1816.
- old / gwa: 613/613, 435/435, 615/615, 512/512.
- old / certificates: 578/691, 400/691, 580/742, 477/1548.
- new / electives: 542/3503, 364/3336, 544/3551, 382/7620.
- new / cluster: 613/613, 435/444, 615/615, 512/1415.
- new / bestSubjects: 542/3594, 364/3426, 502/3643, 382/7961.
- new / gwa: 613/613, 435/435, 615/615, 512/512.
- new / certificates: 500/691, 322/691, 502/742, 382/1536.

No whole-page scrolling was observed. The mobile strand screenshot was visually inspected; Back/Next and boxless exit were visible. Keyboard controls were exercised in Forest and Valley (Enter reselected General Mathematics after removal); Valley uses native keyboard-activatable buttons and visible focus. Physical touch hardware was not available.

## DRAFT copy and icon review

All new display copy is DRAFT, including the approved label/prompt changes, pending the user's review:

- "A strong typhoon hits your community. How would you help?"
- "Old curriculum - strand"; "New curriculum - electives"; "Grade 11 uses New curriculum - electives."
- "15 statements. Slide to show how confident you feel. There's no pass or fail here, just be honest with yourself." and map "15 statements".
- "4 steps. Add your subjects, general average, and certificates." / "5 steps. Add your subjects, general average, and certificates."
- "Which strand are you taking?"; "Which subjects are you strongest in?"; "Which electives are you taking?"; "Which cluster are you taking?"; "What is your general average?"; "Which certificates or awards do you have?"
- "The Valley · Step x of N"; "Core subjects"; "General Weighted Average (GWA)"; "60 to 100, up to 2 decimal places."
- "Choose one. Tap again to deselect."; "Choose 1 to 3."; "Choose 1 to 3, or Not sure yet."; "Choose up to 3, or None yet."; "n of 3 selected".
- "Choose up to 3. Remove a selection first."; "Choose an answer before continuing."; "Enter a number from 60 to 100 with up to 2 decimal places."; "Check each Valley step before finishing."; "Please check your answers." followed by actual validator paths/messages.
- "Not sure yet"; "None yet"; "Next"; "Finish"; "Remove {exact source label}" for tray accessibility.
- Group headings combine the exact source section and cluster names using ": ". Source option/statement/card labels remain exact. Full certificate labels are displayed without splitting or shortening.

The entire 70-entry icon map is DRAFT (32 interest options, 15 skills, 10 strands, 13 certificates). All neutral assignments are listed in icon-inventory.md. Subject/elective/cluster cards use the existing neutral notebook. Review these visual assignments; they do not change scoring.

## Deferred inconsistencies and NOT DETERMINED

Processing, Results, Course Detail and PDF remain on the old engine/data/answer adapter as requested. They are not ready to interpret these v2 sessions. The map can unlock its existing Results button after a valid v2 journey, but this phase does not switch the destination implementation. i18n catalogs retain their old translations/counts; new copy and v2 item translations are deferred. Basecamp and existing regional wrappers still use the established localization fallback; Valley's new source text is English pending the later catalog work.

Theme Bible file path remains NOT DETERMINED. The user's prior "yes" approved using current Mountains and shared styles instead. Physical touch-device behavior and independent screen-reader output are NOT DETERMINED; keyboard semantics, small viewport layout and browser console were checked. No scoring-rubric ambiguity or missing source label blocked this phase. No pilot school names were invented.

## Files changed in this phase

- data/v2/items.json
- docs/reachability-report.md
- lib/routeResolution.js
- lib/scoringV2/fromSession.js
- lib/sessionFlow.test.js
- lib/sessionSchema.js
- scripts/verify-details.mjs
- app/intake/page.js
- app/journey/academic/page.js
- app/journey/academic/presentation.css
- app/journey/interests/page.js
- app/journey/page.js
- app/journey/skills/ForestVine.js
- app/journey/skills/StatementIcon.js
- app/journey/skills/page.js

Created:

- data/v2/icon-map.json
- docs/icon-inventory.md
- lib/itemIconsV2.js
- lib/itemsV2.js
- lib/valleySelection.js
- lib/valleySelection.test.js
- docs/assessment-screens-report.md

The pre-existing dirty workspace was preserved. Engine scoring, ranking, SHA-256, full validator, old data, package files, i18n catalogs and all deferred destination screens are byte-identical to this phase's baseline. No commit.

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
 M components/JourneyAccess.js
 M lib/assessmentValidation.js
 M lib/assessmentValidation.test.js
 M lib/browserStorage.js
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
?? docs/scoring-v2-report.md
?? docs/session-flow-report.md
?? lib/fixtures/
?? lib/itemIconsV2.js
?? lib/itemsV2.js
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

Branch v2-rebuild. Status includes earlier phases, not only this prompt. No files staged or committed.
