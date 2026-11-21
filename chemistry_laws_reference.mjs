// General reference; not a substitute for a country's official school curriculum.
// Entries have bilingual explanations, examples, assumptions, and units.
export const CHEMISTRY_LAWS_GROUPS=Object.freeze([
 {id:'composition',ro:'Compoziție și conservare',en:'Composition and conservation'},
 {id:'gas',ro:'Legile gazelor',en:'Gas laws'},
 {id:'equilibrium',ro:'Echilibru și termochimie',en:'Equilibrium and thermochemistry'},
 {id:'kinetics',ro:'Cinetică și soluții',en:'Kinetics and solutions'},
 {id:'electrochemistry',ro:'Electrochimie',en:'Electrochemistry'},
 {id:'periodic',ro:'Periodicitate chimică',en:'Chemical periodicity'}
]);
export const CHEMISTRY_LAWS=Object.freeze([
 {
 id:'lavoisier',group:'composition',type:'law',subject:'chemistry',
 ro:'Legea conservării masei (Lavoisier)',en:'Conservation of mass (Lavoisier)',
 formula:'m(reactanți) = m(produși), într-un sistem închis',
 explainRo:'Într-o reacție chimică obișnuită atomii se rearanjează; masa totală a substanțelor rămâne constantă dacă nimic nu intră și nu iese din sistem. Ecuația reacției trebuie echilibrată.',
 explainEn:'In an ordinary chemical reaction atoms rearrange. Total mass stays constant when the system is closed. The chemical equation must be balanced.',
 exampleRo:'Dacă 12 g carbon reacționează complet cu 32 g oxigen într-un vas închis, se formează 44 g CO₂; 12 + 32 = 44 g.',
 exampleEn:'12 g of carbon reacting completely with 32 g of oxygen in a closed vessel produces 44 g of CO₂: 12 + 32 = 44 g.',
 scopeRo:'Pentru procese chimice într-un sistem închis. Într-un vas deschis, evacuarea unui gaz poate face ca masa măsurată să pară mai mică.',
 scopeEn:'For chemical changes in closed systems. Escaping gases in an open vessel can make the measured mass appear lower.'
 },
 {
 id:'proust',group:'composition',type:'law',subject:'chemistry',
 ro:'Legea proporțiilor definite (Proust)',en:'Law of definite proportions (Proust)',
 formula:'m(H) : m(O) = 1 : 8, pentru apă pură H₂O',
 explainRo:'Un compus chimic pur are aceeași proporție de masă între elementele sale, indiferent de cantitatea probei. Apa pură conține hidrogen și oxigen în proporție de masă 1:8.',
 explainEn:'A pure compound has a constant mass ratio of its constituent elements regardless of sample size. Pure water has a hydrogen-to-oxygen mass ratio of 1:8.',
 exampleRo:'În 18 g de apă se găsesc aproximativ 2 g hidrogen și 16 g oxigen; în 36 g apă sunt 4 g și 32 g.',
 exampleEn:'18 g of water contains approximately 2 g hydrogen and 16 g oxygen; 36 g contains 4 g and 32 g.',
 scopeRo:'Se referă la compuși puri cu compoziție determinată; nu descrie amestecurile, ale căror proporții pot varia.',
 scopeEn:'Applies to pure compounds of fixed composition, not mixtures whose ratios can vary.'
 },
 {
 id:'dalton-multiples',group:'composition',type:'law',subject:'chemistry',
 ro:'Legea proporțiilor multiple (Dalton)',en:'Law of multiple proportions (Dalton)',
 formula:'m(O în CO) : m(O în CO₂) = 16 : 32 = 1 : 2, pentru 12 g C',
 explainRo:'Când aceleași două elemente formează mai mulți compuși, masele unuia care se combină cu aceeași masă a celuilalt se află adesea în raporturi de numere întregi mici.',
 explainEn:'When two elements form different compounds, the masses of one combining with a fixed mass of the other are in small whole-number ratios.',
 exampleRo:'Cu 12 g carbon, monoxidul de carbon conține 16 g oxigen, iar dioxidul de carbon 32 g oxigen: raport 1:2.',
 exampleEn:'For 12 g carbon, CO has 16 g oxygen and CO₂ has 32 g oxygen: a 1:2 ratio.',
 scopeRo:'Valabilă pentru comparația compușilor cu formule stoichiometrice bine definite.',
 scopeEn:'Applies to compounds with well-defined stoichiometric formulas.'
 },
 {
 id:'boyle',group:'gas',type:'law',subject:'chemistry',
 ro:'Legea Boyle–Mariotte',en:'Boyle’s law',
 formula:'p₁V₁ = p₂V₂ (T și n constante)',
 explainRo:'La temperatură constantă, volumul unei cantități fixe de gaz ideal este invers proporțional cu presiunea. Când presiunea se dublează, volumul se înjumătățește.',
 explainEn:'At constant temperature, the volume of a fixed amount of ideal gas is inversely proportional to pressure.',
 exampleRo:'La 100 kPa un gaz ocupă 4 L; la 200 kPa ocupă 2 L, dacă temperatura nu se schimbă.',
 exampleEn:'A gas occupies 4 L at 100 kPa and 2 L at 200 kPa when temperature stays the same.',
 scopeRo:'Aproximare pentru gaze care se comportă ideal; la presiuni foarte mari apar abateri.',
 scopeEn:'Ideal-gas approximation; substantial deviations can occur at very high pressures.'
 },
 {
 id:'charles',group:'gas',type:'law',subject:'chemistry',
 ro:'Legea Charles',en:'Charles’s law',
 formula:'V₁/T₁ = V₂/T₂ (p și n constante; T în kelvini)',
 explainRo:'La presiune constantă, volumul unei cantități fixe de gaz ideal este proporțional cu temperatura absolută. Temperatura trebuie transformată în kelvini.',
 explainEn:'At constant pressure, ideal-gas volume is proportional to absolute temperature, expressed in kelvins.',
 exampleRo:'Un gaz de 2 L la 300 K se dilată până la aproximativ 3 L la 450 K, dacă presiunea rămâne constantă.',
 exampleEn:'A 2 L gas sample at 300 K expands to about 3 L at 450 K if pressure stays constant.',
 scopeRo:'Se aplică unei cantități constante de gaz în domeniul aproximării ideale.',
 scopeEn:'Applies to a fixed amount of gas in the range where the ideal-gas model works.'
 },
 {
 id:'gay-lussac',group:'gas',type:'law',subject:'chemistry',
 ro:'Legea Gay-Lussac a presiunii',en:'Gay-Lussac’s pressure law',
 formula:'p₁/T₁ = p₂/T₂ (V și n constante; T în kelvini)',
 explainRo:'Pentru un gaz ideal într-un recipient rigid, presiunea crește proporțional cu temperatura absolută.',
 explainEn:'For ideal gas in a rigid container, pressure increases with absolute temperature.',
 exampleRo:'Un gaz aflat la 100 kPa și 300 K atinge aproximativ 120 kPa la 360 K, cu volum fix.',
 exampleEn:'Gas at 100 kPa and 300 K reaches about 120 kPa at 360 K when volume is fixed.',
 scopeRo:'Valabilă pentru gaz ideal cu volum și cantitate constante; nu confunda temperatura Celsius cu kelvinii.',
 scopeEn:'Requires constant gas amount and volume; Celsius values must not be used directly.'
 },
 {
 id:'avogadro',group:'gas',type:'law',subject:'chemistry',
 ro:'Legea lui Avogadro',en:'Avogadro’s law',
 formula:'V₁/n₁ = V₂/n₂ (T și p constante)',
 explainRo:'La aceeași temperatură și presiune, volumul unui gaz ideal este proporțional cu cantitatea de substanță, în moli. Volume egale de gaze ideale conțin același număr de particule.',
 explainEn:'At equal temperature and pressure, ideal-gas volume is proportional to the amount in moles. Equal gas volumes contain equal numbers of particles.',
 exampleRo:'Dacă 1 mol ocupă 24 L într-un set de condiții, 2 moli din același gaz ocupă 48 L în aceleași condiții.',
 exampleEn:'If 1 mol occupies 24 L under given conditions, 2 mol occupies 48 L at the same conditions.',
 scopeRo:'Comportamentul ideal și condițiile de temperatură și presiune constante sunt esențiale.',
 scopeEn:'Assumes ideal-gas behavior and unchanged temperature and pressure.'
 },
 {
 id:'ideal-gas',group:'gas',type:'law',subject:'chemistry',
 ro:'Ecuația gazului ideal',en:'Ideal gas equation',
 formula:'pV = nRT; R ≈ 8,314 J mol⁻¹ K⁻¹',
 explainRo:'Leagă presiunea, volumul, cantitatea de substanță și temperatura absolută. Dacă p este în pascali, V în metri cubi și T în kelvini, folosim valoarea SI a lui R.',
 explainEn:'Relates gas pressure, volume, amount of substance and absolute temperature. Use consistent SI units with the stated gas constant.',
 exampleRo:'Pentru n=1 mol și T=300 K, produsul pV este aproximativ 2 494 J. La p=100 000 Pa, V≈0,02494 m³ = 24,94 L.',
 exampleEn:'At n=1 mol and T=300 K, pV≈2,494 J. At p=100,000 Pa, V≈0.02494 m³ = 24.94 L.',
 scopeRo:'Model aproximativ pentru gaze reale, mai ales la presiuni mici și temperaturi suficient de mari.',
 scopeEn:'Approximation for real gases, most accurate at relatively low pressures and sufficiently high temperatures.'
 },
 {
 id:'hess',group:'equilibrium',type:'law',subject:'chemistry',
 ro:'Legea lui Hess',en:'Hess’s law',
 formula:'ΔH(reacție) = Σ ΔH(etape)',
 explainRo:'Variația de entalpie a unei reacții depinde doar de starea inițială și finală, nu de traseul intermediar. De aceea pot fi adunate ecuațiile termochimice.',
 explainEn:'Reaction enthalpy depends on initial and final states, not the path taken. Enthalpy changes of intermediate steps can be added.',
 exampleRo:'Dacă transformarea A→B are ΔH=−30 kJ și B→C are ΔH=−20 kJ, atunci A→C are ΔH=−50 kJ.',
 exampleEn:'If A→B releases 30 kJ and B→C releases 20 kJ, the total A→C enthalpy change is −50 kJ.',
 scopeRo:'Compară reacții la stări și condiții termodinamice coerente; entalpia este o funcție de stare.',
 scopeEn:'Requires consistent thermodynamic states and conditions; enthalpy is a state function.'
 },
 {
 id:'le-chatelier',group:'equilibrium',type:'principle',subject:'chemistry',
 ro:'Principiul lui Le Châtelier',en:'Le Châtelier’s principle',
 formula:'Dacă Q < K, evoluția netă favorizează produșii; dacă Q > K, reactanții',
 explainRo:'Un sistem aflat la echilibru chimic răspunde schimbărilor de concentrație, presiune sau temperatură prin deplasarea compoziției către un nou echilibru. Direcția se judecă folosind raportul Q/K.',
 explainEn:'A system at chemical equilibrium responds to a change in concentration, pressure or temperature by shifting to a new equilibrium. The ratio Q/K identifies the net direction.',
 exampleRo:'La sinteza amoniacului, creșterea presiunii favorizează partea cu mai puțini moli de gaz: 2 NH₃ față de N₂ + 3 H₂.',
 exampleEn:'In ammonia synthesis, raising pressure favors the side with fewer gas moles: 2 NH₃ rather than N₂ + 3 H₂.',
 scopeRo:'Regulă de echilibru; un catalizator modifică viteza atingerii echilibrului, nu constanta K.',
 scopeEn:'Equilibrium rule; a catalyst changes the rate of equilibration, not the equilibrium constant.'
 },
 {
 id:'mass-action',group:'equilibrium',type:'law',subject:'chemistry',
 ro:'Legea acțiunii maselor la echilibru',en:'Law of mass action at equilibrium',
 formula:'Kc = [C]^c[D]^d / ([A]^a[B]^b), pentru aA+bB ⇌ cC+dD',
 explainRo:'La o temperatură dată, un raport al activităților chimice ale produșilor și reactanților are valoare constantă la echilibru. Formula cu concentrații este o aproximare folosită pentru soluții ideale.',
 explainEn:'At a given temperature, an activity-based ratio of products to reactants is constant at equilibrium. The concentration expression is an ideal-solution approximation.',
 exampleRo:'Pentru H₂ + I₂ ⇌ 2 HI, Kc≈[HI]²/([H₂][I₂]); la [HI]=0,4 M și [H₂]=[I₂]=0,2 M, Kc≈4.',
 exampleEn:'For H₂ + I₂ ⇌ 2 HI, Kc≈[HI]²/([H₂][I₂]); if [HI]=0.4 M and both reactants are 0.2 M, Kc≈4.',
 scopeRo:'Temperatura trebuie precizată; substanțele solide și lichidele pure sunt tratate prin activități unitare.',
 scopeEn:'Temperature matters; pure solids and liquids have unit activity in standard equilibrium expressions.'
 },
 {
 id:'arrhenius',group:'kinetics',type:'law',subject:'chemistry',
 ro:'Ecuația lui Arrhenius',en:'Arrhenius equation',
 formula:'k = A · exp(−Ea/(RT))',
 explainRo:'Modelul arată că multe reacții au constante de viteză mai mari la temperaturi crescute, deoarece bariera de activare este depășită mai des.',
 explainEn:'For many reactions the rate constant increases with temperature because activation barriers are overcome more frequently.',
 exampleRo:'Dacă temperatura crește, factorul exp(−Ea/RT) crește pentru o energie de activare pozitivă; reacția este de regulă mai rapidă.',
 exampleEn:'Increasing temperature increases exp(−Ea/RT) for positive activation energy, generally speeding up the reaction.',
 scopeRo:'Model empiric util într-un interval de temperatură; A și Ea nu sunt universale și pot varia cu mecanismul.',
 scopeEn:'Useful empirical model over a temperature range; A and Ea depend on the reaction mechanism.'
 },
 {
 id:'beer-lambert',group:'kinetics',type:'law',subject:'chemistry',
 ro:'Legea Beer–Lambert',en:'Beer–Lambert law',
 formula:'A = ε · l · c',
 explainRo:'Absorbanța unei soluții diluate este proporțională cu concentrația substanței absorbante și cu lungimea drumului optic. ε este coeficientul de absorbție molară.',
 explainEn:'In a dilute solution, absorbance is proportional to absorbing-species concentration and optical path length. ε is molar absorptivity.',
 exampleRo:'Cu ε=100 L mol⁻¹ cm⁻¹, l=1 cm și c=0,002 mol/L, absorbanta A=0,2.',
 exampleEn:'With ε=100 L mol⁻¹ cm⁻¹, l=1 cm and c=0.002 mol/L, absorbance A=0.2.',
 scopeRo:'Valabilă aproximativ pentru soluții omogene, suficient de diluate și lumină monocromatică.',
 scopeEn:'Approximately valid for homogeneous dilute solutions measured with monochromatic light.'
 },
 {
 id:'faraday',group:'electrochemistry',type:'law',subject:'chemistry',
 ro:'Legile electrolizei (Faraday)',en:'Faraday’s laws of electrolysis',
 formula:'m = M · I · t / (z · F); F≈96 485 C/mol',
 explainRo:'Masa substanței depuse sau consumate la un electrod depinde de sarcina electrică totală Q=I·t și de numărul z de electroni transferați pe ion.',
 explainEn:'Mass deposited or consumed at an electrode depends on the total charge Q=I·t and the electron transfer number z per ion.',
 exampleRo:'La depunerea Cu²⁺, z=2. Pentru 1 mol Cu sunt necesari aproximativ 2F coulombi, dacă randamentul de curent este 100%.',
 exampleEn:'For Cu²⁺ deposition z=2. Depositing 1 mol of copper requires approximately 2F coulombs at 100% current efficiency.',
 scopeRo:'Presupune randament de curent cunoscut; reacțiile parazite pot reduce depunerea efectivă.',
 scopeEn:'Requires a known current efficiency; side reactions can reduce actual deposition.'
 },
 {
 id:'nernst',group:'electrochemistry',type:'law',subject:'chemistry',
 ro:'Ecuația lui Nernst',en:'Nernst equation',
 formula:'E = E° − (RT/zF) · ln(Q)',
 explainRo:'Potențialul unui electrod sau al unei celule depinde de temperatură și de activitățile speciilor participante, prin raportul de reacție Q.',
 explainEn:'Electrode or cell potential varies with temperature and the activities of participating species through the reaction quotient Q.',
 exampleRo:'La 25 °C, pentru z=1 și Q=10, potențialul diferă de E° cu aproximativ −0,0592 V.',
 exampleEn:'At 25 °C, with z=1 and Q=10, the potential differs from E° by about −0.0592 V.',
 scopeRo:'Concentrațiile sunt o aproximație pentru activități; valoarea E° depinde de reacție și condițiile standard.',
 scopeEn:'Concentrations approximate activities; E° depends on reaction and standard-state conventions.'
 },
 {
 id:'mendeleev',group:'periodic',type:'law',subject:'chemistry',
 ro:'Legea periodicității proprietăților elementelor',en:'Periodic law of the elements',
 formula:'Proprietățile variază periodic în funcție de numărul atomic Z',
 explainRo:'Când elementele sunt ordonate după numărul atomic, configurațiile electronice și multe proprietăți chimice prezintă tipare periodice. Aceasta explică organizarea tabelului periodic modern.',
 explainEn:'When elements are ordered by atomic number, electron configurations and many chemical properties show repeating trends, explaining the modern periodic table.',
 exampleRo:'În grupa 1, Li, Na și K au câte un electron de valență și prezintă asemănări în reacțiile caracteristice metalelor alcaline.',
 exampleEn:'Li, Na and K in group 1 each have one valence electron and show similarities in alkali-metal reactions.',
 scopeRo:'Tendințele au excepții; nu reprezintă o formulă numerică unică pentru toate proprietățile.',
 scopeEn:'Trends include exceptions and do not provide one numerical formula for every property.'
 }
]);
