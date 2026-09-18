// One-time, syntax-aware migration. Edits only JSX tag names, preserving formatting.
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : e.name.endsWith('.js') ? [path.join(dir,e.name)] : []);
const excluded = /LanguageProvider|LanguageSwitcher|Localized|layout\.js/;
const strings = new Set();
for (const file of [...files('app'), ...files('components')]) {
  if (excluded.test(file)) continue;
  const source = fs.readFileSync(file,'utf8');
  if (source.includes('import Localized')) continue;
  const ast = parser.parse(source,{sourceType:'module',plugins:['jsx']});
  const edits=[];
  traverse(ast, {
    JSXText(p) { const value=p.node.value.replace(/\s+/g,' ').trim(); if (/[a-zA-Z]/.test(value)) strings.add(value); },
    StringLiteral(p) { if (/[A-Z]|[a-z] [a-z]/.test(p.node.value) && !/[{}]|className/.test(p.node.value) && p.node.value.length < 1500) strings.add(p.node.value); },
    JSXElement(p) {
      const n=p.node, name=n.openingElement.name;
      if (name.type!=='JSXIdentifier' || !(/^[a-z]/.test(name.name) || ['Link','Image','Component'].includes(name.name))) return;
      if (['svg','path','g','circle','rect','ellipse','line','polygon','polyline','defs','linearGradient','radialGradient','stop','use','clipPath','mask'].includes(name.name)) return;
      const hasText=n.children.some(c=>c.type==='JSXText' && /\S/.test(c.value) || c.type==='JSXExpressionContainer');
      const hasAttribute=n.openingElement.attributes.some(a=>['aria-label','aria-valuetext','alt','title','placeholder','data-tooltip'].includes(a.name?.name));
      if (!hasText && !hasAttribute && name.name!=='Component') return;
      edits.push({start:name.start,end:name.end,text:`Localized as=${/^[a-z]/.test(name.name)?JSON.stringify(name.name):`{${name.name}}`}`});
      if(n.closingElement) edits.push({start:n.closingElement.name.start,end:n.closingElement.name.end,text:'Localized'});
    }
  });
  if(edits.length) {
    let result=source;
    for(const edit of edits.sort((a,b)=>b.start-a.start)) result=result.slice(0,edit.start)+edit.text+result.slice(edit.end);
    const at=source.startsWith('"use client";') ? result.indexOf('\n')+1 : 0;
    result=result.slice(0,at)+'\nimport Localized from "@/components/Localized";\n'+result.slice(at);
    // Components that pass functions or refs into the render adapter are client components.
    if(!result.startsWith('"use client";') && !/app[\\/]results[\\/]\[courseId\][\\/]page/.test(file)) result='"use client";\n'+result;
    fs.writeFileSync(file,result);
  }
}
fs.writeFileSync('lib/i18n/source-inventory.json',JSON.stringify([...strings].sort(),null,2)+'\n');
