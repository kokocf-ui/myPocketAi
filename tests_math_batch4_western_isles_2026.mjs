// End-to-end verification for Batch 4 of the 50-country Mathematics board (2026/27):
// AT, CH, BE, NL, LU, IE, GB-SCT, GB-WLS, GB-NIR — Grade 1 → university.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { mathCountryPhasePlan } from './math_country_year_alignment_2026.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial, mathEarlyYearEntries } from './math_depth_courses.mjs';
import { BATCH4_MATH_COUNTRIES, BATCH4_MATH_PLAN, BATCH4_NATIVE_YEARS, BATCH4_COUNTRY_NAMES, batch4MathAllLessons } from './math_batch4_western_isles_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = { beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' };
const UK = new Set(['GB-SCT', 'GB-WLS', 'GB-NIR']);
const CURRENCY = c => (UK.has(c) ? /lire sterline/ : c === 'CH' ? /franci elvețieni/ : /\beuro\b/);
const NATIVE = new Set(BATCH4_NATIVE_YEARS);

// 1. Lesson integrity: complete worked lessons with honest framing.
const all = batch4MathAllLessons();
assert.deepEqual([...BATCH4_MATH_COUNTRIES], ['AT', 'CH', 'BE', 'NL', 'LU', 'IE', 'GB-SCT', 'GB-WLS', 'GB-NIR']);
assert.ok(all.length >= 2000, `Expected >=2000 Batch 4 lessons, got ${all.length}`);
const ids = new Set();
for (const e of all) {
  assert.ok(!ids.has(e.id), `Duplicate id ${e.id}`);
  ids.add(e.id);
  assert.ok(e.id.startsWith('math-b4-'));
  assert.ok(BATCH4_MATH_COUNTRIES.includes(e.country));
  assert.ok(e.title && e.enTitle && e.unitTitle && e.unitTitle !== e.topic, `Missing titles on ${e.id}`);
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
  assert.ok(r.includes(BATCH4_COUNTRY_NAMES[e.country]), `${e.id} missing country framing`);
  assert.ok(r.includes('nu este certificată'), `${e.id} must not claim certified coverage`);
  assert.ok(!r.includes('Material orientativ de învățare; repartizarea'), `${e.id} fell back to generic framing`);
  if (/[0-9] (lei|euro|lire sterline|zloți|franci elvețieni)\b/.test(e.worked)) {
    assert.match(e.worked + e.practice + e.answers, CURRENCY(e.country), `${e.id} wrong currency`);
    assert.ok(!/\blei\b|zloți/.test(e.worked), `${e.id} foreign currency`);
  }
}
assert.ok(all.some(e => e.country === 'CH' && /franci elvețieni/.test(e.worked + e.practice + e.answers)));
assert.ok(all.some(e => e.country === 'GB-SCT' && /lire sterline/.test(e.worked + e.practice + e.answers)));
assert.ok(!all.some(e => !UK.has(e.country) && e.conceptKey === 'p5m-metric-imperial'), 'Imperial units only for UK nations');
const frameOf = (c, st, g) => all.find(e => e.country === c && e.stage === st && e.grade === g).curriculumFrame;
assert.match(frameOf('BE', 'lower', 'S1'), /trunchiul comun a ajuns în S1 în 2026\/27/);
assert.match(frameOf('CH', 'primary', '3'), /Lehrplan 21.*PER.*Piano di studio/);
assert.match(frameOf('IE', 'intermediate', 'TY'), /opțional/);
assert.match(frameOf('IE', 'intermediate', '6Y'), /septembrie 2027/);
assert.match(frameOf('GB-WLS', 'intermediate', 'Y10'), /Double Award/);
assert.match(frameOf('GB-SCT', 'intermediate', 'S5'), /Higher în S5/);
assert.match(frameOf('NL', 'primary', 'G5'), /1 august 2026/);
assert.match(frameOf('AT', 'intermediate', '13'), /BHS/);
assert.match(frameOf('GB-NIR', 'advanced', '3'), /3 ani/);
assert.match(frameOf('GB-SCT', 'advanced', '4'), /4 ani/);

// 2. Every school year, every topic branch: >=3 country lessons leading the branch.
let slots = 0;
for (const country of BATCH4_MATH_COUNTRIES) {
  for (const stage of ['beginner', 'lower', 'medium', 'advanced']) {
    const years = mathCountryStudyYears({ country, stage, years: educationCountrySchoolYears(country, stage).years });
    assert.ok(years.length >= 2, `${country} ${stage} must expose school years`);
    for (const y of years) {
      const grade = String(y.id);
      const profile = mathCountryGradeAreas({ country, stage, grade, years });
      const al = mathCountryPhasePlan({ country, stage, grade, years });
      for (const unit of profile.units) {
        const entries = mathCountryCourseEntries({ country, stage: CLIENT[stage], grade, phase: al.phase, phases: al.phases, topic: unit.id });
        const own = entries.filter(e => e.country === country);
        assert.ok(own.length >= 3, `${country} ${stage} ${grade} ${unit.id}: ${own.length} country lessons`);
        assert.equal(entries[0].country, country, `${country} ${stage} ${grade} ${unit.id} must lead with country lesson`);
        if (!NATIVE.has(`${country}:${stage}:${grade}`)) {
          assert.ok(BATCH4_MATH_PLAN[country]?.[stage]?.[grade]?.[unit.id]?.length >= 3, `${country} ${stage} ${grade} ${unit.id} missing from plan`);
          assert.ok(entries[0].id.startsWith('math-b4-'), `${country} ${stage} ${grade} ${unit.id} must lead with a Batch 4 pack lesson`);
        }
        const entryIds = entries.map(e => e.id);
        assert.equal(new Set(entryIds).size, entryIds.length, `Duplicate entries in ${country} ${grade} ${unit.id}`);
        slots++;
      }
    }
  }
}
assert.ok(slots >= 520, `Expected >=520 verified slots, got ${slots}`);

// 3. Each concept used once per country; plan file is in sync with its generator.
for (const [country, stages] of Object.entries(BATCH4_MATH_PLAN)) {
  const seen = new Set();
  for (const grades of Object.values(stages)) for (const topics of Object.values(grades)) for (const keys of Object.values(topics)) {
    assert.ok(keys.length >= 3 && keys.length <= 6, `${country} slot size ${keys.length}`);
    for (const k of keys) {
      assert.ok(!seen.has(k), `${country} reuses concept ${k}`);
      seen.add(k);
    }
  }
}
// Progression sanity: core milestones land in sensible years.
const yearOf = (c, key) => Object.entries(BATCH4_MATH_PLAN[c]).flatMap(([st, gs]) => Object.entries(gs)
  .filter(([, ts]) => Object.values(ts).some(ks => ks.includes(key))).map(([g]) => st + ':' + g))[0];
assert.equal(yearOf('AT', 'p2a-addsub-100'), 'beginner:2');
assert.equal(yearOf('CH', 'l3g-pythagoras'), 'lower:8');
assert.equal(yearOf('GB-SCT', 'p5a-percent-intro'), 'beginner:P6');
assert.match(yearOf('IE', 'u3an-antiderivative-integral'), /medium:6Y/);

// 4. Native early years preserved (NL groep 1–2, IE Junior/Senior Infants).
for (const [c, g] of [['NL', 'G1'], ['NL', 'G2'], ['IE', 'JI'], ['IE', 'SI']]) {
  for (const topic of ['arithmetic', 'geometry', 'measurement']) {
    assert.deepEqual(
      mathCountryCourseEntries({ country: c, stage: 'primary', grade: g, phase: 1, topic }).map(e => e.id),
      mathEarlyYearEntries({ country: c, grade: g, topic }).map(e => e.id), `${c} ${g} ${topic} must stay native`);
  }
  assert.ok(!BATCH4_MATH_PLAN[c].beginner[g]);
}

// 5. Curriculum-appropriate content spot checks.
const titlesOf = (country, stage, grade, topic, phase, phases) =>
  mathCountryCourseEntries({ country, stage, grade, topic, phase, phases }).filter(e => e.country === country).map(e => e.title).join(' | ');
assert.match(titlesOf('AT', 'primary', '2', 'arithmetic', 2), /până la 100/);
assert.match(titlesOf('GB-WLS', 'primary', 'Y5', 'measurement', 5), /imperiale/);
assert.match(titlesOf('AT', 'intermediate', '13', 'analysis', 4), /integral/i);
assert.match(titlesOf('NL', 'intermediate', 'V6', 'statistics', 4), /normal/i);
assert.match(titlesOf('IE', 'advanced', '4', 'discrete', 4), /RSA/);

// 6. Worker serves the packs (stage-aware grade ids, no primary/university collision).
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
const ch1 = await pack('CH', '1');
assert.equal(ch1.stage, 'beginner');
assert.ok(ch1.lessonsByTopic.arithmetic.length >= 3);
const chU1 = await pack('CH', 'univ-1');
assert.equal(chU1.stage, 'advanced');
assert.equal(chU1.displayGrade, '1');
const sctS5 = await pack('GB-SCT', 'S5');
assert.equal(sctS5.stage, 'medium');
assert.ok(sctS5.textbooks[0].url.includes('sqa.org.uk'));
const wlsY10 = await pack('GB-WLS', 'Y10');
assert.ok(wlsY10.textbooks[0].url.includes('wjec'));
const nlG1 = await (await worker.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=NL&grade=G1',
  { headers: { 'X-Pocket-Client': '1' } }), { ASSETS: mockAssets })).json();
assert.deepEqual(nlG1.lessonsByTopic, {}, 'NL groep 1 keeps its native inline lessons (no pack)');

// 7. Lesson prose lives in packs, not in the Worker HTML/JS.
const html = await (await worker.fetch(new Request('https://batch4.test/'))).text();
for (const phrase of ['Double Award) WJEC, predat din septembrie 2025', 'trunchiul comun a ajuns în S1', 'Repartizarea mandatelor: metodele D\'Hondt']) {
  assert.ok(!html.includes(phrase), `Pack prose leaked into Worker bundle: ${phrase}`);
}

const packFiles = (await fs.readdir(path.join(rootDir, 'public', 'packs'))).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_batch4_western_isles_2026: AT, CH, BE, NL, LU, IE, GB-SCT, GB-WLS, GB-NIR Mathematics Grade 1 -> university (${all.length} original lessons, ${slots} verified topic slots, ${packFiles.length} total decoupled packs).`);
