// Ten original lower-secondary third-phase mathematics lessons; not a national syllabus.
export const MATH_LOWER_YEAR3_EXTRA={
  "algebra": [
    [
      "Expanding a product of sums",
      "Dezvoltarea produsului a două paranteze",
      "Aplicăm distributivitatea fiecărui termen din prima paranteză la fiecare termen din a doua. La final grupăm termenii asemenea, fără a omite produsele încrucișate.",
      "(x+a)(x+b)=x²+(a+b)x+ab",
      "Dezvoltăm (x+2)(x+3): x²+3x+2x+6=x²+5x+6. Verificăm pentru x=1: ambele expresii dau 12.",
      "Dezvoltă (x+1)(x+4).",
      "x²+5x+4."
    ],
    [
      "Square roots of perfect squares",
      "Rădăcini pătrate ale pătratelor perfecte",
      "Rădăcina pătrată aritmetică a unui număr nenegativ este numărul nenegativ al cărui pătrat este valoarea dată. Pentru pătrate perfecte găsim rezultatul exact.",
      "√81=9, deoarece 9²=81",
      "Calculăm √144. Deoarece 12×12=144 și 12 este nenegativ, rădăcina pătrată aritmetică este 12. Nu adăugăm −12 la rădăcina aritmetică.",
      "Calculează √169.",
      "13."
    ],
    [
      "Linear equations with fractions",
      "Ecuații liniare cu coeficienți fracționari",
      "Pentru o ecuație cu fracții putem înmulți ambii membri cu un numitor comun nenul, apoi rezolva ecuația echivalentă. Verificarea finală exclude greșelile de semn.",
      "x/3+2=5 ⇒ x=9",
      "Scădem 2 și obținem x/3=3. Înmulțim cu 3 pentru a găsi x=9; verificăm 9/3+2=5.",
      "Rezolvă x/4−1=3.",
      "x=16."
    ],
    [
      "Scientific notation for large numbers",
      "Scrierea numerelor mari în notație științifică",
      "Notația științifică scrie un număr mare drept produsul unui număr între 1 și 10 cu o putere a lui 10. Exponentul indică deplasarea virgulei.",
      "450000 = 4,5×10⁵",
      "Mutăm virgula din 450000 cinci poziții spre stânga și obținem 4,5. Factorul 10⁵ reconstruiește valoarea inițială.",
      "Scrie 7200000 în notație științifică.",
      "7,2×10⁶."
    ]
  ],
  "geometry": [
    [
      "Finding a missing side with Pythagoras",
      "Calculul unei catete cu teorema lui Pitagora",
      "Într-un triunghi dreptunghic, pătratul ipotenuzei este suma pătratelor catetelor. Pentru o catetă necunoscută scădem pătratul celeilalte catete din pătratul ipotenuzei.",
      "a=√(c²−b²)",
      "Ipotenuza are 13 cm, iar una dintre catete 5 cm. Cateta lipsă este √(169−25)=√144=12 cm. Verificăm 5²+12²=13².",
      "Ipotenuza este 10 cm, cateta cunoscută 6 cm. Află cealaltă.",
      "8 cm."
    ],
    [
      "Central angle and arc fraction",
      "Unghiul la centru și fracția de cerc",
      "Un unghi cu vârful în centrul cercului delimitează o parte din rotația completă. Raportul dintre măsura unghiului și 360° arată fracția din cerc corespunzătoare arcului.",
      "Fracție de cerc = unghi/360°",
      "Un unghi la centru de 120° reprezintă 120/360=1/3 din cerc. Arcul delimitat reprezintă aceeași treime din lungimea cercului.",
      "Ce fracție de cerc reprezintă un unghi la centru de 90°?",
      "1/4."
    ],
    [
      "Congruence in right triangles",
      "Congruența triunghiurilor dreptunghice",
      "Două triunghiuri dreptunghice cu ipotenuzele egale și câte o catetă corespunzătoare egală sunt congruente. Întâi verificăm existența unghiului drept în ambele.",
      "Ipotenuză-catetă: c₁=c₂ și a₁=a₂",
      "Două triunghiuri au fiecare ipotenuza 5 cm și o catetă 3 cm. Prin Pitagora, cealaltă catetă este 4 cm în fiecare, deci sunt congruente.",
      "Sunt congruente două triunghiuri dreptunghice cu ipotenuza 13 și cateta 5?",
      "Da, dacă aceste valori sunt corespunzătoare."
    ],
    [
      "Horizontal and vertical distances on a grid",
      "Distanțe orizontale și verticale pe coordonate",
      "Distanța dintre două puncte aflate pe aceeași linie orizontală este modulul diferenței absciselor. Pentru puncte de pe aceeași verticală folosim diferența ordonatelor.",
      "A(x₁,y), B(x₂,y) ⇒ AB=|x₂−x₁|",
      "Punctele (−2,3) și (5,3) au aceeași ordonată. Distanța este |5−(−2)|=7 unități; nu adunăm valorile cu semn fără a lua modulul.",
      "Cât este distanța dintre (2,−1) și (2,6)?",
      "7 unități."
    ]
  ],
  "statistics": [
    [
      "Relative frequency as an estimate of probability",
      "Frecvența relativă și estimarea probabilității",
      "Frecvența relativă este raportul dintre numărul aparițiilor unui rezultat și numărul total de încercări. Ea poate aproxima o probabilitate, dar fluctuează în eșantioane mici.",
      "f_rel = apariții / încercări",
      "La 40 de aruncări ale unei monede apare stema de 18 ori. Frecvența relativă este 18/40=0,45, nu neapărat probabilitatea teoretică 1/2.",
      "Din 50 încercări, un rezultat apare de 12 ori. Care este frecvența?",
      "0,24."
    ],
    [
      "Simple probability with a two-way table",
      "Probabilități din tabel cu două criterii",
      "Un tabel cu două criterii împarte observațiile în grupuri. Pentru probabilitatea unei categorii din întregul eșantion numărăm toate observațiile favorabile și le împărțim la total.",
      "P(A)=n(A)/N",
      "Din 20 de elevi, 8 aleg muzica, 12 sportul. Dacă alegem uniform un elev, probabilitatea să prefere muzica este 8/20=0,4.",
      "Din 30 de persoane, 9 aleg trenul. Care este probabilitatea experimentală?",
      "9/30=0,3."
    ]
  ]
};
