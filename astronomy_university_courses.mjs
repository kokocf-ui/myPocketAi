import {ASTRONOMY_STUDY_CASES} from './astronomy_study_course.mjs';
// Astronomy university route is advisory, never a claim about a specific
// country's institution, ECTS credits or admission requirements.
export const ASTRONOMY_UNIVERSITY_DEFAULT_FOUR=Object.freeze(['GB-SCT','IE','GR','CY','ES']);
export const ASTRONOMY_UNIVERSITY_ELECTIVES=Object.freeze({
 stellar:['galaxies','gravity'],dynamics:['distances','observations'],
 galactic:['observations','cosmology'],cosmo:['gravity','stars'],
 planetary:['gravity','distances'],instruments:['stars','gravity'],
 highenergy:['distances','cosmology']
});
export function astronomyUniversityRoutes(country=''){
 const pref=ASTRONOMY_UNIVERSITY_DEFAULT_FOUR.includes(String(country).toUpperCase())?4:3;
 return [pref,pref===3?4:3].map(years=>({
  id:'astronomy-bsc-'+years,years,
  ro:years+' ani · parcurs universitar orientativ',
  en:years+' years · advisory higher-education route',
  noticeRo:'Astronomia/astrofizica universitară depinde de facultate, profil şi credite. Acest model nu este acreditat şi nu înlocuieşte programa universităţii.',
  noticeEn:'Degree duration, modules and credits depend on institution and track. This is not an accredited university curriculum.'
 }));
}
export function astronomyUniversityRoute(country='',routeId=''){
 const options=astronomyUniversityRoutes(country);
 return options.find(x=>x.id===routeId)||options[0];
}
export function astronomyUniversityYears(country='',routeId=''){
 const route=astronomyUniversityRoute(country,routeId);
 return Array.from({length:route.years},(_,i)=>({
  id:'univ-'+(i+1),year:i+1,
  ro:'Anul universitar '+(i+1),en:'University year '+(i+1)
 }));
}
export function astronomyUniversityCourseChoices({
 year=1,years=3,specialty='',topics=[],specializations=[]
}={}){
 const spec=specializations.find(x=>x.id===specialty);
 if(!spec||![3,4].includes(years)||!Number.isInteger(year)||year<1||year>years)return [];
 const base=topics.filter(x=>x&&!x.specialty&&x.id),
  custom=topics.find(x=>x.specialty===specialty);
 const ordered=[],seen=new Set();
 const add=id=>{const item=base.find(x=>x.id===id)||(custom?.id===id?custom:null);
  if(item&&!seen.has(item.id)){seen.add(item.id);ordered.push(item)}};
 for(const id of spec.core||[])add(id);
 for(const id of ASTRONOMY_UNIVERSITY_ELECTIVES[specialty]||[])add(id);
 if(custom)add(custom.id);
 ordered.push({id:'astronomy-capstone',ro:'Proiect de cercetare astronomică',en:'Astronomy research project'});
 const per=Math.floor(ordered.length/years),extra=ordered.length%years;
 const start=(year-1)*per+Math.min(year-1,extra),count=per+(year<=extra?1:0);
 return ordered.slice(start,start+count).map(item=>({
  ...item,university:true,courseYear:year,programme:specialty
 }));
}
export function astronomyUniversityStudyText({topic='',specialty='',grade='',language='ro',lessons=[],entryId=''}={}){
 const ro=language==='ro';
 const source=lessons.filter(x=>x?.subject==='astronomy'&&x.topic===topic&&x.statement&&(!entryId||x.id===entryId));
 if(!source.length)return '';
 const domain=topic.startsWith('special-')?{
  'special-stellar':'stars','special-dynamics':'gravity','special-galactic':'galaxies',
  'special-cosmo':'cosmology','special-planetary':'exoplanets',
  'special-instruments':'observations','special-highenergy':'stars'
 }[topic]:topic;
 const practical=ASTRONOMY_STUDY_CASES[domain];
 const notes=[
  '# '+(ro?'Curs universitar de astronomie':'University Astronomy study')+' · '+topic,
  ro?'Parcurs universitar orientativ, nu program acreditat şi nu catalog obligatoriu al unei universităţi.':
   'Advisory course, not an accredited module or a required institutional syllabus.',
  (ro?'Specializare: ':'Specialisation: ')+specialty+' · '+(ro?'an: ':'year: ')+grade,
  '# '+(ro?'Obiective de studiu':'Learning objectives'),
  ro?'Înţelege mecanismul fizic al conceptului, formulează ipotezele, distinge mărimi măsurate de parametri modelaţi şi explică limitele concluziilor.':
   'Identify the physical mechanism, state assumptions, distinguish measured values from models, and discuss uncertainty.'
 ];
 for(const [i,item] of source.entries()){
  notes.push(
   '## '+(i+1)+'. '+item.title,
   '# '+(ro?'Definiţie şi mecanism':'Definition and mechanism'),item.statement,
   item.formula&&item.formula!=='—'?'# '+(ro?'Relaţie sau notaţie':'Equation or notation'):'',
   item.formula&&item.formula!=='—'?item.formula:'',
   '# '+(ro?'Aplicare şi interpretare':'Application and interpretation'),
   practical?.core[i%practical.core.length]||'',
   practical?.examples[i%practical.examples.length]||'',
   '# '+(ro?'Întrebare de control':'Review question'),
   practical?.questions[i%practical.questions.length]||'',
   ro?'Răspuns orientativ: ':'Reference answer: ',
   practical?.answers[i%practical.answers.length]||''
  );
 }
 notes.push('# '+(ro?'Activitate practică şi analiza datelor':'Practical work and data analysis'),
  ro?'Alege o simulare, un catalog public de observaţii sau o metodă de calcul relevantă. Notează sursa, data, variabilele, valorile, unităţile şi incertitudinile. Foloseşte un martor sau o comparaţie justificată; nu prezenta numere fabricate drept observaţii.':
   'Use an appropriate simulation, public astronomical dataset or calculation. Record source, variables, units and uncertainties, and never present invented data as observations.',
  '# '+(ro?'Condiţii de validitate şi siguranţă':'Limits and safety'),
  ro?'Modelele sunt aproximări. Fără efemeride actualizate nu prezicem poziţii reale pe cer. Nu privi niciodată direct Soarele şi nu utiliza telescopul spre Soare fără filtre solare certificate.':
   'Models are approximations. No live ephemerides are provided. Never observe the Sun directly or through an unfiltered telescope.');
 return notes.filter(Boolean).join('\n\n');
}
export function astronomyUniversityProjectText({specialty='',year=3,language='ro'}={}){
 const ro=language==='ro';
 const question={
  stellar:'Cum variază culorile şi luminozitatea în eşantioane de stele?',
  dynamics:'Cum schimbă excentricitatea distanţa şi viteza de-a lungul unei orbite?',
  galactic:'Cum diferă distribuţia luminozităţii la galaxiile spiralate şi eliptice?',
  cosmo:'Cum depinde redshiftul de distanţă în aproximaţia locală?',
  planetary:'Ce putem deduce despre dimensiunile planetelor din curbe de tranzit simulate?',
  instruments:'Cum modifică deschiderea telescopului limita de rezoluţie ideală?',
  highenergy:'Cum se disting semnalele de fond şi sursele astrofizice în date publice?'
 }[specialty]||'Ce întrebare poate fi investigată cu un set de date astronomice?';
 return [
  '# '+(ro?'Proiect de cercetare astronomică':'Astronomy research project'),
  (ro?'Specializare: ':'Track: ')+specialty+' · '+(ro?'an: ':'year: ')+year,
  ro?'Model orientativ de proiect academic; nu constituie diplomă, credite sau cercetare experimentală realizată.':
   'An advisory academic project, not a degree, credit award or completed experimental research.',
  '# '+(ro?'Întrebarea de cercetare':'Research question'),question,
  '# '+(ro?'Ipoteză şi fundamentare':'Hypothesis and scientific background'),
  ro?'Formulează o ipoteză falsificabilă şi explică legătura cu legile fizice relevante. Precizează limitele modelului matematic şi ce observabile ar putea testa ipoteza.':
   'Form a falsifiable hypothesis, connect it to physical laws and specify relevant observables.',
  '# '+(ro?'Date şi instrumente':'Data and instruments'),
  ro?'Foloseşte surse deschise sau simulări, precizează provenienţa, intervalul de colectare, criteriile de selecţie şi condiţiile de utilizare. Fără acces la instrumente, nu inventa date.':
   'Use open datasets or simulations; document provenance, selection criteria and limitations. Never invent measurements.',
  '# '+(ro?'Metoda de analiză':'Analysis method'),
  ro?'Stabileşte variabile, controale, ecuaţii, unităţi, incertitudini şi o procedură repetabilă. Explică modul de calcul sau de comparaţie statistică şi verificarea reziduurilor.':
   'State variables, controls, equations, units, uncertainties and a reproducible analysis procedure.',
  '# '+(ro?'Raport şi interpretare':'Report and interpretation'),
  ro?'Include grafice cu axe şi unităţi, rezultate marcate ca simulate ori reale, discuţia erorilor, concluzii proporţionale cu dovezile şi bibliografia.':
   'Include labelled figures, clearly distinguish simulated from observed results, discuss errors and cite sources.',
  '# '+(ro?'Siguranţă şi etică':'Safety and ethics'),
  ro?'Nu privi Soarele direct. Respectă licenţele datelor, nu modifica datele pentru a confirma ipoteza şi evită concluziile mai puternice decât observaţiile.':
   'Never look directly at the Sun. Respect data licensing, preserve original data and avoid unsupported claims.'
 ].join('\n\n');
}
