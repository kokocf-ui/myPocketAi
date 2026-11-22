// GCSE Mathematics subject-content crosswalk, AQA 8300 (AQA publishes the
// same DfE content framework common to all exam boards).
// A "Higher" paper examines Foundation plus the additional Higher-only content.
// Source: https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/subject-content
// Each mapped reference below has a directly reviewed specification row.
export const MATH_GCSE_HIGHER_ONLY=Object.freeze({
 'Puterile cu exponent fracționar':'N7',
 'Ecuații pătratice cu formula generală':'A18',
 'Translatarea graficului unei funcții':'A13',
 'Intersecția dreptei cu o parabolă':'A19',
 'Asemănare și raportul volumelor':'G19',
 'Pitagora în spațiu':'G20',
 'Unghiuri la centru și pe cerc':'G10',
 'Teorema sinusurilor și cosinusurilor':'G22',
 'Grafice de creștere și descreștere exponențială':'A12',
 'Histograme cu clase de lățimi diferite':'S3',
 'Probabilități condiționate din tabel':'P9',
 'Teorema sinusurilor în triunghiuri oarecare':'G22'
});
export const MATH_GCSE_REFERENCE=Object.freeze({
 content:'https://www.gov.uk/government/publications/gcse-mathematics-subject-content-and-assessment-objectives',
 topicIndex:'https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification/subject-content',
 note:'Foundation excludes Higher-only items; Higher includes both. Year 10 and Year 11 are an illustrative ordering, not statutory annual syllabuses.'
});
export function mathGcseSelectTier(lessons,tier='all'){
 const entries=Array.isArray(lessons)?lessons:[];
 if(tier!=='foundation')return entries;
 return entries.filter(item=>!Object.prototype.hasOwnProperty.call(
  MATH_GCSE_HIGHER_ONLY,String(item.title||'')));
}
export function mathGcseLessonTier(lesson){
 return MATH_GCSE_HIGHER_ONLY[String(lesson?.title||'')]?'higher-only':'both';
}
