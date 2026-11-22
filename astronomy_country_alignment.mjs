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
 HU:[
  {stage:'lower',grades:null,subject:'Fizika / Természettudomány – NAT 2020',kind:'framework-only',
   topicIds:null,sourceYear:2020,validFrom:'2020/21',
   source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',
   title:'Hungary NAT 2020 subject frameworks; separate lower/upper school tracks and local year sequencing'}
 ],
 CH:[
  {stage:'lower',grades:null,subject:'Natur und Technik – Lehrplan 21 (Deutschschweiz)',kind:'framework-only',
   topicIds:null,sourceYear:2014,validFrom:null,
   source:'https://www.lehrplan21.ch/',
   title:'Swiss German-speaking cantonal Lehrplan 21; cantonal implementation and language required; not a single national timetable'}
 ],
 LV:[
  {stage:'primary',grades:null,subject:'Dabaszinības',kind:'integrated',
   topicIds:null,sourceYear:2018,validFrom:'2020/21',
   source:'https://likumi.lv/ta/id/303768-noteikumi-par-valsts-pamatizglitibasstandartu-un-pamatizglitibas-programmu-paraugiem',
   title:'Latvian 2018 basic-education standard, as amended: natural science astronomy outcomes; not former repealed 2007 standard'},
  {stage:'lower',grades:null,subject:'Dabaszinības / Fizika',kind:'integrated',
   topicIds:null,sourceYear:2018,validFrom:'2020/21',
   source:'https://likumi.lv/ta/id/303768-noteikumi-par-valsts-pamatizglitibasstandartu-un-pamatizglitibas-programmu-paraugiem',
   title:'Latvia basic education current natural sciences framework: solar system and universe; grade sequencing subject to school'}
 ],
 IT:[
  {stage:'primary',grades:['P1'],subject:'Scienze – Indicazioni nazionali 2025',kind:'integrated',
   topicIds:null,sourceYear:2025,validFrom:'2026/27',
   source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',
   title:'Italy DM 221/2025: new first-cycle framework applies to new primary Year 1 cohorts from 2026/27'},
  {stage:'primary',grades:['P2','P3','P4','P5'],subject:'Scienze – Indicazioni nazionali 2012',kind:'integrated',
   topicIds:null,sourceYear:2012,validFrom:'2013/14',
   source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',
   title:'Italy DM 221/2025 transition explicitly retains 2012 curriculum for ongoing primary cohorts'},
  {stage:'lower',grades:['M1'],subject:'Scienze – Indicazioni nazionali 2025',kind:'integrated',
   topicIds:null,sourceYear:2025,validFrom:'2026/27',
   source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',
   title:'Italy 2026/27: new lower-secondary first-year cohort follows 2025 indications, astronomy via Scienze'},
  {stage:'lower',grades:['M2','M3'],subject:'Scienze – Indicazioni nazionali 2012',kind:'integrated',
   topicIds:null,sourceYear:2012,validFrom:'2013/14',
   source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27',
   title:'Italy 2026/27: cohorts already in lower-secondary Years 2 and 3 retain 2012 framework until completion'}
 ],
 BG:[
  {stage:'lower',grades:['5'],subject:'Човекът и природата / География',kind:'integrated',
   topicIds:null,sourceYear:2015,validFrom:'2016/17',
   source:'https://www.mon.bg/obshto-obrazovanie/uchebni-planove-i-programi-2/uchebni-programi/uchebni-programi-za-obsthoobrazovatelna-podgotovka/v-klas/',
   title:'Bulgarian ministry Grade V curriculum 2015, updated 2020 and 2023: natural sciences and geography, Sun/Earth topics'},
  {stage:'lower',grades:['6'],subject:'Човекът и природата',kind:'integrated',
   topicIds:null,sourceYear:2020,validFrom:'2022/23',
   source:'https://www.mon.bg/obshto-obrazovanie/uchebni-planove-i-programi-2/arhiv-na-uchebni-programi-po-klasove/uchebni-programi-za-vi-klas/',
   title:'Bulgarian Grade VI officially amended curriculum 2020, still applies to grade 6 cohorts'},
  {stage:'upper',grades:null,subject:'Физика и астрономия',kind:'framework-only',
   topicIds:null,sourceYear:2025,validFrom:null,
   source:'https://www.mon.bg/obshto-obrazovanie/darzhavni-zrelostni-izpiti-dzi/izpitni-materiali-za-dzi-po-predmeti/fizika-i-astronomiya/',
   title:'Bulgarian ministry national graduation exam Physics/Astronomy 2025; does not establish an exact annual curriculum'}
 ],
 MT:[
  {stage:'lower',grades:['7'],subject:'Science – revised Year 7',kind:'integrated',
   topicIds:null,sourceYear:2025,validFrom:'2025/26',
   source:'https://curriculum.gov.mt/years-7-and-8-learning-outcomes-programmes-and-syllabi-2/',
   title:'Malta Year 7 Science revised September 2025, Earth around Sun and day/night'},
  {stage:'lower',grades:['8'],subject:'Science – revised Year 8',kind:'integrated',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://curriculum.gov.mt/years-7-and-8-learning-outcomes-programmes-and-syllabi-2/',
   title:'Malta Year 8 Science revised September 2026; grade-specific document on official curriculum portal'},
  {stage:'upper',grades:null,subject:'Physics / Science and Technology',kind:'framework-only',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://curriculum.gov.mt/syllabi-years-9-10-11-new/',
   title:'Malta secondary Physics and Science syllabi on official 2026 Education portal; route depends on subject selection'}
 ],
 UA:[
  {stage:'upper',grades:['10'],subject:'Астрономія – профільний рівень',kind:'optional-standalone',
   topicIds:null,sourceYear:2018,validFrom:'2018/19',
   source:'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi/navchalni-programi-dlya-10-11-klasiv',
   title:'Ukraine high-school Astronomy 2018 programme: specialist profile includes grades 10 and 11; normal grade 10 not necessarily standalone'},
  {stage:'upper',grades:['11'],subject:'Астрономія / Фізика і астрономія',kind:'optional-standalone',
   topicIds:['sky','observations','solar','stars','galaxies','cosmology','gravity','distances'],sourceYear:2018,validFrom:'2018/19',
   source:'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi/navchalni-programi-dlya-10-11-klasiv',
   title:'Ukraine ministry retains Astronomy standalone and Physics+Astronomy programmes for grade 11 from 2018; reform 10–12 from 2027 is not in force for these cohorts'}
 ],
 RS:[
  {stage:'upper',grades:null,subject:'Fizika – astronomija (gimnazija)',kind:'integrated',
   topicIds:null,sourceYear:2018,validFrom:'2018/19',
   source:'https://prosveta.gov.rs/prosveta/udzbenici/udzbenici-za-srednju-skolu/?pismo=lat',
   title:'Serbian secondary gymnasium curriculum adopted 2018 onward with later amendments; astronomy within Physics, program depends on gymnasium track'}
 ],
 ME:[
  {stage:'lower',grades:null,subject:'Fizika / Priroda',kind:'framework-only',
   topicIds:null,sourceYear:2025,validFrom:null,
   source:'https://www.gov.me/zzs/predmetni-programi',
   title:'Montenegro Institute for Education publishes subject curricula; exact astronomy-grade allocation not certified'}
 ],
 SK:[
  {stage:'primary',grades:['1'],subject:'Človek a príroda – ŠVP 2023',kind:'framework-only',
   topicIds:null,sourceYear:2023,validFrom:'2026/27',
   source:'https://www.minedu.sk/statny-vzdelavaci-program-pre-zakladne-vzdelavanie-2023/',
   title:'Slovakia 2023 new national basic curriculum starts for ALL first-grade cohorts in 2026/27; phased/early-adopter implementation elsewhere'},
  {stage:'lower',grades:null,subject:'Fyzika / Človek a príroda',kind:'framework-only',
   topicIds:null,sourceYear:2023,validFrom:null,
   source:'https://www.minedu.sk/konsolidovane-znenie-svp-pre-zakladne-vzdelavanie/',
   title:'Slovak national curriculum consolidated through 2026 amendments; ongoing classes may follow former curriculum until cohort transition'}
 ],
 TR:[
  {stage:'upper',grades:null,subject:'Astronomi ve Uzay Bilimleri – seçmeli ders',kind:'optional-standalone',
   topicIds:null,sourceYear:2026,validFrom:'2026/27',
   source:'https://tymm.meb.gov.tr/ogretim-programlari/ortaogretim',
   title:'Turkey officially adopted 2026 elective Astronomy and Space Sciences curriculum for 2026/27, superseding 2010 version; offered grade/track varies'}
 ],
 RU:[
  {stage:'upper',grades:null,subject:'Естественно-научные предметы – ФГОС СОО',kind:'framework-only',
   topicIds:null,sourceYear:2026,validFrom:null,
   source:'https://edu.gov.ru/press/12186/minprosvescheniya-rossii-obnovit-rabochie-programmy-po-klyuchevym-shkolnym-predmetam-v-sootvetstvii-s-fgos-soo',
   title:'Russia secondary federal framework amended September 2026; October 2026 working programmes are only draft for September 2027 cohorts, current 2026/27 Astronomy distribution not nationally confirmed'}
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
