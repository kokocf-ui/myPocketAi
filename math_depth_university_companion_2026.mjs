// Original higher-education mathematics study material. Bachelor-level
// examples across four ADVISORY study phases, not a national degree plan.
// Each seven-field row has an independent explanation, formula, fully worked
// example, exercise and checked answer.
export const MATH_UNIVERSITY_2026_COMPANION=[
 {
  analysis:[
   ['Supremum and infimum of a set','Marginea superioară și inferioară a unei mulțimi',
    'Supremumul este cel mai mic majorant, iar infimumul cel mai mare minorant al unei mulțimi reale. O margine nu trebuie să aparțină mulțimii, spre deosebire de maxim și minim.',
    'sup(0,1)=1; inf(0,1)=0',
    'Mulțimea A=(0,1) este mărginită superior de 1 și inferior de 0. Niciuna dintre margini nu este atinsă; de aceea A nu are maxim și nici minim.',
    'A=[−2,4). Determină sup A, inf A și maximul.','sup A=4, inf A=−2, maximul nu există.'],
   ['Limit of a rational function at infinity','Limita unei funcții raționale la infinit',
    'La limita la infinit a unui raport de polinoame, împărțim prin cea mai mare putere relevantă și comparăm gradele. Coeficienții termenilor dominanți determină limita când gradele sunt egale.',
    'lim(x→∞)(axⁿ+…)/(bxⁿ+…)=a/b, b≠0',
    'Pentru (3x²+1)/(2x²−5), împărțim numărătorul și numitorul la x². Termenii 1/x² și 5/x² tind la zero, deci limita este 3/2.',
    'Calculează lim(x→∞)(5x³+x)/(x³+2).','5.'],
   ['Differentiability of the absolute value','Derivabilitatea funcției modul',
    'O funcție poate fi continuă într-un punct fără să fie derivabilă acolo. Dacă derivatele laterale sunt diferite, limita raportului incremental nu există.',
    'f(x)=|x| ⇒ f′(0−)=−1, f′(0+)=1',
    'Pentru f(x)=|x|, pe x negativ panta este −1, iar pe x pozitiv este 1. La zero derivatele laterale diferă, deci f nu este derivabilă în acel punct.',
    'Este derivabilă f(x)=|x−2| în x=2?','Nu, derivata laterală stângă este −1 și cea dreaptă este 1.']
  ],
  'linear-algebra':[
   ['Rank of a two-by-two matrix','Rangul unei matrice 2×2',
    'Rangul este numărul maxim de linii sau coloane liniar independente. Pentru o matrice 2×2, un determinant nenul implică rangul 2; altfel inspectăm dacă matricea este zero.',
    'det A≠0 ⇒ rang(A)=2',
    'Pentru A=[[1,2],[2,4]], determinantul este zero, iar linia a doua este de două ori prima. Cum matricea nu este nulă, rangul este 1.',
    'Determină rangul lui [[1,0],[0,2]].','Rangul 2.'],
   ['Kernel of a linear map','Nucleul unei aplicații liniare',
    'Nucleul este mulțimea vectorilor trimiși în vectorul nul printr-o aplicație liniară. El este subspațiu vectorial și descrie pierderea de informație a transformării.',
    'ker(T)={v | T(v)=0}',
    'Pentru T(x,y)=x+y, condiția T(x,y)=0 impune y=−x. Astfel, ker(T) este dreapta generată de vectorul (1,−1).',
    'Care este nucleul lui T(x,y)=(x,0)?','Toți vectorii (0,y), cu y real.'],
   ['Linear independence in the plane','Independența liniară a doi vectori în plan',
    'Doi vectori din plan sunt independenți dacă niciunul nu este multiplu scalar al celuilalt. Determinantul matricei care îi conține drept coloane este un criteriu practic.',
    'u,v independenți ⇔ det[u v]≠0',
    'Vectorii u=(1,2) și v=(2,5) dau determinantul 1·5−2·2=1, nenul. Ei formează o bază a planului.',
    'Sunt independenți (1,3) și (2,6)?','Nu, determinantul este zero; al doilea este dublul primului.']
  ],
  discrete:[
   ['The pigeonhole principle','Principiul cutiilor',
    'Dacă distribuim mai multe obiecte decât cutii și fiecare obiect intră într-o singură cutie, cel puțin o cutie va conține două sau mai multe obiecte. Principiul este o metodă de demonstrație.',
    'n+1 obiecte în n cutii ⇒ o cutie cu ≥2 obiecte',
    'Într-o clasă de 13 elevi există cel puțin doi născuți în aceeași lună, fiindcă există numai 12 luni. Nu trebuie să știm lunile concrete.',
    'Ce garantăm pentru 11 șosete în 5 sertare?','Cel puțin un sertar conține cel puțin 3 șosete.'],
   ['Modular congruence as an equivalence relation','Congruența modulară și clasele de resturi',
    'O relație este de echivalență dacă este reflexivă, simetrică și tranzitivă. Clasele ei de echivalență sunt mulțimi disjuncte sau identice și formează o partiție.',
    'a~b ⇔ a≡b (mod n)',
    'La relația congruenței modulo 3, numerele 1 și 4 sunt echivalente deoarece diferența lor este divizibilă cu 3. Clasele posibile sunt [0], [1], [2].',
    'Sunt 7 și 12 echivalente modulo 5?','Da, 12−7=5 este divizibil cu 5.']
  ]
 },
 {
  analysis:[
   ['Gradient of a scalar field','Gradientul unui câmp scalar',
    'Gradientul reunește derivatele parțiale ale unei funcții și indică direcția celei mai rapide creșteri locale pentru norma euclidiană. El se evaluează într-un punct.',
    '∇f=(∂f/∂x,∂f/∂y)',
    'Pentru f(x,y)=x²+3y² calculăm ∂f/∂x=2x și ∂f/∂y=6y. În punctul (1,2) gradientul este (2,12).',
    'Află ∇f(2,1) pentru f(x,y)=xy+y².','(1,4).'],
   ['Jacobian of a planar transformation','Jacobianul unei transformări în plan',
    'Jacobianul unei funcții vectoriale este matricea derivatelor parțiale. Determinantul său descrie multiplicarea locală a ariilor când transformarea este suficient de regulată.',
    'J_F=[[∂u/∂x,∂u/∂y],[∂v/∂x,∂v/∂y]]',
    'Pentru F(x,y)=(2x,3y), matricea Jacobiană este diag(2,3). Determinantul este 6, deci ariile sunt multiplicate cu factorul 6.',
    'Determină det J pentru F(x,y)=(x+y,x−y).','−2.'],
   ['Changing the integration order on a rectangle','Schimbarea ordinii de integrare pe un dreptunghi',
    'Pentru funcții continue pe un dreptunghi, integrala dublă poate fi calculată integrând succesiv în cele două variabile. Ordinea se poate schimba când ipotezele sunt îndeplinite.',
    '∬_R f(x,y)dA=∫ₐᵇ∫_cᵈ f(x,y)dydx',
    'Pe [0,1]×[0,2], calculăm ∫∫(x+y) dydx=3. Schimbând ordinea, ∫₀²∫₀¹(x+y) dxdy=∫₀²(1/2+y)dy=1+2=3.',
    'Află ∬_[0,1]×[0,1] xy dA.','1/4.']
  ],
  'linear-algebra':[
   ['Gram-Schmidt with two vectors','Ortogonalizarea Gram–Schmidt pentru doi vectori',
    'Algoritmul construiește din vectori independenți un sistem ortogonal, scăzând proiecțiile pe direcțiile deja alese. Normalizarea dă ulterior o bază ortonormală.',
    'v₂=u₂−(u₂·u₁)/(u₁·u₁)u₁',
    'Pentru u₁=(1,0), u₂=(1,1), proiectăm u₂ pe u₁: (1,0). Scăzând, obținem v₂=(0,1), perpendicular pe u₁.',
    'Aplică pasul al doilea la u₁=(2,0), u₂=(3,4).','v₂=(0,4).'],
   ['Orthogonal matrices and length preservation','Matrici ortogonale și păstrarea lungimilor',
    'O matrice reală este ortogonală când transpusa sa este inversa. Ea păstrează produsul scalar, unghiurile și lungimile vectorilor din spațiul euclidian.',
    'QᵀQ=I ⇒ |Qv|=|v|',
    'Pentru Q=[[0,−1],[1,0]], verificăm QᵀQ=I. Vectorul (3,4) se transformă în (−4,3), iar norma rămâne 5.',
    'Q=diag(−1,1) păstrează norma?','Da, QᵀQ=I.']
  ],
  statistics:[
   ['Indicator variables and expectation','Variabile indicatoare și valoarea așteptată',
    'Variabila indicatoare pentru un eveniment are valoarea 1 dacă acesta se produce și 0 în caz contrar. Așteptarea sa este chiar probabilitatea evenimentului.',
    'E(1_A)=P(A)',
    'Dacă probabilitatea de succes este 0,3, variabila I are E(I)=1·0,3+0·0,7=0,3. Pentru suma mai multor indicatoare folosim linearitatea.',
    'Dacă P(A)=2/5, află E(1_A).','2/5.'],
   ['Covariance of a pair of random variables','Covarianța a două variabile aleatoare',
    'Covarianța măsoară variația comună centrată față de medii. Semnul său indică direcția asocierii liniare; valorile depind de unitățile variabilelor.',
    'Cov(X,Y)=E(XY)−E(X)E(Y)',
    'Dacă E(XY)=10, E(X)=2 și E(Y)=4, covarianța este 10−2·4=2. Asocierea liniară are semn pozitiv.',
    'E(XY)=5, E(X)=1, E(Y)=3. Află covarianța.','2.'],
   ['Variance of a Bernoulli random variable','Dispersia unei variabile Bernoulli',
    'O variabilă Bernoulli ia numai valorile zero și unu, cu probabilitățile 1−p și p. Varianța rezultă din faptul că X²=X pentru aceste valori.',
    'Var(X)=p(1−p)',
    'Cu p=0,2, dispersia este 0,2·0,8=0,16. Calculul este compatibil cu E(X)=0,2 și E(X²)=0,2.',
    'Află Var(X) pentru p=0,5.','0,25.']
  ]
 },
 {
  differential:[
   ['Logistic growth equation','Ecuația logistică de creștere',
    'Modelul logistic presupune o rată de creștere proporțională cu populația și cu fracția capacității de suport rămase. Pentru r>0, nivelul K este un echilibru.',
    'y′=ry(1−y/K)',
    'Pentru K=100 și y=50, derivata este r·50·(1−1/2)=25r, pozitivă dacă r>0. La y=100 derivata devine zero.',
    'Ce este y′ la y=K în modelul logistic?','0.'],
   ['Homogeneous second-order ODE','Ecuații diferențiale omogene de ordinul doi',
    'Pentru ecuații cu coeficienți constanți, soluțiile de forma e^(rx) duc la o ecuație caracteristică. Două rădăcini reale distincte produc două exponențiale independente.',
    'y″−3y′+2y=0 ⇒ r²−3r+2=0',
    'Ecuația caracteristică este (r−1)(r−2)=0, cu rădăcinile 1 și 2. Soluția generală este y=C₁eˣ+C₂e²ˣ.',
    'Rezolvă y″−y=0 în forma generală.','y=C₁eˣ+C₂e⁻ˣ.'],
   ['Initial condition for an exponential ODE','Condiție inițială într-o ecuație diferențială',
    'O condiție inițială alege o soluție din familia soluțiilor generale. Trebuie introdusă după determinarea formei generale și verificată în model.',
    'y′=ky, y(0)=y₀ ⇒ y=y₀e^(kx)',
    'Pentru y′=2y obținem y=Ce²ˣ. Condiția y(0)=3 impune C=3, deci y=3e²ˣ.',
    'Rezolvă y′=−y, y(0)=5.','y=5e⁻ˣ.']
  ],
  analysis:[
   ['Cauchy integral criterion in sequences','Criteriul Cauchy pentru convergența șirurilor',
    'În numerele reale, un șir converge dacă și numai dacă termenii săi devin arbitrar de apropiați între ei dintr-un anumit indice încolo. Criteriul nu presupune cunoașterea limitei.',
    '∀ε>0 ∃N ∀m,n≥N: |a_m−a_n|<ε',
    'Pentru aₙ=1/n, când m,n≥N avem |1/m−1/n|≤1/N. Alegând N>1/ε obținem condiția Cauchy.',
    'Este șirul aₙ=n un șir Cauchy?','Nu: diferența dintre termeni depărtați nu devine mică.'],
   ['Fourier cosine coefficient of a constant','Coeficientul Fourier pentru o funcție constantă',
    'În reprezentarea Fourier a unei funcții periodice, coeficientul constant este proporțional cu media funcției pe o perioadă. Celelalte armonice ale unei constante sunt nule.',
    'a₀=(1/π)∫₋π^π f(x)dx',
    'Pentru f(x)=3, integrala pe [−π,π] este 6π. Rezultă a₀=6, iar termenul constant din serie a₀/2=3.',
    'Determină a₀ pentru f(x)=2 pe [−π,π].','a₀=4.'],
   ['Complex modulus and conjugate product','Produsul unui număr complex cu conjugatul său',
    'Produsul z·conj(z) este real nenegativ și egal cu pătratul modulului. Identitatea permite transformarea împărțirii prin numere complexe în expresii raționale.',
    'z·conj(z)=|z|²=a²+b²',
    'Pentru z=3+4i, conjugatul este 3−4i. Produsul este 9−(4i)²=9+16=25, deci modulul este 5.',
    'Calculează (2−i)(2+i).','5.']
  ],
  discrete:[
   ['Topological ordering of a directed acyclic graph','Ordonarea topologică a unui graf orientat aciclic',
    'O ordonare topologică pune fiecare vârf înaintea tuturor succesorilor săi. O astfel de ordine există numai pentru grafuri orientate fără cicluri.',
    'u→v ⇒ ordine(u)<ordine(v)',
    'Dacă A→B și A→C, ordinea A,B,C este validă și la fel A,C,B. Ordinea B,A,C nu este validă deoarece ar plasa B înainte de A.',
    'Pentru A→B→C ce ordine este posibilă?','A,B,C.'],
   ['Fibonacci recurrence with two starting values','Recurența Fibonacci cu două condiții inițiale',
    'O relație de recurență exprimă termenii viitori prin termeni precedenți. Pentru o recurență de ordinul doi sunt necesare, în general, două valori inițiale.',
    'Fₙ=Fₙ₋₁+Fₙ₋₂',
    'Din F₀=0 și F₁=1 rezultă F₂=1, F₃=2 și F₄=3. Fiecare termen este suma celor doi termeni anteriori.',
    'Determină F₅ pentru F₀=0, F₁=1.','5.']
  ]
 },
 {
  analysis:[
   ['Contractive mapping on the real line','Aplicații contractante pe dreapta reală',
    'O aplicație este contractantă dacă reduce distanțele printr-un factor uniform subunitar. Într-un spațiu metric complet, teorema punctului fix asigură existența și unicitatea punctului fix.',
    '|T(x)−T(y)|≤q|x−y|, 0≤q<1',
    'Pentru T(x)=x/2+1 avem factorul q=1/2. Ecuația T(x)=x dă x/2+1=x, deci punctul fix unic este x=2.',
    'Determină punctul fix al lui T(x)=x/3+2.','x=3.'],
   ['Trapezoidal rule numerical integration','Regula trapezelor pentru integrare numerică',
    'Regula trapezelor aproximează aria semnată folosind segmente care unesc valori ale funcției. Pe un singur interval, formula este exactă pentru funcții afine.',
    '∫ₐᵇf(x)dx≈(b−a)(f(a)+f(b))/2',
    'Pentru f(x)=x² pe [0,2], regula dă 2·(0+4)/2=4. Integrala exactă este 8/3, deci eroarea acestei aproximații este 4/3.',
    'Aproximează ∫₀¹x² dx cu un singur trapez.','1/2.'],
   ['Geometric series in a normed space','Serii geometrice în spații normate',
    'Seriile dintr-un spațiu normat sunt convergente când șirul sumelor parțiale are limită în acel spațiu. În numere reale, o serie geometrică converge pentru modulul rației subunitar.',
    'Σₙ₌₀∞ qⁿ=1/(1−q), |q|<1',
    'Cu q=1/2, sumele parțiale sunt 1, 1,5, 1,75 și tind către 2. Pentru q=2, termenii nu tind la zero și seria diverge.',
    'Calculează Σₙ₌₀∞ (1/3)ⁿ.','3/2.']
  ],
  statistics:[
   ['Maximum likelihood for a Bernoulli model','Estimare de maximă verosimilitate Bernoulli',
    'Într-un eșantion de încercări Bernoulli independente cu aceeași probabilitate p, verosimilitatea este maximă când p egalează proporția observată a succeselor.',
    'p̂=k/n',
    'În 20 de încercări s-au observat 7 succese. Estimatorul de maximă verosimilitate este p̂=7/20=0,35; el descrie datele, nu garantează probabilitatea reală.',
    'Pentru 12 succese din 30 de probe, află p̂.','0,4.'],
   ['Standard error for the sample mean','Eroarea standard a mediei eșantionale',
    'Pentru observații independente cu aceeași dispersie finită, eroarea standard a mediei scade proporțional cu rădăcina numărului de observații. Ea măsoară variația estimatorului, nu dispersia individuală.',
    'SE(x̄)=σ/√n',
    'Cu abaterea standard a populației σ=12 și n=36, eroarea standard este 12/6=2. Dacă mărim eșantionul de patru ori, eroarea se înjumătățește.',
    'σ=10 și n=100: cât este eroarea standard?','1.'],
   ['Geometric probability over a unit square','Probabilitate geometrică pe pătratul unitate',
    'Pentru un punct ales uniform pe o regiune de arie finită, probabilitatea apartenenței la o subregiune este raportul ariilor. Uniformitatea este o ipoteză esențială.',
    'P(A)=aria(A)/aria(Ω)',
    'Alegem uniform un punct din pătratul [0,1]². Regiunea x≤1/2 ocupă jumătate din suprafață, deci probabilitatea este 1/2.',
    'Probabilitatea pentru subpătratul [0,1/2]²?','1/4.']
  ],
  discrete:[
   ['Minimum spanning tree and greedy selection','Arbore minim de acoperire și selecție lacomă',
    'Un arbore de acoperire conectează toate vârfurile unui graf neorientat fără cicluri. Algoritmul Kruskal adaugă muchii în ordine crescătoare, evitând închiderea ciclurilor.',
    'arbore cu n vârfuri ⇒ n−1 muchii',
    'Într-un triunghi cu ponderi AB=1, BC=2, AC=5, alegem AB și BC. Ele conectează toate vârfurile fără ciclu, cu cost total 3.',
    'Cu muchii AB=2, BC=4, AC=1, care este costul arborelui minim?','3, din AC și AB.'],
   ['Binomial identity by counting subsets','Identitate binomială prin numărarea submulțimilor',
    'Numărul submulțimilor unei mulțimi cu n elemente este 2ⁿ. Grupând aceste submulțimi după cardinalitate obținem suma coeficienților binomiali.',
    'Σₖ₌₀ⁿ C(n,k)=2ⁿ',
    'Pentru n=3, numărul submulțimilor de dimensiuni 0,1,2,3 este 1,3,3,1. Suma este 8=2³.',
    'Calculează Σₖ₌₀⁴ C(4,k).','16.']
  ]
 }
];
