// Topic- AND lesson-specific original university visual models.
// No global shared eight-diagram gallery: each lesson has its own grounded diagram.
export const PHYSICS_UNIVERSITY_GRAPH_SPECS={"units":[["line","v (m/s)","Re","În condiții de fluid și geometrie fixe, Re crește cu viteza.","For fixed fluid properties and geometry, Reynolds number rises with speed."],["bell","valoare măsurată","distribuție","Lățimea distribuției ilustrează incertitudinea, nu o măsurătoare reală.","Distribution width illustrates uncertainty, not collected data."]],"kinematics":[["parabola","x (m)","y (m)","Traiectorie ilustrativă parabolică obținută dintr-o mișcare cu accelerație constantă.","Illustrative parabolic trajectory under constant acceleration."],["circle","x","y","Viteza este tangentă cercului, accelerația centripetă indică spre centru.","Velocity is tangent; centripetal acceleration points inward."]],"dynamics":[["damped","t (s)","x (m)","Oscilație amortizată: amplitudinea scade în timp.","Damped oscillation: amplitude decreases with time."],["line","τ (N·m)","α (rad/s²)","La moment de inerție constant, accelerația unghiulară este proporțională cu momentul rezultant.","At fixed moment of inertia, angular acceleration is proportional to net torque."]],"energy":[["cup","x (m)","U (J)","Un potențial de tip elastic are minimum stabil în apropierea originii.","An elastic-like potential has a stable minimum near the origin."],["parabola","v (m/s)","K (J)","Energia cinetică crește cu pătratul vitezei la masă constantă.","Kinetic energy scales with speed squared at fixed mass."]],"fluids":[["pipe","lungime x","diametru","Secțiunea care se îngustează crește viteza medie într-un fluid incompresibil.","Narrowing cross-section increases average speed for incompressible flow."],["quartic","raza r","debit Q","Pentru curgere laminară în tub, debitul crește cu r la puterea a patra.","In laminar pipe flow, rate scales with the fourth power of radius."]],"heat":[["line-down","poziție x","T (K)","Profil termic linear aproximativ într-o placă uniformă în regim staționar.","Approximate linear steady-state temperature profile across a uniform slab."],["line","T (K)","Q (J)","La capacitate calorică constantă, energia primită crește liniar cu temperatura.","At constant heat capacity, heat required increases linearly with temperature."]],"electric":[["exp-up","t / RC","U_C / U₀","Încărcarea RC pornește de la zero și se apropie asimptotic de tensiunea sursei.","RC charging rises from zero toward the supply voltage."],["parabola","U (V)","E (J)","La capacitate constantă, energia stocată crește cu pătratul tensiunii.","At fixed capacitance, stored energy grows with voltage squared."]],"waves":[["sin","x / λ","y / A","Profil sinusoidal de undă, pentru o fază fixă în timp.","Sinusoidal spatial wave profile at one moment in time."],["wave-pair","x / λ","y₁+y₂","Două unde apropiate în frecvență produc o anvelopă de interferență.","Two nearby frequencies produce an interference envelope."]],"optics":[["cos2","poziție pe ecran","intensitate","Maxime și minime ideale în modelul de interferență cu două fante.","Ideal double-slit interference fringes."],["bell","unghi θ","intensitate","Model schematic al maximului central de difracție; lățimea depinde de apertură.","Schematic central diffraction peak; width depends on aperture."]],"electromagnetism":[["circle","x","y","Forța magnetică perpendiculară pe viteză poate curba traiectoria unei sarcini.","Magnetic force perpendicular to velocity can curve a charged particle trajectory."],["pulse","t (s)","ε (V)","Variația de flux în timp produce un impuls de tensiune electromotoare.","Changing magnetic flux produces an induced emf pulse."]],"thermodynamics":[["line","Q_rev (J)","S (J/K)","La temperatură constantă, variația entropiei este proporțională cu căldura reversibilă.","At constant temperature, entropy change is proportional to reversible heat."],["hyperbola","V","p","Adiabata ideală este mai abruptă decât o izotermă pentru γ mai mare de unu.","Ideal-gas adiabat is steeper than an isotherm for γ greater than one."]],"circuits":[["cup","f / f₀","|Z|","Impedanța RLC serie atinge minimum la rezonanță în modelul ideal.","Series RLC impedance reaches its minimum at resonance."],["peak","f / f₀","|I|","Curentul RLC serie prezintă un maxim de rezonanță la excitație sinusoidală.","Series RLC current peaks at resonance under sinusoidal excitation."]],"modern":[["threshold","f / f₀","K_max","Energia cinetică a fotoelectronilor crește liniar deasupra frecvenței de prag.","Photoelectron maximum kinetic energy grows linearly above threshold frequency."],["hyperbola","impuls p","λ","Lungimea de undă de Broglie este invers proporțională cu impulsul.","De Broglie wavelength is inversely proportional to momentum."]],"measurement":[["scatter","t (s)","x (m)","Date exemplificative distincte și o dreaptă de regresie; nu sunt măsurători reale.","Illustrative data points and fitted line; no real measurements."],["hyperbola","n citiri","u_medie","Pentru măsurători independente, incertitudinea mediei scade aproximativ ca 1/√n.","For independent readings, mean uncertainty falls approximately as 1/√n."]],"special-quantum":[["hyperbola","p","λ","Lungimea de undă invers proporțională cu impulsul.","Wavelength inversely proportional to momentum."],["well","x / L","|ψ|²","Probabilitatea în starea fundamentală a unui puț infinit unidimensional.","Ground-state probability in a one-dimensional infinite well."],["hyperbola","Δx","Δp","Limita de incertitudine descrește când acceptăm o incertitudine de poziție mai mare.","Minimum momentum spread falls as allowed position spread increases."],["threshold","f","K_max","Emisia fotoelectrică apare doar peste pragul energetic al materialului.","Photoelectric emission begins above the material threshold."]],"special-relativity":[["gamma","v / c","γ","Factorul Lorentz crește pronunțat când viteza se apropie de c.","Lorentz factor rises steeply as speed approaches c."],["gamma","v / c","Δt / Δτ","Dilatarea timpului pentru un ceas în mișcare.","Time dilation of a moving clock."],["line","m (kg)","E₀ (J)","Energia de repaus este proporțională cu masa de repaus.","Rest energy scales linearly with rest mass."],["line","ΔΦ","Δf / f","Deplasarea relativă de frecvență în aproximația câmpului slab.","Weak-field fractional frequency shift versus gravitational potential difference."]],"special-theory":[["line","L²/T²","v²","Analiza dimensională cere aceeași structură de unități în ambele membre.","Dimensional analysis requires matching dimensions on each side."],["cup","q","V(q)","Potențial stabil și poziție de echilibru pentru un model lagrangian.","Stable potential and equilibrium in a Lagrangian model."],["sin","t","x(t)","Oscilație armonică ideală fără amortizare.","Ideal undamped harmonic oscillation."],["wave-pair","x","f₀ + εf₁","Perturbația mică modifică ușor forma unei soluții de bază.","Small perturbation modifies a baseline solution."]],"special-condensed":[["lattice","poziție x","poziție y","Celulă cristalină schematică: punctele indică noduri ale rețelei.","Schematic crystal lattice points."],["bands","E","stări","Interval interzis între banda de valență și cea de conducție.","Energy gap between valence and conduction bands."],["sigmoid","(E−μ)/kT","f(E)","Distribuție Fermi–Dirac la temperatură nenulă.","Fermi–Dirac occupation at nonzero temperature."],["sin","k","ω(k)","Relație schematică de dispersie pentru un mod colectiv.","Schematic collective-mode dispersion relation."]],"special-nuclear":[["exp-down","t","N/N₀","Populația medie de nuclee nedecăzute scade exponențial.","Average undecayed-nucleus population decreases exponentially."],["exp-down","t","A/A₀","Activitatea scade odată cu numărul de nuclee încă nedecăzute.","Activity falls with remaining undecayed nuclei."],["line","Δm","E_leg","Energia de legătură este proporțională cu defectul de masă.","Binding energy scales with mass defect."],["bars","înainte","după","Numerele de masă și sarcinile totale se păstrează în reacțiile admise.","Total mass number and nuclear charge are conserved."]],"special-astro":[["hyperbola","paralaxa p","d","Distanța stelară este invers proporțională cu paralaxa anuală mică.","Stellar distance is inversely proportional to small annual parallax."],["sqrt","semiaxa a","perioadă T","Perioada crește cu puterea 3/2 a semiaxei într-o orbită kepleriană.","Period scales with semimajor axis to the 3/2 power in Keplerian motion."],["inverse-square","distanță d","flux F","Fluxul observat scade cu pătratul distanței pentru emisie izotropă.","Observed flux decreases with squared distance for isotropic emission."],["hyperbola","T (K)","λ_max","Lungimea de undă a maximului spectral scade odată cu temperatura.","Peak wavelength falls as temperature rises."]],"special-applied":[["scatter","valoare x","ieșire f","Sensibilitate și răspândirea incertitudinilor, reprezentare schematică.","Sensitivity and uncertainty propagation, schematic plot."],["exp-up","t / RC","U / U₀","Răspunsul RC la o comandă treaptă.","RC step response."],["sampled","t (s)","semnal","Eșantioane discrete ale unui semnal continuu.","Discrete samples of a continuous signal."],["exp-down","t","|eroare|","Un răspuns de reglare stabil poate reduce eroarea în timp.","A stable feedback response can reduce error over time."]]};
export function physicsUniversityDiagramSpec(topic,index){
 return PHYSICS_UNIVERSITY_GRAPH_SPECS[String(topic||'')]?.[Number(index)]||null;
}
export function physicsUniversityVisualBuild(topic,index,language='ro',lessonTitle=''){
 const data=physicsUniversityDiagramSpec(topic,index);
 if(!data)return null;
 const [shape,xLabel,yLabel,captionRo,captionEn]=data,ro=language==='ro';
 const section=document.createElement('section');section.className='physics-visual physics-university-visual';
 const heading=document.createElement('h3');heading.textContent=lessonTitle||String(topic);
 section.append(heading);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 360 218');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',heading.textContent+' — '+(ro?captionRo:captionEn));
 section.append(svg);
 const el=(tag,props={},value)=>{
  const node=document.createElementNS(ns,tag);
  for(const [key,val] of Object.entries(props))node.setAttribute(key,String(val));
  if(value!==undefined)node.textContent=String(value);
  svg.append(node);return node;
 };
 const text=(x,y,s)=>el('text',{x,y,fill:'#ecf2fc','font-size':12},s);
 const line=(x1,y1,x2,y2,color='#8fc8de',w=2)=>el('line',{x1,y1,x2,y2,stroke:color,'stroke-width':w,'stroke-linecap':'round'});
 const path=(d,color='#e7b762',width=3)=>el('path',{d,stroke:color,fill:'none','stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'});
 const axes=()=>{
  line(34,179,336,179);line(34,179,34,24);
  text(210,207,xLabel);text(7,18,yLabel);
 };
 function plot(fn,stroke='#ebc175',opacity=1){
  let d='';
  for(let i=0;i<=180;i++){
   const u=i/180,v=Math.min(1,Math.max(0,Number(fn(u))||0));
   d+=(i?' L':'M')+(34+u*290).toFixed(1)+' '+(178-v*145).toFixed(1);
  }
  const p=path(d,stroke,3);p.setAttribute('opacity',opacity);return p;
 }
 const functions={
  line:u=>0.06+0.85*u,
  'line-down':u=>0.92-0.8*u,
  parabola:u=>0.06+0.86*u*u,
  cup:u=>0.13+0.83*Math.pow(2*u-1,2),
  quartic:u=>0.06+0.88*Math.pow(u,4),
  sqrt:u=>0.06+0.85*Math.pow(u,1.5),
  'exp-up':u=>0.92*(1-Math.exp(-4*u)),
  'exp-down':u=>0.92*Math.exp(-4*u),
  hyperbola:u=>0.92/(1+8*u),
  'inverse-square':u=>0.92/Math.pow(1+4*u,2),
  bell:u=>0.95*Math.exp(-Math.pow((u-0.5)/0.145,2)),
  sin:u=>0.50+0.37*Math.sin(4*Math.PI*u),
  damped:u=>0.50+0.43*Math.exp(-2.9*u)*Math.cos(11*Math.PI*u),
  sigmoid:u=>0.92/(1+Math.exp(18*(u-0.5))),
  peak:u=>0.92/(1+Math.pow((u-0.52)/0.125,2)),
  cos2:u=>0.07+0.83*Math.pow(Math.cos(12*Math.PI*u),2)*Math.exp(-Math.pow((u-0.5)/0.43,2)),
  threshold:u=>Math.max(0,(u-0.27)/0.73)*0.9,
  gamma:u=>Math.min(0.97,(1/Math.sqrt(1-Math.pow(0.94*u,2))-1)/1.9),
  'wave-pair':u=>0.5+0.19*Math.sin(13*Math.PI*u)+0.19*Math.sin(14*Math.PI*u),
  pulse:u=>(u>0.27&&u<0.56?0.84:0.18),
  well:u=>0.88*Math.pow(Math.sin(Math.PI*u),2)
 };
 if(shape==='circle'){
  el('circle',{cx:180,cy:103,r:67,fill:'none',stroke:'#99bedb','stroke-width':2});
  el('circle',{cx:242,cy:78,r:6,fill:'#e3b76b'});
  line(242,78,195,103,'#e28b91',3);
  line(242,78,224,35,'#86e8d8',3);
  text(185,111,ro?'centru':'centre');text(216,27,'v');text(207,80,'a');
  text(20,208,ro?'Traiectorie circulară · schematic':'Circular trajectory · schematic');
 }else if(shape==='pipe'){
  path('M26 51 L119 51 L213 83 L336 83','#b6d9ef',3);
  path('M26 157 L119 157 L213 125 L336 125','#b6d9ef',3);
  for(const y of [82,103,125]){
   path('M38 '+y+' L115 '+y+' L222 '+(103+(y-103)*0.43)+' L317 '+(103+(y-103)*0.43),'#e8be77',2);
  }
  text(36,38,'A₁');text(286,74,'A₂');text(170,201,'A₁v₁ = A₂v₂');
 }else if(shape==='lattice'){
  for(let row=0;row<4;row++)for(let col=0;col<6;col++)
   el('circle',{cx:64+col*42,cy:40+row*40,r:7,fill:(row+col)%2?'#82c6df':'#e6c080'});
  text(45,208,ro?'Noduri cristaline · celulă schematică':'Crystal lattice nodes · schematic cell');
 }else if(shape==='bands'){
  for(let k=0;k<4;k++){line(59,47+k*12,304,47+k*12,'#8bdbb7',3);line(59,135+k*12,304,135+k*12,'#d7b9ef',3)}
  line(180,95,180,135,'#f0c57c',2);
  text(195,116,'E_g');text(53,25,ro?'Bandă conducție':'Conduction band');text(54,196,ro?'Bandă valență':'Valence band');
 }else if(shape==='bars'){
  axes();
  for(const [x,y,h] of [[77,66,113],[135,66,113],[219,66,113],[277,66,113]])el('rect',{x,y,width:27,height:h,fill:x<190?'#84c9de':'#d8b884'});
  text(53,201,ro?'înainte':'before');text(238,201,ro?'după':'after');
 }else if(shape==='sampled'){
  axes();plot(u=>0.5+0.32*Math.sin(8*Math.PI*u),'#90bbce',0.6);
  for(let n=0;n<=12;n++){const u=n/12,v=0.5+0.32*Math.sin(8*Math.PI*u);
   el('circle',{cx:34+u*290,cy:178-v*145,r:4,fill:'#f5c56a'})}
 }else if(shape==='scatter'){
  axes();plot(u=>0.18+0.65*u,'#9cd9c7');
  for(let k=0;k<9;k++){const u=(k+1)/11;
   const v=0.18+0.65*u+0.055*Math.sin(k*3.1);
   el('circle',{cx:34+u*290,cy:178-v*145,r:4,fill:'#e4c275'})}
 }else{
  axes();plot(functions[shape]||functions.line);
  if(shape==='wave-pair')plot(u=>0.5+0.34*Math.cos(0.5*Math.PI*u)*Math.sin(13.5*Math.PI*u),'#94d5b9',0.5);
 }
 const note=document.createElement('small');note.className='physics-visual-note';
 note.textContent=(ro?captionRo:captionEn)+' '+(ro?'Diagramă didactică, nu date experimentale.':'Educational model, not experimental data.');
 section.append(note);return section;
}
