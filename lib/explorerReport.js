import { jsPDF } from "jspdf";
import { formatMatchPercent } from "./scoringEngine";
import { INTERESTS_WEIGHTS, SKILLS_WEIGHTS } from "./weightTable";
import items from "../data/items.json";
import courseDetails from "../data/explore-courses.json";

const COLORS = {
  navy: [27, 42, 74],
  gold: [212, 160, 23],
  teal: [45, 191, 184],
  beige: [245, 236, 215],
  muted: [91, 101, 122],
};

const DISCLAIMER =
  "This is a guidance tool, not a final decision - talk to your guidance counselor about what's right for you.";

const SKILL_LABELS = {
  "SKL-01": "Understanding computer programs",
  "SKL-02": "Building and repairing machines",
  "SKL-03": "Explaining complex topics",
  "SKL-04": "Managing money and budgets",
  "SKL-05": "Staying calm in health emergencies",
  "SKL-06": "Visual expression and design",
  "SKL-07": "Persuading others",
  "SKL-08": "Following construction instructions",
  "SKL-09": "Caring for others",
  "SKL-10": "Guiding and mentoring",
};

function reportEvidence(answers, categoryCode) {
  const interests = items.filter((item) => item.section === "Interests")
    .flatMap((item) => {
      const selected = answers.interests?.[item.id];
      const option = item.options.find((entry) => entry.key === selected);
      return option && INTERESTS_WEIGHTS[item.id]?.[selected] === categoryCode
        ? [option.text] : [];
    }).slice(0, 4);
  const skills = items.filter((item) => item.section === "Skills")
    .filter((item) => {
      const rating = Number(answers.skills?.[item.id]);
      return SKILLS_WEIGHTS[item.id] === categoryCode && (rating === 4 || rating === 5);
    })
    .sort((a, b) => Number(answers.skills[b.id]) - Number(answers.skills[a.id]))
    .slice(0, 2)
    .map((item) => `${SKILL_LABELS[item.id]} (${answers.skills[item.id]}/5)`);
  return { interests, skills };
}

function printableText(text) {
  // Use glyphs supported by the built-in PDF font, including PHP for peso amounts.
  return String(text).replace(/₱/g, "PHP ").replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function addWrappedText(doc, text, x, y, maxWidth, options = {}) {
  const lines = doc.splitTextToSize(printableText(text), maxWidth);
  for (const line of lines) {
    y = addPageIfNeeded(doc, y, 6);
    doc.text(line, x, y, options);
    y += 5;
  }
  return y;
}

function addSectionHeading(doc, title, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.navy);
  doc.text(title, 20, y);
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.8);
  doc.line(20, y + 3, 190, y + 3);
  return y + 12;
}

function addPageIfNeeded(doc, y, requiredHeight) {
  if (y + requiredHeight <= 275) return y;
  doc.addPage();
  return 22;
}

function addPageNumbers(doc) {
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Career Compass  |  Page ${page} of ${pageCount}`, 105, 289, {
      align: "center",
    });
  }
}

export function createExplorerReport(report) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const displayName = report.nickname?.trim() || "Explorer";
  const topCourses = Array.isArray(report.topCourses)
    ? report.topCourses
    : [];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.navy);
  doc.text("CAREER COMPASS — Explorer Report", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.muted);
  let y = addWrappedText(doc, `Prepared for ${displayName}  |  ${report.date}`, 20, 28, 170) + 7;

  const rankedCourses = [...topCourses]
    .sort((a, b) => b.finalCourseMatchPercent - a.finalCourseMatchPercent)
    .slice(0, 5);
  y = addSectionHeading(doc, "Your Result", y);
  rankedCourses.forEach((course, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(index === 0 ? 12 : 10.5);
    const nameLines = doc.splitTextToSize(`${index + 1}. ${course.courseName}`, 130);
    const rowHeight = nameLines.length * 5 + (index === 0 ? 16 : 10);
    y = addPageIfNeeded(doc, y, rowHeight);
    if (index === 0) {
      doc.setFillColor(...COLORS.beige);
      doc.roundedRect(20, y - 5, 170, rowHeight, 2, 2, "F");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.navy);
      doc.text("TOP MATCH", 24, y);
      y += 6;
      doc.setFontSize(12);
    }
    doc.setTextColor(...COLORS.navy);
    doc.text(nameLines, 24, y, { lineHeightFactor: 1.2 });
    doc.text(`${formatMatchPercent(course.finalCourseMatchPercent)}%`, 186, y, { align: "right" });
    y += nameLines.length * 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    y = addWrappedText(doc, course.categoryName, 24, y, 162) + 5;
  });

  const topCourse = rankedCourses[0];
  const answers = report.answers || {};
  const evidence = reportEvidence(answers, topCourse?.categoryCode);
  y = addPageIfNeeded(doc, y + 5, 105);
  y = addSectionHeading(doc, "Why This Result?", y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  y = addWrappedText(doc, `Supporting answers for ${topCourse?.categoryName || "your top category"}`, 20, y, 170) + 2;
  for (const [label, entries] of [["Interests", evidence.interests], ["Skills", evidence.skills]]) {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    for (const entry of entries.length ? entries : ["No qualifying answers selected."]) {
      y = addWrappedText(doc, `- ${entry}`, 24, y, 166);
    }
    y += 2;
  }
  const profile = report.answers || report.profile || {};
  const academicLine = printableText(`Academic: Strand: ${profile.strand || "Not provided"} | GWA: ${profile.gwa ?? "Not provided"} | Subjects: ${profile.subjects?.length ? profile.subjects.join(", ") : "Not provided"}`);
  doc.setFontSize(8.5);
  doc.setFontSize(Math.min(8.5, 8.5 * 169 / doc.getTextWidth(academicLine)));
  doc.text(academicLine, 20, y);
  y += 5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  y = addWrappedText(doc, "Your answers are not stored anywhere — this report is the only copy.", 20, y + 3, 170);

  y = addPageIfNeeded(doc, y + 6, 30);
  y = addSectionHeading(doc, "Guidance Note", y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.muted);
  addWrappedText(doc, DISCLAIMER, 20, y, 170);

  const details = courseDetails.find((course) => course.courseId === topCourse?.courseId);
  if (details) {
    doc.addPage();
    y = addSectionHeading(doc, "Course Details", 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    y = addWrappedText(doc, `${details.courseId} - ${details.courseName}`, 20, y, 170) + 5;
    const sections = [
      ["Overview", [details.overview]],
      ["Where Can You Study?", [
        ...details.schools.map((school) => [school.name, school.location, school.type, school.notes].filter(Boolean).join(" - ")),
        ...details.schoolNotes,
      ]],
      ["Where Can This Path Lead?", details.careerOpportunities.map((career) =>
        `${career.jobTitle} - ${career.salaryRange}${career.notes ? ` ${career.notes}` : ""}`)],
      ["Guidance Tips", [details.guidanceTips]],
    ];
    for (const [title, entries] of sections) {
      y = addPageIfNeeded(doc, y, 28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.navy);
      doc.text(title, 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.muted);
      for (const entry of entries) {
        y = addWrappedText(doc, entries.length > 1 ? `- ${entry}` : entry, 20, y, 170) + 3;
      }
      y += 4;
    }
  }

  addPageNumbers(doc);
  return doc;
}

export function downloadExplorerReport(report) {
  const doc = createExplorerReport(report);
  doc.save("career-compass-explorer-report.pdf");
}

export function printExplorerReport(report) {
  const doc = createExplorerReport(report);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank", "noopener,noreferrer");
}

export { DISCLAIMER };
