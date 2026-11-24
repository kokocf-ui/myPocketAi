// Batches 5–8 (remaining 31 European jurisdictions) — additional original
// Mathematics concept lessons complementing the shared Batch 2 and Batch 3 banks.
// Ensures 6–7 year primary/lower-secondary tracks (IS, NO, LT, MT, SK, UA, BY, RU)
// and 5-year upper-secondary tracks (BG, SM) have >= 3 distinct, non-repeated
// concepts in every year/topic slot.
// Imported ONLY by curriculum_pack_catalog.mjs via math_batch{5..8}_*_2026.mjs
// (0 KB added to the Cloudflare Worker JS bundle).
// Row: [title, enTitle, statement, formula, worked, practice, answers, mistake]

export const B58_EXTRA_BANK = Object.freeze({
  // ------------------------------------------------ Primary year 7 (IS, NO)
  'b5p7a-scientific-order': [
    'Puteri ale lui 10, ordine de mărime și estimarea calculelor',
    'Powers of ten, order of magnitude and estimation',
    'Numerele foarte mari din geografie sau economie se citesc și se compară ușor cu ajutorul puterilor lui 10: 10³ = 1 000, 10⁶ = 1 000 000. Înainte de calculul exact, rotunjim factorii la cel mai apropiat ordin rotund pentru a verifica rapid dacă rezultatul obținut este plauzibil.',
    '10ⁿ = 10 · 10 · … · 10 (n factori);  a · 10ⁿ mută cifrele cu n ordine spre stânga',
    'Un buget local de 3 850 000 {cur} este aproape de 4 · 10⁶ {cur}. Pentru produsul 49 · 203 estimăm 50 · 200 = 10 000; calculul exact dă 9 947, foarte aproape de estimare, deci nu am greșit ordinul de mărime.',
    '1) Scrie ca produs cu o putere a lui 10: 7 000 000 și 450 000. 2) Estimează produsul 398 · 51 și apoi calculează exact.',
    '1) 7 · 10⁶ și 45 · 10⁴ (sau 4,5 · 10⁵); 2) estimare 400 · 50 = 20 000, exact 20 298.',
    'Numărarea greșită a zerourilor la înmulțirea a două numere rotunde (ex.: 400 · 50 scris 2 000 în loc de 20 000).'
  ],
  'b5p7g-scale-bearings': [
    'Scară pe hartă, direcții cardinale și trasee în plan',
    'Map scale, compass directions and plane paths',
    'Scara unei hărți 1 : k arată că 1 cm măsurat pe hartă corespunde la k cm în realitate. Direcțiile cardinale (nord 0°, est 90°, sud 180°, vest 270°) și caroiajul permit descrierea precisă a unui traseu și calcularea distanței parcurse.',
    'distanța reală = distanța pe hartă · k;  1 km = 100 000 cm',
    'Pe o hartă cu scara 1 : 50 000, două cabane sunt la 6 cm una de alta. În realitate distanța este 6 · 50 000 = 300 000 cm = 3 000 m = 3 km. Dacă mergem 2 km spre est și apoi 1,5 km spre nord, traseul pe potecă are 3,5 km.',
    '1) Pe o hartă 1 : 25 000, un traseu măsoară 8 cm. Câți kilometri are în realitate? 2) Ce lungime are pe aceeași hartă un pod de 500 m?',
    '1) 8 · 25 000 cm = 200 000 cm = 2 km; 2) 500 m = 50 000 cm, deci 50 000 : 25 000 = 2 cm.',
    'Uitarea transformării centimetrilor în metri sau kilometri după înmulțirea cu numitorul scării.'
  ],

  // ----------------------------------------- Lower secondary: statistics
  'b5l-stat-stem-dot': [
    'Diagrame cu puncte și diagrame tulpină–frunză',
    'Dot plots and stem-and-leaf plots',
    'Diagrama cu puncte și diagrama tulpină–frunză (stem-and-leaf) păstrează fiecare valoare individuală din șirul de date, arătând simultan forma distribuției, valorile extreme, modul și mediana. În diagrama tulpină–frunză, cifra zecilor formează tulpina, iar cifra unităților frunza, ordonată crescător.',
    'tulpină | frunze ordonate  (ex.: 3 | 2 5 8 reprezintă 32, 35, 38)',
    'Punctajele a 9 elevi sunt: 14, 17, 17, 21, 23, 26, 28, 30, 35. Tulpina 1 are frunzele 4, 7, 7; tulpina 2 are 1, 3, 6, 8; tulpina 3 are 0, 5. Mediana este a 5-a valoare, adică 23, iar modul este 17.',
    '1) Citește toate numerele din diagrama: 2 | 0 4 4; 3 | 1 6; 4 | 2. 2) Află mediana și amplitudinea acestui set de 6 date.',
    '1) 20, 24, 24, 31, 36, 42; 2) mediana = (24 + 31)/2 = 27,5; amplitudinea = 42 − 20 = 22.',
    'Calcularea medianei fără a ordona crescător frunzele pe fiecare rând al diagramei.'
  ],
  'b5l-stat-cumfreq': [
    'Frecvențe cumulate și percentile uzuale',
    'Cumulative frequency and percentiles',
    'Frecvența cumulată a unei valori (sau a unui interval) este suma frecvențelor tuturor valorilor mai mici sau egale cu acel prag. Frecvența relativă cumulată ajunge la 100% la ultima clasă și permite citirea directă a medianei (percentila 50) și a pragurilor P₂₅ și P₇₅.',
    'F_k = f_1 + f_2 + … + f_k;  F_rel,k = F_k / N',
    'Prețurile unor bilete (în {cur}) pentru 20 de călători sunt grupate astfel: 10 {cur} (4 bilete), 15 {cur} (7 bilete), 20 {cur} (6 bilete), 30 {cur} (3 bilete). Frecvențele cumulate sunt 4, 11, 17, 20. Cum a 10-a și a 11-a valoare cad în clasa de 15 {cur}, mediana este 15 {cur}, iar 17/20 = 85% dintre bilete costă cel mult 20 {cur}.',
    '1) Pentru frecvențele f = (3, 5, 8, 4), scrie șirul frecvențelor cumulate. 2) Ce procent din total se află în primele două clase?',
    '1) 3, 8, 16, 20; 2) 8/20 = 40%.',
    'Confundarea frecvenței clasei curente f_k cu frecvența cumulată F_k atunci când răspundem la întrebarea „cel mult cât”.'
  ],
  'b5l-stat-exp-theo': [
    'Frecvența relativă experimentală și probabilitatea teoretică',
    'Experimental relative frequency vs theoretical probability',
    'Când repetăm un experiment aleator în condiții identice de N ori și un eveniment apare de k ori, raportul k/N este frecvența relativă experimentală. Pe măsură ce numărul de încercări N crește mult, frecvența relativă se apropie de probabilitatea teoretică P(A).',
    'f_rel(A) = k / N;  pentru N mare, f_rel(A) ≈ P(A)',
    'La aruncarea unui zar echilibrat, probabilitatea teoretică de a obține fața 6 este 1/6 ≈ 0,167. În 12 aruncări putem obține fața 6 de 4 ori (4/12 = 0,333), dar în 600 de aruncări obținem de pildă 98 de apariții (98/600 ≈ 0,163), mult mai aproape de 1/6.',
    '1) O monedă este aruncată de 200 de ori și cade pajură de 106 ori. Calculează frecvența relativă și compar-o cu probabilitatea teoretică. 2) Dacă o urnă necunoscută a dat 74 bile roșii din 100 de extrageri cu întoarcere, estimează probabilitatea bilei roșii.',
    '1) 106/200 = 0,53, apropiată de 0,50; 2) aproximativ 0,74 (74%).',
    'A crede că după 5 pajuri consecutive urmează „obligatoriu” stema: aruncările sunt independente, fiecare având tot probabilitatea 1/2.'
  ],
  'b5l-stat-bias-graphs': [
    'Grafice înșelătoare și alegerea corectă a eșantionului',
    'Misleading graphs and sampling bias',
    'Un grafic statistic poate distorsiona vizual realitatea dacă axa verticală nu pornește de la 0 fără marcaj clar, dacă intervalele sunt inegale sau dacă se compară arii de pictograme în loc de înălțimi. La fel, un sondaj este nereprezentativ (părtinitor) dacă întreabă doar un subgrup nealeator.',
    'eșantion reprezentativ ⇒ selecție aleatorie din întreaga populație țintă',
    'Două magazine afișează prețul mediu al unui coș: 50 {cur} și 52 {cur}. Dacă axa verticală începe la 49 {cur}, bara de 52 {cur} pare de 3 ori mai înaltă decât cea de 50 {cur} (diferență 3 unități față de 1), deși creșterea reală este doar (52 − 50)/50 = 4%.',
    '1) Vânzările cresc de la 100 la 110 bucăți, dar axa graficului pornește de la 95. De câte ori pare mai înaltă a doua bară față de prima și cât este creșterea procentuală reală? 2) Este reprezentativ un sondaj despre sport făcut doar la intrarea în sala de înot?',
    '1) Bara are înălțimea 15 față de 5 (pare de 3 ori mai mare), dar creșterea reală este doar 10%; 2) Nu, eșantionul favorizează practicarea înotului.',
    'Evaluarea variației doar după înălțimea vizuală a barelor fără a verifica originea și scara axei verticale.'
  ],

  // ----------------------------------------- Lower secondary: algebra & geometry
  'b5l-alg-formulas-rearrange': [
    'Exprimarea unei mărimi necunoscute dintr-o formulă',
    'Rearranging formulas and changing the subject',
    'În fizică, geometrie și economie, aceeași relație leagă mai multe variabile. Pentru a exprima o variabilă în funcție de celelalte, aplicăm operațiile inverse în ambele membre ale egalității, păstrând echivalența și condițiile de numitor nenul.',
    'A = (B + b) · h / 2  ⇒  2A = (B + b)h  ⇒  B = 2A/h − b  (h ≠ 0)',
    'Din formula vitezei medii v = d / t (t > 0) scoatem distanța d = v · t și timpul t = d / v. Din formula temperaturii F = 1,8 · C + 32 scădem 32 și împărțim la 1,8: C = (F − 32) / 1,8; pentru F = 68 obținem C = 36 / 1,8 = 20 °C.',
    '1) Exprimă înălțimea h din aria triunghiului A = b · h / 2. 2) Din P = 2(L + l), exprimă lățimea l și calculeaz-o pentru P = 30 cm și L = 9 cm.',
    '1) h = 2A / b (b > 0); 2) l = P/2 − L = 15 − 9 = 6 cm.',
    'Împărțirea la coeficient înainte de a muta termenii adunați sau scăzuți (ex.: din ax + b = c a scrie greșit x + b = c/a).'
  ],
  'b5l-alg-direct-inverse-table': [
    'Mărimi direct și invers proporționale în tabele și modele',
    'Direct and inverse proportion in tables and models',
    'Două mărimi pozitive x și y sunt direct proporționale dacă raportul y / x = k rămâne constant, și invers proporționale dacă produsul x · y = k rămâne constant. Înainte de a aplica regula de trei simplă, verificăm întotdeauna care dintre cele două invarianțe are sens în problemă.',
    'direct: y = k · x (y₁/x₁ = y₂/x₂);   invers: x · y = k (x₁ · y₁ = x₂ · y₂)',
    'Dacă 4 caiete identice costă 18 {cur}, prețul este direct proporțional cu numărul de caiete: 10 caiete costă (18 / 4) · 10 = 45 {cur}. În schimb, dacă 3 pompe egale umplu un bazin în 8 ore, debitul total face timpul invers proporțional: 4 pompe îl umplu în (3 · 8) / 4 = 6 ore.',
    '1) Completează tabelul de proporționalitate directă: x = 2, 5, 9; pentru x = 2 avem y = 7. 2) 6 muncitori cu același ritm termină o lucrare în 10 zile. În câte zile o termină 15 muncitori?',
    '1) k = 3,5 ⇒ y = 7; 17,5; 31,5; 2) (6 · 10) / 15 = 4 zile.',
    'Aplicarea mecanică a proporției directe la probleme de debit sau viteză (unde produsul, nu raportul, rămâne constant).'
  ],
  'b5l-geo-locus-bisectors': [
    'Mediatoarea segmentului și bisectoarea unghiului ca locuri geometrice',
    'Perpendicular and angle bisectors as geometric loci',
    'Mediatoarea unui segment AB este dreapta perpendiculară pe AB în mijlocul său și reprezintă locul geometric al tuturor punctelor din plan egal depărtate de A și B. Bisectoarea unui unghi este semidreapta interioară care îl împarte în două unghiuri congruente și conține toate punctele egal depărtate de laturile unghiului.',
    'P ∈ mediatoarei lui [AB] ⇔ PA = PB;   P ∈ bisectoarei ∠XOY ⇔ d(P, OX) = d(P, OY)',
    'Dacă segmentul AB are 10 cm, mijlocul M se află la 5 cm de capete. Orice punct P situat pe perpendiculara în M cu PM = 12 cm are distanța până la A și B egală cu √(5² + 12²) = 13 cm.',
    '1) Un punct M pe mediatoarea lui [AB] are MA = 9 cm. Cât este MB? 2) Un unghi ∠AOB măsoară 74°, iar [OC este bisectoarea sa. Cât măsoară ∠AOC?',
    '1) MB = 9 cm; 2) 74° : 2 = 37°.',
    'Confundarea distanței de la un punct la o dreaptă (care se măsoară pe perpendiculară) cu un segment oblic oarecare.'
  ],
  'b5l-geo-inscribed-polygons': [
    'Cercul circumscris și cercul înscris într-un triunghi',
    'Circumcircle and incircle of a triangle',
    'Mediatoarele laturilor unui triunghi sunt concurente în centrul O al cercului circumscris (egal depărtat de cele trei vârfuri: OA = OB = OC = R). Bisectoarele unghiurilor sunt concurente în centrul I al cercului înscris (egal depărtat de laturi, la raza r), iar aria triunghiului verifică A = p · r, unde p este semiperimetrul.',
    'OA = OB = OC = R;  în triunghi dreptunghic R = ipotenuza / 2;  A = p · r, p = (a + b + c)/2',
    'Într-un triunghi dreptunghic cu catetele 6 cm și 8 cm, ipotenuza este 10 cm, deci raza cercului circumscris este R = 10 / 2 = 5 cm. Aria este (6 · 8)/2 = 24 cm², semiperimetrul p = (6 + 8 + 10)/2 = 12 cm, deci raza cercului înscris este r = A / p = 24 / 12 = 2 cm.',
    '1) Află R și r pentru triunghiul dreptunghic cu catetele 5 cm și 12 cm. 2) Unde se află centrul cercului circumscris unui triunghi obtuzunghic?',
    '1) ipotenuza = 13 cm ⇒ R = 6,5 cm; A = 30 cm², p = 15 cm ⇒ r = 2 cm; 2) În exteriorul triunghiului.',
    'Presupunerea că centrul cercului circumscris se află mereu în interiorul triunghiului (adevărat doar pentru triunghiurile ascuțitunghice).'
  ],

  // ----------------------------------------- Upper secondary: 5-year extensions
  'b5u-fn-piecewise-step': [
    'Funcții definite pe ramuri, partea întreagă și partea fracționară',
    'Piecewise, floor and fractional-part functions',
    'O funcție definită pe ramuri folosește expresii algebrice diferite pe subintervale disjuncte ale domeniului; continuitatea în punctul de racord cere egalitatea limitelor laterale. Partea întreagă ⌊x⌋ este cel mai mare număr întreg mai mic sau egal cu x, iar partea fracționară este {x} = x − ⌊x⌋ ∈ [0, 1).',
    '⌊x⌋ ∈ ℤ,  ⌊x⌋ ≤ x < ⌊x⌋ + 1;   {x} = x − ⌊x⌋ ∈ [0, 1)',
    'Un tarif de curierat este f(x) = 12 {cur} pentru x ∈ (0, 2] kg și f(x) = 12 + 4(x − 2) {cur} pentru x > 2 kg. La x = 2 kg ambele expresii dau 12 {cur} (racord continuu), iar pentru 4,5 kg costul este 12 + 4 · 2,5 = 22 {cur}. Pentru x = −2,3 avem ⌊−2,3⌋ = −3 și {−2,3} = −2,3 − (−3) = 0,7.',
    '1) Calculează ⌊3,8⌋, ⌊−1,2⌋ și {−1,2}. 2) Determină parametrul a ∈ ℝ astfel încât f(x) = 2x + a pentru x ≤ 1 și f(x) = x² + 3 pentru x > 1 să aibă aceleași valori laterale în x = 1.',
    '1) 3; −2; 0,8; 2) 2(1) + a = 1² + 3 ⇒ 2 + a = 4 ⇒ a = 2.',
    'Calcularea greșită a părții întregi pentru numere negative prin trunchiere spre zero (⌊−1,2⌋ este −2, nu −1).'
  ],
  'b5u-fn-parametric-models': [
    'Familii de funcții cu parametru real și intersecțiile graficelor',
    'Parameterized function families and graph intersections',
    'O familie de funcții f_m(x) depinde de un parametru real m. Putem determina punctele fixe prin care trec toate graficele familiei (grupând termenii care îl conțin pe m) și valorile parametrului pentru care graficul intersectează axele sau o dreaptă dată într-un număr cerut de puncte.',
    'f_m(x₀) = y₀ pentru orice m ∈ ℝ  ⇔  coeficientul lui m se anulează în x₀',
    'Pentru familia de parabole f_m(x) = x² − (m + 1)x + m, rescriem y = (x² − x) + m(1 − x). Dacă x = 1, termenul cu m dispare și y = 0, deci toate parabolele familiei trec prin punctul fix A(1, 0). Cum Δ = (m + 1)² − 4m = (m − 1)², parabola este tangentă axei Ox doar pentru m = 1.',
    '1) Găsește punctul fix al familiei de drepte y = m(x − 2) + 5. 2) Pentru ce valori ale lui m ∈ ℝ graficul lui f(x) = x² − 2x + m nu intersectează axa Ox?',
    '1) (2, 5); 2) Δ = 4 − 4m < 0 ⇒ m > 1.',
    'Uitarea verificării cazului în care coeficientul lui x² depinde de m și se anulează, transformând parabola într-o dreaptă.'
  ],
  'b5u-alg-vieta-symmetric': [
    'Relațiile lui Viète și expresii simetrice în rădăcinile ecuației',
    'Vieta’s formulas and symmetric expressions of roots',
    'Pentru ecuația de gradul al doilea ax² + bx + c = 0 (a ≠ 0) cu rădăcinile x₁ și x₂, suma rădăcinilor este S = x₁ + x₂ = −b/a și produsul este P = x₁x₂ = c/a. Orice expresie simetrică în x₁ și x₂ (precum x₁² + x₂² sau 1/x₁ + 1/x₂) se calculează direct din S și P fără a extrage radicalii.',
    'S = x₁ + x₂ = −b/a;  P = x₁x₂ = c/a;  x₁² + x₂² = S² − 2P;  x₁³ + x₂³ = S³ − 3SP',
    'Ecuația 2x² − 6x + 3 = 0 are Δ = 36 − 24 = 12 > 0, S = 3 și P = 3/2. Atunci x₁² + x₂² = 3² − 2 · (3/2) = 9 − 3 = 6, iar 1/x₁ + 1/x₂ = S / P = 3 / (3/2) = 2.',
    '1) Pentru x² − 5x + 2 = 0, calculează x₁² + x₂² și (x₁ − x₂)². 2) Formează ecuația de gradul al doilea ale cărei rădăcini au suma −4 și produsul 3.',
    '1) S = 5, P = 2 ⇒ x₁² + x₂² = 25 − 4 = 21; (x₁ − x₂)² = S² − 4P = 17; 2) x² + 4x + 3 = 0 (rădăcini −1 și −3).',
    'Aplicarea relațiilor lui Viète pentru condiții asupra rădăcinilor reale fără a impune și condiția de existență Δ ≥ 0.'
  ],
  'b5u-alg-modular-diophantine': [
    'Congruențe și ecuații diofantice liniare ax + by = c',
    'Modular congruences and linear Diophantine equations',
    'Ecuația cu necunoscute întregi ax + by = c admite soluții în ℤ² dacă și numai dacă cel mai mare divizor comun d = cmmdc(a, b) divide pe c. După împărțirea la d și găsirea unei soluții particulare (x₀, y₀), toate soluțiile întregi se obțin parametrizat cu k ∈ ℤ.',
    'd = (a, b) | c;  x = x₀ + (b/d)k,  y = y₀ − (a/d)k,  k ∈ ℤ',
    'Un atelier vinde bilete de 7 {cur} și de 5 {cur}, încasând 46 {cur}: 7x + 5y = 46. Cum (7, 5) = 1 | 46, observăm modulo 5 că 2x ≡ 1 (mod 5) ⇒ x ≡ 3 (mod 5). Pentru x₀ = 3 obținem y₀ = (46 − 21)/5 = 5. Soluția generală în ℤ: x = 3 + 5k, y = 5 − 7k; în numere naturale nenule rămâne x = 3, y = 5.',
    '1) Are ecuația 6x + 9y = 20 soluții întregi? Justifică. 2) Găsește toate soluțiile întregi ale ecuației 4x + 3y = 11.',
    '1) Nu, deoarece cmmdc(6, 9) = 3 nu divide 20; 2) Soluție particulară (2, 1) ⇒ x = 2 + 3k, y = 1 − 4k, k ∈ ℤ.',
    'Omiterea semnului opus la al doilea termen parametric (ambele scrise cu plus nu anulează suma a·(b/d)k − b·(a/d)k).'
  ],
  'b5u-geo-ellipse-hyperbola-foci': [
    'Proprietățile focale ale elipsei, hiperbolei și parabolei',
    'Focal properties of ellipse, hyperbola and parabola',
    'Conicele se definesc metric prin distanțe la focare: elipsa este locul punctelor cu suma distanțelor la focarele F₁(−c, 0) și F₂(c, 0) constantă 2a (c² = a² − b²); hiperbola are modulul diferenței distanțelor constant 2a (c² = a² + b²); parabola y² = 2px are distanța la focarul F(p/2, 0) egală cu distanța la directoarea x = −p/2.',
    'elipsă: x²/a² + y²/b² = 1, c² = a² − b², e = c/a < 1;   parabolă: y² = 2px, F(p/2, 0)',
    'Pentru elipsa x²/25 + y²/9 = 1 avem a = 5, b = 3, deci c = √(25 − 9) = 4, focarele F₁(−4, 0), F₂(4, 0), excentricitatea e = 4/5 = 0,8 și suma distanțelor oricărui punct al elipsei la focare este 2a = 10.',
    '1) Află focarele și excentricitatea elipsei x²/169 + y²/144 = 1. 2) Află focarul și directoarea parabolei y² = 12x.',
    '1) a = 13, b = 12 ⇒ c = 5, focare (±5, 0), e = 5/13; 2) 2p = 12 ⇒ p = 6, focar F(3, 0), directoare x = −3.',
    'Confundarea relației c² = a² − b² de la elipsă cu relația c² = a² + b² de la hiperbolă.'
  ],
  'b5u-stat-bayes-medical': [
    'Formula probabilității totale și teorema lui Bayes în decizii reale',
    'Law of total probability and Bayes’ theorem in real decisions',
    'Când spațiul evenimentelor este partiționat în ipoteze disjuncte H₁, …, H_n, probabilitatea unui rezultat observat B este suma ponderată P(B) = ∑ P(H_i)P(B | H_i). Teorema lui Bayes actualizează probabilitatea unei ipoteze după observarea lui B: chiar și un test foarte precis poate avea multe alarme false dacă fenomenul căutat este foarte rar.',
    'P(B) = ∑ P(H_i)P(B | H_i);   P(H_k | B) = P(H_k)P(B | H_k) / P(B)',
    'Într-o fabrică, linia H₁ produce 70% din piese cu 1% defecte, iar linia H₂ produce 30% cu 4% defecte. Probabilitatea unei piese defecte D este P(D) = 0,70 · 0,01 + 0,30 · 0,04 = 0,007 + 0,012 = 0,019 (1,9%). Dacă o piesă aleasă este defectă, probabilitatea să provină de pe H₂ este P(H₂ | D) = 0,012 / 0,019 = 12/19 ≈ 63,2%.',
    '1) Două urne: U₁ are 3 bile albe și 1 neagră, U₂ are 1 albă și 3 negre. Alegem o urnă la întâmplare și extragem o bilă albă. Care este probabilitatea că am ales urna U₁? 2) Cât era probabilitatea totală de a extrage o bilă albă?',
    '1) P(A) = 0,5 · (3/4) + 0,5 · (1/4) = 1/2; P(U₁ | A) = (3/8) / (1/2) = 3/4 = 75%; 2) 1/2 = 50%.',
    'Egalarea greșită a probabilității condiționate P(H | B) cu probabilitatea inversă P(B | H) (eroarea ratei de bază).'
  ]
});
