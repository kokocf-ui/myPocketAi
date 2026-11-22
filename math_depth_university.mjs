// University mathematics: original educational explanations, not a claim that
// every university in Europe teaches these in the same year or degree.
export const MATH_DEPTH_UNIVERSITY=[
 {
 analysis:[
 ['Șiruri și convergență','Secvențe numerice și limita lor','Un șir convergent se apropie oricât de mult de un număr real L după un rang suficient de mare. Definiția riguros folosește o toleranță ε pozitivă.','Pentru orice ε>0 există N astfel încât n≥N ⇒ |aₙ−L|<ε','Pentru aₙ=1/n și L=0, alegem N>1/ε. Pentru orice n≥N avem |1/n|<ε, deci șirul converge la 0.','Arată limita lui 3/n la n→∞.','0; pentru ε alegem N>3/ε.'],
 ['Continuitatea funcțiilor','O funcție este continuă în a dacă limita în a există și este egală cu valoarea funcției acolo. Limitele laterale trebuie să coincidă dacă a este punct interior al domeniului.','lim(x→a)f(x)=f(a)','Pentru f(x)=x², limita în 2 este 4 și f(2)=4. Prin urmare funcția este continuă în 2.','Este continuă în 0 funcția f(x)=x²+1?','Da, limita și valoarea sunt 1.'],
 ['Derivate și diferențiale','Derivata descrie variația de ordinul întâi. Pentru o funcție derivabilă, variația mică poate fi aproximată prin derivată înmulțită cu schimbarea argumentului.','Δf ≈ f′(a)Δx','Pentru f(x)=x² la a=3, f′(3)=6. Dacă Δx=0,01, estimăm Δf≈0,06; valoarea exactă este 3,01²−9=0,0601.','Aproximează creșterea lui x² la x=2 când Δx=0,02.','Aproximativ 0,08.']
 ],
 'linear-algebra':[
 ['Vectori și spații vectoriale','Un spațiu vectorial este o mulțime cu adunare și înmulțire cu scalari, care îndeplinesc axiomele cunoscute. Vectorii pot fi coordonate, polinoame sau funcții.','2(1,−2)+(3,1)=(5,−3)','Adunăm componentele corespunzătoare și înmulțim fiecare componentă cu scalarul. În R², operațiile păstrează rezultatul în spațiu.','Calculează 3(2,1)−(1,4).','(5,−1).'],
 ['Matrice, determinant și inversabilitate','O matrice pătratică este inversabilă exact când determinantul ei este nenul. Dacă determinantul este zero, nu există matrice inversă.','det [[a,b],[c,d]]=ad−bc','Pentru A=[[2,1],[3,4]], det A=8−3=5 ≠0, deci A este inversabilă.','Este inversabilă [[1,2],[2,4]]?','Nu, determinantul 4−4=0.'],
 ['Sisteme liniare și eliminare Gauss','Eliminarea Gauss transformă matricea extinsă prin operații elementare pe linii, care păstrează soluțiile. Apoi folosim substituția inversă.','[1,1|5]; [2,−1|4]','Din x+y=5 și 2x−y=4 adunăm ecuațiile: 3x=9, deci x=3 și y=2. Operația este echivalentă unei eliminări Gauss.','Rezolvă x+y=6 și x−y=2.','x=4, y=2.']
 ],
 discrete:[
 ['Mulțimi și operații','Reuniunea conține elementele din cel puțin una dintre mulțimi; intersecția conține numai elementele comune. Diferența păstrează elemente din prima care nu apar în a doua.','A∪B, A∩B, A\\B','Dacă A={1,2,3}, B={2,3,4}, atunci A∩B={2,3} și A∪B={1,2,3,4}.','Află A\\B pentru aceleași mulțimi.','{1}.'],
 ['Inducție matematică','Demonstrația prin inducție stabilește cazul inițial și arată că, dacă afirmația este adevărată pentru n, rezultă adevărul ei pentru n+1. Ambele etape sunt necesare.','1+2+…+n=n(n+1)/2','Pentru n=1 avem 1=1. Dacă formula este valabilă la n, adăugăm n+1 și obținem (n+1)(n+2)/2, adică formula pentru n+1.','Calculează suma 1+2+…+20 folosind formula.','210.'],
 ['Logică propozițională','O implicație A⇒B este falsă numai când A este adevărată și B falsă. Contrapozitiva ¬B⇒¬A este echivalentă logic cu implicația inițială.','A⇒B echivalent cu ¬B⇒¬A','Din „dacă n este divizibil cu 4, atunci este par” rezultă contrapozitiva „dacă nu este par, nu este divizibil cu 4”.','Contrapozitiva lui „dacă plouă, strada e udă”?','Dacă strada nu e udă, atunci nu plouă.']
 ]
 },
 {
 analysis:[
 ['Serii numerice și criterii','O serie este suma termenilor unui șir. Convergența unei serii nu rezultă doar din faptul că termenul general tinde la zero.','Σ(n≥1)1/n² converge; Σ(n≥1)1/n diverge','Seria geometrică cu raport |q|<1 are suma a/(1−q). Pentru a=1, q=1/2 suma este 2.','Află suma 3+1,5+0,75+…','6.'],
 ['Integrale definite și schimbarea de variabilă','Integrala definită acumulează variații sau arii orientate. O schimbare de variabilă validă cere schimbarea diferențialei și a limitelor.','u=g(x); du=g′(x)dx','Pentru ∫₀¹ 2x(x²+1)dx punem u=x²+1, du=2xdx, limitele devin 1 și 2. Integrala este [u²/2]₁²=3/2.','Calculează ∫₀¹ 2x dx.','1.'],
 ['Funcții de mai multe variabile','Derivatele parțiale măsoară variația funcției față de o variabilă, păstrând celelalte variabile constante. Gradientul reunește aceste derivate.','∇f=(∂f/∂x, ∂f/∂y)','Pentru f(x,y)=x²+3xy, derivatele sunt 2x+3y și 3x. La (1,2), gradientul este (8,3).','Calculează ∂f/∂x pentru f=x²y+y².','2xy.']
 ],
 'linear-algebra':[
 ['Independență liniară','Vectorii sunt liniar independenți când singura combinație liniară nulă este cea cu toți coeficienții zero. În R² doi vectori necoliniari formează o bază.','a v₁ + b v₂ = 0 ⇒ a=b=0','Vectorii (1,0) și (0,1) sunt independenți: a(1,0)+b(0,1)=(a,b)=0 numai dacă a=b=0.','Sunt independenți (1,2) și (2,4)?','Nu, al doilea este dublul primului.'],
 ['Valori și vectori proprii','Un vector propriu nenul își păstrează direcția la aplicarea unei transformări liniare, fiind înmulțit cu o valoare proprie. Valorile proprii satisfac un determinant nul.','Av=λv; det(A−λI)=0','Pentru A diagonală cu elemente 2 și 3, vectorii canonici sunt proprii cu valorile proprii 2 și 3.','Valorile proprii ale diagonalei diag(4,−1)?','4 și −1.'],
 ['Ortogonalitate și proiecții','Doi vectori sunt ortogonali dacă produsul scalar este zero. Proiecția ortogonală pe un vector nenul permite descompunerea în componentă paralelă și perpendiculară.','proj_v(u)=(u·v)/(v·v) v','Pentru u=(3,4) și v=(1,0), proiecția este (3,0), deoarece u·v=3 și v·v=1.','Verifică ortogonalitatea (2,1) și (1,−2).','Da, 2−2=0.']
 ],
 statistics:[
 ['Variabile aleatoare discrete','O variabilă aleatoare atribuie valori numerice rezultatelor unui experiment. Distribuția de probabilitate precizează probabilitatea fiecărei valori, iar suma trebuie să fie 1.','ΣP(X=x)=1','Pentru un zar corect, X este 1 până la 6 cu probabilitate 1/6. Speranța este (1+…+6)/6=3,5.','Probabilitatea ca X să fie par?','1/2.'],
 ['Speranță și varianță','Speranța este o medie ponderată; varianța măsoară dispersia în jurul ei. Sunt importante interpretarea și unitățile.','E(X)=Σxp(x); Var(X)=E(X²)−E(X)²','Pentru X=0 sau 2, fiecare cu probabilitate 1/2, avem E(X)=1 și E(X²)=2. Var(X)=2−1=1.','Pentru X=1 sau 5, probabilități egale, află E(X).','3.'],
 ['Distribuția normală','Distribuția normală este o familie continuă, simetrică în jurul mediei. Parametrii μ și σ indică centrul și răspândirea; nu orice fenomen este normal distribuit.','Z=(X−μ)/σ','Pentru X=78, μ=70, σ=4, scorul standardizat este (78−70)/4=2. Observația se află la două abateri standard peste medie.','Află z pentru X=45, μ=50, σ=5.','−1.']
 ]
 },
 {
 differential:[
 ['Ecuații diferențiale separabile','O ecuație diferențială separabilă se poate rescrie cu funcțiile lui y și x pe părți diferite. Integrarea impune verificarea soluțiilor constante pierdute la împărțire.','dy/dx = ky ⇒ dy/y = k dx (când y≠0)','Integrăm ln|y|=kx+C și obținem y=Ce^{kx}. Soluția y=0 este inclusă pentru C=0.','Rezolvă y′=2y cu y(0)=3.','y=3e^{2x}.'],
 ['Ecuații liniare de ordinul întâi','O ecuație y′+p(x)y=q(x) poate fi rezolvată cu factor integrant. O problemă cu condiție inițială determină constanta dacă ipotezele sunt îndeplinite.','μ(x)=e^{∫p(x)dx}','Pentru y′+y=0 avem factor μ=e^x. Rezultă (e^xy)′=0, deci y=Ce^{−x}.','Rezolvă y′+2y=0 cu y(0)=1.','y=e^{−2x}.'],
 ['Sisteme dinamice simple','Un sistem dinamic descrie variația simultană în timp a unor mărimi. Echilibrul este un punct în care toate derivatele sunt zero.','x′=ax; y′=by','Pentru x′=−x, y′=−2y, soluțiile sunt x(t)=x₀e^{−t} și y(t)=y₀e^{−2t}; ambele tind la zero pentru t→∞.','În x′=−3x, ce se întâmplă cu x(t) când t→∞?','Tinde la 0 pentru orice valoare inițială finită.']
 ],
 analysis:[
 ['Integrale improprii','Integralele improprii apar pe intervale infinite sau lângă singularități; valoarea lor este definită printr-o limită. Nu toate converg.','∫₁∞ x^{−2}dx=1','Integrăm −1/x între 1 și b: 1−1/b. Când b→∞ rezultă 1. Pentru ∫₁∞ 1/x dx limita crește fără bound și integrala diverge.','Converge ∫₁∞ 1/x³ dx? Dacă da, cât este?','Da, 1/2.'],
 ['Convergență uniformă','Convergența uniformă controlează eroarea printr-o limită independentă de punctul x din domeniu. Este mai puternică decât convergența punctuală și permite rezultate suplimentare sub ipoteze.','sup_x |fₙ(x)−f(x)|→0','Pe [0,1], fₙ(x)=x/n converge uniform la 0 deoarece sup|x/n|=1/n→0.','Converge uniform la 0 pe [0,1] funcția fₙ(x)=x²/n?','Da, maximul erorii este 1/n.'],
 ['Analiză complexă introductivă','O funcție complex derivabilă într-un domeniu deschis respectă condiții mai restrictive decât derivabilitatea reală. Pentru funcții elementare holomorfe, derivarea se face analog.','d(z²)/dz=2z','Pentru f(z)=z² și z=1+i, derivata este f′(1+i)=2+2i. Verificarea se poate face din definiția limitei complexe.','Derivează f(z)=z³.','f′(z)=3z².']
 ],
 discrete:[
 ['Grafuri și gradele vârfurilor','Un graf neorientat are vârfuri și muchii. Suma gradelor vârfurilor este de două ori numărul muchiilor, deoarece fiecare muchie are două capete.','Σ deg(v)=2|E|','Pentru un triunghi cu 3 vârfuri și 3 muchii, fiecare vârf are gradul 2. Suma gradelor este 6=2×3.','Un graf are 7 muchii. Cât este suma gradelor?','14.'],
 ['Arbori și conectivitate','Un arbore este un graf neorientat conex, fără cicluri. Cu n vârfuri are exact n−1 muchii și un singur drum simplu între orice două vârfuri.','|E|=|V|−1 pentru arbore','Dacă un arbore are 8 vârfuri, are 7 muchii. Un graf cu 8 vârfuri și 7 muchii nu este automat arbore dacă nu este conex.','Câte muchii are un arbore cu 15 vârfuri?','14.'],
 ['Recurențe și complexitate','O relație de recurență definește un termen sau cost algoritmic folosind termeni anteriori. Complexitatea trebuie analizată în raport cu mărimea intrării.','T(n)=T(n−1)+1 ⇒ T(n)=Θ(n)','Dacă un algoritm scade n cu 1 la fiecare pas până la 0, efectuează n pași, deci durata crește liniar.','Cât crește T(n) dacă T(n)=2T(n/2)+n pentru n putere a lui 2?','Θ(n log n).']
 ]
 },
 {
 analysis:[
 ['Spații normate și convergență','Norma măsoară mărimea unui vector, iar o succesiune converge când distanța normată față de limită tinde la zero. Proprietățile depind de spațiul ales.','||x+y|| ≤ ||x||+||y||','În R², norma euclidiană a vectorului (3,4) este √(9+16)=5. Inegalitatea triunghiului limitează norma sumei.','Calculează norma vectorului (5,12).','13.'],
 ['Operatori liniari și continuitate','Un operator liniar păstrează adunarea și înmulțirea cu scalari. În spații normate, mărginirea este echivalentă cu continuitatea pentru operatorii liniari.','T(ax+by)=aT(x)+bT(y)','Operatorul T(x,y)=(2x,3y) este liniar. Pentru (1,2) obținem (2,6).','Verifică dacă T(x)=x+1 este liniar.','Nu, T(0)=1, dar orice operator liniar duce zero în zero.'],
 ['Metode numerice și eroare','Metodele numerice aproximează soluții greu de calculat exact. Erorile de rotunjire și de metodă trebuie diferențiate; verificăm convergența și precizia.','x_{n+1}=x_n−f(x_n)/f′(x_n)','Pentru f(x)=x²−2 și x₀=1,5, pasul Newton este 1,5−0,25/3 ≈1,4167, mai aproape de √2.','Fă un pas Newton pentru f(x)=x²−4, x₀=3.','3−5/6≈2,1667.']
 ],
 statistics:[
 ['Interval de încredere pentru medie','Un interval de încredere estimează un parametru din date, iar interpretarea sa frecventistă privește procedura de eșantionare repetată. Sunt necesare ipotezele de model și eșantionare.','IC≈x̄±1,96·σ/√n (σ cunoscut, condiții potrivite)','Dacă x̄=50, σ=10, n=100, marja aproximativă 95% este 1,96. Intervalul este [48,04,51,96].','Pentru x̄=20, σ=5, n=25, care este marja 95% aproximativă?','1,96.'],
 ['Testarea unei ipoteze','Un test statistic compară datele cu un model nul. Valoarea p nu este probabilitatea ca ipoteza nulă să fie adevărată și nu măsoară direct importanța practică.','p=P(statistică cel puțin la fel de extremă | H₀)','Dacă p=0,03 și pragul stabilit este 0,05, respingem H₀ conform regulii testului; nu afirmăm că H₀ are șansă 3% să fie adevărată.','La p=0,12 și α=0,05, respingem H₀?','Nu; nu există suficiente dovezi pentru respingere la acel prag.'],
 ['Regresie liniară și reziduuri','Regresia ajustează o relație între variabile, dar asocierea nu dovedește cauzalitatea. Reziduurile sunt diferențele dintre valorile observate și cele estimate.','reziduu = y_observat − y_estimat','Dacă modelul prezice 11 și observația este 14, reziduul este +3. Inspectăm reziduurile pentru erori sistematice și valori extreme.','Modelul estimează 8, observația este 6. Care este reziduul?','−2.']
 ],
 discrete:[
 ['Numărări și incluziune-excluziune','Pentru două mulțimi, elementele comune sunt numărate de două ori când adunăm cardinalele. Scădem cardinalul intersecției pentru a obține reuniunea.','|A∪B|=|A|+|B|−|A∩B|','Din 20 elevi care studiază A și 15 care studiază B, 5 le studiază pe ambele. Reuniunea conține 20+15−5=30 elevi.','Dacă |A|=12, |B|=9, |A∩B|=4, cât este |A∪B|?','17.'],
 ['Drumuri minime în grafuri','Algoritmul Dijkstra determină drumuri minime pentru muchii cu ponderi nenegative. Fiecărui vârf i se atribuie o distanță estimată, actualizată prin relaxarea muchiilor.','d(v) ← min(d(v), d(u)+w(u,v))','Pentru A→B cost 2, B→C cost 3 și A→C cost 8, drumul A→B→C costă 5, mai puțin decât muchia directă de 8.','Care este costul minim de la A la C în exemplu?','5.'],
 ['Probabilitate combinatorică','Într-un spațiu finit cu rezultate echiprobabile folosim combinații și aranjamente pentru a număra evenimentele. Condiția de echiprobabilitate trebuie justificată.','P(E)=|E|/|Ω|','Alegem 2 persoane din 5 fără ordine: C(5,2)=10 perechi. Dacă două persoane anume trebuie să fie alese, există o singură pereche favorabilă, deci P=1/10.','Alege 2 obiecte din 4 uniform. Probabilitatea unei perechi anume?','1/C(4,2)=1/6.']
 ]
 }
];
