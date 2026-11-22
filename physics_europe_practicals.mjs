// Safe, original, chapter-specific laboratory activities for Physics school years.
// One experiment is attached to one real school-year lesson; no generic diagrams
// are used as a substitute for a lesson-specific practical investigation.
// Content is a pedagogical MODEL, not a record of measurements performed.
export const PHYSICS_PRACTICAL_PROTOCOLS=Object.freeze({
 units:[
  ['Măsurare repetată și incertitudine','Repeated measurement and uncertainty','Rigla, cartea, foaie de date','Ruler, book, data sheet','Măsoară lungimea aceleiași cărți de trei ori, în centimetri; notează și rezoluția riglei. Calculează media și compară valorile; explică de ce o măsurare nu este exactă.','Measure the same book three times in centimetres; record the ruler resolution. Calculate the mean, compare readings and explain why a result has uncertainty.'],
  ['Compararea timpilor de deplasare','Comparing travel times','Cronometru, jucărie, două marcaje','Stopwatch, toy, two markers','Cronometrează trei deplasări ale jucăriei între aceleași marcaje. Construiește un tabel cu timp și unitate; distinge eroarea de reacție de modificarea reală a mișcării.','Time three journeys of a toy between the same markers. Tabulate times and units, and distinguish reaction-time error from a real change in movement.']
 ],
 kinematics:[
  ['Mișcarea unui cărucior','Motion of a toy vehicle','Cărucior, riglă, cronometru, masă plană','Toy car, ruler, stopwatch, level table','Marchează pozițiile la intervale egale de timp și măsoară distanțele; trasează poziție–timp. Calculează viteza medie doar pe un interval măsurat.','Record the position at equal time intervals and plot position against time. Calculate mean speed only over a measured interval.'],
  ['Drum parcurs versus deplasare','Distance versus displacement','Banda adezivă de hârtie, creion, ruletă','Paper tape, pencil, measuring tape','Desenează două trasee cu același punct inițial și final, unul drept și altul ocolit. Măsoară lungimea traseelor și compară deplasările cu semn.','Draw a straight route and a detour with the same starting and ending points. Measure path lengths and compare the signed displacements.']
 ],
 dynamics:[
  ['Forțe pe plan înclinat','Forces on an inclined plane','Carte rigidă ca rampă, cărucior ușor','Rigid book used as a ramp, lightweight car','Schimbă ușor înclinarea rampei și observă dacă mișcarea se modifică. Desenează forța gravitațională, reacțiunea și frecarea; nu atribui valori nemăsurate.','Vary a shallow ramp angle and observe motion. Draw gravity, normal reaction and friction; do not invent numerical forces.'],
  ['Elongația unui elastic','Stretch of an elastic band','Elastic moale, riglă și sarcini foarte ușoare','Soft elastic band, ruler and very light loads','Măsoară întinderea elasticului sub două sarcini sigure, fără a-l rupe. Compară rezultatele și explică unde aproximarea liniară încetează să fie justificată.','Measure extension under two safe light loads without overstretching. Compare readings and discuss the limits of a linear force-extension model.']
 ],
 energy:[
  ['Energie potențială și coborâre','Gravitational energy and rolling','Minge mică, rampă joasă, riglă','Small ball, low ramp, ruler','Lasă mingea din două poziții diferite, fără împingere. Compară distanțele de rulare și descrie transferurile de energie, inclusiv pierderile.','Release a ball from two different heights without pushing. Compare travel distances and describe useful energy transfers and losses.'],
  ['Lanțul energetic al unei lanterne','Energy transfers in a torch','Lanternă cu baterie și foaie de observații','Battery torch and observation sheet','Identifică energia stocată, lumină și încălzirea posibilă. Construiește o diagramă de transfer al energiei și discută de ce puterea utilă nu este egală cu toate transferurile.','Identify stored energy, visible light and possible heating. Draw an energy-transfer diagram and distinguish useful output from total transfer.']
 ],
 fluids:[
  ['Presiune pe suprafețe diferite','Pressure on unequal areas','Burete, două blocuri ușoare cu baze diferite','Sponge, two light blocks with different bases','Așază corpuri cu mase apropiate pe suprafețe de contact diferite. Compară urmele, descrie aria și explică modelul p=F/A fără sarcini periculoase.','Place similarly weighted light objects with different base areas on a sponge. Compare impressions and interpret p=F/A safely.'],
  ['Flotabilitate și volum deplasat','Buoyancy and displaced volume','Vas cu apă, plastilină, lingură','Bowl of water, modelling clay, spoon','Testează cu grijă o bilă și o formă de bărcuță din aceeași plastilină. Notează ce plutește, ce se scufundă și ce volum de apă este deplasat.','Test a clay ball and a boat-shaped piece using the same clay. Record floating and sinking and relate the result to displaced water.']
 ],
 heat:[
  ['Răcire și citire termometrică','Cooling and temperature readings','Două pahare, apă călduță, termometru sigur','Two cups, lukewarm water, safe thermometer','Măsoară temperatura apei călduțe la intervale egale. Nu folosi apă fierbinte. Trasează T–t și precizează condițiile mediului și rezoluția instrumentului.','Measure lukewarm water temperature at equal intervals without hot water. Plot temperature versus time and note environmental conditions and instrument precision.'],
  ['Materiale izolatoare','Comparing insulation','Două căni identice, material textil, termometru','Two identical cups, cloth, thermometer','Pune cantități similare de apă călduță în două căni; învelește numai una. Compară răcirea după același timp, fără a pretinde că au fost izolate toate variabilele.','Put similar amounts of lukewarm water in matching cups, wrapping only one. Compare cooling over the same time and discuss uncontrolled variables.']
 ],
 electric:[
  ['Circuit electric sigur cu baterie','Safe battery-powered circuit','Baterie de tensiune mică, beculeț, conductoare','Low-voltage battery, small bulb, insulated wires','Realizează doar un circuit cu baterie, fără priză. Observă diferența dintre circuit deschis și închis și desenează schema cu sursă și receptor.','Use only a low-voltage battery circuit, never mains power. Compare open and closed circuits and draw a labelled source-and-load diagram.'],
  ['Conductori și izolatori','Conductors and insulators','Baterie, beculeț, fire și obiecte uzuale sigure','Battery, small lamp, leads and safe household items','Testează pe rând obiecte uscate într-un circuit de tensiune mică. Notează când becul se aprinde; nu introduce lichide și nu scurtcircuita bateria.','Test dry objects one by one in a low-voltage circuit. Record whether the bulb lights; avoid liquids and battery short circuits.']
 ],
 waves:[
  ['Vibrația unei rigle','Vibration of a ruler','Riglă flexibilă, marginea unei mese','Flexible ruler, table edge','Fixează lungimi diferite ale riglei pe marginea mesei și las-o să vibreze ușor. Compară frecvența percepută cu lungimea liberă și disting-o de amplitudine.','Vibrate a flexible ruler with different free lengths over a table edge. Compare audible pitch with length and distinguish frequency from amplitude.'],
  ['Unde și reflexie','Wave motion and reflection','Arc moale sau coardă fixată, spațiu liber','Soft spring or rope with a fixed end, clear space','Propagă o pulsație lentă de-a lungul arcului; observă reflexia la capăt. Desenează propagarea perturbării și explică de ce materialul nu parcurge întreaga distanță.','Send a gentle pulse along a soft spring or rope and observe reflection. Sketch disturbance travel and explain why the material itself does not travel the whole route.']
 ],
 optics:[
  ['Umbre și distanță','Shadows and distance','Lanternă, obiect opac, ecran de hârtie','Torch, opaque object, paper screen','Schimbă distanța dintre lanternă și obiect și urmărește umbra pe hârtie. Menține ecranul fix și explică geometria razelor fără a privi o sursă intensă.','Change the distance from torch to object and observe the shadow on paper. Keep the screen fixed; interpret light rays without staring at a bright source.'],
  ['Legea reflexiei cu oglindă','Law of reflection using a mirror','Oglindă mică, lanternă difuză, hârtie','Small mirror, diffused torch, paper','Trasează normala la suprafața oglinzii. Desenează raza incidentă și cea reflectată folosind o sursă sigură, fără laser; compară unghiurile față de normală.','Draw the normal to a mirror. Sketch incoming and reflected rays with safe light, never a laser; compare angles to the normal.']
 ],
 electromagnetism:[
  ['Câmpul unui magnet','Mapping a magnet field','Magnet mic, agrafe și hârtie','Small magnet, paper clips and paper','Apropie agrafele de locuri diferite ale magnetului, fără a atinge dispozitive electronice. Notează variația atracției și desenează schematic direcțiile câmpului.','Move paper clips near different parts of a magnet, away from electronics. Record variations in attraction and sketch a qualitative field pattern.'],
  ['Electromagnet de tensiune mică','Low-voltage electromagnet','Baterie mică, sârmă izolată, cui de fier, adult','Small battery, insulated wire, iron nail, adult supervision','Sub supraveghere, conectează sârma în jurul cuiului pentru o durată foarte scurtă. Verifică atracția unei agrafe și deconectează imediat: conductorul se poate încălzi.','With adult supervision, briefly connect insulated wire wound around an iron nail to a small battery. Test attraction and disconnect immediately; a wire may heat up.']
 ],
 thermodynamics:[
  ['Temperatura și volumul gazului','Gas temperature and volume','Balon neumflat complet, două boluri cu apă călduță și rece','Partly inflated balloon, bowls of lukewarm and cool water','Compară vizual un balon în apă călduță și rece, fără apă fierbinte sau recipiente presurizate. Descrie ce variabile se schimbă și de ce comparația nu e o măsurare precisă a legii gazelor.','Compare a balloon in lukewarm and cool water, avoiding heat or pressurised containers. Identify changing variables and explain why the result is qualitative.'],
  ['Transfer energetic și bilanț','Energy transfer and balance','Două obiecte la temperatura camerei, termometru','Two room-temperature objects, thermometer','Descrie un sistem și mediul său, apoi estimează sensul transferului de energie fără a inventa date. Stabilește convenția Q și W și explică limita unui model ideal.','Define a system and surroundings. Predict the direction of energy transfer without inventing data; state heat/work sign conventions and ideal-model limits.']
 ],
 circuits:[
  ['Rezistoare în serie','Resistors in series','Baterie mică, doi rezistori, multimetru sub supraveghere','Small battery, two resistors, supervised multimeter','Montează doar un circuit de tensiune mică. Compară căderea de tensiune pe rezistoare și calculează R echivalentă; notează eroarea instrumentului.','Build a low-voltage-only circuit. Compare voltage drops and calculate equivalent resistance; record measurement uncertainty.'],
  ['Ramificații în paralel','Parallel circuit branches','Baterie mică, doi rezistori, fire izolate','Small battery, two resistors, insulated leads','Desenează nodurile înainte de conectare, apoi compară două ramuri la aceeași tensiune. Calculează intensitatea totală ca sumă de ramuri, fără priză.','Draw junctions before connecting a low-voltage circuit. Compare parallel branches and interpret total current as the sum of branch currents.']
 ],
 modern:[
  ['Simularea înjumătățirii','Modelling radioactive half-life','Douăzeci de monede, hârtie de înregistrare','Twenty coins, data recording sheet','Aruncă monedele în serii, îndepărtând de fiecare dată cele cu aceeași față. Notează numărul rămas și compară tendința cu înjumătățirea statistică; nu folosi substanțe radioactive.','Toss coins in rounds, removing those showing one face each round. Record survivors and compare statistical trends with half-life; no radioactive material is needed.'],
  ['Modelul cuantificării energiei','Modelling discrete energies','Hârtie, riglă, creioane colorate','Paper, ruler, coloured pencils','Desenează nivele discrete de energie și tranziții posibile; compară diferența de energie cu frecvența fotonului. Precizează că schema nu este un spectru măsurat.','Draw discrete energy levels and allowed transitions; relate energy differences to photon frequency. State that the model is not a measured spectrum.']
 ],
 measurement:[
  ['Date experimentale cu repetiții','Repeated experimental data','Riglă sau cronometru și caiet','Ruler or stopwatch and notebook','Realizează cinci citiri independente ale aceleiași mărimi, trece-le în tabel și calculează media. Discută dispersia, rezoluția și posibile erori sistematice.','Take five independent readings of the same quantity; tabulate and calculate the mean. Discuss spread, resolution and possible systematic error.'],
  ['Axe, grafice și reziduuri','Graphs, axes and residuals','Date tabelare, hârtie milimetrică sau calculator','Tabulated data, graph paper or calculator','Desenează un grafic cu unități pe ambele axe și o dreaptă de ajustare doar dacă modelul o justifică. Descrie un reziduu și de ce nu trebuie eliminat fără motiv.','Plot data with units on both axes, fitting a line only when justified. Explain a residual and why inconvenient points must not be silently deleted.']
 ]
});
export function physicsLaboratoryYearInvestigations({country='',grade='',stage='lower',topic='',yearPosition=0,lessons=[],language='ro'}={}){
 const options=PHYSICS_PRACTICAL_PROTOCOLS[String(topic)]||[];
 if(!options.length||!Array.isArray(lessons)||!lessons.length)return [];
 const isRo=language==='ro',position=Number.isFinite(Number(yearPosition))?
  Math.max(0,Number(yearPosition)):0;
 return options.map((protocol,i)=>{
  const entry=lessons[(position*2+i)%lessons.length];
  const title=isRo?protocol[0]:protocol[1];
  const materials=isRo?protocol[2]:protocol[3];
  const procedure=isRo?protocol[4]:protocol[5];
  const scientific=String(entry.statement||'');
  const worked=String(entry.workedExample||entry.example||'');
  const prompt=String(entry.exercise||'')+' '+
   (isRo?'În această activitate, descrie ce date ai măsura și cum ai verifica rezultatul.':
   'For this investigation, describe which data you would measure and how you would check the result.');
  const guide=String(entry.answer||'')+' '+
   (isRo?'Sunt necesare o ipoteză explicită, o metodă sigură, observații cu unități când se măsoară și o concluzie limitată la dovezi.':
   'A valid response states a hypothesis, safe method, measurements with units where relevant, and an evidence-limited conclusion.');
  const labels=isRo?
   ['Obiectiv și explicație','Materiale sigure','Procedură de investigare','Conceptul fizic al lecției','Exemplu și interpretare','Întrebare de verificare','Ce trebuie să conțină răspunsul']:
   ['Aim and explanation','Safe equipment','Investigation procedure','Physics concept from the lesson','Worked example and interpretation','Check question','What a complete answer needs'];
  const body=[
   '# '+title+' · '+String(entry.title||topic),
   '# '+labels[0],
   isRo?'Activitate didactică originală pentru anul de studiu '+String(grade)+'. Nu pretinde că sunt colectate date reale.':
    'Original guided investigation for study year '+String(grade)+'. No measurements are claimed to have been performed.',
   '# '+labels[1],materials,
   '# '+labels[2],procedure,
   '# '+labels[3],scientific,
   '# '+labels[4],worked,
   '# '+labels[5],prompt,
   '# '+labels[6],guide
  ].filter(Boolean).join('\n\n');
  return {
   id:'physics-practical-'+String(country)+'-'+String(grade)+'-'+String(topic)+'-'+i,
   title,ro:protocol[0],en:protocol[1],lesson:entry.title,
   source:'original-physics-year-lab',grade:String(grade),stage,
   body,review:{prompt,guide}
  };
 });
}
