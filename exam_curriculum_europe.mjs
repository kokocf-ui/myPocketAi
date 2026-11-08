// School examinations by jurisdiction; official-framework links and explicit limitations.
// Exam examples are ORIGINAL practice materials, never official past papers or certified grading.
export const EXAM_SUBJECTS=[
  {
    "id": "romanian",
    "ro": "Limba și literatura română",
    "en": "Romanian language and literature",
    "area": "literature"
  },
  {
    "id": "native",
    "ro": "Limba maternă",
    "en": "Mother tongue",
    "area": "literature"
  },
  {
    "id": "math",
    "ro": "Matematică",
    "en": "Mathematics",
    "area": "math"
  },
  {
    "id": "history",
    "ro": "Istorie",
    "en": "History",
    "area": "history"
  },
  {
    "id": "geography",
    "ro": "Geografie",
    "en": "Geography",
    "area": "history"
  },
  {
    "id": "history-geography",
    "ro": "Istorie și geografie",
    "en": "History and geography",
    "area": "history"
  },
  {
    "id": "physics",
    "ro": "Fizică",
    "en": "Physics",
    "area": "science"
  },
  {
    "id": "chemistry",
    "ro": "Chimie",
    "en": "Chemistry",
    "area": "science"
  },
  {
    "id": "biology",
    "ro": "Biologie",
    "en": "Biology",
    "area": "science"
  },
  {
    "id": "science",
    "ro": "Științe",
    "en": "Science",
    "area": "science"
  },
  {
    "id": "computing",
    "ro": "Informatică",
    "en": "Computer science",
    "area": "computing"
  },
  {
    "id": "english",
    "ro": "Engleză / English",
    "en": "English",
    "area": "literature"
  },
  {
    "id": "foreign",
    "ro": "Limbă străină",
    "en": "Foreign language",
    "area": "languages"
  },
  {
    "id": "french",
    "ro": "Franceză / Français",
    "en": "French",
    "area": "literature"
  },
  {
    "id": "german",
    "ro": "Germană / Deutsch",
    "en": "German",
    "area": "literature"
  },
  {
    "id": "polish",
    "ro": "Poloneză / Polski",
    "en": "Polish",
    "area": "literature"
  },
  {
    "id": "portuguese",
    "ro": "Portugheză / Português",
    "en": "Portuguese",
    "area": "literature"
  },
  {
    "id": "italian",
    "ro": "Italiană / Italiano",
    "en": "Italian",
    "area": "literature"
  },
  {
    "id": "spanish",
    "ro": "Spaniolă / Español",
    "en": "Spanish",
    "area": "literature"
  },
  {
    "id": "dutch",
    "ro": "Neerlandeză / Nederlands",
    "en": "Dutch",
    "area": "literature"
  },
  {
    "id": "philosophy",
    "ro": "Filosofie",
    "en": "Philosophy",
    "area": "humanities"
  },
  {
    "id": "art",
    "ro": "Arte și aptitudini",
    "en": "Arts and aptitude",
    "area": "arts"
  },
  {
    "id": "music",
    "ro": "Muzică și aptitudini",
    "en": "Music and aptitude",
    "area": "arts"
  },
  {
    "id": "oral",
    "ro": "Probă orală / prezentare",
    "en": "Oral exam / presentation",
    "area": "communication"
  }
];
export const EXAM_SPECS=[
  {
    "country": "RO",
    "id": "en8",
    "ro": "Evaluarea Națională – clasa a VIII-a",
    "en": "National Assessment, grade 8",
    "grades": [
      "8"
    ],
    "subjects": [
      "romanian",
      "math",
      "native"
    ],
    "source": "https://www.edu.ro/evaluare_nationala_ENVIII",
    "sessionSource": "https://www.edu.ro/press_rel_59_2026_consultare_publica_proiecte_metodologii_calendare_examene_2027",
    "notice": "Examen național; limba maternă numai pentru candidații eligibili. Calendarul 2027 identificat în documentele de consultare nu trebuie prezentat drept definitiv."
  },
  {
    "country": "RO",
    "id": "bac",
    "ro": "Bacalaureat",
    "en": "Baccalaureate",
    "grades": [
      "12",
      "13 seral"
    ],
    "subjects": [
      "romanian",
      "math",
      "history",
      "biology",
      "physics",
      "chemistry",
      "computing",
      "geography",
      "philosophy",
      "native",
      "foreign"
    ],
    "source": "https://www.edu.ro/bacalaureat",
    "sessionSource": "https://www.edu.ro/cons_pub_PO_66_26_organizare_calendar_bacalaureat_2027",
    "tracks": [
      "Real – matematică-informatică",
      "Real – științe ale naturii",
      "Uman – filologie",
      "Uman – științe sociale",
      "Tehnologic",
      "Vocațional"
    ],
    "requiresTrack": true,
    "notice": "Probele diferă după filieră, profil și specializare. Lista este un catalog de selecție, nu o listă de probe obligatorii pentru orice elev. Verifică baremele oficiale."
  },
  {
    "country": "RO",
    "id": "admitere",
    "ro": "Admitere liceu / profil vocațional (orientativ)",
    "en": "School admissions / aptitude preparation (advisory)",
    "grades": [
      "8"
    ],
    "subjects": [
      "romanian",
      "math",
      "foreign",
      "music",
      "art"
    ],
    "source": "https://www.edu.ro/",
    "advisory": true,
    "notice": "Nu este un singur examen național de admitere; probele de aptitudini depind de liceu și profil. Exercițiile sunt orientative."
  },
  {
    "country": "GB-ENG",
    "id": "ks2",
    "ro": "KS2 – evaluări Year 6",
    "en": "Key Stage 2 tests, Year 6",
    "grades": [
      "Y6"
    ],
    "subjects": [
      "english",
      "math"
    ],
    "source": "https://www.gov.uk/government/publications/key-stage-2-assessment-and-reporting-arrangements-ara/2027-key-stage-2-assessment-and-reporting-arrangements",
    "notice": "Evaluări naționale de citire, gramatică/ortografie și matematică. Nu le confunda cu un examen de admitere."
  },
  {
    "country": "GB-ENG",
    "id": "gcse",
    "ro": "GCSE – Year 10–11",
    "en": "GCSE, Years 10–11",
    "grades": [
      "Y10",
      "Y11"
    ],
    "subjects": [
      "english",
      "math",
      "science",
      "history",
      "geography",
      "computing",
      "foreign",
      "art"
    ],
    "source": "https://www.gov.uk/government/publications/what-people-working-in-schools-and-colleges-need-to-know-about-the-exam-and-assessment-season/what-people-working-in-schools-and-colleges-need-to-know-about-the-exam-and-assessment-season",
    "requiresBoard": true,
    "notice": "Fiecare materie și format depind de awarding body (AQA, Pearson Edexcel, OCR etc.). Fără board confirmat, subiectele sunt doar de antrenament."
  },
  {
    "country": "GB-ENG",
    "id": "alevel",
    "ro": "AS / A levels – Year 12–13",
    "en": "AS / A levels, Years 12–13",
    "grades": [
      "Y12",
      "Y13"
    ],
    "subjects": [
      "english",
      "math",
      "biology",
      "chemistry",
      "physics",
      "history",
      "computing",
      "geography",
      "foreign"
    ],
    "source": "https://www.gov.uk/government/publications/what-people-working-in-schools-and-colleges-need-to-know-about-the-exam-and-assessment-season/what-people-working-in-schools-and-colleges-need-to-know-about-the-exam-and-assessment-season",
    "requiresBoard": true,
    "notice": "Alege syllabus/board pentru conținut exact; AS și A-level nu sunt același examen."
  },
  {
    "country": "GB-SCT",
    "id": "national5",
    "ro": "National 5",
    "en": "National 5",
    "grades": [
      "S4",
      "S5"
    ],
    "subjects": [
      "english",
      "math",
      "science",
      "biology",
      "chemistry",
      "physics",
      "history",
      "computing",
      "foreign"
    ],
    "source": "https://www.qualifications.gov.scot/",
    "notice": "Calificări scoțiene, distincte de GCSE; opțiunile școlii și schemele materiei trebuie verificate."
  },
  {
    "country": "GB-SCT",
    "id": "higher",
    "ro": "Higher / Advanced Higher",
    "en": "Higher / Advanced Higher",
    "grades": [
      "S5",
      "S6"
    ],
    "subjects": [
      "english",
      "math",
      "biology",
      "chemistry",
      "physics",
      "history",
      "computing",
      "foreign"
    ],
    "source": "https://www.qualifications.gov.scot/",
    "notice": "Higher și Advanced Higher au cerințe diferite; selectează nivelul real și materia."
  },
  {
    "country": "GB-WLS",
    "id": "wales-gcse",
    "ro": "GCSE – Curriculum for Wales",
    "en": "Made-for-Wales GCSEs",
    "grades": [
      "Y10",
      "Y11"
    ],
    "subjects": [
      "english",
      "math",
      "science",
      "history",
      "geography",
      "foreign",
      "computing"
    ],
    "source": "https://www.gov.wales/16-18-local-curricula-guidance-html-0",
    "requiresBoard": true,
    "notice": "Reforma GCSE este introdusă etapizat; 2027, 2028 și 2029 includ valuri diferite de calificări. Nu utiliza automat specificațiile din Anglia."
  },
  {
    "country": "GB-WLS",
    "id": "wales-alevel",
    "ro": "AS / A levels – Țara Galilor",
    "en": "AS / A levels, Wales",
    "grades": [
      "Y12",
      "Y13"
    ],
    "subjects": [
      "english",
      "math",
      "biology",
      "chemistry",
      "physics",
      "history",
      "foreign"
    ],
    "source": "https://qualifications.wales/",
    "requiresBoard": true,
    "notice": "Verifică specificațiile locale și anul absolvirii."
  },
  {
    "country": "GB-NIR",
    "id": "ni-gcse",
    "ro": "GCSE – Irlanda de Nord",
    "en": "Northern Ireland GCSE",
    "grades": [
      "Y11",
      "Y12"
    ],
    "subjects": [
      "english",
      "math",
      "science",
      "history",
      "geography",
      "computing",
      "foreign"
    ],
    "source": "https://ccea.org.uk/",
    "requiresBoard": true,
    "notice": "Calificări GCSE pentru NI, nu presupune automat programa Angliei."
  },
  {
    "country": "GB-NIR",
    "id": "ni-gce",
    "ro": "GCE AS / A level – Irlanda de Nord",
    "en": "Northern Ireland GCE",
    "grades": [
      "Y13",
      "Y14"
    ],
    "subjects": [
      "english",
      "math",
      "physics",
      "biology",
      "chemistry",
      "history",
      "foreign"
    ],
    "source": "https://ccea.org.uk/",
    "requiresBoard": true,
    "notice": "Alege board-ul/specificația înaintea unei alinieri exacte."
  },
  {
    "country": "FR",
    "id": "dnb",
    "ro": "Diplôme national du brevet – 3e",
    "en": "Brevet (DNB), 3e",
    "grades": [
      "3e"
    ],
    "subjects": [
      "french",
      "math",
      "history-geography",
      "science",
      "oral"
    ],
    "source": "https://www.education.gouv.fr/bo/2026/Hebdo4/MENE2623228N",
    "notice": "Pentru sesiunea 2027 sunt publicate noi definiții ale probelor; la științe două dintre cele trei discipline se aleg pentru sesiunea respectivă."
  },
  {
    "country": "FR",
    "id": "bac-fr-early",
    "ro": "Bac – probe anticipate Première",
    "en": "French Bac anticipated tests",
    "grades": [
      "1ere"
    ],
    "subjects": [
      "french",
      "math"
    ],
    "source": "https://eduscol.education.gouv.fr/4548/les-baccalaureats-general-et-technologique",
    "notice": "Din sesiunea 2027: franceză scris/oral și noua probă anticipată de matematică."
  },
  {
    "country": "FR",
    "id": "bac-fr",
    "ro": "Baccalauréat – Terminale",
    "en": "French Baccalauréat, Terminale",
    "grades": [
      "Terminale"
    ],
    "subjects": [
      "philosophy",
      "math",
      "physics",
      "chemistry",
      "biology",
      "history-geography",
      "computing",
      "foreign",
      "oral"
    ],
    "source": "https://eduscol.education.gouv.fr/4548/les-baccalaureats-general-et-technologique",
    "tracks": [
      "Voie générale",
      "Voie technologique",
      "Voie professionnelle"
    ],
    "requiresTrack": true,
    "notice": "Pentru general/tehnologic există control continuu și probe terminale; două specialități și Grand oral depind de traseu. Profesionalul are reguli distincte."
  },
  {
    "country": "PL",
    "id": "osmoklasisty",
    "ro": "Egzamin ósmoklasisty – clasa VIII",
    "en": "Polish eighth-grader exam",
    "grades": [
      "VIII"
    ],
    "subjects": [
      "polish",
      "math",
      "foreign"
    ],
    "source": "https://egzaminy.gov.pl/cke",
    "notice": "În 2027 se aplică cerințele de bază 2024; reforma din 2026 intră treptat în alte clase."
  },
  {
    "country": "PL",
    "id": "matura",
    "ro": "Matura",
    "en": "Matura",
    "grades": [
      "Liceum IV",
      "Technikum V"
    ],
    "subjects": [
      "polish",
      "math",
      "foreign",
      "history",
      "biology",
      "chemistry",
      "physics",
      "geography",
      "computing"
    ],
    "source": "https://egzaminy.gov.pl/cke",
    "notice": "Distingere între nivelul de bază și extins, proba orală și disciplina aleasă; formulele de examene sunt specifice generației."
  },
  {
    "country": "PT",
    "id": "portugal-9",
    "ro": "Provas finais – 9.º ano",
    "en": "Final basic education tests, year 9",
    "grades": [
      "9"
    ],
    "subjects": [
      "portuguese",
      "math"
    ],
    "source": "https://www.dge.mec.pt/node/3272",
    "notice": "Probele finale din anul 9 includ Português/PLNM/PL2 și Matematică, în funcție de eligibilitate."
  },
  {
    "country": "PT",
    "id": "portugal-sec",
    "ro": "Exames finais nacionais – secundário",
    "en": "National secondary final examinations",
    "grades": [
      "11",
      "12"
    ],
    "subjects": [
      "portuguese",
      "math",
      "biology",
      "chemistry",
      "physics",
      "history",
      "geography",
      "foreign",
      "philosophy"
    ],
    "source": "https://www.dge.mec.pt/perguntas-frequentes-ensino-secundario",
    "notice": "Probele variază după planul de studiu și disciplină; verifică ghidul și codul probei."
  },
  {
    "country": "DE",
    "id": "abitur",
    "ro": "Abitur – Gymnasium / Oberstufe",
    "en": "German Abitur",
    "grades": [
      "12",
      "13"
    ],
    "subjects": [
      "german",
      "math",
      "foreign",
      "history",
      "biology",
      "physics",
      "chemistry",
      "geography",
      "computing"
    ],
    "source": "https://www.kmk.org/bildungsministerkonferenz/vertiefende-bildungsinhalte/bildungswege-und-schulabschluesse/gymnasiale-oberstufe-und-abitur.html",
    "requiresRegion": true,
    "notice": "Land-ul stabilește detaliile probelor; nu există o listă națională unică de subiecte Abitur pentru toate landurile."
  },
  {
    "country": "ES",
    "id": "pau",
    "ro": "PAU – admitere universitate",
    "en": "Prueba de Acceso a la Universidad",
    "grades": [
      "2 Bach"
    ],
    "subjects": [
      "spanish",
      "math",
      "history",
      "foreign",
      "biology",
      "chemistry",
      "physics",
      "philosophy",
      "art"
    ],
    "source": "https://www.boe.es/buscar/act.php?id=BOE-A-2024-11858",
    "requiresRegion": true,
    "notice": "Materii comune, de profil, limba cooficială unde se aplică. Comunitățile autonome stabilesc detalii. Nu inventa opțiuni obligatorii individuale."
  },
  {
    "country": "IT",
    "id": "esame-primo",
    "ro": "Esame di Stato – fine primo ciclo",
    "en": "Italian first-cycle State exam",
    "grades": [
      "3 Secondaria I"
    ],
    "subjects": [
      "italian",
      "math",
      "foreign",
      "oral"
    ],
    "source": "https://www.mim.gov.it/",
    "notice": "Probele scrise și interviul oral se organizează conform regulilor naționale și școlii."
  },
  {
    "country": "IT",
    "id": "maturita",
    "ro": "Esame di maturità – secondo ciclo",
    "en": "Italian second-cycle State exam",
    "grades": [
      "5 Superiore"
    ],
    "subjects": [
      "italian",
      "math",
      "history",
      "foreign",
      "biology",
      "chemistry",
      "physics",
      "oral"
    ],
    "source": "https://www.mim.gov.it/",
    "requiresTrack": true,
    "tracks": [
      "Liceo",
      "Tecnico",
      "Professionale"
    ],
    "notice": "Probe diferite în funcție de traseu și specializare; verifică documentele anuale MIM."
  },
  {
    "country": "NL",
    "id": "eindexamen",
    "ro": "Eindexamen – VMBO/HAVO/VWO",
    "en": "Dutch secondary final exams",
    "grades": [
      "VMBO 4",
      "HAVO 5",
      "VWO 6"
    ],
    "subjects": [
      "dutch",
      "math",
      "english",
      "history",
      "biology",
      "chemistry",
      "physics",
      "geography"
    ],
    "source": "https://www.examenblad.nl/2027/onderwerpen/mededelingen-over-eindexamens-2027-vmbo-havo-vwo-septembermededeling-maartaanvulling",
    "notice": "Nivelul VMBO/HAVO/VWO definește programa examenului central. Modelele 2027 sunt specifice nivelului."
  },
  {
    "country": "IE",
    "id": "junior",
    "ro": "Junior Cycle",
    "en": "Junior Cycle",
    "grades": [
      "Junior 3"
    ],
    "subjects": [
      "english",
      "math",
      "history",
      "science",
      "foreign"
    ],
    "source": "https://www.gov.ie/en/department-of-education/publications/state-examinations-2026/",
    "notice": "Evaluarea Junior Cycle combină evaluări la clasă și examene; specificațiile sunt distincte de Leaving Certificate."
  },
  {
    "country": "IE",
    "id": "leaving",
    "ro": "Leaving Certificate",
    "en": "Leaving Certificate",
    "grades": [
      "Senior 6"
    ],
    "subjects": [
      "english",
      "math",
      "history",
      "biology",
      "chemistry",
      "physics",
      "foreign",
      "geography"
    ],
    "source": "https://www.gov.ie/en/department-of-education/publications/state-examinations-2026/",
    "notice": "Alege nivelul Higher/Ordinary și materia. Specificațiile sunt actualizate treptat în cadrul Senior Cycle Redevelopment."
  }
,
{
  "country": "RO",
  "id": "university",
  "ro": "Admitere la universitate – licență",
  "en": "University admission – undergraduate",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "romanian",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "history",
    "geography",
    "foreign",
    "philosophy",
    "art",
    "oral"
  ],
  "source": "https://www.edu.ro/studii-licenta",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Fiecare universitate/facultate publică metodologia proprie; pot exista concurs scris, dosar, probe practice, interviu sau combinații. Materiile afișate sunt opțiuni de antrenament, nu probe obligatorii."
},
{
  "country": "GB-ENG",
  "id": "university",
  "ro": "Admitere la universitate – UCAS",
  "en": "University applications – UCAS",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "history",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.ucas.com/applying/you-apply/what-and-where-study/entry-requirements",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Nu există un examen universitar unic; cursul stabilește condiții, iar anumite programe solicită teste de admitere, interviu sau portofoliu."
},
{
  "country": "GB-SCT",
  "id": "university",
  "ro": "Admitere la universitate – Scoția",
  "en": "University applications – Scotland",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.ucas.com/applying/you-apply/what-and-where-study/entry-requirements",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Universitățile stabilesc condiții în funcție de Higher/Advanced Higher sau calificări echivalente. Testele și interviurile variază după program."
},
{
  "country": "GB-WLS",
  "id": "university",
  "ro": "Admitere la universitate – Țara Galilor",
  "en": "University applications – Wales",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.ucas.com/applying/you-apply/what-and-where-study/entry-requirements",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Intrarea se face pe bază de condiții ale programului; nu există probă unică de admitere pentru toate universitățile."
},
{
  "country": "GB-NIR",
  "id": "university",
  "ro": "Admitere la universitate – Irlanda de Nord",
  "en": "University applications – Northern Ireland",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.ucas.com/applying/you-apply/what-and-where-study/entry-requirements",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Condițiile sunt stabilite de fiecare instituție și program; în unele cazuri există teste, interviuri ori portofoliu."
},
{
  "country": "FR",
  "id": "university",
  "ro": "Admitere la învățământul superior – Parcoursup",
  "en": "Higher education applications – Parcoursup",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "french",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "philosophy",
    "art",
    "oral"
  ],
  "source": "https://www.parcoursup.gouv.fr/",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Parcoursup coordonează multe candidaturi, dar nu constituie un examen național unic de admitere. Procedurile și probele depind de formare și statutul candidatului."
},
{
  "country": "PL",
  "id": "university",
  "ro": "Admitere la studii universitare – recrutare",
  "en": "University recruitment – Poland",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "polish",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.gov.pl/web/nauka",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Condițiile diferă după instituție și program; rezultatele Matura pot fi folosite, iar pentru unele domenii există probe specifice."
},
{
  "country": "PT",
  "id": "university",
  "ro": "Acces la învățământ superior – concurs național",
  "en": "Higher education access – Portugal",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "portuguese",
    "math",
    "biology",
    "chemistry",
    "physics",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.dges.gov.pt/pt/pagina/acesso-ao-ensino-superior",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Condițiile includ probe de ingresso și criterii specifice; verifică instituția, cursul, anul și ruta de candidatură."
},
{
  "country": "DE",
  "id": "university",
  "ro": "Acces la universitate – Hochschulzugang",
  "en": "University entrance – Germany",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "german",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.hochschulstart.de/",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Accesul depinde de calificarea de intrare, Land, instituție și program; unele domenii au proceduri selective, nu un examen unic național."
},
{
  "country": "ES",
  "id": "university",
  "ro": "Acces / admitere la universitate",
  "en": "University admission – Spain",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "spanish",
    "math",
    "biology",
    "chemistry",
    "physics",
    "history",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.boe.es/buscar/act.php?id=BOE-A-2024-11858",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "PAU este relevantă pentru numeroase candidaturi, dar admiterea, ponderile și cerințele depind de comunitatea autonomă și facultate. Verifică oferta locală."
},
{
  "country": "IT",
  "id": "university",
  "ro": "Admitere la universitate – accesso",
  "en": "University admissions – Italy",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "italian",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.universitaly.it/",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Există programe cu acces liber sau limitat și proceduri ori teste diferite. Nu presupune un test unic pentru toate facultățile."
},
{
  "country": "NL",
  "id": "university",
  "ro": "Admitere universitară – Studielink",
  "en": "University applications – Netherlands",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "dutch",
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "art",
    "oral"
  ],
  "source": "https://www.studielink.nl/",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "Cerințele depind de program și universitate; unele programe numerus fixus au selecție. Studielink este un portal de înscriere, nu o probă unică."
},
{
  "country": "IE",
  "id": "university",
  "ro": "Admitere universitară – CAO",
  "en": "University applications – Ireland",
  "grades": [
    "După liceu"
  ],
  "subjects": [
    "english",
    "math",
    "biology",
    "chemistry",
    "physics",
    "computing",
    "foreign",
    "art",
    "oral"
  ],
  "source": "https://www.cao.ie/",
  "advisory": true,
  "universityAdmission": true,
  "requiresInstitution": true,
  "requiresProgramme": true,
  "notice": "CAO gestionează multe candidaturi; selecția poate depinde de Leaving Certificate, cerințe ale programului și probe suplimentare."
}
];
export const EXAM_COUNTRY_CODES=["RO","GB-ENG","GB-SCT","GB-WLS","GB-NIR","FR","PL","PT","DE","ES","IT","NL","IE"];
export const EXAM_SESSION_YEARS=[2026,2027,2028];
export function examByCountry(country){return EXAM_SPECS.filter(e=>e.country===country)}
export function examByGrade(country,grade){return examByCountry(country).filter(e=>e.grades.includes(String(grade)))}
export function examSubjects(exam){return (exam?.subjects||[]).map(id=>EXAM_SUBJECTS.find(s=>s.id===id)).filter(Boolean)}
export function examProfile(country,examId,subjectId){const e=examByCountry(country).find(x=>x.id===examId);return e&&e.subjects.includes(subjectId)?{exam:e,subject:EXAM_SUBJECTS.find(x=>x.id===subjectId)}:null}
export function examSourceStatus(exam,session){return !exam||exam.advisory?'orientative':Number(session)===2027?'framework-verified':'session-unverified'}
