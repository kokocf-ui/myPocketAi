// Original upper-secondary extension: 40 independent lessons, 10 per
// illustrative progression year. Not an approved national curriculum.
// Format: English title, Romanian title, explanation, formula, worked steps,
// standalone exercise, verified answer. Lessons are supplementary to the
// existing stage materials, and MUST NOT be labelled "official annual plan".
export const MATH_UPPER_2026_COMPANION=[
 {
  algebra:[
   ['Intervals on the real line','Intervale deschise și închise',
    'Un interval descrie o mulțime de numere reale dintre două limite. Paranteza rotundă exclude limita, iar cea pătrată o include. La infinit folosim întotdeauna paranteză rotundă.',
    '[a,b]={x∈ℝ | a≤x≤b}',
    'Condițiile x>−2 și x≤5 trebuie satisfăcute simultan. Intersecția este intervalul (−2,5], deoarece −2 nu este permis, iar 5 este inclus.',
    'Scrie sub formă de interval −1≤x<4.','[−1,4).'],
   ['Intersection and union of sets','Reuniunea și intersecția mulțimilor',
    'Intersecția păstrează elementele comune, iar reuniunea păstrează toate elementele care apar în cel puțin una dintre mulțimi. Un element comun se numără o singură dată.',
    'A∩B={x | x∈A și x∈B}',
    'Pentru A={1,2,3} și B={3,4}, intersecția este {3}, iar reuniunea {1,2,3,4}. Verificăm fiecare element din cele două liste.',
    'A={2,4,6}, B={4,5}. Află A∩B și A∪B.','A∩B={4}; A∪B={2,4,5,6}.'],
   ['Product of two binomials','Înmulțirea a două binoame',
    'Aplicăm distributivitatea fiecărui termen din prima paranteză peste fiecare termen din a doua, apoi reducem termenii asemenea. Verificarea se poate face substituind o valoare simplă.',
    '(a+b)(c+d)=ac+ad+bc+bd',
    'Pentru (x+2)(x+5) înmulțim x cu x și 5, apoi 2 cu x și 5. Obținem x²+5x+2x+10=x²+7x+10.',
    'Dezvoltă (x−3)(x+4).','x²+x−12.'],
   ['Solving a rational equation','Ecuații simple cu numitor necunoscut',
    'Într-o ecuație cu fracții algebrice trebuie mai întâi să interzicem valorile care anulează numitorii. Înmulțirea cu numitorul este permisă numai pe domeniul de definiție.',
    '(x+1)/x=3, x≠0',
    'Din (x+1)/x=3 cu x≠0 rezultă x+1=3x, deci 1=2x și x=1/2. Soluția este validă fiindcă numitorul nu este zero.',
    'Rezolvă (x+2)/x=2 pentru x≠0.','x=2.']
  ],
  functions:[
   ['Zero of an affine function','Zeroul unei funcții afine',
    'Zeroul unei funcții este valoarea argumentului unde graficul intersectează axa Ox. Pentru o funcție afină cu pantă nenulă, zeroul se află rezolvând ecuația f(x)=0.',
    'f(x)=ax+b ⇒ x₀=−b/a, a≠0',
    'Funcția f(x)=2x−6 are zeroul când 2x−6=0. Adunăm 6 și împărțim la 2, obținând x=3; punctul este (3,0).',
    'Găsește zeroul lui f(x)=−3x+12.','x=4.'],
   ['Vertex form of a quadratic','Forma canonică a unei funcții pătratice',
    'Scrierea unei funcții pătratice în forma canonică evidențiază coordonatele vârfului parabolei și sensul deschiderii. Coeficientul termenului pătratic determină orientarea.',
    'f(x)=a(x−h)²+k',
    'Pentru f(x)=x²−4x+7, completăm pătratul: x²−4x+4+3=(x−2)²+3. Vârful are coordonatele (2,3).',
    'Scrie x²+6x+11 în formă canonică.','(x+3)²+2.'],
   ['Domain of a square-root function','Domeniul unei funcții cu radical',
    'Pentru radicalul de ordin doi în numere reale, expresia de sub radical trebuie să fie nenegativă. Domeniul se obține rezolvând inecuația asociată.',
    'f(x)=√(x−a) ⇒ D=[a,+∞)',
    'Pentru f(x)=√(2x−6) impunem 2x−6≥0, de unde x≥3. Deci domeniul este [3,+∞), iar f(3)=0.',
    'Află domeniul lui √(5−x).','(−∞,5].']
  ],
  geometry:[
   ['Equation of a vertical line','Ecuația unei drepte verticale',
    'O dreaptă verticală conține puncte cu aceeași coordonată x, indiferent de y. Ea nu are pantă finită și nu se poate scrie ca y=mx+n.',
    'x=c',
    'Punctele (2,−1) și (2,7) au aceeași abscisă. Dreapta care trece prin ele are ecuația x=2; fiecare punct de pe dreaptă o satisface.',
    'Scrie ecuația dreptei prin (−3,1) paralelă cu Oy.','x=−3.'],
   ['Triangle area from coordinates','Aria triunghiului din coordonate',
    'Aria triunghiului definit de trei puncte se poate calcula cu determinantul coordonatelor. Luăm modulul expresiei fiindcă o arie nu poate fi negativă.',
    'A=|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|/2',
    'Pentru A(0,0), B(4,0), C(0,3), formula dă |0+4·3+0|/2=6 unități pătrate, concordant cu baza 4 și înălțimea 3.',
    'A(0,0), B(6,0), C(0,2): calculează aria.','6 unități pătrate.']
  ],
  statistics:[
   ['Weighted mean of several groups','Media ponderată a grupurilor',
    'Când grupurile au numere diferite de observații, media totală se calculează ponderând fiecare medie cu efectivul grupului. Media simplă a mediilor ar fi greșită.',
    'm=(n₁m₁+n₂m₂)/(n₁+n₂)',
    'O grupă de 10 elevi are media 8, iar una de 20 are media 5. Media tuturor este (10·8+20·5)/30=180/30=6.',
    '5 elevi au media 9, iar 15 au media 7. Află media comună.','7,5.']
  ]
 },
 {
  functions:[
   ['Range of an exponential function','Imaginea unei funcții exponențiale',
    'Pentru baza pozitivă diferită de unu, o funcție exponențială pozitivă nu ia valoarea zero. Trasarea unor valori și studiul variației ajută la identificarea imaginii.',
    'f(x)=2ˣ, Im(f)=(0,+∞)',
    'Pentru x=−1,0,1 obținem 1/2,1,2. Toate valorile sunt pozitive, iar când x scade fără limită valorile se apropie de zero fără a-l atinge.',
    'Care este imaginea lui f(x)=3ˣ+4?','(4,+∞).'],
   ['Asymptote of a reciprocal function','Asimptotele funcției reciproce',
    'Graficul funcției 1/x are două ramuri și nu intersectează axele. În vecinătatea lui x=0 valorile cresc în modul, iar la infinit tind către zero.',
    'f(x)=1/x, x≠0',
    'Pentru x=0,1 obținem 10, iar pentru x=10 obținem 0,1. Rezultă asimptota verticală x=0 și orizontală y=0.',
    'Ce asimptotă verticală are f(x)=1/(x−3)?','x=3.'],
   ['Solving an exponential equation','Ecuații exponențiale cu aceeași bază',
    'Dacă două puteri ale aceleiași baze pozitive diferite de unu sunt egale, atunci exponenții lor sunt egali. Transformăm mai întâi numerele în puteri ale aceleiași baze.',
    'aᵘ=aᵛ ⇒ u=v, a>0, a≠1',
    'Rezolvăm 2^(x+1)=16 scriind 16=2⁴. Atunci x+1=4 și x=3. Verificăm 2⁴=16.',
    'Rezolvă 3^(2x)=81.','x=2.']
  ],
  trigonometry:[
   ['Converting radians to degrees','Transformări între radiani și grade',
    'Radianul măsoară un unghi prin raportul dintre lungimea arcului și raza cercului. Cercul complet are 2π radiani, echivalent cu 360 de grade.',
    '180°=π rad',
    'Pentru a converti π/3 radiani în grade, înmulțim cu 180°/π și obținem 60°. Invers, 90° înseamnă π/2 radiani.',
    'Transformă 5π/6 radiani în grade.','150°.'],
   ['Solving a tangent equation','Ecuații trigonometrice cu tangentă',
    'Tangenta are perioada π radiani. Dacă tan x=t, adăugăm multipli întregi de π la soluția principală; punctele unde cos x=0 nu aparțin domeniului.',
    'tan x=1 ⇒ x=π/4+kπ, k∈ℤ',
    'Pentru tan x=0 știm că sin x=0 și cos x≠0. Obținem x=kπ, unde k este orice întreg.',
    'Rezolvă tan x=1 în intervalul [0,2π).','π/4 și 5π/4.'],
   ['Complementary angle identities','Relații trigonometrice pentru unghiuri complementare',
    'Într-un triunghi dreptunghic, două unghiuri ascuțite au suma 90°. Cateta opusă unuia este alăturată celuilalt, ceea ce leagă sinusul de cosinus.',
    'sin(90°−x)=cos x',
    'Calculăm sin 30°=1/2 și cos 60°=1/2. Relația se explică fiindcă 30° și 60° sunt complementare, nu printr-o aproximație numerică.',
    'Exprimați cos(90°−x) în funcție de x.','sin x.']
  ],
  algebra:[
   ['Polynomial division by x-a','Împărțirea polinoamelor la x−a',
    'Când împărțim un polinom P(x) la x−a, câtul este un polinom, iar restul este numărul P(a). Verificăm rezultatul prin identitatea împărțirii.',
    'P(x)=(x−a)Q(x)+P(a)',
    'Împărțim x²−1 la x−1. Deoarece x²−1=(x−1)(x+1), câtul este x+1, iar restul zero.',
    'Ce rest are x²+2x+5 la împărțirea cu x−2?','P(2)=13.'],
   ['Solving product inequalities','Inecuații sub formă de produs',
    'Semnul unui produs depinde de semnele factorilor. Marcăm rădăcinile pe axă, analizăm fiecare interval și includem rădăcinile numai dacă semnul permite egalitatea.',
    '(x−2)(x+1)≤0 ⇒ x∈[−1,2]',
    'Produsul (x−2)(x+1) este negativ între −1 și 2, unde factorii au semne opuse. Fiind ≤0, includem ambele rădăcini.',
    'Rezolvă (x−3)(x+2)>0.','x<−2 sau x>3.']
  ],
  geometry:[
   ['Vector linear combination','Combinații liniare de vectori',
    'O combinație liniară a vectorilor folosește înmulțirea cu scalari și adunarea componentelor. În plan, operațiile se efectuează separat pentru cele două coordonate.',
    'a(u₁,u₂)+b(v₁,v₂)=(au₁+bv₁,au₂+bv₂)',
    'Cu u=(1,2) și v=(3,−1), calculăm 2u−v=(2,4)−(3,−1)=(−1,5). Verificăm fiecare componentă.',
    'u=(2,−1), v=(1,4). Calculează u+2v.','(4,7).']
  ],
  statistics:[
   ['Complementary probability','Probabilitatea evenimentului contrar',
    'Un eveniment și complementul său acoperă împreună toate rezultatele posibile și nu se pot produce simultan. De aceea probabilitățile lor însumează unu.',
    'P(non A)=1−P(A)',
    'Dacă probabilitatea ca un tren să întârzie este 0,15, probabilitatea ca el să nu întârzie este 1−0,15=0,85.',
    'Dacă P(A)=3/8, cât este P(non A)?','5/8.']
  ]
 },
 {
  analysis:[
   ['Continuity at a junction','Continuitate într-un punct de legătură',
    'Pentru o funcție definită prin formule diferite, continuitatea la un punct necesită egalitatea limitelor laterale și a valorii funcției. O simplă apropiere a graficului nu este suficientă.',
    'lim(x→a−)f(x)=f(a)=lim(x→a+)f(x)',
    'Dacă f(x)=x+1 pentru x<2 și f(x)=3 pentru x≥2, limita la stânga este 3, cea la dreapta este 3 și f(2)=3. Funcția este continuă.',
    'f(x)=x pentru x<1 și f(x)=3 pentru x≥1: este continuă la 1?','Nu; limita la stânga este 1, valoarea este 3.'],
   ['Derivative of a polynomial','Derivarea unui polinom',
    'Derivata este liniară și fiecare monom xⁿ se derivează în nxⁿ⁻¹. Termenul constant are derivata zero. Formula se aplică termen cu termen.',
    '(aₙxⁿ+…+a₀)′=naₙxⁿ⁻¹+…+a₁',
    'Pentru f(x)=3x³−2x²+5, derivăm succesiv: 9x²−4x+0. Așadar f′(x)=9x²−4x.',
    'Derivează f(x)=4x⁴−x.','f′(x)=16x³−1.'],
   ['Stationary points and derivatives','Puncte staționare și semnul derivatei',
    'Un punct interior unde derivata este zero poate fi maxim, minim sau niciuna dintre acestea. Studiem schimbarea semnului derivatei pe intervale pentru clasificare.',
    'f′(a)=0',
    'Pentru f(x)=x²−4x avem f′(x)=2x−4. Derivata trece de la negativ la pozitiv în x=2, deci f(2)=−4 este minim local.',
    'Clasifică punctul staționar pentru f(x)=−x².','x=0 este maxim local, valoarea 0.'],
   ['Chain rule for composite functions','Regula lanțului pentru funcții compuse',
    'Dacă o funcție este formată dintr-o funcție exterioară aplicată uneia interioare, derivăm exteriorul în argumentul său și înmulțim cu derivata interiorului.',
    '(f∘g)′(x)=f′(g(x))g′(x)',
    'Pentru h(x)=(2x+1)³, derivata exteriorului este 3(2x+1)², iar a interiorului este 2. Rezultă h′(x)=6(2x+1)².',
    'Derivează (3x−2)².','6(3x−2).']
  ],
  trigonometry:[
   ['Sine of a difference','Sinusul diferenței a două unghiuri',
    'Formula pentru diferență combină sinusul și cosinusul ambelor unghiuri. Este utilă la calculul exact al unor unghiuri care se exprimă ca diferențe.',
    'sin(a−b)=sin a cos b−cos a sin b',
    'Pentru sin(60°−30°) folosim √3/2·√3/2−1/2·1/2=3/4−1/4=1/2, în acord cu sin 30°.',
    'Calculează sin(90°−30°).','√3/2.'],
   ['Cosine double-angle identity','Cosinusul unghiului dublu',
    'Pornind de la formula cos(a+b), pentru a=b obținem o identitate în sinus și cosinus. Forma potrivită se alege după datele exercițiului.',
    'cos(2x)=cos²x−sin²x=2cos²x−1',
    'Dacă x=60°, cos(2x)=2·(1/2)²−1=−1/2, aceeași valoare ca cos 120°.',
    'Dacă cos x=3/5, află cos 2x.','2·9/25−1=−7/25.']
  ],
  statistics:[
   ['Expected count in repeated trials','Număr așteptat de apariții',
    'În n încercări cu aceeași probabilitate p, numărul mediu teoretic de apariții este np. Rezultatul poate fi neîntreg și nu reprezintă o garanție.',
    'E(X)=np',
    'Dacă un eveniment are probabilitatea 0,3 la fiecare probă, în 20 de probe numărul așteptat este 20·0,3=6, chiar dacă într-un experiment concret pot apărea alt număr.',
    'Un eveniment are p=0,2 în 50 de probe. Află E(X).','10.'],
   ['Sampling bias and representativeness','Eșantionarea și erorile de selecție',
    'Un eșantion reprezintă o populație numai dacă metoda de selecție nu favorizează sistematic un anumit grup. Un eșantion mare dar părtinitor poate induce o concluzie greșită.',
    'proporție observată = număr cazuri / dimensiune eșantion',
    'Un sondaj despre sport făcut numai la un club sportiv supraestimează interesul general. O selecție aleatoare dintre elevii întregii școli este mai reprezentativă.',
    'Este reprezentativ un sondaj despre transport făcut doar printre șoferi?','Nu: exclude preferințele celor care nu conduc.']
  ],
  algebra:[
   ['Argument of a complex number','Argumentul unui număr complex',
    'Un număr complex nenul poate fi privit ca un punct în plan. Argumentul este unghiul orientat al vectorului său față de axa reală pozitivă; trebuie identificat cadranul.',
    'z=r(cos θ+i sin θ)',
    'Pentru z=1+i avem r=√2 și coordonate egale pozitive. Argumentul principal este θ=π/4 radiani, deoarece punctul se află în cadranul întâi.',
    'Determină modulul și argumentul principal al lui z=i.','r=1, θ=π/2.']
  ],
  geometry:[
   ['Scalar projection onto a direction','Proiecția scalară a unui vector',
    'Proiecția scalară a lui u pe direcția unui vector v nenul măsoară componenta orientată a lui u de-a lungul lui v. Produsul scalar poate da rezultat negativ.',
    'comp_v(u)=(u·v)/|v|',
    'Pentru u=(3,4), v=(1,0), produsul scalar este 3, iar |v|=1. Componenta lui u pe axa Ox este 3.',
    'u=(−2,5), v=(0,1). Află proiecția scalară.','5.']
  ]
 },
 {
  analysis:[
   ['Definite integral of a polynomial','Integrarea definită a unui polinom',
    'O integrală definită se calculează evaluând o primitivă în capetele intervalului și scăzând rezultatele. Integrala semnată poate fi negativă.',
    '∫ₐᵇ f(x)dx=F(b)−F(a)',
    'Pentru ∫₀² 3x² dx, o primitivă este x³. Evaluăm 2³−0³=8. Verificăm că integrandul este pozitiv pe interval.',
    'Calculează ∫₁³ 2x dx.','[x²]₁³=9−1=8.'],
   ['Area between a line and x-axis','Aria dintre grafic și axa Ox',
    'Aria geometrică se determină din integrala valorii absolute a funcției când aceasta își schimbă semnul. Dacă funcția este pozitivă pe interval, aria este chiar integrala.',
    'A=∫ₐᵇ |f(x)|dx',
    'Pe [0,2], f(x)=x≥0, așa că aria de sub grafic este ∫₀² x dx=[x²/2]₀²=2.',
    'Află aria dintre y=−x și Ox pe [0,2].','∫₀² x dx=2.'],
   ['Average value of a function','Valoarea medie a unei funcții',
    'Valoarea medie pe un interval se obține împărțind integrala definită la lungimea intervalului. Ea nu este, în general, media aritmetică a valorilor la capete.',
    'f_med=(1/(b−a))∫ₐᵇ f(x)dx',
    'Pentru f(x)=x² pe [0,3], calculăm ∫₀³ x² dx=9, apoi împărțim la 3. Rezultă valoarea medie 3.',
    'Care este valoarea medie a lui f(x)=2x pe [0,4]?','4.'],
   ['Optimization under a linear constraint','Optimizare cu o condiție liniară',
    'Într-o problemă de optimizare exprimăm mărimea căutată printr-o singură variabilă folosind restricția. Apoi determinăm domeniul fizic și extremele.',
    'x+y=c ⇒ xy=x(c−x)',
    'Pentru două numere pozitive cu suma 10, produsul este P(x)=x(10−x). Parabola are maxim în x=5, deci produsul maxim este 25.',
    'Ce produs maxim au două numere pozitive cu suma 8?','16, pentru 4 și 4.']
  ],
  algebra:[
   ['Matrix transpose','Transpusa unei matrice',
    'Transpunerea unei matrice interschimbă liniile cu coloanele, fără a modifica valorile elementelor. Transpusa unei matrice de dimensiune m×n are dimensiunea n×m.',
    '(Aᵀ)ᵢⱼ=Aⱼᵢ',
    'Matricea A=[[1,2],[3,4],[5,6]] este 3×2. Transpusa Aᵀ=[[1,3,5],[2,4,6]], de dimensiune 2×3.',
    'Transpune matricea [[1,0],[−2,3]].','[[1,−2],[0,3]].'],
   ['Determinant and unique solution','Determinantul și unicitatea soluției',
    'Un sistem liniar pătratic cu determinantul matricei coeficienților diferit de zero are o soluție unică. Dacă determinantul este zero, trebuie verificat dacă există infinit de multe sau niciuna.',
    'det([[a,b],[c,d]])=ad−bc',
    'Matricea [[2,1],[1,3]] are determinantul 6−1=5, nenul. Orice sistem cu această matrice a coeficienților are soluție unică.',
    'Sistemul cu matricea [[1,2],[2,4]] are soluție unică?','Nu; determinantul 4−4=0.']
  ],
  statistics:[
   ['Standard score of an observation','Scorul standardizat al unei observații',
    'Scorul z exprimă câte abateri standard separă o valoare de media unei distribuții. El nu transformă automat datele într-o distribuție normală.',
    'z=(x−μ)/σ, σ>0',
    'Dacă media este 50, abaterea standard 10 și observația 70, scorul este (70−50)/10=2: valoarea este la două abateri standard peste medie.',
    'Cu μ=100 și σ=20, ce z are x=80?','z=−1.'],
   ['Correlation versus causation','Corelație și cauzalitate',
    'Două variabile pot varia împreună fără ca una să o determine pe cealaltă. Corelația descrie asocierea, iar demonstrarea cauzalității cere un raționament sau un studiu potrivit.',
    '−1≤r≤1 pentru corelația Pearson',
    'Vânzările de înghețată și numărul de scăldători pot crește simultan vara. Temperatura este o cauză comună posibilă; corelația nu dovedește că înghețata produce scăldatul.',
    'Dovedește r=0,8 că X îl cauzează pe Y?','Nu, indică doar o asociere liniară puternică.']
  ],
  geometry:[
   ['Distance to a plane with coordinate axis','Distanța de la un punct la un plan de coordonate',
    'În sistemul cartezian tridimensional, distanța de la un punct la planul Oxy este modulul coordonatei z. Formula se deduce din perpendiculara pe plan.',
    'd((x,y,z),Oxy)=|z|',
    'Punctul P(2,−1,5) se proiectează ortogonal pe Oxy în Q(2,−1,0). Segmentul PQ are lungimea |5|=5.',
    'Care este distanța de la (3,4,−7) la planul Oxy?','7.']
  ],
  functions:[
   ['Parameter in a quadratic function','Parametrul unei funcții pătratice',
    'Un parametru schimbă familia de grafice, nu este variabila după care evaluăm funcția. Poziția și numărul intersecțiilor cu axa Ox depind de discriminant.',
    'fₘ(x)=x²−2x+m, Δ=4−4m',
    'Pentru m=1, discriminantul este zero, deci parabola atinge axa Ox în x=1. Pentru m>1 discriminantul este negativ și nu există intersecții reale.',
    'Pentru ce m are fₘ două zerouri reale distincte?','m<1.']
  ]
 }
];
