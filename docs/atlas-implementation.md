# Atlas dashboard implementation

Implements the v3 fixed landscape viewport and draggable map, retaining the v2
HUD, badge slots, Settings, and sequential flow. Pointer capture drives a clamped
translate3d camera; mount and Locate Me use the same centering function. The
Atlas restores html/body overflow and height on unmount. Compact percentage
markers open one shared parchment Card popover. The existing landscape
landing-map.jpg artwork fills the world without stretching the portrait map.

The selected Explorer portrait appears in the fixed nameplate and one circular
map token. Session-only previous position enables a 500ms trail advance after
returning from a completed region, with reduced-motion support. A portrait
phone prompt responds to resize and orientationchange below 768px width.

## Decisions

- Compass exits to Home after confirmation. Locate Me has its own control;
  guide copy names that control to avoid conflicting instructions.
- Completed regions open view-only badge details. Only the next incomplete
  region starts/resumes an assessment. Results unlock at three completed regions.
- Academic submission returns to the Atlas for the Full Expedition moment;
  View My Results then opens the existing processing screen.
- Restart clears the assessment session and guide/celebration flags, then opens
  Basecamp. Exit also clears the session. Both require confirmation.
- Sound produces a quiet synthesized ambient chord only after a user gesture.
  It pauses when the tab is hidden and closes on dashboard unmount.
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
