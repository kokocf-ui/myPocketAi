// Final 11 European jurisdictions for Mathematics-only school-framework alignment.
// 2026/27: school names, stage lengths, cohort exceptions, and national/regional
// curricula must not be mistaken for verified grade-specific textbook lessons.
// Vatican City is special: there is no independent regular state school
// timetable to invent. Residents normally attend Italian/international schools
// in Rome; Mathematics here must ask for an external school curriculum.
const C=Object.freeze({
 AD:{lang:'ca',name:'Andorra',
  stage:['Primera ensenyança · Escola Andorrana','Segona ensenyança · Escola Andorrana','Batxillerat · Escola Andorrana'],
  note:'Andorra are sisteme paralele andorran, francez și spaniol (precum și alte opțiuni). Anii afișați se referă numai la traseul Escola Andorrana; alegerea țării nu stabilește limba și programa efectivă.',
  source:'https://www.govern.ad/ca/ministeris-i-secretaries-d-estat/ministeri-de-relacions-institucionals-educacio-i-universitats/estructura-educativa',
  native:{arithmetic:'Nombres i càlcul',geometry:'Geometria',measurement:'Mesures',algebra:'Àlgebra',statistics:'Estadística i probabilitat',functions:'Funcions'},
  track:'Escola Andorrana / système français / sistema español'},
 BY:{lang:'be',name:'Belarus',
  stage:['Пачатковая школа · 1–4 клас','Базавая школа · 5–9 клас','Сярэдняя школа · 10–11 клас'],
  note:'Belarus: clasele 1–4, 5–9 și 10–11 formează cadrul general; materialele pot exista în belarusă sau rusă. Nu prezentăm o succesiune de manuale drept aprobată fără lista oficială a edițiilor și limba predării.',
  source:'https://edu.gov.by/',
  native:{arithmetic:'Лікі і дзеянні',geometry:'Геаметрыя',measurement:'Вымярэнні',algebra:'Алгебра',statistics:'Статыстыка і імавернасць',functions:'Функцыі'},
  track:'мова навучання / школа'},
 IS:{lang:'is',name:'Islanda',
  stage:['Grunnskóli · 1.–7. bekkur','Grunnskóli · 8.–10. bekkur','Framhaldsskóli · áfangar / skólaár'],
  note:'Islanda: grunnskóli cuprinde clasele 1–10; împărțirea 1–7/8–10 este numai pentru navigarea aplicației. Framhaldsskóli este bazat pe credite și cursuri (áfangar), nu un liceu național identic de patru ani.',
  source:'https://www.norden.org/en/info-norden/compulsory-school-iceland',
  native:{arithmetic:'Tölur og reikningur',geometry:'Rúmfræði',measurement:'Mælingar',algebra:'Algebra',statistics:'Tölfræði og líkur',functions:'Föll'},
  track:'framhaldsskóli / áfangar'},
 LI:{lang:'de',name:'Liechtenstein',
  stage:['Primarschule · Klassen 1–5','Sekundarstufe I · Schuljahre 6–9','Gymnasium / beruflicher Bildungsweg'],
  note:'Liechtenstein: cinci ani de Primarschule și trasee diferite ulterior, inclusiv Oberschule, Realschule și Gymnasium. Anii de Gymnasium superior din selector sunt orientativi, nu cursuri anuale obligatorii.',
  source:'https://www.llv.li/en/national-administration/office-of-education/educational-fields/education-system---types-of-schools',
  native:{arithmetic:'Zahlen und Rechnen',geometry:'Raum und Form',measurement:'Grössen und Messen',algebra:'Algebra',statistics:'Daten und Wahrscheinlichkeit',functions:'Funktionen'},
  track:'Oberschule/Realschule/Gymnasium'},
 MC:{lang:'fr',name:'Monaco',
  stage:['École élémentaire · CP–CM2','Collège · 6e–3e','Lycée · Seconde–Terminale'],
  note:'Monaco: învățământul general urmează în mare parte ciclurile și programele franceze, cu reguli și adaptări locale. Un manual francez de 5e nu certifică automat lista anuală a fiecărei școli monegasce.',
  source:'https://legimonaco.mc/tnc/arrete-ministeriel/2016/08-02-2016-494',
  native:{arithmetic:'Nombres et calcul',geometry:'Espace et géométrie',measurement:'Grandeurs et mesures',algebra:'Calcul littéral',statistics:'Statistiques et probabilités',functions:'Fonctions'},
  track:'établissement / cohorte / filière'},
 MK:{lang:'mk',name:'Macedonia de Nord',
  stage:['Основно образование · I–V одделение','Основно образование · VI–IX одделение','Средно образование · гимназија/стручно'],
  note:'Macedonia de Nord: școala de bază are nouă clase; anul 2026/27 are un plan oficial publicat, însă ordinea matematicii variază după an și cohortă. Gymnazija și școala profesională nu au toate aceleași cursuri.',
  source:'https://bro.gov.mk/nastavni-programi/',
  native:{arithmetic:'Броеви и операции',geometry:'Геометрија',measurement:'Мерење',algebra:'Алгебра',statistics:'Статистика и веројатност',functions:'Функции'},
  track:'наставен план 2026/27 / вид училиште'},
 RU:{lang:'ru',name:'Rusia',
  stage:['Начальное общее образование · 1–4 класс','Основное общее образование · 5–9 класс','Среднее общее образование · 10–11 класс'],
  note:'Rusia: școala generală are etape de 4, 5 și 2 ani. Programele federale de Matematică, Algebra, Geometria, Probabilitate și Statistică diferă după clase și după nivelul de bază/aprofundat în liceu; verifică ediția federală curentă.',
  source:'https://edsoo.ru/rabochie-programmy/',
  native:{arithmetic:'Числа и вычисления',geometry:'Геометрия',measurement:'Величины и измерения',algebra:'Алгебра',statistics:'Вероятность и статистика',functions:'Функции'},
  track:'ФРП / базовый или углублённый уровень'},
 SM:{lang:'it',name:'San Marino',
  stage:['Scuola Elementare · 1ª–5ª','Scuola Media · 1ª–3ª','Scuola Secondaria Superiore / CFP'],
  note:'San Marino: Scuola Elementare are cinci ani, Scuola Media trei, iar superiorul poate urma cursuri și profiluri diferite. Sistemul sammarinez nu se confundă automat cu cel italian, chiar dacă folosește materiale similare.',
  source:'https://www.istruzioneecultura.sm/pub1/IstruzioneSM/istruzione/SISTEMA-SCOLASTICO-E-FORMATIVO.html',
  native:{arithmetic:'Numeri e operazioni',geometry:'Geometria',measurement:'Grandezze e misure',algebra:'Algebra',statistics:'Statistica e probabilità',functions:'Funzioni'},
  track:'Scuola Superiore / Centro di Formazione Professionale'},
 UA:{lang:'uk',name:'Ucraina',
  stage:['Початкова школа · 1–4 клас','Гімназія · 5–9 клас','Ліцей · 10–11 клас / 12 пілот'],
  note:'Ucraina: în 2026/27 clasele 10–11 continuă sistemul anterior în multe școli; reforma profilată de 12 ani are pilot în 2026 și aplicare națională de la 2027. Clasa 12 NU este o clasă obligatorie generală 2026/27.',
  source:'https://mon.gov.ua/news/uriad-onovyv-dorozhniu-kartu-reformy-nush-do-2029-roku',
  native:{arithmetic:'Числа і дії',geometry:'Геометрія',measurement:'Вимірювання',algebra:'Алгебра',statistics:'Статистика й імовірність',functions:'Функції'},
  track:'НУШ когорта / пілот / академічний профіль'},
 VA:{lang:'it',name:'Vatican',
  stage:['Curriculum al unei școli externe · nivel primar','Curriculum al unei școli externe · nivel secundar','Curriculum al unei școli externe · nivel liceal'],
  note:'Vatican: nu există o programă obișnuită de Matematică primară/gimnazială/liceală separată a statului. Copiii rezidenților frecventează școli din Roma (italiene sau internaționale). Alege țara/sistemul școlii reale, de exemplu Italia; acestea sunt doar instrumente generale de învățare.',
  source:'https://digitallibrary.un.org/record/778877/files/CRC_C_VAT_Q_2_Add.1-EN.pdf',
  native:{arithmetic:'Numeri e operazioni · curriculum esterno',geometry:'Geometria · curriculum esterno',measurement:'Misure · curriculum esterno',algebra:'Algebra · curriculum esterno',statistics:'Statistica · curriculum esterno',functions:'Funzioni · curriculum esterno'},
  track:'scuola italiana o internazionale (non programma nazionale vaticano)'},
 XK:{lang:'multi',name:'Kosovo',
  stage:['Shkolla fillore · I–V / Основна школа','Arsimi i mesëm i ulët · VI–IX','Arsimi i mesëm i lartë / средња школа'],
  note:'Kosovo: structura de bază este 1–5, 6–9 și secundar superior. Programa reală depinde de limba de predare, instituție și tipul școlii; materialele în albaneză și sârbă nu se presupun identice.',
  source:'https://masht.rks-gov.net/',
  native:{arithmetic:'Numrat dhe veprimet / Бројеви и операције',geometry:'Gjeometria / Геометрија',measurement:'Matjet / Мерење',algebra:'Algjebra / Алгебра',statistics:'Statistika / Статистика',functions:'Funksionet / Функције'},
  track:'gjuha e mësimit / наставни језик / shkolla'}
});
export const MATH_FINAL_COUNTRIES=Object.freeze(Object.keys(C));
export const MATH_FINAL_DATA=C;
export const MATH_FINAL_SOURCES=Object.freeze(Object.fromEntries(Object.entries(C)
 .map(([code,p])=>[code,{curriculum:p.source,note:p.note}])));
export const MATH_FINAL_STAGE_LABELS=Object.freeze(Object.fromEntries(Object.entries(C)
 .map(([code,p])=>[code,{
  primary:[p.stage[0],p.stage[0]],lower:[p.stage[1],p.stage[1]],
  intermediate:[p.stage[2],p.stage[2]]
 }])));
const stageKey=stage=>stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
function localName(code,stage,year,index){
 const id=String(year.id),n=Number((id.match(/\d+/)||[])[0]||index+1),step=index+1;
 switch(code){
 case 'AD':return stage==='beginner'?'Escola Andorrana · primera ensenyança '+n:
  stage==='lower'?'Segona ensenyança · curs '+step:
   'Batxillerat · curs '+step;
 case 'BY':return (stage==='beginner'?'Пачатковая школа':stage==='lower'?'Базавая школа':'Сярэдняя школа')+' · '+id+' клас';
 case 'IS':return stage==='medium'?'Framhaldsskóli · '+step+'. námsár (leiðbeinandi)':
  'Grunnskóli · '+n+'. bekkur';
 case 'LI':return stage==='beginner'?'Primarschule · '+n+'. Klasse':
  stage==='lower'?'Sekundarstufe I · '+n+'. Schuljahr':
   'Gymnasium Oberstufe · '+step+'. Jahr (orientierend)';
 case 'MC':return stage==='beginner'?'École élémentaire · '+id:
  stage==='lower'?'Collège · '+id:
   'Lycée · '+id;
 case 'MK':return stage==='medium'?'Средно образование · '+step+'. година':
  'Основно образование · '+n+'. одделение';
 case 'RU':return (stage==='beginner'?'Начальная школа':stage==='lower'?'Основная школа':'Средняя школа')+
  ' · '+n+' класс';
 case 'SM':return stage==='beginner'?'Scuola Elementare · '+n+'ª':
  stage==='lower'?'Scuola Media · '+(n-5)+'ª':
   'Scuola Superiore · '+(n-8)+'º anno';
 case 'UA':return stage==='medium'&&id==='12'?'Ліцей · 12 клас (лише пілот / 2026–27)':
  (stage==='beginner'?'Початкова школа':stage==='lower'?'Гімназія':'Ліцей')+
   ' · '+n+' клас';
 case 'VA':return 'Seleziona il curriculum della scuola esterna · '+(
  stage==='beginner'?'primaria':stage==='lower'?'secondaria':'liceo');
 case 'XK':return stage==='beginner'?'Shkolla fillore · klasa '+n:
  stage==='lower'?'Shkolla e mesme e ulët · klasa '+n:
   'Shkolla e mesme e lartë · klasa '+n;
 default:return String(year.en||year.ro||id);
 }
}
export function finalMathStudyYears({country,stage,years=[]}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||st==='advanced')return null;
 const list=code==='VA'?[{id:'external-curriculum',
  ro:'Alege programa școlii din afara Vaticanului',
  en:'Choose the school curriculum outside Vatican City'}]:years;
 return (Array.isArray(list)?list:[]).map((entry,index)=>({
  ...entry,native:localName(code,st,entry,index),nativeLang:p.lang,
  nationalYearVerified:code==='VA'?false:
   !(code==='AD'||code==='XK'||(code==='UA'&&entry.id==='12')||st==='medium'),
  curriculumVerified:false,countryFrameworkSpecific:true,
  ...(code==='UA'&&entry.id==='12'?{pilotOnly:true}:{})
 }));
}
export function finalMathPhase({country,stage,grade,years=[]}={}){
 const code=String(country||'').toUpperCase(),st=stageKey(stage);
 if(!C[code]||st==='advanced')return null;
 const i=years.findIndex(x=>String(x.id)===String(grade));
 if(i<0)return null;
 if(code==='VA')return {phase:1,phases:[1],yearIndex:i};
 const n=years.length;
 const count=st==='beginner'?6:4;
 if(st==='beginner')return {phase:Math.min(6,i+1),phases:[Math.min(6,i+1)],yearIndex:i};
 const patterns=st==='lower'?{
  3:[[1],[2,3],[4]],4:[[1],[2],[3],[4]],5:[[1],[2],[2],[3],[4]]
 }:{
  2:[[1,2],[3,4]],3:[[1],[2,3],[4]],4:[[1],[2],[3],[4]],
  5:[[1],[1],[2],[3],[4]]
 };
 const phases=patterns[n]?.[i];
 if(!phases?.length)return null;
 return {phase:phases[phases.length-1],phases,yearIndex:i};
}
export function finalMathGradeProfile({country,stage,grade,years=[],topics=[]}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||st==='advanced'||!years.some(y=>String(y.id)===String(grade)))return null;
 const cohort=code==='UA'&&st==='medium'&&String(grade)==='12'?
  ' Numai elevii din licee-pilot cu clasa 12; NU este anul standard pentru toate școlile în 2026/27.':
  code==='UA'&&st==='medium'?
  ' Cohorta non-pilot poate continua traseul anterior; pilotul NUS începe doar în unele licee.':'';
 const note=p.note+cohort+' Alegerea traseului este necesară: '+p.track+
  '. Lecțiile disponibile sunt materiale auxiliare; un cuprins anual oficial sau manual complet NU a fost verificat.';
 const english={
  arithmetic:'Numbers and calculation',geometry:'Geometry',measurement:'Measures',
  algebra:'Algebra',statistics:'Data and probability',functions:'Functions',
  trigonometry:'Trigonometry',analysis:'Analysis','linear-algebra':'Linear algebra',
  discrete:'Discrete maths',differential:'Differential equations'};
 return {country:code,stage:st,grade,source:p.source,note,requires:p.track,
  units:topics.map(([id,ro,en])=>({id,ro,
   en:en||english[id]||ro,native:p.native[id]||english[id]||ro,
   nativeLang:p.lang,focus:'',countrySpecific:false,countryFrameworkSpecific:true,
   curriculumCompletion:'unverified-advisory',curriculumSource:p.source}))};
}
const FIRST=Object.freeze({
 AD:['1','S1','B1'],BY:['1','5','10'],IS:['1','8','11'],
 LI:['1','6','O1'],MC:['CP','6e','2nde'],MK:['1','6','10'],
 RU:['1','5','10'],SM:['1','6','9'],UA:['1','5','10'],
 XK:['1','6','10']
});
export const MATH_FINAL_FIRST=FIRST;
export function finalMathStarterLessons({country,stage,grade,topic}={}){
 const code=String(country||'').toUpperCase(),p=C[code],st=stageKey(stage);
 if(!p||code==='VA'||st==='advanced')return [];
 const n=['beginner','lower','medium'].indexOf(st);
 if(n<0||String(grade)!==FIRST[code]?.[n])return [];
 const target=st==='beginner'?'arithmetic':st==='lower'?'algebra':'functions';
 if(String(topic)!==target)return [];
 const base=MATH_FINAL_COUNTRIES.indexOf(code)+2;
 const x=base+2,y=3+(base%5),product=2+base%4;
 const fSlope=2+(base%4),fOffset=1+base%6;
 const statement=st==='beginner'?
  'Numărăm fiecare obiect o singură dată și combinăm două grupe pentru a obține suma; verificarea prin materiale concrete dezvoltă simțul numerelor în primii ani de școală.':
  st==='lower'?
  'Aplicăm regula calculului cu prioritate: întâi înmulțirea și împărțirea, apoi adunarea și scăderea. Parantezele pot modifica această ordine.':
  'O funcție liniară exprimă o legătură între x și y. Folosim o regulă explicită, un domeniu și o unitate pentru a interpreta punctele de pe grafic.';
 const formula=st==='beginner'?x+' + '+y+' = '+(x+y):
  st==='lower'?x+' + '+product+' × 3 = '+(x+product*3):
   'f(x) = '+fSlope+'x + '+fOffset;
 const worked=st==='beginner'?
  'Așezăm '+x+' cuburi și apoi '+y+' cuburi. Le numărăm pe toate o singură dată și găsim '+(x+y)+'.':
  st==='lower'?'Calculăm '+product+'×3='+(product*3)+', apoi '+x+'+'+(product*3)+'='+(x+product*3)+'.':
   'Dacă x=3, calculăm f(3)='+fSlope+'×3+'+fOffset+'='+(3*fSlope+fOffset)+'.';
 const practice=st==='beginner'?'Calculează '+y+' + '+x+' și explică adunarea.':
  st==='lower'?'Recalculează '+x+' + '+product+' × 3 arătând ordinea.':
   'Calculează f(2) pentru f(x) = '+fSlope+'x + '+fOffset+'.';
 const answers=st==='beginner'?String(x+y):st==='lower'?String(x+product*3):
  String(2*fSlope+fOffset);
 return [{
  id:'math-final-'+code.toLowerCase()+'-'+st,subject:'math',country:code,grade:String(grade),
  stage:st==='beginner'?'primary':st==='medium'?'intermediate':'lower',
  topic:target,level:st==='medium'?'intermediate':'beginner',
  title:p.native[target]+' · exercițiu introductiv',
  enTitle:st==='beginner'?'Count and add':st==='lower'?'Operation priority':'Linear model',
  statement,formula,worked,practice,answers,aliases:[],
  source:p.source,sourceStatus:'national-structure-linked-advisory-not-textbook',
  curriculumCompletion:'unverified-advisory'
 }];
}
