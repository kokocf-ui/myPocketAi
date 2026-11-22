// Cohort-sensitive upper-secondary mathematics display policy, NOT a national
// textbook mapping. National syllabus approval ≠ completion of our learning bank.
export const RO_MATH_UPPER_COHORT_SOURCES=Object.freeze({
 transition:'https://www.edu.ro/press_rel_02_2026',
 approved:'https://www.edu.ro/press_rel_29_2026',
 policy:'https://edu.ro/mesaj_ministru_Daniel_David_conspub_planuri_cadru_liceu'
});
export function mathUpperCohortGuidance({country,grade,schoolYear='2026/27'}={}){
 if(String(country||'').toUpperCase()!=='RO')return null;
 const g=String(grade||'');
 if(!['9','10','11','12'].includes(g))return null;
 // In 2026/27 the reform begins with the incoming class IX cohort, not all
 // currently enrolled cohorts. A future year must not inherit this rule blindly.
 if(schoolYear!=='2026/27')return {
  status:'needs-cohort-review',year:g,
  note:'Programele liceale se aplică progresiv pe cohorte. Verifică anul școlar, profilul și specializarea; această bibliotecă matematică este orientativă, nu certificată după un manual.',
  sources:RO_MATH_UPPER_COHORT_SOURCES};
 if(g==='9')return {
  status:'new-2026-cohort',year:g,
  note:'România, clasa a IX-a (2026/27): se aplică noul curriculum liceal început cu această cohortă. Trunchiul comun și curriculumul de specialitate diferă după profil. Lecțiile afișate sunt auxiliare generale și NU sunt încă mapate integral la programa oficială/profil/manual.',
  sources:RO_MATH_UPPER_COHORT_SOURCES};
 return {
  status:'legacy-cohort',year:g,
  note:'România, clasa a '+g+'-a (2026/27): această cohortă continuă pe curriculumul liceal anterior, nu pe programa nouă a clasei a IX-a. Profilul și specializarea pot modifica conținutul. Lecțiile sunt orientative, necertificate ca inventar anual complet.',
  sources:RO_MATH_UPPER_COHORT_SOURCES};
}
