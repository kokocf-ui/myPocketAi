// Evidence-aware school Astronomy offers for the 2026/27 school year.
// A source proving a school OFFER or a broad framework does NOT verify the
// complete lesson sequence, the textbook, or a particular school's selection.
// No status is inferred from location, language, or neighbour countries.
export const ASTRONOMY_EUROPE_COUNTRIES=Object.freeze('AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK GB-ENG GB-SCT GB-WLS GB-NIR'.split(' '));
export const ASTRONOMY_EUROPE_FRAMEWORKS=Object.freeze({
 RO:Object.freeze({
  lower:{source:'https://www.isjialomita.ro/files/legi/Ordinul%20MEC%20nr.%203595%20din%202025.pdf',scope:'national-official-optional-offer',order:'OMEC 3595/2025'},
  upper:{source:'https://lege5.ro/Gratuit/ge4dsnrxguytk/ordinul-nr-4414-2026-privind-aprobarea-programelor-scolare-pentru-disciplinele-optionale-integrate-din-oferta-nationala-astronomie-cerul-mai-aproape-clasa-a-ix-a-astronomie-universul-in-miscare-clasa-',scope:'national-official-optional-offer',order:'OMEC 4414/2026'}
 }),
 'GB-ENG':Object.freeze({
  primary:{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',scope:'national-stage-and-year'},
  lower:{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',scope:'national-key-stage'}
 }),
 'GB-SCT':Object.freeze({
  primary:{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',scope:'broad-national-stage'},
  lower:{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',scope:'broad-national-stage'},
  upper:{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',scope:'broad-national-stage'}
 }),
 'GB-WLS':Object.freeze({
  primary:{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/designing-your-curriculum/',scope:'broad-progression-framework'},
  lower:{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/designing-your-curriculum/',scope:'broad-progression-framework'},
  upper:{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/designing-your-curriculum/',scope:'broad-progression-framework'}
 }),
 IE:Object.freeze({lower:{source:'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/expectations-for-students-learning-outcomes/',scope:'national-three-year-junior-cycle'}}),
 ES:Object.freeze({lower:{source:'https://www.boe.es/eli/es/rd/2022/03/29/217/con',scope:'national-ESO-minimum-regional-adaptation'}}),
 FR:Object.freeze({
  primary:{source:'https://eduscol.education.gouv.fr/6878/ressources-d-accompagnement-du-programme-de-sciences-et-technologie-au-cycle-3',scope:'legacy-cycle-3-CM2-2026'},
  lower:{source:'https://eduscol.education.gouv.fr/6878/ressources-d-accompagnement-du-programme-de-sciences-et-technologie-au-cycle-3',scope:'legacy-cycle-3-6e-2026'}
 }),
 'GB-NIR':Object.freeze({
  primary:{source:'https://www.education-ni.gov.uk/articles/statutory-curriculum',scope:'broad-current-curriculum'},
  lower:{source:'https://www.education-ni.gov.uk/articles/statutory-curriculum',scope:'broad-current-curriculum'}
 })
});
export const RO_ASTRONOMY_OPTIONALS=Object.freeze({
 lower:{
  '5':{ro:'Aventura cunoașterii Universului · clasa a V-a',en:'Exploring the Universe · Year 5',topics:['sky','solar','observations','stars']},
  '7':{ro:'Aventura cunoașterii Universului · clasa a VII-a',en:'Exploring the Universe · Year 7',topics:['solar','sky','distances','stars','observations']}
 },
 upper:{
  '9':{ro:'Astronomie. Cerul mai aproape',en:'Astronomy: The sky closer to us',topics:['sky','solar','observations','distances']},
  '10':{ro:'Astronomie. Universul în mișcare',en:'Astronomy: The moving universe',topics:['gravity','solar','sky','distances']},
  '11':{ro:'Astronomie. Stelele sub lupă',en:'Astronomy: A closer look at stars',topics:['stars','galaxies','observations','distances']},
  '12':{ro:'Astronomie. Universul și omul – o călătorie existențială',en:'Astronomy: The universe and humanity',topics:['cosmology','galaxies','stars','exoplanets']}
 }
});
export function astronomyCountryGradePlan({country='',stage='primary',grade='',years=[]}={}){
 const code=String(country||'').toUpperCase(),level=String(stage||''),year=String(grade||'');
 const valid=ASTRONOMY_EUROPE_COUNTRIES.includes(code)&&['primary','lower','upper'].includes(level)&&
  Array.isArray(years)&&years.some(item=>String(item?.id)===year);
 if(!valid)return {country:code,stage:level,grade:year,status:'invalid-selection',kind:'unverified',
  topicIds:[],source:null,sourceScope:null,programmeRo:null,programmeEn:null,offerVerified:false,
  topicsVerified:false,noteRo:'Selecție școlară invalidă.',noteEn:'Invalid school-year selection.'};
 const base=ASTRONOMY_EUROPE_FRAMEWORKS[code]?.[level]||null;
 const general={country:code,stage:level,grade:year,status:'country-curriculum-unverified',kind:'unverified',
  topicIds:[],source:null,sourceScope:null,programmeRo:null,programmeEn:null,
  offerVerified:false,topicsVerified:false,
  noteRo:'Parcurs original orientativ. Încadrarea astronomiei ca materie separată, integrată sau opțională nu este verificată pentru această țară și clasă.',
  noteEn:'Original advisory learning route. Astronomy as a separate, integrated or optional subject is not verified for this jurisdiction and school year.'};
 if(code==='RO'){
  const offer=RO_ASTRONOMY_OPTIONALS[level]?.[year];
  if(offer&&base)return {...general,status:'official-elective-offer',kind:'national-optional',
   topicIds:offer.topics,source:base.source,sourceScope:base.scope,
   programmeRo:offer.ro,programmeEn:offer.en,offerVerified:true,topicsVerified:false,
   noteRo:offer.ro+' · opțional integrat în oferta națională, nu materie obligatorie. Școala decide oferta efectivă; selecția capitolelor din aplicație este originală, nu cuprinsul oficial integral.',
   noteEn:offer.en+' · officially offered integrated elective, not a compulsory separate subject. School availability varies; these app chapters are original study choices, not a complete official syllabus.'};
  return {...general,status:'enrichment-only',kind:'enrichment',
   noteRo:'Astronomie pentru aprofundare liberă. Nu prezentăm o programă autonomă obligatorie și nu atribuim aceste lecții unei programe oficiale pentru această clasă.',
   noteEn:'Optional enrichment studies. No mandatory standalone Astronomy syllabus or officially prescribed annual lesson order is claimed.'};
 }
 if(code==='GB-ENG'){
  if(level==='primary'&&year==='Y5')return {...general,status:'science-curriculum-topic',kind:'integrated',
   topicIds:['solar','sky','observations'],source:base.source,sourceScope:base.scope,
   programmeRo:'Științe · Earth and space · Year 5',programmeEn:'Science · Earth and space · Year 5',
   offerVerified:true,topicsVerified:false,
   noteRo:'În England Year 5, „Earth and space” se predă în Științe. Nu este materie obligatorie separată de Astronomie; lecțiile aplicației sunt adaptări didactice.',
   noteEn:'England Year 5 teaches “Earth and space” within Science, not as separate compulsory Astronomy; app lessons are teaching adaptations.'};
  if(level==='lower'&&['Y7','Y8','Y9'].includes(year))return {...general,
   status:'science-key-stage-topic',kind:'integrated',topicIds:['sky','solar','stars','observations'],
   source:base.source,sourceScope:base.scope,programmeRo:'Științe · Space physics · Key Stage 3',
   programmeEn:'Science · Space physics · Key Stage 3',offerVerified:true,topicsVerified:false,
   noteRo:'„Space physics” aparține Key Stage 3 Science; programa stabilește etapa, NU repartizarea exactă pe Year 7, 8 sau 9. Lecțiile aplicației sunt orientative pe an.',
   noteEn:'Space physics is within Key Stage 3 Science; the national curriculum does NOT assign exact content to Year 7, 8 or 9. The app year sequence is advisory.'};
  return {...general,status:'enrichment-or-qualification-dependent',kind:'enrichment',
   noteRo:'Nu există aici o mapare anuală verificată pentru Astronomie separată. La GCSE/A-level conținutul depinde de calificare, profil și exam board; lecțiile sunt de aprofundare.',
   noteEn:'No verified separate Astronomy year syllabus here. GCSE/A-level content depends on qualification and examination board; the app lessons are enrichment.'};
 }
 if(code==='IE'&&level==='lower')return {...general,status:'integrated-framework',kind:'integrated',
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Junior Cycle Science · Earth and space',programmeEn:'Junior Cycle Science · Earth and space',
  noteRo:'În Irlanda, Earth and space este domeniu în Științe la Junior Cycle, cu competențe pe întregul ciclu de trei ani. Nu există aici o repartizare oficială exactă pe anul 1, 2 sau 3.',
  noteEn:'Ireland Junior Cycle Science includes Earth and space over the full three-year cycle; the source does not prescribe the app’s exact year-by-year order.'};
 if(code==='ES'&&level==='lower')return {...general,status:'integrated-framework',kind:'integrated',
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'ESO · Biología y Geología · La Tierra en el universo',
  programmeEn:'ESO · Biology and Geology · Earth in the universe',
  noteRo:'În Spania, cadrul minim ESO include originea Universului și a Sistemului Solar în Biología y Geología. Comunitatea autonomă și școala determină organizarea; nu atribuim o clasă exactă.',
  noteEn:'Spain ESO minimum curriculum includes the origins of the Universe and Solar System within Biology and Geology. Autonomous communities determine details; no exact year mapping is asserted.'};
 if(code==='FR'&&((level==='primary'&&year==='CM2')||(level==='lower'&&year==='6e')))
  return {...general,status:'integrated-year-framework',kind:'integrated',
   topicIds:['solar','sky','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'France · Sciences et technologie · Cycle 3 (programa 2023)',
   programmeEn:'France · Science and technology · Cycle 3 (2023 programme)',
   noteRo:'În anul 2026–2027, programa Cycle 3 din 2023 rămâne aplicabilă pentru CM2 și 6e. Temele Pământului și Sistemului Solar sunt integrate în Științe; ordinea fișelor aplicației nu este un manual oficial.',
   noteEn:'The 2023 Cycle 3 science programme still applies to CM2 and 6e in 2026–27. Earth and Solar System are integrated in Science; app lessons are not an official textbook.'};
 if(code==='GB-SCT')return {...general,status:'integrated-framework',kind:'integrated',
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:false,
  programmeRo:'Curriculum for Excellence · Sciences',programmeEn:'Curriculum for Excellence · Sciences',
  noteRo:'Sciences include teme despre Pământ și Univers; progresul se stabilește după nivelul Curriculum for Excellence, nu o clasă fixă. Nu pretindem echivalarea completă pe an.',
  noteEn:'Sciences include Earth and space contexts; Curriculum for Excellence uses progression levels, not a fixed Astronomy lesson for every school year.'};
 if(code==='GB-WLS')return {...general,status:'integrated-framework',kind:'integrated',
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:false,
  programmeRo:'Curriculum for Wales · Science and Technology',
  programmeEn:'Curriculum for Wales · Science and Technology',
  noteRo:'Subiectele despre spațiu pot fi abordate prin Science and Technology; cadrul este organizat pe progres, nu pe o listă națională fixă de lecții pentru fiecare clasă.',
  noteEn:'Space may be explored through Science and Technology; the framework is progression-based, not a mandatory identical Astronomy chapter list for each year.'};
 if(code==='GB-NIR'&&base)return {...general,status:'integrated-framework',kind:'integrated',
  source:base.source,sourceScope:base.scope,offerVerified:false,
  programmeRo:'Northern Ireland Curriculum · Științe',programmeEn:'Northern Ireland Curriculum · Science',
  noteRo:'Cadrul curent integrează științele; nu există în sursa consultată o ordine anuală verificată a astronomiei. Reforma curriculară propusă pentru 2028 nu este tratată ca programă 2026.',
  noteEn:'Current science curriculum is integrated; no astronomy-by-year sequence is verified. Proposed 2028 reforms are not treated as effective in 2026.'};
 return general;
}
