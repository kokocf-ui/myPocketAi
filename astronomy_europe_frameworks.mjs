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

 SE:Object.freeze({
  primary:{source:'https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan/subjects/GRGRFYS01?currentListHeading=Kursplaner+i+grundskolan&schoolType=GR&timespan=LATEST&typeOfSyllabus=COURSE_SYLLABUS',scope:'LGR22-physics-years-4-6'},
  lower:{source:'https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan/subjects/GRGRFYS01?currentListHeading=Kursplaner+i+grundskolan&schoolType=GR&timespan=LATEST&typeOfSyllabus=COURSE_SYLLABUS',scope:'LGR22-physics-years-7-9'},
  upper:{source:'https://www.skolverket.se/undervisning/gymnasieskolan/program-och-amnen-i-gymnasieskolan/gymnasieprogrammen-gy25/nationella-program/programs/na25/FYSK',scope:'GY25-physics-qualification'}
 }),
 FI:Object.freeze({primary:{source:'https://www.oph.fi/fi/koulutus-ja-tutkinnot/ymparistoopin-keskeisia-teemoja',scope:'national-environmental-studies-3-6-local-year-order'}}),
 NO:Object.freeze({
  primary:{source:'https://www.udir.no/lk20/nat01-04/kompetansemaal-og-vurdering/kv79',scope:'NAT01-04-learning-outcomes-by-grade-7'},
  upper:{source:'https://www.udir.no/lk20/nat01-04/kompetansemaal-og-vurdering/kv77',scope:'NAT01-04-Vg1-study-preparatory'}
 }),
 PL:Object.freeze({
  primary:{source:'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane',scope:'2026-reform-intake-I-IV'},
  lower:{source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/geografia',scope:'legacy-geography-cohorts-2026'},
  upper:{source:'https://zpe.gov.pl/a/dla-nauczyciela/DDPz14FRF',scope:'geography-first-year-teaching-reference'}
 }),
 MT:Object.freeze({lower:{source:'https://curriculum.gov.mt/wp-content/uploads/2025/05/syllabus_science_yr07_may_2025.pdf',scope:'national-year-7-science-unit-7-6'}}),
 PT:Object.freeze({primary:{source:'https://estudoautonomo.dge.mec.pt/recurso/o-sistema-solar',scope:'official-learning-resource-not-mandatory-syllabus'}}),
 CZ:Object.freeze({lower:{source:'https://www.edu.cz/wp-content/uploads/2021/07/RVP-ZV-2021.pdf',scope:'RVP-ZV-2021-school-implementation-dependent'}}),
 AT:Object.freeze({primary:{source:'https://ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Anlage=1&Artikel=&Gesetzesnummer=10009275&Paragraf=&Uebergangsrecht=',scope:'volksschule-sachunterricht-broad-primary-stage'}}),
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
 if(code==='ES'&&level==='lower'&&year==='ESO4')return {...general,
  status:'official-final-year-eso-topic',kind:'integrated',topicIds:['solar','stars','observations','sky'],
  source:'https://educagob.educacionfpydeportes.gob.es/ca/curriculo/curriculo-lomloe/menu-curriculos-basicos/ed-secundaria-obligatoria/materias/biologia-geologia/criterios-evaluacion-cuarto-curso.html',
  sourceScope:'national-ESO4-biology-geology',
  programmeRo:'ESO 4 · Biología y Geología · La Tierra en el universo',
  programmeEn:'ESO Year 4 · Biology and Geology · Earth in the Universe',
  offerVerified:false,
  noteRo:'Curriculum LOMLOE ESO 4 include originea Universului și a Sistemului Solar în Biología y Geología. Alegerea disciplinei și a distribuției pot varia după comunitatea autonomă.',
  noteEn:'LOMLOE ESO Year 4 Biology and Geology includes the origins of the Universe and Solar System; offering and allocation may vary by autonomous community.'};
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

 // Source-backed national programmes: compare year IDs with the existing country picker.
 // Goals and topic lists below are ORIGINAL teaching adaptations, not verbatim official syllabi.
 if(code==='SE'){
  if(level==='primary'&&['4','5','6'].includes(year))
   return {...general,status:'physics-stage-content',kind:'integrated',topicIds:['solar','sky','observations'],
    source:base?.source||null,sourceScope:base?.scope||null,
    programmeRo:'Fysik · mișcările corpurilor Sistemului Solar · anii 4–6',
    programmeEn:'Physics · Solar System movements · Years 4–6',
    noteRo:'Programa suedeză LGR22 include ziua/noaptea și anotimpurile în Fizică, la nivelul grupului 4–6. Nu stabilește că fiecare dintre acești ani predă aceleași capitole.',
    noteEn:'Swedish LGR22 Physics covers day/night and seasons across Years 4–6, not an identical syllabus assigned to each individual year.'};
  if(level==='lower'&&['7','8','9'].includes(year))
   return {...general,status:'physics-stage-content',kind:'integrated',topicIds:['stars','solar','sky','observations'],
    source:base?.source||null,sourceScope:base?.scope||null,
    programmeRo:'Fysik · Universul și exoplanetele · anii 7–9',
    programmeEn:'Physics · Universe and exoplanets · Years 7–9',
    noteRo:'În anii 7–9, Fizica LGR22 studiază originea, structura și evoluția Universului și posibilitatea descoperirii altor sisteme planetare; ordinea este stabilită local, nu anual.',
    noteEn:'LGR22 Years 7–9 Physics includes the origin, structure and evolution of the Universe and planets beyond our Solar System; exact year order is school-dependent.'};
  if(level==='upper')return {...general,status:'qualification-dependent',kind:'enrichment',
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Gymnasieskola · Fysik · Gy25',programmeEn:'Upper secondary Physics · Gy25',
   noteRo:'Astronomia se regăsește în unele trasee de Fizică Gy25, dar accesul depinde de program și nivelul cursului; nu este obligatorie în fiecare an de liceu.',
   noteEn:'Astronomy-related content can occur in Gy25 Physics pathways; the selected programme and course level determine whether it is taught, not the year alone.'};
 }
 if(code==='FI'&&level==='primary'&&['3','4','5','6'].includes(year))
  return {...general,status:'integrated-stage-framework',kind:'integrated',topicIds:['solar','sky','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Ympäristöoppi · Științe integrate · anii 3–6',
   programmeEn:'Environmental studies · Years 3–6',
   noteRo:'În Finlanda, studiul Sistemului Solar este cuprins în Ympäristöoppi pentru anii 3–6. Programa națională nu prescrie anul exact; școlile îl stabilesc local.',
   noteEn:'Finnish Environmental Studies includes the Solar System at Years 3–6; the local school curriculum chooses the particular year, so these lessons are stage-based.'};
 if(code==='NO'){
  if(level==='primary'&&['5','6','7'].includes(year))
   return {...general,status:'attainment-by-year-7',kind:'integrated',topicIds:['sky','solar','observations'],
    source:base?.source||null,sourceScope:base?.scope||null,
    programmeRo:'Naturfag · competențe după clasa a 7-a',
    programmeEn:'Natural science · learning outcomes by Year 7',
    noteRo:'NAT01-04 cere explicarea zilei, fazelor Lunii și anotimpurilor până după anul 7, fără a obliga școlile să le predea identic în clasele 5, 6 și 7.',
    noteEn:'NAT01-04 defines day, Moon phases and seasons as learning outcomes by Year 7; it does not prescribe the same chapters separately in Years 5, 6 and 7.'};
  if(level==='upper'&&year==='11')return {...general,status:'vg1-subject-conditional',kind:'integrated',
   topicIds:['cosmology','galaxies','stars','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Naturfag · Vg1 studieførebuande',programmeEn:'Natural science · Vg1 study preparatory',
   noteRo:'NAT01-04, Vg1 filiera de pregătire pentru studii: teoria Big Bang și observațiile care o susțin. Nu extindem această cerință la toate filierele liceale.',
   noteEn:'NAT01-04 Vg1 study-preparatory Science covers the Big Bang theory and supporting observations; this does not cover every upper-secondary track.'};
 }
 if(code==='PL'){
  if(level==='primary'&&year==='IV')return {...general,status:'2026-primary-reform',kind:'integrated',
   topicIds:['solar','sky','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Przyroda · clasa IV · reforma 2026',programmeEn:'Integrated Nature · Grade IV · 2026 reform',
   noteRo:'Reforma poloneză intră în 2026/27 la clasele I și IV; în clasa IV, Științele naturii (Przyroda) integrează noțiuni despre planeta Pământ. Nu aplicăm reforma automat claselor V–VIII.',
   noteEn:'The Polish 2026/27 reform starts in Grades I and IV. Grade IV Integrated Nature explores Earth; the new standard is not yet applied to the higher cohorts.'};
  if(level==='lower'&&['V','VI','VII','VIII'].includes(year))return {...general,
   status:'legacy-geography-stage',kind:'integrated',topicIds:['solar','sky','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Geografia · mișcările Pământului · programa anterioară',
   programmeEn:'Geography · Earth movements · pre-reform curriculum',
   noteRo:'În 2026/27, generațiile V–VIII folosesc încă programa anterioară la Geografie: Pământul în Sistemul Solar, rotație și revoluție; repartizarea exactă pe clasă trebuie confirmată.',
   noteEn:'The pre-2026 Geography curriculum continues for Grades V–VIII; Earth in the Solar System and its movements are included, but an exact year-specific ordering is not verified.'};
  if(level==='upper'&&year==='L1')return {...general,status:'geography-first-year-resource',kind:'integrated',
   topicIds:['solar','sky','distances','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Geografia · anul I de liceu',programmeEn:'Geography · first upper-secondary year',
   noteRo:'Materialul oficial ZPE pentru liceu, anul I, acoperă formarea Sistemului Solar și a Pământului. Este o resursă educațională corelată cu programa, nu dovada unei ordini unice naționale.',
   noteEn:'Polish ZPE offers a Year 1 Geography lesson on the formation of the Solar System and Earth. It supports teaching, not one mandatory national lesson order.'};
 }
 if(code==='MT'&&level==='lower'&&year==='7')return {...general,
  status:'verified-year-unit',kind:'integrated',topicIds:['solar','sky','distances','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Science · Year 7 · Unit 7.6 Earth and Space',
  programmeEn:'Science · Year 7 · Unit 7.6 Earth and Space',
  noteRo:'Programa malteză Year 7, unitatea 7.6, include mișcările Pământului și Lunii, anotimpurile, fazele, eclipsele, cele 8 planete și explorarea spațiului. În Fizică sunt incluse și gravitația, masa și greutatea; fișele aplicației sunt adaptate.',
  noteEn:'Malta Year 7 Science Unit 7.6 includes Earth–Moon motion, seasons, phases, eclipses, eight planets and space exploration, also touching gravity, mass and weight. App chapters are teaching adaptations.'};
 if(code==='PT'&&level==='primary'&&year==='3')return {...general,
  status:'official-teaching-resource',kind:'integrated',topicIds:['solar','sky','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Estudo do Meio · anul 3 · Sistemul Solar',
  programmeEn:'Environmental Studies · Year 3 · Solar System',
  noteRo:'Direção-Geral da Educação publică un material pentru clasa a 3-a despre Sistemul Solar la Estudo do Meio. Resursa justifică nivelul de studiu, dar nu certifică toate lecțiile ca programă națională obligatorie.',
  noteEn:'Portugal DGE provides a Year 3 Environmental Studies Solar System resource. It supports the school level, but does not certify the app’s full set of lessons as the mandatory annual syllabus.'};
 if(code==='CZ'&&level==='lower')return {...general,status:'integrated-general-framework',kind:'integrated',
  topicIds:['sky','solar','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'RVP ZV · Pământul ca astru / Sistemul Solar',
  programmeEn:'RVP ZV · Earth in space / Solar System',
  noteRo:'Cadrul RVP ZV din 2021 include Pământul ca astru, Sistemul Solar și fazele Lunii, dar programele școlare și tranziția la edițiile revizuite diferă. Nu atribuim o clasă exactă fără verificarea cohortei.',
  noteEn:'The Czech 2021 RVP ZV framework includes Earth in space, the Solar System and Moon phases; schools and the transition to newer versions differ, so the exact grade is not certified here.'};
 if(code==='AT'&&level==='primary')return {...general,status:'broad-integrated-primary',kind:'integrated',
  topicIds:['sky','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Volksschule · Sachunterricht · fenomene naturale',
  programmeEn:'Primary School · General Studies · natural phenomena',
  noteRo:'Programa austriacă Sachunterricht dezvoltă explorarea naturii, Soarelui și fenomenelor observabile. Nu confirmăm din această sursă o programă autonomă obligatorie despre toate planetele în fiecare clasă.',
  noteEn:'Austrian primary Sachunterricht covers the Sun and observable natural phenomena. This source does not establish a standalone compulsory all-planets syllabus for each year.'};
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
