// End-to-end verification for Batch 3 of the 50-country Mathematics board (2026/27):
// Spain (ES), Italy (IT), Portugal (PT), Poland (PL) — Grade 1 → university.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { mathCountryPhasePlan } from './math_country_year_alignment_2026.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial, portugalMath2026Lessons } from './math_depth_courses.mjs';
import { spainMathOriginalEntries } from './math_spain_lomloe_2026.mjs';
import { italyMathFocalLessons } from './math_italy_framework_2026.mjs';
import { polandClass4Lessons } from './math_poland_class4_2026_lessons.mjs';
import { BATCH3_MATH_COUNTRIES, BATCH3_MATH_PLAN, BATCH3_PARALLEL_TRACKS, batch3MathAllLessons } from './math_batch3_es_it_pt_pl_2026.mjs';
import { B3_EXTRA_BANK } from './math_batch3_bank_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const CLIENT = { beginner: 'primary', lower: 'lower', medium: 'intermediate', advanced: 'advanced' };
const NAME = { ES: 'Spania', IT: 'Italia', PT: 'Portugalia', PL: 'Polonia' };
const CURRENCY = { ES: /\beuro\b/, IT: /\beuro\b/, PT: /\beuro\b/, PL: /zloți/ };
// Years that keep dedicated native inline courses (not served from Batch 3 concept lessons).
const NATIVE_INLINE = new Set(['PT:lower:5', 'PT:lower:6', 'PL:lower:IV']);

// 1. Authored lesson integrity: complete worked lessons with honest framing.
assert.equal(Object.keys(B3_EXTRA_BANK).length, 35);
for (const [k, row] of Object.entries(B3_EXTRA_BANK)) {
  assert.equal(row.length, 8, `${k} must have 8 fields`);
  assert.ok(row.every(x => typeof x === 'string' && x.trim()), `${k} has an empty field`);
}
const all = batch3MathAllLessons();
assert.deepEqual([...BATCH3_MATH_COUNTRIES], ['ES', 'IT', 'PT', 'PL']);
assert.ok(all.length >= 700, `Expected >=700 Batch 3 lessons, got ${all.length}`);
const ids = new Set();
for (const e of all) {
  assert.ok(!ids.has(e.id), `Duplicate id ${e.id}`);
  ids.add(e.id);
  assert.ok(e.id.startsWith('math-b3-'));
  assert.ok(BATCH3_MATH_COUNTRIES.includes(e.country));
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
  if (/[0-9] (lei|euro|lire sterline|zloți)\b/.test(e.worked)) {
    assert.match(e.worked + e.practice + e.answers, CURRENCY[e.country], `${e.id} wrong currency`);
    assert.ok(!/\blei\b|lire sterline/.test(e.worked), `${e.id} foreign currency`);
  }
}
assert.ok(all.some(e => e.country === 'PL' && /zloți/.test(e.worked + e.practice + e.answers)));
assert.ok(!all.some(e => e.conceptKey === 'p5m-metric-imperial'), 'Imperial units are England-only');
assert.ok(all.filter(e => e.country === 'ES' && e.stage !== 'advanced').every(e => e.curriculumFrame.includes('comunitate autonomă')));
assert.ok(all.filter(e => e.country === 'PT' && e.stage === 'intermediate').every(e => e.curriculumFrame.includes('Matemática A')));
assert.ok(all.filter(e => e.country === 'PL' && e.stage === 'primary').every(e => e.curriculumFrame.includes('edukacja wczesnoszkolna')));
assert.ok(all.filter(e => e.stage === 'advanced').every(e => /Bologna|L-35/.test(e.curriculumFrame)));

// 2. Every school year, every topic branch: >=3 country-specific lessons leading the branch.
let slots = 0;
for (const country of BATCH3_MATH_COUNTRIES) {
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
        if (!NATIVE_INLINE.has(`${country}:${stage}:${grade}`)) {
          assert.ok(BATCH3_MATH_PLAN[country]?.[stage]?.[grade]?.[unit.id]?.length >= 3, `${country} ${stage} ${grade} ${unit.id} missing from plan`);
          assert.ok(entries.some(e => e.id.startsWith('math-b3-')), `${country} ${stage} ${grade} ${unit.id} must route Batch 3 pack lessons`);
        }
        const entryIds = entries.map(e => e.id);
        assert.equal(new Set(entryIds).size, entryIds.length, `Duplicate entries in ${country} ${grade} ${unit.id}`);
        slots++;
      }
    }
  }
}
assert.ok(slots >= 241, `Expected >=241 verified slots, got ${slots}`);

// 3. Each concept is used once per country, except across parallel tracks of one year
// (e.g. 4º ESO Matemáticas A / B; Bachillerato modalities) which a learner never takes together.
for (const [country, stages] of Object.entries(BATCH3_MATH_PLAN)) {
  const groupOf = grade => (BATCH3_PARALLEL_TRACKS[country] || []).find(g => g.includes(grade))?.join('|') || grade;
  const owner = new Map();
  for (const [stage, grades] of Object.entries(stages)) for (const [grade, topics] of Object.entries(grades)) {
    const inGrade = new Set();
    for (const keys of Object.values(topics)) for (const k of keys) {
      assert.ok(!inGrade.has(k), `${country} ${grade} repeats ${k}`);
      inGrade.add(k);
      const g = stage + ':' + groupOf(grade);
      if (stage === 'advanced') continue; // shared university core below
      assert.ok(!owner.has(k) || owner.get(k) === g, `${country} reuses concept ${k} in ${owner.get(k)} and ${g}`);
      owner.set(k, g);
    }
  }
}

// 4. Native courses are preserved and still lead.
for (const topic of ['algebra', 'functions', 'statistics', 'geometry']) {
  for (const grade of ['5', '6']) {
    assert.deepEqual(
      mathCountryCourseEntries({ country: 'PT', stage: 'lower', grade, phase: Number(grade) - 4, topic }).map(e => e.id),
      portugalMath2026Lessons({ grade, topic }).map(e => e.id), `Portugal ${grade}.º ${topic} must stay native`);
  }
}
for (const topic of ['algebra', 'geometry', 'statistics']) {
  assert.deepEqual(
    mathCountryCourseEntries({ country: 'PL', stage: 'lower', grade: 'IV', phase: 1, topic }).map(e => e.id),
    polandClass4Lessons(topic).map(e => e.id), `Poland klasa IV ${topic} must stay native`);
}
assert.ok(!BATCH3_MATH_PLAN.PT.lower['5'] && !BATCH3_MATH_PLAN.PT.lower['6'] && !BATCH3_MATH_PLAN.PL.lower.IV);
const esB2 = mathCountryCourseEntries({ country: 'ES', stage: 'intermediate', grade: 'B2-CYT', phase: 3, phases: [3, 4], topic: 'analysis' });
const esNative = spainMathOriginalEntries({ grade: 'B2-CYT', topic: 'analysis' });
assert.ok(esNative.length >= 1);
assert.deepEqual(esB2.slice(0, esNative.length).map(e => e.id), esNative.map(e => e.id), 'LOMLOE focal lesson must lead');
assert.ok(esB2.some(e => e.id.startsWith('math-b3-es-medium-b2-cyt-analysis-')));
const itM1 = mathCountryCourseEntries({ country: 'IT', stage: 'lower', grade: 'M1', phase: 1, topic: 'algebra' });
const itNative = italyMathFocalLessons({ grade: 'M1', topic: 'algebra' });
assert.ok(itNative.length >= 1);
assert.deepEqual(itM1.slice(0, itNative.length).map(e => e.id), itNative.map(e => e.id), 'Italian focal lesson must lead');
assert.ok(itM1.some(e => e.id.startsWith('math-b3-it-lower-m1-algebra-')));

// 5. Curriculum-appropriate content spot checks.
const titlesOf = (country, stage, grade, topic, phase, phases) =>
  mathCountryCourseEntries({ country, stage, grade, topic, phase, phases }).filter(e => e.country === country).map(e => e.title).join(' | ');
assert.match(titlesOf('PT', 'intermediate', '10', 'algebra', 1), /D'Hondt/);
assert.match(titlesOf('PT', 'intermediate', '12', 'algebra', 4, [3, 4]), /complex/i);
assert.match(titlesOf('PL', 'intermediate', 'L2', 'functions', 2), /optimizare/i);
assert.match(titlesOf('PL', 'intermediate', 'L2', 'algebra', 2), /Horner/);
assert.match(titlesOf('ES', 'intermediate', 'B2-CYT', 'algebra', 3, [3, 4]), /Rouché/);
assert.match(titlesOf('ES', 'intermediate', 'B2-HCS', 'statistics', 3, [3, 4]), /încredere/i);
assert.match(titlesOf('IT', 'intermediate', 'S5', 'analysis', 4, [3, 4]), /integral/i);
assert.match(titlesOf('IT', 'intermediate', 'S3', 'geometry', 2), /Conice/);
assert.match(titlesOf('PL', 'advanced', '4', 'discrete', 4), /RSA/);

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
const esP3 = await pack('ES', 'P3');
assert.equal(esP3.stage, 'beginner');
assert.ok(esP3.lessonsByTopic.geometry.length >= 3);
assert.ok(esP3.textbooks.length === 1 && esP3.textbooks[0].url.includes('boe.es'));
const ptU1 = await pack('PT', 'univ-1');
assert.equal(ptU1.stage, 'advanced');
assert.equal(ptU1.displayGrade, '1');
assert.ok(ptU1.lessonsByTopic['linear-algebra'].length >= 3);
const ptG1 = await pack('PT', '1');
assert.equal(ptG1.stage, 'beginner');
const pt5 = await pack('PT', '5');
assert.ok(Object.values(pt5.lessonsByTopic).flat().every(e => !String(e.id).startsWith('math-b3-')), 'PT 5 pack stays native');
const plL4 = await pack('PL', 'L4');
assert.equal(plL4.stage, 'medium');
assert.ok(plL4.textbooks[0].url.includes('cke.gov.pl'));
const itS4 = await pack('IT', 'S4');
assert.ok(itS4.lessonsByTopic.analysis.some(e => e.id.startsWith('math-b3-it-')));
const plIV = await worker.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=PL&grade=IV',
  { headers: { 'X-Pocket-Client': '1' } }), { ASSETS: mockAssets });
assert.deepEqual((await plIV.json()).lessonsByTopic, {}, 'Poland klasa IV keeps its inline course (no pack)');

// 7. Lesson prose lives in packs, not in the Worker HTML/JS.
const html = await (await worker.fetch(new Request('https://batch3.test/'))).text();
for (const phrase of ['Repartizarea mandatelor: metodele D\'Hondt', 'teorema Rouché–Frobenius', 'Formula lui Moivre și rădăcinile de ordinul n']) {
  assert.ok(!html.includes(phrase), `Pack prose leaked into Worker bundle: ${phrase}`);
}

const packFiles = (await fs.readdir(path.join(rootDir, 'public', 'packs'))).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_batch3_es_it_pt_pl_2026: ES, IT, PT, PL Mathematics Grade 1 -> university (${all.length} original lessons, ${slots} verified topic slots, ${packFiles.length} total decoupled packs).`);
