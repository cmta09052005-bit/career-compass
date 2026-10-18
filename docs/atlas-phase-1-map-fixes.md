# Atlas Phase 1 map fixes

Implemented October 18, 2026, with the confirmed Step 0 decisions.

## Changed files

- `app/journey/page.js`: status marks, pin wrapper and tooltip, one main action,
  assessment wording, badge Next lines and locked badge tooltips.
- `app/journey/atlas.css`: desktop circle anchoring, larger circles, number badges,
  solid nameplates, status marks and pin styling; small badge Next text.
- `public/icons/career-compass/stop-padlock.svg`: custom navy/gold lock.
- `public/icons/career-compass/stop-check.svg`: custom navy/gold completion mark.
- This report.

## Step 0 findings and final decisions

### 0a: implementation locations

All dashboard behavior is in `app/journey/page.js`, styled by
`app/journey/atlas.css`:

- Dashboard: `JourneyPage`.
- World/camera: `mapWindow`, `mapLayer`, `camera`, `panStart`, `panMove`, `panEnd`.
- Trail: `ROAD`, the SVG `.atlas-trail`, and the `trail` ref.
- Stops: `BASECAMP`, `REGIONS`, `ISLANDS`, `.atlas-region-art`, `LocationCard`.
- Token: `Explorer`, `.atlas-you.atlas-token`, now containing `.atlas-pin`.
- Main actions: `.atlas-actions`; the separate locked Results action was removed.
- HUD/progress: `.atlas-profile-cluster`, `.atlas-nameplate`, `.atlas-checkpoints`.
- Badge column: `.atlas-badges` and `checkpoints`.
- Badge detail dialog: `BADGE_DETAILS`, `badgeDetail`, shared native dialog/Card.
- Popover: `hoverNode`, `hoverEvents`, `.atlas-popover`.
- Locate Me: `locate()` delegates to `centerOnNode()`.
- Auto-walk: layout effect driven by `walking`, using SVG length sampling and
  Web Animations.

### 0b: positions and walking

Coordinates remain hand-maintained percentages: Basecamp (8,52), Mountains
(36,44), Forest (50,65), Valley (62,55), Islands (88,63). Each is already a
segment endpoint on the 1000x1000 SVG trail. No coordinates, path data, artwork,
stored position values, recovery logic, walk timing, or Locate Me logic changed.
Desktop marker boxes now have the same height as their circle, with their
center anchored directly to those coordinates. Nameplates sit outside the box.
The zero-sized token anchor stays at the same coordinates during walking; its
pin is positioned above the circle, with the pointer touching its top.

Walking still samples 1,001 trail points to locate each endpoint and adjusts
animation endpoints to the existing node coordinates. Locate Me retains its
existing camera clamping and vertical framing offset.

### 0c and 0d: icons and badges

Map and badge-column center artwork use the same existing files:

- Basecamp / Basecamp: `explorer-backpack.svg`.
- Mountains / Wayfinder: `mountain-peak.svg`.
- Forest / Skillcrafter: `pine-branch.svg`.
- Valley / Scholar: `ribbon-scroll.svg`.
- Islands / Full Expedition: `island-flag.svg`.

The badge column additionally uses `wax-seal-frame.svg`. The Full Expedition
celebration retains `sunburst.svg`. All these files are under
`public/icons/career-compass/`.

### 0e: original strings

The desktop primary labels were `Start Assessment`, `Continue`, and
`Walking to [stop name]…`. The separate Results labels were `Results locked`,
`View My Results`, and `Walking to The Islands…`.

Original eyebrows: `YOUR STARTING POINT`, `REGION 01 · Interests`,
`REGION 02 · Skills`, `REGION 03 · Academics`, `BEYOND THE THREE REGIONS`.
The avatar label was `You are here`, rendered uppercase through CSS.

Badge dialogs used the computed status, badge title, description, and the
single `Back to The Atlas` action. Basecamp description:
`Your explorer profile is complete and your journey has begun.`
Full Expedition description: `You mapped every region and reached The Islands.`

Correction to the initial Step 0 report: the three assessment badge descriptions
actually rendered are the stop descriptions, because `badgeStop` overrides
`BADGE_DETAILS` during object merging:

- Wayfinder: `Discover what pulls you forward.`
- Skillcrafter: `Find strength in what you can do.`
- Scholar: `What you've already built matters too.`

Those descriptions are preserved. The initially reported achievement sentences
exist in `BADGE_DETAILS` but are overridden in these dialogs.

### 0f: status assets

There were no existing lock/check SVG files in the icon directory. The previous
Results button used an inline lock. The new files reuse the navy/gold engraved
style and have accessible `Locked` / `Completed` names at their rendered wrapper.

### 0g: resolved constraints and limits

- First Guide dismissal still leaves the token at Basecamp. Start or the ready
  stop triggers the existing walk into the assessment.
- Continue still means any assessment has started, including an unfinished one.
- The pin covers the six built-in explorers; Random still resolves during intake.
  No upload path was added. The HUD portrait remains circular.
- Journey Guide content is unchanged. Internal variable/class names containing
  `region` remain unchanged; map wording outside the Guide uses assessment.
- The existing progress bar already had no visible label and is untouched.
- No tutorial, Guide redesign, scoring, earning/unlock changes, dependencies,
  artwork changes, or new storage format were introduced.

## Every changed or added UI string

- `Start Assessment` becomes `Start`.
- The primary action's `View My Results` visible label becomes `Results`;
  its accessible name remains `View My Results`.
- `Continue` and `Walking to [stop name]…` remain. Walking status now also
  appears on the shared small-screen action label.
- Removed separate `Results locked` action and its accessible name
  `Results locked, complete all three regions`.
- Added main-action accessible names `Start your assessment` and
  `Continue your assessment`.
- Removed `You are here`.
- Added pin tooltips: `This is you. Press Start to begin.`,
  `This is you. Press Continue to keep going.`,
  `This is you. Press Results to see your paths.`
- Added status accessible names `Locked` and `Completed`.
- `REGION 01 · Interests` becomes `ASSESSMENT 1 OF 3 · INTERESTS`.
- `REGION 02 · Skills` becomes `ASSESSMENT 2 OF 3 · SKILLS`.
- `REGION 03 · Academics` becomes `ASSESSMENT 3 OF 3 · ACADEMICS`.
- `BEYOND THE THREE REGIONS` becomes `BEYOND THE THREE ASSESSMENTS`.
- `Close region details` becomes `Close assessment details`.
- `NEXT REGION UNLOCKED` becomes `NEXT ASSESSMENT UNLOCKED`.
- `YOUR REGIONS` becomes `YOUR ASSESSMENTS`.
- `Enter Region` becomes `Enter Assessment`.
- `All regions complete. Results unlocked.` becomes
  `All assessments complete. Results unlocked.`
- `[stop name] is your next region.` becomes
  `[stop name] is your next assessment.`
- Full Expedition celebration description: `All three regions explored. Your
  path is ready.` becomes `All three assessments completed. Your path is ready.`
  Its behavior and `View My Results` action are unchanged.
- Full Expedition badge description: `You mapped every region and reached The
  Islands.` becomes `You completed all three assessments and reached The Islands.`
- Added badge dialog lines: `Next: The Mountains`, `Next: The Forest`,
  `Next: The Valley`, `Next: The Islands`, respectively for Basecamp, Wayfinder,
  Skillcrafter, Scholar. Full Expedition has no Next line.
- Unearned badge hover text changes from the stop name to `Finish The Mountains
  to earn this.`, `Finish The Forest to earn this.`, or `Finish The Valley to
  earn this.` Full Expedition uses `Finish all three assessments to earn this.`
  The generic Basecamp fallback is `Finish Basecamp to earn this.`; a valid
  intake already earns Basecamp.

## Verification

- `npm run lint`: zero errors, five existing warnings (one unused image-rule
  suppression in the dashboard and four anonymous i18n default exports).
- `git diff --check`: no whitespace errors.
- `npm run dev`: running successfully; browser console captured no errors
  throughout the completed assessment flow.
- Desktop CSS viewports confirmed as 1280x720, 1440x900 and 1920x1080. The browser
  viewport control required compensating for its 125% scaling; actual document
  dimensions were read back before accepting the checks.
- Initial state observed: Basecamp pin/check, glowing Mountains, three locks,
  one Start button. Start walked into the Mountains assessment.
- Completed all eight Interests responses, ten Skills statements, and Academic
  input through the UI. Observed sequential badge celebrations and walks.
- After Mountains: Mountains check, glowing Forest with pin, Continue button,
  and Wayfinder dialog `Next: The Forest`.
- Pin pointer tip matched the circle's top within rounding precision. Clicking
  the pin left the page unchanged and displayed the mouse-hover tooltip.
- All five circle centers matched their percentage coordinates with less than
  0.03 CSS pixels of rounding error in measured layouts. No stop required moving.
- Locate Me centered the current stop with its existing framing offset. Layout
  screenshots showed separated pins, circles, numbers, nameplates, HUD and
  utility controls at the three requested sizes.
- Reload restored completed progress and the next-stop token. A precisely timed
  interruption during an in-flight walk was not conclusively exercised.
- Final state: a single Results action, glowing Islands with pin, four checks,
  zero padlocks, no check on Islands. Full Expedition badge shows the new
  description, no Next line, and one Back action.
- Results opened the existing processing screen, `Charting Your Course`.
- Reduced-motion runtime emulation was unavailable through the connected
  browser. Source review confirms no new decorative animation and preserves
  the existing reduced-motion CSS and 200ms reduced walk branch.

## Shared-screen effects

Desktop geometry, pin styling, hover tooltip and status marks apply above 48rem.
No existing small-screen-only styles were edited. Shared JSX changes remove the
avatar label and extra Results action and apply action labels, badge text and
assessment wording on every screen size. The portrait wrapper is shared, while
the small-screen portrait keeps its existing circular styling. Pin drag-start
exclusion is shared but only desktop pins receive pointer events. Coordinates,
assessment flow, camera behavior, saved progress, and badge earning remain shared
and unchanged.
