# UI edits after Filipino translation

Branch: v2-rebuild. No commit. Task 1 was corrected, reviewed and approved; the user then authorized all remaining tasks. Existing translation and PDF changes in the checkout are preserved. Final verification date: October 27, 2026, Asia/Manila.

## Task 1: logo inventory, reported before edits

- `components/MarketingNavbar.js`: shared marketing navbar.
- `app/page.js`: Chapter 1 compass, Chapter 6 compass, footer.
- `app/intake/page.js`: Basecamp app bar and heading.
- `app/journey/page.js`: Atlas compass icon helper, including the main action, fallback explorer and dialogs. Tutorial uses the existing Atlas elements rather than a separate logo asset.
- `app/about/About.js`: intro, both team-card backs, footer.
- `app/how-it-works/HowItWorks.js`: intro and footer.
- `app/results/CourseMatch.js`: shared course panel header.
- `app/processing/page.js`: academic completion status.
- `components/JourneyPortal.js` and `components/MarketingShell.js`: shared journey transition dialogs.
- `app/icon.png`: browser icon, replaced with a 32px version.
- `app/apple-icon.png`: Apple touch icon, replaced with a 180px version.
- Offline Mode: no logo image in `components/OfflineMode.js` or `public/offline.html`. Public assets and emitted metadata icons are included by `scripts/build-offline.mjs`.
- App manifest: none found. No install manifest was introduced.
- Metadata/social images: `app/layout.js` has title and description only; no Open Graph or Twitter image, or separate social image route found.
- PDF: `lib/explorerReport.js` uses a text brand header, with no logo image. No extra PDF artwork added during Task 1.
- `public/brand/career-compass-mark-master.png` and `public/brand/career-compass-mark-96.png`: no application source references found.

## Corrected Task 1: undo and redo

At the user's request, the first Task 1 was undone before this replacement: restored original source references and app icons; archived and removed only the generated Task 1 files. The first attempt is preserved outside the project under the current visualization workspace, in `task1-first-attempt/`. Unrelated pre-existing work was retained. The inventory above was confirmed again before reapplying replacements.

## Logo preparation

Source: `C:/Users/Charlene/Downloads/COMPASS-LOGO_Restored2_20261025195216.png`, 4160 by 4160 pixels.

Used the already installed Sharp package. No dependencies or package files changed. Reproducible command:

```text
node scripts/prepare-compass-logo.cjs <original PNG path>
```

The script floods four-connected near-white pixels from all image edges and from a verified seed inside the top ring, with minimum RGB channel 235 (20-level tolerance). A component inventory found two large white background regions: 10,100,403 exterior pixels and 163,764 pixels inside the top ring. Both are now transparent. Small bright components within the artwork are protected rather than globally deleting every light pixel. White-matte removal softens both boundaries, including 15,003 adjacent neutral antialias pixels. The other 7,026,430 artwork pixels are unchanged. Cream lettering and parchment remain opaque.

Created `public/brand/compass-v2-transparent-master.png` and 32, 96, 180, 192, 512 and 1024px variants. Small chrome uses 96px; larger intro/Intake images use 192px; portals and How It Works intro use 512px; landing Chapter 1 uses 1024px. Fresh transparent asset filenames prevent the image optimizer from reusing the first attempt. Existing CSS, animation and element sizing are unchanged in this task.

Original files retained: `public/landing-compass.png`, `public/brand/career-compass-mark-master.png`, `public/brand/career-compass-mark-96.png`. These are now unreferenced by application source. Original app icons are preserved as `public/brand/legacy-icon.png` and `public/brand/legacy-apple-icon.png`, also unreferenced by application source. Retained public files remain in the offline bundle.

Visual evidence: `docs/qa/logo-v2/light-1x.png`, `dark-1x.png`, `light-2x.png`, `dark-2x.png`. These composite the logo at 420px and 840px on parchment and navy. Inspected all four. Lettering and parchment have no transparency holes. The corrected outer and inner ring edges show no visible white halos at either scale. The inner opening now matches the background. Tiny disconnected source specks remain outside the drawing because the requested flood-fill method does not remove disconnected image content.

## Copy and remaining tasks

Task 1 adds no user-facing copy. Tasks 2 through 9 are documented below, including all new DRAFT English and machine-draft Filipino strings.

## Verification

- `npm run dev` invoked. It detected the existing project dev server on port 3000 (PID 33952); verification reused that server.
- Corrected browser checks at 1600 by 900 CSS pixels: Landing and Intake visually checked and saved as `docs/qa/logo-v2/landing-browser.png` and `intake-browser.png`. About logo requests all loaded; How It Works navbar and intro loaded, with offscreen footer subject to lazy loading. No captured console errors. Intake was checked with saved Filipino preference; marketing pages rendered English. Full two-language/four-viewport coverage remains for Task 8.
- `git diff --check`: passed; Git reports existing LF/CRLF notices.
- `npm test`: 96 tests, 95 passed, zero failures, one existing skip.
- Corrected production build: passed. Build ID `Kqb9D8WsjlFBMw5uP4UTs`.
- Corrected offline bundle: 624 resources, 67,620,156 bytes, 96 routes. Explicitly verified the corrected master, all six sizes and both app icons are included.
- `node scripts/verify-routes.mjs`: passed all 96 routes, including 85 course details and matching HTML/RSC and worker manifests.
- No new copy, dependencies, scoring, ranking, data/v2 or search/filter changes. No commit. Existing uncommitted work remains alongside these Task 1 changes.

## Task 2: Intake

Changed the name label to "Your name or nickname". The existing placeholder has different wording ("What should we call you?") and is unchanged. The explorer fieldset now has a visible legend with the same typography and Optional marker as the name label. Added the small non-scoring note after the fields.

Step 2 is centered and sized to its content, up to 48rem wide. It retains the same shared panel, border, radius, ornaments and padding rules as step 1. Its inner region can scroll when necessary. At 1600 by 900 the English step-2 panel measures about 582.8px high; at 1280 by 720, 520.7px; at 950 by 900, 556.4px; on the phone, 623.7px in English and 634.9px in Filipino. Neither step creates document scrolling.

## Task 3: marketing pages and compass motion

Removed the Chapter 1 caption, its unused CSS and its unused catalog entry. Navbar labels remain unchanged. `journeyLabel(entry, placement)` supplies the requested three-state labels to Chapter 1, Chapter 6, About and How It Works. Existing destinations and the shared start/resume interception remain intact, including the existing `/intake` links on About and How It Works.

The image has no separate needle layer. Isolating it would require cutting or reconstructing the flat artwork, so the whole compass swings from -28 degrees to zero with a damped `elastic.out(1, 0.4)` ease over three seconds. It runs once, never rotates 360 degrees, and uses transform only. The existing fade is opacity only. Mobile keeps its existing hidden compass stage. Both tweens are inside the existing no-preference motion condition, so reduced motion creates neither compass tween. Purpose: occasional marketing delight/explanation; existing GSAP is reused, with no new dependency or artwork.

Marketing content now scrolls inside `.marketing-content` within the fixed app viewport. All three marketing pages use that region for their ScrollTriggers, and navbar scroll-state/top navigation use the same element. Document overflow stays zero.

## Task 4: Skills help

Exact element: `.forest-help > summary[aria-label="Confidence level"]` in `app/journey/skills/GrowthSlider.js`.

The existing native details disclosure opens on mouse hover for fine desktop pointers and on keyboard focus. It closes on mouse leave, external blur and Escape. Native click behavior is retained, with the first hover-assisted click protected from immediately closing the disclosure. Escape and blur clear that transient hover state. Touch pointers do not invoke the hover handlers. The existing absolutely positioned help paragraph is unchanged.

English and Filipino browser checks passed click, click after Escape, Escape, blur and keyboard focus. Slider layout was identical before and after opening: offset top/left/width/height `[30, 0, 755, 123]` at 950 by 900. Desktop pointer entry and leave were also exercised. Evidence: `docs/qa/ui-edits/help-checks.json` and `skills-hover.png`.

## Task 5: course background book

Removed the single decorative `.journal-watermark` element, its now-unused StatementIcon import and its two CSS rules from the shared FieldJournal. This removes the background book from all 85 course pages and all six tabs. Six tab icons remain in every checked panel. Results itself contains no such background book, so no Results content/icon needed removal. Opening a course from Results leads to the same course page; this was checked as well. The earlier description of Results course dialogs should be read as this shared navigation path, not a separate implementation.

The phone check also found the existing Filipino Overview label overflowing its tab. Added wrapping to the tab text span; all six tab labels now fit without changing any translation or icon.

## Task 6: shorter PDF

Both routes and languages now use this order:

1. Compact text brand/header, optional student name, grade and curriculum.
2. Existing academic answer summaries, followed by the deduplicated evidence lines the previous report already printed for the top five. No new answer categories, evidence wording or score numbers are introduced.
3. Five ranked courses with full official names. Each has up to three career titles in source data order and up to two schools.
4. The existing short guidance disclaimer and school-completeness note.

School selection calls the existing Results `cardInfoFor` default rule: Bicol, no partial/weak-source flag within Bicol, Albay, then stored order. It selects the first school, then repeats the same rule on the remaining schools for the second. Search/filter code and source data are unchanged. Single-school cases keep one school.

There is no cover page, avatar, separate top-course detail section, group paragraph per result, salary section, source list, CHED section, or long guidance section. Course titles keep their official spelling. Profile and evidence translations use the existing rules. Minimum font size is 10pt, including the footer; normal body size is 10.5pt. A compact 10pt layout is used only when it reduces the number of pages. Layout is measured before drawing, headings stay with following content, and a report exceeding two pages is rejected instead of silently clipping.

All four actual browser downloads (old/new, English/Filipino) are one page. Their extracted text and rendered PNGs were checked, including `QA Niño Áéíóú Ñü`, all five names, section order, no images/avatar, no percentages, and no numeric-score labels. There were no clipped or overlapping lines. The 170 real witnesses were also generated in both languages: all 340 reports fit one or two pages. The full English witness replay, including the additional GAS case, passes 171 of 171.

Current downloaded evidence is under `docs/qa/ui-edits/browser-1-en.pdf`, `browser-1-fil.pdf`, `browser-7-en.pdf`, `browser-7-fil.pdf`, with matching `-1.png` and `.txt` files. Older multi-page QA artifacts elsewhere in docs/qa belong to earlier prompts and are not the current reports.

PDF expectation changes:

- `lib/recommendations.test.js` and `lib/i18n/v2.test.js`: replaced the old minimum-four-pages assertion with one to two pages. Added the career/school limits and absence of the removed detail model.
- `lib/uiEdits.test.js`: checks every real witness in both languages, official course/career names, the default first school, maximum page count and no image object.
- `scripts/replay-witnesses.mjs`: uses the first ranked course name instead of the removed standalone detail model; no longer expects a long career note in the shorter report.
- `scripts/qa/pdf-text.py`: required sections are now the compact header/profile/evidence/results/careers/schools. Added the one-or-two-page and no-image requirements; retired the removed career-note requirement. Existing score/percent/name checks remain.
- `scripts/verify-i18n-pdf.mjs`: expects only the retained Filipino headings and copies current Filipino browser downloads from the Phase 7 manifest.
- `scripts/qa/i18n-pdf-text.py`: requires the retained headings, one or two pages, no images, no removed sections; renders only pages that actually exist. The accented-name and normal/bold glyph probe checks remain.
- `scripts/verify-browser-replay.mjs`: defaults to the current Phase 7 English download manifest and accurately reports the two-route sample, rather than treating historical six-page downloads as the current UI.
- New `scripts/qa/ui-edits-pdf.mjs` and `.py` generate/check four language/route samples and the four actual browser downloads, preserving full names, accented glyphs and section order.

## Task 7: DRAFT copy and Filipino review

All new English copy below is DRAFT. Filipino translations are MACHINE DRAFTS requiring owner review. They are new entries in `lib/i18n/fil-ui-edits.js`, appended to `docs/i18n-review.md`. Existing translations were retained, apart from the explicitly requested removal of the unused caption. In particular, the meaning-based translation of "Finish My Matches" needs review.

- DRAFT English: Choose your explorer
  MACHINE DRAFT Filipino: Piliin ang iyong manlalakbay

- DRAFT English: Your name or nickname
  MACHINE DRAFT Filipino: Iyong pangalan o palayaw

- DRAFT English: Your name and explorer do not affect your assessment results.
  MACHINE DRAFT Filipino: Hindi nakaaapekto ang iyong pangalan at napiling manlalakbay sa resulta ng iyong pagsusuri.

- DRAFT English: Begin Exploring
  MACHINE DRAFT Filipino: Simulan ang Pagtuklas

- DRAFT English: Keep Exploring
  MACHINE DRAFT Filipino: Ipagpatuloy ang Pagtuklas

- DRAFT English: Open My Map
  MACHINE DRAFT Filipino: Buksan ang Aking Mapa

- DRAFT English: Find My Course Matches
  MACHINE DRAFT Filipino: Hanapin ang Mga Kursong Bagay sa Akin

- DRAFT English: Finish My Matches
  MACHINE DRAFT Filipino: Tapusin ang Aking Pagsusuri

- DRAFT English: See My Journey
  MACHINE DRAFT Filipino: Tingnan ang Aking Paglalakbay

- DRAFT English: Try Career Compass
  MACHINE DRAFT Filipino: Subukan ang Career Compass

- DRAFT English: Pick Up Where You Left Off
  MACHINE DRAFT Filipino: Ituloy Kung Saan Ka Huminto

- DRAFT English: Revisit My Journey
  MACHINE DRAFT Filipino: Balikan ang Aking Paglalakbay

- DRAFT English: Start the Assessment
  MACHINE DRAFT Filipino: Simulan ang Pagsusuri

- DRAFT English: Resume the Assessment
  MACHINE DRAFT Filipino: Ipagpatuloy ang Pagsusuri

- DRAFT English: Review My Journey
  MACHINE DRAFT Filipino: Suriin ang Aking Paglalakbay

- DRAFT English: Supporting answers
  MACHINE DRAFT Filipino: Mga Sagot na Batayan

- DRAFT English: Report exceeds the two-page layout. Review the content before downloading.
  MACHINE DRAFT Filipino: Lumampas sa dalawang pahina ang ulat. Suriin ang nilalaman bago i-download.

## Task 8: final checks

- `npm test`: 98 tests, 97 passed, zero failed, one existing skip. Includes the 340 generated witness/language PDF checks.
- `npm run lint`: zero errors; six existing anonymous-default-export warnings in the older catalogs. A missing Localized import in the pre-existing academic-page edits was fixed so the page and required checks work.
- All verifiers pass: links, details, reachability (170/170), simulation invariants, routes/offline, i18n/PDF, browser replay, and the 85-flow catalog check. Full witness PDF replay: 171/171 passed.
- `scripts/i18n-missing.mjs`: T1 764, missing 0; T2 312, missing 0. Protected source terms remain unchanged.
- Final production build passed: `ZK56bnkmi93M-T21fU86B`. It remains static: 96 user routes including all 85 course details. The offline bundle has 624 resources and includes every corrected logo size and both metadata icons. Exact bytes and keys are in `docs/qa/ui-edits/offline-check.json`.
- `npm run dev` was invoked; it found the existing project server on port 3000. Production checks use the existing local-only QA harness on a separate origin, loading known saved fixtures rather than typing all answers. No test-loader route is part of the deployed application. No console errors were captured.
- 160 layout/state observations are recorded in `docs/qa/ui-edits/browser-checks.json`: Landing 24; About 24; How It Works 24; Intake 16; Course Detail tabs 48; old Results 8; new Results 8; Skills 8. All have zero horizontal and vertical document overflow. All measured button/tab labels fit. Landing/About/How It Works cover all three journey states in both languages at each viewport.
- Actual CSS viewports: 1600 by 900, 1280 by 720, 950 by 900, and 375 by 814. The requested 375 by 813 rounds up by one pixel in this browser. Panel dimensions are recorded as fractional CSS pixels where applicable.
- Corrected logo requests loaded on Landing, Intake, About, How It Works, Results cards, Processing, Atlas/tutorial and the shared transition dialog. Both app icons are present in the built metadata/offline resources. Light/dark 1x/2x composites remain in `docs/qa/logo-v2/`.
- Viewport overrides were reset. The temporary test servers are stopped after checks; the user's existing dev server is retained.
- `git diff --check` passes. No scoring, ranking, data/v2, search/filter, package.json or lockfile diff. No dependencies, account/database/backend feature, new artwork beyond the supplied logo, or commit.

## Task 9: files and git status

The Task 1 source/assets are listed in the inventory above. Remaining application edits: `app/intake/page.js`, `app/intake/basecamp.css`, `app/page.js`, `app/story.css`, `app/marketing-polish.css`, `app/about/About.js`, `app/how-it-works/HowItWorks.js`, `app/journey/skills/GrowthSlider.js`, `app/results/[courseId]/FieldJournal.js`, `app/results/[courseId]/journal.css`, `components/MarketingShell.js`, `lib/journeyEntry.js`, `lib/explorerReport.js`, `lib/i18n/fil.js`, `lib/i18n/translate.js`; plus the missing-import repair in `app/journey/academic/page.js`.

New source: `lib/i18n/fil-ui-edits.js`, `lib/uiEdits.test.js`, `scripts/qa/ui-edits-pdf.mjs`, `scripts/qa/ui-edits-pdf.py`. Existing tests/verifiers and the local QA harness changed as described above. Review documentation and generated QA evidence are updated under docs/. The original uncommitted translation/report work is preserved. The complete final status is saved as `docs/qa/ui-edits/git-status.txt`; no files are staged and no commit was made.

## NOT DETERMINED

- Live reduced-motion emulation is not exposed by the available browser controls. The no-animation branch was verified in source; an OS/browser reduced-motion setting was not toggled during live checks.
- Viewport resizing does not emulate a real coarse touch device. Click/keyboard and fine-pointer hover were exercised; the touch-only hardware path is preserved by its pointer/media guards but was not tested on a physical phone.
- No separate image-based PDF logo, install manifest or social image exists to replace. No new one was introduced.
- Filipino copy is awaiting human review, especially the meaning-based "Finish My Matches" wording.
