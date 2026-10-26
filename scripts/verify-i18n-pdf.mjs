import assert from "node:assert/strict";
import { writeFile, readFile, copyFile } from "node:fs/promises";
import { buildExplorerReport, createExplorerReport } from "../lib/explorerReport.js";
import { jsPDF } from "jspdf";
import cases from "../docs/qa/browser-sessions.json" with {type:"json"};
import { catalog, translate } from "../lib/i18n/translate.js";
import { inventory } from "./i18n-missing.mjs";
const target = new URL("../docs/qa/",import.meta.url);
const expectations = {};
for(const route of ["old","new"]){
  const row=cases.find(c=>c.route===route), report=buildExplorerReport(row.session,"fil");
  assert.equal(report.ok,true);assert.equal(report.topCourses[0].id,row.course);
  const doc=createExplorerReport(report);
  await writeFile(new URL(`i18n-${route}.pdf`,target),new Uint8Array(doc.output("arraybuffer")));
  expectations[route]={names:report.topCourses.map(c=>c.name),profileLabels:report.profile.map(p=>p[0]),sections:["Explorer Report","Your Exploration Profile","Supporting answers","Your Top Course Matches","Careers","Schools"].map(s=>translate(s,"fil"))};
}
await writeFile(new URL("i18n-pdf-expectations.json",target),JSON.stringify(expectations,null,2)+"\n");
if(process.argv.includes("--browser"))for(const row of JSON.parse(await readFile(new URL("ui-edits/browser-fil-downloads.json",target),"utf8")))await copyFile(row.path,new URL(`i18n-browser-${row.route}.pdf`,target));
const glyphs="ñ Ñ á é í ó ú Á É Í Ó Ú ü Ü";
const probe=new jsPDF();probe.setFont("helvetica","normal");probe.text(glyphs,20,20);probe.setFont("helvetica","bold");probe.text(glyphs,20,40);
await writeFile(new URL("i18n-glyph-probe.pdf",target),new Uint8Array(probe.output("arraybuffer")));
const result=await inventory();assert.equal(result.counts.T1.missing,0);
const nonLatin=[...new Set(Object.values(catalog).join(""))].filter(c=>c.codePointAt(0)>255);
console.log(`PDF model checks: old BUS02 and new HLT01; Filipino profile and headings. Font probe: ${glyphs}.`);
console.log(`Non-Latin-1 catalog characters (including existing symbols): ${nonLatin.join(" ")}. PDF text extraction checks actual use separately.`);
for(const label of ["Explorer Report","Your Top Course Matches","Your Exploration Profile","Supporting answers"])assert.notEqual(translate(label,"fil"),label);
