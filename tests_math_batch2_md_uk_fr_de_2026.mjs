// End-to-end verification for Batch 2 of the 50-country Mathematics board (2026/27):
// Republica Moldova (MD), England (GB-ENG), France (FR), Germany (DE) — Grade 1 → university.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { mathCountryPhasePlan } from './math_country_year_alignment_2026.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial, franceGrade5eLessons } from './math_depth_courses.mjs';
import { mathGcseSelectTier, MATH_GCSE_HIGHER_ONLY } from './math_gcse_tier_policy.mjs';
import { BATCH2_MATH_COUNTRIES, BATCH2_MATH_PLAN, batch2MathAllLessons } from './math_batch2_md_uk_fr_de_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = { beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' };
const NAME = { MD: 'Republica Moldova', 'GB-ENG': 'Anglia', FR: 'Franța', DE: 'Germania' };
const CURRENCY = { MD: /\blei\b/, 'GB-ENG': /lire sterline/, FR: /\beuro\b/, DE: /\beuro\b/ };
// Years that keep dedicated native inline courses (not served from Batch 2 packs).
const NATIVE_INLINE = new Set(['GB-ENG:beginner:Y3', 'GB-ENG:beginner:Y4', 'GB-ENG:beginner:Y6', 'GB-ENG:medium:Y10', 'FR:lower:5e']);

// 1. Authored lesson integrity: complete worked lessons with honest framing.
const all = batch2MathAllLessons();
assert.deepEqual([...BATCH2_MATH_COUNTRIES], ['MD', 'GB-ENG', 'FR', 'DE']);
assert.ok(all.length >= 600, `Expected >=600 Batch 2 lessons, got ${all.length}`);
const ids = new Set();
for (const e of all) {
  assert.ok(!ids.has(e.id), `Duplicate id ${e.id}`);
  ids.add(e.id);
  assert.ok(BATCH2_MATH_COUNTRIES.includes(e.country));
  assert.ok(e.title && e.enTitle && e.unitTitle, `Missing titles on ${e.id}`);
  assert.ok(e.statement.length >= 80, `Short statement on ${e.id}`);
  assert.ok(e.formula.length >= 3, `Missing formula on ${e.id}`);
  assert.ok(e.worked.length >= 80, `Short worked example on ${e.id}`);
  assert.ok(e.practice.length >= 30, `Short practice on ${e.id}`);
  assert.ok(e.answers.length >= 10, `Short answers on ${e.id}`);
  assert.ok(e.mistake.length >= 20, `Missing mistake prevention on ${e.id}`);
  assert.equal(e.curriculumCompletion, 'partial-source-review');
  assert.match(e.source, /^https:\/\//);
  assert.ok(!JSON.stringify(e).includes('{cur}'), `Unfilled currency on ${e.id}`);
  const r = mathInDepthMaterial(e);
  for (const h of ['# Definiție și explicație', '# Formula și notațiile', '# Exemplu rezolvat, pas cu pas',
    '# Exersează singur', '# Verifică răspunsurile', '# Greșeală frecventă și prevenirea ei', '# Încadrare curriculară']) {
    assert.ok(r.includes(h), `${e.id} missing ${h}`);
  }
  assert.ok(r.includes(NAME[e.country]), `${e.id} missing country framing`);
  assert.ok(r.includes('nu este certificată'), `${e.id} must not claim certified coverage`);
  assert.ok(!r.includes('Material orientativ de învățare; repartizarea'), `${e.id} fell back to generic framing`);
  if (/\{cur\}/.test(e.worked) || /[0-9] (lei|euro|lire sterline)\b/.test(e.worked)) {
    assert.match(e.worked + e.practice + e.answers, CURRENCY[e.country], `${e.id} wrong currency`);
  }
}
assert.ok(all.filter(e => e.country === 'MD' && e.stage !== 'advanced').every(e => mathInDepthMaterial(e).includes('nu cu programele din România')));
assert.ok(all.some(e => e.country === 'GB-ENG' && /lire sterline/.test(e.worked + e.practice + e.answers)));
assert.ok(!all.some(e => e.country !== 'GB-ENG' && e.conceptKey === 'p5m-metric-imperial'), 'Imperial units are England-only');

// 2. Every school year, every topic branch: >=3 country-specific lessons leading the branch.
let slots = 0;
for (const country of BATCH2_MATH_COUNTRIES) {
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    assert.ok(years.length >= 3, `${country} ${stage} must expose school years`);
    for (const y of years) {
      const grade = String(y.id);
      const profile = mathCountryGradeAreas({ country, stage, grade, years });
      const al = mathCountryPhasePlan({ country, stage, grade, years });
      for (const unit of profile.units) {
        const entries = mathCountryCourseEntries({ country, stage: CLIENT[stage], grade, phase: al.phase, phases: al.phases, topic: unit.id });
        const own = entries.filter(e => e.country === country);
        assert.ok(own.length >= 3, `${country} ${stage} ${grade} ${unit.id}: ${own.length} country lessons`);
        const titles = entries.map(e => e.title);
        if (!NATIVE_INLINE.has(`${country}:${stage}:${grade}`) && BATCH2_MATH_PLAN[country]?.[stage]?.[grade]?.[unit.id]) {
          assert.equal(entries[0].country, country, `${country} ${stage} ${grade} ${unit.id} must lead with country lesson`);
        }
        if (stage === 'medium' && country === 'GB-ENG' && ['Y10', 'Y11'].includes(grade)) {
          assert.equal(new Set(titles).size, titles.length, `Duplicate GCSE titles in ${grade} ${unit.id}`);
        }
        slots++;
      }
    }
  }
}
assert.ok(slots >= 229, `Expected >=229 verified slots, got ${slots}`);

// 3. Plan uses each concept once per country (no copy-paste between years).
for (const [country, stages] of Object.entries(BATCH2_MATH_PLAN)) {
  const seen = new Set();
  for (const grades of Object.values(stages)) for (const topics of Object.values(grades)) for (const keys of Object.values(topics)) {
    for (const k of keys) {
      assert.ok(!seen.has(k), `${country} reuses concept ${k} in two places`);
      seen.add(k);
    }
  }
}

// 4. Native England and France courses are preserved; England Y11 tiering is honoured.
const y3 = mathCountryCourseEntries({ country: 'GB-ENG', stage: 'primary', grade: 'Y3', phase: 3, topic: 'arithmetic' });
assert.ok(y3.some(e => e.title === 'Sute, zeci și unități'));
assert.ok(!Object.keys(BATCH2_MATH_PLAN['GB-ENG'].beginner).some(g => ['Y3', 'Y4', 'Y6'].includes(g)));
assert.ok(!BATCH2_MATH_PLAN['GB-ENG'].medium.Y10);
assert.deepEqual(Object.keys(BATCH2_MATH_PLAN['GB-ENG'].medium.Y11), ['trigonometry']);
assert.ok(!BATCH2_MATH_PLAN.FR.lower['5e']);
for (const topic of ['algebra', 'geometry', 'statistics', 'functions']) {
  assert.deepEqual(
    mathCountryCourseEntries({ country: 'FR', stage: 'lower', grade: '5e', phase: 2, topic }).map(e => e.id),
    franceGrade5eLessons(topic).map(e => e.id), `France 5e ${topic} must stay native`);
}
const y11 = mathCountryCourseEntries({ country: 'GB-ENG', stage: 'intermediate', grade: 'Y11', phase: 2, topic: 'trigonometry' });
const foundation = mathGcseSelectTier(y11, 'foundation').map(e => e.title);
const higher = mathGcseSelectTier(y11, 'higher').map(e => e.title);
assert.ok(foundation.includes('Valori exacte ale funcțiilor trigonometrice pentru 0°, 30°, 45°, 60°, 90°'), 'G21 exact values on both tiers');
for (const t of ['Trigonometrie și teorema lui Pitagora în spațiu', 'Teorema sinusurilor, teorema cosinusului și aria cu sinus']) {
  assert.ok(MATH_GCSE_HIGHER_ONLY[t], `${t} must be mapped Higher-only`);
  assert.ok(higher.includes(t) && !foundation.includes(t), `${t} tier leak`);
}
assert.ok(foundation.length >= 3);
const u1 = mathCountryCourseEntries({ country: 'GB-ENG', stage: 'advanced', grade: '1', phase: 1, phases: [1], topic: 'analysis' });
assert.equal(u1.filter(e => e.title === 'Definiția epsilon-delta a limitei').length, 1);
assert.ok(u1.some(e => e.title === 'Secvențe numerice și limita lor'));

// 5. Curriculum-appropriate content spot checks.
const titlesOf = (country, stage, grade, topic, phase, phases) =>
  mathCountryCourseEntries({ country, stage, grade, topic, phase, phases }).filter(e => e.country === country).map(e => e.title).join(' | ');
assert.match(titlesOf('MD', 'intermediate', '12', 'analysis', 4), /Primitive|integral/i);
assert.match(titlesOf('FR', 'intermediate', 'terminale', 'statistics', 3, [3, 4]), /combinări/i);
assert.match(titlesOf('DE', 'intermediate', '13', 'geometry', 4), /spațiu/i);
assert.match(titlesOf('GB-ENG', 'primary', 'Y5', 'measurement', 5), /imperiale|imperial/i);
assert.match(titlesOf('MD', 'advanced', '4', 'discrete', 4), /RSA/);

// 6. Worker serves the decoupled packs (stage-aware grade ids, no primary/university collision).
const mockAssets = {
  async fetch(req) {
    const rel = new URL(req.url).pathname.replace(/^\/+/, '');
    try {
      return new Response(await fs.readFile(path.join(rootDir, 'public', rel), 'utf8'), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch { return new Response('Not found', { status: 404 }); }
  }
};
async function pack(country, grade) {
  const res = await worker.fetch(new Request(`https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=${encodeURIComponent(country)}&grade=${encodeURIComponent(grade)}`,
    { headers: { 'X-Pocket-Client': '1' } }), { ASSETS: mockAssets });
  assert.equal(res.status, 200, `${country} ${grade} pack must be served`);
  return res.json();
}
const md4 = await pack('MD', '4');
assert.equal(md4.stage, 'beginner');
assert.ok(md4.lessonsByTopic.arithmetic.length >= 3);
const de1 = await pack('DE', 'univ-1');
assert.equal(de1.stage, 'advanced');
assert.equal(de1.displayGrade, '1');
assert.ok(de1.lessonsByTopic['linear-algebra'].length >= 3);
const deG1 = await pack('DE', '1');
assert.equal(deG1.stage, 'beginner');
const y11Pack = await pack('GB-ENG', 'Y11');
assert.deepEqual(Object.keys(y11Pack.lessonsByTopic), ['trigonometry']);
const frT = await pack('FR', 'terminale');
assert.equal(frT.stage, 'medium');
assert.ok(frT.textbooks.length === 1 && frT.textbooks[0].url.includes('eduscol'));

// 7. Lesson prose lives in packs, not in the Worker HTML/JS.
const html = await (await worker.fetch(new Request('https://batch2.test/'))).text();
for (const phrase of ['Programare liniară: metoda grafică', 'Valori exacte ale funcțiilor trigonometrice pentru 0°', 'Piramida regulată și trunchiul de piramidă']) {
  assert.ok(!html.includes(phrase), `Pack prose leaked into Worker bundle: ${phrase}`);
}

const packFiles = (await fs.readdir(path.join(rootDir, 'public', 'packs'))).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_batch2_md_uk_fr_de_2026: MD, GB-ENG, FR, DE Mathematics Grade 1 -> university (${all.length} original lessons, ${slots} verified topic slots, ${packFiles.length} total decoupled packs).`);
