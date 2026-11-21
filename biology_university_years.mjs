// Biology first-cycle university routes, advisory across Europe.
// EHEA framework: 180/240 ECTS (typically 3/4 years), not a guarantee
// of duration/accreditation for a university or a named programme.
// https://education.ec.europa.eu/eu/education-levels/higher-education/inclusive-and-connected-higher-education/european-credit-transfer-and-accumulation-system
// Scotland Biology BSc example 4 years: University of St Andrews.
// https://www.st-andrews.ac.uk/subjects/biology/biology-bsc/
export const BIOLOGY_UNIVERSITY_DEFAULT_YEARS=Object.freeze({
 'GB-SCT':4,'IE':4,'GR':4,'CY':4,'ES':4
});
export const BIOLOGY_UNIVERSITY_CYCLE_REFERENCE='https://education.ec.europa.eu/eu/education-levels/higher-education/inclusive-and-connected-higher-education/european-credit-transfer-and-accumulation-system';
export function biologyUniversityRoutes(country=''){
 const preferred=BIOLOGY_UNIVERSITY_DEFAULT_YEARS[String(country).toUpperCase()]||3;
 return [3,4].sort((a,b)=>a===preferred?-1:b===preferred?1:a-b).map(years=>({
  id:'biology-bsc-'+years,years,
  ro:years+' ani · model orientativ de licență',
  en:years+' years · advisory bachelor route',
  noticeRo:'Parcurs educațional orientativ, '+years+' ani. Programele reale de Biologie depind de universitate, țară, specializare și credite; verifică instituția. Nu reprezintă program acreditat.',
  noticeEn:'Advisory '+years+'-year Biology degree model. Actual university requirements and credits vary; check the institution. This is not an accredited curriculum.',
  source:BIOLOGY_UNIVERSITY_CYCLE_REFERENCE,verified:false
 }));
}
export function biologyUniversityRoute(country='',routeId=null){
 const routes=biologyUniversityRoutes(country);
 return routes.find(x=>x.id===routeId)||routes[0];
}
export function biologyUniversityYears(country='',routeId=null){
 const route=biologyUniversityRoute(country,routeId);
 return Array.from({length:route.years},(_,i)=>({
  id:'univ-'+(i+1),year:i+1,
  ro:'Anul universitar '+(i+1),
  en:'University year '+(i+1)
 }));
}
// Annual course distribution is based on the available authored foundation
// and specialist library, not a fixed four-course template per speciality.
// A course belongs to one year only. Country route remains advisory.
export function biologyUniversityCourseChoices({
 year=1,years=3,specialty='',topics=[],specializations=[]
}={}){
 const programme=Array.isArray(specializations)?specializations.find(x=>x.id===specialty):null;
 if(!programme||![3,4].includes(years)||!Number.isInteger(year)||year<1||year>years)return [];
 const foundations=topics.filter(x=>x&&!x.specialty&&x.id);
 const specialist=topics.filter(x=>x&&x.specialty===specialty&&x.id);
 if(!foundations.length||!specialist.length)return [];
 const ordered=[];
 const seen=new Set();
 const add=entry=>{if(entry&&!seen.has(entry.id)){seen.add(entry.id);ordered.push(entry)}};
 // Establish fundamentals first, including the track's explicit prerequisites.
 for(const id of programme.core||[])add(foundations.find(x=>x.id===id));
 for(const item of foundations)add(item);
 for(const item of specialist)add(item);
 add({id:'biology-capstone',ro:'Proiect de cercetare în biologie',en:'Biology research project'});
 // Years receive every available distinct authored course, rather than
 // silently dropping courses once an arbitrary 8-course ceiling is reached.
 const per=Math.floor(ordered.length/years);
 const rem=ordered.length%years;
 const start=(year-1)*per+Math.min(year-1,rem);
 const count=per+(year<=rem?1:0);
 return ordered.slice(start,start+count).map(source=>({
  ...source,courseYear:year,programme:specialty,university:true
 }));
}
export function biologyUniversityCapstoneText({specialty='',year=3,language='ro',guide=null}={}){
 const ro=language==='ro';
 const track=Array.isArray(guide)?guide:[];
 const prompt=ro?track[3]||'Planifică o întrebare biologică specifică și un studiu etic.':
  track[3]||'Plan an ethical study around a specific biological question.';
 const parts=ro?[
  '# Proiect universitar de cercetare · Biologie',
  'An universitar '+year+' · domeniu: '+specialty+'. Această lucrare este un model didactic orientativ, nu o lucrare de licență acreditată sau dovada unei cercetări reale.',
  '# 1. Formulează întrebarea',
  'Alege o singură întrebare biologică testabilă, legată de specializare. Precizează populația, fenomenul observat și motivul pentru care este important. O întrebare generală precum „Cum funcționează viața?” trebuie restrânsă la un rezultat măsurabil. Definițiile operaționale sunt esențiale.',
  '# 2. Fundamentează ipoteza',
  'Explică ce mecanism biologic susține predicția, ce modele sunt folosite și ce incertitudini rămân. Deosebește observațiile deja raportate de ipoteza proprie. Pentru organisme umane sau animale nu presupune că un mecanism simplu explică toate diferențele.',
  '# 3. Design și etică',
  'Descrie unitatea biologică independentă, variabila testată, rezultatul măsurat, martorul, factorii de confuzie și numărul de replicate. Folosește date publice ori modele de simulare, dacă nu există aprobare etică, supraveghere și echipamente adecvate. Nu colecta probe de la persoane și nu cultiva agenți biologici necunoscuți.',
  '# 4. Exemplu comentat',
  'Pentru a analiza efectul luminii asupra creșterii unei plante, putem formula ipoteza că nivelul de lumină influențează creșterea în anumite limite. Comparăm loturi independente din aceeași specie, păstrăm constante apa și temperatura, măsurăm creșterea la intervale regulate și raportăm variația. Dacă schimbăm simultan lumina și apa, nu putem atribui sigur diferența luminii.',
  '# 5. Analiza datelor',
  'Definește unitățile, numărul de probe, intervalele de măsurare și criteriul de excludere. Un grafic trebuie să aibă axe și unități. Compară distribuțiile, nu doar două valori medii, și explică erorile sau valorile extreme. Corelația nu este suficientă pentru o afirmație cauzală.',
  '# 6. Concluzie și limite',
  'Concluzia trebuie să răspundă întrebării inițiale și să arate ce susțin efectiv observațiile. Dacă experimentul nu poate diferenția între două explicații, notează limita; nu inventa rezultate, grafice ori surse.',
  '# Exercițiu independent',
  prompt,
  'Pregătește: întrebarea, ipoteza, minimum două variabile controlate, un exemplu de martor, o limitare și o propunere de verificare ulterioară.'
 ]:[
  '# Biology research project',
  'Year '+year+' · track: '+specialty+'. Original advisory teaching unit, not an accredited degree dissertation or real study.',
  '# 1. Testable question',
  'Define one specific biological question, an observable outcome and operational definitions. Explain what evidence could falsify the hypothesis.',
  '# 2. Mechanistic background',
  'State a plausible mechanism and its assumptions. Distinguish the original prediction from published evidence, and do not extrapolate simple models to every organism.',
  '# 3. Research design and ethics',
  'Specify independent biological units, predictor, outcome, control conditions, confounders and replication. Use public data or simulations unless ethical oversight and adequate safety arrangements are available. Never collect personal biological samples or culture unknown organisms.',
  '# 4. Worked illustration',
  'To compare plant growth under two light levels, keep species, water, temperature and observation time comparable. Measure multiple independent plants. If water and light vary together, the design cannot identify the light effect reliably.',
  '# 5. Data and uncertainty',
  'Report measurement units, sample size, sources of variation and uncertainty. Label axes and describe the limits of causal inference rather than relying solely on averages.',
  '# 6. Critical conclusion',
  'Conclude only what observations support. State confounders and alternative explanations; do not invent measurements, charts or citations.',
  '# Independent study task',
  prompt,
  'Submit your question, hypothesis, controlled variables, one control group, one limitation and a feasible follow-up test.'
 ];
 return parts.join('\n\n');
}
