// University Physics: independently authored RESEARCH AND LAB protocol, not a
// duplicate of the course-theory document and not an accredited university lab.
// For abstract courses, give a reproducible numerical/simulation investigation.
// No dangerous experiment, invented measurement, or generic diagram is implied.
export const UNIVERSITY_PHYSICS_INQUIRY_BANK=Object.freeze({
 units:[
  'Testarea dimensională a unui model', 'Dimensional consistency of a physical model',
  'Alege trei mărimi fizice legate printr-un model al cursului. Exprimă toate unitățile în m, kg și s. Verifică dimensiunea fiecărui termen, apoi încearcă două scări ale sistemului păstrând aceleași raporturi fără unitate.',
  'Choose three measured physical quantities in the current course model. Reduce all units to m, kg and s. Verify both sides of the equation and compare two system scales using dimensionless ratios.',
  'Dimensiunea [F]=kg·m/s²; în raportul Re=ρvL/μ unitățile se reduc la 1. Un rezultat cu unități rămase nu poate fi numărul Reynolds.',
  'A force has units kg·m/s²; in Re=ρvL/μ, all dimensions cancel. A residual unit means the expression cannot be Reynolds number.'
 ],
 kinematics:[
  'Viteză și accelerație din date discrete','Speed and acceleration from discrete observations',
  'Construiește un set de șase perechi timp–poziție generate de un model cunoscut. Calculează viteza pe intervale și accelerația prin diferențe finite. Compară rezultatele cu derivata analitică și arată eroarea produsă de pasul de timp.',
  'Generate six time-position pairs from a stated reference model. Compute interval speeds and finite-difference accelerations. Compare them with analytic derivatives and describe how time step changes error.',
  'Pentru x(t)=2t² m când t este în secunde, viteza exactă este v=4t m/s. O diferență înainte pe un pas Δt=1 s supraestimează viteza instantanee la t=1 s: (x(2)-x(1))/1=6 m/s în loc de 4 m/s.',
  'For x(t)=2t² m with t in seconds, v=4t m/s. A forward difference with Δt=1 s at t=1 s yields 6 m/s rather than the instantaneous 4 m/s.'
 ],
 dynamics:[
  'Modelare dinamică și parametri de frecare','Dynamic model with friction parameters',
  'Simulează un cărucior pe plan orizontal cu forță constantă. Variază separat masa și coeficientul de frecare. Înregistrează accelerația modelată, apoi testează predicția pentru o masă care nu a fost folosită la reglaj.',
  'Simulate a cart driven by constant force on a level surface. Vary mass and friction independently, record modelled acceleration and predict an unseen mass to test the model.',
  'Pentru m=2 kg și o forță rezultantă de 6 N rezultă a=3 m/s². Dacă frecarea necunoscută reduce rezultanta la 4 N, accelerația scade la 2 m/s², nu rămâne 3.',
  'For m=2 kg with 6 N net force a=3 m/s². If friction reduces the net force to 4 N, a falls to 2 m/s².'
 ],
 energy:[
  'Bilanț energetic și randament măsurabil','Energy accounting and measurable efficiency',
  'Alege un sistem cu intrare, ieșire utilă și disipare. Creează un tabel al energiei și verifică dacă suma ieșirilor egalează intrarea în toleranța modelului. Compară două scenarii și calculează randamentul.',
  'Define a device with energy input, useful output and losses. Tabulate energy flows, check the conservation balance and compare efficiencies in two cases.',
  'Dacă intrarea este 200 J, energia utilă 150 J și disiparea 50 J, randamentul este 150/200=75%. Nu se poate afirma un randament de 100% doar pentru că sistemul respectă conservarea energiei.',
  'For 200 J input, 150 J useful and 50 J dissipation, efficiency is 75%. Energy conservation does not imply 100% efficiency.'
 ],
 fluids:[
  'Debit, număr Reynolds și scări ale curgerii','Flow rate, Reynolds number and model scales',
  'Pornește de la un circuit de fluid simulată cu diametru controlabil, fără instalații presurizate. Calculează v=Q/A și Re=ρvD/μ pentru trei diametre. Explică unde încetează să fie valid modelul ideal.',
  'Use a simulated fluid channel with variable diameter and no physical pressure apparatus. Compute v=Q/A and Re=ρvD/μ for three diameters; explain ideal-model limits.',
  'Pentru Q=0,001 m³/s și o secțiune A=0,002 m², viteza medie v=0,5 m/s. Dacă aria scade la jumătate la același debit, viteza se dublează.',
  'For Q=0.001 m³/s and area A=0.002 m², mean speed is 0.5 m/s. At fixed flow rate halving area doubles mean speed.'
 ],
 heat:[
  'Calorimetrie simulată și pierderi de căldură','Simulated calorimetry and heat loss',
  'Modelul pornește de la date calculate pentru două mase de apă la temperaturi inițiale diferite. Prezice temperatura de echilibru în ipoteza adiabatică; apoi adaugă o pierdere de energie și compară.',
  'Use model-generated data for two water samples at different initial temperatures. Predict the adiabatic equilibrium, then add an explicit heat loss and compare results.',
  'Două mase egale de apă la 20 °C și 40 °C ar avea 30 °C la echilibru numai cu capacități termice egale și fără schimb de energie cu mediul.',
  'Equal masses of water at 20 °C and 40 °C reach 30 °C only under matching heat capacities and zero heat transfer to surroundings.'
 ],
 electric:[
  'Caracteristică tensiune–curent și rezistență','Current-voltage characteristic and resistance',
  'Construiește o fișă de date simulate pentru un rezistor la tensiuni de baterie foarte mici. Reprezintă I(U), calculează panta și estimează rezistența. Nu utiliza niciodată tensiune de rețea.',
  'Create a simulated data table for a resistor driven by a very low-voltage battery. Plot I(U), find the slope and estimate resistance. Never connect to mains.',
  'Pentru R=100 Ω și U=3 V, I=0,03 A. Dublarea tensiunii într-un model ohmic produce 0,06 A; încălzirea poate invalida legea liniară în realitate.',
  'With R=100 Ω and U=3 V, I=0.03 A. Doubling voltage predicts 0.06 A in the ohmic model; heating can violate this approximation.'
 ],
 circuits:[
  'Sistem de ecuații Kirchhoff pentru două ochiuri','Two-loop Kirchhoff equation model',
  'Desenează un circuit de baterie cu două ochiuri și rezistențe finite, apoi scrie ecuațiile Kirchhoff independent de rezolvarea numerică. Verifică bilanțul de puteri la soluție și repetă pentru o ramură schimbată.',
  'Draw a two-loop, low-voltage resistor network. Derive independent Kirchhoff equations before solving currents. Check a power balance and repeat after modifying one branch.',
  'Pentru doi rezistori de 100 Ω în serie la 3 V, I=3/200=0,015 A. Pentru două ramuri de 100 Ω în paralel, fiecare are 0,03 A și sursa furnizează 0,06 A.',
  'With two 100 Ω resistors in series at 3 V, I=0.015 A. In parallel each branch takes 0.03 A and the source supplies 0.06 A.'
 ],
 waves:[
  'Spectru de frecvențe dintr-o oscilație modelată','Frequency analysis of a model oscillation',
  'Generează o undă sinusoidală cu frecvență cunoscută și zece eșantioane la intervale fixe. Compară perioada măsurată cu cea nominală. Adaugă un al doilea semnal și explică apariția a două componente în spectru.',
  'Generate a sinusoid with a declared frequency and ten equally spaced time samples. Estimate its period; superpose a second sinusoid and explain how both frequencies appear in a spectrum.',
  'O oscilație de 5 Hz are T=1/5 s=0,2 s. Dacă prelevarea datelor este prea rară, se poate interpreta greșit frecvența prin aliasing.',
  'A 5 Hz oscillation has period 0.2 s. Too slow a sampling rate can produce aliasing and an incorrect apparent frequency.'
 ],
 optics:[
  'Parametri ai lentilei în optică geometrică','Geometric optics lens parameters',
  'Folosește o diagramă construită cu raze sigure, fără laser. Testează poziții ale obiectului într-un model de lentilă subțire și calculează poziția imaginii, apoi discută aberațiile și condițiile paraxiale.',
  'Use a ray diagram, not a laser. Vary object distance in a thin-lens model, calculate image distance and discuss paraxial limits and aberration.',
  'Pentru f=0,1 m și obiect la 0,2 m, relația 1/f=1/u+1/v dă v=0,2 m. Acest rezultat nu descrie o lentilă foarte groasă fără corecții.',
  'For f=0.1 m and object distance 0.2 m, the thin-lens formula predicts image distance 0.2 m under paraxial assumptions.'
 ],
 electromagnetism:[
  'Flux magnetic și inducție simulată','Simulated flux and induction',
  'Variază într-o simulare simplă fluxul magnetic printr-o bobină în timp, folosind un tabel cu valori și unități. Calculează emf≈−ΔΦ/Δt pentru două intervale, discutând semnul din legea lui Lenz.',
  'Vary magnetic flux through a simulated coil and tabulate values with units. Compute emf≈−ΔΦ/Δt on two intervals, interpreting the Lenz-law sign.',
  'O variație ΔΦ=0,02 Wb în 0,1 s produce emf de modul 0,2 V pentru o singură spiră, cu semn opus variației conform convenției.',
  'A flux change of 0.02 Wb in 0.1 s produces 0.2 V magnitude for one turn; the sign opposes the chosen flux increase.'
 ],
 thermodynamics:[
  'Proces termodinamic și convenție de semne','Thermodynamic process and sign convention',
  'Compară un proces izocor cu unul izobar într-o simulare de gaz ideal. Marchează în diagrama p–V traseul și calculează lucrul mecanic W=∫p dV, definind sensul pozitiv înainte de calcule.',
  'Compare ideal-gas constant-volume and constant-pressure processes in a simulation. Sketch paths on p–V axes and evaluate W=∫p dV after declaring sign convention.',
  'În procesul izocor V=constant și W=0. Pentru expansiune izobară la p=100 kPa cu ΔV=0,001 m³, lucrul efectuat de gaz este 100 J.',
  'For a constant-volume process W=0; at constant 100 kPa pressure with ΔV=0.001 m³, work done by the gas is 100 J.'
 ],
 modern:[
  'Date spectrale și nivele energetice discrete','Spectrum lines and discrete energy levels',
  'Alege două tranziții între nivele energetice modelate și calculează frecvența asociată fiecărui foton cu E=hf. Compară rezultatele cu o scară de frecvență; nu pretinde observații experimentale nereale.',
  'Choose two hypothetical energy-level transitions and calculate photon frequencies using E=hf. Compare relative positions without inventing observed spectral data.',
  'Pentru E=6,626×10⁻³⁴ J, f=1 Hz; aceasta este doar o verificare dimensională. Tranziții optice reale au energii și frecvențe mult mai mari.',
  'For E=6.626×10⁻³⁴ J, f=1 Hz as a dimension check. Real optical electronic transitions require vastly larger energies and frequencies.'
 ],
 measurement:[
  'Analiză de incertitudine și reziduuri','Uncertainty and residual analysis',
  'Construiește cinci observații simulate ale aceleiași mărimi. Calculează media, abaterea standard aproximativă, apoi un reziduu față de modelul liniar. Declară metoda de generare pentru a nu prezenta datele fictive drept experimente reale.',
  'Generate five declared simulated readings. Compute the mean, approximate standard deviation and residuals relative to a linear model. Document generation so synthetic data is not mistaken for experiment.',
  'Pentru măsurători 4,9, 5,0, 5,1, media este 5,0. Reziduul față de predicția 4,8 la o observație de 5,1 este +0,3 în aceleași unități.',
  'For 4.9, 5.0 and 5.1 the mean is 5.0. The residual of observed 5.1 relative to model 4.8 is +0.3 in the same units.'
 ],
 'special-quantum':[
  'Particulă în cutie și condiții la limită','Particle-in-a-box boundary conditions',
  'Rezolvă numeric primele trei energii Eₙ=n²h²/(8mL²) pentru un electron într-o cutie ideală de lățime L, păstrând J și eV distincte. Modifică L și compară cum se schimbă diferențele de nivel; modelul nu reprezintă un dispozitiv real fără potențial finit.',
  'Compute the first three Eₙ=n²h²/(8mL²) energies for an electron in an ideal box. Convert between joules and electronvolts explicitly, then vary L to assess the ideal-boundary approximation.',
  'Pentru același electron, când L se dublează, toate Eₙ se reduc la un sfert. Raporturile dintre nivele rămân n².',
  'Doubling L reduces every level energy by a factor of four; level ratios remain n².'
 ],
 'special-relativity':[
  'Diluarea temporală ca model de date','Time dilation from modelled data',
  'Calculează factorul Lorentz γ=1/√(1−v²/c²) pentru viteze 0,2c, 0,6c și 0,9c. Verifică numeric limita când v este mic și explică de ce modelul nu este o măsurătoare proprie.',
  'Calculate γ=1/√(1−v²/c²) at 0.2c, 0.6c and 0.9c, check the low-speed limit and distinguish model results from empirical timing measurements.',
  'La v=0,6c, γ=1/0,8=1,25. Timpul propriu Δτ=8 s corespunde Δt=10 s în cadrul dat.',
  'At v=0.6c, γ=1.25. A proper interval of 8 s corresponds to 10 s in the specified frame.'
 ],
 'special-theory':[
  'Condiții la limită pentru o ecuație de undă','Boundary conditions for a wave equation',
  'Rezolvă un mod de oscilație al unei corzi ideale fixe la ambele capete, cu L cunoscut. Confirmă forma modurilor normale și frecvențele, apoi discută cum amortizarea ar schimba ipotezele.',
  'Solve a normal mode of an ideal string fixed at both ends. Derive permitted wavelengths and frequencies, then explain which model assumptions damping violates.',
  'Pentru L=1 m și v=100 m/s, modul fundamental are λ=2L=2 m și f=50 Hz.',
  'For L=1 m and wave speed 100 m/s, the fundamental has wavelength 2 m and frequency 50 Hz.'
 ],
 'special-condensed':[
  'Conductivitate versus temperatură într-un model de material','Conductivity versus temperature in a material model',
  'Simulează conductivitatea unui semiconductor pentru trei temperaturi, folosind o dependență funcțională declarată. Plotează log σ în raport cu 1/T și interpretează panta; nu pretinde date colectate din probe reale.',
  'Simulate semiconductor conductivity for three temperatures under a stated model. Plot log σ against reciprocal temperature and interpret the slope without presenting synthetic values as measured.',
  'Pentru σ=A exp(−Eₐ/kT), panta graficului lnσ față de 1/T este −Eₐ/k, numai dacă modelul Arrhenius e valabil.',
  'For σ=A exp(−Eₐ/kT), the gradient of lnσ against 1/T is −Eₐ/k under the Arrhenius assumption.'
 ],
 'special-nuclear':[
  'Simulare statistică a înjumătățirii','Statistical half-life simulation',
  'Simulează o mie de nuclee ca entități abstracte. La fiecare pas aplică aceeași probabilitate de supraviețuire, apoi compară cu N(t)=N₀e^(−λt). Nu folosi surse radioactive sau substanțe periculoase.',
  'Simulate 1000 abstract nuclei under a fixed decay probability per time step. Compare surviving counts with N(t)=N₀e^(−λt); use no radioactive materials.',
  'Dacă probabilitatea de supraviețuire după o perioadă este 0,5, valoarea așteptată după două perioade este 250 din 1000, dar realizările individuale variază statistic.',
  'If survival probability is 0.5 per half-life, expected survivors after two intervals are 250 of 1000; realised trials fluctuate.'
 ],
 'special-astro':[
  'Orbita exoplanetei și propagarea incertitudinii','Exoplanet orbit and uncertainty propagation',
  'Pornește de la o perioadă orbitală și masa stelei simulate, apoi estimează semiaxa mare din legea a treia a lui Kepler. Variază masa cu ±5% și descrie cum se modifică rezultatul și limitele aproximației cu două corpuri.',
  'Use declared simulated orbital period and stellar mass to estimate semi-major axis from Kepler’s third law. Perturb mass by ±5% and discuss propagation and two-body limitations.',
  'În unități solare și ani pentru masă 1 M☉, P=1 an dă aproximativ a=1 UA. Formula simplificată nu se aplică direct oricărui sistem multiplu.',
  'For a 1-solar-mass star and period one year, the simple Kepler estimate is about one astronomical unit.'
 ],
 'special-applied':[
  'Calibrare de senzori și verificare a liniarității','Sensor calibration and linearity',
  'Generează cinci perechi valoare adevărată–citire de senzor, ajustează o dreaptă și calculează reziduurile. Păstrează un punct pentru testare independentă; nu folosi același set pentru antrenare și validare.',
  'Generate five true-value/sensor-reading pairs, fit a line and compute residuals. Reserve one independent test point rather than measuring model quality on its fitting data.',
  'Dacă senzorul indică y=1,02x+0,1, pentru x=10 modelul prezice 10,3 unități. Reziduul este citirea reală minus 10,3.',
  'If calibration is y=1.02x+0.1, at x=10 the model predicts 10.3 units; the residual is observed minus predicted.'
 ]
});
export function physicsUniversityIndependentInvestigation({country='',year=1,courseId='',topic='',courseName='',language='ro',specialty=''}={}){
 const key=String(topic||'').toLowerCase();
 const protocol=UNIVERSITY_PHYSICS_INQUIRY_BANK[key]||null;
 if(!protocol)return null; // Never show an unrelated fallback laboratory.
 const ro=language==='ro',title=protocol[ro?0:1],method=protocol[ro?2:3],example=protocol[ro?4:5];
 const n=Math.max(1,Math.min(5,Number(year)||1));
 const labels=ro?[
  'Investigație originală independentă','Scop și ipoteză','Metoda reproductibilă','Controlul variabilelor',
  'Exemplu calculat (nu date măsurate)','Caiet de date și incertitudine',
  'Sarcină de analiză și evaluare','Răspuns de referință','Siguranță și limitări']:
  ['Independent original investigation','Aim and hypothesis','Reproducible procedure','Controlling variables',
   'Worked model example (not measured data)','Data sheet and uncertainty',
   'Analysis and evaluation task','Reference answer','Safety and limitations'];
 const aim=ro?
  'Aplică noțiunile cursului «'+String(courseName||topic)+'» printr-un protocol care poate fi verificat. Formulează o ipoteză cu mărimi fizice, unități și domeniu de valabilitate.':
  'Apply the course “'+String(courseName||topic)+'” in a reproducible investigation. State a hypothesis with physical quantities, units and its domain of validity.';
 const controls=ro?
  'Modifică o singură variabilă independentă; declară ce păstrezi constant. Dacă folosești simulare, identifică ecuațiile de generare și valoarea parametrilor; nu descrie date simulate drept măsurători efective.':
  'Change one independent variable and document the controls. For simulated data name the generating equations and parameters; never present simulation output as measured readings.';
 const data=ro?
  'Construiește un tabel cu minimum cinci rânduri. Coloane: variabila independentă și unitatea sa, mărimea calculată sau măsurată și unitatea sa, incertitudine sau rezoluție, diferența față de predicția modelului. Include un grafic numai dacă axele și variabilele sunt justificate.':
  'Prepare a table with at least five rows: independent quantity and unit, observed or modelled quantity and unit, uncertainty or resolution, residual against prediction. Include a graph only when the axes and model are justified.';
 const assessment=ro?
  'Pentru cursul «'+String(courseName||topic)+'», identifică două ipoteze, recalculează exemplul în unități SI, estimează o eroare și explică în ce situație modelul poate eșua. Adaugă o comparație între predicție și una dintre cele cinci observații simulate sau reale declarate.':
  'For “'+String(courseName||topic)+'”, identify two assumptions, recompute the worked example using SI units, estimate an uncertainty and name a model failure. Compare a prediction with one of five explicitly simulated or actually observed results.';
 const answer=ro?
  'Se acceptă numai explicații cu unități corecte, formule definite, sursa datelor declarată, un calcul reproductibil, cel puțin o limitare fizică și concluzie care nu depășește dovezile.':
  'A valid answer needs consistent units, defined equations, an explicit origin for the data, a reproducible calculation, one model limitation and evidence-bounded conclusions.';
 const safety=ro?
  'Nu utiliza rețeaua electrică, radiații ionizante, instalații presurizate, lasere puternice sau surse fierbinți. Dacă nu ai echipament adecvat, această investigație este un model analitic sau simulare, nu un experiment efectuat.':
  'Do not use mains electricity, ionising radiation, pressure rigs, high-power lasers or hot sources. Without approved equipment this activity is an analytic or simulated investigation, not a performed physical experiment.';
 const blocks=[
  '# '+labels[0]+' · '+title,'# '+String(courseName||topic),
  (ro?'Țară / jurisdicție: ':'Country / jurisdiction: ')+String(country)+
   (ro?' · An universitar orientativ: ':' · Advisory university year: ')+n+
   (specialty?' · '+String(specialty):''),
  '# '+labels[1],aim,
  '# '+labels[2],method,
  '# '+labels[3],controls,
  '# '+labels[4],example,
  '# '+labels[5],data,
  '# '+labels[6],assessment,
  '# '+labels[7],answer,
  '# '+labels[8],safety
 ];
 return {title,body:blocks.join('\n\n'),review:{prompt:assessment,guide:answer},
  id:'uni-physics-investigation-'+String(country)+'-'+String(courseId)+'-'+n,
  source:'independent-physics-study-protocol',nationallyAccredited:false};
}
