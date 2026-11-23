// End-to-end verification for Romania (RO) Mathematics from Clasa I to Universitate Anul III (2026/27).
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './index.js';
import { educationCountrySchoolYears, educationSubjectSchoolPlan } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears } from './math_country_grade_areas.mjs';
import { mathCountryCourseEntries, mathInDepthMaterial } from './math_depth_courses.mjs';
import { ROMANIA_FULL_TRACK_LESSONS } from './math_romania_full_2026.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const packsDir = path.join(rootDir, 'public', 'packs');

const allRomaniaGapLessons = Object.values(ROMANIA_FULL_TRACK_LESSONS).flat();

// 1. Verify authored Romanian gap-closing bank count and integrity
assert.ok(allRomaniaGapLessons.length >= 105, `Expected >=105 new RO lessons, got ${allRomaniaGapLessons.length}`);
const ids = new Set();
for (const entry of allRomaniaGapLessons) {
  assert.equal(entry.country, 'RO');
  assert.ok(!ids.has(entry.id), `Duplicate RO lesson id: ${entry.id}`);
  ids.add(entry.id);
  assert.ok(entry.title && entry.enTitle, `Missing title on ${entry.id}`);
  assert.ok(entry.statement.length >= 80, `Short statement on ${entry.id}`);
  assert.ok(entry.worked.length >= 80, `Short worked example on ${entry.id}`);
  assert.ok(entry.practice.length >= 30, `Short practice on ${entry.id}`);
  assert.ok(entry.answers.length >= 15, `Short answers on ${entry.id}`);
  const rendered = mathInDepthMaterial(entry);
  assert.ok(rendered.includes('# Definiție și explicație'));
  assert.ok(rendered.includes('# Încadrare curriculară'));
  assert.ok(rendered.includes('România'), `Missing România framing on ${entry.id}`);
}

// 2. Verify all 4 Primary grades (Clasa I – Clasa a IV-a)
const primaryYears = mathCountryStudyYears({
  country: 'RO',
  stage: 'beginner',
  years: educationCountrySchoolYears('RO', 'beginner').years
});
assert.deepEqual(primaryYears.map(y => y.id), ['1', '2', '3', '4']);

for (const grade of ['1', '2', '3', '4']) {
  const plan = educationSubjectSchoolPlan({ country: 'RO', stage: 'beginner', grade, subject: 'mathematics' });
  assert.deepEqual(plan.units.map(u => u.id), ['arithmetic', 'geometry', 'measurement']);
  for (const unit of plan.units) {
    const entries = mathCountryCourseEntries({ country: 'RO', stage: 'primary', grade, phase: Number(grade), topic: unit.id });
    assert.ok(entries.length >= 4, `RO Primary grade ${grade} ${unit.id} must have >=4 lessons, got ${entries.length}`);
    assert.ok(entries.every(e => e.country === 'RO' && String(e.grade) === grade),
      `RO Primary grade ${grade} ${unit.id} must only serve RO grade-${grade} lessons`);
  }
}

// Grade 1 arithmetic contract for tests_math_real_browser.mjs (10 lessons + 1 practice row = 11 rows in 10..12)
const ro1Arith = mathCountryCourseEntries({ country: 'RO', stage: 'primary', grade: '1', phase: 1, topic: 'arithmetic' });
assert.equal(ro1Arith.length, 10, 'RO Clasa I Aritmetică must expose 10 lessons so browser row count is 11');

// Grade 4 strict Romanian curriculum check: NO decimal numbers (decimals start in Clasa a V-a in Romania)
const ro4All = ['arithmetic', 'geometry', 'measurement'].flatMap(topic =>
  mathCountryCourseEntries({ country: 'RO', stage: 'primary', grade: '4', phase: 4, topic })
);
assert.equal(ro4All.length, 18);
assert.ok(ro4All.some(e => e.title.includes('1.000.000')), 'Clasa a IV-a must cover numbers up to 1.000.000');
assert.ok(ro4All.some(e => /romane/i.test(e.title)), 'Clasa a IV-a must cover Roman numerals I..M');
assert.ok(ro4All.some(e => /figurativ/i.test(e.title)), 'Clasa a IV-a must cover metoda figurativă');
for (const e of ro4All) {
  assert.ok(!/numere zecimale|fracții zecimale/i.test(e.title),
    `Forbidden Grade-5 decimal topic in RO Clasa a IV-a: ${e.title}`);
}

// 3. Verify Lower Secondary (Gimnaziu V–VIII) remains intact (182 RO lessons)
let gimnaziuTotal = 0;
for (const grade of ['5', '6', '7', '8']) {
  const plan = educationSubjectSchoolPlan({ country: 'RO', stage: 'lower', grade, subject: 'mathematics' });
  for (const unit of plan.units) {
    const entries = mathCountryCourseEntries({ country: 'RO', stage: 'lower', grade, phase: Number(grade) - 4, topic: unit.id });
    assert.ok(entries.length >= 3 && entries.every(e => e.country === 'RO'));
    gimnaziuTotal += entries.length;
  }
}
assert.equal(gimnaziuTotal, 182, 'Gimnaziu V–VIII must preserve all 182 authored Romanian lessons');

// 4. Verify Upper Secondary (Liceu IX, IX-SCI, X, XI, XII)
const lyceeYears = mathCountryStudyYears({
  country: 'RO',
  stage: 'medium',
  years: educationCountrySchoolYears('RO', 'medium').years
});
assert.deepEqual(lyceeYears.map(y => y.id), ['9', '9-SCI', '10', '11', '12']);

for (const grade of ['9', '10', '11', '12']) {
  const plan = educationSubjectSchoolPlan({ country: 'RO', stage: 'medium', grade, subject: 'mathematics' });
  for (const unit of plan.units) {
    const entries = mathCountryCourseEntries({
      country: 'RO',
      stage: 'intermediate',
      grade,
      phase: Math.min(4, Number(grade) - 8),
      topic: unit.id
    });
    assert.ok(entries.length > 0, `Empty RO Lycée grade ${grade} ${unit.id}`);
    assert.equal(entries[0].country, 'RO', `First lesson in RO Lycée ${grade} ${unit.id} must be RO-specific`);
    assert.equal(String(entries[0].grade), grade);
  }
}

// Verify iconic Romanian M1/M2 & Bacalaureat topics in XI and XII
const ro11Algebra = mathCountryCourseEntries({ country: 'RO', stage: 'intermediate', grade: '11', phase: 3, topic: 'algebra' });
assert.ok(ro11Algebra.some(e => e.country === 'RO' && /Matrice|Determinanți|Cramer/i.test(e.title)),
  'RO Clasa a XI-a must include Matrice / Determinanți / Cramer');
const ro11Analysis = mathCountryCourseEntries({ country: 'RO', stage: 'intermediate', grade: '11', phase: 3, topic: 'analysis' });
assert.ok(ro11Analysis.some(e => e.country === 'RO' && /Derivabilitate|limite/i.test(e.title)),
  'RO Clasa a XI-a must include Limite & Derivabilitate in Analiză matematică');

const ro12Algebra = mathCountryCourseEntries({ country: 'RO', stage: 'intermediate', grade: '12', phase: 4, topic: 'algebra' });
assert.ok(ro12Algebra.some(e => e.country === 'RO' && /Grupuri|Inele|Polinoame/i.test(e.title)),
  'RO Clasa a XII-a must include Grupuri / Inele / Polinoame');
const ro12Analysis = mathCountryCourseEntries({ country: 'RO', stage: 'intermediate', grade: '12', phase: 4, topic: 'analysis' });
assert.ok(ro12Analysis.some(e => e.country === 'RO' && /Primitive|Riemann|Leibniz/i.test(e.title)),
  'RO Clasa a XII-a must include Primitive & Integrala Riemann (Leibniz-Newton)');

// 5. Verify University (Licență Matematică Anul I, II, III — ARACIS / Bologna) with zero Grade 1..3 collision
const uniYears = mathCountryStudyYears({
  country: 'RO',
  stage: 'advanced',
  years: educationCountrySchoolYears('RO', 'advanced').years
});
assert.deepEqual(uniYears.map(y => y.id), ['1', '2', '3']);

for (const grade of ['1', '2', '3']) {
  const plan = educationSubjectSchoolPlan({ country: 'RO', stage: 'advanced', grade, subject: 'mathematics' });
  assert.equal(plan.units.length, 3);
  for (const unit of plan.units) {
    const entries = mathCountryCourseEntries({
      country: 'RO',
      stage: 'advanced',
      grade,
      phase: Number(grade),
      topic: unit.id
    });
    assert.ok(entries.length > 0);
    assert.equal(entries[0].country, 'RO', `University Year ${grade} ${unit.id} must lead with RO university lesson`);
    assert.equal(entries[0].stage, 'advanced');
  }
}

// 6. Verify Worker /api/curriculum-pack serves both Primary grade=4 and University grade=univ-1 cleanly
const mockAssets = {
  async fetch(req) {
    const u = new URL(req.url);
    const rel = u.pathname.replace(/^\/+/, '');
    const filePath = path.join(rootDir, 'public', rel);
    try {
      const body = await fs.readFile(filePath, 'utf8');
      return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  }
};

const resPrimary4 = await worker.fetch(
  new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=RO&grade=4', {
    headers: { 'X-Pocket-Client': '1' }
  }),
  { ASSETS: mockAssets }
);
assert.equal(resPrimary4.status, 200);
const jsonPrimary4 = await resPrimary4.json();
assert.equal(jsonPrimary4.country, 'RO');
assert.equal(jsonPrimary4.stage, 'beginner');
assert.equal(jsonPrimary4.lessonsByTopic.arithmetic.length, 10);

const resUniv1 = await worker.fetch(
  new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/curriculum-pack?subject=mathematics&country=RO&grade=univ-1', {
    headers: { 'X-Pocket-Client': '1' }
  }),
  { ASSETS: mockAssets }
);
assert.equal(resUniv1.status, 200);
const jsonUniv1 = await resUniv1.json();
assert.equal(jsonUniv1.country, 'RO');
assert.equal(jsonUniv1.stage, 'advanced');
assert.equal(jsonUniv1.displayGrade, '1');
assert.ok(jsonUniv1.lessonsByTopic.analysis.length >= 1);

const packFiles = (await fs.readdir(packsDir)).filter(f => f.endsWith('.json'));
console.log(`PASS tests_math_romania_full_2026: RO complete Clasa I -> Universitate Anul III (${allRomaniaGapLessons.length} new + 217 existing = ${allRomaniaGapLessons.length + 217} RO lessons; ${packFiles.length} total decoupled packs).`);
