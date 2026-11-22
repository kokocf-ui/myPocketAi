import {astronomyUpperSupplement} from './astronomy_upper_secondary.mjs';
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
// Primary is a safe integrated introduction, not university content or a
// claim that Astronomy is a mandatory separate subject.
export const ASTRONOMY_PRIMARY_ALLOWED=Object.freeze({
 solar:['astro-solar-1','astro-solar-2','astro-solar-4','astro-solar-5'],
 sky:['astro-sky-1','astro-sky-2','astro-sky-6'],
 distances:['astro-distances-6','astro-distances-1'],
 observations:['astro-observations-5','astro-observations-6'],
 stars:['astro-stars-1']
});
export const ASTRONOMY_PRIMARY_CASES=Object.freeze({
 solar:{core:[
  'Soarele este o stea, Pământul este o planetă, iar Luna este satelitul natural al Pământului. Desenul arată obiecte diferite, nu dimensiunile și distanțele reale.',
  'Partea Pământului orientată spre Soare are zi, iar partea opusă are noapte. Pământul se rotește în jurul axei proprii, nu Soarele în jurul Pământului.'
 ],examples:[
  'Desenează Soarele, Pământul și Luna cu etichete. Unește cele trei obiecte și explică de ce un desen pe o foaie nu poate păstra distanțele reale din spațiu.',
  'Ține o lanternă fixă și rotește ușor o minge cu un punct marcat. Punctul trece prin zona luminată și cea întunecată. Nu privi niciodată direct Soarele.'
 ],questions:['Ce tip de corp este Soarele și care este satelitul natural al Pământului?','De ce apare ziua urmată de noapte?'],
 answers:['Soarele este o stea, iar Luna este satelitul natural al Pământului.','Deoarece Pământul se rotește în jurul propriei axe.']},
 sky:{core:[
  'Orizontul este limita aparentă dintre cer și pământ acolo unde îl putem vedea. Constelațiile sunt forme de recunoaștere, nu stele aflate obligatoriu la aceeași distanță.',
  'Stelele par să se deplaseze pe cer în decursul nopții. Această mișcare aparentă se explică în mare parte prin rotația Pământului în jurul propriei axe.'
 ],examples:[
  'Desenează un peisaj și marchează orizontul. Identifică un obiect deasupra și unul dedesubtul liniei în desen; spune ce parte a scenei reprezintă cerul.',
  'Compară două hărți simple ale cerului la ore diferite. Notează ce s-a schimbat și propune o explicație legată de rotația Pământului, fără a pretinde poziții actuale.'
 ],questions:['Este orizontul un zid real sau o limită aparentă?','De ce stelele par să-și schimbe poziția noaptea?'],
 answers:['O limită aparentă, care depinde de locul observării.','În principal, din cauza rotației Pământului.']},
 distances:{core:[
  'Luna este mult mai aproape de Pământ decât Soarele. Un desen cu aceste corpuri este util pentru identificare, dar de cele mai multe ori nu păstrează distanțele la scară.',
  'Lumina călătorește foarte repede, dar nu instantaneu. Pentru distanțe foarte mari se folosesc unități astronomice speciale, care nu trebuie confundate cu timpul.'
 ],examples:[
  'Pe o foaie desenează două obiecte apropiate și două depărtate. Explică de ce punctele de pe hârtie nu pot reprezenta singure kilometrii reali dintre corpurile cerești.',
  'Compară distanțele aproximative ale Pământului până la Lună și Soare într-un tabel furnizat de profesor; spune care este mai mare și de ce desenele nu au scară.'
 ],questions:['De ce un desen cu planete nu arată automat distanțele reale?','Anul-lumină este o distanță sau o durată?'],
 answers:['Fiindcă reprezintă schematic spațiul, fără o scară măsurată.','O unitate de distanță parcursă de lumină într-un an.']},
 observations:{core:[
  'Observarea cerului înseamnă să notăm ce vedem și în ce condiții. Data, ora, locul și desenul ajută la compararea observațiilor dintre seri diferite.',
  'Putem studia cerul prin schițe și simulări, fără telescop. Nu privim niciodată direct Soarele, nici prin binoclu sau telescop obișnuit fără protecție solară certificată.'
 ],examples:[
  'Ține un jurnal timp de două seri cu cer senin. Desenează forma Lunii, dacă este vizibilă, și notează data; dacă norii împiedică observația, notează exact acest lucru.',
  'Compară un desen propriu cu o simulare a fazelor Lunii și marchează diferențele. O simulare arată o posibilitate, nu dovedește ce era pe cer la tine.'
 ],questions:['Ce date notezi într-un jurnal al cerului?','Este sigur să privești Soarele prin binoclu fără filtru certificat?'],
 answers:['Data, ora, locul, condițiile și un desen sau descriere.','Nu. Observarea Soarelui fără filtru solar special certificat este periculoasă.']},
 stars:{core:[
  'Soarele este una dintre numeroasele stele ale Universului. Stelele par puncte luminoase noaptea pentru că sunt foarte îndepărtate; ele nu au toate aceeași culoare.',
  'O stea emite propria lumină. O planetă, precum Pământul, nu este o stea: vedem planetele pentru că reflectă lumina primită de la Soare sau altă stea.'
 ],examples:[
  'Desenează Soarele și o altă stea reprezentate prin două cercuri colorate. Precizează ce arată desenul corect și de ce nu poți deduce dimensiuni și distanțe reale.',
  'Compară un bec aprins și o minge luminată de bec, într-o cameră sub supraveghere. Explică de ce unul emite lumina, iar celălalt reflectă lumina primită.'
 ],questions:['Soarele este o stea sau o planetă?','Pământul emite lumină ca o stea sau reflectă lumina Soarelui?'],
 answers:['Soarele este o stea.','Pământul reflectă o parte din lumina Soarelui.']}
});
export const ASTRONOMY_PRIMARY_SKILLS=Object.freeze([
 'Recunoaște și numește obiectele cerești din desen fără calcule complicate.',
 'Compară două observații făcute în momente diferite.',
 'Construiește un model etichetat și precizează ce nu poate arăta corect.',
 'Folosește un jurnal sau un tabel simplu cu data și obiectul observat.',
 'Compară două explicații prin argumente bazate pe dovezi.',
 'Separă măsurarea, modelul și presupunerea; explică limitele concluziei.'
]);
export function astronomySchoolTopicLessons({country='',grade='',stage='primary',topic='',years=[],lessons=[]}={}){
 if(!['primary','lower','upper'].includes(stage)||!topic)return [];
 const yearList=Array.isArray(years)?years:[],idx=yearList.findIndex(x=>String(x?.id)===String(grade));
 if(idx<0||!ASTRONOMY_STUDY_CASES[topic])return [];
 const tier=yearList.length===1?0:Math.round(idx*3/(yearList.length-1));
 const rank={beginner:0,intermediate:1,advanced:2};
 const max=stage==='upper'?1:0;
 const allowed=stage==='primary'?ASTRONOMY_PRIMARY_ALLOWED[topic]||[]:null;
 const source=lessons.filter(x=>(!allowed||allowed.includes(x.id))&&x?.subject==='astronomy'&&x.topic===topic&&
  (rank[x.level]??3)<=max&&x.statement&&x.title);
 if(!source.length)return [];
 const limit=Math.min(stage==='primary'?2:stage==='lower'?3:4,source.length);
 const offset=(stage==='primary'?idx:tier*limit)%source.length;
 const plan=stage==='primary'?(ASTRONOMY_PRIMARY_CASES[topic]||ASTRONOMY_STUDY_CASES[topic]):ASTRONOMY_STUDY_CASES[topic];
 const cards=Array.from({length:limit},(_,i)=>{
  const entry=source[(offset+i)%source.length],slot=(stage==='primary'?idx+i:tier+i)%(stage==='upper'?plan.core.length:2);
  const prefix=stage==='primary'?'Observăm şi explicăm: ':
   stage==='lower'?'Explicăm mecanismul: ':'Analizăm modelul şi limitele: ';
  return {...entry,id:'astronomy-'+String(country).toUpperCase()+'-'+String(grade)+'-'+stage+'-'+topic+'-'+(i+1),
   grade:String(grade),stage,sourceId:entry.id,language:'ro',
   formula:stage==='primary'?'':entry.formula,
   statement:entry.statement+' '+prefix+plan.core[slot]+(stage==='primary'?' Competența etapei: '+ASTRONOMY_PRIMARY_SKILLS[Math.min(5,Math.floor(idx*6/yearList.length))]:''),
   workedExample:plan.examples[slot],exercise:plan.questions[slot],answer:plan.answers[slot],
   curriculumScope:'Original advisory Astronomy study, not a mandatory national grade programme',
   laboratoryType:'safe-observation-or-simulation'
  };
 });
 const supplement=stage==='upper'?astronomyUpperSupplement({country,grade,years:yearList,topic}):null;
 if(supplement)cards.push(supplement);
 return cards;
}
// One chapter's practical figures should represent that chapter; unrelated
// Solar System, parallax or galaxy cartoons must not be recycled everywhere.
export const ASTRONOMY_TOPIC_DIAGRAMS=Object.freeze({
 solar:['solar','phases'],
 sky:['skycoords','daynight'],
 distances:['lighttravel','parallax'],
 gravity:['orbit','orbittransfer'],
 stars:['stellarlife','hr'],
 galaxies:['galaxy','rotationcurve'],
 observations:['telescope','spectrum'],
 cosmology:['cosmos','redshift'],
 exoplanets:['transit','lightcurve'],
 'special-stellar':['stellarlife','spectrum'],
 'special-dynamics':['orbittransfer','orbit'],
 'special-galactic':['rotationcurve','galaxy'],
 'special-cosmo':['redshift','cosmos'],
 'special-planetary':['atmosphere','transit'],
 'special-instruments':['interferometer','telescope'],
 'special-highenergy':['accretion','spectrum']
});
export const ASTRONOMY_LAB_TOPIC=Object.freeze({
 solar:['Mișcări în Sistemul Solar','Solar System motions',
  'compararea mișcării de rotație cu revoluția folosind corpuri etichetate'],
 sky:['Coordonate și orientare','Sky coordinates and orientation',
  'estimarea altitudinii și azimutului pe o hartă simulată cu origine explicită'],
 distances:['Lumină și distanță','Light and distance',
  'conversia unităților astronomice și compararea geometriei de paralaxă'],
 gravity:['Orbite și gravitație','Orbits and gravity',
  'compararea vitezelor și ariilor măturate într-o orbită idealizată'],
 stars:['Stele și evoluție','Stars and evolution',
  'compararea temperaturii și luminozității dintr-un tabel de stele public sau simulat'],
 galaxies:['Structuri galactice','Galactic structures',
  'clasificarea a două galaxii și interpretarea unei curbe de rotație simulate'],
 observations:['Instrumente și observații','Instruments and observations',
  'estimarea rezoluției unei aperturi și documentarea condițiilor de observație'],
 cosmology:['Expansiunea Universului','Universe expansion',
  'compararea redshiftului și distanței într-un set de date etichetat ca simulat'],
 exoplanets:['Curbe de tranzit','Transit light curves',
  'calcularea adâncimii relative a unui tranzit cu un model controlat'],
 'special-stellar':['Modele stelare','Stellar models',
  'compararea unui model de secvență principală cu un obiect evoluat'],
 'special-dynamics':['Mecanică cerească','Celestial dynamics',
  'analiza unei orbite transferate și a ipotezelor dinamice'],
 'special-galactic':['Dinamica galactică','Galactic dynamics',
  'compararea curbei de rotație observate cu o aproximație Kepleriană'],
 'special-cosmo':['Parametri cosmologici','Cosmological parameters',
  'confruntarea unui model de expansiune cu redshifturile tabelate'],
 'special-planetary':['Atmosfere și planete','Planetary atmospheres',
  'compararea proprietăților atmosferelor planetare și a incertitudinilor'],
 'special-instruments':['Astrometrie și instrumentație','Astrometry and instrumentation',
  'evaluarea rezoluției și a calibrării unui instrument'],
 'special-highenergy':['Energii înalte','High energies',
  'separarea unui semnal energetic modelat de fondul simulat']
});
// The teaching method evolves every year; the practical is not the same
// three static activities repeated for all classes or university cohorts.
export const ASTRONOMY_LAB_YEAR_METHODS=Object.freeze({
 primary:[
  ['Recunoaște obiectele și descrie ceea ce observi într-un desen simplu.','Identify and describe the observed objects in a simple drawing.'],
  ['Compară două observații și consemnează ce s-a schimbat.','Compare two observations and record the change.'],
  ['Construiește un model simplu și explică de ce nu este la scară.','Make a simple model and explain its scale limitations.'],
  ['Organizează observațiile într-un tabel cu dată și descriere.','Organise observations in a date-and-description table.']
 ],
 lower:[
  ['Descrie variabilele și distinge observarea de explicație.','Identify variables and distinguish observation from explanation.'],
  ['Controlează un singur factor într-o comparație repetabilă.','Control one factor in a repeatable comparison.'],
  ['Construiește un grafic cu axe și unități pentru date simulate.','Plot labelled axes and units for simulated data.'],
  ['Examinează o ipoteză și explică limitele dovezilor disponibile.','Test a hypothesis and discuss evidence limitations.']
 ],
 upper:[
  ['Definește parametrii unui model și unitățile de măsură.','Define model parameters and their units.'],
  ['Aplică o relație matematică și verifică dimensiunile fizice.','Apply a mathematical relation and verify physical dimensions.'],
  ['Compară predicții ale două modele și descrie diferențele.','Compare two model predictions and describe their differences.'],
  ['Analizează incertitudinile și construiește un raport argumentat.','Analyse uncertainty and produce an evidence-based report.']
 ],
 advanced:[
  ['Documentează setul de date, unitățile și metodologia înainte de prelucrare.','Document data provenance, units and methods before analysis.'],
  ['Evaluează calibrarea, propagarea erorilor și reziduurile modelului.','Evaluate calibration, uncertainty propagation and fit residuals.'],
  ['Compară două ipoteze și cuantifică erorile sistematice posibile.','Compare competing hypotheses and quantify potential systematic errors.'],
  ['Construiește un proiect reproductibil cu limitări, bibliografie și cod sau calcule verificabile.','Build a reproducible study with limitations, references and checkable code or calculations.']
 ]
});
export function astronomyLabMaterial({topic='',stage='primary',grade='',language='ro',
 years=[],specialty=''}={}){
 const source=(stage==='primary'?ASTRONOMY_PRIMARY_CASES[topic]:null)||
  ASTRONOMY_STUDY_CASES[topic]||ASTRONOMY_STUDY_CASES[
  {'special-stellar':'stars','special-dynamics':'gravity','special-galactic':'galaxies',
   'special-cosmo':'cosmology','special-planetary':'exoplanets','special-instruments':'observations',
   'special-highenergy':'stars'}[topic]];
 const strand=ASTRONOMY_LAB_TOPIC[topic];
 if(!source||!strand)return '';
 const ro=language==='ro',isUniversity=stage==='advanced';
 const countryYearIndex=(Array.isArray(years)?years:[]).findIndex(y=>String(y?.id)===String(grade));
 const universityYear=Number(String(grade).replace('univ-',''));
 const stageMethods=ASTRONOMY_LAB_YEAR_METHODS[stage]||ASTRONOMY_LAB_YEAR_METHODS.upper;
 const localIndex=isUniversity?Math.max(0,Math.min(3,(universityYear||1)-1)):
  Math.max(0,countryYearIndex);
 const yearSlot=(Array.isArray(years)&&years.length>1)?
  Math.min(3,Math.floor(localIndex*4/years.length)):Math.min(3,localIndex);
 const method=stageMethods[yearSlot]||stageMethods[0];
 const sourceIndex=(localIndex+(
  Object.keys(ASTRONOMY_LAB_TOPIC).indexOf(topic)
 ))%source.core.length;
 const title=ro?'Laborator de astronomie: ':'Astronomy practical: ';
 const point=ro?strand[2]:
  'Use a chapter-specific simulated dataset or observational sketch with declared variables.';
 const provenance=ro?
  'Pentru date reale citează catalogul și data; orice valori inventate pentru demonstrație trebuie marcate SIMULARE.':
  'For real observations cite the catalogue and date; mark invented practice numbers as SIMULATED.';
 const safety=ro?
  'Nu privi Soarele direct și nici prin dispozitive optice fără filtre solare certificate.':
  'Never look at the Sun directly or through optical instruments without certified solar filters.';
 return [
  '# '+title+(ro?strand[0]:strand[1])+' · '+String(grade),
  '# '+(ro?'Obiectiv și întrebare de cercetare':'Research question and objective'),
  ro?point:'Study: '+(strand[1]||'')+'. '+source.core[sourceIndex],
  '# '+(ro?'Fundamentare':'Scientific background'),source.core[sourceIndex],
  '# '+(ro?'Materiale și siguranță':'Materials and safety'),
  (ro?'Caiet, riglă, desen sau simulare, tabel pentru rezultate; pentru nivel universitar se poate folosi un catalog public ori un program de analiză.':
   'Notebook, ruler, diagram or simulation and data sheet; advanced work may use a public catalogue or analysis software.')+' '+safety,
  '# '+(ro?'Metodă potrivită anului':'Year-specific method'),
  ro?method[0]:method[1],
  '# '+(ro?'Procedură specifică':'Topic-specific procedure'),source.examples[sourceIndex],
  '# '+(ro?'Fișa datelor':'Data sheet'),
  (ro?'Completează câmpurile: sursa, dată sau moment simulat, variabila independentă, variabila măsurată, unitate, incertitudine sau limită, rezultat observat.':
   'Record source, actual or simulated time, independent variable, measured variable, unit, uncertainty or limitation, observed result.'),
  '# '+(ro?'Exercițiu':'Check understanding'),source.questions[sourceIndex],
  '# '+(ro?'Rezultat orientativ':'Expected reasoning'),source.answers[sourceIndex],
  '# '+(ro?'Interpretare și limite':'Interpretation and limitations'),
  provenance+' '+(isUniversity?
   (ro?'Repetă analiza pentru altă selecție de date, compară reziduurile și discută dacă modelul poate explica fenomenul.':
    'Repeat analysis on a second selection, compare residuals and discuss whether the model explains the phenomenon.'):
   (ro?'Spune ce nu se poate concluziona din desen sau din datele disponibile.':
    'State what cannot be concluded from the drawing or available data.')),
  '# '+(ro?'Concluzie':'Conclusion'),
  ro?'Formulează o concluzie bazată pe observațiile sau simulările documentate; nu confunda reprezentările cu măsurătorile astronomice în timp real.':
   'Conclude from documented observations or simulation; do not mistake drawings for live astronomical measurements.'
 ].join('\\n\\n');
}
