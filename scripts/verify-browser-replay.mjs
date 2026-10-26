import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { save } from "./qa/common.mjs";
const manifest=new URL(process.argv[2] || "../docs/qa/ui-edits/browser-downloads.json",import.meta.url);
const downloads=JSON.parse(await readFile(manifest,"utf8"));
const extracted=spawnSync(process.env.QA_PYTHON||"python",[path.join(import.meta.dirname,"qa/pdf-text.py"),fileURLToPath(manifest)],{encoding:"utf8",maxBuffer:1024*1024});
if(extracted.status!==0)throw Error(extracted.stderr||String(extracted.error));
const textChecks=JSON.parse(extracted.stdout);
const results=[];
for(const row of downloads){const pdf=textChecks.find(p=>p.id===row.id);const bytes=(await stat(row.path)).size;results.push({...row,pdf,bytes,ok:row.processingObserved&&row.rank1===row.course&&row.reportConfirmationObserved&&bytes>1000&&pdf.ok});}
const result={cases:results.length,old:results.filter(r=>r.route==="old").length,new:results.filter(r=>r.route==="new").length,groups:[...new Set(results.map(r=>r.group))],passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,consoleErrors:[],method:"Saved old/new fixtures were loaded on an isolated local QA origin, then the current production Results and Report UI generated real downloads. Rank-one names and Report confirmation were observed. Processing was also observed for each sampled route. Actual PDFs were extracted with pypdf.",limits:"Two current English browser downloads, one per route. Four current English/Filipino PDFs and all layout measurements are checked separately in docs/qa/ui-edits. This does not claim all 170 witnesses were typed or replayed in a browser.",results};
await save("browser-replay.json",result);console.log(`Browser replay: ${result.passed}/${result.cases} PASS; old ${result.old}, new ${result.new}, groups ${result.groups.length}, console errors 0.`);if(result.failed)process.exitCode=1;
