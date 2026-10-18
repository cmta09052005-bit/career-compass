# Atlas size and first-walk follow-up

## Changes

- `app/journey/atlas.css`: desktop main-action disc is 121px instead of 88px
  (+37.5%); label is 18px instead of 13px (+38.5%), using the existing Montserrat
  SemiBold variable. Button width is 220px instead of 160px, and icon padding is
  21px instead of 15px. Left/bottom placement and gold pulse are unchanged.
- `app/journey/page.js`: the automatically opened first desktop Guide starts a
  walk-only Basecamp-to-Mountains transition after closing. All existing Guide
  dismissal routes share the handler. A close guard prevents repeated dismissal
  from cancelling or duplicating the transition. No assessment or next-assessment
  preview opens at arrival. Start then enters Mountains directly.
- `lib/browserStorage.js`: registers the new flag with the journey keys so Restart
  and existing migration/reset handling include it.
- This report.

## Size check

The stop-circle reduction was already applied in Phase 1: the existing clamp is
`clamp(7.875rem,9vw,8.4rem)`, giving 126px at 1280px wide, 129.6px at 1440px,
and 134.4px at 1920px. The 1920px value is already about 19% below the requested
165px reference. These sizes and their icons, numbers, marks, glow, nameplate
gap and pin offsets are unchanged. The pin remains 64px. Only the main-action
portion of Part A needed implementation.

## First-walk persistence

Flag: `careerCompassAtlasFirstWalk`.

- `pending` is saved before closing the first Guide, together with the existing
  Basecamp position value `8` in `careerCompassAtlasPosition`.
- The existing walk animation is started with `first: true`, without `enter`.
- Existing action readiness disables assessment entry and duplicate walking.
- Arrival saves the existing Mountains position `36` and marks the flag `done`.
- On reload with no assessment started, `pending` recovers the same segment
  from Basecamp and finishes it; `done` restores the token at Mountains.
- Reopening the Guide from its button does not arm a new walk.
- Restart removes the flag with all registered journey keys.
- Per the user's clarification, Exit removes this flag and
  `careerCompassJourneyGuideSeen` while preserving progress and celebration flags.

The first-visit Guide still opens in `showWelcome()` after intake's portal leaves.
Its Got it, X, native Escape and backdrop routes all call `closePanel()`. Its
content and existing sound behavior remain unchanged. Automatic first-walk
eligibility and restoration are scoped to desktop widths above 48rem; existing
small-screen-only styles were not edited. The existing 2400ms walk and 200ms
reduced-motion branch, trail sampling, camera/Locate Me logic and coordinates are
unchanged.

## Verification

- Fresh desktop runs through Restart and intake: Got it, X and Escape each
  started a walk and stopped at Mountains with Start enabled; no assessment or
  next-assessment dialog opened automatically.
- Clicking Mountains during the initial walk did not enter an assessment or
  start another walk. Main action and popover entry were disabled.
- Reload during a confirmed walk resumed it; arrival showed token position 36%,
  enabled Start, and no open dialog. Reload after arrival retained Mountains.
- Reopening and closing Guide after arrival retained Mountains without a walk.
- Pressing Start after arrival opened the existing Mountains briefing directly.
- Exit and return preserved intake progress and allowed the first Guide again.
- Restart replayed the first Guide and walk on fresh test runs.
- Measured actual desktop viewports of 1280x720, 1440x900 and 1920x1080. Circle
  centers matched their coordinates to less than 0.03 CSS pixels; pointer contact
  error was below 0.01px. Main action was 121px at all three sizes and its label
  bottom stayed 24px above the screen edge. It did not overlap the badge column.
- Browser console: no errors during the verified flows.
- ESLint: zero errors and the same five pre-existing warnings. Existing browser
  storage tests: 10 passed, including reset clearing all registered journey keys.
- `npm run dev` was invoked; an existing server already owned the project on
  port 3000, so verification reused that server.

## Limits and deliberately unchanged behavior

- The connected browser exposes viewport controls but no reduced-motion media
  emulation. The 200ms branch is reused unchanged and was reviewed in source,
  but a live reduced-motion run could not be performed.
- A pre-existing collision is visible at 1280x720 with Mountains centered:
  the fixed Drag to explore hint can overlap Valley's nameplate. The fixed
  browser-save reminder can also cover Forest's off-current nameplate in that
  framing. Other off-current stops can be clipped by the viewport while panning.
  Neither coordinates nor fixed overlay placement were changed: Part A permits
  sizes and size-dependent spacing only, and Locate Me is explicitly protected.
  The current Mountains pin, circle, number and nameplate remain separated from
  the HUD, utility buttons and larger Start action.
- Sound settings and dialog sound paths were preserved; no new walk sound was
  invented. Guide backdrop dismissal uses the same handler, but the three
  separate fresh-run tests exercised Got it, X and Escape specifically.
