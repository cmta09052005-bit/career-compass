# Consolidated fix list verification

Implemented September 8, 2026.

- Marketing carousels use shared interaction-aware autoplay without play/pause
  controls. Arrows sit beside dots; footer links and journey entry points are wired.
- Navigator uses navigator-portrait-v2.png in the carousel, intake and Atlas.
- Intake success opens through an explicit completion event. Browser history
  restores the intake step and selections.
- Atlas supports portrait, uses atlas-journey-v3.png and a winding SVG route,
  offsets its token below labels, and adds session-only sound and badge rewards.
- Assessments, processing, results, course details and report use journal surfaces.
- Interests reveal choices; Skills has reactive confidence feedback; Academics
  uses two steps. Progress indicators count saved answers.
- Assessment wording is simpler; IDs, option values, categories, limits and
  scoring metadata were compared with HEAD and are unchanged.
- Missing session/prerequisite states provide a route back to Basecamp or Atlas.
- Mobile navigation collapses into an expandable menu.

## Checks

- Scoring regression suites passed (four test files).
- Production build passed with network access for existing Google Fonts.
- ESLint passed with three existing next/no-img-element warnings on Home.
- Browser: completed intake, eight Interests scenarios, ten Skills statements,
  two-step Academics, Atlas results unlock, results and course detail navigation.
- Browser: slider keyboard feedback, scenario reveal, mobile menu, intake success,
  sound preference persistence, and browser back/forward intake behavior checked.
- DOM layout checks: Home, About, How It Works, Intake, Atlas, all assessments,
  Results, course detail and Report fit 390px mobile and 1440px desktop widths.
- Portrait Atlas measured 390 by 844 with no page scroll. Token bounds did not
  intersect any region label. Browser console reported no errors.
- Screenshot capture failed during the final browser pass. Full visual screenshot
  verification and subjective audio listening remain unverified; DOM measurements
  do not establish every visual detail or physical-device touch behavior.
