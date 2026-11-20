// Pan-European advisory science progression, not a national curriculum or textbook.
// Country-specific school-year labels come from the existing country picker.
// Subject knowledge and scientific enquiry are sequenced together.
// Framework references:
// https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study
// https://pisa-framework.oecd.org/science-2025/
// https://www.cambridge-community.org.uk/guide-to/cambridge-lower-secondary/science/
export const SCIENCE_PROGRESSION_SOURCES=Object.freeze([
 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 'https://pisa-framework.oecd.org/science-2025/',
 'https://www.cambridge-community.org.uk/guide-to/cambridge-lower-secondary/science/'
]);
// Each entry is a teaching order, not an assertion about any country's mandatory syllabus.
// The sequences deliberately change between school years; generic minLevel filtering
// previously displayed virtually identical chapters for every grade.
export const SCIENCE_ADVISORY_PROGRESSION=Object.freeze({
 primary:{
  physics:[['units','energy'],['heat','energy','units'],['kinematics','energy','heat'],['units','kinematics','fluids','energy']],
  chemistry:[['fundamentals'],['fundamentals','solutions'],['fundamentals','solutions'],['fundamentals','solutions','reactions']],
  biology:[['plants','ecology'],['plants','anatomy','ecology'],['anatomy','cells','ecology'],['cells','ecology','evolution','plants']],
  astronomy:[['sky','solar'],['solar','observations'],['sky','solar','observations'],['solar','sky','distances','observations']]
 },
 lower:{
  physics:[['units','kinematics','heat','energy'],['units','dynamics','fluids','electric'],['kinematics','dynamics','energy','electric'],['energy','electric','heat','fluids','kinematics']],
  chemistry:[['fundamentals','atomic','periodic'],['atomic','periodic','bonding','reactions'],['reactions','inorganic','solutions','acids'],['solutions','acids','reactions','inorganic']],
  biology:[['plants','ecology','cells'],['cells','anatomy','plants','ecology'],['genetics','evolution','cells','ecology'],['anatomy','genetics','ecology','evolution']],
  astronomy:[['solar','sky','observations'],['sky','distances','stars'],['solar','distances','observations'],['stars','solar','observations','distances']]
 },
 upper:{
  physics:[['units','kinematics','dynamics','measurement'],['heat','thermodynamics','waves','optics'],['electric','circuits','electromagnetism','measurement'],['modern','measurement','energy','waves']],
  chemistry:[['fundamentals','atomic','periodic','bonding'],['reactions','inorganic','solutions','acids'],['organic','physical','solutions','reactions'],['organic','electrochem','analytical','biochemistry']],
  biology:[['cells','biomolecules','genetics','ecology'],['anatomy','homeostasis','microbes'],['genetics','evolution','methods','ecology'],['biomolecules','homeostasis','methods','microbes']],
  astronomy:[['solar','sky','gravity','distances'],['stars','galaxies','observations'],['cosmology','exoplanets','gravity'],['cosmology','stars','galaxies','observations']]
 }
});
const rank=Object.freeze({beginner:0,intermediate:1,advanced:2});
export function scienceGradeTopicPlan({country='',subject='',stage='lower',grade='',years=[],topics=[]}={}){
 const rows=SCIENCE_ADVISORY_PROGRESSION[stage]?.[subject]||[];
 const yearList=Array.isArray(years)?years:[];
 const yearIndex=yearList.findIndex(y=>String(y?.id)===String(grade));
 if(!rows.length||yearIndex<0||!grade){
  return {country,subject,stage,grade,status:'invalid-selection',topics:[],source:null};
 }
 // Map the pupil's position within their actual country stage; we never
 // re-label a Hungarian, French, Scottish, etc. year as a Romanian one.
 const sequenceIndex=yearList.length===1?0:
  Math.round(yearIndex*(rows.length-1)/(yearList.length-1));
 const selected=rows[sequenceIndex]||rows[0];
 const max=stage==='upper'?1:0;
 const indexed=new Map(topics.filter(x=>x&&!x.specialty).map(x=>[x.id,x]));
 const ordered=selected.map(id=>indexed.get(id)).filter(x=>
  x&&((rank[x.minLevel]??0)<=max || stage==='primary'&&subject==='chemistry'&&x.id==='solutions'));
 const unique=[...new Map(ordered.map(x=>[x.id,x])).values()];
 // Never hide the whole subject because a national stage has an unverified
 // grade map: a known, clearly marked general course is always available.
 const fallback=topics.filter(x=>x&&!x.specialty&&(rank[x.minLevel]??0)<=max).slice(0,3);
 return {
  country,subject,stage,grade,status:'general-learning',
  topics:unique.length?unique:fallback,
  sequenceIndex,yearIndex,yearCount:yearList.length,
  source:SCIENCE_PROGRESSION_SOURCES,
  note:'Parcurs generic de studiu, nu programa obligatorie a țării sau manualul clasei.',
  astronomyOptional:subject==='astronomy'
 };
}
const PRIMARY_LESSON_BANK=Object.freeze({
 physics:{
  units:['Măsurăm și comparăm','Un obiect poate fi mai lung, mai greu ori mai cald decât altul. Pentru a compara corect folosim aceeași unitate și același instrument.','Măsoară de trei ori lungimea unei cărți cu rigla. Compară rezultatele și explică diferențele.'],
  energy:['Schimbări și energie','Lumina, mișcarea și căldura sunt legate de transferuri de energie. Energia nu este o substanță pe care o putem vedea.','Observă o jucărie care coboară pe o rampă. Ce se schimbă când ridici începutul rampei?'],
  heat:['Cald, rece și temperatură','Temperatura descrie cât de cald sau rece este un corp. Căldura se transferă de la un corp mai cald la unul mai rece.','Compară două recipiente cu apă folosind un termometru, cu ajutorul unui adult.'],
  kinematics:['Cum descriem mișcarea','Descriem mișcarea prin poziție, direcție și timpul scurs. Două trasee de aceeași lungime pot necesita timpi diferiți.','Marchează un traseu scurt și măsoară cât durează o deplasare lentă și una rapidă.'],
  fluids:['Lichide și presiune','Lichidele curg și iau forma vasului, dar păstrează aproximativ același volum când sunt turnate cu grijă.','Toarnă aceeași cantitate de apă în două vase de forme diferite. Ce se schimbă?']
 },
 chemistry:{
  fundamentals:['Materiale și proprietăți','Apa, hârtia, lemnul și metalul sunt materiale cu proprietăți diferite. Unele schimbări pot fi inversate, altele formează substanțe noi.','Grupează obiecte după aspect, flexibilitate și comportamentul în apă; nu gusta substanțe.'],
  solutions:['Amestecuri din viața de zi cu zi','Unele materiale se dizolvă în apă, iar altele rămân vizibile. Dizolvarea nu înseamnă dispariția materiei.','Amestecă puțină sare în apă și compară cu nisipul; nu consuma amestecurile.'],
  reactions:['Schimbări observabile','O reacție chimică poate forma substanțe cu alte proprietăți. Nu orice schimbare de formă este o reacție chimică.','Compară topirea gheții cu coacerea alimentelor doar prin observație; explică diferențele.']
 },
 biology:{
  plants:['Plantele au nevoie de resurse','Plantele folosesc apă, lumină și substanțe minerale. Rădăcinile, tulpinile și frunzele îndeplinesc roluri diferite.','Urmărește o plantă câteva zile și notează unde apar frunzele noi.'],
  ecology:['Viețuitoare și mediu','Viețuitoarele au nevoie de hrană, apă și un habitat potrivit. Un ecosistem conține viețuitoare și elemente nevii.','Observă un spațiu verde și notează plantele, insectele și sursele de apă.'],
  anatomy:['Corpul și sănătatea','Corpul are organe și sisteme care lucrează împreună. Inima ajută sângele să circule, iar plămânii participă la schimbul de gaze.','Numără respirațiile înainte și după o plimbare ușoară; compară fără a forța corpul.'],
  cells:['Din ce sunt alcătuite organismele','Plantele și animalele sunt alcătuite din celule. Multe celule nu pot fi văzute fără microscop.','Compară o frunză și un fir de păr: ce vezi cu ochiul liber și ce ar necesita mărire?'],
  evolution:['Diversitate și adaptare','Organismele diferă între ele și au trăsături care le ajută să supraviețuiască în anumite medii.','Compară forma ciocului la două păsări desenate și propune ce hrană ar putea folosi.']
 },
 astronomy:{
  sky:['Cerul se schimbă aparent','Soarele pare să traverseze cerul deoarece Pământul se rotește. Stelele se văd noaptea în condiții potrivite.','Desenează poziția umbrei la două ore diferite. Nu privi direct Soarele.'],
  solar:['Vecinii Pământului','Pământul este o planetă ce se rotește în jurul Soarelui. Luna este satelitul natural al Pământului.','Construiește un model simplu cu bile de dimensiuni simbolice, fără a pretinde scară exactă.'],
  observations:['Observăm și notăm','O observație bună include data, ora, locul și condițiile cerului. Un desen este mai util dacă este etichetat.','Ține un jurnal al fazelor Lunii timp de câteva seri, dacă cerul permite.'],
  distances:['Distanțe în spațiu','În spațiu, distanțele sunt uriașe; lumina are o viteză finită. Modelele cu bile sunt utile, dar rar păstrează scara.','Explică de ce nu putem așeza planetele la distanțe reale într-o cameră.']
 }
});
export function scienceGradeLessonFrame({subject,stage,grade,topic,chapter,language='ro'}={}){
 if(stage==='primary'){
  const lesson=PRIMARY_LESSON_BANK[subject]?.[topic];
  if(!lesson)return null;
  if(language!=='ro')return [
   'GENERAL SCIENCE · Advisory study route · Grade '+grade,
   'Lesson: '+(chapter||lesson[0]),
   'Explore: '+lesson[1],
   'Observation: '+lesson[2],
   'Review: Describe what you observed, how you compared the evidence, and what remains uncertain.',
   'This is an original introductory lesson, not an official national textbook.'
  ].join('\n\n');
  return [
   'ȘTIINȚE · Program general · Clasa/anul '+grade,
   'Lecție: '+lesson[0],
   'Explicație: '+lesson[1],
   'Exemplu și activitate: '+lesson[2],
   'Exercițiu: Scrie două observații și explică prin ce se deosebesc de o presupunere.',
   'Verificare: Ce ai măsurat sau observat? Ce dovadă ai? Ce nu poți concluziona încă?',
   'Material didactic original, orientativ. Nu este un manual național oficial.'
  ].join('\n\n');
 }
 const inquiry=stage==='upper'?
  'Construiește o ipoteză, identifică variabilele și discută limitele dovezilor.':
  'Formulează o întrebare, notează observații și deosebește dovezile de presupuneri.';
 return language==='ro'?
  ['Clasa/anul '+grade+' · '+chapter,'Obiectiv: înțelege conceptul, explică un exemplu, apoi rezolvă un exercițiu potrivit nivelului.','Investigație: '+inquiry,'Evaluare: folosește definiții corecte, unități când sunt necesare și justifică rezultatul.','Parcurs generic orientativ, nu programă ministerială.'].join('\n\n'):
  ['Grade '+grade+' · '+chapter,'Goal: understand the concept, explain an example, then solve an age-appropriate exercise.','Enquiry: pose a testable question, examine evidence and identify limitations.','Review: justify conclusions with correct terminology and units.','General learning route, not a certified national syllabus.'].join('\n\n');
}
