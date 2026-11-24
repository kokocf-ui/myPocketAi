// Deterministic plan generator for Batches 5–8 of the 50-country Mathematics board.
// Generates static, reviewable plans:
//   - math_batch5_plan_2026.mjs (DK, FI, IS, NO, SE, EE, LV, LT)
//   - math_batch6_plan_2026.mjs (CZ, SK, SI, HR, BG, GR, CY, MT)
//   - math_batch7_plan_2026.mjs (BA, ME, MK, RS, AL, XK, UA, BY)
//   - math_batch8_plan_2026.mjs (TR, RU, AD, LI, MC, SM, VA)
// Guarantees:
//   - every planned year/topic slot gets >= 3 concepts (3–6),
//   - no concept is used more than once within the same country,
//   - Vatican City (VA) keeps its truthful external-school selector for
//     beginner/lower/medium (no invented Vatican school curriculum) and plans
//     only university (advanced).
// Usage: node scripts/generate_math_batch5_8_plans.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { educationCountrySchoolYears } from '../education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from '../math_country_grade_areas.mjs';
import { B2_PRIMARY_BANK } from '../math_batch2_bank_primary_2026.mjs';
import { B2_LOWER_BANK } from '../math_batch2_bank_lower_2026.mjs';
import { B2_UPPER_BANK } from '../math_batch2_bank_upper_2026.mjs';
import { B2_UNIVERSITY_BANK } from '../math_batch2_bank_university_2026.mjs';
import { B3_EXTRA_BANK } from '../math_batch3_bank_2026.mjs';
import { B58_EXTRA_BANK } from '../math_batch5_8_bank_2026.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BANK = {
  ...B2_PRIMARY_BANK,
  ...B2_LOWER_BANK,
  ...B2_UPPER_BANK,
  ...B2_UNIVERSITY_BANK,
  ...B3_EXTRA_BANK,
  ...B58_EXTRA_BANK
};

export const BATCHES_5_TO_8 = Object.freeze({
  5: {
    exportName: 'BATCH5_MATH_PLAN',
    fileName: 'math_batch5_plan_2026.mjs',
    countries: ['DK', 'FI', 'IS', 'NO', 'SE', 'EE', 'LV', 'LT']
  },
  6: {
    exportName: 'BATCH6_MATH_PLAN',
    fileName: 'math_batch6_plan_2026.mjs',
    countries: ['CZ', 'SK', 'SI', 'HR', 'BG', 'GR', 'CY', 'MT']
  },
  7: {
    exportName: 'BATCH7_MATH_PLAN',
    fileName: 'math_batch7_plan_2026.mjs',
    countries: ['BA', 'ME', 'MK', 'RS', 'AL', 'XK', 'UA', 'BY']
  },
  8: {
    exportName: 'BATCH8_MATH_PLAN',
    fileName: 'math_batch8_plan_2026.mjs',
    countries: ['TR', 'RU', 'AD', 'LI', 'MC', 'SM', 'VA']
  }
});

// Vatican school stages delegate to external schools in Rome (never invent a Vatican K-12 syllabus).
const EXTERNAL_SCHOOL_ONLY = new Set([
  'VA:beginner:external-curriculum',
  'VA:lower:external-curriculum',
  'VA:medium:external-curriculum'
]);

const POOLS = {
  beginner: {
    arithmetic: [
      'p1a-numbers-20', 'p1a-addsub-20', 'p1a-tens-100', 'p1a-word',
      'p2a-place-100', 'p2a-addsub-100', 'p2a-mult-2-5-10', 'p2a-fractions-simple',
      'p3a-place-1000', 'p3a-written-addsub', 'p3a-mult-tables', 'p3a-mult-2digit',
      'p4a-place-big', 'p4a-written-mult', 'p4a-long-division', 'p4a-fractions-of-quantity',
      'p5a-roman', 'p5a-decimals', 'p5a-fractions-equiv', 'p5a-primes-factors', 'p5a-percent-intro', 'p5a-proportionality',
      'b3p6a-integers', 'b3p6a-powers-squares', 'b5p7a-scientific-order',
      'l1a-big-numbers-rounding', 'l1a-decimal-ops', 'l1a-fraction-ops', 'l2a-ratio'
    ],
    geometry: [
      'p1g-shapes2d', 'p1g-solids', 'p1g-position',
      'p2g-properties', 'p2g-faces', 'p2g-patterns-turns',
      'p3g-right-angle', 'p3g-lines', 'p3g-perimeter',
      'p4g-angles', 'p4g-area-squares', 'p4g-symmetry-coords',
      'p5g-angle-measure', 'p5g-quadrilaterals', 'p5g-reflection-translation',
      'b3p6g-polygons-coords', 'b5p7g-scale-bearings',
      'l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-solids-nets', 'l2g-circle', 'l2g-triangle-sum'
    ],
    measurement: [
      'p1m-length-nonstd', 'p1m-time', 'p1m-money',
      'p2m-cm-m', 'p2m-mass-capacity', 'p2m-time-5min',
      'p3m-units-convert', 'p3m-time-calendar', 'p3m-money-calc',
      'p4m-scale-units', 'p4m-time-24h', 'p4m-data-tables',
      'p5m-perimeter-composite', 'p5m-area-rect-composite', 'p5m-volume-cubes'
    ],
    statistics: [
      'b3p6s-surveys', 'b5l-stat-stem-dot', 'l1s-frequency-table', 'l1s-bar-pictogram',
      'l1s-mean-range', 'l2s-pie-chart', 'l2s-median-mode', 'l2s-probability-scale'
    ]
  },
  lower: {
    algebra: [
      'l1a-big-numbers-rounding', 'l1a-divisibility', 'l1a-decimal-ops', 'l1a-fraction-ops', 'l1a-letters',
      'l2a-negative-ops', 'l2a-ratio', 'l2a-percent', 'b5l-alg-direct-inverse-table', 'l2a-simple-equations',
      'b5l-alg-formulas-rearrange', 'l3a-expand-brackets', 'l3a-proportional', 'l3a-powers-roots',
      'l3a-linear-equations-both-sides', 'l4a-identities', 'l4a-linear-function-graph', 'l4a-systems-2x2',
      'l4a-inequalities', 'l5a-irrational-radicals', 'l5a-quadratic-factor', 'l5a-quadratic-formula', 'l5a-functions-quadratic-graph'
    ],
    geometry: [
      'l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-area-perimeter', 'l1g-solids-nets',
      'l2g-angle-relations', 'l2g-triangle-sum', 'l2g-symmetry-central', 'l2g-circle',
      'b5l-geo-locus-bisectors', 'l3g-congruence', 'l3g-quadrilateral', 'b5l-geo-inscribed-polygons',
      'l3g-pythagoras', 'l3g-prism-volume', 'l4g-similarity-thales', 'l4g-right-triangle-trig',
      'l4g-cylinder-cone', 'l5g-circle-angles', 'l5g-sphere-volume', 'l5g-vectors-intro'
    ],
    statistics: [
      'l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range', 'b5l-stat-stem-dot',
      'l2s-median-mode', 'l2s-pie-chart', 'l2s-probability-scale', 'b5l-stat-bias-graphs',
      'l3s-grouped-data', 'l3s-relative-frequency', 'b5l-stat-cumfreq', 'l3s-two-way-tables',
      'b5l-stat-exp-theo', 'l4s-tree-diagram', 'l4s-scatter', 'l4s-quartiles-boxplot',
      'l5s-combinatorics-counting', 'l5s-independent-events', 'l5s-standard-deviation'
    ]
  },
  medium: {
    algebra: [
      'l4a-identities', 'l4a-systems-2x2', 'l5a-irrational-radicals', 'l5a-quadratic-formula', 'l6a-polynomial-substitution',
      'u1a-sets-intervals-abs', 'u1a-logic-reasoning', 'u1a-quadratic-inequality', 'u2a-second-degree', 'b5u-alg-vieta-symmetric',
      'b3s-abs-rational-ineq', 'b3s-poly-division', 'b5u-alg-modular-diophantine', 'l6a-exponential-growth',
      'b3s-finance-annuity', 'u2a-sequences', 'u2a-exponents-logs', 'b3s-log-models', 'b3s-recurrence', 'b3s-hondt',
      'u2a-matrices-systems', 'b3s-matrix-inverse', 'b3s-linear-programming', 'u3a-induction',
      'u3a-binomial-theorem', 'u3a-complex', 'b3s-complex-roots', 'b3s-rouche-systems'
    ],
    functions: [
      'l4a-linear-function-graph', 'l5a-functions-quadratic-graph', 'l6a-quadratic-scheitel',
      'u1f-function-def-domain', 'u1f-reference-functions', 'b5u-fn-piecewise-step', 'u1f-variation-extrema',
      'b5u-fn-parametric-models', 'b3s-optimization-quadratic', 'u2f-transformations', 'b3s-homographic',
      'u2f-composite-inverse', 'u2f-exponential-function', 'u3f-ln', 'u3f-continuity-ivt',
      'u3f-convexity', 'b3s-function-study', 'b3s-diff-eq-school'
    ],
    geometry: [
      'l4g-similarity-thales', 'l5g-circle-angles', 'l5g-vectors-intro', 'l6g-composite-solids',
      'b3s-triangle-centres', 'u1g-vectors-coords', 'u1g-line-equation', 'u1g-vector-geometry-proofs',
      'b3s-distance-line', 'b3s-isometries', 'b3s-cyclic-power-point', 'u2g-dot-product', 'u2g-circle-equation',
      'b3s-conics', 'b5u-geo-ellipse-hyperbola-foci', 'b3s-heron-radii', 'u3g-lines-planes-space',
      'u3g-angles-space', 'u3g-pyramid-regular', 'b3s-solids-similar', 'u3g-vectors-3d', 'b3s-vectors-space-cross'
    ],
    statistics: [
      'l4s-scatter', 'l5s-standard-deviation', 'l5s-independent-events', 'l6s-multistage', 'l6s-conditional-tables',
      'u1s-dispersion-weighted', 'u1s-probability-model', 'u1s-sampling', 'b3s-regression',
      'u3s-arrangements-combinations', 'b3s-counting-repetition', 'u2s-conditional-prob', 'b5u-stat-bayes-medical',
      'l6s-binomial-intro', 'u2s-random-variable', 'u2s-binomial', 'b3s-geometric-probability',
      'u3s-normal', 'b3s-normal-binomial-approx', 'u3s-confidence-proportion', 'b3s-confidence-mean', 'u3s-hypothesis-binomial'
    ],
    trigonometry: [
      'l4g-right-triangle-trig', 'l6g-sine-cosine-law', 'l6g-unit-circle',
      'u0t-exact-values', 'u0t-3d-trig', 'u2t-radian-unit-circle', 'u2t-identities',
      'u2t-trig-equations', 'u3t-trig-functions-graphs', 'u3t-harmonic-form', 'u3t-inverse-trig', 'u3t-trig-calculus'
    ],
    analysis: [
      'b3s-sequence-limits', 'u3an-limits-asymptotes', 'u2an-derivative-def', 'u2an-derivative-rules',
      'u2an-tangent-monotonicity', 'b3s-rolle-lagrange-lhopital', 'u3an-antiderivative-integral',
      'b3s-integral-riemann', 'u3an-integration-techniques', 'u3an-area-volume'
    ]
  }
};

const EXTRA = {
  lower: {
    algebra: ['l6a-exponential-growth', 'l6a-polynomial-substitution'],
    geometry: ['l6g-composite-solids', 'l6g-sine-cosine-law'],
    statistics: ['l6s-multistage', 'l6s-conditional-tables']
  },
  medium: {
    functions: ['u2a-exponents-logs', 'b3s-log-models', 'l6a-exponential-growth', 'b3s-recurrence', 'u2an-tangent-monotonicity'],
    trigonometry: ['b3s-heron-radii', 'u0t-3d-trig'],
    analysis: ['u3f-continuity-ivt', 'b3s-diff-eq-school', 'u3f-convexity'],
    algebra: ['b3s-counting-repetition'],
    geometry: ['l6g-sine-cosine-law'],
    statistics: ['l5s-combinatorics-counting']
  }
};

const UNIVERSITY_PLAN = {
  '1': {
    analysis: ['un1an-supremum', 'un1an-series', 'un1an-taylor'],
    'linear-algebra': ['un1la-determinants', 'un1la-rank-nullity', 'un1la-change-basis'],
    discrete: ['un1d-equivalence', 'un1d-inclusion-exclusion', 'un1d-modular']
  },
  '2': {
    analysis: ['un2an-power-series', 'un2an-lagrange', 'un2an-fubini'],
    'linear-algebra': ['un2la-diagonalization', 'un2la-gram-schmidt', 'un2la-least-squares'],
    statistics: ['un2s-poisson-exponential', 'un2s-covariance', 'un2s-clt']
  },
  '3': {
    differential: ['un3de-second-order', 'un3de-linear-systems', 'un3de-laplace'],
    analysis: ['un3an-cauchy-riemann', 'un3an-residues', 'un3an-fourier'],
    discrete: ['un3dm-generating', 'un3dm-spanning-trees', 'un3dm-shortest-paths']
  },
  '4': {
    analysis: ['un4an-banach', 'un4an-heat-equation', 'un4an-newton-numerics'],
    statistics: ['un4s-mle', 'un4s-regression', 'un4s-chi-square'],
    discrete: ['un4dm-linear-programming', 'un4dm-network-flows', 'un4dm-rsa']
  }
};

const UNIVERSITY_FINAL_3 = {
  analysis: ['un3an-cauchy-riemann', 'un3an-fourier', 'un3de-second-order'],
  statistics: ['un4s-mle', 'un4s-regression', 'un4s-chi-square'],
  discrete: ['un3dm-generating', 'un3dm-shortest-paths', 'un4dm-rsa']
};

for (const [stage, topics] of Object.entries(POOLS)) {
  for (const [topic, keys] of Object.entries(topics)) {
    for (const k of keys) {
      if (!BANK[k]) throw new Error(`Unknown concept ${k} in ${stage}/${topic}`);
    }
  }
}

function structure(country) {
  const out = [];
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    for (const y of years) {
      const grade = String(y.id);
      if (EXTERNAL_SCHOOL_ONLY.has(`${country}:${stage}:${grade}`)) continue;
      const profile = mathCountryGradeAreas({ country, stage, grade, years });
      out.push({ stage, grade, topics: profile.units.map(u => u.id) });
    }
  }
  return out;
}

function planCountry(country) {
  const used = new Set();
  const plan = {};
  const rows = structure(country);

  for (const stage of ['beginner', 'lower', 'medium']) {
    const stageRows = rows.filter(r => r.stage === stage);
    if (!stageRows.length) continue;
    const PRIORITY = ['analysis', 'trigonometry', 'statistics', 'geometry', 'measurement', 'arithmetic', 'functions', 'algebra'];
    const topics = [...new Set(stageRows.flatMap(r => r.topics))].sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
    const perTopic = {};

    for (const topic of topics) {
      let pool = [...(POOLS[stage][topic] || [])];
      if (!pool.length) throw new Error(`${country} ${stage}: no pool for ${topic}`);
      const gradesWithTopic = stageRows.filter(r => r.topics.includes(topic)).map(r => r.grade);

      if (stage !== 'beginner' && pool.filter(k => !used.has(k)).length < 3 * gradesWithTopic.length) {
        pool = [...pool, ...(EXTRA[stage]?.[topic] || []).filter(k => !pool.includes(k))];
      }

      const free = pool.filter(k => !used.has(k));
      const n = gradesWithTopic.length;

      gradesWithTopic.forEach((grade, j) => {
        const picked = [];
        const a = Math.floor(j * free.length / n);
        const b = Math.floor((j + 1) * free.length / n);
        let start = Math.max(0, pool.indexOf(free[Math.min(a, Math.max(0, free.length - 1))]));
        const remaining = pool.filter(k => !used.has(k)).length;
        let cap = Math.min(6, Math.max(3, b - a), Math.max(3, remaining - 3 * (n - j - 1)));

        if (stage === 'beginner') {
          const year = stageRows.findIndex(r => r.grade === grade) + 1;
          const tag = year <= 5 ? `p${year}` : year === 6 ? 'b3p6' : 'b5p7';
          const first = pool.findIndex(k => k.startsWith(tag));
          start = first >= 0 ? first : pool.findIndex(k => !used.has(k));
          if (year >= 6) {
            const p5 = pool.findIndex(k => k.startsWith('p5'));
            const firstFree = pool.findIndex((k, i) => i >= Math.max(p5, 0) && !used.has(k));
            if (firstFree >= 0) start = firstFree;
          }
          const block = pool.filter(k => k.startsWith(tag) && !used.has(k)).length;
          cap = Math.min(4, Math.max(3, block));
        }

        if (stage !== 'beginner' && b - a > cap) {
          const win = free.slice(a, b).filter(k => !used.has(k));
          for (let i = 0; i < cap && i < win.length; i++) {
            const k = win[Math.floor(i * win.length / cap)];
            if (!used.has(k)) { picked.push(k); used.add(k); }
          }
        }

        const order = [...pool.slice(start), ...pool.slice(0, start).reverse()];
        for (const k of order) {
          if (picked.length === cap) break;
          if (!used.has(k)) { picked.push(k); used.add(k); }
        }
        if (picked.length < 3) {
          throw new Error(`${country} ${stage} ${grade} ${topic}: only ${picked.length} concepts left`);
        }
        picked.sort((x, y) => pool.indexOf(x) - pool.indexOf(y));
        ((perTopic[grade] ??= {})[topic] = picked);
      });
    }

    plan[stage] = {};
    for (const r of stageRows) {
      plan[stage][r.grade] = Object.fromEntries(r.topics.map(t => [t, perTopic[r.grade][t]]));
    }
  }

  const adv = rows.filter(r => r.stage === 'advanced');
  if (adv.length) {
    plan.advanced = {};
    const last = adv[adv.length - 1].grade;
    for (const r of adv) {
      const src = adv.length === 3 && r.grade === last ? UNIVERSITY_FINAL_3 : UNIVERSITY_PLAN[r.grade];
      plan.advanced[r.grade] = Object.fromEntries(r.topics.map(t => {
        if (!src?.[t]) throw new Error(`${country} univ ${r.grade}: no university concepts for ${t}`);
        return [t, src[t]];
      }));
    }
  }
  return plan;
}

for (const [batchNum, meta] of Object.entries(BATCHES_5_TO_8)) {
  const planObj = Object.fromEntries(meta.countries.map(c => [c, planCountry(c)]));
  const body =
    `// GENERATED by scripts/generate_math_batch5_8_plans.mjs — do not edit by hand.\n` +
    `// Batch ${batchNum} Mathematics plan (${meta.countries.join(', ')}): country -> stage -> grade -> topic -> concept keys.\n` +
    `// Each concept is used at most once per country; every slot has >= 3 concepts.\n` +
    `export const ${meta.exportName} = Object.freeze(${JSON.stringify(planObj, null, 1)});\n`;
  fs.writeFileSync(path.join(root, meta.fileName), body, 'utf8');

  let slots = 0;
  let lessons = 0;
  for (const st of Object.values(planObj)) {
    for (const g of Object.values(st)) {
      for (const t of Object.values(g)) {
        for (const ks of Object.values(t)) {
          slots++;
          lessons += ks.length;
        }
      }
    }
  }
  console.log(`Batch ${batchNum} (${meta.countries.join(', ')}) written to ${meta.fileName}: ${slots} slots, ${lessons} lessons.`);
}
