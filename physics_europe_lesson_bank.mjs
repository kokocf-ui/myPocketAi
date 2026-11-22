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
  const ro=language==='ro',phaseIndex=Math.min(2,Math.round(rank*2/Math.max(1,available.length-1)));
  const selected=probes[topic]?.[ro?0:1]?.[phaseIndex]||
   (ro?inquiryRo:inquiryEn)[Math.min(rank,6)][0];
  const closing=ro?
   'Răspunsul trebuie să se refere la conceptul din această lecție, să precizeze datele, unitățile, ipotezele și modul de verificare.':
   'The answer must refer to this specific concept and state relevant data, units, assumptions and a way to check the result.';
  return entries.map((entry,index)=>({...entry,
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
