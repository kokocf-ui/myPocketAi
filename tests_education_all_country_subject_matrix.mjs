import assert from 'node:assert/strict';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {EDUCATION_EUROPE_COUNTRIES,EDUCATION_CORE_SUBJECTS,EDUCATION_SCHOOL_STAGES,
 educationCountrySchoolYears,educationSubjectSchoolPlan,educationAllSubjectsForClass,
 educationCoverageTotals,educationCompletionGate} from './education_all_country_subject_matrix.mjs';

assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50,'Use every jurisdiction from the real Education picker');
assert.equal(new Set(EDUCATION_EUROPE_COUNTRIES).size,50);
assert.equal(EDUCATION_CORE_SUBJECTS.length,11,'Include every academic subject family and exams');
const covered=new Set();
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of EDUCATION_SCHOOL_STAGES){
  const school=educationCountrySchoolYears(country,stage);
  assert.ok(school.years.length>0,country+'/'+stage+' must have an explicit year state');
  assert.equal(new Set(school.years.map(x=>x.id)).size,school.years.length);
  assert.ok(['mapped-years','mapped-years-advisory','grade-unmapped'].includes(school.status));
  for(const year of school.years){
   const plans=educationAllSubjectsForClass(country,stage,year.id);
   assert.equal(plans.length,EDUCATION_CORE_SUBJECTS.length);
   assert.deepEqual(plans.map(x=>x.subject),EDUCATION_CORE_SUBJECTS);
   for(const plan of plans){
    const specialMathPlaceholder=['ES','MT','VA'].includes(country)&&plan.subject==='mathematics'&&
     !mathCountryStudyYears({country,stage,years:school.years})
      .some(x=>String(x.id)===String(year.id));
    const plMathNotInPrimary=country==='PL'&&stage==='beginner'&&
     String(year.id)==='IV'&&plan.subject==='mathematics';
    if(!specialMathPlaceholder&&!plMathNotInPrimary)
     covered.add(country+'/'+stage+'/'+year.id+'/'+plan.subject);
    assert.equal(plan.country,country);
    assert.equal(plan.grade,year.id);
    assert.equal(plan.schoolYear,'2026/27');
    assert.equal(plan.verifiedManual,false,'Never invent a verified textbook');
    if(specialMathPlaceholder){
     assert.equal(plan.status,'invalid-selection',
      'Spanish maths options and Maltese Secondary/Sixth Form maths stages must be selected precisely');
     assert.equal(plan.units.length,0);
     continue;
    }
    if(country==='PL'&&stage==='beginner'&&String(year.id)==='IV'&&plan.subject==='mathematics'){
     assert.equal(plan.status,'invalid-selection','Polish Grade IV mathematics belongs to the separate-subject pathway');
     assert.equal(plan.units.length,0);
     continue;
    }
    assert.ok(['framework-verified','grade-content-unverified','general-learning'].includes(plan.status));
    assert.ok(Array.isArray(plan.units));
    assert.equal(new Set(plan.units.map(x=>x.id)).size,plan.units.length,
     'Each class/subject list needs unique lesson IDs');
    assert.ok(plan.units.every(x=>x.ro&&x.en),'No empty pupil-facing labels');
    if(plan.status==='framework-verified')assert.ok(plan.source,
     'Official curriculum claims need a source: '+country+'/'+stage+'/'+year.id+'/'+plan.subject);
    if(['physics','chemistry','biology','astronomy','mathematics','computing','foreign_languages'].includes(plan.subject))
     assert.equal(plan.status,'general-learning',
      'A general minLevel/CEFR lesson catalogue must NOT be certified as a national grade syllabus');
   }
  }
  if(['ES','MT','VA'].includes(country)){
   const native=mathCountryStudyYears({country,stage,years:school.years});
   for(const maths of native){
    if(school.years.some(x=>x.id===maths.id))continue;
    const plan=educationSubjectSchoolPlan({country,stage,grade:maths.id,subject:'mathematics'});
    assert.equal(plan.status,'general-learning');
    assert.ok(plan.units.length>=3);
    covered.add(country+'/'+stage+'/'+maths.id+'/mathematics');
   }
  }
 }
}
const stats=educationCoverageTotals();
assert.equal(stats.countries,50);
assert.equal(stats.subjects,11);
assert.equal(covered.size,stats.combinations);
assert.equal(stats.frameworkVerified+stats.gradeContentUnverified+stats.generalLearning,stats.combinations);
assert.ok(stats.combinations>2500,'Full country x year x subject matrix should be enumerated');
const ro=educationCountrySchoolYears('RO','beginner').years.map(x=>x.id);
const fr=educationCountrySchoolYears('FR','beginner').years.map(x=>x.id);
const es=educationCountrySchoolYears('ES','beginner').years.map(x=>x.id);
const hu=educationCountrySchoolYears('HU','lower').years.map(x=>x.id);
assert.deepEqual(ro,['1','2','3','4']);
assert.ok(fr.includes('CP')&&fr.includes('CM2'),'French school year names are not Romanian grades');
assert.ok(es.includes('P1'),'Spanish primary school years keep their native identifiers');
assert.ok(hu.includes('5'),'Hungarian lower school stages keep national identifiers');
const andorra=educationCountrySchoolYears('AD','beginner');
assert.equal(andorra.status,'mapped-years-advisory',
 'Andorran year names are structurally mapped but the teaching sequence is not an official annual Physics syllabus');
assert.ok(andorra.years.length>=5&&andorra.years.every(y=>!/^P[1-6]$/.test(y.id)),
 'Use explicitly provisional local year names, not invented P1–P6 labels');
const france=Math.max(1,fr.length);
assert.ok(france>1);
assert.equal(educationSubjectSchoolPlan({country:'US',stage:'lower',grade:'7',subject:'physics'}).status,
 'invalid-selection','Europe scope only');
assert.ok(educationSubjectSchoolPlan({country:'DE',stage:'lower',
 grade:educationCountrySchoolYears('DE','lower').years[0].id,subject:'biology'}).requires,
 'Germany needs Land/school-track qualification');
assert.equal(educationSubjectSchoolPlan({country:'RO',stage:'medium',grade:'9',
 subject:'chemistry'}).status,'general-learning',
 'Even in RO, chemistry should not masquerade as nationally audited');
assert.equal(educationSubjectSchoolPlan({country:'GB-ENG',stage:'beginner',grade:'Y2',
 subject:'physics'}).status,'general-learning',
 'Even in England, local generic science topics are not a certified KS2 textbook');
assert.ok(stats.generalLearning>stats.frameworkVerified,'Do not call the whole module finished');
const gate=educationCompletionGate();
assert.equal(gate.ready,false,'Never release a generic outline as a completed 50-country school curriculum');
assert.ok(gate.blockers.some(x=>x.includes('general-learning')));
assert.ok(gate.blockers.some(x=>x.includes('Unmapped')));

console.log('PASS 50 jurisdictions × 11 academic domains × four stages, '
 +stats.combinations+' class-subject combinations; '
 +stats.frameworkVerified+' verified-framework, '
 +stats.gradeContentUnverified+' grade-content unverified, '
 +stats.generalLearning+' general; '+stats.unmappedStages+' year stages unmapped');
