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
  // The two protocols belong to the chapter, but the investigative aim and
  // measured evidence must progress through real school years. A repeated
  // fixed diagram or identical worksheet is NOT a new laboratory.
  // The last two arrays are bilingual and keep grade progression independent
  // of the country's numbering convention (e.g. VII, 7, Y8 or 4e).
  const phase=stage==='primary'?0:stage==='upper'?2:1;
  // The index coming from the school picker includes grades in which
  // standalone Physics is not yet offered. Progress laboratory demands from
  // the first *eligible subject year*, rather than the first school grade.
  const skippedBeforePhysics={
   RO:1,MD:1,HU:2,PL:2,PT:2,LV:1,BG:2,HR:2,SI:1,SK:1,
   LT:2,RS:1,ME:1,MK:1,UA:2,RU:2,BY:2
  };
  const subjectPosition=phase===1?Math.max(0,position-
   (skippedBeforePhysics[String(country).toUpperCase()]||0)):position;
  const depth=phase===0?0:phase===2?Math.min(2,1+Math.floor(position/2)):
   Math.min(2,subjectPosition);
  // Primary Science needs direct observations, not copied lower-secondary
  // equations hidden in the protocol. Only simple, supervised equipment is
  // permitted here; a more demanding investigation stays in later stages.
  const primaryMethods={
   units:[
    ['Așază două cărți la aceeași margine. Citește centimetrii cu rigla și notează ce ai comparat.',
     'Align two books at the same edge. Read their lengths on a ruler and record what you compared.'],
    ['Urmărește o jucărie între două repere. Măsoară durata cu un cronometru și notează de două ori.',
     'Time a toy between two marks using a stopwatch. Repeat and write down both readings.']
   ],
   kinematics:[
    ['Trasează pe hârtie locul de pornire și două poziții ale mașinuței. Spune în ce direcție se deplasează.',
     'Mark the starting point and two toy-car positions on paper. Describe the direction of travel.'],
    ['Desenează două trasee dintre aceleași puncte, unul drept și unul ocolit. Compară lungimile măsurate.',
     'Draw a direct path and a detour between the same points. Compare their measured lengths.']
   ],
   energy:[
    ['Lasă o minge să coboare de pe o rampă mică și descrie când se mișcă și când se oprește.',
     'Release a ball down a low ramp and describe when it moves and when it comes to rest.'],
    ['Pornește o lanternă cu baterie și identifică sursa energiei și efectul luminos, fără a o desface.',
     'Switch on a battery torch and identify its energy source and light output without opening it.']
   ],
   fluids:[
    ['Apasă ușor două obiecte cu baze diferite pe un burete. Compară urmele fără a calcula presiune.',
     'Gently press two objects with different bases on a sponge. Compare impressions without calculating pressure.'],
    ['Compară în apă o bilă din plastilină cu o formă de bărcuță din aceeași cantitate, sub supraveghere.',
     'Under supervision compare a clay ball and a boat shape made from the same amount of clay in water.']
   ],
   heat:[
    ['Citește cu un adult temperatura apei călduțe și repetă după câteva minute; nu folosi apă fierbinte.',
     'With an adult read lukewarm water temperature and repeat after a few minutes; do not use hot water.'],
    ['Compară două căni cu apă călduță, dintre care una este învelită în material textil. Notează diferențele.',
     'Compare two cups of lukewarm water, wrapping only one in cloth. Record differences.']
   ]
  };
  const primaryMethod=primaryMethods[topic]?.[i]?.[isRo?0:1]||
   (isRo?'Observă fenomenul cu materiale sigure, desenează ceea ce se schimbă și compară cu o a doua situație.':
    'Observe the phenomenon using safe materials, sketch what changes, and compare a second case.');
  const scopedProcedure=phase===0?primaryMethod:procedure;
  const focused={
   units:[
    ['Compară citirile a două obiecte cu o riglă și notează centimetrii, fără a ghici zecimale.','Măsoară de cinci ori aceeași dimensiune, calculează media și diferența maxim–minim cu unități.','Estimează incertitudinea unei arii calculate din două lungimi și justifică cifrele semnificative.'],
    ['Compare ruler readings for two objects; record centimetres without inventing decimals.','Repeat the same length measurement five times and calculate the mean and range with units.','Estimate uncertainty in an area derived from two lengths and justify significant figures.']],
   kinematics:[
    ['Marchează pozițiile unei jucării, ordonează-le după timp și arată direcția mișcării.','Trasează poziție–timp pe axe cu unități și calculează viteza medie pe două intervale.','Compară pantele pe graficul poziție–timp, estimează o viteză instantanee și discută eroarea de cronometrare.'],
    ['Mark successive toy positions, order them in time and identify the direction of motion.','Plot position against time with units and calculate mean speed over two intervals.','Compare gradients of position–time data, estimate an instantaneous velocity and discuss timing error.']],
   dynamics:[
    ['Desenează săgeți pentru împingere, greutate și reacțiune, fără a inventa forțe numerice.','Compară forța rezultantă pentru două înclinări și explică efectul frecării.','Testează un model F=ma cu date simulate etichetate, un grafic și analiza reziduurilor.'],
    ['Draw arrows for push, weight and reaction without inventing numerical forces.','Compare net force for two slopes and explain the contribution of friction.','Test an F=ma prediction with clearly labelled simulated data, a graph and residual analysis.']],
   energy:[
    ['Construiește un lanț de transfer energetic pentru un obiect care se deplasează.','Estimează energia potențială mgh pentru două înălțimi și compară pierderile.','Construiește un bilanț energetic măsurabil, cu randament, disipare și ipoteze explicite.'],
    ['Draw an energy-transfer chain for a moving object.','Estimate mgh at two release heights and compare dissipative losses.','Construct a measurable energy balance including efficiency, dissipation and explicit assumptions.']],
   fluids:[
    ['Compară plutirea a două forme de plastilină fără a confunda masa cu forma.','Măsoară aria de contact și compară presiunea p=F/A pentru două condiții.','Compară predicția hidrostatică p=ρgh cu un set de valori simulate și explică limitele măsurării.'],
    ['Compare how two shapes of modelling clay float without conflating mass and shape.','Measure contact area and compare p=F/A for two conditions.','Compare hydrostatic p=ρgh predictions with explicitly simulated readings and discuss measurement limits.']],
   heat:[
    ['Înregistrează dacă temperatura apei călduțe scade, folosind doar un termometru sigur.','Reprezintă T în funcție de timp și compară răcirea în două condiții controlate.','Calculează Q=mcΔT pentru un model și explică unde pierderile invalidează estimarea.'],
    ['Record whether lukewarm water cools using a safe thermometer.','Plot T against time and compare cooling under two controlled conditions.','Model Q=mcΔT and explain how losses invalidate the estimate.']],
   electric:[
    ['Identifică sursa, conductorii și receptorul într-un circuit numai cu baterie.','Măsoară sau modelează U și I la tensiune joasă și verifică raportul U/I.','Compară o caracteristică ohmică simulată cu una neliniară și justifică limita modelului.'],
    ['Identify source, conductors and load in a battery-only circuit.','Measure or model low-voltage U and I and check U/I.','Compare simulated ohmic and nonlinear current-voltage characteristics and explain validity limits.']],
   circuits:[
    ['Desenează o buclă închisă și explică unde poate circula curentul.','Compară rezistența echivalentă a doi rezistori în serie și paralel, numai cu baterie.','Verifică bilanțul de curent în noduri și puterea disipată într-un model Kirchhoff.'],
    ['Draw a closed loop and indicate where current can flow.','Compare equivalent resistance for two resistors in series and in parallel using battery voltage only.','Check junction current balance and dissipated power in a Kirchhoff model.']],
   waves:[
    ['Arată diferența dintre mișcarea unei rigle și propagarea unei perturbații.','Măsoară perioada unei oscilații și calculează frecvența în hertzi.','Compară v=fλ pentru două unde modelate și discută eroarea de eșantionare.'],
    ['Distinguish the motion of a vibrating ruler from propagation of a disturbance.','Measure oscillation period and calculate frequency in hertz.','Compare v=fλ for two modelled waves and discuss sampling uncertainty.']],
   optics:[
    ['Desenează raza incidentă și raza reflectată cu normala pe o foaie.','Compară unghiurile de reflexie și marchează incertitudinea unghiului.','Prezice poziția imaginii cu 1/f=1/u+1/v și explică aproximația lentilei subțiri.'],
    ['Draw incident and reflected rays with a normal on paper.','Compare reflection angles and estimate angular reading uncertainty.','Predict an image position with 1/f=1/u+1/v and discuss the thin-lens approximation.']],
   electromagnetism:[
    ['Observă ce materiale obișnuite sunt atrase de magnet; nu folosi prize.','Compară efectul numărului de spire asupra electromagnetului alimentat scurt din baterie.','Modelează inducția ε=−NΔΦ/Δt folosind doar date simulate și convenția de semne.'],
    ['Observe which ordinary materials respond to a magnet; avoid mains power.','Compare coil turns using a briefly powered battery electromagnet with supervision.','Model ε=−NΔΦ/Δt from simulated data and state the sign convention.']],
   thermodynamics:[
    ['Compară două schimbări de temperatură fără a confunda căldura cu temperatura.','Descrie un sistem și bilanțul de energie pentru un proces la presiune aproximativ constantă.','Calculează lucrul pΔV și variația energiei interne cu convenție explicită pentru Q și W.'],
    ['Compare two temperature changes without conflating heat with temperature.','Identify a system and an energy balance for an approximately constant-pressure process.','Calculate pΔV work and internal energy change with a stated convention for Q and W.']],
   measurement:[
    ['Înregistrează trei observații cu unități și arată ce poate fi citit efectiv.','Compară dispersia a cinci citiri, media și rezoluția instrumentului.','Trasează reziduuri pentru un model liniar și distinge eroarea sistematică de variația aleatorie.'],
    ['Record three readings with units and show what can actually be read.','Compare the spread, mean and instrument resolution from five readings.','Plot residuals for a linear model and distinguish systematic from random errors.']],
   modern:[
    ['Construiește din hârtie un model al unor niveluri de energie; nu pretinde observații reale.','Compară frecvențele a două tranziții ipotetice cu E=hf, având unități coerente.','Analizează limitele unui model clasic față de tranziții cuantice și separă modelarea de date măsurate.'],
    ['Build a paper model of energy levels without claiming real observations.','Compare frequencies for two hypothetical transitions using E=hf and consistent units.','Analyse why a classical model fails for discrete quantum transitions and separate models from measurements.']]
  };
  const focus=focused[topic]?.[isRo?0:1]?.[depth]||procedure;
  const labelsDepth=isRo?
   ['Observare sigură și identificarea variabilelor','Măsurare, tabel și calcule','Predicție, incertitudine și validitatea modelului']:
   ['Safe observation and identifying variables','Measurement, table and calculation','Prediction, uncertainty and model validity'];
  const ageAppropriate=phase===0? (isRo?
   'Etapa primară: folosește doar observații și comparații, fără formule avansate.':
   'Primary stage: use observations and comparisons without advanced equations.') :
   phase===1? (isRo?'Etapa gimnazială: notează unitățile și justifică metoda.':
   'Lower-secondary stage: record units and justify the method.') :
   (isRo?'Etapa liceală: argumentează modelul, ipotezele și incertitudinea.':
   'Upper-secondary stage: justify the model, assumptions and uncertainty.');
  const scientific=String(entry.statement||'');
  const worked=phase===0?'':String(entry.workedExample||entry.example||'');
  const prompt=title+': '+focus+' '+
   (isRo?'Aplică acest obiectiv la lecția «':'Apply this aim to the lesson “')+
   String(entry.title||topic)+(isRo?'»: ':'”: ')+String(entry.exercise||'')+' '+
   (isRo?'Precizează dovezile specifice investigației și cum verifici rezultatul.':
   'State evidence specific to this investigation and how to verify the result.');
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
   '# '+labels[2],scopedProcedure,
   '# '+labelsDepth[depth],ageAppropriate+' '+focus,
   '# '+labels[3],scientific,
   '# '+labels[4],worked,
   '# '+labels[5],prompt,
   '# '+labels[6],guide
  ].filter(Boolean).join('\n\n');
  return {
   id:'physics-practical-'+String(country)+'-'+String(grade)+'-'+String(topic)+'-'+i,
   title:title+' · '+String(entry.title||topic),
   ro:protocol[0],en:protocol[1],lesson:entry.title,
   source:'original-physics-year-lab',grade:String(grade),stage,
   body,review:{prompt,guide}
  };
 });
}
