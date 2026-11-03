import assert from 'node:assert/strict';
import frontend from './index.js';
import vm from 'node:vm';

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'frontend inline script unavailable');
new vm.Script(script);
assert.match(html,/\.answer-reader-body\{[^}]*overflow-y:auto!important/,'reader must scroll vertically');
assert.match(html,/\.structured-results-table tbody tr\{display:block!important/,'mobile events must stack into full-width cards');
assert.match(html,/padding:12px 11px calc\(46px \+ env\(safe-area-inset-bottom/,'reader bottom must respect mobile safe area');
assert.match(html,/\.recipe-reader-title\{/,'recipe heading must be visually separated');
assert.match(html,/\.recipe-reader-step\{/,'cooking steps must have readable spacing');
class El{
 constructor(tag){this.tagName=tag;this.children=[];this.style={};this.textContent='';this.className='';this.attributes={};}
 append(...v){this.children.push(...v)}
 setAttribute(k,v){this.attributes[k]=v}
}
const document={createElement:tag=>new El(tag)};
const source=(start,end)=>{const a=script.indexOf(start),b=script.indexOf(end,a);assert.ok(a>=0&&b>a,'missing '+start);return script.slice(a,b)};
const recipeContext={document};
vm.createContext(recipeContext);
vm.runInContext(source('function appendRecipeReaderText(','function answerExceedsFourLines('),recipeContext);
const recipeHost=new El('section');
const recipes=Array.from({length:4},(_,i)=>`Rețeta ${i+1} — Varianta ${i+1}\n\nIngrediente:\n- 500 g mălai\n- 250 ml lapte\n- 100 g brânză\n\nMod de preparare:\n1. Încălzește laptele.\n2. Adaugă mălaiul.\n3. Încorporează brânza.\n\nSursa: https://culinary.example/${i+1}`).join('\n\n────────────────\n\n');
assert.equal(recipeContext.appendRecipeReaderText(recipeHost,recipes),true);
assert.equal(recipeHost.children.filter(x=>x.tagName==='h3').length,4,'all four recipes must remain visible in reader DOM');
assert.equal(recipeHost.children.filter(x=>x.tagName==='h4').length,8,'each recipe needs its own ingredient/method headers');
assert.equal(recipeHost.children.filter(x=>x.className==='recipe-reader-step').length,12,'never truncate recipe preparation steps');
assert.equal(recipeHost.children.filter(x=>x.className==='recipe-reader-divider').length,3,'distinguish each recipe visually');
assert.ok(recipeHost.children.at(-1).textContent.includes('https://culinary.example/4'),'fourth recipe source must survive');
const eventsContext={document,state:{language:'ro'}};
vm.createContext(eventsContext);
vm.runInContext(source('function appendStructuredCollectionTable(','function appendAnswerText('),eventsContext);
const eventHost=new El('div');
const rows=Array.from({length:90},(_,i)=>({date:(i+1)+' noiembrie 2026',time:'19:00',description:'Eveniment '+(i+1)+' cu descriere și locație completă',source_url:'https://events.example/'+(i+1)}));
assert.equal(eventsContext.appendStructuredCollectionTable(eventHost,{list:{type:'events',period:'noiembrie 2026',rows},sources:[]}),true);
const scroller=eventHost.children.find(x=>x.className==='structured-results-scroller');
const table=scroller.children.find(x=>x.tagName==='table');
const tbody=table.children.find(x=>x.tagName==='tbody');
assert.equal(tbody.children.length,90,'reader must not impose a display cap');
const last=tbody.children.at(-1);
assert.ok(last.children[1].textContent.includes('Eveniment 90'),'last event content must remain intact');
assert.equal(last.children[1].children.filter(x=>x.tagName==='a').length,1,'last event source link must remain accessible');
console.log('PASS: presentation-only reader keeps 4 complete recipes, 90 events, source links and mobile-safe scrolling.');
