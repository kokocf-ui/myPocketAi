import {EXAM_REMAINING_BANK} from './exam_bank_remaining.mjs';
// Original exam practice bank; NOT official test papers, official grading or copyrighted exam content.
export const EXAM_LOCAL_BANK={
  "math": [
    {
      "id": "math-1",
      "prompt": "Care este rezultatul ecuației 3x + 5 = 20?",
      "choices": [
        "x = 3",
        "x = 4",
        "x = 5",
        "x = 6"
      ],
      "correct": 2,
      "explanation": "Scădem 5 și împărțim la 3: x = 5."
    },
    {
      "id": "math-2",
      "prompt": "Cât este 25% din 200?",
      "choices": [
        "25",
        "40",
        "50",
        "75"
      ],
      "correct": 2,
      "explanation": "25% = 1/4; 200 / 4 = 50."
    },
    {
      "id": "math-3",
      "prompt": "Un triunghi are unghiurile de 45° și 65°. Cât are al treilea unghi?",
      "choices": [
        "60°",
        "70°",
        "80°",
        "90°"
      ],
      "correct": 1,
      "explanation": "Suma unghiurilor este 180°; 180 − 45 − 65 = 70°."
    },
    {
      "id": "math-4",
      "prompt": "Care este aria dreptunghiului cu laturile 6 cm și 4 cm?",
      "choices": [
        "10 cm²",
        "20 cm²",
        "24 cm²",
        "48 cm²"
      ],
      "correct": 2,
      "explanation": "Aria = lungime × lățime = 6 × 4 = 24 cm²."
    },
    {
      "id": "math-5",
      "prompt": "Care este valoarea expresiei 2³ + 4?",
      "choices": [
        "10",
        "12",
        "14",
        "16"
      ],
      "correct": 1,
      "explanation": "2³ este 8, deci 8 + 4 = 12."
    },
    {
      "id": "math-6",
      "prompt": "Care este media aritmetică a numerelor 4, 6 și 8?",
      "choices": [
        "4",
        "5",
        "6",
        "7"
      ],
      "correct": 2,
      "explanation": "(4 + 6 + 8) / 3 = 6."
    }
  ],
  "romanian": [
    {
      "id": "romanian-1",
      "prompt": "În propoziția «Copiii citesc atent», ce parte de vorbire este «atent»?",
      "choices": [
        "Adverb",
        "Adjectiv",
        "Substantiv",
        "Pronume"
      ],
      "correct": 0,
      "explanation": "«Atent» determină verbul «citesc» și arată modul acțiunii."
    },
    {
      "id": "romanian-2",
      "prompt": "Care variantă conține o comparație?",
      "choices": [
        "Vântul șoptește",
        "Ochii sunt ca două stele",
        "Pădurea tace",
        "Soarele râde"
      ],
      "correct": 1,
      "explanation": "Construcția «ca două stele» exprimă o comparație explicită."
    },
    {
      "id": "romanian-3",
      "prompt": "Care este funcția sintactică a lui «cartea» în «Ana citește cartea»?",
      "choices": [
        "Subiect",
        "Atribut",
        "Complement direct",
        "Predicat"
      ],
      "correct": 2,
      "explanation": "«Cartea» răspunde la «ce citește Ana?»"
    },
    {
      "id": "romanian-4",
      "prompt": "Care propoziție este corect punctuată?",
      "choices": [
        "Maria vino aici.",
        "Maria, vino aici!",
        "Maria vino, aici.",
        "Maria vino aici!"
      ],
      "correct": 1,
      "explanation": "Vocativul «Maria» se izolează prin virgulă."
    },
    {
      "id": "romanian-5",
      "prompt": "Într-un rezumat fidel, ce informații se păstrează?",
      "choices": [
        "Toate citatele",
        "Doar opinia elevului",
        "Evenimentele esențiale în ordinea lor",
        "Detaliile irelevante"
      ],
      "correct": 2,
      "explanation": "Rezumatul redă ideile principale fără a adăuga evenimente."
    },
    {
      "id": "romanian-reading-1",
      "prompt": "Conform textului, ce obiect primește Mara de la bibliotecară?",
      "passage": "În fiecare dimineață, Mara trecea pe lângă biblioteca satului. Deși se grăbea spre școală, privea mereu ferestrele luminate. Într-o zi, a găsit ușa întredeschisă și un bilețel pe prag: „Cărțile așteaptă cititori curioși”. A intrat, iar bibliotecara i-a oferit un atlas vechi. Pe prima pagină, Mara a descoperit o hartă a locurilor pe care visa să le viziteze. După ore, s-a întors să împrumute cartea.",
      "choices": [
        "Un dicționar",
        "Un atlas vechi",
        "Un caiet de matematică",
        "O fotografie"
      ],
      "correct": 1,
      "explanation": "Textul spune explicit că bibliotecara i-a oferit un atlas vechi."
    },
    {
      "id": "romanian-reading-2",
      "prompt": "Ce sugerează faptul că Mara se întoarce după ore?",
      "choices": [
        "Curiozitatea și interesul pentru lectură",
        "Teama de a merge acasă",
        "Nevoia de a preda un caiet",
        "Dorința de a închide biblioteca"
      ],
      "correct": 0,
      "explanation": "Întoarcerea pentru a împrumuta atlasul susține interpretarea interesului pentru cărți și descoperire."
    },
    {
      "id": "romanian-reading-3",
      "prompt": "Din ce perspectivă este relatată întâmplarea?",
      "choices": [
        "Narator la persoana I",
        "Dialog exclusiv",
        "Narator la persoana a III-a",
        "Scrisoare adresată cititorului"
      ],
      "correct": 2,
      "explanation": "Narațiunea folosește forme precum „Mara trecea”, „a intrat” și „s-a întors”, la persoana a III-a."
    },
    {
      "id": "romanian-reading-4",
      "prompt": "Care este ideea principală a fragmentului?",
      "choices": [
        "Mara pierde drumul către școală",
        "Biblioteca este închisă definitiv",
        "Mara descoperă și împrumută o carte care îi trezește interesul",
        "Bibliotecara îi interzice intrarea"
      ],
      "correct": 2,
      "explanation": "Elementele esențiale sunt interesul Marei pentru bibliotecă, intrarea și descoperirea atlasului."
    },
    {
      "id": "romanian-reading-5",
      "prompt": "Care este cel mai fidel rezumat al textului?",
      "choices": [
        "Mara pleacă în jurul lumii cu bibliotecara",
        "Mara observă biblioteca, intră, descoperă un atlas și se întoarce să îl împrumute",
        "Mara scrie o scrisoare despre geografie",
        "Mara participă la un concurs de matematică"
      ],
      "correct": 1,
      "explanation": "Rezumatul păstrează succesiunea faptelor principale fără a inventa întâmplări."
    },
    {
      "id": "romanian-writing-1",
      "prompt": "Care structură este potrivită pentru un text argumentativ?",
      "choices": [
        "Opinia, argumentele susținute prin exemple, concluzia",
        "Concluzia, fără argumente",
        "Doar o listă de personaje",
        "Câteva citate fără legătură"
      ],
      "correct": 0,
      "explanation": "Textul argumentativ formulează o opinie, o susține prin argumente și exemple, apoi o încheie coerent."
    },
    {
      "id": "romanian-writing-2",
      "prompt": "Care formulare exprimă o concluzie susținută de argumentele anterioare?",
      "choices": [
        "În primul rând, voi începe textul.",
        "Așadar, lectura poate lărgi perspectiva, așa cum arată exemplele discutate.",
        "Nu știu despre ce am scris.",
        "Un personaj are un nume."
      ],
      "correct": 1,
      "explanation": "Concluzia reia ideea centrală și se sprijină pe argumentele prezentate."
    },
    {
      "id": "romanian-writing-3",
      "prompt": "Ce trebuie eliminat din rezumatul unui text narativ?",
      "choices": [
        "Evenimentele principale",
        "Ordinea logică a întâmplărilor",
        "Comentariile personale și episoadele inventate",
        "Personajele indispensabile înțelegerii"
      ],
      "correct": 2,
      "explanation": "Rezumatul este fidel și concis; nu introduce judecăți personale sau fapte care nu apar în operă."
    },
    {
      "id": "romanian-writing-4",
      "prompt": "Care enunț oferă un argument, nu doar o opinie?",
      "choices": [
        "Lectura este bună.",
        "Cred că lectura este importantă deoarece dezvoltă vocabularul și capacitatea de a înțelege perspective diferite.",
        "Nu-mi place nimic.",
        "Am scris trei rânduri."
      ],
      "correct": 1,
      "explanation": "Argumentul explică motivul și poate fi dezvoltat prin exemple sau dovezi."
    },
    {
      "id": "romanian-writing-5",
      "prompt": "Cum susții corect o interpretare literară?",
      "choices": [
        "Reproduci fără explicație un fragment",
        "Inventezi intenția autorului",
        "Indici o observație și o susții prin elemente concrete ale textului",
        "Ignori cerința și povestești altceva"
      ],
      "correct": 2,
      "explanation": "Interpretarea motivată leagă afirmația de dovezi din text și de cerința formulată."
    },
    {
      "id": "romanian-vocabulary-1",
      "prompt": "Care cuvânt este sinonim potrivit pentru „îndrăzneț” în contextul „un gest îndrăzneț”?",
      "choices": [
        "Curajos",
        "Somnoros",
        "Nesigur",
        "Vechi"
      ],
      "correct": 0,
      "explanation": "În context, „curajos” exprimă sens apropiat lui „îndrăzneț”."
    },
    {
      "id": "romanian-vocabulary-2",
      "prompt": "Care variantă este antonimul lui „limpede” în „o explicație limpede”?",
      "choices": [
        "Clară",
        "Precisă",
        "Confuză",
        "Scurtă"
      ],
      "correct": 2,
      "explanation": "„Confuză” este opusul lui „limpede” cu sensul de „clară, ușor de înțeles”."
    },
    {
      "id": "romanian-vocabulary-3",
      "prompt": "În „inima orașului”, cuvântul „inima” este folosit cu sens:",
      "choices": [
        "Medical, propriu",
        "Figurat, pentru centru",
        "De unitate de măsură",
        "De nume propriu"
      ],
      "correct": 1,
      "explanation": "Expresia folosește „inima” cu sens figurat pentru partea centrală a orașului."
    },
    {
      "id": "romanian-vocabulary-4",
      "prompt": "Care dintre enunțuri este scris corect?",
      "choices": [
        "Copiii sau întors acasă.",
        "Copiii s-au întors acasă.",
        "Copiii s au întors acasă.",
        "Copiii s-au întors acasă? (afirmație)"
      ],
      "correct": 1,
      "explanation": "„S-au” este forma corectă în construcția verbală „s-au întors”."
    },
    {
      "id": "romanian-vocabulary-5",
      "prompt": "Pentru a explica sensul cuvântului „rece” într-un text, verifici în primul rând:",
      "choices": [
        "Numărul de rânduri",
        "Contextul și referentul",
        "Lungimea titlului",
        "Numele imprimantei"
      ],
      "correct": 1,
      "explanation": "Același cuvânt poate descrie temperatura sau o atitudine; sensul se stabilește în context."
    }
  ],
  "english": [
    {
      "id": "english-1",
      "prompt": "Choose the correct sentence.",
      "choices": [
        "She go to school.",
        "She goes to school.",
        "She going school.",
        "She to go school."
      ],
      "correct": 1,
      "explanation": "Third-person singular present simple uses 'goes'."
    },
    {
      "id": "english-2",
      "prompt": "Complete: If it rains, we ___ inside.",
      "choices": [
        "stay",
        "stayed",
        "staying",
        "will staying"
      ],
      "correct": 0,
      "explanation": "In this general conditional, 'stay' is grammatical; 'will staying' is not."
    },
    {
      "id": "english-3",
      "prompt": "Which word is closest in meaning to «rapid»?",
      "choices": [
        "Slow",
        "Quick",
        "Heavy",
        "Silent"
      ],
      "correct": 1,
      "explanation": "«Quick» and «rapid» are synonyms."
    },
    {
      "id": "english-4",
      "prompt": "Choose the plural of «child».",
      "choices": [
        "Childs",
        "Childrens",
        "Children",
        "Childes"
      ],
      "correct": 2,
      "explanation": "«Child» has the irregular plural «children»."
    },
    {
      "id": "english-5",
      "prompt": "Which form is correct? «I have ___ my homework.»",
      "choices": [
        "do",
        "did",
        "does",
        "done"
      ],
      "correct": 3,
      "explanation": "Present perfect uses have + past participle «done»."
    }
  ],
  "science": [
    {
      "id": "science-1",
      "prompt": "Ce organit celular produce în principal ATP prin respirație aerobă?",
      "choices": [
        "Ribozomul",
        "Mitocondria",
        "Nucleolul",
        "Vacuola"
      ],
      "correct": 1,
      "explanation": "Mitocondria este locul principal al respirației celulare aerobe."
    },
    {
      "id": "science-2",
      "prompt": "Care este unitatea de măsură SI pentru forță?",
      "choices": [
        "Joule",
        "Watt",
        "Newton",
        "Pascal"
      ],
      "correct": 2,
      "explanation": "Forța se măsoară în newtoni, simbol N."
    },
    {
      "id": "science-3",
      "prompt": "Ce se păstrează într-o reacție chimică într-un sistem închis?",
      "choices": [
        "Masa totală",
        "Numărul moleculelor tuturor compușilor",
        "Culoarea",
        "Temperatura"
      ],
      "correct": 0,
      "explanation": "Legea conservării masei se aplică în sistem închis."
    },
    {
      "id": "science-4",
      "prompt": "Care proces transformă apa lichidă în vapori?",
      "choices": [
        "Solidificare",
        "Condensare",
        "Topire",
        "Evaporare"
      ],
      "correct": 3,
      "explanation": "Evaporarea este tranziția lichid → gaz."
    }
  ],
  "history": [
    {
      "id": "history-1",
      "prompt": "În ce an a avut loc Revoluția Franceză, considerată începută cu luarea Bastiliei?",
      "choices": [
        "1648",
        "1789",
        "1848",
        "1918"
      ],
      "correct": 1,
      "explanation": "Căderea Bastiliei a avut loc la 14 iulie 1789."
    },
    {
      "id": "history-2",
      "prompt": "Ce caracterizează o sursă istorică primară?",
      "choices": [
        "Relatare creată în epoca evenimentului",
        "Rezumat anonim modern",
        "Ficțiune fără bază documentară",
        "O interpretare fără referințe"
      ],
      "correct": 0,
      "explanation": "Sursa primară provine direct din epoca sau de la actorii evenimentului."
    },
    {
      "id": "history-3",
      "prompt": "Ce eveniment este asociat anului 1918 în istoria României?",
      "choices": [
        "Unirea Transilvaniei cu România",
        "Aderarea la UE",
        "Revoluția de la 1848",
        "Formarea Principatelor Unite"
      ],
      "correct": 0,
      "explanation": "Adunarea de la Alba Iulia a votat unirea la 1 decembrie 1918."
    },
    {
      "id": "history-4",
      "prompt": "Care a fost una dintre consecințele revoluției industriale?",
      "choices": [
        "Dispariția transportului",
        "Creșterea mecanizării producției",
        "Eliminarea orașelor",
        "Reducerea totală a comerțului"
      ],
      "correct": 1,
      "explanation": "Mecanizarea și urbanizarea au crescut în timpul revoluției industriale."
    }
  ],
  "history-geography": [
    {
      "id": "history-geography-1",
      "prompt": "Ce reprezintă o sursă primară pentru istorici?",
      "choices": [
        "O mărturie din epocă",
        "Un film de ficțiune recent",
        "Un rezumat fără citări",
        "O presupunere"
      ],
      "correct": 0,
      "explanation": "O sursă primară provine direct din perioada studiată."
    },
    {
      "id": "history-geography-2",
      "prompt": "Care coordonată arată poziția nord–sud?",
      "choices": [
        "Longitudinea",
        "Latitudinea",
        "Altitudinea",
        "Scara"
      ],
      "correct": 1,
      "explanation": "Latitudinea se măsoară față de Ecuator."
    },
    {
      "id": "history-geography-3",
      "prompt": "Ce reprezintă scara 1:100000 a unei hărți?",
      "choices": [
        "1 cm = 1 km în teren",
        "1 cm = 100 km",
        "1 cm = 10 m",
        "1 cm = 10 km"
      ],
      "correct": 0,
      "explanation": "100000 cm corespund la 1000 m, adică 1 km."
    },
    {
      "id": "history-geography-4",
      "prompt": "Care este rolul legendei hărții?",
      "choices": [
        "Ascunde date",
        "Explică simbolurile",
        "Schimbă nordul",
        "Stabilește frontiere noi"
      ],
      "correct": 1,
      "explanation": "Legenda explică semnele și culorile folosite."
    }
  ],
  "geography": [
    {
      "id": "geography-1",
      "prompt": "Ce reprezintă latitudinea?",
      "choices": [
        "Distanța față de nivelul mării",
        "Poziția nord–sud față de Ecuator",
        "Viteza vântului",
        "Scara hărții"
      ],
      "correct": 1,
      "explanation": "Latitudinea este unghiul față de planul Ecuatorului."
    },
    {
      "id": "geography-2",
      "prompt": "Care este cauza principală a anotimpurilor?",
      "choices": [
        "Distanța Pământ–Soare în fiecare lună",
        "Înclinarea axei terestre și mișcarea de revoluție",
        "Fazele Lunii",
        "Mișcarea plăcilor"
      ],
      "correct": 1,
      "explanation": "Axa înclinată schimbă unghiul radiației solare pe parcursul anului."
    },
    {
      "id": "geography-3",
      "prompt": "Ce este un afluent?",
      "choices": [
        "Un curs de apă care se varsă în alt curs de apă",
        "Vârful unui munte",
        "O formă de precipitație",
        "O mare interioară"
      ],
      "correct": 0,
      "explanation": "Un afluent aduce apă într-un alt curs de apă."
    },
    {
      "id": "geography-4",
      "prompt": "Ce arată o izohipsă?",
      "choices": [
        "Locuri cu aceeași temperatură",
        "Locuri cu aceeași altitudine",
        "Locuri cu aceeași populație",
        "Limite de fus orar"
      ],
      "correct": 1,
      "explanation": "Curbele de nivel unesc puncte de aceeași altitudine."
    }
  ],
  "physics": [
    {
      "id": "physics-1",
      "prompt": "O forță de 10 N acționează asupra unui corp de 2 kg. Ce accelerație rezultă?",
      "choices": [
        "2 m/s²",
        "5 m/s²",
        "10 m/s²",
        "20 m/s²"
      ],
      "correct": 1,
      "explanation": "A doua lege Newton: a = F/m = 10/2 = 5 m/s²."
    },
    {
      "id": "physics-2",
      "prompt": "Ce mărime se măsoară în jouli?",
      "choices": [
        "Energia",
        "Puterea",
        "Presiunea",
        "Intensitatea curentului"
      ],
      "correct": 0,
      "explanation": "Energia se măsoară în jouli (J)."
    },
    {
      "id": "physics-3",
      "prompt": "Pentru o rezistență de 3 Ω parcursă de 2 A, tensiunea este:",
      "choices": [
        "1,5 V",
        "5 V",
        "6 V",
        "12 V"
      ],
      "correct": 2,
      "explanation": "U = RI = 3 × 2 = 6 V."
    },
    {
      "id": "physics-4",
      "prompt": "Ce se propagă în vid dintre acestea?",
      "choices": [
        "Sunetul",
        "Undele electromagnetice",
        "Vibrațiile unui arc",
        "Undele pe suprafața apei"
      ],
      "correct": 1,
      "explanation": "Undele electromagnetice se propagă și în vid."
    }
  ],
  "chemistry": [
    {
      "id": "chemistry-1",
      "prompt": "Care este simbolul chimic al sodiului?",
      "choices": [
        "S",
        "So",
        "Na",
        "Sn"
      ],
      "correct": 2,
      "explanation": "Na provine din denumirea latină natrium."
    },
    {
      "id": "chemistry-2",
      "prompt": "Ce reprezintă numărul atomic Z?",
      "choices": [
        "Numărul de protoni",
        "Numărul de neutroni",
        "Masa electronilor",
        "Numărul de molecule"
      ],
      "correct": 0,
      "explanation": "Z este egal cu numărul protonilor din nucleu."
    },
    {
      "id": "chemistry-3",
      "prompt": "Ce formulă are apa?",
      "choices": [
        "CO₂",
        "H₂O",
        "O₂",
        "H₂O₂"
      ],
      "correct": 1,
      "explanation": "Molecula apei are 2 atomi de hidrogen și 1 de oxigen."
    },
    {
      "id": "chemistry-4",
      "prompt": "O soluție cu pH 3 este, în general:",
      "choices": [
        "Neutră",
        "Bazică",
        "Acidă",
        "Un metal"
      ],
      "correct": 2,
      "explanation": "pH sub 7 indică caracter acid în soluții apoase obișnuite."
    }
  ],
  "biology": [
    {
      "id": "biology-1",
      "prompt": "În ce structură se găsește majoritatea ADN-ului la celula eucariotă?",
      "choices": [
        "Peretele celular",
        "Nucleu",
        "Vacuolă",
        "Membrana externă"
      ],
      "correct": 1,
      "explanation": "Majoritatea ADN-ului nuclear se află în nucleu."
    },
    {
      "id": "biology-2",
      "prompt": "Ce proces produce gameți cu număr înjumătățit de cromozomi?",
      "choices": [
        "Mitoza",
        "Meioza",
        "Fotosinteza",
        "Fermentația"
      ],
      "correct": 1,
      "explanation": "Meioza reduce numărul de cromozomi la jumătate."
    },
    {
      "id": "biology-3",
      "prompt": "Care este rolul principal al stomatelor?",
      "choices": [
        "Absorb minerale din sol",
        "Schimb gaze cu mediul",
        "Produc ADN",
        "Fixează rădăcina"
      ],
      "correct": 1,
      "explanation": "Stomatele reglează schimburile gazoase și transpirația."
    },
    {
      "id": "biology-4",
      "prompt": "Într-un lanț trofic, producătorii primari sunt de regulă:",
      "choices": [
        "Plante și alge",
        "Mamifere prădătoare",
        "Paraziți",
        "Descompunători exclusiv"
      ],
      "correct": 0,
      "explanation": "Producătorii realizează fotosinteza sau chemosinteza."
    },
    {
      "id": "biology-5",
      "topics": [
        "concepts"
      ],
      "diagram": "cell",
      "prompt": "În schema celulei eucariote, ce structură este asociată în principal cu păstrarea ADN-ului nuclear?",
      "choices": [
        "Ribozomul",
        "Nucleul",
        "Membrana plasmatică",
        "Citoplasma"
      ],
      "correct": 1,
      "explanation": "Nucleul adăpostește cea mai mare parte a ADN-ului unei celule eucariote."
    },
    {
      "id": "biology-6",
      "topics": [
        "concepts"
      ],
      "diagram": "cell",
      "prompt": "Ce structură controlează selectiv schimbul de substanțe între celulă și mediu?",
      "choices": [
        "Membrana plasmatică",
        "Nucleolul",
        "Centriolul",
        "Cromozomul"
      ],
      "correct": 0,
      "explanation": "Membrana plasmatică are permeabilitate selectivă și participă la transportul substanțelor."
    },
    {
      "id": "biology-7",
      "topics": [
        "concepts"
      ],
      "diagram": "mitochondrion",
      "prompt": "Ce organit este ilustrat, având o membrană internă cu pliuri numite criste?",
      "choices": [
        "Cloroplastul",
        "Nucleul",
        "Mitocondria",
        "Ribozomul"
      ],
      "correct": 2,
      "explanation": "Mitocondria are două membrane, iar membrana internă formează criste."
    },
    {
      "id": "biology-8",
      "topics": [
        "concepts"
      ],
      "diagram": "dna",
      "prompt": "Care bază azotată se împerechează cu adenina în ADN-ul bicatenar obișnuit?",
      "choices": [
        "Uracil",
        "Timină",
        "Guanină",
        "Citozină"
      ],
      "correct": 1,
      "explanation": "În ADN, adenina se împerechează cu timina; guanina cu citozina."
    },
    {
      "id": "biology-9",
      "topics": [
        "concepts"
      ],
      "diagram": "plant",
      "prompt": "Ce organit al celulelor vegetale conține pigmenții fotosintetici?",
      "choices": [
        "Cloroplastul",
        "Mitocondria",
        "Ribozomul",
        "Nucleolul"
      ],
      "correct": 0,
      "explanation": "Cloroplastele conțin clorofilă în sistemele de membrane tilacoidale."
    },
    {
      "id": "biology-10",
      "topics": [
        "concepts"
      ],
      "diagram": "cell",
      "prompt": "Unde are loc sinteza proteinelor prin traducerea ARN-ului mesager?",
      "choices": [
        "În lizozomi",
        "La nivelul ribozomilor",
        "În vacuola centrală",
        "În peretele celular"
      ],
      "correct": 1,
      "explanation": "Ribozomii traduc informația ARNm în lanțuri polipeptidice."
    },
    {
      "id": "biology-11",
      "topics": [
        "concepts"
      ],
      "diagram": "foodchain",
      "prompt": "Care organism este producătorul primar în lanțul trofic reprezentat?",
      "choices": [
        "Iarba",
        "Iepurele",
        "Vulpea",
        "Toate organismele"
      ],
      "correct": 0,
      "explanation": "Plantele verzi sunt producători primari, deoarece realizează fotosinteză."
    },
    {
      "id": "biology-12",
      "topics": [
        "concepts"
      ],
      "diagram": "dna",
      "prompt": "Ce reprezintă o genă?",
      "choices": [
        "O moleculă de grăsime",
        "O secvență genetică asociată unui produs funcțional",
        "O celulă întreagă",
        "O proteină membranară obligatorie"
      ],
      "correct": 1,
      "explanation": "Genele sunt secvențe de ADN (sau ARN la unele virusuri) care contribuie la produse funcționale."
    },
    {
      "id": "biology-13",
      "topics": [
        "methods"
      ],
      "diagram": "microscope",
      "prompt": "Un obiect de 2 mm apare într-un desen cu lungimea de 20 mm. Care este mărirea desenului?",
      "choices": [
        "2×",
        "5×",
        "10×",
        "20×"
      ],
      "correct": 2,
      "explanation": "Mărirea = dimensiunea desenului / dimensiunea reală = 20/2 = 10."
    },
    {
      "id": "biology-14",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "Într-un experiment privind efectul luminii asupra plantelor, ce trebuie păstrat cât mai constant între grupuri?",
      "choices": [
        "Cantitatea de apă și tipul plantei",
        "Nivelul luminii",
        "Rezultatul măsurătorii",
        "Concluzia"
      ],
      "correct": 0,
      "explanation": "Pentru a compara efectul luminii, ceilalți factori importanți trebuie controlați."
    },
    {
      "id": "biology-15",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "Care este rolul grupului martor într-un experiment?",
      "choices": [
        "Să demonstreze automat ipoteza",
        "Să ofere un termen de comparație",
        "Să elimine nevoia repetării",
        "Să ascundă variația"
      ],
      "correct": 1,
      "explanation": "Grupul martor ajută la interpretarea efectului variabilei investigate."
    },
    {
      "id": "biology-16",
      "topics": [
        "methods"
      ],
      "diagram": "microscope",
      "prompt": "Obiectivul microscopului este de 40×, iar ocularul de 10×. Care este mărirea totală?",
      "choices": [
        "4×",
        "50×",
        "400×",
        "4000×"
      ],
      "correct": 2,
      "explanation": "Mărirea totală este produsul 40 × 10 = 400."
    },
    {
      "id": "biology-17",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "Ce este o variabilă dependentă în experiment?",
      "choices": [
        "Factorul măsurat ca rezultat",
        "Factorul modificat intenționat",
        "Toate condițiile controlate",
        "Numele experimentatorului"
      ],
      "correct": 0,
      "explanation": "Variabila dependentă reprezintă răspunsul observat sau măsurat."
    },
    {
      "id": "biology-18",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "De ce sunt utile replicatele biologice independente?",
      "choices": [
        "Elimină toate erorile posibile",
        "Permit aprecierea variației biologice",
        "Înlocuiesc ipoteza",
        "Garantează cauzalitatea"
      ],
      "correct": 1,
      "explanation": "Eșantioanele biologice independente ajută la estimarea variației și robusteții unui rezultat."
    },
    {
      "id": "biology-19",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "O corelație statistică între două variabile demonstrează automat relație cauzală?",
      "choices": [
        "Da, întotdeauna",
        "Nu, este nevoie de argumente și design adecvat",
        "Da, dacă graficul este colorat",
        "Doar dacă există trei observații"
      ],
      "correct": 1,
      "explanation": "Corelația singură nu dovedește cauzalitatea; pot exista factori de confuzie."
    },
    {
      "id": "biology-20",
      "topics": [
        "applications"
      ],
      "diagram": "mitochondrion",
      "prompt": "În respirația aerobă celulară, ce moleculă este principalul transportor energetic imediat?",
      "choices": [
        "ADN",
        "ATP",
        "Celuloză",
        "Amidon"
      ],
      "correct": 1,
      "explanation": "ATP este folosit în numeroase procese celulare pentru transfer energetic."
    },
    {
      "id": "biology-21",
      "topics": [
        "applications"
      ],
      "diagram": "punnett",
      "prompt": "Într-un model monohibrid simplificat Aa × Aa, care este probabilitatea genotipului aa?",
      "choices": [
        "0%",
        "25%",
        "50%",
        "75%"
      ],
      "correct": 1,
      "explanation": "Tabelul Punnett conține AA, Aa, Aa, aa: una din patru combinații este aa, cu ipoteze mendeliene simple."
    },
    {
      "id": "biology-22",
      "topics": [
        "applications"
      ],
      "diagram": "stomata",
      "prompt": "Ce proces este influențat direct de deschiderea stomatelor frunzei?",
      "choices": [
        "Schimbul de CO₂ și pierderea apei",
        "Formarea rădăcinii",
        "Separarea cromozomilor",
        "Contracția mușchilor"
      ],
      "correct": 0,
      "explanation": "Stomatele reglează schimbul de gaze și transpirația la nivelul frunzelor."
    },
    {
      "id": "biology-23",
      "topics": [
        "applications"
      ],
      "diagram": "foodchain",
      "prompt": "În lanțul iarbă → iepure → vulpe, ce se transferă între nivelurile trofice?",
      "choices": [
        "Energie și materie",
        "Doar culoarea",
        "Toată energia fără pierderi",
        "Niciun nutrient"
      ],
      "correct": 0,
      "explanation": "Materia și energia trec între niveluri, dar transferul energetic nu este complet."
    },
    {
      "id": "biology-24",
      "topics": [
        "applications"
      ],
      "diagram": "circulation",
      "prompt": "Care structură transportă de regulă sângele de la inimă către țesuturi?",
      "choices": [
        "Arterele",
        "Venele",
        "Alveolele",
        "Neuronii"
      ],
      "correct": 0,
      "explanation": "Arterele transportă sângele în direcția îndepărtării de inimă; tipul de oxigenare diferă în circuitele pulmonar și sistemic."
    },
    {
      "id": "biology-25",
      "topics": [
        "applications"
      ],
      "diagram": "plant",
      "prompt": "Ce structură a plantei transportă predominant apă și săruri minerale?",
      "choices": [
        "Floemul",
        "Xilemul",
        "Stomata",
        "Petala"
      ],
      "correct": 1,
      "explanation": "Xilemul transportă apă și solviți minerali de la rădăcini către alte țesuturi."
    },
    {
      "id": "biology-26",
      "topics": [
        "applications"
      ],
      "diagram": "dna",
      "prompt": "Dacă un fragment ADN are secvența A–C–G, care este secvența complementară?",
      "choices": [
        "A–C–G",
        "T–G–C",
        "U–G–C",
        "C–G–A"
      ],
      "correct": 1,
      "explanation": "Perechile complementare în ADN sunt A–T și C–G."
    },
    {
      "id": "biology-27",
      "topics": [
        "concepts"
      ],
      "diagram": "stomata",
      "prompt": "Cum se numesc celulele ce delimitează porul stomatic și pot regla deschiderea acestuia?",
      "choices": [
        "Celule de gardă",
        "Celule nervoase",
        "Hematii",
        "Celule musculare"
      ],
      "correct": 0,
      "explanation": "Perechile de celule de gardă controlează deschiderea porului stomatic."
    },
    {
      "id": "biology-28",
      "topics": [
        "concepts"
      ],
      "diagram": "circulation",
      "prompt": "Ce tip de vas readuce sângele din țesuturi spre inimă în circulația sistemică?",
      "choices": [
        "Artera",
        "Vena",
        "Traheea",
        "Bronhiola"
      ],
      "correct": 1,
      "explanation": "Venele transportă sângele spre inimă; sensul curgerii este criteriul de definire."
    },
    {
      "id": "biology-29",
      "topics": [
        "methods"
      ],
      "diagram": "microscope",
      "prompt": "O celulă măsoară 50 µm în realitate și 5 cm într-un desen. Ce mărire are desenul?",
      "choices": [
        "10×",
        "100×",
        "1000×",
        "10000×"
      ],
      "correct": 2,
      "explanation": "5 cm = 50 000 µm, deci 50 000 / 50 = 1000×."
    },
    {
      "id": "biology-30",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "Ce tip de grafic este adecvat pentru variația continuă a creșterii unei plante în timp?",
      "choices": [
        "Grafic liniar cu timp pe axa orizontală",
        "Hartă politică",
        "Diagramă circulară fără valori",
        "Niciun grafic"
      ],
      "correct": 0,
      "explanation": "Graficul liniar poate reprezenta valori ale unei mărimi continue observate în timp."
    },
    {
      "id": "biology-31",
      "topics": [
        "methods"
      ],
      "diagram": "experiment",
      "prompt": "Ce ar trebui să faci dacă două măsurători din același experiment sunt neobișnuit de diferite?",
      "choices": [
        "Să elimini automat una",
        "Să verifici procedura și posibilele erori",
        "Să înlocuiești cu o valoare inventată",
        "Să omiți unitățile"
      ],
      "correct": 1,
      "explanation": "Datele atipice trebuie investigate transparent; nu sunt eliminate arbitrar."
    },
    {
      "id": "biology-32",
      "topics": [
        "applications"
      ],
      "diagram": "stomata",
      "prompt": "De ce poate scădea transpirația când stomatele se închid?",
      "choices": [
        "Scade evacuarea vaporilor prin pori",
        "Crește obligatoriu fotosinteza",
        "Dispare apa din xilem",
        "Se oprește orice metabolism"
      ],
      "correct": 0,
      "explanation": "Închiderea stomatelor limitează difuzia vaporilor de apă prin pori."
    },
    {
      "id": "biology-33",
      "topics": [
        "applications"
      ],
      "diagram": "foodchain",
      "prompt": "Într-un lanț trofic, ce efect este plauzibil dacă scad puternic producătorii primari?",
      "choices": [
        "Consumatorii pot avea mai puțină hrană",
        "Energia disponibilă crește întotdeauna",
        "Lanțul rămâne identic prin definiție",
        "Toate populațiile cresc simultan"
      ],
      "correct": 0,
      "explanation": "Reducerea producătorilor poate limita resursele de energie disponibile consumatorilor."
    },
    {
      "id": "biology-34",
      "topics": [
        "applications"
      ],
      "diagram": "punnett",
      "prompt": "În modelul Aa × Aa, câte dintre cele patru combinații sunt heterozigote?",
      "choices": [
        "Niciuna",
        "Una",
        "Două",
        "Patru"
      ],
      "correct": 2,
      "explanation": "Combinațiile AA, Aa, Aa și aa conțin două rezultate heterozigote Aa, adică 50%."
    }
  ],
  "computing": [
    {
      "id": "computing-1",
      "prompt": "Ce tip întoarce input() în Python?",
      "choices": [
        "int",
        "str",
        "float",
        "bool"
      ],
      "correct": 1,
      "explanation": "input() întoarce un șir; conversia cu int() este explicită."
    },
    {
      "id": "computing-2",
      "prompt": "Ce complexitate are căutarea liniară în cel mai rău caz într-o listă de n elemente?",
      "choices": [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      "correct": 2,
      "explanation": "La nevoie se inspectează toate cele n elemente."
    },
    {
      "id": "computing-3",
      "prompt": "Ce structură identifică unic o înregistrare relațională?",
      "choices": [
        "Cheia primară",
        "Comentariul",
        "Portul TCP",
        "Pseudocodul"
      ],
      "correct": 0,
      "explanation": "Cheia primară identifică univoc rândurile."
    },
    {
      "id": "computing-4",
      "prompt": "Ce practică previne de regulă SQL injection?",
      "choices": [
        "Concatenezi text de la utilizator",
        "Folosești interogări parametrizate",
        "Ascunzi erorile",
        "Schimbi culoarea paginii"
      ],
      "correct": 1,
      "explanation": "Parametrii separă datele de instrucțiunile SQL."
    }
  ],
  "philosophy": [
    {
      "id": "philosophy-1",
      "prompt": "Care domeniu al filosofiei studiază natura cunoașterii?",
      "choices": [
        "Etica",
        "Epistemologia",
        "Estetica",
        "Logica formală exclusiv"
      ],
      "correct": 1,
      "explanation": "Epistemologia studiază cunoașterea și justificarea ei."
    },
    {
      "id": "philosophy-2",
      "prompt": "Care este forma validă a raționamentului «Dacă P, atunci Q; P; deci Q»?",
      "choices": [
        "Modus ponens",
        "Falsă dilemă",
        "Ad hominem",
        "Afirmația consecventului"
      ],
      "correct": 0,
      "explanation": "Modus ponens este o regulă validă a inferenței."
    },
    {
      "id": "philosophy-3",
      "prompt": "Ce presupune evaluarea unui argument?",
      "choices": [
        "Numărarea cuvintelor",
        "Analiza premiselor și legăturii cu concluzia",
        "Acceptarea autorității fără critică",
        "Ignorarea contraexemplelor"
      ],
      "correct": 1,
      "explanation": "Un argument se evaluează după premise și inferența spre concluzie."
    },
    {
      "id": "philosophy-4",
      "prompt": "Ce caracterizează o dilemă falsă?",
      "choices": [
        "Prezentarea nejustificată a doar două opțiuni",
        "Demonstrația deductivă",
        "Citarea fidelă",
        "Un experiment repetabil"
      ],
      "correct": 0,
      "explanation": "Dilema falsă exclude posibilități relevante fără justificare."
    }
  ]
};
// Add original practice to all currently listed exam subjects.
Object.assign(EXAM_LOCAL_BANK,EXAM_REMAINING_BANK);
export function examTrainingItems(subject,limit=5){return (EXAM_LOCAL_BANK[subject]||[]).slice(0,Math.max(0,Math.min(10,limit)))}
export function examTrainingScore(items,answers){const checked=items.reduce((n,item,i)=>n+(Number.isInteger(answers[i])&&answers[i]===item.correct?1:0),0);return {correct:checked,total:items.length,percent:items.length?Math.round(checked*100/items.length):null,kind:'practice-only'}}
