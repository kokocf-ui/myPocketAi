// Country-aware lesson reader, preserving in-module navigation and the
// grade/country selection. A chapter outline is not marked as a full lesson.
export const EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT=String.raw`
function educationInternationalOpen(subject,level,grade,onBack){
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 const code=educationCountrySelection.code||'WORLD',countryName=educationCountrySelection.label||code;
 const rows=worldwideStudyChapters(code,subject,level,grade,countryName,countryName,HG_SCHOOL_GENERAL_DATA);
 if(!rows.length){if(typeof onBack==='function')onBack();return}
 root.classList.add('learning-intl-curriculum');
 host.replaceChildren();
 const mk=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e};
 const local=(ro,en)=>state.language==='ro'?ro:en;
 const toolbar=mk('div','','education-toolbar');
 const back=mk('button',local('← Înapoi','← Back'),'secondary-btn');back.type='button';
 toolbar.append(back);host.append(toolbar);
 const panel=mk('section','','math-choice-panel science-choice-panel edu-intl-programme');
 panel.style.cssText='width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow-y:auto;overscroll-behavior:contain;padding:12px 14px 18px;';
 const title=mk('h2',local('Programa de studiu','Study programme')+' · '+countryName);
 title.style.cssText='font-size:1.08rem;margin:0 0 8px;';
 const detail=mk('p',local('Clasa: ','Year: ')+String(grade||'')+' · '+local('Nivel: ','Level: ')+String(level||''));
 detail.style.cssText='font-size:.88em;margin:0 0 7px;';
 const advisory=mk('p',local('Programă orientativă; nu este o listă oficială de capitole obligatorii.','Advisory learning path, not an official list of compulsory chapters.'));
 advisory.style.cssText='font-size:.82em;line-height:1.35;opacity:.84;margin:0 0 10px;';
 panel.append(title,detail,advisory);
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
   const heading=mk('h4',local('Explicație','Explanation'));heading.style.cssText='margin:9px 0 4px;';
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
   prose.append(check,feedback);
   if(!nationalLesson||!national){
    const note=mk('p',local('Acest material este un plan de studiu orientativ, nu o lecție națională verificată integral.',
     'This is an advisory study outline, not a fully verified national lesson.'));
    note.style.cssText='font-size:.85em;opacity:.85;margin:7px 0;';prose.prepend(note);
   }
   status.textContent=fromTranslation?'':state.language==='ro'?'':local('','');
  }
  reader.append(status,prose);
  const returnButton=mk('button',local('← Înapoi la capitole','← Back to chapters'),'secondary-btn');
  returnButton.type='button';returnButton.onclick=chapterList;reader.append(returnButton);
  if(state.language==='ro'){content(source)}
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
}
`;
