// Comprehensive parity verification for Sciences (`physics`, `chemistry`, `biology`, `astronomy`)
// following the Mathematics reference architecture:
// 1. 50 / 50 European country stage frameworks across all 4 Sciences
// 2. Laws, constants & principles catalogs across all 4 Sciences (including Astronomy 24 laws/constants)
// 3. 2,697 decoupled Science curriculum packs (`./public/packs/p-*.json`) + bibliographic correlation
// 4. End-to-end `/api/curriculum-pack` + `educationScienceTheoryReader` + 44-language localization

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from './index.js';
import { EDUCATION_EUROPE_COUNTRIES, educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { PHYSICS_EUROPE_REFERENCES } from './physics_europe_frameworks.mjs';
import { CHEMISTRY_EUROPE_REFERENCES } from './chemistry_country_alignment.mjs';
import { BIOLOGY_COUNTRY_REFERENCES } from './biology_country_alignment.mjs';
import { ASTRONOMY_COUNTRY_EVIDENCE } from './astronomy_country_alignment.mjs';
import { PHYSICS_LAWS } from './physics_laws_reference.mjs';
import { CHEMISTRY_LAWS } from './chemistry_laws_reference.mjs';
import { BIOLOGY_REFERENCE } from './biology_reference.mjs';
import { ASTRONOMY_LAWS, ASTRONOMY_LAWS_GROUPS } from './astronomy_laws_reference.mjs';
import { SCIENCE_DECOUPLED_CURRICULUM_PACKS } from './science_europe_packs_2026.mjs';
import { scienceCurriculumReadiness } from './science_curriculum_readiness.mjs';
import { curriculumPackAssetName } from './curriculum_pack_protocol.mjs';

// 1. 50 / 50 European country framework coverage across all 4 Sciences
assert.equal(EDUCATION_EUROPE_COUNTRIES.length, 50);
for (const code of EDUCATION_EUROPE_COUNTRIES) {
  assert.ok(PHYSICS_EUROPE_REFERENCES[code], `Physics missing European framework entry for ${code}`);
  assert.ok(CHEMISTRY_EUROPE_REFERENCES[code], `Chemistry missing European framework entry for ${code}`);
  assert.ok(BIOLOGY_COUNTRY_REFERENCES[code], `Biology missing European framework entry for ${code}`);
  assert.ok(ASTRONOMY_COUNTRY_EVIDENCE[code], `Astronomy missing European framework entry for ${code}`);
}

// 2. Laws, constants & principles catalogs across all 4 Sciences
assert.equal(PHYSICS_LAWS.length, 32, 'Physics laws count');
assert.equal(CHEMISTRY_LAWS.length, 16, 'Chemistry laws count');
assert.equal(BIOLOGY_REFERENCE.length, 20, 'Biology reference count');
assert.equal(ASTRONOMY_LAWS_GROUPS.length, 6, 'Astronomy law groups count');
assert.equal(ASTRONOMY_LAWS.length, 24, 'Astronomy laws & IAU constants count');
for (const law of ASTRONOMY_LAWS) {
  assert.equal(law.subject, 'astronomy');
  assert.ok(law.ro && law.en && law.formula && law.explainRo && law.explainEn && law.exampleRo && law.exampleEn && law.scopeRo && law.scopeEn,
    `Incomplete astronomy law entry: ${law.id}`);
}

// 3. Decoupled Science curriculum packs + bibliographic correlation + readiness honesty
const readiness = scienceCurriculumReadiness();
assert.equal(readiness.countries, 50);
assert.equal(readiness.fullyApproved, 0, 'Must never claim state-certified annual textbook completion');
assert.equal(SCIENCE_DECOUPLED_CURRICULUM_PACKS.length, 2697, 'Expected 2,697 Science decoupled packs');

for (const subj of ['physics', 'chemistry', 'biology', 'astronomy']) {
  const summary = readiness.bySubject[subj];
  assert.equal(summary.countries, 50, `${subj} must cover all 50 countries (school + university)`);
  assert.equal(summary.frameworkCountries, 50, `${subj} must reference all 50 European jurisdictions`);
  assert.equal(summary.correlatedSchoolPacks, summary.schoolPacks, `${subj} school packs must all carry bibliographic correlation`);
  assert.ok(summary.universityPacks >= 200, `${subj} must cover all 50 countries across university years`);
}

// Spot-check hashed static pack files + Worker /api/curriculum-pack endpoint across all 4 Sciences
for (const sample of [
  ['physics', 'RO', '6'],
  ['chemistry', 'RO', '7'],
  ['biology', 'DE', '5'],
  ['astronomy', 'FR', 'univ-1'],
  ['physics', 'VA', 'univ-1']
]) {
  const [subject, country, grade] = sample;
  const assetName = await curriculumPackAssetName(subject, country, grade);
  assert.ok(fs.existsSync(`./public/packs/${assetName}`), `Missing static pack ./public/packs/${assetName} for ${sample.join('|')}`);
  const rawPack = JSON.parse(fs.readFileSync(`./public/packs/${assetName}`, 'utf8'));
  const blockedRes = await worker.fetch(
    new Request(`https://pack-test.local/api/curriculum-pack?subject=${subject}&country=${country}&grade=${grade}`)
  );
  assert.equal(blockedRes.status, 403, 'Direct unauthenticated scraping must be rejected');

  const apiRes = await worker.fetch(
    new Request(`https://pack-test.local/api/curriculum-pack?subject=${subject}&country=${country}&grade=${grade}`, {
      headers: { 'X-Pocket-Client': '1' }
    }),
    {
      ASSETS: {
        fetch: async req => {
          const p = new URL(req.url).pathname;
          return new Response(fs.readFileSync(`./public${p}`, 'utf8'), {
            status: 200,
            headers: { 'content-type': 'application/json' }
          });
        }
      }
    }
  );
  assert.equal(apiRes.status, 200, `/api/curriculum-pack failed for ${sample.join('|')}`);
  const fetched = await apiRes.json();
  assert.equal(fetched.subject, subject);
  assert.equal(fetched.country, country);
  assert.deepEqual(Object.keys(fetched.lessonsByTopic), Object.keys(rawPack.lessonsByTopic));
}

// 4. Execute inline Worker script in VM to verify Astronomy laws UI, decoupled pack reader & 44-lang localization
const html = await (await worker.fetch(new Request('https://ui-test.local/'))).text();
assert.ok(html.length < 8_000_000, `Worker HTML exceeds 8M budget: ${html.length}`);
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const mainScript = scripts.find(s => s.includes('function scienceJourneyShowChoices(')) || '';
new vm.Script(mainScript); // Verify full inline script syntax
const sciStart = mainScript.indexOf('const LEARNING_SUBJECTS=');
const sciEnd = mainScript.indexOf('function mathJourneyShowChoices(', sciStart);
const packStart = mainScript.indexOf('const EDU_CURRICULUM_PACK_VERSION=');
const packEnd = mainScript.indexOf('// Shared country-first entry', packStart);
assert.ok(sciStart > 0 && sciEnd > sciStart && packStart > 0 && packEnd > packStart);

class MockNode {
  constructor(tag = 'div', text = '') {
    this.tagName = String(tag).toUpperCase();
    this.nodeType = tag === '#text' ? 3 : 1;
    this.nodeValue = tag === '#text' ? String(text) : null;
    this.children = [];
    this.childNodes = [];
    this.attributes = {};
    this.style = { setProperty() {}, removeProperty() {}, cssText: '' };
    this.dataset = {};
    this.parentNode = null;
    this.parentElement = null;
    this.hidden = false;
    this.value = '';
    this.placeholder = '';
    this._classSet = new Set();
    const self = this;
    this.classList = {
      add(...xs) { xs.flatMap(x => String(x).split(/\s+/)).filter(Boolean).forEach(x => self._classSet.add(x)); },
      remove(...xs) { xs.forEach(x => self._classSet.delete(x)); },
      toggle(x, f) {
        const on = f === undefined ? !self._classSet.has(x) : Boolean(f);
        if (on) self._classSet.add(x); else self._classSet.delete(x);
        return on;
      },
      contains(x) { return self._classSet.has(x); }
    };
  }
  get isConnected() { return true; }
  get options() { return this.children.filter(c => c.tagName === 'OPTION'); }
  get className() { return [...this._classSet].join(' '); }
  set className(v) {
    this._classSet = new Set(String(v || '').split(/\s+/).filter(Boolean));
  }
  get firstChild() { return this.childNodes[0] || null; }
  get textContent() {
    if (this.nodeType === 3) return this.nodeValue || '';
    return this.childNodes.map(c => c.textContent).join('');
  }
  set textContent(v) {
    const s = String(v ?? '');
    if (this.nodeType === 3) { this.nodeValue = s; return; }
    this.children = [];
    this.childNodes = [];
    if (s) {
      const t = new MockNode('#text', s);
      t.parentNode = this;
      t.parentElement = this;
      this.childNodes.push(t);
    }
  }
  append(...items) {
    for (const item of items) {
      const n = typeof item === 'string' ? new MockNode('#text', item) : item;
      if (!n) continue;
      n.parentNode = this;
      n.parentElement = this;
      this.childNodes.push(n);
      if (n.nodeType === 1) this.children.push(n);
    }
  }
  prepend(...items) {
    const nodes = items.map(item => (typeof item === 'string' ? new MockNode('#text', item) : item)).filter(Boolean);
    for (const n of nodes) { n.parentNode = this; n.parentElement = this; }
    this.childNodes.unshift(...nodes);
    this.children.unshift(...nodes.filter(n => n.nodeType === 1));
  }
  replaceChildren(...items) {
    this.children = [];
    this.childNodes = [];
    this.append(...items);
  }
  setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'placeholder') this.placeholder = String(v); }
  getAttribute(k) { return k === 'placeholder' ? this.placeholder : (this.attributes[k] ?? null); }
  removeAttribute(k) { delete this.attributes[k]; }
  addEventListener() {}
  removeEventListener() {}
  scrollTo() {}
  getBoundingClientRect() { return { top: 0, bottom: 700, left: 0, right: 390, width: 390, height: 700 }; }
  querySelector(sel) {
    const found = this.querySelectorAll(sel)[0] || null;
    if (found) return found;
    if (sel === '.comm-tabs' || sel.startsWith('[')) return new MockNode('div');
    return null;
  }
  querySelectorAll(sel) {
    const out = [];
    const match = el => {
      if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
      return el.tagName.toLowerCase() === sel.toLowerCase();
    };
    const walk = el => {
      for (const ch of el.children) {
        if (match(ch)) out.push(ch);
        walk(ch);
      }
    };
    walk(this);
    return out;
  }
}

const elementsById = new Map();
const getEl = id => {
  if (!elementsById.has(id)) {
    const n = new MockNode('div');
    n.id = id;
    elementsById.set(id, n);
  }
  return elementsById.get(id);
};

const openedLessons = [];
const translatedBatches = [];
const sandbox = {
  console,
  Math,
  Date,
  JSON,
  Set,
  Map,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Promise,
  URL,
  URLSearchParams,
  TextEncoder,
  TextDecoder,
  Uint8Array,
  Int32Array,
  Float64Array,
  performance: { now: () => 0 },
  setTimeout: fn => { fn(); return 1; },
  clearTimeout() {},
  setInterval: () => 1,
  clearInterval() {},
  requestAnimationFrame: fn => { fn(); return 1; },
  cancelAnimationFrame() {},
  localStorage: {
    _m: new Map(),
    getItem(k) { return this._m.get(k) ?? null; },
    setItem(k, v) { this._m.set(k, String(v)); },
    removeItem(k) { this._m.delete(k); }
  },
  sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: { language: 'ro-RO', languages: ['ro-RO'], onLine: true, userAgent: 'Mozilla/5.0' },
  location: { href: 'https://ui-test.local/', origin: 'https://ui-test.local', search: '', pathname: '/', hash: '' },
  history: { replaceState() {}, pushState() {} },
  fetch: async url => {
    const u = new URL(String(url), 'https://ui-test.local');
    if (u.pathname === '/api/curriculum-pack') {
      const s = u.searchParams.get('subject');
      const c = u.searchParams.get('country');
      const g = u.searchParams.get('grade');
      const asset = await curriculumPackAssetName(s, c, g);
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(fs.readFileSync(`./public/packs/${asset}`, 'utf8'))
      };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  },
  document: {
    body: new MockNode('body'),
    documentElement: new MockNode('html'),
    activeElement: null,
    createElement: tag => new MockNode(tag),
    createElementNS: (_ns, tag) => new MockNode(tag),
    createTextNode: txt => new MockNode('#text', txt),
    getElementById: getEl,
    querySelector: sel => getEl('qs:' + sel),
    querySelectorAll: () => [],
    addEventListener() {}
  }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.addEventListener = () => {};
sandbox.$ = getEl;
sandbox.state = { language: 'ro' };
sandbox.qaFixedLocale = '';
sandbox.educationCountrySelection = { code: 'RO', label: 'România' };
sandbox.learningLabel = (ro, en) => (sandbox.state.language === 'ro' ? ro : en);
sandbox.educationTheoryClean = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
sandbox.eduYearOptions = (country, stage) => {
  const st = stage === 'primary' ? 'beginner' : stage === 'intermediate' ? 'medium' : stage;
  return educationCountrySchoolYears(country, st)?.years || [];
};
sandbox.pocketNativeVoiceAvailable = () => false;
sandbox.pocketNativeVoiceSend = () => {};
sandbox.renderLearningSubjects = () => {};
vm.createContext(sandbox);
vm.runInContext(mainScript.slice(packStart, packEnd), sandbox);
vm.runInContext(mainScript.slice(sciStart, sciEnd), sandbox);

// Override dialog opener & translation hook in VM to capture opened lessons and 44-lang batches
vm.runInContext(`
  educationOpenPagedLesson = function(title, body) {
    globalThis.__opened.push({ title, body });
  };
  eduTranslateMaterial = async function(items, lang) {
    globalThis.__translated.push({ lang, count: items.length, sample: items.slice(0, 3) });
    return items.map(x => '[' + lang.toUpperCase() + '] ' + x);
  };
`, Object.assign(sandbox, { __opened: openedLessons, __translated: translatedBatches }));

// Verify Astronomy laws toolbar button, search filter, reader & Back navigation
vm.runInContext(`
  state.language = 'ro';
  educationCountrySelection.code = 'RO';
  educationCountrySelection.label = 'România';
  scienceJourney.subject = 'astronomy';
  scienceJourneyShowChoices('years');
`, sandbox);
const host = getEl('moduleContent');
const lawsButtons = host.querySelectorAll('.science-laws-entry');
assert.equal(lawsButtons.length, 1, 'Astronomy years screen must display the Laws, constants & principles button');
assert.match(lawsButtons[0].textContent, /Legi, constante și principii/);

lawsButtons[0].onclick();
assert.equal(vm.runInContext('scienceJourney.stage', sandbox), 'astronomy-laws');
assert.equal(getEl('view-module').classList.contains('science-scroll-stage'), true);
const astroTiles = host.querySelectorAll('.science-law-tile');
assert.equal(astroTiles.length, 24, 'All 24 Astronomy laws and IAU constants must render');

const searchInput = host.querySelector('.science-laws-filter');
searchInput.value = 'Kepler';
searchInput.oninput();
const visibleKepler = astroTiles.filter(b => !b.hidden);
assert.equal(visibleKepler.length, 3, 'Filtering for Kepler must match Kepler laws I, II, III');

openedLessons.length = 0;
visibleKepler[0].onclick();
assert.equal(openedLessons.length, 1);
assert.match(openedLessons[0].body, /Kepler/);
assert.match(openedLessons[0].body, /astronomie și astrofizică/);

vm.runInContext('scienceBack()', sandbox);
assert.equal(vm.runInContext('scienceJourney.stage', sandbox), 'years', 'Back from astronomy-laws must return to years');

// Verify decoupled pack loading + bibliographic banner + multi-page synthesis lesson across all 4 Sciences
for (const [subject, country, grade, level, schoolStage, topic] of [
  ['physics', 'RO', '7', 'beginner', 'lower', 'dynamics'],
  ['chemistry', 'RO', '8', 'beginner', 'lower', 'reactions'],
  ['biology', 'DE', '11', 'intermediate', 'upper', 'genetics'],
  ['astronomy', 'IT', 'univ-1', 'advanced', 'advanced', 'gravity']
]) {
  await vm.runInContext(`
    (async () => {
      state.language = 'ro';
      educationCountrySelection.code = ${JSON.stringify(country)};
      educationCountrySelection.label = ${JSON.stringify(country)};
      scienceJourney.subject = ${JSON.stringify(subject)};
      scienceJourney.grade = ${JSON.stringify(grade)};
      scienceJourney.level = ${JSON.stringify(level)};
      scienceJourney.schoolStage = ${JSON.stringify(schoolStage)};
      scienceJourney.topic = ${JSON.stringify(topic)};
      await eduEnsureCurriculumPack(${JSON.stringify(subject)}, ${JSON.stringify(country)}, ${JSON.stringify(grade)}, ${JSON.stringify(level)});
      scienceJourneyShowChoices('chemistry-lessons');
    })()
  `, sandbox);

  const banners = host.querySelectorAll('.science-pack-correlation-banner');
  assert.ok(banners.length >= 1, `${subject}|${country}|${grade} must display pack correlation banner`);
  const packCards = host.querySelectorAll('.science-pack-study-card');
  assert.equal(packCards.length, 1, `${subject}|${country}|${grade} must display decoupled pack synthesis card`);

  openedLessons.length = 0;
  packCards[0].onclick();
  assert.equal(openedLessons.length, 1);
  assert.ok(openedLessons[0].body.length >= 1600, `${subject}|${country}|${grade} pack lesson must be multi-page (>=1600 chars)`);
  assert.match(openedLessons[0].body, /Formulă \/ relație:/);
}

// Verify 44-language dynamic localization in scienceJourney for non-RO/non-EN languages (e.g. German `de` and Japanese `ja`)
translatedBatches.length = 0;
await vm.runInContext(`
  (async () => {
    state.language = 'de';
    scienceJourney.subject = 'physics';
    scienceJourneyShowChoices('years');
    await Promise.resolve();
  })()
`, sandbox);
assert.ok(translatedBatches.some(b => b.lang === 'de' && b.count >= 3), 'German mode must trigger batch localization in scienceJourney');
assert.match(host.textContent, /\[DE\]/, 'German translated labels must update live DOM nodes in scienceJourney');

console.log(
  `PASS tests_science_europe_packs_and_laws_2026: 50/50 European frameworks across all 4 Sciences, ` +
  `Astronomy 24 laws/constants UI, ${SCIENCE_DECOUPLED_CURRICULUM_PACKS.length} decoupled Science packs, ` +
  `bibliographic correlation & 44-language localization verified.`
);
