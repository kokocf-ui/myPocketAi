// Curated references for an offline-first educational library.
import {NATIONAL_UNIT_SOURCES} from './education_national_subject_units.mjs';
import {EDUCATION_WORLDWIDE_SCHEMES} from './education_worldwide_paths.mjs';
import {EUROPE_EDUCATION_SOURCES,EUROPE_EURYDICE_REFERENCE,EUROPE_EURYDICE_STRUCTURE_2026} from './education_europe_catalog.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
// A source link is NOT a full lesson or proof of an annual mandatory syllabus.
// All lessons remain in the app; these references provide provenance and legal
// scope without spending AI quota or silently changing authored lesson lists.
const RO_SCHOOL_SUBJECTS=['history','geography','literature','language','mathematics','physics','chemistry','biology','computing','civics'];
const RO_PRIMARY_SUBJECTS=['history','geography','literature','language','mathematics','biology','computing'];
const GB_SUBJECT_URLS={
 literature:'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study',
 language:'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study',
 mathematics:'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
 physics:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 chemistry:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 biology:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 astronomy:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 computing:'https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study',
 history:'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study',
 geography:'https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study',
 civics:'https://www.gov.uk/government/publications/national-curriculum-in-england-citizenship-programmes-of-study'
};
const GB_MANDATORY_RANGE={
 literature:[1,11],language:[1,11],mathematics:[1,11],
 physics:[1,11],chemistry:[1,11],biology:[1,11],astronomy:[1,11],
 computing:[1,11],history:[1,9],geography:[1,9],civics:[7,11]
};
export const EDUCATION_BIBLIOGRAPHY_DATA={
 RO:[
  {id:'ro-primary-structure',kind:'education-structure',min:1,max:4,subjects:RO_PRIMARY_SUBJECTS,
   ro:'Învățământul primar – structură și clase (MEC)',en:'Romanian primary school structure (MEC)',
   url:'https://www.edu.ro/invatamant-primar',
   noteRo:'Pagina descrie structura primară, nu conține toate programele disciplinelor. Verifică separat ordinul fiecărei discipline.',
   noteEn:'This page describes primary school structure, not each subject programme. Check the specific applicable order.'},
  {id:'ro-gymnasium-programmes',kind:'curriculum-framework',min:5,max:8,subjects:RO_SCHOOL_SUBJECTS,
   ro:'OMEN 3393/2017 – programe pentru gimnaziu',en:'Romania: lower-secondary curriculum, order 3393/2017',
   url:'https://www.edu.ro/Ordin_ministru_3393_2017',
   noteRo:'Sursă oficială pentru competențe și programe gimnaziale; ordinea lecțiilor din aplicație rămâne orientativă.',
   noteEn:'Official lower-secondary programmes; the app lesson sequence remains advisory.'},
  {id:'ro-2026-grade9',kind:'curriculum-transition',min:9,max:9,subjects:RO_SCHOOL_SUBJECTS,
   ro:'Programe liceale noi – clasa a IX-a, din 2026–2027',en:'New upper-secondary programmes: grade 9, from 2026–27',
   url:'https://www.edu.ro/press_rel_02_2026',
   noteRo:'Aplicare progresivă. Profilul și disciplina trebuie verificate separat.',
   noteEn:'Phased adoption. School track and individual subject must be verified separately.'},
  {id:'ro-upper-legacy',kind:'curriculum-index',min:10,max:13,subjects:RO_SCHOOL_SUBJECTS,
   ro:'Registrul programelor școlare în vigoare',en:'Register of applicable Romanian school programmes',
   url:'https://rocnee.eu/index.php/dcee-oriz/curriculum-oriz/programe-scolare-front/programe-scolare-in-vigoare',
   noteRo:'În 2026–2027, pentru clasele X–XII rămân în aplicare programe anterioare; verifică profilul și anul.',
   noteEn:'Older programmes still apply to grades 10–12 in 2026–27; verify track and year.'},
  {id:'ro-approved-textbooks',kind:'textbook-index',min:1,max:13,subjects:['*'],
   ro:'Biblioteca manualelor digitale aprobate de MEC',en:'Romanian ministry-approved digital textbooks',
   url:'https://www.edu.ro/manuale',
   noteRo:'Catalog pentru consultarea manualelor; disponibilitatea unui manual nu confirmă programa fiecărui capitol.',
   noteEn:'Textbook catalogue; the presence of a book does not certify each app chapter.'}
 ],
 'GB-ENG':[
  ...Object.entries(GB_SUBJECT_URLS).map(([subject,url])=>({
   id:'eng-stat-' + subject,kind:'curriculum-framework',
   min:GB_MANDATORY_RANGE[subject][0],max:GB_MANDATORY_RANGE[subject][1],subjects:[subject],
   ro:'Anglia – programă națională pentru '+subject,en:'England – national programme of study: '+subject,
   url,
   noteRo:'Cadrul oficial indică obiective pe Key Stage, nu o listă obligatorie de lecții pentru fiecare Year. GCSE/A-level cer exam board.',
   noteEn:'Official Key Stage framework, not compulsory named chapters per Year. GCSE/A-level require an exam board.'
  })),
  {id:'eng-oak-lessons',kind:'learning-resource-index',min:1,max:13,subjects:['*'],
   ro:'Oak National Academy – bibliotecă gratuită de lecții',en:'Oak National Academy – free lesson library',
   url:'https://www.thenational.academy/',
   noteRo:'Materiale didactice opționale, independente de obligativitatea legală; acoperirea variază pe materie.',
   noteEn:'Optional teaching resources, not legal requirements; availability varies by subject.'}
 ]
};
// Bring every previously indexed country reference into the SAME source system.
// An education portal, broad framework or third-party source is not proof of
// a national year-by-year syllabus or a complete subject library.
for(const code of new Set([...Object.keys(EDUCATION_WORLDWIDE_SCHEMES),...Object.keys(NATIONAL_UNIT_SOURCES)])){
 if(EDUCATION_BIBLIOGRAPHY_DATA[code])continue; // curated RO/England wins
 const url=EDUCATION_WORLDWIDE_SCHEMES[code]?.source||NATIONAL_UNIT_SOURCES[code];
 if(!/^https:\/\//.test(String(url||'')))continue;
 EDUCATION_BIBLIOGRAPHY_DATA[code]=[{
  id:'country-reference-'+code,kind:'country-education-reference',
  anyGrade:true,min:0,max:20,subjects:['*'],
  ro:'Sursă educațională pentru '+code,en:'Education reference for '+code,
  url,
  noteRo:'Punct de documentare generală. Nu confirmă programa acestei clase, obligația unei teme ori textul integral al lecției.',
  noteEn:'General background source. Not a verified syllabus for this year, compulsory topic or complete lesson.'
 }];
}
// Europe is the current completion scope. Existing non-European records remain
// intact and can be extended later. None of these links certify lesson text.
for(const [code,country] of Object.entries(EUROPE_EDUCATION_SOURCES)){
 const refs=EDUCATION_BIBLIOGRAPHY_DATA[code]||(EDUCATION_BIBLIOGRAPHY_DATA[code]=[]);
 if(country.url&&!refs.some(r=>r.url===country.url)){
  refs.push({
   id:'europe-official-source-'+code,kind:country.kind,
   anyGrade:true,min:0,max:20,subjects:['*'],
   ro:'Portal educațional: '+country.ro,en:'Education portal: '+country.en,
   url:country.url,
   noteRo:'Referință instituțională; programa exactă, profilul și anul clasei nu sunt confirmate de această adresă.',
   noteEn:'Institutional reference; this page does not certify the selected annual syllabus or school track.'
  });
 }
 const lit=LIT_EU_PROGRAMS[code];
 if(lit?.source&&!refs.some(r=>r.url===lit.source)){
  refs.push({
   id:'europe-literature-framework-'+code,kind:'subject-curriculum-reference',
   anyGrade:true,min:0,max:20,subjects:['literature','language'],
   ro:lit.sourceTitle||'Limbă și literatură: referință',en:lit.sourceTitle||'Language and literature reference',
   url:lit.source,
   noteRo:lit.note||'Verifică separat versiunea, clasa și profilul.',
   noteEn:'Verify the current version, school year and course before calling a syllabus official.'
  });
 }
 refs.push({
  id:'europe-structure-2026-'+code,kind:'education-system-comparison',
  anyGrade:true,min:0,max:20,subjects:['*'],
  ro:'Structura sistemelor educaționale europene 2026/2027 – Eurydice',
  en:'Structure of European education systems 2026/2027 – Eurydice',
  url:EUROPE_EURYDICE_STRUCTURE_2026,
  noteRo:'Comparație a structurilor școlare; nu este un manual sau programa tuturor materiilor.',
  noteEn:'School-system comparison, not a textbook or a subject-by-year syllabus.'
 });
 if(!country.url&&country.kind!=='not-national-school-system'){
  refs.push({
   id:'europe-documentation-'+code,kind:'country-education-reference',
   anyGrade:true,min:0,max:20,subjects:['*'],
   ro:'Eurydice – registrul sistemelor școlare europene',
   en:'Eurydice – European national education systems',
   url:EUROPE_EURYDICE_REFERENCE,
   noteRo:'Catalog general. Este posibil ca această jurisdicție să nu fie în rețeaua Eurydice; programa nu a fost verificată.',
   noteEn:'General directory. The jurisdiction may not participate; no individual syllabus has been verified.'
  });
 }
}
// Lookup is deterministic, with explicit scope and no AI-generated bibliography.
export function educationBibliographyFor(country,subject,grade){
 const key=String(country||'').toUpperCase(),s=String(subject||'').toLowerCase();
 const raw=String(grade||''),m=raw.match(/\d+/);
 const year=m?Number(m[0]):null;
 if(!raw||/univ|higher.education|master|bachelor|licen/i.test(raw))return [];
 const numeric=Number.isInteger(year)&&year>=1&&year<=20;
 return (EDUCATION_BIBLIOGRAPHY_DATA[key]||[]).filter(x=>
  ((x.anyGrade===true)|| (numeric&&x.min<=year&&x.max>=year))&&(x.subjects.includes(s)||x.subjects.includes('*'))
 ).map(({subjects,min,max,...source})=>({...source,country:key,subject:s,grade:raw}));
}
