import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import master from "../data/v2/courses-master.json" with { type: "json" };
import schools from "../data/v2/schools.json" with { type: "json" };
import witnesses from "../data/v2/witnesses.json" with { type: "json" };
import { buildCourseDetail } from "../lib/courseDetailModel.js";
import { buildExplorerReport, createExplorerReport } from "../lib/explorerReport.js";
import { catalog, translate } from "../lib/i18n/translate.js";
import { sessionFor } from "./qa/session.mjs";

const forbidden = /\b(?:nearest|closest)\b[^.!?]*\bPolangui\b|\b(?:from|mula sa|malapit sa)\s+Polangui\b|\b(?:distances?|distansiya|kilometers?|kilometres?|km|layo|pinakamalapit)\b|\d\s*km\b|\baway\b(?!\s+from home\b)|\b\d+(?:\.\d+)?\s*[-–]?\s*(?:minutes?|mins?|minuto)\s+(?:drive|by (?:car|bus|jeepney)|mula sa)\b/i;
const check = (value, label) => assert.doesNotMatch(value, forbidden, label);
function scanStrings(value, label) {
  if (typeof value === "string" && !/^https?:\/\//.test(value)) check(value, label);
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) scanStrings(child, `${label}/${key}`);
  }
}

for (const file of ["courses-master.json", "course-details.json", "schools.json", "schools-by-course.json"]) {
  scanStrings(JSON.parse(await readFile(new URL(`../data/v2/${file}`, import.meta.url), "utf8")), file);
}
for (const [source, target] of Object.entries(catalog)) {
  check(source, "English catalog key");
  check(target, "Filipino catalog value");
}

const base = process.env.QA_BASE_URL || "http://localhost:3000";
const { chromium } = await import(process.env.QA_PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.QA_CHROME, headless: true });
try {
  for (const language of ["en", "fil"]) {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addInitScript(value => localStorage.setItem("careerCompassLanguage", value), language);
    try {
      const pending = [...master];
      await Promise.all(Array.from({ length: 4 }, async () => {
        const page = await context.newPage();
        for (let course; (course = pending.shift());) {
          const response = await page.goto(new URL(`/results/${course.id}#schools`, base).href, { waitUntil: "domcontentloaded" });
          assert.ok(response?.ok(), `${course.id}: course route failed`);
          const panel = page.locator("#journal-panel-schools");
          await panel.getByRole("heading", { name: translate("Where Can You Study?", language), exact: true }).waitFor();
          const visible = await panel.evaluate(node => [
            node.innerText,
            ...[...node.querySelectorAll("[title],[aria-label],[data-tooltip]")].flatMap(element =>
              ["title", "aria-label", "data-tooltip"].map(attribute => element.getAttribute(attribute) || "")),
          ].join("\n"));
          check(visible, `${course.id}/${language} rendered school panel`);
          assert.deepEqual(await panel.locator("li h3").allTextContents(), buildCourseDetail(course.id).schools.map(school => translate(school.label, language)));
        }
      }));
    } finally {
      await context.close();
    }
    for (const { course, answers } of witnesses.filter(witness => witness.flow === "old")) {
      const report = buildExplorerReport(sessionFor(answers), language);
      assert.equal(report.topCourses[0].id, course);
      check(createExplorerReport(report).output(), `${course}/${language} PDF`);
    }
  }
} finally {
  await browser.close();
}
console.log(`PASS: ${master.length} courses, ${schools.length} schools, both catalogs, and ${master.length * 2} rendered school panels and PDFs.`);
