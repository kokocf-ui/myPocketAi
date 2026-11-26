// National year packs for Mathematics: the same engine as Literature /
// History / Geography / Computing. Packs live in
// public/education/math/authored/ (catalog.json + <CC>/<lang>-<year>.json,
// schema mypocket-literature-authored/v2), are loaded with
// literatureLoadAuthoredCatalog/literatureLoadNationalYear({subject:'math'})
// and rendered by literatureNationalYearMaterial in the shared reader.
// Romania: primary 1-4, gimnaziu 5-8 (OMEN 3393/2017), high school 9-12 (mathematics-informatics) and
// university Licență I-III (selector years 1..3 -> pack grades uni-ba-1..3).
// Years without a pack (e.g. 9-SCI) keep the existing branches.
// Every function is serialized with an explicit `var` (see
// education_national_reader.mjs): keep them closed, no outer references.

function mathNationalKey(){
 const country=String(educationCountrySelection?.code||'');
 const school=String(mathJourney?.schoolStage||'');
 const stage=school==='primary'?'beginner':school==='intermediate'?'medium':school;
 const raw=String(mathJourney?.grade||'');
 const grade=stage==='advanced'&&/^[1-4]$/.test(raw)?'uni-ba-'+raw:raw;
 return {country,stage,grade,id:country+'|'+stage+'|'+grade};
}

function mathNationalLabel(ro,en){
 return typeof learningLabel==='function'?learningLabel(ro,en):ro;
}

function mathNationalButton(text,small,fn,extra,icon){
 const b=document.createElement('button');b.type='button';
 b.className='secondary-btn math-choice-row math-national-row'+(extra?' '+extra:'');
 if(icon!==''){const art=document.createElement('span');art.className='math-tile-icon';art.setAttribute('aria-hidden','true');art.textContent=icon||'📖';b.append(art)}
 const strong=document.createElement('strong');strong.textContent=text;
 b.append(strong);
 if(small){const s=document.createElement('small');s.textContent=small;b.append(s)}
 b.onclick=fn;
 return b;
}

// Returns true when it has drawn the screen (national units, lesson
// activities or a short loading line); false lets the generic branches draw.
function mathNationalRender(stage,host){
 if(typeof MATH_NATIONAL!=='object'||!host)return false;
 const key=mathNationalKey();
 if(!key.country||key.country==='OTHER'||!key.grade)return false;
 if(typeof literatureLoadAuthoredCatalog!=='function'||typeof literatureLoadNationalYear!=='function')return false;
 const pack=MATH_NATIONAL.id===key.id?MATH_NATIONAL.pack:null;
 if(!pack){
  if(stage!=='branches'||MATH_NATIONAL.missing[key.id])return false;
  const marker=document.createElement('p');marker.className='math-national-loading';marker.setAttribute('role','status');
  marker.textContent=mathNationalLabel('Se încarcă lecțiile clasei…','Loading the lessons for this year…');
  host.append(marker);
  if(MATH_NATIONAL.loading===key.id)return true;
  MATH_NATIONAL.loading=key.id;
  const again=()=>{
   if(MATH_NATIONAL.loading===key.id)MATH_NATIONAL.loading='';
   if(mathJourney.stage==='branches'&&mathNationalKey().id===key.id&&typeof mathJourneyShowChoices==='function'){
    // Keep a curriculum-pack warning (shown by eduRunWithCurriculumPack while
    // the catalog was loading) when the year is re-rendered.
    const live=document.getElementById('moduleContent');
    const warning=live&&live.querySelector('.edu-pack-unavailable');
    mathJourneyShowChoices('branches');
    if(warning&&live&&!warning.isConnected)live.prepend(warning);
   }
  };
  literatureLoadAuthoredCatalog({subject:'math'}).then(({catalog})=>{
   const entry=(catalog?.years||[]).find(y=>y.country===key.country&&y.stage===key.stage&&y.grade===key.grade&&Array.isArray(y.languages)&&y.languages.length);
   if(!entry)throw Error('no_national_year');
   const preferred=(typeof state==='object'&&entry.languages.find(l=>l.lang===state.language))||entry.languages[0];
   return literatureLoadNationalYear(entry,preferred.lang,{subject:'math'});
  }).then(loaded=>{
   MATH_NATIONAL.id=key.id;MATH_NATIONAL.pack=loaded;MATH_NATIONAL.lesson='';again();
  }).catch(()=>{MATH_NATIONAL.missing[key.id]=true;again()});
  return true;
 }
 const panel=document.createElement('div');panel.className='math-choice-panel math-national-panel';
 const where=String(educationCountrySelection?.label||pack.country);
 const roman=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
 const yearLabel=/^uni-ba-[1-4]$/.test(pack.grade)?mathNationalLabel('Licență Matematică · anul '+roman[Number(pack.grade.slice(-1))],'Mathematics bachelor · Year '+pack.grade.slice(-1)):
  /^\d+$/.test(pack.grade)?mathNationalLabel((pack.grade==='1'?'Clasa I':'Clasa a '+(roman[Number(pack.grade)]||pack.grade)+'-a')+(pack.stage==='medium'?' · matematică-informatică':''),'Grade '+pack.grade):pack.grade;
 const add=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;panel.append(n);return n};
 if(stage==='national-lesson'){
  const lessonKey=String(MATH_NATIONAL.lesson||''),row=pack.chapters?.[lessonKey]?.[pack.language];
  if(!row)return false;
  const unit=(pack.units||[]).find(u=>u.keys.includes(lessonKey));
  add('h2',row.title);
  add('p',where+' · '+yearLabel+(unit?' · '+unit.title:''));
  add('p',mathNationalLabel('Alege o activitate. Materialul se deschide într-o fereastră separată și funcționează fără internet după prima încărcare.',
   'Choose an activity. The material opens in a separate reader and works offline after the first load.'));
  const out=document.createElement('div');out.className='math-national-output';
  const list=document.createElement('div');list.className='math-choice-list math-national-actions';
  const modes=[['lesson',mathNationalLabel('📘 Teorie pas cu pas','📘 Step-by-step theory')],['examples',mathNationalLabel('🔎 Exemple rezolvate','🔎 Worked examples')],
   ['exercises',mathNationalLabel('✏️ Exerciții','✏️ Exercises')],['test',mathNationalLabel('✅ Test cu răspunsuri','✅ Test with answers')]];
  for(const [mode,label] of modes){
   list.append(mathNationalButton(label,'',()=>{
    let material=null;
    try{material=literatureNationalYearMaterial({pack,country:pack.country,stage:pack.stage,grade:pack.grade,topicKey:lessonKey,mode})}catch{}
    if(!material){out.replaceChildren();const p=document.createElement('p');p.textContent=mathNationalLabel('Materialul nu a putut fi pregătit. Revino la lecții și deschide din nou.','The material could not be prepared. Go back to the lessons and open it again.');out.append(p);return}
    if(typeof eduNationalShowMaterial==='function'){eduNationalShowMaterial(row.title,material.text,out,pack.language);return}
    out.replaceChildren();
    if(typeof renderStudyBlocks==='function')renderStudyBlocks(out,material.text);else{out.style.whiteSpace='pre-line';out.textContent=material.text}
   },'math-national-action',''));
  }
  const keys=(pack.units||[]).flatMap(u=>u.keys),next=keys[keys.indexOf(lessonKey)+1];
  if(next){
   const nextRow=pack.chapters?.[next]?.[pack.language];
   list.append(mathNationalButton(mathNationalLabel('Lecția următoare →','Next lesson →'),nextRow?nextRow.title:'',()=>{MATH_NATIONAL.lesson=next;mathJourneyShowChoices('national-lesson')},'math-national-next','➡️'));
  }
  panel.append(list,out);
  if(typeof eduLessonWorkspace==='function')eduLessonWorkspace(panel,{pack,row,lessonKey,subject:'math'});
  host.append(panel);
  return true;
 }
 if(stage!=='branches')return false;
 add('h2',mathNationalLabel('Alege lecția','Choose a lesson'));
 add('p',where+' · '+yearLabel);
 const university=pack.stage==='advanced';
 add('p',university?
  mathNationalLabel('Lecțiile urmează disciplinele fundamentale comune ale programelor de licență în Matematică (sinteză orientativă; fiecare facultate are planul propriu). Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the core subjects shared by mathematics bachelor programmes (advisory synthesis), with original step-by-step explanations, exercises and tests with answers.'):
  mathNationalLabel('Lecțiile urmează programa școlară oficială și unitățile manualelor. Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the official curriculum and textbook units, with original step-by-step explanations, exercises and tests with answers.'),'math-curriculum-status');
 if(pack.source){
  const a=document.createElement('a');a.href=pack.source;a.target='_blank';a.rel='noopener noreferrer';
  a.textContent=university?mathNationalLabel('Standarde ARACIS · sursă','ARACIS standards · source'):mathNationalLabel('Programa școlară · sursă oficială','Official curriculum source');
  panel.append(a);
 }
 const units=Array.isArray(pack.units)&&pack.units.length?pack.units:[{title:mathNationalLabel('Lecții','Lessons'),keys:Object.keys(pack.chapters||{})}];
 const items=document.createElement('div');items.className='math-choice-list math-national-lessons';
 let n=0;
 for(const unit of units){
  const h=document.createElement('h3');h.className='math-lesson-unit-heading';h.textContent=unit.title;
  h.style.cssText='font-size:16px;font-weight:700;margin:12px 2px 3px;text-align:left;color:#d7f4ff;width:100%;';
  items.append(h);
  for(const lessonKey of unit.keys){
   const row=pack.chapters?.[lessonKey]?.[pack.language];if(!row)continue;n++;
   items.append(mathNationalButton(n+'. '+row.title,mathNationalLabel('Deschide lecția','Open lesson'),()=>{MATH_NATIONAL.lesson=lessonKey;mathJourneyShowChoices('national-lesson')},'math-national-lesson'));
  }
 }
 panel.append(items);host.append(panel);
 return true;
}

export const MATH_NATIONAL_PACKS_SCRIPT='var MATH_NATIONAL={id:"",pack:null,lesson:"",loading:"",missing:{}};\n'+[
 ['mathNationalKey',mathNationalKey],['mathNationalLabel',mathNationalLabel],
 ['mathNationalButton',mathNationalButton],['mathNationalRender',mathNationalRender]
].map(([name,f])=>'var '+name+'='+f.toString()+';').join('\n');
