import { mkdir, writeFile } from "node:fs/promises";
import { buildExplorerReport, createExplorerReport, reportGenerationDate } from "../../lib/explorerReport.js";
import cases from "../../docs/qa/browser-sessions.json" with { type: "json" };
import witnesses from "../../data/v2/witnesses.json" with { type: "json" };
import { sessionFor } from "./session.mjs";

const target = new URL("../../docs/qa/school-priority/", import.meta.url);
await mkdir(target, { recursive: true });
const generatedAt = new Date();
const rows = [];
async function save(name, report, doc) {
  await writeFile(new URL(`${name}.pdf`, target), new Uint8Array(doc.output("arraybuffer")));
  rows.push({ name, language: report.language, pages: doc.getNumberOfPages(), date: reportGenerationDate(generatedAt), courses: report.topCourses.map(course => course.name) });
}
for (const route of ["old", "new"]) for (const language of ["en", "fil"]) {
  const sample = cases.find(row => row.route === route);
  const report = buildExplorerReport({ ...sample.session, nickname: "QA Niño Áéíóú Ñü", reportDate: "January 1, 1990" }, language);
  await save(`${route}-${language}`, report, createExplorerReport(report, { generatedAt }));
}
for (const language of ["en", "fil"]) {
  let multi;
  for (const witness of witnesses) {
    const report = buildExplorerReport(sessionFor(witness.answers, "QA Niño Áéíóú Ñü"), language);
    const doc = createExplorerReport(report, { generatedAt });
    if (doc.getNumberOfPages() === 2) { multi = { report, doc }; break; }
  }
  if (!multi) throw new Error(`No natural two-page ${language} fixture found`);
  await save(`multi-${language}`, multi.report, multi.doc);
}
await writeFile(new URL("pdf-expectations.json", target), JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows));
