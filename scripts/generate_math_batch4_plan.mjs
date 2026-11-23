// Deterministic plan generator for Batch 4 of the 50-country Mathematics board.
// Reads the real school-year/topic structure of each jurisdiction and assigns
// original concepts from ordered, level-progressive pools so that:
//   - every planned topic slot gets >= 3 concepts,
//   - no concept is used twice within one country,
//   - later years of a stage receive later (harder) concepts of that topic.
// Output: math_batch4_plan_2026.mjs (static, reviewable data).
// Usage: node scripts/generate_math_batch4_plan.mjs
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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BANK = { ...B2_PRIMARY_BANK, ...B2_LOWER_BANK, ...B2_UPPER_BANK, ...B2_UNIVERSITY_BANK, ...B3_EXTRA_BANK };

export const BATCH4_COUNTRIES = ['AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR'];
const UK = new Set(['GB-SCT', 'GB-WLS', 'GB-NIR']);
// Years that keep their dedicated native inline courses (age-appropriate early years bank).
const NATIVE = new Set(['NL:beginner:G1', 'NL:beginner:G2', 'IE:beginner:JI', 'IE:beginner:SI']);

// Ordered (easy -> hard) pools per stage and topic. Bracketed comments mark
// fallbacks borrowed from the neighbouring stage.
const POOLS = {
  beginner: {
    arithmetic: ['p1a-numbers-20', 'p1a-addsub-20', 'p1a-tens-100', 'p1a-word', 'p2a-place-100', 'p2a-addsub-100', 'p2a-mult-2-5-10', 'p2a-fractions-simple',
      'p3a-place-1000', 'p3a-written-addsub', 'p3a-mult-tables', 'p3a-mult-2digit', 'p4a-place-big', 'p4a-written-mult', 'p4a-long-division', 'p4a-fractions-of-quantity',
      'p5a-roman', 'p5a-decimals', 'p5a-fractions-equiv', 'p5a-primes-factors', 'p5a-percent-intro', 'p5a-proportionality', 'b3p6a-integers', 'b3p6a-powers-squares',
      /* lower fallback */ 'l1a-big-numbers-rounding', 'l1a-decimal-ops', 'l1a-fraction-ops', 'l2a-ratio'],
    geometry: ['p1g-shapes2d', 'p1g-solids', 'p1g-position', 'p2g-properties', 'p2g-faces', 'p2g-patterns-turns', 'p3g-right-angle', 'p3g-lines', 'p3g-perimeter',
      'p4g-angles', 'p4g-area-squares', 'p4g-symmetry-coords', 'p5g-angle-measure', 'p5g-quadrilaterals', 'p5g-reflection-translation', 'b3p6g-polygons-coords',
      /* lower fallback */ 'l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-solids-nets', 'l2g-circle', 'l2g-triangle-sum'],
    measurement: ['p1m-length-nonstd', 'p1m-time', 'p1m-money', 'p2m-cm-m', 'p2m-mass-capacity', 'p2m-time-5min', 'p3m-units-convert', 'p3m-time-calendar', 'p3m-money-calc',
      'p4m-scale-units', 'p4m-time-24h', 'p4m-data-tables', 'p5m-perimeter-composite', 'p5m-area-rect-composite', 'p5m-metric-imperial', 'p5m-volume-cubes'],
    statistics: ['b3p6s-surveys', 'l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range', 'l2s-pie-chart', 'l2s-median-mode', 'l2s-probability-scale']
  },
  lower: {
    algebra: ['l1a-big-numbers-rounding', 'l1a-divisibility', 'l1a-decimal-ops', 'l1a-fraction-ops', 'l1a-letters', 'l2a-negative-ops', 'l2a-ratio', 'l2a-percent', 'l2a-simple-equations',
      'l3a-expand-brackets', 'l3a-proportional', 'l3a-powers-roots', 'l3a-linear-equations-both-sides', 'l4a-identities', 'l4a-linear-function-graph', 'l4a-systems-2x2',
      'l4a-inequalities', 'l5a-irrational-radicals', 'l5a-quadratic-factor', 'l5a-quadratic-formula', 'l5a-functions-quadratic-graph'],
    geometry: ['l1g-perp-parallel-construct', 'l1g-triangle-construct', 'l1g-area-perimeter', 'l1g-solids-nets', 'l2g-angle-relations', 'l2g-triangle-sum', 'l2g-symmetry-central',
      'l2g-circle', 'l3g-congruence', 'l3g-quadrilateral', 'l3g-pythagoras', 'l3g-prism-volume', 'l4g-similarity-thales', 'l4g-right-triangle-trig', 'l4g-cylinder-cone',
      'l5g-circle-angles', 'l5g-sphere-volume', 'l5g-vectors-intro'],
    statistics: ['l1s-frequency-table', 'l1s-bar-pictogram', 'l1s-mean-range', 'l2s-median-mode', 'l2s-pie-chart', 'l2s-probability-scale', 'l3s-grouped-data', 'l3s-relative-frequency',
      'l3s-two-way-tables', 'l4s-tree-diagram', 'l4s-scatter', 'l4s-quartiles-boxplot', 'l5s-combinatorics-counting', 'l5s-independent-events', 'l5s-standard-deviation']
  },
  medium: {
    algebra: [/* lower fallback */ 'l4a-identities', 'l4a-systems-2x2', 'l5a-irrational-radicals', 'l5a-quadratic-formula', 'l6a-polynomial-substitution',
      'u1a-sets-intervals-abs', 'u1a-logic-reasoning', 'u1a-quadratic-inequality', 'u2a-second-degree', 'b3s-abs-rational-ineq', 'b3s-poly-division', 'l6a-exponential-growth',
      'b3s-finance-annuity', 'u2a-sequences', 'u2a-exponents-logs', 'b3s-log-models', 'b3s-recurrence', 'b3s-hondt', 'u2a-matrices-systems', 'b3s-matrix-inverse',
      'b3s-linear-programming', 'u3a-induction', 'u3a-binomial-theorem', 'u3a-complex', 'b3s-complex-roots', 'b3s-rouche-systems'],
    functions: [/* lower fallback */ 'l4a-linear-function-graph', 'l5a-functions-quadratic-graph', 'l6a-quadratic-scheitel',
      'u1f-function-def-domain', 'u1f-reference-functions', 'u1f-variation-extrema', 'b3s-optimization-quadratic', 'u2f-transformations', 'b3s-homographic',
      'u2f-composite-inverse', 'u2f-exponential-function', 'u3f-ln', 'u3f-continuity-ivt', 'u3f-convexity', 'b3s-function-study', 'b3s-diff-eq-school'],
    geometry: [/* lower fallback */ 'l4g-similarity-thales', 'l5g-circle-angles', 'l5g-vectors-intro', 'l6g-composite-solids',
      'b3s-triangle-centres', 'u1g-vectors-coords', 'u1g-line-equation', 'u1g-vector-geometry-proofs', 'b3s-distance-line', 'b3s-isometries', 'b3s-cyclic-power-point',
      'u2g-dot-product', 'u2g-circle-equation', 'b3s-conics', 'b3s-heron-radii', 'u3g-lines-planes-space', 'u3g-angles-space', 'u3g-pyramid-regular', 'b3s-solids-similar',
      'u3g-vectors-3d', 'b3s-vectors-space-cross'],
    statistics: [/* lower fallback */ 'l4s-scatter', 'l5s-standard-deviation', 'l5s-independent-events', 'l6s-multistage', 'l6s-conditional-tables',
      'u1s-dispersion-weighted', 'u1s-probability-model', 'u1s-sampling', 'b3s-regression', 'u3s-arrangements-combinations', 'b3s-counting-repetition', 'u2s-conditional-prob',
      'l6s-binomial-intro', 'u2s-random-variable', 'u2s-binomial', 'b3s-geometric-probability', 'u3s-normal', 'b3s-normal-binomial-approx', 'u3s-confidence-proportion',
      'b3s-confidence-mean', 'u3s-hypothesis-binomial'],
    trigonometry: [/* lower fallback */ 'l4g-right-triangle-trig', 'l6g-sine-cosine-law', 'l6g-unit-circle',
      'u0t-exact-values', 'u0t-3d-trig', 'u2t-radian-unit-circle', 'u2t-identities', 'u2t-trig-equations', 'u3t-trig-functions-graphs', 'u3t-harmonic-form',
      'u3t-inverse-trig', 'u3t-trig-calculus'],
    analysis: ['b3s-sequence-limits', 'u3an-limits-asymptotes', 'u2an-derivative-def', 'u2an-derivative-rules', 'u2an-tangent-monotonicity', 'b3s-rolle-lagrange-lhopital',
      'u3an-antiderivative-integral', 'b3s-integral-riemann', 'u3an-integration-techniques', 'u3an-area-volume']
  }
};

// Related concepts appended (at the end, i.e. for the latest years) only when a
// topic's own pool cannot give every year 3 concepts.
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

// Shared university core (same as Batch 3); 3-year UK degrees close with year 3.
const UNIVERSITY_PLAN = {
  '1': { analysis: ['un1an-supremum', 'un1an-series', 'un1an-taylor'], 'linear-algebra': ['un1la-determinants', 'un1la-rank-nullity', 'un1la-change-basis'], discrete: ['un1d-equivalence', 'un1d-inclusion-exclusion', 'un1d-modular'] },
  '2': { analysis: ['un2an-power-series', 'un2an-lagrange', 'un2an-fubini'], 'linear-algebra': ['un2la-diagonalization', 'un2la-gram-schmidt', 'un2la-least-squares'], statistics: ['un2s-poisson-exponential', 'un2s-covariance', 'un2s-clt'] },
  '3': { differential: ['un3de-second-order', 'un3de-linear-systems', 'un3de-laplace'], analysis: ['un3an-cauchy-riemann', 'un3an-residues', 'un3an-fourier'], discrete: ['un3dm-generating', 'un3dm-spanning-trees', 'un3dm-shortest-paths'] },
  '4': { analysis: ['un4an-banach', 'un4an-heat-equation', 'un4an-newton-numerics'], statistics: ['un4s-mle', 'un4s-regression', 'un4s-chi-square'], discrete: ['un4dm-linear-programming', 'un4dm-network-flows', 'un4dm-rsa'] }
};
const UNIVERSITY_FINAL_3 = { analysis: ['un3an-cauchy-riemann', 'un3an-fourier', 'un3de-second-order'], statistics: ['un4s-mle', 'un4s-regression', 'un4s-chi-square'], discrete: ['un3dm-generating', 'un3dm-shortest-paths', 'un4dm-rsa'] };

for (const [stage, topics] of Object.entries(POOLS)) for (const [topic, keys] of Object.entries(topics)) for (const k of keys) {
  if (!BANK[k]) throw new Error(`Unknown concept ${k} in ${stage}/${topic}`);
}

function structure(country) {
  const out = [];
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    for (const y of years) {
      const grade = String(y.id);
      if (NATIVE.has(`${country}:${stage}:${grade}`)) continue;
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
    // Topics with the narrowest pools are planned first so that borrowing
    // (EXTRA) never breaks the progression of analysis/trigonometry.
    const PRIORITY = ['analysis', 'trigonometry', 'statistics', 'geometry', 'measurement', 'arithmetic', 'functions', 'algebra'];
    const topics = [...new Set(stageRows.flatMap(r => r.topics))].sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b));
    const perTopic = {};
    for (const topic of topics) {
      let pool = (POOLS[stage][topic] || []).filter(k => UK.has(country) || k !== 'p5m-metric-imperial');
      if (!pool.length) throw new Error(`${country} ${stage}: no pool for ${topic}`);
      const gradesWithTopic = stageRows.filter(r => r.topics.includes(topic)).map(r => r.grade);
      // Short pool (many years with this topic): append related concepts.
      if (stage !== 'beginner' && pool.filter(k => !used.has(k)).length < 3 * gradesWithTopic.length) {
        pool = [...pool, ...(EXTRA[stage]?.[topic] || []).filter(k => !pool.includes(k))];
      }
      // Lower/upper secondary: tile the still-free part of the pool across the
      // years that have this topic (3–6 concepts per slot), in progression order.
      const free = pool.filter(k => !used.has(k));
      const n = gradesWithTopic.length;
      gradesWithTopic.forEach((grade, j) => {
        const picked = [];
        const a = Math.floor(j * free.length / n), b = Math.floor((j + 1) * free.length / n);
        let start = Math.max(0, pool.indexOf(free[Math.min(a, free.length - 1)]));
        const remaining = pool.filter(k => !used.has(k)).length;
        let cap = Math.min(6, Math.max(3, b - a), Math.max(3, remaining - 3 * (n - j - 1)));
        if (stage === 'beginner') {
          // Primary pools are organised by school year (p1…p5, then year-6 and
          // lower-secondary fallbacks): year N starts at its own block and takes
          // up to 4 concepts of that block.
          const year = stageRows.findIndex(r => r.grade === grade) + 1;
          const tag = year <= 5 ? `p${year}` : year === 6 ? 'b3p6' : 'l';
          const first = pool.findIndex(k => k.startsWith(tag));
          start = first >= 0 ? first : pool.findIndex(k => !used.has(k));
          if (year >= 6) {
            // Leftover year-5 concepts (e.g. percentages, proportionality) come first.
            const p5 = pool.findIndex(k => k.startsWith('p5'));
            const firstFree = pool.findIndex((k, i) => i >= Math.max(p5, 0) && !used.has(k));
            if (firstFree >= 0) start = firstFree;
          }
          const block = pool.filter(k => k.startsWith(tag) && !used.has(k)).length;
          cap = Math.min(4, Math.max(3, block));
        }
        if (stage !== 'beginner' && b - a > cap) {
          // Wide window (few years carry this topic): sample it evenly so the
          // slot spans the whole progression instead of only its beginning.
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
        if (picked.length < 3) throw new Error(`${country} ${stage} ${grade} ${topic}: only ${picked.length} concepts left`);
        // keep progression order inside the slot
        picked.sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
        ((perTopic[grade] ??= {})[topic] = picked);
      });
    }
    if (stageRows.length) {
      plan[stage] = {};
      for (const r of stageRows) plan[stage][r.grade] = Object.fromEntries(r.topics.map(t => [t, perTopic[r.grade][t]]));
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

const PLAN = Object.fromEntries(BATCH4_COUNTRIES.map(c => [c, planCountry(c)]));
const body = `// GENERATED by scripts/generate_math_batch4_plan.mjs — do not edit by hand.
// Batch 4 Mathematics plan: country -> stage -> grade -> topic -> concept keys.
// Each concept is used at most once per country; every slot has >= 3 concepts.
export const BATCH4_MATH_PLAN = Object.freeze(${JSON.stringify(PLAN, null, 1)});
`;
fs.writeFileSync(path.join(root, 'math_batch4_plan_2026.mjs'), body);
let slots = 0, lessons = 0;
for (const st of Object.values(PLAN)) for (const g of Object.values(st)) for (const t of Object.values(g)) for (const ks of Object.values(t)) { slots++; lessons += ks.length; }
console.log(`Batch 4 plan written: ${slots} slots, ${lessons} lessons.`);
