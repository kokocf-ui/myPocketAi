// Batch 5 of the 50-country Mathematics completion board (2026/27):
// Denmark (DK), Finland (FI), Iceland (IS), Norway (NO), Sweden (SE),
// Estonia (EE), Latvia (LV), Lithuania (LT) — Grade 1 → university.
// The year/topic plan is generated deterministically by
// scripts/generate_math_batch5_8_plans.mjs (math_batch5_plan_2026.mjs) from the
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
import { BATCH5_MATH_PLAN } from './math_batch5_plan_2026.mjs';

export { BATCH5_MATH_PLAN };
export const BATCH5_MATH_COUNTRIES = Object.freeze(['DK', 'FI', 'IS', 'NO', 'SE', 'EE', 'LV', 'LT']);
export const BATCH5_NATIVE_YEARS = Object.freeze([]);

export const BATCH5_MATH_SOURCES = Object.freeze({
  DK: { beginner: 'https://emu.dk/grundskole/matematik', lower: 'https://emu.dk/grundskole/matematik', medium: 'https://www.uvm.dk/gymnasiale-uddannelser/fag-og-laereplaner' },
  FI: { beginner: 'https://eperusteet.opintopolku.fi/', lower: 'https://eperusteet.opintopolku.fi/', medium: 'https://eperusteet.opintopolku.fi/#/fi/lukio' },
  IS: { beginner: 'https://mms.is/adalnamskra-grunnskola', lower: 'https://mms.is/adalnamskra-grunnskola', medium: 'https://mms.is/adalnamskra-framhaldsskola' },
  NO: { beginner: 'https://www.udir.no/lk20/mat01-05', lower: 'https://www.udir.no/lk20/mat01-05', medium: 'https://www.udir.no/lk20/mat01-05' },
  SE: { beginner: 'https://www.skolverket.se/undervisning/grundskolan/laroplan-och-kursplaner-for-grundskolan', lower: 'https://www.skolverket.se/undervisning/grundskolan/laroplan-och-kursplaner-for-grundskolan', medium: 'https://www.skolverket.se/undervisning/gymnasieskolan/laroplan-program-och-amnen-i-gymnasieskolan' },
  EE: { beginner: 'https://oppekava.innove.ee/', lower: 'https://oppekava.innove.ee/', medium: 'https://www.riigiteataja.ee/akt/129082014021' },
  LV: { beginner: 'https://skola2030.lv/', lower: 'https://skola2030.lv/', medium: 'https://www.visc.gov.lv/' },
  LT: { beginner: 'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/38', lower: 'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/38', medium: 'https://emokykla.lt/bendrosios-programos/visos-bendrosios-programos/38' },
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
  DK: 'coroane daneze',
  FI: 'euro',
  IS: 'coroane islandeze',
  NO: 'coroane norvegiene',
  SE: 'coroane suedeze',
  EE: 'euro',
  LV: 'euro',
  LT: 'euro'
});

export const BATCH5_COUNTRY_NAMES = Object.freeze({
  DK: 'Danemarca',
  FI: 'Finlanda',
  IS: 'Islanda',
  NO: 'Norvegia',
  SE: 'Suedia',
  EE: 'Estonia',
  LV: 'Letonia',
  LT: 'Lituania'
});

const UNIT_TITLES = Object.freeze({
  DK: {
    arithmetic: 'Tal og algebra', geometry: 'Geometri og måling', measurement: 'Måling', algebra: 'Algebra',
    statistics: 'Statistik og sandsynlighed', functions: 'Funktioner', trigonometry: 'Trigonometri', analysis: 'Matematisk analyse',
    'linear-algebra': 'Lineær algebra', discrete: 'Diskret matematik', differential: 'Differentialligninger'
  },
  FI: {
    arithmetic: 'Luvut ja laskutoimitukset', geometry: 'Geometria', measurement: 'Mittaus', algebra: 'Algebra',
    statistics: 'Tilastot ja todennäköisyys', functions: 'Funktiot', trigonometry: 'Trigonometria', analysis: 'Matemaattinen analyysi',
    'linear-algebra': 'Lineaarialgebra', discrete: 'Diskreetti matematiikka', differential: 'Differentiaaliyhtälöt'
  },
  IS: {
    arithmetic: 'Tölur og reikningur', geometry: 'Rúmfræði', measurement: 'Mælingar', algebra: 'Algebra',
    statistics: 'Tölfræði og líkur', functions: 'Föll', trigonometry: 'Hornafræði', analysis: 'Stærðfræðigreining',
    'linear-algebra': 'Línuleg algebra', discrete: 'Strjál stærðfræði', differential: 'Diffurjöfnur'
  },
  NO: {
    arithmetic: 'Tall og regning', geometry: 'Geometri', measurement: 'Måling', algebra: 'Algebra',
    statistics: 'Statistikk og sannsynlighet', functions: 'Funksjoner', trigonometry: 'Trigonometri', analysis: 'Matematisk analyse',
    'linear-algebra': 'Lineær algebra', discrete: 'Diskret matematikk', differential: 'Differensiallikninger'
  },
  SE: {
    arithmetic: 'Taluppfattning och tals användning', geometry: 'Geometri', measurement: 'Mätning', algebra: 'Algebra',
    statistics: 'Sannolikhet och statistik', functions: 'Samband och förändring', trigonometry: 'Trigonometri', analysis: 'Matematisk analys',
    'linear-algebra': 'Linjär algebra', discrete: 'Diskret matematik', differential: 'Differentialekvationer'
  },
  EE: {
    arithmetic: 'Arvud ja arvutamine', geometry: 'Geomeetria', measurement: 'Mõõtmine', algebra: 'Algebra',
    statistics: 'Statistika ja tõenäosus', functions: 'Funktsioonid', trigonometry: 'Trigonomeetria', analysis: 'Matemaatiline analüüs',
    'linear-algebra': 'Lineaaralgebra', discrete: 'Diskreetne matemaatika', differential: 'Diferentsiaalvõrrandid'
  },
  LV: {
    arithmetic: 'Skaitļi un darbības', geometry: 'Ģeometrija', measurement: 'Mērīšana', algebra: 'Algebra',
    statistics: 'Statistika un varbūtība', functions: 'Funkcijas', trigonometry: 'Trigonometrija', analysis: 'Matemātiskā analīze',
    'linear-algebra': 'Lineārā algebra', discrete: 'Diskrētā matemātika', differential: 'Diferenciālvienādojumi'
  },
  LT: {
    arithmetic: 'Skaičiai ir skaičiavimai', geometry: 'Geometrija', measurement: 'Matavimai', algebra: 'Algebra',
    statistics: 'Statistika ir tikimybės', functions: 'Funkcijos', trigonometry: 'Trigonometrija', analysis: 'Matematinė analizė',
    'linear-algebra': 'Tiesinė algebra', discrete: 'Diskrečioji matematika', differential: 'Diferencialinės lygtys'
  }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  const n = Number(g);
  if (stage === 'advanced') {
    const master = n === 4;
    if (country === 'DK') return master ? 'Kandidat i matematik, 1. år' : 'Bachelor i matematik, ' + g + '. år';
    if (country === 'FI') return master ? 'Filosofian maisteri (matematiikka), 1. vuosi' : 'Luonnontieteiden kandidaatti (matematiikka), ' + g + '. vuosi';
    if (country === 'IS') return master ? 'MSc í stærðfræði, 1. ár' : 'BS í stærðfræði, ' + g + '. ár';
    if (country === 'NO') return master ? 'Master i matematiske fag, 1. år' : 'Bachelor i matematiske fag, ' + g + '. år';
    if (country === 'SE') return master ? 'Masterprogram i matematik, år 1' : 'Kandidatprogram i matematik, år ' + g;
    if (country === 'EE') return master ? 'Matemaatika magistriõpe, 1. aasta' : 'Matemaatika bakalaureuseõpe, ' + g + '. aasta';
    if (country === 'LV') return master ? 'Matemātikas maģistra studijas, 1. gads' : 'Matemātikas bakalaura studijas, ' + g + '. gads';
    return 'Matematikos bakalauro studijos, ' + g + ' kursas';
  }
  if (country === 'DK') return stage === 'medium' ? (n - 9) + '.g (stx / gymnasiet)' : g + '. klasse (folkeskole)';
  if (country === 'FI') return stage === 'medium' ? 'Lukio ' + (n - 9) + '. vuosi' : g + '. vuosiluokka (perusopetus)';
  if (country === 'IS') return stage === 'medium' ? 'Framhaldsskóli ' + (n - 10) + '. ár' : g + '. bekkur (grunnskóli)';
  if (country === 'NO') return stage === 'medium' ? 'Vg' + (n - 10) + ' (videregående opplæring)' : g + '. trinn (grunnskole)';
  if (country === 'SE') return stage === 'medium' ? 'Gymnasiet år ' + (n - 9) : 'Årskurs ' + g + ' (grundskola)';
  if (country === 'EE') return g + '. klass (' + (stage === 'medium' ? 'gümnaasium' : 'põhikool') + ')';
  if (country === 'LV') return g + '. klase (' + (stage === 'medium' ? 'vidusskola' : 'pamatizglītība') + ')';
  return g + ' klasė (' + (stage === 'beginner' ? 'pradinis ugdymas' : stage === 'lower' ? 'pagrindinis ugdymas' : 'vidurinis ugdymas / gimnazija') + ')';
}

function sourceFor(country, stage) {
  if (stage === 'advanced') return BATCH5_MATH_SOURCES.university;
  return BATCH5_MATH_SOURCES[country][stage];
}

const TAIL = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';

export function batch5CurriculumFrame(country, stage, grade) {
  const g = String(grade);
  const head = BATCH5_COUNTRY_NAMES[country] + ', ' + gradeLabel(country, stage, g) + '. ';
  if (stage === 'advanced') {
    const length = country === 'LT'
      ? 'licența universitară durează de regulă 4 ani'
      : 'licența (Bachelor) durează de regulă 3 ani, iar anul 4 corespunde primului an de master';
    return head + 'Sinteză universitară raportată la ciclurile Bologna (EHEA); ' + length + ', iar fișele disciplinelor diferă între universități.' + TAIL;
  }
  const frames = {
    DK: {
      beginner: 'Corelare tematică cu Fælles Mål i matematik (indskoling 1.–3. klasse și mellemtrin 4.–6. klasse, BUVM/EMU), organizat pe trinforløb multi-anuale.',
      lower: 'Corelare tematică cu Fælles Mål i matematik pentru udskoling (7.–9. klasse) și reperele evaluării FP9.',
      medium: 'Corelare tematică cu læreplaner Matematik C/B/A în stx/htx/hhx (BUVM); adâncimea depinde de nivelul ales (C, B sau A).'
    },
    FI: {
      beginner: 'Corelare tematică cu Perusopetuksen opetussuunnitelman perusteet (OPH, vuosiluokat 1–2 și 3–6); repartizarea anuală exactă se stabilește în curriculumul municipal.',
      lower: 'Corelare tematică cu Perusopetuksen opetussuunnitelman perusteet (OPH, vuosiluokat 7–9).',
      medium: 'Corelare tematică cu Lukion opetussuunnitelman perusteet (LOPS 2019, OPH); modulele diferă între traseul lung (pitkä matematiikka, MAA) și cel scurt (lyhyt, MAB).'
    },
    IS: {
      beginner: 'Corelare tematică cu Aðalnámskrá grunnskóla — Stærðfræði (1.–4. și 5.–7. bekkur, MMS), formulată pe praguri de competență la finalul claselor 4 și 7.',
      lower: 'Corelare tematică cu Aðalnámskrá grunnskóla — Stærðfræði (8.–10. bekkur, MMS) până la finalul învățământului obligatoriu.',
      medium: 'Corelare tematică cu Aðalnámskrá framhaldsskóla (MMS); cursurile modulare și durata (de regulă 3 ani, uneori 3–4 ani după programul liceului) diferă între școli.'
    },
    NO: {
      beginner: 'Corelare tematică cu Kunnskapsløftet LK20 (MAT01-05, Utdanningsdirektoratet), cu obiective de competență pe fiecare trinn (1.–7. trinn).',
      lower: 'Corelare tematică cu Kunnskapsløftet LK20 (MAT01-05, 8.–10. trinn, Utdanningsdirektoratet).',
      medium: 'Corelare tematică cu programele LK20 pentru videregående (1T/1P în Vg1 și R1/R2 sau S1/S2 în Vg2–Vg3); aici este urmat traseul teoretic (1T → R1 → R2).'
    },
    SE: {
      beginner: 'Corelare tematică cu Lgr22 (Skolverket), organizat pe stadier de câte trei ani (årskurs 1–3 și 4–6), nu ca listă fixă pe fiecare an.',
      lower: 'Corelare tematică cu Lgr22 (Skolverket, högstadiet årskurs 7–9) și reperele probelor naționale din årskurs 9.',
      medium: 'Corelare tematică cu reforma Gy25 pe niveluri de disciplină (ämnesnivåer i matematik, aplicată din 1 iulie 2025 începând cu cohorta 2025/26, în paralel cu cursurile Matematik 1–5 pentru cohortele anterioare).'
    },
    EE: {
      beginner: 'Corelare tematică cu Põhikooli riiklik õppekava (RÕK, kooliastmed I: 1.–3. klass și II: 4.–6. klass, HTM).',
      lower: 'Corelare tematică cu Põhikooli riiklik õppekava (III kooliaste: 7.–9. klass) și reperele examenului final de põhikool.',
      medium: 'Corelare tematică cu Gümnaasiumi riiklik õppekava (HTM); conținutul diferă între matemaatika kitsas (îngust) și lai (lărgit, urmat aici).'
    },
    LV: {
      beginner: 'Corelare tematică cu standardul Skola2030 pamatizglītība (MK noteikumi Nr. 747, 1.–3. și 4.–6. klase, VISC).',
      lower: 'Corelare tematică cu standardul Skola2030 pamatizglītība (7.–9. klase, VISC) și examenul centralizat de clasa a 9-a.',
      medium: 'Corelare tematică cu standardul Skola2030 vidējā izglītība (MK noteikumi Nr. 416, Matematika I optimālais līmenis și Matematika II augstākais līmenis).'
    },
    LT: {
      beginner: 'Corelare tematică cu Matematikos bendroji programa actualizată (UTA, ŠMSM/NŠA, pradinis ugdymas 1–4 klasės).',
      lower: 'Corelare tematică cu Matematikos bendroji programa actualizată (UTA, pagrindinis ugdymas 5–10 / I–II gimnazijos klasės, inclusiv verificarea PUPP).',
      medium: 'Corelare tematică cu Matematikos bendroji programa actualizată (UTA, vidurinis ugdymas III–IV gimnazijos / 11–12 klasės, bendrasis și išplėstinis kursas pentru VBE).'
    }
  };
  return head + frames[country][stage] + TAIL;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 5 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b5', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    curriculumFrame: batch5CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch5MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH5_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch5MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH5_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch5MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}
