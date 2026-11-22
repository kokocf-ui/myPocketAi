// Astronomy evidence must distinguish: officially taught as a standalone subject,
// embedded in a named school subject, optional enrichment, or still unverified.
// A programme published years ago does NOT automatically expire. Replacements
// are recorded by jurisdiction AND cohort/grade, not by comparing its date to 2026.
// Only scoped, source-backed grades may influence mandatory topic claims.
const evidence=Object.freeze({
 RO:[
  {stage:'lower',grades:['5'],subject:'Geografie',kind:'integrated',
   topicIds:['solar','sky'],sourceYear:2017,validFrom:'2017/18',
   source:'https://www.edu.ro/Ordin_ministru_3393_2017',
   secondary:'https://isj.vs.edu.ro/download/Programe_scolare_comparatie.pdf',
   title:'OMEN 3393/2017 – Geografie V, Terra în Univers'}
 ],
 'GB-ENG':[
  {stage:'primary',grades:['Y5'],subject:'Science – Earth and space',kind:'integrated',
   topicIds:['solar','sky'],sourceYear:2014,validFrom:'2014/15',
   source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',
   title:'National curriculum England, science Year 5 – Earth and space'}
 ],
 'GB-SCT':[
  {stage:'primary',grades:null,subject:'Sciences – Planet Earth',kind:'integrated',
   topicIds:null,sourceYear:2010,validFrom:null,
   source:'https://education.gov.scot/media/hpidflxa/sciences-eo.pdf',
   title:'Curriculum for Excellence sciences SCN 1–4; levels are not individual years'}
 ],
 'GB-NIR':[
  {stage:'lower',grades:null,subject:'Science – Earth and Universe',kind:'integrated',
   topicIds:null,sourceYear:2024,validFrom:null,
   source:'https://ccea.org.uk/downloads/docs/ccea-asset/General/Key%20Stage%203%20Non-Statutory%20Guidance%20for%20Science.pdf',
   title:'CCEA Key Stage 3 non-statutory Science guidance; topic year is school-dependent'}
 ],
 'GB-WLS':[
  {stage:'primary',grades:null,subject:'Science and Technology',kind:'integrated',
   topicIds:null,sourceYear:2022,validFrom:'2022/23',
   source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/designing-your-curriculum/',
   title:'Curriculum for Wales: science and technology; locally designed progression'}
 ],
 FR:[
  {stage:'primary',grades:['CM1'],subject:'Sciences et technologie – cycle 3',kind:'integrated',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://www.education.gouv.fr/bo/2026/Hebdo24/MENE2611650A',
   title:'Programme 2026; new cycle-3 curriculum in force for CM1 only in 2026/27'},
  {stage:'primary',grades:['CM2'],subject:'Sciences et technologie – cycle 3',kind:'integrated',
   topicIds:['solar','sky'],sourceYear:2023,validFrom:'2023/24',
   source:'https://eduscol.education.gouv.fr/6878/ressources-d-accompagnement-du-programme-de-sciences-et-technologie-au-cycle-3',
   title:'2023 cycle-3 programme RETAINED in CM2 for 2026/27, replaced in 2027/28'},
  {stage:'lower',grades:['6e'],subject:'Sciences et technologie – cycle 3',kind:'integrated',
   topicIds:['solar','sky'],sourceYear:2023,validFrom:'2023/24',
   source:'https://eduscol.education.gouv.fr/6878/ressources-d-accompagnement-du-programme-de-sciences-et-technologie-au-cycle-3',
   title:'2023 cycle-3 programme RETAINED in 6e for 2026/27, replaced in 2027/28'}
 ],
 IE:[
  {stage:'lower',grades:null,subject:'Junior Cycle Science – Earth and space',kind:'integrated',
   topicIds:null,sourceYear:2016,validFrom:null,
   source:'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/expectations-for-students-learning-outcomes/',
   title:'Junior Cycle Science: celestial objects and Earth–Sun–Moon outcomes across all three years; not assigned to a single year'}
 ],
 PL:[
  {stage:'lower',grades:['VI'],subject:'Geografia – Ruchy Ziemi',kind:'integrated',
   topicIds:['solar','sky'],sourceYear:2024,validFrom:'2024/25',
   source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/geografia',
   title:'Geography class VI: Earth in the Solar System, rotation and revolution'}
 ],
 ES:[
  {stage:'lower',grades:null,subject:'Biología y Geología / Ciencias',kind:'integrated',
   topicIds:null,sourceYear:2022,validFrom:'2022/23',
   source:'https://www.boe.es/buscar/act.php?id=BOE-A-2022-4975',
   title:'ESO minimum curriculum – solar system and universe; regional school mapping required'}
 ],
 PT:[
  {stage:'lower',grades:['7'],subject:'Físico-Química – Terra no Espaço',kind:'integrated',
   topicIds:['solar','sky','distances'],sourceYear:2026,validFrom:null,
   source:'https://dge.mec.pt/sites/default/files/7_fisico_quimica.pdf',
   title:'Aprendizagens Essenciais, Físico-Química 7.º ano, published March 2026; effective cohort not independently certified'}
 ],
 FI:[
  {stage:'primary',grades:null,subject:'Environmental studies',kind:'framework-only',
   topicIds:null,sourceYear:2014,validFrom:'2016/17',
   source:'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education',
   title:'National basic education curriculum – environmental studies; no grade-specific astronomy claim'}
 ]
});
export const ASTRONOMY_COUNTRY_EVIDENCE=evidence;
export function astronomyNationalAlignment({country='',stage='',grade=''}={}){
 // Keep this function self-contained: its source is embedded in Android WebView.
 // Module-local helpers such as evidence/applicable do not exist there.
 const code=String(country).toUpperCase(),items=ASTRONOMY_COUNTRY_EVIDENCE[code]||[];
 const applicable=item=>item.stage===stage&&
  (item.grades===null||item.grades.includes(String(grade)));
 const exact=items.find(x=>applicable(x)&&Array.isArray(x.grades));
 const framework=exact||items.find(x=>applicable(x))||null;
 const trulyYearScoped=Boolean(exact&&exact.topicIds?.length);
 return {
  country:code,stage,grade:String(grade),status:framework?
   (trulyYearScoped?'documented-topics':'documented-framework'):'source-not-yet-reviewed',
  kind:framework?.kind||'unknown',subjects:framework?.subject||null,
  yearScoped:trulyYearScoped,
  topicIds:trulyYearScoped?[...exact.topicIds]:null,
  source:framework?.source||null,sourceYear:framework?.sourceYear||null,
  sourceTitle:framework?.title||null,
  verifiedMandatoryAsStandalone:false,
  // No national school programme is inferred to have expired merely for being old.
  superseded:false,supercessionConfirmed:false,
  noteRo:framework?
   'Există o referință curriculară din '+framework.sourceYear+' pentru '+framework.subject+
   '. Data ei nu o invalidează automat. Astronomia este tratată în cadrul disciplinei indicate; programa completă a fiecărei clase nu este reprodusă aici.':
   'Programa națională de astronomie pentru această clasă nu a fost încă verificată. Aceasta nu înseamnă că țara nu are programă; sunt afișate lecții generale orientative.',
  noteEn:framework?
   'An existing '+framework.sourceYear+' reference covers '+framework.subject+
   '. An earlier publication date does not invalidate a programme. Astronomy is taught inside the named area; this is not its complete national syllabus.':
   'A country-specific Astronomy syllabus has not yet been verified for this year. This does not mean no syllabus exists; advisory lessons are offered.'
 };
}
