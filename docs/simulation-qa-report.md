# Simulation, recoverability and end-to-end QA

Prompt 27. Branch v2-rebuild. October 26, 2026 (Asia/Manila).

## Method and interpretation

This is a testing study of a fixed rule-based model, not a study of students. Uniform answers are NOT a model of real students. Target-persona answers are generated from the same link mappings used by the engine; recoverability is therefore a synthetic alignment check, not independent validation of career suitability. No claim of fairness, psychometric validity, predictive validity, accuracy for real students, or observed student behavior follows from these results. No mapping, scoring, content, UI, translation or dependency was changed. All percentages below are QA statistics, not student-facing match scores.

All generated profiles were validated with validateAnswers, scored with scoreCourses and ranked with rankCourses. The separately returned scores were checked against the real ranking for every profile. Seeds initialize Mulberry32 with the first 8 hex digits of the engine's synchronous SHA-256. Integer choices use rejection sampling; distinct subsets use a partial Fisher-Yates shuffle. No dates or timings enter simulation output. Each final simulation was run twice in full; both JSON and CSV files were byte-identical. An initial uniform run preceded the approved gap names, then two final runs used the unchanged final method. Only the 40,000 uniform and 153,000 target-persona profiles of one final run are used in the results. Repeat runs are reproducibility checks, not extra observations.

Uniform seeds: career-compass:prompt27:uniform:old:v1 and career-compass:prompt27:uniform:new:v1. Persona seed template: career-compass:prompt27:persona:{route}:{p}:{courseId}:v1; p is serialized as 0.5, 0.75 or 1.

### Uniform generation

Each route has 20,000 profiles. Each of eight interests is uniform over A to D; each of 15 skills is uniform over 1 to 5. Certificate cardinality is uniform over 0 to 3, then a uniform distinct subset of the 13 scored categories is chosen. GWA tier is uniform over six tiers, represented by 70, 77, 82, 87, 92 and 97; scores use these exact numbers. The old route chooses uniformly among all 10 strands including GAS, with a uniform count of 1 to 3 distinct subjects from 19. The new route chooses a uniform count of 0 to 3 distinct electives from the 70 scored rows, and 1 to 3 distinct core subjects from four. Zero electives represents Not sure yet / None. The unscored Work Immersion and explicit None certificate cards are excluded from the category banks.

Cardinality is uniform; all possible answer sets are not equally likely. GWA strata contain the realized random counts, rather than forced equal sample sizes. Mean rank is one-based over all 85 courses. Top-5 share is top-5 count divided by the number of profiles in that row's route/stratum. The median top-5 share is across 85 courses. Gini is computed across those 85 shares (0 means equal exposure). A course never reaching the top 5 is a finite-simulation result, not proof of impossibility.

Rank-one decision stage is the first criterion that separates the winner from its runner-up: total, then skill, then interest, then hash. “top-5 spread” = Rank 1 score minus Rank 5 score. “cutoff margin” = Rank 5 score minus Rank 6 score. A zero cutoff margin is a tie in total points at the top-5 boundary, even if lower-priority criteria order the courses.

### Target-persona generation, approved rules

p is the probability of ATTEMPTING a target-linked answer, not the final inclusion probability. At p=1.0 the three-elective cap prevents inclusion of all five linked electives; p=1.0 is not a perfect profile. There are 300 profiles per course, route and p, for p=0.5, 0.75 and 1.0: 85 x 2 x 3 x 300 = 153,000 profiles. Unlinked answers use the uniform generator. GWA remains uniform over the same six tiers.

- New electives: attempt each of five linked electives independently with p; uniformly trim to three if necessary. Otherwise add a uniform number from 0 through the remaining capacity, sampled uniformly from remaining rows. Zero is allowed.
- New core subjects: include the target's core with p and add 0 to 2 other cores uniformly. If it is not included, choose 1 to 3 distinct cores uniformly from the OTHER three.
- Old subjects: attempt each of two linked subjects independently with p. If none is included, choose 1 to 3 uniformly from all 19. Otherwise add 0 through remaining capacity uniformly from remaining subjects.
- Old strand: linked strand with p, otherwise uniform over all 10 including GAS. Every course has one linked non-GAS strand.
- Certificates: two independent linked attempts with p, followed by a uniform number of additions from 0 through remaining capacity, sampled from remaining categories.
- Interests: for each of the two linked questions, choose the linked option with p; otherwise choose uniformly among all four, which can still select the linked option. Other questions are uniform.
- Skills: each linked skill is 4 or 5 uniformly with p; otherwise it is uniform 1 to 5. Unlinked skills are uniform 1 to 5.

Realized inclusion means final linked selections divided by linked-item opportunities, including fallback selections. skillsHigh counts final ratings of 4 or 5. Thus realized interest/skill rates can exceed p, while realized elective inclusion is capped at 60%. Monte Carlo proportions estimate probabilities only under these exact generators. At 300 trials, the maximum approximate standard error of a course-level proportion is 2.89 percentage points; close differences and small ordering changes should not be over-interpreted. The deterministic seeds do not make the estimates exact population probabilities.

## Task 1: uniform results

| Route | Profiles | Never top 5 | Min share % | Median share % | Max share % | Gini |
| --- | --- | --- | --- | --- | --- | --- |
| old | 20000 | 0 | 3.8200 | 6.0150 | 8.9650 | 0.114325 |
| new | 20000 | 0 | 4.0650 | 5.9800 | 7.4600 | 0.082995 |

No course was absent from every top 5 in either route. This does not show equal exposure or fairness.

| Route | Criterion | Rank-1 count | Share % |
| --- | --- | --- | --- |
| old | total | 13313 | 66.5650 |
| old | skill | 1708 | 8.5400 |
| old | interest | 1212 | 6.0600 |
| old | hash | 3767 | 18.8350 |
| new | total | 13047 | 65.2350 |
| new | skill | 2189 | 10.9450 |
| new | interest | 835 | 4.1750 |
| new | hash | 3929 | 19.6450 |

| Route | top-5 spread mean | top-5 spread median | cutoff margin mean | cutoff margin median | Zero cutoff count | Zero cutoff share % |
| --- | --- | --- | --- | --- | --- | --- |
| old | 3.433800 | 3 | 0.483700 | 0 | 12233 | 61.1650 |
| new | 2.915200 | 3 | 0.378800 | 0 | 13312 | 66.5600 |

### Uniform summaries by GWA tier

| Route | GWA tier | N | Never top 5 | Min % | Median % | Max % | Gini | Total | Skill | Interest | Hash | Spread mean/median | Margin mean/median | Zero margin % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| old | below75 | 3322 | 0 | 4.5756 | 5.9302 | 7.9470 | 0.057553 | 2141 | 402 | 221 | 558 | 2.824503 / 3 | 0.366647 / 0 | 67.5798 |
| old | 75to79 | 3298 | 0 | 4.1237 | 5.9127 | 7.8229 | 0.086071 | 2096 | 252 | 285 | 665 | 3.120982 / 3 | 0.418739 / 0 | 63.9478 |
| old | 80to84 | 3325 | 0 | 3.8195 | 5.9850 | 8.4511 | 0.107430 | 2229 | 335 | 158 | 603 | 3.361203 / 3 | 0.465564 / 0 | 61.6241 |
| old | 85to89 | 3359 | 0 | 3.3046 | 5.8648 | 10.4495 | 0.142381 | 2236 | 272 | 183 | 668 | 3.534385 / 3 | 0.510866 / 0 | 58.9163 |
| old | 90to94 | 3294 | 0 | 3.3394 | 5.7681 | 10.6557 | 0.156281 | 2274 | 209 | 199 | 612 | 3.819369 / 3 | 0.557377 / 0 | 57.7413 |
| old | 95to100 | 3402 | 0 | 2.7631 | 5.7907 | 10.6114 | 0.181171 | 2337 | 238 | 166 | 661 | 3.930335 / 3 | 0.580541 / 0 | 57.2898 |
| new | below75 | 3292 | 0 | 4.4654 | 5.9235 | 8.0802 | 0.077699 | 2099 | 373 | 179 | 641 | 2.853584 / 3 | 0.341738 / 0 | 69.4107 |
| new | 75to79 | 3383 | 0 | 3.9610 | 6.0006 | 7.6855 | 0.086745 | 2214 | 385 | 149 | 635 | 2.845403 / 3 | 0.366243 / 0 | 67.3958 |
| new | 80to84 | 3375 | 0 | 3.9704 | 5.9556 | 8.0593 | 0.081071 | 2192 | 352 | 137 | 694 | 2.887704 / 3 | 0.378370 / 0 | 66.8148 |
| new | 85to89 | 3277 | 0 | 3.8755 | 5.9506 | 7.9036 | 0.096654 | 2172 | 357 | 121 | 627 | 2.988709 / 3 | 0.399756 / 0 | 64.7849 |
| new | 90to94 | 3303 | 0 | 3.6331 | 5.9340 | 8.3560 | 0.105830 | 2197 | 328 | 124 | 654 | 2.983348 / 3 | 0.394187 / 0 | 65.3043 |
| new | 95to100 | 3370 | 0 | 3.5312 | 6.0534 | 7.6558 | 0.093041 | 2173 | 394 | 125 | 678 | 2.934718 / 3 | 0.392582 / 0 | 65.6380 |

## Task 2: recoverability results

Each aggregate below contains 25,500 profiles, with equal weight for all 85 courses. Per-course counts, probabilities and realized inclusions appear in the appendices and CSV.

| Route | p | Rank 1 % | Top 5 % | Top 10 % | Lowest course top 5 % | Median course top 5 % |
| --- | --- | --- | --- | --- | --- | --- |
| old | 0.5 | 43.0314 | 76.3020 | 87.4039 | 68.3333 | 76.0000 |
| old | 0.75 | 77.7098 | 96.8588 | 99.0510 | 93.6667 | 97.0000 |
| old | 1 | 98.5569 | 100.0000 | 100.0000 | 100.0000 | 100.0000 |
| new | 0.5 | 64.3098 | 91.7882 | 96.0941 | 83.3333 | 92.6667 |
| new | 0.75 | 88.8941 | 99.6706 | 99.9412 | 98.3333 | 99.6667 |
| new | 1 | 97.6588 | 100.0000 | 100.0000 | 100.0000 | 100.0000 |

### Realized inclusion rates, not attempted p

| Route | p | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| old | 0.5 | 62.4941 | 69.8725 | 54.7216 | 55.2118 | 53.7373 | N/A | N/A |
| old | 0.75 | 81.2922 | 84.8647 | 77.4725 | 77.3412 | 76.3000 | N/A | N/A |
| old | 1 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| new | 0.5 | 62.7980 | 70.0314 | 54.9216 | N/A | N/A | 45.9835 | 49.9529 |
| new | 0.75 | 81.3353 | 84.7667 | 77.1882 | N/A | N/A | 57.6839 | 75.2784 |
| new | 1 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |

### Requested weak-course thresholds

0 course/route/p cases fall below the requested thresholds: top-5 recoverability below 50% at p=0.75, or below 80% at p=1.0. Both lists are empty. Therefore no weak-threshold course needs an overlap diagnosis. This does not mean every course ranks first consistently or that low recoverability is impossible under another generator. The data-only diagnosis routine is implemented: for any qualifying course, it records the three most frequent observed outrankers and their exact shared interests, skills, certificates and route-specific linked items from links.json, without copy-change recommendations.

| Course group | Old p=.75 <50% | New p=.75 <50% | Old p=1 <80% | New p=1 <80% |
| --- | --- | --- | --- | --- |
| Business and Management | 0 | 0 | 0 | 0 |
| Computing | 0 | 0 | 0 | 0 |
| Engineering and Technology | 0 | 0 | 0 | 0 |
| Science and Mathematics | 0 | 0 | 0 | 0 |
| Agriculture, Fisheries, and Food | 0 | 0 | 0 | 0 |
| Health and Allied Sciences | 0 | 0 | 0 | 0 |
| Education and Sports | 0 | 0 | 0 | 0 |
| Social Sciences, Communication, and Humanities | 0 | 0 | 0 | 0 |
| Arts, Design, and Architecture | 0 | 0 | 0 | 0 |

### Relatively lowest and highest observed results

These are descriptive extremes, not labels of course quality. Recoverability extremes below use p=0.75, ordered by top-5 count, then rank-one count, then course ID. Uniform extremes use top-5 share.

| Route | Metric | Course | Name | Top 5 % | Rank 1 % |
| --- | --- | --- | --- | --- | --- |
| old | uniform lowest | SOC04 | BA Political Science | 3.8200 | N/A |
| old | uniform lowest | SOC06 | BA History | 3.8350 | N/A |
| old | uniform lowest | SCI11 | BS Meteorology | 4.1150 | N/A |
| old | uniform lowest | SOC07 | BA Philosophy | 4.1550 | N/A |
| old | uniform lowest | SCI05 | BS Applied Physics | 4.4050 | N/A |
| old | uniform highest | EDU04 | Bachelor of Physical Education | 8.9650 | N/A |
| old | uniform highest | EDU05 | BS Exercise and Sports Sciences | 8.6350 | N/A |
| old | uniform highest | AGR04 | BS Food Technology | 8.4650 | N/A |
| old | uniform highest | HLT08 | BS Nutrition and Dietetics | 7.9900 | N/A |
| old | uniform highest | BUS06 | BS Entrepreneurship | 7.9850 | N/A |
| old | p=.75 lowest | ENG03 | BS Electrical Engineering | 93.6667 | 51.0000 |
| old | p=.75 lowest | SOC07 | BA Philosophy | 94.6667 | 72.3333 |
| old | p=.75 lowest | HLT04 | BS Physical Therapy | 94.6667 | 76.6667 |
| old | p=.75 lowest | SOC04 | BA Political Science | 95.3333 | 70.6667 |
| old | p=.75 lowest | SOC10 | Bachelor of Library and Information Science | 95.3333 | 82.6667 |
| old | p=.75 highest | HLT07 | BS Public Health | 98.6667 | 81.0000 |
| old | p=.75 highest | HLT10 | Doctor of Veterinary Medicine | 98.3333 | 85.3333 |
| old | p=.75 highest | ENG09 | BS Mining Engineering | 98.3333 | 84.6667 |
| old | p=.75 highest | SCI08 | BS Statistics | 98.3333 | 83.0000 |
| old | p=.75 highest | EDU01 | Bachelor of Elementary Education | 98.3333 | 82.3333 |
| new | uniform lowest | SCI10 | BS Geology | 4.0650 | N/A |
| new | uniform lowest | SCI09 | BS Environmental Science | 4.2100 | N/A |
| new | uniform lowest | SCI11 | BS Meteorology | 4.3500 | N/A |
| new | uniform lowest | SCI04 | BS Physics | 4.3750 | N/A |
| new | uniform lowest | SCI01 | BS Biology | 4.4050 | N/A |
| new | uniform highest | ART01 | Bachelor of Fine Arts | 7.4600 | N/A |
| new | uniform highest | ART04 | BS Interior Design | 7.3950 | N/A |
| new | uniform highest | ART02 | Bachelor of Performing Arts | 7.3500 | N/A |
| new | uniform highest | ART05 | Bachelor of Landscape Architecture | 7.2900 | N/A |
| new | uniform highest | SOC11 | BS Criminology | 7.2650 | N/A |
| new | p=.75 lowest | ENG07 | BS Industrial Engineering | 98.3333 | 92.3333 |
| new | p=.75 lowest | SOC13 | BA Broadcasting | 98.6667 | 80.3333 |
| new | p=.75 lowest | SCI05 | BS Applied Physics | 98.6667 | 90.0000 |
| new | p=.75 lowest | SCI10 | BS Geology | 99.0000 | 75.3333 |
| new | p=.75 lowest | SCI07 | BS Applied Mathematics | 99.0000 | 84.0000 |
| new | p=.75 highest | ENG13 | Bachelor of Industrial Technology | 100.0000 | 99.6667 |
| new | p=.75 highest | BUS07 | BS Office Administration | 100.0000 | 99.0000 |
| new | p=.75 highest | EDU08 | Bachelor of Technical-Vocational Teacher Education | 100.0000 | 98.6667 |
| new | p=.75 highest | SOC11 | BS Criminology | 100.0000 | 98.0000 |
| new | p=.75 highest | HLT08 | BS Nutrition and Dietetics | 100.0000 | 98.0000 |

At p=1, all courses reached the top 5 in all 300 profiles each, but rank 1 was not guaranteed. Lowest rank-one recovery: old ENG13, 231/300 (77.0000%); new ENG11, 254/300 (84.6667%). New-route linked-elective inclusion at p=1 was exactly 76,500/127,500 = 60%, reflecting the cap.

## Task 3: full-model witness replay

| Cases | Passed | Failed | Additional GAS course | GAS lead | Search attempts |
| --- | --- | --- | --- | --- | --- |
| 171 | 171 | 0 | BUS01 | 6 | 1 |

The 170 verified witnesses were converted using createEmptySession, mergeSession, valleyPatch and normalizeSession, validated with fromSession, then passed to buildRecommendations and buildExplorerReport. Actual createExplorerReport PDFs were generated and text-extracted with the existing bundled pypdf; no surrogate PDF text model was invented. Every expected target ranked first. The five displayed courses had details, schools and salary fields. Student labels, profiles and all emitted PDF text were checked for percent signs and numeric score/point/rating labels. Ranks, grades, GWA, salaries, dates and CHED references remain legitimate non-score numbers. Generated PDFs had 6 or 7 pages. Failures by witness ID: none.

No stored old witness used GAS. A fixed-order search with seed career-compass:prompt27:gas-witness:v1 found BUS01 with GAS and a strict lead of 6. The first candidate passed, so no random subject draw was needed. It was re-scored with the real engine and satisfies the same PASS rule (unique highest total, lead at least 3). This QA-only case is saved in docs/qa/gas-witness.json, is not part of the verified 170, and was added as case 171. data/v2/witnesses.json is unchanged.

## Task 4: browser sample

Saved answers were LOADED, not typed. The sample was fixed before browser replay and covers six old and six new sessions, all nine course groups, BUS02, SCI02 and the QA-only GAS case. A local-only script served the existing production HTML/RSC/JS artifacts at an isolated local origin and used the app's normal careerCompassSession localStorage record and version. No application source or learner session on the normal development origin was changed. Each case opened Processing, then Results, then downloaded the actual app PDF.

| Case | Witness | Route | Group | Observed Rank 1 | PDF pages | Text checks | Download bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | BUS02-old | old | Business and Management | BUS02 | 6 | PASS | 25020 |
| 2 | ICT01-old | old | Computing | ICT01 | 6 | PASS | 26676 |
| 3 | ENG01-old | old | Engineering and Technology | ENG01 | 6 | PASS | 26442 |
| 4 | SCI02-old | old | Science and Mathematics | SCI02 | 6 | PASS | 24990 |
| 5 | AGR01-old | old | Agriculture, Fisheries, and Food | AGR01 | 6 | PASS | 26178 |
| 6 | BUS01-old-GAS-QA | old | Business and Management | BUS01 | 6 | PASS | 26590 |
| 7 | HLT01-new | new | Health and Allied Sciences | HLT01 | 6 | PASS | 25795 |
| 8 | EDU01-new | new | Education and Sports | EDU01 | 6 | PASS | 28777 |
| 9 | SOC01-new | new | Social Sciences, Communication, and Humanities | SOC01 | 6 | PASS | 25519 |
| 10 | ART01-new | new | Arts, Design, and Architecture | ART01 | 6 | PASS | 24840 |
| 11 | BUS01-new | new | Business and Management | BUS01 | 6 | PASS | 26310 |
| 12 | SCI01-new | new | Science and Mathematics | SCI01 | 6 | PASS | 25712 |

Browser cases: 12/12 passed for the specified ranking/download/text checks; console errors: 0. Required report sections and the first listed course name were found in every downloaded PDF; no percent signs or numeric score labels were found. SCI02's career note was present. Browser-tool download event handling was slow, so its wait durations are not app performance measurements. The initial sandbox server was unreachable; the approved host-side retry was reachable. The first ENG01 click reached the report confirmation but did not leave a retained file, so that exact case was repeated with download capture; its final file passed. No profile was replaced or retuned.

Server-log review exposed icon.png and _next/image 404s in the initial static QA harness, despite empty captured console error logs. These are retained as harness limitations. A harness-only repair serves the existing icon and original local images, without Next image optimization. A separate post-fix BUS02 replay checks asset loading; evidence is in docs/qa/browser-assets.json. The original 12 passes do not claim that all image requests succeeded. This tests saved-session replay, not typing, form usability, Next image optimization or every possible browser/device.

## Task 5: data sanity

| Check | Count |
| --- | --- |
| Course records | 85 |
| Careers | 463 |
| Duplicate titles within course | 0 |
| Salary high below 1.5 x low | 0 |
| Salary high above 100,000 | 3 |
| Courses with fewer than 4 careers | 5 |
| Courses with more than 10 careers | 0 |
| Unparsed salary strings | 0 |
| Empty required detail fields | 0 |
| Obvious encoding candidates | 0 |
| Empty/null inventory entries | 603 |
| Explicit school group/type/code structural flags | 0 |

Salary review items (arithmetic flags, not a claim that the estimates are wrong):

| Course | Career title | Original salary | High / low | Flag |
| --- | --- | --- | --- | --- |
| ICT03 | machine learning or data roles | ₱55,000–₱132,000/month | 2.400000 | high-exceeds-100000 |
| ENG04 | automation support | ₱53,000–₱127,000/month | 2.396226 | high-exceeds-100000 |
| ENG15 | seafarer career pathway toward deck officer or ship captain | ₱52,000–₱124,000/month | 2.384615 | high-exceeds-100000 |

Career-count review items:

| Course | Name | Careers |
| --- | --- | --- |
| ENG14 | BS Marine Engineering | 3 |
| ENG15 | BS Marine Transportation | 3 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 2 |
| HLT06 | BS Radiologic Technology | 3 |
| EDU01 | Bachelor of Elementary Education | 3 |

Duplicate title scan uses case/whitespace-normalized exact titles; it does not infer synonyms. There were no unparsed salaries and no obvious replacement characters, common mojibake patterns or invalid control characters in JSON detail text. This pattern scan does not prove all text is correctly encoded.

### Empty/null inventory

This is an inventory, not a defect count. Required detail fields are checked separately. Nullable career notes and school locations, empty optional suffixes/source cells, the empty pilot list and optional empty arrays are retained as found. No values were filled or changed. The full 603 field paths are in the appendix and JSON.

| File | Null | Empty string | Empty array | Empty object |
| --- | --- | --- | --- | --- |
| course-details.json | 403 | 0 | 0 | 0 |
| items.json | 11 | 0 | 0 | 0 |
| pilot-schools.json | 0 | 0 | 1 | 0 |
| salary-sources.json | 0 | 10 | 0 | 0 |
| schools.json | 91 | 1 | 86 | 0 |

### School academic-group comparison: NOT DETERMINED

School.group contains geographic values bicol/national; courses use nine academic groups. The data supplies no academic-scope whitelist for schools. A clarification was requested; no academic rule was supplied for this report. It would be a guess to declare programs inconsistent based on a school name. No such judgment was made. Explicit group/type/code checks found no structural inconsistency, and all 51 school rows with their coded programs and course-group sets are listed below for review. This is not a finding of academic consistency.

## Tests, limits and reproducibility

npm test: 83 tests, 82 passed, 0 failed, 1 pre-existing pilot-school skip. Existing verifiers passed: links, details, reachability (170 PASS, 0 WARN/TIE/FAIL) and routes (96 HTML/RSC route pairs). The new simulation and browser-PDF verifiers passed. Scope hashes found no change to any pre-existing file, including scoring, data/v2, UI, i18n, dependencies and the verified witness file. The reachability verifier rewrote its outputs byte-identically. No commit or staging was performed.

| Output | SHA-256, identical in both final full runs |
| --- | --- |
| docs/qa/uniform-profiles.json | 8854843b3d10bc49a457e58c6c6e912e5ee30b6ef087f92dc7e98047d6276cef |
| docs/qa/uniform-profiles.csv | 60b94a2ac5e7cc6d736050f1977215712645bbab054e0f987c8b7fd90befcb7d |
| docs/qa/recoverability.json | cc263d57bef00319b5a177a80702b71a37cc7d8afa3cca37103daca47c3854a1 |
| docs/qa/recoverability.csv | 7aa47af983ee476ac2c14a94c392ed960e09b24b97544d87927a9829d821b852 |

The numerical results are descriptive of these generators and finite samples. There are no empirical student data, group fairness tests, external criterion labels or real-world outcome measurements here. A high target-persona rate is partly expected because the generator uses the same mappings as scoring. Shared item links and tie-breaks can still change rank 1. The three-elective cap, uniform GWA tiers and artificial count distributions materially shape these results. No observed rate proves impossibility, guarantees an individual result, or establishes course suitability. Browser checks cover a fixed 12-case desktop sample; they do not establish form completion, screen-reader, real-phone, print-dialog or offline-device correctness. School academic-scope consistency remains NOT DETERMINED. No findings were used to tune the model.

## Appendix A: every uniform course, overall and by GWA

Shares are percentages; counts and mean ranks use the row's N. Full precision is retained in docs/qa/uniform-profiles.json and CSV.


### old, all, N=20000

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 195 | 1242 | 42.892550 | 6.2100 |
| BUS02 | BS Management Accounting | 182 | 1203 | 43.047400 | 6.0150 |
| BUS03 | BS Accounting Information Systems | 349 | 1338 | 43.146300 | 6.6900 |
| BUS04 | BS Internal Auditing | 171 | 1234 | 42.916950 | 6.1700 |
| BUS05 | BS Business Administration | 170 | 1137 | 43.155100 | 5.6850 |
| BUS06 | BS Entrepreneurship | 461 | 1597 | 43.125950 | 7.9850 |
| BUS07 | BS Office Administration | 274 | 1232 | 43.028550 | 6.1600 |
| BUS08 | Economics (BA/BS) | 222 | 1198 | 42.840950 | 5.9900 |
| BUS09 | BS Tourism Management | 320 | 1273 | 43.036050 | 6.3650 |
| BUS10 | BS Hospitality Management | 201 | 1208 | 42.952800 | 6.0400 |
| ICT01 | BS Information Technology | 189 | 1333 | 43.310250 | 6.6650 |
| ICT02 | BS Information Systems | 273 | 1336 | 43.125650 | 6.6800 |
| ICT03 | BS Computer Science | 246 | 1344 | 43.226800 | 6.7200 |
| ENG01 | BS Civil Engineering | 156 | 903 | 42.929600 | 4.5150 |
| ENG02 | BS Mechanical Engineering | 267 | 1245 | 43.194950 | 6.2250 |
| ENG03 | BS Electrical Engineering | 168 | 1252 | 43.075900 | 6.2600 |
| ENG04 | BS Electronics Engineering | 232 | 1336 | 43.234300 | 6.6800 |
| ENG05 | BS Computer Engineering | 253 | 1315 | 43.249750 | 6.5750 |
| ENG06 | BS Chemical Engineering | 144 | 913 | 42.997950 | 4.5650 |
| ENG07 | BS Industrial Engineering | 392 | 1294 | 42.930900 | 6.4700 |
| ENG08 | BS Geodetic Engineering | 131 | 901 | 42.960300 | 4.5050 |
| ENG09 | BS Mining Engineering | 221 | 1237 | 43.057050 | 6.1850 |
| ENG10 | BS Materials Engineering | 204 | 1218 | 42.917400 | 6.0900 |
| ENG11 | BS Metallurgical Engineering | 180 | 1221 | 43.047500 | 6.1050 |
| ENG12 | BS Agricultural and Biosystems Engineering | 390 | 1303 | 43.155000 | 6.5150 |
| ENG13 | Bachelor of Industrial Technology | 202 | 1250 | 43.321150 | 6.2500 |
| ENG14 | BS Marine Engineering | 258 | 1185 | 43.103100 | 5.9250 |
| ENG15 | BS Marine Transportation | 328 | 1269 | 42.888200 | 6.3450 |
| SCI01 | BS Biology | 176 | 965 | 42.674850 | 4.8250 |
| SCI02 | BS Marine Biology | 143 | 1347 | 43.031300 | 6.7350 |
| SCI03 | BS Chemistry | 136 | 892 | 42.894650 | 4.4600 |
| SCI04 | BS Physics | 124 | 887 | 42.988700 | 4.4350 |
| SCI05 | BS Applied Physics | 136 | 881 | 43.146300 | 4.4050 |
| SCI06 | BS Mathematics | 157 | 921 | 42.971500 | 4.6050 |
| SCI07 | BS Applied Mathematics | 269 | 1120 | 42.850450 | 5.6000 |
| SCI08 | BS Statistics | 244 | 1214 | 42.775700 | 6.0700 |
| SCI09 | BS Environmental Science | 155 | 1307 | 42.871950 | 6.5350 |
| SCI10 | BS Geology | 182 | 924 | 42.920900 | 4.6200 |
| SCI11 | BS Meteorology | 148 | 823 | 43.037500 | 4.1150 |
| AGR01 | BS Agriculture | 346 | 1364 | 43.222150 | 6.8200 |
| AGR02 | BS Forestry | 178 | 1373 | 43.115100 | 6.8650 |
| AGR03 | BS Fisheries | 189 | 1391 | 43.137000 | 6.9550 |
| AGR04 | BS Food Technology | 436 | 1693 | 43.129350 | 8.4650 |
| HLT01 | BS Nursing | 185 | 1038 | 43.120200 | 5.1900 |
| HLT02 | BS Pharmacy | 185 | 1013 | 42.669150 | 5.0650 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 206 | 1057 | 42.781400 | 5.2850 |
| HLT04 | BS Physical Therapy | 211 | 1119 | 42.944500 | 5.5950 |
| HLT05 | BS Occupational Therapy | 189 | 1098 | 43.157450 | 5.4900 |
| HLT06 | BS Radiologic Technology | 195 | 958 | 43.018200 | 4.7900 |
| HLT07 | BS Public Health | 164 | 920 | 42.919100 | 4.6000 |
| HLT08 | BS Nutrition and Dietetics | 396 | 1598 | 43.206900 | 7.9900 |
| HLT09 | Doctor of Dental Medicine | 195 | 1025 | 43.163450 | 5.1250 |
| HLT10 | Doctor of Veterinary Medicine | 362 | 1336 | 42.862200 | 6.6800 |
| EDU01 | Bachelor of Elementary Education | 167 | 951 | 42.882400 | 4.7550 |
| EDU02 | Bachelor of Secondary Education | 165 | 909 | 42.773300 | 4.5450 |
| EDU03 | Bachelor of Early Childhood Education | 198 | 1016 | 42.921650 | 5.0800 |
| EDU04 | Bachelor of Physical Education | 581 | 1793 | 42.921000 | 8.9650 |
| EDU05 | BS Exercise and Sports Sciences | 569 | 1727 | 43.056400 | 8.6350 |
| EDU06 | Bachelor of Culture and Arts Education | 325 | 1455 | 43.218350 | 7.2750 |
| EDU07 | Bachelor of Technology and Livelihood Education | 352 | 1596 | 43.276150 | 7.9800 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 412 | 1541 | 43.114100 | 7.7050 |
| SOC01 | Psychology (BA/BS) | 179 | 948 | 42.966000 | 4.7400 |
| SOC02 | BS Social Work | 131 | 900 | 43.031400 | 4.5000 |
| SOC03 | Bachelor in Human Services | 209 | 994 | 42.886600 | 4.9700 |
| SOC04 | BA Political Science | 70 | 764 | 42.652700 | 3.8200 |
| SOC05 | BA Sociology | 154 | 929 | 42.762500 | 4.6450 |
| SOC06 | BA History | 96 | 767 | 42.718650 | 3.8350 |
| SOC07 | BA Philosophy | 143 | 831 | 43.026150 | 4.1550 |
| SOC08 | Anthropology (BA/BS) | 159 | 959 | 42.897200 | 4.7950 |
| SOC09 | Bachelor of Public Administration | 190 | 911 | 42.619550 | 4.5550 |
| SOC10 | Bachelor of Library and Information Science | 347 | 1343 | 43.037700 | 6.7150 |
| SOC11 | BS Criminology | 301 | 1099 | 42.887700 | 5.4950 |
| SOC12 | BA Communication | 320 | 1189 | 42.795750 | 5.9450 |
| SOC13 | BA Broadcasting | 216 | 1008 | 43.055550 | 5.0400 |
| SOC14 | BA Journalism | 187 | 1051 | 42.758450 | 5.2550 |
| SOC15 | BS Development Communication | 180 | 893 | 42.804600 | 4.4650 |
| SOC16 | BA English Language Studies | 174 | 997 | 42.763350 | 4.9850 |
| SOC17 | BA Literature | 143 | 983 | 42.879950 | 4.9150 |
| SOC18 | BA Filipino | 155 | 946 | 42.893750 | 4.7300 |
| ART01 | Bachelor of Fine Arts | 210 | 1534 | 43.222300 | 7.6700 |
| ART02 | Bachelor of Performing Arts | 381 | 1482 | 43.149250 | 7.4100 |
| ART03 | Bachelor of Multimedia Arts | 279 | 1421 | 43.109000 | 7.1050 |
| ART04 | BS Interior Design | 232 | 1432 | 43.235300 | 7.1600 |
| ART05 | Bachelor of Landscape Architecture | 367 | 1427 | 43.130000 | 7.1350 |
| ART06 | BS Architecture | 322 | 1423 | 43.074950 | 7.1150 |

### old, below75, N=3322

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 43 | 227 | 42.556893 | 6.8332 |
| BUS02 | BS Management Accounting | 36 | 180 | 42.971102 | 5.4184 |
| BUS03 | BS Accounting Information Systems | 50 | 195 | 42.931668 | 5.8700 |
| BUS04 | BS Internal Auditing | 46 | 237 | 42.437387 | 7.1343 |
| BUS05 | BS Business Administration | 40 | 179 | 43.334136 | 5.3883 |
| BUS06 | BS Entrepreneurship | 68 | 219 | 43.100542 | 6.5924 |
| BUS07 | BS Office Administration | 41 | 189 | 43.105659 | 5.6893 |
| BUS08 | Economics (BA/BS) | 41 | 221 | 41.943107 | 6.6526 |
| BUS09 | BS Tourism Management | 56 | 224 | 42.611981 | 6.7429 |
| BUS10 | BS Hospitality Management | 34 | 210 | 42.770921 | 6.3215 |
| ICT01 | BS Information Technology | 30 | 199 | 43.399458 | 5.9904 |
| ICT02 | BS Information Systems | 39 | 197 | 43.165563 | 5.9302 |
| ICT03 | BS Computer Science | 37 | 195 | 42.720349 | 5.8700 |
| ENG01 | BS Civil Engineering | 39 | 174 | 42.232089 | 5.2378 |
| ENG02 | BS Mechanical Engineering | 48 | 195 | 42.897351 | 5.8700 |
| ENG03 | BS Electrical Engineering | 23 | 198 | 42.995485 | 5.9603 |
| ENG04 | BS Electronics Engineering | 30 | 201 | 43.231788 | 6.0506 |
| ENG05 | BS Computer Engineering | 40 | 205 | 43.141180 | 6.1710 |
| ENG06 | BS Chemical Engineering | 32 | 184 | 42.310957 | 5.5388 |
| ENG07 | BS Industrial Engineering | 47 | 206 | 43.246237 | 6.2011 |
| ENG08 | BS Geodetic Engineering | 26 | 168 | 42.253161 | 5.0572 |
| ENG09 | BS Mining Engineering | 31 | 182 | 43.026791 | 5.4786 |
| ENG10 | BS Materials Engineering | 35 | 197 | 43.210716 | 5.9302 |
| ENG11 | BS Metallurgical Engineering | 19 | 177 | 42.958158 | 5.3281 |
| ENG12 | BS Agricultural and Biosystems Engineering | 46 | 198 | 42.550873 | 5.9603 |
| ENG13 | Bachelor of Industrial Technology | 32 | 183 | 43.605960 | 5.5087 |
| ENG14 | BS Marine Engineering | 43 | 176 | 43.145394 | 5.2980 |
| ENG15 | BS Marine Transportation | 49 | 192 | 42.977122 | 5.7797 |
| SCI01 | BS Biology | 43 | 192 | 41.843468 | 5.7797 |
| SCI02 | BS Marine Biology | 23 | 186 | 43.359422 | 5.5990 |
| SCI03 | BS Chemistry | 29 | 204 | 41.770319 | 6.1409 |
| SCI04 | BS Physics | 33 | 162 | 42.474112 | 4.8766 |
| SCI05 | BS Applied Physics | 23 | 180 | 43.149910 | 5.4184 |
| SCI06 | BS Mathematics | 25 | 165 | 41.896448 | 4.9669 |
| SCI07 | BS Applied Mathematics | 39 | 183 | 42.019266 | 5.5087 |
| SCI08 | BS Statistics | 53 | 215 | 42.139976 | 6.4720 |
| SCI09 | BS Environmental Science | 31 | 188 | 42.977122 | 5.6592 |
| SCI10 | BS Geology | 35 | 160 | 42.371162 | 4.8164 |
| SCI11 | BS Meteorology | 25 | 152 | 42.294100 | 4.5756 |
| AGR01 | BS Agriculture | 52 | 216 | 42.961168 | 6.5021 |
| AGR02 | BS Forestry | 24 | 206 | 43.311559 | 6.2011 |
| AGR03 | BS Fisheries | 30 | 210 | 43.388320 | 6.3215 |
| AGR04 | BS Food Technology | 76 | 264 | 42.318182 | 7.9470 |
| HLT01 | BS Nursing | 37 | 203 | 42.660747 | 6.1108 |
| HLT02 | BS Pharmacy | 37 | 198 | 42.519266 | 5.9603 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 38 | 216 | 42.831126 | 6.5021 |
| HLT04 | BS Physical Therapy | 36 | 208 | 42.756472 | 6.2613 |
| HLT05 | BS Occupational Therapy | 34 | 212 | 42.803432 | 6.3817 |
| HLT06 | BS Radiologic Technology | 41 | 186 | 43.295906 | 5.5990 |
| HLT07 | BS Public Health | 31 | 180 | 42.762793 | 5.4184 |
| HLT08 | BS Nutrition and Dietetics | 50 | 221 | 42.886514 | 6.6526 |
| HLT09 | Doctor of Dental Medicine | 40 | 197 | 43.686334 | 5.9302 |
| HLT10 | Doctor of Veterinary Medicine | 47 | 201 | 42.667971 | 6.0506 |
| EDU01 | Bachelor of Elementary Education | 36 | 200 | 43.948826 | 6.0205 |
| EDU02 | Bachelor of Secondary Education | 30 | 173 | 43.632149 | 5.2077 |
| EDU03 | Bachelor of Early Childhood Education | 43 | 216 | 43.936785 | 6.5021 |
| EDU04 | Bachelor of Physical Education | 59 | 220 | 42.949127 | 6.6225 |
| EDU05 | BS Exercise and Sports Sciences | 54 | 221 | 43.228176 | 6.6526 |
| EDU06 | Bachelor of Culture and Arts Education | 46 | 202 | 44.126731 | 6.0807 |
| EDU07 | Bachelor of Technology and Livelihood Education | 54 | 204 | 43.717038 | 6.1409 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 52 | 219 | 43.294702 | 6.5924 |
| SOC01 | Psychology (BA/BS) | 43 | 178 | 42.726370 | 5.3582 |
| SOC02 | BS Social Work | 25 | 182 | 42.963877 | 5.4786 |
| SOC03 | Bachelor in Human Services | 37 | 162 | 43.375978 | 4.8766 |
| SOC04 | BA Political Science | 18 | 153 | 43.464479 | 4.6057 |
| SOC05 | BA Sociology | 30 | 182 | 42.611078 | 5.4786 |
| SOC06 | BA History | 19 | 154 | 43.328116 | 4.6358 |
| SOC07 | BA Philosophy | 27 | 169 | 43.479831 | 5.0873 |
| SOC08 | Anthropology (BA/BS) | 43 | 191 | 43.323901 | 5.7495 |
| SOC09 | Bachelor of Public Administration | 44 | 166 | 43.040337 | 4.9970 |
| SOC10 | Bachelor of Library and Information Science | 45 | 200 | 43.162252 | 6.0205 |
| SOC11 | BS Criminology | 66 | 215 | 43.487056 | 6.4720 |
| SOC12 | BA Communication | 54 | 192 | 42.759181 | 5.7797 |
| SOC13 | BA Broadcasting | 39 | 189 | 43.997893 | 5.6893 |
| SOC14 | BA Journalism | 49 | 204 | 42.854606 | 6.1409 |
| SOC15 | BS Development Communication | 33 | 174 | 43.118302 | 5.2378 |
| SOC16 | BA English Language Studies | 38 | 200 | 42.771523 | 6.0205 |
| SOC17 | BA Literature | 25 | 191 | 43.250151 | 5.7495 |
| SOC18 | BA Filipino | 28 | 187 | 43.459362 | 5.6291 |
| ART01 | Bachelor of Fine Arts | 38 | 225 | 43.851294 | 6.7730 |
| ART02 | Bachelor of Performing Arts | 47 | 206 | 44.030403 | 6.2011 |
| ART03 | Bachelor of Multimedia Arts | 45 | 201 | 44.084287 | 6.0506 |
| ART04 | BS Interior Design | 31 | 190 | 43.335039 | 5.7194 |
| ART05 | Bachelor of Landscape Architecture | 50 | 214 | 42.985852 | 6.4419 |
| ART06 | BS Architecture | 41 | 217 | 42.728176 | 6.5322 |

### old, 75to79, N=3298

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 31 | 211 | 42.641904 | 6.3978 |
| BUS02 | BS Management Accounting | 38 | 211 | 42.403275 | 6.3978 |
| BUS03 | BS Accounting Information Systems | 63 | 216 | 43.405397 | 6.5494 |
| BUS04 | BS Internal Auditing | 29 | 204 | 42.696483 | 6.1856 |
| BUS05 | BS Business Administration | 31 | 203 | 42.792602 | 6.1552 |
| BUS06 | BS Entrepreneurship | 62 | 254 | 43.371740 | 7.7016 |
| BUS07 | BS Office Administration | 51 | 216 | 42.538205 | 6.5494 |
| BUS08 | Economics (BA/BS) | 42 | 204 | 42.889327 | 6.1856 |
| BUS09 | BS Tourism Management | 54 | 214 | 43.325349 | 6.4888 |
| BUS10 | BS Hospitality Management | 44 | 233 | 42.838084 | 7.0649 |
| ICT01 | BS Information Technology | 29 | 195 | 43.441783 | 5.9127 |
| ICT02 | BS Information Systems | 41 | 195 | 43.546695 | 5.9127 |
| ICT03 | BS Computer Science | 32 | 197 | 43.485143 | 5.9733 |
| ENG01 | BS Civil Engineering | 35 | 197 | 42.282292 | 5.9733 |
| ENG02 | BS Mechanical Engineering | 48 | 202 | 43.789266 | 6.1249 |
| ENG03 | BS Electrical Engineering | 34 | 217 | 43.733172 | 6.5797 |
| ENG04 | BS Electronics Engineering | 47 | 194 | 43.373863 | 5.8824 |
| ENG05 | BS Computer Engineering | 38 | 185 | 43.529715 | 5.6095 |
| ENG06 | BS Chemical Engineering | 19 | 167 | 42.696180 | 5.0637 |
| ENG07 | BS Industrial Engineering | 61 | 218 | 42.120073 | 6.6101 |
| ENG08 | BS Geodetic Engineering | 24 | 161 | 42.714372 | 4.8817 |
| ENG09 | BS Mining Engineering | 36 | 199 | 43.140085 | 6.0340 |
| ENG10 | BS Materials Engineering | 30 | 195 | 42.839600 | 5.9127 |
| ENG11 | BS Metallurgical Engineering | 41 | 201 | 43.102790 | 6.0946 |
| ENG12 | BS Agricultural and Biosystems Engineering | 50 | 189 | 42.904488 | 5.7307 |
| ENG13 | Bachelor of Industrial Technology | 34 | 207 | 43.864767 | 6.2765 |
| ENG14 | BS Marine Engineering | 44 | 189 | 43.141601 | 5.7307 |
| ENG15 | BS Marine Transportation | 62 | 211 | 42.553062 | 6.3978 |
| SCI01 | BS Biology | 40 | 179 | 42.824439 | 5.4275 |
| SCI02 | BS Marine Biology | 25 | 195 | 43.405700 | 5.9127 |
| SCI03 | BS Chemistry | 24 | 156 | 42.983930 | 4.7301 |
| SCI04 | BS Physics | 24 | 151 | 43.251364 | 4.5785 |
| SCI05 | BS Applied Physics | 26 | 151 | 43.316555 | 4.5785 |
| SCI06 | BS Mathematics | 26 | 158 | 42.976046 | 4.7908 |
| SCI07 | BS Applied Mathematics | 38 | 164 | 43.098241 | 4.9727 |
| SCI08 | BS Statistics | 36 | 211 | 42.560946 | 6.3978 |
| SCI09 | BS Environmental Science | 20 | 195 | 43.231352 | 5.9127 |
| SCI10 | BS Geology | 34 | 168 | 43.181625 | 5.0940 |
| SCI11 | BS Meteorology | 27 | 136 | 43.365676 | 4.1237 |
| AGR01 | BS Agriculture | 42 | 228 | 43.016070 | 6.9133 |
| AGR02 | BS Forestry | 29 | 195 | 43.397210 | 5.9127 |
| AGR03 | BS Fisheries | 35 | 218 | 43.003032 | 6.6101 |
| AGR04 | BS Food Technology | 71 | 247 | 44.111280 | 7.4894 |
| HLT01 | BS Nursing | 27 | 149 | 43.571559 | 4.5179 |
| HLT02 | BS Pharmacy | 36 | 191 | 42.536992 | 5.7914 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 38 | 195 | 42.544572 | 5.9127 |
| HLT04 | BS Physical Therapy | 33 | 187 | 43.308672 | 5.6701 |
| HLT05 | BS Occupational Therapy | 31 | 185 | 43.540934 | 5.6095 |
| HLT06 | BS Radiologic Technology | 25 | 152 | 43.263493 | 4.6089 |
| HLT07 | BS Public Health | 36 | 167 | 43.300788 | 5.0637 |
| HLT08 | BS Nutrition and Dietetics | 62 | 215 | 43.750455 | 6.5191 |
| HLT09 | Doctor of Dental Medicine | 35 | 185 | 43.248636 | 5.6095 |
| HLT10 | Doctor of Veterinary Medicine | 45 | 211 | 43.493936 | 6.3978 |
| EDU01 | Bachelor of Elementary Education | 28 | 156 | 42.722862 | 4.7301 |
| EDU02 | Bachelor of Secondary Education | 23 | 151 | 42.334445 | 4.5785 |
| EDU03 | Bachelor of Early Childhood Education | 37 | 175 | 42.831413 | 5.3062 |
| EDU04 | Bachelor of Physical Education | 70 | 258 | 42.808369 | 7.8229 |
| EDU05 | BS Exercise and Sports Sciences | 75 | 247 | 43.261674 | 7.4894 |
| EDU06 | Bachelor of Culture and Arts Education | 45 | 222 | 42.657671 | 6.7314 |
| EDU07 | Bachelor of Technology and Livelihood Education | 57 | 248 | 43.195573 | 7.5197 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 53 | 229 | 43.088842 | 6.9436 |
| SOC01 | Psychology (BA/BS) | 30 | 166 | 43.677380 | 5.0334 |
| SOC02 | BS Social Work | 26 | 155 | 43.528502 | 4.6998 |
| SOC03 | Bachelor in Human Services | 36 | 201 | 43.131595 | 6.0946 |
| SOC04 | BA Political Science | 18 | 146 | 42.684961 | 4.4269 |
| SOC05 | BA Sociology | 29 | 162 | 43.281079 | 4.9121 |
| SOC06 | BA History | 25 | 144 | 42.842935 | 4.3663 |
| SOC07 | BA Philosophy | 32 | 163 | 43.298363 | 4.9424 |
| SOC08 | Anthropology (BA/BS) | 25 | 165 | 43.743784 | 5.0030 |
| SOC09 | Bachelor of Public Administration | 30 | 162 | 42.457853 | 4.9121 |
| SOC10 | Bachelor of Library and Information Science | 54 | 218 | 42.600061 | 6.6101 |
| SOC11 | BS Criminology | 55 | 198 | 42.797756 | 6.0036 |
| SOC12 | BA Communication | 52 | 199 | 41.696483 | 6.0340 |
| SOC13 | BA Broadcasting | 45 | 175 | 42.229230 | 5.3062 |
| SOC14 | BA Journalism | 33 | 184 | 42.320800 | 5.5791 |
| SOC15 | BS Development Communication | 35 | 154 | 42.889327 | 4.6695 |
| SOC16 | BA English Language Studies | 35 | 195 | 42.237113 | 5.9127 |
| SOC17 | BA Literature | 23 | 159 | 42.222862 | 4.8211 |
| SOC18 | BA Filipino | 25 | 187 | 42.013341 | 5.6701 |
| ART01 | Bachelor of Fine Arts | 35 | 245 | 42.803517 | 7.4287 |
| ART02 | Bachelor of Performing Arts | 55 | 218 | 43.249848 | 6.6101 |
| ART03 | Bachelor of Multimedia Arts | 38 | 226 | 42.468163 | 6.8526 |
| ART04 | BS Interior Design | 48 | 234 | 43.006367 | 7.0952 |
| ART05 | Bachelor of Landscape Architecture | 64 | 233 | 42.958763 | 7.0649 |
| ART06 | BS Architecture | 47 | 241 | 42.514251 | 7.3075 |

### old, 80to84, N=3325

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 31 | 193 | 42.963008 | 5.8045 |
| BUS02 | BS Management Accounting | 31 | 217 | 43.381955 | 6.5263 |
| BUS03 | BS Accounting Information Systems | 57 | 209 | 43.266165 | 6.2857 |
| BUS04 | BS Internal Auditing | 21 | 198 | 43.261053 | 5.9549 |
| BUS05 | BS Business Administration | 23 | 185 | 43.371128 | 5.5639 |
| BUS06 | BS Entrepreneurship | 77 | 252 | 43.222256 | 7.5789 |
| BUS07 | BS Office Administration | 45 | 203 | 42.973534 | 6.1053 |
| BUS08 | Economics (BA/BS) | 32 | 194 | 43.135338 | 5.8346 |
| BUS09 | BS Tourism Management | 48 | 218 | 43.654737 | 6.5564 |
| BUS10 | BS Hospitality Management | 30 | 193 | 43.236992 | 5.8045 |
| ICT01 | BS Information Technology | 25 | 207 | 43.919098 | 6.2256 |
| ICT02 | BS Information Systems | 42 | 220 | 43.630376 | 6.6165 |
| ICT03 | BS Computer Science | 28 | 205 | 43.823759 | 6.1654 |
| ENG01 | BS Civil Engineering | 17 | 127 | 43.580150 | 3.8195 |
| ENG02 | BS Mechanical Engineering | 34 | 215 | 43.128722 | 6.4662 |
| ENG03 | BS Electrical Engineering | 35 | 213 | 42.683609 | 6.4060 |
| ENG04 | BS Electronics Engineering | 32 | 220 | 43.702256 | 6.6165 |
| ENG05 | BS Computer Engineering | 48 | 204 | 43.459248 | 6.1353 |
| ENG06 | BS Chemical Engineering | 24 | 150 | 43.352481 | 4.5113 |
| ENG07 | BS Industrial Engineering | 73 | 225 | 42.702857 | 6.7669 |
| ENG08 | BS Geodetic Engineering | 19 | 128 | 43.698346 | 3.8496 |
| ENG09 | BS Mining Engineering | 29 | 185 | 42.515188 | 5.5639 |
| ENG10 | BS Materials Engineering | 33 | 216 | 42.562105 | 6.4962 |
| ENG11 | BS Metallurgical Engineering | 31 | 205 | 42.533233 | 6.1654 |
| ENG12 | BS Agricultural and Biosystems Engineering | 69 | 230 | 43.913083 | 6.9173 |
| ENG13 | Bachelor of Industrial Technology | 43 | 213 | 42.743158 | 6.4060 |
| ENG14 | BS Marine Engineering | 51 | 202 | 42.944962 | 6.0752 |
| ENG15 | BS Marine Transportation | 59 | 220 | 42.402406 | 6.6165 |
| SCI01 | BS Biology | 23 | 156 | 43.337444 | 4.6917 |
| SCI02 | BS Marine Biology | 19 | 218 | 43.162406 | 6.5564 |
| SCI03 | BS Chemistry | 21 | 147 | 43.733835 | 4.4211 |
| SCI04 | BS Physics | 12 | 140 | 43.626466 | 4.2105 |
| SCI05 | BS Applied Physics | 18 | 131 | 43.858647 | 3.9398 |
| SCI06 | BS Mathematics | 27 | 151 | 43.985865 | 4.5414 |
| SCI07 | BS Applied Mathematics | 52 | 191 | 43.848722 | 5.7444 |
| SCI08 | BS Statistics | 46 | 195 | 43.366917 | 5.8647 |
| SCI09 | BS Environmental Science | 24 | 210 | 43.003308 | 6.3158 |
| SCI10 | BS Geology | 29 | 149 | 43.098647 | 4.4812 |
| SCI11 | BS Meteorology | 23 | 127 | 43.650526 | 3.8195 |
| AGR01 | BS Agriculture | 56 | 203 | 43.782857 | 6.1053 |
| AGR02 | BS Forestry | 19 | 223 | 43.211128 | 6.7068 |
| AGR03 | BS Fisheries | 26 | 223 | 43.185865 | 6.7068 |
| AGR04 | BS Food Technology | 71 | 251 | 43.068872 | 7.5489 |
| HLT01 | BS Nursing | 29 | 188 | 43.044211 | 5.6541 |
| HLT02 | BS Pharmacy | 36 | 164 | 43.054737 | 4.9323 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 37 | 189 | 42.658346 | 5.6842 |
| HLT04 | BS Physical Therapy | 40 | 216 | 42.554586 | 6.4962 |
| HLT05 | BS Occupational Therapy | 40 | 199 | 42.755789 | 5.9850 |
| HLT06 | BS Radiologic Technology | 34 | 171 | 43.206917 | 5.1429 |
| HLT07 | BS Public Health | 23 | 157 | 42.759398 | 4.7218 |
| HLT08 | BS Nutrition and Dietetics | 59 | 251 | 42.873083 | 7.5489 |
| HLT09 | Doctor of Dental Medicine | 40 | 201 | 42.991278 | 6.0451 |
| HLT10 | Doctor of Veterinary Medicine | 69 | 226 | 42.420150 | 6.7970 |
| EDU01 | Bachelor of Elementary Education | 41 | 173 | 42.571729 | 5.2030 |
| EDU02 | Bachelor of Secondary Education | 38 | 172 | 42.322707 | 5.1729 |
| EDU03 | Bachelor of Early Childhood Education | 32 | 174 | 43.040301 | 5.2331 |
| EDU04 | Bachelor of Physical Education | 85 | 278 | 43.092932 | 8.3609 |
| EDU05 | BS Exercise and Sports Sciences | 82 | 265 | 43.077895 | 7.9699 |
| EDU06 | Bachelor of Culture and Arts Education | 59 | 250 | 43.626767 | 7.5188 |
| EDU07 | Bachelor of Technology and Livelihood Education | 66 | 254 | 43.479699 | 7.6391 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 72 | 245 | 43.169925 | 7.3684 |
| SOC01 | Psychology (BA/BS) | 31 | 167 | 42.554586 | 5.0226 |
| SOC02 | BS Social Work | 23 | 169 | 42.480902 | 5.0827 |
| SOC03 | Bachelor in Human Services | 47 | 181 | 42.126015 | 5.4436 |
| SOC04 | BA Political Science | 10 | 129 | 42.154286 | 3.8797 |
| SOC05 | BA Sociology | 26 | 173 | 42.123008 | 5.2030 |
| SOC06 | BA History | 15 | 129 | 42.037594 | 3.8797 |
| SOC07 | BA Philosophy | 31 | 149 | 42.233083 | 4.4812 |
| SOC08 | Anthropology (BA/BS) | 28 | 159 | 42.615338 | 4.7820 |
| SOC09 | Bachelor of Public Administration | 26 | 138 | 42.359098 | 4.1504 |
| SOC10 | Bachelor of Library and Information Science | 55 | 227 | 43.067970 | 6.8271 |
| SOC11 | BS Criminology | 49 | 183 | 42.686917 | 5.5038 |
| SOC12 | BA Communication | 58 | 205 | 42.232180 | 6.1654 |
| SOC13 | BA Broadcasting | 40 | 185 | 42.720000 | 5.5639 |
| SOC14 | BA Journalism | 31 | 193 | 42.409624 | 5.8045 |
| SOC15 | BS Development Communication | 30 | 167 | 42.122406 | 5.0226 |
| SOC16 | BA English Language Studies | 27 | 167 | 41.937744 | 5.0226 |
| SOC17 | BA Literature | 28 | 173 | 42.279098 | 5.2030 |
| SOC18 | BA Filipino | 23 | 143 | 42.146165 | 4.3008 |
| ART01 | Bachelor of Fine Arts | 40 | 237 | 43.041504 | 7.1278 |
| ART02 | Bachelor of Performing Arts | 65 | 281 | 42.837895 | 8.4511 |
| ART03 | Bachelor of Multimedia Arts | 57 | 239 | 42.863158 | 7.1880 |
| ART04 | BS Interior Design | 36 | 231 | 43.419850 | 6.9474 |
| ART05 | Bachelor of Landscape Architecture | 62 | 235 | 43.086015 | 7.0677 |
| ART06 | BS Architecture | 52 | 230 | 43.082406 | 6.9173 |

### old, 85to89, N=3359

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 34 | 199 | 42.762132 | 5.9244 |
| BUS02 | BS Management Accounting | 23 | 197 | 42.674606 | 5.8648 |
| BUS03 | BS Accounting Information Systems | 68 | 243 | 42.964275 | 7.2343 |
| BUS04 | BS Internal Auditing | 19 | 218 | 42.665674 | 6.4900 |
| BUS05 | BS Business Administration | 31 | 197 | 42.551652 | 5.8648 |
| BUS06 | BS Entrepreneurship | 78 | 273 | 43.134266 | 8.1274 |
| BUS07 | BS Office Administration | 45 | 204 | 43.340280 | 6.0732 |
| BUS08 | Economics (BA/BS) | 49 | 211 | 42.889253 | 6.2816 |
| BUS09 | BS Tourism Management | 56 | 233 | 42.549568 | 6.9366 |
| BUS10 | BS Hospitality Management | 35 | 198 | 42.702590 | 5.8946 |
| ICT01 | BS Information Technology | 39 | 235 | 42.975886 | 6.9961 |
| ICT02 | BS Information Systems | 55 | 241 | 42.665377 | 7.1748 |
| ICT03 | BS Computer Science | 45 | 247 | 42.871390 | 7.3534 |
| ENG01 | BS Civil Engineering | 19 | 140 | 42.961298 | 4.1679 |
| ENG02 | BS Mechanical Engineering | 40 | 194 | 43.322120 | 5.7755 |
| ENG03 | BS Electrical Engineering | 25 | 210 | 43.136350 | 6.2519 |
| ENG04 | BS Electronics Engineering | 40 | 224 | 43.173266 | 6.6687 |
| ENG05 | BS Computer Engineering | 32 | 233 | 43.234594 | 6.9366 |
| ENG06 | BS Chemical Engineering | 29 | 163 | 42.728788 | 4.8526 |
| ENG07 | BS Industrial Engineering | 65 | 216 | 43.159571 | 6.4305 |
| ENG08 | BS Geodetic Engineering | 27 | 179 | 42.974099 | 5.3290 |
| ENG09 | BS Mining Engineering | 54 | 241 | 43.045252 | 7.1748 |
| ENG10 | BS Materials Engineering | 28 | 197 | 42.827032 | 5.8648 |
| ENG11 | BS Metallurgical Engineering | 30 | 215 | 43.226853 | 6.4007 |
| ENG12 | BS Agricultural and Biosystems Engineering | 71 | 217 | 43.526049 | 6.4603 |
| ENG13 | Bachelor of Industrial Technology | 26 | 207 | 43.227449 | 6.1625 |
| ENG14 | BS Marine Engineering | 33 | 184 | 43.416195 | 5.4778 |
| ENG15 | BS Marine Transportation | 58 | 210 | 43.200655 | 6.2519 |
| SCI01 | BS Biology | 24 | 147 | 42.314082 | 4.3763 |
| SCI02 | BS Marine Biology | 25 | 239 | 42.743674 | 7.1152 |
| SCI03 | BS Chemistry | 25 | 153 | 42.673712 | 4.5549 |
| SCI04 | BS Physics | 22 | 151 | 42.804108 | 4.4954 |
| SCI05 | BS Applied Physics | 24 | 151 | 43.091992 | 4.4954 |
| SCI06 | BS Mathematics | 32 | 158 | 43.308723 | 4.7038 |
| SCI07 | BS Applied Mathematics | 49 | 203 | 42.885680 | 6.0435 |
| SCI08 | BS Statistics | 45 | 206 | 42.912474 | 6.1328 |
| SCI09 | BS Environmental Science | 27 | 226 | 42.848765 | 6.7282 |
| SCI10 | BS Geology | 28 | 160 | 42.621614 | 4.7633 |
| SCI11 | BS Meteorology | 27 | 142 | 43.196189 | 4.2274 |
| AGR01 | BS Agriculture | 66 | 212 | 43.314379 | 6.3114 |
| AGR02 | BS Forestry | 34 | 234 | 42.919619 | 6.9664 |
| AGR03 | BS Fisheries | 26 | 236 | 43.353081 | 7.0259 |
| AGR04 | BS Food Technology | 77 | 283 | 42.405180 | 8.4251 |
| HLT01 | BS Nursing | 32 | 172 | 42.986901 | 5.1206 |
| HLT02 | BS Pharmacy | 27 | 157 | 42.222090 | 4.6740 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 43 | 165 | 42.881512 | 4.9122 |
| HLT04 | BS Physical Therapy | 33 | 179 | 43.013695 | 5.3290 |
| HLT05 | BS Occupational Therapy | 25 | 171 | 43.032450 | 5.0908 |
| HLT06 | BS Radiologic Technology | 34 | 154 | 42.872581 | 4.5847 |
| HLT07 | BS Public Health | 29 | 151 | 43.160464 | 4.4954 |
| HLT08 | BS Nutrition and Dietetics | 86 | 302 | 43.160167 | 8.9908 |
| HLT09 | Doctor of Dental Medicine | 28 | 146 | 43.061328 | 4.3465 |
| HLT10 | Doctor of Veterinary Medicine | 55 | 231 | 43.229533 | 6.8770 |
| EDU01 | Bachelor of Elementary Education | 15 | 139 | 43.105389 | 4.1381 |
| EDU02 | Bachelor of Secondary Education | 29 | 140 | 43.026496 | 4.1679 |
| EDU03 | Bachelor of Early Childhood Education | 28 | 170 | 43.242334 | 5.0610 |
| EDU04 | Bachelor of Physical Education | 112 | 351 | 42.465615 | 10.4495 |
| EDU05 | BS Exercise and Sports Sciences | 107 | 322 | 42.755880 | 9.5862 |
| EDU06 | Bachelor of Culture and Arts Education | 69 | 265 | 42.679071 | 7.8893 |
| EDU07 | Bachelor of Technology and Livelihood Education | 50 | 281 | 42.306639 | 8.3656 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 73 | 263 | 43.345936 | 7.8297 |
| SOC01 | Psychology (BA/BS) | 25 | 147 | 43.435249 | 4.3763 |
| SOC02 | BS Social Work | 22 | 136 | 43.007740 | 4.0488 |
| SOC03 | Bachelor in Human Services | 33 | 147 | 42.886573 | 4.3763 |
| SOC04 | BA Political Science | 8 | 112 | 42.667163 | 3.3343 |
| SOC05 | BA Sociology | 22 | 141 | 42.997321 | 4.1977 |
| SOC06 | BA History | 14 | 112 | 42.920810 | 3.3343 |
| SOC07 | BA Philosophy | 15 | 111 | 43.075915 | 3.3046 |
| SOC08 | Anthropology (BA/BS) | 20 | 151 | 43.123549 | 4.4954 |
| SOC09 | Bachelor of Public Administration | 33 | 152 | 42.730277 | 4.5252 |
| SOC10 | Bachelor of Library and Information Science | 60 | 234 | 43.173861 | 6.9664 |
| SOC11 | BS Criminology | 39 | 168 | 43.050015 | 5.0015 |
| SOC12 | BA Communication | 38 | 197 | 42.974099 | 5.8648 |
| SOC13 | BA Broadcasting | 30 | 147 | 43.748437 | 4.3763 |
| SOC14 | BA Journalism | 22 | 169 | 43.232807 | 5.0313 |
| SOC15 | BS Development Communication | 29 | 138 | 42.818101 | 4.1084 |
| SOC16 | BA English Language Studies | 22 | 147 | 43.682346 | 4.3763 |
| SOC17 | BA Literature | 20 | 145 | 43.534385 | 4.3168 |
| SOC18 | BA Filipino | 34 | 143 | 43.751116 | 4.2572 |
| ART01 | Bachelor of Fine Arts | 34 | 259 | 43.173861 | 7.7106 |
| ART02 | Bachelor of Performing Arts | 65 | 242 | 42.923191 | 7.2045 |
| ART03 | Bachelor of Multimedia Arts | 52 | 244 | 42.695445 | 7.2641 |
| ART04 | BS Interior Design | 40 | 256 | 43.087824 | 7.6213 |
| ART05 | Bachelor of Landscape Architecture | 56 | 253 | 43.324799 | 7.5320 |
| ART06 | BS Architecture | 66 | 258 | 43.137243 | 7.6809 |

### old, 90to94, N=3294

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 32 | 218 | 43.232544 | 6.6181 |
| BUS02 | BS Management Accounting | 31 | 196 | 43.099575 | 5.9502 |
| BUS03 | BS Accounting Information Systems | 59 | 241 | 42.798421 | 7.3163 |
| BUS04 | BS Internal Auditing | 26 | 193 | 43.160899 | 5.8591 |
| BUS05 | BS Business Administration | 21 | 181 | 43.319672 | 5.4948 |
| BUS06 | BS Entrepreneurship | 81 | 285 | 43.203704 | 8.6521 |
| BUS07 | BS Office Administration | 46 | 202 | 43.100486 | 6.1324 |
| BUS08 | Economics (BA/BS) | 30 | 196 | 43.103825 | 5.9502 |
| BUS09 | BS Tourism Management | 53 | 187 | 42.947177 | 5.6770 |
| BUS10 | BS Hospitality Management | 28 | 190 | 43.188525 | 5.7681 |
| ICT01 | BS Information Technology | 34 | 266 | 43.056163 | 8.0753 |
| ICT02 | BS Information Systems | 52 | 254 | 42.798118 | 7.7110 |
| ICT03 | BS Computer Science | 47 | 263 | 43.030662 | 7.9842 |
| ENG01 | BS Civil Engineering | 24 | 121 | 42.995750 | 3.6733 |
| ENG02 | BS Mechanical Engineering | 43 | 192 | 43.322404 | 5.8288 |
| ENG03 | BS Electrical Engineering | 23 | 185 | 43.321190 | 5.6163 |
| ENG04 | BS Electronics Engineering | 40 | 239 | 43.156648 | 7.2556 |
| ENG05 | BS Computer Engineering | 42 | 244 | 43.156041 | 7.4074 |
| ENG06 | BS Chemical Engineering | 23 | 134 | 43.582878 | 4.0680 |
| ENG07 | BS Industrial Engineering | 78 | 214 | 43.133273 | 6.4967 |
| ENG08 | BS Geodetic Engineering | 18 | 114 | 42.900729 | 3.4608 |
| ENG09 | BS Mining Engineering | 27 | 194 | 44.076503 | 5.8895 |
| ENG10 | BS Materials Engineering | 44 | 194 | 43.511233 | 5.8895 |
| ENG11 | BS Metallurgical Engineering | 24 | 203 | 43.897996 | 6.1627 |
| ENG12 | BS Agricultural and Biosystems Engineering | 78 | 236 | 42.883728 | 7.1645 |
| ENG13 | Bachelor of Industrial Technology | 30 | 194 | 43.891318 | 5.8895 |
| ENG14 | BS Marine Engineering | 34 | 220 | 43.114147 | 6.6788 |
| ENG15 | BS Marine Transportation | 57 | 224 | 43.298421 | 6.8002 |
| SCI01 | BS Biology | 20 | 150 | 42.695507 | 4.5537 |
| SCI02 | BS Marine Biology | 27 | 245 | 43.068610 | 7.4378 |
| SCI03 | BS Chemistry | 23 | 138 | 42.938373 | 4.1894 |
| SCI04 | BS Physics | 17 | 133 | 42.998786 | 4.0376 |
| SCI05 | BS Applied Physics | 22 | 130 | 42.660899 | 3.9466 |
| SCI06 | BS Mathematics | 26 | 143 | 42.612933 | 4.3412 |
| SCI07 | BS Applied Mathematics | 48 | 178 | 42.678810 | 5.4038 |
| SCI08 | BS Statistics | 26 | 181 | 42.727687 | 5.4948 |
| SCI09 | BS Environmental Science | 19 | 222 | 42.727687 | 6.7395 |
| SCI10 | BS Geology | 27 | 152 | 42.963267 | 4.6145 |
| SCI11 | BS Meteorology | 19 | 134 | 42.558591 | 4.0680 |
| AGR01 | BS Agriculture | 63 | 241 | 43.280206 | 7.3163 |
| AGR02 | BS Forestry | 38 | 236 | 43.110200 | 7.1645 |
| AGR03 | BS Fisheries | 34 | 237 | 42.997268 | 7.1949 |
| AGR04 | BS Food Technology | 68 | 287 | 43.667577 | 8.7128 |
| HLT01 | BS Nursing | 30 | 179 | 42.750759 | 5.4341 |
| HLT02 | BS Pharmacy | 26 | 154 | 42.912568 | 4.6752 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 28 | 145 | 42.878567 | 4.4019 |
| HLT04 | BS Physical Therapy | 42 | 176 | 42.644202 | 5.3430 |
| HLT05 | BS Occupational Therapy | 30 | 188 | 43.173649 | 5.7073 |
| HLT06 | BS Radiologic Technology | 28 | 148 | 42.508804 | 4.4930 |
| HLT07 | BS Public Health | 21 | 136 | 42.528233 | 4.1287 |
| HLT08 | BS Nutrition and Dietetics | 63 | 269 | 42.919551 | 8.1664 |
| HLT09 | Doctor of Dental Medicine | 29 | 166 | 42.616272 | 5.0395 |
| HLT10 | Doctor of Veterinary Medicine | 61 | 229 | 42.380692 | 6.9520 |
| EDU01 | Bachelor of Elementary Education | 29 | 156 | 42.594718 | 4.7359 |
| EDU02 | Bachelor of Secondary Education | 21 | 138 | 42.964481 | 4.1894 |
| EDU03 | Bachelor of Early Childhood Education | 26 | 120 | 42.578324 | 3.6430 |
| EDU04 | Bachelor of Physical Education | 131 | 351 | 43.063449 | 10.6557 |
| EDU05 | BS Exercise and Sports Sciences | 128 | 346 | 42.591682 | 10.5039 |
| EDU06 | Bachelor of Culture and Arts Education | 53 | 248 | 43.117790 | 7.5288 |
| EDU07 | Bachelor of Technology and Livelihood Education | 59 | 266 | 44.224347 | 8.0753 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 72 | 268 | 43.418640 | 8.1360 |
| SOC01 | Psychology (BA/BS) | 24 | 160 | 42.573770 | 4.8573 |
| SOC02 | BS Social Work | 22 | 135 | 42.817851 | 4.0984 |
| SOC03 | Bachelor in Human Services | 30 | 152 | 42.523679 | 4.6145 |
| SOC04 | BA Political Science | 6 | 110 | 42.619308 | 3.3394 |
| SOC05 | BA Sociology | 25 | 137 | 42.499696 | 4.1591 |
| SOC06 | BA History | 11 | 111 | 42.627505 | 3.3698 |
| SOC07 | BA Philosophy | 17 | 115 | 43.202793 | 3.4912 |
| SOC08 | Anthropology (BA/BS) | 23 | 148 | 42.129022 | 4.4930 |
| SOC09 | Bachelor of Public Administration | 27 | 151 | 42.529144 | 4.5841 |
| SOC10 | Bachelor of Library and Information Science | 73 | 231 | 42.990285 | 7.0128 |
| SOC11 | BS Criminology | 44 | 168 | 43.171220 | 5.1002 |
| SOC12 | BA Communication | 52 | 194 | 43.356102 | 5.8895 |
| SOC13 | BA Broadcasting | 27 | 156 | 42.812386 | 4.7359 |
| SOC14 | BA Journalism | 33 | 154 | 42.836673 | 4.6752 |
| SOC15 | BS Development Communication | 25 | 132 | 42.783849 | 4.0073 |
| SOC16 | BA English Language Studies | 28 | 143 | 42.939587 | 4.3412 |
| SOC17 | BA Literature | 20 | 152 | 42.912265 | 4.6145 |
| SOC18 | BA Filipino | 23 | 150 | 42.908622 | 4.5537 |
| ART01 | Bachelor of Fine Arts | 25 | 271 | 43.077110 | 8.2271 |
| ART02 | Bachelor of Performing Arts | 74 | 253 | 42.444444 | 7.6806 |
| ART03 | Bachelor of Multimedia Arts | 42 | 246 | 43.154523 | 7.4681 |
| ART04 | BS Interior Design | 37 | 253 | 43.334244 | 7.6806 |
| ART05 | Bachelor of Landscape Architecture | 77 | 253 | 43.227080 | 7.6806 |
| ART06 | BS Architecture | 50 | 225 | 43.693685 | 6.8306 |

### old, 95to100, N=3402

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 24 | 194 | 43.194004 | 5.7025 |
| BUS02 | BS Management Accounting | 23 | 202 | 43.736919 | 5.9377 |
| BUS03 | BS Accounting Information Systems | 52 | 234 | 43.504115 | 6.8783 |
| BUS04 | BS Internal Auditing | 30 | 184 | 43.274544 | 5.4086 |
| BUS05 | BS Business Administration | 24 | 192 | 43.557025 | 5.6437 |
| BUS06 | BS Entrepreneurship | 95 | 314 | 42.734862 | 9.2299 |
| BUS07 | BS Office Administration | 46 | 218 | 43.104938 | 6.4080 |
| BUS08 | Economics (BA/BS) | 28 | 172 | 43.080835 | 5.0558 |
| BUS09 | BS Tourism Management | 53 | 197 | 43.131393 | 5.7907 |
| BUS10 | BS Hospitality Management | 30 | 184 | 42.982657 | 5.4086 |
| ICT01 | BS Information Technology | 32 | 231 | 43.076720 | 6.7901 |
| ICT02 | BS Information Systems | 44 | 229 | 42.956790 | 6.7313 |
| ICT03 | BS Computer Science | 57 | 237 | 43.428277 | 6.9665 |
| ENG01 | BS Civil Engineering | 22 | 144 | 43.507055 | 4.2328 |
| ENG02 | BS Mechanical Engineering | 54 | 247 | 42.725162 | 7.2604 |
| ENG03 | BS Electrical Engineering | 28 | 229 | 42.603469 | 6.7313 |
| ENG04 | BS Electronics Engineering | 43 | 258 | 42.779541 | 7.5838 |
| ENG05 | BS Computer Engineering | 53 | 244 | 42.985303 | 7.1723 |
| ENG06 | BS Chemical Engineering | 17 | 115 | 43.314227 | 3.3804 |
| ENG07 | BS Industrial Engineering | 68 | 215 | 43.210170 | 6.3198 |
| ENG08 | BS Geodetic Engineering | 17 | 151 | 43.211934 | 4.4386 |
| ENG09 | BS Mining Engineering | 44 | 236 | 42.560259 | 6.9371 |
| ENG10 | BS Materials Engineering | 34 | 219 | 42.567901 | 6.4374 |
| ENG11 | BS Metallurgical Engineering | 35 | 220 | 42.583186 | 6.4668 |
| ENG12 | BS Agricultural and Biosystems Engineering | 76 | 233 | 43.143151 | 6.8489 |
| ENG13 | Bachelor of Industrial Technology | 37 | 246 | 42.621399 | 7.2310 |
| ENG14 | BS Marine Engineering | 53 | 214 | 42.859200 | 6.2904 |
| ENG15 | BS Marine Transportation | 43 | 212 | 42.895356 | 6.2316 |
| SCI01 | BS Biology | 26 | 141 | 43.030276 | 4.1446 |
| SCI02 | BS Marine Biology | 24 | 264 | 42.467666 | 7.7601 |
| SCI03 | BS Chemistry | 14 | 94 | 43.261611 | 2.7631 |
| SCI04 | BS Physics | 16 | 150 | 42.785714 | 4.4092 |
| SCI05 | BS Applied Physics | 23 | 138 | 42.805115 | 4.0564 |
| SCI06 | BS Mathematics | 21 | 146 | 43.039683 | 4.2916 |
| SCI07 | BS Applied Mathematics | 43 | 201 | 42.577601 | 5.9083 |
| SCI08 | BS Statistics | 38 | 206 | 42.938272 | 6.0553 |
| SCI09 | BS Environmental Science | 34 | 266 | 42.455026 | 7.8189 |
| SCI10 | BS Geology | 29 | 135 | 43.285714 | 3.9683 |
| SCI11 | BS Meteorology | 27 | 132 | 43.153145 | 3.8801 |
| AGR01 | BS Agriculture | 67 | 264 | 42.981481 | 7.7601 |
| AGR02 | BS Forestry | 34 | 279 | 42.753674 | 8.2011 |
| AGR03 | BS Fisheries | 38 | 267 | 42.895650 | 7.8483 |
| AGR04 | BS Food Technology | 73 | 361 | 43.222516 | 10.6114 |
| HLT01 | BS Nursing | 30 | 147 | 43.694885 | 4.3210 |
| HLT02 | BS Pharmacy | 23 | 149 | 42.772487 | 4.3798 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 22 | 147 | 42.889771 | 4.3210 |
| HLT04 | BS Physical Therapy | 27 | 153 | 43.378601 | 4.4974 |
| HLT05 | BS Occupational Therapy | 29 | 143 | 43.631687 | 4.2034 |
| HLT06 | BS Radiologic Technology | 33 | 147 | 42.961787 | 4.3210 |
| HLT07 | BS Public Health | 24 | 129 | 42.997942 | 3.7919 |
| HLT08 | BS Nutrition and Dietetics | 76 | 340 | 43.643445 | 9.9941 |
| HLT09 | Doctor of Dental Medicine | 23 | 130 | 43.369195 | 3.8213 |
| HLT10 | Doctor of Veterinary Medicine | 85 | 238 | 42.975015 | 6.9959 |
| EDU01 | Bachelor of Elementary Education | 18 | 127 | 42.357731 | 3.7331 |
| EDU02 | Bachelor of Secondary Education | 24 | 135 | 42.365373 | 3.9683 |
| EDU03 | Bachelor of Early Childhood Education | 32 | 161 | 41.917695 | 4.7325 |
| EDU04 | Bachelor of Physical Education | 124 | 335 | 43.146384 | 9.8471 |
| EDU05 | BS Exercise and Sports Sciences | 123 | 326 | 43.415344 | 9.5826 |
| EDU06 | Bachelor of Culture and Arts Education | 53 | 268 | 43.105526 | 7.8777 |
| EDU07 | Bachelor of Technology and Livelihood Education | 66 | 343 | 42.763962 | 10.0823 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 90 | 317 | 42.383892 | 9.3180 |
| SOC01 | Psychology (BA/BS) | 26 | 130 | 42.828924 | 3.8213 |
| SOC02 | BS Social Work | 13 | 123 | 43.383598 | 3.6155 |
| SOC03 | Bachelor in Human Services | 26 | 151 | 43.266020 | 4.4386 |
| SOC04 | BA Political Science | 10 | 114 | 42.333921 | 3.3510 |
| SOC05 | BA Sociology | 22 | 134 | 43.055262 | 3.9389 |
| SOC06 | BA History | 12 | 117 | 42.557319 | 3.4392 |
| SOC07 | BA Philosophy | 21 | 124 | 42.874192 | 3.6449 |
| SOC08 | Anthropology (BA/BS) | 20 | 145 | 42.455614 | 4.2622 |
| SOC09 | Bachelor of Public Administration | 30 | 142 | 42.598178 | 4.1740 |
| SOC10 | Bachelor of Library and Information Science | 60 | 233 | 43.222222 | 6.8489 |
| SOC11 | BS Criminology | 48 | 167 | 42.151088 | 4.9089 |
| SOC12 | BA Communication | 66 | 202 | 43.729277 | 5.9377 |
| SOC13 | BA Broadcasting | 35 | 156 | 42.815697 | 4.5855 |
| SOC14 | BA Journalism | 19 | 147 | 42.885655 | 4.3210 |
| SOC15 | BS Development Communication | 28 | 128 | 43.089653 | 3.7625 |
| SOC16 | BA English Language Studies | 24 | 145 | 42.994415 | 4.2622 |
| SOC17 | BA Literature | 27 | 163 | 43.065256 | 4.7913 |
| SOC18 | BA Filipino | 22 | 136 | 43.064668 | 3.9976 |
| ART01 | Bachelor of Fine Arts | 38 | 297 | 43.379189 | 8.7302 |
| ART02 | Bachelor of Performing Arts | 75 | 282 | 43.401235 | 8.2892 |
| ART03 | Bachelor of Multimedia Arts | 45 | 265 | 43.382422 | 7.7895 |
| ART04 | BS Interior Design | 40 | 268 | 43.229277 | 7.8777 |
| ART05 | Bachelor of Landscape Architecture | 58 | 239 | 43.193416 | 7.0253 |
| ART06 | BS Architecture | 66 | 252 | 43.289242 | 7.4074 |

### new, all, N=20000

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 198 | 1185 | 42.887600 | 5.9250 |
| BUS02 | BS Management Accounting | 221 | 1184 | 42.735800 | 5.9200 |
| BUS03 | BS Accounting Information Systems | 202 | 1202 | 42.820750 | 6.0100 |
| BUS04 | BS Internal Auditing | 207 | 1261 | 42.803550 | 6.3050 |
| BUS05 | BS Business Administration | 205 | 1196 | 42.735900 | 5.9800 |
| BUS06 | BS Entrepreneurship | 300 | 1253 | 42.710400 | 6.2650 |
| BUS07 | BS Office Administration | 311 | 1279 | 42.623800 | 6.3950 |
| BUS08 | Economics (BA/BS) | 229 | 1178 | 42.806150 | 5.8900 |
| BUS09 | BS Tourism Management | 369 | 1428 | 43.178300 | 7.1400 |
| BUS10 | BS Hospitality Management | 334 | 1345 | 43.178900 | 6.7250 |
| ICT01 | BS Information Technology | 205 | 1261 | 42.826250 | 6.3050 |
| ICT02 | BS Information Systems | 283 | 1205 | 42.850850 | 6.0250 |
| ICT03 | BS Computer Science | 193 | 1163 | 42.783100 | 5.8150 |
| ENG01 | BS Civil Engineering | 223 | 1115 | 43.097550 | 5.5750 |
| ENG02 | BS Mechanical Engineering | 292 | 1241 | 42.954250 | 6.2050 |
| ENG03 | BS Electrical Engineering | 297 | 1308 | 42.915800 | 6.5400 |
| ENG04 | BS Electronics Engineering | 270 | 1257 | 42.725550 | 6.2850 |
| ENG05 | BS Computer Engineering | 208 | 1201 | 42.848550 | 6.0050 |
| ENG06 | BS Chemical Engineering | 185 | 943 | 43.155550 | 4.7150 |
| ENG07 | BS Industrial Engineering | 264 | 1126 | 42.920600 | 5.6300 |
| ENG08 | BS Geodetic Engineering | 150 | 1055 | 43.214600 | 5.2750 |
| ENG09 | BS Mining Engineering | 181 | 1006 | 43.274800 | 5.0300 |
| ENG10 | BS Materials Engineering | 181 | 1019 | 43.119000 | 5.0950 |
| ENG11 | BS Metallurgical Engineering | 138 | 985 | 43.092550 | 4.9250 |
| ENG12 | BS Agricultural and Biosystems Engineering | 192 | 963 | 43.133850 | 4.8150 |
| ENG13 | Bachelor of Industrial Technology | 319 | 1282 | 42.888900 | 6.4100 |
| ENG14 | BS Marine Engineering | 204 | 1091 | 43.105400 | 5.4550 |
| ENG15 | BS Marine Transportation | 338 | 1221 | 42.806850 | 6.1050 |
| SCI01 | BS Biology | 148 | 881 | 43.263650 | 4.4050 |
| SCI02 | BS Marine Biology | 141 | 949 | 43.167750 | 4.7450 |
| SCI03 | BS Chemistry | 141 | 937 | 43.120700 | 4.6850 |
| SCI04 | BS Physics | 141 | 875 | 43.316100 | 4.3750 |
| SCI05 | BS Applied Physics | 232 | 951 | 43.149700 | 4.7550 |
| SCI06 | BS Mathematics | 203 | 1013 | 42.770650 | 5.0650 |
| SCI07 | BS Applied Mathematics | 153 | 989 | 42.961250 | 4.9450 |
| SCI08 | BS Statistics | 210 | 1075 | 42.844200 | 5.3750 |
| SCI09 | BS Environmental Science | 95 | 842 | 43.165200 | 4.2100 |
| SCI10 | BS Geology | 127 | 813 | 43.210100 | 4.0650 |
| SCI11 | BS Meteorology | 152 | 870 | 43.021650 | 4.3500 |
| AGR01 | BS Agriculture | 198 | 998 | 43.214150 | 4.9900 |
| AGR02 | BS Forestry | 118 | 925 | 43.212750 | 4.6250 |
| AGR03 | BS Fisheries | 156 | 982 | 43.045150 | 4.9100 |
| AGR04 | BS Food Technology | 273 | 1153 | 43.092900 | 5.7650 |
| HLT01 | BS Nursing | 188 | 1096 | 42.902300 | 5.4800 |
| HLT02 | BS Pharmacy | 193 | 982 | 43.038750 | 4.9100 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 239 | 1114 | 42.851200 | 5.5700 |
| HLT04 | BS Physical Therapy | 245 | 1216 | 43.160200 | 6.0800 |
| HLT05 | BS Occupational Therapy | 229 | 1218 | 42.908050 | 6.0900 |
| HLT06 | BS Radiologic Technology | 193 | 1022 | 42.893750 | 5.1100 |
| HLT07 | BS Public Health | 220 | 1158 | 42.901800 | 5.7900 |
| HLT08 | BS Nutrition and Dietetics | 307 | 1250 | 43.016650 | 6.2500 |
| HLT09 | Doctor of Dental Medicine | 213 | 1067 | 42.905200 | 5.3350 |
| HLT10 | Doctor of Veterinary Medicine | 211 | 992 | 43.003650 | 4.9600 |
| EDU01 | Bachelor of Elementary Education | 210 | 1277 | 43.138750 | 6.3850 |
| EDU02 | Bachelor of Secondary Education | 176 | 1165 | 43.045800 | 5.8250 |
| EDU03 | Bachelor of Early Childhood Education | 251 | 1310 | 43.125750 | 6.5500 |
| EDU04 | Bachelor of Physical Education | 323 | 1451 | 43.308900 | 7.2550 |
| EDU05 | BS Exercise and Sports Sciences | 279 | 1262 | 43.396300 | 6.3100 |
| EDU06 | Bachelor of Culture and Arts Education | 305 | 1334 | 43.173000 | 6.6700 |
| EDU07 | Bachelor of Technology and Livelihood Education | 350 | 1428 | 43.222000 | 7.1400 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 317 | 1314 | 43.350350 | 6.5700 |
| SOC01 | Psychology (BA/BS) | 270 | 1238 | 43.168250 | 6.1900 |
| SOC02 | BS Social Work | 216 | 1235 | 43.141650 | 6.1750 |
| SOC03 | Bachelor in Human Services | 279 | 1271 | 43.215750 | 6.3550 |
| SOC04 | BA Political Science | 148 | 1074 | 43.056850 | 5.3700 |
| SOC05 | BA Sociology | 214 | 1206 | 43.170900 | 6.0300 |
| SOC06 | BA History | 132 | 964 | 42.862200 | 4.8200 |
| SOC07 | BA Philosophy | 181 | 1038 | 42.932600 | 5.1900 |
| SOC08 | Anthropology (BA/BS) | 215 | 1176 | 43.153850 | 5.8800 |
| SOC09 | Bachelor of Public Administration | 244 | 1153 | 43.025700 | 5.7650 |
| SOC10 | Bachelor of Library and Information Science | 317 | 1387 | 42.768650 | 6.9350 |
| SOC11 | BS Criminology | 399 | 1453 | 43.166400 | 7.2650 |
| SOC12 | BA Communication | 265 | 1359 | 42.750200 | 6.7950 |
| SOC13 | BA Broadcasting | 270 | 1356 | 42.757950 | 6.7800 |
| SOC14 | BA Journalism | 282 | 1399 | 42.808250 | 6.9950 |
| SOC15 | BS Development Communication | 365 | 1380 | 42.952650 | 6.9000 |
| SOC16 | BA English Language Studies | 236 | 1356 | 42.784750 | 6.7800 |
| SOC17 | BA Literature | 214 | 1330 | 42.783750 | 6.6500 |
| SOC18 | BA Filipino | 246 | 1154 | 42.965200 | 5.7700 |
| ART01 | Bachelor of Fine Arts | 281 | 1492 | 42.798050 | 7.4600 |
| ART02 | Bachelor of Performing Arts | 346 | 1470 | 42.926600 | 7.3500 |
| ART03 | Bachelor of Multimedia Arts | 289 | 1429 | 42.855150 | 7.1450 |
| ART04 | BS Interior Design | 315 | 1479 | 42.995000 | 7.3950 |
| ART05 | Bachelor of Landscape Architecture | 348 | 1458 | 42.958600 | 7.2900 |
| ART06 | BS Architecture | 292 | 1281 | 42.907600 | 6.4050 |

### new, below75, N=3292

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 37 | 199 | 42.396112 | 6.0450 |
| BUS02 | BS Management Accounting | 36 | 191 | 42.980863 | 5.8019 |
| BUS03 | BS Accounting Information Systems | 31 | 186 | 43.262151 | 5.6501 |
| BUS04 | BS Internal Auditing | 29 | 206 | 42.549514 | 6.2576 |
| BUS05 | BS Business Administration | 30 | 198 | 42.533718 | 6.0146 |
| BUS06 | BS Entrepreneurship | 68 | 234 | 42.469927 | 7.1081 |
| BUS07 | BS Office Administration | 55 | 216 | 42.529769 | 6.5614 |
| BUS08 | Economics (BA/BS) | 42 | 206 | 42.990887 | 6.2576 |
| BUS09 | BS Tourism Management | 68 | 252 | 42.286452 | 7.6549 |
| BUS10 | BS Hospitality Management | 62 | 252 | 42.774909 | 7.6549 |
| ICT01 | BS Information Technology | 27 | 190 | 42.789490 | 5.7716 |
| ICT02 | BS Information Systems | 45 | 175 | 43.266100 | 5.3159 |
| ICT03 | BS Computer Science | 32 | 181 | 43.132139 | 5.4982 |
| ENG01 | BS Civil Engineering | 40 | 166 | 43.390340 | 5.0425 |
| ENG02 | BS Mechanical Engineering | 48 | 207 | 43.157655 | 6.2880 |
| ENG03 | BS Electrical Engineering | 41 | 202 | 42.821689 | 6.1361 |
| ENG04 | BS Electronics Engineering | 36 | 207 | 42.788578 | 6.2880 |
| ENG05 | BS Computer Engineering | 31 | 198 | 42.873329 | 6.0146 |
| ENG06 | BS Chemical Engineering | 31 | 159 | 43.446537 | 4.8299 |
| ENG07 | BS Industrial Engineering | 42 | 184 | 42.840522 | 5.5893 |
| ENG08 | BS Geodetic Engineering | 20 | 190 | 43.509417 | 5.7716 |
| ENG09 | BS Mining Engineering | 31 | 173 | 43.561361 | 5.2552 |
| ENG10 | BS Materials Engineering | 40 | 205 | 43.255164 | 6.2272 |
| ENG11 | BS Metallurgical Engineering | 31 | 186 | 43.547084 | 5.6501 |
| ENG12 | BS Agricultural and Biosystems Engineering | 33 | 150 | 43.582017 | 4.5565 |
| ENG13 | Bachelor of Industrial Technology | 59 | 211 | 42.812576 | 6.4095 |
| ENG14 | BS Marine Engineering | 35 | 171 | 43.115735 | 5.1944 |
| ENG15 | BS Marine Transportation | 64 | 220 | 42.363913 | 6.6829 |
| SCI01 | BS Biology | 21 | 147 | 43.387910 | 4.4654 |
| SCI02 | BS Marine Biology | 20 | 156 | 43.342649 | 4.7388 |
| SCI03 | BS Chemistry | 19 | 157 | 43.132746 | 4.7691 |
| SCI04 | BS Physics | 20 | 158 | 43.637303 | 4.7995 |
| SCI05 | BS Applied Physics | 50 | 167 | 43.305589 | 5.0729 |
| SCI06 | BS Mathematics | 35 | 169 | 43.266100 | 5.1337 |
| SCI07 | BS Applied Mathematics | 27 | 157 | 43.362697 | 4.7691 |
| SCI08 | BS Statistics | 36 | 170 | 42.753038 | 5.1640 |
| SCI09 | BS Environmental Science | 14 | 147 | 43.133050 | 4.4654 |
| SCI10 | BS Geology | 21 | 156 | 43.530680 | 4.7388 |
| SCI11 | BS Meteorology | 25 | 158 | 43.202005 | 4.7995 |
| AGR01 | BS Agriculture | 29 | 167 | 43.528554 | 5.0729 |
| AGR02 | BS Forestry | 20 | 149 | 43.193803 | 4.5261 |
| AGR03 | BS Fisheries | 28 | 167 | 42.863001 | 5.0729 |
| AGR04 | BS Food Technology | 48 | 201 | 42.915857 | 6.1057 |
| HLT01 | BS Nursing | 31 | 195 | 43.180134 | 5.9235 |
| HLT02 | BS Pharmacy | 34 | 172 | 43.141252 | 5.2248 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 43 | 211 | 42.894289 | 6.4095 |
| HLT04 | BS Physical Therapy | 37 | 185 | 43.284933 | 5.6197 |
| HLT05 | BS Occupational Therapy | 45 | 210 | 43.164945 | 6.3791 |
| HLT06 | BS Radiologic Technology | 31 | 168 | 43.330498 | 5.1033 |
| HLT07 | BS Public Health | 40 | 187 | 43.544350 | 5.6804 |
| HLT08 | BS Nutrition and Dietetics | 63 | 226 | 43.623329 | 6.8651 |
| HLT09 | Doctor of Dental Medicine | 42 | 171 | 43.677400 | 5.1944 |
| HLT10 | Doctor of Veterinary Medicine | 38 | 162 | 43.509113 | 4.9210 |
| EDU01 | Bachelor of Elementary Education | 35 | 212 | 43.436513 | 6.4399 |
| EDU02 | Bachelor of Secondary Education | 38 | 206 | 42.808019 | 6.2576 |
| EDU03 | Bachelor of Early Childhood Education | 41 | 218 | 42.786756 | 6.6221 |
| EDU04 | Bachelor of Physical Education | 54 | 236 | 42.549514 | 7.1689 |
| EDU05 | BS Exercise and Sports Sciences | 42 | 195 | 43.527947 | 5.9235 |
| EDU06 | Bachelor of Culture and Arts Education | 54 | 223 | 42.263062 | 6.7740 |
| EDU07 | Bachelor of Technology and Livelihood Education | 72 | 266 | 42.808019 | 8.0802 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 53 | 222 | 43.154010 | 6.7436 |
| SOC01 | Psychology (BA/BS) | 39 | 196 | 43.756075 | 5.9538 |
| SOC02 | BS Social Work | 24 | 200 | 43.105711 | 6.0753 |
| SOC03 | Bachelor in Human Services | 52 | 227 | 43.349332 | 6.8955 |
| SOC04 | BA Political Science | 22 | 173 | 42.966282 | 5.2552 |
| SOC05 | BA Sociology | 32 | 181 | 43.385176 | 5.4982 |
| SOC06 | BA History | 22 | 162 | 42.561057 | 4.9210 |
| SOC07 | BA Philosophy | 29 | 175 | 42.719623 | 5.3159 |
| SOC08 | Anthropology (BA/BS) | 32 | 180 | 43.558931 | 5.4678 |
| SOC09 | Bachelor of Public Administration | 36 | 193 | 42.645808 | 5.8627 |
| SOC10 | Bachelor of Library and Information Science | 42 | 202 | 42.932564 | 6.1361 |
| SOC11 | BS Criminology | 58 | 247 | 42.520960 | 7.5030 |
| SOC12 | BA Communication | 42 | 218 | 42.205954 | 6.6221 |
| SOC13 | BA Broadcasting | 48 | 205 | 42.821993 | 6.2272 |
| SOC14 | BA Journalism | 47 | 208 | 42.373026 | 6.3183 |
| SOC15 | BS Development Communication | 48 | 209 | 42.969016 | 6.3487 |
| SOC16 | BA English Language Studies | 27 | 181 | 42.537971 | 5.4982 |
| SOC17 | BA Literature | 25 | 202 | 42.309842 | 6.1361 |
| SOC18 | BA Filipino | 41 | 188 | 42.827764 | 5.7108 |
| ART01 | Bachelor of Fine Arts | 42 | 222 | 42.110571 | 6.7436 |
| ART02 | Bachelor of Performing Arts | 53 | 226 | 42.397023 | 6.8651 |
| ART03 | Bachelor of Multimedia Arts | 41 | 216 | 42.356015 | 6.5614 |
| ART04 | BS Interior Design | 50 | 223 | 42.761847 | 6.7740 |
| ART05 | Bachelor of Landscape Architecture | 47 | 215 | 42.473572 | 6.5310 |
| ART06 | BS Architecture | 43 | 205 | 43.086877 | 6.2272 |

### new, 75to79, N=3383

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 33 | 204 | 43.219923 | 6.0302 |
| BUS02 | BS Management Accounting | 40 | 198 | 42.441620 | 5.8528 |
| BUS03 | BS Accounting Information Systems | 30 | 207 | 42.321608 | 6.1188 |
| BUS04 | BS Internal Auditing | 41 | 225 | 43.042566 | 6.6509 |
| BUS05 | BS Business Administration | 40 | 196 | 42.556607 | 5.7937 |
| BUS06 | BS Entrepreneurship | 57 | 235 | 42.193615 | 6.9465 |
| BUS07 | BS Office Administration | 59 | 233 | 41.935856 | 6.8874 |
| BUS08 | Economics (BA/BS) | 47 | 217 | 42.653562 | 6.4144 |
| BUS09 | BS Tourism Management | 56 | 230 | 43.163169 | 6.7987 |
| BUS10 | BS Hospitality Management | 51 | 228 | 43.196275 | 6.7396 |
| ICT01 | BS Information Technology | 39 | 220 | 42.426840 | 6.5031 |
| ICT02 | BS Information Systems | 56 | 216 | 42.183860 | 6.3849 |
| ICT03 | BS Computer Science | 33 | 209 | 42.055276 | 6.1779 |
| ENG01 | BS Civil Engineering | 36 | 190 | 42.443689 | 5.6163 |
| ENG02 | BS Mechanical Engineering | 52 | 196 | 42.618386 | 5.7937 |
| ENG03 | BS Electrical Engineering | 54 | 227 | 42.836240 | 6.7100 |
| ENG04 | BS Electronics Engineering | 44 | 211 | 42.373928 | 6.2371 |
| ENG05 | BS Computer Engineering | 38 | 233 | 42.264262 | 6.8874 |
| ENG06 | BS Chemical Engineering | 35 | 165 | 43.200709 | 4.8773 |
| ENG07 | BS Industrial Engineering | 49 | 215 | 42.650015 | 6.3553 |
| ENG08 | BS Geodetic Engineering | 26 | 180 | 42.924623 | 5.3207 |
| ENG09 | BS Mining Engineering | 25 | 159 | 43.512267 | 4.7000 |
| ENG10 | BS Materials Engineering | 35 | 167 | 43.400828 | 4.9364 |
| ENG11 | BS Metallurgical Engineering | 22 | 167 | 43.420337 | 4.9364 |
| ENG12 | BS Agricultural and Biosystems Engineering | 40 | 183 | 43.109075 | 5.4094 |
| ENG13 | Bachelor of Industrial Technology | 53 | 206 | 43.579959 | 6.0893 |
| ENG14 | BS Marine Engineering | 29 | 180 | 43.552764 | 5.3207 |
| ENG15 | BS Marine Transportation | 57 | 215 | 43.482708 | 6.3553 |
| SCI01 | BS Biology | 22 | 151 | 43.303872 | 4.4635 |
| SCI02 | BS Marine Biology | 27 | 173 | 43.252734 | 5.1138 |
| SCI03 | BS Chemistry | 26 | 159 | 43.104345 | 4.7000 |
| SCI04 | BS Physics | 19 | 146 | 43.432161 | 4.3157 |
| SCI05 | BS Applied Physics | 27 | 136 | 43.819982 | 4.0201 |
| SCI06 | BS Mathematics | 30 | 155 | 42.259237 | 4.5817 |
| SCI07 | BS Applied Mathematics | 21 | 169 | 42.267218 | 4.9956 |
| SCI08 | BS Statistics | 43 | 203 | 42.587053 | 6.0006 |
| SCI09 | BS Environmental Science | 14 | 161 | 43.148093 | 4.7591 |
| SCI10 | BS Geology | 28 | 147 | 42.953000 | 4.3453 |
| SCI11 | BS Meteorology | 22 | 134 | 43.127106 | 3.9610 |
| AGR01 | BS Agriculture | 39 | 160 | 43.475613 | 4.7295 |
| AGR02 | BS Forestry | 23 | 162 | 43.198049 | 4.7886 |
| AGR03 | BS Fisheries | 29 | 170 | 43.447827 | 5.0251 |
| AGR04 | BS Food Technology | 41 | 196 | 43.305350 | 5.7937 |
| HLT01 | BS Nursing | 29 | 180 | 43.668637 | 5.3207 |
| HLT02 | BS Pharmacy | 33 | 150 | 43.564292 | 4.4339 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 30 | 165 | 43.289684 | 4.8773 |
| HLT04 | BS Physical Therapy | 37 | 193 | 43.616612 | 5.7050 |
| HLT05 | BS Occupational Therapy | 43 | 202 | 43.509016 | 5.9710 |
| HLT06 | BS Radiologic Technology | 33 | 170 | 43.055868 | 5.0251 |
| HLT07 | BS Public Health | 23 | 165 | 43.879397 | 4.8773 |
| HLT08 | BS Nutrition and Dietetics | 53 | 221 | 43.391664 | 6.5327 |
| HLT09 | Doctor of Dental Medicine | 28 | 185 | 43.631392 | 5.4685 |
| HLT10 | Doctor of Veterinary Medicine | 40 | 170 | 43.137452 | 5.0251 |
| EDU01 | Bachelor of Elementary Education | 38 | 214 | 43.127697 | 6.3257 |
| EDU02 | Bachelor of Secondary Education | 26 | 196 | 42.915164 | 5.7937 |
| EDU03 | Bachelor of Early Childhood Education | 38 | 210 | 43.230860 | 6.2075 |
| EDU04 | Bachelor of Physical Education | 54 | 236 | 43.690807 | 6.9761 |
| EDU05 | BS Exercise and Sports Sciences | 50 | 209 | 44.196867 | 6.1779 |
| EDU06 | Bachelor of Culture and Arts Education | 53 | 224 | 43.559267 | 6.6213 |
| EDU07 | Bachelor of Technology and Livelihood Education | 57 | 260 | 42.837127 | 7.6855 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 51 | 230 | 43.161395 | 6.7987 |
| SOC01 | Psychology (BA/BS) | 54 | 217 | 43.349690 | 6.4144 |
| SOC02 | BS Social Work | 33 | 199 | 43.318356 | 5.8824 |
| SOC03 | Bachelor in Human Services | 57 | 208 | 43.187703 | 6.1484 |
| SOC04 | BA Political Science | 20 | 181 | 42.656813 | 5.3503 |
| SOC05 | BA Sociology | 25 | 219 | 42.860479 | 6.4735 |
| SOC06 | BA History | 33 | 161 | 42.703518 | 4.7591 |
| SOC07 | BA Philosophy | 28 | 164 | 42.909252 | 4.8478 |
| SOC08 | Anthropology (BA/BS) | 36 | 203 | 43.340822 | 6.0006 |
| SOC09 | Bachelor of Public Administration | 47 | 189 | 42.809932 | 5.5868 |
| SOC10 | Bachelor of Library and Information Science | 52 | 234 | 42.108188 | 6.9169 |
| SOC11 | BS Criminology | 62 | 218 | 43.329589 | 6.4440 |
| SOC12 | BA Communication | 43 | 227 | 42.405262 | 6.7100 |
| SOC13 | BA Broadcasting | 46 | 228 | 42.221992 | 6.7396 |
| SOC14 | BA Journalism | 50 | 251 | 42.591191 | 7.4195 |
| SOC15 | BS Development Communication | 60 | 221 | 42.601242 | 6.5327 |
| SOC16 | BA English Language Studies | 47 | 233 | 42.191842 | 6.8874 |
| SOC17 | BA Literature | 35 | 233 | 42.656222 | 6.8874 |
| SOC18 | BA Filipino | 40 | 196 | 42.500443 | 5.7937 |
| ART01 | Bachelor of Fine Arts | 47 | 251 | 43.313036 | 7.4195 |
| ART02 | Bachelor of Performing Arts | 56 | 252 | 42.996157 | 7.4490 |
| ART03 | Bachelor of Multimedia Arts | 51 | 232 | 42.857523 | 6.8578 |
| ART04 | BS Interior Design | 57 | 238 | 43.274313 | 7.0352 |
| ART05 | Bachelor of Landscape Architecture | 50 | 228 | 43.246231 | 6.7396 |
| ART06 | BS Architecture | 50 | 218 | 42.664795 | 6.4440 |

### new, 80to84, N=3375

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 24 | 203 | 43.033185 | 6.0148 |
| BUS02 | BS Management Accounting | 44 | 198 | 43.189926 | 5.8667 |
| BUS03 | BS Accounting Information Systems | 32 | 207 | 43.138963 | 6.1333 |
| BUS04 | BS Internal Auditing | 29 | 218 | 43.039407 | 6.4593 |
| BUS05 | BS Business Administration | 33 | 181 | 43.399407 | 5.3630 |
| BUS06 | BS Entrepreneurship | 35 | 202 | 43.092148 | 5.9852 |
| BUS07 | BS Office Administration | 45 | 221 | 43.171852 | 6.5481 |
| BUS08 | Economics (BA/BS) | 35 | 191 | 42.986963 | 5.6593 |
| BUS09 | BS Tourism Management | 61 | 228 | 43.547259 | 6.7556 |
| BUS10 | BS Hospitality Management | 43 | 208 | 43.280593 | 6.1630 |
| ICT01 | BS Information Technology | 40 | 211 | 42.803852 | 6.2519 |
| ICT02 | BS Information Systems | 58 | 218 | 42.718222 | 6.4593 |
| ICT03 | BS Computer Science | 33 | 196 | 42.888000 | 5.8074 |
| ENG01 | BS Civil Engineering | 37 | 183 | 42.827259 | 5.4222 |
| ENG02 | BS Mechanical Engineering | 55 | 225 | 42.611556 | 6.6667 |
| ENG03 | BS Electrical Engineering | 47 | 216 | 42.655704 | 6.4000 |
| ENG04 | BS Electronics Engineering | 43 | 205 | 42.716148 | 6.0741 |
| ENG05 | BS Computer Engineering | 39 | 190 | 42.802074 | 5.6296 |
| ENG06 | BS Chemical Engineering | 28 | 166 | 42.850963 | 4.9185 |
| ENG07 | BS Industrial Engineering | 47 | 169 | 43.152296 | 5.0074 |
| ENG08 | BS Geodetic Engineering | 27 | 191 | 42.830815 | 5.6593 |
| ENG09 | BS Mining Engineering | 31 | 174 | 42.899556 | 5.1556 |
| ENG10 | BS Materials Engineering | 28 | 170 | 42.781333 | 5.0370 |
| ENG11 | BS Metallurgical Engineering | 23 | 168 | 42.744889 | 4.9778 |
| ENG12 | BS Agricultural and Biosystems Engineering | 31 | 154 | 43.041185 | 4.5630 |
| ENG13 | Bachelor of Industrial Technology | 56 | 228 | 42.651259 | 6.7556 |
| ENG14 | BS Marine Engineering | 35 | 201 | 43.017481 | 5.9556 |
| ENG15 | BS Marine Transportation | 67 | 207 | 42.677037 | 6.1333 |
| SCI01 | BS Biology | 31 | 168 | 43.104889 | 4.9778 |
| SCI02 | BS Marine Biology | 26 | 166 | 43.240000 | 4.9185 |
| SCI03 | BS Chemistry | 28 | 165 | 42.817481 | 4.8889 |
| SCI04 | BS Physics | 28 | 153 | 42.791704 | 4.5333 |
| SCI05 | BS Applied Physics | 42 | 180 | 42.810370 | 5.3333 |
| SCI06 | BS Mathematics | 41 | 187 | 42.663704 | 5.5407 |
| SCI07 | BS Applied Mathematics | 23 | 178 | 42.898667 | 5.2741 |
| SCI08 | BS Statistics | 35 | 186 | 43.062519 | 5.5111 |
| SCI09 | BS Environmental Science | 15 | 144 | 43.220148 | 4.2667 |
| SCI10 | BS Geology | 23 | 134 | 42.887111 | 3.9704 |
| SCI11 | BS Meteorology | 30 | 144 | 42.775704 | 4.2667 |
| AGR01 | BS Agriculture | 32 | 158 | 42.679704 | 4.6815 |
| AGR02 | BS Forestry | 23 | 164 | 43.311407 | 4.8593 |
| AGR03 | BS Fisheries | 30 | 163 | 43.112296 | 4.8296 |
| AGR04 | BS Food Technology | 40 | 194 | 43.106667 | 5.7481 |
| HLT01 | BS Nursing | 35 | 173 | 42.709037 | 5.1259 |
| HLT02 | BS Pharmacy | 34 | 167 | 42.615407 | 4.9481 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 42 | 189 | 42.874074 | 5.6000 |
| HLT04 | BS Physical Therapy | 39 | 236 | 42.927111 | 6.9926 |
| HLT05 | BS Occupational Therapy | 42 | 206 | 42.613037 | 6.1037 |
| HLT06 | BS Radiologic Technology | 34 | 157 | 42.693630 | 4.6519 |
| HLT07 | BS Public Health | 45 | 213 | 42.154074 | 6.3111 |
| HLT08 | BS Nutrition and Dietetics | 50 | 206 | 43.139556 | 6.1037 |
| HLT09 | Doctor of Dental Medicine | 32 | 182 | 42.629037 | 5.3926 |
| HLT10 | Doctor of Veterinary Medicine | 22 | 169 | 42.772741 | 5.0074 |
| EDU01 | Bachelor of Elementary Education | 33 | 210 | 43.376296 | 6.2222 |
| EDU02 | Bachelor of Secondary Education | 32 | 194 | 43.204444 | 5.7481 |
| EDU03 | Bachelor of Early Childhood Education | 46 | 227 | 43.301037 | 6.7259 |
| EDU04 | Bachelor of Physical Education | 54 | 264 | 43.140444 | 7.8222 |
| EDU05 | BS Exercise and Sports Sciences | 58 | 227 | 42.914667 | 6.7259 |
| EDU06 | Bachelor of Culture and Arts Education | 48 | 229 | 43.563556 | 6.7852 |
| EDU07 | Bachelor of Technology and Livelihood Education | 56 | 206 | 43.853037 | 6.1037 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 50 | 217 | 43.039407 | 6.4296 |
| SOC01 | Psychology (BA/BS) | 46 | 217 | 43.403259 | 6.4296 |
| SOC02 | BS Social Work | 33 | 223 | 42.743111 | 6.6074 |
| SOC03 | Bachelor in Human Services | 39 | 202 | 43.354370 | 5.9852 |
| SOC04 | BA Political Science | 26 | 186 | 42.940148 | 5.5111 |
| SOC05 | BA Sociology | 45 | 199 | 43.450370 | 5.8963 |
| SOC06 | BA History | 14 | 168 | 42.728889 | 4.9778 |
| SOC07 | BA Philosophy | 37 | 190 | 43.055407 | 5.6296 |
| SOC08 | Anthropology (BA/BS) | 34 | 207 | 43.041481 | 6.1333 |
| SOC09 | Bachelor of Public Administration | 40 | 179 | 42.913185 | 5.3037 |
| SOC10 | Bachelor of Library and Information Science | 50 | 220 | 43.268148 | 6.5185 |
| SOC11 | BS Criminology | 77 | 249 | 42.837630 | 7.3778 |
| SOC12 | BA Communication | 42 | 214 | 43.482667 | 6.3407 |
| SOC13 | BA Broadcasting | 38 | 205 | 43.354074 | 6.0741 |
| SOC14 | BA Journalism | 57 | 215 | 43.378074 | 6.3704 |
| SOC15 | BS Development Communication | 59 | 232 | 42.666963 | 6.8741 |
| SOC16 | BA English Language Studies | 41 | 228 | 43.554667 | 6.7556 |
| SOC17 | BA Literature | 41 | 201 | 43.305185 | 5.9556 |
| SOC18 | BA Filipino | 40 | 184 | 43.338370 | 5.4519 |
| ART01 | Bachelor of Fine Arts | 50 | 272 | 42.674370 | 8.0593 |
| ART02 | Bachelor of Performing Arts | 47 | 248 | 42.908148 | 7.3481 |
| ART03 | Bachelor of Multimedia Arts | 50 | 230 | 43.358815 | 6.8148 |
| ART04 | BS Interior Design | 53 | 242 | 42.939852 | 7.1704 |
| ART05 | Bachelor of Landscape Architecture | 62 | 254 | 42.890667 | 7.5259 |
| ART06 | BS Architecture | 49 | 225 | 42.859852 | 6.6667 |

### new, 85to89, N=3277

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 30 | 182 | 43.151358 | 5.5539 |
| BUS02 | BS Management Accounting | 35 | 199 | 42.833689 | 6.0726 |
| BUS03 | BS Accounting Information Systems | 37 | 205 | 42.981691 | 6.2557 |
| BUS04 | BS Internal Auditing | 34 | 199 | 42.723222 | 6.0726 |
| BUS05 | BS Business Administration | 42 | 223 | 42.308819 | 6.8050 |
| BUS06 | BS Entrepreneurship | 45 | 198 | 42.494049 | 6.0421 |
| BUS07 | BS Office Administration | 46 | 197 | 42.543485 | 6.0116 |
| BUS08 | Economics (BA/BS) | 36 | 178 | 42.822093 | 5.4318 |
| BUS09 | BS Tourism Management | 67 | 242 | 43.761672 | 7.3848 |
| BUS10 | BS Hospitality Management | 65 | 222 | 43.705218 | 6.7745 |
| ICT01 | BS Information Technology | 30 | 201 | 43.210558 | 6.1337 |
| ICT02 | BS Information Systems | 42 | 196 | 42.993897 | 5.9811 |
| ICT03 | BS Computer Science | 32 | 209 | 43.129997 | 6.3778 |
| ENG01 | BS Civil Engineering | 34 | 195 | 42.700336 | 5.9506 |
| ENG02 | BS Mechanical Engineering | 48 | 200 | 42.900214 | 6.1031 |
| ENG03 | BS Electrical Engineering | 53 | 221 | 43.037229 | 6.7440 |
| ENG04 | BS Electronics Engineering | 50 | 210 | 42.778456 | 6.4083 |
| ENG05 | BS Computer Engineering | 24 | 185 | 43.424779 | 5.6454 |
| ENG06 | BS Chemical Engineering | 28 | 149 | 43.214220 | 4.5468 |
| ENG07 | BS Industrial Engineering | 38 | 169 | 42.991761 | 5.1572 |
| ENG08 | BS Geodetic Engineering | 26 | 155 | 43.087580 | 4.7299 |
| ENG09 | BS Mining Engineering | 31 | 162 | 43.228258 | 4.9435 |
| ENG10 | BS Materials Engineering | 27 | 159 | 43.293256 | 4.8520 |
| ENG11 | BS Metallurgical Engineering | 21 | 148 | 43.065609 | 4.5163 |
| ENG12 | BS Agricultural and Biosystems Engineering | 21 | 146 | 42.638084 | 4.4553 |
| ENG13 | Bachelor of Industrial Technology | 62 | 221 | 42.411962 | 6.7440 |
| ENG14 | BS Marine Engineering | 35 | 198 | 42.279829 | 6.0421 |
| ENG15 | BS Marine Transportation | 53 | 189 | 42.613061 | 5.7675 |
| SCI01 | BS Biology | 26 | 144 | 42.849252 | 4.3943 |
| SCI02 | BS Marine Biology | 29 | 151 | 42.263961 | 4.6079 |
| SCI03 | BS Chemistry | 17 | 148 | 43.089411 | 4.5163 |
| SCI04 | BS Physics | 21 | 151 | 43.617943 | 4.6079 |
| SCI05 | BS Applied Physics | 39 | 155 | 43.002136 | 4.7299 |
| SCI06 | BS Mathematics | 24 | 152 | 43.022276 | 4.6384 |
| SCI07 | BS Applied Mathematics | 32 | 167 | 43.412572 | 5.0961 |
| SCI08 | BS Statistics | 23 | 161 | 43.028074 | 4.9130 |
| SCI09 | BS Environmental Science | 17 | 138 | 42.664937 | 4.2112 |
| SCI10 | BS Geology | 25 | 127 | 42.731462 | 3.8755 |
| SCI11 | BS Meteorology | 24 | 131 | 42.861459 | 3.9976 |
| AGR01 | BS Agriculture | 37 | 196 | 42.412878 | 5.9811 |
| AGR02 | BS Forestry | 17 | 153 | 42.288679 | 4.6689 |
| AGR03 | BS Fisheries | 26 | 182 | 42.380836 | 5.5539 |
| AGR04 | BS Food Technology | 46 | 178 | 42.917608 | 5.4318 |
| HLT01 | BS Nursing | 35 | 186 | 42.673482 | 5.6759 |
| HLT02 | BS Pharmacy | 24 | 163 | 43.253280 | 4.9741 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 51 | 188 | 43.109551 | 5.7370 |
| HLT04 | BS Physical Therapy | 30 | 179 | 43.093683 | 5.4623 |
| HLT05 | BS Occupational Therapy | 32 | 173 | 42.912420 | 5.2792 |
| HLT06 | BS Radiologic Technology | 30 | 174 | 42.775404 | 5.3097 |
| HLT07 | BS Public Health | 29 | 198 | 42.422338 | 6.0421 |
| HLT08 | BS Nutrition and Dietetics | 50 | 210 | 42.633506 | 6.4083 |
| HLT09 | Doctor of Dental Medicine | 38 | 177 | 42.341166 | 5.4013 |
| HLT10 | Doctor of Veterinary Medicine | 33 | 181 | 42.197742 | 5.5233 |
| EDU01 | Bachelor of Elementary Education | 34 | 226 | 42.838572 | 6.8966 |
| EDU02 | Bachelor of Secondary Education | 25 | 188 | 43.169667 | 5.7370 |
| EDU03 | Bachelor of Early Childhood Education | 45 | 239 | 43.169362 | 7.2933 |
| EDU04 | Bachelor of Physical Education | 54 | 225 | 43.994202 | 6.8660 |
| EDU05 | BS Exercise and Sports Sciences | 43 | 183 | 42.779066 | 5.5844 |
| EDU06 | Bachelor of Culture and Arts Education | 48 | 219 | 43.785169 | 6.6829 |
| EDU07 | Bachelor of Technology and Livelihood Education | 55 | 219 | 43.485810 | 6.6829 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 61 | 228 | 43.634117 | 6.9576 |
| SOC01 | Psychology (BA/BS) | 43 | 202 | 42.977724 | 6.1642 |
| SOC02 | BS Social Work | 37 | 191 | 43.256637 | 5.8285 |
| SOC03 | Bachelor in Human Services | 45 | 216 | 43.169057 | 6.5914 |
| SOC04 | BA Political Science | 33 | 161 | 43.700641 | 4.9130 |
| SOC05 | BA Sociology | 34 | 187 | 43.355508 | 5.7064 |
| SOC06 | BA History | 17 | 139 | 43.578883 | 4.2417 |
| SOC07 | BA Philosophy | 15 | 151 | 43.404638 | 4.6079 |
| SOC08 | Anthropology (BA/BS) | 34 | 182 | 43.038450 | 5.5539 |
| SOC09 | Bachelor of Public Administration | 43 | 203 | 43.691791 | 6.1947 |
| SOC10 | Bachelor of Library and Information Science | 57 | 240 | 42.855356 | 7.3238 |
| SOC11 | BS Criminology | 66 | 234 | 43.940494 | 7.1407 |
| SOC12 | BA Communication | 44 | 222 | 43.050046 | 6.7745 |
| SOC13 | BA Broadcasting | 44 | 229 | 43.268538 | 6.9881 |
| SOC14 | BA Journalism | 44 | 239 | 42.952395 | 7.2933 |
| SOC15 | BS Development Communication | 74 | 258 | 42.926457 | 7.8731 |
| SOC16 | BA English Language Studies | 37 | 251 | 42.584986 | 7.6594 |
| SOC17 | BA Literature | 37 | 215 | 43.119927 | 6.5609 |
| SOC18 | BA Filipino | 38 | 189 | 43.091242 | 5.7675 |
| ART01 | Bachelor of Fine Arts | 53 | 239 | 42.875801 | 7.2933 |
| ART02 | Bachelor of Performing Arts | 60 | 234 | 43.280134 | 7.1407 |
| ART03 | Bachelor of Multimedia Arts | 42 | 233 | 43.243210 | 7.1102 |
| ART04 | BS Interior Design | 52 | 259 | 43.034788 | 7.9036 |
| ART05 | Bachelor of Landscape Architecture | 61 | 258 | 42.549893 | 7.8731 |
| ART06 | BS Architecture | 55 | 205 | 42.916997 | 6.2557 |

### new, 90to94, N=3303

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 37 | 205 | 42.580381 | 6.2065 |
| BUS02 | BS Management Accounting | 28 | 206 | 42.214956 | 6.2368 |
| BUS03 | BS Accounting Information Systems | 33 | 198 | 42.678474 | 5.9946 |
| BUS04 | BS Internal Auditing | 40 | 223 | 42.445050 | 6.7514 |
| BUS05 | BS Business Administration | 25 | 201 | 42.331517 | 6.0854 |
| BUS06 | BS Entrepreneurship | 47 | 214 | 42.732365 | 6.4790 |
| BUS07 | BS Office Administration | 51 | 203 | 42.737814 | 6.1459 |
| BUS08 | Economics (BA/BS) | 40 | 204 | 42.217681 | 6.1762 |
| BUS09 | BS Tourism Management | 67 | 253 | 42.261580 | 7.6597 |
| BUS10 | BS Hospitality Management | 60 | 210 | 42.164093 | 6.3579 |
| ICT01 | BS Information Technology | 31 | 197 | 43.250681 | 5.9643 |
| ICT02 | BS Information Systems | 39 | 190 | 42.985165 | 5.7523 |
| ICT03 | BS Computer Science | 25 | 164 | 42.796246 | 4.9652 |
| ENG01 | BS Civil Engineering | 38 | 176 | 43.945807 | 5.3285 |
| ENG02 | BS Mechanical Engineering | 37 | 196 | 43.117772 | 5.9340 |
| ENG03 | BS Electrical Engineering | 56 | 205 | 43.299122 | 6.2065 |
| ENG04 | BS Electronics Engineering | 51 | 185 | 43.181048 | 5.6010 |
| ENG05 | BS Computer Engineering | 27 | 187 | 43.179837 | 5.6615 |
| ENG06 | BS Chemical Engineering | 27 | 150 | 43.400545 | 4.5413 |
| ENG07 | BS Industrial Engineering | 42 | 183 | 42.915229 | 5.5404 |
| ENG08 | BS Geodetic Engineering | 24 | 164 | 43.867091 | 4.9652 |
| ENG09 | BS Mining Engineering | 26 | 160 | 43.768090 | 4.8441 |
| ENG10 | BS Materials Engineering | 27 | 153 | 43.629428 | 4.6322 |
| ENG11 | BS Metallurgical Engineering | 16 | 145 | 43.314260 | 4.3899 |
| ENG12 | BS Agricultural and Biosystems Engineering | 38 | 161 | 43.557675 | 4.8744 |
| ENG13 | Bachelor of Industrial Technology | 40 | 207 | 43.353012 | 6.2670 |
| ENG14 | BS Marine Engineering | 41 | 173 | 43.587345 | 5.2377 |
| ENG15 | BS Marine Transportation | 49 | 183 | 42.851953 | 5.5404 |
| SCI01 | BS Biology | 23 | 127 | 44.291856 | 3.8450 |
| SCI02 | BS Marine Biology | 25 | 162 | 43.901302 | 4.9046 |
| SCI03 | BS Chemistry | 25 | 143 | 43.774145 | 4.3294 |
| SCI04 | BS Physics | 24 | 120 | 43.854678 | 3.6331 |
| SCI05 | BS Applied Physics | 40 | 142 | 43.120799 | 4.2991 |
| SCI06 | BS Mathematics | 35 | 176 | 43.062065 | 5.3285 |
| SCI07 | BS Applied Mathematics | 21 | 151 | 42.938238 | 4.5716 |
| SCI08 | BS Statistics | 30 | 175 | 42.809870 | 5.2982 |
| SCI09 | BS Environmental Science | 17 | 133 | 43.873751 | 4.0266 |
| SCI10 | BS Geology | 14 | 127 | 44.359068 | 3.8450 |
| SCI11 | BS Meteorology | 28 | 136 | 43.355737 | 4.1175 |
| AGR01 | BS Agriculture | 32 | 156 | 44.414169 | 4.7230 |
| AGR02 | BS Forestry | 12 | 152 | 44.231608 | 4.6019 |
| AGR03 | BS Fisheries | 23 | 143 | 43.629125 | 4.3294 |
| AGR04 | BS Food Technology | 42 | 180 | 43.714805 | 5.4496 |
| HLT01 | BS Nursing | 27 | 181 | 42.919467 | 5.4799 |
| HLT02 | BS Pharmacy | 28 | 149 | 43.478959 | 4.5111 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 43 | 179 | 42.744475 | 5.4193 |
| HLT04 | BS Physical Therapy | 44 | 212 | 43.297003 | 6.4184 |
| HLT05 | BS Occupational Therapy | 34 | 223 | 42.878898 | 6.7514 |
| HLT06 | BS Radiologic Technology | 39 | 185 | 42.914926 | 5.6010 |
| HLT07 | BS Public Health | 42 | 190 | 43.116863 | 5.7523 |
| HLT08 | BS Nutrition and Dietetics | 45 | 194 | 42.954284 | 5.8734 |
| HLT09 | Doctor of Dental Medicine | 32 | 177 | 42.934908 | 5.3588 |
| HLT10 | Doctor of Veterinary Medicine | 43 | 144 | 43.592189 | 4.3597 |
| EDU01 | Bachelor of Elementary Education | 37 | 211 | 42.729942 | 6.3881 |
| EDU02 | Bachelor of Secondary Education | 31 | 188 | 42.537390 | 5.6918 |
| EDU03 | Bachelor of Early Childhood Education | 36 | 203 | 42.753860 | 6.1459 |
| EDU04 | Bachelor of Physical Education | 55 | 247 | 42.933697 | 7.4781 |
| EDU05 | BS Exercise and Sports Sciences | 40 | 210 | 43.735998 | 6.3579 |
| EDU06 | Bachelor of Culture and Arts Education | 51 | 232 | 42.123524 | 7.0239 |
| EDU07 | Bachelor of Technology and Livelihood Education | 59 | 244 | 42.682410 | 7.3872 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 52 | 202 | 43.334847 | 6.1157 |
| SOC01 | Psychology (BA/BS) | 40 | 196 | 42.524977 | 5.9340 |
| SOC02 | BS Social Work | 51 | 213 | 42.804420 | 6.4487 |
| SOC03 | Bachelor in Human Services | 42 | 210 | 42.706328 | 6.3579 |
| SOC04 | BA Political Science | 26 | 187 | 42.216773 | 5.6615 |
| SOC05 | BA Sociology | 38 | 215 | 42.465940 | 6.5092 |
| SOC06 | BA History | 24 | 171 | 42.326673 | 5.1771 |
| SOC07 | BA Philosophy | 39 | 189 | 42.047835 | 5.7221 |
| SOC08 | Anthropology (BA/BS) | 37 | 195 | 42.862852 | 5.9037 |
| SOC09 | Bachelor of Public Administration | 38 | 212 | 42.101726 | 6.4184 |
| SOC10 | Bachelor of Library and Information Science | 54 | 250 | 42.626097 | 7.5689 |
| SOC11 | BS Criminology | 76 | 270 | 42.674538 | 8.1744 |
| SOC12 | BA Communication | 37 | 230 | 42.670602 | 6.9634 |
| SOC13 | BA Broadcasting | 52 | 237 | 42.317893 | 7.1753 |
| SOC14 | BA Journalism | 46 | 228 | 42.597639 | 6.9028 |
| SOC15 | BS Development Communication | 61 | 227 | 43.255828 | 6.8725 |
| SOC16 | BA English Language Studies | 36 | 220 | 42.742961 | 6.6606 |
| SOC17 | BA Literature | 36 | 231 | 42.530730 | 6.9936 |
| SOC18 | BA Filipino | 48 | 199 | 42.590675 | 6.0248 |
| ART01 | Bachelor of Fine Arts | 38 | 276 | 42.519225 | 8.3560 |
| ART02 | Bachelor of Performing Arts | 66 | 266 | 42.537087 | 8.0533 |
| ART03 | Bachelor of Multimedia Arts | 56 | 265 | 42.188011 | 8.0230 |
| ART04 | BS Interior Design | 49 | 261 | 42.288828 | 7.9019 |
| ART05 | Bachelor of Landscape Architecture | 73 | 249 | 43.176809 | 7.5386 |
| ART06 | BS Architecture | 49 | 228 | 42.866485 | 6.9028 |

### new, 95to100, N=3370

| Course | Name | Top-1 count | Top-5 count | Mean rank | Top-5 share % |
| --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 37 | 192 | 42.932938 | 5.6973 |
| BUS02 | BS Management Accounting | 38 | 192 | 42.752226 | 5.6973 |
| BUS03 | BS Accounting Information Systems | 39 | 199 | 42.554896 | 5.9050 |
| BUS04 | BS Internal Auditing | 34 | 190 | 43.005045 | 5.6380 |
| BUS05 | BS Business Administration | 35 | 197 | 43.260534 | 5.8457 |
| BUS06 | BS Entrepreneurship | 48 | 170 | 43.270623 | 5.0445 |
| BUS07 | BS Office Administration | 55 | 209 | 42.823739 | 6.2018 |
| BUS08 | Economics (BA/BS) | 29 | 182 | 43.159050 | 5.4006 |
| BUS09 | BS Tourism Management | 50 | 223 | 44.026409 | 6.6172 |
| BUS10 | BS Hospitality Management | 53 | 225 | 43.937092 | 6.6766 |
| ICT01 | BS Information Technology | 38 | 242 | 42.495846 | 7.1810 |
| ICT02 | BS Information Systems | 43 | 210 | 42.976855 | 6.2315 |
| ICT03 | BS Computer Science | 38 | 204 | 42.717507 | 6.0534 |
| ENG01 | BS Civil Engineering | 38 | 205 | 43.293472 | 6.0831 |
| ENG02 | BS Mechanical Engineering | 52 | 217 | 43.328190 | 6.4392 |
| ENG03 | BS Electrical Engineering | 46 | 237 | 42.854303 | 7.0326 |
| ENG04 | BS Electronics Engineering | 46 | 239 | 42.528487 | 7.0920 |
| ENG05 | BS Computer Engineering | 49 | 208 | 42.572404 | 6.1721 |
| ENG06 | BS Chemical Engineering | 36 | 154 | 42.833828 | 4.5697 |
| ENG07 | BS Industrial Engineering | 46 | 206 | 42.974481 | 6.1128 |
| ENG08 | BS Geodetic Engineering | 27 | 175 | 43.086053 | 5.1929 |
| ENG09 | BS Mining Engineering | 37 | 178 | 42.694065 | 5.2819 |
| ENG10 | BS Materials Engineering | 24 | 165 | 42.371513 | 4.8961 |
| ENG11 | BS Metallurgical Engineering | 25 | 171 | 42.476558 | 5.0742 |
| ENG12 | BS Agricultural and Biosystems Engineering | 29 | 169 | 42.880415 | 5.0148 |
| ENG13 | Bachelor of Industrial Technology | 49 | 209 | 42.516617 | 6.2018 |
| ENG14 | BS Marine Engineering | 29 | 168 | 43.064688 | 4.9852 |
| ENG15 | BS Marine Transportation | 48 | 207 | 42.835312 | 6.1424 |
| SCI01 | BS Biology | 25 | 144 | 42.656083 | 4.2730 |
| SCI02 | BS Marine Biology | 14 | 141 | 42.999110 | 4.1840 |
| SCI03 | BS Chemistry | 26 | 165 | 42.818991 | 4.8961 |
| SCI04 | BS Physics | 29 | 147 | 42.589614 | 4.3620 |
| SCI05 | BS Applied Physics | 34 | 171 | 42.836202 | 5.0742 |
| SCI06 | BS Mathematics | 38 | 174 | 42.376855 | 5.1632 |
| SCI07 | BS Applied Mathematics | 29 | 167 | 42.912166 | 4.9555 |
| SCI08 | BS Statistics | 43 | 180 | 42.827596 | 5.3412 |
| SCI09 | BS Environmental Science | 18 | 119 | 42.950742 | 3.5312 |
| SCI10 | BS Geology | 16 | 122 | 42.817804 | 3.6202 |
| SCI11 | BS Meteorology | 23 | 167 | 42.814243 | 4.9555 |
| AGR01 | BS Agriculture | 29 | 161 | 42.782789 | 4.7774 |
| AGR02 | BS Forestry | 23 | 145 | 43.047181 | 4.3027 |
| AGR03 | BS Fisheries | 20 | 157 | 42.825223 | 4.6588 |
| AGR04 | BS Food Technology | 56 | 204 | 42.599703 | 6.0534 |
| HLT01 | BS Nursing | 31 | 181 | 42.260831 | 5.3709 |
| HLT02 | BS Pharmacy | 40 | 181 | 42.194955 | 5.3709 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 30 | 182 | 42.199407 | 5.4006 |
| HLT04 | BS Physical Therapy | 58 | 211 | 42.744214 | 6.2611 |
| HLT05 | BS Occupational Therapy | 33 | 204 | 42.373591 | 6.0534 |
| HLT06 | BS Radiologic Technology | 26 | 168 | 42.599110 | 4.9852 |
| HLT07 | BS Public Health | 41 | 205 | 42.297033 | 6.0831 |
| HLT08 | BS Nutrition and Dietetics | 46 | 193 | 42.358160 | 5.7270 |
| HLT09 | Doctor of Dental Medicine | 41 | 175 | 42.217804 | 5.1929 |
| HLT10 | Doctor of Veterinary Medicine | 35 | 166 | 42.813650 | 4.9258 |
| EDU01 | Bachelor of Elementary Education | 33 | 204 | 43.313650 | 6.0534 |
| EDU02 | Bachelor of Secondary Education | 24 | 193 | 43.628190 | 5.7270 |
| EDU03 | Bachelor of Early Childhood Education | 45 | 213 | 43.497923 | 6.3205 |
| EDU04 | Bachelor of Physical Education | 52 | 243 | 43.537389 | 7.2107 |
| EDU05 | BS Exercise and Sports Sciences | 46 | 238 | 43.213650 | 7.0623 |
| EDU06 | Bachelor of Culture and Arts Education | 51 | 207 | 43.716320 | 6.1424 |
| EDU07 | Bachelor of Technology and Livelihood Education | 51 | 233 | 43.653116 | 6.9139 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 50 | 215 | 43.782493 | 6.3798 |
| SOC01 | Psychology (BA/BS) | 48 | 210 | 42.992285 | 6.2315 |
| SOC02 | BS Social Work | 38 | 209 | 43.617211 | 6.2018 |
| SOC03 | Bachelor in Human Services | 44 | 208 | 43.519288 | 6.1721 |
| SOC04 | BA Political Science | 21 | 186 | 43.861128 | 5.5193 |
| SOC05 | BA Sociology | 40 | 205 | 43.504748 | 6.0831 |
| SOC06 | BA History | 22 | 163 | 43.277151 | 4.8368 |
| SOC07 | BA Philosophy | 33 | 169 | 43.449258 | 5.0148 |
| SOC08 | Anthropology (BA/BS) | 42 | 209 | 43.080415 | 6.2018 |
| SOC09 | Bachelor of Public Administration | 40 | 177 | 43.983976 | 5.2522 |
| SOC10 | Bachelor of Library and Information Science | 62 | 241 | 42.826706 | 7.1513 |
| SOC11 | BS Criminology | 60 | 235 | 43.691691 | 6.9733 |
| SOC12 | BA Communication | 57 | 248 | 42.681009 | 7.3591 |
| SOC13 | BA Broadcasting | 42 | 252 | 42.571217 | 7.4777 |
| SOC14 | BA Journalism | 38 | 258 | 42.946884 | 7.6558 |
| SOC15 | BS Development Communication | 63 | 233 | 43.303858 | 6.9139 |
| SOC16 | BA English Language Studies | 48 | 243 | 43.085163 | 7.2107 |
| SOC17 | BA Literature | 40 | 248 | 42.773591 | 7.3591 |
| SOC18 | BA Filipino | 39 | 198 | 43.436795 | 5.8754 |
| ART01 | Bachelor of Fine Arts | 51 | 232 | 43.274184 | 6.8843 |
| ART02 | Bachelor of Performing Arts | 64 | 244 | 43.430564 | 7.2404 |
| ART03 | Bachelor of Multimedia Arts | 49 | 253 | 43.112463 | 7.5074 |
| ART04 | BS Interior Design | 54 | 256 | 43.651039 | 7.5964 |
| ART05 | Bachelor of Landscape Architecture | 55 | 254 | 43.395252 | 7.5371 |
| ART06 | BS Architecture | 46 | 200 | 43.055193 | 5.9347 |

## Appendix B: every target-persona course, route and p

Each row has N=300; probabilities are estimated percentages. Counts permit exact reconstruction.


### old, p=0.5

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 134 | 237 | 267 | 44.6667 | 79.0000 | 89.0000 |
| BUS02 | BS Management Accounting | 124 | 219 | 264 | 41.3333 | 73.0000 | 88.0000 |
| BUS03 | BS Accounting Information Systems | 139 | 230 | 266 | 46.3333 | 76.6667 | 88.6667 |
| BUS04 | BS Internal Auditing | 124 | 235 | 270 | 41.3333 | 78.3333 | 90.0000 |
| BUS05 | BS Business Administration | 127 | 241 | 274 | 42.3333 | 80.3333 | 91.3333 |
| BUS06 | BS Entrepreneurship | 181 | 243 | 271 | 60.3333 | 81.0000 | 90.3333 |
| BUS07 | BS Office Administration | 157 | 227 | 256 | 52.3333 | 75.6667 | 85.3333 |
| BUS08 | Economics (BA/BS) | 148 | 247 | 274 | 49.3333 | 82.3333 | 91.3333 |
| BUS09 | BS Tourism Management | 147 | 234 | 262 | 49.0000 | 78.0000 | 87.3333 |
| BUS10 | BS Hospitality Management | 148 | 243 | 268 | 49.3333 | 81.0000 | 89.3333 |
| ICT01 | BS Information Technology | 100 | 231 | 266 | 33.3333 | 77.0000 | 88.6667 |
| ICT02 | BS Information Systems | 155 | 234 | 264 | 51.6667 | 78.0000 | 88.0000 |
| ICT03 | BS Computer Science | 111 | 219 | 256 | 37.0000 | 73.0000 | 85.3333 |
| ENG01 | BS Civil Engineering | 112 | 212 | 253 | 37.3333 | 70.6667 | 84.3333 |
| ENG02 | BS Mechanical Engineering | 111 | 220 | 254 | 37.0000 | 73.3333 | 84.6667 |
| ENG03 | BS Electrical Engineering | 114 | 230 | 267 | 38.0000 | 76.6667 | 89.0000 |
| ENG04 | BS Electronics Engineering | 130 | 220 | 264 | 43.3333 | 73.3333 | 88.0000 |
| ENG05 | BS Computer Engineering | 120 | 246 | 273 | 40.0000 | 82.0000 | 91.0000 |
| ENG06 | BS Chemical Engineering | 112 | 217 | 258 | 37.3333 | 72.3333 | 86.0000 |
| ENG07 | BS Industrial Engineering | 163 | 226 | 256 | 54.3333 | 75.3333 | 85.3333 |
| ENG08 | BS Geodetic Engineering | 98 | 228 | 271 | 32.6667 | 76.0000 | 90.3333 |
| ENG09 | BS Mining Engineering | 148 | 238 | 261 | 49.3333 | 79.3333 | 87.0000 |
| ENG10 | BS Materials Engineering | 127 | 233 | 265 | 42.3333 | 77.6667 | 88.3333 |
| ENG11 | BS Metallurgical Engineering | 111 | 232 | 263 | 37.0000 | 77.3333 | 87.6667 |
| ENG12 | BS Agricultural and Biosystems Engineering | 150 | 226 | 255 | 50.0000 | 75.3333 | 85.0000 |
| ENG13 | Bachelor of Industrial Technology | 100 | 221 | 253 | 33.3333 | 73.6667 | 84.3333 |
| ENG14 | BS Marine Engineering | 146 | 227 | 264 | 48.6667 | 75.6667 | 88.0000 |
| ENG15 | BS Marine Transportation | 180 | 253 | 277 | 60.0000 | 84.3333 | 92.3333 |
| SCI01 | BS Biology | 124 | 220 | 258 | 41.3333 | 73.3333 | 86.0000 |
| SCI02 | BS Marine Biology | 93 | 216 | 252 | 31.0000 | 72.0000 | 84.0000 |
| SCI03 | BS Chemistry | 112 | 222 | 262 | 37.3333 | 74.0000 | 87.3333 |
| SCI04 | BS Physics | 107 | 214 | 259 | 35.6667 | 71.3333 | 86.3333 |
| SCI05 | BS Applied Physics | 137 | 219 | 270 | 45.6667 | 73.0000 | 90.0000 |
| SCI06 | BS Mathematics | 133 | 216 | 255 | 44.3333 | 72.0000 | 85.0000 |
| SCI07 | BS Applied Mathematics | 161 | 234 | 268 | 53.6667 | 78.0000 | 89.3333 |
| SCI08 | BS Statistics | 144 | 237 | 266 | 48.0000 | 79.0000 | 88.6667 |
| SCI09 | BS Environmental Science | 112 | 239 | 262 | 37.3333 | 79.6667 | 87.3333 |
| SCI10 | BS Geology | 140 | 222 | 259 | 46.6667 | 74.0000 | 86.3333 |
| SCI11 | BS Meteorology | 118 | 216 | 258 | 39.3333 | 72.0000 | 86.0000 |
| AGR01 | BS Agriculture | 136 | 220 | 260 | 45.3333 | 73.3333 | 86.6667 |
| AGR02 | BS Forestry | 74 | 229 | 264 | 24.6667 | 76.3333 | 88.0000 |
| AGR03 | BS Fisheries | 101 | 220 | 250 | 33.6667 | 73.3333 | 83.3333 |
| AGR04 | BS Food Technology | 167 | 241 | 268 | 55.6667 | 80.3333 | 89.3333 |
| HLT01 | BS Nursing | 121 | 222 | 253 | 40.3333 | 74.0000 | 84.3333 |
| HLT02 | BS Pharmacy | 93 | 221 | 266 | 31.0000 | 73.6667 | 88.6667 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 105 | 226 | 267 | 35.0000 | 75.3333 | 89.0000 |
| HLT04 | BS Physical Therapy | 114 | 226 | 258 | 38.0000 | 75.3333 | 86.0000 |
| HLT05 | BS Occupational Therapy | 115 | 233 | 264 | 38.3333 | 77.6667 | 88.0000 |
| HLT06 | BS Radiologic Technology | 125 | 226 | 262 | 41.6667 | 75.3333 | 87.3333 |
| HLT07 | BS Public Health | 107 | 209 | 251 | 35.6667 | 69.6667 | 83.6667 |
| HLT08 | BS Nutrition and Dietetics | 178 | 250 | 273 | 59.3333 | 83.3333 | 91.0000 |
| HLT09 | Doctor of Dental Medicine | 120 | 226 | 258 | 40.0000 | 75.3333 | 86.0000 |
| HLT10 | Doctor of Veterinary Medicine | 149 | 234 | 261 | 49.6667 | 78.0000 | 87.0000 |
| EDU01 | Bachelor of Elementary Education | 134 | 221 | 255 | 44.6667 | 73.6667 | 85.0000 |
| EDU02 | Bachelor of Secondary Education | 107 | 227 | 251 | 35.6667 | 75.6667 | 83.6667 |
| EDU03 | Bachelor of Early Childhood Education | 142 | 223 | 257 | 47.3333 | 74.3333 | 85.6667 |
| EDU04 | Bachelor of Physical Education | 128 | 228 | 252 | 42.6667 | 76.0000 | 84.0000 |
| EDU05 | BS Exercise and Sports Sciences | 123 | 233 | 263 | 41.0000 | 77.6667 | 87.6667 |
| EDU06 | Bachelor of Culture and Arts Education | 137 | 239 | 266 | 45.6667 | 79.6667 | 88.6667 |
| EDU07 | Bachelor of Technology and Livelihood Education | 162 | 241 | 274 | 54.0000 | 80.3333 | 91.3333 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 184 | 238 | 264 | 61.3333 | 79.3333 | 88.0000 |
| SOC01 | Psychology (BA/BS) | 119 | 234 | 266 | 39.6667 | 78.0000 | 88.6667 |
| SOC02 | BS Social Work | 120 | 220 | 263 | 40.0000 | 73.3333 | 87.6667 |
| SOC03 | Bachelor in Human Services | 127 | 223 | 259 | 42.3333 | 74.3333 | 86.3333 |
| SOC04 | BA Political Science | 117 | 231 | 264 | 39.0000 | 77.0000 | 88.0000 |
| SOC05 | BA Sociology | 97 | 205 | 249 | 32.3333 | 68.3333 | 83.0000 |
| SOC06 | BA History | 89 | 214 | 254 | 29.6667 | 71.3333 | 84.6667 |
| SOC07 | BA Philosophy | 100 | 220 | 259 | 33.3333 | 73.3333 | 86.3333 |
| SOC08 | Anthropology (BA/BS) | 125 | 225 | 259 | 41.6667 | 75.0000 | 86.3333 |
| SOC09 | Bachelor of Public Administration | 125 | 221 | 263 | 41.6667 | 73.6667 | 87.6667 |
| SOC10 | Bachelor of Library and Information Science | 152 | 230 | 260 | 50.6667 | 76.6667 | 86.6667 |
| SOC11 | BS Criminology | 153 | 232 | 270 | 51.0000 | 77.3333 | 90.0000 |
| SOC12 | BA Communication | 157 | 223 | 260 | 52.3333 | 74.3333 | 86.6667 |
| SOC13 | BA Broadcasting | 119 | 220 | 258 | 39.6667 | 73.3333 | 86.0000 |
| SOC14 | BA Journalism | 123 | 237 | 263 | 41.0000 | 79.0000 | 87.6667 |
| SOC15 | BS Development Communication | 134 | 228 | 260 | 44.6667 | 76.0000 | 86.6667 |
| SOC16 | BA English Language Studies | 112 | 222 | 257 | 37.3333 | 74.0000 | 85.6667 |
| SOC17 | BA Literature | 115 | 233 | 263 | 38.3333 | 77.6667 | 87.6667 |
| SOC18 | BA Filipino | 121 | 235 | 265 | 40.3333 | 78.3333 | 88.3333 |
| ART01 | Bachelor of Fine Arts | 110 | 238 | 263 | 36.6667 | 79.3333 | 87.6667 |
| ART02 | Bachelor of Performing Arts | 149 | 250 | 275 | 49.6667 | 83.3333 | 91.6667 |
| ART03 | Bachelor of Multimedia Arts | 142 | 233 | 262 | 47.3333 | 77.6667 | 87.3333 |
| ART04 | BS Interior Design | 133 | 244 | 264 | 44.3333 | 81.3333 | 88.0000 |
| ART05 | Bachelor of Landscape Architecture | 166 | 241 | 265 | 55.3333 | 80.3333 | 88.3333 |
| ART06 | BS Architecture | 148 | 241 | 269 | 49.3333 | 80.3333 | 89.6667 |

### old, p=0.75

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 237 | 293 | 298 | 79.0000 | 97.6667 | 99.3333 |
| BUS02 | BS Management Accounting | 228 | 291 | 298 | 76.0000 | 97.0000 | 99.3333 |
| BUS03 | BS Accounting Information Systems | 237 | 294 | 300 | 79.0000 | 98.0000 | 100.0000 |
| BUS04 | BS Internal Auditing | 240 | 294 | 298 | 80.0000 | 98.0000 | 99.3333 |
| BUS05 | BS Business Administration | 214 | 291 | 297 | 71.3333 | 97.0000 | 99.0000 |
| BUS06 | BS Entrepreneurship | 259 | 291 | 298 | 86.3333 | 97.0000 | 99.3333 |
| BUS07 | BS Office Administration | 250 | 286 | 295 | 83.3333 | 95.3333 | 98.3333 |
| BUS08 | Economics (BA/BS) | 239 | 290 | 298 | 79.6667 | 96.6667 | 99.3333 |
| BUS09 | BS Tourism Management | 243 | 289 | 298 | 81.0000 | 96.3333 | 99.3333 |
| BUS10 | BS Hospitality Management | 241 | 292 | 298 | 80.3333 | 97.3333 | 99.3333 |
| ICT01 | BS Information Technology | 206 | 290 | 299 | 68.6667 | 96.6667 | 99.6667 |
| ICT02 | BS Information Systems | 233 | 291 | 299 | 77.6667 | 97.0000 | 99.6667 |
| ICT03 | BS Computer Science | 223 | 295 | 298 | 74.3333 | 98.3333 | 99.3333 |
| ENG01 | BS Civil Engineering | 231 | 290 | 297 | 77.0000 | 96.6667 | 99.0000 |
| ENG02 | BS Mechanical Engineering | 231 | 291 | 297 | 77.0000 | 97.0000 | 99.0000 |
| ENG03 | BS Electrical Engineering | 153 | 281 | 294 | 51.0000 | 93.6667 | 98.0000 |
| ENG04 | BS Electronics Engineering | 238 | 289 | 295 | 79.3333 | 96.3333 | 98.3333 |
| ENG05 | BS Computer Engineering | 221 | 288 | 292 | 73.6667 | 96.0000 | 97.3333 |
| ENG06 | BS Chemical Engineering | 225 | 290 | 296 | 75.0000 | 96.6667 | 98.6667 |
| ENG07 | BS Industrial Engineering | 260 | 286 | 296 | 86.6667 | 95.3333 | 98.6667 |
| ENG08 | BS Geodetic Engineering | 219 | 294 | 298 | 73.0000 | 98.0000 | 99.3333 |
| ENG09 | BS Mining Engineering | 254 | 295 | 298 | 84.6667 | 98.3333 | 99.3333 |
| ENG10 | BS Materials Engineering | 230 | 290 | 298 | 76.6667 | 96.6667 | 99.3333 |
| ENG11 | BS Metallurgical Engineering | 228 | 288 | 292 | 76.0000 | 96.0000 | 97.3333 |
| ENG12 | BS Agricultural and Biosystems Engineering | 245 | 288 | 297 | 81.6667 | 96.0000 | 99.0000 |
| ENG13 | Bachelor of Industrial Technology | 174 | 294 | 298 | 58.0000 | 98.0000 | 99.3333 |
| ENG14 | BS Marine Engineering | 248 | 288 | 296 | 82.6667 | 96.0000 | 98.6667 |
| ENG15 | BS Marine Transportation | 263 | 293 | 298 | 87.6667 | 97.6667 | 99.3333 |
| SCI01 | BS Biology | 241 | 291 | 299 | 80.3333 | 97.0000 | 99.6667 |
| SCI02 | BS Marine Biology | 175 | 288 | 293 | 58.3333 | 96.0000 | 97.6667 |
| SCI03 | BS Chemistry | 219 | 294 | 299 | 73.0000 | 98.0000 | 99.6667 |
| SCI04 | BS Physics | 224 | 289 | 299 | 74.6667 | 96.3333 | 99.6667 |
| SCI05 | BS Applied Physics | 251 | 289 | 296 | 83.6667 | 96.3333 | 98.6667 |
| SCI06 | BS Mathematics | 253 | 293 | 299 | 84.3333 | 97.6667 | 99.6667 |
| SCI07 | BS Applied Mathematics | 257 | 287 | 296 | 85.6667 | 95.6667 | 98.6667 |
| SCI08 | BS Statistics | 249 | 295 | 299 | 83.0000 | 98.3333 | 99.6667 |
| SCI09 | BS Environmental Science | 219 | 287 | 295 | 73.0000 | 95.6667 | 98.3333 |
| SCI10 | BS Geology | 242 | 291 | 300 | 80.6667 | 97.0000 | 100.0000 |
| SCI11 | BS Meteorology | 219 | 289 | 297 | 73.0000 | 96.3333 | 99.0000 |
| AGR01 | BS Agriculture | 247 | 294 | 297 | 82.3333 | 98.0000 | 99.0000 |
| AGR02 | BS Forestry | 214 | 291 | 297 | 71.3333 | 97.0000 | 99.0000 |
| AGR03 | BS Fisheries | 198 | 288 | 299 | 66.0000 | 96.0000 | 99.6667 |
| AGR04 | BS Food Technology | 273 | 293 | 297 | 91.0000 | 97.6667 | 99.0000 |
| HLT01 | BS Nursing | 231 | 287 | 297 | 77.0000 | 95.6667 | 99.0000 |
| HLT02 | BS Pharmacy | 215 | 292 | 298 | 71.6667 | 97.3333 | 99.3333 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 239 | 288 | 300 | 79.6667 | 96.0000 | 100.0000 |
| HLT04 | BS Physical Therapy | 230 | 284 | 293 | 76.6667 | 94.6667 | 97.6667 |
| HLT05 | BS Occupational Therapy | 230 | 288 | 297 | 76.6667 | 96.0000 | 99.0000 |
| HLT06 | BS Radiologic Technology | 238 | 294 | 299 | 79.3333 | 98.0000 | 99.6667 |
| HLT07 | BS Public Health | 243 | 296 | 298 | 81.0000 | 98.6667 | 99.3333 |
| HLT08 | BS Nutrition and Dietetics | 264 | 292 | 297 | 88.0000 | 97.3333 | 99.0000 |
| HLT09 | Doctor of Dental Medicine | 233 | 290 | 298 | 77.6667 | 96.6667 | 99.3333 |
| HLT10 | Doctor of Veterinary Medicine | 256 | 295 | 296 | 85.3333 | 98.3333 | 98.6667 |
| EDU01 | Bachelor of Elementary Education | 247 | 295 | 298 | 82.3333 | 98.3333 | 99.3333 |
| EDU02 | Bachelor of Secondary Education | 220 | 290 | 298 | 73.3333 | 96.6667 | 99.3333 |
| EDU03 | Bachelor of Early Childhood Education | 240 | 291 | 298 | 80.0000 | 97.0000 | 99.3333 |
| EDU04 | Bachelor of Physical Education | 201 | 295 | 297 | 67.0000 | 98.3333 | 99.0000 |
| EDU05 | BS Exercise and Sports Sciences | 195 | 292 | 298 | 65.0000 | 97.3333 | 99.3333 |
| EDU06 | Bachelor of Culture and Arts Education | 225 | 287 | 293 | 75.0000 | 95.6667 | 97.6667 |
| EDU07 | Bachelor of Technology and Livelihood Education | 258 | 294 | 298 | 86.0000 | 98.0000 | 99.3333 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 280 | 294 | 298 | 93.3333 | 98.0000 | 99.3333 |
| SOC01 | Psychology (BA/BS) | 226 | 290 | 300 | 75.3333 | 96.6667 | 100.0000 |
| SOC02 | BS Social Work | 212 | 290 | 297 | 70.6667 | 96.6667 | 99.0000 |
| SOC03 | Bachelor in Human Services | 250 | 294 | 299 | 83.3333 | 98.0000 | 99.6667 |
| SOC04 | BA Political Science | 212 | 286 | 295 | 70.6667 | 95.3333 | 98.3333 |
| SOC05 | BA Sociology | 215 | 290 | 296 | 71.6667 | 96.6667 | 98.6667 |
| SOC06 | BA History | 224 | 295 | 300 | 74.6667 | 98.3333 | 100.0000 |
| SOC07 | BA Philosophy | 217 | 284 | 295 | 72.3333 | 94.6667 | 98.3333 |
| SOC08 | Anthropology (BA/BS) | 233 | 289 | 299 | 77.6667 | 96.3333 | 99.6667 |
| SOC09 | Bachelor of Public Administration | 245 | 289 | 297 | 81.6667 | 96.3333 | 99.0000 |
| SOC10 | Bachelor of Library and Information Science | 248 | 286 | 295 | 82.6667 | 95.3333 | 98.3333 |
| SOC11 | BS Criminology | 258 | 292 | 296 | 86.0000 | 97.3333 | 98.6667 |
| SOC12 | BA Communication | 261 | 287 | 295 | 87.0000 | 95.6667 | 98.3333 |
| SOC13 | BA Broadcasting | 249 | 286 | 294 | 83.0000 | 95.3333 | 98.0000 |
| SOC14 | BA Journalism | 237 | 288 | 296 | 79.0000 | 96.0000 | 98.6667 |
| SOC15 | BS Development Communication | 243 | 288 | 295 | 81.0000 | 96.0000 | 98.3333 |
| SOC16 | BA English Language Studies | 204 | 295 | 300 | 68.0000 | 98.3333 | 100.0000 |
| SOC17 | BA Literature | 228 | 295 | 297 | 76.0000 | 98.3333 | 99.0000 |
| SOC18 | BA Filipino | 215 | 292 | 300 | 71.6667 | 97.3333 | 100.0000 |
| ART01 | Bachelor of Fine Arts | 215 | 289 | 296 | 71.6667 | 96.3333 | 98.6667 |
| ART02 | Bachelor of Performing Arts | 240 | 288 | 297 | 80.0000 | 96.0000 | 99.0000 |
| ART03 | Bachelor of Multimedia Arts | 246 | 293 | 298 | 82.0000 | 97.6667 | 99.3333 |
| ART04 | BS Interior Design | 229 | 293 | 297 | 76.3333 | 97.6667 | 99.0000 |
| ART05 | Bachelor of Landscape Architecture | 258 | 294 | 298 | 86.0000 | 98.0000 | 99.3333 |
| ART06 | BS Architecture | 255 | 291 | 297 | 85.0000 | 97.0000 | 99.0000 |

### old, p=1

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS02 | BS Management Accounting | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| BUS03 | BS Accounting Information Systems | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS04 | BS Internal Auditing | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS05 | BS Business Administration | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| BUS06 | BS Entrepreneurship | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS07 | BS Office Administration | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS08 | Economics (BA/BS) | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS09 | BS Tourism Management | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| BUS10 | BS Hospitality Management | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ICT01 | BS Information Technology | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| ICT02 | BS Information Systems | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ICT03 | BS Computer Science | 288 | 300 | 300 | 96.0000 | 100.0000 | 100.0000 |
| ENG01 | BS Civil Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG02 | BS Mechanical Engineering | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ENG03 | BS Electrical Engineering | 244 | 300 | 300 | 81.3333 | 100.0000 | 100.0000 |
| ENG04 | BS Electronics Engineering | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ENG05 | BS Computer Engineering | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| ENG06 | BS Chemical Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG07 | BS Industrial Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG08 | BS Geodetic Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG09 | BS Mining Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG10 | BS Materials Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG11 | BS Metallurgical Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG12 | BS Agricultural and Biosystems Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG13 | Bachelor of Industrial Technology | 231 | 300 | 300 | 77.0000 | 100.0000 | 100.0000 |
| ENG14 | BS Marine Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG15 | BS Marine Transportation | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI01 | BS Biology | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SCI02 | BS Marine Biology | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| SCI03 | BS Chemistry | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| SCI04 | BS Physics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI05 | BS Applied Physics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI06 | BS Mathematics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI07 | BS Applied Mathematics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI08 | BS Statistics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI09 | BS Environmental Science | 293 | 300 | 300 | 97.6667 | 100.0000 | 100.0000 |
| SCI10 | BS Geology | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SCI11 | BS Meteorology | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| AGR01 | BS Agriculture | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| AGR02 | BS Forestry | 292 | 300 | 300 | 97.3333 | 100.0000 | 100.0000 |
| AGR03 | BS Fisheries | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| AGR04 | BS Food Technology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT01 | BS Nursing | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT02 | BS Pharmacy | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| HLT04 | BS Physical Therapy | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| HLT05 | BS Occupational Therapy | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| HLT06 | BS Radiologic Technology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT07 | BS Public Health | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| HLT08 | BS Nutrition and Dietetics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT09 | Doctor of Dental Medicine | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT10 | Doctor of Veterinary Medicine | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| EDU01 | Bachelor of Elementary Education | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| EDU02 | Bachelor of Secondary Education | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| EDU03 | Bachelor of Early Childhood Education | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| EDU04 | Bachelor of Physical Education | 247 | 300 | 300 | 82.3333 | 100.0000 | 100.0000 |
| EDU05 | BS Exercise and Sports Sciences | 240 | 300 | 300 | 80.0000 | 100.0000 | 100.0000 |
| EDU06 | Bachelor of Culture and Arts Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| EDU07 | Bachelor of Technology and Livelihood Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC01 | Psychology (BA/BS) | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC02 | BS Social Work | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC03 | Bachelor in Human Services | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC04 | BA Political Science | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| SOC05 | BA Sociology | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC06 | BA History | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC07 | BA Philosophy | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC08 | Anthropology (BA/BS) | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC09 | Bachelor of Public Administration | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC10 | Bachelor of Library and Information Science | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC11 | BS Criminology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC12 | BA Communication | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC13 | BA Broadcasting | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC14 | BA Journalism | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC15 | BS Development Communication | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC16 | BA English Language Studies | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC17 | BA Literature | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| SOC18 | BA Filipino | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ART01 | Bachelor of Fine Arts | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ART02 | Bachelor of Performing Arts | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ART03 | Bachelor of Multimedia Arts | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| ART04 | BS Interior Design | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ART05 | Bachelor of Landscape Architecture | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ART06 | BS Architecture | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |

### new, p=0.5

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 197 | 275 | 292 | 65.6667 | 91.6667 | 97.3333 |
| BUS02 | BS Management Accounting | 188 | 279 | 293 | 62.6667 | 93.0000 | 97.6667 |
| BUS03 | BS Accounting Information Systems | 201 | 276 | 289 | 67.0000 | 92.0000 | 96.3333 |
| BUS04 | BS Internal Auditing | 195 | 279 | 293 | 65.0000 | 93.0000 | 97.6667 |
| BUS05 | BS Business Administration | 186 | 278 | 290 | 62.0000 | 92.6667 | 96.6667 |
| BUS06 | BS Entrepreneurship | 182 | 278 | 291 | 60.6667 | 92.6667 | 97.0000 |
| BUS07 | BS Office Administration | 242 | 282 | 293 | 80.6667 | 94.0000 | 97.6667 |
| BUS08 | Economics (BA/BS) | 219 | 273 | 283 | 73.0000 | 91.0000 | 94.3333 |
| BUS09 | BS Tourism Management | 244 | 282 | 284 | 81.3333 | 94.0000 | 94.6667 |
| BUS10 | BS Hospitality Management | 232 | 286 | 296 | 77.3333 | 95.3333 | 98.6667 |
| ICT01 | BS Information Technology | 220 | 283 | 292 | 73.3333 | 94.3333 | 97.3333 |
| ICT02 | BS Information Systems | 178 | 280 | 291 | 59.3333 | 93.3333 | 97.0000 |
| ICT03 | BS Computer Science | 215 | 282 | 290 | 71.6667 | 94.0000 | 96.6667 |
| ENG01 | BS Civil Engineering | 187 | 272 | 287 | 62.3333 | 90.6667 | 95.6667 |
| ENG02 | BS Mechanical Engineering | 220 | 278 | 287 | 73.3333 | 92.6667 | 95.6667 |
| ENG03 | BS Electrical Engineering | 206 | 278 | 288 | 68.6667 | 92.6667 | 96.0000 |
| ENG04 | BS Electronics Engineering | 234 | 284 | 290 | 78.0000 | 94.6667 | 96.6667 |
| ENG05 | BS Computer Engineering | 212 | 273 | 287 | 70.6667 | 91.0000 | 95.6667 |
| ENG06 | BS Chemical Engineering | 150 | 255 | 280 | 50.0000 | 85.0000 | 93.3333 |
| ENG07 | BS Industrial Engineering | 205 | 271 | 286 | 68.3333 | 90.3333 | 95.3333 |
| ENG08 | BS Geodetic Engineering | 121 | 252 | 282 | 40.3333 | 84.0000 | 94.0000 |
| ENG09 | BS Mining Engineering | 172 | 250 | 276 | 57.3333 | 83.3333 | 92.0000 |
| ENG10 | BS Materials Engineering | 154 | 266 | 281 | 51.3333 | 88.6667 | 93.6667 |
| ENG11 | BS Metallurgical Engineering | 157 | 268 | 284 | 52.3333 | 89.3333 | 94.6667 |
| ENG12 | BS Agricultural and Biosystems Engineering | 204 | 269 | 285 | 68.0000 | 89.6667 | 95.0000 |
| ENG13 | Bachelor of Industrial Technology | 244 | 282 | 287 | 81.3333 | 94.0000 | 95.6667 |
| ENG14 | BS Marine Engineering | 222 | 283 | 295 | 74.0000 | 94.3333 | 98.3333 |
| ENG15 | BS Marine Transportation | 260 | 287 | 295 | 86.6667 | 95.6667 | 98.3333 |
| SCI01 | BS Biology | 157 | 266 | 285 | 52.3333 | 88.6667 | 95.0000 |
| SCI02 | BS Marine Biology | 220 | 281 | 288 | 73.3333 | 93.6667 | 96.0000 |
| SCI03 | BS Chemistry | 141 | 270 | 286 | 47.0000 | 90.0000 | 95.3333 |
| SCI04 | BS Physics | 126 | 257 | 289 | 42.0000 | 85.6667 | 96.3333 |
| SCI05 | BS Applied Physics | 177 | 263 | 286 | 59.0000 | 87.6667 | 95.3333 |
| SCI06 | BS Mathematics | 181 | 262 | 281 | 60.3333 | 87.3333 | 93.6667 |
| SCI07 | BS Applied Mathematics | 152 | 252 | 276 | 50.6667 | 84.0000 | 92.0000 |
| SCI08 | BS Statistics | 217 | 287 | 295 | 72.3333 | 95.6667 | 98.3333 |
| SCI09 | BS Environmental Science | 168 | 275 | 284 | 56.0000 | 91.6667 | 94.6667 |
| SCI10 | BS Geology | 130 | 259 | 278 | 43.3333 | 86.3333 | 92.6667 |
| SCI11 | BS Meteorology | 145 | 269 | 289 | 48.3333 | 89.6667 | 96.3333 |
| AGR01 | BS Agriculture | 196 | 281 | 288 | 65.3333 | 93.6667 | 96.0000 |
| AGR02 | BS Forestry | 159 | 275 | 288 | 53.0000 | 91.6667 | 96.0000 |
| AGR03 | BS Fisheries | 168 | 273 | 285 | 56.0000 | 91.0000 | 95.0000 |
| AGR04 | BS Food Technology | 215 | 278 | 290 | 71.6667 | 92.6667 | 96.6667 |
| HLT01 | BS Nursing | 172 | 280 | 290 | 57.3333 | 93.3333 | 96.6667 |
| HLT02 | BS Pharmacy | 169 | 266 | 292 | 56.3333 | 88.6667 | 97.3333 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 192 | 271 | 291 | 64.0000 | 90.3333 | 97.0000 |
| HLT04 | BS Physical Therapy | 209 | 287 | 291 | 69.6667 | 95.6667 | 97.0000 |
| HLT05 | BS Occupational Therapy | 241 | 286 | 291 | 80.3333 | 95.3333 | 97.0000 |
| HLT06 | BS Radiologic Technology | 199 | 272 | 285 | 66.3333 | 90.6667 | 95.0000 |
| HLT07 | BS Public Health | 208 | 279 | 288 | 69.3333 | 93.0000 | 96.0000 |
| HLT08 | BS Nutrition and Dietetics | 223 | 283 | 295 | 74.3333 | 94.3333 | 98.3333 |
| HLT09 | Doctor of Dental Medicine | 178 | 271 | 291 | 59.3333 | 90.3333 | 97.0000 |
| HLT10 | Doctor of Veterinary Medicine | 184 | 265 | 282 | 61.3333 | 88.3333 | 94.0000 |
| EDU01 | Bachelor of Elementary Education | 187 | 288 | 295 | 62.3333 | 96.0000 | 98.3333 |
| EDU02 | Bachelor of Secondary Education | 188 | 285 | 293 | 62.6667 | 95.0000 | 97.6667 |
| EDU03 | Bachelor of Early Childhood Education | 226 | 285 | 292 | 75.3333 | 95.0000 | 97.3333 |
| EDU04 | Bachelor of Physical Education | 210 | 287 | 292 | 70.0000 | 95.6667 | 97.3333 |
| EDU05 | BS Exercise and Sports Sciences | 198 | 291 | 295 | 66.0000 | 97.0000 | 98.3333 |
| EDU06 | Bachelor of Culture and Arts Education | 198 | 282 | 289 | 66.0000 | 94.0000 | 96.3333 |
| EDU07 | Bachelor of Technology and Livelihood Education | 262 | 284 | 289 | 87.3333 | 94.6667 | 96.3333 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 243 | 278 | 283 | 81.0000 | 92.6667 | 94.3333 |
| SOC01 | Psychology (BA/BS) | 197 | 279 | 292 | 65.6667 | 93.0000 | 97.3333 |
| SOC02 | BS Social Work | 183 | 281 | 289 | 61.0000 | 93.6667 | 96.3333 |
| SOC03 | Bachelor in Human Services | 192 | 278 | 286 | 64.0000 | 92.6667 | 95.3333 |
| SOC04 | BA Political Science | 173 | 280 | 292 | 57.6667 | 93.3333 | 97.3333 |
| SOC05 | BA Sociology | 183 | 272 | 288 | 61.0000 | 90.6667 | 96.0000 |
| SOC06 | BA History | 160 | 270 | 285 | 53.3333 | 90.0000 | 95.0000 |
| SOC07 | BA Philosophy | 135 | 267 | 293 | 45.0000 | 89.0000 | 97.6667 |
| SOC08 | Anthropology (BA/BS) | 184 | 274 | 290 | 61.3333 | 91.3333 | 96.6667 |
| SOC09 | Bachelor of Public Administration | 202 | 286 | 296 | 67.3333 | 95.3333 | 98.6667 |
| SOC10 | Bachelor of Library and Information Science | 235 | 278 | 290 | 78.3333 | 92.6667 | 96.6667 |
| SOC11 | BS Criminology | 239 | 280 | 290 | 79.6667 | 93.3333 | 96.6667 |
| SOC12 | BA Communication | 225 | 283 | 292 | 75.0000 | 94.3333 | 97.3333 |
| SOC13 | BA Broadcasting | 153 | 266 | 287 | 51.0000 | 88.6667 | 95.6667 |
| SOC14 | BA Journalism | 128 | 250 | 280 | 42.6667 | 83.3333 | 93.3333 |
| SOC15 | BS Development Communication | 223 | 275 | 286 | 74.3333 | 91.6667 | 95.3333 |
| SOC16 | BA English Language Studies | 123 | 268 | 288 | 41.0000 | 89.3333 | 96.0000 |
| SOC17 | BA Literature | 126 | 261 | 281 | 42.0000 | 87.0000 | 93.6667 |
| SOC18 | BA Filipino | 175 | 281 | 291 | 58.3333 | 93.6667 | 97.0000 |
| ART01 | Bachelor of Fine Arts | 187 | 287 | 294 | 62.3333 | 95.6667 | 98.0000 |
| ART02 | Bachelor of Performing Arts | 205 | 284 | 293 | 68.3333 | 94.6667 | 97.6667 |
| ART03 | Bachelor of Multimedia Arts | 218 | 283 | 286 | 72.6667 | 94.3333 | 95.3333 |
| ART04 | BS Interior Design | 226 | 274 | 282 | 75.3333 | 91.3333 | 94.0000 |
| ART05 | Bachelor of Landscape Architecture | 229 | 276 | 283 | 76.3333 | 92.0000 | 94.3333 |
| ART06 | BS Architecture | 212 | 284 | 291 | 70.6667 | 94.6667 | 97.0000 |

### new, p=0.75

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 268 | 299 | 299 | 89.3333 | 99.6667 | 99.6667 |
| BUS02 | BS Management Accounting | 266 | 300 | 300 | 88.6667 | 100.0000 | 100.0000 |
| BUS03 | BS Accounting Information Systems | 269 | 300 | 300 | 89.6667 | 100.0000 | 100.0000 |
| BUS04 | BS Internal Auditing | 266 | 300 | 300 | 88.6667 | 100.0000 | 100.0000 |
| BUS05 | BS Business Administration | 255 | 300 | 300 | 85.0000 | 100.0000 | 100.0000 |
| BUS06 | BS Entrepreneurship | 261 | 300 | 300 | 87.0000 | 100.0000 | 100.0000 |
| BUS07 | BS Office Administration | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| BUS08 | Economics (BA/BS) | 285 | 300 | 300 | 95.0000 | 100.0000 | 100.0000 |
| BUS09 | BS Tourism Management | 298 | 299 | 299 | 99.3333 | 99.6667 | 99.6667 |
| BUS10 | BS Hospitality Management | 291 | 300 | 300 | 97.0000 | 100.0000 | 100.0000 |
| ICT01 | BS Information Technology | 286 | 300 | 300 | 95.3333 | 100.0000 | 100.0000 |
| ICT02 | BS Information Systems | 274 | 300 | 300 | 91.3333 | 100.0000 | 100.0000 |
| ICT03 | BS Computer Science | 286 | 299 | 300 | 95.3333 | 99.6667 | 100.0000 |
| ENG01 | BS Civil Engineering | 256 | 299 | 300 | 85.3333 | 99.6667 | 100.0000 |
| ENG02 | BS Mechanical Engineering | 291 | 300 | 300 | 97.0000 | 100.0000 | 100.0000 |
| ENG03 | BS Electrical Engineering | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| ENG04 | BS Electronics Engineering | 289 | 299 | 299 | 96.3333 | 99.6667 | 99.6667 |
| ENG05 | BS Computer Engineering | 290 | 298 | 300 | 96.6667 | 99.3333 | 100.0000 |
| ENG06 | BS Chemical Engineering | 240 | 299 | 300 | 80.0000 | 99.6667 | 100.0000 |
| ENG07 | BS Industrial Engineering | 277 | 295 | 298 | 92.3333 | 98.3333 | 99.3333 |
| ENG08 | BS Geodetic Engineering | 234 | 298 | 300 | 78.0000 | 99.3333 | 100.0000 |
| ENG09 | BS Mining Engineering | 259 | 297 | 300 | 86.3333 | 99.0000 | 100.0000 |
| ENG10 | BS Materials Engineering | 234 | 300 | 300 | 78.0000 | 100.0000 | 100.0000 |
| ENG11 | BS Metallurgical Engineering | 213 | 299 | 300 | 71.0000 | 99.6667 | 100.0000 |
| ENG12 | BS Agricultural and Biosystems Engineering | 283 | 299 | 300 | 94.3333 | 99.6667 | 100.0000 |
| ENG13 | Bachelor of Industrial Technology | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG14 | BS Marine Engineering | 294 | 299 | 300 | 98.0000 | 99.6667 | 100.0000 |
| ENG15 | BS Marine Transportation | 294 | 299 | 299 | 98.0000 | 99.6667 | 99.6667 |
| SCI01 | BS Biology | 248 | 300 | 300 | 82.6667 | 100.0000 | 100.0000 |
| SCI02 | BS Marine Biology | 291 | 299 | 300 | 97.0000 | 99.6667 | 100.0000 |
| SCI03 | BS Chemistry | 239 | 298 | 300 | 79.6667 | 99.3333 | 100.0000 |
| SCI04 | BS Physics | 236 | 298 | 300 | 78.6667 | 99.3333 | 100.0000 |
| SCI05 | BS Applied Physics | 270 | 296 | 300 | 90.0000 | 98.6667 | 100.0000 |
| SCI06 | BS Mathematics | 270 | 298 | 300 | 90.0000 | 99.3333 | 100.0000 |
| SCI07 | BS Applied Mathematics | 252 | 297 | 300 | 84.0000 | 99.0000 | 100.0000 |
| SCI08 | BS Statistics | 280 | 300 | 300 | 93.3333 | 100.0000 | 100.0000 |
| SCI09 | BS Environmental Science | 253 | 297 | 299 | 84.3333 | 99.0000 | 99.6667 |
| SCI10 | BS Geology | 226 | 297 | 300 | 75.3333 | 99.0000 | 100.0000 |
| SCI11 | BS Meteorology | 233 | 298 | 299 | 77.6667 | 99.3333 | 99.6667 |
| AGR01 | BS Agriculture | 271 | 300 | 300 | 90.3333 | 100.0000 | 100.0000 |
| AGR02 | BS Forestry | 240 | 300 | 300 | 80.0000 | 100.0000 | 100.0000 |
| AGR03 | BS Fisheries | 228 | 299 | 299 | 76.0000 | 99.6667 | 99.6667 |
| AGR04 | BS Food Technology | 287 | 298 | 300 | 95.6667 | 99.3333 | 100.0000 |
| HLT01 | BS Nursing | 262 | 300 | 300 | 87.3333 | 100.0000 | 100.0000 |
| HLT02 | BS Pharmacy | 264 | 299 | 299 | 88.0000 | 99.6667 | 99.6667 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 263 | 299 | 300 | 87.6667 | 99.6667 | 100.0000 |
| HLT04 | BS Physical Therapy | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| HLT05 | BS Occupational Therapy | 291 | 299 | 300 | 97.0000 | 99.6667 | 100.0000 |
| HLT06 | BS Radiologic Technology | 276 | 299 | 300 | 92.0000 | 99.6667 | 100.0000 |
| HLT07 | BS Public Health | 276 | 300 | 300 | 92.0000 | 100.0000 | 100.0000 |
| HLT08 | BS Nutrition and Dietetics | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| HLT09 | Doctor of Dental Medicine | 259 | 298 | 300 | 86.3333 | 99.3333 | 100.0000 |
| HLT10 | Doctor of Veterinary Medicine | 270 | 299 | 300 | 90.0000 | 99.6667 | 100.0000 |
| EDU01 | Bachelor of Elementary Education | 251 | 300 | 300 | 83.6667 | 100.0000 | 100.0000 |
| EDU02 | Bachelor of Secondary Education | 254 | 300 | 300 | 84.6667 | 100.0000 | 100.0000 |
| EDU03 | Bachelor of Early Childhood Education | 278 | 300 | 300 | 92.6667 | 100.0000 | 100.0000 |
| EDU04 | Bachelor of Physical Education | 267 | 299 | 299 | 89.0000 | 99.6667 | 99.6667 |
| EDU05 | BS Exercise and Sports Sciences | 269 | 299 | 300 | 89.6667 | 99.6667 | 100.0000 |
| EDU06 | Bachelor of Culture and Arts Education | 272 | 299 | 300 | 90.6667 | 99.6667 | 100.0000 |
| EDU07 | Bachelor of Technology and Livelihood Education | 298 | 298 | 298 | 99.3333 | 99.3333 | 99.3333 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC01 | Psychology (BA/BS) | 268 | 299 | 300 | 89.3333 | 99.6667 | 100.0000 |
| SOC02 | BS Social Work | 261 | 300 | 300 | 87.0000 | 100.0000 | 100.0000 |
| SOC03 | Bachelor in Human Services | 259 | 299 | 300 | 86.3333 | 99.6667 | 100.0000 |
| SOC04 | BA Political Science | 262 | 300 | 300 | 87.3333 | 100.0000 | 100.0000 |
| SOC05 | BA Sociology | 257 | 299 | 299 | 85.6667 | 99.6667 | 99.6667 |
| SOC06 | BA History | 218 | 298 | 300 | 72.6667 | 99.3333 | 100.0000 |
| SOC07 | BA Philosophy | 230 | 299 | 300 | 76.6667 | 99.6667 | 100.0000 |
| SOC08 | Anthropology (BA/BS) | 256 | 297 | 300 | 85.3333 | 99.0000 | 100.0000 |
| SOC09 | Bachelor of Public Administration | 266 | 298 | 300 | 88.6667 | 99.3333 | 100.0000 |
| SOC10 | Bachelor of Library and Information Science | 291 | 300 | 300 | 97.0000 | 100.0000 | 100.0000 |
| SOC11 | BS Criminology | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| SOC12 | BA Communication | 289 | 299 | 300 | 96.3333 | 99.6667 | 100.0000 |
| SOC13 | BA Broadcasting | 241 | 296 | 300 | 80.3333 | 98.6667 | 100.0000 |
| SOC14 | BA Journalism | 235 | 298 | 300 | 78.3333 | 99.3333 | 100.0000 |
| SOC15 | BS Development Communication | 282 | 297 | 300 | 94.0000 | 99.0000 | 100.0000 |
| SOC16 | BA English Language Studies | 219 | 300 | 300 | 73.0000 | 100.0000 | 100.0000 |
| SOC17 | BA Literature | 213 | 299 | 299 | 71.0000 | 99.6667 | 99.6667 |
| SOC18 | BA Filipino | 259 | 299 | 300 | 86.3333 | 99.6667 | 100.0000 |
| ART01 | Bachelor of Fine Arts | 265 | 299 | 300 | 88.3333 | 99.6667 | 100.0000 |
| ART02 | Bachelor of Performing Arts | 271 | 300 | 300 | 90.3333 | 100.0000 | 100.0000 |
| ART03 | Bachelor of Multimedia Arts | 276 | 300 | 300 | 92.0000 | 100.0000 | 100.0000 |
| ART04 | BS Interior Design | 288 | 300 | 300 | 96.0000 | 100.0000 | 100.0000 |
| ART05 | Bachelor of Landscape Architecture | 290 | 300 | 300 | 96.6667 | 100.0000 | 100.0000 |
| ART06 | BS Architecture | 281 | 299 | 300 | 93.6667 | 99.6667 | 100.0000 |

### new, p=1

| Course | Name | Rank-1 count | Top-5 count | Top-10 count | Rank 1 % | Top 5 % | Top 10 % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | BS Accountancy | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| BUS02 | BS Management Accounting | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| BUS03 | BS Accounting Information Systems | 293 | 300 | 300 | 97.6667 | 100.0000 | 100.0000 |
| BUS04 | BS Internal Auditing | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| BUS05 | BS Business Administration | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| BUS06 | BS Entrepreneurship | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| BUS07 | BS Office Administration | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS08 | Economics (BA/BS) | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| BUS09 | BS Tourism Management | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| BUS10 | BS Hospitality Management | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ICT01 | BS Information Technology | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| ICT02 | BS Information Systems | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| ICT03 | BS Computer Science | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ENG01 | BS Civil Engineering | 283 | 300 | 300 | 94.3333 | 100.0000 | 100.0000 |
| ENG02 | BS Mechanical Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG03 | BS Electrical Engineering | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| ENG04 | BS Electronics Engineering | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ENG05 | BS Computer Engineering | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| ENG06 | BS Chemical Engineering | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| ENG07 | BS Industrial Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG08 | BS Geodetic Engineering | 286 | 300 | 300 | 95.3333 | 100.0000 | 100.0000 |
| ENG09 | BS Mining Engineering | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ENG10 | BS Materials Engineering | 269 | 300 | 300 | 89.6667 | 100.0000 | 100.0000 |
| ENG11 | BS Metallurgical Engineering | 254 | 300 | 300 | 84.6667 | 100.0000 | 100.0000 |
| ENG12 | BS Agricultural and Biosystems Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG13 | Bachelor of Industrial Technology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG14 | BS Marine Engineering | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ENG15 | BS Marine Transportation | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI01 | BS Biology | 285 | 300 | 300 | 95.0000 | 100.0000 | 100.0000 |
| SCI02 | BS Marine Biology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI03 | BS Chemistry | 267 | 300 | 300 | 89.0000 | 100.0000 | 100.0000 |
| SCI04 | BS Physics | 291 | 300 | 300 | 97.0000 | 100.0000 | 100.0000 |
| SCI05 | BS Applied Physics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI06 | BS Mathematics | 294 | 300 | 300 | 98.0000 | 100.0000 | 100.0000 |
| SCI07 | BS Applied Mathematics | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| SCI08 | BS Statistics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SCI09 | BS Environmental Science | 293 | 300 | 300 | 97.6667 | 100.0000 | 100.0000 |
| SCI10 | BS Geology | 275 | 300 | 300 | 91.6667 | 100.0000 | 100.0000 |
| SCI11 | BS Meteorology | 276 | 300 | 300 | 92.0000 | 100.0000 | 100.0000 |
| AGR01 | BS Agriculture | 281 | 300 | 300 | 93.6667 | 100.0000 | 100.0000 |
| AGR02 | BS Forestry | 280 | 300 | 300 | 93.3333 | 100.0000 | 100.0000 |
| AGR03 | BS Fisheries | 264 | 300 | 300 | 88.0000 | 100.0000 | 100.0000 |
| AGR04 | BS Food Technology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT01 | BS Nursing | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| HLT02 | BS Pharmacy | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| HLT03 | BS Medical Technology / Medical Laboratory Science | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| HLT04 | BS Physical Therapy | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| HLT05 | BS Occupational Therapy | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| HLT06 | BS Radiologic Technology | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| HLT07 | BS Public Health | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| HLT08 | BS Nutrition and Dietetics | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT09 | Doctor of Dental Medicine | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| HLT10 | Doctor of Veterinary Medicine | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| EDU01 | Bachelor of Elementary Education | 265 | 300 | 300 | 88.3333 | 100.0000 | 100.0000 |
| EDU02 | Bachelor of Secondary Education | 272 | 300 | 300 | 90.6667 | 100.0000 | 100.0000 |
| EDU03 | Bachelor of Early Childhood Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| EDU04 | Bachelor of Physical Education | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| EDU05 | BS Exercise and Sports Sciences | 291 | 300 | 300 | 97.0000 | 100.0000 | 100.0000 |
| EDU06 | Bachelor of Culture and Arts Education | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| EDU07 | Bachelor of Technology and Livelihood Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| EDU08 | Bachelor of Technical-Vocational Teacher Education | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC01 | Psychology (BA/BS) | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC02 | BS Social Work | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC03 | Bachelor in Human Services | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| SOC04 | BA Political Science | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |
| SOC05 | BA Sociology | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| SOC06 | BA History | 286 | 300 | 300 | 95.3333 | 100.0000 | 100.0000 |
| SOC07 | BA Philosophy | 279 | 300 | 300 | 93.0000 | 100.0000 | 100.0000 |
| SOC08 | Anthropology (BA/BS) | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC09 | Bachelor of Public Administration | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC10 | Bachelor of Library and Information Science | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC11 | BS Criminology | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC12 | BA Communication | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| SOC13 | BA Broadcasting | 293 | 300 | 300 | 97.6667 | 100.0000 | 100.0000 |
| SOC14 | BA Journalism | 296 | 300 | 300 | 98.6667 | 100.0000 | 100.0000 |
| SOC15 | BS Development Communication | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| SOC16 | BA English Language Studies | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| SOC17 | BA Literature | 286 | 300 | 300 | 95.3333 | 100.0000 | 100.0000 |
| SOC18 | BA Filipino | 284 | 300 | 300 | 94.6667 | 100.0000 | 100.0000 |
| ART01 | Bachelor of Fine Arts | 289 | 300 | 300 | 96.3333 | 100.0000 | 100.0000 |
| ART02 | Bachelor of Performing Arts | 297 | 300 | 300 | 99.0000 | 100.0000 | 100.0000 |
| ART03 | Bachelor of Multimedia Arts | 295 | 300 | 300 | 98.3333 | 100.0000 | 100.0000 |
| ART04 | BS Interior Design | 299 | 300 | 300 | 99.6667 | 100.0000 | 100.0000 |
| ART05 | Bachelor of Landscape Architecture | 300 | 300 | 300 | 100.0000 | 100.0000 | 100.0000 |
| ART06 | BS Architecture | 298 | 300 | 300 | 99.3333 | 100.0000 | 100.0000 |

## Appendix C: per-course realized target inclusion

Each rate is final linked selections/opportunities. Interests, skill-high, certificates and old subjects each have 600 opportunities per row; strand and core have 300; electives have 1,500. Full included counts and denominators are in recoverability.json.


### old, p=0.5

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 62.6667 | 72.6667 | 57.1667 | 57.3333 | 55.0000 | N/A | N/A |
| BUS02 | 63.3333 | 68.5000 | 56.6667 | 60.6667 | 54.1667 | N/A | N/A |
| BUS03 | 64.1667 | 70.1667 | 54.0000 | 54.3333 | 52.8333 | N/A | N/A |
| BUS04 | 59.5000 | 64.3333 | 54.6667 | 57.3333 | 56.3333 | N/A | N/A |
| BUS05 | 66.6667 | 67.6667 | 52.6667 | 56.6667 | 52.5000 | N/A | N/A |
| BUS06 | 62.3333 | 71.1667 | 58.1667 | 55.0000 | 56.1667 | N/A | N/A |
| BUS07 | 62.0000 | 70.0000 | 56.6667 | 57.3333 | 53.5000 | N/A | N/A |
| BUS08 | 63.3333 | 73.1667 | 57.0000 | 59.6667 | 54.0000 | N/A | N/A |
| BUS09 | 63.3333 | 72.0000 | 55.5000 | 52.6667 | 50.5000 | N/A | N/A |
| BUS10 | 62.6667 | 68.8333 | 57.0000 | 58.3333 | 54.6667 | N/A | N/A |
| ICT01 | 62.8333 | 74.0000 | 53.1667 | 56.0000 | 54.0000 | N/A | N/A |
| ICT02 | 64.0000 | 70.1667 | 57.0000 | 56.6667 | 52.6667 | N/A | N/A |
| ICT03 | 59.5000 | 70.8333 | 51.1667 | 54.0000 | 54.1667 | N/A | N/A |
| ENG01 | 62.0000 | 71.0000 | 58.5000 | 50.0000 | 51.3333 | N/A | N/A |
| ENG02 | 60.0000 | 66.1667 | 55.1667 | 56.6667 | 52.0000 | N/A | N/A |
| ENG03 | 63.6667 | 69.8333 | 56.8333 | 56.0000 | 55.8333 | N/A | N/A |
| ENG04 | 63.3333 | 71.1667 | 51.6667 | 52.3333 | 50.6667 | N/A | N/A |
| ENG05 | 61.8333 | 67.6667 | 52.6667 | 59.6667 | 56.6667 | N/A | N/A |
| ENG06 | 61.5000 | 67.3333 | 55.8333 | 58.6667 | 52.6667 | N/A | N/A |
| ENG07 | 63.3333 | 67.6667 | 57.0000 | 56.6667 | 53.1667 | N/A | N/A |
| ENG08 | 63.3333 | 70.5000 | 56.1667 | 56.0000 | 51.1667 | N/A | N/A |
| ENG09 | 62.0000 | 74.1667 | 52.8333 | 50.6667 | 57.0000 | N/A | N/A |
| ENG10 | 65.1667 | 69.8333 | 52.0000 | 56.3333 | 53.0000 | N/A | N/A |
| ENG11 | 66.0000 | 68.6667 | 54.8333 | 58.3333 | 52.0000 | N/A | N/A |
| ENG12 | 67.8333 | 67.5000 | 54.3333 | 54.0000 | 51.3333 | N/A | N/A |
| ENG13 | 59.3333 | 68.0000 | 57.1667 | 50.3333 | 52.6667 | N/A | N/A |
| ENG14 | 62.8333 | 70.6667 | 55.0000 | 50.6667 | 55.5000 | N/A | N/A |
| ENG15 | 64.0000 | 71.6667 | 56.8333 | 54.3333 | 55.0000 | N/A | N/A |
| SCI01 | 61.3333 | 71.6667 | 53.0000 | 56.3333 | 54.0000 | N/A | N/A |
| SCI02 | 61.1667 | 69.1667 | 53.8333 | 50.6667 | 52.8333 | N/A | N/A |
| SCI03 | 63.6667 | 67.5000 | 56.1667 | 54.6667 | 55.3333 | N/A | N/A |
| SCI04 | 61.8333 | 70.6667 | 56.8333 | 54.0000 | 54.3333 | N/A | N/A |
| SCI05 | 64.0000 | 71.0000 | 52.3333 | 52.3333 | 55.3333 | N/A | N/A |
| SCI06 | 60.5000 | 70.8333 | 54.3333 | 53.3333 | 56.6667 | N/A | N/A |
| SCI07 | 60.6667 | 72.1667 | 59.0000 | 55.6667 | 55.8333 | N/A | N/A |
| SCI08 | 66.1667 | 70.3333 | 53.1667 | 55.6667 | 51.5000 | N/A | N/A |
| SCI09 | 60.8333 | 70.8333 | 53.6667 | 55.0000 | 55.5000 | N/A | N/A |
| SCI10 | 63.1667 | 75.1667 | 53.6667 | 54.0000 | 55.5000 | N/A | N/A |
| SCI11 | 61.6667 | 72.8333 | 51.3333 | 57.0000 | 54.3333 | N/A | N/A |
| AGR01 | 62.8333 | 69.5000 | 51.8333 | 54.3333 | 50.0000 | N/A | N/A |
| AGR02 | 61.6667 | 71.3333 | 51.3333 | 53.0000 | 52.6667 | N/A | N/A |
| AGR03 | 61.0000 | 69.8333 | 56.6667 | 54.6667 | 52.5000 | N/A | N/A |
| AGR04 | 61.1667 | 65.6667 | 55.6667 | 55.6667 | 55.1667 | N/A | N/A |
| HLT01 | 62.6667 | 70.1667 | 54.1667 | 50.3333 | 51.3333 | N/A | N/A |
| HLT02 | 59.0000 | 71.8333 | 55.8333 | 59.0000 | 53.3333 | N/A | N/A |
| HLT03 | 60.6667 | 68.1667 | 57.8333 | 54.0000 | 52.8333 | N/A | N/A |
| HLT04 | 65.6667 | 68.1667 | 55.0000 | 52.0000 | 53.6667 | N/A | N/A |
| HLT05 | 61.8333 | 70.5000 | 57.6667 | 51.3333 | 56.8333 | N/A | N/A |
| HLT06 | 63.1667 | 66.8333 | 55.8333 | 54.0000 | 55.5000 | N/A | N/A |
| HLT07 | 60.1667 | 70.3333 | 56.3333 | 50.6667 | 50.0000 | N/A | N/A |
| HLT08 | 65.0000 | 71.6667 | 57.0000 | 58.0000 | 53.6667 | N/A | N/A |
| HLT09 | 62.1667 | 66.1667 | 54.5000 | 53.0000 | 56.0000 | N/A | N/A |
| HLT10 | 63.6667 | 67.0000 | 55.3333 | 55.6667 | 51.8333 | N/A | N/A |
| EDU01 | 62.3333 | 68.6667 | 53.3333 | 53.6667 | 55.3333 | N/A | N/A |
| EDU02 | 63.0000 | 67.6667 | 57.0000 | 56.3333 | 54.3333 | N/A | N/A |
| EDU03 | 63.0000 | 69.6667 | 52.3333 | 54.0000 | 52.3333 | N/A | N/A |
| EDU04 | 60.5000 | 69.1667 | 49.8333 | 55.3333 | 54.0000 | N/A | N/A |
| EDU05 | 63.6667 | 70.3333 | 57.6667 | 51.3333 | 55.8333 | N/A | N/A |
| EDU06 | 62.8333 | 69.5000 | 57.0000 | 56.3333 | 52.1667 | N/A | N/A |
| EDU07 | 63.5000 | 71.1667 | 50.5000 | 58.6667 | 52.5000 | N/A | N/A |
| EDU08 | 63.3333 | 68.3333 | 55.0000 | 58.6667 | 54.8333 | N/A | N/A |
| SOC01 | 67.3333 | 70.1667 | 55.0000 | 53.6667 | 51.5000 | N/A | N/A |
| SOC02 | 63.3333 | 70.3333 | 54.8333 | 56.0000 | 53.5000 | N/A | N/A |
| SOC03 | 64.1667 | 70.1667 | 56.3333 | 59.6667 | 51.6667 | N/A | N/A |
| SOC04 | 62.6667 | 70.3333 | 57.0000 | 55.3333 | 54.5000 | N/A | N/A |
| SOC05 | 63.1667 | 67.5000 | 52.8333 | 52.3333 | 52.5000 | N/A | N/A |
| SOC06 | 60.5000 | 71.3333 | 54.3333 | 55.3333 | 52.0000 | N/A | N/A |
| SOC07 | 61.5000 | 72.6667 | 54.0000 | 51.0000 | 55.3333 | N/A | N/A |
| SOC08 | 61.1667 | 68.6667 | 54.5000 | 59.0000 | 56.1667 | N/A | N/A |
| SOC09 | 62.0000 | 70.3333 | 54.3333 | 54.6667 | 54.0000 | N/A | N/A |
| SOC10 | 62.0000 | 68.3333 | 55.8333 | 55.6667 | 49.8333 | N/A | N/A |
| SOC11 | 62.1667 | 68.6667 | 54.1667 | 52.6667 | 55.8333 | N/A | N/A |
| SOC12 | 58.1667 | 72.0000 | 50.3333 | 56.0000 | 53.5000 | N/A | N/A |
| SOC13 | 60.3333 | 69.0000 | 50.0000 | 52.3333 | 54.3333 | N/A | N/A |
| SOC14 | 62.5000 | 74.1667 | 55.0000 | 58.0000 | 52.6667 | N/A | N/A |
| SOC15 | 62.0000 | 67.0000 | 51.5000 | 58.3333 | 56.8333 | N/A | N/A |
| SOC16 | 60.8333 | 70.0000 | 54.0000 | 57.0000 | 51.3333 | N/A | N/A |
| SOC17 | 63.0000 | 70.8333 | 55.0000 | 56.3333 | 57.0000 | N/A | N/A |
| SOC18 | 63.3333 | 69.8333 | 59.0000 | 58.3333 | 54.6667 | N/A | N/A |
| ART01 | 60.6667 | 67.5000 | 52.6667 | 54.0000 | 58.3333 | N/A | N/A |
| ART02 | 61.3333 | 68.5000 | 53.3333 | 58.6667 | 52.5000 | N/A | N/A |
| ART03 | 61.0000 | 70.3333 | 53.6667 | 55.6667 | 51.6667 | N/A | N/A |
| ART04 | 59.3333 | 71.6667 | 52.6667 | 56.0000 | 56.1667 | N/A | N/A |
| ART05 | 64.0000 | 71.0000 | 54.3333 | 53.6667 | 53.1667 | N/A | N/A |
| ART06 | 65.1667 | 69.6667 | 54.0000 | 58.0000 | 50.3333 | N/A | N/A |

### old, p=0.75

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 82.6667 | 83.8333 | 75.6667 | 81.0000 | 77.5000 | N/A | N/A |
| BUS02 | 80.8333 | 83.6667 | 76.5000 | 75.3333 | 77.0000 | N/A | N/A |
| BUS03 | 81.5000 | 85.8333 | 80.5000 | 76.6667 | 75.8333 | N/A | N/A |
| BUS04 | 84.1667 | 85.3333 | 80.8333 | 73.0000 | 76.6667 | N/A | N/A |
| BUS05 | 79.8333 | 85.5000 | 75.3333 | 77.0000 | 76.8333 | N/A | N/A |
| BUS06 | 82.0000 | 84.3333 | 74.5000 | 74.3333 | 73.5000 | N/A | N/A |
| BUS07 | 80.6667 | 84.3333 | 77.6667 | 74.6667 | 77.3333 | N/A | N/A |
| BUS08 | 81.3333 | 82.1667 | 75.5000 | 79.3333 | 73.5000 | N/A | N/A |
| BUS09 | 83.8333 | 85.6667 | 75.1667 | 76.6667 | 78.0000 | N/A | N/A |
| BUS10 | 81.5000 | 84.6667 | 78.1667 | 76.3333 | 76.1667 | N/A | N/A |
| ICT01 | 82.5000 | 85.3333 | 77.1667 | 75.3333 | 78.5000 | N/A | N/A |
| ICT02 | 77.8333 | 85.6667 | 74.3333 | 75.6667 | 73.0000 | N/A | N/A |
| ICT03 | 80.5000 | 87.3333 | 77.0000 | 82.6667 | 75.5000 | N/A | N/A |
| ENG01 | 81.0000 | 83.1667 | 77.1667 | 77.6667 | 75.5000 | N/A | N/A |
| ENG02 | 80.6667 | 85.6667 | 81.6667 | 74.3333 | 78.1667 | N/A | N/A |
| ENG03 | 78.6667 | 83.3333 | 73.6667 | 73.3333 | 75.1667 | N/A | N/A |
| ENG04 | 81.8333 | 82.3333 | 75.3333 | 74.6667 | 73.6667 | N/A | N/A |
| ENG05 | 81.1667 | 85.5000 | 78.8333 | 73.3333 | 74.1667 | N/A | N/A |
| ENG06 | 79.8333 | 85.1667 | 75.1667 | 79.6667 | 78.0000 | N/A | N/A |
| ENG07 | 80.5000 | 86.6667 | 78.8333 | 74.3333 | 76.3333 | N/A | N/A |
| ENG08 | 82.0000 | 84.3333 | 79.5000 | 77.3333 | 80.1667 | N/A | N/A |
| ENG09 | 82.3333 | 85.0000 | 77.6667 | 79.0000 | 78.3333 | N/A | N/A |
| ENG10 | 80.5000 | 84.3333 | 76.0000 | 75.3333 | 75.3333 | N/A | N/A |
| ENG11 | 82.1667 | 84.3333 | 77.8333 | 77.0000 | 74.8333 | N/A | N/A |
| ENG12 | 81.3333 | 83.5000 | 80.5000 | 76.0000 | 74.6667 | N/A | N/A |
| ENG13 | 81.0000 | 86.1667 | 78.6667 | 76.6667 | 76.8333 | N/A | N/A |
| ENG14 | 80.1667 | 87.6667 | 76.8333 | 73.3333 | 76.5000 | N/A | N/A |
| ENG15 | 79.8333 | 84.3333 | 75.8333 | 76.3333 | 77.8333 | N/A | N/A |
| SCI01 | 82.3333 | 88.1667 | 79.5000 | 80.6667 | 75.5000 | N/A | N/A |
| SCI02 | 79.3333 | 84.3333 | 74.1667 | 79.3333 | 74.8333 | N/A | N/A |
| SCI03 | 81.8333 | 86.1667 | 77.5000 | 80.6667 | 77.3333 | N/A | N/A |
| SCI04 | 83.5000 | 84.5000 | 77.6667 | 78.6667 | 76.8333 | N/A | N/A |
| SCI05 | 83.0000 | 85.5000 | 77.5000 | 74.0000 | 76.5000 | N/A | N/A |
| SCI06 | 80.8333 | 85.3333 | 77.6667 | 79.0000 | 73.8333 | N/A | N/A |
| SCI07 | 81.0000 | 82.5000 | 76.6667 | 80.0000 | 77.8333 | N/A | N/A |
| SCI08 | 80.8333 | 83.8333 | 76.8333 | 82.3333 | 77.3333 | N/A | N/A |
| SCI09 | 83.0000 | 83.6667 | 77.3333 | 74.6667 | 73.8333 | N/A | N/A |
| SCI10 | 81.6667 | 85.6667 | 81.3333 | 75.0000 | 75.8333 | N/A | N/A |
| SCI11 | 80.8333 | 85.0000 | 78.0000 | 80.6667 | 76.5000 | N/A | N/A |
| AGR01 | 82.6667 | 83.3333 | 79.3333 | 80.6667 | 76.1667 | N/A | N/A |
| AGR02 | 80.8333 | 85.1667 | 79.1667 | 75.0000 | 75.8333 | N/A | N/A |
| AGR03 | 81.3333 | 86.3333 | 78.1667 | 79.0000 | 75.1667 | N/A | N/A |
| AGR04 | 82.8333 | 87.0000 | 76.1667 | 81.0000 | 77.0000 | N/A | N/A |
| HLT01 | 80.5000 | 83.3333 | 77.8333 | 76.3333 | 76.5000 | N/A | N/A |
| HLT02 | 79.8333 | 85.6667 | 77.6667 | 80.0000 | 75.6667 | N/A | N/A |
| HLT03 | 82.1667 | 86.0000 | 80.8333 | 74.6667 | 73.3333 | N/A | N/A |
| HLT04 | 79.6667 | 84.8333 | 77.0000 | 77.0000 | 75.5000 | N/A | N/A |
| HLT05 | 79.5000 | 85.6667 | 79.8333 | 75.6667 | 79.5000 | N/A | N/A |
| HLT06 | 80.0000 | 84.3333 | 78.0000 | 82.3333 | 75.8333 | N/A | N/A |
| HLT07 | 83.3333 | 83.6667 | 77.6667 | 81.3333 | 75.6667 | N/A | N/A |
| HLT08 | 81.5000 | 84.8333 | 78.5000 | 77.3333 | 79.5000 | N/A | N/A |
| HLT09 | 80.6667 | 82.3333 | 79.8333 | 75.3333 | 78.0000 | N/A | N/A |
| HLT10 | 83.6667 | 84.0000 | 73.8333 | 81.6667 | 77.8333 | N/A | N/A |
| EDU01 | 82.1667 | 85.1667 | 80.3333 | 76.6667 | 77.6667 | N/A | N/A |
| EDU02 | 82.1667 | 84.1667 | 79.0000 | 76.0000 | 73.8333 | N/A | N/A |
| EDU03 | 81.6667 | 84.0000 | 75.6667 | 74.3333 | 72.6667 | N/A | N/A |
| EDU04 | 83.1667 | 84.5000 | 81.5000 | 83.0000 | 78.1667 | N/A | N/A |
| EDU05 | 77.8333 | 83.3333 | 77.1667 | 76.0000 | 75.3333 | N/A | N/A |
| EDU06 | 82.0000 | 82.5000 | 74.8333 | 78.6667 | 79.3333 | N/A | N/A |
| EDU07 | 81.1667 | 84.1667 | 79.3333 | 74.6667 | 77.1667 | N/A | N/A |
| EDU08 | 83.5000 | 86.0000 | 75.3333 | 82.0000 | 78.3333 | N/A | N/A |
| SOC01 | 81.6667 | 85.5000 | 78.1667 | 78.6667 | 72.6667 | N/A | N/A |
| SOC02 | 79.3333 | 84.0000 | 78.0000 | 75.0000 | 75.8333 | N/A | N/A |
| SOC03 | 81.0000 | 85.3333 | 79.8333 | 75.3333 | 77.8333 | N/A | N/A |
| SOC04 | 80.6667 | 83.6667 | 78.1667 | 74.0000 | 74.6667 | N/A | N/A |
| SOC05 | 81.6667 | 84.5000 | 76.1667 | 76.6667 | 75.8333 | N/A | N/A |
| SOC06 | 80.8333 | 87.1667 | 79.8333 | 78.3333 | 74.6667 | N/A | N/A |
| SOC07 | 79.1667 | 85.1667 | 78.8333 | 78.3333 | 75.3333 | N/A | N/A |
| SOC08 | 83.1667 | 85.8333 | 76.6667 | 79.6667 | 76.3333 | N/A | N/A |
| SOC09 | 82.1667 | 86.0000 | 75.8333 | 78.0000 | 79.0000 | N/A | N/A |
| SOC10 | 80.8333 | 83.3333 | 80.0000 | 78.3333 | 77.0000 | N/A | N/A |
| SOC11 | 78.8333 | 86.5000 | 74.6667 | 78.3333 | 75.0000 | N/A | N/A |
| SOC12 | 82.8333 | 87.3333 | 74.6667 | 77.0000 | 78.1667 | N/A | N/A |
| SOC13 | 82.3333 | 83.0000 | 75.3333 | 78.0000 | 75.8333 | N/A | N/A |
| SOC14 | 81.1667 | 83.5000 | 77.0000 | 77.3333 | 75.8333 | N/A | N/A |
| SOC15 | 81.0000 | 85.6667 | 78.6667 | 79.6667 | 76.6667 | N/A | N/A |
| SOC16 | 81.1667 | 87.3333 | 77.0000 | 75.3333 | 77.8333 | N/A | N/A |
| SOC17 | 82.3333 | 85.3333 | 77.8333 | 81.0000 | 77.3333 | N/A | N/A |
| SOC18 | 81.0000 | 85.6667 | 79.0000 | 76.0000 | 77.6667 | N/A | N/A |
| ART01 | 79.1667 | 83.3333 | 78.1667 | 73.3333 | 75.3333 | N/A | N/A |
| ART02 | 80.8333 | 84.3333 | 73.6667 | 74.0000 | 77.0000 | N/A | N/A |
| ART03 | 84.0000 | 85.8333 | 74.6667 | 77.0000 | 77.8333 | N/A | N/A |
| ART04 | 79.5000 | 84.8333 | 75.6667 | 80.3333 | 75.5000 | N/A | N/A |
| ART05 | 81.1667 | 86.6667 | 78.1667 | 76.0000 | 75.0000 | N/A | N/A |
| ART06 | 81.5000 | 83.5000 | 76.1667 | 78.3333 | 76.3333 | N/A | N/A |

### old, p=1

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS09 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| BUS10 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ICT01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ICT02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ICT03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG09 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG10 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG11 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG12 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG13 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG14 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ENG15 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI09 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI10 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SCI11 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| AGR01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| AGR02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| AGR03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| AGR04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT09 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| HLT10 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| EDU08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC07 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC08 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC09 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC10 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC11 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC12 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC13 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC14 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC15 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC16 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC17 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| SOC18 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART01 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART02 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART03 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART04 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART05 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |
| ART06 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A |

### new, p=0.5

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 63.5000 | 69.3333 | 52.6667 | N/A | N/A | 46.0667 | 41.6667 |
| BUS02 | 65.0000 | 69.8333 | 53.8333 | N/A | N/A | 45.2667 | 46.6667 |
| BUS03 | 61.3333 | 71.0000 | 56.1667 | N/A | N/A | 46.6000 | 49.0000 |
| BUS04 | 62.6667 | 72.1667 | 54.0000 | N/A | N/A | 45.4000 | 51.0000 |
| BUS05 | 66.8333 | 71.5000 | 54.1667 | N/A | N/A | 47.0000 | 47.6667 |
| BUS06 | 63.0000 | 68.6667 | 55.1667 | N/A | N/A | 44.8000 | 45.3333 |
| BUS07 | 60.6667 | 67.1667 | 59.0000 | N/A | N/A | 45.7333 | 50.3333 |
| BUS08 | 61.3333 | 68.1667 | 54.1667 | N/A | N/A | 45.4667 | 46.6667 |
| BUS09 | 63.0000 | 70.8333 | 54.5000 | N/A | N/A | 44.1333 | 54.3333 |
| BUS10 | 64.3333 | 70.6667 | 54.1667 | N/A | N/A | 46.9333 | 46.6667 |
| ICT01 | 61.6667 | 69.8333 | 56.5000 | N/A | N/A | 45.8000 | 57.3333 |
| ICT02 | 58.1667 | 70.0000 | 58.0000 | N/A | N/A | 45.0000 | 50.3333 |
| ICT03 | 65.5000 | 70.8333 | 53.0000 | N/A | N/A | 46.2000 | 54.6667 |
| ENG01 | 64.1667 | 71.0000 | 53.6667 | N/A | N/A | 46.6000 | 47.6667 |
| ENG02 | 60.0000 | 67.1667 | 52.8333 | N/A | N/A | 45.8000 | 44.0000 |
| ENG03 | 60.3333 | 67.6667 | 52.8333 | N/A | N/A | 46.2000 | 47.3333 |
| ENG04 | 65.6667 | 70.5000 | 52.3333 | N/A | N/A | 46.1333 | 49.3333 |
| ENG05 | 64.1667 | 69.0000 | 53.6667 | N/A | N/A | 46.8000 | 54.3333 |
| ENG06 | 62.6667 | 70.8333 | 55.5000 | N/A | N/A | 45.5333 | 50.3333 |
| ENG07 | 65.5000 | 68.6667 | 55.8333 | N/A | N/A | 45.2000 | 54.6667 |
| ENG08 | 63.3333 | 68.0000 | 57.3333 | N/A | N/A | 45.4667 | 50.3333 |
| ENG09 | 61.6667 | 70.8333 | 55.3333 | N/A | N/A | 43.8000 | 48.0000 |
| ENG10 | 64.0000 | 70.3333 | 57.8333 | N/A | N/A | 46.2000 | 49.3333 |
| ENG11 | 64.5000 | 71.8333 | 55.3333 | N/A | N/A | 45.9333 | 50.0000 |
| ENG12 | 60.1667 | 69.6667 | 52.8333 | N/A | N/A | 47.0667 | 53.6667 |
| ENG13 | 60.5000 | 69.5000 | 54.0000 | N/A | N/A | 46.1333 | 52.3333 |
| ENG14 | 61.3333 | 69.1667 | 57.3333 | N/A | N/A | 46.2667 | 46.6667 |
| ENG15 | 61.6667 | 71.5000 | 54.8333 | N/A | N/A | 46.2000 | 56.3333 |
| SCI01 | 63.1667 | 69.6667 | 53.0000 | N/A | N/A | 45.7333 | 54.0000 |
| SCI02 | 62.1667 | 67.5000 | 60.0000 | N/A | N/A | 46.4667 | 46.0000 |
| SCI03 | 62.6667 | 71.3333 | 56.8333 | N/A | N/A | 45.7333 | 54.0000 |
| SCI04 | 63.6667 | 70.1667 | 55.6667 | N/A | N/A | 45.7333 | 52.6667 |
| SCI05 | 63.0000 | 71.6667 | 53.6667 | N/A | N/A | 45.6000 | 47.0000 |
| SCI06 | 63.8333 | 70.8333 | 55.0000 | N/A | N/A | 44.8667 | 51.6667 |
| SCI07 | 60.0000 | 69.3333 | 55.5000 | N/A | N/A | 43.4000 | 52.0000 |
| SCI08 | 65.6667 | 70.8333 | 54.1667 | N/A | N/A | 47.9333 | 52.6667 |
| SCI09 | 61.5000 | 69.6667 | 55.8333 | N/A | N/A | 48.0000 | 48.6667 |
| SCI10 | 63.0000 | 68.6667 | 52.0000 | N/A | N/A | 45.9333 | 54.6667 |
| SCI11 | 63.8333 | 70.6667 | 55.3333 | N/A | N/A | 47.4000 | 47.6667 |
| AGR01 | 64.5000 | 69.8333 | 56.5000 | N/A | N/A | 44.4000 | 48.0000 |
| AGR02 | 61.3333 | 68.8333 | 54.5000 | N/A | N/A | 44.6000 | 54.6667 |
| AGR03 | 59.8333 | 66.0000 | 54.5000 | N/A | N/A | 46.0000 | 44.3333 |
| AGR04 | 63.1667 | 71.8333 | 54.5000 | N/A | N/A | 46.9333 | 46.3333 |
| HLT01 | 64.0000 | 69.3333 | 60.5000 | N/A | N/A | 46.4000 | 49.0000 |
| HLT02 | 60.5000 | 70.0000 | 53.3333 | N/A | N/A | 46.4667 | 50.6667 |
| HLT03 | 62.0000 | 68.6667 | 57.1667 | N/A | N/A | 47.4000 | 48.0000 |
| HLT04 | 62.1667 | 71.3333 | 55.5000 | N/A | N/A | 45.6667 | 42.3333 |
| HLT05 | 61.5000 | 71.1667 | 53.3333 | N/A | N/A | 48.2000 | 55.3333 |
| HLT06 | 60.0000 | 70.0000 | 55.3333 | N/A | N/A | 44.8667 | 52.0000 |
| HLT07 | 66.3333 | 68.6667 | 54.8333 | N/A | N/A | 45.8000 | 53.6667 |
| HLT08 | 62.8333 | 72.1667 | 53.6667 | N/A | N/A | 46.8667 | 50.0000 |
| HLT09 | 61.3333 | 69.6667 | 52.3333 | N/A | N/A | 45.7333 | 50.0000 |
| HLT10 | 61.5000 | 67.8333 | 52.3333 | N/A | N/A | 45.6000 | 45.0000 |
| EDU01 | 63.8333 | 70.6667 | 55.5000 | N/A | N/A | 45.5333 | 49.3333 |
| EDU02 | 64.0000 | 71.5000 | 52.3333 | N/A | N/A | 45.1333 | 53.6667 |
| EDU03 | 64.6667 | 70.8333 | 54.5000 | N/A | N/A | 46.0000 | 50.3333 |
| EDU04 | 66.0000 | 68.5000 | 57.3333 | N/A | N/A | 45.4667 | 56.0000 |
| EDU05 | 63.3333 | 69.0000 | 57.0000 | N/A | N/A | 45.7333 | 47.3333 |
| EDU06 | 61.5000 | 74.0000 | 53.6667 | N/A | N/A | 44.8000 | 49.3333 |
| EDU07 | 63.5000 | 69.8333 | 54.6667 | N/A | N/A | 46.8667 | 48.0000 |
| EDU08 | 59.8333 | 70.0000 | 56.3333 | N/A | N/A | 45.4000 | 53.6667 |
| SOC01 | 67.3333 | 69.8333 | 54.3333 | N/A | N/A | 47.2000 | 48.3333 |
| SOC02 | 61.6667 | 69.3333 | 55.3333 | N/A | N/A | 45.8000 | 49.6667 |
| SOC03 | 60.5000 | 70.3333 | 53.1667 | N/A | N/A | 46.6667 | 50.3333 |
| SOC04 | 64.6667 | 71.8333 | 50.6667 | N/A | N/A | 46.4000 | 54.6667 |
| SOC05 | 61.8333 | 69.1667 | 54.3333 | N/A | N/A | 46.7333 | 51.3333 |
| SOC06 | 63.8333 | 75.5000 | 52.3333 | N/A | N/A | 45.7333 | 49.6667 |
| SOC07 | 63.6667 | 70.3333 | 59.1667 | N/A | N/A | 47.1333 | 51.3333 |
| SOC08 | 65.0000 | 69.1667 | 55.0000 | N/A | N/A | 45.2667 | 46.6667 |
| SOC09 | 60.5000 | 69.0000 | 55.3333 | N/A | N/A | 47.4000 | 53.3333 |
| SOC10 | 62.8333 | 70.1667 | 54.3333 | N/A | N/A | 45.6000 | 45.0000 |
| SOC11 | 64.0000 | 69.3333 | 56.5000 | N/A | N/A | 46.4000 | 50.6667 |
| SOC12 | 60.1667 | 67.6667 | 56.0000 | N/A | N/A | 47.0000 | 52.3333 |
| SOC13 | 64.3333 | 71.0000 | 54.8333 | N/A | N/A | 44.6667 | 46.0000 |
| SOC14 | 58.5000 | 70.5000 | 51.6667 | N/A | N/A | 45.2667 | 44.6667 |
| SOC15 | 61.8333 | 69.8333 | 55.6667 | N/A | N/A | 46.1333 | 55.0000 |
| SOC16 | 62.5000 | 70.1667 | 54.8333 | N/A | N/A | 46.2667 | 50.6667 |
| SOC17 | 61.1667 | 67.3333 | 53.1667 | N/A | N/A | 45.7333 | 51.0000 |
| SOC18 | 63.8333 | 71.3333 | 54.0000 | N/A | N/A | 46.2000 | 50.6667 |
| ART01 | 64.3333 | 72.0000 | 53.8333 | N/A | N/A | 46.2000 | 46.3333 |
| ART02 | 63.0000 | 69.5000 | 53.8333 | N/A | N/A | 47.3333 | 49.3333 |
| ART03 | 64.6667 | 72.3333 | 56.8333 | N/A | N/A | 44.9333 | 49.0000 |
| ART04 | 60.6667 | 71.1667 | 57.6667 | N/A | N/A | 45.4667 | 56.0000 |
| ART05 | 65.0000 | 68.3333 | 56.0000 | N/A | N/A | 45.8000 | 46.0000 |
| ART06 | 65.1667 | 71.8333 | 56.0000 | N/A | N/A | 46.8667 | 44.0000 |

### new, p=0.75

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 78.3333 | 81.1667 | 76.0000 | N/A | N/A | 57.2667 | 77.0000 |
| BUS02 | 78.6667 | 83.3333 | 75.1667 | N/A | N/A | 57.9333 | 76.6667 |
| BUS03 | 79.0000 | 85.8333 | 79.8333 | N/A | N/A | 57.4000 | 73.3333 |
| BUS04 | 80.1667 | 84.1667 | 79.0000 | N/A | N/A | 58.2667 | 71.6667 |
| BUS05 | 79.8333 | 87.8333 | 78.0000 | N/A | N/A | 57.8667 | 76.0000 |
| BUS06 | 80.8333 | 81.6667 | 77.3333 | N/A | N/A | 57.8667 | 74.6667 |
| BUS07 | 84.8333 | 84.5000 | 79.3333 | N/A | N/A | 58.0000 | 69.0000 |
| BUS08 | 82.1667 | 85.5000 | 78.3333 | N/A | N/A | 58.0667 | 78.3333 |
| BUS09 | 79.1667 | 83.8333 | 77.1667 | N/A | N/A | 57.8000 | 75.3333 |
| BUS10 | 80.8333 | 84.0000 | 77.8333 | N/A | N/A | 57.6000 | 75.3333 |
| ICT01 | 83.3333 | 86.6667 | 77.6667 | N/A | N/A | 57.5333 | 74.3333 |
| ICT02 | 80.5000 | 86.0000 | 76.5000 | N/A | N/A | 57.3333 | 76.3333 |
| ICT03 | 81.5000 | 86.3333 | 75.5000 | N/A | N/A | 58.0667 | 80.6667 |
| ENG01 | 82.1667 | 84.6667 | 76.5000 | N/A | N/A | 57.8000 | 71.0000 |
| ENG02 | 82.5000 | 84.6667 | 76.0000 | N/A | N/A | 56.8667 | 73.0000 |
| ENG03 | 81.5000 | 84.8333 | 77.3333 | N/A | N/A | 57.8000 | 74.6667 |
| ENG04 | 78.8333 | 85.5000 | 79.5000 | N/A | N/A | 58.2667 | 68.0000 |
| ENG05 | 82.0000 | 86.1667 | 77.5000 | N/A | N/A | 58.2000 | 76.0000 |
| ENG06 | 81.3333 | 86.6667 | 76.3333 | N/A | N/A | 57.2667 | 75.3333 |
| ENG07 | 82.8333 | 83.3333 | 78.3333 | N/A | N/A | 57.5333 | 77.3333 |
| ENG08 | 83.1667 | 86.3333 | 76.1667 | N/A | N/A | 58.4000 | 76.0000 |
| ENG09 | 77.6667 | 84.1667 | 78.6667 | N/A | N/A | 57.0000 | 75.6667 |
| ENG10 | 82.0000 | 85.3333 | 78.1667 | N/A | N/A | 58.0000 | 73.0000 |
| ENG11 | 82.0000 | 84.6667 | 76.8333 | N/A | N/A | 57.7333 | 76.6667 |
| ENG12 | 83.3333 | 84.5000 | 77.8333 | N/A | N/A | 57.4667 | 75.3333 |
| ENG13 | 79.8333 | 86.1667 | 76.3333 | N/A | N/A | 57.3333 | 79.3333 |
| ENG14 | 79.5000 | 83.8333 | 77.5000 | N/A | N/A | 57.0667 | 76.3333 |
| ENG15 | 82.6667 | 83.5000 | 76.0000 | N/A | N/A | 57.8667 | 74.3333 |
| SCI01 | 80.5000 | 86.3333 | 77.5000 | N/A | N/A | 57.8667 | 78.0000 |
| SCI02 | 78.5000 | 82.3333 | 77.6667 | N/A | N/A | 57.8667 | 75.6667 |
| SCI03 | 83.0000 | 85.6667 | 78.3333 | N/A | N/A | 58.0000 | 77.3333 |
| SCI04 | 82.1667 | 86.6667 | 78.6667 | N/A | N/A | 57.3333 | 77.0000 |
| SCI05 | 80.8333 | 83.1667 | 76.1667 | N/A | N/A | 57.8000 | 75.3333 |
| SCI06 | 80.1667 | 83.3333 | 76.0000 | N/A | N/A | 58.5333 | 76.6667 |
| SCI07 | 80.5000 | 84.3333 | 78.5000 | N/A | N/A | 57.0000 | 73.0000 |
| SCI08 | 82.3333 | 85.6667 | 78.6667 | N/A | N/A | 57.6667 | 78.3333 |
| SCI09 | 83.1667 | 84.0000 | 76.3333 | N/A | N/A | 57.0000 | 79.3333 |
| SCI10 | 80.8333 | 83.5000 | 74.1667 | N/A | N/A | 58.7333 | 76.0000 |
| SCI11 | 82.0000 | 85.0000 | 78.1667 | N/A | N/A | 57.4667 | 73.3333 |
| AGR01 | 80.6667 | 85.3333 | 78.1667 | N/A | N/A | 58.5333 | 75.6667 |
| AGR02 | 80.8333 | 81.6667 | 78.1667 | N/A | N/A | 57.7333 | 73.6667 |
| AGR03 | 82.6667 | 86.0000 | 78.8333 | N/A | N/A | 57.1333 | 72.0000 |
| AGR04 | 82.3333 | 84.1667 | 76.8333 | N/A | N/A | 58.0000 | 75.0000 |
| HLT01 | 80.8333 | 86.5000 | 74.6667 | N/A | N/A | 57.5333 | 70.6667 |
| HLT02 | 82.1667 | 85.5000 | 74.1667 | N/A | N/A | 56.4667 | 73.0000 |
| HLT03 | 81.5000 | 84.3333 | 74.6667 | N/A | N/A | 57.6000 | 73.3333 |
| HLT04 | 83.5000 | 82.3333 | 79.3333 | N/A | N/A | 57.2667 | 72.3333 |
| HLT05 | 83.0000 | 85.5000 | 78.6667 | N/A | N/A | 56.8000 | 77.6667 |
| HLT06 | 82.5000 | 87.6667 | 75.6667 | N/A | N/A | 58.3333 | 73.3333 |
| HLT07 | 82.3333 | 84.0000 | 77.3333 | N/A | N/A | 58.2000 | 74.0000 |
| HLT08 | 80.8333 | 85.1667 | 75.1667 | N/A | N/A | 58.5333 | 73.6667 |
| HLT09 | 82.1667 | 83.5000 | 77.8333 | N/A | N/A | 57.0667 | 75.0000 |
| HLT10 | 82.5000 | 86.0000 | 75.0000 | N/A | N/A | 57.9333 | 77.0000 |
| EDU01 | 81.0000 | 84.3333 | 79.5000 | N/A | N/A | 57.6667 | 73.6667 |
| EDU02 | 80.8333 | 85.5000 | 77.1667 | N/A | N/A | 57.4000 | 77.3333 |
| EDU03 | 80.3333 | 84.0000 | 76.3333 | N/A | N/A | 57.8667 | 80.6667 |
| EDU04 | 82.5000 | 81.5000 | 73.3333 | N/A | N/A | 57.2667 | 77.3333 |
| EDU05 | 82.5000 | 84.1667 | 80.1667 | N/A | N/A | 57.4000 | 77.6667 |
| EDU06 | 81.6667 | 82.0000 | 78.0000 | N/A | N/A | 56.8000 | 72.6667 |
| EDU07 | 81.0000 | 85.3333 | 75.0000 | N/A | N/A | 57.6667 | 74.0000 |
| EDU08 | 80.6667 | 84.1667 | 78.3333 | N/A | N/A | 56.9333 | 78.3333 |
| SOC01 | 79.5000 | 83.5000 | 77.0000 | N/A | N/A | 58.4667 | 73.0000 |
| SOC02 | 81.8333 | 86.0000 | 77.5000 | N/A | N/A | 58.0667 | 79.0000 |
| SOC03 | 81.1667 | 86.0000 | 76.6667 | N/A | N/A | 57.4667 | 72.0000 |
| SOC04 | 81.1667 | 84.1667 | 77.3333 | N/A | N/A | 58.2000 | 78.3333 |
| SOC05 | 79.1667 | 81.0000 | 81.1667 | N/A | N/A | 57.2667 | 77.3333 |
| SOC06 | 81.6667 | 86.1667 | 78.3333 | N/A | N/A | 58.4000 | 76.0000 |
| SOC07 | 79.1667 | 86.1667 | 75.5000 | N/A | N/A | 57.6000 | 78.6667 |
| SOC08 | 80.3333 | 85.1667 | 79.3333 | N/A | N/A | 57.9333 | 78.6667 |
| SOC09 | 81.8333 | 83.5000 | 75.5000 | N/A | N/A | 57.7333 | 74.6667 |
| SOC10 | 83.6667 | 85.1667 | 79.1667 | N/A | N/A | 57.3333 | 72.3333 |
| SOC11 | 80.3333 | 84.6667 | 75.3333 | N/A | N/A | 57.8000 | 76.3333 |
| SOC12 | 82.6667 | 86.0000 | 76.1667 | N/A | N/A | 58.0000 | 77.0000 |
| SOC13 | 79.1667 | 87.1667 | 77.1667 | N/A | N/A | 57.2000 | 71.6667 |
| SOC14 | 80.6667 | 83.8333 | 77.3333 | N/A | N/A | 57.8000 | 78.0000 |
| SOC15 | 79.8333 | 83.3333 | 75.3333 | N/A | N/A | 56.9333 | 72.6667 |
| SOC16 | 82.8333 | 84.0000 | 77.8333 | N/A | N/A | 57.5333 | 76.3333 |
| SOC17 | 85.8333 | 84.8333 | 77.8333 | N/A | N/A | 57.8000 | 73.0000 |
| SOC18 | 82.5000 | 86.6667 | 76.8333 | N/A | N/A | 57.6000 | 76.6667 |
| ART01 | 82.0000 | 85.3333 | 77.3333 | N/A | N/A | 57.3333 | 73.0000 |
| ART02 | 82.8333 | 85.1667 | 75.8333 | N/A | N/A | 57.9333 | 71.6667 |
| ART03 | 80.6667 | 86.8333 | 77.1667 | N/A | N/A | 58.3333 | 75.0000 |
| ART04 | 80.5000 | 86.0000 | 76.6667 | N/A | N/A | 58.1333 | 77.0000 |
| ART05 | 81.3333 | 87.0000 | 76.0000 | N/A | N/A | 57.8000 | 77.3333 |
| ART06 | 80.0000 | 83.6667 | 77.5000 | N/A | N/A | 57.4667 | 74.3333 |

### new, p=1

| Course | Interests % | Skills high % | Certificates % | Strand % | Old subjects % | Electives % | Core % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUS01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS09 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| BUS10 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ICT01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ICT02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ICT03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG09 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG10 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG11 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG12 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG13 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG14 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ENG15 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI09 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI10 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SCI11 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| AGR01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| AGR02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| AGR03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| AGR04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT09 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| HLT10 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| EDU08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC07 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC08 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC09 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC10 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC11 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC12 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC13 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC14 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC15 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC16 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC17 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| SOC18 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART01 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART02 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART03 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART04 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART05 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |
| ART06 | 100.0000 | 100.0000 | 100.0000 | N/A | N/A | 60.0000 | 100.0000 |

## Appendix D: all 171 full-model replay cases

| Witness | Rank | PDF pages | Status |
| --- | --- | --- | --- |
| BUS01-old | 1 | 6 | PASS |
| BUS01-new | 1 | 6 | PASS |
| BUS02-old | 1 | 6 | PASS |
| BUS02-new | 1 | 6 | PASS |
| BUS03-old | 1 | 6 | PASS |
| BUS03-new | 1 | 6 | PASS |
| BUS04-old | 1 | 6 | PASS |
| BUS04-new | 1 | 6 | PASS |
| BUS05-old | 1 | 6 | PASS |
| BUS05-new | 1 | 6 | PASS |
| BUS06-old | 1 | 6 | PASS |
| BUS06-new | 1 | 6 | PASS |
| BUS07-old | 1 | 6 | PASS |
| BUS07-new | 1 | 6 | PASS |
| BUS08-old | 1 | 6 | PASS |
| BUS08-new | 1 | 6 | PASS |
| BUS09-old | 1 | 6 | PASS |
| BUS09-new | 1 | 6 | PASS |
| BUS10-old | 1 | 6 | PASS |
| BUS10-new | 1 | 6 | PASS |
| ICT01-old | 1 | 6 | PASS |
| ICT01-new | 1 | 6 | PASS |
| ICT02-old | 1 | 6 | PASS |
| ICT02-new | 1 | 6 | PASS |
| ICT03-old | 1 | 6 | PASS |
| ICT03-new | 1 | 6 | PASS |
| ENG01-old | 1 | 6 | PASS |
| ENG01-new | 1 | 6 | PASS |
| ENG02-old | 1 | 6 | PASS |
| ENG02-new | 1 | 6 | PASS |
| ENG03-old | 1 | 6 | PASS |
| ENG03-new | 1 | 6 | PASS |
| ENG04-old | 1 | 6 | PASS |
| ENG04-new | 1 | 6 | PASS |
| ENG05-old | 1 | 6 | PASS |
| ENG05-new | 1 | 6 | PASS |
| ENG06-old | 1 | 6 | PASS |
| ENG06-new | 1 | 6 | PASS |
| ENG07-old | 1 | 6 | PASS |
| ENG07-new | 1 | 6 | PASS |
| ENG08-old | 1 | 6 | PASS |
| ENG08-new | 1 | 6 | PASS |
| ENG09-old | 1 | 6 | PASS |
| ENG09-new | 1 | 6 | PASS |
| ENG10-old | 1 | 6 | PASS |
| ENG10-new | 1 | 6 | PASS |
| ENG11-old | 1 | 6 | PASS |
| ENG11-new | 1 | 6 | PASS |
| ENG12-old | 1 | 6 | PASS |
| ENG12-new | 1 | 6 | PASS |
| ENG13-old | 1 | 6 | PASS |
| ENG13-new | 1 | 6 | PASS |
| ENG14-old | 1 | 6 | PASS |
| ENG14-new | 1 | 6 | PASS |
| ENG15-old | 1 | 6 | PASS |
| ENG15-new | 1 | 6 | PASS |
| SCI01-old | 1 | 6 | PASS |
| SCI01-new | 1 | 6 | PASS |
| SCI02-old | 1 | 6 | PASS |
| SCI02-new | 1 | 6 | PASS |
| SCI03-old | 1 | 6 | PASS |
| SCI03-new | 1 | 6 | PASS |
| SCI04-old | 1 | 6 | PASS |
| SCI04-new | 1 | 6 | PASS |
| SCI05-old | 1 | 6 | PASS |
| SCI05-new | 1 | 6 | PASS |
| SCI06-old | 1 | 6 | PASS |
| SCI06-new | 1 | 6 | PASS |
| SCI07-old | 1 | 6 | PASS |
| SCI07-new | 1 | 6 | PASS |
| SCI08-old | 1 | 6 | PASS |
| SCI08-new | 1 | 6 | PASS |
| SCI09-old | 1 | 6 | PASS |
| SCI09-new | 1 | 6 | PASS |
| SCI10-old | 1 | 6 | PASS |
| SCI10-new | 1 | 6 | PASS |
| SCI11-old | 1 | 6 | PASS |
| SCI11-new | 1 | 6 | PASS |
| AGR01-old | 1 | 6 | PASS |
| AGR01-new | 1 | 6 | PASS |
| AGR02-old | 1 | 6 | PASS |
| AGR02-new | 1 | 6 | PASS |
| AGR03-old | 1 | 6 | PASS |
| AGR03-new | 1 | 6 | PASS |
| AGR04-old | 1 | 6 | PASS |
| AGR04-new | 1 | 6 | PASS |
| HLT01-old | 1 | 6 | PASS |
| HLT01-new | 1 | 6 | PASS |
| HLT02-old | 1 | 6 | PASS |
| HLT02-new | 1 | 6 | PASS |
| HLT03-old | 1 | 6 | PASS |
| HLT03-new | 1 | 6 | PASS |
| HLT04-old | 1 | 6 | PASS |
| HLT04-new | 1 | 6 | PASS |
| HLT05-old | 1 | 6 | PASS |
| HLT05-new | 1 | 6 | PASS |
| HLT06-old | 1 | 6 | PASS |
| HLT06-new | 1 | 6 | PASS |
| HLT07-old | 1 | 6 | PASS |
| HLT07-new | 1 | 6 | PASS |
| HLT08-old | 1 | 6 | PASS |
| HLT08-new | 1 | 6 | PASS |
| HLT09-old | 1 | 6 | PASS |
| HLT09-new | 1 | 6 | PASS |
| HLT10-old | 1 | 6 | PASS |
| HLT10-new | 1 | 6 | PASS |
| EDU01-old | 1 | 6 | PASS |
| EDU01-new | 1 | 6 | PASS |
| EDU02-old | 1 | 7 | PASS |
| EDU02-new | 1 | 7 | PASS |
| EDU03-old | 1 | 6 | PASS |
| EDU03-new | 1 | 6 | PASS |
| EDU04-old | 1 | 6 | PASS |
| EDU04-new | 1 | 6 | PASS |
| EDU05-old | 1 | 6 | PASS |
| EDU05-new | 1 | 6 | PASS |
| EDU06-old | 1 | 6 | PASS |
| EDU06-new | 1 | 6 | PASS |
| EDU07-old | 1 | 6 | PASS |
| EDU07-new | 1 | 6 | PASS |
| EDU08-old | 1 | 6 | PASS |
| EDU08-new | 1 | 6 | PASS |
| SOC01-old | 1 | 6 | PASS |
| SOC01-new | 1 | 6 | PASS |
| SOC02-old | 1 | 6 | PASS |
| SOC02-new | 1 | 6 | PASS |
| SOC03-old | 1 | 6 | PASS |
| SOC03-new | 1 | 6 | PASS |
| SOC04-old | 1 | 6 | PASS |
| SOC04-new | 1 | 6 | PASS |
| SOC05-old | 1 | 6 | PASS |
| SOC05-new | 1 | 6 | PASS |
| SOC06-old | 1 | 6 | PASS |
| SOC06-new | 1 | 6 | PASS |
| SOC07-old | 1 | 6 | PASS |
| SOC07-new | 1 | 6 | PASS |
| SOC08-old | 1 | 6 | PASS |
| SOC08-new | 1 | 6 | PASS |
| SOC09-old | 1 | 6 | PASS |
| SOC09-new | 1 | 6 | PASS |
| SOC10-old | 1 | 6 | PASS |
| SOC10-new | 1 | 6 | PASS |
| SOC11-old | 1 | 6 | PASS |
| SOC11-new | 1 | 6 | PASS |
| SOC12-old | 1 | 6 | PASS |
| SOC12-new | 1 | 6 | PASS |
| SOC13-old | 1 | 6 | PASS |
| SOC13-new | 1 | 6 | PASS |
| SOC14-old | 1 | 6 | PASS |
| SOC14-new | 1 | 6 | PASS |
| SOC15-old | 1 | 6 | PASS |
| SOC15-new | 1 | 6 | PASS |
| SOC16-old | 1 | 6 | PASS |
| SOC16-new | 1 | 6 | PASS |
| SOC17-old | 1 | 6 | PASS |
| SOC17-new | 1 | 6 | PASS |
| SOC18-old | 1 | 6 | PASS |
| SOC18-new | 1 | 6 | PASS |
| ART01-old | 1 | 6 | PASS |
| ART01-new | 1 | 6 | PASS |
| ART02-old | 1 | 6 | PASS |
| ART02-new | 1 | 6 | PASS |
| ART03-old | 1 | 6 | PASS |
| ART03-new | 1 | 6 | PASS |
| ART04-old | 1 | 6 | PASS |
| ART04-new | 1 | 6 | PASS |
| ART05-old | 1 | 6 | PASS |
| ART05-new | 1 | 6 | PASS |
| ART06-old | 1 | 6 | PASS |
| ART06-new | 1 | 6 | PASS |
| BUS01-old-GAS-QA | 1 | 6 | PASS |

## Appendix E: school-coded-course inventory, without academic judgments

| School ID | School / campus | Geographic group | Type | Coded courses | Academic group set |
| --- | --- | --- | --- | --- | --- |
| SCH-001 | Bicol University / Legazpi - West | bicol | public-suc | EDU06, EDU03, EDU01, EDU02, SOC13, SOC12, SOC16, SOC14, ART02, SOC17, HLT01, SCI01, SCI03, ICT03, ICT01, SCI11, EDU04, EDU05, SOC09, HLT09 | Education and Sports; Social Sciences, Communication, and Humanities; Arts, Design, and Architecture; Health and Allied Sciences; Science and Mathematics; Computing |
| SCH-002 | Bicol University / Legazpi - East | bicol | public-suc | ENG06, ENG01, ENG03, ENG08, ENG02, ENG09, ART06, ENG13, AGR04, EDU08 | Engineering and Technology; Arts, Design, and Architecture; Agriculture, Fisheries, and Food; Education and Sports |
| SCH-003 | Bicol University / Daraga | bicol | public-suc | SOC07, SOC04, SOC05, SOC01, SOC02, BUS01, BUS08, BUS06, BUS05 | Social Sciences, Communication, and Humanities; Business and Management |
| SCH-004 | Bicol University / Guinobatan | bicol | public-suc | AGR01, AGR02, ENG12, SOC15, AGR04, HLT10, EDU08 | Agriculture, Fisheries, and Food; Engineering and Technology; Social Sciences, Communication, and Humanities; Health and Allied Sciences; Education and Sports |
| SCH-005 | Bicol University / Tabaco | bicol | public-suc | EDU02, BUS06, AGR03, AGR04, HLT01, SOC02 | Education and Sports; Business and Management; Agriculture, Fisheries, and Food; Health and Allied Sciences; Social Sciences, Communication, and Humanities |
| SCH-006 | Bicol University / Gubat (Sorsogon) | bicol | public-suc | EDU01, EDU02, BUS06, BUS05 | Education and Sports; Business and Management |
| SCH-007 | Bicol University / Polangui | bicol | public-suc | EDU01, EDU02, ENG05, ICT03, ENG04, BUS06, ICT02, ICT01, HLT01, EDU07, ENG13 | Education and Sports; Engineering and Technology; Computing; Business and Management; Health and Allied Sciences |
| SCH-008 | Sorsogon State University / Bulan | bicol | public-suc | ICT03, ICT01, ICT02, BUS01, BUS03, SOC09, BUS06, EDU08 | Computing; Business and Management; Social Sciences, Communication, and Humanities; Education and Sports |
| SCH-009 | Sorsogon State University / Magallanes | bicol | public-suc | SCI02 | Science and Mathematics |
| SCH-010 | Sorsogon State University / Sorsogon City | bicol | public-suc | EDU02 | Education and Sports |
| SCH-011 | Sorsogon State University / Castilla | bicol | public-suc | AGR01 | Agriculture, Fisheries, and Food |
| SCH-012 | Camarines Sur Polytechnic Colleges (CSPC) / Polytechnic State University of Bicol (PSUB) | bicol | public-suc | ICT01, ICT03, ICT02, SOC10, ENG01, ENG02, ENG03, ENG04, ENG05, ART06, BUS07, BUS10, BUS06, BUS09, BUS05, HLT01, EDU04, EDU06, EDU08, SOC16, SCI06, SCI07, SOC15, SOC09, SOC03 | Computing; Social Sciences, Communication, and Humanities; Engineering and Technology; Arts, Design, and Architecture; Business and Management; Health and Allied Sciences; Education and Sports; Science and Mathematics |
| SCH-013 | Partido State University (ParSU) | bicol | public-suc | EDU01, EDU02, BUS01, BUS05, BUS07, BUS06, BUS08, ENG01, ICT03, SCI06, ICT01, SOC12, SOC09, SCI01, SCI10, BUS10, BUS09, HLT08, SOC11, AGR03, SCI02, SCI09, AGR02 | Education and Sports; Business and Management; Engineering and Technology; Computing; Science and Mathematics; Social Sciences, Communication, and Humanities; Health and Allied Sciences; Agriculture, Fisheries, and Food |
| SCH-014 | Catanduanes State University (CatSU) | bicol | public-suc | ENG01, ENG05, ENG04, ART06, SCI01, SCI09, SCI06, SOC04, BUS08, SOC09, SOC16, BUS01, BUS03, BUS05, BUS06, BUS04, BUS07, HLT01, HLT08, ENG13, AGR01, AGR03, EDU01, EDU02, EDU08, EDU06, EDU04, ICT02, ICT01, ICT03, SOC10 | Engineering and Technology; Arts, Design, and Architecture; Science and Mathematics; Social Sciences, Communication, and Humanities; Business and Management; Health and Allied Sciences; Agriculture, Fisheries, and Food; Education and Sports; Computing |
| SCH-015 | Central Bicol State University of Agriculture (CBSUA) / Pili (main), Calabanga, Pasacao, Sipocot | bicol | public-suc | HLT10, AGR04, EDU01, EDU02, AGR01, SCI01, SOC11, ICT01, SCI09 | Health and Allied Sciences; Agriculture, Fisheries, and Food; Education and Sports; Science and Mathematics; Social Sciences, Communication, and Humanities; Computing |
| SCH-016 | University of Camarines Norte (UCN, dating CNSC) | bicol | public-suc | SOC15, SCI07, SOC01, SCI01, SOC16, SOC05, SOC09, BUS10, BUS01, BUS07, BUS06, BUS05, EDU02, EDU01, EDU07, EDU04, ENG01, ENG03, ENG02, AGR01, SCI09, AGR03 | Social Sciences, Communication, and Humanities; Science and Mathematics; Business and Management; Education and Sports; Engineering and Technology; Agriculture, Fisheries, and Food |
| SCH-017 | UST-Legazpi | bicol | private | HLT02, HLT03, HLT01 | Health and Allied Sciences |
| SCH-018 | Mariners' Polytechnic Colleges / Naga, Canaman, Legazpi | bicol | private | ENG15, ENG14 | Engineering and Technology |
| SCH-019 | Ateneo de Naga University | bicol | private | BUS01, BUS05, BUS06, ENG01, ENG05, ENG04, ICT03, ICT02, EDU01 | Business and Management; Engineering and Technology; Computing; Education and Sports |
| SCH-020 | University of Nueva Caceres | bicol | private | HLT01, ICT01, ART06, SOC11 | Health and Allied Sciences; Computing; Arts, Design, and Architecture; Social Sciences, Communication, and Humanities |
| SCH-021 | Daraga Community College | bicol | community-college | BUS06, EDU08, EDU01, EDU04, EDU06, EDU02 | Business and Management; Education and Sports |
| SCH-022 | Ligao Community College | bicol | community-college | BUS08, EDU03, EDU01, EDU02 | Business and Management; Education and Sports |
| SCH-023 | Polangui Community College | bicol | community-college | EDU07, EDU08, EDU04, EDU02, SOC09, BUS06 | Education and Sports; Social Sciences, Communication, and Humanities; Business and Management |
| SCH-024 | Libon Community College | bicol | community-college | EDU03, EDU01 | Education and Sports |
| SCH-025 | Oas Community College | bicol | community-college | EDU01, EDU02 | Education and Sports |
| SCH-026 | Tiwi Community College | bicol | community-college | EDU01, EDU02, BUS07 | Education and Sports; Business and Management |
| SCH-027 | San Jose Community College | bicol | community-college | EDU01, EDU06 | Education and Sports |
| SCH-028 | Community College of Manito | bicol | community-college | EDU02, EDU01, EDU05 | Education and Sports |
| SCH-029 | Donsol Community College | bicol | community-college | EDU08 | Education and Sports |
| SCH-030 | Baao Community College (ngayon Rinconada State College) | bicol | community-college | EDU02, EDU01, ICT02, ENG13 | Education and Sports; Computing; Engineering and Technology |
| SCH-031 | Calabanga Community College | bicol | community-college | EDU02, BUS06, EDU03, EDU04 | Education and Sports; Business and Management |
| SCH-032 | Gov. Mariano E. Villafuerte Community College (GMVCC) / Libmanan | bicol | community-college | EDU08 | Education and Sports |
| SCH-033 | GMVCC / Garchitorena | bicol | community-college | EDU08, BUS06 | Education and Sports; Business and Management |
| SCH-034 | GMVCC / Siruma | bicol | community-college | AGR03, EDU08 | Agriculture, Fisheries, and Food; Education and Sports |
| SCH-035 | Caramoan Community College | bicol | community-college | EDU01, EDU02, SOC04 | Education and Sports; Social Sciences, Communication, and Humanities |
| SCH-036 | City College of Naga | bicol | community-college | none | none |
| SCH-037 | Aroroy Municipal College | bicol | community-college | EDU08, BUS06 | Education and Sports; Business and Management |
| SCH-038 | San Pascual Polytechnic College | bicol | community-college | none | none |
| SCH-039 | UP Diliman / Diliman | national | national | SCI04, SCI05, SCI10, SOC06, SOC08, ART05, ART06, ENG10, ENG11, ENG09, SOC18, SOC10 | Science and Mathematics; Social Sciences, Communication, and Humanities; Arts, Design, and Architecture; Engineering and Technology |
| SCH-040 | UP Los Banos / Los Banos | national | national | SCI07, SCI06, SCI08, ENG07, HLT10 | Science and Mathematics; Engineering and Technology; Health and Allied Sciences |
| SCH-041 | UP Manila / Manila | national | national | HLT05, HLT04, HLT07, HLT06 | Health and Allied Sciences |
| SCH-042 | University of Santo Tomas / Manila | national | national | ART01, ART04, SOC10 | Arts, Design, and Architecture; Social Sciences, Communication, and Humanities |
| SCH-043 | Ateneo de Manila University | national | national | SCI09 | Science and Mathematics |
| SCH-044 | De La Salle-College of Saint Benilde | national | national | ART03 | Arts, Design, and Architecture |
| SCH-045 | De La Salle University | national | national | SOC03 | Social Sciences, Communication, and Humanities |
| SCH-046 | Ateneo de Davao University | national | national | BUS04 | Business and Management |
| SCH-047 | Northwestern University / Laoag | national | national | BUS02, BUS07, BUS09, BUS10, SOC11, HLT03, HLT04, ENG14, ENG15 | Business and Management; Social Sciences, Communication, and Humanities; Health and Allied Sciences; Engineering and Technology |
| SCH-048 | Davao Doctors College | national | national | HLT06, HLT05, HLT04 | Health and Allied Sciences |
| SCH-049 | Philippine Merchant Marine Academy | national | national | ENG15, ENG14 | Engineering and Technology |
| SCH-050 | Far Eastern University, Philippine Women's University, University of San Carlos | national | national | HLT08 | Health and Allied Sciences |
| SCH-051 | Tarlac State University, Eastern Visayas State University, St. Alexius College | national | national | SOC03 | Social Sciences, Communication, and Humanities |

## Appendix F: every empty/null field path

| File | Field path | Kind |
| --- | --- | --- |
| course-details.json | $.BUS01.careers.0.notes | null |
| course-details.json | $.BUS01.careers.1.notes | null |
| course-details.json | $.BUS01.careers.2.notes | null |
| course-details.json | $.BUS01.careers.3.notes | null |
| course-details.json | $.BUS01.careers.4.notes | null |
| course-details.json | $.BUS02.careers.0.notes | null |
| course-details.json | $.BUS02.careers.1.notes | null |
| course-details.json | $.BUS02.careers.2.notes | null |
| course-details.json | $.BUS02.careers.3.notes | null |
| course-details.json | $.BUS02.careers.4.notes | null |
| course-details.json | $.BUS02.careers.5.notes | null |
| course-details.json | $.BUS02.careers.6.notes | null |
| course-details.json | $.BUS03.careers.0.notes | null |
| course-details.json | $.BUS03.careers.1.notes | null |
| course-details.json | $.BUS03.careers.2.notes | null |
| course-details.json | $.BUS03.careers.3.notes | null |
| course-details.json | $.BUS03.careers.4.notes | null |
| course-details.json | $.BUS03.careers.5.notes | null |
| course-details.json | $.BUS04.careers.0.notes | null |
| course-details.json | $.BUS04.careers.1.notes | null |
| course-details.json | $.BUS04.careers.2.notes | null |
| course-details.json | $.BUS04.careers.3.notes | null |
| course-details.json | $.BUS04.careers.4.notes | null |
| course-details.json | $.BUS04.careers.5.notes | null |
| course-details.json | $.BUS05.careers.0.notes | null |
| course-details.json | $.BUS05.careers.1.notes | null |
| course-details.json | $.BUS05.careers.2.notes | null |
| course-details.json | $.BUS05.careers.3.notes | null |
| course-details.json | $.BUS05.careers.4.notes | null |
| course-details.json | $.BUS05.careers.5.notes | null |
| course-details.json | $.BUS05.careers.6.notes | null |
| course-details.json | $.BUS06.careers.0.notes | null |
| course-details.json | $.BUS06.careers.1.notes | null |
| course-details.json | $.BUS06.careers.2.notes | null |
| course-details.json | $.BUS06.careers.3.notes | null |
| course-details.json | $.BUS06.careers.4.notes | null |
| course-details.json | $.BUS06.careers.5.notes | null |
| course-details.json | $.BUS07.careers.0.notes | null |
| course-details.json | $.BUS07.careers.1.notes | null |
| course-details.json | $.BUS07.careers.2.notes | null |
| course-details.json | $.BUS07.careers.3.notes | null |
| course-details.json | $.BUS07.careers.4.notes | null |
| course-details.json | $.BUS07.careers.5.notes | null |
| course-details.json | $.BUS07.careers.6.notes | null |
| course-details.json | $.BUS08.careers.0.notes | null |
| course-details.json | $.BUS08.careers.1.notes | null |
| course-details.json | $.BUS08.careers.2.notes | null |
| course-details.json | $.BUS08.careers.3.notes | null |
| course-details.json | $.BUS08.careers.4.notes | null |
| course-details.json | $.BUS09.careers.0.notes | null |
| course-details.json | $.BUS09.careers.1.notes | null |
| course-details.json | $.BUS09.careers.2.notes | null |
| course-details.json | $.BUS09.careers.3.notes | null |
| course-details.json | $.BUS09.careers.5.notes | null |
| course-details.json | $.BUS09.careers.6.notes | null |
| course-details.json | $.BUS10.careers.0.notes | null |
| course-details.json | $.BUS10.careers.1.notes | null |
| course-details.json | $.BUS10.careers.2.notes | null |
| course-details.json | $.BUS10.careers.3.notes | null |
| course-details.json | $.BUS10.careers.4.notes | null |
| course-details.json | $.BUS10.careers.5.notes | null |
| course-details.json | $.BUS10.careers.6.notes | null |
| course-details.json | $.ICT01.careers.0.notes | null |
| course-details.json | $.ICT01.careers.1.notes | null |
| course-details.json | $.ICT01.careers.2.notes | null |
| course-details.json | $.ICT01.careers.3.notes | null |
| course-details.json | $.ICT01.careers.4.notes | null |
| course-details.json | $.ICT01.careers.5.notes | null |
| course-details.json | $.ICT01.careers.6.notes | null |
| course-details.json | $.ICT01.careers.7.notes | null |
| course-details.json | $.ICT02.careers.0.notes | null |
| course-details.json | $.ICT02.careers.1.notes | null |
| course-details.json | $.ICT02.careers.2.notes | null |
| course-details.json | $.ICT02.careers.3.notes | null |
| course-details.json | $.ICT02.careers.4.notes | null |
| course-details.json | $.ICT02.careers.5.notes | null |
| course-details.json | $.ICT02.careers.6.notes | null |
| course-details.json | $.ICT03.careers.0.notes | null |
| course-details.json | $.ICT03.careers.1.notes | null |
| course-details.json | $.ICT03.careers.2.notes | null |
| course-details.json | $.ICT03.careers.3.notes | null |
| course-details.json | $.ICT03.careers.4.notes | null |
| course-details.json | $.ICT03.careers.5.notes | null |
| course-details.json | $.ENG01.careers.0.notes | null |
| course-details.json | $.ENG01.careers.1.notes | null |
| course-details.json | $.ENG01.careers.2.notes | null |
| course-details.json | $.ENG01.careers.3.notes | null |
| course-details.json | $.ENG02.careers.0.notes | null |
| course-details.json | $.ENG02.careers.1.notes | null |
| course-details.json | $.ENG02.careers.2.notes | null |
| course-details.json | $.ENG02.careers.3.notes | null |
| course-details.json | $.ENG02.careers.4.notes | null |
| course-details.json | $.ENG03.careers.0.notes | null |
| course-details.json | $.ENG03.careers.1.notes | null |
| course-details.json | $.ENG03.careers.2.notes | null |
| course-details.json | $.ENG03.careers.3.notes | null |
| course-details.json | $.ENG04.careers.0.notes | null |
| course-details.json | $.ENG04.careers.1.notes | null |
| course-details.json | $.ENG04.careers.2.notes | null |
| course-details.json | $.ENG04.careers.3.notes | null |
| course-details.json | $.ENG04.careers.4.notes | null |
| course-details.json | $.ENG05.careers.0.notes | null |
| course-details.json | $.ENG05.careers.1.notes | null |
| course-details.json | $.ENG05.careers.2.notes | null |
| course-details.json | $.ENG05.careers.3.notes | null |
| course-details.json | $.ENG05.careers.4.notes | null |
| course-details.json | $.ENG05.careers.5.notes | null |
| course-details.json | $.ENG05.careers.6.notes | null |
| course-details.json | $.ENG06.careers.0.notes | null |
| course-details.json | $.ENG06.careers.1.notes | null |
| course-details.json | $.ENG06.careers.2.notes | null |
| course-details.json | $.ENG06.careers.3.notes | null |
| course-details.json | $.ENG06.careers.4.notes | null |
| course-details.json | $.ENG07.careers.0.notes | null |
| course-details.json | $.ENG07.careers.1.notes | null |
| course-details.json | $.ENG07.careers.2.notes | null |
| course-details.json | $.ENG07.careers.3.notes | null |
| course-details.json | $.ENG07.careers.4.notes | null |
| course-details.json | $.ENG07.careers.5.notes | null |
| course-details.json | $.ENG07.careers.6.notes | null |
| course-details.json | $.ENG08.careers.0.notes | null |
| course-details.json | $.ENG08.careers.1.notes | null |
| course-details.json | $.ENG08.careers.2.notes | null |
| course-details.json | $.ENG08.careers.3.notes | null |
| course-details.json | $.ENG09.careers.0.notes | null |
| course-details.json | $.ENG09.careers.1.notes | null |
| course-details.json | $.ENG09.careers.2.notes | null |
| course-details.json | $.ENG09.careers.3.notes | null |
| course-details.json | $.ENG09.careers.4.notes | null |
| course-details.json | $.ENG10.careers.0.notes | null |
| course-details.json | $.ENG10.careers.1.notes | null |
| course-details.json | $.ENG10.careers.2.notes | null |
| course-details.json | $.ENG10.careers.3.notes | null |
| course-details.json | $.ENG10.careers.4.notes | null |
| course-details.json | $.ENG10.careers.5.notes | null |
| course-details.json | $.ENG11.careers.0.notes | null |
| course-details.json | $.ENG11.careers.1.notes | null |
| course-details.json | $.ENG11.careers.2.notes | null |
| course-details.json | $.ENG11.careers.3.notes | null |
| course-details.json | $.ENG11.careers.4.notes | null |
| course-details.json | $.ENG11.careers.5.notes | null |
| course-details.json | $.ENG12.careers.0.notes | null |
| course-details.json | $.ENG12.careers.1.notes | null |
| course-details.json | $.ENG12.careers.2.notes | null |
| course-details.json | $.ENG12.careers.3.notes | null |
| course-details.json | $.ENG12.careers.4.notes | null |
| course-details.json | $.ENG12.careers.5.notes | null |
| course-details.json | $.ENG13.careers.0.notes | null |
| course-details.json | $.ENG13.careers.1.notes | null |
| course-details.json | $.ENG13.careers.2.notes | null |
| course-details.json | $.ENG13.careers.3.notes | null |
| course-details.json | $.ENG13.careers.4.notes | null |
| course-details.json | $.ENG14.careers.0.notes | null |
| course-details.json | $.ENG14.careers.2.notes | null |
| course-details.json | $.ENG15.careers.0.notes | null |
| course-details.json | $.ENG15.careers.2.notes | null |
| course-details.json | $.SCI01.careers.0.notes | null |
| course-details.json | $.SCI01.careers.1.notes | null |
| course-details.json | $.SCI01.careers.2.notes | null |
| course-details.json | $.SCI01.careers.3.notes | null |
| course-details.json | $.SCI02.careers.0.notes | null |
| course-details.json | $.SCI02.careers.1.notes | null |
| course-details.json | $.SCI02.careers.2.notes | null |
| course-details.json | $.SCI02.careers.3.notes | null |
| course-details.json | $.SCI02.careers.4.notes | null |
| course-details.json | $.SCI03.careers.0.notes | null |
| course-details.json | $.SCI03.careers.1.notes | null |
| course-details.json | $.SCI03.careers.2.notes | null |
| course-details.json | $.SCI03.careers.3.notes | null |
| course-details.json | $.SCI04.careers.0.notes | null |
| course-details.json | $.SCI04.careers.1.notes | null |
| course-details.json | $.SCI04.careers.2.notes | null |
| course-details.json | $.SCI04.careers.3.notes | null |
| course-details.json | $.SCI05.careers.0.notes | null |
| course-details.json | $.SCI05.careers.1.notes | null |
| course-details.json | $.SCI05.careers.2.notes | null |
| course-details.json | $.SCI05.careers.3.notes | null |
| course-details.json | $.SCI06.careers.0.notes | null |
| course-details.json | $.SCI06.careers.1.notes | null |
| course-details.json | $.SCI06.careers.2.notes | null |
| course-details.json | $.SCI06.careers.3.notes | null |
| course-details.json | $.SCI06.careers.4.notes | null |
| course-details.json | $.SCI07.careers.0.notes | null |
| course-details.json | $.SCI07.careers.1.notes | null |
| course-details.json | $.SCI07.careers.2.notes | null |
| course-details.json | $.SCI07.careers.3.notes | null |
| course-details.json | $.SCI07.careers.4.notes | null |
| course-details.json | $.SCI07.careers.5.notes | null |
| course-details.json | $.SCI08.careers.0.notes | null |
| course-details.json | $.SCI08.careers.1.notes | null |
| course-details.json | $.SCI08.careers.2.notes | null |
| course-details.json | $.SCI08.careers.3.notes | null |
| course-details.json | $.SCI08.careers.4.notes | null |
| course-details.json | $.SCI08.careers.5.notes | null |
| course-details.json | $.SCI08.careers.6.notes | null |
| course-details.json | $.SCI09.careers.0.notes | null |
| course-details.json | $.SCI09.careers.1.notes | null |
| course-details.json | $.SCI09.careers.2.notes | null |
| course-details.json | $.SCI09.careers.3.notes | null |
| course-details.json | $.SCI09.careers.4.notes | null |
| course-details.json | $.SCI09.careers.5.notes | null |
| course-details.json | $.SCI10.careers.0.notes | null |
| course-details.json | $.SCI10.careers.1.notes | null |
| course-details.json | $.SCI10.careers.2.notes | null |
| course-details.json | $.SCI10.careers.3.notes | null |
| course-details.json | $.SCI11.careers.0.notes | null |
| course-details.json | $.SCI11.careers.1.notes | null |
| course-details.json | $.SCI11.careers.2.notes | null |
| course-details.json | $.SCI11.careers.4.notes | null |
| course-details.json | $.AGR01.careers.0.notes | null |
| course-details.json | $.AGR01.careers.1.notes | null |
| course-details.json | $.AGR01.careers.2.notes | null |
| course-details.json | $.AGR01.careers.3.notes | null |
| course-details.json | $.AGR01.careers.4.notes | null |
| course-details.json | $.AGR02.careers.0.notes | null |
| course-details.json | $.AGR02.careers.1.notes | null |
| course-details.json | $.AGR02.careers.2.notes | null |
| course-details.json | $.AGR02.careers.3.notes | null |
| course-details.json | $.AGR02.careers.4.notes | null |
| course-details.json | $.AGR03.careers.0.notes | null |
| course-details.json | $.AGR03.careers.1.notes | null |
| course-details.json | $.AGR03.careers.2.notes | null |
| course-details.json | $.AGR03.careers.3.notes | null |
| course-details.json | $.AGR03.careers.4.notes | null |
| course-details.json | $.AGR03.careers.5.notes | null |
| course-details.json | $.AGR04.careers.0.notes | null |
| course-details.json | $.AGR04.careers.1.notes | null |
| course-details.json | $.AGR04.careers.2.notes | null |
| course-details.json | $.AGR04.careers.3.notes | null |
| course-details.json | $.AGR04.careers.4.notes | null |
| course-details.json | $.AGR04.careers.5.notes | null |
| course-details.json | $.HLT01.careers.1.notes | null |
| course-details.json | $.HLT01.careers.2.notes | null |
| course-details.json | $.HLT02.careers.1.notes | null |
| course-details.json | $.HLT02.careers.2.notes | null |
| course-details.json | $.HLT02.careers.3.notes | null |
| course-details.json | $.HLT02.careers.4.notes | null |
| course-details.json | $.HLT04.careers.1.notes | null |
| course-details.json | $.HLT04.careers.3.notes | null |
| course-details.json | $.HLT05.careers.1.notes | null |
| course-details.json | $.HLT05.careers.2.notes | null |
| course-details.json | $.HLT05.careers.3.notes | null |
| course-details.json | $.HLT06.careers.1.notes | null |
| course-details.json | $.HLT07.careers.0.notes | null |
| course-details.json | $.HLT07.careers.1.notes | null |
| course-details.json | $.HLT07.careers.2.notes | null |
| course-details.json | $.HLT07.careers.3.notes | null |
| course-details.json | $.HLT07.careers.4.notes | null |
| course-details.json | $.HLT07.careers.5.notes | null |
| course-details.json | $.HLT08.careers.1.notes | null |
| course-details.json | $.HLT08.careers.2.notes | null |
| course-details.json | $.HLT08.careers.3.notes | null |
| course-details.json | $.HLT08.careers.4.notes | null |
| course-details.json | $.HLT09.careers.1.notes | null |
| course-details.json | $.HLT09.careers.2.notes | null |
| course-details.json | $.HLT10.careers.1.notes | null |
| course-details.json | $.HLT10.careers.2.notes | null |
| course-details.json | $.HLT10.careers.3.notes | null |
| course-details.json | $.HLT10.careers.4.notes | null |
| course-details.json | $.EDU01.careers.1.notes | null |
| course-details.json | $.EDU01.careers.2.notes | null |
| course-details.json | $.EDU02.careers.1.notes | null |
| course-details.json | $.EDU02.careers.2.notes | null |
| course-details.json | $.EDU02.careers.3.notes | null |
| course-details.json | $.EDU03.careers.1.notes | null |
| course-details.json | $.EDU03.careers.2.notes | null |
| course-details.json | $.EDU03.careers.3.notes | null |
| course-details.json | $.EDU04.careers.1.notes | null |
| course-details.json | $.EDU04.careers.2.notes | null |
| course-details.json | $.EDU05.careers.1.notes | null |
| course-details.json | $.EDU05.careers.2.notes | null |
| course-details.json | $.EDU05.careers.3.notes | null |
| course-details.json | $.EDU05.careers.4.notes | null |
| course-details.json | $.EDU06.careers.1.notes | null |
| course-details.json | $.EDU06.careers.2.notes | null |
| course-details.json | $.EDU06.careers.3.notes | null |
| course-details.json | $.EDU06.careers.4.notes | null |
| course-details.json | $.EDU07.careers.1.notes | null |
| course-details.json | $.EDU07.careers.2.notes | null |
| course-details.json | $.EDU07.careers.3.notes | null |
| course-details.json | $.EDU08.careers.1.notes | null |
| course-details.json | $.EDU08.careers.2.notes | null |
| course-details.json | $.EDU08.careers.3.notes | null |
| course-details.json | $.SOC01.careers.0.notes | null |
| course-details.json | $.SOC01.careers.1.notes | null |
| course-details.json | $.SOC01.careers.2.notes | null |
| course-details.json | $.SOC01.careers.3.notes | null |
| course-details.json | $.SOC01.careers.4.notes | null |
| course-details.json | $.SOC02.careers.1.notes | null |
| course-details.json | $.SOC02.careers.2.notes | null |
| course-details.json | $.SOC02.careers.3.notes | null |
| course-details.json | $.SOC02.careers.4.notes | null |
| course-details.json | $.SOC03.careers.0.notes | null |
| course-details.json | $.SOC03.careers.1.notes | null |
| course-details.json | $.SOC03.careers.2.notes | null |
| course-details.json | $.SOC03.careers.3.notes | null |
| course-details.json | $.SOC03.careers.4.notes | null |
| course-details.json | $.SOC03.careers.5.notes | null |
| course-details.json | $.SOC04.careers.0.notes | null |
| course-details.json | $.SOC04.careers.1.notes | null |
| course-details.json | $.SOC04.careers.2.notes | null |
| course-details.json | $.SOC04.careers.3.notes | null |
| course-details.json | $.SOC04.careers.4.notes | null |
| course-details.json | $.SOC05.careers.0.notes | null |
| course-details.json | $.SOC05.careers.1.notes | null |
| course-details.json | $.SOC05.careers.2.notes | null |
| course-details.json | $.SOC05.careers.3.notes | null |
| course-details.json | $.SOC05.careers.4.notes | null |
| course-details.json | $.SOC06.careers.0.notes | null |
| course-details.json | $.SOC06.careers.1.notes | null |
| course-details.json | $.SOC06.careers.2.notes | null |
| course-details.json | $.SOC06.careers.3.notes | null |
| course-details.json | $.SOC06.careers.4.notes | null |
| course-details.json | $.SOC06.careers.5.notes | null |
| course-details.json | $.SOC07.careers.0.notes | null |
| course-details.json | $.SOC07.careers.1.notes | null |
| course-details.json | $.SOC07.careers.2.notes | null |
| course-details.json | $.SOC08.careers.0.notes | null |
| course-details.json | $.SOC08.careers.1.notes | null |
| course-details.json | $.SOC08.careers.2.notes | null |
| course-details.json | $.SOC08.careers.3.notes | null |
| course-details.json | $.SOC08.careers.4.notes | null |
| course-details.json | $.SOC09.careers.0.notes | null |
| course-details.json | $.SOC09.careers.1.notes | null |
| course-details.json | $.SOC09.careers.2.notes | null |
| course-details.json | $.SOC09.careers.3.notes | null |
| course-details.json | $.SOC09.careers.4.notes | null |
| course-details.json | $.SOC09.careers.5.notes | null |
| course-details.json | $.SOC10.careers.1.notes | null |
| course-details.json | $.SOC10.careers.2.notes | null |
| course-details.json | $.SOC10.careers.3.notes | null |
| course-details.json | $.SOC10.careers.4.notes | null |
| course-details.json | $.SOC11.careers.1.notes | null |
| course-details.json | $.SOC11.careers.2.notes | null |
| course-details.json | $.SOC12.careers.0.notes | null |
| course-details.json | $.SOC12.careers.1.notes | null |
| course-details.json | $.SOC12.careers.2.notes | null |
| course-details.json | $.SOC12.careers.3.notes | null |
| course-details.json | $.SOC12.careers.4.notes | null |
| course-details.json | $.SOC12.careers.5.notes | null |
| course-details.json | $.SOC13.careers.0.notes | null |
| course-details.json | $.SOC13.careers.1.notes | null |
| course-details.json | $.SOC13.careers.2.notes | null |
| course-details.json | $.SOC13.careers.3.notes | null |
| course-details.json | $.SOC13.careers.5.notes | null |
| course-details.json | $.SOC14.careers.0.notes | null |
| course-details.json | $.SOC14.careers.1.notes | null |
| course-details.json | $.SOC14.careers.2.notes | null |
| course-details.json | $.SOC14.careers.3.notes | null |
| course-details.json | $.SOC14.careers.4.notes | null |
| course-details.json | $.SOC14.careers.5.notes | null |
| course-details.json | $.SOC14.careers.6.notes | null |
| course-details.json | $.SOC15.careers.0.notes | null |
| course-details.json | $.SOC15.careers.1.notes | null |
| course-details.json | $.SOC15.careers.2.notes | null |
| course-details.json | $.SOC15.careers.3.notes | null |
| course-details.json | $.SOC15.careers.4.notes | null |
| course-details.json | $.SOC16.careers.0.notes | null |
| course-details.json | $.SOC16.careers.1.notes | null |
| course-details.json | $.SOC16.careers.2.notes | null |
| course-details.json | $.SOC16.careers.3.notes | null |
| course-details.json | $.SOC16.careers.4.notes | null |
| course-details.json | $.SOC16.careers.5.notes | null |
| course-details.json | $.SOC17.careers.0.notes | null |
| course-details.json | $.SOC17.careers.1.notes | null |
| course-details.json | $.SOC17.careers.2.notes | null |
| course-details.json | $.SOC17.careers.3.notes | null |
| course-details.json | $.SOC17.careers.4.notes | null |
| course-details.json | $.SOC18.careers.0.notes | null |
| course-details.json | $.SOC18.careers.1.notes | null |
| course-details.json | $.SOC18.careers.2.notes | null |
| course-details.json | $.SOC18.careers.3.notes | null |
| course-details.json | $.SOC18.careers.4.notes | null |
| course-details.json | $.ART01.careers.0.notes | null |
| course-details.json | $.ART01.careers.1.notes | null |
| course-details.json | $.ART01.careers.2.notes | null |
| course-details.json | $.ART01.careers.3.notes | null |
| course-details.json | $.ART01.careers.4.notes | null |
| course-details.json | $.ART02.careers.0.notes | null |
| course-details.json | $.ART02.careers.1.notes | null |
| course-details.json | $.ART02.careers.2.notes | null |
| course-details.json | $.ART02.careers.3.notes | null |
| course-details.json | $.ART02.careers.4.notes | null |
| course-details.json | $.ART02.careers.5.notes | null |
| course-details.json | $.ART03.careers.0.notes | null |
| course-details.json | $.ART03.careers.1.notes | null |
| course-details.json | $.ART03.careers.2.notes | null |
| course-details.json | $.ART03.careers.3.notes | null |
| course-details.json | $.ART03.careers.4.notes | null |
| course-details.json | $.ART03.careers.5.notes | null |
| course-details.json | $.ART03.careers.6.notes | null |
| course-details.json | $.ART04.careers.0.notes | null |
| course-details.json | $.ART04.careers.1.notes | null |
| course-details.json | $.ART04.careers.2.notes | null |
| course-details.json | $.ART04.careers.3.notes | null |
| course-details.json | $.ART05.careers.0.notes | null |
| course-details.json | $.ART05.careers.1.notes | null |
| course-details.json | $.ART05.careers.2.notes | null |
| course-details.json | $.ART05.careers.3.notes | null |
| course-details.json | $.ART06.careers.0.notes | null |
| course-details.json | $.ART06.careers.1.notes | null |
| course-details.json | $.ART06.careers.2.notes | null |
| course-details.json | $.ART06.careers.3.notes | null |
| items.json | $.interests.0.question | null |
| items.json | $.interests.1.question | null |
| items.json | $.interests.2.question | null |
| items.json | $.interests.3.question | null |
| items.json | $.interests.4.question | null |
| items.json | $.interests.5.question | null |
| items.json | $.interests.6.question | null |
| items.json | $.interests.7.question | null |
| items.json | $.electives.70.section | null |
| items.json | $.electives.70.group | null |
| items.json | $.gwaTiers.5.lowerInclusive | null |
| pilot-schools.json | $ | empty-array |
| salary-sources.json | $.references.0.suffix | empty-string |
| salary-sources.json | $.references.1.suffix | empty-string |
| salary-sources.json | $.references.2.suffix | empty-string |
| salary-sources.json | $.references.3.suffix | empty-string |
| salary-sources.json | $.references.4.suffix | empty-string |
| salary-sources.json | $.references.5.suffix | empty-string |
| salary-sources.json | $.references.6.suffix | empty-string |
| salary-sources.json | $.references.7.suffix | empty-string |
| salary-sources.json | $.references.8.suffix | empty-string |
| salary-sources.json | $.references.9.suffix | empty-string |
| schools.json | $.0.programNotes | empty-array |
| schools.json | $.0.sourceCells.location | null |
| schools.json | $.0.excludedMappings | empty-array |
| schools.json | $.1.programNotes | empty-array |
| schools.json | $.1.sourceCells.location | null |
| schools.json | $.1.excludedMappings | empty-array |
| schools.json | $.2.programNotes | empty-array |
| schools.json | $.2.sourceCells.location | null |
| schools.json | $.2.excludedMappings | empty-array |
| schools.json | $.3.programNotes | empty-array |
| schools.json | $.3.sourceCells.location | null |
| schools.json | $.3.excludedMappings | empty-array |
| schools.json | $.4.programNotes | empty-array |
| schools.json | $.4.sourceCells.location | null |
| schools.json | $.4.excludedMappings | empty-array |
| schools.json | $.5.programNotes | empty-array |
| schools.json | $.5.sourceCells.location | null |
| schools.json | $.5.excludedMappings | empty-array |
| schools.json | $.6.programNotes | empty-array |
| schools.json | $.6.sourceCells.location | null |
| schools.json | $.6.excludedMappings | empty-array |
| schools.json | $.7.programNotes | empty-array |
| schools.json | $.7.sourceCells.location | null |
| schools.json | $.7.excludedMappings | empty-array |
| schools.json | $.8.province | null |
| schools.json | $.8.programNotes | empty-array |
| schools.json | $.8.sourceCells.location | null |
| schools.json | $.8.excludedMappings | empty-array |
| schools.json | $.9.sourceCells.location | null |
| schools.json | $.9.excludedMappings | empty-array |
| schools.json | $.10.sourceCells.location | null |
| schools.json | $.10.excludedMappings | empty-array |
| schools.json | $.11.campus | null |
| schools.json | $.11.sourceCells.location | null |
| schools.json | $.11.excludedMappings | empty-array |
| schools.json | $.12.campus | null |
| schools.json | $.12.sourceCells.location | null |
| schools.json | $.12.excludedMappings | empty-array |
| schools.json | $.13.campus | null |
| schools.json | $.13.flags | empty-array |
| schools.json | $.13.sourceCells.location | null |
| schools.json | $.13.excludedMappings | empty-array |
| schools.json | $.14.location | null |
| schools.json | $.14.province | null |
| schools.json | $.14.sourceCells.location | null |
| schools.json | $.15.campus | null |
| schools.json | $.15.sourceCells.location | null |
| schools.json | $.15.excludedMappings | empty-array |
| schools.json | $.16.campus | null |
| schools.json | $.16.location | null |
| schools.json | $.16.programNotes | empty-array |
| schools.json | $.16.sourceCells.location | null |
| schools.json | $.16.excludedMappings | empty-array |
| schools.json | $.17.location | null |
| schools.json | $.17.province | null |
| schools.json | $.17.programNotes | empty-array |
| schools.json | $.17.sourceCells.location | null |
| schools.json | $.17.excludedMappings | empty-array |
| schools.json | $.18.campus | null |
| schools.json | $.18.sourceCells.location | null |
| schools.json | $.18.excludedMappings | empty-array |
| schools.json | $.19.campus | null |
| schools.json | $.19.sourceCells.location | null |
| schools.json | $.19.excludedMappings | empty-array |
| schools.json | $.20.campus | null |
| schools.json | $.20.programNotes | empty-array |
| schools.json | $.20.excludedMappings | empty-array |
| schools.json | $.21.campus | null |
| schools.json | $.21.excludedMappings | empty-array |
| schools.json | $.22.campus | null |
| schools.json | $.22.excludedMappings | empty-array |
| schools.json | $.23.campus | null |
| schools.json | $.23.excludedMappings | empty-array |
| schools.json | $.24.campus | null |
| schools.json | $.24.excludedMappings | empty-array |
| schools.json | $.25.campus | null |
| schools.json | $.25.programNotes | empty-array |
| schools.json | $.25.excludedMappings | empty-array |
| schools.json | $.26.campus | null |
| schools.json | $.26.excludedMappings | empty-array |
| schools.json | $.27.campus | null |
| schools.json | $.27.programNotes | empty-array |
| schools.json | $.27.excludedMappings | empty-array |
| schools.json | $.28.campus | null |
| schools.json | $.28.programNotes | empty-array |
| schools.json | $.28.excludedMappings | empty-array |
| schools.json | $.29.campus | null |
| schools.json | $.29.excludedMappings | empty-array |
| schools.json | $.30.campus | null |
| schools.json | $.30.programNotes | empty-array |
| schools.json | $.30.excludedMappings | empty-array |
| schools.json | $.31.programNotes | empty-array |
| schools.json | $.31.excludedMappings | empty-array |
| schools.json | $.32.excludedMappings | empty-array |
| schools.json | $.33.programNotes | empty-array |
| schools.json | $.33.excludedMappings | empty-array |
| schools.json | $.34.campus | null |
| schools.json | $.34.programNotes | empty-array |
| schools.json | $.34.excludedMappings | empty-array |
| schools.json | $.35.campus | null |
| schools.json | $.35.courseIds | empty-array |
| schools.json | $.35.excludedMappings | empty-array |
| schools.json | $.36.campus | null |
| schools.json | $.36.excludedMappings | empty-array |
| schools.json | $.37.campus | null |
| schools.json | $.37.courseIds | empty-array |
| schools.json | $.37.excludedMappings | empty-array |
| schools.json | $.38.location | null |
| schools.json | $.38.province | null |
| schools.json | $.38.programNotes | empty-array |
| schools.json | $.38.sourceCells.location | null |
| schools.json | $.38.excludedMappings | empty-array |
| schools.json | $.39.location | null |
| schools.json | $.39.programNotes | empty-array |
| schools.json | $.39.sourceCells.location | null |
| schools.json | $.39.excludedMappings | empty-array |
| schools.json | $.40.location | null |
| schools.json | $.40.province | null |
| schools.json | $.40.programNotes | empty-array |
| schools.json | $.40.sourceCells.location | null |
| schools.json | $.40.excludedMappings | empty-array |
| schools.json | $.41.province | null |
| schools.json | $.41.programNotes | empty-array |
| schools.json | $.41.sourceCells.location | null |
| schools.json | $.41.excludedMappings | empty-array |
| schools.json | $.42.campus | null |
| schools.json | $.42.location | null |
| schools.json | $.42.province | null |
| schools.json | $.42.programNotes | empty-array |
| schools.json | $.42.sourceCells.location | null |
| schools.json | $.42.excludedMappings | empty-array |
| schools.json | $.43.campus | null |
| schools.json | $.43.location | null |
| schools.json | $.43.province | null |
| schools.json | $.43.programNotes | empty-array |
| schools.json | $.43.sourceCells.location | null |
| schools.json | $.43.excludedMappings | empty-array |
| schools.json | $.44.campus | null |
| schools.json | $.44.location | null |
| schools.json | $.44.province | null |
| schools.json | $.44.programNotes | empty-array |
| schools.json | $.44.sourceCells.location | null |
| schools.json | $.44.excludedMappings | empty-array |
| schools.json | $.45.campus | null |
| schools.json | $.45.location | null |
| schools.json | $.45.province | null |
| schools.json | $.45.programNotes | empty-array |
| schools.json | $.45.sourceCells.location | null |
| schools.json | $.45.excludedMappings | empty-array |
| schools.json | $.46.programNotes | empty-array |
| schools.json | $.46.sourceCells.location | null |
| schools.json | $.46.excludedMappings | empty-array |
| schools.json | $.47.campus | null |
| schools.json | $.47.location | null |
| schools.json | $.47.province | null |
| schools.json | $.47.programNotes | empty-array |
| schools.json | $.47.sourceCells.location | null |
| schools.json | $.47.excludedMappings | empty-array |
| schools.json | $.48.campus | null |
| schools.json | $.48.location | null |
| schools.json | $.48.province | null |
| schools.json | $.48.programNotes | empty-array |
| schools.json | $.48.sourceCells.location | null |
| schools.json | $.48.excludedMappings | empty-array |
| schools.json | $.49.campus | null |
| schools.json | $.49.location | null |
| schools.json | $.49.province | null |
| schools.json | $.49.programNotes | empty-array |
| schools.json | $.49.sourceCells.location | null |
| schools.json | $.49.excludedMappings | empty-array |
| schools.json | $.50.campus | null |
| schools.json | $.50.location | null |
| schools.json | $.50.province | null |
| schools.json | $.50.programNotes | empty-array |
| schools.json | $.50.sourceNames | empty-array |
| schools.json | $.50.sourceCells.location | null |
| schools.json | $.50.sourceCells.sources | empty-string |
| schools.json | $.50.excludedMappings | empty-array |

## Reproduction commands and artifacts

No dependencies were installed. PDF extraction uses the existing bundled pypdf, with QA_PYTHON set to its Python executable (or an already available Python with pypdf). Run from the repository root:

```powershell
node scripts/simulate-profiles.mjs
node scripts/simulate-recoverability.mjs
$env:QA_PYTHON='C:/Users/Charlene/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
node scripts/replay-witnesses.mjs
node scripts/qa-replay-server.mjs
# In the browser, open /__qa/load?case=1 through case=12 on 127.0.0.1:3100.
# Observe rank 1, download each PDF, record its actual path in browser-downloads.json.
node scripts/verify-browser-replay.mjs
node scripts/scan-data-sanity.mjs
node scripts/verify-simulation.mjs
npm test
node scripts/verify-links.mjs
node scripts/verify-details.mjs
node scripts/verify-reachability.mjs
node scripts/verify-routes.mjs
node scripts/write-simulation-reports.mjs
```

The browser loader serves pre-existing production artifacts; no build or application edits are required. The browser step is not claimed to be an unattended shell test. Its saved evidence reflects the observed sample, and download paths must be refreshed for a new browser run. Full-model PDFs are temporary extraction artifacts; the 12 browser PDFs remain at their recorded download paths. Reports and machine-readable outputs are under docs/qa/. Original files checked against the phase-start baseline: 320; changed existing files: 0.

## Files created in this phase

- docs/chapter4-results-draft.md
- docs/qa/browser-assets.json
- docs/qa/browser-downloads.json
- docs/qa/browser-replay.json
- docs/qa/browser-sessions.json
- docs/qa/data-sanity.json
- docs/qa/gas-witness.json
- docs/qa/npm-test-output.txt
- docs/qa/recoverability.csv
- docs/qa/recoverability.json
- docs/qa/reproducibility.json
- docs/qa/school-course-groups.csv
- docs/qa/scope-check.json
- docs/qa/uniform-profiles.csv
- docs/qa/uniform-profiles.json
- docs/qa/verify-details-output.txt
- docs/qa/verify-links-output.txt
- docs/qa/verify-reachability-output.txt
- docs/qa/verify-routes-output.txt
- docs/qa/verify-simulation-output.txt
- docs/qa/witness-replay.json
- docs/simulation-qa-report.md
- scripts/qa-replay-server.mjs
- scripts/qa/common.mjs
- scripts/qa/pdf-text.py
- scripts/qa/session.mjs
- scripts/replay-witnesses.mjs
- scripts/scan-data-sanity.mjs
- scripts/simulate-profiles.mjs
- scripts/simulate-recoverability.mjs
- scripts/verify-browser-replay.mjs
- scripts/verify-simulation.mjs
- scripts/write-simulation-reports.mjs

## Git status

Pre-existing work from earlier prompts remains. No file was staged or committed. Only new scripts and reports were created in this phase.

```text
 M app/about/About.js
 M app/about/page.js
 M app/how-it-works/HowItWorks.js
 M app/how-it-works/page.js
 M app/intake/basecamp.css
 M app/intake/page.js
 M app/journey/academic/page.js
 M app/journey/academic/presentation.css
 M app/journey/interests/page.js
 M app/journey/page.js
 M app/journey/skills/ForestVine.js
 M app/journey/skills/StatementIcon.js
 M app/journey/skills/page.js
 M app/layout.js
 M app/page.js
 M app/processing/page.js
 M app/report/page.js
 M app/results/CourseMatch.js
 M app/results/[courseId]/FieldJournal.js
 M app/results/[courseId]/journal.css
 M app/results/[courseId]/page.js
 M app/results/page.js
 M app/results/results.css
 M components/AtlasTutorial.js
 M components/JourneyAccess.js
 M lib/assessmentValidation.js
 M lib/assessmentValidation.test.js
 M lib/browserStorage.js
 M lib/explorerReport.js
 M lib/journeyEntry.js
 M lib/useSessionAnswers.js
 M package.json
?? data/v2/
?? docs/assessment-screens-report.md
?? docs/chapter4-results-draft.md
?? docs/copy-inventory.md
?? docs/course-detail-copy-report.md
?? docs/data-conversion-report.md
?? docs/details-schools-report.md
?? docs/icon-inventory.md
?? docs/interest-stems-review.md
?? docs/qa/
?? docs/reachability-report.md
?? docs/results-pdf-report.md
?? docs/revision-25b-report.md
?? docs/rubric-revision-report.md
?? docs/scoring-v2-report.md
?? docs/session-flow-report.md
?? docs/simulation-qa-report.md
?? lib/courseDataV2.js
?? lib/courseDetailModel.js
?? lib/courseDetailModel.test.js
?? lib/explainMatch.js
?? lib/fixtures/
?? lib/itemIconsV2.js
?? lib/itemsV2.js
?? lib/recommendations.js
?? lib/recommendations.test.js
?? lib/routeResolution.js
?? lib/scoringV2/
?? lib/sessionFlow.test.js
?? lib/sessionSchema.js
?? lib/valleySelection.js
?? lib/valleySelection.test.js
?? scripts/qa-replay-server.mjs
?? scripts/qa/
?? scripts/replay-witnesses.mjs
?? scripts/scan-data-sanity.mjs
?? scripts/simulate-profiles.mjs
?? scripts/simulate-recoverability.mjs
?? scripts/verify-browser-replay.mjs
?? scripts/verify-details.mjs
?? scripts/verify-links.mjs
?? scripts/verify-reachability.mjs
?? scripts/verify-routes.mjs
?? scripts/verify-simulation.mjs
?? scripts/write-simulation-reports.mjs
```
