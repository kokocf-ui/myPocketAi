import assert from 'node:assert/strict';
import vm from 'node:vm';
import {literatureOfflineActivity} from './literature_offline_activity.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {LIT_OFFLINE_THEORY} from './literature_offline_theory.mjs';

for(const mode of ['lesson','examples','exercises','test']){
 const local=literatureOfflineActivity({topicKey:'communication',title:'Ascultare, conversație și exprimare',grade:'1',language:'ro',mode});
 assert.ok(local?.text.length>180,mode+' offers real study text');
 assert.equal(local.origin,'authored_local');
 assert.ok(!local.text.toLowerCase().includes('localizarea telefonului'));
 if(mode==='exercises'||mode==='test')assert.ok((local.text.match(/^\d+\./gm)||[]).length>=5);
}
assert.equal(literatureOfflineActivity({topicKey:'communication',grade:'1',mode:'correction'}),null);
assert.ok(literatureOfflineActivity({topicKey:'narrative',grade:'1',mode:'lesson',notes:LIT_OFFLINE_THEORY.narrative}),
 'Other class-I topics reuse available original theory');

class El {
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this._text='';this.isConnected=true;this.value='';this.attrs={};}
 get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('')}
 set textContent(v){this._text=String(v);this.children=[]}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this._text='';this.children=nodes}
 setAttribute(k,v){this.attrs[k]=v}
 scrollIntoView(){}
}
const body=new El('body');
let fetches=0,modelResponse={ok:false,status:503,json:async()=>({status:'unavailable',error:'ai_quota_exceeded'})};
const journey={country:'RO',grade:'1',branch:'program',topic:'oral-0',track:'TC',region:'',language:'ro',busy:false};
const cfg={
 document:{body,createElement:tag=>new El(tag)},
 AbortController,fetch:async()=>{fetches++;return modelResponse},
 state:{language:'ro'},litJourney:journey,
 litProgram:()=>({verified:false}),
 litCurrentTopic:()=>['communication','Ascultare, conversație și exprimare','Listening and speaking'],
 LIT_LANGUAGES:[['ro','Română','Romanian']],
 LIT_OFFLINE_THEORY_DATA:LIT_OFFLINE_THEORY,
 educationCountrySelection:{label:'România'},CLIENT_CONFIG:{apiUrl:'https://example.com/api/chat'},
 learningLabel:(ro,en)=>ro,
};
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+'\n({generate:litSimpleGenerate})',cfg);
for(const mode of ['lesson','examples','exercises','test']){
 const out=new El('article'),status=new El('p');let result='';
 await ui.generate(out,status,mode,'Ascultare, conversație și exprimare','',x=>{result=x});
 assert.ok(result.length>150,mode+' has a usable result');
 assert.ok(out.textContent.length>100,mode+' is rendered to the learner');
 assert.match(status.textContent,/Material local disponibil/);
 assert.doesNotMatch(status.textContent,/localizarea telefonului/);
 assert.equal(journey.busy,false);
}
assert.equal(fetches,0,'Grade I Romanian basic lessons need no AI quota or GPS');
journey.grade='8';
const out=new El('article'),status=new El('p');
await ui.generate(out,status,'lesson','Comunicare','');
assert.equal(fetches,1,'Older-grade request may use the online teacher');
assert.match(status.textContent,/Material local disponibil/,'Existing notes are used if AI fails');
journey.country='HU';
const noLocal=new El('article'),noLocalStatus=new El('p');
await ui.generate(noLocal,noLocalStatus,'lesson','Comunicare','');
assert.equal(fetches,2);
assert.match(noLocalStatus.textContent,/Limita serviciului AI a fost atinsă/);
assert.doesNotMatch(noLocalStatus.textContent,/localizarea telefonului/);
new vm.Script(LITERATURE_TASK_UI_SCRIPT);
console.log('PASS grade I class activities offline; fallback on AI outage; no bogus GPS explanation');
