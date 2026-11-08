// Curated offline-first Astronomy foundation and university tracks. No live ephemerides implied.
export const ASTRONOMY_TOPICS=Object.freeze([
  {
    "id": "solar",
    "ro": "Sistemul solar",
    "en": "Solar system",
    "minLevel": "beginner"
  },
  {
    "id": "sky",
    "ro": "Cerul și coordonatele",
    "en": "Sky and coordinates",
    "minLevel": "beginner"
  },
  {
    "id": "distances",
    "ro": "Distanțe, lumină și măsurări",
    "en": "Distances and light",
    "minLevel": "beginner"
  },
  {
    "id": "gravity",
    "ro": "Gravitație și orbite",
    "en": "Gravity and orbits",
    "minLevel": "intermediate"
  },
  {
    "id": "stars",
    "ro": "Stele și evoluție stelară",
    "en": "Stars and stellar evolution",
    "minLevel": "beginner"
  },
  {
    "id": "galaxies",
    "ro": "Galaxii și mediul interstelar",
    "en": "Galaxies and interstellar medium",
    "minLevel": "intermediate"
  },
  {
    "id": "observations",
    "ro": "Instrumente și observații",
    "en": "Instruments and observations",
    "minLevel": "intermediate"
  },
  {
    "id": "cosmology",
    "ro": "Cosmologie fundamentală",
    "en": "Foundations of cosmology",
    "minLevel": "intermediate"
  },
  {
    "id": "exoplanets",
    "ro": "Exoplanete și astrobiologie",
    "en": "Exoplanets and astrobiology",
    "minLevel": "intermediate"
  },
  {
    "id": "special-stellar",
    "ro": "Astrofizică stelară",
    "en": "Stellar astrophysics",
    "minLevel": "advanced",
    "specialty": "stellar"
  },
  {
    "id": "special-dynamics",
    "ro": "Mecanică cerească",
    "en": "Celestial mechanics",
    "minLevel": "advanced",
    "specialty": "dynamics"
  },
  {
    "id": "special-galactic",
    "ro": "Astronomie galactică",
    "en": "Galactic astronomy",
    "minLevel": "advanced",
    "specialty": "galactic"
  },
  {
    "id": "special-cosmo",
    "ro": "Cosmologie și relativitate",
    "en": "Cosmology and relativity",
    "minLevel": "advanced",
    "specialty": "cosmo"
  },
  {
    "id": "special-planetary",
    "ro": "Științe planetare",
    "en": "Planetary science",
    "minLevel": "advanced",
    "specialty": "planetary"
  },
  {
    "id": "special-instruments",
    "ro": "Instrumentație și astrometrie",
    "en": "Instrumentation and astrometry",
    "minLevel": "advanced",
    "specialty": "instruments"
  },
  {
    "id": "special-highenergy",
    "ro": "Astrofizică de energii înalte",
    "en": "High-energy astrophysics",
    "minLevel": "advanced",
    "specialty": "highenergy"
  }
]);
export const ASTRONOMY_SPECIALIZATIONS=Object.freeze([
  {
    "id": "stellar",
    "ro": "Astrofizică stelară",
    "en": "Stellar astrophysics",
    "core": [
      "stars",
      "distances",
      "observations"
    ]
  },
  {
    "id": "dynamics",
    "ro": "Mecanică cerească",
    "en": "Celestial mechanics",
    "core": [
      "gravity",
      "solar",
      "sky"
    ]
  },
  {
    "id": "galactic",
    "ro": "Astronomie galactică",
    "en": "Galactic astronomy",
    "core": [
      "galaxies",
      "stars",
      "distances"
    ]
  },
  {
    "id": "cosmo",
    "ro": "Cosmologie și relativitate",
    "en": "Cosmology and relativity",
    "core": [
      "cosmology",
      "galaxies",
      "distances"
    ]
  },
  {
    "id": "planetary",
    "ro": "Științe planetare",
    "en": "Planetary science",
    "core": [
      "solar",
      "exoplanets",
      "observations"
    ]
  },
  {
    "id": "instruments",
    "ro": "Instrumentație și astrometrie",
    "en": "Instrumentation and astrometry",
    "core": [
      "observations",
      "sky",
      "distances"
    ]
  },
  {
    "id": "highenergy",
    "ro": "Astrofizică de energii înalte",
    "en": "High-energy astrophysics",
    "core": [
      "stars",
      "galaxies",
      "observations"
    ]
  }
]);
export const ASTRONOMY_LESSONS=Object.freeze([
  {
    "id": "astro-solar-1",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Soarele",
    "statement": "Steaua centrală a Sistemului Solar, sursa principală de energie radiantă pentru planete.",
    "formula": "M☉≈1,989×10³⁰ kg",
    "aliases": [
      "soarele"
    ]
  },
  {
    "id": "astro-solar-2",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Planetele",
    "statement": "Opt planete orbitează Soarele; orbitele lor sunt aproximativ eliptice.",
    "formula": "Mercur → Neptun",
    "aliases": [
      "planetele"
    ]
  },
  {
    "id": "astro-solar-3",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Unitatea astronomică",
    "statement": "Unitate de lungime definită exact pentru măsurarea distanțelor în Sistemul Solar.",
    "formula": "1 au=149597870700 m",
    "aliases": [
      "unitatea astronomică"
    ]
  },
  {
    "id": "astro-solar-4",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Rotație și revoluție",
    "statement": "Rotația produce alternanța zilei și nopții; revoluția împreună cu înclinarea axei explică anotimpurile.",
    "formula": "Trot≠Torb",
    "aliases": [
      "rotație și revoluție"
    ]
  },
  {
    "id": "astro-solar-5",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Fazele Lunii",
    "statement": "Fazele rezultă din geometria Soare–Pământ–Lună și porțiunea iluminată văzută de pe Pământ.",
    "formula": "sinodic≈29,53 zile",
    "aliases": [
      "fazele lunii"
    ]
  },
  {
    "id": "astro-solar-6",
    "subject": "astronomy",
    "topic": "solar",
    "level": "beginner",
    "title": "Eclipse",
    "statement": "O eclipsă apare la alinierea geometrică adecvată a Soarelui, Pământului și Lunii.",
    "formula": "solar / lunar",
    "aliases": [
      "eclipse"
    ]
  },
  {
    "id": "astro-sky-1",
    "subject": "astronomy",
    "topic": "sky",
    "level": "beginner",
    "title": "Bolta cerească",
    "statement": "Model geometric al direcțiilor către astre, nu o sferă materială.",
    "formula": "orizont, zenit, meridian",
    "aliases": [
      "bolta cerească"
    ]
  },
  {
    "id": "astro-sky-2",
    "subject": "astronomy",
    "topic": "sky",
    "level": "beginner",
    "title": "Constelații",
    "statement": "Regiuni convenționale ale cerului; stelele lor nu sunt obligatoriu apropiate fizic.",
    "formula": "88 regiuni IAU",
    "aliases": [
      "constelații"
    ]
  },
  {
    "id": "astro-sky-3",
    "subject": "astronomy",
    "topic": "sky",
    "level": "intermediate",
    "title": "Ascensie dreaptă",
    "statement": "Coordonată ecuatorială măsurată spre est, uzual în ore, minute și secunde.",
    "formula": "α∈[0h,24h)",
    "aliases": [
      "ascensie dreaptă"
    ]
  },
  {
    "id": "astro-sky-4",
    "subject": "astronomy",
    "topic": "sky",
    "level": "intermediate",
    "title": "Declinație",
    "statement": "Distanța unghiulară față de ecuatorul ceresc.",
    "formula": "δ∈[−90°,90°]",
    "aliases": [
      "declinație"
    ]
  },
  {
    "id": "astro-sky-5",
    "subject": "astronomy",
    "topic": "sky",
    "level": "beginner",
    "title": "Altitudine și azimut",
    "statement": "Coordonatele orizontale depind de locul și momentul observației.",
    "formula": "h∈[−90°,90°]",
    "aliases": [
      "altitudine și azimut"
    ]
  },
  {
    "id": "astro-sky-6",
    "subject": "astronomy",
    "topic": "sky",
    "level": "beginner",
    "title": "Mișcarea aparentă",
    "statement": "Rotația Pământului determină mișcarea diurnă aparentă a cerului.",
    "formula": "≈15°/oră siderală",
    "aliases": [
      "mișcarea aparentă"
    ]
  },
  {
    "id": "astro-distances-1",
    "subject": "astronomy",
    "topic": "distances",
    "level": "beginner",
    "title": "An-lumină",
    "statement": "Distanța parcursă de lumină în vid într-un an iulian.",
    "formula": "1 ly≈9,4607×10¹⁵ m",
    "aliases": [
      "an-lumină"
    ]
  },
  {
    "id": "astro-distances-2",
    "subject": "astronomy",
    "topic": "distances",
    "level": "intermediate",
    "title": "Parsec",
    "statement": "Distanța corespunzătoare paralaxei anuale de o secundă de arc.",
    "formula": "1 pc≈3,26156 ly",
    "aliases": [
      "parsec"
    ]
  },
  {
    "id": "astro-distances-3",
    "subject": "astronomy",
    "topic": "distances",
    "level": "intermediate",
    "title": "Paralaxă stelară",
    "statement": "Deplasarea aparentă a unei stele apropiate față de fond, observată din poziții diferite pe orbită.",
    "formula": "d(pc)=1/p(arcsec)",
    "aliases": [
      "paralaxă stelară"
    ]
  },
  {
    "id": "astro-distances-4",
    "subject": "astronomy",
    "topic": "distances",
    "level": "intermediate",
    "title": "Magnitudine aparentă",
    "statement": "Scară logaritmică inversă a strălucirii observate.",
    "formula": "m₂−m₁=−2,5log₁₀(F₂/F₁)",
    "aliases": [
      "magnitudine aparentă"
    ]
  },
  {
    "id": "astro-distances-5",
    "subject": "astronomy",
    "topic": "distances",
    "level": "intermediate",
    "title": "Flux luminos",
    "statement": "Puterea radiată recepționată pe unitatea de suprafață; pentru surse izotrope scade cu pătratul distanței.",
    "formula": "F=L/(4πd²)",
    "aliases": [
      "flux luminos"
    ]
  },
  {
    "id": "astro-distances-6",
    "subject": "astronomy",
    "topic": "distances",
    "level": "beginner",
    "title": "Viteza luminii",
    "statement": "Viteza luminii în vid este o constantă SI exactă.",
    "formula": "c=299792458 m/s",
    "aliases": [
      "viteza luminii"
    ]
  },
  {
    "id": "astro-gravity-1",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Legea gravitației universale",
    "statement": "Două mase punctiforme se atrag cu o forță proporțională cu produsul maselor și invers proporțională cu pătratul distanței.",
    "formula": "F=Gm₁m₂/r²",
    "aliases": [
      "legea gravitației universale"
    ]
  },
  {
    "id": "astro-gravity-2",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Legea întâi a lui Kepler",
    "statement": "În problema ideală cu două corpuri, orbitele legate sunt elipse cu corpul central într-un focar.",
    "formula": "orbită eliptică",
    "aliases": [
      "legea întâi a lui kepler"
    ]
  },
  {
    "id": "astro-gravity-3",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Legea a doua a lui Kepler",
    "statement": "Raza vectoare mătură arii egale în intervale de timp egale.",
    "formula": "dA/dt=constant",
    "aliases": [
      "legea a doua a lui kepler"
    ]
  },
  {
    "id": "astro-gravity-4",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Legea a treia a lui Kepler",
    "statement": "Pentru masă centrală dominantă, pătratul perioadei este proporțional cu cubul semiaxei mari.",
    "formula": "T²=4π²a³/(GM)",
    "aliases": [
      "legea a treia a lui kepler"
    ]
  },
  {
    "id": "astro-gravity-5",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Viteză orbitală circulară",
    "statement": "În aproximația unei orbite circulare, accelerația centripetă este furnizată de gravitație.",
    "formula": "v=√(GM/r)",
    "aliases": [
      "viteză orbitală circulară"
    ]
  },
  {
    "id": "astro-gravity-6",
    "subject": "astronomy",
    "topic": "gravity",
    "level": "intermediate",
    "title": "Viteza de evadare",
    "statement": "Viteza minimă idealizată pentru scăpare din câmpul gravitațional newtonian fără propulsie ulterioară.",
    "formula": "vesc=√(2GM/r)",
    "aliases": [
      "viteza de evadare"
    ]
  },
  {
    "id": "astro-stars-1",
    "subject": "astronomy",
    "topic": "stars",
    "level": "beginner",
    "title": "Nașterea stelelor",
    "statement": "Stelele se formează prin colaps gravitațional în regiuni dense ale norilor moleculari.",
    "formula": "nor → protostea",
    "aliases": [
      "nașterea stelelor"
    ]
  },
  {
    "id": "astro-stars-2",
    "subject": "astronomy",
    "topic": "stars",
    "level": "beginner",
    "title": "Secvența principală",
    "statement": "Stelele de pe secvența principală fuzionează hidrogen în heliu în nucleu.",
    "formula": "4p → ⁴He + energie (bilanț)",
    "aliases": [
      "secvența principală"
    ]
  },
  {
    "id": "astro-stars-3",
    "subject": "astronomy",
    "topic": "stars",
    "level": "intermediate",
    "title": "Diagrama Hertzsprung–Russell",
    "statement": "Reprezintă stelele după luminozitate și temperatură sau clasă spectrală.",
    "formula": "L vs Teff",
    "aliases": [
      "diagrama hertzsprung–russell"
    ]
  },
  {
    "id": "astro-stars-4",
    "subject": "astronomy",
    "topic": "stars",
    "level": "intermediate",
    "title": "Clase spectrale stelare",
    "statement": "Clasificarea MK ordonează clasele spectrale ale stelelor în principal după temperatura fotosferică.",
    "formula": "O B A F G K M",
    "aliases": [
      "clase spectrale stelare"
    ]
  },
  {
    "id": "astro-stars-5",
    "subject": "astronomy",
    "topic": "stars",
    "level": "intermediate",
    "title": "Legea Stefan–Boltzmann",
    "statement": "Luminozitatea aproximată a unei stele cu radiație termică depinde de rază și temperatura efectivă.",
    "formula": "L=4πR²σT⁴",
    "aliases": [
      "legea stefan–boltzmann"
    ]
  },
  {
    "id": "astro-stars-6",
    "subject": "astronomy",
    "topic": "stars",
    "level": "intermediate",
    "title": "Evoluția finală",
    "statement": "Masa inițială controlează în mare măsură dacă evoluția lasă pitică albă, stea neutronică sau gaură neagră.",
    "formula": "masa + metalicitate → evoluție",
    "aliases": [
      "evoluția finală"
    ]
  },
  {
    "id": "astro-galaxies-1",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "intermediate",
    "title": "Calea Lactee",
    "statement": "Galaxia care conține Sistemul Solar este o galaxie spirală barată.",
    "formula": "spirală barată",
    "aliases": [
      "calea lactee"
    ]
  },
  {
    "id": "astro-galaxies-2",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "intermediate",
    "title": "Tipuri de galaxii",
    "statement": "Galaxiile sunt clasificate morfologic în eliptice, spirale, lenticulare și neregulate.",
    "formula": "E / S / S0 / Irr",
    "aliases": [
      "tipuri de galaxii"
    ]
  },
  {
    "id": "astro-galaxies-3",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "intermediate",
    "title": "Mediul interstelar",
    "statement": "Gazul, praful și câmpurile magnetice dintre stele influențează nașterea și evoluția stelară.",
    "formula": "H I / H II / H₂",
    "aliases": [
      "mediul interstelar"
    ]
  },
  {
    "id": "astro-galaxies-4",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "advanced",
    "title": "Curbe de rotație galactică",
    "statement": "Vitezele orbitale observate sugerează masă suplimentară față de materia luminoasă în multe galaxii.",
    "formula": "v(r)=√(GM(<r)/r)",
    "aliases": [
      "curbe de rotație galactică"
    ]
  },
  {
    "id": "astro-galaxies-5",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "intermediate",
    "title": "Deplasarea spre roșu",
    "statement": "Liniile spectrale pot indica expansiune cosmică sau mișcare relativă; interpretarea depinde de context.",
    "formula": "z=(λobs−λem)/λem",
    "aliases": [
      "deplasarea spre roșu"
    ]
  },
  {
    "id": "astro-galaxies-6",
    "subject": "astronomy",
    "topic": "galaxies",
    "level": "intermediate",
    "title": "Grupuri și roiuri",
    "statement": "Gravitația reunește galaxii în grupuri, roiuri și structuri mai mari.",
    "formula": "grup → roi → filament",
    "aliases": [
      "grupuri și roiuri"
    ]
  },
  {
    "id": "astro-observations-1",
    "subject": "astronomy",
    "topic": "observations",
    "level": "intermediate",
    "title": "Telescop reflector",
    "statement": "O oglindă colectează și focalizează radiația electromagnetică.",
    "formula": "D=diametru apertură",
    "aliases": [
      "telescop reflector"
    ]
  },
  {
    "id": "astro-observations-2",
    "subject": "astronomy",
    "topic": "observations",
    "level": "intermediate",
    "title": "Rezoluție angulară",
    "statement": "Pentru apertură circulară ideală, limita de difracție depinde de lungimea de undă și diametru.",
    "formula": "θ≈1,22λ/D (rad)",
    "aliases": [
      "rezoluție angulară"
    ]
  },
  {
    "id": "astro-observations-3",
    "subject": "astronomy",
    "topic": "observations",
    "level": "intermediate",
    "title": "Spectroscopie",
    "statement": "Spectrele permit estimarea compoziției, temperaturii și vitezelor, cu modele și incertitudini.",
    "formula": "λobs/λrest=1+z",
    "aliases": [
      "spectroscopie"
    ]
  },
  {
    "id": "astro-observations-4",
    "subject": "astronomy",
    "topic": "observations",
    "level": "intermediate",
    "title": "Fotometrie",
    "statement": "Măsoară fluxuri și variații de strălucire în benzi definite.",
    "formula": "magnitudine m",
    "aliases": [
      "fotometrie"
    ]
  },
  {
    "id": "astro-observations-5",
    "subject": "astronomy",
    "topic": "observations",
    "level": "beginner",
    "title": "Poluare luminoasă",
    "statement": "Lumina artificială crește luminozitatea fondului cerului și reduce detectabilitatea obiectelor slabe.",
    "formula": "raport semnal/zgomot",
    "aliases": [
      "poluare luminoasă"
    ]
  },
  {
    "id": "astro-observations-6",
    "subject": "astronomy",
    "topic": "observations",
    "level": "beginner",
    "title": "Observare solară sigură",
    "statement": "Soarele nu se privește direct prin instrumente optice fără filtre solare certificate montate corespunzător.",
    "formula": "filtru solar adecvat obligatoriu",
    "aliases": [
      "observare solară sigură"
    ]
  },
  {
    "id": "astro-cosmology-1",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "intermediate",
    "title": "Expansiunea Universului",
    "statement": "La scară cosmică, metrica spațială evoluează; deplasarea spre roșu cosmologic reflectă extinderea scării cosmice.",
    "formula": "1+z=a₀/aem",
    "aliases": [
      "expansiunea universului"
    ]
  },
  {
    "id": "astro-cosmology-2",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "intermediate",
    "title": "Legea Hubble–Lemaître",
    "statement": "La distanțe suficient de mici cosmologic, viteza de recesiune este aproximativ proporțională cu distanța.",
    "formula": "v≈H₀d",
    "aliases": [
      "legea hubble–lemaître"
    ]
  },
  {
    "id": "astro-cosmology-3",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "intermediate",
    "title": "Radiația cosmică de fond",
    "statement": "Radiația relicvă microunde este dovada unui Univers timpuriu fierbinte și dens.",
    "formula": "TCMB≈2,725 K",
    "aliases": [
      "radiația cosmică de fond"
    ]
  },
  {
    "id": "astro-cosmology-4",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "intermediate",
    "title": "Nucleosinteză primordială",
    "statement": "În primele minute, condițiile cosmice au favorizat formarea nucleelor ușoare.",
    "formula": "H, He, urme Li",
    "aliases": [
      "nucleosinteză primordială"
    ]
  },
  {
    "id": "astro-cosmology-5",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "advanced",
    "title": "Materia întunecată",
    "statement": "Componente gravitaționale neluminoase sunt inferate din mai multe observații; natura microscopică rămâne neclară.",
    "formula": "Ωm=Ωb+Ωdark",
    "aliases": [
      "materia întunecată"
    ]
  },
  {
    "id": "astro-cosmology-6",
    "subject": "astronomy",
    "topic": "cosmology",
    "level": "advanced",
    "title": "Energia întunecată",
    "statement": "Denumire pentru componenta modelată prin accelerarea expansiunii cosmice; natura ei este încă investigată.",
    "formula": "ΛCDM (model)",
    "aliases": [
      "energia întunecată"
    ]
  },
  {
    "id": "astro-exoplanets-1",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "intermediate",
    "title": "Exoplanete",
    "statement": "Planete care orbitează alte stele decât Soarele.",
    "formula": "planetă extrasolară",
    "aliases": [
      "exoplanete"
    ]
  },
  {
    "id": "astro-exoplanets-2",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "intermediate",
    "title": "Metoda tranzitului",
    "statement": "Scăderea periodică a fluxului stelar poate indica trecerea unei planete prin fața stelei.",
    "formula": "ΔF/F≈(Rp/Rs)²",
    "aliases": [
      "metoda tranzitului"
    ]
  },
  {
    "id": "astro-exoplanets-3",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "intermediate",
    "title": "Viteza radială",
    "statement": "Oscilațiile Doppler ale spectrului stelei pot indica efectul gravitațional al unei planete.",
    "formula": "Δλ/λ≈vr/c",
    "aliases": [
      "viteza radială"
    ]
  },
  {
    "id": "astro-exoplanets-4",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "intermediate",
    "title": "Zona locuibilă",
    "statement": "Regiune orientativă în care, pentru condiții atmosferice potrivite, poate exista apă lichidă la suprafață.",
    "formula": "flux stelar + atmosferă",
    "aliases": [
      "zona locuibilă"
    ]
  },
  {
    "id": "astro-exoplanets-5",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "advanced",
    "title": "Biosignături",
    "statement": "Interpretarea unor indicii posibile de viață cere modele alternative și excluderea falselor pozitive.",
    "formula": "dovezi multiple",
    "aliases": [
      "biosignături"
    ]
  },
  {
    "id": "astro-exoplanets-6",
    "subject": "astronomy",
    "topic": "exoplanets",
    "level": "intermediate",
    "title": "Mase și raze exoplanetare",
    "statement": "Tranzitele estimează raza, iar dinamica radială constrânge masa minimă, în funcție de înclinație.",
    "formula": "ρ=3M/(4πR³)",
    "aliases": [
      "mase și raze exoplanetare"
    ]
  },
  {
    "id": "astro-stellar-1",
    "subject": "astronomy",
    "topic": "special-stellar",
    "level": "advanced",
    "title": "Structura stelară",
    "statement": "Echilibrul hidrostatic leagă gradientul de presiune de masă și densitate.",
    "formula": "dP/dr=−GρM(r)/r²",
    "aliases": [
      "structura stelară"
    ]
  },
  {
    "id": "astro-stellar-2",
    "subject": "astronomy",
    "topic": "special-stellar",
    "level": "advanced",
    "title": "Transportul radiativ",
    "statement": "Fluxul de energie depinde de opacitate și gradientul temperaturii.",
    "formula": "difuzie radiativă",
    "aliases": [
      "transportul radiativ"
    ]
  },
  {
    "id": "astro-stellar-3",
    "subject": "astronomy",
    "topic": "special-stellar",
    "level": "advanced",
    "title": "Nucleosinteză stelară",
    "statement": "Reacțiile nucleare produc elemente și energie în condiții de temperatură și densitate extreme.",
    "formula": "lanț pp / CNO",
    "aliases": [
      "nucleosinteză stelară"
    ]
  },
  {
    "id": "astro-stellar-4",
    "subject": "astronomy",
    "topic": "special-stellar",
    "level": "advanced",
    "title": "Pulsări stelare",
    "statement": "Modurile de oscilație permit inferențe asupra interiorului stelelor.",
    "formula": "asteroseismologie",
    "aliases": [
      "pulsări stelare"
    ]
  },
  {
    "id": "astro-dynamics-1",
    "subject": "astronomy",
    "topic": "special-dynamics",
    "level": "advanced",
    "title": "Problema cu două corpuri",
    "statement": "Mișcarea newtoniană a două corpuri se reduce la mișcarea relativă cu masă redusă.",
    "formula": "μ=G(M+m)",
    "aliases": [
      "problema cu două corpuri"
    ]
  },
  {
    "id": "astro-dynamics-2",
    "subject": "astronomy",
    "topic": "special-dynamics",
    "level": "advanced",
    "title": "Elemente orbitale",
    "statement": "Șase parametri clasici descriu o orbită kepleriană într-o epocă dată.",
    "formula": "a,e,i,Ω,ω,M",
    "aliases": [
      "elemente orbitale"
    ]
  },
  {
    "id": "astro-dynamics-3",
    "subject": "astronomy",
    "topic": "special-dynamics",
    "level": "advanced",
    "title": "Perturbații orbitale",
    "statement": "Interacțiunile suplimentare pot modifica lent elementele orbitale.",
    "formula": "ecuațiile planetare Lagrange",
    "aliases": [
      "perturbații orbitale"
    ]
  },
  {
    "id": "astro-dynamics-4",
    "subject": "astronomy",
    "topic": "special-dynamics",
    "level": "advanced",
    "title": "Transfer Hohmann",
    "statement": "Transferul idealizat între orbite circulare coplanare folosește două impulsuri.",
    "formula": "Δv=Δv₁+Δv₂",
    "aliases": [
      "transfer hohmann"
    ]
  },
  {
    "id": "astro-galactic-1",
    "subject": "astronomy",
    "topic": "special-galactic",
    "level": "advanced",
    "title": "Potențiale galactice",
    "statement": "Mișcările stelare sunt determinate de distribuția maselor și potențialul gravitațional.",
    "formula": "∇²Φ=4πGρ",
    "aliases": [
      "potențiale galactice"
    ]
  },
  {
    "id": "astro-galactic-2",
    "subject": "astronomy",
    "topic": "special-galactic",
    "level": "advanced",
    "title": "Dispersia vitezelor",
    "statement": "Distribuția vitezelor tracerilor oferă informații despre dinamica galaxiei.",
    "formula": "σv²=⟨(v−⟨v⟩)²⟩",
    "aliases": [
      "dispersia vitezelor"
    ]
  },
  {
    "id": "astro-galactic-3",
    "subject": "astronomy",
    "topic": "special-galactic",
    "level": "advanced",
    "title": "Populații stelare",
    "statement": "Vârsta și compoziția chimică a stelelor ajută la reconstituirea istoriei galactice.",
    "formula": "[Fe/H]",
    "aliases": [
      "populații stelare"
    ]
  },
  {
    "id": "astro-galactic-4",
    "subject": "astronomy",
    "topic": "special-galactic",
    "level": "advanced",
    "title": "Lentile gravitaționale galactice",
    "statement": "Masa gravitațională deviază traiectoriile luminii, distorsionând sursele de fundal.",
    "formula": "α̂≈4GM/(c²b) (punctiform)",
    "aliases": [
      "lentile gravitaționale galactice"
    ]
  },
  {
    "id": "astro-cosmo-1",
    "subject": "astronomy",
    "topic": "special-cosmo",
    "level": "advanced",
    "title": "Ecuația Friedmann",
    "statement": "Rata expansiunii cosmice depinde de densități, curbură și constanta cosmologică.",
    "formula": "H²=(8πG/3)ρ−kc²/a²+Λc²/3",
    "aliases": [
      "ecuația friedmann"
    ]
  },
  {
    "id": "astro-cosmo-2",
    "subject": "astronomy",
    "topic": "special-cosmo",
    "level": "advanced",
    "title": "Distanțe cosmologice",
    "statement": "Distanțele de luminozitate și unghiulare diferă și depind de modelul cosmologic.",
    "formula": "DL=(1+z)² DA",
    "aliases": [
      "distanțe cosmologice"
    ]
  },
  {
    "id": "astro-cosmo-3",
    "subject": "astronomy",
    "topic": "special-cosmo",
    "level": "advanced",
    "title": "Perturbații cosmologice",
    "statement": "Neomogenitățile primordiale evoluează gravitațional în structuri cosmice.",
    "formula": "δρ/ρ",
    "aliases": [
      "perturbații cosmologice"
    ]
  },
  {
    "id": "astro-cosmo-4",
    "subject": "astronomy",
    "topic": "special-cosmo",
    "level": "advanced",
    "title": "Inflația cosmică",
    "statement": "Clasă de modele pentru expansiunea accelerată timpurie, investigată prin predicții observaționale.",
    "formula": "a(t) crește accelerat",
    "aliases": [
      "inflația cosmică"
    ]
  },
  {
    "id": "astro-planetary-1",
    "subject": "astronomy",
    "topic": "special-planetary",
    "level": "advanced",
    "title": "Atmosfere planetare",
    "statement": "Presiunea și temperatura atmosferelor depind de gravitație, radiație și compoziție.",
    "formula": "H=kBT/(mg) (izoterm)",
    "aliases": [
      "atmosfere planetare"
    ]
  },
  {
    "id": "astro-planetary-2",
    "subject": "astronomy",
    "topic": "special-planetary",
    "level": "advanced",
    "title": "Echilibru radiativ planetar",
    "statement": "Temperatura de echilibru simplificată depinde de flux, albedo și redistribuire.",
    "formula": "Teq≈[L(1−A)/(16πσd²)]^(1/4)",
    "aliases": [
      "echilibru radiativ planetar"
    ]
  },
  {
    "id": "astro-planetary-3",
    "subject": "astronomy",
    "topic": "special-planetary",
    "level": "advanced",
    "title": "Geologia planetară",
    "statement": "Craterizarea, tectonica, vulcanismul și eroziunea ajută la datarea relativă a suprafețelor.",
    "formula": "densitatea craterelor",
    "aliases": [
      "geologia planetară"
    ]
  },
  {
    "id": "astro-planetary-4",
    "subject": "astronomy",
    "topic": "special-planetary",
    "level": "advanced",
    "title": "Orbită și climă",
    "statement": "Variațiile oblicității și excentricității pot modifica distribuția insolației.",
    "formula": "oblicitate ε / excentricitate e",
    "aliases": [
      "orbită și climă"
    ]
  },
  {
    "id": "astro-instruments-1",
    "subject": "astronomy",
    "topic": "special-instruments",
    "level": "advanced",
    "title": "Astrometrie de precizie",
    "statement": "Măsurările repetate de poziție, paralaxă și mișcare proprie oferă geometrie și cinematică.",
    "formula": "μ=Δθ/Δt",
    "aliases": [
      "astrometrie de precizie"
    ]
  },
  {
    "id": "astro-instruments-2",
    "subject": "astronomy",
    "topic": "special-instruments",
    "level": "advanced",
    "title": "Optică adaptivă",
    "statement": "Oglinzile deformabile corectează parțial turbulența atmosferică în timp real.",
    "formula": "front de undă",
    "aliases": [
      "optică adaptivă"
    ]
  },
  {
    "id": "astro-instruments-3",
    "subject": "astronomy",
    "topic": "special-instruments",
    "level": "advanced",
    "title": "Interferometrie",
    "statement": "Semnalele combinate de la mai multe antene sau telescoape permit rezoluție unghiulară mare.",
    "formula": "θ≈λ/B",
    "aliases": [
      "interferometrie"
    ]
  },
  {
    "id": "astro-instruments-4",
    "subject": "astronomy",
    "topic": "special-instruments",
    "level": "advanced",
    "title": "Statistica observațiilor",
    "statement": "Inferența parametrilor cere propagarea erorilor și modelelor de zgomot.",
    "formula": "likelihood × prior → posterior",
    "aliases": [
      "statistica observațiilor"
    ]
  },
  {
    "id": "astro-highenergy-1",
    "subject": "astronomy",
    "topic": "special-highenergy",
    "level": "advanced",
    "title": "Stele neutronice",
    "statement": "Obiecte compacte susținute de presiuni cuantice și interacțiuni nucleare, descrise prin ecuații de stare.",
    "formula": "M,R,EOS",
    "aliases": [
      "stele neutronice"
    ]
  },
  {
    "id": "astro-highenergy-2",
    "subject": "astronomy",
    "topic": "special-highenergy",
    "level": "advanced",
    "title": "Găuri negre",
    "statement": "Regiuni ale spațiu-timpului cu orizont al evenimentelor; soluțiile depind de masă și spin.",
    "formula": "rs=2GM/c² (Schwarzschild)",
    "aliases": [
      "găuri negre"
    ]
  },
  {
    "id": "astro-highenergy-3",
    "subject": "astronomy",
    "topic": "special-highenergy",
    "level": "advanced",
    "title": "Discuri de acreție",
    "statement": "Materie orbitantă disipă energie și poate radia intens când se apropie de un corp compact.",
    "formula": "L≈ηṁc²",
    "aliases": [
      "discuri de acreție"
    ]
  },
  {
    "id": "astro-highenergy-4",
    "subject": "astronomy",
    "topic": "special-highenergy",
    "level": "advanced",
    "title": "Unde gravitaționale",
    "statement": "Perturbații propagative ale metricii, generate de variații cuadrupolare accelerate.",
    "formula": "h(t)",
    "aliases": [
      "unde gravitaționale"
    ]
  }
]);
