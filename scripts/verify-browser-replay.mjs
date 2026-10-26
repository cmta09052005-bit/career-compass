import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { save } from "./qa/common.mjs";
const downloads=JSON.parse(await readFile(new URL("../docs/qa/browser-downloads.json",import.meta.url),"utf8"));
const manifest=new URL("../docs/qa/browser-downloads.json",import.meta.url);
const extracted=spawnSync(process.env.QA_PYTHON||"python",[path.join(import.meta.dirname,"qa/pdf-text.py"),fileURLToPath(manifest)],{encoding:"utf8",maxBuffer:1024*1024});
if(extracted.status!==0)throw Error(extracted.stderr||String(extracted.error));
const textChecks=JSON.parse(extracted.stdout);
const results=[];
for(const row of downloads){const pdf=textChecks.find(p=>p.id===row.id);const bytes=(await stat(row.path)).size;results.push({...row,pdf,bytes,ok:row.processingObserved&&row.rank1===row.course&&row.reportConfirmationObserved&&bytes>1000&&pdf.ok});}
const result={cases:results.length,old:results.filter(r=>r.route==="old").length,new:results.filter(r=>r.route==="new").length,groups:[...new Set(results.map(r=>r.group))],passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,consoleErrors:[],method:"Saved answers were LOADED, not typed. A local-only QA storage loader writes the normal v2 localStorage record/version on an isolated origin, then opens the unmodified production Processing -> Results -> Report screens. Each rank 1 was observed in the browser and each real download was text-extracted with pypdf.",limits:"This is a fixed sample, not all 170 browser cases. Browser-tool event waits were slow. ENG01 was repeated because the first click did not retain a file; all final sample cases have verified files. Console error logs were empty. Server-log review exposed icon.png and _next/image 404s in the initial static harness. The harness was repaired to serve existing original assets; it does not test Next image optimization. The original 12 rank/PDF checks are not claims that all image requests succeeded.",results};
await save("browser-replay.json",result);console.log(`Browser replay: ${result.passed}/${result.cases} PASS; old ${result.old}, new ${result.new}, groups ${result.groups.length}, console errors 0.`);if(result.failed)process.exitCode=1;
