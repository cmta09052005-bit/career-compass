import { jsPDF } from "jspdf";
import { buildRecommendations } from "./recommendations.js";
import { fromSession } from "./scoringV2/fromSession.js";
import { getCourseData, schoolNotes, schoolLabel } from "./courseDataV2.js";
import { explainMatch, evidenceLines } from "./explainMatch.js";
import { ROUTE_LABELS } from "./routeResolution.js";
import items from "../data/v2/items.json" with { type: "json" };

const COLORS = { navy: [27,42,74], gold: [212,160,23], beige: [245,236,215], muted: [91,101,122] };
const DISCLAIMER = "This is a guidance tool, not a final decision - talk to your guidance counselor about what's right for you.";
// User-approved PDF-only currency substitution. Comparison retains source strings.
export const printableText = text => String(text).replace(/₱/g, "PHP ").replace(/—/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const label = (bank,id) => bank.find(item => item.id === id)?.text || "Not sure yet";
export function buildExplorerReport(session) {
  const result = buildRecommendations(session);
  if (!result.ok) return { ok: false, errors: result.errors };
  const { answers } = fromSession(session);
  const topCourses = result.ranked.slice(0,5).map(({id,name,group,rank}) => ({ id,name,group,rank, evidence: evidenceLines(explainMatch(id,answers)) }));
  const profile = [
    ["Grade level", `Grade ${session.gradeLevel}`],
    ["Curriculum", ROUTE_LABELS[answers.route]],
    ...(answers.route === "old" ? [
      ["Strand", label(items.strands,answers.old.strand)],
      ["Subjects", answers.old.subjects.map(id=>label(items.oldSubjects,id)).join("; ")],
    ] : [
      ["Electives", answers.new.electives.length ? answers.new.electives.map(id=>label(items.electives,id)).join("; ") : "Not sure yet / None"],
      ["Core subjects", answers.new.bestSubjects.map(id=>label(items.coreSubjects,id)).join("; ")],
    ]),
    ["GWA", String(answers.gwa)],
    ["Certificates", answers.certificates.length ? answers.certificates.map(id=>label(items.certificates,id)).join("; ") : "None yet"],
  ];
  return { ok: true, language: "en", nickname: session.nickname?.trim() || "", date: session.reportDate || new Intl.DateTimeFormat("en-PH",{dateStyle:"long"}).format(new Date()), topCourses, profile, details: getCourseData(topCourses[0].id) };
}
export function createExplorerReport(report) {
  if (!report.ok) throw new Error("Complete the assessment before creating a report.");
  const doc = new jsPDF({unit:"mm",format:"a4"});
  let y = 24;
  function pageIfNeeded(height=8) { if(y+height>275){doc.addPage();y=22;} }
  function text(value,{bold=false,size=10.5,indent=0}={}) {
    doc.setFont("helvetica",bold?"bold":"normal"); doc.setFontSize(size); doc.setTextColor(...COLORS.navy);
    const lines=doc.splitTextToSize(printableText(value),170-indent);
    for(const line of lines){pageIfNeeded(6);doc.text(line,20+indent,y);y+=5.3;}
    y+=2;
  }
  function heading(value){pageIfNeeded(22);y+=5;text(value,{bold:true,size:16});doc.setDrawColor(...COLORS.gold);doc.line(20,y-2,190,y-2);y+=5;}
  text("CAREER COMPASS",{bold:true,size:22});y+=8;
  text("Explorer Report",{bold:true,size:18});
  if(report.nickname)text(`Prepared for ${report.nickname}`);
  text(report.date);y+=12;text("Keep this report as a separate copy. Your answers are saved in this browser on this device.");
  doc.addPage();y=22;heading("Your Top Course Matches");
  for(const course of report.topCourses){pageIfNeeded(28);text(`${course.rank}. ${course.name}`,{bold:true,size:12});text(course.group,{size:10});for(const evidence of course.evidence)text(`- ${evidence}`,{size:9.5,indent:4});y+=3;}
  doc.addPage();y=22;heading("Your Exploration Profile");
  for(const [title,value] of report.profile)text(`${title}: ${value}`);
  doc.addPage();y=22;const d=report.details;
  heading("Your Top Course in Detail");text(d.name,{bold:true,size:13});text(d.group);
  for(const [title,entries] of [
    ["Overview",[d.overview]], ["What You'll Study",d.studyTopics], ["Interests and Strengths",[d.interestsStrengths]],
    ["Careers",d.careers.map(c=>`${c.jobTitle}: ${c.salaryRange}${c.notes?` (${c.notes})`:""}`)],
    ...(d.careerNotes.length ? [["Career Notes",d.careerNotes.map(n=>n.text)]]:[]),
    ["Schools",d.schools.map(s=>schoolLabel(s)+(schoolNotes(s).length?`. ${schoolNotes(s).join("; ")}.`:""))],
    ["School List Note",["School lists are not complete. Confirm programs, campus availability and admission requirements with the school."]],
    ["CHED Basis",[d.chedBasis]], ["Guidance Tips",[d.guidanceTips]],
    ["Salary Sources",["Salary estimates: Jobstreet Philippines career salary benchmarks. Updated October 2026.",d.salarySources.methodology,...d.salarySources.references.map(r=>`${r.label}: ${r.url}`),d.salarySources.updateNote]],
  ]) { heading(title);for(const entry of entries)text(entry); }
  heading("Guidance Disclaimer");text(DISCLAIMER);
  const pages=doc.getNumberOfPages();
  for(let page=1;page<=pages;page++){doc.setPage(page);doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...COLORS.muted);doc.text(`Career Compass | Page ${page} of ${pages}`,105,289,{align:"center"});}
  return doc;
}
export async function downloadExplorerReport(report) { const doc=createExplorerReport(report);await doc.save("career-compass-explorer-report.pdf",{returnPromise:true}); }
export function printExplorerReport(report) { const doc=createExplorerReport(report);doc.autoPrint();window.open(doc.output("bloburl"),"_blank","noopener,noreferrer"); }
export { DISCLAIMER };
