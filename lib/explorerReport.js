import { jsPDF } from "jspdf";
import { formatMatchPercent } from "./scoringEngine";

const COLORS = {
  navy: [27, 42, 74],
  gold: [212, 160, 23],
  teal: [45, 191, 184],
  beige: [245, 236, 215],
  muted: [91, 101, 122],
};

const DISCLAIMER =
  "This is a guidance tool, not a final decision - talk to your guidance counselor about what's right for you.";

function addWrappedText(doc, text, x, y, maxWidth, options = {}) {
  const lines = doc.splitTextToSize(String(text), maxWidth);
  doc.text(lines, x, y, options);
  return y + lines.length * 6;
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

  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, 210, 297, "F");
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1.2);
  doc.circle(105, 84, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(...COLORS.beige);
  doc.text("CAREER COMPASS", 105, 133, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.gold);
  doc.text("EXPLORER REPORT", 105, 146, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.beige);
  doc.text(`Prepared for ${displayName}`, 105, 178, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(190, 198, 213);
  doc.text(report.date, 105, 187, { align: "center" });
  doc.setDrawColor(...COLORS.teal);
  doc.line(65, 205, 145, 205);
  doc.setFontSize(10);
  doc.text("Your journey is mapped. Your next step is yours to explore.", 105, 216, {
    align: "center",
  });

  doc.addPage();
  let y = 24;

  y = addSectionHeading(doc, "Your Top Course Matches", y);
  topCourses.slice(0, 5).forEach((course, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.navy);
    doc.text(`${index + 1}. ${course.courseId} - ${course.courseName}`, 24, y);
    doc.setTextColor(...COLORS.gold);
    doc.text(`${formatMatchPercent(course.finalCourseMatchPercent)}%`, 190, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(course.categoryName, 29, y + 5);
    y += 12;
  });

  if (report.strongestCategory) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.muted);
    y = addWrappedText(
      doc,
      `Strongest field: ${report.strongestCategory.label} (${report.strongestCategory.percentage}%)`,
      20,
      y + 2,
      170,
    );
  }

  y += 6;
  y = addSectionHeading(doc, "Your Exploration Profile", y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.muted);
  const profileLines = [
    `Interests explored: ${report.profile.interestsAnswered} of 8 scenarios`,
    `Strong-confidence skills: ${report.profile.strongSkills} of 10 statements`,
    `SHS strand: ${report.profile.strand || "Not provided"}`,
    `General weighted average: ${report.profile.gwa ?? "Not provided"}`,
    `Best-performing subjects: ${report.profile.subjects.length ? report.profile.subjects.join(", ") : "Not provided"}`,
  ];
  profileLines.forEach((line) => {
    y = addWrappedText(doc, `- ${line}`, 24, y, 164);
    y += 2;
  });

  y += 5;
  y = addPageIfNeeded(doc, y, 70);
  y = addSectionHeading(doc, "All Ranked Course Matches", y);
  topCourses.forEach((course, index) => {
    y = addPageIfNeeded(doc, y, 24);
    doc.setFillColor(244, 246, 249);
    doc.roundedRect(20, y - 5, 170, 19, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.navy);
    doc.text(
      `${index + 1}. ${course.courseId} - ${course.courseName}`,
      25,
      y + 2,
    );
    doc.setTextColor(...COLORS.gold);
    doc.text(`${formatMatchPercent(course.finalCourseMatchPercent)}% match`, 185, y + 2, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(course.categoryName, 29, y + 8);
    y += 24;
  });

  y = addPageIfNeeded(doc, y + 3, 30);
  y = addSectionHeading(doc, "Guidance Note", y + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.muted);
  addWrappedText(doc, DISCLAIMER, 20, y, 170);

  addPageNumbers(doc);
  return doc;
}

export function downloadExplorerReport(report) {
  createExplorerReport(report).save("career-compass-explorer-report.pdf");
}

export function printExplorerReport(report) {
  const doc = createExplorerReport(report);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank", "noopener,noreferrer");
}

export { DISCLAIMER };
