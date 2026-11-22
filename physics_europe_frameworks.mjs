// 2026/27: syllabus STAGE references and provisional year sequencing
// for Physics across the European Education picker. This file makes no
// assertion that a stage-level learning outcome is compulsory in every grade.
// A year-specific plan is labelled advisory unless a published specification
// prescribes that year. Regions/exam boards may override the common framework.
export const PHYSICS_EUROPE_REFERENCE='https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en';
const refs=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',scope:'national-stage',name:'Fizică · învățământ gimnazial',lowerEntry:'6',noLower:['5'],note:'Clasele VI–VIII; la liceu distribuția depinde de profil și de programa clasei.'},
 'GB-ENG':{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',scope:'national-stage',name:'Science: physics component',integrated:['primary','lower'],mixedUpper:['Y10','Y11'],optionalUpper:['Y12','Y13'],note:'Key Stage 3 covers Years 7–9; topics are prescribed at key-stage level, NOT as a legally fixed sequence in each year. Year 12–13 programmes are qualification-dependent.'},
 'GB-SCT':{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',scope:'national-stage',name:'Curriculum for Excellence: Sciences',integrated:['primary','lower'],optionalUpper:['S4','S5','S6'],note:'BGE experiences and outcomes use curriculum levels (Early–Fourth); S1–S3 do not correspond to a national Physics chapter-by-year scheme.'},
 'GB-WLS':{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/principles-of-progression/',scope:'national-stage',name:'Curriculum for Wales: Science and Technology',integrated:['primary','lower'],optionalUpper:['Y12','Y13'],note:'Science and Technology follows progression steps, not mandatory lesson lists per Year 7, 8 or 9.'},
 'GB-NIR':{source:'https://ccea.org.uk/key-stage-3/curriculum/science-and-technology',scope:'national-stage',name:'Science and Technology, KS3',integrated:['primary','lower'],optionalUpper:['Y13','Y14'],note:'Northern Ireland has integrated Science in Key Stage 3; exam-board syllabuses determine GCSE and post-16 Physics options.'},
 IE:{source:'https://curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/expectations-for-students-learning-outcomes/',scope:'national-stage',name:'Junior Cycle Science — Physical World',integrated:['primary','lower'],optionalUpper:['TY','5Y','6Y'],note:'Learning outcomes cover the entire three-year Junior Cycle, so a fixed J1/J2/J3 chapter distribution would be a false official attribution.'},
 FR:{source:'https://www.education.gouv.fr/l-enseignement-des-sciences-7076',scope:'national-stage',name:'Physique-chimie · collège',integrated:['primary'],noLower:['6e'],mixed:['lower'],note:'Selon le ministère, les enseignements de physique-chimie commencent dès la 6e (depuis 2016), en articulation possible avec les sciences intégrées. 5e–3e suivent le cycle 4; la séquence par classe reste indicative.'},
 MD:{source:'https://edu.gov.md/sites/default/files/plan_cadru_2026-27.pdf',scope:'national-year',name:'Fizica · gimnaziu VI–IX',noLower:['5'],lowerEntry:'6',note:'Plan-cadru MEC nr. 888/2026, învățământ general: Fizica începe în clasa VI și continuă până în IX. Distribuția exactă a temelor poate depinde de curriculum și filieră.'},
 HU:{source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',scope:'national-stage',name:'Fizika · NAT 2020',noLower:['5','6'],lowerEntry:'7',note:'Grade 7–8 Física/Fizika foundation, revised in grades 9–10; specialised school tracks may vary.'},
 PL:{source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/fizyka',scope:'national-stage',name:'Fizyka · klasy VII–VIII',lowerEntry:'VII',noLower:['V','VI'],note:'Separate Physics in classes VII and VIII; 2026 curriculum transition may be cohort-sensitive.'},
 PT:{source:'https://www.dge.mec.pt/programas-e-metas-curriculares/fisico-quimica',scope:'national-year',name:'Físico-Química · 7.º–9.º ano',noLower:['5','6'],lowerEntry:'7',mixed:['lower'],note:'Physics and Chemistry are combined in 7th–9th. 8th includes Sound and Light; 9th includes Motion/Forces and Electricity. 10th–12th depend on course options.'},
 ES:{source:'https://www.boe.es/eli/es/rd/2022/03/29/217/con',scope:'national-stage',name:'Física y Química · ESO',mixed:['lower'],note:'ESO minimum teaching framework; autonomous communities and school streams determine exact annual distribution and whether Physics/Chemistry is selected.'},
 IT:{source:'https://www.mim.gov.it/',scope:'education-structure',name:'Scienze · scuola secondaria I',integrated:['primary','lower'],note:'Lower-secondary Physics concepts fall under Scienze. Physics as a separate subject in upper secondary depends on school stream.'},
 DE:{source:'https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',scope:'national-stage',name:'Physik · Bundesländer',note:'KMK sets common educational standards; exact grades/topics depend on Land and school type. National standard is NOT an annual schedule.'},
 AT:{source:'https://www.bmb.gv.at/',scope:'education-structure',name:'Physik · Schulart',note:'Separate Physics arrangements depend on AHS/Mittelschule and local school type. Year allocation remains advisory until school stream is chosen.'},
 CH:{source:'https://www.edk.ch/',scope:'education-structure',name:'Natur und Technik · Kantone',integrated:['primary'],note:'Canton and language determine exact programme; a national single grade timetable must not be asserted.'},
 BE:{source:'https://eurydice.eacea.ec.europa.eu/',scope:'education-structure',name:'Sciences · Communities',integrated:['primary'],note:'Belgium requires the linguistic community and stream before Physics grade-specific curriculum can be confirmed.'},
 HR:{source:'https://narodne-novine.nn.hr/clanci/sluzbeni/full/2019_01_10_210.html',scope:'national-year',name:'Fizika · 7. i 8. razred',noLower:['5','6'],lowerEntry:'7',note:'Curriculumul croat Fizika începe în clasa a VII-a de osnovna škola și continuă în clasa VIII; gimnazija are curriculum propriu pe clase, iar formarea profesională poate avea altă distribuție.'},
 BG:{source:'https://www.mon.bg/obshto-obrazovanie/uchebni-planove-i-programi-2/uchebni-programi/uchebni-programi-za-obsthoobrazovatelna-podgotovka/vii-klas/',scope:'national-year',name:'Физика и астрономия · VII клас',noLower:['5','6'],lowerEntry:'7',note:'În V–VI se studiază Човекът и природата (științe integrate); disciplina separată Физика и астрономия începe în VII. La liceu programa diferă în funcție de filieră.'},
 SI:{source:'https://www.gov.si/assets/ministrstva/MVI/Dokumenti/Osnovna-sola/Ucni-nacrti/Ucni-nacrti/2025/UN_OS/Ucni_nacrt_fizika_2025.pdf',scope:'national-stage',name:'Fizika · 8. in 9. razred',noLower:['7'],lowerEntry:'8',note:'Planul de Fizică pentru 8.–9. razred completează disciplinele de științe anterioare; introducerea pe cohortă a reformei 2026 trebuie respectată.'},
 SK:{source:'https://www.minedu.sk/46634-sk/konsolidovany-svp-pre-zakladne-vzdelavanie/',scope:'national-stage',name:'Fyzika · tretí cyklus (6.–9. ročník)',noLower:['5'],lowerEntry:'6',note:'Programul slovac actualizat organizează Științele în cicluri; în 5. ročník se studiază științe integrate, Fizica separată începe de regulă în 6. ročník; ordinea pe clase depinde de reforma aplicabilă cohortei.'},
 EE:{source:'https://www.riigiteataja.ee/et/akt/123122025007',scope:'national-stage',name:'Füüsika · põhikool III kooliaste',note:'Legislația confirmă Fizica în al treilea ciclu (clasele 7–9), dar repartizarea în clasele 8–9 depinde de programa școlii. Nu ascundem automat clasa 7 fără dovadă universală.'},
 TR:{source:'https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=2254',scope:'national-cohort-framework',name:'Fizik dersi · lise 9–12',integrated:['primary','lower'],note:'În 5–8 Fen Bilimleri integrează concepte fizice; Fizik separat este liceal. Türkiye Yüzyılı Maarif Modeli este introdus progresiv pe clase și cohortă în 2026–2027, nu este identic pentru toate cele patru clase.'},
 AL:{source:'https://www.ascap.edu.al/wp-content/uploads/2025/11/Fizike-6.pdf',scope:'national-year',name:'Fizikë · klasa 6–9',lowerEntry:'6',note:'Agenția națională ASCAP a publicat Fizikë 6 (2025); începutul clasei VI este în învățământul secundar inferior albanez, nu clasa V primară. Clasele următoare trebuie corelate cu noua cohortă.'},
 RS:{source:'https://door.prosveta.gov.rs/handle/123456789/1472',scope:'national-year',name:'Физика · VI–VIII разред',noLower:['5'],lowerEntry:'6',note:'Resursele Ministerului Educației Serbiei confirmă Fizica separată în clasa VI; clasa V nu reprezintă un an de Fizică separat. Programele se modifică pe cohorte, inclusiv în 2026.'},
 ME:{source:'https://www.ucidoma.edu.me/predmet/7/FIZ',scope:'national-year',name:'Fizika · 7–9 razred',noLower:['6'],lowerEntry:'7',note:'Platforma educațională din Muntenegru are cursul Fizika în clasa VII; ghidurile și manualele aprobate vizează clasele VII–IX. Reforma curriculară 2026 poate afecta cohorte viitoare.'},
 MK:{source:'https://mon.gov.mk/mk-MK/odnosi-so-javnost/soopstenija/mon-unapredena-e-koncepcijata-za-osnovno-obrazovanie-soglasno-sugestiite-na-nastavnicite-i-strucnata-javnost',scope:'national-cohort-framework',name:'Физика · VII–IX одделение',noLower:['6'],lowerEntry:'7',note:'Ministerul Macedoniei de Nord a reintrodus Fizica distinctă în clasele VII–IX, începând etapizat din 2025/26; pentru 2026/27 noile programe nu sunt identice pentru toate cohorte.'},
 UA:{source:'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi/modelni-navchalni-programi-dlya-5-9-klasiv-novoi-ukrainskoi-shkoli-zaprovadzhuyutsya-poetapno-z-2022-roku',scope:'national-cohort-framework',name:'Фізика · 7–9 класи',noLower:['5','6'],lowerEntry:'7',mixed:['lower'],note:'În reforma NUS, clasele 5–6 studiază Natură/Științe integrate, iar 7–9 pot studia Fizica distinctă sau un curs de Științe naturale integrat, în funcție de curriculumul școlii.'},
 RU:{source:'https://edsoo.ru/wp-content/uploads/2025/07/2025_ooo_frp_fizika-7-9_baz.pdf',scope:'national-year',name:'Физика · 7–9 классы',noLower:['5','6'],lowerEntry:'7',note:'Programul federal de bază 2025 pentru Fizica 7–9 stabilește rezultate pe clase. Pentru 2026/27 se aplică modificările actuale și diferențierea nivel de bază/aprofundat.'},
 CY:{source:'https://www.moec.gov.cy/dme/en/gymnasium.html',scope:'national-stage',name:'Φυσική · Γυμνάσιο',note:'În Gymnasium sunt predate Științele fizice inclusiv Fizică; programa și secvența pe ani G1–G3 diferă de exemplul românesc. Liceul are profiluri și opțiuni.'},
 GR:{source:'https://www.minedu.gov.gr/protovathmia-defterovathmia/orologio-programma-gymnasiou',scope:'national-cohort-framework',name:'Φυσική · Γυμνάσιο',note:'Ministerul grec publică programul și instrucțiunile de predare pentru A/B/Γ Gymnasio, inclusiv 2026–27; filierele și calendarul de predare pot varia.'},
 IS:{source:'https://www.government.is/library/01-Ministries/Ministry-of-Education/Curriculum/adskr_grsk_ens_2012.pdf',scope:'national-stage',name:'Náttúrugreinar · natural sciences',integrated:['primary','lower'],note:'În învățământul obligatoriu islandez, fizica apare în domeniul interdisciplinar al științelor naturii; nu trebuie pretins un curs separat obligatoriu în fiecare clasă.'},
 LT:{source:'https://emokykla.lt/bendrosios-programos/vidurinis-ugdymas/12',scope:'national-stage',name:'Fizika · 7–10 klasės',noLower:['5','6'],lowerEntry:'7',mixed:['lower'],optionalUpper:['11','12'],note:'Conform programei naționale, în clasele 5–6 fizica este integrată în Gamtos mokslai; în 7–8 școlile aleg între curs integrat și discipline separate, în 9–10 Fizica este distinctă; în ultimii doi ani liceali poate fi opțională.'},
 LU:{source:'https://men.public.lu/fr/systeme-educatif/secondaire/apprentissages-evaluation/apprentissages.html',scope:'national-stage',name:'Sciences intégrées / physique-chimie',integrated:['primary','lower'],note:'În 7e și 6e, în special pe filiera clasică, conținutul fizicii intră în Științe naturale integrate; la 5e pot exista cursuri autonome fizică-chimie. Diferă după ESC/ESG și liceu.'},
 MT:{source:'https://curriculum.gov.mt/syllabi-years-9-10-11-new/',scope:'national-stage',name:'Physics · Years 9–11',integrated:['primary'],note:'Curriculumul maltez publică discipline de Physics și Science pentru Years 9–11; disponibilitatea separată depinde de ruta de studii și de clasă.'},
 NL:{source:'https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/voortgezet-onderwijs/hoe-zit-het-vmbo-in-elkaar',scope:'national-stage',name:'Natuur- en scheikunde · onderbouw / natuurkunde',integrated:['primary'],mixed:['lower'],note:'În onderbouw vmbo, natuur- en scheikunde este combinată; Fizica distinctă depinde de nivelul și profilul de învățământ (vmbo, havo, vwo) și de ani.'},
 DK:{source:'https://eng.uvm.dk/primary-and-lower-secondary-education/the-folkeskole/subjects-and-curriculum',scope:'national-stage',name:'Fysik/kemi · Folkeskolen',noLower:[],mixed:['lower'],note:'Fysik/kemi este o disciplină combinată predată în clasele 7–9. Acestea sunt competențe de etapă, nu un cuprins fix în fiecare an; reforma Fagfornyelsen cere verificarea cohortei.'},
 FI:{source:'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education',scope:'national-stage',name:'Fysiikka · perusopetus',integrated:['primary'],note:'Clasele 1–6 studiază Environmental Studies; Fizica și Chimia sunt discipline distincte în 7–9, cu alocarea obiectivelor adaptată curriculumului local.'},
 NO:{source:'https://www.udir.no/lk20/nat01-05/gyldighet-og-innfoering?lang=eng',scope:'national-stage',name:'Naturfag · curriculum integrat',integrated:['primary','lower'],note:'Norvegia predă Naturfag integrat inclusiv în 8–10; nu există curs național separat de Fizică pentru fiecare an. Revizuirea 2026 necesită potrivirea clasei cu cohorta.'},
 LV:{source:'https://skola2030.lv/lv/skolotajiem/macibu-prieksmeti/fizika',scope:'national-year',name:'Fizika · 8.–9. klase',noLower:['7'],note:'Fizica separată este indicată pentru clasele 8–9. În clasa 7 conceptele sunt în Științele naturii și nu se pretinde o disciplină Fizică separată.'},
 SE:{source:'https://www.skolverket.se/sok-publikationer/publikationsserier/styrdokument/2024/curriculum-for-compulsory-school-preschool-class-and-school-age-educare---lgr22',scope:'national-stage',name:'Fysik · Lgr22',note:'Programul suedez folosește grupe de ani 1–3, 4–6, 7–9. Conținutul anual este repartizat local; nu există un cuprins național obligatoriu pentru fiecare clasă.'},
 CZ:{source:'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani',scope:'national-stage',name:'Fyzika · RVP ZV',note:'Cadrul RVP stabilește obiectivele etapei; școlile elaborează ŠVP. Reforma RVP 2026–2028 se implementează gradual în funcție de cohortă, fără o ordine națională identică a lecțiilor.'}
});
// Documented years before standalone Physics/Physics-Chemistry starts.
// Concepts inside other sciences are not incorrectly called compulsory Physics.
export const PHYSICS_NOT_OFFERED_LOWER_YEARS=Object.freeze({
 RO:Object.freeze(['5']),
 HR:Object.freeze(['5','6']),
 BG:Object.freeze(['5','6']),
 SI:Object.freeze(['7']),
 SK:Object.freeze(['5']),
 LT:Object.freeze(['5','6']),
 RS:Object.freeze(['5']),
 ME:Object.freeze(['6']),
 MK:Object.freeze(['6']),
 UA:Object.freeze(['5','6']),
 RU:Object.freeze(['5','6']),
 HU:Object.freeze(['5','6']),
 PL:Object.freeze(['V','VI']),
 PT:Object.freeze(['5','6']),
 LV:Object.freeze(['7']),
 MD:Object.freeze(['5'])
});
export const PHYSICS_EUROPE_REFERENCES=refs;
const countryGroups=Object.freeze({
 // These are original, advisory progressions for school years; they are not
 // attributed to official annual outcomes in stage-level national frameworks.
 lower:[
  ['units','kinematics','heat','energy','optics'],
  ['kinematics','dynamics','fluids','energy','waves'],
  ['electric','circuits','optics','electromagnetism','measurement'],
  ['energy','thermodynamics','waves','electric','optics']
 ],
 upper:[
  ['measurement','kinematics','dynamics','energy','fluids'],
  ['heat','thermodynamics','waves','optics','circuits'],
  ['electric','circuits','electromagnetism','measurement','waves'],
  ['modern','measurement','energy','waves','thermodynamics']
 ],
 primary:[
  ['units','energy','heat'],
  ['units','kinematics','energy','fluids'],
  ['heat','energy','fluids','units'],
  ['kinematics','fluids','energy','units']
 ]
});
const specialPlans={
 // National year headings where published guidance supports a strand,
 // not a claim that the entire year MUST be taught in this exact order.
 RU:{lower:{
  '7':['units','measurement','kinematics','dynamics','fluids','energy'],
  '8':['heat','thermodynamics','electric','circuits','electromagnetism','optics'],
  '9':['kinematics','dynamics','waves','optics','modern','energy']
 }},
 UA:{lower:{
  '7':['units','measurement','kinematics','dynamics','energy'],
  '8':['heat','electric','circuits','optics','energy'],
  '9':['waves','optics','electromagnetism','modern','kinematics']
 }},
 RS:{lower:{
  '6':['units','measurement','kinematics','dynamics','energy'],
  '7':['fluids','heat','energy','dynamics','measurement'],
  '8':['electric','circuits','optics','waves','electromagnetism']
 }},
 ME:{lower:{
  '7':['units','measurement','kinematics','dynamics','energy'],
  '8':['fluids','heat','dynamics','energy','measurement'],
  '9':['electric','circuits','optics','waves','electromagnetism']
 }},
 MK:{lower:{
  '7':['units','measurement','kinematics','energy','dynamics'],
  '8':['electric','circuits','optics','energy','heat'],
  '9':['waves','optics','electromagnetism','modern','kinematics']
 }},
 LT:{lower:{
  '7':['units','measurement','kinematics','energy','waves'],
  '8':['dynamics','heat','electric','circuits','optics'],
  '9':['dynamics','energy','electromagnetism','waves','measurement'],
  '10':['electric','circuits','optics','thermodynamics','modern']
 }},
 AL:{lower:{
  '6':['units','measurement','kinematics','dynamics','energy'],
  '7':['fluids','heat','energy','waves','measurement'],
  '8':['electric','circuits','optics','electromagnetism','energy'],
  '9':['waves','optics','thermodynamics','modern','electric']
 }},
 HR:{lower:{
  '7':['units','kinematics','dynamics','energy','heat'],
  '8':['electric','circuits','waves','optics','electromagnetism']
 }},
 BG:{lower:{
  '7':['units','kinematics','dynamics','energy','heat','waves']
 }},
 SI:{lower:{
  '8':['units','kinematics','dynamics','heat','energy'],
  '9':['electric','circuits','optics','waves','electromagnetism']
 }},
 SK:{lower:{
  '6':['units','heat','fluids','energy','measurement'],
  '7':['kinematics','dynamics','energy','fluids','heat'],
  '8':['electric','circuits','measurement','energy','optics'],
  '9':['waves','optics','electromagnetism','energy','measurement']
 }},
 LV:{lower:{
  '8':['units','heat','waves','optics','energy'],
  '9':['kinematics','dynamics','electric','circuits','electromagnetism']
 }},
 MD:{lower:{
  '6':['units','kinematics','heat','energy','measurement'],
  '7':['dynamics','kinematics','fluids','energy','units'],
  '8':['electric','circuits','electromagnetism','measurement','energy'],
  '9':['waves','optics','thermodynamics','electric','measurement']
 }},
 PT:{lower:{
  '7':['units','energy','heat','solar','kinematics'],
  '8':['waves','optics','energy','heat','measurement'],
  '9':['kinematics','dynamics','electric','circuits','energy']
 }},
 RO:{lower:{
  '6':['units','kinematics','dynamics','energy','heat','electric','electromagnetism','optics'],
  '7':['units','dynamics','kinematics','fluids','energy'],
  '8':['heat','thermodynamics','electric','circuits','electromagnetism','optics']
 }},
 'GB-ENG':{lower:{
  Y7:['units','kinematics','dynamics','energy','heat'],
  Y8:['fluids','waves','optics','electric','energy'],
  Y9:['electromagnetism','circuits','measurement','dynamics','energy']
 }},
 HU:{lower:{
  '7':['units','kinematics','dynamics','energy','heat'],
  '8':['electric','optics','waves','thermodynamics','electromagnetism']
 }},
 PL:{lower:{
  VII:['units','kinematics','dynamics','fluids','energy','heat'],
  VIII:['electric','circuits','electromagnetism','waves','optics']
 }},
 FR:{lower:{
  '6e':['units','energy','heat','optics'],
  '5e':['units','kinematics','energy','electric'],
  '4e':['dynamics','electric','waves','optics'],
  '3e':['kinematics','energy','electric','optics','measurement']
 }}
};
export const PHYSICS_ADVISORY_TOPIC_SEQUENCES=Object.freeze(countryGroups);
export const PHYSICS_COUNTRY_YEAR_SEQUENCES=Object.freeze(specialPlans);
const normalizeStage=stage=>stage==='medium'||stage==='intermediate'?'upper':stage==='beginner'?'primary':String(stage||'');
export function physicsCountryGradePlan({country='',stage='lower',grade='',years=[]}={}){
 const code=String(country).toUpperCase(),phase=stage==='medium'||stage==='intermediate'?'upper':stage==='beginner'?'primary':String(stage||'');
 const yr=String(grade),rows=Array.isArray(years)?years:[];
 const idx=rows.findIndex(x=>String(x.id)===yr);
 if(!['primary','lower','upper','advanced'].includes(phase)||idx<0)
  return {country:code,grade:yr,stage:phase,status:'invalid-grade',topics:[],source:null,kind:'unmapped'};
 const ref=PHYSICS_EUROPE_REFERENCES[code]||null;
 const integrated=phase==='primary'||ref?.integrated?.includes(phase);
 const mixed=ref?.mixed?.includes(phase);
 const noSeparate=phase==='lower'&&ref?.noLower?.includes(yr);
 // "Not a separate timetabled Physics subject" is NOT the same as
 // "the pupil does not study physical phenomena": many systems integrate.
 // Hide only years with a documented absence of a separately scheduled
 // Physics course. Other countries retain their integrated/advisory study.
 // The generated Android WebView embeds this function as standalone JS.
 // Use the embedded framework entry rather than an unbound module export.
 // France 6e has an integrated Physics/Chemistry programme and is retained.
 const absent=phase==='lower'&&code!=='FR'&&
  Boolean(ref?.noLower?.includes(yr));
 const schoolScience=integrated||noSeparate;
 const upperMix=phase==='upper'&&ref?.mixedUpper?.includes(yr);
 const upperOptional=phase==='upper'&&ref?.optionalUpper?.includes(yr);
 const status=absent?'not-offered':schoolScience?'integrated-science':
  upperMix||mixed?'mixed-physics-chemistry':upperOptional?'elective-or-track-dependent':
  ref?'framework-advisory':'european-advisory';
 // Subject-year progress starts when the separate course starts, not when
 // the country's lower-secondary school stage starts. This matters when
 // grade V/VI is integrated science and Physics begins in a later grade.
 const courseYears=phase==='lower'?rows.filter(row=>
  !(code!=='FR'&&ref?.noLower?.includes(String(row.id)))):rows;
 const coursePosition=courseYears.findIndex(row=>String(row.id)===yr);
 const base=PHYSICS_ADVISORY_TOPIC_SEQUENCES[phase]||[];
 const sequence=base.length&&coursePosition>=0?
  base[Math.round(coursePosition*(base.length-1)/Math.max(1,courseYears.length-1))]:[];
 const yearly=PHYSICS_COUNTRY_YEAR_SEQUENCES[code]?.[phase]?.[yr]||sequence;
 const blocked=Boolean(absent);
 // Romania: the new secondary-school syllabus begins with IX in 2026/27.
 // X-XII remain on their applicable transitional cohort plans. An old
 // 2017 lower-secondary order must not be misattributed to Grade IX.
 const roUpper=code==='RO'&&phase==='upper';
 const roNew=roUpper&&yr==='9';
 const roOlder=roUpper&&['10','11','12'].includes(yr);
 const selectedSource=roNew?'https://www.edu.ro/press_rel_02_2026':
  roOlder?'https://sbisj.ro/curriculum-si-inspectie-scolara/fizica/documente-actuale/':
  ref?.source||PHYSICS_EUROPE_REFERENCE;
 const transition=roNew?'Clasa a IX-a urmează noua programă introdusă în anul școlar 2026–2027 (OME 6930/2025); diferențierea TC/CS și profilul liceal sunt obligatorii pentru potrivirea exactă.':
  roOlder?'Clasele X–XII urmează programe de tranziție/cotortă diferite de clasa IX 2026/27; confirmă profilul și programa aplicabilă.':null;
 return {country:code,stage:phase,grade:yr,yearIndex:idx,
  subjectYearIndex:coursePosition,subjectYearCount:courseYears.length,
  status:blocked?'not-offered':status,
  kind:blocked?'not-taught':schoolScience?'integrated':upperMix||mixed?'mixed':
   upperOptional?'elective':'subject-or-track-dependent',
  // Blocked years may still teach physics concepts as integrated Science,
  // but they must not be offered as standalone Physics school years.
  topics:blocked?[]:[...new Set(yearly)].filter(x=>x!=='solar'),
  source:selectedSource,
  sourceScope:roUpper?'national-cohort-framework':ref?.scope||'cross-national-comparative',
  curriculumVersion:roNew?'2026-grade-9':roOlder?'transitional-pre-2026-cohort':null,
  programmeName:ref?.name||'Advisory Physics strand',
  verifiedAnnual:false,
  nationalGradeLabels:Boolean(ref),
  note:blocked?'În acest an nu este programată o disciplină Fizică separată; noțiunile de fizică pot fi studiate în Științe integrate.':transition||ref?.note||'Local Physics syllabus/grade timetable not independently verified. This is an original advisory science progression grounded in Eurydice/ISCED school structures, not a national year-by-year curriculum.',
  separatePhysicsOffered:!blocked&&!schoolScience,
  integratedScience:schoolScience,
  optionalByTrack:Boolean(upperOptional),
  regionOrExamBoardRequired:['DE','AT','CH','BE','ES','GB-ENG','GB-SCT','GB-WLS','GB-NIR','NL'].includes(code),
  sourceStatus:ref?.scope||'cross-national-advisory'
 };
}
