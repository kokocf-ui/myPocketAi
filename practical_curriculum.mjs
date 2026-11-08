// Original offline practical learning material. Training only: not financial, legal, medical or safety certification.
export const PRACTICAL_LEVELS=[{id:'beginner',ro:'Începător',en:'Beginner'},{id:'intermediate',ro:'Mediu',en:'Intermediate'},{id:'advanced',ro:'Avansat',en:'Advanced'}];
export const PRACTICAL_COUNTRIES=[
['RO','România','Romania','https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/servicii_oferite_contribuabililor/ghiduri_curente'],
['GB-ENG','Anglia','England','https://www.gov.uk/browse/business/start-your-business'],
['GB-SCT','Scoția','Scotland','https://www.gov.uk/browse/business/start-your-business'],
['GB-WLS','Țara Galilor','Wales','https://www.gov.uk/browse/business/start-your-business'],
['GB-NIR','Irlanda de Nord','Northern Ireland','https://www.gov.uk/browse/business/start-your-business'],
['FR','Franța','France','https://europa.eu/youreurope/business/index_en.htm'],
['DE','Germania','Germany','https://europa.eu/youreurope/business/index_en.htm'],
['IT','Italia','Italy','https://europa.eu/youreurope/business/index_en.htm'],
['ES','Spania','Spain','https://europa.eu/youreurope/business/index_en.htm'],
['PT','Portugalia','Portugal','https://europa.eu/youreurope/business/index_en.htm'],
['PL','Polonia','Poland','https://europa.eu/youreurope/business/index_en.htm'],
['NL','Țările de Jos','Netherlands','https://europa.eu/youreurope/business/index_en.htm'],
['IE','Irlanda','Ireland','https://europa.eu/youreurope/business/index_en.htm']
];
export const PRACTICAL_COURSES=[
  {
    "id": "finance",
    "icon": "💷",
    "ro": "Finanțe personale",
    "en": "Personal finance",
    "summary": "Buget, economisire, credit, prevenirea fraudei.",
    "unit": "currency",
    "lessons": [
      [
        "Buget lunar și cheltuieli",
        "Începe prin a separa veniturile certe de cele variabile. Împarte cheltuielile în necesare, flexibile și ocazionale; calculează soldul înainte de cumpărături, nu după. Un buget realist are și o categorie pentru cheltuieli neprevăzute.",
        "Notează venitul net, utilitățile, transportul și hrana; apoi vezi cât rămâne pentru alte obiective.",
        "Exemplu: venit 1800, costuri fixe 1100, costuri flexibile 450. Soldul planificat este 250.",
        "Ce calculezi înainte de a stabili o sumă de economisit?",
        [
          "Diferența dintre venituri și cheltuieli",
          "Doar numărul de plăți cu cardul",
          "Prețul celui mai scump produs",
          "Doar suma din portofel"
        ],
        0
      ],
      [
        "Economisirea și fondul de rezervă",
        "Economisirea este mai ușoară când stabilești un obiectiv măsurabil și un transfer repetabil care nu pune în pericol cheltuielile esențiale. Fondul de rezervă se păstrează într-un loc accesibil, cu risc redus; cuantumul depinde de nevoile reale.",
        "Estimează o cheltuială posibilă, stabilește o sumă lunară și urmărește progresul fără a presupune randamente garantate.",
        "Exemplu: economisind 50 pe lună, fără dobândă, după 8 luni ai pus deoparte 400.",
        "Ce caracteristică este esențială pentru o rezervă de urgență?",
        [
          "Accesibilitate când apare nevoia",
          "Promisiunea unor câștiguri rapide",
          "Blocarea obligatorie pentru zece ani",
          "Împrumutul cu dobândă mare"
        ],
        0
      ],
      [
        "Dobânda și costul creditului",
        "La un împrumut contează costul total de rambursat, nu doar rata lunară. Compară durata, dobânda efectivă, comisioanele, penalitățile și eventualele condiții variabile. Folosește doar oferte și documente reale pentru decizii financiare.",
        "Scrie separat suma împrumutată și toate plățile datorate, apoi calculează diferența.",
        "Exemplu: împrumuți 1000 și plătești în total 1200; costul suplimentar este 200.",
        "Ce comparație este utilă între două credite?",
        [
          "Costul total și condițiile",
          "Doar culoarea cardului",
          "Numai prima rată",
          "Numai mesajul publicitar"
        ],
        0
      ],
      [
        "Gestionarea facturilor și abonamentelor",
        "Facturile recurente devin greu de urmărit când scadențele și perioadele de reînnoire sunt ignorate. Creează un calendar, verifică extrasul, păstrează confirmări de anulare și citește condițiile contractuale, care pot diferi după țară.",
        "Întocmește o listă cu furnizorul, suma, frecvența, scadența și metoda de plată.",
        "Exemplu: trei abonamente de 8, 12 și 15 costă împreună 35 pe lună.",
        "Ce verifici când un serviciu continuă să te taxeze?",
        [
          "Termenii abonamentului și dovada anulării",
          "Doar numele aplicației",
          "Doar soldul de ieri",
          "Numărul de reclame"
        ],
        0
      ],
      [
        "Planificarea obiectivelor financiare",
        "Obiectivele mari se descompun în termene și etape. Pentru fiecare obiectiv stabilește costul estimat, orizontul, prioritățile și ce se întâmplă dacă venitul scade. Verifică regulat planul și nu trata câștigurile ipotetice ca bani disponibili.",
        "Construiește două scenarii: unul de bază și unul cu cheltuieli neprevăzute.",
        "Exemplu: un obiectiv de 900 pe 9 luni cere în medie 100 de economisit lunar, fără dobândă.",
        "De ce folosești scenarii pentru un plan financiar?",
        [
          "Ca să vezi cum reacționează bugetul la schimbări",
          "Ca să garantezi profitul",
          "Ca să elimini toate riscurile",
          "Ca să nu mai verifici veniturile"
        ],
        0
      ],
      [
        "Protecția datelor și fraude financiare",
        "Escrocii pot imita bănci, comercianți sau autorități. Nu comunica parole, coduri de autentificare sau date sensibile în mesaje neașteptate; verifică furnizorul prin canale oficiale introduse independent. Un sentiment de urgență artificială este un semnal de alarmă.",
        "Dacă primești o cerere suspectă, oprește acțiunea, verifică expeditorul printr-un canal cunoscut și păstrează dovezile.",
        "Exemplu: un mesaj spune să transferi imediat bani într-un «cont sigur»; verifică independent, nu prin linkul din mesaj.",
        "Ce faci la o cerere neașteptată pentru un cod bancar?",
        [
          "Nu îl furnizezi și contactezi instituția oficial",
          "Îl trimiți imediat",
          "Instalezi orice aplicație solicitată",
          "Distribui codul într-un grup"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "finance-1",
        "level": "beginner",
        "order": 1,
        "title": "Buget lunar și cheltuieli",
        "theory": "Începe prin a separa veniturile certe de cele variabile. Împarte cheltuielile în necesare, flexibile și ocazionale; calculează soldul înainte de cumpărături, nu după. Un buget realist are și o categorie pentru cheltuieli neprevăzute.",
        "method": "Notează venitul net, utilitățile, transportul și hrana; apoi vezi cât rămâne pentru alte obiective.",
        "caseStudy": "Exemplu: venit 1800, costuri fixe 1100, costuri flexibile 450. Soldul planificat este 250.",
        "question": {
          "prompt": "Ce calculezi înainte de a stabili o sumă de economisit?",
          "choices": [
            "Diferența dintre venituri și cheltuieli",
            "Doar numărul de plăți cu cardul",
            "Prețul celui mai scump produs",
            "Doar suma din portofel"
          ],
          "correct": 0,
          "explanation": "Notează venitul net, utilitățile, transportul și hrana; apoi vezi cât rămâne pentru alte obiective."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "finance-2",
        "level": "beginner",
        "order": 2,
        "title": "Economisirea și fondul de rezervă",
        "theory": "Economisirea este mai ușoară când stabilești un obiectiv măsurabil și un transfer repetabil care nu pune în pericol cheltuielile esențiale. Fondul de rezervă se păstrează într-un loc accesibil, cu risc redus; cuantumul depinde de nevoile reale.",
        "method": "Estimează o cheltuială posibilă, stabilește o sumă lunară și urmărește progresul fără a presupune randamente garantate.",
        "caseStudy": "Exemplu: economisind 50 pe lună, fără dobândă, după 8 luni ai pus deoparte 400.",
        "question": {
          "prompt": "Ce caracteristică este esențială pentru o rezervă de urgență?",
          "choices": [
            "Accesibilitate când apare nevoia",
            "Promisiunea unor câștiguri rapide",
            "Blocarea obligatorie pentru zece ani",
            "Împrumutul cu dobândă mare"
          ],
          "correct": 0,
          "explanation": "Estimează o cheltuială posibilă, stabilește o sumă lunară și urmărește progresul fără a presupune randamente garantate."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "finance-3",
        "level": "intermediate",
        "order": 3,
        "title": "Dobânda și costul creditului",
        "theory": "La un împrumut contează costul total de rambursat, nu doar rata lunară. Compară durata, dobânda efectivă, comisioanele, penalitățile și eventualele condiții variabile. Folosește doar oferte și documente reale pentru decizii financiare.",
        "method": "Scrie separat suma împrumutată și toate plățile datorate, apoi calculează diferența.",
        "caseStudy": "Exemplu: împrumuți 1000 și plătești în total 1200; costul suplimentar este 200.",
        "question": {
          "prompt": "Ce comparație este utilă între două credite?",
          "choices": [
            "Costul total și condițiile",
            "Doar culoarea cardului",
            "Numai prima rată",
            "Numai mesajul publicitar"
          ],
          "correct": 0,
          "explanation": "Scrie separat suma împrumutată și toate plățile datorate, apoi calculează diferența."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "finance-4",
        "level": "intermediate",
        "order": 4,
        "title": "Gestionarea facturilor și abonamentelor",
        "theory": "Facturile recurente devin greu de urmărit când scadențele și perioadele de reînnoire sunt ignorate. Creează un calendar, verifică extrasul, păstrează confirmări de anulare și citește condițiile contractuale, care pot diferi după țară.",
        "method": "Întocmește o listă cu furnizorul, suma, frecvența, scadența și metoda de plată.",
        "caseStudy": "Exemplu: trei abonamente de 8, 12 și 15 costă împreună 35 pe lună.",
        "question": {
          "prompt": "Ce verifici când un serviciu continuă să te taxeze?",
          "choices": [
            "Termenii abonamentului și dovada anulării",
            "Doar numele aplicației",
            "Doar soldul de ieri",
            "Numărul de reclame"
          ],
          "correct": 0,
          "explanation": "Întocmește o listă cu furnizorul, suma, frecvența, scadența și metoda de plată."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "finance-5",
        "level": "advanced",
        "order": 5,
        "title": "Planificarea obiectivelor financiare",
        "theory": "Obiectivele mari se descompun în termene și etape. Pentru fiecare obiectiv stabilește costul estimat, orizontul, prioritățile și ce se întâmplă dacă venitul scade. Verifică regulat planul și nu trata câștigurile ipotetice ca bani disponibili.",
        "method": "Construiește două scenarii: unul de bază și unul cu cheltuieli neprevăzute.",
        "caseStudy": "Exemplu: un obiectiv de 900 pe 9 luni cere în medie 100 de economisit lunar, fără dobândă.",
        "question": {
          "prompt": "De ce folosești scenarii pentru un plan financiar?",
          "choices": [
            "Ca să vezi cum reacționează bugetul la schimbări",
            "Ca să garantezi profitul",
            "Ca să elimini toate riscurile",
            "Ca să nu mai verifici veniturile"
          ],
          "correct": 0,
          "explanation": "Construiește două scenarii: unul de bază și unul cu cheltuieli neprevăzute."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "finance-6",
        "level": "advanced",
        "order": 6,
        "title": "Protecția datelor și fraude financiare",
        "theory": "Escrocii pot imita bănci, comercianți sau autorități. Nu comunica parole, coduri de autentificare sau date sensibile în mesaje neașteptate; verifică furnizorul prin canale oficiale introduse independent. Un sentiment de urgență artificială este un semnal de alarmă.",
        "method": "Dacă primești o cerere suspectă, oprește acțiunea, verifică expeditorul printr-un canal cunoscut și păstrează dovezile.",
        "caseStudy": "Exemplu: un mesaj spune să transferi imediat bani într-un «cont sigur»; verifică independent, nu prin linkul din mesaj.",
        "question": {
          "prompt": "Ce faci la o cerere neașteptată pentru un cod bancar?",
          "choices": [
            "Nu îl furnizezi și contactezi instituția oficial",
            "Îl trimiți imediat",
            "Instalezi orice aplicație solicitată",
            "Distribui codul într-un grup"
          ],
          "correct": 0,
          "explanation": "Dacă primești o cerere suspectă, oprește acțiunea, verifică expeditorul printr-un canal cunoscut și păstrează dovezile."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  },
  {
    "id": "trades",
    "icon": "🛠️",
    "ro": "Meserii și abilități",
    "en": "Trades and vocational skills",
    "summary": "Măsurare, materiale, organizarea lucrării și siguranță.",
    "unit": "tasks",
    "lessons": [
      [
        "Măsurători și unități",
        "Orice lucrare începe cu măsurarea corectă. Notează unitatea, verifică instrumentul și măsoară de două ori înainte de a decide dimensiunea finală. Schița cu cote trebuie să distingă lungimea, lățimea și adâncimea.",
        "Măsoară un obiect obișnuit și înregistrează rezultatul în centimetri și milimetri.",
        "Exemplu: 1,25 m înseamnă 125 cm sau 1250 mm.",
        "Câți milimetri sunt în 1,25 metri?",
        [
          "1250",
          "125",
          "12,5",
          "12500"
        ],
        0
      ],
      [
        "Planul unei lucrări sigure",
        "Identifică pericolele înainte de a începe o activitate. Folosește echipamentele potrivite și nu executa lucrări la instalații electrice, gaze, structuri portante sau alte sisteme periculoase fără persoană calificată. Oprirea lucrului este o alegere corectă când condițiile nu sunt sigure.",
        "Scrie materialele, instrumentele, persoanele responsabile și condițiile de oprire.",
        "Exemplu: observi un cablu deteriorat lângă apă: nu îl atingi și anunți un specialist.",
        "Ce decizie este corectă în cazul unui cablu electric deteriorat?",
        [
          "Izolezi accesul și ceri ajutor calificat",
          "Îl repari cu mâinile ude",
          "Îl testezi prin atingere",
          "Îl acoperi cu hârtie"
        ],
        0
      ],
      [
        "Materiale și proprietăți",
        "Alegerea materialului depinde de rezistență, masă, mediu, uzură și compatibilitate. Compară specificațiile și instrucțiunile producătorului înainte de utilizare; aceeași piesă poate fi potrivită într-un mediu și nepotrivită în altul.",
        "Întocmește o fișă cu două materiale și proprietățile relevante.",
        "Exemplu: un material vulnerabil la umezeală nu este automat potrivit într-un spațiu umed.",
        "Ce contează când alegi materialul?",
        [
          "Proprietățile și condițiile de utilizare",
          "Doar culoarea ambalajului",
          "Doar numele magazinului",
          "Doar forma etichetei"
        ],
        0
      ],
      [
        "Citirea schițelor tehnice",
        "Schițele descriu dimensiuni, toleranțe și poziții. Învață diferența dintre o vedere din față și una de sus; compară mai întâi simbolurile și legenda. Nu deduce unghiuri sau dimensiuni absente dintr-un desen care nu este la scară.",
        "Desenează o piesă simplă cu trei cote și marchează ce nu este specificat.",
        "Exemplu: un dreptunghi de 40×20 cm are suprafața de 800 cm².",
        "Ce nu trebuie să presupui dintr-o schiță fără scară?",
        [
          "Dimensiuni neindicate",
          "Cotele explicit înscrise",
          "Unitățile declarate",
          "Identitatea legendei"
        ],
        0
      ],
      [
        "Calitate, verificare și evidență",
        "Calitatea rezultă din criterii verificabile, nu doar aspect. Stabilește un standard, documentează etapele, notează diferențele și reia verificarea după corecție. Dacă rezultatul influențează siguranța, evaluarea trebuie făcută de un profesionist calificat.",
        "Construiește o listă cu criterii: dimensiune, aspect, funcție, siguranță și documentare.",
        "Exemplu: o piesă trebuie să aibă 100 ± 2 mm; măsori 103 mm, deci este în afara toleranței.",
        "O piesă de 103 mm respectă toleranța 100 ± 2 mm?",
        [
          "Nu",
          "Da, întotdeauna",
          "Doar dacă este vopsită",
          "Nu există date suficiente pentru interval"
        ],
        0
      ],
      [
        "Proiect practic și estimarea resurselor",
        "Descompune o lucrare în rezultate intermediare, timp estimat, materiale și verificări. Rezervă un interval pentru erori și întreruperi. Dacă o sarcină implică autorizări, igienă specială ori siguranța altor persoane, verifică regulile locale și cere personal competent.",
        "Creează un deviz estimativ fără a-l prezenta drept ofertă reală și evidențiază ipotezele.",
        "Exemplu: trei materiale de 10, 15 și 25 au cost de bază 50, fără transport și manoperă.",
        "Ce trebuie evidențiat într-o estimare?",
        [
          "Ce costuri sunt incluse și care sunt presupuse",
          "Doar rezultatul fără explicație",
          "Numai durata optimistă",
          "Prețul unei singure piese"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "trades-1",
        "level": "beginner",
        "order": 1,
        "title": "Măsurători și unități",
        "theory": "Orice lucrare începe cu măsurarea corectă. Notează unitatea, verifică instrumentul și măsoară de două ori înainte de a decide dimensiunea finală. Schița cu cote trebuie să distingă lungimea, lățimea și adâncimea.",
        "method": "Măsoară un obiect obișnuit și înregistrează rezultatul în centimetri și milimetri.",
        "caseStudy": "Exemplu: 1,25 m înseamnă 125 cm sau 1250 mm.",
        "question": {
          "prompt": "Câți milimetri sunt în 1,25 metri?",
          "choices": [
            "1250",
            "125",
            "12,5",
            "12500"
          ],
          "correct": 0,
          "explanation": "Măsoară un obiect obișnuit și înregistrează rezultatul în centimetri și milimetri."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "trades-2",
        "level": "beginner",
        "order": 2,
        "title": "Planul unei lucrări sigure",
        "theory": "Identifică pericolele înainte de a începe o activitate. Folosește echipamentele potrivite și nu executa lucrări la instalații electrice, gaze, structuri portante sau alte sisteme periculoase fără persoană calificată. Oprirea lucrului este o alegere corectă când condițiile nu sunt sigure.",
        "method": "Scrie materialele, instrumentele, persoanele responsabile și condițiile de oprire.",
        "caseStudy": "Exemplu: observi un cablu deteriorat lângă apă: nu îl atingi și anunți un specialist.",
        "question": {
          "prompt": "Ce decizie este corectă în cazul unui cablu electric deteriorat?",
          "choices": [
            "Izolezi accesul și ceri ajutor calificat",
            "Îl repari cu mâinile ude",
            "Îl testezi prin atingere",
            "Îl acoperi cu hârtie"
          ],
          "correct": 0,
          "explanation": "Scrie materialele, instrumentele, persoanele responsabile și condițiile de oprire."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "trades-3",
        "level": "intermediate",
        "order": 3,
        "title": "Materiale și proprietăți",
        "theory": "Alegerea materialului depinde de rezistență, masă, mediu, uzură și compatibilitate. Compară specificațiile și instrucțiunile producătorului înainte de utilizare; aceeași piesă poate fi potrivită într-un mediu și nepotrivită în altul.",
        "method": "Întocmește o fișă cu două materiale și proprietățile relevante.",
        "caseStudy": "Exemplu: un material vulnerabil la umezeală nu este automat potrivit într-un spațiu umed.",
        "question": {
          "prompt": "Ce contează când alegi materialul?",
          "choices": [
            "Proprietățile și condițiile de utilizare",
            "Doar culoarea ambalajului",
            "Doar numele magazinului",
            "Doar forma etichetei"
          ],
          "correct": 0,
          "explanation": "Întocmește o fișă cu două materiale și proprietățile relevante."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "trades-4",
        "level": "intermediate",
        "order": 4,
        "title": "Citirea schițelor tehnice",
        "theory": "Schițele descriu dimensiuni, toleranțe și poziții. Învață diferența dintre o vedere din față și una de sus; compară mai întâi simbolurile și legenda. Nu deduce unghiuri sau dimensiuni absente dintr-un desen care nu este la scară.",
        "method": "Desenează o piesă simplă cu trei cote și marchează ce nu este specificat.",
        "caseStudy": "Exemplu: un dreptunghi de 40×20 cm are suprafața de 800 cm².",
        "question": {
          "prompt": "Ce nu trebuie să presupui dintr-o schiță fără scară?",
          "choices": [
            "Dimensiuni neindicate",
            "Cotele explicit înscrise",
            "Unitățile declarate",
            "Identitatea legendei"
          ],
          "correct": 0,
          "explanation": "Desenează o piesă simplă cu trei cote și marchează ce nu este specificat."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "trades-5",
        "level": "advanced",
        "order": 5,
        "title": "Calitate, verificare și evidență",
        "theory": "Calitatea rezultă din criterii verificabile, nu doar aspect. Stabilește un standard, documentează etapele, notează diferențele și reia verificarea după corecție. Dacă rezultatul influențează siguranța, evaluarea trebuie făcută de un profesionist calificat.",
        "method": "Construiește o listă cu criterii: dimensiune, aspect, funcție, siguranță și documentare.",
        "caseStudy": "Exemplu: o piesă trebuie să aibă 100 ± 2 mm; măsori 103 mm, deci este în afara toleranței.",
        "question": {
          "prompt": "O piesă de 103 mm respectă toleranța 100 ± 2 mm?",
          "choices": [
            "Nu",
            "Da, întotdeauna",
            "Doar dacă este vopsită",
            "Nu există date suficiente pentru interval"
          ],
          "correct": 0,
          "explanation": "Construiește o listă cu criterii: dimensiune, aspect, funcție, siguranță și documentare."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "trades-6",
        "level": "advanced",
        "order": 6,
        "title": "Proiect practic și estimarea resurselor",
        "theory": "Descompune o lucrare în rezultate intermediare, timp estimat, materiale și verificări. Rezervă un interval pentru erori și întreruperi. Dacă o sarcină implică autorizări, igienă specială ori siguranța altor persoane, verifică regulile locale și cere personal competent.",
        "method": "Creează un deviz estimativ fără a-l prezenta drept ofertă reală și evidențiază ipotezele.",
        "caseStudy": "Exemplu: trei materiale de 10, 15 și 25 au cost de bază 50, fără transport și manoperă.",
        "question": {
          "prompt": "Ce trebuie evidențiat într-o estimare?",
          "choices": [
            "Ce costuri sunt incluse și care sunt presupuse",
            "Doar rezultatul fără explicație",
            "Numai durata optimistă",
            "Prețul unei singure piese"
          ],
          "correct": 0,
          "explanation": "Creează un deviz estimativ fără a-l prezenta drept ofertă reală și evidențiază ipotezele."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  },
  {
    "id": "business",
    "icon": "🚀",
    "ro": "Antreprenoriat",
    "en": "Entrepreneurship",
    "summary": "Idee, clienți, prețuri, plan, evidență și riscuri.",
    "unit": "business",
    "lessons": [
      [
        "Problema clientului și ideea",
        "O afacere pornește de la o problemă reală a clientului, nu doar de la o denumire atractivă. Descrie cine ar folosi produsul, ce nevoie are și prin ce alternative rezolvă nevoia astăzi. Verifică presupunerile prin întrebări deschise.",
        "Descrie trei persoane ipotetice și motivul concret pentru care ar plăti.",
        "Exemplu: un serviciu de programări poate reduce timpul de așteptare pentru un grup bine definit.",
        "Ce verifici mai întâi la o idee?",
        [
          "Existența unei nevoi reale",
          "Culoarea viitorului logo",
          "Numărul imaginat de angajați",
          "Un slogan obligatoriu"
        ],
        0
      ],
      [
        "Testarea unei oferte",
        "Înainte de o investiție mare, definește un test mic, legal și reversibil. Oferă o descriere clară, cere feedback și diferențiază interesul declarat de cumpărarea efectivă. Nu colecta date personale fără justificare și protecții adecvate.",
        "Construiește o întrebare neutră pentru 5 clienți potențiali și notează răspunsurile fără a promite rezultate.",
        "Exemplu: testezi două variante de ofertă și înregistrezi câți respondenți au înțeles beneficiul.",
        "Ce dovadă este mai solidă pentru cerere?",
        [
          "Comportamentul real al clienților",
          "Laudele prietenilor fără testare",
          "Numărul de fonturi",
          "Ideea că piața este sigură"
        ],
        0
      ],
      [
        "Costuri, preț și marjă",
        "Prețul nu este profit. Separă costurile variabile pe unitate de costurile fixe, taxe și timpul de lucru. Marja brută pe unitate este prețul minus costul variabil, înainte de costurile fixe și alte obligații. Folosește exemple numerice simplificate, nu rate de taxe inventate.",
        "Calculează marja unitară și apoi câte unități ar acoperi un cost fix ipotetic.",
        "Exemplu: preț 30, cost variabil 18; marja unitară este 12.",
        "Cât este marja unitară la preț 30 și cost 18?",
        [
          "12",
          "48",
          "30",
          "18"
        ],
        0
      ],
      [
        "Plan de afaceri și flux de numerar",
        "Planul de afaceri explică oferta, clienții, canalele, resursele, costurile și riscurile. Fluxul de numerar urmărește când intră și ies efectiv banii; profitul contabil nu înseamnă automat numerar disponibil. Separă scenariul prudent de cel optimist.",
        "Construiește un calendar cu încasări și plăți pe trei luni, apoi identifică eventualele goluri.",
        "Exemplu: încasezi 1000 luna viitoare, dar plătești 600 astăzi: trebuie să ai lichidități acum.",
        "De ce urmărești fluxul de numerar?",
        [
          "Pentru termenele reale de încasare și plată",
          "Doar pentru alegerea siglei",
          "Ca să elimini orice contract",
          "Ca să garantezi profit"
        ],
        0
      ],
      [
        "Evidențe și obligații locale",
        "Păstrează documentele și verifică înregistrarea, facturarea, protecția datelor, taxele și eventualele licențe în surse oficiale valabile pentru țara și forma juridică alese. Nu există o regulă identică pentru toate țările europene și toate activitățile.",
        "Întocmește lista documentelor și instituțiilor de verificat, fără să presupui cote sau termene fiscale.",
        "Exemplu: un serviciu alimentar poate necesita cerințe diferite de o activitate digitală.",
        "Unde verifici o obligație fiscală locală?",
        [
          "În portalul oficial competent și documentele actuale",
          "Într-o reclamă anonimă",
          "Într-un mesaj distribuit",
          "După presupuneri"
        ],
        0
      ],
      [
        "Marketing responsabil și relația cu clienții",
        "Descrie transparent produsul, termenii și limitele, fără promisiuni nejustificate. Colectează doar datele necesare și gestionează reclamațiile cu evidențe clare. O relație bună presupune feedback și îmbunătățire continuă, nu doar reclame.",
        "Redactează o ofertă de 100 de cuvinte cu beneficii, preț, termene și limitări.",
        "Exemplu: «Livrare în intervalul comunicat, în limita disponibilității», nu «instant garantat» fără dovadă.",
        "Cum formulezi o afirmație comercială?",
        [
          "Clar, verificabil și fără promisiuni înșelătoare",
          "Cu garanții imposibile",
          "Ascunzând toate costurile",
          "Eliminând condițiile"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "business-1",
        "level": "beginner",
        "order": 1,
        "title": "Problema clientului și ideea",
        "theory": "O afacere pornește de la o problemă reală a clientului, nu doar de la o denumire atractivă. Descrie cine ar folosi produsul, ce nevoie are și prin ce alternative rezolvă nevoia astăzi. Verifică presupunerile prin întrebări deschise.",
        "method": "Descrie trei persoane ipotetice și motivul concret pentru care ar plăti.",
        "caseStudy": "Exemplu: un serviciu de programări poate reduce timpul de așteptare pentru un grup bine definit.",
        "question": {
          "prompt": "Ce verifici mai întâi la o idee?",
          "choices": [
            "Existența unei nevoi reale",
            "Culoarea viitorului logo",
            "Numărul imaginat de angajați",
            "Un slogan obligatoriu"
          ],
          "correct": 0,
          "explanation": "Descrie trei persoane ipotetice și motivul concret pentru care ar plăti."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "business-2",
        "level": "beginner",
        "order": 2,
        "title": "Testarea unei oferte",
        "theory": "Înainte de o investiție mare, definește un test mic, legal și reversibil. Oferă o descriere clară, cere feedback și diferențiază interesul declarat de cumpărarea efectivă. Nu colecta date personale fără justificare și protecții adecvate.",
        "method": "Construiește o întrebare neutră pentru 5 clienți potențiali și notează răspunsurile fără a promite rezultate.",
        "caseStudy": "Exemplu: testezi două variante de ofertă și înregistrezi câți respondenți au înțeles beneficiul.",
        "question": {
          "prompt": "Ce dovadă este mai solidă pentru cerere?",
          "choices": [
            "Comportamentul real al clienților",
            "Laudele prietenilor fără testare",
            "Numărul de fonturi",
            "Ideea că piața este sigură"
          ],
          "correct": 0,
          "explanation": "Construiește o întrebare neutră pentru 5 clienți potențiali și notează răspunsurile fără a promite rezultate."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "business-3",
        "level": "intermediate",
        "order": 3,
        "title": "Costuri, preț și marjă",
        "theory": "Prețul nu este profit. Separă costurile variabile pe unitate de costurile fixe, taxe și timpul de lucru. Marja brută pe unitate este prețul minus costul variabil, înainte de costurile fixe și alte obligații. Folosește exemple numerice simplificate, nu rate de taxe inventate.",
        "method": "Calculează marja unitară și apoi câte unități ar acoperi un cost fix ipotetic.",
        "caseStudy": "Exemplu: preț 30, cost variabil 18; marja unitară este 12.",
        "question": {
          "prompt": "Cât este marja unitară la preț 30 și cost 18?",
          "choices": [
            "12",
            "48",
            "30",
            "18"
          ],
          "correct": 0,
          "explanation": "Calculează marja unitară și apoi câte unități ar acoperi un cost fix ipotetic."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "business-4",
        "level": "intermediate",
        "order": 4,
        "title": "Plan de afaceri și flux de numerar",
        "theory": "Planul de afaceri explică oferta, clienții, canalele, resursele, costurile și riscurile. Fluxul de numerar urmărește când intră și ies efectiv banii; profitul contabil nu înseamnă automat numerar disponibil. Separă scenariul prudent de cel optimist.",
        "method": "Construiește un calendar cu încasări și plăți pe trei luni, apoi identifică eventualele goluri.",
        "caseStudy": "Exemplu: încasezi 1000 luna viitoare, dar plătești 600 astăzi: trebuie să ai lichidități acum.",
        "question": {
          "prompt": "De ce urmărești fluxul de numerar?",
          "choices": [
            "Pentru termenele reale de încasare și plată",
            "Doar pentru alegerea siglei",
            "Ca să elimini orice contract",
            "Ca să garantezi profit"
          ],
          "correct": 0,
          "explanation": "Construiește un calendar cu încasări și plăți pe trei luni, apoi identifică eventualele goluri."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "business-5",
        "level": "advanced",
        "order": 5,
        "title": "Evidențe și obligații locale",
        "theory": "Păstrează documentele și verifică înregistrarea, facturarea, protecția datelor, taxele și eventualele licențe în surse oficiale valabile pentru țara și forma juridică alese. Nu există o regulă identică pentru toate țările europene și toate activitățile.",
        "method": "Întocmește lista documentelor și instituțiilor de verificat, fără să presupui cote sau termene fiscale.",
        "caseStudy": "Exemplu: un serviciu alimentar poate necesita cerințe diferite de o activitate digitală.",
        "question": {
          "prompt": "Unde verifici o obligație fiscală locală?",
          "choices": [
            "În portalul oficial competent și documentele actuale",
            "Într-o reclamă anonimă",
            "Într-un mesaj distribuit",
            "După presupuneri"
          ],
          "correct": 0,
          "explanation": "Întocmește lista documentelor și instituțiilor de verificat, fără să presupui cote sau termene fiscale."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "business-6",
        "level": "advanced",
        "order": 6,
        "title": "Marketing responsabil și relația cu clienții",
        "theory": "Descrie transparent produsul, termenii și limitele, fără promisiuni nejustificate. Colectează doar datele necesare și gestionează reclamațiile cu evidențe clare. O relație bună presupune feedback și îmbunătățire continuă, nu doar reclame.",
        "method": "Redactează o ofertă de 100 de cuvinte cu beneficii, preț, termene și limitări.",
        "caseStudy": "Exemplu: «Livrare în intervalul comunicat, în limita disponibilității», nu «instant garantat» fără dovadă.",
        "question": {
          "prompt": "Cum formulezi o afirmație comercială?",
          "choices": [
            "Clar, verificabil și fără promisiuni înșelătoare",
            "Cu garanții imposibile",
            "Ascunzând toate costurile",
            "Eliminând condițiile"
          ],
          "correct": 0,
          "explanation": "Redactează o ofertă de 100 de cuvinte cu beneficii, preț, termene și limitări."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  },
  {
    "id": "digital",
    "icon": "💻",
    "ro": "Competențe digitale",
    "en": "Digital skills",
    "summary": "Fișiere, documente, tabele, securitate și colaborare.",
    "unit": "digital",
    "lessons": [
      [
        "Fișiere, foldere și versiuni",
        "O structură de foldere clară previne pierderile. Folosește nume descriptive, dată sau versiune și diferențiază documentele finale de schițe. Verifică extensia reală a fișierului și nu executa atașamente necunoscute.",
        "Creează o organizare imaginară pentru proiecte, contracte și fotografii.",
        "Exemplu: Proiect_2026-11-08_v2.pdf este mai descriptiv decât document1.",
        "Cum denumești util un fișier?",
        [
          "Cu subiect și versiune sau dată",
          "Numai «nou»",
          "Folosind caractere aleatorii",
          "Ascunzând extensia"
        ],
        0
      ],
      [
        "Editarea documentelor și PDF",
        "Un document profesional are titlu, secțiuni, paragrafe, surse și verificare ortografică. PDF-ul păstrează prezentarea la distribuire, dar verifică paginarea, caracterele și imaginile înainte de trimitere. Nu include automat date sensibile.",
        "Pregătește un document scurt cu titlu, trei secțiuni, concluzie și nume descriptiv.",
        "Exemplu: o ofertă de două pagini poate fi salvată ca Oferta_serviciu_2026.pdf.",
        "Ce verifici înainte să trimiți un PDF?",
        [
          "Aspect, completitudine și date sensibile",
          "Doar culoarea iconiței",
          "Doar ora telefonului",
          "Nimic dacă se deschide"
        ],
        0
      ],
      [
        "Tabele și formule de bază",
        "Într-un tabel fiecare coloană trebuie să aibă un sens și un tip de date stabil. Folosește formule pentru calcule repetate și verifică referințele la celule. Valorile numerice și unitățile trebuie interpretate consecvent.",
        "Creează un tabel cu produs, cantitate, preț unitar și total, apoi verifică suma.",
        "Exemplu: 3 bucăți × 8 unități monetare = 24.",
        "Care este formula logică pentru totalul unei linii?",
        [
          "Cantitate × preț unitar",
          "Cantitate + nume",
          "Preț ÷ dată",
          "Textul antetului"
        ],
        0
      ],
      [
        "Siguranță digitală și parole",
        "Folosește parole unice, autentificare multifactor unde este disponibilă și actualizări de securitate. Nu reutiliza codurile de recuperare sau nu le introduce pe pagini din linkuri suspecte. Verifică adresele și permisiunile înainte de partajare.",
        "Analizează un exemplu de mesaj de phishing și marchează semnalele de risc.",
        "Exemplu: un «administrator» cere parola prin mesaj; nu o trimiți.",
        "Care este o practică sigură?",
        [
          "Parole unice și MFA",
          "Aceeași parolă peste tot",
          "Trimiterea codului unui necunoscut",
          "Instalarea oricărui atașament"
        ],
        0
      ],
      [
        "Automatizare și organizarea muncii",
        "Automatizează mai întâi pașii repetați și bine definiți. Descrie intrarea, regula, rezultatul și modul de verificare. Un proces care afectează bani, date personale sau decizii importante are nevoie de verificări suplimentare și control uman.",
        "Scrie un flux simplu: primește cererea → validează datele → generează document → revizuire.",
        "Exemplu: extragi nume și dată dintr-un formular, dar verifici manual înainte de expediere.",
        "Ce nu trebuie să lipsească dintr-o automatizare?",
        [
          "Verificarea rezultatului și posibilitatea corecției",
          "Ascunderea completă a erorilor",
          "Acces la toate parolele",
          "Executarea fără scop"
        ],
        0
      ],
      [
        "Colaborare și comunicare la distanță",
        "Alege canalul potrivit și formulează obiectivul, termenul și responsabilul. La partajarea unui document, verifică cine poate citi, edita sau redistribui. Ține versiuni și decizii importante într-un loc ușor de găsit.",
        "Redactează un rezumat de ședință cu decizie, responsabil și termen.",
        "Exemplu: «Ana revizuiește documentul până vineri», mai clar decât «cineva se ocupă».",
        "Ce face o sarcină colaborativă clară?",
        [
          "Responsabil, rezultat și termen",
          "Numai un emoji",
          "Un titlu vag",
          "Acces necontrolat la toate fișierele"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "digital-1",
        "level": "beginner",
        "order": 1,
        "title": "Fișiere, foldere și versiuni",
        "theory": "O structură de foldere clară previne pierderile. Folosește nume descriptive, dată sau versiune și diferențiază documentele finale de schițe. Verifică extensia reală a fișierului și nu executa atașamente necunoscute.",
        "method": "Creează o organizare imaginară pentru proiecte, contracte și fotografii.",
        "caseStudy": "Exemplu: Proiect_2026-11-08_v2.pdf este mai descriptiv decât document1.",
        "question": {
          "prompt": "Cum denumești util un fișier?",
          "choices": [
            "Cu subiect și versiune sau dată",
            "Numai «nou»",
            "Folosind caractere aleatorii",
            "Ascunzând extensia"
          ],
          "correct": 0,
          "explanation": "Creează o organizare imaginară pentru proiecte, contracte și fotografii."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "digital-2",
        "level": "beginner",
        "order": 2,
        "title": "Editarea documentelor și PDF",
        "theory": "Un document profesional are titlu, secțiuni, paragrafe, surse și verificare ortografică. PDF-ul păstrează prezentarea la distribuire, dar verifică paginarea, caracterele și imaginile înainte de trimitere. Nu include automat date sensibile.",
        "method": "Pregătește un document scurt cu titlu, trei secțiuni, concluzie și nume descriptiv.",
        "caseStudy": "Exemplu: o ofertă de două pagini poate fi salvată ca Oferta_serviciu_2026.pdf.",
        "question": {
          "prompt": "Ce verifici înainte să trimiți un PDF?",
          "choices": [
            "Aspect, completitudine și date sensibile",
            "Doar culoarea iconiței",
            "Doar ora telefonului",
            "Nimic dacă se deschide"
          ],
          "correct": 0,
          "explanation": "Pregătește un document scurt cu titlu, trei secțiuni, concluzie și nume descriptiv."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "digital-3",
        "level": "intermediate",
        "order": 3,
        "title": "Tabele și formule de bază",
        "theory": "Într-un tabel fiecare coloană trebuie să aibă un sens și un tip de date stabil. Folosește formule pentru calcule repetate și verifică referințele la celule. Valorile numerice și unitățile trebuie interpretate consecvent.",
        "method": "Creează un tabel cu produs, cantitate, preț unitar și total, apoi verifică suma.",
        "caseStudy": "Exemplu: 3 bucăți × 8 unități monetare = 24.",
        "question": {
          "prompt": "Care este formula logică pentru totalul unei linii?",
          "choices": [
            "Cantitate × preț unitar",
            "Cantitate + nume",
            "Preț ÷ dată",
            "Textul antetului"
          ],
          "correct": 0,
          "explanation": "Creează un tabel cu produs, cantitate, preț unitar și total, apoi verifică suma."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "digital-4",
        "level": "intermediate",
        "order": 4,
        "title": "Siguranță digitală și parole",
        "theory": "Folosește parole unice, autentificare multifactor unde este disponibilă și actualizări de securitate. Nu reutiliza codurile de recuperare sau nu le introduce pe pagini din linkuri suspecte. Verifică adresele și permisiunile înainte de partajare.",
        "method": "Analizează un exemplu de mesaj de phishing și marchează semnalele de risc.",
        "caseStudy": "Exemplu: un «administrator» cere parola prin mesaj; nu o trimiți.",
        "question": {
          "prompt": "Care este o practică sigură?",
          "choices": [
            "Parole unice și MFA",
            "Aceeași parolă peste tot",
            "Trimiterea codului unui necunoscut",
            "Instalarea oricărui atașament"
          ],
          "correct": 0,
          "explanation": "Analizează un exemplu de mesaj de phishing și marchează semnalele de risc."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "digital-5",
        "level": "advanced",
        "order": 5,
        "title": "Automatizare și organizarea muncii",
        "theory": "Automatizează mai întâi pașii repetați și bine definiți. Descrie intrarea, regula, rezultatul și modul de verificare. Un proces care afectează bani, date personale sau decizii importante are nevoie de verificări suplimentare și control uman.",
        "method": "Scrie un flux simplu: primește cererea → validează datele → generează document → revizuire.",
        "caseStudy": "Exemplu: extragi nume și dată dintr-un formular, dar verifici manual înainte de expediere.",
        "question": {
          "prompt": "Ce nu trebuie să lipsească dintr-o automatizare?",
          "choices": [
            "Verificarea rezultatului și posibilitatea corecției",
            "Ascunderea completă a erorilor",
            "Acces la toate parolele",
            "Executarea fără scop"
          ],
          "correct": 0,
          "explanation": "Scrie un flux simplu: primește cererea → validează datele → generează document → revizuire."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "digital-6",
        "level": "advanced",
        "order": 6,
        "title": "Colaborare și comunicare la distanță",
        "theory": "Alege canalul potrivit și formulează obiectivul, termenul și responsabilul. La partajarea unui document, verifică cine poate citi, edita sau redistribui. Ține versiuni și decizii importante într-un loc ușor de găsit.",
        "method": "Redactează un rezumat de ședință cu decizie, responsabil și termen.",
        "caseStudy": "Exemplu: «Ana revizuiește documentul până vineri», mai clar decât «cineva se ocupă».",
        "question": {
          "prompt": "Ce face o sarcină colaborativă clară?",
          "choices": [
            "Responsabil, rezultat și termen",
            "Numai un emoji",
            "Un titlu vag",
            "Acces necontrolat la toate fișierele"
          ],
          "correct": 0,
          "explanation": "Redactează un rezumat de ședință cu decizie, responsabil și termen."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  },
  {
    "id": "career",
    "icon": "🧭",
    "ro": "Carieră și angajare",
    "en": "Careers and employment",
    "summary": "CV, interviu, competențe, proiecte și dezvoltare.",
    "unit": "career",
    "lessons": [
      [
        "Identificarea competențelor",
        "Competențele includ cunoștințe, practici și comportamente observabile. Pornește de la activități reale și formulează dovezi concrete, fără să inventezi calificări sau diplome. Separă ceea ce poți face independent de ceea ce încă exersezi.",
        "Scrie trei activități și câte un rezultat verificabil pentru fiecare.",
        "Exemplu: «Am organizat inventarul pentru 80 de produse» oferă mai multe informații decât «sunt organizat».",
        "Ce dovedește mai bine o competență?",
        [
          "Un exemplu real și măsurabil",
          "O laudă vagă",
          "O calificare inventată",
          "Un titlu decorativ"
        ],
        0
      ],
      [
        "CV și profil profesional",
        "Un CV clar arată experiența relevantă, educația, competențele și realizările. Adaptează-l la cerințele postului, folosește cronologie consecventă și evită datele personale care nu sunt necesare. Formatul și așteptările diferă după țară și domeniu.",
        "Creează o secțiune de experiență în care fiecare punct începe cu un verb de acțiune.",
        "Exemplu: «Am redus timpul de inventariere prin etichetarea rafturilor» descrie o contribuție.",
        "Ce informație prioritizezi într-un CV?",
        [
          "Experiența și abilitățile relevante, verificabile",
          "Detalii irelevante",
          "Parole personale",
          "Realizări inventate"
        ],
        0
      ],
      [
        "Căutarea și evaluarea unui job",
        "Citește responsabilitățile, programul, locul, remunerația și condițiile. Verifică angajatorul și evită cererile suspecte de bani, acte sau coduri. Cerințele legale și drepturile diferă după jurisdicție; consultă surse oficiale.",
        "Compară două anunțuri pe criterii identice și notează întrebările de clarificat.",
        "Exemplu: două oferte cu salarii asemănătoare pot avea program și costuri de deplasare diferite.",
        "Ce verifici la un anunț de angajare?",
        [
          "Condițiile reale și identitatea angajatorului",
          "Doar fotografia",
          "Doar numărul de like-uri",
          "Doar culoarea paginii"
        ],
        0
      ],
      [
        "Pregătirea pentru interviu",
        "Exersează exemple specifice și răspunsuri structurate: situație, sarcină, acțiune, rezultat. Ascultă întrebarea înainte de a răspunde și recunoaște când nu știi ceva. Pregătește întrebări despre responsabilități și criteriile de succes ale rolului.",
        "Descrie un moment în care ai rezolvat o problemă, fără să inventezi experiențe.",
        "Exemplu: explici ce problemă a apărut, ce ai făcut și ce rezultat s-a obținut.",
        "Cum structurezi un răspuns comportamental?",
        [
          "Situație, sarcină, acțiune, rezultat",
          "Doar părerea despre șef",
          "O poveste fără rezultat",
          "Un răspuns învățat fără legătură"
        ],
        0
      ],
      [
        "Portofoliu și proiecte",
        "Un portofoliu arată mostre potrivite pentru profesia vizată și rolul concret în fiecare proiect. Respectă confidențialitatea, drepturile de autor și permisiunile. Explică problema, soluția, instrumentele și rezultatele, inclusiv limitările.",
        "Selectează două proiecte și redactează câte o fișă de o pagină.",
        "Exemplu: un mic program demonstrativ poate ilustra procesul de testare și depanare.",
        "Ce trebuie să fie clar într-un portofoliu?",
        [
          "Contribuția și rezultatul propriu",
          "Datele secrete ale clientului",
          "Copierea muncii altora",
          "Numai un titlu spectaculos"
        ],
        0
      ],
      [
        "Plan de dezvoltare profesională",
        "Alege un obiectiv de învățare verificabil, un set de resurse și o metodă de evaluare. Planifică repetiții și proiecte practice; verifică periodic dacă abilitățile dobândite corespund celor cerute în domeniu. Pentru meserii reglementate, verifică acreditările și autorizările locale.",
        "Construiește un plan de 30 de zile cu o competență, trei sarcini și un rezultat demonstrabil.",
        "Exemplu: înveți o formulă de tabel, creezi un raport, apoi îi verifici calculele.",
        "Cum verifici progresul profesional?",
        [
          "Prin rezultate demonstrate și feedback",
          "Numai prin timpul petrecut",
          "Prin diplome inventate",
          "Fără niciun obiectiv"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "career-1",
        "level": "beginner",
        "order": 1,
        "title": "Identificarea competențelor",
        "theory": "Competențele includ cunoștințe, practici și comportamente observabile. Pornește de la activități reale și formulează dovezi concrete, fără să inventezi calificări sau diplome. Separă ceea ce poți face independent de ceea ce încă exersezi.",
        "method": "Scrie trei activități și câte un rezultat verificabil pentru fiecare.",
        "caseStudy": "Exemplu: «Am organizat inventarul pentru 80 de produse» oferă mai multe informații decât «sunt organizat».",
        "question": {
          "prompt": "Ce dovedește mai bine o competență?",
          "choices": [
            "Un exemplu real și măsurabil",
            "O laudă vagă",
            "O calificare inventată",
            "Un titlu decorativ"
          ],
          "correct": 0,
          "explanation": "Scrie trei activități și câte un rezultat verificabil pentru fiecare."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "career-2",
        "level": "beginner",
        "order": 2,
        "title": "CV și profil profesional",
        "theory": "Un CV clar arată experiența relevantă, educația, competențele și realizările. Adaptează-l la cerințele postului, folosește cronologie consecventă și evită datele personale care nu sunt necesare. Formatul și așteptările diferă după țară și domeniu.",
        "method": "Creează o secțiune de experiență în care fiecare punct începe cu un verb de acțiune.",
        "caseStudy": "Exemplu: «Am redus timpul de inventariere prin etichetarea rafturilor» descrie o contribuție.",
        "question": {
          "prompt": "Ce informație prioritizezi într-un CV?",
          "choices": [
            "Experiența și abilitățile relevante, verificabile",
            "Detalii irelevante",
            "Parole personale",
            "Realizări inventate"
          ],
          "correct": 0,
          "explanation": "Creează o secțiune de experiență în care fiecare punct începe cu un verb de acțiune."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "career-3",
        "level": "intermediate",
        "order": 3,
        "title": "Căutarea și evaluarea unui job",
        "theory": "Citește responsabilitățile, programul, locul, remunerația și condițiile. Verifică angajatorul și evită cererile suspecte de bani, acte sau coduri. Cerințele legale și drepturile diferă după jurisdicție; consultă surse oficiale.",
        "method": "Compară două anunțuri pe criterii identice și notează întrebările de clarificat.",
        "caseStudy": "Exemplu: două oferte cu salarii asemănătoare pot avea program și costuri de deplasare diferite.",
        "question": {
          "prompt": "Ce verifici la un anunț de angajare?",
          "choices": [
            "Condițiile reale și identitatea angajatorului",
            "Doar fotografia",
            "Doar numărul de like-uri",
            "Doar culoarea paginii"
          ],
          "correct": 0,
          "explanation": "Compară două anunțuri pe criterii identice și notează întrebările de clarificat."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "career-4",
        "level": "intermediate",
        "order": 4,
        "title": "Pregătirea pentru interviu",
        "theory": "Exersează exemple specifice și răspunsuri structurate: situație, sarcină, acțiune, rezultat. Ascultă întrebarea înainte de a răspunde și recunoaște când nu știi ceva. Pregătește întrebări despre responsabilități și criteriile de succes ale rolului.",
        "method": "Descrie un moment în care ai rezolvat o problemă, fără să inventezi experiențe.",
        "caseStudy": "Exemplu: explici ce problemă a apărut, ce ai făcut și ce rezultat s-a obținut.",
        "question": {
          "prompt": "Cum structurezi un răspuns comportamental?",
          "choices": [
            "Situație, sarcină, acțiune, rezultat",
            "Doar părerea despre șef",
            "O poveste fără rezultat",
            "Un răspuns învățat fără legătură"
          ],
          "correct": 0,
          "explanation": "Descrie un moment în care ai rezolvat o problemă, fără să inventezi experiențe."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "career-5",
        "level": "advanced",
        "order": 5,
        "title": "Portofoliu și proiecte",
        "theory": "Un portofoliu arată mostre potrivite pentru profesia vizată și rolul concret în fiecare proiect. Respectă confidențialitatea, drepturile de autor și permisiunile. Explică problema, soluția, instrumentele și rezultatele, inclusiv limitările.",
        "method": "Selectează două proiecte și redactează câte o fișă de o pagină.",
        "caseStudy": "Exemplu: un mic program demonstrativ poate ilustra procesul de testare și depanare.",
        "question": {
          "prompt": "Ce trebuie să fie clar într-un portofoliu?",
          "choices": [
            "Contribuția și rezultatul propriu",
            "Datele secrete ale clientului",
            "Copierea muncii altora",
            "Numai un titlu spectaculos"
          ],
          "correct": 0,
          "explanation": "Selectează două proiecte și redactează câte o fișă de o pagină."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "career-6",
        "level": "advanced",
        "order": 6,
        "title": "Plan de dezvoltare profesională",
        "theory": "Alege un obiectiv de învățare verificabil, un set de resurse și o metodă de evaluare. Planifică repetiții și proiecte practice; verifică periodic dacă abilitățile dobândite corespund celor cerute în domeniu. Pentru meserii reglementate, verifică acreditările și autorizările locale.",
        "method": "Construiește un plan de 30 de zile cu o competență, trei sarcini și un rezultat demonstrabil.",
        "caseStudy": "Exemplu: înveți o formulă de tabel, creezi un raport, apoi îi verifici calculele.",
        "question": {
          "prompt": "Cum verifici progresul profesional?",
          "choices": [
            "Prin rezultate demonstrate și feedback",
            "Numai prin timpul petrecut",
            "Prin diplome inventate",
            "Fără niciun obiectiv"
          ],
          "correct": 0,
          "explanation": "Construiește un plan de 30 de zile cu o competență, trei sarcini și un rezultat demonstrabil."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  },
  {
    "id": "daily",
    "icon": "🏠",
    "ro": "Viață practică",
    "en": "Everyday practical skills",
    "summary": "Planificare, reparații simple, consum, sănătate și siguranță.",
    "unit": "daily",
    "lessons": [
      [
        "Organizarea timpului",
        "Prioritizează sarcinile după urgență și importanță; rezervă timp pentru pauze și imprevizibil. O listă scurtă de activități realizabile este mai utilă decât un program imposibil. Revizuiește ce s-a realizat și mută restul conștient.",
        "Planifică o zi cu trei sarcini principale și perioade de rezervă.",
        "Exemplu: programezi cumpărăturile înainte de pregătirea mesei și păstrezi timp pentru drum.",
        "Ce caracterizează un plan realizabil?",
        [
          "Priorități, timp disponibil și pauze",
          "Timp infinit",
          "Toate sarcinile simultan",
          "Nicio rezervă"
        ],
        0
      ],
      [
        "Cumpărături și comparații",
        "Compară prețuri raportate la aceeași unitate și verifică termenul, calitatea și nevoia reală. Un produs mai ieftin pe ambalaj nu este întotdeauna mai ieftin per kilogram sau litru. Nu face stocuri ce se pot altera doar pentru o reducere.",
        "Calculează prețul per 100 g sau per litru pentru două produse.",
        "Exemplu: 500 g la 3 costă 6 pe kilogram; 1 kg la 5 costă 5 pe kilogram.",
        "Cum compari corect ambalaje diferite?",
        [
          "Preț pe aceeași unitate",
          "Doar mărimea etichetei",
          "Numărul de reclame",
          "Doar culoarea cutiei"
        ],
        0
      ],
      [
        "Întreținerea preventivă",
        "Verificările vizuale și curățenia pot preveni probleme obișnuite, dar nu înlocuiesc reviziile obligatorii. Oprește intervenția dacă există risc electric, gaz, cădere sau substanțe periculoase și solicită personal calificat. Urmează instrucțiunile producătorului.",
        "Construiește un calendar pentru activități sigure, neintruzive, precum verificarea filtrelor accesibile.",
        "Exemplu: observi miros de gaz: te îndepărtezi, eviți acționarea întrerupătoarelor și apelezi serviciile competente.",
        "Ce faci în cazul unui posibil pericol legat de gaze?",
        [
          "Urmezi procedurile de urgență și ceri ajutor specializat",
          "Aprinzi un chibrit",
          "Deschizi un aparat la întâmplare",
          "Ignori situația"
        ],
        0
      ],
      [
        "Alimente și igienă în bucătărie",
        "Separă alimentele crude de cele gata de consum, curăță suprafețele și respectă recomandările oficiale pentru temperaturi și depozitare. Evită să deduci siguranța unui aliment doar din miros sau aspect. Pentru alergii, verifică ingredientele și contaminarea încrucișată.",
        "Pregătește un plan de organizare a frigiderului și un checklist de igienă.",
        "Exemplu: folosește ustensile separate sau spală-le adecvat între carne crudă și alimente gata de consum.",
        "Ce previne contaminarea încrucișată?",
        [
          "Separarea alimentelor crude și gătite",
          "Folosirea aceleiași tocătoare murdare",
          "Păstrarea la cald necontrolat",
          "Ignorarea alergiilor"
        ],
        0
      ],
      [
        "Documente și servicii administrative",
        "Păstrează copii necesare, expirările și confirmările într-un sistem organizat. Pentru permise, asigurări și documente de identitate consultă autoritățile competente și nu trimite fotografii sau numere personale către surse neconfirmate.",
        "Construiește un registru cu tipul documentului, valabilitate, sursa oficială și data verificării.",
        "Exemplu: primești o solicitare nesolicitată de fotografie a actului; verifică independent cine o cere și de ce.",
        "Ce faci înainte de trimiterea unui document personal?",
        [
          "Verifici identitatea, scopul și canalul sigur",
          "Îl publici pe internet",
          "Îl trimiți oricui întreabă",
          "Ignori protecția datelor"
        ],
        0
      ],
      [
        "Pregătirea pentru situații neprevăzute",
        "Un plan simplu include contacte de urgență, rute de ieșire, acces la medicamente prescrise și verificarea avertismentelor oficiale. Cunoaște numerele de urgență locale; ele diferă după jurisdicție. Nu încerca intervenții pentru care nu ai pregătire și nu expune alte persoane la risc.",
        "Redactează un checklist de siguranță pentru locuință și revizuiește-l periodic.",
        "Exemplu: în caz de incendiu, prioritatea este evacuarea și apelarea serviciilor competente, nu recuperarea obiectelor.",
        "Care este prima prioritate într-un incendiu activ?",
        [
          "Siguranța oamenilor și evacuarea",
          "Salvarea documentelor cu orice risc",
          "Filmatul situației",
          "Deschiderea tuturor aparatelor"
        ],
        0
      ]
    ],
    "chapters": [
      {
        "id": "daily-1",
        "level": "beginner",
        "order": 1,
        "title": "Organizarea timpului",
        "theory": "Prioritizează sarcinile după urgență și importanță; rezervă timp pentru pauze și imprevizibil. O listă scurtă de activități realizabile este mai utilă decât un program imposibil. Revizuiește ce s-a realizat și mută restul conștient.",
        "method": "Planifică o zi cu trei sarcini principale și perioade de rezervă.",
        "caseStudy": "Exemplu: programezi cumpărăturile înainte de pregătirea mesei și păstrezi timp pentru drum.",
        "question": {
          "prompt": "Ce caracterizează un plan realizabil?",
          "choices": [
            "Priorități, timp disponibil și pauze",
            "Timp infinit",
            "Toate sarcinile simultan",
            "Nicio rezervă"
          ],
          "correct": 0,
          "explanation": "Planifică o zi cu trei sarcini principale și perioade de rezervă."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "daily-2",
        "level": "beginner",
        "order": 2,
        "title": "Cumpărături și comparații",
        "theory": "Compară prețuri raportate la aceeași unitate și verifică termenul, calitatea și nevoia reală. Un produs mai ieftin pe ambalaj nu este întotdeauna mai ieftin per kilogram sau litru. Nu face stocuri ce se pot altera doar pentru o reducere.",
        "method": "Calculează prețul per 100 g sau per litru pentru două produse.",
        "caseStudy": "Exemplu: 500 g la 3 costă 6 pe kilogram; 1 kg la 5 costă 5 pe kilogram.",
        "question": {
          "prompt": "Cum compari corect ambalaje diferite?",
          "choices": [
            "Preț pe aceeași unitate",
            "Doar mărimea etichetei",
            "Numărul de reclame",
            "Doar culoarea cutiei"
          ],
          "correct": 0,
          "explanation": "Calculează prețul per 100 g sau per litru pentru două produse."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "daily-3",
        "level": "intermediate",
        "order": 3,
        "title": "Întreținerea preventivă",
        "theory": "Verificările vizuale și curățenia pot preveni probleme obișnuite, dar nu înlocuiesc reviziile obligatorii. Oprește intervenția dacă există risc electric, gaz, cădere sau substanțe periculoase și solicită personal calificat. Urmează instrucțiunile producătorului.",
        "method": "Construiește un calendar pentru activități sigure, neintruzive, precum verificarea filtrelor accesibile.",
        "caseStudy": "Exemplu: observi miros de gaz: te îndepărtezi, eviți acționarea întrerupătoarelor și apelezi serviciile competente.",
        "question": {
          "prompt": "Ce faci în cazul unui posibil pericol legat de gaze?",
          "choices": [
            "Urmezi procedurile de urgență și ceri ajutor specializat",
            "Aprinzi un chibrit",
            "Deschizi un aparat la întâmplare",
            "Ignori situația"
          ],
          "correct": 0,
          "explanation": "Construiește un calendar pentru activități sigure, neintruzive, precum verificarea filtrelor accesibile."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "daily-4",
        "level": "intermediate",
        "order": 4,
        "title": "Alimente și igienă în bucătărie",
        "theory": "Separă alimentele crude de cele gata de consum, curăță suprafețele și respectă recomandările oficiale pentru temperaturi și depozitare. Evită să deduci siguranța unui aliment doar din miros sau aspect. Pentru alergii, verifică ingredientele și contaminarea încrucișată.",
        "method": "Pregătește un plan de organizare a frigiderului și un checklist de igienă.",
        "caseStudy": "Exemplu: folosește ustensile separate sau spală-le adecvat între carne crudă și alimente gata de consum.",
        "question": {
          "prompt": "Ce previne contaminarea încrucișată?",
          "choices": [
            "Separarea alimentelor crude și gătite",
            "Folosirea aceleiași tocătoare murdare",
            "Păstrarea la cald necontrolat",
            "Ignorarea alergiilor"
          ],
          "correct": 0,
          "explanation": "Pregătește un plan de organizare a frigiderului și un checklist de igienă."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "daily-5",
        "level": "advanced",
        "order": 5,
        "title": "Documente și servicii administrative",
        "theory": "Păstrează copii necesare, expirările și confirmările într-un sistem organizat. Pentru permise, asigurări și documente de identitate consultă autoritățile competente și nu trimite fotografii sau numere personale către surse neconfirmate.",
        "method": "Construiește un registru cu tipul documentului, valabilitate, sursa oficială și data verificării.",
        "caseStudy": "Exemplu: primești o solicitare nesolicitată de fotografie a actului; verifică independent cine o cere și de ce.",
        "question": {
          "prompt": "Ce faci înainte de trimiterea unui document personal?",
          "choices": [
            "Verifici identitatea, scopul și canalul sigur",
            "Îl publici pe internet",
            "Îl trimiți oricui întreabă",
            "Ignori protecția datelor"
          ],
          "correct": 0,
          "explanation": "Construiește un registru cu tipul documentului, valabilitate, sursa oficială și data verificării."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      },
      {
        "id": "daily-6",
        "level": "advanced",
        "order": 6,
        "title": "Pregătirea pentru situații neprevăzute",
        "theory": "Un plan simplu include contacte de urgență, rute de ieșire, acces la medicamente prescrise și verificarea avertismentelor oficiale. Cunoaște numerele de urgență locale; ele diferă după jurisdicție. Nu încerca intervenții pentru care nu ai pregătire și nu expune alte persoane la risc.",
        "method": "Redactează un checklist de siguranță pentru locuință și revizuiește-l periodic.",
        "caseStudy": "Exemplu: în caz de incendiu, prioritatea este evacuarea și apelarea serviciilor competente, nu recuperarea obiectelor.",
        "question": {
          "prompt": "Care este prima prioritate într-un incendiu activ?",
          "choices": [
            "Siguranța oamenilor și evacuarea",
            "Salvarea documentelor cu orice risc",
            "Filmatul situației",
            "Deschiderea tuturor aparatelor"
          ],
          "correct": 0,
          "explanation": "Redactează un checklist de siguranță pentru locuință și revizuiește-l periodic."
        },
        "practice": [
          "Explică în propriile cuvinte regula de bază a lecției și indică un exemplu realist.",
          "Rezolvă cazul practic de mai sus, cu pași numerotați și verificarea concluziei.",
          "Construiește un checklist aplicabil unei situații reale, precizând ce trebuie verificat înainte de acțiune."
        ]
      }
    ]
  }
];
export const PRACTICAL_STATEMENT='Materiale originale de orientare practică. Nu reprezintă certificare profesională, recomandare financiară individuală, aviz tehnic sau interpretare juridică. Pentru taxe, autorizări, siguranță și profesii reglementate se verifică sursele oficiale locale.';
export function practicalCourse(id){return PRACTICAL_COURSES.find(c=>c.id===id)||null}
export function practicalChapters(courseId,level){return (practicalCourse(courseId)?.chapters||[]).filter(x=>!level||x.level===level)}
export function practicalQuiz(courseId,chapterId,variant=0,limit=5){
 const course=practicalCourse(courseId);if(!course)return[];
 const chapter=course.chapters.find(x=>x.id===chapterId);if(!chapter)return[];
 // One question from this chapter, rotating through others in the same level.
 const peers=course.chapters.filter(x=>x.level===chapter.level&&x.id!==chapterId);
 const others=course.chapters.filter(x=>x.id!==chapterId&&!peers.includes(x));
 const tail=[...peers,...others]; const offset=((Number(variant)||0)%Math.max(1,tail.length)+Math.max(1,tail.length))%Math.max(1,tail.length);
 const ordered=[chapter,...tail.slice(offset),...tail.slice(0,offset)];
 return ordered.slice(0,Math.max(1,Math.min(5,limit))).map(x=>({...x.question,id:x.id,title:x.title,chapterId:x.id,subjectLevel:x.level}));
}
export function practicalScore(questions,answers){const count=questions.reduce((n,q,i)=>n+(Number.isInteger(answers[i])&&answers[i]===q.correct?1:0),0);return {correct:count,total:questions.length,percent:questions.length?Math.round(count*100/questions.length):null}}
