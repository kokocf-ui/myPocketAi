import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {CHEMISTRY_DETAILED_LESSONS} from './chemistry_detailed_lessons.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceSchoolLessonMaterial} from './science_school_lesson_material.mjs';

const lessons=scienceSchoolTopicLessons({
 country:'RO',subject:'chemistry',grade:'7',stage:'lower',topic:'fundamentals',
 lessons:THEORY_ENTRIES,language:'ro',
 years:[{id:'7'},{id:'8'}]
});
assert.ok(lessons.length>=10,'Chapter with many original Chemistry lessons must not collapse to only four generic files');
assert.equal(new Set(lessons.map(item=>item.id)).size,lessons.length,'One unique entry for each lesson');
const material=lessons.map(entry=>scienceSchoolLessonMaterial({
 entry,subject:'chemistry',grade:'7',chapter:'Materie și laborator',
 language:'ro',detailed:CHEMISTRY_DETAILED_LESSONS[entry.id]
}));
assert.ok(material.every(x=>typeof x==='string'&&x.length>450),'Every individual Chemistry lesson must have substantive material');
assert.equal(new Set(material).size,material.length,'No repeated body shared by all lesson buttons');
const html=await(await app.fetch(new Request('https://chemistry-real-lessons.test/'))).text();
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js);new vm.Script(js);
const section=js.slice(js.indexOf('function educationScienceTheoryReader('),js.indexOf('function scienceOpenChemistrySection('));
for(const fragment of [
 'const authoredChemistry=',
 'scienceSchoolTopicLessons({',
 'const material=scienceSchoolLessonMaterial({',
 'CHEMISTRY_DETAIL_DATA[entry.id]',
 'Fișe de sinteză, formule, aplicații și investigații'
])assert.ok(section.includes(fragment),'Missing actual UI path: '+fragment);
assert.ok(section.indexOf('for(const [index,entry] of authoredChemistry.entries())')<
 section.indexOf('for(const part of entries)'), 'Individual lessons come before four supporting summaries');
console.log('PASS Chemistry: '+lessons.length+' individually authored Grade VII chapter lessons, distinct full study texts and four clearly secondary reference sheets');
