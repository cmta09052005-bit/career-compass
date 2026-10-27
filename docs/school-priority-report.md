# Intake, results, PDF and school proximity updates

Reviewed October 27, 2026.

## Changes

- Moved the existing assessment neutrality note below Choose Your Explorer, above the options. The fieldset references it for accessibility.
- Left-aligned the results heading and compass explanation.
- Centered the PDF brand header. Every PDF page includes the system attribution, page number and actual generation date in Asia/Manila. A saved assessment date does not determine the download date. Pagination reserves footer space and keeps course headings with their content.
- Sorted school information independently for all 85 courses using Haversine straight-line distance from Polangui Municipal Hall. There is no province, school-type or region preference. Results previews, comparison information and compact PDF school selections use the same order; the course details retain the complete list.
- Preserved all 297 existing school-course associations. No schools were added to fill lists. Assessment scoring, course ranking, package.json and data/v2 were not changed.

## Sources and limits

The static location file records source URLs and the basis of each selected point. Public coordinates were reviewed against institution and campus identities using OpenStreetMap and the [CHED Region V directory](https://region5.ched.gov.ph/hei-directory). The app performs no network geocoding. OpenStreetMap attribution appears beside the school list.

Of 51 existing school records, 42 have reviewed reference coordinates and nine remain unresolved. Some source records combine multiple campuses or multiple institutions. Those records receive no invented distance. Unknown distances follow known distances, preserving their original order. Equal distances also preserve original order. Unknown does not mean farthest.

The [Bicol University program listing](https://bicol-u.edu.ph/programs/) places College of Education programs under Daraga, while four original course associations identify Legazpi West. Those four campus-course distances are explicitly unresolved. Existing source qualification messages remain visible. Original school data was preserved rather than silently reassigned.

Public program evidence was checked through cached CHED profiles and official institutional program pages. CHED profile lists can be partial; national and combined-campus records also have incomplete evidence. This work does **not** establish that every original association is currently offered at a specific campus. The audit files retain those limitations, and the interface continues to advise confirmation with the institution. Consequently, a completely verified nearest-to-farthest ordering of every record is not possible with the current source data.

## Validation

- Unit suite: 102 tests, 101 passed, one existing skip, zero failures. Tests cover every course's school membership/order, invalid and missing coordinates, national-only schools, stable ties, nonmutation, and date rollover at midnight in Manila.
- Production build passed. Lint: zero errors and six existing warnings. English/Filipino translation inventory: zero missing entries.
- Browser checks: intake and results in English and Filipino at desktop and phone sizes, with no document overflow; correct note position and left alignment. Inspected the full education school list: Bicol University Polangui, Polangui Community College, then increasingly distant campuses, followed by unresolved records. No browser console errors were captured.
- Six generated PDF fixtures, eight pages total: centered brand, actual date on every page, no stale assessment date, page numbers and footer/content separation passed. Two naturally two-page reports were included. Rendered pages were visually inspected. A PDF download from the actual results button also succeeded.
- Link and reachability verification re-scored all 170 old/new witnesses successfully.

Evidence and reproducible QA scripts are in `docs/qa/school-priority/` and `scripts/qa/school-priority-pdf.*`. New Filipino interface copy is marked DRAFT in `docs/i18n-review.md`.
