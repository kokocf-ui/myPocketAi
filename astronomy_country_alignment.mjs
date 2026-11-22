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
 DK:[
  {stage:'primary',grades:null,subject:'Natur/teknologi',kind:'integrated',
   topicIds:null,sourceYear:2024,validFrom:'2025/26',
   source:'https://www.retsinformation.dk/eli/lta/2024/1715',
   title:'Fælles Mål (2024): science/technology national competencies; no fixed astronomy grade'},
  {stage:'lower',grades:null,subject:'Fysik/kemi',kind:'integrated',
   topicIds:null,sourceYear:2024,validFrom:'2025/26',
   source:'https://www.retsinformation.dk/eli/lta/2024/1715',
   title:'Fælles Mål: integrated Physics/Chemistry, school plans are flexible'}
 ],
 NL:[
  {stage:'primary',grades:null,subject:'Natuur en techniek – kerndoel 46',kind:'integrated',
   topicIds:null,sourceYear:2006,validFrom:null,
   source:'https://www.slo.nl/thema/meer/tule/orientatie-jezelf-wereld/kerndoel-46/',
   title:'SLO kerndoel 46, day/night and seasons; local year distribution and newer core-goal rollout require separate checks'}
 ],
 NO:[
  {stage:'primary',grades:null,subject:'Naturfag',kind:'integrated',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://www.udir.no/lk20/nat01-05?lang=eng',
   title:'Norwegian Natural Science NAT01-05 in force from 1 Aug 2026; competence aims by milestone, not individual grade'},
  {stage:'lower',grades:null,subject:'Naturfag',kind:'integrated',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://www.udir.no/lk20/nat01-05?lang=eng',
   title:'Norwegian Natural Science NAT01-05; replaces NAT01-04 (2020–2026)'}
 ],
 SE:[
  {stage:'primary',grades:null,subject:'Fysik – Lgr22',kind:'integrated',
   topicIds:null,sourceYear:2022,validFrom:'2022/23',
   source:'https://www.skolverket.se/undervisning/grundskolan/laroplan-lgr22-for-grundskolan-samt-for-forskoleklassen-och-fritidshemmet/curriculums/LGR22/GRGRFYS01',
   title:'Swedish Physics, content bands 1–3 and 4–6: solar system; no mandated annual chapter list'},
  {stage:'lower',grades:null,subject:'Fysik – Lgr22',kind:'integrated',
   topicIds:null,sourceYear:2022,validFrom:'2022/23',
   source:'https://www.skolverket.se/undervisning/grundskolan/laroplan-lgr22-for-grundskolan-samt-for-forskoleklassen-och-fritidshemmet/curriculums/LGR22/GRGRFYS01',
   title:'Swedish Physics, content band 7–9: universe, origin/evolution, planets; not a grade-specific sequence'}
 ],
 LT:[
  {stage:'lower',grades:null,subject:'Gamtos mokslai / Fizika',kind:'integrated',
   topicIds:null,sourceYear:2023,validFrom:'2023/24',
   source:'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/15',
   title:'Lithuanian Astronomy programme states early grades integrate astronomy in Natural Sciences/Physics'},
  {stage:'upper',grades:['11'],subject:'Astronomija (optional)',kind:'optional-standalone',
   topicIds:['sky','solar','distances','observations','gravity','stars'],sourceYear:2023,validFrom:'2023/24',
   source:'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/15',
   title:'Lithuanian optional standalone Astronomy, gymnasium III (grade 11): solar system, celestial coordinates and observations'},
  {stage:'upper',grades:['12'],subject:'Astronomija (optional)',kind:'optional-standalone',
   topicIds:['stars','galaxies','cosmology','exoplanets','gravity','distances','observations','sky'],sourceYear:2023,validFrom:'2023/24',
   source:'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/15',
   title:'Lithuanian optional standalone Astronomy, gymnasium IV (grade 12): stellar evolution, galaxies and cosmology'}
 ],
 SI:[
  {stage:'lower',grades:null,subject:'Astronomija – izbirni predmet',kind:'optional-standalone',
   topicIds:null,sourceYear:1999,validFrom:null,
   source:'https://www.gov.si/assets/ministrstva/MVI/Dokumenti/Osnovna-sola/Ucni-nacrti/izbirni/1-letni/Astronomija_izbirni-v2.pdf',
   title:'Slovenian officially listed Astronomy elective, adopted 11 February 1999: three independent one-year thematic courses'}
 ],
 AT:[
  {stage:'lower',grades:null,subject:'Physik / Naturwissenschaften (Mittelschule)',kind:'integrated',
   topicIds:null,sourceYear:2023,validFrom:'2023/24',
   source:'https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Anlage=1&Gesetzesnummer=20007850',
   title:'Austria Mittelschule, legally consolidated science/physics curriculum: Sun, Moon, seasons and Moon phases'}
 ],
 DE:[
  {stage:'lower',grades:null,subject:'Physik – KMK Länderstandards',kind:'framework-only',
   topicIds:null,sourceYear:2024,validFrom:'2024/25',
   source:'https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',
   title:'Germany KMK updated Physics standards (2024); actual school-year astronomy teaching depends on Bundesland and Schulart'}
 ],
 CZ:[
  {stage:'lower',grades:null,subject:'RVP ZV – Přírodovědné vzdělávání',kind:'framework-only',
   topicIds:null,sourceYear:2004,validFrom:null,
   source:'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani',
   title:'Czech basic education framework 2004 stays applicable to cohorts; revision released 2025, compulsory switch delayed to 2028'}
 ],
 HR:[
  {stage:'lower',grades:null,subject:'Priroda / Geografija',kind:'integrated',
   topicIds:null,sourceYear:2019,validFrom:'2019/20',
   source:'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_7_145.html',
   title:'Croatian Geography curriculum NN 7/2019: Sun, Earth in Solar System and space; class order follows national outcomes'},
  {stage:'upper',grades:null,subject:'Fizika / Geografija',kind:'integrated',
   topicIds:null,sourceYear:2019,validFrom:'2019/20',
   source:'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_210.html',
   title:'Croatian Physics curriculum NN 10/2019: model of Solar System formation and universe; track affects year allocation'}
 ],
 MD:[
  {stage:'upper',grades:null,subject:'Fizică. Astronomie (clasele X–XII)',kind:'integrated',
   topicIds:null,sourceYear:2019,validFrom:'2019/20',
   source:'https://edu.gov.md/sites/default/files/13_fizica_ro_2019-20_final_12.09.2019f_0.pdf',
   title:'Moldova Ministry: Physics/Astronomy 2019 curriculum, Order 906/17 July 2019; 2026 consultation is not an adopted replacement'}
 ],
 EE:[
  {stage:'primary',grades:null,subject:'Loodusõpetus / natural sciences',kind:'framework-only',
   topicIds:null,sourceYear:2025,validFrom:null,
   source:'https://www.riigiteataja.ee/et/akt/123122025007',
   title:'Estonia national basic-school framework as amended 2025; annual astronomy chapters must be checked in Natural Science annex and school programme'},
  {stage:'lower',grades:null,subject:'Loodusained / natural sciences',kind:'framework-only',
   topicIds:null,sourceYear:2025,validFrom:null,
   source:'https://www.riigiteataja.ee/et/akt/123122025007',
   title:'Estonia basic school curriculum and science area framework, not a fixed standalone Astronomy syllabus'}
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
  verifiedOptionalAsStandalone:framework?.kind==='optional-standalone',
  // No national school programme is inferred to have expired merely for being old.
  superseded:false,supercessionConfirmed:false,
  noteRo:framework?
   'Există o referință curriculară din '+framework.sourceYear+' pentru '+framework.subject+
   '. Data ei nu o invalidează automat. '+(framework.kind==='optional-standalone'?
   'Astronomia este disponibilă ca disciplină opțională, nu obligatorie.':
   framework.kind==='framework-only'?'Referința confirmă numai cadrul general, nu o programă anuală completă de Astronomie.':
   'Noțiunile de astronomie sunt integrate în disciplina indicată, nu predate automat separat.')+
   ' Conținutul pe fiecare clasă este certificat numai unde există teme anuale documentate.':
   'Programa națională de astronomie pentru această clasă nu a fost încă verificată. Aceasta nu înseamnă că țara nu are programă; sunt afișate lecții generale orientative.',
  noteEn:framework?
   'An existing '+framework.sourceYear+' reference covers '+framework.subject+
   '. Older dates do not alone invalidate a curriculum. '+(framework.kind==='optional-standalone'?
   'Astronomy is a separately offered elective, not a mandatory subject.':
   framework.kind==='framework-only'?'This source describes only the broader curriculum framework.':
   'Astronomy concepts are integrated in the named subject, not automatically taught separately.')+
   ' Individual school-year topics are considered verified only where directly documented.':
   'A country-specific Astronomy syllabus has not yet been verified for this year. This does not mean no syllabus exists; advisory lessons are offered.'
 };
}
