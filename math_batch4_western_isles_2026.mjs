// Batch 4 of the 50-country Mathematics completion board (2026/27):
// Austria (AT), Switzerland (CH), Belgium (BE), Netherlands (NL), Luxembourg (LU),
// Ireland (IE), Scotland (GB-SCT), Wales (GB-WLS), Northern Ireland (GB-NIR) —
// Grade 1 → university.
// The year/topic plan is generated deterministically by
// scripts/generate_math_batch4_plan.mjs (math_batch4_plan_2026.mjs) from the
// shared original concept banks. Native early years (NL groep 1–2, IE Junior/
// Senior Infants) keep their dedicated age-appropriate inline lessons.
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).
// Lessons are original explanations, thematically aligned with the frameworks
// cited below; they do NOT reproduce textbooks and do NOT claim certified
// full annual coverage.

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';
import { BATCH4_MATH_PLAN } from './math_batch4_plan_2026.mjs';

export { BATCH4_MATH_PLAN };
export const BATCH4_MATH_COUNTRIES = Object.freeze(['AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR']);
export const BATCH4_NATIVE_YEARS = Object.freeze(['NL:beginner:G1', 'NL:beginner:G2', 'IE:beginner:JI', 'IE:beginner:SI']);

const WJEC_GCSE = 'https://www.wjec.co.uk/media/ojhfscmj/wjec-gcse-mathematics-and-numeracy-specification.pdf';
const CCEA_GCSE = 'https://ccea.org.uk/downloads/docs/Specifications/GCSE/GCSE%20Mathematics%20(2017)/GCSE%20Mathematics%20(2017)-specification-Standard_0.pdf';

export const BATCH4_MATH_SOURCES = Object.freeze({
  AT: { beginner: 'https://www.paedagogikpaket.at/', lower: 'https://www.paedagogikpaket.at/', medium: 'https://www.matura.gv.at/' },
  CH: { beginner: 'https://www.lehrplan21.ch/', lower: 'https://www.lehrplan21.ch/', medium: 'https://www.edk.ch/' },
  BE: { beginner: 'https://www.enseignement.be/', lower: 'https://www.enseignement.be/', medium: 'https://onderwijsdoelen.be/' },
  NL: { beginner: 'https://www.slo.nl/kerndoelen/', lower: 'https://www.slo.nl/kerndoelen/', medium: 'https://www.examenblad.nl/' },
  LU: { beginner: 'https://www.script.lu/', lower: 'https://men.public.lu/', medium: 'https://men.public.lu/' },
  IE: {
    beginner: 'https://curriculumonline.ie/repository/primary-subjects/mathematics/',
    lower: 'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/mathematics/',
    medium: 'https://ncca.ie/en/senior-cycle/curriculum-developments/mathematics/'
  },
  'GB-SCT': { beginner: 'https://education.gov.scot/curriculum-for-excellence/', lower: 'https://education.gov.scot/curriculum-for-excellence/', medium: 'https://www.sqa.org.uk/sqa/47419.html' },
  'GB-WLS': {
    beginner: 'https://hwb.gov.wales/curriculum-for-wales/mathematics-and-numeracy/',
    lower: 'https://hwb.gov.wales/curriculum-for-wales/mathematics-and-numeracy/',
    medium: { Y10: WJEC_GCSE, Y11: WJEC_GCSE, Y12: 'https://www.wjec.co.uk/', Y13: 'https://www.wjec.co.uk/' }
  },
  'GB-NIR': {
    beginner: 'https://ccea.org.uk/',
    lower: 'https://ccea.org.uk/',
    medium: { Y11: CCEA_GCSE, Y12: CCEA_GCSE, Y13: 'https://ccea.org.uk/', Y14: 'https://ccea.org.uk/' }
  },
  university: 'https://ehea.info/'
});

const CONCEPTS = Object.freeze({ ...B2_PRIMARY_BANK, ...B2_LOWER_BANK, ...B2_UPPER_BANK, ...B2_UNIVERSITY_BANK, ...B3_EXTRA_BANK });

const CURRENCY = Object.freeze({
  AT: 'euro', CH: 'franci elvețieni', BE: 'euro', NL: 'euro', LU: 'euro', IE: 'euro',
  'GB-SCT': 'lire sterline', 'GB-WLS': 'lire sterline', 'GB-NIR': 'lire sterline'
});

export const BATCH4_COUNTRY_NAMES = Object.freeze({
  AT: 'Austria', CH: 'Elveția', BE: 'Belgia', NL: 'Țările de Jos', LU: 'Luxemburg', IE: 'Irlanda',
  'GB-SCT': 'Scoția', 'GB-WLS': 'Țara Galilor', 'GB-NIR': 'Irlanda de Nord'
});

const UNI = { 'linear-algebra': 'Linear algebra', discrete: 'Discrete mathematics', differential: 'Differential equations' };
const UNIT_TITLES = Object.freeze({
  AT: { arithmetic: 'Zahlen und Operationen', geometry: 'Geometrie', measurement: 'Größen', algebra: 'Variablen und Algebra',
    statistics: 'Daten und Zufall', functions: 'Funktionale Abhängigkeiten', trigonometry: 'Trigonometrie', analysis: 'Analysis',
    'linear-algebra': 'Lineare Algebra', discrete: 'Diskrete Mathematik', differential: 'Differentialgleichungen' },
  CH: { arithmetic: 'Zahl und Variable', geometry: 'Form und Raum', measurement: 'Grössen und Masse', algebra: 'Zahl und Variable',
    statistics: 'Daten und Zufall', functions: 'Funktionale Zusammenhänge', trigonometry: 'Trigonometrie', analysis: 'Analysis',
    'linear-algebra': 'Lineare Algebra', discrete: 'Diskrete Mathematik', differential: 'Differentialgleichungen' },
  BE: { arithmetic: 'Arithmétique', geometry: 'Géométrie', measurement: 'Grandeurs', algebra: 'Algèbre',
    statistics: 'Traitement de données et probabilités', functions: 'Fonctions', trigonometry: 'Trigonométrie', analysis: 'Analyse',
    'linear-algebra': 'Algèbre linéaire', discrete: 'Mathématiques discrètes', differential: 'Équations différentielles' },
  NL: { arithmetic: 'Getallen en bewerkingen', geometry: 'Meetkunde', measurement: 'Meten', algebra: 'Algebra',
    statistics: 'Statistiek en kansrekening', functions: 'Functies en grafieken', trigonometry: 'Goniometrie', analysis: 'Differentiaal- en integraalrekening',
    'linear-algebra': 'Lineaire algebra', discrete: 'Discrete wiskunde', differential: 'Differentiaalvergelijkingen' },
  LU: { arithmetic: 'Nombres et opérations', geometry: 'Espace et formes', measurement: 'Grandeurs et mesures', algebra: 'Algèbre',
    statistics: 'Traitement de données', functions: 'Fonctions', trigonometry: 'Trigonométrie', analysis: 'Analyse',
    'linear-algebra': 'Algèbre linéaire', discrete: 'Mathématiques discrètes', differential: 'Équations différentielles' },
  IE: { arithmetic: 'Number', geometry: 'Shape and space', measurement: 'Measures', algebra: 'Algebra',
    statistics: 'Statistics and probability', functions: 'Functions', trigonometry: 'Trigonometry', analysis: 'Calculus', ...UNI },
  'GB-SCT': { arithmetic: 'Number, money and measure', geometry: 'Shape, position and movement', measurement: 'Measurement', algebra: 'Expressions and equations',
    statistics: 'Information handling and probability', functions: 'Relationships and functions', trigonometry: 'Trigonometry', analysis: 'Calculus', ...UNI },
  'GB-WLS': { arithmetic: 'Number', geometry: 'Geometry', measurement: 'Measures', algebra: 'Algebra',
    statistics: 'Statistics and probability', functions: 'Functions and graphs', trigonometry: 'Trigonometry', analysis: 'Calculus', ...UNI },
  'GB-NIR': { arithmetic: 'Number', geometry: 'Shape and space', measurement: 'Measures', algebra: 'Algebra',
    statistics: 'Handling data', functions: 'Functions and graphs', trigonometry: 'Trigonometry', analysis: 'Calculus', ...UNI }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

const IE_LABELS = Object.freeze({
  '1C': 'First Class', '2C': 'Second Class', '3C': 'Third Class', '4C': 'Fourth Class', '5C': 'Fifth Class', '6C': 'Sixth Class',
  J1: 'Junior Cycle, 1st Year', J2: 'Junior Cycle, 2nd Year', J3: 'Junior Cycle, 3rd Year',
  TY: 'Transition Year', '5Y': 'Senior Cycle, 5th Year', '6Y': 'Senior Cycle, 6th Year (Leaving Certificate)'
});
const LU_CYCLES = Object.freeze({ E1: 'cycle 2.1', E2: 'cycle 2.2', E3: 'cycle 3.1', E4: 'cycle 3.2', E5: 'cycle 4.1', E6: 'cycle 4.2' });

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  if (stage === 'advanced') {
    const n = Number(g);
    if (country === 'IE' || country === 'GB-SCT') return 'BSc (Hons) Mathematics, Year ' + g;
    if (country === 'GB-WLS' || country === 'GB-NIR') return 'BSc Mathematics, Year ' + g;
    const master = n === 4;
    if (country === 'AT') return master ? 'Masterstudium Mathematik, 1. Jahr' : 'Bachelorstudium Mathematik, ' + g + '. Jahr';
    if (country === 'CH') return master ? 'Master in Mathematik, 1. Jahr' : 'Bachelor in Mathematik, ' + g + '. Jahr';
    if (country === 'NL') return master ? 'Master Mathematics, jaar 1' : 'Bachelor Wiskunde, jaar ' + g;
    return master ? 'Master en mathématiques, 1re année' : 'Bachelier en mathématiques, année ' + g;
  }
  if (country === 'AT') {
    const n = Number(g);
    if (stage === 'beginner') return n + '. Klasse Volksschule';
    if (stage === 'lower') return n + '. Schulstufe (Mittelschule / AHS-Unterstufe, ' + (n - 4) + '. Klasse)';
    return n === 13 ? '13. Schulstufe (BHS, 5. Jahrgang)' : n + '. Schulstufe (AHS-Oberstufe ' + (n - 4) + '. Klasse / BHS ' + (n - 8) + '. Jahrgang)';
  }
  if (country === 'CH') {
    const n = Number(g);
    if (stage === 'beginner') return n + '. Klasse Primarstufe (HarmoS ' + (n + 2) + ')';
    if (stage === 'lower') return n + '. Schuljahr, Sekundarstufe I (HarmoS ' + (n + 2) + ')';
    return 'Gymnasium (Maturitätsschule), ' + (n - 9) + '. Jahr';
  }
  if (country === 'BE') {
    if (stage === 'beginner') return g + 'e primaire / ' + g + 'de leerjaar';
    return g.slice(1) + 'e secondaire / ' + g.slice(1) + 'de jaar secundair onderwijs';
  }
  if (country === 'NL') {
    if (stage === 'beginner') return 'groep ' + g.slice(1);
    if (stage === 'lower') return 'havo/vwo klas ' + g.slice(1) + ' (onderbouw)';
    return 'vwo klas ' + g.slice(1) + ' (bovenbouw)';
  }
  if (country === 'LU') {
    if (stage === 'beginner') return 'enseignement fondamental, ' + LU_CYCLES[g];
    return 'classe de ' + g + ' (enseignement secondaire classique)';
  }
  if (country === 'IE') return IE_LABELS[g] || g;
  if (country === 'GB-SCT') return (stage === 'beginner' ? 'Primary ' : 'Secondary ') + g.slice(1);
  return 'Year ' + g.slice(1);
}

function sourceFor(country, stage, grade) {
  if (stage === 'advanced') return BATCH4_MATH_SOURCES.university;
  const s = BATCH4_MATH_SOURCES[country][stage];
  return typeof s === 'string' ? s : s[String(grade)];
}

const TAIL = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';

export function batch4CurriculumFrame(country, stage, grade) {
  const g = String(grade);
  const name = BATCH4_COUNTRY_NAMES[country];
  const head = name + ', ' + gradeLabel(country, stage, g) + '. ';
  if (stage === 'advanced') {
    const length = ['IE', 'GB-SCT'].includes(country) ? 'licența cu onoruri durează de regulă 4 ani'
      : ['GB-WLS', 'GB-NIR'].includes(country) ? 'licența durează de regulă 3 ani'
      : 'licența (Bachelor) durează de regulă 3 ani, iar anul 4 corespunde primului an de master';
    return head + 'Sinteză universitară raportată la structura Bachelor/Master din Spațiul European al Învățământului Superior (Bologna); ' + length + ', iar fișele disciplinelor diferă între universități.' + TAIL;
  }
  const frames = {
    AT: {
      beginner: 'Corelare tematică cu noul Lehrplan pentru Volksschule (BMBWF), introdus treptat din 2023/24; în 2026/27 se aplică tuturor claselor 1–4.',
      lower: 'Corelare tematică cu noul Lehrplan pentru Mittelschule și AHS-Unterstufe, introdus treptat din 2023/24 și aplicat în 2026/27 tuturor claselor 5–8; ritmul și nivelul de aprofundare diferă între Mittelschule și AHS.',
      medium: 'Corelare tematică cu Lehrplan-ul AHS-Oberstufe și cu competențele de bază ale examenului de maturitate standardizat (SRP Mathematik); școlile BHS (HTL, HAK etc.) au un plan propriu de matematică aplicată, iar anul 13 există doar în BHS.'
    },
    CH: {
      beginner: 'Corelare tematică cu Lehrplan 21 (cantoanele germanofone); în Romandia se aplică Plan d\'études romand (PER), iar în Ticino Piano di studio. Clasa 1 urmează după doi ani de grădiniță (HarmoS 3), iar ordinea temelor pe ani diferă între cantoane.',
      lower: 'Corelare tematică cu ciclul 3 din Lehrplan 21 (Sekundarstufe I; PER în Romandia, Piano di studio în Ticino); nivelurile și tipurile de școală diferă de la un canton la altul.',
      medium: 'Corelare tematică cu obiectivele gimnaziului pentru maturitate (regulamentul de recunoaștere a maturității și planul-cadru EDK); fiecare canton își stabilește programa, iar durata gimnaziului diferă după canton.'
    },
    BE: {
      beginner: 'Programa este stabilită separat de comunitățile flamandă, franceză și germanofonă. Corelare tematică cu Référentiel de mathématiques du tronc commun (Fédération Wallonie-Bruxelles, aplicat în P1–P6) și cu noile minimumdoelen flamande, obligatorii la matematică din 1 septembrie 2026.',
      lower: 'Programa diferă între comunități. În Fédération Wallonie-Bruxelles trunchiul comun a ajuns în S1 în 2026/27 (S2 din 2027/28, S3 din 2028/29; până atunci se aplică Socles de compétences); în Flandra se aplică eindtermen pentru prima treaptă.',
      medium: 'Anii S4–S6 sunt în afara trunchiului comun: conținutul depinde de comunitate, de rețeaua de învățământ și de numărul de ore de matematică ales (în Flandra, eindtermen pentru treptele 2 și 3).'
    },
    NL: {
      beginner: 'Corelare tematică cu noile kerndoelen rekenen-wiskunde (SLO), în vigoare prin lege din 1 august 2026, și cu referentieniveaus 1F/1S; kerndoelen fixează obiective pentru finalul școlii primare, nu un cuprins pe fiecare groep.',
      lower: 'Corelare tematică cu kerndoelen pentru onderbouw (secundar inferior); vmbo, havo și vwo diferă esențial ca nivel, iar aici este urmat traseul havo/vwo.',
      medium: 'Corelare tematică cu programele de examen vwo (examenblad.nl); conținutul diferă între wiskunde A, B, C și D, iar havo se încheie după anul 5.'
    },
    LU: {
      beginner: 'Corelare tematică cu Plan d\'études de l\'enseignement fondamental (MENJE/SCRIPT, ediția 2026), formulat pe competențe și niveluri pe cicluri de câte doi ani, nu pe fiecare an.',
      lower: 'Corelare tematică cu programele enseignement secondaire classique (ESC); enseignement secondaire général (ESG) are programe diferite.',
      medium: 'Corelare tematică cu programele enseignement secondaire classique (ESC); în ciclul superior conținutul de matematică depinde de secția aleasă, iar ESG are programe diferite.'
    },
    IE: {
      beginner: 'Corelare tematică cu Primary Mathematics Curriculum (NCCA, 2023), care descrie obiective pe etape de câte doi ani, nu pe fiecare clasă.',
      lower: 'Corelare tematică cu specificația Junior Cycle Mathematics (NCCA); ordinea temelor în cei trei ani este stabilită de școală.',
      medium: g === 'TY'
        ? 'Transition Year este un an opțional fără programă națională fixă la matematică; lecțiile pregătesc trecerea spre Leaving Certificate.'
        : 'Corelare tematică cu Leaving Certificate Mathematics (niveluri Higher, Ordinary și Foundation); o specificație revizuită este planificată din septembrie 2027 (proiect în consultare publică între 20 august și 18 noiembrie 2026).'
    },
    'GB-SCT': {
      beginner: 'Corelare tematică cu Curriculum for Excellence (Numeracy and Mathematics) și cu Benchmarks; nivelurile Early, First și Second acoperă câțiva ani fiecare și nu sunt legate strict de o clasă.',
      lower: 'Corelare tematică cu Curriculum for Excellence, nivelurile Third și Fourth (broad general education, S1–S3); ritmul depinde de școală și de elev.',
      medium: 'Corelare tematică cu cursurile SQA: de regulă National 5 în S4, Higher în S5 și Advanced Higher în S6, dar școlile și elevii pot alege alt ritm sau alt curs (de exemplu, National 4 sau Applications of Mathematics).'
    },
    'GB-WLS': {
      beginner: 'Corelare tematică cu Curriculum for Wales, aria Mathematics and Numeracy; progresia este descrisă prin progression steps (aproximativ la 5, 8, 11, 14 și 16 ani), iar fiecare școală își construiește propriul curriculum.',
      lower: 'Corelare tematică cu Curriculum for Wales, aria Mathematics and Numeracy (progression steps 3–4); fiecare școală își construiește propriul curriculum.',
      medium: ['Y10', 'Y11'].includes(g)
        ? 'Corelare tematică cu noul GCSE Mathematics and Numeracy (Double Award) WJEC, predat din septembrie 2025 (primele certificate în noiembrie 2026), cu nivelurile Foundation și Higher.'
        : 'Corelare tematică cu AS/A level Mathematics WJEC (matematică pură și aplicată: statistică și mecanică); ordinea temelor depinde de școală.'
    },
    'GB-NIR': {
      beginner: 'Corelare tematică cu Northern Ireland Curriculum, aria Mathematics and Numeracy (CCEA): Foundation Stage (Year 1–2), Key Stage 1 (Year 3–4) și Key Stage 2 (Year 5–7).',
      lower: 'Corelare tematică cu Northern Ireland Curriculum, Key Stage 3 (Year 8–10): Mathematics with Financial Capability, conținut minim obligatoriu.',
      medium: ['Y11', 'Y12'].includes(g)
        ? 'Corelare tematică cu GCSE Mathematics CCEA (nivelurile Foundation și Higher); ordinea temelor între Year 11 și Year 12 este stabilită de școală.'
        : 'Corelare tematică cu AS (Year 13) și A2 (Year 14) Mathematics CCEA; ordinea temelor depinde de școală.'
    }
  };
  return head + frames[country][stage] + TAIL;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 4 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b4', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
  return Object.freeze({
    id,
    subject: 'math',
    level: stage === 'advanced' ? 'advanced' : stage === 'medium' ? 'intermediate' : 'beginner',
    country,
    stage: CLIENT_STAGE[stage],
    grade: String(grade),
    topic,
    unitTitle: UNIT_TITLES[country][topic] || topic,
    title,
    enTitle,
    statement,
    formula,
    worked,
    practice,
    answers,
    mistake,
    source: sourceFor(country, stage, String(grade)),
    sourceStatus: 'national-framework-aligned',
    curriculumCompletion: 'partial-source-review',
    curriculumFrame: batch4CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch4MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH4_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch4MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH4_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch4MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}

const TEXTBOOK_REF = Object.freeze({
  AT: 'Lehrplan / SRP (BMBWF)', CH: 'Lehrplan 21 · PER · Piano di studio / EDK', BE: 'Référentiels FWB · Onderwijsdoelen Vlaanderen',
  NL: 'SLO kerndoelen · Examenblad', LU: 'Plan d\'études / programmes MENJE', IE: 'NCCA specifications',
  'GB-SCT': 'Curriculum for Excellence / SQA', 'GB-WLS': 'Curriculum for Wales / WJEC', 'GB-NIR': 'NI Curriculum / CCEA'
});

export function batch4PackTextbooks(country, stage, grade) {
  if (!BATCH4_MATH_PLAN[country]?.[stage]?.[String(grade)]) return [];
  const label = TEXTBOOK_REF[country] + ' · ' + gradeLabel(country, stage, grade);
  return [{ id: 'b4-' + country.toLowerCase() + '-' + stage + '-' + String(grade).toLowerCase(), labelRo: label, labelEn: label, url: sourceFor(country, stage, String(grade)) }];
}
