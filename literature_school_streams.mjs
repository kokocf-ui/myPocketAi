// Country-, stage- and grade-aware school choices in Literature.
// School types are NOT a generic difficulty level: their availability depends
// on the pupil's current grade. Country of study is independent of GPS.
export function literatureTracksForGrade(country,level,grade,tracks=[]){
 const current=Array.isArray(tracks)?tracks:[];
 const named=(ids)=>ids.map(([id,ro,en])=>[id,ro,en||ro]);
 if(level==='advanced'||level==='beginner'&&country!=='MD'&&country!=='RS')return [];
 if(country==='HU'){
  const g=Number(grade);
  if(!Number.isInteger(g))return [];
  if(level==='lower'){
   const items=[['ALT','Általános iskola — școală generală (5–8)','Általános iskola — general school (5–8)']];
   if(g>=5&&g<=8)items.push(['G8','Nyolcévfolyamos gimnázium — din clasa 5','Eight-year gymnázium — from grade 5']);
   if(g>=7&&g<=8)items.push(['G6','Hatévfolyamos gimnázium — din clasa 7','Six-year gymnázium — from grade 7']);
   return named(items);
  }
  if(level==='medium'){
   if(g===13)return named([['TECH','Technikum — anul 13 (filieră tehnică)','Technikum — grade 13 (technical track)']]);
   if(g<9||g>13)return [];
   const items=[
    ['G4','Négyévfolyamos gimnázium — începe în clasa 9','Four-year gymnázium — starts in grade 9'],
    ['G6','Hatévfolyamos gimnázium — continuare/transfer','Six-year gymnázium — continuation/transfer'],
    ['G8','Nyolcévfolyamos gimnázium — continuare/transfer','Eight-year gymnázium — continuation/transfer'],
    ['TECH','Technikum — școală tehnică (9–13)','Technikum — technical school (9–13)']
   ];
   if(g<=11)items.push(['VOC','Szakképző iskola — școală profesională (9–11)','Vocational school (9–11)']);
   return named(items);
  }
  return [];
 }
 // These profile distinctions concern upper-secondary schools, not primary pupils.
 if(['PL','HR','TR'].includes(country))return level==='medium'?current:[];
 if(country==='AT'){
  if(level==='lower')return current.filter(x=>['MS','AHS'].includes(x[0]));
  if(level==='medium')return current.filter(x=>['AHS','BHS'].includes(x[0]));
  return [];
 }
 // In Serbia the option is the writing script, and in Moldova the
 // teaching language: both remain meaningful for all school levels.
 if(country==='RS'||country==='MD')return current;
 if(country==='RO')return grade==='9'?current:[];
 return current;
}
export const HUNGARY_ADMISSION_REFERENCES=Object.freeze({
 officialWritten:'https://njt.jog.gov.hu/jogszabaly/2012-20-20-5H.34',
 foreignPupils:'https://hazavaro.gov.hu/ugyleiras/secondary-school-admissions-procedure-kifir-system',
 curriculum:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat'
});
export function hungaryAdmissionTopicsForGrade(grade){
 const n=Number(grade);
 const targets=n===4?{next:5,type:'gimnázium de 8 ani',test:'după clasa a IV-a'}:
   n===6?{next:7,type:'gimnázium de 6 ani',test:'după clasa a VI-a'}:
   n===8?{next:9,type:'gimnázium de 4 ani / technikum / profesională',test:'după clasa a VIII-a'}:
   {next:Number.isInteger(n)&&n>=1&&n<=12?n+1:null,type:'transfer școlar',test:'cerințele instituției alese'};
 const context=targets.next
   ?'Clasa actuală '+grade+', intrare vizată în clasa '+targets.next+' ('+targets.type+').'
   :'Admitere/transfer în sistemul școlar din Ungaria, în funcție de instituție.';
 const source='Reglementare: '+HUNGARY_ADMISSION_REFERENCES.officialWritten+
   '; KIFIR / elevi veniți din străinătate: '+HUNGARY_ADMISSION_REFERENCES.foreignPupils+'.';
 const specific=' Nu inventa bareme, date limită, probe sau lista de documente a unei școli: verifică anunțul acelei instituții și anul de admitere. ';
 return [
  ['hu-adm-language','Limba maghiară — pregătire pentru admitere','Hungarian language — entrance preparation',
   context+' Predă în maghiară și explică în română dacă elevul solicită: citire, înțelegere, vocabular, ortografie, gramatică, argumentarea răspunsului. Exercițiile centralizate de limba maghiară diferă pentru intrarea în clasele 5, 7 și 9.'+specific+source],
  ['hu-adm-math','Matematică — pregătire pentru admitere','Mathematics — entrance preparation',
   context+' Propune probleme matematice originale în limba maghiară și explicații în română, potrivite clasei anterioare intrării. Lucrează raționament, aritmetică, geometrie și probleme cu text, fără a afirma că acestea sunt subiecte oficiale identice cu cele dintr-un an anume.'+specific+source],
  ['hu-adm-reading','Înțelegerea cerințelor și a textului școlar','Reading school instructions and school texts',
   context+' Exersează citirea orarelor, formularelor, enunțurilor, expresiilor școlare și textelor literare potrivite vârstei. Include simulări de interviu, dacă școala cere interviu.'+specific+source],
  ['hu-adm-transfer','Admitere sau transfer din România: acte și echivalare','Admission or transfer from Romania: records',
   context+' Explică diferența dintre evaluarea studiilor anterioare, înscriere prin KIFIR, transfer individual și cerințele de rezidență. Cere numele instituției și programa ei pentru cerințe exacte; prezintă doar informația confirmată în sursele indicate.'+specific+source]
 ];
}
