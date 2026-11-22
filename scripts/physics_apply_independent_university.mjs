import assert from 'node:assert/strict';
import fs from 'node:fs';
const path='index.js';let s=fs.readFileSync(path,'utf8');
if(s.includes('const physicsUniversityIndependentInvestigation=')){console.log('Already patched');process.exit(0);}
const replace=(a,b)=>{assert.ok(s.includes(a),'Missing expected exact source: '+a.slice(0,110));assert.equal(s.split(a).length,2,'Ambiguous anchor');s=s.replace(a,b)};
replace(
 "import {PHYSICS_PRACTICAL_PROTOCOLS,physicsLaboratoryYearInvestigations} from './physics_europe_practicals.mjs';",
 "import {PHYSICS_PRACTICAL_PROTOCOLS,physicsLaboratoryYearInvestigations} from './physics_europe_practicals.mjs';\n"+
 "import {UNIVERSITY_PHYSICS_INQUIRY_BANK,physicsUniversityIndependentInvestigation} from './physics_university_independent_investigations.mjs';"
);
const anchor='const physicsLaboratoryYearInvestigations=';
const start=s.indexOf(anchor),end=s.indexOf('\n',start);
assert.ok(start>0&&end>start);
s=s.slice(0,end+1)+
 'const UNIVERSITY_PHYSICS_INQUIRY_BANK=${JSON.stringify(UNIVERSITY_PHYSICS_INQUIRY_BANK)};\n'+
 'const physicsUniversityIndependentInvestigation=${physicsUniversityIndependentInvestigation.toString()};\n'+
 s.slice(end+1);
const oldBlock=`    const documentText=physicsUniversityStudyDocument({
     courseId:course?.courseId,country:educationCountrySelection.code,
     routeId:scienceJourney.universityRoute,year:Number(String(scienceJourney.grade).slice(-1)),
     specialty:scienceJourney.specialty,language:state.language,lessons:EDUCATION_THEORY_DATA,
     trackGuide:SCIENCE_UNIVERSITY_TRACK_GUIDES.physics?.[scienceJourney.specialty]
    });
    if(documentText)tile('🧪','Investigația cursului','Course investigation',
     'Ipoteze, pași, date, incertitudine și verificare','Hypotheses, procedure, data, uncertainty and review',
     ()=>educationOpenPagedLesson(chapter,documentText));`;
const newBlock=`    // The laboratory is an INDEPENDENT question/protocol, not a second
    // button reopening the identical university study document.
    const universityLab=physicsUniversityIndependentInvestigation({
     courseId:course?.courseId,topic:course?.topic,courseName:chapter,
     country:educationCountrySelection.code,
     year:Number(String(scienceJourney.grade).slice(-1)),
     specialty:scienceJourney.specialty,language:state.language
    });
    if(universityLab)tile('🧪','Investigația cursului','Course investigation',
     'Protocol separat: ipoteze, metodă, date, incertitudine și verificare',
     'Independent protocol: hypothesis, method, data, uncertainty and review',()=>{
      sciencePendingAssessmentSpec={
       subject:'physics',topic:course?.topic,stage:'advanced',
       lang:state.language==='ro'?'ro':'en',
       prompt:universityLab.review.prompt,guide:universityLab.review.guide,
       localVerification:false
      };
      try{educationOpenPagedLesson(universityLab.title,universityLab.body)}
      finally{sciencePendingAssessmentSpec=null}
     });`;
replace(oldBlock,newBlock);
assert.ok(s.includes('const physicsUniversityIndependentInvestigation='));
fs.writeFileSync(path,s);
console.log('Physics university study vs independent lab now separated in production WebView');
