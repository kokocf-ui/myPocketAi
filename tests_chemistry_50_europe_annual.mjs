import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {chemistryCountryGradePlan,CHEMISTRY_NOT_OFFERED_LOWER_YEARS,CHEMISTRY_EUROPE_REFERENCES} from './chemistry_country_alignment.mjs';
import {chemistryGradeTopicPlan} from './chemistry_school_years.mjs';
import {chemistrySchoolCourseDocuments} from './chemistry_school_depth.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';

const ids=list=>list.map(x=>x.id);
let visibleYears=0,hiddenYears=0,upperYears=0,documents=0,verifiedReferences=0,integrated=0;
const countries=new Set(EDUCATION_EUROPE_COUNTRIES);
assert.equal(countries.size,50);
for(const country of countries){
 const lower=educationCountrySchoolYears(country,'lower').years;
 const upper=educationCountrySchoolYears(country,'medium').years;
 const primary=educationCountrySchoolYears(country,'beginner').years;
 assert.ok(lower.length>=1&&upper.length>=1&&primary.length>=1,country+' needs actual existing school stages');
 const excluded=CHEMISTRY_NOT_OFFERED_LOWER_YEARS[country]||[];
 for(const grade of excluded)assert.ok(lower.some(y=>String(y.id)===grade),
  country+' absent Chemistry grade must exist in its actual school system: '+grade);
 if(CHEMISTRY_EUROPE_REFERENCES[country])verifiedReferences++;
 const byTopic=new Map();
 for(const grade of lower){
  const info=chemistryCountryGradePlan({country,stage:'lower',grade:grade.id,years:lower});
  const generic=scienceGradeTopicPlan({country,subject:'chemistry',stage:'lower',
   grade:grade.id,years:lower,topics:CHEMISTRY_TOPICS});
  const course=chemistryGradeTopicPlan({country,stage:'lower',grade:grade.id,
   years:lower,topics:CHEMISTRY_TOPICS});
  assert.ok(typeof info.source==='string'&&info.source.startsWith('https://'),
   country+'/'+grade.id+' needs real evidence citation or explicit advisory reference');
  assert.equal(info.verifiedAnnual,false,'Do not invent national annual official programmes');
  assert.deepEqual(ids(generic.topics),ids(course.topics),
   country+'/'+grade.id+' school catalogue and real WebView chapter picker must match');
  if(info.status==='not-offered'){
   hiddenYears++;
   assert.equal(generic.topics.length,0);
   assert.equal(course.topics.length,0);
   continue;
  }
  visibleYears++;
  if(info.kind==='integrated'||info.kind==='combined'||info.kind==='mixed')integrated++;
  assert.ok(generic.topics.length>=3,country+'/'+grade.id+' lesson path is an empty or token chapter list');
  assert.equal(new Set(ids(course.topics)).size,course.topics.length);
  assert.ok(info.subjectYearIndex>=0&&info.subjectYearIndex<info.subjectYearCount);
  for(const topic of generic.topics){
   for(const language of ['ro','en']){
    const sheets=chemistrySchoolCourseDocuments({
     topic:topic.id,country,grade:grade.id,stage:'lower',
     yearPosition:info.subjectYearIndex,yearCount:info.subjectYearCount,
     language,lessons:THEORY_ENTRIES
    });
    assert.equal(sheets.length,4,'Each Chemistry grade/chapter needs concept, equation, application and investigation');
    assert.equal(new Set(sheets.map(x=>x.text)).size,4,'Chemistry chapter reopens a duplicate sheet');
    assert.ok(sheets.every(x=>x.text.length>=700),
     country+'/'+grade.id+'/'+topic.id+'/'+language+' lesson content too shallow');
    assert.ok(sheets.every(x=>(language==='ro'?x.text.includes('Obiectiv specific acestui an'):
     x.text.includes('Year-specific learning objective'))),
     'Each year must teach a concept progression, not just swap the grade label');
    assert.ok(sheets.every(x=>x.text.includes(String(grade.id))),
     'Study sheet must identify the selected school year');
    assert.ok(sheets[1].text.includes('Exemplu rezolvat')||language==='en'&&sheets[1].text.includes('Worked example'));
    assert.ok(sheets[3].text.includes('Siguranță')||language==='en'&&sheets[3].text.includes('Safety'));
    documents+=4;
   }
   const doc=chemistrySchoolCourseDocuments({
    topic:topic.id,country,grade:grade.id,stage:'lower',
    yearPosition:info.subjectYearIndex,yearCount:info.subjectYearCount,language:'ro'
   })[0].text;
   const title=doc.slice(doc.indexOf('Obiectiv specific acestui an'));
   if(!byTopic.has(topic.id))byTopic.set(topic.id,[]);
   byTopic.get(topic.id).push({year:grade.id,step:info.subjectYearIndex,objective:title});
  }
 }
 for(const [topic,entries] of byTopic){
  for(let i=1;i<entries.length;i++){
   if(entries[i].step!==entries[i-1].step)
    assert.notEqual(entries[i].objective,entries[i-1].objective,
     country+'/'+topic+' repeats identical annual content on different years');
  }
 }
 const upperSignatures=new Set();
 for(const grade of upper){
  const course=chemistryGradeTopicPlan({
   country,stage:'upper',grade:grade.id,years:upper,topics:CHEMISTRY_TOPICS
  });
  upperYears++;
  assert.equal(course.status,'general-learning','Do not claim a mandatory upper-secondary Chemistry programme without a track');
  assert.ok(course.topics.length>=8,country+'/'+grade.id+' upper Chemistry chapters underpopulated');
  assert.equal(new Set(ids(course.topics)).size,course.topics.length);
  upperSignatures.add(ids(course.topics).join('|'));
  for(const topic of course.topics){
   const sheets=chemistrySchoolCourseDocuments({topic:topic.id,country,grade:grade.id,
    stage:'upper',yearPosition:upper.findIndex(y=>y.id===grade.id),yearCount:upper.length,
    language:'en'});
   assert.equal(sheets.length,4);
   assert.ok(sheets.every(x=>x.text.length>=700));
   documents+=4;
  }
 }
 assert.ok(upperSignatures.size>=Math.min(upper.length,3),
  country+' upper-secondary Chemistry must progress rather than repeating the same topics');
 const scope=chemistryCountryGradePlan({country,stage:'primary',grade:primary[0].id,years:primary});
 assert.equal(scope.kind,'integrated','Primary chemical concepts belong to integrated science');
 for(const [code,missing] of Object.entries(CHEMISTRY_NOT_OFFERED_LOWER_YEARS)){
  if(country===code)assert.equal(excluded.length,missing.length);
 }
}
assert.ok(visibleYears>=115&&hiddenYears>=8&&upperYears>=120, 'Audit too narrow');
assert.ok(documents>=4000,'The complete European Chemistry chapter bank must be substantial');
assert.ok(verifiedReferences>=10,'Independent national frameworks were not retained');
assert.ok(integrated>=12,'Integrated and mixed pathways were lost');
const html=await(await app.fetch(new Request('https://chemistry-50-country-annual.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const token of [
 'const chemistryCountryGradePlan=','const CHEMISTRY_EUROPE_REFERENCES=',
 'const CHEMISTRY_NOT_OFFERED_LOWER_YEARS=','const EDU_CHEMISTRY_ABSENT_YEAR_KEYS=',
 'const chemistrySchoolCourseDocuments=','const chemistryGradeTopicPlan='])
 assert.ok(script.includes(token),'Missing actual Chemistry mapping in Android WebView: '+token);
assert.ok(EDUCATION_COUNTRY_UI_SCRIPT.includes("subject==='chemistry'?"),
 'Chemistry selector must filter only proven absent separate-subject grades');
console.log('PASS Chemistry Europe: 50 school systems; '+visibleYears+' lower-year routes; '+
 hiddenYears+' false standalone years hidden; '+upperYears+' upper-year routes; '+
 documents+' authored reference sheets across national-year/chapter combinations; '+
 verifiedReferences+' independently sourced stage frameworks');
