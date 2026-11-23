// Batch 2 of the 50-country Mathematics completion board (2026/27):
// Republica Moldova (MD), England (GB-ENG), France (FR), Germany (DE).
// Maps original concept lessons (math_batch2_bank_*.mjs) onto each national
// school year and topic branch, from Grade/Year 1 to university.
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).
// The lessons are original explanations: they are thematically aligned with the
// national frameworks cited below, do NOT reproduce textbooks, and do NOT claim
// certified full annual coverage.

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';

export const BATCH2_MATH_COUNTRIES = Object.freeze(['MD', 'GB-ENG', 'FR', 'DE']);

export const BATCH2_MATH_SOURCES = Object.freeze({
  MD: 'https://www.edu.gov.md/ro/content/invatamint-general',
  'GB-ENG': {
    school: 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
    gcse: 'https://www.gov.uk/government/publications/gcse-mathematics-subject-content-and-assessment-objectives',
    alevel: 'https://www.gov.uk/government/publications/gce-as-and-a-level-mathematics',
    university: 'https://www.qaa.ac.uk/the-quality-code/subject-benchmark-statements/subject-benchmark-statement-mathematics-statistics-and-operational-research'
  },
  FR: 'https://eduscol.education.gouv.fr/4509/mathematiques',
  DE: 'https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',
  university: 'https://ehea.info/'
});

const CONCEPTS = Object.freeze({
  ...B2_PRIMARY_BANK,
  ...B2_LOWER_BANK,
  ...B2_UPPER_BANK,
  ...B2_UNIVERSITY_BANK
});

const CURRENCY = Object.freeze({ MD: 'lei', 'GB-ENG': 'lire sterline', FR: 'euro', DE: 'euro' });

const UNIT_TITLES = Object.freeze({
  MD: { arithmetic: 'Numere și operații', geometry: 'Figuri geometrice', measurement: 'Mărimi și măsurări',
    algebra: 'Algebră și ecuații', statistics: 'Statistică și probabilități', functions: 'Funcții și grafice',
    trigonometry: 'Trigonometrie', analysis: 'Elemente de analiză matematică',
    'linear-algebra': 'Algebră liniară', discrete: 'Matematică discretă', differential: 'Ecuații diferențiale' },
  'GB-ENG': { arithmetic: 'Number and place value / calculation', geometry: 'Geometry: properties of shapes, position and direction',
    measurement: 'Measurement', algebra: 'Algebra, ratio and number', statistics: 'Statistics and probability',
    functions: 'Functions and graphs', trigonometry: 'Trigonometry', analysis: 'Calculus',
    'linear-algebra': 'Linear algebra', discrete: 'Discrete mathematics', differential: 'Differential equations' },
  FR: { arithmetic: 'Nombres et calculs', geometry: 'Espace et géométrie', measurement: 'Grandeurs et mesures',
    algebra: 'Nombres, calculs et algèbre', statistics: 'Organisation et gestion de données, probabilités',
    functions: 'Fonctions', trigonometry: 'Trigonométrie', analysis: 'Analyse',
    'linear-algebra': 'Algèbre linéaire', discrete: 'Mathématiques discrètes', differential: 'Équations différentielles' },
  DE: { arithmetic: 'Zahlen und Operationen', geometry: 'Raum und Form', measurement: 'Größen und Messen',
    algebra: 'Zahl und Algebra', statistics: 'Daten und Zufall', functions: 'Funktionaler Zusammenhang',
    trigonometry: 'Trigonometrie', analysis: 'Analysis',
    'linear-algebra': 'Lineare Algebra', discrete: 'Diskrete Mathematik', differential: 'Differentialgleichungen' }
});

// University study plan (shared mathematical core; module order differs between institutions).
const UNIVERSITY_PLAN = Object.freeze({
  '1': { analysis: ['un1an-supremum', 'un1an-series', 'un1an-taylor'], 'linear-algebra': ['un1la-determinants', 'un1la-rank-nullity', 'un1la-change-basis'], discrete: ['un1d-equivalence', 'un1d-inclusion-exclusion', 'un1d-modular'] },
  '2': { analysis: ['un2an-power-series', 'un2an-lagrange', 'un2an-fubini'], 'linear-algebra': ['un2la-diagonalization', 'un2la-gram-schmidt', 'un2la-least-squares'], statistics: ['un2s-poisson-exponential', 'un2s-covariance', 'un2s-clt'] },
  '3': { differential: ['un3de-second-order', 'un3de-linear-systems', 'un3de-laplace'], analysis: ['un3an-cauchy-riemann', 'un3an-residues', 'un3an-fourier'], discrete: ['un3dm-generating', 'un3dm-spanning-trees', 'un3dm-shortest-paths'] },
  '4': { analysis: ['un4an-banach', 'un4an-heat-equation', 'un4an-newton-numerics'], statistics: ['un4s-mle', 'un4s-regression', 'un4s-chi-square'], discrete: ['un4dm-linear-programming', 'un4dm-network-flows', 'un4dm-rsa'] }
});

const P1 = { arithmetic: ['p1a-numbers-20', 'p1a-addsub-20', 'p1a-tens-100', 'p1a-word'], geometry: ['p1g-shapes2d', 'p1g-solids', 'p1g-position'], measurement: ['p1m-length-nonstd', 'p1m-time', 'p1m-money'] };
const P2 = { arithmetic: ['p2a-place-100', 'p2a-addsub-100', 'p2a-mult-2-5-10', 'p2a-fractions-simple'], geometry: ['p2g-properties', 'p2g-faces', 'p2g-patterns-turns'], measurement: ['p2m-cm-m', 'p2m-mass-capacity', 'p2m-time-5min'] };
const P3 = { arithmetic: ['p3a-place-1000', 'p3a-written-addsub', 'p3a-mult-tables', 'p3a-mult-2digit'], geometry: ['p3g-right-angle', 'p3g-perimeter', 'p3g-lines'], measurement: ['p3m-units-convert', 'p3m-time-calendar', 'p3m-money-calc'] };
const P4 = { arithmetic: ['p4a-place-big', 'p4a-written-mult', 'p4a-long-division', 'p4a-fractions-of-quantity'], geometry: ['p4g-angles', 'p4g-area-squares', 'p4g-symmetry-coords'], measurement: ['p4m-scale-units', 'p4m-time-24h', 'p4m-data-tables'] };
const U1 = { algebra: ['u1a-sets-intervals-abs', 'u1a-quadratic-inequality', 'u1a-logic-reasoning'], functions: ['u1f-function-def-domain', 'u1f-variation-extrema', 'u1f-reference-functions'], geometry: ['u1g-vectors-coords', 'u1g-line-equation', 'u1g-vector-geometry-proofs'], statistics: ['u1s-dispersion-weighted', 'u1s-probability-model', 'u1s-sampling'] };

// (country -> stage -> grade -> topic -> concept keys). Stage keys are the
// school-matrix stages (beginner / lower / medium / advanced).
export const BATCH2_MATH_PLAN = Object.freeze({
  MD: {
    beginner: { '1': P1, '2': P2, '3': P3, '4': P4 },
    lower: {
      '5': { algebra: ['l1a-big-numbers-rounding', 'l1a-divisibility', 'l1a-fraction-ops', 'l1a-letters'], geometry: ['l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-area-perimeter'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range'] },
      '6': { algebra: ['l1a-decimal-ops', 'l2a-negative-ops', 'l2a-ratio', 'l2a-percent'], geometry: ['l2g-angle-relations', 'l2g-circle', 'l1g-solids-nets'], statistics: ['l2s-pie-chart', 'l2s-median-mode', 'l2s-probability-scale'] },
      '7': { algebra: ['l2a-simple-equations', 'l3a-powers-roots', 'l3a-expand-brackets', 'l3a-proportional'], geometry: ['l2g-triangle-sum', 'l3g-congruence', 'l3g-quadrilateral'], statistics: ['l3s-grouped-data', 'l3s-relative-frequency', 'l3s-two-way-tables'] },
      '8': { algebra: ['l3a-linear-equations-both-sides', 'l4a-identities', 'l4a-linear-function-graph', 'l4a-systems-2x2'], geometry: ['l3g-pythagoras', 'l4g-similarity-thales', 'l3g-prism-volume'], statistics: ['l4s-quartiles-boxplot', 'l4s-tree-diagram', 'l4s-scatter'] },
      '9': { algebra: ['l4a-inequalities', 'l5a-irrational-radicals', 'l5a-quadratic-formula', 'l5a-functions-quadratic-graph'], geometry: ['l4g-right-triangle-trig', 'l5g-circle-angles', 'l4g-cylinder-cone', 'l5g-sphere-volume'], statistics: ['l5s-combinatorics-counting', 'l5s-independent-events', 'l5s-standard-deviation'] }
    },
    medium: {
      '10': U1,
      '11': { analysis: ['u3an-limits-asymptotes', 'u2an-derivative-def', 'u2an-derivative-rules'], trigonometry: ['u2t-radian-unit-circle', 'u2t-trig-equations', 'u2t-identities'], statistics: ['u2s-conditional-prob', 'u2s-random-variable', 'l6s-multistage'], algebra: ['u2a-matrices-systems', 'u2a-sequences', 'u2a-exponents-logs'], functions: ['u3f-continuity-ivt', 'u2f-composite-inverse', 'u2f-exponential-function'], geometry: ['u2g-dot-product', 'u2g-circle-equation', 'l6g-sine-cosine-law'] },
      '12': { analysis: ['u3an-antiderivative-integral', 'u3an-integration-techniques', 'u3an-area-volume'], algebra: ['u3a-complex', 'u3a-binomial-theorem', 'u3a-induction'], statistics: ['u3s-arrangements-combinations', 'u2s-binomial', 'u3s-normal'], functions: ['u2an-tangent-monotonicity', 'u3f-convexity', 'u3f-ln'], trigonometry: ['u3t-trig-functions-graphs', 'u3t-inverse-trig', 'u3t-harmonic-form', 'u3t-trig-calculus'], geometry: ['u3g-lines-planes-space', 'u3g-angles-space', 'u3g-pyramid-regular', 'l6g-composite-solids'] }
    },
    advanced: UNIVERSITY_PLAN
  },
  'GB-ENG': {
    beginner: {
      Y1: P1,
      Y2: P2,
      Y5: { arithmetic: ['p5a-decimals', 'p5a-fractions-equiv', 'p5a-percent-intro', 'p5a-primes-factors', 'p5a-roman'], geometry: ['p5g-angle-measure', 'p5g-quadrilaterals', 'p5g-reflection-translation'], measurement: ['p5m-area-rect-composite', 'p5m-volume-cubes', 'p5m-metric-imperial', 'p5m-perimeter-composite'] }
    },
    lower: {
      Y7: { algebra: ['l1a-letters', 'l2a-negative-ops', 'l1a-fraction-ops', 'l1a-decimal-ops'], geometry: ['l1g-perp-parallel-construct', 'l1g-area-perimeter', 'l1g-triangle-construct'], statistics: ['l1s-frequency-table', 'l1s-mean-range', 'l2s-probability-scale'] },
      Y8: { algebra: ['l2a-ratio', 'l2a-percent', 'l3a-expand-brackets', 'l2a-simple-equations'], geometry: ['l2g-angle-relations', 'l2g-triangle-sum', 'l2g-circle', 'l3g-prism-volume'], statistics: ['l2s-pie-chart', 'l2s-median-mode', 'l3s-two-way-tables'] },
      Y9: { algebra: ['l3a-linear-equations-both-sides', 'l3a-powers-roots', 'l4a-linear-function-graph', 'l4a-inequalities', 'l3a-proportional'], geometry: ['l3g-pythagoras', 'l4g-similarity-thales', 'l3g-congruence'], statistics: ['l3s-grouped-data', 'l3s-relative-frequency', 'l4s-tree-diagram', 'l4s-scatter'] }
    },
    medium: {
      Y11: { trigonometry: ['u0t-exact-values', 'u0t-3d-trig', 'l6g-sine-cosine-law'] },
      Y12: { analysis: ['u2an-derivative-def', 'u2an-derivative-rules', 'u2an-tangent-monotonicity', 'u3an-antiderivative-integral'], trigonometry: ['l6g-unit-circle', 'u2t-trig-equations', 'u2t-identities'], statistics: ['u1s-sampling', 'u2s-binomial', 'u3s-hypothesis-binomial'], algebra: ['u2a-second-degree', 'u1a-quadratic-inequality', 'u2a-exponents-logs'], functions: ['u2f-transformations', 'u1f-reference-functions', 'u2f-exponential-function'], geometry: ['u1g-line-equation', 'u2g-circle-equation', 'u1g-vectors-coords'] },
      Y13: { analysis: ['u3an-integration-techniques', 'u3an-area-volume', 'u3f-continuity-ivt', 'un4an-newton-numerics'], algebra: ['u2a-sequences', 'u3a-binomial-theorem', 'u1a-logic-reasoning'], statistics: ['u2s-conditional-prob', 'u3s-normal', 'u2s-random-variable'], functions: ['u2f-composite-inverse', 'u3f-ln', 'u3f-convexity'], trigonometry: ['u2t-radian-unit-circle', 'u3t-inverse-trig', 'u3t-harmonic-form', 'u3t-trig-calculus'], geometry: ['u3g-vectors-3d', 'u3g-lines-planes-space', 'u1g-vector-geometry-proofs'] }
    },
    advanced: { '1': UNIVERSITY_PLAN['1'], '2': UNIVERSITY_PLAN['2'], '3': UNIVERSITY_PLAN['3'] }
  },
  FR: {
    beginner: {
      CP: P1, CE1: P2, CE2: P3, CM1: P4,
      CM2: { arithmetic: ['p5a-decimals', 'p5a-fractions-equiv', 'p5a-percent-intro', 'p5a-proportionality'], geometry: ['p5g-angle-measure', 'p5g-quadrilaterals', 'p5g-reflection-translation'], measurement: ['p5m-area-rect-composite', 'p5m-volume-cubes', 'p5m-perimeter-composite'] }
    },
    lower: {
      '6e': { algebra: ['l1a-decimal-ops', 'l1a-fraction-ops', 'l1a-divisibility', 'l1a-letters'], geometry: ['l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-area-perimeter', 'l1g-solids-nets'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range'] },
      '4e': { algebra: ['l2a-negative-ops', 'l3a-powers-roots', 'l3a-expand-brackets', 'l3a-linear-equations-both-sides', 'l3a-proportional'], geometry: ['l3g-pythagoras', 'l3g-prism-volume', 'l4g-cylinder-cone'], statistics: ['l2s-median-mode', 'l3s-relative-frequency', 'l2s-probability-scale'] },
      '3e': { algebra: ['l4a-identities', 'l5a-quadratic-factor', 'l4a-linear-function-graph', 'l4a-inequalities'], geometry: ['l4g-similarity-thales', 'l4g-right-triangle-trig', 'l5g-sphere-volume'], statistics: ['l4s-tree-diagram', 'l3s-grouped-data', 'l5s-independent-events'] }
    },
    medium: {
      '2nde': U1,
      '1re': { functions: ['u2an-derivative-def', 'u2an-derivative-rules', 'u2an-tangent-monotonicity', 'u2f-exponential-function'], trigonometry: ['l6g-unit-circle', 'u2t-radian-unit-circle', 'u2t-trig-equations'], algebra: ['u2a-sequences', 'u2a-second-degree', 'l6a-polynomial-substitution'], geometry: ['u2g-dot-product', 'l6g-sine-cosine-law', 'u2g-circle-equation'], statistics: ['l6s-conditional-tables', 'u2s-conditional-prob', 'u2s-random-variable'] },
      terminale: { analysis: ['u3an-limits-asymptotes', 'u3an-antiderivative-integral', 'u3an-integration-techniques'], algebra: ['u3a-induction', 'u3a-binomial-theorem', 'u3a-complex'], statistics: ['u3s-arrangements-combinations', 'u2s-binomial', 'u3s-confidence-proportion'], functions: ['u3f-ln', 'u3f-continuity-ivt', 'u3f-convexity'], trigonometry: ['u2t-identities', 'u3t-trig-functions-graphs', 'u3t-trig-calculus'], geometry: ['u3g-lines-planes-space', 'u3g-vectors-3d', 'u3g-angles-space'] }
    },
    advanced: UNIVERSITY_PLAN
  },
  DE: {
    beginner: {
      '1': { arithmetic: ['p1a-numbers-20', 'p1a-addsub-20', 'p1a-word'], geometry: P1.geometry, measurement: P1.measurement },
      '2': { arithmetic: ['p2a-place-100', 'p2a-addsub-100', 'p2a-mult-2-5-10'], geometry: P2.geometry, measurement: P2.measurement },
      '3': P3,
      '4': { arithmetic: ['p4a-place-big', 'p4a-written-mult', 'p4a-long-division'], geometry: P4.geometry, measurement: P4.measurement }
    },
    lower: {
      '5': { algebra: ['l1a-big-numbers-rounding', 'l1a-divisibility', 'l1a-letters'], geometry: ['l1g-perp-parallel-construct', 'l1g-area-perimeter', 'l1g-solids-nets'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range'] },
      '6': { algebra: ['l1a-fraction-ops', 'l1a-decimal-ops', 'l2a-ratio'], geometry: ['l2g-symmetry-central', 'l1g-triangle-construct', 'l2g-angle-relations'], statistics: ['l2s-median-mode', 'l2s-pie-chart', 'l2s-probability-scale'] },
      '7': { algebra: ['l2a-negative-ops', 'l2a-percent', 'l3a-proportional', 'l3a-expand-brackets', 'l2a-simple-equations'], geometry: ['l2g-triangle-sum', 'l3g-congruence', 'l3g-quadrilateral'], statistics: ['l3s-relative-frequency', 'l3s-grouped-data', 'l3s-two-way-tables'] },
      '8': { algebra: ['l3a-linear-equations-both-sides', 'l4a-identities', 'l4a-linear-function-graph', 'l4a-systems-2x2'], geometry: ['l2g-circle', 'l3g-prism-volume', 'l4g-cylinder-cone'], statistics: ['l4s-tree-diagram', 'l4s-quartiles-boxplot', 'l4s-scatter'] },
      '9': { algebra: ['l3a-powers-roots', 'l5a-irrational-radicals', 'l5a-quadratic-factor', 'l5a-quadratic-formula', 'l5a-functions-quadratic-graph'], geometry: ['l3g-pythagoras', 'l4g-similarity-thales', 'l4g-right-triangle-trig'], statistics: ['l5s-combinatorics-counting', 'l5s-independent-events', 'l6s-multistage'] },
      '10': { algebra: ['l6a-exponential-growth', 'l6a-quadratic-scheitel', 'l6a-polynomial-substitution'], geometry: ['l6g-sine-cosine-law', 'l6g-unit-circle', 'l5g-sphere-volume', 'l6g-composite-solids'], statistics: ['l6s-conditional-tables', 'l5s-standard-deviation', 'l6s-binomial-intro'] }
    },
    medium: {
      '11': U1,
      '12': { analysis: ['u2an-derivative-def', 'u2an-derivative-rules', 'u2an-tangent-monotonicity'], trigonometry: ['u2t-radian-unit-circle', 'u2t-trig-equations', 'u2t-identities'], statistics: ['u2s-conditional-prob', 'u2s-random-variable', 'u2s-binomial'], algebra: ['u2a-matrices-systems', 'u2a-exponents-logs', 'u2a-sequences'], functions: ['u2f-exponential-function', 'u2f-transformations', 'u2f-composite-inverse'], geometry: ['u2g-dot-product', 'u3g-lines-planes-space', 'u2g-circle-equation'] },
      '13': { analysis: ['u3an-antiderivative-integral', 'u3an-integration-techniques', 'u3an-area-volume', 'u3an-limits-asymptotes'], algebra: ['u3a-binomial-theorem', 'u3a-induction', 'u3a-complex'], statistics: ['u3s-normal', 'u3s-hypothesis-binomial', 'u3s-confidence-proportion'], functions: ['u3f-ln', 'u3f-convexity', 'u3f-continuity-ivt'], trigonometry: ['u3t-trig-functions-graphs', 'u3t-harmonic-form', 'u3t-trig-calculus'], geometry: ['u3g-vectors-3d', 'u3g-angles-space', 'u3g-pyramid-regular'] }
    },
    advanced: UNIVERSITY_PLAN
  }
});

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  if (stage === 'advanced') {
    const n = Number(g);
    if (country === 'GB-ENG') return 'BSc Mathematics, Year ' + g;
    if (country === 'FR') return n <= 3 ? 'Licence de mathématiques, L' + g : 'Master de mathématiques, M1';
    if (country === 'DE') return n <= 3 ? 'Bachelor Mathematik, anul ' + g : 'Master Mathematik, anul 1';
    return n <= 3 ? 'Licență în Matematică, anul ' + g : 'Master în Matematică, anul 1';
  }
  if (country === 'MD') return g === '1' ? 'Clasa I' : 'Clasa a ' + ROMAN[Number(g)] + '-a';
  if (country === 'GB-ENG') return 'Year ' + g.replace(/^Y/, '');
  if (country === 'DE') return 'Klasse ' + g;
  return { CP: 'CP', CE1: 'CE1', CE2: 'CE2', CM1: 'CM1', CM2: 'CM2', '6e': '6e', '4e': '4e', '3e': '3e', '2nde': 'Seconde', '1re': 'Première', terminale: 'Terminale' }[g] || g;
}

function frenchCycle(grade) {
  if (['CP', 'CE1', 'CE2'].includes(grade)) return 'cycle 2';
  if (['CM1', 'CM2', '6e'].includes(grade)) return 'cycle 3';
  if (['5e', '4e', '3e'].includes(grade)) return 'cycle 4';
  return 'lycée général';
}

function englandKeyStage(grade) {
  const n = Number(String(grade).replace(/^Y/, ''));
  return n <= 2 ? 'Key Stage 1' : n <= 6 ? 'Key Stage 2' : n <= 9 ? 'Key Stage 3' : n <= 11 ? 'Key Stage 4 (GCSE)' : 'Key Stage 5 (A level)';
}

function sourceFor(country, stage, grade) {
  if (stage === 'advanced') return country === 'GB-ENG' ? BATCH2_MATH_SOURCES['GB-ENG'].university : BATCH2_MATH_SOURCES.university;
  if (country === 'GB-ENG') {
    const n = Number(String(grade).replace(/^Y/, ''));
    return n >= 12 ? BATCH2_MATH_SOURCES['GB-ENG'].alevel : n >= 10 ? BATCH2_MATH_SOURCES['GB-ENG'].gcse : BATCH2_MATH_SOURCES['GB-ENG'].school;
  }
  return BATCH2_MATH_SOURCES[country];
}

export function batch2CurriculumFrame(country, stage, grade) {
  const label = gradeLabel(country, stage, grade);
  const tail = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';
  if (stage === 'advanced') {
    const what = country === 'GB-ENG'
      ? 'raportată la QAA Subject Benchmark Statement — Mathematics, Statistics and Operational Research (2023)'
      : country === 'FR' ? 'raportată la structura națională Licence/Master (LMD, Bologna)'
      : country === 'DE' ? 'raportată la structura Bachelor/Master (Bologna) a programelor germane de Mathematik'
      : 'raportată la structura Licență/Master (Bologna) din Republica Moldova';
    return ({ MD: 'Republica Moldova', 'GB-ENG': 'Anglia', FR: 'Franța', DE: 'Germania' })[country] + ', ' + label + '. Sinteză universitară ' + what + '; fișele disciplinelor diferă între universități.' + tail;
  }
  if (country === 'MD') {
    const level = stage === 'beginner' ? 'învățământ primar' : stage === 'lower' ? 'gimnaziu' : 'liceu (profil real; profilul umanist are un program redus)';
    return 'Republica Moldova, ' + label + ' (' + level + '). Corelare tematică cu Curriculumul național la Matematică publicat de Ministerul Educației și Cercetării al Republicii Moldova (nu cu programele din România); manualele școlare nu au fost verificate capitol cu capitol.' + tail;
  }
  if (country === 'GB-ENG') {
    const ks = englandKeyStage(grade);
    const doc = ks.startsWith('Key Stage 5') ? 'conținutul DfE pentru AS și A level Mathematics (DFE-00706-2014)'
      : ks.startsWith('Key Stage 4') ? 'conținutul DfE pentru GCSE Mathematics (Higher/Foundation)'
      : 'programul statutar DfE „Mathematics programmes of study” (2013)';
    return 'Anglia, ' + label + ', ' + ks + '. Corelare tematică cu ' + doc + '; ordinea lecțiilor din școală poate diferi.' + tail;
  }
  if (country === 'FR') {
    return 'Franța, ' + label + ' (' + frenchCycle(String(grade)) + '). Corelare tematică cu programele de matematică publicate pe Éduscol; programele sunt reînnoite etapizat, de aceea se verifică versiunea în vigoare pentru clasa și cohorta elevului.' + tail;
  }
  const level = stage === 'beginner' ? 'Grundschule' : stage === 'lower' ? 'Sekundarstufe I' : 'Sekundarstufe II / Abitur';
  return 'Germania, ' + label + ' (' + level + '). Corelare tematică cu standardele educaționale KMK pentru Matematică; planul anual concret depinde de land, tipul de școală și nivelul de curs (Grund-/Leistungskurs).' + tail;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 2 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b2', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    curriculumFrame: batch2CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch2MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH2_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch2MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH2_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) {
          out.push(...batch2MathLessons({ country, stage, grade, topic }));
        }
      }
    }
  }
  return out;
}

export function batch2PackTextbooks(country, stage, grade) {
  const label = gradeLabel(country, stage, grade);
  const url = sourceFor(country, stage, String(grade));
  const ro = ({
    MD: 'Curriculumul național RM (MEC) · ' + label,
    'GB-ENG': 'DfE / QAA reference · ' + label,
    FR: 'Programmes Éduscol · ' + label,
    DE: 'KMK Bildungsstandards · ' + label
  })[country];
  return [{ id: 'b2-' + country.toLowerCase() + '-' + stage + '-' + String(grade).toLowerCase(), labelRo: ro, labelEn: ro, url }];
}
