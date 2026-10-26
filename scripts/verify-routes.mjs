import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import courses from "../data/v2/courses-master.json" with { type: "json" };
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const staticRoutes = ["/","/about","/how-it-works","/intake","/journey","/journey/interests","/journey/skills","/journey/academic","/processing","/results","/report"];
const expected = [...staticRoutes,...courses.map(course=>`/results/${course.id}`)];
const errors=[];
for(const route of expected){
  const relative=route==="/"?"index":route.slice(1);
  for(const extension of ["html","rsc"]){try{await access(path.join(root,".next/server/app",`${relative}.${extension}`));}catch{errors.push(`Missing ${route} ${extension.toUpperCase()}`);}}
}
try{
  const manifest=JSON.parse(await readFile(path.join(root,"public/offline-manifest.json"),"utf8"));
  const worker=await readFile(path.join(root,"public/sw.js"),"utf8");
  const marker="self.OFFLINE_MANIFEST=";
  const start=worker.indexOf(marker)+marker.length,end=worker.indexOf(";\nimportScripts",start);
  const embedded=JSON.parse(worker.slice(start,end));
  const build=(await readFile(path.join(root,".next/BUILD_ID"),"utf8")).trim();
  if(manifest.version!==build || embedded.version!==build)errors.push("Offline manifest/worker does not match build ID");
  if(JSON.stringify(manifest)!==JSON.stringify(embedded))errors.push("Worker manifest differs from offline-manifest.json");
  for(const route of expected){
    if(!manifest.routes[route] || !embedded.routes[route]){errors.push(`Offline manifest missing ${route}`);continue;}
    const page=manifest.resources.find(resource=>resource.type==="page" && resource.key===route);
    const rsc=manifest.resources.find(resource=>resource.key===manifest.routes[route].rsc);
    if(!page || !rsc)errors.push(`Offline HTML/RSC missing ${route}`);
    for(const resource of [page,rsc].filter(Boolean)){try{await access(path.join(root,"public",resource.url));}catch{errors.push(`Packaged file missing ${resource.url}`);}}
  }
  const legacy=Object.keys(manifest.routes).filter(route=>route.startsWith("/results/")&&!courses.some(course=>route===`/results/${course.id}`));
  if(legacy.length)errors.push(`Unexpected detail routes: ${legacy.join(", ")}`);
  console.log(`Offline manifest: ${Object.keys(manifest.routes).length} routes, ${manifest.resources.length} files, ${manifest.bytes} bytes, build ${build}.`);
}catch(error){errors.push(`Offline packaging: ${error.message}`);}
if(errors.length){console.error(`FAIL: ${errors.length} route verification error(s)\n${errors.join("\n")}`);process.exitCode=1;}
else console.log(`PASS: ${expected.length} routes (${courses.length} v2 details + ${staticRoutes.length} static), each with HTML/RSC; worker contains all 85 detail routes.`);
