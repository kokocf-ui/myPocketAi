// National year packs for Computing (Informatics): the same engine as
// Literature / History / Geography. Packs live in
// public/education/computing/authored/ (catalog.json + <CC>/<lang>-<year>.json,
// schema mypocket-literature-authored/v2), are loaded with
// literatureLoadAuthoredCatalog/literatureLoadNationalYear({subject:'computing'})
// and rendered by literatureNationalYearMaterial in the shared material reader.
// Romania: grade 5-8 "Informatică și TIC"; high school has two tracks per
// year (mate-info intensive Informatics = '9'..'12', TIC for the other
// profiles = 'tic-9'..'tic-12'); university = 'uni-ba-1'..'uni-ba-3'.
// Countries/years without a pack keep the existing branches and chapters.
// Every function is serialized into the browser script: keep them closed.

function computingNationalRoman(grade){
 return ({'5':'V','6':'VI','7':'VII','8':'VIII','9':'IX','10':'X','11':'XI','12':'XII'})[String(grade)]||String(grade);
}

function computingNationalYearLabel(grade){
 const g=String(grade||'');
 if(/^uni-ba-[1-4]$/.test(g)){const n=Number(g.slice(-1));return computingLabel('Licență · anul '+['I','II','III','IV'][n-1],'Bachelor · Year '+n)}
 if(/^tic-\d+$/.test(g))return computingLabel('Clasa a '+computingNationalRoman(g.slice(4))+'-a · TIC','Grade '+g.slice(4)+' · ICT');
 if(['9','10','11','12'].includes(g))return computingLabel('Clasa a '+computingNationalRoman(g)+'-a · Informatică','Grade '+g+' · Computer science');
 return computingLabel('Clasa a '+computingNationalRoman(g)+'-a','Grade '+g);
}

function computingNationalTrackLabel(grade){
 const g=String(grade||'');
 if(/^uni-ba-/.test(g))return computingNationalYearLabel(g);
 if(/^tic-/.test(g))return computingLabel('💻 TIC — Tehnologia informației și a comunicațiilor (celelalte profiluri)','💻 ICT — information and communication technology (other profiles)');
 return computingLabel('🧮 Informatică — matematică-informatică, intensiv informatică','🧮 Computer science — mathematics-informatics, intensive');
}

function computingNationalEntries(catalog){
 const country=educationCountrySelection.code,level=computingJourney.level,grade=String(computingJourney.grade||'');
 const years=(catalog?.years||[]).filter(y=>y.country===country&&y.stage===level&&Array.isArray(y.languages)&&y.languages.length);
 if(level==='advanced')return years.filter(y=>/^uni-ba-\d$/.test(y.grade));
 return years.filter(y=>y.grade===grade||y.grade==='tic-'+grade);
}

function computingWithNational(fallback){
 COMPUTING_NATIONAL.pack=null;COMPUTING_NATIONAL.entries=[];
 const country=educationCountrySelection.code,level=computingJourney.level,grade=String(computingJourney.grade||'');
 if(typeof literatureLoadAuthoredCatalog!=='function'||typeof literatureLoadNationalYear!=='function'||!country||country==='OTHER'){fallback();return}
 const host=document.getElementById('moduleContent');
 const marker=document.createElement('p');marker.className='computing-national-loading';marker.setAttribute('role','status');
 marker.textContent=computingLabel('Se încarcă lecțiile clasei…','Loading the lessons for this year…');
 host?.append(marker);
 const still=()=>computingJourney.level===level&&String(computingJourney.grade||'')===grade&&educationCountrySelection.code===country;
 literatureLoadAuthoredCatalog({subject:'computing'}).then(({catalog})=>{
  marker.remove();if(!still())return;
  const entries=computingNationalEntries(catalog);
  if(!entries.length){fallback();return}
  COMPUTING_NATIONAL.entries=entries;
  if(entries.length===1)computingOpenNationalYear(entries[0],fallback);
  else computingOpen('national-tracks');
 }).catch(()=>{marker.remove();if(still())fallback()});
}

function computingOpenNationalYear(entry,fallback){
 const preferred=(typeof state==='object'&&entry.languages.find(l=>l.lang===state.language))||entry.languages[0];
 literatureLoadNationalYear(entry,preferred.lang,{subject:'computing'}).then(pack=>{
  COMPUTING_NATIONAL.pack=pack;computingJourney.topic=null;computingOpen('national-chapters');
 }).catch(()=>{(fallback||(()=>computingOpen('paths')))()});
}

function computingNationalButton(text,fn){
 const b=computingBtn(text,fn,'secondary-btn lit-option computing-national-choice');
 b.style.cssText='display:block;width:100%;margin:6px 0;white-space:normal;text-align:left;box-sizing:border-box;';
 return b;
}

function computingRenderNationalTracks(panel){
 const entries=COMPUTING_NATIONAL.entries||[];
 if(!entries.length){computingOpen('levels');return true}
 computingParagraph(panel,educationCountrySelection.label+' · '+(computingJourney.level==='advanced'?
  computingLabel('Facultatea de Informatică / Matematică și Informatică','Faculty of Computer Science / Mathematics and Computer Science'):
  computingLabel('Clasa a '+computingNationalRoman(computingJourney.grade)+'-a','Grade '+computingJourney.grade)));
 if(computingJourney.level!=='advanced')computingParagraph(panel,computingLabel(
  'La liceu, Informatica diferă după profil: la matematică-informatică intensiv se studiază programarea și algoritmii, iar la celelalte profiluri se studiază TIC. Alege traseul tău.',
  'In high school the subject depends on the profile: intensive mathematics-informatics studies programming and algorithms; the other profiles study ICT. Choose your track.'));
 const list=document.createElement('div');list.className='computing-national-tracks';
 for(const entry of entries)list.append(computingNationalButton(computingNationalTrackLabel(entry.grade),()=>computingOpenNationalYear(entry,()=>computingOpen('paths'))));
 panel.append(list);
 return true;
}

function computingRenderNationalChapters(panel){
 const pack=COMPUTING_NATIONAL.pack;if(!pack){computingOpen('levels');return true}
 const university=/^uni-/.test(String(pack.grade));
 computingParagraph(panel,educationCountrySelection.label+' · '+computingNationalYearLabel(pack.grade));
 computingParagraph(panel,university?
  computingLabel('Lecțiile urmează disciplinele fundamentale comune ale programelor de licență în Informatică (sinteză orientativă; fiecare facultate are planul propriu). Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the core subjects shared by Computer Science bachelor programmes (advisory synthesis; each faculty has its own plan), with original step-by-step explanations, exercises and tests with answers.'):
  computingLabel('Lecțiile urmează programa școlară oficială și unitățile manualelor. Explicațiile sunt originale, pas cu pas, cu exerciții și teste cu răspunsuri.',
   'Lessons follow the official curriculum and textbook units, with original step-by-step explanations, exercises and tests with answers.'));
 if(pack.source){const link=computingEl('a',university?computingLabel('Standarde ARACIS · sursă','ARACIS standards · source'):computingLabel('Programa școlară · sursă oficială','Official curriculum source'));link.href=pack.source;link.target='_blank';link.rel='noopener noreferrer';panel.append(link)}
 const units=Array.isArray(pack.units)&&pack.units.length?pack.units:[{title:computingLabel('Lecții','Lessons'),keys:Object.keys(pack.chapters||{})}];
 let n=0;
 for(const unit of units){
  const band=document.createElement('section');band.className='computing-national-unit';
  band.append(computingEl('h3',unit.title));
  for(const key of unit.keys){
   const row=pack.chapters?.[key]?.[pack.language];if(!row)continue;n++;
   band.append(computingNationalButton(n+'. '+row.title,()=>{computingJourney.topic=key;computingOpen('national-lesson')}));
  }
  panel.append(band);
 }
 const extra=computingBtn(computingLabel('🧭 Alte teme de informatică (traseu orientativ)','🧭 More computing topics (advisory pathway)'),()=>computingOpen('paths'),'secondary-btn computing-national-more');
 extra.style.cssText='width:100%;margin-top:14px;white-space:normal;';
 panel.append(extra);
 return true;
}

function computingRenderNationalLesson(panel){
 const pack=COMPUTING_NATIONAL.pack;if(!pack){computingOpen('levels');return true}
 const key=String(computingJourney.topic||''),row=pack.chapters?.[key]?.[pack.language];
 if(!row){computingOpen('national-chapters');return true}
 const unit=(pack.units||[]).find(u=>u.keys.includes(key));
 panel.append(computingEl('h3',row.title));
 if(unit)computingParagraph(panel,unit.title);
 computingParagraph(panel,computingLabel('Alege o activitate. Materialul se deschide într-o fereastră separată și funcționează fără internet după prima încărcare.',
  'Choose an activity. The material opens in a separate reader and works offline after the first load.'));
 const out=document.createElement('div');out.className='computing-national-output';
 const modes=[['lesson',computingLabel('📘 Teorie','📘 Theory')],['examples',computingLabel('🔎 Exemple','🔎 Examples')],['exercises',computingLabel('✏️ Exerciții','✏️ Exercises')],['test',computingLabel('✅ Test cu răspunsuri','✅ Test with answers')]];
 for(const [mode,label] of modes){
  panel.append(computingNationalButton(label,()=>{
   const material=literatureNationalYearMaterial({pack,country:pack.country,stage:pack.stage,grade:pack.grade,topicKey:key,mode});
   if(!material)return;
   let shown=false;
   try{shown=typeof litShowMaterialReader==='function'&&litShowMaterialReader(row.title,material.text)}catch{shown=false}
   if(!shown){
    out.replaceChildren();
    if(typeof renderStudyBlocks==='function')renderStudyBlocks(out,material.text);
    else computingParagraph(out,material.text);
   }
  }));
 }
 const keys=(pack.units||[]).flatMap(u=>u.keys),next=keys[keys.indexOf(key)+1];
 if(next){const b=computingBtn(computingLabel('Lecția următoare →','Next lesson →'),()=>{computingJourney.topic=next;computingOpen('national-lesson')},'secondary-btn computing-national-next');b.style.cssText='width:100%;margin-top:14px;white-space:normal;';panel.append(b)}
 panel.append(out);
 return true;
}

export const COMPUTING_NATIONAL_PACKS_SCRIPT='const COMPUTING_NATIONAL={entries:[],pack:null};\n'+[
 computingNationalRoman,computingNationalYearLabel,computingNationalTrackLabel,computingNationalEntries,computingWithNational,
 computingOpenNationalYear,computingNationalButton,computingRenderNationalTracks,computingRenderNationalChapters,computingRenderNationalLesson
].map(f=>f.toString()).join('\n');
