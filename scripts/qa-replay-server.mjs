// Local-only test harness. Serves existing production artifacts without editing UI.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEmptySession } from "../lib/sessionSchema.js";
const root=fileURLToPath(new URL("../",import.meta.url));
const cases=JSON.parse(await readFile(path.join(root,"docs/qa/browser-sessions.json"),"utf8"));
const types={".html":"text/html; charset=utf-8",".rsc":"text/x-component",".js":"text/javascript",".css":"text/css",".json":"application/json",".woff2":"font/woff2",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".wav":"audio/wav"};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://127.0.0.1:3100");
    if(url.pathname==="/__qa/load"){
      const row=cases.find(c=>c.index===Number(url.searchParams.get("case")));if(!row){res.writeHead(404);res.end("Unknown QA case");return;}
      // Fresh, isolated QA origin. Uses the actual localStorage keys and v2 record.
      const state = url.searchParams.get("state");
      const saved = state === "empty" ? createEmptySession() : state === "progress" ? { ...row.session, skills: {}, journeyProgress: { interests: "Completed", skills: "In Progress", academic: "Not Started" } } : { ...row.session, nickname: "QA Niño Áéíóú Ñü" };
      const session=JSON.stringify(JSON.stringify(saved)).replaceAll("<","\\u003c");
      const language = url.searchParams.get("lang") === "fil" ? "fil" : "en";
      const requested = url.searchParams.get("target") || "/processing";
      const destination = /^\/(?:$|intake(?:\?step=2)?$|about$|how-it-works$|journey(?:\/skills)?$|results(?:\/[A-Z]+\d+)?$|report$)/.test(requested) ? requested : "/processing";
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"});
      res.end(`<!doctype html><title>QA saved-session replay</title><p>Loading QA case ${row.index}: ${row.course}. Answers are loaded, not typed.</p><script>localStorage.setItem('careerCompassSession',${session});localStorage.setItem('careerCompassSessionVersion','2');localStorage.setItem('careerCompassLocalMigrationV1','true');localStorage.setItem('careerCompassLanguage',${JSON.stringify(language)});location.replace(${JSON.stringify(destination)});</script>`);return;
    }
    let file;
    if(url.pathname==="/_next/image"){
      // Test-only fallback to the existing original image; no resize/optimization.
      const source=url.searchParams.get("url");if(!source?.startsWith("/")||source.startsWith("//"))throw Error("Local image source required");
      file=path.join(root,"public",decodeURIComponent(source));
    }
    else if(url.pathname==="/icon.png")file=path.join(root,"app/icon.png");
    else if(url.pathname.startsWith("/_next/static/"))file=path.join(root,".next/static",decodeURIComponent(url.pathname.slice(14)));
    else{
      const publicFile=path.join(root,"public",decodeURIComponent(url.pathname));
      if((await stat(publicFile).catch(()=>null))?.isFile())file=publicFile;
      else {const route=url.pathname==="/"?"index":url.pathname.replace(/^\//,"");file=path.join(root,".next/server/app",route+(req.headers.rsc==="1"?".rsc":".html"));}
    }
    const allowed=[path.join(root,"public"),path.join(root,".next/static"),path.join(root,".next/server/app")];
    if(file!==path.join(root,"app/icon.png")&&!allowed.some(base=>file.startsWith(base+path.sep))){res.writeHead(403);res.end();return;}
    const bytes=await readFile(file);res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(bytes);
  }catch(error){res.writeHead(404,{"Content-Type":"text/plain"});res.end("QA artifact not found");console.error(req.url,error.code);}
});
const port = Number(process.env.QA_PORT || 3100);
server.listen(port,"127.0.0.1",()=>console.log(`QA replay harness: http://127.0.0.1:${port}/__qa/load?case=1 (12 cases). Existing production artifacts; no app source edits.`));
