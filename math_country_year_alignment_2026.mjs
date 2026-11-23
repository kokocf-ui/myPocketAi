// Mathematics-only adaptation layer for the 2026/27 European school year.
// This file does NOT change the shared country picker or any other subject.
// Curriculum frameworks != textbook table of contents != approved annual course.
// Never mark a programme or year complete from this mapping alone.
export const MATH_EUROPE_SOURCE_REGISTRY=Object.freeze({
 FR:{
  curriculum:'https://eduscol.education.gouv.fr/4509/mathematiques',
  manualExample:'https://www.lelivrescolaire.fr/manuels/mathematiques-5eme-2026',
  note:'Franța: în 2026/27 noile programe de Matematică se aplică în CM2, 5e, Seconde și Première; clasele 4e și 3e intră ulterior. 5e are un exemplu de manual 2026, dar lecțiile aplicației nu au fost confruntate integral cu acesta.'
 },
 IT:{
  curriculum:'https://www.gazzettaufficiale.it/eli/gu/2026/01/27/21/sg/pdf',
  note:'Italia: noile Indicazioni Nazionali (DM 221/2025) se introduc treptat din 2026/27 la P1 și M1; celelalte cohorte din primul ciclu urmează încă indicațiile anterioare. Liceul diferă după tipul instituției.'
 },
 PL:{
  curriculum:'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane',
  note:'Polonia: matematica este disciplină distinctă în clasele IV–VIII; în I–III este parte a educației integrate. Reforma din septembrie 2026 începe la clasele I și IV, nu se aplică automat tuturor cohortelor.'
 },
 HU:{
  curriculum:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',
  manualExample:'https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA',
  note:'Ungaria: NAT 2020 organizează Matematica în intervalele 1–4, 5–8, 9–12. Manualul Matematika 5 este referință de cuprins pentru clasa 5, nu dovadă de acoperire completă. Clasa 13 aparține numai anumitor filiere tehnice.'
 },
 ES:{
  curriculum:'https://educagob.educacionfpydeportes.gob.es/normativa/curriculo.html',
  note:'Spania: Real Decreto 157/2022 (Primaria), 217/2022 (ESO), 243/2022 (Bachillerato) stabilesc cadrul de bază; distribuția finală pe ani depinde de comunitatea autonomă și itinerarul ales.'
 },
 PT:{
  curriculum:'https://www.dge.mec.pt/matematica',
  note:'Portugalia: Aprendizagens Essenciais de Matemática se verifică separat pentru anii 1.º–12.º; clasele 5–6 fac parte din ciclul II, clasele 7–9 din ciclul III. Lecțiile existente sunt auxiliare, nu reproduceri de manual.'
 },
 DE:{
  curriculum:'https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',
  note:'Germania: KMK publică standarde de competență; planul de Matematică pe clasă depinde de land, tipul școlii și profil. Nu există un cuprins anual unic federal.'
 },
 'GB-ENG':{
  curriculum:'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
  note:'Anglia: programele primare au obiective pe ani; KS3/KS4 nu prescriu aceeași ordine de lecții la toate școlile.'
 },
 NL:{
  curriculum:'https://www.slo.nl/kerndoelen/',
  note:'Țările de Jos: în Groep 1–2 Matematica este exploratorie (numărare, forme, măsurări), nu algebră formală. Obiectivele SLO 2025 nu sunt un cuprins pe fiecare clasă; în VMBO/HAVO/VWO diferențele sunt esențiale.'
 },
 IE:{
  curriculum:'https://curriculumonline.ie/repository/primary-subjects/mathematics/',
  note:'Irlanda: Junior și Senior Infants învață numere, forme și măsurare prin activități potrivite vârstei. Junior Cycle are trei ani; Leaving Certificate diferă după nivel și calificare.'
 },
 RO:{
  curriculum:'https://www.edu.ro/Ordin_ministru_3393_2017',
  note:'România: păstrează fără intervenții lecțiile deja lucrate pe clase și regulile de cohortă.'
 }
});
const stageAlias=stage=>stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
// Matematica Polonia: în clasa a IV-a devine disciplină distinctă, în timp ce
// clasele I–III sunt parte din edukacja wczesnoszkolna.
// Do not change classification for Literature, Physics, etc.
export function mathCountryYearSequence({country,stage,years=[]}={}){
 const list=Array.isArray(years)?years:[];
 const code=String(country||'').toUpperCase(),level=stageAlias(stage);
 if(code!=='PL')return list;
 if(level==='beginner')return list.filter(year=>String(year.id)!=='IV');
 if(level==='lower'&&!list.some(year=>String(year.id)==='IV'))
  return [{id:'IV',ro:'Klasa IV',en:'Grade IV',curriculumVerified:false,nationalYearVerified:true},...list];
 return list;
}
export function mathCountryPhasePlan({country,stage,grade,years=[]}={}){
 const level=stageAlias(stage),code=String(country||'').toUpperCase();
 const count={beginner:6,lower:4,medium:4,advanced:4}[level]||0;
 const index=years.findIndex(year=>String(year.id)===String(grade));
 if(index<0||!count||!years.length)return {phase:0,phases:[],yearIndex:index};
 // RO and English course collections are already worked on: keep them exact.
 if(code==='RO'||code==='GB-ENG'){
  const phase=Math.min(count,Math.floor(index*count/Math.max(count,years.length))+1);
  return {phase,phases:[phase],yearIndex:index};
 }
 // Primary learning must never accelerate age 7–9 into the sixth-year
 // fractions/percentages just because a country's primary stage is shorter.
 // The remaining material belongs to later school years, not to grade III.
 const n=years.length;
 if(level==='beginner'&&n<count){
  const phase=index+1;
  return {phase,phases:[phase],yearIndex:index};
 }
 // Secondary stages can offer the final two advisory phases within a shorter
 // national stage without rewriting the already authored lesson collection.
 const start=Math.floor(index*count/n)+1;
 const end=Math.floor((index+1)*count/n);
 const phases=Array.from({length:Math.max(1,end-start+1)},(_,i)=>Math.min(count,start+i));
 return {phase:phases[phases.length-1],phases,yearIndex:index};
}
export function mathCountryEvidence({country,stage,grade}={}){
 const code=String(country||'').toUpperCase(),g=String(grade||'');
 const base=MATH_EUROPE_SOURCE_REGISTRY[code];
 if(!base)return {source:null,manualExample:null,note:'Parcurs matematic orientativ. Programa națională și manualul clasei trebuie confruntate înainte de validare.',status:'unverified-advisory'};
 const manualApplicable=(code==='FR'&&g==='5e')||(code==='HU'&&g==='5');
 return {source:base.curriculum,manualExample:manualApplicable?base.manualExample||null:null,
  note:base.note,status:'framework-referenced-not-fully-verified'};
}
