// Original, field-independent university mathematics aids.
// The sequence is illustrative: national university years, programmes,
// ECTS modules and faculty specialisations differ. Do not advertise a single
// European syllabus or force four years on three-year bachelor degrees.
export const MATH_UNIVERSITY_2026_ADDITIONS=[
 {
  analysis:[
   ['Epsilon-delta definition of a limit','Definiția epsilon-delta a limitei',
    'Limita unei funcții într-un punct se definește prin controlul erorii valorilor funcției folosind apropierea argumentelor. Este necesar ca x să aparțină domeniului și să fie diferit de punctul studiat.',
    '∀ε>0 ∃δ>0: 0<|x−a|<δ ⇒ |f(x)−L|<ε',
    'Pentru f(x)=2x, a=3, L=6, alegem δ=ε/2. Atunci |2x−6|=2|x−3|<2δ=ε. Am verificat definiția.',
    'Pentru f(x)=3x la a=2 găsește o alegere δ în funcție de ε.','δ=ε/3.'],
   ['Cauchy sequences in real analysis','Șiruri Cauchy și completitudinea numerelor reale',
    'Un șir Cauchy are termeni oricât de apropiați între ei după un rang suficient de mare. În spațiile complete, fiecare șir Cauchy converge; această proprietate explică de ce R este adecvat pentru analiză.',
    '∀ε>0 ∃N ∀m,n≥N: |aₘ−aₙ|<ε',
    'Pentru aₙ=1/n, diferența |1/m−1/n|≤1/m+1/n≤2/N pentru m,n≥N. Alegem N>2/ε și obținem proprietatea Cauchy.',
    'Este șirul constant aₙ=7 un șir Cauchy?','Da; orice diferență dintre termeni este zero.']
  ],
  'linear-algebra':[
   ['Rank and the number of independent equations','Rangul unei matrici și ecuații independente',
    'Rangul este dimensiunea spațiului generat de coloanele unei matrici, egală cu numărul de pivoti din forma redusă. Sistemele compatibile impun același rang pentru matricea coeficienților și matricea extinsă.',
    'rang(A)=numărul pivotilor',
    'Matricea [[1,2],[2,4]] are a doua linie dublul primei; prin eliminare rămâne o singură linie nenulă, deci rangul este 1.',
    'Determină rangul matricii identitate de ordin 3.','3, deoarece toate cele trei coloane sunt independente.'],
   ['Change of basis in a plane','Schimbarea bazei în plan',
    'Coordonatele unui vector depind de baza aleasă, deși vectorul geometric rămâne același. Matricea cu vectorii noii baze în coloane transformă coordonate în baza canonică.',
    'v=P[v]ᴮ, unde P are coloanele bazei B',
    'Pentru baza B={(1,1),(1,−1)}, vectorul cu coordonate (2,1) în B este 2(1,1)+(1,−1)=(3,1) în baza canonică.',
    'Ce vector canonic corespunde coordonatelor (1,2) în aceeași bază?','(3,−1).']
  ],
  discrete:[
   ['Proof by contradiction','Demonstrația prin reducere la absurd',
    'O demonstrație prin contradicție presupune negarea concluziei și obține o imposibilitate din ipotezele problemei și din presupunere. Contradicția trebuie să fie una logică, nu doar un rezultat neașteptat.',
    'P ⇒ Q este echivalent cu imposibilitatea P ∧ ¬Q',
    'Pentru √2 irațional presupunem √2=p/q fracție ireductibilă. Ecuația p²=2q² face p par; înlocuind, devine par și q, contrazicând ireductibilitatea.',
    'Poate un număr întreg fi simultan par și impar?','Nu; ar contrazice definițiile parității.'],
   ['Equivalence relations and partitions','Relații de echivalență și partiții',
    'O relație de echivalență este reflexivă, simetrică și tranzitivă. Clasele sale formează o partiție: acoperă întreaga mulțime și sunt fie identice, fie disjuncte.',
    'a∼b ⇔ a−b este divizibil cu 3',
    'Pe numerele întregi, congruența modulo 3 grupează numerele după restul 0, 1 sau 2. De exemplu 4∼7 deoarece diferența este −3.',
    'Sunt echivalente 8 și 2 modulo 3?','Da; diferența 6 este divizibilă cu 3.']
  ]
 },
 {
  analysis:[
   ['Uniform and pointwise convergence','Convergență punctuală și uniformă',
    'Convergența punctuală permite ranguri N dependente de punctul x; convergența uniformă cere același N pentru toate punctele domeniului. Distincția este importantă la schimbul limitelor și integrării.',
    'supₓ|fₙ(x)−f(x)|→0 în convergența uniformă',
    'Pe [0,1], fₙ(x)=xⁿ converge punctual la 0 pentru x<1, dar la 1 rămâne 1. Limita nu este continuă, deci convergența nu este uniformă.',
    'Converge uniform fₙ(x)=1/n pe [0,1]?','Da; eroarea maximă este 1/n și tinde la zero.'],
   ['Directional derivatives and the gradient','Derivate direcționale și gradient',
    'Gradientul conține derivatele parțiale și indică direcția de creștere maximă locală a unei funcții diferențiabile. Derivata într-o direcție unitară se obține prin produsul scalar cu gradientul.',
    'Dᵤf=∇f·u, |u|=1',
    'Pentru f(x,y)=x²+3y, gradientul este (2x,3). În punctul (1,2), pe direcția (1,0), derivata direcțională este 2.',
    'Pentru aceeași funcție și punct, pe direcția (0,1) află derivata.','3.']
  ],
  'linear-algebra':[
   ['Orthogonal projection onto a line','Proiecția ortogonală pe o dreaptă vectorială',
    'Proiecția unui vector v pe direcția unui vector nenul u este componenta din direcția lui u. Vectorul rezidual este perpendicular pe u, fapt verificabil prin produsul scalar.',
    'projᵤ(v)=(v·u)/(u·u)u',
    'Pentru v=(3,4), u=(1,0), produsul scalar este 3 și u·u=1, deci proiecția este (3,0). Reziduul (0,4) este perpendicular.',
    'Proiectează v=(5,2) pe direcția u=(0,1).','(0,2).'],
   ['Diagonalisation of a symmetric matrix','Diagonalizarea unei matrici simetrice',
    'O matrice reală simetrică admite o bază ortonormală de vectori proprii. În această bază, matricea devine diagonală; coloanele matricii de schimbare sunt vectorii proprii.',
    'A=QDQᵀ, QᵀQ=I',
    'Matricea diagonală A=[[2,0],[0,5]] are deja vectorii canonici proprii cu valori proprii 2 și 5, deci putem lua Q=I și D=A.',
    'Care sunt valorile proprii ale diag(4,−1)?','4 și −1.']
  ],
  statistics:[
   ['Law of total probability','Formula probabilității totale',
    'Când evenimentele Bᵢ formează o partiție cu probabilități pozitive, probabilitatea lui A este media ponderată a probabilităților condiționate prin fiecare ramură. Nu adunăm probabilități condiționate fără ponderi.',
    'P(A)=Σᵢ P(A|Bᵢ)P(Bᵢ)',
    'Două mașini produc 40% și 60% din piese, cu defecte de 1% și 3%. Rata totală este 0,4×0,01+0,6×0,03=0,022, adică 2,2%.',
    'Dacă ponderile sunt 1/2 și 1/2, iar ratele 2% și 4%, află rata totală.','3%.'],
   ['Chebyshev inequality','Inegalitatea lui Cebîșev',
    'Inegalitatea limitează probabilitatea abaterilor mari de la medie folosind numai varianța finită. Nu presupune distribuție normală și oferă o bornă, nu valoarea exactă.',
    'P(|X−μ|≥kσ)≤1/k², k>0',
    'Pentru k=2, probabilitatea abaterii de cel puțin două deviații standard este cel mult 1/4; cel puțin 75% se află în intervalul complementar.',
    'Ce bornă oferă inegalitatea pentru abatere ≥3σ?','Cel mult 1/9.']
  ]
 },
 {
  differential:[
   ['Second-order homogeneous linear ODE','Ecuații diferențiale liniare omogene de ordinul doi',
    'O ecuație cu coeficienți constanți se poate rezolva folosind ecuația caracteristică. Pentru două rădăcini reale distincte obținem două soluții exponențiale independente.',
    'y″+ay′+by=0; r²+ar+b=0',
    'Pentru y″−3y′+2y=0, ecuația r²−3r+2=0 are rădăcinile 1 și 2. Soluția generală este C₁eˣ+C₂e²ˣ.',
    'Scrie soluția generală pentru y″−y=0.','C₁eˣ+C₂e⁻ˣ.'],
   ['Euler method and numerical stability','Metoda Euler și eroarea numerică',
    'Metoda Euler aproximează soluția unei ecuații diferențiale din pantă, folosind pași discreți. Pasul prea mare poate amplifica eroarea; estimarea calității cere comparații între mai multe dimensiuni de pas.',
    'yₙ₊₁=yₙ+h f(tₙ,yₙ)',
    'Pentru y′=y, y(0)=1 și h=0,1, primul pas oferă y₁=1+0,1×1=1,1, față de e^0,1≈1,10517.',
    'Pentru y′=2, y(0)=3 și h=0,5, află y₁.','4.']
  ],
  analysis:[
   ['Fourier series of a simple periodic function','Serii Fourier și coeficienți',
    'O funcție periodică integrabilă poate fi analizată prin componente sinusoidale. Coeficienții Fourier se obțin prin integrarea pe o perioadă, iar convergența punctuală depinde de regularitatea funcției.',
    'aₙ=(1/π)∫₋π^π f(x)cos(nx)dx; bₙ=(1/π)∫₋π^π f(x)sin(nx)dx',
    'Pentru f(x)=sin x, ortogonalitatea oferă b₁=1 și restul coeficienților armonici zero, deci seria Fourier reproduce sin x.',
    'Ce coeficient b₁ are f(x)=3sin x?','3.'],
   ['Complex analytic functions and Cauchy-Riemann','Condițiile Cauchy-Riemann',
    'Pentru f(z)=u(x,y)+iv(x,y), derivabilitatea complexă implică relațiile Cauchy-Riemann în condiții adecvate. Derivabilitatea complexă este mai restrictivă decât derivabilitatea reală separată.',
    'uₓ=vᵧ și uᵧ=−vₓ',
    'Pentru f(z)=z²=(x²−y²)+i(2xy), avem uₓ=2x=vᵧ și uᵧ=−2y=−vₓ, deci relațiile sunt respectate.',
    'Verifică uₓ=vᵧ pentru f(z)=z.','Ambele sunt 1.']
  ],
  discrete:[
   ['Dijkstra algorithm invariant','Invariantul algoritmului Dijkstra',
    'Într-un graf cu ponderi nenegative, când un vârf cu distanță minimă provizorie este extras, distanța sa este definitivă. Ponderile negative pot invalida această proprietate și impun alt algoritm.',
    'd(v)←min(d(v),d(u)+w(u,v))',
    'Cu A→B cost 4, A→C cost 1, C→B cost 2, drumul minim de la A la B trece prin C și costă 1+2=3.',
    'Care este costul minim pentru același graf de la A la C?','1.'],
   ['Master theorem for divide and conquer','Teorema master pentru recurențe',
    'Recurențele algoritmilor de tip divide-et-impera pot fi comparate cu creșterea n la puterea logaritmului numărului de subprobleme în baza factorului de micșorare. Ipotezele teoremei trebuie verificate.',
    'T(n)=aT(n/b)+f(n), cu a≥1,b>1',
    'Pentru T(n)=2T(n/2)+n, avem n^(log₂2)=n; costul suplimentar este de același ordin, deci T(n)=Θ(n log n).',
    'Care este ordinul lui T(n)=2T(n/2)+1?','Θ(n).']
  ]
 },
 {
  analysis:[
   ['Gradient descent for minimisation','Coborârea pe gradient pentru minimizare',
    'Coborârea pe gradient actualizează iterativ parametrii în direcția opusă gradientului pentru a micșora o funcție obiectiv. Alegerea pasului de învățare este importantă: un pas prea mare poate face metoda să oscileze sau să diverge.',
    'xₙ₊₁=xₙ−η∇f(xₙ), η>0',
    'Pentru f(x)=x², derivata este 2x. Cu x₀=4 și η=0,25, actualizăm x₁=4−0,25×8=2. Valoarea funcției scade de la 16 la 4.',
    'Pentru f(x)=x², x₀=6 și η=0,25, află x₁.','x₁=3.'],
   ['Newton method and a stopping criterion','Metoda Newton și criteriul de oprire',
    'Metoda Newton folosește tangenta pentru a aproxima o rădăcină. Ea cere o derivată nenulă în iterație și poate eșua fără o alegere potrivită a punctului inițial; oprirea după puțini pași nu garantează precizia.',
    'xₙ₊₁=xₙ−f(xₙ)/f′(xₙ)',
    'Pentru f(x)=x²−2 și x₀=1, obținem x₁=1−(−1)/2=1,5. Următorul pas oferă 1,4167, mai aproape de √2.',
    'Fă primul pas pentru f(x)=x²−9 cu x₀=4.','x₁=4−7/8=3,125.']
  ],
  statistics:[
   ['Confidence interval interpretation','Interpretarea corectă a unui interval de încredere',
    'În interpretarea frecventistă, nivelul de încredere caracterizează proporția intervalelor construite prin procedură care acoperă parametrul în eșantionări repetate. Nu afirmă o probabilitate posterioră a parametrului fix.',
    'IC(μ): x̄ ± zα/2 σ/√n, când modelul o permite',
    'La x̄=50, σ=10, n=100 și z=1,96 avem o marjă 1,96 și intervalul [48,04;51,96]. Ipotezele de eșantionare sunt obligatorii.',
    'Pentru σ=8, n=64, z=2 găsește marja.','2.'],
   ['Type I and Type II test errors','Erorile de tip I și II în testare',
    'Eroarea de tip I înseamnă respingerea unei ipoteze nule adevărate; eroarea de tip II înseamnă nerespingerea unei ipoteze nule false. Puterea testului este unu minus probabilitatea erorii de tip II.',
    'α=P(respingem H₀ | H₀ adevărată); putere=1−β',
    'Dacă β=0,2 atunci puterea testului este 0,8. Reducerea pragului α poate reduce alarmele false, dar de regulă afectează și puterea pentru eșantion fix.',
    'Cu β=0,35 află puterea testului.','0,65.']
  ],
  discrete:[
   ['Network flow and a minimum cut','Flux maxim și tăietură minimă într-o rețea',
    'Capacitatea unei tăieturi este suma capacităților arcelor care ies din partea sursei către complement. Pentru rețele valide, valoarea fluxului maxim este egală cu capacitatea tăieturii minime.',
    'valoare(flux maxim)=capacitate(tăietură minimă)',
    'Într-o rețea cu singura cale s→t de capacitate 5, fluxul maxim este 5: nu putem trimite mai mult pe acel arc, iar fluxul 5 este realizabil.',
    'Ce flux maxim are o singură muchie s→t de capacitate 9?','9.'],
   ['Dynamic programming optimal substructure','Programare dinamică și substructură optimă',
    'Programarea dinamică este utilă când o problemă are subprobleme suprapuse și soluții optime construibile din soluțiile subproblemelor. Memorăm rezultate pentru a evita recalcularea recursivă.',
    'Fₙ=Fₙ₋₁+Fₙ₋₂, F₀=0,F₁=1',
    'Pentru șirul Fibonacci calculăm F₂=1, F₃=2, F₄=3, F₅=5, reutilizând valorile deja obținute în loc să reluăm aceleași ramuri.',
    'Determină F₆ din aceleași condiții inițiale.','8.']
  ]
 }
];
