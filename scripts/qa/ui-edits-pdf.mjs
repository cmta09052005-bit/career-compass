import { mkdir, writeFile } from "node:fs/promises";
import { buildExplorerReport, createExplorerReport } from "../../lib/explorerReport.js";
import cases from "../../docs/qa/browser-sessions.json" with { type: "json" };

const target = new URL("../../docs/qa/ui-edits/", import.meta.url);
await mkdir(target, { recursive: true });
const rows = [];
for (const route of ["old", "new"]) for (const language of ["en", "fil"]) {
  const row = cases.find(sample => sample.route === route);
  const report = buildExplorerReport({ ...row.session, nickname: "QA Niño Áéíóú Ñü" }, language);
  const doc = createExplorerReport(report);
  const name = `${route}-${language}`;
  await writeFile(new URL(`${name}.pdf`, target), new Uint8Array(doc.output("arraybuffer")));
  rows.push({ name, route, language, pages: doc.getNumberOfPages(), courses: report.topCourses.map(course => course.name), profile: report.profile });
}
await writeFile(new URL("pdf-expectations.json", target), JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows.map(({ name, pages }) => ({ name, pages }))));
