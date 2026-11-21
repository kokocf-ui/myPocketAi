// Original chapter-specific school Sciences models.
// Unknown specialist topics deliberately return null rather than unrelated repeated art.
export const SCIENCE_CONTEXTUAL_DIAGRAMS={"chemistry":{"fundamentals":["Separarea unui amestec","Mixture separation","mixture","O schemă de filtrare separă particule solide insolubile de un lichid; nu separă substanțe dizolvate.","Filtration separates insoluble solid particles from a liquid, not dissolved substances."],"atomic":["Atomul și învelișurile electronice","Atomic structure and shells","atom","Nucleul conține protoni și neutroni; electronii sunt reprezentați schematic în jurul nucleului. Orbitalii reali nu sunt trasee circulare.","Nucleus contains protons and neutrons; shells are schematic, not literal electron paths."],"periodic":["Sistemul periodic – relații între elemente","Periodic trends and elements","periodic","Grupele și perioadele organizează elementele după numărul atomic și configurația electronică. Numărul de ordine crește în sensul perioadelor.","Groups and periods classify elements by atomic number and electron configuration."],"bonding":["Legătura covalentă și ionică","Covalent and ionic bonding","bonding","În legătura covalentă este partajată densitatea electronică; în legătura ionică atracția electrostatică este dominantă.","Covalent bonding involves shared electron density; ionic bonding is dominated by electrostatic attraction."],"reactions":["Conservarea atomilor în reacție","Atom conservation in a reaction","reaction","Coeficienții ecuației se aleg astfel încât fiecare element să aibă același număr de atomi înainte și după reacție.","Balanced equations conserve the number of atoms of every element. Equal atom counts are required on both sides of a balanced equation."],"inorganic":["Rețea cristalină ionică","Ionic crystal lattice","lattice","Într-un cristal ionic, ionii pozitivi și cei negativi sunt aranjați periodic; nu sunt molecule NaCl izolate.","Positive and negative ions form a repeating ionic lattice, not separate NaCl molecules."],"solutions":["Soluție și diluție","Solutions and dilution","dilution","La diluție fără reacție chimică, cantitatea de solut rămâne aceeași: c₁V₁ = c₂V₂. Apa adăugată schimbă volumul total și concentrația, nu numărul de moli de solut.","For dilution without chemical reaction, the amount of solute is conserved: c₁V₁ = c₂V₂."],"acids":["Scara pH și aciditatea","pH scale and acidity","ph","pH mai mic înseamnă activitate mai mare a ionilor de hidrogen; scara este logaritmică, nu liniară.","Lower pH indicates higher hydrogen ion activity; the scale is logarithmic, not linear."],"organic":["Structură organică și grupe funcționale","Organic structures and functional groups","organic","Etanolul conține o grupă hidroxil –OH legată de un fragment carbonic; reprezentarea structurală arată legături, nu geometrie 3D.","Ethanol contains a hydroxyl –OH group; the structural formula shows bonding rather than full 3D geometry."],"physical":["Profil energetic al reacției","Reaction energy profile","enthalpy","Energia de activare caracterizează bariera procesului, iar ΔH diferența dintre reactanți și produși în condiții definite.","Activation energy is the barrier; reaction enthalpy ΔH is the difference between products and reactants."],"electrochem":["Celulă galvanică Zn/Cu","Zinc–copper galvanic cell","cell","În modelul Zn/Cu, electronii circulă prin conductorul exterior de la anodul de zinc către catodul de cupru.","In a Zn/Cu galvanic cell, electrons flow through the external wire from zinc anode to copper cathode."],"analytical":["Curbă de titrare acid–bază","Acid–base titration curve","titration","Saltul de pH în jurul echivalenței depinde de sistemul acid-bază; curba este schematică, fără date experimentale.","pH change near equivalence depends on the acid–base system; this is a schematic curve, not experimental data."],"biochemistry":["Cataliză enzimatică","Enzyme catalysis","enzyme","Enzima formează un complex tranzitoriu cu substratul și se regenerează; nu este consumată stoichiometric.","An enzyme temporarily binds substrate and is regenerated rather than consumed stoichiometrically."],"advanced":["Niveluri energetice și tranziții","Energy levels and transitions","levels","Tranzițiile dintre niveluri energetice implică absorbție sau emisie de fotoni; liniile sunt schematice.","Transitions between energy levels involve photon absorption or emission; the levels are schematic."]},"biology":{"cells":["Celula eucariotă","Eukaryotic cell","cell-bio","Membrana delimitează citoplasma; nucleul conține o parte importantă din materialul genetic în celulele eucariote.","Membrane encloses cytoplasm; the nucleus contains much of the genetic material in eukaryotes."],"biomolecules":["Enzimă, substrat și produs","Enzyme, substrate and product","enzyme","Proteinele enzimatice catalizează reacții printr-un complex temporar cu substratul, fără consum net al enzimei.","Enzymes catalyse reactions through a transient substrate complex without net enzyme consumption."],"anatomy":["Circulația sângelui și plămânii","Blood circulation and lungs","circulation","Schema arată legătura dintre plămâni, inimă și țesuturi; sunt două circuite, pulmonar și sistemic.","The diagram separates the pulmonary and systemic circulations linking lungs, heart and tissues."],"genetics":["Încrucișare monohibridă Aa × Aa","Monohybrid cross Aa × Aa","punnett","Pentru un model mendelian simplu cu segregare egală a alelelor, combinațiile sunt AA, Aa, Aa și aa.","For a simple Mendelian model with equal segregation, the offspring genotypes are AA, Aa, Aa and aa."],"evolution":["Arbore filogenetic – strămoș comun","Phylogenetic tree – common ancestry","tree","Ramurile reprezintă ipoteze de înrudire; poziția vizuală pe orizontală nu este o scară de superioritate.","Branches show hypotheses of relatedness; horizontal position is not a hierarchy of superiority."],"ecology":["Fluxul energiei într-un ecosistem","Energy flow in an ecosystem","foodweb","Energia trece de la producători la consumatori și se disipă parțial la fiecare nivel; materia se reciclează diferit.","Energy flows through trophic levels with losses; matter cycles through the system differently."],"microbes":["Creștere microbiană într-un mediu limitat","Microbial growth under limited resources","growth","Un model logistic schematic crește la început și încetinește când resursele devin limitante; nu este o curbă clinică.","A schematic logistic model rises and then slows as resources become limiting; it is not clinical data."],"plants":["Fotosinteză – intrări și produse","Photosynthesis – inputs and products","photosynthesis","Lumina susține conversia dioxidului de carbon și apei în compuși organici, însoțită de eliberare de oxigen.","Light supports conversion of CO₂ and water into organic compounds with oxygen release."],"homeostasis":["Reglare prin feedback negativ","Negative-feedback regulation","feedback","Un semnal de abatere este detectat, apare un răspuns corectiv și abaterea scade; schema este un model, nu un diagnostic.","A deviation is detected, a corrective response occurs, and the deviation decreases; this is a model, not a diagnosis."],"methods":["Eșantionare și variație biologică","Sampling and biological variation","sampling","Măsurătorile repetate arată variație; media este orientativă fără mărimea eșantionului și informații despre dispersie.","Repeated measurements show variation; a mean is incomplete without sample size and spread."]}};
export function scienceContextualDiagramSpec(subject,topic){
 return SCIENCE_CONTEXTUAL_DIAGRAMS[subject]?.[topic]||null;
}
export function scienceContextualDiagramBuild(subject,topic,language='ro'){
 const d=scienceContextualDiagramSpec(subject,topic);if(!d)return null;
 const [roTitle,enTitle,kind,roNote,enNote]=d,ro=language==='ro';
 const box=document.createElement('section');box.className='science-context-diagram';
 const heading=document.createElement('h3');heading.textContent=ro?roTitle:enTitle;box.append(heading);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 360 240');
 svg.setAttribute('role','img');svg.setAttribute('aria-label',heading.textContent);box.append(svg);
 const item=(tag,attrs={},value)=>{
  const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
  if(value!==undefined)e.textContent=String(value);svg.append(e);return e;
 };
 const line=(x1,y1,x2,y2,stroke='#98c8e0',w=2)=>item('line',{x1,y1,x2,y2,stroke,'stroke-width':w,'stroke-linecap':'round'});
 const circ=(cx,cy,r,fill='#2e7892',stroke='#97d5e6')=>item('circle',{cx,cy,r,fill,stroke,'stroke-width':2});
 const rect=(x,y,w,h,fill='#224c65')=>item('rect',{x,y,width:w,height:h,rx:8,fill,stroke:'#83b9d4','stroke-width':1.5});
 const txt=(x,y,value,size=13)=>item('text',{x,y,fill:'#f5f7fe','font-size':size,'text-anchor':'middle'},value);
 const path=(d,color='#eac47e',w=3)=>item('path',{d,stroke:color,fill:'none','stroke-width':w});
 const arrow=(x1,y1,x2,y2)=>{line(x1,y1,x2,y2,'#e5bb70',3);const a=Math.atan2(y2-y1,x2-x1);
  const t=8;path('M'+(x2-t*Math.cos(a-.5))+' '+(y2-t*Math.sin(a-.5))+' L'+x2+' '+y2+' L'+(x2-t*Math.cos(a+.5))+' '+(y2-t*Math.sin(a+.5)),'#e5bb70',2)};
 const axes=(x='x',y='y')=>{line(34,185,330,185);line(34,185,34,29);txt(298,213,x);txt(58,23,y)};
 const chart=(fn)=>{let p='';for(let i=0;i<=100;i++){const x=i/100,y=Math.max(.02,Math.min(.98,fn(x)));p+=(i?' L':'M')+(35+x*284).toFixed(1)+' '+(184-y*150).toFixed(1)}path(p)};
 if(kind==='mixture'){
  rect(35,65,87,110);rect(238,100,87,76);
  path('M125 71 L181 132 L231 71','#9edfd1',3);
  for(let i=0;i<7;i++)circ(65+(i%3)*14,101+Math.floor(i/3)*18,4,'#e6c47c');
  arrow(133,120,218,120);txt(77,51,ro?'Amestec':'Mixture');txt(286,90,ro?'Filtrat':'Filtrate');txt(181,190,ro?'Solid reținut':'Retained solid',11);
 }else if(kind==='atom'){
  circ(180,118,26,'#aa727d');for(const [a,b] of [[172,111],[190,120],[178,128]])circ(a,b,6,'#e9c473');
  item('ellipse',{cx:180,cy:118,rx:67,ry:43,stroke:'#8bd1ed',fill:'none','stroke-width':2});
  item('ellipse',{cx:180,cy:118,rx:118,ry:80,stroke:'#5e9fc1',fill:'none','stroke-width':2});
  [[115,120],[260,118],[165,39]].forEach(([x,y])=>circ(x,y,5,'#88dfe5'));
  txt(184,226,ro?'model de înveliș':'shell model',12);
 }else if(kind==='periodic'){
  for(let r=0;r<5;r++)for(let col=0;col<11;col++){
   const fill=(col<2?'#3d7398':col>8?'#9b7b5b':'#4b8b7b');
   item('rect',{x:22+col*29,y:33+r*31,width:25,height:26,fill,stroke:'#bad8e5','stroke-width':1});
  }
  txt(181,222,ro?'Grupe (vertical) · perioade (orizontal)':'Groups (vertical) · periods (horizontal)',12);
 }else if(kind==='bonding'){
  circ(105,97,34,'#388399');circ(167,97,34,'#aa748e');
  circ(131,91,5,'#efc87d');circ(143,101,5,'#efc87d');txt(137,148,ro?'pereche comună':'shared pair',12);
  circ(256,92,26,'#3a8d9a');circ(316,92,26,'#b67e6e');txt(255,98,'+');txt(316,98,'−');
  txt(285,145,ro?'ioni':'ions',12);
 }else if(kind==='reaction'){
  txt(79,100,'2 H₂ + O₂',19);arrow(170,93,213,93);txt(280,100,'2 H₂O',19);
  txt(180,167,ro?'H: 4 = 4    O: 2 = 2':'H: 4 = 4    O: 2 = 2',15);
 }else if(kind==='lattice'){
  for(let y=0;y<4;y++)for(let x=0;x<7;x++){
   const pos=62+x*39,py=53+y*39,ion=(x+y)%2===0;
   circ(pos,py,14,ion?'#d7b16c':'#397f9e');txt(pos,py+5,ion?'Na⁺':'Cl⁻',11);
  }
 }else if(kind==='dilution'){
  rect(41,56,86,129);rect(234,56,86,129);
  for(let i=0;i<12;i++)circ(53+(i%3)*26,91+Math.floor(i/3)*23,5,'#e6c57c');
  for(let i=0;i<12;i++)circ(247+(i%4)*20,89+Math.floor(i/4)*28,4,'#e6c57c');
  arrow(138,128,222,128);txt(178,81,'+ H₂O');
  txt(84,209,'c₁, V₁',13);txt(279,209,'c₂, V₂',13);
 }else if(kind==='ph'){
  const colors=['#9b4b68','#ac7d45','#d1b562','#5f9e83','#4676a1'];
  for(let i=0;i<5;i++)rect(25+i*65,91,61,42,colors[i]);
  txt(47,81,'0');txt(180,81,'7');txt(308,81,'14');
  txt(62,162,ro?'acid':'acid');txt(178,162,ro?'neutru':'neutral');txt(292,162,ro?'bazic':'basic');
  txt(180,209,'pH = −log₁₀(aH⁺)',13);
 }else if(kind==='organic'){
  txt(49,110,'H₃C',20);line(78,105,118,105);txt(158,110,'CH₂',20);
  line(185,105,225,105);txt(267,110,'OH',20);
  txt(180,169,ro?'Etanol · grupă hidroxil':'Ethanol · hydroxyl group',13);
 }else if(kind==='enthalpy'){
  axes(ro?'progresul reacției':'reaction progress','H');
  path('M38 74 C88 75 105 40 153 43 C193 49 190 158 238 158 L316 158');
  txt(90,58,ro?'reactanți':'reactants',11);txt(272,146,ro?'produși':'products',11);
  txt(206,218,'ΔH < 0',14);
 }else if(kind==='cell'){
  rect(42,73,52,112);rect(260,73,52,112);
  line(42,147,95,147);line(260,147,312,147);
  path('M94 95 L262 95 L262 81','#a6d9e5',2);
  arrow(98,94,251,94);arrow(251,165,98,165);
  txt(65,57,'Zn');txt(286,57,'Cu');
  txt(179,75,'e⁻',14);txt(180,212,ro?'anod → catod':'anode → cathode',12);
 }else if(kind==='titration'){
  axes(ro?'volum adăugat':'added volume','pH');
  chart(x=>0.1+0.8/(1+Math.exp(-35*(x-.57))));
  txt(183,51,ro?'echivalență':'equivalence',12);
 }else if(kind==='enzyme'){
  circ(69,103,31,'#377c91');circ(176,103,25,'#d7b474');
  arrow(100,103,140,103);rect(217,69,104,76,'#295c75');
  txt(271,97,'E + P',15);txt(69,161,'E',15);txt(177,158,'S',15);txt(271,160,'ES → E+P',12);
 }else if(kind==='levels'){
  [68,116,162].forEach((y,i)=>{line(60,y,293,y);txt(318,y+4,'E'+(3-i))});
  arrow(174,159,174,75);txt(205,110,'hν',18);
 }else if(kind==='cell-bio'){
  item('ellipse',{cx:180,cy:114,rx:124,ry:82,fill:'#225b67',stroke:'#8fd0cc','stroke-width':3});
  circ(180,115,40,'#896e9d');circ(180,115,13,'#c5a9dd');
  for(const [x,y] of [[115,77],[257,93],[122,159],[249,155]])circ(x,y,13,'#a88955');
  txt(184,225,ro?'Membrană · nucleu · organite':'Membrane · nucleus · organelles',12);
 }else if(kind==='circulation'){
  circ(175,113,48,'#9c596d');txt(175,117,ro?'Inimă':'Heart',14);
  rect(15,35,100,40);rect(245,35,100,40);txt(65,59,ro?'Plămâni':'Lungs',12);txt(295,59,ro?'Țesuturi':'Tissues',12);
  arrow(121,58,148,86);arrow(206,84,239,58);
  arrow(239,153,207,139);arrow(147,139,120,153);
  txt(178,206,ro?'Circulație dublă':'Double circulation',13);
 }else if(kind==='punnett'){
  const x=86,y=51,sz=50;
  ['A','a'].forEach((v,i)=>{txt(x+sz*(i+1)+25,42,v,16);txt(70,y+sz*(i+1)+30,v,16)});
  for(let row=0;row<2;row++)for(let col=0;col<2;col++){
   rect(x+col*sz,y+row*sz,sz,sz,'#255877');
   txt(x+col*sz+25,y+row*sz+29,['AA','Aa','Aa','aa'][row*2+col],18)
  }
  txt(180,202,'1 AA : 2 Aa : 1 aa',14);
 }else if(kind==='tree'){
  path('M40 118 H90 V60 H160 V38 H220 M160 60 V94 H220 M90 118 V176 H220');
  txt(262,43,'A',17);txt(262,99,'B',17);txt(262,181,'C',17);
  txt(166,217,ro?'strămoș comun':'common ancestor',13);
 }else if(kind==='foodweb'){
  rect(14,164,100,45);rect(128,102,100,45);rect(248,44,100,45);
  txt(64,191,ro?'plante':'plants',14);txt(178,129,ro?'erbivore':'herbivores',13);txt(298,71,ro?'prădători':'predators',12);
  arrow(106,161,144,145);arrow(224,104,261,87);
  txt(168,229,ro?'Energie de-a lungul lanțului':'Energy through the food chain',12);
 }else if(kind==='growth'){
  axes('t','N');
  chart(x=>0.06+0.82/(1+Math.exp(-14*(x-.46))));
  txt(192,64,ro?'resurse limitante':'limited resources',12);
 }else if(kind==='photosynthesis'){
  circ(181,88,33,'#5d9c6b');txt(181,94,ro?'Frunză':'Leaf',13);
  txt(64,64,'CO₂');txt(66,137,'H₂O');txt(285,68,'O₂');txt(287,143,'C₆H₁₂O₆');
  arrow(90,68,147,82);arrow(90,132,149,106);arrow(213,82,250,70);arrow(212,106,247,136);
  txt(181,196,ro?'Lumină + pigmenți':'Light + pigments',13);
 }else if(kind==='feedback'){
  const blocks=[[20,'Stimulus','Stimulus'],[119,'Receptor','Receptor'],[228,'Răspuns','Response']];
  for(const [x,rr,ee] of blocks){rect(x,81,101,58);txt(x+51,115,ro?rr:ee,12)}
  arrow(121,110,118,110);arrow(220,110,227,110);
  path('M280 145 V186 H61 V144','#e5bb70',2);txt(172,209,ro?'feedback negativ':'negative feedback',12);
 }else if(kind==='sampling'){
  axes(ro?'eșantion':'sample',ro?'măsurare':'measurement');
  for(let k=0;k<9;k++){
   const u=.07+k*.108,v=.3+.04*k+.12*Math.sin(1.9*k);
   circ(34+u*280,185-v*145,4,'#e6c07c');
  }
  path('M53 140 L310 69','#85d0c4',2);
  txt(191,218,ro?'Variație, nu măsurare reală':'Illustrative variation, not real data',11);
 }else return null;
 const note=document.createElement('p');note.className='science-context-diagram-caption';
 note.textContent=(ro?roNote:enNote)+' '+(ro?'Model didactic schematic, nu măsurătoare reală.':'Schematic teaching model, not measured data.');
 box.append(note);return box;
}
