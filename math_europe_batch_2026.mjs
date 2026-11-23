// Mathematics-only national-system batch: 10 European jurisdictions, 2026/27.
// This is an independently authored school-structure and competency-strand
// alignment layer. It does NOT certify a grade-by-grade ministerial textbook.
// Regional authorities, school programmes, cohorts and chosen exam/course
// levels may change the applicable content. Do not reuse Romanian/English
// school-stage labels for these national systems.
const https=u=>'https://'+u;
const SOURCE=Object.freeze({
 FI:{basic:https('www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education'),upper:https('www.oph.fi/en/education-and-qualifications/general-upper-secondary-education')},
 SE:{basic:https('www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan/subjects/GRGRMAT01'),upper:https('www.skolverket.se/styrning-och-ansvar/en-skola-i-forandring/tidigare-forandringar/gy25----amnesbetyg-pa-gymnasial-niva')},
 NO:{basic:https('www.udir.no/lk20/mat01-06/gyldighet-og-innfoering?lang=eng'),upper:https('www.udir.no/lk20')},
 DK:{basic:https('uvm.dk/folkeskolen/fag-timetal-og-overgange/fag-emner-og-tvaergaaende-temaer/faelles-maal/faelles-maal-for-folkeskolens-fag/obligatoriske-fag'),upper:https('uvm.dk/uddannelse-til-unge/gymnasiale-uddannelser/uddannelser/overblik-over-gymnasiale-uddannelser/')},
 NL:{basic:https('www.slo.nl/kerndoelen/'),upper:https('www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-examenprogramma/')},
 IE:{basic:https('www.gov.ie/en/department-of-education/services/curriculum-online-irish-education-curriculum/'),upper:https('www.gov.ie/en/department-of-education/publications/junior-cycle/')},
 DE:{basic:https('www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html'),upper:https('www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html')},
 AT:{basic:https('www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Anlage=1&Gesetzesnummer=20007850'),upper:https('www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Anlage=1&Gesetzesnummer=20007850')},
 PL:{basic:https('www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane'),upper:https('zpe.gov.pl/podstawa-programowa/szkola-ponadpodstawowa/matematyka')},
 HU:{basic:https('www.oktatas.hu/kozneveles/kerettantervek/2020_nat'),upper:https('www.oktatas.hu/kozneveles/kerettantervek/2020_nat')}
});
const DATA=Object.freeze({
 FI:{lang:'fi',name:'Finlanda',stages:{primary:['Perusopetus · vuosiluokat 1–6','Basic education · grades 1–6'],lower:['Perusopetus · vuosiluokat 7–9','Basic education · grades 7–9'],intermediate:['Lukio · modul de studiu','General upper-secondary · study modules']},note:'Finlanda: învățământul de bază 1–9 are obiective pe intervalele 1–2, 3–6 și 7–9; programele locale implementează baza națională. La lukio matematica are module și trasee lung/scurt, nu un cuprins identic pentru fiecare an.',nativeTopics:{arithmetic:'Luvut ja laskutoimitukset',geometry:'Geometria',measurement:'Mittaus',statistics:'Tilastot ja todennäköisyys',algebra:'Algebra',functions:'Funktiot',trigonometry:'Trigonometria',analysis:'Matemaattinen analyysi'},starter:['Lasketaan esineitä','Laskujärjestys','Funktiot ja kuvaajat']},
 SE:{lang:'sv',name:'Suedia',stages:{primary:['Grundskolan · årskurs 1–6','Compulsory school · years 1–6'],lower:['Grundskolan · årskurs 7–9','Compulsory school · years 7–9'],intermediate:['Gymnasieskolan · Gy25 ämnesnivåer','Upper secondary · Gy25 subject levels']},note:'Suedia: Lgr22 grupează conținutul de Matematică pe anii 1–3, 4–6 și 7–9. În gymnasieskolan, Gy25 se aplică elevilor noi din 1 iulie 2025; nivelurile 1a/1b/1c depind de program, nu sunt echivalente cu anii școlari.',nativeTopics:{arithmetic:'Taluppfattning och tals användning',geometry:'Geometri',measurement:'Mätning',statistics:'Sannolikhet och statistik',algebra:'Algebra',functions:'Samband och förändring',trigonometry:'Trigonometri',analysis:'Matematisk analys'},starter:['Räkna föremål','Räkneordning','Funktioner och grafer']},
 NO:{lang:'no',name:'Norvegia',stages:{primary:['Barnetrinnet · 1.–7. trinn','Primary school · grades 1–7'],lower:['Ungdomstrinnet · 8.–10. trinn','Lower-secondary · grades 8–10'],intermediate:['Videregående · Vg1/Vg2/Vg3','Upper-secondary · Vg1–Vg3']},note:'Norvegia: noua versiune a planului de Matematică 1.–10. trinn MAT01-06 intră în vigoare la 1 august 2026. În videregående, matematica depinde de program și de 1P/1T, R1/R2 sau S1/S2; clasele Vg nu reprezintă un singur curs.',nativeTopics:{arithmetic:'Tall og regning',geometry:'Geometri',measurement:'Måling',statistics:'Statistikk og sannsynlighet',algebra:'Algebra',functions:'Funksjoner',trigonometry:'Trigonometri',analysis:'Matematisk analyse'},starter:['Vi teller gjenstander','Regnerekkefølge','Funksjoner og grafer']},
 DK:{lang:'da',name:'Danemarca',stages:{primary:['Folkeskole · 1.–6. klasse','Folkeskole · grades 1–6'],lower:['Folkeskole · 7.–9. klasse','Folkeskole · grades 7–9'],intermediate:['Gymnasial uddannelse · stx/hhx/htx/hf','Upper-secondary · programme-specific']},note:'Danemarca: børnehaveklasse (clasa 0) este pregătitoare. Matematica se studiază în Folkeskole; liceul diferă între stx/hhx/htx (3 ani) și hf (2 ani), cu Matematisk A/B/C după profil. Etapele din aplicație sunt orientative până la alegerea programului.',nativeTopics:{arithmetic:'Tal og algebra',geometry:'Geometri',measurement:'Måling',statistics:'Statistik og sandsynlighed',algebra:'Algebra',functions:'Funktioner',trigonometry:'Trigonometri',analysis:'Matematisk analyse'},starter:['Vi tæller ting','Regnehierarki','Funktioner og grafer']},
 NL:{lang:'nl',name:'Țările de Jos',stages:{primary:['Basisschool · groep 1–8','Primary school · group 1–8'],lower:['Voortgezet onderwijs · leerjaar 1–3','Secondary · years 1–3'],intermediate:['VMBO/HAVO/VWO · hogere leerjaren','Upper-secondary · track-specific years']},note:'Țările de Jos: Groep 1–2 învață prin joc; Groep 3–8 au progresie numerică. VMBO se termină de regulă în anul 4, HAVO în 5 și VWO în 6. Noua bază pentru rekenen/wiskunde din august 2026 nu este identică cu viitoarele programe de examen (pentru havo/vwo aplicarea este prevăzută ulterior).',nativeTopics:{arithmetic:'Getallen en bewerkingen',geometry:'Meetkunde',measurement:'Meten',statistics:'Statistiek en kansrekening',algebra:'Algebra',functions:'Verbanden en functies',trigonometry:'Goniometrie',analysis:'Analyse'},starter:['Getallen tot tien','Rekenvolgorde','Functies en grafieken']},
 IE:{lang:'en',name:'Irlanda',stages:{primary:['Primary · Junior Infants–Sixth Class','Primary · Infants to Sixth Class'],lower:['Junior Cycle · First–Third Year','Junior Cycle · three years'],intermediate:['Senior Cycle · TY/Fifth/Sixth Year','Senior Cycle · Transition/Fifth/Sixth Year']},note:'Irlanda: Junior/Senior Infants și clasele 1–6 sunt trepte primare distincte. Junior Cycle are trei ani. Transition Year poate fi opțional și nu are o programă anuală obligatorie identică de matematică; la Leaving Certificate există niveluri și specificații distincte.',nativeTopics:{arithmetic:'Number',geometry:'Shape and space',measurement:'Measures',statistics:'Data and chance',algebra:'Algebra',functions:'Functions',trigonometry:'Trigonometry',analysis:'Calculus'},starter:['Counting and grouping','Order of operations','Functions and representations']},
 DE:{lang:'de',name:'Germania',stages:{primary:['Grundschule · Klassen 1–4 (Land-abhängig)','Primary · grades 1–4 (depending on Land)'],lower:['Sekundarstufe I · Klassen 5–10','Secondary I · grades 5–10'],intermediate:['Sekundarstufe II · Oberstufe','Upper-secondary · programme and Land']},note:'Germania: standardele KMK reglementează competențe la sfârșit de etape; programa anuală este dată de Land și tipul școlii. În Berlin/Brandenburg Grundschule are de regulă 6 ani, nu 4; elevii aleg Land înainte de a considera mapa orientativă drept structură școlară reală.',nativeTopics:{arithmetic:'Zahlen und Operationen',geometry:'Raum und Form',measurement:'Größen und Messen',statistics:'Daten und Zufall',algebra:'Terme und Gleichungen',functions:'Funktionen und Zuordnungen',trigonometry:'Trigonometrie',analysis:'Analysis'},starter:['Wir zählen Gegenstände','Punkt vor Strich','Funktionen und Graphen']},
 AT:{lang:'de',name:'Austria',stages:{primary:['Volksschule · 1.–4. Schulstufe','Primary · grades 1–4'],lower:['Mittelschule/AHS · 5.–8. Schulstufe','Lower secondary · grades 5–8'],intermediate:['AHS/BHS · 9.–13. Schulstufe','Upper-secondary · AHS/BHS pathways']},note:'Austria: Volksschule 1–4; nivelul 5–8 poate urma Mittelschule sau AHS; în secundarul superior durata AHS diferă de BHS, care poate ajunge la clasa 13. Lehrplanul de Matematică depinde de forma instituției; nu se certifică o singură programă anuală.',nativeTopics:{arithmetic:'Zahlen und Operationen',geometry:'Geometrie',measurement:'Größen und Messen',statistics:'Daten und Wahrscheinlichkeit',algebra:'Algebra',functions:'Funktionen',trigonometry:'Trigonometrie',analysis:'Analysis'},starter:['Wir zählen Mengen','Rechenregeln','Funktionen im Alltag']},
 PL:{lang:'pl',name:'Polonia',stages:{primary:['Edukacja wczesnoszkolna · klasy I–III','Integrated early years · grades I–III'],lower:['Szkoła podstawowa · klasy IV–VIII','Primary school · grades IV–VIII'],intermediate:['Liceum ogólnokształcące · I–IV','Upper school · liceum years I–IV']},note:'Polonia: în I–III matematica este integrată; din IV este disciplină de sine stătătoare. Reforma din 1 septembrie 2026 se introduce în clasele I și IV, apoi gradual; celelalte cohorte păstrează programele anterioare. În liceum și technikum diferă perioada și nivelul de matematică.',nativeTopics:{arithmetic:'Liczby i działania',geometry:'Geometria',measurement:'Miary i jednostki',statistics:'Statystyka i prawdopodobieństwo',algebra:'Wyrażenia algebraiczne',functions:'Funkcje',trigonometry:'Trygonometria',analysis:'Analiza matematyczna'},starter:['Liczymy przedmioty','Kolejność działań','Funkcje i wykresy']},
 HU:{lang:'hu',name:'Ungaria',stages:{primary:['Általános iskola · 1–4. évfolyam','Primary · grades 1–4'],lower:['Általános iskola/gimnázium · 5–8. évfolyam','General school/gymnasium · 5–8'],intermediate:['Gimnázium/technikum · 9–13. évfolyam','Upper secondary · 9–13 by pathway']},note:'Ungaria: NAT 2020; elevii pot urma gimnázium de 8, 6 sau 4 ani și technikum cu anul 13. Intrarea într-un alt tip de școală schimbă programa: anul 13 nu este obligatoriu pentru toți. Manualele sunt dependente de clasă și traseu.',nativeTopics:{arithmetic:'Számok és műveletek',geometry:'Geometria',measurement:'Mérés és mértékegységek',statistics:'Statisztika és valószínűség',algebra:'Algebra és egyenletek',functions:'Függvények',trigonometry:'Trigonometria',analysis:'Analízis'},starter:['Tárgyak számlálása','Műveleti sorrend','Függvények és grafikonok']}
});
export const MATH_BULK_CODES=Object.freeze(Object.keys(DATA));
export const MATH_BULK_SOURCES=SOURCE;
export const MATH_BULK_STAGE_LABELS=Object.freeze(Object.fromEntries(
 Object.entries(DATA).map(([code,p])=>[code,p.stages])
));
export const MATH_BULK_SOURCE_REGISTRY=Object.freeze(Object.fromEntries(
 Object.entries(DATA).map(([code,p])=>[code,{curriculum:SOURCE[code].basic,
  ...(code==='PL'?{manualExample:'https://podreczniki.men.gov.pl/podreczniki/4531/show'}:{}),
  ...(code==='HU'?{manualExample:'https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA'}:{}),
  note:p.note}])
));
export function bulkMathYearLabels({country,stage,years=[]}={}){
 const code=String(country||'').toUpperCase(),p=DATA[code];
 const st=String(stage||'');
 if(!p||st==='advanced')return null;
 const array=Array.isArray(years)?years:[];
 const yr=(id)=>{const n=Number(String(id).replace(/^[A-Z]+/,''));
  return Number.isFinite(n)?n:0;};
 return array.map((entry,index)=>{
  const id=String(entry.id),n=yr(id),step=index+1;
  let native=entry.en||entry.ro;
  if(code==='FI')native=st==='medium'?'Lukio · '+step+'. opintovuosi (ohjeellinen)':'Perusopetus · '+id+'. luokka';
  if(code==='SE')native=st==='medium'?'Gymnasieskolan · år '+step+' (Gy25)':'Grundskolan · årskurs '+id;
  if(code==='NO')native=st==='medium'?'Videregående · Vg'+step:'Grunnskolen · '+id+'. trinn';
  if(code==='DK')native=st==='medium'?'Gymnasial uddannelse · '+step+'.g (stx/hhx/htx)':'Folkeskolen · '+id+'. klasse';
  if(code==='NL')native=st==='beginner'?'Basisschool · groep '+n:
   'Voortgezet onderwijs · leerjaar '+n+
    (st==='medium'?(n===6?' (alleen VWO)':n===5?' (HAVO/VWO)':' (VMBO/HAVO/VWO)'):'');
  if(code==='IE')native=st==='beginner'?String(entry.en||entry.ro):
   st==='lower'?'Junior Cycle · Year '+step:
   id==='TY'?'Transition Year (optional)':
   id==='5Y'?'Senior Cycle · Fifth Year':'Senior Cycle · Sixth Year';
  if(code==='DE')native=st==='beginner'?'Grundschule · Klasse '+id:
   st==='lower'?'Sekundarstufe I · Klasse '+id:'Sekundarstufe II · Jahrgang '+id;
  if(code==='AT')native=st==='beginner'?'Volksschule · '+id+'. Schulstufe':
   st==='lower'?'Mittelschule/AHS · '+id+'. Schulstufe':
   'AHS/BHS · '+id+'. Schulstufe'+(n===13?' (nur bestimmte BHS)':'');
  if(code==='PL')native=st==='beginner'?'Edukacja wczesnoszkolna · klasa '+id:
   st==='lower'?'Szkoła podstawowa · klasa '+id:
   'Liceum · klasa '+step+' (profil wymaga wyboru)';
  if(code==='HU')native=st==='beginner'||st==='lower'?'Általános iskola · '+id+'. évfolyam':
   'Gimnázium/technikum · '+id+'. évfolyam'+(n===13?' (technikum)':'');
  const needsStream=code==='DE'||st==='medium'&&['FI','SE','NO','DK','NL','IE','AT','HU','PL'].includes(code);
  return {...entry,native,nativeLang:p.lang,
   // A locally used year name is not an unconditional national programme:
   // school track (and for Germany the Land) must be selected first.
   nationalYearVerified:entry.nationalYearVerified===false?false:!needsStream,
   curriculumVerified:false,countryFrameworkSpecific:true};
 });
}
export function bulkMathNationalProfile({country,stage,grade,years=[],topics=[]}={}){
 const code=String(country||'').toUpperCase(),p=DATA[code],st=String(stage||'');
 if(!p||st==='advanced')return null;
 const year=years.find(x=>String(x.id)===String(grade));
 if(!year)return null;
 const source=SOURCE[code][st==='medium'?'upper':'basic'];
 const additional=code==='NL'?' Traseul și profilul VMBO/HAVO/VWO trebuie confirmate pentru anii superiori.':
  code==='DE'?' Landul (inclusiv diferența Berlin/Brandenburg) și tipul școlii trebuie confirmate.':
  code==='IE'&&grade==='TY'?' Transition Year este o perioadă de explorare, nu o materie anuală unică.':
  code==='PL'?' Doar clasele I și IV intră în noua reformă 2026/27; celelalte clase nu sunt reformate retroactiv.':
  '';
 const english={arithmetic:'Numbers and calculation',geometry:'Geometry',measurement:'Measurement',
  statistics:'Statistics and probability',algebra:'Algebra and equations',
  functions:'Functions and graphs',trigonometry:'Trigonometry',analysis:'Mathematical analysis',
  'linear-algebra':'Linear algebra',discrete:'Discrete mathematics',differential:'Differential equations'};
 const units=topics.map(([id,ro,en])=>({id,ro,en:en||english[id]||ro,
  native:p.nativeTopics[id]||en||english[id]||ro,
  nativeLang:p.lang,focus:'',countryFrameworkSpecific:true,countrySpecific:false,
  curriculumCompletion:'unverified-advisory',curriculumSource:source}));
 return {country:code,stage:st,grade,source,note:p.note+additional+
  ' Lecțiile sunt materiale didactice originale/adaptative, nu o listă oficială de manual pe fiecare an.',
  units,year};
}
export function bulkMathPhase({country,stage,grade,years=[]}={}){
 const code=String(country||'').toUpperCase(),p=DATA[code],st=String(stage||'');
 if(!p||st==='advanced')return null;
 const index=years.findIndex(x=>String(x.id)===String(grade));
 if(index<0)return null;
 let phases;
 if(st==='beginner'){
  if(code==='NL')phases=[Math.max(1,Math.min(6,Number(String(grade).slice(1))-2))];
  else if(code==='IE')phases=[/^[1-6]C$/.test(String(grade))?Number(String(grade)[0]):1];
  else if(code==='PL')phases=[index+1]; // primary I–III: integrated education
  else phases=[Math.max(1,Math.min(6,index+1))]; // 7th Norwegian primary grade consolidates sixth phase
 }else if(st==='lower'){
  if(code==='PL')phases=({IV:[1],V:[2],VI:[2],VII:[3],VIII:[4]})[grade];
  else if(code==='DE')phases=([[1],[1,2],[2],[3],[3,4],[4]])[index];
  else if(code==='AT'||code==='HU')phases=[[1],[2],[3],[4]][index];
  else phases=([[1],[2,3],[4]])[index];
 }else if(st==='medium'){
  if(code==='PL')phases=([[1],[2],[3],[4]])[index];
  else if(code==='AT'||code==='HU')phases=([[1],[1],[2],[3],[4]])[index];
  else if(code==='DE')phases=([[1],[2,3],[4]])[index];
  else if(code==='IE')phases=([[1],[2],[3,4]])[index];
  else phases=([[1],[2,3],[4]])[index];
 }
 if(!phases?.length)return null;
 return {phase:phases[phases.length-1],phases,yearIndex:index};
}
// 30 distinct grade-entry examples in ten national languages.  These are
// examples for maths skills, not proof that a school teaches a given item in
// a legally prescribed month, module or textbook chapter.
const FIRST_GRADE={
 FI:['1','7','10'],SE:['1','7','10'],NO:['1','8','11'],DK:['1','7','10'],
 NL:['G3','V1','V4'],IE:['1C','J1','5Y'],DE:['1','5','11'],
 AT:['1','5','9'],PL:['I','IV','L1'],HU:['1','5','9']
};
const SAMPLE={
 beginner:{topic:'arithmetic',formula:'3 + 4 = 7',
  statement:'Adunarea a două grupuri mici poate fi explicată numărând toate obiectele. Pentru un copil de la începutul ciclului primar folosim materiale concrete, fără algebră formală.',
  worked:'Punem trei cuburi lângă patru cuburi; numărăm o singură dată fiecare cub și obținem șapte. Verificăm rezultatul despărțind din nou grupele.',
  practice:'Ai cinci creioane și primești încă două. Câte creioane ai în total?',answers:'7 creioane.'},
 lower:{topic:'algebra',formula:'5 + 2 × 3 = 11',
  statement:'Ordinea operațiilor indică executarea înmulțirii înaintea adunării dacă nu există paranteze care schimbă ordinea. Justificăm fiecare pas, nu memorăm doar rezultatul.',
  worked:'Calculăm mai întâi 2×3=6, apoi 5+6=11. Prin estimare știm că rezultatul trebuie să fie mai mare decât cinci.',
  practice:'Calculează 8 + 3×4 și explică ordinea operațiilor.',answers:'20: 3×4=12, 8+12=20.'},
 medium:{topic:'functions',formula:'f(x) = 2x + 3',
  statement:'O funcție atribuie fiecărei valori admise a lui x o singură valoare f(x). O reprezentăm prin tabel sau printr-un grafic, indicând clar domeniul.',
  worked:'Pentru x=0,1,2 calculăm f(x)=3,5,7. Punctele (0,3), (1,5) și (2,7) sunt pe aceeași dreaptă. Verificăm fiecare pereche substituind în formulă.',
  practice:'Dacă f(x)=2x+3, calculează f(4).',answers:'11.'}
};
export function bulkMathFirstLessons({country,stage,grade,topic}={}){
 const code=String(country||'').toUpperCase(),p=DATA[code];
 if(!p||!FIRST_GRADE[code])return [];
 const st=stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
 const i=['beginner','lower','medium'].indexOf(st);
 if(i<0||String(grade)!==FIRST_GRADE[code][i])return [];
 const sample=SAMPLE[st];
 if(topic!==sample.topic)return [];
 const source=SOURCE[code][st==='medium'?'upper':'basic'];
 return [{id:'math-europe-'+code.toLowerCase()+'-'+st+'-'+String(grade).toLowerCase(),
  country:code,grade:String(grade),topic:sample.topic,stage:stage,
  subject:'math',level:st==='medium'?'intermediate':'beginner',
  title:p.starter[i],enTitle:['Count and combine objects','Use the order of operations','Functions and graphs'][i],
  statement:sample.statement,formula:sample.formula,worked:sample.worked,
  practice:sample.practice,answers:sample.answers,aliases:[],
  source,sourceStatus:'country-source-informed-example-not-textbook',
  curriculumCompletion:'unverified-advisory'}];
}
