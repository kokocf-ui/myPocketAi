export const EDUCATION_COUNTRY_GATE_SCRIPT=String.raw`
// Country of STUDY is an explicit user choice, never inferred from interface language.
let educationStudyCountry=null,educationGateReady=false,educationGateRequest=0;
const EDUCATION_STUDY_SOURCES={
 'RO':['Programă școlară națională – verifică anul și profilul','National framework – check school year and track','https://www.edu.ro/Ordin_ministru_3393_2017'],
 'GB-ENG':['National curriculum – Key Stages și Years','National curriculum – Key Stages and Years','https://www.gov.uk/national-curriculum/key-stage-3-and-4'],
 'GB-SCT':['Sistem școlar scoțian – verificați cadrul actual','Scottish system – check current framework','https://education.gov.scot/'],
 'GB-WLS':['Curriculum pentru Țara Galilor – verificați cadrul actual','Curriculum for Wales – check the current framework','https://hwb.gov.wales/'],
 'GB-NIR':['Curriculum pentru Irlanda de Nord – verificați cadrul actual','Northern Ireland curriculum – check current framework','https://ccea.org.uk/']
};
function educationStudyCountryLabel(code){
 const rows=typeof LIT_COUNTRIES==='undefined'?[]:LIT_COUNTRIES;
 const match=rows.find(x=>x[0]===code);
 if(match)return learningLabel(match[1],match[2]);
 try{return new Intl.DisplayNames([state.language==='ro'?'ro':'en'],{type:'region'}).of(String(code).split('-')[0])||code}catch{return code}
}
function educationCountryOptions(){
 const rows=typeof LIT_COUNTRIES==='undefined'?[]:LIT_COUNTRIES;
 const all=rows.filter(x=>x[0]!=='OTHER-EU').map(x=>({id:x[0],ro:x[1],en:x[2]}));
 // These countries have general-study fallback until an official curriculum is indexed.
 const extra=[['US','Statele Unite','United States'],['CA','Canada','Canada'],['AU','Australia','Australia'],['NZ','Noua Zeelandă','New Zealand'],['JP','Japonia','Japan'],['CN','China','China'],['IN','India','India'],['BR','Brazilia','Brazil'],['MX','Mexic','Mexico'],['KR','Coreea de Sud','South Korea'],['ZA','Africa de Sud','South Africa'],['EG','Egipt','Egypt']];
 extra.forEach(x=>{if(!all.some(v=>v.id===x[0]))all.push({id:x[0],ro:x[1],en:x[2]})});
 return all;
}
function educationNormalizeCountry(value){
 const input=String(value||'').toUpperCase();
 if(input==='GB'||input==='UK')return 'GB-ENG';
 if(input==='UK-SCT')return 'GB-SCT';
 if(input==='UK-WLS')return 'GB-WLS';
 if(input==='UK-NIR')return 'GB-NIR';
 return input;
}
function educationSavedCountry(){try{return String(localStorage.getItem('pocket-education-country-v2')||'')}catch{return ''}}
function educationSchoolContext(code){
 if(code==='RO')return {cycles:[['primary','Primar · clasele I–IV'],['lower','Gimnaziu · clasele V–VIII'],['upper','Liceu · clasele IX–XII/XIII'],['university','Universitate']],yearNote:'Programele noi de liceu sunt aplicate progresiv, din clasa IX în anul 2026–2027.'};
 if(code==='GB-ENG')return {cycles:[['primary','Primary · Years 1–6 (KS1–KS2)'],['lower','Secondary · Years 7–9 (KS3)'],['upper','GCSE · Years 10–11 (KS4) / post-16'],['university','Higher education']],yearNote:'KS3 și KS4 nu se echivalează automat cu clasele românești.'};
 return {cycles:[['primary','Școală primară / Primary'],['lower','Secundar inferior / Lower secondary'],['upper','Secundar superior / Upper secondary'],['university','Universitate / University']],yearNote:'Structura anilor și programa acestei țări trebuie confirmate din surse oficiale.'};
}
function educationStudyCurriculumStatus(country){return EDUCATION_STUDY_SOURCES[country]?'framework':'general'}
function educationCountryGateOpen(moduleKey){
 const request=++educationGateRequest,root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 root.classList.remove('learning-math','learning-science','learning-hg','learning-literature','learning-languages','learning-computing','learning-exams','learning-practical','science-choice-stage','math-choice-stage');
 root.classList.remove('learning-choose');root.classList.add('learning-active','learning-country-choice');
 const subject=LEARNING_SUBJECTS.find(x=>x[0]===moduleKey);
 document.getElementById('moduleTitle').textContent=learningLabel('Țara de studiu','Country of study')+(subject?' · '+learningLabel(subject[2],subject[3]):'');
 document.getElementById('moduleLead').textContent='';host.replaceChildren();
 const panel=document.createElement('section');panel.className='math-choice-panel science-choice-panel education-country-panel';panel.style.cssText='width:100%;max-width:100%;box-sizing:border-box;min-width:0;';
 const title=document.createElement('h2');title.textContent=learningLabel('În ce țară dorești să înveți?','Which country do you want to study for?');panel.append(title);
 const note=document.createElement('p');note.textContent=learningLabel('Țara telefonului este doar o sugestie. O poți înlocui, iar aplicația va folosi programa țării selectate numai când aceasta este verificată.','Your phone country is only a suggestion. Change it freely; verified curricula are used only where available.');panel.append(note);
 const input=document.createElement('input');input.type='search';input.className='lit-input';input.setAttribute('aria-label',learningLabel('Caută țara de studiu','Search country of study'));input.placeholder=learningLabel('Caută o țară…','Search a country…');input.style.cssText='width:100%;min-height:48px;box-sizing:border-box;font-size:16px;';input.autocomplete='off';
 const options=document.createElement('div');options.style.cssText='display:flex;flex-direction:column;gap:7px;margin:8px 0;';
 const status=document.createElement('p');status.setAttribute('role','status');status.style.cssText='font-size:.9rem;line-height:1.45;';
 const action=document.createElement('button');action.type='button';action.className='primary-btn';action.style.cssText='min-height:48px;max-width:100%;';
 const back=document.createElement('button');back.type='button';back.className='secondary-btn';back.textContent=learningLabel('← Înapoi','← Back');back.onclick=()=>{++educationGateRequest;renderLearningSubjects()};
 const controls=document.createElement('div');controls.className='lit-actions';controls.append(back,action);
 panel.append(input,options,status,controls);host.append(panel);
 const countries=educationCountryOptions();let choice=null;
 const fold=value=>String(value||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 function paint(){
  const query=fold(input.value.trim());
  let candidates=query?countries.filter(x=>fold(x.ro).includes(query)||fold(x.en).includes(query)||fold(x.id)===query):countries;
  if(choice)candidates=[choice,...candidates.filter(x=>x.id!==choice.id)];
  options.replaceChildren();
  candidates.slice(0,4).forEach(row=>{const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.style.cssText='text-align:left;min-height:43px;';b.textContent=learningLabel(row.ro,row.en);b.onclick=()=>{choice=row;input.value=learningLabel(row.ro,row.en);input.blur();paint()};options.append(b)});
  action.disabled=!choice;action.textContent=choice?learningLabel('Continuă · ','Continue · ')+learningLabel(choice.ro,choice.en):learningLabel('Selectează țara','Select country');
  const src=choice?EDUCATION_STUDY_SOURCES[choice.id]:null;
  status.textContent=!choice?learningLabel('Alege o țară din rezultate.','Choose a country from results.'):src?learningLabel('Există un cadru oficial de referință. Temele fără programă verificată vor fi marcate ca învățare generală.','An official reference framework exists. Unverified topics will be labelled general study.'):learningLabel('Programă încă neconfirmată pentru această țară: învățare generală, nu programă oficială.','Curriculum not yet verified for this country: general learning, not an official syllabus.');
 }
 input.onfocus=()=>input.select();input.oninput=()=>{choice=null;paint()};
 action.onclick=()=>{
  if(!choice)return;educationStudyCountry=choice.id;
  try{localStorage.setItem('pocket-education-country-v2',choice.id)}catch{}
  ++educationGateRequest;
  educationGateReady=true;
  try{openLearningSubject(moduleKey)}finally{educationGateReady=false}
 };
 function hintCountry(id){
  if(request!==educationGateRequest)return;
  const normalized=educationNormalizeCountry(id);
  const matched=countries.find(x=>x.id===normalized);
  if(!matched)return;
  // Never clobber manual edits while asynchronous location lookup runs.
  if(document.activeElement===input||input.dataset.manuallyEdited==='true')return;
  choice=matched;input.value=learningLabel(matched.ro,matched.en);paint();
 }
 input.addEventListener('input',()=>input.dataset.manuallyEdited='true');
 const last=educationSavedCountry();
 hintCountry(last);
 // Reuse the already-integrated country-detection endpoint; do not request GPS anew.
 try{
  const url=new URL(CLIENT_CONFIG.apiUrl);url.pathname='/api/finance-country';url.search='';
  const coords=typeof cachedCoordinates==='function'?cachedCoordinates():null;
  if(coords){url.searchParams.set('lat',String(coords.latitude));url.searchParams.set('lon',String(coords.longitude))}
  fetch(url.toString(),{headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():null).then(data=>{
   if(request!==educationGateRequest||!data?.country)return;
   if(last)return; // honour the last explicitly chosen country over automatic location.
   hintCountry(String(data.country));
  }).catch(()=>{});
 }catch{}
 paint();
}
