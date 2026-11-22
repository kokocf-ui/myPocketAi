// Structured high-school mathematics study cards for upper-secondary stages.
// General teaching material: do not label these as official national syllabi.
export const MATH_DEPTH_UPPER=[
 {
 algebra:[
 ['Real numbers and order','Numere reale și relații de ordine','Mulțimea numerelor reale conține numere raționale și iraționale. Comparația se face pe axă; pentru expresii cu radicali trebuie respectate condițiile de existență.','√25 = 5; −2 < √2 < 2','Comparam √2 și 1,5: pătratele pozitive sunt 2 și 2,25, deci √2 < 1,5.','Simplifică √49 + 2 și compară √9 cu 2,5.','9; √9 = 3 > 2,5.'],
 ['Ecuații și sisteme liniare','Ecuațiile liniare pot fi rezolvate prin transformări echivalente. În sistemele cu mai multe necunoscute, verificăm toate ecuațiile pentru soluția găsită.','2x + 5 = 17 ⇒ x = 6','Scădem 5: 2x = 12. Împărțim la 2: x = 6. Înlocuirea confirmă 2 × 6 + 5 = 17.','Rezolvă 5x − 4 = 21 și sistemul x + y = 7, x − y = 1.','x = 5; pentru sistem x = 4, y = 3.'],
 ['Ecuația de gradul al doilea','Pentru ax² + bx + c = 0, cu a nenul, calculăm discriminantul. Semnul său indică numărul rădăcinilor reale, iar fiecare soluție se verifică prin substituție.','Δ = b² − 4ac; x = (−b ± √Δ)/(2a)','Rezolvăm x² − 5x + 6 = 0. Avem Δ = 25 − 24 = 1, deci x = (5 ± 1)/2: rădăcinile sunt 2 și 3.','Rezolvă x² − 9 = 0.','x = −3 sau x = 3.']
 ],
 functions:[
 ['Funcție și domeniu','O funcție asociază fiecărui argument din domeniu exact o valoare. Domeniul poate exclude valori care duc la împărțire prin zero sau la radical din număr negativ.','f(x) = 1/(x − 2), x ≠ 2','În f(x) = 1/(x − 2), valoarea 2 este interzisă. Pentru x = 3, obținem 1; pentru x = 1, obținem −1.','Determină domeniul lui g(x) = 5/(x + 4).','Toate numerele reale, cu excepția lui −4.'],
 ['Funcția liniară și panta','Graficul funcției f(x) = ax + b este o dreaptă. Coeficientul a descrie variația lui f când x crește cu o unitate; b este intersecția cu axa verticală.','f(x) = 2x + 1','Pentru x = 0,1,2 obținem 1,3,5. Punctele (0,1), (1,3), (2,5) sunt coliniare; dreapta are panta 2.','Care este panta și ordonata la origine pentru y = −3x + 4?','Panta −3; ordonata la origine 4.'],
 ['Funcția pătratică și vârful parabolei','Funcția f(x) = ax² + bx + c, a nenul, are grafic de tip parabolă. Abscisa vârfului este −b/(2a); semnul lui a indică orientarea.','x_v = −b/(2a)','Pentru f(x) = x² − 4x + 3 avem x_v = 2 și f(2) = −1. Vârful este (2, −1), iar parabola se deschide în sus.','Află abscisa vârfului pentru f(x) = 2x² + 8x + 1.','−2.']
 ],
 geometry:[
 ['Puncte și vectori în plan','Un vector are direcție, sens și modul. În coordonate, diferența dintre punctele finale dă componentele vectorului; modulul se determină cu Pitagora.','AB = (x_B − x_A, y_B − y_A)','Pentru A(1,2) și B(4,6), vectorul AB = (3,4) și are lungimea √(3² + 4²) = 5.','Calculează vectorul de la P(2,1) la Q(5,5).','(3,4), modul 5.'],
 ['Distanța între două puncte','Formula distanței în plan se obține construind un triunghi dreptunghic cu catetele paralele cu axele. Lungimea nu poate fi negativă.','d = √((x₂ − x₁)² + (y₂ − y₁)²)','Pentru A(−1,1) și B(2,5): Δx = 3, Δy = 4, deci d = √25 = 5.','Află distanța dintre (0,0) și (6,8).','10.'],
 ['Ecuația unei drepte','O dreaptă neverticală poate fi scrisă y = mx + n. Panta dintre două puncte distincte cu abscise diferite este raportul variațiilor coordonatelor.','m = (y₂ − y₁)/(x₂ − x₁)','Pentru A(1,2), B(3,6), panta este (6 − 2)/(3 − 1) = 2. Folosind A, rezultă y = 2x.','Determină panta dintre (0,1) și (2,7).','3.']
 ]
 },
 {
 functions:[
 ['Compunerea funcțiilor','Compunerea aplică mai întâi funcția interioară și apoi funcția exterioară. Domeniul compunerii este restrâns la argumentele pentru care ambele operații sunt definite.','(f ∘ g)(x) = f(g(x))','Dacă f(x)=2x+1 și g(x)=x², atunci (f ∘ g)(x)=2x²+1; în schimb (g ∘ f)(x)=(2x+1)².','Calculează f(g(3)) pentru f(x)=x−4, g(x)=2x.','2.'],
 ['Funcția inversă','O funcție inversabilă trebuie să fie injectivă pe domeniul ales și să aibă imaginea potrivită drept codomeniu. Funcția inversă schimbă rolurile dintre argument și valoare.','f(x)=3x−2 ⇒ f⁻¹(y)=(y+2)/3','Punem y=3x−2 și izolăm x=(y+2)/3. Verificăm f(f⁻¹(7))=7.','Determină inversa lui f(x)=x+5 pe numere reale.','f⁻¹(x)=x−5.'],
 ['Exponențiale și logaritmi','Logaritmul în baza a este exponentul la care ridicăm a pentru a obține numărul. Baza trebuie să fie pozitivă și diferită de 1; argumentul este pozitiv.','log₂8=3 deoarece 2³=8','Rezolvăm 3^x = 27 observând 27=3³, deci x=3. Din log₁₀100=2 rezultă același principiu invers.','Calculează log₂16 și rezolvă 5^x = 125.','4; x=3.']
 ],
 trigonometry:[
 ['Sinus și cosinus în triunghi dreptunghic','Pentru un unghi ascuțit al unui triunghi dreptunghic, sinusul este cateta opusă împărțită la ipotenuză, iar cosinusul este cateta alăturată împărțită la ipotenuză.','sin α = opusă/ipotenuză; cos α = alăturată/ipotenuză','În triunghiul dreptunghic 3–4–5, pentru unghiul opus catetei de 3 avem sin α = 3/5 și cos α = 4/5.','Dacă ipotenuza e 10 și cateta opusă e 6, află sin α.','3/5.'],
 ['Tangenta și raporturi trigonometrice','Tangenta unui unghi ascuțit este cateta opusă împărțită la cateta alăturată. Nu confundăm raporturile când alegem un alt unghi de referință.','tan α = sin α / cos α','În triunghiul 3–4–5, pentru unghiul opus laturii de 3, tan α = 3/4. Calculăm prin împărțirea celor două catete.','Pentru cateta opusă 5 și cea alăturată 12, găsește tan α.','5/12.'],
 ['Identitatea fundamentală','Pe cercul unitate, coordonatele punctului asociat unghiului sunt cos și sin. Teorema lui Pitagora conduce la identitatea fundamentală a trigonometriei.','sin²x + cos²x = 1','Dacă sin x = 3/5 și x este ascuțit, cos x = √(1 − 9/25)=4/5, alegând rădăcina pozitivă.','Dacă cos x = 12/13 pentru un unghi ascuțit, află sin x.','5/13.']
 ],
 algebra:[
 ['Polinoame și gradul lor','Gradul unui polinom nenul este cel mai mare exponent al necunoscutei cu coeficient nenul. Polinoamele se adună după puteri și se înmulțesc prin distributivitate.','(x+2)(x−3)=x²−x−6','Înmulțim pe rând: x·x − 3x + 2x − 6 = x² − x − 6. Verificăm numeric pentru x=0: −6 în ambele expresii.','Dezvoltă (x−4)(x+1).','x²−3x−4.'],
 ['Rădăcinile unui polinom','Un număr r este rădăcină a polinomului P dacă P(r)=0. Factorizarea ajută la găsirea rădăcinilor, fără a confunda rădăcinile cu factorii numerici.','P(x)=(x−2)(x+3)','P(x)=0 dacă x−2=0 sau x+3=0. Rezultă rădăcinile 2 și −3.','Găsește rădăcinile lui (x−5)(x−1)=0.','x=5 sau x=1.'],
 ['Progresie aritmetică','Într-o progresie aritmetică diferența dintre termeni consecutivi este constantă. Formula termenului general ajută la calcul fără a enumera fiecare termen.','aₙ=a₁+(n−1)r','Pentru 3,7,11,... avem a₁=3 și r=4; al zecelea termen este 3+9·4=39.','Care este al șaselea termen pentru 2,5,8,...?','17.']
 ]
 },
 {
 analysis:[
 ['Limita unui șir','Limita descrie comportarea termenilor când indicele crește fără limită. Nu înseamnă simpla valoare a unui termen, ci apropierea de o valoare sau divergența.','lim(n→∞) 1/n = 0','Pentru n=10,100,1000 obținem 0,1; 0,01; 0,001. Valorile se apropie de zero, fără a ajunge la zero la un indice finit.','Care este limita lui 5/n când n crește nelimitat?','0.'],
 ['Limita unei funcții','Limita unei funcții într-un punct privește valorile în vecinătatea punctului, dacă acestea există. Valoarea în punct poate lipsi fără a elimina limita.','lim(x→2) (x²−4)/(x−2)=4','Pentru x≠2 descompunem x²−4=(x−2)(x+2). Simplificăm x−2 și lăsăm x→2, obținând 4. Expresia originală nu este definită chiar în 2.','Află lim(x→3) (x²−9)/(x−3).','6.'],
 ['Derivata ca rată de schimbare','Derivata măsoară variația locală a funcției și panta tangentei, dacă există. Formula diferențelor se aplică înainte de regulile de derivare.','f′(x)=lim(h→0)(f(x+h)−f(x))/h','Pentru f(x)=x²: [(x+h)²−x²]/h=2x+h; la h→0 obținem f′(x)=2x.','Derivează f(x)=3x².','f′(x)=6x.']
 ],
 trigonometry:[
 ['Cercul trigonometric','Pe cercul de rază 1, unghiurile sunt orientate. Cosinusul este coordonata orizontală, sinusul este coordonata verticală, cu semne ce depind de cadran.','cos 0=1; sin 0=0','Pentru 90° punctul este (0,1), deci cos 90°=0 și sin 90°=1. Un arc complet are 360° sau 2π radiani.','Câte radiani corespund unui unghi de 180°?','π radiani.'],
 ['Formule de adunare','Funcțiile trigonometrice ale sumei a două unghiuri se exprimă prin funcțiile fiecărui unghi. Semnele formulelor diferă la sinus și cosinus.','sin(a+b)=sin a cos b+cos a sin b','Calculăm sin 90° pornind din 45°+45°: 2·(√2/2)·(√2/2)=1.','Află cos(60°+30°).','0.'],
 ['Ecuații trigonometrice elementare','O ecuație trigonometrică are soluții periodice. Soluțiile trebuie precizate pentru intervalul cerut; o singură valoare poate fi insuficientă.','sin x=0 ⇒ x=kπ, k∈ℤ','În intervalul [0,2π], ecuația sin x=0 are soluțiile 0, π și 2π. Le verificăm pe cercul trigonometric.','Rezolvă cos x=1 în [0,2π].','x=0 sau x=2π.']
 ],
 statistics:[
 ['Permutări și aranjamente','În numărarea ordonărilor distingem dacă ordinea contează. O permutare rearanjează toate elementele distincte ale mulțimii.','n! = 1·2·...·n','Trei elevi distincti pot sta pe un rând în 3!=6 ordini. Nu aplicăm formula n! pentru selecții fără ordine.','Câte ordonări ale patru obiecte distincte există?','24.'],
 ['Combinări','Combinările numără selecții de k obiecte distincte din n fără să conteze ordinea. Numărul lor diferă de aranjamente, unde ordinea contează.','C(n,k)=n!/[k!(n−k)!]','Alegem doi elevi din patru. Sunt C(4,2)=4!/(2!2!)=6 perechi, nu 12.','Câte echipe de 2 persoane se aleg din 5?','10.'],
 ['Probabilitate condiționată','Probabilitatea condiționată P(A|B) se calculează între cazurile în care B s-a produs și necesită P(B)>0. Nu este automat egală cu P(A).','P(A|B)=P(A∩B)/P(B)','La un zar, B=rezultat par, A=rezultat mai mare decât 3. În B avem {2,4,6}; în A∩B {4,6}; probabilitatea condiționată este 2/3.','Care este P(rezultat 6 | rezultat par) pe un zar corect?','1/3.']
 ]
 },
 {
 analysis:[
 ['Reguli de derivare','Pentru funcții derivabile folosim regula sumei, produsului și compunerii. Derivata produsului nu este produsul derivatelor.','(fg)′=f′g+fg′','Pentru f(x)=x²(x+1), avem f′(x)=2x(x+1)+x²=3x²+2x.','Derivează h(x)=x³+2x.','3x²+2.'],
 ['Primitive și integrale','O primitivă a funcției f este o funcție F cu F′=f. Integrala definită poate fi calculată prin diferența valorilor unei primitive la capete, când condițiile teoremei sunt îndeplinite.','∫ₐᵇ f(x)dx=F(b)−F(a)','Pentru f(x)=2x, o primitivă este F(x)=x²; integrala între 0 și 3 este 9−0=9.','Calculează ∫₀² 3x² dx.','8.'],
 ['Optimizare prin derivată','Punctele critice se obțin unde derivata este zero sau nu există; apoi trebuie verificată natura lor. O valoare critică nu este automat maxim sau minim.','f′(x)=0','Pentru f(x)=x²−4x+7, derivata este 2x−4, zero în x=2. Parabola se deschide în sus, deci în x=2 avem minimul f(2)=3.','Determină minimul lui x²−6x+10.','Minim 1 la x=3.']
 ],
 algebra:[
 ['Numere complexe','Un număr complex are forma a+bi, cu i²=−1. Adunăm separat părțile reale și imaginare și folosim i² la înmulțire.','(2+3i)+(4−i)=6+2i','Înmulțim (1+i)(1−i)=1−i²=2. Rezultatul este real, deși factorii sunt complecși.','Calculează (3+2i)+(−1+4i).','2+6i.'],
 ['Progresii geometrice','O progresie geometrică are raport constant q între termeni consecutivi nenuli. Formula termenului general folosește o putere a raportului.','aₙ=a₁qⁿ⁻¹','Pentru 2,6,18,... raportul este 3; termenul al cincilea este 2·3⁴=162.','Află termenul al patrulea din 5,10,20,...','40.'],
 ['Matrici și sisteme liniare','O matrice organizează coeficienții în rânduri și coloane. Pentru un sistem liniar, determinantul poate arăta dacă sistemul 2×2 are o soluție unică.','det [[a,b],[c,d]]=ad−bc','Pentru matricea [[2,1],[1,3]], determinantul este 2·3−1·1=5, deci matricea este inversabilă.','Calculează determinantul [[3,2],[1,4]].','10.']
 ],
 statistics:[
 ['Distribuție binomială','Modelul binomial se aplică unui număr fix de încercări independente cu două rezultate posibile și probabilitate constantă de succes.','P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ','Pentru două aruncări ale unei monede corecte, probabilitatea unui singur succes este C(2,1)(1/2)(1/2)=1/2.','Care este P(doi succese din două aruncări corecte)?','1/4.'],
 ['Valoarea așteptată','Speranța matematică este media teoretică ponderată de probabilități. Nu descrie neapărat rezultatul unei singure încercări.','E(X)=Σ xᵢ pᵢ','Dacă X este 0 cu probabilitate 0,25 și 4 cu probabilitate 0,75, atunci E(X)=0·0,25+4·0,75=3.','X ia 2 sau 6 cu probabilități 1/2 fiecare. Află E(X).','4.'],
 ['Varianță și dispersie','Varianța măsoară împrăștierea față de medie în unități pătrate. Abaterea standard este rădăcina pătrată a varianței, exprimată în unitățile originale.','Var(X)=E(X²)−[E(X)]²','Pentru X=1 sau 3 cu probabilități 1/2, E(X)=2, E(X²)=5, deci Var(X)=5−4=1.','Pentru X=0 sau 2 cu probabilități 1/2, găsește Var(X).','1.']
 ]
 }
];
