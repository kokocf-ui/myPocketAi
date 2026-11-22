import {MATH_DEPTH_PRIMARY} from './math_depth_primary.mjs';
import {MATH_DEPTH_PRIMARY_56} from './math_depth_primary_56.mjs';
import {MATH_DEPTH_UPPER} from './math_depth_upper.mjs';
import {MATH_DEPTH_UNIVERSITY} from './math_depth_university.mjs';
import {MATH_UNIVERSITY_EXTENSION} from './math_depth_university_extension.mjs';
// Mathematics learning cards: authored, age-progressive explanations and worked
// problems. These are *general European learning aids*, not certified copies
// of a country's national mathematics programme.
export const MATH_DEPTH_EN_LOWER=[
 {algebra:['Natural numbers and place value','Operations with natural numbers','Multiples and divisors','Fractions and decimal numbers','Equations with one unknown'],
  geometry:['Points, lines and segments','Angles and how to measure them','Triangles and quadrilaterals','Circles, disks and radius'],
  statistics:['Collecting data','Bar charts','Introduction to arithmetic mean']},
 {algebra:['Integers and the number line','Rational numbers and equivalent fractions','Ratios, proportions and percentages','Linear equations with coefficients'],
  geometry:['Vertically opposite and adjacent angles','Triangles and angle sums','Quadrilaterals and their properties','Circle circumference and area'],
  statistics:['Relative frequency','Mean and median','Intuitive probability']},
 {algebra:['Algebraic expressions and like terms','Algebraic identities and formulas','Equations with brackets','Linear inequalities'],
  geometry:['Triangle congruence','The Pythagorean theorem','Areas of triangles and quadrilaterals','Central angles in circles'],
  statistics:['Sample spaces','Complementary events','Chart interpretation and critical reading']},
 {algebra:['Linear equations in word problems','Systems of two equations','Functions and coordinate graphs','Factorisation'],
  geometry:['Triangle similarity','Thales theorem and proportional segments','Volume of geometric solids','Theorems and logical proof'],
  statistics:['Incompatible events','Probability from tables','Elementary counting principles']}
];
export const MATH_DEPTH_EN_UNIVERSITY=[
 {analysis:['Sequences and their limits','Continuity of functions','Derivatives and differentials'],
  'linear-algebra':['Vectors and vector spaces','Matrices, determinants and invertibility','Linear systems and Gaussian elimination'],
  discrete:['Sets and operations','Mathematical induction','Propositional logic']},
 {analysis:['Series and convergence tests','Definite integrals and substitution','Multivariable functions'],
  'linear-algebra':['Linear independence','Eigenvalues and eigenvectors','Orthogonality and projections'],
  statistics:['Discrete random variables','Expectation and variance','The normal distribution']},
 {differential:['Separable differential equations','First-order linear differential equations','Basic dynamical systems'],
  analysis:['Improper integrals','Uniform convergence','Introduction to complex analysis'],
  discrete:['Graphs and vertex degrees','Trees and connectivity','Recurrences and complexity']},
 {analysis:['Normed spaces and convergence','Linear operators and continuity','Numerical methods and error'],
  statistics:['Confidence intervals for the mean','Hypothesis testing','Linear regression and residuals'],
  discrete:['Counting and inclusion–exclusion','Shortest paths in graphs','Combinatorial probability']}
];
export const MATH_DEPTH_LOWER=[
 {
 algebra:[
 ['Numere naturale și valoarea pozițională','O cifră are o valoare diferită după poziția ei. Descompunerea în ordine de mărime ne ajută să comparăm și să calculăm numere naturale.','34 708 = 30 000 + 4 000 + 700 + 8','Comparăm 34 708 cu 34 780: primele trei ordine coincid; la zeci avem 0 < 8. Prin urmare 34 708 < 34 780.','Descompune 52 406; compară 52 406 cu 52 460.','50 000 + 2 000 + 400 + 6; primul număr este mai mic.'],
 ['Operații cu numere naturale','În calcule respectăm întâi parantezele, apoi înmulțirile și împărțirile, apoi adunările și scăderile. Operațiile cu aceeași prioritate se efectuează de la stânga la dreapta.','18 + 3 × (12 − 8) = 30','Mai întâi 12 − 8 = 4. Apoi 3 × 4 = 12. La sfârșit 18 + 12 = 30. Verificăm estimând că rezultatul trebuie să fie mai mare decât 18.','Calculează 40 − 6 × 3 + 4 și 30 : (2 + 3).','26 și 6.'],
 ['Multipli și divizori','Un număr este divizibil cu altul dacă împărțirea dă un cât întreg, fără rest. Multiplii se obțin înmulțind un număr cu numere naturale.','24 : 6 = 4; 24 = 6 × 4','Căutăm divizorii lui 18 prin perechi de produse: 1 × 18, 2 × 9, 3 × 6. Divizorii pozitivi sunt 1, 2, 3, 6, 9, 18.','Scrie primii patru multipli pozitivi ai lui 7 și toți divizorii lui 12.','7, 14, 21, 28; 1, 2, 3, 4, 6, 12.'],
 ['Fracții și numere zecimale','O fracție arată câte părți egale luăm dintr-un întreg. Numitorul este numărul părților egale, iar numărătorul arată câte părți luăm. Fracțiile se pot scrie uneori ca numere zecimale.','3/4 = 0,75','Împărțim 3 la 4 și obținem 0,75. Pentru a compara 3/4 cu 2/3 folosim numitor comun 12: 9/12 > 8/12, deci 3/4 > 2/3.','Transformă 1/2 în zecimal și compară 2/5 cu 3/10.','0,5; 2/5 = 4/10 > 3/10.'],
 ['Ecuații cu o necunoscută','O ecuație este o egalitate în care trebuie să aflăm valoarea necunoscută. Folosim operații inverse și păstrăm egalitatea prin efectuarea aceleiași operații în ambii membri.','x + 17 = 40 ⇒ x = 23','Din x + 17 = 40 scădem 17 din ambii membri. Obținem x = 23. Înlocuim în ecuația inițială: 23 + 17 = 40, deci soluția este corectă.','Rezolvă x − 9 = 16 și 5 × x = 35.','x = 25; x = 7.']
 ],
 geometry:[
 ['Puncte, drepte și segmente','Punctul indică o poziție, dreapta se prelungește nelimitat în ambele sensuri, iar segmentul este partea unei drepte cu două capete. Lungimea segmentului poate fi măsurată.','AB = 6 cm','Desenăm două puncte A și B și le unim cu rigla. Marcăm segmentul AB și măsurăm distanța de la A la B, nu lungimea întregii drepte.','Desenează segmentul CD de 4 cm și un punct E în afara lui.','Verificare: CD are două capete, măsoară 4 cm, iar E nu aparține segmentului.'],
 ['Unghiuri și măsurarea lor','Un unghi este format din două semidrepte cu aceeași origine. Măsura unghiului se exprimă în grade și se determină cu raportorul.','Unghi drept = 90°; unghi alungit = 180°','Un unghi de 65° este ascuțit pentru că măsoară mai puțin de 90°. Un unghi de 120° este obtuz pentru că se află între 90° și 180°.','Clasifică unghiurile de 35°, 90°, 145°.','Ascuțit, drept, obtuz.'],
 ['Triunghi și patrulater: recunoaștere','Un triunghi are trei laturi și trei vârfuri. Un patrulater are patru laturi și patru vârfuri. Mai întâi recunoaștem formele și măsurăm laturile, apoi învățăm proprietăți.','Perimetrul = suma lungimilor laturilor','Un triunghi cu laturile 3 cm, 4 cm și 5 cm are perimetrul 3 + 4 + 5 = 12 cm. Verificăm că suma oricăror două laturi depășește a treia.','Află perimetrul unui dreptunghi de 6 cm pe 3 cm.','18 cm.'],
 ['Cerc, disc și raza','Cercul este linia punctelor aflate la aceeași distanță de centru. Discul include și interiorul. Raza unește centrul cu un punct de pe cerc, iar diametrul trece prin centru.','d = 2r','Dacă raza unui cerc este de 4 cm, diametrul are 2 × 4 = 8 cm. Nu confundăm lungimea cercului cu aria discului.','Care este raza unui cerc cu diametrul de 18 cm?','9 cm.']
 ],
 statistics:[
 ['Colectarea datelor','Datele reprezintă observații sau măsurători. Le putem strânge într-un tabel de frecvențe fără a modifica valorile originale.','Frecvența = numărul aparițiilor','Datele 2, 3, 2, 5, 3, 2 conțin numărul 2 de trei ori, 3 de două ori și 5 o dată. Totalul frecvențelor este 6.','Determină frecvența lui 4 în 4, 1, 4, 2, 4, 3.','3 apariții.'],
 ['Diagrame cu bare','O diagramă cu bare compară valori pe categorii, având o scară comună. Citim etichetele axelor și unitatea de măsură înainte să tragem concluzii.','Bara mai înaltă = valoare mai mare','Dacă Ana a citit 5 cărți și Ion 3, barele au înălțimile 5 și 3. Diferența este de două cărți, nu de două procente.','Într-un grafic, luni sunt 8 bilete și marți 12. Cu câte mai multe marți?','4 bilete.'],
 ['Media aritmetică introductivă','Media reprezintă totalul valorilor împărțit la numărul de valori. O folosim numai dacă datele sunt cantități pentru care media are sens.','Media = suma valorilor / numărul lor','Pentru 4, 6 și 8 adunăm 4 + 6 + 8 = 18 și împărțim la 3. Media este 6.','Află media numerelor 5, 7 și 9.','7.']
 ]
 },
 {
 algebra:[
 ['Numere întregi și axa numerelor','Numerele întregi includ numerele pozitive, zero și numerele negative. Pe axă, un număr aflat mai la dreapta este mai mare.','−5 < −2 < 0 < 3','Temperatura crește de la −4°C la 2°C. Diferența este 2 − (−4) = 6°C. Scăderea unui număr negativ echivalează cu adunarea opusului.','Calculează −7 + 12 și −3 − 5.','5 și −8.'],
 ['Numere raționale și fracții echivalente','Fracțiile echivalente reprezintă același număr. Amplificăm sau simplificăm înmulțind ori împărțind numărătorul și numitorul la același număr nenul.','2/3 = 4/6 = 6/9','Simplificăm 18/24 împărțind ambii termeni la 6 și obținem 3/4. Păstrăm valoarea fracției.','Simplifică 15/25 și compară 3/5 cu 2/3.','3/5; 3/5 < 2/3.'],
 ['Rapoarte, proporții și procente','Un raport compară două mărimi; o proporție afirmă egalitatea a două rapoarte. Procentele sunt fracții cu numitor 100 și ajută la interpretarea reducerilor sau creșterilor.','15% = 15/100 = 0,15','Un produs de 200 lei are reducere 15%. Reducerea este 200 × 0,15 = 30 lei. Prețul nou este 200 − 30 = 170 lei.','Calculează 20% din 80 și prețul după o reducere de 25% din 120.','16; 90.'],
 ['Ecuații liniare cu coeficienți','Rezolvăm ecuațiile de forma ax + b = c izolând necunoscuta. Aplicăm aceleași transformări în ambii membri și verificăm soluția.','3x + 7 = 22 ⇒ x = 5','Scădem 7 și obținem 3x = 15. Împărțim la 3 și obținem x = 5. Verificare: 3 × 5 + 7 = 22.','Rezolvă 4x − 6 = 14.','x = 5.']
 ],
 geometry:[
 ['Unghiuri opuse la vârf și adiacente','Unghiurile opuse la vârf sunt egale. Două unghiuri adiacente formate pe aceeași dreaptă însumează 180°. Reprezentarea se verifică înainte de calcul.','α + β = 180°','Dacă un unghi este 68°, unghiul adiacent pe o dreaptă este 180° − 68° = 112°, iar opusul la vârf este 68°.','Un unghi adiacent la 45° cât măsoară?','135°.'],
 ['Triunghiuri și suma unghiurilor','În geometria euclidiană suma unghiurilor interioare ale unui triunghi este 180°. Folosim proprietatea pentru unghiul necunoscut.','A + B + C = 180°','Dacă A = 50° și B = 70°, atunci C = 180° − 50° − 70° = 60°. Verificarea: 50 + 70 + 60 = 180.','Un triunghi are unghiuri de 35° și 90°. Află-l pe al treilea.','55°.'],
 ['Patrulatere și proprietăți','Dreptunghiul are patru unghiuri drepte; pătratul este un dreptunghi cu patru laturi egale. Paralelogramul are laturile opuse paralele și egale.','P dreptunghi = 2(L + l)','Un dreptunghi de 8 cm × 5 cm are perimetrul 2 × (8 + 5) = 26 cm și aria 8 × 5 = 40 cm². Nu confundăm unitățile de lungime cu cele de arie.','Află aria unui pătrat cu latura 6 cm.','36 cm².'],
 ['Cercul: lungime și arie','Lungimea cercului măsoară conturul; aria discului măsoară suprafața. Pi este aproximativ 3,14159, iar rezultatele aproximative trebuie indicate ca atare.','L = 2πr; A = πr²','Pentru r = 3 cm, lungimea este 6π cm ≈ 18,85 cm, iar aria este 9π cm² ≈ 28,27 cm².','Scrie aria exactă a discului cu r = 5 cm.','25π cm².']
 ],
 statistics:[
 ['Frecvența relativă','Frecvența relativă este ponderea aparițiilor unei valori în total. Suma frecvențelor relative este 1, adică 100%.','f_rel = frecvență / numărul observațiilor','Din 20 de elevi, 8 preferă baschetul. Frecvența relativă este 8/20 = 0,4, adică 40%.','Din 30 de răspunsuri, 12 sunt „da”. Ce procent reprezintă?','40%.'],
 ['Medie și mediană','Media folosește toate valorile; mediana este valoarea centrală după ordonare. Când numărul de observații este par, mediana este media celor două valori din mijloc.','Mediana pentru 2, 5, 7 = 5','Pentru 2, 4, 6, 20 media este 8, iar mediana este (4 + 6)/2 = 5. Valoarea extremă 20 afectează mai mult media.','Află mediana pentru 3, 1, 8, 5, 7.','5.'],
 ['Evenimente și probabilitate intuitivă','Probabilitatea descrie cât de posibil este un rezultat într-un experiment aleator. Între imposibil și sigur avem valori între 0 și 1.','0 ≤ P(E) ≤ 1','La aruncarea unui zar corect, probabilitatea de a obține 6 este 1/6, deoarece există un rezultat favorabil din șase echiprobabile.','La o monedă echilibrată, care este probabilitatea stemei?','1/2.']
 ]
 },
 {
 algebra:[
 ['Expresii algebrice și termeni asemenea','Un termen conține un coeficient numeric și eventual litere. Termenii asemenea au aceleași părți literale cu aceiași exponenți; numai aceștia se pot aduna direct.','3x + 5x − 2x = 6x','Simplificăm 2a + 3b + 4a − b grupând separat literele: 6a + 2b. Nu putem aduna 6a cu 2b într-un singur termen.','Simplifică 7x − 3y + 2x + y.','9x − 2y.'],
 ['Identități și formule de calcul prescurtat','Formulele sunt egalități adevărate pentru toate valorile admise. Le folosim la dezvoltarea produselor și verificăm termenul dublu din pătratul sumei.','(a + b)² = a² + 2ab + b²','Dezvoltăm (x + 3)² = x² + 6x + 9. Termenul din mijloc provine din 2 × x × 3, nu doar din 3x.','Dezvoltă (y − 4)².','y² − 8y + 16.'],
 ['Ecuații cu paranteze','Desfacem parantezele cu distributivitatea și apoi adunăm termenii asemenea. O ecuație se verifică substituind soluția în forma inițială.','2(x + 4) = 18','Distribuim: 2x + 8 = 18, deci 2x = 10 și x = 5. Verificăm 2 × (5 + 4) = 18.','Rezolvă 3(x − 2) = 15.','x = 7.'],
 ['Inecuații liniare','Rezolvarea unei inecuații seamănă cu rezolvarea ecuațiilor. La înmulțire sau împărțire cu număr negativ inversăm sensul semnului.','−2x < 6 ⇒ x > −3','Împărțim ambii membri ai inecuației −2x < 6 la −2; fiind negativ, < devine >. Obținem x > −3.','Rezolvă −3x ≥ 12.','x ≤ −4.']
 ],
 geometry:[
 ['Congruența triunghiurilor','Două triunghiuri sunt congruente dacă pot fi suprapuse, având laturile și unghiurile corespunzătoare egale. Criteriul LLL folosește egalitatea tuturor celor trei laturi.','LLL: trei perechi de laturi egale','Dacă ABC și DEF au laturile 3 cm, 4 cm și 5 cm în aceeași corespondență, sunt congruente prin LLL. Trebuie precizată corect ordinea vârfurilor.','Sunt congruente două triunghiuri cu laturile 4, 4, 6 și 4, 6, 4?','Da, dacă laturile sunt puse în corespondență.'],
 ['Teorema lui Pitagora','Într-un triunghi dreptunghic, pătratul lungimii ipotenuzei este suma pătratelor catetelor. Formula nu se aplică unui triunghi oarecare.','a² + b² = c²','Catetele au 6 cm și 8 cm: c² = 36 + 64 = 100, deci c = 10 cm deoarece lungimea este pozitivă.','Catetele sunt 5 cm și 12 cm. Află ipotenuza.','13 cm.'],
 ['Arii de triunghiuri și patrulatere','Aria reprezintă suprafața ocupată, exprimată în unități pătrate. Pentru triunghi folosim baza și înălțimea perpendiculară pe acea bază.','A_tri = b × h / 2','Un triunghi cu baza 10 cm și înălțimea 7 cm are aria 10 × 7 / 2 = 35 cm². O latură oblică nu este automat înălțime.','Află aria unui triunghi cu b = 8 cm, h = 5 cm.','20 cm².'],
 ['Cercuri și unghiuri la centru','Un unghi la centru are vârful în centrul cercului; el delimitează un arc. Arcele și unghiurile se corelează prin măsurile lor în grade.','Unghi complet = 360°','Un unghi la centru de 90° delimitează un sfert din cerc, deoarece 90/360 = 1/4.','Ce fracție din cerc corespunde unui unghi la centru de 120°?','1/3.']
 ],
 statistics:[
 ['Mulțimi de rezultate','Un experiment aleator are un spațiu al rezultatelor posibile. Un eveniment este un subset al rezultatelor și se descrie fără a presupune un rezultat anume.','Ω_zar = {1,2,3,4,5,6}','Evenimentul „număr par” pentru un zar are rezultatele {2,4,6}. Dacă zarul este corect, probabilitatea este 3/6 = 1/2.','Care este probabilitatea rezultatului mai mare decât 4 la un zar corect?','2/6 = 1/3.'],
 ['Probabilitatea evenimentului complementar','Complementul evenimentului conține toate rezultatele care nu aparțin evenimentului. Suma probabilităților celor două evenimente este 1.','P(non E) = 1 − P(E)','Dacă probabilitatea de ploaie este 0,3, probabilitatea să nu plouă este 1 − 0,3 = 0,7, în cadrul aceluiași model.','Dacă P(E) = 0,65, care este P(non E)?','0,35.'],
 ['Reprezentări și interpretare critică','Alegem între bare, linii și tabele după natura datelor. O scară trunchiată poate exagera diferențe, de aceea citim axele și unitățile.','Diferență absolută = valoare finală − inițială','Temperatura crește de la 12°C la 18°C: diferența este 6°C, chiar dacă axa diagramei începe la 10°C.','Un grafic pornește la 90 și ajunge la 110. Care este creșterea absolută?','20 de unități.']
 ]
 },
 {
 algebra:[
 ['Ecuații de gradul întâi în contexte','Modelele algebrice traduc situațiile în egalități. Definim necunoscuta, scriem ecuația, calculăm și interpretăm soluția în context.','4x + 6 = 30','Patru bilete identice și o taxă de 6 lei costă 30 lei. Scădem 6: 4x = 24, împărțim la 4: x = 6 lei pe bilet.','Trei caiete și un creion de 4 lei costă 25 lei. Prețul caietului?','7 lei.'],
 ['Sisteme de două ecuații','Un sistem cere aceleași valori necunoscute care verifică simultan toate ecuațiile. Putem utiliza substituția sau eliminarea.','x + y = 10; x − y = 2','Adunăm cele două ecuații: 2x = 12, deci x = 6. Din x + y = 10 rezultă y = 4. Verificăm și a doua: 6 − 4 = 2.','Rezolvă x + y = 9 și x − y = 3.','x = 6, y = 3.'],
 ['Funcții și reprezentări pe coordonate','O funcție asociază fiecărui argument admis exact o valoare. Graficul ei este mulțimea punctelor (x, f(x)) dintr-un sistem de axe.','f(x) = 2x − 1','Pentru x = 0, 1, 2 obținem f(x) = −1, 1, 3. Reprezentăm punctele (0,−1), (1,1), (2,3) și le unim: graficul este o dreaptă.','Calculează f(−1) și f(3) pentru f(x) = 3x + 2.','−1 și 11.'],
 ['Descompuneri în factori','Factorizarea rescrie o expresie ca produs, pentru a simplifica sau rezolva ecuații. Scoatem factorul comun, dacă acesta există.','ax + ay = a(x + y)','6x + 9 = 3(2x + 3). Verificăm prin distribuire: 3 × 2x + 3 × 3 = 6x + 9.','Factorizează 8x − 12.','4(2x − 3).']
 ],
 geometry:[
 ['Asemănarea triunghiurilor','Triunghiurile asemenea au unghiuri corespunzătoare egale și laturi corespunzătoare proporționale. Asemănarea nu înseamnă neapărat dimensiuni egale.','AB/DE = BC/EF = AC/DF','Dacă laturile unui triunghi sunt 3, 4, 5, iar ale altuia 6, 8, 10, factorul de scară este 2. Triunghiurile sunt asemenea, nu congruente.','Un segment de 4 cm devine 10 cm într-o figură asemenea. Care e factorul de scară?','2,5.'],
 ['Teorema lui Thales: raporturi','O dreaptă paralelă cu o latură a triunghiului determină segmente proporționale pe celelalte laturi. Desenul trebuie să arate paralelismul.','AD/AB = AE/AC, dacă DE ∥ BC','Dacă AD/AB = 2/3 și AC = 12 cm, atunci AE/AC = 2/3, deci AE = 8 cm.','Dacă raportul este 1/4 și latura mare e 20 cm, cât este segmentul corespunzător?','5 cm.'],
 ['Corpuri geometrice: volum','Volumul măsoară spațiul ocupat și se exprimă în unități cubice. Pentru un paralelipiped dreptunghic înmulțim dimensiunile perpendiculare.','V = L × l × h','O cutie 5 cm × 4 cm × 3 cm are volumul 60 cm³. Aria suprafeței se calculează separat și are unități pătrate.','Volumul cubului cu muchia 4 cm?','64 cm³.'],
 ['Teoreme și demonstrație logică','O demonstrație începe cu ipoteza, folosește definiții și rezultate cunoscute și ajunge prin pași justificați la concluzie. Desenul sugerează, dar nu dovedește singur.','Ipoteză ⇒ justificări ⇒ concluzie','Pentru un triunghi isoscel cu AB = AC folosim proprietatea unghiurilor de la bază: unghiurile B și C sunt egale. Scriem ipoteza înaintea concluziei.','Ce ar trebui explicat într-o demonstrație în afara rezultatului?','De ce fiecare pas decurge din ipoteze sau teoreme cunoscute.']
 ],
 statistics:[
 ['Probabilitatea unor evenimente incompatibile','Evenimentele incompatibile nu se pot produce simultan. Probabilitatea reuniunii lor este suma probabilităților individuale.','P(A ∪ B) = P(A) + P(B), dacă A ∩ B = ∅','Pe un zar, A = {1}, B = {6}. Cele două rezultate nu pot apărea la aceeași aruncare, deci P(A sau B) = 1/6 + 1/6 = 1/3.','Probabilitatea de a obține 2 sau 4 pe un zar corect?','1/3.'],
 ['Probabilități din tabele','Pentru date echiprobabile numărăm cazurile favorabile și totale; în date observate folosim frecvențe relative fără a presupune automat echiprobabilitate.','P(A) = cazuri favorabile / cazuri posibile','Dintr-un sac cu 5 bile roșii și 3 albastre, la extragerea uniformă a unei bile P(roșu) = 5/8.','Cât este P(albastru) în același sac?','3/8.'],
 ['Combinatorică elementară','Regula produsului numără alegerile succesive independente ca opțiuni. Dacă prima alegere are m variante și a doua n, avem m × n rezultate ordonate.','Număr perechi = m × n','Trei tricouri și două perechi de pantaloni permit 3 × 2 = 6 combinații de ținute.','Patru băuturi și trei gustări: câte meniuri diferite?','12.']
 ]
 }
];
const EXPANDED_UNIVERSITY=MATH_DEPTH_UNIVERSITY.map((phase,i)=>Object.fromEntries(
 Object.entries(phase).map(([topic,rows])=>[topic,[...rows,...(MATH_UNIVERSITY_EXTENSION[i]?.[topic]||[])]])));
export const MATH_DEPTH_STAGES=Object.freeze({
 primary:[...MATH_DEPTH_PRIMARY,...MATH_DEPTH_PRIMARY_56],
 lower:MATH_DEPTH_LOWER,intermediate:MATH_DEPTH_UPPER,advanced:EXPANDED_UNIVERSITY
});
export function mathInDepthEntries({stage,phase,topic}={}){
 const st=String(stage||''),p=Number(phase),subject=String(topic||'');
 const rows=MATH_DEPTH_STAGES[st]?.[p-1]?.[subject];
 if(!Array.isArray(rows))return [];
 return rows.map((x,i)=>{
  // Lower-secondary entries were authored first in Romanian; later stage
  // entries include a stable English title for non-Romanian app navigation.
  const offset=x.length===7?1:0;
  return {
   id:'math-depth-'+st+'-'+p+'-'+subject+'-'+(i+1),
   subject:'math',level:st==='advanced'?'advanced':st==='intermediate'?'intermediate':'beginner',
   stage:st,phase:p,topic:subject,title:x[offset],enTitle:st==='advanced'?(MATH_DEPTH_EN_UNIVERSITY[p-1]?.[subject]?.[i]||x[0]):
    offset?x[0]:(st==='lower'?(MATH_DEPTH_EN_LOWER[p-1]?.[subject]?.[i]||x[0]):x[0]),
   statement:x[offset+1],formula:x[offset+2]||'',
   worked:x[offset+3],practice:x[offset+4],answers:x[offset+5],
   sourceStatus:'general-learning',aliases:[]
  };
 });
}
export function mathInDepthMaterial(entry){
 if(!entry?.title||!entry?.statement||!entry?.worked)return '';
 return [
 '# '+entry.title,
 '# Definiție și explicație',entry.statement,
 '# Formula și notațiile',entry.formula||'Nu este necesară o formulă separată pentru acest concept.',
 '# Exemplu rezolvat, pas cu pas',entry.worked,
 '# Exersează singur',entry.practice,
 '# Verifică răspunsurile',entry.answers,
 '# Atenție', 'Fiecare operație trebuie justificată și verificată în context. Nu deduce măsuri, valori sau ipoteze care nu au fost precizate.',
 '# Încadrare curriculară', 'Material orientativ de învățare; repartizarea oficială diferă după țară, instituție și an școlar.'
 ].join('\n\n');
}
