// Extra original learning cards for the fifth and sixth general primary phases.
// Europe-wide OPTIONAL learning aids, not official national yearly syllabuses.
// Seven fields: English title, Romanian title, explanation, formula, worked example, practice, answer.
export const MATH_DEPTH_PRIMARY_56_EXTRA=[
  {
    "arithmetic": [
      [
        "Decimal multiplication using place value",
        "Înmulțirea numerelor zecimale prin descompunere",
        "Înmulțirea unui număr zecimal cu un număr natural poate fi făcută prin descompunere în unități și zecimi. Poziția virgulei trebuie verificată prin estimare.",
        "2,4 × 3 = (2 + 0,4) × 3",
        "Înmulțim separat: 2 × 3 = 6 și 0,4 × 3 = 1,2. Adunăm 6 + 1,2 = 7,2. Estimarea 2,4 × 3 între 6 și 9 confirmă ordinul de mărime.",
        "Calculează 1,6 × 4.",
        "6,4."
      ],
      [
        "Improper fractions and mixed numbers",
        "Fracții supraunitare și numere mixte",
        "O fracție supraunitară poate fi scrisă ca un număr natural și o fracție subunitară. Împărțirea numărătorului la numitor indică partea întreagă și restul.",
        "9/4 = 2 + 1/4",
        "Împărțim 9 la 4: câtul este 2, restul este 1. De aceea 9/4 = 2 întregi și 1/4. Verificăm: 2 × 4 + 1 = 9.",
        "Transformă 13/5 într-un număr mixt.",
        "2 și 3/5."
      ],
      [
        "Divisibility checks without dividing",
        "Criterii de divizibilitate fără împărțire",
        "Un număr natural este divizibil cu 3 dacă suma cifrelor este divizibilă cu 3; pentru 5, ultima cifră trebuie să fie 0 sau 5. Fiecare criteriu are propria regulă.",
        "1+3+2=6 ⇒ 132 este divizibil cu 3",
        "Pentru 132 adunăm cifrele: 1+3+2=6, multiplu de 3. Numărul nu este divizibil cu 5, deoarece se termină în 2. Nu confundăm cele două criterii.",
        "Este 234 divizibil cu 3 și cu 5?",
        "Cu 3, da; cu 5, nu."
      ],
      [
        "Comparing fractions by a common denominator",
        "Compararea fracțiilor cu numitor comun",
        "Fracțiile pozitive cu numitori diferiți pot fi comparate după aducerea la un numitor comun. Fracția cu numărătorul mai mare este mai mare dacă numitorii sunt identici.",
        "5/6 = 10/12 > 9/12 = 3/4",
        "Transformăm 5/6 în 10/12 și 3/4 în 9/12. Comparăm numărătorii: 10 > 9. Prin urmare 5/6 este mai mare decât 3/4.",
        "Compară 7/8 și 5/6 folosind numitorul 24.",
        "7/8 > 5/6, deoarece 21/24 > 20/24."
      ]
    ],
    "geometry": [
      [
        "Parallel and perpendicular lines",
        "Drepte paralele și perpendiculare pe caroiaj",
        "Două drepte paralele din același plan nu se intersectează; două drepte perpendiculare formează un unghi drept. Verificăm proprietățile prin desen sau echer.",
        "Dreptunghi: AB ∥ CD; AB ⟂ BC",
        "Într-un dreptunghi ABCD, laturile opuse AB și CD sunt paralele. Laturile vecine AB și BC formează 90°, deci sunt perpendiculare.",
        "Cum sunt laturile opuse ale unui dreptunghi?",
        "Paralele."
      ],
      [
        "Finding the third angle of a triangle",
        "Determinarea unui unghi lipsă din triunghi",
        "Suma unghiurilor interioare ale unui triunghi din plan este 180 de grade. Pentru un unghi necunoscut, scădem din 180 suma unghiurilor cunoscute.",
        "A+B+C=180°",
        "În triunghiul ABC știm A=50° și B=60°. Calculăm C=180°−50°−60°=70°. Verificăm prin adunare: 50°+60°+70°=180°.",
        "Două unghiuri sunt 40° și 65°. Află al treilea.",
        "75°."
      ],
      [
        "Rotational symmetry of a rectangle",
        "Simetria prin rotație a dreptunghiului",
        "O figură are simetrie prin rotație dacă o întoarcere cu un unghi mai mic de 360 de grade o suprapune peste ea însăși. Dreptunghiul nesquare se suprapune după o jumătate de tură.",
        "Jumătate de tură = 180°",
        "Un dreptunghi de 6 cm pe 4 cm, rotit cu 180° în jurul centrului, ocupă aceeași poziție. O rotație de 90° nu îl suprapune, fiindcă laturile au lungimi diferite.",
        "Care este cea mai mică rotație pentru un dreptunghi nepătrat?",
        "180°."
      ],
      [
        "Adding areas of non-overlapping rectangles",
        "Aria unei figuri compuse din dreptunghiuri",
        "Aria unei figuri compuse din părți fără suprapunere este suma ariilor părților. Trebuie să folosim aceeași unitate și să evităm numărarea de două ori a unei zone.",
        "A_total=A₁+A₂",
        "Dacă două dreptunghiuri nu se suprapun și au dimensiunile 4 cm × 3 cm și 2 cm × 5 cm, ariile sunt 12 și 10 cm². Aria totală este 22 cm².",
        "Două părți au ariile de 14 cm² și 9 cm². Cât este aria totală?",
        "23 cm²."
      ]
    ],
    "measurement": [
      [
        "Elapsed time across an hour boundary",
        "Durata dintre două ore",
        "Pentru a calcula o durată, numărăm mai întâi până la următoarea oră întreagă, apoi restul intervalului. Orele și minutele trebuie tratate în sistemul de 60 de minute.",
        "1 h = 60 min",
        "De la 14:35 până la 15:00 sunt 25 min, iar de la 15:00 la 16:10 sunt 70 min. În total 95 min, adică 1 h și 35 min.",
        "Cât durează intervalul 08:45–10:20?",
        "1 h 35 min."
      ],
      [
        "Converting square metres to square centimetres",
        "Transformarea metrului pătrat în centimetri pătrați",
        "La conversia ariilor, factorul de lungime se ridică la pătrat. Deoarece un metru are o sută de centimetri, un metru pătrat conține zece mii de centimetri pătrați.",
        "1 m² = 10 000 cm²",
        "Un dreptunghi cu laturile de 1 m și 2 m are aria 2 m². În centimetri, laturile sunt 100 și 200, iar produsul este 20 000 cm².",
        "Transformă 0,5 m² în cm².",
        "5 000 cm²."
      ],
      [
        "Kilograms and grams in decimal form",
        "Kilograme și grame cu numere zecimale",
        "Masa poate fi exprimată în kilograme și grame. Pentru a schimba kilogramele în grame înmulțim cu 1000; pentru operații de adunare, unificăm mai întâi unitățile.",
        "1 kg = 1000 g",
        "O masă de 2,75 kg este 2 kg și 750 g, deci 2750 g. Adăugarea a încă 250 g dă exact 3000 g sau 3 kg.",
        "Transformă 4,06 kg în grame.",
        "4060 g."
      ],
      [
        "Simple scale drawings",
        "Scara desenelor și a planurilor",
        "Scara 1:n înseamnă că o unitate pe desen corespunde la n unități în realitate. Se folosesc aceleași unități înainte de transformarea răspunsului.",
        "Scara 1:100 ⇒ 1 cm pe plan = 100 cm reali",
        "La scara 1:100, un segment desenat de 5 cm corespunde în realitate la 5 × 100 = 500 cm, adică 5 m. Scriem unitatea în rezultat.",
        "La scara 1:100, cât înseamnă 7 cm pe plan?",
        "7 m."
      ]
    ]
  },
  {
    "arithmetic": [
      [
        "Ordering decimals with different digit counts",
        "Ordonarea zecimalelor cu cifre diferite",
        "Adăugarea de zerouri la dreapta părții zecimale nu schimbă valoarea. Comparăm pe rând unitățile, zecimile, sutimile și miimile pentru a nu confunda lungimea scrierii cu mărimea.",
        "0,450 = 0,45 > 0,405",
        "Rescriem 0,45 ca 0,450. Comparăm cu 0,405: la zecimi sunt egale, dar la sutimi 5 > 0, deci 0,450 este mai mare.",
        "Compară 0,5 și 0,49.",
        "0,5 > 0,49."
      ],
      [
        "Sharing a total in a given ratio",
        "Împărțirea unei cantități într-un raport",
        "Pentru a distribui un total într-un raport a:b, numărăm a+b părți egale. O parte valorează total/(a+b); apoi înmulțim cu a, respectiv cu b.",
        "25 în raport 2:3 ⇒ 25/5=5 pentru o parte",
        "Raportul 2:3 conține 5 părți. Dacă avem 25 de jetoane, o parte este 5 jetoane, iar grupurile vor primi 10 și 15. Verificăm suma 10+15=25.",
        "Împarte 30 în raportul 3:2.",
        "18 și 12."
      ],
      [
        "Fractions converted to percentages",
        "Transformarea fracțiilor în procente",
        "Pentru a exprima o fracție ca procent, transformăm raportul în sutimi ori înmulțim valoarea fracției cu 100%. Rezultatul arată partea dintr-un întreg de o sută de unități.",
        "3/8 = 0,375 = 37,5%",
        "Împărțim 3 la 8 și obținem 0,375. Înmulțind cu 100, aflăm 37,5%. Verificăm că este mai mic decât 50%, fiindcă 3/8 < 1/2.",
        "Ce procent este 1/8?",
        "12,5%."
      ],
      [
        "Temperatures above and below zero",
        "Temperaturi pozitive și negative",
        "Pe axa numerelor, temperatura sub zero se notează cu semn minus. O creștere se calculează ca diferență între valoarea finală și cea inițială, inclusiv când traversăm zero.",
        "ΔT=T_final−T_inițial",
        "Temperatura crește de la −3°C la +4°C. Calculăm 4−(−3)=7°C. Numărând pe axă trei trepte până la zero și patru după zero, obținem tot șapte.",
        "Cât crește temperatura de la −6°C la +2°C?",
        "8°C."
      ]
    ],
    "geometry": [
      [
        "Circumference using a radius",
        "Lungimea cercului din rază",
        "Lungimea cercului descrie conturul, nu suprafața discului. Ea este de două ori produsul lui π cu raza; răspunsul exact se poate exprima în multipli de π.",
        "L=2πr",
        "Pentru raza r=3 cm, lungimea cercului este L=2×π×3=6π cm, aproximativ 18,85 cm. Aria ar avea unități pătrate, nu centimetri.",
        "Află lungimea exactă a cercului cu r=5 cm.",
        "10π cm."
      ],
      [
        "Parallelogram area from base and height",
        "Aria paralelogramului din bază și înălțime",
        "Aria paralelogramului este produsul bazei cu înălțimea perpendiculară pe aceasta, nu produsul a două laturi oblice. Unitatea de măsură este pătrată.",
        "A=b×h",
        "Dacă baza măsoară 8 cm și înălțimea perpendiculară 5 cm, aria este 8×5=40 cm². O translație a unui triunghi lateral îl transformă într-un dreptunghi echivalent.",
        "Baza este 7 cm, înălțimea 6 cm. Calculează aria.",
        "42 cm²."
      ],
      [
        "Nets and faces of a cuboid",
        "Desfășurarea unui paralelipiped dreptunghic",
        "Desfășurarea unui corp prezintă fețele sale plane, fără suprapunere, astfel încât pot fi pliate înapoi în corp. Paralelipipedul dreptunghic are trei perechi de fețe opuse congruente.",
        "Număr de fețe = 6",
        "O cutie cu laturile 2, 3 și 4 cm are două fețe de 2×3, două de 2×4 și două de 3×4 cm. Sunt șase dreptunghiuri, dintre care cele opuse au aceleași dimensiuni.",
        "Din câte fețe pătrate este alcătuit un cub?",
        "6 fețe pătrate."
      ],
      [
        "Checking angles of a triangle",
        "Verificarea unghiurilor unui triunghi",
        "Suma unghiurilor interioare ale unui triunghi este 180°. Dacă cele trei valori propuse nu însumează 180°, datele nu pot reprezenta un triunghi plan valid.",
        "A+B+C=180°",
        "Pentru A=55° și B=65°, al treilea unghi este 180°−55°−65°=60°. Verificarea este 55+65+60=180, deci valorile sunt posibile.",
        "Poate un triunghi să aibă unghiuri de 80°, 70° și 40°?",
        "Nu; suma este 190°."
      ]
    ],
    "statistics": [
      [
        "Mean from a frequency table",
        "Media calculată dintr-un tabel de frecvențe",
        "Într-un tabel de frecvențe, fiecare valoare este înmulțită cu numărul aparițiilor sale. Adunăm produsele și împărțim la numărul total de observații, nu la numărul valorilor diferite.",
        "Media=Σ(valoare×frecvență)/Σfrecvențe",
        "Valoarea 3 apare de două ori, iar 4 de trei ori. Suma este 3×2+4×3=18, iar observațiile sunt 5. Media corectă este 18/5=3,6.",
        "Valoarea 2 apare de două ori, iar 5 de trei ori. Află media.",
        "3,8."
      ],
      [
        "Median of an even-numbered data set",
        "Mediana unui șir cu număr par de valori",
        "Mai întâi ordonăm observațiile. La un număr par de date, mediana este media aritmetică a celor două valori centrale; nu alegem doar una dintre ele.",
        "Mediana=(x_mijloc1+x_mijloc2)/2",
        "Pentru 2, 4, 8 și 10, cele două valori centrale sunt 4 și 8. Media lor este (4+8)/2=6. Valoarea 6 nu trebuie să apară în șir.",
        "Află mediana numerelor 1, 3, 9, 11.",
        "6."
      ],
      [
        "Finding the mode in repeated observations",
        "Modul unui set de date",
        "Modul este valoarea care apare cel mai des într-un set de date. Unele seturi pot avea mai multe moduri sau niciun mod unic; pentru numărare verificăm toate frecvențele.",
        "Modul = valoarea cu frecvența maximă",
        "În lista 2, 2, 3, 5, 5, 5, numărul 5 apare de trei ori, iar 2 de două ori. Prin urmare, modul unic este 5.",
        "Află modul listei 1, 1, 4, 4, 4.",
        "4."
      ],
      [
        "Reading a graph with a shortened axis",
        "Citirea graficelor cu axa trunchiată",
        "Unele diagrame încep axa verticală de la o valoare nenulă, ceea ce poate face diferențe mici să pară mari. Creșterea reală este diferența valorilor citite de pe axă.",
        "Δ=valoarea finală−valoarea inițială",
        "Un grafic începe la nivelul 100 și se termină la 110. Creșterea este 10 unități, indiferent cât de înaltă pare bara pe axa trunchiată.",
        "Un grafic urcă de la 75 la 90. Care este creșterea?",
        "15 unități."
      ]
    ]
  }
];
