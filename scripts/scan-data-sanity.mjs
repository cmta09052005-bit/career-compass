import { readdir, readFile } from "node:fs/promises";
import { master, save } from "./qa/common.mjs";
import details from "../data/v2/course-details.json" with { type: "json" };
import schools from "../data/v2/schools.json" with { type: "json" };
const duplicates=[],salaryFlags=[],careerCounts=[],unparsed=[],requiredEmpty=[];
for(const c of master){
  const d=details[c.id],seen=new Map();
  for(const [i,career]of d.careers.entries()){
    // Case/whitespace-insensitive exact titles only, not inferred synonyms.
    const key=career.jobTitle.replace(/\s+/g," ").trim().toLowerCase();if(seen.has(key))duplicates.push({course:c.id,title:career.jobTitle,positions:[seen.get(key)+1,i+1]});else seen.set(key,i);
    const nums=career.salaryRange?.match(/\d[\d,]*/g)?.map(n=>Number(n.replaceAll(",","")));
    if(nums?.length!==2){unparsed.push({course:c.id,title:career.jobTitle,salaryRange:career.salaryRange});continue;}
    const [low,high]=nums,flags=[];if(high<1.5*low)flags.push("high-less-than-1.5-times-low");if(high>100000)flags.push("high-exceeds-100000");
    if(flags.length)salaryFlags.push({course:c.id,title:career.jobTitle,salaryRange:career.salaryRange,low,high,ratio:high/low,flags});
  }
  if(d.careers.length<4||d.careers.length>10)careerCounts.push({course:c.id,careers:d.careers.length});
  for(const key of ["overview","interestsStrengths","guidanceTips","chedBasis","studyTopics","careers"])if(d[key]==null||typeof d[key]==="string"&&!d[key].trim()||Array.isArray(d[key])&&!d[key].length)requiredEmpty.push({course:c.id,field:key});
}
const emptyFields=[],encoding=[];
const suspicious=/\uFFFD|Ã[\u0080-\u00BF]|Â[\u0080-\u00BF]|â[€™œ“”]|ðŸ|ï»¿|[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u;
function walk(value,file,key="$"){
  if(value===null||value===""||Array.isArray(value)&&!value.length||value&&typeof value==="object"&&!Array.isArray(value)&&!Object.keys(value).length)emptyFields.push({file,path:key,kind:value===null?"null":value===""?"empty-string":Array.isArray(value)?"empty-array":"empty-object"});
  if(typeof value==="string"&&suspicious.test(value))encoding.push({file,path:key,text:value});
  if(value&&typeof value==="object")for(const [k,v]of Object.entries(value))walk(v,file,`${key}.${k}`);
}
for(const file of (await readdir(new URL("../data/v2/",import.meta.url))).filter(f=>f.endsWith(".json")).sort())walk(JSON.parse(await readFile(new URL(`../data/v2/${file}`,import.meta.url),"utf8")),file);
const byId=new Map(master.map(c=>[c.id,c]));
const schoolInventory=schools.map(s=>({id:s.id,school:s.school,campus:s.campus,geographicGroup:s.group,type:s.type,province:s.province,codedCourses:s.courseIds,courseGroups:[...new Set(s.courseIds.map(id=>byId.get(id)?.group??"UNKNOWN CODE"))]}));
const schoolStructuralFlags=schools.flatMap(s=>{
  const flags=[];if(!["bicol","national"].includes(s.group))flags.push("unknown-geographic-group");
  if(!["public-suc","community-college","private","national"].includes(s.type))flags.push("unknown-type");
  if(s.group==="national"&&s.type!=="national"||s.type==="national"&&s.group!=="national")flags.push("national-group-type-mismatch");
  if(s.courseIds.some(id=>!byId.has(id)))flags.push("unknown-course-code");
  return flags.length?[{id:s.id,school:s.school,flags}]:[];
});
const emptyByFile={};for(const row of emptyFields){const counts=emptyByFile[row.file]??={null:0,"empty-string":0,"empty-array":0,"empty-object":0};counts[row.kind]++;}
const result={courses:master.length,careers:master.reduce((n,c)=>n+details[c.id].careers.length,0),duplicateCareerTitles:duplicates,salaryFlags,unparsedSalaries:unparsed,careerCountOutliers:careerCounts,requiredDetailEmpty:requiredEmpty,encodingCandidates:encoding,emptyFields:{count:emptyFields.length,byFile:emptyByFile,rows:emptyFields,interpretation:"Inventory, not errors: optional career notes, nullable locations, intentionally empty source metadata, explicit None answers and audit records are included. Required detail fields are checked separately."},schoolStructuralFlags,schoolInventory,schoolAcademicScope:{status:"NOT DETERMINED",question:"School.group is bicol/national geography, not an academic course group. No school academic-scope whitelist exists. Do not infer scope from names or fabricate inconsistency judgments.",provided:"All school IDs, geographic group/type, coded course IDs and academic group sets are listed for review. Only explicit structural inconsistencies can be flagged."},limits:"Duplicate titles use case/whitespace normalization only. Encoding patterns detect obvious candidates, not all possible corruption. Salary flags are arithmetic review items, not proof that a salary is wrong."};
await save("data-sanity.json",result);console.log(`Sanity: ${duplicates.length} duplicate career titles; ${salaryFlags.length} salary flags; ${careerCounts.length} career-count outliers; ${unparsed.length} unparsed salaries; ${requiredEmpty.length} missing required detail fields; ${encoding.length} encoding candidates; ${emptyFields.length} empty/null inventory entries; ${schoolStructuralFlags.length} school structural flags. School academic scope NOT DETERMINED.`);
