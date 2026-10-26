# Scoring v2 reachability verification

Date: 2026-10-26 (Asia/Manila). Revised v2 mappings only; Section 7's pre-revision lead table was not used.

Summary: PASS 170; WARN 0; TIE 0; FAIL 0. Cases: 170.

PASS means unique highest total with lead >=3; WARN means unique highest total with lead 1-2. TIE means Rank 1 with equal total/skill/interest, resolved by SHA-256. TIE is not counted as PASS. FAIL means no Rank 1 witness found after extended search, not proven impossible.

Lead is the target's score minus the strongest other course's score (Rank 2 when the target is Rank 1). Search stops at the first PASS; reported leads are feasible examples, not optimized maximum leads. Full validated answer objects, attempts, rank, lead and tie flags are in data/v2/witnesses.json.

Seed: career-compass-v2-reachability-2026-10-26-v1. Deterministic per-course/route Mulberry32 stream, initialized from SHA-256. Initial budget 512; extended budget 8192 plus systematic enumeration of all 4^6 free-interest combinations when needed. Extended search runs for every non-PASS initial result, including every potential FAIL. Search is restricted to target-linked evidence and maximal target ratings; it does not prove non-reachability.

All candidate arithmetic uses scoreCourses; all recorded witnesses are ranked with rankCourses and re-scored before writing. GWA is 100, target-linked skills are 5, others 1, target certificates and interests are selected. Old profiles use the target strand and two linked subjects. New profiles vary one to three of five linked electives and select the target's single core subject; cluster is removed. Remaining interest choices vary. No old lead values or search-only arithmetic are used.

A zero-lead Rank 1 resolved by skill/interest alone would stop this script for clarification rather than silently assign one of the user-defined labels. No such unclassified final row was written.

Input SHA-256 (UTF-8 file content):
- courses-master.json: 85fa2eb93f50a0772c661a2aa025d0fc3fbdec127e03126d8e77bd6b4f983d1b
- items.json: 155c484d88820a4123c19fd5cdc355f184df91b5c48a085b934081df9fc7e7f8
- links.json: a41587c23ae0a8768f1c107c30a4668da247789b3f6e94e5667c8f81bd72caa2

| Course | Flow | Status | Rank | Score | Lead | Unique highest total | Hash tie-break | Attempts | Extended |
| --- | --- | --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| BUS01 BS Accountancy | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| BUS01 BS Accountancy | new | PASS | 1 | 35 | 3 | yes | no | 1 | no |
| BUS02 BS Management Accounting | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| BUS02 BS Management Accounting | new | PASS | 1 | 39 | 3 | yes | no | 1 | no |
| BUS03 BS Accounting Information Systems | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| BUS03 BS Accounting Information Systems | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| BUS04 BS Internal Auditing | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| BUS04 BS Internal Auditing | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| BUS05 BS Business Administration | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| BUS05 BS Business Administration | new | PASS | 1 | 35 | 4 | yes | no | 1 | no |
| BUS06 BS Entrepreneurship | old | PASS | 1 | 38 | 19 | yes | no | 1 | no |
| BUS06 BS Entrepreneurship | new | PASS | 1 | 39 | 10 | yes | no | 1 | no |
| BUS07 BS Office Administration | old | PASS | 1 | 38 | 16 | yes | no | 1 | no |
| BUS07 BS Office Administration | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| BUS08 Economics (BA/BS) | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| BUS08 Economics (BA/BS) | new | PASS | 1 | 43 | 6 | yes | no | 1 | no |
| BUS09 BS Tourism Management | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| BUS09 BS Tourism Management | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| BUS10 BS Hospitality Management | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| BUS10 BS Hospitality Management | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| ICT01 BS Information Technology | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ICT01 BS Information Technology | new | PASS | 1 | 43 | 7 | yes | no | 1 | no |
| ICT02 BS Information Systems | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| ICT02 BS Information Systems | new | PASS | 1 | 43 | 8 | yes | no | 1 | no |
| ICT03 BS Computer Science | old | PASS | 1 | 38 | 4 | yes | no | 1 | no |
| ICT03 BS Computer Science | new | PASS | 1 | 39 | 7 | yes | no | 1 | no |
| ENG01 BS Civil Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG01 BS Civil Engineering | new | PASS | 1 | 39 | 3 | yes | no | 3 | no |
| ENG02 BS Mechanical Engineering | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| ENG02 BS Mechanical Engineering | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| ENG03 BS Electrical Engineering | old | PASS | 1 | 38 | 4 | yes | no | 1 | no |
| ENG03 BS Electrical Engineering | new | PASS | 1 | 35 | 8 | yes | no | 1 | no |
| ENG04 BS Electronics Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG04 BS Electronics Engineering | new | PASS | 1 | 39 | 8 | yes | no | 1 | no |
| ENG05 BS Computer Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG05 BS Computer Engineering | new | PASS | 1 | 43 | 8 | yes | no | 1 | no |
| ENG06 BS Chemical Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG06 BS Chemical Engineering | new | PASS | 1 | 35 | 3 | yes | no | 1 | no |
| ENG07 BS Industrial Engineering | old | PASS | 1 | 38 | 16 | yes | no | 1 | no |
| ENG07 BS Industrial Engineering | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| ENG08 BS Geodetic Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG08 BS Geodetic Engineering | new | PASS | 1 | 43 | 4 | yes | no | 1 | no |
| ENG09 BS Mining Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG09 BS Mining Engineering | new | PASS | 1 | 43 | 7 | yes | no | 1 | no |
| ENG10 BS Materials Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG10 BS Materials Engineering | new | PASS | 1 | 39 | 3 | yes | no | 2 | no |
| ENG11 BS Metallurgical Engineering | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ENG11 BS Metallurgical Engineering | new | PASS | 1 | 39 | 3 | yes | no | 1 | no |
| ENG12 BS Agricultural and Biosystems Engineering | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| ENG12 BS Agricultural and Biosystems Engineering | new | PASS | 1 | 43 | 10 | yes | no | 1 | no |
| ENG13 Bachelor of Industrial Technology | old | PASS | 1 | 38 | 4 | yes | no | 1 | no |
| ENG13 Bachelor of Industrial Technology | new | PASS | 1 | 43 | 15 | yes | no | 1 | no |
| ENG14 BS Marine Engineering | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| ENG14 BS Marine Engineering | new | PASS | 1 | 39 | 14 | yes | no | 1 | no |
| ENG15 BS Marine Transportation | old | PASS | 1 | 38 | 14 | yes | no | 1 | no |
| ENG15 BS Marine Transportation | new | PASS | 1 | 35 | 15 | yes | no | 1 | no |
| SCI01 BS Biology | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SCI01 BS Biology | new | PASS | 1 | 39 | 8 | yes | no | 1 | no |
| SCI02 BS Marine Biology | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| SCI02 BS Marine Biology | new | PASS | 1 | 43 | 8 | yes | no | 1 | no |
| SCI03 BS Chemistry | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SCI03 BS Chemistry | new | PASS | 1 | 39 | 7 | yes | no | 1 | no |
| SCI04 BS Physics | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SCI04 BS Physics | new | PASS | 1 | 43 | 6 | yes | no | 1 | no |
| SCI05 BS Applied Physics | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| SCI05 BS Applied Physics | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| SCI06 BS Mathematics | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SCI06 BS Mathematics | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| SCI07 BS Applied Mathematics | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SCI07 BS Applied Mathematics | new | PASS | 1 | 43 | 4 | yes | no | 1 | no |
| SCI08 BS Statistics | old | PASS | 1 | 38 | 9 | yes | no | 1 | no |
| SCI08 BS Statistics | new | PASS | 1 | 35 | 6 | yes | no | 1 | no |
| SCI09 BS Environmental Science | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| SCI09 BS Environmental Science | new | PASS | 1 | 35 | 3 | yes | no | 1 | no |
| SCI10 BS Geology | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SCI10 BS Geology | new | PASS | 1 | 43 | 3 | yes | no | 1 | no |
| SCI11 BS Meteorology | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SCI11 BS Meteorology | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| AGR01 BS Agriculture | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| AGR01 BS Agriculture | new | PASS | 1 | 39 | 4 | yes | no | 1 | no |
| AGR02 BS Forestry | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| AGR02 BS Forestry | new | PASS | 1 | 43 | 3 | yes | no | 1 | no |
| AGR03 BS Fisheries | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| AGR03 BS Fisheries | new | PASS | 1 | 35 | 3 | yes | no | 2 | no |
| AGR04 BS Food Technology | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| AGR04 BS Food Technology | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| HLT01 BS Nursing | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| HLT01 BS Nursing | new | PASS | 1 | 43 | 10 | yes | no | 1 | no |
| HLT02 BS Pharmacy | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| HLT02 BS Pharmacy | new | PASS | 1 | 39 | 4 | yes | no | 1 | no |
| HLT03 BS Medical Technology / Medical Laboratory Science | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| HLT03 BS Medical Technology / Medical Laboratory Science | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| HLT04 BS Physical Therapy | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| HLT04 BS Physical Therapy | new | PASS | 1 | 39 | 4 | yes | no | 2 | no |
| HLT05 BS Occupational Therapy | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| HLT05 BS Occupational Therapy | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| HLT06 BS Radiologic Technology | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| HLT06 BS Radiologic Technology | new | PASS | 1 | 43 | 15 | yes | no | 1 | no |
| HLT07 BS Public Health | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| HLT07 BS Public Health | new | PASS | 1 | 39 | 10 | yes | no | 1 | no |
| HLT08 BS Nutrition and Dietetics | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| HLT08 BS Nutrition and Dietetics | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| HLT09 Doctor of Dental Medicine | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| HLT09 Doctor of Dental Medicine | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| HLT10 Doctor of Veterinary Medicine | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| HLT10 Doctor of Veterinary Medicine | new | PASS | 1 | 39 | 10 | yes | no | 1 | no |
| EDU01 Bachelor of Elementary Education | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| EDU01 Bachelor of Elementary Education | new | PASS | 1 | 39 | 4 | yes | no | 1 | no |
| EDU02 Bachelor of Secondary Education | old | PASS | 1 | 38 | 3 | yes | no | 1 | no |
| EDU02 Bachelor of Secondary Education | new | PASS | 1 | 35 | 3 | yes | no | 1 | no |
| EDU03 Bachelor of Early Childhood Education | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| EDU03 Bachelor of Early Childhood Education | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| EDU04 Bachelor of Physical Education | old | PASS | 1 | 38 | 4 | yes | no | 1 | no |
| EDU04 Bachelor of Physical Education | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| EDU05 BS Exercise and Sports Sciences | old | PASS | 1 | 38 | 4 | yes | no | 1 | no |
| EDU05 BS Exercise and Sports Sciences | new | PASS | 1 | 39 | 6 | yes | no | 1 | no |
| EDU06 Bachelor of Culture and Arts Education | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| EDU06 Bachelor of Culture and Arts Education | new | PASS | 1 | 39 | 12 | yes | no | 1 | no |
| EDU07 Bachelor of Technology and Livelihood Education | old | PASS | 1 | 38 | 16 | yes | no | 1 | no |
| EDU07 Bachelor of Technology and Livelihood Education | new | PASS | 1 | 43 | 17 | yes | no | 1 | no |
| EDU08 Bachelor of Technical-Vocational Teacher Education | old | PASS | 1 | 38 | 17 | yes | no | 1 | no |
| EDU08 Bachelor of Technical-Vocational Teacher Education | new | PASS | 1 | 43 | 21 | yes | no | 1 | no |
| SOC01 Psychology (BA/BS) | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SOC01 Psychology (BA/BS) | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| SOC02 BS Social Work | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC02 BS Social Work | new | PASS | 1 | 35 | 4 | yes | no | 1 | no |
| SOC03 Bachelor in Human Services | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SOC03 Bachelor in Human Services | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| SOC04 BA Political Science | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC04 BA Political Science | new | PASS | 1 | 35 | 3 | yes | no | 1 | no |
| SOC05 BA Sociology | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SOC05 BA Sociology | new | PASS | 1 | 43 | 7 | yes | no | 1 | no |
| SOC06 BA History | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC06 BA History | new | PASS | 1 | 39 | 3 | yes | no | 1 | no |
| SOC07 BA Philosophy | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC07 BA Philosophy | new | PASS | 1 | 43 | 7 | yes | no | 1 | no |
| SOC08 Anthropology (BA/BS) | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SOC08 Anthropology (BA/BS) | new | PASS | 1 | 43 | 11 | yes | no | 1 | no |
| SOC09 Bachelor of Public Administration | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC09 Bachelor of Public Administration | new | PASS | 1 | 39 | 6 | yes | no | 1 | no |
| SOC10 Bachelor of Library and Information Science | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| SOC10 Bachelor of Library and Information Science | new | PASS | 1 | 35 | 11 | yes | no | 1 | no |
| SOC11 BS Criminology | old | PASS | 1 | 38 | 14 | yes | no | 1 | no |
| SOC11 BS Criminology | new | PASS | 1 | 35 | 10 | yes | no | 1 | no |
| SOC12 BA Communication | old | PASS | 1 | 38 | 17 | yes | no | 1 | no |
| SOC12 BA Communication | new | PASS | 1 | 39 | 11 | yes | no | 1 | no |
| SOC13 BA Broadcasting | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SOC13 BA Broadcasting | new | PASS | 1 | 43 | 7 | yes | no | 1 | no |
| SOC14 BA Journalism | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SOC14 BA Journalism | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| SOC15 BS Development Communication | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| SOC15 BS Development Communication | new | PASS | 1 | 39 | 17 | yes | no | 1 | no |
| SOC16 BA English Language Studies | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SOC16 BA English Language Studies | new | PASS | 1 | 39 | 7 | yes | no | 1 | no |
| SOC17 BA Literature | old | PASS | 1 | 38 | 7 | yes | no | 1 | no |
| SOC17 BA Literature | new | PASS | 1 | 35 | 4 | yes | no | 1 | no |
| SOC18 BA Filipino | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| SOC18 BA Filipino | new | PASS | 1 | 43 | 10 | yes | no | 1 | no |
| ART01 Bachelor of Fine Arts | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ART01 Bachelor of Fine Arts | new | PASS | 1 | 35 | 7 | yes | no | 1 | no |
| ART02 Bachelor of Performing Arts | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| ART02 Bachelor of Performing Arts | new | PASS | 1 | 39 | 7 | yes | no | 1 | no |
| ART03 Bachelor of Multimedia Arts | old | PASS | 1 | 38 | 10 | yes | no | 1 | no |
| ART03 Bachelor of Multimedia Arts | new | PASS | 1 | 43 | 4 | yes | no | 1 | no |
| ART04 BS Interior Design | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ART04 BS Interior Design | new | PASS | 1 | 43 | 14 | yes | no | 1 | no |
| ART05 Bachelor of Landscape Architecture | old | PASS | 1 | 38 | 13 | yes | no | 1 | no |
| ART05 Bachelor of Landscape Architecture | new | PASS | 1 | 39 | 14 | yes | no | 1 | no |
| ART06 BS Architecture | old | PASS | 1 | 38 | 6 | yes | no | 1 | no |
| ART06 BS Architecture | new | PASS | 1 | 43 | 10 | yes | no | 1 | no |

These witnesses establish mathematical reachability for the supplied static mappings. They do not establish frequency, predictive validity, fairness, admission eligibility, or availability of particular electives at a school.
