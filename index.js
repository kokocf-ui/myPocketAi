function chemistryAtomShells(z){
 // Common school-level shell model for Z <= 30, with Cr/Cu exceptions represented.
 const layouts=['1','2','2,1','2,2','2,3','2,4','2,5','2,6','2,7','2,8',
 '2,8,1','2,8,2','2,8,3','2,8,4','2,8,5','2,8,6','2,8,7','2,8,8',
 '2,8,8,1','2,8,8,2','2,8,9,2','2,8,10,2','2,8,11,2','2,8,13,1',
 '2,8,13,2','2,8,14,2','2,8,15,2','2,8,16,2','2,8,18,1','2,8,18,2'];
 return z<=layouts.length?layouts[z-1].split(',').map(Number):null;
}
function chemistryVisualBuild(kind,question){
 if(!kind)return null;
 const box=document.createElement('section');box.className='chem-visual';
 const title=document.createElement('h3');
 const ns='http://www.w3.org/2000/svg';
 const svgEl=(tag,attrs,parent,txt)=>{
  const n=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,String(v));
  if(txt!==undefined)n.textContent=txt;
  parent.append(n);return n;
 };
 const note=document.createElement('p');note.className='chem-visual-note';
 const addTitle=(ro,en)=>{title.textContent=learningLabel(ro,en);box.append(title)};
 if(kind==='periodic'){
  addTitle('Tabloul periodic al elementelor — 118 elemente','Periodic table — 118 elements');
  const detail=document.createElement('p');detail.className='chem-element-detail';
  detail.textContent=learningLabel('Atinge un element pentru numărul său atomic.','Tap an element to see its atomic number.');
  const scroll=document.createElement('div');scroll.className='chem-periodic-scroll';
  const table=document.createElement('div');table.className='chem-periodic-grid';
  CHEM_ROWS.forEach((row,ri)=>{
   if(ri>=7){const caption=document.createElement('span');caption.className='chem-periodic-series';caption.textContent=ri===7?'Lantanide':'Actinide';table.append(caption)}
   row.forEach((sym,ci)=>{
    const cell=document.createElement('button');cell.type='button';
    cell.className='chem-periodic-element'+(!sym?' chem-empty':'');
    if(ri>=7)cell.style.gridColumn=String(ci+4);
    if(!sym){cell.disabled=true;cell.tabIndex=-1}
    else{
     const z=CHEM_ELEMENTS.indexOf(sym)+1;
     const num=document.createElement('small');num.textContent=String(z);
     const mark=document.createElement('strong');mark.textContent=sym;
     cell.append(num,mark);
     cell.setAttribute('aria-label',sym+' Z='+z);
     cell.onclick=()=>{detail.textContent=(CHEM_ELEMENT_NAMES[z-1]||sym)+' ('+sym+') · Z = '+z;
      table.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));cell.classList.add('selected')};
     if(z===chemistryElementNumber(question))cell.classList.add('selected');
    }
    table.append(cell);
   });
  });
  const defaultSymbol=CHEM_ELEMENTS[chemistryElementNumber(question)-1];
  const defaultZ=CHEM_ELEMENTS.indexOf(defaultSymbol)+1;
  detail.textContent=(CHEM_ELEMENT_NAMES[defaultZ-1]||defaultSymbol)+' ('+defaultSymbol+') · Z = '+defaultZ;
  scroll.append(table);box.append(scroll,detail);
  note.textContent=learningLabel('Elementele 57–71 și 89–103 sunt prezentate separat în rândurile inferioare. Derulează orizontal sau mărește vizualizarea.','Elements 57–71 and 89–103 appear in the lower rows. Scroll horizontally to inspect the table.');
 }else if(kind==='atom'){
  const normalized=educationTheoryClean(question||'');
  const isAtomicNumber=/numar(?:ul)? atomic|atomic number|z p/.test(normalized);
  const explicit=chemistryElementNumberOrNull(question);
  addTitle(isAtomicNumber? 'Numărul atomic · Z = p':'Structura atomului · particule și straturi',
    isAtomicNumber?'Atomic number · Z = p':'Atom structure · particles and shells');
  const pick=document.createElement('div');pick.className='chem-atom-picker';
  const pickLabel=document.createElement('label');
  pickLabel.textContent=learningLabel('Element demonstrativ: ','Example element: ');
  const selector=document.createElement('select');selector.setAttribute('aria-label',learningLabel('Alege elementul chimic','Choose chemical element'));
  const basic=document.createElement('option');basic.value='general';basic.textContent=learningLabel('Atom general (fără element ales)','General atom (no element selected)');
  selector.append(basic);
  for(let z=1;z<=30;z++){
   const opt=document.createElement('option');opt.value=String(z);
   opt.textContent=(CHEM_ELEMENT_NAMES[z-1]||CHEM_ELEMENTS[z-1])+' ('+CHEM_ELEMENTS[z-1]+') · Z='+z;
   selector.append(opt);
  }
  selector.value=explicit&&explicit<=30?String(explicit):'general';
  pickLabel.append(selector);pick.append(pickLabel);box.append(pick);
  const svg=svgEl('svg',{viewBox:'0 0 360 250',role:'img'},box);
  const info=document.createElement('p');info.className='chem-atom-description';
  const legend=document.createElement('p');legend.className='chem-atom-legend';
  box.append(info,legend);
  function renderAtom(){
   svg.replaceChildren();
   const z=Number(selector.value);
   const shells=z?chemistryAtomShells(z):null;
   svg.setAttribute('aria-label',z?'Atom neutru Z='+z:learningLabel('Schemă generală de atom','General atom diagram'));
   if(!shells){
    // Unspecified isotope: do not imply a particular proton/neutron count.
    svgEl('circle',{cx:163,cy:116,r:41,fill:'#193950',stroke:'#b9dbe8','stroke-width':2},svg);
    const nuclei=[[-13,-12,'p⁺','#e79a89'],[13,-12,'n⁰','#c7b4d9'],[-13,14,'p⁺','#e79a89'],[13,14,'n⁰','#c7b4d9']];
    for(const [dx,dy,mark,color] of nuclei){
     svgEl('circle',{cx:163+dx,cy:116+dy,r:13,fill:color},svg);
     svgEl('text',{x:163+dx,y:121+dy,'text-anchor':'middle','font-size':11,fill:'#142638','font-weight':700},svg,mark);
    }
    svgEl('circle',{cx:163,cy:116,r:88,fill:'none',stroke:'#7fbad0','stroke-width':2},svg);
    svgEl('circle',{cx:251,cy:116,r:7,fill:'#6de8f4'},svg);
    svgEl('line',{x1:192,y1:93,x2:286,y2:65,stroke:'#e1f7ff','stroke-width':1.7},svg);
    svgEl('text',{x:285,y:55,'font-size':14,fill:'#f1fbff'},svg,learningLabel('nucleu','nucleus'));
    svgEl('line',{x1:251,y1:116,x2:295,y2:146,stroke:'#e1f7ff','stroke-width':1.7},svg);
    svgEl('text',{x:257,y:163,'font-size':13,fill:'#aef4fb'},svg,'e⁻');
    svgEl('text',{x:19,y:233,'font-size':13,fill:'#e5f5ff'},svg,'p⁺    n⁰    e⁻');
    info.textContent=isAtomicNumber?
      learningLabel('Z este numărul protonilor din nucleu. Selectează un element pentru valoarea exactă.','Z is the number of protons in the nucleus. Select an element for its value.'):
      learningLabel('Protoni (+), neutroni (neutri) în nucleu; electroni (−) în jur. Schema nu atribuie un număr de neutroni.','Protons (+), neutrons (neutral) in nucleus; electrons (−) around it. Neutron count is unspecified.');
    legend.textContent=learningLabel('Particule ilustrative; nu reprezintă un izotop sau un element anume.','Illustrative particles, not a specific isotope or element.');
    return;
   }
   const radii=shells.map((_,i)=>34+i*23);
   radii.forEach((radius,i)=>{
    svgEl('circle',{cx:180,cy:118,r:radius,fill:'none',stroke:'#78adca','stroke-width':1.6},svg);
    for(let k=0;k<shells[i];k++){
     const a=(Math.PI*2*k/shells[i])-Math.PI/2;
     svgEl('circle',{cx:180+Math.cos(a)*radius,cy:118+Math.sin(a)*radius,r:3.5,fill:'#71e2eb'},svg);
    }
   });
   svgEl('circle',{cx:180,cy:118,r:23,fill:'#d67c71',stroke:'#ffe5d1','stroke-width':1.6},svg);
   svgEl('text',{x:180,y:123,'text-anchor':'middle',fill:'#0b2433','font-size':15,'font-weight':700},svg,'Z='+z);
   svgEl('text',{x:14,y:234,fill:'#edfaff','font-size':13},svg,'p⁺='+z+'  e⁻='+z);
   info.textContent=(CHEM_ELEMENT_NAMES[z-1]||CHEM_ELEMENTS[z-1])+' ('+CHEM_ELEMENTS[z-1]+') · Z='+z+' · '+shells.join(' – ')+' e⁻';
   legend.textContent=learningLabel('Atom neutru: '+z+' protoni și '+z+' electroni. Neutronii depind de izotop.','Neutral atom: '+z+' protons and '+z+' electrons. Neutrons depend on isotope.');
  }
  selector.addEventListener('change',renderAtom);renderAtom();
  note.textContent=learningLabel('Model Bohr didactic: straturile nu reprezintă orbite reale. Configurațiile până la Z=30 sunt schematice.','Educational Bohr shell model, not literal electron orbits. Shell diagrams through Z=30 are schematic.');
 }else if(kind==='ph'){
  addTitle('Scara pH · 0–14','pH scale · 0–14');
  const scale=document.createElement('div');scale.className='chem-ph-scale';
  for(let i=0;i<=14;i++){const b=document.createElement('span');b.textContent=String(i);b.style.background='hsl('+(i/14*245)+',67%,38%)';scale.append(b)}
  box.append(scale);
  const p=document.createElement('p');p.textContent=learningLabel('0–6: acid · 7: neutru · 8–14: bazic (la 25 °C, soluții apoase).','0–6: acidic · 7: neutral · 8–14: basic (at 25 °C, aqueous solutions).');box.append(p);
  note.textContent=learningLabel('Scară ilustrativă; pH poate exista în afara intervalului 0–14.','Illustrative scale; pH can extend outside 0–14.');
 }else if(kind==='bond'){
  addTitle('Legături chimice · modele','Chemical bonds · models');
  const svg=svgEl('svg',{viewBox:'0 0 360 180',role:'img','aria-label':'Legătură covalentă H2 și ionică NaCl'},box);
  for(const [x,y,label,color] of [[92,60,'H','#7fcae4'],[143,60,'H','#7fcae4'],[227,60,'Na⁺','#e3c070'],[296,60,'Cl⁻','#81bd82']]){
   svgEl('circle',{cx:x,cy:y,r:25,fill:color},svg);
   svgEl('text',{x,y:y+5,'text-anchor':'middle',fill:'#102333','font-weight':700,'font-size':15},svg,label);
  }
  svgEl('line',{x1:117,y1:60,x2:118,y2:60,stroke:'#fff','stroke-width':4},svg);
  svgEl('text',{x:116,y:123,'text-anchor':'middle',fill:'#e7fbff','font-size':15},svg,'H–H · covalentă');
  svgEl('text',{x:260,y:123,'text-anchor':'middle',fill:'#e7fbff','font-size':15},svg,'Na⁺ Cl⁻ · ionică');
  note.textContent=learningLabel('Scheme idealizate; metalele și structurile complexe necesită modele diferite.','Idealized diagrams; metallic and complex structures require distinct models.');
 }else if(kind==='reaction'){
  addTitle('Reacție chimică · conservarea atomilor','Chemical reaction · atom conservation');
  const line=document.createElement('div');line.className='chem-reaction-line';
  line.textContent='2 H₂ + O₂ → 2 H₂O';box.append(line);
  note.textContent=learningLabel('Exemplu echilibrat: 4 atomi H și 2 atomi O pe fiecare parte. Nu sunt specificate condiții de laborator.','Balanced example: four H and two O atoms on each side. No laboratory conditions implied.');
 }else if(kind==='molecule'){
  addTitle('Molecule · modele 3D','Molecules · 3D models');
  const button=document.createElement('button');button.className='secondary-btn';button.type='button';
  button.textContent=learningLabel('Deschide modelul 3D (H₂O, CO₂, CH₄, NH₃)','Open 3D model (H₂O, CO₂, CH₄, NH₃)');
  button.onclick=scienceChemMoleculeOpen;box.append(button);
  note.textContent=learningLabel('Doar patru modele geometrice validate sunt disponibile.','Only four validated geometry models are available.');
 }
 box.append(note);return box;
}
function chemistryVisualOpen(kind,question){
 document.getElementById('chemistryVisualDialog')?.remove();
 const dialog=document.createElement('dialog');dialog.id='chemistryVisualDialog';
 dialog.className='education-theory-dialog chem-visual-dialog';
 const bar=document.createElement('div');bar.className='education-theory-head';
 const h=document.createElement('h2');h.textContent=learningLabel('Chimie · Reprezentare','Chemistry · Visual');
 const close=document.createElement('button');close.className='secondary-btn';close.type='button';
 close.textContent=learningLabel('← Revenire','← Back');close.onclick=()=>dialog.close();
 bar.append(h,close);
 const visual=chemistryVisualBuild(kind,question);
 dialog.append(bar,visual);dialog.addEventListener('close',()=>dialog.remove());
 document.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}
function chemistryVisualPicker(){
 document.getElementById('chemistryVisualPicker')?.remove();
 const dialog=document.createElement('dialog');dialog.id='chemistryVisualPicker';
 dialog.className='education-theory-dialog chem-visual-dialog';
 const heading=document.createElement('div');heading.className='education-theory-head';
 const title=document.createElement('h2');title.textContent=learningLabel('Reprezentări grafice','Visual models');
 const close=document.createElement('button');close.className='secondary-btn';close.type='button';
 close.textContent=learningLabel('← Revenire','← Back');close.onclick=()=>dialog.close();
 heading.append(title,close);dialog.append(heading);
 for(const [kind,ro,en] of [['periodic','Tabloul periodic','Periodic table'],['atom','Atom și electroni','Atom and electrons'],['bond','Legături chimice','Chemical bonds'],['molecule','Molecule 3D','3D molecules'],['reaction','Reacții','Reactions'],['ph','Scara pH','pH scale']]){
  const btn=document.createElement('button');btn.type='button';btn.className='secondary-btn chemistry-curriculum-row';
  btn.textContent=learningLabel(ro,en);
  btn.onclick=()=>{dialog.close();chemistryVisualOpen(kind,$('scienceEducationText')?.value||'')};dialog.append(btn);
 }
 dialog.addEventListener('close',()=>dialog.remove());
 document.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}

function scienceShowResult(title,body){
 document.getElementById('scienceResultDialog')?.remove();
 const dialog=document.createElement('dialog');dialog.id='scienceResultDialog';
 dialog.className='education-theory-dialog science-result-dialog';
 const head=document.createElement('div');head.className='education-theory-head';
 const h=document.createElement('h2');h.textContent=title;
 const close=document.createElement('button');close.type='button';close.className='secondary-btn';
 close.textContent=learningLabel('← Revenire','← Back');close.onclick=()=>dialog.close();
 head.append(h,close);
 const content=document.createElement('div');content.className='science-result-text';
 content.textContent=body;dialog.append(head,content);
 if(scienceJourney.subject==='chemistry'){
  const query=$('scienceEducationText')?.value||title;
  const kind=chemistryVisualKind(query);
  if(kind){const visual=chemistryVisualBuild(kind,query);if(visual)dialog.append(visual)}
 }
 dialog.addEventListener('close',()=>dialog.remove());
 document.body.append(dialog);
 try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}
async function scienceWorkspaceRun(mode){
 const editor=$('scienceEducationText'),source=editor?.value.trim()||'';
 if(!source){scienceStatus(learningLabel('Scrie exercițiul sau enunțul de studiu.','Type the exercise or learning question.'));return}
 if(scienceRequestController)return;
 const subject=scienceSubjectInfo(),topic=scienceTopicInfo(),level=scienceLevelInfo();
 const selectedSubject=learningLabel(subject?.ro||'',subject?.en||'');
 const selectedChapter=learningLabel(topic?.ro||'',topic?.en||'');
 const selectedLevel=learningLabel(level?.ro||'',level?.en||'');
 const instruction=mode==='solve'?
  learningLabel('Explică și rezolvă pas cu pas, cu verificarea formulelor, unităților și ipotezelor. Nu inventa date. În chimie, conservă atomii și sarcinile și nu inventa condiții de laborator.',
   'Explain and solve step by step, checking formulas, units and assumptions. Do not fabricate data. In chemistry, conserve atoms and charge, and do not invent lab conditions.'):
  learningLabel('Prezintă metoda generală, definițiile și regulile necesare, fără să inventezi măsurători.',
   'Teach the general method, definitions and necessary rules; do not invent measured values.');
 const activeTracks=scienceJourney.subject==='biology'?BIOLOGY_SPECIALTY_DATA:CHEMISTRY_SPECIALTY_DATA;
 const specialty=activeTracks.find(x=>x.id===scienceJourney.specialty);
 const specialtyContext=specialty?learningLabel('; Specializare: ','; Specialization: ')+learningLabel(specialty.ro,specialty.en):'';
 if(scienceJourney.subject==='chemistry'){
  const locallyChecked=CHEMISTRY_SOLVE_VERIFIED(source,mode);
  if(locallyChecked?.verified){
   scienceLastReply=locallyChecked.body;
   scienceStatus(learningLabel('Rezultat calculat și verificat local.','Locally calculated and verified result.'));
   scienceShowResult(learningLabel('Chimie · rezultat verificat','Chemistry · verified result'),locallyChecked.body);
   return;
  }
  if(locallyChecked?.kind==='input'){
   scienceStatus(learningLabel('Verifică valorile și unitățile introduse.','Review the provided values and units.'));return;
  }
 }
 if(scienceJourney.subject==='biology'){
  const locallyChecked=BIOLOGY_SOLVE_VERIFIED(source,mode);
  if(locallyChecked?.verified){
   scienceLastReply=locallyChecked.body;
   scienceStatus(learningLabel('Model biologic calculat și verificat local.','Biology model locally calculated and checked.'));
   scienceShowResult(learningLabel('Biologie · rezultat verificat','Biology · verified result'),locallyChecked.body);
   return;
  }
 }
 const biologicalNotes=scienceJourney.subject==='biology'?learningLabel(
  ' Folosește mecanisme biologice corecte și precizează limitele modelului, variabilitatea și ipotezele. Nu deduce diagnostice, tratamente sau protocoale de laborator dintr-un exemplu.',
  ' Use correct biological mechanisms, with model limits, variability and assumptions. Do not derive diagnoses, treatments or laboratory protocols from a classroom example.') :'';
 const message=learningLabel('Materie: ','Subject: ')+selectedSubject+
  learningLabel('; Nivel: ','; Level: ')+selectedLevel+specialtyContext+
  learningLabel('; Capitol: ','; Chapter: ')+selectedChapter+'. '+
  instruction+biologicalNotes+String.fromCharCode(10)+source;
 const currentStage=scienceJourney.stage,subjectId=scienceJourney.subject,topicId=scienceJourney.topic,specialtyId=scienceJourney.specialty;
 const controller=new AbortController();scienceRequestController=controller;
 scienceStatus(learningLabel('Se pregătește explicația…','Preparing explanation…'));
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message,language:state.language,module:'assistant',history:[]}),
   signal:controller.signal
  });
  const data=await response.json();
  if(!response.ok||data.status!=='success'||typeof data.reply!=='string'||!data.reply.trim())
   throw new Error('response_unavailable');
  if(controller.signal.aborted||scienceJourney.stage!==currentStage||
     scienceJourney.subject!==subjectId||scienceJourney.topic!==topicId||scienceJourney.specialty!==specialtyId)return;
  scienceLastReply=data.reply.trim().slice(0,12000);
  scienceStatus(learningLabel('Explicație disponibilă.','Explanation available.'));
  scienceShowResult(
   mode==='solve'?learningLabel('Rezolvare · ','Solution · ')+selectedSubject:
    learningLabel('Metodă · ','Method · ')+selectedSubject,
   scienceLastReply+String.fromCharCode(10,10)+learningLabel(
    'Răspuns AI: verifică formulele și rezultatele înainte de utilizare.',
    'AI answer: check formulas and results before using them.')
  );
 }catch(error){
  if(!controller.signal.aborted)scienceStatus(learningLabel(
   'Nu am primit un răspuns verificabil. Exercițiul a fost păstrat.',
   'No response was received. Your exercise was preserved.'));
 }finally{
  if(scienceRequestController===controller)scienceRequestController=null;
 }
}
function sciencePhotoReview(text){
 document.getElementById('sciencePhotoDialog')?.remove();
 const dialog=document.createElement('dialog');dialog.id='sciencePhotoDialog';
 dialog.className='education-theory-dialog science-result-dialog';
 const head=document.createElement('div');head.className='education-theory-head';
 const title=document.createElement('h2');title.textContent=learningLabel('Verifică fotografia','Review photograph');
 const close=document.createElement('button');close.type='button';close.className='secondary-btn';
 close.textContent=learningLabel('← Revenire','← Back');close.onclick=()=>dialog.close();
 head.append(title,close);
 const note=document.createElement('p');
 note.textContent=learningLabel(
  scienceJourney.subject==='biology'?
   'Text OCR neconfirmat. Verifică secvențele ADN, procentele, numerele și termenii biologici înainte de folosire.':
   'Text OCR neconfirmat. Verifică fiecare coeficient, simbol, indice și sarcină chimică înainte de folosire.',
  scienceJourney.subject==='biology'?
   'Unverified OCR: check DNA sequences, percentages, numbers and biological terms before using.':
   'Unverified OCR text. Check each coefficient, symbol, subscript and ionic charge before use.');
 const field=document.createElement('textarea');field.className='science-photo-editor';
 field.value=String(text||'').slice(0,3500);
 field.placeholder=learningLabel('Scrie aici dacă imaginea nu a fost citită.','Type here if the image could not be read.');
 const confirm=document.createElement('button');confirm.type='button';
 confirm.className='primary-btn';confirm.textContent=learningLabel('Confirmă transcrierea','Confirm transcription');
 confirm.onclick=()=>{
  const editor=$('scienceEducationText');
  if(!editor||!field.value.trim()){scienceStatus(learningLabel('Nu există text de confirmat.','No text to confirm.'));return}
  editor.value=field.value.trim().slice(0,3500);
  editor.dispatchEvent(new Event('input',{bubbles:true}));dialog.close();
 };
 dialog.append(head,note,field,confirm);
 dialog.addEventListener('close',()=>dialog.remove());
 document.body.append(dialog);
 try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}
async function sciencePhotoFile(file){
 if(!file)return;
 if(!file.type.startsWith('image/')||file.size>12*1024*1024){
  scienceStatus(learningLabel('Alege o imagine de maximum 12 MB.','Choose an image up to 12 MB.'));return;
 }
 let url='';
 try{
  if(typeof TextDetector!=='function')throw new Error('ocr_unavailable');
  url=URL.createObjectURL(file);
  const img=new Image();img.src=url;await img.decode();
  const detector=new TextDetector(),lines=await detector.detect(img);
  sciencePhotoReview((lines||[]).map(x=>x.rawValue||'').join(String.fromCharCode(10)));
 }catch{sciencePhotoReview('')}
 finally{if(url)URL.revokeObjectURL(url)}
}
function scienceOpenWorkspace(){
 const host=$('moduleContent');
 const topic=scienceTopicInfo(),subject=scienceSubjectInfo();
 const toolbar=document.createElement('div');toolbar.className='education-toolbar science-work-toolbar';
 const back=document.createElement('button');back.type='button';
 back.className='secondary-btn science-back-btn';back.textContent=learningLabel('← Înapoi','← Back');back.onclick=scienceBack;
 const voice=document.createElement('button');voice.type='button';voice.id='scienceDictation';voice.className='secondary-btn';
 voice.textContent=learningLabel('🎙 Dictare','🎙 Dictate');voice.setAttribute('aria-pressed','false');voice.onclick=scienceVoiceToggle;
 const read=document.createElement('button');read.type='button';read.className='secondary-btn';
 read.textContent=learningLabel('🔊 Citire','🔊 Read');read.onclick=scienceRead;
 toolbar.append(back,voice,read);
 if(scienceJourney.subject==='chemistry'){
  const theory=document.createElement('button');theory.type='button';
  theory.className='secondary-btn';theory.textContent=learningLabel('📖 Teorie','📖 Theory');
  theory.onclick=()=>{
   chemistryCurriculumPreset={level:scienceJourney.level,topic:scienceJourney.topic};
   chemistryCurriculumPreset.specialty=scienceJourney.specialty;
   chemistryCurriculumOpen();
  };
  toolbar.append(theory);
 }else if(scienceJourney.subject==='biology'){
  const theory=document.createElement('button');theory.type='button';
  theory.className='secondary-btn';theory.textContent=learningLabel('📖 Teorie','📖 Theory');
  theory.onclick=()=>{
   biologyCurriculumPreset={level:scienceJourney.level,topic:scienceJourney.topic,specialty:scienceJourney.specialty};
   biologyCurriculumOpen();
  };
  toolbar.append(theory);
 }else if(scienceJourney.subject==='physics'){
  const theory=document.createElement('button');theory.type='button';
  theory.className='secondary-btn';theory.textContent=learningLabel('📖 Teorie','📖 Theory');
  theory.onclick=()=>educationTheoryOpen('physics',scienceJourney.level);
  toolbar.append(theory);
 }
 const workspace=document.createElement('div');
 workspace.id='scienceEducationWorkspace';
 workspace.className='education-math-workspace science-education-workspace';
 const heading=document.createElement('div');heading.className='math-entry-heading';
 const label=document.createElement('label');label.htmlFor='scienceEducationText';
 label.textContent=learningLabel('Exercițiu','Exercise')+' · '+learningLabel(topic?.ro||'',topic?.en||'');
 const newTask=document.createElement('button');newTask.type='button';
 newTask.className='secondary-btn math-new-task';
 newTask.textContent=learningLabel('＋ Conversație nouă','＋ New conversation');
 newTask.onclick=()=>{
  scienceVoiceStop();scienceStopRequest();scienceLastReply='';
  const field=$('scienceEducationText');if(field){field.value='';field.scrollTop=0;field.blur()}
  scienceDraftSave('');scienceStatus('');
  editor.style.removeProperty('height');editor.style.removeProperty('max-height');
  requestAnimationFrame(()=>{scienceEditorGrow(editor);scienceFitViewport();document.querySelector('main.page')?.scrollTo(0,0)});
 };
 heading.append(label,newTask);
 const editor=document.createElement('textarea');
 editor.id='scienceEducationText';editor.rows=6;editor.maxLength=3500;
 editor.value=scienceDraftRead();
 editor.placeholder=learningLabel('Introdu un exercițiu, o formulă sau un enunț…','Enter an exercise, formula or question…');
 editor.setAttribute('aria-label',label.textContent);
 editor.addEventListener('input',()=>{scienceDraftSave(editor.value);scienceStatus('');requestAnimationFrame(()=>{scienceFitViewport();scienceEditorGrow(editor);mathEditorFollowCaret(editor)})});
 for(const type of ['focus','click','keyup','select','compositionend'])
  editor.addEventListener(type,()=>requestAnimationFrame(()=>{scienceFitViewport();scienceEditorGrow(editor);mathEditorFollowCaret(editor)}));
 requestAnimationFrame(()=>scienceEditorGrow(editor));
 const status=document.createElement('small');status.id='scienceEducationStatus';status.setAttribute('role','status');
 const actions=document.createElement('div');actions.className='education-math-actions science-education-actions';
 const solve=document.createElement('button');solve.type='button';solve.className='primary-btn';
 solve.textContent=learningLabel('🧩 Rezolvă pas cu pas','🧩 Solve step by step');
 solve.onclick=()=>scienceWorkspaceRun('solve');
 const method=document.createElement('button');method.type='button';method.className='secondary-btn';
 method.textContent=learningLabel('🎓 Explică metoda','🎓 Explain method');
 method.onclick=()=>scienceWorkspaceRun('explain');
 actions.append(solve,method);
 const tools=document.createElement('div');tools.className='science-work-tools';
 const cameraInput=document.createElement('input');cameraInput.type='file';cameraInput.accept='image/*';cameraInput.hidden=true;cameraInput.setAttribute('capture','environment');
 const fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='image/*';fileInput.hidden=true;
 cameraInput.onchange=()=>sciencePhotoFile(cameraInput.files?.[0]);
 fileInput.onchange=()=>sciencePhotoFile(fileInput.files?.[0]);
 const photo=document.createElement('button');photo.type='button';photo.className='secondary-btn';
 photo.textContent=learningLabel('📷 Foto','📷 Camera');
 photo.onclick=()=>window.PocketAndroidOCR?.postMessage?
  window.PocketAndroidOCR.postMessage('camera'):cameraInput.click();
 const album=document.createElement('button');album.type='button';album.className='secondary-btn';
 album.textContent=learningLabel('🖼️ Album','🖼️ Gallery');
 album.onclick=()=>window.PocketAndroidOCR?.postMessage?
  window.PocketAndroidOCR.postMessage('gallery'):fileInput.click();
 tools.append(photo,album,cameraInput,fileInput);
 if(scienceJourney.subject==='chemistry'){
  const toggle=document.createElement('button');toggle.type='button';toggle.className='secondary-btn science-symbol-toggle';
  toggle.textContent=learningLabel('⚗ Simboluri','⚗ Symbols');
  const tray=document.createElement('div');tray.className='science-symbol-tray';tray.hidden=true;
  for(const symbol of ['₂','₃','₄','⁺','⁻','→','⇌','(aq)']){
   const btn=document.createElement('button');btn.type='button';btn.className='secondary-btn';
   btn.textContent=symbol;btn.onclick=()=>scienceInsertSymbol(editor,symbol);tray.append(btn);
  }
  toggle.onclick=()=>{tray.hidden=!tray.hidden};
  const molecular=document.createElement('button');molecular.type='button';molecular.className='secondary-btn';
  molecular.textContent=learningLabel('🧬 Molecule 3D','🧬 3D Molecules');molecular.onclick=scienceChemMoleculeOpen;
  const visuals=document.createElement('button');visuals.type='button';visuals.className='secondary-btn';
  visuals.textContent=learningLabel('📊 Reprezentări','📊 Visual models');visuals.onclick=chemistryVisualPicker;
  tools.append(toggle,molecular,visuals,tray);
 }else if(scienceJourney.subject==='biology'){
  const diagram=document.createElement('button');diagram.type='button';diagram.className='secondary-btn';
  diagram.textContent=learningLabel('🧬 Celulă / ADN 3D','🧬 Cell / 3D DNA');diagram.onclick=scienceBiologyDiagramOpen;
  tools.append(diagram);
 }
 workspace.append(heading,editor,status,actions,tools);
 host.append(toolbar,workspace);
}

function mathJourneyShowChoices(stage){
 const mathSubject=LEARNING_SUBJECTS.find(x=>x[0]==='math');
 if(!mathSubject)return;
 activeLearningSubject=mathSubject;
 mathVoiceStop();mathCloseResults();
 const root=$('view-module'),host=$('moduleContent');
 root.classList.remove('learning-choose');root.classList.add('learning-active','learning-math','math-choice-stage');
 host.replaceChildren();$('moduleLead').textContent='';
 $('moduleTitle').textContent=learningLabel('Matematică','Mathematics');
 const back=document.createElement('button');back.type='button';
 back.className='secondary-btn math-stage-back';
 back.textContent=learningLabel('← Înapoi','← Back');
 back.onclick=stage==='levels'?renderLearningSubjects:()=>{mathJourney.stage='levels';mathJourneyShowChoices('levels')};
 const bar=document.createElement('div');bar.className='education-toolbar';
 bar.append(back);host.append(bar);
 const panel=document.createElement('div');panel.className='math-choice-panel';
 const title=document.createElement('h2');
 title.textContent=stage==='levels'?learningLabel('Alege nivelul','Choose level'):learningLabel('Alege materia','Choose subject');
 const note=document.createElement('p');
 note.textContent=stage==='levels'?learningLabel('Nivelul adaptează explicațiile; poți reveni și îl poți schimba.','The level adapts explanations; you can change it at any time.'):
  learningLabel('Materiile sunt organizate pentru nivelul ales.','Subjects are organized for the selected level.');
 const items=document.createElement('div');items.className='math-choice-list';
 const candidates=stage==='levels'?MATH_LEVELS:mathSubjectsForLevel(mathJourney.level);
 for(const entry of candidates){
  const button=document.createElement('button');button.type='button';
  button.className='secondary-btn math-choice-row';
  const heading=document.createElement('strong');heading.textContent=learningLabel(entry.ro,entry.en);
  const subtitle=document.createElement('small');
  subtitle.textContent=stage==='levels'?learningLabel(entry.scopeRo,entry.scopeEn):
   (entry.figures?learningLabel('Include instrumente geometrice','Includes geometry tools'):'');
  button.append(heading,subtitle);
  button.onclick=()=>{
   if(stage==='levels'){
    mathJourney.level=entry.id;mathJourney.stage='subjects';mathJourneyShowChoices('subjects');
   }else{
    if(mathJourney.topic!==entry.id&&typeof mathFigureDraft!=='undefined')mathFigureDraft=null;
    mathJourney.topic=entry.id;mathJourney.stage='workspace';
    root.classList.remove('math-choice-stage');
    openLearningSubject('math');
   }
  };
  items.append(button);
 }
 if(stage==='subjects'){
  const theory=document.createElement('button');theory.type='button';theory.className='secondary-btn math-choice-row';
  theory.textContent=learningLabel('📖 Teorie – Definiții și teoreme','📖 Theory – Definitions and theorems');
  theory.onclick=()=>educationTheoryOpen('math',mathJourney.level);
  items.prepend(theory);
 }
 panel.append(title,note,items);host.append(panel);
 requestAnimationFrame(mathFitViewport);
}
function mathJourneyDescription(){
 const level=MATH_LEVELS.find(x=>x.id===mathJourney.level);
 const topic=MATH_TOPICS.find(x=>x.id===mathJourney.topic);
 return {level:level?learningLabel(level.ro,level.en):'',topic:topic?learningLabel(topic.ro,topic.en):''};
}
let activeLearningSubject=null;
function learningLabel(ro,en){return state.language==='ro'?ro:en}
function renderLearningSubjects(){
 mathVoiceStop();
 document.querySelector('main.page')?.classList.remove('math-keyboard-visible','science-keyboard-visible');
 document.querySelector('main.page')?.style.removeProperty('--math-content-height');document.querySelector('main.page')?.style.removeProperty('--science-content-height');
 mathCloseResults();
 $('view-module').classList.remove('learning-math','learning-science','science-choice-stage');
 document.getElementById('mathEducationReturn')?.remove();
 $('moduleTitle').textContent=learningLabel('Învățare și educație','Learning and education');
 const root=$('view-module'),host=$('moduleContent');
 mathJourney.stage='levels';
 root.classList.remove('math-choice-stage');
 activeLearningSubject=null;root.classList.add('learning-choose');root.classList.remove('learning-active');
 host.replaceChildren();
 const grid=document.createElement('div');grid.className='education-grid';
 LEARNING_SUBJECTS.forEach(subject=>{
  const btn=document.createElement('button');btn.type='button';btn.className='education-card';
  const art=document.createElement('span');art.className='education-art';art.textContent=subject[1];
  const name=document.createElement('strong');name.textContent=learningLabel(subject[2],subject[3]);
  const details=document.createElement('small');details.textContent=learningLabel(subject[4],subject[5]);
  btn.append(art,name,details);
  btn.onclick=()=>openLearningSubject(subject[0]);
  grid.append(btn);
 });
 host.append(grid);
 $('moduleLead').textContent='';
}
// Educational dictation is isolated from the assistant's chat/voice capture.
function mathFitViewport(){
 const page=document.querySelector('main.page'),view=$('view-module');
 if(!page||!view?.classList.contains('learning-math')||!view.classList.contains('active')){
  page?.classList.remove('math-keyboard-visible');
  page?.style.removeProperty('--math-content-height');return;
 }
 const header=document.querySelector('.app-header'),nav=document.querySelector('.bottom-nav');
 const top=header?.getBoundingClientRect().bottom||0;
 const viewport=window.visualViewport;
 const visibleBottom=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
 const bottom=Math.min(nav?.getBoundingClientRect().top??window.innerHeight,visibleBottom);
 const available=Math.max(155,Math.floor(bottom-top-8));
 page.style.setProperty('--math-content-height',available+'px');
 const focus=document.activeElement?.id==='mathEducationText';
 page.classList.toggle('math-keyboard-visible',Boolean(focus));
}
// Follow the actual insertion point, including soft-wrapped lines, without
// scrolling the entire app every time a character is typed. A temporary
// mirror reproduces the textarea's typography to measure the caret line.
let mathCaretFollowFrame=0;
function mathEditorFollowCaret(editor){
 if(!editor||!editor.isConnected||document.activeElement!==editor)return;
 const position=Number.isInteger(editor.selectionStart)?editor.selectionStart:editor.value.length;
 const style=window.getComputedStyle(editor);
 const mirror=document.createElement('div'),caret=document.createElement('span');
 Object.assign(mirror.style,{
  position:'fixed',left:'-10000px',top:'0',visibility:'hidden',pointerEvents:'none',
  boxSizing:'border-box',width:editor.clientWidth+'px',height:'auto',
  margin:'0',border:'0',padding:style.padding,
  font:style.font,fontFamily:style.fontFamily,fontSize:style.fontSize,
  fontWeight:style.fontWeight,fontStyle:style.fontStyle,
  letterSpacing:style.letterSpacing,lineHeight:style.lineHeight,
  whiteSpace:'pre-wrap',overflowWrap:'anywhere',wordBreak:style.wordBreak,
  tabSize:style.tabSize
 });
 caret.textContent='​';caret.style.display='inline-block';
 mirror.append(document.createTextNode(editor.value.slice(0,position)),caret);
 document.body.append(mirror);
 const caretY=caret.offsetTop,styleHeight=Number.parseFloat(style.lineHeight);
 const lineHeight=Number.isFinite(styleHeight)?styleHeight:(Number.parseFloat(style.fontSize)||16)*1.35;
 mirror.remove();
 const inset=Math.max(4,Number.parseFloat(style.paddingBottom)||0);
 const above=editor.scrollTop+4,below=editor.scrollTop+editor.clientHeight-inset-4;
 if(caretY<above)editor.scrollTop=Math.max(0,caretY-4);
 else if(caretY+lineHeight>below)
  editor.scrollTop=Math.max(0,caretY+lineHeight-editor.clientHeight+inset+4);
 // The virtual keyboard may shrink visualViewport without moving the layout
 // viewport. Scroll only the Mathematics page if the focused input is hidden.
 const viewport=window.visualViewport;
 const rect=editor.getBoundingClientRect();
 const visibleBottom=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
 const visibleTop=viewport?viewport.offsetTop:0;
 const page=document.querySelector('main.page');
 if(page?.classList.contains('math-keyboard-visible')||page?.classList.contains('science-keyboard-visible')){
  if(rect.bottom>visibleBottom-10)page.scrollTop+=rect.bottom-visibleBottom+10;
  else if(rect.top<visibleTop+8)page.scrollTop-=visibleTop+8-rect.top;
 }
}
function mathEditorScheduleCaretFollow(editor){
 if(mathCaretFollowFrame)cancelAnimationFrame(mathCaretFollowFrame);
 mathCaretFollowFrame=requestAnimationFrame(()=>{
  mathCaretFollowFrame=0;
  if(editor?.isConnected&&$('mathEducationText')===editor){
   mathFitViewport();
   mathEditorFollowCaret(editor);
  }
 });
}

window.addEventListener('resize',()=>{
 mathFitViewport();
 if(document.activeElement?.id==='mathEducationText')
  mathEditorScheduleCaretFollow(document.activeElement);
},{passive:true});
window.visualViewport?.addEventListener('resize',()=>{
 mathFitViewport();
 if(document.activeElement?.id==='mathEducationText')
  mathEditorScheduleCaretFollow(document.activeElement);
},{passive:true});
let mathVoiceListening=false;
let mathVoiceSession=null;
// New APKs expose whole-utterance Maths audio capture, separate from system ASR.
let mathPilotToken=''; // memory only; never write credentials to storage
let mathPilotRecording=false;
let mathPilotAwaiting=false;
let mathPilotRequest=null;
let mathPilotCaptureId=0;
let mathPilotParts=[];
let mathPilotExpected=0;
function mathPilotAvailable(){return typeof window.PocketAndroidMathAudio?.postMessage==='function'}
function mathPilotCommand(action){
 try{window.PocketAndroidMathAudio.postMessage(JSON.stringify({action}));return true}catch{return false}
}
function mathPilotCancel(){
 if(mathPilotRequest){mathPilotRequest.abort();mathPilotRequest=null}
 if(mathPilotRecording||mathPilotAwaiting)mathPilotCommand('stopMathAudio');
 mathPilotRecording=false;mathPilotAwaiting=false;
 mathPilotCaptureId=0;mathPilotParts=[];mathPilotExpected=0;
 $('mathDictation')?.setAttribute('aria-pressed','false');
}
function mathPilotStart(){
 if(!mathPilotAvailable())return;
 // The user has explicitly accepted remote transcription in the styled modal.
 stopSpeech();stopRecognition();state.dictationMode=false;state.voiceMode=false;
 setPressed($('dictationBtn'),false);setPressed($('voiceBtn'),false);
 mathPilotAwaiting=false;mathPilotRecording=true;
 mathPilotCaptureId=0;mathPilotParts=[];mathPilotExpected=0;
 $('mathDictation')?.setAttribute('aria-pressed','true');
 mathVoiceStatus(learningLabel('Înregistrare continuă (maximum 30 secunde). Apasă iar Dictare pentru transcriere.','Continuous recording (max 30 seconds). Tap Dictate again to transcribe.'));
 if(!mathPilotCommand('startMathAudio')){
  mathPilotCancel();mathVoiceStatus(learningLabel('Nu pot porni înregistrarea audio Android.','Cannot start Android audio capture.'));
 }
}
function mathPilotToggle(){
 if(mathPilotRecording){
  mathPilotRecording=false;mathPilotAwaiting=true;
  $('mathDictation')?.setAttribute('aria-pressed','false');
  mathVoiceStatus(learningLabel('Pregătesc înregistrarea pentru transcriere…','Preparing recording for transcription…'));
  if(!mathPilotCommand('stopMathAudio'))mathPilotCancel();
  return;
 }
 if(mathPilotAwaiting||mathPilotRequest)return;
 pocketModal({
  title:learningLabel('Test de dictare matematică (Whisper)','Math dictation trial (Whisper)'),
  message:learningLabel(
   'Înregistrăm maximum 30 de secunde. Când apeși din nou Dictare, vocea este trimisă securizat la Cloudflare Workers AI pentru transcriere, fără stocare în Pocket AI. Introdu cheia privată de test configurată în Cloudflare. Poți renunța prin Anulare.',
   'Record up to 30 seconds. When you tap Dictate again, audio is securely sent to Cloudflare Workers AI for transcription, without storage in Pocket AI. Enter the private test key configured in Cloudflare. Cancel to opt out.'),
  mode:'secret',value:mathPilotToken,
  onConfirm:key=>{
   if(key.length<32){
    mathVoiceStatus(learningLabel('Cheia pilot trebuie configurată în Cloudflare și să aibă cel puțin 32 de caractere.','The Cloudflare pilot key must have at least 32 characters.'));
    return;
   }
   mathPilotToken=key;mathPilotStart();
  }
 });
}
window.pocketAndroidMathAudioResult=async function(data){
 if(!mathPilotAvailable())return;
 if(data?.status==='recording'){
  if(mathPilotRecording||mathPilotAwaiting){
   mathPilotCaptureId=Number(data.capture_id)||0;
   mathPilotParts=[];mathPilotExpected=0;
  }
  if(mathPilotRecording)mathVoiceStatus(learningLabel('Te înregistrez… Poți face pauze fără întreruperi.','Recording… You may pause without interruption.'));
  return;
 }
 if(data?.status==='chunk'){
  if(!mathPilotCaptureId||Number(data.capture_id)!==mathPilotCaptureId||(!mathPilotRecording&&!mathPilotAwaiting))return;
  const index=Number(data.part_index),count=Number(data.part_count);
  const value=String(data.audio||'');
  data.audio=null;
  if(!Number.isInteger(index)||!Number.isInteger(count)||count<1||count>35||
     index<0||index>=count||value.length>48000)return;
  if(mathPilotExpected&&mathPilotExpected!==count)return;
  mathPilotExpected=count;mathPilotParts[index]=value;
  return;
 }
 if(data?.status==='permissionDenied'){
  mathPilotCancel();
  mathVoiceStatus(learningLabel('Permite accesul la microfon în setările Android pentru a testa dictarea.','Allow microphone access in Android settings to test dictation.'));
  return;
 }
 if(data?.status==='error'){
  mathPilotCancel();
  mathVoiceStatus(learningLabel('Microfonul nu a putut înregistra. Verifică permisiunea și reîncearcă; poți folosi și tastatura sau fotografia.','Microphone recording failed. Check permission and retry, or type or photograph the exercise.'));
  return;
 }
 if(data?.status!=='captured')return;
 if(Number(data.capture_id)!==mathPilotCaptureId||!mathPilotCaptureId)return;
 // Android auto-stops at 30 seconds; this also completes the consented trial.
 if(mathPilotRecording){
  mathPilotRecording=false;mathPilotAwaiting=true;
  $('mathDictation')?.setAttribute('aria-pressed','false');
 }
 if(!mathPilotAwaiting)return;
 mathPilotAwaiting=false;
 const received=mathPilotParts.filter(part=>typeof part==='string');
 const complete=mathPilotExpected>0&&received.length===mathPilotExpected&&
  mathPilotParts.length===mathPilotExpected;
 const payload=complete?mathPilotParts.join(''):'';
 mathPilotParts=[];mathPilotExpected=0;mathPilotCaptureId=0;
 if(payload.length<1200||payload.length>1450000){
  mathVoiceStatus(learningLabel('Înregistrare goală sau prea lungă.','Recording empty or too long.'));
  return;
 }
 const controller=new AbortController();mathPilotRequest=controller;
 const endpoint=CLIENT_CONFIG.apiUrl.replace(/\\/api\\/chat(?:\\?.*)?$/,'/api/math-transcribe');
 mathVoiceStatus(learningLabel('Whisper transcrie exercițiul…','Whisper is transcribing the exercise…'));
 try{
  const response=await fetch(endpoint,{method:'POST',
   headers:{'Content-Type':'application/json','Authorization':'Bearer '+mathPilotToken},
   body:JSON.stringify({audio:payload}),signal:controller.signal,cache:'no-store'});
  const result=await response.json().catch(()=>null);
  if(!response.ok||result?.status!=='success'){
   if(response.status===503)throw new Error('not_configured');
   if(response.status===401)throw new Error('unauthorized');
   throw new Error('unavailable');
  }
  if(mathPilotRequest!==controller)return;
  const raw=String(result.transcript||'').trim();
  const editor=$('mathEducationText');
  if(!editor||!raw||activeLearningSubject?.[0]!=='math')return;
  const previous=editor.value.trim();
  const interpreted=mathSpokenToFormula(raw,previous);
  editor.value=(previous?previous+'\\n':'')+interpreted;
  editor.dispatchEvent(new Event('input',{bubbles:true}));
  mathVoiceStatus(learningLabel('Whisper a transcris: ','Whisper transcribed: ')+raw.slice(0,160)+' — '+learningLabel('Verifică toate semnele înainte de rezolvare.','Check every symbol before solving.'));
 }catch(error){
  if(controller.signal.aborted)return;
  const reason=String(error?.message||'');
  mathVoiceStatus(reason==='not_configured'?
   learningLabel('Whisper nu este activat încă în Cloudflare. Nu am modificat exercițiul.','Whisper is not enabled in Cloudflare. Exercise unchanged.'):
   reason==='unauthorized'?learningLabel('Cheia de test este incorectă.','Incorrect test key.'):
   learningLabel('Transcrierea Whisper nu este disponibilă; poți folosi tastatura/fotografia.','Whisper transcription unavailable; type or photograph instead.'));
 }finally{
  if(mathPilotRequest===controller)mathPilotRequest=null;
 }
};
let mathLastSpokenReply='';
function mathVoiceStatus(text){
 const status=$('mathEducationStatus');
 if(status)status.textContent=text;
}
function mathVoiceClearTimers(session){
 if(!session)return;
 if(session.restartTimer!==null){clearTimeout(session.restartTimer);session.restartTimer=null}
 if(session.watchdog!==null){clearTimeout(session.watchdog);session.watchdog=null}
}
function mathVoiceStop({commitPartial=true}={}){
 mathPilotCancel();
 const session=mathVoiceSession;
 if(session?.active&&commitPartial&&session.partial)mathVoiceAccept(session.partial,session);
 mathVoiceListening=false;
 mathVoiceSession=null;
 mathVoiceClearTimers(session);
 if(session?.active){
  session.active=false;
  if(pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stopListen'});
 }
 const button=$('mathDictation');
 if(button)button.setAttribute('aria-pressed','false');
}
function mathVoiceWatchdog(session){
 if(!session?.active||mathVoiceSession!==session)return;
 if(session.watchdog!==null)clearTimeout(session.watchdog);
 // Android can stop without a final callback. Keep capturing after ordinary
 // pauses, but recover rather than leave a false "listening" indication.
 session.watchdog=setTimeout(()=>{
  if(!session.active||mathVoiceSession!==session)return;
  session.missed++;
  if(session.missed>3){
   mathVoiceStop();
   mathVoiceStatus(learningLabel('Microfonul nu mai răspunde. Apasă Dictare ca să continui.','The microphone stopped responding. Tap Dictate to continue.'));
   return;
  }
  mathVoiceRestart(session,450);
 },8500);
}
function mathVoiceListen(session){
 if(!session?.active||mathVoiceSession!==session)return;
 session.captureId=(session.captureId||0)+1;
 session.mathNegativePartials=[];
 mathVoiceStatus(learningLabel('Te ascult… Dictează exercițiul; poți face pauze.','Listening… Dictate the exercise; pauses are fine.'));
 mathVoiceWatchdog(session);
 if(!pocketNativeVoiceSend({action:'listen',mode:'math',language:session.locale})){
  mathVoiceStop();
  mathVoiceStatus(learningLabel('Nu am putut porni microfonul Android.','Could not start the Android microphone.'));
 }
}
function mathVoiceRestart(session,delay=450){
 if(!session?.active||mathVoiceSession!==session)return;
 mathVoiceClearTimers(session);
 // The native recognizer ends after a phrase on some Android versions.
 // Reopen the same session so a pause does not terminate the whole exercise.
 if(pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stopListen'});
 mathVoiceStatus(learningLabel('Dictare activă — continuă când ești pregătit.','Dictation active — continue when ready.'));
 session.restartTimer=setTimeout(()=>{
  session.restartTimer=null;
  if(session.active&&mathVoiceSession===session)mathVoiceListen(session);
 },delay);
}
function mathVoiceAccept(text,session){
 if(!session?.active||mathVoiceSession!==session)return false;
 let original=collapseRepeatedVoiceWords(String(text||'').trim());
 if(!original)return false;
 // Never discard a legitimately repeated bracket command in a new capture.
 if(session.lastAcceptedCapture===session.captureId){
  if(session.lastRaw===original)return false;
  if(session.lastRaw&&session.lastRaw.startsWith(original+' '))return false;
  if(session.lastRaw&&original.startsWith(session.lastRaw+' ')){
   original=original.slice(session.lastRaw.length).trim();
   if(!original)return false;
  }
 }
 const editor=$('mathEducationText');
 if(!editor)return false;
 const existing=editor.value.trim();
 const formula=mathSpokenToFormula(original,existing);
 if(!formula)return false;
 const newExercise=/^(?:exerci[țt]iul?|problema)\\s+\\d+/iu.test(original);
 editor.value=((existing?existing+(newExercise?'\\n':' '):'')+formula)
  .replace(/(^|[([{=+*/])\\s*-\\s+(\\d+(?:[.,]\\d+)?)/g,'$1 -$2');
 editor.dispatchEvent(new Event('input',{bubbles:true}));
 session.lastRaw=String(text||'').trim();
 session.lastAcceptedCapture=session.captureId;
 return true;
}
function mathSpokenToFormula(input,existing=''){
 const original=collapseRepeatedVoiceWords(String(input||'').trim());
 if(!original)return '';
 const fold=v=>v.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 // Interpret only explicit mathematical vocabulary. Keep unknown words intact.
 const words={
  zero:'0',unu:'1',una:'1',un:'1',doi:'2',doua:'2',trei:'3',patru:'4',cinci:'5',
  sase:'6',sapte:'7',opt:'8',noua:'9',zece:'10',unsprezece:'11',doisprezece:'12',
  treisprezece:'13',paisprezece:'14',cincisprezece:'15',saisprezece:'16',
  saptesprezece:'17',optsprezece:'18',nouasprezece:'19',douazeci:'20',
  treizeci:'30',patruzeci:'40',cincizeci:'50',saizeci:'60',
  saptezeci:'70',optzeci:'80',nouazeci:'90',suta:'100'
 };
 let v=fold(original);
 const isolatedNumber=new RegExp('^(?:'+Object.keys(words).join('|')+')(?:\\\\s+si\\\\s+(?:'+Object.keys(words).join('|')+'))?$').test(v);
 const mathIntent=/(?:\\b(?:egal|plus|minus|negativ\\w*|ori|inmult\\w*|impart\\w*|parantez\\w*|acolad\\w*|patrat|cub|putere\\w*|supra|funct\\w*|ecuat\\w*|radical)\\b|[=+*/()[\\]{}^×÷−–-])/u.test(v);
 if(!mathIntent&&!isolatedNumber)return original;
 // Whisper sometimes inserts comma pauses after operators/bracket names, or
 // a full stop after "egal". These are speech punctuation, not math tokens.
 // Preserve real decimal separators between digits (e.g. 3,5 or 3.5).
 v=v.replace(/[,;:.!?]+/g,(marks,index,source)=>{
  const left=source.slice(0,index).trimEnd();
  const right=source.slice(index+marks.length).trimStart();
  if((marks===','||marks==='.')&&/\\d$/.test(left)&&/^\\d/.test(right))return marks;
  return ' ';
 }).replace(/(\\d)\\s*([,.])\\s*(\\d)/g,'$1$2$3');
 // The speech engine may return "paranteză" twice (without saying "închide"),
 // or convert its spoken name into the pair "()". Record ambiguous commands
 // until we can inspect the mathematical expression around them.
 v=v.replace(/[−–]/g,'-');
 v=v.replace(/(\\(\\)|\\[\\]|\\{\\})(?:\\s*[,;:]?\\s*(deschisa|inchisa)\\b)?/g,(_,pair,position)=>{
  if(position==='inchisa')return pair[1];
  if(position==='deschisa')return pair[0];
  return pair==='()'?'\\uE000':pair==='[]'?'\\uE001':'\\uE002';
 });
 // Named brackets retain their explicit meaning. A bare "paranteză" is
 // resolved as open/close using actual surrounding math, even across chunks.
 v=v.replace(/\\b(?:(deschide|deschid|deschideti|inchide|inchid|inchideti)\\s+(?:o\\s+)?)?(parantez(?:a|e)(?:\\s+(?:rotunda|rotunde|patrata|patrate|dreapta|drepte))?|acolad(?:a|e))(?:\\s*[,;:]?\\s*(deschisa|inchisa))?\\b/g,
   (_,action,spokenShape,position)=>{
    const closing=Boolean(action?.startsWith('inchid')||position==='inchisa');
    const shape=spokenShape.startsWith('acolad')?['{','}']:/patrat|dreapt/.test(spokenShape)?['[',']']:['(',')'];
    if(!action&&!position&&(spokenShape==='paranteza'||spokenShape==='paranteze'))return '\\uE000';
    return shape[Number(closing)];
   });
 v=v.replace(/\\b(?:la|ridicat la)\\s+patrat\\b/g,'^2')
    .replace(/\\b(?:la|ridicat la)\\s+cub\\b/g,'^3')
    .replace(/\\bf\\s+de\\s+x\\b/g,'f(x)')
    .replace(/\\begal(?:\\s+cu)?\\b/g,' = ')
    .replace(/\\bplus\\b/g,' + ').replace(/\\bminus\\b/g,' - ')
    .replace(/\\bnegativ(?:a|ul)?\\b/g,' - ')
    .replace(/\\b(?:inmultit cu|ori)\\b/g,' * ')
    .replace(/\\b(?:impartit la|supra)\\b/g,' / ');
 const keys=Object.keys(words).sort((a,b)=>b.length-a.length);
 v=v.replace(new RegExp('\\\\b(?:'+keys.join('|')+')\\\\b','g'),word=>words[word]);
 // "douăzeci și trei" -> 23, but do not combine unrelated numbers.
 v=v.replace(/\\b([2-9]0)\\s+si\\s+([1-9])\\b/g,(_,t,o)=>String(Number(t)+Number(o)));
 // Keep unary negatives together, including "minus" and "unu" in separate chunks.
 v=v.replace(/(^|[([{=+*/])\\s*-\\s+(\\d+(?:[.,]\\d+)?)/g,'$1 -$2');
 // An unnamed bracket follows the mathematical grammar:
 // with an unmatched opener and a completed operand before it => close;
 // after an operator or another opening bracket => open.
 // Use already dictated text to resolve chunks split by Android.
 let consumed=String(existing||''),cursor=0;
 v=v.replace(/[\\uE000-\\uE002]/g,(marker,pos,whole)=>{
  consumed+=whole.slice(cursor,pos);cursor=pos+marker.length;
  const pair=marker==='\\uE001'?['[',']']:marker==='\\uE002'?['{','}']:['(',')'];
  let depth=0;
  for(const symbol of consumed){
   if(symbol===pair[0])depth++;
   else if(symbol===pair[1])depth=Math.max(0,depth-1);
  }
  const last=consumed.trimEnd().slice(-1);
  const completed=/[0-9a-z)\\]}]/i.test(last);
  const replacement=depth>0&&completed?pair[1]:pair[0];
  consumed+=replacement;
  return replacement;
 });
 return v.replace(/\\s+/g,' ').trim();
}
// Prefer a recognizer hypothesis that explicitly preserves a unary "-1"
// when it otherwise describes the SAME mathematical expression. Never infer
// a sign solely from an equation or from a positive "1".
function mathVoiceChooseTranscript(primary, alternatives, existing=''){
 const first=String(primary||'').trim();
 if(!first||!Array.isArray(alternatives))return first;
 const compact=value=>mathSpokenToFormula(value,existing).replace(/\\s+/g,'');
 const baseline=compact(first);
 const stripUnaryMinus=value=>{
  let corrected=value;
  for(const operator of ['*','/','(','[','{','=','+'])
   corrected=corrected.split(operator+'-').join(operator);
  return corrected;
 };
 for(const candidate of alternatives.slice(0,8)){
  const raw=String(candidate||'').trim();
  if(!raw||raw===first)continue;
  const next=compact(raw);
  if(next!==baseline && stripUnaryMinus(next)===baseline && next!==stripUnaryMinus(next))
   return raw;
 }
 return first;
}
function mathVoiceHandleAndroid(data){
 if(data?.mode!=='math')return false;
 const session=mathVoiceSession;
 if(!session?.active||!mathVoiceListening)return true;
 if(data.status==='listening'){
  session.missed=0;
  mathVoiceWatchdog(session);
  mathVoiceStatus(learningLabel('Te ascult… Spune exercițiul până la capăt.','Listening… Say the entire exercise.'));
  return true;
 }
 if(data.status==='partial'){
  session.missed=0;
  session.partial=String(data.text||'').trim();
  if(/(?:\\bminus\\b|\\bnegativ\\w*\\b|\\*\\s*-\\s*\\d)/iu.test(session.partial)){
   session.mathNegativePartials=session.mathNegativePartials||[];
   if(!session.mathNegativePartials.includes(session.partial))
    session.mathNegativePartials.push(session.partial);
   session.mathNegativePartials=session.mathNegativePartials.slice(-5);
  }
  mathVoiceWatchdog(session);
  mathVoiceStatus(learningLabel('Aud: ','Hearing: ')+session.partial.slice(0,120));
  return true;
 }
 if(data.status==='recognized'){
  mathVoiceClearTimers(session);
  const candidates=[...(Array.isArray(data.alternatives)?data.alternatives:[]),...(session.mathNegativePartials||[])];
  const chosen=mathVoiceChooseTranscript(data.text||session.partial,candidates,$('mathEducationText')?.value||'');
  const possiblyLostMinus=chosen===String(data.text||session.partial).trim() &&
    (session.mathNegativePartials||[]).length>0 &&
    !/(?:\\bminus\\b|\\bnegativ\\w*\\b|\\*\\s*-\\s*\\d)/iu.test(chosen);
  mathVoiceAccept(chosen,session);
  session.partial='';session.mathNegativePartials=[];session.missed=0;session.retries=0;
  if(possiblyLostMinus)mathVoiceStatus(learningLabel('Verifică semnul minus: Android l-a auzit parțial, dar nu l-a confirmat.','Check the minus sign: Android heard it partially but did not confirm it.'));
  // Like Organize/Shopping: one Android recognition chunk is NOT the
  // end of dictation. Keep listening until the user taps Dictare again.
  mathVoiceRestart(session,450);
  return true;
 }
 if(data.status==='error'){
  const message=String(data.text||'');
  mathVoiceClearTimers(session);
  session.retries++;
  if(session.retries<=3&&/error (?:6|7|8)|timeout|no.match/iu.test(message)){
   mathVoiceRestart(session,650);
  }else{
   mathVoiceStop();
   mathVoiceStatus(learningLabel('Dictarea s-a întrerupt. Textul recunoscut a fost păstrat.','Dictation stopped. Recognized text was kept.'));
  }
  return true;
 }
 return true;
}
function mathVoiceToggle(){
 if(mathPilotAvailable()){mathPilotToggle();return}
 if(mathVoiceListening){
  mathVoiceStop();
  mathVoiceStatus(learningLabel('Dictare încheiată. Verifică exercițiul înainte de rezolvare.','Dictation finished. Check the exercise before solving.'));
  return;
 }
 if(!pocketNativeVoiceAvailable()){
  mathVoiceStatus(learningLabel('Dictarea necesită microfonul disponibil în aplicația Android.','Dictation requires the Android microphone.'));
  return;
 }
 stopSpeech();stopRecognition();state.dictationMode=false;state.voiceMode=false;
 setPressed($('dictationBtn'),false);setPressed($('voiceBtn'),false);
 const locale=({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'})[state.language]||'ro-RO';
 const session={active:true,locale,lastRaw:'',partial:'',missed:0,retries:0,watchdog:null,restartTimer:null};
 mathVoiceSession=session;
 mathVoiceListening=true;
 $('mathDictation')?.setAttribute('aria-pressed','true');
 mathVoiceListen(session);
}
function mathReadText(){
 mathVoiceStop();
 const text=mathLastSpokenReply||$('mathEducationText')?.value?.trim()||'';
 if(!text){
  const status=$('mathEducationStatus');
  if(status)status.textContent=learningLabel('Introdu un exercițiu sau obține o rezolvare pentru citire.','Enter an exercise or get a solution to read.');
  return;
 }
 speakText(text);
}

 // Keep the learner's working exercise across solve/graph/method views, module
 // navigation, and Android WebView restarts. Only explicit clearing removes it.
 const MATH_EXERCISE_DRAFT_KEY='mypocketai.math.exercise.draft.v1';
 let mathExerciseDraft=null;
 function mathRestoreDraft(){
  if(mathExerciseDraft!==null)return mathExerciseDraft;
  try{mathExerciseDraft=String(localStorage.getItem(MATH_EXERCISE_DRAFT_KEY)||'').slice(0,3500)}
  catch{mathExerciseDraft=''}
  return mathExerciseDraft;
 }
 function mathRememberDraft(value){
  mathExerciseDraft=String(value||'').slice(0,3500);
  try{localStorage.setItem(MATH_EXERCISE_DRAFT_KEY,mathExerciseDraft)}catch{}
 }

function openLearningSubject(key){
 if(key==='science'){scienceJourneyShowChoices('subjects');return}
 const subject=LEARNING_SUBJECTS.find(x=>x[0]===key);if(!subject)return;
 if(key==='math'&&mathJourney.stage!=='workspace'){
  mathJourneyShowChoices(mathJourney.stage==='subjects'?'subjects':'levels');return;
 }
 activeLearningSubject=subject;
 $('moduleTitle').textContent=key==='math'?
  learningLabel(subject[2],subject[3])+' · '+mathJourneyDescription().topic:
  learningLabel(subject[2],subject[3]);
 const root=$('view-module'),host=$('moduleContent');
 root.classList.remove('learning-choose');root.classList.add('learning-active');
 root.classList.toggle('learning-math',key==='math');
 host.replaceChildren();
 const bar=document.createElement('div');bar.className='education-toolbar';
 const back=document.createElement('button');back.type='button';back.className='secondary-btn';back.textContent=learningLabel('← Înapoi','← Back');back.onclick=()=>{if(key==='math'){mathVoiceStop();mathCloseResults();mathJourney.stage='subjects';mathJourneyShowChoices('subjects')}else renderLearningSubjects()};
 if(key==='math'){
  bar.classList.add('math-navigation');
  back.classList.add('math-back-btn');
  const voices=document.createElement('div');voices.className='math-voice-controls';
  const dictate=document.createElement('button');dictate.type='button';dictate.id='mathDictation';
  dictate.className='secondary-btn';dictate.textContent=learningLabel('🎙️ Dictare','🎙️ Dictate');
  dictate.setAttribute('aria-pressed','false');
  dictate.onclick=mathVoiceToggle;
  const read=document.createElement('button');read.type='button';read.id='mathRead';
  read.className='secondary-btn';read.textContent=learningLabel('🔊 Citire','🔊 Read');
  read.onclick=mathReadText;
  voices.append(dictate,read);bar.append(back,voices);
  const theory=document.createElement('button');theory.type='button';theory.className='secondary-btn education-theory-open';theory.textContent=learningLabel('📖 Teorie','📖 Theory');theory.onclick=()=>educationTheoryOpen('math',mathJourney.level);bar.append(theory);
 }else bar.append(back);
 host.append(bar);
 $('moduleLead').textContent='';
 const actions=document.createElement('div');actions.className='education-photo-actions';
 const photo=document.createElement('button');photo.type='button';photo.className='secondary-btn';photo.textContent=learningLabel('📷 Fotografiere text','📷 Photograph text');
 const pick=document.createElement('button');pick.type='button';pick.className='secondary-btn';pick.textContent=learningLabel('🖼️ Alege fotografie','🖼️ Choose photo');
 const cameraInput=document.createElement('input');cameraInput.type='file';cameraInput.accept='image/*';cameraInput.setAttribute('capture','environment');cameraInput.hidden=true;
 const fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='image/*';fileInput.hidden=true;
 const nativeMathOcrSupported=()=>Boolean(window.PocketAndroidMathOCR?.postMessage);
 photo.onclick=()=>window.PocketAndroidOCR?.postMessage?window.PocketAndroidOCR.postMessage(key==='math'&&nativeMathOcrSupported()?'camera:math':'camera'):cameraInput.click();
 pick.onclick=()=>window.PocketAndroidOCR?.postMessage?window.PocketAndroidOCR.postMessage(key==='math'&&nativeMathOcrSupported()?'gallery:math':'gallery'):fileInput.click();
 cameraInput.onchange=()=>handleLearningPhoto(cameraInput.files?.[0]);
 fileInput.onchange=()=>handleLearningPhoto(fileInput.files?.[0]);
 actions.append(photo,pick,cameraInput,fileInput);if(key!=='math')host.append(actions);
 // One input workspace for Mathematics: no chat composer or extra confirmation.
 if(key==='math'){
  const workspace=document.createElement('div');workspace.id='mathEducationWorkspace';
  workspace.className='education-math-workspace';
  const heading=document.createElement('div');heading.className='math-entry-heading';
  const label=document.createElement('label');label.htmlFor='mathEducationText';
  label.textContent=learningLabel('Exercițiu','Exercise')+' · '+mathJourneyDescription().topic;
  const newTask=document.createElement('button');newTask.type='button';
  newTask.className='secondary-btn math-new-task';newTask.textContent=learningLabel('＋ Conversație nouă','＋ New conversation');
  newTask.onclick=()=>{
   mathVoiceStop();mathCloseResults();mathLastSpokenReply='';const field=$('mathEducationText');
   if(field){field.value='';delete field.dataset.figureStatement;field.blur()}
   mathRememberDraft('');mathFigureDraft=null;mathFigureDraftSummary();
   const notice=$('mathEducationStatus');if(notice)notice.textContent='';
  };
  heading.append(label,newTask);
  const editor=document.createElement('textarea');editor.id='mathEducationText';editor.rows=3;editor.maxLength=3500;
  editor.value=mathRestoreDraft();
  editor.placeholder=learningLabel('Scrie, fotografiază sau alege un exercițiu…','Type, photograph or select an exercise…');
  editor.setAttribute('aria-label',label.textContent);
  const tools=document.createElement('div');tools.className='math-entry-tools';
  photo.className='secondary-btn math-input-tool';photo.textContent=learningLabel('📷 Foto','📷 Camera');
  pick.className='secondary-btn math-input-tool';pick.textContent=learningLabel('🖼️ Album','🖼️ Gallery');
  tools.append(actions);
  if(['geometry','trigonometry'].includes(mathJourney.topic)){
   const geometry=document.createElement('button');geometry.type='button';
   geometry.className='secondary-btn math-figures-action';
   geometry.textContent=learningLabel('📐 Figuri geometrice','📐 Geometric figures');
   geometry.onclick=mathOpenFigureLibrary;
   tools.append(geometry);
   const figureSummary=document.createElement('details');
   figureSummary.id='mathFigureSummary';figureSummary.className='math-figure-summary math-figure-attached';
   workspace.append(figureSummary);
  }
  const status=document.createElement('small');status.id='mathEducationStatus';status.setAttribute('role','status');
  status.textContent='';
  editor.addEventListener('input',()=>{mathRememberDraft(editor.value);status.textContent='';mathEditorScheduleCaretFollow(editor)});
  for(const eventName of ['focus','click','keyup','select','compositionend']){
   editor.addEventListener(eventName,()=>mathEditorScheduleCaretFollow(editor));
  }
  workspace.append(heading,editor,status);
  const choices=document.createElement('div');choices.className='education-math-actions';
  [
   ['solve',learningLabel('🧩 Rezolvă pas cu pas','🧩 Solve step by step')],
   ['graph',learningLabel('📈 Reprezintă grafic','📈 Draw a graph')],
   ['explain',learningLabel('🎓 Explică metoda','🎓 Explain method')]
  ].forEach(([mode,title])=>{
   const button=document.createElement('button');button.type='button';
   button.className=mode==='solve'?'primary-btn':'secondary-btn';
   button.textContent=title;button.onclick=()=>mathEducationRun(mode);
   choices.append(button);
  });
  workspace.append(choices,tools);host.append(workspace);
  mathFigureDraftSummary();
  requestAnimationFrame(mathFitViewport);
 }

 inputEl.placeholder=learningLabel('Întreabă despre '+subject[2].toLowerCase()+'…','Ask about '+subject[3].toLowerCase()+'…');
}
// An OCR candidate is NEVER a verified mathematical statement. A photographed
// page must be reviewed and one exercise explicitly selected before math runs.
let mathPhotoNeedsReview=false;
// The last photographed page is retrieved only when the user explicitly
// confirms a Cloudflare vision comparison. Never send on ordinary ML Kit OCR.
let mathVisionCapture=null;
let mathVisionSequence=0;
window.pocketAndroidMathVisionResult=function(data){
 const pending=mathVisionCapture;
 if(!pending||data?.id!==pending.id)return;
 if(data.status==='chunk'){
  if(typeof data.chunk!=='string'||pending.length+data.chunk.length>1350000){
   mathVisionCapture=null;pending.reject(new Error('image_too_large'));return;
  }
  pending.parts.push(data.chunk);pending.length+=data.chunk.length;
 }else if(data.status==='complete'){
  mathVisionCapture=null;
  pending.resolve('data:image/jpeg;base64,'+pending.parts.join(''));
 }else if(data.status==='error'){
  mathVisionCapture=null;pending.reject(new Error('image_unavailable'));
 }
};
function mathVisionPhotoOnDemand(){
 if(!window.PocketAndroidMathVision?.postMessage)
  return Promise.reject(new Error('new_apk_required'));
 if(mathVisionCapture)return Promise.reject(new Error('already_processing'));
 return new Promise((resolve,reject)=>{
  const id='mathvision_'+(++mathVisionSequence);
  const timer=setTimeout(()=>{
   if(mathVisionCapture?.id===id){
    const pending=mathVisionCapture;mathVisionCapture=null;
    pending.reject(new Error('image_capture_timeout'));
   }
  },30000);
  mathVisionCapture={id,parts:[],length:0,
   resolve:value=>{clearTimeout(timer);resolve(value)},
   reject:error=>{clearTimeout(timer);reject(error)}};
  try{window.PocketAndroidMathVision.postMessage('capture:'+id)}
  catch(error){const current=mathVisionCapture;mathVisionCapture=null;current?.reject(error)}
 });
}

function mathPhotoCandidates(source,alternative){
 // Keep sections distinct (a/b/c may repeat in Exercise 1 and Exercise 2).
 // Preserve one OCR variant per section+subpoint; never guess missing symbols.
 const out=[],seen=new Set(),primaryPositions=new Set(),primaryBareLetters=new Set();
 const canonical=value=>String(value||'').toLowerCase().replace(/[−–]/g,'-')
  .replace(/²/g,'^2').replace(/³/g,'^3').replace(/v(?=\\d)/g,'√')
  .replace(/\\s+/g,'');
 const collect=(raw,fallback)=>{
  const lines=String(raw||'').replace(/\\r/g,'').split('\\n').map(x=>x.trim()).filter(Boolean);
  let section='0',pending=null;
  const emit=(letter,rawExpression)=>{
   const rawValue=String(rawExpression||'').trim();
   // Worked chains contain multiple '=' signs; one equality belongs to the question.
   const expression=((rawValue.match(/=/g)||[]).length>1?rawValue.split('=')[0]:rawValue.replace(/=\\s*$/,'')).trim();
   if(expression.length<3||expression.length>180||
      !(/[\\d√]/u.test(expression)||/[a-z]\\s*(?:=|[+\\-×*\\/])\\s*[a-z]/iu.test(expression)))return;
   let bracketDepth=0;
   for(const ch of expression){
    if(ch==='(')bracketDepth++;
    else if(ch===')'&&--bracketDepth<0)return;
   }
   if(bracketDepth!==0)return;
   const position=section+':'+letter;
   if(fallback&&(primaryPositions.has(position)||(section==='0'&&primaryBareLetters.has(letter))))return;
   const comparison=canonical(expression);
   // The same candidate can appear twice when crop OCR loses the section
   // heading. Deduplicate only a demonstrably identical formula and label;
   // never merge different real subpoints a), b), c) across two known sections.
   if(out.some(item=>item.letter===letter&&item.comparison===comparison&&
     (item.section===section||item.section==='0'||section==='0'||fallback)))return;
   const signature=position+':'+expression.replace(/\\s+/g,'').toLowerCase();
   if(seen.has(signature))return;
   seen.add(signature);
   if(!fallback){primaryPositions.add(position);primaryBareLetters.add(letter)}
   const prefix=section==='0'?'':'Ex. '+section+' · ';
   out.push({label:prefix+letter+') '+expression,text:expression,letter,section,comparison,origin:fallback?'alternate':'primary'});
  };
  for(const line of lines){
   // Vision OCR often returns a numbered section and the first subpoint on
   // the same line ("1. a) ..." or "Ex. 1 · a) ..."). Preserve that first row.
   const inlineHeading=line.match(/^(?:exerci[țt]iul|exerci[țt]iu|exercises?|ex\\.?)\\s*(\\d{1,3})\\s*[).:·—–-]?\\s*([a-z])[).:]\\s*(.+)$/iu)||
    line.match(/^(\\d{1,3})[).:]\\s*([a-z])[).:]\\s*(.+)$/i);
   if(inlineHeading){
    section=inlineHeading[1];pending=null;
    emit(inlineHeading[2].toLowerCase(),inlineHeading[3]);
    if(out.length>=50)break;
    continue;
   }
   const heading=line.match(/^(?:exerci[țt]iul|exerci[țt]iu|exercises?|ex\\.?)\\s*(\\d{1,3})(?=\\s|[).:—–-]|$)/iu);
   if(heading){section=heading[1];pending=null;continue;}
   const numbered=line.match(/^(\\d{1,3})[).:]\\s*(?![a-z][).:])(.+)$/i);
   if(numbered&&/\\d|√/.test(numbered[2])){
    // Pages sometimes number problems directly, without a), b), c).
    // Keep their number as the tab identifier, independent of section headings.
    const saved=section;section='0';pending=null;emit(numbered[1],numbered[2]);section=saved;
    if(out.length>=50)break;
    continue;
   }
   const subpoint=line.match(/^([a-z])\\s*[).:]\\s*(.*)$/i);
   if(subpoint){
    if(pending)pending=null;
    const letter=subpoint[1].toLowerCase(),body=subpoint[2].trim();
    if(body)emit(letter,body);else pending=letter;
    if(out.length>=50)break;
    continue;
   }
   if(pending){
    // ML Kit often breaks a small "d)" marker from its formula.
    emit(pending,line);
    pending=null;
    if(out.length>=50)break;
   }
  }
 };
 collect(source,false);
 if(out.length<50)collect(alternative,true);
 // Photos of one equation (or a column of equations) may have no a)/b)
 // labels. Recover only self-contained mathematical lines, never prose,
 // partial brackets, solution chains or guessed unreadable symbols.
 if(!out.length){
  const rawLines=String(source||'').replace(/\\r/g,'').split('\\n').map(v=>v.trim()).filter(Boolean);
  for(const raw of rawLines){
   if(out.length>=50)break;
   if(raw.length<3||raw.length>160||!/\\d/.test(raw)||!/[=+\\-−×÷*/^√]/u.test(raw)||
      /[?]|(?:https?:|www\\.|\\.com\\b)/i.test(raw))continue;
   const eqCount=(raw.match(/=/g)||[]).length;
   if(eqCount>1)continue;
   const expression=raw.replace(/=\\s*$/,'').trim();
   if(!/^[\\dA-Za-z+\\-−×÷*/^√(){}\\[\\].,;=: \\t²³π]+$/u.test(expression))continue;
   let depth=0,valid=true;
   for(const ch of expression){if(ch==='(')depth++;else if(ch===')'&&--depth<0){valid=false;break}}
   if(!valid||depth!==0)continue;
   const bare=expression.replace(/\\s+/g,'').toLowerCase();
   if(out.some(item=>item.comparison===canonical(bare)))continue;
   const index=out.length+1;
   out.push({label:String(index)+') '+expression,text:expression,letter:String(index),
    section:'0',comparison:canonical(expression),origin:'primary'});
  }
 }
 // Image regions may be read out of sequence: present sections and letters in
 // their textbook order regardless of OCR pass ordering.
 out.sort((a,b)=>(Number(a.section)||1)-(Number(b.section)||1)||
  ((/^\\d+$/.test(a.letter)&&/^\\d+$/.test(b.letter))?Number(a.letter)-Number(b.letter):a.letter.localeCompare(b.letter)));
 return out;
}

// OCR sometimes turns √5 into V5 or x² into x2. Never silently treat these
// uncertain glyphs as verified algebra when selecting a photographed exercise.
// These ambiguous OCR glyphs must never be silently interpreted as a valid
// photographed exercise. This validation only runs on photo review, not
// manually entered calculus equations, where prime notation can be correct.
function mathPhotoOcrRisks(source){
 const value=String(source||'').replace(/\\s+/g,'');
 const risks=[];
 if(/(?:^|[+\\-])\\d*[vV]\\d/.test(value))risks.push('radical');
 if(/[a-z]2(?=$|[+\\-a-z])/i.test(value))risks.push('exponent');
 if(/[a-z][\\u0027\\u2019\\u00b4\\u0060\\u2032](?![a-z])/i.test(value))risks.push('prime');
 if(/[a-z]\\?(?=$|[+\\-a-z])/i.test(value)||/\\?(?=[+\\-]|\\d|$)/.test(value))risks.push('unknown');
 return risks;
}
// A correction is NEVER guessed from OCR. It is applied only after a learner
// explicitly taps the corresponding option and compares with the photograph.
function mathPhotoOcrApplyCorrection(source,kind){
 const value=String(source||'');
 if(kind==='square')return value.replace(/([a-z])2(?![0-9])/gi,'$1²');
 if(kind==='radical')return value.replace(/[vV]\\s*(?=\\d)/g,'√');
 return value;
}
function mathPhotoOcrRisk(source){return mathPhotoOcrRisks(source).length>0}
function mathPhotoOcrRiskWarning(source){
 const risks=mathPhotoOcrRisks(source);
 if(!risks.length)return '';
 const terms=[];
 if(risks.includes('radical'))terms.push(learningLabel('V5 poate însemna √5','V5 may mean √5'));
 if(risks.includes('exponent'))terms.push(learningLabel('x2 poate însemna x²','x2 may mean x²'));
 if(risks.includes('prime'))terms.push(learningLabel("x' poate fi un exponent citit greșit","x' may be a misread exponent"));
 if(risks.includes('unknown'))terms.push(learningLabel('semnul ? indică un caracter necitit','? indicates an unread character'));
 return learningLabel('Simboluri OCR nesigure: ','Uncertain OCR symbols: ')+terms.join('; ')+'. '+
  learningLabel('Verifică și corectează formula după fotografie.','Check and correct the formula against the photo.');
}

// Educational mathematics: reject obvious OCR fragments, not legitimate hand-entered work.
function educationMathOcrIncomplete(value){
 const raw=String(value||'').replace(/\\s+/g,'');
 if(!raw||raw.length<3||(!/[\\d√]/.test(raw)&&!/[a-z][=+\\-*×÷/][a-z]/i.test(raw)))return true;
 // Word problems may be narrative. Only enforce symbol structure on short expressions.
 if(/\\w{4,}\\s+\\w{4,}/.test(String(value||'')))return false;
 const stack=[],pairs={')':'(',']':'[','}':'{'};
 for(const ch of raw){
  if('([{'.includes(ch))stack.push(ch);
  else if(')]}'.includes(ch)&&stack.pop()!==pairs[ch])return true;
 }
 if(stack.length||/[=+\\-*/×÷(\\[{]$/.test(raw))return true;
 if(/√(?=$|[=+*/×÷\\-)])/u.test(raw))return true;
 if(raw.includes('=')&&raw.split('=').some(x=>!x))return true;
 return false;
}
// Dedicated Math results are independent of the general chat and its prompts.
let mathResultSession=null;
function mathSplitExercises(source){
 const lines=String(source||'').replace(/\\r/g,'').split('\\n').map(v=>v.trim()).filter(Boolean);
 const tasks=[];let current=[];
 const flush=()=>{if(current.length){tasks.push(current.join('\\n').trim());current=[]}};
 const isFormula=value=>/[\\d√]/u.test(value)&&/[=+\\-−×÷*/^√]/u.test(value)&&
  !/[.!?]$/.test(value)&&!/[\\wăâîșț]{4,}\\s+[\\wăâîșț]{4,}/iu.test(value);
 for(const line of lines){
  // A section heading is metadata; it must never be treated as an exercise.
  if(/^(?:(?:exerci[țt]iul?|exercises?|ex\\.?|probleme|problems?)\\s*\\d{0,3}\\s*[:.)—–-]?\\s*(?:efectua[țt]i|calcula[țt]i|reduce[țt]i|rezolva[țt]i)?\\s*:?|exerci[țt]ii|exercises?)$/iu.test(line)){
   flush();continue;
  }
  const numbered=line.match(/^\\d{1,3}\\s*[.)]\\s*(\\S.*)$/u);
  const subpoint=line.match(/^[a-z]\\s*[).:]\\s*(\\S.*)$/iu);
  const content=(numbered?.[1]||subpoint?.[1]||line).trim();
  const instruction=/^(?:rezolv(?:[ăa]|are)?|reprezint(?:[ăa])?|deseneaz(?:[ăa])?|calculeaz(?:[ăa])?|determin[ăa]|afl[ăa]|construie[șs]te|solve|graph|plot|draw|calculate|find)(?:\\s|:|$)/iu.test(content);
  // A complete formula on its own line is a separate exercise. Keep prose
  // continuations together and never split an equation at an equals sign.
  const previous=current.join('\\n');
  const separate=numbered||subpoint||instruction||(isFormula(content)&&isFormula(previous));
  if(current.length&&separate)flush();
  current.push(content);
 }
 flush();
 return tasks.filter(Boolean).slice(0,50);
}
function mathGraphModel(task){
 const match=String(task||'').match(/(?:f\\s*\\(\\s*x\\s*\\)|y)\\s*=\\s*([^\\n\\r;]+)/i);
 if(!match)return null;
 const expression=match[1].trim().replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/,/g,'.').replace(/\\s+/g,'').replace(/·/g,'*');
 if(expression.length>100||!expression||/[()]/.test(expression))return null;
 const pieces=expression.match(/[+-]?[^+-]+/g);
 if(!pieces||pieces.join('')!==expression||pieces.length>10)return null;
 let a=0,b=0,c=0,variable=false;
 for(const item of pieces){
  const sign=item[0]==='-'?-1:1;
  const term=item.replace(/^[+-]/,'');
  let matched=term.match(/^(\\d*(?:\\.\\d+)?)?\\*?x\\^2$/i);
  if(matched){a+=sign*Number(matched[1]||1);variable=true;continue}
  matched=term.match(/^(\\d*(?:\\.\\d+)?)?\\*?x$/i);
  if(matched){b+=sign*Number(matched[1]||1);variable=true;continue}
  if(/^\\d+(?:\\.\\d+)?$/.test(term)){c+=sign*Number(term);continue}
  return null;
 }
 if(!variable||![a,b,c].every(Number.isFinite))return null;
 return {a,b,c,expression};
}
function mathSvgElement(tag,attributes){
 const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
 for(const key of Object.keys(attributes||{}))el.setAttribute(key,String(attributes[key]));
 return el;
}
function mathSvgLine(svg,x1,y1,x2,y2,stroke,width=1,opacity=1){
 svg.append(mathSvgElement('line',{x1,y1,x2,y2,stroke,'stroke-width':width,opacity}));
}
function mathSvgText(svg,x,y,value,anchor='middle',size=11,color='#c7e6f1'){
 const el=mathSvgElement('text',{x,y,'text-anchor':anchor,'font-size':size,fill:color});
 el.textContent=String(value);svg.append(el);
}
function mathGraphFigure(question,focusX=null){
 const model=mathGraphModel(question);if(!model)return null;
 const f=x=>model.a*x*x+model.b*x+model.c;
 let xmin=-5,xmax=5;
 if(Number.isFinite(focusX)&&(focusX<xmin+.8||focusX>xmax-.8)){
  xmin=Math.floor(focusX)-5;xmax=Math.floor(focusX)+5;
 }
 if(model.a&&Math.abs(-model.b/(2*model.a))>5&&Math.abs(-model.b/(2*model.a))<20){
  const vx=-model.b/(2*model.a);xmin=Math.floor(vx-5);xmax=Math.ceil(vx+5);
 }
 const samples=Array.from({length:181},(_,i)=>f(xmin+(xmax-xmin)*i/180));
 let yMin=Math.min(-4,...samples),yMax=Math.max(4,...samples);
 const pad=Math.max(1,(yMax-yMin)*.08);yMin-=pad;yMax+=pad;
 if(yMax-yMin<8){const mid=(yMax+yMin)/2;yMin=mid-4;yMax=mid+4}
 const width=420,height=274,left=45,right=12,top=18,bottom=37;
 const px=x=>left+(x-xmin)/(xmax-xmin)*(width-left-right);
 const py=y=>top+(yMax-y)/(yMax-yMin)*(height-top-bottom);
 const figure=document.createElement('figure');figure.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 274',role:'img','aria-label':'Graficul funcției f(x) = '+model.expression,preserveAspectRatio:'xMidYMid meet'});
 const axis=document.createElementNS('http://www.w3.org/2000/svg','rect');
 axis.setAttribute('x',left);axis.setAttribute('y',top);axis.setAttribute('width',width-left-right);
 axis.setAttribute('height',height-top-bottom);axis.setAttribute('fill','#0b253a');svg.append(axis);
 for(let x=Math.ceil(xmin);x<=Math.floor(xmax);x++){
  mathSvgLine(svg,px(x),top,px(x),height-bottom,'#396278',.8,.58);
  if(x%2===0||x===0)mathSvgText(svg,px(x),height-bottom+17,x,'middle',11);
 }
 const step=Math.max(1,Math.ceil((yMax-yMin)/8));
 for(let y=Math.ceil(yMin/step)*step;y<=yMax;y+=step){
  mathSvgLine(svg,left,py(y),width-right,py(y),'#396278',.8,.58);
  mathSvgText(svg,left-7,py(y)+4,Number(y.toFixed(2)),'end',10);
 }
 if(xmin<=0&&xmax>=0)mathSvgLine(svg,px(0),top,px(0),height-bottom,'#9eb8c7',1.4);
 if(yMin<=0&&yMax>=0)mathSvgLine(svg,left,py(0),width-right,py(0),'#9eb8c7',1.4);
 mathSvgText(svg,width-right,height-bottom+28,'x','end',13,'#d9fbff');
 mathSvgText(svg,left-3,top-6,'y','end',13,'#d9fbff');
 const path=mathSvgElement('path',{d:samples.map((y,i)=>(i?'L':'M')+px(xmin+(xmax-xmin)*i/180).toFixed(2)+' '+py(y).toFixed(2)).join(' '),
   fill:'none',stroke:'#42dbd7','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});
 svg.append(path);
 const points=[{x:0,y:model.c}];
 if(Math.abs(model.a)<1e-9&&Math.abs(model.b)>1e-9)points.push({x:-model.c/model.b,y:0});
 else if(Math.abs(model.a)>1e-9){
  const disc=model.b*model.b-4*model.a*model.c;
  if(disc>=0){
   points.push({x:(-model.b+Math.sqrt(disc))/(2*model.a),y:0});
   if(disc>0)points.push({x:(-model.b-Math.sqrt(disc))/(2*model.a),y:0});
  }
  points.push({x:-model.b/(2*model.a),y:f(-model.b/(2*model.a))});
 }
 for(const p of points){
  if(p.x<xmin||p.x>xmax||p.y<yMin||p.y>yMax)continue;
  svg.append(mathSvgElement('circle',{cx:px(p.x),cy:py(p.y),r:4.5,fill:'#ffca77',stroke:'#082035','stroke-width':1.3}));
 }
 figure.append(svg);
 const caption=document.createElement('figcaption');
 caption.textContent=(state.language==='ro'?'Grafic calculat local: f(x) = ':'Locally calculated graph: f(x) = ')+model.expression;
 figure.append(caption);return figure;
}
function mathGeometryFigure(question){
 const verifiedShape=mathPlaneShapeModel(question);
 if(verifiedShape)return mathPlaneShapeFigure(verifiedShape);
 const t=String(question||'').toLowerCase();
 let kind=null;
 if(/\\btriunghi\\b|\\btriangle\\b/u.test(t))kind='triangle';
 else if(/\\bdreptunghi\\b|\\brectangle\\b/u.test(t))kind='rectangle';
 else if(/\\bcerc\\b|\\bcircle\\b|\\bcircumferin/u.test(t))kind='circle';
 if(!kind)return null;
 const figure=document.createElement('figure');figure.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 265',role:'img','aria-label':'Schiță geometrică orientativă',preserveAspectRatio:'xMidYMid meet'});
 if(kind==='triangle'){
  svg.append(mathSvgElement('polygon',{points:'65,215 348,215 217,38',fill:'#13485a','fill-opacity':'.48',stroke:'#4ed1d5','stroke-width':3}));
  mathSvgText(svg,55,232,'A','middle',17);mathSvgText(svg,354,234,'B','middle',17);mathSvgText(svg,218,26,'C','middle',17);
 }else if(kind==='rectangle'){
  svg.append(mathSvgElement('rect',{x:70,y:42,width:280,height:180,fill:'#13485a','fill-opacity':'.48',stroke:'#4ed1d5','stroke-width':3}));
  mathSvgText(svg,59,41,'A','end',17);mathSvgText(svg,361,41,'B','start',17);
  mathSvgText(svg,361,239,'C','start',17);mathSvgText(svg,59,239,'D','end',17);
 }else{
  svg.append(mathSvgElement('circle',{cx:210,cy:132,r:90,fill:'#13485a','fill-opacity':'.4',stroke:'#4ed1d5','stroke-width':3}));
  svg.append(mathSvgElement('circle',{cx:210,cy:132,r:4,fill:'#ffca77'}));
  mathSvgText(svg,224,127,'O','start',15);
 }
 const caption=document.createElement('figcaption');
 caption.textContent=learningLabel('Schiță orientativă; lungimile și unghiurile nu sunt la scară.','Illustrative sketch; lengths and angles are not to scale.');
 figure.append(svg,caption);return figure;
}
function mathCloseResults(){
 document.documentElement.classList.remove('math-result-visible');
 const session=mathResultSession;mathResultSession=null;
 if(session?.controller)session.controller.abort();
 const dialog=$('mathResultDialog');if(dialog?.open)dialog.close();
}
// Deterministic, no-eval check for straightforward arithmetic equalities.
// Keep narrative problems, variables, exponents, and unsupported symbols with
// the regular teaching engine rather than guessing an arithmetic result.
function mathArithmeticValue(expression){
 const raw=String(expression||'').replace(/[−–]/g,'-').replace(/[×·]/g,'*')
  .replace(/÷/g,'/').replace(/\\s+/g,'');
 if(!raw||raw.length>180||!/^[0-9.,()+\\-*/]+$/.test(raw))return null;
 const tokens=raw.match(/(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)|[()+\\-*/]/g);
 if(!tokens||tokens.join('')!==raw||tokens.length>100)return null;
 let pos=0;
 const primary=()=>{
  const token=tokens[pos];
  if(token==='+'||token==='-'){
   pos++;const value=primary();return value===null?null:token==='-'?-value:value;
  }
  if(token==='('){
   pos++;const value=sum();
   if(value===null||tokens[pos]!==')')return null;
   pos++;return value;
  }
  if(!token||!/^(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)$/.test(token))return null;
  pos++;const value=Number(token.replace(',','.'));
  return Number.isFinite(value)?value:null;
 };
 const product=()=>{
  let value=primary();
  if(value===null)return null;
  while(tokens[pos]==='*'||tokens[pos]==='/'){
   const operator=tokens[pos++],next=primary();
   if(next===null||(operator==='/'&&next===0))return null;
   value=operator==='*'?value*next:value/next;
   if(!Number.isFinite(value))return null;
  }
  return value;
 };
 const sum=()=>{
  let value=product();
  if(value===null)return null;
  while(tokens[pos]==='+'||tokens[pos]==='-'){
   const operator=tokens[pos++],next=product();
   if(next===null)return null;
   value=operator==='+'?value+next:value-next;
   if(!Number.isFinite(value))return null;
  }
  return value;
 };
 const result=sum();
 return pos===tokens.length&&Number.isFinite(result)?result:null;
}
function mathArithmeticEquality(source){
 const parts=String(source||'').replace(/＝/g,'=').split('=');
 if(parts.length!==2)return null;
 const left=mathArithmeticValue(parts[0]),right=mathArithmeticValue(parts[1]);
 if(left===null||right===null)return null;
 return {left,right,equal:Math.abs(left-right)<=1e-9*Math.max(1,Math.abs(left),Math.abs(right))};
}
function mathEqualityExplanation(check){
 if(!check)return '';
 const formatter=new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:9});
 const number=value=>formatter.format(Object.is(value,-0)?0:value);
 return check.equal?
  learningLabel('Egalitatea este adevărată. Stânga = ','The equality is true. Left = ')+number(check.left)+
   learningLabel('; dreapta = ','; right = ')+number(check.right)+'.':
  learningLabel('Egalitatea este falsă. Stânga = ','The equality is false. Left = ')+number(check.left)+
   learningLabel('; dreapta = ','; right = ')+number(check.right)+'.';
}
// Detailed, deterministic arithmetic teaching for simple expressions.
// Parsing is intentionally limited to explicit numbers and +,-,*,/,parentheses.
function mathDetailedArithmetic(source){
 const parts=String(source||'').replace(/＝/g,'=').split('=');
 if(parts.length<1||parts.length>2)return null;
 const checked=parts.length===2?mathArithmeticEquality(source):null;
 if(parts.length===2&&!checked)return null;
 const formatter=new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:9});
 const format=value=>formatter.format(Object.is(value,-0)?0:value).replace(/-/g,'−');
 const operator=op=>({'*':'×','/':'÷','+':'+','-':'−'}[op]||op);
 const steps=[];
 const explainSide=(input,side,sideKey)=>{
  const raw=String(input).replace(/[−–]/g,'-').replace(/[×·]/g,'*')
   .replace(/÷/g,'/').replace(/\\s+/g,'');
  if(!raw||raw.length>180||!/^[0-9.,()+\\-*/]+$/.test(raw))return null;
  const tokens=raw.match(/(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)|[()+\\-*/]/g);
  if(!tokens||tokens.join('')!==raw||tokens.length>100)return null;
  let pos=0;
  const primary=()=>{
   const t=tokens[pos];
   if(t==='+'||t==='-'){
    pos++;const child=primary();return child?{kind:'unary',sign:t,child,done:undefined}:null;
   }
   if(t==='('){
    pos++;const inner=sum();
    if(!inner||tokens[pos++]!==')')return null;
    return {kind:'group',inner,done:undefined};
   }
   if(!t||!/^(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)$/.test(t))return null;
   pos++;return {kind:'number',value:Number(t.replace(',','.'))};
  };
  const product=()=>{
   let current=primary();if(!current)return null;
   while(tokens[pos]==='*'||tokens[pos]==='/'){
    const op=tokens[pos++],next=primary();if(!next)return null;
    current={kind:'binary',op,left:current,right:next,done:undefined};
   }
   return current;
  };
  const sum=()=>{
   let current=product();if(!current)return null;
   while(tokens[pos]==='+'||tokens[pos]==='-'){
    const op=tokens[pos++],next=product();if(!next)return null;
    current={kind:'binary',op,left:current,right:next,done:undefined};
   }
   return current;
  };
  const root=sum();
  if(!root||pos!==tokens.length)return null;
  const display=node=>{
   if(node.done!==undefined)return format(node.done);
   if(node.kind==='number')return format(node.value);
   if(node.kind==='group')return '('+display(node.inner)+')';
   if(node.kind==='unary')return (node.sign==='-'?'−':'+')+
      (node.child.kind==='binary'?'('+display(node.child)+')':display(node.child));
   const left=display(node.left),right=display(node.right);
   const operand=n=>n.kind==='unary'&&n.done===undefined?'('+display(n)+')':display(n);
   return operand(node.left)+' '+operator(node.op)+' '+operand(node.right);
  };
  // Re-render each expression after applying an operator. This prevents
  // omitted terms like the reported "3 × (2 × -1) + 5" -> "-6".
  const solve=(node,withinParentheses=false)=>{
   if(node.kind==='number')return node.value;
   if(node.kind==='group'){
    const value=solve(node.inner,true);return value;
   }
   if(node.kind==='unary'){
    const value=solve(node.child,withinParentheses);
    if(value===null)return null;
    node.done=node.sign==='-'?-value:value;
    return node.done;
   }
   const left=solve(node.left,withinParentheses),right=solve(node.right,withinParentheses);
   if(left===null||right===null||(node.op==='/'&&right===0))return null;
   const value=node.op==='+'?left+right:node.op==='-'?left-right:
    node.op==='*'?left*right:left/right;
   if(!Number.isFinite(value)||Math.abs(value)>1e12)return null;
   const operation=display(node)+' = '+format(value);
   node.done=value;
   const label=withinParentheses?
     learningLabel('Calculăm în paranteză','Calculate inside the parentheses'):
     node.op==='*'?learningLabel('Efectuăm înmulțirea','Multiply'):
     node.op==='/'?learningLabel('Efectuăm împărțirea','Divide'):
     node.op==='+'?learningLabel('Efectuăm adunarea','Add'):
     learningLabel('Efectuăm scăderea','Subtract');
   const reason=withinParentheses?
     learningLabel('Începem cu operațiile din paranteză. Ele au prioritate față de calculele din afara parantezei.',
       'Start with the operation inside the parentheses. It takes priority over operations outside.'):
     node.op==='*'||node.op==='/'?
     learningLabel('Parantezele au fost calculate. Acum facem înmulțirile și împărțirile înaintea adunărilor și scăderilor.',
       'After the parentheses, multiplication and division come before addition and subtraction.'):
     learningLabel('Am terminat operațiile cu prioritate mai mare. Acum calculăm termenii rămași, de la stânga la dreapta.',
       'We have completed higher-priority operations. Now evaluate the remaining terms from left to right.');
   const signRule=(node.op==='*'||node.op==='/') && left!==0 && right!==0 && (left<0||right<0)?
     (Math.sign(left)===Math.sign(right)?
      learningLabel('Regula semnelor: două numere negative dau un rezultat pozitiv.',
       'Sign rule: two negative numbers give a positive result.'):
      learningLabel('Regula semnelor: un număr pozitiv și unul negativ dau un rezultat negativ.',
       'Sign rule: a positive and a negative number give a negative result.')):'';
   steps.push({label,reason,signRule,operation,after:display(root),sideKey});
   return value;
  };
  const result=solve(root);
  if(result===null||!Number.isFinite(result))return null;
  const baseline=mathArithmeticValue(input);
  if(baseline===null||Math.abs(baseline-result)>1e-9*Math.max(1,Math.abs(baseline)))return null;
  return {value:result,shown:display(root)};
 };
 const left=explainSide(parts[0],learningLabel('Stânga','Left'),'left');
 if(!left)return null;
 let right=null;
 if(parts.length===2){
  right=explainSide(parts[1],learningLabel('Dreapta','Right'),'right');
  if(!right)return null;
 }
 if(steps.length>60)return null;
 // Keep the originally dictated equality visible throughout a verification.
 const rightOriginal=parts.length===2?parts[1].trim().replace(/[-−–]/g,'−').replace(/[×·*]/g,'×').replaceAll('/', '÷'):'';
 for(const step of steps){
  step.fullAfter=parts.length===2?
   (step.sideKey==='left'?step.after+' = '+rightOriginal:format(left.value)+' = '+step.after):
   step.after;
 }
 const intro=learningLabel(
  'Mai întâi stabilim ordinea operațiilor: începem din paranteze, continuăm cu înmulțirile și împărțirile și terminăm cu adunările și scăderile. La fiecare pas rescriem întreaga expresie, fără să pierdem niciun termen.',
  'First recall the rule: parentheses, then multiplication and division, then addition and subtraction. Rewrite the whole expression at each step without losing any term.');
 const conclusion=checked?
  mathEqualityExplanation(checked)+' '+
  (checked.equal?
   learningLabel('Cei doi membri au aceeași valoare, deci verificarea este reușită.',
    'Both sides have the same value, so the equality checks out.'):
   learningLabel('Cei doi membri au valori diferite. Rezultatul calculat nu corespunde numărului scris după egal.',
    'The two sides have different values. The calculated result does not match the number after the equals sign.')):
  learningLabel('Rezultatul expresiei este ','The value of the expression is ')+format(left.value)+'.';
 return {intro,steps,conclusion,left:left.value,right:right?.value??null};
}
// General teaching is separate from working through the user's specific numbers.
function mathMethodGuide(source){
 const example=mathDetailedArithmetic(source);
 if(!example)return null;
 const input=String(source||'').replace(/[−–]/g,'-').replace(/[×·]/g,'*').replaceAll('÷','/');
 const rules=[];
 const add=(title,text)=>rules.push({title,text});
 add(learningLabel('Recunoaștem exercițiul','Identify the problem'),
  input.includes('=')?learningLabel('Este o egalitate: scopul este să verificăm dacă cele două membre au aceeași valoare. Semnul egal nu garantează că afirmația este adevărată.','It is an equality: check whether both sides are equal. The equals sign alone does not guarantee that it is true.'):learningLabel('Este o expresie numerică: vrem să îi calculăm valoarea, respectând ordinea operațiilor.','It is a numerical expression: calculate its value using the order of operations.'));
 add(learningLabel('Ordinea operațiilor','Order of operations'),learningLabel('Mai întâi parantezele, apoi înmulțirile și împărțirile de la stânga la dreapta, la final adunările și scăderile de la stânga la dreapta.','Parentheses first, then multiplication and division left to right, finally addition and subtraction left to right.'));
 if(input.includes('('))add(learningLabel('Parantezele','Parentheses'),learningLabel('Calculează întâi în interior, înlocuiește paranteza cu rezultatul ei și păstrează termenii din afară.','Calculate inside first, replace the parentheses with their value and preserve the outside terms.'));
 if(example.steps.some(step=>step.signRule))add(learningLabel('Regula semnelor','Sign rules'),learningLabel('La înmulțire sau împărțire, semnele diferite dau rezultat negativ; semnele identice dau pozitiv. De exemplu: 2 × (−3) = −6 și (−2) × (−3) = 6.','For multiplication or division, different signs give a negative result, the same signs a positive result. For example: 2 × (−3) = −6 and (−2) × (−3) = 6.'));
 if(input.includes('*')||input.includes('/'))add(learningLabel('Înmulțirea și împărțirea','Multiplication and division'),learningLabel('După paranteze, acestea au prioritate. Calculează-le de la stânga la dreapta, fără să elimini termenii rămași.','After parentheses, these have priority. Work left to right, keeping every remaining term.'));
 if(input.includes('+')||input.includes('-'))add(learningLabel('Adunarea și scăderea','Addition and subtraction'),learningLabel('Le efectuezi la final, de la stânga la dreapta, rescriind întreaga expresie.','Perform these last, left to right, rewriting the complete expression.'));
 if(input.includes('='))add(learningLabel('Verificarea','Verification'),learningLabel('Calculează separat fiecare membru. Dacă rezultatele sunt egale, egalitatea este adevărată; altfel este falsă.','Calculate each side separately. Matching values mean a true equality; otherwise it is false.'));
 return {heading:learningLabel('Cum abordăm exercițiile de acest tip','How to approach this type of problem'),
 intro:learningLabel('Învățăm regula generală, nu refacem aceeași rezolvare. Pentru calculul concret, alege „Rezolvă pas cu pas”.','Learn the general method instead of repeating the calculation. For the specific answer, use “Solve step by step”.'),
 rules,tip:learningLabel('Reține: la fiecare operație păstrează toate celelalte părți ale expresiei.','Remember: retain every other part of the expression when performing an operation.')};
}
// Verified local solver for single-variable linear equations. The same parsed
// coefficients drive the worked solution, the proof, and the general method.
function mathLinearEquation(source){
 const lines=String(source||'').replace(/\\r/g,'').split('\\n').map(v=>v.trim()).filter(Boolean);
 let raw=[...lines].reverse().find(v=>v.includes('='));
 if(!raw)return null;
 if(raw.includes(':'))raw=raw.slice(raw.lastIndexOf(':')+1);
 raw=raw.replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/')
  .replace(/＝/g,'=').replace(/\\s+/g,'').replace(/X/g,'x');
 if(!raw.includes('x')||raw.length>160||!/^[0-9x.,()+\\-*/=]+$/.test(raw))return null;
 const parts=raw.split('=');
 if(parts.length!==2||parts.some(v=>!v))return null;
 const parse=input=>{
  const tokens=input.match(/(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)|[x()+\\-*/]/g);
  if(!tokens||tokens.join('')!==input||tokens.length>90)return null;
  let pos=0;
  const valid=p=>p&&Number.isFinite(p.a)&&Number.isFinite(p.b)
   &&Math.abs(p.a)<1e11&&Math.abs(p.b)<1e11;
  const scalar=(a,b)=>valid({a,b})?{a,b}:null;
  const number=t=>/^(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)$/.test(t||'');
  const primary=()=>{
   const token=tokens[pos];
   if(token==='+'||token==='-'){
    pos++;const child=primary();
    return child?scalar(token==='-'?-child.a:child.a,token==='-'?-child.b:child.b):null;
   }
   if(token==='('){
    pos++;const value=sum();
    if(!value||tokens[pos]!==')')return null;
    pos++;return value;
   }
   if(token==='x'){pos++;return {a:1,b:0}}
   if(!number(token))return null;
   pos++;return scalar(0,Number(token.replace(',','.')));
  };
  const multiply=(l,r)=>!l||!r||(l.a!==0&&r.a!==0)?null:
   scalar(l.a*r.b+r.a*l.b,l.b*r.b);
  const product=()=>{
   let value=primary();if(!value)return null;
   for(;;){
    const token=tokens[pos];
    const implicit=token==='x'||token==='('||number(token);
    if(token!=='*'&&token!=='/'&&!implicit)break;
    if(!implicit)pos++;
    const right=primary();if(!right)return null;
    if(token==='/'){
     if(right.a!==0||right.b===0)return null;
     value=scalar(value.a/right.b,value.b/right.b);
    }else value=multiply(value,right);
    if(!value)return null;
   }
   return value;
  };
  const sum=()=>{
   let value=product();if(!value)return null;
   while(tokens[pos]==='+'||tokens[pos]==='-'){
    const op=tokens[pos++],right=product();
    if(!right)return null;
    value=scalar(value.a+(op==='+'?right.a:-right.a),
     value.b+(op==='+'?right.b:-right.b));
    if(!value)return null;
   }
   return value;
  };
  const result=sum();
  return pos===tokens.length?result:null;
 };
 const left=parse(parts[0]),right=parse(parts[1]);
 if(!left||!right)return null;
 const coefficient=left.a-right.a,constant=right.b-left.b;
 const tolerance=1e-10*Math.max(1,Math.abs(left.a),Math.abs(right.a),Math.abs(left.b),Math.abs(right.b));
 const kind=Math.abs(coefficient)<=tolerance?
  (Math.abs(constant)<=tolerance?'identity':'contradiction'):'unique';
 const value=kind==='unique'?constant/coefficient:null;
 if(kind==='unique'&&(!Number.isFinite(value)||Math.abs(value)>1e10))return null;
 if(kind==='unique'){
  const lhs=left.a*value+left.b,rhs=right.a*value+right.b;
  if(!Number.isFinite(lhs)||!Number.isFinite(rhs)||
   Math.abs(lhs-rhs)>1e-8*Math.max(1,Math.abs(lhs),Math.abs(rhs)))return null;
 }
 return {raw,left,right,coefficient,constant,kind,value};
}
function mathLinearNotation(value){
 const number=n=>new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:9,useGrouping:false})
  .format(Object.is(n,-0)?0:n).replace(/-/g,'−');
 const polynomial=({a,b})=>{
  const tiny=n=>Math.abs(n)<1e-10;
  const ax=tiny(a)?'':(Math.abs(a-1)<1e-10?'x':
   Math.abs(a+1)<1e-10?'−x':number(a)+'x');
  if(tiny(b))return ax||'0';
  if(!ax)return number(b);
  return ax+(b<0?' − ':' + ')+number(Math.abs(b));
 };
 return {number,polynomial};
}
// Show each arithmetic transformation after substituting a solved linear x.
// Unsupported or unstable substitutions never receive invented intermediate steps.
function mathLinearVerificationLines(equation,formattedValue){
 const substituted=String(equation||'').replace(/x/g,'('+formattedValue+')');
 // Linear algebra supports implicit multiplication; numerical steps require
 // explicit operators to use the existing verified arithmetic parser.
 const expanded=substituted.replace(/([0-9)])(?=\\()/g,'$1*')
  .replace(/(\\))(?=[0-9])/g,'$1*');
 const check=mathArithmeticEquality(expanded);
 if(!check||!check.equal)return null;
 const arithmetic=mathDetailedArithmetic(expanded);
 if(!arithmetic||arithmetic.steps.length>14)return null;
 const shown=s=>String(s).replace(/-/g,'−').replace(/\\*/g,'×')
  .replace(/\\s*=\\s*/g,' = ').trim();
 const firstLine=shown(substituted)
  .replace(/([0-9])\\(([0-9]+(?:[.,][0-9]+)?)\\)/g,'$1×$2')
  .replace(/\\(\\(([0-9]+(?:[.,][0-9]+)?)\\)/g,'($1');
 const rows=[firstLine];
 for(const step of arithmetic.steps){
  if(!step.fullAfter)return null;
  const row=shown(step.fullAfter);
  if(row!==rows[rows.length-1])rows.push(row);
 }
 const end=mathLinearNotation().number(check.left)+' = '+mathLinearNotation().number(check.right);
 if(rows[rows.length-1]!==end)rows.push(end);
 return rows.length>=2?rows:null;
}

function mathLinearSolution(source){
 const model=mathLinearEquation(source);if(!model)return null;
 const {number,polynomial}=mathLinearNotation(),{left,right,coefficient,constant,kind,value}=model;
 const initial=model.raw.replace(/\\*/g,'×').replace(/-/g,'−');
 const simplified=polynomial(left)+' = '+polynomial(right);
 const rearranged=polynomial({a:coefficient,b:0})+' = '+number(constant);
 const steps=[],add=(label,reason,operation,fullAfter)=>steps.push({
  label,reason,operation,fullAfter,signRule:''});
 add(learningLabel('Desfacem parantezele și reducem termenii','Expand and collect like terms'),
  learningLabel('Aplicăm proprietatea distributivă: înmulțim fiecare termen din paranteză cu factorul din fața ei. Apoi adunăm termenii asemenea, păstrând ambii membri ai ecuației.',
   'Use the distributive law, multiplying each term inside a bracket by the outside factor. Then combine like terms and keep both sides of the equation.'),
  initial+' → '+simplified,simplified);
 add(learningLabel('Grupăm necunoscuta și numerele','Collect unknowns and constants'),
  learningLabel('Scădem aceleași expresii din ambii membri: termenii cu x rămân în stânga, iar numerele în dreapta.',
   'Subtract the same expressions from both sides: keep x terms on the left and constants on the right.'),
  simplified+' → '+rearranged,rearranged);
 let conclusion='';
 if(kind==='identity'){
  conclusion=learningLabel('Identitate verificată: orice număr real x este soluție.',
   'Identity verified: every real number x is a solution.');
 }else if(kind==='contradiction'){
  conclusion=learningLabel('Ecuația nu are soluții: rezultă o egalitate falsă între două numere.',
   'There is no solution: the equation reduces to a false numerical statement.');
 }else{
  const solution='x = '+number(value);
  add(learningLabel('Împărțim la coeficientul lui x','Divide by the coefficient of x'),
   learningLabel('Coeficientul lui x este nenul. Împărțim ambii membri la același număr, fără să schimbăm egalitatea.',
    'The coefficient of x is nonzero. Divide both sides by this number to preserve the equality.'),
   rearranged+' → '+solution,solution);
  const lhs=left.a*value+left.b,rhs=right.a*value+right.b;
  const checked=number(lhs)+' = '+number(rhs);
  const verificationLines=mathLinearVerificationLines(model.raw,number(value));
  const substituted=model.raw.replace(/x/g,'('+number(value)+')')
   .replace(/\\*/g,'×').replace(/-/g,'−');
  add(learningLabel('Verificăm soluția în ecuația inițială','Check in the original equation'),
   learningLabel('Înlocuim x cu valoarea găsită în ambii membri ai ecuației originale; valorile trebuie să coincidă.',
    'Substitute the found value for x in both sides of the ORIGINAL equation. Their values must match.'),
   learningLabel('Înlocuim x = ','Substitute x = ')+number(value)+': '+substituted+
   learningLabel('. Calculăm separat: ','. Calculate each side: ')+checked+'.',checked);
  if(verificationLines)steps[steps.length-1].verificationSteps=verificationLines;
  conclusion=learningLabel('Soluția verificată este ','The verified solution is ')+solution+'.';
 }
 return {intro:learningLabel(
  'Rezolvăm ecuația de gradul I folosind reguli de echivalență. Nu schimbăm enunțul și verificăm rezultatul în ecuația originală.',
  'Solve the linear equation using equivalent transformations. Keep the original equation and verify the answer in it.'),
  steps,conclusion,kind,solution:value};
}
function mathLinearMethodGuide(source){
 if(!mathLinearEquation(source))return null;
 const labels=[
  [learningLabel('Recunoaștem ecuația','Identify the equation'),
   learningLabel('Este o ecuație de gradul I dacă, după simplificare, necunoscuta apare numai la puterea întâi.',
    'It is a linear equation when the variable appears only to the first power after simplification.')],
  [learningLabel('Aplicăm distributivitatea','Use the distributive law'),
   learningLabel('Înmulțim fiecare termen din paranteză cu factorul exterior, respectând semnele.',
    'Multiply every term in the brackets by the outside factor, respecting signs.')],
  [learningLabel('Reducem termenii asemenea','Combine like terms'),
   learningLabel('Adunăm separat termenii cu necunoscuta și termenii numerici.',
    'Combine variable terms and constant terms separately.')],
  [learningLabel('Păstrăm ecuații echivalente','Preserve equivalent equations'),
   learningLabel('Adunăm sau scădem aceeași valoare în ambii membri; apoi împărțim ambii membri la coeficientul nenul al necunoscutei.',
    'Add or subtract the same quantity on both sides, then divide both sides by the nonzero variable coefficient.')],
  [learningLabel('Verificăm rezultatul','Verify the result'),
   learningLabel('Înlocuim necunoscuta în ecuația inițială, nu într-o expresie modificată greșit. Dacă apare 0 = 0, sunt infinit de multe soluții; dacă apare 0 egal cu un număr nenul, nu există soluții.',
    'Substitute into the original equation. If it reduces to 0 = 0 there are infinitely many solutions; if 0 equals a nonzero number there are no solutions.')]
 ];
 return {heading:learningLabel('Metoda generală pentru ecuații de gradul I','General method for linear equations'),
  intro:learningLabel('Acestea sunt regulile aplicabile oricărei ecuații de acest tip. Pentru calculul concret, alege „Rezolvă pas cu pas”.',
   'These rules apply to all equations of this type. For the calculation, choose Solve step by step.'),
  rules:labels.map(([title,text])=>({title,text})),
  tip:learningLabel('Nu confunda desfacerea parantezelor cu înmulțirea termenilor din interior între ei.',
   'Do not confuse expanding a product with multiplying the terms inside the bracket together.')};
}

// Exact deterministic quadratic path: never use generated text for a polynomial
// equation whose roots and verification can be calculated locally.
function mathQuadraticEquation(source){
 const lines=String(source||'').replaceAll(String.fromCharCode(13),'').split(String.fromCharCode(10));
 let raw=[...lines].reverse().map(x=>x.trim()).find(x=>x.includes('='));
 if(!raw)return null;
 if(raw.includes(':'))raw=raw.slice(raw.lastIndexOf(':')+1);
 const cleaned=raw.replaceAll('−','-').replaceAll('–','-').replaceAll('²','^2')
  .replaceAll('×','*').replaceAll(' ','').replaceAll(String.fromCharCode(9),'');
 const sides=cleaned.split('=');
 if(sides.length!==2||sides[1]!=='0'||sides[0].length>120)return null;
 const model=mathGraphModel('f(x) = '+sides[0]);
 if(!model||Math.abs(model.a)<1e-12)return null;
 const {a,b,c}=model,delta=b*b-4*a*c;
 if(!Number.isFinite(delta)||!Number.isFinite(a)||!Number.isFinite(b)||!Number.isFinite(c))return null;
 if([a,b,c,delta].some(v=>Math.abs(v)>1e9))return null;
 const roots=delta<0?[]:delta===0?[-b/(2*a)]:[(-b-Math.sqrt(delta))/(2*a),(-b+Math.sqrt(delta))/(2*a)].sort((x,y)=>x-y);
 if(roots.some(x=>!Number.isFinite(x)||Math.abs(a*x*x+b*x+c)>1e-6*Math.max(1,Math.abs(a*x*x),Math.abs(b*x),Math.abs(c))))return null;
 return {raw:cleaned,a,b,c,delta,roots,expression:'f(x) = '+model.expression};
}
function mathQuadraticNotation(value){
 return new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:8}).format(Object.is(value,-0)?0:value).replaceAll('-','−');
}
function mathQuadraticSolution(source){
 const m=mathQuadraticEquation(source);if(!m)return null;
 const n=mathQuadraticNotation;
 const steps=[];
 const add=(label,reason,operation,fullAfter,verificationSteps)=>steps.push({label,reason,operation,fullAfter,signRule:'',...(verificationSteps?{verificationSteps}:{})});
 add(learningLabel('Identificăm coeficienții','Identify coefficients'),
     learningLabel('Scriem ecuația în forma ax² + bx + c = 0, unde a este nenul.','Use the standard form ax² + bx + c = 0, where a is nonzero.'),
     'a = '+n(m.a)+', b = '+n(m.b)+', c = '+n(m.c),m.raw.replaceAll('-','−'));
 add(learningLabel('Calculăm discriminantul','Calculate the discriminant'),
     learningLabel('Discriminantul Δ = b² − 4ac stabilește numărul soluțiilor reale.','The discriminant Δ = b² − 4ac determines the number of real roots.'),
     'Δ = ('+n(m.b)+')² − 4 × ('+n(m.a)+') × ('+n(m.c)+') = '+n(m.delta),
     'Δ = '+n(m.delta));
 if(!m.roots.length){
  return {intro:learningLabel('Rezolvăm ecuația de gradul II prin discriminant.','Solve this quadratic using its discriminant.'),steps,
   conclusion:learningLabel('Δ < 0: ecuația nu are soluții reale.','Δ < 0: there are no real roots.')};
 }
 const rootsText=m.roots.map((v,i)=>'x'+(i+1)+' = '+n(v)).join('; ');
 add(learningLabel('Calculăm soluțiile','Find the roots'),
     learningLabel('Aplicăm formula x = (−b ± √Δ)/(2a).','Use x = (−b ± √Δ)/(2a).'),
     'x = ('+n(-m.b)+' ± √'+n(m.delta)+') / ('+n(2*m.a)+') → '+rootsText,rootsText);
 const proof=m.roots.map((v,i)=>{
  const lhs=m.a*v*v+m.b*v+m.c;
  return 'x'+(i+1)+' = '+n(v)+': '+n(m.a)+' × ('+n(v)+')² + ('+n(m.b)+') × ('+n(v)+') + '+n(m.c)+' = '+n(Math.abs(lhs)<1e-8?0:lhs);
 });
 add(learningLabel('Verificăm în ecuația inițială','Verify in the original equation'),
     learningLabel('Înlocuim fiecare rădăcină în ecuația inițială; ambii membri trebuie să fie egali.','Substitute each root into the original equation.'),
     proof.join(' | '),proof.at(-1),proof);
 return {intro:learningLabel('Rezolvăm ecuația de gradul II prin discriminant și verificăm fiecare soluție.','Solve the quadratic using the discriminant and verify each root.'),
  steps,conclusion:learningLabel('Soluțiile reale verificate: ','Verified real roots: ')+rootsText+'.'};
}
function mathQuadraticMethodGuide(source){
 const m=mathQuadraticEquation(source);if(!m)return null;
 return {heading:learningLabel('Metoda generală pentru ecuații de gradul II','General method for quadratic equations'),
 intro:learningLabel('Metoda discriminantului se aplică formei ax² + bx + c = 0, cu a ≠ 0.','The discriminant method applies to ax² + bx + c = 0 with a ≠ 0.'),
 rules:[
  {title:learningLabel('Identificăm coeficienții','Identify coefficients'),text:learningLabel('Stabilim a, b și c, cu semnele lor.','Identify a, b and c with their signs.')},
  {title:learningLabel('Calculăm Δ = b² − 4ac','Compute Δ = b² − 4ac'),text:learningLabel('Verificăm separat pătratul lui b și produsul 4ac, respectând semnele.','Compute the squared and product terms carefully.')},
  {title:learningLabel('Interpretăm discriminantul','Interpret the discriminant'),text:learningLabel('Δ > 0: două soluții reale distincte; Δ = 0: o soluție reală dublă; Δ < 0: nicio soluție reală.','Positive: two distinct real roots; zero: one repeated real root; negative: no real roots.')},
  {title:learningLabel('Aplicăm formula','Use the quadratic formula'),text:learningLabel('Pentru Δ ≥ 0, x = (−b ± √Δ)/(2a). Parantezele sunt esențiale.','For Δ ≥ 0, x = (−b ± √Δ)/(2a). Keep parentheses.')},
  {title:learningLabel('Verificăm rădăcinile','Check the roots'),text:learningLabel('Înlocuim fiecare valoare în ecuația originală, nu într-o variantă transformată eronat.','Substitute every root into the original equation.')}
 ],tip:learningLabel('O factorizare propusă trebuie verificată prin înmulțirea factorilor.','Any proposed factorization must be checked by multiplying its factors.')};
}
function mathQuadraticGraphData(source){
 const m=mathQuadraticEquation(source);if(!m)return null;
 const n=mathQuadraticNotation,vertex=-m.b/(2*m.a),height=m.a*vertex*vertex+m.b*vertex+m.c;
 return {expression:m.expression,
  heading:learningLabel('Parabola asociată ecuației','Associated quadratic parabola'),
  intro:learningLabel('Reprezentăm f(x) = ','Plot f(x) = ')+m.expression.slice(7)+
   learningLabel('. Vârful parabolei este (','. Its vertex is (')+n(vertex)+'; '+n(height)+').',
  conclusion:m.roots.length?learningLabel('Intersecții cu Ox: ','Intersections with the x-axis: ')+m.roots.map(v=>'('+n(v)+'; 0)').join(', ')+'.':
   learningLabel('Parabola nu intersectează axa Ox: nu există rădăcini reale.','The parabola does not intersect the x-axis: no real roots.')};
}

// Shared local algebra dispatch. Each handler must return null for unsupported
// input. The registry is extensible, does not use eval and preserves older solvers.
function mathLinearInequality(source){
 const raw=String(source||'').trim().replaceAll('−','-').replaceAll('–','-')
  .replaceAll('≤','<=').replaceAll('≥','>=').split(' ').join('');
 if(raw.length>150||raw.includes('^')||raw.includes('²'))return null;
 const matches=raw.match(/<=|>=|<|>/g);
 if(!matches||matches.length!==1)return null;
 const op=matches[0],parts=raw.split(op);
 if(parts.length!==2||!parts[0]||!parts[1])return null;
 const equation=mathLinearEquation(parts[0]+'='+parts[1]);
 if(!equation)return null;
 const {left,right,coefficient,constant,kind}=equation;
 const signs={'>':'<','<':'>','>=':'<=','<=':'>='};
 const invert=coefficient<0;
 const solvedSign=invert?signs[op]:op;
 const boundary=kind==='unique'?constant/coefficient:null;
 if(kind==='unique'&&!Number.isFinite(boundary))return null;
 const numeric=val=>op==='<'?val<0:op==='>'?val>0:op==='<='?val<=0:val>=0;
 // If x cancels, decide the inequality using the original constant difference.
 const universal=kind==='unique'?null:numeric(left.b-right.b);
 const n=mathLinearNotation().number;
 const comparison=kind==='unique'?'x '+solvedSign.replace('<=','≤').replace('>=','≥')+' '+n(boundary):
   universal?learningLabel('Toate numerele reale','All real numbers'):
   learningLabel('Mulțimea vidă','Empty set');
 return {raw,op,left,right,coefficient,constant,kind,boundary,invert,
  universal,comparison};
}
function mathLinearInequalitySolution(source){
 const m=mathLinearInequality(source);if(!m)return null;
 const n=mathLinearNotation().number;
 const steps=[{
  label:learningLabel('Aducem termenii cu x în același membru','Collect the x terms'),
  reason:learningLabel('Scădem aceleași expresii din ambii membri, păstrând sensul inegalității.','Subtract the same expressions from both sides, preserving the inequality.'),
  operation:n(m.coefficient)+'x '+m.op+' '+n(m.constant),
  fullAfter:n(m.coefficient)+'x '+m.op+' '+n(m.constant),signRule:''
 }];
 if(m.kind==='unique')steps.push({
  label:learningLabel('Împărțim la coeficientul lui x','Divide by the coefficient of x'),
  reason:m.invert?learningLabel('Coeficientul este negativ: inversăm obligatoriu sensul inegalității.','The coefficient is negative, so reverse the inequality sign.'):
   learningLabel('Coeficientul este pozitiv: păstrăm sensul inegalității.','The coefficient is positive, so preserve the inequality sign.'),
  operation:m.comparison,fullAfter:m.comparison,signRule:''
 });
 else steps.push({
  label:learningLabel('Analizăm inegalitatea numerică','Check the constant inequality'),
  reason:learningLabel('Necunoscuta se elimină; verificăm dacă propoziția numerică este adevărată.','The variable cancels; evaluate the resulting numerical statement.'),
  operation:n(m.left.b-m.right.b)+' '+m.op+' 0',fullAfter:m.comparison,signRule:''
 });
 return {intro:learningLabel('Rezolvăm inecuația de gradul I, cu atenție la sensul semnului.','Solve the linear inequality, checking sign reversals.'),
  steps,conclusion:learningLabel('Mulțimea soluțiilor: ','Solution set: ')+m.comparison+'.'};
}
function mathLinearInequalityMethod(source){
 if(!mathLinearInequality(source))return null;
 return {heading:learningLabel('Metoda generală pentru inecuații liniare','General method for linear inequalities'),
  intro:learningLabel('Transformăm inecuația fără să schimbăm mulțimea soluțiilor.','Use equivalent transformations without changing the solution set.'),
  rules:[
   {title:learningLabel('Desfacem parantezele','Expand brackets'),text:learningLabel('Distribuim factorii și păstrăm semnele.','Distribute factors and retain signs.')},
   {title:learningLabel('Grupăm termenii','Collect terms'),text:learningLabel('Mutăm termenii cu x într-o parte și constantele în cealaltă.','Collect variables and constants on opposite sides.')},
   {title:learningLabel('Verificăm semnul divizorului','Check the sign of the divisor'),text:learningLabel('La înmulțire sau împărțire cu număr negativ, inversăm sensul inegalității.','Multiplying or dividing by a negative number reverses the inequality.')},
   {title:learningLabel('Scriem mulțimea soluțiilor','Write the solution set'),text:learningLabel('Folosim limite deschise pentru < și > și limite închise pentru ≤ și ≥.','Use open endpoints for strict inequalities and closed endpoints otherwise.')},
   {title:learningLabel('Verificăm cu valori de control','Test representative values'),text:learningLabel('O valoare acceptată și una respinsă trebuie să respecte inecuația inițială.','Test an included and an excluded value in the original inequality.')}
  ],tip:learningLabel('Dacă x se elimină, rezultatul poate fi întreaga mulțime reală sau mulțimea vidă.','If x cancels, the solution set may be all real numbers or empty.')};
}
// Registry provides a single, auditable entry point for supported local algebra.
// Unsupported classes remain explicit rather than receiving an invented proof.
// Local 2x2 linear system. Strict parsing rejects nonlinear/ambiguous forms.
// Keep both equations as ONE task, and verify the result in BOTH originals.
function mathLinearSystem(source){
 const cleaned=String(source||'').replace(/[−–]/g,'-').replace(/[×·]/g,'*')
  .replace(/\\r/g,'').replace(/^[\\s{]+|[\\s}]+$/g,'').trim();
 const rows=cleaned.split(/\\n|;/).map(v=>v.trim()).filter(Boolean);
 if(rows.length!==2)return null;
 const parseSide=side=>{
  const raw=side.replace(/\\s+/g,'').replace(/,/g,'.');
  if(!raw||raw.length>140||!/^[+\\-0-9.xy*]+$/i.test(raw))return null;
  const parts=raw.replace(/-/g,'+-').split('+').filter(Boolean);
  if(!parts.length||parts.length>15)return null;
  const sums={x:0,y:0,c:0};
  for(let term of parts){
   const sign=term.startsWith('-')?-1:1;
   if(sign<0)term=term.slice(1);
   let m=term.match(/^(?:(\\d+(?:\\.\\d+)?)(?:\\*)?)?([xy])$/i);
   if(m){sums[m[2].toLowerCase()]+=sign*Number(m[1]||1);continue;}
   if(!/^\\d+(?:\\.\\d+)?$/.test(term))return null;
   sums.c+=sign*Number(term);
  }
  return Object.values(sums).every(n=>Number.isFinite(n)&&Math.abs(n)<1e9)?sums:null;
 };
 const equations=[];
 for(const row of rows){
  const sides=row.split('=');
  if(sides.length!==2)return null;
  const lhs=parseSide(sides[0]),rhs=parseSide(sides[1]);
  if(!lhs||!rhs)return null;
  equations.push({a:lhs.x-rhs.x,b:lhs.y-rhs.y,c:rhs.c-lhs.c,original:row});
 }
 const [p,q]=equations;
 const det=p.a*q.b-q.a*p.b;
 const dx=p.c*q.b-q.c*p.b,dy=p.a*q.c-q.a*p.c;
 const scale=Math.max(1,...equations.flatMap(v=>[Math.abs(v.a),Math.abs(v.b),Math.abs(v.c)]));
 const eps=1e-10*scale*scale;
 const kind=Math.abs(det)>eps?'unique':(Math.abs(dx)>eps||Math.abs(dy)>eps?'inconsistent':'dependent');
 let x=null,y=null;
 if(kind==='unique'){
  x=dx/det;y=dy/det;
  if(!Number.isFinite(x)||!Number.isFinite(y))return null;
  if(equations.some(e=>Math.abs(e.a*x+e.b*y-e.c)>1e-8*Math.max(1,Math.abs(e.a*x),Math.abs(e.b*y),Math.abs(e.c))))return null;
 }
 return {equations,det,dx,dy,kind,x,y};
}
function mathLinearSystemSolution(source){
 const m=mathLinearSystem(source);if(!m)return null;
 const n=mathLinearNotation().number;
 const steps=[{label:learningLabel('Identificăm coeficienții','Identify the coefficients'),
  reason:learningLabel('Scriem ambele ecuații în forma ax + by = c.','Write both equations in the form ax + by = c.'),
  operation:m.equations.map((e,i)=>(i+1)+': '+n(e.a)+'x + ('+n(e.b)+')y = '+n(e.c)).join(' ; '),
  fullAfter:m.equations.map(e=>e.original).join(' ; '),signRule:''},
 {label:learningLabel('Calculăm determinanții','Calculate determinants'),
  reason:learningLabel('Folosim regula lui Cramer și verificăm dacă determinantul principal este zero.','Use Cramer’s rule and inspect the main determinant.'),
  operation:'D = '+n(m.det)+'; Dx = '+n(m.dx)+'; Dy = '+n(m.dy),
  fullAfter:'D = '+n(m.det),signRule:''}];
 let conclusion;
 if(m.kind==='unique'){
  steps.push({label:learningLabel('Determinăm necunoscutele','Find the unknowns'),
   reason:learningLabel('Deoarece D este nenul, x = Dx/D și y = Dy/D.','Because D is nonzero, x = Dx/D and y = Dy/D.'),
   operation:'x = '+n(m.dx)+' / '+n(m.det)+' = '+n(m.x)+'; y = '+n(m.dy)+' / '+n(m.det)+' = '+n(m.y),
   fullAfter:'x = '+n(m.x)+'; y = '+n(m.y),signRule:''});
  const proof=m.equations.map((e,i)=>(i+1)+': '+n(e.a)+' × ('+n(m.x)+') + ('+n(e.b)+') × ('+n(m.y)+') = '+n(e.c)+' → '+n(e.a*m.x+e.b*m.y)+' = '+n(e.c));
  steps.push({label:learningLabel('Verificăm ambele ecuații','Verify both original equations'),
   reason:learningLabel('Înlocuim valorile obținute în fiecare ecuație inițială.','Substitute into both original equations.'),
   operation:proof.join(' ; '),fullAfter:proof.at(-1),verificationSteps:proof,signRule:''});
  conclusion=learningLabel('Soluție unică verificată: ','Verified unique solution: ')+'x = '+n(m.x)+', y = '+n(m.y)+'.';
 }else{
  conclusion=m.kind==='dependent'?
   learningLabel('Sistem compatibil nedeterminat: infinit de multe soluții.','Dependent system: infinitely many solutions.'):
   learningLabel('Sistem incompatibil: nu există soluții.','Inconsistent system: no solutions.');
 }
 return {intro:learningLabel('Rezolvăm sistemul liniar de două ecuații prin determinanți.','Solve the two-equation linear system using determinants.'),
  steps,conclusion};
}
function mathLinearSystemMethod(source){
 if(!mathLinearSystem(source))return null;
 return {heading:learningLabel('Metoda generală pentru sisteme liniare 2×2','General method for 2×2 linear systems'),
  intro:learningLabel('Metoda determinanților oferă atât soluția, cât și clasificarea sistemului.','Determinants identify the solution and classify the system.'),
  rules:[
   {title:learningLabel('Aducem la forma standard','Use standard form'),text:learningLabel('Scriem ecuațiile ca ax + by = c.','Write equations as ax + by = c.')},
   {title:learningLabel('Calculăm D','Compute D'),text:learningLabel('D = a₁b₂ − a₂b₁.','D = a₁b₂ − a₂b₁.')},
   {title:learningLabel('Calculăm Dx și Dy','Compute Dx and Dy'),text:learningLabel('Înlocuim coloana coeficienților corespunzătoarei necunoscute cu termenii liberi.','Replace the corresponding coefficient column with constants.')},
   {title:learningLabel('Clasificăm sistemul','Classify the system'),text:learningLabel('D ≠ 0: soluție unică. D = 0 și un determinant secundar nenul: fără soluții. Toți trei zero: infinit de soluții.','D nonzero: unique. D zero with a secondary determinant nonzero: inconsistent. All zero: dependent.')},
   {title:learningLabel('Verificăm','Verify'),text:learningLabel('Înlocuim soluția în ambele ecuații inițiale.','Substitute into both original equations.')}
  ],tip:learningLabel('Metoda reducerii sau substituției oferă o verificare independentă.','Elimination or substitution is an independent way to check.')};
}
function mathLinearSystemGraphData(source){
 const m=mathLinearSystem(source);if(!m)return null;
 return {system:m,heading:learningLabel('Graficul sistemului de două ecuații','Graph of the linear system'),
  intro:learningLabel('Reprezentăm cele două drepte definite de ecuațiile inițiale.','Plot the two lines defined by the original equations.'),
  conclusion:m.kind==='unique'?
   learningLabel('Punctul comun este (','The intersection is (')+mathLinearNotation().number(m.x)+'; '+mathLinearNotation().number(m.y)+').':
   m.kind==='inconsistent'?learningLabel('Dreptele sunt paralele și distincte: nu există punct comun.','The lines are distinct and parallel.'):
    learningLabel('Dreptele coincid: infinit de multe puncte comune.','The lines coincide.')};
}
function mathLinearSystemFigure(model){
 if(!model||!Array.isArray(model.equations)||model.equations.length!==2)return null;
 const {equations}=model,focusX=model.kind==='unique'?model.x:0,focusY=model.kind==='unique'?model.y:0;
 const extent=Math.max(5,Math.min(30,Math.ceil(Math.abs(focusX)*.25+Math.abs(focusY)*.25+5)));
 const xmin=focusX-extent,xmax=focusX+extent,ymin=focusY-extent,ymax=focusY+extent;
 const W=420,H=300,L=40,R=15,T=18,B=36;
 const px=x=>L+(x-xmin)*(W-L-R)/(xmax-xmin),py=y=>T+(ymax-y)*(H-T-B)/(ymax-ymin);
 const fig=document.createElement('figure');fig.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 300',role:'img','aria-label':learningLabel('Două drepte ale sistemului','Two system lines')});
 svg.append(mathSvgElement('rect',{x:L,y:T,width:W-L-R,height:H-T-B,fill:'#0b253a'}));
 for(let v=Math.ceil(xmin);v<=xmax;v+=Math.max(1,Math.ceil(extent/5))){
  mathSvgLine(svg,px(v),T,px(v),H-B,'#396278',.8,.5);
  mathSvgText(svg,px(v),H-B+15,v,'middle',10);
 }
 for(let v=Math.ceil(ymin);v<=ymax;v+=Math.max(1,Math.ceil(extent/5))){
  mathSvgLine(svg,L,py(v),W-R,py(v),'#396278',.8,.5);
  mathSvgText(svg,L-5,py(v)+4,v,'end',10);
 }
 if(xmin<=0&&xmax>=0)mathSvgLine(svg,px(0),T,px(0),H-B,'#9eb8c7',1.5);
 if(ymin<=0&&ymax>=0)mathSvgLine(svg,L,py(0),W-R,py(0),'#9eb8c7',1.5);
 equations.forEach((e,i)=>{
  const color=i===0?'#42dbd7':'#ffca77';
  const a=Math.abs(e.b)>1e-10?{x:xmin,y:(e.c-e.a*xmin)/e.b}:
   Math.abs(e.a)>1e-10?{x:e.c/e.a,y:ymin}:null;
  const b=Math.abs(e.b)>1e-10?{x:xmax,y:(e.c-e.a*xmax)/e.b}:
   Math.abs(e.a)>1e-10?{x:e.c/e.a,y:ymax}:null;
  if(!a||!b)return;
  // Clip visually via the plot viewport, including steep lines.
  const clipId='mathsys-'+String(Math.abs(Math.round((e.a+e.b+e.c)*10000)))+'-'+i;
  const defs=mathSvgElement('defs',{});
  const clip=mathSvgElement('clipPath',{id:clipId});clip.append(mathSvgElement('rect',{x:L,y:T,width:W-L-R,height:H-T-B}));defs.append(clip);svg.append(defs);
  svg.append(mathSvgElement('line',{x1:px(a.x),y1:py(a.y),x2:px(b.x),y2:py(b.y),
   stroke:color,'stroke-width':3,'clip-path':'url(#'+clipId+')'}));
 });
 if(model.kind==='unique'&&model.x>=xmin&&model.x<=xmax&&model.y>=ymin&&model.y<=ymax){
  svg.append(mathSvgElement('circle',{cx:px(model.x),cy:py(model.y),r:5,fill:'#fff',stroke:'#0b253a','stroke-width':1.5}));
  mathSvgText(svg,px(model.x)+7,py(model.y)-9,'('+mathLinearNotation().number(model.x)+'; '+mathLinearNotation().number(model.y)+')','start',11,'#ffffff');
 }
 fig.append(svg);
 const caption=document.createElement('figcaption');
 caption.textContent=learningLabel('Dreapta 1 (turcoaz), dreapta 2 (galben).','Line 1 (cyan), line 2 (yellow).');
 fig.append(caption);return fig;
}

// Strict local 3x3 algebra: no remote model calculates or fabricates a solution.
function mathMatrix3Det(rows){
 if(!Array.isArray(rows)||rows.length!==3||rows.some(r=>!Array.isArray(r)||r.length!==3||r.some(v=>!Number.isFinite(v))))return null;
 const [[a,b,c],[d,e,f],[g,h,i]]=rows;
 return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
}
function mathSystem3x3(source){
 const rows=String(source||'').trim().replace(/\\r/g,'').split(/\\n|;/).map(s=>s.trim()).filter(Boolean);
 if(rows.length!==3)return null;
 const equations=[];
 const parseSide=side=>{
  const src=side.replace(/\\s+/g,'').replaceAll('−','-').replaceAll('–','-').replaceAll(',','.');
  if(!src||src.length>140||!/^[0-9.xyz+*\\-.]+$/i.test(src))return null;
  const parts=src.replace(/-/g,'+-').split('+').filter(Boolean);
  if(parts.length>18||!parts.length)return null;
  const out={x:0,y:0,z:0,c:0};
  for(let term of parts){
   let sign=1;if(term[0]==='-'){sign=-1;term=term.slice(1);}
   const matched=term.match(/^(?:(\\d+(?:\\.\\d+)?)(?:\\*)?)?([xyz])$/i);
   if(matched){out[matched[2].toLowerCase()]+=sign*Number(matched[1]||1);continue;}
   if(!/^\\d+(?:\\.\\d+)?$/.test(term))return null;
   out.c+=sign*Number(term);
  }
  return Object.values(out).every(v=>Number.isFinite(v)&&Math.abs(v)<=1e7)?out:null;
 };
 for(const row of rows){
  const pair=row.split('=');if(pair.length!==2)return null;
  const l=parseSide(pair[0]),r=parseSide(pair[1]);if(!l||!r)return null;
  const e={a:l.x-r.x,b:l.y-r.y,c:l.z-r.z,d:r.c-l.c,original:row};
  if(Object.values(e).slice(0,4).some(v=>!Number.isFinite(v)||Math.abs(v)>2e7))return null;
  equations.push(e);
 }
 const matrix=equations.map(e=>[e.a,e.b,e.c]);
 const determinant=mathMatrix3Det(matrix);
 if(determinant===null)return null;
 const detX=mathMatrix3Det(equations.map(e=>[e.d,e.b,e.c]));
 const detY=mathMatrix3Det(equations.map(e=>[e.a,e.d,e.c]));
 const detZ=mathMatrix3Det(equations.map(e=>[e.a,e.b,e.d]));
 // Rank via scaled pivot elimination; classify inconsistent/dependent robustly.
 const augmented=equations.map(e=>[e.a,e.b,e.c,e.d]);
 const scale=Math.max(1,...augmented.flat().map(Math.abs));
 const tolerance=1e-10*scale;
 let pivotRow=0;
 for(let col=0;col<3&&pivotRow<3;col++){
  let best=pivotRow;
  for(let row=pivotRow+1;row<3;row++)if(Math.abs(augmented[row][col])>Math.abs(augmented[best][col]))best=row;
  if(Math.abs(augmented[best][col])<=tolerance)continue;
  [augmented[pivotRow],augmented[best]]=[augmented[best],augmented[pivotRow]];
  const pivot=augmented[pivotRow][col];
  for(let row=pivotRow+1;row<3;row++){
   const ratio=augmented[row][col]/pivot;
   for(let k=col;k<=3;k++)augmented[row][k]-=ratio*augmented[pivotRow][k];
  }
  pivotRow++;
 }
 const inconsistent=augmented.some(r=>r.slice(0,3).every(v=>Math.abs(v)<=tolerance)&&Math.abs(r[3])>tolerance);
 const kind=inconsistent?'inconsistent':pivotRow<3?'dependent':'unique';
 let values=null;
 if(kind==='unique'){
  const x=detX/determinant,y=detY/determinant,z=detZ/determinant;
  if(![x,y,z].every(Number.isFinite))return null;
  if(equations.some(e=>Math.abs(e.a*x+e.b*y+e.c*z-e.d)>1e-7*Math.max(1,Math.abs(e.a*x),Math.abs(e.b*y),Math.abs(e.c*z),Math.abs(e.d))))return null;
  values={x,y,z};
 }
 return {equations,matrix,determinant,detX,detY,detZ,kind,values};
}
function mathSystem3x3Solution(source){
 const m=mathSystem3x3(source);if(!m)return null;
 const n=mathLinearNotation().number;
 const steps=[{
  label:learningLabel('Identificăm coeficienții','Identify coefficients'),
  reason:learningLabel('Scriem fiecare ecuație în forma ax + by + cz = d.','Write each equation as ax + by + cz = d.'),
  operation:m.equations.map((e,i)=>(i+1)+': '+[e.a,e.b,e.c,e.d].map(n).join(', ')).join(' ; '),
  fullAfter:m.equations.map(e=>e.original).join(' ; '),signRule:''
 },{
  label:learningLabel('Calculăm determinanții 3×3','Compute 3×3 determinants'),
  reason:learningLabel('D este determinantul coeficienților; Dx, Dy și Dz înlocuiesc pe rând câte o coloană cu termenii liberi.','D is the coefficient determinant; replace each column to compute Dx, Dy and Dz.'),
  operation:'D = '+n(m.determinant)+'; Dx = '+n(m.detX)+'; Dy = '+n(m.detY)+'; Dz = '+n(m.detZ),
  fullAfter:'D = '+n(m.determinant),signRule:''
 }];
 let conclusion;
 if(m.kind==='unique'){
  const {x,y,z}=m.values;
  steps.push({label:learningLabel('Aplicăm regula lui Cramer','Apply Cramer’s rule'),
   reason:learningLabel('Cum D ≠ 0, împărțim fiecare determinant secundar la D.','Since D ≠ 0, divide each replacement determinant by D.'),
   operation:'x = '+n(m.detX)+' / '+n(m.determinant)+' = '+n(x)+'; y = '+n(m.detY)+' / '+n(m.determinant)+' = '+n(y)+'; z = '+n(m.detZ)+' / '+n(m.determinant)+' = '+n(z),
   fullAfter:'x = '+n(x)+'; y = '+n(y)+'; z = '+n(z),signRule:''});
  const proof=m.equations.map((e,i)=>{
   const lhs=e.a*x+e.b*y+e.c*z;
   return (i+1)+': '+n(e.a)+' × ('+n(x)+') + '+n(e.b)+' × ('+n(y)+') + '+n(e.c)+' × ('+n(z)+') = '+n(e.d)+' → '+n(lhs)+' = '+n(e.d);
  });
  steps.push({label:learningLabel('Verificăm toate cele trei ecuații','Check all three equations'),
   reason:learningLabel('Înlocuim valorile în fiecare ecuație inițială.','Substitute all values into every original equation.'),
   operation:proof.join(' ; '),fullAfter:proof.at(-1),verificationSteps:proof,signRule:''});
  conclusion=learningLabel('Soluție unică verificată: ','Verified unique solution: ')+'x = '+n(x)+', y = '+n(y)+', z = '+n(z)+'.';
 }else{
  steps.push({label:learningLabel('Analizăm rangul sistemului','Classify by rank'),
   reason:learningLabel('Când D = 0, nu folosim împărțirea prin D; reducerea matricei extinse stabilește compatibilitatea.','When D = 0, do not divide by D; use the augmented matrix rank to classify the system.'),
   operation:learningLabel('Verificare prin eliminare Gauss','Checked by Gaussian elimination'),
   fullAfter:learningLabel('Determinantul principal este zero.','The main determinant is zero.'),signRule:''});
  conclusion=m.kind==='dependent'?
   learningLabel('Sistem compatibil nedeterminat: infinit de multe soluții.','Dependent system: infinitely many solutions.'):
   learningLabel('Sistem incompatibil: nu există soluții.','Inconsistent system: no solutions.');
 }
 return {intro:learningLabel('Rezolvăm sistemul cu trei necunoscute prin determinanți și verificare independentă.','Solve the three-variable system using determinants and independent checks.'),
  steps,conclusion};
}
function mathSystem3x3Method(source){
 if(!mathSystem3x3(source))return null;
 return {heading:learningLabel('Metoda sistemelor liniare 3×3','Method for 3×3 linear systems'),
  intro:learningLabel('Pornim de la trei ecuații cu necunoscutele x, y, z.','Start with three linear equations in x, y and z.'),
  rules:[
   {title:learningLabel('Forma standard','Standard form'),text:'ax + by + cz = d'},
   {title:learningLabel('Matricea coeficienților','Coefficient matrix'),text:learningLabel('Așezăm coeficienții în trei rânduri și trei coloane.','Arrange coefficients in three rows and columns.')},
   {title:learningLabel('Determinantul principal','Main determinant'),text:learningLabel('Calculăm D = det(A). Dacă D ≠ 0, sistemul are o soluție unică.','Compute D = det(A). If D ≠ 0, there is a unique solution.')},
   {title:learningLabel('Regula lui Cramer','Cramer’s rule'),text:learningLabel('Calculăm Dx, Dy, Dz și împărțim fiecare la D doar dacă D ≠ 0.','Compute Dx, Dy, Dz and divide by D only if D is nonzero.')},
   {title:learningLabel('Cazuri cu D = 0','Zero determinant'),text:learningLabel('Folosim rangul matricei și al matricei extinse pentru a identifica lipsa soluțiilor sau infinitatea lor.','Use matrix ranks to distinguish inconsistent from dependent systems.')},
   {title:learningLabel('Verificarea soluției','Verify the solution'),text:learningLabel('Înlocuim x, y și z în toate cele trei ecuații originale.','Substitute x, y and z into all three original equations.')}
  ],tip:learningLabel('Un determinant nul nu înseamnă automat că sistemul este incompatibil.','A zero determinant does not automatically mean the system is inconsistent.')};
}
function mathSystem3x3Graph(source){
 const m=mathSystem3x3(source);if(!m)return null;
 return {system3d:m,heading:learningLabel('Reprezentare tridimensională','Three-dimensional representation'),
  intro:learningLabel('Trei planuri calculate din ecuațiile originale. Poți roti și mări desenul prin atingere.','Three planes calculated from the original equations. Rotate and zoom by touch.'),
  conclusion:m.kind==='unique'?
   learningLabel('Intersecția celor trei plane: ','Intersection of the three planes: ')+
   '('+['x','y','z'].map(k=>mathLinearNotation().number(m.values[k])).join('; ')+').':
   m.kind==='dependent'?learningLabel('Sistemul are infinit de multe soluții.','The system has infinitely many solutions.'):
   learningLabel('Sistemul nu are soluții.','The system has no solutions.')};
}

// Exact plane/cube clipping before perspective projection. Every polygon
// vertex satisfies its original equation, including vertical planes.
function math3DPlanePolygon(equation,center,radius){
 const normal=[equation.a,equation.b,equation.c],rhs=equation.d;
 const magnitude=Math.hypot(...normal);
 if(magnitude<1e-12||!Number.isFinite(magnitude)||!Number.isFinite(radius)||radius<=0)return [];
 const corners=[];
 for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])
  corners.push([center[0]+x*radius,center[1]+y*radius,center[2]+z*radius]);
 const points=[];
 const add=p=>{
  if(!p.every(Number.isFinite))return;
  if(points.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])<radius*1e-7))return;
  points.push(p);
 };
 for(let i=0;i<corners.length;i++)for(let j=i+1;j<corners.length;j++){
  const a=corners[i],b=corners[j];
  if(a.filter((v,k)=>v!==b[k]).length!==1)continue;
  const da=normal[0]*a[0]+normal[1]*a[1]+normal[2]*a[2]-rhs;
  const db=normal[0]*b[0]+normal[1]*b[1]+normal[2]*b[2]-rhs;
  const tolerance=radius*1e-9*magnitude;
  if(Math.abs(da)<=tolerance)add(a);
  if(Math.abs(db)<=tolerance)add(b);
  if(da*db<0){
   const t=da/(da-db);
   if(t>=0&&t<=1)add(a.map((v,k)=>v+t*(b[k]-v)));
  }
 }
 if(points.length<3)return [];
 const centroid=[0,1,2].map(k=>points.reduce((acc,p)=>acc+p[k],0)/points.length);
 const unit=normal.map(v=>v/magnitude);
 const helper=Math.abs(unit[2])<.9?[0,0,1]:[0,1,0];
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const v1=cross(unit,helper),len=Math.hypot(...v1);
 if(len<1e-12)return [];
 const axis=v1.map(v=>v/len),other=cross(unit,axis);
 const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 return points.sort((a,b)=>{
  const da=a.map((v,i)=>v-centroid[i]),db=b.map((v,i)=>v-centroid[i]);
  return Math.atan2(dot(da,other),dot(da,axis))-Math.atan2(dot(db,other),dot(db,axis));
 });
}
function mathSystem3x3Figure(system){
 if(!system||!Array.isArray(system.equations)||system.equations.length!==3)return null;
 const center=system.kind==='unique'?[system.values.x,system.values.y,system.values.z]:[0,0,0];
 if(center.some(v=>!Number.isFinite(v)))return null;
 const radius=5;
 const surfaces=system.equations.map((eq,i)=>({index:i,points:math3DPlanePolygon(eq,center,radius)}));
 if(surfaces.every(s=>s.points.length<3))return null;
 const colors=['#42dbd7','#ffca77','#bb9aff'];
 const figure=document.createElement('figure');figure.className='math-result-plot';
 const view=mathSvgElement('svg',{viewBox:'0 0 420 340',role:'img',
  'aria-label':learningLabel('Grafic 3D rotativ cu trei plane','Rotatable 3D chart with three planes'),
  preserveAspectRatio:'xMidYMid meet',style:'width:100%;height:auto;touch-action:none;user-select:none;display:block'});
 const tip=document.createElement('figcaption');
 tip.textContent=learningLabel('Trage pentru rotire, apropie două degete pentru zoom și atinge de două ori pentru resetare. Planurile sunt secțiuni locale ale ecuațiilor.',
  'Drag to rotate, pinch to zoom and double-tap to reset. Surfaces are local sections of the equations.');
 const initialView={yaw:.7,pitch:.42,zoom:1.45};
 const angles={...initialView};
 const pointers=new Map();
 let lastPinch=null,lastTap=0,lastTapPoint=null;
 const project=point=>{
  const [x,y,z]=point.map((v,k)=>v-center[k]);
  const cy=Math.cos(angles.yaw),sy=Math.sin(angles.yaw);
  const xx=cy*x-sy*y,yy=sy*x+cy*y;
  const cp=Math.cos(angles.pitch),sp=Math.sin(angles.pitch);
  const depth=sp*yy+cp*z;
  const vertical=cp*yy-sp*z;
  const factor=angles.zoom*11;
  return {x:210+xx*factor,y:170-vertical*factor,depth};
 };
 const render=()=>{
  view.replaceChildren();
  view.append(mathSvgElement('rect',{x:0,y:0,width:420,height:340,fill:'#0b253a'}));
  const endpoints=[[radius,0,0],[0,radius,0],[0,0,radius]];
  const origin=project(center);
  for(let axis=0;axis<3;axis++){
   const end=project(center.map((v,i)=>v+endpoints[axis][i]));
   const start=project(center.map((v,i)=>v-endpoints[axis][i]));
   view.append(mathSvgElement('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:'#7599aa','stroke-width':1.2,'stroke-dasharray':'4 4'}));
   const lab=mathSvgElement('text',{x:end.x+5,y:end.y-5,'font-size':13,fill:'#d9fbff'});
   lab.textContent=['x','y','z'][axis];view.append(lab);
  }
  const painted=surfaces.filter(s=>s.points.length>=3).map(s=>{
   const transformed=s.points.map(project);
   return {...s,transformed,depth:transformed.reduce((n,p)=>n+p.depth,0)/transformed.length};
  }).sort((a,b)=>a.depth-b.depth);
  for(const surface of painted){
   view.append(mathSvgElement('polygon',{
    points:surface.transformed.map(p=>p.x.toFixed(2)+','+p.y.toFixed(2)).join(' '),
    fill:colors[surface.index],'fill-opacity':.31,
    stroke:colors[surface.index],'stroke-width':1.8,'stroke-linejoin':'round'
   }));
  }
  if(system.kind==='unique'){
   const marker=project([system.values.x,system.values.y,system.values.z]);
   view.append(mathSvgElement('circle',{cx:marker.x,cy:marker.y,r:5.8,fill:'#ffffff',stroke:'#001724','stroke-width':2}));
   const label=mathSvgElement('text',{x:marker.x+9,y:marker.y-10,'font-size':12,fill:'#ffffff'});
   label.textContent='('+['x','y','z'].map(k=>mathLinearNotation().number(system.values[k])).join('; ')+')';
   view.append(label);
  }
 };
 const limit=(v,low,high)=>Math.min(high,Math.max(low,v));
 const distance=()=>{const p=[...pointers.values()];return p.length<2?null:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)};
 view.addEventListener('pointerdown',event=>{
  if(event.cancelable)event.preventDefault();
  const now=Date.now();
  const close=lastTapPoint&&Math.hypot(event.clientX-lastTapPoint.x,event.clientY-lastTapPoint.y)<35;
  if(event.pointerType!=='mouse'&&pointers.size===0&&close&&now-lastTap<350){
   Object.assign(angles,initialView);lastTap=0;lastTapPoint=null;render();
  }else if(pointers.size===0){lastTap=now;lastTapPoint={x:event.clientX,y:event.clientY};}
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  try{view.setPointerCapture(event.pointerId)}catch(_){}
  lastPinch=distance();
 });
 view.addEventListener('pointermove',event=>{
  if(!pointers.has(event.pointerId))return;
  if(event.cancelable)event.preventDefault();
  const previous=pointers.get(event.pointerId);
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  if(pointers.size===1){
   const width=Math.max(1,view.getBoundingClientRect().width);
   angles.yaw+=(event.clientX-previous.x)/width*4;
   angles.pitch=limit(angles.pitch+(event.clientY-previous.y)/width*4,-1.45,1.45);
  }else{
   const next=distance();
   if(lastPinch&&next)angles.zoom=limit(angles.zoom*next/lastPinch,.55,2.3);
   lastPinch=next;
  }
  render();
 });
 const release=e=>{pointers.delete(e.pointerId);lastPinch=distance()};
 view.addEventListener('pointerup',release);
 view.addEventListener('pointercancel',release);
 view.addEventListener('lostpointercapture',release);
 view.addEventListener('wheel',event=>{
  if(event.cancelable)event.preventDefault();
  angles.zoom=limit(angles.zoom*(event.deltaY>0?.91:1.09),.55,2.3);
  render();
 },{passive:false});
 render();figure.append(view,tip);
 return figure;
}

// Restricted local matrix engine: 2x2/3x3, no eval and no arbitrary JS.
function mathMatrixRead(raw){
 const value=String(raw||'').trim();
 if(value.length>220||!/^\\[\\[[-+0-9.,\\s]+\\](?:,\\[[-+0-9.,\\s]+\\]){1,2}\\]$/.test(value))return null;
 let rows;
 try{rows=JSON.parse(value)}catch(_){return null}
 if(!Array.isArray(rows)||rows.length<2||rows.length>3||rows.some(r=>!Array.isArray(r)||r.length!==rows[0].length||r.length<2||r.length>3))return null;
 return rows.every(r=>r.every(v=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=1e6))?rows:null;
}
function mathMatrixDet(matrix){
 if(!matrix||matrix.length!==matrix[0].length)return null;
 if(matrix.length===2)return matrix[0][0]*matrix[1][1]-matrix[0][1]*matrix[1][0];
 if(matrix.length===3)return mathMatrix3Det(matrix);
 return null;
}
function mathMatrixExercise(source){
 const raw=String(source||'').trim().replace(/−/g,'-');
 if(raw.length>550)return null;
 const lines=raw.split(/\\n|;/).map(x=>x.trim()).filter(Boolean);
 const named={};
 let operation='';
 for(const line of lines){
  const def=line.match(/^([AB])\\s*=\\s*(\\[\\[.*\\]\\])$/i);
  if(def){
   const name=def[1].toUpperCase();
   if(named[name])return null;
   const value=mathMatrixRead(def[2]);if(!value)return null;
   named[name]=value;continue;
  }
  if(operation)return null;
  operation=line;
 }
 const inline=operation.match(/^(?:det|determinant|transp(?:ose|usă)?)\\s*\\(\\s*(\\[\\[.*\\]\\]|[AB])\\s*\\)$/i);
 let mode=null,first=null,second=null;
 if(inline){
  mode=/^(?:det|determinant)/i.test(operation)?'det':'transpose';
  first=inline[1].length===1?named[inline[1].toUpperCase()]:mathMatrixRead(inline[1]);
 }else{
  const binary=operation.match(/^([AB])\\s*([+*×-])\\s*([AB])$/i);
  const unary=operation.match(/^(det|determinant|transpose|transp|transpusă)\\(\\s*([AB])\\s*\\)$/i);
  if(binary){mode=({'+':'add','-':'subtract','*':'multiply','×':'multiply'})[binary[2]];first=named[binary[1].toUpperCase()];second=named[binary[3].toUpperCase()]}
  else if(unary){mode=/^det/i.test(unary[1])?'det':'transpose';first=named[unary[2].toUpperCase()]}
  else return null;
 }
 if(!first||!mode)return null;
 const rows=first.length,cols=first[0].length;
 let result=null;
 if(mode==='det'){result=mathMatrixDet(first);if(result===null)return null;}
 else if(mode==='transpose')result=first[0].map((_,j)=>first.map(row=>row[j]));
 else if(!second)return null;
 else if(mode==='multiply'){
  if(cols!==second.length)return null;
  result=first.map(row=>second[0].map((_,j)=>row.reduce((sum,v,k)=>sum+v*second[k][j],0)));
 }else{
  if(rows!==second.length||cols!==second[0].length)return null;
  result=first.map((row,i)=>row.map((v,j)=>mode==='add'?v+second[i][j]:v-second[i][j]));
 }
 const entries=typeof result==='number'?[result]:result.flat();
 if(entries.some(v=>!Number.isFinite(v)||Math.abs(v)>1e12))return null;
 return {raw,mode,first,second,result};
}
function mathMatrixSolution(source){
 const m=mathMatrixExercise(source);if(!m)return null;
 const show=a=>JSON.stringify(a);
 const labels={det:learningLabel('Determinant','Determinant'),transpose:learningLabel('Transpunere','Transpose'),
 add:learningLabel('Adunare','Addition'),subtract:learningLabel('Scădere','Subtraction'),multiply:learningLabel('Înmulțire','Multiplication')};
 return {intro:learningLabel('Calculăm operația pe matrice și verificăm dimensiunile.','Compute the matrix operation, verifying dimensions.'),
  steps:[
   {label:learningLabel('Identificăm matricea și operația','Identify matrix and operation'),
    reason:learningLabel('Se verifică dimensiunile și compatibilitatea operației.','Check dimensions and operation compatibility.'),
    operation:labels[m.mode]+': '+show(m.first)+(m.second?' ; '+show(m.second):''),fullAfter:m.raw,signRule:''},
   {label:learningLabel('Efectuăm calculul','Compute the result'),
    reason:m.mode==='multiply'?learningLabel('Fiecare element al produsului este suma produselor din linia și coloana corespunzătoare.','Each product entry is the dot product of a row and a column.'):
     m.mode==='det'?learningLabel('Calculăm determinantul matricei pătrate.','Compute the square matrix determinant.'):
     learningLabel('Aplicăm operația element cu element sau inversăm liniile cu coloanele.','Apply the elementwise operation or swap rows and columns.'),
    operation:show(m.result),fullAfter:show(m.result),signRule:''}
  ],conclusion:learningLabel('Rezultat verificat: ','Verified result: ')+show(m.result)};
}
function mathMatrixMethod(source){
 const m=mathMatrixExercise(source);if(!m)return null;
 return {heading:learningLabel('Metoda operațiilor pe matrice','Method for matrix operations'),
  intro:learningLabel('Forma, dimensiunile și ordinea înmulțirii sunt esențiale.','Dimensions and multiplication order matter.'),
  rules:[
   {title:learningLabel('Dimensiunile','Dimensions'),text:learningLabel('Pentru adunare sau scădere, matricile trebuie să aibă aceleași dimensiuni.','Addition and subtraction require matching dimensions.')},
   {title:learningLabel('Înmulțirea','Multiplication'),text:learningLabel('Numărul coloanelor primei matrice trebuie să fie egal cu numărul liniilor celei de-a doua.','The first matrix columns must match the second matrix rows.')},
   {title:learningLabel('Determinantul','Determinant'),text:learningLabel('Este definit doar pentru matrice pătrate.','It is defined only for square matrices.')},
   {title:learningLabel('Transpusa','Transpose'),text:learningLabel('Schimbăm liniile cu coloanele.','Swap rows and columns.')},
   {title:learningLabel('Verificarea','Verification'),text:learningLabel('Controlăm fiecare element rezultat, nu doar dimensiunea.','Check all resulting entries.')}
  ],tip:learningLabel('În general A×B nu este egal cu B×A.','Usually A×B differs from B×A.')};
}
// Bounded symbolic polynomial parser for one variable x, degree up to 4.
function mathSymbolicPoly(source){
 let text=String(source||'').trim().replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/³/g,'^3').replace(/×/g,'*');
 text=text.replace(/^(?:simplific[ăa]|dezvolt[ăa]|expand|simplify)\\s*:?\\s*/i,'');
 text=text.replace(/\\s+/g,'');
 if(!text||!text.includes('x')||text.length>160||!/^[0-9x+*()^\\-.]+$/i.test(text)||text.includes('='))return null;
 const tokens=text.match(/(?:\\d+(?:\\.\\d+)?|x|[+*()^\\-])/gi);
 if(!tokens||tokens.join('').toLowerCase()!==text.toLowerCase()||tokens.length>120)return null;
 let at=0;
 const trim=p=>{while(p.length>1&&Math.abs(p.at(-1))<1e-12)p.pop();return p};
 const add=(a,b,sign=1)=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]||0)+sign*(b[i]||0)));
 const mul=(a,b)=>{
  if(a.length+b.length-2>4)return null;
  const out=Array(a.length+b.length-1).fill(0);
  a.forEach((x,i)=>b.forEach((y,j)=>{out[i+j]+=x*y}));
  if(out.some(v=>!Number.isFinite(v)||Math.abs(v)>1e10))return null;
  return trim(out);
 };
 const atom=()=>{
  const tok=tokens[at++];
  if(tok==='+'||tok==='-'){const v=power();return v?(tok==='-'?v.map(n=>-n):v):null;}
  if(tok==='('){const p=sum();if(tokens[at++]!==')')return null;return p;}
  if(tok==='x')return [0,1];
  if(tok&&/^\\d/.test(tok))return [Number(tok)];
  return null;
 };
 const power=()=>{
  let v=atom();if(!v)return null;
  if(tokens[at]==='^'){
   at++;const exponent=tokens[at++];
   if(!/^[0-4]$/.test(exponent||''))return null;
   let result=[1];for(let n=0;n<Number(exponent);n++){result=mul(result,v);if(!result)return null;}
   v=result;
  }
  return v;
 };
 const product=()=>{
  let value=power();if(!value)return null;
  while(at<tokens.length&&tokens[at]!==')'&&tokens[at]!=='+'&&tokens[at]!=='-'){
   const explicit=tokens[at]==='*';if(explicit)at++;
   if(!explicit&&!['x','('].includes(tokens[at]))return null;
   const right=power();if(!right)return null;
   value=mul(value,right);if(!value)return null;
  }
  return value;
 };
 const sum=()=>{
  let value=product();if(!value)return null;
  while(tokens[at]==='+'||tokens[at]==='-'){
   const sign=tokens[at++]==='+'?1:-1;
   const right=product();if(!right)return null;
   value=add(value,right,sign);
   if(value.some(v=>!Number.isFinite(v)||Math.abs(v)>1e10))return null;
  }
  return value;
 };
 const coefficients=sum();
 return coefficients&&at===tokens.length?{raw:text,coefficients}:null;
}
function mathSymbolicFormat(coefficients){
 const fmt=mathLinearNotation().number,terms=[];
 for(let i=coefficients.length-1;i>=0;i--){
  const v=coefficients[i];if(Math.abs(v)<1e-10)continue;
  const sign=v<0?'−':'+',abs=Math.abs(v);
  const variable=i===0?'':i===1?'x':'x^'+i;
  const term=(variable&&Math.abs(abs-1)<1e-10?'':fmt(abs))+variable;
  terms.push({sign,term});
 }
 if(!terms.length)return '0';
 return terms.map((p,i)=>(i===0?(p.sign==='−'?'−':''):(' '+p.sign+' '))+p.term).join('');
}
function mathSymbolicSolution(source){
 const m=mathSymbolicPoly(source);if(!m)return null;
 const result=mathSymbolicFormat(m.coefficients);
 return {intro:learningLabel('Simplificăm expresia simbolică folosind distributivitatea și reducerea termenilor asemenea.','Simplify the symbolic expression by distributing and collecting like terms.'),
  steps:[{
   label:learningLabel('Interpretăm expresia','Parse the expression'),
   reason:learningLabel('Recunoaștem parantezele, puterile și produsele.','Identify parentheses, powers and products.'),
   operation:m.raw,fullAfter:m.raw,signRule:''
  },{
   label:learningLabel('Reducem termenii asemenea','Collect like terms'),
   reason:learningLabel('Coeficienții fiecărei puteri a lui x sunt calculați separat și verificați numeric.','Combine coefficients for each power of x.'),
   operation:result,fullAfter:result,signRule:''
  }],conclusion:learningLabel('Forma simplificată: ','Simplified form: ')+result};
}
function mathSymbolicMethod(source){
 if(!mathSymbolicPoly(source))return null;
 return {heading:learningLabel('Metoda de simplificare polinomială','Polynomial simplification method'),
  intro:learningLabel('Păstrăm egalitatea expresiei originale cu cea simplificată.','Keep the expanded expression equal to the original.'),
  rules:[
   {title:learningLabel('Prioritatea operațiilor','Operator precedence'),text:learningLabel('Calculăm puterile înaintea produselor și sumelor.','Compute powers before products and sums.')},
   {title:learningLabel('Distributivitatea','Distributive property'),text:learningLabel('Înmulțim toți termenii afectați de paranteze.','Multiply all terms affected by parentheses.')},
   {title:learningLabel('Termeni asemenea','Like terms'),text:learningLabel('Adunăm numai coeficienții acelorași puteri ale lui x.','Combine coefficients only at equal powers of x.')},
   {title:learningLabel('Verificare','Check'),text:learningLabel('Evaluăm numeric ambele forme în câteva puncte de control.','Evaluate both forms at several check points.')}
  ],tip:learningLabel('Motorul local tratează deocamdată polinoame în x până la gradul patru.','The local engine currently handles polynomials in x up to degree four.')};
}

// Graph mode for symbolic polynomials: use the coefficients computed by the
// same local parser as Solve. It is an associated function, not an equation.
function mathSymbolicGraph(source){
 const p=mathSymbolicPoly(source);if(!p)return null;
 const expression=mathSymbolicFormat(p.coefficients);
 return {polynomial:p.coefficients,heading:learningLabel('Graficul funcției asociate expresiei','Graph of the function associated with the expression'),
  intro:learningLabel('Considerăm expresia simplificată ca funcție: f(x) = ','Treat the simplified expression as a function: f(x) = ')+expression+'.',
  conclusion:learningLabel('Curba este calculată local din coeficienții polinomului, fără să modificăm expresia inițială.','The curve is computed locally from the polynomial coefficients without changing the original expression.')};
}
function mathSymbolicPlot(coefficients){
 if(!Array.isArray(coefficients)||coefficients.length<1||coefficients.length>5)return null;
 const value=x=>coefficients.reduceRight((total,c)=>total*x+c,0);
 const width=420,height=288,left=52,right=16,top=20,bottom=39,xmin=-4,xmax=4;
 const sampled=Array.from({length:241},(_,i)=>{
  const x=xmin+(xmax-xmin)*i/240;return {x,y:value(x)};
 });
 if(sampled.some(p=>!Number.isFinite(p.y)))return null;
 const magnitude=Math.max(4,...sampled.map(p=>Math.abs(p.y)));
 const ymin=-magnitude*1.08,ymax=magnitude*1.08;
 const px=x=>left+(x-xmin)/(xmax-xmin)*(width-left-right);
 const py=y=>top+(ymax-y)/(ymax-ymin)*(height-top-bottom);
 const figure=document.createElement('figure');figure.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 288',role:'img','aria-label':learningLabel('Grafic polinomial verificat','Verified polynomial graph')});
 svg.append(mathSvgElement('rect',{x:left,y:top,width:width-left-right,height:height-top-bottom,fill:'#0b253a'}));
 for(let x=-4;x<=4;x++){
  mathSvgLine(svg,px(x),top,px(x),height-bottom,'#396278',.7,.5);
  if(x%2===0)mathSvgText(svg,px(x),height-bottom+16,x,'middle',10);
 }
 for(let i=-2;i<=2;i++){
  const y=i*magnitude/2;
  mathSvgLine(svg,left,py(y),width-right,py(y),'#396278',.7,.5);
  mathSvgText(svg,left-5,py(y)+3,Number(y.toPrecision(3)),'end',10);
 }
 mathSvgLine(svg,px(0),top,px(0),height-bottom,'#9eb8c7',1.5);
 mathSvgLine(svg,left,py(0),width-right,py(0),'#9eb8c7',1.5);
 const points=sampled.map((p,i)=>(i?'L':'M')+px(p.x).toFixed(2)+' '+py(p.y).toFixed(2)).join(' ');
 svg.append(mathSvgElement('path',{d:points,fill:'none',stroke:'#42dbd7','stroke-width':3}));
 mathSvgText(svg,width-right,height-bottom+28,'x','end',13);
 mathSvgText(svg,left-3,top-5,'y','end',13);
 const caption=document.createElement('figcaption');
 caption.textContent='f(x) = '+mathSymbolicFormat(coefficients);
 figure.append(svg,caption);return figure;
}
// A matrix is not inherently a function y=f(x). Show its actual numeric
// entries as a heat map rather than pretending it is a function graph.
function mathMatrixGraph(source){
 const m=mathMatrixExercise(source);if(!m)return null;
 return {matrixView:m,
  heading:learningLabel('Reprezentarea valorilor din matrice','Matrix values visualization'),
  intro:learningLabel('Celulele reprezintă pozițiile din matrice, iar culoarea indică semnul și mărimea fiecărui element.','Cells show matrix positions; their colors indicate the sign and magnitude of each entry.'),
  conclusion:learningLabel('Acesta este un tablou vizual al elementelor, nu graficul unei funcții. Rezultatul operației este calculat local.','This is a visualization of matrix entries, not a function graph. The operation result is calculated locally.')};
}
function mathMatrixHeatmap(model){
 if(!model||!Array.isArray(model.first))return null;
 const figure=document.createElement('figure');figure.className='math-result-plot';
 const datasets=[['A',model.first]];
 if(model.second)datasets.push(['B',model.second]);
 datasets.push([learningLabel('Rezultat','Result'),model.result]);
 const matrices=datasets.filter(item=>Array.isArray(item[1]));
 const max=Math.max(1,...matrices.flatMap(([,a])=>a.flat().map(Math.abs)));
 const wrapper=document.createElement('div');
 wrapper.style.cssText='display:grid;gap:14px;padding:12px 6px;';
 for(const [title,matrix] of matrices){
  const region=document.createElement('div');
  const heading=document.createElement('strong');
  heading.textContent=title;
  region.append(heading);
  const grid=document.createElement('div');
  grid.style.cssText='display:grid;gap:5px;margin-top:7px;max-width:100%;';
  grid.style.gridTemplateColumns='repeat('+matrix[0].length+',minmax(0,1fr))';
  for(const row of matrix)for(const number of row){
   const cell=document.createElement('span');
   const alpha=(.13+.52*Math.abs(number)/max).toFixed(3);
   cell.style.cssText='display:flex;align-items:center;justify-content:center;min-height:48px;padding:6px 2px;border:1px solid #57849d;border-radius:7px;font-weight:700;font-variant-numeric:tabular-nums;background:'+
    (number<0?'rgba(255,150,99,'+alpha+')':'rgba(66,219,215,'+alpha+')')+';';
   cell.textContent=mathLinearNotation().number(number);
   grid.append(cell);
  }
  region.append(grid);wrapper.append(region);
 }
 if(typeof model.result==='number'){
  const scalar=document.createElement('p');
  scalar.textContent=learningLabel('Determinant: ','Determinant: ')+mathLinearNotation().number(model.result);
  wrapper.append(scalar);
 }
 const caption=document.createElement('figcaption');
 caption.textContent=learningLabel('Turcoaz: valori pozitive sau zero. Portocaliu: valori negative. Intensitatea arată mărimea relativă.','Cyan: nonnegative values. Orange: negative values. Color intensity indicates relative magnitude.');
 figure.append(wrapper,caption);return figure;
}

// Exact, bounded reduction of like monomials (integer coefficients, powers,
// multiple letters and isolated square-root coefficients). No OCR guessing.
function mathLikeTermsModel(source){
 let text=String(source||'').trim().replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');
 text=text.replace(/^(?:simplific[ăa]|reduce[țt]i\\s+termenii\\s+asemenea|simplify)\\s*:?\\s*/i,'').replace(/\\s+/g,'');
 if(text.length<3||text.length>180||!/[a-z√]/i.test(text)||/[=()*/\\\\]/.test(text))return null;
 if(!/^[+-]?[^+-]+(?:[+-][^+-]+)+$/.test(text))return null;
 const tokens=text.match(/[+-]?[^+-]+/g);
 if(!tokens||tokens.length<2||tokens.length>30||tokens.join('')!==text)return null;
 const groups=new Map();
 for(const token of tokens){
  const negative=token[0]==='-',body=token.replace(/^[+-]/,'');
  const match=body.match(/^(\\d+)?(√(?:[2-9]|[1-9]\\d+))?((?:[a-z](?:\\^[1-6])?)*)$/i);
  if(!match||(!match[1]&&!match[2]&&!match[3]))return null;
  const coefficient=(negative?-1:1)*Number(match[1]||1);
  if(!Number.isSafeInteger(coefficient)||Math.abs(coefficient)>100000)return null;
  const powers=new Map(),letters=match[3].match(/[a-z](?:\\^[1-6])?/gi)||[];
  if(letters.join('')!==match[3])return null;
  for(const letter of letters){
   const name=letter[0].toLowerCase(),exponent=Number(letter.split('^')[1]||1);
   const power=(powers.get(name)||0)+exponent;
   if(power>8)return null;
   powers.set(name,power);
  }
  const suffix=[...powers].sort((a,b)=>a[0].localeCompare(b[0]))
   .map(([name,power])=>name+(power===1?'':'^'+power)).join('');
  const symbol=(match[2]||'')+suffix;
  const key=symbol||'#constant';
  if(!groups.has(key))groups.set(key,{symbol,coefficients:[],sum:0});
  const group=groups.get(key);
  group.sum+=coefficient;group.coefficients.push(coefficient);
 }
 if([...groups.values()].some(g=>Math.abs(g.sum)>1000000))return null;
 const readable=s=>s.replace(/\\^2\\b/g,'²').replace(/\\^3\\b/g,'³').replace(/\\^(\\d+)/g,(_,x)=>'^'+x);
 const formatCoefficient=(n,symbol)=>((symbol&&Math.abs(n)===1)?'':String(Math.abs(n)))+readable(symbol);
 const formatResult=()=>{
  const out=[];
  for(const group of groups.values()){
   if(group.sum===0)continue;
   const negative=group.sum<0;
   const part=formatCoefficient(group.sum,group.symbol);
   out.push((out.length?(negative?' − ':' + '):(negative?'−':''))+part);
  }
  return out.join('')||'0';
 };
 const grouped=[...groups.values()].map(g=>{
  const terms=g.coefficients.map((n,i)=>(i?(n<0?' − ':' + '):(n<0?'−':''))+Math.abs(n)).join('');
  return '('+terms+')'+readable(g.symbol);
 }).join(' + ');
 return {raw:readable(text.replace(/-/g,'−')),grouped,result:formatResult(),groups:[...groups.values()]};
}
function mathLikeTermsSolution(source){
 const m=mathLikeTermsModel(source);if(!m)return null;
 const results=m.groups.map(g=>g.coefficients.join(', ')+' → '+g.sum+' '+g.symbol).join('; ');
 return {intro:learningLabel('Reducem termenii asemenea. Calculăm separat coeficienții fiecărei părți literale, fără a modifica exponenții sau radicalii.',
  'Collect like terms. Add the coefficients for each matching literal part without changing powers or radicals.'),
  steps:[
   {label:learningLabel('Identificăm termenii asemenea','Identify like terms'),
    reason:learningLabel('Numai termenii cu aceleași litere, aceleași puteri și același radical se pot aduna.',
      'Only terms with the same letters, powers and radical can be combined.'),
    operation:m.raw,fullAfter:m.grouped,signRule:''},
   {label:learningLabel('Calculăm coeficienții','Combine the coefficients'),
    reason:learningLabel('Adunăm și scădem numere întregi, păstrând partea literală neschimbată.',
      'Add and subtract integer coefficients while keeping the literal part unchanged.'),
    operation:m.grouped+' = '+m.result,fullAfter:m.result,signRule:''}
  ],conclusion:learningLabel('Rezultat verificat: ','Verified result: ')+m.result};
}
function mathLikeTermsMethod(source){
 if(!mathLikeTermsModel(source))return null;
 return {heading:learningLabel('Metodă: reducerea termenilor asemenea','Method: collecting like terms'),
  intro:learningLabel('Identificăm factorii literali identici și efectuăm operațiile numai asupra coeficienților.',
   'Identify identical variable factors and operate only on the coefficients.'),
  rules:[
   {title:learningLabel('Aceleași litere și puteri','Same variables and powers'),
    text:learningLabel('x și x² nu sunt termeni asemenea. Nici xy și x nu sunt.','x and x² are not like terms; neither are xy and x.')},
   {title:learningLabel('Radicalul trebuie să coincidă','The radical must match'),
    text:learningLabel('2√5xy și 9√5xy pot fi adunați; √3xy este o altă parte literală.','2√5xy and 9√5xy combine, while √3xy is different.')},
   {title:learningLabel('Adunăm coeficienții','Add coefficients'),
    text:learningLabel('Păstrăm literele, puterile și radicalul; respectăm fiecare semn minus.','Keep the literal factors unchanged and respect every minus sign.')},
   {title:learningLabel('Verificăm expresia inițială','Check the original expression'),
    text:learningLabel('Comparăm fiecare termen cu enunțul și verificăm suma coeficienților.','Compare every term to the exercise and check the coefficient sums.')}
  ],tip:learningLabel('Nu modificăm exponenții la adunare și scădere.','Do not change exponents during addition or subtraction.')};
}

// Geometry engine: refuse invented side lengths and validate Pitagora first.
function mathRightTriangleModel(source){
 const t=String(source||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')
  .replace(/[−–]/g,'-').toLowerCase().replace(/\\s+/g,' ').trim();
 if(t.length>400||!/(triunghi(?:ul)? dreptunghic|right(?:[- ]angled?)?[- ]triangle|pitagora|pythagor)/.test(t))return null;
 const numbers=[...t.matchAll(/(\\d+(?:[,.]\\d+)?)(?:\\s*(mm|cm|km|m)\\b)?/g)]
  .map(z=>({n:Number(z[1].replace(',','.')),u:z[2]||''}));
 if(numbers.length!==2||numbers.some(x=>!Number.isFinite(x.n)||x.n<=0||x.n>100000))return null;
 const units=[...new Set(numbers.map(x=>x.u).filter(Boolean))];
 if(units.length>1)return null;
 const num='(\\\\d+(?:[.,]\\\\d+)?)';
 const suffix='(?:\\\\s*(?:mm|cm|km|m)\\\\b)?';
 const lead='\\\\s*(?:(?:sunt|au|de|este|are|masoara|of|measure|is|with)\\\\s*){0,3}[:=]?\\\\s*';
 const pair=new RegExp('\\\\b(?:catetele|catete|legs)\\\\b'+lead+num+suffix+'\\\\s*(?:si|and|,)\\\\s*(?:de\\\\s*)?'+num+suffix,'i').exec(t);
 const leg=new RegExp('\\\\b(?:cateta|catetei|leg)\\\\b'+lead+num,'i').exec(t);
 const hyp=new RegExp('\\\\b(?:ipotenuza|ipotenuzei|hypotenuse)\\\\b'+lead+num,'i').exec(t);
 const value=x=>Number(x.replace(',','.'));
 let a,b,c,kind;
 if(pair&&!leg&&!hyp){
  a=value(pair[1]);b=value(pair[2]);c=Math.hypot(a,b);kind='hypotenuse';
 }else if(leg&&hyp&&!pair){
  a=value(leg[1]);c=value(hyp[1]);if(c<=a)return null;
  b=Math.sqrt((c-a)*(c+a));kind='missing-leg';
 }else return null;
 if(![a,b,c].every(x=>Number.isFinite(x)&&x>0))return null;
 if(!numbers.some(x=>x.n===a)||!numbers.some(x=>x.n===(kind==='hypotenuse'?b:c)))return null;
 return {a,b,c,area:a*b/2,perimeter:a+b+c,kind,unit:units[0]||''};
}
function mathRightTriangleNumber(value){
 return new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:6}).format(Math.abs(value)<1e-10?0:value);
}
function mathRightTriangleSolution(source){
 const m=mathRightTriangleModel(source);if(!m)return null;
 const f=mathRightTriangleNumber,u=m.unit?' '+m.unit:'';
 const first=m.kind==='hypotenuse';
 const steps=[
  {label:learningLabel('Identificăm laturile','Identify the sides'),
   reason:learningLabel('Catetele se întâlnesc la unghiul drept; ipotenuza este opusă acestuia.',
    'The legs meet at the right angle; the hypotenuse lies opposite.'),
   operation:first?'a = '+f(m.a)+u+', b = '+f(m.b)+u:'a = '+f(m.a)+u+', c = '+f(m.c)+u,
   fullAfter:first?'Determinăm ipotenuza c.':'Determinăm cateta b.',signRule:''},
  {label:learningLabel('Aplicăm teorema lui Pitagora','Apply Pythagoras'),
   reason:learningLabel('Într-un triunghi dreptunghic, a² + b² = c².',
    'In a right triangle, a² + b² = c².'),
   operation:first?'c² = '+f(m.a)+'² + '+f(m.b)+'²':'b² = '+f(m.c)+'² − '+f(m.a)+'²',
   fullAfter:first?'c = √('+f(m.a*m.a)+' + '+f(m.b*m.b)+') = '+f(m.c)+u:
    'b = √('+f(m.c*m.c)+' − '+f(m.a*m.a)+') = '+f(m.b)+u,signRule:''},
  {label:learningLabel('Calculăm aria','Compute the area'),
   reason:learningLabel('Catetele reprezintă baza și înălțimea perpendiculare.',
    'The legs form perpendicular base and height.'),
   operation:'A = (a × b) / 2',
   fullAfter:'A = ('+f(m.a)+' × '+f(m.b)+') / 2 = '+f(m.area)+(m.unit?' '+m.unit+'²':''),signRule:''},
  {label:learningLabel('Calculăm perimetrul','Compute the perimeter'),
   reason:learningLabel('Adunăm cele trei laturi.','Add the three sides.'),
   operation:'P = a + b + c',
   fullAfter:'P = '+f(m.a)+' + '+f(m.b)+' + '+f(m.c)+' = '+f(m.perimeter)+u,signRule:''}
 ];
 return {intro:learningLabel('Rezolvăm pas cu pas, fără să presupunem laturi care nu există în enunț.',
   'Solve step by step without assuming missing information.'),steps,
  conclusion:learningLabel('Verificat prin a² + b² = c². Ipotenuză: ','Checked with a² + b² = c². Hypotenuse: ')+f(m.c)+u+
  learningLabel('; catete: ','; legs: ')+f(m.a)+u+', '+f(m.b)+u+
  learningLabel('; arie: ','; area: ')+f(m.area)+(m.unit?' '+m.unit+'²':'')+
  learningLabel('; perimetru: ','; perimeter: ')+f(m.perimeter)+u+'.'};
}
function mathRightTriangleMethod(source){
 if(!mathRightTriangleModel(source))return null;
 return {heading:learningLabel('Metodă: triunghiul dreptunghic','Right triangle method'),
 intro:learningLabel('Selectăm formula în funcție de latura necunoscută, fără a da direct rezultatul.',
  'Choose the formula for the unknown side, without solving it here.'),
 rules:[
  {title:learningLabel('Unghiul drept','Right angle'),text:learningLabel('Catetele formează unghiul de 90°; ipotenuza este opusă.','The legs meet at 90°; the hypotenuse is opposite.')},
  {title:learningLabel('Ipotenuza necunoscută','Missing hypotenuse'),text:'c = √(a² + b²).'},
  {title:learningLabel('Cateta necunoscută','Missing leg'),text:'b = √(c² − a²).'},
  {title:learningLabel('Arie și perimetru','Area and perimeter'),text:'A = (a × b) / 2; P = a + b + c.'},
  {title:learningLabel('Verificare','Check'),text:learningLabel('Ipotenuza este cea mai lungă latură și a² + b² = c².','The hypotenuse is longest and a² + b² = c².')}
 ],tip:learningLabel('Nu aplica Pitagora unui triunghi care nu este dreptunghic.',
  'Do not use Pythagoras without a right angle.')};
}
function mathRightTriangleGraph(source){
 const geometry=mathRightTriangleModel(source);if(!geometry)return null;
 return {geometry,heading:learningLabel('Triunghiul dreptunghic','Right triangle'),
 intro:learningLabel('AB și AC sunt catete, BC este ipotenuza, unghiul A = 90°.',
  'AB and AC are legs, BC is the hypotenuse, angle A = 90°.'),
 conclusion:learningLabel('Dimensiunile sunt calculate exact; schița nu este la scară.',
  'Dimensions are computed, but the sketch is not to scale.')};
}
function mathRightTriangleFigure(m){
 if(!m||![m.a,m.b,m.c].every(Number.isFinite))return null;
 const f=mathRightTriangleNumber,u=m.unit?' '+m.unit:'';
 const fig=document.createElement('figure');fig.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 280',role:'img',
  'aria-label':learningLabel('Schiță triunghi dreptunghic cu trei laturi','Right triangle with three labelled sides')});
 svg.append(mathSvgElement('polygon',{points:'86,218 330,218 86,42',fill:'#13485a',
  'fill-opacity':'.48',stroke:'#4ed1d5','stroke-width':3}));
 svg.append(mathSvgElement('path',{d:'M86 199 H105 V218',fill:'none',stroke:'#ffca77','stroke-width':2}));
 mathSvgText(svg,72,235,'A','end',15);mathSvgText(svg,340,235,'B','start',15);mathSvgText(svg,80,27,'C','end',15);
 mathSvgText(svg,210,242,'a = '+f(m.a)+u,'middle',14,'#ffffff');
 mathSvgText(svg,77,127,'b = '+f(m.b)+u,'end',14,'#ffffff');
 mathSvgText(svg,230,113,'c = '+f(m.c)+u,'start',14,'#ffca77');
 mathSvgText(svg,113,202,'90°','start',12,'#ffca77');
 const caption=document.createElement('figcaption');
 caption.textContent=learningLabel('Laturile sunt etichetate; desenul nu este la scară.',
  'Sides are labelled; drawing is not to scale.');
 fig.append(svg,caption);return fig;
}

// Deterministic plane geometry from explicit dimensions. Never use numbers
// from unrelated narrative text as silently inferred lengths.
function mathPlaneShapeModel(source){
 const t=String(source||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')
  .toLowerCase().replace(/\\s+/g,' ').trim();
 if(t.length>400)return null;
 const square=/\\b(?:patrat|patratul|square)\\b/.test(t);
 const rectangle=/\\b(?:dreptunghi|dreptunghiul|rectangle)\\b/.test(t);
 const circle=/\\b(?:cerc|cercul|circle)\\b/.test(t);
 if([square,rectangle,circle].filter(Boolean).length!==1)return null;
 const nums=[...t.matchAll(/(\\d+(?:[.,]\\d+)?)(?:\\s*(mm|cm|km|m)\\b)?/g)]
  .map(z=>({n:Number(z[1].replace(',','.')),u:z[2]||''}));
 if(nums.some(x=>!Number.isFinite(x.n)||x.n<=0||x.n>100000))return null;
 const units=[...new Set(nums.map(x=>x.u).filter(Boolean))];
 if(units.length>1)return null;
 const unit=units[0]||'';
 const value=x=>Number(x.replace(',','.'));
 if(square){
  if(nums.length!==1)return null;
  const side=/\\b(?:latura|laturii|side)\\b\\s*(?:(?:de|este|are|of|is)\\s*){0,2}[:=]?\\s*(\\d+(?:[.,]\\d+)?)/.exec(t);
  if(!side)return null;
  const a=value(side[1]);
  return {kind:'square',a,b:a,area:a*a,perimeter:4*a,unit};
 }
 if(rectangle){
  if(nums.length!==2)return null;
  const length=/\\b(?:lungimea|lungime|length)\\b\\s*(?:ab\\s*)?(?:(?:de|este|are|of|is)\\s*){0,2}[:=]?\\s*(\\d+(?:[.,]\\d+)?)/.exec(t);
  const width=/\\b(?:latimea|latime|width)\\b\\s*(?:bc\\s*)?(?:(?:de|este|are|of|is)\\s*){0,2}[:=]?\\s*(\\d+(?:[.,]\\d+)?)/.exec(t);
  if(!length||!width)return null;
  const a=value(length[1]),b=value(width[1]);
  if(!nums.some(x=>x.n===a)||!nums.some(x=>x.n===b))return null;
  return {kind:'rectangle',a,b,area:a*b,perimeter:2*(a+b),unit};
 }
 if(nums.length!==1)return null;
 const radius=/\\b(?:raza|razei|radius)\\b\\s*(?:(?:de|este|are|of|is)\\s*){0,2}[:=]?\\s*(\\d+(?:[.,]\\d+)?)/.exec(t);
 const diameter=/\\b(?:diametrul|diametru|diameter)\\b\\s*(?:(?:de|este|are|of|is)\\s*){0,2}[:=]?\\s*(\\d+(?:[.,]\\d+)?)/.exec(t);
 if(Boolean(radius)===Boolean(diameter))return null;
 const given=value((radius||diameter)[1]),r=radius?given:given/2;
 return {kind:'circle',r,d:2*r,area:Math.PI*r*r,perimeter:2*Math.PI*r,
  radiusGiven:Boolean(radius),unit};
}
function mathPlaneNumber(n){
 return new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:6}).format(n);
}
function mathPlaneShapeSolution(source){
 const m=mathPlaneShapeModel(source);if(!m)return null;
 const f=mathPlaneNumber,u=m.unit?' '+m.unit:'';
 const squareUnit=m.unit?' '+m.unit+'²':'';
 const steps=[],add=(label,reason,operation,fullAfter)=>steps.push({label,reason,operation,fullAfter,signRule:''});
 if(m.kind==='square'){
  add(learningLabel('Identificăm latura','Find the side'),
   learningLabel('Toate cele patru laturi ale pătratului sunt egale.','All four sides of a square are equal.'),
   'a = '+f(m.a)+u,'a = '+f(m.a)+u);
  add(learningLabel('Aria pătratului','Square area'),
   learningLabel('Aria este latura înmulțită cu ea însăși.','Multiply the side by itself.'),
   'A = a²','A = '+f(m.a)+'² = '+f(m.area)+squareUnit);
  add(learningLabel('Perimetrul pătratului','Square perimeter'),
   learningLabel('Adunăm cele patru laturi.','Add all four sides.'),
   'P = 4 × a','P = 4 × '+f(m.a)+' = '+f(m.perimeter)+u);
 }else if(m.kind==='rectangle'){
  add(learningLabel('Identificăm dimensiunile','Identify dimensions'),
   learningLabel('Lungimea și lățimea sunt cele două dimensiuni distincte.','Length and width are the two dimensions.'),
   'L = '+f(m.a)+u+', l = '+f(m.b)+u,'L = '+f(m.a)+u+', l = '+f(m.b)+u);
  add(learningLabel('Aria dreptunghiului','Rectangle area'),
   learningLabel('Înmulțim lungimea cu lățimea.','Multiply length by width.'),
   'A = L × l','A = '+f(m.a)+' × '+f(m.b)+' = '+f(m.area)+squareUnit);
  add(learningLabel('Perimetrul dreptunghiului','Rectangle perimeter'),
   learningLabel('Fiecare dimensiune apare de două ori.','Each dimension appears twice.'),
   'P = 2 × (L + l)','P = 2 × ('+f(m.a)+' + '+f(m.b)+') = '+f(m.perimeter)+u);
 }else{
  const exactArea=f(m.r*m.r)+'π',exactCirc=f(2*m.r)+'π';
  add(learningLabel('Stabilim raza','Determine the radius'),
   m.radiusGiven?learningLabel('Raza este dată în enunț.','The radius is supplied.'):
    learningLabel('Raza este jumătate din diametru.','The radius is half the diameter.'),
   m.radiusGiven?'r = '+f(m.r)+u:'r = d / 2',
   m.radiusGiven?'r = '+f(m.r)+u:'r = '+f(m.d)+' / 2 = '+f(m.r)+u);
  add(learningLabel('Aria cercului','Circle area'),
   learningLabel('Înmulțim π cu pătratul razei.','Multiply π by the radius squared.'),
   'A = π × r²','A = '+exactArea+' ≈ '+f(m.area)+squareUnit);
  add(learningLabel('Circumferința','Circumference'),
   learningLabel('Perimetrul cercului este 2πr.','A circle circumference is 2πr.'),
   'C = 2 × π × r','C = '+exactCirc+' ≈ '+f(m.perimeter)+u);
 }
 return {intro:learningLabel('Folosim numai dimensiunile date și formulele geometrice potrivite.',
  'Use only the supplied dimensions and relevant geometry formulas.'),
  steps,conclusion:m.kind==='circle'?
   learningLabel('Aria ≈ ','Area ≈ ')+f(m.area)+squareUnit+
    learningLabel('; circumferința ≈ ','; circumference ≈ ')+f(m.perimeter)+u+'.':
   learningLabel('Aria = ','Area = ')+f(m.area)+squareUnit+
    learningLabel('; perimetrul = ','; perimeter = ')+f(m.perimeter)+u+'.'};
}
function mathPlaneShapeMethod(source){
 const m=mathPlaneShapeModel(source);if(!m)return null;
 const circle=m.kind==='circle',square=m.kind==='square';
 const rules=circle?[
  {title:learningLabel('Raza și diametrul','Radius and diameter'),text:'d = 2 × r.'},
  {title:learningLabel('Aria','Area'),text:'A = π × r².'},
  {title:learningLabel('Circumferința','Circumference'),text:'C = 2 × π × r.'}
 ]:square?[
  {title:learningLabel('Laturile','Sides'),text:learningLabel('Toate patru sunt egale.','All four are equal.')},
  {title:learningLabel('Aria','Area'),text:'A = a².'},
  {title:learningLabel('Perimetrul','Perimeter'),text:'P = 4 × a.'}
 ]:[
  {title:learningLabel('Dimensiunile','Dimensions'),text:learningLabel('Identificăm lungimea și lățimea.','Identify length and width.')},
  {title:learningLabel('Aria','Area'),text:'A = L × l.'},
  {title:learningLabel('Perimetrul','Perimeter'),text:'P = 2 × (L + l).'}
 ];
 rules.push({title:learningLabel('Unitățile','Units'),text:learningLabel('Aria are unități pătrate, iar perimetrul unități de lungime.',
  'Area uses squared units; perimeter uses length units.')});
 return {heading:learningLabel('Metodă: geometrie plană','Method: plane geometry'),
 intro:learningLabel('Selectăm formula în funcție de figura dată.','Select formulas according to the specified shape.'),
 rules,tip:learningLabel('Nu inventăm dimensiuni și nu amestecăm unitățile.',
  'Do not invent dimensions or mix units.')};
}
function mathPlaneShapeGraph(source){
 const planeShape=mathPlaneShapeModel(source);if(!planeShape)return null;
 return {planeShape,heading:learningLabel('Schița figurii geometrice','Geometry figure'),
 intro:learningLabel('Schiță explicativă cu dimensiunile din exercițiu.','Illustrative diagram with the supplied dimensions.'),
 conclusion:learningLabel('Figura este construită din lungimile date, iar rezultatele sunt calculate local.',
  'The figure uses the supplied lengths, and calculations are verified locally.')};
}
function mathPlaneShapeFigure(m){
 if(!m)return null;
 const f=mathPlaneNumber,u=m.unit?' '+m.unit:'';
 const fig=document.createElement('figure');fig.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 280',role:'img',
  'aria-label':learningLabel('Schiță geometrică cu dimensiunile marcate','Shape diagram with dimensions')});
 if(m.kind==='circle'){
  svg.append(mathSvgElement('circle',{cx:210,cy:130,r:90,fill:'#13485a','fill-opacity':'.4',stroke:'#4ed1d5','stroke-width':3}));
  svg.append(mathSvgElement('circle',{cx:210,cy:130,r:4,fill:'#ffca77'}));
  svg.append(mathSvgElement('line',{x1:210,y1:130,x2:300,y2:130,stroke:'#ffca77','stroke-width':2}));
  mathSvgText(svg,222,115,'O','start',14);
  mathSvgText(svg,265,120,'r = '+f(m.r)+u,'middle',14,'#ffffff');
 }else{
  // Use supplied proportions within a bounded drawing region, independent of physical screen pixels.
  const ratio=m.a/m.b;
  const w=m.kind==='square'?165:(ratio>=1?Math.min(270,175*ratio):Math.min(270,175*ratio));
  const h=m.kind==='square'?165:(ratio>=1?Math.min(185,w/ratio):Math.min(185,w/ratio));
  const x=(420-w)/2,y=(250-h)/2;
  svg.append(mathSvgElement('rect',{x,y,width:w,height:h,fill:'#13485a','fill-opacity':'.4',stroke:'#4ed1d5','stroke-width':3}));
  if(m.kind==='rectangle'){
   mathSvgText(svg,x-9,y-8,'A','end',15);mathSvgText(svg,x+w+9,y-8,'B','start',15);
   mathSvgText(svg,x+w+9,y+h+14,'C','start',15);mathSvgText(svg,x-9,y+h+14,'D','end',15);
  }
  mathSvgText(svg,210,y+h+32,(m.kind==='square'?'a':'AB')+' = '+f(m.a)+u,'middle',14);
  mathSvgText(svg,x-11,y+h/2,(m.kind==='square'?'a':'BC')+' = '+f(m.b)+u,'end',14);
 }
 const caption=document.createElement('figcaption');
 caption.textContent=learningLabel('Figura este orientativă, nu este la scară.','The figure is schematic and is not to scale.');
 fig.append(svg,caption);return fig;
}


// Deterministic extensions for remaining maths subjects. Unsupported input
// falls through to the existing explanation path; never fabricate numeric data.
const mathAdvancedVerifiedBrowserModel = ${mathAdvancedVerifiedModel.toString()};
function mathAdditionalModel(source){
 const input=String(source||'').trim().replace(/[−–]/g,'-');
 const fmt=x=>new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:8}).format(Object.is(x,-0)?0:x);
 const extension=typeof mathAdvancedVerifiedBrowserModel==='function'?mathAdvancedVerifiedBrowserModel(source):null;
 if(extension)return extension;

 const vectors=input.match(/^(?:vector|vectori|vectors?)\\s*:\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)\\s*([+\\-])\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)$/iu);
 if(vectors){
  const [x,y,a,b]=[vectors[1],vectors[2],vectors[4],vectors[5]].map(v=>Number(v.replace(',','.')));
  const direction=vectors[3]==='+'?1:-1,xx=x+direction*a,yy=y+direction*b;
  if(![xx,yy].every(Number.isFinite))return null;
  const result='('+fmt(xx)+'; '+fmt(yy)+')';
  return {kind:'vectors',label:input,result,summary:learningLabel('Vector rezultat = ','Result vector = ')+result,
   details:learningLabel('Adunăm sau scădem separat coordonatele corespunzătoare.',
    'Add or subtract corresponding vector coordinates.'),method:'coordinatewise'};
 }
 const dot=input.match(/^(?:produs scalar|dot product)\\s*:\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)\\s*(?:[·×*])?\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)$/iu);
 if(dot){
  const [x,y,a,b]=[dot[1],dot[2],dot[3],dot[4]].map(v=>Number(v.replace(',','.')));
  const product=x*a+y*b;if(!Number.isFinite(product))return null;
  return {kind:'vectors',label:input,result:fmt(product),summary:'u · v = '+fmt(product),
   details:learningLabel('Produsul scalar este x₁x₂ + y₁y₂.',
    'Dot product: x₁x₂ + y₁y₂.'),method:'dot'};
 }
 const complex=input.match(/^(?:complex|numere complexe)\\s*:\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*([+\\-])\\s*(\\d+(?:[.,]\\d+)?)i\\s*\\)\\s*([+\\-])\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*([+\\-])\\s*(\\d+(?:[.,]\\d+)?)i\\s*\\)$/iu);
 if(complex){
  const r1=Number(complex[1].replace(',','.')),i1=Number(complex[3].replace(',','.'))*(complex[2]==='-'?-1:1);
  const r2=Number(complex[5].replace(',','.')),i2=Number(complex[7].replace(',','.'))*(complex[6]==='-'?-1:1);
  const sign=complex[4]==='-'?-1:1,re=r1+sign*r2,im=i1+sign*i2;
  if(![re,im].every(Number.isFinite))return null;
  const result=fmt(re)+(im<0?' − ':' + ')+fmt(Math.abs(im))+'i';
  return {kind:'complex',label:input,result,summary:'z = '+result,
   details:learningLabel('Separăm partea reală de cea imaginară și respectăm semnele.',
    'Combine real parts and imaginary parts separately.'),method:'complex-add'};
 }
 const statistics=input.match(/^(media|mean|average|mediana|median|modul|mode|varianta|variance|abaterea standard|standard deviation)\\s*(?:numerelor|of|:|=)?\\s*:?\\s*([\\d\\s,;.+-]+)$/iu);
 if(statistics){
  const names={media:'mean',mean:'mean',average:'mean',mediana:'median',median:'median',modul:'mode',mode:'mode',varianta:'variance',variance:'variance','abaterea standard':'std','standard deviation':'std'};
  const operation=names[statistics[1].toLowerCase()];
  const values=statistics[2].trim();
  // With semicolons, commas are decimal separators (Romanian notation).
  const fields=(values.includes(';')?values.split(/\\s*;\\s*/):values.split(/[, ]+/)).filter(Boolean);
  const nums=fields.map(x=>Number(x.replace(',','.')));
  if(nums.length<2||nums.length>40||!nums.every(Number.isFinite))return null;
  const ordered=[...nums].sort((a,b)=>a-b),n=nums.length,mean=nums.reduce((a,b)=>a+b,0)/n;
  const median=n%2?ordered[(n-1)/2]:(ordered[n/2-1]+ordered[n/2])/2;
  const counts=new Map();nums.forEach(x=>counts.set(x,(counts.get(x)||0)+1));
  const max=Math.max(...counts.values()),modes=[...counts].filter(x=>x[1]===max).map(x=>x[0]);
  const variance=nums.reduce((sum,x)=>sum+(x-mean)**2,0)/n;
  const result=operation==='mean'?fmt(mean):operation==='median'?fmt(median):
   operation==='mode'?(max===1?learningLabel('nu există mod unic','no unique mode'):modes.map(fmt).join('; ')):
   fmt(operation==='variance'?variance:Math.sqrt(variance));
  const label={mean:'Media',median:'Mediana',mode:'Modul',variance:'Varianța populației',std:'Abaterea standard a populației'}[operation];
  return {kind:'statistics',label,result,summary:label+' = '+result,
   details:learningLabel('Date ordonate: ','Sorted data: ')+ordered.map(fmt).join(', ')+'. n = '+n+
    '. '+learningLabel('Media = ','Mean = ')+fmt(mean)+'.',
   data:nums,method:operation};
 }
 const trig=input.match(/^(sin|cos|tan|tg)\\s*\\(?\\s*(-?\\d+(?:[.,]\\d+)?)\\s*(°|grade|degrees|deg|rad)\\s*\\)?$/iu);
 if(trig){
  const func=trig[1].toLowerCase()==='tg'?'tan':trig[1].toLowerCase();
  const angle=Number(trig[2].replace(',','.')),radians=trig[3].toLowerCase()==='rad';
  const rad=radians?angle:angle*Math.PI/180;
  const value=func==='sin'?Math.sin(rad):func==='cos'?Math.cos(rad):Math.tan(rad);
  if(!Number.isFinite(value)||(func==='tan'&&Math.abs(Math.cos(rad))<1e-10))return null;
  const v=Math.abs(value)<1e-12?0:value;
  const label=func+'('+fmt(angle)+(radians?' rad':'°')+')';
  return {kind:'trigonometry',label,result:fmt(v),summary:label+' = '+fmt(v),
   details:radians?learningLabel('Unghiul este exprimat în radiani.','The angle is in radians.'):
    learningLabel('Transformăm gradele în radiani: ','Convert degrees to radians: ')+fmt(angle)+' × π / 180.',
   radians:rad,method:func};
 }
 const comb=input.replace(/\\s+/g,'').match(/^(?:([CAP])\\((\\d{1,3}),(\\d{1,3})\\)|(\\d{1,3})!)$/i);
 if(comb){
  const n=Number(comb[2]||comb[4]),k=comb[3]===undefined?null:Number(comb[3]);
  if(n>170||(k!==null&&k>n))return null;
  const product=(start,end)=>{let r=1;for(let i=start;i<=end;i++)r*=i;return r};
  const kind=comb[1]?.toUpperCase()||'P';
  let result;
  if(kind==='C'){const short=Math.min(k,n-k);result=1;for(let i=1;i<=short;i++)result=result*(n-short+i)/i}
  else if(kind==='A')result=product(n-k+1,n);
  else result=product(1,n);
  if(!Number.isFinite(result)||!Number.isSafeInteger(Math.round(result)))return null;
  const label=kind==='P'?n+'!':kind+'('+n+', '+k+')';
  const rule=kind==='C'?'n! / (k! × (n−k)!)':kind==='A'?'n! / (n−k)!':'n!';
  return {kind:'combinatorics',label,result:fmt(result),summary:label+' = '+fmt(result),
   details:learningLabel('Formula folosită: ','Formula: ')+rule+'.',method:kind};
 }


 const conversion=input.match(/^(?:converteste|convertește|convert|transforma|transformă)?\\s*(-?\\d+(?:[.,]\\d+)?)\\s*(km²|m²|cm²|mm²|km|cm|mm|m|kg|mg|g|t|ml|l|min|h|s)\\s*(?:->|→|in|în|to)\\s*(km²|m²|cm²|mm²|km|cm|mm|m|kg|mg|g|t|ml|l|min|h|s)$/iu);
 if(conversion){
  const dictionary={
   km:[0,1000],m:[0,1],cm:[0,.01],mm:[0,.001],
   'km²':[1,1000000],'m²':[1,1],'cm²':[1,.0001],'mm²':[1,.000001],
   kg:[2,1000],g:[2,1],mg:[2,.001],t:[2,1000000],
   l:[3,1],ml:[3,.001],h:[4,3600],min:[4,60],s:[4,1]
  };
  const from=dictionary[conversion[2]],to=dictionary[conversion[3]];
  if(from[0]!==to[0])return null;
  const value=Number(conversion[1].replace(',','.')),result=value*from[1]/to[1];
  if(!Number.isFinite(result))return null;
  return {kind:'measurement',label:input,result:fmt(result),summary:fmt(value)+' '+conversion[2]+' = '+fmt(result)+' '+conversion[3],
   details:learningLabel('Convertim prin unitatea de bază a aceleiași dimensiuni.',
    'Convert through the base unit of the same physical dimension.'),method:'unit-conversion'};
 }
 const distance=input.match(/^(?:distanta|distanța|distance)\\s*(?:intre|între|between)?\\s*A\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)\\s*(?:si|și|and)?\\s*B\\s*\\(\\s*(-?\\d+(?:[.,]\\d+)?)\\s*;\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\)$/iu);
 if(distance){
  const [x1,y1,x2,y2]=distance.slice(1).map(v=>Number(v.replace(',','.')));
  const length=Math.hypot(x2-x1,y2-y1);
  const midpointX=(x1+x2)/2,midpointY=(y1+y2)/2;
  return {kind:'coordinates',label:input,result:fmt(length),summary:'AB = '+fmt(length)+'; M('+fmt(midpointX)+'; '+fmt(midpointY)+')',
   details:learningLabel('Aplicăm formula distanței dintre două puncte și media coordonatelor pentru mijloc.',
    'Use the distance formula and average the coordinates for the midpoint.'),method:'distance'};
 }
 const power=input.replace(/\\s+/g,'').match(/^(-?\\d+(?:[.,]\\d+)?)\\^(-?\\d{1,3})$/);
 if(power){
  const base=Number(power[1].replace(',','.')),exponent=Number(power[2]);
  if(Math.abs(exponent)>60||(base===0&&exponent<0))return null;
  const answer=base**exponent;
  if(!Number.isFinite(answer))return null;
  return {kind:'powers',label:input,result:fmt(answer),summary:input+' = '+fmt(answer),
   details:learningLabel('Puterea întreagă se obține înmulțind baza repetat; exponentul negativ înseamnă invers.',
    'Integer powers repeat multiplication; a negative exponent gives the reciprocal.'),method:'exponentiation'};
 }
 const radical=input.match(/^(?:√|sqrt)\\s*\\(?\\s*(\\d+(?:[.,]\\d+)?)\\s*\\)?$/iu);
 if(radical){
  const value=Number(radical[1].replace(',','.')),result=Math.sqrt(value);
  return {kind:'radicals',label:input,result:fmt(result),summary:'√'+fmt(value)+' = '+fmt(result),
   details:learningLabel('Rădăcina pătrată principală este numărul nenegativ al cărui pătrat este valoarea dată.',
    'The principal square root is the nonnegative number whose square equals the input.'),method:'square-root'};
 }
 const logarithm=input.replace(/\\s+/g,'').match(/^log_?(\\d+(?:[.,]\\d+)?)\\((\\d+(?:[.,]\\d+)?)\\)$/i);
 if(logarithm){
  const base=Number(logarithm[1].replace(',','.')),value=Number(logarithm[2].replace(',','.'));
  if(base<=0||base===1||value<=0)return null;
  const result=Math.log(value)/Math.log(base);
  if(!Number.isFinite(result))return null;
  return {kind:'logarithms',label:input,result:fmt(result),summary:input+' = '+fmt(result),
   details:learningLabel('Folosim schimbarea bazei: log_b(a) = ln(a) / ln(b).',
    'Use change of base: log_b(a) = ln(a) / ln(b).'),method:'logarithm'};
 }
 const ode=input.match(/^y\\s*['′]\\s*=\\s*(-?\\d+(?:[.,]\\d+)?)\\s*\\*?\\s*y(?:\\s*[,;]\\s*y\\(0\\)\\s*=\\s*(-?\\d+(?:[.,]\\d+)?))?$/iu);
 if(ode){
  const k=Number(ode[1].replace(',','.')),given=ode[2]===undefined?null:Number(ode[2].replace(',','.'));
  if(!Number.isFinite(k)||(given!==null&&!Number.isFinite(given)))return null;
  const constant=given===null?'C':fmt(given);
  const result='y(x) = '+constant+' × e^('+fmt(k)+'x)';
  return {kind:'differential',label:input,result,summary:result,
   details:learningLabel('Ecuația diferențială separabilă y′ = k·y are soluția generală y = C·e^(kx). Dacă y(0) este dat, determinăm C.',
    'The separable equation y′ = ky has general solution y = Ce^(kx). An initial value at x=0 determines C.'),method:'separation'};
 }
 const fraction=input.replace(/\\s+/g,'').match(/^(-?\\d{1,6})\\/(\\d{1,6})([+\\-*÷])(-?\\d{1,6})\\/(\\d{1,6})$/);
 if(fraction){
  const a=Number(fraction[1]),b=Number(fraction[2]),c=Number(fraction[4]),d=Number(fraction[5]);
  if(!b||!d)return null;
  const op=fraction[3],numerator=op==='+'?a*d+c*b:op==='-'?a*d-c*b:
   op==='*'?a*c:a*d;
  const denominator=op==='+'||op==='-'?b*d:op==='*'?b*d:b*c;
  if(!denominator||![numerator,denominator].every(Number.isSafeInteger))return null;
  const gcd=(x,y)=>{x=Math.abs(x);y=Math.abs(y);while(y){const z=x%y;x=y;y=z}return x||1};
  const g=gcd(numerator,denominator),sgn=denominator<0?-1:1;
  const nn=sgn*numerator/g,dd=sgn*denominator/g;
  const result=dd===1?String(nn):nn+'/'+dd;
  return {kind:'fractions',label:input,result,summary:input+' = '+result,
   details:learningLabel('Aducem fracțiile la același numitor unde este necesar și simplificăm cu cel mai mare divizor comun.',
   'Use a common denominator when necessary, then reduce by the greatest common divisor.'),method:op};
 }
 const sequence=input.match(/^(?:progresie\\s+)?(aritmetica|arithmetic|geometrica|geometric)\\s*[:;, ]+\\s*a1\\s*=\\s*(-?\\d+(?:[.,]\\d+)?)\\s*[,; ]+\\s*(d|r|q)\\s*=\\s*(-?\\d+(?:[.,]\\d+)?)\\s*[,; ]+\\s*n\\s*=\\s*(\\d{1,4})$/iu);
 if(sequence){
  const geometric=['geometrica','geometric'].includes(sequence[1].toLowerCase());
  const a1=Number(sequence[2].replace(',','.')),step=Number(sequence[4].replace(',','.')),n=Number(sequence[5]);
  if(n<1||n>1000||!Number.isFinite(a1)||!Number.isFinite(step))return null;
  if(geometric&&sequence[3].toLowerCase()==='d')return null;
  if(!geometric&&sequence[3].toLowerCase()!=='d')return null;
  const last=geometric?a1*step**(n-1):a1+(n-1)*step;
  const sum=geometric?(Math.abs(step-1)<1e-12?n*a1:a1*(1-step**n)/(1-step)):
   n*(a1+last)/2;
  if(!Number.isFinite(last)||!Number.isFinite(sum))return null;
  const label=geometric?learningLabel('Progresie geometrică','Geometric sequence'):learningLabel('Progresie aritmetică','Arithmetic sequence');
  return {kind:'sequences',label,result:fmt(last),summary:'a'+n+' = '+fmt(last)+'; S'+n+' = '+fmt(sum),
   details:geometric?'aₙ = a₁ × r^(n−1); Sₙ = a₁ × (1−r^n)/(1−r).':
    'aₙ = a₁ + (n−1)d; Sₙ = n(a₁+aₙ)/2.',method:geometric?'geometric':'arithmetic'};
 }
 const die=input.match(/^P\\s*\\(\\s*(zar|die)\\s*(=|>=|<=|>|<)\\s*([1-6])\\s*\\)$/iu);
 if(die){
  const op=die[2],target=Number(die[3]);
  const count=[1,2,3,4,5,6].filter(x=>op==='='?x===target:
   op==='>='?x>=target:op==='<='?x<=target:op==='>'?x>target:x<target).length;
  const g=(x,y)=>{while(y){const z=x%y;x=y;y=z}return x||1},div=g(count,6);
  const result=(count/div)+'/'+(6/div);
  return {kind:'probability',label:input,result,summary:'P = '+result+' = '+fmt(count/6),
   details:learningLabel('Zar echilibrat: șase rezultate egal probabile, ','Fair die: six equally likely outcomes, ')+
    count+learningLabel(' favorabile.',' favourable.'),method:'equally-likely'};
 }
 const integral=input.match(/^(?:integrala|integral|integrate)\\s*[:=]?\\s*(.+)$/iu);
 if(integral){
  const poly=mathSymbolicPoly(integral[1]);
  if(!poly)return null;
  const coeffs=[0,...poly.coefficients.map((v,i)=>v/(i+1))];
  const result=mathSymbolicFormat(coeffs)+' + C';
  return {kind:'integral',label:learningLabel('Primitiva','Antiderivative'),result,
   summary:'∫f(x) dx = '+result,
   details:learningLabel('Integrăm fiecare termen: ∫x^n dx = x^(n+1)/(n+1) + C, pentru n ≠ −1.',
    'Integrate term by term: ∫x^n dx = x^(n+1)/(n+1) + C for n ≠ −1.'),method:'polynomial'};
 }
 const limit=input.match(/^lim\\s*x\\s*(?:->|→)\\s*(-?\\d+(?:[.,]\\d+)?)\\s*[: ]\\s*(.+)$/iu);
 if(limit){
  const at=Number(limit[1].replace(',','.')),poly=mathSymbolicPoly(limit[2]);
  if(!poly||!Number.isFinite(at))return null;
  const value=poly.coefficients.reduceRight((acc,c)=>acc*at+c,0);
  if(!Number.isFinite(value))return null;
  return {kind:'limit',label:input,result:fmt(value),summary:'lim = '+fmt(value),
   details:learningLabel('Polinoamele sunt continue: limita într-un punct finit se calculează prin înlocuire directă.',
    'Polynomials are continuous: evaluate the finite-point limit by direct substitution.'),method:'polynomial'};
 }
 const derivative=input.match(/^(?:derivata|derivative|derive|d\\/dx)\\s*[:=]?\\s*(.+)$/iu);
 if(derivative){
  const expression=derivative[1],polynomial=mathSymbolicPoly(expression);
  if(!polynomial)return null;
  const coeffs=polynomial.coefficients;
  const result=mathSymbolicFormat(coeffs.slice(1).map((a,i)=>a*(i+1)).length?
   coeffs.slice(1).map((a,i)=>a*(i+1)):[0]);
  return {kind:'derivative',label:learningLabel('Derivata','Derivative'),result,
   summary:learningLabel('f′(x) = ','f′(x) = ')+result,
   details:learningLabel('Aplicăm liniaritatea și regula (x^n)′ = n × x^(n−1).',
    'Apply linearity and the power rule (x^n)′ = n × x^(n−1).'),method:'polynomial'};
 }
 return null;
}
function mathAdditionalSolution(source){
 const m=mathAdditionalModel(source);if(!m)return null;
 return {intro:learningLabel('Calculăm folosind o regulă matematică verificabilă.','Compute using a verifiable mathematical rule.'),
  steps:[{label:learningLabel('Identificăm datele și formula','Identify inputs and formula'),
   reason:m.details,operation:m.label,fullAfter:m.label,signRule:''},
   {label:learningLabel('Calculăm și verificăm','Calculate and check'),
   reason:learningLabel('Rezultatul este calculat local numai din datele exercițiului.','The result is computed locally only from the supplied inputs.'),
   operation:m.summary,fullAfter:m.summary,signRule:''}],
  conclusion:m.summary};
}
function mathAdditionalMethod(source){
 const m=mathAdditionalModel(source);if(!m)return null;
 return {heading:learningLabel('Metoda de calcul','Calculation method'),
  intro:learningLabel('Aplicăm formula corespunzătoare tipului de exercițiu.','Use the formula for this exercise type.'),
  rules:[{title:learningLabel('Identificarea datelor','Identify input'),text:m.label},
   {title:learningLabel('Regula matematică','Mathematical rule'),text:m.details},
   {title:learningLabel('Verificarea','Verification'),text:learningLabel('Controlează unitățile, semnele și valorile introduse.','Check units, signs and input values.')}],
  tip:learningLabel('Pentru un rezultat numeric folosește Rezolvă pas cu pas.','Choose Solve step by step for a numeric answer.')};
}
function mathAdditionalGraph(source){
 const m=mathAdditionalModel(source);
 if(!m||m.kind!=='statistics')return null;
 return {statistics:m.data,heading:learningLabel('Distribuția valorilor','Value distribution'),
  intro:learningLabel('Diagrama reprezintă numai valorile introduse în acest exercițiu.','The chart represents only the values in this exercise.'),
  conclusion:m.summary};
}
function mathStatisticsFigure(values){
 if(!Array.isArray(values)||values.length<2||values.length>40||!values.every(Number.isFinite))return null;
 const counts=new Map();values.forEach(value=>counts.set(value,(counts.get(value)||0)+1));
 const pairs=[...counts].sort((a,b)=>a[0]-b[0]);if(pairs.length>30)return null;
 const max=Math.max(...pairs.map(x=>x[1])),w=420,h=255,left=40,top=20,bottom=45;
 const plot=document.createElement('figure');plot.className='math-result-plot';
 const svg=mathSvgElement('svg',{viewBox:'0 0 420 255',role:'img','aria-label':learningLabel('Frecvențele datelor','Data frequencies')});
 const usable=w-left-12,slot=usable/pairs.length,scale=(h-top-bottom)/max;
 pairs.forEach(([value,count],i)=>{
  const x=left+i*slot+slot*.16,barW=slot*.68,y=h-bottom-count*scale;
  svg.append(mathSvgElement('rect',{x,y,width:barW,height:count*scale,fill:'#42dbd7'}));
  mathSvgText(svg,x+barW/2,y-5,count,'middle',11);
  mathSvgText(svg,x+barW/2,h-bottom+18,value,'middle',10);
 });
 plot.append(svg);return plot;
}

function mathAlgebraEngines(){
 return [
  {id:'extended-mathematics',solve:mathAdditionalSolution,explain:mathAdditionalMethod,graph:mathAdditionalGraph},
  {id:'right-triangle',solve:mathRightTriangleSolution,explain:mathRightTriangleMethod,graph:mathRightTriangleGraph},
  {id:'plane-shapes',solve:mathPlaneShapeSolution,explain:mathPlaneShapeMethod,graph:mathPlaneShapeGraph},
  {id:'matrix-operations',solve:mathMatrixSolution,explain:mathMatrixMethod,graph:mathMatrixGraph},
  {id:'like-terms',solve:mathLikeTermsSolution,explain:mathLikeTermsMethod,graph:()=>null},
  {id:'symbolic-polynomials',solve:mathSymbolicSolution,explain:mathSymbolicMethod,graph:mathSymbolicGraph},
  {id:'linear-system-3x3',solve:mathSystem3x3Solution,explain:mathSystem3x3Method,graph:mathSystem3x3Graph},
  {id:'linear-system-2x2',solve:mathLinearSystemSolution,explain:mathLinearSystemMethod,graph:mathLinearSystemGraphData},
  {id:'linear-inequality',solve:mathLinearInequalitySolution,explain:mathLinearInequalityMethod,graph:()=>null},
  {id:'linear-equation',solve:mathLinearSolution,explain:mathLinearMethodGuide,graph:mathLinearGraphData},
  {id:'quadratic-equation',solve:mathQuadraticSolution,explain:mathQuadraticMethodGuide,graph:mathQuadraticGraphData},
  {id:'arithmetic',solve:mathDetailedArithmetic,explain:mathMethodGuide,graph:()=>null}
 ];
}
function mathAlgebraLocal(mode,source){
 for(const engine of mathAlgebraEngines()){
  const handler=engine[mode];
  if(typeof handler!=='function')continue;
  const value=handler(source);
  if(value)return {engine:engine.id,value};
 }
 return null;
}

// Plot the difference (left side minus right side) to show where an equation
// holds. This is the graph of an ASSOCIATED FUNCTION, not the equation itself.
function mathLinearGraphData(source){
 const model=mathLinearEquation(source);
 if(!model||model.kind!=='unique')return null;
 const difference={a:model.left.a-model.right.a,b:model.left.b-model.right.b};
 const expression='f(x) = '+mathLinearNotation().polynomial(difference);
 if(!mathGraphModel(expression))return null;
 const {number}=mathLinearNotation();
 return {expression,root:model.value,
  heading:learningLabel('Graficul funcției asociate ecuației','Graph of the associated function'),
  intro:learningLabel('Scădem membrul drept din cel stâng și reprezentăm funcția ',
     'Subtract the right-hand side from the left and plot ')+expression+
   learningLabel('. Ecuația este satisfăcută acolo unde această funcție are valoarea zero.',
     '. The equation holds where this function equals zero.'),
  conclusion:learningLabel('Graficul intersectează axa Ox în punctul (',
    'The graph crosses the x-axis at (')+number(model.value)+
   learningLabel('; 0). Soluția verificată este x = ',
    '; 0). The verified solution is x = ')+number(model.value)+'.'};
}

// For plotted functions, the graph and the explanation must share the exact
// same parsed coefficients. Never use an unrelated generated answer here.
function mathFunctionLesson(source,mode){
 const model=mathGraphModel(source);if(!model)return null;
 const fmt=n=>new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:8}).format(Object.is(n,-0)?0:n).replace(/-/g,'−');
 const steps=[],add=(name,description)=>steps.push({name,description});
 const equation='f(x) = '+model.expression.replace(/-/g,'−');
 if(Math.abs(model.a)<1e-12){
  const m=model.b,n=model.c;
  add(learningLabel('Recunoaștem funcția','Recognize the function'),
   learningLabel('Este o funcție de forma f(x) = mx + n. Graficul este o dreaptă.','The function has the form f(x) = mx + n. Its graph is a straight line.'));
  add(learningLabel('Identificăm coeficienții','Identify the coefficients'),
   learningLabel('Panta este m = ','The slope is m = ')+fmt(m)+
   learningLabel(', iar intersecția cu axa Oy este (0; ', ', and the y-axis intersection is (0, ')+fmt(n)+').');
  add(learningLabel('Alegem două puncte','Choose two points'),
   learningLabel('Două puncte distincte sunt suficiente pentru a trasa o dreaptă. Pentru x = 0 și x = 1 obținem punctele (0; ',
    'Two distinct points are enough to draw a straight line. For x = 0 and x = 1, choose (0, ')+fmt(n)+
    learningLabel(') și (1; ',') and (1, ')+fmt(m+n)+').');
  if(Math.abs(m)>1e-12)add(learningLabel('Intersecția cu axa Ox','X-axis intersection'),
   learningLabel('Din f(x) = 0 rezultă x = ', 'Solving f(x) = 0 gives x = ')+fmt(-n/m)+'.');
  else add(learningLabel('Dreapta orizontală','Horizontal line'),
   n===0?learningLabel('Graficul coincide cu axa Ox.','The graph coincides with the x-axis.'):
      learningLabel('Graficul este orizontal și nu intersectează axa Ox.','The graph is horizontal and never crosses the x-axis.'));
  add(learningLabel('Trasează și verifică','Plot and check'),
   learningLabel('Unește cele două puncte distincte. Un punct (x; y) se află pe dreaptă numai dacă f(x) = y.',
    'Join the two different points. A point (x, y) lies on the line only if f(x) = y.'));
 }else{
  const a=model.a,b=model.b,c=model.c,vx=-b/(2*a),vy=a*vx*vx+b*vx+c,delta=b*b-4*a*c;
  add(learningLabel('Identificăm funcția','Identify the function'),
   learningLabel('Funcția este de gradul al doilea, iar graficul ei este o parabolă.',
    'This is a quadratic function; its graph is a parabola.'));
  add(learningLabel('Concavitatea și vârful','Opening and vertex'),
   (a>0?learningLabel('Parabola se deschide în sus. ','The parabola opens upward. '):
   learningLabel('Parabola se deschide în jos. ','The parabola opens downward. '))+'V('+fmt(vx)+'; '+fmt(vy)+').');
  add(learningLabel('Intersecția cu axa Oy','Y-axis intersection'),
   learningLabel('Pentru x = 0 obținem (0; ','At x = 0 we obtain (0, ')+fmt(c)+').');
  const roots=delta<0?learningLabel('Nu are intersecții reale cu axa Ox.','There are no real x-axis intersections.'):
    Math.abs(delta)<1e-10?learningLabel('Atinge axa Ox în (','Touches the x-axis at (')+fmt(vx)+'; 0).':
     learningLabel('Intersecțiile cu axa Ox au abscisele ','The x-axis intersections have x-coordinates ')+
     fmt((-b-Math.sqrt(delta))/(2*a))+learningLabel(' și ',' and ')+fmt((-b+Math.sqrt(delta))/(2*a))+'.';
  add(learningLabel('Rădăcinile','Roots'),roots);
  add(learningLabel('Verificăm punctele','Check the points'),
   learningLabel('Pentru fiecare punct de pe desen, înlocuim x în funcție și verificăm valoarea y.',
    'For every point, substitute x into the formula and verify y.'));
 }
 return {
  heading:mode==='explain'?learningLabel('Metoda pentru această categorie de funcții','Method for this type of function'):
   mode==='graph'?learningLabel('Cum interpretăm graficul','How to interpret the graph'):
    learningLabel('Analiza funcției pas cu pas','Step-by-step function analysis'),
  intro:learningLabel('Folosim doar funcția din enunț: ','Using only the function supplied: ')+equation+'.',
  steps,
  conclusion:mode==='graph'?learningLabel('Graficul de mai sus este calculat local din această funcție.',
   'The graph above was calculated locally from this function.'):
   learningLabel('Verifică rezultatul înlocuind coordonatele punctelor în funcția dată.',
    'Verify the result by substituting the point coordinates in the supplied function.')
 };
}
// Render lightweight math notation as readable text; this formatter is used
// ONLY in math-result answers, not normal prose, prices or other modules.
function mathReadableFormula(text){
 return String(text||'')
  .replace(/\\\\frac\\{([^{}]+)\\}\\{([^{}]+)\\}/g,'($1)/($2)')
  .replace(/\\\\times\\b/g,'×').replace(/\\\\cdot\\b/g,'×')
  .replace(/\\\\div\\b/g,'÷').replace(/\\\\leq?\\b/g,'≤')
  .replace(/\\\\geq?\\b/g,'≥').replace(/\\\\neq\\b/g,'≠')
  .replace(/\\\\sqrt\\{([^{}]+)\\}/g,'√($1)')
  .replace(/\\\\left\\b|\\\\right\\b/g,'')
  .replace(/\\^\\{2\\}/g,'²').replace(/\\^2\\b/g,'²');
}
function mathCleanAnswerMarkup(reply){
 let text=String(reply||'');
 text=text.replace(/\\\\\\[((?:.|\\n)*?)\\\\\\]/g,(_,formula)=>mathReadableFormula(formula))
  .replace(/\\\\\\((.*?)\\\\\\)/g,(_,formula)=>mathReadableFormula(formula))
  .replace(/\\$\\$([\\s\\S]*?)\\$\\$/g,(_,formula)=>mathReadableFormula(formula));
 text=text.replace(/\\$([^$\\n]+)\\$/g,(whole,formula)=>
  /(?:\\\\[a-z]+|[=+*/^×÷]|\\d\\s*[-−]\\s*\\d)/.test(formula)?
  mathReadableFormula(formula):whole);
 return mathReadableFormula(text);
}

/* Compact, source-grounded result labels shared by graph and worked-solution
   views. Only deterministic models may populate them: never parse an AI reply. */
function mathGraphVerifiedAnswers(source,figure){
 const lines=[],num=value=>new Intl.NumberFormat(state.language||'ro',{maximumFractionDigits:6}).format(value);
 const put=(key,value,unit='')=>{
  if(!Number.isFinite(value))return;
  lines.push(key+' = '+num(value)+(unit?' '+unit:''));
 };
 // The selected figure has priority over text-recognition, but dimensions
 // must be known and internally consistent before any numerical answer.
 if(figure){
  if(mathFigureInternalConflict(figure))return [];
  const measure=key=>mathFigureMeasurement(figure.values?.[key]);
  const unit=figure.unit||'cm',sq=unit+'²',cub=unit+'³';
  if(figure.id==='square'&&measure('latura')!==null){
   const a=measure('latura');put('A',a*a,sq);put('P',4*a,unit);return lines;
  }
  if(figure.id==='rectangle'&&measure('lungime')!==null&&measure('latime')!==null){
   const a=measure('lungime'),d=measure('latime');
   put('A',a*d,sq);put('P',2*(a+d),unit);return lines;
  }
  if(figure.id==='circle'||figure.id==='semicircle'){
   const r=measure('raza')??(measure('diametru')!==null?measure('diametru')/2:null);
   if(r!==null){
    put('A',Math.PI*r*r*(figure.id==='semicircle'?.5:1),sq);
    put('P',figure.id==='semicircle'?Math.PI*r+2*r:2*Math.PI*r,unit);
   }
   return lines;
  }
  if(figure.id==='triangle'&&['AB','BC','CA'].every(k=>measure(k)!==null)){
   const a=measure('AB'),b=measure('BC'),c=measure('CA');
   if(a+b<=c||a+c<=b||b+c<=a)return [];
   const semi=(a+b+c)/2;
   const area=Math.sqrt(Math.max(0,semi*(semi-a)*(semi-b)*(semi-c)));
   put('A',area,sq);put('P',a+b+c,unit);return lines;
  }
  if(figure.id==='equilateral'&&measure('latura')!==null){
   const a=measure('latura');put('A',a*a*Math.sqrt(3)/4,sq);put('P',3*a,unit);return lines;
  }
  if(figure.id==='isosceles'&&measure('baza')!==null&&measure('latura')!==null){
   const base=measure('baza'),side=measure('latura');
   if(side>base/2){put('A',base*Math.sqrt(side*side-base*base/4)/2,sq);put('P',base+2*side,unit)}
   return lines;
  }
  if(figure.id==='right'){
   const a=measure('a'),b=measure('b'),c=measure('c');
   if(a!==null&&b!==null){
    const hypo=Math.hypot(a,b);if(c!==null&&Math.abs(c-hypo)>1e-7)return [];
    put('c',hypo,unit);put('A',a*b/2,sq);put('P',a+b+hypo,unit);
   }else if(a!==null&&c!==null&&c>a){
    const leg=Math.sqrt((c-a)*(c+a));put('b',leg,unit);put('A',a*leg/2,sq);put('P',a+leg+c,unit);
   }else if(b!==null&&c!==null&&c>b){
    const leg=Math.sqrt((c-b)*(c+b));put('a',leg,unit);put('A',b*leg/2,sq);put('P',b+leg+c,unit);
   }
   return lines;
  }
  if(figure.id==='parallelogram'){
   const base=measure('baza'),height=measure('inaltime'),side=measure('latura');
   if(base!==null&&height!==null)put('A',base*height,sq);
   if(base!==null&&side!==null)put('P',2*(base+side),unit);
   return lines;
  }
  if(figure.id==='trapezoid'){
   const a=measure('bazaMare'),d=measure('bazaMica'),h=measure('inaltime');
   if(a!==null&&d!==null&&h!==null&&a>=d)put('A',(a+d)*h/2,sq);
   return lines;
  }
  if(figure.id==='rhombus'){
   const d1=measure('diagonala1'),d2=measure('diagonala2'),a=measure('latura');
   if(d1!==null&&d2!==null)put('A',d1*d2/2,sq);
   if(a!==null)put('P',4*a,unit);
   return lines;
  }
  if(['pentagon','hexagon'].includes(figure.id)&&measure('latura')!==null){
   const a=measure('latura'),n=figure.id==='pentagon'?5:6;
   put('A',n*a*a/(4*Math.tan(Math.PI/n)),sq);put('P',n*a,unit);return lines;
  }
  if(figure.id==='cube'&&measure('latura')!==null){
   const a=measure('latura');put('V',a*a*a,cub);put('A',6*a*a,sq);return lines;
  }
  if(figure.id==='cuboid'&&['lungime','latime','inaltime'].every(k=>measure(k)!==null)){
   const a=measure('lungime'),b=measure('latime'),h=measure('inaltime');
   put('V',a*b*h,cub);put('A',2*(a*b+a*h+b*h),sq);return lines;
  }
  if(figure.id==='cylinder'&&measure('raza')!==null&&measure('inaltime')!==null){
   const r=measure('raza'),h=measure('inaltime');
   put('V',Math.PI*r*r*h,cub);put('A',2*Math.PI*r*(r+h),sq);return lines;
  }
  if(figure.id==='cone'&&measure('raza')!==null&&measure('inaltime')!==null){
   const r=measure('raza'),h=measure('inaltime');
   put('V',Math.PI*r*r*h/3,cub);put('A',Math.PI*r*(r+Math.hypot(r,h)),sq);return lines;
  }
  if(figure.id==='sphere'&&measure('raza')!==null){
   const r=measure('raza');put('V',4*Math.PI*r*r*r/3,cub);put('A',4*Math.PI*r*r,sq);return lines;
  }
  return [];
 }
 const plotted=mathGraphModel(source);
 if(plotted){
  put('f(0)',plotted.c);
  if(Math.abs(plotted.a)>1e-12){
   const x0=-plotted.b/(2*plotted.a),y0=plotted.a*x0*x0+plotted.b*x0+plotted.c;
   lines.push('V('+num(x0)+'; '+num(y0)+')');
   const delta=plotted.b*plotted.b-4*plotted.a*plotted.c;
   if(delta>=0){
    put('x₁',(-plotted.b-Math.sqrt(delta))/(2*plotted.a));
    if(delta>1e-12)put('x₂',(-plotted.b+Math.sqrt(delta))/(2*plotted.a));
   }
  }else if(Math.abs(plotted.b)>1e-12)put('x₀',-plotted.c/plotted.b);
  return lines;
 }
 const additional=mathAdditionalModel(source);
 if(additional?.kind==='statistics'){lines.push(additional.summary);return lines}
 const plane=mathPlaneShapeModel(source);
 if(plane){
  const unit=plane.unit||'';
  put('A',plane.area,unit?unit+'²':'');
  put(plane.kind==='circle'?'C':'P',plane.perimeter,unit);
  return lines;
 }
 const triangle=mathRightTriangleModel(source);
 if(triangle){
  const unit=triangle.unit||'';
  put(triangle.kind==='hypotenuse'?'c':'b',triangle.kind==='hypotenuse'?triangle.c:triangle.b,unit);
  put('A',triangle.area,unit?unit+'²':'');
  put('P',triangle.perimeter,unit);
  return lines;
 }
 const linear=mathLinearEquation(source);
 if(linear?.kind==='unique'){put('x',linear.value);return lines}
 const quadratic=mathQuadraticEquation(source);
 if(quadratic?.roots?.length){
  quadratic.roots.forEach((root,i)=>put('x'+(i+1),root));
  return lines;
 }
 const system=mathLinearSystem(source);
 if(system?.kind==='unique'){
  put('x',system.x);put('y',system.y);return lines;
 }
 return [];
}
function mathGraphCorner(figure,source,attached){
 const lines=mathGraphVerifiedAnswers(source,attached);
 if(!figure||!lines.length)return figure;
 const tag=document.createElement('div');
 tag.className='math-graph-corner';
 tag.setAttribute('aria-label',learningLabel('Rezultate calculate','Calculated results'));
 for(const line of lines.slice(0,4)){
  const value=document.createElement('span');
  value.textContent=line;tag.append(value);
 }
 figure.append(tag);
 return figure;
}

function mathResultPage(index){
 const session=mathResultSession,dialog=$('mathResultDialog');
 if(!session||!dialog?.open)return;
 session.active=Math.max(0,Math.min(index,session.tasks.length-1));
 const tabs=$('mathResultTabs'),body=$('mathResultBody');
 const previousScroll=session.lastPage===session.active?body.scrollTop:0;
 session.lastPage=session.active;
 tabs.replaceChildren();body.replaceChildren();
 if(session.tasks.length>1){
  session.tasks.forEach((task,i)=>{
   const button=document.createElement('button');button.type='button';
   button.textContent=learningLabel('Exercițiul ','Exercise ')+(i+1);
   button.setAttribute('role','tab');button.setAttribute('aria-selected',i===session.active?'true':'false');
   button.onclick=()=>mathResultPage(i);tabs.append(button);
  });
 }
 const item=session.tasks[session.active];
 // Only compute the selected exercise; do not fire 30 parallel model requests.
 if(!item.started){item.started=true;queueMicrotask(()=>{if(mathResultSession===session)void mathFetchResult(item,session)})}
 mathLastSpokenReply=item.spokenReply||item.reply||'';
 const title=document.createElement('h3');
 title.textContent=learningLabel('Exercițiul ','Exercise ')+(session.active+1);
 const source=document.createElement('div');source.className='math-result-source';
 source.textContent=item.text;
 body.append(title,source);
 const verifiedEquality=mathArithmeticEquality(item.text);
 if(verifiedEquality&&!item.detailed&&session.mode!=='explain'){
  const check=document.createElement('p');
  check.className='math-equality-check';
  check.style.cssText='margin:12px 0 14px;font-weight:750;line-height:1.45';
  check.textContent=mathEqualityExplanation(verifiedEquality);
  body.append(check);
 }
 const equationGraph=session.mode==='graph'||session.mode==='solve'?mathAlgebraLocal('graph',item.text)?.value:null;
 const attachedFigure=session.figure&&['geometry','trigonometry'].includes(session.topic)?session.figure:null;
 const graph=(attachedFigure?mathFigureSnapshot(attachedFigure):null)||
  (equationGraph?.planeShape?mathPlaneShapeFigure(equationGraph.planeShape):null)||
  (equationGraph?.geometry?mathRightTriangleFigure(equationGraph.geometry):null)||
  (equationGraph?.matrixView?mathMatrixHeatmap(equationGraph.matrixView):null)||
  (equationGraph?.statistics?mathStatisticsFigure(equationGraph.statistics):null)||
  (equationGraph?.polynomial?mathSymbolicPlot(equationGraph.polynomial):null)||
  (equationGraph?.system3d?mathSystem3x3Figure(equationGraph.system3d):null)||
  (equationGraph?.system?mathLinearSystemFigure(equationGraph.system):null)||mathGraphFigure(item.text)||
  (equationGraph?.expression?mathGraphFigure(equationGraph.expression,equationGraph.root??null):null);
 if(graph&&(session.mode==='graph'||Boolean(attachedFigure)||Boolean(mathGraphVerifiedAnswers(item.text,null).length)))body.append(mathGraphCorner(graph,item.text,attachedFigure));
 const result=document.createElement('div');result.className='math-result-copy';
 if(item.graphLesson){
  const heading=document.createElement('h3');heading.textContent=item.graphLesson.heading;
  const intro=document.createElement('p');intro.textContent=item.graphLesson.intro;
  const conclusion=document.createElement('p');conclusion.textContent=item.graphLesson.conclusion;
  conclusion.style.cssText='font-weight:700;line-height:1.5';
  result.append(heading,intro,conclusion);body.append(result);
 }else if(item.functionLesson){
  const heading=document.createElement('h3');heading.textContent=item.functionLesson.heading;
  const intro=document.createElement('p');intro.textContent=item.functionLesson.intro;
  const list=document.createElement('ol');
  list.style.cssText='padding-left:25px;display:grid;gap:16px;margin:16px 0';
  for(const step of item.functionLesson.steps){
   const li=document.createElement('li');
   const name=document.createElement('strong');name.textContent=step.name;
   const why=document.createElement('p');why.textContent=step.description;
   why.style.cssText='margin:6px 0;line-height:1.5';
   li.append(name,why);list.append(li);
  }
  const conclusion=document.createElement('p');conclusion.textContent=item.functionLesson.conclusion;
  result.append(heading,intro,list,conclusion);body.append(result);
 }else if(item.methodGuide){
  const heading=document.createElement('h3');heading.textContent=item.methodGuide.heading;
  const intro=document.createElement('p');intro.textContent=item.methodGuide.intro;
  const list=document.createElement('ol');list.style.cssText='padding-left:25px;display:grid;gap:16px;margin:16px 0';
  for(const rule of item.methodGuide.rules){
   const li=document.createElement('li');
   const title=document.createElement('strong');title.textContent=rule.title;
   const description=document.createElement('p');description.textContent=rule.text;
   description.style.cssText='margin:6px 0;line-height:1.5';
   li.append(title,description);list.append(li);
  }
  const tip=document.createElement('p');tip.textContent=item.methodGuide.tip;
  tip.style.cssText='font-weight:650;line-height:1.5';
  result.append(heading,intro,list,tip);body.append(result);
 }else if(item.detailed){
  const heading=document.createElement('strong');
  heading.textContent=learningLabel('Rezolvăm împreună, pas cu pas','Let’s solve it together, step by step');
  const intro=document.createElement('p');intro.textContent=item.detailed.intro;
  result.append(heading,intro);
  if(item.detailed.steps.length){
   const list=document.createElement('ol');
   list.style.cssText='padding-left:25px;display:grid;gap:16px;margin:16px 0';
   for(const step of item.detailed.steps){
    const li=document.createElement('li');
    const name=document.createElement('strong');name.textContent=step.label;
    const why=document.createElement('p');why.textContent=step.reason;
    why.style.cssText='margin:7px 0;line-height:1.5';
    const operation=document.createElement('div');operation.textContent=step.operation;
    operation.style.cssText='font-weight:650;margin:8px 0;overflow-wrap:anywhere';
    const remaining=document.createElement('div');
    remaining.textContent=learningLabel('Rescriem expresia completă: ','Rewrite the full expression: ')+step.fullAfter;
    remaining.style.cssText='opacity:.92;margin-top:8px;overflow-wrap:anywhere';
    if(step.verificationSteps?.length){
     const proof=document.createElement('div');proof.className='math-verification-lines';
     proof.style.cssText='display:grid;gap:9px;margin:10px 0';
     for(const equation of step.verificationSteps){
      const line=document.createElement('div');line.textContent=equation;
      line.style.cssText='font-weight:650;line-height:1.45;overflow-wrap:anywhere';
      proof.append(line);
     }
     li.append(name,why,proof);list.append(li);continue;
    }
    li.append(name,why,operation);
    if(step.signRule){
     const note=document.createElement('p');note.textContent=step.signRule;
     note.style.cssText='margin:5px 0;opacity:.88;font-style:italic;line-height:1.4';
     li.append(note);
    }
    li.append(remaining);list.append(li);
   }
   result.append(list);
  }
  const conclusion=document.createElement('p');conclusion.textContent=learningLabel('Verificare și concluzie: ','Check and conclusion: ')+item.detailed.conclusion;
  conclusion.style.cssText='font-weight:700;line-height:1.5;margin-top:16px';
  result.append(conclusion);body.append(result);
 }else if(item.error){result.classList.add('math-result-error');result.textContent=item.error;
  const retry=document.createElement('button');retry.type='button';retry.className='secondary-btn';
  retry.textContent=learningLabel('Reîncearcă','Retry');
  retry.onclick=()=>{item.error=null;item.reply='';mathResultPage(session.active);void mathFetchResult(item,session)};
  body.append(result,retry);
 }else if(item.reply){
  // Distinguish deterministic local results from generated explanations.
  if(item.generated){
   const note=document.createElement('p');note.className='math-model-disclosure';
   note.textContent=learningLabel('Explicație AI: verifică rezultatul și pașii; pentru acest tip de problemă nu există încă verificare matematică locală.',
    'AI explanation: check the result and steps; this problem type does not yet have local mathematical verification.');
   note.style.cssText='font-size:.85em;opacity:.85;margin:0 0 10px;';
   result.append(note);
  }
  appendAnswerText(result,mathCleanAnswerMarkup(item.reply));body.append(result);
 }else{
  result.textContent=learningLabel('Se pregătește explicația…','Preparing the explanation…');
  body.append(result);
 }
 body.scrollTop=previousScroll;
}
async function mathFetchResult(item,session){
 const verifiedFunction=item.functionLesson||mathFunctionLesson(item.text,session.mode);
 if(verifiedFunction){
  if(mathResultSession!==session)return;
  item.functionLesson=verifiedFunction;
  item.spokenReply=verifiedFunction.intro+' '+verifiedFunction.steps.map((step,i)=>(i+1)+'. '+step.name+'. '+step.description).join(' ')+'. '+verifiedFunction.conclusion;
  if(session.tasks[session.active]===item)mathResultPage(session.active);
  return;
 }
 if(session.mode==='graph'){
  const associated=mathAlgebraLocal('graph',item.text)?.value;
  if(associated){
   if(mathResultSession!==session)return;
   item.graphLesson=associated;
   item.spokenReply=associated.intro+' '+associated.conclusion;
   if(session.tasks[session.active]===item)mathResultPage(session.active);
   return;
  }
 }
 // Never ask a generative model to draw a graph that the actual renderer
 // cannot provide: this produced answers about unrelated numeric exercises.
 if(session.mode==='graph'&&!session.figure&&!mathPlaneShapeModel(item.text)&&!mathRightTriangleModel(item.text)&&!mathAlgebraLocal('graph',item.text)){
  if(mathResultSession!==session)return;
  item.reply=learningLabel('Nu există încă un grafic verificat pentru acest enunț. Nu voi inventa unul. Pentru un calcul, apasă „Rezolvă pas cu pas”; pentru un grafic de funcție, introdu de exemplu f(x) = 2x - 3.',
   'There is no verified graph for this exercise yet. I will not invent one. Use Solve step by step for arithmetic, or enter a function such as f(x) = 2x - 3.');
  item.spokenReply=item.reply;
  if(session.tasks[session.active]===item)mathResultPage(session.active);
  return;
 }
 if(session.mode==='graph'&&session.figure&&['geometry','trigonometry'].includes(session.topic)){
  item.graphLesson={heading:mathFigureName(session.figure),
   intro:learningLabel('Figura este afișată fără valori presupuse. Poți completa date și reveni la rezolvare.',
    'The figure is displayed without invented values. Add dimensions and continue the solution.'),
   conclusion:learningLabel('Zoom și rotire sunt disponibile în editorul de figuri.','Zoom and rotation are available in the figure editor.')};
  item.spokenReply=item.graphLesson.intro+' '+item.graphLesson.conclusion;
  if(mathResultSession===session&&session.tasks[session.active]===item)mathResultPage(session.active);
  return;
 }
 if(session.mode==='explain'){
  const method=item.methodGuide||mathAlgebraLocal('explain',item.text)?.value;
  if(method){
   if(mathResultSession!==session)return;
   item.methodGuide=method;
   item.spokenReply=method.intro+' '+method.rules.map((r,i)=>(i+1)+'. '+r.title+'. '+r.text).join(' ')+'. '+method.tip;
   if(session.tasks[session.active]===item)mathResultPage(session.active);
   return;
  }
 }
 if(session.mode==='solve'){
  const steps=item.detailed||mathAlgebraLocal('solve',item.text)?.value;
  if(steps){
   if(mathResultSession!==session)return;
   item.detailed=steps;
   item.spokenReply=steps.intro+' '+steps.steps.map((step,i)=>(i+1)+'. '+step.label+'. '+step.reason+' '+step.operation+'. '+(step.signRule?step.signRule+' ':'')+(step.verificationSteps?step.verificationSteps.slice(0,-1).join('. ')+'. ':'')+step.fullAfter).join(' ')+'. '+steps.conclusion;
   if(session.tasks[session.active]===item)mathResultPage(session.active);
   return;
  }
 }
 const graph=Boolean(mathGraphModel(item.text));
 const prompt=session.mode==='explain'?learningLabel(
  'Ești profesor de matematică. Predă numai METODA GENERALĂ pentru categoria acestui exercițiu, fără a-l rezolva numeric. Structură: tip de exercițiu, reguli, cum se începe, greșeli frecvente, cum verifici. Fără verdictul egalității, fără calcule ale exercițiului dat, fără repetiții și fără surse inventate.',
  'Teach only the GENERAL METHOD for this type of math problem, without numerically solving the supplied exercise. Cover problem type, rules, where to start, common mistakes, verification. No true/false verdict, no worked solution, no repetition or invented sources.'
 ):learningLabel(
  'Ești un profesor de matematică răbdător, care predă la clasă. Rezolvă DOAR exercițiul următor. Prezintă mai întâi ideea și regula folosită, explică de ce aplicăm fiecare regulă, apoi explică fiecare transformare intermediară în pași numerotați, fără a omite termeni sau operații. Afișează expresia completă după fiecare pas; respectă ordinea operațiilor și verifică explicit calculele la final. Dacă expresia conține un semn egal, evaluează ambele părți și spune explicit dacă egalitatea este adevărată sau falsă; nu ignora valoarea din dreapta. Nu cita lecții video, site-uri sau surse pe care utilizatorul nu le-a furnizat. Dacă este o funcție, explică punctele și proprietățile ei, dar nu produce grafice ASCII sau tabele ASCII: aplicația desenează graficul separat când formula este compatibilă. Nu inventa valori și nu cere confirmări dacă enunțul este clar.',
  'You are a patient classroom mathematics teacher. Solve ONLY this exercise. First explain the idea and rule being used, say why each rule applies, then explain every intermediate transformation in numbered steps, never dropping terms or operations. Show the complete expression after every step, respect operation precedence, and check the arithmetic explicitly. If the expression contains an equals sign, calculate both sides and explicitly say whether the equality is true or false; do not ignore the right side. Never cite videos, websites, or other references not supplied by the user. For a function, explain its properties and key points; never output ASCII graphs or ASCII tables, because the app plots supported functions separately. Do not invent values or request confirmations for a clear problem.'
 );
 const requested=session.mode==='graph'?
  learningLabel('Accentuează reprezentarea grafică și intersecțiile cu axele.','Focus on the graph and axis intercepts.'):
  session.mode==='explain'?
  learningLabel('Explică metoda de lucru, nu doar rezultatul.','Explain the method, not only the answer.'):
  learningLabel('Prezintă rezolvarea pas cu pas.','Provide a step-by-step solution.');
 const equality=mathArithmeticEquality(item.text);
 const checked=equality&&session.mode!=='explain'?
  learningLabel('Verificare aritmetică locală: ','Local arithmetic verification: ')+mathEqualityExplanation(equality)+
  learningLabel(' Menționează explicit această verificare și explică de ce; nu modifica enunțul dictat.',' Explain this check explicitly without rewriting the dictated exercise.'):'';
 const levelEntry=MATH_LEVELS.find(x=>x.id===session.level);
 const topicEntry=MATH_TOPICS.find(x=>x.id===session.topic);
 const levelContext={level:levelEntry?learningLabel(levelEntry.ro,levelEntry.en):'',
  topic:topicEntry?learningLabel(topicEntry.ro,topicEntry.en):''};
 const pedagogy={
  beginner:learningLabel(
   'Explică fiecare simbol nou și operație intermediară, evită salturile de calcul. Dacă exercițiul depășește nivelul, explică întâi noțiunile necesare fără a schimba problema.',
   'Define new symbols, show every arithmetic step, and introduce prerequisites for advanced questions without changing them.'),
  intermediate:learningLabel(
   'Folosește riguros noțiunile de liceu: identifică formula, condițiile de aplicare, transformările și verificarea rezultatului.',
   'Use upper-secondary concepts, state conditions, justify transformations, and verify results.'),
  advanced:learningLabel(
   'Folosește definiții și ipoteze explicite, argumente universitare riguroase, cazuri-limită și verificarea domeniului.',
   'Use precise definitions, explicit assumptions, rigorous university-level reasoning, domain restrictions and edge cases.')
 }[session.level]||'';
 const classroom=learningLabel('Nivel: ','Level: ')+levelContext.level+
  learningLabel('; materie: ','; subject: ')+levelContext.topic+
  learningLabel('. Nu modifica enunțul. ','. Do not modify the problem. ')+pedagogy;
 item.generated=true;
 const message=prompt+'\\n'+classroom+'\\n'+requested+(checked?'\\n'+checked:'')+'\\n'+
  learningLabel('Răspunde strict la următorul exercițiu, nu la alte exemple:','Answer ONLY the following exercise, not another problem:')+'\\n'+item.text;
 const taskController=new AbortController();
 const cancelTask=()=>taskController.abort();
 session.controller.signal.addEventListener('abort',cancelTask,{once:true});
 const deadline=setTimeout(cancelTask,20000);
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message,language:state.language,module:'learning',history:[],location_requested:false}),
   signal:taskController.signal});
  const payload=await response.json();
  if(!response.ok||payload.status!=='success'||typeof payload.reply!=='string'||!payload.reply.trim())
   throw new Error(payload.error||learningLabel('Nu am primit o rezolvare validă.','No valid solution returned.'));
  if(mathResultSession!==session)return;
  item.reply=mathCleanAnswerMarkup(payload.reply.trim());item.spokenReply=item.reply;
 }catch(error){
  if(mathResultSession!==session||session.controller.signal.aborted)return;
  item.error=taskController.signal.aborted?
   learningLabel('Rezolvarea a depășit 20 de secunde. Verifică conexiunea sau încearcă din nou.','The solution exceeded 20 seconds. Check the connection or try again.'):
   learningLabel('Nu am putut obține rezolvarea: ','Could not obtain the solution: ')+String(error?.message||error);
 }finally{
  clearTimeout(deadline);
  session.controller.signal.removeEventListener('abort',cancelTask);
 }
 if(mathResultSession===session&&session.tasks[session.active]===item)mathResultPage(session.active);
}
function mathEducationRun(mode){
 if(state.currentView!=='module'||activeLearningSubject?.[0]!=='math')return;
 const editor=$('mathEducationText'),status=$('mathEducationStatus');
 let source=editor?.value?.trim()||'';
 if(['geometry','trigonometry'].includes(mathJourney.topic)&&mathFigureDraft){
  // Old selections may be present in saved draft text. Keep one current
  // figure header and one question, never manufacture multiple task tabs.
  const currentFigure=mathFigureStatement(mathFigureDraft);
  const question=mathFigureStripAutoStatements(source);
  source=currentFigure+(question?'\\n'+question:'');
  const internal=mathFigureInternalConflict(mathFigureDraft);
  if(internal){
   status.textContent=learningLabel('Date incompatibile în figură: ','Inconsistent figure measurements: ')+internal;
   return;
  }
  const mismatch=mathFigureConflict(mathFigureDraft,source);
  if(mismatch){
   status.textContent=learningLabel('Valoarea „','Value “')+mismatch+
    learningLabel('” diferă între enunț și figură. Corectează diferența înainte de rezolvare.',
     '” differs between the question and the figure. Correct the mismatch first.');
   return;
  }
  const figureOnly=mathFigureStatement(mathFigureDraft);
  const original=mathFigureStripAutoStatements(editor?.value?.trim()||'');
  if(mode!=='graph'&&!original){
   status.textContent=learningLabel('Figura este atașată. Scrie ce dorești să calculăm sau să explicăm (de exemplu: calculează aria).',
    'The figure is attached. Write what to calculate or explain (for example: calculate the area).');
   return;
  }
  // The figure header already contains all user-entered dimensions.
  // Do not duplicate them or prepend a second artificial problem.
 }
 if(mathPhotoNeedsReview){
  status.textContent=learningLabel('Fotografia trebuie verificată. Selectează un exercițiu și confirmă transcrierea înainte de rezolvare.','Review the photo. Select an exercise and confirm the transcription before solving.');
  return;
 }
 if(!source){
  status.textContent=learningLabel('Scrie sau fotografiază exercițiul.','Type or photograph the exercise.');
  return;
 }
 // Only block structurally broken standalone formulae, not word problems.
 const hasProse=/[a-zA-ZăâîșțĂÂÎȘȚ]{3,}/u.test(source);
 if(!hasProse&&educationMathOcrIncomplete(source)){
  status.textContent=learningLabel('Formula este incompletă. Corectează semnele.','The formula is incomplete. Correct its symbols.');
  return;
 }
 const taskTexts=(mathFigureDraft&&['geometry','trigonometry'].includes(mathJourney.topic))?
  [source]:mathSplitExercises(source);
 const tasks=taskTexts.map(text=>({text,reply:'',error:null,
  functionLesson:null,detailed:null,methodGuide:null,started:false}));
 if(!tasks.length){status.textContent=learningLabel('Nu există un exercițiu de rezolvat.','No exercise to solve.');return}
 mathCloseResults();
 const session={mode,tasks,active:0,controller:new AbortController(),
  figure:mathFigureDraft&&['geometry','trigonometry'].includes(mathJourney.topic)?mathFigureCopy(mathFigureDraft):null,
  topic:mathJourney.topic,level:mathJourney.level};
 mathResultSession=session;
 const dialog=$('mathResultDialog');
 $('mathResultTitle').textContent=mode==='explain'?learningLabel('Matematică · Metodă','Mathematics · Method'):mode==='graph'?learningLabel('Matematică · Grafic','Mathematics · Graph'):learningLabel('Matematică · Rezolvare','Mathematics · Solution');
 $('mathResultClose').textContent=learningLabel('Revenire','Back');
 mathRememberDraft(editor.value);status.textContent='';
 if(document.activeElement?.blur)document.activeElement.blur();
 try{dialog.showModal();document.documentElement.classList.add('math-result-visible')}catch(error){
  mathResultSession=null;editor.value=source;
  status.textContent=learningLabel('Fereastra de rezolvare nu poate fi deschisă.','Cannot open the solution window.');
  return;
 }
 mathResultPage(0);
 // The first tab is loaded by mathResultPage; other tasks load on selection.
}
$('mathResultClose').onclick=mathCloseResults;
$('mathResultDialog').addEventListener('close',()=>{
 document.documentElement.classList.remove('math-result-visible');
 if(mathResultSession){mathResultSession.controller.abort();mathResultSession=null}
});

// This is the ONLY interaction after photographing a mathematics exercise.
// Recognition remains uncertain; learners may edit the text before solving.
window.pocketAndroidOcrResult=function(data){
 if(state.currentModule!=='learning'||!activeLearningSubject||state.currentView!=='module')return;
 if(data?.status==='cancelled')return;
 if(activeLearningSubject[0]==='science'&&scienceJourney.stage==='workspace'){
  if(data?.status==='error'){scienceStatus(learningLabel('Fotografia nu a putut fi citită.','Photo could not be read.'));return}
  sciencePhotoReview(typeof data?.text==='string'?data.text:'');return;
 }
 if(activeLearningSubject[0]==='math'){
  const editor=$('mathEducationText'),status=$('mathEducationStatus');
  if(!editor||!status)return;
  const text=typeof data?.text==='string'?data.text.trim().slice(0,3500):'';
  if(!text&&!window.PocketAndroidMathVision?.postMessage){status.textContent=learningLabel('Fotografia nu a putut fi citită. Exercițiul introdus anterior a fost păstrat.','Photo could not be read. The previous exercise was preserved.');return;}
  mathPhotoNeedsReview=true;
  document.querySelector('.math-photo-review-dialog')?.remove();
  const dialog=document.createElement('dialog');dialog.className='math-photo-review-dialog';
  dialog.style.cssText='box-sizing:border-box;position:fixed;inset:0;margin:auto;width:min(94vw,680px);max-width:94vw;height:min(82dvh,720px);max-height:82dvh;padding:0;border:2px solid #4c9dbb;border-radius:20px;background:#0b2639;color:#f4fbff;box-shadow:0 16px 50px #000b;overflow:hidden;';
  const frame=document.createElement('div');
  frame.style.cssText='display:flex;flex-direction:column;height:100%;min-height:0;';
  const header=document.createElement('div');
  header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto;padding:12px 16px;border-bottom:1px solid #467f98;';
  const title=document.createElement('strong');title.textContent=learningLabel('Verifică fotografia','Review photograph');
  const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='math-result-close';
  dismiss.textContent=learningLabel('Revenire','Back');
  dismiss.onclick=()=>dialog.close();
  header.append(title,dismiss);
  const content=document.createElement('div');
  content.style.cssText='display:flex;flex-direction:column;gap:12px;flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:14px 16px;';
  const warning=document.createElement('p');warning.style.cssText='margin:0;line-height:1.45';
  warning.textContent=learningLabel('OCR neverificat. Selectează un singur exercițiu. Compară cifrele, semnele, exponenții și radicalii cu fotografia, apoi corectează textul.','Unverified OCR. Select one exercise. Compare digits, signs, powers and roots with the photograph, then correct the text.');
  content.append(warning);
  const candidates=mathPhotoCandidates(text,data?.alternative);
  const primaryCount=mathPhotoCandidates(text).length;
  const countNote=document.createElement('small');
  countNote.setAttribute('role','status');
  countNote.style.cssText='opacity:.86;line-height:1.3;';
  countNote.textContent=learningLabel('Rezultate OCR propuse: ','Suggested OCR results: ')+candidates.length+
   learningLabel(' (citire principală: ',' (primary read: ')+primaryCount+
   learningLabel('; suplimentare: ','; additional: ')+(candidates.length-primaryCount)+'). '+
   learningLabel('Verifică dacă există dubluri.','Check for duplicates.');
  content.append(countNote);
  // Pilot lives inside the existing review dialog: no extra global buttons.
  // Only new signed APKs expose the native one-image bridge.
  if(window.PocketAndroidMathVision?.postMessage){
   const visionToggle=document.createElement('button');visionToggle.type='button';
   visionToggle.className='secondary-btn';
   visionToggle.textContent=learningLabel('Verifică simbolurile cu AI (pilot)','Check symbols with AI (pilot)');
   visionToggle.style.cssText='align-self:stretch;min-height:42px;flex:0 0 auto;';
   const pilotBox=document.createElement('div');
   pilotBox.style.cssText='display:none;flex-direction:column;gap:10px;padding:12px;border:1px solid #467f98;border-radius:12px;background:#102f43;';
   const disclosure=document.createElement('p');
   disclosure.style.cssText='margin:0;line-height:1.45;';
   disclosure.textContent=learningLabel(
    'Opțional: numai după confirmare, fotografia va fi trimisă către Cloudflare Workers AI pentru o a doua transcriere. Rezultatul poate greși. Nu confirmăm și nu rezolvăm automat. Funcția necesită activarea pilotului și se folosește numai în limita gratuită stabilită.',
    'Optional: only after confirmation, the photograph will be sent to Cloudflare Workers AI for a second reading. It may be wrong. Nothing is automatically confirmed or solved. The pilot must be enabled and is intended only for free-tier use.');
   const pilotToken=document.createElement('input');
   pilotToken.type='password';pilotToken.className='text-field';
   pilotToken.autocomplete='off';pilotToken.spellcheck=false;
   pilotToken.placeholder=learningLabel('Codul pilotului (minim 32 caractere)','Pilot token (at least 32 characters)');
   pilotToken.setAttribute('aria-label',learningLabel('Codul privat pentru pilotul matematic','Private mathematics pilot token'));
   pilotToken.value=mathPilotToken||'';
   const pilotSend=document.createElement('button');pilotSend.type='button';pilotSend.className='primary-btn';
   pilotSend.textContent=learningLabel('Sunt de acord. Trimite această fotografie','I agree. Send this photograph');
   const pilotStatus=document.createElement('small');pilotStatus.setAttribute('role','status');
   pilotStatus.setAttribute('aria-live','polite');pilotStatus.style.cssText='min-height:1.2em;line-height:1.4;';
   visionToggle.onclick=()=>{
    pilotBox.style.display=pilotBox.style.display==='none'?'flex':'none';
   };
   pilotSend.onclick=async()=>{
    const token=pilotToken.value.trim();
    if(token.length<32){
     pilotStatus.textContent=learningLabel('Introdu codul pilotului configurat în Cloudflare.','Enter the pilot token configured in Cloudflare.');return;
    }
    mathPilotToken=token; // In-memory session only; never save to storage.
    pilotSend.disabled=true;
    pilotStatus.textContent=learningLabel('Se pregătește fotografia pentru verificare…','Preparing the photograph for review…');
    try{
     const image=await mathVisionPhotoOnDemand();
     if(!dialog.open)throw new Error('cancelled');
     pilotStatus.textContent=learningLabel('Se compară simbolurile matematice…','Comparing mathematical symbols…');
     const visionEndpoint=CLIENT_CONFIG.apiUrl.replace(/\\/api\\/chat(?:\\?.*)?$/,'/api/math-vision');
     const response=await fetch(visionEndpoint,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({image})
     });
     const result=await response.json().catch(()=>({}));
     if(!response.ok||result.status!=='success'||!result.transcript)
      throw new Error(String(result.error||'vision_unavailable'));
     pilotStatus.textContent=learningLabel('Transcriere AI neverificată. Selectează sau copiază UN exercițiu și verifică-l.','Unverified AI transcription. Choose or copy ONE exercise and verify it.');
     pilotBox.querySelector('.math-vision-output')?.remove();
     const output=document.createElement('div');output.className='math-vision-output';
     output.style.cssText='display:flex;flex-direction:column;gap:8px;';
     const textArea=document.createElement('textarea');
     textArea.readOnly=true;textArea.rows=5;textArea.value=result.transcript.slice(0,8000);
     textArea.style.cssText='box-sizing:border-box;width:100%;padding:10px;background:#061929;border:1px solid #6bb7c9;color:#fff;border-radius:10px;resize:vertical;';
     textArea.setAttribute('aria-label',learningLabel('Rezultat OCR AI pentru verificare','AI OCR result for verification'));
     output.append(textArea);
     const choices=mathPhotoCandidates(result.transcript);
     for(const entry of choices.slice(0,40)){
      const choice=document.createElement('button');choice.type='button';choice.className='secondary-btn';
      choice.style.cssText='text-align:left;min-height:42px;';
      choice.textContent=entry.label.slice(0,220);
      choice.onclick=()=>{
       candidateInput.value=entry.text;
       refreshMathPhotoCorrections();
      };
      output.append(choice);
     }
     pilotBox.append(output);
    }catch(error){
     const key=String(error?.message||'');
     pilotStatus.textContent=key==='math_vision_not_configured'?
      learningLabel('Pilotul OCR AI nu este încă activat în Cloudflare.','AI OCR pilot is not enabled in Cloudflare yet.'):
      key==='unauthorized'?learningLabel('Codul pilotului este incorect.','Incorrect pilot token.'):
      learningLabel('Verificarea AI nu a reușit. OCR-ul local rămâne disponibil.','AI check failed. On-device OCR remains available.');
    }finally{pilotSend.disabled=false}
   };
   pilotBox.append(disclosure,pilotToken,pilotSend,pilotStatus);
   content.append(visionToggle,pilotBox);
  }
  const candidateInput=document.createElement('textarea');
  candidateInput.rows=4;candidateInput.maxLength=240;
  candidateInput.style.cssText='box-sizing:border-box;width:100%;min-height:100px;padding:12px;border:1px solid #6bb7c9;border-radius:12px;background:#061929;color:#fff;font:inherit;resize:vertical';
  candidateInput.setAttribute('aria-label',learningLabel('Transcrierea exercițiului selectat','Selected exercise transcription'));
  candidateInput.placeholder=learningLabel('Corectează aici UN exercițiu','Correct ONE exercise here');
  let selectedCandidateIndex=-1;
  if(candidates.length){
   // One tap selects an exercise. Do not rebuild the scroll container on tap:
   // replacing the touched node used to cancel selection on Android WebView.
   const search=document.createElement('input');
   search.type='search';search.className='text-field';
   search.placeholder=learningLabel('Caută în lista exercițiilor…','Search exercises…');
   search.setAttribute('aria-label',learningLabel('Filtrează subpunctele fotografiate','Filter photographed subpoints'));
   search.autocomplete='off';search.spellcheck=false;
   search.style.cssText='box-sizing:border-box;width:100%;flex:0 0 auto;min-height:42px;';
   const selectedInfo=document.createElement('small');
   selectedInfo.setAttribute('role','status');
   selectedInfo.setAttribute('aria-live','polite');
   selectedInfo.style.cssText='display:block;min-height:1.2em;color:#a9ddea;font-weight:650;line-height:1.35;';
   selectedInfo.textContent=learningLabel('Niciun exercițiu selectat.','No exercise selected.');
   const choices=document.createElement('div');
   choices.setAttribute('role','group');
   choices.setAttribute('aria-label',learningLabel('Exerciții fotografiate: listă derulantă','Photographed exercises: scrollable list'));
   choices.style.cssText='display:flex;flex-direction:column;gap:6px;flex:0 0 auto;max-height:min(31dvh,232px);min-height:54px;overflow-y:auto;overscroll-behavior:contain;padding:2px 4px;border:1px solid #467f98;border-radius:12px;';
   const updateChoiceHighlights=()=>{
    for(const button of choices.querySelectorAll('button[data-math-photo-index]')){
     const selected=Number(button.dataset.mathPhotoIndex)===selectedCandidateIndex;
     button.setAttribute('aria-pressed',selected?'true':'false');
     button.style.borderColor=selected?'#8dd9ed':'#467f98';
     button.style.background=selected?'#205777':'#12354b';
    }
   };
   const selectCandidate=i=>{
    const entry=candidates[i];
    if(!entry)return;
    selectedCandidateIndex=i;
    candidateInput.value=entry.text;
    selectedInfo.textContent=learningLabel('Selectat: ','Selected: ')+entry.label;
    refreshMathPhotoCorrections();
    updateChoiceHighlights();
   };
   const renderChoices=()=>{
    const query=search.value.trim().toLocaleLowerCase();
    choices.replaceChildren();
    const indexes=candidates.map((_,i)=>i).filter(i=>!query||candidates[i].label.toLocaleLowerCase().includes(query));
    if(!indexes.length){
     const empty=document.createElement('p');
     empty.textContent=learningLabel('Nu există rezultate pentru această căutare.','No matching exercises.');
     empty.style.cssText='margin:10px 4px;';
     choices.append(empty);
    }
    for(const i of indexes){
     const entry=candidates[i];
     const button=document.createElement('button');
     button.type='button';
     button.dataset.mathPhotoIndex=String(i);
     button.textContent=entry.label+(entry.origin==='alternate'?
      learningLabel(' · OCR suplimentar',' · Additional OCR'):'');
     button.style.cssText='box-sizing:border-box;width:100%;text-align:left;font:inherit;min-height:46px;flex:0 0 auto;padding:9px 12px;border-radius:10px;line-height:1.35;white-space:normal;border:1px solid #467f98;background:#12354b;color:#f4fbff;touch-action:manipulation;';
     button.onclick=()=>selectCandidate(i);
     choices.append(button);
    }
    updateChoiceHighlights();
   };
   // Android WebView sometimes suppresses click after interacting with a
   // nested scroll container. Recognize an actual stationary tap in addition
   // to the normal button click, without treating vertical swipes as taps.
   const tappedRow=event=>{
    const node=event.target?.closest?.('button[data-math-photo-index]')||event.target;
    const index=node?.dataset?.mathPhotoIndex;
    if(index===undefined||!choices.contains(node))return null;
    const number=Number(index);
    return Number.isInteger(number)&&number>=0&&number<candidates.length?number:null;
   };
   let pointerStart=null,touchStart=null;
   choices.addEventListener('pointerdown',event=>{
    if(event.isPrimary===false)return;
    pointerStart={id:event.pointerId,x:event.clientX,y:event.clientY};
   },{passive:true});
   choices.addEventListener('pointercancel',()=>{pointerStart=null},{passive:true});
   choices.addEventListener('pointerup',event=>{
    const start=pointerStart;pointerStart=null;
    if(!start||start.id!==event.pointerId||
       Math.abs(event.clientX-start.x)>12||Math.abs(event.clientY-start.y)>12)return;
    const index=tappedRow(event);
    if(index!==null)selectCandidate(index);
   },{passive:true});
   // Touch fallback is needed for older Android WebViews that do not deliver
   // pointerup reliably after a finger taps an inner scrolling button.
   choices.addEventListener('touchstart',event=>{
    const touch=event.touches?.[0];
    touchStart=touch?{id:touch.identifier,x:touch.clientX,y:touch.clientY}:null;
   },{passive:true});
   choices.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
   choices.addEventListener('touchend',event=>{
    const start=touchStart;touchStart=null;
    const touch=Array.from(event.changedTouches||[]).find(item=>item.identifier===start?.id);
    if(!start||!touch||Math.abs(touch.clientX-start.x)>12||
       Math.abs(touch.clientY-start.y)>12)return;
    const index=tappedRow(event);
    if(index!==null)selectCandidate(index);
   },{passive:true});
   choices.addEventListener('scroll',()=>{pointerStart=null;touchStart=null},{passive:true});
   search.addEventListener('input',renderChoices);
   renderChoices();
   content.append(search,selectedInfo,choices);
   if(candidates.length>4){
    const hint=document.createElement('small');
    hint.style.cssText='opacity:.86;';
    hint.textContent=learningLabel('Glisează lista pentru a vedea toate rezultatele.','Scroll the list to see all results.');
    content.append(hint);
   }
  }else{
   const notice=document.createElement('p');
   notice.textContent=learningLabel('Nu am putut separa exercițiile în siguranță. Transcrie unul singur din fotografie.','Could not safely separate exercises. Transcribe just one from the photograph.');
   content.append(notice);
  }
  const feedback=document.createElement('small');
  feedback.setAttribute('role','status');
  feedback.setAttribute('aria-live','polite');
  feedback.style.cssText='color:#ffcd93;min-height:1.2em;';
  const correctionActions=document.createElement('div');
  correctionActions.setAttribute('role','group');
  correctionActions.setAttribute('aria-label',learningLabel('Corectarea simbolurilor OCR','Correct OCR symbols'));
  correctionActions.style.cssText='display:flex;flex-wrap:wrap;gap:8px;';
  const refreshMathPhotoCorrections=()=>{
   const value=candidateInput.value;
   feedback.textContent=mathPhotoOcrRiskWarning(value);
   correctionActions.replaceChildren();
   const risks=mathPhotoOcrRisks(value);
   for(const [kind,title] of [
    ...(risks.includes('exponent')?[['square',learningLabel('Dacă sunt puteri: x2 → x²','If these are powers: x2 → x²')]]:[]),
    ...(risks.includes('radical')?[['radical',learningLabel('Dacă sunt radicali: V5 → √5','If these are roots: V5 → √5')]]:[])
   ]){
    const action=document.createElement('button');
    action.type='button';action.className='secondary-btn';
    action.style.cssText='min-height:42px;flex:1 1 auto;padding:8px 12px;white-space:normal;';
    action.textContent=title;
    action.onclick=()=>{
     candidateInput.value=mathPhotoOcrApplyCorrection(candidateInput.value,kind);
     refreshMathPhotoCorrections();
    };
    correctionActions.append(action);
   }
  };
  candidateInput.addEventListener('input',refreshMathPhotoCorrections);
  content.append(candidateInput,correctionActions,feedback);
  const footer=document.createElement('div');
  footer.style.cssText='flex:0 0 auto;padding:12px 16px;border-top:1px solid #467f98;background:#102f43;';
  const confirmation=document.createElement('button');confirmation.type='button';confirmation.className='primary-btn';
  confirmation.style.cssText='width:100%;min-height:44px;';
  confirmation.textContent=learningLabel('Confirmă exercițiul','Confirm exercise');
  confirmation.onclick=()=>{
   const candidate=candidateInput.value.trim();
   if(mathPhotoOcrRisk(candidate)){
    feedback.textContent=mathPhotoOcrRiskWarning(candidate);
    return;
   }
   if(educationMathOcrIncomplete(candidate)||candidate.length>240||candidate.split('\\n').length>3){
    feedback.textContent=learningLabel('Introdu un singur enunț complet și verificat.','Enter one complete, verified problem.');
    return;
   }
   editor.value=candidate;
   mathPhotoNeedsReview=false;mathRememberDraft(candidate);
   status.textContent=learningLabel('Exercițiu confirmat. Alege Rezolvare, Grafic sau Metodă.','Exercise confirmed. Choose Solve, Graph or Method.');
   dialog.close();
  };
  footer.append(confirmation);frame.append(header,content,footer);dialog.append(frame);
  dialog.addEventListener('close',()=>{
   if(mathVisionCapture){const active=mathVisionCapture;mathVisionCapture=null;active.reject(new Error('cancelled'));}
   dialog.remove();
   if(mathPhotoNeedsReview)status.textContent=learningLabel('Fotografia nu este confirmată. Repetă fotografia pentru verificare.','Photo not confirmed. Retake it to review.');
  });
  document.body.append(dialog);
  try{dialog.showModal()}catch(_){dialog.setAttribute('open','')}
  status.textContent=learningLabel('Fotografia necesită verificare într-o fereastră separată.','Photo needs review in a separate dialog.');
  return;
 }
 const host=$('moduleContent');host.querySelector('.education-photo-panel')?.remove();
 const panel=document.createElement('div');panel.className='education-photo-panel';
 const status=document.createElement('p');
 const mathOcr=activeLearningSubject[0]==='math';
 const preliminary=data?.status==='review'||data?.status==='partial';
 status.textContent=preliminary?
  (data?.status==='partial'?learningLabel('Formula nu a fost recunoscută complet. Corectează transcrierea sau repetă fotografia.','The formula was not fully recognized. Correct the transcription or retake the photo.'):
   learningLabel('Citire preliminară, neverificată: compară fiecare cifră și simbol cu fotografia.','Unverified preliminary reading: compare every digit and symbol against the photograph.')):
  data?.status==='success'?learningLabel('Text citit pe telefon. Verifică și corectează înainte de trimitere.','Text recognized on device. Review and correct before sending.'):
  learningLabel('Recunoașterea textului a eșuat. Poți introduce textul manual.','Text recognition failed. You may enter text manually.');
 const extracted=document.createElement('textarea');extracted.rows=6;extracted.value=typeof data?.text==='string'?data.text.slice(0,12000):'';
 extracted.placeholder=learningLabel('Textul recunoscut sau corectat','Recognized or corrected text');
 let alternative=(mathOcr&&typeof data?.alternative==='string'&&data.alternative.trim()!==extracted.value.trim())?data.alternative.trim():'';
 const altButton=document.createElement('button');altButton.type='button';altButton.className='secondary-btn';
 altButton.textContent=learningLabel('Vezi varianta OCR alternativă','See alternate OCR reading');
 altButton.onclick=()=>{
  const previous=extracted.value;extracted.value=alternative;alternative=previous;
  // Either variant requires a human check before solving.
  updateMathButton();
 };
 const options=document.createElement('select');options.className='text-field';
 options.setAttribute('aria-label',learningLabel('Acțiune pentru textul fotografiat','Action for photographed text'));
 [['solve',learningLabel('Explică și rezolvă','Explain and solve')],...(activeLearningSubject[0]==='math'?[['graph',learningLabel('Analizează și reprezintă grafic','Analyze and plot')]]:[]),['translate',learningLabel('Tradu textul','Translate text')],['read',learningLabel('Citește cu voce tare','Read aloud')]].forEach(([value,label])=>{
  const option=document.createElement('option');option.value=value;option.textContent=label;options.append(option);
 });
 const button=document.createElement('button');button.type='button';button.className='primary-btn';button.textContent=learningLabel('Continuă','Continue');
 const updateMathButton=()=>{
  const invalid=mathOcr&&educationMathOcrIncomplete(extracted.value);
  button.disabled=invalid;
  button.title=invalid?learningLabel('Corectează mai întâi expresia incompletă.','Correct the incomplete expression first.'):'';
 };
 extracted.addEventListener('input',updateMathButton);
 updateMathButton();
 button.onclick=()=>{
  const text=extracted.value.trim();
  if(!text){notify(learningLabel('Nu există text de prelucrat.','No text to process.'));return}
  if(options.value==='read'){if(pocketNativeVoiceAvailable()){speakText(text);return}if('speechSynthesis' in window){speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.lang=state.language;speechSynthesis.speak(voice)}else notify(learningLabel('Citirea vocală nu este disponibilă.','Text-to-speech unavailable.'));return}
  inputEl.value=(options.value==='translate'?learningLabel('Tradu în limba selectată următorul text: ','Translate into the selected language: '):options.value==='graph'?learningLabel('Verifică mai întâi transcrierea matematică, mai ales semnele, fracțiile și exponenții. Dacă este ambiguă, cere clarificare. Apoi analizează funcția, construiește un tabel de valori și reprezint-o grafic numai dacă există un renderer disponibil; altfel oferă instrucțiuni exacte de trasare: ','First verify the mathematical transcription, especially signs, fractions and exponents. Ask for clarification if ambiguous. Then analyze the function, build a value table and plot only when a renderer is available; otherwise provide exact plotting instructions: '):learningLabel('Verifică mai întâi transcrierea și cere clarificări pentru simbolurile incerte. Explică și rezolvă pas cu pas pentru materia ','First check the transcription and ask about uncertain symbols. Explain and solve step by step for ')+learningLabel(activeLearningSubject[2],activeLearningSubject[3])+': ')+text;
  /* Text entry stays unfocused until the input itself is tapped. */notify(learningLabel('Textul este pregătit pentru trimitere.','Text ready to send.'));
 };
 panel.append(status,extracted);
 if(alternative){panel.append(altButton);}
 panel.append(options,button);host.append(panel);
};
async function handleLearningPhoto(file){
 if(!file||!activeLearningSubject)return;
 if(!file.type.startsWith('image/')){notify(learningLabel('Selectează o imagine.','Select an image.'));return}
 if(file.size>12*1024*1024){notify(learningLabel('Imaginea este prea mare (max. 12 MB).','Image too large (max. 12 MB).'));return}
 if(activeLearningSubject[0]==='math'){
  const status=$('mathEducationStatus');if(status)status.textContent=learningLabel('Se citește imaginea…','Reading image…');
  let src='';
  try{
   if(typeof TextDetector!=='function')throw new Error('unsupported');
   src=URL.createObjectURL(file);
   const image=new Image();image.src=src;await image.decode();
   const detector=new TextDetector(),lines=await detector.detect(image);
   window.pocketAndroidOcrResult({status:lines?.length?'review':'partial',text:(lines||[]).map(line=>line.rawValue||'').join('\\n')});
  }catch{window.pocketAndroidOcrResult({status:'partial',text:''})}
  finally{if(src)URL.revokeObjectURL(src)}
  return;
 }
 const host=$('moduleContent');
 host.querySelector('.education-photo-panel')?.remove();
 const panel=document.createElement('div');panel.className='education-photo-panel';
 const preview=document.createElement('img');preview.alt=learningLabel('Fotografia selectată','Selected photograph');preview.src=URL.createObjectURL(file);
 preview.onload=()=>URL.revokeObjectURL(preview.src);
 const status=document.createElement('p');status.textContent=learningLabel('Se încearcă citirea textului din fotografie…','Attempting to read the photograph…');
 const extracted=document.createElement('textarea');extracted.rows=4;extracted.placeholder=learningLabel('Transcrie sau corectează aici textul fotografiat.','Type or correct the photographed text here.');
 const task=document.createElement('select');task.className='text-field';
 task.setAttribute('aria-label',learningLabel('Acțiune pentru textul fotografiat','Action for photographed text'));
 const choices=[[learningLabel('Explică și rezolvă','Explain and solve'),'solve'],[learningLabel('Tradu textul','Translate text'),'translate']];
 choices.forEach(([label,value])=>{const option=document.createElement('option');option.value=value;option.textContent=label;task.append(option)});
 const submit=document.createElement('button');submit.type='button';submit.className='primary-btn';submit.textContent=learningLabel('Folosește textul','Use text');
 submit.onclick=()=>{
  const content=extracted.value.trim();
  if(!content){notify(learningLabel('Introdu textul din fotografie pentru a continua.','Enter the photographed text to continue.'));return}
  inputEl.value=(task.value==='translate'?learningLabel('Tradu următorul text în limba selectată și explică termenii dificili:\\n','Translate the following text into the selected language:\\n'):learningLabel('Explică și rezolvă pas cu pas următorul exercițiu din materia ','Explain and solve this exercise step by step for ')+learningLabel(activeLearningSubject[2],activeLearningSubject[3])+':\\n')+content;
  /* Text entry stays unfocused until the input itself is tapped. */notify(learningLabel('Textul este pregătit. Verifică-l și trimite întrebarea.','Text ready. Review and send your question.'));
 };
 panel.append(preview,status,extracted,task,submit);host.append(panel);
 try {
  if(typeof TextDetector!=='function')throw new Error('ocr_unavailable');
  const detector=new TextDetector();
  await preview.decode();
  const lines=await detector.detect(preview);
  if(lines?.length){extracted.value=lines.map(x=>x.rawValue||'').join('\\n');status.textContent=learningLabel('Text recunoscut. Verifică-l înainte de trimitere.','Text detected. Check it before sending.')}
  else status.textContent=learningLabel('Textul nu a putut fi recunoscut. Îl poți introduce manual.','Text could not be detected. You can type it manually.');
 } catch {status.textContent=learningLabel('Recunoașterea automată nu este disponibilă aici. Introdu textul manual.','Automatic text recognition is not available here. Enter the text manually.')}
}
function openModule(key){mathVoiceStop();mathCloseResults();document.querySelector('main.page')?.classList.remove('math-keyboard-visible','science-keyboard-visible');document.querySelector('main.page')?.style.removeProperty('--math-content-height');document.querySelector('main.page')?.style.removeProperty('--science-content-height');$('view-module').classList.remove('learning-math','learning-science','science-choice-stage');document.getElementById('mathEducationReturn')?.remove();if(state.busy){notify('Așteaptă să se termine răspunsul curent.');return}if((state.currentView==='module'||state.currentView==='assistant')&&state.messages.length)archiveCurrentConversation();if(state.currentView==='module'||state.currentView==='assistant')resetChat();state.currentModule=key;$('view-module').classList.remove('learning-choose','learning-active','organize-choose','organize-active','organize-chat','extra-tools-choose','extra-tools-active','extra-tools-chat','tasks-workspace','adaptive-workspace-view');activeLearningSubject=null;inputEl.placeholder='';if(key==='assistant'){showView('assistant');return}const m=MODULES[key];if(!m){notify('Acest modul nu este disponibil.');return}$('moduleTitle').textContent=(UI_TEXT[state.language]?.moduleTitle?.[key]||m.title);$('moduleLead').textContent=localizedModuleLead(key);$('moduleContent').innerHTML='';const trigger=$('moduleQuickTrigger');trigger.style.display=(key==='maps'||key==='travel')?'inline-flex':'none';$('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');state.moduleSearchBusy=false;state.moduleSearchResults=[];state.moduleSearchCategory=null;state.moduleSearchReply='';showView('module');if(key==='learning')renderLearningSubjects();if(key==='organize')renderOrganizeChoices();if(key==='tools')renderExtraToolsChoices();}
const MODULE_QUICK_CHOICES={maps:[{icon:'🧭',title:'Deplasare spre…',description:'Caută o călătorie cu transport mixt',prompt:'',kind:'transit',mixedJourney:true},{icon:'🚶',title:'Traseu pietonal',prompt:'Vreau un traseu pietonal.',kind:'walking'},{icon:'🚌',title:'Transport public',prompt:'Ajută-mă să găsesc opțiuni de transport public pornind de la locația mea. Întreabă-mă destinația dacă lipsește.',kind:'transit'},{icon:'⛽',title:'Benzinării',prompt:'Găsește benzinării în apropierea mea.',kind:'places'},{icon:'🚿',title:'Spălătorii auto',prompt:'Găsește spălătorii auto în apropierea mea.',kind:'places'},{icon:'🅿️',title:'Parcări',prompt:'Găsește parcări în apropierea mea.',kind:'places'},{icon:'🏛️',title:'Muzee',prompt:'Găsește muzee în apropierea mea.',kind:'places'},{icon:'🌳',title:'Parcuri',prompt:'Găsește parcuri în apropierea mea.',kind:'places'},{icon:'🦁',title:'Grădini zoologice',prompt:'Găsește grădini zoologice sau zoo în apropierea mea.',kind:'places'}],travel:[{icon:'🍔',title:'Fast-food și mâncare la pachet',prompt:'Caută fast-food-uri, kebab și takeaway în apropierea mea.',kind:'places',description:'Fast-food, burger, kebab și takeaway'},{icon:'🍽️',title:'Restaurante și localuri cu mâncare',prompt:'Caută restaurante, pizzerii, shaormerii și fast-food în apropierea mea.',kind:'places',description:'Caută restaurante, pub-uri, pizzerii, shaormerii și fast-food'},{icon:'☕',title:'Cofetării',prompt:'Caută cofetării, patiserii, gelaterii și magazine de prăjituri în apropierea mea.',kind:'places',description:'Caută cofetării, patiserii, gelaterii și magazine de prăjituri'},{icon:'🏨',title:'Hoteluri',prompt:'Găsește hoteluri și hosteluri în apropierea mea.',kind:'places',description:'Caută hoteluri și hosteluri'},{icon:'💊',title:'Farmacii',prompt:'Caută farmacii, drogherii și magazine naturiste în apropierea mea.',kind:'places',description:'Caută farmacii, drogherii și magazine naturiste'},{icon:'🏪',title:'Băcănii și magazine mici',prompt:'Găsește băcănii și magazine mici de proximitate în apropierea mea.',kind:'places',description:'Magazine alimentare mici și de cartier'},{icon:'🛒',title:'Marketuri și brutării',prompt:'Caută supermarketuri, marketuri, magazine alimentare și brutării în apropierea mea.',kind:'places',description:'Caută supermarketuri, magazine alimentare și brutării'},{icon:'🍵',title:'Baruri, ceainării și cafenele',prompt:'Caută baruri, puburi, ceainării și cafenele în apropierea mea.',kind:'places',description:'Caută baruri, puburi, ceainării și cafenele'},{icon:'📍',title:'Alte puncte de interes',prompt:'Găsește alte puncte de interes în apropierea mea.',kind:'places',description:'Caută alte puncte de interes din apropiere'}]};
function updateQuickLayerGeometry(){
 const header=document.querySelector('.app-header'),nav=document.querySelector('.bottom-nav');
 const top=header?Math.ceil(header.getBoundingClientRect().bottom+6):90;
 const bottom=nav?Math.ceil(window.innerHeight-nav.getBoundingClientRect().top+6):100;
 const layer=$('moduleQuickLayer');
 if(layer){layer.style.setProperty('--quick-top',Math.max(0,top)+'px');layer.style.setProperty('--quick-bottom',Math.max(0,bottom)+'px')}
}
window.addEventListener('resize',updateQuickLayerGeometry,{passive:true});
window.addEventListener('orientationchange',updateQuickLayerGeometry,{passive:true});
function openModuleQuickLayer(){state.navigationReturnContext=null;state.lastQuickPlace=null;updateQuickLayerGeometry();if(state.currentModule!=='maps'&&state.currentModule!=='travel')return;state.moduleSearchCategory=null;state.moduleSearchResults=[];state.moduleSearchReply='';$('moduleLayerTitle').textContent=(UI_TEXT[state.language]?.quickTitle||'Selecții rapide');renderModuleQuickChoices();$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false')}
function quickUiText(){const L=state.language;const T={
ro:{descPlaces:'Caută în apropiere și afișează numele și distanța.',descTransit:'Transport public: mers pe jos, autobuz, tren sau metrou, în funcție de datele disponibile.',descWalking:'Numai mers pe jos; fără mașină, taxi, bicicletă sau transport public.',searching:'Se caută',nearby:'în apropiere…',notFound:'Nu au fost găsite locații pentru această căutare. Încearcă din nou mai târziu.',found:'Locuri găsite',results:'rezultate · date de hartă',back:'Înapoi la selecții rapide',details:'selectează pentru detalii',category:'Categorie',unspecified:'Nespecificată',distance:'Distanță',openMap:'Deschide pe hartă',backResults:'← Înapoi la rezultate',noLocations:'Locația nu a putut fi identificată.',location:'Locație',coordinates:'Coordonate',placeDetails:'Detalii locație'},
en:{descPlaces:'Find nearby places and show their names and distances.',descTransit:'Public transport: walking, bus, train or underground, depending on available data.',descWalking:'Walking only; no car, taxi, bicycle or public transport.',searching:'Searching for',nearby:'nearby…',notFound:'No places were found for this search. Please try again.',found:'Places found',results:'results · map data',back:'Back to quick options',details:'select for details',category:'Category',unspecified:'Not specified',distance:'Distance',openMap:'Open map',backResults:'← Back to results',noLocations:'The location could not be identified.',location:'Place',coordinates:'Coordinates',placeDetails:'Place details'},
fr:{descPlaces:'Rechercher des lieux à proximité et afficher leur nom et leur distance.',descTransit:'Transports publics : marche, bus, train ou métro selon les données disponibles.',descWalking:'À pied uniquement ; sans voiture, taxi, vélo ni transports publics.',searching:'Recherche de',nearby:'à proximité…',notFound:'Aucun lieu trouvé. Veuillez réessayer.',found:'Lieux trouvés',results:'résultats · données cartographiques',back:'Retour aux options rapides',details:'sélectionner pour les détails',category:'Catégorie',unspecified:'Non précisée',distance:'Distance',openMap:'Ouvrir la carte',backResults:'← Retour aux résultats',noLocations:'La position n’a pas pu être identifiée.',location:'Lieu',coordinates:'Coordonnées',placeDetails:'Détails du lieu'},
de:{descPlaces:'Orte in der Nähe mit Namen und Entfernung suchen.',descTransit:'Öffentliche Verkehrsmittel: zu Fuß, Bus, Zug oder U-Bahn – je nach verfügbaren Daten.',descWalking:'Nur zu Fuß; kein Auto, Taxi, Fahrrad oder öffentlicher Verkehr.',searching:'Suche',nearby:'in der Nähe…',notFound:'Keine Orte gefunden. Bitte erneut versuchen.',found:'Gefundene Orte',results:'Ergebnisse · Kartendaten',back:'Zurück zu den Schnelloptionen',details:'für Details auswählen',category:'Kategorie',unspecified:'Nicht angegeben',distance:'Entfernung',openMap:'Karte öffnen',backResults:'← Zurück zu den Ergebnissen',noLocations:'Der Standort konnte nicht ermittelt werden.',location:'Ort',coordinates:'Koordinaten',placeDetails:'Ortsdetails'},
it:{descPlaces:'Cerca luoghi vicini e mostra nomi e distanze.',descTransit:'Trasporto pubblico: a piedi, autobus, treno o metropolitana, secondo i dati disponibili.',descWalking:'Solo a piedi; niente auto, taxi, bicicletta o trasporto pubblico.',searching:'Ricerca di',nearby:'nelle vicinanze…',notFound:'Nessun luogo trovato. Riprova.',found:'Luoghi trovati',results:'risultati · dati mappa',back:'Torna alle opzioni rapide',details:'seleziona per i dettagli',category:'Categoria',unspecified:'Non specificata',distance:'Distanza',openMap:'Apri mappa',backResults:'← Torna ai risultati',noLocations:'Non è stato possibile identificare la posizione.',location:'Luogo',coordinates:'Coordinate',placeDetails:'Dettagli del luogo'},
es:{descPlaces:'Busca lugares cercanos y muestra sus nombres y distancias.',descTransit:'Transporte público: a pie, autobús, tren o metro, según los datos disponibles.',descWalking:'Solo a pie; sin coche, taxi, bicicleta ni transporte público.',searching:'Buscando',nearby:'cerca…',notFound:'No se encontraron lugares. Inténtalo de nuevo.',found:'Lugares encontrados',results:'resultados · datos del mapa',back:'Volver a las opciones rápidas',details:'selecciona para ver detalles',category:'Categoría',unspecified:'No especificada',distance:'Distancia',openMap:'Abrir mapa',backResults:'← Volver a los resultados',noLocations:'No se pudo identificar la ubicación.',location:'Lugar',coordinates:'Coordenadas',placeDetails:'Detalles del lugar'},
pt:{descPlaces:'Procura locais próximos e apresenta nomes e distâncias.',descTransit:'Transportes públicos: a pé, autocarro, comboio ou metro, conforme os dados disponíveis.',descWalking:'Apenas a pé; sem carro, táxi, bicicleta ou transportes públicos.',searching:'A procurar',nearby:'nas proximidades…',notFound:'Não foram encontrados locais. Tenta novamente.',found:'Locais encontrados',results:'resultados · dados do mapa',back:'Voltar às opções rápidas',details:'seleciona para ver detalhes',category:'Categoria',unspecified:'Não especificada',distance:'Distância',openMap:'Abrir mapa',backResults:'← Voltar aos resultados',noLocations:'Não foi possível identificar a localização.',location:'Local',coordinates:'Coordenadas',placeDetails:'Detalhes do local'},
nl:{descPlaces:'Zoek locaties in de buurt en toon namen en afstanden.',descTransit:'Openbaar vervoer: lopen, bus, trein of metro, afhankelijk van beschikbare gegevens.',descWalking:'Alleen lopen; geen auto, taxi, fiets of openbaar vervoer.',searching:'Zoeken naar',nearby:'in de buurt…',notFound:'Geen locaties gevonden. Probeer het opnieuw.',found:'Gevonden locaties',results:'resultaten · kaartgegevens',back:'Terug naar snelle opties',details:'selecteer voor details',category:'Categorie',unspecified:'Niet opgegeven',distance:'Afstand',openMap:'Kaart openen',backResults:'← Terug naar resultaten',noLocations:'De locatie kon niet worden vastgesteld.',location:'Locatie',coordinates:'Coördinaten',placeDetails:'Locatiedetails'}
 ,ru:{"descPlaces":"Найдите места поблизости, их названия и расстояния.","descTransit":"Общественный транспорт: пешком, автобус, поезд или метро.","descWalking":"Только пешком, без автомобиля, такси и транспорта.","searching":"Поиск","nearby":"поблизости…","notFound":"Места не найдены. Попробуйте позже.","found":"Найденные места","results":"результатов · данные карты","back":"Назад к быстрому выбору","details":"нажмите для подробностей","category":"Категория","unspecified":"Не указано","distance":"Расстояние","openMap":"Открыть карту","backResults":"← Назад к результатам","noLocations":"Не удалось определить местоположение.","location":"Местоположение","coordinates":"Координаты","placeDetails":"Сведения о месте"},pl:{"descPlaces":"Znajdź pobliskie miejsca, ich nazwy i odległości.","descTransit":"Transport publiczny: pieszo, autobus, pociąg lub metro.","descWalking":"Tylko pieszo, bez samochodu, taksówki i transportu.","searching":"Wyszukiwanie","nearby":"w pobliżu…","notFound":"Nie znaleziono miejsc. Spróbuj ponownie później.","found":"Znalezione miejsca","results":"wyników · dane mapy","back":"Wróć do szybkiego wyboru","details":"wybierz, aby zobaczyć szczegóły","category":"Kategoria","unspecified":"Nie określono","distance":"Odległość","openMap":"Otwórz mapę","backResults":"← Wróć do wyników","noLocations":"Nie udało się ustalić lokalizacji.","location":"Lokalizacja","coordinates":"Współrzędne","placeDetails":"Szczegóły miejsca"}};return T[L]||T.en}
function renderModuleQuickChoices(){document.querySelector('.module-quick-sheet')?.classList.remove('details-mode');state.moduleSearchReturnMode='root';$('moduleLayerBody').style.cssText='';$('moduleLayerTitle').textContent=UI_TEXT[state.language]?.quickTitle||'Selecții rapide';document.querySelector('.module-quick-sheet')?.classList.remove('results-mode');const body=$('moduleLayerBody');body.innerHTML='';const choices=MODULE_QUICK_CHOICES[state.currentModule]||[];const t=quickUiText();choices.forEach(choice=>{const button=document.createElement('button');button.type='button';button.className='module-result-card';const strong=document.createElement('strong');strong.textContent=choice.icon+'  '+localizedQuickChoiceTitle(choice);const small=document.createElement('small');small.textContent=state.language==='ro'?(choice.description||('Caută '+localizedQuickChoiceTitle(choice).toLowerCase())):choice.kind==='places'?({'en':'Search for ','fr':'Rechercher ','de':'Suche nach ','it':'Cerca ','es':'Busca ','pt':'Procura ','nl':'Zoek naar ','ru':'Поиск: ','pl':'Szukaj: '}[state.language]||'Search for ')+localizedQuickChoiceTitle(choice).toLowerCase():choice.kind==='transit'?t.descTransit:choice.kind==='walking'?t.descWalking:t.descPlaces;button.append(strong,small);button.addEventListener('click',()=>{if(choice.mixedJourney){showJourneyMode(choice)}else if(choice.kind==='transit'){showTransitDestination(choice)}else if(choice.kind==='walking'){$('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');resetChat();inputEl.value=localizedQuickPrompt(choice);submitMessage()}else runModuleSearch(choice)});body.append(button)})}
function localizedQuickChoiceTitle(choice){if(choice.mixedJourney)return ({ro:'Deplasare spre…',en:'Travel to…',fr:'Aller à…',de:'Reisen nach…',it:'Vai a…',es:'Viajar a…',pt:'Viajar para…',nl:'Reizen naar…',ru:'Поездка в…',pl:'Podróż do…'})[state.language]||'Travel to…';const maps={
'en':{'Fast-food și mâncare la pachet':'Fast food and takeaway','Băcănii și magazine mici':'Groceries and corner shops','Baruri, ceainării și cafenele':'Bars, tea rooms and cafés','Muzee':'Museums','Parcuri':'Parks','Grădini zoologice':'Zoos','Traseu pietonal':'Walking route','Transport public':'Public transport','Benzinării':'Petrol stations','Spălătorii auto':'Car washes','Parcări':'Parking','Restaurante și localuri cu mâncare':'Restaurants and food pubs','Cofetării':'Cafés and bakeries','Hoteluri':'Hotels','Alte puncte de interes':'Other points of interest'},
'fr':{'Fast-food și mâncare la pachet':'Restauration rapide et plats à emporter','Băcănii și magazine mici':'Épiceries et petits commerces','Baruri, ceainării și cafenele':'Bars, salons de thé et cafés','Muzee':'Musées','Parcuri':'Parcs','Grădini zoologice':'Zoos','Traseu pietonal':'Itinéraire à pied','Transport public':'Transports publics','Benzinării':'Stations-service','Spălătorii auto':'Stations de lavage','Parcări':'Parkings','Restaurante și localuri cu mâncare':'Restaurants','Cofetării':'Pâtisseries','Hoteluri':'Hôtels','Alte puncte de interes':'Autres points d’intérêt'},
'de':{'Fast-food și mâncare la pachet':'Fast Food und Imbiss','Băcănii și magazine mici':'Lebensmittel- und kleine Läden','Baruri, ceainării și cafenele':'Bars, Teestuben und Cafés','Muzee':'Museen','Parcuri':'Parks','Grădini zoologice':'Zoos','Traseu pietonal':'Fußweg','Transport public':'Öffentliche Verkehrsmittel','Benzinării':'Tankstellen','Spălătorii auto':'Autowaschanlagen','Parcări':'Parkplätze','Restaurante și localuri cu mâncare':'Restaurants und Gaststätten','Cofetării':'Cafés und Bäckereien','Hoteluri':'Hotels','Alte puncte de interes':'Weitere Sehenswürdigkeiten'},
'it':{'Fast-food și mâncare la pachet':'Fast food e asporto','Băcănii și magazine mici':'Alimentari e piccoli negozi','Baruri, ceainării și cafenele':'Bar, sale da tè e caffè','Muzee':'Musei','Parcuri':'Parchi','Grădini zoologice':'Zoo','Traseu pietonal':'Percorso a piedi','Transport public':'Trasporto pubblico','Benzinării':'Stazioni di servizio','Spălătorii auto':'Autolavaggi','Parcări':'Parcheggi','Restaurante și localuri cu mâncare':'Ristoranti e pub','Cofetării':'Pasticcerie','Hoteluri':'Hotel','Alte puncte de interes':'Altri punti di interesse'},
'es':{'Fast-food și mâncare la pachet':'Comida rápida y para llevar','Băcănii și magazine mici':'Tiendas de alimentación pequeñas','Baruri, ceainării și cafenele':'Bares, salones de té y cafeterías','Muzee':'Museos','Parcuri':'Parques','Grădini zoologice':'Zoológicos','Traseu pietonal':'Ruta a pie','Transport public':'Transporte público','Benzinării':'Gasolineras','Spălătorii auto':'Lavados de coches','Parcări':'Aparcamientos','Restaurante și localuri cu mâncare':'Restaurantes y pubs','Cofetării':'Pastelerías','Hoteluri':'Hoteles','Alte puncte de interes':'Otros puntos de interés'},
'pt':{'Fast-food și mâncare la pachet':'Comida rápida e takeaway','Băcănii și magazine mici':'Mercearias e pequenas lojas','Baruri, ceainării și cafenele':'Bares, casas de chá e cafés','Muzee':'Museus','Parcuri':'Parques','Grădini zoologice':'Jardins zoológicos','Traseu pietonal':'Percurso pedonal','Transport public':'Transportes públicos','Benzinării':'Postos de combustível','Spălătorii auto':'Lavagens automóveis','Parcări':'Estacionamentos','Restaurante și localuri cu mâncare':'Restaurantes e pubs','Cofetării':'Pastelarias','Hoteluri':'Hotéis','Alte puncte de interes':'Outros pontos de interesse'},
'ru':{'Fast-food și mâncare la pachet':'Фастфуд и еда навынос','Băcănii și magazine mici':'Продуктовые и небольшие магазины','Baruri, ceainării și cafenele':'Бары, чайные и кафе','Muzee':'Музеи','Parcuri':'Парки','Grădini zoologice':'Зоопарки',"Traseu pietonal":"Пеший маршрут","Transport public":"Общественный транспорт","Benzinării":"Заправки","Spălătorii auto":"Автомойки","Parcări":"Парковки","Restaurante și pub-uri cu mâncare":"Рестораны и пабы с едой","Cofetării":"Кондитерские и пекарни","Hoteluri":"Отели","Alte puncte de interes":"Другие интересные места"},
'pl':{'Fast-food și mâncare la pachet':'Fast food i jedzenie na wynos','Băcănii și magazine mici':'Sklepy spożywcze i osiedlowe','Baruri, ceainării și cafenele':'Bary, herbaciarnie i kawiarnie','Muzee':'Muzea','Parcuri':'Parki','Grădini zoologice':'Ogrody zoologiczne',"Traseu pietonal":"Trasa piesza","Transport public":"Transport publiczny","Benzinării":"Stacje paliw","Spălătorii auto":"Myjnie samochodowe","Parcări":"Parkingi","Restaurante și pub-uri cu mâncare":"Restauracje i puby z jedzeniem","Cofetării":"Cukiernie i piekarnie","Hoteluri":"Hotele","Alte puncte de interes":"Inne ciekawe miejsca"},
'nl':{'Fast-food și mâncare la pachet':'Fastfood en afhaalmaaltijden','Băcănii și magazine mici':'Buurtwinkels en kleine supermarkten','Baruri, ceainării și cafenele':'Bars, theehuizen en cafés','Muzee':'Musea','Parcuri':'Parken','Grădini zoologice':'Dierentuinen','Traseu pietonal':'Wandelroute','Transport public':'Openbaar vervoer','Benzinării':'Tankstations','Spălătorii auto':'Autowasstraten','Parcări':'Parkeren','Restaurante și localuri cu mâncare':'Restaurants en pubs','Cofetării':'Cafés en bakkerijen','Hoteluri':'Hotels','Alte puncte de interes':'Andere bezienswaardigheden'}};return maps[state.language]?.[choice.title]||choice.title}
function localizedQuickPrompt(choice){if(state.language==='ro')return choice.prompt;const prompts={en:{walking:'I want a walking-only route. Ask for the start and destination if missing. Use GPS as the start only if I have granted permission. Do not include buses, trains, underground, cars, taxis or bicycles. Only show routes and steps supplied by a real routing service; do not invent distances, durations or alternatives.',transit:'Help me find public transport options starting from my location. Ask for the destination if it is missing.'},fr:{walking:'Je veux un itinéraire uniquement à pied. Demandez le départ et la destination s’ils manquent. N’incluez aucun autre moyen de transport.',transit:'Aidez-moi à trouver des transports publics depuis ma position. Demandez la destination si elle manque.'},de:{walking:'Ich möchte eine reine Fußwegroute. Frage nach Start und Ziel, falls sie fehlen. Keine anderen Verkehrsmittel einbeziehen.',transit:'Finde öffentliche Verkehrsmittel ab meinem Standort. Frage nach dem Ziel, falls es fehlt.'},it:{walking:'Voglio un percorso esclusivamente a piedi. Chiedi partenza e destinazione se mancanti. Non includere altri mezzi.',transit:'Aiutami a trovare i mezzi pubblici dalla mia posizione. Chiedi la destinazione se manca.'},es:{walking:'Quiero una ruta solo a pie. Pregunta el origen y destino si faltan. No incluyas otros medios de transporte.',transit:'Ayúdame a encontrar transporte público desde mi ubicación. Pregunta el destino si falta.'},pt:{walking:'Quero um percurso exclusivamente a pé. Pergunta a origem e o destino se faltarem. Não incluas outros transportes.',transit:'Ajuda-me a encontrar transportes públicos a partir da minha localização. Pergunta o destino se faltar.'},nl:{walking:'Ik wil alleen een wandelroute. Vraag om vertrekpunt en bestemming als die ontbreken. Neem geen ander vervoer op.',transit:'Help me openbaar vervoer te vinden vanaf mijn locatie. Vraag naar de bestemming als die ontbreekt.'}};return prompts[state.language]?.[choice.kind]||choice.prompt}

function setModuleLayerMode(title){$('moduleLayerTitle').textContent=title;$('moduleLayerBody').innerHTML=''}
function moduleStatus(text){document.querySelector('.module-quick-sheet')?.classList.remove('results-mode');const body=$('moduleLayerBody');body.innerHTML='';const status=document.createElement('div');status.className='module-search-status';status.setAttribute('role','status');status.textContent=text;body.append(status)}
function formatDistance(meters){const n=Number(meters);if(!Number.isFinite(n)||n<0)return ({ro:'Distanță indisponibilă',en:'Distance unavailable',fr:'Distance indisponible',de:'Entfernung nicht verfügbar',it:'Distanza non disponibile',es:'Distancia no disponible',pt:'Distância indisponível',nl:'Afstand niet beschikbaar',ru:'Расстояние неизвестно',pl:'Odległość niedostępna'})[state.language]||'Distance unavailable';if(n<1000)return Math.round(n)+' m';return (n/1000).toLocaleString(({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'})[state.language]||'en-GB',{maximumFractionDigits:1})+' km'}
function placeResultIcon(place){const value=(String(place.type||'')+' '+String(place.name||'')).toLowerCase();if(/petrol|fuel|gas station|benzin|esso|shell|texaco|costco fuel/.test(value))return '⛽';if(/restaurant|cafe|coffee|food|restaurant|restaurant|takeaway|pub|bar/.test(value))return '🍽️';if(/hotel|motel|guest.?house|accommodation/.test(value))return '🏨';if(/supermarket|grocery|shop|store|market/.test(value))return '🛒';if(/bus stop|bus station|train station|railway|metro|underground/.test(value))return '🚉';if(/hospital|clinic|doctor|pharmacy/.test(value))return '🏥';if(/parking|car park/.test(value))return '🅿️';if(/toilet|restroom/.test(value))return '🚻';if(/car wash|wash/.test(value))return '🚿';return '📍'}
function localizedPlaceCategory(value){const raw=String(value||'').trim();if(!raw)return quickUiText().found;const key=raw.toLowerCase().replace(/[_-]+/g,' ').replace(/\\s+/g,' ').trim();const dictionaries={
ro:{parking:'parcare',park:'parcare',restaurant:'restaurant',pub:'pub',bar:'bar',cafe:'cafenea',café:'cafenea',fast_food:'fast-food','fast food':'fast-food',food_court:'zonă de restaurante','food court':'zonă de restaurante',hotel:'hotel',hostel:'hostel',fuel:'benzinărie',gas_station:'benzinărie','gas station':'benzinărie',car_wash:'spălătorie auto','car wash':'spălătorie auto',shop:'magazin',supermarket:'supermarket',convenience:'magazin de proximitate',bakery:'brutărie',pharmacy:'farmacie',hospital:'spital',clinic:'clinică',toilets:'toalete','bus stop':'stație de autobuz',bus_station:'autogară','train station':'gară',railway_station:'gară',museum:'muzeu',attraction:'atracție turistică',sweet_shop:"magazin de dulciuri",patisserie:"cofetărie",ice_cream:"gelaterie"},
en:{parking:'parking',park:'park',restaurant:'restaurant',pub:'pub',bar:'bar',cafe:'café',café:'café',fast_food:'fast food','fast food':'fast food',food_court:'food court','food court':'food court',hotel:'hotel',hostel:'hostel',fuel:'petrol station',gas_station:'gas station','gas station':'gas station',car_wash:'car wash','car wash':'car wash',shop:'shop',supermarket:'supermarket',convenience:'convenience store',bakery:'bakery',pharmacy:'pharmacy',hospital:'hospital',clinic:'clinic',toilets:'toilets','bus stop':'bus stop',bus_station:'bus station','train station':'train station',railway_station:'railway station',museum:'museum',attraction:'tourist attraction',sweet_shop:"sweet shop",patisserie:"patisserie",ice_cream:"ice cream parlour"},
fr:{parking:'parking',park:'parc',restaurant:'restaurant',pub:'pub',bar:'bar',cafe:'café',café:'café',fast_food:'restauration rapide','fast food':'restauration rapide',food_court:'espace de restauration','food court':'espace de restauration',hotel:'hôtel',hostel:'auberge',fuel:'station-service',gas_station:'station-service','gas station':'station-service',car_wash:'lavage auto','car wash':'lavage auto',shop:'magasin',supermarket:'supermarché',convenience:'épicerie',bakery:'boulangerie',pharmacy:'pharmacie',hospital:'hôpital',clinic:'clinique',toilets:'toilettes','bus stop':'arrêt de bus',bus_station:'gare routière','train station':'gare',railway_station:'gare',museum:'musée',attraction:'attraction touristique',sweet_shop:"confiserie",patisserie:"pâtisserie",ice_cream:"glacier"},
de:{parking:'Parkplatz',park:'Park',restaurant:'Restaurant',pub:'Pub',bar:'Bar',cafe:'Café',café:'Café',fast_food:'Fast Food','fast food':'Fast Food',food_court:'Food-Court','food court':'Food-Court',hotel:'Hotel',hostel:'Hostel',fuel:'Tankstelle',gas_station:'Tankstelle','gas station':'Tankstelle',car_wash:'Autowäsche','car wash':'Autowäsche',shop:'Geschäft',supermarket:'Supermarkt',convenience:'Minimarkt',bakery:'Bäckerei',pharmacy:'Apotheke',hospital:'Krankenhaus',clinic:'Klinik',toilets:'Toiletten','bus stop':'Bushaltestelle',bus_station:'Busbahnhof','train station':'Bahnhof',railway_station:'Bahnhof',museum:'Museum',attraction:'Sehenswürdigkeit',sweet_shop:"Süßwarengeschäft",patisserie:"Konditorei",ice_cream:"Eisdiele"},
it:{parking:'parcheggio',park:'parco',restaurant:'ristorante',pub:'pub',bar:'bar',cafe:'caffetteria',café:'caffetteria',fast_food:'fast food','fast food':'fast food',food_court:'area ristorazione','food court':'area ristorazione',hotel:'hotel',hostel:'ostello',fuel:'distributore',gas_station:'distributore','gas station':'distributore',car_wash:'autolavaggio','car wash':'autolavaggio',shop:'negozio',supermarket:'supermercato',convenience:'minimarket',bakery:'panetteria',pharmacy:'farmacia',hospital:'ospedale',clinic:'clinica',toilets:'servizi igienici','bus stop':'fermata autobus',bus_station:'stazione autobus','train station':'stazione ferroviaria',railway_station:'stazione ferroviaria',museum:'museo',attraction:'attrazione turistica',sweet_shop:"negozio di dolci",patisserie:"pasticceria",ice_cream:"gelateria"},
es:{parking:'aparcamiento',park:'parque',restaurant:'restaurante',pub:'pub',bar:'bar',cafe:'cafetería',café:'cafetería',fast_food:'comida rápida','fast food':'comida rápida',food_court:'zona de restauración','food court':'zona de restauración',hotel:'hotel',hostel:'hostal',fuel:'gasolinera',gas_station:'gasolinera','gas station':'gasolinera',car_wash:'lavado de coches','car wash':'lavado de coches',shop:'tienda',supermarket:'supermercado',convenience:'tienda de conveniencia',bakery:'panadería',pharmacy:'farmacia',hospital:'hospital',clinic:'clínica',toilets:'aseos','bus stop':'parada de autobús',bus_station:'estación de autobuses','train station':'estación de tren',railway_station:'estación de tren',museum:'museo',attraction:'atracción turística',sweet_shop:"tienda de dulces",patisserie:"pastelería",ice_cream:"heladería"},
pt:{parking:'estacionamento',park:'parque',restaurant:'restaurante',pub:'pub',bar:'bar',cafe:'café',café:'café',fast_food:'comida rápida','fast food':'comida rápida',food_court:'praça de alimentação','food court':'praça de alimentação',hotel:'hotel',hostel:'hostel',fuel:'posto de combustível',gas_station:'posto de combustível','gas station':'posto de combustível',car_wash:'lavagem automóvel','car wash':'lavagem automóvel',shop:'loja',supermarket:'supermercado',convenience:'loja de conveniência',bakery:'padaria',pharmacy:'farmácia',hospital:'hospital',clinic:'clínica',toilets:'casas de banho','bus stop':'paragem de autocarro',bus_station:'terminal rodoviário','train station':'estação ferroviária',railway_station:'estação ferroviária',museum:'museu',attraction:'atração turística',sweet_shop:"loja de doces",patisserie:"pastelaria",ice_cream:"gelataria"},
nl:{parking:'parkeren',park:'park',restaurant:'restaurant',pub:'pub',bar:'bar',cafe:'café',café:'café',fast_food:'fastfood','fast food':'fastfood',food_court:'foodcourt','food court':'foodcourt',hotel:'hotel',hostel:'hostel',fuel:'tankstation',gas_station:'tankstation','gas station':'tankstation',car_wash:'autowasstraat','car wash':'autowasstraat',shop:'winkel',supermarket:'supermarkt',convenience:'buurtwinkel',bakery:'bakkerij',pharmacy:'apotheek',hospital:'ziekenhuis',clinic:'kliniek',toilets:'toiletten','bus stop':'bushalte',bus_station:'busstation','train station':'treinstation',railway_station:'treinstation',museum:'museum',attraction:'bezienswaardigheid',sweet_shop:'snoepwinkel',patisserie:'banketbakkerij',ice_cream:'ijssalon'}};
const romanianAliases={"benzinărie": "fuel", "benzinarie": "fuel", "benzinării": "fuel", "benzinarii": "fuel", "stație de carburant": "fuel", "statie de carburant": "fuel", "stație de alimentare": "fuel", "spălătorie auto": "car_wash", "spalatorie auto": "car_wash", "spălătorii auto": "car_wash", "spalatorii auto": "car_wash", "spălătorie de mașini": "car_wash", "spalatorie de masini": "car_wash", "parcare": "parking", "parcări": "parking", "parcari": "parking", "loc de parcare": "parking", "restaurant": "restaurant", "cafenea": "cafe", "cofetărie": "patisserie", "cofetarie": "patisserie", "patiserie": "patisserie", "patiserii": "patisserie", "gelaterie": "ice_cream", "înghețată": "ice_cream", "inghetata": "ice_cream", "magazin de dulciuri": "sweet_shop", "magazin de bomboane": "sweet_shop", "cofetărie / patiserie / gelaterie": "patisserie", "hotel": "hotel", "pensiune": "hostel", "magazin": "shop", "magazine": "shop", "farmacie": "pharmacy", "farmacii": "pharmacy", "spital": "hospital", "stație de autobuz": "bus stop", "statie de autobuz": "bus stop", "autogară": "bus_station", "gară": "train station", "brutărie": "bakery", "brutarie": "bakery", "toalete": "toilets", "toaletă": "toilets", "muzeu": "museum", "atracție turistică": "attraction", "punct de interes": "attraction", "puncte de interes": "attraction", "sweet shop": "sweet_shop", "candy store": "sweet_shop", "confectionery": "sweet_shop", "pastry shop": "patisserie", "cake shop": "patisserie", "ice cream": "ice_cream", "ice cream shop": "ice_cream", "ice cream parlour": "ice_cream", "car wash": "car_wash", "gas station": "fuel", "petrol station": "fuel", "bus station": "bus_station", "train station": "train station", "fast food": "fast_food", "food court": "food_court", "bus stop": "bus stop"};
const extra={"ru": {"parking": "парковка", "park": "парк", "restaurant": "ресторан", "pub": "паб", "bar": "бар", "cafe": "кафе", "fast_food": "фастфуд", "food_court": "фуд-корт", "hotel": "отель", "hostel": "хостел", "fuel": "АЗС", "car_wash": "автомойка", "shop": "магазин", "supermarket": "супермаркет", "convenience": "продуктовый магазин", "bakery": "пекарня", "pharmacy": "аптека", "hospital": "больница", "clinic": "клиника", "toilets": "туалеты", "bus stop": "автобусная остановка", "bus_station": "автовокзал", "train station": "железнодорожный вокзал", "railway_station": "железнодорожный вокзал", "museum": "музей", "attraction": "достопримечательность", "sweet_shop": "кондитерский магазин", "patisserie": "кондитерская", "ice_cream": "мороженое"}, "pl": {"parking": "parking", "park": "park", "restaurant": "restauracja", "pub": "pub", "bar": "bar", "cafe": "kawiarnia", "fast_food": "fast food", "food_court": "strefa gastronomiczna", "hotel": "hotel", "hostel": "hostel", "fuel": "stacja paliw", "car_wash": "myjnia samochodowa", "shop": "sklep", "supermarket": "supermarket", "convenience": "sklep spożywczy", "bakery": "piekarnia", "pharmacy": "apteka", "hospital": "szpital", "clinic": "klinika", "toilets": "toalety", "bus stop": "przystanek autobusowy", "bus_station": "dworzec autobusowy", "train station": "dworzec kolejowy", "railway_station": "dworzec kolejowy", "museum": "muzeum", "attraction": "atrakcja turystyczna", "sweet_shop": "sklep ze słodyczami", "patisserie": "cukiernia", "ice_cream": "lodziarnia"}};
const canonicalize=(v)=>String(v||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[_-]+/g,' ').replace(/\\s+/g,' ').trim();
const aliasLookup=Object.fromEntries(Object.entries(romanianAliases).map(([k,v])=>[canonicalize(k),v]));
const dict=dictionaries[state.language]||extra[state.language]||dictionaries.en;
const translatePart=(part)=>{const normalized=canonicalize(part);const canonical=aliasLookup[normalized]||normalized.replace(/ /g,'_');return dict[canonical]||dict[normalized]||dictionaries.en[canonical]||null;};
const parts=raw.split(/\\s*[/|]\\s*/).filter(Boolean);
if(parts.length>1){const translated=parts.map(translatePart);if(translated.every(Boolean))return translated.join(' / ');}
return translatePart(raw)||raw;
}
function renderModulePlaces(places){document.querySelector('.module-quick-sheet')?.classList.remove('details-mode');state.moduleSearchReturnMode='list';const body=$('moduleLayerBody');body.style.cssText='';body.innerHTML='';if(!Array.isArray(places)||!places.length){const status=document.createElement('div');status.className='module-search-status';status.textContent=state.moduleSearchReply||quickUiText().notFound;body.append(status);return}document.querySelector('.module-quick-sheet')?.classList.add('results-mode');const panel=document.createElement('section');panel.className='module-places-results';panel.setAttribute('aria-label',quickUiText().found);const header=document.createElement('header');header.className='module-places-results-head';const heading=document.createElement('div');heading.className='module-places-results-heading';const title=document.createElement('h3');title.textContent=quickUiText().found;const subtitle=document.createElement('p');subtitle.textContent=places.length+' '+quickUiText().results;heading.append(title,subtitle);const back=document.createElement('button');back.type='button';back.className='module-results-back';back.setAttribute('aria-label',quickUiText().back);back.textContent='‹';back.addEventListener('click',handleModuleLayerBack);header.append(heading,back);const list=document.createElement('div');list.className='module-place-results-list';list.setAttribute('role','list');places.forEach((place,index)=>{const item=document.createElement('button');item.type='button';item.className='module-place-result';item.setAttribute('role','listitem');const icon=document.createElement('span');icon.className='module-place-result-icon';icon.setAttribute('aria-hidden','true');mountPlaceThumbnail(icon,place);const copy=document.createElement('span');copy.className='module-place-result-copy';const name=document.createElement('strong');name.className='module-place-result-name';name.textContent=(index+1)+'. '+String(place.name||(quickUiText().location+' '+(index+1)));const meta=document.createElement('span');meta.className='module-place-result-meta';meta.textContent=localizedPlaceCategory(place.type)+' · '+formatDistance(place.distance_meters)+' · '+quickUiText().details;copy.append(name,meta);const arrow=document.createElement('span');arrow.className='module-place-result-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='›';item.append(icon,copy,arrow);item.addEventListener('click',()=>renderModulePlaceDetails(place));list.append(item)});panel.append(header,list);body.append(panel);$('moduleLayerTitle').textContent=quickUiText().found}

const DETAIL_LABELS={"ro": {"address": "Adresă", "phone": "Telefon", "website": "Website", "photos": "Fotografii", "close": "Închide fotografia", "price": "Preț", "rooms": "Camere"}, "en": {"address": "Address", "phone": "Phone", "website": "Website", "photos": "Photos", "close": "Close photo", "price": "Price", "rooms": "Rooms"}, "fr": {"address": "Adresse", "phone": "Téléphone", "website": "Site web", "photos": "Photos", "close": "Fermer la photo", "price": "Prix", "rooms": "Chambres"}, "de": {"address": "Adresse", "phone": "Telefon", "website": "Webseite", "photos": "Fotos", "close": "Foto schließen", "price": "Preis", "rooms": "Zimmer"}, "it": {"address": "Indirizzo", "phone": "Telefono", "website": "Sito web", "photos": "Foto", "close": "Chiudi foto", "price": "Prezzo", "rooms": "Camere"}, "es": {"address": "Dirección", "phone": "Teléfono", "website": "Sitio web", "photos": "Fotos", "close": "Cerrar foto", "price": "Precio", "rooms": "Habitaciones"}, "pt": {"address": "Morada", "phone": "Telefone", "website": "Website", "photos": "Fotografias", "close": "Fechar fotografia", "price": "Preço", "rooms": "Quartos"}, "nl": {"address": "Adres", "phone": "Telefoon", "website": "Website", "photos": "Foto’s", "close": "Foto sluiten", "price": "Prijs", "rooms": "Kamers"}, "ru": {"address": "Адрес", "phone": "Телефон", "website": "Сайт", "photos": "Фотографии", "close": "Закрыть фото", "price": "Цена", "rooms": "Номера"}, "pl": {"address": "Adres", "phone": "Telefon", "website": "Strona internetowa", "photos": "Zdjęcia", "close": "Zamknij zdjęcie", "price": "Cena", "rooms": "Pokoje"}};
function detailLabels(){return DETAIL_LABELS[state.language]||DETAIL_LABELS.en}
function verifiedMediaUrl(value){try{const u=new URL(String(value||''));return u.protocol==='https:'?u.href:''}catch{return ''}}
function placeWebsiteUrl(value){
 let raw=String(value||'').trim();if(!raw)return '';
 if(raw.startsWith('//'))raw='https:'+raw;
 else if(!/^[a-z][a-z0-9+.-]*:/i.test(raw))raw='https://'+raw;
 try{const u=new URL(raw);return ['https:','http:'].includes(u.protocol)&&u.hostname.includes('.')&&!u.username&&!u.password?u.href:''}catch{return ''}
}
function appendPlaceWebsite(card,value){
 const site=placeWebsiteUrl(value);if(!site||card.querySelector('.place-website-link'))return;
 const p=document.createElement('p'),a=document.createElement('a');
 a.className='place-website-link';a.href=site;a.target='_blank';a.rel='noopener noreferrer';a.textContent='↗ '+detailLabels().website;p.append(a);card.append(p);
}
const placeMediaRequests=new Map();
function loadPlaceMedia(place){
 const ids=[place.wikidata,place.brand_wikidata].map(v=>/^Q[1-9][0-9]{0,11}$/.test(String(v||''))?String(v):'');
 if(!ids.some(Boolean)&&!(place.name&&Number.isFinite(Number(place.latitude))&&Number.isFinite(Number(place.longitude))))return Promise.resolve({});
 const key=ids.join(':')+'|'+String(place.name||'')+'|'+String(place.latitude||'')+'|'+String(place.longitude||'')+'|'+String(place.address||'');if(placeMediaRequests.has(key))return placeMediaRequests.get(key);
 const u=new URL(CLIENT_CONFIG.apiUrl.split('/api/chat')[0]+'/api/place-media');
 if(ids[0])u.searchParams.set('wikidata',ids[0]);if(ids[1])u.searchParams.set('brand_wikidata',ids[1]);if(place.name)u.searchParams.set('name',String(place.name).slice(0,120));if(place.address)u.searchParams.set('address',String(place.address).slice(0,180));if(Number.isFinite(Number(place.latitude))&&Number.isFinite(Number(place.longitude))){u.searchParams.set('lat',place.latitude);u.searchParams.set('lon',place.longitude)}
 const request=fetch(u.href,{signal:AbortSignal.timeout(12000)}).then(r=>r.ok?r.json():{}).catch(()=>({}));
 placeMediaRequests.set(key,request);if(placeMediaRequests.size>120)placeMediaRequests.delete(placeMediaRequests.keys().next().value);return request;
}
function mountPlaceLogo(host,place){
 const fallback=placeResultIcon(place);host.textContent=fallback;
 let revision=0;
 const display=candidates=>{
  const sources=[...new Set(candidates.map(verifiedMediaUrl).filter(Boolean))];if(!sources.length)return;
  const current=++revision;let index=0;
  const next=()=>{if(current!==revision)return;if(index>=sources.length){host.textContent=fallback;return}
   const image=document.createElement('img');image.alt='';image.referrerPolicy='no-referrer';image.className='place-brand-logo';image.onload=()=>{if(current===revision)host.replaceChildren(image)};image.onerror=next;image.src=sources[index++];
  };next();
 };
 const favicon=value=>{const site=placeWebsiteUrl(value);if(!site)return [];const u=new URL(site);return ['https://www.google.com/s2/favicons?sz=128&domain_url='+encodeURIComponent(u.origin),u.origin+'/favicon.ico']};
 display([place.logo_url,place.brand_logo,...favicon(place.website)]);
 const enrich=()=>loadPlaceMedia(place).then(data=>{if(!host.isConnected)return;display([...(Array.isArray(data.logos)?data.logos:[]),place.logo_url,place.brand_logo,...favicon(place.website||data.website)])});
 if(typeof IntersectionObserver==='function'){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();enrich()}},{rootMargin:'100px'});observer.observe(host);setTimeout(()=>observer.disconnect(),60000)}else enrich();
}
async function enrichPlaceWebsite(place,card){
 const data=await loadPlaceMedia(place);if(card.isConnected)appendPlaceWebsite(card,place.website||data.website);
}
function showPlacePhoto(url,name){
 const src=verifiedMediaUrl(url);if(!src)return;
 const dialog=document.createElement('dialog');dialog.setAttribute('aria-label',String(name||'Fotografie'));dialog.style.cssText='position:fixed;inset:0;margin:auto;max-width:min(94vw,640px);max-height:90dvh;padding:12px;border-radius:16px;border:1px solid #60879a;background:#112d3b;color:white;z-index:99999;box-sizing:border-box;overflow:auto';
 const close=document.createElement('button');close.type='button';close.textContent='✕';close.setAttribute('aria-label',detailLabels().close);close.style.cssText='display:block;margin:0 0 10px auto;background:#b92d42;color:white;border:0;border-radius:8px;padding:8px 14px;cursor:pointer';
 close.onclick=()=>dialog.close();
 const img=document.createElement('img');img.src=src;img.alt=String(name||'Locație');img.style.cssText='display:block;width:100%;height:auto;max-height:72dvh;object-fit:contain;border-radius:8px';
 dialog.append(close,img);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');}
}
function mountPlaceThumbnail(host,place){
 const url=verifiedMediaUrl(place.image_url);
 if(!url){mountPlaceLogo(host,place);if(place.wikidata){loadPlaceMedia({...place,brand_wikidata:''}).then(data=>{if(!host.isConnected||!Array.isArray(data.images))return;const photo=data.images.map(verifiedMediaUrl).find(Boolean);if(photo){place.image_url=photo;host.replaceChildren();mountPlaceThumbnail(host,place)}})}return;}
 const img=document.createElement('img');img.src=url;img.alt=String(place.name||'Locație');img.loading='lazy';img.referrerPolicy='no-referrer';img.style.cssText='display:block;width:100%;height:100%;object-fit:cover;border-radius:inherit';
 img.onerror=()=>{host.replaceChildren();mountPlaceLogo(host,place)};
 host.replaceChildren(img);host.style.cursor='zoom-in';
 host.setAttribute('aria-label','Fotografie '+String(place.name||''));
 host.addEventListener('click',event=>{event.stopPropagation();showPlacePhoto(url,place.name)});
}
function renderModulePlaceDetails(place){state.moduleSearchReturnMode='details';state.lastQuickPlace=place;$('moduleLayerBody').style.cssText='';document.querySelector('.module-quick-sheet')?.classList.add('details-mode');
 document.querySelector('.module-quick-sheet')?.classList.remove('results-mode');
 const body=$('moduleLayerBody');body.innerHTML='';const card=document.createElement('div');card.className='module-place-details';
 const t=quickUiText(),l=detailLabels();const title=document.createElement('h3');title.textContent=String(place.name||t.location);const logo=document.createElement('span');logo.className='module-place-result-icon place-detail-logo';logo.setAttribute('aria-hidden','true');mountPlaceLogo(logo,place);const heading=document.createElement('div');heading.className='place-detail-header';
 const headingIdentity=document.createElement('div');headingIdentity.className='place-detail-identity';headingIdentity.append(logo,title);
 const actions=document.createElement('div');actions.className='place-detail-actions';
 const go=document.createElement('button');go.type='button';go.className='primary-btn place-detail-route';go.textContent=dialogText("Alege traseul","Choose route");go.onclick=()=>{if(state.busy)return;offerPlaceTravelModes(place)};
 const photo=document.createElement('button');photo.type='button';photo.className='place-detail-photo';photo.style.border='0';photo.style.padding='0';photo.setAttribute('aria-label',l.photos);
 const photoHint=document.createElement('span');photoHint.textContent=dialogText('Fotografie indisponibilă','Photo unavailable');photoHint.style.cssText='font-size:11px;text-align:center;padding:6px';photo.append(photoHint);photo.disabled=true;photo.style.cursor='default';
 const setPhoto=url=>{const src=verifiedMediaUrl(url);if(!src)return false;const img=document.createElement('img');img.alt=String(place.name||'');img.referrerPolicy='no-referrer';img.onerror=()=>{photo.replaceChildren(photoHint);photo.disabled=true;photo.style.cursor='default'};img.src=src;photo.replaceChildren(img);photo.disabled=false;photo.style.cursor='zoom-in';photo.onclick=()=>showPlacePhoto(src,place.name);return true};
 setPhoto(place.image_url);

 actions.append(go,photo);heading.append(headingIdentity,actions);card.append(heading);
 const status=document.createElement('p');status.textContent=dialogText('Se caută informații despre locația selectată…','Researching the selected location…');status.style.fontSize='12px';card.append(status);
 // Only display provider-grounded attributes; never fabricate opening hours or services.
 const extraDetails=()=>{const fields=[['description',dialogText('Descriere','Description')],['opening_hours',dialogText('Program','Opening hours')],['services',dialogText('Servicii','Services')]];for(const [key,label] of fields){const value=Array.isArray(place[key])?place[key].filter(Boolean).join(', '):place[key];if(value&&typeof value==='string'&&!card.querySelector('[data-place-field="'+key+'"]')){const p=document.createElement('p');p.dataset.placeField=key;const strong=document.createElement('strong');strong.textContent=label+': ';p.append(strong,document.createTextNode(value));card.append(p)}}};
 extraDetails();
 loadPlaceMedia(place).then(data=>{if(!card.isConnected)return;const details=data.details||{};status.textContent=(details.opening_hours||details.description||(Array.isArray(details.services)&&details.services.length)||data.images?.length)?dialogText('Informații suplimentare găsite','Additional information found'):dialogText('Nu au fost găsite detalii suplimentare verificate','No additional verified details found');for(const key of ['description','opening_hours','services'])if(!place[key]&&details[key])place[key]=details[key];extraDetails();if(!place.phone&&details.phone){place.phone=details.phone;line(l.phone,details.phone)}if(!place.website&&data.website)appendPlaceWebsite(card,data.website);const candidate=Array.isArray(data.images)?data.images.map(verifiedMediaUrl).find(Boolean):'';if(candidate&&!place.image_url){place.image_url=candidate;setPhoto(candidate)}if(Array.isArray(data.evidence)&&data.evidence.length){const detailsLink=document.createElement('details');const summary=document.createElement('summary');summary.textContent=dialogText('Surse verificate','Verified sources');detailsLink.append(summary);for(const evidence of data.evidence){const a=document.createElement('a');a.href=evidence.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=evidence.field==='opening_hours'?dialogText('Sursa programului','Hours source'):dialogText('Sursa telefonului','Phone source');const p=document.createElement('p');p.append(a);detailsLink.append(p)}card.append(detailsLink)}}).catch(()=>{if(card.isConnected)status.textContent=dialogText('Nu s-au putut încărca detaliile suplimentare.','Additional details could not be loaded.');});
 const line=(label,value)=>{if(value===undefined||value===null||String(value).trim()==='')return;const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+': ';p.append(strong,document.createTextNode(String(value)));card.append(p)};
 line(l.address,place.address||[place.house_number,place.street,place.city,place.postcode].filter(Boolean).join(', '));
 line(t.category,localizedPlaceCategory(place.type||t.unspecified));
 if(Number(place.stars)>=1&&Number(place.stars)<=5)line('★ (OpenStreetMap)',String(place.stars));
 if(place.distance_meters!==undefined)line(t.distance,formatDistance(place.distance_meters));
 if(place.phone){const p=document.createElement('p');const a=document.createElement('a');a.href='tel:'+String(place.phone).replace(/[^+0-9]/g,'');a.textContent=String(place.phone);p.append(l.phone+': ',a);card.append(p)}
 appendPlaceWebsite(card,place.website);
 // Prices are shown only when supplied as explicit provider data; no invented prices.
 if(place.price&&typeof place.price==='string')line(l.price,place.price);
 if(Array.isArray(place.rooms)){for(const room of place.rooms.slice(0,10)){if(!room||typeof room!=='object')continue;const p=document.createElement('p');p.textContent=[room.name||l.rooms,room.price&&room.currency?room.price+' '+room.currency:''].filter(Boolean).join(' · ');card.append(p)}}
 // Coordinates remain available internally for routing, not displayed in the visitor card.
 const url=typeof place.map_url==='string'&&place.map_url.startsWith('https://www.openstreetmap.org/')?place.map_url:'';if(url){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=t.openMap;card.append(link)}
 const back=document.createElement('button');back.type='button';back.className='primary-btn';back.textContent=t.backResults;back.addEventListener('click',()=>renderModulePlaces(state.moduleSearchResults));body.append(card,back);$('moduleLayerTitle').textContent=t.placeDetails;body.scrollTop=0;
}
const QUICK_SEARCH_ENGLISH={
'Benzinării':'Find petrol stations near me.',
'Spălătorii auto':'Find car washes near me.',
'Parcări':'Find parking near me.',
'Restaurante și localuri cu mâncare':'Find restaurants and pubs serving food near me.',
'Cofetării':'Find bakeries, patisseries, cake shops and gelato shops near me.',
'Hoteluri':'Find hotels and hostels near me.',
'Alte puncte de interes':'Find points of interest near me.'
};
function showJourneyMode(choice){
 state.moduleSearchCategory=choice;
 const labels=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
 setModuleLayerMode(labels[0]);
 const body=$('moduleLayerBody');
 const mixedNames={ro:'Transport mixt',en:'Mixed transport',fr:'Transport multimodal',de:'Kombinierter Verkehr',it:'Trasporto misto',es:'Transporte mixto',pt:'Transporte misto',nl:'Gemengd vervoer',ru:'Смешанный транспорт',pl:'Transport mieszany'};
 for(const [mode,label] of [['drive',labels[3]],['transit',labels[2]]]){
  const button=document.createElement('button');
  button.type='button';
  button.className='module-result-card';
  button.textContent=mode==='transit'&&choice.mixedJourney?(mixedNames[state.language]||mixedNames.en):label;
  button.onclick=()=>showPreciseJourney({...choice,journeyMode:mode});
  body.append(button);
 }
}
// Shared UI dialog translations. All recently added selectors and overlays use
// this registry instead of silently falling back to English in non-English UI.
const POCKET_DIALOG_TEXT={
"Postcode (optional)":{fr:"Code postal (facultatif)",de:"Postleitzahl (optional)",it:"CAP (facoltativo)",es:"Código postal (opcional)",pt:"Código postal (opcional)",nl:"Postcode (optioneel)",ru:"Почтовый индекс (необязательно)",pl:"Kod pocztowy (opcjonalnie)"},
"Confirm destination":{fr:"Confirmer la destination",de:"Ziel bestätigen",it:"Conferma destinazione",es:"Confirmar destino",pt:"Confirmar destino",nl:"Bestemming bevestigen",ru:"Подтвердить пункт назначения",pl:"Potwierdź cel podróży"},
"Confirm destination town":{fr:"Confirmer la localité de destination",de:"Zielort bestätigen",it:"Conferma località di destinazione",es:"Confirmar localidad de destino",pt:"Confirmar localidade de destino",nl:"Bestemmingsplaats bevestigen",ru:"Подтвердить населённый пункт",pl:"Potwierdź miejscowość docelową"},
"Continue to town centre (not the entered house number)":{fr:"Continuer vers le centre-ville (pas vers le numéro saisi)",de:"Zum Ortszentrum (nicht zur eingegebenen Hausnummer)",it:"Prosegui verso il centro (non al numero inserito)",es:"Continuar al centro (no al número indicado)",pt:"Continuar para o centro (não para o número indicado)",nl:"Ga naar het centrum (niet naar het ingevoerde huisnummer)",ru:"Продолжить к центру (не к введённому номеру дома)",pl:"Jedź do centrum (nie pod wpisany numer domu)"},
"Country":{fr:"Pays",de:"Land",it:"Paese",es:"País",pt:"País",nl:"Land",ru:"Страна",pl:"Kraj"},
"City or town":{fr:"Ville ou localité",de:"Stadt oder Ort",it:"Città o località",es:"Ciudad o localidad",pt:"Cidade ou localidade",nl:"Stad of plaats",ru:"Город или населённый пункт",pl:"Miasto lub miejscowość"},
"Street (optional)":{fr:"Rue (facultatif)",de:"Straße (optional)",it:"Via (facoltativa)",es:"Calle (opcional)",pt:"Rua (opcional)",nl:"Straat (optioneel)",ru:"Улица (необязательно)",pl:"Ulica (opcjonalnie)"},
"House number (optional)":{fr:"Numéro (facultatif)",de:"Hausnummer (optional)",it:"Numero civico (facoltativo)",es:"Número (opcional)",pt:"Número da porta (opcional)",nl:"Huisnummer (optioneel)",ru:"Номер дома (необязательно)",pl:"Numer domu (opcjonalnie)"},
"Search":{fr:"Rechercher",de:"Suchen",it:"Cerca",es:"Buscar",pt:"Pesquisar",nl:"Zoeken",ru:"Поиск",pl:"Szukaj"},
"Searching…":{fr:"Recherche en cours…",de:"Suche läuft…",it:"Ricerca in corso…",es:"Buscando…",pt:"A pesquisar…",nl:"Bezig met zoeken…",ru:"Поиск…",pl:"Wyszukiwanie…"},
"No verified matches.":{fr:"Aucun résultat vérifié.",de:"Keine verifizierten Treffer.",it:"Nessun risultato verificato.",es:"No hay resultados verificados.",pt:"Não foram encontrados resultados verificados.",nl:"Geen geverifieerde resultaten.",ru:"Подтверждённых результатов нет.",pl:"Brak zweryfikowanych wyników."},
"Search is unavailable right now.":{fr:"Recherche temporairement indisponible.",de:"Suche derzeit nicht verfügbar.",it:"Ricerca temporaneamente non disponibile.",es:"La búsqueda no está disponible ahora.",pt:"A pesquisa não está disponível agora.",nl:"Zoeken is nu niet beschikbaar.",ru:"Поиск временно недоступен.",pl:"Wyszukiwanie jest obecnie niedostępne."},
"Back":{fr:"Retour",de:"Zurück",it:"Indietro",es:"Volver",pt:"Voltar",nl:"Terug",ru:"Назад",pl:"Wstecz"},
"Close":{fr:"Fermer",de:"Schließen",it:"Chiudi",es:"Cerrar",pt:"Fechar",nl:"Sluiten",ru:"Закрыть",pl:"Zamknij"},
"Selected region: ":{fr:"Région sélectionnée : ",de:"Gewählte Region: ",it:"Regione selezionata: ",es:"Región seleccionada: ",pt:"Região selecionada: ",nl:"Geselecteerde regio: ",ru:"Выбранный регион: ",pl:"Wybrany region: "},
"Verified town: ":{fr:"Localité vérifiée : ",de:"Verifizierter Ort: ",it:"Località verificata: ",es:"Localidad verificada: ",pt:"Localidade verificada: ",nl:"Geverifieerde plaats: ",ru:"Подтверждённый населённый пункт: ",pl:"Zweryfikowana miejscowość: "},
"Country: ":{fr:"Pays : ",de:"Land: ",it:"Paese: ",es:"País: ",pt:"País: ",nl:"Land: ",ru:"Страна: ",pl:"Kraj: "},
"Confirm journey":{fr:"Confirmer le trajet",de:"Reise bestätigen",it:"Conferma viaggio",es:"Confirmar viaje",pt:"Confirmar viagem",nl:"Reis bevestigen",ru:"Подтвердить поездку",pl:"Potwierdź podróż"},
"My location":{fr:"Ma position",de:"Mein Standort",it:"La mia posizione",es:"Mi ubicación",pt:"A minha localização",nl:"Mijn locatie",ru:"Моё местоположение",pl:"Moja lokalizacja"},
"Find routes":{fr:"Calculer les itinéraires",de:"Routen suchen",it:"Trova percorsi",es:"Buscar rutas",pt:"Encontrar percursos",nl:"Routes zoeken",ru:"Найти маршруты",pl:"Znajdź trasy"},
"Find mixed transport to ":{fr:"Rechercher un trajet multimodal vers ",de:"Gemischte Verkehrsmittel suchen nach ",it:"Cerca trasporti combinati per ",es:"Buscar transporte combinado a ",pt:"Procurar transporte combinado para ",nl:"Gecombineerd vervoer zoeken naar ",ru:"Найти комбинированный транспорт до ",pl:"Znajdź transport łączony do "},
"Change destination":{fr:"Changer de destination",de:"Ziel ändern",it:"Cambia destinazione",es:"Cambiar destino",pt:"Alterar destino",nl:"Bestemming wijzigen",ru:"Изменить пункт назначения",pl:"Zmień cel podróży"},
"Change departure":{fr:"Changer le départ",de:"Abfahrt ändern",it:"Cambia partenza",es:"Cambiar salida",pt:"Alterar partida",nl:"Vertrek wijzigen",ru:"Изменить отправление",pl:"Zmień miejsce wyjazdu"},
"Destination":{fr:"Destination",de:"Ziel",it:"Destinazione",es:"Destino",pt:"Destino",nl:"Bestemming",ru:"Пункт назначения",pl:"Cel podróży"},
"Choose departure":{fr:"Choisir le départ",de:"Startpunkt wählen",it:"Scegli partenza",es:"Elegir salida",pt:"Escolher partida",nl:"Kies vertrek",ru:"Выберите отправление",pl:"Wybierz punkt startowy"},
"My location (GPS)":{fr:"Ma position (GPS)",de:"Mein Standort (GPS)",it:"La mia posizione (GPS)",es:"Mi ubicación (GPS)",pt:"A minha localização (GPS)",nl:"Mijn locatie (GPS)",ru:"Моё местоположение (GPS)",pl:"Moja lokalizacja (GPS)"},
"Choose a departure address":{fr:"Choisir une adresse de départ",de:"Startadresse wählen",it:"Scegli indirizzo di partenza",es:"Elegir dirección de salida",pt:"Escolher morada de partida",nl:"Kies vertrekadres",ru:"Выберите адрес отправления",pl:"Wybierz adres początkowy"},
"Departure":{fr:"Départ",de:"Abfahrt",it:"Partenza",es:"Salida",pt:"Partida",nl:"Vertrek",ru:"Отправление",pl:"Wyjazd"},
"Selected town: ":{fr:"Localité sélectionnée : ",de:"Gewählter Ort: ",it:"Località selezionata: ",es:"Localidad seleccionada: ",pt:"Localidade selecionada: ",nl:"Geselecteerde plaats: ",ru:"Выбранный населённый пункт: ",pl:"Wybrana miejscowość: "},
"Verify town":{fr:"Vérifier la localité",de:"Ort überprüfen",it:"Verifica località",es:"Verificar localidad",pt:"Verificar localidade",nl:"Plaats verifiëren",ru:"Проверить населённый пункт",pl:"Zweryfikuj miejscowość"},
"Driving destination in ":{fr:"Destination en voiture à ",de:"Zielort mit dem Auto: ",it:"Destinazione in auto a ",es:"Destino en coche en ",pt:"Destino de carro em ",nl:"Autobestemming in ",ru:"Пункт назначения на автомобиле: ",pl:"Cel podróży samochodem: "},
"Find accommodation":{fr:"Rechercher un hébergement",de:"Unterkunft suchen",it:"Cerca alloggio",es:"Buscar alojamiento",pt:"Procurar alojamento",nl:"Accommodatie zoeken",ru:"Найти жильё",pl:"Znajdź nocleg"},
"Go to an address":{fr:"Aller à une adresse",de:"Zu einer Adresse fahren",it:"Vai a un indirizzo",es:"Ir a una dirección",pt:"Ir para uma morada",nl:"Naar een adres gaan",ru:"Поехать по адресу",pl:"Jedź pod adres"},
"Yes, choose accommodation":{fr:"Oui, choisir un hébergement",de:"Ja, Unterkunft wählen",it:"Sì, scegli alloggio",es:"Sí, elegir alojamiento",pt:"Sim, escolher alojamento",nl:"Ja, accommodatie kiezen",ru:"Да, выбрать жильё",pl:"Tak, wybierz nocleg"},
"No, continue to destination":{fr:"Non, continuer vers la destination",de:"Nein, weiter zum Ziel",it:"No, continua verso la destinazione",es:"No, continuar al destino",pt:"Não, continuar para o destino",nl:"Nee, doorgaan naar bestemming",ru:"Нет, продолжить к цели",pl:"Nie, przejdź do celu"},
"Where in this town would you like to go?":{fr:"Où souhaitez-vous aller dans cette localité ?",de:"Wohin möchten Sie in diesem Ort?",it:"Dove vuoi andare in questa località?",es:"¿Adónde quieres ir en esta localidad?",pt:"Para onde quer ir nesta localidade?",nl:"Waar wil je naartoe in deze plaats?",ru:"Куда вы хотите попасть в этом населённом пункте?",pl:"Dokąd chcesz dotrzeć w tej miejscowości?"},
"Town centre":{fr:"Centre-ville",de:"Ortszentrum",it:"Centro città",es:"Centro de la localidad",pt:"Centro da localidade",nl:"Centrum",ru:"Центр населённого пункта",pl:"Centrum miejscowości"},
"Choose a street or house number":{fr:"Choisir une rue ou un numéro",de:"Straße oder Hausnummer wählen",it:"Scegli via o numero civico",es:"Elegir calle o número",pt:"Escolher rua ou número",nl:"Kies straat of huisnummer",ru:"Выберите улицу или номер дома",pl:"Wybierz ulicę lub numer domu"},
"Accommodation before route":{fr:"Hébergement avant le trajet",de:"Unterkunft vor der Route",it:"Alloggio prima del percorso",es:"Alojamiento antes de la ruta",pt:"Alojamento antes da rota",nl:"Accommodatie voor route",ru:"Жильё до построения маршрута",pl:"Nocleg przed trasą"},
"You selected ":{fr:"Vous avez choisi ",de:"Sie haben gewählt: ",it:"Hai selezionato ",es:"Has seleccionado ",pt:"Selecionou ",nl:"Je hebt gekozen: ",ru:"Вы выбрали ",pl:"Wybrano "},
"Would you like directions?":{fr:"Voulez-vous un itinéraire ?",de:"Möchten Sie eine Route?",it:"Vuoi indicazioni stradali?",es:"¿Quieres indicaciones?",pt:"Quer indicações?",nl:"Wil je een route?",ru:"Показать маршрут?",pl:"Czy pokazać trasę?"},
"Yes, show directions":{fr:"Oui, afficher l’itinéraire",de:"Ja, Route anzeigen",it:"Sì, mostra indicazioni",es:"Sí, mostrar ruta",pt:"Sim, mostrar percurso",nl:"Ja, toon route",ru:"Да, показать маршрут",pl:"Tak, pokaż trasę"},
"No, close":{fr:"Non, fermer",de:"Nein, schließen",it:"No, chiudi",es:"No, cerrar",pt:"Não, fechar",nl:"Nee, sluiten",ru:"Нет, закрыть",pl:"Nie, zamknij"},
"Choose an option":{fr:"Choisir une option",de:"Option auswählen",it:"Scegli un’opzione",es:"Elige una opción",pt:"Escolha uma opção",nl:"Kies een optie",ru:"Выберите вариант",pl:"Wybierz opcję"},
"Information about ":{fr:"Informations sur ",de:"Informationen über ",it:"Informazioni su ",es:"Información sobre ",pt:"Informações sobre ",nl:"Informatie over ",ru:"Информация о ",pl:"Informacje o "},
"Accommodation results":{fr:"Hébergements trouvés",de:"Unterkünfte gefunden",it:"Alloggi trovati",es:"Alojamientos encontrados",pt:"Alojamentos encontrados",nl:"Gevonden accommodaties",ru:"Найденное жильё",pl:"Znalezione noclegi"},
"Response time: ":{fr:"Temps de réponse : ",de:"Antwortzeit: ",it:"Tempo di risposta: ",es:"Tiempo de respuesta: ",pt:"Tempo de resposta: ",nl:"Antwoordtijd: ",ru:"Время ответа: ",pl:"Czas odpowiedzi: "},
"details":{fr:"détails",de:"Details",it:"dettagli",es:"detalles",pt:"detalhes",nl:"details",ru:"подробности",pl:"szczegóły"},
"Previous":{fr:"Précédent",de:"Vorherige",it:"Precedente",es:"Anterior",pt:"Anterior",nl:"Vorige",ru:"Предыдущий",pl:"Poprzedni"},
"Return":{fr:"Retour",de:"Zurück",it:"Indietro",es:"Volver",pt:"Voltar",nl:"Terug",ru:"Вернуться",pl:"Powrót"},
"Retry the question":{fr:"Réessayer la question",de:"Frage erneut versuchen",it:"Riprova la domanda",es:"Reintentar la pregunta",pt:"Repetir a pergunta",nl:"Vraag opnieuw proberen",ru:"Повторить вопрос",pl:"Ponów pytanie"},
"Request failed.":{fr:"Échec de la requête.",de:"Anfrage fehlgeschlagen.",it:"Richiesta non riuscita.",es:"La solicitud ha fallado.",pt:"O pedido falhou.",nl:"Verzoek mislukt.",ru:"Ошибка запроса.",pl:"Żądanie nie powiodło się."},
"No, plan my route":{fr:"Non, calculer l’itinéraire",de:"Nein, Route planen",it:"No, calcola il percorso",es:"No, planificar ruta",pt:"Não, planear o percurso",nl:"Nee, plan route",ru:"Нет, построить маршрут",pl:"Nie, wyznacz trasę"},
"Confirmed destination: ":{fr:"Destination confirmée : ",de:"Bestätigtes Ziel: ",it:"Destinazione confermata: ",es:"Destino confirmado: ",pt:"Destino confirmado: ",nl:"Bevestigde bestemming: ",ru:"Подтверждённый пункт назначения: ",pl:"Potwierdzony cel podróży: "},
"Find accommodation near ":{fr:"Rechercher un hébergement près de ",de:"Unterkunft suchen in der Nähe von ",it:"Cerca alloggio vicino a ",es:"Buscar alojamiento cerca de ",pt:"Procurar alojamento perto de ",nl:"Accommodatie zoeken nabij ",ru:"Найти жильё рядом с ",pl:"Znajdź nocleg w pobliżu "},
"Back to place details":{fr:"Retour à la présentation",de:"Zurück zur Ortsbeschreibung",it:"Torna ai dettagli del luogo",es:"Volver a los detalles",pt:"Voltar aos detalhes",nl:"Terug naar plaatsinformatie",ru:"Назад к описанию",pl:"Powrót do opisu"},
"Verify destination":{fr:"Vérifier la destination",de:"Ziel überprüfen",it:"Verifica la destinazione",es:"Verificar destino",pt:"Verificar destino",nl:"Bestemming verifiëren",ru:"Проверить пункт назначения",pl:"Zweryfikuj cel"},
"Choose the destination town. After confirmation, select your travel mode.":{fr:"Choisissez la localité de destination, puis le moyen de transport.",de:"Wählen Sie den Zielort und anschließend das Verkehrsmittel.",it:"Scegli la località di destinazione, poi il mezzo di trasporto.",es:"Elige la localidad de destino y después el medio de transporte.",pt:"Escolha a localidade de destino e depois o meio de transporte.",nl:"Kies de bestemmingsplaats en daarna het vervoermiddel.",ru:"Выберите населённый пункт, затем способ передвижения.",pl:"Wybierz miejscowość docelową, a następnie środek transportu."},
"Choose a verified destination. Street, house number and postcode are optional.":{fr:"Choisissez une destination vérifiée. Rue, numéro et code postal sont facultatifs.",de:"Wählen Sie ein bestätigtes Ziel. Straße, Hausnummer und PLZ sind optional.",it:"Scegli una destinazione verificata. Via, numero e CAP sono facoltativi.",es:"Elige un destino verificado. Calle, número y código postal son opcionales.",pt:"Escolha um destino verificado. Rua, número e código postal são opcionais.",nl:"Kies een geverifieerde bestemming. Straat, huisnummer en postcode zijn optioneel.",ru:"Выберите подтверждённый пункт назначения. Улица, дом и индекс необязательны.",pl:"Wybierz zweryfikowany cel. Ulica, numer domu i kod pocztowy są opcjonalne."},
"The town is identified, but its map position is not verified. Choose the verified town to calculate public transport.":{fr:"La localité est identifiée, mais sa position n’est pas confirmée. Vérifiez-la pour calculer le trajet.",de:"Der Ort ist bekannt, aber die Kartenposition ist unbestätigt. Bestätigen Sie den Ort für die ÖPNV-Suche.",it:"La località è identificata, ma la posizione non è verificata. Confermala per calcolare il trasporto pubblico.",es:"La localidad está identificada, pero su posición no está verificada. Confírmala para calcular el transporte público.",pt:"A localidade foi identificada, mas a localização não está verificada. Confirme-a para calcular o transporte público.",nl:"De plaats is herkend, maar de locatie is niet geverifieerd. Bevestig de plaats voor het OV.",ru:"Населённый пункт найден, но координаты не подтверждены. Подтвердите его для поиска транспорта.",pl:"Miejscowość rozpoznano, ale współrzędne nie są potwierdzone. Zweryfikuj ją, aby wyszukać transport."},
"Street or house number is not verified. Select a verified suggestion or use the separate town-centre button. Unverified address text is NOT a destination.":{fr:"Rue ou numéro non vérifié. Choisissez une suggestion confirmée ou le centre-ville. L’adresse non vérifiée ne sera pas utilisée.",de:"Straße oder Hausnummer unbestätigt. Wählen Sie einen Treffer oder das Ortszentrum. Ungeprüfte Angaben werden nicht als Ziel verwendet.",it:"Via o numero non verificati. Scegli un suggerimento confermato o il centro. L’indirizzo non verificato non sarà usato.",es:"Calle o número sin verificar. Elige una sugerencia confirmada o el centro. No se usará la dirección sin verificar.",pt:"Rua ou número não verificados. Escolha uma sugestão confirmada ou o centro. A morada não verificada não será usada.",nl:"Straat of nummer niet bevestigd. Kies een geverifieerd resultaat of het centrum. Onbevestigde adressen worden niet gebruikt.",ru:"Улица или номер не подтверждены. Выберите проверенный вариант либо центр. Непроверенный адрес не будет использован.",pl:"Ulica lub numer nie są zweryfikowane. Wybierz potwierdzony wynik albo centrum. Nie użyjemy niesprawdzonego adresu."},
"Confirm now for the town centre. For a specific address, select the street and house number.":{fr:"Confirmez le centre-ville ou choisissez une rue et un numéro précis.",de:"Bestätigen Sie das Ortszentrum oder wählen Sie eine genaue Straße und Hausnummer.",it:"Conferma il centro oppure scegli via e numero civico.",es:"Confirma el centro o elige una calle y un número concretos.",pt:"Confirme o centro ou escolha uma rua e número específicos.",nl:"Bevestig het centrum of kies straat en huisnummer.",ru:"Подтвердите центр или выберите точную улицу и дом.",pl:"Potwierdź centrum albo wybierz dokładną ulicę i numer domu."},
"No street suggestions. You can search for a rural house number without a street or confirm the town.":{fr:"Aucune rue suggérée. Vous pouvez saisir un numéro rural sans rue ou confirmer la localité.",de:"Keine Straßenvorschläge. Sie können eine ländliche Hausnummer ohne Straße suchen oder den Ort bestätigen.",it:"Nessuna via suggerita. Puoi cercare un numero civico rurale senza via o confermare la località.",es:"No hay sugerencias de calles. Puedes buscar un número rural sin calle o confirmar la localidad.",pt:"Sem sugestões de ruas. Pode procurar um número rural sem rua ou confirmar a localidade.",nl:"Geen straatvoorstellen. Zoek een huisnummer zonder straat of bevestig de plaats.",ru:"Предложений улиц нет. Можно искать номер дома без улицы или подтвердить населённый пункт.",pl:"Brak propozycji ulic. Możesz wyszukać numer domu bez ulicy lub potwierdzić miejscowość."},
"House number is not verified on the map. Search another number or continue to town centre; we will not invent an exact address.":{fr:"Numéro non vérifié sur la carte. Essayez un autre numéro ou continuez vers le centre ; aucune adresse ne sera inventée.",de:"Hausnummer auf der Karte nicht bestätigt. Suchen Sie eine andere oder fahren Sie zum Ortszentrum; wir erfinden keine Adresse.",it:"Numero civico non verificato. Cercane un altro o prosegui verso il centro; non inventeremo indirizzi.",es:"Número no verificado en el mapa. Busca otro o continúa al centro; no inventaremos direcciones.",pt:"Número não verificado no mapa. Procure outro ou continue para o centro; não inventaremos moradas.",nl:"Huisnummer niet bevestigd. Zoek een ander nummer of ga naar het centrum; we verzinnen geen adressen.",ru:"Номер дома не подтверждён. Попробуйте другой или перейдите к центру; адрес не будет выдуман.",pl:"Numer domu nie został potwierdzony. Spróbuj innego lub wybierz centrum; nie wymyślimy adresu."},
"Postcode is optional; the verified destination remains selected.":{fr:"Code postal facultatif ; la destination vérifiée reste sélectionnée.",de:"PLZ optional; das bestätigte Ziel bleibt ausgewählt.",it:"CAP facoltativo; la destinazione verificata resta selezionata.",es:"El código postal es opcional; se mantiene el destino verificado.",pt:"O código postal é opcional; o destino verificado mantém-se.",nl:"Postcode is optioneel; de bevestigde bestemming blijft geselecteerd.",ru:"Индекс необязателен; подтверждённый пункт назначения остаётся выбранным.",pl:"Kod pocztowy jest opcjonalny; potwierdzony cel pozostaje wybrany."},
"The chosen town is retained. Its coordinates are not verified yet; search for a street or number without selecting the town again.":{fr:"La localité choisie est conservée. Coordonnées non vérifiées ; recherchez rue ou numéro sans la choisir à nouveau.",de:"Der gewählte Ort bleibt erhalten. Koordinaten unbestätigt; suchen Sie Straße oder Hausnummer ohne erneute Ortswahl.",it:"La località scelta resta selezionata. Coordinate non verificate; cerca via o numero senza sceglierla di nuovo.",es:"La localidad elegida se mantiene. Coordenadas sin verificar; busca calle o número sin volver a elegirla.",pt:"A localidade escolhida mantém-se. Coordenadas não verificadas; procure rua ou número sem repetir a escolha.",nl:"De gekozen plaats blijft geselecteerd. Coördinaten niet bevestigd; zoek straat of huisnummer zonder opnieuw te kiezen.",ru:"Выбранный пункт сохранён. Координаты не подтверждены; ищите улицу или дом без повторного выбора.",pl:"Wybrana miejscowość pozostaje zapisana. Współrzędne niepotwierdzone; szukaj ulicy lub numeru bez ponownego wyboru."}
};
Object.assign(POCKET_DIALOG_TEXT,{
"Verifying the previously selected locality: ":{fr:"Vérification de la localité déjà choisie : ",de:"Prüfung des bereits gewählten Ortes: ",it:"Verifica della località già selezionata: ",es:"Verificando la localidad ya seleccionada: ",pt:"A verificar a localidade escolhida: ",nl:"De gekozen plaats controleren: ",ru:"Проверяем выбранный населённый пункт: ",pl:"Weryfikacja wybranej miejscowości: "},
"Would you like accommodation in ":{fr:"Souhaitez-vous un hébergement à ",de:"Möchten Sie eine Unterkunft in ",it:"Vuoi un alloggio a ",es:"¿Quieres alojamiento en ",pt:"Quer alojamento em ",nl:"Wil je accommodatie in ",ru:"Хотите найти жильё в ",pl:"Czy chcesz nocleg w "},
" before planning the route? Selecting a hotel will automatically set its address as your destination.":{fr:" avant de calculer l’itinéraire ? L’adresse de l’hôtel choisi deviendra la destination.",de:" vor der Routenplanung? Das gewählte Hotel wird automatisch zum Ziel.",it:" prima del percorso? L’hotel scelto diventerà la destinazione.",es:" antes de calcular la ruta? El hotel elegido será el destino.",pt:" antes de calcular a rota? O hotel escolhido será o destino.",nl:" vóór de route? Het gekozen hotel wordt automatisch de bestemming.",ru:" перед маршрутом? Выбранный отель станет пунктом назначения.",pl:" przed wyznaczeniem trasy? Wybrany hotel będzie celem podróży."},
"This location was identified on a map. Would you like directions?":{fr:"Ce lieu a été identifié sur la carte. Voulez-vous un itinéraire ?",de:"Dieser Ort wurde auf der Karte gefunden. Möchten Sie eine Route?",it:"Luogo identificato sulla mappa. Vuoi indicazioni?",es:"Este lugar se ha identificado en el mapa. ¿Quieres indicaciones?",pt:"Este local foi identificado no mapa. Quer indicações?",nl:"Deze plek is op de kaart gevonden. Wil je een route?",ru:"Место найдено на карте. Показать маршрут?",pl:"Miejsce znaleziono na mapie. Czy pokazać trasę?"},
"How would you like to get to ":{fr:"Comment souhaitez-vous aller à ",de:"Wie möchten Sie nach ",it:"Come vuoi arrivare a ",es:"¿Cómo quieres llegar a ",pt:"Como quer chegar a ",nl:"Hoe wil je naar ",ru:"Как вы хотите добраться до ",pl:"Jak chcesz dotrzeć do "},
"I found ":{fr:"J’ai trouvé ",de:"Ich habe gefunden: ",it:"Ho trovato ",es:"He encontrado ",pt:"Encontrei ",nl:"Ik heb gevonden: ",ru:"Я нашла ",pl:"Znalazłam "},
"No mapped places in the selected category were found within the 5 km search radius.":{fr:"Aucun lieu cartographié de cette catégorie à moins de 5 km.",de:"Keine kartierten Orte dieser Kategorie im Umkreis von 5 km gefunden.",it:"Nessun luogo di questa categoria entro 5 km.",es:"No se encontraron lugares de esta categoría en un radio de 5 km.",pt:"Não foram encontrados locais desta categoria num raio de 5 km.",nl:"Geen locaties uit deze categorie binnen 5 km gevonden.",ru:"В радиусе 5 км нет отмеченных объектов этой категории.",pl:"Nie znaleziono miejsc tej kategorii w promieniu 5 km."},
"Search timed out after 25 seconds. Please retry.":{fr:"La recherche a dépassé 25 secondes. Réessayez.",de:"Die Suche dauerte länger als 25 Sekunden. Bitte erneut versuchen.",it:"La ricerca ha superato 25 secondi. Riprova.",es:"La búsqueda superó los 25 segundos. Inténtalo de nuevo.",pt:"A pesquisa excedeu 25 segundos. Tente novamente.",nl:"Zoeken duurde langer dan 25 seconden. Probeer opnieuw.",ru:"Поиск превысил 25 секунд. Повторите попытку.",pl:"Wyszukiwanie przekroczyło 25 sekund. Spróbuj ponownie."},
"The destination is in the town centre.":{fr:"La destination se situe au centre-ville.",de:"Das Ziel liegt im Ortszentrum.",it:"La destinazione si trova in centro.",es:"El destino está en el centro.",pt:"O destino fica no centro.",nl:"De bestemming ligt in het centrum.",ru:"Пункт назначения находится в центре.",pl:"Cel znajduje się w centrum miejscowości."},
"The destination is an approximate point on the selected street.":{fr:"La destination est un point approximatif sur la rue choisie.",de:"Das Ziel ist ein ungefährer Punkt auf der gewählten Straße.",it:"La destinazione è un punto approssimativo sulla via scelta.",es:"El destino es un punto aproximado en la calle elegida.",pt:"O destino é um ponto aproximado na rua escolhida.",nl:"De bestemming is een geschat punt op de gekozen straat.",ru:"Пункт назначения приблизителен и находится на выбранной улице.",pl:"Cel jest przybliżonym punktem na wybranej ulicy."},
"The route is prepared. Would you like accommodation near the tourist centre?":{fr:"L’itinéraire est prêt. Chercher un hébergement près du centre touristique ?",de:"Die Route ist bereit. Unterkunft nahe dem touristischen Zentrum suchen?",it:"Il percorso è pronto. Vuoi cercare un alloggio vicino al centro turistico?",es:"La ruta está lista. ¿Buscar alojamiento cerca del centro turístico?",pt:"O percurso está pronto. Procurar alojamento perto do centro turístico?",nl:"De route is klaar. Accommodatie nabij het toeristisch centrum zoeken?",ru:"Маршрут готов. Найти жильё рядом с туристическим центром?",pl:"Trasa gotowa. Szukać noclegu w pobliżu centrum turystycznego?"},
"Find accommodation in the tourist centre of ":{fr:"Rechercher un hébergement dans le centre touristique de ",de:"Unterkunft im touristischen Zentrum von ",it:"Cerca alloggio nel centro turistico di ",es:"Buscar alojamiento en el centro turístico de ",pt:"Procurar alojamento no centro turístico de ",nl:"Accommodatie zoeken in het toeristische centrum van ",ru:"Найти жильё в туристическом центре города ",pl:"Znajdź nocleg w centrum turystycznym miasta "},
"No, continue to route":{fr:"Non, poursuivre l’itinéraire",de:"Nein, zur Route",it:"No, continua al percorso",es:"No, continuar a la ruta",pt:"Não, continuar para a rota",nl:"Nee, ga verder met route",ru:"Нет, перейти к маршруту",pl:"Nie, przejdź do trasy"},
"Accommodation":{fr:"Hébergement",de:"Unterkunft",it:"Alloggio",es:"Alojamiento",pt:"Alojamento",nl:"Accommodatie",ru:"Жильё",pl:"Nocleg"},
"Choose accommodation before calculating your final route?":{fr:"Choisir un hébergement avant de calculer l’itinéraire final ?",de:"Unterkunft vor Berechnung der endgültigen Route wählen?",it:"Scegli un alloggio prima di calcolare il percorso finale?",es:"¿Elegir alojamiento antes de calcular la ruta final?",pt:"Escolher alojamento antes de calcular a rota final?",nl:"Accommodatie kiezen vóór het berekenen van de route?",ru:"Выбрать жильё перед построением окончательного маршрута?",pl:"Wybrać nocleg przed wyznaczeniem ostatecznej trasy?"},
"No mapped accommodation was found nearby.":{fr:"Aucun hébergement cartographié trouvé à proximité.",de:"Keine kartierte Unterkunft in der Nähe gefunden.",it:"Nessun alloggio mappato trovato nelle vicinanze.",es:"No se encontró alojamiento registrado cerca.",pt:"Não foram encontrados alojamentos mapeados por perto.",nl:"Geen geregistreerde accommodatie in de buurt gevonden.",ru:"Поблизости не найдено отмеченного на карте жилья.",pl:"W pobliżu nie znaleziono noclegów na mapie."},
"The connection to the server was interrupted. The reply did not reach the app.":{fr:"Connexion interrompue. La réponse n’est pas arrivée à l’application.",de:"Serververbindung unterbrochen. Die Antwort kam nicht in der App an.",it:"Connessione al server interrotta. La risposta non è arrivata all’app.",es:"Se interrumpió la conexión. La respuesta no llegó a la aplicación.",pt:"A ligação ao servidor foi interrompida. A resposta não chegou à aplicação.",nl:"Serververbinding onderbroken. Het antwoord kwam niet aan.",ru:"Соединение с сервером прервано. Ответ не получен приложением.",pl:"Połączenie z serwerem przerwane. Odpowiedź nie dotarła do aplikacji."},
"Unable to get a response. ":{fr:"Impossible d’obtenir une réponse. ",de:"Keine Antwort erhalten. ",it:"Impossibile ottenere una risposta. ",es:"No se pudo obtener una respuesta. ",pt:"Não foi possível obter uma resposta. ",nl:"Kon geen antwoord krijgen. ",ru:"Не удалось получить ответ. ",pl:"Nie udało się uzyskać odpowiedzi. "},
"The server returned an unreadable response.":{fr:"Le serveur a renvoyé une réponse illisible.",de:"Der Server lieferte eine unlesbare Antwort.",it:"Il server ha restituito una risposta illeggibile.",es:"El servidor devolvió una respuesta ilegible.",pt:"O servidor devolveu uma resposta ilegível.",nl:"De server stuurde een onleesbaar antwoord.",ru:"Сервер прислал нечитаемый ответ.",pl:"Serwer zwrócił nieczytelną odpowiedź."},
"Could not access the phone location.":{fr:"Impossible d’accéder à la position du téléphone.",de:"Handystandort konnte nicht ermittelt werden.",it:"Impossibile accedere alla posizione del telefono.",es:"No se pudo acceder a la ubicación del teléfono.",pt:"Não foi possível aceder à localização do telemóvel.",nl:"Telefoonlocatie niet beschikbaar.",ru:"Не удалось получить геопозицию телефона.",pl:"Nie można uzyskać lokalizacji telefonu."},
"Which destination did you mean?":{fr:"Quelle destination vouliez-vous dire ?",de:"Welches Ziel meinten Sie?",it:"Quale destinazione intendevi?",es:"¿A qué destino te referías?",pt:"A que destino se refere?",nl:"Welke bestemming bedoel je?",ru:"Какой пункт назначения вы имели в виду?",pl:"O jakie miejsce docelowe chodzi?"},
"Could not complete the search. ":{fr:"Impossible de terminer la recherche. ",de:"Suche konnte nicht abgeschlossen werden. ",it:"Impossibile completare la ricerca. ",es:"No se pudo completar la búsqueda. ",pt:"Não foi possível concluir a pesquisa. ",nl:"Zoeken kon niet worden voltooid. ",ru:"Не удалось завершить поиск. ",pl:"Nie udało się ukończyć wyszukiwania. "},
"Okay. I won’t start directions.":{fr:"D’accord, je ne lance pas l’itinéraire.",de:"In Ordnung, ich starte keine Route.",it:"Va bene, non avvio il percorso.",es:"De acuerdo, no iniciaré la ruta.",pt:"Está bem, não vou iniciar o percurso.",nl:"Goed, ik start geen route.",ru:"Хорошо, маршрут не запускаю.",pl:"W porządku, nie uruchamiam trasy."},
"I want to get to ":{fr:"Je veux aller à ",de:"Ich möchte nach ",it:"Voglio arrivare a ",es:"Quiero llegar a ",pt:"Quero chegar a ",nl:"Ik wil naar ",ru:"Я хочу добраться до ",pl:"Chcę dotrzeć do "},
"How would you like to get here?":{fr:"Comment souhaitez-vous venir ici ?",de:"Wie möchten Sie hierher gelangen?",it:"Come vuoi arrivare qui?",es:"¿Cómo quieres llegar aquí?",pt:"Como quer chegar aqui?",nl:"Hoe wil je hier komen?",ru:"Как вы хотите сюда добраться?",pl:"Jak chcesz tu dotrzeć?"}
});
Object.assign(POCKET_DIALOG_TEXT,{
"Street or station (optional)":{fr:"Rue ou gare (facultatif)",de:"Straße oder Bahnhof (optional)",it:"Via o stazione (facoltativo)",es:"Calle o estación (opcional)",pt:"Rua ou estação (opcional)",nl:"Straat of station (optioneel)",ru:"Улица или вокзал (необязательно)",pl:"Ulica lub stacja (opcjonalnie)"},
"Which city is ":{fr:"Dans quelle ville se trouve ",de:"In welcher Stadt liegt ",it:"In quale città si trova ",es:"¿En qué ciudad está ",pt:"Em que cidade fica ",nl:"In welke stad ligt ",ru:"В каком городе находится ",pl:"W jakim mieście znajduje się "},
"Confirm the town to avoid directions to the wrong station.":{fr:"Confirmez la localité pour éviter une mauvaise gare.",de:"Bestätigen Sie den Ort, damit nicht die falsche Station gewählt wird.",it:"Conferma la località per evitare la stazione sbagliata.",es:"Confirma la localidad para evitar la estación equivocada.",pt:"Confirme a localidade para evitar a estação errada.",nl:"Bevestig de plaats om een verkeerd station te vermijden.",ru:"Подтвердите город, чтобы не выбрать неверную станцию.",pl:"Potwierdź miejscowość, aby uniknąć złej stacji."},
"City or town":{fr:"Ville ou localité",de:"Stadt oder Ort",it:"Città o località",es:"Ciudad o localidad",pt:"Cidade ou localidade",nl:"Stad of plaats",ru:"Город или населённый пункт",pl:"Miasto lub miejscowość"},
"Continue search":{fr:"Poursuivre la recherche",de:"Suche fortsetzen",it:"Continua ricerca",es:"Continuar búsqueda",pt:"Continuar pesquisa",nl:"Zoeken voortzetten",ru:"Продолжить поиск",pl:"Kontynuuj wyszukiwanie"},
"The search finished but returned no locations. Go back and try again.":{fr:"La recherche n’a renvoyé aucun lieu. Revenez en arrière et réessayez.",de:"Die Suche ergab keine Orte. Gehen Sie zurück und versuchen Sie es erneut.",it:"La ricerca non ha trovato luoghi. Torna indietro e riprova.",es:"La búsqueda no encontró lugares. Vuelve atrás e inténtalo de nuevo.",pt:"A pesquisa não encontrou locais. Volte atrás e tente novamente.",nl:"De zoekopdracht vond geen locaties. Ga terug en probeer opnieuw.",ru:"Поиск завершён, но мест не найдено. Вернитесь и попробуйте снова.",pl:"Wyszukiwanie nie znalazło miejsc. Wróć i spróbuj ponownie."},
"No saved conversations yet.":{fr:"Aucune conversation enregistrée.",de:"Noch keine gespeicherten Unterhaltungen.",it:"Nessuna conversazione salvata.",es:"Todavía no hay conversaciones guardadas.",pt:"Ainda não há conversas guardadas.",nl:"Nog geen opgeslagen gesprekken.",ru:"Пока нет сохранённых бесед.",pl:"Brak zapisanych rozmów."},
"Open":{fr:"Ouvrir",de:"Öffnen",it:"Apri",es:"Abrir",pt:"Abrir",nl:"Openen",ru:"Открыть",pl:"Otwórz"},
"New conversation":{fr:"Nouvelle conversation",de:"Neues Gespräch",it:"Nuova conversazione",es:"Nueva conversación",pt:"Nova conversa",nl:"Nieuw gesprek",ru:"Новая беседа",pl:"Nowa rozmowa"},
"Preparing response…":{fr:"Préparation de la réponse…",de:"Antwort wird vorbereitet…",it:"Preparazione della risposta…",es:"Preparando respuesta…",pt:"A preparar a resposta…",nl:"Antwoord voorbereiden…",ru:"Готовлю ответ…",pl:"Przygotowuję odpowiedź…"},
"Pocket AI is preparing a response…":{fr:"Pocket AI prépare une réponse…",de:"Pocket AI bereitet eine Antwort vor…",it:"Pocket AI sta preparando una risposta…",es:"Pocket AI está preparando una respuesta…",pt:"Pocket AI está a preparar uma resposta…",nl:"Pocket AI bereidt een antwoord voor…",ru:"Pocket AI готовит ответ…",pl:"Pocket AI przygotowuje odpowiedź…"},
"Information":{fr:"Informations",de:"Informationen",it:"Informazioni",es:"Información",pt:"Informações",nl:"Informatie",ru:"Информация",pl:"Informacje"}
});
function dialogText(ro,en){
 const lang=state.language||'ro';
 if(lang==='ro')return ro;
 if(lang==='en')return en;
 return POCKET_DIALOG_TEXT[en]?.[lang]||en;
}
// Convert locally familiar city names before sending the same verified lookup
// that succeeds for canonical provider names. In particular, the UK city field
// must send "London" whether the user types "London" or "Londra".
function canonicalAddressCityQuery(countryCode,input){
 const query=String(input||'').trim();
 const norm=query.normalize('NFD').replace(/\\p{M}/gu,'').toLowerCase();
 const aliases={gb:{londra:'London',londres:'London',londen:'London',londyn:'London','лондон':'London'}};
 const known=aliases[String(countryCode||'').toLowerCase()]||{};
 if(known[norm])return known[norm];
 // A user deleting "Londra" to "Londr" must not lose an already known city.
 // Wait for >=5 characters so "Lon"/"Lond" remain open to other towns.
 if(norm.length>=5){
   const matching=Object.entries(known).filter(([alias])=>alias.startsWith(norm));
   const cityNames=[...new Set(matching.map(([,city])=>city))];
   if(cityNames.length===1)return cityNames[0];
 }
 return query;
}
// Reusable contract for editable selector lists; never limit search results,
// itineraries, news or other substantive tables with this helper.
const PROGRESSIVE_VISIBLE_CHOICES=4;
function progressiveMatchText(value){
 return String(value||'').normalize('NFD').replace(/\\p{M}/gu,'').toLowerCase().trim();
}
function renderProgressiveChoiceList(list,verifiedOptions,makeChoice){
 const visible=(Array.isArray(verifiedOptions)?verifiedOptions:[]).slice(0,PROGRESSIVE_VISIBLE_CHOICES);
 list.replaceChildren(...visible.map((point,i)=>makeChoice(point,i)));
 return visible.length;
}
// Preserve the verified canonical city for routing; localize only its label.
function localizedAddressCandidateLabel(stage,point,language,countryCode){
 const label=String(point?.label||point?.city||'');
 if(stage!=='city'||language!=='ro'||String(countryCode||'').toUpperCase()!=='GB')return label;
 if(String(point?.city||'').normalize('NFD').toLowerCase()!=='london')return label;
 return label.replace(/\\bLondon\\b/gi,'Londra');
}
function renderStructuredAddressPicker({body,prefix,onSelect,onBack,region='',countryCode='',prefillCity='',prefillCityPoint=null,cityOnly=false}){
 const ro=state.language==='ro';
 const t=(a,b)=>dialogText(a,b);
 const display=new Intl.DisplayNames([state.language],{type:'region'});
 // ISO 3166-1 codes only: generating all 676 letter pairs adds invalid
 // "Unknown Region" rows and duplicate UK/GB choices (UK is not ISO 3166-1).
 // Preserve world-wide address selection; the mixed-route provider may still
 // support only some of these countries.
 const countries='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
 const card=(label,action)=>{const b=document.createElement('button');b.type='button';b.className='module-result-card';b.textContent=label;b.onclick=action;return b};
  const normalize=value=>value.normalize('NFD').replace(/\\p{M}/gu,'').toLowerCase().trim();
  const selected={};
  const fields={};
  const order=['country','city','street','number'];
  const showOptions=(stage,list,points)=>renderProgressiveChoiceList(list,points,
   (point,i)=>card((i+1)+'. '+(stage==='city'?localizedAddressCandidateLabel(stage,point,state.language,selected.country?.code):point.label),()=>choose(stage,point)));
  const postcode=document.createElement('input');
  postcode.placeholder=t('Cod poștal (opțional)','Postcode (optional)');
  postcode.setAttribute('aria-label',postcode.placeholder);
  postcode.autocomplete='postal-code';
  postcode.style.cssText='box-sizing:border-box;width:100%;padding:12px;margin:0 0 12px;background:#102d40;color:white;border:1px solid #5ecbd9;border-radius:10px;font:inherit';
  let withoutStreet=false;
  const status=document.createElement('p');status.style.cssText='font-size:13px;color:#bce4ed;line-height:1.45;margin:7px 0 10px';
  const confirmed=card(cityOnly?t('Confirmă destinația','Confirm destination'):t('Confirmă localitatea / adresa','Confirm destination'),()=>{
   const pendingNumber=cityOnly?'':fields.number?.input.value.trim();
   const pendingStreet=cityOnly?'':fields.street?.input.value.trim();
   if((pendingNumber&&!selected.number)||(pendingStreet&&!selected.street)){
    status.textContent=t('Strada sau numărul nu sunt verificate. Selectează o sugestie verificată ori folosește butonul separat pentru centrul localității. Datele neverificate NU devin destinație.','Street or house number is not verified. Select a verified suggestion or use the separate town-centre button. Unverified address text is NOT a destination.');
    approximateButton.hidden=!selected.city||!Number.isFinite(selected.city.latitude)||!Number.isFinite(selected.city.longitude);
    return;
   }
   const point=cityOnly?selected.city:(selected.number||selected.street||selected.city);
   if(!point||!Number.isFinite(point.latitude)||!Number.isFinite(point.longitude))return;
   onSelect({...point,approximation:cityOnly?'locality':selected.number||selected.street?.kind==='station'?null:selected.street?'street':'locality',verified_region:region,verified_country:countryCode||selected.country?.code});
  });
  const approximateButton=card(t('Continuă la centrul localității (nu la numărul introdus)','Continue to town centre (not the entered house number)'),()=>{
   if(!selected.city||!Number.isFinite(selected.city.latitude)||!Number.isFinite(selected.city.longitude))return;
   onSelect({...selected.city,approximation:'locality',verified_region:region,verified_country:countryCode||selected.country?.code});
  });
  approximateButton.hidden=true;
  confirmed.disabled=true;
  let generation=0,timer;
  // Ephemeral suggestions, scoped to this destination picker only.
  const localityIndex=new Map();
  let localityEpoch=0;
  const contextCity=stage=>stage==='city'?'':stage==='number'
   ?(selected.city?.city||'')+'::'+(selected.street?.street||'')
   :(selected.city?.city||'');
  const keyFor=(stage,q)=>[selected.country?.code||'',contextCity(stage),region,stage,normalize(q)].join('|');
  const remember=(stage,q,points)=>{
   if(!Array.isArray(points)||!points.length)return;
   const key=keyFor(stage,q);
   localityIndex.delete(key);
   localityIndex.set(key,points.slice(0,20));
   while(localityIndex.size>60)localityIndex.delete(localityIndex.keys().next().value);
  };
  const matchCached=(stage,q)=>{
   const prefix=normalize(stage==='city'?canonicalAddressCityQuery(selected.country?.code,q):q);
   const matches=new Map();
   const contextCountry=selected.country?.code||'';
   const cityKey=contextCity(stage);
   for(const [key,items] of localityIndex){
    const parts=key.split('|');
    if(parts[0]!==contextCountry||parts[1]!==cityKey||parts[2]!==region||parts[3]!==stage)continue;
    for(const point of items){
     const label=stage==='city'?String(point.city||point.label||''):
       stage==='street'?String(point.street||point.label||''):
       String(point.houseNumber||point.label||'');
     if(!prefix||!(normalize(label).startsWith(prefix)||normalize(label).split(/\s+/).some(w=>w.startsWith(prefix))))continue;
     const identity=stage==='city'?[normalize(point.label||label),point.country_code,point.latitude,point.longitude].join('|'):
       [normalize(label),normalize(point.postcode||''),normalize(point.city||'')].join('|');
     matches.set(identity,point);
    }
   }
   return [...matches.values()].slice(0,4);
  };
  // Prepare a bounded, verified prefix sample for the next stage, not an
  // entire country or city's street database. Missing letters fetch on demand.
  function prewarmNext(stage){
   const next={country:'city',city:'street',street:'number'}[stage];
   if(!next||(cityOnly&&next!=='city')||!selected.country||
      (next!=='city'&&!selected.city)||
      (next==='number'&&(!selected.street||selected.street.kind==='station')))return;
   const epoch=++localityEpoch;
   const snapshot={country:selected.country.code.toLowerCase(),city:selected.city?.city||'',
    street:selected.street?.street||'',region,
    cityPoint:selected.city?{latitude:selected.city.latitude,longitude:selected.city.longitude}:undefined};
   const seeds=next==='city'?['a','l','m']:
    next==='street'?(snapshot.country==='ro'?['s','a','c']:['a','m','s']):['1'];
   for(const query of seeds){
    if(localityIndex.has(keyFor(next,query)))continue;
    void fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({address_lookup:{...snapshot,stage:next,query}})})
     .then(r=>r.ok?r.json():null).then(data=>{
      if(epoch!==localityEpoch||!data||
         selected.country?.code.toLowerCase()!==snapshot.country||
         (selected.city?.city||'')!==snapshot.city||
         (selected.street?.street||'')!==snapshot.street)return;
      remember(next,query,data.candidates);
     }).catch(()=>{});
   }
  }
  function prewarmStreets(){prewarmNext('city');}
  function clearAfter(stage){
   for(const key of order.slice(order.indexOf(stage)+1)){
    delete selected[key];fields[key].input.value='';fields[key].input.disabled=true;fields[key].list.replaceChildren();
    fields[key].search.disabled=true;
   }
   const confirmedPoint=selected.number||selected.street||selected.city;
   confirmed.disabled=!confirmedPoint||!Number.isFinite(confirmedPoint.latitude)||!Number.isFinite(confirmedPoint.longitude);
   approximateButton.hidden=true;
   // A rural number can be entered without a named street.
   if(selected.city&&!cityOnly){fields.number.input.disabled=false;fields.number.search.disabled=false;}
  }
  async function choose(stage,point){
   generation++;
   if(stage!=='number')withoutStreet=false;
   status.textContent='';
   approximateButton.hidden=true;
   selected[stage]=point;
   fields[stage].input.value=stage==='number'?(point.houseNumber||point.label):stage==='street'?(point.street||point.label):stage==='city'?localizedAddressCandidateLabel(stage,point,state.language,selected.country?.code):point.label;
   fields[stage].list.replaceChildren();
   clearAfter(stage);
   if(stage==='city'){
    // Street/number hints belong to the previous town, but previously verified
    // city candidates remain useful when the user later edits the city field.
    for(const key of localityIndex.keys())if(key.split('|')[3]!=='city')localityIndex.delete(key);
    prewarmStreets();
    fields.number.input.disabled=fields.number.search.disabled=cityOnly;
    fields.street.input.disabled=fields.street.search.disabled=cityOnly;
    status.textContent=t('Localitate verificată. Poți căuta strada sau stația încă de la prima literă, ori confirma centrul localității.','Verified town. Search for a street or station from the first letter, or confirm the town centre.');
   // No automatic keyboard: the user taps Street when ready.
    return;
   }
   if(stage==='street'&&point.kind==='station'){
     // A verified station is already an exact destination; no fictitious
     // street number should be requested for it.
     fields.number.input.disabled=fields.number.search.disabled=true;
     status.textContent=t('Stație verificată. Poți confirma destinația.','Verified station. You can confirm the destination.');
     return;
   }
   const next=cityOnly?null:order[order.indexOf(stage)+1];
   if(next){fields[next].input.disabled=false;fields[next].search.disabled=false;/* Leave next input available without focusing it. */}
   prewarmNext(stage);
  }
  async function lookup(stage,discover=false){
   const {input,list}=fields[stage];
   if(input.disabled&&!discover)return;
   for(const field of Object.values(fields))if(field.list!==list)field.list.replaceChildren();
   const cityAtRequest=selected.city;
   const current=()=>list.isConnected&&(discover?selected.city===cityAtRequest:request===generation);
   const typedQuery=input.value.trim();
   const query=stage==='city'?canonicalAddressCityQuery(selected.country?.code,typedQuery):typedQuery;
   const request=++generation;
   if(query.length<1){list.replaceChildren();return;}
   if(stage==='country'){
    const q=normalize(query);
    showOptions(stage,list,countries.map(code=>({code,label:display.of(code)}))
     .filter(point=>normalize(point.label).includes(q)||point.code.toLowerCase()===q)
     .sort((a,b)=>(normalize(b.label).startsWith(q)?1:0)-(normalize(a.label).startsWith(q)?1:0)||a.label.localeCompare(b.label,state.language)));

    return;
   }
   if(!query&&stage==='city'){list.replaceChildren();return;}
   if(stage==='city'||stage==='street'||stage==='number'){
    const cached=matchCached(stage,query);
    if(cached.length)showOptions(stage,list,cached);
    else list.textContent=t('Se caută…','Searching…');
   }else list.textContent=t('Se caută…','Searching…');
   try{
    const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({address_lookup:{stage,query,country:selected.country.code.toLowerCase(),
      city:selected.city?.city||'',region:region||'',cityPoint:selected.city?{latitude:selected.city.latitude,longitude:selected.city.longitude}:undefined,street:selected.street?.street||'',postcode:stage==='number'?postcode.value.trim():''}})});
    if(!response.ok)throw new Error();
    const {candidates:rawCandidates,attribution}=await response.json();
    // Provider replies can contain the same street/postcode multiple times.
    // Display each verified address or station identity exactly once.
    const seenCandidates=new Set();
    const candidates=(Array.isArray(rawCandidates)?rawCandidates:[]).filter(point=>{
      const normalized=value=>normalize(String(value||'')).replace(/[^\p{L}\p{N}]/gu,'');
      const key=stage==='street'
        ?[point.kind==='station'?'station':'street',normalized(point.street||point.label),normalized(point.city||selected.city?.city),normalized(point.postcode)].join('|')
        :stage==='number'?[normalized(point.houseNumber),normalized(point.street),normalized(point.postcode),normalized(point.city)].join('|')
        :[normalized(point.city||point.label),point.country_code,Number(point.latitude).toFixed(3),Number(point.longitude).toFixed(3)].join('|');
      if(seenCandidates.has(key))return false;
      seenCandidates.add(key);
      return true;
    });
    if(!current())return;
    // Keep verified provider results for every typed prefix. A later empty
    // response must not erase matching verified cities or streets already seen.
    const saved=matchCached(stage,query);
    if(candidates.length)remember(stage,query,candidates);
    const used=new Set(candidates.map(point=>[point.label,point.latitude,point.longitude].join('|')));
    for(const point of saved){
      const id=[point.label,point.latitude,point.longitude].join('|');
      if(!used.has(id)){candidates.push(point);used.add(id)}
    }
    if(discover){
     withoutStreet=!candidates.length;
     // No result from the street provider must never lock a rural address field.
     input.disabled=fields.street.search.disabled=false;
     if(withoutStreet){list.replaceChildren();status.textContent=t('Nu există sugestii pentru stradă. Poți introduce un număr rural fără stradă sau poți confirma localitatea.','No street suggestions. You can search for a rural house number without a street or confirm the town.');return;}
    }
    candidates.sort((a,b)=>(a.matchRank??1)-(b.matchRank??1)||a.label.localeCompare(b.label,state.language,{numeric:true}));
    showOptions(stage,list,candidates);
    if(attribution&&candidates.length){const credit=document.createElement('small');credit.textContent=attribution;list.append(credit);}
    if(!candidates.length){
     list.textContent=t('Nu am găsit rezultate verificate.','No verified matches.');
     if(stage==='number'&&fields.number.input.value.trim()){
      status.textContent=t('Numărul nu este verificat în hărți. Poți căuta alt număr sau continua spre centrul localității; nu vom inventa o adresă exactă.','House number is not verified on the map. Search another number or continue to town centre; we will not invent an exact address.');
      approximateButton.hidden=!selected.city||!Number.isFinite(selected.city.latitude)||!Number.isFinite(selected.city.longitude);
     }
    }
   }catch{
    if(discover&&current())input.disabled=fields.street.search.disabled=false;
    if(current())list.textContent=t('Căutarea nu este disponibilă acum.','Search is unavailable right now.');
   }
  }
  const labels=[t('Țară','Country'),t('Localitate','City or town'),t('Stradă / stație (opțional)','Street or station (optional)'),t('Număr (opțional)','House number (optional)')];
  order.forEach((stage,index)=>{
   const row=document.createElement('div');
   row.style.marginBottom='8px';
   const line=document.createElement('div');
   line.style.cssText='display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px';
   const input=document.createElement('input');
   input.placeholder=labels[index];input.setAttribute('aria-label',labels[index]);
   input.style.cssText='min-width:0;padding:10px;background:#102d40;color:white;border:1px solid #5ecbd9;border-radius:10px';
   const search=card('🔍',()=>{clearTimeout(timer);lookup(stage);});
   search.setAttribute('aria-label',t('Caută','Search')+' '+labels[index]);
   input.disabled=search.disabled=index>0;
   const list=document.createElement('div');
   list.style.cssText='max-height:18rem;overflow:auto';
   fields[stage]={input,search,list,row};
   input.onfocus=()=>{if(input.value)input.select();};
   input.addEventListener('pointerup',event=>{if(selected[stage]){event.preventDefault();input.select();}});
   input.oninput=()=>{
    generation++;clearTimeout(timer);delete selected[stage];if(stage!=='number')withoutStreet=false;list.replaceChildren();clearAfter(stage);
    approximateButton.hidden=!selected.city||cityOnly||!Number.isFinite(selected.city.latitude)||!Number.isFinite(selected.city.longitude);
    if(stage==='street'&&selected.city&&!cityOnly){fields.number.input.disabled=false;fields.number.search.disabled=false;}
    if(input.value.trim().length>=1){
     if(stage==='city'||stage==='street'||stage==='number'){
      const cached=matchCached(stage,input.value.trim());
      if(cached.length)showOptions(stage,list,cached);
     }
     timer=setTimeout(()=>{if(input.isConnected)lookup(stage);},stage==='street'?140:200);
    }
   };
   input.onkeydown=event=>{if(event.key==='Enter')search.click();};
   line.append(input,search);row.append(line,list);body.append(row);
  });
  postcode.onfocus=()=>{if(postcode.value)postcode.select();};
  // Postal codes are optional hints, not a prerequisite for routing.
  // Keep an already verified address selected when the postal text changes.
  postcode.oninput=()=>{status.textContent=t('Codul poștal este opțional; destinația verificată rămâne selectată.','Postcode is optional; the verified destination remains selected.');};
  if(cityOnly){fields.street.row.hidden=true;fields.number.row.hidden=true;postcode.hidden=true;confirmed.textContent=t('Confirmă localitatea de destinație','Confirm destination town');}
   body.append(postcode,status,confirmed,approximateButton);
  if(typeof onBack==='function')body.append(card(t('Înapoi','Back'),onBack));
  if(countryCode){
   const code=String(countryCode).toUpperCase();
   selected.country={code,label:display.of(code)};
   fields.country.input.value=selected.country.label;
   fields.country.input.disabled=true;fields.country.search.disabled=true;
   fields.city.input.disabled=false;fields.city.search.disabled=false;
   if(region){const area=document.createElement('p');area.textContent=t('Regiune selectată: ','Selected region: ')+region;area.style.cssText='font-size:14px;color:#cbe7ef;margin:3px 0 13px';body.prepend(area)}
   if(prefillCityPoint&&Number.isFinite(Number(prefillCityPoint.latitude))&&Number.isFinite(Number(prefillCityPoint.longitude))){
     selected.city={...prefillCityPoint,city:String(prefillCityPoint.city||prefillCity||''),label:String(prefillCityPoint.label||prefillCity)};
     fields.city.input.value=String(prefillCity||selected.city.city);
     fields.city.input.disabled=fields.city.search.disabled=true;
     fields.city.row.hidden=true;
     confirmed.disabled=false;
     if(!cityOnly){fields.street.input.disabled=fields.street.search.disabled=false;fields.number.input.disabled=fields.number.search.disabled=false;}
     status.textContent=t('Localitate verificată: ','Verified town: ')+fields.city.input.value;
     prewarmStreets();
    }else if(prefillCity){
     // Keep the already selected village visible and locked even when mapping
     // providers cannot supply its centroid. House-number lookup can still run.
     selected.city={city:String(prefillCity),label:[prefillCity,region].filter(Boolean).join(', '),latitude:null,longitude:null};
     fields.city.input.value=String(prefillCity);
     fields.city.input.disabled=fields.city.search.disabled=true;
     fields.city.row.hidden=true;
     confirmed.disabled=true;
     if(!cityOnly){fields.street.input.disabled=fields.street.search.disabled=false;fields.number.input.disabled=fields.number.search.disabled=false;}
     status.textContent=t('Localitatea aleasă este păstrată. Coordonatele nu sunt încă verificate; caută strada sau numărul, fără a repeta alegerea localității.','The chosen town is retained. Its coordinates are not verified yet; search for a street or number without selecting the town again.');
    }
    fields.country.row.hidden=true;
    const countryNote=document.createElement('p');countryNote.style.cssText='font-size:14px;color:#cbe7ef;margin:5px 0 10px';
    countryNote.textContent=t('Țară: ','Country: ')+selected.country.label;
    body.prepend(countryNote);
  }
 }

function showPreciseJourney(choice){
 const ro=state.language==='ro';
 const t=(a,b)=>dialogText(a,b);
 const body=$('moduleLayerBody');
 const display=new Intl.DisplayNames([state.language],{type:'region'});
 const countries='AL AD AT BE BA BG BY CH CY CZ DE DK EE ES FI FR GB GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS SE SI SK SM TR UA VA XK'.split(' ');
 const card=(label,action)=>{
  const button=document.createElement('button');
  button.type='button';button.className='module-result-card';button.textContent=label;button.onclick=action;
  return button;
 };
 let origin=null;
 const ready=destination=>{
  setModuleLayerMode(t('Confirmă călătoria','Confirm journey'));
  const summary=document.createElement('p');
  summary.textContent=(origin?.label||t('Locația mea','My location'))+' → '+destination.label;
  body.append(summary,card(t('Calculează traseul','Find routes'),()=>{
   if(state.busy||state.moduleSearchBusy)return;
   if(choice.journeyMode==='transit'){
    runModuleSearch({...choice,transitDirect:true,journeyOrigin:origin,transitDestination:destination,transitQuery:destination.label,prompt:t('Caută transport mixt către ','Find mixed transport to ')+destination.label});
    return;
   }
   state.pendingTravelMode='drive';
   state.pendingRouteDestination=destination;
   state.routeSearchContext={destination_query:destination.label,destination,origin,origin_query:origin?.label||'',pending:'profile',profile:null};
   $('moduleQuickLayer').classList.remove('open');
   $('moduleQuickLayer').setAttribute('aria-hidden','true');
   inputEl.value=(TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en)[3];
   submitMessage();
  }),card(t('Schimbă destinația','Change destination'),destinationPicker),card(t('Schimbă plecarea','Change departure'),departurePicker));
 };
 function addressPicker(prefix,onSelect){
  setModuleLayerMode(prefix);
  renderStructuredAddressPicker({body:$('moduleLayerBody'),prefix,onSelect,onBack:departurePicker});
 }
 function destinationPicker(){addressPicker(t('Destinație','Destination'),ready);}
 function departurePicker(){
  setModuleLayerMode(t('Alege plecarea','Choose departure'));
  body.append(card(t('Locația mea (GPS)','My location (GPS)'),()=>{origin=null;destinationPicker();}),
   card(t('Alege o adresă de plecare','Choose a departure address'),()=>addressPicker(t('Plecare','Departure'),point=>{origin=point;destinationPicker();})));
 }
 departurePicker();
}
function showTransitDestination(choice){state.moduleSearchCategory=choice;setModuleLayerMode(choice.mixedJourney?localizedQuickChoiceTitle(choice):'Transport public · A → B');const body=$('moduleLayerBody');const label=document.createElement('label');label.textContent=choice.mixedJourney&&state.language!=='ro'?'Destination (B)':'Destinație (B)';label.style.cssText='display:block;font-weight:700;margin:12px 0';const field=document.createElement('input');field.type='text';field.placeholder=choice.mixedJourney?(state.language==='ro'?'Localitate, adresă sau cod poștal, țară':'City, address or postcode, country'):'Stație, adresă sau cod poștal';field.style.cssText='width:100%;padding:13px;border-radius:12px;background:#102d40;color:white;border:1px solid #5ecbd9';const go=document.createElement('button');go.type='button';go.textContent=choice.mixedJourney&&state.language!=='ro'?'Search journeys':'Caută variante de transport';go.style.cssText='display:block;width:100%;margin-top:14px;padding:15px;border-radius:24px;background:#b92d42;color:white;font-weight:800';go.onclick=()=>{const destination=field.value.trim();if(!destination){return}const resolvedDestination=destination;const submitTransit=place=>runModuleSearch({...choice,transitQuery:place,prompt:'Vreau variante de transport public de la locația mea până la '+place+'. Arată toate alternativele și orele de plecare.'});if(choice.journeyMode==='drive'){if(state.busy)return;state.pendingTravelMode='drive';state.pendingRouteDestination=null;state.routeSearchContext={destination_query:destination,destination:null,pending:'profile',profile:null,origin_query:''};$('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');inputEl.value=(TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en)[3];submitMessage();return}if(choice.mixedJourney){submitTransit(resolvedDestination);return}const station=/\\b(station|underground|railway|tube|gara|statie|stația)\\b/i.test(destination);const hasCity=/[,]|\\b(london|londra|grays|thurrock|essex|paris|berlin|rome|madrid|manchester|birmingham|liverpool|united kingdom|uk|england|france|germany|italy|spain)\\b/i.test(destination);if(station&&!hasCity){body.innerHTML='';const heading=document.createElement('h3');heading.textContent=dialogText('În ce oraș se află ','Which city is ')+destination+'?';const note=document.createElement('p');note.textContent=dialogText('Confirmă localitatea pentru a evita un traseu către o stație greșită.','Confirm the town to avoid directions to the wrong station.');const city=document.createElement('input');city.placeholder=dialogText('Oraș sau localitate','City or town');city.style.cssText='width:100%;padding:13px;border-radius:12px;background:#102d40;color:white;border:1px solid #5ecbd9';const confirm=document.createElement('button');confirm.textContent=dialogText('Continuă căutarea','Continue search');confirm.style.cssText='display:block;width:100%;margin-top:14px;padding:15px;border-radius:24px;background:#b92d42;color:white;font-weight:800';confirm.onclick=()=>{const place=city.value.trim();if(!place){return;}submitTransit((/^londra$/i.test(place)?'London':place)+' '+destination)};city.onkeydown=e=>{if(e.key==='Enter')confirm.click()};body.append(heading,note,city,confirm);return;}submitTransit(resolvedDestination)};field.onkeydown=e=>{if(e.key==='Enter')go.click()};body.append(label,field,go)}
const TRANSIT_ACCESS_TEXT={"ro":["Variante de transport public","Transport ales","Înapoi","Alege varianta și stația de îmbarcare","Plecare","Sosire","Linia","Îmbarcare","Coborâre","Vezi traseul pietonal și navigarea","Se calculează mersul pe jos până la stație…","Stația exactă nu are coordonate verificate. Nu am înlocuit-o cu strada sau cu altă stație.","Permite accesul la GPS pentru traseul până la stație.","Traseul pietonal nu a putut fi verificat. Reîncearcă.","Nu mai este suficient timp pentru această plecare. Actualizează variantele.","Actualizează plecările","Mers pe jos","Sursa","Itinerarul ales","Așteaptă răspunsul curent.","Reîncearcă traseul pietonal","Ora de plecare sau durata mersului pe jos nu este confirmată. Verifică plecarea.","Pe jos","Autobuz","Metrou","Tren","Tramvai","Vapor","Transport"],"en":["Public transport options","Selected journey","Back","Choose a journey and boarding stop","Departure","Arrival","Line","Board here","Alight","View walking route and navigation","Calculating the walk to the stop…","The exact stop has no verified coordinates. No street or other stop was substituted.","Allow GPS access for the walk to the stop.","The walking route could not be verified. Retry.","There is no longer enough time for this departure. Refresh the options.","Refresh departures","Walking","Source","Selected itinerary","Wait for the current reply.","Retry walking route","Departure time or walking duration is unconfirmed. Check the departure.","Walk","Bus","Underground","Train","Tram","Ferry","Transport"],"fr":["Trajets en transports publics","Trajet choisi","Retour","Choisir un trajet et un arrêt","Départ","Arrivée","Ligne","Embarquement","Descente","Voir le trajet à pied et la navigation","Calcul du trajet à pied…","L’arrêt exact n’a pas de coordonnées vérifiées. Aucun autre lieu ne le remplace.","Autorisez le GPS pour rejoindre l’arrêt.","Trajet à pied non vérifié. Réessayez.","Temps insuffisant pour ce départ. Actualisez les trajets.","Actualiser les départs","Marche","Source","Itinéraire choisi","Attendez la réponse.","Réessayer le trajet à pied","Heure de départ ou durée à pied non confirmée. Vérifiez le départ.","À pied","Bus","Métro","Train","Tramway","Ferry","Transport"],"de":["Öffentliche Verkehrsverbindungen","Gewählte Verbindung","Zurück","Verbindung und Haltestelle wählen","Abfahrt","Ankunft","Linie","Einstieg","Ausstieg","Fußweg und Navigation anzeigen","Fußweg zur Haltestelle wird berechnet…","Keine bestätigten Koordinaten der genauen Haltestelle. Kein anderer Ort wurde eingesetzt.","GPS für den Fußweg erlauben.","Fußweg nicht verifiziert. Erneut versuchen.","Nicht mehr genug Zeit für diese Abfahrt. Verbindungen aktualisieren.","Abfahrten aktualisieren","Fußweg","Quelle","Gewählte Reise","Bitte Antwort abwarten.","Fußweg erneut versuchen","Abfahrtszeit oder Gehzeit unbestätigt. Abfahrt prüfen.","Zu Fuß","Bus","U-Bahn","Zug","Straßenbahn","Fähre","Verkehrsmittel"],"it":["Opzioni di trasporto pubblico","Viaggio scelto","Indietro","Scegli viaggio e fermata","Partenza","Arrivo","Linea","Salita","Discesa","Vedi percorso a piedi e navigazione","Calcolo del percorso alla fermata…","La fermata esatta non ha coordinate verificate. Non è stata sostituita.","Consenti il GPS per raggiungere la fermata.","Percorso a piedi non verificato. Riprova.","Tempo insufficiente per questa partenza. Aggiorna le opzioni.","Aggiorna partenze","A piedi","Fonte","Itinerario scelto","Attendi la risposta.","Riprova percorso a piedi","Orario o durata a piedi non confermati. Verifica la partenza.","A piedi","Autobus","Metropolitana","Treno","Tram","Traghetto","Trasporto"],"es":["Opciones de transporte público","Trayecto elegido","Volver","Elige trayecto y parada","Salida","Llegada","Línea","Subida","Bajada","Ver ruta a pie y navegación","Calculando el camino a la parada…","La parada exacta no tiene coordenadas verificadas. No se sustituyó por otro lugar.","Permite el GPS para llegar a la parada.","Ruta a pie no verificada. Reintenta.","Ya no hay tiempo para esta salida. Actualiza las opciones.","Actualizar salidas","A pie","Fuente","Itinerario elegido","Espera la respuesta.","Reintentar ruta a pie","Horario o duración a pie sin confirmar. Comprueba la salida.","A pie","Autobús","Metro","Tren","Tranvía","Ferri","Transporte"],"pt":["Opções de transporte público","Viagem escolhida","Voltar","Escolher viagem e paragem","Partida","Chegada","Linha","Embarque","Desembarque","Ver percurso a pé e navegação","A calcular o caminho para a paragem…","A paragem exata não tem coordenadas verificadas. Não foi substituída.","Permita o GPS para chegar à paragem.","Percurso a pé não verificado. Tente novamente.","Já não há tempo para esta partida. Atualize as opções.","Atualizar partidas","A pé","Fonte","Itinerário escolhido","Aguarde a resposta.","Tentar percurso a pé novamente","Horário ou duração a pé não confirmados. Verifique a partida.","A pé","Autocarro","Metro","Comboio","Elétrico","Barco","Transporte"],"nl":["Opties openbaar vervoer","Gekozen reis","Terug","Kies reis en instaphalte","Vertrek","Aankomst","Lijn","Instappen","Uitstappen","Bekijk wandelroute en navigatie","Wandelroute naar halte berekenen…","De exacte halte heeft geen bevestigde coördinaten. Geen andere plek is ingevuld.","Sta GPS toe voor de wandeling naar de halte.","Wandelroute niet geverifieerd. Probeer opnieuw.","Onvoldoende tijd voor dit vertrek. Vernieuw de opties.","Vertrekken vernieuwen","Lopen","Bron","Gekozen reisplan","Wacht op het antwoord.","Wandelroute opnieuw proberen","Vertrek of wandeltijd niet bevestigd. Controleer het vertrek.","Lopen","Bus","Metro","Trein","Tram","Veerboot","Vervoer"],"ru":["Варианты общественного транспорта","Выбранная поездка","Назад","Выберите поездку и остановку","Отправление","Прибытие","Линия","Посадка","Высадка","Пеший маршрут и навигация","Расчёт пути до остановки…","У точной остановки нет подтверждённых координат. Другое место не подставлено.","Разрешите GPS для пути к остановке.","Пеший маршрут не подтверждён. Повторите.","Времени до отправления недостаточно. Обновите варианты.","Обновить отправления","Пешком","Источник","Выбранный маршрут","Дождитесь ответа.","Повторить пеший маршрут","Время отправления или пешего пути не подтверждено. Проверьте отправление.","Пешком","Автобус","Метро","Поезд","Трамвай","Паром","Транспорт"],"pl":["Opcje transportu publicznego","Wybrana podróż","Wróć","Wybierz podróż i przystanek","Odjazd","Przyjazd","Linia","Wsiadanie","Wysiadanie","Pokaż trasę pieszą i nawigację","Obliczanie drogi do przystanku…","Dokładny przystanek nie ma potwierdzonych współrzędnych. Nie zastąpiono go innym miejscem.","Zezwól na GPS, aby dojść do przystanku.","Trasa piesza niezweryfikowana. Spróbuj ponownie.","Za mało czasu do tego odjazdu. Odśwież opcje.","Odśwież odjazdy","Pieszo","Źródło","Wybrana trasa","Poczekaj na odpowiedź.","Ponów trasę pieszą","Odjazd lub czas dojścia niepotwierdzony. Sprawdź odjazd.","Pieszo","Autobus","Metro","Pociąg","Tramwaj","Prom","Transport"]};
function transitAccessText(){return TRANSIT_ACCESS_TEXT[state.language]||TRANSIT_ACCESS_TEXT.en}
function transitModeName(mode){const t=transitAccessText(),key=String(mode||'').toLowerCase();return /^(walking|walk|foot|pedestrian)$/.test(key)?t[22]:key==='bus'?t[23]:key==='tube'?t[24]:/rail|train/.test(key)?t[25]:key==='tram'?t[26]:/river|ferry/.test(key)?t[27]:mode||t[28]}
// Render duration consistently in all ten app languages; calculations retain raw minutes.
function formatTravelDurationMinutes(value){
 if(!Number.isFinite(Number(value))||Number(value)<0)return '—';
 const total=Math.round(Number(value)),days=Math.floor(total/1440),hours=Math.floor(total%1440/60),minutes=total%60;
 const parts=[];
 const unit=(count,name)=>{try{return new Intl.NumberFormat(state.language||'ro',{style:'unit',unit:name,unitDisplay:'long'}).format(count)}catch{return count+' '+({day:'d',hour:'h',minute:'min'}[name]||name)}};
 if(days)parts.push(unit(days,'day'));
 if(hours)parts.push(unit(hours,'hour'));
 if(minutes||!parts.length)parts.push(unit(minutes,'minute'));
 return parts.join(' ');
}
function transitClock(value,zone){if(!value)return '—';const s=String(value);if(/(?:Z|[+-]\\d{2}:?\\d{2})$/i.test(s)){const d=new Date(s);if(Number.isFinite(d.getTime()))try{return d.toLocaleTimeString(state.language,{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:zone||'Europe/London'})}catch{}}
 const m=s.match(/(?:T|\\s)(\\d{2}:\\d{2})/);return m?m[1]:/^\\d{2}:\\d{2}/.test(s)?s.slice(0,5):'—';}
function validTransitBoardingStop(stop){return stop&&typeof stop.label==='string'&&stop.label.trim()&&Number.isFinite(stop.latitude)&&Number.isFinite(stop.longitude)&&Math.abs(stop.latitude)<=90&&Math.abs(stop.longitude)<=180}
function transitDistance(a,b){const rad=Math.PI/180,dlat=(b.latitude-a.latitude)*rad,dlon=(b.longitude-a.longitude)*rad,h=Math.sin(dlat/2)**2+Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)))}
function transitWalkingMatches(route,stop){if(!validMapRoute(route)||!['walk','foot'].includes(route.profile)||!validTransitBoardingStop(stop))return false;const end=route.coordinates.at(-1),destination=route.destination;return destination&&Number.isFinite(destination.latitude)&&Number.isFinite(destination.longitude)&&transitDistance(destination,stop)<2&&transitDistance({latitude:end[1],longitude:end[0]},stop)<=120}
function cancelTransitAccess(clearSelection=false){state.transitAccessGeneration=(state.transitAccessGeneration||0)+1;state.transitAccessAbort?.abort();state.transitAccessAbort=null;if(clearSelection)state.selectedTransitJourney=null}
function transitBoardingSummary(journey){const stop=journey.boarding_stop,t=transitAccessText();if(!validTransitBoardingStop(stop))return t[11];const vehicle=(journey.legs||[]).find(l=>!/^(walking|walk|foot|pedestrian)$/i.test(String(l.mode||''))),line=(stop.line_names||vehicle?.lineNames||[]).join(', ');return [t[7]+': '+stop.label,stop.indicator?stop.indicator:'',line?t[6]+': '+line:'',stop.towards?'→ '+stop.towards:'',t[4]+': '+transitClock(stop.departure_time||journey.firstVehicleDepartureTime,journey.time_zone)].filter(Boolean).join(' · ')}
const TRAVEL_MODE_TEXT={ro:['Cum vrei să ajungi?','Pietonal','Transport public','Mașină'],en:['How would you like to travel?','Walk','Public transport','Drive'],fr:['Comment souhaitez-vous voyager ?','À pied','Transports publics','Voiture'],de:['Wie möchten Sie reisen?','Zu Fuß','Öffentliche Verkehrsmittel','Auto'],it:['Come vuoi viaggiare?','A piedi','Trasporto pubblico','Auto'],es:['¿Cómo quieres viajar?','A pie','Transporte público','Coche'],pt:['Como pretende viajar?','A pé','Transportes públicos','Carro'],nl:['Hoe wil je reizen?','Lopen','Openbaar vervoer','Auto'],ru:['Как вы хотите добраться?','Пешком','Общественный транспорт','Автомобиль'],pl:['Jak chcesz dotrzeć?','Pieszo','Transport publiczny','Samochód']};
const TRAVEL_CONFIRM_TEXT={ro:['Da, arată traseul','Nu, mulțumesc'],en:['Show directions','No, thanks'],fr:['Afficher le trajet','Non, merci'],de:['Route anzeigen','Nein, danke'],it:['Mostra percorso','No, grazie'],es:['Mostrar ruta','No, gracias'],pt:['Mostrar percurso','Não, obrigado'],nl:['Toon route','Nee, bedankt'],ru:['Показать маршрут','Нет, спасибо'],pl:['Pokaż trasę','Nie, dziękuję']};
function openTransportModeFromAssistant(data){
 if(!data?.route_context?.destination)return false;
 if(state.tripCountryOnChoice&&state.tripAccommodationDecision!=='yes'&&state.tripAccommodationDecision!=='no'){return offerDestinationAccommodationBeforeRoute(data.route_context.destination)}
 if(state.currentView==='assistant'&&state.assistantStructuredDestination===true){
  const host=document.createElement('div');host.dataset.directChoices='true';
  const labels=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
  const caption=document.createElement('p');caption.textContent=data.route_context.destination.label||data.route_context.destination_query||'';
  caption.style.cssText='padding:0 0 8px;font-weight:600';host.append(caption);
  const d=Number(data.straight_line_distance_km),distance=Number.isFinite(d)&&d>0?d:distanceToDestinationKm(data.route_context.destination);
  const routeOptions=['walk','transit','drive'].filter(mode=>mode!=='walk'||distance===null||distance<=5).map(mode=>({id:mode,label:labels[['walk','transit','drive'].indexOf(mode)+1]}));
  openPocketSelectionPanel(routeOptions,labels[0],async option=>{
    if(state.busy)return;
    state.assistantStructuredDestination=false;
    state.routeSearchContext={...data.route_context,pending:'profile'};
    state.pendingTravelMode=option.id;state.pendingRouteDestination=null;
    document.getElementById('pocketStandaloneChoices')?.remove();
    inputEl.value=option.label;
    await submitMessage();
  });return true;
 }
 rememberNavigationSource();
 state.routeSearchContext={...data.route_context};
 switchConversationModule('maps');showNavigationReturn();
 const body=$('moduleLayerBody');body.style.cssText='';body.replaceChildren();
 document.querySelector('.module-quick-sheet')?.classList.remove('results-mode','details-mode');
 const t=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
 $('moduleLayerTitle').textContent=t[0];
 const label=document.createElement('p');label.textContent=data.route_context.destination.label||data.route_context.destination_query||'';body.append(label);
 const d=Number(data.straight_line_distance_km),distance=Number.isFinite(d)&&d>0?d:distanceToDestinationKm(data.route_context.destination);
 for(const [i,mode] of ['walk','transit','drive'].entries()){
  if(mode==='walk'&&distance!==null&&distance>5)continue;
  const btn=document.createElement('button');btn.type='button';btn.className='module-result-card route-choice';
  btn.textContent=t[i+1];
  btn.onclick=async()=>{if(state.busy)return;state.routeSearchContext={...data.route_context,pending:'profile'};
   state.pendingTravelMode=mode;state.pendingRouteDestination=null;
   $('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');
   inputEl.value=t[i+1];await submitMessage();
  };body.append(btn);
 }
 const back=document.createElement('button');back.type='button';back.className='transit-choice-action';
 back.textContent=dialogText("Revenire","Return");
 back.onclick=()=>returnToNavigationSource();body.append(back);
 updateQuickLayerGeometry();$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');return true;
}
function appendTravelConfirmation(data,host){
 if(!data.needs_travel_confirmation||!data.route_context?.destination_query)return false;
 const t=TRAVEL_CONFIRM_TEXT[state.language]||TRAVEL_CONFIRM_TEXT.en,box=document.createElement('div');box.className='travel-confirm-panel';
 const yes=document.createElement('button'),no=document.createElement('button');yes.type=no.type='button';yes.className=no.className='transit-choice-action';yes.textContent=t[0];no.textContent=t[1];
 state.travelConfirmationPanel=box;
 yes.onclick=()=>{state.pendingTravelConfirmationData=null;state.travelConfirmationPanel=null;box.replaceChildren();if(!openTransportModeFromAssistant({...data,needs_travel_mode:true,needs_travel_confirmation:false}))appendTravelModeChoices({...data,needs_travel_mode:true,needs_travel_confirmation:false},box)};
 no.onclick=()=>{state.pendingTravelConfirmationData=null;state.travelConfirmationPanel=null;state.routeSearchContext=null;box.remove()};box.append(yes,no);host.append(box);return true;
}
function appendTravelModeChoices(data,host){
 if(data.needs_travel_mode!==true||!data.route_context?.destination_query)return false;
 if(state.currentView==='assistant'&&data.route_context?.destination&&openTransportModeFromAssistant(data))return true;
 const t=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en,table=document.createElement('table'),caption=document.createElement('caption'),body=document.createElement('tbody'),generation=state.conversationGeneration,buttons=[];table.className='travel-mode-table';caption.textContent=t[0];table.append(caption);
 for(const [i,mode] of ['walk','transit','drive'].entries()){
  // Suppress complete walking routes over 5 km; walking transit legs remain unchanged.
  if(mode==='walk'&&Number.isFinite(data.straight_line_distance_km)&&data.straight_line_distance_km>5)continue;
  const row=document.createElement('tr'),cell=document.createElement('td'),button=document.createElement('button');button.type='button';button.className='transit-choice-action';button.textContent=t[i+1];buttons.push(button);
  button.onclick=async()=>{if(state.busy||generation!==state.conversationGeneration||state.routeSearchContext?.pending!=='profile'||state.routeSearchContext.destination_query!==data.route_context.destination_query)return;buttons.forEach(b=>b.disabled=true);state.pendingTravelConfirmationData=null;state.travelConfirmationPanel=null;state.routeSearchContext={...data.route_context};state.pendingTravelMode=mode;state.pendingRouteDestination=null;closeAnswerReader(false);rememberNavigationSource();switchConversationModule('maps');showNavigationReturn();inputEl.value=t[i+1];await submitMessage();buttons.forEach(b=>b.disabled=false)};
  cell.append(button);row.append(cell);body.append(row);
 }table.append(body);addChoiceDialogOpener(table,host);return true;
}
// v1.0.101: Each assistant clarification owns its own in-conversation choice table.
function assistantGeographicType(option){
 const type=String(option?.entity_type||'');
 return type==='region'||option?.entity_kind==='region_article'?'region':type==='country'?'country':'city';
}
function assistantGeographicPoint(option){
 const latitude=Number(option?.latitude),longitude=Number(option?.longitude);
 if(option?.latitude==null||option?.longitude==null||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)return null;
 return {latitude,longitude,label:String(option.entity_title||option.label||''),city:String(option.entity_title||'')};
}
function openAssistantStructuredAddress(option,{cityOnly=false,onVerifiedCity=null,onVerifiedDestination=null}={}){
 const type=assistantGeographicType(option);
 const regionName=type==='region'?String(option.entity_title||'').trim().replace(/^(?:județ(?:ul)?|judet(?:ul)?|county|province)\\s+/iu,''):
  type==='city'?String(option.entity_region||'').trim():'';
 const countryCode=String(option.entity_country_code||'').toUpperCase();
 const prefillCity=type==='city'?String(option.entity_title||''):'';
 const prefillCityPoint=type==='city'?assistantGeographicPoint(option):null;
 // Administrative village references have a confirmed name/county but no map point.
 // Resolve the already selected town silently instead of requiring another selection.
 if(type==='city'&&prefillCity&&!prefillCityPoint&&!option._localityLookupDone){
  const host=document.createElement('div');host.dataset.directChoices='true';
  const note=document.createElement('p');note.textContent=state.language==='ro'
   ?'Verific pe hartă localitatea deja aleasă: '+prefillCity+', '+regionName+'.'
   :'Verifying the previously selected locality: '+prefillCity+', '+regionName+'.';
  host.append(note);
  openStandaloneChoicePanel(host,prefillCity,{keepOpen:true});
  const code=countryCode.toLowerCase();
  void fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({address_lookup:{stage:'city',country:code,query:prefillCity,city:'',street:'',postcode:'',region:regionName}})})
   .then(r=>r.ok?r.json():null).then(data=>{
    const normalizeName=v=>String(v||'').normalize('NFD').toLowerCase().trim();
    const matches=(Array.isArray(data?.candidates)?data.candidates:[]).filter(p=>
     normalizeName(p.city)===normalizeName(prefillCity)&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude));
    // Duplicate provider labels at essentially the same village are one place.
    const origin=matches[0],sameVillage=origin&&matches.every(p=>
     Math.abs(p.latitude-origin.latitude)<0.015&&Math.abs(p.longitude-origin.longitude)<0.02);
    const candidate=sameVillage?origin:null;
    const verified=candidate?{latitude:candidate.latitude,longitude:candidate.longitude,
     city:prefillCity,label:[prefillCity,regionName].filter(Boolean).join(', ')}:null;
    document.getElementById('pocketStandaloneChoices')?.remove();
    openAssistantStructuredAddress({...option,_localityLookupDone:true,...(verified||{})},{cityOnly,onVerifiedCity,onVerifiedDestination});
   }).catch(()=>{
    document.getElementById('pocketStandaloneChoices')?.remove();
    openAssistantStructuredAddress({...option,_localityLookupDone:true},{cityOnly,onVerifiedCity,onVerifiedDestination});
   });
  return true;
 }
 const host=document.createElement('div');host.dataset.directChoices='true';
 const headline=cityOnly
  ?(dialogText("Alege localitatea de destinație. După confirmare vei putea selecta mijlocul de transport.","Choose the destination town. After confirmation, select your travel mode."))
  :(dialogText("Alege destinația verificată pe hartă. Strada, numărul și codul poștal sunt opționale.","Choose a verified destination. Street, house number and postcode are optional."));
 const intro=document.createElement('p');intro.textContent=headline;
 intro.style.cssText='font-size:14px;line-height:1.5;color:#cbe5ee;margin:0 0 14px';
 host.append(intro);
 openStandaloneChoicePanel(host,String(option.entity_title||regionName||'Destinație'),{keepOpen:true});
 const container=document.querySelector('#pocketStandaloneChoices .answer-reader-body');
 if(!container)return false;
 renderStructuredAddressPicker({body:container,prefix:headline,region:regionName,countryCode,prefillCity,prefillCityPoint,cityOnly,
  onBack:()=>document.getElementById('pocketStandaloneChoices')?.remove(),
  onSelect:point=>{
   const lat=Number(point?.latitude),lon=Number(point?.longitude);
   if(point?.latitude==null||point?.longitude==null||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return;
   const label=String(point.label||[point.street,point.houseNumber,point.city,regionName].filter(Boolean).join(', '));
   const scopedLabel=regionName&&!label.toLocaleLowerCase().includes(regionName.toLocaleLowerCase())?label+', '+regionName:label;
   const verified={latitude:lat,longitude:lon,label:scopedLabel,city:String(point.city||prefillCity||''),approximation:point.approximation||null};
   document.getElementById('pocketStandaloneChoices')?.remove();
   if(cityOnly&&typeof onVerifiedCity==='function'){onVerifiedCity(verified);return;}
   if(typeof onVerifiedDestination==='function'){onVerifiedDestination(verified);return;}
   state.tripCountryOnChoice=null;state.tripAccommodationDecision='no';
   state.assistantStructuredDestination=true;
   state.routeSearchContext=null;state.pendingTravelMode=null;state.pendingTravelConfirmationData=null;
   openTransportModeFromAssistant({route_context:{destination_query:scopedLabel,destination:verified,pending:'profile'}});
  }
 });
 return true;
}
// The geographic search engine is unchanged. This function only orchestrates the
// already verified locality, the chosen vehicle and the existing route engines.
async function resolveAssistantLocalityForJourney(option){
 const existing=assistantGeographicPoint(option);
 if(existing)return existing;
 if(assistantGeographicType(option)!=='city')return null;
 const city=String(option.entity_title||'').trim(),region=String(option.entity_region||'').trim();
 const country=String(option.entity_country_code||'').toLowerCase();
 if(!city||!/^[a-z]{2}$/.test(country))return null;
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({address_lookup:{stage:'city',country,query:city,city:'',street:'',postcode:'',region}})});
  if(!response.ok)return null;
  const data=await response.json();
  const norm=v=>String(v||'').normalize('NFD').toLowerCase().trim();
  const points=(Array.isArray(data.candidates)?data.candidates:[]).filter(p=>
   norm(p.city)===norm(city)&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude));
  const first=points[0];
  if(!first||!points.every(p=>Math.abs(p.latitude-first.latitude)<0.015&&Math.abs(p.longitude-first.longitude)<0.02))return null;
  return {latitude:first.latitude,longitude:first.longitude,label:[city,region].filter(Boolean).join(', '),city,approximation:'locality'};
 }catch{return null;}
}
function startAssistantLocalityRoute(destination,mode){
 if(!destination||!Number.isFinite(Number(destination.latitude))||!Number.isFinite(Number(destination.longitude)))return false;
 const labels=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
 const index=mode==='transit'?2:mode==='drive'?3:1;
 state.tripCountryOnChoice=null;
 state.assistantStructuredDestination=false;
 state.pendingTravelConfirmationData=null;
 state.pendingRouteDestination=null;
 state.routeSearchContext={destination_query:destination.label,destination:{...destination},pending:'profile'};
 state.pendingTravelMode=mode;
 document.getElementById('pocketStandaloneChoices')?.remove();
 inputEl.value=labels[index];
 void submitMessage();
 return true;
}
function offerAssistantLocalityTravelMode(option){
 const type=assistantGeographicType(option);
 // A county or country is not a stop: pick the town once, then choose transport.
 if(type!=='city'){
  openAssistantStructuredAddress(option,{cityOnly:true,onVerifiedCity:verified=>{
   offerAssistantLocalityTravelMode({entity_kind:'place',entity_type:'city',
    entity_title:verified.city||verified.label,entity_region:'',
    entity_country_code:option.entity_country_code,
    latitude:verified.latitude,longitude:verified.longitude,label:verified.label});
  }});
  return;
 }
 const host=document.createElement('div');host.dataset.directChoices='true';
 const note=document.createElement('p');
 note.textContent=(dialogText("Localitate selectată: ","Selected town: "))+String(option.entity_title||option.label||'');
 host.append(note);
 const labels=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
 const select=async mode=>{
  if(state.busy)return;
  document.getElementById('pocketStandaloneChoices')?.remove();
  if(mode==='drive'){offerAssistantCarDestination(option);return;}
  // Transit always uses the town/nearest carrier stop, never lodging or a private address.
  const place=await resolveAssistantLocalityForJourney(option);
  if(place){startAssistantLocalityRoute({...place,approximation:'locality'},mode);return;}
  const panel=document.createElement('div');panel.dataset.directChoices='true';
  const explanation=document.createElement('p');
  explanation.textContent=dialogText("Localitatea este identificată, dar poziția ei nu este confirmată în hărți. Selectează localitatea verificată pentru a calcula transportul.","The town is identified, but its map position is not verified. Choose the verified town to calculate public transport.");
  panel.append(explanation);
  const pick=document.createElement('button');pick.type='button';pick.className='transit-choice-action';
  pick.textContent=dialogText("Verifică localitatea","Verify town");
  pick.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();
   openAssistantStructuredAddress(option,{cityOnly:true,onVerifiedCity:verified=>startAssistantLocalityRoute(verified,mode)});};
  panel.append(pick);openStandaloneChoicePanel(panel,String(option.entity_title||option.label||''));
 };
 for(const [mode,label] of [['transit',labels[2]],['drive',labels[3]]]){
  const button=document.createElement('button');button.type='button';button.className='transit-choice-action';
  button.textContent=label;button.onclick=()=>{void select(mode)};host.append(button);
 }
 openStandaloneChoicePanel(host,labels[0]);
}
function offerAssistantCarDestination(option){
 const host=document.createElement('div');host.dataset.directChoices='true';
 const label=String(option.entity_title||option.label||'');
 const textNode=document.createElement('p');textNode.textContent=(dialogText("Destinație cu mașina în ","Driving destination in "))+label;host.append(textNode);
 const lodging=document.createElement('button');lodging.type='button';lodging.className='transit-choice-action';
 lodging.textContent=dialogText("Caută cazare","Find accommodation");
 lodging.onclick=async()=>{
  document.getElementById('pocketStandaloneChoices')?.remove();
  const place=await resolveAssistantLocalityForJourney(option);
  if(place){state.assistantStructuredDestination=true;offerDestinationAccommodationBeforeRoute(place,{autoSearch:true,scopeOption:option,routeMode:'drive'});return;}
  openAssistantStructuredAddress(option,{cityOnly:true,onVerifiedCity:verified=>{
   state.assistantStructuredDestination=true;offerDestinationAccommodationBeforeRoute(verified,{autoSearch:true,scopeOption:option,routeMode:'drive'});
  }});
 };
 const address=document.createElement('button');address.type='button';address.className='transit-choice-action';
 address.textContent=dialogText("Merg la o adresă","Go to an address");
 address.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();
  openAssistantStructuredAddress(option,{onVerifiedDestination:point=>startAssistantLocalityRoute(point,'drive')});
 };
 host.append(lodging,address);openStandaloneChoicePanel(host,label);
}
function offerAssistantScopeAccommodation(option){
 const type=assistantGeographicType(option),point=assistantGeographicPoint(option);
 const host=document.createElement('div');host.dataset.directChoices='true';
 const name=String(option.entity_title||option.label||'').trim();
 const note=document.createElement('p');
 note.textContent=state.language==='ro'
  ?'Dorești să alegi cazare în '+name+' înainte de traseu? Dacă alegi un hotel, destinația va fi automat adresa acestuia.'
  :'Would you like accommodation in '+name+' before planning the route? Selecting a hotel will automatically set its address as your destination.';
 host.append(note);
 const yes=document.createElement('button');yes.type='button';yes.className='transit-choice-action';
 yes.textContent=dialogText("Da, aleg cazare","Yes, choose accommodation");
 yes.onclick=()=>{
  document.getElementById('pocketStandaloneChoices')?.remove();
  state.tripAccommodationDecision='yes';
  const search=verified=>{state.assistantStructuredDestination=true;offerDestinationAccommodationBeforeRoute(verified,{autoSearch:true,scopeOption:option})};
  // A country or county has no single meaningful hotel-search centre.
  // Select only the town first; NEVER request a street/number before lodging.
  if(type==='city'&&point){search(point);return}
  openAssistantStructuredAddress(option,{cityOnly:true,onVerifiedCity:search});
 };
 const no=document.createElement('button');no.type='button';no.className='transit-choice-action';
 no.textContent=dialogText("Nu, continuă spre destinație","No, continue to destination");
 no.onclick=()=>{
  document.getElementById('pocketStandaloneChoices')?.remove();state.tripAccommodationDecision='no';
  // Once a specific mapped town is verified, an exact street is a choice, not a requirement.
  if(type==='city'&&point){
   const panel=document.createElement('div');panel.dataset.directChoices='true';
   const msg=document.createElement('p');msg.textContent=dialogText("Unde dorești să ajungi în această localitate?","Where in this town would you like to go?");panel.append(msg);
   const centre=document.createElement('button');centre.type='button';centre.className='transit-choice-action';
   centre.textContent=dialogText("Centrul localității","Town centre");
   centre.onclick=()=>{
    document.getElementById('pocketStandaloneChoices')?.remove();
    state.assistantStructuredDestination=true;state.routeSearchContext=null;state.pendingTravelMode=null;state.pendingTravelConfirmationData=null;
    openTransportModeFromAssistant({route_context:{destination_query:point.label,destination:{...point,approximation:'locality'},pending:'profile'}});
   };
   const exact=document.createElement('button');exact.type='button';exact.className='transit-choice-action';
   exact.textContent=dialogText("Alege o stradă sau un număr","Choose a street or house number");
   exact.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();openAssistantStructuredAddress(option)};
   panel.append(centre,exact);openStandaloneChoicePanel(panel,name);return;
  }
  openAssistantStructuredAddress(option);
 };
 host.append(yes,no);
 openStandaloneChoicePanel(host,dialogText("Cazare înainte de traseu","Accommodation before route"));
}
function confirmAssistantGeographicRoute(option){
 const host=document.createElement('div');host.dataset.directChoices='true';
 const label=String(option.entity_title||option.label||'');
 const note=document.createElement('p');
 note.textContent=(dialogText("Ai ales ","You selected "))+label+'. '+(dialogText("Dorești să îți arăt traseul?","Would you like directions?"));
 host.append(note);
 const yes=document.createElement('button');yes.type='button';yes.className='transit-choice-action';
 yes.textContent=dialogText("Da, arată traseul","Yes, show directions");
 yes.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();offerAssistantLocalityTravelMode(option)};
 const no=document.createElement('button');no.type='button';no.className='transit-choice-action';
 no.textContent=dialogText("Nu, închide","No, close");
 no.onclick=()=>document.getElementById('pocketStandaloneChoices')?.remove();
 host.append(yes,no);
 openStandaloneChoicePanel(host,label);
}
function appendConversationChoices(data,host){
 const raw=Array.isArray(data.choice_options)?data.choice_options:Array.isArray(data.destination_candidates)?data.destination_candidates:[];
 const options=raw.slice(0,data.entity_disambiguation?8:data.named_venue?8:4).filter(x=>x&&typeof x.label==='string');
 if(!options.length)return false;
 const table=document.createElement('table'),caption=document.createElement('caption'),body=document.createElement('tbody');
 table.className='travel-mode-table';caption.textContent=dialogText("Alege o opțiune","Choose an option");table.append(caption);
 const generation=state.conversationGeneration,buttons=[];
 for(const [choiceIndex,option] of options.entries()){
  const row=document.createElement('tr'),cell=document.createElement('td'),button=document.createElement('button');
  if(data.named_venue&&choiceIndex>=4&&!host?.ownerDocument)row.hidden=true;
  button.type='button';button.className='transit-choice-action';button.textContent=option.label+(Number.isFinite(Number(option.distance_km))?' · '+Number(option.distance_km).toLocaleString(state.language,{maximumFractionDigits:1})+' km':'');buttons.push(button);
  button.onclick=async()=>{
   if(state.busy||generation!==state.conversationGeneration)return;
   buttons.forEach(b=>b.disabled=true);
   if(data.entity_disambiguation){
    document.getElementById('pocketStandaloneChoices')?.remove();
    closeAnswerReader(false);
    if(['region','city','country'].includes(option.entity_type)||option.entity_kind==='region_article'||option.entity_kind==='locality_reference'){
     // Return to the original informational presentation BEFORE travel choices.
     state.pendingSelectedGeoOption={...option};
     inputEl.value=(dialogText("Informații despre ","Information about "))+
      [String(option.entity_title||'').trim(),String(option.entity_region||'').trim()].filter(Boolean).join(', ');
     await submitMessage();
     return;
    }
    if(option.entity_kind==='article'){
     const title=String(option.entity_title||'').trim();
     const regionTitle=option.entity_kind==='place'&&option.entity_type==='region'&&
       /(?:rom[aâ]nia|romania|roumanie|rumänien|румыния|rumunia)/iu.test(String(option.entity_details||''))
       &&!/^(?:județul|judetul)\s/i.test(title)?'Județul '+title:title;
     state.pendingSelectedEntityKind='article';
     inputEl.value=(dialogText("Informații despre ","Information about "))+(option.entity_kind==='article'?title:regionTitle);
     await submitMessage();
     return;
    }
    const lat=Number(option.latitude),lon=Number(option.longitude);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){buttons.forEach(b=>b.disabled=false);return}
    const card=document.createElement('div');
    card.style.cssText='padding:15px;border:1px solid #39677c;border-radius:15px;background:#102f43;line-height:1.5';
    const name=document.createElement('h3');name.textContent=String(option.entity_title||option.label);
    name.style.cssText='color:#e2f9ff;font-size:18px;margin:0 0 9px';
    const details=document.createElement('p');details.textContent=String(option.entity_details||'');
    details.style.cssText='font-size:14px;color:#c7e4ed;margin:0 0 12px';
    const context=document.createElement('p');context.textContent=dialogText("Aceasta este o locație identificată pe hartă. Dorești să îți arăt traseul?","This location was identified on a map. Would you like directions?");
    context.style.cssText='font-size:15px;margin:0 0 12px';
    const go=document.createElement('button');go.type='button';go.className='transit-choice-action';
    go.textContent=dialogText("Da, arată traseul","Yes, show directions");
    go.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();
      offerAssistantLocalityTravelMode(option)};
    const close=document.createElement('button');close.type='button';close.className='transit-choice-action';
    close.textContent=dialogText("Nu, închide","No, close");
    close.onclick=()=>document.getElementById('pocketStandaloneChoices')?.remove();
    card.append(name,details,context,go,close);
    openStandaloneChoicePanel(card,String(option.entity_title||option.label));return;
   }
   const lat=option.latitude==null?NaN:Number(option.latitude),lon=option.longitude==null?NaN:Number(option.longitude);
   if(Number.isFinite(lat)&&Number.isFinite(lon)&&state.tripCountryOnChoice){
    state.tripCountryOnChoice=null;state.pendingTravelConfirmationData=null;
    state.routeSearchContext=null;state.pendingTravelMode=null;
    offerDestinationAccommodationBeforeRoute({latitude:lat,longitude:lon,label:option.label});
    return;
   }
   if(Number.isFinite(lat)&&Number.isFinite(lon)&&data.named_venue){
    state.routeSearchContext={destination_query:String(data.message_received||option.label),destination:{latitude:lat,longitude:lon,label:option.label},pending:'profile'};
    state.pendingTravelMode=null;
    closeAnswerReader(false);
    const explicitJourney=/\\b(?:vreau sa ajung|cum ajung|traseu|ruta|navig|directions|route|how to get|go to)\\b/i.test(String(data.message_received||''));
    const selected={...data,route_context:state.routeSearchContext,needs_travel_mode:explicitJourney,needs_travel_confirmation:!explicitJourney};state.pendingTravelConfirmationData=explicitJourney?null:selected;
    const prompt=explicitJourney?(state.language==='ro'?'Cum dorești să ajungi la '+option.label+'?':'How would you like to get to '+option.label+'?'):(state.language==='ro'?'Am identificat '+option.label+'. Dorești să îți arăt traseul?':'I found '+option.label+'. Would you like directions?');
    const choiceHost=document.createElement('div');choiceHost.dataset.directChoices='true';
    if(explicitJourney)appendTravelModeChoices(selected,choiceHost);else appendTravelConfirmation(selected,choiceHost);
    openStandaloneChoicePanel(choiceHost,prompt);
    state.messages.push({role:'assistant',text:prompt});
    buttons.forEach(b=>b.disabled=true);
    return;
   }else inputEl.value=String(option.value||option.query||option.label);
   closeAnswerReader(false);await submitMessage();
   if(state.conversationGeneration===generation)buttons.forEach(b=>b.disabled=false);
  };
  cell.append(button);row.append(cell);body.append(row);
 }
 table.append(body);addChoiceDialogOpener(table,host);
 if(data.named_venue&&options.length>4&&!host?.ownerDocument){
  const more=document.createElement('button');more.type='button';more.className='transit-choice-action';
  const captions={ro:'Vezi mai multe locații',en:'Show more locations',fr:'Voir plus de lieux',de:'Weitere Standorte anzeigen',it:'Mostra altre sedi',es:'Ver más ubicaciones',pt:'Ver mais locais',nl:'Meer locaties tonen',ru:'Показать больше мест',pl:'Pokaż więcej lokalizacji'};
  more.textContent=captions[state.language]||captions.en;
  more.onclick=()=>{for(const tr of [...body.children])tr.hidden=false;more.remove()};
  host.append(more);
 }
 return true;
}
function appendTravelModeOverview(host,text){const data=state.lastTravelModeResponse;return data?.reply===text?appendTravelModeChoices(data,host):false}
const TRANSIT_LAYOUT_TEXT={
 ro:['Pași de urmat','Pas','Ce ai de făcut','Ora','Înapoi la variante','Schimbări','Pe jos până la stație'],
 en:['Journey steps','Step','What to do','Time','Back to options','Changes','Walk to boarding stop'],
 fr:['Étapes du trajet','Étape','À faire','Heure','Retour aux options','Correspondances','Marche jusqu’à l’arrêt'],
 de:['Reiseschritte','Schritt','Wegbeschreibung','Zeit','Zurück zu den Optionen','Umstiege','Fußweg zur Haltestelle'],
 it:['Tappe del viaggio','Passo','Cosa fare','Ora','Torna alle opzioni','Cambi','A piedi alla fermata'],
 es:['Pasos del viaje','Paso','Qué hacer','Hora','Volver a las opciones','Transbordos','Caminar hasta la parada'],
 pt:['Etapas da viagem','Etapa','O que fazer','Hora','Voltar às opções','Transbordos','Caminhada até à paragem'],
 nl:['Reisstappen','Stap','Wat te doen','Tijd','Terug naar opties','Overstappen','Lopen naar de halte'],
 ru:['Этапы поездки','Шаг','Что делать','Время','К вариантам','Пересадки','Пешком до остановки'],
 pl:['Etapy podróży','Krok','Co zrobić','Godzina','Powrót do wariantów','Przesiadki','Pieszo do przystanku']
};
function transitLayoutText(){return TRANSIT_LAYOUT_TEXT[state.language]||TRANSIT_LAYOUT_TEXT.en}
function dismissSelectionKeyboard(){const focused=document.activeElement;if(focused&&(/^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)||focused.isContentEditable))focused.blur();if(typeof inputEl!=='undefined'&&inputEl&&inputEl!==focused&&document.activeElement===inputEl)inputEl.blur()}
function showTransitChoices(options){dismissSelectionKeyboard();closeAnswerReader(false);closeRouteMap(false);$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');$('moduleLayerTitle').textContent=transitAccessText()[0];renderTransitChoices(options)}
function transitOptionsForRoute(route){const selected=state.selectedTransitJourney;return selected?.accessRoute&&transitWalkingMatches(route,selected.journey.boarding_stop)?selected.options:null}
function appendTransitReturnAction(host,route){const options=transitOptionsForRoute(route);if(!options?.length)return;const back=document.createElement('button');back.type='button';back.className='route-map-open transit-back-options';back.textContent='← '+transitLayoutText()[4];back.onclick=()=>showTransitChoices(options);host.append(back)}
function appendTransitLegs(host,journey){
 const t=transitLayoutText(),table=document.createElement('table');table.className='transit-steps';
 const caption=document.createElement('caption');caption.textContent=t[0];table.append(caption);
 const head=document.createElement('thead'),headers=document.createElement('tr');
 for(const label of [t[1],t[2],t[3]]){const th=document.createElement('th');th.setAttribute('scope','col');th.textContent=label;headers.append(th)}head.append(headers);table.append(head);
 const body=document.createElement('tbody');
 for(const [i,leg] of (journey.legs||[]).entries()){
  const row=document.createElement('tr'),step=document.createElement('th'),action=document.createElement('td'),time=document.createElement('td');step.setAttribute('scope','row');step.textContent=String(i+1);
  const mode=document.createElement('strong');mode.textContent=transitModeName(leg.mode)+((leg.lineNames||[]).length?' '+leg.lineNames.join(', '):'');
  const places=document.createElement('div');places.textContent=(leg.from||'—')+' → '+(leg.to||'—');action.append(mode,places);
  const departure=document.createElement('div'),arrival=document.createElement('div');departure.textContent=transitClock(leg.departureTime,leg.departureZone||journey.time_zone);arrival.textContent='→ '+transitClock(leg.arrivalTime,leg.arrivalZone||journey.time_zone);time.append(departure,arrival);row.append(step,action,time);body.append(row);
 }table.append(body);host.append(table);
}
function appendTransitCards(host,options){
 const t=transitAccessText(),labels=transitLayoutText();
 for(const [i,journey] of options.entries()){
  const button=document.createElement('button');button.type='button';button.className='transit-choice-action transit-journey-choice';
  const first=(journey.legs||[]).find(l=>!/^(walking|walk|foot|pedestrian)$/i.test(String(l.mode||''))),heading=document.createElement('strong');
  heading.textContent=(i+1)+'. '+transitClock(journey.startDateTime||first?.departureTime||journey.firstVehicleDepartureTime,journey.legs?.[0]?.departureZone||journey.time_zone)+' → '+transitClock(journey.arrivalDateTime||journey.legs?.at(-1)?.arrivalTime,journey.legs?.at(-1)?.arrivalZone||journey.time_zone)+' · '+formatTravelDurationMinutes(journey.durationMinutes);
  const boarding=document.createElement('div');boarding.textContent=transitBoardingSummary(journey);
  const metrics=document.createElement('div');metrics.className='transit-card-metrics';metrics.textContent=[Number.isFinite(journey.walkToFirstStopMinutes)?labels[6]+': '+formatTravelDurationMinutes(journey.walkToFirstStopMinutes):'',Number.isFinite(journey.transferCount)?labels[5]+': '+journey.transferCount:''].filter(Boolean).join(' · ');
  const vehicles=(journey.legs||[]).filter(x=>!/^(?:walking|walk|foot|pedestrian)$/i.test(String(x.mode||'')));
  const routeLine=document.createElement('div');routeLine.className='transit-card-route-overview';
  routeLine.style.cssText='font-size:clamp(12px,3.4vw,14px);line-height:1.45;margin:7px 0 5px;opacity:.95;overflow-wrap:anywhere';
  routeLine.textContent=vehicles.map(x=>transitModeName(x.mode)+((x.lineNames||[]).length?' '+x.lineNames.join(', '):'')+(x.to?' → '+x.to:'')).join(' · ');
  button.append(heading,boarding,routeLine,metrics);button.onclick=()=>{closeAnswerReader(false);$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');$('moduleLayerTitle').textContent=t[0];selectTransitJourney(options,i)};host.append(button);
 }
}
function appendTransitOverview(host,text){
 const data=state.lastTransitResponse;if(!data||data.reply!==text||!data.transit?.length)return false;
 const title=document.createElement('h3');title.textContent=transitAccessText()[0];host.append(title);
 appendTransitCards(host,feasibleTransitChoices(data.transit));return true;
}
// Last-mile navigation uses the *verified* TfL alighting coordinates and the
// *original* named POI, not an arbitrary point near the final station.
const FINAL_WALK_TEXT={
ro:['Pe jos de la ultima stație până la destinație','Calculez traseul final…','Traseul final nu a putut fi verificat.'],
en:['Walk from final stop to destination','Calculating final walking route…','Final walking route could not be verified.'],
fr:['À pied du dernier arrêt à destination','Calcul du trajet final…','Trajet final non vérifié.'],
de:['Zu Fuß von der letzten Haltestelle zum Ziel','Letzten Fußweg berechnen…','Letzter Fußweg nicht bestätigt.'],
it:['A piedi dall’ultima fermata alla destinazione','Calcolo percorso finale…','Percorso finale non verificato.'],
es:['A pie de la última parada al destino','Calculando ruta final…','Ruta final no verificada.'],
pt:['A pé da última paragem ao destino','A calcular rota final…','Rota final não verificada.'],
nl:['Lopen vanaf de laatste halte naar bestemming','Laatste looproute berekenen…','Laatste route niet geverifieerd.'],
ru:['Пешком от последней остановки до цели','Расчёт последнего участка…','Последний участок не подтверждён.'],
pl:['Pieszo z ostatniego przystanku do celu','Obliczanie końcowego odcinka…','Końcowy odcinek niezweryfikowany.']
};
function finalTransitWalkPoints(journey){
 const lastVehicle=[...(journey?.legs||[])].reverse().find(l=>!/(?:walk|foot|pedestrian)/i.test(String(l.mode||''))&&l.arrivalLatLon);
 const arrival=lastVehicle?.arrivalLatLon,target=state.lastTransitResponse?.transit_destination_point;
 const valid=(lat,lon)=>lat!==null&&lat!==undefined&&lon!==null&&lon!==undefined&&
  Number.isFinite(Number(lat))&&Number.isFinite(Number(lon))&&Math.abs(Number(lat))<=90&&Math.abs(Number(lon))<=180;
 if(!valid(arrival?.lat,arrival?.lon)||!valid(target?.latitude,target?.longitude)||!target?.label)return null;
 const origin={latitude:Number(arrival.lat),longitude:Number(arrival.lon),label:String(lastVehicle.to||'Final stop')};
 const destination={latitude:Number(target.latitude),longitude:Number(target.longitude),label:String(target.label)};
 const rad=Math.PI/180,dLat=(destination.latitude-origin.latitude)*rad,dLon=(destination.longitude-origin.longitude)*rad;
 const h=Math.sin(dLat/2)**2+Math.cos(origin.latitude*rad)*Math.cos(destination.latitude*rad)*Math.sin(dLon/2)**2;
 const meters=6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
 return Number.isFinite(meters)&&meters>=30&&meters<=2500?{origin,destination,meters}:null;
}
async function showFinalTransitWalk(journey,button){
 const pair=finalTransitWalkPoints(journey);if(!pair||button.disabled)return;
 const words=FINAL_WALK_TEXT[state.language]||FINAL_WALK_TEXT.en,original=button.textContent;
 button.disabled=true;button.textContent=words[1];
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),22000);
 try{
  const res=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,
    body:JSON.stringify({message:'Pe jos',language:state.language,module:'assistant',history:[],
      route_profile:'walk',route_destination:pair.destination,
      route_context:{profile:'walk',destination_query:pair.destination.label,
        destination:pair.destination,origin:pair.origin,pending:null}})});
  const data=await res.json();
  const end=data.route?.destination;
  if(!res.ok||data.status!=='success'||!validMapRoute(data.route)||!end||
    transitDistance(end,pair.destination)>120)throw Error('unverified_final_walk');
  button.textContent=original;
  await openRouteMap(data.route,button,Array.isArray(data.routes)?data.routes:[data.route]);
 }catch{button.textContent=words[2]}finally{clearTimeout(timer);button.disabled=false}
}
function appendFinalTransitWalkAction(host,journey){
 const pair=finalTransitWalkPoints(journey);if(!pair)return;
 const words=FINAL_WALK_TEXT[state.language]||FINAL_WALK_TEXT.en;
 const button=document.createElement('button');button.type='button';button.className='transit-choice-action';
 button.textContent=words[0]+' · '+(pair.meters/1000).toLocaleString(state.language,{maximumFractionDigits:1})+' km';
 button.onclick=()=>showFinalTransitWalk(journey,button);
 host.append(button);
}
// Transit results can outlive their original departure times. Hide options
// which are already unreachable using the provider's boarding-walk estimate.
function compareTransitDisplayTimes(a,b){
 // Sort full-journey departure (including access walk), then actual arrival.
 const time=(j,kind)=>{
  const legs=Array.isArray(j?.legs)?j.legs:[];
  const raw=kind==='start'?(j?.startDateTime||legs[0]?.departureTime||j?.firstVehicleDepartureTime):
   (j?.arrivalDateTime||legs.at(-1)?.arrivalTime);
  const n=Date.parse(raw||'');return Number.isFinite(n)?n:null;
 };
 const x=time(a,'start'),y=time(b,'start');
 if(x!==null&&y!==null&&x!==y)return x-y;
 if(x===null&&y!==null)return 1;
 if(x!==null&&y===null)return -1;
 const endA=time(a,'arrival'),endB=time(b,'arrival');
 if(endA!==null&&endB!==null)return endA-endB;
 return endA===null&&endB!==null?1:endA!==null&&endB===null?-1:0;
}
function feasibleTransitChoices(options){
 const now=Date.now();
 return (Array.isArray(options)?options:[]).filter(journey=>{
  const departure=Date.parse(journey.firstVehicleDepartureTime||journey.boarding_stop?.departure_time||'');
  if(!Number.isFinite(departure))return true;
  const walking=Number(journey.walkToFirstStopMinutes);
  const margin=Number.isFinite(journey.safetyMarginMinutes)?Math.max(0,journey.safetyMarginMinutes):5;
  const needed=(Number.isFinite(walking)&&walking>=0?walking:0)+margin;
  return departure>=now+needed*60000;
 }).sort(compareTransitDisplayTimes);
}
const TRANSIT_REFRESH_TEXT={
 ro:['Se actualizează plecările…','Nu pot actualiza plecările acum. Încearcă din nou.','Destinația anterioară nu mai este disponibilă. Alege o destinație nouă.','Nu am găsit alte plecări disponibile acum. Încearcă din nou.','Permite accesul la GPS pentru plecări din poziția actuală.','Plecarea aceasta nu mai poate fi prinsă. Actualizează plecările.'],
 en:['Refreshing departures…','Could not refresh departures. Try again.','The previous destination is no longer available. Choose a new one.','No new departures are available. Try again.','Allow GPS for departures from your current position.','This departure is no longer reachable. Refresh departures.'],
 fr:['Actualisation des départs…','Impossible d’actualiser les départs. Réessayez.','La destination précédente n’est plus disponible.','Aucun nouveau départ disponible.','Autorisez le GPS pour les départs depuis votre position.','Départ inaccessible. Actualisez les départs.'],
 de:['Abfahrten werden aktualisiert…','Abfahrten konnten nicht aktualisiert werden.','Das frühere Ziel ist nicht mehr verfügbar.','Keine neuen Abfahrten verfügbar.','GPS für Abfahrten vom aktuellen Standort erlauben.','Abfahrt nicht mehr erreichbar. Aktualisieren.'],
 it:['Aggiornamento partenze…','Impossibile aggiornare le partenze. Riprova.','La destinazione precedente non è più disponibile.','Nessuna nuova partenza disponibile.','Consenti il GPS per le partenze dalla posizione attuale.','Partenza non più raggiungibile. Aggiorna.'],
 es:['Actualizando salidas…','No se pudieron actualizar las salidas. Reinténtalo.','El destino anterior ya no está disponible.','No hay nuevas salidas disponibles.','Permite el GPS para salidas desde tu ubicación.','No llegas a tiempo. Actualiza las salidas.'],
 pt:['A atualizar partidas…','Não foi possível atualizar as partidas.','O destino anterior já não está disponível.','Não há novas partidas disponíveis.','Permita GPS para partidas da posição atual.','Já não é possível apanhar esta partida. Atualize.'],
 nl:['Vertrektijden vernieuwen…','Vertrektijden konden niet worden vernieuwd.','De vorige bestemming is niet meer beschikbaar.','Geen nieuwe vertrektijden beschikbaar.','Sta GPS toe voor vertrek vanaf uw locatie.','Deze rit is niet meer haalbaar. Vernieuw vertrektijden.'],
 ru:['Обновление отправлений…','Не удалось обновить отправления. Повторите попытку.','Предыдущее место назначения недоступно.','Новых отправлений нет.','Разрешите GPS для поиска от текущего местоположения.','На этот рейс уже не успеть. Обновите отправления.'],
 pl:['Aktualizowanie odjazdów…','Nie udało się zaktualizować odjazdów.','Poprzedni cel podróży jest niedostępny.','Brak nowych odjazdów.','Zezwól na GPS, aby szukać odjazdów z bieżącej lokalizacji.','Nie zdążysz na ten odjazd. Odśwież połączenia.']
};
function transitRefreshText(){return TRANSIT_REFRESH_TEXT[state.language]||TRANSIT_REFRESH_TEXT.en}
function transitRefreshNotice(text){
 const body=$('moduleLayerBody');
 if(!body)return;
 let status=body.querySelector('.transit-refresh-status');
 if(!status){status=document.createElement('p');status.className='transit-access-status transit-refresh-status';status.setAttribute('role','status');body.prepend(status)}
 status.textContent=text;
}
// Refresh exactly the already selected origin -> destination, not a new chat query.
// The initial lookup retains the official destination coordinates even after
// walking-to-boarding overwrites routeSearchContext.
async function refreshTransitDepartures(button){
 if(state.transitRefreshBusy||state.busy)return;
 const source=state.lastTransitResponse;
 const target=source?.transit_destination_point||state.lastTransitChoice?.transitDestination;
 const lat=Number(target?.latitude),lon=Number(target?.longitude),label=String(target?.label||'').trim();
 const t=transitRefreshText();
 if(!label||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){transitRefreshNotice(t[2]);return}
 const destination={latitude:lat,longitude:lon,label};
 const generation=state.conversationGeneration,refreshGeneration=++state.transitRefreshGeneration;
 const layer=$('moduleQuickLayer'),visible=()=>generation===state.conversationGeneration&&refreshGeneration===state.transitRefreshGeneration&&layer?.classList.contains('open');
 state.transitRefreshBusy=true;
 const original=button?.textContent||transitAccessText()[15];
 if(button){button.disabled=true;button.textContent=t[0]}
 const controller=new AbortController();state.transitRefreshAbort=controller;
 const timeout=setTimeout(()=>controller.abort(),25000);
 try{
  const gps=state.lastTransitChoice?.journeyOrigin||await getCurrentCoordinates(false);
  if(!visible())return;
  if(!gps||!Number.isFinite(gps.latitude)||!Number.isFinite(gps.longitude)){transitRefreshNotice(t[4]);return}
  // The backend's transit-first branch accepts a confirmed destination and
  // GPS as typed fields. No follow-up question or mode re-selection is required.
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({
   message:'Transport public',language:state.language,history:[],
   module:state.currentView==='module'?state.currentModule:'assistant',
   location_requested:true,location:gps,coordinates:gps,travel_mode:'transit',
   mixed_journey:state.lastTransitChoice?.mixedJourney||undefined,transit_query:label,transit_destination:destination,
   transit_count:source?.requested_transit_count||undefined,
   route_context:{pending:'profile',destination_query:label,destination}
  })});
  const data=await response.json();
  if(!visible())return;
  const returned=data?.transit_destination_point;
  if(!response.ok||data.status!=='success'||data.needs_destination_clarification||
     !returned||!Number.isFinite(Number(returned.latitude))||!Number.isFinite(Number(returned.longitude))||
     transitDistance(destination,{latitude:Number(returned.latitude),longitude:Number(returned.longitude)})>1000)throw Error('invalid_transit_refresh');
  if(!Array.isArray(data.transit)||!data.transit.length){transitRefreshNotice(t[3]);return}
  cancelTransitAccess(true);
  state.lastTransitResponse=data;
  state.lastTransitChoice={...state.lastTransitChoice,kind:'transit',transitDirect:true,transitDestination:destination};
  renderTransitChoices(data.transit);
 }catch(error){if(visible())transitRefreshNotice(t[1]);console.warn('Pocket AI transit refresh:',String(error?.message||error).slice(0,120))}
 finally{
  clearTimeout(timeout);
  if(refreshGeneration===state.transitRefreshGeneration){state.transitRefreshBusy=false;state.transitRefreshAbort=null}
  if(button?.isConnected){button.disabled=false;button.textContent=original}
 }
}
function renderTransitChoices(options,selectedIndex=null){
 dismissSelectionKeyboard();
 document.querySelector('.module-quick-sheet')?.classList.remove('details-mode');const body=$('moduleLayerBody'),t=transitAccessText();body.innerHTML='';document.querySelector('.module-quick-sheet')?.classList.add('results-mode');body.style.cssText='display:flex;flex-direction:column;gap:10px;overflow-y:auto!important;overflow-x:hidden;overscroll-behavior:contain;min-height:0;height:100%;max-height:100%;padding:12px 12px 40px';
 const heading=document.createElement('h3');heading.textContent=selectedIndex===null?t[0]:t[1]+' '+(selectedIndex+1)+(options[selectedIndex]?.legs?.at(-1)?.to?' → '+options[selectedIndex].legs.at(-1).to:'');body.append(heading);body.scrollTop=0;
 const actions=document.createElement('div');actions.className='quick-navigation-toolbar';
 const back=document.createElement('button');back.type='button';back.className='transit-choice-action';back.textContent=dialogText("Anterior","Previous");back.onclick=()=>{
  cancelTransitAccess(true);
  if(selectedIndex!==null){renderTransitChoices(options);return}
  const source=state.navigationReturnContext;
  if(source?.view==='assistant'){returnToNavigationSource();return}
  if(source?.details&&source.module===state.currentModule){offerPlaceTravelModes(source.details);return}
  handleModuleLayerBack();
 };
 actions.append(back);
 if(state.navigationReturnContext){const original=document.createElement('button');original.type='button';original.className='transit-choice-action';
  original.textContent=dialogText("Revenire","Return");
  original.onclick=()=>returnToNavigationSource();actions.append(original)}
 body.append(actions);
 if(selectedIndex!==null){const journey=options[selectedIndex];if(!journey)return;const summary=document.createElement('p');summary.textContent=transitBoardingSummary(journey);body.append(summary);
  const selected=state.selectedTransitJourney,status=document.createElement('p');status.className='transit-access-status';status.setAttribute('role','status');status.textContent=selected?.loading?t[10]:selected?.error||'';body.append(status);
  // Walking directions are viewed in the map, not repeatedly offered as a
  // generic retry from the public-transport card after an expired departure.
  if(selected?.accessRoute&&!selected.error){const walk=document.createElement('button');walk.type='button';walk.className='transit-choice-action';walk.textContent=t[9];walk.onclick=()=>openRouteMap(selected.accessRoute,walk,selected.accessOptions);body.append(walk)}
  if(state.lastTransitChoice){const refresh=document.createElement('button');refresh.type='button';refresh.className='transit-choice-action';refresh.textContent=t[15];refresh.onclick=()=>refreshTransitDepartures(refresh);body.append(refresh)}
  appendTransitLegs(body,journey);appendFinalTransitWalkAction(body,journey);return;
 }
 const available=feasibleTransitChoices(options);
 if(!available.length){const p=document.createElement('p');p.className='transit-access-status';p.textContent=transitRefreshText()[5];body.append(p)}
 else appendTransitCards(body,available);
 if(state.lastTransitResponse?.transit_destination_point){const refresh=document.createElement('button');refresh.type='button';refresh.className='transit-choice-action';refresh.textContent=t[15];refresh.onclick=()=>refreshTransitDepartures(refresh);body.append(refresh)}
}
async function selectTransitJourney(options,index){
 if(state.busy)return;cancelTransitAccess();const journey=options[index];if(!journey)return;const generation=state.transitAccessGeneration,chatGeneration=state.conversationGeneration,t=transitAccessText();const selected={journey,options,index,loading:true,error:'',accessRoute:null,accessOptions:[]};state.selectedTransitJourney=selected;renderTransitChoices(options,index);
 const stop=journey.boarding_stop,valid=()=>state.selectedTransitJourney===selected&&state.transitAccessGeneration===generation&&state.conversationGeneration===chatGeneration;
 const fail=message=>{if(!valid())return;selected.loading=false;selected.error=message;renderTransitChoices(options,index)};
 if(!validTransitBoardingStop(stop)){fail(t[11]);return}
 const departure=Date.parse(journey.firstVehicleDepartureTime||stop.departure_time||'');if(Number.isFinite(departure)&&departure<=Date.now()){fail(t[14]);return}
 let timer,locationReady=false;try{
  const coordinates=await getCurrentCoordinates(false);if(!valid())return;if(!coordinates||!Number.isFinite(coordinates.latitude)||!Number.isFinite(coordinates.longitude)){fail(t[12]);return}
  locationReady=true;const controller=new AbortController();state.transitAccessAbort=controller;timer=setTimeout(()=>controller.abort(),25000);
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({message:routeActionsText().prompt+stop.label,language:state.language,module:state.currentModule||'assistant',history:[],location:coordinates,coordinates,location_requested:true,route_profile:'walk',route_destination:{latitude:stop.latitude,longitude:stop.longitude,label:stop.label},route_context:null})});
  const data=await response.json();if(!valid())return;if(!response.ok||data.status!=='success'||data.route_available!==true||!transitWalkingMatches(data.route,stop)){fail(t[13]);return}
  const seconds=data.route.durationSeconds,margin=Number.isFinite(journey.safetyMarginMinutes)?journey.safetyMarginMinutes:5;
  if(Number.isFinite(departure)&&Number.isFinite(seconds)&&departure<Date.now()+Math.max(0,seconds)*1000+Math.max(0,margin)*60000){fail(t[14]);return}
  selected.loading=false;selected.accessRoute=data.route;selected.accessOptions=(Array.isArray(data.routes)?data.routes:[data.route]).filter(r=>transitWalkingMatches(r,stop)&&(!Number.isFinite(departure)||!Number.isFinite(r.durationSeconds)||departure>=Date.now()+r.durationSeconds*1000+Math.max(0,margin)*60000));selected.walkingReply=String(data.reply||'');selected.timeUnverified=!Number.isFinite(departure)||!Number.isFinite(seconds);state.lastRoute=data.route;state.lastRouteOptions=selected.accessOptions;state.lastRouteReply=selected.walkingReply;state.routeSearchContext=data.route_context||null;renderTransitChoices(options,index);await openRouteMap(data.route,null,selected.accessOptions);
 }catch(error){if(valid())fail(locationReady?t[13]:t[12])}finally{clearTimeout(timer);if(valid())state.transitAccessAbort=null}
}
function appendSelectedTransit(host,route){const selected=state.selectedTransitJourney;if(!selected?.accessRoute||!transitWalkingMatches(route,selected.journey.boarding_stop))return;const t=transitAccessText(),details=document.createElement('details'),summary=document.createElement('summary');details.className='selected-transit';summary.textContent=t[1]+(selected.journey.legs?.at(-1)?.to?' → '+selected.journey.legs.at(-1).to:'')+' · '+transitBoardingSummary(selected.journey);details.append(summary);if(selected.timeUnverified){const note=document.createElement('p');note.textContent=t[21];details.append(note)}appendTransitLegs(details,selected.journey);appendFinalTransitWalkAction(details,selected.journey);host.append(details)}
function appendTransitChoiceAction(data,bubble){if(!Array.isArray(data.transit)||!data.transit.length)return;state.lastTransitResponse=data;state.lastTransitChoice={kind:'transit',title:'Transport public',prompt:String(data.message_received||''),transitDirect:true};const button=document.createElement('button');button.type='button';button.className='transit-choice-action';button.textContent=transitAccessText()[3];button.onclick=()=>{closeAnswerReader(false);closeRouteMap(false);$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');$('moduleLayerTitle').textContent=transitAccessText()[0];renderTransitChoices(data.transit)};bubble.append(button)}

async function runModuleSearch(choice){if(state.moduleSearchBusy)return;if(choice.kind==='transit'){cancelTransitAccess(true);state.lastTransitChoice=choice}if(choice.kind==='transit'&&!choice.transitDirect&&!choice.prompt.includes('până la ')){showTransitDestination(choice);return}if(choice.kind==='walking'){$('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');state.pendingRouteStart=true;inputEl.value=routeActionsText().walking;await submitMessage();return;}state.moduleSearchCategory=choice;state.moduleSearchBusy=true;const searchGeneration=++state.moduleSearchGeneration;setModuleLayerMode(localizedQuickChoiceTitle(choice));moduleStatus(quickUiText().searching+' '+localizedQuickChoiceTitle(choice).toLowerCase()+' '+quickUiText().nearby);try{let coords=null;let locationError=null;try{coords=choice.journeyOrigin||await Promise.race([getCurrentCoordinates(false),new Promise((_,reject)=>setTimeout(()=>reject(new Error('GPS timeout (8s)')),8000))])}catch(error){locationError=String(error&&error.message||(dialogText('Nu am putut obține locația telefonului.','Could not access the phone location.')))}const locationIntent=needsLocation(choice.prompt)||choice.kind==='places'||choice.kind==='transit';const body={message:choice.prompt,language:choice.kind==='places'?'ro':state.language,history:[],module:state.currentModule,location_requested:locationIntent,location:coords,coordinates:coords,location_error:locationError||undefined,quick_place_search:choice.kind==='places',transit_destination:choice.transitDestination||undefined,mixed_journey:choice.mixedJourney||undefined,transit_query:choice.transitQuery||undefined};const searchAbort=new AbortController();const searchTimeout=setTimeout(()=>searchAbort.abort(),25000);let data;try{const queries=choice.title==='Marketuri și brutării'?['Găsește supermarketuri și magazine alimentare în apropierea mea.','Găsește brutării și patiserii în apropierea mea.']:[body.message];const responses=await Promise.all(queries.map(async query=>{const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,message:query}),signal:searchAbort.signal});let result;try{result=await response.json()}catch{throw new Error(dialogText('Serverul a trimis un răspuns care nu poate fi citit.','The server returned an unreadable response.'))}if(!response.ok||(result.status&&result.status!=='success'))throw new Error(result.error||result.message||'HTTP '+response.status);return result}));data=responses[0];if(responses.length>1){const merged=responses.flatMap(item=>Array.isArray(item.places)?item.places:[]);const seen=new Set();data={...data,places:merged.filter(place=>{const key=String(place.id||place.osm_id||[place.name,place.address].join('|')).toLowerCase();if(seen.has(key))return false;seen.add(key);return true}),search_ok:responses.some(item=>item.search_ok)};}if(!Array.isArray(data.places)&&!(typeof data.reply==='string'&&data.reply.trim()))throw new Error('Serverul nu a returnat un răspuns utilizabil.')}finally{clearTimeout(searchTimeout)};if(searchGeneration!==state.moduleSearchGeneration)return;state.placeSearchContext=data.place_context||null;state.distanceSearchContext=data.distance_context||null;state.routeSearchContext=data.route_context||null;state.weatherSearchContext=data.weather_context||null;state.moduleSearchReply=String(data.reply||'').trim();state.moduleSearchResults=Array.isArray(data.places)?data.places:[];if(Array.isArray(data.places))state.lastPlaceResults=data.places;if(choice.kind==='places'&&!state.moduleSearchResults.length&&data.search_ok===true){state.moduleSearchReply=dialogText("În raza de căutare de 5 km nu sunt semnalate obiective din categoria selectată în datele de hartă disponibile.","No mapped places in the selected category were found within the 5 km search radius.");}else if(choice.kind==='places'&&!state.moduleSearchResults.length&&!state.moduleSearchReply){state.moduleSearchReply=quickUiText().notFound;}if(choice.kind==='transit'&&data.needs_destination_clarification&&Array.isArray(data.destination_candidates)&&data.destination_candidates.length){
 const target=$('moduleLayerBody');target.innerHTML='';
 const heading=document.createElement('h3');heading.textContent=dialogText('Ce destinație dorești?','Which destination did you mean?');target.append(heading);
 data.destination_candidates.slice(0,4).forEach(candidate=>{
  const lat=Number(candidate.latitude),lon=Number(candidate.longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lon))return;
  const option=document.createElement('button');option.type='button';option.textContent=String(candidate.label||'Destinație');
  option.style.cssText='display:block;width:100%;padding:14px;margin:10px 0;text-align:left;border-radius:12px;background:#12374b;color:#fff;border:1px solid #55bfcf';
  option.onclick=()=>runModuleSearch({...choice,transitDestination:{label:String(candidate.label||''),latitude:lat,longitude:lon}});
  target.append(option);
 });
}else if(choice.kind==='transit'&&Array.isArray(data.transit)&&data.transit.length){state.lastTransitResponse=data;renderTransitChoices(data.transit)}else if(choice.kind==='places'&&state.moduleSearchResults.length){renderModulePlaces(state.moduleSearchResults)}else{moduleStatus(state.moduleSearchReply);if(choice.kind==='places'&&data.search_ok&&state.moduleSearchResults.length===0){const note=document.createElement('p');note.className='muted';note.textContent=dialogText('Căutarea s-a încheiat, dar nu a returnat locații. Poți reveni și încerca din nou.','The search finished but returned no locations. Go back and try again.');$('moduleLayerBody').append(note)}}}catch(error){if(searchGeneration===state.moduleSearchGeneration){moduleStatus(error?.name==='AbortError'?(dialogText("Căutarea a depășit 25 de secunde. Încearcă din nou.","Search timed out after 25 seconds. Please retry.")):(state.language==='en'?'Could not complete the search. ':'Nu am putut finaliza căutarea. ')+String(error&&error.message||error));console.error('myPocket AI module search failed:',error)}}finally{if(searchGeneration===state.moduleSearchGeneration)state.moduleSearchBusy=false}}
function handleModuleLayerBack(){
 cancelTransitAccess(true);
 // Restore the originating quick-choice module before walking back through its screens.
 const origin=state.navigationReturnContext;
 if(origin?.view==='assistant'&&state.moduleSearchReturnMode==='root'){returnToNavigationSource();return}
 if(origin?.module==='travel'&&state.currentModule==='maps'&&state.moduleSearchReturnMode==='root'){
  switchConversationModule('travel');state.navigationReturnContext=null;openModuleQuickLayer();return;
 }
 if(state.moduleSearchBusy){state.moduleSearchGeneration++;state.moduleSearchBusy=false}
 if(state.moduleSearchReturnMode==='mode'&&state.lastQuickPlace){renderModulePlaceDetails(state.lastQuickPlace);return}
 if(state.moduleSearchReturnMode==='details'&&state.moduleSearchResults?.length){renderModulePlaces(state.moduleSearchResults);return}
 if(state.moduleSearchCategory){state.moduleSearchCategory=null;state.moduleSearchResults=[];state.moduleSearchReply='';if(state.navigationReturnContext?.module==='travel'&&state.currentModule==='maps')switchConversationModule('travel');$('moduleLayerTitle').textContent=UI_TEXT[state.language]?.quickTitle||'Selecții rapide';renderModuleQuickChoices();$('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');return}
 $('moduleQuickLayer').classList.remove('open');$('moduleQuickLayer').setAttribute('aria-hidden','true');
}
function addQuickButton(icon,title,prompt,module){const b=document.createElement('button');b.type='button';b.className='list-row quick-selection';b.style.width='100%';b.style.textAlign='left';const i=document.createElement('span');i.style.flex='0 0 34px';i.textContent=icon;const label=document.createElement('span');label.textContent=title;const arrow=document.createElement('strong');arrow.textContent='›';b.append(i,label,arrow);b.addEventListener('click',()=>{if(state.busy){notify('Așteaptă să se termine răspunsul curent.');return}if(title==='Hoteluri și POI'&&state.currentModule==='maps'){openModule('travel');return}if(state.currentView!=='module'||state.currentModule!==module){openModule(module)}state.pendingModulePrompt=prompt;inputEl.value=prompt;/* Text entry stays unfocused until the input itself is tapped. */setStatus('Solicitarea este pregătită în modul '+(MODULES[module]?.title||'selectat')+'. Apasă trimitere pentru a continua.');});$('moduleContent').append(b)}
const ROUTE_MAP_TEXT={ro:{title:'Traseu pe hartă',open:'Vezi traseul pe hartă',close:'Închide',external:'Deschide în Google Maps',loading:'Se încarcă harta…',failed:'Harta nu s-a încărcat. Poți folosi linkul extern.',shown:'Am deschis traseul calculat pe hartă.'},en:{title:'Route map',open:'View route on map',close:'Close',external:'Open in Google Maps',loading:'Loading map…',failed:'The map did not load. You can use the external link.',shown:'I opened the calculated route on the map.'},fr:{title:'Carte du trajet',open:'Voir le trajet',close:'Fermer',external:'Ouvrir dans Google Maps',loading:'Chargement…',failed:'Carte indisponible. Utilisez le lien externe.',shown:'Le trajet calculé est affiché sur la carte.'},de:{title:'Routenkarte',open:'Route auf Karte',close:'Schließen',external:'In Google Maps öffnen',loading:'Karte wird geladen…',failed:'Karte nicht verfügbar. Nutzen Sie den externen Link.',shown:'Die berechnete Route wird auf der Karte angezeigt.'},it:{title:'Mappa del percorso',open:'Vedi percorso',close:'Chiudi',external:'Apri in Google Maps',loading:'Caricamento…',failed:'Mappa non disponibile. Usa il link esterno.',shown:'Ho aperto il percorso calcolato sulla mappa.'},es:{title:'Mapa de la ruta',open:'Ver ruta en el mapa',close:'Cerrar',external:'Abrir en Google Maps',loading:'Cargando…',failed:'Mapa no disponible. Usa el enlace externo.',shown:'He abierto la ruta calculada en el mapa.'},pt:{title:'Mapa do percurso',open:'Ver percurso no mapa',close:'Fechar',external:'Abrir no Google Maps',loading:'A carregar…',failed:'Mapa indisponível. Use a ligação externa.',shown:'Abri o percurso calculado no mapa.'},nl:{title:'Routekaart',open:'Route op kaart',close:'Sluiten',external:'Open in Google Maps',loading:'Kaart laden…',failed:'Kaart niet beschikbaar. Gebruik de externe link.',shown:'De berekende route staat op de kaart.'},ru:{title:'Карта маршрута',open:'Маршрут на карте',close:'Закрыть',external:'Открыть в Google Maps',loading:'Загрузка карты…',failed:'Карта недоступна. Используйте внешнюю ссылку.',shown:'Рассчитанный маршрут открыт на карте.'},pl:{title:'Mapa trasy',open:'Pokaż trasę na mapie',close:'Zamknij',external:'Otwórz w Google Maps',loading:'Ładowanie…',failed:'Mapa niedostępna. Użyj zewnętrznego linku.',shown:'Obliczona trasa jest otwarta na mapie.'}};
let activeRouteMap=null,leafletLoading=null;
const ROUTE_ACTIONS={
 ro:{navigate:'Pornește navigația în Google Maps',steps:'Indicații pe străzi',noSteps:'Serviciul nu a furnizat indicații pe străzi.',walking:'Traseu pietonal',prompt:'Traseu pietonal până la ',note:'Google Maps poate recalcula traseul. Navigația se deschide în aplicația sau pagina Google Maps.'},
 en:{navigate:'Start navigation in Google Maps',steps:'Street directions',noSteps:'The provider supplied no street directions.',walking:'Walking route',prompt:'Walking route to ',note:'Google Maps may recalculate the route. Navigation opens in the Google Maps app or website.'},
 fr:{navigate:'Démarrer dans Google Maps',steps:'Instructions',noSteps:'Aucune instruction fournie.',walking:'Itinéraire à pied',prompt:'Itinéraire à pied vers ',note:'Google Maps peut recalculer le trajet. La navigation s’ouvre dans Google Maps.'},
 de:{navigate:'Navigation in Google Maps starten',steps:'Wegbeschreibung',noSteps:'Keine Wegbeschreibung geliefert.',walking:'Fußweg',prompt:'Fußweg nach ',note:'Google Maps kann die Route neu berechnen. Die Navigation öffnet sich in Google Maps.'},
 it:{navigate:'Avvia navigazione in Google Maps',steps:'Indicazioni stradali',noSteps:'Nessuna indicazione fornita.',walking:'Percorso a piedi',prompt:'Percorso a piedi verso ',note:'Google Maps può ricalcolare il percorso. La navigazione si apre in Google Maps.'},
 es:{navigate:'Iniciar navegación en Google Maps',steps:'Indicaciones',noSteps:'No se proporcionaron indicaciones.',walking:'Ruta a pie',prompt:'Ruta a pie hasta ',note:'Google Maps puede recalcular la ruta. La navegación se abre en Google Maps.'},
 pt:{navigate:'Iniciar navegação no Google Maps',steps:'Indicações',noSteps:'Não foram fornecidas indicações.',walking:'Percurso a pé',prompt:'Percurso a pé para ',note:'O Google Maps pode recalcular o percurso. A navegação abre no Google Maps.'},
 nl:{navigate:'Navigatie starten in Google Maps',steps:'Routebeschrijving',noSteps:'Geen routebeschrijving beschikbaar.',walking:'Wandelroute',prompt:'Wandelroute naar ',note:'Google Maps kan de route opnieuw berekenen. Navigatie opent in Google Maps.'},
 ru:{navigate:'Начать навигацию в Google Maps',steps:'Указания по улицам',noSteps:'Указания не предоставлены.',walking:'Пеший маршрут',prompt:'Пеший маршрут до ',note:'Google Maps может пересчитать маршрут. Навигация открывается в Google Maps.'},
 pl:{navigate:'Rozpocznij nawigację w Google Maps',steps:'Wskazówki',noSteps:'Brak wskazówek od dostawcy.',walking:'Trasa piesza',prompt:'Trasa piesza do ',note:'Google Maps może przeliczyć trasę. Nawigacja otwiera się w Google Maps.'}
};
function routeActionsText(){return ROUTE_ACTIONS[state.language]||ROUTE_ACTIONS.en}
const ROUTE_OPTIONS_TEXT={"ro":["Alege traseul","Caută alte trasee pietonale","Alternativele sunt liniile gri; traseul ales este albastru."],"en":["Choose route","Find other walking routes","Alternatives are grey; the selected route is blue."],"fr":["Choisir le trajet","Chercher d’autres trajets à pied","Les variantes sont grises ; le trajet choisi est bleu."],"de":["Route wählen","Weitere Fußwege suchen","Alternativen sind grau, die gewählte Route ist blau."],"it":["Scegli percorso","Cerca altri percorsi a piedi","Le alternative sono grigie; il percorso scelto è blu."],"es":["Elegir ruta","Buscar otras rutas a pie","Las alternativas son grises; la ruta elegida es azul."],"pt":["Escolher percurso","Procurar outros percursos a pé","As alternativas são cinzentas; o percurso escolhido é azul."],"nl":["Kies route","Zoek andere wandelroutes","Alternatieven zijn grijs; de gekozen route is blauw."],"ru":["Выбрать маршрут","Найти другие пешие маршруты","Варианты серые; выбранный маршрут синий."],"pl":["Wybierz trasę","Znajdź inne trasy piesze","Warianty są szare; wybrana trasa jest niebieska."]};
function routeOptionsText(){return ROUTE_OPTIONS_TEXT[state.language]||ROUTE_OPTIONS_TEXT.en}
function routeOptionsControl(route,options){
 const t=routeOptionsText(),box=document.createElement('div');box.className='route-options';
 const usable=Array.isArray(options)?options.filter(validMapRoute):[];
 if(usable.length>1){
  const label=document.createElement('div');label.className='travel-mode-table';const heading=document.createElement('strong');heading.textContent=t[0];label.append(heading);
  usable.forEach((v,i)=>{const button=document.createElement('button');button.type='button';button.className='transit-choice-action';button.style.cssText='display:block;width:100%;margin:8px 0;text-align:left;white-space:normal';button.textContent=(v===route?'✓  ':'')+(v.label||String(i+1))+' · '+(v.distanceMeters/1000).toLocaleString(state.language,{maximumFractionDigits:1})+' km'+(Number.isFinite(v.durationSeconds)?' · '+formatTravelDurationMinutes(v.durationSeconds/60):'');button.onclick=()=>{state.lastRoute=v;openRouteMap(v,null,usable)};label.append(button)});
  box.append(label);
 }
 if(route.profile==='walk'||route.profile==='foot'){
  const button=document.createElement('button');button.type='button';button.className='route-map-open';button.textContent=t[1];
  button.onclick=()=>{if(state.busy)return;state.pendingRouteCompare=true;state.routeSearchContext={profile:'walk',destination_query:route.destination?.label||'',destination:route.destination,origin:route.origin?.location_source==='gps'?null:route.origin,origin_query:route.origin?.location_source==='gps'?'':route.origin?.label||'',pending:null,candidates:[]};inputEl.value=t[1];closeRouteMap(false);closeAnswerReader(false);submitMessage()};box.append(button);
 }return box;
}
function routeNavigationUrl(route,navigate=false){
 if(!validMapRoute(route))return '';
 const first=route.coordinates[0],last=route.coordinates.at(-1),destination=route.destination;
 const u=new URL('https://www.google.com/maps/dir/');u.searchParams.set('api','1');
 if(!navigate||route.origin?.location_source!=='gps')u.searchParams.set('origin',first[1]+','+first[0]);
 u.searchParams.set('destination',Number.isFinite(destination?.latitude)&&Number.isFinite(destination?.longitude)?destination.latitude+','+destination.longitude:last[1]+','+last[0]);
 const via=(route.via||[]).filter(p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)).slice(0,3);if(via.length)u.searchParams.set('waypoints',via.map(p=>p.latitude+','+p.longitude).join('|'));
 u.searchParams.set('travelmode',route.profile==='drive'?'driving':'walking');if(navigate)u.searchParams.set('dir_action','navigate');
 return u.href;
}
const ROUTE_LIVE_TEXT={"ro":["Urmărește traseul în Pocket AI","Oprește navigarea","Recentrează","Se așteaptă poziția GPS…","GPS indisponibil pe acest dispozitiv.","Permite accesul la locație pentru urmărirea traseului.","Distanță rămasă aproximativă","Poziție GPS imprecisă","GPS neactualizat. Se așteaptă o poziție nouă.","Ești în afara traseului. Oprește și recalculează.","Google Maps (extern)","Urmărire GPS cu aplicația deschisă. Consultă lista de indicații; ghidarea vocală și recalcularea automată nu sunt active."],"en":["Follow route in Pocket AI","Stop navigation","Recenter","Waiting for GPS…","GPS unavailable on this device.","Allow location access to follow the route.","Approximate distance remaining","Low GPS accuracy","GPS is not current. Waiting for a new fix.","You are off route. Stop and recalculate.","Google Maps (external)","GPS tracking while the app stays open. Use the direction list; voice guidance and automatic rerouting are not active."],"fr":["Suivre dans Pocket AI","Arrêter la navigation","Recentrer","En attente du GPS…","GPS indisponible.","Autorisez la localisation pour suivre le trajet.","Distance restante approximative","GPS peu précis","GPS non actualisé. En attente.","Hors trajet. Arrêtez et recalculez.","Google Maps (externe)","Suivi GPS avec l’application ouverte. Consultez les instructions ; guidage vocal et recalcul automatique inactifs."],"de":["Route in Pocket AI verfolgen","Navigation beenden","Zentrieren","GPS wird gesucht…","GPS nicht verfügbar.","Standortzugriff für die Route erlauben.","Ungefähre Reststrecke","GPS ungenau","GPS nicht aktuell. Warte auf neue Position.","Abseits der Route. Anhalten und neu berechnen.","Google Maps (extern)","GPS-Verfolgung bei geöffneter App. Wegbeschreibung beachten; Sprachführung und automatische Neuberechnung sind nicht aktiv."],"it":["Segui in Pocket AI","Ferma navigazione","Ricentra","In attesa del GPS…","GPS non disponibile.","Consenti la posizione per seguire il percorso.","Distanza rimanente approssimativa","GPS poco preciso","GPS non aggiornato. In attesa.","Fuori percorso. Ferma e ricalcola.","Google Maps (esterno)","GPS con app aperta. Consulta le indicazioni; guida vocale e ricalcolo automatico non attivi."],"es":["Seguir en Pocket AI","Detener navegación","Centrar","Esperando GPS…","GPS no disponible.","Permite la ubicación para seguir la ruta.","Distancia restante aproximada","GPS poco preciso","GPS sin actualizar. Esperando.","Fuera de ruta. Detén y recalcula.","Google Maps (externo)","GPS con la aplicación abierta. Consulta las indicaciones; voz y recálculo automático no activos."],"pt":["Seguir no Pocket AI","Parar navegação","Centrar","A aguardar GPS…","GPS indisponível.","Permita a localização para seguir o percurso.","Distância restante aproximada","GPS pouco preciso","GPS desatualizado. A aguardar.","Fora do percurso. Pare e recalcule.","Google Maps (externo)","GPS com a aplicação aberta. Consulte as indicações; voz e recálculo automático inativos."],"nl":["Volg in Pocket AI","Navigatie stoppen","Centreren","Wachten op GPS…","GPS niet beschikbaar.","Sta locatie toe om de route te volgen.","Geschatte resterende afstand","GPS onnauwkeurig","GPS niet actueel. Wachten.","Buiten de route. Stop en bereken opnieuw.","Google Maps (extern)","GPS met geopende app. Volg de aanwijzingen; spraak en automatisch herberekenen zijn niet actief."],"ru":["Следовать в Pocket AI","Остановить навигацию","Центрировать","Ожидание GPS…","GPS недоступен.","Разрешите доступ к геопозиции.","Примерное оставшееся расстояние","Низкая точность GPS","GPS не обновлён. Ожидание.","Вы вне маршрута. Остановите и пересчитайте.","Google Maps (внешний)","GPS при открытом приложении. Используйте список указаний; голос и автоматический пересчёт не активны."],"pl":["Śledź w Pocket AI","Zatrzymaj nawigację","Wyśrodkuj","Oczekiwanie na GPS…","GPS niedostępny.","Zezwól na lokalizację, aby śledzić trasę.","Przybliżona pozostała odległość","Niska dokładność GPS","GPS nieaktualny. Oczekiwanie.","Poza trasą. Zatrzymaj i przelicz.","Google Maps (zewnętrzne)","GPS przy otwartej aplikacji. Korzystaj ze wskazówek; głos i automatyczne przeliczanie nie są aktywne."]};
function routeLiveText(){return ROUTE_LIVE_TEXT[state.language]||ROUTE_LIVE_TEXT.en}
function projectWalkingPosition(route,latitude,longitude){
 const sx=111320*Math.max(.01,Math.cos(latitude*Math.PI/180)),sy=111320,x=longitude*sx,y=latitude*sy;
 let total=0,best=Infinity,along=0;
 for(let i=1;i<route.coordinates.length;i++){const a=route.coordinates[i-1],b=route.coordinates[i],ax=a[0]*sx,ay=a[1]*sy,dx=(b[0]-a[0])*sx,dy=(b[1]-a[1])*sy,len=Math.hypot(dx,dy),t=len?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(len*len))):0,d=Math.hypot(x-ax-t*dx,y-ay-t*dy);if(d<best){best=d;along=total+t*len}total+=len;}
 const length=Number.isFinite(route.distanceMeters)?route.distanceMeters:total;return {away:best,remaining:total?Math.max(0,(1-along/total)*length):0};
}
function routeBearing(lat1,lon1,lat2,lon2){
 const a=lat1*Math.PI/180,b=lat2*Math.PI/180,d=(lon2-lon1)*Math.PI/180;
 return (Math.atan2(Math.sin(d)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(d))*180/Math.PI+360)%360;
}
function nearestRouteBearing(route,lat,lon){
 let best=Infinity,heading=null;const cos=Math.cos(lat*Math.PI/180);
 for(let i=1;i<(route.coordinates||[]).length;i++){
  const p=route.coordinates[i-1],q=route.coordinates[i],ax=(p[0]-lon)*cos,ay=p[1]-lat,dx=(q[0]-p[0])*cos,dy=q[1]-p[1],len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/len)):0;
  const d=(ax+t*dx)**2+(ay+t*dy)**2;
  if(d<best){best=d;heading=routeBearing(p[1],p[0],q[1],q[0])}
 }
 return heading;
}
let routeRotationLoading=null;
function loadRouteRotationLibrary(){
 if(typeof window.L?.Map?.prototype?.setHeading==='function')return Promise.resolve(true);
 if(routeRotationLoading)return routeRotationLoading;
 routeRotationLoading=new Promise(resolve=>{
  const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@tomickigrzegorz/leaflet-rotate@0.3.0/dist/leaflet-rotate.umd.min.js';script.async=true;
  let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);resolve(typeof window.L?.Map?.prototype?.setHeading==='function')};
  const timer=setTimeout(finish,3500);script.onload=finish;script.onerror=finish;document.head.append(script);
 });
 return routeRotationLoading;
}
function stopRouteTracking(current,message){
 if(!current)return;current.navigating=false;document.body.classList?.remove('pocket-navigation-fullscreen');current.map?.stopHeadingUp?.();current.resize?.();if(current.watchId!==null&&current.watchId!==undefined){navigator.geolocation?.clearWatch(current.watchId);current.watchId=null}clearTimeout(current.gpsTimer);current.gpsTimer=null;current.liveMarker?.remove();current.liveMarker=null;current.layer.classList?.remove('navigating');if(current.navigation)current.navigation.textContent=routeLiveText()[0];if(current.recenter)current.recenter.hidden=true;if(current.liveStatus){current.liveStatus.textContent=message||'';current.liveStatus.hidden=!message}
}
function startRouteTracking(current){
 if(activeRouteMap!==current||!current.map||current.navigating)return;const t=routeLiveText();
 if(typeof navigator==='undefined'||!navigator.geolocation?.watchPosition){current.liveStatus.hidden=false;current.liveStatus.textContent=t[4];return}
 current.navigating=true;current.watchId=null;current.follow=true;current.firstFix=true;current.layer.classList?.add('navigating');document.body.classList?.add('pocket-navigation-fullscreen');current.resize?.();current.navigation.textContent=t[1];current.recenter.hidden=false;current.liveStatus.hidden=false;current.liveStatus.textContent=t[3];
 const stale=()=>{clearTimeout(current.gpsTimer);current.gpsTimer=setTimeout(()=>{if(current.navigating&&activeRouteMap===current){current.liveStatus.textContent=t[8];current.liveMarker?.setStyle?.({opacity:.35,fillOpacity:.25})}},20000)};stale();
 const success=position=>{
  if(!current.navigating||activeRouteMap!==current)return;const c=position?.coords,age=Date.now()-position?.timestamp;
  if(!c||!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude)||Math.abs(c.latitude)>90||Math.abs(c.longitude)>180||!Number.isFinite(c.accuracy)||c.accuracy<0||!Number.isFinite(age)||age>30000||age< -5000){current.liveStatus.textContent=t[8];return}
  stale();const previousFix=current.lastFix;current.lastFix=[c.latitude,c.longitude];
  if(current.liveMarker)current.liveMarker.setLatLng(current.lastFix);else current.liveMarker=current.leaflet.circleMarker(current.lastFix,{radius:8,color:'#ffffff',fillColor:'#05d6dc',fillOpacity:1,weight:3}).addTo(current.map);
  current.liveMarker?.setStyle?.({opacity:1,fillOpacity:1});
  if(current.follow){if(current.firstFix){current.map.setView(current.lastFix,16,{animate:false});current.firstFix=false}else current.map.panTo(current.lastFix,{animate:false})}
  const accuracy=' ±'+Math.round(c.accuracy)+' m';
  if(c.accuracy>60){current.liveStatus.textContent=t[7]+accuracy;return}
  let heading=Number.isFinite(c.heading)&&c.heading>=0&&c.speed>=0.5?c.heading:null;
  if(heading===null&&previousFix){
   const delta=Math.hypot((c.latitude-previousFix[0])*111320,(c.longitude-previousFix[1])*111320*Math.cos(c.latitude*Math.PI/180));
   if(delta>=8)heading=routeBearing(previousFix[0],previousFix[1],c.latitude,c.longitude);
  }
  if(heading===null)heading=nearestRouteBearing(current.route,c.latitude,c.longitude);
  if(Number.isFinite(heading)){current.lastHeading=heading;current.map?.setHeading?.(heading)}
  if(typeof saveLocation==='function')saveLocation(c);
  const projected=projectWalkingPosition(current.route,c.latitude,c.longitude);
  current.liveStatus.textContent=projected.away>Math.max(60,c.accuracy*2)?t[9]+accuracy:t[6]+': '+Math.round(projected.remaining).toLocaleString(state.language)+' m'+accuracy;
 };
 const failure=error=>{if(!current.navigating||activeRouteMap!==current)return;if(error?.code===1){stopRouteTracking(current,t[5]);if(typeof forgetSharedLocation==='function')forgetSharedLocation()}else{current.liveStatus.textContent=t[8];current.liveMarker?.setStyle?.({opacity:.35,fillOpacity:.25})}};
 try{const id=navigator.geolocation.watchPosition(success,failure,{enableHighAccuracy:true,maximumAge:0,timeout:12000});if(current.navigating)current.watchId=id;else navigator.geolocation.clearWatch(id)}catch{stopRouteTracking(current,t[4])}
}
function routeNavigationLink(route){const button=document.createElement('button');button.type='button';button.className='route-map-open';button.textContent=routeLiveText()[0];button.onclick=async()=>{const chosen=state.lastRouteOptions?.includes(route)&&state.lastRouteOptions.includes(state.lastRoute)?state.lastRoute:route;if(activeRouteMap?.route===chosen){activeRouteMap.navigating?stopRouteTracking(activeRouteMap):startRouteTracking(activeRouteMap)}else await openRouteMap(chosen,button,state.lastRouteOptions,true)};return button}

function appendRouteReaderActions(host,text){
 if(state.lastTransitResponse?.reply===text)appendTransitChoiceAction(state.lastTransitResponse,host);
 if(state.lastRouteReply!==text||!validMapRoute(state.lastRoute))return;
 const actions=document.createElement('div'),button=document.createElement('button');button.type='button';button.className='route-map-open';button.textContent=routeMapText().open;button.onclick=()=>openRouteMap(state.lastRoute,button);
 actions.append(routeOptionsControl(state.lastRoute,state.lastRouteOptions),button,routeNavigationLink(state.lastRoute));host.append(actions);
}

function routeMapText(){return ROUTE_MAP_TEXT[state.language]||ROUTE_MAP_TEXT.en}
function validMapRoute(route){return route&&['walk','drive','foot'].includes(route.profile)&&Array.isArray(route.coordinates)&&route.coordinates.length>=2&&route.coordinates.every(p=>Array.isArray(p)&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=180&&Math.abs(p[1])<=90)}
function isMapRouteFollowup(text){const t=String(text).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();return /harta|map/.test(t)&&/trase|ruta|rute|route|directions/.test(t)&&!/(?:pana|catre|\\bto)\\s+/.test(t)}
function loadRouteMapLibrary(){
 if(window.L)return Promise.resolve(window.L);if(leafletLoading)return leafletLoading;
 leafletLoading=new Promise((resolve,reject)=>{
  if(!document.getElementById('routeLeafletCss')){const link=document.createElement('link');link.id='routeLeafletCss';link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(link)}
  const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.async=true;
  const timer=setTimeout(()=>{script.remove();reject(new Error('Map load timeout'))},8000);
  script.onload=()=>{clearTimeout(timer);window.L?resolve(window.L):reject(new Error('Map unavailable'))};script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('Map unavailable'))};document.head.append(script);
 }).catch(error=>{leafletLoading=null;throw error});return leafletLoading;
}
function closeRouteMap(restoreFocus=true){const current=activeRouteMap;if(!current)return;activeRouteMap=null;stopRouteTracking(current);current.cleanup();current.map?.remove();current.layer.remove();if(restoreFocus){const options=transitOptionsForRoute(current.route);if(options?.length)showTransitChoices(options);else if(current.origin?.isConnected)current.origin.focus({preventScroll:true})}}
async function openRouteMap(route,origin,options=state.lastRouteOptions,startNavigation=false){
 dismissSelectionKeyboard();
 if(!validMapRoute(route))return;state.lastRoute=route;closeAnswerReader(false);closeRouteMap(false);inputEl.blur();const t=routeMapText();
 const layer=document.createElement('section');layer.className='route-map-window';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label',t.title);
 const header=document.createElement('div');header.className='route-map-header';const title=document.createElement('h2');title.textContent=t.title;const previous=document.createElement('button');previous.type='button';previous.className='route-header-action';previous.textContent=dialogText("Anterior","Previous");previous.onclick=()=>{const transitOptions=transitOptionsForRoute(route);closeRouteMap(false);if(transitOptions?.length)showTransitChoices(transitOptions);else openWalkingRouteChoices(route,options)};const returning=document.createElement('button');returning.type='button';returning.className='route-header-action';returning.textContent=dialogText("Închide harta","Close map");returning.onclick=()=>{if(state.navigationReturnContext)returnToNavigationSource();else{closeRouteMap(false);if(state.currentView==='module')showView('module');else showView('home')}};header.append(previous,title,returning)
 const status=document.createElement('p');status.className='route-map-status';status.textContent=t.loading;
 const external=document.createElement('a');external.target='_blank';external.rel='noopener noreferrer';external.textContent=routeLiveText()[10];
 external.href=routeNavigationUrl(route);
 const navigation=routeNavigationLink(route),recenter=document.createElement('button'),liveStatus=document.createElement('p');recenter.type='button';recenter.className='route-map-open route-recenter';recenter.textContent=routeLiveText()[2];recenter.hidden=true;liveStatus.className='route-map-status route-live-status';liveStatus.hidden=true;liveStatus.setAttribute('role','status');
 const stepsPanel=document.createElement('div');stepsPanel.className='route-directions';
 appendSelectedTransit(stepsPanel,route);const stepsTitle=document.createElement('strong');stepsTitle.textContent=routeActionsText().steps;stepsPanel.append(stepsTitle);
 const list=document.createElement('ol');
 for(const step of route.steps||[]){if(typeof step.text!=='string')continue;const li=document.createElement('li');li.textContent=step.text+(Number.isFinite(step.distanceMeters)&&step.distanceMeters>0?' · '+step.distanceMeters.toLocaleString(state.language,{maximumFractionDigits:0})+' m':'');list.append(li)}
 if(list.children.length)stepsPanel.append(list);else{const missing=document.createElement('p');missing.textContent=routeActionsText().noSteps;stepsPanel.append(missing)}
 
 const host=document.createElement('div');host.className='route-map-canvas';layer.append(header,status,navigation,recenter,liveStatus,host,stepsPanel);document.body.append(layer);
 const current={layer,origin,route,navigation,recenter,liveStatus,map:null,watchId:null,navigating:false,cleanup:()=>{},resize:null};recenter.onclick=()=>{current.follow=true;if(current.lastFix)current.map?.setView(current.lastFix,16,{animate:false})};activeRouteMap=current;
 const resize=()=>{const top=document.querySelector('.bottom-nav')?.getBoundingClientRect().top;layer.style.bottom=current.navigating?'0px':(top>0?Math.max(12,window.innerHeight-top+10):108)+'px';current.map?.invalidateSize()};current.resize=resize;
 const key=e=>{if(e.key==='Escape'){e.preventDefault();closeRouteMap()}};
 window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);document.addEventListener('keydown',key);current.cleanup=()=>{window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);document.removeEventListener('keydown',key)};
 resize();previous.focus({preventScroll:true});
 try{const L=await loadRouteMapLibrary();if(activeRouteMap!==current||!layer.isConnected)return;
  const rotateReady=await loadRouteRotationLibrary();if(activeRouteMap!==current||!layer.isConnected)return;
  const map=L.map(host,{rotate:rotateReady});current.map=map;current.leaflet=L;requestAnimationFrame(()=>{if(activeRouteMap===current)map.invalidateSize()});map.on?.('dragstart',()=>{current.follow=false});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  const points=route.coordinates.map(p=>[p[1],p[0]]),allPoints=[...points];
  for(const alternative of (options||[]).filter(validMapRoute)){if(alternative===route||(alternative.id&&alternative.id===route.id))continue;const grey=alternative.coordinates.map(p=>[p[1],p[0]]);allPoints.push(...grey);const other=L.polyline(grey,{color:'#647f91',weight:6,opacity:.65}).addTo(map);other.on?.('click',()=>{state.lastRoute=alternative;openRouteMap(alternative,null,options)})}
  L.polyline(points,{color:'#087fd9',weight:5,opacity:1}).addTo(map);L.circleMarker(points[0],{radius:6,color:'#128a42'}).addTo(map);L.circleMarker(points.at(-1),{radius:6,color:'#c43737'}).addTo(map);map.fitBounds(allPoints,{padding:[22,22]});requestAnimationFrame(()=>{if(activeRouteMap===current){map.invalidateSize();map.fitBounds(allPoints,{padding:[22,22]})}});status.textContent=(route.distanceMeters/1000).toLocaleString(state.language,{maximumFractionDigits:1})+' km'+(Number.isFinite(route.durationSeconds)?' · '+formatTravelDurationMinutes(route.durationSeconds/60):'');
  if(startNavigation)startRouteTracking(current);
 }catch{if(layer.isConnected)status.textContent=t.failed}
}
const routeApproximationNotices=new WeakMap();
function openWalkingRouteChoices(route,options=state.lastRouteOptions){
 dismissSelectionKeyboard();
 const usable=(Array.isArray(options)?options:[]).filter(validMapRoute);
 closeRouteMap(false);closeAnswerReader(false);
 const layer=document.createElement('section');layer.className='answer-reader route-choice-screen';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');
 const header=document.createElement('div');header.className='answer-reader-header';
 const title=document.createElement('h2');title.textContent=routeOptionsText()[0];header.append(title);
 const back=document.createElement('button');back.type='button';back.className='route-header-action';back.textContent=dialogText("Revenire","Return");back.style.cssText='width:auto;min-width:95px;font-size:14px;padding:6px';back.onclick=()=>{layer.remove();if(state.navigationReturnContext)returnToNavigationSource();else if(state.currentView==='module')showView('module')};header.append(back);
 const body=document.createElement('div');body.className='answer-reader-body';body.style.cssText='white-space:normal;scroll-behavior:auto';
 const list=document.createElement('div');list.className='route-options';
 for(const [i,v] of (usable.length?usable:[route]).entries()){
  const button=document.createElement('button');button.type='button';button.className='transit-choice-action';button.style.cssText='white-space:normal;text-align:left;background:linear-gradient(120deg,#24cbd7,#2583c5);color:#062339;font-weight:bold';
  button.textContent=(v===route?'✓ ':'')+(v.label||('Traseu '+(i+1)))+' · '+(v.distanceMeters/1000).toLocaleString(state.language,{maximumFractionDigits:1})+' km'+(Number.isFinite(v.durationSeconds)?' · '+formatTravelDurationMinutes(v.durationSeconds/60):'');
  button.onclick=()=>{layer.remove();state.lastRoute=v;openRouteMap(v,null,usable)};list.append(button);
 }
 const more=routeOptionsControl(route,[]);for(const el of Array.from(more.children))if(el.tagName==='BUTTON')list.append(el);
 const approximation=routeApproximationNotices.get(route);
 if(approximation){
  const notice=document.createElement('p');
  notice.setAttribute('role','status');
  notice.style.cssText='pointer-events:none;margin:0 0 8px';
  notice.textContent=approximation==='locality'
   ?(dialogText("Destinația este în centrul localității.","The destination is in the town centre."))
   :(dialogText("Destinația este un punct aproximativ pe strada aleasă.","The destination is an approximate point on the selected street."));
  body.append(notice);
  setTimeout(()=>notice.remove(),2000);
 }
 body.append(list);layer.append(header,body);document.body.append(layer);
 const top=document.querySelector('.bottom-nav')?.getBoundingClientRect().top;layer.style.bottom=(top>0?Math.max(12,window.innerHeight-top+10):108)+'px';
 back.focus({preventScroll:true});
}
function retainRouteResult(data,bubble){
 if(validMapRoute(data.route)){state.lastRouteOptions=Array.isArray(data.routes)?data.routes.filter(validMapRoute):[data.route];if(!state.lastRouteOptions.some(v=>v===data.route))state.lastRouteOptions=state.lastRouteOptions.map(v=>v.id===data.route.id?data.route:v);state.lastRoute=data.route;state.lastRouteReply=String(data.reply||'').trim();const button=document.createElement('button');button.type='button';button.className='route-map-open';button.textContent=routeMapText().open;button.onclick=()=>openRouteMap(data.route,button,data.routes);bubble.append(routeOptionsControl(data.route,data.routes),button,routeNavigationLink(data.route));if(data.auto_open_map)requestAnimationFrame(()=>openRouteMap(data.route,button))}
 else if(data.route_available===false&&data.route_context){state.lastRoute=null;state.lastRouteOptions=[];}
}
const READER_LABELS={
 ro:{title:'Răspuns complet',open:'Citește răspunsul',pause:'Pauză',play:'Continuă',restart:'De la început',close:'Închide',speed:'Viteză'},
 en:{title:'Full answer',open:'Read answer',pause:'Pause',play:'Resume',restart:'Start over',close:'Close',speed:'Speed'},
 fr:{title:'Réponse complète',open:'Lire la réponse',pause:'Pause',play:'Reprendre',restart:'Recommencer',close:'Fermer',speed:'Vitesse'},
 de:{title:'Vollständige Antwort',open:'Antwort lesen',pause:'Pause',play:'Fortsetzen',restart:'Von vorne',close:'Schließen',speed:'Tempo'},
 it:{title:'Risposta completa',open:'Leggi la risposta',pause:'Pausa',play:'Riprendi',restart:'Ricomincia',close:'Chiudi',speed:'Velocità'},
 es:{title:'Respuesta completa',open:'Leer respuesta',pause:'Pausa',play:'Continuar',restart:'Desde el inicio',close:'Cerrar',speed:'Velocidad'},
 pt:{title:'Resposta completa',open:'Ler resposta',pause:'Pausa',play:'Continuar',restart:'Recomeçar',close:'Fechar',speed:'Velocidade'},
 nl:{title:'Volledig antwoord',open:'Antwoord lezen',pause:'Pauze',play:'Hervatten',restart:'Opnieuw',close:'Sluiten',speed:'Snelheid'},
 ru:{title:'Полный ответ',open:'Читать ответ',pause:'Пауза',play:'Продолжить',restart:'Сначала',close:'Закрыть',speed:'Скорость'},
 pl:{title:'Pełna odpowiedź',open:'Czytaj odpowiedź',pause:'Pauza',play:'Wznów',restart:'Od początku',close:'Zamknij',speed:'Prędkość'}
};
let activeAnswerReader=null;
function readerLabels(){return READER_LABELS[state.language]||READER_LABELS.en}
// Reusable two-column collection table: chronological events now, other
// structured collections can use the same reader without altering recipes.
// Shared renderer. Backend decides the appropriate presentation from the
// user's goal and validated data; the client creates safe, theme-consistent DOM.
function appendAdaptivePresentation(host,record){
 const plan=record?.plan;
 if(plan?.version!==1||!Array.isArray(plan.blocks)||plan.blocks.length!==1)return false;
 // Event calendars, route, accommodation and transport keep their proven specialist views.
 if(plan.source_type!=="news"&&plan.source_type!=="general"&&plan.source_type!=="generic")return false;
 const block=plan.blocks[0];
 if(!["interactive_article_table","table","list"].includes(block?.kind))return false;
 const lang=state.language||"ro";
 const labels={
  ro:{back:"Înapoi la rezultate",original:"Deschide articolul original",source:"Sursă",details:"Detalii",unverified:"Sursă identificată · afirmațiile nu sunt verificate independent"},
  en:{back:"Back to results",original:"Open original article",source:"Source",details:"Details",unverified:"Source identified · claims not independently verified"},
  fr:{back:"Retour aux résultats",original:"Ouvrir l’article original",source:"Source",details:"Détails",unverified:"Source identifiée · informations non vérifiées"},
  de:{back:"Zurück zu Ergebnissen",original:"Originalartikel öffnen",source:"Quelle",details:"Details",unverified:"Quelle gefunden · Aussagen nicht geprüft"},
  it:{back:"Torna ai risultati",original:"Apri articolo originale",source:"Fonte",details:"Dettagli",unverified:"Fonte identificata · affermazioni non verificate"},
  es:{back:"Volver a resultados",original:"Abrir artículo original",source:"Fuente",details:"Detalles",unverified:"Fuente identificada · afirmaciones no verificadas"},
  pt:{back:"Voltar aos resultados",original:"Abrir artigo original",source:"Fonte",details:"Detalhes",unverified:"Fonte identificada · afirmações não verificadas"},
  nl:{back:"Terug naar resultaten",original:"Open origineel artikel",source:"Bron",details:"Details",unverified:"Bron gevonden · claims niet onafhankelijk geverifieerd"},
  ru:{back:"Назад к результатам",original:"Открыть оригинал",source:"Источник",details:"Подробности",unverified:"Источник найден · сведения не проверены"},
  pl:{back:"Wróć do wyników",original:"Otwórz oryginał",source:"Źródło",details:"Szczegóły",unverified:"Źródło ustalone · treści niezweryfikowane"}
 }[lang]||{back:"Back",original:"Original article",source:"Source",details:"Details",unverified:"Claims unverified"};
 const add=(tag,value,style,parent=host)=>{
   const n=document.createElement(tag);n.textContent=String(value??"");
   if(style)n.style.cssText=style;
   parent.append(n);return n;
 };
 const safeUrl=value=>{try{const u=new URL(String(value||""));return u.protocol==="https:"&&!u.username&&!u.password?u.href:null}catch{return null}};
 const dateText=value=>{
   if(!value)return "";
   const str=String(value);
   const parsed=/^\d{8}T\d{6}Z$/.test(str)?str.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,"$1-$2-$3T$4:$5:$6Z"):str;
   const date=Date.parse(parsed);
   return Number.isFinite(date)?new Date(date).toLocaleDateString(lang,{year:"numeric",month:"short",day:"numeric"}):str.slice(0,22);
 };
 if(block.kind==="list"){
   const items=Array.isArray(block.items)?block.items.slice(0,35):[];
   if(!items.length)return false;
   const ul=add("ol","","line-height:1.6;padding-left:24px");
   for(const item of items)add("li",String(item).slice(0,700),"padding-bottom:8px",ul);
   return true;
 }
 const rows=Array.isArray(block.rows)?block.rows.slice(0,40):[];
 const cols=Array.isArray(block.columns)?block.columns.slice(0,5):[];
 if(!rows.length||!cols.length)return false;
 const isArticle=block.kind==="interactive_article_table"&&block.selection?.action==="open_article_detail";
 const cell=(row,key)=>String(row?.cells?.[key]??"").slice(0,700);
 const showDetail=row=>{
   host.replaceChildren();host.scrollTop=0;
   const title=cell(row,"title")||cell(row,"name")||labels.details;
   add("h3",title,"font-size:19px;line-height:1.4;overflow-wrap:anywhere;margin:0 0 12px;color:#dbf8ff");
   const source=cell(row,"source_name"),date=dateText(cell(row,"published_at"));
   if(date)add("p",date,"font-size:13px;opacity:.85;margin:0 0 12px");
   const url=safeUrl(row.source_url);
   const detail=add("p",lang==="ro"?"Se citește articolul…":"Reading the article…","line-height:1.7;overflow-wrap:anywhere;white-space:pre-wrap;margin:0 0 20px");
   loadSourceBasedNewsDetail(detail,url,lang,cell(row,"summary"));
   const sourceText=lang==="ro"?"Sursa: ":lang==="fr"?"Source : ":lang==="de"?"Quelle: ":lang==="es"?"Fuente: ":lang==="it"?"Fonte: ":lang==="pt"?"Fonte: ":lang==="nl"?"Bron: ":lang==="ru"?"Источник: ":lang==="pl"?"Źródło: ":"Source: ";
   const footer=add("p",sourceText+(source||""),"font-size:13px;color:#c6e6f1;margin:14px 0 16px;overflow-wrap:anywhere");
   if(url){const a=add("a",isTelegramLink(url)?(lang==="ro"?"Deschide postarea Telegram":"Open Telegram post"):labels.original,"color:#99ecff;text-decoration:underline;display:block;margin-top:5px",footer);a.href=url;a.target="_blank";a.rel="noopener noreferrer";}
   const back=add("button",labels.back,"padding:11px 16px;margin:10px 0 22px;color:#dbf8ff;border:1px solid #54859b;border-radius:10px;background:#17384c;font:inherit");
   back.type="button";back.onclick=showTable;
 };
 let newsPage=0;
 const showTable=()=>{
   host.replaceChildren();host.scrollTop=0;
   if(isArticle)add("p",newsSelectionNotice(lang,rows.length),"font-size:12px;line-height:1.4;opacity:.85;margin:0 0 12px");
   const wrap=add("div","","width:100%;overflow-x:auto");
   const table=add("table","","width:100%;table-layout:fixed;border-collapse:collapse;line-height:1.5;font-size:clamp(13px,3.35vw,16px)",wrap);
   const colgroup=add("colgroup","",null,table);
   const keys=isArticle?["title","source_name"]:cols.map(c=>String(c.key||"")).filter(Boolean);
   if(!keys.length)return;
   const weight=100/keys.length;
   keys.forEach((key,index)=>add("col","",isArticle?(index===0?"width:76%":"width:24%"):"width:"+weight+"%",colgroup));
   const head=add("thead","",null,table),tr=add("tr","",null,head);
   keys.forEach((key,i)=>add("th",isArticle?(i===0?(lang==="ro"?"Titlu și detalii":"Headline and details"):labels.source):(cols.find(c=>c.key===key)?.label||key),
     "text-align:left;padding:10px 6px;background:#19445a;border:1px solid #43758a;overflow-wrap:anywhere",tr));
   const tbody=add("tbody","",null,table);
   for(const row of (isArticle?rows.slice(newsPage*12,(newsPage+1)*12):rows)){
     const tr=add("tr","",null,tbody);
     if(isArticle){
       const left=add("td","","vertical-align:top;padding:10px 7px;border:1px solid #34566e;overflow-wrap:anywhere",tr);
       const button=add("button",cell(row,"title"),"text-align:left;color:#9beefa;text-decoration:underline;background:transparent;border:0;padding:0;font:inherit;font-weight:700;cursor:pointer;overflow-wrap:anywhere",left);
       button.type="button";button.onclick=()=>showDetail(row);
       if(cell(row,"summary"))add("p",cell(row,"summary").slice(0,155),"font-size:13px;line-height:1.4;color:#d2e2ed;margin:8px 0 0",left);
       const right=add("td","","vertical-align:top;padding:10px 5px;border:1px solid #34566e;overflow-wrap:anywhere",tr);
       add("strong",cell(row,"source_name")||"—","font-size:12px;display:block",right);
       add("span",dateText(cell(row,"published_at")),"display:block;font-size:11px;opacity:.8;margin-top:5px",right);
     }else for(const key of keys)add("td",cell(row,key),"vertical-align:top;padding:9px 7px;border:1px solid #34566e;overflow-wrap:anywhere",tr);
   }
   if(isArticle){
     appendNewsPager(host,newsPage,rows.length,lang,next=>{newsPage=next;showTable();});
     add("p",labels.unverified,"font-size:12px;opacity:.8;margin-top:14px");
   }
 };
 showTable();return true;
}
// Explain technical result limits without assigning an editorial verdict to a publisher.
function newsSelectionNotice(lang,count){
 const messages={
  ro:"Sunt afișate rezultate limitate de căutare, selectate tehnic după relevanță, dată și duplicate. Nu reprezintă o evaluare a credibilității, orientării sau finanțării surselor. Tu decizi ce citești.",
  en:"These are limited search results, technically selected by relevance, date and duplicates. This is not a judgment of publishers' credibility, views or funding. You decide what to read.",
  fr:"Résultats de recherche limités par pertinence, date et doublons. Ce n’est pas un jugement sur la crédibilité, les opinions ou le financement des sources. Vous choisissez quoi lire.",
  de:"Begrenzte Suchergebnisse nach Relevanz, Datum und Duplikaten. Keine Bewertung von Glaubwürdigkeit, Meinung oder Finanzierung der Quellen. Sie entscheiden, was Sie lesen.",
  it:"Risultati limitati per pertinenza, data e duplicati. Non è un giudizio su attendibilità, opinioni o finanziamenti delle fonti. Sei tu a scegliere cosa leggere.",
  es:"Resultados limitados por relevancia, fecha y duplicados. No evalúan la credibilidad, postura o financiación de las fuentes. Tú eliges qué leer.",
  pt:"Resultados limitados por relevância, data e duplicados. Não avaliam a credibilidade, opiniões ou financiamento das fontes. Você decide o que ler.",
  nl:"Beperkte zoekresultaten op relevantie, datum en duplicaten. Geen oordeel over betrouwbaarheid, standpunten of financiering. U kiest zelf wat u leest.",
  ru:"Показана ограниченная выборка по релевантности, дате и повторам. Это не оценка достоверности, взглядов или финансирования источников. Вы сами выбираете, что читать.",
  pl:"Ograniczone wyniki według trafności, daty i duplikatów. Nie jest to ocena wiarygodności, poglądów ani finansowania źródeł. To Ty decydujesz, co czytać."
 };
 return (messages[lang]||messages.en);
}
// News lists preserve all retrieved rows; 12 is a PAGE size, never a discard limit.
function appendNewsPager(host,page,total,lang,onPage){
 const size=12,pages=Math.ceil(total/size);
 if(pages<=1)return;
 const strings={
  ro:["Anterior","Următor","Pagina","din","rezultate disponibile"],
  en:["Previous","Next","Page","of","available results"],
  fr:["Précédent","Suivant","Page","sur","résultats disponibles"],
  de:["Zurück","Weiter","Seite","von","verfügbaren Ergebnissen"],
  it:["Precedente","Successiva","Pagina","di","risultati disponibili"],
  es:["Anterior","Siguiente","Página","de","resultados disponibles"],
  pt:["Anterior","Seguinte","Página","de","resultados disponíveis"],
  nl:["Vorige","Volgende","Pagina","van","beschikbare resultaten"],
  ru:["Назад","Далее","Страница","из","доступных результатов"],
  pl:["Poprzednia","Następna","Strona","z","dostępnych wyników"]
 }[lang]||["Previous","Next","Page","of","available results"];
 const wrap=document.createElement("div");wrap.style.cssText="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0";
 const makeButton=(title,newPage)=>{
  const btn=document.createElement("button");btn.type="button";btn.textContent=title;
  btn.style.cssText="padding:9px 12px;border-radius:10px;background:#17384c;color:#e2f9ff;border:1px solid #4d8a9c;font:inherit";
  btn.onclick=()=>onPage(newPage);
  return btn;
 };
 if(page>0)wrap.append(makeButton(strings[0],page-1));
 const indicator=document.createElement("span");
 indicator.textContent=strings[2]+" "+(page+1)+" "+strings[3]+" "+pages+" · "+total+" "+strings[4];
 indicator.style.cssText="font-size:12px;opacity:.88";wrap.append(indicator);
 if(page<pages-1)wrap.append(makeButton(strings[1],page+1));
 host.append(wrap);
}
function appendNewsCollectionTable(host,record){
 if(record?.list?.type!=="news"||!Array.isArray(record.list.rows))return false;
 const lang=state.language||"ro";
 const t={
  ro:["Știri","Titlu și detalii","Sursă / data","Detaliile știrii","Înapoi la știri","Deschide articolul original","Sursă identificată · afirmații neverificate","Nu este disponibil un rezumat verificabil. Consultă articolul original.","Data neprecizată"],
  en:["News","Headline and details","Source / date","News details","Back to news","Open original article","Source identified · claims not verified","No reliable summary available. See the original article.","Date unavailable"],
  fr:["Actualités","Titre et détails","Source / date","Détails de l’article","Retour aux actualités","Voir l’article original","Source identifiée · informations non vérifiées","Résumé fiable indisponible. Consultez l’original.","Date indisponible"],
  de:["Nachrichten","Titel und Details","Quelle / Datum","Artikeldetails","Zurück zu Nachrichten","Originalartikel öffnen","Quelle gefunden · Aussagen nicht geprüft","Keine verlässliche Zusammenfassung. Original lesen.","Datum unbekannt"],
  it:["Notizie","Titolo e dettagli","Fonte / data","Dettagli della notizia","Torna alle notizie","Apri articolo originale","Fonte identificata · affermazioni non verificate","Riepilogo non disponibile. Leggi l’originale.","Data non disponibile"],
  es:["Noticias","Titular y detalles","Fuente / fecha","Detalles de la noticia","Volver a noticias","Abrir artículo original","Fuente identificada · afirmaciones no verificadas","Resumen fiable no disponible. Consulta el original.","Fecha no disponible"],
  pt:["Notícias","Título e detalhes","Fonte / data","Detalhes da notícia","Voltar às notícias","Abrir artigo original","Fonte identificada · afirmações não verificadas","Resumo fiável indisponível. Consulte o original.","Data indisponível"],
  nl:["Nieuws","Kop en details","Bron / datum","Nieuwsdetails","Terug naar nieuws","Origineel artikel openen","Bron gevonden · claims niet geverifieerd","Geen betrouwbare samenvatting. Lees het origineel.","Datum onbekend"],
  ru:["Новости","Заголовок и подробности","Источник / дата","Подробности новости","К списку новостей","Открыть оригинал","Источник найден · утверждения не проверены","Проверенного обзора нет. Откройте оригинал.","Дата неизвестна"],
  pl:["Wiadomości","Tytuł i szczegóły","Źródło / data","Szczegóły wiadomości","Wróć do wiadomości","Otwórz oryginał","Źródło znalezione · twierdzenia niezweryfikowane","Brak wiarygodnego streszczenia. Zobacz oryginał.","Data niedostępna"]
 }[lang]||["News","Headline and details","Source / date","Details","Back","Original article","Unverified claims","No summary.","Date unavailable"];
 const items=record.list.rows.slice(0,40);
 let newsPage=0;
 const add=(tag,text,css,parent=host)=>{
  const node=document.createElement(tag);node.textContent=text;
  if(css)node.style.cssText=css;parent.append(node);return node;
 };
 const safeArticleUrl=value=>{try{const u=new URL(String(value||""));return u.protocol==="https:"&&!u.username&&!u.password?u.href:null}catch{return null}};
 const dateText=value=>{if(!value)return t[8];let d=Date.parse(value);
  if(!Number.isFinite(d)&&/^\d{8}T\d{6}Z$/.test(value))d=Date.parse(value.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,"$1-$2-$3T$4:$5:$6Z"));
  return Number.isFinite(d)?new Date(d).toLocaleDateString(lang,{year:"numeric",month:"short",day:"numeric"}):String(value).slice(0,24);
 };
 const renderList=()=>{
  host.replaceChildren();host.scrollTop=0;
  add("h3",t[0],"font-size:18px;margin:0 0 10px;color:#dcf9ff");
  add("p",newsSelectionNotice(lang,items.length),"font-size:12px;line-height:1.4;opacity:.85;margin:0 0 12px");
  const wrap=add("div","","width:100%;overflow-x:auto;overscroll-behavior-x:contain");
  const table=add("table","","width:100%;border-collapse:collapse;table-layout:fixed;font-size:clamp(13px,3.35vw,16px);line-height:1.5",wrap);
  const cols=add("colgroup","",null,table);
  add("col","","width:76%",cols);
  add("col","","width:24%",cols);
  const head=add("thead","",null,table),header=add("tr","",null,head);
  for(const label of [t[1],t[2]])add("th",label,"padding:10px 7px;background:#19445a;border:1px solid #43758a;text-align:left",header);
  const body=add("tbody","",null,table);
  for(const item of items.slice(newsPage*12,(newsPage+1)*12)){
   const tr=add("tr","",null,body);
   const left=add("td","","padding:10px 7px;vertical-align:top;border:1px solid #34566e;overflow-wrap:anywhere;width:76%",tr);
   const button=add("button",String(item.title||""),"text-align:left;color:#9beefa;text-decoration:underline;background:transparent;border:0;padding:0;font:inherit;font-weight:700;cursor:pointer;overflow-wrap:anywhere",left);
   button.type="button";button.onclick=()=>{
    const rows=state.newsConversationContext?.rows;
    if(Array.isArray(rows)){const idx=rows.findIndex(r=>r.url===item.url);if(idx>=0)state.newsConversationContext.selected_index=idx;}
    renderDetail(item);
   };
   if(item.summary)add("p",String(item.summary).slice(0,155),"font-size:13px;color:#d2e2ed;line-height:1.4;margin:8px 0 0",left);
   if(item.translation_status&&item.translation_status!=="translated"&&lang!=="en")add("small",String(item.translation_notice|| (lang==="ro"?"Traducere incompletă sau indisponibilă; text original.":"Translation incomplete or unavailable; original text.")),"font-size:11px;color:#ffdaa5;display:block;margin-top:6px",left);
   const right=add("td","","padding:10px 6px;vertical-align:top;border:1px solid #34566e;overflow-wrap:anywhere;width:24%",tr);
   add("strong",String(item.source_name||"—"),"display:block;font-size:12px;overflow-wrap:anywhere",right);
   add("span",dateText(item.published_at),"display:block;font-size:11px;opacity:.8;margin-top:5px",right);
  }
  appendNewsPager(host,newsPage,items.length,lang,next=>{newsPage=next;renderList();});
  add("p",t[6],"font-size:13px;opacity:.8;margin:13px 0 0");
 };
 const renderDetail=item=>{
  host.replaceChildren();host.scrollTop=0;
  add("h3",String(item.title||""),"font-size:19px;line-height:1.4;color:#d9fbff;margin:4px 0 13px;overflow-wrap:anywhere");
  const date=dateText(item.published_at);
  if(item.published_at)add("p",date,"font-size:13px;margin:0 0 12px;color:#b8d8e5");
  const detail=add("p",lang==="ro"?"Se citește articolul…":"Reading the article…","white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;margin:0 0 20px");
  const url=safeArticleUrl(item.url);
  // For Telegram, the optional paste-and-translate form is inserted next,
  // before the common source footer and back button.
  loadSourceBasedNewsDetail(detail,url,lang,String(item.summary||""));
  const footer=add("p",(lang==="ro"?"Sursa: ":lang==="fr"?"Source : ":lang==="de"?"Quelle: ":lang==="es"?"Fuente: ":lang==="it"?"Fonte: ":lang==="pt"?"Fonte: ":lang==="nl"?"Bron: ":lang==="ru"?"Источник: ":lang==="pl"?"Źródło: ":"Source: ")+String(item.source_name||""),"font-size:13px;color:#c6e6f1;margin:14px 0 16px;overflow-wrap:anywhere");
  if(url){const link=add("a",isTelegramLink(url)?(lang==="ro"?"Deschide postarea Telegram":"Open Telegram post"):t[5],"display:block;margin-top:5px;color:#9beefa;text-decoration:underline;overflow-wrap:anywhere",footer);link.href=url;link.target="_blank";link.rel="noopener noreferrer";}
  const back=add("button",t[4],"border:1px solid #4d8a9c;border-radius:10px;background:#12354b;color:#e2f9ff;padding:11px 16px;margin:10px 0 22px;font:inherit");
  back.type="button";back.onclick=renderList;
 };
 renderList();return true;
}
// Only a selected news row triggers publisher retrieval. The search snippet is not the article.
// Telegram links from a web index are references, not automatically readable articles.
// Do not send channel content to AI: only a user-initiated paste-and-translate action may do that.
function isTelegramLink(value){
 try{const url=new URL(String(value||""));return url.protocol==="https:"&&["t.me","www.t.me","telegram.me","www.telegram.me"].includes(url.hostname.toLowerCase());}catch{return false;}
}
function isExactTelegramPost(value){
 try{
  if(!isTelegramLink(value))return false;
  const url=new URL(String(value)),parts=url.pathname.split("/").filter(Boolean);
  if(parts[0]==="s")parts.shift();
  return parts.length===2&&/^[a-z][a-z0-9_]{4,31}$/i.test(parts[0])&&/^[1-9][0-9]{0,11}$/.test(parts[1]);
 }catch{return false;}
}
// Extra UI guard: never label non-Latin Persian/Arabic/Russian output as
// Romanian, even if a stale backend erroneously reports status=success.
function telegramTranslationLooksLocalized(source,translation,language){
 const out=String(translation||"").trim();
 if(out.length<12||out.length<String(source||"").trim().length*.25)return false;
 const src=String(source||"").normalize("NFKC").replace(/[^\p{L}\p{N}]/gu,"").toLowerCase();
 const dest=out.normalize("NFKC").replace(/[^\p{L}\p{N}]/gu,"").toLowerCase();
 if(src===dest)return false;
 const latin=(out.match(/[A-Za-z\u00c0-\u024f]/gu)||[]).length;
 const other=(out.match(/[\u0400-\u052f\u0600-\u08ff\u3400-\u9fff\uac00-\ud7af]/gu)||[]).length;
 if(language==="ru")return (out.match(/[\u0400-\u052f]/gu)||[]).length>=(latin+other)*.45;
 return latin>=12&&latin/(latin+other)>=.74;
}
function appendTelegramTranslationUI(target,url,language,indexExcerpt){
 const labels={
  ro:["Fragment tradus din indexul public (nu este postarea integrală):","Indexul public nu conține un fragment accesibil.","Nu pot citi automat întregul canal Telegram. Deschide postarea exactă și copiază textul pe care dorești să îl traduci.","Lipește textul postării publice aici","Tradu în română","Textul lipit va fi trimis modelului AI numai când apeși «Tradu». Nu este stocat ca arhivă a canalului.","Introdu cel puțin 20 de caractere.","Se traduce textul furnizat…","Traducere a textului furnizat de tine (afirmații neverificate):","Nu am putut traduce textul. Încearcă din nou.","Linkul nu identifică o postare Telegram exactă."],
  en:["Excerpt from the public index (not the full post):","No readable excerpt in the public index.","I cannot automatically read the full Telegram channel. Open the exact post and copy the text you wish to translate.","Paste the public post text here","Translate into English","Pasted text is sent to AI only when you press Translate. It is not stored as a channel archive.","Enter at least 20 characters.","Translating the submitted text…","Your supplied text translated (claims not verified):","Translation unavailable. Please try again.","This link does not identify an exact Telegram post."],
  fr:["Extrait de l’index public (pas le message complet) :","Aucun extrait accessible dans l’index public.","Ouvrez la publication exacte et copiez le texte à traduire.","Collez ici le texte de la publication publique","Traduire en français","Le texte est envoyé à l’IA uniquement après votre clic, sans archivage du canal.","Saisissez au moins 20 caractères.","Traduction en cours…","Traduction du texte fourni (affirmations non vérifiées) :","Traduction indisponible.","Le lien n’identifie pas une publication exacte."],
  de:["Auszug aus dem öffentlichen Index (nicht der vollständige Beitrag):","Kein lesbarer Auszug verfügbar.","Öffnen Sie den genauen Beitrag und kopieren Sie den Text zur Übersetzung.","Text des öffentlichen Beitrags hier einfügen","Ins Deutsche übersetzen","Der Text wird erst nach Ihrem Klick an die KI gesendet und nicht als Kanalarchiv gespeichert.","Mindestens 20 Zeichen eingeben.","Text wird übersetzt…","Übersetzung des eingefügten Textes (Behauptungen ungeprüft):","Übersetzung nicht verfügbar.","Kein Link zu einem einzelnen Beitrag."],
  it:["Estratto dall’indice pubblico (non il post completo):","Nessun estratto leggibile.","Apri il post preciso e copia il testo da tradurre.","Incolla qui il testo del post pubblico","Traduci in italiano","Il testo viene inviato all’IA solo quando premi Traduci e non viene archiviato.","Inserisci almeno 20 caratteri.","Traduzione in corso…","Traduzione del testo fornito (affermazioni non verificate):","Traduzione non disponibile.","Il link non identifica un singolo post."],
  es:["Extracto del índice público (no la publicación completa):","No hay extracto legible.","Abre la publicación exacta y copia el texto que deseas traducir.","Pega aquí el texto público","Traducir al español","El texto solo se envía a la IA al pulsar Traducir, sin archivarse.","Introduce al menos 20 caracteres.","Traduciendo…","Traducción del texto aportado (afirmaciones sin verificar):","Traducción no disponible.","El enlace no identifica una publicación concreta."],
  pt:["Excerto do índice público (não é a publicação completa):","Não existe um excerto legível.","Abra a publicação exata e copie o texto a traduzir.","Cole aqui o texto da publicação pública","Traduzir para português","O texto só é enviado à IA quando clicar em Traduzir e não fica arquivado.","Introduza pelo menos 20 caracteres.","A traduzir…","Tradução do texto fornecido (alegações não verificadas):","Tradução indisponível.","Este link não identifica uma publicação exata."],
  nl:["Fragment uit de openbare index (niet het volledige bericht):","Geen leesbaar fragment beschikbaar.","Open het exacte bericht en kopieer de tekst voor vertaling.","Plak de openbare berichttekst hier","Vertaal naar Nederlands","Tekst wordt pas na uw klik naar AI verzonden en niet als kanaalarchief opgeslagen.","Voer minstens 20 tekens in.","Tekst wordt vertaald…","Vertaling van uw tekst (claims niet geverifieerd):","Vertaling niet beschikbaar.","Deze link verwijst niet naar één specifiek bericht."],
  ru:["Фрагмент из общедоступного индекса (не полный пост):","В индексе нет читаемого фрагмента.","Откройте точный пост и скопируйте текст для перевода.","Вставьте текст публичного сообщения","Перевести на русский","Текст отправляется ИИ только после нажатия кнопки и не архивируется.","Введите не менее 20 символов.","Перевод текста…","Перевод предоставленного текста (утверждения не проверены):","Перевод недоступен.","Ссылка не указывает на конкретный пост."],
  pl:["Fragment z publicznego indeksu (nie cała publikacja):","Brak czytelnego fragmentu.","Otwórz konkretny wpis i skopiuj tekst do tłumaczenia.","Wklej tekst publicznego wpisu","Przetłumacz na polski","Tekst trafi do AI dopiero po kliknięciu, bez archiwizowania kanału.","Wpisz co najmniej 20 znaków.","Tłumaczenie tekstu…","Tłumaczenie podanego tekstu (twierdzenia niezweryfikowane):","Tłumaczenie niedostępne.","Link nie prowadzi do konkretnego wpisu."]
 }[language]||[];
 const content=String(indexExcerpt||"").trim();
 target.textContent=(content&& !/^(?:Extras indisponibil|Excerpt unavailable)/i.test(content)?labels[0]+String.fromCharCode(10)+content:labels[1])+String.fromCharCode(10)+String.fromCharCode(10)+labels[2];
 const parent=target.parentNode||target.parentElement;
 if(!parent)return;
 if(!isExactTelegramPost(url)){const warning=document.createElement("p");warning.textContent=labels[10];parent.append(warning);return;}
 const wrap=document.createElement("div");wrap.style.cssText="margin:12px 0 18px;display:flex;flex-direction:column;gap:10px";
 const paste=document.createElement("textarea");paste.rows=5;paste.maxLength=5000;paste.placeholder=labels[3];paste.dir="auto";
 paste.setAttribute("aria-label",labels[3]);paste.style.cssText="width:100%;min-height:110px;box-sizing:border-box;border-radius:10px;padding:12px;background:#15394d;color:#e6faff;border:1px solid #5890a4;font:inherit";
 const note=document.createElement("small");note.textContent=labels[5];note.style.cssText="display:block;color:#c2d6e2;line-height:1.45";
 const button=document.createElement("button");button.type="button";button.textContent=labels[4];
 button.style.cssText="align-self:flex-start;padding:10px 16px;border-radius:10px;background:#1b5466;color:#fff;border:1px solid #77b2c5;font:inherit";
 const result=document.createElement("p");result.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6";
 button.onclick=async()=>{
  const text=String(paste.value||"").trim();if(text.length<20){result.textContent=labels[6];return;}
  button.disabled=true;result.textContent=labels[7];
  try{
   const endpoint=new URL(CLIENT_CONFIG.apiUrl);endpoint.pathname="/api/telegram-user-translation";endpoint.search="";
   const response=await fetch(endpoint.href,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({url,language,text,consent:true})});
   if(!response.ok)throw Error("translation_http_failure");
   const data=await response.json();
   result.textContent=data.status==="success"&&data.content_status==="user_supplied_translation"&&typeof data.text==="string"&&telegramTranslationLooksLocalized(text,data.text,language)?
    labels[8]+String.fromCharCode(10)+String.fromCharCode(10)+data.text:labels[9];
  }catch{result.textContent=labels[9];}finally{button.disabled=false;}
 };
 wrap.append(paste,note,button,result);parent.append(wrap);
}
async function loadSourceBasedNewsDetail(target,url,language,indexExcerpt=''){
 const messages={
  ro:{unavailable:"Nu am putut extrage detalii din articolul original. Rezultatul din index nu reprezintă textul articolului. Deschide sursa pentru a-l citi.",summary:"Rezumat bazat pe articolul original (nu text integral):",excerpt:"Fragment din articolul original, netradus:",notTranslated:"Traducerea nu este disponibilă; fragmentul este păstrat în limba sursei."},
  en:{unavailable:"The original article could not be read. Search-index text is not the full article. Open the publisher link.",summary:"Summary based on the original article (not full text):",excerpt:"Original-language excerpt from the publisher:",notTranslated:"Translation is unavailable; this excerpt remains in the source language."}
 }[language]||{unavailable:"Original article details unavailable. Open the publisher link.",summary:"Source-based summary (not full text):",excerpt:"Original-language source excerpt:",notTranslated:"Translation unavailable."};
 if(!url){target.textContent=messages.unavailable;return;}
 if(isTelegramLink(url)){appendTelegramTranslationUI(target,url,language,indexExcerpt);return;}
 try{
  const endpoint=new URL(CLIENT_CONFIG.apiUrl);endpoint.pathname="/api/news-article-detail";endpoint.search="";
  const response=await fetch(endpoint.href,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,language})});
  if(!response.ok)throw Error("article_read_failed");
  const data=await response.json();
  if(data?.status==="success"&&typeof data.summary==="string"&&data.summary.trim()){
   const excerpt=data.content_status==="source_excerpt";
   target.textContent=(excerpt?messages.excerpt+"\\n"+messages.notTranslated:data.reading_mode==="expanded_article_digest"?(language==="ro"?"Prezentare detaliată bazată pe articol:":language==="en"?"Detailed source-based account:":messages.summary):messages.summary)+"\\n\\n"+data.summary.trim();
  }else target.textContent=messages.unavailable;
 }catch{target.textContent=messages.unavailable;}
}
function appendStructuredCollectionTable(host,record){
 if(appendNewsCollectionTable(host,record))return true;
 if(!record||record.list?.type!=='events'||!Array.isArray(record.list.rows))return false;
 const lang=state.language||'ro';
 const labels={ro:['Data / ora','Eveniment și locație','Datele și orele sunt preluate din rezultatele găsite; verifică programul la organizator.','Surse găsite pentru verificare'],
  en:['Date / time','Event and venue','Dates and times come from search results; confirm with the organiser.','Sources for verification'],
  fr:['Date / heure','Événement et lieu','Vérifiez le programme auprès de l’organisateur.','Sources à vérifier'],
  de:['Datum / Uhrzeit','Veranstaltung und Ort','Bitte Zeiten beim Veranstalter prüfen.','Quellen zur Prüfung'],
  it:['Data / ora','Evento e luogo','Verifica il programma con l’organizzatore.','Fonti da verificare'],
  es:['Fecha / hora','Evento y lugar','Confirma los horarios con el organizador.','Fuentes para verificar'],
  pt:['Data / hora','Evento e local','Confirma os horários com o organizador.','Fontes para verificar'],
  nl:['Datum / tijd','Evenement en locatie','Controleer de tijden bij de organisator.','Bronnen ter controle'],
  ru:['Дата / время','Мероприятие и место','Проверяйте время у организатора.','Источники для проверки'],
  pl:['Data / godzina','Wydarzenie i miejsce','Sprawdź termin u organizatora.','Źródła do weryfikacji']}[lang]||['Date / time','Event and venue','Confirm with the organiser.','Sources'];
 const period=document.createElement('p');period.textContent=String(record.list.period||'');period.style.cssText='font-weight:750;margin:0 0 12px';host.append(period);
 const wrap=document.createElement('div');wrap.className='structured-results-scroller';wrap.style.cssText='width:100%;overflow-x:auto;overscroll-behavior-x:contain';
 const table=document.createElement('table');table.className='structured-results-table';table.style.cssText='width:100%;border-collapse:collapse;table-layout:fixed;font-size:clamp(13px,3.45vw,16px);line-height:1.42';
 const thead=document.createElement('thead'),header=document.createElement('tr');
 for(const name of labels.slice(0,2)){const th=document.createElement('th');th.textContent=name;th.scope='col';th.style.cssText='padding:10px 7px;background:#19445a;border:1px solid #43758a;text-align:left';header.append(th)}thead.append(header);table.append(thead);
 const tbody=document.createElement('tbody');
 for(const item of record.list.rows){
  const tr=document.createElement('tr'),when=document.createElement('td'),description=document.createElement('td');
  when.style.cssText='width:34%;vertical-align:top;border:1px solid #34566e;padding:9px 6px;overflow-wrap:anywhere';
  description.style.cssText='vertical-align:top;border:1px solid #34566e;padding:9px 7px;overflow-wrap:anywhere';
  const date=document.createElement('strong');date.textContent=String(item.date||'—');when.append(date);
  if(item.time){const time=document.createElement('div');time.textContent=item.time;time.style.marginTop='6px';when.append(time)}
  description.textContent=String(item.description||'');if(typeof item.source_url==='string'&&item.source_url.startsWith('https://')){const ref=document.createElement('a');ref.href=item.source_url;ref.target='_blank';ref.rel='noopener noreferrer';ref.textContent=lang==='ro'?'Sursa evenimentului':'Event source';ref.style.cssText='display:block;margin-top:6px;font-size:12px;color:#8ce9f3';description.append(ref)}tr.append(when,description);tbody.append(tr);
 }table.append(tbody);wrap.append(table);host.append(wrap);
 const note=document.createElement('p');note.textContent=labels[2];note.style.cssText='font-size:13px;opacity:.75;margin:12px 0';host.append(note);
 const sources=(Array.isArray(record.sources)?record.sources:[]).filter(x=>typeof x?.url==='string'&&x.url.startsWith('https://')).slice(0,4);
 if(sources.length){
  const h=document.createElement('h3');h.textContent=labels[3];h.style.cssText='font-size:15px;margin:14px 0 8px';host.append(h);
  for(const source of sources){const link=document.createElement('a');link.href=source.url;link.textContent=String(source.title||source.url);link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:block;margin:8px 0;overflow-wrap:anywhere;color:#8ce9f3';host.append(link)}
 }
 return true;
}
// Presentation-only safe inline Markdown: bold text and HTTPS links, never HTML.
function appendAnswerText(host,text){
 const source=String(text||'');
 const pieces=source.split(/(\\*\\*[^*\\n]+?\\*\\*)/g);
 for(const piece of pieces){
  if(!piece)continue;
  if(piece.startsWith('**')&&piece.endsWith('**')&&piece.length>4){
   const strong=document.createElement('strong');
   strong.textContent=piece.slice(2,-2);
   host.append(strong);
   continue;
  }
  const pattern=/https?:\\/\\/[^\\s<>"']+/g;let offset=0;
  for(const match of piece.matchAll(pattern)){
   const url=match[0].replace(/[.,;!?)]+$/,'');
   host.append(document.createTextNode(piece.slice(offset,match.index)));
   const link=document.createElement('a');
   link.href=url;link.target='_blank';link.rel='noopener noreferrer';
   link.textContent=url;host.append(link);
   offset=match.index+url.length;
  }
  host.append(document.createTextNode(piece.slice(offset)));
 }
}
// Render full culinary answers with section headings and preserved steps.
// Some publishers concatenate a step title with its instructions.
// Repair presentation only; all original words and cooking facts remain.
function recipeStepPresentation(line){
 const spaced=String(line||'').replace(/([.!?])([A-ZĂÂÎȘȚ])/gu,'$1 $2');
 const match=spaced.match(/^(\\d{1,2}[.)]\\s*)([\\s\\S]*)$/u);
 if(!match)return {body:spaced};
 const content=match[2];
 for(const hit of content.matchAll(/([a-zăâîșț])([A-ZĂÂÎȘȚ][a-zăâîșț]{2,})/gu)){
  const boundary=hit.index+1;
  const title=content.slice(0,boundary).trim(),detail=content.slice(boundary).trim();
  if(boundary>=12&&boundary<=115&&title.length>=12&&detail.length>=12&&!/[\/@]/.test(title))
   return {title:match[1]+title,body:detail};
 }
 return {body:spaced};
}
function appendRecipeReaderText(host,rawText){
 const text=String(rawText||'');
 const recipeHeading=/^\\s*(?:\\*\\*)?(?:(?:rețeta|reteta|recipe|recette|rezept|ricetta|receta|receita|recept|рецепт|przepis)\\s*\\d+\\s*[:.—-]|(?:balmoș|balmos)\\b)/iu;
 const hasRecipeStructure=/(?:^|\\n)\\s*(?:\\*\\*)?(?:rețeta|reteta|recipe|recette|rezept|ricetta|receta|receita|recept|рецепт|przepis)\\s*\\d+\\b/iu.test(text)
  ||(/(?:^|\\n)\\s*(?:ingrediente|ingredients|zutaten|ingrédients|ingredienti|ingredientes)\\s*:/iu.test(text)
   &&/(?:^|\\n)\\s*(?:preparare|mod de preparare|pregătire|method|preparation|instructions|zubereitung|preparación)\\s*:/iu.test(text));
 if(!hasRecipeStructure)return false;
 const lines=text.replace(/\\r\\n?/g,'\\n').split('\\n');
 for(const line of lines){
  const stripped=line.trim();
  if(!stripped){const gap=document.createElement('div');gap.style.height='8px';host.append(gap);continue;}
  if(/^─{3,}$/.test(stripped)){const divider=document.createElement('div');divider.className='recipe-reader-divider';host.append(divider);continue;}
  const plain=stripped;
  const isHeading=recipeHeading.test(plain),isLabel=/^(?:\\*\\*)?(?:ingrediente|ingredients|zutaten|ingrédients|ingredienti|ingredientes|mod de preparare|preparare|pregătire|method|preparation|instructions|zubereitung|preparación)\\s*:/iu.test(plain);
  let node;
  if(isHeading){
   node=document.createElement('h3');node.className='recipe-reader-title';appendAnswerText(node,plain);
   node.style.cssText='font-size:19px;line-height:1.35;font-weight:750;color:#a6f5ff;margin:18px 0 8px;padding:0 0 8px;border-bottom:1px solid #3e8294;overflow-wrap:anywhere';
  }else if(isLabel){
   node=document.createElement('h4');node.className='recipe-reader-label';appendAnswerText(node,plain);
   node.style.cssText='font-size:16px;line-height:1.45;color:#e7f9fb;margin:13px 0 5px;font-weight:750';
  }else{
   node=document.createElement('div');
   node.style.cssText='font-size:16px;line-height:1.58;margin:4px 0;overflow-wrap:anywhere';
   if(/^[-•]\\s/.test(plain)){node.className='recipe-reader-ingredient';appendAnswerText(node,plain);}
   else if(/^\\d{1,2}[.)]\\s/.test(plain)){
    node.className='recipe-reader-step';
    const parts=recipeStepPresentation(plain);
    if(parts.title){
     const title=document.createElement('strong');
     title.className='recipe-reader-step-title';
     appendAnswerText(title,parts.title);node.append(title);
    }
    const detail=document.createElement('span');
    detail.className='recipe-reader-step-detail';
    appendAnswerText(detail,parts.body);node.append(detail);
   }else{appendAnswerText(node,plain);}
  }
  host.append(node);
 }
 return true;
}

function answerExceedsFourLines(content){
 const style=getComputedStyle(content);const height=content.getBoundingClientRect().height;
 const lineHeight=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.45;
 return height>0&&Number.isFinite(lineHeight)&&height>lineHeight*4+1;
}
function closeAnswerReader(restoreFocus=true){
 const reader=activeAnswerReader;if(!reader)return;activeAnswerReader=null;
 cancelAnimationFrame(reader.frame);reader.cleanup();reader.layer.remove();
 if(restoreFocus&&reader.origin?.isConnected)reader.origin.focus({preventScroll:true});
}
function openAnswerReader(text,origin){
 dismissSelectionKeyboard();
 if(state.lastTransitResponse?.reply===String(text).trim()&&Array.isArray(state.lastTransitResponse.transit)&&state.lastTransitResponse.transit.length){showTransitChoices(state.lastTransitResponse.transit);return}
 if(state.lastRouteReply===String(text).trim()&&validMapRoute(state.lastRoute)){const choices=(state.lastRouteOptions||[]).filter(validMapRoute);if(choices.length<=1&&state.lastRoute.profile==='drive')openRouteMap(state.lastRoute,null,choices);else openWalkingRouteChoices(state.lastRoute,choices);return}
 closeRouteMap(false);
 closeAnswerReader(false);inputEl.blur();const t=readerLabels();
 const layer=document.createElement('section');layer.className='answer-reader';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','answerReaderTitle');
 const header=document.createElement('div');header.className='answer-reader-header';
 const title=document.createElement('h2');title.id='answerReaderTitle';
 const displayingNews=Boolean((state.lastPresentationResponse?.reply===String(text).trim()&&state.lastPresentationResponse.plan?.source_type==='news')||(state.lastStructuredResponse?.reply===String(text).trim()&&state.lastStructuredResponse.list?.type==='news'));
 const readerTitle=displayingNews?({ro:"Știri și detalii",en:"News and details",fr:"Actualités et détails",de:"Nachrichten und Details",it:"Notizie e dettagli",es:"Noticias y detalles",pt:"Notícias e detalhes",nl:"Nieuws en details",ru:"Новости и подробности",pl:"Wiadomości i szczegóły"}[state.language]||"News and details"):t.title;
 title.textContent=readerTitle;
 const close=document.createElement('button');close.type='button';close.className='answer-reader-close';close.textContent=dialogText("Revenire","Return");close.setAttribute('aria-label',close.textContent);close.onclick=()=>closeAnswerReader();header.append(title,close);
 const controls=document.createElement('div');controls.className='answer-reader-controls';
 const pause=document.createElement('button');pause.type='button';
 const restart=document.createElement('button');restart.type='button';restart.textContent=t.restart;
 const speedLabel=document.createElement('label');speedLabel.textContent=t.speed+' ';
 const speed=document.createElement('select');speed.setAttribute('aria-label',t.speed);
 for(const value of [.5,1,1.5]){const option=document.createElement('option');option.value=String(value);option.textContent=String(value)+'×';speed.append(option)}speed.value='1';speedLabel.append(speed);controls.append(pause,restart,speedLabel);
 const body=document.createElement('div');body.className='answer-reader-body';body.tabIndex=0;body.setAttribute('aria-label',readerTitle);if(!(state.lastPresentationResponse?.reply===String(text).trim()&&appendAdaptivePresentation(body,state.lastPresentationResponse))&&!(state.lastStructuredResponse?.reply===String(text).trim()&&appendStructuredCollectionTable(body,state.lastStructuredResponse))&&!(typeof appendTravelModeOverview==='function'&&appendTravelModeOverview(body,String(text)))&&!(typeof appendTransitOverview==='function'&&appendTransitOverview(body,String(text)))){if(typeof appendRouteReaderActions==='function')appendRouteReaderActions(body,String(text));if(!appendRecipeReaderText(body,String(text)))appendAnswerText(body,String(text));}
 layer.append(header,controls,body);document.body.append(layer);
 const reader={layer,origin,frame:0,cleanup:()=>{}};activeAnswerReader=reader;
 let running=!(state.lastPresentationResponse?.reply===String(text).trim()&&state.lastPresentationResponse.plan?.blocks?.[0]?.kind==='interactive_article_table')&&!(state.lastStructuredResponse?.reply===String(text).trim()&&state.lastStructuredResponse.list?.type==='news'),lastTime=null,startAt=performance.now()+800,position=0;
 const update=()=>{pause.textContent=running?t.pause:t.play;pause.setAttribute('aria-pressed',String(running))};
 const stop=()=>{running=false;update()};
 const play=()=>{if(body.scrollTop>=body.scrollHeight-body.clientHeight-1)body.scrollTop=0;position=body.scrollTop;running=true;lastTime=null;startAt=performance.now()+900;update()};
 pause.onclick=()=>{running?stop():play()};restart.onclick=()=>{body.scrollTop=0;position=0;play()};
 const manualKey=e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))stop()};
 body.addEventListener('touchstart',stop,{passive:true});body.addEventListener('wheel',stop,{passive:true});body.addEventListener('pointerdown',stop);body.addEventListener('keydown',manualKey);
 const keydown=e=>{
  if(e.key==='Escape'){e.preventDefault();closeAnswerReader();return}
  if(e.key==='Tab'){
   const focusable=[close,pause,restart,speed,body,...body.querySelectorAll('a')];const i=focusable.indexOf(document.activeElement);
   if(e.shiftKey&&(i<=0)){e.preventDefault();focusable.at(-1).focus()}else if(!e.shiftKey&&(i===focusable.length-1||i<0)){e.preventDefault();close.focus()}
  }
 };
 const visibility=()=>{if(document.hidden)stop()};
 const resize=()=>{const top=document.querySelector('.bottom-nav')?.getBoundingClientRect().top;layer.style.bottom=(top>0?Math.max(12,window.innerHeight-top+10):108)+'px'};
 const tick=now=>{
  if(activeAnswerReader!==reader)return;
  if(running&&now>=startAt){
   const elapsed=lastTime===null?0:Math.max(0,Math.min(now-lastTime,100));
   const max=Math.max(0,body.scrollHeight-body.clientHeight);position=Math.min(max,position+elapsed*.022*Number(speed.value));body.scrollTop=position;
   if(position>=max){running=false;update()}
  }
  lastTime=now;reader.frame=requestAnimationFrame(tick);
 };
 document.addEventListener('keydown',keydown);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
 reader.cleanup=()=>{document.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize)};
 resize();update();close.focus({preventScroll:true});reader.frame=requestAnimationFrame(tick);
}
function prepareAnswerReader(content,bubble,text,autoOpen){
 // Math teaching answers remain fully readable in the same subject, never a second popup.
 if(state.currentModule==='learning'&&activeLearningSubject?.[0]==='math'&&state.currentView==='module')return;
 if(!content.isConnected||(!answerExceedsFourLines(content)&&!(state.lastStructuredResponse?.reply===String(text).trim()&&state.lastStructuredResponse.list?.type==='news')))return;
 content.textContent=String(text);content.className+=' answer-preview';
 const button=document.createElement('button');button.type='button';button.className='answer-reader-open';button.textContent=readerLabels().open;button.onclick=()=>openAnswerReader(text,button);bubble.append(button);
 if(autoOpen&&(state.currentView==='assistant'||state.currentView==='module'))openAnswerReader(text,button);
}
function offerTripAccommodation(destination){
 if(!state.travelAccommodationIntent)return;
 state.travelAccommodationIntent=false;
 const host=document.createElement('div');host.dataset.directChoices='true';
 const note=document.createElement('p');note.textContent=dialogText("Traseul este pregătit. Dorești să caut și cazare la destinație, în zona centrală turistică?","The route is prepared. Would you like accommodation near the tourist centre?");host.append(note);
 const yes=document.createElement('button');yes.type='button';yes.className='transit-choice-action';yes.textContent=dialogText("Da, caută cazare","Find accommodation");
 yes.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();const place=String(destination||'').replace(/^(?:vreau să ajung la|i want to get to)\\s+/i,'').trim();inputEl.value=(dialogText("Caută cazare în zona centrală turistică din ","Find accommodation in the tourist centre of "))+place;submitMessage()};
 const no=document.createElement('button');no.type='button';no.className='transit-choice-action';no.textContent=dialogText("Nu, continuă la traseu","No, continue to route");no.onclick=()=>document.getElementById('pocketStandaloneChoices')?.remove();
 host.append(yes,no);openStandaloneChoicePanel(host,dialogText("Cazare la destinație","Accommodation"));
}
function openEncyclopediaCard(article,requestStartMs){
 if(!article||!article.extract)return;
 state.lastEncyclopediaArticle=article;
 const host=document.createElement('div');host.dataset.directChoices='true';
 const isCountry=article.is_country===true;
 const isRegion=article.is_region===true;
 const lang=state.language||'ro';
 const words={
  ro:['Date esențiale','Capitală','Monedă / monede','Limbi oficiale','Suprafață','Fusuri orare (UTC)','Prezentare generală','Context și informații suplimentare','Orașe importante','Obiective turistice','Nu am putut verifica acum o listă de obiective pentru această țară.','Surse și verificare','Sursă date țară','Date despre locuri','Alege o destinație pentru traseu','Creează traseu','Traseu','Vezi sursa'],
  en:['Key facts','Capital','Currency / currencies','Official languages','Area','Time zones (UTC)','Overview','Further context','Major cities','Places to visit','Verified tourist attractions are temporarily unavailable.','Sources and verification','Country data source','Places data','Choose a destination for a route','Plan route','Route','View source'],
  fr:['Données essentielles','Capitale','Monnaie(s)','Langues officielles','Superficie','Fuseaux horaires (UTC)','Présentation','Informations complémentaires','Villes principales','Sites à visiter','Sites touristiques non vérifiables pour le moment.','Sources et vérification','Données du pays','Données des lieux','Choisir une destination','Créer un itinéraire','Itinéraire','Voir la source'],
  de:['Wichtige Daten','Hauptstadt','Währung(en)','Amtssprachen','Fläche','Zeitzonen (UTC)','Überblick','Weitere Informationen','Wichtige Städte','Sehenswürdigkeiten','Sehenswürdigkeiten derzeit nicht verifizierbar.','Quellen und Nachweise','Länderdaten','Ortsdaten','Reiseziel auswählen','Route planen','Route','Quelle ansehen'],
  it:['Dati essenziali','Capitale','Valuta/e','Lingue ufficiali','Superficie','Fusi orari (UTC)','Panoramica','Altre informazioni','Città principali','Luoghi da visitare','Attrazioni non verificabili al momento.','Fonti e verifiche','Dati sul paese','Dati sui luoghi','Scegli una destinazione','Crea percorso','Percorso','Vedi fonte'],
  es:['Datos esenciales','Capital','Moneda(s)','Idiomas oficiales','Superficie','Husos horarios (UTC)','Presentación','Información adicional','Ciudades principales','Lugares de interés','No se pueden verificar atracciones turísticas ahora.','Fuentes y verificación','Datos del país','Datos de lugares','Elige un destino','Crear ruta','Ruta','Ver fuente'],
  pt:['Dados essenciais','Capital','Moeda(s)','Línguas oficiais','Área','Fusos horários (UTC)','Visão geral','Informações adicionais','Principais cidades','Pontos turísticos','Não foi possível verificar atrações neste momento.','Fontes e verificação','Dados do país','Dados dos lugares','Escolha um destino','Criar rota','Rota','Ver fonte'],
  nl:['Kerngegevens','Hoofdstad','Valuta','Officiële talen','Oppervlakte','Tijdzones (UTC)','Overzicht','Meer informatie','Belangrijke steden','Bezienswaardigheden','Bezienswaardigheden zijn nu niet te verifiëren.','Bronnen en verificatie','Landgegevens','Plaatsgegevens','Kies een bestemming','Route plannen','Route','Bekijk bron'],
  ru:['Основные сведения','Столица','Валюта','Официальные языки','Площадь','Часовые пояса (UTC)','Обзор','Дополнительная информация','Крупные города','Достопримечательности','Не удалось проверить достопримечательности.','Источники и проверка','Данные о стране','Данные о местах','Выберите пункт назначения','Построить маршрут','Маршрут','Источник'],
  pl:['Podstawowe dane','Stolica','Waluta','Języki urzędowe','Powierzchnia','Strefy czasowe (UTC)','Opis ogólny','Dodatkowe informacje','Główne miasta','Atrakcje turystyczne','Nie można teraz zweryfikować atrakcji.','Źródła i weryfikacja','Dane kraju','Dane miejsc','Wybierz cel podróży','Wyznacz trasę','Trasa','Zobacz źródło']
 }[lang]||null;
 const L=words||['Key facts','Capital','Currency','Official languages','Area','Time zones (UTC)','Overview','Further context','Major cities','Places to visit','Verified tourist attractions are temporarily unavailable.','Sources','Country data','Place data','Choose a destination','Plan route','Route','Source'];
 const card=document.createElement('article');card.className='selected-transit';card.style.cssText='padding:12px;border-radius:17px;line-height:1.5;border:1px solid #3e8194;background:linear-gradient(160deg,#123247,#091e2e)';
 const section=(heading)=>{
  const s=document.createElement('section');s.style.cssText='margin:14px 0;padding:14px 13px;border:1px solid #345e74;border-radius:14px;background:#0c293c';
  const h=document.createElement('h3');h.textContent=heading;h.style.cssText='font-size:16px;line-height:1.3;margin:0 0 12px;font-weight:750;color:#d4f8ff;padding-bottom:8px;border-bottom:1px solid #31586c';
  s.append(h);card.append(s);return s;
 };
 const link=(url,label,parent)=>{
  if(typeof url!=='string'||!url.startsWith('https://'))return;
  const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;
  a.style.cssText='color:#91e8f5;text-decoration:underline;overflow-wrap:anywhere;font-size:13px';
  parent.append(a);
 };
 const textP=(parent,value)=>{
  if(!value)return;
  const p=document.createElement('p');p.textContent=value;p.style.cssText='margin:0 0 10px;font-size:15px;line-height:1.6;overflow-wrap:break-word';
  parent.append(p);
 };
 if(article.image&&article.image.startsWith('https://')){
  const figure=document.createElement('div');figure.style.cssText='text-align:center;margin:3px 0 10px';
  const img=document.createElement('img');img.src=article.image;img.alt=article.title||'';img.loading='lazy';
  img.style.cssText='display:block;margin:auto;max-width:100%;max-height:128px;object-fit:contain;border-radius:11px';
  figure.append(img);card.append(figure);
 }
 if(article.description){
  const p=document.createElement('p');p.textContent=String(article.description).trim();
  p.style.cssText='font-size:15px;font-weight:650;color:#c9e9f0;margin:12px 2px 16px;line-height:1.45';
  card.append(p);
 }
 if(isCountry&&article.country_facts){
  const f=article.country_facts,s=section(L[0]);
  const grid=document.createElement('dl');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px;margin:0';
  const fact=(label,value)=>{
   if(!value)return;
   const entry=document.createElement('div');entry.style.cssText='padding:9px 10px;border:1px solid #315a72;border-radius:10px;background:#14364b;min-width:0';
   const dt=document.createElement('dt');dt.textContent=label;dt.style.cssText='font-size:12px;color:#b8d9e5;margin-bottom:5px;font-weight:650';
   const dd=document.createElement('dd');dd.textContent=value;dd.style.cssText='margin:0;font-size:14px;color:#f0f9ff;line-height:1.4;overflow-wrap:anywhere';
   entry.append(dt,dd);grid.append(entry);
  };
  fact(L[1],f.capital);
  fact(L[2],(f.currencies||[]).map(x=>x.name+' ('+x.code+')'+(x.symbol?' · '+x.symbol:'')).join(', '));
  fact(L[3],(f.languages||[]).join(', '));
  if(Number.isFinite(Number(f.area_km2))&&Number(f.area_km2)>0)fact(L[4],new Intl.NumberFormat(lang).format(f.area_km2)+' km²');
  fact(L[5],(f.timezones||[]).join(', '));
  if(grid.childElementCount)s.append(grid);
 }
 // Discard Wikipedia citation markers and split at sentence boundaries; never expose
 // a multi-screen continuous encyclopaedia paragraph.
 const content=String(article.extract||'').trim().replaceAll('(d)','').replaceAll('(D)','').replace(/\\[\\d+\\]/g,'').replace(/\\s+/g,' ');
 const sentences=content.split(/(?<=[.!?])\\s+(?=\\p{Lu})/u).filter(Boolean);
 const intro=sentences.slice(0,3),further=sentences.slice(3,8);
 const blocks=(list,parent)=>{
  if(!list.length)return;
  for(let i=0;i<list.length;i+=2)textP(parent,list.slice(i,i+2).join(' '));
 };
 if(intro.length)blocks(intro,section(L[6]));
 if(further.length)blocks(further,section(L[7]));
 const validPlaces=items=>(Array.isArray(items)?items:[]).filter(p=>p&&typeof p.name==='string'&&p.name.trim()).slice(0,7);
 const cities=validPlaces(article.major_cities),sights=validPlaces(article.attractions);
 const addPlace=(parent,place,i)=>{
  const line=document.createElement('div');line.style.cssText='padding:10px 0;border-bottom:1px solid #2e5266;display:flex;flex-direction:column;gap:5px';
  const title=document.createElement('strong');title.textContent=(i+1)+'. '+place.name;title.style.cssText='font-size:15px;color:#eef9fc';line.append(title);
  if(place.description){const note=document.createElement('span');note.textContent=place.description;note.style.cssText='font-size:13px;line-height:1.4;color:#c3d9e2';line.append(note)}
  if(!isCountry&&place.address){const addr=document.createElement('span');addr.textContent=place.address;addr.style.cssText='font-size:13px;line-height:1.4';line.append(addr)}
  const actions=document.createElement('div');actions.style.cssText='display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:3px';
  const coords=place.latitude!=null&&place.longitude!=null&&Number.isFinite(Number(place.latitude))&&Number.isFinite(Number(place.longitude))&&Math.abs(Number(place.latitude))<=90&&Math.abs(Number(place.longitude))<=180;
  if(coords){
   const btn=document.createElement('button');btn.type='button';btn.textContent=L[16]+' · '+place.name;
   btn.style.cssText='border:1px solid #48b6c5;border-radius:9px;background:#125270;color:#e8ffff;font-size:12px;font-weight:650;padding:7px 9px;min-height:36px;max-width:100%;overflow-wrap:anywhere;text-align:left';
   btn.onclick=()=>{
    state.encyclopediaTripActive=true;
    document.getElementById('pocketStandaloneChoices')?.remove();
    state.tripCountryOnChoice=null;
    const title=String(place.name||''),selected={latitude:Number(place.latitude),longitude:Number(place.longitude),
     label:title,entity_title:title,entity_type:'city',entity_kind:'place',
     entity_country_code:String(article.country_code||article.parent_country_code||''),
     entity_region:isRegion?String(article.title||''):''};
    // Place lists use the same mode-first flow as an independently selected town.
    // A POI may use a verified map point, but lodging is never prompted first.
    offerAssistantLocalityTravelMode(selected);
   };
   actions.append(btn);
  }
  link(place.url,L[17],actions);line.append(actions);parent.append(line);
 };
 if(cities.length){const heading=isRegion?({ro:'Localități importante',en:'Important towns and cities',fr:'Villes et localités principales',de:'Wichtige Orte',it:'Località importanti',es:'Localidades importantes',pt:'Localidades importantes',nl:'Belangrijke plaatsen',ru:'Важные населённые пункты',pl:'Ważne miejscowości'}[lang]||'Important towns and cities'):L[8];const s=section(heading);cities.slice(0,7).forEach((p,i)=>addPlace(s,p,i))}
 {
  const scopeName={ro:' (zona capitalei)',en:' (capital area)',fr:' (région de la capitale)',de:' (Hauptstadtregion)',it:' (area della capitale)',es:' (zona de la capital)',pt:' (zona da capital)',nl:' (hoofdstedelijk gebied)',ru:' (район столицы)',pl:' (okolice stolicy)'};
  const sampleName={ro:' (selecție din țară)',en:' (national selection)',fr:' (sélection nationale)',de:' (landesweite Auswahl)',it:' (selezione nazionale)',es:' (selección nacional)',pt:' (seleção nacional)',nl:' (landelijke selectie)',ru:' (подборка по стране)',pl:' (wybór z całego kraju)'};
  const localScope={ro:' (în apropierea centrului județului)',en:' (near the county centre)',fr:' (près du centre du département)',de:' (nahe dem Regionszentrum)',it:' (vicino al centro della provincia)',es:' (cerca del centro provincial)',pt:' (perto do centro regional)',nl:' (nabij het regiocentrum)',ru:' (рядом с центром региона)',pl:' (w pobliżu centrum regionu)'};
  const scopeSuffix=article.attractions_scope==='capital'?(scopeName[lang]||scopeName.en):article.attractions_scope==='country_verified_sample'?(sampleName[lang]||sampleName.en):article.attractions_scope==='region_center_sample'?(localScope[lang]||localScope.en):'';
  if(article.can_route===true||sights.length){
   const s=section(L[9]+scopeSuffix);
   if(sights.length)sights.forEach((p,i)=>addPlace(s,p,i));
  else textP(s,isCountry?L[10]:({ro:'Nu am putut verifica momentan obiective turistice pentru această localitate.',en:'Verified tourist sights are temporarily unavailable for this town.',fr:'Impossible de vérifier les sites touristiques de cette ville.',de:'Für diesen Ort sind derzeit keine verifizierten Sehenswürdigkeiten verfügbar.',it:'Non è stato possibile verificare le attrazioni di questa località.',es:'No hay lugares turísticos verificados para esta localidad por ahora.',pt:'Não foi possível verificar pontos turísticos desta localidade.',nl:'Voor deze plaats zijn nu geen geverifieerde bezienswaardigheden beschikbaar.',ru:'Достопримечательности этого населённого пункта пока не подтверждены.',pl:'Nie udało się teraz potwierdzić atrakcji tej miejscowości.'}[lang]||'Verified sights unavailable.'));
  }
 }
 if(Number.isFinite(requestStartMs))showAnswerDuration(card,requestStartMs);
 const sources=section(L[11]);sources.style.cssText+=';margin-bottom:2px';
 link(article.url,'Wikipedia · '+(article.language||''),sources);
 if(isCountry&&article.country_facts?.source){
  const div=document.createElement('div');div.style.marginTop='8px';link(article.country_facts.source,L[12],div);sources.append(div);
 }
 if(article.attractions_source&&(sights.length||cities.length)){
  const div=document.createElement('div');div.style.marginTop='8px';link(article.attractions_source,L[13],div);sources.append(div);
 }
 host.append(card);
 const nav=document.createElement('button');nav.type='button';nav.className='transit-choice-action';nav.style.cssText='margin:12px 0 4px;text-align:center;min-height:46px;background:linear-gradient(110deg,#24c6cd,#2b8ac7);color:#062338;font-weight:800';
 nav.textContent=(isCountry||isRegion)?L[14]:L[15];
 nav.onclick=()=>{
  state.encyclopediaTripActive=true;
  // Preserve the exact choice from the disambiguation table, including the
  // country, county and the original coordinates if they were verified.
  if(article.selected_geo_option){
   document.getElementById('pocketStandaloneChoices')?.remove();
   offerAssistantLocalityTravelMode(article.selected_geo_option);
   return;
  }
  const title=article.title||'',coords=article.coordinates;
  document.getElementById('pocketStandaloneChoices')?.remove();
  if(isCountry||isRegion||coords&&coords.latitude!=null&&coords.longitude!=null&&Number.isFinite(Number(coords.latitude))&&Number.isFinite(Number(coords.longitude))){
   const scope={entity_type:isCountry?'country':isRegion?'region':'city',entity_kind:'place',entity_title:title,
    entity_country_code:isRegion?String(article.parent_country_code||''):String(article.country_code||''),
    entity_country_name:isCountry?title:String(article.parent_country||''),
    latitude:!isCountry&&!isRegion?coords?.latitude:null,longitude:!isCountry&&!isRegion?coords?.longitude:null};
   state.tripCountryOnChoice=null;offerAssistantLocalityTravelMode(scope);return;
  }
  const question=lang==='ro'?'Spre ce localitate sau obiectiv concret din '+title+' dorești să călătorești?':'Which specific town or attraction in '+title+' do you want to visit?';
  const questionBubble=addBubble(question,'assistant',false,{autoOpen:false});state.messages.push({role:'assistant',text:question});state.pendingEncyclopediaDestination=title;
  const back=document.createElement('button');back.type='button';back.className='transit-choice-action';
  back.textContent=({ro:'Înapoi la prezentare',en:'Back to place details',fr:'Retour à la présentation',de:'Zurück zur Übersicht',it:'Torna alla presentazione',es:'Volver a la presentación',pt:'Voltar à apresentação',nl:'Terug naar overzicht',ru:'Назад к описанию',pl:'Wróć do opisu'}[lang]||'Back to place details');
  back.style.cssText='margin-top:9px;min-height:43px;font-size:14px';
  back.onclick=()=>{state.pendingEncyclopediaDestination=null;state.tripCountryOnChoice=null;state.encyclopediaTripActive=false;openEncyclopediaCard(article,NaN)};
  questionBubble.append(back);
 };
 if(article.can_route===true){
  host.append(nav);
 const topRoute=nav.cloneNode(true);topRoute.onclick=nav.onclick;
 topRoute.style.cssText='margin:0 0 12px;text-align:center;min-height:48px;background:linear-gradient(110deg,#24c6cd,#2b8ac7);color:#062338;font-weight:800';
  host.prepend(topRoute);
 }
 openStandaloneChoicePanel(host,article.title||dialogText('Informații','Information'));
}
function showAccommodationNotice(message){
 document.getElementById('pocketAccommodationNotice')?.remove();
 const el=document.createElement('div');el.id='pocketAccommodationNotice';el.setAttribute('role','status');el.textContent=message;
 el.style.cssText='position:fixed;left:6%;right:6%;bottom:115px;z-index:2147483000;padding:14px 18px;border-radius:15px;background:#15394c;color:#f3fbff;border:1px solid #36c4d5;box-shadow:0 5px 24px #0009;text-align:center;pointer-events:none;font-size:15px;';
 document.body.append(el);setTimeout(()=>el.remove(),2000);
}
function cleanAccommodationPlaces(places){
 if(!Array.isArray(places))return [];
 const norm=value=>String(value||'').normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^\\p{L}\\p{N}]+/gu,' ').trim();
 const results=[],keys=new Set();
 for(const place of places){
  if(!place||place.latitude==null||place.longitude==null)continue;
  const lat=Number(place.latitude),lon=Number(place.longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)continue;
  const name=String(place.name||place.tags?.name||'').trim();
  const nameKey=norm(name),streetKey=norm(place.street);
  if(!nameKey)continue;
  const roadOnly=/^(strada|str|street|st|road|rd|bulevardul|bulevard|calea|drumul|ulita|rue|calle|via|rua)( |$)/u.test(nameKey)
   && !/(hotel|hostel|motel|apart|pensiun|guest|inn|chalet|caban|vila|villa|suite|room|residen|lodg)/u.test(nameKey);
  if(roadOnly||(streetKey&&nameKey===streetKey))continue;
  const addressKey=norm(place.address||place.formatted||'');
  const key=nameKey+'|'+addressKey;
  if(addressKey&&keys.has(key))continue;
  const duplicate=results.some(prev=>{
   const prevName=norm(prev.name||prev.tags?.name);
   if(prevName!==nameKey)return false;
   const meters=Math.hypot((lat-Number(prev.latitude))*111000,(lon-Number(prev.longitude))*111000*Math.cos(lat*Math.PI/180));
   return meters<75;
  });
  if(duplicate)continue;
  if(addressKey)keys.add(key);results.push(place);
 }
 return results;
}

function offerDestinationAccommodationBeforeRoute(destination,{autoSearch=false,scopeOption=null,routeMode=null}={}){
 if(!destination||destination.latitude==null||destination.longitude==null||!Number.isFinite(Number(destination.latitude))||!Number.isFinite(Number(destination.longitude))||Math.abs(Number(destination.latitude))>90||Math.abs(Number(destination.longitude))>180)return false;
 state.tripAccommodationDestination={...destination};state.travelAccommodationIntent=false;state.tripAccommodationDecision='pending';
 const host=document.createElement('div');host.dataset.directChoices='true';
 const note=document.createElement('p');note.textContent=(dialogText("Destinație confirmată: ","Confirmed destination: "))+destination.label+'. '+(dialogText("Dorești să alegi cazarea înainte să calculăm traseul final?","Choose accommodation before calculating your final route?"));host.append(note);
 const yes=document.createElement('button');yes.type='button';yes.className='transit-choice-action';yes.textContent=dialogText("Da, caută cazare","Find accommodation");
 yes.onclick=async()=>{
  document.getElementById('pocketStandaloneChoices')?.remove();
  state.tripAccommodationDecision='yes';
  state.tripAccommodationSearching=true;
  const originalDestination={...destination};
  const next=()=>{
   state.tripAccommodationSearching=false;
   if(scopeOption){state.tripAccommodationDecision='no';state.assistantStructuredDestination=false;openAssistantStructuredAddress(scopeOption,routeMode==='drive'?{onVerifiedDestination:verified=>startAssistantLocalityRoute(verified,'drive')}:{})}
   else openTransportModeFromAssistant({route_context:{destination_query:originalDestination.label,destination:originalDestination,pending:'profile'}});
  };
  try{
   // Reuse the original shared local-search engine, including its Geoapify,
   // Photon and OpenStreetMap fallbacks. Anchor it to the selected attraction,
   // NOT the user's physical GPS position or a new name-based geocode.
   const response=await fetch(CLIENT_CONFIG.apiUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
     message:'Caută cazare în jurul meu',
     language:state.language,
     module:'travel',
     location:{
      latitude:Number(originalDestination.latitude),
      longitude:Number(originalDestination.longitude),
      updatedAt:Date.now(),
      accuracy:20
     },
     location_requested:true,
     location_source:'selected_attraction',
     location_label:originalDestination.label
    })
   });
   if(!response.ok)throw new Error('Accommodation search HTTP '+response.status);
   const data=await response.json();
   state.tripAccommodationSearching=false;
   const found=cleanAccommodationPlaces(data.places);
   if(found.length){
    openAccommodationResults(found,originalDestination,scopeOption,routeMode);
    return;
   }
   const noMappedPlaces=!data.search_error_code&&Array.isArray(data.places)&&!found.length&&(data.results_count===0||data.search_ok===true);
   next();
   if(noMappedPlaces)showAccommodationNotice(dialogText("Nu am identificat cazări cartografiate în apropiere.","No mapped accommodation was found nearby."));
  }catch(error){
   state.tripAccommodationSearching=false;
   console.warn('Accommodation search unavailable; continuing route selection',String(error?.message||error));
   next();
  }
 };
 const no=document.createElement('button');no.type='button';no.className='transit-choice-action';no.textContent=dialogText("Nu, creează traseul","No, plan my route");
 no.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();state.tripAccommodationSearching=false;state.tripAccommodationDecision='no';if(scopeOption)openAssistantStructuredAddress(scopeOption,routeMode==='drive'?{onVerifiedDestination:verified=>startAssistantLocalityRoute(verified,'drive')}:{ });else openTransportModeFromAssistant({route_context:{destination_query:destination.label,destination,pending:'profile'}})};
 if(autoSearch){void yes.onclick();return true;}
 host.append(yes,no);openStandaloneChoicePanel(host,dialogText("Cazare înainte de traseu","Accommodation before route"));return true;
}
function openAccommodationResults(places,originalDestination=state.tripAccommodationDestination,scopeOption=null,routeMode=null){
 places=cleanAccommodationPlaces(places);
 if(!places.length)return false;
 const host=document.createElement('div');host.dataset.directChoices='true';
 const table=document.createElement('table');table.className='travel-mode-table';
 const body=document.createElement('tbody');
 places.slice(0,40).forEach((place,i)=>{
  const tr=document.createElement('tr'),td=document.createElement('td'),btn=document.createElement('button');
  btn.type='button';btn.className='transit-choice-action';
  const name=String(place.name||place.tags?.name||'Cazare'),address=String(place.address||place.formatted||'');
  btn.textContent=(i+1)+'. '+name+(address?' · '+address:'');
  btn.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();if(place.latitude!=null&&place.longitude!=null&&Number.isFinite(Number(place.latitude))&&Number.isFinite(Number(place.longitude))){const label=[name,address].filter(Boolean).join(', ');const destination={latitude:Number(place.latitude),longitude:Number(place.longitude),label,selected_accommodation:true};state.tripAccommodationDecision='yes';state.tripAccommodationDestination=destination;state.tripCountryOnChoice=null;if(state.currentView==='assistant')state.assistantStructuredDestination=true;if(routeMode==='drive')startAssistantLocalityRoute(destination,'drive');else openTransportModeFromAssistant({route_context:{destination_query:label,destination,pending:'profile'}})}else{addBubble(name+(address?' — '+address:''),'assistant')}};
  td.append(btn);tr.append(td);body.append(tr);
 });table.append(body);host.append(table);
 if(originalDestination&&Number.isFinite(Number(originalDestination.latitude))&&Number.isFinite(Number(originalDestination.longitude))){
  const skip=document.createElement('button');
  skip.type='button';skip.className='transit-choice-action';
  skip.textContent=({ro:'Continuă fără cazare',en:'Continue without accommodation',fr:'Continuer sans hébergement',de:'Ohne Unterkunft fortfahren',it:'Continua senza alloggio',es:'Continuar sin alojamiento',pt:'Continuar sem alojamento',nl:'Doorgaan zonder accommodatie',ru:'Продолжить без жилья',pl:'Kontynuuj bez noclegu'}[state.language]||'Continue without accommodation');
  skip.style.cssText='margin-top:12px;min-height:44px';
  skip.onclick=()=>{document.getElementById('pocketStandaloneChoices')?.remove();state.tripAccommodationDecision='no';state.tripAccommodationSearching=false;if(scopeOption){state.assistantStructuredDestination=false;openAssistantStructuredAddress(scopeOption,routeMode==='drive'?{onVerifiedDestination:verified=>startAssistantLocalityRoute(verified,'drive')}:{})}else openTransportModeFromAssistant({route_context:{destination_query:originalDestination.label,destination:originalDestination,pending:'profile'}})};
  host.append(skip);
 }
 openStandaloneChoicePanel(host,dialogText("Cazări găsite","Accommodation results"));return true;
}
function makePocketChoiceButton(label,onSelect,{variant='choice'}={}){
 const button=document.createElement('button');button.type='button';button.className='transit-choice-action pocket-choice-button';
 button.style.cssText='display:block;width:100%;min-height:56px;padding:12px 18px;border:1px solid #69d9e8;border-radius:16px;background:linear-gradient(115deg,#124c68,#08628a);box-shadow:0 4px 0 #071e2b;color:#f2fbff;font:inherit;font-weight:600;text-align:left;white-space:normal;overflow-wrap:anywhere;cursor:pointer;touch-action:manipulation';
 button.textContent=String(label||'');if(variant==='primary')button.style.textAlign='center';
 if(typeof onSelect==='function')button.addEventListener('click',onSelect);
 return button;
}
function makePocketChoiceList(options,onSelect){
 const host=document.createElement('div');host.dataset.directChoices='true';host.style.cssText='display:flex;flex-direction:column;gap:12px;width:100%;padding:4px 0';
 for(const option of options||[])host.append(makePocketChoiceButton(option.label,()=>onSelect(option)));
 return host;
}
function openPocketSelectionPanel(options,titleText,onSelect,{keepOpen=false}={}){
 // Selectable answer options use the same progressive policy when >4 choices.
 // This is not used by journey alternatives, article lists or data tables.
 const items=(options||[]).map((item,index)=>typeof item==='string'?{id:String(index),label:item}:item);
 const act=option=>{if(!option.disabled&&typeof onSelect==='function')onSelect(option)};
 const host=makePocketChoiceList(items,act);
 const buttons=[...host.children];
 const decorate=(option,button)=>{
  if(option?.disabled){
   button.disabled=true;button.style.opacity='0.5';button.style.cursor='not-allowed';
   if(option.reason)button.title=String(option.reason);
  }
  return button;
 };
 if(items.length>4){
  host.replaceChildren();
  const search=document.createElement('input');search.type='search';
  search.placeholder=dialogText('Caută în listă de la prima literă','Search list from the first letter');
  search.setAttribute('aria-label',search.placeholder);
  search.style.cssText='box-sizing:border-box;width:100%;padding:11px;border:1px solid #5ecbd9;border-radius:11px;background:#102d40;color:white;font:inherit;margin:0 0 9px';
  const results=document.createElement('div');
  results.style.cssText='display:flex;flex-direction:column;gap:8px';
  const render=()=>{
   const q=progressiveMatchText(search.value);
   const visible=items.map((option,i)=>({option,i})).filter(row=>
     !q||progressiveMatchText(row.option.label).includes(q));
   visible.sort((a,b)=>{
    if(!q)return 0;
    return Number(progressiveMatchText(b.option.label).startsWith(q))-
      Number(progressiveMatchText(a.option.label).startsWith(q));
   });
   renderProgressiveChoiceList(results,visible,({option,i})=>decorate(option,buttons[i]));
  };
  search.oninput=render;render();host.append(search,results);
 }else items.forEach((option,i)=>decorate(option,buttons[i]));
 openStandaloneChoicePanel(host,titleText,{keepOpen});
}
function openStandaloneChoicePanel(host,titleText,{keepOpen=false}={}){
 dismissSelectionKeyboard();closeAnswerReader(false);
 const old=document.getElementById('pocketStandaloneChoices');if(old)old.remove();
 const panel=document.createElement('section');panel.id='pocketStandaloneChoices';panel.className='answer-reader';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
 const header=document.createElement('div');header.className='answer-reader-header';const title=document.createElement('h2');title.textContent=titleText||dialogText('Alege o opțiune','Choose an option');
 const close=document.createElement('button');close.type='button';close.className='answer-reader-close';close.textContent=dialogText("Închide","Close");close.setAttribute('aria-label',close.textContent);close.onclick=()=>{if(state.assistantStructuredDestination===true)state.assistantStructuredDestination=false;panel.remove();};
 header.append(title,close);const body=document.createElement('div');body.className='answer-reader-body';body.style.whiteSpace='normal';
 while(host.firstChild)body.append(host.firstChild);
 if(state.encyclopediaTripActive&&state.lastEncyclopediaArticle&&titleText!==state.lastEncyclopediaArticle.title){
  const back=document.createElement('button');back.type='button';back.className='transit-choice-action';
  back.textContent=({ro:'Înapoi la prezentare',en:'Back to place details',fr:'Retour à la présentation',de:'Zurück zur Übersicht',it:'Torna alla presentazione',es:'Volver a la presentación',pt:'Voltar à apresentação',nl:'Terug naar overzicht',ru:'Назад к описанию',pl:'Wróć do opisu'}[state.language]||'Back to place details');
  back.style.cssText='margin:0 0 12px;min-height:43px;text-align:center';
  back.onclick=()=>{state.pendingEncyclopediaDestination=null;state.tripCountryOnChoice=null;state.encyclopediaTripActive=false;state.tripAccommodationDecision=null;state.tripAccommodationDestination=null;openEncyclopediaCard(state.lastEncyclopediaArticle,NaN)};
  body.prepend(back);
 }
 panel.append(header,body);document.body.append(panel);
 const top=document.querySelector('.bottom-nav')?.getBoundingClientRect().top;panel.style.bottom=(top>0?Math.max(12,window.innerHeight-top+10):108)+'px';
 panel.addEventListener('click',e=>{if(!keepOpen&&e.target.closest('button')&&e.target!==close){panel.remove()}});
 close.focus({preventScroll:true});
}
function showAnswerDuration(host,startMs){
 if(!host||!Number.isFinite(startMs))return;
 const elapsedMs=Math.max(0,Math.round(performance.now()-startMs));
 const ms=v=>Number.isFinite(Number(v))?(Math.max(0,Number(v))/1000).toFixed(1)+' s':'—';
 const details=document.createElement('details');details.className='pocket-response-duration';details.style.cssText='margin-top:8px;font-size:12px;opacity:.78;letter-spacing:.1px';
 const summary=document.createElement('summary');summary.textContent=(dialogText("Timp răspuns: ","Response time: "))+ms(elapsedMs)+' · '+(dialogText("detalii","details"));summary.style.cssText='cursor:pointer;list-style:none;user-select:none';details.append(summary);
 const timing=state.lastRequestTimings;
 if(timing&&Math.abs((Number(timing.total_ms)||0)-elapsedMs)<10000){
  const local=state.language==='ro',stage=timing.backend_latency||{};
  const rows=[
   [local?'GPS / identificare':'GPS / intent',timing.gps_ms],
   [local?'Cerere API completă':'API round trip',timing.backend_round_trip_ms],
   [local?'Procesare Worker':'Worker processing',timing.server_total_ms],
   [local?'Cercetare web':'Web research',stage.research_ms],
   [local?'Primul apel AI':'Primary AI call',stage.primary_ai_ms],
   [local?'Corecție propoziții':'Sentence correction',stage.sentence_correction_ms],
   [local?'Revizie AI':'AI review',stage.review_ai_ms],
   [local?'Corecție rețetă':'Recipe correction',stage.recipe_correction_ms]
  ];
  const panel=document.createElement('div');panel.style.cssText='margin-top:8px;padding:9px;border:1px solid #34566e;border-radius:9px;display:grid;gap:5px';
  for(const [name,value] of rows){if(value===null||value===undefined)continue;const line=document.createElement('div');line.style.cssText='display:flex;justify-content:space-between;gap:10px';const nameEl=document.createElement('span');nameEl.textContent=name;const valueEl=document.createElement('strong');valueEl.textContent=ms(value);line.append(nameEl,valueEl);panel.append(line)}
  if(Number.isFinite(Number(stage.model_calls_estimate))){const meta=document.createElement('div');meta.textContent=(local?'Apeluri AI estimate: ':'Estimated AI calls: ')+stage.model_calls_estimate;panel.append(meta)}
  if(stage.ai_model){const model=document.createElement('div');model.style.cssText='overflow-wrap:anywhere';model.textContent=(local?'Model AI: ':'AI model: ')+String(stage.ai_model);panel.append(model)}
  if(timing.backend_version){const v=document.createElement('div');v.textContent='Backend '+timing.backend_version;panel.append(v)}
  details.append(panel);
 }
 host.append(details);
}
function appendHourlyWeatherVisual(host,weather){
 if(!host||!weather||!Array.isArray(weather.hourly)||!weather.hourly.length)return;
 const btn=document.createElement('button');btn.type='button';btn.className='transit-choice';btn.textContent=dialogText('🌦️ Detalii meteo pe ore','🌦️ Hourly weather details');
 const showWeather=()=>{
  const panel=document.createElement('div');panel.style.cssText='max-height:72vh;overflow:auto;padding:12px';
  const heading=document.createElement('h3');heading.style.cssText='font-size:18px;line-height:1.3;margin:0 0 8px';heading.textContent=String(weather.location||'')+' · '+String(weather.date||'');panel.append(heading);
  const info=document.createElement('p');info.textContent=String(weather.timezone||'');panel.append(info);
  const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(95px,1fr));gap:8px';
  const weatherIcon=code=>code===0?'☀️':code<=3?'⛅':code===45||code===48?'🌫️':code>=51&&code<=67?'🌧️':code>=71&&code<=77?'❄️':code>=80&&code<=82?'🌦️':code>=95?'⛈️':'☁️';
  for(const h of weather.hourly){
   const cell=document.createElement('div');cell.style.cssText='border:1px solid var(--border,#64748b);border-radius:10px;padding:8px;text-align:center';
   const time=document.createElement('div');time.textContent=h.time;
   const icon=document.createElement('div');icon.style.fontSize='26px';icon.textContent=weatherIcon(h.weather_code);
   const temp=document.createElement('strong');temp.textContent=Number(h.temperature).toFixed(0)+'°C';
   const rain=document.createElement('div');rain.textContent='💧 '+(h.precipitation_probability==null?'—':h.precipitation_probability+'%');
   const mm=document.createElement('div');mm.textContent=h.precipitation_mm==null?'':h.precipitation_mm+' mm';
   cell.append(time,icon,temp,rain,mm);grid.append(cell);
  }
  const summary=document.createElement('div');summary.style.cssText='margin:8px 0 16px;line-height:1.55';summary.textContent=dialogText('Prognoza pentru orele următoare, în fusul orar al destinației.','Forecast for the upcoming hours in the destination time zone.');panel.insertBefore(summary,grid);
  panel.append(grid);
  if(weather.rain_window){const p=document.createElement('p');p.textContent=dialogText('Ploaie estimată: ','Estimated rain: ')+weather.rain_window.start+'–'+weather.rain_window.end;panel.append(p)}
  const source=document.createElement('p');source.textContent='Open-Meteo · '+String(weather.retrieved_at||'');panel.append(source);
  openStandaloneChoicePanel(panel,dialogText('Prognoză orară','Hourly forecast'));

 };
 btn.onclick=showWeather;
 // Show details only when requested; preserve the main weather explanation.
 host.append(btn);
}
function addBubble(text,role='assistant',isError=false,options={}){const empty=messagesEl.querySelector('.empty-state');if(empty)empty.remove();const el=document.createElement('div');el.className='bubble '+role+(isError?' error':'');const content=document.createElement('span');content.className='bubble-text';appendAnswerText(content,String(text));el.append(content);messagesEl.append(el);requestAnimationFrame(()=>{if(role==='assistant')prepareAnswerReader(content,el,text,options.autoOpen===true);messagesEl.scrollTop=messagesEl.scrollHeight;requestAnimationFrame(()=>{messagesEl.scrollTop=messagesEl.scrollHeight})});return el}
function resetChat(){state.newsConversationContext=null;state.assistantStructuredDestination=false;cancelTransitAccess(true);state.transitRefreshGeneration=(state.transitRefreshGeneration||0)+1;state.transitRefreshAbort?.abort();state.transitRefreshAbort=null;state.transitRefreshBusy=false;state.lastTransitChoice=null;state.lastTransitResponse=null;state.lastTravelModeResponse=null;state.pendingTravelMode=null;closeRouteMap(false);closeAnswerReader(false);state.lastRoute=null;state.lastRouteOptions=[];state.routeSearchContext=null;state.weatherSearchContext=null;state.placeSearchContext=null;state.distanceSearchContext=null;state.lastPlaceResults=[];state.pendingRouteDestination=null;state.pendingTravelConfirmationData=null;state.travelConfirmationPanel=null;state.pendingRouteStart=false;state.pendingRouteViaQuery=null;state.pendingRouteCompare=false;state.conversationGeneration++;state.messages=[];state.requestedTransitCount=null;const ui=UI_TEXT[state.language]||UI_TEXT.en;messagesEl.innerHTML='<div class="empty-state"></div>';const empty=messagesEl.querySelector('.empty-state');empty.append(document.createTextNode(ui.empty));const hint=document.createElement('span');hint.className='small';hint.textContent=ui.emptyHint;empty.append(document.createElement('br'),hint);state.lastReply='';inputEl.value='';setStatus(ui.ready);stopSpeech();stopRecognition();state.voiceMode=false;state.dictationMode=false;setPressed($('voiceBtn'),false);setPressed($('dictationBtn'),false);hideAvatar();}
function setPressed(button,value){button.setAttribute('aria-pressed',String(Boolean(value)))}
// 03 — Local conversation history (explicitly deletable)
const HISTORY_KEY='mypocketai.history.v1';
function loadHistory(){try{const v=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');state.history=Array.isArray(v)?v:[]}catch{state.history=[]}}
function saveHistory(){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(state.history.slice(-30)))}catch{notify('Istoricul nu a putut fi salvat pe acest dispozitiv.')}}
function archiveCurrentConversation(){if(!state.messages.length)return;state.history.unshift({id:Date.now(),title:(state.messages.find(m=>m.role==='user')?.text||dialogText('Conversație nouă','New conversation')).slice(0,72),date:new Date().toLocaleString(),messages:state.messages.slice(-40),placeContext:state.placeSearchContext||null,placeResults:state.lastPlaceResults||[],distanceContext:state.distanceSearchContext||null,routeContext:state.routeSearchContext||null,weatherContext:state.weatherSearchContext||null,newsContext:state.newsConversationContext||null});state.history=state.history.slice(0,30);saveHistory()}
function renderHistory(){const list=$('historyList');list.innerHTML='';if(!state.history.length){const p=document.createElement('p');p.className='muted';p.textContent=dialogText('Nu există conversații salvate încă.','No saved conversations yet.');list.append(p);return}state.history.forEach(item=>{const row=document.createElement('div');row.className='list-row';const span=document.createElement('span');span.textContent=item.title+' · '+item.date;const btn=document.createElement('button');btn.textContent=dialogText('Deschide','Open');btn.addEventListener('click',()=>{state.messages=Array.isArray(item.messages)?item.messages.slice():[];state.placeSearchContext=item.placeContext||null;state.lastPlaceResults=Array.isArray(item.placeResults)?item.placeResults:[];state.distanceSearchContext=item.distanceContext||null;state.routeSearchContext=item.routeContext||null;state.weatherSearchContext=item.weatherContext||null;state.newsConversationContext=item.newsContext||null;state.lastRoute=null;state.lastRouteOptions=[];messagesEl.innerHTML='';if(!state.messages.length)messagesEl.innerHTML='<div class="empty-state">Conversație goală.</div>';state.messages.forEach(m=>addBubble(m.text,m.role));state.lastReply=[...state.messages].reverse().find(m=>m.role==='assistant')?.text||'';showView('assistant')});row.append(span,btn);list.append(row)})}
// Pocket AI floating 3D avatar
const avatar3dFrame=$('avatar3dFrame');
let avatar3dReady=false,avatar3dStarted=false,avatar3dPending=null,avatarWelcomeQueued=false;
let pocketFirstEntrance=true;
function pocketRevealMainApp(){if(!pocketFirstEntrance)return;pocketFirstEntrance=false;document.documentElement.classList.remove('pocket-boot')}
function avatar3dSend(action,payload={}){
 if(!avatar3dReady){
  if(action==='start')avatar3dPending=payload;
  if(action==='stop')avatar3dPending=null;
  return;
 }
 const avatar=avatar3dFrame.contentWindow.PocketAvatarAPI;
 if(action==='start')avatar.start(payload.text);
 if(action==='boundary')avatar.boundary(payload.charIndex);
 if(action==='stop')avatar.stop();
}
function avatar3dLoad(){
 if(avatar3dStarted)return;
 avatar3dStarted=true;
 avatar3dFrame.src='/avatar-production.html?embedded=1';
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==avatar3dFrame.contentWindow)return;
 if(event.data?.channel!=='pocket-avatar-v4')return;
 if(event.data.action==='error'){
  avatarWelcomeQueued=false;if(!pocketExitOpen)hideAvatar();
  pocketRevealMainApp();
  setStatus('Modelul 3D nu a putut fi încărcat.');
  return;
 }
 if(event.data.action!=='ready'||avatar3dReady)return;
 avatar3dReady=true;
 avatar3dFrame.style.display='block';
 $('avatarImage').style.visibility='hidden';
 if(pocketExitOpen){showAvatar({message:learningLabel('Vrei să închizi aplicația sau mai ai nevoie de mine?','Do you want to close the app, or do you still need me?'),status:learningLabel('Te ascult…','Listening…'),speaking:true});avatarOverlay.classList.add('exit-mode');}
 else if(!state.speaking&&state.currentView==='home'&&!nativeEntranceCompleted){
  // Keep ordinary app chrome hidden while the ready 3D model greets first.
  welcomeUser();
 }else if(state.speaking){
  avatarWelcomeQueued=false;
  showAvatar({message:'',status:'',speaking:true});
 }
 if(avatar3dPending){
  const pending=avatar3dPending;
  avatar3dPending=null;
  avatar3dSend('start',pending);
 }
});
// 04 — Avatar lifecycle: same entrance/exit transition for every appearance
function showAvatar({message='Salut! Sunt asistentul tău personal.',status='Bine ai venit!',speaking=false}={}){avatar3dLoad();$('avatarImage').style.visibility=avatar3dReady?'hidden':'visible';clearTimeout(state.avatarTimer);avatarMessage.textContent=message;avatarStatus.textContent=status;avatarOverlay.classList.toggle('speaking',speaking);voiceWave.hidden=!speaking;if(avatar3dReady)avatar3dFrame.contentWindow.PocketAvatarAPI.setVisible(true);avatarOverlay.classList.add('visible');avatarOverlay.setAttribute('aria-hidden','false')}
function hideAvatar(){avatar3dSend('stop');if(avatar3dReady)avatar3dFrame.contentWindow.PocketAvatarAPI.setVisible(false);clearTimeout(state.avatarTimer);avatarOverlay.classList.remove('visible','speaking');avatarOverlay.setAttribute('aria-hidden','true');voiceWave.hidden=true;pocketRevealMainApp()}
let pocketGreetingActive=false;
function welcomeUser(){
 if(!avatar3dReady||pocketGreetingActive||pocketExitOpen)return;
 pocketGreetingActive=true;
 const greeting=learningLabel('Salut! Cum te pot ajuta?','Hello! How can I help you?');
 showAvatar({message:greeting,status:'',speaking:true});
 avatar3dSend('start',{text:greeting});
 clearTimeout(state.avatarTimer);
 // The native voice engine owns actual speaking time. This safety timeout
 // handles phones with no TTS engine without leaving the greeting stuck.
 state.avatarTimer=setTimeout(()=>{if(pocketGreetingActive){pocketGreetingActive=false;hideAvatar()}},8500);
 if(pocketNativeVoiceAvailable()){
  if(!pocketNativeVoiceSend({action:'speak',text:greeting,language:pocketExitLanguage()})){
   pocketGreetingActive=false;state.avatarTimer=setTimeout(hideAvatar,2800);
  }
 }else if('speechSynthesis' in window){
  const utterance=new SpeechSynthesisUtterance(greeting);utterance.lang=pocketExitLanguage();
  utterance.onend=()=>{pocketGreetingActive=false;avatar3dSend('stop');state.avatarTimer=setTimeout(hideAvatar,700)};
  utterance.onerror=()=>{pocketGreetingActive=false;state.avatarTimer=setTimeout(hideAvatar,1000)};
  speechSynthesis.speak(utterance);
 }else{pocketGreetingActive=false;state.avatarTimer=setTimeout(hideAvatar,2800)}
}
$('avatarClose').addEventListener('click',()=>{if(state.voiceMode){state.voiceMode=false;stopRecognition();stopSpeech();setPressed($('voiceBtn'),false)}if(pocketExitOpen)pocketExitClose();else hideAvatar()});
// 05 — Speech output, independent from network request handling
let speechVoiceCache=[];
let pocketNativeSpokenText='';
function refreshSpeechVoices(){if(!('speechSynthesis'in window))return [];try{speechVoiceCache=window.speechSynthesis.getVoices()||[]}catch{speechVoiceCache=[]}return speechVoiceCache}
function getSpeechVoice(){const voices=refreshSpeechVoices();const wanted=state.language==='en'?'en-GB':String(state.language||'ro');const normalize=value=>String(value||'').toLowerCase().replace(/_/g,'-');const base=normalize(wanted).split('-')[0];const compatible=voices.filter(v=>normalize(v.lang)===normalize(wanted));const sameLanguage=voices.filter(v=>normalize(v.lang).split('-')[0]===base);const candidates=compatible.length?compatible:sameLanguage;if(!candidates.length)return null;if(state.language!=='en'){const femaleHints=/\\b(female|woman|women|femin|femeie|ioana|alina|ana|andreea|elena|irina|paula|roberta|sorana|raluca|viorica)\\b/i;const naturalHints=/(neural|natural|online|premium|enhanced)/i;const scored=candidates.map((voice,index)=>{const label=String(voice.name||'');let score=0;if(femaleHints.test(label))score+=8;if(naturalHints.test(label))score+=5;if(/google|microsoft/i.test(label))score+=1;if(voice.localService)score+=1;if(voice.default)score-=2;return {voice,score,index}}).sort((a,b)=>b.score-a.score||a.index-b.index);return scored[0].voice}return candidates.find(v=>v.default)||candidates.find(v=>v.localService)||candidates[0]}
function waitForSpeechVoices(){if(!('speechSynthesis'in window))return Promise.resolve([]);const current=refreshSpeechVoices();if(current.length)return Promise.resolve(current);return new Promise(resolve=>{let finished=false;const done=()=>{if(finished)return;finished=true;resolve(refreshSpeechVoices())};try{window.speechSynthesis.addEventListener('voiceschanged',done,{once:true})}catch{}setTimeout(done,900)})}
function prepareSpeechText(text){let t=String(text);t=t.replace(/!\\[([^\\]]*)\\]\\([^)]*\\)/g,'$1').replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g,'$1').replace(/\\x60\\x60\\x60[\\s\\S]*?\\x60\\x60\\x60/g,' cod omis ').replace(/\\x60([^\\x60]+)\\x60/g,'$1').replace(/\\*\\*([^*]+)\\*\\*/g,'$1').replace(/__([^_]+)__/g,'$1').replace(/[*_~#>\\x60]/g,' ').replace(/^\\s*[-+•]\\s+/gm,'').replace(/^\\s*\\d+[.)]\\s+/gm,'').replace(/\\s+/g,' ').trim();if(state.language!=='ro')return t;
// Expand longer/specific units first; this transformation is used only for spoken output.
const replacements=[
[/\\bkm\\s*\\/\\s*h\\b/gi,'kilometri pe oră'],[/\\bkm²\\b/gi,'kilometri pătrați'],[/\\bcm²\\b/gi,'centimetri pătrați'],[/\\bmm²\\b/gi,'milimetri pătrați'],[/\\bm²\\b/gi,'metri pătrați'],[/\\bkm³\\b/gi,'kilometri cubi'],[/\\bm³\\b/gi,'metri cubi'],
[/\\bkm\\b/gi,'kilometri'],[/\\bkg\\b/gi,'kilograme'],[/\\bmg\\b/gi,'miligrame'],[/\\bµg\\b|\\bμg\\b/gi,'micrograme'],[/\\bml\\b/gi,'mililitri'],[/\\bl\\b/gi,'litri'],[/\\bcl\\b/gi,'centilitri'],[/\\bdl\\b/gi,'decilitri'],[/\\bcm\\b/gi,'centimetri'],[/\\bmm\\b/gi,'milimetri'],[/\\bm\\b/gi,'metri'],[/\\bkm²\\b/gi,'kilometri pătrați'],[/\\b°\\s*c\\b/gi,'grade Celsius'],[/\\b°\\s*f\\b/gi,'grade Fahrenheit'],[/\\bgb\\b/gi,'gigaocteți'],[/\\bmb\\b/gi,'megaocteți'],[/\\bkb\\b/gi,'kiloocteți']
];for(const [pattern,word] of replacements)t=t.replace(pattern,word);
// Improve Romanian reading of decimal quantities without changing the written reply.
t=t.replace(/(\\d),(\\d)/g,'$1 virgulă $2');return t;}
function pocketNativeVoiceAvailable(){return typeof window.PocketAndroidVoice?.postMessage==='function'}
function pocketNativeVoiceSend(payload){try{window.PocketAndroidVoice.postMessage(JSON.stringify(payload));return true}catch{return false}}
window.pocketAndroidVoiceResult=function(data){
 if(educationTheoryHandleAndroid(data))return;
 if(scienceVoiceHandleAndroid(data))return;
 if(mathVoiceHandleAndroid(data))return;
 if(shopVoiceHandleAndroid(data))return;
 if(agendaVoiceHandleAndroid(data))return;
 if(remindersVoiceHandleAndroid(data))return;
 if(notesVoiceHandleAndroid(data))return;
 if(dailyVoiceHandleAndroid(data))return;
 if(budgetVoiceHandleAndroid(data))return;
 if(documentsVoiceHandleAndroid(data))return;
 if(tasksVoiceHandleAndroid(data))return;
 if(pocketExitVoiceResult(data))return;
 if(data?.mode==='tts'){
  if(data.status==='boundary')avatar3dSend('boundary',{charIndex:Number(data.text)||0});
  if(pocketGreetingActive){
   if(data.status==='start')avatar3dSend('start',{text:learningLabel('Salut! Cum te pot ajuta?','Hello! How can I help you?')});
   if(data.status==='done'||data.status==='error'){
    pocketGreetingActive=false;avatar3dSend('stop');avatarOverlay.classList.remove('speaking');voiceWave.hidden=true;
    state.avatarTimer=setTimeout(()=>{if(!pocketExitOpen)hideAvatar()},650);
   }
   return;
  }
  if(data.status==='done'||data.status==='error'){
   avatar3dSend('stop');state.speaking=false;
   avatarOverlay.classList.remove('speaking');voiceWave.hidden=true;hideAvatar();
   if(data.status==='error')notify('Vocea Android nu a putut reda textul. Verifică motorul de sinteză vocală al telefonului.');
   if(data.status==='done'&&state.voiceMode){setStatus('Te ascult…');setTimeout(()=>{if(state.voiceMode&&!state.speaking)startRecognition('voice')},100)}
  }else if(data.status==='start'){avatar3dLoad();avatar3dSend('start',{text:pocketNativeSpokenText||state.lastReply||''})}
  return;
 }
 if(data?.status==='listening'){setStatus('Te ascult în aplicație…');return;}
 if(data?.status==='partial'){
  const partial=String(data.text||'').trim();
  if(data.mode==='voice')setStatus(partial?'Am auzit: '+partial:'Te ascult…');
  else setStatus(partial?'Dictare: '+partial:'Te ascult…');
  return;
 }
 if(data?.status==='recognized'){
  const recognized=String(data.text||'').trim();
  if(data.mode==='voice'){
   if(recognized&&state.voiceMode){inputEl.value=recognized;submitMessage({fromVoice:true})}
   else if(state.voiceMode)setStatus('Nu am recunoscut întrebarea. Încearcă din nou.');
  }else{
   if(recognized)inputEl.value=collapseRepeatedVoiceWords([inputEl.value,recognized].filter(Boolean).join(' '));
   state.dictationMode=false;setPressed($('dictationBtn'),false);
   setStatus(recognized?'Dictare încheiată. Verifică textul.':'Nu am recunoscut textul dictat.');
  }
 }else if(data?.status==='error'){state.dictationMode=false;setPressed($('dictationBtn'),false);state.voiceMode=false;setPressed($('voiceBtn'),false);notify('Recunoașterea vocală Android nu este disponibilă.')}
};
function speakText(text,{continuous=false}={}){stopRecognition();state.dictationMode=false;setPressed($('dictationBtn'),false);if(pocketNativeVoiceAvailable()){
 stopSpeech();
 state.speaking=true;
 showAvatar({message:'Îți citesc răspunsul…',status:'Răspund vocal…',speaking:true});
 pocketNativeSpokenText=prepareSpeechText(text);
 const ok=pocketNativeVoiceSend({action:'speak',text:pocketNativeSpokenText,language:({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'})[state.language]||state.language});
 if(!ok){state.speaking=false;hideAvatar();notify('Nu am putut porni vocea Android.');}
 return ok;
}
if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){hideAvatar();notify('Redarea vocală nu este disponibilă în acest browser. Răspunsul rămâne disponibil în scris.');return false}stopSpeech();const utterance=new SpeechSynthesisUtterance(prepareSpeechText(text));utterance.lang=({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'})[state.language]||state.language;utterance.rate=state.language==='en'?1:0.96;utterance.pitch=state.language==='en'?1:1.04;state.speaking=true;showAvatar({message:'Îți citesc răspunsul…',status:'Răspund vocal…',speaking:true});utterance.onstart=()=>{avatar3dLoad();avatar3dSend('start',{text:utterance.text})};utterance.onboundary=event=>avatar3dSend('boundary',{charIndex:event.charIndex});utterance.onend=()=>{avatar3dSend('stop');state.speaking=false;avatarOverlay.classList.remove('speaking');voiceWave.hidden=true;hideAvatar();if(continuous&&state.voiceMode){setStatus('Te ascult…');setTimeout(()=>{if(state.voiceMode&&!state.speaking&&!state.recognition)startRecognition('voice')},120)}};utterance.onerror=()=>{avatar3dSend('stop');state.speaking=false;avatarOverlay.classList.remove('speaking');voiceWave.hidden=true;hideAvatar();if(continuous&&state.voiceMode){setStatus('Redarea vocală nu a pornit. Poți continua prin microfon sau text.')}else{notify('Răspunsul text este disponibil; redarea vocală nu a reușit.')}};const speakWhenReady=()=>{const voice=getSpeechVoice();if(voice)utterance.voice=voice;try{window.speechSynthesis.speak(utterance)}catch{state.speaking=false;hideAvatar();notify('Nu am putut porni redarea vocală. Răspunsul rămâne disponibil în scris.')}};if(refreshSpeechVoices().length)speakWhenReady();else waitForSpeechVoices().then(speakWhenReady);return true}
function stopSpeech(){if(pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stop'});avatar3dSend('stop');pocketNativeSpokenText='';if('speechSynthesis'in window)window.speechSynthesis.cancel();state.speaking=false;avatarOverlay.classList.remove('speaking');voiceWave.hidden=true}
// 06 — Speech recognition: dictation and continuous voice are distinct modes
// Voice recognition uses the APK's native Android speech bridge only.
// Conservative cleanup used ONLY for continuous voice conversation, not dictation.
function cleanVoiceConversationTranscript(parts){
 const tokens=[];
 for(const raw of parts.filter(Boolean)){
  const incoming=String(raw).replace(/\\s+/g,' ').trim().split(' ').filter(Boolean);
  if(!incoming.length)continue;
  let overlap=0;
  const max=Math.min(tokens.length,incoming.length,10);
  for(let n=max;n>0;n--){
   let same=true;
   for(let j=0;j<n;j++){
    if(tokens[tokens.length-n+j].toLocaleLowerCase()!==incoming[j].toLocaleLowerCase()){same=false;break;}
   }
   if(same){overlap=n;break;}
  }
  tokens.push(...incoming.slice(overlap));
 }
 // Remove exact adjacent repeated phrases (2–7 words) sometimes emitted by Android speech engines.
 let changed=true;
 while(changed){
  changed=false;
  for(let size=Math.min(7,Math.floor(tokens.length/2));size>=2;size--){
   let found=false;
   for(let i=0;i+size*2<=tokens.length;i++){
    const a=tokens.slice(i,i+size).join(' ').toLocaleLowerCase();
    const b=tokens.slice(i+size,i+size*2).join(' ').toLocaleLowerCase();
    if(a===b){tokens.splice(i+size,size);changed=true;found=true;break;}
   }
   if(found)break;
  }
 }
 return tokens.join(' ').replace(/\\s+([,.;!?])/g,'$1').trim();
}
function collapseRepeatedVoiceWords(value){return String(value||'').replace(/\\b([\\p{L}]+)(?:\\s+\\1\\b)+/giu,'$1')}
function stopRecognition(){if(pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stopListen'});clearTimeout(state.voiceSilenceTimer);state.voiceSilenceTimer=null;state.voicePendingSubmit=false;if(state.recognition){try{state.recognition.onresult=null;state.recognition.onerror=null;state.recognition.onend=null;state.recognition.stop()}catch{}state.recognition=null}}
function startRecognition(mode){
 if(state.speaking){setStatus('Așteaptă finalizarea răspunsului vocal înainte să activezi microfonul.');return}
 if(!pocketNativeVoiceAvailable()){
  notify('Recunoașterea vocală Android nu este disponibilă.');
  state.voiceMode=false;state.dictationMode=false;
  setPressed($('voiceBtn'),false);setPressed($('dictationBtn'),false);
  return;
 }
 hideAvatar();stopRecognition();
 const locale=({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',ru:'ru-RU',pl:'pl-PL'})[state.language]||state.language;
 setStatus(mode==='voice'?'Vorbește după deschiderea microfonului Android.':'Dictare vocală Android.');
 if(!pocketNativeVoiceSend({action:'listen',mode,language:locale})){
  notify('Nu am putut deschide microfonul Android.');
  state.voiceMode=false;state.dictationMode=false;
  setPressed($('voiceBtn'),false);setPressed($('dictationBtn'),false);
 }
}
function finishVoiceCapture(){clearTimeout(state.voiceSilenceTimer);state.voiceSilenceTimer=null;const full=collapseRepeatedVoiceWords(cleanVoiceConversationTranscript(state.voiceParts.filter(Boolean).length?state.voiceParts.filter(Boolean):[state.voiceInterim]));state.voicePendingSubmit=false;state.voiceParts=[];state.voiceInterim='';if(full&&state.voiceMode){inputEl.value=full;submitMessage({fromVoice:true})}else if(state.voiceMode&&!state.busy&&!state.speaking){setStatus('Te ascult…');startRecognition('voice')}}
$('dictationBtn').addEventListener('click',()=>{if(state.dictationMode){stopRecognition();state.dictationMode=false;setPressed($('dictationBtn'),false);hideAvatar();return}if(state.voiceMode){state.voiceMode=false;stopRecognition();setPressed($('voiceBtn'),false)}state.dictationMode=true;setPressed($('dictationBtn'),true);startRecognition('dictation')});
$('voiceBtn').addEventListener('click',()=>{if(state.voiceMode){state.voiceMode=false;stopRecognition();stopSpeech();setPressed($('voiceBtn'),false);hideAvatar();setStatus('Conversație vocală oprită.');return}state.voiceMode=true;state.dictationMode=false;setPressed($('dictationBtn'),false);setPressed($('voiceBtn'),true);setStatus('Conversație vocală activată.');startRecognition('voice')});
$('listenBtn').addEventListener('click',()=>{if(!state.lastReply){notify('Mai întâi primește un răspuns de la myPocket AI.');return}speakText(state.lastReply)});
// Shared foreground location: request at app startup and keep the last position fresh while the page is open.
function locationErrorMessage(err){return new Error(err&&err.code===1?'Permisiunea de localizare a fost refuzată. Activează locația pentru acest site.':err&&err.code===3?'Localizarea a expirat. Încearcă din nou.':'Nu am putut obține coordonatele GPS.')}
function forgetSharedLocation(){state.location=null;try{sessionStorage.removeItem('mypocketai_last_location')}catch{}}
function cachedCoordinates(){
 const v=state.location;if(!v||!Number.isFinite(v.latitude)||!Number.isFinite(v.longitude)||Math.abs(v.latitude)>90||Math.abs(v.longitude)>180)return null;
 const age=Number.isFinite(v.updatedAt)?Date.now()-v.updatedAt:Infinity;if(age<0||age>600000)return null;
 return {latitude:v.latitude,longitude:v.longitude,accuracy:v.accuracy,updatedAt:v.updatedAt,is_cached:age>120000,age_ms:Math.round(age)};
}
function startSharedLocation(){
 if(state.locationStarted)return;state.locationStarted=true;if(!navigator.geolocation)return;
 getCurrentCoordinates(true).catch(()=>{});
 state.locationWatchId=navigator.geolocation.watchPosition(pos=>saveLocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy}),err=>{if(err.code===1)forgetSharedLocation();console.info('GPS update unavailable',err.code)},{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
}
window.addEventListener('pocketandroidlocation',event=>{
 if(!event.detail?.granted){setStatus('Localizarea Android nu este permisă. Traseele pot necesita activarea GPS.');return}
 getCurrentCoordinates(true).catch(()=>{});
 if(state.locationWatchId!=null&&navigator.geolocation)navigator.geolocation.clearWatch(state.locationWatchId);
 if(navigator.geolocation)state.locationWatchId=navigator.geolocation.watchPosition(
  pos=>saveLocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy}),
  err=>{if(err.code===1)forgetSharedLocation();console.info('GPS update unavailable',err.code)},
  {enableHighAccuracy:true,timeout:15000,maximumAge:30000});
});
async function getCurrentCoordinates(forceRefresh=false){
 const cached=cachedCoordinates();if(!forceRefresh&&cached){if(cached.age_ms>30000)getCurrentCoordinates(true).catch(()=>{});return cached;}
 if(state.locationPromise)return state.locationPromise;
 if(!navigator.geolocation)throw new Error('GPS unavailable');
 state.locationPromise=new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(pos=>{
  const c=pos?.coords;if(!c||!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude)||Math.abs(c.latitude)>90||Math.abs(c.longitude)>180){reject(new Error('Invalid GPS coordinates'));return}
  saveLocation({latitude:c.latitude,longitude:c.longitude,accuracy:c.accuracy});resolve(cachedCoordinates());
 },err=>{if(err.code===1)forgetSharedLocation();reject(locationErrorMessage(err))},{enableHighAccuracy:true,timeout:8000,maximumAge:30000})).finally(()=>{state.locationPromise=null});
 return state.locationPromise;
}
function isRecipeQuestion(text){
 const v=String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const prefixes=['reteta','retete','recipe','recipes','ingrediente','sarmale','ciorba','cum se prepara','cum prepar','cum gatesc','how to cook'];
 return prefixes.some(word=>v===word||v.startsWith(word+' '));
}
// Keep small talk out of location and pending-route flows.
function isCasualConversationReply(value){
 const text=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
   .replace(/[!?.,;:]+/g,' ').replace(/ +/g,' ').trim();
 return /^(?:(?:eu )?(?:sunt|ma simt) (?:(?:foarte|destul de|chiar) )?(?:bine|ok|okay|excelent|grozav|in regula)(?: (?:multumesc|mersi))?|(?:(?:foarte|destul de) )?bine(?: (?:multumesc|mersi))?|(?:multumesc|mersi) sunt bine|nu (?:prea )?(?:sunt|ma simt) bine|(?:sunt|ma simt) (?:rau|trist|trista|obosit|obosita|ingrijorat|ingrijorata)|(?:i am|i'm) (?:fine|good|okay|ok|great|not well|not okay|sad|tired|worried)(?: thanks)?|(?:fine|good|great) thanks)(?: (?:si tu|and you))?$/.test(text);
}
function requestUsesLocation(text){
 const value=String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
 if(isRecipeQuestion(value))return false;
 if(isCasualConversationReply(text))return false;
 // A sentence-shaping instruction, social comment or explanatory request is
 // not a nearby business or destination, even when the GPS cache exists.
 if(/^(?:(?:te rog|please)\\s+)?(?:raspunde|reformuleaza|rescrie|rezuma|answer|respond|rephrase|rewrite|summarize|explica(?:-mi)?|explain|descrie(?:-mi)?|define|defineste|glumeam|glumesc|era o gluma|just kidding|parca(?:\\s+astazi|\\s+azi)?\\s+esti|esti\\s+(?:cam|foarte|tare|prea)\\s+serioas)/i.test(value) && !/\\b(?:cum ajung|traseu|ruta|route to|directions to|vreau sa ajung)\\b/i.test(value))return false;
 if(needsLocation(value))return true;
 if(/(?:locatia mea|pozitia mea|my location|my position|vreme|meteo|weather|forecast|distanta|distance|kilometri|traseu|ruta|route|walking|driving|pe jos|near me|nearby)/i.test(value))return true;
 // Short venue names and explicit journeys must receive GPS even without "near me".
 return /^(?:vreau sa ajung la|unde (?:este|e|gasesc)|cauta(?:-mi)?|gaseste(?:-mi)?)\\s+.{2,80}$/i.test(value)
   || (/^[\\p{L}0-9&' .-]{3,55}$/u.test(value)&&value.split(/\\s+/).length<=3&&!/^(?:ce|care|cum|cat|cand|what|why|how|hello|salut|multumesc)\\b/i.test(value));
}
async function coordinatesForRequest(text){
 const locationIntent=!isCasualConversationReply(text)&&(Boolean(state.pendingTravelMode)||requestUsesLocation(text)),cached=cachedCoordinates();
 if(!locationIntent)return {coordinates:cached,locationIntent:false,error:null};
 if(cached&&cached.age_ms<=30000)return {coordinates:cached,locationIntent:true,error:null};
 let timer;try{
  const coordinates=await Promise.race([getCurrentCoordinates(true),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('GPS pending')),5000)})]);
  return {coordinates,locationIntent:true,error:null};
 }catch(error){return {coordinates:cachedCoordinates(),locationIntent:true,error:String(error.message||error)}}finally{clearTimeout(timer)}
}
function needsLocation(text){return /(unde sunt|localiz\\w*|geolocaliz\\w*|locatia mea|in jurul meu|in apropiere|in apropierea mea|in zona mea|pe langa mine|aproape de mine|near me|nearby|around me|around here|near here|close to me|my location)/i.test(String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''));}
// 07 — Chat transport. Voice errors never convert a successful API response into request failure.
// A requested count survives an Assistant → transport chooser handoff.
function requestedTransitCountInMessage(value){
 const text=String(value||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 const found=text.match(/\\b(1|2|3|4|unu|una|un|o|one|doi|doua|two|trei|three|patru|four)\\s+(?:variant(?:e|a)?|variantele|alternativ[ae]|options?|routes?|itinerari[ie]|journeys?)\\b/i);
 if(!found)return null;
 const words={unu:1,una:1,un:1,o:1,one:1,doi:2,doua:2,two:2,trei:3,three:3,patru:4,four:4};
 return Number(found[1])||words[found[1]]||null;
}
async function submitMessage({fromVoice=false}={}){if(state.busy)return;let message=inputEl.value.trim();if(!message)return;if(state.currentView==='module'&&state.currentModule==='learning'&&activeLearningSubject){const topic=learningLabel(activeLearningSubject[2],activeLearningSubject[3]);message=(state.language==='ro'?'Materia: ':'Subject: ')+topic+'. '+message;}if(isCasualConversationReply(message)){state.pendingEncyclopediaDestination=null;state.pendingTravelMode=null;state.pendingTravelConfirmationData=null;state.pendingRouteDestination=null;state.routeSearchContext=null;}if(state.pendingEncyclopediaDestination){const country=state.pendingEncyclopediaDestination;state.pendingEncyclopediaDestination=null;const chosenRegion=state.lastEncyclopediaArticle?.is_region===true&&state.lastEncyclopediaArticle.title===country;const searchArea=chosenRegion?country+', '+(state.lastEncyclopediaArticle.parent_country||''):country;state.tripCountryOnChoice=searchArea;message=(dialogText("Vreau să ajung la ","I want to get to "))+message+', '+searchArea;state.travelAccommodationIntent=false;state.lastEncyclopediaTripQuery=message;}if(message.length>CLIENT_CONFIG.maxMessageLength){notify('Mesajul este prea lung.');return}
 const explicitCount=requestedTransitCountInMessage(message);
 if(explicitCount)state.requestedTransitCount=explicitCount;
 else if(/^(?:vreau sa ajung la|vreau să ajung la|cum ajung la|take me to|directions to)/i.test(message)&&!state.pendingTravelMode)state.requestedTransitCount=null;
// A short yes/no confirms the last identified destination locally. It must not become a new AI query.
const offered=state.pendingTravelConfirmationData,context=state.routeSearchContext;
if(offered?.needs_travel_confirmation&&context?.pending==='profile'&&context?.destination?.label&&context.destination_query===offered.route_context?.destination_query){
 const answer=message.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/[.!?]+$/,'');
 const accept=/^(?:da|yes|yep|ok|okay|sigur|desigur|bine|oui|ja|si|sim|tak|да|давай|arata traseul|arata-mi traseul|show directions|show route|show me the route)$/.test(answer);
 const refuse=/^(?:nu|no|nope|nein|non|nao|nee|нет|nie|nu multumesc|no thanks)$/.test(answer);
 if(accept||refuse){
  addBubble(message,'user');state.messages.push({role:'user',text:message});inputEl.value='';
  state.pendingTravelConfirmationData=null;state.travelConfirmationPanel?.remove();state.travelConfirmationPanel=null;
  if(accept){
   const reply=(TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en)[0];
   const bubble=addBubble(reply,'assistant',false,{autoOpen:false});
   appendTravelModeChoices({...offered,needs_travel_confirmation:false,needs_travel_mode:true,route_context:context},bubble);
   state.messages.push({role:'assistant',text:reply});state.lastReply=reply;
   if(fromVoice||state.voiceMode)speakText(reply,{continuous:state.voiceMode});
  }else{
   state.routeSearchContext=null;
   const reply=dialogText("În regulă. Nu pornesc traseul.","Okay. I won’t start directions.");
   addBubble(reply,'assistant');state.messages.push({role:'assistant',text:reply});state.lastReply=reply;
  }
  state.messages=state.messages.slice(-40);setStatus('Răspuns primit.');return;
 }
}
state.pendingTravelConfirmationData=null;
if(!state.pendingTravelMode&&state.routeSearchContext?.destination&&/^(?!pietonal$|transport public$|masina$|mașină$|walking$|driving$|public transport$|da$|yes$|nu$|no$)(?:[\\p{L}][\\p{L}0-9&' .-]{2,60}\\s*,\\s*[\\p{L} .'-]{2,60}|(?:vreau sa ajung la|vreau să ajung la|cum ajung la|take me to|directions to)\\s+.+)$/iu.test(message)){state.routeSearchContext=null;state.pendingRouteDestination=null;state.pendingTravelMode=null;state.lastTravelModeResponse=null;}if(isMapRouteFollowup(message)&&validMapRoute(state.lastRoute)){addBubble(message,'user');state.messages.push({role:'user',text:message});inputEl.value='';const reply=routeMapText().shown;addBubble(reply,'assistant');state.messages.push({role:'assistant',text:reply});openRouteMap(state.lastRoute);return}const selectedEntityKind=state.pendingSelectedEntityKind==='article'?'article':undefined;state.pendingSelectedEntityKind=null;const selectedGeographicEntity=state.pendingSelectedGeoOption||null;state.pendingSelectedGeoOption=null;state.busy=true;const clientRequestStartedAt=performance.now();const generation=state.conversationGeneration;sendBtn.disabled=true;inputEl.disabled=true;setStatus(dialogText('myPocket AI pregătește răspunsul…','Pocket AI is preparing a response…'));addBubble(message,'user');state.messages.push({role:'user',text:message});inputEl.value='';const loading=addBubble(dialogText('Se pregătește răspunsul…','Preparing response…'),'assistant');try{const history=state.messages.slice(-CLIENT_CONFIG.historyLimit).map(m=>({role:m.role,content:m.text}));const gpsStartedAt=performance.now();const locationRequest=await coordinatesForRequest(message);const gpsElapsedMs=Math.round(performance.now()-gpsStartedAt);const locationIntent=locationRequest.locationIntent;const coordinates=locationRequest.coordinates;const locationErrorText=locationRequest.error;const routeDestination=state.pendingTravelMode&&state.routeSearchContext?.destination?state.routeSearchContext.destination:selectedPlaceForRoute(message);const routeStart=state.pendingRouteStart===true;state.pendingRouteStart=false;const routeViaQuery=state.pendingRouteViaQuery||undefined;state.pendingRouteViaQuery=null;const routeCompare=state.pendingRouteCompare===true;state.pendingRouteCompare=false;const travelMode=state.pendingTravelMode||undefined;state.pendingTravelMode=null;
const newsFollowupText=String(message).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const newsContextRequested=Boolean(state.newsConversationContext)&&/(?:surs\\w*|source\\w*|link\\w*|confirmat\\w*|neclar\\w*|verificat\\w*|confirmed|unclear|unverified|original)/i.test(newsFollowupText);
const browserNow=new Date();
const clientLocalDay=[browserNow.getFullYear(),String(browserNow.getMonth()+1).padStart(2,'0'),String(browserNow.getDate()).padStart(2,'0')].join('-');
const backendRequestStartedAt=performance.now();let backendResponseHeadersAt=0;const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:state.language,selected_entity_kind:selectedEntityKind,selected_geographic_entity:selectedGeographicEntity,history,news_context:newsContextRequested?state.newsConversationContext:null,client_local_day:clientLocalDay,module:state.currentView==='module'?state.currentModule:'assistant',route_context:state.routeSearchContext||null,travel_mode:travelMode,transit_count:state.requestedTransitCount||undefined,route_destination:routeDestination,transit_destination:travelMode==='transit'?routeDestination:undefined,transit_query:travelMode==='transit'?(state.routeSearchContext?.destination?.label||state.routeSearchContext?.destination_query||undefined):undefined,route_profile:routeStart?'walk':travelMode==='transit'?undefined:travelMode|| (routeDestination?(/driving|rutier|masina/i.test(message)?'drive':'walk'):undefined),route_start:routeStart,route_via_query:routeViaQuery,route_compare:routeCompare,weather_context:state.weatherSearchContext||null,place_context:state.placeSearchContext||null,distance_context:state.distanceSearchContext||null,location_requested:locationIntent,location:coordinates,coordinates,location_error:locationIntent&&!coordinates?(locationErrorText||'Nu s-au obținut coordonate GPS valide.'):undefined})});backendResponseHeadersAt=performance.now();let data;try{data=await response.json()}catch{throw new Error(dialogText('Serverul a trimis un răspuns care nu poate fi citit.','The server returned an unreadable response.'))}state.lastRequestTimings={total_ms:Math.round(performance.now()-clientRequestStartedAt),gps_ms:gpsElapsedMs,backend_round_trip_ms:Math.round(performance.now()-backendRequestStartedAt),time_to_headers_ms:Math.round(backendResponseHeadersAt-backendRequestStartedAt),response_read_ms:Math.round(performance.now()-backendResponseHeadersAt),server_total_ms:data.server_total_ms??null,backend_version:String(data.version||''),backend_latency:data.latency_breakdown||null};console.info('Pocket AI request timing',state.lastRequestTimings);if(data.error_code==='AI_QUOTA_EXCEEDED'){const quotaError=new Error(data.error||'Daily AI quota exceeded.');quotaError.code='AI_QUOTA_EXCEEDED';throw quotaError;}if(!response.ok||data.status!=='success'||typeof data.reply!=='string'||!data.reply.trim())throw new Error(data.error||data.message||('Serverul nu a returnat un răspuns utilizabil (HTTP '+response.status+').'));if(data.place_lookup)console.info('Pocket AI destination lookup',JSON.stringify(data.place_lookup));const reply=String(data.reply).trim();state.lastStructuredResponse=data.structured_list?{reply,list:data.structured_list,sources:data.sources||[]}:null;
if(data.structured_list?.type==='news'&&Array.isArray(data.structured_list.rows))
 state.newsConversationContext={type:'news',selected_index:null,rows:data.structured_list.rows.slice(0,12).map(row=>({
  title:String(row.title||'').slice(0,240),url:String(row.url||'').slice(0,700),
  source_name:String(row.source_name||'').slice(0,90),published_at:String(row.published_at||'').slice(0,40),
  summary:String(row.summary||'').slice(0,500)
 }))};
if(data.news_followup&&state.newsConversationContext&&Number.isInteger(data.news_followup.selected_index))
 state.newsConversationContext.selected_index=data.news_followup.selected_index;state.lastPresentationResponse=data.presentation?{reply,plan:data.presentation}:null;loading.remove();if(generation!==state.conversationGeneration||(state.currentView!=='assistant'&&state.currentView!=='module'))return;state.placeSearchContext=data.place_context||null;state.distanceSearchContext=data.distance_context||null;state.routeSearchContext=data.route_context||null;state.pendingTravelConfirmationData=data.needs_travel_confirmation&&data.route_context?.destination?data:null;state.travelConfirmationPanel=null;state.weatherSearchContext=data.weather_context||null;if(Array.isArray(data.places))state.lastPlaceResults=data.places;if(Array.isArray(data.places)&&data.places.length&&(state.tripAccommodationSearching||/\\b(?:cazare|hoteluri|hotel|hostel|motel|pensiuni|accommodation|lodging|guesthouse|airbnb)\\b/i.test(message))){state.tripAccommodationSearching=false;openAccommodationResults(data.places);state.messages.push({role:'assistant',text:reply});state.lastReply=reply;setStatus('Răspuns primit.');return;}if(data.encyclopedia){openEncyclopediaCard(selectedGeographicEntity?{...data.encyclopedia,selected_geo_option:selectedGeographicEntity}:data.encyclopedia,clientRequestStartedAt);state.messages.push({role:'assistant',text:reply});state.lastReply=reply;setStatus('Răspuns primit.');return;}/* Accommodation is decided once, before route calculation; never offer it again after receiving a route. *//* Keep the answer in the user's current section; provider selection remains backend-driven. */if(data.needs_travel_mode)state.lastTravelModeResponse=data;if(Array.isArray(data.transit)&&data.transit.length)state.lastTransitResponse=data;const weatherSummary=reply;const answerBubble=addBubble(weatherSummary,'assistant',false,{autoOpen:!(data.needs_travel_mode||data.needs_destination_clarification||data.needs_location_clarification||data.weather_ok)});if(data.weather_ok&&data.weather){const weather=data.weather,host=document.createElement('div'),narrative=document.createElement('div'),toggle=document.createElement('button'),hourly=document.createElement('div'),grid=document.createElement('div');host.style.cssText='display:flex;flex-direction:column;gap:12px';narrative.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55';narrative.textContent=weatherSummary;toggle.type='button';toggle.className='transit-choice-action';toggle.style.cssText='min-height:52px;touch-action:manipulation;cursor:pointer;text-align:center';toggle.textContent=dialogText('🌦️ Vezi prognoza pe ore','🌦️ View hourly forecast');hourly.hidden=true;hourly.style.cssText='max-height:55vh;overflow-y:auto';const location=document.createElement('p');location.textContent=String(weather.location||'')+' · '+String(weather.date||'')+' ('+String(weather.timezone||'')+')';hourly.append(location);grid.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px';const icon=code=>code===0?'☀️':code<=3?'⛅':code===45||code===48?'🌫️':code>=51&&code<=67?'🌧️':code>=71&&code<=77?'❄️':code>=80&&code<=82?'🌦️':code>=95?'⛈️':'☁️';for(const h of weather.hourly||[]){const cell=document.createElement('div'),label=document.createElement('div'),precip=document.createElement('div');cell.style.cssText='border:1px solid #53798b;border-radius:10px;padding:10px;text-align:center';label.textContent=h.time+' '+icon(h.weather_code)+' '+Math.round(h.temperature)+'°C';precip.textContent='💧 '+(h.precipitation_probability??'—')+'% · '+(h.precipitation_mm??'—')+' mm';cell.append(label,precip);grid.append(cell)}hourly.append(grid);toggle.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const opening=hourly.hidden;hourly.hidden=!opening;narrative.hidden=opening;toggle.textContent=opening?dialogText('← Înapoi la rezumat','← Back to summary'):dialogText('🌦️ Vezi prognoza pe ore','🌦️ View hourly forecast');const body=host.closest('.answer-reader-body');if(body)body.scrollTop=0});host.append(narrative,toggle,hourly);answerBubble.remove();openStandaloneChoicePanel(host,dialogText('Prognoză meteo','Weather forecast'),{keepOpen:true});}if(data.weather_choices?.length){answerBubble.remove();openPocketSelectionPanel(data.weather_choices,dialogText('Alege localitatea pentru prognoză','Choose a forecast location'),option=>{closeLongChoice();inputEl.value=String(option.number);submitMessage()})}showAnswerDuration(answerBubble,clientRequestStartedAt);if(routeDestination?.approximation&&validMapRoute(data.route))routeApproximationNotices.set(data.route,routeDestination.approximation);retainRouteResult(data,answerBubble);
 if(Array.isArray(data.transit)&&data.transit.length&&state.navigationReturnContext){answerBubble.remove();showTransitChoices(data.transit)}else appendTransitChoiceAction(data,answerBubble);
 if(state.tripCountryOnChoice&&Array.isArray(data.destination_candidates)&&data.destination_candidates.length){
  const country=String(state.tripCountryOnChoice).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const countryTerms=/fran|france/i.test(country)?/france|franța|franta/i:/romani/i.test(country)?/romania|românia/i:null;
  if(countryTerms){
   const candidates=data.destination_candidates.filter(x=>countryTerms.test(String(x.country||'')+' '+String(x.label||'')));
   if(candidates.length)data.destination_candidates=candidates;
   if(candidates.length===1&&Number.isFinite(Number(candidates[0].latitude))&&Number.isFinite(Number(candidates[0].longitude))){
    const only=candidates[0];state.tripCountryOnChoice=null;
    offerDestinationAccommodationBeforeRoute({latitude:Number(only.latitude),longitude:Number(only.longitude),label:String(only.label)});
    state.messages.push({role:'assistant',text:reply});state.lastReply=reply;setStatus('Destinație verificată.');return;
   }
  }
  // Preserve country journey origin until a destination is selected.
 }
 const directCountryArrival=state.tripCountryOnChoice&&data.needs_travel_mode&&data.route_context?.destination
  &&(!Array.isArray(data.destination_candidates)||data.destination_candidates.length===0)
  &&(!Array.isArray(data.choice_options)||data.choice_options.length===0);
 if(directCountryArrival){
  const destination=data.route_context.destination;
  state.tripCountryOnChoice=null;
  if(offerDestinationAccommodationBeforeRoute(destination)){
   answerBubble.remove();state.messages.push({role:'assistant',text:reply});state.lastReply=reply;setStatus('Destinație confirmată.');return;
  }
 }
 const standaloneChoice=Boolean(data.needs_travel_mode||data.needs_destination_clarification||data.needs_location_clarification||(Array.isArray(data.choice_options)&&data.choice_options.length)||(Array.isArray(data.destination_candidates)&&data.destination_candidates.length));
 if(standaloneChoice){
  const choiceHost=document.createElement('div');choiceHost.dataset.directChoices='true';
  const countryNeedsSelection=Boolean(state.tripCountryOnChoice&&((Array.isArray(data.destination_candidates)&&data.destination_candidates.length)||(Array.isArray(data.choice_options)&&data.choice_options.length)));
  const choicesAdded=Boolean((countryNeedsSelection?false:appendTravelModeChoices(data,choiceHost))|appendConversationChoices(data,choiceHost));
  if(choicesAdded&&choiceHost.querySelector('button')){answerBubble.remove();openStandaloneChoicePanel(choiceHost,dialogText("Alege o opțiune","Choose an option"))}
  else{appendTravelConfirmation(data,answerBubble)}
 }else{appendTravelModeChoices(data,answerBubble);appendTravelConfirmation(data,answerBubble);appendConversationChoices(data,answerBubble)}state.messages.push({role:'assistant',text:reply});state.lastReply=reply;state.messages=state.messages.slice(-40);setStatus('Răspuns primit.');if(state.voiceMode||fromVoice){speakText(reply,{continuous:state.voiceMode})}else if(state.messages.length===2){/* first reply only: text remains the default */}}catch(error){loading.remove();console.warn('Pocket AI request failed timing',{total_ms:Math.round(performance.now()-clientRequestStartedAt),gps_ms:typeof gpsElapsedMs==='number'?gpsElapsedMs:null,api_elapsed_ms:typeof backendRequestStartedAt==='number'?Math.round(performance.now()-backendRequestStartedAt):null,stage:typeof backendRequestStartedAt==='number'?'api_or_read':'gps_or_preflight'});if(generation===state.conversationGeneration&&(state.currentView==='assistant'||state.currentView==='module')){const messageText=String(error?.message||'Eroare necunoscută.');
  const transportError=/failed to fetch|networkerror|network request failed|load failed/i.test(messageText);
  const reason=error?.code==='AI_QUOTA_EXCEEDED'?messageText:transportError
   ? (dialogText("Conexiunea cu serverul a fost întreruptă. Răspunsul nu a ajuns la aplicație.","The connection to the server was interrupted. The reply did not reach the app."))
   : (dialogText("Nu am putut obține un răspuns. ","Unable to get a response. "))+messageText;
  const bubble=addBubble(reason,'assistant',true,{autoOpen:false});
  if(transportError){
   const retry=document.createElement('button');retry.type='button';retry.className='transit-choice-action';
   retry.textContent=dialogText("Reîncearcă întrebarea","Retry the question");
   retry.style.cssText='margin-top:10px;max-width:100%;';
   retry.onclick=()=>{if(state.busy)return;retry.disabled=true;inputEl.value=message;submitMessage()};
   bubble.append(retry);
  }
  setStatus(dialogText("Cererea nu a reușit.","Request failed."));
  console.error('myPocket AI chat request failed:',{type:String(error?.name||'Error'),networkError:transportError,detail:messageText.slice(0,160)})}}finally{state.busy=false;sendBtn.disabled=false;inputEl.disabled=false;/* Do not reopen Android keyboard after button-only flows. Text entry gets focus only on an explicit tap. */inputEl.blur()}}
$('chatForm').addEventListener('submit',event=>{event.preventDefault();submitMessage()});inputEl.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();$('chatForm').requestSubmit()}});inputEl.addEventListener('input',()=>{inputEl.style.height='auto';inputEl.style.height=Math.min(inputEl.scrollHeight,130)+'px'});
$('newChatBtn').addEventListener('click',()=>{if(state.busy){notify('Așteaptă să se termine răspunsul curent.');return}archiveCurrentConversation();resetChat();void 0});
// 08 — Navigation and module entry points; v1.0.24 quick searches stay inside the selected module
for(const button of document.querySelectorAll('[data-module]'))button.addEventListener('click',()=>openModule(button.dataset.module));
for(const button of document.querySelectorAll('[data-nav]'))button.addEventListener('click',()=>{const name=button.dataset.nav;closeRouteMap(false);closeAnswerReader(false);closeLongChoice();showView(name)});
for(const button of document.querySelectorAll('[data-back]'))button.addEventListener('click',()=>showView('home'));
$('askModuleBtn').addEventListener('click',()=>{if(state.currentView!=='module')return;/* Text entry stays unfocused until the input itself is tapped. */setStatus('Scrie întrebarea în conversația modulului selectat.');});
$('moduleQuickTrigger').addEventListener('click',openModuleQuickLayer);
$('moduleLayerBack').addEventListener('click',handleModuleLayerBack);
$('toolsList').innerHTML='';$('toolsList').classList.add('tools-card-grid');const quickTools=[{icon:'💡',label:'Generează idei',detail:'Brainstorming pentru o problemă sau un proiect.',prompt:'Ajută-mă să generez idei pentru o problemă sau un proiect.'},{icon:'📝',label:'Redactare',detail:'Mesaje, scrisori și texte.',prompt:'Ajută-mă să redactez un text. Întreabă-mă ce tip de text și ce ton doresc.'},{icon:'🔎',label:'Compară opțiuni',detail:'Compară avantaje și dezavantaje.',prompt:'Ajută-mă să compar opțiuni, cu avantaje și dezavantaje. Întreabă-mă ce opțiuni compar.'},{icon:'📄',label:'Explică un document',detail:'Ajută-mă să înțeleg un text.',prompt:'Ajută-mă să înțeleg un document sau un text. Cere-mi să trimit textul ori documentul.'},{icon:'🧠',label:'Rezolvă o problemă',detail:'Găsește pași practici de rezolvare.',prompt:'Ajută-mă să rezolv o problemă, pas cu pas. Întreabă-mă despre situație.'},{icon:'🌐',label:'Caută informații',detail:'Formulează o cerere de cercetare.',prompt:'Ajută-mă să cercetez un subiect și să formulez o cerere de căutare clară.'}];const localizedTools={"en": [["Generate ideas", "Brainstorm a problem or project."], ["Writing", "Messages, letters and texts."], ["Compare options", "Compare advantages and disadvantages."], ["Explain a document", "Help me understand a text."], ["Solve a problem", "Find practical steps to solve it."], ["Research information", "Formulate a research question."]], "de": [["Ideen entwickeln", "Brainstorming für ein Problem oder Projekt."], ["Texte schreiben", "Nachrichten, Briefe und Texte."], ["Optionen vergleichen", "Vor- und Nachteile vergleichen."], ["Dokument erklären", "Hilf mir, einen Text zu verstehen."], ["Problem lösen", "Praktische Lösungsschritte finden."], ["Informationen suchen", "Eine Recherchefrage formulieren."]], "fr": [["Générer des idées", "Réfléchir à un problème ou un projet."], ["Rédaction", "Messages, lettres et textes."], ["Comparer des options", "Comparer les avantages et les inconvénients."], ["Expliquer un document", "M’aider à comprendre un texte."], ["Résoudre un problème", "Trouver des étapes pratiques."], ["Rechercher des informations", "Formuler une recherche."]], "it": [["Genera idee", "Idee per un problema o progetto."], ["Scrittura", "Messaggi, lettere e testi."], ["Confronta opzioni", "Confronta vantaggi e svantaggi."], ["Spiega un documento", "Aiutami a capire un testo."], ["Risolvi un problema", "Trova soluzioni pratiche."], ["Cerca informazioni", "Formula una ricerca."]], "es": [["Generar ideas", "Ideas para un problema o proyecto."], ["Redacción", "Mensajes, cartas y textos."], ["Comparar opciones", "Compara ventajas y desventajas."], ["Explicar un documento", "Ayúdame a entender un texto."], ["Resolver un problema", "Encuentra pasos prácticos."], ["Buscar información", "Formula una consulta de investigación."]], "pt": [["Gerar ideias", "Ideias para um problema ou projeto."], ["Redação", "Mensagens, cartas e textos."], ["Comparar opções", "Compara vantagens e desvantagens."], ["Explicar um documento", "Ajuda-me a compreender um texto."], ["Resolver um problema", "Encontra passos práticos."], ["Pesquisar informações", "Formula uma pesquisa."]], "nl": [["Ideeën bedenken", "Brainstorm over een probleem of project."], ["Schrijven", "Berichten, brieven en teksten."], ["Opties vergelijken", "Vergelijk voor- en nadelen."], ["Document uitleggen", "Help me een tekst te begrijpen."], ["Probleem oplossen", "Vind praktische stappen."], ["Informatie zoeken", "Formuleer een onderzoeksvraag."]], "ru": [["Предложить идеи", "Идеи для задачи или проекта."], ["Написать текст", "Сообщения, письма и тексты."], ["Сравнить варианты", "Сравнить плюсы и минусы."], ["Объяснить документ", "Помочь понять текст."], ["Решить проблему", "Найти практические шаги."], ["Найти информацию", "Сформулировать поисковый запрос."]], "pl": [["Generuj pomysły", "Pomysły na problem lub projekt."], ["Pisanie", "Wiadomości, listy i teksty."], ["Porównaj opcje", "Porównaj zalety i wady."], ["Wyjaśnij dokument", "Pomóż mi zrozumieć tekst."], ["Rozwiąż problem", "Znajdź praktyczne kroki."], ["Szukaj informacji", "Sformułuj zapytanie badawcze."]]};const originalToolLabels=quickTools.map(t=>[t.label,t.detail]);function refreshToolTranslations(){for(const [idx,tool] of quickTools.entries()){const localized=localizedTools[state.language]?.[idx]||originalToolLabels[idx];const card=$('toolsList').children[idx];if(card){card.querySelector('strong').textContent=localized[0];card.querySelectorAll('span')[1].textContent=localized[1]}}}for(const [idx,tool] of quickTools.entries()){const localized=localizedTools[state.language]?.[idx];if(localized){tool.label=localized[0];tool.detail=localized[1]}}for(const tool of quickTools){const btn=document.createElement('button');btn.type='button';btn.className='tools-action-card';const icon=document.createElement('span');icon.className='tools-card-icon';icon.textContent=tool.icon;const label=document.createElement('strong');label.textContent=tool.label;const detail=document.createElement('span');detail.textContent=tool.detail;btn.append(icon,label,detail);btn.addEventListener('click',()=>{if(state.busy){notify('Așteaptă să se termine răspunsul curent.');return}showView('assistant');inputEl.value=tool.prompt;/* Text entry stays unfocused until the input itself is tapped. */inputEl.dispatchEvent(new Event('input',{bubbles:true}));});$('toolsList').append(btn)}
window.__pocketToolsReady=true;refreshToolTranslations();
pocketVoiceHelp('assistant',document.querySelector('#view-assistant .section-title'));
$('clearHistoryBtn').addEventListener('click',()=>{
 if(!state.history.length){notify('Istoricul este deja gol.');return}
 pocketConfirm(learningLabel('Ștergi toate conversațiile salvate pe acest dispozitiv?','Delete all conversations saved on this device?'),()=>{
  state.history=[];try{localStorage.removeItem(HISTORY_KEY)}catch{}renderHistory();notify(learningLabel('Istoricul local a fost șters.','Local history deleted.'));
 });
});
const UI_TEXT={
 ro:{subtitle:'Asistentul tău personal pentru orice zi',homeTitle:'Cu ce te pot ajuta?',homeLead:'Alege unul dintre instrumentele myPocket AI.',cards:[['Asistent AI','Întrebări, răspunsuri, traduceri, calcule și redactare.'],['Călătorii și turism','Locuri de vizitat, itinerarii și idei de cazare.'],['Hărți și transport','Rute pietonale și informații despre transportul în comun.'],['Învățare și educație','Matematică, limbi străine și explicații pas cu pas.'],['Organizare personală','Liste, bugete, proiecte și obiective.'],['Mai multe instrumente','Analiză, idei, documente și multe altele.']],home:'Acasă',conversations:'Conversații',tools:'Instrumente',settings:'Setări',back:'← Acasă',newChat:'＋ Conversație nouă',quick:'☰ Selecții rapide',conversation:'Conversație',empty:'Cu ce te pot ajuta?',emptyHint:'Scrie o întrebare în română sau engleză.',ready:'Gata de conversație.',moduleTitle:{travel:'Hoteluri și POI',maps:'Hărți și trasee',learning:'Învățare și educație',organize:'Organizare personală',tools:'Mai multe instrumente'},settingsLanguage:'Limba conversației',settingsLanguageHint:'Limba folosită pentru solicitările către asistent.',speechHint:'Recunoașterea vorbirii și vocile disponibile depind de browserul și dispozitivul folosit.',about:'Despre aplicație',localHistory:'Istoricul salvat pe acest dispozitiv.',clearHistory:'Șterge istoricul',chooseDomain:'Alege un domeniu pentru a începe.',quickTitle:'Selecții rapide',send:'Trimite mesajul',dictation:'Dictare vocală',voice:'Conversație vocală',listen:'Ascultă ultimul răspuns'},
 en:{subtitle:'Your personal assistant for every day',homeTitle:'How can I help you?',homeLead:'Choose one of your myPocket AI tools.',cards:[['AI Assistant','Questions, answers, translations, calculations and writing.'],['Travel and tourism','Places to visit, itineraries and accommodation ideas.'],['Maps and transport','Walking routes and public transport information.'],['Learning and education','Maths, languages and step-by-step explanations.'],['Personal organisation','Lists, budgets, projects and goals.'],['More tools','Analysis, ideas, documents and more.']],home:'Home',conversations:'Conversations',tools:'Tools',settings:'Settings',back:'← Home',newChat:'＋ New conversation',quick:'☰ Quick options',conversation:'Conversation',empty:'How can I help you?',emptyHint:'Type a question in English or Romanian.',ready:'Ready to chat.',moduleTitle:{travel:'Hotels and places',maps:'Maps and routes',learning:'Learning and education',organize:'Personal organisation',tools:'More tools'},settingsLanguage:'Conversation language',settingsLanguageHint:'Language used for requests to the assistant.',speechHint:'Speech recognition and available voices depend on your browser and device.',about:'About the app',localHistory:'History saved on this device.',clearHistory:'Clear history',chooseDomain:'Choose a topic to get started.',quickTitle:'Quick options',send:'Send message',dictation:'Voice dictation',voice:'Voice conversation',listen:'Listen to the latest reply'},
 fr:{subtitle:'Votre assistant personnel au quotidien',homeTitle:'Comment puis-je vous aider ?',homeLead:'Choisissez un outil myPocket AI.',cards:[['Assistant IA','Questions, réponses, traductions, calculs et rédaction.'],['Voyages et tourisme','Lieux à visiter, itinéraires et hébergements.'],['Cartes et transports','Itinéraires à pied et transports en commun.'],['Apprentissage et éducation','Maths, langues et explications étape par étape.'],['Organisation personnelle','Listes, budgets, projets et objectifs.'],['Autres outils','Analyses, idées, documents et plus encore.']],home:'Accueil',conversations:'Conversations',tools:'Outils',settings:'Paramètres',back:'← Accueil',newChat:'＋ Nouvelle conversation',quick:'☰ Options rapides',conversation:'Conversation',empty:'Comment puis-je vous aider ?',emptyHint:'Saisissez une question en français.',ready:'Prêt à discuter.',moduleTitle:{travel:'Hôtels et lieux',maps:'Cartes et itinéraires',learning:'Apprentissage et éducation',organize:'Organisation personnelle',tools:'Autres outils'},settingsLanguage:'Langue de conversation',settingsLanguageHint:'Langue utilisée pour les demandes à l’assistant.',speechHint:'La reconnaissance vocale dépend du navigateur et de l’appareil.',about:'À propos',localHistory:'Historique enregistré sur cet appareil.',clearHistory:'Effacer l’historique',chooseDomain:'Choisissez un domaine pour commencer.',quickTitle:'Options rapides',send:'Envoyer',dictation:'Dictée vocale',voice:'Conversation vocale',listen:'Écouter la dernière réponse'},
 de:{subtitle:'Dein persönlicher Assistent für jeden Tag',homeTitle:'Wie kann ich dir helfen?',homeLead:'Wähle ein myPocket-AI-Werkzeug.',cards:[['KI-Assistent','Fragen, Antworten, Übersetzungen, Berechnungen und Texte.'],['Reisen und Tourismus','Sehenswürdigkeiten, Reiserouten und Unterkünfte.'],['Karten und Verkehr','Fußwege und Informationen zum öffentlichen Verkehr.'],['Lernen und Bildung','Mathematik, Sprachen und Schritt-für-Schritt-Erklärungen.'],['Persönliche Organisation','Listen, Budgets, Projekte und Ziele.'],['Weitere Werkzeuge','Analysen, Ideen, Dokumente und mehr.']],home:'Startseite',conversations:'Gespräche',tools:'Werkzeuge',settings:'Einstellungen',back:'← Startseite',newChat:'＋ Neues Gespräch',quick:'☰ Schnelloptionen',conversation:'Gespräch',empty:'Wie kann ich dir helfen?',emptyHint:'Gib eine Frage auf Deutsch ein.',ready:'Bereit zum Chatten.',moduleTitle:{travel:'Hotels und Orte',maps:'Karten und Routen',learning:'Lernen und Bildung',organize:'Persönliche Organisation',tools:'Weitere Werkzeuge'},settingsLanguage:'Gesprächssprache',settingsLanguageHint:'Sprache für Anfragen an den Assistenten.',speechHint:'Spracherkennung und Stimmen hängen von Browser und Gerät ab.',about:'Über die App',localHistory:'Auf diesem Gerät gespeicherter Verlauf.',clearHistory:'Verlauf löschen',chooseDomain:'Wähle einen Bereich aus.',quickTitle:'Schnelloptionen',send:'Nachricht senden',dictation:'Spracheingabe',voice:'Sprachgespräch',listen:'Letzte Antwort anhören'},
 it:{subtitle:'Il tuo assistente personale ogni giorno',homeTitle:'Come posso aiutarti?',homeLead:'Scegli uno strumento myPocket AI.',cards:[['Assistente AI','Domande, risposte, traduzioni, calcoli e scrittura.'],['Viaggi e turismo','Luoghi da visitare, itinerari e idee per alloggiare.'],['Mappe e trasporti','Percorsi a piedi e informazioni sui mezzi pubblici.'],['Apprendimento e istruzione','Matematica, lingue e spiegazioni passo dopo passo.'],['Organizzazione personale','Elenchi, budget, progetti e obiettivi.'],['Altri strumenti','Analisi, idee, documenti e altro.']],home:'Casa',conversations:'Conversazioni',tools:'Strumenti',settings:'Impostazioni',back:'← Casa',newChat:'＋ Nuova conversazione',quick:'☰ Opzioni rapide',conversation:'Conversazione',empty:'Come posso aiutarti?',emptyHint:'Scrivi una domanda in italiano.',ready:'Pronto a parlare.',moduleTitle:{travel:'Hotel e luoghi',maps:'Mappe e percorsi',learning:'Apprendimento e istruzione',organize:'Organizzazione personale',tools:'Altri strumenti'},settingsLanguage:'Lingua della conversazione',settingsLanguageHint:'Lingua usata per le richieste all’assistente.',speechHint:'Il riconoscimento vocale dipende dal browser e dal dispositivo.',about:'Informazioni sull’app',localHistory:'Cronologia salvata su questo dispositivo.',clearHistory:'Cancella cronologia',chooseDomain:'Scegli un argomento per iniziare.',quickTitle:'Opzioni rapide',send:'Invia messaggio',dictation:'Dettatura vocale',voice:'Conversazione vocale',listen:'Ascolta l’ultima risposta'},
 es:{subtitle:'Tu asistente personal para cada día',homeTitle:'¿En qué puedo ayudarte?',homeLead:'Elige una herramienta de myPocket AI.',cards:[['Asistente IA','Preguntas, respuestas, traducciones, cálculos y redacción.'],['Viajes y turismo','Lugares para visitar, itinerarios y alojamientos.'],['Mapas y transporte','Rutas a pie e información sobre transporte público.'],['Aprendizaje y educación','Matemáticas, idiomas y explicaciones paso a paso.'],['Organización personal','Listas, presupuestos, proyectos y objetivos.'],['Más herramientas','Análisis, ideas, documentos y mucho más.']],home:'Inicio',conversations:'Conversaciones',tools:'Herramientas',settings:'Ajustes',back:'← Inicio',newChat:'＋ Nueva conversación',quick:'☰ Opciones rápidas',conversation:'Conversación',empty:'¿En qué puedo ayudarte?',emptyHint:'Escribe una pregunta en español.',ready:'Listo para conversar.',moduleTitle:{travel:'Hoteles y lugares',maps:'Mapas y rutas',learning:'Aprendizaje y educación',organize:'Organización personal',tools:'Más herramientas'},settingsLanguage:'Idioma de conversación',settingsLanguageHint:'Idioma usado para las solicitudes al asistente.',speechHint:'El reconocimiento de voz depende del navegador y del dispositivo.',about:'Acerca de la aplicación',localHistory:'Historial guardado en este dispositivo.',clearHistory:'Borrar historial',chooseDomain:'Elige un tema para empezar.',quickTitle:'Opciones rápidas',send:'Enviar mensaje',dictation:'Dictado por voz',voice:'Conversación por voz',listen:'Escuchar la última respuesta'},
 pt:{subtitle:'O teu assistente pessoal para todos os dias',homeTitle:'Como posso ajudar?',homeLead:'Escolhe uma ferramenta myPocket AI.',cards:[['Assistente IA','Perguntas, respostas, traduções, cálculos e escrita.'],['Viagens e turismo','Locais a visitar, itinerários e alojamento.'],['Mapas e transportes','Percursos a pé e informações sobre transportes públicos.'],['Aprendizagem e educação','Matemática, línguas e explicações passo a passo.'],['Organização pessoal','Listas, orçamentos, projetos e objetivos.'],['Mais ferramentas','Análise, ideias, documentos e muito mais.']],home:'Início',conversations:'Conversas',tools:'Ferramentas',settings:'Definições',back:'← Início',newChat:'＋ Nova conversa',quick:'☰ Opções rápidas',conversation:'Conversa',empty:'Como posso ajudar?',emptyHint:'Escreve uma pergunta em português.',ready:'Pronto para conversar.',moduleTitle:{travel:'Hotéis e locais',maps:'Mapas e percursos',learning:'Aprendizagem e educação',organize:'Organização pessoal',tools:'Mais ferramentas'},settingsLanguage:'Idioma da conversa',settingsLanguageHint:'Idioma usado nos pedidos ao assistente.',speechHint:'O reconhecimento de voz depende do navegador e do dispositivo.',about:'Sobre a aplicação',localHistory:'Histórico guardado neste dispositivo.',clearHistory:'Limpar histórico',chooseDomain:'Escolhe um tema para começar.',quickTitle:'Opções rápidas',send:'Enviar mensagem',dictation:'Ditado por voz',voice:'Conversa por voz',listen:'Ouvir a última resposta'},
 nl:{subtitle:'Je persoonlijke assistent voor elke dag',homeTitle:'Waarmee kan ik je helpen?',homeLead:'Kies een myPocket AI-hulpmiddel.',cards:[['AI-assistent','Vragen, antwoorden, vertalingen, berekeningen en schrijven.'],['Reizen en toerisme','Bezienswaardigheden, routes en accommodaties.'],['Kaarten en vervoer','Wandelroutes en informatie over openbaar vervoer.'],['Leren en onderwijs','Wiskunde, talen en uitleg stap voor stap.'],['Persoonlijke organisatie','Lijsten, budgetten, projecten en doelen.'],['Meer hulpmiddelen','Analyse, ideeën, documenten en meer.']],home:'Start',conversations:'Gesprekken',tools:'Hulpmiddelen',settings:'Instellingen',back:'← Start',newChat:'＋ Nieuw gesprek',quick:'☰ Snelle opties',conversation:'Gesprek',empty:'Waarmee kan ik je helpen?',emptyHint:'Typ een vraag in het Nederlands.',ready:'Klaar om te chatten.',moduleTitle:{travel:'Hotels en locaties',maps:'Kaarten en routes',learning:'Leren en onderwijs',organize:'Persoonlijke organisatie',tools:'Meer hulpmiddelen'},settingsLanguage:'Gesprekstaal',settingsLanguageHint:'Taal voor verzoeken aan de assistent.',speechHint:'Spraakherkenning hangt af van browser en apparaat.',about:'Over de app',localHistory:'Geschiedenis opgeslagen op dit apparaat.',clearHistory:'Geschiedenis wissen',chooseDomain:'Kies een onderwerp om te beginnen.',quickTitle:'Snelle opties',send:'Bericht verzenden',dictation:'Spraakdicteren',voice:'Gesproken gesprek',listen:'Laatste antwoord beluisteren'},
 ru:{subtitle:"Ваш личный помощник на каждый день",homeTitle:"Чем я могу помочь?",homeLead:"Выберите инструмент myPocket AI.",cards:[["ИИ-помощник","Вопросы, ответы, переводы, вычисления и тексты."],["Путешествия и туризм","Достопримечательности, маршруты и жильё."],["Карты и транспорт","Пешие маршруты и общественный транспорт."],["Обучение","Математика, языки и пошаговые объяснения."],["Личные дела","Списки, бюджеты, проекты и цели."],["Другие инструменты","Анализ, идеи, документы и многое другое."]],home:"Главная",conversations:"Диалоги",tools:"Инструменты",settings:"Настройки",back:"← Главная",newChat:"＋ Новый диалог",quick:"☰ Быстрый выбор",conversation:"Диалог",empty:"Чем я могу помочь?",emptyHint:"Напишите вопрос по-русски.",ready:"Готов к общению.",moduleTitle:{travel:"Отели и места",maps:"Карты и маршруты",learning:"Обучение",organize:"Личные дела",tools:"Другие инструменты"},settingsLanguage:"Язык общения",settingsLanguageHint:"Язык запросов к помощнику.",speechHint:"Распознавание речи и доступные голоса зависят от браузера и устройства.",about:"О приложении",localHistory:"История хранится на этом устройстве.",clearHistory:"Очистить историю",chooseDomain:"Выберите тему для начала.",quickTitle:"Быстрый выбор",send:"Отправить сообщение",dictation:"Голосовой ввод",voice:"Голосовой разговор",listen:"Прослушать последний ответ"},
 pl:{subtitle:"Twój osobisty asystent na co dzień",homeTitle:"W czym mogę pomóc?",homeLead:"Wybierz narzędzie myPocket AI.",cards:[["Asystent AI","Pytania, odpowiedzi, tłumaczenia, obliczenia i pisanie."],["Podróże i turystyka","Atrakcje, trasy i pomysły na noclegi."],["Mapy i transport","Trasy piesze i transport publiczny."],["Nauka i edukacja","Matematyka, języki i wyjaśnienia krok po kroku."],["Organizacja osobista","Listy, budżety, projekty i cele."],["Więcej narzędzi","Analizy, pomysły, dokumenty i nie tylko."]],home:"Start",conversations:"Rozmowy",tools:"Narzędzia",settings:"Ustawienia",back:"← Start",newChat:"＋ Nowa rozmowa",quick:"☰ Szybki wybór",conversation:"Rozmowa",empty:"W czym mogę pomóc?",emptyHint:"Napisz pytanie po polsku.",ready:"Gotowy do rozmowy.",moduleTitle:{travel:"Hotele i miejsca",maps:"Mapy i trasy",learning:"Nauka i edukacja",organize:"Organizacja osobista",tools:"Więcej narzędzi"},settingsLanguage:"Język rozmowy",settingsLanguageHint:"Język zapytań do asystenta.",speechHint:"Rozpoznawanie mowy i dostępne głosy zależą od przeglądarki i urządzenia.",about:"O aplikacji",localHistory:"Historia jest zapisana na tym urządzeniu.",clearHistory:"Wyczyść historię",chooseDomain:"Wybierz temat na początek.",quickTitle:"Szybki wybór",send:"Wyślij wiadomość",dictation:"Dyktowanie głosowe",voice:"Rozmowa głosowa",listen:"Odtwórz ostatnią odpowiedź"}
};
function localizedModuleLead(key){const lang=state.language;const leads={
ro:{travel:'Caută hoteluri, restaurante și alte puncte de interes din apropiere.',maps:'Planifică trasee și consultă informații despre transportul în comun.',learning:'Învață pas cu pas, exersează limbi și cere explicații clare.',organize:'Organizează liste, bugete, proiecte și obiective.',tools:'Spațiu pentru analiză, idei, documente și instrumente suplimentare.'},
en:{travel:'Find hotels, restaurants and other places nearby.',maps:'Plan routes and check public transport information.',learning:'Learn step by step, practise languages and get clear explanations.',organize:'Organise lists, budgets, projects and goals.',tools:'Explore analysis, ideas, documents and additional tools.'},
fr:{travel:'Trouvez des hôtels, restaurants et autres lieux à proximité.',maps:'Planifiez des itinéraires et consultez les transports en commun.',learning:'Apprenez étape par étape et obtenez des explications claires.',organize:'Organisez vos listes, budgets, projets et objectifs.',tools:'Explorez des analyses, idées, documents et outils supplémentaires.'},
de:{travel:'Finde Hotels, Restaurants und andere Orte in der Nähe.',maps:'Plane Routen und informiere dich über öffentliche Verkehrsmittel.',learning:'Lerne Schritt für Schritt und erhalte klare Erklärungen.',organize:'Organisiere Listen, Budgets, Projekte und Ziele.',tools:'Entdecke Analysen, Ideen, Dokumente und weitere Werkzeuge.'},
it:{travel:'Trova hotel, ristoranti e altri luoghi nelle vicinanze.',maps:'Pianifica percorsi e consulta informazioni sui mezzi pubblici.',learning:'Impara passo dopo passo e ricevi spiegazioni chiare.',organize:'Organizza elenchi, budget, progetti e obiettivi.',tools:'Scopri analisi, idee, documenti e strumenti aggiuntivi.'},
es:{travel:'Encuentra hoteles, restaurantes y otros lugares cercanos.',maps:'Planifica rutas y consulta información sobre transporte público.',learning:'Aprende paso a paso y recibe explicaciones claras.',organize:'Organiza listas, presupuestos, proyectos y objetivos.',tools:'Explora análisis, ideas, documentos y herramientas adicionales.'},
pt:{travel:'Encontra hotéis, restaurantes e outros locais nas proximidades.',maps:'Planeia percursos e consulta informações sobre transportes públicos.',learning:'Aprende passo a passo e recebe explicações claras.',organize:'Organiza listas, orçamentos, projetos e objetivos.',tools:'Explora análises, ideias, documentos e ferramentas adicionais.'},
ru:{travel:'Найдите отели, рестораны и другие места поблизости.',maps:'Планируйте маршруты и проверяйте общественный транспорт.',learning:'Учитесь шаг за шагом и получайте понятные объяснения.',organize:'Ведите списки, бюджеты, проекты и цели.',tools:'Изучайте анализ, идеи, документы и другие инструменты.'},
pl:{travel:'Znajdź hotele, restauracje i inne miejsca w pobliżu.',maps:'Planuj trasy i sprawdzaj transport publiczny.',learning:'Ucz się krok po kroku i otrzymuj jasne wyjaśnienia.',organize:'Organizuj listy, budżety, projekty i cele.',tools:'Odkrywaj analizy, pomysły, dokumenty i dodatkowe narzędzia.'},
nl:{travel:'Vind hotels, restaurants en andere plaatsen in de buurt.',maps:'Plan routes en bekijk informatie over het openbaar vervoer.',learning:'Leer stap voor stap en krijg duidelijke uitleg.',organize:'Organiseer lijsten, budgetten, projecten en doelen.',tools:'Ontdek analyses, ideeën, documenten en extra hulpmiddelen.'}};return (leads[lang]||leads.en)[key]||MODULES[key]?.lead||''}
function applyUiLanguage(){closeAnswerReader(false);document.querySelectorAll('.answer-reader-open').forEach(b=>b.textContent=readerLabels().open);const d=UI_TEXT[state.language]||UI_TEXT.en;document.documentElement.lang=state.language;$('home-title').textContent=d.homeTitle;document.querySelector('#view-home>.lead').textContent=d.homeLead;document.querySelector('.brand-sub').textContent=d.subtitle;const plan=document.querySelector('.plan-pill');if(plan)plan.textContent=state.language==='ro'?'GRATUIT ♛':state.language==='fr'?'GRATUIT ♛':state.language==='de'?'KOSTENLOS ♛':state.language==='it'?'GRATUITO ♛':state.language==='es'?'GRATIS ♛':state.language==='pt'?'GRÁTIS ♛':state.language==='nl'?'GRATIS ♛':state.language==='ru'?'БЕСПЛАТНО ♛':state.language==='pl'?'BEZPŁATNIE ♛':'FREE ♛';document.querySelectorAll('#view-home .feature-card').forEach((card,i)=>{if(d.cards[i]){card.querySelector('.card-title').textContent=d.cards[i][0];card.querySelector('.card-description').textContent=d.cards[i][1]}});document.querySelectorAll('.bottom-nav [data-nav]').forEach(b=>{const label=b.dataset.nav==='home'?d.home:b.dataset.nav==='conversations'?d.conversations:b.dataset.nav==='tools'?d.tools:d.settings;const icon=b.querySelector('.nav-icon');b.replaceChildren(icon,document.createTextNode(label))});document.querySelectorAll('[data-back]').forEach(b=>b.textContent=d.back);$('newChatBtn').textContent=d.newChat;$('moduleQuickTrigger').textContent=d.quick;$('moduleLayerTitle').textContent=d.quickTitle;$('moduleLayerBack').textContent=state.language==='en'?'← Back':state.language==='fr'?'← Retour':state.language==='de'?'← Zurück':state.language==='it'?'← Indietro':state.language==='es'?'← Volver':state.language==='pt'?'← Voltar':state.language==='nl'?'← Terug':state.language==='ru'?'← Назад':state.language==='pl'?'← Wstecz':'← Înapoi';document.querySelector('#sharedChatShell .chat-top strong').textContent=d.conversation;const empty=messagesEl.querySelector('.empty-state');if(empty){empty.replaceChildren(document.createTextNode(d.empty));const hint=document.createElement('span');hint.className='small';hint.textContent=d.emptyHint;empty.append(document.createElement('br'),hint)}if(!state.messages.length)setStatus(d.ready);$('languageSelect').setAttribute('aria-label',d.settingsLanguage);const settings=$('view-settings');settings.querySelector('h2').textContent=d.settings;settings.querySelector('.module-panel h3').textContent=d.settingsLanguage;settings.querySelector('.module-panel p').textContent=d.settingsLanguageHint;settings.querySelector('.module-panel .small').textContent=d.speechHint;settings.querySelectorAll('.module-panel')[1].querySelector('h3').textContent=d.about;settings.querySelectorAll('.module-panel')[1].querySelectorAll('p')[1].textContent=state.language==='en'?'Local conversations can be deleted in the Conversations section.':state.language==='fr'?'Les conversations locales peuvent être supprimées dans la section Conversations.':state.language==='de'?'Lokale Gespräche können im Bereich Gespräche gelöscht werden.':state.language==='it'function chemistryElementNumberOrNull(question){
 const q=educationTheoryClean(question||'');
 const aliases={'hidrogen':1,'heliu':2,'litiu':3,'carbon':6,'azot':7,'oxigen':8,'sodiu':11,'magneziu':12,'aluminiu':13,'siliciu':14,'fosfor':15,'sulf':16,'clor':17,'potasiu':19,'calciu':20,'fier':26,'cupru':29,'zinc':30,'argint':47,'aur':79,'mercur':80,'plumb':82,'uraniu':92};
 for(const [name,n] of Object.entries(aliases))if(new RegExp('(^| )'+name+'( |$)').test(q))return n;
 const match=String(question||'').match(/(?:element(?:ul)?|atom(?:ul)?)(?:\\s+cu)?\\s+(?:Z\\s*=?\\s*|numarul atomic\\s*)?(\\d{1,3})/i);
 if(match&&+match[1]>=1&&+match[1]<=118)return +match[1];
 return null;
}
function chemistryElementNumber(question){return chemistryElementNumberOrNull(question)||6;}
?'Le conversazioni locali possono essere eliminate nella sezione Conversazioni.':state.language==='es'?'Las conversaciones locales se pueden borrar en la sección Conversaciones.':state.language==='pt'?'As conversas locais podem ser apagadas na secção Conversas.':state.language==='nl'?'Lokale gesprekken kunnen worden verwijderd in het onderdeel Gesprekken.':'Conversațiile locale pot fi șterse din secțiunea Conversații.';const conversations=$('view-conversations');conversations.querySelector('h2').textContent=d.conversations;conversations.querySelector('.section-lead').textContent=d.localHistory;$('clearHistoryBtn').textContent=d.clearHistory;const toolsView=$('view-tools');toolsView.querySelector('h2').textContent=d.tools;toolsView.querySelector('.section-lead').textContent=d.chooseDomain;if(window.__pocketToolsReady===true)refreshToolTranslations();document.querySelector('#view-assistant>.section-title').textContent=d.cards[0][0];document.querySelector('#view-assistant .section-lead').textContent=state.language==='en'?'Type or speak with myPocket AI.':state.language==='fr'?'Écrivez ou parlez avec myPocket AI.':state.language==='de'?'Schreibe oder sprich mit myPocket AI.':state.language==='it'?'Scrivi o parla con myPocket AI.':state.language==='es'?'Escribe o habla con myPocket AI.':state.language==='pt'?'Escreve ou fala com myPocket AI.':state.language==='nl'?'Typ of praat met myPocket AI.':'Scrie sau vorbește cu myPocket AI.';inputEl.setAttribute('aria-label',d.send);$('sendBtn').setAttribute('aria-label',d.send);$('dictationBtn').setAttribute('aria-label',d.dictation);$('dictationBtn').title=d.dictation;$('voiceBtn').setAttribute('aria-label',d.voice);$('voiceBtn').title=d.voice;$('listenBtn').setAttribute('aria-label',d.listen);$('listenBtn').title=d.listen;if(state.currentView==='module'){const m=MODULES[state.currentModule];if(m){$('moduleTitle').textContent=(state.currentModule==='learning'&&activeLearningSubject)?learningLabel(activeLearningSubject[2],activeLearningSubject[3]):(d.moduleTitle[state.currentModule]||m.title);$('moduleLead').textContent=(state.currentModule==='learning'&&activeLearningSubject)?'':localizedModuleLead(state.currentModule)}}const quickLayer=$('moduleQuickLayer');if(quickLayer?.classList.contains('open')){if(state.moduleSearchResults?.length&&state.moduleSearchCategory?.kind==='places'){renderModulePlaces(state.moduleSearchResults)}else if(state.moduleSearchCategory){$('moduleLayerTitle').textContent=localizedQuickChoiceTitle(state.moduleSearchCategory);if(state.moduleSearchBusy)moduleStatus(quickUiText().searching+' '+localizedQuickChoiceTitle(state.moduleSearchCategory).toLowerCase()+' '+quickUiText().nearby)}else{ $('moduleLayerTitle').textContent=d.quickTitle;renderModuleQuickChoices()}}try{localStorage.setItem('mypocketai.language',state.language)}catch{}}
try{const savedLanguage=localStorage.getItem('mypocketai.language');if(savedLanguage&&UI_TEXT[savedLanguage])state.language=savedLanguage;$('languageSelect').value=state.language}catch{}applyUiLanguage();
const languageSelectNode=$('languageSelect');
const languageDialog=document.createElement('div');
languageDialog.id='languageDialog';
languageDialog.hidden=true;
languageDialog.setAttribute('role','dialog');
languageDialog.setAttribute('aria-modal','true');
const languageDialogHead=document.createElement('div');languageDialogHead.className='language-dialog-head';
const languageDialogTitle=document.createElement('strong');
const languageDialogClose=document.createElement('button');languageDialogClose.type='button';languageDialogClose.textContent='✕';languageDialogClose.setAttribute('aria-label','Close');
languageDialogHead.append(languageDialogTitle,languageDialogClose);
const languageDialogScroll=document.createElement('div');languageDialogScroll.className='language-dialog-scroll';
languageDialog.append(languageDialogHead,languageDialogScroll);document.body.append(languageDialog);
const languageButton=document.createElement('button');languageButton.type='button';languageButton.className='language-menu-button';
languageSelectNode.after(languageButton);
const sortedLanguages=[...languageSelectNode.options].map(o=>({value:o.value,label:o.textContent})).sort((a,b)=>a.label.localeCompare(b.label,'en',{sensitivity:'base'}));
function closeLanguageDialog(){languageDialog.hidden=true}
function syncLanguageMenu(){languageSelectNode.value=state.language;languageButton.textContent=(sortedLanguages.find(o=>o.value===state.language)?.label||'Română')+' ▾';languageDialogTitle.textContent=(UI_TEXT[state.language]||UI_TEXT.ro).settingsLanguage}
sortedLanguages.forEach(o=>{const btn=document.createElement('button');btn.type='button';btn.className='language-dialog-choice';btn.textContent=o.label;btn.addEventListener('click',()=>{languageSelectNode.value=o.value;languageSelectNode.dispatchEvent(new Event('change',{bubbles:true}));closeLanguageDialog()});languageDialogScroll.append(btn)});
languageButton.addEventListener('click',()=>{syncLanguageMenu();languageDialog.hidden=false});
languageDialogClose.addEventListener('click',closeLanguageDialog);
syncLanguageMenu();
$('languageSelect').addEventListener('change',event=>{state.language=UI_TEXT[event.target.value]?event.target.value:'ro';event.target.value=state.language;applyUiLanguage();syncLanguageMenu()});
// 09 — Startup: bind state, begin location permission/request, load local data, greet once
startSharedLocation();
loadHistory();
if('speechSynthesis'in window){refreshSpeechVoices();try{window.speechSynthesis.addEventListener('voiceschanged',refreshSpeechVoices)}catch{window.speechSynthesis.onvoiceschanged=refreshSpeechVoices}}
// Launch directly into the app. Preload the 3D avatar offscreen; it comes from
// the Android asset bundle on APK builds and the cloud asset in browsers.
if(nativeEntranceCompleted){pocketFirstEntrance=false;document.documentElement.classList.remove('pocket-boot')}
avatar3dLoad();
// If graphics initialization fails or the WebView does not support the model,
// never leave the user trapped behind a blank launch screen.
setTimeout(()=>{if(pocketFirstEntrance&&!pocketGreetingActive){pocketRevealMainApp();setStatus('Avatarul 3D nu a putut porni la timp.')}} ,12000);
})();
</script>

<style id="mypocketai-layout-v1053">
/* v1.0.53: keep the fixed bottom navigation clear of the results window. */
@media(max-width:699px){
 .module-quick-layer.open:has(.module-quick-sheet.results-mode){
  padding-bottom:calc(88px + env(safe-area-inset-bottom))!important;
 }
 .module-quick-sheet.results-mode{height:100%!important;min-height:0!important;max-height:100%!important;}
 .module-quick-sheet.results-mode>.module-quick-body{
  flex:1 1 0!important;height:0!important;min-height:0!important;max-height:100%!important;
  overflow:hidden!important;display:flex!important;flex-direction:column!important;
  padding:8px 8px calc(10px + env(safe-area-inset-bottom))!important;
 }
 .module-places-results{flex:1 1 0!important;height:0!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;}
 .module-place-results-list{
  flex:1 1 0!important;height:0!important;min-height:0!important;max-height:100%!important;
  overflow-y:auto!important;overflow-x:hidden!important;padding:0 0 22px!important;
  -webkit-overflow-scrolling:touch!important;overscroll-behavior-y:contain!important;scroll-padding-bottom:22px!important;
 }
 .module-place-result:last-child{margin-bottom:6px!important;}
}
/* v1.0.53: remove the old downward offset; all three home rows now share equal spacing.
   Reserve more vertical room above the fixed navigation so row three is not covered. */
#view-home .card-grid>.feature-card{position:static!important;top:auto!important;}
#view-home.active{height:calc(100dvh - 282px)!important;min-height:0!important;max-height:calc(100dvh - 282px)!important;}
#view-home .card-grid{
 display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
 grid-template-rows:repeat(3,minmax(0,1fr))!important;
 row-gap:clamp(7px,1.2vh,11px)!important;column-gap:clamp(7px,1.2vh,11px)!important;
 flex:1 1 0!important;min-height:0!important;height:auto!important;align-content:stretch!important;
}
@media(max-height:700px) and (max-width:699px){
 #view-home.active{height:calc(100dvh - 260px)!important;max-height:calc(100dvh - 260px)!important;}
}

/* v1.0.87: prominent pill-shaped quick selection action on both Maps and Hotels modules. */
#view-module .module-actions-row #moduleQuickTrigger{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-width:clamp(180px,43vw,260px);max-width:62%;min-height:58px;padding:12px 18px;border-radius:999px;border:2px solid #ffc1a9!important;background:linear-gradient(155deg,#ef5a47,#b82735 58%,#841d34)!important;box-shadow:0 4px 0 #38101b,0 0 22px #ff665c88!important;color:#fff!important;font-size:clamp(14px,3.8vw,18px);font-weight:800;letter-spacing:.1px;line-height:1.2;white-space:nowrap;overflow-wrap:normal;transition:filter .15s ease,transform .15s ease}
#view-module .module-actions-row #moduleQuickTrigger:active{transform:translateY(2px);filter:brightness(1.15)}
@media(max-width:380px){#view-module .module-actions-row #moduleQuickTrigger{min-width:0;max-width:60%;min-height:54px;padding:10px 12px;font-size:13px}}
/* v1.0.85 final layout override */
.view#view-module #sharedChatShell .chat-top{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;flex-wrap:nowrap!important}
.view#view-module #sharedChatShell .chat-top strong{order:0!important;flex:1 1 auto!important;min-width:0!important;text-align:left!important;padding:0!important}
.view#view-module #sharedChatShell .chat-top #newChatBtn{order:1!important;flex:0 0 auto!important;margin-left:auto!important;max-width:62%!important;white-space:nowrap!important}


/* Selection and map navigation: same red gradient as the Acasă action. */
.route-map-header .route-header-action,
.route-choice-screen .answer-reader-header .route-header-action,
.quick-navigation-toolbar .transit-choice-action {
 background:linear-gradient(155deg,#ef5a47,#b82735 58%,#841d34)!important;
 color:#fff!important;
 border:2px solid #ffc1a9!important;
 box-shadow:0 4px 0 #38101b,0 0 16px #ff665c55!important;
 font-weight:800!important;
}
/* Answer reader return matches the Acasă red and fits localized text. */
.answer-reader-header .answer-reader-close{width:auto!important;min-width:108px!important;padding:7px 12px!important;font-size:14px!important;line-height:1.2!important;background:linear-gradient(155deg,#ef5a47,#b82735 58%,#841d34)!important;color:#fff!important;border:2px solid #ffc1a9!important;border-radius:18px!important;box-shadow:0 4px 0 #38101b,0 0 16px #ff665c55!important;font-weight:800!important}
/* v1.0.111: match the existing red Quick selections button exactly. */
#view-assistant .assistant-actions > .back-btn,
#view-module .module-actions-row > .module-home-btn,
#view-conversations > .back-btn,
#view-tools > .back-btn,
#view-settings > .back-btn,
.module-quick-header > .back-btn {
 background:linear-gradient(155deg,#ef5a47,#b82735 58%,#841d34)!important;
 color:#ffffff!important;
 border:2px solid #ffc1a9!important;
 border-radius:20px!important;
 box-shadow:0 4px 0 #38101b,0 0 22px #ff665c88!important;
 font-weight:800!important;
}
#view-assistant .assistant-actions > .back-btn,
#view-module .module-actions-row > .module-home-btn {
 min-height:58px!important;
 padding:12px 8px!important;
}
#view-module .module-actions-row > #moduleQuickTrigger {
 width:100%!important;
 max-width:none!important;
 min-width:0!important;
 min-height:58px!important;
 border-radius:20px!important;
 padding:12px 8px!important;
}
.route-map-window details.selected-transit {
 border:2px solid #ffc1a9!important;
 border-radius:20px!important;
 box-shadow:0 4px 0 #38101b,0 0 18px #ff665c55!important;
}
.route-map-window details.selected-transit > summary {
 background:linear-gradient(155deg,#ef5a47,#b82735 58%,#841d34)!important;
 color:#fff!important;
 border-radius:18px!important;
 font-weight:850!important;
}
/* Production avatar: immersive full-screen portrait without demo controls or duplicate static image. */
.avatar-overlay,.avatar-overlay.visible{z-index:2147482000!important;background:radial-gradient(ellipse at 50% 34%,#25475e 0%,#102c43 52%,#04121f 100%)!important;padding:0!important}
.avatar-overlay .avatar-stage{position:absolute!important;inset:0!important;width:100vw!important;max-width:none!important;height:100dvh!important;max-height:none!important;padding:0!important;margin:0!important;gap:0!important;overflow:hidden!important;transform:none!important;opacity:1!important}
.avatar-overlay .avatar-stage #avatar3dFrame{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;border:0!important;background:transparent!important}
.avatar-overlay .avatar-image,.avatar-overlay .avatar-close,.avatar-overlay .avatar-message,.avatar-overlay .avatar-status,.avatar-overlay .voice-wave{display:none!important}

/* Avatar floats over the real application, with no blocking panel or gestures. */
.avatar-overlay,.avatar-overlay.visible{background:transparent!important;pointer-events:none!important;transition:opacity .35s ease,visibility .35s ease!important}
.avatar-overlay .avatar-stage{pointer-events:none!important}
.avatar-overlay .avatar-stage #avatar3dFrame{left:10%!important;top:13%!important;right:auto!important;bottom:auto!important;width:80%!important;height:73%!important;pointer-events:none!important;background:transparent!important}


/* EXIT CONFIRMATION: explicitly override the normal non-interactive avatar.
   A fullscreen transparent hit shield prevents taps reaching Home beneath it. */
#avatarOverlay.exit-mode,
#avatarOverlay.exit-mode.visible {
 pointer-events:auto!important;
 touch-action:manipulation!important;
 z-index:2147483000!important;
}
#avatarOverlay.exit-mode .avatar-stage {
 pointer-events:auto!important;
 touch-action:manipulation!important;
}
#avatarOverlay.exit-mode .exit-buttons,
#avatarOverlay.exit-mode .exit-buttons button {
 display:flex!important;
 pointer-events:auto!important;
 touch-action:manipulation!important;
 position:relative;
 cursor:pointer!important;
}
#avatarOverlay.exit-mode .exit-buttons {
 position:absolute!important;
 z-index:2147483001!important;
 bottom:clamp(12px,3dvh,30px)!important;
 left:3%!important;
 width:94%!important;
}
#avatarOverlay.exit-mode .exit-buttons button{
 justify-content:center!important;
 align-items:center!important;
 min-height:56px!important;
 user-select:none;
 -webkit-user-select:none;
}


/* The exit dock replaces, rather than overlaps, the four Home navigation tabs.
   Its geometry is copied from the real responsive navigation rectangle. */
html.pocket-exit-open .bottom-nav {
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
#avatarOverlay.exit-mode .exit-buttons {
  position:fixed!important;
  top:var(--pocket-exit-top,auto)!important;
  bottom:auto!important;
  left:var(--pocket-exit-left,12px)!important;
  width:var(--pocket-exit-width,calc(100% - 24px))!important;
  height:var(--pocket-exit-height,82px)!important;
  padding:6px!important;
  display:grid!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  column-gap:10px!important;
  box-sizing:border-box!important;
  background:linear-gradient(180deg,rgba(17,53,78,.99),rgba(3,18,33,.99))!important;
  border:2px solid #3b8da7!important;
  border-radius:29px!important;
  box-shadow:inset 0 2px 0 rgba(199,252,255,.23),0 5px 0 #03121f,0 11px 21px rgba(0,0,0,.52)!important;
  z-index:2147483001!important;
  pointer-events:auto!important;
  transform:none!important;
}
#avatarOverlay.exit-mode .exit-buttons button {
  margin:0!important;
  min-width:0!important;
  width:100%!important;
  height:100%!important;
  min-height:0!important;
  padding:8px 6px!important;
  border-radius:22px!important;
  font-size:clamp(16px,4.2vw,22px)!important;
  line-height:1.1!important;
  box-shadow:inset 0 2px 0 rgba(255,255,255,.2),inset 0 -3px 0 rgba(0,0,0,.2)!important;
  text-align:center!important;
}

/* Science touch/scroll recovery (Android WebView).
   A single page scroll is more reliable than nested clipped flex scrollers.
   Keep the fixed app navigation outside the scroll area. */
main.page:has(#view-module.learning-science.active){
  height:var(--science-content-height,auto)!important;
  max-height:var(--science-content-height,none)!important;
  overflow-x:hidden!important;overflow-y:auto!important;
  overscroll-behavior-y:auto!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;
  padding-bottom:calc(116px + env(safe-area-inset-bottom,0px))!important;
}
#view-module.learning-science.active{
  height:auto!important;max-height:none!important;min-height:100%!important;
  grid-template-rows:auto auto!important;align-content:start!important;
  overflow:visible!important;
}
#view-module.learning-science #moduleContent{
  height:auto!important;max-height:none!important;min-height:0!important;
  overflow:visible!important;
}
#view-module.learning-science .science-choice-panel{
  flex:0 0 auto!important;overflow:visible!important;min-height:0!important;
}
#view-module.learning-science .science-choice-list{
  flex:0 0 auto!important;max-height:none!important;
  overflow:visible!important;touch-action:pan-y!important;
}
#view-module.learning-science .science-choice-row,
#view-module.learning-science .science-work-toolbar button,
#view-module.learning-science .science-education-workspace button{
  touch-action:manipulation!important;pointer-events:auto!important;
}
#view-module.learning-science #scienceEducationWorkspace{
  flex:0 0 auto!important;max-height:none!important;
  overflow:visible!important;touch-action:pan-y!important;
}
#view-module.learning-science #scienceEducationText{
  touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important;
}
.chemistry-curriculum-dialog[open] .chemistry-curriculum-content{
  min-height:0!important;overflow-y:auto!important;
  -webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;
}
.chemistry-curriculum-dialog[open] .chemistry-curriculum-list{
  min-height:0!important;overflow-y:auto!important;
  -webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;
}

/* Science viewport recovery v2: flex scrolling without fixed heights.
   Keyboard uses the actual visual viewport, not the obscured bottom navigation. */
main.page:has(#view-module.learning-science.active){
 box-sizing:border-box!important;
 flex:1 1 0%!important;
 height:auto!important;max-height:none!important;min-height:0!important;
 overflow-y:auto!important;overflow-x:hidden!important;
 padding-bottom:calc(124px + env(safe-area-inset-bottom,0px))!important;
 touch-action:pan-y!important;
}
main.page.science-keyboard-visible:has(#view-module.learning-science.active){
 flex:0 1 auto!important;
 height:var(--science-content-height,45dvh)!important;
 max-height:var(--science-content-height,45dvh)!important;
 overflow-y:auto!important;
 padding-bottom:20px!important;
}
main.page.science-keyboard-visible #view-module.learning-science.active,
main.page.science-keyboard-visible #view-module.learning-science #moduleContent{
 height:auto!important;max-height:none!important;min-height:0!important;
 overflow:visible!important;
}
#view-module.learning-science .science-choice-panel,
#view-module.learning-science .science-choice-list{
 height:auto!important;max-height:none!important;overflow:visible!important;
}
#view-module.learning-science #scienceEducationWorkspace{
 height:auto!important;max-height:none!important;overflow:visible!important;
}

/* Chemistry deterministic interactive representations */
.chem-visual-dialog[open]{display:flex!important;flex-direction:column!important;gap:10px;box-sizing:border-box;width:min(98vw,850px)!important;max-width:98vw!important;max-height:90dvh!important;overflow-y:auto!important;padding:12px!important}
.chem-visual{display:flex;flex-direction:column;gap:9px;min-width:0;color:#edf8ff}
.chem-visual h3{font-size:clamp(16px,4vw,21px);margin:5px 0}
.chem-visual p{margin:4px 0;line-height:1.4}
.chem-visual svg{width:100%;height:auto;max-height:290px;border:1px solid #406b85;border-radius:12px;background:#071e30}
.chem-visual-note{font-size:12px;color:#c1e2ee}
.chem-periodic-scroll{overflow-x:auto;overflow-y:visible;width:100%;-webkit-overflow-scrolling:touch;touch-action:pan-x;border:1px solid #3d7694;border-radius:10px;padding:6px}
.chem-periodic-grid{display:grid;grid-template-columns:repeat(18,minmax(39px,1fr));gap:3px;min-width:790px}
.chem-periodic-element{box-sizing:border-box;min-width:39px;min-height:40px;padding:3px 1px;border:1px solid #4f9eba;border-radius:5px;background:#133e55;color:#f4fbff;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:manipulation}
.chem-periodic-element strong{font-size:15px}.chem-periodic-element small{font-size:9px;line-height:1.1}
.chem-periodic-element.selected{border:2px solid #f9d670;background:#276e85}
.chem-periodic-element.chem-empty{visibility:hidden;pointer-events:none}
.chem-periodic-series{grid-column:1 / 4;color:#b4d6e2;font-size:11px;align-self:center}
.chem-element-detail{font-weight:700}
.chem-ph-scale{display:flex;flex-wrap:nowrap;overflow-x:auto;border-radius:8px}.chem-ph-scale span{flex:1 0 26px;min-height:43px;display:grid;place-items:center;font-weight:700;color:white}
.chem-reaction-line{font-size:clamp(20px,6vw,32px);font-weight:700;text-align:center;border:1px solid #4d8b9f;border-radius:10px;padding:18px 6px;overflow-wrap:anywhere}
.science-result-dialog:has(.chem-visual){max-height:90dvh!important;overflow-y:auto!important}
.science-result-dialog:has(.chem-visual) .science-result-text{flex:0 1 auto;max-height:35dvh!important;overflow-y:auto!important}
.chemistry-curriculum-detail .chem-visual{margin-top:10px}

/* Chimie: compact intrinsic sizing and interactive, contextual atoms. */
.chemistry-curriculum-dialog[open]{
 min-height:0!important;height:fit-content!important;
 max-height:min(89dvh,760px)!important;
}
.chemistry-curriculum-dialog .chemistry-curriculum-content{
 flex:0 1 auto!important;max-height:calc(89dvh - 115px)!important;
 overflow-y:auto!important;overscroll-behavior:contain!important;
}
.chemistry-curriculum-dialog .chemistry-curriculum-detail{flex:0 1 auto!important;overflow-y:auto!important}
.chem-visual svg{max-height:238px!important;display:block}
.chem-atom-picker label{display:flex;flex-direction:column;gap:5px;font-size:13px}
.chem-atom-picker select{box-sizing:border-box;width:100%;min-height:41px;border-radius:9px;border:1px solid #579eb6;background:#0a2b40;color:#fff;padding:7px;font:inherit}
.chem-atom-description,.chem-atom-legend{font-size:clamp(12px,3.2vw,15px)!important;line-height:1.35}
.chem-visual:has(.chem-atom-picker){gap:6px}
</style>
</body>
</html>`;
}
/* Version changes whenever the actual frontend document changes, without
   requiring manual version bumps or APK rebuilds. */
function uiVersion(){
 const content=htmlDocument();
 let hash=2166136261;
 for(let i=0;i<content.length;i++){hash=Math.imul(hash^content.charCodeAt(i),16777619)}
 return (hash>>>0).toString(36);
}
export default {
 async fetch(request,env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
  if (url.pathname === '/__ui_version') {
   return new Response(uiVersion(),{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
  }
  if (url.pathname === '/avatar-production.html') {
   if(!env?.ASSETS)return new Response('Avatar asset binding unavailable',{status:503});
   return env.ASSETS.fetch(new Request(new URL('/avatar-v4.html',url)));
  }
  if (url.pathname !== '/' && url.pathname !== '/index.html') return new Response('Not found',{status:404});
  const html=htmlDocument().replace('<html', '<html data-pocket-ui-version="'+uiVersion()+'"');
  return new Response(html,{headers:{'Content-Type':'text/html; charset=UTF-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});
 }
};
