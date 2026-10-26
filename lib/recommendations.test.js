import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import witnesses from "../data/v2/witnesses.json" with { type: "json" };
import items from "../data/v2/items.json" with { type: "json" };
import { createEmptySession, mergeSession } from "./sessionSchema.js";
import { valleySteps, valleyPatch } from "./valleySelection.js";
import { buildRecommendations, arcStrength, resultLabels } from "./recommendations.js";
import { getCourseData, schoolNotes, schoolLabel } from "./courseDataV2.js";
import { explainMatch, evidenceLines } from "./explainMatch.js";
import { buildExplorerReport, createExplorerReport, printableText } from "./explorerReport.js";
import { rankCourses } from "./scoringV2/rank.js";
export function witnessSession(flow) {
  const a = witnesses.find(w => w.flow === flow).answers;
  let s = mergeSession(createEmptySession(), { gradeLevel: 12, route: flow, interests: a.interests, skills: a.skills });
  for (const step of valleySteps(flow)) s = mergeSession(s, valleyPatch(s, step, ["gwa", "certificates"].includes(step) ? a[step] : a[flow][step], true));
  return { ...s, journeyProgress: { interests: "Completed", skills: "Completed", academic: "Completed" } };
}
for (const flow of ["old", "new"]) test(`shared ${flow} recommendations equal real ranking and exact matched evidence`, () => {
  const s = witnessSession(flow), a = witnesses.find(w => w.flow === flow).answers;
  const r = buildRecommendations(s);
  assert.equal(r.ok, true); assert.equal(r.ranked.length, 85);
  assert.deepEqual(r.ranked.map(({group,rank,...course}) => course), rankCourses(a));
  const e = explainMatch(r.ranked[0], a);
  assert.ok(e.interests.length); assert.equal(e.skills.length, 2);
  const exact = new Set([...items.interests.flatMap(q => q.options), ...items.skills, ...items.oldSubjects, ...items.electives, ...items.certificates, ...items.strands, ...items.coreSubjects].map(x => x.text));
  for (const line of evidenceLines(e)) assert.ok(exact.has(line));
  assert.ok(e.skills.every(item => exact.has(item.text) && Number.isInteger(item.rating)));
});
test("invalid sessions return errors without ranking", () => { const r = buildRecommendations(createEmptySession()); assert.equal(r.ok,false); assert.equal(r.ranked.length,0); assert.ok(r.errors.length); });
test("arcs use fixed rank-one/five anchors and remain stable on expansion", () => {
  const ranked = buildRecommendations(witnessSession("new")).ranked;
  assert.deepEqual(ranked.slice(0,5).map(c => arcStrength(c,ranked)), ranked.map(c => arcStrength(c,ranked)).slice(0,5));
  assert.equal(arcStrength(ranked[0],ranked),95);
  assert.ok(ranked.every(c => arcStrength(c,ranked)>=15 && arcStrength(c,ranked)<=95));
  assert.equal(arcStrength({total:1},Array(5).fill({total:5})),95);
});
test("rendered result labels contain no percentages or numeric scores", () => {
  for (const c of buildRecommendations(witnessSession("old")).ranked) {
    const labels=resultLabels(c);
    const html=renderToStaticMarkup(createElement("article",null,...Object.values(labels).map((text,i)=>createElement("span",{key:i},text))));
    assert.doesNotMatch(html,/%|\b(?:score|points|rating)\s*[:=]?\s*\d|\d+\s*(?:points|percent)\b/i);
    assert.ok(!Object.values(labels).includes(String(c.total)));
  }
});
test("compare data is complete for five courses, preserving careerNotes and single-school order", () => {
  for(const id of ["SCI02","BUS02","HLT01","ICT01","ART01"]){const c=getCourseData(id); assert.ok(c.overview && c.group && c.careers.length && c.schools.length); assert.ok(c.careers.every(x=>x.jobTitle && x.salaryRange)); assert.ok(c.schools.every(x=>x.id && Array.isArray(x.flags)));}
  assert.equal(getCourseData("SCI02").careerNotes.length,1); assert.equal(getCourseData("BUS02").schools.length,1);
});

for (const route of ["old", "new"]) test(`English ${route} report preserves ranking/profile and excludes score fields`, () => {
  const session=witnessSession(route), report=buildExplorerReport(session);
  assert.equal(report.ok,true);assert.equal(report.language,"en");assert.equal(report.topCourses.length,5);
  assert.ok(!report.profile.some(([label])=>label==="Cluster" || label==="Best subjects"));
  if(route==="new")assert.ok(report.profile.some(([label])=>label==="Core subjects"));
  assert.deepEqual(report.topCourses.map(c=>c.id),buildRecommendations(session).ranked.slice(0,5).map(c=>c.id));
  assert.ok(report.topCourses.every(c=>!Object.hasOwn(c,"total") && !Object.hasOwn(c,"breakdown") && c.evidence.length<=3));
  assert.ok(report.profile.some(([label,value])=>label==="GWA" && value===String(session.gwa)));
  assert.ok(createExplorerReport(report).getNumberOfPages() >= 1 && createExplorerReport(report).getNumberOfPages() <= 2);
  assert.ok(report.topCourses.every(course => course.careers.length <= 3 && course.schools.length <= 2));
  assert.ok(!Object.hasOwn(report, "details"));
  assert.equal(printableText("₱15,000–₱33,000/month"),"PHP 15,000–PHP 33,000/month");
});

test("school display suppresses disallowed notes and repeated location segments", () => {
  const row={school:"Bicol University",campus:"Polangui",location:"Polangui",province:"Albay",type:"public-suc",flags:["partial","weak-source","outdated","unverified","new-program","derived-location","major-only"]};
  assert.equal(schoolNotes(row).length,5);assert.ok(!schoolNotes(row).some(note=>/inferred|specialization/i.test(note)));
  assert.equal(schoolNotes({...row,type:"community-college"}).length,6);
  assert.equal(schoolLabel(row),"Bicol University - Polangui - Albay");
  assert.equal(schoolLabel({...row,school:"School - Polangui",location:"Polangui, Albay"}),"School - Polangui - Albay");
});
