"""Build the defense reference without changing application files or scoring.
Run with the bundled Python runtime (reportlab and pypdf).
"""
from pathlib import Path
import json
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PAPER = Path(r'C:\Users\Charlene\OneDrive\Documents\0 CAPSTONE\FINAL CHAPTER 1-5.pdf')
OUT = ROOT / 'Career_Compass_Defense_QA.pdf'
items = json.loads((ROOT/'data/v2/items.json').read_text(encoding='utf-8'))
links = json.loads((ROOT/'data/v2/links.json').read_text(encoding='utf-8'))
assert len(links) == 85 and len(items['skills']) == 15
assert all(sum(len(v) if isinstance(v, list) else 1 for v in x.values()) == 15 for x in links.values())
assert len(PdfReader(PAPER).pages) == 77

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCC', fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=colors.HexColor('#18364a'), spaceAfter=9))
styles.add(ParagraphStyle(name='SectionCC', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=colors.HexColor('#18364a'), spaceBefore=12, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name='MismatchCC', fontName='Helvetica', fontSize=9.5, leading=12.5, spaceAfter=8))
styles.add(ParagraphStyle(name='QuestionCC', fontName='Helvetica-Bold', fontSize=10.5, leading=14, spaceAfter=4))
styles.add(ParagraphStyle(name='AnswerCC', fontName='Helvetica', fontSize=10, leading=14, spaceAfter=9))
styles.add(ParagraphStyle(name='SmallCC', fontName='Helvetica', fontSize=8, leading=10.6, spaceAfter=5))
styles.add(ParagraphStyle(name='CellCC', fontName='Helvetica', fontSize=8.4, leading=11))
styles.add(ParagraphStyle(name='FactCC', fontName='Helvetica', fontSize=8.4, leading=11.2))
story = []
def p(text, style='AnswerCC'):
    return Paragraph(escape(text).replace('\n','<br/>'), styles[style])
def add(text, style='AnswerCC'):
    story.append(p(text,style))
def heading(text): add(text,'SectionCC')
def table(rows, widths, style='CellCC'):
    t=Table([[p(str(c),style) for c in row] for row in rows], colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e5edf1')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#bac6cc')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
    story.append(t)
def source(code): return '[Code: '+code+']'
def paper(ch, pages): return f'[Paper: Ch.{ch}, p.{pages}]'
SC=source('lib/scoringV2/score.js; data/v2/links.json')
RK=source('lib/scoringV2/rank.js; lib/recommendations.js')
IT=source('data/v2/items.json; lib/scoringV2/validate.js')
RO=source('lib/routeResolution.js; lib/valleySelection.js')
LS=source('lib/sessionSchema.js; lib/browserStorage.js; lib/sessionStorage.js')
OF=source('components/OfflineMode.js; public/offline-worker.js; scripts/build-offline.mjs')
DS=source('data/v2/courses-master.json; data/v2/course-details.json; data/v2/schools.json')
SA=source('data/v2/salary-sources.json')
EV=paper(4,'63-66')

add('Career Compass | Defense Q&A','TitleCC')
add('Part A: Quick Fact Sheet','SectionCC')
add('Verified 30 October 2026. Paper page tags use printed page numbers; PDF viewer page = printed page + 1. Code describes this local repository, not a verified copy of the live deployment. System features and scoring were not edited.','SmallCC')
table([
['Area','Verified facts and sources'],
['Size and features','85 courses; 9 course groups; 19 named features (F-01 to F-19). 8 interest scenarios x 4 options = 32 options; 15 skill statements; 4 academic steps in each route. '+source('data/v2/courses-master.json; data/v2/items.json; lib/valleySelection.js')+' '+paper(4,'51-53')],
['Points per course','Interest +3 per linked choice (max 6); two skill ratings of 1-5 (max 10); certificates +3 per linked category (max 6). Old: strand +4, subjects +3 each (max 6). New: electives +4 each (max 12), linked core +3 (max 3). '+SC],
['GWA and maxima','GWA tiers: below 75 = 0; 75 to below 80 = 1; 80 to below 85 = 1; 85 to below 90 = 2; 90 to below 95 = 2; 95-100 = 3. Bonus once, conditional on route alignment. Old maximum 35; new 40. '+SC],
['Ties and links','Code order: total, skills, interests, then a repeatable SHA-256 tie key; unique ranks 1, 2, 3. Paper differs (see mismatch section). 15 stored links per course; 1,275 total. '+RK+' '+source('data/v2/links.json')],
['Dataset and sources','Course names/groups and CHED basis; descriptions, study topics, careers, salary estimates, schools, scholarships and guidance tips; fixed scoring links. Paper cites DepEd/guidance references, CHED, school sites and industry reports. Salary metadata: October 2026; Jobstreet, Indeed and DBM references. '+DS+' '+SA+' '+paper(4,'40-41')],
['Technology and saving','Next.js 16.3.1, React, JavaScript, Tailwind CSS 4, App Router, GSAP, Lenis and jsPDF; Vercel hosting. No login, database or application scoring backend; a web host still serves files. localStorage keeps the journey on the same browser/device. '+source('package.json; lib/sessionSchema.js; lib/browserStorage.js')+' '+paper(4,'45-46')],
['Offline Mode','Opt-in download while online; a service worker saves public app files in Cache Storage. Requires production build, HTTPS/localhost and browser support; external sites still need internet. Clearing site data can remove both progress and offline copy. '+OF],
['Evaluation','30 teachers/guidance designates, 10 per school; ISO/IEC 25010 (2023), 18 items. Means: Functional Suitability 4.77; Reliability 4.83; Interaction Capability 4.73; overall 4.77 (2,574/540). Highest: Item 18, 5.00; lowest: Item 11, 4.53. All interpreted Strongly Agree. '+paper(3,'25, 30-34')+' '+EV],
['Interview','Same 30 at Balogo HS, Ponso NHS and Barayong NHS; 27 answered desired features. Financial limits 25/30; family influence 18/30; automated recommendations 15/27. '+paper(3,'25')+' '+paper(4,'38-40')],
['8 requirements','Collect interests/skills/academics; recommend courses/careers; show course/career/school/salary information; printable result; simple interface; protect user data; limited-internet access; central career information. '+paper(4,'40')],
],[91,432], 'FactCC')
story.append(PageBreak())
heading('Mismatches to Fix or Prepare For')
add('This section records conflicts for defense preparation only. No system change is proposed or applied. A paper claim and a code observation are kept separate.')
mismatches=[
('M1. Tie-break order and shared ranks','Paper: total, then interests, skills, academic points; remaining ties share a rank and appear alphabetically (example 1, 1, 3). Code: total, then skills, interests, then SHA-256 key; recommendations assign a distinct index + 1 rank. Say that these sources disagree and explain the actual demonstrated code behavior. '+paper(4,'51')+' '+RK),
('M2. Highest evaluation item','Demo claim: highest item 4.90. Paper: 4.90 is Item 9 and is highest only within Reliability; the overall highest is Item 18 at 5.00 (30 ratings of 5). Use 5.00 for the overall highest item. '+paper(4,'64-67')+' [Demo: user-supplied numbers to verify]'),
('M3. PDF language','Paper F-17 says the PDF report is in English. Code passes the chosen language to buildExplorerReport, accepts fil, and translates report text; it supports Filipino report generation. Do not promise that every proper course or school name is translated. '+paper(4,'53')+' '+source('app/report/page.js; lib/explorerReport.js; lib/i18n/translate.js')),
('M4. Identity and grade do not directly add points','Paper says profile, interests, skills and academics are used to compute course scores. Code excludes nickname/avatar from score and tie seed; grade determines route rather than adding direct points. Explain that profile personalizes the report and selects the route. '+paper(4,'41')+' '+source('lib/scoringV2/score.js; lib/scoringV2/rank.js; lib/routeResolution.js')),
('M5. Older project instructions and feature table','instructions.md and docs/features-table.md describe 24 courses, 10 skills, 15 planned features and percentage scoring. Current data and linked engine use 85 courses, 15 skills, raw scores, and the paper lists 19 implemented features. Treat these repository documents as outdated, not as proof of current behavior. '+source('instructions.md; docs/features-table.md; lib/recommendations.js; data/v2/courses-master.json')+' '+paper(4,'50-53')),
('M6. Earlier scoring report is outdated','docs/scoring-v2-report.md describes a new-route maximum of 51, a cluster bonus and elective best-subject scoring. Current score.js has no cluster bonus, accepts core best-subject choices only, and has maximum 43; the final paper agrees with 43. '+source('docs/scoring-v2-report.md; lib/scoringV2/score.js; lib/scoringV2/validate.js')+' '+paper(4,'50')),
('M7. Equal link counts are not proof of fairness','Paper links equal counts to equal chances to score. Code confirms equal stored counts, but old route activates 9 links and new route 12; only up to 3 of 5 elective links can be selected, and GAS receives no strand/GWA bonus. Equal structure does not establish equal outcomes for real students. '+paper(4,'50-51')+' '+SC+' '+IT),
('M8. GWA input ranges differ by layer','The academic screen accepts 60-100 with up to two decimals. The engine validator accepts finite numeric values from 0-100 and its bonus is zero below 75; this is a UI-versus-engine difference, not evidence that the live form accepts 0. '+source('lib/valleySelection.js; app/journey/academic/page.js; lib/scoringV2/validate.js; lib/scoringV2/score.js')),
]
for title,answer in mismatches:
    story.append(KeepTogether([p(title,'QuestionCC'),p(answer,'MismatchCC')]))
add('Evidence limit: the paper reports validation by three guidance designates, but signed validation sheets, raw survey forms, and interview transcripts were not found in the supplied sources. The reason each exact point value was chosen is not stated in detail. Not found, prepare an honest answer. '+paper(4,'41, 45')+' [Repository search: docs/, data/, project PDFs]','MismatchCC')
story.append(PageBreak())
heading('Part B: Feature Cheat Sheet')
add('Official feature IDs and names follow manuscript Table 9. Each entry states the current behavior and its purpose; the scoring and report-language conflicts remain listed above. '+paper(4,'51-53'),'SmallCC')
features=[
('Explorer-Themed Landing Page','Introduces the journey and links to About and How It Works.','Helps users understand the tool before starting.','app/page.js; app/about/page.js; app/how-it-works/page.js'),
('Basecamp Profile and Curriculum Route','Collects optional name/avatar and required grade/route choices.','Personalizes the journey and opens the correct academic questions.','app/intake/page.js; lib/routeResolution.js'),
('Journey Map Navigation Hub','Shows progress across Mountains, Forest and Valley.','Gives students one place to follow the assessment.','app/journey/page.js'),
('Interests Assessment Module','Asks eight scenarios with four choices each.','Collects activity preferences used in course ranking.','app/journey/interests/page.js; data/v2/items.json'),
('Skills Assessment Module','Collects 15 self-ratings from 1 to 5.','Adds the student\'s stated confidence in relevant skills.','app/journey/skills/page.js; data/v2/items.json'),
('Academic Performance Module (Valley)','Collects four steps for either curriculum route.','Adds academic evidence and certificates to recommendations.','app/journey/academic/page.js; lib/valleySelection.js'),
('Rule-Based Weighted Scoring Engine','Adds linked points and ranks all 85 courses.','Produces repeatable recommendations from fixed rules.','lib/scoringV2/score.js; lib/scoringV2/rank.js'),
('Static Course and Career Dataset','Stores course, career, salary, school and guidance information.','Provides reference material beside each recommendation.','data/v2/courses-master.json; data/v2/course-details.json; lib/courseDataV2.js'),
('Ranked Results','Shows the top five and allows exploration of all 85 courses without numeric scores.','Gives a shortlist while leaving other options open.','app/results/page.js; app/results/ResultsControls.js; lib/recommendations.js'),
('Course Detail Explorer','Shows course overview, study topics, careers, schools and guidance information.','Helps students examine practical details before deciding.','app/results/[courseId]/page.js; app/results/[courseId]/FieldJournal.js; lib/courseDataV2.js'),
('Printable PDF Report Generator','Downloads or prints an Explorer Report in the selected supported language.','Gives a portable reference for counseling.','app/report/page.js; lib/explorerReport.js'),
('Responsive Web Access','Adapts pages for desktop, laptop and mobile screens.','Allows access through common available devices.','app/globals.css; app/intake/basecamp.css; app/results/results.css'),
('Local Progress Recovery','Restores saved answers in the same browser and device.','Lets users continue after refresh or reopening.','lib/browserStorage.js; lib/sessionStorage.js; lib/useSessionAnswers.js'),
('Leave and Restart Warnings','Warns on failed saving and confirms restart or trail discard.','Reduces accidental loss of answers.','lib/useUnsavedProgressWarning.js; components/TrailExit.js; app/journey/page.js'),
('Guided Sequential Progression','Unlocks trails in order and shows completion achievements.','Keeps the assessment complete before showing results.','components/JourneyAccess.js; app/journey/page.js; components/CelebrationDialog.js'),
('Course Comparison','Shows two selected courses side by side.','Helps users compare possible choices.','lib/courseComparison.js; app/results/ResultsControls.js'),
('English and Filipino Language Switch','Changes the interface and supported report text between English and Filipino.','Helps users read guidance in a familiar language.','components/LanguageProvider.js; components/LanguageSwitcher.js; lib/explorerReport.js'),
('Opt-In Offline Mode','Saves public app resources for later offline use.','Supports access after a completed download in limited-connectivity areas.','components/OfflineMode.js; public/offline-worker.js'),
('Atlas Tutorial and Journey Guide','Explains how to use the map and journey controls.','Helps first-time users follow the flow.','components/AtlasTutorial.js; app/journey/page.js'),
]
for n,(name,does,why,files) in enumerate(features,1):
    story.append(KeepTogether([p(f'F-{n:02d} | {name}','QuestionCC'),p('Does: '+does+' Why: '+why+' '+source(files)+' '+paper(4,'51-53'))]))
story.append(PageBreak())
heading('Part C: Hard Questions and Answers')
add('Short speaking answers. A statement that is only reported by the paper is labeled as such; it is not an independent audit of the original research records. Suggested future work is not a current feature.','SmallCC')
groups=[]
def group(title, rows): groups.append((title,rows))
group('1. Problem, objectives, and scope',[
('What problem does Career Compass address?','It organizes career guidance where advice and records are often handled by hand and counselor time is limited. It connects student interests, skills and academics to course information.',paper(1,'3-5')+' '+paper(4,'38-40')),
('What are your three objectives?','Identify the required input data, design and develop the rule-based system, and evaluate its functional suitability, reliability and interaction capability.',paper(1,'4')),
('Who should use the system?','It is intended for Philippine Senior High School students in Grades 11 and 12. Counselors can use the report as a reference during guidance.',paper(1,'5-6')+' '+paper(4,'47')),
('What is outside the current scope?','The system has no accounts, database or counselor dashboard. It covers its 85 listed courses and does not make final career decisions.',paper(1,'5-6')+' '+paper(4,'47')),
('Does it replace a guidance counselor?','No. The results support a discussion, and the student and counselor still make the final decision.',paper(1,'6')+' '+source('lib/explorerReport.js')),
('Can you claim it improved actual career outcomes?','No measured improvement in student enrollment or career outcomes is reported. Students were not evaluation participants.',paper(3,'25')+' '+paper(5,'73')),
])
group('2. Methodology and respondents',[
('What research design did you use?','The paper uses a descriptive-developmental design: it describes school guidance needs and develops a system from those needs.',paper(3,'24')),
('Why did you use RAD?','The paper chose Rapid Application Development to build the system in stages and use feedback. Its phases are Requirements Planning, User Design, Construction and Cutover.',paper(3,'27-28')),
('Who were the respondents?','Thirty teachers and guidance designates participated, ten each from Balogo High School, Ponso National High School and Barayong National High School. The same group joined the interviews and evaluation.',paper(3,'25')),
('How were respondents selected?','They were selected through purposive sampling, meaning people with relevant guidance duties were invited. Available staff who agreed became participants; this was not random sampling.',paper(3,'25')),
('Why teachers and guidance designates?','They handle or take part in school career guidance and can describe its needs. Their ratings still cannot stand for the experience of student users.',paper(3,'25')+' '+paper(5,'73')),
('Why were students not included?','The paper set its evaluation scope to teachers and guidance designates. A further reason for excluding students is not stated: Not found, prepare an honest answer.',paper(1,'6')+' '+paper(3,'25')),
('Who validated the questions and scoring rules?','The paper reports validation by the three guidance designates of the participating schools. Detailed validation scores, signed forms and the exact validation procedure are not included in the supplied paper.',paper(4,'41, 45')),
('Why only 30 respondents and three schools?','The paper identifies the invited available guidance staff and the three participating schools. A statistical sample-size calculation or power analysis is not provided: Not found, prepare an honest answer.',paper(3,'25-26')),
('Why are some interview figures out of 27 instead of 30?','All 30 were interviewed, but only 27 answered the desired-features question. A respondent could mention several themes, so the theme counts do not add up to the sample size.',paper(4,'38-40')),
('What were the eight requirements?','Collect interests, skills and academics; recommend courses and careers; show course, career, school and salary information; and print results. Also provide a simple interface, data protection, low-connectivity access and one place for career information.',paper(4,'40')),
])
group('3. Scoring system',[
('How does one course get its score?','Its total is interest points plus the two linked skill ratings, certificate points and the active route\'s academic points. All 85 courses are scored from the same validated answers.',SC),
('Why exactly 3, 4 and these other point values?','The paper says the researchers set the rules from interview findings and guidance references, then had three guidance designates validate them. A detailed numerical study showing why these exact values are best is not supplied: Not found, prepare an honest answer.',paper(4,'41, 45')),
('What are the maximum totals?','Old route: 6 interests + 10 skills + 6 certificates + 4 strand + 6 subjects + 3 GWA = 35. New route: 6 + 10 + 6 + 12 electives + 3 core + 3 GWA = 40.',SC+' '+paper(4,'50')),
('Does answering eight interest questions give 24 points to one course?','No. Each course links to only two interest choices from different questions, so it can receive at most 6 interest points.',source('data/v2/links.json; scripts/verify-links.mjs')+' '+SC),
('How are skill ratings used?','Each of the course\'s two linked skill ratings is added directly, from 1 to 5 each. These are self-ratings, not a tested measure of actual ability.',SC+' '+IT),
('What is the GWA bonus?','The bonus is 0 below 75, then 1, 1, 2, 2 and 3 at the 75, 80, 85, 90 and 95 thresholds. It is added only once when the course has the required academic match.',SC),
('Does a high GWA increase every course equally?','No. Old route requires the linked strand to match; new route requires at least one linked elective or the linked core subject to match.',SC),
('What happens to GAS students?','GAS is accepted but has no linked course strand, so it gives no strand points or GWA bonus. Interests, skills, subjects and certificates still contribute.',SC+' '+source('data/v2/links.json; lib/scoringV2/engine.test.js')),
('Is the GAS treatment fair?','It is the current rule, but equal treatment or fairness for real GAS students has not been established. The lack of strand and GWA awards is a limitation to explain openly.',SC+' '+paper(5,'73')),
('What if courses tie?','The current code compares total, then skill points, then interest points, and finally a repeatable SHA-256 tie key. The paper describes a different order and shared ranks, so that conflict must be disclosed.',RK+' '+paper(4,'51')),
('Is the hash tie-break random or proof that one course is better?','It is a repeatable calculated key based on the scoring answers and course ID. It gives an order after the scoring checks tie; it adds no evidence that one course is more suitable.',source('lib/scoringV2/rank.js; lib/scoringV2/sha256.js')),
('Why not show a match percentage?','The system uses raw points to rank courses and shows relative compass arcs. A percentage could be mistaken for a proven chance of success, which the study has not measured.',paper(4,'51, 62')+' '+source('lib/recommendations.js')),
('How do you check scoring accuracy?','Code tests check point rules, boundaries, ties and the 38/43 maxima for every course. These verify the calculation, not whether a recommendation predicts student success.',source('lib/scoringV2/engine.test.js; scripts/verify-links.mjs')+' '+paper(4,'62')),
('Do equal links prove equal chances or fairness?','No. All courses have 15 stored links, but the active route and chosen answers decide which links can earn points. The paper does not establish real-student fairness.',SC+' '+paper(4,'50-51')+' '+paper(5,'73')),
('Will editing an earlier answer keep adding points?','No. Recommendations are rebuilt from the current validated session answers; the engine calculates each course again rather than accumulating earlier totals.',source('lib/recommendations.js; lib/scoringV2/fromSession.js; lib/scoringV2/score.js')),
('Do name, avatar or school affect the result?','Name and avatar do not add points or enter the tie seed. Grade selects the route; school is not a scoring input, and stored pilotSchoolId is normalized to null.',source('lib/scoringV2/rank.js; lib/scoringV2/score.js; lib/sessionSchema.js; lib/routeResolution.js')),
])
group('4. Rule-based versus AI or machine learning',[
('Does Career Compass use AI?','No. It uses fixed course links, point rules and sorting; it does not train a model or learn from users.',SC+' '+RK+' '+paper(1,'5')),
('Why use rules instead of machine learning?','The paper explains that fixed rules are easier to check and do not require a large training dataset. It recommends comparing other approaches in future work with real student data.',paper(5,'73, 75')),
('Why is it still a decision support system?','It combines student inputs with course data and a scoring model to present options for a human decision. The counselor and student keep the final decision.',paper(1,'4-6')+' '+SC),
('Does it become smarter with more users?','No. Its rules and static files do not change when users answer the assessment. Updating them requires a reviewed code or data change and deployment.',SC+' '+DS+' '+paper(4,'41')),
])
group('5. Data and dataset',[
('What does the dataset contain?','It contains 85 course names and groups, descriptions, study topics, careers, salary estimates, schools and guidance information. Separate item and link files connect answers to courses.',DS+' '+source('data/v2/items.json; data/v2/links.json; lib/courseDataV2.js')),
('Where did the data come from?','The paper cites CHED program information, school information, DepEd and guidance references, and salary or industry reports. The salary file lists Jobstreet, Indeed and a DBM salary circular as references.',paper(3,'26')+' '+paper(4,'40-41')+' '+SA),
('How current are the salary figures?','The salary metadata says updated October 2026. These are fixed estimates in the app, not live salary feeds or guaranteed offers.',SA),
('How were salary ranges made?','The metadata describes using comparable Jobstreet monthly salary benchmarks and widening ranges for factors such as experience, location and employer size. Some roles use a related occupation as an estimate.',SA),
('Who independently validates every salary and school entry?','The paper describes published sources and guidance validation of the assessment and scoring. A named independent validator for every salary and school entry is not identified: Not found, prepare an honest answer.',paper(3,'26')+' '+paper(4,'41, 45')+' '+SA),
('How is the dataset updated?','It is stored in bundled JSON files, so updates require editing the source data and rebuilding or redeploying the site. The paper recommends annual updates; an actual maintenance owner and completed annual schedule are not stated.',DS+' '+source('package.json')+' '+paper(5,'74')),
('Are all Philippine college courses covered?','No. The app is limited to its 85-course master list in nine groups. It does not claim a complete national list.',source('data/v2/courses-master.json')+' '+paper(1,'5')),
('Does a listed school guarantee admission or an available program?','No. School records include source and review flags, and the course data provides guidance rather than an admission decision. Students should confirm current offerings and requirements with the school.',source('data/v2/schools.json; lib/courseDataV2.js')+' '+paper(5,'74')),
])
group('6. Privacy, security and the Data Privacy Act of 2012',[
('Why is there no login?','The approved system lets students use guidance without an account and saves progress locally. It has no account database or registered-user role.',paper(1,'5')+' '+paper(4,'47')+' '+LS),
('What information is saved?','The local session includes the optional name/avatar, grade, route, answers, completion flags, comparisons, journal history and report metadata. Separate browser preferences include language and sound.',LS+' '+source('components/LanguageProvider.js; lib/sound.js')),
('Where are student answers stored?','They are saved in localStorage for this site in the same browser profile and device. The scoring code reads those answers locally and does not send them to a scoring server.',LS+' '+source('lib/recommendations.js; lib/scoringV2/fromSession.js')+' '+paper(4,'46')),
('Does local storage mean the data is fully secure?','No. The app does not provide account-based protection or encryption of the saved journey. People with access to that browser profile may be able to read its saved data.',source('lib/browserStorage.js; lib/sessionStorage.js; lib/sessionSchema.js')),
('How can a user remove saved answers?','Restart clears the journey and related journey records; clearing the site\'s browser data also removes local saves. Downloaded reports are separate files and must be managed separately.',source('lib/sessionStorage.js; lib/browserStorage.js; lib/explorerReport.js')),
('How does the study address the Data Privacy Act?','The paper reports voluntary participation, explained purpose, private identities, limited access and planned disposal of research responses. The app also uses an optional name and local saving; these are the paper\'s privacy measures, not proof of a legal compliance audit.',paper(3,'34-36')),
('Can a counselor retrieve results from another device?','There is no cloud account or central student record. The student can bring the downloaded or printed report to the counselor.',LS+' '+paper(4,'47')),
])
group('7. Offline Mode and technical questions',[
('How does Offline Mode work?','After the user opts in online, a service worker downloads public app resources into browser Cache Storage. A service worker is a browser helper that can answer requests using that saved copy.',OF),
('Does offline use work on the first visit without internet?','No. The site must first be opened online and the offline download must complete. The required saved resources must still be available in that browser.',OF+' '+paper(1,'5')),
('What still needs internet?','External school, salary-source and scholarship websites still need a connection. Downloading the first offline copy or a new version also needs internet.',OF),
('What happens if the cache is cleared?','Removing the offline cache removes the saved app copy, so online access is needed to download it again. Clearing all site data can also remove localStorage answers and preferences.',OF+' '+LS),
('Which browsers support it?','The paper specifies current Chrome or Edge. The code requires service workers, Cache Storage and HTTPS or localhost; it does not establish support for every browser and version.',paper(3,'29-30')+' '+source('components/OfflineMode.js')),
('What if an offline download fails or storage is full?','The worker removes the incomplete new cache and does not replace a previous ready copy with it. The user must retry with enough storage and a working connection.',source('public/offline-worker.js; components/OfflineMode.js')),
('Can an update interrupt an assessment?','Applying a waiting offline update is blocked while an assessment or processing is open in any checked app window. The user is asked to finish or leave before updating.',OF),
('Is there really no server at all?','A web host serves the site and its assets. There is no application database or remote scoring service; development and standard Next hosting can still use a web server.',source('package.json; lib/recommendations.js; scripts/build-offline.mjs')+' '+paper(4,'45-46')),
('Does turning Offline Mode off delete answers?','The offline cleanup removes its worker and caches. Journey answers are stored separately in localStorage and are not cleared by that cleanup.',source('components/OfflineMode.js; lib/sessionStorage.js')),
])
group('8. Curriculum questions',[
('How do Grade 11 and Grade 12 routes differ?','Grade 11 is locked to the new curriculum route. Grade 12 directly chooses old or new; the current route resolver does not ask a pilot-school question.',RO+' '+paper(4,'47')),
('What are the four old-route academic steps?','Strand, strongest subjects, GWA, and Certificates and Achievements. The user chooses one strand and one to three subjects.',RO+' '+IT),
('What are the four new-route academic steps?','Electives, core subjects, GWA, and Certificates and Achievements. The user may choose zero to three electives and one to three core subjects.',RO+' '+IT),
('Do curriculum clusters give extra points?','No. The current scoring engine has no cluster component. Elective group headings are labels, not another scoring award.',SC+' '+source('app/journey/academic/page.js')),
('What if the student has no electives or certificates yet?','Empty electives and certificates are allowed and give no points in those components. A linked core subject can still qualify a new-route course for the GWA bonus.',IT+' '+SC),
('Are you claiming official DepEd endorsement?','The paper uses DepEd references to explain curriculum support, but an official endorsement of Career Compass is not provided. Not found, prepare an honest answer.',paper(2,'10-11')+' '+paper(4,'41')),
])
group('9. Evaluation results',[
('Which ISO quality areas did you evaluate?','The paper uses the 2023 ISO/IEC 25010 reference and selects Functional Suitability, Reliability and Interaction Capability. It does not evaluate every quality area in the standard.',paper(3,'30-32')),
('What were the category and overall means?','Functional Suitability was 4.77, Reliability 4.83 and Interaction Capability 4.73. The overall mean was 4.77, interpreted as Strongly Agree.',EV),
('How is the overall mean calculated?','The paper adds 2,574 rating points across 540 item responses, giving 4.7667, rounded to 4.77. These are 30 people answering 18 items, not 540 people.',paper(4,'66')),
('What were the highest and lowest items?','Item 18, clear buttons, labels and options, was highest at 5.00. Item 11, recognizing the career-guidance purpose, was lowest at 4.53; Item 9\'s 4.90 was highest only in Reliability.',paper(4,'64-67')),
('Why did the lowest item score lowest?','The paper suggests that the first screens could explain the purpose more clearly. That is an interpretation of ratings; a confirmed cause from follow-up interviews is not supplied.',paper(4,'65-66')),
('What does Strongly Agree mean?','The paper assigns a mean of 4.21 to 5.00 to Strongly Agree. It means high agreement with the survey statements, not proof of perfect software or correct future career choices.',paper(3,'34')+' '+paper(4,'62, 66')),
('Could using the same people for interviews and evaluation cause bias?','Yes, that is a possible limitation because the same group described the needs and rated the result. The paper does not measure the size of that bias or report an independent student evaluation.',paper(3,'25')+' '+paper(5,'73')),
('Does 4.77 mean 95.4% recommendation accuracy?','No. The paper\'s 95.4% is the rounded rating mean divided by the maximum rating of 5. The paper explicitly says its tests do not measure real-student recommendation accuracy.',paper(4,'62, 66')),
('Does this make the system ISO-certified?','No ISO certification is documented. The paper describes an evaluation based on three selected quality characteristics, using its questionnaire.',paper(3,'30-32')+' '+paper(4,'61-66')),
])
group('10. Limitations and future work',[
('What are the main limitations?','The system has 85 courses, fixed data and rules, and depends on honest self-reported answers. The evaluation involved staff from three schools and did not test student outcomes.',paper(1,'5-6')+' '+paper(5,'73')),
('What should future work test first?','The paper recommends testing with Senior High School students, including clarity, experience and later choices. That would address a limit that the current staff evaluation cannot answer.',paper(5,'75')),
('Will you add a database or counselor dashboard now?','No. Those are listed only as future recommendations in the paper and are outside the approved current system. No such feature is part of this defense artifact or current scope.',paper(5,'74-75')+' '+source('instructions.md')),
('What if a student gives false grades or inflated ratings?','The app checks allowed values and completeness, not whether the student\'s claims are true. The paper warns that inaccurate answers may produce unsuitable recommendations.',IT+' '+paper(1,'5')),
])
group('11. Approval and impact',[
('Why should the panel approve this project?','It delivers a working guidance flow with two curriculum routes, 85 course profiles, local saving, offline access and a portable report. The paper reports high staff ratings while clearly limiting claims about actual student outcomes.',paper(4,'47, 50-53, 66')+' '+paper(5,'73')),
('How can it help a busy counselor?','The report organizes the assessment profile and suggested courses before a discussion. Actual time saved was not measured, so we should describe this as intended support.',paper(4,'39, 47')+' '+paper(5,'75')),
('Does the system solve financial barriers?','No. It provides scholarship and school information to support planning, but it does not provide funding or guarantee that a student can afford a course.',paper(4,'40, 53')+' '+paper(5,'74')),
('How is success supported by your evidence?','Component checks support that the implementation follows its rules, and the staff survey supports favorable views of the selected quality areas. Neither proves long-term benefit to students.',paper(4,'62-66')+' '+paper(5,'73')),
])
group('12. Tricky attack questions',[
('Is this just a quiz?','The questions collect inputs, but the tool also applies a fixed ranking model and shows course, career, school and salary information. The report helps students and counselors discuss options.',paper(4,'47, 50-53')+' '+SC),
('Why should we trust your point values?','They are visible, repeatable and reported as validated by the three guidance designates. That supports review of the rules, but we do not claim that the values are scientifically optimal or predict student success.',paper(4,'41, 45, 62')+' '+SC),
('What if the top course is unaffordable?','The result is a starting point, and the student can explore other courses, schools and scholarship information. Affordability is not a scoring input, so the counselor must discuss the family\'s situation.',SC+' '+paper(4,'53')+' '+paper(5,'74')),
('How is this different from existing tools?','The paper\'s stated contribution is one rule-based tool covering both old and strengthened SHS routes with local course information. It does not prove that no similar product exists anywhere.',paper(1,'3')+' '+paper(2,'14-15')),
('What if the family disagrees with the recommendation?','The result does not overrule the family or student. It gives information for a discussion; family influence was reported by 18 of 30 interviewees.',paper(1,'6')+' '+paper(4,'39')),
('If the method is deterministic, why can a tied result change?','The final tie key depends on the full scoring-answer seed, so changing answers can change the order of otherwise tied courses. Identical scoring inputs in the same version give the same order.',source('lib/scoringV2/rank.js')),
('Can students manipulate the browser data?','There is no protected central student record, and local answers can be changed in the browser. This is a guidance tool rather than a secure official grade or admissions record.',LS+' '+IT+' '+paper(1,'6')),
('What if the panel asks for proof beyond your available records?','We should present only the code, paper and actual records we can show. If the requested detail is absent, say: Not found, prepare an honest answer.',paper(4,'62')+' [Evidence policy: this guide; source limits noted above]'),
])
counter=0
for title,rows in groups:
    heading(title)
    for q,a,s in rows:
        counter+=1
        story.append(KeepTogether([p(f'Q{counter:02d}. {q}','QuestionCC'),p('A. '+a+' '+s)]))
assert counter>=60
story.append(PageBreak())
heading('Part D: Code-to-Paper Checks')
add('OK means the stated value is supported by the named source; it does not mean independent proof of the research records. MISMATCH identifies a conflict. All requested demo numbers are included below.','SmallCC')
checks=[]
def check(n,v,status,s): checks.append([n,v,status,s])
check('85 courses','85 in current master list','OK','Code: data/v2/courses-master.json; Paper: Ch.4, p.50')
check('8 x 4 = 32','8 scenarios; 4 choices each; 32 total','OK','Code: data/v2/items.json; Paper: Ch.4, p.40, 50')
check('15 skill statements','15','OK','Code: data/v2/items.json; Paper: Ch.4, p.50')
check('15 links/course','2 interests + 2 skills + 2 certificates + 2 old subjects + 1 strand + 1 core + 5 electives = 15','OK','Code: data/v2/links.json; Paper: Ch.4, p.50-51')
check('1,275 total links','85 x 15 = 1,275; route union, not all active together','OK','Code: data/v2/links.json; Paper: Ch.4, p.51')
check('Maximum old 38','6 + 10 + 6 + 4 + 6 + 6 = 38','OK','Code: lib/scoringV2/score.js; Paper: Ch.4, p.50')
check('Maximum new 43','6 + 10 + 6 + 12 + 3 + 6 = 43','OK','Code: lib/scoringV2/score.js; Paper: Ch.4, p.50')
for n,v in [('Interest +3; max 6','Two linked choices x 3'),('Skills 1-5; max 10','Two linked ratings added directly'),('Strand +4','Only matching old-route strand'),('Subject +3','Each matching old subject; max 6/course'),('Elective +4','Each matching new elective; max 12/course'),('Core +3','One linked core; max 3/course'),('GWA bonus 0-3','Tier values 0, 1, 1, 2, 2, 3; alignment required'),('Certificates +3; max 6','Two linked categories x 3; user may choose up to 3')]:
    check(n,v,'OK','Code: lib/scoringV2/score.js; data/v2/links.json; Paper: Ch.4, p.50')
check('30 evaluators','30; same people as interview','OK','Paper: Ch.3, p.25; Ch.4, p.61')
check('10 per school','10 at each of the three named schools','OK','Paper: Ch.3, p.25')
for n,v in [('Overall mean 4.77','2,574 / 540 = 4.7667 -> 4.77'),('Functional Suitability 4.77','716 / 150 = 4.7733 -> 4.77'),('Reliability 4.83','724 / 150 = 4.8267 -> 4.83'),('Interaction Capability 4.73','1,134 / 240 = 4.725 -> 4.73')]:
    check(n,v,'OK','Paper: Ch.4, Tables 11-14, p.63-66')
check('Highest item 4.90','Overall highest Item 18 = 5.00. Item 9 = 4.90 is highest in Reliability only.','MISMATCH','Paper: Ch.4, Tables 12-13, p.64-65; demo claim supplied by user')
for n,v in [('25 of 30','Financial limits'),('26 of 30','Collect demographic and academic data'),('22 of 30','Use career or interest assessment tools'),('14 of 30','Collect interests, skills and strengths'),('15 of 30','Two problem themes: lack of self-awareness/undecided; limited course/pathway knowledge. Also 15 describe guidance within teaching/homeroom, p.38.'),('9 of 30','Limited counselor time'),('18 of 30','Family influence; separately, 18 keep student profiles/academic records')]:
    check(n,v,'OK','Paper: Ch.4, p.38-39; themes can overlap')
for n,v in [('11 of 27','Want a simple interface'),('10 of 27','Want assessment with generated result; separately, 10 want data security'),('12 of 27','Want digital student profiles; separately, 12 want a central information source'),('8 of 27','Want low-connectivity access; separately, 8 want maintenance/updates')]:
    check(n,v,'OK','Paper: Ch.4, p.38-40; 27 answered desired-features question')
check('19 features','F-01 through F-19','OK','Paper: Ch.4, Table 9, p.51-53; code pointers in Part B')
check('4 academic steps/route','Old: strand/subjects/GWA/certificates; new: electives/core/GWA/certificates','OK','Code: lib/valleySelection.js; Paper: Ch.4, p.52')
check('Tie-break order','Paper: interest before skill, then academics/shared ranks; code: skill before interest, then hash/unique ranks','MISMATCH','Paper: Ch.4, p.51; Code: lib/scoringV2/rank.js; lib/recommendations.js')
check('PDF English only','Paper F-17: English only; code: en or fil report language','MISMATCH','Paper: Ch.4, p.53; Code: app/report/page.js; lib/explorerReport.js')
table([['Demo number / claim','Verified value or meaning','Result','Source']]+checks,[103,207,61,152])
heading('Interview counts: how to say them safely')
add('Say "25 of the 30 interviewed staff mentioned financial limits," not "25 students could not afford college." Say "11 of the 27 staff who answered the desired-features question wanted a simple interface." These are reported themes from staff interviews, not direct student survey results. '+paper(3,'25')+' '+paper(4,'38-40'))
heading('Final defense reminders')
add('Explain the actual code tie rules, distinguish quality ratings from predictive accuracy, state the GAS limitation, and show that offline use depends on a completed saved copy. Keep proposed accounts, databases and dashboards clearly labeled as future work outside the current approved scope. '+RK+' '+SC+' '+OF+' '+paper(5,'73-75'))

def footer(canvas,doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#bac6cc')); canvas.line(36,35,A4[0]-36,35)
    canvas.setFont('Helvetica',8); canvas.setFillColor(colors.HexColor('#50616b'))
    canvas.drawString(36,23,'Career Compass | Final Defense Reference | 30 October 2026')
    canvas.drawRightString(A4[0]-36,23,f'Page {doc.page}')
    canvas.restoreState()

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=36,leftMargin=36,topMargin=32,bottomMargin=47,title='Career Compass Defense Q&A',author='Defense preparation reference',allowSplitting=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(OUT)
text='\n'.join(page.extract_text() or '' for page in r.pages)
assert all(f'Q{n:02d}.' in text for n in range(1,counter+1))
assert all(f'F-{n:02d}' in text for n in range(1,20))
assert 'Part B' in r.pages[1].extract_text() or 'Mismatches' in r.pages[1].extract_text()
assert '8 requirements' in r.pages[0].extract_text(), 'Part A must fit on one page'
print(json.dumps({'output':str(OUT),'pages':len(r.pages),'questions':counter,'demo_checks':len(checks),'bytes':OUT.stat().st_size},indent=2))
