# Rubric revision list for Prompt 25b

Date: October 26, 2026, Asia/Manila. This is a revision checklist, not an edited rubric. The source New Algorithm.pdf (26 pages) is unchanged. SHA-256: d91ad6acc1221aa6a6207ebbcad47b44659c999281149686f360baeb98e3b350. It is the previously supplied Formal Algorithm Scoring Rubric at Documents/0 CAPSTONE/3 - Capstone 2/upgrade/New folder/New Algorithm.pdf. The prompt's New_Algorithm.pdf name refers to that source.

## Section 1: core rules

- Remove cluster as a scoring answer everywhere. Keep elective group headings as unscored labels only.
- Describe two distinct new-route questions: electives, and core subjects. Elective cards are not core-subject choices.
- Fixed link counts remain 2 interests, 2 skills, 2 certificates, 2 old subjects, 1 strand, 1 core subject and 5 electives per course. The removal does not change mappings.
- Replace the misleading "may exceed 100" sentence in the No cap rule: scores are the uncapped sum of earned points; with these valid input limits the maximum is 38 old and 43 new. No normalization or percentages are displayed to students. Also explicitly prohibit numeric score display, consistent with Prompt 25.

## Section 2: formula and point values

Keep Score(c) = interest + skill + certificate + academic. Interests, skills, certificates and the old academic formula are unchanged.

Replace the new formula with:

```text
new academic(c) = 4 * matched electives
                + 3 * matched core subject
                + GWA bonus once, only if either kind matches
```

Each course has one linked core subject, so its core contribution is either 0 or 3 even when the student selects three different core subjects. It is not 3 times every core choice and never 9 for one course.

- Electives row: choose 1 to 3 of 70 rows, or exclusive "Not sure yet / None" (empty set); +4 per selected linked row.
- Replace the 74-choice best-subject row with 4 core subjects, choose 1 to 3; +3 to the course if its one core subject is selected.
- Delete the cluster +2 row entirely.
- Keep the original GWA tiers, actual decimal input without rounding, once-only bonus and conditional match eligibility. Use "core subject" instead of "best subject" in the new-route condition, including the repeated sentence in Section 5.3.

Maxima table replacements:

- Interests: 6, unchanged.
- Skills: 10, unchanged.
- Certificates: 6, unchanged.
- Old academic: 4 strand + 6 GWA + 2*3 old subjects = 16, unchanged.
- New academic: 3*4 electives + 1*3 core + 6 GWA = 21, replacing 29.
- Old total: 6 + 10 + 6 + 16 = 38, academic share 16/38 = 42.105263...%, rounded 42%, unchanged.
- New total: 6 + 10 + 6 + 21 = 43, replacing 51. Academic share 21/43 = 48.837209...%, rounded 49%, replacing 57%.

These shares belong only in the technical rubric, not student screens or PDFs.

Special cases:

- Keep GAS unlinked, with no strand or GWA points.
- Replace the old elective/cluster zero-award sentence with "Not sure yet / None" for electives and "None yet" for certificates, both zero. A selected core subject can still qualify a course for GWA when electives are empty.
- Remove the same-elective-as-best-subject double-award clause. That answer combination is no longer valid. Distinct elective and core matches still both contribute to a course, and GWA is added once.

## Section 3: seed wording

Remove cluster from the canonical-answer seed list. New-route canonical answers contain electives and core selections only (internal field bestSubjects is allowed). Sorting, SHA-256, skill/interest tie-break order, GWA tier seed treatment and exclusion of identity metadata remain unchanged. Old-route tie-breaking rules remain unchanged.

## Section 4: flow

- Both routes have four Valley steps: old = Strand, Subjects, GWA, Certificates; new = Electives, Core subjects, GWA, Certificates.
- Replace the sentence saying clusters and best subjects are asked in Valley with the four-step new route above. Certificates are a Valley sub-step, not a separate region.
- Reconcile the earlier approved Basecamp change: Grade 11 automatically uses new; Grade 12 chooses a curriculum directly, with no school question or pilot-school routing.
- New elective question (DRAFT): "Which electives do you take and feel strongest in?" Core question (DRAFT): "Which subjects are you strongest in?"

## Section 5.2: Forest statement 4

Replace SKL-04's prefixed text with exactly:

"I can keep track of money, records, budgets, files, books, and schedules carefully."

Its links and rating rule are unchanged. i18n catalogs are not edited. There is no existing Filipino catalog key for the old full v2 prefixed sentence or the revised full sentence. The key that must be supplied in the later translation phase is the exact revised English sentence above. The existing legacy "Managing money and budgets" key is a separate old report summary, not a translation of SKL-04.

## Section 5.5: new curriculum

A. Rename Best subjects to Core subjects. Replace 4 core + 70 elective cards = 74 with exactly 4 core choices, select 1 to 3. Remove the sentence inheriting elective links from part B. Keep the four core mappings unchanged:

- COR-01: General Mathematics, 22 course links.
- COR-02: General Science, 31 course links.
- COR-03: Effective Communication / Mabisang Komunikasyon, 12 course links.
- COR-04: Pag-aaral ng Kasaysayan at Lipunang Pilipino, 20 course links.

These counts sum to 85, one core link per course.

B. Retain all 70 elective/TechPro rows, exact labels and applied Appendix B mappings. The question becomes the DRAFT elective question above. Select 1 to 3 or the exclusive "Not sure yet / None" response. Rename the source heading "TechPro: other clusters" to "TechPro: other groups". The named headings are unscored UI groups; they are not an additional question, a stored answer or a source of points.

C. Delete the entire cluster question, its 14 named responses plus Not sure yet, its union-of-row course mapping and its +2 award. Do not replace C with another scored question.

## Section 6: link-count rows

Retain 32 interest options/8 questions, 15 skills, 13 certificates, 19 old subjects, 10 strands (GAS unlinked), 4 core subjects with exactly one link per course, and 70 electives with exactly five links per course (425 total). Describe the four core choices as the entire core-subject answer bank, not one part of a 74-choice bank. There is no cluster row in the current Section 6 table; no replacement row is needed. The 14 remaining core response sets in Section 9 are combinations of four choices, not 14 named groups.

## Section 7: reachability note

Do not retain the PDF's old leads as current results. Update the note to reference regenerated witnesses and docs/reachability-report.md for the new formula. Current seeded search and real-engine re-scoring found 170 PASS, 0 WARN, 0 TIE and 0 FAIL. These are valid witnesses, not integer-programming optimality certificates or maximum-lead claims. Keep the definition of FAIL as "not found", not "proven impossible"; extended search remains required for non-PASS initial cases.

## Section 9: exact combination counts

Apply the rubric's stated counting assumptions, not raw decimal GWA values: 8 four-option interests, 15 five-rating skills, 0 to 3 unordered distinct certificates out of 13, and 6 GWA tiers. No name/avatar count. Count old and new routes separately. Grade 11 includes new only; Grade 12 includes both routes.

Choice-state factors:

- Interests: 4^8 = 65,536.
- Skills: 5^15 = 30,517,578,125.
- Certificates: C(13,0)+C(13,1)+C(13,2)+C(13,3) = 1+13+78+286 = 378.
- GWA: 6 tiers.
- Old subjects: C(19,1)+C(19,2)+C(19,3) = 19+171+969 = 1,159.
- Old strands: 10, including GAS.
- Electives: C(70,0)+C(70,1)+C(70,2)+C(70,3) = 1+70+2,415+54,740 = 57,226. The empty set is the exclusive "Not sure yet / None" response, counted once.
- Core subjects: C(4,1)+C(4,2)+C(4,3) = 4+6+4 = 14. The old 67,599 best-subject sets and the 15 cluster-response multiplier are removed.

Exact replacement rows:

- common: 4^8 * 5^15 * 378 * 6 = 4,536,000,000,000,000,000 = 4.536E+18.
- old: common * 10 * 1,159 = 52,572,240,000,000,000,000,000 = 5.257224E+22.
- new: common * 57,226 * 14 = 3,634,079,904,000,000,000,000,000 = 3.634079904E+24.
- grade11: new = 3,634,079,904,000,000,000,000,000 = 3.634079904E+24.
- grade12: old + new = 3,686,652,144,000,000,000,000,000 = 3.686652144E+24.
- totalGrades11And12: old + 2*new = 7,320,732,048,000,000,000,000,000 = 7.320732048E+24.

The exact new result is 3.634079904e24, which rounds to the requested approximately 3.63e24. The exact total across Grades 11 and 12 is 7.320732048e24, which rounds to approximately 7.32e24. There is no disagreement with those approximate expectations. Grade 12 is 3.686652144e24; do not copy the rounded new-only number into its exact row. The unique union of route answer shapes is old+new; the across-grade total counts the new route once for each grade, as the rubric's grade-row assumptions require.

These are theoretical answer combinations, not distinct rankings or observed student profiles. Retain the source's caveat about school availability and real-world consistency. Actual GWA has more possible values than six; six here is deliberately the rubric's scoring-tier assumption.

## Section 10: alignment policy

Keep all existing per-course link targets and the relevance-before-equal-count principle. Add an explicit implementation note that core choices and electives are separate questions with no inherited best-subject elective links, and group headings carry no points. Replace the unresolved double-award reference from Section 2 with the now-resolved core-only rule. The current Section 10 itself has no separate double-award checklist row, so do not invent one. Record the 25b formula revision as an approved change, with new maxima 21/43 and current reachability validation; retain the requirement to rerun coverage/counts/reachability after future changes. No mapping edits are required for this revision.

## Part 3 / Appendix B: propagation note

Delete the paragraph titled "Propagation to best-subject links" that applies every elective replacement to an elective best-subject card. Replace it with: the listed replacements affect elective awards only; core-subject mappings are unchanged. The historical applied elective replacements and exactly-five-link target remain authoritative.

## Part 3 / Appendix C: counts and verification status

- Rename New-flow best subjects to New-flow core subjects: 4 choices, select 1 to 3, replacing 74.
- Keep New-flow electives at 70 rows, select 0 to 3 in canonical scoring answers; the UI offers 1 to 3 or the one explicit empty response.
- Delete New-flow cluster responses (15 responses); there is no such answer field.
- Retain all 85 courses, the 85 strand assignments over 9 linked strands, 8 interests/32 options, 15 skills, 13 certificates, 19 old subjects and all fixed link targets.
- Replace the claim that Section 9 combination totals remain unchanged with the exact six replacement rows above.
- Update NOT YET VERIFIED wording using the regenerated 170 valid PASS witnesses, while distinguishing witness reachability from proof of optimality. Do not claim the PDF was independently re-optimized with integer programming.

## Verification and limits

The implementation tests cover all 85 courses at exact old/new maxima 38/43, academic maxima 16/21, GWA boundaries, no cluster field/award, rejected elective best-subject IDs, deterministic hashing, saved-v2 cleanup and revised report models. The source PDF has not been edited. The historical prior reports retain their original decisions; docs/revision-25b-report.md records the current implementation. Student-facing outputs still contain no numeric scores or percentages.
