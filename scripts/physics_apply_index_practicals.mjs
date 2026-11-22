import fs from 'node:fs';
import assert from 'node:assert/strict';
// One-time source migration. Modify only the Physics laboratory reader;
// leave all existing grade VI laboratories, Chemistry, Biology, and the
// remaining application intact. Refuse to run on unexpected source text.
const path='index.js';
let js=fs.readFileSync(path,'utf8');
if(js.includes("import {PHYSICS_PRACTICAL_PROTOCOLS,physicsLaboratoryYearInvestigations}")){
 console.log('Physics practical reader already integrated');process.exit(0);
}
const replace=(oldText,newText)=>{
 assert.ok(js.includes(oldText),'Required original index.js anchor absent: '+oldText.slice(0,100));
 assert.equal(js.split(oldText).length,2,'Anchor must occur exactly once');
 js=js.replace(oldText,newText);
};
replace(
 "import {physicsGrade6Laboratories} from './physics_grade6_labs.mjs';",
 "import {physicsGrade6Laboratories} from './physics_grade6_labs.mjs';\n"+
 "import {PHYSICS_PRACTICAL_PROTOCOLS,physicsLaboratoryYearInvestigations} from './physics_europe_practicals.mjs';"
);
const anchor="const physicsGrade6Laboratories=";
const start=js.indexOf(anchor);
assert.ok(start>0);
const end=js.indexOf('\n',start);
assert.ok(end>start);
const dollar='$';
const embed=[
 'const PHYSICS_PRACTICAL_PROTOCOLS='+dollar+'{JSON.stringify(PHYSICS_PRACTICAL_PROTOCOLS)};',
 'const physicsLaboratoryYearInvestigations='+dollar+'{physicsLaboratoryYearInvestigations.toString()};'
].join('\n');
js=js.slice(0,end+1)+embed+'\n'+js.slice(end+1);
const original="   }else tile('📈','Reprezentări din capitol','Chapter diagrams','Doar modele relevante lecției','Only lesson-relevant models',physicsVisualPicker);";
const replacement=[
 "   }else{",
 "    // Every European school grade gets its own relevant, safe Physics",
 "    // investigations. Never show a generic diagram as the only laboratory.",
 "    const country=educationCountrySelection.code;",
 "    const studyYears=eduYearOptions(country,",
 "     scienceJourney.schoolStage==='upper'?'intermediate':scienceJourney.schoolStage,'science');",
 "    const authored=scienceSchoolTopicLessons({",
 "     country,subject:'physics',stage:scienceJourney.schoolStage,",
 "     grade:scienceJourney.grade,topic:scienceJourney.topic,years:studyYears,",
 "     lessons:EDUCATION_THEORY_DATA,language:state.language",
 "    });",
 "    const investigations=physicsLaboratoryYearInvestigations({",
 "     country,grade:scienceJourney.grade,stage:scienceJourney.schoolStage,",
 "     topic:scienceJourney.topic,yearPosition:scienceJourney.gradePosition,",
 "     language:state.language,lessons:authored",
 "    });",
 "    for(const lab of investigations){",
 "     tile('🧪',lab.ro,lab.en,'Experiment explicat, pași, date și verificare',",
 "      'Explained experiment, procedure, evidence and review',()=>{",
 "       sciencePendingAssessmentSpec={",
 "        subject:'physics',topic:scienceJourney.topic,",
 "        stage:scienceJourney.schoolStage,lang:state.language,",
 "        prompt:lab.review.prompt,guide:lab.review.guide,localVerification:false",
 "       };",
 "       try{educationOpenPagedLesson(learningLabel(lab.ro,lab.en),lab.body)}",
 "       finally{sciencePendingAssessmentSpec=null}",
 "      });",
 "    }",
 "    const topicModels={kinematics:true,dynamics:true,energy:true,waves:true,",
 "     electric:true,circuits:true,optics:true,thermodynamics:true,modern:true};",
 "    if(topicModels[scienceJourney.topic])",
 "     tile('📈','Modelul fizic al capitolului','Chapter-specific physical model',",
 "      'Numai reprezentări corespunzătoare fenomenului studiat',",
 "      'Only diagrams matching the studied physical phenomenon',physicsVisualPicker);",
 "    if(!investigations.length){",
 "     const notice=document.createElement('p');notice.className='chem-no-visual';",
 "     notice.textContent=learningLabel(",
 "      'Nu există o investigație originală documentată pentru această temă și acest an.',",
 "      'No authored investigation exists for this exact topic and year.');",
 "     list.append(notice);",
 "    }",
 "   }"
].join('\n');
replace(original,replacement);
replace(
 "introPhysics?'Experimente pentru clasa a VI-a':astronomy?'Activități și reprezentări':'Laborator și modele 3D'",
 "introPhysics?'Experimente pentru clasa a VI-a':scienceJourney.subject==='physics'?'Experimente și reprezentări':astronomy?'Activități și reprezentări':'Laborator și modele 3D'"
);
replace(
 "introPhysics?'Grade VI investigations':astronomy?'Activities and diagrams':'Laboratory and 3D models'",
 "introPhysics?'Grade VI investigations':scienceJourney.subject==='physics'?'Physics investigations and diagrams':astronomy?'Activities and diagrams':'Laboratory and 3D models'"
);
assert.ok(js.includes('const physicsLaboratoryYearInvestigations=')&&
 js.includes('const authored=scienceSchoolTopicLessons({'));
fs.writeFileSync(path,js);
console.log('Integrated year-specific Physics investigation reader into index.js');
