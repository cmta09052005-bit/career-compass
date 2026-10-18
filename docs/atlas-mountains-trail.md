# Mountains trail correction

## Scope and coordinates

Application changes are confined to five lines in `app/journey/page.js`: ROAD, the Mountains coordinate record, legacy saved-position matching, and the two coordinate fallbacks. This report is the only additional source-checkout file for this task. Earlier dashboard changes remain intact.

Mountains moved from `(36%, 44%)` to `(34.91901780963409%, 40.07136903095268%)`. The new center is exactly on the corrected cubic at parameter `0.7691558304672076`. It is the closest point on the corrected stretch in the artwork's native 1774 × 887 pixel space, a move of approximately 39.775 native pixels. Basecamp, Forest, Valley and Islands are unchanged.

The live dashboard uses `public/atlas-journey-v3.png`, rather than the task's named `public/atlas-map-v2.webp`. Alignment was checked against the displayed artwork. Both image files are unchanged, verified by hashes.

## Path data

The two old cubics, starting at `(250,565)`, were:

```text
C300 565 300 430 360 440
C435 420 410 655 500 650
```

Their replacement is:

```text
C275 565 287.5 531.25 301.25 498.75
C315 466.25 340 390 368 390
C430 390 405 675 465 675
C480 675 487.19463086 650.0786937 497.19463086 650.0786937
C498.1171675 650.0786937 499.05220684 650.05265518 500 650
```

The first replacement cubic is an exact subdivision of the old incoming curve. The last is the retained tail of the outgoing curve, rounded to eight decimal places. Actual rerouting begins at `(301.25,498.75)` and rejoins at `(497.19463086,650.0786937)`. Tangent directions match at both joins and between the new cubics. All other trail geometry is unchanged. Dot size, spacing, color and layering are unchanged.

The line follows the sandy saddle above the rocky shoulder, then bends around the rock mass toward Forest. It does not follow the river. The centerline is visually estimated in the broad, faint upper saddle near `(36.8%,39%)` and the lower turn near `(46.5%,67.5%)`, where the painted wash does not define a sharp center.

## Coordinate consumers and saved progress

The existing REGIONS record continues to drive the node, pin, plate, badge, marks, unlock visuals, popover anchoring, walk endpoints and Locate Me. The fallback token position now reads that record as well.

Recovery accepts both the new Mountains horizontal value and the legacy value `36` as Mountains. Storage keys and formats are unchanged; arrival saves the current coordinate through the existing code. Reload during the initial Basecamp walk uses its existing pending marker. Reload during Mountains-to-Forest walking accepts the old saved Mountains value and resumes toward Forest. No walking, assessment, unlock, celebration or Guide logic changed.

## Verification

- Ready and done states: 1920×1080, 1440×900, 1280×720 and 1024×768, each at 100%, 125% and 150% CSS viewport equivalents: 24 layouts total, no measured collisions between stop circles/plates/current pin and fixed controls. Maximum circle-center rounding error was under 0.016 CSS px; pin-pointer error under 0.008 CSS px.
- Background and SVG share the same full canvas rectangle at every tested layout. The SVG uses `0 0 1000 1000` with `preserveAspectRatio="none"`; the background uses `100% 100%`. Their common affine scaling preserves the inspected road alignment on resize. The other stops retained their original percentages.
- Legacy saved Mountains position restored at the new center without unlock replay. Reload during the outbound walk recovered from legacy `36` and reached Forest.
- Fresh Guide close started the Basecamp walk. Reload mid-walk recovered, arrived at Mountains, displayed the opening padlock, then removed its pending/dimmed state. Reload after arrival and Locate Me kept the corrected center without replay. At 1280×720 the final Locate Me check had no collisions.
- Ten geometry/scope checks passed, including retained curves, tangent joins, nearest point, unchanged other stops/artwork and legacy recovery.
- Targeted ESLint for page.js passed cleanly. Full lint had no errors and four existing anonymous-default-export warnings in the translation files. `git diff --check` passed. No browser console errors were captured. The existing development server was used after the requested dev command detected it already running.

Limitations: 125%/150% testing used equivalent CSS viewport sizes, with up to one pixel of viewport rounding; actual browser zoom control was unavailable. Walk/reload interactions were tested at representative sizes, rather than replayed at every matrix entry. Road-center alignment is a visual judgment, especially at the two faint painted areas described above.

## Evidence outside the checkout

Folder: `C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-mountains-trail/`

- `before-mountains.png`: artwork with old dotted trail, Basecamp-to-Forest context.
- `after-mountains.png`: same crop with corrected dotted trail.
- `before-full.png` and `after-full.png`: full artwork overlays.
- `after-browser.png`: live Mountains-ready map after reload and Locate Me.
- `geometry.json`, `geometry-verification.json`, `browser-verification.json`: exact geometry and recorded checks.

No dependencies were added. Neither background was edited or regenerated.
