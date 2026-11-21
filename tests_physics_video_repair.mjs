import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {physicsGrade6TeacherNotes} from './physics_grade6_pedagogy.mjs';
import {physicsGrade6Laboratories} from './physics_grade6_labs.mjs';
import {SCIENCE_RO_PHYSICS_EXTRAS} from './science_ro_physics_extras.mjs';
import {PHYSICS_RO_ADDITIONS} from './science_ro_physics_additions.mjs';
import {scienceSchoolLessonMaterial} from './science_school_lesson_material.mjs';
const entries=[...SCIENCE_RO_PHYSICS_EXTRAS['6'],...PHYSICS_RO_ADDITIONS['6']];
assert.equal(entries.length,38);
for(const entry of entries){
 const enrichment=physicsGrade6TeacherNotes(entry.title,'ro');
 assert.ok(enrichment.length>=225,'Teacher explanation is still too short: '+entry.title);
 const body=scienceSchoolLessonMaterial({entry,subject:'physics',grade:'6',chapter:'Măsurări',language:'ro'});
 assert.ok(body.includes(enrichment),'Original Grade VI teaching explanation missing: '+entry.title);
 assert.ok(body.includes(entry.statement)&&body.includes(entry.workedExample)&&body.includes(entry.exercise));
 assert.ok(!/Material didactic original bazat|Original advisory learning material/.test(body),'No repeated internal quality statement on pages');
 if(!['electric','circuits'].includes(entry.topic))assert.ok(!body.includes('Siguranță: circuitele electrice'),'No electric-socket warning on an unrelated lesson');
}
const area=physicsGrade6TeacherNotes('Măsurarea ariei și volumului','ro');
assert.ok(area.includes('7200 cm²')&&area.includes('0,72 m²')&&area.includes('1000 cm³'));
const volume=physicsGrade6TeacherNotes('Determinarea volumului','ro');
assert.ok(volume.includes('1 mL = 1 cm³'),'Liquid volume and unit conversion must be explained');
const topics=['units','kinematics','dynamics','energy','heat','electric','electromagnetism','optics'];
for(const topic of topics){
 const labs=physicsGrade6Laboratories(topic);
 assert.ok(labs.length>=1,topic+' missing beginner lab');
 assert.ok(labs.every(x=>x.body.length>=400),'Experiment requires full meaningful steps');
}
assert.ok(physicsGrade6Laboratories('units').some(x=>x.body.includes('cm²')));
assert.ok(!physicsGrade6Laboratories('units').some(x=>/lentile|optică geometrică/i.test(x.title)));
assert.ok(physicsGrade6Laboratories('optics')[0].body.includes('umbra'));
const html=await(await frontend.fetch(new Request('https://physics-grade6-review.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
assert.ok(script.includes('const physicsGrade6Laboratories=')&&script.includes('const physicsGrade6TeacherNotes='));
assert.ok(script.includes("!(scienceJourney.subject==='physics'&&group.schoolStage==='primary')"),
 'No separate primary Physics group in school year chooser');
assert.ok(script.includes('const investigations=physicsGrade6Laboratories(scienceJourney.topic)'),
 'Grade VI lab must use the currently chosen chapter rather than a generic graphics gallery');
assert.ok(script.includes("back.onclick=event=>{event?.stopPropagation?.();dialog.close();physicsVisualPicker()}"),
 'Visual Back must return to the relevant Physics visual picker');
assert.ok(!script.includes("for(const kind of ['motion','force','energy','wave','circuit','optics','thermo','quantum'])"),
 'No indiscriminate 8-diagram gallery for each lower-school topic');
console.log('PASS video feedback: no primary Physics; 38 full Grade VI authored explanations; class-specific labs; no boilerplate; contextual Back');
