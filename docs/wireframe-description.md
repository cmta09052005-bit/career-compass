CAREER COMPASS: A WEB-BASED DECISION SUPPORT SYSTEM FOR SENIOR HIGH SCHOOL CAREER GUIDANCE
Wireframe Description
Phase 4, User Design — Item 2: Full Set of Wireframes (All Screens)
Version 1.1 (Revised)
________________________________________
PURPOSE AND HOW TO USE THIS DOCUMENT
This document provides the complete structural description of all 10 screens in Career Compass, following the numbered-indicator convention established in your earlier Results Page prototype. Each screen below lists its exact layout elements, in top-to-bottom reading order, with a continuous indicator number and an accompanying legend table.
How to use this alongside your hand-drawn wireframes: For each screen described here, draw a simple box-layout sketch (boxes, labels, rough placement — no full illustration needed) matching the element order given, then place the corresponding numbered tags directly on your drawing. The legend tables below are ready to copy directly under each drawn screen.
Note on animation/motion: A few screens (Landing Page, Processing Screen, Journey Map) involve scroll- or state-based motion described in your Design Notes document. Since a wireframe is a static structural document, each relevant screen below shows its key resting-state layout (numbered normally), with any motion behavior noted separately in a non-numbered "Motion Note" callout — this preserves your creative direction without breaking wireframe convention.
Numbering: Continuous across all 10 screens (12 counting sub-screens), indicators 1–68.
________________________________________
SCREEN 1: LANDING / WELCOME PAGE
Purpose: First impression of the system — introduces the Explorer/Journey concept and invites the user to begin.
Layout (top to bottom, centered single column):
Indicator	Element	Description
1	Brand mark	Small "CAREER COMPASS" logo/wordmark, top of screen, minimal size
2	Headline	"You are an Explorer. Your career path is a map." — large, elegant serif type
3	Description text	2–3 short sentences explaining the system's purpose (interactive career exploration for SHS students)
4	Primary CTA button	"Start Your Journey" — single, high-contrast button, centered below description
5	Background area	Full-screen atmospheric illustration/gradient placeholder (sky, compass motif, Explorer theme colors)
6	Navigation Bar	"Career Compass" brand mark top-left; top-right menu buttons: "Explore," "How It Works," "About"
Motion Note (not numbered — reference only): On load/scroll, elements 1–4 and 6 may reveal sequentially (brand → nav → headline → description → CTA) over the background. A compass graphic may subtly rotate/settle during this reveal. This is implemented in Phase 5 using GSAP — the wireframe above represents the final settled state.
________________________________________
SCREEN 2: STUDENT INFO INTAKE
Purpose: Collects session-only personalization info (not an account) before entering the assessment.
Layout:
Indicator	Element	Description
7	Panel heading	"Who Are You, Explorer?"
8	Supporting subtext	"Tell us a little about yourself so we can personalize your journey."
9	Nickname input field	Text input, labeled "Your nickname or first name (optional)"
10	Strand selector	6 selectable cards: Academic-STEM, Academic-ABM, Academic-HUMSS, TVL, Arts & Design, Sports
11	Year Level selector	2 selectable cards: "Grade 11" / "Grade 12," with small note below: "This is for personalization only and does not affect your results"
12	"Continue" button	Primary action button, becomes active once required fields are filled
13	Background panel frame	Form content sits inside a bordered panel over the same background theme (subdued/lower opacity)
________________________________________
SCREEN 3: JOURNEY MAP / DASHBOARD (Main Navigation Hub)
Purpose: Central hub showing the 3 assessment sections as explorable destinations, tracking session progress.
Layout:
Indicator	Element	Description
14	Map background	Single illustrated map/island-cluster background (used consistently — no separate art style per section)
15	Island marker 1 — Interests	Icon + label "INTERESTS" + short description ("Discover what naturally draws your curiosity")
16	Island marker 2 — Skills	Icon + label "SKILLS" + short description ("Discover where your strengths lead")
17	Island marker 3 — Academic Performance	Icon + label "ACADEMICS" + short description ("See how your academic background supports your path")
18	Compass Points progress indicator	Visual progress element showing each section's state: Not Started / In Progress / Completed
19	Settings icon	Small gear/settings icon (top corner) — opens Restart Assessment, etc 
20	" View My Results" button	Enabled only once all 3 sections are marked Completed; replaces the Start Button (Indicator 22) once available — the two are never shown at the same time
21	Session reminder text	Small one-time note: "Your progress is temporary and not saved after this session"
22	"Start Assessment" button	Shown only before any section has been started; begins the guided flow at the first section. Disappears once at least one section is in progress changes to “Continue Assessment” and once all sections are done, button cannot be accessed anymore.
23	Journey Guide icon	Small or compass-shaped help icon; opens a brief first-time overlay explaining how to navigate the map and select a section. 
24	"Locate Me" button	Centers/highlights the student's current or next recommended island on the map — useful if the map is zoomable or larger than the screen. 
Motion Note (not numbered): Island markers visually shift state (faded → illuminated → pulsing/glowing) based on progress; clicking an island navigates to that section.
________________________________________
SCREEN 3a: INTERESTS SECTION
Purpose: Gathers interest data via scenario-based card selection.
Layout:
Indicator	Element	Description
25	Section/progress label	"INTERESTS — Question [X] of [Y]"
26	Mini progress indicator	Small compass-style progress marker for this section only
27	Scenario prompt text	The situational question (e.g., "Your team is given a problem with no obvious solution. What are you most likely to do?")
28	Option card 1	Icon + short label + one-line description (e.g., "🔍 Investigate")
29	Option card 2	Icon + short label + description (e.g., "💡 Create")
30	Option card 3	Icon + short label + description (e.g., "🤝 Collaborate")
31	Option card 4	Icon + short label + description (e.g., "🎯 Organize")
32	"Back" button	Returns to previous question or Journey Map if on first question
33	"Next" button	Advances to next question; disabled until an option is selected
________________________________________
SCREEN 3b: SKILLS SECTION
Purpose: Self-assessment of skills via confidence sliders.
Layout:
Indicator	Element	Description
34	Section/progress label	"SKILLS — Statement [X] of [Y]"
35	Statement text	The self-assessment statement (e.g., "I can explain a technical concept to someone unfamiliar with it")
36	Confidence slider	1–5 scale, labeled endpoints "Not Confident" to "Very Confident"
37	"Back" button	Returns to previous statement
38	"Next" button	Advances to next statement; disabled until a value is selected
________________________________________
SCREEN 3c: ACADEMIC PERFORMANCE SECTION
Purpose: Collects academic background data to complete the assessment.
Layout:
Indicator	Element	Description
39	Section label	"ACADEMIC PERFORMANCE"
40	Strand display (read-only)	Auto-filled from Screen 2's selection, shown for confirmation, not re-entered
41	General Average input field	Numeric input field
42	Best-Performing Subjects checklist	Multi-select checkboxes (Computer/ICT, Statistics/Research, Physics, TVL–Industrial Arts, Business Math/Accounting, Economics/Entrepreneurship, English/Communication Arts, Filipino/Araling Panlipunan, Biology/General Science, PE & Health, MAPEH–Arts, TVL–Arts & Design)
43	"Back" button	Returns to Skills Section
44	"Submit / View Results" button	Final button of the assessment flow — triggers the scoring engine
________________________________________
SCREEN 4: PROCESSING / ASSESSMENT SUMMARY (Transition Screen)
Purpose: Brief computing transition between assessment submission and results.
Layout:
Indicator	Element	Description
45	Heading	"Charting Your Course"
46	Supporting text	"Your answers are being mapped to possible career directions."
47	Loading animation area	Compass-icon spinner or simple loading indicator
48	Staged status text	Brief cycling status lines (e.g., "Analyzing interests... / Mapping strengths... / Reviewing academic trail...")
Motion Note (not numbered): This screen is time-limited (~2–4 seconds) before auto-advancing to Results.
________________________________________
SCREEN 5: RESULTS PAGE
Purpose: Displays ranked course/career recommendations with match percentages.
Layout:
Indicator	Element	Description
49	Heading	"Your Career Map"
50	Supporting subtext	"Based on your journey, these paths may be worth exploring."
51	Strongest-field note	Small supplementary note below the ranked list showing the strongest category; never the primary result
52	Global ranked course card list	Top 5 shown first with an option to expand to all 24. Each card contains rank, course code/name, match %, category badge, one-line explanation, and "Explore This Course" button
53	Guidance disclaimer	Small text: "This is a guidance tool, not a final decision — talk to your guidance counselor about what's right for you."
54	"Back to Journey Map" button	Secondary action
55	"Download My Explorer Report" button	Primary action — triggers PDF generation
________________________________________
SCREEN 5a: COURSE DETAIL VIEW
Purpose: Expanded information per selected course, opened from the Results Page.
Layout:
Indicator	Element	Description
56	Course title heading	Full course name + small "Career Path" label
57	Overview section	Short description of what the course is about
58	What You'll Study section	List of key subjects
59	Where Can You Study section	School cards: name, location, public/private tag
60	Where Can This Path Lead section	List of related career opportunities
61	Career Outlook section	Salary range, with source and "as of [date]" note
62	Guidance Tips section	Admission requirements, scholarships, certifications, plus a Grade 11 vs. Grade 12-specific preparation tip
63	"Back to Results" button	Returns to the Results Page
________________________________________
SCREEN 6: PDF REPORT CONFIRMATION
Purpose: Confirms successful report generation, closing out the session.
Layout:
Indicator	Element	Description
64	Heading	"Your Explorer Report Is Ready"
65	Supporting text	"Your journey has been mapped. Your next destination is yours to explore."
66	"Download Report" button	Downloads the PDF file
67	"Print Report" button	Opens print dialog for the report
68	"Back to Results" button	Returns to the Results Page
________________________________________
APPENDIX NOTE: EXPLORER REPORT (PDF) — REFERENCE ONLY, NOT A WEB SCREEN
The generated PDF should contain, in order: a cover section (Career Compass branding, nickname if provided, date), a primary "Your Top Course Matches" summary, a supplementary strongest-field note, a "Your Exploration Profile" summary, the complete ranked list of 24 courses, and the same guidance disclaimer used on the Results Page.
________________________________________
FULL INDICATOR SUMMARY (Quick Reference)
Screen	Indicator Range
1. Landing/Welcome Page	1–6
2. Student Info Intake	7–13
3. Journey Map/Dashboard	14–24
3a. Interests Section	25–33
3b. Skills Section	34–38
3c. Academic Performance Section	39–44
4. Processing/Summary Transition	45–48
5. Results Page	49–55
5a. Course Detail View	56–63
6. PDF Report Confirmation	64–68
Total indicators across the full system: 68
________________________________________

Prepared By:

CHARLENE MAE T. ADILLE

BSIT Student Researcher 

