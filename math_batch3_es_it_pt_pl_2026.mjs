// Batch 3 of the 50-country Mathematics completion board (2026/27):
// Spain (ES), Italy (IT), Portugal (PT), Poland (PL) — Grade 1 → university.
// Maps original concept lessons (Batch 2 shared banks + math_batch3_bank_2026.mjs)
// onto each national school year and topic branch. Native year courses stay in
// place (Spain/Italy focal lessons lead their branches; Portugal 5.º–6.º and
// Poland klasa IV keep their dedicated inline courses).
// Imported ONLY by curriculum_pack_catalog.mjs -> ./public/packs/ (0 KB in Worker JS).
// Lessons are original explanations, thematically aligned with the national
// frameworks cited below; they do NOT reproduce textbooks and do NOT claim
// certified full annual coverage.

import { B2_PRIMARY_BANK } from './math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from './math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from './math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from './math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';

export const BATCH3_MATH_COUNTRIES = Object.freeze(['ES', 'IT', 'PT', 'PL']);

export const BATCH3_MATH_SOURCES = Object.freeze({
  ES: {
    beginner: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296',
    lower: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-4975',
    medium: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-5521'
  },
  IT: {
    beginner: 'https://www.gazzettaufficiale.it/eli/id/2026/01/27/26G00021/sg',
    lower: 'https://www.gazzettaufficiale.it/eli/id/2026/01/27/26G00021/sg',
    medium: 'https://www.indire.it/lucabas/lkmw_file/licei2010/indicazioni_nuovo_impaginato/_decreto_indicazioni_nazionali.pdf'
  },
  PT: {
    beginner: 'https://www.dge.mec.pt/matematica',
    lower: 'https://www.dge.mec.pt/matematica',
    medium: {
      '10': 'https://www.dge.mec.pt/sites/default/files/es_10_matematica_a.pdf',
      '11': 'https://www.dge.mec.pt/sites/default/files/es_11_matematica_a.pdf',
      '12': 'https://www.dge.mec.pt/sites/default/files/es_12_matematica_a.pdf'
    }
  },
  PL: {
    beginner: 'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane',
    lower: 'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane',
    medium: 'https://cke.gov.pl/images/_EGZAMIN_EKSTERNISTYCZNY/Szkola_branzowa_II/podstawa_programowa_2024/matematyka.pdf'
  },
  university: 'https://ehea.info/'
});

const CONCEPTS = Object.freeze({
  ...B2_PRIMARY_BANK,
  ...B2_LOWER_BANK,
  ...B2_UPPER_BANK,
  ...B2_UNIVERSITY_BANK,
  ...B3_EXTRA_BANK
});

const CURRENCY = Object.freeze({ ES: 'euro', IT: 'euro', PT: 'euro', PL: 'zloți' });

const UNIT_TITLES = Object.freeze({
  ES: { arithmetic: 'Sentido numérico', geometry: 'Sentido espacial', measurement: 'Sentido de la medida',
    algebra: 'Sentido algebraico', statistics: 'Sentido estocástico', functions: 'Funciones',
    trigonometry: 'Trigonometría', analysis: 'Análisis', 'linear-algebra': 'Álgebra lineal',
    discrete: 'Matemática discreta', differential: 'Ecuaciones diferenciales' },
  IT: { arithmetic: 'Numeri', geometry: 'Spazio e figure', measurement: 'Misure',
    algebra: 'Aritmetica e algebra', statistics: 'Dati e previsioni', functions: 'Relazioni e funzioni',
    trigonometry: 'Goniometria e trigonometria', analysis: 'Analisi matematica', 'linear-algebra': 'Algebra lineare',
    discrete: 'Matematica discreta', differential: 'Equazioni differenziali' },
  PT: { arithmetic: 'Números e operações', geometry: 'Geometria e medida', measurement: 'Medida',
    algebra: 'Álgebra', statistics: 'Dados e probabilidades', functions: 'Funções',
    trigonometry: 'Trigonometria', analysis: 'Análise', 'linear-algebra': 'Álgebra linear',
    discrete: 'Matemática discreta', differential: 'Equações diferenciais' },
  PL: { arithmetic: 'Liczby i działania', geometry: 'Geometria', measurement: 'Mierzenie',
    algebra: 'Wyrażenia algebraiczne i równania', statistics: 'Statystyka i prawdopodobieństwo', functions: 'Funkcje',
    trigonometry: 'Trygonometria', analysis: 'Rachunek różniczkowy', 'linear-algebra': 'Algebra liniowa',
    discrete: 'Matematyka dyskretna', differential: 'Równania różniczkowe' }
});

// Shared university core (module order differs between institutions).
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
const P5_GEO_MEAS = { geometry: ['p5g-angle-measure', 'p5g-quadrilaterals', 'p5g-reflection-translation'], measurement: ['p5m-area-rect-composite', 'p5m-volume-cubes', 'p5m-perimeter-composite'] };

// Parallel alternatives within one school year (a learner follows only one of
// them), so they may share concepts. Every other concept is used once per country.
export const BATCH3_PARALLEL_TRACKS = Object.freeze({
  ES: [['ESO4-A', 'ESO4-B'], ['B1-CYT', 'B1-HCS', 'B1-GEN'], ['B2-CYT', 'B2-HCS']]
});

// (country -> stage -> grade -> topic -> concept keys). Stage keys are the
// school-matrix stages (beginner / lower / medium / advanced).
export const BATCH3_MATH_PLAN = Object.freeze({
  ES: {
    beginner: {
      P1, P2, P3, P4,
      P5: { arithmetic: ['p5a-decimals', 'p5a-fractions-equiv', 'p5a-percent-intro', 'p5a-primes-factors', 'p5a-roman'], ...P5_GEO_MEAS },
      P6: { arithmetic: ['b3p6a-integers', 'b3p6a-powers-squares', 'p5a-proportionality'], geometry: ['b3p6g-polygons-coords', 'l2g-circle', 'l1g-solids-nets'], statistics: ['b3p6s-surveys', 'l1s-mean-range', 'l2s-probability-scale'] }
    },
    lower: {
      ESO1: { algebra: ['l1a-divisibility', 'l2a-negative-ops', 'l1a-fraction-ops', 'l1a-letters'], geometry: ['l2g-angle-relations', 'l2g-triangle-sum', 'l1g-area-perimeter'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l2s-median-mode'] },
      ESO2: { algebra: ['l2a-ratio', 'l2a-percent', 'l3a-proportional', 'l2a-simple-equations', 'l3a-expand-brackets'], geometry: ['l3g-pythagoras', 'l4g-similarity-thales', 'l3g-prism-volume'], statistics: ['l2s-pie-chart', 'l3s-relative-frequency', 'l3s-grouped-data'] },
      ESO3: { algebra: ['l3a-powers-roots', 'l4a-identities', 'l3a-linear-equations-both-sides', 'l4a-systems-2x2', 'l5a-quadratic-formula'], geometry: ['l2g-symmetry-central', 'l4g-cylinder-cone', 'l5g-sphere-volume'], statistics: ['l4s-quartiles-boxplot', 'l4s-tree-diagram', 'l3s-two-way-tables'] },
      'ESO4-A': { algebra: ['l4a-linear-function-graph', 'l4a-inequalities', 'l6a-exponential-growth', 'l5a-quadratic-factor'], geometry: ['l4g-right-triangle-trig', 'l6g-composite-solids', 'l3g-quadrilateral'], statistics: ['l4s-scatter', 'l5s-combinatorics-counting', 'l5s-standard-deviation'] },
      'ESO4-B': { algebra: ['l5a-irrational-radicals', 'l6a-polynomial-substitution', 'l5a-functions-quadratic-graph', 'l4a-inequalities'], geometry: ['l4g-right-triangle-trig', 'l6g-unit-circle', 'l5g-vectors-intro'], statistics: ['l5s-combinatorics-counting', 'l5s-independent-events', 'l6s-conditional-tables'] }
    },
    medium: {
      'B1-CYT': { algebra: ['u1a-sets-intervals-abs', 'u2a-second-degree', 'b3s-poly-division', 'u2a-exponents-logs'], functions: ['u1f-function-def-domain', 'u2f-composite-inverse', 'u3an-limits-asymptotes', 'u2an-derivative-def'], geometry: ['u2t-identities', 'u1g-vectors-coords', 'u2g-dot-product', 'b3s-distance-line', 'b3s-conics'], statistics: ['b3s-regression', 'u1s-probability-model', 'u1s-dispersion-weighted'] },
      'B1-HCS': { algebra: ['u1a-sets-intervals-abs', 'b3s-finance-annuity', 'u2a-exponents-logs', 'u1a-quadratic-inequality'], functions: ['u1f-function-def-domain', 'b3s-homographic', 'u3an-limits-asymptotes', 'u2an-derivative-def'], geometry: ['u1g-line-equation', 'u1g-vectors-coords', 'b3s-isometries'], statistics: ['b3s-regression', 'u1s-probability-model', 'u1s-dispersion-weighted'] },
      'B1-GEN': { algebra: ['b3s-finance-annuity', 'b3s-hondt', 'u1a-logic-reasoning'], functions: ['u1f-reference-functions', 'u2f-transformations', 'u2f-exponential-function'], geometry: ['b3s-graphs-school', 'b3s-isometries', 'u1g-line-equation'], statistics: ['u1s-sampling', 'b3s-regression', 'u1s-dispersion-weighted'] },
      'B2-CYT': { analysis: ['b3s-rolle-lagrange-lhopital', 'u3an-antiderivative-integral', 'u3an-integration-techniques', 'u3an-area-volume'], functions: ['u3f-continuity-ivt', 'u2an-tangent-monotonicity', 'b3s-function-study'], algebra: ['u2a-matrices-systems', 'b3s-matrix-inverse', 'b3s-rouche-systems'], geometry: ['u3g-lines-planes-space', 'u3g-vectors-3d', 'b3s-vectors-space-cross'], statistics: ['u2s-conditional-prob', 'u2s-binomial', 'u3s-normal', 'b3s-normal-binomial-approx'] },
      'B2-HCS': { analysis: ['u2an-derivative-rules', 'u3an-antiderivative-integral', 'u3an-area-volume'], functions: ['u3f-continuity-ivt', 'u2an-tangent-monotonicity', 'b3s-function-study'], algebra: ['u2a-matrices-systems', 'b3s-matrix-inverse', 'b3s-linear-programming'], geometry: ['u3g-lines-planes-space', 'u3g-vectors-3d', 'b3s-vectors-space-cross'], statistics: ['u2s-conditional-prob', 'b3s-normal-binomial-approx', 'b3s-confidence-mean', 'u3s-confidence-proportion'] }
    },
    advanced: UNIVERSITY_PLAN
  },
  IT: {
    beginner: {
      P1, P2, P3, P4,
      P5: { arithmetic: ['p5a-decimals', 'p5a-fractions-equiv', 'p5a-percent-intro', 'p5a-primes-factors', 'p5a-roman'], ...P5_GEO_MEAS }
    },
    lower: {
      M1: { algebra: ['l1a-big-numbers-rounding', 'l1a-divisibility', 'l1a-fraction-ops', 'l1a-decimal-ops'], geometry: ['l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l2g-angle-relations'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range'] },
      M2: { algebra: ['l2a-ratio', 'l2a-percent', 'l3a-proportional', 'l3a-powers-roots'], geometry: ['l1g-area-perimeter', 'l3g-pythagoras', 'l4g-similarity-thales'], statistics: ['l2s-median-mode', 'l2s-pie-chart', 'l2s-probability-scale'] },
      M3: { algebra: ['l2a-negative-ops', 'l3a-expand-brackets', 'l3a-linear-equations-both-sides', 'l4a-linear-function-graph'], geometry: ['l2g-circle', 'l3g-prism-volume', 'l4g-cylinder-cone', 'l5g-sphere-volume'], statistics: ['l3s-relative-frequency', 'l3s-grouped-data', 'l4s-tree-diagram'] }
    },
    medium: {
      S1: { algebra: ['u1a-sets-intervals-abs', 'l4a-identities', 'b3s-poly-division', 'u1a-logic-reasoning'], functions: ['u1f-function-def-domain', 'u1f-reference-functions', 'l4a-inequalities'], geometry: ['l3g-congruence', 'l3g-quadrilateral', 'l2g-symmetry-central'], statistics: ['l3s-two-way-tables', 'l4s-quartiles-boxplot', 'l5s-standard-deviation'] },
      S2: { algebra: ['l4a-systems-2x2', 'l5a-irrational-radicals', 'l5a-quadratic-formula', 'u1a-quadratic-inequality'], functions: ['l5a-functions-quadratic-graph', 'u1f-variation-extrema', 'b3s-abs-rational-ineq'], geometry: ['u1g-line-equation', 'l5g-circle-angles', 'b3s-cyclic-power-point', 'u1g-vectors-coords'], statistics: ['u1s-probability-model', 'l5s-independent-events', 'l4s-scatter'] },
      S3: { algebra: ['u2a-second-degree', 'u2a-sequences', 'l6a-polynomial-substitution'], functions: ['u2f-transformations', 'b3s-homographic', 'u2f-composite-inverse'], trigonometry: ['l6g-unit-circle', 'u2t-radian-unit-circle', 'u2t-identities'], geometry: ['u2g-circle-equation', 'b3s-conics', 'b3s-distance-line'], statistics: ['u1s-dispersion-weighted', 'b3s-regression', 'l5s-combinatorics-counting'] },
      S4: { analysis: ['b3s-sequence-limits', 'u3an-limits-asymptotes', 'u3f-continuity-ivt'], trigonometry: ['u2t-trig-equations', 'l6g-sine-cosine-law', 'b3s-heron-radii'], statistics: ['u3s-arrangements-combinations', 'u3a-binomial-theorem', 'u2s-conditional-prob'], algebra: ['u2a-exponents-logs', 'b3s-log-models', 'u3a-complex'], functions: ['u2f-exponential-function', 'u3f-ln', 'b3s-recurrence'], geometry: ['u3g-lines-planes-space', 'u3g-angles-space', 'b3s-isometries', 'u3g-pyramid-regular'] },
      S5: { analysis: ['u2an-derivative-def', 'u2an-derivative-rules', 'b3s-rolle-lagrange-lhopital', 'u3an-antiderivative-integral', 'u3an-integration-techniques', 'b3s-integral-riemann'], algebra: ['u3a-induction', 'b3s-counting-repetition', 'b3s-complex-roots'], statistics: ['u2s-random-variable', 'u2s-binomial', 'u3s-normal', 'b3s-geometric-probability'], functions: ['b3s-function-study', 'u2an-tangent-monotonicity', 'u3f-convexity', 'b3s-diff-eq-school'], trigonometry: ['u3t-trig-calculus', 'u3t-trig-functions-graphs', 'u3t-inverse-trig'], geometry: ['u3g-vectors-3d', 'b3s-vectors-space-cross', 'b3s-solids-similar', 'u3an-area-volume'] }
    },
    advanced: UNIVERSITY_PLAN
  },
  PT: {
    beginner: { '1': P1, '2': P2, '3': P3, '4': P4 },
    lower: {
      '7': { algebra: ['l2a-negative-ops', 'l3a-powers-roots', 'l2a-simple-equations', 'l3a-proportional'], geometry: ['l2g-triangle-sum', 'l3g-quadrilateral', 'l4g-similarity-thales'], statistics: ['l2s-median-mode', 'l3s-grouped-data', 'l3s-relative-frequency'] },
      '8': { algebra: ['l3a-expand-brackets', 'l4a-identities', 'l3a-linear-equations-both-sides', 'l4a-linear-function-graph', 'l4a-systems-2x2'], geometry: ['l3g-pythagoras', 'l2g-symmetry-central', 'l3g-prism-volume'], statistics: ['l4s-quartiles-boxplot', 'l4s-scatter', 'l3s-two-way-tables'] },
      '9': { algebra: ['l4a-inequalities', 'l5a-irrational-radicals', 'l5a-quadratic-factor', 'l5a-quadratic-formula'], geometry: ['l4g-right-triangle-trig', 'l5g-circle-angles', 'l4g-cylinder-cone', 'l5g-sphere-volume'], statistics: ['l4s-tree-diagram', 'l5s-independent-events', 'l2s-probability-scale'] }
    },
    medium: {
      '10': { algebra: ['b3s-hondt', 'b3s-finance-annuity', 'u1a-sets-intervals-abs'], functions: ['u1f-function-def-domain', 'u1f-variation-extrema', 'u1f-reference-functions'], geometry: ['u1g-vectors-coords', 'u1g-line-equation', 'u1g-vector-geometry-proofs'], statistics: ['u1s-dispersion-weighted', 'b3s-regression', 'l5s-standard-deviation'] },
      '11': { functions: ['u2an-derivative-def', 'u2an-derivative-rules', 'b3s-homographic', 'u3an-limits-asymptotes'], trigonometry: ['u2t-radian-unit-circle', 'u2t-trig-equations', 'u2t-identities'], algebra: ['u2a-sequences', 'b3s-recurrence', 'b3s-sequence-limits'], geometry: ['u2g-dot-product', 'u2g-circle-equation', 'u3g-lines-planes-space'], statistics: ['l5s-combinatorics-counting', 'u3s-arrangements-combinations', 'u3a-binomial-theorem'] },
      '12': { analysis: ['u3f-continuity-ivt', 'u2an-tangent-monotonicity', 'u3an-antiderivative-integral', 'b3s-integral-riemann'], algebra: ['u3a-complex', 'b3s-complex-roots', 'u2a-matrices-systems', 'b3s-matrix-inverse'], statistics: ['u2s-conditional-prob', 'u2s-binomial', 'u3s-normal', 'b3s-confidence-mean'], functions: ['u2f-exponential-function', 'u2a-exponents-logs', 'u3f-ln', 'u3f-convexity', 'b3s-function-study'], trigonometry: ['u3t-trig-functions-graphs', 'u3t-trig-calculus', 'u3t-harmonic-form'], geometry: ['u3g-vectors-3d', 'u3g-angles-space', 'b3s-solids-similar'] }
    },
    advanced: UNIVERSITY_PLAN
  },
  PL: {
    beginner: { I: P1, II: P2, III: P3 },
    lower: {
      V: { algebra: ['l1a-fraction-ops', 'l1a-decimal-ops', 'l1a-divisibility', 'l1a-big-numbers-rounding'], geometry: ['l1g-triangle-construct', 'l2g-triangle-sum', 'l1g-area-perimeter'], statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range'] },
      VI: { algebra: ['l2a-negative-ops', 'l1a-letters', 'l2a-simple-equations', 'l2a-ratio'], geometry: ['l2g-angle-relations', 'l1g-solids-nets', 'l3g-prism-volume', 'l3g-quadrilateral'], statistics: ['l2s-median-mode', 'l2s-pie-chart', 'l2s-probability-scale'] },
      VII: { algebra: ['l2a-percent', 'l3a-powers-roots', 'l3a-expand-brackets', 'l3a-linear-equations-both-sides', 'l3a-proportional'], geometry: ['l3g-pythagoras', 'l3g-congruence', 'l2g-symmetry-central'], statistics: ['l3s-grouped-data', 'l3s-relative-frequency', 'l3s-two-way-tables'] },
      VIII: { algebra: ['l4a-identities', 'l4a-linear-function-graph', 'l4a-systems-2x2', 'l5a-irrational-radicals'], geometry: ['l2g-circle', 'l4g-similarity-thales', 'l5g-sphere-volume'], statistics: ['l4s-tree-diagram', 'l5s-combinatorics-counting', 'l4s-quartiles-boxplot'] }
    },
    medium: {
      L1: { algebra: ['u1a-sets-intervals-abs', 'u2a-exponents-logs', 'b3s-finance-annuity', 'l4a-inequalities'], functions: ['u1f-function-def-domain', 'u1f-reference-functions', 'u1f-variation-extrema'], geometry: ['l4g-right-triangle-trig', 'l5g-circle-angles', 'b3s-triangle-centres'], statistics: ['u1s-dispersion-weighted', 'l5s-standard-deviation', 'l4s-scatter'] },
      L2: { functions: ['l5a-functions-quadratic-graph', 'l6a-quadratic-scheitel', 'b3s-optimization-quadratic'], trigonometry: ['u0t-exact-values', 'l6g-unit-circle', 'l6g-sine-cosine-law'], algebra: ['l5a-quadratic-formula', 'u1a-quadratic-inequality', 'b3s-poly-division', 'l6a-polynomial-substitution'], geometry: ['u1g-line-equation', 'b3s-distance-line', 'u2g-circle-equation'], statistics: ['l5s-independent-events', 'u1s-probability-model', 'l6s-multistage'] },
      L3: { analysis: ['b3s-sequence-limits', 'u3an-limits-asymptotes', 'u3f-continuity-ivt'], trigonometry: ['u2t-radian-unit-circle', 'u2t-identities', 'u2t-trig-equations'], statistics: ['u3s-arrangements-combinations', 'b3s-counting-repetition', 'u3a-binomial-theorem'], algebra: ['u2a-sequences', 'b3s-abs-rational-ineq', 'b3s-recurrence'], functions: ['b3s-homographic', 'u2f-composite-inverse', 'u2f-transformations'], geometry: ['b3s-isometries', 'b3s-cyclic-power-point', 'u1g-vectors-coords'] },
      L4: { analysis: ['u2an-derivative-def', 'u2an-derivative-rules', 'u2an-tangent-monotonicity'], algebra: ['u3a-induction', 'l6a-exponential-growth', 'u1a-logic-reasoning'], statistics: ['u2s-conditional-prob', 'u2s-binomial', 'u2s-random-variable', 'b3s-geometric-probability'], functions: ['u2f-exponential-function', 'b3s-log-models', 'b3s-function-study'], trigonometry: ['u0t-3d-trig', 'u3t-trig-functions-graphs', 'b3s-heron-radii'], geometry: ['u3g-angles-space', 'u3g-pyramid-regular', 'b3s-solids-similar', 'l6g-composite-solids'] }
    },
    advanced: UNIVERSITY_PLAN
  }
});

const CLIENT_STAGE = Object.freeze({ beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' });

const ES_LABELS = Object.freeze({
  P1: '1º de Educación Primaria', P2: '2º de Educación Primaria', P3: '3º de Educación Primaria',
  P4: '4º de Educación Primaria', P5: '5º de Educación Primaria', P6: '6º de Educación Primaria',
  ESO1: '1º ESO', ESO2: '2º ESO', ESO3: '3º ESO', 'ESO4-A': '4º ESO · Matemáticas A', 'ESO4-B': '4º ESO · Matemáticas B',
  'B1-CYT': '1º Bachillerato · Matemáticas I', 'B1-HCS': '1º Bachillerato · Matemáticas Aplicadas a las CC.SS. I',
  'B1-GEN': '1º Bachillerato · Matemáticas Generales', 'B2-CYT': '2º Bachillerato · Matemáticas II',
  'B2-HCS': '2º Bachillerato · Matemáticas Aplicadas a las CC.SS. II'
});

function gradeLabel(country, stage, grade) {
  const g = String(grade);
  if (stage === 'advanced') {
    const n = Number(g);
    if (country === 'ES') return 'Grado en Matemáticas, curso ' + g;
    if (country === 'IT') return n <= 3 ? 'Laurea triennale in Matematica (L-35), anno ' + g : 'Laurea magistrale in Matematica (LM-40), anno 1';
    if (country === 'PT') return n <= 3 ? 'Licenciatura em Matemática, ' + g + '.º ano' : 'Mestrado em Matemática, 1.º ano';
    return n <= 3 ? 'Studia I stopnia (licencjat) z matematyki, rok ' + g : 'Studia II stopnia (magisterskie) z matematyki, rok 1';
  }
  if (country === 'ES') return ES_LABELS[g] || g;
  if (country === 'IT') {
    if (/^P\d$/.test(g)) return 'classe ' + g.slice(1) + 'ª della scuola primaria';
    if (/^M\d$/.test(g)) return 'classe ' + g.slice(1) + 'ª della secondaria di I grado';
    return g.slice(1) + 'º anno della secondaria di II grado';
  }
  if (country === 'PT') return g + '.º ano';
  if (/^L\d$/.test(g)) return 'liceum, klasa ' + g.slice(1);
  return 'klasa ' + g;
}

function sourceFor(country, stage, grade) {
  if (stage === 'advanced') return BATCH3_MATH_SOURCES.university;
  const s = BATCH3_MATH_SOURCES[country][stage];
  return typeof s === 'string' ? s : s[String(grade)];
}

export function batch3CurriculumFrame(country, stage, grade) {
  const label = gradeLabel(country, stage, grade);
  const tail = ' Lecție originală (explicație, exemplu rezolvat, exerciții și răspunsuri); nu reproduce un manual, iar acoperirea integrală a programei anuale nu este certificată.';
  const name = ({ ES: 'Spania', IT: 'Italia', PT: 'Portugalia', PL: 'Polonia' })[country];
  if (stage === 'advanced') {
    const what = country === 'ES' ? 'raportată la structura Grado/Máster din Spațiul European al Învățământului Superior (Bologna)'
      : country === 'IT' ? 'raportată la clasele de laurea L-35 (Scienze matematiche) și LM-40 (Matematica)'
      : country === 'PT' ? 'raportată la structura Licenciatura/Mestrado (Bologna) a programelor portugheze de Matemática'
      : 'raportată la structura studiilor de licență și master (Bologna) a programelor poloneze de matematică';
    return name + ', ' + label + '. Sinteză universitară ' + what + '; fișele disciplinelor diferă între universități.' + tail;
  }
  if (country === 'ES') {
    const rd = stage === 'beginner' ? 'Real Decreto 157/2022 (Educación Primaria)' : stage === 'lower' ? 'Real Decreto 217/2022 (ESO)' : 'Real Decreto 243/2022 (Bachillerato)';
    return name + ', ' + label + '. Corelare tematică cu ' + rd + ' (LOMLOE); repartizarea concretă pe ani este stabilită de fiecare comunitate autonomă.' + tail;
  }
  if (country === 'IT') {
    if (stage === 'medium') return name + ', ' + label + '. Corelare tematică cu Indicazioni Nazionali pentru licee (DM 211/2010); conținutul și numărul de ore diferă după tipul de liceu (de exemplu, liceo scientifico față de celelalte licee).' + tail;
    return name + ', ' + label + '. Corelare tematică cu Indicazioni Nazionali pentru primul ciclu: noile indicații (DM 221/2025) se aplică treptat din 2026/27, începând cu clasa întâi primară și clasa întâi gimnazială; celelalte cohorte urmează încă indicațiile anterioare.' + tail;
  }
  if (country === 'PT') {
    if (stage === 'medium') return name + ', ' + label + ' (ensino secundário, Matemática A). Corelare tematică cu noile Aprendizagens Essenciais de Matemática A (DGE), aplicate la 10.º ano din 2024/25, la 11.º din 2025/26 și la 12.º din 2026/27; la 12.º, fiecare clasă studiază cel puțin una dintre temele opționale: inferență statistică, primitive și integrale sau matrice.' + tail;
    const cycle = stage === 'beginner' ? '1.º ciclo do ensino básico' : '3.º ciclo do ensino básico';
    return name + ', ' + label + ' (' + cycle + '). Corelare tematică cu Aprendizagens Essenciais de Matemática pentru ensino básico (DGE).' + tail;
  }
  if (stage === 'beginner') return name + ', ' + label + '. În clasele I–III, matematica face parte din educația integrată (edukacja wczesnoszkolna); noua podstawa programowa se aplică din 2026/27 întâi în clasa I, celelalte cohorte urmând programa anterioară.' + tail;
  if (stage === 'lower') return name + ', ' + label + '. Corelare tematică cu podstawa programowa pentru școala primară (matematica este disciplină separată din clasa IV); noua programă din 2026/27 începe în clasa IV și nu se aplică automat celorlalte cohorte.' + tail;
  return name + ', ' + label + '. Corelare tematică cu podstawa programowa pentru liceu (versiunea modificată în 2024, Dz.U. 2024 poz. 1019) și cu cerințele examenului de maturitate (CKE); unele lecții aparțin nivelului extins (zakres rozszerzony).' + tail;
}

function lessonFromConcept(country, stage, grade, topic, key, index) {
  const row = CONCEPTS[key];
  if (!row) throw new Error('Batch 3 math: unknown concept ' + key);
  const cur = CURRENCY[country];
  const fill = text => String(text).replace(/\{cur\}/g, cur);
  const [title, enTitle, statement, formula, worked, practice, answers, mistake] = row.map(fill);
  const id = ['math-b3', country.toLowerCase(), stage, String(grade).toLowerCase(), topic, String(index + 1).padStart(2, '0'), key].join('-');
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
    curriculumFrame: batch3CurriculumFrame(country, stage, String(grade)),
    conceptKey: key,
    aliases: []
  });
}

export function batch3MathLessons({ country, stage, grade, topic } = {}) {
  const c = String(country || '').toUpperCase();
  const st = String(stage || '');
  const keys = BATCH3_MATH_PLAN[c]?.[st]?.[String(grade)]?.[String(topic)] || [];
  return keys.map((key, i) => lessonFromConcept(c, st, String(grade), String(topic), key, i));
}

export function batch3MathAllLessons() {
  const out = [];
  for (const [country, stages] of Object.entries(BATCH3_MATH_PLAN)) {
    for (const [stage, grades] of Object.entries(stages)) {
      for (const [grade, topics] of Object.entries(grades)) {
        for (const topic of Object.keys(topics)) out.push(...batch3MathLessons({ country, stage, grade, topic }));
      }
    }
  }
  return out;
}

export function batch3PackTextbooks(country, stage, grade) {
  if (!BATCH3_MATH_PLAN[country]?.[stage]?.[String(grade)]) return [];
  const label = gradeLabel(country, stage, grade);
  const ref = ({
    ES: 'LOMLOE (BOE) · ' + label,
    IT: 'Indicazioni Nazionali · ' + label,
    PT: 'Aprendizagens Essenciais (DGE) · ' + label,
    PL: 'Podstawa programowa · ' + label
  })[country];
  return [{ id: 'b3-' + country.toLowerCase() + '-' + stage + '-' + String(grade).toLowerCase(), labelRo: ref, labelEn: ref, url: sourceFor(country, stage, String(grade)) }];
}
