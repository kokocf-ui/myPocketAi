// Hungary MATHEMATICS ONLY: continuous school and university navigation.
// Official NAT 2020 outlines 1–4, 5–8 and 9–12 across multi-year cycles.
// Per-grade sequence below is independently authored for study support,
// not an official ministry-prescribed annual textbook table of contents.
// Grade 13 is shown ONLY as a specialised technikum pathway.
// Higher education is institution- and degree-specific, not NAT 2020.
export const HUNGARY_MATH_SOURCES=Object.freeze({
 school:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',
 primary:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat/kerettanterv_alt_isk_1_4_evf',
 lower:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat/kerettanterv_alt_isk_5_8',
 upper:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat/kerettanterv_gimn_9_12_evf',
 textbookCatalog:'https://www.tankonyvkatalogus.hu/',
 university:'https://www.math.elte.hu/en/studies/bsc/',
 bscDuration:'https://felvi.ttk.pte.hu/en/admission/english-degree-programs/bsc-study-programs/mathematics-bsc'
});
const gradeRow=(id,stage,phase,units,focus)=>Object.freeze({id,stage,phase,units,focus});
export const HUNGARY_MATH_GRADES=Object.freeze({
 '1':gradeRow('1','beginner',1,
  [['arithmetic','Numere, comparare, adunare și scădere','Numbers and early calculation'],
   ['geometry','Forme și orientare spațială','Shapes and spatial position'],
   ['measurement','Lungimi, timp și comparații','Informal measurement']],
  'Activități concrete, numărare, 0–20, compunerea și descompunerea numerelor.'),
 '2':gradeRow('2','beginner',2,
  [['arithmetic','Numere până la 100, înmulțire și împărțire','Place value, multiplication and division'],
   ['geometry','Figuri și simetrie','Shapes and symmetry'],
   ['measurement','Timp, lungime, masă și bani','Time, length, weight and money']],
  'Operații explicate prin grupuri egale și rezolvare cu desene.'),
 '3':gradeRow('3','beginner',3,
  [['arithmetic','Numere până la 1000, calcul scris și probleme','Written calculations'],
   ['geometry','Perimetre și reprezentări','Perimeter and geometry'],
   ['measurement','Unități de măsură și conversii','Units and conversion']],
  'Calcul, estimare, rezolvare de probleme și măsurători simple.'),
 '4':gradeRow('4','beginner',4,
  [['arithmetic','Numere până la 10 000, fracții și operații','Large numbers and basic fractions'],
   ['geometry','Arii, figuri și transformări','Areas and transformations'],
   ['measurement','Măsurări și interpretarea datelor','Measurement and data']],
  'Fracții introductive, calcule exacte și estimări, probleme practice.'),
 '5':gradeRow('5','lower',1,
  [['algebra','Numere naturale, fracții și calcule','Numbers, fractions and operations'],
   ['geometry','Geometrie plană și corpuri','Geometry and solids'],
   ['statistics','Tabele, diagrame și medii','Data and charts']],
  'Material de studiu corelat tematic cu NAT 2020 și manualul OH-MAT05TA.'),
 '6':gradeRow('6','lower',2,
  [['algebra','Numere raționale, procente și ecuații simple','Rational numbers and percentages'],
   ['geometry','Triunghiuri, patrulatere și arii','Plane geometry'],
   ['statistics','Date, frecvențe și probabilități intuitive','Statistics']],
  'Proporționalitate, operații cu fracții, construcții geometrice.'),
 '7':gradeRow('7','lower',3,
  [['algebra','Expresii algebrice și ecuații','Expressions and equations'],
   ['geometry','Unghiuri, congruență și demonstrații','Congruence and proof'],
   ['statistics','Probabilități și reprezentări','Probability and data']],
  'Litere, formule, demonstrații și evaluarea argumentelor.'),
 '8':gradeRow('8','lower',4,
  [['algebra','Ecuații, inecuații, sisteme și funcții','Equations and functions'],
   ['geometry','Asemănare, Pitagora și corpuri','Geometry and Pythagoras'],
   ['statistics','Statistică, frecvențe și numărare','Data and counting']],
  'Consolidare pentru continuarea studiilor, cu aplicații argumentate.'),
 '9':gradeRow('9','medium',1,
  [['algebra','Mulțimi, calcul algebric și ecuații','Sets and algebra'],
   ['functions','Funcții și grafice de bază','Elementary functions'],
   ['geometry','Geometrie în coordonate','Coordinate geometry'],
   ['statistics','Date și probabilitate elementară','Data and probability']],
  'Gimnázium general; secvența școlii poate diferi în interiorul ciclului 9–12.'),
 '10':gradeRow('10','medium',2,
  [['algebra','Polinoame și ecuații de gradul al doilea','Polynomials and quadratics'],
   ['functions','Funcții pătratice și grafice','Quadratic functions'],
   ['geometry','Geometrie plană și analitică','Analytic geometry'],
   ['trigonometry','Rapoarte trigonometrice','Trigonometry'],
   ['statistics','Probabilități și combinatorică','Probability and counting']],
  'Numere reale, ecuații și funcții, geometrie și modelare.'),
 '11':gradeRow('11','medium',3,
  [['analysis','Șiruri și noțiuni de limită','Sequences and introductory limits'],
   ['functions','Funcții compuse și transformări','Functions'],
   ['algebra','Ecuații și numere complexe','Advanced algebra'],
   ['geometry','Vectori și reprezentări','Vectors and geometry'],
   ['trigonometry','Identități trigonometrice','Trigonometric identities'],
   ['statistics','Probabilitate și date','Probability']],
  'Repartizare orientativă a competențelor din intervalul 9–12.'),
 '12':gradeRow('12','medium',4,
  [['analysis','Analiză și interpretarea variației','Introductory analysis'],
   ['functions','Studiul funcțiilor','Function investigation'],
   ['algebra','Recapitulare algebră și aplicații','Algebra and modelling'],
   ['geometry','Geometrie în spațiu','Spatial geometry'],
   ['trigonometry','Ecuații trigonometrice','Trigonometric equations'],
   ['statistics','Combinatorică și probabilități','Combinatorics and probability']],
  'Recapitulare și aplicații; nivelul érettségi depinde de examenele alese.'),
 '13':gradeRow('13','medium',4,
  [['algebra','Algebră aplicată tehnică','Technical applied algebra'],
   ['functions','Modelare funcțională pentru tehnologie','Technical function models'],
   ['statistics','Date și incertitudini de măsurare','Applied statistics']],
  'NUMAI anumite trasee technikum; nu este clasă obligatorie în gimnázium.'),
 'BSC1':gradeRow('BSC1','advanced',1,
  [['analysis','Analiză matematică I','Analysis I'],
   ['linear-algebra','Vectori, matrice și algebră liniară I','Linear algebra I'],
   ['discrete','Logică, mulțimi și demonstrații','Proof and discrete mathematics']],
  'Traseu orientativ Mathematics BSc, anul I; facultatea stabilește programa.'),
 'BSC2':gradeRow('BSC2','advanced',2,
  [['analysis','Analiză II și calcul integral','Analysis II'],
   ['linear-algebra','Algebră liniară II','Linear algebra II'],
   ['statistics','Probabilități și variabile aleatoare','Probability']],
  'Traseu orientativ Mathematics BSc, anul II; facultatea stabilește programa.'),
 'BSC3':gradeRow('BSC3','advanced',3,
  [['differential','Ecuații diferențiale','Differential equations'],
   ['analysis','Analiză avansată','Advanced analysis'],
   ['discrete','Grafuri, algoritmi și modele','Discrete mathematics']],
  'Traseu orientativ Mathematics BSc, anul III; facultatea stabilește programa.'),
 'MSC1':gradeRow('MSC1','advanced',4,
  [['analysis','Analiză și optimizare avansată','Advanced analysis'],
   ['statistics','Inferență statistică','Statistical inference'],
   ['discrete','Optimizare discretă','Discrete optimisation']],
  'MSc este un program distinct, accesibil după licență; specializarea decide cursurile.'),
 'MSC2':gradeRow('MSC2','advanced',4,
  [['analysis','Metode numerice și analiză aplicată','Numerical analysis'],
   ['statistics','Modelare statistică avansată','Statistical modelling'],
   ['discrete','Grafuri și optimizare avansată','Graph optimisation']],
  'MSc anul II: parcurs orientativ, nu o programă națională unică.')
});
export const HUNGARY_MATH_UNIVERSITY_YEARS=Object.freeze([
 {id:'BSC1',ro:'Matematică BSc · anul I',en:'Mathematics BSc · Year 1',native:'Matematika BSc · 1. év',nativeLang:'hu',curriculumVerified:false,nationalYearVerified:false},
 {id:'BSC2',ro:'Matematică BSc · anul II',en:'Mathematics BSc · Year 2',native:'Matematika BSc · 2. év',nativeLang:'hu',curriculumVerified:false,nationalYearVerified:false},
 {id:'BSC3',ro:'Matematică BSc · anul III',en:'Mathematics BSc · Year 3',native:'Matematika BSc · 3. év',nativeLang:'hu',curriculumVerified:false,nationalYearVerified:false},
 {id:'MSC1',ro:'Matematică MSc · anul I (după BSc)',en:'Mathematics MSc · Year 1',native:'Matematika MSc · 1. év',nativeLang:'hu',curriculumVerified:false,nationalYearVerified:false},
 {id:'MSC2',ro:'Matematică MSc · anul II (după BSc)',en:'Mathematics MSc · Year 2',native:'Matematika MSc · 2. év',nativeLang:'hu',curriculumVerified:false,nationalYearVerified:false}
]);
const HUNGARY_NATIVE_TOPICS=Object.freeze({
 arithmetic:'Számok és műveletek',
 geometry:'Geometria',
 measurement:'Mérés és mértékegységek',
 statistics:'Statisztika és valószínűség',
 algebra:'Algebra és egyenletek',
 functions:'Függvények',
 trigonometry:'Trigonometria',
 analysis:'Analízis',
 'linear-algebra':'Lineáris algebra',
 discrete:'Diszkrét matematika',
 differential:'Differenciálegyenletek'
});
export function hungaryMathStudyYears({stage,years=[]}={}){
 if(stage==='advanced')return HUNGARY_MATH_UNIVERSITY_YEARS.map(y=>({...y}));
 const needsStream=stage==='medium';
 return years.map(y=>{
  const id=String(y.id),tech=stage==='medium'&&id==='13';
  const defaultNative=stage==='beginner'||stage==='lower'
   ?'Általános iskola · '+id+'. évfolyam'
   :'Gimnázium/technikum · '+id+'. évfolyam'+(tech?' (technikum)':'');
  return {
   ...y,
   ro:tech?'Clasa 13 · numai technikum':y.ro,
   en:tech?'Grade 13 · technikum only':y.en,
   native:tech?'Technikum · 13. évfolyam (csak technikum)':(y.native||defaultNative),
   nativeLang:y.nativeLang||'hu',
   trackRequired:tech?'technikum':undefined,
   nationalYearVerified:y.nationalYearVerified===false?false:!needsStream,
   curriculumVerified:false,
   countryFrameworkSpecific:true
  };
 });
}
export function hungaryMathPhase({stage,grade}={}){
 const p=HUNGARY_MATH_GRADES[String(grade||'')];
 if(!p||p.stage!==String(stage||''))return null;
 return {phase:p.phase,phases:[p.phase],yearIndex:null};
}
// Hand-authored supplementary example cards specific to the selected school year.
// The general in-depth bank remains separately labelled as advisory.
const ORIGINAL={
 '1':[['arithmetic','Perechi și completarea numerelor până la 20','Number bonds to twenty',
 'Un număr poate fi format prin reunirea a două grupe. Folosim obiecte ori desene ca să vedem toate părțile și să găsim ce lipsește dintr-o sumă.',
 '8 + 7 = 15','Punem opt cuburi, apoi încă șapte. Facem o grupă de zece mutând două cuburi din grupa de șapte, apoi adăugăm cele cinci rămase: 10 + 5 = 15.',
 'Câte cuburi lipsesc pentru a completa 9 până la 15?','6 cuburi.']],
 '2':[['arithmetic','Înmulțirea ca adunare a grupelor egale','Equal-group multiplication',
 'Înmulțirea numără grupe cu același număr de obiecte. O desenăm ca șiruri egale și verificăm prin adunarea repetată, fără a confunda numărul grupelor cu obiectele dintr-o grupă.',
 '4 × 3 = 3 + 3 + 3 + 3 = 12','Desenăm patru rânduri cu câte trei puncte. Adunăm 3+3+3+3 și găsim douăsprezece puncte în total.',
 'Câte obiecte sunt în cinci grupe de câte patru?','20 de obiecte.']],
 '3':[['measurement','Conversia dintre centimetri și metri','Centimetres and metres',
 'Lungimea se exprimă în unități de măsură potrivite. Într-un metru sunt exact o sută de centimetri; pentru comparare convertim ambele lungimi la aceeași unitate.',
 '1 m = 100 cm','Transformăm 2 m și 35 cm în centimetri: 2 × 100 + 35 = 235 cm. Nu adunăm direct 2 și 35 ca și cum ar avea aceeași unitate.',
 'Câți centimetri sunt în 3 m și 8 cm?','308 cm.']],
 '4':[['arithmetic','Fracții cu același numitor și unitatea întreagă','Fractions with a common denominator',
 'O fracție descrie un număr de părți egale ale unui întreg. Când numitorul este același, adunăm numărătorii și păstrăm numitorul deoarece mărimea fiecărei părți nu se schimbă.',
 '2/7 + 3/7 = 5/7','Împărțim o bandă în șapte părți egale. Colorăm două și apoi încă trei; în total sunt cinci dintre cele șapte părți.',
 'Calculează 4/9 + 2/9.','6/9 = 2/3.']],
 '6':[['algebra','Procentul unui număr și raportul cu întregul','Percent of a quantity',
 'Un procent este o fracție cu numitorul 100. Pentru a afla p% dintr-o cantitate, înmulțim cantitatea cu p/100. Verificăm dacă rezultatul are sens față de întreg.',
 '15% din 200 = 200 × 0,15 = 30','Împărțim 200 în 100 de părți egale, fiecare valorează 2. Luăm 15 părți: 15 × 2 = 30. Obținem același rezultat prin înmulțire cu 0,15.',
 'Află 25% din 80.','20.']],
 '7':[['algebra','Reducerea termenilor asemenea','Collecting like terms',
 'Termenii asemenea au aceeași parte literală cu aceiași exponenți. Putem aduna coeficienții lor, dar nu putem transforma direct un termen în x și unul în y într-un singur termen.',
 '3x + 5x − 2y = 8x − 2y','Grupează termenii în x: 3x+5x=8x. Termenul −2y rămâne separat. Verifică înlocuind x=1 și y=2 în ambele expresii.',
 'Simplifică 7a − 4b + 2a + b.','9a − 3b.']],
 '8':[['geometry','Teorema lui Pitagora într-un triunghi dreptunghic','Pythagorean theorem',
 'Într-un triunghi dreptunghic suma pătratelor catetelor este egală cu pătratul ipotenuzei. Folosim teorema numai dacă unghiul dintre catete este drept.',
 'a² + b² = c²','La catetele 6 și 8 cm: c²=36+64=100, deci ipotenuza are 10 cm. Verificăm 6²+8²=10².',
 'Determină ipotenuza pentru catetele 5 și 12 cm.','13 cm.']],
 '9':[['functions','Funcția liniară: tabel și grafic','Linear function and graph',
 'Funcția f(x)=ax+b asociază fiecărui x din domeniu o valoare numerică. Un grafic poate fi desenat din două puncte distincte, dar verificăm și sensul constantelor în context.',
 'f(x) = 2x + 3','Pentru x=0 obținem f(0)=3, iar pentru x=2 obținem f(2)=7. Reprezentăm punctele (0,3) și (2,7) și trasăm dreapta.',
 'Calculează f(4) dacă f(x)=2x+3.','11.']],
 '10':[['algebra','Ecuația de gradul al doilea și discriminantul','Quadratic discriminant',
 'Pentru ecuația ax²+bx+c=0, cu a diferit de zero, folosim discriminantul Δ=b²−4ac. Dacă Δ este pozitiv, ecuația are două soluții reale distincte.',
 'x = (−b ± √Δ)/(2a)','Rezolvăm x²−5x+6=0: a=1, b=−5, c=6; Δ=25−24=1. Soluțiile sunt (5−1)/2=2 și (5+1)/2=3.',
 'Rezolvă x²−7x+12=0.','x=3 sau x=4.']],
 '11':[['trigonometry','Relația fundamentală dintre sinus și cosinus','Sine-cosine identity',
 'Pentru orice unghi real, pătratele sinusului și cosinusului însumează unu. Relația provine din cercul trigonometric de rază unu și este valabilă indiferent de cadran.',
 'sin²x + cos²x = 1','Dacă sin x=3/5 și unghiul este în cadranul I, cos x este pozitiv: cos x=√(1−9/25)=4/5.',
 'Dacă cos x=5/13 și x este în cadranul I, află sin x.','12/13.']],
 '12':[['statistics','Probabilitate cu numărarea cazurilor','Counting-based probability',
 'Într-un experiment cu rezultate echiprobabile, probabilitatea unui eveniment se calculează împărțind numărul cazurilor favorabile la numărul cazurilor posibile. Aranjamentele trebuie numărate fără dubluri.',
 'P(A)=N(A)/N(Ω)','Aruncăm două monede echilibrate. Rezultatele distincte sunt CC, CP, PC și PP. Probabilitatea exact unei steme este 2/4=1/2.',
 'Care este probabilitatea pentru două steme la două monede corecte?','1/4.']],
 '13':[['functions','Model liniar pentru consumul de material','Linear technical modelling',
 'Un model liniar exprimă o cheltuială fixă și una proporțională cu numărul de produse. Coeficienții trebuie să aibă unități compatibile; verificăm domeniul în care modelul are sens.',
 'C(n)=120+8n','Dacă pornirea utilajului costă 120 unități monetare și fiecare piesă costă 8, pentru 15 piese avem 120+8×15=240.',
 'Care este costul pentru 20 de piese?','280 unități monetare.']],
 'BSC1':[['linear-algebra','Subspații vectoriale și condițiile de închidere','Vector subspaces',
 'O submulțime W a unui spațiu vectorial V este subspațiu dacă include vectorul zero și este închisă la adunarea vectorilor și înmulțirea cu scalari. Proprietatea se dovedește pentru vectori și scalari arbitrar aleși.',
 'W={(x,y)∈R² | y=2x}','Pentru u=(a,2a) și v=(b,2b), suma este (a+b,2(a+b)) și aparține lui W. Pentru scalarul k, ku=(ka,2ka) aparține tot lui W.',
 'Este W={(x,y) | y=2x+1} un subspațiu al R²?','Nu: vectorul zero nu aparține lui W.']],
 'BSC2':[['statistics','Varianța unei variabile aleatoare discrete','Variance of a discrete random variable',
 'Valoarea așteptată este media ponderată a rezultatelor posibile după probabilitățile lor. Varianța măsoară dispersia pătratică față de medie și nu poate fi negativă.',
 'Var(X)=E(X²)−[E(X)]²','Dacă X ia valorile 0 și 2 cu probabilitatea 1/2 fiecare, E(X)=1 și E(X²)=2. Deci Var(X)=2−1=1.',
 'Pentru X egal 1 sau 3 cu șanse egale, află Var(X).','1.']],
 'BSC3':[['differential','Ecuația diferențială separabilă','Separable differential equation',
 'O ecuație diferențială de tip y′=g(x)h(y) poate fi separată, dacă h(y) este nenul pe intervalul ales. Soluțiile constante, obținute din h(y)=0, se verifică separat.',
 'dy/y = 2x dx','Din y′=2xy și y nenul obținem dy/y=2x dx. Integrăm: ln|y|=x²+C, deci y=C₁e^(x²), inclusiv soluția zero pentru C₁=0.',
 'Rezolvă y′=3y cu y(0)=2.','y=2e^(3x).']],
 'MSC1':[['analysis','Condiții de optimalitate pentru o funcție convexă','Convex optimisation',
 'O funcție derivabilă convexă pe un domeniu convex are minim global în orice punct interior în care gradientul este zero. Verificarea convexității este esențială pentru a nu confunda extrema locală cu cea globală.',
 'f(x)=x²−4x+5','Calculăm f′(x)=2x−4, deci punctul staționar este x=2. Deoarece f″(x)=2>0, funcția este strict convexă și f(2)=1 este minimul global.',
 'Află minimul lui g(x)=x²+6x+12.','g(−3)=3.']],
 'MSC2':[['statistics','Regresie liniară și reziduurile','Linear regression and residuals',
 'Regresia prin cele mai mici pătrate estimează coeficienții unei relații liniare minimizând suma pătratelor reziduurilor. Reziduurile sunt diferențele dintre valorile observate și cele prezise; potrivirea nu implică automat cauzalitate.',
 'SSE=Σ(yᵢ−ŷᵢ)²','Pentru observațiile (1,2), (2,4), (3,6), dreapta y=2x oferă reziduuri zero, deci suma pătratelor lor este zero, minim posibil.',
 'Ce reziduu are observația y=7 când modelul prezice ŷ=5?','2.']]
};
export function hungaryMathOriginalLessons({grade,topic}={}){
 const entry=HUNGARY_MATH_GRADES[String(grade||'')];
 if(!entry)return [];
 const clientStage=entry.stage==='beginner'?'primary':entry.stage==='medium'?'intermediate':entry.stage;
 return (ORIGINAL[String(grade)]||[]).filter(row=>row[0]===topic).map((row,i)=>({
  id:'math-hu-'+String(grade).toLowerCase()+'-'+topic+'-specific-'+(i+1),
  country:'HU',grade:String(grade),stage:clientStage,subject:'math',
  level:entry.stage==='advanced'?'advanced':entry.stage==='medium'?'intermediate':'beginner',
  phase:entry.phase,topic,
  title:row[1],enTitle:row[2],statement:row[3],formula:row[4],
  worked:row[5],practice:row[6],answers:row[7],aliases:[],
  source:entry.stage==='advanced'?HUNGARY_MATH_SOURCES.university:HUNGARY_MATH_SOURCES.school,
  sourceStatus:'country-grade-advisory-supplement',
  curriculumCompletion:'unverified-advisory'
 }));
}
export function hungaryMathGradeProfile({stage,grade,lessonCount}={}){
 const code=String(grade||''),p=HUNGARY_MATH_GRADES[code];
 if(!p||p.stage!==String(stage||''))return null;
 const advanced=stage==='advanced',tech=code==='13';
 const source=advanced?HUNGARY_MATH_SOURCES.university:
  HUNGARY_MATH_SOURCES[stage==='beginner'?'primary':stage==='lower'?'lower':'upper'];
 const note=(advanced?'Ungaria: programă universitară orientativă, instituțională; nu există un curriculum național de licență/master identic în toate universitățile. ':
  tech?'Ungaria: NAT 2020; anul 13 există doar pentru trasee technikum selectate și nu se afișează ca anul 13 al gimnázium general. ':
  'Ungaria: NAT 2020 definește competențe pe cicluri multianuale; alocarea exactă a lecțiilor la o anumită clasă aparține și programei școlii. ')+
  p.focus+' Lecții suplimentare originale, corelate cu domeniile oficiale, alături de o bancă generală, nu o listă oficială de manual pe fiecare an. Nu certificăm acoperirea completă a programei anuale ori a cuprinsului manualelor.';
 return {status:'general-learning',country:'HU',stage,grade:code,source,
  manualExample:code==='5'?'https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA':null,
  requires:advanced?'Universitatea, specializarea și anul':tech?'Traseul technikum':'Școala și programa locală',
  note,units:p.units.map(([id,ro,en])=>({
   id,ro,en,native:HUNGARY_NATIVE_TOPICS[id]||en||ro,nativeLang:'hu',
   focus:p.focus,lessonCount:lessonCount?lessonCount(id,p.phase):0,
   countrySpecific:false,countryFrameworkSpecific:true,
   curriculumCompletion:'unverified-advisory',curriculumSource:source
  }))};
}
