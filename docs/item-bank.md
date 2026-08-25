 


CAREER COMPASS: A WEB-BASED DECISION SUPPORT SYSTEM FOR SENIOR HIGH SCHOOL CAREER GUIDANCE

Draft Assessment Item Bank
Version 2.0(Revised)

Purpose of this document: The Assessment Item Bank contains the complete set of questions, scenarios, and form fields that make up Career Compass's three assessment sections, Interests, Skills, and Academic Performance. Each item is tagged to the course/career category (or categories) it relates to, making this document the raw content source that the Rule/Weight Scoring Table converts into actual point values, and that the frontend interface displays to students during the assessment. This document defines what the system asks; the Scoring Table defines how those answers are interpreted.

CAREER COMPASS: Draft Assessment Item Bank (v2.0 — Revised)
Category Legend

Code	Full Category Name
C1	Information Technology & Computing
C2	Engineering & Technology
C3	Business Administration & Related
C4	Education Science & Teacher Training
C5	Medical & Allied Health Sciences
C6	Architecture, Fine Arts & Design



SECTION 1: INTERESTS (Scenario-Based Card Selection) — 8 items, 32 options

Item ID	Section	Scenario Text	Option (a)	Option (b)	Option (c)	Option (d)
INT-01	Interests	It's the weekend with completely free time. Which activity appeals to you most?	Plan a small fundraiser/budget for your barkada [C3]	Tutor a sibling/neighbor in a subject you're good at [C4]	Volunteer at a community health/first-aid drive [C5]	Sketch, design, or redecorate a space [C6]
INT-02	Interests	Your class must create a project to help the school. Which task would you volunteer for?	Build a simple app/online form for the school [C1]	Facilitate an orientation/training session for classmates [C4]	Set up a first-aid/wellness corner [C5]	Design the posters/visuals for the project [C6]
INT-03	Interests	Your group project is about improving your community. Which contribution excites you most?	Build a tracking app/spreadsheet for community data [C1]	Design/build a physical model or prototype (e.g., drainage system) [C2]	Research health & sanitation practices for the plan [C5]	Create the visual concept/branding for the campaign [C6]
INT-04	Interests	A local competition invites SHS students to pitch an idea. Which type would you want to develop?	A mobile app/software tool for an everyday problem [C1]	A gadget, machine, or engineering solution [C2]	A small business/startup concept with a marketing plan [C3]	An art, fashion, or design innovation [C6]
INT-05	Interests	Your favorite type of content to watch in your free time is usually about...	Tech reviews, coding tutorials, app dev [C1]	DIY builds, machine teardowns, engineering explainers [C2]	Entrepreneurship, investing, business case studies [C3]	Teaching tips, motivational talks, study hacks [C4]
INT-06	Interests	You're asked to represent a profession at Career Day. Which would you enjoy representing most?	An engineer explaining how bridges/circuits are built [C2]	An entrepreneur explaining how to start/grow a business [C3]	A teacher explaining how to guide young learners [C4]	A nurse explaining patient care [C5]
INT-07	Interests	Your group is running booths at a class fair. Which one would you rather manage?	The "mini-store" booth — sales & budgeting [C3]	The "peer helpdesk" booth — answering classmates' questions [C4]	The "wellness check" booth — basic health screening [C5]	The "creative corner" booth — art/face painting displays [C6]
INT-08	Interests	Think of a problem in your community (traffic, waste, poor internet, limited health services). How would you want to help solve it?	Build a digital tool/system to track and manage it [C1]	Create educational materials to raise awareness [C4]	Join a health/relief mission related to it [C5]	Design signage/campaign visuals about it [C6]

Category coverage check: C1×5, C2×4, C3×5, C4×6, C5×6, C6×6 — all 6 represented.
________________________________________
SECTION 2: SKILLS (Confidence Sliders, 1–5 scale) — 10 items

Item ID	Section	Statement (1 = Not Confident, 5 = Very Confident)	Category
SKL-01	Skills	"I can quickly figure out how a computer program, app, or website works, even without being taught."	C1
SKL-02	Skills	"I enjoy building, repairing, or taking apart machines/gadgets to see how they work."	C2
SKL-03	Skills	"I can explain a complicated topic simply so others understand it."	C4
SKL-04	Skills	"I am comfortable managing money, budgets, or tracking expenses for a project."	C3
SKL-05	Skills	"I can stay calm and think clearly when someone nearby is injured or unwell."	C5
SKL- 06	Skills	"I can express my ideas visually through drawing, layout, or design."	C6
SKL-07	Skills	"I can persuade others to support an idea, product, or plan."	C3
SKL-08	Skills	"I am good at following step-by-step instructions to build or construct something."	C2
SKL-09	Skills	"I enjoy taking care of or looking after other people's well-being (siblings, classmates, pets, patients)."	C5
SKL-10	Skills	"I enjoy patiently guiding or mentoring someone younger or less experienced."	C4

Rebalanced: C1×1, C2×2, C3×2, C4×2, C5×2, C6×1 — swapped old SKL-09 ("analyze data/patterns," a 2nd C1) into a 2nd C5 item, so coverage is now more even (previously C5/C6 only had 1 each).
________________________________________
SECTION 3: ACADEMIC PERFORMANCE (Step-by-Step Form Input) — 4 fields

Item ID	Section	Field	Input Type	Category Tag / Notes
ACA-01	Academic Performance	Strand	Dropdown (see options below)	Maps to categories — see table below
ACA-02	Academic Performance	Current Year Level	Dropdown: Grade 11 / Grade 12	Contextual only — no scoring weight
ACA-03	Academic Performance	General Weighted Average	Numeric input (75–100)	Minor modifier boost to STEM-heavy categories (C1, C2, C5) if average is high (e.g., ≥ 90) — not a per-category point item like the others, more of a scaling factor. Coordinate exact rule with Charlene.
ACA-04	Academic Performance	"Which subjects are you strongest in? (Select up to 3)"	Multi-select checklist	12 tagged options — see table below

ACA-01 Strand Options:

Strand Option	Category Tag(s)
Academic – STEM	C1, C2, C5
Academic – ABM	C3
Academic – HUMSS	C4
TVL	C2 
Arts & Design	C6
Sports	C5

ACA-04 Subject Options:

Subject Option	Category
Computer/ICT (Programming, Computer Systems Servicing)	C1
Statistics / Research	C1
Physics	C2
TVL – Industrial Arts (Electronics, Welding, Automotive)	C2
Business Math / Accounting	C3
Economics / Entrepreneurship	C3
English / Communication Arts	C4
Filipino / Araling Panlipunan	C4
Biology / General Science	C5
Physical Education & Health	C5
MAPEH – Arts	C6
TVL – Arts & Design (Visual Arts, Fashion, Culinary Design)	C6


Prepared By:

JUNO ALLIGAH B. ROMANO
 
BSIT Student Researcher


