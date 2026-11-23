// Hungary grade 5: original supplementary lessons aligned to NAT 2020 themes.
// Cross-reference: OH-MAT05TA textbook, not a claim of exhaustive chapter coverage.
// https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat
// https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA
const SOURCE='https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat';
const MANUAL='https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA';
const DATA={
 algebra:[
 ['Valoarea pozițională și ordonarea numerelor naturale','Helyiérték és a természetes számok','La un număr natural, poziția cifrei determină ordinul ei: unități, zeci, sute și așa mai departe. Comparăm întâi numărul de cifre, apoi cifrele de la stânga la dreapta.','43 208 = 40 000 + 3 000 + 200 + 8','Pentru 43 208 și 43 280, primele trei cifre coincid. La zeci avem 0 și 8, deci 43 208 < 43 280.','Descompune 65 407 și compară cu 65 470.','60 000 + 5 000 + 400 + 7; 65 407 < 65 470.'],
 ['Operații și ordinea efectuării calculelor','Műveleti sorrend','Folosim mai întâi parantezele, apoi înmulțirea și împărțirea, iar la urmă adunarea și scăderea. Operațiile cu aceeași prioritate se efectuează în ordinea apariției.','28 − 3 × (6 + 2) = 4','Calculăm în paranteză 6+2=8. Înmulțim 3×8=24. Scădem 28−24=4.','Calculează 45 − 5 × (3+4).','10.'],
 ['Multipli, divizori și reguli de divizibilitate','Többszörösök és osztók','Numărul a este divizibil cu b nenul dacă împărțirea a:b are restul zero. Un număr divizibil cu 2 se termină în cifră pară; cu 5 se termină în 0 sau 5; cu 3 are suma cifrelor divizibilă cu 3.','126 : 3 = 42','Suma cifrelor lui 126 este 1+2+6=9; de aceea 126 este divizibil cu 3. Nu este divizibil cu 5 deoarece ultima cifră nu este 0 sau 5.','Verifică dacă 345 este divizibil cu 3, cu 5 și cu 2.','Cu 3 și cu 5, dar nu cu 2.'],
 ['Fracții: părți egale și fracții echivalente','Törtek és egyenértékű törtek','Numitorul arată în câte părți egale este împărțit întregul, iar numărătorul câte părți luăm. Amplificarea și simplificarea cu același factor nenul păstrează valoarea fracției.','2/3 = 4/6','Înmulțim numărătorul 2 și numitorul 3 cu 2: obținem 4/6. Ambele fracții reprezintă aceeași parte din întreg.','Simplifică 9/12 și află 1/4 din 28.','3/4; 7.'],
 ['Adunarea și scăderea fracțiilor cu același numitor','Azonos nevezőjű törtek összeadása','Pentru fracții cu același numitor, adunăm sau scădem numărătorii și păstrăm numitorul. Rezultatul poate fi simplificat dacă termenii au un divizor comun.','3/8 + 2/8 = 5/8','Cele două fracții se referă la optimi egale. Adunăm părțile: 3+2=5 și obținem cinci optimi.','Calculează 7/12 − 5/12 și simplifică.','2/12 = 1/6.'],
 ['Numere zecimale și măsurători','Tizedes törtek','Zecimalele folosesc poziții de zecimi, sutimi și miimi. La adunare și scădere aliniem virgulele pentru a grupa ordine egale.','2,35 + 1,4 = 3,75','Scriem 1,4 ca 1,40; adunăm sutimi cu sutimi și zecimi cu zecimi: 2,35+1,40=3,75.','Calculează 7,2 − 0,85.','6,35.']
 ],
 geometry:[
 ['Punct, dreaptă, semidreaptă și segment','Pont, egyenes, félegyenes, szakasz','Dreapta se prelungește în ambele direcții fără sfârșit, semidreapta are un punct de origine, iar segmentul are două capete. Numai segmentul are lungime finită măsurabilă între capete.','AB = 5 cm','Marcăm două puncte A și B la distanță de 5 cm și le unim cu rigla. Figura AB este un segment, nu întreaga dreaptă care îl conține.','Desenează un segment CD de 7 cm și marchează mijlocul M. Cât măsoară CM?','3,5 cm.'],
 ['Unghiuri și măsurarea cu raportorul','Szögek mérése','Un unghi are două laturi semidrepte cu aceeași origine. Măsurăm deschiderea dintre ele în grade, pornind de la zero pe scala corectă a raportorului.','unghi drept = 90°','Un unghi de 40° este ascuțit deoarece este mai mic de 90°. Unul de 120° este obtuz, fiind între 90° și 180°.','Clasifică 25°, 90°, 150°.','Ascuțit, drept, obtuz.'],
 ['Dreptunghiul și pătratul: perimetru și arie','Téglalap és négyzet','Perimetrul este lungimea conturului, iar aria măsoară suprafața. Dreptunghiul are laturi opuse egale și patru unghiuri drepte; pătratul are și toate laturile egale.','P=2(a+b); A=a×b','La un dreptunghi de 8 cm și 3 cm, perimetrul este 2×(8+3)=22 cm, iar aria este 8×3=24 cm². Unitățile diferă.','Află perimetrul și aria unui pătrat cu latura 6 cm.','24 cm; 36 cm².'],
 ['Corpuri geometrice și volum prin cuburi unitate','Testek és térfogat','Un corp geometric ocupă spațiu. Volumul poate fi înțeles numărând cuburile unitate așezate fără goluri și fără suprapunere într-o cutie dreptunghiulară.','V = lungime × lățime × înălțime','O cutie cu 3 cuburi pe lungime, 2 pe lățime și 4 pe înălțime conține 3×2×4=24 cuburi unitate.','Câte cuburi de 1 cm³ încap într-o cutie de 5×2×3 cm?','30 cuburi; 30 cm³.']
 ],
 statistics:[
 ['Tabele și frecvențe','Adatok és gyakoriság','Un tabel ordonează observațiile. Frecvența absolută a unei valori este numărul aparițiilor ei; suma frecvențelor trebuie să fie egală cu numărul total al observațiilor.','f(2)=3 în șirul 2,4,2,5,2','Numărăm fiecare valoare: 2 apare de trei ori, 4 o dată și 5 o dată. În total sunt cinci observații.','Află frecvențele valorilor 1, 3 din șirul 1,3,1,1,3.','f(1)=3; f(3)=2.'],
 ['Citirea diagramelor cu bare','Oszlopdiagramok','Într-o diagramă cu bare, lungimea sau înălțimea unei bare reprezintă cantitatea categoriei, pe o scară comună. Verificăm întotdeauna unitățile și gradațiile axei.','diferență = valoare mare − valoare mică','Dacă bara pentru luni arată 12 cărți și cea pentru marți 7, diferența este 12−7=5 cărți. Nu interpretăm diferența ca procent.','O categorie are 14 voturi și alta 9. Câte voturi în plus?','5 voturi.'],
 ['Media aritmetică a unor date','Számtani közép','Media aritmetică este suma valorilor împărțită la numărul lor. Este relevantă pentru cantități comparabile și nu trebuie confundată cu valoarea cea mai frecventă.','media = (a+b+c)/3','Pentru 5, 7 și 9, suma este 21 și media 21/3=7.','Calculează media numerelor 4, 6, 8, 10.','7.']
 ]
};
export const HUNGARY_GRADE5_SOURCES=Object.freeze({curriculum:SOURCE,manual:MANUAL});
export function hungaryGrade5Lessons(topic){
 return (DATA[String(topic||'')]||[]).map((r,i)=>({
  id:'math-hu-5-'+topic+'-'+String(i+1).padStart(2,'0'),
  country:'HU',grade:'5',stage:'lower',subject:'math',level:'beginner',phase:1,
  topic,title:r[0],enTitle:r[1],statement:r[2],formula:r[3],worked:r[4],
  practice:r[5],answers:r[6],aliases:[],source:SOURCE,
  sourceStatus:'nat2020-topic-reviewed',curriculumCompletion:'partial-source-review',
  manualExample:MANUAL
 }));
}
