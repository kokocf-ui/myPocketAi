// Curated references for an offline-first educational library.
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
  {id:'ro-primary-programmes',kind:'curriculum-index',min:1,max:4,subjects:RO_PRIMARY_SUBJECTS,
   ro:'Programe școlare pentru învățământul primar (catalog MEC)',en:'Romanian primary school programmes (MEC)',
   url:'https://www.edu.ro/invatamant-primar',
   noteRo:'Verifică disciplina și ordinul aplicabil clasei. Catalogul nu certifică lecțiile din aplicație.',
   noteEn:'Check the individual subject and applicable order; this index does not certify app lessons.'},
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
// Lookup is deterministic, with explicit scope and no AI-generated bibliography.
export function educationBibliographyFor(country,subject,grade){
 const key=String(country||'').toUpperCase(),s=String(subject||'').toLowerCase();
 const raw=String(grade||''),m=raw.match(/\d+/);
 const year=m?Number(m[0]):null;
 if(!Number.isInteger(year)||year<1||year>20)return [];
 return (EDUCATION_BIBLIOGRAPHY_DATA[key]||[]).filter(x=>
  x.min<=year&&x.max>=year&&(x.subjects.includes(s)||x.subjects.includes('*'))
 ).map(({subjects,min,max,...source})=>({...source,country:key,subject:s,grade:raw}));
}
