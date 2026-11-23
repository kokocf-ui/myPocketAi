// Mathematics-specific second European batch: 23 jurisdictions, 2026/27.
// School structures are sourced from Eurydice 2026/27 and, where listed,
// national education/curriculum authorities. Structure != verified annual
// syllabus. Regional school streams and language communities require a later
// choice; shared practice cards remain supplementary, not ministry textbooks.
// Do NOT change other Education subjects' school calendars or existing routes.
export const EUROPE_2026_STRUCTURE =
 'https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en';
const C=Object.freeze({
 BE:{lang:'multi',name:'Belgia',
  stage:['Enseignement primaire / Lager onderwijs','Enseignement secondaire / Secundair onderwijs','Enseignement secondaire supérieur / Secundair 2e-3e graad'],
  note:'Belgia: programa școlară este stabilită separat de comunitățile flamandă, franceză și germanofonă. Școala, comunitatea și limba trebuie selectate înainte de a identifica un curs oficial.',
  native:{arithmetic:'Nombres et opérations / Getallen en bewerkingen',geometry:'Géométrie / Meetkunde',measurement:'Grandeurs / Meten',algebra:'Algèbre / Algebra',statistics:'Statistiques / Statistiek',functions:'Fonctions / Functies'},
  track:'communauté / gemeenschap / Gemeinschaft'},
 CH:{lang:'multi',name:'Elveția',
  stage:['Primarschule / École primaire / Scuola elementare','Sekundarstufe I / Secondaire I','Gymnasium / Maturité / Maturità'],
  note:'Elveția: sistemul și programa diferă după canton, limbă și traseu. Lehrplan 21 se aplică regiunii germanofone; Plan d’études romand și Piano di studio aparțin altor regiuni. Nu se poate atribui tuturor un curriculum anual național.',
  native:{arithmetic:'Zahlen und Operationen / Nombres et calcul',geometry:'Raum und Form / Espace et géométrie',measurement:'Grössen / Grandeurs',algebra:'Algebra / Algèbre',statistics:'Statistik / Statistiques',functions:'Funktionen / Fonctions'},
  track:'canton + langue + type d’école'},
 LU:{lang:'fr',name:'Luxemburg',
  stage:['École fondamentale · cycles 2–4','Enseignement secondaire · 7e–5e','Secondaire classique/général · 4e–1re'],
  note:'Luxemburg: éducation fondamentale include ciclurile 2–4 ca școală primară; secundarul este diferențiat între enseignement secondaire classique și général, cu curricula distincte. Trebuie ales traseul.',
  native:{arithmetic:'Nombres et calcul',geometry:'Géométrie et espace',measurement:'Grandeurs et mesures',algebra:'Calcul littéral',statistics:'Statistiques et probabilités',functions:'Fonctions'},
  track:'enseignement secondaire classique/général'},
 CZ:{lang:'cs',name:'Cehia',
  stage:['Základní škola · 1.–5. ročník','Základní škola · 6.–9. ročník','Gymnázium / střední škola · 4 ročníky'],
  note:'Cehia: cadrul RVP ZV și programele școlilor ŠVP sunt distincte. Revizuirea RVP ZV nu se aplică simultan tuturor cohortelor în 2026/27; gimnázium și învățământul profesional au structuri separate.',
  mathSource:'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani',
  native:{arithmetic:'Číslo a početní operace',geometry:'Geometrie v rovině a prostoru',measurement:'Závislosti a měření',algebra:'Číslo a proměnná',statistics:'Práce s daty',functions:'Závislosti a funkce'},
  track:'ŠVP / typ střední školy'},
 SK:{lang:'sk',name:'Slovacia',
  stage:['Základná škola · 1.–4. ročník','Základná škola · 5.–9. ročník','Gymnázium / stredná škola'],
  note:'Slovacia: noul Štátny vzdelávací program al școlii de bază se introduce treptat; școlile își elaborează propriul ŠkVP. Gimnázium cu 4 sau 8 ani și școlile profesionale au trasee diferite.',
  native:{arithmetic:'Čísla a operácie',geometry:'Geometria a meranie',measurement:'Meranie a jednotky',algebra:'Premenné a výrazy',statistics:'Kombinatorika, pravdepodobnosť, štatistika',functions:'Funkcie'},
  track:'typ školy / ŠkVP'},
 SI:{lang:'sl',name:'Slovenia',
  stage:['Osnovna šola · 1.–6. razred','Osnovna šola · 7.–9. razred','Gimnazija / srednja šola'],
  note:'Slovenia: osnovna šola are nouă clase organizate în perioade de învățare; gimnazija și învățământul profesional au trasee matematice diferite. Grupele primar/secundar din aplicație sunt segmente de navigare, nu instituții separate.',
  native:{arithmetic:'Števila in računske operacije',geometry:'Geometrija',measurement:'Merjenje',algebra:'Algebra',statistics:'Statistika in verjetnost',functions:'Funkcije'},
  track:'gimnazija / strokovna šola'},
 HR:{lang:'hr',name:'Croația',
  stage:['Osnovna škola · razredi 1.–4.','Osnovna škola · razredi 5.–8.','Gimnazija / strukovna škola'],
  note:'Croația: matematica din osnovna škola acoperă clasele 1–8; gimnazija și strukovna škola au programe și ore distincte. Documentele ministeriale stabilesc domenii, nu un cuprins unic al tuturor manualelor.',
  mathSource:'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_215.html',
  native:{arithmetic:'Brojevi',geometry:'Oblik i prostor',measurement:'Mjerenje',algebra:'Algebra i funkcije',statistics:'Podatci, statistika i vjerojatnost',functions:'Algebra i funkcije'},
  track:'gimnazija / strukovna škola'},
 GR:{lang:'el',name:'Grecia',
  stage:['Δημοτικό σχολείο · τάξεις Α΄–ΣΤ΄','Γυμνάσιο · τάξεις Α΄–Γ΄','Γενικό Λύκειο / ΕΠΑΛ'],
  note:'Grecia: Δημοτικό are șase clase, Γυμνάσιο trei, iar Γενικό Λύκειο și ΕΠΑΛ au itinerare și matematică diferite. Curricula școlare și tipul liceului necesită verificare separat.',
  native:{arithmetic:'Αριθμοί και πράξεις',geometry:'Γεωμετρία',measurement:'Μετρήσεις',algebra:'Άλγεβρα',statistics:'Στατιστική και πιθανότητες',functions:'Συναρτήσεις'},
  track:'ΓΕΛ / ΕΠΑΛ'},
 CY:{lang:'el',name:'Cipru',
  stage:['Δημοτικό σχολείο · 1η–6η τάξη','Γυμνάσιο · Α΄–Γ΄ τάξη','Λύκειο / Τεχνική σχολή'],
  note:'Cipru: programul matematicii din Δημοτικό, Γυμνάσιο și Λύκειο poate fi diferențiat în ultimii ani după orientare și școală tehnică. Nu se presupune că matematică liceală este aceeași în toate filierele.',
  native:{arithmetic:'Αριθμοί και πράξεις',geometry:'Γεωμετρία',measurement:'Μετρήσεις',algebra:'Άλγεβρα',statistics:'Στατιστική και πιθανότητες',functions:'Συναρτήσεις'},
  track:'Λύκειο / Τεχνική'},
 MT:{lang:'en',name:'Malta',
  stage:['Primary · Year 1–6','Secondary · Form 1–5','Sixth Form · Year 1–2'],
  note:'Malta: Primary are șase ani, Secondary Forms 1–5 se termină cu SEC, apoi Sixth Form durează în mod obișnuit doi ani și include opțiuni MATSEC. Împărțirea generică 7–9 / 10–13 este incorectă pentru Matematică și este înlocuită aici.',
  mathSource:'https://www.dsvp.mt/subjects/mathematics/maths_secondary/',
  native:{arithmetic:'Number and operations',geometry:'Geometry and space',measurement:'Measures',algebra:'Algebra',statistics:'Statistics and probability',functions:'Functions'},
  track:'SEC / MATSEC / school choice'},
 BG:{lang:'bg',name:'Bulgaria',
  stage:['Начално училище · 1.–4. клас','Основно образование · 5.–7. клас','Гимназия · 8.–12. клас'],
  note:'Bulgaria: clasele 1–4 și 5–7 se află în cadrul educației de bază, iar 8–12 în secundarul superior. Diferitele profiluri гимназия / професионална гимназия pot avea planuri matematice distincte.',
  native:{arithmetic:'Числа и действия',geometry:'Геометрични фигури',measurement:'Измерване',algebra:'Алгебра',statistics:'Статистика и вероятности',functions:'Функции'},
  track:'профилирана / професионална гимназия'},
 EE:{lang:'et',name:'Estonia',
  stage:['Põhikool · 1.–6. klass','Põhikool · 7.–9. klass','Gümnaasium · 10.–12. klass'],
  note:'Estonia: põhikool cuprinde clasele 1–9 (etapele 1–3, 4–6 și 7–9); gümnaasium clasele 10–12. Matematica liceală poate urma cursuri înguste sau extinse; programul școlii trebuie verificat.',
  native:{arithmetic:'Arvud ja arvutamine',geometry:'Geomeetria',measurement:'Mõõtmine',algebra:'Algebra',statistics:'Statistika ja tõenäosus',functions:'Funktsioonid'},
  track:'kitsas/lai matemaatika'},
 LV:{lang:'lv',name:'Letonia',
  stage:['Pamatizglītība · 1.–6. klase','Pamatizglītība · 7.–9. klase','Vidējā izglītība · 10.–12. klase'],
  note:'Letonia: învățământul de bază acoperă 1–9, iar secundarul superior 10–12. Skola2030 are obiective pe etape și cursuri aprofundate, nu o secvență națională identică de manuale.',
  native:{arithmetic:'Skaitļi un darbības',geometry:'Ģeometrija',measurement:'Mērīšana',algebra:'Algebra',statistics:'Statistika un varbūtība',functions:'Funkcijas'},
  track:'skolas programma / padziļinātais kurss'},
 LT:{lang:'lt',name:'Lituania',
  stage:['Pradinis ugdymas · 1.–4. klasė','Pagrindinis ugdymas · 5.–10. klasė','Gimnazija · 11.–12. klasė'],
  note:'Lituania: educația primară 1–4, educația de bază 5–10 și liceul 11–12; la gimnazija există trasee și niveluri diferite. Planul pe ani al școlii și examenele trebuie verificate distinct.',
  native:{arithmetic:'Skaičiai ir skaičiavimai',geometry:'Geometrija',measurement:'Matavimai',algebra:'Algebra',statistics:'Statistika ir tikimybės',functions:'Funkcijos'},
  track:'gimnazija / pasiekimų lygis'},
 RS:{lang:'sr',name:'Serbia',
  stage:['Основна школа · 1.–4. разред','Основна школа · 5.–8. разред','Гимназија / средња стручна школа'],
  note:'Serbia: основна школа are opt clase, iar гимназија și școala profesională au planuri separate. Pentru 2026/27 nu presupunem că modificările aprobate pentru o cohortă se aplică tuturor claselor; se verifică și alfabetul.',
  mathSource:'https://zuov.gov.rs/zakoni-i-pravilnici/',
  native:{arithmetic:'Бројеви и операције',geometry:'Геометрија',measurement:'Мерење',algebra:'Алгебра',statistics:'Статистика и вероватноћа',functions:'Функције'},
  track:'гимназија / стручна школа / писмо'},
 MD:{lang:'ro',name:'Republica Moldova',
  stage:['Învățământ primar · clasele I–IV','Gimnaziu · clasele V–IX','Liceu · clasele X–XII'],
  note:'Republica Moldova: primarul are clasele I–IV, gimnaziul V–IX, liceul X–XII. Matematica urmează curricula și edițiile de manual din Republica Moldova, nu pe cele ale României. Trebuie verificată limba de predare și profilul.',
  mathSource:'https://www.edu.gov.md/ro/content/invatamint-general',
  native:{arithmetic:'Numere și operații',geometry:'Figuri geometrice',measurement:'Mărimi și măsurări',algebra:'Algebră și ecuații',statistics:'Statistică și probabilități',functions:'Funcții și grafice'},
  track:'profil real/umanist + limbă de predare'},
 AL:{lang:'sq',name:'Albania',
  stage:['Arsimi fillor · klasa I–V','Arsimi i mesëm i ulët · VI–IX','Gjimnazi / arsimi profesional · X–XII'],
  note:'Albania: ciclurile sunt 1–5, 6–9 și învățământul secundar superior; programa și disciplina diferă după gjimnaz și filiera profesională. Această hartă nu este verificarea unui manual anual.',
  native:{arithmetic:'Numrat dhe veprimet',geometry:'Gjeometria',measurement:'Matja',algebra:'Algjebra',statistics:'Statistika dhe probabiliteti',functions:'Funksionet'},
  track:'gjimnaz / arsimi profesional'},
 TR:{lang:'tr',name:'Turcia',
  stage:['İlkokul · 1.–4. sınıf','Ortaokul · 5.–8. sınıf','Lise · 9.–12. sınıf'],
  note:'Turcia: Türkiye Yüzyılı Maarif Modeli se extinde gradual în 2026/27 la 1–3, 5–7 și 9–11, nu automat la 4, 8 sau 12. Cursul de matematică și setul de manuale depind de cohortă și de tipul liceului.',
  mathSource:'https://tymm.meb.gov.tr/ogretim-programlari/ders/matematik-dersi',
  native:{arithmetic:'Sayılar ve işlemler',geometry:'Geometri',measurement:'Ölçme',algebra:'Cebir',statistics:'İstatistik ve olasılık',functions:'Fonksiyonlar'},
  track:'TYMM cohort + lise türü'},
 ME:{lang:'sr',name:'Muntenegru',
  stage:['Osnovna škola · razredi 1–5','Osnovna škola · razredi 6–9','Gimnazija / stručna škola'],
  note:'Muntenegru: osnovna škola are nouă clase, iar împărțirea 1–5 și 6–9 este doar un mod de navigare al aplicației. În gymnazija și școli profesionale durata și matematica diferă.',
  native:{arithmetic:'Brojevi i računske operacije',geometry:'Geometrija',measurement:'Mjerenje',algebra:'Algebra',statistics:'Statistika i vjerovatnoća',functions:'Funkcije'},
  track:'gimnazija / stručna škola'},
 BA:{lang:'bs',name:'Bosnia și Herțegovina',
  stage:['Osnovna škola · razredi 1–5','Osnovna škola · razredi 6–9','Srednja škola / gimnazija'],
  note:'Bosnia și Herțegovina: programa și denumirile oficiale depind de entitatea administrativă, canton și limbă. Nu există o singură programă anuală oficială valabilă în toată țara.',
  native:{arithmetic:'Brojevi i računske operacije',geometry:'Geometrija',measurement:'Mjerenje',algebra:'Algebra',statistics:'Statistika i vjerovatnoća',functions:'Funkcije'},
  track:'entitet/kanton + jezik nastave + škola'},
 'GB-SCT':{lang:'en',name:'Scoția',
  stage:['Primary · P1–P7 (Curriculum for Excellence)','Broad General Education · S1–S3','Senior Phase · S4–S6'],
  note:'Scoția: Curriculum for Excellence lucrează cu experiențe și rezultate de la Early la Fourth level, nu cu același cuprins fix pe clasă ca National Curriculum din Anglia. Senior Phase diferențiază National 4/5, Higher și Advanced Higher.',
  mathSource:'https://education.gov.scot/curriculum-for-excellence/experiences-and-outcomes/',
  native:{arithmetic:'Number, money and measure',geometry:'Shape, position and movement',measurement:'Measurement',algebra:'Expressions and equations',statistics:'Information handling',functions:'Relationships and graphs'},
  track:'CfE level + qualification'},
 'GB-WLS':{lang:'en',name:'Țara Galilor',
  stage:['Primary · Years 1–6 (Curriculum for Wales)','Years 7–9 · progression in Mathematics and Numeracy','Years 10–13 · GCSE / A-level pathways'],
  note:'Țara Galilor: Curriculum for Wales organizează Mathematics and Numeracy pe etape de progres și cinci competențe interdependente, nu după capitolele statutare ale Angliei. GCSE și A-level depind de cohorte și calificări.',
  mathSource:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/mathematics-and-numeracy/',
  native:{arithmetic:'Number and numerical reasoning',geometry:'Geometry and shape',measurement:'Measures',algebra:'Algebraic reasoning',statistics:'Statistics and probability',functions:'Relationships and functions'},
  track:'Curriculum for Wales progression + GCSE'},
 'GB-NIR':{lang:'en',name:'Irlanda de Nord',
  stage:['Primary · Years 1–7 (Northern Ireland Curriculum)','Key Stage 3 · Years 8–10','GCSE / Sixth Form · Years 11–14'],
  note:'Irlanda de Nord: Year 1–7, Key Stage 3 Year 8–10, Key Stage 4 Year 11–12 și post-16 Years 13–14. CCEA și alte exam boards au specificații diferite; nu se folosește fără verificare programa Angliei.',
  mathSource:'https://ccea.org.uk/',
  native:{arithmetic:'Processes in mathematics',geometry:'Shape and space',measurement:'Measures',algebra:'Number and algebra',statistics:'Handling data',functions:'Relations and functions'},
  track:'KS3 / GCSE / A-level / exam board'}
});
export const MATH_SECOND_BATCH_COUNTRIES=Object.freeze(Object.keys(C));
export const MATH_SECOND_BATCH_DATA=C;
export const MATH_SECOND_BATCH_SOURCE_REGISTRY=Object.freeze(Object.fromEntries(
 Object.entries(C).map(([code,p])=>[code,{
  curriculum:p.mathSource||EUROPE_2026_STRUCTURE,
  note:p.note,
  ...(p.mathSource?{structureSource:EUROPE_2026_STRUCTURE}:{})
 }])
));
export const MATH_SECOND_BATCH_STAGE_LABELS=Object.freeze(Object.fromEntries(
 Object.entries(C).map(([code,p])=>[code,{
  primary:[p.stage[0],p.stage[0]],lower:[p.stage[1],p.stage[1]],
  intermediate:[p.stage[2],p.stage[2]]
 }])
));
const stageKey=stage=>stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
const primaryCycle=(code,grade,stage)=>{
 const id=String(grade||'');
 if(code==='LU'&&stage==='beginner')return 'cycle '+(Math.floor((Number(id.slice(1))-1)/2)+2);
 if(code==='HR'&&stage==='beginner')return '1–4';
 if(code==='EE'&&stage==='beginner')return Number(id)<=3?'I kooliaste':'II kooliaste';
 if(code==='LV'&&stage==='beginner')return Number(id)<=3?'1.–3. klase':'4.–6. klase';
 if(code==='TR'&&!['4','8','12'].includes(id))return 'TYMM';
 return null;
};
const greek=['Α΄','Β΄','Γ΄','Δ΄','Ε΄','ΣΤ΄'];
function localYear(code,stage,year,index){
 const id=String(year.id),n=Number((id.match(/\d+/)||[])[0]||index+1),step=index+1;
 switch(code){
 case 'BE':return stage==='beginner'?
  'Primaire / Lager onderwijs · année '+id:
  'Secondaire / Secundair onderwijs · année '+n;
 case 'CH':return stage==='beginner'?'Primarschule / école primaire · '+id:
  stage==='lower'?'Sekundarstufe I / secondaire I · '+id:
   'Gymnasium / maturité · '+id+' (indicatif)';
 case 'LU':return stage==='beginner'?'École fondamentale · '+primaryCycle(code,id,stage)+' · année '+n:
  'Enseignement secondaire · '+id;
 case 'CZ':return stage==='beginner'?'Základní škola · '+id+'. ročník (1. stupeň)':
  stage==='lower'?'Základní škola · '+id+'. ročník (2. stupeň)':
   'Gymnázium · '+step+'. ročník (orientační)';
 case 'SK':return stage==='medium'?'Gymnázium · '+step+'. ročník (orientačný)':
  'Základná škola · '+id+'. ročník';
 case 'SI':return stage==='medium'?'Gimnazija · '+step+'. letnik':
  'Osnovna šola · '+id+'. razred';
 case 'HR':return stage==='medium'?'Gimnazija · '+step+'. razred':
  'Osnovna škola · '+id+'. razred';
 case 'GR':return stage==='beginner'?'Δημοτικό · '+(greek[index]||n)+ ' τάξη':
  stage==='lower'?'Γυμνάσιο · '+(greek[index]||n)+' τάξη':
   'Λύκειο · '+(greek[index]||n)+' τάξη';
 case 'CY':return stage==='beginner'?'Δημοτικό · '+(greek[index]||n)+' τάξη':
  stage==='lower'?'Γυμνάσιο · '+(greek[index]||n)+' τάξη':
   'Λύκειο · '+(greek[index]||n)+' τάξη';
 case 'MT':return stage==='beginner'?'Primary · Year '+id:
  stage==='lower'?'Secondary · Form '+(n-6):
   'Sixth Form · Year '+(n-11);
 case 'BG':return (stage==='beginner'?'Начално училище':stage==='lower'?'Основно образование':'Гимназия')+
   ' · '+id+'. клас';
 case 'EE':return (stage==='medium'?'Gümnaasium':'Põhikool')+' · '+id+'. klass';
 case 'LV':return (stage==='medium'?'Vidusskola':'Pamatizglītība')+' · '+id+'. klase';
 case 'LT':return stage==='beginner'?'Pradinė mokykla · '+id+' klasė':
  stage==='lower'?'Pagrindinė mokykla · '+id+' klasė':
   'Gimnazija · '+(n===11?'III':n===12?'IV':step)+' klasė';
 case 'RS':return stage==='medium'?'Гимназија · '+step+'. разред':
   'Основна школа · '+id+'. разред';
 case 'MD':return (stage==='beginner'?'Primar':stage==='lower'?'Gimnaziu':'Liceu')+
   ' · clasa '+id;
 case 'AL':return (stage==='beginner'?'Shkolla fillore':stage==='lower'?'Arsimi i mesëm i ulët':'Gjimnazi')+
   ' · klasa '+id;
 case 'TR':return (stage==='beginner'?'İlkokul':stage==='lower'?'Ortaokul':'Lise')+
   ' · '+id+'. sınıf';
 case 'ME':return stage==='medium'?'Gimnazija · '+step+'. razred':
  'Osnovna škola · '+id+'. razred';
 case 'BA':return stage==='medium'?'Srednja škola · '+step+'. razred':
  'Osnovna škola · '+id+'. razred';
 case 'GB-SCT':return stage==='beginner'?'Primary · '+id:
  stage==='lower'?'Broad General Education · '+id:
   'Senior Phase · '+id;
 case 'GB-WLS':return 'Curriculum for Wales · '+id;
 case 'GB-NIR':return stage==='beginner'?'Primary · '+id:
  stage==='lower'?'Key Stage 3 · '+id:
   n<=12?'GCSE · '+id:'Sixth Form · '+id;
 default:return String(year.en||year.ro||id);
 }
}
function maltaYears(st){
 const seq=(a,b)=>Array.from({length:b-a+1},(_,i)=>{
  const id=String(a+i);
  return {id,ro:st==='beginner'?'Primar · anul '+(i+1):
   st==='lower'?'Secondary · Form '+(i+1):'Sixth Form · Year '+(i+1),
   en:st==='beginner'?'Primary · Year '+(i+1):
    st==='lower'?'Secondary · Form '+(i+1):'Sixth Form · Year '+(i+1)};
 });
 return st==='beginner'?seq(1,6):st==='lower'?seq(7,11):seq(12,13);
}
export function secondBatchMathStudyYears({country,stage,years=[]}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||st==='advanced')return null;
 const base=code==='MT'?maltaYears(st):Array.isArray(years)?years:[];
 return base.map((x,index)=>({
  ...x,native:localYear(code,st,x,index),nativeLang:p.lang,
  curriculumVerified:false,
  // The community/canton or track must be selected to verify a pupil's
  // official year. Otherwise do not conflate local labels with approval.
  nationalYearVerified:!['BE','CH','BA'].includes(code)&&st!=='medium',
  countryFrameworkSpecific:true,
  ...(primaryCycle(code,x.id,st)?{curriculumCycle:primaryCycle(code,x.id,st)}:{})
 }));
}
export function secondBatchMathPhase({country,stage,grade,years=[]}={}){
 const code=String(country||'').toUpperCase(),st=stageKey(stage);
 if(!C[code]||st==='advanced')return null;
 const index=years.findIndex(y=>String(y.id)===String(grade));
 if(index<0)return null;
 const total=years.length;
 let phases;
 if(st==='beginner'){
  const p=Math.min(6,index+1);
  phases=[p];
 }else if(st==='lower'){
  const patterns={3:[[1],[2,3],[4]],4:[[1],[2],[3],[4]],
   5:[[1],[2],[2,3],[3],[4]],6:[[1],[1,2],[2],[3],[3,4],[4]]};
  phases=(patterns[total]||[])[index];
 }else if(st==='medium'){
  const patterns={2:[[1,2],[3,4]],3:[[1],[2,3],[4]],
   4:[[1],[2],[3],[4]],5:[[1],[1],[2],[3],[4]]};
  phases=(patterns[total]||[])[index];
 }
 if(!phases?.length)return null;
 return {phase:phases[phases.length-1],phases,yearIndex:index};
}
export function secondBatchMathGradeProfile({country,stage,grade,years=[],topics=[]}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||st==='advanced')return null;
 const y=years.find(x=>String(x.id)===String(grade));
 if(!y)return null;
 const source=p.mathSource||EUROPE_2026_STRUCTURE;
 const yearSpecific=code==='TR'?(
  ['1','2','3','5','6','7','9','10','11'].includes(String(grade))?
  ' Pentru clasa selectată se aplică faza TYMM în 2026/27; verifică manualul ediției curente.':
  ' Clasa selectată rămâne în afara extinderii TYMM 2026/27 menționate de minister; nu i se aplică retroactiv un nou manual.'):'';
 const note=p.note+yearSpecific+
  ' Programa oficială pe această clasă și ordinea manualelor necesită verificare separată. '+p.track+
  ' trebuie ales pentru un curs individual; lista de mai jos este material de studiu orientativ.';
 const english={
  arithmetic:'Numbers and calculation',geometry:'Geometry',measurement:'Measurement',
  algebra:'Algebra and equations',statistics:'Statistics and probability',
  functions:'Functions and graphs',trigonometry:'Trigonometry',
  analysis:'Mathematical analysis','linear-algebra':'Linear algebra',
  discrete:'Discrete mathematics',differential:'Differential equations'
 };
 const units=topics.map(([id,ro,en])=>({
  id,ro,en:en||english[id]||ro,
  native:p.native[id]||english[id]||ro,nativeLang:p.lang,
  countryFrameworkSpecific:true,countrySpecific:false,
  curriculumCompletion:'unverified-advisory',
  curriculumSource:source,focus:''
 }));
 return {country:code,grade,stage:st,source,
  structureSource:EUROPE_2026_STRUCTURE,manualExample:null,
  requires:p.track,note,units};
}
// Original numerical worked examples for each of the 23 national entry paths.
// These are explicitly supplementary: no claim of a government-approved annual
// course, and not a translation or reproduction of a copyrighted school book.
export function secondBatchMathStarterLessons({country,stage,grade,topic,years=[]}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||st==='advanced'||!Array.isArray(years)||!years.length)return [];
 if(String(grade)!==String(years[0].id))return [];
 const target=st==='beginner'?'arithmetic':st==='lower'?'algebra':'functions';
 if(String(topic)!==target)return [];
 const num=MATH_SECOND_BATCH_COUNTRIES.indexOf(code)+1;
 const a=2+num%6,b=3+(num%5),sum=a+b;
 const ordered=5+num%5,product=2+num%4,result=ordered+product*3;
 const slope=2+num%4,intercept=1+num%5,input=2+num%3,output=slope*input+intercept;
 const titles={
  arithmetic:p.native.arithmetic+' · primele operații',
  algebra:p.native.algebra+' · ordinea operațiilor',
  functions:p.native.functions+' · un model funcțional'
 };
 const entry=st==='beginner'?{
  statement:'Adunarea descrie unirea a două grupe de obiecte. La clasele mici, elevul poate aranja și număra obiectele pentru a verifica rezultatul, fără simboluri abstracte nepotrivite vârstei.',
  formula:a+' + '+b+' = '+sum,
  worked:'Așezăm '+a+' obiecte, apoi încă '+b+'. Le numărăm fără a repeta vreun obiect: obținem '+sum+'. Verificăm și prin adunarea celor două cantități.',
  practice:'Ai '+a+' pietricele și primești '+b+'. Câte ai în total?',
  answers:sum+' pietricele.'}:
 st==='lower'?{
  statement:'Convenția ordinii operațiilor cere înmulțirea înaintea adunării, dacă nu există paranteze. Calculăm pe rând și verificăm rezultatul prin regrupare.',
  formula:ordered+' + '+product+' × 3 = '+result,
  worked:'Înmulțim '+product+' × 3 = '+(product*3)+', apoi adunăm '+ordered+' și obținem '+result+'. Nu efectuăm adunarea înaintea înmulțirii.',
  practice:'Calculează '+ordered+' + '+product+' × 3 și arată cei doi pași.',
  answers:result+': întâi '+(product*3)+', apoi '+ordered+' + '+(product*3)+'.'}:{
  statement:'O funcție liniară poate modela o valoare care crește constant. Parametrii au sens numai cu un domeniu și unități definite; pentru fiecare x admis avem o singură valoare y.',
  formula:'f(x) = '+slope+'x + '+intercept,
  worked:'Pentru x = '+input+', f(x) = '+slope+' × '+input+' + '+intercept+' = '+output+'. Punctul ('+input+', '+output+') aparține graficului; verificăm substituind în regulă.',
  practice:'Calculează f('+input+') pentru f(x) = '+slope+'x + '+intercept+'.',
  answers:output+'.'};
 const source=p.mathSource||EUROPE_2026_STRUCTURE;
 return [{id:'math-second-batch-'+code.toLowerCase().replace(/[^a-z]+/g,'-')+'-'+st,
  country:code,grade:String(grade),subject:'math',
  stage:st==='beginner'?'primary':st==='medium'?'intermediate':'lower',
  topic:target,level:st==='medium'?'intermediate':'beginner',
  title:titles[target],enTitle:st==='beginner'?'Count and combine groups':
    st==='lower'?'Order of operations':'Linear functions',
  statement:entry.statement,formula:entry.formula,worked:entry.worked,
  practice:entry.practice,answers:entry.answers,aliases:[],
  source,sourceStatus:'national-school-structure-referenced-practice-only',
  curriculumCompletion:'unverified-advisory'}];
}
