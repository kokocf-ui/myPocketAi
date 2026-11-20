// University-level Sciences: original subject- and specialisation-specific
// conceptual routes. None is represented as a certified national degree syllabus.
// These editorial introductions complement the curated, topic-specific source lessons.
export const SCIENCE_UNIVERSITY_TRACK_GUIDES=Object.freeze({
  "physics": {
    "quantum": {
      "ro": [
        "Stările cuantice, observabilele și operatorii formează un model matematic pentru fenomene la scară microscopică; funcția de undă nu este o traiectorie clasică.",
        "Caz de studiu: pornește de la condițiile la limită ale unei particule într-un puț idealizat; discută de ce spectrul permis este discret înainte de orice calcul numeric.",
        "Separă probabilitatea unei măsurători de o predicție deterministă. Modelul trebuie însoțit de domeniul de valabilitate al aproximațiilor.",
        "Verificare: ce informații sunt necesare pentru normalizarea unei stări și ce înseamnă o valoare proprie măsurată?"
      ],
      "en": [
        "Quantum states, observables and operators form a mathematical account of microscopic phenomena; a wavefunction is not a classical orbit.",
        "Case study: begin with boundary conditions for a particle in an idealised potential well and explain why the allowed energy spectrum is discrete before assigning values.",
        "Distinguish measurement probabilities from deterministic trajectories and state the limitations of every approximation used.",
        "Review: what conditions normalise a quantum state, and how is a measured eigenvalue interpreted?"
      ]
    },
    "relativity": {
      "ro": [
        "Relativitatea specială leagă observațiile din cadre inerțiale prin transformări Lorentz; relativitatea generală modelează gravitația prin geometria spațiu-timpului.",
        "Caz de studiu: compară intervalul spațiu-temporal al două evenimente descrise din cadre diferite, precizând ce mărimi rămân invariante.",
        "Dilatarea timpului și contracția lungimilor nu sunt defecțiuni ale ceasurilor; nu le extrapola fără condiții de aplicare.",
        "Verificare: cum deosebești timpul propriu de timpul coordonat și ce rol are un observator inerțial?"
      ],
      "en": [
        "Special relativity relates observations in inertial frames by Lorentz transformations; general relativity treats gravity geometrically.",
        "Case study: compare the spacetime interval of two events in different reference frames and identify which quantity is invariant.",
        "Time dilation is not a broken clock; relativistic formulas require a specified frame and clear physical assumptions.",
        "Review: distinguish proper time from coordinate time and explain why the observer's frame matters."
      ]
    },
    "theory": {
      "ro": [
        "Fizica teoretică construiește modele din simetrii, ecuații diferențiale, principii variaționale și condiții inițiale; un calcul elegant nu garantează adecvarea empirică.",
        "Caz de studiu: alege o problemă cu condiții la limită și compară soluția exactă, aproximația perturbativă și o verificare numerică.",
        "Separă existența soluției de unicitate și stabilitate; precizează ce mărime fizică reprezintă fiecare variabilă.",
        "Verificare: ce test dimensional și ce verificare la limită ar putea invalida un model?"
      ],
      "en": [
        "Theoretical physics builds models from symmetries, differential equations, variational principles and initial conditions.",
        "Case study: compare an exact solution, a perturbative approximation and a numerical consistency check under stated boundary conditions.",
        "Existence, uniqueness and stability are distinct properties; assign physical meaning and units to each variable.",
        "Review: which dimensional test and limiting case could reveal that the proposed model is invalid?"
      ]
    },
    "condensed": {
      "ro": [
        "Fizica materiei condensate explică proprietăți colective ale materialelor folosind structura cristalină, statistica și interacțiunile electronice.",
        "Caz de studiu: compară un izolator, un metal și un semiconductor prin diagrame de benzi, fără a reduce comportamentul la o singură particulă.",
        "Modelul de bandă are limite pentru sisteme dezordonate și puternic corelate; nu identifica automat un gol energetic cu o conductivitate nulă la orice temperatură.",
        "Verificare: ce dovezi experimentale ar distinge o tranziție de fază de o schimbare graduală a rezistenței?"
      ],
      "en": [
        "Condensed matter physics explains collective material behaviour through crystal structure, statistics and electron interactions.",
        "Case study: compare metals, insulators and semiconductors using energy-band diagrams while identifying the assumptions of the model.",
        "Band descriptions have limits in disordered or strongly correlated matter; temperature and defects can matter.",
        "Review: which observations could distinguish a phase transition from a gradual change in resistance?"
      ]
    },
    "nuclear": {
      "ro": [
        "Fizica nucleară studiază structura nucleelor și interacțiunile particulelor; conservarea energiei, impulsului și sarcinii constrânge reacțiile.",
        "Caz de studiu: verifică un bilanț simbolic al unui proces de dezintegrare înainte de a interpreta energia eliberată sau incertitudinea măsurării.",
        "Activitatea unei surse și doza absorbită sunt mărimi diferite; o schemă nucleară nu constituie instrucțiuni pentru manipularea surselor.",
        "Verificare: ce legi de conservare trebuie controlate la o reacție și ce informație experimentală rămâne necesară?"
      ],
      "en": [
        "Nuclear physics studies nuclei and particles under energy, momentum and charge conservation constraints.",
        "Case study: balance a symbolic decay reaction before interpreting released energy or measurement uncertainty.",
        "Source activity, absorbed dose and exposure risk are different quantities; classroom models are not handling instructions.",
        "Review: which conservation laws constrain a reaction, and what still requires experimental evidence?"
      ]
    },
    "astro": {
      "ro": [
        "Astrofizica aplică dinamica, radiația și statistica la obiecte cosmice; inferențele depind de distanțe, observații și selecția eșantioanelor.",
        "Caz de studiu: estimează conceptual cum luminozitatea aparentă și distanța constrâng luminozitatea intrinsecă, fără a inventa valori măsurate.",
        "Deplasarea spre roșu, viteza radială și distanța nu sunt sinonime în orice regim cosmologic.",
        "Verificare: ce incertitudini introduc extincția, calibrarea și selecția observațională?"
      ],
      "en": [
        "Astrophysics applies dynamics, radiation and statistics to cosmic systems, with observational selection and distance uncertainties.",
        "Case study: reason from apparent brightness and distance to intrinsic luminosity without inventing measured values.",
        "Redshift, radial velocity and cosmological distance are not interchangeable in every regime.",
        "Review: how can extinction, calibration and sample selection bias a physical inference?"
      ]
    },
    "applied": {
      "ro": [
        "Fizica aplicată transformă modele în măsurători și instrumente; calibrarea, trasabilitatea și reproducibilitatea condiționează interpretarea.",
        "Caz de studiu: proiectează un protocol de calibrare pentru un senzor, incluzând un martor, domeniul util și o sursă sistematică de eroare.",
        "Precizia și acuratețea sunt proprietăți diferite; un instrument cu multe zecimale poate fi greșit calibrat.",
        "Verificare: ce teste ai face înainte să interpretezi o variație mică drept fenomen fizic nou?"
      ],
      "en": [
        "Applied physics connects models to measurement and instrumentation, demanding calibration, traceability and repeatability.",
        "Case study: design a calibration protocol with a control, useful dynamic range and a known systematic error source.",
        "Precision and accuracy differ; digital resolution does not establish physical validity.",
        "Review: which tests should precede interpreting a small sensor change as a new effect?"
      ]
    }
  },
  "chemistry": {
    "general": {
      "ro": [
        "Chimia generală avansată conectează structura electronică, echilibrele, cinetica și interpretarea spectrală prin modele cu ipoteze explicite.",
        "Caz de studiu: confruntă predicția unui model energetic cu o măsurătoare spectrală și discută ce parametri nu sunt identificabili doar dintr-o singură observație.",
        "Starea de echilibru nu demonstrează un mecanism cinetic, iar potrivirea unui spectru nu garantează unicitatea modelului.",
        "Verificare: care sunt variabilele de stare, datele de calibrare și sursele dominante de incertitudine?"
      ],
      "en": [
        "Advanced general chemistry joins electronic structure, equilibrium, kinetics and spectroscopy through explicit physical assumptions.",
        "Case study: compare a predicted energy model with a spectrum and identify parameters not determined by a single measurement.",
        "Equilibrium does not prove a kinetic mechanism, and fitting a spectrum does not establish model uniqueness.",
        "Review: identify the state variables, calibration information and main uncertainty sources."
      ]
    },
    "pharmacy": {
      "ro": [
        "Chimia farmaceutică studiază proprietățile moleculelor și evaluarea analitică; eficacitatea, farmacocinetica și siguranța nu se deduc dintr-o singură proprietate.",
        "Caz de studiu: compară două structuri candidate prin solubilitate, stabilitate și metode de caracterizare, fără recomandări clinice sau dozare.",
        "O afinitate moleculară estimată nu înseamnă automat eficacitate terapeutică ori autorizare pentru utilizare.",
        "Verificare: ce informații preclinice și analitice ar trebui independente înainte de interpretarea rezultatelor?"
      ],
      "en": [
        "Pharmaceutical chemistry examines molecular properties and analytical evaluation without equating affinity with clinical efficacy.",
        "Case study: compare candidates by solubility, stability and characterisation methods, without prescribing medicines or doses.",
        "Predicted binding is not proof of therapeutic benefit, safety or regulatory approval.",
        "Review: what independent analytical and preclinical evidence is needed before drawing conclusions?"
      ]
    },
    "medical": {
      "ro": [
        "Biochimia clinică și chimia medicinală analizează biomolecule, mecanisme și markeri în contexte cu variabilitate biologică.",
        "Caz de studiu: explică de ce o valoare de laborator necesită metodă de măsurare, interval de referință și context clinic, fără a diagnostica un pacient.",
        "Corelația dintre biomarker și boală nu stabilește singură cauzalitatea; interpretarea medicală nu se automatizează dintr-un singur număr.",
        "Verificare: ce erori preanalitice și diferențe între metode pot modifica rezultatul?"
      ],
      "en": [
        "Medicinal and clinical biochemistry investigate molecular mechanisms and biomarkers within variable biological systems.",
        "Case study: explain why a laboratory result depends on method, reference interval and clinical context, without diagnosing anyone.",
        "A biomarker association alone does not establish disease causation or treatment needs.",
        "Review: what preanalytical errors and assay differences could change the interpretation?"
      ]
    },
    "analytical": {
      "ro": [
        "Chimia analitică instrumentală urmărește identificarea și cuantificarea prin calibrare, limite de detecție, selectivitate și validare.",
        "Caz de studiu: construiește conceptual o curbă de calibrare, include martori și discută propagarea incertitudinii către rezultatul final.",
        "Un vârf într-o cromatogramă sau într-un spectru nu reprezintă identificare certă fără standarde și controlul interferențelor.",
        "Verificare: cum se deosebesc limita de detecție, limita de cuantificare și domeniul liniar?"
      ],
      "en": [
        "Instrumental analytical chemistry requires calibration, selectivity, detection limits and validated quantitative methods.",
        "Case study: develop a calibration curve with blanks and describe how uncertainty propagates into a reported result.",
        "A chromatographic peak or spectral feature is not conclusive identification without standards and interference checks.",
        "Review: distinguish detection limit, quantification limit and linear working range."
      ]
    },
    "industrial": {
      "ro": [
        "Chimia industrială analizează bilanțuri de materie și energie, cinetică și transformări de materiale la scară tehnologică.",
        "Caz de studiu: compară două procese prin consum energetic, conversie, selectivitate și gestionarea produselor secundare.",
        "O reacție cu randament bun în laborator nu se transferă automat la instalații mari fără evaluarea transferului termic și a siguranței.",
        "Verificare: ce date arată fezabilitatea tehnică și ce date descriu impactul asupra mediului?"
      ],
      "en": [
        "Industrial chemistry combines mass and energy balances, reaction kinetics and material processing at technical scale.",
        "Case study: compare processes using energy consumption, conversion, selectivity and by-product handling.",
        "Good laboratory yield does not guarantee safe or scalable industrial performance.",
        "Review: what evidence separates technical feasibility from environmental sustainability?"
      ]
    },
    "environment": {
      "ro": [
        "Chimia mediului examinează transportul și transformarea compușilor în aer, apă și sol sub influența pH-ului, sorbției și reacțiilor.",
        "Caz de studiu: urmărește conceptual un poluant între faze și discută de ce prelevarea punctuală nu descrie automat variația sezonieră.",
        "Prezența analitică nu implică fără analiză expunere relevantă sau risc; nu confunda concentrația cu doza.",
        "Verificare: ce martori, serii temporale și limite analitice sunt necesare pentru o concluzie robustă?"
      ],
      "en": [
        "Environmental chemistry tracks compounds through air, soil and water via reactions, pH effects and partitioning.",
        "Case study: follow a pollutant between phases and explain why one sample may not represent seasonal variation.",
        "Detection alone does not prove meaningful exposure or risk; concentration is not the same as dose.",
        "Review: which controls, time series and analytical limits make the conclusion defensible?"
      ]
    },
    "computational": {
      "ro": [
        "Chimia computațională folosește modele cuantice și simulări pentru a aproxima structuri, energii și proprietăți moleculare.",
        "Caz de studiu: compară două niveluri de teorie pentru aceeași moleculă, precizând baza, criteriul de convergență și evaluarea cu date independente.",
        "Optimizarea unei geometrii nu dovedește automat că structura este un minim global sau că proprietatea prezisă este exactă.",
        "Verificare: ce test de convergență și ce comparație experimentală pot valida o predicție?"
      ],
      "en": [
        "Computational chemistry uses quantum models and simulations to approximate molecular structures, energies and properties.",
        "Case study: compare two levels of theory for one molecule, tracking basis set, convergence criterion and external validation.",
        "An optimised geometry is not necessarily a global energy minimum or an exact prediction.",
        "Review: which convergence tests and experimental observations could challenge the model?"
      ]
    }
  },
  "biology": {
    "cellular": {
      "ro": [
        "Biologia celulară avansată examinează compartimente, trafic membranar, semnalizare și controlul ciclului celular.",
        "Caz de studiu: corelează microscopie și perturbare controlată pentru a investiga distribuția unei proteine fără a confunda colocalizarea cu interacțiunea directă.",
        "O imagine la mărire mare nu înseamnă automat rezoluție mare; controlează artefactele de colorare și achiziție.",
        "Verificare: ce martori și replici biologice ar face experimentul interpretabil?"
      ],
      "en": [
        "Advanced cell biology examines compartments, membrane traffic, signalling and cell-cycle control.",
        "Case study: combine imaging and controlled perturbation to examine protein localisation without equating colocalisation with binding.",
        "Magnification does not ensure resolution; staining and acquisition artefacts must be controlled.",
        "Review: which controls and biological replicates make the experiment interpretable?"
      ]
    },
    "molecular": {
      "ro": [
        "Biologia moleculară explorează replicarea, expresia genelor, reglarea și tehnicile de analiză a ADN/ARN.",
        "Caz de studiu: proiectează un experiment de expresie genică cu controale negative și normalizare, explicând de ce o diferență de ARN nu dovedește singură o diferență de proteină.",
        "Confundarea mutației observate cu efectul funcțional poate produce concluzii nejustificate.",
        "Verificare: ce validare independentă ar confirma un efect biologic al variației genetice?"
      ],
      "en": [
        "Molecular biology studies DNA/RNA, gene expression, regulation and experimental sequence analysis.",
        "Case study: design a gene-expression comparison with negative controls and normalisation; RNA change need not imply protein change.",
        "A detected sequence variant is not automatically a functional or disease-causing mutation.",
        "Review: what independent evidence would establish a functional biological effect?"
      ]
    },
    "anatomy": {
      "ro": [
        "Anatomia și fiziologia universitară leagă arhitectura țesuturilor de reglare, circulație, respirație și schimburile dintre compartimente.",
        "Caz de studiu: explică răspunsul integrat la exercițiu folosind debit cardiac, ventilație și consum de oxigen, fără a deduce valori individuale.",
        "Un model fiziologic normal nu constituie diagnostic și nu descrie automat patologia sau situații clinice.",
        "Verificare: ce variabile trebuie măsurate pentru a separa adaptarea fiziologică de un artefact?"
      ],
      "en": [
        "University anatomy and physiology link tissue structure with integrated circulation, respiration and regulation.",
        "Case study: explain exercise responses using cardiac output, ventilation and oxygen demand without inventing individual measurements.",
        "A healthy physiological model is not a diagnosis and does not capture all clinical variation.",
        "Review: which measurements distinguish regulation from an experimental artefact?"
      ]
    },
    "microbiology": {
      "ro": [
        "Microbiologia studiază diversitatea microbiană, cicluri virale, răspunsuri ale gazdei și metode de identificare.",
        "Caz de studiu: compară un proces bacterian cu un ciclu de replicare viral, precizând ce observații de laborator sunt necesare pentru discriminare.",
        "Nu aplica proprietățile unui microorganism întregului grup; clasificarea și riscul depind de organism și context.",
        "Verificare: de ce un test molecular pozitiv nu cuantifică neapărat microorganisme viabile?"
      ],
      "en": [
        "Microbiology compares microbial diversity, virus replication, host interactions and identification methods.",
        "Case study: contrast bacterial reproduction with a viral replication cycle and identify the measurements required for discrimination.",
        "Organisms and risk vary; group membership alone is not enough to predict every property.",
        "Review: why can a positive molecular test fail to indicate viable organisms?"
      ]
    },
    "biomedical": {
      "ro": [
        "Biologia biomedicală integrează mecanisme celulare, markeri și modele experimentale pentru interpretarea unor fenomene de sănătate.",
        "Caz de studiu: examinează un biomarker dintr-o cohortă, evaluând sensibilitatea, specificitatea și biasul selecției, fără recomandări clinice.",
        "Asocierea statistică nu dovedește un diagnostic ori un efect terapeutic pentru o persoană.",
        "Verificare: cum influențează prevalența interpretarea unui rezultat pozitiv?"
      ],
      "en": [
        "Biomedical science integrates cellular mechanisms, biomarkers and experimental models.",
        "Case study: assess a cohort biomarker using sensitivity, specificity and selection bias without providing clinical advice.",
        "Statistical association does not establish an individual's diagnosis or treatment response.",
        "Review: how does disease prevalence affect interpretation of a positive result?"
      ]
    },
    "biotech": {
      "ro": [
        "Biotehnologia folosește procese biologice pentru măsurare, sinteză și producție, cu evaluarea randamentului și a stabilității.",
        "Caz de studiu: planifică un proces de fermentație la scară didactică, identificând parametri de control, bilanț și variabilitatea loturilor.",
        "O performanță obținută într-un mediu mic nu demonstrează scalabilitate sau siguranță la producție.",
        "Verificare: ce măsurători independente confirmă consistența procesului între loturi?"
      ],
      "en": [
        "Biotechnology harnesses biological systems for production and measurement, subject to yield, stability and process controls.",
        "Case study: plan an educational fermentation process and identify monitoring variables, material balances and batch variability.",
        "Laboratory-scale performance is not proof of safe manufacturing scalability.",
        "Review: what independent measurements show reproducibility across batches?"
      ]
    },
    "ecology": {
      "ro": [
        "Ecologia și conservarea folosesc dinamica populațiilor, rețele trofice și analize spațiale pentru evaluarea schimbărilor ecosistemelor.",
        "Caz de studiu: compară două habitate prin design de eșantionare, controlul detectabilității speciilor și intervale de incertitudine.",
        "O corelație între abundență și temperatură nu identifică automat mecanismul cauzal.",
        "Verificare: cum distingi lipsa unei specii de nedetectarea ei în inventar?"
      ],
      "en": [
        "Conservation ecology uses population dynamics, food webs and spatial sampling to study ecosystem change.",
        "Case study: compare habitats while modelling detection probability and reporting uncertainty.",
        "Correlation between abundance and temperature does not identify a causal mechanism by itself.",
        "Review: how would you distinguish true absence of a species from failure to detect it?"
      ]
    },
    "bioinformatics": {
      "ro": [
        "Bioinformatica îmbină date biologice cu algoritmi, modele statistice și controlul calității secvențelor.",
        "Caz de studiu: compară secvențe după filtrarea calității și discută impactul aliniamentului și al comparațiilor multiple asupra concluziei.",
        "O potrivire de secvențe nu dovedește singură funcția sau omologia fără context evolutiv și evaluare.",
        "Verificare: ce verificări sunt necesare pentru reproductibilitatea unui flux de analiză?"
      ],
      "en": [
        "Bioinformatics combines biological sequences and measurements with algorithms, statistical models and quality control.",
        "Case study: compare sequences after quality filtering and assess alignment uncertainty and multiple-testing effects.",
        "Sequence similarity alone does not prove biological function.",
        "Review: how can a computational analysis be made reproducible and independently validated?"
      ]
    },
    "neurobiology": {
      "ro": [
        "Neurobiologia examinează excitabilitatea neuronilor, sinapsele, circuitele și plasticitatea prin măsurători la scări diferite.",
        "Caz de studiu: conectează un potențial de membrană cu o activitate sinaptică și explică de ce semnalul de ansamblu nu identifică automat fiecare neuron.",
        "Un model simplificat de neuron nu reproduce întreaga diversitate celulară și a circuitelor.",
        "Verificare: ce controale de înregistrare separă semnalul neural de zgomot și artefacte?"
      ],
      "en": [
        "Neurobiology studies neuronal excitability, synapses, circuits and plasticity at multiple measurement scales.",
        "Case study: relate membrane potential to synaptic input while identifying the limitations of population signals.",
        "A simple neuron model does not describe every cell type and circuit.",
        "Review: which recording controls distinguish neural signal from noise and artefact?"
      ]
    }
  },
  "astronomy": {
    "stellar": {
      "ro": [
        "Astrofizica stelară conectează echilibrul hidrostatic, transportul energiei și reacțiile nucleare cu evoluția stelelor.",
        "Caz de studiu: explică de ce o modificare a masei inițiale schimbă simultan temperatura, luminozitatea și durata fazelor evolutive.",
        "Nu trata o stea drept gaz ideal uniform; structura internă și opacitatea depind de condiții și compoziție.",
        "Verificare: ce observații pot constrânge masa și vârsta unei stele și cu ce degenerescențe?"
      ],
      "en": [
        "Stellar astrophysics links hydrostatic balance, energy transport and nuclear reactions to stellar evolution.",
        "Case study: explain how different initial masses influence luminosity, temperature and evolutionary lifetimes.",
        "A star is not a uniform ideal gas; opacity and internal structure depend on local conditions.",
        "Review: which observations constrain stellar mass and age, and where do degeneracies remain?"
      ]
    },
    "dynamics": {
      "ro": [
        "Mecanica cerească studiază orbite, perturbații și stabilitatea sistemelor gravitaționale.",
        "Caz de studiu: compară modelul cu două corpuri cu un sistem în care un al treilea corp produce perturbații, precizând ce mărimi rămân aproximativ conservate.",
        "Elementele orbitale nu sunt parametri independenți de epocă și sistem de referință.",
        "Verificare: în ce condiții un model keplerian devine insuficient?"
      ],
      "en": [
        "Celestial mechanics examines orbits, perturbations and stability in gravitational systems.",
        "Case study: compare two-body motion with a system perturbed by a third body and identify approximately conserved quantities.",
        "Orbital elements depend on reference frame and epoch.",
        "Review: under which conditions does a Keplerian two-body model become inadequate?"
      ]
    },
    "galactic": {
      "ro": [
        "Astronomia galactică studiază populații stelare, structura galaxiei, dinamica și distribuția materiei.",
        "Caz de studiu: compară o curbă de rotație observată cu una estimată din componente vizibile, discutând ipotezele de masă și calibrarea distanțelor.",
        "O curbă de rotație nu determină univoc distribuția tridimensională a materiei.",
        "Verificare: cum afectează praful interstelar selecția stelelor observate?"
      ],
      "en": [
        "Galactic astronomy studies stellar populations, morphology, dynamics and mass distribution.",
        "Case study: compare an observed rotation curve with a visible-matter model and state distance and mass assumptions.",
        "A rotation curve does not uniquely determine a three-dimensional mass distribution.",
        "Review: how can interstellar dust bias an observed stellar population?"
      ]
    },
    "cosmo": {
      "ro": [
        "Cosmologia leagă geometria spațiu-timpului și evoluția universului de observații despre expansiune și structuri la scară mare.",
        "Caz de studiu: arată de ce supernovele standardizate și radiația cosmică de fond constrâng parametri diferiți în cadrul unui model.",
        "Deplasarea cosmologică spre roșu nu poate fi tratată peste tot ca viteză Doppler clasică.",
        "Verificare: ce parametri sunt degenerați și ce set de date suplimentar ar reduce incertitudinea?"
      ],
      "en": [
        "Cosmology connects spacetime geometry and large-scale evolution to expansion and structure observations.",
        "Case study: explain how standardised supernovae and the cosmic microwave background constrain different model parameters.",
        "Cosmological redshift is not always a classical Doppler speed.",
        "Review: which parameter degeneracies require an independent observational dataset?"
      ]
    },
    "planetary": {
      "ro": [
        "Științele planetare examinează structura, atmosferele și evoluția corpurilor din sistemele planetare.",
        "Caz de studiu: combină masă și rază pentru o estimare a densității medii și explică de ce compoziția internă nu rezultă univoc.",
        "Prezența apei sau o temperatură estimată nu dovedește existența vieții.",
        "Verificare: ce observații ar trebui combinate pentru a reduce ambiguitatea compoziției?"
      ],
      "en": [
        "Planetary science studies internal structure, atmospheres and evolution of planetary bodies.",
        "Case study: use mass and radius to reason about mean density while explaining why composition is not uniquely determined.",
        "Water signatures or an estimated temperature do not prove life.",
        "Review: which independent observations help resolve composition ambiguities?"
      ]
    },
    "instruments": {
      "ro": [
        "Instrumentația astronomică conectează optica, detectorii și procesarea datelor cu erorile sistematice ale observațiilor.",
        "Caz de studiu: proiectează o calibrare cu expuneri de bias, dark și flat și explică ce corectează fiecare, fără a inventa un rezultat experimental.",
        "Creșterea timpului de expunere nu elimină automat zgomotul de citire, saturarea sau eroarea de urmărire.",
        "Verificare: ce surse de eroare rămân după calibrarea de bază?"
      ],
      "en": [
        "Astronomical instrumentation links optics, detectors and processing to observational uncertainty.",
        "Case study: design bias, dark and flat-field calibrations and explain what each corrects without fabricating measurements.",
        "Longer exposure alone cannot remove saturation, read noise or tracking errors.",
        "Review: which systematic effects remain after basic image calibration?"
      ]
    },
    "highenergy": {
      "ro": [
        "Astrofizica energiilor înalte descrie procese extreme prin radiații, particule și câmpuri magnetice.",
        "Caz de studiu: discută interpretarea unui spectru de raze X dintr-o sursă compactă, separând modelul termic de unul netermic.",
        "Un semnal energetic nu demonstrează singur prezența unei găuri negre ori a unui mecanism unic.",
        "Verificare: ce observație multi-lungime de undă ar discrimina modelele concurente?"
      ],
      "en": [
        "High-energy astrophysics examines extreme radiation, particles and magnetic fields.",
        "Case study: interpret an X-ray spectrum from a compact object while comparing thermal and non-thermal explanations.",
        "An energetic signal alone does not prove a black hole or a unique emission mechanism.",
        "Review: which multiwavelength observation could discriminate between competing models?"
      ]
    }
  }
});
