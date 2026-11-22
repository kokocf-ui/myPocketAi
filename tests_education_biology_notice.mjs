import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_SPECIALIZATIONS} from './biology_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {BIOLOGY_COUNTRY_REFERENCES,biologyCountryStageInfo} from './biology_country_alignment.mjs';
import {BIOLOGY_LAB_GUIDES,BIOLOGY_UNIVERSITY_PRACTICALS,biologySchoolLabSheet,biologyUniversityLabSheet} from './biology_lab_guides.mjs';
import {EDUCATION_FIRST_USE_NOTICE_SCRIPT} from './education_first_use_notice.mjs';

assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(Object.keys(BIOLOGY_COUNTRY_REFERENCES).length>=20,'Supported framework references must span distinct systems');
let checked=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,yearGroup] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(country,yearGroup).years;
  assert.ok(years.length>0,country+' missing school stage');
  for(const y of years){
   const scope=biologyCountryStageInfo({country,stage,grade:y.id,years});
   assert.equal(scope.verifiedAnnual,false,'Do not invent nationally verified annual Biology syllabus');
   assert.ok(scope.source?.startsWith('https://')&&scope.note.length>=50,country+'/'+y.id+' missing evidence disclosure');
   assert.ok(scope.yearPosition>=0&&scope.yearPosition<years.length);
   if(stage==='primary')assert.equal(scope.kind,'integrated','Primary life science must not be labelled standalone Biology');
   const plan=scienceGradeTopicPlan({country,stage,subject:'biology',grade:y.id,years,topics:BIOLOGY_TOPICS});
   assert.equal(plan.biologyTeachingKind,scope.kind);
   assert.equal(plan.biologyReference,scope.source);
   assert.ok(plan.topics.length>=1,country+'/'+y.id+' Biology lesson selector empty');
   checked++;
  }
 }
}
assert.ok(checked>350,'Country-by-year test must exercise the full country picker');
const roYears=educationCountrySchoolYears('RO','lower').years;
for(const y of roYears){
 assert.equal(biologyCountryStageInfo({country:'RO',stage:'lower',grade:y.id,years:roYears}).kind,'separate');
}
for(const code of ['GB-ENG','GB-SCT','GB-WLS','GB-NIR','IE']){
 const years=educationCountrySchoolYears(code,'lower').years;
 assert.equal(biologyCountryStageInfo({country:code,stage:'lower',grade:years[0].id,years}).kind,'integrated');
}
for(const topic of BIOLOGY_TOPICS){
 const entry={
  topic:topic.id,title:'Topic-specific lesson: '+topic.id,
  statement:'An explanation of '+topic.id+' with terms and mechanisms specific to the study chapter.',
  workedExample:'Work through a labelled example in '+topic.id+' and distinguish observation from explanation.',
  exercise:'Which evidence supports the conclusion for '+topic.id+'?',
  answer:'Compare observed patterns and sources before claiming a causal link.'
 };
 const primary=biologySchoolLabSheet({entry,country:'GB-ENG',grade:'Y3',stage:'primary',language:'en'});
 const lower=biologySchoolLabSheet({entry,country:'RO',grade:'7',stage:'lower',language:'ro'});
 const upper=biologySchoolLabSheet({entry,country:'ES',grade:'4ESO',stage:'upper',language:'en'});
 assert.ok(primary?.length>700&&lower?.length>700&&upper?.length>700,'Empty Biology practical '+topic.id);
 assert.ok(primary.includes('Y3')&&lower.includes('7')&&upper.includes('4ESO'));
 assert.ok(primary.includes(entry.title)&&lower.includes(entry.workedExample));
 assert.ok(primary.includes(BIOLOGY_LAB_GUIDES[topic.id].en[0]));
 assert.ok(upper.includes('independent')||upper.includes('incertitudinea'));
 assert.ok(!primary.includes('culture unknown microorganisms'));
}
for(const specialty of BIOLOGY_SPECIALIZATIONS){
 const sheet=biologyUniversityLabSheet({
  topic:specialty.core[0],specialty:specialty.id,grade:'univ-3',
  courseDocument:'Course-specific scientific mechanism and worked evidence for this chosen degree topic.',
  language:'ro'
 });
 assert.ok(sheet?.length>1100,specialty.id+' needs a complete degree practical');
 assert.ok(sheet.includes(BIOLOGY_UNIVERSITY_PRACTICALS[specialty.id].ro[0]));
 assert.ok(sheet.includes('Course-specific scientific mechanism'));
 assert.ok(sheet.includes('incertitudinea')&&sheet.includes('Etică și siguranță'));
}
assert.equal(biologySchoolLabSheet({entry:{title:'No topic'},grade:'4'}),null,'No generic unrelated lab');
assert.equal(biologyUniversityLabSheet({topic:'unmapped',specialty:'unmapped',courseDocument:'abc'}),null);

class FakeElement {
 constructor(tag){this.tag=tag;this.children=[];this.style={cssText:''};this.attrs={};this.removed=false;this.id='';this.textContent='';}
 append(...children){this.children.push(...children);}
 setAttribute(key,val){this.attrs[key]=val;}
 focus(){this.focused=true;}
 remove(){this.removed=true;}
}
const storage=new Map(),document={
 body:new FakeElement('body'),
 createElement:tag=>new FakeElement(tag),
 getElementById(id){return this.body.children.find(c=>c.id===id&&!c.removed)||null;}
};
const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
function newNoticeContext(language='ro'){
 return vm.runInNewContext(EDUCATION_FIRST_USE_NOTICE_SCRIPT+
  '\n({open:educationShowFirstUseNotice})',
  {state:{language},document,localStorage});
}
const notice=newNoticeContext('ro');
assert.equal(notice.open(),true,'Initial Education entrance must show disclaimer');
const overlay=document.getElementById('education-first-use-notice');
assert.ok(overlay,'Education notice must be modal and independently mounted');
const panel=overlay.children[0],button=panel.children[2].children[0];
assert.equal(panel.attrs.role,'dialog');
assert.equal(panel.attrs['aria-modal'],'true');
assert.match(panel.children[0].textContent,/Informare privind/);
assert.equal(button.textContent,'Am înțeles');
assert.equal(notice.open(),false,'Re-entering without confirmation must not duplicate the overlay');
button.onclick();
assert.ok(overlay.removed&&storage.size===1,'Acknowledgement must persist only when user presses button');
assert.equal(notice.open(),false,'Acknowledged notice must not reappear within session');
const nextLaunch=newNoticeContext('fr');
assert.equal(nextLaunch.open(),false,'Acknowledged notice must stay hidden after app relaunch');
const blankDocument={body:new FakeElement('body'),createElement:tag=>new FakeElement(tag),getElementById(id){
 return this.body.children.find(c=>c.id===id&&!c.removed)||null;}};
const fallback=vm.runInNewContext(EDUCATION_FIRST_USE_NOTICE_SCRIPT+
 '\n({open:educationShowFirstUseNotice})',
 {state:{language:'ga'},document:blankDocument,localStorage:{getItem:()=>null,setItem:()=>{}}});
assert.equal(fallback.open(),true);
assert.equal(blankDocument.body.children[0].children[0].children[2].children[0].textContent,'I understand',
 'Untranslated locales should have a safe English fallback, not broken text');
const html=await(await app.fetch(new Request('https://education-notice-biology-test.invalid/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'No WebView JavaScript');
new vm.Script(script);
for(const token of ['function educationShowFirstUseNotice()','educationShowFirstUseNotice();',
 'const BIOLOGY_COUNTRY_REFERENCES=','const BIOLOGY_LAB_GUIDES=',
 'const biologySchoolLabSheet=','const biologyUniversityLabSheet='])
 assert.ok(script.includes(token),'Missing Android Education wiring: '+token);
console.log('Biology curriculum scope, individual practicals, and one-time Education notice pass: '+checked+' mapped years.');
