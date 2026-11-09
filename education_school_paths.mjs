import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';
import {RO_GRADE_LESSONS} from './education_grade_lessons_ro.mjs';
import {ENGLAND_GRADE_LESSONS} from './education_grade_lessons_eng.mjs';
// Explicit country and grade mapping; only marked official where curriculum source is verified.
export const EDUCATION_SCHOOL_YEARS={
 RO:{
  beginner:Array.from({length:4},(_,i)=>({id:String(i+1),ro:'Clasa a '+(i+1)+'-a',en:'Grade '+(i+1)})),
  lower:Array.from({length:4},(_,i)=>({id:String(i+5),ro:'Clasa a '+(i+5)+'-a',en:'Grade '+(i+5)})),
  medium:Array.from({length:4},(_,i)=>({id:String(i+9),ro:'Clasa a '+(i+9)+'-a',en:'Grade '+(i+9)})),
  advanced:[{id:'universitate',ro:'Universitate',en:'University'}]
 },
 'GB-ENG':{
  beginner:Array.from({length:6},(_,i)=>({id:'Y'+(i+1),ro:'Year '+(i+1),en:'Year '+(i+1)})),
  lower:Array.from({length:3},(_,i)=>({id:'Y'+(i+7),ro:'Year '+(i+7),en:'Year '+(i+7)})),
  medium:Array.from({length:4},(_,i)=>({id:'Y'+(i+10),ro:'Year '+(i+10),en:'Year '+(i+10)})),
  advanced:[{id:'university',ro:'Universitate',en:'University'}]
 }
};
export const HG_SCHOOL_PLANS={
  "RO": {
    "history": {
      "4": [
        [
          "ro4-family",
          "Trecutul familiei și al comunității",
          "Family and community history",
          "Cronologia personală, schimbări între generații, mărturii și obiecte păstrate în familie.",
          "primar"
        ],
        [
          "ro4-sources",
          "Izvoare istorice, timp și locuri",
          "Historical evidence, time and places",
          "Fotografii vechi, documente, monumente, linii ale timpului și diferența dintre surse și presupuneri.",
          "primar"
        ],
        [
          "ro4-heritage",
          "Patrimoniu și monumente din România",
          "Romanian heritage and monuments",
          "Locuri și monumente cunoscute, prezentate fără inventarea faptelor istorice.",
          "primar"
        ],
        [
          "ro4-people",
          "Personalități și evenimente din istoria românilor",
          "People and events in Romanian history",
          "Studii de caz alese din istoria românilor, plasate pe o axă cronologică simplă.",
          "primar"
        ],
        [
          "ro4-change",
          "Viața oamenilor în trecut și astăzi",
          "Everyday life then and now",
          "Compară locuirea, munca, școala și mijloacele de transport din epoci diferite.",
          "primar"
        ]
      ],
      "5": [
        [
          "ro5-prehistory",
          "Alfabetul istoriei și Preistoria",
          "Historical evidence and prehistory",
          "Izvoare, cronologie, primii oameni, revoluția neolitică și metalurgia; analizează diferențele dintre vânătoare și sedentarizare.",
          "g5"
        ],
        [
          "ro5-orient",
          "Orientul Antic",
          "Ancient Near East",
          "Mesopotamia, Egipt, civilizații, scriere și viața cotidiană; compară izvoare pentru două civilizații.",
          "g5"
        ],
        [
          "ro5-greeks",
          "Civilizația greacă și lumea elenistică",
          "Ancient Greece and Hellenistic culture",
          "Polis, Atena și Sparta, colonizarea, războaiele și patrimoniul cultural; localizează Histria și Tomis.",
          "g5"
        ],
        [
          "ro5-romans",
          "Roma antică, geto-dacii și romanizarea",
          "Rome, Dacians and romanisation",
          "Instituții și viață romană, geto-dacii, războaiele daco-romane și romanizarea.",
          "g5"
        ],
        [
          "ro5-middle",
          "Europa medievală și întâlnirea civilizațiilor",
          "Medieval Europe and cultural encounters",
          "Formarea statelor, Bizanțul, lumea islamică și viața cotidiană medievală.",
          "g5"
        ]
      ],
      "6": [
        [
          "ro6-modern",
          "Europa la începuturile modernității",
          "Europe and early modernity",
          "Marile descoperiri, Renașterea, Reforma, monarhii și transformarea societăților.",
          "g6"
        ],
        [
          "ro6-enlight",
          "Iluminism, revoluții și drepturi",
          "Enlightenment, revolutions and rights",
          "Ideile iluministe și transformările politice; compară cauze și consecințe cu surse istorice.",
          "g6"
        ],
        [
          "ro6-explorers",
          "Marile descoperiri geografice și expansiunea europeană",
          "Exploration and European expansion",
          "Expediții, rute, contacte culturale și consecințe asupra societăților.",
          "g6"
        ],
        [
          "ro6-reformation",
          "Reforma religioasă și schimbările politice",
          "Religious reformation and political change",
          "Schimbări în societate, instituții și putere; compară perspective istorice.",
          "g6"
        ],
        [
          "ro6-revolutions",
          "Revoluții și formarea lumii moderne",
          "Revolutions and the early modern world",
          "Transformări politice, economice și sociale cu cauze și consecințe.",
          "g6"
        ]
      ],
      "7": [
        [
          "ro7-1900",
          "Europa și lumea la începutul secolului XX",
          "Europe and the world around 1900",
          "Alianțe, imperialism, economie și schimbări sociale în pragul războaielor mondiale.",
          "g7"
        ],
        [
          "ro7-ww1",
          "Primul Război Mondial și tratatele de pace",
          "First World War and peace treaties",
          "Cauze, alianțe, fronturi, consecințe politice și sociale, surse primare.",
          "g7"
        ],
        [
          "ro7-interwar",
          "Lumea interbelică și regimurile politice",
          "Interwar world and political systems",
          "Democrație, totalitarism, crize și propaganda între cele două războaie.",
          "g7"
        ],
        [
          "ro7-ww2",
          "Al Doilea Război Mondial și Holocaustul",
          "Second World War and the Holocaust",
          "Cauze, conflicte, genocid, consecințe și memorie istorică cu surse verificabile.",
          "g7"
        ],
        [
          "ro7-coldwar",
          "Războiul Rece, decolonizarea și lumea actuală",
          "Cold War and contemporary world",
          "Blocuri politice, decolonizare, anul 1989 și transformări postbelice.",
          "g7"
        ]
      ],
      "8": [
        [
          "ro8-intro",
          "Spațiul românesc și izvoarele istoriei",
          "Romanian historical geography and sources",
          "Perioade, așezări și izvoare istorice pentru spațiul românesc.",
          "g8"
        ],
        [
          "ro8-dacians",
          "Preistorie, geto-daci și Dacia romană",
          "Prehistory, Dacians and Roman Dacia",
          "Cucuteni, Burebista, Decebal, cucerirea și romanizarea; compară izvoare.",
          "g8"
        ],
        [
          "ro8-states",
          "Etnogeneza și statele medievale românești",
          "Ethnogenesis and Romanian medieval states",
          "Transilvania, Moldova, Țara Românească, Dobrogea și dezvoltări medievale.",
          "g8"
        ],
        [
          "ro8-modern",
          "Modernitate, 1848 și unirea principatelor",
          "Modernity, 1848 and the principalities",
          "Reformele, revoluția din 1848, unirea și independența, cauze și consecințe.",
          "g8"
        ],
        [
          "ro8-century",
          "România în secolul XX și după 1989",
          "Romania in the 20th century and after 1989",
          "Războaie, Marea Unire, regimuri politice, comunism și tranziție democratică.",
          "g8"
        ]
      ],
      "9": [
        [
          "ro9-sources",
          "Analiza izvoarelor și cronologia lumii antice",
          "Sources and ancient chronology",
          "Interpretarea textelor, hărților și descoperirilor arheologice; pregătire generală, nu programă certificată.",
          "general"
        ],
        [
          "ro9-mediterranean",
          "Civilizații mediteraneene și lumea medievală",
          "Mediterranean cultures and medieval world",
          "Analiza comparată a instituțiilor, culturii și a schimbărilor; nivel liceal.",
          "general"
        ]
      ],
      "10": [
        [
          "ro10-modern",
          "Renaștere, Reformă și formarea statelor moderne",
          "Renaissance, Reformation and modern states",
          "Analizează schimbările ideilor, instituțiilor și economiei cu documente istorice.",
          "general"
        ],
        [
          "ro10-revolutions",
          "Iluminismul și revoluțiile moderne",
          "Enlightenment and revolutions",
          "Cauze, programe politice, efecte sociale și comparație între revoluții.",
          "general"
        ]
      ],
      "11": [
        [
          "ro11-world",
          "Războaie, transformări și societatea secolului XX",
          "War and twentieth-century societies",
          "Analiză comparativă a conflictelor, democrației, dictaturilor și propagandei.",
          "general"
        ],
        [
          "ro11-europe",
          "Europa și România în secolul XX",
          "Romania and Europe in the twentieth century",
          "Relații internaționale, experiențe sociale și interpretări istorice, în cadrul unei învățări generale.",
          "general"
        ]
      ],
      "12": [
        [
          "ro12-modern-ro",
          "România modernă și contemporană: sinteză critică",
          "Modern Romanian history: critical synthesis",
          "Surse, reforme, regimuri și transformări economice analizate comparativ.",
          "general"
        ],
        [
          "ro12-historical-essays",
          "Eseu istoric, cauzalitate și interpretarea documentelor",
          "Historical essays and document interpretation",
          "Formulează argumente din surse, fără date inventate sau citate nerecunoscute.",
          "general"
        ]
      ]
    },
    "geography": {
      "4": [
        [
          "geo4-near",
          "Orizontul local și orientarea",
          "Local environment and orientation",
          "Puncte cardinale, observații geografice, planul localității și repere în proximitate.",
          "g4"
        ],
        [
          "geo4-romania",
          "România – poziție, relief și ape",
          "Romania: location, landforms and rivers",
          "Harta României, unități de relief, râuri și caracteristici elementare.",
          "g4"
        ],
        [
          "geo4-people",
          "Așezări, activități și protecția mediului",
          "Settlements, work and environment",
          "Așezări și activități umane, protecția mediului local.",
          "g4"
        ]
      ],
      "5": [
        [
          "geo5-world",
          "Pământul și reprezentarea lui",
          "Earth and its representation",
          "Globul geografic, hărți și coordonate elementare.",
          "general"
        ],
        [
          "geo5-relief",
          "Relief, climă, ape și viețuitoare",
          "Relief, climate, water and biomes",
          "Componente geografice naturale, legături și distribuție globală.",
          "general"
        ]
      ],
      "6": [
        [
          "geo6-europe",
          "Europa – poziție și caracteristici",
          "Europe: location and geography",
          "Relief, ape, climă, state și orașe europene; compară hărți fizice și politice, explicând particularități regionale.",
          "general"
        ]
      ],
      "7": [
        [
          "geo7-continents",
          "Continente extraeuropene",
          "Continents beyond Europe",
          "Asia, Africa, Americi, Australia/Oceania și Antarctica: hărți și diferențe regionale.",
          "general"
        ]
      ],
      "8": [
        [
          "geo8-romania",
          "Geografia României – relief și mediu",
          "Geography of Romania: landforms and environment",
          "Unități de relief, climă, ape, ecosisteme și riscuri naturale.",
          "general"
        ],
        [
          "geo8-pop",
          "Populația și economia României",
          "Romania: population and economy",
          "Populație, localități, agricultură, industrie, transport și dezvoltare.",
          "general"
        ]
      ],
      "9": [
        [
          "rogeo9-earth",
          "Pământul ca sistem – relief, atmosferă și apă",
          "Earth systems: landforms, atmosphere and water",
          "Reprezentare geografică, procese fizice și relații între componente.",
          "general"
        ],
        [
          "rogeo9-mapping",
          "Hărți, coordonate și observații",
          "Maps, coordinates and field observations",
          "Cartografie de bază și citirea datelor geografice.",
          "general"
        ]
      ],
      "10": [
        [
          "rogeo10-pop",
          "Populația, așezările și resursele",
          "Population, settlements and resources",
          "Procese demografice, urbanizare și distribuția activităților economice.",
          "general"
        ],
        [
          "rogeo10-economy",
          "Economii și spații de dezvoltare",
          "Economies and development",
          "Studiu comparativ al regiunilor și al indicatorilor.",
          "general"
        ]
      ],
      "11": [
        [
          "rogeo11-environment",
          "Mediu, climă și riscuri naturale",
          "Environment and natural hazards",
          "Schimbare climatică, resurse și vulnerabilitate regională.",
          "general"
        ],
        [
          "rogeo11-global",
          "Sisteme globale și diferențe regionale",
          "Global systems and regions",
          "Analiză a hărților tematice și a datelor comparabile.",
          "general"
        ]
      ],
      "12": [
        [
          "rogeo12-europe",
          "România, Europa și Uniunea Europeană",
          "Romania, Europe and the European Union",
          "Geografie politică, integrare, conexiuni și diferențe regionale.",
          "general"
        ],
        [
          "rogeo12-case",
          "Studiu de caz și analiză de hartă",
          "Case studies and map analysis",
          "Redactarea argumentată a unui studiu geografic cu surse.",
          "general"
        ]
      ]
    }
  },
  "GB-ENG": {
    "history": {
      "Y1": [
        [
          "eng-y1-memory",
          "Schimbări din memoria vie",
          "Changes within living memory",
          "Compară obiecte, imagini și povești recente, diferențiind trecutul de prezent.",
          "ks1"
        ],
        [
          "eng-y1-people",
          "Oameni cu realizări semnificative",
          "People with significant achievements",
          "Explorează o personalitate printr-o poveste și o sursă potrivită vârstei.",
          "ks1"
        ]
      ],
      "Y2": [
        [
          "eng-y2-events",
          "Evenimente importante dincolo de memoria vie",
          "Events beyond living memory",
          "Construiește o linie cronologică și compară imagini istorice.",
          "ks1"
        ],
        [
          "eng-y2-local",
          "Istoria locală și monumente",
          "Local heritage and historical places",
          "Studiază un eveniment sau loc semnificativ al comunității.",
          "ks1"
        ]
      ],
      "Y3": [
        [
          "eng-y3-stone",
          "Stone Age, Bronze Age and Iron Age Britain",
          "Epoca pietrei, bronzului și fierului în Britania",
          "Evoluția societăților preistorice în Britania, cu dovezi arheologice.",
          "ks2"
        ]
      ],
      "Y4": [
        [
          "eng-y4-roman",
          "Roman Britain",
          "Britania romană",
          "Invazia romană, impactul asupra Britaniei și izvoare istorice.",
          "ks2"
        ]
      ],
      "Y5": [
        [
          "eng-y5-anglo",
          "Anglo-Saxon and Viking Britain",
          "Anglo-saxonii și vikingii în Britania",
          "Așezările, conflictele și schimbările culturale în Britania.",
          "ks2"
        ]
      ],
      "Y6": [
        [
          "eng-y6-ancient",
          "Ancient Greece and a world civilisation",
          "Grecia antică și o civilizație mondială",
          "Studiu comparativ al Greciei antice și al unei civilizații non-europene.",
          "ks2"
        ]
      ],
      "Y7": [
        [
          "eng-y7-medieval",
          "Medieval Britain, 1066–1509",
          "Britania medievală",
          "Dezvoltarea politică și socială a Britaniei medievale.",
          "ks3"
        ]
      ],
      "Y8": [
        [
          "eng-y8-modern",
          "Tudors, Stuarts and industrial change",
          "Tudori, Stuarți și industrializare",
          "Reformă, schimbări politice și revoluție industrială în Britania.",
          "ks3"
        ]
      ],
      "Y9": [
        [
          "eng-y9-century",
          "World conflicts and the 20th century",
          "Războaie mondiale și secolul XX",
          "Cauze și consecințe ale conflictelor moderne, interpretări și memorie.",
          "ks3"
        ]
      ],
      "Y10": [
        [
          "eny10-gcse-source",
          "Historical sources and interpretations (GCSE advisory)",
          "Izvoare și interpretări istorice (GCSE orientativ)",
          "Interpretarea izvoarelor și a semnificației evenimentelor; conținutul exact diferă după exam board.",
          "general"
        ],
        [
          "eny10-gcse-depth",
          "Depth study of a historical period",
          "Studiul aprofundat al unei perioade",
          "Analiză de epocă aleasă după specificația școlii; fără a inventa o programă comună.",
          "general"
        ]
      ],
      "Y11": [
        [
          "eny11-gcse-revision",
          "GCSE historical enquiry and revision",
          "Recapitulare și investigație istorică GCSE",
          "Argumente, cronologie, surse și exerciții orientative pentru specificații diferite.",
          "general"
        ],
        [
          "eny11-gcse-essay",
          "Evidence-based historical writing",
          "Eseu istoric bazat pe izvoare",
          "Construcția răspunsurilor și verificarea ideilor din documente.",
          "general"
        ]
      ],
      "Y12": [
        [
          "eny12-alevel-source",
          "Advanced source evaluation (A-level advisory)",
          "Evaluarea avansată a surselor A-level",
          "Critică a surselor și istoriografie; programa depinde de board.",
          "general"
        ],
        [
          "eny12-alevel-case",
          "Historical depth study",
          "Studiu istoric aprofundat",
          "Studiu de caz aprofundat cu întrebare de cercetare, metodologie explicită și bibliografie verificabilă.",
          "general"
        ]
      ],
      "Y13": [
        [
          "eny13-alevel-synthesis",
          "Independent historical argument",
          "Argument istoric independent",
          "Comparații, evaluarea dovezilor, formularea unei sinteze.",
          "general"
        ],
        [
          "eny13-alevel-research",
          "Extended historical investigation",
          "Cercetare istorică extinsă",
          "Planificarea și prezentarea unei cercetări cu izvoare și limite declarate.",
          "general"
        ]
      ]
    },
    "geography": {
      "Y1": [
        [
          "eng-geo-y1-local",
          "Locul în care trăim",
          "Our local area",
          "Observarea mediului, locuri și repere familiare.",
          "general"
        ]
      ],
      "Y2": [
        [
          "eng-geo-y2-world",
          "Continente și oceane",
          "Continents and oceans",
          "Localizarea continentelor și a oceanelor, hărți simple.",
          "general"
        ]
      ],
      "Y3": [
        [
          "eng-geo-y3-map",
          "Hărți și puncte cardinale",
          "Maps and compass points",
          "Reprezentare, orientare, hartă locală și distanțe.",
          "general"
        ]
      ],
      "Y4": [
        [
          "eng-geo-y4-europe",
          "Europa și regiuni ale lumii",
          "Europe and world regions",
          "Țări, regiuni, relief și clima prin comparație.",
          "general"
        ]
      ],
      "Y5": [
        [
          "eng-geo-y5-physical",
          "Peisaje și procese naturale",
          "Physical landscapes",
          "Râuri, munți, vulcani, climă și impact asupra oamenilor.",
          "general"
        ]
      ],
      "Y6": [
        [
          "eng-geo-y6-human",
          "Așezări și resurse",
          "Settlements and resources",
          "Așezări, activități și probleme de mediu, studii de caz.",
          "general"
        ]
      ],
      "Y7": [
        [
          "eng-geo-y7-physical",
          "Relief, climă și procese",
          "Landforms, weather and processes",
          "Procese geografice, sisteme de mediu, hărți și observații.",
          "general"
        ]
      ],
      "Y8": [
        [
          "eng-geo-y8-pop",
          "Populație, urbanizare și dezvoltare",
          "Population and development",
          "Migrații, așezări, urbanizare, dezvoltare și diferențe regionale analizate prin hărți și date.",
          "general"
        ]
      ],
      "Y9": [
        [
          "eng-geo-y9-global",
          "Sisteme globale și sustenabilitate",
          "Global systems and sustainability",
          "Schimbări de mediu, economie, climă și evaluarea datelor.",
          "general"
        ]
      ],
      "Y10": [
        [
          "engeo10-gcse-land",
          "Physical geography for GCSE (advisory)",
          "Geografie fizică GCSE (orientativ)",
          "Procese și peisaje geografice, fără atribuirea unei specificații exam board.",
          "general"
        ]
      ],
      "Y11": [
        [
          "engeo11-gcse-urban",
          "Human geography and fieldwork (advisory)",
          "Geografie umană și teren GCSE (orientativ)",
          "Populație, urbanizare, dezvoltare și interpretarea observațiilor.",
          "general"
        ]
      ],
      "Y12": [
        [
          "engeo12-alevel-data",
          "Advanced geographical data analysis",
          "Analiza avansată a datelor geografice",
          "Indicatori, studii de caz și cercetare orientativă.",
          "general"
        ]
      ],
      "Y13": [
        [
          "engeo13-alevel-project",
          "Independent geographic investigation",
          "Investigație geografică independentă",
          "Proiect cu metodologie, date, grafice și interpretări.",
          "general"
        ]
      ]
    }
  }
};
export const HG_SCHOOL_GENERAL={
  "history": {
    "lower": [["generic-h-l1","Surse istorice și cronologie pentru gimnaziu","Historical sources and chronology for lower secondary","Compară două izvoare, precizează perioada și diferențiază faptele de opinii."],["generic-h-l2","Comunități, civilizații și schimbare","Communities, civilisations and change","Explică legătura dintre evenimente și consecințe folosind exemple datate și verificabile."]],
    "beginner": [
      [
        "generic-h-b1",
        "Timp, familie și comunitate",
        "Time, family and community",
        "Lectură simplă a trecutului, surse cotidiene și cronologie."
      ]
    ],
    "medium": [
      [
        "generic-h-m1",
        "Izvoare și interpretări istorice",
        "Historical sources and interpretation",
        "Cauze, cronologie, argumentare și comparație de perspective."
      ],
      [
        "generic-h-m2",
        "Schimbări sociale și politice",
        "Social and political change",
        "Analizează evenimente documentate cu surse și perioade explicite."
      ]
    ],
    "advanced": [
      [
        "generic-h-a1",
        "Istoriografie și metodologie",
        "Historiography and methods",
        "Analiza critică a surselor, metodologie, comparație și cercetare."
      ]
    ]
  },
  "geography": {
    "lower": [["generic-g-l1","Orientare, hărți și scări pentru gimnaziu","Mapping and scale for lower secondary","Folosește coordonate geografice, distanțe, scări și legende pentru a interpreta o hartă."],["generic-g-l2","Mediu fizic, populație și regiuni","Physical and human geography in lower secondary","Compară relieful, clima, apele și distribuția populației folosind hărți și date cu sursă."]],
    "beginner": [
      [
        "generic-g-b1",
        "Orientare și observații geografice",
        "Orientation and geography observations",
        "Hartă simplă, puncte cardinale și caracteristici ale mediului local."
      ]
    ],
    "medium": [
      [
        "generic-g-m1",
        "Geografie fizică și umană",
        "Physical and human geography",
        "Mediu, populație, climă și date interpretate critic."
      ],
      [
        "generic-g-m2",
        "Regiuni și peisaje",
        "Regions and landscapes",
        "Studii de caz comparate cu hărți și surse."
      ]
    ],
    "advanced": [
      [
        "generic-g-a1",
        "Cartografie și cercetare geografică",
        "Cartography and geographic research",
        "GIS, interpretări spațiale, analiză a datelor și teledetecție."
      ]
    ]
  }
};
// Fallback content must still be teachable, never a single vague card.
// General units are NOT a country's verified programme of study.
for(const [subject,levels] of Object.entries(HG_GENERAL_GRADE_LESSONS)){
 for(const [level,entries] of Object.entries(levels)){
  const list=HG_SCHOOL_GENERAL[subject][level];
  entries.forEach(([ro,en,description],i)=>{
   if(list.some(x=>x[1]===ro))return;
   list.push(['generic-'+subject+'-'+level+'-unit'+(i+1),ro,en,
    description+' '+(subject==='history'?'Folosește surse istorice și o cronologie verificată.':'Folosește hărți, date și comparații între locuri.')]);
  });
 }
}

export const HG_SCHOOL_SOURCES={RO:{history:{grades:['5','6','7','8'],source:'https://www.edu.ro/Ordin_ministru_3393_2017'},geography:{grades:[],source:'https://www.edu.ro/manuale-scolare'}},'GB-ENG':{history:{grades:['Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9'],source:'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study'},geography:{grades:[],source:'https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study'}}};

// Teaching modules supplement the English Key Stage framework with a usable
// Year-by-Year study table. DfE publishes Key Stage content, not a mandatory
// separate Year 1, Year 2, ... lesson list. GCSE and A-level sequences depend
// on exam board and optional subject selection.
const ENGLAND_YEAR_STUDY_MODULES={
 history:{
  Y1:[
   ['Trecutul familiei: obiecte și amintiri','Family history through objects and memories','Folosește fotografii, povești și obiecte pentru a compara două generații, fără să confunzi amintirea cu dovada independentă.'],
   ['Viața de zi cu zi: ieri și astăzi','Daily life: past and present','Compară școala, transportul și locuirea în trecutul apropiat și astăzi folosind exemple datate.'],
   ['Surse, fotografii și ordinea întâmplărilor','Sources, photographs and ordering events','Învață să distingi înainte și după, să construiești o cronologie simplă și să verifici o fotografie.']],
  Y2:[
   ['Marele incendiu din Londra ca studiu de caz','The Great Fire of London as a case study','Studiază 1666, cauzele cunoscute, consecințele și sursele, fără a trata legendele ca dovezi.'],
   ['Viețile persoanelor din perioade diferite','People living in different periods','Compară două persoane istorice și explică ce au schimbat și cum știm acest lucru.'],
   ['Linii ale timpului și obiecte din muzeu','Timelines and museum objects','Așază evenimente în ordine și descrie ce poate demonstra un obiect de patrimoniu și ce nu.']],
  Y3:[
   ['Viața vânătorilor și a primilor fermieri','Hunter-gatherers and the first farmers','Compară traiul vânătorilor-culegători cu așezările agricultorilor folosind urme arheologice.'],
   ['Epoca bronzului și tehnologia','Bronze Age technology and society','Studiază schimbarea uneltelor, comerțul și monumentele, distingând interpretările de artefacte.'],
   ['Epoca fierului în Britania','Iron Age Britain','Explorează așezările, agricultura, cetățile și dovezile arheologice din Britania preromană.']],
  Y4:[
   ['Venirea romanilor în Britania','Roman arrival in Britain','Explică invazia romană, rezistența locală și schimbările politice cu o cronologie accesibilă.'],
   ['Drumuri, orașe și viață romană','Roman roads, towns and daily life','Analizează exemple de drumuri, orașe, construcții și schimbări ale vieții cotidiene.'],
   ['Urme romane și izvoare istorice','Roman archaeology and evidence','Compară obiecte, inscripții și relatări pentru a înțelege limitele surselor antice.']],
  Y5:[
   ['Regate anglo-saxone','Anglo-Saxon kingdoms','Localizează regatele, transformările culturale și schimbările din Britania după perioada romană.'],
   ['Vikingii: comerț, migrație și conflict','Vikings: trade, migration and conflict','Compară așezările, expedițiile și contactele dintre vikingi și anglo-saxoni.'],
   ['Formarea regatelor și sursele perioadei','Kingdom formation and period sources','Construiește o cronologie și evaluează relatări, obiecte și hărți despre regatele britanice.']],
  Y6:[
   ['Cetățile Greciei antice','City-states of Ancient Greece','Compară Atena și Sparta, instituțiile și viața socială folosind termeni potriviți.'],
   ['Idei, artă și moștenire greacă','Ancient Greek ideas and legacy','Studiază mituri, jocuri, arte și influențe, distingând tradiția de dovada istorică.'],
   ['Civilizații ale lumii: comparație','Comparing a world civilisation','Compară Grecia cu o altă civilizație studiată prin cronologie, organizare și surse.']],
  Y7:[
   ['1066 și cucerirea normandă','1066 and the Norman Conquest','Explică evenimentele esențiale din 1066 și urmările schimbării de putere în Anglia.'],
   ['Feudalism, castele și societate','Feudalism, castles and medieval society','Analizează structuri sociale, pământ, obligații și limitele modelului feudal.'],
   ['Biserica, orașele și Magna Carta','Church, towns and Magna Carta','Examinează religia, comerțul, instituțiile și documentul din 1215 în context.']],
  Y8:[
   ['Reforma și monarhia Tudorilor','Reformation and Tudor monarchy','Studiază schimbările religioase, politice și sociale din Anglia secolului al XVI-lea.'],
   ['Stuarți, război civil și Parlament','Stuarts, Civil War and Parliament','Construiește o cronologie a tensiunilor dintre monarhie și Parlament și evaluează consecințele.'],
   ['Industrializare, muncă și schimbări sociale','Industrialisation and social change','Analizează fabricile, urbanizarea, transportul, imperiul și efectele asupra unor grupuri diferite.']],
  Y9:[
   ['Primul Război Mondial: cauze și urmări','First World War: causes and consequences','Distinge cauzele de lungă durată de evenimentele declanșatoare și studiază impactul războiului.'],
   ['Al Doilea Război Mondial și Holocaustul','Second World War and the Holocaust','Prezintă cronologia, persecuția, genocidul și memoria folosind surse documentate și limbaj adecvat.'],
   ['Lumea după 1945 și schimbările sociale','Post-war world and social change','Analizează decolonizarea, tensiunile Războiului Rece și mișcările pentru drepturi.']],
  Y10:[
   ['Studiu tematic GCSE și schimbare în timp','GCSE thematic study and change over time','Organizare orientativă GCSE: compară schimbări și continuități pe durate istorice mari, potrivit unei specificații alese.'],
   ['Perioadă de adâncire GCSE','GCSE historical depth study','Studiază contextul, cauzele și consecințele într-o perioadă specificată de consiliul de examene.'],
   ['Folosirea surselor și argumentarea','Source use and historical arguments','Învață să susții o afirmație cu dovezi și să identifici limitele și perspectivele surselor.']],
  Y11:[
   ['Interpretări diferite ale aceluiași eveniment','Different interpretations of events','Compară argumentele a doi istorici și identifică dovezile care susțin interpretările.'],
   ['Recapitulare cronologică și cauzalitate GCSE','GCSE chronology and causation revision','Reorganizează evenimente și formulează răspunsuri cu explicație, dovezi și concluzie.'],
   ['Exerciții GCSE după specificația aleasă','GCSE specification-based practice','Simulează întrebări structurate pe surse, semnificație și consecințe fără a pretinde examene oficiale.']],
  Y12:[
   ['Documente și contextul unei perioade A-level','A-level period and sources','Studiază în profunzime o perioadă aleasă potrivit specificației A-level și examinează surse primare.'],
   ['Istoriografie și perspective','Historiography and perspectives','Compară interpretări, metode și argumente ale istoricilor pentru aceeași problemă.'],
   ['Eseu istoric bazat pe dovezi','Evidence-based historical essay','Construiește teză, argumente, contraargumente și concluzie, cu referințe verificabile.']],
  Y13:[
   ['Studiu de profunzime și sinteză A-level','Advanced depth study and synthesis','Integrează cunoștințele din mai multe perioade și explică schimbări și continuități.'],
   ['Cercetare independentă și evaluarea surselor','Independent research and source evaluation','Delimitează întrebarea, selectează surse credibile și discută limitele lor în raport cu tema.'],
   ['Eseu extins și recapitulare A-level','Extended essay and A-level revision','Planifică redactarea, folosirea citărilor și recapitularea potrivit specificației efective.']]
 },
 geography:{
  Y1:[
   ['Repere: acasă, școală și cartier','Landmarks: home, school and neighbourhood','Recunoaște repere precum strada, parc, școală și râu, comparând elemente naturale și construite.'],
   ['Vremea și anotimpurile','Weather and seasons','Observă ploaia, vântul și temperatura și notează vremea într-un jurnal simplu.'],
   ['Prima hartă: simboluri și direcții','My first map: symbols and directions','Desenează o hartă simplă a drumului spre școală și folosește stânga, dreapta, aproape și departe.']],
  Y2:[
   ['Cele șapte continente și cinci oceane','Seven continents and five oceans','Folosește globul și atlasele pentru a localiza continentele și oceanele fără memorare mecanică.'],
   ['Cele patru țări ale Regatului Unit','The four countries of the UK','Identifică Anglia, Scoția, Țara Galilor și Irlanda de Nord, capitale și mările din jur.'],
   ['Locuri diferite: comparație și climă','Comparing places and climate','Compară o zonă britanică cu una din afara Europei după relief, climă și mod de viață.']],
  Y3:[
   ['Puncte cardinale și legendă','Compass points and map keys','Folosește nord, sud, est, vest, legende și semne convenționale pe o hartă.'],
   ['Râuri și forme de relief','Rivers and landforms','Identifică munți, dealuri, văi și cursuri de apă, explicând noțiuni simple de relief.'],
   ['Observații din teren','Fieldwork near school','Colectează observații despre împrejurimile școlii și marchează-le pe o schiță.']],
  Y4:[
   ['Europa: țări, capitale și regiuni','European countries and regions','Identifică țări și regiuni europene folosind hărți și surse actuale.'],
   ['Latitudine, longitudine și orientare','Latitude, longitude and orientation','Exersează citirea coordonatelor pe hartă și orientarea cu punctele cardinale.'],
   ['Activități umane și utilizarea terenului','Land use and human activity','Compară agricultura, locuirea și transportul în regiuni diferite.']],
  Y5:[
   ['Ciclul apei și râurile','Water cycle and rivers','Urmărește evaporarea, condensarea și precipitațiile și rolul lor în formarea râurilor.'],
   ['Vulcani și cutremure','Volcanoes and earthquakes','Explică pe înțelesul elevilor mișcările scoarței și efectele lor asupra așezărilor.'],
   ['Resurse și utilizare responsabilă','Resources and sustainable use','Analizează apă, sol și energie, identificând utilizări și limite.']],
  Y6:[
   ['Așezări și dezvoltarea orașelor','Settlements and urban development','Compară orașele și satele după funcții, activități, transport și servicii.'],
   ['Comerț global și interdependență','Global trade and interdependence','Analizează traseul unui produs și legăturile dintre producători și consumatori.'],
   ['Mediu, protecție și investigație locală','Environment and local investigation','Planifică o observație de teren, înregistrează date și propune o măsură realistă de protecție.']],
  Y7:[
   ['Hărți, scale și coordonate geografice','Maps, scale and geographical coordinates','Folosește scara și coordonatele pentru a localiza locuri și compara distanțe.'],
   ['Tectonica plăcilor și hazarduri','Plate tectonics and hazards','Explică relația dintre mișcarea plăcilor și anumite cutremure și vulcani.'],
   ['Râuri, vreme și observații de teren','Rivers, weather and field observations','Analizează procese fizice folosind hărți, date meteorologice și note de teren.']],
  Y8:[
   ['Migrație și cauze ale mobilității','Migration and human mobility','Compară factori economici, sociali și de mediu care influențează migrația.'],
   ['Urbanizare și dezvoltare inegală','Urbanisation and unequal development','Interpretează date despre creșterea orașelor și diferențe între regiuni.'],
   ['Ecosisteme și folosirea resurselor','Ecosystems and resource use','Studiază interacțiunile dintre plante, animale, climă și activitățile umane.']],
  Y9:[
   ['Schimbări climatice: dovezi și efecte','Climate change: evidence and impacts','Interpretează serii de temperatură și exemple de impact, separând observația de explicație.'],
   ['Hazarduri, risc și reziliență','Hazards, risk and resilience','Compară pericole naturale și metode de reducere a expunerii.'],
   ['Sustenabilitate și date geografice','Sustainability and geographical data','Evaluează opțiuni de dezvoltare prin indicatori, hărți și surse recente.']],
  Y10:[
   ['Geografie fizică GCSE','GCSE physical geography','Studiu orientativ al reliefului și proceselor fizice, cu exemple alese după specificația de examen.'],
   ['Geografie umană GCSE','GCSE human geography','Compară orașe, resurse și dezvoltare folosind studii de caz și date din programa aleasă.'],
   ['Măsurători și observații în teren','Fieldwork methods','Planifică o colectare de date și explică reprezentativitatea și limitele măsurătorilor.']],
  Y11:[
   ['Hărți, grafice și interpretarea datelor GCSE','GCSE maps and data interpretation','Interpretează grafice, diagrame și hărți tematice cu unități și surse.'],
   ['Studii de caz și evaluarea soluțiilor','Case studies and evaluation','Evaluează mai multe soluții pentru o problemă geografică, cu argumente și limite.'],
   ['Recapitulare GCSE după specificație','GCSE specification-based revision','Exersează explicații, evaluări și răspunsuri bazate pe date fără a inventa conținut de examen.']],
  Y12:[
   ['Sistemele Pământului și procese fizice','Earth systems and physical processes','Analizează cicluri naturale și conexiuni dintre atmosferă, hidrosferă și litosferă.'],
   ['Populație, spațiu și dezvoltare','Population, space and development','Evaluează schimbările demografice și distribuția activităților umane la scară globală.'],
   ['Proiect de investigație geografică','Geographical investigation project','Formulează întrebare, metodă, colectare de date și evaluare a riscurilor.']],
  Y13:[
   ['Analiza critică a datelor geografice','Critical geographical data analysis','Examinează validitatea surselor, limitele eșantionării și modele spațiale complexe.'],
   ['Politici, mediu și dezvoltare durabilă','Policy, environment and sustainability','Compară opțiuni de politici prin dovezi, efecte sociale și costuri de mediu.'],
   ['Lucrare de cercetare și sinteză A-level','A-level research and synthesis','Pregătește concluzii și eseuri bazate pe dovezi, potrivit cerințelor consiliului de examene.']]
 }
};
for(const [subject,years] of Object.entries(ENGLAND_YEAR_STUDY_MODULES)){
 for(const [year,topics] of Object.entries(years)){
  const existing=HG_SCHOOL_PLANS['GB-ENG']?.[subject]?.[year];
  if(!existing)continue;
  topics.forEach(([ro,en,description],i)=>existing.push([
   'eng-'+subject+'-'+year.toLowerCase()+'-sub'+(i+1),ro,en,description,
   Number(year.slice(1))<=2?'ks1':Number(year.slice(1))<=6?'ks2':Number(year.slice(1))<=9?'ks3':'exam-optional'
  ]));
 }
}
// Add grade-specific subject lessons while retaining established chapter IDs and
// manually authored core lessons. The mapping is a pedagogical sequence and is
// never represented as the official mandated order for each year.
for(const [country,packs] of [['RO',RO_GRADE_LESSONS],['GB-ENG',ENGLAND_GRADE_LESSONS]]){
 for(const [subject,years] of Object.entries(packs)){
  for(const [grade,rows] of Object.entries(years)){
   const list=HG_SCHOOL_PLANS[country]?.[subject]?.[grade];if(!list)continue;
   rows.forEach((entry,i)=>{
    const [one,two,focus]=entry;
    const ro=country==='RO'?one:two,en=country==='RO'?two:one;
    const id=(country==='RO'?'ro':'eng')+'-'+subject+'-'+grade.toLowerCase()+'-unit'+(i+1);
    if(list.some(e=>e[0]===id||e[1]===ro||e[2]===en))return;
    const query=focus.trim()+' '+(subject==='history'?
      'Învățare: cronologie, terminologie, izvoare autentice, exemplu datat și exercițiu de argumentare.':
      'Învățare: localizare pe hartă, concepte geografice, date și comparație între două locuri.');
    list.push([id,ro,en,query,Number(String(grade).replace('Y',''))<=6?'primary':'secondary']);
   });
  }
 }
}

// Both History and Geography have statutory framework content at KS1–KS3.
// This verifies the STAGE only; the year-by-year grouping above is pedagogic.
HG_SCHOOL_SOURCES['GB-ENG'].geography.grades=['Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9'];

export function educationYears(country,level){
 const lv=level==='intermediate'?'medium':level;
 return EDUCATION_SCHOOL_YEARS[country]?.[lv]||[{id:'general-'+lv,ro:lv==='beginner'?'Învățare generală — primar':lv==='medium'?'Învățare generală — secundar':'Învățare generală — universitar',en:lv==='beginner'?'General primary learning':lv==='medium'?'General secondary learning':'General university learning'}];
}
export function hgSchoolChapters(country,subject,level,grade){
 const lv=level==='intermediate'?'medium':level;
 const specific=HG_SCHOOL_PLANS[country]?.[subject]?.[String(grade)]||null;
 const general=HG_SCHOOL_GENERAL[subject]?.[lv]||[];
 const data=specific||general;
 const source=HG_SCHOOL_SOURCES[country]?.[subject];
 const official=Boolean(specific&&source?.grades?.includes(String(grade)));
 return {status:official?'official-framework':'general-learning',source:official?source.source:null,
  chapters:data.map(([id,ro,en,query])=>({id,ro,en,query,period:'',curriculumGrade:grade,status:official?'official-framework':'general-learning'}))};
}
