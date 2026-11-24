// Textbook & official framework correlation for the 18 non-Romanian implemented
// Mathematics jurisdictions (2026/27):
//   HU, ES, IT, PT, PL, MD, GB-ENG, FR, DE, AT, CH, BE, NL, LU, IE,
//   GB-SCT, GB-WLS, GB-NIR.
// (Romania Grades I–XII is maintained in math_ro_textbook_correlation_2026.mjs.)
//
// COPYRIGHT & HONESTY POLICY:
// - Stores ONLY official reference metadata (title, authors/authority, publisher
//   or state textbook catalog, approval/decree reference, syllabus, official URL).
// - Contains ZERO copied prose, exercises, or figures from any textbook.
// - Where a state issues or registers official per-grade textbooks (HU Oktatási
//   Hivatal OH-MAT series, MD MEC/CTICE Prut Internațional, PL MEN Wykaz
//   podręczników, AT BMBWF Schulbuchaktion, LU MENJE/SCRIPT), cites the real
//   official series/catalog. Where schools choose freely among commercial
//   publishers (GB-ENG, FR, DE, ES, IT, PT, CH, BE, NL, IE, GB-SCT, GB-WLS,
//   GB-NIR), cites the official national curriculum/exam authority + official
//   adoption catalog without inventing a single mandatory commercial edition.
// - University packs (stage === 'advanced') never claim a school textbook
//   (manualExample === null).

import { PORTUGAL_MATH_2026_SOURCE } from './math_portugal_2026.mjs';
import { BATCH2_MATH_SOURCES, batch2PackTextbooks } from './math_batch2_md_uk_fr_de_2026.mjs';
import { BATCH3_MATH_SOURCES, batch3PackTextbooks } from './math_batch3_es_it_pt_pl_2026.mjs';
import { BATCH4_MATH_SOURCES, batch4PackTextbooks } from './math_batch4_western_isles_2026.mjs';

export const IMPLEMENTED_18_TEXTBOOK_COUNTRIES = Object.freeze([
  'HU', 'ES', 'IT', 'PT', 'PL', 'MD', 'GB-ENG', 'FR', 'DE',
  'AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR'
]);

function resolveStageSource(map, stage, grade) {
  if (!map) return null;
  if (typeof map === 'string') return map;
  const st = map[stage];
  if (!st) return null;
  if (typeof st === 'string') return st;
  return st[String(grade)] || Object.values(st)[0] || null;
}

// 1. Hungary (HU) — Oktatási Hivatal (OH) state textbook catalog under NAT 2020
function huCorrelation(stage, grade) {
  const g = String(grade);
  const num = Number(g);
  const pad = Number.isFinite(num) && num >= 1 && num <= 12 ? String(num).padStart(2, '0') : null;
  const code = pad ? `OH-MAT${pad}TA` : 'OH-MAT-TECH13';
  const url = g === '5'
    ? 'https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT05TA'
    : pad
      ? `https://www.tankonyvkatalogus.hu/site/kiadvany/${code}`
      : 'https://www.tankonyvkatalogus.hu/';
  const authors = num >= 5 && num <= 8
    ? 'Csapodi Csaba, Konfárné Nagy Klára, Paróczay Eszter, Tamás Beáta, Wintsche Gergely (Oktatási Hivatal)'
    : 'Oktatási Hivatal tananyagfejlesztő munkacsoport';
  return {
    id: `hu-tb-${code.toLowerCase()}`,
    country: 'HU',
    stage,
    grade: g,
    title: num <= 12 ? `Matematika tankönyv ${g}. évfolyam (${code})` : `Matematika — 13. évfolyam (technikum / érettségi kerettanterv)`,
    authors,
    publisher: 'Oktatási Hivatal (OH)',
    approvalOrder: 'NAT 2020 (5/2020. (I. 31.) Korm. rendelet) · Hivatalos tankönyvjegyzék',
    syllabus: 'Kerettanterv 2020 — Matematika',
    url,
    manualExample: url
  };
}

// 2. Republic of Moldova (MD) — MEC / CTICE official approved school textbooks
function mdCorrelation(stage, grade) {
  const g = String(grade);
  const isPrim = stage === 'beginner';
  const isLower = stage === 'lower';
  const authors = isPrim
    ? 'Ludmila Ursu, Ilie Lupu, Iulia Iasinschi'
    : isLower
      ? 'Ion Achiri, Andrei Braicov, Olga Șpuntenco, Ludmila Ursu'
      : 'Ion Achiri, Valentin Garit, Petru Efros, Nicolae Prodan, Valeriu Ciobanu';
  const syllabus = isPrim
    ? 'Curriculum național — Învățământul primar (Matematică, MEC RM)'
    : 'Curriculum național la Matematică (Ordinul MECC nr. 906/17.07.2019)';
  const catalogUrl = 'https://ctice.gov.md/manuale-scolare/';
  return {
    id: `md-tb-math-${g}`,
    country: 'MD',
    stage,
    grade: g,
    title: `Matematică — Manual pentru clasa a ${g}-a`,
    authors,
    publisher: 'Editura Prut Internațional / MEC Republica Moldova (CTICE)',
    approvalOrder: 'Lista manualelor școlare aprobate MEC RM (ctice.gov.md)',
    syllabus,
    url: catalogUrl,
    manualExample: catalogUrl
  };
}

// Metadata builders for the remaining 16 school systems
const COUNTRY_TEXTBOOK_FRAMEWORKS = Object.freeze({
  ES: {
    publisher: 'BOE / INTEF & adopție editorială pe comunitate autonomă',
    authors: 'Ministerio de Educación, Formación Profesional y Deportes (MEFPD)',
    approvalOrder: {
      beginner: 'Real Decreto 157/2022 (BOE-A-2022-3296 — Educación Primaria)',
      lower: 'Real Decreto 217/2022 (BOE-A-2022-4975 — ESO)',
      medium: 'Real Decreto 243/2022 (BOE-A-2022-5521 — Bachillerato)'
    },
    syllabus: 'Currículo LOMLOE — Matemáticas',
    manualUrl: (stage, grade) => resolveStageSource(BATCH3_MATH_SOURCES.ES, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH3_MATH_SOURCES.ES, stage, grade),
    title: (_stage, grade) => `Matemáticas LOMLOE (${grade}) — marco curricular y registro editorial autonómico`
  },
  IT: {
    publisher: 'MIM (Ministero dell’Istruzione e del Merito) · Registro adozioni AIE',
    authors: 'Commissione nazionale Indicazioni Nazionali (MIM / INDIRE)',
    approvalOrder: {
      beginner: 'DM 254/2012 & DM 221/2025 (Indicazioni Nazionali I ciclo, G.U. 2026)',
      lower: 'DM 254/2012 & DM 221/2025 (Scuola secondaria di I grado)',
      medium: 'DPR 89/2010 & DM 211/2010 (Indicazioni Nazionali Licei / Linee guida Istituti Tecnici e Professionali)'
    },
    syllabus: 'Indicazioni Nazionali per il curricolo — Matematica',
    manualUrl: (stage, grade) => resolveStageSource(BATCH3_MATH_SOURCES.IT, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH3_MATH_SOURCES.IT, stage, grade),
    title: (_stage, grade) => `Matematica (${grade}) — Indicazioni Nazionali MIM & adozione scolastica`
  },
  PT: {
    publisher: 'Direção-Geral da Educação (DGE) · Plataforma MEGA Manuais Escolares Certificados',
    authors: 'DGE — Ministério da Educação, Ciência e Inovação',
    approvalOrder: {
      beginner: 'Despacho n.º 6944-A/2018 & Aprendizagens Essenciais 1.º Ciclo (DGE)',
      lower: 'Despacho n.º 6944-A/2018 & Aprendizagens Essenciais 2.º/3.º Ciclos (DGE)',
      medium: 'Despacho n.º 8476-A/2018 & Aprendizagens Essenciais Matemática A (DGE)'
    },
    syllabus: 'Aprendizagens Essenciais — Matemática (DGE)',
    manualUrl: () => 'https://manuaisescolares.pt/',
    url: (stage, grade) => {
      if (stage === 'lower' && (String(grade) === '5' || String(grade) === '6')) {
        return PORTUGAL_MATH_2026_SOURCE[String(grade)];
      }
      return resolveStageSource(BATCH3_MATH_SOURCES.PT, stage, grade);
    },
    title: (_stage, grade) => `Matemática (${grade}.º ano) — Aprendizagens Essenciais DGE & manuais certificados MEGA`
  },
  PL: {
    publisher: 'MEN Wykaz podręczników (podreczniki.men.gov.pl) & CKE',
    authors: 'Ministerstwo Edukacji Narodowej (MEN) / Centralna Komisja Egzaminacyjna (CKE)',
    approvalOrder: {
      beginner: 'Rozporządzenie MEN — Podstawa programowa kształcenia ogólnego (klasy I–III) & Wykaz podręczników MEN',
      lower: 'Rozporządzenie MEN — Podstawa programowa matematyki (klasy IV–VIII) & Wykaz podręczników MEN',
      medium: 'Podstawa programowa 2024 (liceum/technikum) & wymagania egzaminacyjne CKE'
    },
    syllabus: 'Podstawa programowa kształcenia ogólnego — Matematyka',
    manualUrl: () => 'https://podreczniki.men.gov.pl/',
    url: (stage, grade) => resolveStageSource(BATCH3_MATH_SOURCES.PL, stage, grade),
    title: (_stage, grade) => `Matematyka (${grade}) — Podstawa programowa MEN & Wykaz podręczników dopuszczonych`
  },
  'GB-ENG': {
    publisher: 'Department for Education (DfE) · NCETM Curriculum Prioritisation / Oak National Academy',
    authors: 'Department for Education (DfE) / NCETM / Ofqual',
    approvalOrder: {
      beginner: 'DfE Statutory National Curriculum — Mathematics KS1 & KS2',
      lower: 'DfE National Curriculum — Mathematics KS3 & NCETM Secondary Mastery',
      medium: 'DfE / Ofqual GCSE Mathematics & GCE AS/A level Mathematics Subject Content'
    },
    syllabus: 'National Curriculum in England — Mathematics Programmes of Study',
    manualUrl: (stage, grade) => {
      if (stage === 'medium') {
        return String(grade) === 'Y11' ? BATCH2_MATH_SOURCES['GB-ENG'].gcse : BATCH2_MATH_SOURCES['GB-ENG'].alevel;
      }
      return BATCH2_MATH_SOURCES['GB-ENG'].school;
    },
    url: (stage, grade) => {
      if (stage === 'medium') {
        return String(grade) === 'Y11' ? BATCH2_MATH_SOURCES['GB-ENG'].gcse : BATCH2_MATH_SOURCES['GB-ENG'].alevel;
      }
      return BATCH2_MATH_SOURCES['GB-ENG'].school;
    },
    title: (_stage, grade) => `Mathematics (${grade}) — DfE Statutory Programme & NCETM Reference Spine`
  },
  FR: {
    publisher: 'MENJ Éduscol & manuels scolaires libres de choix pédagogique (ex. Lelivrescolaire.fr)',
    authors: 'Ministère de l’Éducation nationale et de la Jeunesse (MENJ — DGESCO)',
    approvalOrder: {
      beginner: 'Bulletin officiel MENJ — Programmes de mathématiques Cycles 2 et 3 (Éduscol)',
      lower: 'Bulletin officiel MENJ — Programmes de mathématiques Cycles 3 et 4 (Collège)',
      medium: 'Bulletin officiel MENJ — Programmes de mathématiques Lycée général et technologique (2nde, 1re, Terminale)'
    },
    syllabus: 'Programmes officiels Éduscol — Mathématiques',
    manualUrl: () => BATCH2_MATH_SOURCES.FR,
    url: () => BATCH2_MATH_SOURCES.FR,
    title: (_stage, grade) => `Mathématiques (${grade}) — Programmes officiels Éduscol & référence manuels scolaires`
  },
  DE: {
    publisher: 'Kultusministerkonferenz (KMK) · Lernmittelverzeichnisse der Länder',
    authors: 'Sekretariat der Kultusministerkonferenz (KMK) & IQB',
    approvalOrder: {
      beginner: 'KMK Bildungsstandards im Fach Mathematik für den Primarbereich & Landeslehrpläne',
      lower: 'KMK Bildungsstandards Mathematik für den Ersten Schulabschluss / Mittleren Schulabschluss (Sek. I)',
      medium: 'KMK Bildungsstandards Mathematik für die Allgemeine Hochschulreife (Sek. II / Abitur)'
    },
    syllabus: 'KMK Bildungsstandards Mathematik & Kerncurricula der Länder',
    manualUrl: () => BATCH2_MATH_SOURCES.DE,
    url: () => BATCH2_MATH_SOURCES.DE,
    title: (_stage, grade) => `Mathematik (Klasse ${grade}) — KMK Bildungsstandards & zugelassene Schulbücher der Länder`
  },
  AT: {
    publisher: 'BMBWF · Österreichische Schulbuchaktion (Schulbuchliste)',
    authors: 'Bundesministerium für Bildung, Wissenschaft und Forschung (BMBWF)',
    approvalOrder: {
      beginner: 'BGBl. II — Lehrplan der Volksschule (Pädagogikpaket 2023) & Schulbuchliste BMBWF',
      lower: 'BGBl. II — Lehrplan Mittelschule / AHS-Unterstufe (2023) & Schulbuchliste BMBWF',
      medium: 'BMBWF Lehrplan AHS-Oberstufe / BHS & Standardisierte Reife- und Diplomprüfung (SRP Mathematik)'
    },
    syllabus: 'Österreichischer Lehrplan Mathematik (BMBWF)',
    manualUrl: () => 'https://www.schulbuchaktion.at/',
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.AT, stage, grade),
    title: (_stage, grade) => `Mathematik (${grade}. Schulstufe) — BMBWF Lehrplan & Schulbuchaktion`
  },
  CH: {
    publisher: 'D-EDK / CIIP / DECS · Lehrmittelverzeichnisse der Kantone (LMVZ / COROME)',
    authors: 'Deutschschweizer Erziehungsdirektoren-Konferenz (D-EDK) / CIIP / EDK',
    approvalOrder: {
      beginner: 'Lehrplan 21 (Zyklus 1–2) · Plan d’études romand (PER) · Piano di studio',
      lower: 'Lehrplan 21 (Zyklus 3) · PER Moyens d’enseignement romands Mathématiques · Piano di studio',
      medium: 'EDK Rahmenlehrplan für die Maturitätsschulen (Gymnasiale Maturität)'
    },
    syllabus: 'Lehrplan 21 / PER / Piano di studio / EDK Mathematik',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.CH, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.CH, stage, grade),
    title: (_stage, grade) => `Mathematik / Mathématiques (${grade}) — Lehrplan 21 · PER · EDK & kantonale Lehrmittel`
  },
  BE: {
    publisher: 'Fédération Wallonie-Bruxelles (Administration générale de l’Enseignement) & Vlaams Ministerie van Onderwijs',
    authors: 'FWB Référentiels du tronc commun / AHOVOKS Vlaanderen',
    approvalOrder: {
      beginner: 'FWB Référentiel de Mathématiques du tronc commun (Primaire) & Vlaamse minimumdoelen lager onderwijs',
      lower: 'FWB Référentiel du tronc commun (S1–S3) & Vlaamse minimumdoelen secundair onderwijs',
      medium: 'FWB Compétences terminales Mathématiques & Vlaamse eindtermen 2de/3de graad'
    },
    syllabus: 'Référentiels FWB & Vlaamse Onderwijsdoelen — Mathématiques / Wiskunde',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.BE, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.BE, stage, grade),
    title: (_stage, grade) => `Mathématiques / Wiskunde (${grade}) — Référentiels FWB & Onderwijsdoelen Vlaanderen`
  },
  NL: {
    publisher: 'SLO (Nationaal Expertisecentrum Leerplanontwikkeling) & CvTE Examenblad',
    authors: 'SLO / College voor Toetsen en Examens (CvTE)',
    approvalOrder: {
      beginner: 'SLO Kerndoelen Rekenen-Wiskunde Primair Onderwijs (herziene kerndoelen 2026)',
      lower: 'SLO Kerndoelen Onderbouw Voortgezet Onderwijs — Wiskunde',
      medium: 'CvTE Examenprogramma’s & Syllabi Wiskunde (vmbo / havo / vwo — Examenblad)'
    },
    syllabus: 'Kerndoelen & Examenprogramma’s Rekenen-Wiskunde (SLO / CvTE)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.NL, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.NL, stage, grade),
    title: (_stage, grade) => `Rekenen-Wiskunde (${grade}) — SLO Kerndoelen / CvTE Examenblad & schoolmethode`
  },
  LU: {
    publisher: 'MENJE / SCRIPT (Service de Coordination de la Recherche et de l’Innovation pédagogiques et technologiques)',
    authors: 'MENJE — Commissions nationales des programmes & SCRIPT',
    approvalOrder: {
      beginner: 'Règlement grand-ducal — Plan d’études de l’enseignement fondamental & manuels officiels SCRIPT',
      lower: 'Programmes nationaux MENJE — Enseignement secondaire inférieur & catalogue des manuels SCRIPT',
      medium: 'Programmes nationaux MENJE — Enseignement secondaire supérieur (4e–1re)'
    },
    syllabus: 'Plan d’études / Programmes nationaux de mathématiques (MENJE / SCRIPT)',
    manualUrl: () => 'https://www.script.lu/',
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.LU, stage, grade),
    title: (_stage, grade) => `Mathématiques (${grade}) — Plan d’études MENJE & manuels officiels SCRIPT`
  },
  IE: {
    publisher: 'National Council for Curriculum and Assessment (NCCA) / Department of Education',
    authors: 'NCCA Mathematics Development Group & State Examinations Commission (SEC)',
    approvalOrder: {
      beginner: 'Primary Mathematics Curriculum (NCCA / Department of Education, 2023–2026)',
      lower: 'Junior Cycle Mathematics Specification (NCCA)',
      medium: 'Senior Cycle / Leaving Certificate Mathematics Specification (NCCA & SEC)'
    },
    syllabus: 'NCCA Curriculum & Specifications — Mathematics',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.IE, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES.IE, stage, grade),
    title: (_stage, grade) => `Mathematics (${grade}) — NCCA Official Specification & Approved School Texts`
  },
  'GB-SCT': {
    publisher: 'Education Scotland & Scottish Qualifications Authority (SQA)',
    authors: 'Education Scotland / SQA Mathematics Panel',
    approvalOrder: {
      beginner: 'Curriculum for Excellence (CfE) — Numeracy and Mathematics Benchmarks (Early–Second Level)',
      lower: 'Curriculum for Excellence (CfE) — Numeracy and Mathematics Benchmarks (Third–Fourth Level)',
      medium: 'SQA Course Specifications — National 5, Higher and Advanced Higher Mathematics'
    },
    syllabus: 'Curriculum for Excellence & SQA Mathematics Specifications',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-SCT'], stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-SCT'], stage, grade),
    title: (_stage, grade) => `Mathematics (${grade}) — CfE / SQA Official Course Specification`
  },
  'GB-WLS': {
    publisher: 'Welsh Government (Hwb) & WJEC / Qualifications Wales',
    authors: 'Welsh Government Curriculum for Wales & WJEC Mathematics Subject Team',
    approvalOrder: {
      beginner: 'Curriculum for Wales — Mathematics and Numeracy AoLE (Progression Steps 1–3)',
      lower: 'Curriculum for Wales — Mathematics and Numeracy AoLE (Progression Steps 3–4)',
      medium: 'WJEC GCSE Mathematics and Numeracy (Double Award, Sept 2025) & GCE AS/A Level Specifications'
    },
    syllabus: 'Curriculum for Wales & WJEC Mathematics Specifications',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-WLS'], stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-WLS'], stage, grade),
    title: (_stage, grade) => `Mathematics and Numeracy (${grade}) — Hwb Curriculum for Wales / WJEC`
  },
  'GB-NIR': {
    publisher: 'Council for the Curriculum, Examinations & Assessment (CCEA)',
    authors: 'CCEA Mathematics Curriculum & Examinations Team',
    approvalOrder: {
      beginner: 'Northern Ireland Curriculum — Primary Mathematics and Numeracy (Foundation, KS1, KS2)',
      lower: 'Northern Ireland Curriculum — Key Stage 3 Mathematics with Financial Capability',
      medium: 'CCEA GCSE Mathematics & GCE AS/A2 Mathematics Specifications'
    },
    syllabus: 'Northern Ireland Curriculum & CCEA Mathematics Specifications',
    manualUrl: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-NIR'], stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH4_MATH_SOURCES['GB-NIR'], stage, grade),
    title: (_stage, grade) => `Mathematics (${grade}) — NI Curriculum & CCEA Specification`
  }
});

export function mathTextbookCorrelationEntry(country, stage, grade) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const g = String(grade || '').trim();
  if (!c || !st || !g || st === 'advanced') return null;

  if (c === 'HU') return Object.freeze(huCorrelation(st, g));
  if (c === 'MD') return Object.freeze(mdCorrelation(st, g));

  const spec = COUNTRY_TEXTBOOK_FRAMEWORKS[c];
  if (!spec) return null;
  const url = spec.url(st, g);
  const manualExample = spec.manualUrl(st, g) || url;
  return Object.freeze({
    id: `tb-${c.toLowerCase()}-${st}-${g.toLowerCase()}`,
    country: c,
    stage: st,
    grade: g,
    title: spec.title(st, g),
    authors: spec.authors,
    publisher: spec.publisher,
    approvalOrder: spec.approvalOrder[st] || spec.syllabus,
    syllabus: spec.syllabus,
    url,
    manualExample
  });
}

export function mathSchoolManualExample(country, stage, grade) {
  if (stage === 'advanced') return null;
  const entry = mathTextbookCorrelationEntry(country, stage, grade);
  return entry ? entry.manualExample : null;
}

export function mathCorrelatedPackTextbooks(country, stage, grade) {
  const c = String(country || '').toUpperCase();
  if (stage === 'advanced') {
    if (c === 'HU') return [];
    if (['MD', 'GB-ENG', 'FR', 'DE'].includes(c)) return batch2PackTextbooks(c, stage, grade);
    if (['ES', 'IT', 'PT', 'PL'].includes(c)) return batch3PackTextbooks(c, stage, grade);
    if (['AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR'].includes(c)) {
      return batch4PackTextbooks(c, stage, grade);
    }
    return [];
  }
  const entry = mathTextbookCorrelationEntry(c, stage, grade);
  if (!entry) return [];
  return [{
    id: entry.id,
    title: entry.title,
    authors: entry.authors,
    publisher: entry.publisher,
    approvalOrder: entry.approvalOrder,
    syllabus: entry.syllabus,
    labelRo: `${entry.title} · ${entry.publisher}`,
    labelEn: `${entry.title} · ${entry.publisher}`,
    url: entry.url
  }];
}
