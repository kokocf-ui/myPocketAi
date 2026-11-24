// Textbook & official framework correlation for all non-Romanian European
// Mathematics school jurisdictions (2026/27) — 48 school-pack jurisdictions
// across Batches 1–8 (Romania Grades I–XII is maintained in
// math_ro_textbook_correlation_2026.mjs; Vatican City school stages use
// 'external-curriculum' and carry university packs only).
//
// COPYRIGHT & HONESTY POLICY:
// - Stores ONLY official reference metadata (title, authors/authority, publisher
//   or state textbook catalog, approval/decree reference, syllabus, official URL).
// - Contains ZERO copied prose, exercises, or figures from any textbook.
// - Where a state issues or registers official per-grade textbooks (HU Oktatási
//   Hivatal OH-MAT series, MD MEC/CTICE Prut Internațional, PL MEN Wykaz
//   podręczników, AT BMBWF Schulbuchaktion, LU MENJE/SCRIPT, GR Diophantus
//   ebooks.edu.gr, SK Edičný portál, UA IMZO lib.imzo.gov.ua, BY e-padruchnik,
//   TR MEB EBA, RU FPU, ME ZUNS, RS ZUOV, MK e-ucebnici, etc.), cites the real
//   official series/catalog. Where schools choose freely among commercial
//   publishers (Nordics, UK nations, FR, DE, ES, IT, NL, IE, etc.), cites the
//   official national curriculum/exam authority without inventing a mandatory
//   commercial edition.
// - University packs (stage === 'advanced') never claim a school textbook
//   (manualExample === null).

import { PORTUGAL_MATH_2026_SOURCE } from './math_portugal_2026.mjs';
import { BATCH2_MATH_SOURCES, batch2PackTextbooks } from './math_batch2_md_uk_fr_de_2026.mjs';
import { BATCH3_MATH_SOURCES, batch3PackTextbooks } from './math_batch3_es_it_pt_pl_2026.mjs';
import { BATCH4_MATH_SOURCES, batch4PackTextbooks } from './math_batch4_western_isles_2026.mjs';
import { BATCH5_MATH_SOURCES } from './math_batch5_nordic_baltic_2026.mjs';
import { BATCH6_MATH_SOURCES } from './math_batch6_central_med_2026.mjs';
import { BATCH7_MATH_SOURCES } from './math_batch7_southeast_east_2026.mjs';
import { BATCH8_MATH_SOURCES } from './math_batch8_microstates_eurasia_2026.mjs';

export const IMPLEMENTED_18_TEXTBOOK_COUNTRIES = Object.freeze([
  'HU', 'ES', 'IT', 'PT', 'PL', 'MD', 'GB-ENG', 'FR', 'DE',
  'AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR'
]);

export const ALL_SCHOOL_TEXTBOOK_COUNTRIES = Object.freeze([
  ...IMPLEMENTED_18_TEXTBOOK_COUNTRIES,
  'DK', 'FI', 'IS', 'NO', 'SE', 'EE', 'LV', 'LT',
  'CZ', 'SK', 'SI', 'HR', 'BG', 'GR', 'CY', 'MT',
  'BA', 'ME', 'MK', 'RS', 'AL', 'XK', 'UA', 'BY',
  'TR', 'RU', 'AD', 'LI', 'MC', 'SM'
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

// Metadata builders for the remaining 46 school systems
const COUNTRY_TEXTBOOK_FRAMEWORKS = Object.freeze({
  // ---------------------------- Batches 2–4 (16 countries)
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
    manualUrl: (stage, grade) => (stage === 'medium'
      ? (String(grade) === 'Y11' ? BATCH2_MATH_SOURCES['GB-ENG'].gcse : BATCH2_MATH_SOURCES['GB-ENG'].alevel)
      : BATCH2_MATH_SOURCES['GB-ENG'].school),
    url: (stage, grade) => (stage === 'medium'
      ? (String(grade) === 'Y11' ? BATCH2_MATH_SOURCES['GB-ENG'].gcse : BATCH2_MATH_SOURCES['GB-ENG'].alevel)
      : BATCH2_MATH_SOURCES['GB-ENG'].school),
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
      medium: 'KMK Bildungsstandards Mathematik für die Allgemeine Hochschulschulreife (Sek. II / Abitur)'
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
  },

  // ---------------------------- Batch 5: Nordic & Baltic (8 countries)
  DK: {
    publisher: 'Børne- og Undervisningsministeriet (BUVM) · EMU Danmarks læringsportal',
    authors: 'BUVM Styrelsen for Undervisning og Kvalitet (STUK)',
    approvalOrder: {
      beginner: 'Folkeskoleloven — Fælles Mål for faget Matematik (1.–6. klasse)',
      lower: 'Folkeskoleloven — Fælles Mål for Matematik (7.–9. klasse) & FP9 prøvevejledning',
      medium: 'Gymnasiale læreplaner — Matematik C/B/A (stx / htx / hhx, BUVM)'
    },
    syllabus: 'Fælles Mål / Gymnasiale læreplaner — Matematik',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.DK, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.DK, stage, grade),
    title: (_stage, grade) => `Matematik (${grade}. trin) — BUVM Fælles Mål / Læreplan & kommunalt læremiddelvalg`
  },
  FI: {
    publisher: 'Opetushallitus (OPH / Utbildningsstyrelsen) · ePerusteet',
    authors: 'Opetushallitus (Finnish National Agency for Education)',
    approvalOrder: {
      beginner: 'OPH määräys — Perusopetuksen opetussuunnitelman perusteet 2014 (vuosiluokat 1–6)',
      lower: 'OPH määräys — Perusopetuksen opetussuunnitelman perusteet 2014 (vuosiluokat 7–9)',
      medium: 'OPH määräys — Lukion opetussuunnitelman perusteet LOPS 2019 (MAA / MAB)'
    },
    syllabus: 'ePerusteet — Matematiikka (Perusopetus & Lukio)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.FI, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.FI, stage, grade),
    title: (_stage, grade) => `Matematiikka (${grade}. vuosiluokka) — OPH ePerusteet & oppimateriaalit`
  },
  IS: {
    publisher: 'Menntamálastofnun / Miðstöð menntunar og skólaþjónustu (MMS)',
    authors: 'Mennta- og barnamálaráðuneytið & MMS',
    approvalOrder: {
      beginner: 'Aðalnámskrá grunnskóla — Stærðfræði (1.–7. bekkur) & námsefni MMS',
      lower: 'Aðalnámskrá grunnskóla — Stærðfræði (8.–10. bekkur) & námsefni MMS',
      medium: 'Aðalnámskrá framhaldsskóla — Stærðfræði (MMS)'
    },
    syllabus: 'Aðalnámskrá grunnskóla og framhaldsskóla — Stærðfræði',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.IS, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.IS, stage, grade),
    title: (_stage, grade) => `Stærðfræði (${grade}) — MMS Aðalnámskrá & útgefið námsefni`
  },
  NO: {
    publisher: 'Utdanningsdirektoratet (Udir) · Nasjonal digital læringsarena (NDLA)',
    authors: 'Kunnskapsdepartementet / Utdanningsdirektoratet (Udir)',
    approvalOrder: {
      beginner: 'Kunnskapsløftet LK20 — Læreplan i matematikk 1.–10. trinn (MAT01-05, 1.–7. trinn)',
      lower: 'Kunnskapsløftet LK20 — Læreplan i matematikk 1.–10. trinn (MAT01-05, 8.–10. trinn)',
      medium: 'Kunnskapsløftet LK20 — Matematikk fellesfag (1T/1P) og programfag (R1/R2, S1/S2)'
    },
    syllabus: 'LK20 Læreplanverket — Matematikk (Udir)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.NO, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.NO, stage, grade),
    title: (_stage, grade) => `Matematikk (${grade}. trinn) — Udir LK20 & åpne læremidler (NDLA)`
  },
  SE: {
    publisher: 'Skolverket (Statens skolverk)',
    authors: 'Skolverket — Kursplaner och ämnesplaner i matematik',
    approvalOrder: {
      beginner: 'SKOLFS — Läroplan för grundskolan Lgr22, kursplan i matematik (årskurs 1–6)',
      lower: 'SKOLFS — Läroplan för grundskolan Lgr22, kursplan i matematik (årskurs 7–9)',
      medium: 'SKOLFS — Gy25 Ämnesplan i matematik för gymnasieskolan (nivåer 1–2 / fortsättning)'
    },
    syllabus: 'Lgr22 & Gy25 — Matematik (Skolverket)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.SE, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.SE, stage, grade),
    title: (_stage, grade) => `Matematik (årskurs ${grade}) — Skolverket Lgr22 / Gy25 & läromedelsval`
  },
  EE: {
    publisher: 'Haridus- ja Teadusministeerium (HTM) · E-koolikott / Õppekirjanduse register',
    authors: 'HTM & Haridus- ja Noorteamet (Harno)',
    approvalOrder: {
      beginner: 'Vabariigi Valitsuse määrus — Põhikooli riiklik õppekava (I–II kooliaste, 1.–6. klass)',
      lower: 'Vabariigi Valitsuse määrus — Põhikooli riiklik õppekava (III kooliaste, 7.–9. klass)',
      medium: 'Vabariigi Valitsuse määrus — Gümnaasiumi riiklik õppekava (kitsas ja lai matemaatika)'
    },
    syllabus: 'Riiklik õppekava (RÕK) — Matemaatika',
    manualUrl: () => 'https://e-koolikott.ee/',
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.EE, stage, grade),
    title: (_stage, grade) => `Matemaatika (${grade}. klass) — HTM Riiklik õppekava & E-koolikott`
  },
  LV: {
    publisher: 'Valsts izglītības satura centrs (VISC) · Skola2030 / mape.skola2030.lv',
    authors: 'Izglītības un zinātnes ministrija (IZM) & VISC Skola2030',
    approvalOrder: {
      beginner: 'MK noteikumi Nr. 747 — Valsts pamatizglītības standarts (1.–6. klase) & VISC apstiprinātā mācību literatūra',
      lower: 'MK noteikumi Nr. 747 — Valsts pamatizglītības standarts (7.–9. klase) & VISC reģistrs',
      medium: 'MK noteikumi Nr. 416 — Valsts vispārējās vidējās izglītības standarts (Matemātika I / II)'
    },
    syllabus: 'Skola2030 — Matemātikas mācību joma (VISC)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.LV, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.LV, stage, grade),
    title: (_stage, grade) => `Matemātika (${grade}. klase) — VISC Skola2030 standarts & mācību līdzekļi`
  },
  LT: {
    publisher: 'Švietimo, mokslo ir sporto ministerija (ŠMSM) · NŠA eMokykla vadovėlių duomenų bazė',
    authors: 'Nacionalinė švietimo agentūra (NŠA / ŠMSM)',
    approvalOrder: {
      beginner: 'ŠMSM įsakymas — Pradinio ugdymo matematikos bendroji programa (UTA, 1–4 kl.) & NŠA vadovėlių registras',
      lower: 'ŠMSM įsakymas — Pagrindinio ugdymo matematikos bendroji programa (UTA, 5–10 kl.) & NŠA registras',
      medium: 'ŠMSM įsakymas — Vidurinio ugdymo matematikos bendroji programa (UTA, III–IV gimn. kl.)'
    },
    syllabus: 'Matematikos bendroji programa (UTA — NŠA / eMokykla)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.LT, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH5_MATH_SOURCES.LT, stage, grade),
    title: (_stage, grade) => `Matematika (${grade} klasė) — NŠA Bendroji programa & galiojančių vadovėlių registras`
  },

  // ---------------------------- Batch 6: Central & Mediterranean EU (8 countries)
  CZ: {
    publisher: 'MŠMT (Seznam učebnic se schvalovací doložkou) & Národní pedagogický institut (NPI)',
    authors: 'Ministerstvo školství, mládeže a tělovýchovy (MŠMT) / NPI ČR / CERMAT',
    approvalOrder: {
      beginner: 'RVP ZV — Matematika a její aplikace (1. stupeň ZŠ) & schvalovací doložka MŠMT',
      lower: 'RVP ZV — Matematika a její aplikace (2. stupeň ZŠ) & schvalovací doložka MŠMT',
      medium: 'RVP pro gymnázia (RVP G) & Katalog požadavků společné části maturitní zkoušky (CERMAT)'
    },
    syllabus: 'Rámcový vzdělávací program (RVP ZV / RVP G) — Matematika',
    manualUrl: () => 'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/seznam-ucebnic',
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.CZ, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}. ročník) — NPI RVP & učebnice se schvalovací doložkou MŠMT`
  },
  SK: {
    publisher: 'MŠVVaM SR · Edičný portál (edicnyportal.iedu.sk) & NIVaM',
    authors: 'Národný inštitút vzdelávania a mládeže (NIVaM / ŠPÚ)',
    approvalOrder: {
      beginner: 'Štátny vzdelávací program (ŠVP — Matematika a práca s informáciami) & zoznam schválených učebníc MŠVVaM',
      lower: 'ŠVP pre nižšie stredné vzdelávanie (ročníky 5–9) & Edičný portál MŠVVaM',
      medium: 'ŠVP pre gymnáziá & Cieľové požiadavky na maturitnú skúšku z matematiky (NIVaM)'
    },
    syllabus: 'Štátny vzdelávací program (ŠVP) — Matematika (NIVaM)',
    manualUrl: () => 'https://edicnyportal.iedu.sk/',
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.SK, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}. ročník) — NIVaM ŠVP & Edičný portál schválených učebníc`
  },
  SI: {
    publisher: 'MVI & Zavod RS za šolstvo (ZRSŠ) · Katalog potrjenih učbenikov',
    authors: 'Ministrstvo za vzgojo in izobraževanje (MVI) / Strokovni svet RS za splošno izobraževanje',
    approvalOrder: {
      beginner: 'Učni načrt Matematika za osnovno šolo (1.–6. razred) & Katalog potrjenih učbenikov MVI',
      lower: 'Učni načrt Matematika za osnovno šolo (7.–9. razred) & Katalog potrjenih učbenikov MVI',
      medium: 'Učni načrt Matematika za gimnazije (ZRSŠ) & Predmetni izpitni katalog za splošno maturo (RIC)'
    },
    syllabus: 'Učni načrt Matematika — Osnovna šola in gimnazija (ZRSŠ)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.SI, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.SI, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}) — ZRSŠ Učni načrt & Katalog potrjenih učbenikov`
  },
  HR: {
    publisher: 'MZOM (Ministarstvo znanosti, obrazovanja i mladih) · Katalog odobrenih udžbenika',
    authors: 'MZOM Stručna radna skupina za Matematiku & NCVVO',
    approvalOrder: {
      beginner: 'Odluka o donošenju kurikuluma za nastavni predmet Matematika (NN 7/2019, 1.–4. razred OŠ) & Katalog udžbenika MZOM',
      lower: 'Kurikulum nastavnog predmeta Matematika (NN 7/2019, 5.–8. razred OŠ) & Katalog udžbenika MZOM',
      medium: 'Kurikulum nastavnog predmeta Matematika za gimnazije (G1–G4) & Ispitni katalog Državne mature (NCVVO)'
    },
    syllabus: 'Nacionalni kurikulum nastavnog predmeta Matematika (MZOM)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.HR, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.HR, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}) — MZOM Kurikulum & Katalog odobrenih udžbenika`
  },
  BG: {
    publisher: 'МОН (Министерство на образованието и науката) · Списък на одобрените познавателни книжки, учебници и учебни комплекти',
    authors: 'Министерство на образованието и науката на Република България (МОН)',
    approvalOrder: {
      beginner: 'Наредба № 5 МОН — Учебни програми по математика (1.–4. клас) & Списък на одобрените учебници МОН',
      lower: 'Наредба № 5 МОН — Учебни програми по математика (5.–7. клас) & Списък на одобрените учебници МОН',
      medium: 'Учебни програми по математика за ООП и профилирана подготовка (8.–12. клас, ДЗИ, МОН)'
    },
    syllabus: 'Учебни програми по математика (МОН)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.BG, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.BG, stage, grade),
    title: (_stage, grade) => `Математика (${grade}. клас) — Учебна програма и списък на одобрените учебници на МОН`
  },
  GR: {
    publisher: 'ΙΤΥΕ «Διόφαντος» (ebooks.edu.gr — Διαδραστικά Σχολικά Βιβλία) & ΙΕΠ',
    authors: 'Ινστιτούτο Εκπαιδευτικής Πολιτικής (ΙΕΠ) / ΥΠΑΙΘΑ',
    approvalOrder: {
      beginner: 'ΦΕΚ — Αναλυτικό Πρόγραμμα Σπουδών Μαθηματικών Δημοτικού & σχολικά βιβλία Διόφαντος',
      lower: 'ΦΕΚ — Αναλυτικό Πρόγραμμα Σπουδών Μαθηματικών Γυμνασίου & σχολικά βιβλία Διόφαντος',
      medium: 'ΦΕΚ — Αναλυτικό Πρόγραμμα Σπουδών Γενικού Λυκείου (Άλγεβρα, Γεωμετρία, Μαθηματικά Προσανατολισμού)'
    },
    syllabus: 'Αναλυτικά Προγράμματα Σπουδών Μαθηματικών (ΙΕΠ) & Βιβλία Διόφαντος',
    manualUrl: () => 'https://ebooks.edu.gr/ebooks/',
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.GR, stage, grade),
    title: (_stage, grade) => `Μαθηματικά (${grade}) — ΙΕΠ ΠΣ & Επίσημα Σχολικά Βιβλία Διόφαντος`
  },
  CY: {
    publisher: 'Υπουργείο Παιδείας, Αθλητισμού και Νεολαίας (ΥΠΑΝ) — Υπηρεσία Ανάπτυξης Προγραμμάτων',
    authors: 'Παιδαγωγικό Ινστιτούτο Κύπρου / ΥΠΑΝ',
    approvalOrder: {
      beginner: 'ΥΠΑΝ — Αναλυτικό Πρόγραμμα Μαθηματικών Δημοτικής Εκπαίδευσης & κρατικά βιβλία ΥΠΑΝ',
      lower: 'ΥΠΑΝ — Αναλυτικό Πρόγραμμα Μαθηματικών Μέσης Γενικής Εκπαίδευσης (Γυμνάσιο)',
      medium: 'ΥΠΑΝ — Αναλυτικό Πρόγραμμα Λυκείου (Κοινός Κορμός / Κατεύθυνση) & Παγκύπριες Εξετάσεις'
    },
    syllabus: 'Αναλυτικά Προγράμματα Μαθηματικών Κύπρου (ΥΠΑΝ)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.CY, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.CY, stage, grade),
    title: (_stage, grade) => `Μαθηματικά (${grade}) — ΥΠΑΝ Κύπρου Αναλυτικά Προγράμματα & Σχολικά Εγχειρίδια`
  },
  MT: {
    publisher: 'Ministry for Education, Sport, Youth, Research and Innovation (MEYR) & MATSEC Board (University of Malta)',
    authors: 'Directorate for Learning and Assessment Programmes (DLAP) & MATSEC',
    approvalOrder: {
      beginner: 'National Curriculum Framework (NCF) & Learning Outcomes Framework — Primary Mathematics (Years 1–6)',
      lower: 'Learning Outcomes Framework (Years 7–11) & MATSEC SEC Mathematics Syllabus',
      medium: 'MATSEC Intermediate & Advanced Matriculation Pure Mathematics Syllabi (Years 12–13)'
    },
    syllabus: 'Malta LOF & MATSEC Mathematics Syllabi',
    manualUrl: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.MT, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH6_MATH_SOURCES.MT, stage, grade),
    title: (_stage, grade) => `Mathematics (Year ${grade}) — MEYR Learning Outcomes Framework / MATSEC`
  },

  // ---------------------------- Batch 7: Southeast & Eastern Europe (8 countries)
  BA: {
    publisher: 'APOSO BiH & kantonalna / entitetska ministarstva obrazovanja (odobreni udžbenici)',
    authors: 'Agencija za predškolsko, osnovno i srednje obrazovanje BiH (APOSO)',
    approvalOrder: {
      beginner: 'Zajednička jezgra nastavnih planova i programa za matematiku definirana na ishodima učenja (APOSO, 1.–5. razred)',
      lower: 'Zajednička jezgra nastavnih planova i programa za matematiku (APOSO, 6.–9. razred osnovne škole)',
      medium: 'Zajednička jezgra nastavnih planova i programa za matematiku u gimnaziji (S1–S4, APOSO)'
    },
    syllabus: 'Zajednička jezgra nastavnih planova i programa — Matematika (APOSO BiH)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.BA, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.BA, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}) — APOSO Zajednička jezgra & entitetski/kantonalni katalozi udžbenika`
  },
  ME: {
    publisher: 'Zavod za školstvo Crne Gore (ZZŠ) & Zavod za udžbenike i nastavna sredstva Podgorica (ZUNS)',
    authors: 'Nacionalni savjet za obrazovanje & ZZŠ Crne Gore',
    approvalOrder: {
      beginner: 'Predmetni program Matematika za osnovnu školu (I–V razred, ZZŠ) & Katalog udžbenika ZUNS',
      lower: 'Predmetni program Matematika za osnovnu školu (VI–IX razred, ZZŠ) & Katalog udžbenika ZUNS',
      medium: 'Predmetni program Matematika za opštu gimnaziju (ZZŠ) & Ispitni centar Crne Gore'
    },
    syllabus: 'Predmetni program Matematika (ZZŠ Crne Gore)',
    manualUrl: () => 'https://zuns.me/',
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.ME, stage, grade),
    title: (_stage, grade) => `Matematika (${grade}. razred) — ZZŠ Predmetni program & udžbenici ZUNS Podgorica`
  },
  MK: {
    publisher: 'Биро за развој на образованието (БРО) & Педагошка служба (e-ucebnici.mon.gov.mk)',
    authors: 'МОН на РС Македонија / Биро за развој на образованието (БРО)',
    approvalOrder: {
      beginner: 'Наставни програми по математика за основно образование (I–V одделение, БРО) & одобрени учебници МОН',
      lower: 'Наставни програми по математика (VI–IX одделение, БРО) & каталог на е-учебници МОН',
      medium: 'Наставни програми по математика за гимназиско образование (БРО) & Државен испитен центар'
    },
    syllabus: 'Наставни програми по математика (БРО)',
    manualUrl: () => 'https://www.e-ucebnici.mon.gov.mk/',
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.MK, stage, grade),
    title: (_stage, grade) => `Математика (${grade}) — БРО Наставна програма & е-учебници МОН`
  },
  RS: {
    publisher: 'Завод за унапређивање образовања и васпитања (ЗУОВ) — Каталог одобрених уџбеника',
    authors: 'Министарство просвете Републике Србије & ЗУОВ',
    approvalOrder: {
      beginner: 'Правилник о програму наставе и учења за I циклус основног образовања (1.–4. разред) & Каталог уџбеника ЗУОВ',
      lower: 'Правилник о програму наставе и учења за II циклус основног образовања (5.–8. разред) & Каталог уџбеника ЗУОВ',
      medium: 'Правилник о програму наставе и учења за гимназију (G1–G4) & Каталог уџбеника ЗУОВ'
    },
    syllabus: 'Програм наставе и учења — Математика (ЗУОВ)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.RS, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.RS, stage, grade),
    title: (_stage, grade) => `Математика (${grade}) — ЗУОВ Програм наставе и учења & Каталог одобрених уџбеника`
  },
  AL: {
    publisher: 'ASCAP (Agjencia e Sigurimit të Cilësisë së Arsimit Parauniversitar) — Katalogu i teksteve shkollore',
    authors: 'Ministria e Arsimit dhe Sportit (MAS) & ASCAP',
    approvalOrder: {
      beginner: 'Korniza Kurrikulare & Programet e Matematikës për arsimin fillor (klasat 1–5, ASCAP) & Katalogu zyrtar i teksteve',
      lower: 'Programet lëndore të Matematikës për AMU (klasat 6–9, ASCAP) & Katalogu zyrtar i teksteve',
      medium: 'Programet e Matematikës për gjimnaz (klasat 10–12, ASCAP) & QSHA Matura Shtetërore'
    },
    syllabus: 'Programet lëndore të Matematikës (ASCAP)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.AL, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.AL, stage, grade),
    title: (_stage, grade) => `Matematikë (Klasa ${grade}) — ASCAP Programi lëndor & Katalogu i teksteve të miratuara`
  },
  XK: {
    publisher: 'MASHTI (Ministria e Arsimit, Shkencës, Teknologjisë dhe Inovacionit) — Katalogu i teksteve shkollore',
    authors: 'MASHTI — Këshilli i Ekspertëve për Programe dhe Tekste Shkollore (KEPTSH)',
    approvalOrder: {
      beginner: 'Korniza e Kurrikulës e Kosovës (KKK) & Kurrikula Bërthamë I (klasat 1–5, MASHTI)',
      lower: 'Kurrikula Bërthamë II për arsimin e mesëm të ulët (klasat 6–9, MASHTI)',
      medium: 'Kurrikula Bërthamë III për gjimnaze (klasat 10–12, MASHTI)'
    },
    syllabus: 'Korniza e Kurrikulës e Kosovës — Fusha Matematikë (MASHTI)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.XK, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.XK, stage, grade),
    title: (_stage, grade) => `Matematikë / Математика (Klasa ${grade}) — MASHTI Kurrikula Bërthamë & Tekstet e miratuara`
  },
  UA: {
    publisher: 'МОН України · ДНУ «ІМЗО» Електронна бібліотека підручників (lib.imzo.gov.ua)',
    authors: 'Міністерство освіти і науки України (МОН) & Інститут модернізації змісту освіти (ІМЗО)',
    approvalOrder: {
      beginner: 'Державний стандарт початкової освіти НУШ (1–4 класи) & Перелік підручників з грифом МОН (ІМЗО)',
      lower: 'Державний стандарт базової середньої освіти НУШ (5–9 класи, модельні програми) & підручники з грифом МОН',
      medium: 'Навчальні програми з математики 10–11 кл. та пілот академічного ліцею НУШ (12 кл. у 2026/27 р.) · гриф МОН'
    },
    syllabus: 'Освітні та модельні навчальні програми з математики (МОН України / НУШ)',
    manualUrl: () => 'https://lib.imzo.gov.ua/yelektronn-vers-pdruchnikv/',
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.UA, stage, grade),
    title: (_stage, grade) => `Математика / Алгебра і Геометрія (${grade} клас) — МОН України & Електронна бібліотека ІМЗО`
  },
  BY: {
    publisher: 'Нацыянальны інстытут адукацыі (НІА) · Нацыянальны адукацыйны партал (e-padruchnik.adu.by)',
    authors: 'Міністэрства адукацыі Рэспублікі Беларусь & НІА',
    approvalOrder: {
      beginner: 'Вучэбныя праграмы па матэматыцы для I–IV класаў & Пералік вучэбных выданняў Мінадукацыі РБ',
      lower: 'Вучэбныя праграмы па матэматыцы (V–VI кл.), алгебры і геаметрыі (VII–IX кл.) & адзіныя падручнікі НІА',
      medium: 'Вучэбныя праграмы па матэматыцы для X–XI класаў (базавы і павышаны ўзроўні) & падручнікі НІА'
    },
    syllabus: 'Вучэбныя праграмы па матэматыцы (adu.by / НІА)',
    manualUrl: () => 'https://e-padruchnik.adu.by/',
    url: (stage, grade) => resolveStageSource(BATCH7_MATH_SOURCES.BY, stage, grade),
    title: (_stage, grade) => `Матэматыка (${grade} клас) — Вучэбная праграма і электронныя падручнікі НІА (adu.by)`
  },

  // ---------------------------- Batch 8: Türkiye, Russia & Microstates (6 school systems; VA is university-only)
  TR: {
    publisher: 'MEB Talim ve Terbiye Kurulu Başkanlığı (TTKB) · EBA Ders Kitapları',
    authors: 'T.C. Millî Eğitim Bakanlığı (MEB — Komisyon / onaylı yayınevleri)',
    approvalOrder: {
      beginner: 'MEB TTKB — Türkiye Yüzyılı Maarif Modeli (1–3. sınıf) & 2018 İlkokul Matematik Öğretim Programı (4. sınıf, 2026/27)',
      lower: 'MEB TTKB — Türkiye Yüzyılı Maarif Modeli (5–7. sınıf) & 2018 Ortaokul Matematik Programı (8. sınıf, 2026/27)',
      medium: 'MEB TTKB — Türkiye Yüzyılı Maarif Modeli (9–11. sınıf) & 2018 Ortaöğretim Matematik Programı (12. sınıf, 2026/27)'
    },
    syllabus: 'MEB Matematik Dersi Öğretim Programı (TYMM & 2018 kademeli geçiş)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.TR, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.TR, stage, grade),
    title: (_stage, grade) => `Matematik (${grade}. Sınıf) — MEB TTKB Öğretim Programı & Onaylı Ders Kitapları`
  },
  RU: {
    publisher: 'Минпросвещения России · ЕДСОО & Федеральный перечень учебников (fpu.edu.ru)',
    authors: 'Министерство просвещения РФ / Институт стратегии развития образования (ЕДСОО)',
    approvalOrder: {
      beginner: 'ФГОС НОО & Федеральная рабочая программа начального общего образования «Математика» (1–4 кл.) · ФПУ',
      lower: 'ФГОС ООО & Федеральные рабочие программы «Математика», «Алгебра», «Геометрия», «Вероятность и статистика» (5–9 кл.) · ФПУ',
      medium: 'ФГОС СОО & Федеральные рабочие программы по математике (базовый и углублённый уровни, 10–11 кл.) · ФПУ'
    },
    syllabus: 'ФГОС & Федеральные рабочие программы по математике (ЕДСОО)',
    manualUrl: () => 'https://fpu.edu.ru/',
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.RU, stage, grade),
    title: (_stage, grade) => `Математика (${grade} класс) — ФРП ЕДСОО и Федеральный перечень учебников`
  },
  AD: {
    publisher: 'Ministeri de Relacions Institucionals, Educació i Universitats (Govern d’Andorra)',
    authors: 'Àrea de Desenvolupament Curricular — Sistema Educatiu Andorrà (Escola Andorrana)',
    approvalOrder: {
      beginner: 'Decret d’ordenament curricular de la primera ensenyança de l’Escola Andorrana (cursos 1–6)',
      lower: 'Decret d’ordenament curricular de la segona ensenyança de l’Escola Andorrana (S1–S4)',
      medium: 'Programes del Batxillerat de l’Escola Andorrana (B1–B2) & Prova Oficial de Batxillerat (POB)'
    },
    syllabus: 'Currículum de Matemàtiques — Escola Andorrana (educacio.ad)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.AD, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.AD, stage, grade),
    title: (_stage, grade) => `Matemàtiques (${grade}) — Escola Andorrana (Govern d’Andorra) & recursos curriculars`
  },
  LI: {
    publisher: 'Schulamt Fürstentum Liechtenstein · Liechtensteiner Lehrplan (LiLe) / Lehrmittelverzeichnis',
    authors: 'Regierung des Fürstentums Liechtenstein — Schulamt (in Anlehnung an Lehrplan 21)',
    approvalOrder: {
      beginner: 'Liechtensteiner Lehrplan (LiLe — Primarschule 1.–5. Klasse, Fachbereich Mathematik)',
      lower: 'Liechtensteiner Lehrplan (LiLe — Sekundarstufe I: Oberschule, Realschule, Gymnasium Unterstufe 6.–9. Stufe)',
      medium: 'Lehrplan Oberstufe Liechtensteinisches Gymnasium (O1–O4) & Maturitätsreglement'
    },
    syllabus: 'Liechtensteiner Lehrplan (fl.lehrplan.ch) & Gymnasiallehrplan Mathematik',
    manualUrl: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.LI, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.LI, stage, grade),
    title: (_stage, grade) => `Mathematik (${grade}) — Liechtensteiner Lehrplan (LiLe) & Lehrmittelverzeichnis`
  },
  MC: {
    publisher: 'Direction de l’Éducation Nationale, de la Jeunesse et des Sports (DENJS Monaco) · alignement Éduscol',
    authors: 'Gouvernement Princier de Monaco (DENJS) / Programmes français homologués',
    approvalOrder: {
      beginner: 'Programmes de l’enseignement primaire monégasque (DENJS — Cycles 2 et 3 : CP–CM2)',
      lower: 'Programmes de mathématiques du collège à Monaco (DENJS — 6e à 3e / DNB)',
      medium: 'Programmes de mathématiques du lycée à Monaco (DENJS — 2nde, 1re, Terminale / Baccalauréat)'
    },
    syllabus: 'Programmes scolaires DENJS Monaco (alignés sur les programmes nationaux français)',
    manualUrl: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.MC, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.MC, stage, grade),
    title: (_stage, grade) => `Mathématiques (${grade}) — DENJS Principauté de Monaco & manuels homologués`
  },
  SM: {
    publisher: 'Segreteria di Stato per l’Istruzione e la Cultura (Repubblica di San Marino)',
    authors: 'Dipartimento Istruzione e Cultura — Repubblica di San Marino',
    approvalOrder: {
      beginner: 'Indicazioni curricolari per la Scuola Elementare sammarinese (classi 1ª–5ª — Matematica)',
      lower: 'Curricolo di Matematica per la Scuola Media inferiore di San Marino (anni 6–8)',
      medium: 'Programmi della Scuola Secondaria Superiore di San Marino (anni 9–13 & Esame di Stato)'
    },
    syllabus: 'Curricoli ufficiali di Matematica — Repubblica di San Marino',
    manualUrl: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.SM, stage, grade),
    url: (stage, grade) => resolveStageSource(BATCH8_MATH_SOURCES.SM, stage, grade),
    title: (_stage, grade) => `Matematica (${grade}º anno) — Dipartimento Istruzione Repubblica di San Marino`
  }
});

export function mathTextbookCorrelationEntry(country, stage, grade) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const g = String(grade || '').trim();
  if (!c || !st || !g || st === 'advanced') return null;
  if (c === 'VA' || g === 'external-curriculum') return null;

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
