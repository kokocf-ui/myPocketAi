// Mathematics for upper-secondary study years: broader, distinct subject
// strands with original worked examples. Advisory unless a country/year has
// independently documented official ordering.
export const MATH_UPPER_EXTENSION=[
 {
 algebra:[
  ['Absolute value equations','Ecuații cu modul','O ecuație de forma |x|=a are două soluții opuse dacă a este pozitiv, una dacă a este zero și niciuna dacă a este negativ. Se verifică în ecuația inițială.','|x|=5 ⇒ x=−5 sau x=5','Pentru |2x−1|=7 rezolvăm 2x−1=7 și 2x−1=−7. Obținem x=4 și x=−3; ambele verifică modulul 7.','Rezolvă |x−2|=4.','x=6 sau x=−2.'],
  ['Linear systems by elimination','Sisteme liniare prin eliminare','La eliminare înmulțim ecuațiile cu factori potriviți și le adunăm sau scădem pentru a elimina o necunoscută. Apoi verificăm ambele ecuații.','2x+y=9; x−y=0','Adunând 2x+y=9 și x−y=0 obținem 3x=9, deci x=3 și y=3. Verificarea dă 9 și respectiv 0.','Rezolvă x+y=8 și x−y=2.','x=5,y=3.']
 ],
 functions:[
  ['Piecewise functions','Funcții definite pe bucăți','O funcție definită pe bucăți folosește formule diferite pe intervale distincte. La calculul valorii alegem formula din intervalul argumentului, iar continuitatea la prag se verifică separat.','f(x)=x dacă x≥0; −x dacă x<0','Pentru f(x)=|x|, avem f(3)=3 și f(−3)=−(−3)=3. Formula depinde de semnul argumentului, nu de alegere arbitrară.','Calculează f(−7) pentru f(x)=|x|.','7.'],
  ['Linear function intercepts','Intersecțiile dreptei cu axele','Pentru o funcție liniară y=ax+b, punctul cu ordonata zero este intersecția cu Ox, iar valoarea la x=0 dă intersecția cu Oy. Este necesar a diferit de zero pentru formula abscisei.','x_intersecție=−b/a, a≠0','Pentru y=2x−6, dacă y=0 atunci x=3. Dacă x=0 atunci y=−6. Intersecțiile sunt (3,0) și (0,−6).','Află intersecțiile cu axele ale lui y=3x+9.','(−3,0) și (0,9).']
 ],
 geometry:[
  ['Midpoint of a segment','Mijlocul segmentului în coordonate','Coordonatele mijlocului unui segment sunt mediile aritmetice ale coordonatelor capetelor. Formula se aplică separat pe fiecare axă.','M=((x₁+x₂)/2,(y₁+y₂)/2)','Pentru A(1,2) și B(5,8), mijlocul este M(3,5). Verificăm că deplasările A→M și M→B sunt egale.','Mijlocul dintre (−2,4) și (6,0)?','(2,2).'],
  ['Area using coordinate determinants','Aria triunghiului în plan','Aria unui triunghi cu vârfuri în coordonate se poate calcula prin determinant; rezultatul este valoarea absolută împărțită la doi. Triunghiurile coliniare au aria zero.','A=|det(B−A,C−A)|/2','Pentru A(0,0), B(4,0), C(0,3), determinantul este 12, deci aria este 6 unități pătrate.','Aria triunghiului A(0,0), B(6,0), C(0,2)?','6 unități pătrate.']
 ],
 statistics:[
  ['Measures of central tendency','Indicatori ai tendinței centrale','Media, mediana și modul rezumă aspecte diferite ale unui eșantion. O medie poate fi distorsionată de valori extreme, de aceea alegem indicatorul potrivit tipului de date.','x̄=(Σxᵢ)/n','Pentru 2,3,3,4,18, media este 6, mediana este 3 și modul este 3. Afirmarea doar a mediei ar ascunde valoarea extremă.','Află media și mediana pentru 1,2,3,14.','Media 5; mediana 2,5.'],
  ['Interpreting standard deviation','Abaterea standard: interpretare','Abaterea standard măsoară cât de dispersate sunt valorile în jurul mediei. Pentru un set constant este zero; variantele pentru populație și eșantion au numitori diferiți.','σ=√(Σ(xᵢ−μ)²/n)','Pentru populația {2,4}, media este 3, iar varianța este ((−1)²+1²)/2=1; abaterea standard este 1.','Abaterea standard a populației {5,5,5}?','0.'],
  ['Elementary independent probability','Probabilitatea evenimentelor independente','Două evenimente sunt independente dacă producerea unuia nu schimbă probabilitatea celuilalt. Pentru evenimente independente, probabilitatea comună se obține prin înmulțire.','P(A∩B)=P(A)P(B)','La două aruncări independente ale unei monede echilibrate, probabilitatea a două rezultate stemă este 1/2×1/2=1/4.','Două zaruri: probabilitatea de a obține 1 la ambele?','1/36.']
 ]
 },
 {
 functions:[
  ['Domain of logarithmic functions','Domeniul funcțiilor logaritmice','Logaritmul real este definit numai pentru argumente strict pozitive. Baza trebuie să fie pozitivă și diferită de 1. Determinăm domeniul înainte de calcule.','ln(x−3) definit pentru x>3','Pentru f(x)=ln(2x+4), cerem 2x+4>0, deci x>−2. Nu includem punctul în care argumentul ar fi zero.','Domeniul lui log₁₀(5−x)?','x<5.'],
  ['Inverse of affine functions','Inversa funcției afine','Funcția f(x)=ax+b pe R este inversabilă dacă a este nenul, fiind strict monotonă. Pentru inversă schimbăm rolul lui x și y și rezolvăm ecuația.','f⁻¹(y)=(y−b)/a','Pentru f(x)=4x−1 obținem x=(y+1)/4; astfel f⁻¹(y)=(y+1)/4. Verificăm compunerea și obținem argumentul inițial.','Inversa lui f(x)=2x+6?','f⁻¹(x)=(x−6)/2.']
 ],
 trigonometry:[
  ['Degrees and radians','Grade și radiani','Măsura în radiani este raportul dintre lungimea arcului și rază. Un cerc întreg are 2π radiani, adică 360°, astfel încât transformările se fac proporțional.','180°=π rad; 45°=π/4 rad','Pentru 120° calculăm 120π/180=2π/3 radiani. La transformarea inversă înmulțim cu 180/π.','Transformă 225° în radiani.','5π/4.'],
  ['Sine and cosine special angles','Valori trigonometrice remarcabile','Unghiurile de 30°, 45° și 60° au valori sinus și cosinus care pot fi deduse din triunghiuri dreptunghice speciale. Semnele depind de cadran.','sin30°=1/2; cos60°=1/2','Din triunghiul 30°–60°–90° cu ipotenuza 2, cateta opusă unghiului de 30° este 1, deci sin30°=1/2.','Cât este sin60°?','√3/2.']
 ],
 algebra:[
  ['Rational algebraic expressions','Expresii algebrice raționale','O fracție algebrică este definită numai când numitorul este diferit de zero. Factorii comuni se pot simplifica după stabilirea restricțiilor de domeniu.','(x²−9)/(x−3)=x+3 pentru x≠3','Descompunem x²−9=(x−3)(x+3), apoi simplificăm x−3 numai când x nu este 3. Forma nouă nu redă valoarea în punctul exclus.','Simplifică (x²−4)/(x−2) și precizează restricția.','x+2, cu x≠2.'],
  ['Polynomial factor theorem','Teorema factorului pentru polinoame','Dacă P(a)=0, atunci polinomul P(x) este divizibil cu x−a. Reciproca este valabilă; astfel putem identifica factori pornind de la rădăcini.','P(a)=0 ⇔ (x−a) este factor','Pentru P(x)=x²−5x+6, P(2)=4−10+6=0, deci x−2 este factor; celălalt factor este x−3.','Este x−4 factor al lui x²−7x+12?','Da, P(4)=0.']
 ],
 geometry:[
  ['Circle equations in coordinates','Ecuația cercului în coordonate','Un cerc cu centrul (a,b) și raza r>0 conține punctele aflate la distanța r de centru. Formula rezultă prin teorema lui Pitagora.','(x−a)²+(y−b)²=r²','Cercul cu centrul (2,−1) și raza 3 are ecuația (x−2)²+(y+1)²=9. Punctul (5,−1) este pe cerc.','Ecuația cercului cu centru (0,2) și rază 4?','x²+(y−2)²=16.'],
  ['Distance from a point to a line','Distanța de la punct la dreaptă','Distanța de la un punct la o dreaptă este lungimea segmentului perpendicular pe dreaptă. Pentru ecuația ax+by+c=0 aplicăm formula normată.','d=|ax₀+by₀+c|/√(a²+b²)','De la P(0,0) la dreapta 3x+4y−10=0, distanța este |−10|/5=2.','Distanța de la (0,0) la x−3=0?','3.'],
  ['Circle and tangent','Tangenta la un cerc','Tangenta într-un punct al cercului este perpendiculară pe raza dusă la acel punct. Proprietatea permite construirea tangentelor și recunoașterea lor în figură.','OP⊥t în punctul P de tangență','Cercul are centrul O(0,0), iar P(5,0) este pe cerc. Tangenta la P este dreapta verticală x=5, perpendiculară pe OP.','Tangenta la cercul cu centru O(0,0) în (0,3) are ce ecuație?','y=3.']
 ],
 statistics:[
  ['Permutations without repetition','Permutări fără repetiție','O permutare este o aranjare a tuturor celor n elemente distincte în care ordinea contează. Formula factorială este potrivită numai pentru elemente distincte.','Pₙ=n!','Patru elevi distincti pot ocupa patru locuri într-o linie în 4×3×2×1=24 de ordine.','Câte permutări ale a 5 obiecte distincte sunt?','120.'],
  ['Combinations without ordering','Combinări fără ordine','Combinările numără alegerea a k elemente din n fără a ține cont de ordine. Dacă schimbăm ordinea, nu obținem o nouă echipă.','C(n,k)=n!/(k!(n−k)!)','Alegem doi reprezentanți din șase: 6×5/2=15 de perechi diferite.','Câte echipe de 3 se pot alege din 5 elevi?','10.'],
  ['Probability of a union','Probabilitatea reuniunii a două evenimente','Pentru două evenimente oarecare adunăm probabilitățile și scădem intersecția, pentru a nu o număra de două ori. Dacă sunt incompatibile, intersecția are probabilitate zero.','P(A∪B)=P(A)+P(B)−P(A∩B)','Pe un zar, A=număr par, B=număr mai mare decât 4. Avem P(A)=3/6, P(B)=2/6, P(intersecție)=1/6, deci 4/6.','Probabilitatea unui 1 sau unui 2 la un zar corect?','2/6=1/3.']
 ]
 },
 {
 analysis:[
  ['One-sided function limits','Limite laterale ale funcțiilor','Limita unei funcții la un punct există în sens bilateral numai dacă limitele din stânga și dreapta există și coincid. Valoarea funcției în punct poate fi diferită.','lim(x→a⁻)f=lim(x→a⁺)f','Pentru f(x)=−1 dacă x<0 și 1 dacă x≥0, limita din stânga la zero este −1, iar din dreapta 1; limita bilaterală nu există.','Există limita lui |x|/x când x→0?','Nu, limitele laterale sunt −1 și 1.'],
  ['Derivative of a product','Derivata unui produs','Regula derivării unui produs include două termene: derivăm primul factor și păstrăm al doilea, apoi adunăm primul înmulțit cu derivata celui de-al doilea.','(fg)′=f′g+fg′','Pentru f(x)=x²(x+1), derivata este 2x(x+1)+x²=3x²+2x.','Derivează x(x²+2).','3x²+2.']
 ],
 trigonometry:[
  ['Double-angle identities','Formule pentru unghiul dublu','Funcțiile trigonometrice ale unghiului dublu rezultă din formulele de adunare. Formulele pot fi utile la transformări, rezolvări de ecuații și demonstrații.','sin2x=2sin x cos x','Pentru x=30°, sin60°=2×(1/2)×(√3/2)=√3/2. Nu dublăm direct valoarea sinusului.','Cât este sin(2×45°)?','1.'],
  ['Periodicity of sine and cosine','Periodicitatea sinusului și cosinusului','Sinusul și cosinusul se repetă după o rotație completă de 2π radiani. Periodicitatea permite descrierea tuturor soluțiilor unei ecuații trigonometrice.','sin(x+2π)=sin x; cos(x+2π)=cos x','Dacă sinx=0, atunci x=kπ, k întreg. Valorile 0,π,2π sunt trei soluții distincte pe intervalul închis [0,2π].','Cât este cos(2π+π/3)?','1/2.']
 ],
 statistics:[
  ['Binomial probability','Probabilitatea binomială','Modelul binomial descrie un număr fix de încercări Bernoulli independente, toate cu aceeași probabilitate de succes. Numărul succeselor are o distribuție binomială.','P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ','Pentru două aruncări ale unei monede corecte, probabilitatea exact unui succes este C(2,1)/4=1/2.','La 3 aruncări corecte, probabilitatea exact a 3 succese?','1/8.'],
  ['Conditional probability in a table','Probabilități condiționate din tabele','Probabilitatea condiționată este raportată la cazurile în care condiția s-a produs. Nu împărțim la numărul total dacă analizăm doar un subgrup.','P(A|B)=P(A∩B)/P(B)','Într-o clasă cu 10 fete, 6 studiază franceza. Alegând aleatoriu dintre fete, probabilitatea unei eleve care studiază franceza este 6/10.','Dintre 20 elevi înscriși la club, 5 sunt în echipa A. P(A|club)?','1/4.']
 ],
 algebra:[
  ['Complex modulus','Modulul numerelor complexe','Modulul numărului complex z=a+bi este distanța punctului (a,b) față de origine. El este real și nenegativ și nu trebuie confundat cu partea reală.','|a+bi|=√(a²+b²)','Pentru z=3+4i avem |z|=√(9+16)=5. Modulul lui −z rămâne 5 deoarece ambele coordonate sunt ridicate la pătrat.','Află modulul lui 5−12i.','13.'],
  ['Geometric progression sums','Suma unei progresii geometrice','Suma primilor n termeni ai unei progresii geometrice cu raport diferit de 1 se obține printr-o formulă finită. Pentru raport 1, suma este n ori primul termen.','Sₙ=a₁(1−qⁿ)/(1−q), q≠1','Pentru 1,2,4,8 avem a₁=1, q=2 și n=4. Suma este (1−16)/(1−2)=15.','Află suma primilor 5 termeni din 2,4,8,…','62.'],
  ['Quadratic expressions and inequalities','Inecuații de gradul al doilea','Semnul unui trinom pătratic depinde de rădăcinile reale și de coeficientul termenului pătratic. Facem tabel de semne ori folosim graficul, nu doar rezolvăm ecuația.','(x−2)(x−5)<0 ⇒ 2<x<5','Produsul a doi factori liniari este negativ între rădăcinile distincte 2 și 5. Verificăm cu x=3: (1)(−2)<0.','Rezolvă (x−1)(x−4)>0.','x<1 sau x>4.']
 ],
 functions:[
  ['Continuous functions and graph gaps','Continuitate și întreruperi în grafice','O funcție continuă poate fi desenată local fără întrerupere, dar criteriul matematic cere ca limita și valoarea în punct să coincidă. Un punct lipsă poate distruge continuitatea.','lim(x→a)f(x)=f(a)','Pentru g(x)=(x²−1)/(x−1), x≠1, limita în 1 este 2, însă g(1) nu este definită. Funcția nu este continuă în 1 pe forma dată.','Care este limita lui (x²−4)/(x−2) la x→2?','4.'],
  ['Asymptotes of rational graphs','Asimptote verticale și orizontale','O asimptotă verticală apare când valoarea funcției tinde la infinit în apropierea unui punct; una orizontală descrie limita la infinit. Nu fiecare punct exclus este asimptotă.','f(x)=1/(x−3) ⇒ x=3 și y=0','La x→3, 1/(x−3) devine nemărginită; la x→∞ tinde la zero. Dreapta x=3 este verticală, y=0 orizontală.','Asimptotele funcției f(x)=2/(x+1)?','x=−1 și y=0.'],
  ['Monotonic intervals from graphs','Intervale de monotonie','O funcție este crescătoare pe un interval dacă la argumente mai mari corespund valori cel puțin la fel de mari. Derivata pozitivă pe interval oferă un criteriu suficient de creștere.','f′(x)>0 ⇒ funcție strict crescătoare','Pentru f(x)=x², derivata 2x este pozitivă când x>0 și negativă când x<0; funcția scade la stânga lui zero și crește la dreapta.','Pe ce interval crește strict f(x)=x²?','(0,+∞).']
 ],
 geometry:[
  ['Vector dot product in coordinates','Produsul scalar al vectorilor','Produsul scalar al doi vectori din plan este suma produselor coordonatelor corespunzătoare. Dacă este zero pentru vectori nenuli, aceștia sunt perpendiculari.','(a,b)·(c,d)=ac+bd','Pentru u=(1,2), v=(2,−1), produsul scalar este 1×2+2×(−1)=0, deci vectorii sunt perpendiculari.','Produsul scalar dintre (3,4) și (2,1)?','10.'],
  ['Angle between vectors','Unghiul dintre doi vectori','Unghiul dintre vectori nenuli se poate calcula din produsul scalar și modulele lor. Trebuie să verificăm că niciun vector nu este nul.','cosθ=(u·v)/(|u||v|)','Pentru u=(1,0), v=(0,1), produsul scalar este zero, deci cosθ=0 și unghiul este 90°.','Ce unghi fac vectorii (1,0) și (1,0)?','0°.'],
  ['Area of a circle sector','Aria sectorului circular','Un sector de cerc reprezintă o parte din disc proporțională cu unghiul la centru. Pentru unghi în grade folosim fracția θ/360 aplicată ariei întregului disc.','A_sector=(θ/360°)πr²','Pentru un sector de 90° și r=4, aria este (1/4)×16π=4π.','A_sector pentru θ=180° și r=2?','2π.']
 ]
 },
 {
 analysis:[
  ['Integration by parts','Integrarea prin părți','Formula integrării prin părți decurge din regula derivării produsului. Alegem funcțiile u și dv astfel încât noua integrală să fie mai simplă decât cea inițială.','∫u dv=uv−∫v du','Pentru ∫xeˣdx alegem u=x, dv=eˣdx. Obținem xeˣ−∫eˣdx=eˣ(x−1)+C.','Calculează ∫x cos x dx.','x sin x+cos x+C.'],
  ['Maxima and minima on a closed interval','Extreme pe interval închis','O funcție continuă pe un interval închis și mărginit își atinge minimul și maximul. Verificăm punctele critice și capetele intervalului.','Comparați f(a),f(b),f(c) cu f′(c)=0','Pentru f=x² pe [−2,1], punctul critic este 0 cu valoarea 0. La capete valorile sunt 4 și 1; minim 0 și maxim 4.','Extremele lui f=x² pe [−1,3]?','Minim 0 la x=0, maxim 9 la x=3.']
 ],
 algebra:[
  ['Matrix multiplication','Înmulțirea matricelor','Elementul din poziția (i,j) al produsului AB este produsul scalar al liniei i din A cu coloana j din B. În general AB diferă de BA.','(AB)ᵢⱼ=Σₖ AᵢₖBₖⱼ','Pentru A=diag(2,3), B=diag(4,5), produsul este diag(8,15). Ordinea nu contează în acest exemplu particular, dar nu este regulă generală.','Produsul diag(3,2)×diag(5,4)?','diag(15,8).'],
  ['Determinant of a two-by-two matrix','Determinantul matricelor 2×2','Determinantul unei matrice pătratice 2×2 este produsul elementelor diagonalei principale minus produsul celorlalte două elemente. Este zero exact când matricea nu este inversabilă.','det[[a,b],[c,d]]=ad−bc','Pentru [[3,2],[1,5]] avem det=3×5−2×1=13, diferit de zero; matricea este inversabilă.','Determinantul [[4,1],[2,3]]?','10.']
 ],
 statistics:[
  ['Variance of discrete data','Varianța datelor discrete','Varianța populației este media pătratelor abaterilor față de medie; pătratele împiedică anularea abaterilor pozitive și negative. Pentru eșantion se folosește adesea alt numitor.','σ²=Σ(xᵢ−μ)²/n','Pentru datele {1,3}, media este 2, abaterile sunt −1 și +1, iar varianța populației este (1+1)/2=1.','Varianța populației pentru {2,2,2}?','0.'],
  ['Bayes with two hypotheses','Teorema lui Bayes: două ipoteze','Bayes combină probabilitatea anterioară a unei ipoteze cu probabilitatea observației sub acea ipoteză. Rezultatul este o probabilitate condiționată, nu certitudine.','P(A|B)=P(B|A)P(A)/P(B)','Dacă P(A)=1/2, P(B|A)=3/4 și P(B|non A)=1/4, atunci P(B)=1/2, deci P(A|B)=3/4.','Cu P(A)=1/2, P(B|A)=2/3, P(B|non A)=1/3, află P(A|B).','2/3.']
 ],
 functions:[
  ['Domain and composition of functions','Domeniu și compunerea funcțiilor','Domeniul lui f∘g cuprinde doar argumentele pentru care g(x) există și rezultatul g(x) aparține domeniului lui f. Verificăm ambele condiții.','(f∘g)(x)=f(g(x))','Dacă f(t)=√t și g(x)=x−4, compunerea este √(x−4), definită pentru x≥4.','Domeniul lui √(3−x)?','x≤3.'],
  ['Inverse and composition check','Verificarea funcției inverse','O funcție inversabilă permite recuperarea argumentului din valoare. Compunerea ei cu inversa este funcția identitate pe domeniile potrivite.','f⁻¹(f(x))=x','Pentru f(x)=3x+1, inversa este (x−1)/3. Calculăm ((3x+1)−1)/3=x, deci formula este corectă.','Inversa lui f(x)=5x−2?','(x+2)/5.'],
  ['Graph of a quadratic function','Graficul funcției pătratice','Parabola unei funcții pătratice își schimbă monotonia în dreptul vârfului. Coeficientul lui x² decide orientarea, iar coordonata vârfului ajută la trasarea graficului.','x_v=−b/(2a)','Pentru f=x²−6x+8, vârful are x=3 și y=−1. Parabola se deschide în sus; rădăcinile sunt 2 și 4.','Vârful funcției x²−2x?','(1,−1).']
 ],
 trigonometry:[
  ['Cosine of a sum','Cosinusul unei sume de unghiuri','Cosinusul sumei nu este suma cosinusurilor. Folosim formula de adunare, respectând semnul minus din termenul cu sinusi.','cos(a+b)=cos a cos b−sin a sin b','Calculăm cos(60°+30°)=cos60 cos30−sin60 sin30=√3/4−√3/4=0.','Cât este cos(45°+45°)?','0.'],
  ['Solving sine equations','Ecuații cu sinus','Ecuația sinx=a poate avea două familii de soluții într-o perioadă atunci când −1<a<1. Trebuie precizate intervalul și periodicitatea.','sinx=1 ⇒ x=π/2+2kπ','În intervalul [0,2π], ecuația sinx=1 are o singură soluție, π/2. La adăugarea multipliilor de 2π obținem toate soluțiile.','Rezolvă sinx=0 în [0,2π].','x=0,π,2π.'],
  ['Trigonometric Pythagorean identity','Identitatea trigonometrică fundamentală','Sinusul și cosinusul sunt coordonatele unui punct pe cercul unitate, astfel încât suma pătratelor este întotdeauna 1 pentru orice unghi real.','sin²x+cos²x=1','Dacă sinx=3/5 și x este în cadranul I, cosx=4/5, deoarece cosx este pozitiv și pătratele însumează 1.','Dacă cosx=5/13 și x este în cadranul I, află sinx.','12/13.']
 ],
 geometry:[
  ['Vectors in three dimensions','Vectori în spațiu','Un vector din spațiul tridimensional are trei componente, iar modulul său rezultă din teorema lui Pitagora generalizată. Trebuie să păstrăm ordinea coordonatelor.','|v|=√(x²+y²+z²)','Vectorul v=(2,3,6) are modulul √(4+9+36)=√49=7. Nu adunăm coordonatele direct.','Modulul lui (1,2,2)?','3.'],
  ['Equation of a plane','Ecuația planului în spațiu','Un plan poate fi descris printr-un punct și un vector normal nenul. Coordonatele punctelor planului verifică ecuația liniară asociată.','ax+by+cz+d=0','Planul z=4 are normală (0,0,1). Punctul (2,−1,4) îl verifică, pe când (2,−1,3) nu.','Este punctul (1,2,3) în planul x+y+z=6?','Da, 1+2+3=6.'],
  ['Distance between spatial points','Distanța dintre două puncte în spațiu','Distanța euclidiană dintre două puncte din spațiu este rădăcina pătrată a sumei pătratelor diferențelor coordonatelor. Rezultatul este o mărime nenegativă.','d=√(Δx²+Δy²+Δz²)','Între A(0,0,0) și B(2,3,6) diferențele sunt 2,3,6; distanța este √(4+9+36)=7.','Distanța dintre (0,0,0) și (1,2,2)?','3.']
 ]
 }
];