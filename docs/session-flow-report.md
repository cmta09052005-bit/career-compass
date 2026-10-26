# Session schema and Basecamp flow

Phase 3a. Branch: v2-rebuild. No commit. Scope is session state, route resolution, guards, Basecamp and an unused engine adapter. Earlier uncommitted work is preserved.

## Decisions and design reference

The requested Theme Bible was not found in the repository. The user approved using the current Mountains screen and shared theme styles instead. Basecamp retains its existing artwork, shared Button/Card/Badge components, fonts and transitions. New curriculum controls use the Mountains parchment, navy, gold and teal treatment. No dependencies, emojis, em dashes or document-level scrolling were added.

Basecamp now has two steps. Step 1 contains optional name followed by optional avatar. Step 2 contains required grade level, then the Grade 12 school selector, then curriculum choice when applicable. Existing ?step=2 restoration, browser history, recap, avatar auto-assignment and the shared map-entry portal remain supported. There is no strand choice at Basecamp.

## Task 1: session and storage

New pure helpers in lib/sessionSchema.js are shared by the React hook, storage migration and tests. The v2 record has schemaVersion:2, gradeLevel:11|12|null, pilotSchoolId:string|null, route:old|new|null, interests, skills, certificates, gwa, old:{strand,subjects} and new:{electives,cluster,bestSubjects}. Existing nickname, optional name, avatarId, yearLevel and other non-scoring metadata remain available. yearLevel is retained for existing display callers; Basecamp updates it alongside gradeLevel, but it never resolves the scoring route.

valleyProgress explicitly records:

```js
{
  gwa: false,
  certificates: false,
  old: { strand: false, subjects: false },
  new: { electives: false, cluster: false, bestSubjects: false }
}
```

Values alone do not establish completion. certificates:[] plus certificates:true means answered None yet. electives:[] plus electives:true and cluster:null plus cluster:true mean answered Not sure yet. The same values with false flags are unanswered. Flags must be literal true. This prevents default empty answers from unlocking Valley or scoring.

The existing careerCompassSession key is retained, with schemaVersion:2 in the record and a careerCompassSessionVersion metadata key. The existing careerCompassLocalMigrationV1 marker continues to protect the earlier sessionStorage-to-localStorage transport migration; renaming it would risk resurrecting stale legacy data. It is separate from the new record schema version.

readSessionRecord normalizes valid v1 JSON into a fresh v2 record, retains name/nickname, avatar and legacy yearLevel text, clears all scoring answers and completion state, and removes old journey notices, briefing/step markers, map position and tour/unlock state. It writes the v2 record before notifying subscribers about subsequent cleanup, preventing migration recursion. Preferences such as language and sound remain intact. Invalid or missing records produce an empty usable session. Existing blocked-storage pending-write/retry behavior is retained.

lib/fixtures/session-v1.json is a complete serialized v1 fixture, built from the actual previous createEmptySession implementation and historical 24-course regression answers, with test-only identity values. It is not real student data. Tests persist this full v1 shape in both localStorage and legacy sessionStorage before calling the real migration path. Identity survives, scoring state resets, stale Valley-step state is removed, preferences survive, and a second read is stable.

Context changes are resolved before branch clearing. When an old/new route becomes inactive, only that route's nested answers and confirmation flags are cleared. Interests, skills, certificates, GWA and their shared confirmations are preserved. Grade/school changes require a fresh manual route choice when no automatic rule applies. Changing metadata without changing the effective route does not clear that route. Overall completion flags are revalidated sequentially; an incomplete Basecamp can downgrade completion statuses without deleting the underlying common answers.

Profile edits alone do not start Valley. If no active-route or shared Valley answers remain after a switch, academic stays Not Started; otherwise it becomes In Progress. This also prevents a new profile's route choices from incorrectly skipping the map introduction.

Temporary top-level strand and subjects fields remain empty defaults for the unchanged Valley screen's safe rendering. They are deprecated compatibility fields, not canonical v2 scoring inputs. The hook's existing legacy answers projection is retained for the explicitly deferred Processing/Results/Report consumers. The new adapter is separate and is not used by those pages yet.

## Task 2: route resolution and empty pilot list

data/v2/pilot-schools.json is intentionally []. No names were inferred from the college-school data or invented. The production school selector therefore contains Select school and Other school only. Grade 12 must answer Other school, then may choose either curriculum. There is currently no selectable production pilot school.

resolveRoute({gradeLevel,pilotSchoolId,chosenRoute}) returns route, locked, needsSchoolQuestion and needsRouteChoice. The needs... fields describe which questions apply, including when already answered, so the controls remain available for editing.

- Grade 11: new, locked; no school or route question.
- Grade 12 with a listed pilot ID: new, locked; school question applies, route choice does not.
- Grade 12 with Other school: old/new choice is unlocked; route is null until chosen.
- Missing/unknown grade or an unanswered/unrecognized Grade 12 school: route remains null.

Other school is a reserved non-pilot value, even if a future supplied list accidentally uses that ID. Automatic rules override incompatible chosenRoute values. The pilot branch is tested with an injected, explicitly test-only fixture list. No test name is written to production pilot-schools.json. Real pilot names and official pilot coverage remain NOT DETERMINED until the user supplies them.

## Task 3: validation and guards

lib/scoringV2/validate.js now exports validateSectionAnswers. Partial and full validation share the original rule implementation. Partial sections validate only interests, skills, or academic fields, rather than fabricating unrelated completed answers or calling the full-answer validator. The public full validator retains its previous errors, codes and behavior. An independent comparison against the pre-change implementation matched all 684 valid/invalid profiles tested; existing v2 scoring/hash/ranking tests also pass.

lib/assessmentValidation.js uses the partial validator for all three assessments. Academic completion additionally requires every applicable Valley confirmation above. The new isBasecampComplete predicate replaces strand readiness in JourneyAccess, journeyEntry and the map. Stored Completed flags never override missing required answers. A fifteen-skill requirement is enforced even though the current Forest screen still renders ten controls.

The map retains its five nodes: Basecamp, Mountains, Forest, Valley, Islands. Only readiness, progression and their dependencies changed. No map geometry, artwork, animation sequencing or region list was changed. Basecamp completion no longer requires a strand. Node/result readiness checks use valid section data, not completion flags alone.

Existing field-level legacy helpers such as isValidGwa and isValidSubjects remain for the unchanged Valley controls until their replacement. They do not define v2 section validity. The existing assessmentValidation.test.js was updated to use a complete v2 progression fixture while preserving coverage of those legacy control helpers.

## Task 4: Basecamp and browser checks

Single-select grade and curriculum controls retain the existing checkbox-based deselection behavior. School selection can be cleared by returning to Select school. Validation focuses the missing control, and unknown/stale pilot IDs require the school question again rather than resolving an invented route. All fields remain editable through Back/Edit. Locked-route notes explain automatic Grade 11 or pilot routing without offering an ineffective toggle.

Only Basecamp's inner region scrolls. Its avatar grid flows within that region; the second step no longer suppresses the existing inner overflow. Keyboard focus uses the shared teal treatment, including the school select. New forms reuse the existing layout rather than adding an outer scroll surface.

Executed npm run dev. It found an existing server for this same workspace at localhost:3000 and declined a duplicate instance after reporting port 3001. The existing server was reused without stopping it. It compiled the changed screens. Browser error logs were empty for the tested Basecamp/map interactions. Existing dev warnings about the parent package-lock file and Fast Refresh full reloads are not application console errors.

Verified live in the in-app browser:

- Name/avatar restore and optional first-step controls.
- Grade 11 automatic new route with no school choice and the locked-route note.
- Grade 12 Other school with both old and new route choices using the empty production pilot list.
- Curriculum deselection, grade deselection and blocked map entry with focused grade error.
- ?step=2 reload restoration and browser history restoration after Edit.
- Leave Basecamp dialog and Stay behavior.
- Shared success portal and map entry without a strand; five map nodes with sequential locks.
- No browser console errors in the inspected logs.

Measured at 1600 x 900: whole-document overflow 0px; final-step inner clientHeight 768px, scrollHeight 768px. At 375 x 813: whole-document overflow 0px; inner clientHeight 703px; first-step scrollHeight 2365px and final-step scrollHeight 727px. Overflow remains inside .basecamp-inner with overflow-y:auto. Temporary viewport overrides were reset afterward.

Not browser-verified: a real Grade 12 pilot selection because the production list is empty; every browser/OS and viewport; screen-reader behavior; offline cold startup with the new schema; real-device storage denial/quota during migration; and end-to-end v2 assessment/results/PDF completion. Storage failures continue to have unit coverage for the existing storage layer. No screenshots are required or claimed as deliverables.

## Task 5: adapter and tests

lib/scoringV2/fromSession.js returns {ok,answers,errors}. It projects only canonical scoring fields and the active route, creates independent maps/selection arrays, and ignores name, avatar, grade, school, legacy aliases and other metadata. It calls the real full v2 validator and additionally rejects unmigrated records, incomplete Basecamp and unanswered Valley confirmations with SESSION_VERSION, BASECAMP_INCOMPLETE or UNANSWERED errors. It does not compute scores, change the engine, or wire itself into a page.

Added lib/sessionFlow.test.js, covering Grade 11 automation; test-only Grade 12 pilot routing; Grade 12 non-pilot old/new choices; empty/unknown pilot IDs; the full serialized v1 fixture in local and legacy storage; route/grade/school branch clearing; preserving common evidence; profile changes not starting Valley; None yet/Not sure yet versus unanswered; partial-section validation; sequential guards; and adapter output accepted by the real validator with metadata/inactive fields excluded.

Final npm test output:

```text
tests 66
suites 0
pass 66
fail 0
cancelled 0
skipped 0
todo 0
```

The first combined run caught a missing optional reportDate property after migration versus a subsequent normalized read. Empty-session normalization was made stable and the refreshed runs pass. Existing Node MODULE_TYPELESS_PACKAGE_JSON warnings remain informational; package.json was not changed by this phase.

The existing details verifier and link verifier both pass. Targeted ESLint passed on the changed JavaScript files with exit code 0 and no findings. No production build was run because it would regenerate the existing offline build files, which are outside this phase.

## DRAFT copy inventory

All new student-facing copy below is DRAFT. No i18n catalog was edited; new keys currently fall back to English. Existing unchanged avatar names, flavor text, privacy copy, shared buttons and portal text are reused.

- DRAFT: Choose your curriculum
- DRAFT: Add a name and choose an explorer. Both are optional.
- DRAFT: Start with your grade level.
- DRAFT: Grade level (required)
- DRAFT composition: Grade 11; Grade 12
- DRAFT: Your school
- DRAFT: Select school
- DRAFT: Other school
- DRAFT: Choose Other school if your school is not listed.
- DRAFT: Curriculum
- DRAFT: Old curriculum
- DRAFT: New curriculum
- DRAFT: Grade 11 uses the new curriculum.
- DRAFT: Your school uses the new curriculum.
- DRAFT: Choose your grade level.
- DRAFT: Choose your school.
- DRAFT: Choose your curriculum.
- DRAFT button label: Continue
- DRAFT button label: Enter my map
- DRAFT: Leave Basecamp?
- DRAFT: Your choices are saved on this device.
- DRAFT guard copy: Choose your grade and curriculum at Basecamp.

New validation/error messages are also DRAFT for any future UI consumer: Expected a saved session.; Migrate the saved session before scoring.; Complete Basecamp before scoring.; Confirm this Valley answer before scoring.; Unknown assessment section.

## Deferred screens and exact inconsistencies

- app/journey/interests/page.js (Mountains): still reads data/items.json. Question IDs remain the same, but old option wording differs from the v2 bank. New responses collected through that old copy must not be claimed as a complete v2 implementation. This screen was not edited.
- app/journey/skills/page.js (Forest): still has ten legacy statements. The v2 guard requires fifteen, with different statements/associations; a normal current-screen journey cannot complete Forest or unlock Valley until Prompt 24 updates it.
- app/journey/academic/page.js (Valley): still has the old two-step GWA/subject form, old subject values, old GWA control range and top-level strand/subjects reads/writes. It has no v2 strand selector, route-specific electives/cluster/best subjects or certificates, and does not write the required Valley confirmation flags. Safe compatibility defaults prevent missing-array crashes, but cannot make this screen v2-complete. This is deferred to Prompt 24.
- app/journey/page.js (map): guards and Basecamp completion are v2, but existing Forest description/copy still refers to ten statements. Node geometry and five-node layout remain unchanged; catalog/copy updates are deferred.
- app/processing/page.js, app/results/page.js and app/report/page.js: still consume the existing legacy scoring projection and old engine. The new adapter is not connected. Their scoring and strand-based presentation are not ready for a v2-complete profile.
- app/results/[courseId]/page.js: still uses the existing 24-entry detail dataset/static routes. The v2 85-course details/schools are not wired.
- lib/explorerReport.js and PDF output: still use the legacy course/result/report model and existing course-count/presentation rules. No v2 PDF integration was attempted.
- lib/i18n catalogs: unchanged. New DRAFT strings are not translated, and earlier skills/strand/count wording remains until the scheduled copy work.

Consequently this branch is a staged state/guard/Basecamp migration, not a finished end-to-end v2 journey. The assessment-screen work in Prompt 24 and later engine/results/detail/PDF/catalog wiring must follow before claiming production v2 completion. Non-UI engine verification remains independent and passing.

## Files and preservation

Modified in this phase: app/intake/page.js, app/intake/basecamp.css, app/journey/page.js, components/JourneyAccess.js, lib/useSessionAnswers.js, lib/browserStorage.js, lib/assessmentValidation.js, lib/assessmentValidation.test.js, lib/journeyEntry.js and lib/scoringV2/validate.js (partial API only).

Created: data/v2/pilot-schools.json, lib/routeResolution.js, lib/sessionSchema.js, lib/fixtures/session-v1.json, lib/sessionFlow.test.js, lib/scoringV2/fromSession.js and docs/session-flow-report.md.

All 283 other phase-start files are byte-identical against a SHA-256 baseline, including earlier untracked data/engine/review artifacts. This phase modified ten existing files and created seven. Mountains, Forest, Valley, Processing, Results, Course Detail, Report/PDF and i18n source files are unchanged. Scoring arithmetic, ranking and hashing files are unchanged. package.json's visible modification predates this phase and is preserved. No commit, reset or dependency installation was performed.

Remaining NOT DETERMINED items are the real pilot-school list, approval/translations of DRAFT copy, untested browser/device/storage cases above, and the deferred end-to-end journey. The missing Theme Bible question was resolved by the user's approval to use Mountains/shared styles; no unavailable design document was silently invented.
