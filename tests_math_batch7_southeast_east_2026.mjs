// End-to-end verification for Batch 7 of the 50-country Mathematics board (2026/27):
// BA, ME, MK, RS, AL, XK, UA, BY — Grade 1 → university.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { mathCountryPhasePlan } from './math_country_year_alignment_2026.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial } from './math_depth_courses.mjs';
import { mathCurriculumReadiness } from './math_curriculum_readiness.mjs';
import {
  BATCH7_MATH_COUNTRIES,
  BATCH7_MATH_PLAN,
  BATCH7_COUNTRY_NAMES,
  batch7MathAllLessons
} from './math_batch7_southeast_east_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = { beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' };
const CURRENCY = {
  BA: /mărci convertibile/,
  ME: /\beuro\b/,
  MK: /denari macedoneni/,
  RS: /dinari sârbești/,
  AL: /leki albanezi/,
  XK: /\beuro\b/,
  UA: /grivne/,
  BY: /ruble belaruse/
};

// 1. Lesson integrity & honest framing (including UA Grade 12 pilot & BA decentralized core)
const all = batch7MathAllLessons();
assert.deepEqual([...BATCH7_MATH_COUNTRIES], ['BA', 'ME', 'MK', 'RS', 'AL', 'XK', 'UA', 'BY']);
assert.ok(all.length >= 1850, `Expected >=1850 Batch 7 lessons, got ${all.length}`);

const ids = new Set();
for (const e of all) {
  assert.ok(!ids.has(e.id), `Duplicate id ${e.id}`);
  ids.add(e.id);
  assert.ok(e.id.startsWith('math-b7-'));
  assert.ok(BATCH7_MATH_COUNTRIES.includes(e.country));
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
  assert.ok(r.includes(BATCH7_COUNTRY_NAMES[e.country]), `${e.id} missing country framing`);
  assert.ok(r.includes('nu este certificată'), `${e.id} must not claim certified coverage`);
  if (/[0-9] (mărci convertibile|denari macedoneni|dinari sârbești|leki albanezi|grivne|ruble belaruse|euro)\b/.test(e.worked)) {
    assert.match(e.worked + e.practice + e.answers, CURRENCY[e.country], `${e.id} wrong currency`);
  }
}

assert.ok(all.some(e => e.country === 'UA' && /grivne/.test(e.worked)));
assert.ok(all.some(e => e.country === 'RS' && /dinari sârbești/.test(e.worked)));
assert.ok(all.some(e => e.country === 'BA' && /mărci convertibile/.test(e.worked)));

const frameOf = (c, st, g) => all.find(e => e.country === c && e.stage === st && e.grade === g).curriculumFrame;
assert.match(frameOf('UA', 'intermediate', '12'), /regim pilot.*1 septembrie 2027/);
assert.match(frameOf('BA', 'primary', '1'), /APOSO.*cantoane/);
assert.match(frameOf('XK', 'lower', '7'), /MASHTI/);
assert.match(frameOf('RS', 'intermediate', 'G2'), /ЗУОВ/);

// 2. Every school & university year/topic slot leads with >= 3 country lessons
let slots = 0;
for (const country of BATCH7_MATH_COUNTRIES) {
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    assert.ok(years.length >= 2, `${country} ${stage} must expose years`);
    for (const y of years) {
      const grade = String(y.id);
      const profile = mathCountryGradeAreas({ country, stage, grade, years });
      const al = mathCountryPhasePlan({ country, stage, grade, years });
      for (const unit of profile.units) {
        const entries = mathCountryCourseEntries({ country, stage: CLIENT[stage], grade, phase: al.phase, phases: al.phases, topic: unit.id });
        const own = entries.filter(e => e.country === country);
        assert.ok(own.length >= 3, `${country} ${stage} ${grade} ${unit.id}: ${own.length} country lessons`);
        assert.equal(entries[0].country, country);
        assert.ok(entries[0].id.startsWith('math-b7-'));
        assert.equal(entries.length, unit.lessonCount, `Lesson count parity for ${country} ${grade} ${unit.id}`);
        slots++;
      }
    }
  }
}
assert.equal(slots, 452);

// 3. Zero intra-country concept reuse
for (const [country, stages] of Object.entries(BATCH7_MATH_PLAN)) {
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

// 4. Worker serves decoupled packs & official textbook catalogs
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
const ua12 = await pack('UA', '12');
assert.equal(ua12.stage, 'medium');
assert.ok(ua12.manualExample.includes('lib.imzo.gov.ua'));
const by11 = await pack('BY', '11');
assert.equal(by11.stage, 'medium');
assert.ok(by11.manualExample.includes('e-padruchnik.adu.by'));
const mk9 = await pack('MK', '9');
assert.ok(mk9.manualExample.includes('e-ucebnici.mon.gov.mk'));

// 5. 0 KB Worker leak & honest readiness
const html = await (await worker.fetch(new Request('https://batch7.test/'))).text();
assert.ok(!html.includes('regim pilot pentru liceul academic de 3 ani НУШ'));
assert.equal(mathCurriculumReadiness().fullyApproved, 0);

const packFiles = (await fs.readdir(path.join(rootDir, 'public', 'packs'))).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_batch7_southeast_east_2026: BA, ME, MK, RS, AL, XK, UA, BY Mathematics Grade 1 -> university (${all.length} original lessons, ${slots} verified topic slots, ${packFiles.length} total decoupled packs).`);
