# Career Compass — Codex Agent Instructions

## Project Overview
Career Compass is a Next.js (JavaScript, no TypeScript) web-based decision
support system for SHS career guidance. Full specification lives in
instructions.md — always read it before making changes, along with the
relevant file in docs/ for the specific area you're touching.

## Hard Constraints (Never Violate)
- NO database, NO login, NO account registration, NO admin dashboard.
- All data is static (JSON files) or session-only (React state /
  sessionStorage).
- Landing page compass animation: CSS/SVG + GSAP ScrollTrigger only —
  NEVER a 3D model or frame-sequence canvas.
- Tech stack: Next.js, JavaScript, Tailwind CSS, App Router, no backend
  server beyond static hosting.

## Style
- Do NOT reformat existing code. Only change lines directly related to
  the current task.
- Respect existing formatting and file structure.
- Reuse components from components/ where they exist — do not create
  one-off duplicate buttons/cards/badges per screen.

## Working Agreements
- Always explain your approach and give a confidence level
  (low/medium/high) before writing code.
- Ask clarifying questions if the task is ambiguous.
- Run `npm run dev` and confirm no console errors after UI changes.