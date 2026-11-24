import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import frontendWorker from './index.js';
import backendWorker from './backend.js';
import {POCKET_LANGUAGES} from './language_first_install.mjs';
import {EUROPEAN_UI_LOCALES, EUROPEAN_UI_TEXT_EXPRESSION} from './european_app_locales.mjs';
import {ACCOUNT_SCRIPT} from './account_settings_ui.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {MATH_READER_LOCALE_UI_SCRIPT} from './math_reader_locale_ui.mjs';

globalThis.crypto ??= webcrypto;

const res = await frontendWorker.fetch(new Request('https://mypocketai.test/'));
const html = await res.text();
assert.equal(res.status, 200);
assert.ok(html.length < 8_000_000, `Worker HTML must stay under 8,000,000 chars (got ${html.length})`);

const allCodes = [...POCKET_LANGUAGES];
assert.equal(allCodes.length, 44, 'Canonical POCKET_LANGUAGES must contain 44 languages');

// 1. Verify #languageSelect contains all 44 languages (including hy, ka, az)
const selectMatch = html.match(/<select\b[^>]*id="languageSelect"[^>]*>([\s\S]*?)<\/select>/);
assert.ok(selectMatch, '#languageSelect exists in SSR HTML');
const selectOptions = [...selectMatch[1].matchAll(/<option value="([^"]+)">/g)].map((m) => m[1]);
for (const code of allCodes) {
  assert.ok(selectOptions.includes(code), `#languageSelect must include <option value="${code}">`);
}

// 2. Verify inline scripts compile and evaluate EUROPEAN_UI_TEXT_EXPRESSION + UI_TEXT + speech locales
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const mainScript = scripts.find((s) => s.includes('function applyUiLanguage()') && s.includes('function learningLabel('));
assert.ok(mainScript, 'Main inline script found');
new vm.Script(mainScript);

const euroUi = vm.runInNewContext(`(${EUROPEAN_UI_TEXT_EXPRESSION})`);
const expectedEuroCodes = allCodes.filter((c) => !['ro', 'en', 'fr', 'de', 'it', 'es', 'pt', 'nl', 'ru', 'pl'].includes(c));
assert.equal(expectedEuroCodes.length, 34);

const requiredChromeKeys = [
  'subtitle', 'homeTitle', 'homeLead', 'home', 'conversations', 'tools', 'settings',
  'back', 'backShort', 'freeLabel', 'newChat', 'conversation', 'empty', 'emptyHint',
  'ready', 'settingsLanguage', 'settingsLanguageHint', 'speechHint', 'about',
  'versionPrefix', 'localHistory', 'clearHistory', 'localPrivacy', 'assistantLead',
  'searchLanguagePlaceholder', 'noLanguageMatch', 'chooseDomain', 'send', 'dictation', 'voice', 'listen'
];

for (const code of expectedEuroCodes) {
  const loc = euroUi[code];
  assert.ok(loc, `EUROPEAN_UI_TEXT must include ${code}`);
  assert.equal(loc.cards?.length, 6, `${code} must have 6 localized home cards`);
  for (const key of requiredChromeKeys) {
    assert.ok(typeof loc[key] === 'string' && loc[key].trim().length > 0, `${code} missing chrome key ${key}`);
    assert.notEqual(loc[key], 'Versiunea interfeței', `${code}.${key} must not leak Romanian`);
    assert.notEqual(loc[key], 'Conversațiile locale pot fi șterse din secțiunea Conversații.', `${code}.${key} must not leak Romanian`);
  }
}

// 3. Verify Speech BCP-47 locales cover all 44 languages
const speechSliceStart = mainScript.indexOf('const POCKET_BCP47_LOCALES=');
const speechSliceEnd = mainScript.indexOf('const POCKET_LANGUAGES=', speechSliceStart);
assert.ok(speechSliceStart > 0 && speechSliceEnd > speechSliceStart, 'POCKET_BCP47_LOCALES helper present');
const speechCtx = {state: {language: 'ro'}};
vm.runInNewContext(mainScript.slice(speechSliceStart, speechSliceEnd) + ';this.pocketSpeechLocale=pocketSpeechLocale;', speechCtx);
for (const code of allCodes) {
  const tag = speechCtx.pocketSpeechLocale(code);
  assert.match(tag, /^[a-z]{2}-[A-Z]{2}$/, `BCP-47 speech tag for ${code}: ${tag}`);
  if (code !== 'ro') assert.notEqual(tag, 'ro-RO', `${code} speech tag must not fall back to ro-RO`);
}

// 4. Verify Account i18n covers all 44 languages
assert.ok(ACCOUNT_SCRIPT.includes('window.pocketAccountApplyLanguage'), 'Account language hook exported');
for (const code of allCodes) {
  assert.match(ACCOUNT_SCRIPT, new RegExp(`"${code}":\\[`), `ACCOUNT_SCRIPT must localize ${code}`);
}

// 5. Verify Education label funnel (eduUiLabel + learningLabel) across all 44 languages
assert.ok(mainScript.includes('const EDUCATION_UI_TRANSLATIONS='), 'EDUCATION_UI_TRANSLATIONS wired into main bundle');
new vm.Script(EDUCATION_COUNTRY_UI_SCRIPT);

const labelBox = {
  state: {language: 'ro'},
  window: {__pocketEuropeanUiText: euroUi},
  localStorage: {getItem: () => null, setItem: () => {}, removeItem: () => {}},
  document: {
    documentElement: {lang: 'ro'},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  MutationObserver: class { observe() {} disconnect() {} },
  fetch: async () => ({ok: false}),
  AbortController,
  setTimeout: () => 0,
  clearTimeout: () => {}
};
labelBox.globalThis = labelBox;
vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT + '\n;globalThis.EDUCATION_UI_TRANSLATIONS=EDUCATION_UI_TRANSLATIONS;', labelBox);

const learnStart = mainScript.indexOf('function learningLabel(ro,en){');
const learnEnd = mainScript.indexOf('function renderLearningSubjects(){');
vm.runInNewContext(mainScript.slice(learnStart, learnEnd), labelBox);

for (const code of allCodes) {
  labelBox.state.language = code;
  const openLessons = labelBox.learningLabel('Deschide lecțiile', 'Open lessons');
  const countryLbl = labelBox.eduUiLabel('Țara', 'Country');
  const checkBtn = labelBox.learningLabel('✓ Verifică răspunsul', '✓ Check my answer');
  const grade5 = labelBox.learningLabel('Clasa 5', 'Grade 5');
  assert.ok(openLessons && countryLbl && checkBtn && grade5, `${code} Education labels must be non-empty`);
  if (code !== 'ro') {
    assert.notEqual(openLessons, 'Deschide lecțiile', `${code} must not return Romanian 'Deschide lecțiile'`);
    assert.notEqual(countryLbl, 'Țara', `${code} must not return Romanian 'Țara'`);
    assert.notEqual(checkBtn, '✓ Verifică răspunsul', `${code} must not return Romanian '✓ Verifică răspunsul'`);
    assert.notEqual(grade5, 'Clasa 5', `${code} must localize 'Clasa 5' (got ${grade5})`);
  }
}

// 6. Verify eduValidateTranslation handles prose numeral formatting & Roman numerals while guarding quizzes
const validateProseDec = labelBox.eduValidateTranslation(
  {body: 'Viteza medie este 2,5 m/s pe o distanță de 1 000 m în Clasa a V-a (secolul al XIX-lea).'},
  {body: 'The average speed is 2.5 m/s over a distance of 1,000 m in Grade 5 (19th century).'},
  'mixed'
);
assert.equal(validateProseDec, true, 'Prose validation must accept 2,5 -> 2.5, 1 000 -> 1,000, and RO Roman numerals -> Arabic');

const validateQuizReject = labelBox.eduValidateTranslation(
  {question: 'Cât face 6 + 6?', choices: ['10', '12', '14']},
  {question: 'What is 6 + 6?', choices: ['10', '13', '14']},
  'mixed'
);
assert.equal(validateQuizReject, false, 'Quiz validation must reject altered numbers in choices');

// 7. Verify math_reader_locale_ui.mjs universal Education reader & module contracts
new vm.Script(MATH_READER_LOCALE_UI_SCRIPT);
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes('__pocketOrigText'), 'Lossless original text preservation across multi-hop language switches');
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes('data-edu-translated'), 'Skips pages already pre-translated by educationOpenPagedLesson');
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes('pocketScheduleEducationLocaleScan'), 'Exports immediate Education locale rescan hook');

// 8. Verify backend.js dedicated education_translate (> 4000 chars) & 44-language routing
const aiCalls = [];
const mockEnv = {
  AI: {
    run: async (model, opts) => {
      aiCalls.push({model, opts});
      const userMsg = opts?.messages?.find((m) => m.role === 'user')?.content || '';
      if (userMsg.includes('"lessonBody"')) {
        return {response: JSON.stringify({title: 'Հանրահաշիվ', lessonBody: 'Թարգմանված դաս ' + 'ա'.repeat(100)})};
      }
      return {
        response: [
          'Ohm\'s law states that the electric current I through an ohmic conductor is directly proportional to the voltage U across its ends and inversely proportional to its resistance R: I = U / R.',
          'Example 1: If U = 12 V and R = 4 Ω, then I = 12 V / 4 Ω = 3 A. Check the units: 1 V / 1 Ω = 1 A, and watch out for mA vs A conversions.',
          'Example 2: If I = 0.5 A through R = 20 Ω, then U = I × R = 0.5 A × 20 Ω = 10 V. Practice exercise: compute R when U = 9 V and I = 1.5 A.'
        ].join('\n\n')
      };
    }
  }
};

const longPayload = JSON.stringify({
  title: 'Algebră și ecuații',
  lessonBody: 'Explicație detaliată pentru elevi. '.repeat(220) // > 7,500 chars (> 4,000 chat limit!)
});
assert.ok(longPayload.length > 7000, 'Test payload exceeds 4,000-char chat limit');

const transResp = await backendWorker.fetch(
  new Request('https://unit.test/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      module: 'education_translate',
      education_translate: true,
      language: 'hy',
      message: longPayload,
      history: []
    })
  }),
  mockEnv
);
const transJson = await transResp.json();
assert.equal(transResp.status, 200, 'education_translate must accept >4000-char payloads up to 24,000 chars');
assert.equal(transJson.status, 'success');
assert.equal(transJson.language, 'hy');
assert.match(aiCalls.at(-1).opts.messages[0].content, /Armenian \(language code: hy\)/);

for (const testCase of [
  {module: 'learning', language: 'ka', message: '2x + 4 = 10', expectSys: /Georgian \(language code ka\)/},
  {module: 'education_study', education_subject: 'history', language: 'az', message: 'Istoria modernă', expectSys: /Azerbaijani \(az\)/},
  {module: 'education_study', education_subject: 'physics', education_activity: 'solve', language: 'fi', message: 'Legea lui Ohm: U=12V, R=4 ohm', expectSys: /Finnish \(user-interface language code fi\)/},
  {module: 'education_study', education_subject: 'school_admission', education_activity: 'examples', language: 'sv', message: 'Test de admitere', expectSys: /Swedish \(language code sv\)/},
  {module: 'education_study', education_subject: 'language_literature', education_activity: 'define', language: 'el', message: 'Metaforă', expectSys: /Greek \(language code el\)/},
  {module: 'assistant', language: 'rm', message: 'Explain photosynthesis briefly.', expectLang: 'rm'}
]) {
  const r = await backendWorker.fetch(
    new Request('https://unit.test/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...testCase, history: []})
    }),
    mockEnv
  );
  const j = await r.json();
  assert.equal(r.status, 200, `Backend 200 for ${testCase.module}/${testCase.language}`);
  assert.equal(j.status, 'success');
  if (testCase.expectLang) assert.equal(j.language, testCase.expectLang);
  if (testCase.expectSys) assert.match(aiCalls.at(-1).opts.messages[0].content, testCase.expectSys);
}

console.log(`PASS 44-language localization suite: all ${allCodes.length} languages verified across UI, Account, Speech, Education & Backend (HTML=${html.length} chars)`);
