import {SCIENCE_GUIDES_EN} from './science_english_reference_guides.mjs';
import {scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {SCIENCE_GUIDES} from './science_extended_theory.mjs';
// Pan-European advisory science progression, not a national curriculum or textbook.
// Country-specific school-year labels come from the existing country picker.
// Subject knowledge and scientific enquiry are sequenced together.
// Framework references:
// https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study
// https://pisa-framework.oecd.org/science-2025/
// https://www.cambridge-community.org.uk/guide-to/cambridge-lower-secondary/science/
export const SCIENCE_PROGRESSION_SOURCES=Object.freeze([
 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',
 'https://pisa-framework.oecd.org/science-2025/',
 'https://www.cambridge-community.org.uk/guide-to/cambridge-lower-secondary/science/'
]);
// Each entry is a teaching order, not an assertion about any country's mandatory syllabus.
// The sequences deliberately change between school years; generic minLevel filtering
// previously displayed virtually identical chapters for every grade.
export const SCIENCE_ADVISORY_PROGRESSION=Object.freeze({
 primary:{
  physics:[['units','energy'],['heat','energy','units'],['kinematics','energy','heat'],['units','kinematics','fluids','energy']],
  chemistry:[['fundamentals'],['fundamentals','solutions'],['fundamentals','solutions'],['fundamentals','solutions','reactions']],
  biology:[['plants','ecology'],['plants','anatomy','ecology'],['anatomy','cells','ecology'],['cells','ecology','evolution','plants']],
  astronomy:[['sky','solar'],['solar','observations'],['sky','solar','observations'],['solar','sky','distances','observations']]
 },
 lower:{
  physics:[['units','kinematics','heat','energy'],['units','dynamics','fluids','electric'],['kinematics','dynamics','energy','electric'],['energy','electric','heat','fluids','kinematics']],
  chemistry:[['fundamentals','atomic','periodic'],['atomic','periodic','bonding','reactions'],['reactions','inorganic','solutions','acids'],['solutions','acids','reactions','inorganic']],
  biology:[['plants','ecology','cells'],['cells','anatomy','plants','ecology'],['genetics','evolution','cells','ecology'],['anatomy','genetics','ecology','evolution']],
  astronomy:[['solar','sky','observations'],['sky','distances','stars'],['solar','distances','observations'],['stars','solar','observations','distances']]
 },
 upper:{
  physics:[['units','kinematics','dynamics','measurement'],['heat','thermodynamics','waves','optics'],['electric','circuits','electromagnetism','measurement'],['modern','measurement','energy','waves']],
  chemistry:[['fundamentals','atomic','periodic','bonding'],['reactions','inorganic','solutions','acids'],['organic','physical','solutions','reactions'],['organic','electrochem','analytical','biochemistry']],
  biology:[['cells','biomolecules','genetics','ecology'],['anatomy','homeostasis','microbes'],['genetics','evolution','methods','ecology'],['biomolecules','homeostasis','methods','microbes']],
  astronomy:[['solar','sky','gravity','distances'],['stars','galaxies','observations'],['cosmology','exoplanets','gravity'],['cosmology','stars','galaxies','observations']]
 }
});
const rank=Object.freeze({beginner:0,intermediate:1,advanced:2});
export function scienceGradeTopicPlan({country='',subject='',stage='lower',grade='',years=[],topics=[]}={}){
 const rows=SCIENCE_ADVISORY_PROGRESSION[stage]?.[subject]||[];
 const yearList=Array.isArray(years)?years:[];
 const yearIndex=yearList.findIndex(y=>String(y?.id)===String(grade));
 if(!rows.length||yearIndex<0||!grade){
  return {country,subject,stage,grade,status:'invalid-selection',topics:[],source:null};
 }
 // Map the pupil's position within their actual country stage; we never
 // re-label a Hungarian, French, Scottish, etc. year as a Romanian one.
 const sequenceIndex=yearList.length===1?0:
  Math.round(yearIndex*(rows.length-1)/(yearList.length-1));
 const selected=rows[sequenceIndex]||rows[0];
 const max=stage==='upper'?1:0;
 const rank={beginner:0,intermediate:1,advanced:2};
 const indexed=new Map(topics.filter(x=>x&&!x.specialty).map(x=>[x.id,x]));
 const ordered=selected.map(id=>indexed.get(id)).filter(x=>
  x&&((rank[x.minLevel]??0)<=max || stage==='primary'&&subject==='chemistry'&&x.id==='solutions'));
 const unique=[...new Map(ordered.map(x=>[x.id,x])).values()];
 // Never hide the whole subject because a national stage has an unverified
 // grade map: a known, clearly marked general course is always available.
 const fallback=topics.filter(x=>x&&!x.specialty&&(rank[x.minLevel]??0)<=max).slice(0,3);
 return {
  country,subject,stage,grade,status:'general-learning',
  topics:unique.length?unique:fallback,
  sequenceIndex,yearIndex,yearCount:yearList.length,
  source:SCIENCE_PROGRESSION_SOURCES,
  note:'Parcurs generic de studiu, nu programa obligatorie a țării sau manualul clasei.',
  astronomyOptional:subject==='astronomy'
 };
}
export const SCIENCE_PRIMARY_LESSON_BANK=Object.freeze({
 physics:{
  units:['Măsurăm și comparăm','Un obiect poate fi mai lung, mai greu ori mai cald decât altul. Pentru a compara corect folosim aceeași unitate și același instrument.','Măsoară de trei ori lungimea unei cărți cu rigla. Compară rezultatele și explică diferențele.'],
  energy:['Schimbări și energie','Lumina, mișcarea și căldura sunt legate de transferuri de energie. Energia nu este o substanță pe care o putem vedea.','Observă o jucărie care coboară pe o rampă. Ce se schimbă când ridici începutul rampei?'],
  heat:['Cald, rece și temperatură','Temperatura descrie cât de cald sau rece este un corp. Căldura se transferă de la un corp mai cald la unul mai rece.','Compară două recipiente cu apă folosind un termometru, cu ajutorul unui adult.'],
  kinematics:['Cum descriem mișcarea','Descriem mișcarea prin poziție, direcție și timpul scurs. Două trasee de aceeași lungime pot necesita timpi diferiți.','Marchează un traseu scurt și măsoară cât durează o deplasare lentă și una rapidă.'],
  fluids:['Lichide și presiune','Lichidele curg și iau forma vasului, dar păstrează aproximativ același volum când sunt turnate cu grijă.','Toarnă aceeași cantitate de apă în două vase de forme diferite. Ce se schimbă?']
 },
 chemistry:{
  fundamentals:['Materiale și proprietăți','Apa, hârtia, lemnul și metalul sunt materiale cu proprietăți diferite. Unele schimbări pot fi inversate, altele formează substanțe noi.','Grupează obiecte după aspect, flexibilitate și comportamentul în apă; nu gusta substanțe.'],
  solutions:['Amestecuri din viața de zi cu zi','Unele materiale se dizolvă în apă, iar altele rămân vizibile. Dizolvarea nu înseamnă dispariția materiei.','Amestecă puțină sare în apă și compară cu nisipul; nu consuma amestecurile.'],
  reactions:['Schimbări observabile','O reacție chimică poate forma substanțe cu alte proprietăți. Nu orice schimbare de formă este o reacție chimică.','Compară topirea gheții cu coacerea alimentelor doar prin observație; explică diferențele.']
 },
 biology:{
  plants:['Plantele au nevoie de resurse','Plantele folosesc apă, lumină și substanțe minerale. Rădăcinile, tulpinile și frunzele îndeplinesc roluri diferite.','Urmărește o plantă câteva zile și notează unde apar frunzele noi.'],
  ecology:['Viețuitoare și mediu','Viețuitoarele au nevoie de hrană, apă și un habitat potrivit. Un ecosistem conține viețuitoare și elemente nevii.','Observă un spațiu verde și notează plantele, insectele și sursele de apă.'],
  anatomy:['Corpul și sănătatea','Corpul are organe și sisteme care lucrează împreună. Inima ajută sângele să circule, iar plămânii participă la schimbul de gaze.','Numără respirațiile înainte și după o plimbare ușoară; compară fără a forța corpul.'],
  cells:['Din ce sunt alcătuite organismele','Plantele și animalele sunt alcătuite din celule. Multe celule nu pot fi văzute fără microscop.','Compară o frunză și un fir de păr: ce vezi cu ochiul liber și ce ar necesita mărire?'],
  evolution:['Diversitate și adaptare','Organismele diferă între ele și au trăsături care le ajută să supraviețuiască în anumite medii.','Compară forma ciocului la două păsări desenate și propune ce hrană ar putea folosi.']
 },
 astronomy:{
  sky:['Cerul se schimbă aparent','Soarele pare să traverseze cerul deoarece Pământul se rotește. Stelele se văd noaptea în condiții potrivite.','Desenează poziția umbrei la două ore diferite. Nu privi direct Soarele.'],
  solar:['Vecinii Pământului','Pământul este o planetă ce se rotește în jurul Soarelui. Luna este satelitul natural al Pământului.','Construiește un model simplu cu bile de dimensiuni simbolice, fără a pretinde scară exactă.'],
  observations:['Observăm și notăm','O observație bună include data, ora, locul și condițiile cerului. Un desen este mai util dacă este etichetat.','Ține un jurnal al fazelor Lunii timp de câteva seri, dacă cerul permite.'],
  distances:['Distanțe în spațiu','În spațiu, distanțele sunt uriașe; lumina are o viteză finită. Modelele cu bile sunt utile, dar rar păstrează scara.','Explică de ce nu putem așeza planetele la distanțe reale într-o cameră.']
 }
});
export const SCIENCE_PRIMARY_ENGLISH=Object.freeze({
 physics:{
  units:['Measuring and comparing','Objects can differ in length, mass and temperature. Use a consistent unit and tool for reliable comparisons.','Measure the length of a book three times. Explain any differences.'],
  energy:['Changes and energy','Light, motion and heat involve energy transfers. Energy is not a visible material.','Observe a toy moving down a ramp. What changes when the ramp is raised?'],
  heat:['Temperature and heat','Temperature describes how hot or cold something is. Heat transfers from warmer objects to cooler ones.','Compare water temperatures with a thermometer under adult supervision.'],
  kinematics:['Describing motion','We can describe motion by position, direction and elapsed time. Similar journeys can take different amounts of time.','Measure the time taken to move slowly and quickly along the same short path.'],
  fluids:['Liquids and containers','Liquids flow and take the shape of their container, while retaining approximately the same volume when poured carefully.','Pour the same amount of water into containers of different shapes. What changes?']
 },
 chemistry:{
  fundamentals:['Materials and their properties','Water, paper, wood and metals have different properties. Some changes are reversible while others form new substances.','Group safe objects by appearance, flexibility and behaviour in water; never taste chemicals.'],
  solutions:['Everyday mixtures','Some materials dissolve in water while others remain visible. Dissolving does not mean matter disappears.','Compare a little salt dissolved in water with sand mixed in water. Do not drink the mixtures.'],
  reactions:['Observable changes','Chemical reactions can form substances with new properties. A change in shape is not necessarily a chemical reaction.','Compare ice melting with food baking by observation only; explain the differences.']
 },
 biology:{
  plants:['What plants need','Plants need water, light and minerals. Roots, stems and leaves have different roles.','Observe a plant for a few days and record where new leaves appear.'],
  ecology:['Organisms and habitats','Living things need food, water and appropriate habitats. Ecosystems include living and nonliving parts.','Observe a green space and note plants, insects and water sources.'],
  anatomy:['Our body and health','Organs and body systems work together. The heart moves blood and lungs exchange gases.','Count breaths before and after a gentle walk, without straining yourself.'],
  cells:['What living things are made of','Plants and animals are made of cells. Many cells are too small to see without a microscope.','Compare a leaf and a hair. Which details need magnification?'],
  evolution:['Diversity and adaptation','Living things vary and have traits that help them survive in particular environments.','Compare the beaks of two pictured birds and suggest what they might eat.']
 },
 astronomy:{
  sky:['Changes in the sky','The Sun appears to move across the sky mainly because Earth rotates. Stars may be visible at night.','Draw the position of a shadow at two different times. Never look directly at the Sun.'],
  solar:['Earth and its neighbours','Earth is a planet orbiting the Sun. The Moon is Earth’s natural satellite.','Make a simple model with balls, clearly stating that distances and sizes are not to scale.'],
  observations:['Looking and recording','A useful observation includes date, time, location and sky conditions. Labelled drawings preserve details.','Keep a journal of the Moon’s shape over several clear evenings.'],
  distances:['Distances in space','Space distances are enormous and light takes time to travel. Models are helpful but rarely use a true scale.','Explain why real interplanetary distances cannot be reproduced inside a room.']
 }
});
// Independently authored explanatory layers: observation, example, and a misconception
// for EVERY primary Science topic, instead of a one-paragraph lesson.
export const SCIENCE_PRIMARY_DEPTH=Object.freeze({
 physics:{
  units:{
   ro:['Pentru a compara două măsurători trebuie să alegem aceeași unitate: dacă o carte are 24 cm și alta 30 cm, a doua este cu 6 cm mai lungă. Metrul și centimetrul măsoară lungimi; kilogramul și gramul măsoară mase.','Exemplu explicat: o riglă pusă strâmb sau care nu începe de la zero poate da un rezultat greșit. Măsurăm de la marcajul zero, privim gradația drept deasupra și repetăm.','Nu confunda masa cu greutatea: pentru o activitate de bază poți compara masele unor obiecte, dar în fizică greutatea este o forță.'],
   en:['A fair comparison uses the same unit. If one book is 24 cm long and another is 30 cm long, the second is 6 cm longer. Metres and centimetres measure length; kilograms and grams measure mass.','Worked example: if a ruler starts away from zero or is placed at an angle, it can give a wrong reading. Align its zero mark, look straight down at the scale and repeat the measurement.','Do not confuse mass and weight: their meanings are related but distinct in physics.']
  },
  energy:{
   ro:['Când o jucărie coboară pe o rampă, energia asociată poziției sale se poate transforma în energie de mișcare. O parte se transferă și în mediul înconjurător, de exemplu prin frecare și sunet.','Exemplu: două rampe cu înălțimi diferite nu produc obligatoriu aceeași mișcare; observă atent și păstrează aceeași jucărie. Notează ce modifici și ce măsori.','Nu afirma că energia „dispare” când obiectul se oprește: energia se transferă în alte forme.'],
   en:['As a toy moves down a ramp, energy associated with its position can become energy of motion. Some is transferred into the environment, for example through friction and sound.','Example: ramps of different heights may lead to different motion. Use the same toy, change just one property at a time and record what you observe.','Energy does not simply disappear when the toy stops; it is transferred into other forms.']
  },
  heat:{
   ro:['Temperatura unui obiect nu este același lucru cu energia totală din el. Un vas mare de apă călduță și o cană mică de apă fierbinte pot avea temperaturi diferite și cantități diferite de energie.','Exemplu explicat: termometrul arată un număr în grade. Citește numai după stabilizarea afișajului și compară rezultatele în aceeași unitate.','Nu testa temperatura lichidelor fierbinți cu mâna. Observațiile se fac cu un adult și cu apă sigură.'],
   en:['Temperature is not the same as total thermal energy. A large container of lukewarm water and a small cup of hot water can have different temperatures and different amounts of energy.','Worked example: a thermometer shows a value in degrees. Let the reading settle and compare results in the same unit.','Never test hot liquids with your hand. Use safe water and adult supervision.']
  },
  kinematics:{
   ro:['Pentru a descrie mișcarea trebuie să precizăm față de ce obiect observăm poziția. Spunem că o mașinuță se apropie de o linie marcată ori se depărtează de ea.','Exemplu: dacă două mașinuțe merg pe același traseu, cea care ajunge într-un timp mai scurt are o viteză medie mai mare, presupunând aceeași distanță.','Nu confunda distanța parcursă cu direcția deplasării; un obiect poate reveni la punctul de plecare după ce a parcurs un drum lung.'],
   en:['Movement is described relative to a reference point. A toy car moves towards or away from a marked line.','Example: if two toy cars travel the same distance, the one that arrives sooner has the greater average speed.','Distance travelled and direction of movement are different ideas; an object can return to its starting point after travelling far.']
  },
  fluids:{
   ro:['Apa poate umple fundul unui vas înalt sau al unuia lat. Forma suprafeței ocupate de lichid se schimbă, dar cantitatea de apă rămâne aceeași dacă nu se varsă nimic.','Exemplu: marchează volumul dintr-un pahar gradat, varsă cu grijă apa într-un alt vas și apoi măsoară din nou. Notează erorile posibile de turnare.','Nu presupune că un vas mai înalt conține automat mai mult lichid. Contează și lățimea și forma lui.'],
   en:['Water can fill the bottom of a tall container or a wide one. Its shape changes but the amount of water stays the same if none spills.','Example: mark the volume on a measuring jug, transfer the water carefully and then measure again. Record any possible loss.','A taller container does not necessarily hold more liquid; width and shape matter too.']
  }
 },
 chemistry:{
  fundamentals:{
   ro:['Proprietățile unui material pot include culoarea, duritatea, flexibilitatea, transparența și conductivitatea. Nu orice proprietate se testează acasă: unele materiale pot fi periculoase.','Exemplu: hârtia și aluminiul pot avea culori asemănătoare, dar reacționează diferit când sunt îndoite. Observă fără să rupi obiecte periculoase sau să încălzești materiale.','O schimbare de mărime, cum este ruperea hârtiei, nu dovedește formarea unei substanțe noi.'],
   en:['Materials have properties such as colour, hardness, flexibility, transparency and conductivity. Some tests are unsafe at home and should not be attempted.','Example: paper and aluminium foil may look similar in colour but bend differently. Observe safely without heating unknown materials.','Changing the size of a material, such as tearing paper, does not prove that a new substance has formed.']
  },
  solutions:{
   ro:['Într-o soluție, particulele substanței dizolvate se distribuie în solvent. Uneori soluția arată complet transparentă chiar dacă materia este încă prezentă.','Exemplu: sarea se poate dizolva în apă; nisipul rămâne un amestec cu particule vizibile. Ambele exemple conțin materie și pot fi comparate prin observații.','Nu spune că sarea „s-a evaporat” când nu o mai vezi. Dizolvarea și evaporarea sunt procese diferite.'],
   en:['In a solution, dissolved particles are distributed through the solvent. A liquid may look clear even when dissolved matter is present.','Example: salt can dissolve in water; sand remains as visible particles. Both systems still contain matter.','Salt has not evaporated merely because you cannot see it. Dissolving and evaporation are different processes.']
  },
  reactions:{
   ro:['Schimbările chimice pot fi însoțite de schimbări de culoare, formare de gaze ori temperatură, dar un singur semn nu este întotdeauna dovadă sigură. Interpretarea cere mai multă informație.','Exemplu: gheața care se topește rămâne apă, pe când coacerea unui aluat produce transformări chimice complexe. Observă procese cunoscute, nu realiza experimente improvizate.','Nu confunda simpla amestecare cu o reacție chimică; unele amestecuri pot fi separate fără formarea altor substanțe.'],
   en:['Chemical changes may involve colour changes, gas release or temperature changes, but one visible sign alone is not conclusive. We need evidence to decide what happened.','Example: melting ice remains water, while baking dough involves complex chemical changes. Observe familiar examples rather than improvising experiments.','Mixing materials does not automatically produce a chemical reaction.']
  }
 },
 biology:{
  plants:{
   ro:['Rădăcinile absorb apă și săruri minerale, tulpina susține planta, iar frunzele folosesc lumina pentru fotosinteză. Speciile diferă: nu toate frunzele au aceeași formă.','Exemplu: compară două plante crescute în locuri cu lumină diferită, fără a le priva de resurse sau a le deteriora. Notează forma și culoarea frunzelor.','Nu crede că plantele „mănâncă pământ”. Ele își produc multe dintre substanțele organice prin fotosinteză din dioxid de carbon și apă.'],
   en:['Roots take up water and minerals, stems support the plant and leaves use light for photosynthesis. Species differ, so leaves are not all shaped alike.','Example: compare plants in different safe light conditions and record leaf shape and colour without harming them.','Plants do not eat soil; photosynthesis uses carbon dioxide and water to build organic substances.']
  },
  ecology:{
   ro:['Habitatul oferă condițiile necesare vieții. Un copac poate oferi hrană și adăpost mai multor specii, dar dependențele dintre viețuitoare pot forma rețele alimentare complexe.','Exemplu: într-un parc, observă iarba, insectele și păsările. Desenează săgeți care arată cine se hrănește cu cine, fără a pretinde că știi toate relațiile.','Nu confunda habitatul cu un animal: habitatul este mediul în care acesta trăiește.'],
   en:['A habitat provides the conditions needed for life. A tree may offer food and shelter to many species, while organisms interact through food webs.','Example: observe grass, insects and birds in a park and sketch possible feeding relationships, marking uncertain ones as hypotheses.','A habitat is the place and conditions in which an organism lives, not the organism itself.']
  },
  anatomy:{
   ro:['La fiecare inspirație aerul intră în plămâni, iar oxigenul poate trece în sânge la nivelul alveolelor. Inima ajută sângele să circule prin corp.','Exemplu: ritmul respirației poate crește după activitate ușoară. Observă fără să îți ții respirația sau să faci efort excesiv.','Respirația și pulsul nu sunt același lucru. Fiecare este o măsurătoare diferită, iar valorile diferă de la o persoană la alta.'],
   en:['During inhalation air enters the lungs and oxygen can pass into the blood at the alveoli. The heart helps blood circulate.','Example: breathing rate may rise after gentle movement. Observe without breath-holding or overexertion.','Breathing rate and pulse are different measurements and vary among people.']
  },
  cells:{
   ro:['Celulele sunt unități vii cu membrane, material genetic și structuri interne. Celulele plantelor și animalelor au multe componente comune, dar și diferențe, precum peretele celular al celulelor vegetale.','Exemplu: desenează un model de celulă vegetală și unul de celulă animală; marchează membrana și nucleul doar acolo unde există în celula aleasă.','Nu toate celulele au nucleu: bacteriile nu au un nucleu delimitat de membrană.'],
   en:['Cells are living units with membranes, genetic material and internal structures. Plant and animal cells share many components but differ, for example in the plant cell wall.','Example: draw models of a plant and an animal cell and label their parts accurately.','Not every cell has a membrane-bound nucleus; bacteria do not.']
  },
  evolution:{
   ro:['Într-o populație există diferențe între indivizi. Unele trăsături pot favoriza supraviețuirea și reproducerea într-un mediu; de-a lungul generațiilor, frecvența lor se poate schimba.','Exemplu: ciocurile păsărilor pot fi adaptate hranei disponibile. Explică un avantaj posibil, dar nu deduce fără dovezi dieta exactă a unei specii.','Un individ nu își schimbă voit trăsăturile ereditare pentru că „are nevoie”. Evoluția se observă la populații, în generații.'],
   en:['Individuals in a population vary. Some inherited traits can improve survival and reproduction in particular conditions; their frequency may change over generations.','Example: bird beak shapes can be related to available food. Suggest a plausible advantage without claiming certainty about a species.','An individual does not intentionally evolve an inherited trait because it needs one. Evolution concerns populations over generations.']
  }
 },
 astronomy:{
  sky:{
   ro:['Alternanța dintre zi și noapte se explică prin rotația Pământului în jurul axei sale. Aspectul cerului se schimbă și în funcție de locul observării și de anotimp.','Exemplu: umbrele obiectelor pot avea lungimi și direcții diferite la ore diferite. Marchează observațiile cu ora și vremea; nu observa direct discul solar.','Nu spune că Soarele înconjoară Pământul în fiecare zi. Mișcarea sa zilnică pe cer este în principal aparentă.'],
   en:['Day and night follow from Earth rotating on its axis. The visible sky also depends on observing location and season.','Example: shadows can differ in direction and length at different times. Record the time and weather and never view the Sun directly.','The Sun does not circle Earth each day; its daily path across the sky is mostly apparent.']
  },
  solar:{
   ro:['Planetele se deplasează pe orbite în jurul Soarelui, iar Luna se deplasează în jurul Pământului. Dimensiunile și distanțele reale sunt foarte diferite de cele din imagini simple.','Exemplu: folosește o minge pentru Pământ și una pentru Lună pentru a modela mișcările, dar etichetează explicit că scara nu este păstrată.','Nu confunda rotația în jurul propriei axe cu revoluția în jurul altui corp. Sunt mișcări diferite.'],
   en:['Planets orbit the Sun and the Moon orbits Earth. Real distances and sizes are very different from what small classroom models show.','Example: use balls to model Earth and Moon motion, but explicitly label the model as not to scale.','Rotation about an axis and revolution around another body are different types of motion.']
  },
  observations:{
   ro:['O observație științifică este mai utilă când poate fi repetată: notează data, ora, condițiile și instrumentele. Un jurnal îți permite să compari mai multe seri.','Exemplu: desenează aproximativ forma Lunii câteva seri, la ore asemănătoare. Faptul că nu o vezi într-o seară înnorată nu dovedește că a dispărut.','Nu inventa poziții exacte ale planetelor fără un calendar astronomic sau observații reale.'],
   en:['Scientific observations become more useful when repeated and recorded with date, time, conditions and tools. A journal allows comparisons across evenings.','Example: sketch the Moon over several evenings at similar times. A cloudy night is not evidence that the Moon disappeared.','Do not claim exact current planet positions without a real ephemeris or observation.']
  },
  distances:{
   ro:['Distanța de la Pământ la Soare este mult mai mare decât cea până la Lună. Un an-lumină este o unitate de distanță, nu o durată; descrie cât parcurge lumina într-un an.','Exemplu: când desenăm planetele apropiate ca dimensiune și la intervale mici, folosim un model didactic, nu o hartă la scară.','Nu compara dimensiunea aparentă dintr-o fotografie cu diametrul real fără să ții cont de distanță.'],
   en:['The Sun is much farther from Earth than the Moon. A light-year is a unit of distance, not time: it is the distance light travels in one year.','Example: small classroom planet diagrams show concepts but rarely preserve real distances and sizes.','An object’s apparent size in a photo is not its true diameter; distance matters.']
  }
 }
});
export function scienceGradeLessonFrame({subject,stage,grade,topic,chapter,language='ro',gradePosition=0}={}){
 if(stage==='primary'){
  const lesson=SCIENCE_PRIMARY_LESSON_BANK[subject]?.[topic];
  if(!lesson)return null;
  const details=SCIENCE_PRIMARY_DEPTH[subject]?.[topic]||null;
  const progress=Math.max(0,Math.min(3,Number.isFinite(Number(gradePosition))?Number(gradePosition):0));
  const roProgress=['Observă și descrie proprietățile folosind cuvinte clare.','Compară două exemple și explică asemănările și deosebirile.','Fă o măsurătoare simplă ori un tabel și explică ce arată datele.','Formulează o explicație bazată pe dovezi și menționează o limită a modelului.'];
  const enProgress=['Observe and describe the relevant properties.','Compare two examples and explain similarities and differences.','Make a simple measurement or table and interpret the data.','Give an evidence-based explanation and state a limitation of the model.'];
  if(language!=='ro'){
  const english=SCIENCE_PRIMARY_ENGLISH[subject]?.[topic]||lesson;
  return [
   'GENERAL SCIENCE · Advisory study route · Grade '+grade,
   'Lesson: '+english[0],
   'Explore: '+english[1],
   'Observation: '+english[2],
   ...(details?.en?['Explanation: '+details.en[0],'Worked example: '+details.en[1],'Check a common misconception: '+details.en[2]]:[]),
   'Skill for this year: '+enProgress[progress],
   'Review: Describe what you observed, how you compared the evidence, and what remains uncertain.',
   'This is an original introductory lesson, not an official national textbook.'
  ].join('\n\n');
 }
  return [
   'ȘTIINȚE · Program general · Clasa/anul '+grade,
   'Lecție: '+lesson[0],
   'Explicație: '+lesson[1],
   'Exemplu și activitate: '+lesson[2],
   ...(details?.ro?['Explicație detaliată: '+details.ro[0],'Exemplu explicat: '+details.ro[1],'Atenție la confuzii: '+details.ro[2]]:[]),
   'Competența acestei clase: '+roProgress[progress],
   'Exercițiu: Scrie două observații și explică prin ce se deosebesc de o presupunere.',
   'Verificare: Ce ai măsurat sau observat? Ce dovadă ai? Ce nu poți concluziona încă?',
   'Material didactic original, orientativ. Nu este un manual național oficial.'
  ].join('\n\n');
 }
 if(stage==='lower'){
  const actual=scienceLowerTopicContent(subject,topic,language);
  if(!actual)return null; // Never replace absent core science with generic filler.
  const position=Math.max(0,Math.min(3,Number.isFinite(Number(gradePosition))?
   Number(gradePosition):0));
  const tasksRo=[
   'Identifică noțiunea și observă un exemplu concret.',
   'Compară două situații și explică diferența pe baza conceptului.',
   'Rezolvă exercițiul prin pași clari și controlează unitățile sau datele.',
   'Justifică răspunsul, propune o verificare și precizează limitele modelului.'
  ];
  const tasksEn=[
   'Identify the concept and observe a concrete example.',
   'Compare two situations using the idea you have learned.',
   'Solve the exercise in clear steps and check quantities and units.',
   'Justify your answer, suggest a check and describe a limitation.'
  ];
  const safe={chemistry:['Nu gusta substanțe și nu amesteca produse necunoscute.',
    'Never taste or mix unknown chemicals.'],
   physics:['Pentru electricitate, nu utiliza prize sau cabluri ale rețelei.',
    'Never experiment with mains electricity.'],
   astronomy:['Nu privi direct Soarele, nici prin instrumente fără filtre certificate.',
    'Never look directly at the Sun without certified solar viewing equipment.'],
   biology:['Observă viețuitoarele fără să le rănești și nu efectua teste medicale.',
    'Observe organisms without harming them; do not conduct medical tests.']}[subject]||['',''];
  if(language==='ro')return [
   'ȘTIINȚE · Gimnaziu · Clasa/anul '+grade+' · Parcurs general orientativ',
   '# '+actual.title,
   '# Explicația lecției\n'+actual.explanation,
   '# Exemplu rezolvat\n'+actual.workedExample,
   '# Exercițiu\n'+actual.exercise,
   '# Cum verifici\n'+actual.answer,
   '# Investigație și competența clasei\nInvestigație: '+tasksRo[position],
   '# Observă în siguranță\n'+safe[0],
   'Lecție originală, nu o pagină dintr-un manual național verificat.'
  ].join('\n\n');
  return [
   'SCIENCE · Lower secondary · Year '+grade+' · General advisory learning route',
   '# '+actual.title,
   '# Explanation\n'+actual.explanation,
   '# Worked example\n'+actual.workedExample,
   '# Practice exercise\n'+actual.exercise,
   '# Check your answer\n'+actual.answer,
   '# Enquiry and skill for this year\nEnquiry: '+tasksEn[position],
   '# Safety\n'+safe[1],
   language!=='en'?'English reference lesson: local-language translation is not verified.':'Original lesson; not a certified national textbook.'
  ].join('\n\n');
 }
 const guide=SCIENCE_GUIDES[subject]?.[topic];
 // Upper secondary uses the detailed subject-specific offline chapter,
 // appended by scienceExtendedTheory(), rather than a generic fake lesson.
 const target=stage==='upper'?'liceu':'universitar';
 const challenge=guide?.[3]||'Explică ce date și dovezi îți trebuie pentru a interpreta corect acest capitol.';
 if(language==='ro')return [
  'ȘTIINȚE · Nivel '+target+' · Clasa/anul '+grade,
  'Capitol ales: '+chapter,
  'Investigație: '+challenge,
  'Metodă: definește mărimile și condițiile, apoi folosește teoria și exemplele din capitolul selectat.',
  'Acest parcurs este orientativ, nu programa obligatorie a țării.'
 ].join('\n\n');
 return [
  'SCIENCE · '+(stage==='upper'?'Upper secondary':'University')+' · Year '+grade,
  'Chosen chapter: '+chapter,
  'Enquiry: '+(SCIENCE_GUIDES_EN[subject]?.[topic]?.[3]||'Explain what evidence is needed to interpret this chapter correctly.'),
  'Method: define relevant quantities and assumptions, then use the worked examples from this chapter.',
  language!=='en'?'English reference content; translation into the selected language has not been verified.':'General study pathway, not a certified national syllabus.'
 ].join('\n\n');
}
