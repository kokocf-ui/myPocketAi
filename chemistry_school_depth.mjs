// Pedagogically authored chemistry concepts, equations, worked problems, checks and safe enquiry.
// Used at the documented country year and chapter, not as a same-text fallback for all grades.
export const CHEMISTRY_STUDY_CONCEPTS=Object.freeze({
  "fundamentals": {
    "id": "fundamentals",
    "ro": "Materie, proprietăți și separarea amestecurilor",
    "en": "Matter, properties and separating mixtures",
    "conceptRo": "Materia ocupă spațiu și are masă. Proprietățile fizice se observă fără a schimba identitatea chimică, spre deosebire de formarea unei substanțe noi. Un amestec păstrează substanțele componente; o substanță pură are compoziție chimică definită.",
    "conceptEn": "Matter has mass and takes space. Physical properties can be measured without changing chemical identity; forming a new substance is chemical change. Mixtures retain their constituent substances, whereas pure substances have a defined chemical composition.",
    "formula": "ρ=m/V",
    "symbolsRo": "ρ densitate, m masă, V volum; unitățile trebuie să fie coerente.",
    "symbolsEn": "ρ density, m mass, V volume; units must be consistent.",
    "exampleRo": "O probă de 120 g ocupă 40 cm³. Împărțim 120 la 40 și obținem 3 g/cm³. Dacă volumul s-a citit greșit, și densitatea va fi eronată.",
    "exampleEn": "A 120 g sample occupies 40 cm³. Divide 120 by 40 to obtain 3 g/cm³. An inaccurate volume measurement makes the density unreliable.",
    "questionRo": "De ce poți separa pilitura de fier din nisip cu un magnet, dar nu obții elementele hidrogen și oxigen din apă prin simplă filtrare?",
    "questionEn": "Why can a magnet separate iron filings from sand, but filtering water cannot separate hydrogen and oxygen elements?",
    "answerRo": "Magnetul exploatează o proprietate fizică diferită a componentelor amestecului; apa este un compus, a cărui descompunere cere transformare chimică.",
    "answerEn": "The magnet exploits different physical properties of a mixture; water is a compound requiring chemical change to decompose.",
    "investigationRo": "Compară filtrarea, decantarea și evaporarea folosind doar mostre sigure și descrie ce proprietate fizică permite fiecare separare.",
    "investigationEn": "Compare filtering, decanting and evaporating using only safe samples, and explain the physical property responsible for each separation."
  },
  "atomic": {
    "id": "atomic",
    "ro": "Structura atomului și izotopi",
    "en": "Atomic structure and isotopes",
    "conceptRo": "Atomul conține un nucleu cu protoni și neutroni și un înveliș electronic. Numărul atomic Z este numărul de protoni; izotopii aceluiași element au același Z și un număr diferit de neutroni. Un ion diferă de atomul neutru prin numărul electronilor.",
    "conceptEn": "An atom has a nucleus of protons and neutrons and an electron cloud. Atomic number Z is proton count. Isotopes share Z but differ in neutron count. An ion differs from a neutral atom by electron count.",
    "formula": "A=Z+N",
    "symbolsRo": "A este numărul de nucleoni, Z numărul protonilor, N numărul neutronilor. Pentru atom neutru, electroni=Z.",
    "symbolsEn": "A is nucleon count, Z proton count and N neutron count. A neutral atom has Z electrons.",
    "exampleRo": "Pentru sodiu-23, Z=11: sunt 11 protoni, 12 neutroni și 11 electroni în atomul neutru; ionul Na⁺ are 10 electroni.",
    "exampleEn": "Sodium-23 with Z=11 has 11 protons, 12 neutrons and 11 electrons when neutral; Na⁺ has 10 electrons.",
    "questionRo": "Ce se modifică atunci când atomul de clor capătă un electron: elementul, sarcina sau numărul de protoni?",
    "questionEn": "When a chlorine atom gains an electron, which changes: element identity, charge or proton count?",
    "answerRo": "Se schimbă sarcina, devine Cl⁻. Z și elementul rămân neschimbate.",
    "answerEn": "Its charge changes to Cl⁻. Its atomic number and identity remain the same.",
    "investigationRo": "Folosește un model cu bile marcate pentru a separa protonii, neutronii și electronii. Modelul este simbolic: electronii nu se mișcă pe orbite rigide.",
    "investigationEn": "Use labelled counters for protons, neutrons and electrons. This is a symbolic model, not a depiction of electrons in rigid orbits."
  },
  "periodic": {
    "id": "periodic",
    "ro": "Organizarea elementelor în tabelul periodic",
    "en": "Organisation of elements in the periodic table",
    "conceptRo": "Elementele sunt ordonate după numărul atomic crescător. Elemente din aceeași grupă au adesea proprietăți chimice înrudite pentru că au structuri electronice externe comparabile. Perioadele urmăresc completarea straturilor, dar tendințele au excepții.",
    "conceptEn": "Elements are ordered by increasing atomic number. Members of a group often share chemical properties due to related valence electron structures. Periods relate to shell filling, with important exceptions in periodic trends.",
    "formula": "Z=numărul protonilor",
    "symbolsRo": "Grupele verticale și perioadele orizontale sunt poziții, nu numere de electroni pentru orice element.",
    "symbolsEn": "Groups are vertical columns and periods horizontal rows; their numbers are not universal electron counts.",
    "exampleRo": "Na (Z=11) și K (Z=19) sunt în aceeași grupă și tind să formeze ioni +1; Ne (Z=10) este gaz nobil și are comportament diferit.",
    "exampleEn": "Na (Z=11) and K (Z=19) share a group and commonly form +1 ions; Ne (Z=10) is a noble gas with different behaviour.",
    "questionRo": "Dacă două elemente au numere atomice consecutive, înseamnă că au proprietăți chimice identice?",
    "questionEn": "Do neighbouring atomic numbers guarantee identical chemistry?",
    "answerRo": "Nu. Tendințele depind de structura electronică, nu doar de diferența 1 dintre numerele atomice.",
    "answerEn": "No. Trends depend on electronic structure rather than a one-unit atomic number difference.",
    "investigationRo": "Compară tabelul cu o reprezentare pe grupe și perioade; identifică metale, nemetale și gaze nobile fără a ghici proprietăți necunoscute.",
    "investigationEn": "Use the periodic table to identify groups, periods, metals, nonmetals and noble gases without inventing unsupported properties."
  },
  "bonding": {
    "id": "bonding",
    "ro": "Legături ionice, covalente și metalice",
    "en": "Ionic, covalent and metallic bonds",
    "conceptRo": "Legătura ionică implică atracția electrostatică între ioni, cea covalentă folosirea în comun a densității electronice, iar cea metalică electroni delocalizați. Proprietățile macroscopice depind și de structura materialului, nu numai de eticheta legăturii.",
    "conceptEn": "Ionic bonding involves attraction between ions, covalent bonding shared electron density, and metallic bonding delocalised electrons. Macroscopic properties depend on structure, not merely a bond label.",
    "formula": "Na⁺ + Cl⁻ → NaCl(s)",
    "symbolsRo": "Formula unui compus ionic prezintă raportul ionilor; nu o moleculă izolată NaCl în cristal.",
    "symbolsEn": "An ionic formula gives the ratio of ions; it does not describe an isolated NaCl molecule in the crystal.",
    "exampleRo": "Ca²⁺ și două Cl⁻ formează CaCl₂ deoarece sarcina totală trebuie să fie zero: +2 +2·(−1)=0.",
    "exampleEn": "Ca²⁺ combines with two Cl⁻ to form CaCl₂ because total charge must balance: +2 +2·(−1)=0.",
    "questionRo": "De ce NaCl solid nu conduce curentul la fel ca o soluție apoasă de NaCl?",
    "questionEn": "Why does solid NaCl not conduct like aqueous NaCl solution?",
    "answerRo": "Ionii din solid sunt fixați în rețea; în soluție sunt mobili.",
    "answerEn": "Ions are fixed in the solid lattice but mobile in solution.",
    "investigationRo": "Compară modele pentru H₂O, NaCl și Cu. Notează ce reprezintă fiecare, fără să pretinzi că bilele descriu perfect norii electronici.",
    "investigationEn": "Compare models of H₂O, NaCl and Cu, explicitly noting how models simplify actual electron density."
  },
  "reactions": {
    "id": "reactions",
    "ro": "Reacții, ecuații și conservarea atomilor",
    "en": "Chemical reactions, equations and atom conservation",
    "conceptRo": "O reacție transformă reactanții în produși prin reorganizarea atomilor. Coeficienții stoechiometrici se aleg ca numărul atomilor fiecărui element să fie același de ambele părți. Indicii din formule nu se modifică pentru a echilibra ecuații.",
    "conceptEn": "Reactions rearrange atoms from reactants into products. Balance coefficients so atom counts of each element match on both sides; never change a substance formula index merely to balance an equation.",
    "formula": "2H₂+O₂→2H₂O",
    "symbolsRo": "Doi coeficienți 2 din fața formulelor diferă de indicii ₂ ai moleculelor.",
    "symbolsEn": "Leading coefficients differ from subscript numbers within formulas.",
    "exampleRo": "În 2H₂ + O₂ → 2H₂O avem 4 atomi H și 2 atomi O pe fiecare parte. Pentru 4 moli H₂ cu oxigen suficient se pot forma 4 moli H₂O.",
    "exampleEn": "The balanced equation has four H atoms and two O atoms on each side. Four moles of H₂ with sufficient oxygen yield four moles of H₂O.",
    "questionRo": "Echilibrează Fe + O₂ → Fe₂O₃ fără să modifici Fe₂O₃.",
    "questionEn": "Balance Fe + O₂ → Fe₂O₃ without altering the iron oxide formula.",
    "answerRo": "4Fe+3O₂→2Fe₂O₃. Numără atomii Fe și O separat.",
    "answerEn": "4Fe+3O₂→2Fe₂O₃. Count Fe and O atoms on both sides.",
    "investigationRo": "Reprezintă înainte/după cu simboluri, numără atomii și notează că transformările periculoase se studiază din date, nu se reproduc acasă.",
    "investigationEn": "Draw before/after particle diagrams and count atoms; investigate hazardous reactions using published data rather than home experiments."
  },
  "inorganic": {
    "id": "inorganic",
    "ro": "Oxizi, acizi, baze și săruri",
    "en": "Oxides, acids, bases and salts",
    "conceptRo": "Compușii anorganici pot fi grupați după structură și reacții caracteristice, nu doar după denumire. Oxizii sunt compuși ai oxigenului cu alt element, iar o neutralizare simplă formează sare și apă; există excepții și reacții incomplete.",
    "conceptEn": "Inorganic substances are classified by composition and reactions, not names alone. Oxides combine oxygen with another element; simple acid–base neutralisation may yield salt and water, with exceptions.",
    "formula": "HCl+NaOH→NaCl+H₂O",
    "symbolsRo": "Ecuație pentru reacția unui acid tare cu o bază tare în soluție apoasă.",
    "symbolsEn": "This describes a strong acid–strong base reaction in water.",
    "exampleRo": "0,10 mol HCl neutralizează 0,10 mol NaOH în raport 1:1, dacă reacția este completă și nu există reacții secundare.",
    "exampleEn": "0.10 mol HCl neutralises 0.10 mol NaOH in a 1:1 ratio if reaction is complete with no side reactions.",
    "questionRo": "Identifică din CaO, NaCl, H₂SO₄ și KOH câte un oxid, o sare, un acid și o bază.",
    "questionEn": "Classify CaO, NaCl, H₂SO₄ and KOH as oxide, salt, acid or base.",
    "answerRo": "CaO oxid, NaCl sare, H₂SO₄ acid, KOH bază.",
    "answerEn": "CaO oxide, NaCl salt, H₂SO₄ acid, KOH base.",
    "investigationRo": "Construiește o hartă conceptuală între clase de substanțe; nu recomanda manipularea acizilor sau bazelor concentrate.",
    "investigationEn": "Map connections among inorganic classes, without handling concentrated acids or bases."
  },
  "solutions": {
    "id": "solutions",
    "ro": "Soluții, concentrații și solubilitate",
    "en": "Solutions, concentration and solubility",
    "conceptRo": "O soluție omogenă conține solut și solvent. Solubilitatea este o limită de echilibru dependentă de temperatură și de natura substanțelor; concentrația efectivă poate fi sub această limită. O dizolvare nu înseamnă că masa a dispărut.",
    "conceptEn": "A homogeneous solution contains solute and solvent. Solubility is an equilibrium limit depending on temperature and materials; actual concentration may be below that limit. Dissolved matter has not disappeared.",
    "formula": "w(%)=100·m_solut/m_soluție",
    "symbolsRo": "m_soluție=m_solut+m_solvent, dacă nu are loc pierdere de masă; toate masele trebuie în aceeași unitate.",
    "symbolsEn": "Solution mass equals solute plus solvent mass if none is lost; use consistent units.",
    "exampleRo": "10 g sare în 90 g apă produc 100 g soluție cu concentrația masică 10%, dacă toată sarea se dizolvă.",
    "exampleEn": "10 g salt in 90 g water gives 100 g solution at 10% mass fraction if all salt dissolves.",
    "questionRo": "Ce concentrație masică ai când 5 g substanță se dizolvă în 95 g solvent?",
    "questionEn": "What mass percentage results from dissolving 5 g of solute in 95 g solvent?",
    "answerRo": "5% deoarece masa totală a soluției este 100 g.",
    "answerEn": "5%, since solution mass is 100 g.",
    "investigationRo": "Compară concentrația și solubilitatea pe un grafic conceptual în funcție de temperatură; folosește numai date publicate sau substanțe alimentare sigure.",
    "investigationEn": "Distinguish concentration from solubility in a conceptual temperature graph; use published data or safe food-grade materials."
  },
  "acids": {
    "id": "acids",
    "ro": "pH, acizi, baze și soluții tampon",
    "en": "pH, acids, bases and buffers",
    "conceptRo": "Într-o soluție apoasă, pH-ul cuantifică activitatea ionilor H₃O⁺. La 25°C, pH≈7 este neutru pentru apă pură; valoarea neutră poate varia cu temperatura. Un acid puternic nu este automat concentrat, iar un acid slab nu este neapărat inofensiv.",
    "conceptEn": "In water, pH measures hydronium-ion activity. At 25°C, pure water has pH near 7; neutrality changes with temperature. Strong acid is not the same as concentrated acid, and weak does not mean harmless.",
    "formula": "pH=−log₁₀ a(H₃O⁺)",
    "symbolsRo": "Pentru soluții diluate ideale, activitatea se aproximează prin concentrație raportată la standard.",
    "symbolsEn": "For dilute ideal solutions, activity can be approximated using concentration relative to a standard.",
    "exampleRo": "Pentru o activitate H₃O⁺ egală cu 10⁻³, pH=3. Valoarea nu indică singură volumul sau cantitatea totală de acid.",
    "exampleEn": "For hydronium activity of 10⁻³, pH=3; this alone says nothing about total acid quantity or volume.",
    "questionRo": "Dacă activitatea H₃O⁺ scade de 100 de ori, cu cât crește pH-ul?",
    "questionEn": "If hydronium activity drops one hundredfold, how much does pH rise?",
    "answerRo": "Crește cu 2 unități deoarece log₁₀(100)=2.",
    "answerEn": "It rises by two units because log₁₀(100)=2.",
    "investigationRo": "Reprezintă scara pH și explică de ce hârtia indicatoare oferă doar valori aproximative; nu testa lichide necunoscute.",
    "investigationEn": "Use a pH colour scale to explain why indicator paper offers estimates only; never test unidentified liquids."
  },
  "organic": {
    "id": "organic",
    "ro": "Compuși organici, grupe funcționale și izomerie",
    "en": "Organic compounds, functional groups and isomerism",
    "conceptRo": "Chimia organică studiază structura și reactivitatea compușilor carbonului. Legăturile simple și duble, grupele funcționale și izomeria explică proprietăți diferite; nu toate substanțele cu carbon sunt clasificate ca organice.",
    "conceptEn": "Organic chemistry studies carbon-based structures and reactivity. Single and double bonds, functional groups and isomerism explain different properties; not every carbon compound is classed as organic.",
    "formula": "CₙH₂ₙ₊₂ (alcani aciclici)",
    "symbolsRo": "Formula se aplică alcanilor saturați aciclici, nu hidrocarburilor ciclice sau aromatice.",
    "symbolsEn": "This formula holds for acyclic saturated alkanes, not rings or aromatics.",
    "exampleRo": "Pentru n=3, formula propanului este C₃H₈. Metanul CH₄ și propanul C₃H₈ aparțin aceleiași serii omoloage.",
    "exampleEn": "With n=3 propane is C₃H₈. Methane CH₄ and propane share the alkane homologous series.",
    "questionRo": "Care este formula unui alcan aciclic cu 5 atomi de carbon?",
    "questionEn": "What is the molecular formula of an acyclic alkane with five carbons?",
    "answerRo": "C₅H₁₂, din n=5 în formula generală.",
    "answerEn": "C₅H₁₂ follows from n=5.",
    "investigationRo": "Desenează formule structurale pentru izomeri simpli în condiții de siguranță, fără încercări de sinteză.",
    "investigationEn": "Draw simple structural isomers as a paper exercise without attempting synthesis."
  },
  "physical": {
    "id": "physical",
    "ro": "Termochimie, energie de reacție și cinetică",
    "en": "Thermochemistry, reaction energy and kinetics",
    "conceptRo": "Variația entalpiei la presiune constantă descrie căldura transferată în condiții controlate. Cinetica explică viteza reacțiilor; viteza și poziția echilibrului sunt concepte diferite. Catalizatorii influențează viteza fără a schimba constanta de echilibru la aceeași temperatură.",
    "conceptEn": "Enthalpy change at constant pressure describes thermal exchange under specified conditions. Kinetics studies rate, which differs from equilibrium position. Catalysts change rates but not equilibrium constants at fixed temperature.",
    "formula": "ΔH=H_produși−H_reactanți",
    "symbolsRo": "La convenția uzuală, ΔH<0 caracterizează o reacție exotermă.",
    "symbolsEn": "Negative reaction enthalpy under the usual convention denotes an exothermic reaction.",
    "exampleRo": "Dacă produșii au 80 kJ iar reactanții 125 kJ în condițiile date, ΔH=−45 kJ, deci este exotermă.",
    "exampleEn": "If products have 80 kJ and reactants 125 kJ under specified conditions, ΔH=−45 kJ and the reaction is exothermic.",
    "questionRo": "Poate o reacție să fie exoterma dar lentă?",
    "questionEn": "Can a reaction be exothermic yet slow?",
    "answerRo": "Da. Termodinamica și cinetica descriu aspecte diferite; o barieră de activare poate încetini procesul.",
    "answerEn": "Yes. Thermodynamics and kinetics differ; an activation barrier can slow the process.",
    "investigationRo": "Interpretează grafice energetice pentru reacții exoterme și endoterme; fără încălzirea reactivilor necunoscuți.",
    "investigationEn": "Interpret energy-profile graphs for exothermic and endothermic reactions, without heating unknown reactants."
  },
  "electrochem": {
    "id": "electrochem",
    "ro": "Oxidare–reducere și celule electrochimice",
    "en": "Redox reactions and electrochemical cells",
    "conceptRo": "Oxidarea înseamnă pierdere de electroni, reducerea câștig de electroni. Electronii se echilibrează între semireacții. Electrodul negativ și cel pozitiv depind de tipul celulei; anodul este întotdeauna locul oxidării.",
    "conceptEn": "Oxidation loses electrons and reduction gains them. Electron transfer must balance across half-reactions. Anode/cathode polarity depends on cell type; oxidation always occurs at the anode.",
    "formula": "Zn→Zn²⁺+2e⁻",
    "symbolsRo": "Semireacție de oxidare; trebuie cuplată cu reducerea unei alte specii pentru o reacție globală.",
    "symbolsEn": "Oxidation half-reaction; it must pair with a reduction half-reaction for the whole cell reaction.",
    "exampleRo": "În pila Zn/Cu, zincul se oxidează iar Cu²⁺ se reduce; ecuația globală este Zn+Cu²⁺→Zn²⁺+Cu.",
    "exampleEn": "In a Zn/Cu cell zinc oxidises and Cu²⁺ reduces; overall Zn+Cu²⁺→Zn²⁺+Cu.",
    "questionRo": "Identifică oxidantul în reacția Zn + Cu²⁺ → Zn²⁺ + Cu.",
    "questionEn": "Identify the oxidising agent in Zn + Cu²⁺ → Zn²⁺ + Cu.",
    "answerRo": "Cu²⁺ este oxidantul, deoarece acceptă electronii și se reduce.",
    "answerEn": "Cu²⁺ oxidises zinc because it accepts electrons and is reduced.",
    "investigationRo": "Schițează o pilă galvanică fără montaj fizic sau reactivi periculoși; marchează fluxul electronilor.",
    "investigationEn": "Sketch a galvanic cell without building it or handling hazardous chemicals; label electron flow."
  },
  "analytical": {
    "id": "analytical",
    "ro": "Calibrare, titrare și spectrofotometrie",
    "en": "Calibration, titration and spectrophotometry",
    "conceptRo": "Analiza calitativă identifică specii, iar analiza cantitativă estimează cantități cu incertitudine. O curbă de calibrare nu este validă dincolo de domeniul testat. La titrare, punctul de echivalență și schimbarea de culoare a indicatorului nu coincid neapărat exact.",
    "conceptEn": "Qualitative analysis identifies species, quantitative analysis estimates amounts with uncertainty. A calibration curve applies only in its validated range. In titration, equivalence point and indicator endpoint need not coincide.",
    "formula": "A=εlc (Lambert–Beer)",
    "symbolsRo": "A absorbanță, ε coeficient molar, l drum optic, c concentrație; relația cere domeniu liniar.",
    "symbolsEn": "A absorbance, ε molar absorptivity, l path length, c concentration; linear range is required.",
    "exampleRo": "Cu εl=200 L/mol și A=0,40 rezultă c=0,002 mol/L dacă aparatul este calibrat și domeniul este liniar.",
    "exampleEn": "With εl=200 L/mol and A=0.40, c=0.002 mol/L if the instrument is calibrated and the range is linear.",
    "questionRo": "Dacă lungimea cuvei se dublează la aceeași concentrație, ce se întâmplă cu absorbanța ideală?",
    "questionEn": "If cell path length doubles at fixed concentration, what happens to ideal absorbance?",
    "answerRo": "Se dublează, în domeniul de validitate Lambert–Beer.",
    "answerEn": "It doubles within the Lambert–Beer linear range.",
    "investigationRo": "Compară o curbă de calibrare și punctele de măsurare, menționând blancul, incertitudinea și posibile interferențe.",
    "investigationEn": "Compare a calibration curve with measured points, noting blank corrections, uncertainty and interference."
  },
  "biochemistry": {
    "id": "biochemistry",
    "ro": "Biomolecule, enzime și chimie în mediu",
    "en": "Biomolecules, enzymes and environmental chemistry",
    "conceptRo": "Proteinele, lipidele și glucidele au roluri biochimice diferite. Enzimele catalizează reacții și au domenii de temperatură și pH în care rămân funcționale. Procesele de mediu trebuie analizate prin date și bilanțuri de masă, nu prin concluzii dintr-o singură observație.",
    "conceptEn": "Proteins, lipids and carbohydrates have distinct biochemical roles. Enzymes catalyse reactions within compatible temperature and pH conditions. Environmental processes need data and mass balances rather than conclusions from a single observation.",
    "formula": "v=Vₘₐₓ[S]/(Kₘ+[S])",
    "symbolsRo": "Modelul Michaelis–Menten se aplică numai în condițiile sale de cinetică inițială.",
    "symbolsEn": "Michaelis–Menten requires initial-rate assumptions.",
    "exampleRo": "Pentru [S]=Kₘ, viteza este Vₘₐₓ/2, deoarece numitorul este 2Kₘ.",
    "exampleEn": "At [S]=Kₘ rate equals Vₘₐₓ/2 because the denominator is 2Kₘ.",
    "questionRo": "Este adevărat că dublarea substratului dublează mereu viteza enzimei?",
    "questionEn": "Does doubling substrate concentration always double enzyme rate?",
    "answerRo": "Nu, la concentrații înalte viteza se apropie de saturație.",
    "answerEn": "No; at high substrate concentrations the rate approaches saturation.",
    "investigationRo": "Comentează date publicate despre activitatea enzimatică sau poluanți; nu utiliza mostre biologice sau reactivi necunoscuți acasă.",
    "investigationEn": "Interpret published enzyme or pollutant data instead of using biological samples or unknown reagents at home."
  },
  "advanced": {
    "id": "advanced",
    "ro": "Chimie cuantică, activități și echilibre avansate",
    "en": "Quantum chemistry, activities and advanced equilibria",
    "conceptRo": "În chimia avansată, modelele cuantice justifică structura electronică, iar termodinamica folosește activități și potențiale chimice. O constantă de echilibru depinde de temperatură; activitățile pot diferi semnificativ de concentrațiile brute în soluții neideale.",
    "conceptEn": "Advanced chemistry uses quantum models for electronic structure and activities/chemical potentials for equilibria. Equilibrium constants depend on temperature and activities may depart from concentration in nonideal solutions.",
    "formula": "ΔG°=−RT ln K",
    "symbolsRo": "R constanta gazelor, T temperatura absolută; K trebuie definit termodinamic, adimensional.",
    "symbolsEn": "R gas constant, T absolute temperature; K must be thermodynamically defined and dimensionless.",
    "exampleRo": "Dacă K>1, ln K>0 și ΔG°<0 la T>0. Aceasta nu înseamnă că amestecul dat reacționează neapărat spontan în orice compoziție.",
    "exampleEn": "If K>1, ln K>0 and ΔG°<0 at T>0; actual reaction direction still depends on mixture composition.",
    "questionRo": "De ce ΔG° și ΔG nu sunt identice pentru orice amestec?",
    "questionEn": "Why are ΔG° and ΔG not generally equal for a mixture?",
    "answerRo": "ΔG=ΔG°+RT ln Q; compoziția amestecului influențează Q.",
    "answerEn": "ΔG=ΔG°+RT ln Q, so composition changes Q.",
    "investigationRo": "Analizează un grafic ΔG în funcție de avansarea reacției folosind date modelate, nu măsurători inventate.",
    "investigationEn": "Analyse modelled Gibbs energy versus reaction extent without presenting invented experimental measurements."
  }
});
export function chemistrySchoolCourseDocuments({topic='',country='',grade='',stage='lower',
 yearPosition=null,yearCount=1,language='ro',lessons=[]}={}){
 const item=CHEMISTRY_STUDY_CONCEPTS[topic];if(!item)return [];
 const ro=language==='ro';
 const label=(a,b)=>ro?a:b;
 const suffix=String(grade||'');
 const zone=stage==='primary'?'integrated':stage==='upper'?'intermediate':stage==='lower'?'foundation':'advanced';
 const start=label('Chimie · ','Chemistry · ')+label(item.ro,item.en);
 const year=label('Țară: ','Country: ')+String(country||'')+' · '+label('An/clasă: ','Year/grade: ')+suffix;
 const origin=country==='RO'&&stage==='lower'&&['7','8'].includes(suffix)?
  label('Concordanță: OMEN 3393/2017, Chimie clasele VII–VIII. Ordinea activităților este un parcurs didactic în cadrul temelor programei.',
  'Framework: Romania OMEN 3393/2017, Chemistry grades 7–8. Specific activities follow an educational teaching sequence.'):
  label('Parcurs de învățare orientativ: nu reprezintă o programă națională verificată pentru fiecare an sau școală.',
  'Advisory learning sequence, not an official grade-by-grade syllabus in every school.');
 const levelNote=zone==='integrated'?
  label('Materiale și schimbări se observă integrat în Științe; nu tratăm aceste noțiuni ca disciplină obligatorie separată.',
        'Materials and changes belong to integrated Science; this is not a separate compulsory Chemistry syllabus.'):
  zone==='foundation'?
   label('Construiește definițiile, folosește unități corecte și rezolvă întâi exemple cu o singură relație.',
        'Build vocabulary, use consistent units and start with single-relation examples.'):
   label('Înainte de calcule, precizează ipotezele și limitele modelului; justifică unitățile și conservările.',
         'Before calculations state assumptions and the limits of the model, then verify units and conservation laws.');
 const role=zone==='integrated'?label('observă și clasifică','observe and classify'):
  zone==='foundation'?label('interpretează și compară','interpret and compare'):
   label('modelează și verifică experimental','model and validate evidence');
 const paragraphs=(...parts)=>parts.filter(Boolean).join('\n\n');
 // Stage- and year-specific authored instructional targets. A common broad
 // chemical concept is revisited at progressively higher difficulty, not
 // relabelled as the same worksheet in every national school year. These are
 // original teaching examples; country/year labels do NOT certify local
 // statutory syllabus order. Text stays bilingual as an explicit fallback.
 const annualFocus={
 fundamentals:[
  ['Deosebește obiectele de materialele lor și descrie trei proprietăți observabile fără a gusta sau încălzi probele.',
   'Pentru două obiecte, calculează densitatea din masă și volum. Verifică unitățile și precizează dacă este un obiect gol ori omogen.',
   'Alege filtrarea, decantarea sau evaporarea pentru două amestecuri; compară proprietatea folosită și pierderile posibile.',
   'Planifică separarea unui amestec cu trei componente. Construiește bilanțul masei, explică randamentul și sursele de eroare.'],
  ['Distinguish an object from its material and identify three observable properties without tasting or heating samples.',
   'Calculate density from mass and volume for two objects. Check units and consider whether either object is hollow or nonuniform.',
   'Select filtration, decantation or evaporation for two mixtures and compare the exploited property and possible losses.',
   'Design a three-component mixture separation, account for recovered mass and discuss recovery efficiency and measurement bias.']],
 atomic:[
  ['Distinge atomul, molecula și ionul folosind modele cu etichete pentru protoni, neutroni și electroni.',
   'Folosind Z și A, deduce numerele protonilor și neutronilor pentru doi izotopi și diferențiază un atom neutru de ion.',
   'Compară configurațiile electronice ale elementelor ușoare și explică de ce modelul straturilor este o aproximare.',
   'Analizează dovezile experimentale ale modelului atomic, compară modele succesive și explică limitele lor.'],
  ['Distinguish atom, molecule and ion using labelled models of protons, neutrons and electrons.',
   'Given Z and A, calculate proton and neutron counts for two isotopes; distinguish neutral atoms from ions.',
   'Compare electron configurations of light elements and explain why fixed electron-shell diagrams are approximations.',
   'Evaluate experimental evidence behind atomic models, compare successive models and explain their limitations.']],
 periodic:[
  ['Găsește în tabel numărul atomic și simbolul a trei elemente, fără a deduce proprietăți inexistente.',
   'Compară două elemente din aceeași grupă și unul din altă grupă; explică rolul electronilor de valență.',
   'Descrie o tendință periodică și arată cel puțin o limitare sau excepție a unui model simplu.',
   'Justifică periodicitatea folosind configurații electronice și separă predicțiile calitative de datele măsurate.'],
  ['Locate atomic numbers and symbols of three elements in the periodic table without inventing properties.',
   'Compare two elements from one group and one from another; relate similarities to valence electrons.',
   'Describe a periodic trend and explain at least one exception to a simplified model.',
   'Use electron configurations to justify periodicity and separate qualitative predictions from observed data.']],
 bonding:[
  ['Distinge amestecul de compus și construiește cu bile modele simple pentru H₂O și NaCl.',
   'Compară atracția ionică cu partajarea electronilor într-o legătură covalentă; verifică neutralitatea formulelor.',
   'Explică diferențe de conductivitate și topire folosind structuri metalice, ionice și moleculare.',
   'Folosește polaritatea, geometria și forțele intermoleculare pentru a explica proprietăți; indică limitele modelului cu bile.'],
  ['Distinguish compounds from mixtures using simple labelled models of H₂O and NaCl.',
   'Compare ionic attraction with shared electron density; verify charge balance in ionic formula units.',
   'Explain conductivity and melting differences using metallic, ionic and molecular structure.',
   'Use polarity, molecular geometry and intermolecular forces to explain properties and the limits of ball-and-stick models.']],
 reactions:[
  ['Separă observația unei schimbări fizice de indiciile unei reacții chimice, fără experimente cu reactivi necunoscuți.',
   'Echilibrează ecuații simple numărând atomii; schimbă coeficienții, nu indicii din formule.',
   'Calculează mase sau cantități de substanță într-o reacție echilibrată și identifică reactantul limitant.',
   'Compară randamentul teoretic cu cel real, explică pierderile și interpretarea energetică a reacției.'],
  ['Distinguish evidence of chemical reaction from physical change without mixing unknown substances.',
   'Balance simple equations by counting atoms; change coefficients, never subscripts in formulas.',
   'Use a balanced equation for mass or mole calculations and identify a limiting reactant.',
   'Compare theoretical and actual yield, explain losses and interpret the reaction energy profile.']],
 inorganic:[
  ['Recunoaște oxizi, săruri, acizi și baze din formule și denumiri uzuale, fără a manipula produse concentrate.',
   'Scrie formule folosind valențe și sarcini ionice; explică de ce neutralitatea este necesară.',
   'Compară clase de compuși prin reacții reprezentative și verifică balanța atomilor.',
   'Prezice produșii în condiții definite, discută solubilitatea, starea substanțelor și limitele regulilor de clasificare.'],
  ['Identify oxides, salts, acids and bases from common names and formulas without handling concentrated products.',
   'Construct formulas from ionic charges and explain why bulk compounds are electrically neutral.',
   'Compare inorganic classes using representative, atom-balanced equations.',
   'Predict products under stated conditions and discuss solubility, phase and limits of simple classification rules.']],
 solutions:[
  ['Distingem dizolvarea de dispariția substanței și observăm un amestec omogen folosind sare alimentară și apă.',
   'Calculează procentul masic pentru o soluție din masa solutului și masa totală; nu confunda masa solventului cu cea a soluției.',
   'Compară concentrația și solubilitatea la temperaturi diferite cu un grafic construit din date oferite.',
   'Planifică diluții și bilanțuri de masă; justifică de ce relațiile simple pot eșua la variații mari de volum.'],
  ['Distinguish dissolving from disappearing matter using safe food-grade salt and water.',
   'Calculate mass percentage from solute mass and total solution mass, not solvent mass alone.',
   'Compare concentration and solubility at different temperatures using supplied plotted data.',
   'Plan dilutions and mass balances and explain when simple volume-additivity assumptions fail.']],
 acids:[
  ['Observă o scală de culori a indicatorului universal dintr-o imagine, fără a gusta sau amesteca produse casnice.',
   'Interpretează pH-ul ca scară logaritmică și compară două valori, fără a confunda acidul tare cu cel concentrat.',
   'Echilibrează o neutralizare sigură reprezentată pe hârtie și calculează rapoartele molare.',
   'Folosește pKa și Henderson–Hasselbalch în condițiile declarate, discutând activitățile și capacitatea tampon.'],
  ['Interpret a printed universal-indicator colour scale without tasting or mixing household substances.',
   'Read the logarithmic pH scale and compare two readings; distinguish strong from concentrated acid.',
   'Balance a paper-model neutralisation and compute the reacting mole ratio.',
   'Apply pKa and the Henderson–Hasselbalch relation under stated assumptions, discussing activities and buffer capacity.']],
 organic:[
  ['Recunoaște carbonul ca element prezent în numeroși compuși și distinge formulele de imaginile moleculelor.',
   'Identifică grupe funcționale în exemple simple și explică diferența dintre doi izomeri.',
   'Scrie o reacție organică reprezentativă cu reactanți și produși corecți, fără proceduri periculoase.',
   'Analizează selectivitate, mecanisme și interpretări spectroscopice folosind numai date sau modele autorizate.'],
  ['Recognise carbon in a wide range of compounds and distinguish chemical formulas from molecular pictures.',
   'Identify common functional groups and explain structural isomerism with examples.',
   'Write representative organic transformations with atom-balanced reactants and products, without hazardous procedures.',
   'Analyse selectivity, mechanisms and spectroscopy using provided safe educational models or datasets.']],
 physical:[
  ['Distinge viteza unei schimbări de cantitatea totală de produs, fără a interpreta temperatura ca reacție în sine.',
   'Citește un profil energetic al reacției și deosebește energia de activare de schimbarea entalpiei.',
   'Compară viteze de reacție în două condiții controlate și explică rolul catalizatorului.',
   'Aplică noțiuni de echilibru și termodinamică chimică în modele delimitate; verifică semnul lui ΔG.'],
  ['Distinguish how fast a chemical change occurs from the total product formed.',
   'Read an energy-profile diagram and distinguish activation energy from reaction enthalpy change.',
   'Compare reaction rates under two controlled conditions and explain catalyst action.',
   'Use equilibrium and chemical thermodynamics in explicitly bounded models and verify the sign of ΔG.']],
 electrochem:[
  ['Identifică în schemă două materiale diferite și un traseu al sarcinilor, fără a folosi alimentare la priză.',
   'Distinge oxidarea de reducere urmărind electronii într-o reacție echilibrată.',
   'Compară două celule galvanice modelate și explică semnul polarității și rolul electrolitului.',
   'Aplică ecuația Nernst doar pentru activități și temperaturi definite și discută limitele modelului ideal.'],
  ['Identify two dissimilar materials and a charge path in a diagram without using mains electricity.',
   'Track electrons to distinguish oxidation from reduction in a balanced reaction.',
   'Compare model galvanic cells and explain electrode polarity and the electrolyte role.',
   'Apply the Nernst equation with defined activities and temperature and discuss ideal-model limitations.']],
 analytical:[
  ['Deosebește culoarea observată de o măsurătoare cu unități și explică de ce un instrument trebuie calibrat.',
   'Organizează un set de date în tabel și construiește un grafic de calibrare cu axe etichetate.',
   'Aplică o dreaptă de calibrare pentru a estima o concentrație, discutând erorile de citire.',
   'Separă precizia, exactitatea, limitele de detecție și cuantificare pe date experimentale publicate.'],
  ['Distinguish a visible colour observation from a measurement with units and explain calibration.',
   'Tabulate measurements and build a calibration graph with labelled axes.',
   'Use a fitted calibration line to estimate concentration and discuss reading uncertainty.',
   'Distinguish precision, accuracy, detection and quantification limits using provided data.']],
 biochemistry:[
  ['Recunoaște glucidele, lipidele și proteinele ca grupe de substanțe din organisme, fără teste medicale.',
   'Compară rolul unor nutrienți și explică de ce structura moleculei contează.',
   'Interpretează un grafic simplu de activitate enzimatică în funcție de temperatură, fără a inventa valori.',
   'Analizează un model Michaelis–Menten și limitele de aplicare; nu interpreta graficul ca diagnostic.'],
  ['Recognise carbohydrates, lipids and proteins as classes of biological substances without doing medical tests.',
   'Compare nutrient functions and explain why molecular structure matters.',
   'Interpret a supplied enzyme-activity curve against temperature without inventing measurements.',
   'Analyse the Michaelis–Menten model and its conditions without interpreting the curve as a diagnosis.']],
 advanced:[
  ['Distinge o explicație chimică bazată pe dovezi de un model ilustrativ care simplifică realitatea.',
   'Descrie o relație dintre structură, legături și proprietățile substanței folosind date cunoscute.',
   'Compară predicțiile a două modele și precizează unde fiecare poate produce erori.',
   'Justifică explicit ecuația și condițiile modelului pentru o problemă de echilibru sau structură cuantică.'],
  ['Distinguish evidence-based chemical explanation from an illustrative model that simplifies reality.',
   'Relate structure, bonding and properties using available evidence.',
   'Compare predictions from two models and explain where each can fail.',
   'State governing equations and explicit validity conditions for an equilibrium or quantum-structure problem.']]
 };
 const localYears={
  RO:{'7':0,'8':1,'9':0,'10':1,'11':2,'12':3},
  'GB-ENG':{'Y7':0,'Y8':1,'Y9':2,'Y10':0,'Y11':1,'Y12':2,'Y13':3},
  FR:{'6e':0,'5e':1,'4e':2,'3e':3},
  PT:{'7':0,'8':1,'9':2},
  HU:{'7':0,'8':1},PL:{VII:0,VIII:1},CZ:{'8':0,'9':1}
 };
 const parsedGrade=Number((suffix.match(/\d+/)||[])[0]||0);
 const inferred=localYears[String(country).toUpperCase()]?.[suffix] ??
  (Number.isFinite(parsedGrade)&&parsedGrade>0?
   (stage==='upper'?Math.max(0,parsedGrade-9):Math.max(0,parsedGrade-6)):0);
 const slot=Number.isFinite(Number(yearPosition))&&yearPosition!==null?
  Math.max(0,Number(yearPosition)):inferred;
 const step=stage==='primary'?0:Math.min(3,Math.floor(slot));
 const progressive=annualFocus[topic]?.[ro?0:1]?.[step]||'';
 const skillTask=label(
  ['Observă și clasifică, apoi explică în cuvinte ce dovedește comparația.',
   'Reproduce un exemplu cu date și unități, arătând fiecare transformare.',
   'Compara două scenarii și indică o variabilă controlată și o limitare a calculelor.',
   'Evaluează două modele sau seturi de date și susține o concluzie folosind incertitudinea.'][step],
  ['Observe and classify, then explain the evidence in words.',
   'Work through an example using data and units with each step shown.',
   'Compare two scenarios with a control variable and a calculation limitation.',
   'Evaluate competing models or data sets and justify a conclusion using uncertainty.'][step]
 );

 const docs=[
  {id:topic+'-concept',ro:'1. Concepte și explicații',en:'1. Concepts and explanations',
   text:paragraphs(start,year,origin,levelNote,'1. '+label('Ideea de bază','Core idea'),label(item.conceptRo,item.conceptEn),
    '2. '+label('Unde întâlnim fenomenul?','Where does this happen?'),label(item.exampleRo,item.exampleEn),
    '3. '+label('De ce contează precizia?','Why does precision matter?'),
    label('Un model chimic este o explicație testabilă. Etichetează substanțele, numerele și condițiile; descrie ce se măsoară și ce se deduce. Evită să confunzi observația cu interpretarea.',
          'A chemical model is a testable explanation. Label species, numbers and conditions; say what is measured and what is inferred. Do not confuse observation with interpretation.'),
    label('Întrebare de verificare','Check your understanding'),label(item.questionRo,item.questionEn),
    label('Explicație','Explanation')+': '+label(item.answerRo,item.answerEn))},
  {id:topic+'-formula',ro:'2. Formule, simboluri și calcule',en:'2. Formulas, symbols and calculations',
   text:paragraphs(start,year,levelNote,
    '1. '+label('Relație chimică și notații','Chemical relation and symbols'),item.formula,
    label(item.symbolsRo,item.symbolsEn),
    '2. '+label('Exemplu rezolvat','Worked example'),label(item.exampleRo,item.exampleEn),
    '3. '+label('Pașii metodei','Method steps'),
    label('Scrie datele și unitățile. Alege relația potrivită, arată substituția, păstrează simbolurile corecte și interpretează rezultatul. La ecuații chimice verifică bilanțul atomilor și sarcinilor; la calcule de soluții verifică masa totală.',
          'List values and units, choose the valid relation, show substitution and interpret the answer. Balance atoms and charge in reactions, and check total mass in solutions.'),
    '4. '+label('Limitarea formulei','Scope of the formula'),
    label('Formula nu se aplică automat oricărei situații asemănătoare: starea de agregare, temperatura, diluția, condițiile de echilibru ori modelul ideal pot schimba rezultatul.',
          'Do not apply a formula to every superficially similar case: phase, temperature, dilution, equilibrium and idealisation may change the answer.'))},
  {id:topic+'-apply',ro:'3. Aplicare și verificarea rezultatului',en:'3. Practice and checking the result',
   text:paragraphs(start,year,
    '1. '+label('Exercițiu','Practice question'),label(item.questionRo,item.questionEn),
    '2. '+label('Răspuns explicat','Explained answer'),label(item.answerRo,item.answerEn),
    '3. '+label('Comparație cu exemplul','Compare with the example'),label(item.exampleRo,item.exampleEn),
    '4. '+label('Verifică singur','Independent check'),
    label('Spune în ce condiții ai putea folosi expresia '+item.formula+'. Prezintă o situație în care ar produce un rezultat înșelător. Justifică răspunsul în cuvinte, nu doar printr-un număr.',
          'State the conditions for using '+item.formula+'. Give a situation where it could mislead and explain your answer, not only a number.'),
    '5. '+label('Capcane frecvente','Common mistakes'),
    label('Atenție la formulele substanțelor, la coeficienții de reacție, la conversiile de masă și volum și la diferența dintre ipotezele modelului și condițiile reale.',
          'Check species formulas, reaction coefficients, mass and volume conversions, and the difference between model assumptions and actual conditions.'))},
  {id:topic+'-enquiry',ro:'4. Investigație și interpretare',en:'4. Investigation and interpretation',
   text:paragraphs(start,year,
    '1. '+label('Problemă de cercetat','Question to investigate'),label(item.investigationRo,item.investigationEn),
    '2. '+label('Ce documentăm?','Evidence to record'),
    label('Formulează o ipoteză. Alege variabila pe care o schimbi și variabilele pe care le menții constante. Într-un tabel notează sursa datelor, unitățile, observațiile și incertitudinile; folosește un grafic numai dacă mărimile măsurate justifică unul.',
          'State a hypothesis. Select one independent variable and controls. Record source, units, observations and uncertainty in a table; make a graph only when measurements justify it.'),
    '3. '+label('Siguranță','Safety'),
    label('La nivel școlar folosește reprezentări, obiecte inerte sau date publicate. Nu gusta, nu mirosi intenționat, nu încălzi și nu combina reactivi necunoscuți; experimentele cu substanțe periculoase au loc numai în laborator supravegheat.',
          'At school level, use diagrams, inert objects or published data. Never taste, deliberately smell, heat or mix unknown chemicals; hazardous experiments require supervised laboratories.'),
    '4. '+label('Concluzie argumentată','Evidence-based conclusion'),
    label('Compară predicția și datele, explică neconcordanțele și separă limitele instrumentului de limitele legii chimice. Raportează rezultatul fără a inventa valori lipsă.',
          'Compare prediction with evidence, explain discrepancies and distinguish instrument limits from theory limits. Do not invent missing measurements.'))}
 ];
 // The four documents must teach a *real annual skill* alongside the core
 // chapter instead of reopening identical material in every grade.
 if(progressive){
  const title=label('Obiectiv specific acestui an','Year-specific learning objective');
  docs[0].text+='\n\n'+title+'\n'+progressive+'\n\n'+
   label('Competență verificabilă','Measurable outcome')+'\n'+skillTask;
  docs[1].text+='\n\n'+title+'\n'+progressive+'\n\n'+
   label('Aplică relația sau modelul în acest context și justifică dacă formula este potrivită.',
         'Apply the relation or model to this context and justify its suitability.');
  docs[2].text+='\n\n'+title+'\n'+progressive+'\n\n'+
   label('Cerință nouă pentru anul selectat:','New question for this school year:')+'\n'+skillTask;
  docs[3].text+='\n\n'+title+'\n'+progressive+'\n\n'+
   label('Investigație adecvată etapei și clasei:','Investigation suited to the stage and year:')+
   '\n'+skillTask+'\n'+
   label('Folosește numai simulări, date furnizate sau materiale școlare sigure; nu inventa observații.',
         'Use only simulations, supplied datasets or safe school materials; never fabricate observations.');
 }
 // Existing curated subject subtopics are supplementary, not four buttons
 // reopening the same text. Use a different slice for each document and year.
 const eligible=(Array.isArray(lessons)?lessons:[]).filter(e=>
  e?.subject==='chemistry'&&e.topic===topic&&e.level!=='advanced'&&
  (stage==='upper'||e.level==='beginner')).sort((a,b)=>
   String(a.id||'').localeCompare(String(b.id||'')));
 if(ro&&eligible.length){
  const used=new Set();
  for(const [index,doc] of docs.entries()){
   const selected=[];
   const offset=Math.max(0,Number(yearPosition)||0)*2+index*2;
   for(let advance=0;advance<eligible.length&&selected.length<2;advance++){
    const entry=eligible[(offset+advance)%eligible.length];
    if(used.has(entry.id))continue;
    used.add(entry.id);selected.push(entry);
   }
   if(selected.length){
    const extra=selected.map((entry,i)=>[
     'SUBCAPITOL '+(index+1)+'.'+(i+1)+' · '+entry.title,
     String(entry.statement||'').trim(),
     entry.formula&&entry.formula!=='—'?'Relație de studiu: '+entry.formula:'',
     'Cerință: formulează o explicație proprie și identifică o condiție de aplicare.'
    ].filter(Boolean).join('\n')).join('\n\n');
    doc.text+='\n\n'+extra;
   }
  }
 }
 if(zone==='integrated')return [docs[0],docs[3]];
 return docs;
}
