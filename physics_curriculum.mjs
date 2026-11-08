export const PHYSICS_TOPICS = Object.freeze([
  {
    "id": "units",
    "ro": "Mărimi fizice și măsurări",
    "en": "Physical quantities and measurements",
    "minLevel": "beginner"
  },
  {
    "id": "kinematics",
    "ro": "Cinematică și mișcare",
    "en": "Kinematics and motion",
    "minLevel": "beginner"
  },
  {
    "id": "dynamics",
    "ro": "Dinamică și forțe",
    "en": "Dynamics and forces",
    "minLevel": "beginner"
  },
  {
    "id": "energy",
    "ro": "Energie, lucru și putere",
    "en": "Energy, work and power",
    "minLevel": "beginner"
  },
  {
    "id": "fluids",
    "ro": "Fluide și presiune",
    "en": "Fluids and pressure",
    "minLevel": "beginner"
  },
  {
    "id": "heat",
    "ro": "Temperatură și căldură",
    "en": "Temperature and heat",
    "minLevel": "beginner"
  },
  {
    "id": "electric",
    "ro": "Electricitate și circuite",
    "en": "Electricity and circuits",
    "minLevel": "beginner"
  },
  {
    "id": "waves",
    "ro": "Oscilații și unde",
    "en": "Oscillations and waves",
    "minLevel": "intermediate"
  },
  {
    "id": "optics",
    "ro": "Optică geometrică și ondulatorie",
    "en": "Geometrical and wave optics",
    "minLevel": "intermediate"
  },
  {
    "id": "electromagnetism",
    "ro": "Electromagnetism",
    "en": "Electromagnetism",
    "minLevel": "intermediate"
  },
  {
    "id": "thermodynamics",
    "ro": "Termodinamică și gaze",
    "en": "Thermodynamics and gases",
    "minLevel": "intermediate"
  },
  {
    "id": "circuits",
    "ro": "Curent alternativ și circuite",
    "en": "AC and circuits",
    "minLevel": "intermediate"
  },
  {
    "id": "modern",
    "ro": "Fizică modernă și nucleară",
    "en": "Modern and nuclear physics",
    "minLevel": "intermediate"
  },
  {
    "id": "measurement",
    "ro": "Metode experimentale și analiză de date",
    "en": "Experimental physics and data",
    "minLevel": "intermediate"
  },
  {
    "id": "special-quantum",
    "ro": "Mecanică cuantică",
    "en": "Quantum mechanics",
    "minLevel": "advanced",
    "specialty": "quantum"
  },
  {
    "id": "special-relativity",
    "ro": "Relativitate și gravitație",
    "en": "Relativity and gravitation",
    "minLevel": "advanced",
    "specialty": "relativity"
  },
  {
    "id": "special-theory",
    "ro": "Fizică matematică și teoretică",
    "en": "Mathematical and theoretical physics",
    "minLevel": "advanced",
    "specialty": "theory"
  },
  {
    "id": "special-condensed",
    "ro": "Materia condensată",
    "en": "Condensed matter",
    "minLevel": "advanced",
    "specialty": "condensed"
  },
  {
    "id": "special-nuclear",
    "ro": "Fizică nucleară și particule",
    "en": "Nuclear and particle physics",
    "minLevel": "advanced",
    "specialty": "nuclear"
  },
  {
    "id": "special-astro",
    "ro": "Astrofizică și cosmologie",
    "en": "Astrophysics and cosmology",
    "minLevel": "advanced",
    "specialty": "astro"
  },
  {
    "id": "special-applied",
    "ro": "Fizică aplicată și instrumente",
    "en": "Applied physics and instrumentation",
    "minLevel": "advanced",
    "specialty": "applied"
  }
]);
export const PHYSICS_SPECIALIZATIONS = Object.freeze([
  {
    "id": "quantum",
    "ro": "Mecanică cuantică",
    "en": "Quantum mechanics",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "relativity",
    "ro": "Relativitate și gravitație",
    "en": "Relativity and gravitation",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "theory",
    "ro": "Fizică matematică și teoretică",
    "en": "Mathematical and theoretical physics",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "condensed",
    "ro": "Materia condensată",
    "en": "Condensed matter",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "nuclear",
    "ro": "Fizică nucleară și particule",
    "en": "Nuclear and particle physics",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "astro",
    "ro": "Astrofizică și cosmologie",
    "en": "Astrophysics and cosmology",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  },
  {
    "id": "applied",
    "ro": "Fizică aplicată și instrumente",
    "en": "Applied physics and instrumentation",
    "core": [
      "units",
      "kinematics",
      "energy",
      "waves",
      "modern",
      "measurement"
    ]
  }
]);
export const PHYSICS_LESSONS = Object.freeze([
  {
    "id": "physics-units-0",
    "subject": "physics",
    "title": "SI",
    "statement": "Unitățile de bază sunt metru, kilogram, secundă, amper, kelvin, mol și candelă.",
    "formula": "m kg s A K mol cd",
    "aliases": [
      "si"
    ],
    "level": "beginner",
    "topic": "units"
  },
  {
    "id": "physics-units-1",
    "subject": "physics",
    "title": "Densitate",
    "statement": "Masa raportată la volum.",
    "formula": "ρ=m/V",
    "aliases": [
      "densitate"
    ],
    "level": "beginner",
    "topic": "units"
  },
  {
    "id": "physics-units-2",
    "subject": "physics",
    "title": "Incertitudinea măsurării",
    "statement": "O măsurătoare trebuie raportată cu incertitudinea corespunzătoare.",
    "formula": "x=x̄±u",
    "aliases": [
      "incertitudinea măsurării"
    ],
    "level": "beginner",
    "topic": "units"
  },
  {
    "id": "physics-kinematics-0",
    "subject": "physics",
    "title": "Viteza medie",
    "statement": "Deplasarea raportată la timpul scurs pentru o dimensiune.",
    "formula": "v=Δx/Δt",
    "aliases": [
      "viteza medie"
    ],
    "level": "beginner",
    "topic": "kinematics"
  },
  {
    "id": "physics-kinematics-1",
    "subject": "physics",
    "title": "Mișcare uniformă",
    "statement": "Poziția variază liniar în timp la viteză constantă.",
    "formula": "x=x₀+vt",
    "aliases": [
      "mișcare uniformă"
    ],
    "level": "beginner",
    "topic": "kinematics"
  },
  {
    "id": "physics-kinematics-2",
    "subject": "physics",
    "title": "Accelerație",
    "statement": "Variația vitezei pe unitatea de timp.",
    "formula": "a=Δv/Δt",
    "aliases": [
      "accelerație"
    ],
    "level": "beginner",
    "topic": "kinematics"
  },
  {
    "id": "physics-kinematics-3",
    "subject": "physics",
    "title": "Mișcare accelerată",
    "statement": "Poziția pentru accelerație constantă.",
    "formula": "x=x₀+v₀t+at²/2",
    "aliases": [
      "mișcare accelerată"
    ],
    "level": "beginner",
    "topic": "kinematics"
  },
  {
    "id": "physics-kinematics-4",
    "subject": "physics",
    "title": "Cădere liberă",
    "statement": "Aproximație lângă suprafața Pământului fără rezistența aerului.",
    "formula": "g≈9,81 m/s²",
    "aliases": [
      "cădere liberă"
    ],
    "level": "beginner",
    "topic": "kinematics"
  },
  {
    "id": "physics-dynamics-0",
    "subject": "physics",
    "title": "Sistem de referință inerțial",
    "statement": "Reper în care un corp liber își păstrează viteza constantă; toate legile Newton iau forma uzuală.",
    "formula": "ΣF⃗=0 ⇒ v⃗=constant",
    "aliases": [
      "sistem de referință inerțial"
    ],
    "level": "beginner",
    "topic": "dynamics"
  },
  {
    "id": "physics-dynamics-1",
    "subject": "physics",
    "title": "Diagrama corpului liber",
    "statement": "Toate forțele exterioare se reprezintă ca vectori înainte de a aplica ecuația de mișcare.",
    "formula": "ΣF⃗=ma⃗",
    "aliases": [
      "diagrama corpului liber"
    ],
    "level": "beginner",
    "topic": "dynamics"
  },
  {
    "id": "physics-dynamics-2",
    "subject": "physics",
    "title": "Forța normală de contact",
    "statement": "Suprafața exercită o forță perpendiculară asupra corpului în contact.",
    "formula": "N ⟂ suprafață",
    "aliases": [
      "forța normală de contact"
    ],
    "level": "beginner",
    "topic": "dynamics"
  },
  {
    "id": "physics-dynamics-3",
    "subject": "physics",
    "title": "Greutatea",
    "statement": "Greutatea într-un câmp gravitațional aproape uniform.",
    "formula": "G=mg",
    "aliases": [
      "greutatea"
    ],
    "level": "beginner",
    "topic": "dynamics"
  },
  {
    "id": "physics-dynamics-4",
    "subject": "physics",
    "title": "Forța elastică",
    "statement": "Resortul ideal se opune deformării în domeniul liniar.",
    "formula": "F=−kx",
    "aliases": [
      "forța elastică"
    ],
    "level": "beginner",
    "topic": "dynamics"
  },
  {
    "id": "physics-energy-0",
    "subject": "physics",
    "title": "Lucru mecanic",
    "statement": "Lucrul unei forțe constante depinde de unghiul cu deplasarea.",
    "formula": "W=Fd cos θ",
    "aliases": [
      "lucru mecanic"
    ],
    "level": "beginner",
    "topic": "energy"
  },
  {
    "id": "physics-energy-1",
    "subject": "physics",
    "title": "Energie cinetică",
    "statement": "Energia cinetică la viteze nerelativiste.",
    "formula": "Ec=mv²/2",
    "aliases": [
      "energie cinetică"
    ],
    "level": "beginner",
    "topic": "energy"
  },
  {
    "id": "physics-energy-2",
    "subject": "physics",
    "title": "Energie potențială",
    "statement": "Energie gravitațională în câmp aproape uniform.",
    "formula": "Ep=mgh",
    "aliases": [
      "energie potențială"
    ],
    "level": "beginner",
    "topic": "energy"
  },
  {
    "id": "physics-energy-3",
    "subject": "physics",
    "title": "Transformarea energiei mecanice",
    "statement": "În absența disipării, variația energiei cinetice este opusă variației energiei potențiale.",
    "formula": "ΔEc=−ΔEp",
    "aliases": [
      "transformarea energiei mecanice"
    ],
    "level": "beginner",
    "topic": "energy"
  },
  {
    "id": "physics-energy-4",
    "subject": "physics",
    "title": "Putere medie",
    "statement": "Lucrul transferat pe unitatea de timp.",
    "formula": "P=W/Δt",
    "aliases": [
      "putere medie"
    ],
    "level": "beginner",
    "topic": "energy"
  },
  {
    "id": "physics-fluids-0",
    "subject": "physics",
    "title": "Presiune",
    "statement": "Forța normală pe suprafață.",
    "formula": "p=Fn/A",
    "aliases": [
      "presiune"
    ],
    "level": "beginner",
    "topic": "fluids"
  },
  {
    "id": "physics-fluids-1",
    "subject": "physics",
    "title": "Presiune hidrostatică",
    "statement": "Creșterea presiunii cu adâncimea în lichid în repaus.",
    "formula": "Δp=ρgh",
    "aliases": [
      "presiune hidrostatică"
    ],
    "level": "beginner",
    "topic": "fluids"
  },
  {
    "id": "physics-fluids-2",
    "subject": "physics",
    "title": "Condiția de plutire",
    "statement": "La echilibru, forța de flotabilitate este egală cu greutatea obiectului.",
    "formula": "Fa=mg",
    "aliases": [
      "condiția de plutire"
    ],
    "level": "beginner",
    "topic": "fluids"
  },
  {
    "id": "physics-fluids-3",
    "subject": "physics",
    "title": "Continuitatea fluidului",
    "statement": "Debitul unui fluid incomprimabil se conservă în curgere staționară.",
    "formula": "A₁v₁=A₂v₂",
    "aliases": [
      "continuitatea fluidului"
    ],
    "level": "beginner",
    "topic": "fluids"
  },
  {
    "id": "physics-heat-0",
    "subject": "physics",
    "title": "Temperatură Kelvin",
    "statement": "Conversia temperaturii Celsius în kelvin.",
    "formula": "T=t+273,15",
    "aliases": [
      "temperatură kelvin"
    ],
    "level": "beginner",
    "topic": "heat"
  },
  {
    "id": "physics-heat-1",
    "subject": "physics",
    "title": "Căldură specifică",
    "statement": "Energia pentru schimbarea temperaturii fără schimbare de fază.",
    "formula": "Q=mcΔT",
    "aliases": [
      "căldură specifică"
    ],
    "level": "beginner",
    "topic": "heat"
  },
  {
    "id": "physics-heat-2",
    "subject": "physics",
    "title": "Căldură latentă",
    "statement": "Energia transferată la schimbarea de fază.",
    "formula": "Q=mL",
    "aliases": [
      "căldură latentă"
    ],
    "level": "beginner",
    "topic": "heat"
  },
  {
    "id": "physics-heat-3",
    "subject": "physics",
    "title": "Dilatarea",
    "statement": "Alungirea liniară aproximativă la încălzire.",
    "formula": "ΔL=αL₀ΔT",
    "aliases": [
      "dilatarea"
    ],
    "level": "beginner",
    "topic": "heat"
  },
  {
    "id": "physics-electric-0",
    "subject": "physics",
    "title": "Curent electric",
    "statement": "Sarcina ce traversează o secțiune în unitatea de timp.",
    "formula": "I=Δq/Δt",
    "aliases": [
      "curent electric"
    ],
    "level": "beginner",
    "topic": "electric"
  },
  {
    "id": "physics-electric-1",
    "subject": "physics",
    "title": "Conductanța electrică",
    "statement": "Conductanța unui rezistor ohmic este inversul rezistenței sale.",
    "formula": "G=1/R",
    "aliases": [
      "conductanța electrică"
    ],
    "level": "beginner",
    "topic": "electric"
  },
  {
    "id": "physics-electric-2",
    "subject": "physics",
    "title": "Putere electrică",
    "statement": "Energia electrică transferată pe unitate de timp.",
    "formula": "P=UI",
    "aliases": [
      "putere electrică"
    ],
    "level": "beginner",
    "topic": "electric"
  },
  {
    "id": "physics-electric-3",
    "subject": "physics",
    "title": "Rezistoare în serie",
    "statement": "Rezistențele în serie se însumează.",
    "formula": "Req=R₁+R₂",
    "aliases": [
      "rezistoare în serie"
    ],
    "level": "beginner",
    "topic": "electric"
  },
  {
    "id": "physics-electric-4",
    "subject": "physics",
    "title": "Rezistoare în paralel",
    "statement": "În paralel conductanțele se însumează.",
    "formula": "1/Req=1/R₁+1/R₂",
    "aliases": [
      "rezistoare în paralel"
    ],
    "level": "beginner",
    "topic": "electric"
  },
  {
    "id": "physics-waves-0",
    "subject": "physics",
    "title": "Frecvență",
    "statement": "Frecvența este inversul perioadei.",
    "formula": "f=1/T",
    "aliases": [
      "frecvență"
    ],
    "level": "intermediate",
    "topic": "waves"
  },
  {
    "id": "physics-waves-1",
    "subject": "physics",
    "title": "Viteza undei",
    "statement": "Viteza unei unde periodice este frecvența înmulțită cu lungimea de undă.",
    "formula": "v=λf",
    "aliases": [
      "viteza undei"
    ],
    "level": "intermediate",
    "topic": "waves"
  },
  {
    "id": "physics-waves-2",
    "subject": "physics",
    "title": "Oscilație armonică",
    "statement": "Oscilația ideală este periodică sinusoidală.",
    "formula": "x=A cos(ωt+φ)",
    "aliases": [
      "oscilație armonică"
    ],
    "level": "intermediate",
    "topic": "waves"
  },
  {
    "id": "physics-waves-3",
    "subject": "physics",
    "title": "Pendul simplu",
    "statement": "Perioada pendulului ideal pentru oscilații mici.",
    "formula": "T≈2π√(L/g)",
    "aliases": [
      "pendul simplu"
    ],
    "level": "intermediate",
    "topic": "waves"
  },
  {
    "id": "physics-optics-0",
    "subject": "physics",
    "title": "Reflexie",
    "statement": "Unghiul de reflexie este egal cu cel de incidență.",
    "formula": "θi=θr",
    "aliases": [
      "reflexie"
    ],
    "level": "intermediate",
    "topic": "optics"
  },
  {
    "id": "physics-optics-1",
    "subject": "physics",
    "title": "Indicele de refracție",
    "statement": "Indicele unui mediu este raportul dintre viteza luminii în vid și viteza luminii în mediu.",
    "formula": "n=c/v",
    "aliases": [
      "indicele de refracție"
    ],
    "level": "intermediate",
    "topic": "optics"
  },
  {
    "id": "physics-optics-2",
    "subject": "physics",
    "title": "Lentilă subțire",
    "statement": "Relația distanțelor obiectului și imaginii în aproximația paraxială.",
    "formula": "1/f=1/do+1/di",
    "aliases": [
      "lentilă subțire"
    ],
    "level": "intermediate",
    "topic": "optics"
  },
  {
    "id": "physics-optics-3",
    "subject": "physics",
    "title": "Interferență",
    "statement": "Pentru interferență constructivă diferența de drum este multiplul lungimii de undă.",
    "formula": "Δ=mλ",
    "aliases": [
      "interferență"
    ],
    "level": "intermediate",
    "topic": "optics"
  },
  {
    "id": "physics-electromagnetism-0",
    "subject": "physics",
    "title": "Constanta electrostatică în vid",
    "statement": "Constanta din legea Coulomb este legată de permitivitatea vidului.",
    "formula": "k=1/(4πε₀)",
    "aliases": [
      "constanta electrostatică în vid"
    ],
    "level": "intermediate",
    "topic": "electromagnetism"
  },
  {
    "id": "physics-electromagnetism-1",
    "subject": "physics",
    "title": "Câmp electric",
    "statement": "Forța electrică pe unitate de sarcină-test.",
    "formula": "E⃗=F⃗/q",
    "aliases": [
      "câmp electric"
    ],
    "level": "intermediate",
    "topic": "electromagnetism"
  },
  {
    "id": "physics-electromagnetism-2",
    "subject": "physics",
    "title": "Capacitate",
    "statement": "Sarcina raportată la tensiunea pe condensator.",
    "formula": "C=Q/U",
    "aliases": [
      "capacitate"
    ],
    "level": "intermediate",
    "topic": "electromagnetism"
  },
  {
    "id": "physics-electromagnetism-3",
    "subject": "physics",
    "title": "Flux magnetic uniform",
    "statement": "Pentru câmp uniform și suprafață plană, fluxul este produsul dintre câmp, arie și cosinusul unghiului.",
    "formula": "ΦB=BA cos θ",
    "aliases": [
      "flux magnetic uniform"
    ],
    "level": "intermediate",
    "topic": "electromagnetism"
  },
  {
    "id": "physics-electromagnetism-4",
    "subject": "physics",
    "title": "Forța Lorentz",
    "statement": "Forța asupra sarcinii în câmp electromagnetic.",
    "formula": "F⃗=q(E⃗+v⃗×B⃗)",
    "aliases": [
      "forța lorentz"
    ],
    "level": "intermediate",
    "topic": "electromagnetism"
  },
  {
    "id": "physics-thermodynamics-0",
    "subject": "physics",
    "title": "Gaz ideal",
    "statement": "Relația de stare pentru gaz ideal.",
    "formula": "pV=nRT",
    "aliases": [
      "gaz ideal"
    ],
    "level": "intermediate",
    "topic": "thermodynamics"
  },
  {
    "id": "physics-thermodynamics-1",
    "subject": "physics",
    "title": "Lucru mecanic la presiune constantă",
    "statement": "Lucrul de expansiune al gazului este presiunea înmulțită cu variația volumului.",
    "formula": "W=pΔV",
    "aliases": [
      "lucru mecanic la presiune constantă"
    ],
    "level": "intermediate",
    "topic": "thermodynamics"
  },
  {
    "id": "physics-thermodynamics-2",
    "subject": "physics",
    "title": "Randament termic",
    "statement": "Raportul dintre lucrul util și căldura absorbită.",
    "formula": "η=W/Qin",
    "aliases": [
      "randament termic"
    ],
    "level": "intermediate",
    "topic": "thermodynamics"
  },
  {
    "id": "physics-thermodynamics-3",
    "subject": "physics",
    "title": "Entropie",
    "statement": "Schimbarea reversibilă de entropie.",
    "formula": "dS=δQrev/T",
    "aliases": [
      "entropie"
    ],
    "level": "intermediate",
    "topic": "thermodynamics"
  },
  {
    "id": "physics-circuits-0",
    "subject": "physics",
    "title": "Legea Kirchhoff noduri",
    "statement": "Suma algebrică a curenților din nod este nulă.",
    "formula": "ΣI=0",
    "aliases": [
      "legea kirchhoff noduri"
    ],
    "level": "intermediate",
    "topic": "circuits"
  },
  {
    "id": "physics-circuits-1",
    "subject": "physics",
    "title": "Legea Kirchhoff ochiuri",
    "statement": "Suma algebrică a tensiunilor într-o buclă concentrată este nulă.",
    "formula": "ΣU=0",
    "aliases": [
      "legea kirchhoff ochiuri"
    ],
    "level": "intermediate",
    "topic": "circuits"
  },
  {
    "id": "physics-circuits-2",
    "subject": "physics",
    "title": "Constanta RC",
    "statement": "Timpul caracteristic al circuitului RC.",
    "formula": "τ=RC",
    "aliases": [
      "constanta rc"
    ],
    "level": "intermediate",
    "topic": "circuits"
  },
  {
    "id": "physics-circuits-3",
    "subject": "physics",
    "title": "Reactanță inductivă",
    "statement": "Reactanța unui inductor ideal.",
    "formula": "XL=ωL",
    "aliases": [
      "reactanță inductivă"
    ],
    "level": "intermediate",
    "topic": "circuits"
  },
  {
    "id": "physics-circuits-4",
    "subject": "physics",
    "title": "Reactanță capacitivă",
    "statement": "Reactanța unui condensator ideal.",
    "formula": "XC=1/(ωC)",
    "aliases": [
      "reactanță capacitivă"
    ],
    "level": "intermediate",
    "topic": "circuits"
  },
  {
    "id": "physics-modern-0",
    "subject": "physics",
    "title": "Energia fotonului",
    "statement": "Energia unui foton este proporțională cu frecvența.",
    "formula": "E=hf",
    "aliases": [
      "energia fotonului"
    ],
    "level": "intermediate",
    "topic": "modern"
  },
  {
    "id": "physics-modern-1",
    "subject": "physics",
    "title": "De Broglie",
    "statement": "Lungimea de undă asociată impulsului.",
    "formula": "λ=h/p",
    "aliases": [
      "de broglie"
    ],
    "level": "intermediate",
    "topic": "modern"
  },
  {
    "id": "physics-modern-2",
    "subject": "physics",
    "title": "Fotoelectric",
    "statement": "Energia electronului fotoemis depinde de funcția de lucru.",
    "formula": "Kmax=hf−φ",
    "aliases": [
      "fotoelectric"
    ],
    "level": "intermediate",
    "topic": "modern"
  },
  {
    "id": "physics-modern-3",
    "subject": "physics",
    "title": "Energia fotonului și impulsul",
    "statement": "Pentru particule fără masă de repaus, energia este produsul impulsului cu viteza luminii.",
    "formula": "E=pc",
    "aliases": [
      "energia fotonului și impulsul"
    ],
    "level": "intermediate",
    "topic": "modern"
  },
  {
    "id": "physics-modern-4",
    "subject": "physics",
    "title": "Dezintegrare",
    "statement": "Numărul nucleelor instabile descrește exponențial.",
    "formula": "N=N₀e^(−λt)",
    "aliases": [
      "dezintegrare"
    ],
    "level": "intermediate",
    "topic": "modern"
  },
  {
    "id": "physics-measurement-0",
    "subject": "physics",
    "title": "Eroare relativă",
    "statement": "Raportul erorii absolute la modulul valorii de referință nenule.",
    "formula": "ε = |Δx|/|xref|",
    "aliases": [
      "eroare relativă"
    ],
    "level": "intermediate",
    "topic": "measurement"
  },
  {
    "id": "physics-measurement-1",
    "subject": "physics",
    "title": "Regresie liniară",
    "statement": "Model liniar cu pantă și intercept.",
    "formula": "y=ax+b",
    "aliases": [
      "regresie liniară"
    ],
    "level": "intermediate",
    "topic": "measurement"
  },
  {
    "id": "physics-measurement-2",
    "subject": "physics",
    "title": "Propagarea incertitudinii",
    "statement": "Aproximație pentru variabile independente.",
    "formula": "u²(f)=Σ(∂f/∂xi)²u²(xi)",
    "aliases": [
      "propagarea incertitudinii"
    ],
    "level": "intermediate",
    "topic": "measurement"
  },
  {
    "id": "physics-measurement-3",
    "subject": "physics",
    "title": "Analiză dimensională",
    "statement": "Termenii ecuațiilor trebuie să aibă dimensiuni compatibile.",
    "formula": "[F]=MLT⁻²",
    "aliases": [
      "analiză dimensională"
    ],
    "level": "intermediate",
    "topic": "measurement"
  },
  {
    "id": "physics-quantum-0",
    "subject": "physics",
    "title": "Schrödinger",
    "statement": "Evoluția stării este generată de hamiltonian.",
    "formula": "iℏ∂ψ/∂t=Ĥψ",
    "aliases": [
      "schrödinger"
    ],
    "level": "advanced",
    "topic": "special-quantum"
  },
  {
    "id": "physics-quantum-1",
    "subject": "physics",
    "title": "Comutator poziție impuls",
    "statement": "Operatorii canonici poziție și impuls nu comută.",
    "formula": "[x̂,p̂]=iℏ",
    "aliases": [
      "comutator poziție impuls"
    ],
    "level": "advanced",
    "topic": "special-quantum"
  },
  {
    "id": "physics-quantum-2",
    "subject": "physics",
    "title": "Regula Born",
    "statement": "ψ(x)",
    "formula": "ρ(x)=",
    "aliases": [
      "regula born"
    ],
    "level": "advanced",
    "topic": "special-quantum"
  },
  {
    "id": "physics-relativity-0",
    "subject": "physics",
    "title": "Factor Lorentz",
    "statement": "Factor de transformare pentru viteze subluminale.",
    "formula": "γ=1/√(1−v²/c²)",
    "aliases": [
      "factor lorentz"
    ],
    "level": "advanced",
    "topic": "special-relativity"
  },
  {
    "id": "physics-relativity-1",
    "subject": "physics",
    "title": "Dilatarea timpului",
    "statement": "Timpul coordonat este mai mare decât timpul propriu pentru mișcare relativă.",
    "formula": "Δt=γΔτ",
    "aliases": [
      "dilatarea timpului"
    ],
    "level": "advanced",
    "topic": "special-relativity"
  },
  {
    "id": "physics-relativity-2",
    "subject": "physics",
    "title": "Raza Schwarzschild",
    "statement": "Raza orizontului pentru masa sferică nerotitoare neîncărcată.",
    "formula": "rs=2GM/c²",
    "aliases": [
      "raza schwarzschild"
    ],
    "level": "advanced",
    "topic": "special-relativity"
  },
  {
    "id": "physics-theory-0",
    "subject": "physics",
    "title": "Euler Lagrange",
    "statement": "Ecuația mișcării obținută din principiul acțiunii staționare.",
    "formula": "d/dt(∂L/∂q̇)−∂L/∂q=0",
    "aliases": [
      "euler lagrange"
    ],
    "level": "advanced",
    "topic": "special-theory"
  },
  {
    "id": "physics-theory-1",
    "subject": "physics",
    "title": "Ecuațiile Hamilton",
    "statement": "Evoluția canonică în variabile conjugate.",
    "formula": "q̇=∂H/∂p",
    "aliases": [
      "ecuațiile hamilton"
    ],
    "level": "advanced",
    "topic": "special-theory"
  },
  {
    "id": "physics-theory-2",
    "subject": "physics",
    "title": "Teorema Noether",
    "statement": "Simetrii continue diferențiabile generează conservări.",
    "formula": "dQ/dt=0",
    "aliases": [
      "teorema noether"
    ],
    "level": "advanced",
    "topic": "special-theory"
  },
  {
    "id": "physics-condensed-0",
    "subject": "physics",
    "title": "Legea Bragg",
    "statement": "Difracția din planuri cristaline.",
    "formula": "nλ=2d sin θ",
    "aliases": [
      "legea bragg"
    ],
    "level": "advanced",
    "topic": "special-condensed"
  },
  {
    "id": "physics-condensed-1",
    "subject": "physics",
    "title": "Distribuție Fermi Dirac",
    "statement": "Ocupația medie a stărilor fermionilor.",
    "formula": "f(E)=1/(e^((E−μ)/kT)+1)",
    "aliases": [
      "distribuție fermi dirac"
    ],
    "level": "advanced",
    "topic": "special-condensed"
  },
  {
    "id": "physics-condensed-2",
    "subject": "physics",
    "title": "Legea Ohm microscopică",
    "statement": "Densitatea de curent este proporțională cu câmpul în medii ohmice.",
    "formula": "J⃗=σE⃗",
    "aliases": [
      "legea ohm microscopică"
    ],
    "level": "advanced",
    "topic": "special-condensed"
  },
  {
    "id": "physics-nuclear-0",
    "subject": "physics",
    "title": "Activitate radioactivă",
    "statement": "Rata de dezintegrare a nucleelor radioactive.",
    "formula": "A=λN",
    "aliases": [
      "activitate radioactivă"
    ],
    "level": "advanced",
    "topic": "special-nuclear"
  },
  {
    "id": "physics-nuclear-1",
    "subject": "physics",
    "title": "Timp de înjumătățire",
    "statement": "Durata necesară înjumătățirii medii a populației.",
    "formula": "t½=ln2/λ",
    "aliases": [
      "timp de înjumătățire"
    ],
    "level": "advanced",
    "topic": "special-nuclear"
  },
  {
    "id": "physics-nuclear-2",
    "subject": "physics",
    "title": "Relația energie impuls",
    "statement": "Relația relativistă între energie și impuls.",
    "formula": "E²=(pc)²+(mc²)²",
    "aliases": [
      "relația energie impuls"
    ],
    "level": "advanced",
    "topic": "special-nuclear"
  },
  {
    "id": "physics-astro-0",
    "subject": "physics",
    "title": "Legea Kepler III",
    "statement": "Perioada orbitală într-un câmp gravitațional dominat de masa M.",
    "formula": "T²=4π²a³/(GM)",
    "aliases": [
      "legea kepler iii"
    ],
    "level": "advanced",
    "topic": "special-astro"
  },
  {
    "id": "physics-astro-1",
    "subject": "physics",
    "title": "Stefan Boltzmann",
    "statement": "Fluxul corpului negru depinde de temperatura la a patra.",
    "formula": "F=σT⁴",
    "aliases": [
      "stefan boltzmann"
    ],
    "level": "advanced",
    "topic": "special-astro"
  },
  {
    "id": "physics-astro-2",
    "subject": "physics",
    "title": "Hubble Lemaître",
    "statement": "Aproximație locală pentru expansiunea cosmică.",
    "formula": "v≈H₀d",
    "aliases": [
      "hubble lemaître"
    ],
    "level": "advanced",
    "topic": "special-astro"
  },
  {
    "id": "physics-applied-0",
    "subject": "physics",
    "title": "Rezonanță LC",
    "statement": "Frecvența proprie a circuitului ideal LC.",
    "formula": "ω₀=1/√(LC)",
    "aliases": [
      "rezonanță lc"
    ],
    "level": "advanced",
    "topic": "special-applied"
  },
  {
    "id": "physics-applied-1",
    "subject": "physics",
    "title": "Nyquist Shannon",
    "statement": "Frecvența eșantionării trebuie să depășească dublul limitei benzii.",
    "formula": "fs>2fmax",
    "aliases": [
      "nyquist shannon"
    ],
    "level": "advanced",
    "topic": "special-applied"
  },
  {
    "id": "physics-applied-2",
    "subject": "physics",
    "title": "Atenuare exponențială",
    "statement": "Intensitatea scade în absorbantul omogen.",
    "formula": "I=I₀e^(−μx)",
    "aliases": [
      "atenuare exponențială"
    ],
    "level": "advanced",
    "topic": "special-applied"
  }
]);
