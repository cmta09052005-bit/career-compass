# Career Compass — Quick Context

**Project:** Career Compass — a web-based decision support system that helps
Senior High School students in the Philippines identify suitable college
courses and career paths through an "Explorer/Journey"-themed assessment
covering Interests, Skills, and Academic Performance. A rule-based weighted
scoring engine (no AI/ML) generates ranked course/career recommendations,
downloadable as a PDF "Explorer Report." Developed by Charlene Mae T. Adille
& Juno Alligah B. Romano, BSIT 3B, Bicol University Polangui (Capstone).

**Tech Stack:** Next.js (JavaScript, NOT TypeScript), App Router, Tailwind
CSS, no backend server beyond static hosting (Vercel). GSAP + Lenis.js for
scroll animations.

## HARD CONSTRAINTS (NEVER VIOLATE)

- NO database of any kind (no Firebase, no Supabase, no Firestore, no SQL,
  no persistent server-side storage).
- NO login, NO account registration, NO authentication, NO user roles.
- NO admin dashboard / admin CMS.
- All data is either STATIC (bundled JSON: `items.json`, `courses.json`) or
  SESSION-ONLY (React state / browser `sessionStorage`, auto-cleared when
  the tab closes).
- Landing page compass animation = CSS/SVG + GSAP ScrollTrigger only — NOT
  a 3D model, NOT Three.js, NOT a pre-rendered frame-sequence canvas.

If any suggestion involves a database, login system, or 3D engine — STOP
and flag it. It violates the approved, ERB-cleared manuscript scope.

For full specification (site map, wireframe indicators, item bank, scoring
formulas, course dataset, features table), see `instructions.md` in the
project root.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
