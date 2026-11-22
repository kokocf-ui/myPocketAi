import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {LIT_EU_PROGRAMS,LIT_EU_GRADE_COVERAGE,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {LITERATURE_50_COUNTRIES} from './literature_europe_grade_expansion.mjs';

assert.deepEqual([...LITERATURE_50_COUNTRIES].sort(),[...EDUCATION_EUROPE_COUNTRIES].sort(),
 'Literature country list must match the actual Education selector');
assert.equal(LIT_EU_GRADE_COVERAGE.countries,50);
let total=0, missing=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const p=LIT_EU_PROGRAMS[country];
 assert.ok(p,'Missing Literature profile: '+country);
 for(const stage of ['beginner','lower','medium','advanced']){
  const years=educationCountrySchoolYears(country,stage).years;
  const firstTitles=[];
  for(const year of years){
   const grade=String(year.id);
   const path=litEuropeanPlan(country,stage,grade);
   assert.ok(path.units.length>=10,'Too few units: '+country+' '+stage+' '+grade);
   const labels=path.units.map(x=>x.label.normalize('NFD').toLowerCase());
   assert.equal(new Set(labels).size,labels.length,'Duplicate titles: '+country+' '+stage+' '+grade);
   assert.equal(new Set(path.units.map(x=>x.id)).size,path.units.length,
    'Duplicate ids: '+country+' '+stage+' '+grade);
   for(const item of path.units){
    assert.ok(item.label?.length>=4,'Empty lesson title: '+country+'/'+grade);
    assert.ok(item.focus?.length>=30,'Empty lesson instruction: '+country+'/'+grade);
   }
   const owned=path.units.filter(x=>String(x.id).startsWith('eu-year-'));
   if(owned.length){
    assert.ok(owned.length>=(country==='RO'?3:9),'Partial grade-depth extension: '+country+'/'+grade);
    assert.ok(owned.every(x=>x.focus.includes('an/clasă: '+grade)),
     'Grade-specific content must reference its own year: '+country+'/'+grade);
    assert.ok(owned.some(x=>x.focus.includes('Fragment original creat pentru exercițiu')),
     'Original examples must accompany the grade learning path');
   }
   firstTitles.push(path.units.find(x=>x.id.includes('eu-year-'))?.label||path.units[0].label);
   if(!path.source){
    missing++;
    assert.equal(path.verified,false,'Do not invent national verified status: '+country);
    assert.equal(path.status,'orientative');
   }
   total++;
  }
  if(firstTitles.length>1 && !['advanced'].includes(stage)){
   assert.ok(new Set(firstTitles).size>1,
    'Adjacent years must not repeat a single introductory topic: '+country+'/'+stage);
  }
 }
}
assert.ok(total>=450,'All actual country/year selections must be covered');
assert.ok(missing>0,'Unknown national frameworks must remain advisory');
for(const [country,level,grade,expected] of [
 ['RO','medium','9',true],['FR','medium','4e',false],
 ['GB-ENG','medium','Y9',true],['DE','medium','9',false]
]){
 assert.equal(litEuropeanPlan(country,level,grade).verified,expected,
  'Preserve the existing national verification evidence: '+country+'/'+grade);
}
assert.ok(litEuropeanPlan('RO','beginner','1').units.some(x=>x.label.includes('Primele texte')));
assert.ok(litEuropeanPlan('GB-ENG','beginner','Y6').units.some(x=>x.focus.includes('an/clasă: Y6')));
console.log('PASS: Literature grade-specific depth on '+total+' country/year selections; '+missing+' explicitly advisory paths');
