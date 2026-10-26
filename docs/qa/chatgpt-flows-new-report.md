# ChatGPT NEW test flows: real-engine verification

Date: 2026-10-26 (Asia/Manila).

Input: output/pdf/career-compass-new-flows.json

Input SHA-256: 43a71db75ed5d1347a2a8554d2c331717403f5fcc9c81e72b2aa54ec44abd87b

Result: **85/85 PASS**. Failing course IDs: none.

## Method

All interest-option text, skill-statement text, certificate categories and active-route subject/elective/strand labels were mapped by exact string equality to data/v2/items.json. Every label matched exactly; no trimming, aliases, fuzzy matching or guesses were used. Question letters and statement numbers were checked against their exact labels. Empty certificate/elective arrays remain empty, representing the explicit None responses. The NEW JSON coreSubjects field maps to the engine's bestSubjects field, using COR item IDs only.

Each flow used createEmptySession, mergeSession and valleyPatch for every Valley step, then normalizeSession, fromSession and buildRecommendations. Basecamp grade levels from the input were retained. All 85 sessions passed validation, and canonical answers after normalization matched their mapped inputs exactly. Each real-engine ranking contained all 85 courses. The input flows were not changed.

PASS means the actual Rank 1 equals the target and target total minus the highest non-target total is at least 3. Runner-up below is the highest non-target course in actual engine order; tied runner-up totals do not affect the lead.

Hash terminology: **Rank 1 hash** means another course ties the winning course on total, skill and interest, requiring the hash to decide the winner. **Any-rank hash** means at least one such tie exists anywhere among all 85 courses, including lower ranks. The engine computes an answer seed on every run, but a seed computation alone does not mean the hash decided Rank 1. These flags are derived from the real ranking's comparator keys, without modifying or instrumenting engine code.

## All 85 results

| Expected course | Actual Rank 1 | Target total | Runner-up | Runner-up total | Lead | Rank 1 hash | Any-rank hash | PASS/FAIL |
| --- | --- | ---: | --- | ---: | ---: | --- | --- | --- |
| BUS01 | BUS01 | 37 | SCI08 | 34 | 3 | No | Yes | PASS |
| BUS02 | BUS02 | 38 | BUS05 | 35 | 3 | No | Yes | PASS |
| BUS03 | BUS03 | 37 | ICT02 | 34 | 3 | No | Yes | PASS |
| BUS04 | BUS04 | 31 | BUS01 | 28 | 3 | No | Yes | PASS |
| BUS05 | BUS05 | 32 | BUS02 | 29 | 3 | No | Yes | PASS |
| BUS06 | BUS06 | 37 | BUS05 | 34 | 3 | No | Yes | PASS |
| BUS07 | BUS07 | 32 | BUS04 | 29 | 3 | No | Yes | PASS |
| BUS08 | BUS08 | 38 | SCI08 | 35 | 3 | No | Yes | PASS |
| BUS09 | BUS09 | 37 | BUS10 | 34 | 3 | No | Yes | PASS |
| BUS10 | BUS10 | 31 | ENG07 | 28 | 3 | No | Yes | PASS |
| ICT01 | ICT01 | 31 | ENG05 | 28 | 3 | No | Yes | PASS |
| ICT02 | ICT02 | 31 | ICT01 | 28 | 3 | No | Yes | PASS |
| ICT03 | ICT03 | 31 | SCI07 | 28 | 3 | No | Yes | PASS |
| ENG01 | ENG01 | 37 | ENG08 | 34 | 3 | No | Yes | PASS |
| ENG02 | ENG02 | 38 | ENG14 | 35 | 3 | No | Yes | PASS |
| ENG03 | ENG03 | 32 | ENG13 | 29 | 3 | No | Yes | PASS |
| ENG04 | ENG04 | 31 | ENG03 | 28 | 3 | No | Yes | PASS |
| ENG05 | ENG05 | 25 | ICT01 | 22 | 3 | No | Yes | PASS |
| ENG06 | ENG06 | 32 | SCI03 | 29 | 3 | No | Yes | PASS |
| ENG07 | ENG07 | 38 | SCI08 | 35 | 3 | No | Yes | PASS |
| ENG08 | ENG08 | 38 | ENG01 | 35 | 3 | No | Yes | PASS |
| ENG09 | ENG09 | 32 | ENG11 | 29 | 3 | No | Yes | PASS |
| ENG10 | ENG10 | 29 | ENG11 | 26 | 3 | No | Yes | PASS |
| ENG11 | ENG11 | 36 | ENG10 | 33 | 3 | No | Yes | PASS |
| ENG12 | ENG12 | 32 | AGR03 | 29 | 3 | No | Yes | PASS |
| ENG13 | ENG13 | 37 | ENG04 | 34 | 3 | No | Yes | PASS |
| ENG14 | ENG14 | 37 | SCI02 | 34 | 3 | No | Yes | PASS |
| ENG15 | ENG15 | 31 | ENG14 | 25 | 6 | No | Yes | PASS |
| SCI01 | SCI01 | 31 | SCI04 | 28 | 3 | No | Yes | PASS |
| SCI02 | SCI02 | 37 | AGR02 | 33 | 4 | No | Yes | PASS |
| SCI03 | SCI03 | 31 | SCI04 | 28 | 3 | No | Yes | PASS |
| SCI04 | SCI04 | 38 | SCI03 | 35 | 3 | No | Yes | PASS |
| SCI05 | SCI05 | 38 | SCI04 | 35 | 3 | No | Yes | PASS |
| SCI06 | SCI06 | 26 | SCI07 | 23 | 3 | No | Yes | PASS |
| SCI07 | SCI07 | 23 | SCI06 | 20 | 3 | No | Yes | PASS |
| SCI08 | SCI08 | 36 | BUS01 | 33 | 3 | No | Yes | PASS |
| SCI09 | SCI09 | 31 | AGR02 | 28 | 3 | No | Yes | PASS |
| SCI10 | SCI10 | 37 | SCI11 | 34 | 3 | No | Yes | PASS |
| SCI11 | SCI11 | 37 | SCI05 | 34 | 3 | No | Yes | PASS |
| AGR01 | AGR01 | 32 | AGR03 | 29 | 3 | No | Yes | PASS |
| AGR02 | AGR02 | 31 | SCI09 | 28 | 3 | No | Yes | PASS |
| AGR03 | AGR03 | 36 | AGR01 | 33 | 3 | No | Yes | PASS |
| AGR04 | AGR04 | 32 | EDU07 | 29 | 3 | No | Yes | PASS |
| HLT01 | HLT01 | 37 | HLT07 | 34 | 3 | No | Yes | PASS |
| HLT02 | HLT02 | 34 | SCI01 | 31 | 3 | No | Yes | PASS |
| HLT03 | HLT03 | 32 | HLT02 | 29 | 3 | No | Yes | PASS |
| HLT04 | HLT04 | 32 | EDU05 | 29 | 3 | No | Yes | PASS |
| HLT05 | HLT05 | 36 | HLT04 | 33 | 3 | No | Yes | PASS |
| HLT06 | HLT06 | 32 | ICT01 | 29 | 3 | No | Yes | PASS |
| HLT07 | HLT07 | 38 | HLT01 | 35 | 3 | No | Yes | PASS |
| HLT08 | HLT08 | 37 | AGR04 | 33 | 4 | No | Yes | PASS |
| HLT09 | HLT09 | 27 | HLT04 | 23 | 4 | No | Yes | PASS |
| HLT10 | HLT10 | 31 | HLT01 | 28 | 3 | No | Yes | PASS |
| EDU01 | EDU01 | 37 | EDU02 | 34 | 3 | No | Yes | PASS |
| EDU02 | EDU02 | 32 | EDU01 | 29 | 3 | No | Yes | PASS |
| EDU03 | EDU03 | 32 | EDU01 | 29 | 3 | No | Yes | PASS |
| EDU04 | EDU04 | 37 | EDU05 | 34 | 3 | No | Yes | PASS |
| EDU05 | EDU05 | 32 | EDU04 | 29 | 3 | No | Yes | PASS |
| EDU06 | EDU06 | 31 | ART01 | 28 | 3 | No | Yes | PASS |
| EDU07 | EDU07 | 36 | AGR04 | 28 | 8 | No | Yes | PASS |
| EDU08 | EDU08 | 31 | EDU07 | 28 | 3 | No | Yes | PASS |
| SOC01 | SOC01 | 38 | SOC02 | 35 | 3 | No | Yes | PASS |
| SOC02 | SOC02 | 38 | SOC03 | 35 | 3 | No | Yes | PASS |
| SOC03 | SOC03 | 31 | SOC05 | 27 | 4 | No | Yes | PASS |
| SOC04 | SOC04 | 32 | SOC09 | 29 | 3 | No | Yes | PASS |
| SOC05 | SOC05 | 37 | SOC06 | 34 | 3 | No | Yes | PASS |
| SOC06 | SOC06 | 28 | SOC07 | 25 | 3 | No | Yes | PASS |
| SOC07 | SOC07 | 38 | SOC06 | 35 | 3 | No | Yes | PASS |
| SOC08 | SOC08 | 25 | SOC15 | 22 | 3 | No | Yes | PASS |
| SOC09 | SOC09 | 32 | SOC04 | 29 | 3 | No | Yes | PASS |
| SOC10 | SOC10 | 31 | BUS03 | 28 | 3 | No | Yes | PASS |
| SOC11 | SOC11 | 36 | SOC09 | 30 | 6 | No | Yes | PASS |
| SOC12 | SOC12 | 32 | SOC06 | 29 | 3 | No | Yes | PASS |
| SOC13 | SOC13 | 37 | SOC17 | 34 | 3 | No | Yes | PASS |
| SOC14 | SOC14 | 37 | SOC16 | 34 | 3 | No | Yes | PASS |
| SOC15 | SOC15 | 32 | SOC06 | 29 | 3 | No | Yes | PASS |
| SOC16 | SOC16 | 31 | SOC14 | 28 | 3 | No | Yes | PASS |
| SOC17 | SOC17 | 30 | SOC14 | 27 | 3 | No | Yes | PASS |
| SOC18 | SOC18 | 32 | EDU02 | 29 | 3 | No | Yes | PASS |
| ART01 | ART01 | 37 | ART02 | 34 | 3 | No | Yes | PASS |
| ART02 | ART02 | 37 | ART01 | 34 | 3 | No | Yes | PASS |
| ART03 | ART03 | 31 | ART02 | 28 | 3 | No | Yes | PASS |
| ART04 | ART04 | 31 | ART06 | 28 | 3 | No | Yes | PASS |
| ART05 | ART05 | 36 | ART01 | 32 | 4 | No | Yes | PASS |
| ART06 | ART06 | 32 | ART04 | 29 | 3 | No | Yes | PASS |

## Failing flows and actual top five

None. All 85 targets ranked first with a strict lead of at least 3.

## Comparison with JSON expectations

All 85 target totals and runner-up totals exactly match the supplied JSON expectations.

Minimum actual target lead: 3. Rank 1 required the hash in 0 flows. At least one lower-rank hash tie was present in 85 flows.

## Reproduction and scope

Run node scripts/qa/verify-chatgpt-flows.mjs output/pdf/career-compass-new-flows.json. This harness imports the production session helpers and recommendation pipeline. No scoring, ranking, data/v2 or input-flow file was edited. No commit was made.
