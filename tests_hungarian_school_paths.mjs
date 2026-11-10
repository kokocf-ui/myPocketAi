import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {literatureTracksForGrade,hungaryAdmissionTopicsForGrade,HUNGARY_ADMISSION_REFERENCES} from './literature_school_streams.mjs';
import {worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';

const hu=LIT_EU_PROGRAMS.HU;
const tracks=(level,grade)=>literatureTracksForGrade('HU',level,String(grade),hu.tracks).map(x=>x[0]);
for(const grade of [1,2,3,4])assert.deepEqual(tracks('beginner',grade),[],'Primary '+grade+' must not show gymnázium tracks');
for(const grade of [5,6])assert.deepEqual(tracks('lower',grade),['ALT','G8'],'Lower '+grade+' offers general and 8-year gymnázium only');
for(const grade of [7,8])assert.deepEqual(tracks('lower',grade),['ALT','G8','G6'],'Lower '+grade+' allows 6-year gymnázium starting in grade 7');
assert.deepEqual(tracks('medium',9),['G4','G6','G8','TECH','VOC']);
assert.deepEqual(tracks('medium',11),['G4','G6','G8','TECH','VOC']);
assert.deepEqual(tracks('medium',12),['G4','G6','G8','TECH']);
assert.deepEqual(tracks('medium',13),['TECH'],'Grade 13 belongs to technical schools, not four-year gymnázium');
assert.deepEqual(worldwideSchoolYears('HU','beginner').map(x=>x.id),['1','2','3','4']);
assert.deepEqual(worldwideSchoolYears('HU','lower').map(x=>x.id),['5','6','7','8']);
assert.deepEqual(worldwideSchoolYears('HU','medium').map(x=>x.id),['9','10','11','12','13']);
for(const grade of [...Array.from({length:8},(_,i)=>String(i+1)),...Array.from({length:5},(_,i)=>String(i+9))]){
 assert.ok(hu.byGrade[grade]?.length>=16,'Missing Hungary study content for '+grade);
}
for(const [grade,target] of [[4,'clasa 5'],[6,'clasa 7'],[8,'clasa 9']]){
 const modules=hungaryAdmissionTopicsForGrade(grade);
 assert.equal(modules.length,4,'Admission modules should teach Hungarian, Maths and school entry');
 assert.ok(modules.every(x=>x.length===4&&x[3].includes(target)),grade+' does not target proper entry grade');
 assert.ok(modules.some(x=>x[0]==='hu-adm-math'));
 assert.ok(modules.some(x=>x[0]==='hu-adm-language'));
 assert.ok(modules.some(x=>x[3].includes('https://')),'Use official admissions source');
}
assert.ok(hungaryAdmissionTopicsForGrade(5)[0][3].includes('transfer'),'Out-of-cycle admission must not pretend it is standard entry');
assert.ok(HUNGARY_ADMISSION_REFERENCES.officialWritten.includes('njt.jog.gov.hu'),'Legal admission source');
assert.ok(HUNGARY_ADMISSION_REFERENCES.foreignPupils.includes('hazavaro.gov.hu'),'Foreign pupil admission source');
for(const country of ['PL','HR','TR'])assert.deepEqual(literatureTracksForGrade(country,'beginner','3',LIT_EU_PROGRAMS[country].tracks),[],
 country+' primary pupils must not select a high-school track');
assert.deepEqual(literatureTracksForGrade('AT','lower','6',LIT_EU_PROGRAMS.AT.tracks).map(x=>x[0]),['MS','AHS']);
assert.deepEqual(literatureTracksForGrade('AT','medium','11',LIT_EU_PROGRAMS.AT.tracks).map(x=>x[0]),['AHS','BHS']);
const code=EDUCATION_COUNTRY_UI_SCRIPT;
assert.match(code,/if\(lastConfirmed\)suggest\(lastConfirmed,'saved'\)/,'Explicit study-country selection wins over GPS');
assert.match(code,/if\(!lastConfirmed&&Number\.isFinite/,'Do not geolocate over a confirmed Hungary study choice');
const html=await(await app.fetch(new Request('https://hungary-schools.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script,{filename:'hungary-school-stage.js'});
assert.match(script,/function litAvailableTracks\(\)/,'Literature reads the selected grade and country');
assert.match(script,/litAvailableTracks\(\)\.length>1/,'Single school type does not show redundant page');
assert.match(script,/id:'admission'/,'Hungarian admissions action available');
assert.match(script,/litHungaryAdmissionTopics\(litJourney\.grade\)/,'Admission tasks match the selected grade');
assert.match(script,/Numele școlii vizate/,'Learner can specify school');
assert.match(script,/HUNGARY_ADMISSION_REFERENCES/,'Official admissions links are shown');
console.log('PASS Hungarian pathways: 1-4 without gymnázium, 5-8 school-specific, 9-13 upper school, cross-border admission and GPS-independent country');
