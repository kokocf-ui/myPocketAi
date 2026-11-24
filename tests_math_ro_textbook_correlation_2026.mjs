// Verification for Mathematics school textbook & curriculum reference correlation (2026/27):
// 1. Romania Grades I–XII (math_ro_textbook_correlation_2026.mjs)
// 2. All 18 other implemented countries (math_textbook_correlation_all_2026.mjs)
// 3. Decoupled curriculum packs (232/232 school packs carry manualExample + textbooks[];
//    73/73 university packs stay manualExample === null; total = 305)
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
  mathTextbookCorrelationEntry
} from './math_textbook_correlation_all_2026.mjs';
import { ALL_DECOUPLED_CURRICULUM_PACKS } from './curriculum_pack_catalog.mjs';
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

  // Ensure no copied prose / exercises / formulas / worked examples are stored
  for (const key of Object.keys(entry)) {
    assert.ok(ALLOWED_META_KEYS.has(key), `Forbidden content key "${key}" in RO textbook metadata for grade ${grade}`);
    assert.ok(String(entry[key]).length <= 220, `Metadata field "${key}" too long on RO grade ${grade} (no copied prose allowed)`);
  }
}

// Specific verified Romanian editions cited in audit
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

// 2. Verify all 18 non-RO implemented countries store metadata-only correlation
assert.equal(IMPLEMENTED_18_TEXTBOOK_COUNTRIES.length, 18);
for (const country of IMPLEMENTED_18_TEXTBOOK_COUNTRIES) {
  assert.equal(mathTextbookCorrelationEntry(country, 'advanced', '1'), null,
    `${country} university stage must not return a school textbook`);
}

// 3. Verify all 305 decoupled packs: 232/232 school packs correlated, 73/73 university without manualExample
assert.equal(ALL_DECOUPLED_CURRICULUM_PACKS.length, 305, 'Total decoupled packs must remain 305');
const schoolPacks = ALL_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage !== 'advanced');
const univPacks = ALL_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage === 'advanced');
assert.equal(schoolPacks.length, 232, 'Expected 232 school packs across the 19 implemented countries');
assert.equal(univPacks.length, 73, 'Expected 73 university packs across the 19 implemented countries');

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
  `PASS tests_math_ro_textbook_correlation_2026: RO I–XII + 18 countries correlated (${schoolPacks.length}/${schoolPacks.length} school packs have manualExample + textbooks; ${univPacks.length} university packs without textbook; total=${ALL_DECOUPLED_CURRICULUM_PACKS.length}; fullyApproved=${readiness.fullyApproved}).`
);
