import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import master from "../../data/v2/courses-master.json" with { type: "json" };
import items from "../../data/v2/items.json" with { type: "json" };
import links from "../../data/v2/links.json" with { type: "json" };
import { sha256, validateAnswers, scoreCourses, rankCourses } from "../../lib/scoringV2/index.js";

export { master, items, links, sha256 };
export const output = fileURLToPath(new URL("../../docs/qa/", import.meta.url));
export const tiers = [{label:"below75",gwa:70},{label:"75to79",gwa:77},{label:"80to84",gwa:82},{label:"85to89",gwa:87},{label:"90to94",gwa:92},{label:"95to100",gwa:97}];
export const banks = Object.fromEntries(["interests","skills","certificates","strands","oldSubjects","electives","coreSubjects"].map(key=>[key,items[key].filter(row=>row.scored!==false).map(row=>row.id)]));
// Mulberry32, uint32 outputs; rejection sampling avoids integer bucket bias.
export function random(seed) {
  let state=parseInt(sha256(seed).slice(0,8),16)>>>0;
  const word=()=>{let t=state=(state+0x6D2B79F5)>>>0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return (t^(t>>>14))>>>0;};
  const int=n=>{const ceiling=Math.floor(4294967296/n)*n;let x;do{x=word();}while(x>=ceiling);return x%n;};
  return { int, chance:p=>word()/4294967296<p, pick:values=>values[int(values.length)] };
}
export function sample(rng,values,count){const pool=[...values];for(let i=0;i<count;i++){const j=i+rng.int(pool.length-i);[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,count);}
export function uniform(rng,route){
  const tier=rng.int(6);
  return {tier,answers:{route,interests:Object.fromEntries(banks.interests.map(id=>[id,rng.pick(["A","B","C","D"])])),skills:Object.fromEntries(banks.skills.map(id=>[id,1+rng.int(5)])),certificates:sample(rng,banks.certificates,rng.int(4)),gwa:tiers[tier].gwa,
    ...(route==="old"?{old:{strand:rng.pick(items.strands.map(x=>x.id)),subjects:sample(rng,banks.oldSubjects,1+rng.int(3))}}:{new:{electives:sample(rng,banks.electives,rng.int(4)),bestSubjects:sample(rng,banks.coreSubjects,1+rng.int(3))}})}};
}
export function checkedRanking(answers){
  const validation=validateAnswers(answers);if(!validation.valid)throw new Error(JSON.stringify(validation.errors));
  const scores=scoreCourses(answers), ranked=rankCourses(answers), byId=new Map(scores.map(c=>[c.id,c]));
  if(ranked.length!==85 || ranked.some(c=>JSON.stringify(c)!==JSON.stringify(byId.get(c.id))))throw new Error("Public scoring/ranking mismatch");
  return ranked;
}
export const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
export function median(a){const x=[...a].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;}
export function gini(a){const x=[...a].sort((a,b)=>a-b),sum=x.reduce((s,v)=>s+v,0);return sum?x.reduce((s,v,i)=>s+(2*(i+1)-x.length-1)*v,0)/(x.length*sum):0;}
export async function save(name,value){await mkdir(output,{recursive:true});await writeFile(path.join(output,name),typeof value==="string"?value:JSON.stringify(value,null,2)+"\n");}
export function csv(rows){const keys=Object.keys(rows[0]);const cell=x=>JSON.stringify(x??null);return keys.join(",")+"\n"+rows.map(row=>keys.map(k=>cell(row[k])).join(",")).join("\n")+"\n";}
