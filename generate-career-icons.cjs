const fs = require('fs');
const path = require('path');
const out = path.join(process.cwd(), 'public/icons/career-compass');
const ink = '#1B2A4A';
const icons = [];
const p = (d, fill='none', sw=2, extra='') => `<path d="${d}" fill="${fill}" ${extra.includes('stroke="') ? '' : `stroke="${ink}"`} stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const c = (x,y,r,fill='none',sw=2,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra.includes('stroke="') ? '' : `stroke="${ink}"`} stroke-width="${sw}" ${extra}/>`;
const gold='url(#gold)', paper='url(#paper)', navy='url(#navy)';
const hatch = d => p(d,'url(#hatch)',.7,'opacity=".62"');
const line = d => p(d,'none',.85,'opacity=".7"');
const add=(name,title,body,description)=>icons.push({name,title,body,description});
const star=(x,y,r=13)=>p(`M${x} ${y-r} Q${x+2} ${y-2} ${x+r} ${y} Q${x+2} ${y+2} ${x} ${y+r} Q${x-2} ${y+2} ${x-r} ${y} Q${x-2} ${y-2} ${x} ${y-r}Z`,gold,1.1);
const rivet=(x,y)=>c(x,y,3.8,gold,1)+p(`M${x-1.5} ${y+1}l3 -2`,'none',.65);
add('mountain-peak','Mountain peak with flag',
 p('M29 210L109 72Q115 63 121 74L229 210Z',paper,2.6)+
 p('M116 69L138 124L126 118L116 136L102 120L81 136Z',gold,1.6)+
 
 p('M116 135L112 202L139 174L130 189L160 210L65 210L89 168Z',navy,1.8)+
 hatch('M120 83L143 131L177 209L161 209L127 154L116 137Z')+
 
 p('M117 70V29','none',3)+p('M119 30Q139 22 157 35L153 62Q135 48 119 58Z',navy,1.8)+p('M124 36Q138 31 151 39M124 51Q137 44 149 51','none',.8,'stroke="#D4A017"')+
 line('M35 218Q83 209 114 217T222 217M65 188l16 -24m-9 27l13 -24m99 12l13 21m-7 -32l16 31M48 205l8 -13M142 146l15 25')+rivet(117,30));
let needles='';
for(let i=0;i<8;i++){let y=80+i*15,x=139-i*4; needles+=p(`M${x} ${y}Q${x-22} ${y-23} ${x-42} ${y-24}Q${x-25} ${y-3} ${x} ${y+5}`,navy,1.1)+p(`M${x} ${y+5}Q${x+29} ${y-27} ${x+43} ${y-21}Q${x+26} ${y} ${x} ${y+11}`,gold,1.1)+line(`M${x-36} ${y-21}L${x-4} ${y+1}M${x+35} ${y-18}L${x+3} ${y+5}`);}
add('pine-branch','Pine branch',p('M98 226Q123 148 143 42Q151 36 150 47Q128 162 106 229Z',gold,1.8)+needles+p('M143 64Q126 48 138 27Q157 41 143 64Z',navy,1.5)+line('M141 32L142 56')+p('M101 220l-12 5m19 -24l13 7','none',1.1));
add('ribbon-scroll','Scroll with ribbon tie',
 p('M71 47Q54 32 44 48L32 173Q30 191 49 197L184 216Q204 216 212 200L224 89Q225 76 212 72Z',paper,2.5)+
 p('M71 47Q56 66 61 82L210 104Q227 102 224 86Q221 69 205 73L69 48Z',gold,1.8)+
 p('M61 82Q54 79 53 69Q54 56 61 53M211 79Q222 83 216 96L210 95','none',1.2)+
 p('M49 197Q40 193 42 181Q46 171 61 175L193 195Q202 198 197 207Q210 205 212 193L211 202Q204 216 191 214Z',gold,1.8)+
 hatch('M61 82L72 84L59 174L45 175Z')+
 line('M82 102l99 15M79 110l90 13M77 128l99 15M75 137l66 9M70 155l108 15')+
 p('M124 91L145 94L131 186L110 183Z',navy,1.8)+
 p('M120 148Q76 109 83 143Q88 164 120 156Q159 127 166 149Q169 172 128 157L145 195L130 190L123 198L116 157L91 190L89 176L77 176Z',gold,1.6)+c(123,151,7,navy,1.3)+line('M91 136l22 14m22 2l22 -4M119 169l-19 14M133 170l5 15'));
add('island-flag','Island with flag',
 p('M47 170Q71 133 99 148Q116 115 150 142Q177 133 213 174Q177 201 124 197Q78 199 47 170Z',paper,2.3)+
 p('M48 170Q88 180 113 168Q161 180 210 173Q168 198 123 194Q78 196 48 170Z',gold,1.5)+
 hatch('M60 178Q119 189 195 178Q156 199 97 191Z')+
 p('M140 143V43','none',3)+p('M143 46Q166 35 187 48L176 64L189 79Q166 67 143 79Z',navy,1.8)+p('M150 51Q165 45 178 50M149 70Q165 63 176 69','none',.8,'stroke="#D4A017"')+
 p('M91 146Q92 115 76 100M75 99Q86 82 109 102Q88 95 80 103M77 99Q54 88 48 111Q62 100 77 105M76 100Q77 77 57 74Q69 87 71 101',gold,1.5)+
 line('M31 198Q51 189 74 199T121 201M146 209Q168 202 184 207T232 198M53 216Q73 209 94 215M111 222Q137 214 163 220M108 153l9 -7m47 12l12 5')+rivet(140,43));
add('explorer-backpack','Explorer backpack',
 p('M97 68V49Q97 28 126 29Q155 30 156 50V67L145 66V50Q143 40 126 40Q108 40 108 51V69Z',gold,2)+
 p('M73 87Q56 103 58 170L51 204L72 208L87 175M179 88Q199 112 196 176L205 202L183 211L173 174',navy,2)+
 p('M76 72Q124 55 177 76L189 202Q183 224 126 224Q70 224 63 204Z',paper,2.6)+
 p('M77 79Q122 64 175 80L181 119Q130 145 70 116Z',navy,2)+
 p('M82 86Q124 74 168 88L172 113Q127 130 78 111Z','none',1,'stroke="#D4A017"')+
 p('M80 151Q124 144 174 153L174 199Q123 213 79 198Z',gold,1.8)+
 p('M87 160Q124 154 165 162L165 191Q124 201 87 192Z','none',.9)+
 p('M91 99L105 100L104 171L90 170ZM149 101L162 98L162 169L148 171Z',gold,1.6)+
 p('M89 127h18v18H89ZM146 127h19v18h-19Z',navy,1.5)+p('M93 130h10v11H93ZM150 130h11v11h-11Z',gold,1)+
 hatch('M66 129L77 136L72 201L84 211L75 212L66 204Z')+line('M117 158v40m5 -40v41M115 74l14 -2M76 207q46 14 96 -1')+rivet(97,153)+rivet(155,153));
let footprints='';
[[54,194,-32],[86,166,-27],[108,135,9],[146,116,42],[179,81,7]].forEach(([x,y,a])=>{footprints+=`<g transform="translate(${x} ${y}) rotate(${a})">`+p('M-5 -18Q-13 -10 -9 2Q-7 8 2 6Q9 2 8 -6Q9 -19 2 -22Q-1 -24 -5 -18Z',gold,1.3)+p('M-8 12Q-10 23 -2 24Q7 25 6 12Z',navy,1.2)+line('M-6 -11l10 -3M-6 -5l11 -3M-4 1l9 -3')+'</g>';});
add('footprint-trail','Dotted footprint trail',p('M30 220Q26 161 67 151T119 98Q118 43 188 43Q216 43 226 23','none',1.5,'stroke-dasharray="1 8" opacity=".65"')+footprints,'Decorative connector; rotate or tile the square without stretching its artwork.');
let seal='';for(let i=0;i<24;i++){let a=i*Math.PI/12,r=i%2?91:98;seal+=`${i?'L':'M'}${128+Math.cos(a)*r} ${128+Math.sin(a)*r}`;}seal+='Z';
let stitches='';for(let i=0;i<48;i++){const a=i*Math.PI/24;stitches+=line(`M${128+Math.cos(a)*83} ${128+Math.sin(a)*83}L${128+Math.cos(a)*87} ${128+Math.sin(a)*87}`);}
add('wax-seal-frame','Empty wax seal frame',p(`${seal} M196 128A68 68 0 1 0 60 128A68 68 0 1 0 196 128Z`,gold,2.4,'fill-rule="evenodd"')+c(128,128,90,'none',1.1)+c(128,128,75,'none',3)+c(128,128,70,'none',1)+stitches+star(128,46,6)+star(128,210,6)+star(46,128,6)+star(210,128,6),'The center is genuinely transparent and empty for badge artwork.');
add('magnifying-glass','Magnifying glass',
 p('M150 162L167 147L225 204Q234 214 222 226Q211 236 201 224Z',gold,2.5)+
 p('M170 163L181 153L220 193L207 206Z',navy,1.5)+line('M177 162l35 36m-30 -41l35 36M204 209l12 12')+
 c(106,105,76,gold,2.5)+c(106,105,67,navy,1.5)+c(106,105,58,paper,1.8,'fill-opacity=".3"')+
 c(106,105,62,'none',.9,'stroke="#D4A017"')+p('M60 107Q57 69 91 58M62 118l-1 -5','none',2,'stroke="#F5ECD7"')+
 line('M71 147l13 8m-4 -12l13 8M110 53l14 3')+rivet(106,35)+rivet(176,105)+rivet(106,175)+rivet(36,105));
add('fog-mist','Translucent fog and mist',
 '<g filter="url(#mist)" opacity=".25">'+p('M36 111Q58 53 108 99Q152 37 192 98Q230 94 231 132Q219 169 173 152Q125 190 79 157Q31 174 26 139Z',paper,0)+'</g>'+
 '<g opacity=".48">'+p('M31 125Q57 107 80 123T132 125Q159 112 187 123Q216 133 222 115Q225 99 207 100Q192 99 197 112','none',2.2,'stroke="url(#gold)"')+
 p('M47 153Q71 135 108 150Q129 160 150 145Q178 128 208 145','none',1.6)+
 p('M46 99Q64 76 92 96Q114 114 137 93Q160 70 185 89','none',1.5,'stroke="url(#gold)"')+
 line('M25 169Q56 161 84 170M103 174Q142 163 172 171T225 165M66 83Q82 77 94 84M158 112l18 1')+'</g>','Intentionally translucent with soft edges; no background rectangle.');
let rays='';for(let i=0;i<24;i++){let a=i*Math.PI/12-Math.PI/2; const xy=(r,b=a)=>`${128+Math.cos(b)*r} ${128+Math.sin(b)*r}`;rays+=p(`M${xy(43,a-.045)}L${xy(i%2?84:108)}L${xy(43,a+.045)}Z`,i%2?navy:gold,1)+line(`M${xy(53,a+.085)}L${xy(76,a+.085)}`);}
add('sunburst','Engraved sunburst',rays+c(128,128,37,gold,2)+c(128,128,29,paper,1)+star(128,128,20)+c(128,128,4,navy,1));
let ticks='';for(let i=0;i<32;i++){let a=i*Math.PI/16; ticks+=p(`M${128+Math.sin(a)*69} ${103+Math.cos(a)*69}L${128+Math.sin(a)*(i%4?73:77)} ${103+Math.cos(a)*(i%4?73:77)}`,'none',.8,'stroke="#D4A017"');}
add('compass-download','Compass download',c(128,103,87,gold,2.5)+c(128,103,78,navy,1.4)+c(128,103,63,paper,1.6)+ticks+
 p('M128 46L138 92L185 103L138 113L128 158L118 114L72 103L118 92Z',navy,1.5)+
 p('M128 46V103L138 92Z M72 103H128L118 114Z',gold,1)+c(128,103,10,gold,1.5)+c(128,103,4,navy,1)+
 p('M117 146H139V185H160L128 219L96 185H117Z',gold,2.4)+p('M128 151V204M108 189l20 21l20 -21','none',.9)+
 p('M80 210V232H176V210H167V223H89V210Z',navy,1.8)+rivet(128,24));
add('flag-marker-pin','Flag location marker',
 p('M128 232Q105 207 75 165Q50 130 56 99Q63 45 128 39Q193 44 200 99Q207 134 181 168Q152 208 128 232Z',gold,2.6)+
 p('M128 218Q98 181 79 152Q61 126 67 100Q75 53 128 50Q181 54 190 99Q197 126 178 155Q156 188 128 218Z',navy,1.4)+
 c(128,111,48,paper,1.8)+c(128,111,53,'none',.8,'stroke="#D4A017"')+
 p('M112 145V77','none',2.5)+p('M115 80Q134 73 153 83L145 96L158 108Q135 98 115 107Z',gold,1.6)+line('M120 85q14 -3 23 1M120 101q13 -4 22 1M103 146h24')+rivet(112,77)+star(128,186,8));
function defs(prefix='') {return `<defs>
<linearGradient id="gold" x1="0" y1="0" x2=".85" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#fff0b5"/><stop offset=".24" stop-color="#d4a017"/><stop offset=".48" stop-color="#b57a25"/><stop offset=".62" stop-color="#edc975"/><stop offset="1" stop-color="#805025"/></linearGradient>
<linearGradient id="paper" x2=".8" y2="1"><stop stop-color="#fff5db"/><stop offset=".55" stop-color="#f5ecd7"/><stop offset="1" stop-color="#cbb185"/></linearGradient>
<linearGradient id="navy" x2="1" y2="1"><stop stop-color="#344b6a"/><stop offset=".55" stop-color="#1b2a4a"/><stop offset="1" stop-color="#101b30"/></linearGradient>
<pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M0 0V5" stroke="#1b2a4a" stroke-width=".7" opacity=".6"/></pattern>
<filter id="grain" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="17" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".3" intercept=".74"/><feFuncG type="linear" slope=".3" intercept=".74"/><feFuncB type="linear" slope=".3" intercept=".74"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/><feComposite in2="SourceGraphic" operator="in"/></filter><filter id="mist" x="-25%" y="-50%" width="150%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>`;}
for(const icon of icons){const prefix=icon.name+'-';const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-labelledby="${prefix}title"><title id="${prefix}title">${icon.title}</title>${defs()}<g filter="url(#grain)">${icon.body}</g></svg>`.replace(/id="(gold|paper|navy|hatch|mist|grain)"/g,`id="${prefix}$1"`).replace(/url\(#(gold|paper|navy|hatch|mist|grain)\)/g,`url(#${prefix}$1)`);fs.writeFileSync(path.join(out,icon.name+'.svg'),svg);}
const cells=icons.map((icon,i)=>{let x=32+(i%4)*280,y=140+Math.floor(i/4)*326;let svg=fs.readFileSync(path.join(out,icon.name+'.svg'),'utf8').replace('<svg ','<svg x="'+(x+18)+'" y="'+(y+6)+'" width="244" height="244" ').replace(' width="256" height="256"','');return `<rect x="${x}" y="${y}" width="264" height="304" rx="8" fill="${i===8?'#33435c':'#f0e1c5'}" stroke="#ad8a50"/>${svg}<text x="${x+132}" y="${y+274}" text-anchor="middle" fill="${i===8?'#f5ecd7':ink}" font-family="Georgia,serif" font-size="17">${String(i+1).padStart(2,'0')} · ${icon.title}</text>`;}).join('');
fs.writeFileSync(path.join(out,'preview.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1184" height="1150" viewBox="0 0 1184 1150"><rect width="1184" height="1150" fill="#1b2a4a"/><text x="42" y=" sixty"/><text x="42" y=" sixty"/><text x="42" y=" sixty"/><text x="42" y="58" font-family="Georgia,serif" font-size="32" fill="#edc975">CAREER COMPASS</text><text x="42" y="93" font-family="Arial,sans-serif" font-size="15" fill="#f5ecd7">EXPLORER ICON COLLECTION · 12 EDITABLE VECTOR ASSETS</text>${cells}</svg>`.replace(/<text x="42" y=" sixty"\/>/g,''));
fs.writeFileSync(path.join(out,'README.md'),`# Career Compass explorer icons\n\nTwelve original, editable SVG assets inspired by the supplied compass reference.\n\n- Canvas: 256 × 256; transparent background.\n- Palette: deep navy #1B2A4A, compass gold #D4A017, parchment #F5ECD7 with aged brass shading.\n- Stroke system: 2–2.6 px silhouettes, 1–1.8 px structural detail, 0.7–0.9 px engraving.\n- Recommended display: 64–128 px; fine engraving is intended for 96 px and larger.\n- No embedded raster images, fonts, scripts, external dependencies, or background rectangles.\n- Gradient and filter IDs are uniquely prefixed for inline use.\n- Wax seal center is empty and transparent. Fog is deliberately translucent.\n- Footprint trail is a square connector; rotate or repeat rather than stretching.\n- preview.svg is a presentation sheet, not a transparent production icon.\n\n${icons.map((x,i)=>`${i+1}. ${x.name}.svg — ${x.title}${x.description?' — '+x.description:''}`).join('\n')}\n`);
console.log(`Created ${icons.length} icons, preview.svg, and README.md in ${out}`);


