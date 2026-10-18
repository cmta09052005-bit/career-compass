# Atlas visual polish

## Changed files and scope

- [app/journey/atlas.css](C:/Users/Charlene/OneDrive/Desktop/career-compass/app/journey/atlas.css): map-only visual treatment, typography, borders, shadows, visual states and reduced-motion overrides.
- [app/journey/page.js](C:/Users/Charlene/OneDrive/Desktop/career-compass/app/journey/page.js): a decorative, aria-hidden PinFrame SVG inside the existing non-clickable pin.
- This report: `docs/atlas-ui-polish.md`.

The saved pre-task source was compared against the result. Removing PinFrame and its one render insertion makes page.js identical to its previous version. ROAD, stop coordinates, walk logic, assessment/scoring, unlock and badge logic, padlock animation, celebration code and Guide content are unchanged. No dependency, font import, audio file, illustrated icon or background artwork changed. Existing responsive rules remain intact; no width gate was added or removed.

All newly specified colors use navy #1B2A4A, gold #D4A017, teal #2DBFB8 and parchment #F5ECD7, including alpha/color-mix derivatives. Existing illustration colors and the specifically protected dot color #FFF0CE remain untouched. A faint navy under-shadow was used instead of introducing an unapproved brown.

## Check-first findings

The shared map geometry and pin/circle/number/mark/plate styling is in the final shared section of atlas.css. Earlier utility, badge-seal and saved-note rules are in the same file; page.js supplies the markup and inline padlock artwork. The SVG trail uses ROAD from page.js, with its stroke/dash/layering in atlas.css. Fonts already resolve to Poppins 700 headings, Inter body and Montserrat 600 labels through existing font variables.

Gold alone was a weak boundary on the sandy road: sampled pin and circle edges reached approximately 1:1. Plate text was already 12.10:1 and mark gold/navy 5.99:1. Note text passed 4.5:1 but was only 11px; utility labels were only 10px.

## Applied review

| Area | Before | After | Why |
|---|---|---|---|
| Pin | Separate gold rectangle and triangle | One continuous SVG silhouette, navy outer stroke about 3px, gold inner stroke about 2px, parchment hairline, plus a fine outer parchment keyline | Keeps the pointer seam-free and visible over light paint and dark ink |
| Pin depth | Little separation | Static 0 6px 14px navy shadow at about 35% opacity | Lifts the portrait without adding hover behavior |
| Pointer | 20px wide / 10px protrusion at full scale | Nominal 28px / 14px, tied to the same scale and stop-top contact | Approximately 40% larger; pin body width remains unchanged |
| Circles | Thin gold edge | Navy outline, inset gold ring and parchment keyline; calm paper fill for done, tinted fill/dimmed icon for locked | Consistent separation from engraved terrain |
| Ready | Soft static glow | Stronger inset gold ring and gentle opacity-only halo pulse | Clear second focal point after the larger main action; static with reduced motion |
| Number/marks | Tiny numerals and corner marks | 13–14px Montserrat 600 numerals; status containers 41/32 = 28.125% larger with navy/gold discs | Readable status without changing circle centers or plate positions |
| Seals | Weak earned/unearned distinction | Seal artwork 8% larger inside unchanged 44px targets; dimmed unearned art, calm gold glow when earned | Clear achievement state with no badge logic change |
| Labels/note | Small translucent labels | Utility labels 14px, main label at least 14px, note 13px with opaque surfaces | Readability and stable text contrast |
| Plates/popovers | Pale edges and mixed brown surfaces | Navy-tinted plate edge/shadow; parchment/navy/gold popup surfaces; dashed paper treatment for disabled locked action | Keeps state clarity and visual language consistent without changing content or boxes |
| Nickname | Light text over variable engraving | Navy backing within its existing bounds | Removes dependence on the background texture |
| Interaction | Inconsistent rings and pressed feedback | Gold 3px focus rings with navy backing, short 180ms transitions, hover and pressed treatments | Visible on light and dark surfaces; no new actions |

The number disc has a tiny scale-dependent inward inset only below 75% of the existing UI scale. This keeps the larger 13px numerals clear of the existing plate at very small widths, without moving any stop, plate or fixed control. It is inactive at the four requested sizes.

## Contrast measurements

| Measurement | Before | After | Notes |
|---|---|---|---|
| Pin outline, gold → navy/parchment keyline | 1.00:1 min / 1.29:1 median | 3.49:1 min / 5.65:1 median | Paired edge; see method below. |
| Pointer outline | 1.00:1 min / 1.25:1 median | 4.89:1 min / 7.45:1 median | Same continuous silhouette as pin body. |
| Circle outline, gold → navy/parchment keyline | 1.00:1 min / 1.43:1 median | 3.49:1 min / 8.42:1 median | All five stops, every tested state/size. |
| Primary pin border alone | 1.00:1 min / 1.29:1 median | 1.92:1 min / 5.57:1 median | Navy alone still blends into some dark engraving; keyline supplies contrast there. |
| Primary circle border alone | 1.00:1 min / 1.43:1 median | 1.87:1 min / 8.42:1 median | Same reason for the fine outer parchment keyline. |
| Padlock/check gold against navy | 5.99:1 | 5.99:1 | Intrinsic artwork contrast retained; both now have a consistent navy disc. |
| Number text against navy | 12.10:1 | 12.10:1 | Now 13–14px, Montserrat 600. |
| Plate text against parchment | 12.10:1 | 12.10:1 | Poppins 700 size/style retained. |
| Decorative plate border against map | 1.00:1 min / 1.36:1 median | 1.26:1 min / 1.81:1 median | Intentionally subtle; text supplies the accessible name. |
| Saved-progress note text | 4.92:1 min / 5.14:1 median | 12.10:1 min / 12.10:1 median | 11px → 13px; opaque parchment backing. |
| Utility labels | 9.89:1 min / 10.50:1 median | 12.10:1 min / 12.10:1 median | 10px → 14px Montserrat 600. |
| Main action label | 11.17:1 min / 11.46:1 median | 12.10:1 min / 12.10:1 median | Minimum 14px; existing larger desktop scale retained. |
| Dot core against underlying road | 1.17:1 min / 1.34:1 median | 1.19:1 min / 1.33:1 median | Fill, opacity, size and spacing unchanged; small sampling/antialiasing variation. |
| Dot core against adjacent rim | 1.13:1 min / 1.38:1 median | 1.26:1 min / 1.60:1 median | Measured on paired screenshot samples; faint shadow improves edge separation. |

Method: WCAG relative luminance, linearized sRGB, (lighter+0.05)/(darker+0.05). Pin/circle samples use the actual rendered bounding boxes mapped back to the unchanged 1774×887 artwork, including its existing 17% parchment wash. Circle perimeters use 96 positions each; pin edges use 80 positions plus pointer samples. Text ratios use the specified foreground and composited backing surfaces. Decorative shadow/glow blur is excluded from the shape ratios.

For a two-tone edge, the reported value is the stronger of navy or parchment against the sampled background. Navy alone cannot reach 3:1 over every dark ink pixel; the outer parchment keyline makes the complementary light boundary visible there. The navy/parchment pair itself is 12.10:1. This is a sampled contrast analysis, not a claim that every antialiased pixel across every possible map pan has the same ratio.

Dots are measured directly from the before/after screenshots at matching existing dash centers, excluding UI footprints. The table uses 550 paired samples. Their faint cream fill remains low contrast by design; the adjacent shadow rim improves separation, but this decorative trail does not reach 3:1 everywhere. Increasing contrast further would require a heavier outline or changing the protected appearance, so that was not applied.

## Verification

| CSS viewport | Start diameter | Circle diameter | Pin body |
|---|---:|---:|---:|
| 1920×1080 | 121.00px | 96.80px | 64.00px |
| 1440×900 | 121.00px | 96.80px | 64.00px |
| 1280×720 | 100.80px | 80.62px | 53.31px |
| 950×700 | 98.00px | 78.39px | 51.83px |

All three requested map states were captured at all four sizes: 12 after layouts, plus 12 baseline layouts. No measured stop-circle, number, mark, plate or current-pin overlap with fixed controls. Circles remain 80% of Start's nominal diameter; even including the extra 1px outer keyline on either side they remain smaller. Maximum measured center rounding was 0.01475px; pointer contact error was at most 0.00781px. Unchanged ROAD/coordinate records establish that the centers stay on the same trail.

Additional small-scale checks at 524×895 and 400×700 had no measured control/stop overlaps. The enlarged number discs retained 1.69px and 0.81px clearance above their plates respectively. At 950×700 the 13px saved note wraps within its existing maximum width; it remains clear of the HUD and utilities.

Keyboard Tab testing covered all five HUD segments, five seals, three utilities, map surface, all stop buttons, popover close/badge actions, main action, Settings Sound/language/Restart/Exit and confirmation controls. Visible controls had the gold ring with navy backing. Offscreen stops retain the existing map behavior: their own rings are clipped, but their focused popovers are visible and outlined. Automatic camera movement was deliberately not added. The pin is skipped by Tab, retains cursor:default, does not navigate on click and keeps its existing hover tooltip.

The sample journey was exercised through Mountains, Forest, Valley and the unchanged Islands-unlock/Full-Expedition sequence. Sound was toggled on and restored off. First-arrival and all-complete map states were inspected without changing their actions or wording. The disposable test profile was replayed for a final fresh arrival.

Reduced motion: source verification confirms the new halo is static, the main pulse has no scale/animation, new transitions are instant, and hover movement is removed. Existing reduced-motion walk and padlock rules remain unchanged. This browser connection exposes viewport control but no reduced-motion emulation, so a live reduced-motion run could not be performed. Normal hover/focus and representative click interactions were exercised; held-pointer pressed styling was checked in CSS rather than a separate held-press screenshot.

Targeted ESLint for page.js is clean. Full `npm run lint` has zero errors and the same four pre-existing anonymous-default-export warnings in lib/i18n/fil-content.js, fil-courses.js, fil-notes.js and fil.js; unrelated files were not changed. `git diff --check` passes. No browser console errors were captured. `npm run dev` was invoked, detected the existing server and exited; verification used that running localhost:3000 server.

## Screenshots outside the source checkout

Folder: `C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/`.

The linked copies contain the entire actual CSS viewport. Only the unused browser-host capture margin was cropped; UI pixels were not altered. Raw screenshots without the `-viewport` suffix are retained in the same folder.

### First arrival: Mountains ready

- 1920x1080: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-mountains-ready-1920x1080-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-mountains-ready-1920x1080-viewport.png)
- 1440x900: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-mountains-ready-1440x900-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-mountains-ready-1440x900-viewport.png)
- 1280x720: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-mountains-ready-1280x720-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-mountains-ready-1280x720-viewport.png)
- 950x700: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-mountains-ready-950x700-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-mountains-ready-950x700-viewport.png)

### Mountains done, Forest ready

- 1920x1080: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-forest-ready-1920x1080-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-forest-ready-1920x1080-viewport.png)
- 1440x900: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-forest-ready-1440x900-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-forest-ready-1440x900-viewport.png)
- 1280x720: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-forest-ready-1280x720-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-forest-ready-1280x720-viewport.png)
- 950x700: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-forest-ready-950x700-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-forest-ready-950x700-viewport.png)

### All complete, Islands ready

- 1920x1080: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-all-complete-1920x1080-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-all-complete-1920x1080-viewport.png)
- 1440x900: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-all-complete-1440x900-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-all-complete-1440x900-viewport.png)
- 1280x720: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-all-complete-1280x720-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-all-complete-1280x720-viewport.png)
- 950x700: [Before](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-all-complete-950x700-viewport.png) · [After](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-all-complete-950x700-viewport.png)

Additional captures: [Before Full Expedition](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/before-full-expedition.png), [After Full Expedition](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/after-full-expedition.png), [Stop focus](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/focus-stop.png), [Badge-action focus](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/focus-badge-action.png), [Restart focus](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/focus-restart.png), [Pin tooltip](C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/atlas-polish/pin-tooltip.png).

Raw evidence: `measurements.json`, `contrast.json`, `audit.json`, `keyboard-focus.json`, `keyboard-final.json`, `keyboard-dialogs.json`, `small-details.json` and `console-errors.json` in the same folder.

## Recommendations not applied

- Auto-pan a keyboard-focused offscreen stop into view. This changes camera behavior; current focused popover highlighting supplies context without that change.
- Consider 44px-wide HUD progress segments at the smallest widths. Their current height is 40px and widening them would change HUD layout.
- Raise the smallest name-plate headings and Drag-to-explore hint text in a future layout pass. Their contrast is strong, but a larger minimum type size would need more room and could change plate/hint footprints; this pass preserves their text style and positions.
- Give the 13px note more horizontal room if a single line at 950px is preferred. The current two-line wrap stays within the existing box and causes no overlap; widening or moving it would alter layout.
- A quieter background treatment or a higher-contrast trail could further reduce visual competition. That would alter artwork treatment or the protected trail appearance, so neither was applied.

No known new overlap remains in the tested layouts. Live reduced-motion emulation, universal contrast across every texture pixel, and automatic visibility of offscreen focused stops are the limitations described above.
