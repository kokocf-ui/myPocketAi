export const PRACTICAL_UI_SCRIPT=String.raw`
// Practical education: country -> useful skills -> level -> ordered lessons -> workbook.
// Every panel is local to Education. The public conversational pane remains hidden.
let practicalJourney={stage:'countries',country:'RO',course:'',level:'beginner',chapter:'',variant:0,voice:false,serial:0,controller:null,busy:false};
function practicalNode(tag,text='',className=''){const element=document.createElement(tag);if(text)element.textContent=text;if(className)element.className=className;return element}
function practicalButton(text,fn,kind='secondary-btn'){const node=practicalNode('button',text,kind);node.type='button';node.onclick=fn;node.style.cssText='min-height:46px;max-width:100%;touch-action:manipulation;white-space:normal;overflow-wrap:anywhere;';return node}
function practicalLabel(ro,en){return learningLabel(ro,en)}
function practicalCountry(){return PRACTICAL_COUNTRIES_DATA.find(c=>c[0]===practicalJourney.country)||PRACTICAL_COUNTRIES_DATA[0]}
function practicalCourse(){return PRACTICAL_COURSES_DATA.find(c=>c.id===practicalJourney.course)}
function practicalChapter(){return practicalCourse()?.chapters.find(x=>x.id===practicalJourney.chapter)}
function practicalStop(){practicalJourney.serial++;practicalJourney.controller?.abort();practicalJourney.controller=null;practicalJourney.busy=false;if(practicalJourney.voice&&pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stopListen'});practicalJourney.voice=false}
function practicalKey(){return ['mypocketai.practical.v1',practicalJourney.country,practicalJourney.course,practicalJourney.chapter].join('.')}
function practicalReadSaved(){try{return JSON.parse(localStorage.getItem(practicalKey())||'{}')}catch{return {}}}
function practicalSave(values){try{localStorage.setItem(practicalKey(),JSON.stringify({...practicalReadSaved(),...values,updatedAt:Date.now()}))}catch{}}
function practicalVoiceHandleAndroid(data){
 if(data?.mode!=='practicalCourses')return false;
 if(practicalJourney.stage!=='lesson')return true;
 const field=document.getElementById('practicalAnswer'),status=document.getElementById('practicalStatus');
 if(data.status==='partial'){if(status)status.textContent=practicalLabel('Aud: ','Hearing: ')+String(data.text||'').slice(0,90)}
 if(data.status==='recognized'&&field&&practicalJourney.voice){field.value+=(field.value.trim()?' ':'')+collapseRepeatedVoiceWords(String(data.text||'').trim());practicalSave({draft:field.value});if(status)status.textContent=practicalLabel('Dictarea a fost preluată. Verifică textul.','Dictation received. Check the text.')}
 if(data.status==='recognized'||data.status==='error'){practicalJourney.voice=false;document.getElementById('practicalDictation')?.setAttribute('aria-pressed','false')}
 return true;
}
function practicalDictate(){
 if(practicalJourney.voice){practicalJourney.voice=false;pocketNativeVoiceSend({action:'stopListen'});document.getElementById('practicalDictation')?.setAttribute('aria-pressed','false');return}
 if(!pocketNativeVoiceAvailable()){const el=document.getElementById('practicalStatus');if(el)el.textContent=practicalLabel('Dictarea necesită aplicația Android.','Dictation requires the Android app.');return}
 stopSpeech();stopRecognition();practicalJourney.voice=true;document.getElementById('practicalDictation')?.setAttribute('aria-pressed','true');
 if(!pocketNativeVoiceSend({action:'listen',mode:'practicalCourses',language:state.language==='ro'?'ro-RO':'en-GB'})){practicalJourney.voice=false;document.getElementById('practicalDictation')?.setAttribute('aria-pressed','false')}
}
function practicalBack(){
 practicalStop();if(state.speaking)stopSpeech();
 const previous={countries:null,courses:'countries',levels:'courses',chapters:'levels',lesson:'chapters'};
 if(previous[practicalJourney.stage])practicalOpen(previous[practicalJourney.stage]);else renderLearningSubjects();
}
function practicalList(parent,items,onPick){
 const box=practicalNode('div','','practical-list');box.style.cssText='display:flex;flex-direction:column;gap:8px;min-width:0;';
 const list=practicalNode('div');list.style.cssText='display:flex;flex-direction:column;gap:8px;';
 let search='',page=0;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const draw=()=>{
  const filtered=items.filter(item=>normalize((item.ro||'')+' '+(item.en||'')).includes(normalize(search)));
  if(page>=filtered.length)page=0;list.replaceChildren();
  filtered.slice(page,page+4).forEach(item=>{const btn=practicalButton(item.icon?item.icon+' '+practicalLabel(item.ro,item.en):practicalLabel(item.ro,item.en),()=>onPick(item));btn.style.textAlign='left';list.append(btn)});
  if(!filtered.length)list.append(practicalNode('p',practicalLabel('Niciun rezultat pentru căutare.','No results.')));
  const pages=practicalNode('div','','lit-actions');
  if(page>0)pages.append(practicalButton(practicalLabel('← Anterior','← Previous'),()=>{page=Math.max(0,page-4);draw()}));
  if(page+4<filtered.length)pages.append(practicalButton(practicalLabel('Alte rezultate →','More results →'),()=>{page+=4;draw()}));
  list.append(pages);
 };
 if(items.length>4){const input=practicalNode('input','','lit-input');input.type='search';input.placeholder=practicalLabel('Caută de la prima literă…','Search from first letter…');input.setAttribute('aria-label',practicalLabel('Filtrează lista','Filter list'));input.style.cssText='width:100%;max-width:100%;min-height:44px;box-sizing:border-box;';input.oninput=()=>{search=input.value;page=0;draw()};box.append(input)}
 box.append(list);parent.append(box);draw();
}
function practicalOpen(stage){
 practicalStop();practicalJourney.stage=stage;
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');if(!root||!host)return;
 root.classList.remove('learning-choose','learning-math','learning-science','learning-hg','learning-literature','learning-languages','learning-computing','learning-exams','science-choice-stage');
 root.classList.add('learning-active','learning-practical');activeLearningSubject=LEARNING_SUBJECTS.find(x=>x[0]==='practical')||null;
 document.getElementById('moduleTitle').textContent=practicalLabel('Cursuri practice','Practical courses');document.getElementById('moduleLead').textContent='';
 host.replaceChildren();const bar=practicalNode('div','','education-toolbar lit-toolbar');bar.append(practicalButton(practicalLabel('← Înapoi','← Back'),practicalBack));eduAttachPrintAction(bar);host.append(bar);
 const panel=practicalNode('section','','math-choice-panel science-choice-panel lit-panel practical-panel');panel.style.cssText='min-width:0;width:100%;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere;padding-bottom:155px;';
 const titles={countries:['Țara / sistemul de referință','Country / reference system'],courses:['Alege domeniul practic','Choose a practical subject'],levels:['Alege nivelul de studiu','Choose a learning level'],chapters:['Capitole în ordine','Chapters in order'],lesson:['Lecție și aplicație','Lesson and practical application']};
 panel.append(practicalNode('h2',practicalLabel(...titles[stage])));host.append(panel);
 if(stage==='countries'){
  const c=practicalCountry();panel.append(practicalNode('p',practicalLabel('Selectează țara pentru surse oficiale, fără a presupune reguli locale unice.','Select a country for official sources; local laws are not universal.')));
  practicalList(panel,PRACTICAL_COUNTRIES_DATA.map(v=>({id:v[0],ro:v[1],en:v[2]})),choice=>{practicalJourney.country=choice.id;practicalJourney.course='';practicalJourney.chapter='';practicalOpen('courses')});return;
 }
 panel.append(practicalNode('p',practicalLabel(practicalCountry()[1],practicalCountry()[2])));
 if(stage==='courses'){
  practicalList(panel,PRACTICAL_COURSES_DATA.map(c=>({id:c.id,icon:c.icon,ro:c.ro+' — '+c.summary,en:c.en})),choice=>{practicalJourney.course=choice.id;practicalJourney.chapter='';practicalOpen('levels')});return;
 }
 const course=practicalCourse();if(!course){practicalOpen('courses');return}
 panel.append(practicalNode('p',practicalLabel(course.ro,course.en)));
 if(stage==='levels'){
  const levels=PRACTICAL_LEVELS_DATA.map(l=>({id:l.id,ro:l.ro+' · '+course.chapters.filter(x=>x.level===l.id).length+' '+practicalLabel('capitole','chapters'),en:l.en}));
  practicalList(panel,levels,choice=>{practicalJourney.level=choice.id;practicalJourney.chapter='';practicalOpen('chapters')});return;
 }
 if(stage==='chapters'){
  const chapters=course.chapters.filter(x=>x.level===practicalJourney.level);
  const progress=practicalNode('p',practicalLabel('Parcursul este salvat local, separat pe lecție și țară.','Your progress is saved locally per lesson and country.'));
  panel.append(progress);
  practicalList(panel,chapters.map((x,i)=>({id:x.id,ro:(i+1)+'. '+x.title+(practicalSavedForChapter(x.id)?.completed?' ✓':''),en:(i+1)+'. '+x.title})),choice=>{practicalJourney.chapter=choice.id;practicalJourney.variant=0;practicalOpen('lesson')});return;
 }
 if(stage==='lesson')practicalLesson(panel);
}
function practicalSavedForChapter(id){
 try{const key=['mypocketai.practical.v1',practicalJourney.country,practicalJourney.course,id].join('.');return JSON.parse(localStorage.getItem(key)||'{}')}catch{return null}
}
function practicalQuestions(course,chapter,variant){
 const peers=course.chapters.filter(x=>x.id!==chapter.id&&x.level===chapter.level);
 const others=course.chapters.filter(x=>x.id!==chapter.id&&x.level!==chapter.level);
 const tail=[...peers,...others];const shift=tail.length?((variant%tail.length)+tail.length)%tail.length:0;
 const items=[chapter,...tail.slice(shift),...tail.slice(0,shift)].slice(0,5);
 return items.map((x,index)=>{const rotation=(index+variant+1)%4,q=x.question,choices=[...q.choices.slice(4-rotation),...q.choices.slice(0,4-rotation)];return {...q,choices,correct:(q.correct+rotation)%4,chapterId:x.id,title:x.title}});
}
function practicalLesson(panel){
 const course=practicalCourse(),chapter=practicalChapter();if(!course||!chapter){practicalOpen('chapters');return}
 const saved=practicalReadSaved();
 const study=practicalNode('article','','practical-printable');study.style.cssText='display:block;min-width:0;max-width:100%;line-height:1.5;';
 study.append(practicalNode('h3',chapter.title));
 const meta=practicalLabel(practicalCountry()[1],practicalCountry()[2])+' · '+practicalLabel(course.ro,course.en)+' · '+(PRACTICAL_LEVELS_DATA.find(x=>x.id===chapter.level)?.ro||chapter.level);
 study.append(practicalNode('p',meta));
 study.append(practicalNode('h4',practicalLabel('Explicația lecției','Lesson explanation')),practicalNode('p',chapter.theory));
 study.append(practicalNode('h4',practicalLabel('Cum se procedează','How to proceed')),practicalNode('p',chapter.method));
 study.append(practicalNode('h4',practicalLabel('Exemplu concret','Worked example')),practicalNode('p',chapter.caseStudy));
 study.append(practicalNode('h4',practicalLabel('Exerciții de aplicare','Practical exercises')));
 chapter.practice.forEach((task,i)=>study.append(practicalNode('p',(i+1)+'. '+task)));
 panel.append(study);
 const note=practicalNode('p',practicalLabel('Material original, orientativ. Pentru obligații legale, fiscale, autorizări, siguranță sau meserii reglementate verifică sursele oficiale ale țării și specialiștii competenți.','Original training material. For legal, tax, licensing or safety requirements consult official local sources and qualified professionals.'));
 panel.append(note);
 const links=practicalNode('div','','lit-actions');
 const ref=practicalNode('a',practicalLabel('Sursa oficială de referință · țara selectată','Official reference · selected country'));ref.href=practicalCountry()[3];ref.target='_blank';ref.rel='noopener noreferrer';links.append(ref);
 if(course.id==='career'){const eu=practicalNode('a','Europass CV');eu.href='https://europass.europa.eu/en/create-europass-cv';eu.target='_blank';eu.rel='noopener noreferrer';links.append(eu)}
 panel.append(links);
 const progress=practicalNode('div','','practical-progress');progress.style.cssText='margin:12px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;';
 const mark=practicalButton(saved.completed?practicalLabel('✓ Lecție parcursă','✓ Lesson completed'):practicalLabel('○ Marchează lecția parcursă','○ Mark lesson completed'),()=>{const newStatus=!Boolean(practicalReadSaved().completed);practicalSave({completed:newStatus});mark.textContent=newStatus?practicalLabel('✓ Lecție parcursă','✓ Lesson completed'):practicalLabel('○ Marchează lecția parcursă','○ Mark lesson completed')});
 progress.append(mark,practicalButton(practicalLabel('🔊 Citește lecția','🔊 Read lesson'),()=>{if(state.speaking){stopSpeech();return}speakText(study.textContent||'')}));panel.append(progress);
 const practice=practicalNode('section','','practical-workspace');practice.style.cssText='margin-top:16px;border:1px solid #5d90a5;border-radius:13px;padding:12px;min-width:0;';
 practice.append(practicalNode('h3',practicalLabel('Atelier practic','Practice workshop')));
 const prompt=practicalNode('p');practice.append(prompt);
 const taskEntry=practicalNode('textarea','','lit-input');taskEntry.id='practicalAnswer';taskEntry.rows=5;taskEntry.maxLength=4000;taskEntry.style.cssText='display:block;width:100%;max-width:100%;min-height:120px;box-sizing:border-box;resize:vertical;';taskEntry.placeholder=practicalLabel('Scrie rezolvarea, pașii, observațiile sau o întrebare…','Write your solution, observations or question…');taskEntry.value=String(saved.draft||'').slice(0,4000);taskEntry.oninput=()=>practicalSave({draft:taskEntry.value});practice.append(taskEntry);
 const practiceButtons=practicalNode('div','','lit-actions');practiceButtons.style.cssText='display:flex;flex-wrap:wrap;gap:8px;';
 const status=practicalNode('p');status.id='practicalStatus';status.setAttribute('role','status');
 const output=practicalNode('div','','practical-ai-output');output.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;';
 const practiceVersion={value:0};
 function refreshExercise(){prompt.textContent=practicalLabel('Exercițiul ','Exercise ')+(practiceVersion.value+1)+'. '+chapter.practice[practiceVersion.value%chapter.practice.length]}
 refreshExercise();
 practiceButtons.append(practicalButton(practicalLabel('↻ Alt exercițiu','↻ Different exercise'),()=>{practiceVersion.value=(practiceVersion.value+1)%chapter.practice.length;refreshExercise()}));
 const talk=practicalButton(practicalLabel('🎙️ Dictare','🎙️ Dictation'),practicalDictate);talk.id='practicalDictation';talk.setAttribute('aria-pressed','false');practiceButtons.append(talk);
 const generate=async(mode)=>{
  if(practicalJourney.busy)return;
  if(mode==='review'&&!taskEntry.value.trim()){status.textContent=practicalLabel('Scrie mai întâi soluția sau explicația.','Enter your answer first.');;return}
  practicalJourney.busy=true;const serial=++practicalJourney.serial;const controller=new AbortController();practicalJourney.controller=controller;
  practiceButtons.querySelectorAll('[data-practical-ai]').forEach(b=>b.disabled=true);status.textContent=practicalLabel('Se pregătește răspunsul…','Preparing answer…');
  const started=Date.now(),task=mode==='review'?'Verifică răspunsul pe criterii explicite: corectitudine, siguranță, lacune și pași de îmbunătățire.':'Explică lecția și cazul practic, cu pași clari și exemple verificabile, în limba interfeței.';
  const question='Ești formator pentru un curs practic. Țara / jurisdicția: '+practicalCountry()[1]+'. Domeniu: '+course.ro+'. Nivel: '+chapter.level+'. Capitol: '+chapter.title+'. Material: '+chapter.theory+'. Metodă: '+chapter.method+'. Exemplu: '+chapter.caseStudy+'. Exercițiu: '+prompt.textContent+'. Răspuns elev: '+(taskEntry.value.trim().slice(0,2200)||'(fără răspuns)').trim()+'. Cerere: '+task+'. Limba dorită: '+(state.language||'ro')+'. Nu inventa legi, taxe, licențe, prețuri, autorizări sau certificări. Nu furniza instrucțiuni pentru lucrări periculoase fără profesionist; explică riscurile și măsuri generale de siguranță. Nu afirma că ai consultat sursa oficială în timp real. Nu acorda diplome. Răspunde educativ, structurat și concis.';
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module:'assistant',message:question,language:state.language,history:[]}),signal:controller.signal});
   const data=await response.json();if(!response.ok||data.status!=='success'||!data.reply)throw Error('unavailable');
   if(practicalJourney.serial!==serial||!output.isConnected)return;
   output.replaceChildren(practicalNode('h4',practicalLabel('Explicația asistentului','Assistant explanation')));
   if(typeof computingRenderAnswer==='function')computingRenderAnswer(output,String(data.reply).slice(0,50000));else output.append(practicalNode('p',String(data.reply).slice(0,50000)));
   status.textContent=practicalLabel('Răspuns în ','Response in ')+((Date.now()-started)/1000).toFixed(1)+' s.';
  }catch(e){if(serial===practicalJourney.serial)status.textContent=e?.name==='AbortError'?practicalLabel('Cerere anulată.','Request cancelled.'):practicalLabel('Asistentul nu este disponibil; lecția și testul local funcționează.','Assistant unavailable; offline lesson and quiz are ready.')}
  finally{if(serial===practicalJourney.serial){practicalJourney.busy=false;practicalJourney.controller=null;practiceButtons.querySelectorAll('[data-practical-ai]').forEach(b=>b.disabled=false)}}
 };
 for(const [mode,ro,en] of [['explain','📚 Explică pas cu pas','📚 Explain step by step'],['review','✓ Verifică soluția','✓ Review solution']]){const btn=practicalButton(practicalLabel(ro,en),()=>generate(mode),mode==='review'?'primary-btn':'secondary-btn');btn.dataset.practicalAi=mode;practiceButtons.append(btn)}
 practiceButtons.append(practicalButton(practicalLabel('Anulează','Cancel'),()=>{practicalStop();status.textContent=practicalLabel('Cerere anulată.','Request cancelled.');practiceButtons.querySelectorAll('[data-practical-ai]').forEach(b=>b.disabled=false)}));
 practice.append(practiceButtons,output,status);panel.append(practice);
 const assessment=practicalNode('section','','practical-assessment');assessment.id='practicalAssessment';assessment.style.cssText='margin-top:18px;min-width:0;scroll-margin-top:100px;';
 assessment.append(practicalNode('h3',practicalLabel('Test de verificare','Knowledge check')));
 const introduction=practicalNode('p',practicalLabel('5 întrebări din domeniu, cu prima întrebare din lecția curentă. Rezultatul este de antrenament, nu certificare.','Five questions across this subject, beginning with the current lesson. Practice score only, not a qualification.'));
 assessment.append(introduction);
 const questionHost=practicalNode('div');assessment.append(questionHost);
 const quizActions=practicalNode('div','','lit-actions'),result=practicalNode('div','','practical-result');quizActions.style.cssText='display:flex;gap:9px;flex-wrap:wrap;';
 let version=Number.isFinite(saved.lastVariant)?saved.lastVariant:0;
 function drawQuiz(){
  questionHost.replaceChildren();result.replaceChildren();
  const qs=practicalQuestions(course,chapter,version),selected=Array(qs.length).fill(null);
  qs.forEach((q,i)=>{
   const group=practicalNode('fieldset','','practical-question');group.style.cssText='margin:10px 0;border:1px solid #42718a;border-radius:10px;padding:10px;min-width:0;';
   group.append(practicalNode('legend',(i+1)+'. '+q.prompt));
   q.choices.forEach((choice,j)=>{const label=practicalNode('label');label.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:7px 0;min-height:35px;';const radio=practicalNode('input');radio.type='radio';radio.name='practical-q-'+i;radio.value=String(j);radio.onchange=()=>selected[i]=j;label.append(radio,document.createTextNode(choice));group.append(label)});
   questionHost.append(group);
  });
  quizActions.replaceChildren();
  const verify=practicalButton(practicalLabel('✓ Verifică testul','✓ Check answers'),()=>{
   if(selected.some(x=>x===null)){result.textContent=practicalLabel('Completează toate răspunsurile pentru a primi rezultatul.','Answer all questions before checking.');return}
   const correct=qs.reduce((n,q,i)=>n+(selected[i]===q.correct?1:0),0),pct=Math.round(correct/qs.length*100);
   result.replaceChildren(practicalNode('h4',practicalLabel('Rezultat: ','Result: ')+correct+'/'+qs.length+' ('+pct+'%)'));
   qs.forEach((q,i)=>result.append(practicalNode('p',(i+1)+'. '+(selected[i]===q.correct?'✓ ':'✗ ')+practicalLabel('Ai ales: ','Selected: ')+q.choices[selected[i]]+'. '+practicalLabel('Răspuns corect: ','Correct answer: ')+q.choices[q.correct]+'. '+q.explanation)));
   questionHost.querySelectorAll('input').forEach(x=>x.disabled=true);verify.disabled=true;
   practicalSave({lastScore:pct,lastCorrect:correct,lastTotal:qs.length,completed:true,lastVariant:version});
   const printableResult=practicalNode('div','','practical-printable');printableResult.append(result.cloneNode(true));panel.append(printableResult);
  },'primary-btn');
  const newQuiz=practicalButton(practicalLabel('＋ Test nou','＋ New practice'),()=>{version=(version+1)%Math.max(1,course.chapters.length-1);practicalSave({lastVariant:version});drawQuiz();assessment.scrollIntoView({block:'start',behavior:'smooth'})});
  quizActions.append(verify,newQuiz);
 }
 drawQuiz();assessment.append(quizActions,result);panel.append(assessment);
}
`;
