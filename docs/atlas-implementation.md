# Atlas dashboard implementation

Implements the v3 fixed landscape viewport and draggable map, retaining the v2
HUD, badge slots, Settings, and sequential flow. Pointer capture drives a clamped
translate3d camera; mount and Locate Me use the same centering function. The
Atlas restores html/body overflow and height on unmount. Compact percentage
locked markers open one shared parchment Card popover. Active region icons
enter their trail directly. The full-route sepia artwork
atlas-journey-v3.png fills the world behind a winding SVG trail.

The selected Explorer portrait appears in the fixed nameplate and one circular
map token. Locally saved previous position enables automatic trail advance after
the earned badge clears, with reduced-motion support. Portrait and
landscape phones share the fixed viewport without a rotation blocker. The HUD
adapts to narrow widths and the token sits below node labels.

## Decisions

- Settings includes Exit below Restart Assessment, opening the existing confirmation before returning Home. Locate Me has its own control;
  guide copy names that control to avoid conflicting instructions.
- Completed regions open view-only badge details. Only the next incomplete
  region starts/resumes an assessment. Results unlock at three completed regions.
- Academic submission returns to the Atlas for the Full Expedition moment;
  Scholar clears automatically, then the token follows the final curve to The
  Islands. Full Expedition appears after arrival; View My Results opens processing.
  The final Islands position is retained across visits on this browser/device.
- Restart clears the assessment session and guide/celebration flags, then opens
  Basecamp. Exit also clears the session. Both require confirmation.
- Sound defaults off and remembers its setting on this browser/device. Short local WAV
  effects use the shared lib/sound.js helper after a user gesture; active sounds
  stop when the tab is hidden. Settings provides a visible switch.
- English remains the supported language. Settings explicitly identifies
  Filipino as planned; app-wide translation was an open scope question in v2.
- Existing explorer portrait artwork is reused for the HUD crop and a larger
  on-map token, so the selected explorer remains recognizable in both places.
- First-visit help waits until the intake success portal has left the DOM.
- Motion respects prefers-reduced-motion. Native dialogs provide keyboard
  containment, Escape dismissal, and focus restoration.

## Artwork

`public/atlas-map-v2.webp` is a new built-in ImageGen background, optimized to
about 550 KB. `public/icons/career-compass/settings-gear.svg` extends the existing
navy/gold icon family. All other icons and portraits reuse existing assets.

Generation prompt:

Create a production background illustration for Career Compass, a parchment adventure journey map. Tall portrait 2:3 canvas, no text, no labels, no UI, no characters, no dotted route (route overlaid in code). Hand-drawn fine navy/brown ink engravings with watercolor washes, antique parchment #F5ECD7, gold #D4A017 accents, muted teal #2DBFB8 rivers; richly illustrated, slightly aged but light clean readable paper. Full bleed uninterrupted continuous vertical map: top 18% mostly quiet parchment for headline; tiny basecamp tents at 22% near center; dramatic engraved mountain range at x25%, y34%; cluster of pine forests at x75%, y55%; rolling terraced open valley with meandering river at x25%, y76%; small misty summit at bottom center y92%. Plenty of open parchment at x65% y34%, x30% y55%, x65% y76% for overlaid cards. Very delicate coastlines and contour hatching at outer edges, a small compass rose bottom left. Premium illustrated RPG atlas, not flat vectors, not photorealism, not a screenshot. No frame or rolled paper perspective, straight top-down artwork. Cohesive navy, brass gold, aged ivory family.

## Verification

- ESLint on dashboard and academic completion screen.
- Local development browser: 390px mobile, 1024px tablet, desktop layouts.
- Completed a sample 8-question Interests, 10-statement Skills, and Academic
  flow through the UI: verified 33/66/100% and sequential unlocks.
- Verified badge popup, Sound toggle, guarded restart, Locate Me focus,
  guide dismissal, final Results unlock, and no browser console errors.

## September 9 follow-up polish

- Guide title/body are 32px/16px on desktop and 28px/15px on narrow screens;
  its wording, icon rows and order strip are unchanged.
- Random uses a neutral question-mark frame and assigns one of the six real
  explorers on entry. The Navigator crop frame retains the original image bytes.
- Basecamp and Islands labels/supporting text have parchment backgrounds. The
  starting token is immediately below Basecamp; the final token sits below the
  Islands text. The next primary action has a reduced-motion-aware gold pulse.
- Welcome, Explorer Created, all three badges and Full Expedition use the same
  dimmed/blurred native-dialog backdrop and celebration family. Full Expedition
  has a larger icon glow and 36 particles; other celebrations use 24. Region badges dismiss after 3.2 seconds or via ×; expedition dialogs remain
  until dismissed. Scholar and the final walk precede Full Expedition.
- Every celebration triggers the existing badge chime when Sound is enabled;
  all dialogs retain parchment open/close feedback and keyboard dismissal.

Verification: browser completed intake with Random, all three direct-entry
trails and results navigation; checked the retained 92% horizontal Islands
endpoint, badge/expedition ordering, common backdrop, and effective 390x844
mobile Guide/map layout. Basecamp/token gap was 8px and Islands/token gap 13px.
No browser console errors were observed in the fresh verification session.

## Fix List 4

- Identity/Basecamp use the backpack, Guide uses its magnifying glass, and
  forward assessment actions use the compass. Wayfinder uses the mountain peak
  everywhere, including the nameplate and How It Works reward list. Islands
  displays its island-with-flag marker.
- Region badges retain the shared celebration and add wind/dust, swirling leaves,
  or fluttering parchment. Reduced motion hides decorative particles.
- Badge exit finishes before the 1.2-second curved walk (200ms reduced motion).
  Arrival enables the glowing action and opens a Forest/Valley preview with
  Continue Journey and ×. The final arrival shows Full Expedition instead.
  Reloading during a pending completion resumes from locally saved notices/position.
- Intake onward uses a fixed assessment frame. Intake retains its inner scroller;
  trail, processing and report cards contain overflow; Results and all course
  details share an accessible internal content region. Trail step changes reset
  their card scroll. Marketing pages retain document scrolling; print is unlocked.

Verification: ESLint and whitespace checks; UI completion through all regions,
3200ms automatic dismissal, manual badge skip, next-preview entry and dismissal,
Scholar-before-Islands-before-Full-Expedition, and explicit results navigation.
Desktop and 390x844 checks confirmed viewport-sized documents with long content
scrolling inside the academic card and results/course panels.

## September 10 dashboard and marketing polish

- A local SVG grain tile adds a 12% multiply paper finish over the existing map
  artwork; a pointer-transparent vignette softens the viewport edges.
- The warm cream dotted route sits at layer 1, location markers at layer 3,
  and the Explorer token at layer 4. All five locations reuse LocationCard:
  260x100px parchment, 18px names, optional eyebrow and one-line description.
- Primary wood-grain actions are 270x96px on desktop and adapt within the mobile
  viewport. Token offsets keep the Explorer below the unified cards.
- Home has decorative chapter-number watermarks across all six chapters at 8%
  opacity on wide screens. Narrow screens retain their existing space allocation.
- Course scholarships and their source note now sit inside a native details
  disclosure, headed “Worried about your financials? →”. Other guidance stays put.
- FAQ chevrons rotate 180 degrees. Mouse hover opens/closes only with a fine
  pointer and hover support; click/tap and keyboard toggling remain available.

Checks: five matching card dimensions and single-line descriptions, cream path
and stacking order, desktop and 390px action bounds, scholarship open/close,
FAQ keyboard open/close and chevron rotation, six watermark elements. ESLint
reported no errors and three existing Home image-element warnings.
