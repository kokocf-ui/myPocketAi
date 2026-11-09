export const PRACTICAL_UI_SCRIPT=String.raw`
// Practical education: country -> independent courses -> all lessons -> serious workbook.
// Every panel is local to Education. The public conversational pane remains hidden.
let practicalJourney={stage:'countries',country:'RO',course:'',chapter:'',variant:0,voice:false,serial:0,controller:null,busy:false};
function practicalNode(tag,text='',className=''){const element=document.createElement(tag);if(text)element.textContent=text;if(className)element.className=className;return element}
function practicalButton(text,fn,kind='secondary-btn'){const node=practicalNode('button',text,kind);node.type='button';node.onclick=fn;node.style.cssText='min-height:46px;max-width:100%;touch-action:manipulation;white-space:normal;overflow-wrap:anywhere;';return node}
function practicalLabel(ro,en){return typeof eduUiLabel==='function'?eduUiLabel(ro,en):learningLabel(ro,en)}
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
function practicalSpeechLocale(){
 const locales={ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'};
 return locales[state.language]||'en-GB';
}
function practicalResponseLanguage(){
 const names={ro:'română',en:'engleză',fr:'franceză',de:'germană',it:'italiană',es:'spaniolă',pt:'portugheză',nl:'neerlandeză',ru:'rusă',pl:'poloneză'};
 return names[state.language]||'engleză';
}
function practicalDictate(){
 if(practicalJourney.voice){practicalJourney.voice=false;pocketNativeVoiceSend({action:'stopListen'});document.getElementById('practicalDictation')?.setAttribute('aria-pressed','false');return}
 if(!pocketNativeVoiceAvailable()){const el=document.getElementById('practicalStatus');if(el)el.textContent=practicalLabel('Dictarea necesită aplicația Android.','Dictation requires the Android app.');return}
 stopSpeech();stopRecognition();practicalJourney.voice=true;document.getElementById('practicalDictation')?.setAttribute('aria-pressed','true');
 if(!pocketNativeVoiceSend({action:'listen',mode:'practicalCourses',language:practicalSpeechLocale()})){practicalJourney.voice=false;document.getElementById('practicalDictation')?.setAttribute('aria-pressed','false')}
}
function practicalBack(){
 practicalStop();if(state.speaking)stopSpeech();
 if(practicalJourney.stage==='courses'||practicalJourney.stage==='countries')return educationCountryGate('practical',()=>practicalOpen('courses'));
 const previous={countries:null,courses:'countries',chapters:'courses',lesson:'chapters'};
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
 const titles={countries:['Țara / sistemul de referință','Country / reference system'],courses:['Alege un curs practic','Choose a practical course'],chapters:['Toate capitolele cursului','All chapters in this course'],lesson:['Curs practic · lecție și aplicație','Practical course · lesson and application']};
 panel.append(practicalNode('h2',practicalLabel(...titles[stage])));host.append(panel);
 if(stage==='countries'){
  const c=practicalCountry();panel.append(practicalNode('p',practicalLabel('Selectează țara pentru surse oficiale, fără a presupune reguli locale unice.','Select a country for official sources; local laws are not universal.')));
  practicalList(panel,PRACTICAL_COUNTRIES_DATA.map(v=>({id:v[0],ro:v[1],en:v[2]})),choice=>{practicalJourney.country=choice.id;practicalJourney.course='';practicalJourney.chapter='';practicalOpen('courses')});return;
 }
 panel.append(practicalNode('p',practicalLabel(practicalCountry()[1],practicalCountry()[2])));
 if(stage==='courses'){
  practicalList(panel,PRACTICAL_COURSES_DATA.map(c=>({id:c.id,icon:c.icon,ro:c.ro+' — '+c.summary,en:c.en})),choice=>{practicalJourney.course=choice.id;practicalJourney.chapter='';practicalOpen('chapters')});return;
 }
 const course=practicalCourse();if(!course){practicalOpen('courses');return}
 panel.append(practicalNode('p',practicalLabel(course.ro,course.en)));
 if(stage==='chapters'){
  const chapters=[...course.chapters].sort((a,b)=>a.order-b.order);
  const finished=chapters.filter(x=>practicalSavedForChapter(x.id)?.completed).length;
  const progress=practicalNode('p',practicalLabel('Curs cu ','Course with ')+chapters.length+practicalLabel(' capitole. Parcurse: ',' chapters. Completed: ')+finished+'/'+chapters.length+'. '+practicalLabel('Alege orice capitol.','Choose any chapter.'));
  panel.append(progress);
  const syllabus=PRACTICAL_SYLLABI_DATA.find(x=>x.id===course.id);
  if(syllabus){
    const intro=practicalNode('section','','practical-course-syllabus');intro.style.cssText='border:1px solid #547e91;border-radius:12px;padding:12px;margin:12px 0;line-height:1.55;';
    intro.append(practicalNode('h3',practicalLabel('Ce conține acest curs','Course overview')),practicalNode('p',syllabus.intro));
    intro.append(practicalNode('h4',practicalLabel('Ce vei ști să faci la final','What you will be able to do')));
    const outcomes=practicalNode('ul');outcomes.style.paddingLeft='23px';syllabus.outcomes.forEach(item=>outcomes.append(practicalNode('li',item)));intro.append(outcomes);
    intro.append(practicalNode('p',practicalLabel('Cunoștințe necesare: ','Prerequisites: ')+syllabus.prerequisite));
    panel.append(intro);
  }
  practicalList(panel,chapters.map((x,i)=>({id:x.id,ro:(i+1)+'. '+x.title+(practicalSavedForChapter(x.id)?.completed?' ✓':''),en:(i+1)+'. '+x.title})),choice=>{practicalJourney.chapter=choice.id;practicalJourney.variant=0;practicalOpen('lesson')});
  if(syllabus){
    const project=practicalNode('section','','practical-course-project');project.style.cssText='border:1px solid #7da7a3;border-radius:12px;padding:12px;margin:14px 0;line-height:1.55;';
    project.append(practicalNode('h3',practicalLabel('Proiect final de curs','Final course project')),practicalNode('p',syllabus.project));
    project.append(practicalNode('h4',practicalLabel('Criterii de evaluare','Assessment criteria')));
    const criteria=practicalNode('ol');criteria.style.paddingLeft='23px';syllabus.rubric.forEach(item=>criteria.append(practicalNode('li',item)));project.append(criteria);
    panel.append(project);
  }
  return;
 }
 if(stage==='lesson')practicalLesson(panel);
}
function practicalSavedForChapter(id){
 try{const key=['mypocketai.practical.v1',practicalJourney.country,practicalJourney.course,id].join('.');return JSON.parse(localStorage.getItem(key)||'{}')}catch{return null}
}
function practicalQuestions(course,chapter,variant){
 const peers=course.chapters.filter(x=>x.id!==chapter.id&&Math.abs(x.order-chapter.order)===1);
 const others=course.chapters.filter(x=>x.id!==chapter.id&&!peers.includes(x));
 const tail=[...peers,...others];const shift=tail.length?((variant%tail.length)+tail.length)%tail.length:0;
 const items=[chapter,...tail.slice(shift),...tail.slice(0,shift)].slice(0,5);
 return items.map((x,index)=>{const rotation=(index+variant+1)%4,q=x.question,choices=[...q.choices.slice(4-rotation),...q.choices.slice(0,4-rotation)];return {...q,choices,correct:(q.correct+rotation)%4,chapterId:x.id,title:x.title}});
}

function practicalCvWorkshop(panel){
 const wrap=practicalNode('section','','practical-cv-workshop');
 wrap.style.cssText='margin:18px 0;padding:14px;border:1px solid #66a1a9;border-radius:12px;min-width:0;';
 wrap.append(practicalNode('h3',practicalLabel('📝 Construiește propriul CV','📝 Build your own CV')));
 wrap.append(practicalNode('p',practicalLabel('Completează numai experiențe reale. Acest editor nu completează automat informații și nu salvează datele tale de contact în istoricul lecției.','Enter only real experience. This editor does not invent information or store contact details in your lesson history.')));
 const form=practicalNode('div','','practical-cv-fields');form.style.cssText='display:grid;grid-template-columns:1fr;gap:12px;min-width:0;';
 const cfg=[
 ['name','Nume și prenume','Full name',false],['city','Oraș (fără adresă completă)','City (not full address)',false],
 ['email','E-mail profesional','Professional email',false],['phone','Telefon de contact','Contact phone',false],
 ['role','Postul dorit','Target position',false],['profile','Profil profesional – 2–4 fraze','Profile – 2–4 sentences',true],
 ['experience','Experiență reală – rol, angajator, perioadă și realizări','Real experience – role, employer, dates and achievements',true],
 ['education','Studii și calificări obținute','Education and qualifications actually achieved',true],
 ['skills','Competențe relevante și demonstrabile','Relevant, demonstrable skills',true],
 ['languages','Limbi cunoscute și nivel realist','Languages and accurate proficiency',true]
 ];
 const fields={};
 cfg.forEach(([key,ro,en,multi])=>{const label=practicalNode('label',practicalLabel(ro,en),'lit-label');label.style.cssText='display:flex;flex-direction:column;gap:5px;';
 const input=practicalNode(multi?'textarea':'input','','lit-input');if(!multi)input.type='text';else input.rows=multi===true?3:2;
 input.maxLength=key==='experience'?5000:key==='profile'?1200:1900;input.autocomplete='off';
 input.style.cssText='width:100%;min-width:0;max-width:100%;box-sizing:border-box;font-size:16px;';label.append(input);form.append(label);fields[key]=input;
 });wrap.append(form);
 const status=practicalNode('p');status.setAttribute('role','status');
 const preview=practicalNode('article','','practical-cv-preview');preview.style.cssText='display:none;margin-top:16px;padding:14px;background:rgba(11,48,65,.5);border:1px solid #6193a4;border-radius:9px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5;';
 const documentForCv=()=>{
  const val=k=>String(fields[k]?.value||'').trim();
  const name=val('name'),role=val('role');
  if(!name||!role){status.textContent=practicalLabel('Completează cel puțin numele și postul pentru care aplici.','Enter at least your name and target role.');return null}
  const chunks=[name.toUpperCase(),[val('city'),val('phone'),val('email')].filter(Boolean).join(' | '),'',practicalLabel('POST VIZAT','TARGET ROLE'),role,''];
  for(const [key,ro,en] of [['profile','PROFIL PROFESIONAL','PERSONAL PROFILE'],['experience','EXPERIENȚĂ PROFESIONALĂ','WORK EXPERIENCE'],['education','STUDII ȘI CALIFICĂRI','EDUCATION AND QUALIFICATIONS'],['skills','COMPETENȚE','SKILLS'],['languages','LIMBI','LANGUAGES']]){
    if(val(key))chunks.push(practicalLabel(ro,en),val(key),'');
  }
  const title='CV_'+name.replace(/[^a-zA-Z0-9À-ž _-]/g,'').replace(/\s+/g,'_').slice(0,42)+'_'+role.replace(/[^a-zA-Z0-9À-ž _-]/g,'').replace(/\s+/g,'_').slice(0,35);
  return {title,text:chunks.join('\n').trim()};
 };
 const actions=practicalNode('div','','lit-actions');actions.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;';
 const build=practicalButton(practicalLabel('✓ Creează previzualizarea CV','✓ Build CV preview'),()=>{
  const doc=documentForCv();if(!doc)return;
  preview.textContent=doc.text;preview.style.display='block';preview.dataset.ready='true';
  status.textContent=practicalLabel('Verifică toate informațiile. Exemplul fictiv de mai sus nu a fost inclus în CV.','Review every entry. The fictional example above was not inserted into your CV.');
 },'primary-btn');
 const exportCv=mode=>{const doc=documentForCv();if(!doc)return;preview.textContent=doc.text;preview.style.display='block';preview.dataset.ready='true';eduOpenPrint(mode,doc)};
 const pdfSave=practicalButton('💾',()=>exportCv('save'),'secondary-btn edu-icon-action edu-icon-save');
 pdfSave.title=practicalLabel('Salvează CV PDF','Save CV as PDF');pdfSave.setAttribute('aria-label',pdfSave.title);
 const pdfPrint=practicalButton('🖨',()=>exportCv('print'),'secondary-btn edu-icon-action edu-icon-print');
 pdfPrint.title=practicalLabel('Imprimă CV','Print CV');pdfPrint.setAttribute('aria-label',pdfPrint.title);
 const pdfActions=practicalNode('div','','edu-pdf-actions');
 pdfActions.setAttribute('role','group');pdfActions.setAttribute('aria-label',practicalLabel('Salvează și imprimă CV','Save and print CV'));
 pdfActions.append(pdfSave,pdfPrint);actions.classList.add('practical-cv-actions');
 actions.append(build,pdfActions);
 wrap.append(actions,status,preview);panel.append(wrap);
}

function practicalLesson(panel){
 const course=practicalCourse(),chapter=practicalChapter();if(!course||!chapter){practicalOpen('chapters');return}
 const saved=practicalReadSaved();
 const guide=PRACTICAL_GUIDES_DATA[chapter.id]||null;
 const deep=PRACTICAL_DEPTH_DATA[chapter.id]||[];
 const syllabus=PRACTICAL_SYLLABI_DATA.find(x=>x.id===course.id)||null;
 const translatableNodes=[];
 const practicalMaterial=(tag,txt,cls='')=>{const node=practicalNode(tag,txt,cls);translatableNodes.push(node);return node};
 const study=practicalNode('article','','practical-printable');study.style.cssText='display:block;min-width:0;max-width:100%;line-height:1.5;';
 study.append(practicalMaterial('h3',chapter.title));
 const meta=practicalLabel(practicalCountry()[1],practicalCountry()[2])+' · '+practicalLabel(course.ro,course.en)+' · '+practicalLabel('Capitolul ','Chapter ')+chapter.order+'/'+course.chapters.length;
 study.append(practicalNode('p',meta));
 if(guide?.goal){study.append(practicalNode('h4',practicalLabel('Ce vei învăța','Learning objective')),practicalMaterial('p',guide.goal))}
 study.append(practicalNode('h4',practicalLabel('Noțiuni de bază','Core concepts')),practicalMaterial('p',chapter.theory));
 if(deep.length){
   study.append(practicalNode('h3',practicalLabel('Lecția explicată în profunzime','In-depth learning material')));
   deep.forEach(([heading,body])=>{study.append(practicalMaterial('h4',heading),practicalMaterial('p',body))});
 }
 const steps=guide?.steps||[chapter.method];
 study.append(practicalNode('h4',practicalLabel('Ghid pas cu pas','Step-by-step guide')));
 const ordered=practicalNode('ol');ordered.style.cssText='padding-left:23px;line-height:1.55;';
 steps.forEach(t=>ordered.append(practicalMaterial('li',t)));study.append(ordered);
 study.append(practicalNode('h4',practicalLabel('Model complet lucrat','Complete worked example')));
 const example=practicalMaterial('div',guide?.model?.join('\n')||chapter.caseStudy,'practical-worked-model');
 example.style.cssText='white-space:pre-wrap;line-height:1.65;overflow-wrap:anywhere;padding:12px;border:1px solid #527c8c;border-radius:10px;background:rgba(3,30,49,.42);';
 study.append(example);
 if(guide?.check?.length){study.append(practicalNode('h4',practicalLabel('Verifică înainte de a continua','Check before continuing')));const ul=practicalNode('ul');ul.style.paddingLeft='22px';guide.check.forEach(item=>ul.append(practicalMaterial('li',item)));study.append(ul)}
 study.append(practicalNode('h4',practicalLabel('Exerciții legate de această lecție','Exercises for this lesson')));
 (guide?.exercise||chapter.practice).forEach((task,i)=>study.append(practicalMaterial('p',(i+1)+'. '+task)));
 if(chapter.order===course.chapters.length&&syllabus){
   study.append(practicalNode('h3',practicalLabel('Proiectul de absolvire al cursului','Course completion project')),practicalMaterial('p',syllabus.project));
   study.append(practicalNode('h4',practicalLabel('Criterii de verificare a proiectului','Project review criteria')));
   const criteria=practicalNode('ol');criteria.style.paddingLeft='23px';syllabus.rubric.forEach(item=>criteria.append(practicalMaterial('li',item)));study.append(criteria);
 }
 panel.append(study);
 // Translate the authored lesson, not user input, buttons or official source URLs.
 if(state.language!=='ro'&&typeof eduTranslateMaterial==='function'&&translatableNodes.length){
  const chapterAtOpen=chapter.id,languageAtOpen=state.language;
  const notice=practicalNode('p',practicalLabel('Se traduce lecția…','Translating the lesson…'));
  notice.className='practical-translation-status';notice.setAttribute('role','status');panel.append(notice);
  const groups=[],maxChars=3200;
  let group=[],length=0;
  for(const node of translatableNodes){
   const value=node.textContent||'';
   if(group.length&&length+value.length>maxChars){groups.push(group);group=[];length=0}
   group.push(node);length+=value.length;
  }
  if(group.length)groups.push(group);
  (async()=>{
   const results=[];
   for(let i=0;i<groups.length;i++){
    const original={};
    groups[i].forEach((node,j)=>{original['text'+j]=node.textContent||''});
    const translation=await eduTranslateMaterial(original,'practical:'+chapter.id+':'+i);
    if(!translation)return null;
    results.push(translation);
   }
   return results;
  })().then(results=>{
   if(!study.isConnected||practicalJourney.chapter!==chapterAtOpen||state.language!==languageAtOpen)return;
   if(results){
    groups.forEach((nodes,i)=>nodes.forEach((node,j)=>{node.textContent=results[i]['text'+j]}));
    notice.textContent='';
   }else notice.textContent=practicalLabel('Traducerea nu este disponibilă. Este afișat textul original.','Translation unavailable. The original text is shown.');
  }).catch(()=>{
   if(study.isConnected)notice.textContent=practicalLabel('Traducerea nu este disponibilă. Este afișat textul original.','Translation unavailable. The original text is shown.');
  });
 }
 if(chapter.id==='career-2')practicalCvWorkshop(panel);
 const note=practicalNode('p',practicalLabel('Material original, orientativ. Pentru obligații legale, fiscale, autorizări, siguranță sau meserii reglementate verifică sursele oficiale ale țării și specialiștii competenți.','Original training material. For legal, tax, licensing or safety requirements consult official local sources and qualified professionals.'));
 panel.append(note);
 const links=practicalNode('section','','practical-topic-sources');links.style.cssText='margin:12px 0;display:flex;flex-direction:column;gap:8px;';
 const sourceMap=PRACTICAL_REFERENCES_DATA[course.id]||{};
 let references=[];
 if(course.id==='daily'){
   if(chapter.id==='daily-2'&&sourceMap.shopping)references=[sourceMap.shopping];
   else if(chapter.id==='daily-4'&&sourceMap[practicalJourney.country+'-food'])references=[sourceMap[practicalJourney.country+'-food']];
 }else if(course.id==='career'){
   if(chapter.id==='career-2')references=[sourceMap.general,sourceMap[practicalJourney.country]].filter(Boolean);
   else if(chapter.id==='career-5')references=[];
   else if(sourceMap[practicalJourney.country])references=[sourceMap[practicalJourney.country]];
 }else if(course.id==='trades'){
   if(chapter.id==='trades-1'||chapter.id==='trades-4')references=[{title:'BIPM — Sistemul internațional de unități (SI)',url:'https://www.bipm.org/en/measurement-units',scope:'Global measurement units'}];
   else if(chapter.id==='trades-2')references=[sourceMap[practicalJourney.country]||sourceMap.general].filter(Boolean);
 }else if(course.id==='business'){
   if(chapter.id==='business-5'||chapter.id==='business-1'&&practicalJourney.country.startsWith('GB-'))
      references=[sourceMap[practicalJourney.country]||sourceMap.general].filter(Boolean);
 }else references=[sourceMap[practicalJourney.country]||sourceMap.general].filter(Boolean);
 if(references.length){
   links.append(practicalNode('h4',practicalLabel('Resurse oficiale relevante pentru acest subiect','Relevant official resources for this subject')));
   const used=new Set();
   references.forEach(ref=>{if(!ref?.url?.startsWith('https://')||used.has(ref.url))return;used.add(ref.url);
     const a=practicalNode('a',ref.title);a.href=ref.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});
   links.append(practicalNode('p',practicalLabel('Sursele ajută la verificare, dar nu certifică această lecție. Verifică regulile țării și anul curent.','These links provide reference material, not certification. Check local rules and current dates.')));
 }else links.append(practicalNode('p',practicalLabel('Nu există o sursă oficială verificată care să corespundă exact acestei lecții; nu afișăm un link fără legătură.','No verified official source for this exact lesson; unrelated links are omitted.')));
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
 const focusedExercises=guide?.exercise||chapter.practice;
 function refreshExercise(){prompt.textContent=practicalLabel('Exercițiul ','Exercise ')+(practiceVersion.value+1)+'. '+focusedExercises[practiceVersion.value%focusedExercises.length]}
 refreshExercise();
 practiceButtons.append(practicalButton(practicalLabel('↻ Alt exercițiu','↻ Different exercise'),()=>{practiceVersion.value=(practiceVersion.value+1)%focusedExercises.length;refreshExercise()}));
 const talk=practicalButton(practicalLabel('🎙️ Dictare','🎙️ Dictation'),practicalDictate);talk.id='practicalDictation';talk.setAttribute('aria-pressed','false');practiceButtons.append(talk);
 const generate=async(mode)=>{
  if(practicalJourney.busy)return;
  if(mode!=='review'&&taskEntry.value.trim()&&eduScopeBeforeAI(taskEntry.value.trim(),()=>generate(mode)))return;
  if(mode==='review'&&!taskEntry.value.trim()){status.textContent=practicalLabel('Scrie mai întâi soluția sau explicația.','Enter your answer first.');;return}
  practicalJourney.busy=true;const serial=++practicalJourney.serial;const controller=new AbortController();practicalJourney.controller=controller;
  practiceButtons.querySelectorAll('[data-practical-ai]').forEach(b=>b.disabled=true);status.textContent=practicalLabel('Se pregătește răspunsul…','Preparing answer…');
  const started=Date.now(),task=mode==='review'?'Verifică răspunsul pe criterii explicite: corectitudine, siguranță, lacune și pași de îmbunătățire.':'Explică lecția și cazul practic, cu pași clari și exemple verificabile, în limba interfeței.';
  const question='Ești formator pentru un curs practic. Țara / jurisdicția: '+practicalCountry()[1]+'. Domeniu: '+course.ro+'. Capitol: '+chapter.title+'. Material: '+chapter.theory+'. Metodă: '+chapter.method+'. Exemplu: '+(guide?.model?.join(' / ')||chapter.caseStudy).slice(0,3500)+'. Pași din lecție: '+(guide?.steps?.join(' / ')||chapter.method).slice(0,3000)+'. Exercițiu: '+prompt.textContent+'. Răspuns elev: '+(taskEntry.value.trim().slice(0,2200)||'(fără răspuns)').trim()+'. Cerere: '+task+'. Limba dorită: '+practicalResponseLanguage()+'. Formulează natural și corect gramatical, fără traduceri literale sau termeni englezești românizați artificial; păstrează terminologia tehnică consacrată. Nu inventa legi, taxe, licențe, prețuri, autorizări sau certificări. Nu furniza instrucțiuni pentru lucrări periculoase fără profesionist; explică riscurile și măsuri generale de siguranță. Nu afirma că ai consultat sursa oficială în timp real. Nu acorda diplome. Răspunde educativ, structurat și concis.';
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module:'assistant',message:eduScopePrompt(question),language:state.language,history:[]}),signal:controller.signal});
   const data=await response.json();if(!response.ok||data.status!=='success'||!data.reply)throw Error('unavailable');
   if(practicalJourney.serial!==serial||!output.isConnected)return;
   if(eduScopeReplyRouted(data.reply,taskEntry.value.trim(),()=>generate(mode))){status.textContent='';return}
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
 const quizLanguageNotice=practicalNode('p');quizLanguageNotice.setAttribute('role','status');assessment.append(quizLanguageNotice);
 const quizActions=practicalNode('div','','lit-actions'),result=practicalNode('div','','practical-result');quizActions.style.cssText='display:flex;gap:9px;flex-wrap:wrap;';
 let version=Number.isFinite(saved.lastVariant)?saved.lastVariant:0;
 function drawQuiz(){
  questionHost.replaceChildren();result.replaceChildren();
  const qs=practicalQuestions(course,chapter,version),selected=Array(qs.length).fill(null);
  const quizRefs=[],displayChoices=qs.map(q=>[...q.choices]),displayExplanations=qs.map(q=>q.explanation);
  quizLanguageNotice.textContent='';
  qs.forEach((q,i)=>{
   const group=practicalNode('fieldset','','practical-question');group.style.cssText='margin:10px 0;border:1px solid #42718a;border-radius:10px;padding:10px;min-width:0;';
   const legend=practicalNode('legend',(i+1)+'. '+q.prompt);group.append(legend);
   const choiceTexts=[];
   q.choices.forEach((choice,j)=>{const label=practicalNode('label');label.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:7px 0;min-height:35px;';const radio=practicalNode('input');radio.type='radio';radio.name='practical-q-'+i;radio.value=String(j);radio.onchange=()=>selected[i]=j;const choiceText=document.createTextNode(choice);label.append(radio,choiceText);choiceTexts.push(choiceText);group.append(label)});
   quizRefs.push({legend,choiceTexts});
   questionHost.append(group);
  });
  quizActions.replaceChildren();
  const verify=practicalButton(practicalLabel('✓ Verifică testul','✓ Check answers'),()=>{
   if(selected.some(x=>x===null)){result.textContent=practicalLabel('Completează toate răspunsurile pentru a primi rezultatul.','Answer all questions before checking.');return}
   const correct=qs.reduce((n,q,i)=>n+(selected[i]===q.correct?1:0),0),pct=Math.round(correct/qs.length*100);
   result.replaceChildren(practicalNode('h4',practicalLabel('Rezultat: ','Result: ')+correct+'/'+qs.length+' ('+pct+'%)'));
   qs.forEach((q,i)=>result.append(practicalNode('p',(i+1)+'. '+(selected[i]===q.correct?'✓ ':'✗ ')+practicalLabel('Ai ales: ','Selected: ')+displayChoices[i][selected[i]]+'. '+practicalLabel('Răspuns corect: ','Correct answer: ')+displayChoices[i][q.correct]+'. '+displayExplanations[i])));
   questionHost.querySelectorAll('input').forEach(x=>x.disabled=true);verify.disabled=true;
   practicalSave({lastScore:pct,lastCorrect:correct,lastTotal:qs.length,completed:true,lastVariant:version});
   // The result is already shown once in .practical-result and collected by PDF export. Do not add a second visible copy.
  },'primary-btn');
  const newQuiz=practicalButton(practicalLabel('＋ Test nou','＋ New practice'),()=>{version=(version+1)%Math.max(1,course.chapters.length-1);practicalSave({lastVariant:version});drawQuiz();assessment.scrollIntoView({block:'start',behavior:'smooth'})});
  quizActions.append(verify,newQuiz);
  if(state.language!=='ro'&&typeof eduTranslateMaterial==='function'){
   const expectedVersion=version,expectedLanguage=state.language;
   quizLanguageNotice.textContent=practicalLabel('Se traduce testul…','Translating the test…');
   questionHost.querySelectorAll('input').forEach(x=>x.disabled=true);verify.disabled=true;
   const originals={};
   qs.forEach((q,i)=>{
    originals['q'+i]=q.prompt;
    if(q.explanation)originals['e'+i]=q.explanation;
    q.choices.forEach((choice,j)=>{originals['c'+i+'_'+j]=choice});
   });
   Promise.resolve(eduTranslateMaterial(originals,'practicalQuiz:'+course.id+':'+chapter.id+':'+expectedVersion)).then(localized=>{
    if(!quizRefs[0]?.legend.isConnected||expectedVersion!==version||state.language!==expectedLanguage)return;
    if(localized){
     qs.forEach((q,i)=>{
      quizRefs[i].legend.textContent=(i+1)+'. '+localized['q'+i];
      if(q.explanation)displayExplanations[i]=localized['e'+i];
      q.choices.forEach((choice,j)=>{
       displayChoices[i][j]=localized['c'+i+'_'+j];
       quizRefs[i].choiceTexts[j].textContent=displayChoices[i][j];
      });
     });
     quizLanguageNotice.textContent='';
    }else quizLanguageNotice.textContent=practicalLabel('Traducerea nu este disponibilă. Este afișat textul original.','Translation unavailable. The original text is shown.');
    questionHost.querySelectorAll('input').forEach(x=>x.disabled=false);verify.disabled=false;
   }).catch(()=>{
    if(!quizRefs[0]?.legend.isConnected)return;
    quizLanguageNotice.textContent=practicalLabel('Traducerea nu este disponibilă. Este afișat textul original.','Translation unavailable. The original text is shown.');
    questionHost.querySelectorAll('input').forEach(x=>x.disabled=false);verify.disabled=false;
   });
  }
 }
 drawQuiz();assessment.append(quizActions,result);panel.append(assessment);
}
`;
