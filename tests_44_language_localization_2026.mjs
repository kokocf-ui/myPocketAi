import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import frontendWorker from './index.js';
import backendWorker from './backend.js';
import {POCKET_LANGUAGES} from './language_first_install.mjs';
import {EUROPEAN_UI_LOCALES, EUROPEAN_UI_TEXT_EXPRESSION} from './european_app_locales.mjs';
import {ACCOUNT_SCRIPT} from './account_settings_ui.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {MATH_THEOREMS_UI_SCRIPT} from './math_theorems_ui.mjs';
import {MATH_READER_LOCALE_UI_SCRIPT} from './math_reader_locale_ui.mjs';

globalThis.crypto ??= webcrypto;

const res = await frontendWorker.fetch(new Request('https://mypocketai.test/'));
const html = await res.text();
assert.equal(res.status, 200);
// The procedural 2026 entertainment generator contributes additional dictionary and UI characters to the inlined offline UI.
// Keep a strict size ceiling while allowing that isolated feature; no locale behavior is changed.
assert.ok(html.length < 8_060_000, `Worker HTML must stay under 8,060,000 chars (got ${html.length})`);

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

  // Screen 1: Education Home title + all 8 subject titles & descriptions across all 44 languages
  const eduHome = labelBox.learningLabel('Învățare și educație', 'Learning and education');
  if (code !== 'ro') assert.notEqual(eduHome, 'Învățare și educație', `${code} must localize Education header`);
  if (code !== 'en') assert.notEqual(eduHome, 'Learning and education', `${code} must not fall back to English 'Learning and education'`);
  for (const [roT, enT, roD, enD] of [
    ['Limbi străine', 'Languages', 'Vocabular, pronunție și conversație.', 'Vocabulary, pronunciation and conversation.'],
    ['Matematică', 'Mathematics', 'Calcule, ecuații și geometrie.', 'Calculations, equations and geometry.'],
    ['Științe', 'Sciences', 'Fizică, chimie, biologie și astronomie.', 'Physics, chemistry, biology and astronomy.'],
    ['Istorie și geografie', 'History and geography', 'Civilizații, țări și hărți.', 'Civilizations, countries and maps.'],
    ['Limbă și literatură', 'Language and literature', 'Gramatică, lectură și exprimare.', 'Grammar, reading and writing.'],
    ['Informatică', 'Computing', 'Programare și competențe digitale.', 'Programming and digital skills.'],
    ['Pregătire examene', 'Exam preparation', 'Teste, simulări și recapitulări.', 'Tests, mock exams and revision.'],
    ['Cursuri practice', 'Practical courses', 'Finanțe, meserii și antreprenoriat.', 'Finance, careers and enterprise.']
  ]) {
    const t = labelBox.learningLabel(roT, enT);
    const d = labelBox.learningLabel(roD, enD);
    assert.ok(t && d, `${code} subject card '${roT}' must be localized`);
    if (code !== 'ro') {
      assert.notEqual(t, roT, `${code} subject title '${roT}' must not leak Romanian`);
      assert.notEqual(d, roD, `${code} subject desc '${roD}' must not leak Romanian`);
    }
    if (code !== 'en') {
      assert.notEqual(d, enD, `${code} subject desc '${enD}' must not leak English`);
    }
  }

  // Screen 2 & 3 & 4 chrome + structural lesson headings across all 44 languages
  const chooseStage = labelBox.learningLabel('Alege etapa de studiu', 'Choose your study stage');
  const lawsBtn = labelBox.learningLabel('📚 Legi și teoreme', '📚 Laws and theorems');
  const chooseLesson = labelBox.learningLabel('Alege lecția', 'Choose a lesson');
  const pageWord = labelBox.learningLabel('Pagina ', 'Page ');
  if (code !== 'ro') {
    assert.notEqual(chooseStage, 'Alege etapa de studiu', `${code} stage heading must not leak Romanian`);
    assert.notEqual(lawsBtn, '📚 Legi și teoreme', `${code} laws button must not leak Romanian`);
    assert.notEqual(chooseLesson, 'Alege lecția', `${code} lesson heading must not leak Romanian`);
    if (!['it', 'nl', 'rm'].includes(code)) {
      assert.notEqual(pageWord, 'Pagina ', `${code} page counter must not leak Romanian`);
    }
    if (code !== 'en' && code !== 'fr') {
      assert.notEqual(pageWord, 'Page ', `${code} page counter must not leak English`);
    }
  }
  if (code !== 'en') {
    assert.notEqual(chooseStage, 'Choose your study stage', `${code} stage heading must not leak English`);
    assert.notEqual(lawsBtn, '📚 Laws and theorems', `${code} laws button must not leak English`);
    assert.notEqual(chooseLesson, 'Choose a lesson', `${code} lesson heading must not leak English`);
  }
}

// 5b. Verify Spain LOMLOE + Spanish UI (Screens 1–4 regression check)
labelBox.state.language = 'es';
assert.equal(labelBox.learningLabel('Învățare și educație', 'Learning and education'), 'Aprendizaje y educación');
assert.equal(labelBox.learningLabel('Matematică', 'Mathematics'), 'Matemáticas');
assert.equal(labelBox.learningLabel('📚 Legi și teoreme', '📚 Laws and theorems'), '📚 Leyes y teoremas');
assert.equal(labelBox.eduFormatCountryStageLabel('ES', 'primary', 'Primar', 'Primary'), 'Educación Primaria · 3 ciclos, 6 cursos');
assert.equal(labelBox.eduFormatCountryStageLabel('ES', 'lower', 'Gimnaziu', 'Lower secondary'), 'ESO · 4 cursos, Matemáticas A/B en 4.º');
assert.equal(labelBox.eduFormatCountryStageLabel('ES', 'intermediate', 'Liceu', 'Upper secondary'), 'Bachillerato · 2 cursos, según modalidad');
assert.equal(
  labelBox.eduDetectLessonSourceLang({
    id: 'math-es-lomloe-eso4a-algebra-1',
    title: 'Presupuesto y porcentaje de descuento',
    enTitle: 'Discount percentages in a budget',
    definition: 'Un descuento del p% reduce el precio inicial.'
  }),
  'es'
);
const sampleLessonRaw = [
  '# Definiție și explicație',
  'Definición: Un descuento del 15% sobre 80 € deja un precio final de 68 €.',
  '# Formula și notațiile',
  'Nu este necesară o formulă separată pentru acest concept.',
  '# Exemplu rezolvat, pas cu pas',
  'Ejemplo resuelto: 80 × (1 - 0,15) = 68 €.',
  '# Exersează singur',
  '1) Calcula el 20% de descuento sobre 50 €.',
  '# Atenție',
  'Fiecare operație trebuie justificată și verificată în context. Nu deduce măsuri, valori sau ipoteze care nu au fost precizate.',
  '# Încadrare curriculară',
  'Material orientativ de învățare; repartizarea oficială diferă după țară, instituție și an școlar.',
  'Țară, clasă/an, ramură: ES, ESO4-A · Algebră.'
].join('\n');
const localizedEsLesson = labelBox.educationLocalizeLessonStructure(sampleLessonRaw, 'es');
assert.ok(localizedEsLesson.includes('# Definición y explicación'));
assert.ok(localizedEsLesson.includes('# Fórmula y notación'));
assert.ok(localizedEsLesson.includes('No se necesita una fórmula aparte para este concepto.'));
assert.ok(localizedEsLesson.includes('# Ejemplo resuelto paso a paso'));
assert.ok(localizedEsLesson.includes('# Practica por tu cuenta'));
assert.ok(localizedEsLesson.includes('# Atención'));
assert.ok(localizedEsLesson.includes('# Marco curricular'));
assert.ok(localizedEsLesson.includes('País: ES, ESO4-A · Álgebra.'));
assert.ok(!localizedEsLesson.includes('Definiție și explicație'));
assert.ok(!localizedEsLesson.includes('Formula și notațiile'));
assert.equal(labelBox.eduDetectProseLang(localizedEsLesson), 'es');

// 6. Verify eduValidateTranslation handles prose numeral formatting, trailing decimal zeros, equations & Roman numerals while guarding quizzes
const validateProseDec = labelBox.eduValidateTranslation(
  {body: 'Viteza medie este 2,50 m/s (0,20 km) pe o distanță de 1 000 m în Clasa a V-a (secolul al XIX-lea), iar 2 + 3 = 5 în un pas simplu.'},
  {body: 'The average speed is 2.5 m/s (0.2 km) over a distance of 1,000 m in Grade 5 (19th century), and 2 + 3 = 5 in 1 simple step.'},
  'mixed'
);
assert.equal(validateProseDec, true, 'Prose validation must accept 2,50 -> 2.5, 0,20 -> 0.2, 1 000 -> 1,000, equations, and RO Roman numerals -> Arabic');

const validateRomanTitle = labelBox.eduValidateTranslation(
  {titles: ['Ecuații și inecuații de gradul I și al II-lea']},
  {titles: ['Ecuaciones e inecuaciones de 1.º y 2.º grado']}
);
assert.equal(validateRomanTitle, true, 'Roman-numeral title gradul I și al II-lea -> 1.º y 2.º must validate');

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

// 9. Verify Settings DOM (#pocketLocalPrivacyNote + outside-IIFE #pocketAccountOpen) across all 44 languages
assert.match(html, /<p id="pocketLocalPrivacyNote" class="small">/, 'Settings privacy note must have #pocketLocalPrivacyNote');
assert.ok(mainScript.includes('window.pocketAccountApplyLanguage?.(state.language)'), 'applyUiLanguage must pass state.language into pocketAccountApplyLanguage');
assert.ok(mainScript.includes("const privEl=$('pocketLocalPrivacyNote')"), 'applyUiLanguage must target #pocketLocalPrivacyNote');

{
  // Outside-IIFE simulation: lexical `state` is intentionally NOT defined!
  const elStore = new Map();
  const getEl = (id) => {
    if (!elStore.has(id)) {
      elStore.set(id, {
        id,
        textContent: id === 'pocketAccountOpen' ? 'Cont' : '',
        placeholder: '',
        hidden: false,
        options: [{textContent: ''}, {textContent: ''}, {textContent: ''}],
        dataset: {},
        style: {},
        classList: {add() {}, remove() {}, toggle() {}, contains: () => false},
        setAttribute() {},
        addEventListener() {},
        querySelector: () => null,
        querySelectorAll: () => []
      });
    }
    return elStore.get(id);
  };
  const acctBox = {
    window: {},
    document: {
      documentElement: {lang: 'ro'},
      getElementById: getEl,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {}
    },
    localStorage: {getItem: () => null, setItem() {}, removeItem() {}},
    fetch: async () => ({ok: false}),
    CustomEvent: class { constructor(t) { this.type = t; } },
    setTimeout: () => 0,
    clearTimeout() {}
  };
  acctBox.window.document = acctBox.document;
  acctBox.window.localStorage = acctBox.localStorage;
  vm.runInNewContext(ACCOUNT_SCRIPT, acctBox);
  for (const code of allCodes) {
    acctBox.document.documentElement.lang = code;
    acctBox.window.pocketAccountApplyLanguage(code);
    const label = getEl('pocketAccountOpen').textContent;
    assert.ok(label && label.trim().length > 0, `Account button label empty for ${code}`);
    if (code !== 'ro') {
      assert.notEqual(label, 'Cont', `#pocketAccountOpen must not remain Romanian 'Cont' in ${code}`);
    }
  }
  acctBox.window.pocketAccountApplyLanguage('nl');
  assert.equal(getEl('pocketAccountOpen').textContent, 'Account');
  acctBox.window.pocketAccountApplyLanguage('it');
  assert.equal(getEl('pocketAccountOpen').textContent, 'Account');
}

// 10. Verify backend education_translate runs fast 8B directly AND repairs unescaped 0x0A newlines without 70B fallback
{
  const newlineCalls = [];
  const rawNewlineEnv = {
    AI: {
      run: async (model, opts) => {
        newlineCalls.push({model, opts});
        // Simulate Llama 8B returning literal 0x0A newline inside JSON string value
        return {
          response: '{\n  "title": "Bewerkingen met machten",\n  "lines": ["Regel 1:\nZelfde grondtal telt exponenten op.", "Voorbeeld: 2, 3, 2, 4"]\n}'
        };
      }
    }
  };
  const r = await backendWorker.fetch(
    new Request('https://unit.test/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        module: 'assistant',
        education_translate: true,
        language: 'nl',
        message: 'Translate JSON: {"title":"Operații cu puteri","lines":["Regula 1","Exemplu: 2,3,2,4"]}',
        history: []
      })
    }),
    rawNewlineEnv
  );
  const j = await r.json();
  assert.equal(r.status, 200);
  assert.equal(j.status, 'success');
  assert.equal(newlineCalls.length, 1, 'Loose JSON control-char repair must avoid slow 70B fallback');
  assert.equal(newlineCalls[0].model, '@cf/meta/llama-3.1-8b-instruct-fast');
  const parsedReply = JSON.parse(j.reply);
  assert.equal(parsedReply.title, 'Bewerkingen met machten');
  assert.equal(parsedReply.lines.length, 2);
}

// 11. Verify NL/IT validator & language detector edge cases (multi-comma lists, ordinals, hybrid IT lesson, Revenire)
for (const code of allCodes) {
  labelBox.state.language = code;
  const rev = labelBox.eduUiLabel('Revenire', 'Back');
  assert.ok(rev && rev.trim().length > 0);
  if (code !== 'ro') assert.notEqual(rev, 'Revenire', `${code} must localize 'Revenire'`);
}
labelBox.state.language = 'nl';
assert.equal(labelBox.eduUiLabel('Revenire', 'Back'), 'Terug');
labelBox.state.language = 'it';
assert.equal(labelBox.eduUiLabel('Revenire', 'Back'), 'Indietro');

assert.equal(
  labelBox.eduValidateTranslation(
    {lines: ['Într-un șir de date 2,3,2,4 modul este valoarea cea mai frecventă.']},
    {lines: ['In een reeks gegevens 2, 3, 2, 4 is de modus de meest voorkomende waarde.']}
  ),
  true,
  'Multi-comma data list 2,3,2,4 -> 2, 3, 2, 4 must validate'
);
assert.equal(
  labelBox.eduValidateTranslation(
    {titles: ['Ecuații diferențiale liniare de ordinul al doilea']},
    {titles: ['Equazioni differenziali lineari del 2° ordine']}
  ),
  true,
  'Word ordinal al doilea -> 2° in title must validate'
);

const hybridItLesson = {
  id: 'it-m1-stat-1',
  title: 'Raccogliamo e leggiamo i dati',
  definition: 'Un tabel sau grafic arată câte obiecte sunt în fiecare grup și ne ajută să comparăm rapid.'
};
assert.equal(labelBox.eduDetectLessonSourceLang(hybridItLesson), 'it', 'Italian lesson title detected as it');
const hybridLocalizedBody = labelBox.educationLocalizeLessonStructure(
  '## 1. Definiție și explicație\n' + hybridItLesson.definition + '\n\n# Contextul de studiu\nIT · M1',
  'it'
);
assert.ok(hybridLocalizedBody.includes('## 1. Definizione e spiegazione'));
assert.ok(hybridLocalizedBody.includes('# Contesto di studio'));
assert.equal(labelBox.eduDetectProseLang(hybridLocalizedBody), 'ro', 'Hybrid Italian-heading + Romanian-body must still detect Romanian prose so body translates');

// 12. Verify Laws & Theorems (math_theorems_ui.mjs) + Paged Lesson Reader (educationOpenPagedLesson) in NL & IT
{
  function makeElem(tag) {
    const attrs = new Map();
    return {
      tagName: String(tag || 'div').toUpperCase(),
      id: '',
      className: '',
      type: '',
      value: '',
      title: '',
      hidden: false,
      disabled: false,
      scrollTop: 0,
      dataset: {},
      style: {cssText: ''},
      children: [],
      parentNode: null,
      isConnected: true,
      onclick: null,
      onchange: null,
      _text: '',
      get textContent() {
        if (this.children.length === 0) return this._text;
        return (this._text || '') + this.children.map((c) => c.textContent).join('');
      },
      set textContent(v) {
        this._text = String(v ?? '');
        this.children = [];
      },
      append(...nodes) {
        for (const n of nodes) {
          if (n && typeof n === 'object') {
            n.parentNode = this;
            this.children.push(n);
          }
        }
      },
      prepend(...nodes) {
        for (let i = nodes.length - 1; i >= 0; i--) {
          const n = nodes[i];
          if (n && typeof n === 'object') {
            n.parentNode = this;
            this.children.unshift(n);
          }
        }
      },
      replaceChildren(...nodes) {
        this.children = [];
        this._text = '';
        this.append(...nodes);
      },
      remove() {
        this.isConnected = false;
        if (this.parentNode) {
          this.parentNode.children = this.parentNode.children.filter((x) => x !== this);
        }
      },
      setAttribute(k, v) {
        attrs.set(k, String(v));
        if (k.startsWith('data-')) {
          const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          this.dataset[camel] = String(v);
        }
      },
      getAttribute(k) { return attrs.has(k) ? attrs.get(k) : null; },
      hasAttribute(k) { return attrs.has(k); },
      removeAttribute(k) { attrs.delete(k); },
      addEventListener() {},
      removeEventListener() {},
      scrollIntoView() {},
      showModal() { attrs.set('open', ''); },
      close() { attrs.delete('open'); this.isConnected = false; },
      classList: {add() {}, remove() {}, contains: () => true},
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const store = new Map();
  const moduleContent = makeElem('div');
  moduleContent.id = 'moduleContent';
  const viewModule = makeElem('section');
  viewModule.id = 'view-module';
  const bodyEl = makeElem('body');
  bodyEl.append(viewModule, moduleContent);

  let fetchCalls = 0;
  let pendingFetchResolvers = [];
  const domBox = {
    state: {language: 'nl', speaking: false},
    CLIENT_CONFIG: {apiUrl: 'https://api.mypocketai.test/api/chat'},
    mathJourney: {stage: 'stages', grade: 'V2', topic: 'algebra'},
    window: {innerWidth: 390, __pocketEuropeanUiText: euroUi, addEventListener() {}, removeEventListener() {}},
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k)
    },
    document: {
      body: bodyEl,
      documentElement: {lang: 'nl'},
      createElement: makeElem,
      getElementById: (id) => {
        if (id === 'moduleContent') return moduleContent;
        if (id === 'view-module') return viewModule;
        return bodyEl.children.find((c) => c.id === id) || null;
      },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {}
    },
    MutationObserver: class { observe() {} disconnect() {} },
    AbortController,
    setTimeout: (fn) => { fn(); return 1; },
    clearTimeout() {},
    requestAnimationFrame: (fn) => { fn(); return 1; },
    eduAttachPrintAction() {},
    stopSpeech() {},
    speakText: () => false,
    scienceAttachLessonReview() {},
    fetch: async (_url, init) => {
      fetchCalls++;
      const reqBody = JSON.parse(init.body);
      const marker = 'Input JSON: ';
      const idx = reqBody.message.indexOf(marker);
      const inputObj = JSON.parse(reqBody.message.slice(idx + marker.length));
      const langPrefix = reqBody.language === 'it' ? 'IT' : 'NL';
      const out = {};
      for (const [k, v] of Object.entries(inputObj)) {
        if (Array.isArray(v)) out[k] = v.map((s) => `${langPrefix}: ${s}`);
        else out[k] = `${langPrefix}: ${v}`;
      }
      await new Promise((resolve) => pendingFetchResolvers.push(resolve));
      return {ok: true, json: async () => ({status: 'success', reply: JSON.stringify(out)})};
    }
  };
  domBox.globalThis = domBox;

  vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT, domBox);
  vm.runInNewContext(mainScript.slice(learnStart, learnEnd), domBox);
  const cleanStart = mainScript.indexOf('function educationCleanLessonLine(');
  const pagedEnd = mainScript.indexOf('function scienceChemistryUpperLessonEntries(');
  assert.ok(cleanStart > 0 && pagedEnd > cleanStart, 'Found educationCleanLessonLine..educationOpenPagedLesson slice');
  vm.runInNewContext(mainScript.slice(cleanStart, pagedEnd), domBox);

  // 12a. Open Laws & Theorems in Dutch ('nl'): zero raw Romanian before OR after fetch!
  domBox.mathTheoryQuickReference();
  const panel = moduleContent.children[1];
  const optionsList = panel.children[4];
  assert.ok(optionsList.children.length >= 200, 'All 211 theorem buttons rendered');
  assert.ok(
    optionsList.children.every((b) => b.textContent === '…'),
    'Uncached theorem buttons in NL must show ellipsis placeholder, never raw Romanian'
  );
  assert.equal(fetchCalls, 1, 'Only 1 priority batch of 15 visible theorems fires initially (no 11-batch stampede)');

  // Flush first priority slice + sequential background slices
  while (pendingFetchResolvers.length) {
    const batch = pendingFetchResolvers.splice(0);
    batch.forEach((r) => r());
    await new Promise((r) => setImmediate(r));
  }
  await new Promise((r) => setImmediate(r));
  assert.ok(
    optionsList.children.slice(0, 15).every((b) => b.textContent.startsWith('NL: ')),
    'Visible theorem titles translated into Dutch'
  );

  // Reopen Laws & Theorems in Dutch: 0ms instant from per-string cache with 0 network calls!
  const beforeReopenCalls = fetchCalls;
  domBox.mathTheoryQuickReference();
  const reopenedList = moduleContent.children[1].children[4];
  assert.equal(fetchCalls, beforeReopenCalls, 'Reopening Laws & Theorems uses 0ms per-string cache');
  assert.ok(reopenedList.children[0].textContent.startsWith('NL: '));

  // 12b. Open Paged Lesson Reader on hybrid Italian lesson ('it') — Italian title kept, Romanian body hidden until translated!
  domBox.state.language = 'it';
  const dialog = domBox.educationOpenPagedLesson(
    'Raccogliamo e leggiamo i dati',
    '# Raccogliamo e leggiamo i dati\n\n# Definiție și explicație\nUn tabel arată frecvențele din șirul 2,3,2,4.\n\na + b = c'
  );
  const headingEl = dialog.children[1];
  const contentEl = dialog.children[2];
  assert.equal(headingEl.textContent, 'Raccogliamo e leggiamo i dati', 'Native Italian lesson title shown immediately');
  assert.equal(
    contentEl.textContent,
    'Traduzione della lezione…',
    'While translating Page 0, reader shows localized Italian loading message instead of raw Romanian'
  );
  while (pendingFetchResolvers.length) {
    const batch = pendingFetchResolvers.splice(0);
    batch.forEach((r) => r());
    await new Promise((r) => setImmediate(r));
  }
  await new Promise((r) => setImmediate(r));
  assert.ok(contentEl.textContent.includes('Definizione e spiegazione'), 'Section heading localized in Italian');
  assert.ok(contentEl.textContent.includes('IT: Un tabel arată frecvențele din șirul 2,3,2,4.'), 'Romanian prose line translated into Italian');
  assert.ok(contentEl.textContent.includes('a + b = c'), 'Mathematical formula preserved untouched');
  assert.ok(!contentEl.textContent.includes('Traduzione della lezione…'), 'Reader never stays stuck on Traduzione della lezione…');
}

console.log(`PASS 44-language localization suite: all ${allCodes.length} languages verified across UI, Settings, Account, Theorems, Paged Reader & Backend (HTML=${html.length} chars)`);
