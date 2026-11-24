// Batch 7 of the 50-country Mathematics completion board (2026/27):
// Bosnia and Herzegovina (BA), Montenegro (ME), North Macedonia (MK),
// Serbia (RS), Albania (AL), Kosovo (XK), Ukraine (UA), Belarus (BY) —
// Grade 1 → university.
// The year/topic plan is generated deterministically by
// scripts/generate_math_batch5_8_plans.mjs (math_batch7_plan_2026.mjs) from the
// shared original concept banks.
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).
// Lessons are original explanations, thematically aligned with the frameworks
// cited below; they do NOT reproduce textbooks and do NOT claim certified
// full annual coverage.

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';
import { B58_EXTRA_BANK } from './math_batch5_8_bank_2026.mjs';
import { BATCH7_MATH_PLAN } from './math_batch7_plan_2026.mjs';

export { BATCH7_MATH_PLAN };
export const BATCH7_MATH_COUNTRIES = Object.freeze(['BA', 'ME', 'MK', 'RS', 'AL', 'XK', 'UA', 'BY']);
export const BATCH7_NATIVE_YEARS = Object.freeze([]);

export const BATCH7_MATH_SOURCES = Object.freeze({
  BA: { beginner: 'https://aposo.gov.ba/', lower: 'https://aposo.gov.ba/', medium: 'https://aposo.gov.ba/' },
  ME: { beginner: 'https://zzs.gov.me/', lower: 'https://zzs.gov.me/', medium: 'https://zzs.gov.me/' },
  MK: { beginner: 'https://www.bro.gov.mk/', lower: 'https://www.bro.gov.mk/', medium: 'https://www.bro.gov.mk/' },
  RS: { beginner: 'https://zuov.gov.rs/nastavni-planovi-i-programi/', lower: 'https://zuov.gov.rs/nastavni-planovi-i-programi/', medium: 'https://zuov.gov.rs/nastavni-planovi-i-programi/' },
  AL: { beginner: 'https://www.ascap.edu.al/kurrikula/', lower: 'https://www.ascap.edu.al/kurrikula/', medium: 'https://www.ascap.edu.al/kurrikula/' },
  XK: { beginner: 'https://masht.rks-gov.net/korniza-e-kurrikules/', lower: 'https://masht.rks-gov.net/korniza-e-kurrikules/', medium: 'https://masht.rks-gov.net/korniza-e-kurrikules/' },
  UA: { beginner: 'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi', lower: 'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi', medium: 'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi' },
  BY: { beginner: 'https://adu.by/ru/homepage/obrazovatelnyj-protsess-2024-2025-uchebnyj-god/obshchee-srednee-obrazovanie/uchebnye-programmy.html', lower: 'https://adu.by/ru/homepage/obrazovatelnyj-protsess-2024-2025-uchebnyj-god/obshchee-srednee-obrazovanie/uchebnye-programmy.html', medium: 'https://adu.by/ru/homepage/obrazovatelnyj-protsess-2024-2025-uchebnyj-god/obshchee-srednee-obrazovanie/uchebnye-programmy.html' },
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
  BA: 'mărci convertibile',
  ME: 'euro',
  MK: 'denari macedoneni',
  RS: 'dinari sârbești',
  AL: 'leki albanezi',
  XK: 'euro',
  UA: 'grivne',
  BY: 'ruble belaruse'
});

export const BATCH7_COUNTRY_NAMES = Object.freeze({
  BA: 'Bosnia și Herțegovina',
  ME: 'Muntenegru',
  MK: 'Macedonia de Nord',
  RS: 'Serbia',
  AL: 'Albania',
  XK: 'Kosovo',
  UA: 'Ucraina',
  BY: 'Belarus'
});

const UNIT_TITLES = Object.freeze({
  BA: {
    arithmetic: 'Brojevi i računske operacije', geometry: 'Geometrija', measurement: 'Mjerenje', algebra: 'Algebra',
    statistics: 'Statistika i vjerovatnoća', functions: 'Funkcije', trigonometry: 'Trigonometrija', analysis: 'Matematička analiza',
    'linear-algebra': 'Linearna algebra', discrete: 'Diskretna matematika', differential: 'Diferencijalne jednačine'
  },
  ME: {
    arithmetic: 'Brojevi i računske operacije', geometry: 'Geometrija', measurement: 'Mjerenje', algebra: 'Algebra',
    statistics: 'Statistika i vjerovatnoća', functions: 'Funkcije', trigonometry: 'Trigonometrija', analysis: 'Matematička analiza',
    'linear-algebra': 'Linearna algebra', discrete: 'Diskretna matematika', differential: 'Diferencijalne jednačine'
  },
  MK: {
    arithmetic: 'Броеви и операции', geometry: 'Геометрија', measurement: 'Мерење', algebra: 'Алгебра',
    statistics: 'Статистика и веројатност', functions: 'Функции', trigonometry: 'Тригонометрија', analysis: 'Математичка анализа',
    'linear-algebra': 'Линеарна алгебра', discrete: 'Дискретна математика', differential: 'Диференцијални равенки'
  },
  RS: {
    arithmetic: 'Бројеви и операције', geometry: 'Геометрија', measurement: 'Мерење', algebra: 'Алгебра',
    statistics: 'Статистика и вероватноћа', functions: 'Функције', trigonometry: 'Тригонометрија', analysis: 'Математичка анализа',
    'linear-algebra': 'Линеарна алгебра', discrete: 'Дискретна математика', differential: 'Диференцијалне једначине'
  },
  AL: {
    arithmetic: 'Numrat dhe veprimet', geometry: 'Gjeometria', measurement: 'Matja', algebra: 'Algjebra',
    statistics: 'Statistika dhe probabiliteti', functions: 'Funksionet', trigonometry: 'Trigonometria', analysis: 'Analiza matematike',
    'linear-algebra': 'Algjebra lineare', discrete: 'Matematika diskrete', differential: 'Ekuacionet diferenciale'
  },
  XK: {
    arithmetic: 'Numrat dhe veprimet / Бројеви и операције', geometry: 'Gjeometria / Геометрија', measurement: 'Matjet / Мерење', algebra: 'Algjebra / Алгебра',
    statistics: 'Statistika / Статистика', functions: 'Funksionet / Функције', trigonometry: 'Trigonometria / Тригонометрија', analysis: 'Analiza matematike / Математичка анализа',
    'linear-algebra': 'Algjebra lineare / Линеарна алгебра', discrete: 'Matematika diskrete / Дискретна математика', differential: 'Ekuacionet diferenciale / Диференцијалне једначине'
  },
  UA: {
    arithmetic: 'Числа і дії', geometry: 'Геометрія', measurement: 'Величини та вимірювання', algebra: 'Алгебра',
    statistics: 'Статистика й імовірність', functions: 'Функції', trigonometry: 'Тригонометрія', analysis: 'Початки математичного аналізу',
    'linear-algebra': 'Лінійна алгебра', discrete: 'Дискретна математика', differential: 'Диференціальні рівняння'
  },
  BY: {
    arithmetic: 'Лікі і вылічэнні', geometry: 'Геаметрыя', measurement: 'Велічыні і вымярэнні', algebra: 'Алгебра',
    statistics: 'Статыстыка і імавернасць', functions: 'Функцыі', trigonometry: 'Трыганаметрыя', analysis: 'Пачаткі матэматычнага аналізу',
    'linear-algebra': 'Лінейная алгебра', discrete: 'Дыскрэтная матэматыка', differential: 'Дыферэнцыяльныя раўнанні'
  }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  const n = Number(g);
  if (stage === 'advanced') {
    if (country === 'AL' || country === 'XK') return g === '4' ? 'Master i Shkencave në Matematikë, Viti 1' : 'Bachelor në Matematikë, Viti ' + g;
    if (country === 'MK') return 'Дипломирани студии по математика, ' + g + '. година';
    if (country === 'RS') return 'Основне академске студије математике, ' + g + '. година';
    if (country === 'UA') return 'Бакалаврат з математики, ' + g + ' курс';
    if (country === 'BY') return 'Вышэйшая адукацыя (матэматыка), ' + g + ' курс';
    return g === '4' ? 'Master studij matematike, 1. godina' : 'Dodiplomski studij matematike, ' + g + '. godina';
  }
  if (country === 'BA') return g.startsWith('S') ? g.slice(1) + '. razred srednje škole / gimnazije' : g + '. razred devetogodišnje osnovne škole';
  if (country === 'ME') return stage === 'medium' ? (n - 9) + '. razred gimnazije' : g + '. razred osnovne škole';
  if (country === 'MK') return stage === 'medium' ? (n - 9) + '. година гимназиско образование' : g + '. одделение (основно образование)';
  if (country === 'RS') return g.startsWith('G') ? g.slice(1) + '. разред гимназије' : g + '. разред основне школе';
  if (country === 'AL') return 'Klasa ' + g + (stage === 'medium' ? ' (Gjimnaz)' : ' (Arsimi bazë)');
  if (country === 'XK') return 'Klasa ' + g + ' / ' + g + '. разред';
  if (country === 'UA') return g + ' клас';
  return g + ' клас (сярэдняя школа)';
}

function sourceFor(country, stage) {
  if (stage === 'advanced') return BATCH7_MATH_SOURCES.university;
  return BATCH7_MATH_SOURCES[country][stage];
}

const TAIL = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';

export function batch7CurriculumFrame(country, stage, grade) {
  const g = String(grade);
  const head = BATCH7_COUNTRY_NAMES[country] + ', ' + gradeLabel(country, stage, g) + '. ';
  if (stage === 'advanced') {
    const note = country === 'BY'
      ? 'Sinteză universitară pe 4 ani de licență/specialist în matematică; programele detaliate sunt stabilite de universități și Ministerul Educației.'
      : country === 'XK'
        ? 'Sinteză universitară organizată pe ciclurile Bologna (Bachelor 3 ani + Master); fișele disciplinelor diferă între universități.'
        : 'Sinteză universitară raportată la ciclurile Bologna (EHEA); durata licenței (3 sau 4 ani) și fișele disciplinelor diferă între universități.';
    return head + note + TAIL;
  }
  const frames = {
    BA: {
      beginner: 'Corelare tematică cu Zajednička jezgra nastavnih planova i programa za matematiku (APOSO, razredi 1–5); programele detaliate diferă între entități (FBiH, RS), cantoane și Districtul Brčko.',
      lower: 'Corelare tematică cu Zajednička jezgra nastavnih planova i programa (APOSO, razredi 6–9 devetogodišnje osnovne škole); ordinea exactă a temelor diferă pe cantoane și entități.',
      medium: 'Corelare tematică cu nucleul comun APOSO pentru gimnazija (S1–S4); planurile de învățământ diferă între entități, cantoane și profilul gimnaziului.'
    },
    ME: {
      beginner: 'Corelare tematică cu Predmetni program Matematika pentru ciclurile I–II ale osnovna škola (razredi 1–5, ZZŠ Crne Gore).',
      lower: 'Corelare tematică cu Predmetni program Matematika pentru razredi 6–9 osnovne škole (ZZŠ) și verificarea externă la finalul clasei a 9-a.',
      medium: 'Corelare tematică cu Predmetni program Matematika pentru opšta gimnazija (razredi I–IV, ZZŠ) și examenul Maturski ispit.'
    },
    MK: {
      beginner: 'Corelare tematică cu Наставните програми по математика pentru одделенска настава (I–V одделение, Концепција за основно образование, БРО).',
      lower: 'Corelare tematică cu Наставните програми по математика pentru предметна настава (VI–IX одделение, БРО).',
      medium: 'Corelare tematică cu Наставните програми по математика pentru гимназиско образование (I–IV година, БРО) și Државна матура.'
    },
    RS: {
      beginner: 'Corelare tematică cu Програм наставе и учења математике pentru primul ciclu osnovna škola (1.–4. разред, ЗУОВ).',
      lower: 'Corelare tematică cu Програм наставе и учења математике pentru al doilea ciclu osnovna škola (5.–8. разред, ЗУОВ) și završni ispit.',
      medium: 'Corelare tematică cu Програм наставе и учења математике pentru гимназија (1.–4. разред, општи и природно-математички смер, ЗУОВ).'
    },
    AL: {
      beginner: 'Corelare tematică cu Programet lëndore të Matematikës în arsimi fillor (klasat 1–5, ASCAP / MAS).',
      lower: 'Corelare tematică cu Programet lëndore të Matematikës în arsimi i mesëm i ulët (klasat 6–9, ASCAP) și examenul PKAB.',
      medium: 'Corelare tematică cu Programet lëndore të Matematikës pentru gjimnaz (klasat 10–12, ASCAP) și Matura Shtetërore (bërthamë și me zgjedhje).'
    },
    XK: {
      beginner: 'Corelare tematică cu Korniza e Kurrikulës e Kosovës și Kurrikula Bërthamë pentru arsimi fillor (klasat 1–5, MASHTI).',
      lower: 'Corelare tematică cu Kurrikula Bërthamë pentru arsimi i mesëm i ulët (klasat 6–9, MASHTI) și Testi i Arritshmërisë.',
      medium: 'Corelare tematică cu Kurrikula Bërthamë pentru gjimnaz (klasat 10–12, MASHTI) și Provimi i Maturës Shtetërore.'
    },
    UA: {
      beginner: 'Corelare tematică cu Типові освітні програми НУШ (Нова українська школа, 1–4 класи, МОН України).',
      lower: 'Corelare tematică cu модельні навчальні програми НУШ з математики (5–6 класи) și алгебри та геометрії (7–9 класи, МОН України; în 2026/27 reforma НУШ ajunge la clasa a 9-a).',
      medium: g === '12'
        ? 'Notă 2026/27: în anul școlar 2026/27 clasa a 12-a funcționează în regim pilot pentru liceul academic de 3 ani НУШ (Профільна середня освіта), înainte de implementarea națională generală din 1 septembrie 2027.'
        : 'Corelare tematică cu програмите з математики (алгебра і початки аналізу та геометрія, рівень стандарту / профільний рівень, 10–11 класи, МОН України) și reperele НМТ.'
    },
    BY: {
      beginner: 'Corelare tematică cu вучэбныя праграмы па матэматыцы pentru I–IV класы (Нацыянальны інстытут адукацыі / adu.by).',
      lower: 'Corelare tematică cu вучэбныя праграмы па матэматыцы (V–VI класы) și алгебры і геаметрыі (VII–IX класы, НІА / adu.by).',
      medium: 'Corelare tematică cu вучэбныя праграмы па матэматыцы pentru X–XI класы (базавы і павышаны ўзроўні, НІА / ЦЭ).'
    }
  };
  return head + frames[country][stage] + TAIL;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 7 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b7', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    curriculumFrame: batch7CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch7MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH7_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch7MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH7_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch7MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}
