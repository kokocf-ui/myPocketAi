// Verification for Mathematics school textbook & curriculum reference correlation (2026/27):
// 1. Romania Grades I–XII (math_ro_textbook_correlation_2026.mjs)
// 2. All 48 other school-pack jurisdictions across Batches 1–8 (math_textbook_correlation_all_2026.mjs)
// 3. Decoupled curriculum packs across all 50 / 50 European countries:
//    602/602 school packs carry manualExample + textbooks[];
//    197/197 university packs (including VA univ-1..univ-4) stay manualExample === null;
//    total = 799 decoupled packs.
// 4. Zero copied textbook prose & honest readiness (fullyApproved === 0).

import assert from 'node:assert/strict';
import worker from './index.js';
import {
  RO_TEXTBOOK_CORRELATION_2026,
  roMathTextbookEntry,
  roMathManualExample,
  roMathPackTextbooks
} from './math_ro_textbook_correlation_2026.mjs';
import {
  IMPLEMENTED_18_TEXTBOOK_COUNTRIES,
  ALL_SCHOOL_TEXTBOOK_COUNTRIES,
  mathTextbookCorrelationEntry
} from './math_textbook_correlation_all_2026.mjs';
import {
  MATH_DECOUPLED_CURRICULUM_PACKS,
  SCIENCE_DECOUPLED_CURRICULUM_PACKS,
  ALL_DECOUPLED_CURRICULUM_PACKS
} from './curriculum_pack_catalog.mjs';
import { mathCurriculumReadiness } from './math_curriculum_readiness.mjs';

const ALLOWED_META_KEYS = new Set([
  'id', 'country', 'stage', 'grade', 'title', 'authors',
  'publisher', 'approvalOrder', 'syllabus', 'syllabusUrl', 'url', 'portalUrl', 'manualExample'
]);

// 1. Romania Grades I–XII reference metadata & copyright-safety check
const roGrades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
assert.deepEqual(Object.keys(RO_TEXTBOOK_CORRELATION_2026), roGrades);
assert.equal(roMathTextbookEntry('9-SCI'), null, 'RO 9-SCI stays dedicated in math_ro9_science_2026.mjs');
assert.equal(roMathManualExample('advanced', '1'), null, 'University years must not claim a mandatory textbook');

for (const grade of roGrades) {
  const entry = roMathTextbookEntry(grade);
  assert.ok(entry, `Missing RO textbook correlation for grade ${grade}`);
  assert.equal(entry.country, 'RO');
  assert.equal(entry.grade, grade);
  assert.ok(entry.title.length >= 15 && entry.title.length <= 140, `RO grade ${grade} title must be bibliographic only`);
  assert.ok(entry.authors.length >= 8 && entry.authors.length <= 140, `RO grade ${grade} must list real authors`);
  assert.ok(entry.publisher.length >= 4 && entry.publisher.length <= 90, `RO grade ${grade} must list real publisher`);
  assert.match(entry.approvalOrder, /OM|CNEE/i, `RO grade ${grade} must cite ministerial approval order or CNEE list`);
  assert.match(entry.syllabus, /OM/i, `RO grade ${grade} must cite national syllabus order`);
  assert.match(entry.url, /^https:\/\//, `RO grade ${grade} URL must be https`);

  for (const key of Object.keys(entry)) {
    assert.ok(ALLOWED_META_KEYS.has(key), `Forbidden content key "${key}" in RO textbook metadata for grade ${grade}`);
    assert.ok(String(entry[key]).length <= 220, `Metadata field "${key}" too long on RO grade ${grade} (no copied prose allowed)`);
  }
}

assert.match(RO_TEXTBOOK_CORRELATION_2026['1'].authors, /Pițilă.*Mihăilescu|Mihăilescu.*Pițilă/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['4'].approvalOrder, /5348/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['5'].authors, /Perianu/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['7'].approvalOrder, /5420/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['9'].authors, /Ciupală/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['9'].publisher, /Intuitext/);
assert.match(RO_TEXTBOOK_CORRELATION_2026['9'].approvalOrder, /5779/);

for (const grade of ['1', '2', '3', '4', '9', '10', '11', '12']) {
  const stage = Number(grade) <= 4 ? 'beginner' : 'medium';
  const tb = roMathPackTextbooks(stage, grade);
  assert.equal(tb.length, 1);
  assert.ok(tb[0].publisher && tb[0].authors && tb[0].approvalOrder);
  assert.notEqual(tb[0].url, 'https://manuale.edu.ro/', `RO grade ${grade} pack must not fall back to generic portal root`);
}

// 2. Verify all 48 non-RO school-pack countries store metadata-only correlation (and VA stays null)
assert.equal(IMPLEMENTED_18_TEXTBOOK_COUNTRIES.length, 18);
assert.equal(ALL_SCHOOL_TEXTBOOK_COUNTRIES.length, 48);
assert.equal(mathTextbookCorrelationEntry('VA', 'beginner', 'external-curriculum'), null);
for (const country of ALL_SCHOOL_TEXTBOOK_COUNTRIES) {
  assert.equal(mathTextbookCorrelationEntry(country, 'advanced', '1'), null,
    `${country} university stage must not return a school textbook`);
}

// 3. Verify all 799 Mathematics decoupled packs across 50/50 countries (602 school + 197 university)
//    plus textbook & university invariants across ALL decoupled packs (Math + Sciences).
assert.equal(MATH_DECOUPLED_CURRICULUM_PACKS.length, 799, 'Total Mathematics decoupled packs must equal 799 across all 50 countries');
const mathSchoolPacks = MATH_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage !== 'advanced');
const mathUnivPacks = MATH_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage === 'advanced');
assert.equal(mathSchoolPacks.length, 602, 'Expected 602 Mathematics school packs across the 49 school systems (RO + 48)');
assert.equal(mathUnivPacks.length, 197, 'Expected 197 Mathematics university packs across all 50 European jurisdictions');
assert.equal(ALL_DECOUPLED_CURRICULUM_PACKS.length, MATH_DECOUPLED_CURRICULUM_PACKS.length + SCIENCE_DECOUPLED_CURRICULUM_PACKS.length);

const schoolPacks = ALL_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage !== 'advanced');
const univPacks = ALL_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage === 'advanced');

for (const pack of schoolPacks) {
  assert.ok(
    typeof pack.manualExample === 'string' && pack.manualExample.startsWith('https://'),
    `School pack ${pack.country}:${pack.stage}:${pack.grade} missing https manualExample`
  );
  assert.ok(
    Array.isArray(pack.textbooks) && pack.textbooks.length >= 1,
    `School pack ${pack.country}:${pack.stage}:${pack.grade} missing textbooks[]`
  );
  const first = pack.textbooks[0];
  assert.ok(first.title && first.publisher && first.approvalOrder && first.syllabus,
    `School pack ${pack.country}:${pack.stage}:${pack.grade} textbooks[0] missing structured reference fields`);
  assert.ok(typeof first.url === 'string' && first.url.startsWith('https://'));
  for (const [k, v] of Object.entries(first)) {
    assert.ok(String(v).length <= 260, `Textbook metadata ${pack.country}/${pack.grade}.${k} exceeds bibliographic length`);
  }
}

for (const pack of univPacks) {
  assert.equal(pack.manualExample, null, `University pack ${pack.country}:${pack.grade} must keep manualExample = null`);
}

// 4. Verify 0 KB Worker JS bundle leak & honest readiness contract
const html = await (await worker.fetch(new Request('https://correlation-check.local/'))).text();
assert.ok(!html.includes('ro-tb-math-9-intuitext-2026'), 'Textbook correlation registry must stay in decoupled packs, not Worker HTML');

const readiness = mathCurriculumReadiness();
assert.equal(readiness.fullyApproved, 0, 'Textbook reference correlation must not claim certified annual completion');

console.log(
  `PASS tests_math_ro_textbook_correlation_2026: 50/50 European countries correlated (${schoolPacks.length}/${schoolPacks.length} school packs have manualExample + textbooks; ${univPacks.length} university packs without textbook; total=${ALL_DECOUPLED_CURRICULUM_PACKS.length}; fullyApproved=${readiness.fullyApproved}).`
);
