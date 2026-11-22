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


 SI:Object.freeze({lower:{source:'https://www.gov.si/assets/ministrstva/MVI/Dokumenti/Osnovna-sola/Ucni-nacrti/izbirni/1-letni/Astronomija_izbirni-v3.pdf',scope:'three-national-one-year-elective-modules-choice-not-grade-fixed'}}),
 RS:Object.freeze({upper:{source:'https://prosveta.gov.rs/prosveta/srednje-obrazovanje/gimnazije/specijalizovne-gimnazije-i-odeljenja/specijalizovana-odeljenja-za-ucenike-sa-posebnim-sposobnostima-za-fiziku/?pismo=lat',scope:'specialist-physics-gymnasium-year-4-only'}}),
 IT:Object.freeze({
  primary:{source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',scope:'new-first-cohort-P1-2026-vs-2012-existing-cohorts'},
  lower:{source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',scope:'new-first-cohort-M1-2026-vs-2012-existing-cohorts'}
 }),
 LT:Object.freeze({
  lower:{source:'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/38',scope:'national-science-curriculum-grade-6'},
  upper:{source:'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/15',scope:'national-elective-Astronomija-gymnasium-III-IV'}
 }),
 EE:Object.freeze({primary:{source:'https://oppekava.ee/pohiharidus/loodusained-2/loodusopetus/',scope:'national-general-studies-grade-4'}}),
 LV:Object.freeze({
  primary:{source:'https://skola2030.lv/lv/macibu-saturs/macibu-jomas/dabaszinatnes',scope:'national-science-integrated-grades-1-6'},
  upper:{source:'https://www.skola2030.lv/admin/filemanager/files/2/visp_vid_izgl_modelis.pdf',scope:'upper-secondary-optional-course-model-not-year-fixed'}
 }),
 AL:Object.freeze({primary:{source:'https://www.ascap.edu.al/Biblioteka/3Programe%20Lendore/1Programet%20e%20Arsimit%20Baze/Arsimi%20Baze/Klasa%205/Dituri-natyre-5-Dituri-Natyre.pdf',scope:'albania-grade5-nature-sciences-source-edition-to-confirm'}}),
 MK:Object.freeze({
  primary:{source:'https://bro.gov.mk/wp-content/uploads/2022/12/Prirodni-nauki-III-odd-FF5542.pdf',scope:'north-macedonia-2022-grade3-science'},
  lower:{source:'https://www.bro.gov.mk/wp-content/uploads/2023/03/Prirodni-nauki-6-odd..pdf',scope:'north-macedonia-2023-grade6-natural-sciences'}
 }),
 GR:Object.freeze({primary:{source:'https://www.iep.edu.gr/wp-content/uploads/2025/01/2024-09-16_138644_6_%CE%A0%CE%91%CE%A1%CE%91%CE%A1%CE%A4%CE%97%CE%9C%CE%91_1_%CE%93%CE%9B_%CE%9C%CE%91%CE%98._%CE%9A%CE%9B%CE%A0.pdf',scope:'IEP-2024-25-Grade6-Geography-teaching-guidance'}}),
 CY:Object.freeze({primary:{source:'https://archeia.moec.gov.cy/mc/2/ektenes_programma_fysikesepistimes.pdf',scope:'Cyprus-archived-primary-sciences-Celestial-Earth-theme'}}),
 SK:Object.freeze({primary:{source:'https://www.statpedu.sk/files/articles/dokumenty/statny-vzdelavaci-program/prirodoveda_isced1.pdf',scope:'legacy-2011-Prírodoveda-Universe-grade4-2026-reform-transition'}}),
 HR:Object.freeze({
  lower:{source:'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_148.html',scope:'Croatian-official-Priroda-grade-6'}
 }),
 IS:Object.freeze({
  primary:{source:'https://www.adalnamskra.is/grunnskoli/kafli-22-natturugreinar-2024',scope:'Iceland-2024-Nature-Science-attain-by-Year-4-or-7'},
  lower:{source:'https://www.adalnamskra.is/grunnskoli/kafli-22-natturugreinar-2024',scope:'Iceland-2024-Nature-Science-attain-by-Year-10'}
 }),
 HU:Object.freeze({
  primary:{source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',scope:'Hungarian-NAT2020-integrated-environmental-studies-Years-3-4'},
  lower:{source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',scope:'Hungarian-NAT2020-science-Years-5-6-and-physics-geography-Years-7-8'}
 }),
 MD:Object.freeze({upper:{source:'https://edu.gov.md/sites/default/files/geografie_liceu_ro.pdf',scope:'national-geography-2019-physical-geography-grade-10'}}),
 TR:Object.freeze({lower:{source:'https://tymm.meb.gov.tr/fen-bilimleri-dersi/unite/409',scope:'national-2026-27-grade6-unit1-12-hours'}}),
 BG:Object.freeze({lower:{source:'https://www.mon.bg/nfs/2023/12/up_vii_fizika.pdf',scope:'ministry-physics-and-astronomy-grade-7'}}),
 UA:Object.freeze({upper:{source:'https://mon.gov.ua/static-objects/mon/sites/1/zagalna%20serednya/programy-10-11-klas/ast-ak.pdf',scope:'ministry-astronomy-grade-11-2017-programme'}}),
 NL:Object.freeze({primary:{source:'https://www.slo.nl/thema/meer/tule/orientatie-jezelf-wereld/kerndoel-46/',scope:'SLO-core-objective-46-primary-natural-science'}}),
 DK:Object.freeze({primary:{source:'https://emu.dk/sites/default/files/2020-09/Gsk_fagh%C3%A6fte_naturteknologi.pdf',scope:'Falles-Mal-natur-teknologi-primary-grade-bands'}}),
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
 // Advisory placeholder IDs are NOT official national school years.
 if(year.startsWith('general-'))return general;
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








 if(code==='GR'&&level==='primary'&&year==='6')return {...general,
  status:'grade6-geography-earth-as-planet-guide',kind:'integrated',
  topicIds:['solar','sky','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Γεωγραφία · clasa a VI-a · Pământul ca astru',
  programmeEn:'Geography · Grade 6 · Earth as a celestial body',
  noteRo:'Institutul grec IEP, în îndrumarul oficial de Geografie pentru 2024–2025, recomandă în clasa a VI-a Pământul ca astru (6 ore): forma și mișcările Pământului, zi-noapte, anotimpuri și Sistemul Solar. Reconfirmarea ediției de îndrumare 2026–2027 rămâne necesară; nu este disciplină Astronomie separată.',
  noteEn:'Greek IEP Grade 6 Geography 2024–25 teaching guidance includes a six-hour Earth-as-celestial-body unit covering Earth motions, day/night, seasons and the Solar System. Guidance version for 2026–27 still requires confirmation; not standalone Astronomy.'};
 if(code==='CY'&&level==='primary'&&['1','3','4','6'].includes(year))return {...general,
  status:'archived-celestial-earth-by-primary-grade',kind:'integrated',
  topicIds:year==='1'?['sky','observations']:year==='3'?['sky','solar','observations']:
   year==='4'?['solar','sky','observations']:['solar','sky','observations','distances'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Φυσικές Επιστήμες · Ουρανός και Γη · clasa '+year,
  programmeEn:'Natural Sciences · Sky and Earth · Grade '+year,
  noteRo:'Arhiva curriculară oficială din Cipru pentru „Cerul și Pământul” diferențiază pe clase: I zi/noapte, III mișcările Pământului și anotimpurile, IV Pământ-Lună și Sistemul Solar, VI explorarea spațiului și eclipse. Nu confundăm arhiva cu o confirmare automată a programei 2026–2027.',
  noteEn:'Cyprus archived official Sky and Earth programme differentiates Grade 1 day/night, Grade 3 Earth movements/seasons, Grade 4 Earth/Moon/Solar System, and Grade 6 eclipses and space exploration. Applicability of this archived edition in 2026–27 needs confirmation.'};
 if(code==='SK'&&level==='primary'&&year==='4')return {...general,
  status:'legacy-grade4-universe-programme',kind:'integrated',
  topicIds:['sky','solar','stars','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Prírodoveda · clasa a 4-a · Vesmír',
  programmeEn:'Natural Science · Grade 4 · Universe',
  noteRo:'Programa istorică slovacă Prírodoveda 2011 recomandă „Vesmír” în clasa a IV-a (uneori a III-a): cele opt planete, Soarele ca stea, Luna, zi-noapte și anotimpurile. Nu preluăm afirmații științifice depășite din document. Reforma ŠVP 2023 intră obligatoriu în 2026–2027 începând cu clasa I, iar cursurile generațiilor mai mari pot diferi după adoptarea școlii.',
  noteEn:'Slovak legacy 2011 Grade 4 Prírodoveda recommends the Universe unit, eight planets, the Sun, Moon, day/night and seasons, but contains obsolete science statements which are NOT reused. The 2023 curriculum reforms phase in mandatorily from Grade 1 in 2026–27; earlier adopter schools may differ.'};
 if(code==='HR'&&level==='lower'&&year==='6')return {...general,
  status:'national-priroda-grade6-celestial-cycles',kind:'integrated',
  topicIds:['solar','sky','observations','stars'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Priroda · clasa VI · cicluri ale corpurilor cerești',
  programmeEn:'Nature Science · Grade 6 · Celestial cycles',
  noteRo:'Croația are curriculumul național Priroda pentru clasa a VI-a, cu demonstrații despre ciclurile Soarelui și Lunii, constelații observabile, Sistemul Solar și relația dintre acestea și ritmurile vieții. Astronomia este integrată în Științele naturii.',
  noteEn:'Croatian national Grade 6 Priroda asks students to observe repeated patterns related to the Sun, Moon and visible constellations, connecting them to life on Earth. This is integrated Nature Science, not separate compulsory Astronomy.'};
 if(code==='IS'&&['primary','lower'].includes(level))return {...general,
  status:'national-2024-natural-science-outcomes',kind:'integrated',
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Náttúrugreinar · 2024 · competențe la sfârșit de 4, 7 sau 10',
  programmeEn:'Natural Sciences 2024 · learning outcomes at Years 4, 7 and 10',
  noteRo:'Islanda are programă națională de Științe ale naturii din 2024, cu rezultate urmărite la finalul anilor 4, 7 și 10, inclusiv anotimpurile și fazele Lunii. Școala determină repartizarea lecțiilor în anii intermediari; fișele de Astronomie rămân adaptări didactice.',
  noteEn:'Iceland 2024 Natural Sciences curriculum describes attainment at the end of Years 4, 7 and 10, including seasons and Moon phases. Schools determine the teaching sequence between milestones; app Astronomy cards are adaptations.'};
 if(code==='HU'){
  if(level==='primary'&&['3','4'].includes(year))return {...general,
   status:'national-environmental-studies-2020',kind:'integrated',
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Környezetismeret · clasele 3–4 · NAT 2020',
   programmeEn:'Environmental Studies · Grades 3–4 · NAT 2020',
   noteRo:'În Ungaria, NAT 2020 include Környezetismeret în clasele 3–4. Nu atribui acestei clase un capitol astronomic obligatoriu separat, deoarece programa națională este cadru și conținutul exact trebuie verificat pe capitole.',
   noteEn:'Hungarian NAT 2020 includes Environmental Studies in Grades 3–4. The exact Astronomy chapter allocation is not certified here; no standalone compulsory Astronomy course is claimed.'};
  if(level==='lower'&&['5','6','7','8'].includes(year))return {...general,
   status:'national-integrated-science-or-geography-2020',kind:'integrated',
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:Number(year)<=6?'Természettudomány · clasele 5–6 · NAT 2020':'Fizika/Földrajz · clasele 7–8 · NAT 2020',
   programmeEn:Number(year)<=6?'Natural Sciences · Grades 5–6 · NAT 2020':'Physics/Geography · Grades 7–8 · NAT 2020',
   noteRo:'NAT 2020 diferențiază Természettudomány în anii 5–6 și disciplinele Fizica/Geografia în anii 7–8. Astronomia poate apărea integrată, dar din sursele disponibile nu este confirmată o listă oficială a capitolelor pentru fiecare an.',
   noteEn:'NAT 2020 places integrated Natural Sciences in Years 5–6 and separate Physics/Geography in Years 7–8. Astronomy topics can be integrated, but an exact annual national chapter list has not been verified.'};
 }
 if(code==='AL'&&level==='primary'&&year==='5')return {...general,
  status:'national-grade5-solar-system-science',kind:'integrated',
  topicIds:['solar','sky','stars','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:'Dituri natyre · clasa a V-a · Sistemi diellor',
  programmeEn:'Nature Studies · Grade 5 · Solar System',
  noteRo:'Programul albanez de Științe ale naturii pentru clasa V descrie Sistemul Solar, mărimile și perioadele planetelor, fazele Lunii, eclipsele, anotimpurile, stelele și constelațiile. Sursa este o ediție oficială arhivată ASCAP; confirmarea aplicabilității integrale în 2026/27 rămâne necesară.',
  noteEn:'Albanian archived official Grade 5 Nature Studies syllabus covers the Solar System, planetary sizes and periods, Moon phases, eclipses, seasons and constellations. Its full applicability to the 2026/27 cohort still requires confirmation.'};
 if(code==='MK'){
  if(level==='primary'&&year==='3')return {...general,
   status:'national-grade3-universe-and-celestial-bodies',kind:'integrated',
   topicIds:['sky','solar','observations','stars'],
   source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
   programmeRo:'Природни науки · clasa a III-a · Universul și corpurile cerești',
   programmeEn:'Natural Science · Grade 3 · Universe and celestial bodies',
   noteRo:'În Macedonia de Nord, programa de Științe ale naturii pentru clasa III include tema „Вселена и небесни тела”: Soare, stele, planete, sateliți, Pământ și Lună. Este știință integrată, nu materie separată de Astronomie.',
   noteEn:'North Macedonia Grade 3 Natural Science includes “Universe and celestial bodies”: Sun, stars, planets, satellites, Earth and Moon. It is integrated Science, not separate Astronomy.'};
  if(level==='lower'&&year==='6')return {...general,
   status:'national-grade6-universe-and-solar-system',kind:'integrated',
   topicIds:['solar','sky','stars','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
   programmeRo:'Природни науки · clasa a VI-a · Universul și Sistemul Solar',
   programmeEn:'Natural Science · Grade 6 · Universe and Solar System',
   noteRo:'Ministerul Educației din Macedonia de Nord, programa pentru clasa VI (2023), include „Вселена и Сончев систем”: galaxii, Sistemul Solar, planete, Luna, faze, comete și rotație/revoluție. Nu introducem lecții de cosmologie matematică universitară la acest nivel.',
   noteEn:'North Macedonia Grade 6 Natural Science (2023) covers Universe and Solar System: galaxies, planets, the Moon, phases, comets and Earth motion. Advanced mathematical cosmology is excluded from this grade.'};
 }
 if(code==='TR'&&level==='lower'&&year==='6')return {...general,
  status:'national-grade6-solar-and-eclipses-unit',kind:'integrated',
  topicIds:['solar','sky','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Fen Bilimleri · clasa 6 · Güneş Sistemi ve Tutulmalar · 12 ore',
  programmeEn:'Science · Grade 6 · Solar System and Eclipses · 12 hours',
  noteRo:'În Türkiye, Türkiye Yüzyılı Maarif Modeli include în clasa 6, la Fen Bilimleri, unitatea „Güneş Sistemi ve Tutulmalar” (12 ore): clasificarea planetelor, construirea și revizuirea modelelor Sistemului Solar, eclipse solare și lunare. Nu este o disciplină separată obligatorie de Astronomie.',
  noteEn:'Türkiye Year 6 national Science contains the 12-hour “Solar System and Eclipses” unit: planet classification, construction and revision of Solar System models, solar and lunar eclipses. This is integrated Science, not separate compulsory Astronomy.'};
 if(code==='MD'&&level==='upper'&&year==='10')return {...general,
  status:'national-geography-grade10-universe-module',kind:'integrated',
  topicIds:['solar','sky','gravity','observations','distances'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Geografie fizică generală · clasa X · Pământul în Univers',
  programmeEn:'Physical Geography · Grade 10 · Earth in the Universe',
  noteRo:'Curriculumul național al Republicii Moldova la Geografie, clasa X, începe cu modulul „Pământul – individualitate în univers” (9 ore). Include Universul, Sistemul Solar, influența Soarelui, rotația și revoluția Pământului și gravitația. Conținuturile marcate * nu intră în examenul de bacalaureat; disciplina este Geografie, nu Astronomie autonomă.',
  noteEn:'Moldova national Grade 10 Geography starts with the nine-hour “Earth in the Universe” module: Solar System, the Sun, Earth’s rotation and revolution, and gravity. Starred subtopics are excluded from the Baccalaureate examination; this is Geography rather than a standalone Astronomy class.'};
 if(code==='BG'&&level==='lower'&&year==='7')return {...general,
  status:'mandatory-physics-astronomy-grade-7',kind:'integrated',
  topicIds:['solar','sky','stars','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Физика и астрономия · clasa a VII-a',
  programmeEn:'Physics and Astronomy · Grade 7',
  noteRo:'Ministerul Educației din Bulgaria publică programa pentru clasa VII la disciplina obligatorie „Физика и астрономия”, care include Sistemul Solar, clasificarea planetelor, cosmosul, stelele și metode de observare. Este fizică și astronomie integrate, nu curs autonom exclusiv de Astronomie.',
  noteEn:'Bulgarian Ministry Grade 7 Physics and Astronomy curriculum covers the Solar System, grouping planets, the cosmos, stars and observation. It is the combined Physics and Astronomy subject, not a standalone compulsory Astronomy course.'};
 if(code==='UA'&&level==='upper'&&year==='11')return {...general,
  status:'national-astronomy-grade-11-curriculum',kind:'integrated',
  topicIds:['sky','observations','distances','gravity','solar','stars','galaxies','cosmology'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Астрономія · clasa a 11-a · 17 ore / an (nivel standard)',
  programmeEn:'Astronomy · Grade 11 · 17 hours yearly (standard level)',
  noteRo:'Ministerul Educației din Ucraina publică programă națională de Astronomie pentru clasa a XI-a (17 ore/an, nivel standard), cu obiectele astronomiei, observarea cerului, coordonate, legi Kepler, Sistemul Solar, stele și galaxii. Școala poate utiliza un curs separat ori Fizică și Astronomie integrat; reforma profilului 2027 nu este tratată ca intrată în vigoare în 2026.',
  noteEn:'Ukraine Ministry Grade 11 Astronomy national syllabus provides 17 yearly hours at standard level, covering celestial observations, coordinates, Kepler laws, the Solar System, stars and galaxies. Schools may use the separate or integrated Physics and Astronomy programme; planned profile-school changes from 2027 are not imposed in 2026.'};
 if(code==='NL'&&level==='primary'&&/^G[1-8]$/.test(year)){
  const n=Number(year.slice(1));
  const ids=n<=2?['sky','observations']:n<=4?['sky','solar','observations']:n<=6?['solar','sky','observations']:['solar','sky','observations','distances'];
  return {...general,status:'national-primary-core-goal-46',kind:'integrated',
   topicIds:ids,source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Natuur en techniek · kerndoel 46 · Groep '+n,
   programmeEn:'Nature and technology · Core objective 46 · Group '+n,
   noteRo:'În Olanda, kerndoel 46 include zi/noapte, anotimpuri și mișcările relative Pământ–Soare–Lună. SLO prezintă exemple diferențiate pentru grupurile 1–2, 3–4, 5–6 și 7–8, dar nu un cuprins obligatoriu identic pentru fiecare clasă. Fișele din aplicație sunt adaptări.',
   noteEn:'Netherlands primary core objective 46 covers day/night, seasons and Earth–Moon–Sun relationships. SLO offers example progressions for Groups 1–2, 3–4, 5–6 and 7–8, not a prescribed identical chapter list for each individual grade.'};
 }
 if(code==='DK'&&level==='primary'&&/^[1-6]$/.test(year)){
  const n=Number(year),ids=n<=2?['sky','observations']:n<=4?['solar','sky','observations']:['solar','sky','distances','observations'];
  return {...general,status:'national-primary-science-band',kind:'integrated',
   topicIds:ids,source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Natur/teknologi · Jorden og solsystemet · anul '+n,
   programmeEn:'Nature and technology · Earth and Solar System · Year '+n,
   noteRo:'În Danemarca, Natur/teknologi este o disciplină integrată în anii 1–6. Cadrul Fælles Mål descrie Jorden og solsystemet și modele despre planete, mișcarea lor și sateliți; din 2025 unele obiective specifice sunt orientative. Ordinea din aplicație este diferențiată pedagogic, nu programa obligatorie anuală.',
   noteEn:'Denmark Natur/teknologi is integrated in Years 1–6. The Fælles Mål guidance covers Earth, planets and orbital models. Since 2025 certain detailed goals are advisory, and the app’s grade allocation is a teaching adaptation rather than a compulsory national year sequence.'};
 }
 if(code==='SI'&&level==='lower'&&['7','8','9'].includes(year))return {...general,
  status:'national-three-electives-no-fixed-grade',kind:'national-optional',
  topicIds:['solar','sky','observations','stars'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Astronomija · trei module opționale anuale',programmeEn:'Astronomy · three optional one-year modules',
  electiveModules:[
   {id:'sun-earth-moon',ro:'Sonce, Luna in Zemlja',en:'Sun, Moon and Earth',hours:35,topics:['solar','sky','observations']},
   {id:'telescopes-planets',ro:'Daljnogledi in planeti',en:'Telescopes and planets',hours:35,topics:['solar','observations']},
   {id:'stars-universe',ro:'Zvezde in vesolje',en:'Stars and universe',hours:35,topics:['stars','sky']}
  ],
  noteRo:'Ministerul Educației din Slovenia publică trei programe de Astronomija, fiecare opțional pentru un an școlar (35 sau 32 de ore), la clasele 7–9. Sunt module distincte, iar școala și elevul aleg cursul; NU atribuim o temă fixă clasei 7, 8 sau 9.',
  noteEn:'Slovenia offers three distinct national one-year Astronomy electives (35 or 32 hours) for Years 7–9. The school and pupil select a course; the app does not assign a fixed module to Year 7, 8 or 9.'};
 if(code==='RS'&&level==='upper'&&year==='G4')return {...general,
  status:'specialist-physics-gymnasium-year-4',kind:'integrated',
  topicIds:['stars','galaxies','gravity','distances','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Gimnazija · fizică specializată · anul 4 · Osnove astrofizike i astronomije',
  programmeEn:'Physics specialist gymnasium · Year 4 · Foundations of Astrophysics and Astronomy',
  noteRo:'În Serbia, doar filiera de gimnaziu specializată pentru elevii cu aptitudini în Fizică cuprinde în anul IV „Osnove astrofizike i astronomije”. Nu extindem această materie automat către toate liceele.',
  noteEn:'Serbia Year 4 specialised Physics gymnasium explicitly includes Foundations of Astrophysics and Astronomy. It must NOT be shown as a compulsory subject in all upper-secondary schools.'};
 if(code==='IT'&&['primary','lower'].includes(level))return {...general,
  status:(level==='primary'&&year==='P1'||level==='lower'&&year==='M1')?'new-national-framework-2026':'legacy-national-framework-2012',
  kind:'integrated',source:base?.source||null,sourceScope:base?.scope||null,
  programmeRo:(level==='primary'&&year==='P1'||level==='lower'&&year==='M1')?
   'Indicazioni nazionali 2025 · aplicate în 2026/27 pentru primul an':
   'Indicazioni nazionali 2012 · generații începute înainte de 2026/27',
  programmeEn:(level==='primary'&&year==='P1'||level==='lower'&&year==='M1')?
   '2025 national guidelines · first-year entry in 2026/27':'2012 national guidelines · continuing cohorts',
  noteRo:'Italia aplică treptat DM 221/2025 din 2026/27 în primele clase de școală primară și secundară de grad I. Generațiile din clasele următoare păstrează indicațiile din 2012. Sursa stabilește regimul legal, nu atestă un capitol de Astronomie separat sau o repartizare unică pe clasă.',
  noteEn:'Italy DM 221/2025 phases in from 2026/27 in first primary and first lower-secondary classes. Continuing cohorts follow 2012 guidelines. This legal source confirms the cohort framework, not a separate Astronomy syllabus or precise year topics.'};
 if(code==='LT'){
  if(level==='lower'&&year==='6')return {...general,
   status:'national-science-grade-6',kind:'integrated',
   topicIds:['solar','sky','stars','observations'],
   source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
   programmeRo:'Gamtos mokslai · clasa a 6-a · Sistemul Solar',
   programmeEn:'Natural sciences · Grade 6 · Solar System',
   noteRo:'În Lituania clasa a VI-a, Gamtos mokslai include observația Soarelui, Lunii și stelelor, fazele, eclipsele, constelațiile, planetele și diferența dintre astronomie și astrologie. Este Știință integrată, nu Astronomie separată obligatorie.',
   noteEn:'Lithuania Grade 6 Natural Sciences includes Sun, Moon and stars, phases, eclipses, constellations and distinguishing astronomy from astrology. It is integrated Science, not compulsory separate Astronomy.'};
  if(level==='upper'&&['11','12'].includes(year)){
   const yr3=year==='11';
   return {...general,status:'national-astronomy-elective-curriculum',kind:'national-optional',
    topicIds:yr3?['solar','sky','distances','gravity','observations']:['stars','galaxies','cosmology','observations','exoplanets'],
    source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
    programmeRo:yr3?'Astronomija · III gimnazijos klasė':'Astronomija · IV gimnazijos klasė',
    programmeEn:yr3?'Astronomy elective · Gymnasium year III':'Astronomy elective · Gymnasium year IV',
    noteRo:yr3?
     'Programă națională lituaniană de Astronomie ca disciplină liber aleasă, anul III gimnazial (echivalent clasa 11): planete, sateliți, corpuri mici, Soare, astrometrie, paralaxă. Se oferă după alegerea școlii și elevului, nu obligatoriu.':
     'Programă națională lituaniană de Astronomie ca disciplină liber aleasă, anul IV gimnazial (echivalent clasa 12): spectre stelare, diagrama H–R, evoluție stelară, galaxii și cosmologie. Nu este obligatorie la toate școlile.',
    noteEn:yr3?
     'Lithuania provides a freely chosen Astronomy national syllabus in Gymnasium III (Grade 11): planets, moons, small bodies, the Sun, astrometry and parallax. It is elective, not compulsory.':
     'Lithuania provides a freely chosen Astronomy national syllabus in Gymnasium IV (Grade 12): stellar spectra, H–R diagram, stellar evolution, galaxies and cosmology. It is not compulsory for every pupil.'};
  }
 }
 if(code==='EE'&&level==='primary'&&year==='4')return {...general,
  status:'national-grade-4-nature-studies',kind:'integrated',
  topicIds:['solar','sky','stars','observations'],
  source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
  programmeRo:'Loodusõpetus · clasa a 4-a · Maailmaruum',
  programmeEn:'Nature studies · Grade 4 · Outer space',
  noteRo:'În Estonia, clasa a IV-a, Loodusõpetus: Soare, Pământ, Lună, planete, constelații, Calea Lactee, modelarea mărimilor și distanțelor, ziua/noaptea și determinarea Nordului după Steaua Polară.',
  noteEn:'Estonia Grade 4 Nature Studies covers the Sun, Earth, Moon, planets, constellations, solar-system scale models, day/night and orientation using the Pole Star.'};
 if(code==='LV'){
  if(level==='primary')return {...general,status:'national-integrated-stage',kind:'integrated',
   source:base?.source||null,sourceScope:base?.scope||null,
   programmeRo:'Dabaszinības · Științe integrate · anii 1–6',
   programmeEn:'Integrated natural science · Years 1–6',
   noteRo:'Letonia studiază Sistemul Solar în domeniul Dabaszinības în anii 1–6, iar din anul 7 îl distribuie în Științe, Fizică și Geografie. Cadrul Skola2030 nu justifică aceeași listă obligatorie în fiecare clasă.',
   noteEn:'Latvia teaches the Solar System in integrated Nature Studies at Years 1–6; separate science subjects start from Year 7. Skola2030 does not prescribe an identical chapter list for each year.'};
  if(level==='upper')return {...general,status:'astronomy-option-not-year-specific',kind:'national-optional',
   source:base?.source||null,sourceScope:base?.scope||null,offerVerified:true,
   programmeRo:'Astronomija · curs la alegere în liceu',
   programmeEn:'Astronomija · optional upper-secondary course',
   noteRo:'Skola2030 include Astronomija ca posibil curs la alegere la nivel liceal. Nu există în sursa verificată o repartizare obligatorie pe clasa 10, 11 sau 12; școala decide când și dacă îl oferă.',
   noteEn:'Skola2030 includes Astronomija as a possible upper-secondary elective. The verified framework does not specify whether it belongs to Year 10, 11 or 12, nor guarantee school availability.'};
 }
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

export function astronomyCurriculumCompletionGate(){
 const covered=ASTRONOMY_EUROPE_COUNTRIES.filter(code=>Boolean(ASTRONOMY_EUROPE_FRAMEWORKS[code]));
 const missing=ASTRONOMY_EUROPE_COUNTRIES.filter(code=>!ASTRONOMY_EUROPE_FRAMEWORKS[code]);
 // A document describing a national programme does NOT certify the authored
 // per-topic/per-grade lesson bank. Do not mark this module fully accepted.
 return {ready:false,schoolYear:'2026/27',totalJurisdictions:ASTRONOMY_EUROPE_COUNTRIES.length,
  jurisdictionsWithAnySource:covered.length,jurisdictionsMissingVerifiedSource:missing,
  schoolTopicSequenceVerified:false,
  blockers:[
   ...(missing.length?['Unverified jurisdiction-level source: '+missing.join(', ')]:[]),
   'Official year/topic concordance is not complete even for source-backed jurisdictions.',
   'University modules depend on institution and cannot be nationally certified.',
   'Android device and PDF/scroll/visual acceptance have not been completed.'
  ]};
}
