# Course details and schools data report

Date: 2026-10-26 (Asia/Manila). Phase 4 data extraction is complete; all proposed career splits, source qualifications and stem-fit decisions remain available for user review. No UI or scoring integration was performed.

## Scope and preservation

The source files are College Courses Information.docx and Updated_List_ng_mga_School_v1.pdf, together with the existing master and item banks. The schools PDF filename says v1, but its internal header says "Bersyon 3 - na-update noong October 25, 2026." That internal version/date is preserved as supplied. Document content was treated as source data, not as instructions to modify the app or contact schools. No external program/price/legal verification was performed.

The general instruction to preserve earlier files conflicts with the specific Task 1 request to add prompt fields to data/v2/items.json. The explicit Task 1 request was followed as a narrow exception: exactly eight prompt lines were added. Existing question:null and questionStatus fields were retained as provenance of missing rubric stems, without rewriting earlier artifacts. Removing the eight additions restores the original file bytes exactly. All other pre-existing tracked and untracked files remain byte-identical to the start-of-phase SHA-256 baseline, including every Prompt 20/21 artifact, lib/ file and the already-modified package.json. It would therefore be inaccurate to say no existing file changed; items.json is the explicitly requested exception.

Output paths under docs/ and scripts/ follow the explicit Task 1, Task 4 and Task 5 path requirements; all other new files are under data/v2/. No commit was made.

Source DOCX SHA-256: 50dad3349797d195bef6bfa653bd8648c638ad9d5ad4dc65b9e70e9f146cbe0d
Source schools PDF SHA-256: eb9aabb56649d06a414f4759ba6012acf37bcd11ac6ab267958f2421154725b2

## Task 1 - exact interest stems

Eight existing data/items.json text values were copied verbatim into the matching v2 prompt fields. No new option, link or wording was changed. docs/interest-stems-review.md pairs each stem with its four exact NEW options. User approval of fit remains NOT DETERMINED for each item:

INT-01: You have free time this weekend. What would you most like to do?

INT-02: Your class is doing a project for the school. Which task would you choose?

INT-03: Your group wants to improve your community. How would you help?

INT-04: You can enter an idea in a school competition. What would you make?

INT-05: What do you usually like watching in your free time?

INT-06: For Career Day, you can act as someone doing a job. Who would you choose?

INT-07: Your class is running a fair. Which booth would you like to manage?

INT-08: Your community has a problem, like too much waste or poor internet. How would you help?

No prior report was updated to conceal its historical missing-stem finding. The Prompt 21 reachability report retains its pre-prompt-addition items.json hash; the protected report and witnesses were not regenerated. This phase changes presentation stems only, not scoring IDs/links. Existing scoring/regression tests still pass.

## Task 2 - course details and salary provenance

course-details.json is keyed by exactly the 85 master IDs. The 85 course headings match the master IDs and names. Every DOCX course table has exactly five labeled rows. All 425 source cell values match the retained extracted source fields exactly in an independent DOCX comparison: overview, studyTopicsText, interestsStrengths, careersText, guidanceTips. CHED basis is copied from the master.

studyTopics is the What You’ll Study row split on semicolons, trimming only separator whitespace. interestsStrengths remains separate from overview for later UI use. careers is the Where Can This Path Lead? row split on semicolons. Every segment retains rawText; careersText retains the complete source row. No semicolon sentence was rewritten, shortened or silently discarded.

Counts: 465 career segments; 463 original salary ranges; 2 notes-only non-job segments without salary. There are 463 non-null proposed job titles and 463 non-null salaryRange fields. The two notes-only entries retain jobTitle:null, salaryRange:null and their original sentence in notes and rawText. They remain review placeholders, not invented job titles.

The source actually uses strings such as "₱15,000–₱34,000/month", with peso symbols and an en dash, rather than the literal "PHP low to high/month" form in the prompt. Original strings were retained. SalaryRange is the exact original substring, excluding sentence punctuation. Qualifications after a job title are split into notes where an explicit boundary exists. All 45 segments meeting period/licens/over-eight-word review conditions are marked reviewRequired:true and splitStatus:"proposed". No proposed title or salary association is represented as user-approved.

salary-sources.json stores the shared methodology, ten source references, interpretation notes and October 2026 update note once, outside individual courses. No per-course or per-career source was invented. Each reference label and URL comes from the DOCX. Per-role benchmark traceability, current salary accuracy and current licensure requirements remain NOT DETERMINED.

### Every career review item

The following is the complete 45-item review register; data/v2/careers-review.md also retains every raw segment and proposed JSON split. Final handling remains with the user.

#### BUS01 / segment 6

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: budget or finance staff. Becoming a Certified Public Accountant requires meeting current legal and professional requirements, including the applicable licensure examination — ₱25,000–₱59,000/month.

Proposed jobTitle: budget or finance staff
Proposed salaryRange: ₱25,000–₱59,000/month
Proposed notes: Becoming a Certified Public Accountant requires meeting current legal and professional requirements, including the applicable licensure examination.

#### ICT03 / segment 7

Triggers: title-over-eight-words.

Raw: machine learning or data roles with further study and experience — ₱55,000–₱132,000/month.

Proposed jobTitle: machine learning or data roles
Proposed salaryRange: ₱55,000–₱132,000/month
Proposed notes: with further study and experience.

#### ENG01 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: project engineer trainee. Professional practice may require passing the applicable licensure examination — ₱18,000–₱42,000/month.

Proposed jobTitle: project engineer trainee
Proposed salaryRange: ₱18,000–₱42,000/month
Proposed notes: Professional practice may require passing the applicable licensure examination.

#### ENG02 / segment 6

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: manufacturing or quality engineer. Licensure may be required for professional practice — ₱25,000–₱59,000/month.

Proposed jobTitle: manufacturing or quality engineer
Proposed salaryRange: ₱25,000–₱59,000/month
Proposed notes: Licensure may be required for professional practice.

#### ENG03 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: testing or commissioning staff. Professional practice may require licensure — ₱18,000–₱43,000/month.

Proposed jobTitle: testing or commissioning staff
Proposed salaryRange: ₱18,000–₱43,000/month
Proposed notes: Professional practice may require licensure.

#### ENG04 / segment 6

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: automation support. Licensure may be required for professional practice — ₱53,000–₱127,000/month.

Proposed jobTitle: automation support
Proposed salaryRange: ₱53,000–₱127,000/month
Proposed notes: Licensure may be required for professional practice.

#### ENG06 / segment 6

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: research or laboratory assistant. Licensure may be required for professional practice — ₱15,000–₱31,000/month.

Proposed jobTitle: research or laboratory assistant
Proposed salaryRange: ₱15,000–₱31,000/month
Proposed notes: Licensure may be required for professional practice.

#### ENG08 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: remote sensing assistant. Some professional services require licensure and authorization — ₱20,000–₱46,000/month.

Proposed jobTitle: remote sensing assistant
Proposed salaryRange: ₱20,000–₱46,000/month
Proposed notes: Some professional services require licensure and authorization.

#### ENG09 / segment 6

Triggers: period-in-title, licensure-in-title.

Raw: environmental compliance staff. Professional practice may require licensure — ₱18,000–₱43,000/month.

Proposed jobTitle: environmental compliance staff
Proposed salaryRange: ₱18,000–₱43,000/month
Proposed notes: Professional practice may require licensure.

#### ENG13 / segment 6

Triggers: title-over-eight-words.

Raw: technical instructor after meeting relevant education and qualification requirements — ₱16,000–₱39,000/month.

Proposed jobTitle: technical instructor
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting relevant education and qualification requirements.

#### ENG14 / segment 2

Triggers: title-over-eight-words.

Raw: engine-room rating or officer pathway, subject to training, certification, sea service, and applicable maritime requirements — ₱23,000–₱54,000/month

Proposed jobTitle: engine-room rating or officer pathway
Proposed salaryRange: ₱23,000–₱54,000/month
Proposed notes: , subject to training, certification, sea service, and applicable maritime requirements

#### ENG15 / segment 2

Triggers: title-over-eight-words.

Raw: seafarer career pathway toward deck officer or ship captain, subject to required education, certification, examinations, and sea service — ₱52,000–₱124,000/month

Proposed jobTitle: seafarer career pathway toward deck officer or ship captain
Proposed salaryRange: ₱52,000–₱124,000/month
Proposed notes: , subject to required education, certification, examinations, and sea service

#### SCI02 / segment 6

Triggers: period-in-title, non-job-sentence.

Raw: further study can lead to specialized research roles.

Proposed jobTitle: null
Proposed salaryRange: null
Proposed notes: further study can lead to specialized research roles.

#### SCI03 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: production or environmental laboratory staff. Some roles and professional practice require specific qualifications or licensure — ₱16,000–₱39,000/month.

Proposed jobTitle: production or environmental laboratory staff
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: Some roles and professional practice require specific qualifications or licensure.

#### SCI05 / segment 5

Triggers: title-over-eight-words.

Raw: materials or electronics testing roles, often strengthened by specialization or graduate study — ₱15,000–₱36,000/month.

Proposed jobTitle: materials or electronics testing roles
Proposed salaryRange: ₱15,000–₱36,000/month
Proposed notes: , often strengthened by specialization or graduate study.

#### SCI10 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: hazard or groundwater research assistant. Some professional roles require further qualifications or licensure — ₱15,000–₱33,000/month.

Proposed jobTitle: hazard or groundwater research assistant
Proposed salaryRange: ₱15,000–₱33,000/month
Proposed notes: Some professional roles require further qualifications or licensure.

#### AGR01 / segment 6

Triggers: period-in-title, licensure-in-title.

Raw: farm entrepreneur. Some professional roles require licensure — ₱16,000–₱39,000/month.

Proposed jobTitle: farm entrepreneur
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: Some professional roles require licensure.

#### AGR02 / segment 6

Triggers: period-in-title, licensure-in-title.

Raw: environmental program staff. Professional practice may require licensure — ₱15,000–₱34,000/month.

Proposed jobTitle: environmental program staff
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: Professional practice may require licensure.

#### HLT01 / segment 1

Triggers: title-over-eight-words.

Raw: Staff nurse after meeting graduation, examination, registration, and employment requirements — ₱18,000–₱42,000/month

Proposed jobTitle: Staff nurse
Proposed salaryRange: ₱18,000–₱42,000/month
Proposed notes: after meeting graduation, examination, registration, and employment requirements

#### HLT01 / segment 4

Triggers: title-over-eight-words.

Raw: nursing assistant roles during training or as permitted by law — ₱15,000–₱29,000/month.

Proposed jobTitle: nursing assistant roles during training or as permitted by law
Proposed salaryRange: ₱15,000–₱29,000/month
Proposed notes: null

#### HLT02 / segment 1

Triggers: licensure-in-title.

Raw: Pharmacist after meeting current licensure requirements — ₱16,000–₱39,000/month

Proposed jobTitle: Pharmacist
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting current licensure requirements

#### HLT03 / segment 1

Triggers: licensure-in-title, title-over-eight-words.

Raw: Medical laboratory professional after meeting current licensure and registration requirements — ₱20,000–₱46,000/month

Proposed jobTitle: Medical laboratory professional
Proposed salaryRange: ₱20,000–₱46,000/month
Proposed notes: after meeting current licensure and registration requirements

#### HLT03 / segment 2

Triggers: title-over-eight-words.

Raw: laboratory staff in hospitals, clinics, public health, research, or diagnostic centers — ₱15,000–₱34,000/month.

Proposed jobTitle: laboratory staff in hospitals, clinics, public health, research, or diagnostic centers
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: null

#### HLT04 / segment 1

Triggers: licensure-in-title.

Raw: Physical therapist after meeting current licensure requirements — ₱15,000–₱34,000/month

Proposed jobTitle: Physical therapist
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: after meeting current licensure requirements

#### HLT04 / segment 3

Triggers: title-over-eight-words.

Raw: sports or wellness support roles within the scope of qualifications — ₱16,000–₱39,000/month

Proposed jobTitle: sports or wellness support roles
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: within the scope of qualifications

#### HLT05 / segment 1

Triggers: licensure-in-title.

Raw: Occupational therapist after meeting current licensure requirements — ₱15,000–₱34,000/month

Proposed jobTitle: Occupational therapist
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: after meeting current licensure requirements

#### HLT06 / segment 1

Triggers: licensure-in-title.

Raw: Radiologic technologist after meeting current licensure requirements — ₱15,000–₱34,000/month

Proposed jobTitle: Radiologic technologist
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: after meeting current licensure requirements

#### HLT09 / segment 1

Triggers: licensure-in-title.

Raw: Dentist after meeting current licensure requirements — ₱27,000–₱64,000/month

Proposed jobTitle: Dentist
Proposed salaryRange: ₱27,000–₱64,000/month
Proposed notes: after meeting current licensure requirements

#### HLT10 / segment 1

Triggers: licensure-in-title.

Raw: Veterinarian after meeting current licensure requirements — ₱20,000–₱46,000/month

Proposed jobTitle: Veterinarian
Proposed salaryRange: ₱20,000–₱46,000/month
Proposed notes: after meeting current licensure requirements

#### EDU01 / segment 1

Triggers: licensure-in-title, title-over-eight-words.

Raw: Elementary school teacher after meeting applicable teacher qualification and licensure requirements — ₱16,000–₱39,000/month

Proposed jobTitle: Elementary school teacher
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting applicable teacher qualification and licensure requirements

#### EDU02 / segment 1

Triggers: licensure-in-title, title-over-eight-words.

Raw: Secondary school teacher after meeting applicable qualification and licensure requirements — ₱17,000–₱40,000/month

Proposed jobTitle: Secondary school teacher
Proposed salaryRange: ₱17,000–₱40,000/month
Proposed notes: after meeting applicable qualification and licensure requirements

#### EDU03 / segment 1

Triggers: title-over-eight-words.

Raw: Early childhood teacher or educator after meeting applicable requirements — ₱15,000–₱34,000/month

Proposed jobTitle: Early childhood teacher or educator
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: after meeting applicable requirements

#### EDU05 / segment 1

Triggers: title-over-eight-words.

Raw: Fitness trainer or exercise program staff, subject to relevant credentials — ₱15,000–₱34,000/month

Proposed jobTitle: Fitness trainer or exercise program staff
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: , subject to relevant credentials

#### EDU06 / segment 1

Triggers: title-over-eight-words.

Raw: Arts or culture education teacher after meeting applicable requirements — ₱16,000–₱39,000/month

Proposed jobTitle: Arts or culture education teacher
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting applicable requirements

#### EDU07 / segment 1

Triggers: title-over-eight-words.

Raw: Technology and livelihood education teacher after meeting applicable requirements — ₱16,000–₱39,000/month

Proposed jobTitle: Technology and livelihood education teacher
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting applicable requirements

#### EDU08 / segment 1

Triggers: title-over-eight-words.

Raw: Technical-vocational instructor after meeting applicable education, industry, and certification requirements — ₱16,000–₱39,000/month

Proposed jobTitle: Technical-vocational instructor
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: after meeting applicable education, industry, and certification requirements

#### SOC01 / segment 6

Triggers: period-in-title, title-over-eight-words, non-job-sentence.

Raw: further study is generally needed for specialized psychology and clinical roles.

Proposed jobTitle: null
Proposed salaryRange: null
Proposed notes: further study is generally needed for specialized psychology and clinical roles.

#### SOC10 / segment 1

Triggers: licensure-in-title.

Raw: Librarian after meeting applicable qualification and licensure requirements — ₱15,000–₱34,000/month

Proposed jobTitle: Librarian
Proposed salaryRange: ₱15,000–₱34,000/month
Proposed notes: after meeting applicable qualification and licensure requirements

#### SOC11 / segment 1

Triggers: title-over-eight-words.

Raw: Criminology-related roles and public safety career pathways subject to recruitment rules — ₱16,000–₱39,000/month

Proposed jobTitle: Criminology-related roles and public safety career pathways
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: subject to recruitment rules

#### SOC11 / segment 4

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: crime research assistant. Professional criminologist practice requires applicable licensure — ₱15,000–₱33,000/month.

Proposed jobTitle: crime research assistant
Proposed salaryRange: ₱15,000–₱33,000/month
Proposed notes: Professional criminologist practice requires applicable licensure.

#### SOC13 / segment 5

Triggers: title-over-eight-words.

Raw: presenter or reporter pathway based on skills and opportunities — ₱16,000–₱39,000/month

Proposed jobTitle: presenter or reporter pathway
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: based on skills and opportunities

#### ART03 / segment 8

Triggers: title-over-eight-words.

Raw: UI or digital design assistant with relevant portfolio skills — ₱23,000–₱54,000/month.

Proposed jobTitle: UI or digital design assistant
Proposed salaryRange: ₱23,000–₱54,000/month
Proposed notes: with relevant portfolio skills.

#### ART04 / segment 5

Triggers: period-in-title, title-over-eight-words.

Raw: visual merchandising assistant. Professional practice may require meeting applicable registration rules — ₱16,000–₱39,000/month.

Proposed jobTitle: visual merchandising assistant
Proposed salaryRange: ₱16,000–₱39,000/month
Proposed notes: Professional practice may require meeting applicable registration rules.

#### ART05 / segment 5

Triggers: period-in-title, title-over-eight-words.

Raw: environmental design staff. Professional practice may require applicable registration — ₱18,000–₱43,000/month.

Proposed jobTitle: environmental design staff
Proposed salaryRange: ₱18,000–₱43,000/month
Proposed notes: Professional practice may require applicable registration.

#### ART06 / segment 5

Triggers: period-in-title, licensure-in-title, title-over-eight-words.

Raw: planning support. Becoming a licensed architect requires meeting current education, experience, and licensure requirements — ₱18,000–₱43,000/month.

Proposed jobTitle: planning support
Proposed salaryRange: ₱18,000–₱43,000/month
Proposed notes: Becoming a licensed architect requires meeting current education, experience, and licensure requirements.

## Task 3 - school rows and reverse index

schools.json retains one record per PDF table row: 51 rows total, consisting of 16 Bicol public-SUC rows, 18 community-college rows, 4 Bicol private rows and 13 national rows. These are source-row counts, not a count of distinct physical institutions or campuses: several rows contain multiple campuses or multiple institutions. Such rows were not split into invented allocations. The original label, location, program and source cells are retained in sourceCells; programText preserves the program cell after joining layout line wraps.

The 297 coded school/course links cover all 85 master IDs. courseIds contains only explicit codes in that row, except for the explicitly uncertain CBSUA ENG12 reference, which is excluded and preserved in excludedMappings and schools-review.md. Uncoded programs remain verbatim in programNotes. No Midwifery, Sanitary Engineering, Special Needs Education, Agribusiness or other new program code was invented.

schools-by-course.json contains all 85 course IDs. Lists are ordered by Bicol public-SUC, Bicol community college, Bicol private, national, preserving PDF row order within each class. No distance or inferred travel ordering is used.

Source level counts: official 31; secondary 14; weak 5; none 1. Official is nominal source classification from the supplied institutional/CHED/LGU/accreditor citation; it is not independent confirmation or a guarantee that a citation supports every program. Weak includes explicitly weak rows and unresolved citation identity. All abbreviations, mixed citations and original source strings remain visible for review. The sourceNames fields do not contain invented expanded URLs.

Flag counts (a row may have several): derived-location 32; major-only 21; new-program 4; outdated 4; partial 11; unverified 31; weak-source 5.

Flag definitions: partial means incomplete program list or campus allocation; weak-source means explicitly weak evidence or unresolved citation identity; outdated means the row relies in part on explicitly older/historical information; unverified preserves an explicit verification gap; derived-location marks community-college locations and municipality-based province derivation; new-program preserves the source’s new-program wording; major-only marks one or more offerings specified only as majors/specializations. It does not imply every program in the row is major-only. Original Filipino remarks for every flag appear next to that flag in data/v2/schools-review.md; none were replaced by translated prose.

### Every school-row review item

This indexes all 51 rows; the full original Filipino flag evidence and every uncoded program snippet are in data/v2/schools-review.md. Rows without flags are included to keep the review inventory complete.

- SCH-001: Bicol University — Legazpi - West; PDF page 1, row 1; sourceLevel official; flags derived-location, unverified, major-only; 20 codes; 0 programNotes.
- SCH-002: Bicol University — Legazpi - East; PDF page 1, row 2; sourceLevel official; flags derived-location, unverified; 10 codes; 0 programNotes.
- SCH-003: Bicol University — Daraga; PDF page 1, row 3; sourceLevel official; flags derived-location, unverified; 9 codes; 0 programNotes.
- SCH-004: Bicol University — Guinobatan; PDF page 1, row 4; sourceLevel official; flags derived-location, unverified; 7 codes; 0 programNotes.
- SCH-005: Bicol University — Tabaco; PDF page 1, row 5; sourceLevel official; flags derived-location, unverified, major-only; 6 codes; 0 programNotes.
- SCH-006: Bicol University — Gubat (Sorsogon); PDF page 1, row 6; sourceLevel official; flags unverified, major-only; 4 codes; 0 programNotes.
- SCH-007: Bicol University — Polangui; PDF page 1, row 7; sourceLevel official; flags derived-location, unverified, major-only; 11 codes; 0 programNotes.
- SCH-008: Sorsogon State University — Bulan; PDF page 1, row 1; sourceLevel official; flags derived-location, unverified; 8 codes; 0 programNotes.
- SCH-009: Sorsogon State University — Magallanes; PDF page 1, row 2; sourceLevel official; flags unverified; 1 codes; 0 programNotes.
- SCH-010: Sorsogon State University — Sorsogon City; PDF page 1, row 3; sourceLevel official; flags derived-location, partial, unverified, major-only; 1 codes; 2 programNotes.
- SCH-011: Sorsogon State University — Castilla; PDF page 1, row 4; sourceLevel official; flags derived-location, major-only, new-program; 1 codes; 2 programNotes.
- SCH-012: Camarines Sur Polytechnic Colleges (CSPC) / Polytechnic State University of Bicol (PSUB); PDF page 2, row 1; sourceLevel secondary; flags partial, major-only; 25 codes; 2 programNotes.
- SCH-013: Partido State University (ParSU); PDF page 2, row 2; sourceLevel official; flags partial; 23 codes; 6 programNotes.
- SCH-014: Catanduanes State University (CatSU); PDF page 2, row 3; sourceLevel official; flags none; 31 codes; 2 programNotes.
- SCH-015: Central Bicol State University of Agriculture (CBSUA) — Pili (main), Calabanga, Pasacao, Sipocot; PDF page 2, row 4; sourceLevel official; flags partial, unverified, outdated, new-program; 9 codes; 7 programNotes.
- SCH-016: University of Camarines Norte (UCN, dating CNSC); PDF page 2, row 5; sourceLevel official; flags partial, unverified, outdated; 22 codes; 2 programNotes.
- SCH-017: UST-Legazpi; PDF page 3, row 1; sourceLevel official; flags derived-location, unverified; 3 codes; 0 programNotes.
- SCH-018: Mariners' Polytechnic Colleges — Naga, Canaman, Legazpi; PDF page 3, row 2; sourceLevel weak; flags weak-source, unverified; 2 codes; 0 programNotes.
- SCH-019: Ateneo de Naga University; PDF page 3, row 3; sourceLevel official; flags derived-location, partial; 9 codes; 1 programNotes.
- SCH-020: University of Nueva Caceres; PDF page 3, row 4; sourceLevel official; flags derived-location, partial; 4 codes; 1 programNotes.
- SCH-021: Daraga Community College; PDF page 3, row 1; sourceLevel official; flags derived-location, major-only, new-program; 6 codes; 0 programNotes.
- SCH-022: Ligao Community College; PDF page 3, row 2; sourceLevel secondary; flags derived-location, major-only; 4 codes; 1 programNotes.
- SCH-023: Polangui Community College; PDF page 3, row 3; sourceLevel secondary; flags derived-location, major-only; 6 codes; 1 programNotes.
- SCH-024: Libon Community College; PDF page 3, row 4; sourceLevel secondary; flags derived-location, partial, major-only; 2 codes; 3 programNotes.
- SCH-025: Oas Community College; PDF page 3, row 5; sourceLevel weak; flags derived-location, weak-source, unverified, partial, major-only; 2 codes; 1 programNotes.
- SCH-026: Tiwi Community College; PDF page 3, row 6; sourceLevel secondary; flags derived-location; 3 codes; 0 programNotes.
- SCH-027: San Jose Community College; PDF page 4, row 1; sourceLevel weak; flags derived-location, weak-source, unverified, partial, outdated; 2 codes; 3 programNotes.
- SCH-028: Community College of Manito; PDF page 4, row 2; sourceLevel official; flags derived-location, major-only; 3 codes; 0 programNotes.
- SCH-029: Donsol Community College; PDF page 4, row 3; sourceLevel secondary; flags derived-location, major-only; 1 codes; 0 programNotes.
- SCH-030: Baao Community College (ngayon Rinconada State College); PDF page 4, row 4; sourceLevel official; flags derived-location, major-only; 4 codes; 2 programNotes.
- SCH-031: Calabanga Community College; PDF page 4, row 5; sourceLevel secondary; flags derived-location, major-only; 4 codes; 0 programNotes.
- SCH-032: Gov. Mariano E. Villafuerte Community College (GMVCC) — Libmanan; PDF page 4, row 6; sourceLevel official; flags derived-location, major-only; 1 codes; 0 programNotes.
- SCH-033: GMVCC — Garchitorena; PDF page 4, row 7; sourceLevel official; flags derived-location, major-only; 2 codes; 1 programNotes.
- SCH-034: GMVCC — Siruma; PDF page 4, row 8; sourceLevel secondary; flags derived-location, outdated, major-only; 2 codes; 0 programNotes.
- SCH-035: Caramoan Community College; PDF page 4, row 9; sourceLevel secondary; flags derived-location, major-only; 3 codes; 0 programNotes.
- SCH-036: City College of Naga; PDF page 4, row 10; sourceLevel weak; flags derived-location, weak-source, unverified, partial; 0 codes; 1 programNotes.
- SCH-037: Aroroy Municipal College; PDF page 4, row 11; sourceLevel secondary; flags derived-location, major-only; 2 codes; 1 programNotes.
- SCH-038: San Pascual Polytechnic College; PDF page 4, row 12; sourceLevel secondary; flags derived-location, unverified; 0 codes; 1 programNotes.
- SCH-039: UP Diliman — Diliman; PDF page 5, row 1; sourceLevel official; flags unverified; 12 codes; 0 programNotes.
- SCH-040: UP Los Banos — Los Banos; PDF page 5, row 2; sourceLevel official; flags derived-location, unverified; 5 codes; 0 programNotes.
- SCH-041: UP Manila — Manila; PDF page 5, row 3; sourceLevel official; flags unverified, new-program; 4 codes; 0 programNotes.
- SCH-042: University of Santo Tomas — Manila; PDF page 5, row 4; sourceLevel secondary; flags unverified; 3 codes; 0 programNotes.
- SCH-043: Ateneo de Manila University; PDF page 5, row 5; sourceLevel official; flags unverified; 1 codes; 0 programNotes.
- SCH-044: De La Salle-College of Saint Benilde; PDF page 5, row 6; sourceLevel official; flags unverified; 1 codes; 0 programNotes.
- SCH-045: De La Salle University; PDF page 5, row 7; sourceLevel official; flags unverified; 1 codes; 0 programNotes.
- SCH-046: Ateneo de Davao University; PDF page 5, row 8; sourceLevel weak; flags weak-source, unverified; 1 codes; 0 programNotes.
- SCH-047: Northwestern University — Laoag; PDF page 5, row 9; sourceLevel official; flags derived-location, unverified; 9 codes; 0 programNotes.
- SCH-048: Davao Doctors College; PDF page 5, row 10; sourceLevel secondary; flags unverified; 3 codes; 0 programNotes.
- SCH-049: Philippine Merchant Marine Academy; PDF page 5, row 11; sourceLevel secondary; flags unverified; 2 codes; 0 programNotes.
- SCH-050: Far Eastern University, Philippine Women's University, University of San Carlos; PDF page 5, row 12; sourceLevel official; flags unverified; 1 codes; 0 programNotes.
- SCH-051: Tarlac State University, Eastern Visayas State University, St. Alexius College; PDF page 5, row 13; sourceLevel none; flags unverified; 1 codes; 0 programNotes.

### Mapping and source decisions requiring review

- SCH-015 CBSUA: excluded ENG12 because the PDF says "BS Agricultural Engineering (kaugnay ng ENG12; hindi sigurado kung pareho ang pangalan ng program)". BS Fisheries (Calabanga) also has no AGR03 code in this row, so it remains programNotes. The source is a SY 2020-2021 graduates article; the old date and new-program wording are retained together.

- SCH-024 Libon: BSEd and BTVTEd are named without EDU02/EDU08, so those codes were not inserted. "AT" remains unexpanded. SCH-027 San Jose: BSEd is likewise uncoded, so EDU02 was not inserted; a historical two-year BA/Diploma permission was not made into a current degree link.

- SCH-025 Oas, SCH-027 San Jose and SCH-036 City College of Naga retain weak-source. SCH-034 Siruma retains outdated for 2018 information. SCH-038 San Pascual has no degree code; all original TESDA-only information is in notes. SCH-036 also has no coded degree mapping because Midwifery has no master code. These two rows are retained even though they add no course-index links.

- SCH-030 Baao/Rinconada is kept once in community-college, following the PDF’s Section C placement and its stated conditional conversion. Current legal effectiveness was not independently determined. CSPC/PSUB and UCN/CNSC names are retained as the source gives them, not duplicated as new schools.

- SCH-012 CSPC/PSUB, SCH-013 ParSU, SCH-015 CBSUA, SCH-016 UCN and SCH-018 Mariners’ aggregate campuses. Row-level course unions must not be treated as proof that every program is offered at every campus. programText retains the original per-campus wording where it exists.

- SCH-018 Mariners’ explicitly codes Marine Engineering but describes facilities at Canaman. The coded reference is transcribed with weak-source/unverified flags; facilities alone have not been independently confirmed as current degree-program availability.

- SCH-046 pairs "Ateneo de Davao University" with source "adzu". The source identity is unresolved and classified weak; no corrected school or URL was guessed. SCH-050 lists three universities, says "Parehong", and cites only "feu". SCH-051 lists three institutions but has a blank source cell (sourceLevel none). Both combined national rows remain one source row each.

- The PDF says old BU, SorSU Bulan/Magallanes, UST-Legazpi, Mariners’ and national rows were copied without re-verification. Those rows retain unverified. New-program does not mean independently confirmed current admission availability.

- No source-row records were invented for narrative-only omissions: DEBESMSCAT; BISCAST/SEAIT; Sorsogon Community College; Rapu-Rapu Community College; GMVCC-Tinambac; Bicol College; Aquinas University; Naga College Foundation; Divine Word College of Legazpi. The source explicitly reports missing/unsearched information or exclusion; raw narrative remarks are retained in schools-review.md.

### Locations and NOT DETERMINED fields

Community-college location cells are retained as the PDF prints them and flagged derived-location under its note: "Ang Lugar ay base sa pangalan ng bayan o lungsod at hindi nakasaad sa source." This is a statement about the PDF author’s location derivation, not an assertion that the upstream school source provides an address. Province is copied when present or derived only from unambiguous named localities; these derivations are flagged. No street addresses, coordinates, distances or inferred campus allocations were added.

Province remains null for 14 rows: SCH-009, SCH-015, SCH-018, SCH-039, SCH-041, SCH-042, SCH-043, SCH-044, SCH-045, SCH-046, SCH-048, SCH-049, SCH-050, SCH-051. Magallanes alone is ambiguous; mixed-campus rows and non-province city/institution names were not assigned a guessed province. Location may separately be null where no clear locality/address is stated. Null is an uncertainty marker, not a claim that a school has no province or campus.

### Coverage claims and discrepancies

The literal 85/85 coded coverage claim is reproduced after excluding the uncertain CBSUA ENG12 reference, because ENG12 still has BU Guinobatan. There is no missing master course in the reverse index. However, the PDF’s wording "may direct source" is not established as 85/85 current verified official program evidence. Abbreviations, weak/secondary/blank sources, aggregate rows and explicit copied/unverified data prevent that stronger conclusion. ART01 and ART04 have only the secondary-source UST row in this dataset; all other courses have at least one nominal official-source row, without independent confirmation.

The PDF gives BUS02, ENG10, ENG11 and ART03 as examples of thin single-school evidence. It does not say those four are exhaustive. The complete extraction has 27 courses with one school source row: BUS02, ENG06, ENG07, ENG08, ENG10, ENG11, ENG12, SCI03, SCI04, SCI05, SCI08, SCI11, HLT02, HLT07, HLT09, SOC06, SOC07, SOC08, SOC13, SOC14, SOC17, SOC18, ART01, ART02, ART03, ART04, ART05. Thus 23 additional single-row cases are reported here without treating the source’s example list as an exhaustive-count claim. The min/max are 1 and 18 source rows per course.

Other source/prompt discrepancies: filename v1 versus internal v3; peso/en-dash salary strings versus the prompt’s PHP notation; 465 semicolon segments versus 463 ranges because two segments are notes-only sentences. All original data was retained rather than silently normalized.

Still NOT DETERMINED: user fit approval for eight legacy stems; final handling of all 45 career splits; per-role salary attribution/current accuracy; current licensure conditions; current actual school offerings; the identity/authority of abbreviation-only citations; blank national-row provenance; per-campus allocation of aggregate rows; unnamed programs/majors; expansion of Libon AT; current conditional state-college status; and fields deliberately left null. Structural verification does not resolve these questions.

## Task 4 - verifier and results

scripts/verify-details.mjs is portable relative to its own file path and exits nonzero on missing/invalid files or failed checks. It checks exact master ID coverage, all five retained source fields, study/career splits, original salary substrings and counts, CHED basis, flags/source levels, explicit coded mappings, uncertain-mapping exclusion, reverse membership/order and copied prompts. It prints single-school cases. Source text counts are calculated from the retained original careersText strings, not merely trusted from metadata; the DOCX authoring check separately compared every original cell.

Executed `node scripts/verify-details.mjs`:

```text
PASS: course-details and schools-by-course contain exactly the 85 master IDs.
PASS: all five source text fields are nonempty for every course; CHED basis and exact text splits match.
PASS: 463 parsed salary ranges = 463 source ranges; 465 segments; 2 without salary; 45 proposed splits flagged.
PASS: 51 school source rows; 297 valid school/course links; all 85 courses covered; uncertain CBSUA ENG12 excluded.
PASS: school flags, explicit course codes, ordered reverse index and 8 exact interest prompts verified.
Schools per course (source rows): min=1, max=18.
Courses with only 1 school source row (27): BUS02, ENG06, ENG07, ENG08, ENG10, ENG11, ENG12, SCI03, SCI04, SCI05, SCI08, SCI11, HLT02, HLT07, HLT09, SOC06, SOC07, SOC08, SOC13, SOC14, SOC17, SOC18, ART01, ART02, ART03, ART04, ART05.
NOTE: structural coverage does not establish current official offerings; source and split reviews remain pending.
```

A disposable copy outside the repository with BUS01’s first salary removed exited 1 and reported the missing source salary and parsed/source mismatch 462/463. Delivered data was not mutated. Targeted ESLint for scripts/verify-details.mjs passed with exit 0 and no findings. The existing link verifier also passed. Its existing warning about stems absent from the rubric is historical; the requested current-bank fallback is now in prompt, without changing that protected script.

The full existing regression suite passed after the prompt additions:

```text
tests 56
pass 56
fail 0
cancelled 0
skipped 0
todo 0
```

## Task 5 - deliverables and final preservation

Created nine files:

- data/v2/course-details.json
- data/v2/careers-review.md
- data/v2/salary-sources.json
- data/v2/schools.json
- data/v2/schools-review.md
- data/v2/schools-by-course.json
- scripts/verify-details.mjs
- docs/interest-stems-review.md
- docs/details-schools-report.md

Existing-file exception: data/v2/items.json received only eight prompt additions, as explicitly requested. All other pre-existing file contents are unchanged from the phase-start baseline. The visible package.json modification and other Prompt 20/21 untracked artifacts pre-date this phase and were preserved. No app/, components/, lib/ or old data/*.json file was edited. No UI changed and no commit was made.

The final git status is shown in the chat; it includes earlier uncommitted work as well as this phase’s deliverables.
