import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {literatureClientGradeExpand} from './literature_europe_client_lazy.mjs';
import {literatureEuropeanPractice} from './literature_europe_practice.mjs';
import {literatureEuropeanAuthoredMaterial} from './literature_europe_authored_material.mjs';
import {literatureGeneralFallback} from './literature_general_fallback.mjs';
import {LIT_UNIVERSITY_YEARS,literatureUniversityPlan,literatureUniversityMaterial} from './literature_university_years.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const parts=['parcurs','intelegere','narativ','poezie','dialog','vocabular','exprimare','redactare','interpretare','verificare'];
for(const language of ['ro','en'])for(const stage of ['beginner','lower','medium']){
 const samples=new Set();
 for(const part of parts){
  const practice=literatureEuropeanPractice(part,language,stage);
  assert.ok(practice?.sample&&practice.worked);
  assert.equal(practice.questions.length,6);
  assert.equal(new Set(practice.questions).size,6);
  assert.ok(!samples.has(practice.sample),'different topics need their own relevant passage: '+part);
  samples.add(practice.sample);
  for(const mode of ['lesson','examples','exercises','test']){
   const text=literatureEuropeanAuthoredMaterial({topicKey:`eu-year-fr-${stage}-6e-${part}`,
    title:'Selected topic',grade:'6e',language,mode})?.text;
   assert.ok(text?.includes(practice.sample),part+' '+mode+' needs its own passage');
   if(mode==='lesson'||mode==='examples')assert.ok(text.includes(practice.worked),'Missing actual worked explanation');
   if(mode==='exercises'||mode==='test')for(const question of practice.questions)assert.ok(text.includes(question));
  }
 }
 const poetry=literatureEuropeanPractice('poezie',language,stage);
 assert.ok(poetry.sample.includes('\n'),'Poetry questions must have lines of poetry');
 assert.ok(!poetry.questions.some(q=>/book|cartea/i.test(q)),'Poetry should not ask unrelated book questions');
}
const programs=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
let assessed=0;
for(const country of EDUCATION_EUROPE_COUNTRIES.filter(x=>x!=='RO'))for(const stage of ['beginner','lower','medium']){
 for(const year of educationCountrySchoolYears(country,stage).years){
  for(const row of literatureClientGradeExpand(programs,{country,level:stage,grade:year.id})){
   if(row[0].startsWith('eu-year-'))continue;
   for(const language of ['ro','en'])for(const mode of ['lesson','examples','exercises','test']){
    const result=literatureGeneralFallback({area:row[3],title:row[1],grade:year.id,stage,language,mode});
    assert.ok(result?.text,`${country}/${year.id}/${row[0]}/${language}/${mode}`);
    assert.ok(result.text.includes(row[1]));
    assert.match(result.text,language==='ro'?/NU lecția completă specifică/:/NOT a complete chapter-specific lesson/);
    assert.match(result.text,language==='ro'?/nu reguli ale altei limbi/:/not rules of another language/);
   }
   assessed++;
  }
 }
}
assert.ok(assessed>1000);
assert.equal(literatureGeneralFallback({area:'grammar',stage:'beginner',language:'fr',mode:'lesson'}),null);
assert.equal(literatureGeneralFallback({area:'unknown',stage:'beginner',language:'ro',mode:'lesson'}),null);
for(const year of LIT_UNIVERSITY_YEARS){
 const plan=literatureUniversityPlan(year.id);
 assert.equal(plan.verified,false);
 for(const unit of plan.units)for(const mode of ['lesson','examples','exercises','test']){
  const result=literatureUniversityMaterial({topicKey:unit.id,grade:year.id,title:unit.ro,mode,language:'ro'});
  assert.ok(result?.text,`${year.id}/${unit.id}/${mode}`);
 }
}
// Exercise the actual serialized generate function: the general fallback is
// offered only after the chapter-specific online request fails, never for
// correction, unsupported languages, or unrelated branches.
const journey={country:'HU',level:'beginner',grade:'1',branch:'program',topic:'hu-beginner-1-language-1-3',track:'TC',region:'',language:'hu',busy:false};
const unit={id:journey.topic,topic:'grammar',ro:'Chapter',en:'Chapter',focus:'Focus'};
const cfg={
 litJourney:journey,state:{language:'ro'},
 litProgram:()=>({verified:false,units:[unit]}),litCurrentTopic:()=>['hu-beginner-1-language-1','Chapter','Chapter','Focus'],
 LIT_LANGUAGES:[['ro','Română','Romanian'],['hu','Maghiară','Hungarian']],LIT_OFFLINE_THEORY_DATA:{},
 learningLabel:(ro,en)=>ro,educationCountrySelection:{label:'Hungary'},CLIENT_CONFIG:{apiUrl:'/api'},
 document:{createElement:tag=>({tagName:tag.toUpperCase(),textContent:''})},
 AbortController,setTimeout,clearTimeout,fetch:async()=>{throw new TypeError('Failed to fetch')}
};
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+'\n({generate:litSimpleGenerate})',cfg);
const el=()=>({textContent:'',append(node){this.textContent+=node.textContent}});
let shown='',out=el(),status=el();
await ui.generate(out,status,'exercises','Chapter','',text=>{shown=text});
assert.match(shown,/NU lecția completă specifică/);
assert.match(status.textContent,/doar sprijin general offline/);
assert.equal(journey.busy,false);
shown='';out=el();status=el();
await ui.generate(out,status,'correction','Chapter','',text=>{shown=text});
assert.equal(shown,'','Do not falsely correct answers using general reference material');
cfg.state.language='fr';shown='';out=el();status=el();
await ui.generate(out,status,'lesson','Chapter','',text=>{shown=text});
assert.equal(shown,'','Never present RO/EN fallback as a French translation');
console.log(`PASS chapter-specific practice, ${assessed} existing national rows with explicit limited fallback, all Romanian university activity modes, and real client failure routing`);
