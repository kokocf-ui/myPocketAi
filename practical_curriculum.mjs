import {readPracticalNodePack} from './practical_course_node_source.mjs';
// Original offline practical learning material. Training only: not financial, legal, medical or safety certification.
export const PRACTICAL_LEVELS=[{id:'beginner',ro:'Începător',en:'Beginner'},{id:'intermediate',ro:'Mediu',en:'Intermediate'},{id:'advanced',ro:'Avansat',en:'Advanced'}];
// Countries select context; verified resources are resolved by topic in practical_sources.mjs.
export const PRACTICAL_COUNTRIES=[
  [
    "RO",
    "România",
    "Romania"
  ],
  [
    "GB-ENG",
    "Anglia",
    "England"
  ],
  [
    "GB-SCT",
    "Scoția",
    "Scotland"
  ],
  [
    "GB-WLS",
    "Țara Galilor",
    "Wales"
  ],
  [
    "GB-NIR",
    "Irlanda de Nord",
    "Northern Ireland"
  ],
  [
    "FR",
    "Franța",
    "France"
  ],
  [
    "DE",
    "Germania",
    "Germany"
  ],
  [
    "IT",
    "Italia",
    "Italy"
  ],
  [
    "ES",
    "Spania",
    "Spain"
  ],
  [
    "PT",
    "Portugalia",
    "Portugal"
  ],
  [
    "PL",
    "Polonia",
    "Poland"
  ],
  [
    "NL",
    "Țările de Jos",
    "Netherlands"
  ],
  [
    "IE",
    "Irlanda",
    "Ireland"
  ]
];
// Navigation metadata only; chapters are fetched from the canonical pack.
export const PRACTICAL_COURSE_CATALOG=[
  {
    "id": "finance",
    "icon": "💷",
    "ro": "Finanțe personale",
    "en": "Personal finance",
    "summary": "Buget, economisire, credit, prevenirea fraudei.",
    "unit": "currency",
    "chapters": []
  },
  {
    "id": "trades",
    "icon": "🛠️",
    "ro": "Meserii și abilități",
    "en": "Trades and vocational skills",
    "summary": "Măsurare, materiale, organizarea lucrării și siguranță.",
    "unit": "tasks",
    "chapters": []
  },
  {
    "id": "business",
    "icon": "🚀",
    "ro": "Antreprenoriat",
    "en": "Entrepreneurship",
    "summary": "Idee, clienți, prețuri, plan, evidență și riscuri.",
    "unit": "business",
    "chapters": []
  },
  {
    "id": "digital",
    "icon": "💻",
    "ro": "Competențe digitale",
    "en": "Digital skills",
    "summary": "Fișiere, documente, tabele, securitate și colaborare.",
    "unit": "digital",
    "chapters": []
  },
  {
    "id": "career",
    "icon": "🧭",
    "ro": "Carieră și angajare",
    "en": "Careers and employment",
    "summary": "CV, interviu, competențe, proiecte și dezvoltare.",
    "unit": "career",
    "chapters": []
  },
  {
    "id": "daily",
    "icon": "🏠",
    "ro": "Viață practică",
    "en": "Everyday practical skills",
    "summary": "Planificare, reparații simple, consum, sănătate și siguranță.",
    "unit": "daily",
    "chapters": []
  }
];
export const PRACTICAL_COURSES=PRACTICAL_COURSE_CATALOG.map(c=>readPracticalNodePack(c.id)?.course||c);
export const PRACTICAL_STATEMENT='Materiale originale de orientare practică. Nu reprezintă certificare profesională, recomandare financiară individuală, aviz tehnic sau interpretare juridică. Pentru taxe, autorizări, siguranță și profesii reglementate se verifică sursele oficiale locale.';
export function practicalCourse(id){return PRACTICAL_COURSES.find(c=>c.id===id)||null}
export function practicalChapters(courseId,level){return (practicalCourse(courseId)?.chapters||[]).filter(x=>!level||x.level===level)}
export function practicalQuiz(courseId,chapterId,variant=0,limit=5){
 const course=practicalCourse(courseId);if(!course)return[];
 const chapter=course.chapters.find(x=>x.id===chapterId);if(!chapter)return[];
 // One question from this chapter, rotating through others in the same level.
 const peers=course.chapters.filter(x=>x.level===chapter.level&&x.id!==chapterId);
 const others=course.chapters.filter(x=>x.id!==chapterId&&!peers.includes(x));
 const tail=[...peers,...others]; const offset=((Number(variant)||0)%Math.max(1,tail.length)+Math.max(1,tail.length))%Math.max(1,tail.length);
 const ordered=[chapter,...tail.slice(offset),...tail.slice(0,offset)];
 return ordered.slice(0,Math.max(1,Math.min(5,limit))).map(x=>({...x.question,id:x.id,title:x.title,chapterId:x.id,subjectLevel:x.level}));
}
export function practicalScore(questions,answers){const count=questions.reduce((n,q,i)=>n+(Number.isInteger(answers[i])&&answers[i]===q.correct?1:0),0);return {correct:count,total:questions.length,percent:questions.length?Math.round(count*100/questions.length):null}}
