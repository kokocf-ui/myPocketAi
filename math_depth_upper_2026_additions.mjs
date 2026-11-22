// Original additional upper-secondary study material, phases 1–4.
// General European study aids, NOT a national course, a chosen high-school
// profile, or a statement that these chapters are mandatory in this year.
// Romanian 2026/27 cohort reform applies only to class IX; grades X–XII remain
// on previous applicable programmes. Do not reuse this advisory order as proof.
export const MATH_UPPER_2026_ADDITIONS = [
 {
  algebra:[
   ['Propositional logic and truth tables','Propoziții logice și tabele de adevăr',
    'O propoziție matematică este o afirmație cu valoare de adevăr. Conjuncția cere două propoziții adevărate, iar implicația este falsă numai când premisa este adevărată și concluzia falsă. Cuantificatorii schimbă sensul afirmațiilor.',
    'p ∧ q este adevărat numai dacă p și q sunt adevărate',
    'Luăm p: 4 este par și q: 4>5. Prima este adevărată, a doua este falsă, deci p∧q este fals. Negarea lui p∧q este adevărată.',
    'Determină adevărul pentru p∨q în același exemplu.','Adevărat; cel puțin p este adevărat.'],
   ['Induction and an arithmetic sum','Inducția matematică și suma primelor numere',
    'Inducția dovedește o proprietate pentru fiecare număr natural de la un rang dat: verificăm cazul inițial și arătăm că adevărul pentru n implică adevărul pentru n+1. Pasul inductiv nu poate înlocui baza.',
    '1+2+…+n=n(n+1)/2',
    'Pentru n=1 obținem 1=1. Presupunem suma n(n+1)/2; adăugând n+1 obținem (n+1)(n+2)/2, formula pentru următorul rang.',
    'Aplică formula pentru suma numerelor de la 1 la 12.','12×13/2=78.']
  ],
  functions:[
   ['Graph reading: zeros and monotonicity','Citirea unui grafic: zerouri și monotonie',
    'Zerourile sunt abscisele unde graficul întâlnește axa Ox. Monotonia se decide citind cum se modifică ordonata când abscisa crește; nu trebuie confundată cu semnul valorilor funcției.',
    'f(x)=0 în punctele de intersecție cu Ox',
    'Pentru f(x)=2x−6, graficul taie axa Ox la x=3 și este crescător deoarece panta este pozitivă. Funcția este negativă pentru x<3.',
    'Identifică zeroul și monotonia lui g(x)=−x+5.','Zeroul este x=5; funcția este descrescătoare.'],
   ['Arithmetic progressions and budgeting','Progresii aritmetice și bugetul lunar',
    'Într-o progresie aritmetică, diferența dintre termeni consecutivi este constantă. Modelul este potrivit pentru o creștere cu aceeași sumă la fiecare pas, nu pentru un procent constant.',
    'aₙ=a₁+(n−1)d; Sₙ=n(a₁+aₙ)/2',
    'O economisire de 30 lei în prima lună crește cu 10 lei lunar. În luna a patra sunt 60 lei, iar suma pe primele patru luni este (30+60)×4/2=180 lei.',
    'Pentru a₁=4 și d=3 află termenul al șaselea.','a₆=4+5×3=19.']
  ],
  geometry:[
   ['Midpoint and distance in the plane','Mijlocul segmentului și distanța în plan',
    'Coordonatele mijlocului sunt mediile coordonatelor capetelor. Distanța dintre două puncte rezultă din teorema lui Pitagora pe diferențele coordonatelor, nu din suma simplă a acestora.',
    'M=((x₁+x₂)/2,(y₁+y₂)/2); AB=√((x₂−x₁)²+(y₂−y₁)²)',
    'Pentru A(1,2), B(5,5), mijlocul este (3; 3,5), iar lungimea AB este √(16+9)=5.',
    'Calculează mijlocul și distanța dintre (0,0) și (6,8).','M=(3,4), distanța 10.'],
   ['Parallel and perpendicular lines','Drepte paralele și perpendiculare',
    'Două drepte neverticale sunt paralele dacă au aceeași pantă. Sunt perpendiculare dacă produsul pantelor este minus unu; cazul dreptelor verticale și orizontale se tratează separat.',
    'm₁=m₂ pentru paralele; m₁m₂=−1 pentru perpendiculare',
    'Dreapta y=2x+1 este perpendiculară pe y=−x/2+4 deoarece 2×(−1/2)=−1. Intersecțiile cu Oy nu influențează perpendicularitatea.',
    'Sunt paralele y=3x+1 și y=3x−7?','Da, au aceeași pantă 3.']
  ],
  statistics:[
   ['Interpreting scatter diagrams','Interpretarea diagramelor de dispersie',
    'O diagramă de dispersie reprezintă perechi de observații. Un nor ascendent sugerează asociere pozitivă, dar nu demonstrează cauzalitate; valorile extreme și unitățile trebuie examinate separat.',
    'Perechi de date (xᵢ,yᵢ), i=1,…,n',
    'Punctele (1,2), (2,4), (3,6) sunt aliniate ascendent: când x crește cu 1, y crește cu 2. Această regularitate nu spune singură de ce apar datele.',
    'Ce tip de asociere au (1,5), (2,4), (3,3)?','Asociere negativă descendentă.']
  ]
 },
 {
  functions:[
   ['Inverse functions and restrictions','Funcții inverse și restricții de domeniu',
    'O funcție are inversă dacă este bijectivă pe domeniul și codomeniul alese. Pentru o parabolă pe întreaga axă reală inversa nu este funcție, dar restrângerea domeniului poate face inversarea posibilă.',
    'f(x)=2x+3 ⇒ f⁻¹(y)=(y−3)/2',
    'Pornind de la y=2x+3 izolăm x=(y−3)/2. Verificăm f⁻¹(f(4))=(11−3)/2=4, condiție esențială a inversei.',
    'Găsește inversa lui f(x)=3x−6 pe R.','f⁻¹(x)=(x+6)/3.'],
   ['Logarithm equations and domains','Ecuații logaritmice și domenii',
    'Logaritmul real necesită bază pozitivă diferită de unu și argument strict pozitiv. Transformarea în puteri este permisă numai după controlul domeniului; soluțiile inadmisibile se elimină.',
    'log₂x=3 ⇔ x=2³, x>0',
    'Pentru log₃(x−1)=2 impunem x>1. Rezolvăm x−1=9, deci x=10, care respectă condiția.',
    'Rezolvă log₂(x+4)=3.','x=4, deoarece x+4=8 și x>−4.']
  ],
  trigonometry:[
   ['Sine and cosine on the unit circle','Sinus și cosinus pe cercul unitate',
    'Pe cercul de rază unu, cosinusul este coordonata orizontală și sinusul este coordonata verticală. Semnele lor depind de cadran și trebuie verificate înainte de extragerea rădăcinilor.',
    'sin²t+cos²t=1',
    'Pentru t=π/3, punctul de pe cerc are coordonatele (1/2,√3/2). Suma pătratelor este 1/4+3/4=1.',
    'Calculează sin(π/6) și cos(π/6).','1/2 și √3/2.'],
   ['Sine rule in oblique triangles','Teorema sinusurilor în triunghiuri oarecare',
    'În orice triunghi, raportul dintre lungimea unei laturi și sinusul unghiului opus este constant. Formula este utilă dacă știm o pereche latură–unghi opus și încă un unghi ori o latură.',
    'a/sin A=b/sin B=c/sin C',
    'Cu A=30°, B=90° și a=5, avem b=5×sin90°/sin30°=10. Condiția este ca datele să descrie un triunghi posibil.',
    'Cu A=30°, B=90° și a=3 află b.','b=6.']
  ],
  algebra:[
   ['Polynomial remainder theorem','Teorema restului polinomial',
    'Restul împărțirii polinomului P(x) la x−a este P(a). Un polinom este divizibil cu x−a exact atunci când P(a)=0. Regula nu cere efectuarea împărțirii complete.',
    'P(x)=(x−a)Q(x)+P(a)',
    'Pentru P=x²−5x+6 și a=2, calculăm P(2)=4−10+6=0. Astfel x−2 este factor, iar celălalt este x−3.',
    'Află restul lui P(x)=x³+2 la împărțirea prin x−1.','P(1)=3.'],
   ['Rational inequalities and sign charts','Inecuații raționale și tabelul semnelor',
    'O fracție algebrică își poate schimba semnul la zerourile numărătorului sau la punctele interzise ale numitorului. Construim tabel de semne și nu includem niciodată zerourile numitorului.',
    '(x−1)/(x+2)>0, x≠−2',
    'Punctele critice sunt −2 și 1. Fracția este pozitivă pe (−∞,−2) și (1,∞), iar x=−2 nu aparține domeniului.',
    'Rezolvă (x−2)/(x+1)>0.','x∈(−∞,−1)∪(2,∞).']
  ],
  geometry:[
   ['Intersections of a circle with the x-axis','Intersecțiile cercului cu axa Ox',
    'Pentru a afla intersecțiile unui cerc cu axa Ox, rezolvăm simultan ecuația cercului și condiția y=0. Rădăcinile reale ale ecuației obținute dau abscisele punctelor comune; fără rădăcini reale nu există intersecții.',
    '(x−a)²+b²=r² atunci când y=0',
    'Pentru cercul (x−1)²+(y+2)²=9, punem y=0 și obținem (x−1)²=5. Intersecțiile cu Ox sunt (1−√5,0) și (1+√5,0).',
    'Determină intersecțiile cercului x²+y²=25 cu Ox.','(−5,0) și (5,0).']
  ],
  statistics:[
   ['Conditional probability in a table','Probabilități condiționate din tabel',
    'Probabilitatea condiționată restrânge spațiul de rezultate la evenimentul despre care știm că s-a produs. Trebuie să împărțim probabilitatea intersecției la cea a evenimentului condiționant nenul.',
    'P(A|B)=P(A∩B)/P(B), P(B)>0',
    'Din 20 de elevi, 12 au participat la club, iar 8 dintre aceștia au promovat testul. Probabilitatea promovării știind participarea este 8/12=2/3.',
    'Din 15 participanți, 9 au venit la toate ședințele. Ce fracție condiționată?','9/15=3/5.']
  ]
 },
 {
  analysis:[
   ['Continuity at a removable hole','Continuitate și discontinuitate eliminabilă',
    'Limita poate exista într-un punct chiar dacă funcția nu este definită în acel punct. O discontinuitate este eliminabilă atunci când putem atribui valoarea limitei astfel încât funcția completată să devină continuă.',
    'lim(x→a)f(x)=L; definim f(a)=L',
    'Pentru (x²−1)/(x−1), x≠1, simplificăm la x+1. Limita în 1 este 2; dacă definim f(1)=2, obținem o funcție continuă.',
    'Determină limita (x²−4)/(x−2) când x→2.','4.'],
   ['Product and quotient derivative rules','Regulile de derivare ale produsului și raportului',
    'Derivata produsului nu este produsul derivatelor. Pentru raport, numitorul trebuie să fie nenul. Aplicăm formulele înainte de înlocuirea unei valori numerice și simplificăm rezultatul.',
    '(fg)′=f′g+fg′; (f/g)′=(f′g−fg′)/g²',
    'Pentru f(x)=x²sin x, avem f′=2x sin x+x²cos x. Derivarea separată a celor doi factori și înmulțirea directă ar da un răspuns greșit.',
    'Derivează x²eˣ.','2xeˣ+x²eˣ.']
  ],
  trigonometry:[
   ['Trigonometric identities in equations','Identități trigonometrice în ecuații',
    'În rezolvarea ecuațiilor trigonometrice putem folosi identitatea fundamentală pentru a exprima o funcție prin cealaltă. Transformările nu trebuie să introducă împărțire la zero sau să piardă soluții.',
    '1−cos²x=sin²x',
    'Pentru 2sin²x−1=0 avem sin²x=1/2, deci în [0,2π) obținem x=π/4, 3π/4, 5π/4, 7π/4.',
    'Rezolvă cos²x=1 pentru x∈[0,2π).','x=0 sau x=π.']
  ],
  statistics:[
   ['Combinations without repetition','Combinări fără repetiție',
    'Combinările numără selecțiile neordonate de k obiecte distincte din n. O schimbare a ordinii nu generează altă selecție. Formula necesită numere întregi cu 0≤k≤n.',
    'C(n,k)=n!/[k!(n−k)!]',
    'Din 6 persoane alegem o echipă de 2. Există C(6,2)=6×5/2=15 echipe, nu 30, deoarece ordinea membrilor nu contează.',
    'Câte echipe de 3 alegi din 5 persoane?','C(5,3)=10.'],
   ['Bayes rule for screening tests','Formula lui Bayes pentru testări',
    'Formula lui Bayes actualizează probabilitatea unei ipoteze când apare o observație. Rata rezultatelor pozitive false și frecvența inițială a cazurilor contează împreună; un test pozitiv nu echivalează automat cu certitudine.',
    'P(H|E)=P(E|H)P(H)/P(E)',
    'Dacă P(H)=0,1, sensibilitatea 0,8 și P(E|non-H)=0,2, atunci P(E)=0,08+0,18=0,26, iar P(H|E)=0,08/0,26≈0,308.',
    'Cu P(H)=1/2, P(E|H)=1 și P(E|non-H)=1/2, află P(H|E).','2/3.']
  ],
  algebra:[
   ['Complex modulus and conjugates','Modulul și conjugatul numerelor complexe',
    'Conjugatul schimbă semnul părții imaginare. Produsul dintre un număr complex și conjugatul său este pătratul modulului, un număr real nenegativ; relația ajută la împărțiri.',
    '|a+bi|=√(a²+b²); z·z̄=|z|²',
    'Pentru z=3+4i avem |z|=5 și z̄=3−4i. Produsul este 9+16=25, în acord cu formula modulului.',
    'Determină modulul lui z=5−12i.','13.']
  ],
  functions:[
   ['Composite functions and derivative chain','Funcții compuse și regula lanțului',
    'La derivarea unei funcții compuse derivăm funcția exterioară în argumentul interior și înmulțim cu derivata interiorului. Regula este esențială pentru puteri și funcții trigonometrice compuse.',
    '[f(g(x))]′=f′(g(x))g′(x)',
    'Pentru h(x)=(3x+1)⁴ obținem h′=4(3x+1)³×3=12(3x+1)³. Factorul 3 nu poate fi omis.',
    'Derivează (2x−1)³.','6(2x−1)².']
  ],
  geometry:[
   ['Dot product and the angle between vectors','Produsul scalar și unghiul dintre vectori',
    'Produsul scalar este suma produselor componentelor corespunzătoare și este legat de cosinusul unghiului dintre vectori. Doi vectori nenuli sunt perpendiculari exact când produsul scalar este zero.',
    'u·v=u₁v₁+u₂v₂=|u||v|cosθ',
    'Pentru u=(1,2), v=(2,−1), produsul este 2−2=0. Deoarece ambii sunt nenuli, vectorii sunt perpendiculari.',
    'Calculează (2,3)·(4,−1).','8−3=5.']
  ]
 },
 {
  analysis:[
   ['Substitution in composite integrals','Substituția în integralele funcțiilor compuse',
    'Metoda substituției schimbă variabila de integrare pentru a recunoaște o primitivă a unei funcții compuse. Substituția este justificată când identificăm atât expresia interioară cât și derivata ei, inclusiv factorul numeric.',
    '∫f(g(x))g′(x)dx=F(g(x))+C, dacă F′=f',
    'În ∫2x cos(x²)dx alegem u=x², du=2x dx. Integrala devine ∫cos u du=sin u+C, deci sin(x²)+C.',
    'Calculează ∫3x² e^(x³)dx.','e^(x³)+C.'],
   ['Definite integrals and accumulated change','Integrale definite și variație acumulată',
    'Integrala definită exprimă acumularea semnată a unei mărimi variabile. Dacă funcția este negativă pe un interval, contribuția sa este negativă; aria geometrică nu se confundă cu integrala semnată.',
    '∫ₐᵇ f(x)dx=F(b)−F(a), dacă F′=f',
    'Pentru f(x)=2x pe [0,3], o primitivă este x². Calculăm F(3)−F(0)=9−0=9 unități pătrate semnate.',
    'Calculează ∫₀² 3x²dx.','[x³]₀²=8.']
  ],
  algebra:[
   ['Matrix multiplication and dimensions','Înmulțirea matricilor și dimensiunile',
    'Produsul AB există dacă numărul coloanelor lui A este egal cu numărul liniilor lui B. Fiecare element rezultat este produsul scalar dintre o linie și o coloană; în general AB nu este BA.',
    '(AB)ᵢⱼ=Σₖ aᵢₖbₖⱼ',
    'Pentru A=[[1,2],[0,1]] și B=[[2,0],[3,1]], produsul AB=[[8,2],[3,1]]. Verificăm fiecare intrare prin înmulțire și adunare.',
    'Calculează prima intrare din AB pentru liniile (2,1), coloana (3,4).','2×3+1×4=10.']
  ],
  statistics:[
   ['Bernoulli trials and expectation','Încercări Bernoulli și speranță',
    'O încercare Bernoulli are succes sau eșec. Pentru n încercări independente cu aceeași probabilitate p, numărul succeselor are distribuție binomială, cu medie np și varianță np(1−p).',
    'X∼Bin(n,p); E(X)=np; Var(X)=np(1−p)',
    'La 20 aruncări independente de monedă echilibrată, numărul de fețe are media 10 și varianța 20×0,5×0,5=5.',
    'Pentru 10 încercări cu p=0,2, află E(X).','2.'],
   ['Normal approximation and z-score','Scorul standardizat și aproximația normală',
    'Scorul z arată câte abateri standard despart o observație de medie. Interpretarea prin distribuția normală presupune o justificare a modelului; scorul z în sine nu dovedește normalitate.',
    'z=(x−μ)/σ, σ>0',
    'La medie 100 și abatere standard 15, valoarea 130 are z=(130−100)/15=2. Este situată la două abateri standard peste medie.',
    'Află z pentru x=70, μ=100, σ=10.','−3.']
  ],
  functions:[
   ['Function asymptotes by limits','Asimptote prin limite',
    'O asimptotă verticală poate apărea când funcția tinde la infinit în apropierea unei valori finite. Una orizontală corespunde unei limite finite la infinit; ambele cer analiza domeniului.',
    'lim(x→∞)f(x)=L ⇒ y=L este asimptotă orizontală',
    'Pentru f(x)=1/(x−2)+3 avem asimptotă verticală x=2 și orizontală y=3. La x apropiat de 2 valorile cresc în modul.',
    'Găsește asimptota orizontală a 4+1/x.','y=4.']
  ],
  trigonometry:[
   ['Trigonometric periodicity and general solutions','Periodicitate și soluții trigonometrice generale',
    'Funcțiile sin și cos au perioada 2π, iar tangenta are perioada π. După rezolvarea pe o perioadă, soluțiile generale se scriu prin translatare cu perioada, nu numai printr-o listă finită.',
    'sin x=0 ⇒ x=kπ, k∈Z',
    'Pentru cos x=1 obținem x=2kπ cu k întreg. Rezultatul x=0 singur ar pierde toate soluțiile obținute prin adăugarea unei perioade.',
    'Rezolvă tan x=0 pe domeniul său.','x=kπ, k∈Z.']
  ],
  geometry:[
   ['Volume from a cross-sectional area','Volum din aria secțiunilor',
    'Un solid cu secțiuni transversale de arie variabilă A(x) poate avea volumul calculat prin integrarea acestei arii. Este necesar să precizăm intervalul și unitățile geometrice.',
    'V=∫ₐᵇ A(x)dx',
    'Un cilindru cu secțiune constantă A=πr² și înălțime h are V=∫₀ʰ πr²dx=πr²h, formula cunoscută a cilindrului.',
    'Găsește volumul cilindrului cu r=2, h=3.','12π.']
  ]
 }
];
