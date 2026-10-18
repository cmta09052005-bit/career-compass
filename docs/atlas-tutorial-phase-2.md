# Atlas Tutorial Tour — Phase 2

## Tutorial labeling addition (2026-10-19)

- `components/AtlasTutorial.js`: every card now starts with `TUTORIAL MODE · N of 6`,
  included in the dialog description. Welcome adds the requested quick-tutorial
  sentence inside its existing scrollable text area.
- `app/journey/atlas.css`: the eyebrow uses navy 13px Montserrat SemiBold with
  .05em letter spacing and a small gold accent. Existing measured placement and
  constrained text scrolling account for the added content; motion is unchanged.
- `app/journey/page.js`: Guide and Settings now say `Replay tutorial`, including
  their button accessible names. The Skip note uses the exact requested wording.
  Existing internal identifiers/storage flags remain unchanged.
- Development browser checks: all six steps at 1280×720, plus Welcome at
  1920×1080, 1440×900, 950×700 and 640×500. All ten measured cases had readable
  labels, cards inside the viewport and no card/highlight intersections.
  Both replay entry points and the Skip note were checked in the accessibility
  tree. Replay from Settings opened Welcome correctly. No console errors.
- `npm run dev` detected the existing localhost:3000 project server, which was
  reused. Changed JavaScript passes ESLint; `git diff --check` passes.
- Measurements are saved outside the checkout at
  `C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/tutorial-label/checks.json`.
  The browser screenshot operation was unavailable for this tab; no screenshot
  was fabricated. The live development preview was left on the labeled Welcome
  card. Arbitrary window dimensions were not exhaustively tested.

## Changes

- components/AtlasTutorial.js: six measured-target tutorial steps, native modal background isolation, focus containment/restoration, keyboard navigation, adaptive card placement and spotlight cutouts. Reuses Card, Button and Localized.
- app/journey/page.js: first-time eligibility, automatic tour after notices, first-walk handoff, replayTour entry points, target attributes, camera preview, sampled-path traveling dot, Skip note and persistent Start hint.
- app/journey/atlas.css: tutorial card/rings, short CSS cues, flyover camera duration, Start pointer/ripple and reduced-motion alternatives. No width gates or existing responsive rules were removed.
- lib/browserStorage.js: registers careerCompassAtlasTourSeen with the existing journey keys for migration/reset.
- docs/local-storage.md and this report: persistence and verification details.

Earlier uncommitted dashboard work was preserved. No dependencies, audio files or image assets were added. Coordinates, ROAD, stop sizes, assessment/scoring logic, unlock order, badge earning and celebration contents are unchanged. The Journey Guide retains its previous content, with only Replay tour added; Settings receives the same button.

## Existing behavior checked first

Fog, padlock animation, the 1000ms first-walk hold and the 300ms arrival beat already existed; the tour uses the fog-specific wording. Previously, careerCompassJourneyGuideSeen controlled the automatic Guide, whose close callback wrote careerCompassAtlasFirstWalk=pending and the Basecamp position. The Guide now opens only manually, and closing it cannot arm a walk.

The intake success portal remains mounted through its closing transition. The tour waits for its removal and for any open celebration dialog. There is no separate Basecamp badge celebration in the current source; none was added. The existing profile success portal and Basecamp earned seal remain unchanged. Badge seals use a column in the tall desktop layout and a row in shorter/wider layouts, including the existing 900px-height landscape rule and smaller-window rules. Targets are found from elements, regardless of arrangement.

## Flags and flow

- careerCompassAtlasTourSeen: string true after first-time finish/Skip, or silently for existing assessment progress or an already pending/completed first walk. Steps and replay mode are never saved. Reloading an unfinished tour starts at step 1.
- careerCompassAtlasFirstWalk: existing pending/done marker, unchanged format. First-time finish/Skip writes pending before the tour-seen flag, then begins the hold. Existing reload recovery resumes that pending walk.
- careerCompassAtlasPosition: existing horizontal percentage, set to Basecamp when the tour arms the first walk. The existing coordinate aliases and walk sampling are retained.
- careerCompassAtlasUnlockSeen: unchanged per-stop live-animation flags, shared with fog. A normal replay never touches them or first-walk flags.
- careerCompassJourneyGuideSeen: retained for compatibility/manual Guide visits, no automatic popup behavior.

Restart clears the new tour flag through JOURNEY_KEYS and restores the fresh tour. Exit removes the tour flag alongside its existing Guide/first-walk clearing. If no assessment has started, Exit also clears unlock-animation flags so this intentional fresh introduction can unlock Mountains again. With assessment progress present, returning silently marks the tour seen and does not show it automatically.

Waiting for the tour, touring and the first hold keep the avatar at Basecamp, four fog groups/locks visible, and Start dimmed/disabled. After the hold, the disabled button shows Walking to The Mountains…. The 300ms arrival beat is retained; padlock/fog begin together. Start and its hint become available after the Mountains padlock completes. The longer fog fade can finish afterward, as before. The hint is derived from seen-tour/current-Mountains/no-assessment-started state, so it survives reload until Start is pressed.

Replay is available in Guide and Settings. It uses current Start/Continue/Results copy, ends with All set / Got it, restores the avatar's camera framing and does not move its saved position or arm a walk. If requested during walking/unlocking or a celebration, it waits for that sequence to settle, including the existing Full Expedition, rather than interrupting it. Replay never creates the first-time Skip note.

## Timings and accessibility

- Existing notice-completion guard: 400ms readiness delay plus waiting for portal/celebration removal.
- First hold: 1000ms, including reduced motion; existing walk: 2400ms, reduced-motion fade 200ms.
- Arrival beat: 300ms; existing padlock: 900ms, reduced motion 100ms; existing fog: 2000ms lift, reduced motion 300ms opacity only.
- Route camera: Forest, Valley, Islands, Basecamp at 1200ms intervals; existing strong camera easing. Leaving this step cancels timers and snaps home. During reduced motion, these hops jump without a transition.
- Pin bounce / lock wiggle: 300ms; badge opacity shimmer: 250ms with 120ms stagger; card entrance: 180ms; help rings: 1200ms per target; Start pointer/ripple: 2400ms loop.
- Skip note: 4000ms, pointer-events none. Reduced motion removes bounce, traveling dot, shimmer and pointer/ripple movement; highlight rings remain static.
- Native modal dialog makes the rest of the dashboard inert. Tab/Shift+Tab stay in the card, Left/Right change steps, Escape skips. The heading receives focus on each step, description changes use polite live text, and focus returns to the previously focused element. All measured tour button targets are at least 44px. Navy/parchment text contrast is 12.10:1, exceeding 4.5:1.

The camera and traveling dot reuse the existing coordinates/path. Route spotlight samples are cached per step; moving highlights are measured from actual elements. Card navigation stays in its current clear placement during a flyover whenever possible. In tighter windows the card narrows to fit beside the target, or constrains its height to the space above/below it; body text can scroll while navigation remains visible. The Skip note keeps clear of the main action even when it cannot remain centered. No sound behavior was added; existing lib/sound.js and SoundEffects continue to require a prior user gesture and Sound on.

## Live verification

- Fresh intake and repeated Restart workflows opened the tour after the success portal, without an automatic Guide. Four fog groups, Basecamp avatar and disabled Start were confirmed.
- All six steps were exercised with mouse and keyboard. Final checks covered 1920x1080, 1440x900, 1280x720 and 950x700: 24 step/size cases, zero card/highlight intersections, zero cards outside the viewport, minimum button dimension 44px. Both badge column and row layouts were measured. Resize tracking was checked throughout the tour.
- Additional final-source checks covered all six steps at 950x500 and 640x500. The combined 36 cases had no card/highlight intersections or offscreen cards, with a 44px minimum button dimension. Tab focus was visibly gold with a measured 3px outline.
- First-time Skip was exercised separately at all six steps. Each showed the note and armed the disabled Basecamp hold. Replay Skip was also exercised at all six steps: no note, no new walk, unchanged avatar position, and focus restored to Journey Guide.
- A full flyover returned to the same Basecamp transform, translate3d(0px,-55px,0px), at the 950x700 test viewport. A partial flyover Skip returned immediately: actual canvas x=0 and transition-duration=0s. During the tour, a drag gesture left the camera unchanged. Afterward, a 200px drag moved the camera by 200px; Locate Me restored its framing.
- Reload during an unfinished tour returned to step 1. Reload during the first hold and during an observed Walking to The Mountains… state resumed the pending walk. After arrival, reload restored the Start hint without replaying the unlock. Start opened the Mountains assessment and removed the hint. Hint boxes did not intersect stop circles, plates or the pin at any of the four sizes.
- Completed sample Mountains, Forest and Valley assessments. Existing progress suppressed the automatic tour. Replays from Guide and Settings worked in Mountains-ready, Mountains-done/Forest-ready and all-complete states; step 4 used Start, Continue and Results respectively. Full Expedition still opened after Islands unlocked, with its existing content. Replay ended with All set / Got it and preserved current position/progress.
- Exit/Home/Continue with no assessment started restored the fresh tour. Sound-on and sound-off replay interactions were exercised, then Sound was restored off; audible output was not independently verified.
- npm run dev was invoked and detected the existing project server on localhost:3000, which was reused. Changed JavaScript files pass ESLint without warnings. Full npm run lint has zero errors and four pre-existing anonymous-export warnings in lib/i18n. Existing storage migration/reset tests: 10 passed. git diff --check passed.
- Development hot refresh emitted dependency-array warnings while hook code was being edited. A clean reload and the final full tour checks produced no new console errors.

## Evidence and limits

Evidence folder outside the source checkout:
C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-tutorial/

- step-1-1920.png through step-6-1920.png; the same six files with -1440, -1280 and -950 suffixes (24 screenshots).
- start-hint-1920.png, start-hint-1440.png, start-hint-1280.png, start-hint-950.png.
- skip-note.png, replay-continue.png, replay-results.png.
- preview.png: the current browser-panel preview, left on first-time step 1 with the disposable Atlas tour test profile. Its 399x895 card also measured clear of its target, with 44px buttons.
- verification.json: measured placements, button dimensions, hint intersections and Skip/replay results.
- final-responsive-checks.json: all 36 final-source step/size checks, including the two additional short windows.

Screenshot cropping removes only unused host margins outside the CSS viewport. Reduced-motion behavior was checked in source, not live-emulated: the available browser tools do not expose that preference. Every state was not repeated in every possible viewport, and screen-reader speech/audio playback was not independently measured. The requested four-size geometry, badge-layout checks and two additional short-window checks passed; smaller mobile windows and extreme short windows were not exhaustively tested.
