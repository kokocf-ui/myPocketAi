import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {literatureClientGradeExpand} from './literature_europe_client_lazy.mjs';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';

const compact=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
assert.ok(!compact.XK?.byGrade?.['general-medium-3']?.length,
 'No full 50-country grade payload is embedded at application start');
let tests=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium','advanced']){
  const years=educationCountrySchoolYears(country,stage).years;
  for(const year of years){
   const grade=String(year.id);
   const rows=literatureClientGradeExpand(compact,{country,grade,level:stage});
   assert.ok(rows.length>=10,'Browser omitted chapters '+country+' '+grade);
   assert.equal(new Set(rows.map(x=>x[0])).size,rows.length,
    'Client duplicated chapter keys '+country+' '+grade);
   assert.equal(new Set(rows.map(x=>x[1])).size,rows.length,
    'Client duplicated chapter labels '+country+' '+grade);
   assert.ok(rows.some(x=>String(x[0]).startsWith('eu-year-'))||rows.length>=15,
    'Client is not augmenting incomplete chapter paths: '+country+' '+grade);
   tests++;
  }
 }
}
assert.ok(tests>=600);
for(const grade of ['1','5','9','12']){
 const rows=compact.RO.byGrade[grade];
 assert.ok(rows.length>=10&&rows.length<=12,'Romanian pupil menu must remain compact');
}
const sample=litEuropeanPlan('FR','medium','4e').units;
assert.ok(sample.length>=10,'Full national server audit still uses enriched grade sequence');
const scripts={
 litJourney:{country:'FR',grade:'4e',level:'medium',stage:'branches',branch:'program'},
 LIT_TOPICS:{grammar:[]},LIT_BRANCHES:[],
 litOpen:stage=>stage,
 LIT_EUROPE_PROGRAMS:JSON.parse(JSON.stringify(LIT_EU_PROGRAMS))
};
scripts.litProgram=()=>({units:scripts.LIT_EUROPE_PROGRAMS.FR.byGrade?.['4e']||[]});
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,scripts);
assert.ok(scripts.litProgram().units.length>=10,
 'Actual literature renderer should lazily materialize the selected grade before rendering');
const html=await(await frontend.fetch(new Request('https://literature-compact-budget.test/'))).text();
const bytes=Buffer.byteLength(html,'utf8');
assert.ok(bytes<8*1024*1024,'Entire Android offline HTML exceeds strict 8MB payload budget: '+bytes);
console.log('PASS compact Android HTML '+bytes+' bytes, '+tests+' lazy grade paths and browser menu');
