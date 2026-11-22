import {astronomyCountryGradePlan} from './astronomy_europe_frameworks.mjs';
// Astronomy study cards: original, year-scoped educational examples. The
// country chooser supplies actual school-year labels; the teaching sequence
// remains advisory until a jurisdiction's optional curriculum is verified.
// Do not present live positions, actual observations or mandatory classes.
export const ASTRONOMY_STUDY_CASES=Object.freeze({
 "solar": {
  "core": [
   "Soarele este o stea, iar Pământul şi celelalte planete se deplasează în jurul său. Rotaţia Pământului explică alternanţa zilei şi nopţii; anotimpurile depind în principal de înclinarea axei, nu de apropierea de Soare.",
   "Fazele Lunii sunt schimbări ale porţiunii iluminate vizibile de pe Pământ. Eclipsele cer şi o aliniere cu planul orbitei; de aceea nu apar la fiecare Lună nouă sau plină.",
   "Sistemul Solar s-a format dintr-un disc de gaz şi praf. Orbitele planetelor se compară prin perioadă, distanţă şi excentricitate, fără a confunda masele, dimensiunile şi scara modelului."
  ],
  "examples": [
   "Marchează Soarele pe o foaie şi roteşte o bilă etichetată Pământ: partea luminată se schimbă pe măsură ce bila se roteşte. Nu priveşti Soarele real pentru a verifica modelul.",
   "Folosind o lampă fixă şi o bilă pentru Lună, schimbă poziţia observatorului din model. Notează cum se modifică forma zonei iluminate văzute; nu interpreta umbra Pământului ca explicaţie a fazelor.",
   "Compară un traseu de orbită circulară cu unul eliptic, păstrând steaua în focar. Modelele arată geometria, nu viteze reale ori distanţe la scară."
  ],
  "questions": [
   "De ce apar ziua şi noaptea?",
   "De ce Luna nu este eclipsată la fiecare Lună plină?",
   "De ce o orbită schematică nu oferă singură perioada unei planete?"
  ],
  "answers": [
   "Pentru că Pământul se roteşte, expunând pe rând regiuni către Soare.",
   "Pentru că orbita Lunii este înclinată şi de obicei nu există alinierea necesară.",
   "Fiindcă perioada depinde de parametri dinamici şi de distanţa orbitală, nu doar de forma desenată."
  ]
 },
 "sky": {
  "core": [
   "Bolta cerească este un model pentru direcţiile în care privim, nu o sferă solidă. Orizontul şi zenitul depind de poziţia observatorului.",
   "Mișcarea aparentă a cerului se schimbă cu rotația Pământului, latitudinea și timpul. Constelațiile sunt regiuni definite convențional şi stelele lor pot fi la distanţe foarte diferite.",
   "Coordonatele de orizont, altitudine și azimut, descriu direcţii locale; ascensia dreaptă şi declinaţia aparţin unui alt sistem de referinţă. Poziţiile observate trebuie însoţite de timp şi loc."
  ],
  "examples": [
   "Desenează linia orizontului şi punctul de deasupra capului, apoi marchează o stea imaginară. Schimbă orientarea desenului pentru a vedea diferenţa dintre direcţia nord şi înălţime.",
   "Compară desenele aceluiaşi obiect ceresc făcute la ore diferite într-un atlas. Desenul arată poziţii aparente, nu că obiectul ar fi făcut o rotaţie completă în jurul Pământului.",
   "Pe o hartă schematică arată un punct la 30° deasupra orizontului, spre est. Nu transforma acest reper în ascensie dreaptă fără timpul sideral şi localizarea observatorului."
  ],
  "questions": [
   "Ce reprezintă zenitul?",
   "Sunt stelele unei constelaţii obligatoriu apropiate între ele?",
   "De ce altitudinea unui astru nu poate fi dată independent de loc şi timp?"
  ],
  "answers": [
   "Direcţia verticală de deasupra observatorului.",
   "Nu, alăturarea lor este una aparentă, pe cer.",
   "Pentru că sistemul orizontal este definit de observator şi rotaţia Pământului."
  ]
 },
 "distances": {
  "core": [
   "Unităţile sunt alese după scara distanţelor: kilometrul în jurul Pământului, unitatea astronomică în Sistemul Solar şi anul-lumină între stele. Anul-lumină măsoară distanţa, nu timpul.",
   "Lumina se propagă cu viteză finită. Când observăm un corp îndepărtat, recepţionăm radiaţie emisă anterior, nu o imagine instantanee a acelui corp.",
   "Paralaxa este deplasarea unghiulară aparentă produsă de schimbarea poziţiei de observaţie. La distanţe stellare, analiza cere poziţii calibrate şi unghiuri foarte mici."
  ],
  "examples": [
   "Foloseşte etichete pentru Pământ şi Soare şi compară 1 km cu 1 unitate astronomică. Nu desena orbitele la scară dacă nu ai spaţiul necesar.",
   "Dacă un semnal luminos parcurge 300 000 km într-o secundă, un traseu dublu ar necesita aproximativ două secunde. Este un calcul rotunjit, nu o măsurare astrală exactă.",
   "O stea cu paralaxa anuală p = 0,5 secunde de arc se află la 2 parseci, deoarece d(pc)=1/p(arcsec). Relaţia este valabilă pentru paralaxa anuală în definiţia parsecului."
  ],
  "questions": [
   "Anul-lumină este unitate de timp sau distanţă?",
   "De ce vedem stelele aşa cum erau când au emis lumina?",
   "Ce distanţă corespunde unei paralaxe anuale de 0,25 arcsec?"
  ],
  "answers": [
   "Este unitate de distanţă.",
   "Lumina are o viteză finită şi are nevoie de timp pentru a ajunge la noi.",
   "4 parseci, din d=1/0,25."
  ]
 },
 "gravity": {
  "core": [
   "Gravitaţia explică atracţia dintre corpuri şi schimbarea mişcării lor. Orbitele apar prin combinaţia mişcării şi atracţiei gravitaţionale, nu prin absenţa gravitaţiei.",
   "Legile lui Kepler descriu geometria orbitelor şi raporturi între arii, timp şi semiaxă. Modelul cu două corpuri este aproximativ; perturbaţiile altor corpuri pot conta.",
   "În aproximaţie circulară, viteza orbitală depinde de masa centrală şi de distanţa faţă de centru. Valoarea calculată nu reprezintă automat viteza unei nave pe o traiectorie eliptică reală."
  ],
  "examples": [
   "Trasează o tangentă la un cerc şi o săgeată spre centru; ele reprezintă viteza instantanee şi acceleraţia centripetă, care nu sunt aceeaşi direcţie.",
   "Desenează o elipsă cu Soarele într-un focar şi compară două sectoare de arii egale: arcul parcurs aproape de focar este mai lung într-un interval egal.",
   "Pentru o masă centrală de 5,97×10²⁴ kg şi distanţa 6,37×10⁶ m, viteza circulară ideală este circa 7,9 km/s, fără atmosferă sau rotaţia Pământului."
  ],
  "questions": [
   "De ce nu cade Luna direct pe Pământ în modelul orbital?",
   "Ce rămâne egal în intervale de timp egale potrivit legii a doua a lui Kepler?",
   "Ce ipoteze folosește v=√(GM/r)?"
  ],
  "answers": [
   "Are viteză transversală şi îşi schimbă continuu direcţia sub acţiunea gravitaţiei.",
   "Ariile măturate de raza vectoare.",
   "Orbită circulară ideală şi o masă centrală dominantă."
  ]
 },
 "stars": {
  "core": [
   "Stelele emit energie prin reacţii nucleare în interior, pe durata multor etape evolutive. Nu toate stelele au aceeaşi temperatură, masă şi vârstă.",
   "Luminozitatea intrinsecă şi strălucirea observată sunt noţiuni diferite. Spectrul şi culoarea pot furniza informaţii despre temperatura efectivă şi compoziţie, cu limite observaţionale.",
   "Diagrama Hertzsprung–Russell compară luminozitatea şi temperatura efectivă. Poziţia unei stele indică unele proprietăţi şi stadii, nu neapărat vârsta exactă fără un model suplimentar."
  ],
  "examples": [
   "Compară o stea de masă mică şi una de masă mare într-un tabel cu temperatură şi durată de viaţă aproximative. Nu presupune că toate ajung supernove.",
   "Două lămpi identice pot părea cu străluciri diferite dacă sunt la distanţe diferite; analogia ilustrează de ce fluxul observat nu este luminozitatea proprie.",
   "Plasează simbolic Soarele pe secvenţa principală a unei diagrame H–R şi distinge axa temperaturii, care este adesea reprezentată descrescător spre dreapta."
  ],
  "questions": [
   "Care este procesul energetic principal al Soarelui în secvenţa principală?",
   "De ce o stea slabă pe cer nu trebuie să fie intrinsec slab luminoasă?",
   "Ce două mărimi compară o diagramă H–R?"
  ],
  "answers": [
   "Fuziunea hidrogenului în heliu în nucleu.",
   "Poate fi mult mai îndepărtată.",
   "Luminozitatea şi temperatura efectivă (sau clasa spectrală)."
  ]
 },
 "galaxies": {
  "core": [
   "O galaxie conţine stele, gaz, praf şi materie întunecată, organizate gravitaţional. Calea Lactee este o galaxie, nu întregul Univers.",
   "Galaxiile diferă prin formă, masă, populaţii stelare şi procese de formare stelară. O clasificare morfologică nu stabileşte singură istoria completă a galaxiei.",
   "Spectrele şi deplasarea spre roşu oferă indicii despre mişcare şi distanţă, însă interpretarea cosmologică depinde de model şi de componenta gravitaţională locală."
  ],
  "examples": [
   "Compară imagini de galaxii spiralate şi eliptice şi descrie braţele, discul şi distribuţia luminii; nu presupune că imaginile au aceeaşi scară.",
   "Pe o diagramă schematică separă gazul, stelele şi mediul interstelar. Formarea stelară nu se produce uniform în întreaga galaxie.",
   "O linie spectrală observată la o lungime de undă mai mare decât cea de laborator indică un redshift pozitiv; magnitudinea nu dă singură distanţa fără context."
  ],
  "questions": [
   "Este Calea Lactee o stea sau o galaxie?",
   "Poate forma aparentă a unei galaxii dovedi vârsta ei exactă?",
   "De ce trebuie identificată linia spectrală de referinţă când estimăm redshiftul?"
  ],
  "answers": [
   "O galaxie care cuprinde foarte multe stele.",
   "Nu; sunt necesare date fizice suplimentare.",
   "Pentru a compara lungimea de undă emisă cu cea observată."
  ]
 },
 "observations": {
  "core": [
   "O observaţie astronomică utilă consemnează locul, timpul, condiţiile cerului şi instrumentul. O imagine fără scară şi orientare poate induce concluzii greşite.",
   "Telescopul colectează lumină; mărirea nu garantează rezoluţia. Apertura, turbulenţa atmosferei şi expunerea influenţează ce poate fi distins.",
   "Fotometria măsoară fluxuri relative sau absolute printr-o procedură calibrată. Datele reale trebuie însoţite de erori, controale şi descrierea instrumentului."
  ],
  "examples": [
   "Înregistrează data şi ora unui desen lunar făcut cu ochiul liber şi marchează dacă cerul era acoperit. Nu încerca să priveşti Soarele direct.",
   "Două instrumente cu măriri diferite pot avea rezoluţii foarte diferite; compară aperturile şi condiţiile atmosferei, nu numai numărul de pe ocular.",
   "Construieşte un tabel demonstrativ cu timp şi flux relativ normalizat; marchează clar valorile ca simulate, nu ca observaţii reale."
  ],
  "questions": [
   "De ce notăm ora şi locul observaţiei?",
   "De ce o mărire mare nu garantează mai mult detaliu?",
   "Ce informaţii trebuie să însoţească un grafic fotometric?"
  ],
  "answers": [
   "Pentru ca poziţiile şi condiţiile observării să poată fi interpretate.",
   "Rezoluţia este limitată de apertură, atmosferă şi instrument.",
   "Unităţi, timp, procedura de calibrare şi incertitudini."
  ]
 },
 "cosmology": {
  "core": [
   "Cosmologia studiază structura şi evoluţia Universului pe scară mare. Expansiunea descrie creşterea distanţelor cosmologice medii, nu explozii de galaxii dintr-un centru al spaţiului.",
   "Fondul cosmic de microunde şi abundenţele elementelor uşoare sunt dovezi importante în modelul cosmologic standard. Modelele sunt testate şi rafinate pe date.",
   "Legea Hubble–Lemaître descrie aproximativ relaţia dintre redshift şi distanţă pentru obiecte suficient de apropiate cosmologic; la redshift mare sunt necesare relaţii cosmologice integrale."
  ],
  "examples": [
   "Pe un elastic cu puncte desenate, întinderea măreşte distanţele relative fără a defini un punct de explozie pe suprafaţă. Analogia are limite şi nu este spaţiul real.",
   "Compară două măsurători ale temperaturii medii a fondului cosmic şi discută eroarea instrumentală; nu inventa valori experimentale.",
   "Pentru H₀≈70 km/s/Mpc şi d=10 Mpc, modelul liniar dă circa 700 km/s; relaţia este idealizată şi nu se aplică identic tuturor distanţelor."
  ],
  "questions": [
   "Expansiunea necesită un centru al Universului în interiorul spaţiului?",
   "De ce sunt importante datele despre fondul cosmic de microunde?",
   "Ce precauţie trebuie luată la folosirea legii Hubble pentru distanţe mari?"
  ],
  "answers": [
   "Nu, modelele omogene nu necesită un astfel de centru.",
   "Oferă constrângeri asupra evoluţiei timpurii şi parametrilor cosmologici.",
   "Aproximaţia liniară locală trebuie înlocuită cu un model cosmologic adecvat."
  ]
 },
 "exoplanets": {
  "core": [
   "Exoplanetele orbitează alte stele decât Soarele. Detectarea indirectă poate folosi tranzite, viteze radiale şi alte efecte gravitaţionale sau luminoase.",
   "Un tranzit produce o scădere temporară a fluxului stelAR când geometria este favorabilă. Nu toate planetele tranzitează din perspectiva Pământului.",
   "Zona locuibilă este o regiune dependentă de stea şi de presupunerile despre planetă; nu dovedeşte prezenţa vieţii şi nici a apei lichide la suprafaţă."
  ],
  "examples": [
   "Desenează un cerc mic trecând peste unul mai mare şi compară aria acoperită; adâncimea ideală a tranzitului este (Rp/Rs)².",
   "Dacă Rp/Rs=0,1, pierderea ideală relativă de flux este de aproximativ 1%; petele stelare şi zgomotul instrumental pot modifica curba măsurată.",
   "Compară două planete cu aceeaşi distanţă faţă de stele de luminozităţi diferite; condiţiile de iradiere nu sunt automat identice."
  ],
  "questions": [
   "De ce nu vedem tranzite pentru toate exoplanetele?",
   "Care este adâncimea ideală pentru Rp/Rs=0,05?",
   "O planetă în zona locuibilă este sigur locuită?"
  ],
  "answers": [
   "Pentru că trebuie aliniată geometria orbitală cu linia noastră de observaţie.",
   "(0,05)²=0,0025, adică 0,25%.",
   "Nu, este doar un criteriu de iradiere în anumite modele."
  ]
 }
});
export function astronomySchoolTopicLessons({country='',grade='',stage='primary',topic='',years=[],lessons=[]}={}){
 if(!['primary','lower','upper'].includes(stage)||!topic)return [];
 const yearList=Array.isArray(years)?years:[],idx=yearList.findIndex(x=>String(x?.id)===String(grade));
 if(idx<0||!ASTRONOMY_STUDY_CASES[topic])return [];
 const tier=yearList.length===1?0:Math.round(idx*3/(yearList.length-1));
 const rank={beginner:0,intermediate:1,advanced:2};
 const max=stage==='upper'?1:0;
 const source=lessons.filter(x=>x?.subject==='astronomy'&&x.topic===topic&&
  (rank[x.level]??3)<=max&&x.statement&&x.title);
 if(!source.length)return [];
 const limit=Math.min(stage==='primary'?2:stage==='lower'?3:4,source.length);
 const offset=(tier*limit)%source.length;
 const plan=ASTRONOMY_STUDY_CASES[topic];
 const scope=astronomyCountryGradePlan({country,stage,grade,years:yearList});
 const sourceContext=scope.topicIds.includes(topic)&&scope.programmeRo?
  ' Corelare pe țară și an: '+scope.programmeRo+'. Fișa explică această temă printr-un exemplu original; nu reproduce integral programa sau manualul.' : '';
 return Array.from({length:limit},(_,i)=>{
  const entry=source[(offset+i)%source.length],slot=(tier+i)%(stage==='upper'?plan.core.length:2);
  const prefix=stage==='primary'?'Observăm şi explicăm: ':
   stage==='lower'?'Explicăm mecanismul: ':'Analizăm modelul şi limitele: ';
  return {...entry,id:'astronomy-'+String(country).toUpperCase()+'-'+String(grade)+'-'+stage+'-'+topic+'-'+(i+1),
   grade:String(grade),stage,sourceId:entry.id,language:'ro',
   formula:stage==='primary'?'':entry.formula,
   statement:entry.statement+' '+prefix+plan.core[slot]+sourceContext,
   workedExample:plan.examples[slot],exercise:plan.questions[slot],answer:plan.answers[slot],
   curriculumScope:scope.kind==='unverified'?
    'Original advisory Astronomy study; national curriculum not yet verified':
    scope.noteRo,
   curriculumSource:scope.source||null,
   curriculumEvidenceScope:scope.sourceScope||null,
   countryProgramme:scope.programmeRo||null,
   nationalTopicsVerified:scope.topicsVerified,
   laboratoryType:'safe-observation-or-simulation'
  };
 });
}
export const ASTRONOMY_TOPIC_DIAGRAMS=Object.freeze({
 solar:['solar','orbit'],sky:['sky'],distances:['parallax','telescope'],
 gravity:['orbit','solar'],stars:['hr','telescope'],galaxies:['galaxy','cosmos'],
 observations:['telescope','parallax'],cosmology:['cosmos','galaxy'],exoplanets:['transit','orbit'],
 'special-stellar':['hr','telescope'],'special-dynamics':['orbit','solar'],
 'special-galactic':['galaxy','cosmos'],'special-cosmo':['cosmos','galaxy'],
 'special-planetary':['transit','solar'],'special-instruments':['telescope','parallax'],
 'special-highenergy':['hr','galaxy']
});
export function astronomyLabMaterial({topic='',stage='primary',grade='',language='ro'}={}){
 const plan=ASTRONOMY_STUDY_CASES[topic]||ASTRONOMY_STUDY_CASES[
  {'special-stellar':'stars','special-dynamics':'gravity','special-galactic':'galaxies',
   'special-cosmo':'cosmology','special-planetary':'exoplanets','special-instruments':'observations',
   'special-highenergy':'stars'}[topic]];
 if(!plan)return '';
 const idx=stage==='primary'?0:stage==='lower'?1:2,ro=language==='ro';
 const title=ro?'Laborator de astronomie — observaţie şi model':'Astronomy practical — observation and model';
 const materials=ro?'Caiet, creion, riglă şi o diagramă ori simulare. Nu folosi instrumente optice către Soare fără filtre solare profesionale certificate.':
  'Notebook, pencil, ruler and a diagram or simulation. Never point optical instruments at the Sun without professionally certified solar filters.';
 return [
  '# '+title+' · '+(grade||''),
  '# '+(ro?'Obiectiv':'Objective'),plan.core[idx],
  '# '+(ro?'Materiale şi siguranţă':'Materials and safety'),materials,
  '# '+(ro?'Procedură':'Procedure'),plan.examples[idx],
  '# '+(ro?'Fişa de observaţie':'Observation record'),
  ro?'Notează în tabel: data şi ora (dacă există observaţie reală), variabila studiată, observaţia, valoarea sau desenul şi sursa. Orice date simulate trebuie marcate explicit „simulare”.':
   'Record time (if observational), variable, observation, measured value or sketch, and source. Label any simulated data clearly.',
  '# '+(ro?'Analiză şi întrebări':'Analysis and questions'),plan.questions[idx],
  '# '+(ro?'Răspuns orientativ':'Reference answer'),plan.answers[idx],
  '# '+(ro?'Concluzie şi limite':'Conclusion and limitations'),
  ro?'Separă observaţia directă de interpretare. Modelul nu păstrează automat scara, nu furnizează poziţii astronomice în timp real şi nu produce date experimentale reale.':
   'Separate observed evidence from interpretation. Diagrams are not automatically to scale, do not provide live sky positions and are not experimental measurements.'
 ].join('\n\n');
}
