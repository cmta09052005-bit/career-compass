# Career Compass: Curriculum Upgrade Plan

**Old and New SHS Curriculum Support**

| | |
|---|---|
| Document | `docs/curriculum-upgrade-plan.md` |
| Version | 1.0 (draft for approval) |
| Date | October 20, 2026 |
| Owner | Charlene Mae T. Adille (with Juno Alligah B. Romano) |
| Status | Waiting for approval of the decisions in Section 6 |
| Scope | Curriculum support only. Adding more courses and revising the capstone paper are separate tasks (Section 12). |

This document is the single source of truth for the curriculum upgrade, in the same way the Theme Bible and the site map are for the rest of the system. If this document and any prompt disagree, this document wins. Update this document first, then the prompts.

---

## 1. Purpose

Senior High School now has two curricula running at the same time. Career Compass was built only for the old one. It asks every student to choose a strand, but students in the new curriculum have no strand.

This upgrade makes Career Compass work correctly for both groups:

1. **Old curriculum students** keep the flow they know. GAS is added as a strand.
2. **New curriculum students** get a flow that fits them. Elective clusters take the place of the strand, and the subject choices in the Valley match the subjects they actually study.

**Success means:** every student can finish the assessment with answers that make sense for their own program, and the old flow still gives exactly the same results as before (except for the new GAS option).

---

## 2. Policy facts the system relies on

These facts come from DepEd documents. Re-check them against DepEd's website before the capstone paper is finalized.

| Fact | Source |
|---|---|
| The pilot of the Strengthened SHS Curriculum ran in Grade 11 only, in SY 2025–2026. | DepEd Memorandum No. 048, s. 2025 |
| DepEd first announced 841 pilot schools (580 public, 261 private). A later DepEd advisory refers to 891 pilot schools. | GMA Integrated News, May 19, 2025; DepEd advisory, July 28, 2025 |
| DepEd Memorandum No. 012, s. 2026 (February 27, 2026) orders full implementation in Grade 11 starting SY 2026–2027, in public and private schools. | DepEd, 2026 |
| In SY 2026–2027, Grade 12 learners in non-pilot schools continue with the existing curriculum. Pilot schools extend the new curriculum to Grade 12. | DepEd Strengthened SHS Program page; Philstar, March 4, 2026 |
| There are two tracks: Academic and TechPro (TechPro replaces TVL). Arts and Design and Sports electives are now under the Academic Track. | DepEd Key Features, 2026 |
| There are no strands. Learners take 5 core subjects and choose electives. Electives are grouped into clusters. Clusters are not strands. | DepEd Key Features, 2026 |
| Learners may take electives from any cluster, including clusters outside their track. Schools do not have to offer every elective in a cluster. | DepEd Key Features, 2026 |
| Academic clusters (5): Arts, Social Sciences, and Humanities; Business and Entrepreneurship; STEM; Sports, Health, and Wellness; Field Experience. | DepEd Key Features, 2026 |
| TechPro clusters (10): Aesthetic, Wellness, and Human Care; Agri-Fishery Business and Food Innovation; Artisanry and Creative Enterprise; Automotive and Small Engine Technologies; Construction and Building Technologies; Creative Arts and Design Technologies; Hospitality and Tourism; ICT Support and Computer Programming Technologies; Industrial Technologies; Maritime Transport. | DepEd Key Features, 2026 |
| The 5 core subjects are Effective Communication (Mabisang Komunikasyon), General Mathematics, General Science, Life and Career Skills, and Pag-aaral ng Kasaysayan at Lipunang Pilipino. | DepEd Key Features, 2026 |
| DepEd tells schools to give career guidance and encourages tools like interest inventories. Guidance must support learners and must not force a career path. | DepEd Memorandum No. 048, s. 2025 |

**Glossary**

- **Strand:** a fixed set of subjects in the old Academic Track (STEM, ABM, HUMSS, GAS).
- **Cluster:** a group of related electives in the new curriculum. A learner is not locked into one.
- **Track:** the broad pathway. Old: Academic, TVL, Arts and Design, Sports. New: Academic, TechPro.
- **Core subjects:** subjects every learner takes. Old: 15. New: 5.
- **Pilot school:** a school that tested the new curriculum in SY 2025–2026.

---

## 3. How the system works today

This section is based on the Codex read-only report (October 2026). Codex should confirm any detail before changing it.

### 3.1 Strand

- The intake offers six strand values: `Academic-STEM`, `Academic-ABM`, `Academic-HUMSS`, `TVL`, `Arts & Design`, `Sports`. Defined in `app/intake/page.js` (line 19).
- GAS is missing. Strand is required to continue.
- The strand list is duplicated in `data/items.json` (item `ACA-01`). Validation reads that list. Scoring reads `lib/weightTable.js`. If the two differ, validation and scoring disagree.

| Strand | Categories boosted |
|---|---|
| Academic-STEM | C1, C2, C5 |
| Academic-ABM | C3 |
| Academic-HUMSS | C4 |
| TVL | C2 |
| Arts & Design | C6 |
| Sports | C5 |

### 3.2 Categories

| ID | Category | Maximum raw points |
|---|---|---|
| C1 | Information Technology & Computing | 25 |
| C2 | Engineering & Technology | 24 |
| C3 | Business Administration & Related | 25 |
| C4 | Education Science & Teacher Training | 28 |
| C5 | Medical & Allied Health Sciences | 30 |
| C6 | Architecture, Fine Arts & Design | 26 |

### 3.3 How points are earned

| Source | Points |
|---|---|
| Interests (8 questions) | +3 to one category per answer |
| Skills (10 items) | Rating 4 or 5 gives +2 to the mapped category. Ratings 1–3 give 0. |
| Strand | +2 to each mapped category (`STRAND_WEIGHTS`) |
| General average | 90 or higher: +2 each to C1, C2, C5. 85 to 89: +1 each to C1, C2, C5. Below 85: 0. |
| Best subjects | +2 per subject. Only the first 3 unique valid subjects count. |

Name, nickname, year level and explorer choice give no points.

### 3.4 The scoring formula (this does not change)

```
category % = raw category points ÷ category maximum × 100

course score = round( min( 100,
    0.88 × category %          (unrounded)
    + A   primary signal       (subject +6; skill 5 → +6, skill 4 → +4)
    + B   strand alignment     (+2 if the strand maps to the course's category)
    + C   general average      (+2 / +1 on C1, C2, C5 courses; 0 on C3, C4, C6)
    + D   secondary signal     (subject +2; skill 5 → +2, skill 4 → +1)
) )
```

- Each course has a hard-coded primary and secondary signal in `lib/scoringEngine.js`.
- Ranking order: calculated percentage, then unrounded score, then course name A to Z.
- The strand's total value on a course in its mapped category, before rounding, is `0.88 × (2 ÷ category max × 100) + 2`:

| Category | Strand value on a course (points) |
|---|---|
| C1 | 9.04 |
| C2 | 9.33 |
| C3 | 9.04 |
| C4 | 8.29 |
| C5 | 7.87 |
| C6 | 8.77 |

### 3.5 Best subjects

There are 12 subject choices. The scoring engine matches them by their label text, so the label is the key.

| Subject (key) | Category |
|---|---|
| Computer/ICT | C1 |
| Statistics/Research | C1 |
| Physics | C2 |
| TVL-Industrial Arts | C2 |
| Business Math/Accounting | C3 |
| Economics/Entrepreneurship | C3 |
| English/Communication Arts | C4 |
| Filipino/Araling Panlipunan | C4 |
| Biology/General Science | C5 |
| PE & Health | C5 |
| MAPEH-Arts | C6 |
| TVL-Arts & Design | C6 |

### 3.6 Results and PDF

- Results show the top 4 first. "See All N Courses" is dynamic.
- The PDF includes 4 ranked courses and detail for the top course only.
- The results page and PDF print the strand text that was supplied.

---

## 4. Design rules (non-negotiable)

1. **The formula does not change.** Only the inputs that feed slot B and the category points change (Section 7).
2. **Category maximums do not change** (C1 25, C2 24, C3 25, C4 28, C5 30, C6 26).
3. **Internal keys do not change.** The 12 subject keys and the strand keys stay as they are. New values are added. Old values are never renamed.
4. **The old flow gives identical results**, except for the new GAS option.
5. **One source of truth.** Strand and cluster lists must match across intake, `items.json` and `weightTable.js`. An automatic check enforces this.
6. **Plain words.** Every student-facing sentence must be easy for a Grade 11 student.
7. **No new dependencies.** Follow `AGENTS.md`, the locked palette and fonts, and the "assessment, never region" rule.
8. **Session-based only.** No accounts, no database, progress saved on the device.
9. **Old saved sessions still load** (treated as old curriculum).
10. **Nothing blocks a student.** Wrong guesses are fixable with a Back or Change link. The system never rejects a combination such as Grade 12 with the new curriculum (pilot schools do this).

---

## 5. Target flow

### 5.1 End-to-end flow

```
Trailhead (landing page)
   │  [START YOUR JOURNEY]
   ▼
Basecamp (intake)
   │
   ├─ Screen B0  "Which school program are you in?"
   │        ├─ New curriculum ───────────────┐
   │        ├─ Old curriculum ──────┐        │
   │        └─ Not sure? (help text; cannot continue until a card is chosen)
   │                                 │        │
   │        B1-old                   │        B1-new
   │        name / nickname          │        name / nickname
   │        grade level (11 or 12)   │        grade level (11 or 12)
   │        strand (7 options,       │        electives: pick up to 2 clusters,
   │        including GAS)           │        or "Not sure yet"
   │        explorer                 │        explorer
   ▼                                 ▼
The Atlas (journey map)
   ├─ Mountains (interests)       unchanged for both
   ├─ Forest (skills)             unchanged for both
   └─ Valley (academics)
         step 1 of 2: general average   unchanged for both
         step 2 of 2: best subjects     old labels (old) / new labels (new)
   ▼
Summit (results)
   top 4 courses, "See All", same ranking method
   shows "Old curriculum: <strand>"  or  "New curriculum: <clusters>"
   ▼
Islands (course details) and PDF
   same as today; PDF shows the curriculum line
```

### 5.2 Screen B0: curriculum question

| Item | Content |
|---|---|
| Title | Which school program are you in? |
| Helper line | This helps us ask the right questions. |
| Card 1 | **New curriculum.** I picked electives. I do NOT have a strand like STEM or ABM. |
| Card 2 | **Old curriculum.** I am in a strand like STEM, ABM, HUMSS, GAS, TVL, Arts & Design or Sports. |
| Help link | Not sure? Tap here. |
| Help text | Look at your subjects. Biology 1, Business 1 or Creative Composition mean the new curriculum. Oral Communication or Earth and Life Science mean the old curriculum. You can also ask your teacher. |
| Button | Continue (disabled until a card is chosen) |

Rules: both cards keyboard-selectable with a visible focus ring. English and Filipino versions. A "Change" link on screen B1 returns here, and changing the answer clears the fields that belong to the other path.

### 5.3 Screen B1-old (old curriculum)

The existing intake. The only change is that GAS is added as a seventh strand option.

| Value (key) | Shown as |
|---|---|
| Academic-STEM | Academic – STEM |
| Academic-ABM | Academic – ABM |
| Academic-HUMSS | Academic – HUMSS |
| Academic-GAS (new) | Academic – GAS (General Academic) |
| TVL | TVL |
| Arts & Design | Arts & Design |
| Sports | Sports |

GAS adds no points and no bonus.

### 5.4 Screen B1-new (new curriculum)

Same fields as the old intake, except the strand field is replaced by an electives question.

| Item | Content |
|---|---|
| Question | Which kinds of elective subjects are you taking? Pick up to 2. |
| Group label 1 | Academic electives |
| Group label 2 | TechPro (skills) electives |
| Option (not sure) | I'm not sure yet. (Choosing it clears the others. Choosing another clears it.) |

| Cluster ID | Card title | Plain description |
|---|---|---|
| `stem` | STEM | Science, math, technology. Like Biology, Chemistry, Physics, Finite Mathematics. |
| `business` | Business and Entrepreneurship | Like Basic Accounting, Business Economics, Marketing, Entrepreneurship. |
| `arts-ss-hum` | Arts, Social Sciences, and Humanities | Like Literature, Creative Composition, Arts, Philippine Governance. |
| `sports-health` | Sports, Health, and Wellness | Like Physical Education, Human Movement, Sports Coaching. |
| `field-exp` | Field Experience | Like work immersion and field exposure. |
| `techpro-ict` | TechPro: ICT and Programming | Like Computer Programming and Computer Systems Servicing. |
| `techpro-industrial` | TechPro: Industrial Technologies | Like Electrical Installation, Mechatronics, Air-Conditioning Servicing. |
| `techpro-hospitality` | TechPro: Hospitality and Tourism | Like Kitchen Operations, Tourism Services, Hotel Operations. |
| `techpro-creative` | TechPro: Creative Arts and Design | Like Animation, Illustration, Visual Graphic Design. |
| `techpro-other` | Other TechPro | Any other TechPro cluster (for example Agri-Fishery, Automotive, Construction, Caregiving, Maritime). |
| `not-sure` | I'm not sure yet | You can still finish. Your results will use your interests, skills and grades only. |

The new-curriculum student's saved record has `curriculum = "new"`, `strand = "Strengthened-SHS"` (a zero-bonus value) and `clusters = [ ...cluster IDs ]`.

### 5.5 Valley, step 2 (best subjects)

The student still picks 1 to 3 subjects. The internal keys and the scoring are identical in both flows. Only the text the student sees changes (Section 8).

### 5.6 Results, PDF and other screens

| Screen | Change |
|---|---|
| Results | Show "Old curriculum: <strand>" or "New curriculum: <cluster names>". Ranking, top 4 and "See All" work as today. |
| PDF | The same curriculum line. No other change. |
| Journey Guide | Update any text that mentions strands so it makes sense for both groups. |
| Tutorial | Check every step for strand wording. |
| About and How It Works | Mention that Career Compass supports the old curriculum and the new curriculum. Do not change the "24 courses" count (that belongs to the course task). |
| Filipino | Add Filipino text for every new screen and label. |
| Settings, Offline Mode | No change to behavior. See the offline update check in Section 11. |

### 5.7 Edge cases

| Situation | Behavior |
|---|---|
| Student picks the wrong program | "Change" link returns to B0. The other path's fields are cleared. |
| Grade 12 + new curriculum | Allowed (pilot schools). |
| Grade 11 + old curriculum | Allowed (never blocked). |
| New curriculum, "I'm not sure yet" | Allowed. Zero bonus. |
| Two clusters that overlap in categories | The category is boosted once (Section 7.2). |
| Old saved session with no curriculum field | Loads as old curriculum. |
| Restart or Replay tutorial | Works in both flows. |
| Offline user opens the updated app | Sees the existing "update available" behavior (report if it does not). |

---

## 6. Decisions to approve

Nothing below is built until it is approved. Mark each as Approved or Changed.

| # | Decision | Recommendation | Status |
|---|---|---|---|
| D1 | Wording and placement of the curriculum question (Section 5.2) | As written | To confirm |
| D2 | Cluster-to-category table (Section 7.2) | As written | **To confirm** |
| D3 | How many clusters a student may pick | Up to 2 (see the note below the table) | **To confirm** |
| D4 | TechPro options | Four mapped TechPro options plus "Other TechPro" with no bonus | **To confirm** |
| D5 | "I'm not sure yet" gives no bonus | Yes | To confirm |
| D6 | Subjects: change display text only, keep internal keys | Yes | To confirm |
| D7 | New-curriculum students are stored with the zero-bonus strand value `Strengthened-SHS`, with clusters in a separate field | Yes | To confirm |
| D8 | Grade level options stay 11 and 12 in both flows | Yes | To confirm |

**Note on D3.** One old strand boosts at most 3 categories. Two clusters can boost up to 5 categories (for example STEM plus Arts, Social Sciences, and Humanities boosts C1, C2, C5, C4, C6). The maximum per category does not change, but a bonus spread over many categories separates courses less. Two options: (A) allow 2 clusters and accept this, or (B) allow 1 cluster, closest to the old behavior. The test plan (Section 11) checks the effect of option A. If it looks too flat, switch to B or cap the total number of boosted categories at 3.

---

## 7. Scoring specification

### 7.1 What changes and what does not

| Part | Changes? |
|---|---|
| Formula in Section 3.4 | **No** |
| Interests, skills and general average points | **No** |
| Category maximums | **No** |
| Ranking and tie-break rules | **No** |
| Course primary and secondary signals | **No** |
| Where the strand bonus comes from (slot B and category points) | **Yes.** It can now come from a strand (old flow) or from clusters (new flow). |
| New strand values | **Yes.** `Academic-GAS` and `Strengthened-SHS`, both with an empty list (zero bonus). |
| New table | **Yes.** `CLUSTER_WEIGHTS` in `lib/weightTable.js`. |

So the algorithm is the same. A new type of input (a list of clusters) feeds the same two slots that the strand fed.

### 7.2 Cluster table (proposed)

| Cluster ID | Categories boosted | Reasoning |
|---|---|---|
| `stem` | C1, C2, C5 | Same as the old STEM strand |
| `business` | C3 | Same as the old ABM strand |
| `arts-ss-hum` | C4, C6 | Humanities and social sciences (old HUMSS: C4) plus arts (old Arts & Design: C6). A judgment call. |
| `sports-health` | C5 | Same as the old Sports strand |
| `field-exp` | none | Cross-cutting (research, immersion). No single category. |
| `techpro-ict` | C1 | Programming and computer servicing match Information Technology & Computing |
| `techpro-industrial` | C2 | Electrical, mechatronics and servicing match Engineering & Technology |
| `techpro-hospitality` | C3 | Hospitality matches the Business category (BS Hospitality Management is in C3) |
| `techpro-creative` | C6 | Animation and design match Architecture, Fine Arts & Design |
| `techpro-other` | none | The six categories have no match for these clusters |
| `not-sure` | none | Same as GAS |

### 7.3 Rules

1. The boosted categories are the **union** of the categories of all selected clusters.
2. Each boosted category gets **+2 raw category points** (the same as a strand) and **+2 course bonus** on every course in that category (slot B).
3. A category is boosted once, even if two clusters map to it.
4. Strand and clusters are never both used. The old flow uses the strand. The new flow uses the clusters.
5. `Academic-GAS`, `Strengthened-SHS` and `not-sure` boost nothing.

### 7.4 Worked examples

Course value of a boosted category (from Section 3.4): C1 9.04, C2 9.33, C3 9.04, C4 8.29, C5 7.87, C6 8.77.

| Student | Boosted categories | Bonus on a course in each category (before rounding) |
|---|---|---|
| Old, STEM strand | C1, C2, C5 | C1 +9.04, C2 +9.33, C5 +7.87 |
| New, `stem` only | C1, C2, C5 | Same as above |
| New, `stem` + `business` | C1, C2, C3, C5 | Adds C3 +9.04 |
| New, `arts-ss-hum` + `sports-health` | C4, C5, C6 | C4 +8.29, C5 +7.87, C6 +8.77 |
| New, `stem` + `arts-ss-hum` | C1, C2, C4, C5, C6 | Five categories boosted (see the note under D3) |
| New, `not-sure`, or old GAS | none | 0 |

**Effect on percentages.** The category maximums already include the strand's +2. A student with no bonus can never reach the same absolute percentage as a boosted student with identical answers. Their ranking order is still based on their own answers. Codex must report how large this gap is and whether the results page shows numeric match percentages.

---

## 8. Valley subjects for the new curriculum

The 12 internal keys stay exactly as they are, because scoring matches them by label. Only the text shown to new-curriculum students changes. The old curriculum keeps today's text.

| Internal key (unchanged) | Shown to new-curriculum students (draft) | Source status |
|---|---|---|
| Computer/ICT | Computer, ICT or Programming (for example Computer Programming; ICT electives) | TechPro programming checked in DM 048. Elective names under STEM to be checked in the DepEd curriculum guides. |
| Statistics/Research | Research or Statistics (for example Finite Mathematics, Research) | Finite Mathematics checked in DM 048. Research elective name to be checked. |
| Physics | Physics (Physics 1 and 2) | Checked in DM 048 |
| TVL-Industrial Arts | TechPro: Industrial skills (for example Electrical Installation, Mechatronics, Automotive Servicing) | Checked in DM 048 |
| Business Math/Accounting | Accounting or Business Math (Business 1 – Basic Accounting, Business 2 – Business Finance and Income Taxation, General Mathematics) | Checked in DM 048 and DepEd Key Features |
| Economics/Entrepreneurship | Economics or Entrepreneurship (Business 3 – Business Economics, Entrepreneurship) | Checked in DM 048 |
| English/Communication Arts | English or Communication (Effective Communication, Contemporary Literature, Creative Composition) | Checked in DM 048 and Key Features |
| Filipino/Araling Panlipunan | Filipino or Social Studies (Mabisang Komunikasyon, Pag-aaral ng Kasaysayan at Lipunang Pilipino, Philippine Governance) | Checked in DM 048 and Key Features |
| Biology/General Science | Science (General Science, Biology, Chemistry, Earth and Space Science) | Checked in DM 048 |
| PE & Health | PE or Health (Physical Education, Human Movement, Sports electives) | Checked in DM 048 |
| MAPEH-Arts | Arts (Arts 1 – Creative Industries, Arts 2) | Checked in DM 048 |
| TVL-Arts & Design | TechPro: Arts and design skills (for example Animation, Illustration, Visual Graphic Design) | Checked in DM 048 |

Notes:

- The student picks the subjects they are **best** at, including core subjects such as General Science or Effective Communication.
- The 2026–2027 elective list may be updated by DepEd. Re-check the names before the final version.
- Where one key covers several subjects (for example Chemistry under "Science"), this is deliberate and should be written in the scoring table.

---

## 9. Files likely to change

Codex must confirm each file in Step 0 of its prompt, because the line numbers and extra files may differ.

| Area | File | Change |
|---|---|---|
| Intake flow | `app/intake/page.js` | New screen B0, routing, GAS option, cluster picker, Change link |
| Strand and cluster data | `data/items.json` (`ACA-01`) | Add `Academic-GAS`, `Strengthened-SHS`, cluster options with their category lists |
| Weights | `lib/weightTable.js` | Add `Academic-GAS: []`, `Strengthened-SHS: []`, and `CLUSTER_WEIGHTS` |
| Scoring | `lib/scoringEngine.js` | Read the union of boosted categories from clusters (new flow) or the strand (old flow). No formula change. |
| Session | session and validation code (Codex to locate) | Add `curriculum` and `clusters`. Old sessions default to old curriculum. |
| Valley | the Valley page (Codex to locate) | Show new labels in the new flow. Keep internal keys. |
| Results and PDF | `app/results/page.js`, `lib/explorerReport.js` | Curriculum line |
| Guides and text | `app/journey/page.js`, tutorial text, `app/about/About.js`, `app/how-it-works/HowItWorks.js` | Wording for both groups |
| Translations | `lib/i18n/fil.js`, `fil-notes.js`, `source-inventory.json`, `patterns.js` | Filipino text for all new strings |
| Docs | `instructions.md`, `docs/site-map.md`, `docs/wireframe-description.md`, `docs/item-bank.md`, `docs/scoring-table.md`, `docs/features-table.md`, `docs/ui-design-notes.md`, `docs/offline-mode.md` | Match the code |
| Safety check | one small script or test | Fails if the strand and cluster lists differ across intake, `items.json` and `weightTable.js` |

Do not change `lib/scoringEngine.js` logic beyond the input change in Section 7.1.

---

## 10. Build order

One prompt per step. Test each step before starting the next. One git commit per step.

| Step | Work | Done when |
|---|---|---|
| 0 | Approve Section 6 | Every decision is marked |
| 1 | Baseline snapshot, then GAS in the old flow | Baseline saved. All old strands give identical results. GAS works with zero bonus. Consistency check exists. |
| 2 | Screen B0, routing, session fields, `Strengthened-SHS` value | Both paths finish. Old sessions load. New path works with zero bonus. |
| 3 | Cluster picker and cluster scoring | The examples in Section 7.4 pass. Overlap counts once. |
| 4 | Valley labels for the new flow | New labels show in the new flow only. Scoring is unchanged. |
| 5 | Consistency pass over every screen, text, Filipino and docs | No remaining strand-only wording. Filipino complete. |
| 6 | Full regression, offline update check and freeze | The test plan passes. The version is frozen and tagged. |
| 7 | Add courses (separate task) | Repeat Step 6, then freeze again |

---

## 11. Test plan

**Baseline (before Step 1 changes).** Record the top 4 courses and percentages for about 12 varied answer sets across all six current strands. Keep the file outside the source folder.

**Automatic checks**

1. Old flow: every old strand gives identical results to the baseline.
2. Same answers under `Academic-GAS`, `Strengthened-SHS` and `not-sure` give identical ranking and scores.
3. Each single cluster gives the categories in Section 7.2.
4. Two clusters with overlapping categories boost each category once.
5. Category maximums are unchanged. No course score exceeds 100.
6. The strand and cluster consistency check passes.
7. Study the effect of picking two clusters (Decision D3). Report how many boosted categories occur and whether the ranking becomes flat.

**Manual checks**

- Both paths finish at 1920×1080, 1440×900, 1280×720 and a window about 950 wide.
- Keyboard only, with visible focus rings. Reduced motion respected.
- English and Filipino.
- The results and the PDF show the correct curriculum line.
- An old saved session loads as old curriculum.
- **Offline update:** a user who already turned on Offline Mode is told that an update is available, and after updating sees the new flow.
- Tutorial and Journey Guide text read correctly for both groups.
- No console errors. ESLint clean.

---

## 12. Out of scope, risks and open items

**Out of scope for this plan**

- Adding more courses (after Step 6, then re-test and freeze again).
- Revising the capstone paper (after the system is finalized). The paper will need a short description of the curriculum question, the cluster rule in Section 7.3 and the subject labels in Section 8.

**Risks**

| Risk | Handling |
|---|---|
| The cluster table is the developers' own rule, and no new-curriculum respondent has validated it yet | Document it as a design choice in the paper. Ask the counselors about it during the evaluation. |
| The `arts-ss-hum` row (C4 and C6) is a judgment call | Keep it written in the scoring table so it can be defended and adjusted |
| DepEd may update the elective and cluster lists | Re-check the names before the final freeze |
| Some elective names come from DepEd's 2025 pilot list | Check them in the DepEd curriculum guides (Section 8) |
| Offline users may keep the old version | Verify the update behavior in Step 6 |
| Time before the evaluation | Freeze the version and tag it once Step 6 passes |

**Open items**

1. Approve Decisions D1 to D8.
2. Confirm in the DepEd curriculum guides the names marked "to be checked" in Section 8.
3. Confirm with each partner school which curriculum its current Grade 11 learners follow (for the paper's scope).

---

*End of document.*
