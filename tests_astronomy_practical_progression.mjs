import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS} from './astronomy_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {astronomyUniversityCourseChoices} from './astronomy_university_courses.mjs';
import {ASTRONOMY_ACTIVITY_DIAGRAM_BY_STAGE,ASTRONOMY_GRAPH_SERIES,ASTRONOMY_LOWER_SERIES,
 astronomyActivityProgression} from './astronomy_practical_progression.mjs';
const topics=new Set(ASTRONOMY_TOPICS.map(x=>x.id));
const graphTypes=new Set(['graph','analysis']);
let subjects=0,gradeActivities=0,universityActivities=0;
assert.ok(Object.keys(ASTRONOMY_GRAPH_SERIES).length>=16);
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,code] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(country,code).years;
  for(const year of years){
   const plan=scienceGradeTopicPlan({country,subject:'astronomy',stage,grade:year.id,
    years,topics:ASTRONOMY_TOPICS});
   for(const topic of plan.topics){
    const arr=astronomyActivityProgression({country,stage,topic:topic.id,
      grade:year.id,years,language:'ro'});
    assert.equal(arr.length,stage==='primary'?2:3,
      'Number of school activities should reflect age: '+country+' '+stage+' '+year.id+' '+topic.id);
    assert.ok(arr.every(a=>a.gradeName.includes(year.id)&&a.topic===topic.id));
    assert.equal(new Set(arr.map(a=>a.kind)).size,arr.length,'No duplicate card types');
    assert.equal(new Set(arr.map(a=>a.id)).size,arr.length,'No duplicate activity IDs');
    assert.ok(arr.some(a=>a.kind==='diagram'&&a.diagram));
    const diagram=arr.find(a=>a.kind==='diagram');
    assert.ok(ASTRONOMY_ACTIVITY_DIAGRAM_BY_STAGE[stage][topic.id]?.includes(diagram.diagram),
      'Wrong diagram for stage/year: '+stage+'/'+topic.id);
    if(stage==='primary'){
     assert.ok(!arr.some(x=>graphTypes.has(x.kind)), 'Primary must not show advanced numerical graphs');
     assert.ok(!['parallax','redshift','hr','rotationcurve','interferometer','orbittransfer','accretion'].includes(diagram.diagram),
       'Primary diagram is too advanced: '+diagram.diagram);
    }else{
     const numerical=arr.find(a=>a.kind==='graph');
     assert.ok(numerical.x?.length>=3&&numerical.x.length===numerical.y?.length);
     assert.ok(numerical.xLabel&&numerical.yLabel&&numerical.model);
     assert.ok(numerical.y.every(Number.isFinite));
     if(stage==='lower'&&topic.id==='solar')assert.deepEqual(numerical.dataSource.x,
       ASTRONOMY_LOWER_SERIES.solar.x);
    }
    gradeActivities+=arr.length;subjects++;
   }
  }
 }
 for(const specialty of ASTRONOMY_SPECIALIZATIONS){
  for(let year=1;year<=4;year++){
   const routeYears=4;
   const choices=astronomyUniversityCourseChoices({year,years:routeYears,specialty:specialty.id,
    topics:ASTRONOMY_TOPICS,specializations:ASTRONOMY_SPECIALIZATIONS});
   for(const topic of choices.filter(x=>x.id!=='astronomy-capstone')){
    const arr=astronomyActivityProgression({topic:topic.id,stage:'advanced',grade:'univ-'+year,
      years:Array.from({length:4},(_,i)=>({id:'univ-'+(i+1)})),specialty:specialty.id});
    assert.equal(arr.length,4);
    const analysis=arr.find(a=>a.kind==='analysis');
    assert.ok(analysis?.advanced&&analysis.x?.length>=3,
      'University has no residual/uncertainty analysis: '+topic.id);
    assert.ok(!arr.some(a=>a.diagram==='cosmos'),
      'Avoid childish cosmic-expansion cartoon for university: '+topic.id);
    universityActivities+=arr.length;
   }
  }
 }
}
assert.ok(subjects>850&&gradeActivities>2200&&universityActivities>1000);
for(const kind of Object.values(ASTRONOMY_ACTIVITY_DIAGRAM_BY_STAGE).flatMap(x=>Object.values(x).flat()))
 assert.ok(typeof kind==='string'&&kind.length>=2);
const source=await(await app.fetch(new Request('https://astronomy-activity-qa.invalid/'))).text();
const script=source.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const marker of ['const ASTRONOMY_GRAPH_SERIES=','const ASTRONOMY_LOWER_SERIES=',
 'const astronomyActivityProgression=','function astronomyPracticalGraphOpen(activity)',
 'function astronomyActivityLessonText(activity,lab)',
 'astronomyDiagramPicker([item.diagram],item)'])assert.ok(script.includes(marker),marker);
const from=script.indexOf('function astronomyPracticalGraphOpen(activity)');
const to=script.indexOf('function astronomyOrbit3DOpen(){',from);
assert.ok(from>=0&&to>from);
class El{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.style={};this.textContent='';
  this.event={};this.className='';}
 append(...xs){this.children.push(...xs)}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,cb){this.event[k]=cb}
 showModal(){}
 close(){}
 remove(){}
}
let modal=null;
const context={
 document:{
  createElement:tag=>new El(tag),createElementNS:(ns,tag)=>new El(tag),
  getElementById:()=>null,body:{append:el=>modal=el}
 },
 state:{language:'ro'},learningLabel:(ro,en)=>ro,
 ASTRONOMY_GRAPH_SERIES,ASTRONOMY_LOWER_SERIES,
 ASTRONOMY_PRIMARY_CASES:{
  solar:{core:['Soarele este o stea','Pământul se rotește']},
  sky:{core:['Orizontul aparent','Mișcarea aparentă']}
 }
};
const {graph,documentText}=vm.runInNewContext(script.slice(from,to)+
 '\n({graph:astronomyPracticalGraphOpen,documentText:astronomyActivityLessonText})',context);
const grades=['9','10','11','12'].map(id=>({id}));
const models=[];
for(const g of ['9','10','11','12']){
 const arr=astronomyActivityProgression({topic:'solar',stage:'upper',grade:g,years:grades});
 const chart=arr.find(x=>x.kind==='graph');
 graph(chart);
 const svg=modal.children.find(x=>x.tag==='svg');
 assert.ok(svg&&svg.children.some(x=>x.tag==='path'&&x.attrs.stroke==='#89d4eb'));
 assert.ok(modal.children.some(x=>x.tag==='div'&&x.children.some(y=>y.tag==='table')));
 models.push(JSON.stringify(svg.children.map(x=>[x.tag,x.attrs])).slice(0,100000));
}
assert.equal(new Set(models).size,4,'Grades IX–XII must not have the same diagram pixels');
const university=astronomyActivityProgression({topic:'special-cosmo',stage:'advanced',grade:'univ-3'});
const regular=university.find(x=>x.kind==='graph');
const residual=university.find(x=>x.kind==='analysis');
graph(regular);const plot1=JSON.stringify(modal.children.find(x=>x.tag==='svg').children.map(x=>x.attrs));
graph(residual);const plot2=JSON.stringify(modal.children.find(x=>x.tag==='svg').children.map(x=>x.attrs));
assert.notEqual(plot1,plot2,'Residual analysis must not duplicate the first model chart');
assert.ok(modal.children.find(x=>x.tag==='svg').children.some(x=>x.textContent==='Reziduu (%)'));
const primary=astronomyActivityProgression({stage:'primary',grade:'1',topic:'solar',
 years:['1','2','3','4'].map(id=>({id}))});
const primaryText=documentText(primary[0],'# Activitate primară cu lanternă și glob');
assert.ok(primaryText.includes('Jurnal de observație'));
assert.ok(!primaryText.includes('T²/a³'),'Primary text must not import Kepler');
// Lunar phase diagrams are not four copies of the same half-illuminated
// disc. This previously looked attractive but taught incorrect astronomy.
const moonStart=script.indexOf('function astronomyVisualBuild(kind){');
const moonEnd=script.indexOf('function astronomyPracticalGraphOpen(activity)',moonStart);
const {draw}=vm.runInNewContext(script.slice(moonStart,moonEnd)+
 '\n({draw:astronomyVisualBuild})',{
 document:{createElement:tag=>new El(tag),createElementNS:(ns,tag)=>new El(tag)},
 ASTRONOMY_PLANETS:[],ASTRONOMY_PLANET_REFERENCE:{},
 learningLabel:(ro,en)=>ro
});
const phaseSvg=draw('phases').children.find(x=>x.tag==='svg');
assert.ok(phaseSvg.children.some(x=>x.tag==='text'&&x.textContent==='Nouă'));
assert.ok(phaseSvg.children.some(x=>x.tag==='text'&&x.textContent==='Plină'));
assert.ok(phaseSvg.children.some(x=>x.tag==='text'&&x.textContent==='Pătrar I'));
assert.ok(phaseSvg.children.some(x=>x.tag==='text'&&x.textContent==='Pătrar III'));
const logSvg=draw('moonlog').children.find(x=>x.tag==='svg');
const observationDays=logSvg.children.filter(x=>x.tag==='text'&&x.textContent.startsWith('Ziua '))
 .map(x=>x.textContent);
assert.deepEqual(observationDays,['Ziua 1','Ziua 8','Ziua 15','Ziua 22'],
 'The four lunar phases cannot be presented as four consecutive days');
console.log('PASS Astronomy practical progression: '+subjects+' European school chapters, '+
 gradeActivities+' age-specific activities, '+universityActivities+' university tasks, 4 distinct high-school graphs and separate residual plot');
