// Biology laboratories must be relevant to the selected topic, year and
// specialty. No fabricated measurements, live microbial cultures, diagnoses,
// or one generic cell/DNA sketch repeated across unrelated courses.
export const BIOLOGY_LAB_GUIDES=Object.freeze({
 plants:{
  ro:['Compară frunzele a două plante obișnuite, fără să le rupi. Notează forma, nervurile, poziția pe tulpină și condițiile de lumină.','O fotografie ori un desen cu detalii observabile; diferențele nu demonstrează singure cauza adaptării.'],
  en:['Compare the leaves of two familiar plants without damaging them. Record shape, venation, stem arrangement and light exposure.','Use labelled photos or drawings; observed differences alone do not prove the cause of an adaptation.']},
 ecology:{
  ro:['Construiește o rețea trofică pe baza organismelor dintr-un habitat cunoscut. Identifică producători, consumatori, descompunători și sensul săgeților.','Verifică relațiile prin surse și separă o legătură posibilă de una observată efectiv.'],
  en:['Build a food web from species in a familiar habitat. Identify producers, consumers, decomposers and the direction of arrows.','Check feeding relationships against evidence; distinguish plausible links from observed ones.']},
 anatomy:{
  ro:['Interpretează o schemă anatomică etichetată, potrivită lecției. Urmărește traseul materiei sau al informației între organe.','O schemă arată relații structurale, nu starea de sănătate a unui elev. Nu efectua investigații clinice.'],
  en:['Read a labelled anatomical diagram appropriate to this lesson. Trace how matter or information moves among organs.','A diagram explains structure, not any pupil’s medical condition. Do not perform clinical tests.']},
 cells:{
  ro:['Compară două micrografii publice etichetate și aceeași scară. Identifică membrana, nucleul dacă există și structurile ce pot fi observate cu rezoluția imaginii.','Deosebește mărirea de rezoluție; nu atribui organite pe care fotografia nu le permite să fie distinse.'],
  en:['Compare two labelled public micrographs using a stated scale. Identify the membrane, nucleus if present and structures actually resolved.','Distinguish magnification from resolution; do not label invisible organelles.']},
 biomolecules:{
  ro:['Folosește un set de date publice despre o enzimă sau un model de macromoleculă. Desenează variația rezultatului cu o singură variabilă și unități pe axe.','Datele exemplifică un mecanism, dar nu dovedesc că orice enzimă răspunde identic.'],
  en:['Use published enzyme data or a macromolecule model. Plot the outcome against one variable with labelled units.','Illustrative data do not imply that all enzymes respond identically.']},
 genetics:{
  ro:['Modelează o încrucișare simplă cu alele cunoscute și notează ipoteza de dominanță. Compară probabilitățile cu rezultate observate, dacă există date publice.','Pătratul Punnett prezice proporții, nu rezultatul garantat într-o familie și nu descrie majoritatea trăsăturilor complexe.'],
  en:['Model a simple cross with identified alleles and explicit dominance assumptions. Compare probabilities with published counts where appropriate.','Punnett proportions are probabilities, not guaranteed family outcomes or a model of most complex traits.']},
 evolution:{
  ro:['Analizează un tabel public cu frecvențe ale unor trăsături în timp. Distinge modificarea frecvenței de adaptarea intenționată a individului.','Asocierea temporală singură nu identifică selecția naturală drept cauză; compară explicațiile alternative.'],
  en:['Examine a published table of trait frequencies across generations. Distinguish population change from deliberate individual adaptation.','A time trend alone does not establish natural selection as the cause; consider competing explanations.']},
 microbes:{
  ro:['Analizează o imagine publicată a unui microorganism sau un tabel epidemiologic agregat, fără prelevare și fără cultură. Identifică variabilele și ce date lipsesc.','Nu cultiva probe necunoscute și nu face interpretări clinice din imagini sau statistici izolate.'],
  en:['Study a published microbe image or aggregated surveillance table without collecting or culturing organisms. Identify variables and missing data.','Never culture unknown samples or make clinical interpretations from isolated images or statistics.']},
 homeostasis:{
  ro:['Desenează o buclă de feedback folosind un exemplu din lecție: stimul, receptor, centru de control, efector și răspuns.','Un model cu feedback negativ reprezintă un mecanism simplificat și nu este un test medical.'],
  en:['Draw a feedback loop relevant to the lesson: stimulus, sensor, controller, effector and response.','A negative-feedback diagram is a simplified mechanism, not a medical test.']},
 methods:{
  ro:['Compară două planuri experimentale: unul modifică o singură variabilă, altul modifică simultan mai multe. Identifică martorul și replicatele independente.','Nu inventa observații: notează ce date ar fi necesare pentru a evalua ipoteza.'],
  en:['Compare two study designs, one varying a single factor and one changing several. Identify the control and independent replicates.','Do not invent observations; state what evidence would be required to test the hypothesis.']}
});
export function biologySchoolLabSheet({entry=null,grade='',stage='lower',country='',language='ro'}={}){
 if(!entry||!entry.title||!entry.topic||!entry.statement)return null;
 const ro=language==='ro',locale=ro?'ro':'en';
 const guide=BIOLOGY_LAB_GUIDES[entry.topic];
 if(!guide)return null;
 const [activity,limits]=guide[locale];
 const level=stage==='primary'?
  (ro?'Observare și clasificare, fără instrumente de laborator.':'Observation and classification without laboratory equipment.'):
  stage==='lower'?
  (ro?'Investigație ghidată: formulează o întrebare și delimitează observația de interpretare.':
   'Guided inquiry: state a question and separate observation from interpretation.'):
  (ro?'Analiză controlată: identifică variabilele, martorul, replicatele și incertitudinea.':
   'Controlled analysis: identify variables, controls, replicates and uncertainty.');
 const headers=ro?[
  'BIOLOGIE · Activitate practică · '+country+' · '+grade,
  'Scopul specific al lecției','Context și concepte','Plan de activitate',
  'Exemplu explicat','Înregistrarea observațiilor','Exercițiu și verificare','Limite și siguranță'
 ]:[
  'BIOLOGY · Practical study · '+country+' · '+grade,
  'Lesson-specific objective','Background and concepts','Activity plan',
  'Worked illustration','Recording observations','Review question and check','Limitations and safety'
 ];
 const record=ro?
  'Completează un tabel: obiect/lot | trăsătură ori variabilă | observație sau sursa datelor | unitate, dacă există. Folosește numai valori observate sau publicate, niciodată rezultate inventate.':
  'Record a table: object/group | feature or variable | observation or data source | units where applicable. Use observed or published values only, never invented outcomes.';
 return [
  headers[0],'# '+entry.title,
  '# '+headers[1],level,
  '# '+headers[2],entry.statement,
  '# '+headers[3],activity,
  '# '+headers[4],entry.workedExample||entry.activity||entry.example||entry.statement,
  '# '+headers[5],record,
  '# '+headers[6],entry.exercise||entry.question|| (ro?'Ce concluzie susțin observațiile?':'Which conclusion do the observations support?'),
  (ro?'Verificare / posibilă explicație: ':'Check / possible explanation: ')+(entry.answer|| (ro?'Compară observațiile cu ipoteza și explică limitările.':'Compare the evidence with the hypothesis and explain its limitations.')),
  '# '+headers[7],limits,
  ro?'Nu preleva probe biologice de la persoane, nu cultiva microorganisme și folosește numai materiale potrivite vârstei.':
   'Do not collect human biological samples or culture microorganisms. Use age-appropriate safe materials.'
 ].join('\n\n');
}
export const BIOLOGY_UNIVERSITY_PRACTICALS=Object.freeze({
 cellular:{
  ro:['Comparație cantitativă de micrografii publice cu bare de scară','Calculează dimensiuni din pixeli și din bara de scară; verifică segmentarea și raportul dintre erorile de măsurare.'],
  en:['Quantitative analysis of published micrographs with scale bars','Estimate dimensions from pixel counts and scale bars; check segmentation and measurement uncertainty.']},
 molecular:{
  ro:['Aliniere de secvențe publice scurte și verificarea identității bazelor','Compară substituții, lacune și orientarea secvențelor; motivează un prag de similaritate fără a atribui automat funcții.'],
  en:['Alignment of short public sequences and base-level validation','Inspect substitutions, gaps and sequence orientation; justify a similarity threshold without assuming function.']},
 anatomy:{
  ro:['Analiza unui set public și anonimizat de fiziologie','Alege un indicator, compară intervale și explică ce factori pot influența măsurarea fără a diagnostica persoane.'],
  en:['Analysis of a public, anonymised physiology dataset','Choose an indicator, compare ranges and discuss measurement confounders without diagnosing individuals.']},
 microbiology:{
  ro:['Interpretarea datelor publice de supraveghere microbiană','Analizează distribuții și biasul de eșantionare; nu cultiva agenți biologici și nu presupune că frecvențele sunt diagnostice.'],
  en:['Interpretation of published microbial surveillance data','Analyse rates and sampling bias; do not culture organisms or treat population counts as diagnoses.']},
 biomedical:{
  ro:['Compararea performanței unor biomarkeri din date agregate','Explică sensibilitatea, specificitatea, prevalența și limitările fără a face recomandări medicale.'],
  en:['Performance review of biomarkers using aggregated data','Explain sensitivity, specificity, prevalence and limitations without making medical recommendations.']},
 biotech:{
  ro:['Modelarea randamentului unui bioproces în simulare','Definește intrările, ieșirile, consumul de resurse și compromisurile de mediu; nu realiza proceduri de editare genetică.'],
  en:['Simulation-based analysis of a bioprocess yield','Define inputs, outputs, resource use and environmental trade-offs; avoid practical genetic editing procedures.']},
 ecology:{
  ro:['Analiza unui transect public și a variabilității estimărilor de abundență','Compară metode de eșantionare, detectabilitatea și intervalele de încredere.'],
  en:['Analysis of a published transect and uncertainty in abundance estimates','Compare sampling methods, detectability and confidence intervals.']},
 bioinformatics:{
  ro:['Evaluarea unui flux reproductibil de analiză a secvențelor','Înregistrează versiunea setului public de date, parametrii analizei și o verificare independentă.'],
  en:['Evaluation of a reproducible sequence-analysis workflow','Record dataset version, analysis parameters and an independent validation check.']},
 neurobiology:{
  ro:['Analiza înregistrărilor neuronale simulate ori publice','Măsoară intervale dintre potențiale de acțiune și efectul zgomotului asupra inferențelor.'],
  en:['Study of simulated or public neuronal recordings','Measure inter-spike intervals and evaluate how noise affects inference.']}
});
export function biologyUniversityLabSheet({topic='',specialty='',grade='',courseDocument='',language='ro'}={}){
 const guide=BIOLOGY_UNIVERSITY_PRACTICALS[specialty];
 if(!guide||!String(courseDocument).trim()||!topic)return null;
 const ro=language==='ro',selected=guide[ro?'ro':'en'];
 return [
  '# '+(ro?'Laborator universitar · Biologie':'University biology practical')+' · '+grade,
  '# '+(ro?'Specializare':'Specialism')+': '+specialty,
  '# '+(ro?'Investigație caracteristică specializării':'Specialism-specific investigation'),selected[0],
  '# '+(ro?'Legătura cu lecția':'Relation to this course'),String(courseDocument),
  '# '+(ro?'Metodologie și calcul':'Method and analysis'),selected[1],
  ro?'Definește întrebarea și ipoteza. Notează exact sursa datelor, variabila, unitatea de analiză, martorul ori referința, numărul de observații independente și factorii de confuzie.':
   'State the question and hypothesis. Record the precise data source, variables, unit of analysis, controls or reference, independent observations and confounding factors.',
  '# '+(ro?'Reprezentare și control de calitate':'Presentation and quality control'),
  ro?'Construiește tabelul și graficul numai cu date reale publicate sau simulate explicit. Etichetează axele și unitățile; calculează o verificare independentă și descrie incertitudinea.':
   'Build tables and charts using published observations or clearly labelled simulations. Label axes and units; perform an independent check and report uncertainty.',
  '# '+(ro?'Întrebări și concluzie':'Review and conclusion'),
  ro?'Ce explicații alternative rămân? Ce rezultat ar contrazice ipoteza? Ce nu poate fi dedus din date?':
   'Which alternative explanations remain? What finding would contradict the hypothesis? What cannot be inferred from these data?',
  '# '+(ro?'Etică și siguranță':'Ethics and safety'),
  ro?'Folosește numai date publice, anonimizate ori simulări. Nu colecta probe umane, nu cultiva microorganisme și nu inventa rezultate sau aprobări etice.':
   'Use public anonymised data or simulations. Do not collect human samples, culture microbes, or fabricate results or ethics approval.'
 ].join('\n\n');
}
