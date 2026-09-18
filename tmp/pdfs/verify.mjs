import {registerHooks} from 'node:module';
import {readFileSync,writeFileSync} from 'node:fs';
registerHooks({resolve(specifier,context,next){try{return next(specifier,context)}catch(error){if(specifier.startsWith('.')&&!/\.[a-z]+$/i.test(specifier))return next(specifier+'.js',context);throw error;}},load(url,context,next){if(url.endsWith('.json')&&url.includes('/data/'))return {format:'module',shortCircuit:true,source:'export default '+readFileSync(new URL(url),'utf8')};return next(url,context);}});
const {createExplorerReport}=await import('../../lib/explorerReport.js');
const courses=JSON.parse(readFileSync('data/explore-courses.json','utf8'));
const reports=[];
for(const language of ['en','fil']){
 for(const course of courses){
 const doc=createExplorerReport({language,nickname:'Forest',date:'September 18, 2026',answers:{strand:'Academic-STEM',gwa:92,subjects:['Physics'],interests:{'INT-01':'A','INT-02':'A'},skills:{'SKL-01':5}},topCourses:[{...course,categoryName:course.category,categoryCode:'C1',finalCourseMatchPercent:80}]});
 const text=doc.output();if(!text.includes(language==='fil'?'Ulat ng Manlalakbay':'Explorer Report'))throw Error('Missing report language');
 reports.push({language,course:course.courseId,pages:doc.getNumberOfPages()});
 if(course.courseId==='BSIT-001')writeFileSync('tmp/pdfs/report-'+language+'.pdf',Buffer.from(doc.output('arraybuffer')));
 }
}
console.log(JSON.stringify(reports));
