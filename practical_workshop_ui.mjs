export const PRACTICAL_WORKSHOP_STYLE=String.raw`
.practical-lab{min-width:0;overflow-wrap:anywhere}.practical-lab textarea{box-sizing:border-box;width:100%;min-height:180px;font-size:16px;padding:12px;resize:vertical}.practical-lab pre{white-space:pre-wrap;border:1px solid #9c7985;padding:12px;border-radius:10px}.practical-lab fieldset{min-width:0;border:1px solid #9c7985;border-radius:10px;margin:14px 0}.practical-lab label{display:flex;gap:10px;align-items:flex-start;padding:10px 0;min-height:34px}.practical-lab input[type=checkbox]{width:22px;height:22px;flex-shrink:0}.practical-lab input[type=text],.practical-lab select{box-sizing:border-box;width:100%;padding:12px;font-size:16px;min-height:44px}.practical-lab .lit-actions{display:flex;flex-wrap:wrap;gap:8px}.practical-path{padding:12px;border:1px solid #9c7985;border-radius:12px;margin:12px 0}.practical-path ol{padding-left:24px}.practical-lab [role=status]{white-space:pre-wrap}
`;
export const PRACTICAL_WORKSHOP_SCRIPT=String.raw`
const PRACTICAL_WORKSHOP_PACKS={};
async function practicalEnsureCourse(id,stage,panel){
 const serial=practicalJourney.serial;
 const status=practicalNode('p',practicalLabel('Se încarcă materialul cursului…','Loading course material…'));status.setAttribute('role','status');panel.append(status);
 try{
  const {data,offline}=await practicalLoadPack(id);
  if(serial!==practicalJourney.serial||practicalJourney.course!==id||practicalJourney.stage!==stage)return;
  const p=data.content,index=PRACTICAL_COURSES_DATA.findIndex(c=>c.id===id);
  if(index<0)return;
  PRACTICAL_COURSES_DATA[index]=p.course;PRACTICAL_WORKSHOP_PACKS[id]=data;
  Object.assign(PRACTICAL_GUIDES_DATA,p.guides);Object.assign(PRACTICAL_DEPTH_DATA,p.depth);
  const si=PRACTICAL_SYLLABI_DATA.findIndex(x=>x.id===id);if(si<0)PRACTICAL_SYLLABI_DATA.push(p.syllabus);else PRACTICAL_SYLLABI_DATA[si]=p.syllabus;
  practicalOpen(stage);
  if(offline){const note=practicalNode('p',practicalLabel('Material din cache. Salvarea locală nu este garantată de dispozitiv.','Cached material. Device storage is not guaranteed.'));document.querySelector('.practical-panel')?.prepend(note)}
 }catch{
  if(serial!==practicalJourney.serial||!status.isConnected)return;
  status.textContent=practicalLabel('Cursul nu este disponibil și nu există o copie validă în cache. Prima încărcare necesită conexiune.','Course unavailable and no valid cached copy exists. An initial connection is required.');
  panel.append(practicalButton(practicalLabel('Reîncearcă','Retry'),()=>practicalOpen(stage)));
 }
}
function practicalWorkbookKey(chapter){return ['pocketai.practical.workbook.v2',practicalJourney.country,practicalJourney.course,chapter].join('.')}
function practicalWorkbookRead(chapter){
 try{const data=JSON.parse(localStorage.getItem(practicalWorkbookKey(chapter))||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{}}catch{return {}}
}
function practicalWorkbookReviewed(chapter){const data=practicalWorkbookRead(chapter);return Boolean(data.reviewed&&data.version===PRACTICAL_WORKSHOP_PACKS[practicalJourney.course]?.version)}
function practicalLabNode(tag,text,parent,source=false){const node=practicalNode(tag,text);if(source){node.dataset.practicalSource='true';node.lang='ro'}parent?.append(node);return node}
async function practicalTranslateWorkshop(root,identity,button){
 const language=state.language||'ro';if(language==='ro')return;
 button.disabled=true;const serial=practicalJourney.serial;
 const nodes=[...root.querySelectorAll('[data-practical-source]')],groups=[];let group=[],length=0;
 for(const node of nodes){const value=node.dataset.originalSource||node.textContent;node.dataset.originalSource=value;if(group.length&&length+value.length>3000){groups.push(group);group=[];length=0}group.push(node);length+=value.length}if(group.length)groups.push(group);
 const notice=root.querySelector('[data-translation-status]');if(notice)notice.textContent=practicalLabel('Se traduc instrucțiunile, nu ciorna ta…','Translating instructions, not your draft…');
 try{
  const results=[];
  for(let i=0;i<groups.length;i++){
   const original=Object.fromEntries(groups[i].map((node,j)=>['t'+j,node.dataset.originalSource]));
   const result=await eduTranslateMaterial(original,identity+'-'+i,'ro',{targetLanguage:language,priority:true});
   if(!root.isConnected||serial!==practicalJourney.serial||language!==state.language)return;
   if(!result||Object.keys(original).some(k=>typeof result[k]!=='string'||!result[k].trim()))throw Error('translation_unavailable');results.push(result);
  }
  groups.forEach((rows,i)=>rows.forEach((node,j)=>{node.textContent=results[i]['t'+j];node.lang=language}));if(notice)notice.textContent='';
 }catch{if(root.isConnected&&notice)notice.textContent=practicalLabel('Traducere indisponibilă; instrucțiunile originale sunt păstrate. Reîncearcă.','Translation unavailable; original instructions are preserved. Retry.')}
 finally{if(root.isConnected)button.disabled=false}
}
function practicalLabTranslation(root,identity){
 const notice=practicalLabNode('p','',root);notice.setAttribute('role','status');notice.dataset.translationStatus='true';
 if(state.language==='ro')return;
 const retry=practicalButton(practicalLabel('Tradu / reîncearcă instrucțiunile','Translate / retry instructions'),()=>practicalTranslateWorkshop(root,identity,retry));root.append(retry);practicalTranslateWorkshop(root,identity,retry);
}
function practicalPathway(panel,course){
 const pack=PRACTICAL_WORKSHOP_PACKS[course.id];if(!pack)return;
 const p=pack.content,box=practicalNode('section','','practical-path');
 practicalLabNode('h3',practicalLabel('Parcurs: înțeleg → fac → verific → aplic','Path: understand → make → check → apply'),box);
 practicalLabNode('p',p.pathway.principle,box,true);practicalLabNode('p',p.syllabus.prerequisite,box,true);practicalLabNode('p',p.pathway.safety,box,true);
 const list=practicalLabNode('ol','',box);
 p.workshops.forEach(w=>practicalLabNode('li',w.artifact+' · ~'+w.minutes+' min',list,true));
 const reviewed=course.chapters.filter(ch=>practicalWorkbookReviewed(ch.id)).length;
 practicalLabNode('p',practicalLabel('Lucrări autoevaluate: ','Self-reviewed work: ')+reviewed+'/6. '+practicalLabel('Timpurile sunt estimări, nu condiții de promovare. Fără certificare.','Times are estimates, not passing requirements. No certification.'),box);
 panel.append(box);practicalLabTranslation(box,'practical-path-'+course.id+'-'+pack.version);
}
function practicalWorkshopOpen(project=false){
 const course=practicalCourse(),pack=PRACTICAL_WORKSHOP_PACKS[course?.id];if(!pack)return;
 const p=pack.content,id=project?'project':practicalJourney.chapter,w=p.workshops.find(x=>x.id===id);
 if(!project&&!w)return;
 const key=practicalWorkbookKey(id),saved=practicalWorkbookRead(id);
 let current={draft:typeof saved.draft==='string'?saved.draft.slice(0,12000):'',seed:typeof saved.seed==='string'?saved.seed:'',evidence:saved.evidence&&typeof saved.evidence==='object'?saved.evidence:{},answer:typeof saved.answer==='string'?saved.answer:'',reviewed:Boolean(saved.reviewed&&saved.version===pack.version&&(!project||course.chapters.every(ch=>practicalWorkbookReviewed(ch.id)&&saved.chapterRevisions?.[ch.id]===practicalWorkbookRead(ch.id).updatedAt)))};
 const root=practicalNode('section','','practical-lab'),parking=practicalNode('div');
 const dialog=practicalActivityDialog(practicalLabel(project?'Proiect final și portofoliu':'Atelier ghidat',project?'Final project and portfolio':'Guided workshop'),[root],parking);
 const node=(tag,text,source=false)=>practicalLabNode(tag,text,root,source);
 node('h3',project?p.pathway.title:w.title,true);
 node('p',project?p.syllabus.project:w.scenario,true);
 node('p',project?p.pathway.safety:w.safety,true);
 node('h4',practicalLabel('La final vei avea','Your deliverable'));
 node('p',project?'Un dosar care leagă cele șase lucrări și explică deciziile, limitele și corecțiile făcute.':w.artifact,true);
 if(!project){node('p','Timp orientativ: '+w.minutes+' minute. Materiale: '+w.tools.join('; ')+'.',true);node('h4',practicalLabel('Greșeala de evitat','Common mistake'));node('p',w.mistake,true)}
 const scaffold=node('details','');practicalLabNode('summary',practicalLabel('Model de structură pentru lucrare','Work structure template'),scaffold);const template=practicalLabNode('pre',project?p.pathway.finalTemplate:w.template,scaffold,true);
 const actions=node('div','');actions.className='lit-actions';
 const draft=node('textarea','');draft.value=current.draft;draft.maxLength=12000;draft.setAttribute('aria-label',practicalLabel('Lucrarea mea','My work'));draft.placeholder=practicalLabel('Folosește date fictive și explică pașii. Nu scrie parole sau date sensibile.','Use fictional data and explain the steps. Do not enter passwords or sensitive data.');
 const saveStatus=node('p','');saveStatus.setAttribute('role','status');
 const reviewStatus=node('p','');reviewStatus.setAttribute('role','status');
 function paintStatus(){reviewStatus.textContent=current.reviewed?practicalLabel('✓ Autoevaluare salvată. Este verificată completitudinea declarată, nu calitatea profesională.','✓ Self-review saved. This checks declared completeness, not professional quality.'):practicalLabel('Ciornă. Citirea și testele grilă nu înlocuiesc lucrarea practică.','Draft. Reading and multiple-choice tests do not replace practical work.')}
 function save(invalidate=true){
  if(invalidate)current.reviewed=false;current.draft=draft.value;
  try{localStorage.setItem(key,JSON.stringify({...current,version:pack.version,updatedAt:Date.now()}));saveStatus.textContent=practicalLabel('Salvat local pe acest dispozitiv. Nu se sincronizează automat.','Saved locally on this device. No automatic sync.')}
  catch{current.reviewed=false;saveStatus.textContent=practicalLabel('Nu am putut salva pe dispozitiv. Păstrează fereastra deschisă și exportă lucrarea.','Could not save on this device. Keep this window open and export your work.')}
  paintStatus();
 }
 draft.addEventListener('input',()=>save());
 actions.append(practicalButton(practicalLabel('Inserează structura într-o ciornă goală','Insert structure into an empty draft'),()=>{if(draft.value.trim()){saveStatus.textContent=practicalLabel('Ciorna nu a fost suprascrisă. Golește-o explicit dacă dorești altă structură.','Draft was not overwritten. Clear it explicitly if you want a new structure.');return}draft.value=template.textContent;current.seed=template.textContent;save()}));
 let answerInput=null;
 if(!project){
  node('h4',practicalLabel('Verificare locală pe scenariu','Local scenario check'));node('p',w.checkpoint.question,true);
  answerInput=node(w.checkpoint.type==='choice'?'select':'input','');
  answerInput.setAttribute('aria-label',practicalLabel('Răspuns la scenariu','Scenario answer'));
  if(w.checkpoint.type==='choice'){
   const empty=practicalLabNode('option',practicalLabel('Alege un răspuns','Choose an answer'),answerInput);empty.value='';
   w.checkpoint.choices.forEach((choice,i)=>{const opt=practicalLabNode('option',choice,answerInput,true);opt.value=String(i)});
  }else{answerInput.type='text';answerInput.inputMode='decimal'}
  answerInput.value=current.answer;answerInput.addEventListener(w.checkpoint.type==='choice'?'change':'input',()=>{current.answer=answerInput.value;save()});
  const feedback=node('p','');feedback.setAttribute('role','status');
  root.append(practicalButton(practicalLabel('Verifică răspunsul local','Check answer locally'),()=>{feedback.textContent=practicalCheckpointCorrect(w.checkpoint,answerInput.value)?practicalLabel('Corect pentru datele scenariului. Compară și explicația.','Correct for the scenario data. Compare the explanation too.'):practicalLabel('Încă nu. Revino la date, unități și explicația de mai jos.','Not yet. Review the data, units and explanation below.')}));
  const solution=node('details','');practicalLabNode('summary',practicalLabel('Explicație și răspuns','Explanation and answer'),solution);practicalLabNode('p',w.checkpoint.explanation,solution,true);
  node('h4',practicalLabel('Aplică într-o situație nouă','Transfer to a new situation'));node('p',w.transfer,true);
 }
 const checklist=node('fieldset','');practicalLabNode('legend',practicalLabel('Autoevaluare cu dovezi în lucrare','Self-review using evidence in your work'),checklist);
 const criteria=project?p.syllabus.rubric.map((text,i)=>({id:'criterion-'+i,text})):w.evidence;
 criteria.forEach(e=>{const label=practicalLabNode('label','',checklist),check=document.createElement('input');check.type='checkbox';check.checked=current.evidence[e.id]===true;check.setAttribute('aria-label',e.text);label.append(check);practicalLabNode('span',e.text,label,true);check.addEventListener('change',()=>{current.evidence[e.id]=check.checked;save()})});
 root.append(practicalButton(practicalLabel('Salvează autoevaluarea lucrării','Save work self-review'),()=>{
  const unaltered=draft.value.trim()===current.seed.trim();
  const ready=project?draft.value.trim().length>=80&&!unaltered&&criteria.every(e=>current.evidence[e.id])&&course.chapters.every(ch=>practicalWorkbookReviewed(ch.id)):practicalCanSelfReview(w,{...current,draft:draft.value});
  if(!ready){reviewStatus.textContent=practicalLabel('Lipsesc elemente: completează lucrarea, verificarea locală și toate criteriile. Pentru proiect sunt necesare cele șase autoevaluări de capitol. Un șablon necompletat nu este lucrare.','Missing items: complete your work, the local check and all criteria. The project also requires six chapter self-reviews. An untouched template is not a finished work.');return}
  current.reviewed=true;if(project)current.chapterRevisions=Object.fromEntries(course.chapters.map(ch=>[ch.id,practicalWorkbookRead(ch.id).updatedAt]));save(false);
 },'primary-btn'));
 const exports=node('div','');exports.className='lit-actions';
 const makeExport=()=>{
  if(!draft.value.trim()){saveStatus.textContent=practicalLabel('Scrie mai întâi lucrarea.','Write your work first.');return}
  const lines=[project?p.pathway.title:w.artifact,practicalLabel('Dosar de antrenament — nu certificare','Training portfolio — not certification'),'',draft.value,'',practicalLabel('Stare declarată: ','Declared state: ')+(current.reviewed?practicalLabel('autoevaluat','self-reviewed'):practicalLabel('ciornă','draft'))];
  if(project)course.chapters.forEach(ch=>{const state=practicalWorkbookRead(ch.id);lines.push('','## '+ch.title,String(state.draft||practicalLabel('Lucrare lipsă','No work saved')),practicalWorkbookReviewed(ch.id)?practicalLabel('Autoevaluat','Self-reviewed'):practicalLabel('Neautoevaluat','Not self-reviewed'))});
  eduOpenPrint('save',{title:'Portofoliu_'+course.id+'_'+id,text:lines.join('\n')});
 };
 exports.append(practicalButton(practicalLabel('💾 Exportă lucrarea PDF','💾 Export work as PDF'),makeExport),practicalButton(practicalLabel('Șterge această ciornă','Delete this draft'),()=>{if(!window.confirm(practicalLabel('Ștergi numai această lucrare locală?','Delete only this local work?')))return;draft.value='';current={draft:'',seed:'',evidence:{},answer:'',reviewed:false};if(answerInput)answerInput.value='';checklist.querySelectorAll('input').forEach(x=>x.checked=false);save()}));
 paintStatus();practicalLabTranslation(root,'practical-workshop-'+course.id+'-'+id+'-'+pack.version);
 return dialog;
}
`;
