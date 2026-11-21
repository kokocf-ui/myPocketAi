// Topic-specific chemical teaching diagrams. Schematics are not experimental data.
// Only call for a topic/year mapping in chemistryVisualizationFor.
export function chemistryContextVisualBuild(kind){
 const titles={
  separation:['Separarea unui amestec','Separating a mixture'],
  solubility:['Solubilitate și temperatură','Solubility and temperature'],
  stoichiometry:['Bilanțul atomilor','Atom balance in a reaction'],
  concentration:['Diluție și concentrație','Dilution and concentration'],
  'energy-profile':['Profilul energetic al reacției','Reaction energy profile'],
  cell:['Pilă galvanică Zn/Cu','Zn/Cu galvanic cell'],
  calibration:['Calibrare spectrofotometrică','Spectrophotometric calibration'],
  enzyme:['Saturația enzimatică','Enzyme saturation'],
  equilibrium:['Energia liberă și echilibrul','Gibbs energy and equilibrium']
 };
 if(!titles[kind])return null;
 const root=document.createElement('section');root.className='chem-visual chemistry-course-visual';
 const heading=document.createElement('h3');heading.textContent=learningLabel(...titles[kind]);root.append(heading);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 360 224');
 svg.setAttribute('role','img');svg.setAttribute('aria-label',heading.textContent);
 const el=(tag,attrs={},value=null)=>{
  const n=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));
  if(value!==null)n.textContent=String(value);
  svg.append(n);return n;
 };
 const line=(x1,y1,x2,y2,c='#cbe9f1',w=2)=>el('line',{x1,y1,x2,y2,stroke:c,'stroke-width':w});
 const t=(x,y,label,size=12)=>el('text',{x,y,fill:'#e6f9ff','font-size':size},label);
 const rect=(x,y,w,h,c='#22546d')=>el('rect',{x,y,width:w,height:h,rx:7,fill:c,stroke:'#83bdca'});
 const path=(d,c='#8fe6cb',w=3)=>el('path',{d,fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round'});
 const axes=(xl,yl)=>{line(42,178,330,178);line(42,178,42,24);t(273,206,xl);t(7,18,yl)};
 let commentRo='',commentEn='';
 if(kind==='separation'){
  rect(17,62,92,81);rect(133,62,92,81);rect(250,62,92,81);
  t(25,88,'Amestec',13);t(26,110,'nisip+apă',11);t(137,89,'Filtrare',13);t(141,112,'filtru',11);
  t(259,89,'Reziduul',12);t(259,108,'+ filtratul',11);
  path('M110 101 H130 M226 101 H247','#f8cf81',2);
  t(28,177,'Amestec ≠ compus');
  commentRo='Filtrarea separă componentele unui amestec pe baza dimensiunii particulelor; nu descompune o substanță chimică.';
  commentEn='Filtration separates mixture components according to particle behaviour; it does not break chemical compounds.';
 }else if(kind==='solubility'){
  axes('T (°C)','g / 100 g');
  path('M58 157 C115 153 184 126 304 62','#f6d78f',3);
  t(105,59,'Model: solid solubil',12);t(74,202,'Temperatură →');
  commentRo='Curbă calitativă pentru un exemplu ipotetic; solubilitatea nu crește obligatoriu cu temperatura pentru toate substanțele. Nu sunt date măsurate.';
  commentEn='Illustrative hypothetical curve only. Solubility does not necessarily rise with temperature for every substance. No measured data.';
 }else if(kind==='stoichiometry'){
  rect(14,50,131,118);rect(221,50,125,118);
  t(22,73,'2 H₂  +  O₂',15);t(239,75,'2 H₂O',17);
  t(28,104,'H: 4',14);t(28,126,'O: 2',14);
  t(237,104,'H: 4',14);t(237,126,'O: 2',14);
  path('M147 109 H213','#efcf84',3);t(164,101,'→',24);
  t(33,194,'Atomii se conservă, legăturile se schimbă.',11);
  commentRo='Ecuație bilanțată: 2H₂ + O₂ → 2H₂O. Indicii chimici nu se modifică pentru a echilibra ecuația.';
  commentEn='Balanced equation: 2H₂ + O₂ → 2H₂O. Formula subscripts must not change during balancing.';
 }else if(kind==='concentration'){
  rect(32,42,126,112,'#224d64');rect(207,42,126,112,'#255c70');
  t(42,64,'10 g solut',13);t(42,89,'90 g apă',13);t(45,124,'w = 10%',15);
  t(214,64,'10 g solut',13);t(214,89,'190 g apă',13);t(216,124,'w = 5%',15);
  path('M160 98 H204','#f0d789',3);t(163,82,'+100 g',12);
  t(66,187,'m_solut fix, m_soluție se schimbă',12);
  commentRo='Exemplu calculat: 10/100×100%=10%, apoi 10/200×100%=5%, presupunând dizolvare completă și fără pierderi.';
  commentEn='Calculated model: 10/100×100%=10%, then 10/200×100%=5%, assuming full dissolution and no loss.';
 }else if(kind==='energy-profile'){
  axes('Avansare','H');
  path('M57 145 C109 145 105 61 161 50 S211 119 258 119 H310','#efb978',3);
  line(257,119,311,119,'#a3deb9',2);line(55,145,100,145,'#a3deb9',2);
  t(66,132,'Reactanți',12);t(252,108,'Produși',12);
  t(188,38,'Barieră Ea',12);t(238,164,'ΔH < 0',12);
  commentRo='Profil schematic exoterm: produșii au entalpie mai mică decât reactanții, dar există barieră de activare. Nu este o măsurare.';
  commentEn='Schematic exothermic reaction: product enthalpy is lower, yet an activation barrier exists. Not measured data.';
 }else if(kind==='cell'){
  rect(32,71,130,92);rect(202,71,130,92);
  t(48,94,'Zn | Zn²⁺',15);t(213,94,'Cu²⁺ | Cu',14);
  t(47,138,'Oxidare',14);t(210,138,'Reducere',14);
  path('M90 72 V35 H272 V72','#ebd083',3);
  t(137,28,'e⁻ →',16);
  t(91,186,'Zn + Cu²⁺ → Zn²⁺ + Cu',13);
  commentRo='Model de pilă galvanică: electronii circulă prin circuitul extern de la Zn la Cu. Desen conceptual, nu instrucțiuni de construcție.';
  commentEn='Galvanic cell model: electrons travel through the external circuit from Zn to Cu. Conceptual only, not assembly guidance.';
 }else if(kind==='calibration'){
  axes('c (mol/L)','A');
  path('M46 171 L304 49','#f7ce8b',2);
  for(const [x,y] of [[88,152],[124,137],[163,114],[205,93],[248,69]]){
   el('circle',{cx:x,cy:y,r:5,fill:'#9de4d5',stroke:'#fff'});
  }
  t(146,41,'A = εlc',14);
  commentRo='Calibrare liniară idealizată, nu date de laborator. În practică se verifică blancul, domeniul liniar și reziduurile.';
  commentEn='Idealised linear calibration, not lab data. Check blank, linear range and residuals with real measurements.';
 }else if(kind==='enzyme'){
  axes('[S]','v');
  path('M43 177 C71 101 107 72 153 61 S256 49 317 48','#91e4c6',3);
  line(45,45,317,45,'#deb587',1);t(245,35,'Vmax',13);
  t(91,115,'Km → v=Vmax/2',11);
  commentRo='Model de saturație Michaelis–Menten în condiții de viteză inițială; curba este teoretică, nu măsurată.';
  commentEn='Theoretical Michaelis–Menten initial-rate saturation curve; not empirical measurements.';
 }else if(kind==='equilibrium'){
  axes('Avansare ξ','G');
  path('M60 45 C113 119 160 155 193 149 S275 90 306 44','#f1cc87',3);
  line(194,150,194,178,'#a7e0d6',1);
  t(202,132,'min(G)',12);t(207,195,'Q = K',12);
  commentRo='Schemă pentru un sistem la T și p constante: minimul energiei Gibbs față de avansare definește echilibrul în model. Nu este măsurare.';
  commentEn='Schematic at fixed T and p: minimum Gibbs energy versus extent defines model equilibrium. Not measured data.';
 }
 root.append(svg);
 const note=document.createElement('p');note.className='chem-visual-note';
 note.textContent=learningLabel(commentRo,commentEn);
 root.append(note);return root;
}
