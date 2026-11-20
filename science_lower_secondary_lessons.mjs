// Original, pupil-oriented lower secondary science notes, independent of nation.
// These are supplementary study frames, NOT national textbooks or a claim that
// a topic is compulsory for a particular grade. Each item gives a distinct
// explanation, worked example, practice task and feedback in RO and EN.
// National year/topic selection remains in science_grade_progression.mjs.
const entries={
 physics:{
  units:[
   ['Mărimi și unități','Măsurarea leagă o mărime fizică de o unitate. Lungimea se exprimă în metri, timpul în secunde, masa în kilograme; conversia cere păstrarea tipului mărimii.','Exemplu: 2,5 m înseamnă 250 cm, deoarece 1 m = 100 cm.','Transformă 750 mm în metri.','750 mm = 0,75 m. Împarți la 1.000.'],
   ['Quantities and units','Measurement connects a quantity to its unit. Length uses metres, time uses seconds, mass uses kilograms; conversions must preserve the type of quantity.','Example: 2.5 m equals 250 cm because 1 m = 100 cm.','Convert 750 mm into metres.','750 mm = 0.75 m: divide by 1,000.']
  ],
  kinematics:[
   ['Mișcarea și viteza','Mișcarea descrie schimbarea poziției față de un reper. Viteza medie este distanța împărțită la intervalul de timp, când valorile sunt cunoscute.','Exemplu: 120 m parcurși în 30 s dau v = 120/30 = 4 m/s.','O bicicletă parcurge 200 m în 50 s. Care este viteza medie?','4 m/s. Alege mai întâi unitățile compatibile.'],
   ['Motion and speed','Motion is a change of position relative to a reference point. Average speed equals distance divided by time when both quantities are known.','Example: 120 m in 30 s gives v = 120/30 = 4 m/s.','A cyclist covers 200 m in 50 s. Find the average speed.','4 m/s. Check that the units match.']
  ],
  heat:[
   ['Temperatura și schimbul de căldură','Temperatura arată starea termică, iar căldura descrie energia transferată între corpuri cu temperaturi diferite. Ele nu sunt aceeași mărime.','Exemplu: o lingură metalică se încălzește într-o cană cu apă caldă prin transfer termic.','De ce lingura ajunge să se încălzească fără să fie pe flacără?','Energia se transferă de la apa mai caldă la lingură.'],
   ['Temperature and heat transfer','Temperature measures thermal state; heat is energy transferred between bodies at different temperatures. They are not the same quantity.','Example: a metal spoon warms up in a cup of warm water because of heat transfer.','Why does the spoon become warm without touching a flame?','Energy transfers from the warmer water to the spoon.']
  ],
  energy:[
   ['Energie și transformări','Energia poate fi transferată sau transformată. Într-un sistem ideal energia totală se conservă, dar în practică o parte devine mai puțin utilă, de exemplu prin încălzire.','Exemplu: o minge ridicată are energie potențială; la cădere crește energia cinetică.','Ce transformare se produce când o lanternă funcționează?','Energia chimică a bateriei se transformă în energie electrică, luminoasă și termică.'],
   ['Energy transfers','Energy can transfer or change form. Total energy is conserved, but some becomes less useful, such as through heating.','Example: a lifted ball has gravitational potential energy that becomes kinetic energy as it falls.','What energy changes occur in a torch?','Chemical energy in the battery becomes electrical energy, light and heat.']
  ],
  dynamics:[
   ['Forțe și schimbarea mișcării','O forță poate modifica viteza, direcția sau forma unui corp. Forțele au intensitate și direcție și se măsoară în newtoni.','Exemplu: două forțe egale și opuse se pot echilibra; o forță rezultantă nenulă poate accelera obiectul.','Când împingi un cărucior, de ce viteza lui se poate schimba?','Împingerea exercită o forță; rezultatul depinde și de frecare și de alte forțe.'],
   ['Forces and changing motion','A force can change speed, direction or shape. Forces have magnitude and direction and are measured in newtons.','Example: equal opposite forces can balance; an unbalanced force can accelerate a body.','Why can pushing a trolley change its speed?','The push exerts a force; friction and other forces also matter.']
  ],
  fluids:[
   ['Fluide și presiune','Presiunea este forța raportată la suprafață, p = F/A. În fluide, presiunea acționează asupra pereților vasului și crește adesea cu adâncimea.','Exemplu: aceeași forță pe o suprafață de două ori mai mică produce presiune de două ori mai mare.','De ce un ac pătrunde mai ușor decât un obiect cu vârful lat?','Vârful mic produce o presiune mai mare pentru aceeași forță.'],
   ['Fluids and pressure','Pressure is force per area, p = F/A. Fluids push on container walls and pressure in a liquid generally increases with depth.','Example: the same force on half the area produces twice the pressure.','Why does a needle penetrate more easily than a blunt object?','Its tiny tip produces greater pressure for the same force.']
  ],
  electric:[
   ['Circuit electric simplu','Un circuit închis oferă un traseu conductiv pentru curent. Tensiunea, curentul și rezistența sunt mărimi diferite; legea lui Ohm se aplică în condiții potrivite.','Exemplu: dacă U = 6 V și R = 3 Ω pentru un rezistor ohmic, I = 6/3 = 2 A.','În același model, ce curent trece la 9 V și 3 Ω?','I = 9/3 = 3 A. Nu lucra la prize sau la rețeaua electrică.'],
   ['Simple electric circuits','A closed circuit provides a conducting path. Voltage, current and resistance are distinct; Ohm’s law applies to suitable components.','Example: U = 6 V across a 3 Ω ohmic resistor gives I = 2 A.','In the same model, find the current for 9 V and 3 Ω.','I = 9/3 = 3 A. Never experiment with mains electricity.']
  ]
 },
 chemistry:{
  fundamentals:[
   ['Materiale, substanțe și amestecuri','O substanță pură are o compoziție definită; un amestec conține mai multe substanțe. O schimbare de stare nu produce automat o nouă substanță.','Exemplu: topirea gheții transformă apa solidă în apă lichidă; compoziția H₂O rămâne aceeași.','Numește un amestec și o metodă simplă de separare.','Apă cu nisip: separare prin filtrare, în condiții sigure.'],
   ['Materials, substances and mixtures','A pure substance has a defined composition; a mixture contains multiple substances. A change of state does not necessarily create a new substance.','Example: melting ice changes solid water into liquid water; its H₂O composition remains.','Name a mixture and a simple separation method.','Sand and water can be separated by filtration.']
  ],
  atomic:[
   ['Atomi, protoni și electroni','Atomul conține un nucleu cu protoni și, în multe cazuri, neutroni, și electroni în jurul nucleului. Numărul protonilor identifică elementul.','Exemplu: un atom neutru de carbon are șase protoni și șase electroni.','Ce se întâmplă cu numărul protonilor când un atom formează un ion?','Nu se schimbă; formarea unui ion schimbă numărul electronilor.'],
   ['Atoms, protons and electrons','An atom has a nucleus containing protons and usually neutrons, with electrons around it. The proton number identifies the element.','Example: a neutral carbon atom has six protons and six electrons.','Does the proton number change when an atom becomes an ion?','No. Ion formation changes the number of electrons.']
  ],
  periodic:[
   ['Cum citim tabelul periodic','Elementele sunt ordonate după numărul atomic. Coloanele se numesc grupe și rândurile perioade; proprietățile tind să se repete în moduri explicabile.','Exemplu: Na și K se află în aceeași grupă, dar în perioade diferite.','Ce număr stabilește poziția unui element în tabel?','Numărul atomic, egal cu numărul protonilor.'],
   ['Reading the periodic table','Elements are arranged by atomic number. Columns are groups and rows are periods; patterns in properties recur.','Example: Na and K share a group but appear in different periods.','Which number sets an element’s position in the table?','Atomic number, equal to its number of protons.']
  ],
  bonding:[
   ['Legături dintre atomi','Atomii pot forma legături prin transferul sau participarea electronilor. Modelele ionice și covalente explică forme diferite de organizare a substanțelor.','Exemplu: în molecula H₂, cei doi atomi de hidrogen participă la o pereche comună de electroni.','De ce NaCl nu este reprezentat corect ca molecule izolate de sare?','În stare solidă, sarea obișnuită formează o rețea ionică.'],
   ['Chemical bonds','Atoms bond through electron transfer or sharing. Ionic and covalent models describe different kinds of matter.','Example: in H₂ two hydrogen atoms share an electron pair.','Why is solid table salt not best represented as separate NaCl molecules?','It forms an extended ionic crystal lattice.']
  ],
  reactions:[
   ['Reacții și ecuații chimice','Reactanții se transformă în produși. Într-o ecuație corect echilibrată se conservă numărul atomilor din fiecare element.','Exemplu: 2H₂ + O₂ → 2H₂O conține patru atomi H și doi O în fiecare parte.','Ce este greșit la H₂ + O₂ → H₂O?','Nu este echilibrată: numărul atomilor de oxigen diferă între părți.'],
   ['Reactions and equations','Reactants form products. A balanced chemical equation conserves the count of each element’s atoms.','Example: 2H₂ + O₂ → 2H₂O has four H and two O atoms on each side.','What is wrong with H₂ + O₂ → H₂O?','It is unbalanced: oxygen atom counts differ.']
  ],
  inorganic:[
   ['Acizi, baze, oxizi și săruri','Compușii anorganici pot fi grupați după compoziție și proprietăți. Aceeași clasificare nu spune singură toate proprietățile sau pericolele unei substanțe.','Exemplu: NaCl este o sare, iar CO₂ este un oxid.','De ce nu poți identifica în siguranță un acid prin gustare?','Gustarea substanțelor necunoscute este periculoasă; identificarea se face prin metode adecvate.'],
   ['Acids, bases, oxides and salts','Inorganic compounds are classified by composition and properties. A category does not tell every property or hazard.','Example: NaCl is a salt; CO₂ is an oxide.','Why is tasting an unknown liquid not a safe way to identify an acid?','Unknown chemicals must never be tasted; identification uses safe methods.']
  ],
  solutions:[
   ['Dizolvare și concentrație','O soluție omogenă conține un solut distribuit în solvent. Concentrația compară cantitatea dizolvată cu cantitatea de soluție, după definiția folosită.','Exemplu: 5 g sare într-o soluție de 100 g înseamnă concentrație masică 5%.','Ce procent masic are o soluție cu 8 g solut și masă totală 200 g?','8/200 × 100% = 4%.'],
   ['Dissolving and concentration','A homogeneous solution contains solute dispersed in solvent. Concentration compares the amount of solute with solution quantity, according to its definition.','Example: 5 g salt in 100 g of solution is 5% by mass.','Find the mass percentage for 8 g solute in 200 g solution.','8/200 × 100% = 4%.']
  ],
  acids:[
   ['Acizi, baze și indicatori','Acizii și bazele sunt clase de substanțe cu proprietăți specifice. Indicatorii își pot schimba culoarea în funcție de mediul chimic; culoarea singură nu determină concentrația.','Exemplu: hârtia indicatoare poate arăta un interval aproximativ de pH, nu o măsurare exactă.','O soluție cu pH 3 este acidă, neutră sau bazică la temperaturi obișnuite?','Acidă. Nu atinge sau testa substanțe necunoscute.'],
   ['Acids, bases and indicators','Acids and bases are classes of substances with distinct properties. Indicators may change colour; colour alone does not determine exact concentration.','Example: pH paper gives an approximate interval, not a precise measurement.','At ordinary temperatures, is pH 3 acidic, neutral or basic?','Acidic. Never handle unknown chemicals.']
  ]
 },
 biology:{
  plants:[
   ['Părțile plantei și fotosinteza','Rădăcinile absorb apă și minerale, tulpina susține și transportă, iar frunzele contribuie la fotosinteză. Plantele nu se hrănesc prin „mâncarea solului”.','Exemplu: o plantă poate produce materie organică folosind lumină, apă și dioxid de carbon.','Ce rol au rădăcinile în creșterea plantei?','Absorb apă și minerale și ajută la ancorare.'],
   ['Plant parts and photosynthesis','Roots take up water and minerals, stems support and transport, and leaves help photosynthesis. Plants do not “eat soil”.','Example: plants produce organic matter using light, water and carbon dioxide.','How do roots help a plant grow?','They absorb water and minerals and anchor it.']
  ],
  ecology:[
   ['Habitat și relații trofice','Un habitat oferă condițiile în care un organism trăiește; un ecosistem cuprinde și mediul neviiu. Lanțurile trofice descriu relații simplificate de hrană.','Exemplu: iarbă → iepure → vulpe este un model alimentar, nu o descriere completă a unei păduri.','Ce schimbare poate provoca dispariția unei specii dintr-un lanț?','Pot apărea modificări la populațiile care depind direct sau indirect de ea.'],
   ['Habitats and food webs','A habitat provides living conditions; an ecosystem includes living things and nonliving surroundings. Food chains simplify feeding relationships.','Example: grass → rabbit → fox is a simplified model, not a complete woodland ecosystem.','What can happen if one species disappears from a food chain?','Populations depending on it directly or indirectly may change.']
  ],
  cells:[
   ['Celule și țesuturi','Celula este o unitate structurală și funcțională a vieții. Organismele pluricelulare au celule specializate, care pot alcătui țesuturi și organe.','Exemplu: celulele musculare sunt adaptate contracției, iar celulele vegetale au de regulă un perete celular.','Ce diferență comună există între o celulă vegetală și una animală?','Celulele vegetale au de regulă un perete celular; cele animale nu.'],
   ['Cells and tissues','Cells are structural and functional units of life. Multicellular organisms have specialized cells forming tissues and organs.','Example: muscle cells contract; plant cells usually have a cell wall.','Name a common difference between plant and animal cells.','Plant cells usually have a cell wall; animal cells do not.']
  ],
  anatomy:[
   ['Organe și sisteme','Organele lucrează împreună în sisteme. Inima pompează sângele, plămânii schimbă gaze, iar sistemul digestiv transformă alimentele în substanțe absorbabile.','Exemplu: în timpul mersului rapid, nevoia de oxigen crește și respirația se poate accelera.','De ce inima și plămânii sunt legate funcțional?','Circulația transportă gazele schimbate la nivelul plămânilor.'],
   ['Organs and body systems','Organs cooperate in systems. The heart pumps blood, lungs exchange gases, and digestion processes food for absorption.','Example: during brisk walking, oxygen demand increases and breathing rate may rise.','Why do the heart and lungs work together?','Blood transports gases exchanged in the lungs.']
  ],
  genetics:[
   ['Ereditate și gene','Genele sunt secvențe de ADN asociate cu informația ereditară. Trăsăturile pot depinde de mai multe gene și de mediu; nu toate urmează un model simplu dominant/recesiv.','Exemplu: două alele pot determina variante diferite pentru unele trăsături mendeliene.','De ce nu poți prezice orice trăsătură umană dintr-o singură genă?','Multe trăsături sunt poligenice și influențate de mediu.'],
   ['Heredity and genes','Genes are DNA sequences involved in inherited information. Traits can depend on multiple genes and the environment.','Example: two alleles can produce different versions of some Mendelian traits.','Why can’t every human trait be predicted from a single gene?','Many traits are polygenic and influenced by the environment.']
  ],
  evolution:[
   ['Adaptare și selecție naturală','Populațiile au variație ereditară. În anumite condiții, unele variante favorizează supraviețuirea și reproducerea, iar frecvențele lor pot crește în generații.','Exemplu: forma ciocului poate influența accesul la hrană, dar nu este o alegere conștientă a păsării.','Evoluează un singur individ într-o zi?','Nu. Schimbarea evolutivă este studiată între generații în populații.'],
   ['Adaptation and natural selection','Populations have inherited variation. In certain environments some traits improve survival and reproduction over generations.','Example: beak shape may affect food access but is not consciously chosen by a bird.','Does one individual evolve a new inherited trait in a day?','No. Evolutionary changes are studied across generations in populations.']
  ]
 },
 astronomy:{
  solar:[
   ['Pământul, Luna și planetele','Pământul se rotește în jurul axei și orbitează Soarele. Luna orbitează Pământul; fazele ei nu se datorează umbrei Pământului, cu excepția eclipselor de Lună.','Exemplu: fazele Lunii apar deoarece vedem porțiuni diferite ale jumătății luminate.','De ce este greșit să explici fiecare fază a Lunii prin eclipsă?','Eclipsa necesită o aliniere specială, fazele sunt obișnuite.'],
   ['Earth, Moon and planets','Earth rotates and orbits the Sun. The Moon orbits Earth; its regular phases are not Earth’s shadow except during lunar eclipses.','Example: phases occur as we see different amounts of the Moon’s sunlit half.','Why are ordinary Moon phases not lunar eclipses?','An eclipse needs a special alignment; phases occur routinely.']
  ],
  sky:[
   ['Mișcarea aparentă a stelelor','Pământul se rotește, făcând ca stelele să pară că se mișcă pe cer. Observația depinde de latitudine, sezon și ora nopții.','Exemplu: la ore diferite, aceeași constelație poate apărea în poziții diferite.','Ce fenomen produce în mare parte mișcarea zilnică aparentă a stelelor?','Rotația Pământului.'],
   ['Apparent motion of stars','Earth rotates, making stars appear to move across the sky. What we see depends on latitude, season and time.','Example: a constellation can appear in different positions at different times.','What causes most of the stars’ apparent daily motion?','Earth’s rotation.']
  ],
  observations:[
   ['Observații astronomice','Un jurnal bun notează data, ora, locul și instrumentul, precum și condițiile cerului. Observațiile repetate permit compararea, nu doar memorarea.','Exemplu: înregistrează faza Lunii din aceeași locație în mai multe seri.','Ce date sunt necesare pentru compararea a două observații?','Cel puțin momentul, locul, condițiile și metoda. Nu privi direct Soarele.'],
   ['Astronomical observations','A good log records date, time, place, instrument and sky conditions. Repeatable observations allow comparison.','Example: record Moon phase from the same place over several evenings.','What must be noted to compare two observations?','Time, location, conditions and method. Never view the Sun directly.']
  ],
  distances:[
   ['Distanțe și viteza luminii','Lumina călătorește cu o viteză finită. Anul-lumină este o unitate de distanță, nu de timp; scările reale depășesc reprezentările din clasă.','Exemplu: lumina Soarelui ajunge la Pământ în aproximativ opt minute.','Este anul-lumină o durată sau o distanță?','O distanță: parcursul luminii într-un an.'],
   ['Distances and light speed','Light travels at a finite speed. A light-year is a distance, not a unit of time; space scales are immense.','Example: sunlight takes about eight minutes to reach Earth.','Is a light-year a period or a distance?','A distance: how far light travels in one year.']
  ],
  stars:[
   ['Stele și ciclul lor de viață','Stelele produc energie prin reacții de fuziune în nucleu, în anumite etape. Masa lor influențează durata și evoluția; nu toate devin găuri negre.','Exemplu: Soarele este o stea de pe secvența principală care transformă hidrogenul în heliu.','De ce nu toate stelele au aceeași evoluție?','Masa și compoziția influențează etapele vieții stelare.'],
   ['Stars and their life cycles','Stars release energy through nuclear fusion during stages of their lives. Mass influences their evolution; not every star becomes a black hole.','Example: the Sun is a main-sequence star fusing hydrogen into helium.','Why do different stars follow different life cycles?','Mass and composition influence stellar evolution.']
  ]
 }
};
export const SCIENCE_LOWER_TOPIC_LESSONS=Object.freeze(Object.fromEntries(
 Object.entries(entries).map(([subject,topics])=>[
  subject,Object.freeze(Object.fromEntries(Object.entries(topics).map(([topic,versions])=>
   [topic,Object.freeze({ro:Object.freeze(versions[0]),en:Object.freeze(versions[1])})])))
 ])
));
export function scienceLowerTopicContent(subject,topic,language='ro'){
 const notes=SCIENCE_LOWER_TOPIC_LESSONS[subject]?.[topic];
 if(!notes)return null;
 const localized=language==='ro'?notes.ro:notes.en;
 return {title:localized[0],explanation:localized[1],workedExample:localized[2],
  exercise:localized[3],answer:localized[4],source:'original-advisory'};
}
