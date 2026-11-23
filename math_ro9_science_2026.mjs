// Romania Grade IX, 2026/27: original lessons anchored to the actual
// science-track TC+CS textbook contents and the newly effective syllabus.
// This is a TRACK-SPECIFIC teaching sequence, not a blanket claim for all
// humanist/technology/maths-info students, and not a reproduction of a book.
// National curriculum: OMEC 6930/2025, published Jan 2026.
// https://www.edu.ro/press_rel_02_2026
// Publisher's 2026/27 approved-book scope and seven original unit headings:
// https://booklet.ro/carti/mn68/  ISBN 978-630-347-296-6
const SYLLABUS='https://www.edu.ro/press_rel_02_2026';
const MANUAL='https://booklet.ro/carti/mn68/';
const M=Object.freeze({
 syllabus:SYLLABUS,manual:MANUAL,isbn:'978-630-347-296-6',
 track:'Științe ale naturii · trunchi comun și curriculum de specialitate (TC+CS)',
 cohort:'Clasa a IX-a 2026–2027; nu aplica automat clasei a X-a sau altor cohorte'
});
const TOPICS=Object.freeze([
 ['reals','Mulțimea numerelor reale','algebra',[
 ['Mulțimi numerice și incluziuni','Numerele naturale sunt incluse în întregi, raționale și reale. Numerele iraționale au dezvoltări zecimale infinite neperiodice.','N ⊂ Z ⊂ Q ⊂ R','Numărul −4 este întreg, deci rațional și real. Numărul √2 este irațional, dar real.','Clasifică −3, 2/5, √5 și 0.','−3 și 0: întregi; 2/5: rațional; √5: irațional; toate reale.'],
 ['Intervale reale și reprezentarea pe axă','Paranteza rotundă exclude capătul, iar cea pătrată îl include. Infinitul nu poate fi capăt inclus.','[−2,3)={x∈R|−2≤x<3}','Pentru x∈[−2,3), punctul −2 este plin, 3 este gol; dintre 3 și 2 doar 2 aparține.','Scrie ca interval −1<x≤4.','(−1,4].'],
 ['Valoarea absolută și distanța','Valoarea absolută a unui număr real este distanța sa față de zero. Distanța dintre a și b este |a−b|.','|x|=x dacă x≥0; |x|=−x dacă x<0','|−7|=7, iar distanța dintre −2 și 5 este |−2−5|=7.','Calculează |−9| și distanța dintre 1 și −4.','9; 5.'],
 ['Radicali, puteri și estimare','Pentru a≥0, √a este numărul nenegativ al cărui pătrat este a. Simplificarea folosește factorizarea sub radical.','√(a²)=|a|; √72=6√2','Descompunem 72=36×2 și obținem √72=√36×√2=6√2. Nu înlocuim √(a+b) cu √a+√b.','Simplifică √50 și √(−4) în R.','5√2; √(−4) nu este real.'],
 ['Aproximări și erori în calcule','Rezultatul aproximativ trebuie indicat cu precizia cerută. Eroarea absolută este modulul diferenței dintre valoarea exactă și cea aproximată.','E_abs=|valoare exactă−aproximare|','Dacă π≈3,14, eroarea absolută este aproximativ 0,00159; nu prezentăm 3,14 drept valoare exactă.','Rotunjește 2,71828 la două zecimale.','2,72.']
 ]],
 ['logic','Elemente de logică matematică','algebra',[
 ['Propoziții și valori de adevăr','O propoziție matematică este un enunț pentru care se poate stabili adevărat sau fals. O expresie cu necunoscută devine propoziție după atribuirea unei valori.','p: 2+3=5 → adevărat','Enunțul 4 este număr par este adevărat. Enunțul x>2 depinde de x și este predicat.','Este «7 este divizibil cu 2» adevărat?','Nu, este fals.'],
 ['Negația și conectorii logici','Negația schimbă valoarea de adevăr. Conjuncția este adevărată doar când ambele propoziții sunt adevărate; disjuncția inclusivă când cel puțin una este adevărată.','¬(p∧q)=(¬p)∨(¬q)','Dacă p este adevărat și q fals, atunci p∧q este fals, iar p∨q este adevărat.','Dacă p este fals și q adevărat, cât este p∧q?','Fals.'],
 ['Implicația și echivalența','Implicația p⇒q este falsă numai când p este adevărat și q fals. Echivalența cere aceeași valoare de adevăr.','(p⇒q) ≡ (¬p∨q)','Dacă un număr se divide cu 4, atunci este par; reciproca nu este adevărată pentru 6.','Dă un număr par nedivizibil cu 4.','6 este un exemplu.'],
 ['Cuantificatori și exemple contra','Afirmația «pentru orice» se poate infirma printr-un singur contraexemplu. «Există» se confirmă prin furnizarea unui exemplu.','∀x∈A P(x); ∃x∈A P(x)','Afirmația «toate numerele prime sunt impare» este falsă: 2 este prim și par.','Este adevărat că există un număr întreg x cu x²=9?','Da, x=3 sau x=−3.'],
 ['Condiții necesare și suficiente','P este condiție suficientă pentru Q când P implică Q; Q este necesară pentru P. O echivalență exprimă două implicații.','x=2 ⇒ x²=4, dar x²=4 ⇏ x=2','x=2 este suficient pentru x²=4, nu necesar, deoarece x=−2 dă tot 4.','Este x>3 suficient pentru x>0?','Da.']
 ]],
 ['poly','Polinoame cu coeficienți reali','algebra',[
 ['Monom, polinom, grad și coeficient','Un polinom este o sumă finită de termeni aₙxⁿ cu exponenți întregi nenegativi. Gradul este cel mai mare exponent cu coeficient nenul.','P(x)=2x³−x+4, grad(P)=3','În 2x³−x+4 coeficientul lui x² este zero, cel al lui x³ este 2.','Ce grad are Q(x)=5x⁴+2x²−7?','4.'],
 ['Adunarea și scăderea polinoamelor','Termenii asemenea se grupează după puterea variabilei. Nu se adună exponenții la adunarea polinoamelor.','(2x²+x)+(x²−3x)=3x²−2x','Adunăm coeficienții lui x²: 2+1=3; ai lui x: 1−3=−2.','Calculează (3x²−2x+1)+(x²+x−4).','4x²−x−3.'],
 ['Înmulțirea polinoamelor','Folosim distributivitatea și apoi reducem termenii asemenea. Verificăm gradul rezultatului când termenii principali nu se anulează.','(x+2)(x+3)=x²+5x+6','Înmulțim x cu x și 3, apoi 2 cu x și 3: x²+3x+2x+6=x²+5x+6.','Dezvoltă (x−1)(x+4).','x²+3x−4.'],
 ['Identități remarcabile și factorizare','Identitățile permit transformarea în produs sau sumă. Factorizarea este utilă la ecuații, semn și simplificarea fracțiilor algebrice.','a²−b²=(a−b)(a+b)','x²−9=x²−3²=(x−3)(x+3). Verificăm dezvoltând produsul.','Descompune x²−16.','(x−4)(x+4).'],
 ['Rădăcinile unui polinom și teorema factorului','Numărul a este rădăcină a lui P dacă P(a)=0. Atunci P este divizibil cu x−a.','P(a)=0 ⇔ (x−a)|P(x)','Pentru P(x)=x²−5x+6, P(2)=4−10+6=0, deci x−2 este factor.','Este 3 rădăcină pentru P(x)=x²−5x+6?','Da: 9−15+6=0.']
 ]],
 ['seq','Progresii aritmetice și geometrice','algebra',[
 ['Șiruri și termenul general','Un șir asociază fiecărui indice natural admis un termen. Formula termenului general permite calculul fără enumerarea tuturor termenilor.','aₙ=2n+1','Pentru n=1,2,3 rezultă 3,5,7. Termenul al zecelea este 21.','Pentru aₙ=3n−2, află a₅.','13.'],
 ['Progresia aritmetică: rație și termen','Într-o progresie aritmetică diferența aₙ₊₁−aₙ este constantă. Formula termenului n pornește de la primul termen și rație.','aₙ=a₁+(n−1)r','Pentru a₁=4, r=3, al cincilea termen este 4+4×3=16.','Află a₆ dacă a₁=2 și r=5.','27.'],
 ['Suma primilor n termeni ai progresiei aritmetice','În progresia aritmetică, suma primului și ultimului termen este aceeași pentru perechile simetrice.','Sₙ=n(a₁+aₙ)/2','1+2+…+10=10(1+10)/2=55.','Calculează 2+4+6+8+10.','30.'],
 ['Progresia geometrică: rație și termen','Termenii unei progresii geometrice se obțin înmulțind termenul anterior cu rația constantă q. Pentru termeni nenuli q=aₙ₊₁/aₙ.','bₙ=b₁qⁿ⁻¹','Dacă b₁=3 și q=2, b₄=3×2³=24.','Află b₅ dacă b₁=2, q=3.','162.'],
 ['Suma progresiei geometrice finite','Pentru q diferit de 1, suma geometrică finită se determină din scăderea Sₙ de qSₙ. Dacă q=1, toți termenii sunt egali.','Sₙ=b₁(qⁿ−1)/(q−1), q≠1','1+2+4+8=1(2⁴−1)/(2−1)=15.','Calculează 3+6+12+24.','45.']
 ]],
 ['analytic','Geometrie analitică','geometry',[
 ['Sistemul cartezian și coordonatele punctelor','În reper ortonormat, punctul A(x,y) are abscisa x și ordonata y. Semnele coordonatelor determină cadranul.','A(−2,3) în cadranul II','A(−2,3) se reprezintă două unități la stânga axei verticale și trei în sus.','În ce cadran se află B(4,−1)?','IV.'],
 ['Distanța dintre două puncte','Distanța în plan rezultă din teorema lui Pitagora aplicată diferențelor de coordonate.','AB=√((x₂−x₁)²+(y₂−y₁)²)','Pentru A(1,1), B(4,5), diferențele sunt 3 și 4, distanța este 5.','A(0,0), B(6,8): află distanța.','10.'],
 ['Mijlocul unui segment în coordonate','Mijlocul segmentului are coordonatele mediilor aritmetice ale coordonatelor extremităților.','M((x₁+x₂)/2,(y₁+y₂)/2)','A(2,4), B(6,8) au mijlocul M(4,6).','A(−2,1), B(4,7): află M.','M(1,4).'],
 ['Panta și ecuația dreptei','Panta unei drepte neverticale arată variația lui y raportată la variația lui x. O dreaptă verticală nu are pantă finită.','m=(y₂−y₁)/(x₂−x₁); y=mx+n','Punctele (0,1) și (2,5) dau m=(5−1)/(2−0)=2 și n=1; dreapta are y=2x+1.','Ce pantă are dreapta prin (1,2) și (3,8)?','3.'],
 ['Intersecția dreptelor și reprezentarea soluției','Două drepte neparalele au un singur punct de intersecție. Îl aflăm rezolvând simultan ecuațiile dreptelor.','y=x+1; y=−x+5 ⇒ (2,3)','Egalăm x+1=−x+5, obținem 2x=4 și x=2; apoi y=3.','Intersecția dintre y=x și y=4−x?','(2,2).']
 ]],
 ['functions','Funcții și citirea graficelor','functions',[
 ['Noțiunea de funcție: domeniu și valori','Fiecărui element din domeniu o funcție îi asociază exact o valoare. Relațiile cu două rezultate diferite pentru același x nu sunt funcții.','f:{0,1,2}→R; f(x)=x²','Pentru x=−2 și x=2 obținem aceeași valoare 4; nu încalcă definiția, deoarece fiecărui x îi revine o singură valoare.','Cât este f(−3) dacă f(x)=x²+1?','10.'],
 ['Zerourile și semnul funcției','Un zero este un x pentru care f(x)=0. Semnul funcției se observă după poziția graficului față de axa Ox, folosind domeniul.','f(x)=2x−6 ⇒ x₀=3','Pentru x<3 avem 2x−6<0, la x=3 este 0, pentru x>3 este pozitiv.','Găsește zero-ul funcției f(x)=x+4.','x=−4.'],
 ['Monotonia și interpretarea variației','O funcție este crescătoare pe un interval dacă pentru x₁<x₂ avem f(x₁)≤f(x₂). Descreșterea inversează inegalitatea.','f(x)=3x+1 este strict crescătoare','Când x crește cu 1, valoarea lui f(x)=3x+1 crește cu 3; panta este pozitivă.','Funcția f(x)=−2x+5 este crescătoare sau descrescătoare?','Strict descrescătoare.'],
 ['Paritatea și simetria graficului','O funcție pară are f(−x)=f(x), iar graficul este simetric față de Oy. Funcția impară are f(−x)=−f(x), iar graficul este simetric față de origine.','x² este pară; x³ este impară','Pentru f(x)=x², f(−3)=9=f(3), deci f este pară.','Este f(x)=x³ funcție impară?','Da.'],
 ['Extreme dintr-un grafic','Un maxim local este o valoare a funcției cel puțin egală cu vecinii apropiați din domeniu. Un maxim global este cel puțin egal cu toate valorile din domeniu.','f(x)=−(x−2)²+5 are maxim 5','Parabola are vârful (2,5), se deschide în jos, deci maximul este 5 la x=2.','Ce minim are f(x)=(x−1)²+3?','3, atins la x=1.']
 ]],
 ['trig','Elemente de trigonometrie și aplicații în geometrie','trigonometry',[
 ['Unghiuri, grade și radiani','O rotație completă are 360° sau 2π radiani. Conversia se face prin proporție, fără modificarea sensului unghiului.','180°=π rad','60°=60×π/180=π/3 rad.','Transformă 45° în radiani.','π/4.'],
 ['Sinus, cosinus și tangentă în triunghi dreptunghic','Pentru un unghi ascuțit, sinusul este cateta opusă supra ipotenuză, cosinusul cateta alăturată supra ipotenuză. Tangenta este sin/cos când cos≠0.','sin α=opusă/ipotenuză; cos α=alăturată/ipotenuză','În triunghiul cu catete 3,4 și ipotenuză 5, pentru unghiul opus catetei 3 avem sin α=3/5 și cos α=4/5.','Cât este tg α pentru aceleași catete 3 și 4?','3/4.'],
 ['Identitatea trigonometrică fundamentală','Identitatea rezultă din teorema lui Pitagora pentru coordonatele punctului de pe cercul unitate. Este valabilă pentru orice unghi real.','sin²α+cos²α=1','Dacă sin α=3/5 și α este ascuțit, cos α=√(1−9/25)=4/5.','Dacă cos α=5/13 și α este ascuțit, află sin α.','12/13.'],
 ['Teorema sinusurilor și triunghiuri oarecare','Raportul dintre lungimea unei laturi și sinusul unghiului opus ei este același pentru toate laturile unui triunghi ne-degenerat.','a/sin A=b/sin B=c/sin C','Dacă a=6, sin A=1/2 și sin B=1/3, atunci b=6(1/3)/(1/2)=4.','Dacă a=8, sin A=1/2, sin B=1/4, află b.','4.'],
 ['Teorema cosinusului și latura necunoscută','Teorema cosinusului extinde teorema lui Pitagora la triunghiuri cu unghiuri arbitrare. Când C=90°, cos C=0 și formula devine Pitagora.','c²=a²+b²−2ab cos C','Pentru a=b=5 și C=60°, c²=25+25−50×1/2=25, deci c=5.','În triunghi cu a=b=4 și C=90°, află c.','4√2.']
 ]]
]);
const KEY_TO_TOPIC=Object.freeze(Object.fromEntries(TOPICS.map(x=>[x[0],x[2]])));
export const RO9_SCIENCE_2026_SOURCES=M;
export const RO9_SCIENCE_2026_UNITS=Object.freeze(TOPICS.map(([key,title,topic,rows])=>({
 id:key,title,topic,lessonCount:rows.length
})));
const EN={
 algebra:'Number and algebra',functions:'Functions and graphs',
 geometry:'Analytic geometry',trigonometry:'Trigonometry'
};
export const RO9_SCIENCE_2026_PATHS=Object.freeze(
 [...new Set(TOPICS.map(x=>x[2]))].map(topic=>({
  id:topic,ro:topic==='algebra'?'Numere reale, logică, polinoame și progresii':
   topic==='functions'?'Funcții și grafice':
    topic==='geometry'?'Geometrie analitică':'Trigonometrie și geometrie',
  en:EN[topic],focus:'',countrySpecific:true,
  curriculumCompletion:'source-unit-reviewed-not-full-year-certified',
  curriculumSource:SYLLABUS,manualExample:MANUAL,
  lessonCount:TOPICS.filter(x=>x[2]===topic).reduce((n,x)=>n+x[3].length,0)
 }))
);
export const RO9_SCIENCE_2026_LESSONS=Object.freeze(TOPICS.flatMap(([key,unit,topic,rows])=>
 rows.map(([title,statement,formula,worked,practice,answers],i)=>({
  id:'ro9-science-'+key+'-'+String(i+1).padStart(2,'0'),
  subject:'math',country:'RO',grade:'9-SCI',stage:'intermediate',topic,
  unit,unitId:key,level:'intermediate',title,statement,formula,worked,
  practice,answers,
  source:SYLLABUS,manualExample:MANUAL,
  sourceStatus:'official-unit-and-publisher-toc-reviewed',
  curriculumCompletion:'source-unit-reviewed-not-full-year-certified',
  aliases:[]
 }))
));
export function ro9Science2026Lessons(topic){
 return RO9_SCIENCE_2026_LESSONS.filter(item=>item.topic===topic);
}
