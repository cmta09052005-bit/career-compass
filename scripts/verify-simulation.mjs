import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { master } from "./qa/common.mjs";
const read=async file=>JSON.parse(await readFile(new URL(`../docs/qa/${file}`,import.meta.url),"utf8"));
const u=await read("uniform-profiles.json"),r=await read("recoverability.json"),repro=await read("reproducibility.json");
const errors=[];const check=(ok,label)=>{if(!ok)errors.push(label);};
for(const route of ["old","new"]){
  check(u.routes[route].all.profiles===20000,`${route} profile count`);
  check(u.routes[route].tiers.reduce((s,t)=>s+t.profiles,0)===20000,`${route} GWA count`);
  for(const [i,t]of [u.routes[route].all,...u.routes[route].tiers].entries()){
    check(t.courses.length===85&&new Set(t.courses.map(c=>c.id)).size===85,`${route}/${i} course coverage`);
    check(t.courses.reduce((s,c)=>s+c.top1,0)===t.profiles,`${route}/${i} top1 sum`);
    check(t.courses.reduce((s,c)=>s+c.top5,0)===5*t.profiles,`${route}/${i} top5 sum`);
    check(Object.values(t.rank1Decisions).reduce((s,n)=>s+n,0)===t.profiles,`${route}/${i} tie stages`);
    check(Math.abs(t.courses.reduce((s,c)=>s+c.meanRank,0)-3655)<1e-7,`${route}/${i} rank sum`);
  }
}
check(r.totalProfiles===153000&&r.rows.length===510,"Persona count");
for(const course of master)for(const route of ["old","new"])for(const p of [0.5,0.75,1]){
  const rows=r.rows.filter(x=>x.course===course.id&&x.route===route&&x.p===p);check(rows.length===1,`${course.id}/${route}/${p} coverage`);
  for(const x of rows){check(x.profiles===300&&x.top1<=x.top5&&x.top5<=x.top10&&x.top10<=300,`${course.id}/${route}/${p} counts`);check(Object.values(x.realized).every(v=>v.included>=0&&v.included<=v.opportunities),`${course.id}/${route}/${p} inclusion`);if(route==="new")check(x.realized.electives.rate<=0.6,`${course.id}/${route}/${p} elective cap`);}
}
for(const item of repro.files){const actual=createHash("sha256").update(await readFile(new URL(`../${item.file}`,import.meta.url))).digest("hex");check(item.identical&&item.firstSha256===item.repeatSha256&&actual===item.repeatSha256,`${item.file} repeat hash`);}
if(errors.length){console.error(`FAIL: ${errors.join("; ")}`);process.exitCode=1;}else console.log("PASS: 40,000 uniform profiles, all 12 GWA strata, 153,000 persona profiles, 510 course/route/p cells, rank/count/cap invariants and four byte-identical JSON/CSV hashes.");
