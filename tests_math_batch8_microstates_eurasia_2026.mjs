// End-to-end verification for Batch 8 (final batch) of the 50-country Mathematics board (2026/27):
// TR, RU, AD, LI, MC, SM, VA — completing 50 / 50 European jurisdictions.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { EDUCATION_EUROPE_COUNTRIES, educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { mathCountryPhasePlan } from './math_country_year_alignment_2026.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial } from './math_depth_courses.mjs';
import { mathCurriculumReadiness } from './math_curriculum_readiness.mjs';
import { ALL_DECOUPLED_CURRICULUM_PACKS } from './curriculum_pack_catalog.mjs';
import {
  BATCH8_MATH_COUNTRIES,
  BATCH8_MATH_PLAN,
  BATCH8_NATIVE_YEARS,
  BATCH8_COUNTRY_NAMES,
  batch8MathAllLessons
} from './math_batch8_microstates_eurasia_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = { beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' };
const NATIVE_EXTERNAL = new Set(BATCH8_NATIVE_YEARS);
const CURRENCY = {
  TR: /lire turcești/,
  RU: /\bruble\b/,
  AD: /\beuro\b/,
  LI: /franci elvețieni/,
  MC: /\beuro\b/,
  SM: /\beuro\b/,
  VA: /\beuro\b/
};

// 1. Lesson integrity & honest framing (TYMM cohort transition, Vatican university-only)
const all = batch8MathAllLessons();
assert.deepEqual([...BATCH8_MATH_COUNTRIES], ['TR', 'RU', 'AD', 'LI', 'MC', 'SM', 'VA']);
assert.ok(all.length >= 1400, `Expected >=1400 Batch 8 lessons, got ${all.length}`);

const ids = new Set();
for (const e of all) {
  assert.ok(!ids.has(e.id), `Duplicate id ${e.id}`);
  ids.add(e.id);
  assert.ok(e.id.startsWith('math-b8-'));
  assert.ok(BATCH8_MATH_COUNTRIES.includes(e.country));
  assert.ok(e.title && e.enTitle && e.unitTitle && e.unitTitle !== e.topic, `Missing native titles on ${e.id}`);
  assert.ok(e.statement.length >= 80, `Short statement on ${e.id}`);
  assert.ok(e.formula.length >= 3, `Missing formula on ${e.id}`);
  assert.ok(e.worked.length >= 80, `Short worked example on ${e.id}`);
  assert.ok(e.practice.length >= 30, `Short practice on ${e.id}`);
  assert.ok(e.answers.length >= 10, `Short answers on ${e.id}`);
  assert.ok(e.mistake.length >= 20, `Missing mistake prevention on ${e.id}`);
  assert.equal(e.curriculumCompletion, 'partial-source-review');
  assert.match(e.source, /^https:\/\//);
  assert.ok(!JSON.stringify(e).includes('{cur}'), `Unfilled {cur} on ${e.id}`);

  const r = mathInDepthMaterial(e);
  assert.ok(r.includes(BATCH8_COUNTRY_NAMES[e.country]), `${e.id} missing country framing`);
  assert.ok(r.includes('nu este certificată'), `${e.id} must not claim certified coverage`);
  if (/[0-9] (lire turcești|ruble|franci elvețieni|euro)\b/.test(e.worked)) {
    assert.match(e.worked + e.practice + e.answers, CURRENCY[e.country], `${e.id} wrong currency`);
  }
}

assert.ok(all.some(e => e.country === 'TR' && /lire turcești/.test(e.worked)));
assert.ok(all.some(e => e.country === 'RU' && /\bruble\b/.test(e.worked)));
assert.ok(all.some(e => e.country === 'LI' && /franci elvețieni/.test(e.worked)));
assert.ok(!all.some(e => e.country === 'VA' && e.stage !== 'advanced'), 'Vatican must NOT invent K-12 pack lessons');

const frameOf = (c, st, g) => all.find(e => e.country === c && e.stage === st && e.grade === g).curriculumFrame;
assert.match(frameOf('TR', 'primary', '3'), /Türkiye Yüzyılı Maarif Modeli|TYMM/);
assert.match(frameOf('TR', 'primary', '4'), /2018.*2027\/28/);
assert.match(frameOf('TR', 'lower', '8'), /2018.*2027\/28/);
assert.match(frameOf('TR', 'intermediate', '12'), /2018.*2027\/28/);
assert.match(frameOf('AD', 'primary', '2'), /Escola Andorrana.*spaniol și francez/);
assert.match(frameOf('LI', 'primary', '2'), /Lehrplan 21/);
assert.match(frameOf('LI', 'lower', '7'), /Oberschule, Realschule/);
assert.match(frameOf('MC', 'intermediate', 'terminale'), /franco-monegască|Baccalauréat/);
assert.match(frameOf('VA', 'advanced', '1'), /AVEPRO.*fără a pretinde/);

// 2. Every planned school & university year/topic slot leads with >= 3 country lessons
let slots = 0;
for (const country of BATCH8_MATH_COUNTRIES) {
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    assert.ok(years.length >= 1, `${country} ${stage} must expose years`);
    for (const y of years) {
      const grade = String(y.id);
      if (NATIVE_EXTERNAL.has(`${country}:${stage}:${grade}`)) {
        assert.equal(country, 'VA');
        assert.equal(grade, 'external-curriculum');
        assert.ok(!BATCH8_MATH_PLAN.VA[stage], 'VA school stages stay external-only');
        continue;
      }
      const profile = mathCountryGradeAreas({ country, stage, grade, years });
      const al = mathCountryPhasePlan({ country, stage, grade, years });
      for (const unit of profile.units) {
        const entries = mathCountryCourseEntries({ country, stage: CLIENT[stage], grade, phase: al.phase, phases: al.phases, topic: unit.id });
        const own = entries.filter(e => e.country === country);
        assert.ok(own.length >= 3, `${country} ${stage} ${grade} ${unit.id}: ${own.length} country lessons`);
        assert.equal(entries[0].country, country);
        assert.ok(entries[0].id.startsWith('math-b8-'));
        assert.equal(entries.length, unit.lessonCount, `Lesson count parity for ${country} ${grade} ${unit.id}`);
        slots++;
      }
    }
  }
}
assert.equal(slots, 348);

// 3. Zero intra-country concept reuse (including 5-year medium SM)
for (const [country, stages] of Object.entries(BATCH8_MATH_PLAN)) {
  const seen = new Set();
  for (const grades of Object.values(stages)) {
    for (const topics of Object.values(grades)) {
      for (const keys of Object.values(topics)) {
        assert.ok(keys.length >= 3 && keys.length <= 6);
        for (const k of keys) {
          assert.ok(!seen.has(k), `${country} reuses concept ${k}`);
          seen.add(k);
        }
      }
    }
  }
}

// 4. All 50 / 50 European jurisdictions are now represented in decoupled curriculum packs!
const packCountries = new Set(ALL_DECOUPLED_CURRICULUM_PACKS.map(p => p.country));
assert.equal(EDUCATION_EUROPE_COUNTRIES.length, 50);
for (const c of EDUCATION_EUROPE_COUNTRIES) {
  const code = typeof c === 'string' ? c : c.id;
  assert.ok(packCountries.has(code), `Missing country ${code} in ALL_DECOUPLED_CURRICULUM_PACKS`);
}
assert.equal(packCountries.size, 50, 'All 50 / 50 European jurisdictions must be covered');

// 5. Worker serves decoupled packs & preserves VA external-curriculum as empty pack
const mockAssets = {
  async fetch(req) {
    const rel = new URL(req.url).pathname.replace(/^\/+/, '');
    try {
      return new Response(await fs.readFile(path.join(rootDir, 'public', rel), 'utf8'), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  }
};
async function pack(country, grade) {
  const res = await worker.fetch(
    new Request(`https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=${encodeURIComponent(country)}&grade=${encodeURIComponent(grade)}`,
      { headers: { 'X-Pocket-Client': '1' } }),
    { ASSETS: mockAssets }
  );
  assert.equal(res.status, 200);
  return res.json();
}
const mcTerm = await pack('MC', 'terminale');
assert.equal(mcTerm.stage, 'medium');
assert.ok(mcTerm.lessonsByTopic.analysis.length >= 3);
const ru11 = await pack('RU', '11');
assert.ok(ru11.manualExample.includes('fpu.edu.ru'));
const vaExt = await pack('VA', 'external-curriculum');
assert.deepEqual(vaExt.lessonsByTopic, {}, 'VA external-curriculum must not serve invented K-12 lessons');
const vaU1 = await pack('VA', 'univ-1');
assert.equal(vaU1.stage, 'advanced');
assert.equal(vaU1.manualExample, null);
assert.ok(vaU1.lessonsByTopic.analysis.length >= 3);

// 6. 0 KB Worker leak & honest readiness
const html = await (await worker.fetch(new Request('https://batch8.test/'))).text();
for (const phrase of [
  'fără a pretinde o licență pontificală dedicată în matematică pură',
  'Puteri ale lui 10, ordine de mărime și estimarea calculelor',
  'Formula probabilității totale și teorema lui Bayes în decizii reale'
]) {
  assert.ok(!html.includes(phrase), `Batch 8 pack prose leaked into Worker HTML: ${phrase}`);
}
assert.equal(mathCurriculumReadiness().fullyApproved, 0);

const packFiles = (await fs.readdir(path.join(rootDir, 'public', 'packs'))).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_batch8_microstates_eurasia_2026: TR, RU, AD, LI, MC, SM, VA Mathematics complete — 50 / 50 European jurisdictions live (${all.length} original Batch 8 lessons, ${slots} verified topic slots, ${packFiles.length} total decoupled packs).`);
