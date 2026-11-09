// Country-aware lesson reader, preserving in-module navigation and the
// grade/country selection. A chapter outline is not marked as a full lesson.
import {EDUCATION_BIBLIOGRAPHY_DATA} from './education_bibliography_catalog.mjs';
export const EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT=String.raw`
const EDUCATION_BIBLIOGRAPHY_IN_APP=${JSON.stringify(EDUCATION_BIBLIOGRAPHY_DATA)};
function educationBibliographyForRuntime(country,subject,grade){
 const c=String(country||'').toUpperCase(),s=String(subject||'').toLowerCase();
 const alias={math:'mathematics',science:'biology',computer:'computing'};
 const name=alias[s]||s,match=String(grade||'').match(/\\d+/);
 const year=match?Number(match[0]):0;
 if(year<1||year>20)return [];
 return (EDUCATION_BIBLIOGRAPHY_IN_APP[c]||[]).filter(r=>
  year>=r.min&&year<=r.max&&(r.subjects.includes(name)||r.subjects.includes('*'))
 );
}

function educationInternationalOpen(subject,level,grade,onBack){
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 const code=educationCountrySelection.code||'WORLD',countryName=educationCountrySelection.label||code;
 let rows=worldwideStudyChapters(code,subject,level,grade,countryName,countryName,HG_SCHOOL_GENERAL_DATA);
 if(!rows.length){if(typeof onBack==='function')onBack();return}
 root.classList.add('learning-intl-curriculum');
 host.replaceChildren();
 const mk=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e};
 const local=(ro,en)=>state.language==='ro'?ro:en;
 const toolbar=mk('div','','education-toolbar');
 const back=mk('button',local('← Înapoi','← Back'),'secondary-btn');back.type='button';
 toolbar.append(back);if(typeof eduAttachPrintAction==='function')eduAttachPrintAction(toolbar);host.append(toolbar);
 const panel=mk('section','','math-choice-panel science-choice-panel edu-intl-programme');
 panel.style.cssText='width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow-y:auto;overscroll-behavior:contain;padding:12px 14px 18px;';
 const title=mk('h2',local('Programa de studiu','Study programme')+' · '+countryName);
 title.style.cssText='font-size:1.08rem;margin:0 0 8px;';
 const detail=mk('p',local('Clasa: ','Year: ')+String(grade||'')+' · '+local('Nivel: ','Level: ')+String(level||''));
 detail.style.cssText='font-size:.88em;margin:0 0 7px;';
 const advisory=mk('p',local('Programă orientativă; nu este o listă oficială de capitole obligatorii.','Advisory learning path, not an official list of compulsory chapters.'));
 advisory.style.cssText='font-size:.82em;line-height:1.35;opacity:.84;margin:0 0 10px;';
 panel.append(title,detail,advisory);
 // Stable source bibliography is shown BEFORE optional AI explanations.
 // A curriculum reference is not an assertion that app lessons are statutory.
 const offlineReferences=educationBibliographyForRuntime(code,subject,grade);
 if(offlineReferences.length){
  const bibliography=mk('details','','edu-intl-bibliography');
  bibliography.style.cssText='margin:0 0 10px;padding:7px 9px;border:1px solid var(--border-color,#667);border-radius:9px;';
  bibliography.append(mk('summary',local('Biblioteca și sursele materiei','Subject library and sources')));
  for(const entry of offlineReferences){
   const row=mk('div','','edu-intl-bibliography-row');row.style.cssText='margin:9px 0;';
   const a=mk('a',local(entry.ro,entry.en));a.href=entry.url;
   a.target='_blank';a.rel='noopener noreferrer';
   a.style.cssText='display:block;overflow-wrap:anywhere;font-size:.88em;';
   const note=mk('p',local(entry.noteRo,entry.noteEn));
   note.style.cssText='font-size:.76em;opacity:.82;line-height:1.4;margin:3px 0 0;';
   row.append(a,note);bibliography.append(row);
  }
  panel.append(bibliography);
 }
 const url=NATIONAL_UNIT_SOURCES?.[code];
 if(url){
  const a=mk('a',local('Sursă educațională','Education source'));a.href=url;a.target='_blank';a.rel='noopener noreferrer';
  a.style.cssText='display:block;margin:0 0 10px;font-size:.85em;';panel.append(a);
 }
 const search=mk('input');search.type='search';search.className='lit-input';
 search.placeholder=local('Caută de la prima literă…','Search from the first letter…');
 search.setAttribute('aria-label',search.placeholder);search.style.cssText='width:100%;max-width:100%;box-sizing:border-box;min-height:46px;font-size:16px;';
 const list=mk('div','','edu-intl-chapter-list');list.style.cssText='display:flex;flex-direction:column;gap:6px;margin:8px 0;';
 const reader=mk('article','','edu-intl-reader');reader.style.cssText='display:none;min-width:0;max-width:100%;overflow-wrap:anywhere;';
 panel.append(search,list,reader);host.append(panel);
 const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 let page=0,selected=null,serial=0;
 function chapterList(){
  serial++;selected=null;reader.replaceChildren();reader.style.display='none';
  search.style.display='block';list.style.display='flex';draw();
 }
 back.onclick=()=>{
  if(selected){chapterList();return}
  root.classList.remove('learning-intl-curriculum');serial++;
  if(typeof onBack==='function')onBack();
 };
 function show(item){
  selected=item;serial++;const token=serial;
  list.style.display='none';search.style.display='none';reader.style.display='block';reader.replaceChildren();
  const national=educationLocalContext(code,subject);
  const nationalLesson=item[0].startsWith('national-');
  const sourcedLesson=item[0].startsWith('sourced-');
  const lessonTitle=mk('h3',local(item[1],item[2]));lessonTitle.style.cssText='font-size:1rem;margin:5px 0 8px;';
  reader.append(lessonTitle);
  const status=mk('p','','edu-intl-reader-status');status.style.cssText='font-size:.82em;opacity:.8;';
  const prose=mk('div','','edu-intl-prose');prose.style.cssText='line-height:1.5;white-space:normal;';
  const source=(nationalLesson&&national)?{
   title:item[1],
   explanation:national.ro,
   focus:item[3],
   activity:national.activityRo
  }:{
   title:item[1],explanation:item[3],
   focus:local('Obiectiv orientativ de studiu','Advisory learning objective'),
   activity:subject==='history'?'Construiește o cronologie și compară două izvoare datate.':
    subject==='geography'?'Interpretează o hartă și compară date pentru două locuri.':
    subject==='literature'?'Analizează un text și susține două interpretări prin exemple.':
    'Rezolvă un exemplu concret, explică metoda și verifică rezultatul.'
  };
  function content(data,fromTranslation=false){
   if(!reader.isConnected||serial!==token)return;
   prose.replaceChildren();
   const heading=mk('h4',nationalLesson&&national?local('Contextul țării · introducere','Country context · introduction'):local('Obiective și explicații orientative','Advisory objectives and notes'));heading.style.cssText='margin:9px 0 4px;';
   const explanation=mk('p',data.explanation);explanation.style.cssText='margin:0 0 10px;';
   const objectiveHeading=mk('h4',local('Obiectivul lecției','Lesson objective'));objectiveHeading.style.cssText='margin:9px 0 4px;';
   const objective=mk('p',data.focus);objective.style.cssText='margin:0 0 10px;';
   const exerciseHeading=mk('h4',local('Exercițiu practic','Practice activity'));exerciseHeading.style.cssText='margin:9px 0 4px;';
   const exercise=mk('p',data.activity);exercise.style.cssText='margin:0 0 10px;';
   prose.append(heading,explanation,objectiveHeading,objective,exerciseHeading,exercise);
   const check=mk('button',local('✓ Am parcurs lecția','✓ I have studied this lesson'),'secondary-btn');
   check.type='button';check.style.cssText='max-width:100%;min-height:44px;margin:8px 0;';
   const feedback=mk('p','','edu-intl-feedback');
   check.onclick=()=>{
    const key='pocket-intl-progress-'+code+'-'+subject+'-'+level+'-'+grade;
    try{const state=JSON.parse(localStorage.getItem(key)||'{}');state[item[0]]=new Date().toISOString();localStorage.setItem(key,JSON.stringify(state))}catch{}
    feedback.textContent=local('Lecție marcată ca parcursă. Verifică răspunsul la exercițiu înainte de următorul capitol.',
     'Lesson marked as studied. Check your exercise answer before the next chapter.');
   };
   const selfReview=mk('details','','edu-intl-self-check');
   const reviewSummary=mk('summary',local('Cum verific răspunsul?','How to review my answer'));
   const reviewText=mk('p',local(
    'Verifică dacă ai explicat ideea principală, ai prezentat un exemplu concret, ai folosit surse cu dată și ai delimitat ce nu este cunoscut. Acesta este un ghid de autoevaluare, nu un punctaj automat.',
    'Check that you explained the main idea, gave a concrete example, used dated evidence and identified what remains uncertain. This is self-review guidance, not an automatic grade.'));
   reviewText.style.cssText='font-size:.91em;line-height:1.5;';
   selfReview.append(reviewSummary,reviewText);
   prose.append(selfReview,check,feedback);
   if(!nationalLesson||!national){
    const note=mk('p',local('Acest material este un plan de studiu orientativ, nu o lecție națională verificată integral.',
     'This is an advisory study outline, not a fully verified national lesson.'));
    note.style.cssText='font-size:.85em;opacity:.85;margin:7px 0;';prose.prepend(note);
   }
   status.textContent=fromTranslation?'':state.language==='ro'?'':local('','');
  }
  reader.append(status,prose);
  // A full sourced explanation is fetched only when the student chooses to
  // open it. This avoids spending the free AI quota for every chapter preview.
  const detailed=mk('button',local('✨ Ajutor AI: explicații suplimentare','✨ Optional AI explanation'),'primary-btn');
  detailed.type='button';detailed.style.cssText='min-height:44px;max-width:100%;margin:7px 0 9px;';
  reader.append(detailed);
  detailed.onclick=async()=>{
   if(!CLIENT_CONFIG?.apiUrl)return;
   detailed.disabled=true;status.textContent=local('Se caută sursele pentru lecție…','Finding lesson sources…');
   try{
    const endpoint=new URL(CLIENT_CONFIG.apiUrl);
    endpoint.pathname='/api/education-country-lesson';endpoint.search='';
    const response=await fetch(endpoint.toString(),{
     method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({country:code,subject,level,grade,topic:item[2],language:state.language})
    });
    const data=response.ok?await response.json():null;
    if(serial!==token||!reader.isConnected)return;
    if(data?.status!=='success'||!data.lesson){
     status.textContent=local('Nu s-a putut verifica o lecție detaliată din surse. Păstrăm explicația orientativă.',
      'No source-verified detailed lesson was available. The advisory outline remains.');
     detailed.disabled=false;return;
    }
    const lesson=data.lesson;
    prose.replaceChildren();
    const section=(heading,paragraph)=>{
     const h=mk('h4',heading);h.style.cssText='margin:10px 0 4px;';
     const p=mk('p',paragraph);p.style.cssText='line-height:1.55;margin:0 0 10px;';
     prose.append(h,p);
    };
    section(local('Introducere','Introduction'),lesson.introduction);
    for(const concept of lesson.concepts)section(local('Explicație','Explanation'),concept);
    section(local('Exemplu explicat','Worked example'),lesson.workedExample);
    const quiz=mk('details','','edu-intl-review');
    quiz.append(mk('summary',local('Verifică răspunsurile','Check answers')));
    for(let i=0;i<lesson.questions.length;i++){
     quiz.append(mk('p',(i+1)+'. '+lesson.questions[i]));
     const answer=mk('p',lesson.answers[i]);answer.style.cssText='font-weight:600;padding-left:8px;';
     quiz.append(answer);
    }
    prose.append(quiz);
    if(Array.isArray(data.sources)){
     const references=mk('section','','edu-intl-sources');
     references.append(mk('h4',local('Surse consultate','Source references')));
     for(const src of data.sources.slice(0,5)){
      if(!/^https:\/\//.test(String(src.url||'')))continue;
      const a=mk('a',src.title||src.url);a.href=src.url;a.target='_blank';a.rel='noopener noreferrer';
      a.style.cssText='display:block;overflow-wrap:anywhere;margin:5px 0;font-size:.85em;';
      references.append(a);
     }
     prose.append(references);
    }
    detailed.remove();status.textContent=local('Lecție orientativă construită din surse identificate.','Advisory lesson constructed from identified evidence.');
   }catch{
    if(serial===token&&reader.isConnected){
     status.textContent=local('Serviciul de documentare nu este disponibil.','Evidence service unavailable.');
     detailed.disabled=false;
    }
   }
  };
  const returnButton=mk('button',local('← Înapoi la capitole','← Back to chapters'),'secondary-btn');
  returnButton.type='button';returnButton.onclick=chapterList;reader.append(returnButton);
  if(sourcedLesson){
   content({title:item[2],explanation:item[3],focus:item[2],
    activity:state.language==='ro'?'Formulează două întrebări și verifică un exemplu din sursele de mai jos.':'Formulate two questions and verify an example against the cited sources.'});
  }else if(state.language==='ro'){content(source)}
  else if(state.language==='en'&&nationalLesson&&national){
   content({title:item[2],explanation:national.en,focus:item[2]+'. '+local('','Compare evidence and explain the selected topic.'),
    activity:national.activityEn});
  }else{
   status.textContent=local('Se traduce lecția…','Translating lesson…');
   const identity='international:'+code+':'+subject+':'+level+':'+grade+':'+item[0];
   Promise.resolve(eduTranslateMaterial(source,identity)).then(translated=>{
    if(serial!==token||!reader.isConnected)return;
    if(translated)content(translated,true);
    else{content(source);status.textContent=local('Traducerea indisponibilă; este afișat textul original.',
       'Translation unavailable; original text is shown.')}
   }).catch(()=>{
    if(serial!==token||!reader.isConnected)return;
    content(source);status.textContent=local('Traducerea indisponibilă; este afișat textul original.',
     'Translation unavailable; original text is shown.');
   });
  }
  reader.scrollIntoView({block:'nearest'});
 }
 function draw(){
  const q=fold(search.value.trim());
  const filtered=rows.filter(r=>!q||fold(r[1]).includes(q)||fold(r[2]).includes(q)||fold(r[3]).includes(q));
  if(page>=filtered.length)page=0;list.replaceChildren();
  filtered.slice(page,page+4).forEach(item=>{
   const button=mk('button',local(item[1],item[2]),'secondary-btn');
   button.type='button';button.style.cssText='min-height:47px;width:100%;text-align:left;white-space:normal;overflow-wrap:anywhere;';
   button.onclick=()=>show(item);list.append(button);
  });
  if(!filtered.length)list.append(mk('p',local('Niciun rezultat.','No results.')));
  if(page>0){const previous=mk('button',local('← Anterior','← Previous'),'secondary-btn');
   previous.type='button';previous.onclick=()=>{page=Math.max(0,page-4);draw()};list.append(previous)}
  if(page+4<filtered.length){const more=mk('button',local('Mai multe →','More →'),'secondary-btn');
   more.type='button';more.onclick=()=>{page+=4;draw()};list.append(more)}
 }
 search.oninput=()=>{page=0;draw()};draw();
 // Load a country/grade-specific chapter sequence from public sources.
 // The complete advisory fallback is immediately available offline.
 const refreshNationalCourse=async()=>{
  if(!CLIENT_CONFIG?.apiUrl)return;
  const locale=state.language||'ro';
  const cacheKey=['pocket-national-course-v1',code,subject,level,grade,locale].join(':');
  const apply=data=>{
   if(data?.status!=='success'||!Array.isArray(data.chapters)||data.chapters.length<8)return false;
   const national=rows.filter(row=>row[0].startsWith('national-'));
   const localNames=new Set(national.map(row=>fold(row[1])+'|'+fold(row[2])));
   const newRows=data.chapters.slice(0,22).map((item,i)=>[
    'sourced-'+code+'-'+subject+'-'+grade+'-'+i,
    String(item.title||'').slice(0,110),String(item.title||'').slice(0,110),
    String(item.focus||'').slice(0,350)
   ]).filter(row=>row[1].length>=8&&row[3].length>=35&&!localNames.has(fold(row[1])+'|'+fold(row[2])));
   if(newRows.length<8)return false;
   rows=[...national,...newRows];page=0;
   advisory.textContent=local('Capitole orientative adaptate țării și clasei din surse educaționale; nu reprezintă programa oficială obligatorie.',
    'Advisory chapters adapted to the country and grade using education sources; not a mandatory official syllabus.');
   if(!selected)draw();
   return true;
  };
  try{
   const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');
   if(cached&&Date.now()-cached.time<12*60*60*1000&&apply(cached.data))return;
  }catch{}
  try{
   const endpoint=new URL(CLIENT_CONFIG.apiUrl);
   endpoint.pathname='/api/education-country-curriculum';endpoint.search='';
   const reply=await fetch(endpoint.toString(),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({country:code,subject,level,grade,language:locale})
   });
   const data=reply.ok?await reply.json():null;
   if(!host.isConnected||educationCountrySelection.code!==code)return;
   if(apply(data))try{
    localStorage.setItem(cacheKey,JSON.stringify({time:Date.now(),data:{status:'success',chapters:data.chapters}}))
   }catch{}
  }catch{}
 };
 // The source-indexed learning libraries must not be overwritten by AI.
 if(code!=='RO'&&code!=='GB-ENG'&&!rows.some(r=>String(r[0]).startsWith('national-')))
  refreshNationalCourse();
}
`;
