// Ten original lower-secondary fourth-phase Mathematics worked chapters, advisory.
export const MATH_LOWER_YEAR4_EXTRA={
  "algebra": [
    [
      "Solving a system by elimination",
      "Sistem de două ecuații prin eliminare",
      "Într-un sistem de ecuații, aceeași pereche de necunoscute trebuie să satisfacă ambele relații. Putem aduna ecuațiile pentru a elimina o necunoscută, apoi verificăm soluția.",
      "x+y=12; x−y=4",
      "Adunăm ecuațiile x+y=12 și x−y=4: obținem 2x=16, deci x=8. Apoi y=4. Verificăm 8+4=12 și 8−4=4.",
      "Rezolvă x+y=9, x−y=1.",
      "x=5, y=4."
    ],
    [
      "Factorisation of simple quadratics",
      "Factorizarea expresiilor pătratice simple",
      "Pentru x²+bx+c căutăm două numere cu suma b și produsul c. Scriem apoi produsul a două paranteze și verificăm dezvoltându-le.",
      "x²+5x+6=(x+2)(x+3)",
      "Pentru x²+7x+12 alegem 3 și 4: suma este 7, produsul 12. Rezultă (x+3)(x+4), iar dezvoltarea reproduce expresia inițială.",
      "Factorizează x²+6x+8.",
      "(x+2)(x+4)."
    ],
    [
      "Slope of a straight-line graph",
      "Panta unei drepte din două puncte",
      "Panta arată variația verticală raportată la variația orizontală între două puncte ale unei drepte. Pentru puncte cu abscise diferite folosim diferențele coordonatelor.",
      "m=(y₂−y₁)/(x₂−x₁), x₂≠x₁",
      "Pentru A(1,2) și B(3,8), diferența pe verticală este 6 și pe orizontală este 2. Panta dreptei este 6/2=3.",
      "Află panta dreptei prin (0,1) și (2,5).",
      "2."
    ],
    [
      "Exponential growth through repeated doubling",
      "Creștere exponențială prin dublare",
      "Într-un proces de dublare, fiecare pas înmulțește cantitatea precedentă cu doi. Formula cu putere este un model pentru ritmul constant, nu o presupunere valabilă în orice situație.",
      "N(n)=N₀×2ⁿ",
      "Pornim cu 3 celule și presupunem dublare la fiecare etapă. După trei etape avem 3×2³=24. Enumerarea 3,6,12,24 confirmă calculul.",
      "Pornind de la 5, cât obții după două dublări?",
      "20."
    ]
  ],
  "geometry": [
    [
      "Similar triangles and scale factors",
      "Triunghiuri asemenea și factorul de scară",
      "Triunghiurile asemenea au unghiuri corespunzătoare egale și laturi în același raport. Factorul de scară transformă toate lungimile, dar nu schimbă unghiurile.",
      "a₂/a₁=b₂/b₁=c₂/c₁=k",
      "Un triunghi cu laturile 3,4,5 cm se mărește de două ori și obținem 6,8,10 cm. Raportul fiecărei perechi de laturi este 2.",
      "Un segment de 7 cm este mărit cu factorul 3. Cât devine?",
      "21 cm."
    ],
    [
      "Area of a circle sector",
      "Aria unui sector de cerc",
      "Aria unui sector circular este proporțională cu unghiul său la centru. Pentru un unghi exprimat în grade, înmulțim aria discului cu raportul unghiului la 360°.",
      "A_sector=α/360°×πr²",
      "Un sector de 90° dintr-un disc cu raza 4 cm reprezintă un sfert din aria 16π cm². Aria sectorului este 4π cm².",
      "Află aria sectorului de 180° pentru raza 3 cm.",
      "9π/2 cm²."
    ],
    [
      "Volume of a cylinder",
      "Volumul cilindrului circular drept",
      "Volumul unui cilindru circular drept este produsul dintre aria bazei circulare și înălțimea perpendiculară pe bază. Nu confundăm volumul cu aria suprafeței.",
      "V=πr²h",
      "Pentru raza r=2 cm și înălțimea h=5 cm, aria bazei este 4π cm², iar volumul 4π×5=20π cm³.",
      "Calculează volumul cilindrului cu r=3 cm și h=2 cm.",
      "18π cm³."
    ],
    [
      "Space diagonal of a rectangular box",
      "Diagonala spațială a unui paralelipiped",
      "Diagonala spațială a paralelipipedului dreptunghic unește două vârfuri opuse. Aplicăm de două ori Pitagora, folosind dimensiunile perpendiculare.",
      "d=√(L²+l²+h²)",
      "Pentru o cutie cu dimensiunile 2, 3 și 6 cm, pătratul diagonalei este 4+9+36=49, deci diagonala măsoară 7 cm.",
      "Află diagonala pentru laturile 3, 4 și 12 cm.",
      "13 cm."
    ]
  ],
  "statistics": [
    [
      "The complement rule in probability",
      "Regula evenimentului complementar",
      "Evenimentul complementar cuprinde toate rezultatele care nu aparțin evenimentului inițial. Cele două probabilități însumează unu dacă experimentele sunt descrise de același model.",
      "P(non A)=1−P(A)",
      "Dacă P(A)=0,35, atunci probabilitatea să nu apară A este 1−0,35=0,65. Verificăm suma 0,35+0,65=1.",
      "Dacă P(A)=0,8, cât este P(non A)?",
      "0,2."
    ],
    [
      "Quartiles and the middle half of data",
      "Cuartile și jumătatea centrală a datelor",
      "Cuartilele împart un set ordonat de observații în părți, iar intervalul intercuartilic măsoară întinderea jumătății centrale. Convenția de calcul trebuie precizată.",
      "IQR=Q₃−Q₁",
      "Pentru datele ordonate 1,2,3,4,5,6,7,8 folosim mediana fiecărei jumătăți: Q₁=(2+3)/2=2,5; Q₃=(6+7)/2=6,5. IQR=4.",
      "Dacă Q₁=4 și Q₃=11, cât este IQR?",
      "7."
    ]
  ]
};
