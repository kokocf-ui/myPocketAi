export const EDUCATION_COUNTRY_UI_SCRIPT=String.raw`
// Shared country-first entry for every Education category except foreign languages.
// This is ONE editable country field, not a grid of countries.
let educationCountrySelection={code:'',label:'',method:'unconfirmed',activeModule:null,callback:null,requestId:0};
function eduCountryFold(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase()}
function eduCountryOptions(){
 const all=typeof HG_COUNTRY_PICKER_DATA!=='undefined'?HG_COUNTRY_PICKER_DATA:[];
 const seen=new Set();return all.filter(x=>x&&x.id!=='OTHER'&&!seen.has(x.id)&&seen.add(x.id));
}
function eduCountryLabel(country){return learningLabel(country.ro||country.id,country.en||country.id)}
function eduCountryFind(code){return eduCountryOptions().find(c=>c.id===code)||null}
function eduCountryFromCode(country,coords){
 const code=String(country||'').toUpperCase();
 if(code==='GB'||code==='UK'){
  const lat=Number(coords?.latitude),lon=Number(coords?.longitude);
  if(Number.isFinite(lat)&&Number.isFinite(lon)){
   if(lat>=54&&lat<=55.4&&lon>=-8.3&&lon<=-5.3)return 'GB-NIR';
   if(lat>=51.2&&lat<=53.5&&lon>=-5.6&&lon<=-2.6)return 'GB-WLS';
   if(lat>55.8&&lat<=60.9&&lon>=-8.8&&lon<=-0.5)return 'GB-SCT';
   if(lat>=50&&lat<=55.8&&lon>=-6.5&&lon<=2.3)return 'GB-ENG';
  }
  return '';
 }
 return eduCountryFind(code)?code:'';
}
function eduCountryLastConfirmed(){try{const item=JSON.parse(localStorage.getItem('pocket-edu-country-confirmed-v1')||'null');return eduCountryFind(item?.code)?item.code:''}catch{return ''}}
function eduCountryApply(moduleKey,code){
 const c=eduCountryFind(code);if(!c)return false;
 educationCountrySelection.code=code;educationCountrySelection.label=eduCountryLabel(c);educationCountrySelection.method='selected';
 try{localStorage.setItem('pocket-edu-country-confirmed-v1',JSON.stringify({code,updatedAt:Date.now()}))}catch{}
 if(typeof hgJourney!=='undefined'){hgJourney.country=code;hgJourney.region='';hgJourney.topic=null;hgJourney.speciality=null;hgJourney.level=null;hgJourney.grade=null}
 if(typeof litJourney!=='undefined'){litJourney.country=code;litJourney.level='beginner';litJourney.grade='';litJourney.branch='program';litJourney.topic='';const def=LIT_COUNTRIES.find(x=>x[0]===code);if(def)litJourney.language=def[3]}
 if(typeof examJourney!=='undefined'){examJourney.country=code;examJourney.grade='';examJourney.exam=null;examJourney.subject=null;examJourney.domain=null;examJourney.topic=null;examJourney.track='';examJourney.board='';examJourney.region='';examJourney.aiQuestions=null;examJourney.practiceVersion=0}
 if(typeof practicalJourney!=='undefined'){practicalJourney.country=code;practicalJourney.course='';practicalJourney.chapter=''}
 if(typeof mathJourney!=='undefined'){mathJourney.stage='levels';mathJourney.level=null;mathJourney.topic=null;mathJourney.grade=null}
 if(typeof scienceJourney!=='undefined'){scienceJourney.stage='subjects';scienceJourney.level=null;scienceJourney.specialty=null;scienceJourney.topic=null;scienceJourney.grade=null}
 if(typeof computingJourney!=='undefined'){computingJourney.stage='levels';computingJourney.level=null;computingJourney.path=null;computingJourney.topic=null;computingJourney.grade=null}
 return true;
}
function educationCountryGate(moduleKey,proceed){
 if(moduleKey==='languages'){proceed();return}
 educationCountrySelection.requestId++;
 const requestId=educationCountrySelection.requestId;
 educationCountrySelection.activeModule=moduleKey;
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');if(!host||!root)return;
 root.classList.remove('learning-choose','learning-math','learning-science','learning-hg','learning-literature','learning-computing','learning-exams','learning-practical','science-choice-stage','math-choice-stage');
 root.classList.add('learning-active','learning-country-gate');
 const currentSubject=LEARNING_SUBJECTS.find(x=>x[0]===moduleKey);
 document.getElementById('moduleTitle').textContent=learningLabel(currentSubject?.[2]||'Educație',currentSubject?.[3]||'Education');
 document.getElementById('moduleLead').textContent='';host.replaceChildren();
 const toolbar=document.createElement('div');toolbar.className='education-toolbar lit-toolbar';
 const back=document.createElement('button');back.type='button';back.className='secondary-btn';back.textContent=learningLabel('← Înapoi','← Back');back.onclick=()=>{educationCountrySelection.requestId++;renderLearningSubjects()};
 toolbar.append(back);host.append(toolbar);
 const panel=document.createElement('section');panel.className='math-choice-panel science-choice-panel lit-panel edu-country-panel';
 panel.style.cssText='min-width:0;width:100%;max-width:100%;box-sizing:border-box;padding:12px 14px 20px;overflow-wrap:anywhere;';
 const h=document.createElement('h2');h.textContent=learningLabel('Țara pentru care dorești să înveți','Country whose curriculum you want to study');
 const note=document.createElement('p');note.textContent=learningLabel('Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.','The phone location suggests a country only when available. You can always choose another.');
 const input=document.createElement('input');input.type='search';input.className='lit-input edu-country-input';input.id='eduCountryInput';input.autocomplete='off';input.spellcheck=false;input.placeholder=learningLabel('Scrie sau alege țara…','Type or choose a country…');
 input.setAttribute('aria-label',learningLabel('Țara studiului','Country of study'));
 input.style.cssText='width:100%;max-width:100%;min-height:49px;box-sizing:border-box;font-size:16px;touch-action:manipulation;';
 const matches=document.createElement('div');matches.className='edu-country-matches';matches.style.cssText='display:none;flex-direction:column;gap:6px;margin-top:6px;max-height:250px;overflow:auto;';
 const status=document.createElement('p');status.setAttribute('role','status');
 const confirm=document.createElement('button');confirm.type='button';confirm.className='primary-btn';confirm.textContent=learningLabel('Continuă','Continue');confirm.style.cssText='min-height:48px;touch-action:manipulation;max-width:100%;';
 panel.append(h,note,input,matches,status,confirm);host.append(panel);
 let selected='',touched=false;
 function suggest(code,method){
  const country=eduCountryFind(code);if(!country||touched||educationCountrySelection.requestId!==requestId)return;
  selected=code;input.value=eduCountryLabel(country);
  educationCountrySelection.method=method;
  status.textContent=method==='location'?learningLabel('Țară sugerată din locația disponibilă a telefonului.','Suggested from available phone location.'):learningLabel('Ultima țară aleasă; poți schimba.','Previously chosen country; you can change it.');
 }
 const saved=eduCountryLastConfirmed();if(saved)suggest(saved,'saved');
 else status.textContent=learningLabel('Țara nu a fost confirmată; alege din câmp.','Country not yet confirmed; choose it using the field.');
 input.addEventListener('focus',()=>{input.select()});
 const countries=eduCountryOptions(),fold=eduCountryFold;
 function draw(){
  matches.replaceChildren();
  const query=fold(input.value);if(!query){matches.style.display='none';return}
  const hits=countries.filter(c=>fold(c.ro).startsWith(query)||fold(c.en).startsWith(query)||fold(c.id).startsWith(query)).slice(0,4);
  for(const hit of hits){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=eduCountryLabel(hit);b.style.cssText='text-align:left;width:100%;min-height:45px;white-space:normal;touch-action:manipulation;';b.onclick=()=>{selected=hit.id;input.value=eduCountryLabel(hit);matches.replaceChildren();matches.style.display='none';status.textContent=''};matches.append(b)}
  matches.style.display=hits.length?'flex':'none';
 }
 input.addEventListener('input',()=>{touched=true;selected='';status.textContent='';draw()});
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();confirm.click()}});
 confirm.onclick=()=>{
  const exact=countries.find(c=>fold(c.ro)===fold(input.value)||fold(c.en)===fold(input.value)||fold(c.id)===fold(input.value));
  const code=selected||exact?.id;
  if(!code){status.textContent=learningLabel('Alege o țară validă din sugestii.','Choose a valid country from the matches.');return}
  if(!eduCountryApply(moduleKey,code))return;
  educationCountrySelection.requestId++;root.classList.remove('learning-country-gate');
  proceed();
 };
 // Geo resolution is asynchronous, never requests fresh permission and never changes a field the user touched.
 const coords=state.location;
 if(Number.isFinite(Number(coords?.latitude))&&Number.isFinite(Number(coords?.longitude))){
  try{const url=new URL(CLIENT_CONFIG.apiUrl);url.pathname='/api/finance-country';url.search='';url.searchParams.set('lat',String(coords.latitude));url.searchParams.set('lon',String(coords.longitude));
   fetch(url.toString(),{headers:{Accept:'application/json'}}).then(x=>{if(!x.ok)throw Error('country');return x.json()}).then(x=>suggest(eduCountryFromCode(x.country,coords),'location')).catch(()=>{});
  }catch{}
 }else if(typeof budgetDetectedCountry==='string'&&budgetDetectedCountry){suggest(eduCountryFromCode(budgetDetectedCountry,null),'detected')}
}
function eduYearOptions(code,level,moduleKey){
 const lv=level==='intermediate'?'medium':level;
 const source=EDUCATION_SCHOOL_YEARS_DATA[code]?.[lv];
 const numeric=(a,b,prefix='')=>Array.from({length:b-a+1},(_,i)=>({id:prefix+(a+i),ro:prefix?'Year '+(a+i):'Clasa '+(a+i),en:prefix?'Year '+(a+i):'Grade '+(a+i)}));
 if(source){
   if(code==='RO'){
    if(moduleKey==='math'&&lv==='beginner')return numeric(1,8);
    if(moduleKey==='science'&&lv==='beginner')return numeric(typeof scienceJourney!=='undefined'&&scienceJourney.subject==='chemistry'?7:typeof scienceJourney!=='undefined'&&scienceJourney.subject==='physics'?6:5,8);
    if(moduleKey==='history'&&lv==='beginner'&&typeof hgJourney!=='undefined'&&['history','geography'].includes(hgJourney.subject))return source.filter(x=>x.id==='4');
    if(moduleKey==='science'&&lv==='medium')return numeric(9,12);
    if(moduleKey==='computing'&&lv==='beginner')return numeric(1,4);
   }
   return source;
 }
 return [{id:'general-'+lv,ro:lv==='beginner'?'Învățare generală – primar':lv==='medium'?'Învățare generală – secundar':'Învățare generală – universitar',en:lv==='beginner'?'General primary learning':lv==='medium'?'General secondary learning':'General university learning'}];
}
function educationGradeGate(moduleKey,level,proceed,back){
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 const country=educationCountrySelection.code;
 const options=eduYearOptions(country,level,moduleKey);
 if(options.length===1){proceed(options[0].id);return}
 host.replaceChildren();
 const toolbar=document.createElement('div');toolbar.className='education-toolbar lit-toolbar';
 const previous=document.createElement('button');previous.type='button';previous.className='secondary-btn';previous.textContent=learningLabel('← Înapoi','← Back');previous.onclick=back;toolbar.append(previous);host.append(toolbar);
 const panel=document.createElement('section');panel.className='math-choice-panel science-choice-panel lit-panel edu-grade-panel';panel.style.cssText='min-width:0;max-width:100%;box-sizing:border-box;';
 const h=document.createElement('h2');h.textContent=learningLabel('Alege clasa / anul de studiu','Choose grade / school year');
 const context=document.createElement('p');context.textContent=educationCountrySelection.label+' · '+learningLabel('Materia se adaptează clasei selectate.','Learning content follows the selected school year.');
 const search=document.createElement('input');search.type='search';search.className='lit-input';search.placeholder=learningLabel('Scrie clasa sau anul…','Type a grade or year…');search.setAttribute('aria-label',h.textContent);
 search.style.cssText='width:100%;box-sizing:border-box;min-height:48px;font-size:16px;';
 const list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:7px;max-width:100%;margin:8px 0;';
 panel.append(h,context,search,list);host.append(panel);
 let page=0;function draw(){
  list.replaceChildren();const text=eduCountryFold(search.value);
  const filtered=options.filter(o=>!text||eduCountryFold(o.ro).includes(text)||eduCountryFold(o.en).includes(text)||eduCountryFold(o.id).includes(text));
  if(page>=filtered.length)page=0;
  filtered.slice(page,page+4).forEach(o=>{const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=learningLabel(o.ro,o.en);b.style.cssText='min-height:45px;text-align:left;width:100%;';b.onclick=()=>proceed(o.id);list.append(b)});
  if(!filtered.length){const p=document.createElement('p');p.textContent=learningLabel('Nu am găsit clasa.','No matching grade.');list.append(p)}
  if(page+4<filtered.length){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=learningLabel('Alte clase →','More grades →');b.onclick=()=>{page+=4;draw()};list.append(b)}
  if(page>0){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=learningLabel('← Clase anterioare','← Previous grades');b.onclick=()=>{page=Math.max(0,page-4);draw()};list.prepend(b)}
 }
 search.addEventListener('focus',()=>search.select());
 search.oninput=()=>{page=0;draw()};draw();
}

`;