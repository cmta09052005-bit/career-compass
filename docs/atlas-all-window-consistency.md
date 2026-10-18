# Atlas consistency at every window size

## Files changed in this pass

- app/journey/atlas.css: shared map geometry, viewport scaling, control clearance, hint fade, and focus-safe clipping.
- app/journey/page.js: remove first-walk/unlock width checks, dismiss the hint, keep camera framing clear of controls, and refresh walk keyframes on map resize without restarting the walk.
- This report. Earlier Phase 1/follow-up edits and their storage keys/assets remain in place. No dependencies were added.

## Check-first findings

The circle/number/plate/pin/status styling was inside a min-width:48.001rem query. Separate queries gated the pin tooltip, unlock/glow styling, and reduced-motion unlock override. JavaScript restricted first-walk restoration/arming and arrival unlock to the same desktop width. The single action, assessment wording, badge Next lines, locked badge tooltip text, and circular HUD portrait were already shared. Existing compact action rules also had a fixed minimum width that conflicted with scaling.

## Breakpoints and media queries

- Removed the min-width:48.001rem wrapper around the Phase 1 circle, number, status-mark, plate, pin, and main-action treatment. These now apply unconditionally.
- Removed the separate min-width:48.001rem wrapper around ready glow, pending dimming, and lock-opening styles.
- Changed min-width:48.001rem + hover:hover + pointer:fine to hover:hover + pointer:fine. Tooltip availability now follows pointer capabilities alone.
- Changed min-width:48.001rem + prefers-reduced-motion:reduce to prefers-reduced-motion:reduce. The movement-free unlock variant now applies at every width.
- Added a prefers-reduced-motion:reduce override to make hint dismissal instant.
- Added max-height:56.25rem (900px at the default root size) + landscape to use the existing horizontal badge arrangement at shorter heights; this prevents off-current stops being covered by the tall badge column. Earlier 500px landscape rules remain intact.
- Added max-height:31.25rem (500px at the default root size) to hide the saved-progress reminder in short windows, extending its existing narrow-window hide behavior. Otherwise the reminder sits in the clear top area between HUD and utility controls.
- All other original media queries remain, including compact HUD/utility treatment, Guide typography, session visibility at max-width:48rem, and small-screen action positioning. Shared map-specific size rules override the old fixed action dimensions/minimum width.
- Removed the JavaScript desktop matchMedia checks and their dependent desktop conditions from first-walk restore, pending visual state, first Guide arming, and arrival unlock. Reduced-motion checks remain.

## Sizing and placement

Start uses clamp(56px,14vmin,121px), where vmin is the smaller viewport dimension. The existing --atlas-stop-size is 80% of --atlas-start-size. All five stops share it. Pin, pointer, icon padding, numbers, corner marks, plate padding/type, and glow derive from the same scale. Start ranges from 56 to 121px, circles from 44.8 to 96.8px, and the pin from about 29.6 to 64px. At 1280x500, Start is 70px and circles are 56px.

Circle centers and the trail coordinates are unchanged. Nameplates remain solid parchment. The pin pointer stays attached to the circle top; the HUD portrait retains its 50% radius. The action stays bottom-left, with a narrower layout box and a responsive left inset to clear the partly clipped Basecamp stop. Walking labels can wrap within the existing action.

Normal camera framing is retained when clear. When fixed controls would cover a circle, plate, or the current pin, the camera chooses a nearby vertical framing within the same drag limits. This changes only the view, not stop coordinates, route geometry, token endpoints, or saved position values. Visible hint bounds are included in the clearance check. The hint fades after the first drag or four idle map seconds; reduced motion removes the fade transition. Off-current stops still clip at the edges of the existing draggable world; the current stop remains visible.

The viewport uses overflow:clip rather than overflow:hidden. This prevents keyboard focus on an offscreen stop from scrolling the hidden viewport independently of the camera. Dragging remains camera-driven. A walk ResizeObserver refreshes the same sampled transform keyframes when the world changes size, retaining the existing duration and current animation time.

## Verification

Test sizes: 1920x1080, 1600x900, 1440x900, 1366x768, 1280x720, 1024x768, 900x600, 1366x600, and 1280x500. Each was also tested at layout dimensions equivalent to 125% and 150% zoom (27 configurations per sweep). The browser override rounds some targets by approximately one CSS pixel; actual document dimensions were recorded. It required compensation for its own display scaling.

- Mountains-ready, Forest-ready, Valley-ready, and Islands-ready: 27 layouts each, no detected overlaps between circles/plates/current pin and fixed controls after the fixes. Circles remain smaller than Start in every case. Maximum measured circle-center error was below 0.015px; pointer-contact error below 0.011px.
- Guide, Settings with Sound on, Restart confirmation, earned badge dialog, locked badge dialog, and Full Expedition: all fitted inside the 27 layouts. Long dialog content retains existing scrolling. These dialogs intentionally overlay the map.
- Stop popovers: keyboard-opened at all 27 layouts; all fitted. Native viewport scroll offsets remained zero after the clipping fix.
- Fresh first walk and reload during that walk were exercised. Mountains arrived, unlocked, and glowed. Later reload and Locate Me checks did not replay the unlock.
- Completed sample Interests, Skills, and Academic assessments through the UI. Forest and Valley unlocked on arrival before their next-assessment preview. Continue and the walking destination labels were observed.
- A fresh journey after the approved Restart confirmed Scholar -> walk to Islands -> 900ms lock opening -> Unlocked announcement/ready state -> Full Expedition. The celebration did not appear during the walk or opening animation. Its content and duration were unchanged. Results subsequently opened the existing processing/results flow.
- Restart was exercised through the existing confirmation and fresh intake. A final replay began at 600x400, below the removed gate. During that walk the window changed to 1920x1080, then 1280x500; the token arrived at Mountains and unlocked correctly. The disposable test journey is left at Mountains with no assessment answers.
- The pin tooltip appeared at 600x400 on mouse interaction; clicking the pin did not navigate. HUD portrait radius remained 50%. Locked Forest badge text was verified as Finish The Forest to earn this.
- First drag dismissed the hint. Locate Me returned to the current stop with zero detected collisions and no unlock replay. Initial 600x400 Basecamp framing and 1280x500 Mountains framing with the hint still visible were also checked with no detected control collisions.
- Sound on/off settings were exercised with no console errors; existing unlock audio/helper were reused. Audibility was not independently measured.
- Browser console: no errors during the completed test flows. npm run dev was invoked; the existing project server at localhost:3000 was reused. A temporary separate-port isolation attempt timed out and was removed.
- Existing browser-storage tests: 10 passed. ESLint: zero errors, four existing anonymous-default-export warnings in lib/i18n files; the unused dashboard suppression was removed. git diff --check: no whitespace errors.

## Limits

Actual browser zoom controls and prefers-reduced-motion emulation are not exposed by this browser connection. Zoom-equivalent CSS layouts were tested; actual 125%/150% browser zoom and a live reduced-motion run were not. Source review confirms reduced walks use the existing 200ms fade, unlocks use 100ms opacity only, shackle/shine movement is disabled, and hint dismissal is instant.

The four ready states and the listed dialogs/popovers were swept across all 27 configurations. Full live animation/sound/reload permutations were exercised at representative sizes, not repeated for every cell of that cross-product. No known persistent control/stop collision remains in the measured layouts. Mouse-hover behavior was exercised at a narrow size; every hover target was not separately hovered at every configuration.

Screenshot: C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-consistency/atlas-1280x500.jpg
Raw measurements: C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-consistency/layout-results.json (local verification artifacts kept outside the source checkout).
