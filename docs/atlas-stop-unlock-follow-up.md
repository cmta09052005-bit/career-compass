# Desktop stop sizing and arrival unlock

Changed: app/journey/page.js, app/journey/atlas.css, lib/browserStorage.js, and this report. Existing Phase 1/follow-up edits were preserved.

## Sizing

Start remains 121px at 1280x720, 1440x900, and 1920x1080. Old stop diameters from the existing clamp were 126px, 129.6px, and 134.4px respectively. New measured diameter is 96.796875px (96.8px intended) at all three sizes, using --atlas-start-size and the existing --atlas-stop-size at 80%. The supplied 149px Start estimate does not match this checkout. Icons, number badges, corner marks and ready glow scale from the old 134.4px reference. Pin remains 64px; its existing pointer offset tracks half the new circle size. Nameplates retain the 8px badge-to-plate gap. Coordinates and camera are unchanged; measured center rounding errors were below 0.03px.

## Unlock

careerCompassAtlasUnlockSeen stores an array of stop IDs (interests, skills, academic, islands), registered with JOURNEY_KEYS for restart/migration. Arrival records the ID before the live animation. Loaded stops do not mount an opening animation; Locate Me has no unlock trigger. The first Guide/first-walk pending state keeps Mountains visually locked. Badge dismissal and walking retain the next visual lock until arrival.

The inline SVG reproduces stop-padlock.svg with a movable shackle and a small gold shine. CSS animates transform/opacity over 900ms, using strong ease-out/ease-in-out curves. Reduced motion removes shackle/shine movement and fades the lock for 100ms. The existing unlock sound is reused through playSound, respecting the shared sound preference/activation checks. A polite live region announces Unlocked. Functional regionState/actionReady and entry handlers are unchanged. Full Expedition waits for unlocking to clear; its contents/timing remain unchanged.

## Verification and limitations

- npm run dev invoked; another server already serves this project at localhost:3000, reused for browser checks.
- Actual CSS viewports verified at 1280x720, 1440x900 and 1920x1080 (browser viewport override required 80% inputs due to its scaling).
- Sizes measured at all three; 64px pin confirmed. Forest nameplate still intersects the fixed Drag to explore hint in the initial 1280x720 framing. Not changed. Smallest proposed fix: relocate only that hint to a clear corner at this desktop size. Other overlay collisions were not exhaustively measured.
- A new idle-walk null-access error found in browser testing was corrected. Subsequent dashboard reload rendered successfully. Earlier error remains in captured historical browser logs.
- ESLint: zero errors, five existing warnings (one unused dashboard suppression and four anonymous i18n exports). Existing storage tests: 10 passed. git diff --check: no whitespace errors.
- Full live fresh-start and four-arrival/celebration/reload/Locate Me sequence remains unverified. Isolated testing at 127.0.0.1 was blocked because the existing Next development server rejects resources from that origin; server configuration was left unchanged. No existing journey was reset for testing.
- Reduced motion was reviewed in source, not live-emulated. Audible playback was not verified. No new dependencies/audio files or smaller-screen-only styles were added.
