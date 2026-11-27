// National year packs for Physics, Chemistry and Biology: the same engine as
// Literature / History / Geography / Computing / Mathematics. Packs live in
// public/education/<physics|chemistry|biology>/authored/ (catalog.json +
// <CC>/<lang>-<year>.json, schema mypocket-literature-authored/v2), are loaded
// with literatureLoadAuthoredCatalog/literatureLoadNationalYear({subject}) and
// rendered by literatureNationalYearMaterial in the shared reader. They draw
// the Sciences "topics" screen of a year; years without a pack keep the
// existing chapters. Romania: Biology primary = Științe ale naturii III–IV.
// Every function is serialized with an explicit `var` (see
// education_national_reader.mjs): keep them closed, no outer references.

function scienceNationalKey(){
 const country=String(educationCountrySelection?.code||'');
 const subject=String(scienceJourney?.subject||'');
 const school=String(scienceJourney?.schoolStage||'');
 const stage=school==='primary'?'beginner':school==='upper'?'medium':school;
 const raw=String(scienceJourney?.grade||'');
 const grade=stage==='advanced'&&/^univ-[1-4]$/.test(raw)?'uni-ba-'+raw.slice(-1):raw;
 return {country,subject,stage,grade,id:subject+'|'+country+'|'+stage+'|'+grade};
}

function scienceNationalLabel(ro,en){
 return typeof learningLabel==='function'?learningLabel(ro,en):ro;
}

function scienceNationalButton(text,small,fn,extra,icon){
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
function scienceNationalRender(stage,host){
 if(typeof SCIENCE_NATIONAL!=='object'||!host)return false;
 const key=scienceNationalKey();
 if(!key.country||key.country==='OTHER'||!key.grade||!['physics','chemistry','biology'].includes(key.subject))return false;
 if(typeof literatureLoadAuthoredCatalog!=='function'||typeof literatureLoadNationalYear!=='function')return false;
 const pack=SCIENCE_NATIONAL.id===key.id?SCIENCE_NATIONAL.pack:null;
 if(!pack){
  if(stage!=='topics'||SCIENCE_NATIONAL.missing[key.id])return false;
  const marker=document.createElement('p');marker.className='math-national-loading';marker.setAttribute('role','status');
  marker.textContent=scienceNationalLabel('Se încarcă lecțiile clasei…','Loading the lessons for this year…');
  host.append(marker);
  if(SCIENCE_NATIONAL.loading===key.id)return true;
  SCIENCE_NATIONAL.loading=key.id;
  const again=()=>{
   if(SCIENCE_NATIONAL.loading===key.id)SCIENCE_NATIONAL.loading='';
   if(scienceJourney.stage==='topics'&&scienceNationalKey().id===key.id&&typeof scienceJourneyShowChoices==='function'){
    const live=document.getElementById('moduleContent');
    const warning=live&&live.querySelector('.edu-pack-unavailable');
    scienceJourneyShowChoices('topics');
    if(warning&&live&&!warning.isConnected)live.prepend(warning);
   }
  };
  literatureLoadAuthoredCatalog({subject:key.subject}).then(({catalog})=>{
   const entry=(catalog?.years||[]).find(y=>y.country===key.country&&y.stage===key.stage&&y.grade===key.grade&&Array.isArray(y.languages)&&y.languages.length);
   if(!entry)throw Error('no_national_year');
   const preferred=(typeof state==='object'&&entry.languages.find(l=>l.lang===state.language))||entry.languages[0];
   return literatureLoadNationalYear(entry,preferred.lang,{subject:key.subject});
  }).then(loaded=>{
   SCIENCE_NATIONAL.id=key.id;SCIENCE_NATIONAL.pack=loaded;SCIENCE_NATIONAL.lesson='';again();
  }).catch(()=>{SCIENCE_NATIONAL.missing[key.id]=true;again()});
  return true;
 }
 const panel=document.createElement('div');panel.className='math-choice-panel math-national-panel';
 const where=String(educationCountrySelection?.label||pack.country);
 const roman=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
 const subjectName={physics:['Fizică','Physics'],chemistry:['Chimie','Chemistry'],biology:['Biologie','Biology']}[key.subject];
 const discipline=key.subject==='biology'&&pack.stage==='beginner'?['Științe ale naturii','Natural sciences']:subjectName;
 const yearLabel=/^uni-ba-[1-4]$/.test(pack.grade)?scienceNationalLabel('Licență '+subjectName[0]+' · anul '+roman[Number(pack.grade.slice(-1))],subjectName[1]+' bachelor · Year '+pack.grade.slice(-1)):
  /^\d+$/.test(pack.grade)?scienceNationalLabel((pack.grade==='1'?'Clasa I':'Clasa a '+(roman[Number(pack.grade)]||pack.grade)+'-a')+' · '+discipline[0],'Grade '+pack.grade+' · '+discipline[1]):pack.grade;
 const add=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;panel.append(n);return n};
 if(stage==='national-lesson'){
  const lessonKey=String(SCIENCE_NATIONAL.lesson||''),row=pack.chapters?.[lessonKey]?.[pack.language];
  if(!row)return false;
  const unit=(pack.units||[]).find(u=>u.keys.includes(lessonKey));
  add('h2',row.title);
  add('p',where+' · '+yearLabel+(unit?' · '+unit.title:''));
  add('p',scienceNationalLabel('Alege o activitate. Materialul se deschide într-o fereastră separată și funcționează fără internet după prima încărcare.',
   'Choose an activity. The material opens in a separate reader and works offline after the first load.'));
  const out=document.createElement('div');out.className='math-national-output';
  const list=document.createElement('div');list.className='math-choice-list math-national-actions';
  const modes=[['lesson',scienceNationalLabel('📘 Teorie pas cu pas','📘 Step-by-step theory')],['examples',scienceNationalLabel('🔎 Exemple rezolvate','🔎 Worked examples')],
   ['exercises',scienceNationalLabel('✏️ Exerciții','✏️ Exercises')],['test',scienceNationalLabel('✅ Test cu răspunsuri','✅ Test with answers')]];
  for(const [mode,label] of modes){
   list.append(scienceNationalButton(label,'',()=>{
    let material=null;
    try{material=literatureNationalYearMaterial({pack,country:pack.country,stage:pack.stage,grade:pack.grade,topicKey:lessonKey,mode})}catch{}
    if(!material){out.replaceChildren();const p=document.createElement('p');p.textContent=scienceNationalLabel('Materialul nu a putut fi pregătit. Revino la lecții și deschide din nou.','The material could not be prepared. Go back to the lessons and open it again.');out.append(p);return}
    if(typeof eduNationalShowMaterial==='function'){eduNationalShowMaterial(row.title,material.text,out,pack.language);return}
    out.replaceChildren();
    if(typeof renderStudyBlocks==='function')renderStudyBlocks(out,material.text);else{out.style.whiteSpace='pre-line';out.textContent=material.text}
   },'math-national-action',''));
  }
  const keys=(pack.units||[]).flatMap(u=>u.keys),next=keys[keys.indexOf(lessonKey)+1];
  if(next){
   const nextRow=pack.chapters?.[next]?.[pack.language];
   list.append(scienceNationalButton(scienceNationalLabel('Lecția următoare →','Next lesson →'),nextRow?nextRow.title:'',()=>{SCIENCE_NATIONAL.lesson=next;scienceJourneyShowChoices('national-lesson')},'math-national-next','➡️'));
  }
  panel.append(list,out);
  if(typeof eduLessonWorkspace==='function')eduLessonWorkspace(panel,{pack,row,lessonKey,subject:key.subject});
  host.append(panel);
  return true;
 }
 if(stage!=='topics')return false;
 add('h2',scienceNationalLabel('Alege lecția','Choose a lesson'));
 if(typeof eduYearWorkspaceButton==='function')eduYearWorkspaceButton(panel,{pack,subject:key.subject});
 add('p',where+' · '+yearLabel);
 const university=pack.stage==='advanced';
 add('p',university?
  scienceNationalLabel('Lecțiile urmează disciplinele fundamentale comune ale programelor de licență din domeniu (sinteză orientativă; fiecare facultate are planul propriu). Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the core subjects shared by bachelor programmes in this field (advisory synthesis), with original step-by-step explanations, exercises and tests with answers.'):
  scienceNationalLabel('Lecțiile urmează programa școlară oficială și unitățile manualelor. Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the official curriculum and textbook units, with original step-by-step explanations, exercises and tests with answers.'),'math-curriculum-status');
 if(pack.source){
  const a=document.createElement('a');a.href=pack.source;a.target='_blank';a.rel='noopener noreferrer';
  a.textContent=university?scienceNationalLabel('Standarde ARACIS · sursă','ARACIS standards · source'):scienceNationalLabel('Programa școlară · sursă oficială','Official curriculum source');
  panel.append(a);
 }
 const units=Array.isArray(pack.units)&&pack.units.length?pack.units:[{title:scienceNationalLabel('Lecții','Lessons'),keys:Object.keys(pack.chapters||{})}];
 const items=document.createElement('div');items.className='math-choice-list math-national-lessons';
 let n=0;
 for(const unit of units){
  const h=document.createElement('h3');h.className='math-lesson-unit-heading';h.textContent=unit.title;
  h.style.cssText='font-size:16px;font-weight:700;margin:12px 2px 3px;text-align:left;color:#d7f4ff;width:100%;';
  items.append(h);
  for(const lessonKey of unit.keys){
   const row=pack.chapters?.[lessonKey]?.[pack.language];if(!row)continue;n++;
   items.append(scienceNationalButton(n+'. '+row.title,scienceNationalLabel('Deschide lecția','Open lesson'),()=>{SCIENCE_NATIONAL.lesson=lessonKey;scienceJourneyShowChoices('national-lesson')},'math-national-lesson'));
  }
 }
 panel.append(items);host.append(panel);
 return true;
}

export const SCIENCE_NATIONAL_PACKS_SCRIPT='var SCIENCE_NATIONAL={id:"",pack:null,lesson:"",loading:"",missing:{}};\n'+[
 ['scienceNationalKey',scienceNationalKey],['scienceNationalLabel',scienceNationalLabel],
 ['scienceNationalButton',scienceNationalButton],['scienceNationalRender',scienceNationalRender]
].map(([name,f])=>'var '+name+'='+f.toString()+';').join('\n');
export {scienceNationalKey};
