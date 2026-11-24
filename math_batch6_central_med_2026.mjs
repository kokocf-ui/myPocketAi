// Batch 6 of the 50-country Mathematics completion board (2026/27):
// Czechia (CZ), Slovakia (SK), Slovenia (SI), Croatia (HR), Bulgaria (BG),
// Greece (GR), Cyprus (CY), Malta (MT) — Grade 1 → university.
// The year/topic plan is generated deterministically by
// scripts/generate_math_batch5_8_plans.mjs (math_batch6_plan_2026.mjs) from the
// shared original concept banks.
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).
// Lessons are original explanations, thematically aligned with the national
// frameworks cited below; they do NOT reproduce textbooks and do NOT claim
// certified full annual coverage.

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';
import { B58_EXTRA_BANK } from './math_batch5_8_bank_2026.mjs';
import { BATCH6_MATH_PLAN } from './math_batch6_plan_2026.mjs';

export { BATCH6_MATH_PLAN };
export const BATCH6_MATH_COUNTRIES = Object.freeze(['CZ', 'SK', 'SI', 'HR', 'BG', 'GR', 'CY', 'MT']);
export const BATCH6_NATIVE_YEARS = Object.freeze([]);

export const BATCH6_MATH_SOURCES = Object.freeze({
  CZ: { beginner: 'https://www.npi.cz/rvp', lower: 'https://www.npi.cz/rvp', medium: 'https://www.npi.cz/rvp' },
  SK: { beginner: 'https://www.statpedu.sk/sk/svp/', lower: 'https://www.statpedu.sk/sk/svp/', medium: 'https://www.statpedu.sk/sk/svp/' },
  SI: { beginner: 'https://www.gov.si/teme/programi-in-ucni-nacrti-v-osnovni-soli/', lower: 'https://www.gov.si/teme/programi-in-ucni-nacrti-v-osnovni-soli/', medium: 'https://www.zrss.si/ucni-nacrti/gimnazija/' },
  HR: { beginner: 'https://mzom.gov.hr/istaknute-teme/odgoj-i-obrazovanje/nacionalni-kurikulum/predmetni-kurikulumi/matematika/3671', lower: 'https://mzom.gov.hr/istaknute-teme/odgoj-i-obrazovanje/nacionalni-kurikulum/predmetni-kurikulumi/matematika/3671', medium: 'https://mzom.gov.hr/istaknute-teme/odgoj-i-obrazovanje/nacionalni-kurikulum/predmetni-kurikulumi/matematika/3671' },
  BG: { beginner: 'https://www.mon.bg/obshto-obrazovanie/uchebni-programi/', lower: 'https://www.mon.bg/obshto-obrazovanie/uchebni-programi/', medium: 'https://www.mon.bg/obshto-obrazovanie/uchebni-programi/' },
  GR: { beginner: 'https://iep.edu.gr/el/analytika-programmata-spoudon-aps', lower: 'https://iep.edu.gr/el/analytika-programmata-spoudon-aps', medium: 'https://iep.edu.gr/el/analytika-programmata-spoudon-aps' },
  CY: { beginner: 'https://www.moec.gov.cy/analytika_programmata/', lower: 'https://www.moec.gov.cy/analytika_programmata/', medium: 'https://www.moec.gov.cy/analytika_programmata/' },
  MT: { beginner: 'https://curriculum.gov.mt/', lower: 'https://curriculum.gov.mt/', medium: 'https://www.um.edu.mt/matsec/' },
  university: 'https://ehea.info/'
});

const CONCEPTS = Object.freeze({
  ...B2_PRIMARY_BANK,
  ...B2_LOWER_BANK,
  ...B2_UPPER_BANK,
  ...B2_UNIVERSITY_BANK,
  ...B3_EXTRA_BANK,
  ...B58_EXTRA_BANK
});

const CURRENCY = Object.freeze({
  CZ: 'coroane cehe',
  SK: 'euro',
  SI: 'euro',
  HR: 'euro',
  BG: 'euro',
  GR: 'euro',
  CY: 'euro',
  MT: 'euro'
});

export const BATCH6_COUNTRY_NAMES = Object.freeze({
  CZ: 'Cehia',
  SK: 'Slovacia',
  SI: 'Slovenia',
  HR: 'Croația',
  BG: 'Bulgaria',
  GR: 'Grecia',
  CY: 'Cipru',
  MT: 'Malta'
});

const UNIT_TITLES = Object.freeze({
  CZ: {
    arithmetic: 'Číslo a početní operace', geometry: 'Geometrie v rovině a prostoru', measurement: 'Závislosti a měření', algebra: 'Číslo a proměnná',
    statistics: 'Práce s daty, kombinatorika a pravděpodobnost', functions: 'Závislosti, vztahy a funkce', trigonometry: 'Goniometrie a trigonometrie', analysis: 'Diferenciální a integrální počet',
    'linear-algebra': 'Lineární algebra', discrete: 'Diskrétní matematika', differential: 'Diferenciální rovnice'
  },
  SK: {
    arithmetic: 'Čísla, premenná a počtové výkony', geometry: 'Geometria a meranie', measurement: 'Meranie a jednotky', algebra: 'Premenné, výrazy a rovnice',
    statistics: 'Kombinatorika, pravdepodobnosť a štatistika', functions: 'Vzťahy, funkcie, tabuľky, diagramy', trigonometry: 'Goniometria a trigonometria', analysis: 'Matematická analýza',
    'linear-algebra': 'Lineárna algebra', discrete: 'Diskrétna matematika', differential: 'Diferenciálne rovnice'
  },
  SI: {
    arithmetic: 'Števila in računske operacije', geometry: 'Geometrija', measurement: 'Merjenje', algebra: 'Algebra in izrazi',
    statistics: 'Podatki, statistika in verjetnost', functions: 'Funkcije', trigonometry: 'Kotne funkcije in trigonometrija', analysis: 'Odvod in integral',
    'linear-algebra': 'Linearna algebra', discrete: 'Diskretna matematika', differential: 'Diferencialne enačbe'
  },
  HR: {
    arithmetic: 'Brojevi', geometry: 'Oblik i prostor', measurement: 'Mjerenje', algebra: 'Algebra i funkcije',
    statistics: 'Podatci, statistika i vjerojatnost', functions: 'Funkcije i modeli', trigonometry: 'Trigonometrija', analysis: 'Diferencijalni i integralni račun',
    'linear-algebra': 'Linearna algebra', discrete: 'Diskretna matematika', differential: 'Diferencijalne jednadžbe'
  },
  BG: {
    arithmetic: 'Числа и действия', geometry: 'Геометрични фигури и тела', measurement: 'Измерване', algebra: 'Алгебра',
    statistics: 'Статистика и вероятности', functions: 'Функции и моделиране', trigonometry: 'Тригонометрия', analysis: 'Математически анализ',
    'linear-algebra': 'Линейна алгебра', discrete: 'Дискретна математика', differential: 'Диференциални уравнения'
  },
  GR: {
    arithmetic: 'Αριθμοί και πράξεις', geometry: 'Γεωμετρία', measurement: 'Μετρήσεις', algebra: 'Άλγεβρα',
    statistics: 'Στατιστική και πιθανότητες', functions: 'Συναρτήσεις', trigonometry: 'Τριγωνομετρία', analysis: 'Μαθηματική ανάλυση',
    'linear-algebra': 'Γραμμική άλγεβρα', discrete: 'Διακριτά μαθηματικά', differential: 'Διαφορικές εξισώσεις'
  },
  CY: {
    arithmetic: 'Αριθμοί και πράξεις', geometry: 'Γεωμετρία', measurement: 'Μετρήσεις', algebra: 'Άλγεβρα',
    statistics: 'Στατιστική και πιθανότητες', functions: 'Συναρτήσεις', trigonometry: 'Τριγωνομετρία', analysis: 'Μαθηματική ανάλυση',
    'linear-algebra': 'Γραμμική άλγεβρα', discrete: 'Διακριτά μαθηματικά', differential: 'Διαφορικές εξισώσεις'
  },
  MT: {
    arithmetic: 'Number and operations', geometry: 'Geometry and space', measurement: 'Measures', algebra: 'Algebra',
    statistics: 'Statistics and probability', functions: 'Functions and graphs', trigonometry: 'Trigonometry', analysis: 'Calculus',
    'linear-algebra': 'Linear algebra', discrete: 'Discrete mathematics', differential: 'Differential equations'
  }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  const n = Number(g);
  if (stage === 'advanced') {
    if (country === 'GR' || country === 'CY') return 'Πτυχίο Μαθηματικών, Έτος ' + g;
    if (country === 'MT') return g === '4' ? 'BSc (Hons) / MSc Mathematics, Year 4' : 'BSc (Hons) Mathematics, Year ' + g;
    const master = n === 4;
    if (country === 'CZ') return master ? 'Navazující magisterské studium matematiky, 1. ročník' : 'Bakalářské studium matematiky, ' + g + '. ročník';
    if (country === 'SK') return master ? 'Magisterské štúdium matematiky, 1. ročník' : 'Bakalárske štúdium matematiky, ' + g + '. ročník';
    if (country === 'SI') return master ? 'Magistrski študij matematike, 1. letnik' : 'Univerzitetni študij matematike (1. stopnja), ' + g + '. letnik';
    if (country === 'HR') return master ? 'Diplomski studij matematike, 1. godina' : 'Sveučilišni prijediplomski studij matematike, ' + g + '. godina';
    return 'Бакалавър по математика, ' + g + '. курс';
  }
  if (country === 'CZ') return stage === 'medium' ? (n - 9) + '. ročník gymnázia / SŠ (' + g + '. ročník)' : g + '. ročník ZŠ';
  if (country === 'SK') return stage === 'medium' ? (n - 9) + '. ročník gymnázia / SŠ' : g + '. ročník ZŠ';
  if (country === 'SI') return stage === 'medium' ? (n - 9) + '. letnik gimnazije' : g + '. razred osnovne šole';
  if (country === 'HR') return g.startsWith('G') ? g.slice(1) + '. razred gimnazije' : g + '. razred osnovne škole';
  if (country === 'BG') return g + '. клас';
  if (country === 'GR') {
    if (stage === 'beginner') return g + 'η Δημοτικού';
    if (g.startsWith('G')) return g.slice(1) + 'η Γυμνασίου';
    return g.slice(1) + 'η Λυκείου';
  }
  if (country === 'CY') {
    if (stage === 'beginner') return g + 'η Δημοτικού';
    if (stage === 'lower') return (n - 6) + 'η Γυμνασίου';
    return (n - 9) + 'η Λυκείου';
  }
  if (stage === 'beginner') return 'Primary Year ' + g;
  if (stage === 'lower') return 'Secondary Year ' + g + ' (Middle / Secondary)';
  return 'Sixth Form Year ' + g + ' (MATSEC)';
}

function sourceFor(country, stage) {
  if (stage === 'advanced') return BATCH6_MATH_SOURCES.university;
  return BATCH6_MATH_SOURCES[country][stage];
}

const TAIL = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';

export function batch6CurriculumFrame(country, stage, grade) {
  const g = String(grade);
  const head = BATCH6_COUNTRY_NAMES[country] + ', ' + gradeLabel(country, stage, g) + '. ';
  if (stage === 'advanced') {
    const length = ['GR', 'CY', 'BG'].includes(country)
      ? 'licența universitară durează de regulă 4 ani'
      : 'licența (Bachelor) durează de regulă 3 ani, iar anul 4 corespunde primului an de master (sau anului final de onoruri)';
    return head + 'Sinteză universitară raportată la ciclurile Bologna (EHEA); ' + length + ', iar fișele disciplinelor diferă între universități.' + TAIL;
  }
  const frames = {
    CZ: {
      beginner: 'Corelare tematică cu RVP ZV — Matematika a její aplikace (1. stupeň ZŠ, MŠMT/NPI); fiecare școală își distribuie temele pe ani prin propriul ŠVP, iar revizuirea RVP ZV se introduce treptat.',
      lower: 'Corelare tematică cu RVP ZV — Matematika a její aplikace (2. stupeň ZŠ / nižší gymnázium, MŠMT/NPI) și reperele admiterii unitare JPZ.',
      medium: 'Corelare tematică cu RVP G (gymnázium, MŠMT/NPI) și catalogul cerințelor examenului comun de maturitate (CERMAT).'
    },
    SK: {
      beginner: 'Corelare tematică cu Štátny vzdelávací program (ŠVP, Matematika a práca s informáciami, NIVaM/MŠVVaM); reforma curriculară pe 3 cicluri se extinde etapizat și devine generală la nivel național din 2026/27.',
      lower: 'Corelare tematică cu ŠVP pre nižšie stredné vzdelávanie (ročníky 5–9, NIVaM) și reperele evaluării naționale Testovanie 9.',
      medium: 'Corelare tematică cu ŠVP pre gymnáziá (ročníky 1–4, NIVaM) și obiectivele examenului Maturita z matematiky.'
    },
    SI: {
      beginner: 'Corelare tematică cu Učni načrt Matematika pentru osnovna šola (1. in 2. vzgojno-izobraževalno obdobje, razredi 1–6, MVI/ZRSŠ).',
      lower: 'Corelare tematică cu Učni načrt Matematika pentru 3. obdobje osnovne šole (razredi 7–9, MVI/ZRSŠ) și verificarea națională NPZ.',
      medium: 'Corelare tematică cu Učni načrt Matematika pentru gimnazija (letniki 1–4, ZRSŠ) și catalogul pentru Splošna matura (osnovna / višja raven).'
    },
    HR: {
      beginner: 'Corelare tematică cu Kurikulum nastavnog predmeta Matematika (razredi 1–4 osnovne škole, MZOM).',
      lower: 'Corelare tematică cu Kurikulum nastavnog predmeta Matematika (razredi 5–8 osnovne škole, MZOM).',
      medium: 'Corelare tematică cu Kurikulum nastavnog predmeta Matematika pentru gimnazije (G1–G4, MZOM) și reperele Državna matura (nivelurile B și A, NCVVO).'
    },
    BG: {
      beginner: 'Corelare tematică cu учебните програми по математика (1.–4. клас, МОН) și НВО след 4. клас.',
      lower: 'Corelare tematică cu учебните програми по математика за прогимназиален етап (5.–7. клас, МОН) și НВО след 7. клас.',
      medium: 'Corelare tematică cu учебните програми по математика за първи (8.–10. клас, ООП) și втори гимназиален етап (11.–12. клас, ООП și профилирана подготовка за ДЗИ, МОН).'
    },
    GR: {
      beginner: 'Corelare tematică cu Αναλυτικά Προγράμματα Σπουδών Μαθηματικών Δημοτικού (Α΄–ΣΤ΄ Δημοτικού, ΙΕΠ / ΥΠΑΙΘΑ).',
      lower: 'Corelare tematică cu Αναλυτικά Προγράμματα Σπουδών Μαθηματικών Γυμνασίου (Α΄–Γ΄ Γυμνασίου, ΙΕΠ).',
      medium: 'Corelare tematică cu Αναλυτικά Προγράμματα Σπουδών Γενικού Λυκείου (Άλγεβρα, Γεωμετρία și Μαθηματικά Προσανατολισμού, ΙΕΠ).'
    },
    CY: {
      beginner: 'Corelare tematică cu Αναλυτικά Προγράμματα Μαθηματικών Δημοτικής Εκπαίδευσης (Α΄–ΣΤ΄ Δημοτικού, ΥΠΑΝ Κύπρου).',
      lower: 'Corelare tematică cu Αναλυτικά Προγράμματα Μαθηματικών Γυμνασίου (Α΄–Γ΄ Γυμνασίου, ΥΠΑΝ Κύπρου).',
      medium: 'Corelare tematică cu Αναλυτικά Προγράμματα Λυκείου — Μαθηματικά Κοινού Κορμού și Κατεύθυνσης (Α΄–Γ΄ Λυκείου / Παγκύπριες Εξετάσεις, ΥΠΑΝ).'
    },
    MT: {
      beginner: 'Corelare tematică cu National Curriculum Framework și Learning Outcomes Framework — Primary Mathematics Years 1–6 (MEYR).',
      lower: 'Corelare tematică cu Learning Outcomes Framework (Middle/Secondary Years 7–11) și SEC Mathematics syllabus (MATSEC).',
      medium: 'Corelare tematică cu programele post-secundare Sixth Form (Years 12–13) pentru MATSEC Intermediate și Advanced Pure Mathematics.'
    }
  };
  return head + frames[country][stage] + TAIL;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 6 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b6', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    source: sourceFor(country, stage),
    sourceStatus: 'national-framework-aligned',
    curriculumCompletion: 'partial-source-review',
    curriculumFrame: batch6CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch6MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH6_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch6MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH6_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch6MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}
