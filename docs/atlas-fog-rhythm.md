# Atlas fog and arrival rhythm

Changed for this task: app/journey/page.js, app/journey/atlas.css, public/atlas-fog-a.webp, public/atlas-fog-b.webp, and this report. Earlier uncommitted changes were retained. No dependencies were added.

## Implementation

The live artwork is public/atlas-journey-v3.png. Artwork, SVG and stop percentages share the full stretched map canvas. Fog is in the same world, above artwork and below trail (now z-index 2), markers and token; HUD remains above these. Fog ignores pointer events.

FOG_ZONES uses percentage bounds (left, top, width, height): Mountains (15,3,29,59), Forest (40,12,22,68), Valley (56,4,23,78), Islands (76,8,24,83). These are feathered envelopes, not hard clipping boundaries. Sprite transparency and an elliptical CSS alpha mask soften the edges; a second radial alpha mask thins fog within 0.6 stop diameters of each stop. Basecamp has no group. The two procedural parchment sprites are 640x512: a is 28,970 bytes; b is 28,820 bytes. Both decode as RGBA with genuine alpha ranges 0–212 and 0–210. No runtime blur or SVG filters were added.

Fog uses the same regionState/pendingStop presentation as padlocks. Arrival still writes careerCompassAtlasUnlockSeen before displaying the live moment. No extra persisted flag was introduced. Unlocked loaded regions never mount fog; liftingFog and arrival are transient only. Restart clears the existing journey flags and restores locked fog.

First Guide close retains the shared 200ms closing animation and callback. Every dismissal route shares closePanel. Its callback starts a 1000ms Basecamp hold, with the existing disabled Walking to The Mountains… action. Pending-first-walk recovery also restores that hold. During the hold the existing camera framing targets Basecamp, then targets Mountains when walking begins. Walk geometry and duration remain unchanged (2400ms, reduced motion 200ms). Every new unlock waits 300ms after arrival, then starts the existing padlock and fog lift together. Full Expedition still waits for the padlock to finish, without waiting for the longer fog fade or altering the celebration.

Fog uses two transform-only drift layers, 70s and 90s, with alternating direction; group opacity is capped at .78. Lift is 2000ms strong ease-out, opacity to zero, scale 1 to 1.12 and 3% upward displacement. Reduced motion has no drift or movement, only a 300ms opacity fade. Drift pauses on visibilitychange and during map dragging. At most four groups/eight sprites exist, and cleared groups are removed after their lift.

## Verification

- Used the actual UI to restart the disposable Atlas test profile, close the first Guide with Got it, walk to Mountains, complete all three sample assessments, reach Islands, and open Full Expedition. Mountains/Forest/Valley cleared sequentially, with only Islands fog remaining before the last assessment. Full Expedition appeared after the padlock had finished while the tail of the 2-second Islands fade was still running, as intended.
- Replayed Restart and closed the first Guide with Escape; reloaded immediately during the pending hold. It resumed the disabled first walk. DOM samples showed a stationary Basecamp token during the hold; arrival was first observed at 4133ms, still locked at 4306ms, then padlock opening and fog lifting together at 4490ms. Samples are around 170–190ms apart with one larger automation gap, so these observations verify ordering rather than precise browser timing. The source defines the exact 1000/300ms waits.
- Reload after Mountains and Valley arrival and after all complete retained clear unlocked regions. Locate Me did not restart lifting. A reload at every possible animation frame, including mid-walk and mid-lift, was not exhaustively exercised.
- At actual CSS viewports 1920x1080, 1440x900, 1280x720 and 950x700, checked Mountains-ready with three fog groups and all-complete with zero groups. Measured visible circle/plate/pin intersections with fixed HUD, badges, utility controls, main action and saved note: none in Mountains-ready. Stop diameter / Start diameter: 96.797/121, 96.797/121, 80.625/100.797, 78.391/98px. Maximum circle-center rounding error across the four sizes: 0.01475px. No coordinate, stop sizing or trail path changes.
- Narrow-window drag with three fog groups/six sprites: a 200px gesture moved the camera exactly 200px when unclamped. Two browser gesture calls took 416ms and 441ms including automation delivery, with the first correctly clamped at the world edge. These are gesture round-trip measurements, not FPS or paint profiling. Browser tooling did not expose a frame profiler; smoothness under sustained GPU load is not certified. Drift is proactively paused during dragging.
- Browser error log empty after the full journey and responsive checks. npm run dev invoked; detected and reused the existing server on localhost:3000. Targeted dashboard ESLint clean. Full npm run lint: zero errors, four pre-existing anonymous-export warnings in lib/i18n. git diff --check passed.
- Reduced motion was verified in source; the available browser controls cannot emulate it. Hidden-tab pause and audible sound were not live verified. Existing playSound unlock and sound preferences were retained. Backdrop dismissal shares the verified close handler but was not separately replayed. Full fresh-to-complete sequences were not repeated at every viewport.

## Evidence outside the checkout

Folder: C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-fog-rhythm/

- all-four-foggy.png: initial hold, all four groups mounted (distant regions are outside the current camera).
- mountains-clear.png and mountains-clear-1920.png, -1440.png, -1280.png, -950.png.
- all-clear.png and all-clear-1920.png, -1440.png, -1280.png, -950.png.
- fog-zone-outlines.png: soft-zone envelopes over the full original artwork, for coverage review.
- replay-timing.json: actual DOM samples from pending-hold reload through unlock.
- geometry.json: actual viewport, size and collision measurements.

Screenshots remove only unused browser-host margins outside the CSS viewport. UI pixels are unchanged.
