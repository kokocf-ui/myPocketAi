// Batch 8 (final batch) of the 50-country Mathematics completion board (2026/27):
// Türkiye (TR), Russia (RU), Andorra (AD), Liechtenstein (LI), Monaco (MC),
// San Marino (SM), and Vatican City (VA) — completing 50 / 50 European systems.
// Vatican City (VA) preserves its honest external-school selector for
// beginner/lower/medium ('external-curriculum' — students attend Italian or
// international schools in Rome; no Vatican K-12 syllabus is invented) and
// serves decoupled university packs for advanced (univ-1..univ-4).
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';
import { B58_EXTRA_BANK } from './math_batch5_8_bank_2026.mjs';
import { BATCH8_MATH_PLAN } from './math_batch8_plan_2026.mjs';

export { BATCH8_MATH_PLAN };
export const BATCH8_MATH_COUNTRIES = Object.freeze(['TR', 'RU', 'AD', 'LI', 'MC', 'SM', 'VA']);
export const BATCH8_NATIVE_YEARS = Object.freeze([
  'VA:beginner:external-curriculum',
  'VA:lower:external-curriculum',
  'VA:medium:external-curriculum'
]);

export const BATCH8_MATH_SOURCES = Object.freeze({
  TR: { beginner: 'https://mufredat.meb.gov.tr/', lower: 'https://mufredat.meb.gov.tr/', medium: 'https://tymm.meb.gov.tr/' },
  RU: { beginner: 'https://edsoo.ru/normativnye-dokumenty/', lower: 'https://edsoo.ru/normativnye-dokumenty/', medium: 'https://edsoo.ru/normativnye-dokumenty/' },
  AD: { beginner: 'https://www.educacio.ad/sistemes-educatius/escola-andorrana', lower: 'https://www.educacio.ad/sistemes-educatius/escola-andorrana', medium: 'https://www.educacio.ad/sistemes-educatius/escola-andorrana' },
  LI: { beginner: 'https://fl.lehrplan.ch/', lower: 'https://fl.lehrplan.ch/', medium: 'https://www.llv.li/de/landesverwaltung/schulamt' },
  MC: { beginner: 'https://monservicepublic.gouv.mc/themes/education', lower: 'https://monservicepublic.gouv.mc/themes/education', medium: 'https://monservicepublic.gouv.mc/themes/education' },
  SM: { beginner: 'https://www.istruzioneecultura.sm/', lower: 'https://www.istruzioneecultura.sm/', medium: 'https://www.istruzioneecultura.sm/' },
  VA: { advanced: 'https://www.educatio.va/' },
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
  TR: 'lire turcești',
  RU: 'ruble',
  AD: 'euro',
  LI: 'franci elvețieni',
  MC: 'euro',
  SM: 'euro',
  VA: 'euro'
});

export const BATCH8_COUNTRY_NAMES = Object.freeze({
  TR: 'Turcia',
  RU: 'Rusia',
  AD: 'Andorra',
  LI: 'Liechtenstein',
  MC: 'Monaco',
  SM: 'San Marino',
  VA: 'Cetatea Vaticanului'
});

const UNIT_TITLES = Object.freeze({
  TR: {
    arithmetic: 'Sayılar ve işlemler', geometry: 'Geometri', measurement: 'Ölçme', algebra: 'Cebir / Nicelikler ve değişimler',
    statistics: 'İstatistiksel araştırma ve olasılık', functions: 'Fonksiyonlar ve değişim', trigonometry: 'Trigonometri', analysis: 'Türev ve integral (Analiz)',
    'linear-algebra': 'Lineer cebir', discrete: 'Ayrık matematik', differential: 'Diferansiyel denklemler'
  },
  RU: {
    arithmetic: 'Числа и вычисления', geometry: 'Геометрия', measurement: 'Величины и измерения', algebra: 'Алгебра',
    statistics: 'Вероятность и статистика', functions: 'Функции', trigonometry: 'Тригонометрия', analysis: 'Начала математического анализа',
    'linear-algebra': 'Линейная алгебра', discrete: 'Дискретная математика', differential: 'Дифференциальные уравнения'
  },
  AD: {
    arithmetic: 'Nombres i càlcul', geometry: 'Espai i forma (Geometria)', measurement: 'Mesura', algebra: 'Àlgebra i relacions',
    statistics: 'Estadística i atzar', functions: 'Funcions', trigonometry: 'Trigonometria', analysis: 'Anàlisi matemàtica',
    'linear-algebra': 'Àlgebra lineal', discrete: 'Matemàtica discreta', differential: 'Equacions diferencials'
  },
  LI: {
    arithmetic: 'Zahl und Variable (Rechnen)', geometry: 'Form und Raum', measurement: 'Grössen, Funktionen, Daten (Messen)', algebra: 'Zahl und Variable (Algebra)',
    statistics: 'Daten und Zufall', functions: 'Funktionale Zusammenhänge', trigonometry: 'Trigonometrie', analysis: 'Analysis',
    'linear-algebra': 'Lineare Algebra', discrete: 'Diskrete Mathematik', differential: 'Differentialgleichungen'
  },
  MC: {
    arithmetic: 'Nombres et calculs', geometry: 'Espace et géométrie', measurement: 'Grandeurs et mesures', algebra: 'Calcul littéral et algèbre',
    statistics: 'Statistiques et probabilités', functions: 'Fonctions', trigonometry: 'Trigonométrie', analysis: 'Analyse',
    'linear-algebra': 'Algèbre linéaire', discrete: 'Mathématiques discrètes', differential: 'Équations différentielles'
  },
  SM: {
    arithmetic: 'Numeri e operazioni', geometry: 'Spazio e figure (Geometria)', measurement: 'Grandezze e misure', algebra: 'Algebra',
    statistics: 'Dati, statistica e probabilità', functions: 'Relazioni e funzioni', trigonometry: 'Goniometria e trigonometria', analysis: 'Analisi matematica',
    'linear-algebra': 'Algebra lineare', discrete: 'Matematica discreta', differential: 'Equazioni differenziali'
  },
  VA: {
    analysis: 'Analisi matematica', 'linear-algebra': 'Algebra lineare', statistics: 'Probabilità e statistica',
    discrete: 'Matematica discreta', differential: 'Equazioni differenziali'
  }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

const MC_LABELS = Object.freeze({
  CP: 'CP (Cours préparatoire)',
  CE1: 'CE1 (Cours élémentaire 1)',
  CE2: 'CE2 (Cours élémentaire 2)',
  CM1: 'CM1 (Cours moyen 1)',
  CM2: 'CM2 (Cours moyen 2)',
  '6e': 'Classe de 6e (Collège)',
  '5e': 'Classe de 5e (Collège)',
  '4e': 'Classe de 4e (Collège)',
  '3e': 'Classe de 3e (Collège)',
  '2nde': 'Classe de Seconde (Lycée)',
  '1re': 'Classe de Première (Lycée)',
  terminale: 'Classe de Terminale (Lycée)'
});

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  const n = Number(g);
  if (stage === 'advanced') {
    if (country === 'TR') return 'Matematik Lisans Programı, ' + g + '. Sınıf';
    if (country === 'RU') return 'Бакалавриат по математике, ' + g + ' курс';
    if (country === 'AD') return g === '4' ? 'Màster / Postgrau científic, any 1' : 'Bàtxelor científic, any ' + g;
    if (country === 'LI') return g === '4' ? 'Masterstudium Mathematik (EHEA), 1. Jahr' : 'Bachelorstudium Mathematik (EHEA), ' + g + '. Jahr';
    if (country === 'MC') return g === '4' ? 'Master 1 Mathématiques (enseignement supérieur partenaire)' : 'Licence de Mathématiques, L' + g;
    if (country === 'SM') return g === '4' ? 'Laurea Magistrale (1º anno, area matematica)' : 'Laurea Triennale (area matematica), ' + g + 'º anno';
    return g === '4' ? ' Secondo ciclo / Licenza accademica (EHEA – Santa Sede), 1º anno' : 'Primo ciclo accademico (EHEA – Santa Sede), ' + g + 'º anno';
  }
  if (country === 'TR') return g + '. Sınıf (' + (stage === 'beginner' ? 'İlkokul' : stage === 'lower' ? 'Ortaokul' : 'Lise') + ')';
  if (country === 'RU') return g + ' класс';
  if (country === 'AD') {
    if (stage === 'beginner') return g + 'r/n/t curs de primera ensenyança (Escola Andorrana, curs ' + g + ')';
    if (g.startsWith('S')) return g.slice(1) + 'a/na ensenyança de segona ensenyança (' + g + ')';
    return g.slice(1) + 'r/n curs de batxillerat (' + g + ')';
  }
  if (country === 'LI') {
    if (stage === 'beginner') return g + '. Klasse Primarschule';
    if (stage === 'lower') return g + '. Schulstufe (Sekundarstufe I: Oberschule / Realschule / Unterstufe Gymnasium)';
    return 'Oberstufe Liechtensteinisches Gymnasium, ' + g.slice(1) + '. Jahr (' + g + ')';
  }
  if (country === 'MC') return MC_LABELS[g] || g;
  return stage === 'beginner' ? g + 'ª classe Scuola Elementare' : stage === 'lower' ? (n - 5) + 'ª classe Scuola Media (' + g + 'º anno)' : (n - 8) + 'º anno Scuola Secondaria Superiore (' + g + 'º anno)';
}

function sourceFor(country, stage) {
  if (stage === 'advanced') return country === 'VA' ? BATCH8_MATH_SOURCES.VA.advanced : BATCH8_MATH_SOURCES.university;
  return BATCH8_MATH_SOURCES[country][stage];
}

const TAIL = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';

export function batch8CurriculumFrame(country, stage, grade) {
  const g = String(grade);
  const head = BATCH8_COUNTRY_NAMES[country] + ', ' + gradeLabel(country, stage, g).trim() + '. ';
  if (stage === 'advanced') {
    if (country === 'VA') {
      return head + 'Notă: Sfântul Scaun participă la Spațiul European al Învățământului Superior (Bologna / AVEPRO), însă universitățile pontificale se concentrează pe teologie, filosofie, drept canonic și științe umaniste; această sinteză oferă trunchiul universitar standard de matematică (EHEA) fără a pretinde o licență pontificală dedicată în matematică pură.' + TAIL;
    }
    if (country === 'MC' || country === 'LI' || country === 'AD') {
      return head + 'Sinteză universitară raportată la ciclurile Bologna (EHEA); studiile complete de matematică pură se urmează de regulă în universități partenere din țările vecine.' + TAIL;
    }
    const length = ['TR', 'RU'].includes(country)
      ? 'licența (Lisans / Бакалавриат) durează de regulă 4 ani'
      : 'licența (Laurea Triennale) durează de regulă 3 ani, iar anul 4 corespunde primului an de Laurea Magistrale';
    return head + 'Sinteză universitară raportată la structura universitară națională și EHEA; ' + length + ', iar fișele disciplinelor diferă între universități.' + TAIL;
  }
  const frames = {
    TR: {
      beginner: g === '4'
        ? 'Notă de cohortă 2026/27: noul Türkiye Yüzyılı Maarif Modeli (TYMM, MEB TTKB) se aplică în 2026/27 la clasele 1–3, în timp ce clasa a 4-a urmează încă programa MEB 2018 până în 2027/28.'
        : 'Corelare tematică cu Türkiye Yüzyılı Maarif Modeli İlkokul Matematik Dersi Öğretim Programı (MEB TTKB, aplicat la clasele 1–3 în 2026/27).',
      lower: g === '8'
        ? 'Notă de cohortă 2026/27: TYMM se aplică la clasele 5–7 în 2026/27, iar clasa a 8-a (pregătire LGS) urmează încă programa MEB 2018 până în 2027/28.'
        : 'Corelare tematică cu Türkiye Yüzyılı Maarif Modeli Ortaokul Matematik Dersi Öğretim Programı (MEB TTKB, aplicat la clasele 5–7 în 2026/27).',
      medium: g === '12'
        ? 'Notă de cohortă 2026/27: TYMM se aplică la clasele 9–11 în 2026/27, iar clasa a 12-a (pregătire YKS/AYT) urmează încă programa MEB 2018 până în 2027/28.'
        : 'Corelare tematică cu Türkiye Yüzyılı Maarif Modeli Ortaöğretim Matematik Dersi Öğretim Programı (MEB TTKB, aplicat la clasele 9–11 în 2026/27).'
    },
    RU: {
      beginner: 'Corelare tematică cu ФГОС НОО și Федеральная рабочая программа по математике (1–4 классы, ЕДСОО / Минпросвещения).',
      lower: 'Corelare tematică cu ФГОС ООО și Федеральные рабочие программы: Математика (5–6 кл.), Алгебра, Геометрия și Вероятность и статистика (7–9 кл., ОГЭ).',
      medium: 'Corelare tematică cu ФГОС СОО și Федеральные рабочие программы (Алгебра и начала математического анализа, Геометрия, Вероятность и статистика, базовый и углублённый уровни, 10–11 кл., ЕГЭ).'
    },
    AD: {
      beginner: 'Corelare tematică cu programa pe competențe a Escola Andorrana de primera ensenyança (Ministeri de Relacions Institucionals, Educació i Universitats); în Andorra funcționează în paralel și sistemele școlare spaniol și francez.',
      lower: 'Corelare tematică cu programa Escola Andorrana de segona ensenyança (S1–S4); școlile din sistemele spaniol și francez din Principat urmează programele statelor respective.',
      medium: 'Corelare tematică cu programa de Batxillerat a Escola Andorrana (B1–B2, modalitatea științifică-tehnologică) și proba oficială POB.'
    },
    LI: {
      beginner: 'Corelare tematică cu Liechtensteiner Lehrplan (LiLe, aliniat la Lehrplan 21 elvețian, Zyklus 1–2, Schulamt Fürstentum Liechtenstein).',
      lower: 'Corelare tematică cu Liechtensteiner Lehrplan (LiLe, Zyklus 3, Sekundarstufe I); nivelul de aprofundare diferă între Oberschule, Realschule și Unterstufe a Liechtensteinisches Gymnasium.',
      medium: 'Corelare tematică cu Lehrplan-ul Oberstufe al Liechtensteinisches Gymnasium (O1–O4) și cerințele examenului Matura recunoscut bilateral cu Elveția.'
    },
    MC: {
      beginner: 'Corelare tematică cu programele folosite în Principatul Monaco (DENJS), aliniate prin convenția bilaterală franco-monegască la programele naționale franceze (Cycles 2–3: CP–CM2, inclusiv revizuirea Cycle 2/3).',
      lower: 'Corelare tematică cu programele collège din Monaco (DENJS), aliniate la programele franceze de Cycle 3 (6e) și Cycle 4 (5e–3e) și Diplôme National du Brevet.',
      medium: 'Corelare tematică cu programele lycée din Monaco (DENJS), aliniate la Baccalauréat francez (Seconde, Première și Terminale spécialité mathématiques).'
    },
    SM: {
      beginner: 'Corelare tematică cu Indicazioni curricolari pentru Scuola Elementare din Republica San Marino (classi 1ª–5ª, Segreteria di Stato per l’Istruzione e la Cultura).',
      lower: 'Corelare tematică cu programa Scuola Media din San Marino (classi 1ª–3ª / anii 6–8).',
      medium: 'Corelare tematică cu programa Scuola Secondaria Superiore din San Marino (Liceo scientifico / classico / economico, anii 9–13) și Esame di Stato echivalent cu sistemul italian.'
    }
  };
  return head + frames[country][stage] + TAIL;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 8 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b8', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    curriculumFrame: batch8CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch8MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH8_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch8MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH8_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch8MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}
