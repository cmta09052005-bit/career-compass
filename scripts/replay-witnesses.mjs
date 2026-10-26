import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import witnesses from "../data/v2/witnesses.json" with { type: "json" };
import { master, random, sample, checkedRanking, save } from "./qa/common.mjs";
import { sessionFor } from "./qa/session.mjs";
import { fromSession } from "../lib/scoringV2/fromSession.js";
import { buildRecommendations, resultLabels } from "../lib/recommendations.js";
import { buildExplorerReport, createExplorerReport } from "../lib/explorerReport.js";
import { getCourseData } from "../lib/courseDataV2.js";

// Fixed-order candidates. No verified witness or mapping file is modified.
const gasSeed="career-compass:prompt27:gas-witness:v1",rng=random(gasSeed);let gas=null,attempts=0;
for(const w of witnesses.filter(w=>w.flow==="old")){
  for(let i=0;i<1000;i++){
    attempts++;const a=structuredClone(w.answers);a.old.strand="STR-04";
    if(i){const opts=[...Array(19)].map((_,j)=>`ACA-${String(j+1).padStart(2,"0")}`);a.old.subjects=sample(rng,opts,1+rng.int(3));}
    const r=checkedRanking(a),lead=r[0].total-r[1].total;
    if(r[0].id===w.course&&lead>=3){gas={course:w.course,name:w.name,flow:"old",answers:a,rank:1,lead,seed:gasSeed,attempts,qaOnly:true,notPartOfVerified170:true};break;}
  }
  if(gas)break;
}
if(!gas)throw Error("No additional strict-lead GAS witness found in documented search budget");
await save("gas-witness.json",gas);
const all=[...witnesses,gas],pdfDir=await mkdtemp(path.join(tmpdir(),"career-compass-qa-")),pdfRows=[],results=[];
const banned=/%|\b(?:score|points|rating)\s*[:=]?\s*\d|\b\d+(?:\.\d+)?\s*(?:points|percent)\b/i;
for(const [index,w]of all.entries()){
  const id=w.qaOnly?`${w.course}-old-GAS-QA`:`${w.course}-${w.flow}`;const errors=[];
  try{
    const s=sessionFor(w.answers,`QA ${id}`),a=fromSession(s),recommendations=buildRecommendations(s),report=buildExplorerReport(s);
    if(!a.ok||!recommendations.ok||!report.ok)errors.push("Adapter/recommendation/report error");
    if(recommendations.ranked[0]?.id!==w.course||report.topCourses?.[0]?.id!==w.course)errors.push("Rank 1 mismatch");
    const visible=[report.nickname,report.date,...report.profile.flat(),...report.topCourses.flatMap(c=>Object.values(resultLabels(c)).concat(c.evidence))];
    for(const c of report.topCourses){
      if(["total","breakdown","score","percentage"].some(k=>Object.hasOwn(c,k)))errors.push(`Student-facing score property ${c.id}`);
      const d=getCourseData(c.id);if(!d?.overview||!d.guidanceTips||!d.chedBasis||!d.studyTopics?.length||!d.schools?.length||!d.careers?.length||d.careers.some(c=>!c.jobTitle||!c.salaryRange)||d.schools.some(s=>!s?.id||!s.school))errors.push(`Missing details/schools/salary ${c.id}`);
    }
    for(const text of visible)if(banned.test(text))errors.push(`Forbidden student string: ${text}`);
    const pdf=createExplorerReport(report),file=path.join(pdfDir,`${index}.pdf`);await writeFile(file,Buffer.from(pdf.output("arraybuffer")));
    pdfRows.push({id,path:file,name:report.details.name,careerNote:report.details.careerNotes[0]?.text});
    results.push({id,course:w.course,route:w.flow,qaOnly:Boolean(w.qaOnly),rank:recommendations.ranked.findIndex(c=>c.id===w.course)+1,errors});
  }catch(error){results.push({id,course:w.course,route:w.flow,errors:[...errors,String(error)]});}
}
const manifest=path.join(pdfDir,"manifest.json");await writeFile(manifest,JSON.stringify(pdfRows));
const extracted=spawnSync(process.env.QA_PYTHON||"python",[path.join(import.meta.dirname,"qa/pdf-text.py"),manifest],{encoding:"utf8",maxBuffer:10*1024*1024});
if(extracted.status!==0)throw Error(`PDF extraction failed: ${extracted.stderr||extracted.error}`);
const texts=JSON.parse(extracted.stdout);for(const r of results){r.pdf=texts.find(p=>p.id===r.id);r.ok=!r.errors.length&&r.pdf?.ok===true;}
await save("witness-replay.json",{verifiedWitnesses:170,additionalQaGas:1,cases:results.length,passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,gasSearch:{seed:gasSeed,attempts,course:gas.course,lead:gas.lead},method:"createEmptySession -> mergeSession / valleyPatch -> normalizeSession -> fromSession -> buildRecommendations -> buildExplorerReport -> real createExplorerReport PDF -> pypdf text extraction. No substitute PDF text model exists; actual emitted PDFs are checked.",results});
// Fixed, predeclared coverage, never selected to improve observed results.
const picks=[...["BUS02","ICT01","ENG01","SCI02","AGR01"].map(id=>witnesses.find(w=>w.course===id&&w.flow==="old")),gas,...["HLT01","EDU01","SOC01","ART01","BUS01","SCI01"].map(id=>witnesses.find(w=>w.course===id&&w.flow==="new"))];
const browser=picks.map((w,i)=>({index:i+1,id:w.qaOnly?`${w.course}-old-GAS-QA`:`${w.course}-${w.flow}`,course:w.course,name:master.find(c=>c.id===w.course).name,group:master.find(c=>c.id===w.course).group,route:w.flow,qaOnly:Boolean(w.qaOnly),session:sessionFor(w.answers,`QA replay ${i+1}`)}));
await save("browser-sessions.json",browser);
console.log(`Witness replay: ${results.filter(r=>r.ok).length}/${results.length} PASS; failures: ${JSON.stringify(results.filter(r=>!r.ok))}. GAS ${gas.course} lead ${gas.lead}. Browser sample: 6 old, 6 new, ${new Set(browser.map(r=>r.group)).size} groups.`);
if(results.some(r=>!r.ok))process.exitCode=1;
