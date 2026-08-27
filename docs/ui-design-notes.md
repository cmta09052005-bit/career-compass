CAREER COMPASS — LANDING PAGE UI & SCROLL EXPERIENCE
1. OVERALL CONCEPT
Create a cinematic, immersive landing page for Career Compass that feels like the user is entering a fantasy world and beginning an exploration journey.
The website should not feel like a conventional SaaS landing page.
The experience should feel like:
opening an ancient compass → entering a fantasy world → traveling across a magical map → discovering different environments → discovering career possibilities.
The entire page should be driven by scrolling.
The user should feel that their scroll is physically moving them through the world.
Use:
•	GSAP
•	GSAP ScrollTrigger
•	Lenis.js for smooth scrolling
•	Canvas/frame-sequence animation where appropriate
•	CSS gradients and layered atmospheric effects
•	Parallax movement
•	Scroll-based camera/environment transitions
•	HTML text layered over animated environments
The animation should feel cinematic and premium, not like simple fade-in/fade-out animations.
________________________________________
2. INITIAL SCREEN — CLOSED COMPASS
When the website initially loads, show almost nothing except the visual scene.
Main object
Place a closed antique/fantasy compass approximately in the center of the screen.
The compass should be positioned at a slightly diagonal angle, approximately 60 degrees, rather than perfectly horizontal or vertical.
It should look like an old mystical navigation compass.
Think:
•	antique brass
•	engraved details
•	slightly worn material
•	fantasy-adventure aesthetic
•	subtle magical quality
•	realistic lighting
Background
Behind the compass is a dreamy cloudy sky.
The background should feel like the user is floating above the clouds.
Use:
•	soft clouds
•	atmospheric haze
•	subtle blue/lavender tones
•	dreamy lighting
•	fantasy atmosphere
•	very subtle movement
Do NOT display any text at this stage.
Do NOT display navigation.
Do NOT display buttons.
The first screen should feel mysterious and cinematic.
The user should immediately wonder:
"What is this?"
________________________________________
3. FIRST SCROLL — THE COMPASS OPENS
When the user starts scrolling, the compass becomes the main animation.
The compass should slowly open as the user scrolls.
At the same time:
•	the compass rotates into another orientation
•	the camera subtly moves
•	the clouds shift
•	the atmospheric background moves
•	lighting changes slightly
•	the scene slowly becomes more expansive
The animation should be scrubbed by scroll position.
Scrolling down should directly control the progress of the compass animation.
Do not make it a simple autoplay animation.
The user should be able to:
•	scroll down → compass opens
•	stop scrolling → animation pauses
•	scroll slightly back → animation reverses
This should be implemented with GSAP ScrollTrigger.
If a detailed 3D compass model is difficult to render efficiently, use a pre-rendered frame sequence displayed through a <canvas> and let ScrollTrigger control the frame index.
The goal is to create the same type of effect as modern product-storytelling websites where scrolling controls the object's animation.
________________________________________
4. SECOND SCROLL — THE WORLD IS REVEALED
As the user continues scrolling, the clouds should become more prominent.
A large layer of clouds should pass across the screen, acting as a cinematic transition.
The clouds should temporarily obscure the scene.
When the clouds clear, the actual Career Compass landing page is revealed.
This should feel like:
the user has traveled through the clouds and entered the world.
________________________________________
5. HERO REVEAL — CAREER COMPASS
After the cloud transition, reveal the main landing-page interface.
The environment is now a fantasy map viewed from above, combined with a heavenly sky and the top of a mountain.
The visual should resemble an enchanted exploration map.
Background
The environment should contain:
•	fantasy map textures
•	clouds
•	mountains
•	distant terrain
•	atmospheric fog
•	subtle light
•	fantasy landscape
•	old-world exploration aesthetic
The entire environment should have depth.
Use multiple layers so that different elements move at different speeds during scrolling.
For example:
foreground clouds → medium mountains → distant mountains → map terrain → sky
This creates a cinematic parallax effect.
________________________________________
6. HERO NAVIGATION
The navigation should be minimal and elegant.
Top-left:
CAREER COMPASS
Small branding text.
It should NOT dominate the screen.
It should feel like a small logo/brand mark that remains visible while the user explores.
Top-right navigation:
EXPLORE
HOW IT WORKS
ABOUT
Instead of "HOME / ABOUT / CONTACT", I recommend using navigation that matches the actual experience.
Better options:
EXPLORE · HOW IT WORKS · ABOUT
or:
JOURNEY · FEATURES · ABOUT
Avoid "HOME" because the user is already on the landing page.
Avoid "CONTACT" unless contacting the developers/organization is actually an important function.
________________________________________
7. HERO MESSAGE
The central content should appear after the environment has been revealed.
Main headline:
You are an Explorer.
Your career path is a map.
The typography should be large but elegant.
Use a fantasy/editorial serif typeface for this headline.
The text should appear gradually rather than instantly.
Possible animation:
1.	Clouds clear
2.	Environment settles
3.	Brand appears
4.	Navigation appears
5.	Headline reveals
6.	Supporting description fades upward
7.	CTA appears last
The animation should happen sequentially using a GSAP timeline.
________________________________________
8. HERO DESCRIPTION
Under the headline, include a short explanation of Career Compass.
The description should explain that Career Compass helps students/users explore their interests, strengths, skills, and possible career directions through an interactive career exploration experience.
Keep it short.
Do not create a large paragraph.
The visual experience should remain the main focus.
________________________________________
9. MAIN CTA
Place one prominent CTA directly underneath the description.
CTA:
START YOUR JOURNEY
The button should feel like part of the fantasy world rather than a generic modern SaaS button.
Possible visual treatment:
•	subtle gold/brass border
•	soft glow
•	translucent background
•	slight hover movement
•	compass-inspired icon
•	gentle illumination
When hovered, the button can have a subtle directional movement or glow.
The CTA should be the primary action on the page.
________________________________________
10. HERO SCROLL TRANSITION
As the user continues scrolling after the hero:
The entire environment should begin moving.
Do NOT simply fade into another section.
Instead, make it feel as if the user is traveling deeper into the map.
The camera can:
•	slowly move forward
•	move downward
•	pan across the map
•	pass through clouds
•	reveal new terrain
The background should continuously transform.
The user should feel that they are moving through a single world.
________________________________________
11. FEATURE SECTION 01 — WINTER MOUNTAINS
The next major environment is a dreamy fantasy winter mountain region.
The background should contain:
•	snowy mountains
•	fantasy map textures
•	clouds
•	mist
•	snow particles
•	atmospheric blue tones
•	distant peaks
•	subtle magical lighting
The environment should feel cold, mysterious, and adventurous.
As the user enters this environment, the first system feature information should gradually appear.
The feature information should not appear immediately.
Use scroll-based reveal animations.
For example:
•	mountain environment appears
•	camera moves forward
•	clouds pass
•	feature title appears
•	supporting information follows
•	visual/icon appears
•	everything settles into position
The information should remain readable without overpowering the environment.
________________________________________
12. FEATURE SECTION 02 — DARK FANTASY FOREST
Continue the journey into a completely different environment.
Transition from the snowy mountains into a dark fantasy forest.
The forest should feel:
•	mysterious
•	slightly magical
•	deep
•	atmospheric
•	adventurous
Use:
•	tall trees
•	fog
•	dark green/blue tones
•	glowing particles
•	moonlight-like illumination
•	fantasy map elements
•	atmospheric depth
Do not make the transition feel like a normal website section.
Use clouds, fog, darkness, camera movement, and parallax to transition between environments.
Reveal another major Career Compass feature here.
The text should appear naturally as the user enters the scene.
________________________________________
13. FEATURE SECTION 03 — FANTASY ISLANDS
Continue the journey into a bright fantasy island environment.
The scene should contain:
•	floating or distant islands
•	ocean
•	clouds
•	warm sunlight
•	fantasy map textures
•	tropical vegetation
•	mountains
•	dreamy atmospheric effects
This environment should feel brighter and more hopeful than the forest.
Reveal another system feature here.
The visual progression should communicate a journey:
mysterious beginning → cold exploration → dark discovery → bright destination
________________________________________
14. SCROLL STORYTELLING
The entire website should use scroll as the storytelling mechanism.
The page should feel like one continuous cinematic sequence.
Conceptually:
CHAPTER 01
The Compass
Closed compass floating above the clouds.
↓
CHAPTER 02
The Awakening
Compass opens and rotates.
↓
CHAPTER 03
The World
Clouds reveal the fantasy map.
↓
CHAPTER 04
The Mountains
First Career Compass feature.
↓
CHAPTER 05
The Forest
Second Career Compass feature.
↓
CHAPTER 06
The Islands
Third Career Compass feature.
↓
CHAPTER 07
The Journey Ahead
Lead the user toward starting their Career Compass experience.
________________________________________
15. SCROLL PHYSICS & ANIMATION
Use Lenis.js to create smooth scrolling.
Use GSAP ScrollTrigger for scroll-controlled animation.
Animations should include:
•	compass rotation
•	compass opening
•	cloud movement
•	camera movement
•	background parallax
•	mountain movement
•	forest depth movement
•	island movement
•	text reveal
•	navigation reveal
•	CTA reveal
•	atmospheric transitions
Avoid excessive bouncing.
Avoid generic animations such as:
fadeIn → fadeIn → fadeIn
Every animation should have a purpose.
The website should feel like a cinematic camera traveling through a fantasy world.
________________________________________
16. GSAP IMPLEMENTATION APPROACH
The compass animation should preferably be implemented as a scroll-controlled sequence.
Conceptually:
Scroll progress → ScrollTrigger → frame index → canvas rendering
Preload the compass frames and draw the correct frame to a canvas based on ScrollTrigger progress.
This allows the compass to:
•	open
•	rotate
•	change orientation
•	reveal its internal mechanism
while remaining synchronized with the user's scroll position.
For background environments, use layered assets and GSAP transforms rather than trying to make everything a single massive image.
________________________________________
17. ATMOSPHERE
The atmosphere is extremely important.
Use layered effects such as:
•	gradients
•	fog
•	cloud overlays
•	soft radial lighting
•	subtle particles
•	depth blur
•	ambient glow
•	vignette
•	subtle film grain if appropriate
The result should resemble a dreamy fantasy adventure map, not a generic gaming website.
________________________________________
18. TYPOGRAPHY
Use two complementary font styles.
Display font
Elegant fantasy/editorial serif.
Use for:
•	major hero headline
•	chapter titles
•	important statements
UI font
Clean modern sans-serif.
Use for:
•	navigation
•	descriptions
•	feature information
•	buttons
•	labels
The combination should create:
Fantasy + modern technology
rather than making the entire website look medieval.
________________________________________
19. IMPORTANT DESIGN RULE
The fantasy visuals should support the Career Compass concept.
Do not make it look like a fantasy game website.
The user should still understand that this is a career exploration system.
The fantasy world represents the user's career journey.
The compass represents:
direction.
The map represents:
career possibilities.
The different environments represent:
different paths and discoveries.
The journey represents:
the process of finding a career direction.
________________________________________
20. FINAL EXPERIENCE
The user should not feel like they are scrolling through a website.
They should feel like they are traveling through a world.
The ideal emotional progression is:
Curiosity → Discovery → Exploration → Reflection → Direction → Action
The final CTA should bring the user back to the purpose of the system:
START YOUR JOURNEY
The entire landing page should communicate one idea:
Your future does not have to be a straight line. Explore the map, discover your direction, and find the path that fits you.

Absolutely. Since your landing page is the cinematic entry point, I’d make the rest of the system feel like the user is continuing the same explorer journey, rather than suddenly switching into a normal dashboard/app UI.
The key is: fantasy aesthetic in the environment, but clean and highly usable UI for the assessment itself.
I’d refine your pages like this:
________________________________________
1. STUDENT INFO INTAKE — “WHO IS THE EXPLORER?”
This should feel like the user has just entered the Career Compass world.
Visual concept
Instead of a standard form card floating in the middle, make it look like a small explorer's waypoint / parchment panel placed over the fantasy map.
Background:
•	Clouds moving slowly
•	Distant mountain/map landscape
•	Compass subtly visible somewhere in the environment
•	Very subtle parallax
The form itself should remain clean and modern.
Content
WHO ARE YOU, EXPLORER?
Small supporting text:
Tell us a little about yourself so we can personalize your journey.
Then:
What should we call you?
Your nickname or first name
Optional
What is your current strand?
Cards:
•	Academic — STEM
•	Academic — ABM
•	Academic — HUMSS
•	TVL
•	Arts & Design
•	Sports
Then:
Current Year Level
Two cards:
Grade 11 | Grade 12
Make it very clear that the year level is for personalization only and does not affect the assessment score.
CTA:
CONTINUE →
Animation
On page load:
1.	Background settles
2.	Form panel slowly appears
3.	Input appears
4.	Strand cards reveal
5.	Year-level cards reveal
6.	Continue button becomes active
When Continue is clicked, don't instantly change pages.
Instead, use a map transition.
The camera moves forward and the environment transitions into the Journey Map.
________________________________________
2. JOURNEY MAP — THE MAIN HUB
This should be the most visually important application screen after the landing page.
Don't make this a conventional dashboard with three rectangular cards.
Make it an actual interactive fantasy island map.
Imagine:
The user is looking down at a magical map, and each assessment section is an island/location they must explore.
Main map
Three major locations:
🏝️ ISLAND 01
INTERESTS
Icon:
Compass / telescope / star
Description:
Discover what naturally draws your curiosity.
________________________________________
🏔️ ISLAND 02
SKILLS
Icon:
Mountain / sword / tools
Description:
Discover where your strengths and confidence lead.
________________________________________
🏛️ ISLAND 03
ACADEMICS
Icon:
Castle / scroll / book
Description:
See how your academic performance supports your path.
________________________________________
Progress
Instead of a normal progress bar, use:
COMPASS POINTS
For example:
N ─ NE ─ E ─ SE ─ S
Each completed section lights up another compass point.
Or visually:
COMPASS PROGRESS
◉ Interests
◉ Skills
◉ Academics
Completed sections could have a subtle glow.
________________________________________
3. JOURNEY MAP BEHAVIOR
This is important.
The user should be able to freely move between completed and available sections.
For example:
Nothing started
START ASSESSMENT
Once Interests is completed:
CONTINUE JOURNEY
The user can then return to Interests and review/change answers if your scoring model allows it.
The map should visually communicate status:
Not started
Island is slightly faded.
Available
Island is illuminated.
In progress
A small animated compass marker is traveling toward it.
Completed
Island becomes fully illuminated with a completion marker.
Current
Island has a subtle pulse/glow.
________________________________________
4. JOURNEY MAP — SIDE/UTILITY CONTROLS
Don't clutter the map.
Small controls can sit in the upper corner:
⚙ SESSION
•	Restart Assessment
•	Sound On / Off
Important:
Make it clear that this session data is temporary.
You don't need to repeatedly tell the user "session-only" everywhere. One small explanation can be enough.
________________________________________
5. INTERESTS — “DISCOVER WHAT DRAWS YOU”
This should not feel like a boring questionnaire.
Since you're using scenario-based cards, make each scenario feel like a small situation.
Example:
WHAT WOULD YOU RATHER DO?
Your team is given a problem with no obvious solution. What are you most likely to do?
Then cards representing different actions.
Instead of:
Option A
Option B
Option C
make each option feel like a decision.
For example:
🔍 Investigate
Look for patterns and figure out what is causing the problem.
💡 Create
Think of a new approach nobody has tried yet.
🤝 Collaborate
Gather everyone's ideas and work toward a solution together.
🎯 Organize
Break the problem into steps and create a plan.
This gives the assessment more personality.
Progress
At the top:
INTERESTS
Question 03 / 08
Then a small compass indicator.
At the bottom:
← BACK
NEXT →
________________________________________
6. INTERESTS VISUAL STYLE
Keep the fantasy environment but make the question card highly readable.
Background could be:
floating island + clouds + map
The question panel can look like a modern parchment / glass explorer panel.
Do NOT make it overly medieval.
The system is still an educational career tool.
________________________________________
7. SKILLS — “CLIMB YOUR STRENGTHS”
This section can use the mountain environment.
The visual metaphor is:
Skills are the mountains you are capable of climbing.
Use:
•	Mountain background
•	Clouds
•	subtle wind/snow particles
•	map lines
•	compass indicators
Assessment
Each statement appears one at a time.
Example:
I can explain a technical concept to someone who has never encountered it before.
Then the confidence slider:
Not Confident ←────────────→ Very Confident
You can use 1–5 or 1–7.
I'd recommend 1–5 for simplicity.
Show:
1 2 3 4 5
with descriptive labels.
Don't show the scoring logic to students.
________________________________________
8. ACADEMIC PERFORMANCE — “READ THE TRAIL”
This section should feel more grounded because the user is entering actual information.
Use a fantasy library / academy / observatory environment rather than another generic form.
Step 1
YOUR ACADEMIC TRAIL
Tell us about your academic performance.
Input:
General Average
_____
Then:
Best-Performing Subjects
Allow the student to select subjects from a list rather than typing everything manually if possible.
For example:
☐ Mathematics
☐ Science
☐ English
☐ Filipino
☐ ICT / Computer
☐ Business / Entrepreneurship
☐ Arts
☐ Social Sciences
☐ Other
Depending on your actual scoring system, you can allow multiple selections.
________________________________________
9. PROCESSING SCREEN — “CHARTING YOUR COURSE”
This is an opportunity for a really nice cinematic transition.
Don't show:
Loading...
Instead:
CHARTING YOUR COURSE
Small text:
Your answers are being mapped to possible career directions.
Then animate the compass.
Possible animation:
Compass → spinning → map lines appear → three islands connect → paths converge → destination appears
You can show subtle stages:
Analyzing interests...
Mapping strengths...
Reviewing academic trail...
Calculating matches...
Preparing your explorer report...
Don't make this unnecessarily long.
Around 2–4 seconds is enough for a polished transition.
________________________________________
10. RESULTS — “YOUR CAREER MAP”
This should feel like the user has finally reached a destination.
Instead of a generic:
Assessment Results
Use:
YOUR CAREER MAP
Small supporting line:
Based on your journey, these paths may be worth exploring.
Then prominently display:
TOP MATCH
Technology & Computing
92% Match
Potentially with a compass/star visual.
Then:
RECOMMENDED PATHS
Course cards such as:
BS Information Technology
94% MATCH
Short explanation.
EXPLORE THIS COURSE →
________________________________________
11. RESULT COURSE CARDS
Don't make them giant.
Each card should have:
Course Name
Match Percentage
Small visual indicator.
Short explanation:
Strong alignment with your interest in technology, problem-solving, and applied skills.
Then:
EXPLORE THIS COURSE
The match percentage should NOT imply:
"You should definitely take this course."
It should communicate:
"This course has a strong alignment with your assessment responses."
That distinction is important for an educational guidance system.
________________________________________
12. RESULTS PAGE — JOURNEY MAP VISUAL
You can make the ranked courses look like destinations on a map.
For example:
             ✦ YOUR TOP MATCH
                  │
                  │
          ┌───────┴───────┐
          │               │
       PATH 01          PATH 02
      BSIT 94%         BSCS 89%
          │               │
          └───────┬───────┘
                  │
               PATH 03
              IS 84%
Visually, this could be represented as a fantasy map with routes connecting different destinations.
That would make your Career Compass branding much stronger.
________________________________________
13. COURSE DETAIL — “EXPLORE THIS DESTINATION”
When the user clicks:
EXPLORE THIS COURSE
don't open a boring modal.
Transition into a course destination page.
Example:
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Small label:
CAREER PATH
Then sections:
OVERVIEW
What the course is about.
WHAT YOU'LL STUDY
Key subjects.
WHERE CAN YOU STUDY?
School cards:
School Name
Location
Public / Private
WHERE CAN THIS PATH LEAD?
Career opportunities:
•	Software Developer
•	Web Developer
•	Systems Analyst
•	Database Administrator
•	etc.
CAREER OUTLOOK
Salary range / relevant information.
Be careful with salary data: show it as a range with source/date context, because salary information changes.
________________________________________
14. GUIDANCE TIPS
This could be one of the most useful parts of your system.
Use a small section:
BEFORE YOU TAKE THIS PATH
Then:
Admission Requirements
Scholarships
Certifications
Recommended Preparation
For Grade 11:
What you can start preparing for now.
For Grade 12:
What you may want to prepare before applying.
This is where your Grade 11/12 information becomes useful without affecting the assessment score.
________________________________________
15. BACK TO JOURNEY MAP
Keep a persistent secondary navigation:
← BACK TO JOURNEY MAP
This should always allow the user to return to the main hub.
Don't force them to restart.
________________________________________
16. EXPLORER REPORT
On the Results page:
DOWNLOAD MY EXPLORER REPORT
This should generate a polished PDF rather than a plain data dump.
The report could contain:
COVER
CAREER COMPASS
Explorer Report
Name/nickname if provided.
Date/session.
________________________________________
YOUR CAREER MAP
Top category.
Top recommended courses.
Match percentages.
________________________________________
YOUR EXPLORATION PROFILE
Interest summary.
Skills summary.
Academic summary.
________________________________________
YOUR RECOMMENDED PATHS
Ranked recommendations.
________________________________________
EXPLORE FURTHER
Course information.
Schools.
Career opportunities.
Guidance tips.
________________________________________
IMPORTANT NOTE
The assessment is a career exploration and guidance tool, not a definitive determination of what career/course a student must pursue.
This is especially important because your system is providing recommendations based on a rule-based scoring model.
________________________________________
17. PDF CONFIRMATION
After generating the report, don't just say:
Download successful.
Make it feel like the end of the journey.
Background:
A bright fantasy map / sunrise / distant mountain.
Center:
YOUR EXPLORER REPORT IS READY
Small text:
Your journey has been mapped. Your next destination is yours to explore.
Buttons:
DOWNLOAD REPORT
PRINT REPORT
Secondary:
← BACK TO RESULTS
________________________________________
18. THE COMPLETE USER JOURNEY
The entire application would then feel like this:
LANDING PAGE
🌌 Closed Compass
↓
Compass opens
↓
Cloud transition
↓
STUDENT INFO
🧭 Who are you, Explorer?
↓
JOURNEY MAP
🏝️ Three assessment destinations
↓
INTERESTS
🔍 Discover what draws you
↓
SKILLS
🏔️ Discover your strengths
↓
ACADEMICS
📜 Read your academic trail
↓
PROCESSING
🧭 Charting your course
↓
RESULTS
🗺️ Your Career Map
↓
COURSE DETAIL
🏛️ Explore this destination
↓
EXPLORER REPORT
📜 Your journey mapped
↓
FINAL CTA
✨ Continue exploring your future.
________________________________________
19. DESIGN PRINCIPLE
The most important thing is to maintain one visual world across the entire system.
Do not make the landing page:
Fantasy cinematic website
and then make the assessment:
Generic white questionnaire dashboard.
Instead, establish two layers.
WORLD LAYER
Fantasy:
•	maps
•	islands
•	mountains
•	forests
•	clouds
•	compass
•	atmospheric effects
•	parallax
•	cinematic transitions
UI LAYER
Modern:
•	clean cards
•	readable typography
•	accessible controls
•	clear buttons
•	progress indicators
•	forms
•	sliders
•	responsive layouts
That combination gives you:
Fantasy exploration × modern educational technology.
That is the visual identity I would push for Career Compass.
:::