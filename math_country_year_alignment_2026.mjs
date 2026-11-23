import {MATH_BULK_SOURCE_REGISTRY,MATH_BULK_STAGE_LABELS,bulkMathPhase} from './math_europe_batch_2026.mjs';
import {MATH_SECOND_BATCH_SOURCE_REGISTRY,MATH_SECOND_BATCH_STAGE_LABELS,secondBatchMathPhase} from './math_europe_second_batch_2026.mjs';
import {MATH_FINAL_SOURCES,MATH_FINAL_STAGE_LABELS,finalMathPhase} from './math_europe_final_systems_2026.mjs';
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
  manualExample:'https://podreczniki.men.gov.pl/podreczniki/4531/show',
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
 ,...MATH_BULK_SOURCE_REGISTRY,...MATH_SECOND_BATCH_SOURCE_REGISTRY,...MATH_FINAL_SOURCES});
// Mathematics-only stage labels; academic stage grouping is NOT a claim that
// a country has a separate institution called \"gimnaziu\".
export const MATH_COUNTRY_STAGE_LABELS=Object.freeze({"PL":{"primary":["Clasele I–III · educație integrată","Grades I–III · integrated education"],"lower":["Școala primară, clasele IV–VIII","Primary school, grades IV–VIII"],"intermediate":["Liceum · anii I–IV","Liceum · years I–IV"]},"FR":{"primary":["École élémentaire · CP–CM2","Primary · CP–CM2"],"lower":["Collège · 6e–3e","Collège · 6e–3e"],"intermediate":["Lycée · Seconde–Terminale","Lycée · Seconde–Terminale"]},"IT":{"primary":["Scuola primaria · 5 ani","Scuola primaria · 5 years"],"lower":["Scuola secondaria di I grado · 3 ani","Scuola secondaria di I grado · 3 years"],"intermediate":["Scuola secondaria di II grado · 5 ani","Upper secondary · primo biennio, secondo biennio, quinto anno"]},"HU":{"primary":["Általános iskola · clasele 1–4","Primary · grades 1–4"],"lower":["Școala generală/gimnázium · 5–8","General school/gymnasium · grades 5–8"],"intermediate":["Gimnázium/technikum · clasele 9–13","Gymnasium/technikum · grades 9–13"]},"ES":{"primary":["Educación Primaria · 3 cicluri, 6 ani","Educación Primaria · 3 cycles, 6 years"],"lower":["ESO · 4 ani, Matematică A/B în anul 4","ESO · 4 years, Mathematics A/B in year 4"],"intermediate":["Bachillerato · 2 ani, filieră specifică","Bachillerato · 2 years, modality-specific mathematics"]},"PT":{"primary":["Ensino Básico · 1.º ciclo","Basic education · cycle 1"],"lower":["Ensino Básico · 2.º și 3.º ciclos","Basic education · cycles 2 and 3"],"intermediate":["Ensino Secundário · anii 10–12","Upper secondary · years 10–12"]},"NL":{"primary":["Basisschool · Groep 1–8","Primary · Group 1–8"],"lower":["Voortgezet · V1–V3","Secondary · V1–V3"],"intermediate":["VMBO/HAVO/VWO · ani superiori","VMBO/HAVO/VWO · upper years"]},"IE":{"primary":["Primary · Junior Infants–Sixth Class","Primary · Junior Infants–Sixth Class"],"lower":["Junior Cycle · J1–J3","Junior Cycle · J1–J3"],"intermediate":["Senior Cycle · TY/5Y/6Y","Senior Cycle · TY/5Y/6Y"]},"DE":{"primary":["Grundschule · clasele 1–4, după land","Primary · grades 1–4, depending on Land"],"lower":["Sekundarstufe I · clasele 5–10","Secondary I · grades 5–10"],"intermediate":["Sekundarstufe II · clasele 11–13","Secondary II · grades 11–13"]},"AT":{"primary":["Volksschule · clasele 1–4","Volksschule · grades 1–4"],"lower":["Mittelschule/AHS · clasele 5–8","Lower school · grades 5–8"],"intermediate":["AHS/BHS · clasele 9–13","AHS/BHS · grades 9–13"]},...MATH_BULK_STAGE_LABELS,...MATH_SECOND_BATCH_STAGE_LABELS,...MATH_FINAL_STAGE_LABELS});
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
 const national=bulkMathPhase({country:code,stage:level,grade,years});
 if(national)return national;
 const second=secondBatchMathPhase({country:code,stage:level,grade,years});
 if(second)return second;
 const finalPath=finalMathPhase({country:code,stage:level,grade,years});
 if(finalPath)return finalPath;
 // Groep 1–2 and Junior/Senior Infants are play-based early years.
 // Six primary course phases must begin at Groep 3 / First Class, not at
 // the first infant year. The early-years card bank remains unchanged.
 if(level==='beginner'&&code==='NL'&&/^G[1-8]$/.test(String(grade))){
  const p=Math.max(1,Math.min(6,Number(String(grade).slice(1))-2));
  return {phase:p,phases:[p],yearIndex:index};
 }
 if(level==='beginner'&&code==='IE'){
  const p=/^[1-6]C$/.test(String(grade))?Number(String(grade)[0]):1;
  return {phase:p,phases:[p],yearIndex:index};
 }
 // Portugal's 5.º and 6.º years have different 2026 DGE syllabi.
 // The higher years remain explicitly advisory until reviewed.
 if(level==='lower'&&code==='PT'&&['5','6','7','8','9'].includes(String(grade))){
  const p=({'5':1,'6':2,'7':2,'8':3,'9':4})[String(grade)];
  return {phase:p,phases:[p],yearIndex:index};
 }
 // Poland's Grade IV begins separate mathematics in 2026. Grade V must
 // not share its first-year arithmetic/algebra phase by accidental rounding.
 if(level==='lower'&&code==='PL'&&['IV','V','VI','VII','VIII'].includes(String(grade))){
  const p=({IV:1,V:2,VI:2,VII:3,VIII:4})[String(grade)];
  return {phase:p,phases:[p],yearIndex:index};
 }
 // Spain: 6-year Primaria in three cycles, 4-year ESO with A/B optional
 // math in fourth year, and 2-year Bachillerato with modality-specific paths.
 // These IDs are Mathematics-only: other subjects keep their existing picker.
 if(code==='ES'){
  const p=String(grade||'');
  const phases=level==='beginner'&&/^P[1-6]$/.test(p)?[Number(p.slice(1))]:
   level==='lower'&&/^ESO[1-3]$/.test(p)?[Number(p.slice(3))]:
   level==='lower'&&['ESO4-A','ESO4-B'].includes(p)?[4]:
   level==='medium'&&['B1-CYT','B1-HCS','B1-GEN'].includes(p)?[1,2]:
   level==='medium'&&['B2-CYT','B2-HCS'].includes(p)?[3,4]:null;
  if(phases)return {phase:phases[phases.length-1],phases,yearIndex:index};
 }
 // Italian national cycle: 5 primaria + 3 secondaria I + 5 secondaria II.
 // The last year of first secondary cycle reviews the remaining lower-stage
 // skills; second secondary distinguishes two bienni and the fifth year.
 if(code==='IT'){
  const byGrade={
   beginner:{P1:[1],P2:[2],P3:[3],P4:[4],P5:[5]},
   lower:{M1:[1],M2:[2],M3:[3,4]},
   medium:{S1:[1],S2:[1],S3:[2],S4:[3],S5:[4]}
  };
  const phases=byGrade[level]?.[String(grade)];
  if(phases)return {phase:phases[phases.length-1],phases,yearIndex:index};
 }
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
 const manualApplicable=(code==='FR'&&g==='5e')||(code==='HU'&&g==='5')||(code==='PL'&&g==='IV');
 return {source:base.curriculum,manualExample:manualApplicable?base.manualExample||null:null,
  note:base.note,status:'framework-referenced-not-fully-verified'};
}
