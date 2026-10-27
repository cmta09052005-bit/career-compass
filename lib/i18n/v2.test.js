import assert from "node:assert/strict";
import test from "node:test";
import { inventory } from "../../scripts/i18n-missing.mjs";
import ui from "./fil-v2.js";
import content from "./fil-v2-content.js";
import { keptEntries } from "./policy.js";
import { translate } from "./translate.js";
import { buildExplorerReport, createExplorerReport } from "../explorerReport.js";
import samples from "../../docs/qa/browser-sessions.json" with { type: "json" };
import { activeFilterLabel, filterOptions, countLabel } from "../courseSearch.js";

test("real-source T1 and T2 translation inventory has no gaps", async () => {
  const r = await inventory();
  assert.equal(r.counts.T1.missing, 0, JSON.stringify(r.missing));
  assert.equal(r.counts.T2.missing, 0);
});
test("draft translations retain placeholders, numeric values, percentages and URLs", () => {
  const tokens = value => (value.match(/\{\d+\}|https?:\/\/\S+|\d+(?:[.,]\d+)*|%/g) || []).sort();
  for (const [source, target] of Object.entries({...ui,...content})) {
    assert.deepEqual(tokens(target), tokens(source), source);
    assert.ok(!/[—\p{Emoji_Presentation}]/u.test(target), source);
    assert.ok(!/\d+\s*(?:points?|puntos|scores?|iskor)/i.test(target), source);
  }
});
test("all protected source terms stay English and unknown copy silently falls back", () => {
  for (const {text} of keptEntries) assert.equal(translate(text,"fil"), text.replace(/—/g,";"));
  assert.equal(translate("An unknown Career course phrase", "fil"), "An unknown Career course phrase");
  assert.equal(translate("Rank #85", "fil"), "Ranggo #85");
  assert.equal(translate("Prepared for Forest", "fil"), "Inihanda para kay Forest");
});
test("Prompt 28 runtime counts, filters, hints and ARIA copy have faithful coverage", async () => {
  const r=await inventory(), texts=new Set(r.entries.map(e=>e.text));
  for(const source of ["Search courses","Course, group, career or topic","Course group","School type on our list","Location on our list","Sort courses","Best match first","Lowest match first","A to Z","Clear all","No school on our list yet","Overview","School","Career"]){
    assert.ok(texts.has(source),source);assert.notEqual(translate(source,"fil"),source,source);
  }
  for(const options of Object.values(filterOptions()))for(const option of options)assert.ok(texts.has(option.label),option.label);
  assert.equal(translate(countLabel(1),"fil"),"1 kurso");assert.equal(translate(countLabel(85),"fil"),"85 kurso");
  const summary=activeFilterLabel({groups:[filterOptions().groups.find(o=>o.label.includes(",")).id],schoolTypes:["public-suc"],locations:["province:Albay"]});
  const localized=translate(summary,"fil");
  assert.ok(!localized.includes("Course group")&&!localized.includes("School type")&&!localized.includes("Public SUC"),localized);
  assert.ok(localized.includes("Albay"));
  assert.equal(translate("Matched on career: Nurse","fil"),"Nagtugma sa trabaho: Nurse");
  assert.equal(translate("Rank #85","fil"),"Ranggo #85");
});
test("both route PDF models localize without changing course names or adding match scores", () => {
  assert.equal(translate("Certificates & Achievements", "fil"), "Mga Sertipiko at Nakamit");
  assert.equal(translate("Add your subjects, general average and certificates in 4 steps.", "fil"), "Ilagay ang iyong mga asignatura, pangkalahatang average, at mga sertipiko sa 4 na hakbang.");
  for (const route of ["old","new"]) {
    const row = samples.find(s=>s.route===route);
    const report = buildExplorerReport(row.session, "fil");
    assert.equal(report.ok, true);
    assert.equal(report.language,"fil");
    assert.deepEqual(report.topCourses.map(c=>c.name),buildExplorerReport(row.session).topCourses.map(c=>c.name));
    assert.ok(report.profile.some(([label])=>label === "Mga Sertipiko at Nakamit"));
    const pdf = createExplorerReport(report);
    assert.ok(pdf.getNumberOfPages() >= 1 && pdf.getNumberOfPages() <= 2);
    const text = JSON.stringify([report.profile,report.topCourses]);
    assert.ok(!/%|\d+\s*(?:points?|scores?|puntos|iskor)/i.test(text));
  }
});
