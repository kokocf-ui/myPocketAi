import assert from 'node:assert/strict';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://test.example/'))).text();
const start=html.indexOf('function scienceLocalizeContainer(');
const end=html.indexOf('\nfunction scienceBuildPackCorrelationBanner(',start);
assert.ok(start>=0&&end>start);
const state={language:'az'};let calls=0,lookup=[],release,failed=false;
const translate=async(payload,id,source,opts)=>{
 calls++;assert.deepEqual(payload.lines,['Definiție fizică pentru elevi']);assert.equal(id,'science:container');assert.equal(source,'mixed');assert.equal(opts.targetLanguage,'az');
 if(release)await new Promise(resolve=>{release=resolve});
 return failed?null:{lines:['Şagirdlər üçün fizika tərifi']};
};
const document={createElement:()=>({children:[],setAttribute(){},append(...x){this.children.push(...x)},remove(){this.removed=true}})};
const run=new Function('state','eduTranslateMaterial','eduGetCachedString','document','learningLabel',html.slice(start,end)+';return scienceLocalizeContainer;')(state,translate,(raw,lang)=>{lookup.push([raw,lang]);return ''},document,(ro,en)=>ro);
function make(){const node={nodeType:3,nodeValue:'Definiție fizică pentru elevi',parentNode:{isConnected:true}};const container={nodeType:1,tagName:'DIV',classList:{contains:()=>false},childNodes:[node],isConnected:true,notice:null,querySelector(){return this.notice?.removed?null:this.notice},prepend(n){this.notice=n}};return {node,container}}
let {node,container}=make();run(container);await new Promise(r=>setTimeout(r,0));
assert.equal(node.nodeValue,'Şagirdlər üçün fizika tərifi');assert.deepEqual(lookup[0],['Definiție fizică pentru elevi','az']);assert.equal(calls,1);
({node,container}=make());release=true;run(container);await Promise.resolve();state.language='fr';release();await new Promise(r=>setTimeout(r,0));assert.equal(node.nodeValue,'Definiție fizică pentru elevi','Late response must not apply to a new target language');
state.language='az';release=null;failed=true;({node,container}=make());run(container);await new Promise(r=>setTimeout(r,0));
assert.match(container.notice.children[0].textContent,/Traducerea nu este disponibilă/);
failed=false;container.notice.children[1].onclick();await new Promise(r=>setTimeout(r,0));assert.equal(node.nodeValue,'Şagirdlər üçün fizika tərifi');
console.log('PASS science container: correct translation payload, cache lookup, target, stale response, failure notice and retry');
