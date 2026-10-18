# Opt-in Offline Mode

Implemented and checked on 2026-10-19. No dependencies, scoring changes, account,
database, tracking or user-data uploads were added. Existing Atlas, tutorial,
assessment and progress logic is unchanged.

## Files

Added `components/OfflineMode.js`, `components/offline-mode.css`,
`public/offline-worker.js`, `public/offline.html`, `scripts/build-offline.mjs`
and `lib/offline-worker.test.mjs`.

Changed `app/layout.js` to provide one shared panel, `app/page.js` to expose it
in the Home footer, and `app/journey/page.js` to expose it after Sound in Settings.
`app/results/[courseId]/page.js` now prebuilds the existing 24 course IDs.
`package.json` runs the offline inventory generator after the production build.
`next.config.mjs` prevents caching of worker/update discovery files by HTTP caches.
`.gitignore` and `eslint.config.mjs` exclude generated worker/build snapshots.
`docs/local-storage.md` documents the separate preference and cleanup boundaries.
Other dirty Atlas files belong to the earlier work in this checkout.

## Rendering and network audit

Next.js 16.3.1, App Router. All 35 user-facing pages are now pre-rendered.
The 11 non-course routes are `/`, `/about`, `/how-it-works`, `/intake`, `/journey`,
`/journey/interests`, `/journey/skills`, `/journey/academic`, `/processing`,
`/results` and `/report`. The 24 `/results/[courseId]` routes are listed with
every other resource in the inventory linked below. Course data was already
static; generating these pages adds no scoring or flow changes.

No runtime API routes, server actions, middleware, analytics or remote scoring
dependency was found. Scoring, results and the jsPDF report run locally using
bundled JSON. JSON modules travel in the compiled chunks. Fonts fetched by
next/font at build time are served locally at runtime. Sounds, portraits, map
artwork, icons, CSS and scripts are same-origin assets. Browser print/PDF
facilities are local. External source links still require internet.

The image optimizer normally needs a running Next server. While Offline Mode
is enabled, the worker resolves `/_next/image?url=/...` requests to the cached
original public image bytes, including every size/quality variant used on screen.
It does not change the normal optimizer while Off. Cross-origin images are not
intercepted. This avoids guessing every optimizer width and downloading duplicate
image variants.

## Saved copy and update strategy

The production build generates `/sw.js`, `/offline-manifest.json` and versioned
`/offline-build/<build-id>/` snapshots. Deploy these public outputs together
with the matching Next build. Do not publish only the source public directory
without running the production build. Service workers require HTTPS or localhost.

Only an explicit Turn on registers the root worker. Its opt-in query identifies
a fresh worker even if a previously disabled controller remains attached to the
page. Automatic updates retain that registration URL and use the generated
build contents to detect a change. Off mode never registers a worker.

The worker downloads four resources at a time, stores cache-first copies in
`career-compass-offline-<build-id>`, and writes a completion marker only after
all resources succeed. Failed or quota-limited downloads delete their incomplete
cache and preserve the previous ready build. The inventory contains HTML, full
and segment RSC payloads needed for App Router navigation, all emitted static
chunks/fonts, public assets and sounds, and the metadata image routes.

Background update downloads are deferred for Save-Data or 2G/3G connections.
An explicit Update now may request the download anyway. A completed new version
waits for the user. Applying checks every open window for any of the three
assessments or processing and blocks activation until they are left. Old caches
are deleted only after successful activation. Unknown document navigation tries
the network then shows the cached friendly fallback. API, cross-origin and POST
requests are never cached.

`careerCompassOfflineMode` records consent/build metadata in localStorage through
the existing storage wrapper. It is outside journey reset keys. The worker reads
no answers or progress. Turn off and Remove offline copy disable current workers,
unregister them and delete all `career-compass-offline-` caches, leaving progress
untouched. A browser can retain a disabled controller until navigation; it passes
requests through without interception. Re-enabling on the same page is supported.

## Resource inventory

Final build: `Uau_uNx9iGGgBqJMvL7ky`.
310 resources, 43,896,450 uncompressed payload bytes (41.86 MiB; UI rounds to
41.9 MB). Actual browser disk usage includes cache metadata and can differ.

- 60 public/metadata assets and fallback: 35,103,485 bytes.
- 7 existing sound files: 172,296 bytes.
- 68 JS/CSS/font resources: 5,735,147 bytes.
- 35 page snapshots: 1,202,009 bytes.
- 140 full/segment navigation payloads: 1,683,513 bytes.

Complete machine-readable list, including every route, URL, cache key, type and
byte count:
`C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/offline-mode/resource-inventory.json`.
The build generates the same inventory at `public/offline-manifest.json`.

## Verification

Production build succeeded. `npm run lint` passed with zero errors and the four
pre-existing anonymous default-export warnings in `lib/i18n/fil*.js`.
Worker/storage tests: 16 passed. Worker tests cover cached navigation/images,
failure/quota rollback, version staging/activation, assessment blocking,
slow-connection deferral, explicit updates, disable and request exclusions.
The scoring engine and weight table have no diff. Development server was also
started/reused for UI checks; worker registration is intentionally production-only.

An isolated production origin on port 3100 was used, leaving the existing port
3000 journey untouched. After the initial Home opt-in, the server was stopped
and the production tab closed. A new tab cold-opened Home from the saved copy.
With the origin unavailable, intake, tutorial, first walk, Atlas, all three
assessments, Full Expedition, results, a previously unvisited course detail,
processing and report worked. Each principal page was reloaded. The downloaded
report was a valid 11,940-byte `%PDF-1.3` file. Unknown navigation displayed the
friendly fallback. With the final origin stopped again, Restart returned to
intake, tutorial replay and the first walk reached Mountains, and Exit returned
to Home. Home reloaded and the panel still showed Ready with the final build.
Sound was toggled on/off without request errors. The final cached flow had no
console errors.

A real build update from `zQ-GDxJzOWxhxrxVViDbi` to
`FeFcbUT2xyKD7GzLCm3w3` downloaded in the background and offered Update now.
An assessment in a second tab blocked applying it; after closing that tab the
update applied and the completed journey remained intact. A later final-build
update also succeeded. Turn off and Remove offline copy both showed Off without
losing the completed journey. Re-enabling without navigation finished at Ready.

The panel fit at 1920×1080, 1440×900, 1280×720 and 950×700, with controls at least
44px high. Keyboard Tab showed a 3px gold focus ring with navy separation.
The final centering-only CSS adjustment was visually rechecked at 950×700;
later viewport override calls did not change the active tab's dimensions, so
the other three screenshots record the preceding panel placement.
The native dialog contains focus and restores the invoking control. Reduced
motion removes the new progress-bar transition; no other new animation exists.

## Evidence and limits

Artifacts directory (outside the source checkout):
`C:/Users/Charlene/.codex/visualizations/2026/10/18/01a14e04-4480-77a3-92c0-dd002af7d233/offline-mode/`.

Screenshots: `off.png`, `downloading.png`, `ready.png`, `couldnt-finish.png`,
`update-available.png`, `update-blocked-during-assessment.png`,
`updated-ready.png`, `turned-off.png`, `removed-copy.png`, `final-ready.png`,
`ready-1920.png`, `ready-1440.png`, `ready-1280.png`, `ready-950.png`,
`missing-page-fallback.png`, `offline-report-ready.png`, `offline-restart.png`.
Final restart evidence: `offline-replayed-map.png`. Exit and retained Ready state
were also verified through the accessibility tree; the scrolled Home screenshot
could not be captured correctly.
Also retained: `offline-test-report.pdf` and `layout-checks.json`.

The test browser returned false from `navigator.storage.persist()`; the panel
reports possible eviction. No site can guarantee permanent cache storage.
Clearing ALL site data while offline removes the worker and fallback too, so a
friendly site page is then impossible; a missing page with the saved copy still
present was tested instead. No optional install manifest was added.

The browser controls expose neither DevTools offline/throttling nor OS network
switches. Stopping the origin proves cache-only operation, but does not change
`navigator.onLine`. Real connectivity notice screenshots and real slow-network
timings could not be captured; source handles the actual online/offline events,
four-second notices and external-link blocking, and slow-connection policy is
unit tested. Live reduced-motion emulation, actual quota exhaustion/eviction,
audible sound output and a full browser-process shutdown were not available.
Sound toggling was exercised with the origin stopped, and all seven audio files
were downloaded; this does not independently verify speaker output. Browser
errors from deliberate connection failures are expected; normal cached journey
operation had no console errors.
