import assert from "node:assert/strict";
import test from "node:test";
import witnesses from "../data/v2/witnesses.json" with { type: "json" };
import { sessionFor } from "../scripts/qa/session.mjs";
import { buildExplorerReport, createExplorerReport } from "./explorerReport.js";
import { getCourseData, schoolLabel } from "./courseDataV2.js";
import { cardInfoFor } from "./courseSearch.js";
import { journeyLabel } from "./journeyEntry.js";
import drafts from "./i18n/fil-ui-edits.js";
import { translate } from "./i18n/translate.js";

test("all placement labels cover each journey state and have Filipino drafts", () => {
  for (const placement of ["hero", "ending", "about", "how"]) {
    const labels = ["/intake", "/journey", "/results"].map(href => journeyLabel({ href }, placement));
    assert.equal(new Set(labels).size, 3);
    for (const label of labels) assert.notEqual(translate(label, "fil"), label);
  }
  for (const [source, target] of Object.entries(drafts)) {
    assert.ok(!/[—\p{Emoji_Presentation}]/u.test(source + target));
    assert.equal(translate(source, "fil"), target);
  }
});

test("170 real witness reports fit two pages in both languages and keep ordered source careers/default schools", () => {
  for (const witness of witnesses) for (const language of ["en", "fil"]) {
    const report = buildExplorerReport(sessionFor(witness.answers, "QA Niño Áéíóú Ñü"), language);
    assert.equal(report.ok, true);
    assert.ok(!Object.hasOwn(report, "details"));
    for (const course of report.topCourses) {
      const source = getCourseData(course.id);
      assert.equal(course.name, source.name);
      assert.deepEqual(course.careers, source.careers.slice(0, 3).map(career => career.jobTitle));
      const first = cardInfoFor({ ...source, careers: source.careers.map(career => career.jobTitle) }).school;
      assert.equal(course.schools[0], schoolLabel(source.schools.find(school => school.id === first.id)));
      assert.ok(course.schools.length >= 1 && course.schools.length <= 2);
    }
    const doc = createExplorerReport(report);
    assert.ok(doc.getNumberOfPages() >= 1 && doc.getNumberOfPages() <= 2, `${witness.course}/${witness.flow}/${language}`);
    assert.ok(!/\/Subtype \/Image|%\)|\b(?:score|points|rating):/i.test(doc.output()));
  }
});

