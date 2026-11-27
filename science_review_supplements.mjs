// Original advisory supplements loaded as data, never embedded in the Worker.
export function scienceReviewSupplements(host){
 const country=educationCountrySelection.code,subject=scienceJourney.subject,stage=scienceJourney.schoolStage,grade=String(scienceJourney.grade||'');
 if(country!=='RO'||!(stage==='advanced'&&/^univ-[1-3]$/.test(grade)||subject==='astronomy'&&stage==='upper'&&/^(9|10|11|12)$/.test(grade)))return;
 const label=(ro,en)=>typeof learningLabel==='function'?learningLabel(ro,en):ro;
 const wrap=document.createElement('details');wrap.className='science-review-supplements';wrap.style.cssText='width:100%;box-sizing:border-box;margin:12px 0;padding:12px;border:1px solid #79acbd;border-radius:12px;';
 const summary=document.createElement('summary');summary.textContent=label('🔬 Aplicații suplimentare · metodă și rezolvare','🔬 Extra applications · methods and solutions');wrap.append(summary);host.append(wrap);
 const valid=d=>d?.schema==='mypocket-science-review/v1'&&d.country===country&&d.language==='ro'&&/^[a-f0-9]{64}$/.test(d.version||'')&&Array.isArray(d.lessons)&&d.lessons.length>0&&d.lessons.every(r=>['physics','chemistry','biology','astronomy'].includes(r.subject)&&['id','grade','stage','title','theory','sample','worked'].every(k=>typeof r[k]==='string'&&r[k].trim())&&Array.isArray(r.test)&&r.test.length>0&&r.answers?.length===r.test.length&&Array.isArray(r.steps));
 let loaded=false,busy=false;
 const body=document.createElement('div');wrap.append(body);
 wrap.ontoggle=async()=>{
  if(!wrap.open||loaded||busy)return;busy=true;
  body.textContent=label('Se încarcă aplicațiile…','Loading applications…');
  const key='pocket.science.review.v1.'+country;let data=null;
  try{const res=await fetch('/education/science/review/'+country+'.json',{cache:'no-store'});if(!res.ok)throw Error('http');data=await res.json();if(!valid(data))throw Error('invalid');try{localStorage.setItem(key,JSON.stringify(data))}catch{}}
  catch{try{const cached=JSON.parse(localStorage.getItem(key)||'null');if(valid(cached))data=cached;else data=null}catch{data=null}}
  finally{busy=false}
  if(!wrap.isConnected||scienceJourney.subject!==subject||String(scienceJourney.grade)!==grade||scienceJourney.schoolStage!==stage)return;
  body.replaceChildren();
  if(!data){body.textContent=label('Aplicațiile nu sunt disponibile acum. Închide și redeschide secțiunea pentru a reîncerca.','Applications unavailable. Close and reopen this section to retry.');return}
  loaded=true;
  const note=document.createElement('p');note.textContent=label(data.notice,'Original advisory supplements, not complete university years or accredited curricula. School astronomy is interdisciplinary. Source material: Romanian; interface translation may be unavailable.');body.append(note);
  const output=document.createElement('div');
  for(const row of data.lessons.filter(r=>r.subject===subject&&r.stage===stage&&r.grade===grade)){
   const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.style.cssText='display:block;width:100%;min-height:48px;margin:6px 0;white-space:normal;text-align:left;';b.textContent=row.title;
   b.onclick=()=>{
    output.replaceChildren();
    const read=document.createElement('button');read.type='button';read.className='secondary-btn';read.textContent=label('📘 Citește lecția și exemplul rezolvat','📘 Read lesson and worked example');
    const material=document.createElement('div');
    read.onclick=()=>eduNationalShowMaterial(row.title,'# '+row.title+'\n\n'+row.theory+'\n\n## '+label('Problemă','Problem')+'\n'+row.sample+'\n\n## '+label('Rezolvare pas cu pas','Step-by-step solution')+'\n'+row.worked,material,'ro');
    output.append(read,material);
    eduLessonWorkspace(output,{pack:{country,stage,grade,language:'ro'},row,lessonKey:row.id,subject});
   };body.append(b);
  }
  body.append(output);
 };
}
export const SCIENCE_REVIEW_SUPPLEMENTS_SCRIPT='var scienceReviewSupplements='+scienceReviewSupplements.toString()+';';
