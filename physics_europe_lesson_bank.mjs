import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {PHYSICS_EUROPE_EXTRA_LESSONS} from './physics_europe_wave_measurement.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';

// An ORIGINAL, transparent cross-country *advisory* Physics study bank.
// It reuses original, individually authored concept/activity cards, not a
// Romanian national syllabus. Year and learning order depend on the selected
// country's actual school-year IDs; the source is NEVER labelled official.
export const PHYSICS_ADVISORY_OER_SOURCES=Object.freeze([
 'https://openstax.org/subjects/physics',
 'https://openstax.org/books/physics/pages/preface',
 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study'
]);
export function physicsAdvisoryTopicLessons({
 country='',stage='lower',grade='',topic='',years=[],bank=null,referenceLessons=[],language='ro'
}={}){
 const plan=physicsCountryGradePlan({country,stage,grade,years});
 if(plan.status==='invalid-grade'||plan.status==='not-offered'||!plan.topics.includes(topic))return [];
 const all=Array.isArray(years)?years:[];
 const phase=stage==='medium'||stage==='intermediate'?'upper':stage;
 const scoped=String(grade),code=String(country).toUpperCase();
 if(phase==='lower'){
  const allTiers=['6','7','8'],index=all.findIndex(y=>String(y.id)===scoped);
  if(index<0)return [];
  // A separate subject may start part-way through an integrated school stage.
  // Progress the advisory course across ONLY the years in which this country
  // offers an individual Physics or Physics/Science study opportunity.
  const available=all.filter(y=>physicsCountryGradePlan({
   country:code,stage,grade:y.id,years:all
  }).status!=='not-offered');
  const rank=available.findIndex(y=>String(y.id)===scoped);
  if(rank<0)return [];
  const ratio=available.length<=1?0:rank/(available.length-1);
  const tier=allTiers[Math.round(ratio*(allTiers.length-1))];
  const direct=(bank?.[tier]||[]).filter(entry=>entry.topic===topic);
  // Where an official stage spans several grades, Physics topics can be
  // revisited in a spiral. If a topic has no original introductory cards
  // at this level, use another real authored example rather than a dead
  // chapter with a fake count or an AI-invented lesson.
  const supplemental=['6','7','8'].filter(x=>x!==tier)
   .flatMap(x=>(bank?.[x]||[]).filter(entry=>entry.topic===topic))
   .concat(PHYSICS_EUROPE_EXTRA_LESSONS[topic]||[]);
  const english=language!=='ro'?(PHYSICS_LOWER_ENGLISH_LESSONS[topic]||[]):[];
  const sourceEntries=english.length?english:[...direct,...supplemental];
  const seen=new Set();
  const entries=sourceEntries.filter(entry=>{
   const key=String(entry.title||'').normalize('NFD').toLowerCase().replace(/[^a-z0-9]+/g,'');
   if(seen.has(key))return false;
   seen.add(key);return true;
  });
  const inquiryRo=[
   ['Observă un exemplu sigur din viața de zi cu zi și descrie fenomenul fără presupuneri.',
    'Exemplul trebuie să fie verificabil, observat direct și delimitat de interpretări.'],
   ['Compară două situații și explică ce variabilă ai păstra constantă.',
    'Comparația trebuie să controleze condițiile relevante și să numească variabila investigată.'],
   ['Propune un instrument adecvat și o unitate pentru a verifica explicația.',
    'Trebuie precizate mărimea măsurată, instrumentul, unitatea și limita de citire.'],
   ['Construiește un tabel de trei măsurători și interpretează variațiile.',
    'Tabelul trebuie să aibă etichete, unități și o interpretare a variației datelor.'],
   ['Compară două modele și precizează ipoteza care le deosebește.',
    'Răspunsul trebuie să identifice o ipoteză, o limită de valabilitate și un test relevant.'],
   ['Explică o posibilă eroare sistematică și cum ai verifica-o.',
    'Se cere o sursă de eroare și o verificare sau recalibrare potrivită.'],
   ['Demonstrează cu un caz-limită când modelul ales nu se mai aplică.',
    'Exemplul trebuie să arate condiția încălcată și consecința asupra modelului.']
  ];
  const inquiryEn=[
   ['Describe one safe real-world observation without adding unsupported assumptions.',
    'The observation must be testable and distinguish data from interpretation.'],
   ['Compare two cases and say which relevant variable you would keep constant.',
    'The comparison must identify a controlled condition and the variable under investigation.'],
   ['Choose a measuring instrument and unit that could test your explanation.',
    'A complete response names the measured quantity, instrument, unit and reading limitation.'],
   ['Build a three-reading data table and interpret its variation.',
    'The table needs labelled quantities, units and a reasoned interpretation of variation.'],
   ['Compare two models and explain which assumption distinguishes them.',
    'Identify a model assumption, its range of validity and an appropriate test.'],
   ['Identify a systematic error and explain how to check or correct it.',
    'Give one plausible bias and a suitable independent check or recalibration.'],
   ['Test a limiting case in which the proposed model no longer applies.',
    'State which assumption fails and how that affects the prediction.']
  ];
  // A school year must not append the identical generic prompt to all
  // eight chapter lessons. Inquiry advances from observation to quantitative
  // reasoning and finally evaluation of the physical model.
  const probes={
   units:[['Măsoară aceeași lungime de trei ori și notează unitățile.','Transformă măsurarea în două unități SI și explică alegerea.','Estimează incertitudinea și justifică cifrele semnificative.'],
    ['Measure the same length three times and record units.','Convert a measured quantity between SI units and explain why.','Estimate uncertainty and justify the significant figures.']],
   kinematics:[['Alege un reper și distinge drumul parcurs de deplasare.','Calculează viteza medie din distanță și durată, în m/s.','Interpretează panta graficului poziție–timp și limitele modelului.'],
    ['Choose a reference frame; distinguish path length from displacement.','Calculate mean speed in m/s from distance and time.','Interpret a position–time gradient and the model assumptions.']],
   dynamics:[['Desenează sensul unei forțe și efectul observabil.','Calculează rezultanta forțelor pe o axă, cu semn.','Justifică modelul F=ma și discută rolul frecării.'],
    ['Draw the direction and observable effect of an applied force.','Calculate a signed net force along one axis.','Explain when F=ma applies and how friction changes the prediction.']],
   energy:[['Descrie un transfer energetic într-un dispozitiv real.','Calculează un transfer de energie cu unități coerente.','Compară energia utilă și disiparea într-un bilanț verificabil.'],
    ['Describe an energy transfer in a real device.','Calculate an energy transfer with consistent units.','Evaluate useful energy and dissipation in a justified energy balance.']],
   heat:[['Compară temperatura măsurată cu senzația de cald.','Interpretează încălzirea și schimbarea de fază separat.','Estimează transferul Q=mcΔT și discută pierderile de căldură.'],
    ['Compare thermometer readings with perceived warmth.','Distinguish warming from a change of state.','Estimate Q=mcΔT and examine heat losses.']],
   fluids:[['Observă presiunea la două adâncimi diferite.','Calculează presiunea p=F/A pentru o suprafață dată.','Testează ipotezele modelului hidrostatic sau arhimedic.'],
    ['Observe pressure changes with depth.','Calculate pressure p=F/A for a stated surface.','Check assumptions behind hydrostatic or buoyancy models.']],
   electric:[['Identifică sursa și receptorul într-un circuit sigur cu baterie.','Compară tensiunea și intensitatea într-un circuit simplu.','Calculează o relație electrică și evaluează limita modelului ohmic.'],
    ['Identify the source and load in a safe battery-only circuit.','Compare potential difference and current in a simple circuit.','Calculate an electrical relationship and assess the ohmic assumption.']],
   circuits:[['Recunoaște ramurile și nodurile unui circuit sigur.','Calculează rezistența echivalentă în serie și paralel.','Evaluează un circuit prin legile Kirchhoff și bilanț energetic.'],
    ['Identify branches and junctions in a low-voltage circuit.','Calculate series and parallel equivalent resistance.','Analyse a circuit using Kirchhoff laws and an energy balance.']],
   waves:[['Observă o oscilație fără a confunda unda cu materia.','Calculează frecvența sau lungimea de undă din date.','Compară interferența și reflexia pe baza condițiilor la limită.'],
    ['Observe an oscillation without confusing wave propagation with material transport.','Calculate frequency or wavelength from data.','Compare interference and reflection under stated boundary conditions.']],
   optics:[['Distinge umbra de reflexie într-un experiment sigur.','Trasează normala și măsoară unghiurile de reflexie.','Folosește un model al lentilelor și descrie limitele sale.'],
    ['Distinguish shadows from reflections in a safe experiment.','Draw a normal and measure reflection angles.','Use a lens model and state its limitations.']],
   electromagnetism:[['Explorează un magnet cu obiecte obișnuite, fără prize.','Explică efectul curentului asupra unui câmp magnetic.','Analizează inducția prin variația fluxului magnetic.'],
    ['Explore magnets with ordinary objects; avoid mains electricity.','Explain how electric current produces a magnetic field.','Analyse induction using a changing magnetic flux.']],
   thermodynamics:[['Distinge temperatura de energia transferată prin căldură.','Calculează o variație energetică pentru un proces definit.','Aplică prima lege și precizează convenția semnelor.'],
    ['Distinguish temperature from transferred heat.','Calculate an energy change for a defined process.','Apply the first law and declare the sign convention.']],
   measurement:[['Notează observații și unități într-un tabel clar.','Desenează un grafic cu axe și unități.','Analizează erori sistematice și variația datelor.'],
    ['Record observations with units in a clear table.','Draw a graph with labelled axes and units.','Analyse systematic errors and data variation.']],
   modern:[['Descrie o dovadă experimentală pentru modelul atomic.','Aplică o relație cuantificată simplă și verifică unitățile.','Identifică unde încetează să fie valid modelul clasic.'],
    ['Describe experimental evidence for an atomic model.','Apply a simple quantised relation and check its units.','Identify a case where the classical model fails.']]
  };
  // Distinct concept progression for the *school year within the subject*.
  // The existing lesson supplies a specific scientific principle, while
  // these original, topic-specific lenses develop it from observation through
  // model-based evaluation. They are pedagogical and never falsely attributed
  // to an unverified national annual syllabus.
  const annualDepth={
   units:[
    ['Mai întâi identificăm ce măsurăm: lungime, masă, durată sau temperatură. Pentru o comparație corectă, pornim de la zero, citim unitatea și nu inventăm cifre pe care scala nu le arată.',
     'Transformarea unităților nu schimbă mărimea fizică. De pildă, 250 cm înseamnă 2,50 m; pentru un rezultat valid trebuie notate atât valoarea, cât și instrumentul și precizia citirii.',
     'Repetările arată dispersia citirilor, nu garantează dispariția erorilor. Media, rezoluția și incertitudinea trebuie discutate separat; o riglă greșit etalonată poate deplasa toate valorile.',
     'Pentru o mărime calculată, erorile intră și în rezultat. Comparăm un model cu datele folosind reziduuri și intervale de incertitudine, fără a modifica observațiile ca să se potrivească graficului.'],
    ['Start by identifying the quantity: length, mass, time or temperature. Read the zero and unit of a scale and never invent digits that the instrument cannot resolve.',
     'Converting units leaves the physical quantity unchanged: 250 cm is 2.50 m. A defensible result records both the numerical value and the instrument resolution.',
     'Repeated readings reveal scatter but cannot remove systematic error by themselves. Discuss mean, resolution and uncertainty separately; a miscalibrated ruler can bias every observation.',
     'Uncertainty also affects derived quantities. Compare model predictions with observations using residuals and uncertainty intervals; never alter measurements merely to improve a fitted line.']],
   kinematics:[
    ['Alegem un reper și descriem unde este obiectul la momente diferite. Drumul parcurs este lungimea traseului, iar deplasarea depinde doar de pozițiile inițială și finală.',
     'Viteza medie se calculează dintr-o distanță și un interval de timp corespunzător. Comparăm două intervale pe același traseu și notăm viteza în m/s, nu doar cuvintele «repede» și «încet».',
     'Panta graficului poziție–timp reprezintă viteza într-un model unidimensional. Când panta se schimbă, mișcarea nu mai este uniformă, iar viteza medie nu descrie fiecare moment.',
     'Legăm poziția, viteza și accelerația prin derivate sau variații finite. Verificăm dacă modelul cu accelerație constantă reproduce datele și unde frecarea îi limitează precizia.'],
    ['Choose a reference frame and record the object position at different times. Path length measures the route travelled; displacement depends only on its initial and final positions.',
     'Compute average speed from matching distance and time intervals. Compare two intervals on the same route and report m/s rather than only saying the object is fast or slow.',
     'The gradient of a position–time graph represents velocity in a one-dimensional model. A changing gradient means non-uniform motion; an average cannot describe every instant.',
     'Connect position, velocity and acceleration through derivatives or finite differences. Test the constant-acceleration prediction against data and assess effects such as friction.']],
   dynamics:[
    ['O forță este o interacțiune care poate schimba mișcarea sau forma unui corp. Săgețile din diagrama de forțe arată corpul asupra căruia acționează fiecare forță.',
     'Când forțele se compensează, rezultanta este zero și viteza nu se schimbă într-un reper inerțial. Un corp care se mișcă nu are nevoie de o forță rezultantă înainte.',
     'Legea a doua a lui Newton leagă rezultanta de accelerație: F=ma, pentru masă constantă. Separăm reacțiunea planului de frecare și nu adunăm acțiune–reacțiune ca forțe pe același corp.',
     'Folosim diagrame pe axe și parametri măsurabili pentru a testa o predicție dinamică. Dacă frecarea depinde de viteză, un model cu forță de frecare constantă nu mai descrie tot experimentul.'],
    ['A force is an interaction that can alter motion or shape. Every arrow on a free-body diagram must specify which object experiences that force.',
     'When forces balance, net force is zero and velocity remains constant in an inertial frame. An object in steady motion needs no forward net force.',
     'Newton’s second law relates net force to acceleration: F=ma for constant mass. Separate normal reaction from friction; action–reaction forces act on different bodies.',
     'Use resolved forces and measurable parameters to test a dynamic model. If friction depends on speed, a constant-friction assumption will fail over some observations.']],
   energy:[
    ['Urmărim de unde vine energia și unde se transferă, de exemplu din bateria unei lanterne în lumină și încălzire. Energia nu este un material care dispare.',
     'Pentru un corp ridicat, energia potențială gravitațională depinde de masă și înălțime. La coborâre, energia se poate transforma în mișcare și încălzire prin frecare.',
     'Bilanțul energetic include intrarea, ieșirea utilă și pierderile, toate în jouli. Randamentul este energia utilă împărțită la energia furnizată și nu poate depăși 100% într-un dispozitiv pasiv.',
     'Testăm un bilanț energetic cu date și incertitudini, folosind lucru mecanic și variația energiei cinetice. În sistemele disipative conservarea energiei nu înseamnă conservarea energiei mecanice.'],
    ['Track where energy comes from and where it goes, such as a torch battery producing light and heating. Energy is transferred rather than used up as a material.',
     'Gravitational potential energy of a raised body depends on mass and height. During descent, some energy becomes motion and some is dissipated by friction.',
     'An energy balance includes input, useful output and losses, all in joules. Efficiency is useful output divided by input, and cannot exceed 100% for a passive device.',
     'Test energy accounting with data and uncertainty using work and changes in kinetic energy. In a dissipative system, total energy is conserved even when mechanical energy is not.']],
   fluids:[
    ['Observăm că lichidele iau forma vasului și că același obiect poate pluti sau se poate scufunda. Nu confundăm forma vasului cu cantitatea de lichid.',
     'Presiunea pe o suprafață este forța perpendiculară împărțită la arie, p=F/A. Aceeași forță produce presiune mai mare când acționează pe o arie mai mică.',
     'În lichidul în repaus, presiunea crește cu adâncimea conform relației Δp=ρgΔh. Flotabilitatea depinde de greutatea lichidului deplasat, nu doar de masa obiectului.',
     'Modelele Bernoulli și continuitatea vA=constant cer condiții precizate. Comparăm curgere laminară și turbulentă și explicăm de ce vâscozitatea și pierderile schimbă predicțiile.'],
    ['Observe that a liquid takes the container shape and that objects may float or sink. Do not confuse container shape with the amount of liquid.',
     'Pressure is normal force divided by contact area, p=F/A. The same force produces greater pressure over a smaller contact area.',
     'For a fluid at rest, pressure changes with depth as Δp=ρgΔh. Buoyancy equals the weight of displaced fluid, not merely a function of the object mass.',
     'Continuity and Bernoulli models require specified assumptions. Compare laminar and turbulent flow and explain how viscosity and energy losses modify predictions.']],
   heat:[
    ['Senzația de cald nu este un termometru. Comparăm citiri de temperatură și observăm că transferul de energie prin căldură se face spontan dinspre mai cald spre mai rece.',
     'Încălzirea fără schimbare de stare se poate aproxima prin Q=mcΔT. Identificăm masa, variația temperaturii și materialul înainte de a calcula energia în jouli.',
     'La topire sau fierbere, energia transferată poate modifica starea fără să crească temperatura. Separăm căldura latentă de variația temperaturii și analizăm pierderile spre mediu.',
     'Un grafic temperatură–timp permite estimarea ritmului de răcire. Modelul depinde de izolație, schimbul cu aerul și erorile instrumentului; nu presupunem adiabaticitate fără justificare.'],
    ['Feeling warm is not a thermometer. Compare measured temperatures and observe spontaneous heat transfer from hotter to colder surroundings.',
     'For heating without phase change, Q=mcΔT can approximate the transferred energy. Identify mass, temperature change and material before calculating joules.',
     'During melting or boiling, transferred energy can change state without increasing temperature. Distinguish latent heat from temperature rise and account for losses.',
     'A temperature–time graph reveals cooling rates. Predictions depend on insulation, air exchange and sensor errors; never assume an adiabatic process without justification.']],
   electric:[
    ['Recunoaștem o sursă cu baterie, fire și un receptor într-un circuit sigur. Curentul cere un circuit închis și nu se testează niciodată direct la priză.',
     'Curentul I măsoară sarcina pe unitatea de timp, iar tensiunea U energia transferată pe unitatea de sarcină. Nu confundăm volții cu amperii.',
     'Pentru un rezistor ohmic la temperatură aproximativ constantă, U=RI. Un grafic I–U aproape liniar permite estimarea rezistenței și a erorii de măsurare.',
     'Modelele electrice reale pot fi neliniare: becurile se încălzesc, iar rezistența se schimbă. Analizăm caracteristica măsurată și domeniul în care aproximarea ohmică rămâne valabilă.'],
    ['Identify a safe battery source, leads and load. Current requires a closed circuit; never experiment on mains electricity.',
     'Current I is charge flow per time, while voltage U is energy transferred per unit charge. Volts and amperes measure different physical quantities.',
     'For an ohmic resistor at nearly fixed temperature, U=RI. A roughly linear current–voltage plot estimates resistance and measurement uncertainty.',
     'Real electrical behaviour may be nonlinear: a filament heats up and resistance changes. Analyse the measured current–voltage curve and the range of ohmic validity.']],
   circuits:[
    ['Desenăm bucla prin care curentul poate circula și identificăm sursa și receptorul. Un întrerupător deschis întrerupe calea în serie.',
     'Într-o legare în serie, aceeași intensitate traversează elementele; în paralel, ramurile au aceeași tensiune între noduri. Folosim baterii de joasă tensiune.',
     'Rezistențele echivalente diferă: Rserie=R1+R2, iar 1/Rparalel=1/R1+1/R2. Verificăm curentul total și disiparea de putere pentru fiecare ramură.',
     'Legile Kirchhoff exprimă conservarea sarcinii în noduri și a energiei în ochiuri. Pentru rețele cu mai multe ramuri formulăm ecuații independente și comparăm rezultatul cu un model simulat.'],
    ['Draw a complete current path and identify source and load. Opening a switch in a series loop interrupts that path.',
     'Series elements carry the same current; parallel branches share the same potential difference across their end nodes. Use only low-voltage batteries.',
     'Equivalent resistance differs: Rseries=R1+R2 and 1/Rparallel=1/R1+1/R2. Check total current and power dissipation across branches.',
     'Kirchhoff laws express charge conservation at junctions and energy conservation around loops. Derive independent equations for multibranch networks and compare simulated results.']],
   waves:[
    ['O riglă care vibrează oscilează în jurul unei poziții, pe când o undă transportă o perturbație. Materia mediului nu trebuie să călătorească odată cu unda.',
     'Perioada T este durata unei oscilații, iar frecvența f=1/T se măsoară în hertzi. Nu confundăm frecvența cu amplitudinea.',
     'Viteza de propagare, frecvența și lungimea de undă satisfac v=fλ pentru undele periodice. În reflexie se schimbă direcția propagării, iar în interferență se suprapun perturbațiile.',
     'Un semnal eșantionat prea rar poate produce aliasing: frecvența observată diferă de cea reală. Testăm rezonanța și interferența printr-un model cu condiții inițiale și la limită.'],
    ['A vibrating ruler oscillates near a rest position, whereas a wave carries a disturbance. The material need not travel with the wave.',
     'Period T is one oscillation time and frequency f=1/T is measured in hertz. Frequency and amplitude describe different features.',
     'For periodic waves, speed, frequency and wavelength satisfy v=fλ. Reflection changes propagation direction, while interference superposes disturbances.',
     'Undersampling can cause aliasing and an incorrect apparent frequency. Test resonance and interference using stated initial and boundary conditions.']],
   optics:[
    ['Lumina produce umbre când un obiect opac blochează razele. Pentru reflexie desenăm suprafața, normala și direcția razelor, fără a privi surse luminoase intense.',
     'Unghiul de reflexie este egal cu unghiul de incidență, măsurate față de normală. Separăm reflexia de refracția produsă la trecerea în alt mediu.',
     'Lentilele convergente pot forma imagini reale sau virtuale, în funcție de poziția obiectului. Modelul lentilei subțiri 1/f=1/u+1/v este o aproximație geometrică.',
     'Pentru unde coerente, maximele și minimele pot apărea prin interferență; difracția limitează rezoluția. Explicăm condițiile paraxiale și de ce modelul de raze nu descrie toate fenomenele.'],
    ['Light produces shadows when opaque objects block rays. For reflection draw surface, normal and rays without looking into intense sources.',
     'The angle of reflection equals incidence angle, both measured from the normal. Distinguish reflection from refraction at a material boundary.',
     'Converging lenses form real or virtual images depending on object distance. The thin-lens relation 1/f=1/u+1/v is a geometric approximation.',
     'Coherent light can create interference maxima and minima; diffraction limits resolution. Explain paraxial assumptions and why ray optics cannot account for all phenomena.']],
   electromagnetism:[
    ['Un magnet poate atrage unele materiale feromagnetice, dar nu toate metalele. Explorăm proprietățile fără prize și fără a pune magneții lângă aparate sensibile.',
     'Un curent produce un câmp magnetic în jurul conductorului. Un electromagnet alimentat scurt cu baterie își poate modifica efectul prin numărul de spire.',
     'Forța magnetică asupra unui conductor depinde de orientarea curentului și a câmpului. Folosim regula mâinii și precizăm direcțiile înaintea calculelor.',
     'O variație a fluxului magnetic produce t.e.m. indusă; legea Faraday–Lenz stabilește și sensul opoziției. Analizăm o curbă flux–timp fără a inventa date de laborator.'],
    ['A magnet attracts some ferromagnetic materials but not all metals. Explore magnets without mains electricity and keep them away from sensitive devices.',
     'Current creates a magnetic field around a wire. A briefly powered battery electromagnet can vary its effect with the number of turns.',
     'Magnetic force on a current-carrying conductor depends on field and current directions. Resolve the orientation before making calculations.',
     'Changing magnetic flux induces an emf; Faraday–Lenz law specifies its opposing sense. Analyse a flux–time curve without inventing laboratory observations.']],
   thermodynamics:[
    ['Temperatura caracterizează starea unui sistem, nu cantitatea de căldură aflată în el. Căldura și lucrul mecanic sunt două căi de transfer energetic.',
     'Pentru a descrie încălzirea sau comprimarea, definim sistemul și mediul. Un gaz poate primi căldură și totodată efectua lucru asupra exteriorului.',
     'Prima lege leagă energia internă de căldură și lucru mecanic; semnele depind de convenția aleasă. În procesul izocor, lucrul pΔV este zero.',
     'Pe o diagramă p–V, lucrul efectuat de un gaz este aria orientată sub curbă. Comparăm procese izoterme și adiabate precizând ipotezele și ireversibilitățile.'],
    ['Temperature is a property of state, not an amount of heat contained in a body. Heat and work are modes of energy transfer.',
     'For heating or compression, define the system and surroundings. A gas can absorb heat while simultaneously performing work.',
     'The first law relates internal energy, heat and work using an explicitly chosen sign convention. At constant volume pΔV work is zero.',
     'On a pressure–volume plot, work done by the gas is the signed area under a path. Compare isothermal and adiabatic models with their assumptions and irreversibilities.']],
   measurement:[
    ['Înregistrăm datele într-un tabel cu mărimea, numărul și unitatea. Un grafic fără nume și unități pe axe nu arată clar ce a fost măsurat.',
     'Un grafic pune două mărimi în relație, iar fiecare punct reprezintă o pereche de valori. Scala axelor trebuie aleasă fără a deforma interpretarea.',
     'Media și abaterea descriu aspecte diferite ale datelor. O dreaptă de ajustare rezumă un model, dar punctele pot să se abată prin variații aleatorii sau erori sistematice.',
     'Analizăm reziduuri, incertitudinea parametrilor și validitatea unui model. Corelația dintre date nu dovedește automat o relație de cauză-efect.'],
    ['Record observations in a table with quantity, value and unit. A graph without named axes and units cannot communicate what was actually measured.',
     'A graph relates two quantities, with each point representing a pair of values. Choose axis scales without distorting interpretation.',
     'Mean and spread describe different aspects of data. A fitted line summarizes a model while points may deviate through random variation or systematic bias.',
     'Analyse residuals, parameter uncertainty and model validity. Correlation of observations alone does not establish physical causation.']],
   modern:[
    ['Un model atomic este o explicație sprijinită de dovezi, nu o fotografie a atomului. Diferite experimente au impus schimbarea modelelor vechi.',
     'Lumina poate fi caracterizată și prin fotoni, fiecare cu energie E=hf. Frecvența crește odată cu energia unui foton; intensitatea și frecvența nu sunt același lucru.',
     'Tranzițiile între niveluri energetice produc sau absorb fotoni cu energia egală cu diferența nivelurilor. Spectrele sunt dovezi ale structurii energetice discrete.',
     'Comparam predicții cuantice cu limitele modelelor clasice și discutăm efectul fotoelectric și radiația, fără experimente cu surse radioactive.'],
    ['An atomic model is an evidence-based explanation, not a photograph of an atom. Different observations forced revisions to earlier models.',
     'Light can also be described in photons, each with energy E=hf. Photon energy rises with frequency; light intensity and frequency are not identical.',
     'Transitions between energy levels emit or absorb photons whose energy matches the level difference. Spectra support discrete atomic structure.',
     'Compare quantum predictions with the limits of classical models, including the photoelectric effect, without using radioactive sources.']]
  };
  const depth=Math.min(3,Math.round(rank*3/Math.max(1,available.length-1)));
  const lens=annualDepth[topic]?.[language==='ro'?0:1]?.[depth]||'';
  const ro=language==='ro',phaseIndex=Math.min(2,Math.round(rank*2/Math.max(1,available.length-1)));
  const selected=probes[topic]?.[ro?0:1]?.[phaseIndex]||
   (ro?inquiryRo:inquiryEn)[Math.min(rank,6)][0];
  const closing=ro?
   'Răspunsul trebuie să se refere la conceptul din această lecție, să precizeze datele, unitățile, ipotezele și modul de verificare.':
   'The answer must refer to this specific concept and state relevant data, units, assumptions and a way to check the result.';
  return entries.map((entry,index)=>({...entry,
   statement:String(entry.statement||'')+(lens?' '+lens:''),
   workedExample:String(entry.workedExample||entry.example||'')+
    (lens?' '+(ro?'Aplicare progresivă: ':'Progressive application: ')+lens:''),
   id:'advisory-physics-'+code+'-'+scoped+'-'+tier+'-'+entry.id,
   grade:scoped,source:'oer-original-advisory',nationallyVerified:false,
   advisoryTier:tier,chapterIndex:index+1,
   exercise:(entry.exercise||'')+' '+(ro?'Extensie pentru «':'Year extension for “')+
    entry.title+(ro?'»: ':'”: ')+selected,
   answer:(entry.answer||'')+' '+closing
  }));
 }
 if(phase==='upper'){
  const index=all.findIndex(y=>String(y.id)===scoped);
  if(index<0)return [];
  const entries=(Array.isArray(referenceLessons)?referenceLessons:[]).filter(entry=>
   entry.subject==='physics'&&entry.topic===topic&&
   ['beginner','intermediate'].includes(entry.level)&&entry.statement&&entry.title);
  return entries.map((entry,n)=>({...entry,
   id:'advisory-physics-upper-'+code+'-'+scoped+'-'+entry.id,
   grade:scoped,source:'oer-original-advisory',nationallyVerified:false,
   chapterIndex:n+1}));
 }
 return [];
}
