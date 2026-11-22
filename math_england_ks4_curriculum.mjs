// England GCSE Key Stage 4: independently written supplementary learning cards.
// DfE specifies KS4 as a key stage, NOT a statutory Year 10 / Year 11 split.
// Year assignment below is a usable advisory progression, not a school scheme.
// Source: https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study
// GCSE: https://www.gov.uk/government/publications/gcse-mathematics-subject-content-and-assessment-objectives
const cards={
 Y10:{
  algebra:[
   ['Standard form','Forma standard a numerelor',
    'Forma standard exprimă numere foarte mari ori mici folosind un factor cu modulul între 1 și 10 și o putere întreagă a lui zece. Respectăm semnul exponentului și ordinea de mărime.',
    'a×10ⁿ cu 1≤|a|<10',
    'Numărul 430 000 se scrie 4,3×10⁵ deoarece mutăm virgula cinci poziții spre stânga. Numărul 0,0043 devine 4,3×10⁻³.',
    'Scrie 0,00072 în formă standard.','7,2×10⁻⁴.'],
   ['Bounds from rounding','Limitele unei mărimi rotunjite',
    'O valoare rotunjită reprezintă un interval al valorilor inițiale. Jumătate din unitatea de rotunjire determină marginea inferioară și superioară, cu extremitatea superioară exclusă în regula uzuală.',
    'x rotunjit la unități este 12 ⇒ 11,5≤x<12,5',
    'Un segment raportat ca 8,4 cm la o zecimală poate avea lungimea reală de la 8,35 cm inclusiv până la 8,45 cm exclusiv. Nu raportăm 8,4 drept exact.',
    'Ce interval are 5,2 kg rotunjit la 0,1 kg?','5,15≤m<5,25 kg.'],
   ['Percentage increase and decrease','Creșteri și reduceri procentuale',
    'Un procent este o proporție dintr-o valoare de bază. La o creștere înmulțim cu 1+p, la o reducere cu 1−p, unde p este fracția procentului; două variații succesive se aplică la baze diferite.',
    'nou=vechi×(1+p/100)',
    'Un preț de £80 crește cu 15%. Calculăm 80×1,15=£92. Dacă scade ulterior cu 15%, noul preț este £78,20, nu £80.',
    'Un produs de £50 scade cu 20%. Cât costă?','£40.'],
   ['Factorising a quadratic','Descompunerea unei expresii pătratice',
    'Pentru o expresie monică de forma x²+bx+c căutăm două numere cu suma b și produsul c. Factorii se verifică prin înmulțire; metoda se extinde cu alte procedee când coeficientul lui x² nu este unu.',
    'x²+5x+6=(x+2)(x+3)',
    'Pentru x²−7x+12 căutăm −3 și −4, care au suma −7 și produsul 12. Obținem (x−3)(x−4).',
    'Descompune x²+8x+15.','(x+3)(x+5).']
  ],
  functions:[
   ['Direct and inverse proportion','Proporționalitate directă și inversă',
    'În proporționalitatea directă raportul y/x este constant pentru x nenul, iar în cea inversă produsul xy este constant. Identificarea modelului cere verificarea datelor și a contextului.',
    'y=kx sau y=k/x, x≠0',
    'Trei caiete costă £6, deci la preț constant șase caiete costă £12: prețul este proporțional direct cu numărul lor.',
    'Dacă 4 muncitori termină aceeași lucrare în 6 ore cu randament egal, cât fac 8?','3 ore.'],
   ['Solving linear inequalities','Inecuații liniare și schimbarea sensului',
    'La rezolvarea inecuațiilor aplicăm operații echivalente ca la ecuații, dar înmulțirea ori împărțirea cu un număr negativ schimbă sensul semnului. Verificăm soluția pe axă.',
    '−2x<6 ⇒ x>−3',
    'Din 3x−5≤10 adunăm 5, împărțim la 3 pozitiv și obținem x≤5. Pentru −2x<6 împărțim la −2 și inversăm inegalitatea.',
    'Rezolvă −4x≥12.','x≤−3.'],
   ['Quadratic graphs from a table','Parabole construite din tabele de valori',
    'Graficul unei funcții pătratice este o parabolă. Calculăm câteva valori din ambele părți ale axei de simetrie, marcăm punctele și nu le legăm prin segmente drepte.',
    'y=x²−4, vârf (0,−4)',
    'Pentru x=−2,−1,0,1,2, valorile sunt 0,−3,−4,−3,0. Punctele sugerează simetria față de axa Oy și intersecțiile la ±2.',
    'Unde este vârful lui y=(x−1)²?','(1,0).']
  ],
  geometry:[
   ['Pythagoras in a right triangle','Aplicarea teoremei lui Pitagora',
    'Într-un triunghi dreptunghic, suma pătratelor catetelor este pătratul ipotenuzei. Identificăm mai întâi unghiul drept și ipotenuza, apoi calculăm rădăcina pozitivă.',
    'a²+b²=c², c ipotenuză',
    'O scară formează un triunghi dreptunghic cu catetele de 5 m și 12 m. Lungimea ei este √(25+144)=13 m.',
    'Catetele au lungimile 8 și 15 cm. Cât este ipotenuza?','17 cm.'],
   ['Scale drawings and bearings','Scări de reprezentare și direcții',
    'O scară 1:n compară lungimea de pe desen cu cea reală în aceeași unitate. Direcțiile de tip bearing se măsoară în sensul acelor de ceasornic de la nord și se notează cu trei cifre.',
    'd_real=n×d_hartă',
    'La scara 1:50 000, 3 cm reprezintă 150 000 cm, adică 1,5 km. Direcția est se scrie 090°.',
    'La scara 1:100 000, cât reprezintă 2 cm?','2 km.'],
   ['Volume of a prism','Volumul unei prisme',
    'O prismă are două baze congruente și paralele. Volumul este aria bazei înmulțită cu înălțimea perpendiculară; trebuie să păstrăm toate mărimile în aceleași unități.',
    'V=A_bază×h',
    'O prismă triunghiulară are baza cu aria 12 cm² și lungimea perpendiculară 7 cm. Volumul este 84 cm³.',
    'Prisma are baza de 20 cm² și înălțimea 4 cm. Calculează volumul.','80 cm³.']
  ],
  statistics:[
   ['Frequency tables and the mean','Tabele de frecvențe și media',
    'Un tabel de frecvențe arată câte observații au fiecare valoare. Media din date negrupate este suma produselor valoare×frecvență împărțită la suma frecvențelor.',
    'x̄=Σ(xᵢ fᵢ)/Σfᵢ',
    'Două note de 3 și trei note de 5 au media (2×3+3×5)/5=21/5=4,2. Nu împărțim la numărul valorilor distincte.',
    'O valoare 2 apare de 3 ori și 6 apare o dată. Care este media?','3.'],
   ['Experimental versus theoretical probability','Probabilitate experimentală și teoretică',
    'Probabilitatea teoretică se bazează pe modelul rezultatelor, iar cea experimentală pe frecvențe observate. Rezultatele obținute prin puține încercări nu trebuie să coincidă cu probabilitatea teoretică.',
    'P_exp(A)=număr apariții A / număr încercări',
    'La 50 de aruncări apar 18 rezultate de 6. Frecvența relativă este 18/50=0,36, diferită de probabilitatea teoretică 1/6 a unui zar echilibrat.',
    'Dacă apare de 7 ori un rezultat din 20 de încercări, află frecvența.','7/20=0,35.'],
   ['Two-way tables','Tabele cu două criterii',
    'Un tabel bidimensional înregistrează simultan două caracteristici. Totalurile pe rânduri și coloane trebuie să coincidă cu totalul general; o proporție condiționată folosește numitorul subgrupului.',
    'P(A|B)=n(A∩B)/n(B)',
    'Din 30 de elevi, 12 practică sport, iar 8 dintre aceștia merg la club. Proporția membrilor clubului între sportivi este 8/12=2/3.',
    'Într-un grup de 10 alergători, 4 poartă ochelari. Ce proporție?','4/10=0,4.']
  ]
 },
 Y11:{
  algebra:[
   ['Solving quadratics with the formula','Ecuații pătratice cu formula generală',
    'Ecuația ax²+bx+c=0 cu a nenul poate fi rezolvată folosind discriminantul. Rădăcinile reale există dacă discriminantul este nenegativ, iar valorile găsite se verifică în ecuația inițială.',
    'x=(−b±√(b²−4ac))/(2a)',
    'Pentru x²−3x−4=0 avem discriminant 9+16=25. Rădăcinile sunt (3±5)/2, adică 4 și −1.',
    'Rezolvă x²−5x+6=0.','x=2 sau x=3.'],
   ['Simultaneous linear equations','Sisteme de două ecuații liniare',
    'Un sistem cere valori care satisfac simultan ambele ecuații. Eliminarea ori substituția dau soluția, iar verificarea în fiecare ecuație previne erori de semn.',
    'x+y=7; x−y=1',
    'Adunăm ecuațiile și obținem 2x=8, deci x=4. Din prima rezultă y=3. Verificăm diferența 4−3=1.',
    'Rezolvă x+y=10 și x−y=4.','x=7, y=3.'],
   ['Fractional indices','Puterile cu exponent fracționar',
    'Pentru bază pozitivă, puterea cu exponent rațional este definită prin radical. Un exponent negativ indică inversul; condițiile de existență trebuie verificate pentru baze reale.',
    'a^(1/n)=ⁿ√a, a>0',
    'Pentru 16^(3/4), calculăm mai întâi rădăcina de ordin patru, 2, apoi 2³=8. Pentru 16^(−1/2) obținem 1/4.',
    'Calculează 27^(2/3).','9.'],
   ['Compound interest','Dobândă compusă și creștere repetată',
    'O rată procentuală repetată se aplică la noul capital în fiecare perioadă. Modelul de creștere exponențială presupune aceeași rată și neglijează taxe sau depuneri suplimentare.',
    'C_n=C_0(1+r)^n',
    'Pentru 1000 lei cu 5% anual, după doi ani capitalul devine 1000×1,05²=1102,50 lei, nu 1100 lei.',
    'Ce devine £200 la 10% anual după 2 ani?','£242.']
  ],
  functions:[
   ['Exponential growth and decay graphs','Grafice de creștere și descreștere exponențială',
    'Într-un model exponențial, o creștere procentuală constantă produce un raport constant între valori consecutive. Descreșterea exponențială nu ajunge la zero într-un număr finit de pași.',
    'y=a bˣ, a>0, b>0, b≠1',
    'Pentru y=2·3ˣ avem y(0)=2, y(1)=6 și y(2)=18. Raportul 3 este constant, spre deosebire de o funcție liniară.',
    'Pentru y=100·0,5ˣ află y(2).','25.'],
   ['Graph transformation by translation','Translatarea graficului unei funcții',
    'Graficul lui f(x)+k se obține din cel al lui f prin translație verticală cu k unități. Graficul lui f(x−a) se deplasează orizontal spre dreapta cu a unități, dacă a este pozitiv.',
    'y=f(x−a)+k',
    'Din parabola y=x² obținem y=(x−2)²+3, cu vârf în (2,3). Substituția x−2 mută vârful la dreapta, nu la stânga.',
    'Care este vârful parabolei y=(x+1)²−4?','(−1,−4).'],
   ['Intersection of linear and quadratic graphs','Intersecția dreptei cu o parabolă',
    'Punctele de intersecție între două grafice satisfac ambele ecuații. Egalăm expresiile funcțiilor și rezolvăm ecuația obținută; numărul soluțiilor reale determină numărul de intersecții.',
    'x²=2x ⇒ x(x−2)=0',
    'Pentru y=x² și y=2x, obținem x=0 ori x=2. Coordonatele punctelor comune sunt (0,0) și (2,4).',
    'Intersecții între y=x² și y=4?','(−2,4) și (2,4).']
  ],
  geometry:[
   ['Similarity scale and volume ratio','Asemănare și raportul volumelor',
    'La corpuri asemenea, lungimile se multiplică prin factorul k, ariile prin k², iar volumele prin k³. Folosirea factorului liniar direct pentru volume este o eroare frecventă.',
    'V₂/V₁=k³',
    'Dacă muchia cubului crește de la 2 la 6 cm, factorul liniar este 3, iar volumul crește de 27 ori, de la 8 la 216 cm³.',
    'Volumele a două cuburi cu muchii 2 și 4 cm au ce raport?','1:8.'],
   ['Circle angle at the centre and circumference','Unghiuri la centru și pe cerc',
    'Unghiul la centru subîntins de același arc este dublul unghiului înscris pe cerc. Teorema se aplică numai când unghiurile se raportează la același arc.',
    '∠AOB=2∠ACB pentru același arc AB',
    'Dacă unghiul înscris ACB este 35° iar O este centrul cercului, unghiul la centru AOB pe același arc măsoară 70°.',
    'Ce măsură are unghiul înscris dacă unghiul la centru este 120°?','60°.'],
   ['Three-dimensional Pythagoras','Pitagora în spațiu',
    'Distanța dintre două vârfuri opuse ale unui paralelipiped dreptunghic se calculează aplicând teorema lui Pitagora de două ori, sau pe cele trei dimensiuni simultan.',
    'd=√(l²+w²+h²)',
    'Pentru un cub cu muchia 2 cm, diagonala spațială este √(4+4+4)=2√3 cm.',
    'Află diagonala unui paralelipiped cu l=3, w=4, h=12.','13.'],
   ['Sine and cosine rule','Teorema sinusurilor și cosinusurilor',
    'Într-un triunghi oarecare, teorema sinusurilor leagă laturi și unghiuri opuse, iar teorema cosinusurilor extinde Pitagora. Alegem formula în funcție de datele cunoscute.',
    'a²=b²+c²−2bc cos A',
    'Dacă b=c=5 și A=60°, obținem a²=25+25−50×0,5=25, deci a=5. Triunghiul este echilateral.',
    'Pentru b=c=3 și A=90°, cât este a?','3√2.']
  ],
  statistics:[
   ['Probability trees without replacement','Arbori de probabilitate fără înlocuire',
    'Într-un arbore de probabilitate, probabilitatea unui traseu este produsul probabilităților condiționate ale ramurilor. Fără înlocuire, numărul obiectelor rămase și totalul se modifică după prima extragere.',
    'P(A apoi B)=P(A)P(B|A)',
    'Dintr-un sac cu 3 bile roșii și 2 albastre extragem două fără înlocuire. Probabilitatea a două roșii este (3/5)×(2/4)=3/10.',
    'Din 4 roșii și 1 albastră, probabilitatea a două roșii fără înlocuire?','(4/5)×(3/4)=3/5.'],
   ['Cumulative frequency and median','Frecvența cumulată și mediana',
    'Frecvența cumulată numără observațiile până la o valoare sau limită de clasă. Mediana separă datele ordonate în două jumătăți; pentru intervale grupate este o estimare.',
    'n par: mediană=(xₙ/₂+xₙ/₂₊₁)/2',
    'Pentru valorile ordonate 2,3,5,8,10,12 avem șase observații. Mediana este media valorilor a treia și a patra: (5+8)/2=6,5.',
    'Care este mediana valorilor 1,4,7,9,10?','7.'],
   ['Histograms with unequal widths','Histograme cu clase de lățimi diferite',
    'Într-o histogramă, aria fiecărei bare reprezintă frecvența, nu înălțimea singură. Dacă intervalele au lățimi diferite, înălțimea este densitatea de frecvență.',
    'densitate=frecvență/lățime_clasă',
    'Un interval de lățime 4 cu frecvență 12 are densitatea 3. Altul de lățime 2 cu frecvență 10 are densitatea 5, deși prima clasă are mai multe observații.',
    'Pentru frecvența 18 și lățimea clasei 6, află densitatea.','3.']
  ]
 }
};
const exclusions={
 Y10:new Set(['Propoziții logice și tabele de adevăr','Inducția matematică și suma primelor numere',
 'Aria triunghiului din coordonate']),
 Y11:new Set(['Exponențiale și logaritmi','Domeniul funcțiilor logaritmice','Ecuații logaritmice și domenii',
 // AQA 8300 section A7 requires inverse functions at Higher tier; keep
 // their cards available and leave Foundation filtering to mathGcseSelectTier.
 'Teorema factorului pentru polinoame','Teorema restului polinomial','Ecuația cercului în coordonate',
 'Intersecțiile cercului cu axa Ox','Tangenta la un cerc','Grade și radiani',
 'Sinus și cosinus pe cercul unitate','Polinoame și gradul lor','Rădăcinile unui polinom',
 'Identitatea fundamentală','Transformări între radiani și grade','Ecuații trigonometrice cu tangentă',
 'Relații trigonometrice pentru unghiuri complementare','Împărțirea polinoamelor la x−a',
 'Ecuații exponențiale cu aceeași bază','Inecuații raționale și tabelul semnelor',
 'Distanța de la punct la dreaptă','Permutări fără repetiție','Combinări fără ordine'])
};
export const ENGLISH_KS4_REFERENCE=Object.freeze({
 ks4:'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study',
 gcse:'https://www.gov.uk/government/publications/gcse-mathematics-subject-content-and-assessment-objectives',
 note:'Source alignment is to the two-year GCSE key stage only; Year 10 versus Year 11 ordering is illustrative, not mandated.'
});
export function englandKS4CardRows(grade,topic){
 const g=String(grade),t=String(topic);
 return (cards[g]?.[t]||[]).map((row,i)=>({
  id:'math-gb-ks4-'+g.toLowerCase()+'-'+t+'-'+(i+1),subject:'math',
  stage:'intermediate',level:'intermediate',phase:g==='Y10'?1:2,topic:t,
  grade:g,country:'GB-ENG',title:row[1],enTitle:row[0],
  statement:row[2],formula:row[3],worked:row[4],practice:row[5],answers:row[6],
  sourceStatus:'official-topic-reviewed',curriculumCompletion:'partial-source-review',
  source:ENGLISH_KS4_REFERENCE.ks4,aliases:[]
 }));
}
export function englandKS4ExcludedTitles(grade){return exclusions[String(grade)]||new Set()}
export const ENGLAND_KS4_TOPICS=Object.freeze(Object.fromEntries(
 Object.entries(cards).map(([grade,bank])=>[grade,Object.freeze(Object.keys(bank))])
));

export const ENGLAND_KS4_LESSONS=Object.freeze(Object.fromEntries(
 Object.entries(cards).map(([grade,topics])=>[grade,Object.freeze(Object.fromEntries(
 Object.keys(topics).map(topic=>[topic,englandKS4CardRows(grade,topic)])))])));
export const ENGLAND_KS4_EXCLUDED_TITLES=Object.freeze(Object.fromEntries(
 Object.entries(exclusions).map(([grade,titles])=>[grade,Array.from(titles)])));
