// Biology teaching visuals: one topic-specific, simplified systems diagram.
// The cell and DNA models live in the established interactive renderer.
// No graph is fabricated for a specialised university course that has not
// been assigned a valid context diagram.
export const BIOLOGY_TOPIC_VISUALS=Object.freeze({
 biomolecules:{
  ro:'Acțiunea unei enzime',en:'How enzymes work',
  captionRo:'Substratul se leagă de enzimă, apare complexul enzimă–substrat, iar produșii se desprind. Enzima nu este consumată net în reacție.',
  captionEn:'The substrate binds to the enzyme, forms a complex, and products are released; the enzyme is not used up overall.',
  limitRo:'Schemă simplificată, fără scară moleculară; nu arată toate tipurile de inhibiție.',
  limitEn:'Simplified schematic, not to molecular scale; it does not show every inhibition mechanism.',
  nodes:[['e','Enzimă','Enzyme',10,55],['s','Substrat','Substrate',10,195],['es','Complex ES','ES complex',162,125],['p','Produși','Products',318,125]],
  edges:[['e','es'],['s','es'],['es','p']]
 },
 anatomy:{
  ro:'Circuitul sângelui prin țesuturi',en:'Blood circuit through tissues',
  captionRo:'Inima trimite sângele în artere; la capilare se produc schimburi cu țesuturile, iar venele îl aduc spre inimă. Circulația pulmonară are traseul ei separat.',
  captionEn:'The heart pumps blood into arteries; capillaries exchange materials with tissues and veins return blood to the heart. The pulmonary circuit is separate.',
  limitRo:'Schemă funcțională, nu hartă anatomică și nu indică oxigenarea tuturor arterelor.',
  limitEn:'Functional schematic, not an anatomical map or a statement about oxygenation in every artery.',
  nodes:[['heart','Inimă','Heart',10,125],['artery','Artere','Arteries',145,35],['cap','Capilare','Capillaries',302,125],['vein','Vene','Veins',145,230]],
  edges:[['heart','artery'],['artery','cap'],['cap','vein'],['vein','heart']]
 },
 evolution:{
  ro:'Schimbarea frecvențelor în populație',en:'Changing population frequencies',
  captionRo:'Variația ereditară există în populație; selecția naturală și deriva genetică pot modifica frecvențele variantelor de-a lungul generațiilor.',
  captionEn:'Heritable variation exists in a population; natural selection and genetic drift can alter variant frequencies across generations.',
  limitRo:'Nu sugerează că organismele își creează intenționat mutații avantajoase.',
  limitEn:'Does not suggest that organisms intentionally generate advantageous mutations.',
  nodes:[['var','Variație','Variation',10,125],['sel','Selecție','Selection',150,35],['drift','Derivă','Drift',150,230],['freq','Frecvențe','Frequencies',302,125]],
  edges:[['var','sel'],['var','drift'],['sel','freq'],['drift','freq']]
 },
 ecology:{
  ro:'Rețea trofică și reciclarea materiei',en:'Food web and matter cycling',
  captionRo:'Producătorii introduc energie în rețeaua trofică; consumatorii transferă materia și energia, iar descompunătorii participă la reciclarea nutrienților.',
  captionEn:'Producers bring energy into a food web, consumers transfer matter and energy, and decomposers help recycle nutrients.',
  limitRo:'O rețea reală conține multe specii și transferuri; nu presupune un randament fix de 10%.',
  limitEn:'Real food webs have many links; a fixed 10% energy efficiency must not be assumed.',
  nodes:[['plants','Producători','Producers',10,45],['herb','Ierbivore','Herbivores',150,45],['pred','Prădători','Predators',302,45],['decomp','Descompunători','Decomposers',150,200],['soil','Nutrienți','Nutrients',10,200]],
  edges:[['plants','herb'],['herb','pred'],['pred','decomp'],['herb','decomp'],['decomp','soil'],['soil','plants']]
 },
 microbes:{
  ro:'Microorganisme și cicluri distincte',en:'Different microbial processes',
  captionRo:'Bacteriile se divid celular; virusurile produc noi particule numai prin folosirea mecanismelor unei celule gazdă. Sunt procese biologice diferite.',
  captionEn:'Bacteria divide as cells; viruses replicate using a host cell. These are distinct biological processes.',
  limitRo:'Schemă didactică; nu descrie toate bacteriile ori toate ciclurile virale.',
  limitEn:'Teaching schematic, not an exhaustive bacterial or viral life cycle.',
  nodes:[['b','Bacterie','Bacterium',10,55],['divide','Diviziune','Division',170,55],['b2','Celule fiice','Daughter cells',325,55],['v','Virus','Virus',10,210],['host','Celulă gazdă','Host cell',170,210],['v2','Particule noi','New particles',325,210]],
  edges:[['b','divide'],['divide','b2'],['v','host'],['host','v2']]
 },
 plants:{
  ro:'Fotosinteza oxigenică',en:'Oxygenic photosynthesis',
  captionRo:'Lumina furnizează energie; apa și CO₂ participă la formarea materiei organice, iar oxigenul provine din apă. Ecuația este un bilanț simplificat.',
  captionEn:'Light supplies energy, water and CO₂ contribute to organic matter production and oxygen is released from water. The equation is simplified.',
  limitRo:'Nu reprezintă toate etapele biochimice și nici plantele ca producând oxigen doar în lumină puternică.',
  limitEn:'Does not represent all biochemical steps or exact rates under different light conditions.',
  nodes:[['light','Lumină','Light',10,40],['water','Apă','Water',10,140],['co2','CO₂','CO₂',10,240],['leaf','Cloroplast','Chloroplast',165,140],['sugar','Glucide','Sugars',323,70],['o2','O₂','O₂',323,215]],
  edges:[['light','leaf'],['water','leaf'],['co2','leaf'],['leaf','sugar'],['leaf','o2']]
 },
 homeostasis:{
  ro:'Bucla de feedback negativ',en:'Negative feedback loop',
  captionRo:'Receptorul detectează abaterea, un centru de reglare coordonează răspunsul, iar efectorul reduce abaterea de la intervalul țintă.',
  captionEn:'A receptor detects deviation, a controller coordinates the response and an effector counteracts the deviation.',
  limitRo:'Model simplificat; reglarea temperaturii, glicemiei și apei implică multiple circuite interconectate.',
  limitEn:'Simplified model; temperature, glucose and water balance involve interacting circuits.',
  nodes:[['shift','Abatere','Deviation',10,125],['sensor','Receptor','Receptor',145,35],['control','Reglare','Controller',302,125],['eff','Efector','Effector',145,230]],
  edges:[['shift','sensor'],['sensor','control'],['control','eff'],['eff','shift']]
 },
 methods:{
  ro:'Metoda științifică și controlul variabilelor',en:'Scientific method and variables',
  captionRo:'O ipoteză generează predicții testabile; un experiment controlat produce date ce trebuie analizate critic înainte de formularea concluziei.',
  captionEn:'A hypothesis makes testable predictions; a controlled experiment produces evidence that must be interpreted before drawing conclusions.',
  limitRo:'Nu toate investigațiile biologice pot fi experimente; observația controlată poate fi adecvată.',
  limitEn:'Not all biological research can be experimental; controlled observation may be suitable.',
  nodes:[['hyp','Ipoteză','Hypothesis',10,40],['pred','Predicție','Prediction',155,40],['test','Test','Test',302,125],['data','Date','Data',155,225],['con','Concluzie','Conclusion',10,225]],
  edges:[['hyp','pred'],['pred','test'],['test','data'],['data','con']]
 }
});
export function biologyTopicVisualBuild(topic='',language='ro'){
 const entry=BIOLOGY_TOPIC_VISUALS[String(topic||'')];
 if(!entry||typeof document==='undefined')return null;
 const ro=language==='ro',ns='http://www.w3.org/2000/svg';
 const wrap=document.createElement('section');
 wrap.className='biology-context-board';
 wrap.style.cssText='display:flex;flex-direction:column;gap:9px;overflow-y:auto;overscroll-behavior:contain;flex:1 1 auto;min-height:0;';
 const svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 440 320');
 svg.setAttribute('role','img');
 svg.setAttribute('aria-label',ro?entry.ro:entry.en);
 svg.style.cssText='width:100%;height:auto;flex:0 0 auto;background:#0c2b3e;border:1px solid #487e98;border-radius:12px;';
 const defs=document.createElementNS(ns,'defs');
 const marker=document.createElementNS(ns,'marker');
 for(const [key,val] of Object.entries({id:'bio-arrow',markerWidth:8,markerHeight:8,refX:7,refY:3,orient:'auto',markerUnits:'strokeWidth'}))marker.setAttribute(key,String(val));
 const tip=document.createElementNS(ns,'path');
 tip.setAttribute('d','M0,0 L0,6 L7,3 z');
 tip.setAttribute('fill','#8bd9e5');
 marker.append(tip);defs.append(marker);svg.append(defs);
 const byId=new Map(entry.nodes.map(n=>[n[0],n]));
 for(const [from,to] of entry.edges){
  const a=byId.get(from),b=byId.get(to);
  if(!a||!b)continue;
  const x1=a[3]+52,y1=a[4]+26,x2=b[3]+52,y2=b[4]+26;
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  const ox=dx/len,oy=dy/len;
  const line=document.createElementNS(ns,'line');
  for(const [key,val] of Object.entries({
   x1:x1+ox*35,y1:y1+oy*20,x2:x2-ox*38,y2:y2-oy*23,
   stroke:'#8bd9e5','stroke-width':2.5,'marker-end':'url(#bio-arrow)'
  }))line.setAttribute(key,String(val));
  svg.append(line);
 }
 for(const n of entry.nodes){
  const [id,labelRo,labelEn,x,y]=n;
  const rect=document.createElementNS(ns,'rect');
  for(const [key,val] of Object.entries({x,y,width:104,height:52,rx:10,fill:'#184960',stroke:'#8ad1e1','stroke-width':2}))
   rect.setAttribute(key,String(val));
  const text=document.createElementNS(ns,'text');
  for(const [key,val] of Object.entries({x:x+52,y:y+30,'text-anchor':'middle',fill:'#f3fbff','font-size':12,'font-weight':600}))
   text.setAttribute(key,String(val));
  text.textContent=ro?labelRo:labelEn;
  svg.append(rect,text);
 }
 const heading=document.createElement('h3');
 heading.textContent=ro?entry.ro:entry.en;
 const note=document.createElement('p');note.textContent=ro?entry.captionRo:entry.captionEn;
 const limitation=document.createElement('small');limitation.textContent=ro?entry.limitRo:entry.limitEn;
 wrap.append(heading,svg,note,limitation);
 return wrap;
}
