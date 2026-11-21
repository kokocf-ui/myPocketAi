// Original safe Grade VI Physics lab investigations, linked to the CURRENT chapter.
// These are guided educational activities, not an unlocked catalogue of advanced diagrams.
export function physicsGrade6Laboratories(topic){
 const all={
  units:[
   {title:'Măsoară o lungime cu rigla',en:'Measure length with a ruler',body:'# Ce descoperim\nCum aflăm și notăm corect lungimea unui obiect.\n\n# Materiale\nRigla gradată în milimetri, o carte sau un creion, caiet și creion de scris.\n\n# Pașii investigației\n1. Privește scala riglei și identifică marcajul zero și cel mai mic interval.\n2. Așază obiectul de-a lungul riglei fără să îl îndoi.\n3. Citește valoarea la ambele capete, privind perpendicular scala.\n4. Scade valoarea de la început din valoarea de la sfârșit.\n5. Repetă de trei ori și trece rezultatele într-un tabel cu unități.\n\n# Exemplu rezolvat\nDacă obiectul începe la 2 cm și se termină la 15 cm, lungimea este 15 − 2 = 13 cm.\n\n# Concluzie și întrebare\nDe ce nu este corect să scrii numai numărul 13? Pentru că lipsesc informațiile despre unitatea de măsură. Care este diviziunea minimă a riglei tale?'},
   {title:'Află aria unei suprafețe',en:'Measure a rectangular area',body:'# Ce descoperim\nAria arată cât de mare este o suprafață plană, nu cât spațiu ocupă un corp.\n\n# Materiale\nO coală dreptunghiulară de hârtie, riglă, caiet și creion.\n\n# Pașii investigației\n1. Măsoară lungimea foii în centimetri.\n2. Măsoară lățimea în centimetri.\n3. Calculează A = lungime × lățime.\n4. Scrie unitatea cm²: înmulțim cm cu cm, nu obținem cm³.\n5. Desenează un dreptunghi mic împărțit în pătrate pentru a înțelege de ce înmulțim.\n\n# Exemplu rezolvat\nO foaie cu laturile de 20 cm și 15 cm are aria 20 × 15 = 300 cm². Un metru pătrat are 10 000 cm², nu 100 cm².\n\n# Verifică înțelegerea\nCe se întâmplă cu aria dacă dublezi doar lungimea, păstrând lățimea?'},
   {title:'Determină volumul unei cutii',en:'Find the volume of a box',body:'# Ce descoperim\nVolumul arată spațiul ocupat de un corp. Spre deosebire de aria unei fețe, volumul necesită trei dimensiuni.\n\n# Materiale\nO cutie paralelipipedică, riglă, hârtie și creion.\n\n# Pașii investigației\n1. Măsoară lungimea, lățimea și înălțimea în aceeași unitate.\n2. Calculează V = lungime × lățime × înălțime.\n3. Scrie unitatea cm³ dacă ai măsurat în centimetri.\n4. Compară rezultatul cu aria bazei. Explică de ce nu au aceeași unitate.\n\n# Exemplu rezolvat\nPentru 10 cm × 5 cm × 4 cm obținem V = 200 cm³. Deoarece 1 cm³ = 1 mL, acest volum corespunde la 200 mL.\n\n# Verifică înțelegerea\nDacă dublezi numai înălțimea, cum se schimbă volumul?'},
   {title:'Repetă măsurarea timpului',en:'Repeat a timing experiment',body:'# Ce descoperim\nDouă măsurători ale aceluiași eveniment pot fi diferite din cauza reacției celui care folosește cronometrul.\n\n# Materiale\nUn cronometru, o jucărie care se deplasează sigur pe o masă și un caiet.\n\n# Pași\n1. Alege același punct de plecare și de sosire.\n2. Măsoară de trei ori durata.\n3. Notează fiecare rezultat în secunde.\n4. Calculează media aritmetică și identifică valoarea cea mai mică și cea mai mare.\n\n# Exemplu\nDuratele 4 s, 5 s și 6 s au media (4+5+6)/3 = 5 s.\n\n# Verifică înțelegerea\nDacă pornești cronometrul târziu de fiecare dată, media elimină eroarea? Nu: este nevoie să îmbunătățești metoda.'}
  ],
  kinematics:[
   {title:'Observă repausul și mișcarea',en:'Explore motion and reference frames',body:'# Întrebarea\nCând spunem că un obiect este în mișcare?\n\n# Materiale\nO jucărie pe roți, două repere fixe, un caiet.\n\n# Pași\n1. Alege un reper fix pe masă.\n2. Mută ușor jucăria și notează cum i se schimbă poziția față de reper.\n3. Desenează trei poziții succesive și o săgeată pentru sensul deplasării.\n4. Alege un reper care se deplasează odată cu jucăria. Compară descrierile.\n\n# Concluzie\nMișcarea și repausul se descriu întotdeauna față de un reper. Nu este nevoie de formule avansate pentru a observa fenomenul.'},
   {title:'Determină viteza medie',en:'Measure average speed',body:'# Întrebarea\nCum comparăm două mișcări pe același drum?\n\n# Materiale\nUn cărucior, o riglă sau ruletă, un cronometru.\n\n# Pași\n1. Marchează o distanță sigură de un metru.\n2. Măsoară durata deplasării căruciorului.\n3. Transformă toate valorile în metri și secunde.\n4. Calculează viteza medie = distanță / timp.\n5. Repetă și compară rezultatele.\n\n# Exemplu\nPentru 1 m în 2 s obținem 0,5 m/s.\n\n# Atenție\nNu susținem că viteza a fost aceeași în fiecare moment; rezultatul este o medie.'}
  ],
  dynamics:[
   {title:'Observă inerția în siguranță',en:'Observe inertia safely',body:'# Întrebarea\nDe ce un obiect tinde să își păstreze mișcarea?\n\n# Materiale\nUn cărucior ușor și o mică jucărie fixată pe el; o suprafață plană și liberă.\n\n# Pași\n1. Pune jucăria pe cărucior și împinge ușor căruciorul.\n2. Oprește-l lent cu mâna, fără să creezi un impact.\n3. Observă cum se poate deplasa jucăria față de cărucior.\n4. Notează ce s-a mișcat și ce forțe au intervenit.\n\n# Concluzie\nInerția este proprietatea de a rezista schimbării stării de mișcare. Nu o confundăm cu o forță care „împinge singură”.'}
  ],
  energy:[
   {title:'Urmărește transformările energiei',en:'Explore observable energy changes',body:'# Întrebarea\nCe se schimbă când ridicăm o jucărie pe o rampă?\n\n# Materiale\nO rampă mică stabilă, o bilă sau un cărucior, două semne pentru pornire.\n\n# Pași\n1. Lasă jucăria să coboare de la o înălțime mică.\n2. Observă cât de departe ajunge.\n3. Repetă pornind de la altă înălțime, fără alte schimbări.\n4. Descrie ce ai observat, apoi propune o explicație privind energia.\n\n# Concluzie\nEnergia nu apare din nimic; ea se transferă și se transformă. Frecarea poate influența deplasarea.'}
  ],
  heat:[
   {title:'Citește un termometru',en:'Read a thermometer',body:'# Întrebarea\nCum măsurăm temperatura fără să ne bazăm pe senzația de cald sau rece?\n\n# Materiale\nUn termometru de cameră sigur, un caiet și un ceas.\n\n# Pași\n1. Citește gradațiile și unitatea °C.\n2. Lasă termometrul în cameră până indică o valoare stabilă.\n3. Notează temperatura, ora și locul.\n4. Repetă într-un alt loc sigur; compară fără să atingi obiecte fierbinți.\n\n# Exemplu\n19 °C și 21 °C diferă cu 2 °C.\n\n# Concluzie\nTemperatura se citește cu un instrument potrivit, nu se deduce numai prin atingere.'}
  ],
  electric:[
   {title:'Observă electrizarea prin frecare',en:'Explore static charge',body:'# Întrebarea\nDe ce un balon frecat poate atrage bucăți de hârtie?\n\n# Materiale\nUn balon, o țesătură uscată și bucăți mici de hârtie.\n\n# Pași\n1. Așază hârtia pe masă.\n2. Freacă balonul de țesătură și apropie-l de hârtie fără să o atingi.\n3. Observă dacă hârtia se ridică.\n4. Repetă folosind o altă țesătură și notează diferențele.\n\n# Concluzie\nSarcina electrică se poate redistribui. Nu folosi prize sau alte surse electrice.'},
   {title:'Circuit simplu cu baterie școlară',en:'Build a school battery circuit',body:'# Întrebarea\nDe ce luminează un bec doar într-un circuit închis?\n\n# Materiale\nDoar în laboratorul școlii, sub supraveghere: baterie de joasă tensiune potrivită, bec corespunzător, fire cu izolație și întrerupător.\n\n# Pași\n1. Desenează întâi schema simplă.\n2. Profesorul verifică materialele și conexiunile.\n3. Observă ce se întâmplă când circuitul este închis și când este deschis.\n4. Scrie observațiile fără a modifica sursa de tensiune.\n\n# Concluzie\nCircuitul închis permite curentului să treacă. Nu încerca niciodată experiența cu o priză.'}
  ],
  electromagnetism:[
   {title:'Testează atracția dintre magneți',en:'Explore magnetic poles',body:'# Întrebarea\nCum se comportă doi poli magnetici apropiați?\n\n# Materiale\nDoi magneți școlari mici, agrafe metalice și o foaie.\n\n# Pași\n1. Apropie doi poli marcați cu aceeași literă și observă efectul.\n2. Apropie poli diferiți și notează ce se întâmplă.\n3. Testează ce obiecte mici sunt atrase de magnet.\n4. Compară observațiile cu predicția făcută înainte.\n\n# Concluzie\nPolii asemenea se resping, iar cei diferiți se atrag. Ține magneții departe de dispozitive medicale sau electronice sensibile.'}
  ],
  optics:[
   {title:'Cum apare umbra?',en:'Observe light and shadow',body:'# Întrebarea\nDe ce se formează umbra în spatele unui corp opac?\n\n# Materiale\nO lanternă obișnuită, o foaie de carton și un perete liber.\n\n# Pași\n1. Așază cartonul între lanternă și perete, fără să îndrepți lumina spre ochi.\n2. Observă conturul umbrei și desenează-l.\n3. Apropie cartonul de lanternă și compară mărimea umbrei.\n4. Încearcă o bucată de material translucid și descrie diferența.\n\n# Concluzie\nUn corp opac blochează lumina și formează o zonă umbrită. Acesta este un experiment introductiv, fără formule despre lentile sau optică geometrică avansată.'}
  ]
 };
 const reviewByLab={
  "Măsoară o lungime cu rigla": {
    "ro": [
      "O riglă arată începutul unui obiect la 3 cm și sfârșitul la 18 cm. Care este lungimea reală?",
      "Lungimea este 18 − 3 = 15 cm. Se scade marcajul de la început și se indică unitatea, deoarece obiectul nu începe la zero."
    ],
    "en": [
      "A ruler shows an object starting at 3 cm and ending at 18 cm. What is its length?",
      "18 − 3 = 15 cm. Subtract the starting mark and report centimetres."
    ]
  },
  "Află aria unei suprafețe": {
    "ro": [
      "O foaie dreptunghiulară are lungimea de 30 cm și lățimea de 10 cm. Ce arie are și în ce unitate o exprimi?",
      "Aria este 30 × 10 = 300 cm². Înmulțirea a două lungimi în centimetri produce centimetri pătrați, nu centimetri cubi."
    ],
    "en": [
      "A rectangular sheet is 30 cm long and 10 cm wide. Calculate its area and unit.",
      "30 × 10 = 300 cm². Multiplying two lengths gives square centimetres."
    ]
  },
  "Determină volumul unei cutii": {
    "ro": [
      "O cutie măsoară 6 cm în lungime, 4 cm în lățime și 5 cm în înălțime. Care este volumul în cm³ și mL?",
      "Volumul este 6 × 4 × 5 = 120 cm³. Pentru volume echivalente, 1 cm³ = 1 mL, deci 120 mL."
    ],
    "en": [
      "A box measures 6 cm by 4 cm by 5 cm. Give its volume in cm³ and mL.",
      "6 × 4 × 5 = 120 cm³, which is 120 mL because 1 cm³ equals 1 mL."
    ]
  },
  "Repetă măsurarea timpului": {
    "ro": [
      "Ai măsurat de trei ori același traseu: 3 s, 6 s și 9 s. Care este durata medie și de ce păstrăm toate citirile?",
      "Media este (3 + 6 + 9)/3 = 6 s. Păstrăm toate citirile pentru a observa variațiile și eventualele erori; media nu elimină erorile sistematice."
    ],
    "en": [
      "Three timings are 3 s, 6 s and 9 s. What is the mean and why keep every reading?",
      "(3 + 6 + 9)/3 = 6 s. Keep the readings to inspect variation and potential measurement error."
    ]
  },
  "Observă repausul și mișcarea": {
    "ro": [
      "Un elev stă pe scaun într-un autobuz care se deplasează. Este elevul în repaus sau în mișcare? Numește două repere.",
      "Elevul este în repaus față de scaunul autobuzului și în mișcare față de stația de pe stradă. Descrierea depinde de reper."
    ],
    "en": [
      "A pupil sits on a moving bus. Is the pupil at rest or moving? Name two reference frames.",
      "At rest relative to the bus seat, moving relative to a street stop. Motion depends on the reference frame."
    ]
  },
  "Determină viteza medie": {
    "ro": [
      "Un cărucior parcurge 1,2 m în 4 s. Calculează viteza medie și indică unitatea corectă.",
      "v = distanță / timp = 1,2 m / 4 s = 0,3 m/s. Este viteza medie pe interval, nu neapărat viteza în fiecare clipă."
    ],
    "en": [
      "A cart travels 1.2 m in 4 s. Find its average speed and unit.",
      "Average speed is 1.2 / 4 = 0.3 m/s; it need not be the speed at every instant."
    ]
  },
  "Observă inerția în siguranță": {
    "ro": [
      "De ce o jucărie nefixată poate continua înainte când căruciorul pe care se află este oprit ușor?",
      "Din cauza inerției, obiectul tinde să păstreze mișcarea anterioară. Nu există o forță specială care îl împinge singură înainte."
    ],
    "en": [
      "Why can an unsecured toy keep moving forward when its cart stops?",
      "Because of inertia, it tends to retain its previous motion; inertia is not an extra forward force."
    ]
  },
  "Urmărește transformările energiei": {
    "ro": [
      "De ce o jucărie care pornește mai sus pe o rampă poate ajunge la o viteză mai mare? De unde provine energia?",
      "La înălțime mai mare are mai multă energie potențială gravitațională față de baza rampei, care se poate transforma în energie cinetică. Frecarea și celelalte condiții modifică rezultatul."
    ],
    "en": [
      "Why may a toy released higher on a ramp travel faster? Where does that energy come from?",
      "Greater initial gravitational potential energy can turn into kinetic energy; friction and conditions matter."
    ]
  },
  "Citește un termometru": {
    "ro": [
      "Un termometru indică 17 °C într-o cameră și 22 °C într-alta. Care este diferența de temperatură?",
      "Diferența este 22 − 17 = 5 °C. Menționăm unitatea, iar măsurarea se face cu instrumentul adecvat, nu doar după senzație."
    ],
    "en": [
      "One room reads 17 °C and another 22 °C. What is the temperature difference?",
      "22 − 17 = 5 °C. Report the unit and read the appropriate thermometer."
    ]
  },
  "Observă electrizarea prin frecare": {
    "ro": [
      "De ce un balon frecat poate atrage bucăți mici de hârtie care erau inițial neutre?",
      "Balonul electrizat poate produce redistribuirea sarcinilor în hârtie, iar interacțiunea electrică duce la atracție. Nu este nevoie de priză sau curent de rețea."
    ],
    "en": [
      "Why can a rubbed balloon attract small pieces of initially neutral paper?",
      "The charged balloon can polarize the paper, leading to electrical attraction; no mains power is involved."
    ]
  },
  "Circuit simplu cu baterie școlară": {
    "ro": [
      "Ce se întâmplă cu becul unui circuit școlar simplu atunci când întrerupătorul este deschis și de ce?",
      "Becul se stinge, deoarece traseul conductor se întrerupe. Experimentul se face numai cu o baterie de joasă tensiune adecvată și sub supraveghere."
    ],
    "en": [
      "What happens to the lamp when a school circuit switch is opened, and why?",
      "The lamp turns off because the conducting path is broken; use supervised low-voltage equipment."
    ]
  },
  "Testează atracția dintre magneți": {
    "ro": [
      "Ce observi când apropii doi poli nord ai magneților? Dar un pol nord de un pol sud?",
      "Doi poli de același fel se resping; doi poli diferiți se atrag. Încercarea trebuie descrisă prin observații, nu doar prin numele polilor."
    ],
    "en": [
      "What happens when two north magnetic poles approach? What about north and south?",
      "Like poles repel; unlike poles attract. Describe the observable interaction."
    ]
  },
  "Cum apare umbra?": {
    "ro": [
      "De ce apare o regiune întunecată pe perete când așezăm carton opac între lanternă și perete?",
      "Cartonul blochează propagarea directă a luminii. Pe perete, în zona în care lumina nu ajunge direct, apare umbra."
    ],
    "en": [
      "Why does a dark region appear on the wall when opaque card is placed in front of a torch?",
      "The card blocks the direct light path, creating a shadow on the wall."
    ]
  }
};
 return (all[String(topic||'')]||[]).map(lab=>{
  const review=reviewByLab[lab.title];
  if(!review)return {...lab,review:null};
  return {...lab,review:{
   ro:{prompt:review.ro[0],guide:review.ro[1]},
   en:{prompt:review.en[0],guide:review.en[1]}
  }};
 });
}
