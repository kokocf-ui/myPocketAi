// National year packs for History / Geography (and later Computing): the same
// engine as Literature. Packs live in public/education/<subject>/authored/
// (catalog.json + <CC>/<lang>-<year>.json, schema mypocket-literature-authored/v2),
// are loaded with literatureLoadAuthoredCatalog/literatureLoadNationalYear
// ({subject}) and rendered with literatureNationalYearMaterial in the shared
// material reader. Countries/years without a pack keep the existing chapters.
// Every function is serialized into the browser script: keep them closed.
import {EDUCATION_NATIONAL_READER_SCRIPT} from './education_national_reader.mjs';

function hgNationalPackActive(){
 const pack=typeof HG_NATIONAL_YEAR==='object'?HG_NATIONAL_YEAR.pack:null;
 if(!pack||typeof hgJourney!=='object')return null;
 if(pack.subject!==hgJourney.subject||pack.country!==hgJourney.country||pack.stage!==hgJourney.level||pack.grade!==String(hgJourney.grade||''))return null;
 return pack;
}

function hgWithNationalYear(proceed,fallback){
 if(typeof HG_NATIONAL_YEAR==='object')HG_NATIONAL_YEAR.pack=null;
 const subject=hgJourney.subject,country=hgJourney.country,stage=hgJourney.level,grade=String(hgJourney.grade||'');
 if(typeof literatureLoadAuthoredCatalog!=='function'||typeof literatureLoadNationalYear!=='function'||
    !['history','geography'].includes(subject)||!country||country==='OTHER'){fallback();return}
 const host=document.getElementById('moduleContent');
 const marker=document.createElement('p');marker.className='hg-national-loading';marker.setAttribute('role','status');
 marker.textContent=hgL('Se încarcă lecțiile clasei…','Loading the lessons for this year…');
 host?.append(marker);
 const still=()=>hgJourney.subject===subject&&hgJourney.country===country&&hgJourney.level===stage&&String(hgJourney.grade||'')===grade;
 const done=()=>{marker.remove()};
 literatureLoadAuthoredCatalog({subject}).then(({catalog})=>{
  const entry=(catalog?.years||[]).find(y=>y.country===country&&y.stage===stage&&y.grade===grade&&Array.isArray(y.languages)&&y.languages.length);
  if(!entry)throw Error('no_national_year');
  const preferred=(typeof state==='object'&&entry.languages.find(l=>l.lang===state.language))||entry.languages[0];
  return literatureLoadNationalYear(entry,preferred.lang,{subject});
 }).then(pack=>{
  done();if(!still())return;
  HG_NATIONAL_YEAR.pack={...pack,subject};
  proceed();
 }).catch(()=>{done();if(still())fallback()});
}

function hgRenderNationalChapters(panel){
 const pack=hgNationalPackActive();if(!pack)return false;
 const country=hgCountry?.();
 const where=country?hgL(country.ro,country.en):(educationCountrySelection?.label||pack.country);
 const yearLabel=(document.querySelector?.('.hg-year-tile[aria-current="true"]')?.textContent)||
  (/^\d+$/.test(pack.grade)?hgL('Clasa a '+pack.grade+'-a','Grade '+pack.grade):
   /^uni-ba-[1-4]$/.test(pack.grade)?hgL('Licență · anul '+['I','II','III','IV'][Number(pack.grade.slice(-1))-1],'Bachelor · Year '+pack.grade.slice(-1)):pack.grade);
 const university=/^uni-/.test(String(pack.grade));
 panel.append(hgText('p',where+' · '+yearLabel));
 panel.append(hgText('p',university?
  hgL('Lecțiile urmează disciplinele fundamentale comune ale programelor de licență (sinteză orientativă; fiecare facultate are planul propriu). Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the core subjects shared by bachelor programmes (advisory synthesis; each faculty has its own plan), with original step-by-step explanations, exercises and tests with answers.'):
  hgL('Lecțiile urmează programa școlară oficială și unitățile manualelor. Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
  'Lessons follow the official curriculum and textbook units, with original step-by-step explanations, exercises and tests with answers.')));
 if(pack.source){const link=hgText('a',university?hgL('Standarde ARACIS · sursă','ARACIS standards · source'):hgL('Programa școlară · sursă oficială','Official curriculum source'));link.href=pack.source;link.target='_blank';link.rel='noopener noreferrer';panel.append(link)}
 const units=Array.isArray(pack.units)&&pack.units.length?pack.units:[{title:hgL('Lecții','Lessons'),keys:Object.keys(pack.chapters||{})}];
 let n=0;
 for(const unit of units){
  const band=document.createElement('section');band.className='hg-national-unit';
  band.append(hgText('h3',unit.title));
  const holder=document.createElement('div');holder.className='hg-choice-list hg-national-lessons';
  for(const key of unit.keys){
   const row=pack.chapters?.[key]?.[pack.language];if(!row)continue;n++;
   holder.append(hgBtn(n+'. '+row.title,()=>{hgJourney.topic=key;hgJourney.showSolutions=false;hgOpen('lesson')},'secondary-btn hg-choice hg-national-lesson'));
  }
  band.append(holder);panel.append(band);
 }
 return true;
}

function hgRenderNationalLesson(panel){
 const pack=hgNationalPackActive();if(!pack)return false;
 const key=String(hgJourney.topic||''),row=pack.chapters?.[key]?.[pack.language];
 if(!row)return false;
 const unit=(pack.units||[]).find(u=>u.keys.includes(key));
 panel.append(hgText('h3',row.title));
 if(unit)panel.append(hgText('p',unit.title));
 panel.append(hgText('p',hgL('Alege o activitate. Materialul se deschide într-o fereastră separată și funcționează fără internet după prima încărcare.',
  'Choose an activity. The material opens in a separate reader and works offline after the first load.')));
 const out=document.createElement('div');out.className='hg-national-output';
 const modes=[['lesson',hgL('📘 Teorie','📘 Theory')],['examples',hgL('🔎 Exemple','🔎 Examples')],['exercises',hgL('✏️ Exerciții','✏️ Exercises')],['test',hgL('✅ Test cu răspunsuri','✅ Test with answers')]];
 const actions=document.createElement('div');actions.className='hg-choice-list hg-national-actions';
 for(const [mode,label] of modes){
  actions.append(hgBtn(label,()=>{
   let material=null;
   try{material=literatureNationalYearMaterial({pack,country:pack.country,stage:pack.stage,grade:pack.grade,topicKey:key,mode})}catch{}
   if(!material){out.replaceChildren(hgText('p',hgL('Materialul nu a putut fi pregătit. Revino la lecții și deschide din nou.','The material could not be prepared. Go back to the lessons and open it again.')));return}
   eduNationalShowMaterial(row.title,material.text,out,pack.language);
   try{if(typeof hgRemember==='function')hgRemember(mode)}catch{}
  },'secondary-btn hg-choice hg-national-action'));
 }
 panel.append(actions,out);
 return true;
}

export const EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT='const HG_NATIONAL_YEAR={pack:null};\n'+[
 hgNationalPackActive,hgWithNationalYear,hgRenderNationalChapters,hgRenderNationalLesson
].map(f=>f.toString()).join('\n')+
// Shared opener lives in its own module and is referenced here only as a
// browser global, so the Worker bundler cannot rename the call sites.
'\n'+EDUCATION_NATIONAL_READER_SCRIPT;
