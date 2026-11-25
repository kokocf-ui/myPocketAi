// Distinct, grade-aware study chapters for every country in the Education selector.
// These are original learning materials, not purported national compulsory reading lists.
// Verified national frameworks and previously authored grade lessons are preserved.
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';
import {EDUCATION_WORLDWIDE_SCHEMES,worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {LIT_NATIONAL_PACK_YEARS} from './literature_europe_client_lazy.mjs';

export const LITERATURE_50_COUNTRIES=Object.freeze(
 'AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK GB-ENG GB-SCT GB-WLS GB-NIR'.split(' ')
);

// The order below is a TEACHING progression, never a claim about the order
// prescribed by a ministry, exam board, province, canton or school.
const YEAR_SKILLS={
 beginner:[
  ['Primele texte: ascult, recunosc și citesc','sunete, cuvinte, enunțuri și personaje din texte scurte','citesc și formulez un răspuns într-un enunț'],
  ['Citesc fluent și povestesc','succesiunea faptelor, dialogul și sensurile cuvintelor','povestesc trei evenimente în ordine'],
  ['Înțeleg ideea principală','detalii, personaje, titlu, vers și descriere','explic ideea principală folosind un detaliu din text'],
  ['Compar povești, poezii și mesaje','rezumat, trăsături ale personajului, ortografie și compunere','compar două texte scurte și scriu un rezumat'],
  ['Disting tipuri de texte','narațiune, descriere, dialog, informație și opinie','justific printr-un exemplu diferența dintre două texte'],
  ['Citesc critic și redactez coerent','perspectivă, cauză și efect, stil și surse','redactez o interpretare structurată cu exemple']
 ],
 lower:[
  ['Narațiunea și tradiția orală','basm, legendă, acțiune, narator, vocabular și personaje','identific naratorul și povestesc conflictul principal'],
  ['Poezie și expresivitate','imagini artistice, ritm, voce lirică și comparație','explic efectul a două expresii dintr-un poem'],
  ['Personaj, conflict și punct de vedere','relații între personaje, cauză, caracterizare și perspectivă','demonstrez o trăsătură folosind două dovezi'],
  ['Text dramatic și comparație','replică, scenă, conflict, alegerea perspectivelor și interpretare','compar două scene sau două texte argumentat'],
  ['Lectură critică și sinteză','temă, simbol, contextualizare, argument și surse','scriu un comentariu coerent cu trimiteri la text'],
  ['De la analiză la eseu','genuri, influențe, comparație și evaluarea argumentelor','susțin o interpretare și discut o lectură alternativă']
 ],
 medium:[
  ['Genuri literare și interpretare','proză, lirică, dramatic, structuri, limbaj și dovezi','formulez o teză de interpretare și o susțin textual'],
  ['Literatura și contextul cultural','epocă, idei, receptare, identitate și tradiții literare','corelez un element al operei cu un context verificabil'],
  ['Romane, poezie și tehnici expresive','perspectivă, timp narativ, imagini, registre și stil','compar tehnici din două fragmente autentice'],
  ['Curente și argumentare literară','evoluții literare, intertextualitate, analiză și eseu','construiesc un eseu comparativ cu surse citate'],
  ['Lectură independentă și sinteză','interpretări concurente, critică de surse și redactare','susțin și revizuiesc o interpretare argumentată'],
  ['Pregătire de evaluare și cercetare','portofoliu, sinteză, problematizare și etica citării','redactez o lucrare originală evaluată după criterii clare']
 ],
 advanced:[
  ['Metode de studiu literar','poetică, naratologie, hermeneutică, comparatism și cercetare','formulez o ipoteză verificabilă și un plan de analiză'],
  ['Seminar de interpretare','critică textuală, istorie literară, receptare și argument','compar interpretări cu citări și precizez limitele'],
  ['Proiect academic de literatură','corpus, metodologie, bibliografie, etică și susținere','produc un proiect documentat, fără surse sau citate inventate']
 ]
};

const ORIGINAL_EXAMPLES={
 beginner:[
  'Lia a găsit o frunză galbenă. A dus-o în clasă și a descris-o.',
  'Un pui de arici a traversat grădina. Copiii l-au privit de la distanță.',
  'Dimineața, Daria a deschis cartea. Pe prima pagină era desenată o pădure.',
  '— Unde este caietul? — Pe masă, lângă carte, a răspuns fratele.',
  'Ploaia picură ușor. Pe geam apar linii subțiri și strălucitoare.',
  'Băiatul a vrut să ajute. A întrebat mai întâi ce lucru era necesar.'
 ],
 lower:[
  'La început nimeni nu credea povestea. La final, un obiect uitat a schimbat părerea satului.',
  'Personajul a tăcut când prietena i-a cerut explicații; abia apoi a spus motivul.',
  'Umbrele copacilor se lungesc, iar drumul pare că ascultă pașii călătorului.',
  '— Pleci fără să vorbești? — Mă întorc când voi putea explica, răspunse tânărul.',
  'În prima versiune, naratorul descrie conflictul; în a doua, personajul îl povestește.',
  'O întâmplare comună capătă două semnificații diferite pentru cei doi martori.'
 ],
 medium:[
  'Naratoarea revine după zece ani în același loc, dar amintirea contrazice ceea ce vede.',
  'Într-o strofă originală, imaginea ferestrei sugerează atât depărtare, cât și așteptare.',
  'Două personaje descriu același eveniment în moduri opuse, deși niciunul nu minte.',
  'O scenă începe cu un refuz și se termină cu o întrebare; conflictul rămâne deschis.',
  'Un comentariu pretinde că personajul este egoist, însă nu oferă niciun pasaj ca dovadă.',
  'O ediție nouă păstrează textul de bază, dar schimbă ortografia și notele explicative.'
 ],
 advanced:[
  'Un critic asociază un motiv literar cu o epocă; cercetătorul verifică dacă textul îl susține.',
  'Două traduceri ale aceluiași poem schimbă registrul și ritmul fără a schimba ideea centrală.',
  'O ipoteză de lectură trebuie comparată cu pasaje și cu bibliografia consultată, nu doar afirmată.'
 ]
};

// Each year has its own focus and worked example. The same small static list
// is NOT reused as if it were the full national year-by-year textbook.
const CHAPTERS=[
 ['parcurs','Tema clasei și obiectivele de lectură','genres',
  'Definește termenii esențiali, arată ce știe deja elevul și demonstrează competența cu textul original.'],
 ['intelegere','Atelier: înțelegerea unui text','genres',
  'Separă informația explicită de inferență; formulează trei întrebări de dificultate crescătoare și explică răspunsurile.'],
 ['narativ','Proză: acțiune, narator și personaje','narrative',
  'Arată relația dintre situație, întâmplări și personaj; justifică observația printr-un detaliu concret.'],
 ['poezie','Poezie: imagine, ritm și sens','poetry',
  'Observă versul sau imaginea poetică fără a inventa citate; explică efectul limbajului cu un exemplu original.'],
 ['dialog','Dialog și exprimare orală','communication',
  'Analizează o replică, tonul și sensul; construiește un dialog original potrivit vârstei.'],
 ['vocabular','Vocabular și sens în context','grammar',
  'Explică sensuri din context, familii de cuvinte sau registre, la nivelul clasei; corectează o eroare motivat.'],
 ['exprimare','Scriere corectă și construcția frazei','grammar',
  'Predă o regulă de limbă accesibilă nivelului, un exemplu rezolvat și un contraexemplu explicat.'],
 ['redactare','Atelier de scriere și revizuire','composition',
  'Arată un plan, redactează un model scurt și revizuiește claritatea, ideile și ortografia.'],
 ['interpretare','Interpretare, comparație și dovezi','commentary',
  'Distingere între observație, inferență și opinie; două argumente ancorate în text, fără certitudini inventate.'],
 ['verificare','Recapitulare și evaluare aplicată','essay',
  'Propune cinci sarcini diverse, de la înțelegere la redactare, cu explicația criteriilor de evaluare.']
];

function studyYears(country,stage){
 const known=EDUCATION_SCHOOL_YEARS[country]?.[stage];
 if(known?.length)return known.map(x=>String(x.id));
 if(EDUCATION_WORLDWIDE_SCHEMES[country]){
  const rows=worldwideSchoolYears(country,stage);
  if(rows?.length)return rows.map(x=>String(x.id));
 }
 if(stage==='advanced')return ['higher-education'];
 const token=stage==='beginner'?'primary':stage;
 return Array.from({length:4},(_,i)=> 'general-'+token+'-'+(i+1));
}
function normalTitle(title){
 return String(title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
}
function yearRows(country,stage,grade,yearIndex){
 const skills=YEAR_SKILLS[stage]||YEAR_SKILLS.medium;
 const [theme,knowledge,outcome]=skills[Math.min(yearIndex,skills.length-1)];
 const examples=ORIGINAL_EXAMPLES[stage]||ORIGINAL_EXAMPLES.medium;
 return CHAPTERS.map(([id,label,area,method],chapterIndex)=>{
  const chapterTitle=chapterIndex===0?theme:
   label+' · '+(yearIndex+1);
  const example=examples[(yearIndex+chapterIndex)%examples.length];
  const focus='Capitol de învățare original, nu lectură obligatorie: '+theme+
   '. Țara/jurisdicția: '+country+'; etapa: '+stage+'; an/clasă: '+grade+
   '. Obiectivul lecției: '+knowledge+'. Rezultat observabil: '+outcome+
   '. '+method+' Fragment original creat pentru exercițiu: „'+example+
   '”. Explică întâi, demonstrează pe acest fragment, apoi propune două exerciții distincte cu rezolvări motivate. Adaptează vocabularul la anul selectat. Folosește opera reală numai dacă utilizatorul a ales-o și există o sursă verificabilă.';
  return ['eu-year-'+country.toLowerCase()+'-'+stage+'-'+
   String(grade).toLowerCase().replace(/[^a-z0-9-]/g,'-')+'-'+id,chapterTitle,focus,area];
 });
}
function mergeUnique(existing,additional){
 const merged=existing.map(row=>row.slice());
 const ids=new Set(merged.map(x=>String(x[0])));
 const labels=new Set(merged.map(x=>normalTitle(x[1])));
 for(const row of additional){
  if(ids.has(String(row[0]))||labels.has(normalTitle(row[1])))continue;
  ids.add(String(row[0]));labels.add(normalTitle(row[1]));merged.push(row);
 }
 return merged;
}
export function expandLiteratureEuropeanGrades(programs){
 const coverage={countries:0,yearPaths:0,originalChapters:0};
 for(const country of LITERATURE_50_COUNTRIES){
  const original=programs[country]||null;
  // The seven dedicated profiles are frozen at top level and deliberately
  // shared with their source module. Keep the same object identity, extending
  // only its (unfrozen) grade catalogue; never replace existing authored rows.
  const profile=original||{
   source:null,sourceTitle:null,regions:false,verified:{},
   note:'Parcurs pedagogic original, orientativ; programa oficială pentru țară, limbă de predare, regiune, clasă și filieră nu este încă verificată. Nu sunt atribuite opere obligatorii.',
   grades:{},byLevel:{},byGrade:{}
  };
  if(!original)programs[country]=profile;
  if(!profile.byGrade){
   if(Object.isFrozen(profile))throw Error('Frozen literature profile lacks grade catalogue: '+country);
   profile.byGrade={};
  }
  if(!profile.grades){
   if(Object.isFrozen(profile))throw Error('Frozen literature profile lacks year catalogue: '+country);
   profile.grades={};
  }
  const stages=['beginner','lower','medium','advanced'];
  const currentYears=Object.fromEntries(stages.map(stage=>[stage,studyYears(country,stage)]));
  for(const stage of stages){
   // Older profile lists sometimes assign a currently selectable year to a
   // different stage. Generate that year under the selector's actual stage,
   // while retaining legacy-only years and existing national chapter rows.
   const legacy=(profile.grades[stage]||[]).filter(grade=>
    currentYears[stage].includes(grade)||!stages.some(other=>other!==stage&&currentYears[other].includes(grade)));
   const ids=[...new Set([...legacy,...currentYears[stage]])];
   profile.grades[stage]=ids.slice();
   const knownYears=studyYears(country,stage);
   for(const grade of ids){
    const idx=knownYears.indexOf(grade)>=0?knownYears.indexOf(grade):ids.indexOf(grade);
    const before=profile.byGrade[grade]||[];
    // Existing detailed national packages stay intact; small selections
    // receive genuine year-targeted chapters instead of generic level repeats.
    const additions=yearRows(country,stage,grade,idx);
    const roPriority=['intelegere','dialog','vocabular','interpretare','verificare',
     'poezie','narativ','redactare','parcurs','exprimare'];
    const selected=country==='RO'?
     roPriority.map(id=>additions.find(row=>String(row[0]).endsWith('-'+id))):additions;
    // Romanian pupil-facing routes must remain focused, not a sprawling
    // second menu duplicating grammar. Preserve the original 7–8 chapters,
    // enriching up to twelve with selected, usable activities.
    const max=country==='RO'?12:Number.POSITIVE_INFINITY;
    // National-pack years of the dedicated profiles drop the generic
    // sixteen-row sequence and expose only the national-pack chapter keys.
    const nationalYear=(LIT_NATIONAL_PACK_YEARS[country]?.[stage]||[]).includes(grade);
    const base=nationalYear?before.filter(row=>String(row[0]).startsWith('eu-year-')):before;
    const expanded=!nationalYear&&before.length>=15?before.map(row=>row.slice()):
     mergeUnique(base,selected).slice(0,max);
    if(!profile.byGrade[grade]||nationalYear||expanded.length>before.length)
     profile.byGrade[grade]=expanded;
    coverage.yearPaths++;
    coverage.originalChapters+=expanded.length;
   }
  }
  coverage.countries++;
 }
 return coverage;
}
