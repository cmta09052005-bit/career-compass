import { master, items, links, banks, random, sample, uniform, checkedRanking, save, csv, sha256 } from "./qa/common.mjs";
const probabilities=[0.5,0.75,1], N=300;
const types=["interests","skillsHigh","certificates","strand","oldSubjects","electives","coreSubjects"];
function fill(rng,chosen,bank,min,max){const n=rng.int(max-chosen.length+1);const result=[...chosen,...sample(rng,bank.filter(id=>!chosen.includes(id)),n)];return result.length>=min?result:sample(rng,bank,min+rng.int(max-min+1));}
function persona(rng,course,route,p){
  const {answers}=uniform(rng,route),link=links[course.id];
  for(const option of link.interests){const question=option.slice(0,-2);if(rng.chance(p))answers.interests[question]=option.at(-1);}
  for(const id of link.skills)if(rng.chance(p))answers.skills[id]=rng.pick([4,5]);
  answers.certificates=fill(rng,link.certificates.filter(()=>rng.chance(p)),banks.certificates,0,3);
  if(route==="old"){
    if(rng.chance(p))answers.old.strand=link.strand;
    const subjects=link.oldSubjects.filter(()=>rng.chance(p));
    answers.old.subjects=subjects.length?fill(rng,subjects,banks.oldSubjects,1,3):sample(rng,banks.oldSubjects,1+rng.int(3));
  }else{
    let electives=link.electives.filter(()=>rng.chance(p));if(electives.length>3)electives=sample(rng,electives,3);
    answers.new.electives=fill(rng,electives,banks.electives,0,3);
    const others=banks.coreSubjects.filter(id=>id!==link.coreSubject);
    answers.new.bestSubjects=rng.chance(p)?[link.coreSubject,...sample(rng,others,rng.int(3))]:sample(rng,others,1+rng.int(3));
  }
  return answers;
}
function inclusion(a,l){return {interests:[l.interests.filter(x=>a.interests[x.slice(0,-2)]===x.at(-1)).length,2],skillsHigh:[l.skills.filter(id=>a.skills[id]>=4).length,2],certificates:[l.certificates.filter(x=>a.certificates.includes(x)).length,2],...(a.route==="old"?{strand:[Number(a.old.strand===l.strand),1],oldSubjects:[l.oldSubjects.filter(x=>a.old.subjects.includes(x)).length,2]}:{electives:[l.electives.filter(x=>a.new.electives.includes(x)).length,5],coreSubjects:[Number(a.new.bestSubjects.includes(l.coreSubject)),1]})};}
const rows=[];
for(const route of ["old","new"])for(const p of probabilities){
  for(const course of master){
    const seed=`career-compass:prompt27:persona:${route}:${p}:${course.id}:v1`,rng=random(seed),counts={top1:0,top5:0,top10:0},realized=Object.fromEntries(types.map(t=>[t,{included:0,opportunities:0}])),outrankers={};
    for(let i=0;i<N;i++){
      const a=persona(rng,course,route,p),ranked=checkedRanking(a),rank=ranked.findIndex(c=>c.id===course.id)+1;
      for(const [key,k]of [["top1",1],["top5",5],["top10",10]])if(rank<=k)counts[key]++;
      for(const [type,[included,opportunities]]of Object.entries(inclusion(a,links[course.id]))){realized[type].included+=included;realized[type].opportunities+=opportunities;}
      for(const c of ranked.slice(0,rank-1))outrankers[c.id]=(outrankers[c.id]||0)+1;
    }
    rows.push({course:course.id,name:course.name,group:course.group,route,p,profiles:N,...counts,rank1Probability:counts.top1/N,top5Probability:counts.top5/N,top10Probability:counts.top10/N,realized:Object.fromEntries(Object.entries(realized).filter(([,v])=>v.opportunities).map(([k,v])=>[k,{...v,rate:v.included/v.opportunities}])),outrankers:Object.entries(outrankers).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],"en"))});
  }
  console.log(`${route} p=${p}: ${N*master.length} profiles complete`);
}
function overlap(target,rival,route){const a=links[target],b=links[rival],intersect=(x,y)=>x.filter(v=>y.includes(v)).length;return {interests:intersect(a.interests,b.interests),skills:intersect(a.skills,b.skills),certificates:intersect(a.certificates,b.certificates),...(route==="old"?{oldSubjects:intersect(a.oldSubjects,b.oldSubjects),strand:Number(a.strand===b.strand)}:{electives:intersect(a.electives,b.electives),coreSubject:Number(a.coreSubject===b.coreSubject)})};}
const weak=rows.filter(row=>(row.p===0.75&&row.top5Probability<0.5)||(row.p===1&&row.top5Probability<0.8)).map(row=>({...row,diagnosis:row.outrankers.slice(0,3).map(([id,count])=>({course:id,profilesOutrankingTarget:count,outOf:N,sharedLinkedItems:overlap(row.course,id,row.route)}))}));
const realized=Object.fromEntries(["old","new"].map(route=>[route,Object.fromEntries(probabilities.map(p=>[p,Object.fromEntries(types.map(type=>{const matching=rows.filter(r=>r.route===route&&r.p===p).map(r=>r.realized[type]).filter(Boolean),included=matching.reduce((s,v)=>s+v.included,0),opportunities=matching.reduce((s,v)=>s+v.opportunities,0);return[type,opportunities?{included,opportunities,rate:included/opportunities}:null];}).filter(([,v])=>v))]))]));
const result={method:{profilesPerCourseRouteP:N,probabilities,seedTemplate:"career-compass:prompt27:persona:{route}:{p}:{courseId}:v1",generator:"Mulberry32; SHA-256 seed; exact rejection-sampled integer choices",pMeaning:"Probability of ATTEMPTING a target-linked answer, not final inclusion. At p=1 only 3 of 5 linked electives can be selected; this is not a perfect profile.",gwa:"Uniform six tiers with representatives 70,77,82,87,92,97",rules:{electives:"Independent linked Bernoulli attempts, uniform trim to 3, uniform number of additions 0..remaining capacity from remaining rows",core:"Include linked core with p then 0..2 other cores; otherwise 1..3 distinct of the OTHER three",oldSubjects:"Independent p attempts for two links; if zero choose 1..3 of all 19; else add uniformly 0..remaining capacity",strand:"Linked with p, otherwise uniform all 10 including GAS",certificates:"Two independent linked p attempts then 0..remaining capacity uniformly from remaining categories",interests:"Linked option with p, otherwise uniform four; unlinked questions uniform",skills:"Linked high 4 or 5 uniformly with p, otherwise 1..5 uniform; others 1..5 uniform",realized:"Final selection fraction per linked item; skillsHigh is final rating >=4, including uniform fallback"}},totalProfiles:rows.length*N,realized,rows,weak};
await save("recoverability.json",result);await save("recoverability.csv",csv(rows.map(({realized,outrankers,...r})=>({...r,...Object.fromEntries(Object.entries(realized).map(([k,v])=>[`${k}Inclusion`,v.rate]))}))));console.log(`Weak threshold cases: ${weak.length}. Result SHA-256: ${sha256(JSON.stringify(result,null,2)+"\n")}`);
