import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://literature-navigation.test/'))).text();
const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(code.length>10000,'Generated app script missing');
new vm.Script(code,{filename:'pocket-lit-navigation.js'});

const stylesheet=html.match(/<style id="literature-one-screen-ui">([\s\S]*?)<\/style>/)?.[1]||'';
assert.match(stylesheet,/#view-module\.learning-literature\.active\{[\s\S]*?display:grid!important/,'Literature must preserve Home/title grid, not flex');
assert.match(stylesheet,/grid-template-rows:clamp\(58px,8dvh,72px\) minmax\(0,1fr\)!important/,'Fixed compact header and flexible content row');
assert.match(stylesheet,/\.module-home-btn\{[^}]*max-height:60px!important/,'The Home button cannot consume hundreds of pixels');
assert.match(stylesheet,/#moduleContent\{[^}]*grid-row:2!important/,'Only the second grid row contains study content');
assert.match(stylesheet,/\.lit-panel\{[^}]*overflow-y:auto!important/,'Only the internal panel must scroll');
assert.doesNotMatch(code,/panel\.append\(changeLanguage\)/,'Selecting native language should not trigger a second language selection');
assert.match(code,/litJourney\.country=incoming/,'Country gate must synchronise literature country');
assert.match(code,/if\(selected\?\.\[3\]&&LIT_LANGUAGES/,'Country determines studied language');

class FakeEl{
 constructor(tag='div',label=''){this.tagName=tag.toUpperCase();this.textContent=label;this.children=[];this.className='';this.style={setProperty:(k,v)=>{this.style[k]=v}};this.value='';this.onclick=null;this.hidden=false;this.attrs={};}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(){}
 getBoundingClientRect(){return {top:220,bottom:1250,height:1030}}
}
const set=new Set(['active']);
const root=new FakeEl('section');
root.classList={add:(...names)=>names.forEach(x=>set.add(x)),remove:(...names)=>names.forEach(x=>set.delete(x)),contains:x=>set.has(x)};
const host=new FakeEl('div'),title=new FakeEl('h2'),lead=new FakeEl('p');
const els={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
const dom={createElement:tag=>new FakeEl(tag),querySelector:selector=>selector==='.bottom-nav'?{getBoundingClientRect:()=>({top:1250})}:null};
const start=code.indexOf('const LIT_BRANCHES=['),stop=code.indexOf('function litWorkspace(panel)',start);
assert.ok(start>=0&&stop>start,'Literature stage handlers missing');
const run=code.slice(start,stop)+
 '\n({open:litOpen,back:litBack,get journey(){return litJourney}})';
let workspaceCount=0;
const api=vm.runInNewContext(run,{
 document:dom,window:{addEventListener(){}},
 $:id=>els[id]||null,
 learningLabel:(ro,en)=>ro,
 LIT_COUNTRIES:[['RO','România','Romania','ro']],
 LIT_LANGUAGES:[['ro','Română','Romanian']],
 LIT_EUROPE_PROGRAMS:{RO:{byLevel:{},byGrade:{},verified:{},regions:false}},
 LIT_EUROPE_COMMON:{beginner:[['g','Morfologie și sintaxă','', 'grammar']],lower:[['g','Morfologie și sintaxă','', 'grammar']],medium:[['g','Morfologie și sintaxă','', 'grammar']]},
 educationCountrySelection:{code:'RO',label:'România'},
 worldwideSchoolYears:()=>[],
 eduAttachPrintAction:()=>{},
 educationCountryGate:()=>{throw Error('unexpected country loop')},
 renderLearningSubjects:()=>{},
 litSimpleWorkspace:panel=>{workspaceCount++;panel.append(new FakeEl('article','workspace'))},
 requestAnimationFrame:fn=>fn()
});
const all=(node)=>[node,...(node.children||[]).flatMap(all)];
const button=(match)=>{
 const found=all(host).find(x=>x.tagName==='BUTTON'&&match(x.textContent));
 assert.ok(found,'Missing clickable option: '+match.toString());
 return found
};
api.open('levels');
assert.equal(api.journey.stage,'levels');
assert.equal(all(host).filter(x=>x.tagName==='BUTTON'&&/Primar|Gimnaziu|Liceu|Universitate/.test(x.textContent)).length,4,
 'All four levels must be reachable, including after the country has been selected');
assert.ok(!all(host).some(x=>x.tagName==='BUTTON'&&x.textContent.includes('Schimbă limba')),'No language reselection prompt');
assert.equal(root.style.height,'1018px','Viewport must end above navigation dock');
button(x=>x.includes('Gimnaziu')).onclick();
assert.equal(api.journey.stage,'grades');
for(const grade of ['5','6','7','8'])button(x=>x===grade);
button(x=>x==='8').onclick();
assert.equal(api.journey.stage,'branches','Grade 8 opens activity cards, not language selector');
for(const section of ['Gramatică','Vocabular','Analiză','Literatură','Comunicare','evaluări'])
 button(x=>x.includes(section));
button(x=>x.includes('Gramatică')).onclick();
assert.equal(api.journey.stage,'topics');
button(x=>x.includes('Morfologie')).onclick();
assert.equal(api.journey.stage,'workspace');
assert.equal(workspaceCount,1);
api.back();assert.equal(api.journey.stage,'topics');
api.back();assert.equal(api.journey.stage,'branches');
console.log('PASS Literature native language → level → grade 8 → grammar activity → lesson, compact Home and internal scrolling');
