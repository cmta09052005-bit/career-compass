# Course Detail and copy inventory (before Prompt 26 changes)

Task 1 is read-only for implementation files. Line references below identify the pre-change content.

## Course Detail

app/results/[courseId]/page.js reads data/explore-courses.json (24 records) and data/courses.json for category codes, generates 24 static course params, derives study text by dropping the overview's first sentence, and sends six panels to FieldJournal. Old per-course data supplies overview, schools/schoolNotes, careers, per-course salary source/date and guidance. These are replaced with v2 source fields in Tasks 2/3.

FieldJournal.js owns tabs in this exact order: Overview; What You'll Study; Where Can You Study; Where Can This Path Lead; Guidance Tips; Financial Aid. It also owns GSAP page turns, sounds, arrow/Home/End keyboard navigation and focus, six-tab viewed bookmarks in session.journalViews, compare toggle and two-course limit, the boxless X to /results, Back to Results, aid shortcut, and the themed journal.css inner scrollbar. Its category heading and category-based watermark are legacy; layout and controls must remain.

The Financial Aid panel is shared ScholarshipInfoBox content plus the shared official-source note, independent of course records. It reads no old course bank and stays unchanged. YearLevelTip reads session.yearLevel, is shared guidance rather than per-course data, and stays unchanged.

## Copy requiring revision or clarification

- app/page.js:23: { id: "forest", name: "The Forest", title: "Find strength in what you can do.", body: "See how sure you are in different skills, including hands-on, creative, technical, and working with people.", stat: "STRENGTH SIGNALS", count: 10, motif: "pine-branch", note: "SKILLS" },
- app/page.js:25: { id: "islands", name: "The Islands", title: "See where your journey can take you.", body: "Your interests, strengths, and grades connect to college courses worth checking out.", stat: "POSSIBLE COURSES", count: 24, motif: "island-flag", note: "POSSIBILITIES" },
- app/page.js:24: { id: "valley", name: "The Valley", title: "What you've already built matters too.", body: "Add your grades and best subjects. They help complete your journey too.", stat: "A FEW QUICK DETAILS", motif: "ribbon-scroll", note: "ACADEMICS" },
- app/page.js:25: { id: "islands", name: "The Islands", title: "See where your journey can take you.", body: "Your interests, strengths, and grades connect to college courses worth checking out.", stat: "POSSIBLE COURSES", count: 24, motif: "island-flag", note: "POSSIBILITIES" },
- app/how-it-works/HowItWorks.js:21: ["Pick your explorer", "Add your strand and optional name and grade level, then pick an explorer.", "explorer-backpack"],
- app/how-it-works/HowItWorks.js:23: ["The Mountains", "Answer a few real-life situations about what interests you.", "mountain-peak"],
- app/how-it-works/HowItWorks.js:24: ["The Forest", "Say how confident you feel in different skills.", "pine-branch"],
- app/how-it-works/HowItWorks.js:25: ["The Valley", "Add your grades and best subjects. The last piece of the map.", "ribbon-scroll"],
- app/how-it-works/HowItWorks.js:27: ["The Islands", "See your matches, explore each one, and download your report.", "island-flag"],
- app/how-it-works/HowItWorks.js:30: { id: "mountains", name: "The Mountains", type: "Interests", icon: "mountain-peak", format: "8 real-life situations to choose from", description: "There's no right or wrong answer. Every choice tells the system something new about you.", time: "about 3–4 minutes", number: "01" },
- app/how-it-works/HowItWorks.js:31: { id: "forest", name: "The Forest", type: "Skills", icon: "pine-branch", format: '10 quick sliders, from "not really me" to "definitely me"', description: "Covers hands-on, creative, technical, and people skills.", time: "about 2–3 minutes", number: "02" },
- app/how-it-works/HowItWorks.js:32: { id: "valley", name: "The Valley", type: "Academics", icon: "ribbon-scroll", format: "a short step-by-step form", description: "Just your general average and your best subjects.", time: "less than a minute", number: "03" },
- app/how-it-works/HowItWorks.js:32: { id: "valley", name: "The Valley", type: "Academics", icon: "ribbon-scroll", format: "a short step-by-step form", description: "Just your general average and your best subjects.", time: "less than a minute", number: "03" },
- app/how-it-works/HowItWorks.js:30: { id: "mountains", name: "The Mountains", type: "Interests", icon: "mountain-peak", format: "8 real-life situations to choose from", description: "There's no right or wrong answer. Every choice tells the system something new about you.", time: "about 3–4 minutes", number: "01" },
- app/how-it-works/HowItWorks.js:31: { id: "forest", name: "The Forest", type: "Skills", icon: "pine-branch", format: '10 quick sliders, from "not really me" to "definitely me"', description: "Covers hands-on, creative, technical, and people skills.", time: "about 2–3 minutes", number: "02" },
- app/how-it-works/HowItWorks.js:32: { id: "valley", name: "The Valley", type: "Academics", icon: "ribbon-scroll", format: "a short step-by-step form", description: "Just your general average and your best subjects.", time: "less than a minute", number: "03" },
- app/how-it-works/HowItWorks.js:36: ["Up to 24 course matches, ranked just for you", "island-flag"],
- app/how-it-works/HowItWorks.js:37: ["A match score for each one", "sunburst"],
- app/how-it-works/HowItWorks.js:41: const trust = [["No login needed", "explorer-backpack"], ["Progress is saved on this device", "fog-mist"], ["Free for all Senior High School students", "sunburst"], ["About 10 minutes, start to finish", "footprint-trail"]];
- app/about/About.js:28: ["Will this tell me exactly what course to take?", "No. It gives you a ranked list of course matches to explore based on your answers. The final decision is always yours."],
- app/about/About.js:23: ["Personalized", "Your results are based on you: your interests, your skills, your grades.", "sunburst"],
- app/about/About.js:30: ["How accurate are the results?", "Career Compass uses a scoring method built with input from real guidance counselors, but it's a guide, not a guarantee. Talk to your counselor, family, or teachers too."],
- app/layout.js:25: "A web-based decision support system to help Senior High School students explore college courses and career paths.",
- app/how-it-works/page.js:5: description: "See the seven steps, three assessment trails, and course guidance you can explore with Career Compass.",
- app/about/page.js:2: export const metadata = { title: "About | Career Compass", description: "Learn why Career Compass exists, meet its student researchers, and understand what this career guidance capstone can and cannot do." };
- app/journey/page.js:663: {panel === "guide" && <><Localized as="p" className="atlas-eyebrow">JOURNEY GUIDE</Localized><Localized as="h2" id="atlas-dialog-title">Welcome to The Atlas</Localized><ul className="atlas-guide-steps"><li><Icon name="ribbon-scroll" /><Localized as="span">This is your map. Drag it left or right to look around.</Localized></li><li><Icon name="mountain-peak" /><Localized as="span">Finish regions in order: Mountains, then Forest, then Valley.</Localized></li><li><Icon name="sunburst" /><Localized as="span">A glowing region means it&apos;s ready. Tap it to start.</Localized></li><li><Icon name="flag-marker-pin" /><Localized as="span">Lost? Tap Locate Me anytime to find your spot again.</Localized></li></ul><Localized as="div" className="atlas-guide-path">Mountains <Localized as="span">···</Localized> Forest <Localized as="span">···</Localized> Valley</Localized><Button label="Got it" onClick={closePanel} /><Button label="Replay tutorial" variant="secondary" onClick={replayTour} /></>}
- app/journey/page.js:40: { id: "interests", name: "The Mountains", subject: "Interests", description: "Discover what pulls you forward.", detail: "8 scenarios", icon: "mountain-peak", badge: "Wayfinder", badgeIcon: "mountain-peak", left: 35.009543884317914, top: 40.717392281471724 },
- app/journey/page.js:41: { id: "skills", name: "The Forest", subject: "Skills", description: "Find strength in what you can do.", detail: "15 statements", icon: "pine-branch", badge: "Skillcrafter", badgeIcon: "pine-branch", left: 50.03756870392547, top: 66.59883517680692 },
- app/journey/page.js:42: { id: "academic", name: "The Valley", subject: "Academics", description: "What you've already built matters too.", detail: "4 steps", icon: "ribbon-scroll", badge: "Scholar", badgeIcon: "ribbon-scroll", left: 62, top: 55 },
- components/AtlasTutorial.js:9: "1 of 4 · The Mountains. Assessment 1 is about your interests.",
- components/AtlasTutorial.js:10: "2 of 4 · The Forest. Assessment 2 is about your skills.",
- components/AtlasTutorial.js:11: "3 of 4 · The Valley. Assessment 3 is about your academics.",
- components/AtlasTutorial.js:12: "4 of 4 · The Islands. This is the end. Your results are here.",
- app/intake/page.js:130: <Localized as="h1" id="basecamp-title" ref={heading} tabIndex={-1}>{step === 1 ? "Choose Your Explorer" : "Choose your curriculum"}</Localized>
- app/intake/page.js:149: {error && <Localized as="p" id="basecamp-error" className="basecamp-error" role="alert">{!session.gradeLevel ? "Choose your grade level." : "Choose your curriculum."}</Localized>}
- app/intake/page.js:149: {error && <Localized as="p" id="basecamp-error" className="basecamp-error" role="alert">{!session.gradeLevel ? "Choose your grade level." : "Choose your curriculum."}</Localized>}
- app/results/[courseId]/FieldJournal.js:79: <Localized as="p" className="journal-category">{course.category} · {course.courseId}</Localized>
- app/results/[courseId]/FieldJournal.js:28: export default function FieldJournal({ course, categoryCode, children }) {
- app/results/[courseId]/FieldJournal.js:92: <div className="journal-watermark" aria-hidden="true"><StatementIcon category={categoryCode} /></div>

## Checked and already current

- Basecamp uses optional identity, required grade and curriculum; strand is mentioned only in the exact old-route label imported from routeResolution. No strand selection remains in Basecamp.
- Map counts are already 8/15/4, and badges describe completed regions without old item counts. The guide's order is correct but will name the counts explicitly.
- Results already says Show all 85 courses and top 5; its old-route-only GAS note is valid and remains.
- Shared footer/navigation, Processing, Report and offline fallback have no obsolete 24-course, 22-item or ten-statement claim. Generic no-account/local-saving text stays.
- About and layout metadata do not contain old counts, but generic course-result descriptions can explicitly reflect the new top-five/85-course scope.
- No student-facing "22 items" or categorical grouping claim was found outside the legacy Course Detail header and deliberately excluded translation catalogs. CSS category class names, SVG coordinates, animation numbers and tutorial timing progress are implementation details, not match scores.
- Per-region time estimates are unverified. Replace them with the one DRAFT full-journey estimate, clearly labeled as full journey, rather than inventing new region durations.
- Existing marketing pages intentionally use scrolling/parallax. Copy-only edits preserve that behavior; no new whole-page scrolling is introduced. Course Detail retains its bounded inner region.

## Scope boundaries

Do not edit scoring files, data/v2 content, translation catalogs or legacy assets. Source data and exact source text remain intact. New display copy is DRAFT, and newly missing Filipino strings will be listed in the final report.
