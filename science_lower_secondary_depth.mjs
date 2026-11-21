// Additional original explanatory paragraphs, in Romanian and English.
// These support the existing grade/topic selection; they do not assert
// that an advisory study sequence is a national textbook.
export const SCIENCE_LOWER_DEPTH=Object.freeze({
 physics:{
  units:{
   ro:'O mărime fizică trebuie exprimată printr-o valoare și o unitate: „5” singur nu spune dacă vorbim despre 5 metri sau 5 secunde. Înainte de a calcula, transformă datele în unități compatibile. La măsurare, poziția instrumentului și rezoluția scalei influențează rezultatul. Dacă repeți măsurarea, nu modifica intenționat obiectul; diferențele mici pot indica limitele instrumentului sau ale citirii.',
   en:'A physical measurement needs a number and a unit: „5” alone does not tell us whether it means metres or seconds. Convert all measurements to compatible units before calculating. Instrument alignment and scale resolution affect the reading. Repeated measurements should use the same object and method; small differences may come from the limits of the instrument or how it is read.'
  },
  kinematics:{
   ro:'Alege mai întâi reperul față de care descrii mișcarea. Distanța parcursă și deplasarea nu coincid întotdeauna: după un tur complet, distanța este nenulă, dar deplasarea față de punctul de plecare poate fi zero. Viteza medie folosește distanța totală și timpul total, nu viteza dintr-un singur moment. Scrie formula, înlocuiește datele și verifică dacă unitatea rezultată este m/s.',
   en:'Choose a reference point before describing motion. Distance travelled and displacement are not always the same: after a complete lap, the distance is positive but displacement from the start can be zero. Average speed uses total distance and total time, not the speed at one instant. Write the formula, substitute the values and check that the resulting unit is m/s.'
  },
  heat:{
   ro:'Căldura nu este un lichid care circulă între corpuri, ci energie transferată datorită diferenței de temperatură. Transferul se poate face prin conducție, convecție sau radiație. Metalul conduce adesea energia termică mai repede decât lemnul, de aceea două obiecte din aceeași cameră pot părea diferit de reci la atingere. Temperatura și cantitatea totală de energie internă sunt noțiuni diferite; nu le folosi ca sinonime.',
   en:'Heat is not a fluid flowing between objects: it is energy transferred because of a temperature difference. Transfer can occur by conduction, convection or radiation. Metal often transfers thermal energy faster than wood, so objects at the same room temperature can feel different. Temperature and the total internal energy of an object are not interchangeable ideas.'
  },
  energy:{
   ro:'Pentru a explica o transformare energetică, precizează sistemul și sursa energiei. Într-o lanternă, energia stocată chimic în baterie participă la transferuri care alimentează circuitul; o parte ajunge ca lumină, iar o parte se transferă termic. O diagramă cu săgeți poate arăta intrările și ieșirile. Nu scrie că energia se pierde definitiv când un dispozitiv se încălzește: ea se transferă în mediul înconjurător.',
   en:'Identify the system and the original energy store before explaining a transfer. In a torch, energy stored chemically in a battery supports transfers through a circuit; some is emitted as light and some is transferred by heating. An arrow diagram can show the pathway. Do not say energy vanishes when a device gets warm: energy has moved to the surroundings.'
  },
  dynamics:{
   ro:'O forță se reprezintă prin săgeată, deoarece are mărime și direcție. Desenează separat fiecare forță care acționează asupra corpului: împingerea, frecarea, greutatea sau reacțiunea suportului. Dacă forțele se compensează, mișcarea nu trebuie să se schimbe; un obiect poate continua să se deplaseze cu viteză constantă. Dacă rezultanta este nenulă, accelerația depinde de ea și de masa corpului.',
   en:'A force has both size and direction, so represent it with an arrow. Draw the separate forces on a body: push, friction, weight and support force where relevant. Balanced forces do not require motion to change; an object can keep moving steadily. A non-zero resultant force produces acceleration that depends on its size and the body’s mass.'
  },
  fluids:{
   ro:'Presiunea descrie forța exercitată pe unitatea de suprafață. Dacă aceeași forță acționează pe o suprafață mai mică, presiunea este mai mare: de aceea un vârf ascuțit pătrunde mai ușor. În lichide, presiunea crește de obicei cu adâncimea, iar forțele exercitate de fluide pot acționa în direcții diferite. Nu confunda presiunea cu forța: se măsoară în pascali, nu în newtoni.',
   en:'Pressure describes force per unit area. With the same force, a smaller contact area produces greater pressure, which explains why a sharp tip can penetrate more easily. In a liquid, pressure generally increases with depth, and fluid forces act in several directions. Pressure is not the same quantity as force: pressure uses pascals, while force uses newtons.'
  },
  electric:{
   ro:'Într-un circuit închis, sarcinile electrice se deplasează prin conductori sub acțiunea diferenței de potențial. Intensitatea curentului se măsoară în amperi, tensiunea în volți și rezistența în ohmi. Pentru un rezistor ideal, I = U/R: dacă tensiunea rămâne constantă, o rezistență mai mare produce un curent mai mic. Folosește numai simulări sau surse de joasă tensiune potrivite școlii; nu experimenta cu rețeaua electrică.',
   en:'In a closed circuit, electric charge moves through conductors under a potential difference. Current is measured in amperes, voltage in volts and resistance in ohms. For an ideal resistor, I = V/R: at constant voltage a larger resistance means a smaller current. Use simulations or safe low-voltage educational equipment, never household mains electricity.'
  }
 },
 chemistry:{
  fundamentals:{
   ro:'Descrie fiecare material prin proprietăți observabile: stare, culoare, solubilitate și comportament în condiții sigure. O substanță pură are o compoziție definită, în timp ce un amestec poate avea proporții diferite ale componentelor. Filtrarea separă solide insolubile de lichide, dar nu elimină sarea dizolvată. Topirea este schimbare fizică; formarea unei substanțe noi indică o reacție chimică, însă aspectul singur nu este întotdeauna dovadă suficientă.',
   en:'Describe materials using observable properties such as state, colour and solubility, with safe procedures. A pure substance has a defined composition, while mixtures can contain varying proportions. Filtration can separate an insoluble solid from a liquid, but will not remove dissolved salt. Melting is a physical change; a new substance can indicate a chemical reaction, though appearance alone is not always conclusive evidence.'
  },
  atomic:{
   ro:'Numărul atomic Z indică numărul protonilor și definește elementul chimic. Un atom neutru are același număr de protoni și electroni, dar un ion a câștigat sau a pierdut electroni. De pildă, un atom care pierde un electron devine ion cu sarcină pozitivă, fără ca nucleul să își schimbe numărul de protoni. Neutronii contribuie la masa nucleului; izotopii aceluiași element au număr diferit de neutroni.',
   en:'Atomic number Z is the number of protons and identifies the chemical element. A neutral atom has equal numbers of protons and electrons, while an ion has gained or lost electrons. An atom losing an electron becomes a positively charged ion without changing the proton count in its nucleus. Neutrons contribute to nuclear mass; isotopes of one element differ in neutron number.'
  },
  periodic:{
   ro:'Tabelul periodic este ordonat după numărul atomic, nu după masa rotunjită a elementelor. Rândurile sunt perioade, iar coloanele sunt grupe. Elementele din aceeași grupă pot avea proprietăți asemănătoare deoarece structura electronică exterioară are asemănări. Pentru orice element ales, citește simbolul, numărul atomic și poziția; apoi verifică ce concluzii poți susține și ce proprietăți nu se pot deduce doar din locul în tabel.',
   en:'The periodic table is ordered by atomic number, not by a rounded atomic mass. Rows are periods and columns are groups. Elements in a group may share chemical behaviour because of similarities in outer electronic structure. For any chosen element, read its symbol, atomic number and position, then separate conclusions supported by those facts from properties that cannot be inferred from the table alone.'
  },
  bonding:{
   ro:'O legătură covalentă implică partajarea electronilor între atomi, iar o legătură ionică este explicată prin atracția electrostatică dintre ioni. Clorura de sodiu solidă nu este o colecție de molecule NaCl izolate, ci o structură extinsă de ioni. Modelele cu bile sunt simplificări: forma și raportul reprezentat nu sunt întotdeauna la scară. Când scrii o formulă, respectă neutralitatea electrică a compusului ionic.',
   en:'Covalent bonding involves sharing electrons between atoms; ionic bonding is explained by electrostatic attraction between ions. Solid sodium chloride is not made of separate NaCl molecules but forms an extended ionic lattice. Ball models are simplifications and may not show sizes to scale. When writing an ionic formula, account for the charges so that the compound is electrically neutral.'
  },
  reactions:{
   ro:'Ecuația unei reacții trebuie să respecte conservarea fiecărui tip de atom. Verifică separat atomii din stânga și din dreapta; schimbă doar coeficienții din fața formulelor, niciodată indicii din formule. De exemplu, 2H₂ + O₂ → 2H₂O are câte patru atomi de hidrogen și doi de oxigen pe ambele părți. O ecuație corect echilibrată nu dovedește singură că reacția are loc în orice condiții.',
   en:'A chemical equation must conserve each type of atom. Count atoms on the left and right separately; change coefficients in front of formulae, never the subscripts within a chemical formula. For example, 2H₂ + O₂ → 2H₂O has four hydrogen atoms and two oxygen atoms on both sides. A balanced equation alone does not prove a reaction happens under every condition.'
  },
  inorganic:{
   ro:'Acizii, bazele, oxizii și sărurile sunt clase de substanțe cu structuri și proprietăți diferite. Denumirea depinde de compoziție, nu de aspect sau de miros. Un indicator poate oferi informații despre caracterul acid sau bazic în condiții de laborator sigure, dar nu toate soluțiile se identifică doar prin culoare. Nu gusta, nu atinge și nu combina substanțe necunoscute pentru a le testa.',
   en:'Acids, bases, oxides and salts are classes of substances with different compositions and properties. Classification depends on chemical composition, not colour, taste or smell. An indicator may provide evidence about acidity or alkalinity in a safe school investigation, but a colour change alone does not identify every substance. Never taste, touch or mix unknown chemicals to test them.'
  },
  solutions:{
   ro:'O soluție are solut și solvent; masa soluției este suma maselor componentelor, dacă nu se pierde material în timpul preparării. Procentul masic se calculează împărțind masa solutului la masa totală a soluției și înmulțind cu 100. La 8 g solut și 200 g soluție, obții 4%; nu împărți la masa solventului dacă problema cere masă totală. Verifică dacă rezultatul are sens: procentul trebuie să fie între 0 și 100.',
   en:'A solution contains solute and solvent; with no material lost, solution mass is the sum of the component masses. Mass percentage is solute mass divided by total solution mass, multiplied by 100. For 8 g of solute in 200 g of solution, the result is 4%; do not divide by solvent mass when total solution mass is specified. Check plausibility: the percentage must lie between 0 and 100.'
  },
  acids:{
   ro:'Scala pH exprimă aciditatea în condiții definite; la temperatura camerei, o soluție apoasă cu pH sub 7 este în general acidă, iar peste 7 este bazică. O diferență de o unitate de pH reflectă o diferență de zece ori în activitatea ionilor de hidrogen în condiții comparabile. Nu confunda un acid puternic cu o soluție concentrată: tăria și concentrația sunt lucruri diferite. Pentru experimente folosește doar materiale aprobate de profesor.',
   en:'The pH scale indicates acidity under defined conditions. At room temperature, an aqueous solution below pH 7 is generally acidic and one above pH 7 is alkaline. One pH unit corresponds to about a tenfold difference in hydrogen-ion activity under comparable conditions. Do not confuse acid strength with concentration: they describe different properties. Only use teacher-approved materials for experiments.'
  }
 },
 biology:{
  plants:{
   ro:'Rădăcinile fixează planta și absorb apă cu substanțe minerale, tulpina susține și transportă, iar frunzele sunt locul principal al fotosintezei la multe plante. Fotosinteza folosește energia luminii pentru a produce substanțe organice din dioxid de carbon și apă, cu eliberare de oxigen în condiții obișnuite. O plantă poate supraviețui pentru o vreme fără lumină, dar nu își poate menține normal creșterea numai din apă.',
   en:'Roots anchor a plant and absorb water and minerals, stems support and transport materials, while leaves are a major site of photosynthesis in many plants. Photosynthesis uses light energy to make organic substances from carbon dioxide and water, usually releasing oxygen. A plant may survive for a time without light but cannot maintain normal growth from water alone.'
  },
  ecology:{
   ro:'Într-un lanț trofic, săgeata indică direcția transferului de energie de la hrană către consumator. Un ecosistem nu este doar o listă de specii: include și apă, sol, lumină, temperatură și interacțiunile dintre organisme. Dispariția unei specii poate schimba populațiile care depind de ea, dar efectul real trebuie investigat. O rețea trofică descrie mai bine decât un singur lanț relațiile multiple.',
   en:'In a food chain, the arrow shows the direction of energy transfer from food to consumer. An ecosystem is more than a list of species: it includes water, soil, light, temperature and interactions. The removal of a species may alter dependent populations, but actual effects need evidence. A food web is often a better model than one simple chain because organisms have several relationships.'
  },
  cells:{
   ro:'Membrana celulară delimitează celula și reglează schimburile cu mediul, citoplasma conține structuri implicate în procesele vitale, iar celulele eucariote au de regulă nucleu. Celula vegetală prezintă în mod obișnuit perete celular și poate avea cloroplaste; celula animală nu are perete celular. Nu toate celulele dintr-un organism au aceeași formă sau aceleași organite vizibile. Desenul este un model, nu o fotografie.',
   en:'The cell membrane separates a cell from its surroundings and controls exchanges; the cytoplasm contains structures involved in life processes, and eukaryotic cells usually have a nucleus. Plant cells generally have a cell wall and may have chloroplasts, while animal cells do not have a cell wall. Cells differ in shape and visible structures. A classroom diagram is a model, not a photograph.'
  },
  anatomy:{
   ro:'Respirația aduce aer în plămâni, unde oxigenul trece în sânge și dioxidul de carbon poate trece în aerul eliminat. Inima pune sângele în mișcare, iar vasele îl transportă către țesuturi și înapoi. Organele nu lucrează separat, ci formează sisteme interdependente. Ritmul respirator și pulsul pot varia după efort, dar o singură observație nu permite diagnosticarea unei afecțiuni.',
   en:'Breathing moves air into the lungs, where oxygen enters the blood and carbon dioxide can move into exhaled air. The heart drives blood circulation and vessels carry blood to tissues and back. Organs cooperate in interacting systems rather than acting alone. Breathing rate and pulse can change after exercise, but one observation cannot be used to diagnose a medical condition.'
  },
  genetics:{
   ro:'Genele sunt secvențe de ADN ce contribuie la funcționarea și dezvoltarea organismelor. Un individ moștenește variante genetice de la părinți, dar nu toate trăsăturile sunt determinate de o singură genă. Înălțimea, de exemplu, este influențată de multe variante genetice și de factori de mediu. Un tabel simplu de încrucișare este util pentru anumite modele mendeliene, nu pentru a prezice toate caracterele umane.',
   en:'Genes are DNA sequences that contribute to how organisms develop and function. Individuals inherit genetic variants from their parents, but not all traits are controlled by one gene. Height, for example, involves many genetic variants and environmental influences. A simple inheritance grid is useful for some Mendelian cases, not for predicting every human characteristic.'
  },
  evolution:{
   ro:'Selecția naturală implică diferențe ereditare între indivizii unei populații și diferențe în supraviețuire sau reproducere în anumite condiții. În timp, frecvența variantelor poate să se schimbe între generații. Un individ nu își modifică deliberat genele pentru a se adapta într-o singură zi. Evoluția nu are un scop prestabilit și nu înseamnă că toate organismele devin tot mai complexe.',
   en:'Natural selection involves heritable differences within a population and differences in survival or reproduction under particular conditions. Across generations, the frequencies of variants can change. An individual does not deliberately change its genes to adapt in a single day. Evolution has no predetermined goal and does not mean every organism becomes increasingly complex.'
  }
 },
 astronomy:{
  solar:{
   ro:'Rotația Pământului explică succesiunea zilelor și nopților, iar mișcarea lui anuală în jurul Soarelui împreună cu înclinarea axei explică variația anotimpurilor. Fazele Lunii apar deoarece observăm din unghiuri diferite porțiunea luminată de Soare; nu sunt, de regulă, umbre ale Pământului. O eclipsă cere o aliniere specială. Modelele școlare ajută la înțelegere, chiar dacă dimensiunile și distanțele nu sunt la scară.',
   en:'Earth’s rotation produces the sequence of day and night, while its yearly orbit around the Sun together with axial tilt explains seasonal changes. The Moon’s phases arise because we see different portions of its sunlit half, not usually because of Earth’s shadow. An eclipse requires a special alignment. Classroom models help explain these ideas even if sizes and distances are not to scale.'
  },
  sky:{
   ro:'Poziția aparentă a stelelor se schimbă pe parcursul nopții în mare parte din cauza rotației Pământului. De aceea bolta cerească pare să se rotească în jurul unei regiuni apropiate de polul ceresc. În plus, cerul vizibil diferă cu anotimpul și latitudinea observatorului. Pentru a compara observații trebuie să notezi locul și momentul, nu doar să spui că un astru a fost „în stânga”.',
   en:'The apparent positions of stars change during the night largely because Earth rotates. The sky can appear to turn around a region near a celestial pole. The stars visible also vary with season and the observer’s latitude. A meaningful comparison of observations needs the location and time, not just a statement that a star was „to the left”.'
  },
  observations:{
   ro:'Un jurnal de observații consemnează data, ora, locul, condițiile meteorologice și instrumentul utilizat. Repetarea unei observații poate ajuta la distingerea unei schimbări reale de o eroare de identificare. Separă ceea ce ai văzut de explicația propusă; un desen etichetat este util dacă nu ai aparat foto. Soarele nu se observă direct prin binoclu sau telescop fără filtre solare certificate.',
   en:'An observation log records date, time, location, weather and any instrument used. Repeating observations helps distinguish real changes from mistakes in identification. Separate what you saw from your explanation; a labelled drawing is useful even without a camera. Never observe the Sun directly with binoculars or a telescope without certified solar filters.'
  },
  distances:{
   ro:'Lumina se propagă cu viteză finită, aproximativ 300.000 km/s în vid. Un an-lumină este distanța parcursă de lumină într-un an, nu o perioadă de timp; astronomii folosesc această unitate pentru distanțe între stele. Lumina de la Soare ajunge la Pământ în aproximativ opt minute, astfel încât îl observăm așa cum era cu câteva minute înainte. Orice model la scară trebuie să precizeze ce dimensiuni păstrează.',
   en:'Light travels at a finite speed, approximately 300,000 km/s in vacuum. A light-year is the distance light travels in a year, not a period of time; astronomers use it for stellar distances. Sunlight takes roughly eight minutes to reach Earth, so we see the Sun as it was minutes earlier. A scale model must explain which dimensions it preserves and which are simplified.'
  },
  stars:{
   ro:'Stelele produc energie prin fuziune nucleară în anumite etape ale evoluției. Masa inițială are o influență majoră asupra temperaturii, luminozității și duratei vieții. Stele cu mase diferite pot ajunge în stadii finale diferite; nu toate devin găuri negre. Când compari două stele, precizează pe ce date te bazezi și nu deduce evoluția doar din culoarea unei fotografii prelucrate.',
   en:'Stars release energy by nuclear fusion during stages of their lives. Initial mass strongly influences temperature, luminosity and lifetime. Stars with different masses may have very different final stages; not all become black holes. When comparing two stars, say what observations support the claim and do not infer an entire life history from the colour of a processed image.'
  }
 }
});
