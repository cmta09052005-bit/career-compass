# Scoring engine v2 and verification

Date: 2026-10-26 (Asia/Manila). Phase 2 is complete. The engine is isolated in lib/scoringV2/ and is not imported by any page, component, or old engine.

## Sources, decisions and scope

Implementation uses the supplied Formal Algorithm Scoring Rubric (New Algorithm.pdf), including its revised mapping authority, and the existing verified data/v2/courses-master.json, items.json and links.json. Section 7's old Rank 1 lead table was not used. The attached school list is not a scoring input and was not converted or used to change the mappings.

Two questions were resolved explicitly by the user before implementation:

1. Accept any finite numeric GWA from 0 to 100 inclusive, without rounding. Below 75 is valid and awards zero bonus. Future UI limits are outside this phase.
2. Use exclusive reachability labels: PASS = unique highest total and lead >=3; WARN = unique highest total and lead 1-2; TIE = Rank 1 with total/skill/interest ties resolved by the hash; FAIL = no Rank 1 witness found after extended search, not proven impossible.

The source specifies GWA **tier** in the canonical hash seed, so the engine hashes the awarded tier bonus, not the raw decimal grade. Equal grades within the same tier have equal scoring and seeds. This is recorded explicitly in types.md and tested. There are no outstanding ambiguities affecting the delivered results. A theoretical zero-lead Rank 1 resolved by skill/interest alone has no label in the user's four-category definition; the verifier stops for clarification if such a result remains its best candidate. All 170 final cases have strict leads, so that condition did not occur.

The eight missing interest question prompts reported in Phase 1 remain unchanged. Scoring uses their complete option IDs and links, so missing presentation prompts do not block the engine. No display wording, school data, live UI, old scoring, or existing data file was changed.

## Task 1: answers and validation

lib/scoringV2/types.md defines complete canonical input. validate.js validates it and exposes validateAnswers, assertValidAnswers and AnswerValidationError. Validation checks both provided route blocks, requires the active block, and uses the v2 item IDs. It rejects malformed types, missing/unknown scoring keys, unknown IDs, duplicate choices, non-integer or out-of-range skills, invalid list counts, and non-finite/out-of-range GWA without coercion. Errors contain stable code, path and message. Inherited properties cannot supply required scoring fields.

Certificates use [] for None yet. Electives use [] and cluster uses null for Not sure yet. Display-only sentinel IDs and Work Immersion are rejected as canonical selections. Best subjects allow the 4 core and 70 scored elective IDs. Overlap across the elective and best-subject lists is allowed, while duplicates within either list are rejected. The optional inactive route block is validated if present and excluded from scoring and hashing. Root metadata is permitted but excluded from canonicalization; nested scoring blocks reject extra keys.

## Task 2: formulas implemented

scoreCourses(answers) validates the profile and returns all 85 courses in master-list order, each with id, name, total and breakdown. It never sorts, mutates answers, caches student answers, or persists data.

For course c:

- I = 3 times the number of selected options in c's two interest links.
- S = the sum of the actual integer ratings for c's two skill links.
- C = 3 times the number of selected categories in c's two certificate links.
- G = 6 for [95,100], 5 for [90,95), 4 for [85,90), 3 for [80,85), 2 for [75,80), and 0 for [0,75). The input GWA is not rounded.
- Old academic = (matching strand ? 4 + G : 0) + 3 times matched old subjects. GAS is accepted but has no linked courses, giving no strand/GWA award.
- New academic = 4 times matched electives + 3 times matched best subjects + 2 for a cluster match + (any elective or best-subject match ? G : 0).
- Total = I + S + C + academic.

A core best subject matches coreSubject; an elective best subject matches electives. An overlapping elective/best-subject choice earns both 4 and 3. The GWA bonus is awarded once even with multiple matches, including a core-subject match alone. Cluster membership is the union of courses linked to that cluster's elective rows **after the Appendix B replacements**. Cluster-only matches award 2 and do not qualify for GWA.

Breakdown fields: interest, skill, certificate, academic, strand, subjects, elective, bestSubject, cluster, gwa. The academic field is a subtotal; add only the first four fields for total. All irrelevant route-specific components are zero.

There is no cap, normalization, percentage or multiplier. Under the fixed link counts and permitted answer counts, the mathematical maxima are 38 old and 51 new. Tests attain those maxima for **every course**, verify component sums, and check the production scoring source for a cap/percentage transformation. A valid >100 profile cannot be constructed under these rules; the rubric's general uncapped wording is preserved without pretending a valid profile can exceed these maxima.

## Task 3: ranking and hashing

rankCourses(answers) returns all 85 scored courses sorted by total descending, skill descending, interest descending, then tie key ascending. It does not change numeric totals to force a display separation.

canonicalizeAnswers projects only route, interests, skills, certificates, gwaTier and the active route block. It recursively sorts object keys and selection arrays by Unicode code units and serializes JSON. Metadata, inactive answers, name, avatar, grade and school cannot affect ranking. Raw GWA remains available in the input and witness; only the tier is hashed, as the rubric requires.

sha256.js provides synchronous SHA-256 with standard UTF-8 TextEncoder, typed arrays and integer operations. It has no Node import, crypto API, network, window or storage dependency. seed = lowercase-hex SHA-256(canonical JSON). The per-course key is lowercase-hex SHA-256(seed + courseId), without a delimiter. Hex keys compare directly, avoiding locale-sensitive collation. A full hash collision throws SHA256_TIE_COLLISION rather than introducing a biased ID fallback. Hashes are computed lazily for courses tied on all three score comparisons.

Known-vector checks compare with independent node:crypto, including empty, abc, Unicode, lone surrogate, padding/block boundaries and a million-character input. Production scoring/ranking also ran identically in a browser-like VM without crypto/Node globals and in a real Node module worker with global crypto disabled. These checks establish the runtime-independent implementation; no claim is made that a live browser service worker or a deployed static site was exercised. No offline worker file was edited.

## Task 4: tests

Added lib/scoringV2/engine.test.js. Final run uses the same command as npm test and includes every existing lib/*.test.js, lib/*.test.mjs and lib/i18n/*.test.js test, plus the new v2 tests:

```text
node --test lib/*.test.js lib/*.test.mjs lib/i18n/*.test.js lib/scoringV2/*.test.js
tests 56
suites 0
pass 56
fail 0
cancelled 0
skipped 0
todo 0
```

This is 28 new tests plus 28 existing tests. The initial 26 v2 tests passed, then two additional checks were added for inherited-property rejection and every revised cluster union; the final combined suite above passed after those additions. GWA checks cover 0 plus every requested boundary: 74.99, 75, 79.99, 80, 84.99, 85, 89.99, 90, 94.5, 94.99, 95 and 100, for both routes. Further coverage includes GAS, empty sentinel equivalents, overlap awards, GWA once, all-course maxima, ranking priority/hash order, determinism, sorted arrays/keys, inactive/metadata invariance and validator error codes.

Node reports MODULE_TYPELESS_PACKAGE_JSON for existing ES-module .js files in this repository. The warning is informational and also occurs in old tests. package.json's module type was not changed because the authorized existing-file edit is limited to scripts.

Targeted lint also passed with exit code 0 and no findings: `node node_modules/eslint/bin/eslint.js lib/scoringV2 scripts/verify-reachability.mjs`.

## Task 5: reachability

scripts/verify-reachability.mjs searches all 85 courses in both routes. It uses a fixed documented seed, deterministic per-case PRNG streams and production scoreCourses for every candidate. Every saved witness goes through production rankCourses and an additional re-score before writing. No search-only arithmetic or pre-revision leads are used.

Output:

```text
SUMMARY: PASS 170; WARN 0; TIE 0; FAIL 0; 170/170 re-scored.
PASS: second run is byte-identical for witnesses and report.
```

All 170 witnesses are Rank 1 with a unique highest total; their leads range from 3 to 27 points. Search evaluated 171 profiles: 169 cases passed on their first candidate, and ENG10/new passed on its second. No extended search was required. The script nevertheless implements a larger 8192-candidate seeded phase and a systematic 4096-combination free-interest sweep for any case not initially PASS, including every potential FAIL before reporting. FAIL never means proven impossible.

Search fixes target-linked skills to 5, other skills to 1, target certificates and interest links, and GWA to 100. It varies unlinked interest answers and new-route linked elective/best-subject subsets and linked cluster. First PASS stops a case; the reported lead is a feasible witness, not an optimized maximum. School offerings and real-student answer likelihood are not modeled. This establishes existence of successful profiles, not fairness or recommendation accuracy.

data/v2/witnesses.json stores full answer objects, course/name/flow, rank, total, runner-up, lead, unique-total and hash-dependence flags, status, attempts and extended-search flag. docs/reachability-report.md contains all 170 cases in a table, the search method, exact definitions, input file hashes and totals. A second independent run reproduced both files byte-for-byte.

## Task 6: files and preservation

New engine files:

- lib/scoringV2/types.md
- lib/scoringV2/validate.js
- lib/scoringV2/score.js
- lib/scoringV2/sha256.js
- lib/scoringV2/rank.js
- lib/scoringV2/index.js
- lib/scoringV2/engine.test.js

Other new files:

- scripts/verify-reachability.mjs
- data/v2/witnesses.json
- docs/reachability-report.md
- docs/scoring-v2-report.md

Only package.json was edited among the 272 files present at the start of this phase. It adds test (all old and new tests) and verify (link integrity, then reachability). A SHA-256 preservation baseline covers both tracked files and pre-existing untracked Phase 1 artifacts; all other baseline files remain byte-identical. Existing app/, components/, old lib code, data JSON, package dependencies and all Phase 1 artifacts are preserved. No commit was made. No UI changed, so dev-server/UI-console verification was not required for this phase.

Git status includes the pre-existing Phase 1 untracked files alongside the new Phase 2 files; see the final chat status listing. Run npm test for regressions and npm run verify to reproduce link/reachability verification.
