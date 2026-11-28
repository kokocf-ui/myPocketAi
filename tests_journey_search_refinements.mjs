import assert from 'node:assert/strict';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import worker from './backend.js';
import { rankJourneySuggestions } from './journey_suggestion_rank.mjs';
import { parseJourneyExpression, assistantJourneyHandoff } from './assistant_bare_destination.mjs';
import { ONE_FIELD_JOURNEY_SCRIPT } from './one_field_journey_ui.mjs';

globalThis.crypto ??= webcrypto;

const UK_GPS = { latitude: 51.475, longitude: 0.322, accuracy: 18, updatedAt: Date.now() };

// --- 1. Expression parsing & Assistant handoff invariants ---
{
  const subLetter = parseJourneyExpression('Strada Armatei Române 1 A, Oradea');
  assert.equal(subLetter.origin_query, '');
  assert.equal(subLetter.destination_query, 'Strada Armatei Române 1 A, Oradea');

  const frenchAddr = parseJourneyExpression('12 Rue de la Paix, Paris');
  assert.equal(frenchAddr.origin_query, '');
  assert.equal(frenchAddr.destination_query, '12 Rue de la Paix, Paris');

  const pairRo = parseJourneyExpression('de la Strada Nufărului 12, Oradea la Muzeul Țării Crișurilor, Oradea');
  assert.equal(pairRo.origin_query, 'Strada Nufărului 12, Oradea');
  assert.equal(pairRo.destination_query, 'Muzeul Țării Crișurilor, Oradea');

  const pairDin = parseJourneyExpression('din Piața Unirii 1, Oradea până la Gara Oradea');
  assert.equal(pairDin.origin_query, 'Piața Unirii 1, Oradea');
  assert.equal(pairDin.destination_query, 'Gara Oradea');

  const pairEn = parseJourneyExpression('from 10 Downing Street, London to British Museum, London');
  assert.equal(pairEn.origin_query, '10 Downing Street, London');
  assert.equal(pairEn.destination_query, 'British Museum, London');

  const handoffNumberedPair = assistantJourneyHandoff('de la Strada Nufărului 12, Oradea la Muzeul Țării Crișurilor, Oradea');
  assert.ok(handoffNumberedPair, 'Numbered/comma A-to-B expression must hand off to one-field journey UI');
  assert.equal(handoffNumberedPair.origin_query, 'Strada Nufărului 12, Oradea');
  assert.equal(handoffNumberedPair.destination_query, 'Muzeul Țării Crișurilor, Oradea');

  const handoffPoi = assistantJourneyHandoff('Teatrul Regina Maria, Oradea');
  assert.ok(handoffPoi, 'Named theatre landmark must hand off cleanly');
}

// --- 2. Ranker: duplicate postcodes, building vs shop, metropolitan wrappers, explicit city isolation ---
{
  const nufaruluiCandidates = [
    {
      label: 'Farmacia Dona, Strada Nufărului 12, 410584 Oradea, Romania',
      latitude: 47.03912,
      longitude: 21.94851,
      country_code: 'RO',
      city: 'Oradea',
      street: 'Strada Nufărului',
      house_number: '12',
      result_type: 'amenity',
      _name: 'Farmacia Dona',
      _categories: ['healthcare.pharmacy'],
      _postcode: '410584',
    },
    {
      label: 'Strada Nufărului 12, 410583 Oradea, Romania',
      latitude: 47.03918,
      longitude: 21.94858,
      country_code: 'RO',
      city: 'Oradea',
      street: 'Strada Nufărului',
      house_number: '12',
      result_type: 'building',
      _postcode: '410583',
    },
    {
      label: 'Str. Nufărului 12, 410585 Oradea, Romania',
      latitude: 47.03925,
      longitude: 21.94866,
      country_code: 'RO',
      city: 'Oradea',
      street: 'Str. Nufărului',
      house_number: '12',
      result_type: 'building',
      _postcode: '410585',
    },
    {
      label: 'Strada Nufărului 12, Sânmartin, Oradea Metropolitan Area, Romania',
      latitude: 47.0221,
      longitude: 21.9712,
      country_code: 'RO',
      city: 'Sânmartin',
      street: 'Strada Nufărului',
      house_number: '12',
      result_type: 'building',
      _postcode: '417495',
    },
    {
      label: 'Strada Nufărului, Oradea Metropolitan Area, Romania',
      latitude: 47.038,
      longitude: 21.949,
      country_code: 'RO',
      city: '',
      street: 'Strada Nufărului',
      house_number: '',
      result_type: 'street',
    },
  ];

  const ranked = rankJourneySuggestions('Strada Nufărului 12, Oradea', nufaruluiCandidates, {
    origin: UK_GPS,
    national: false,
  });
  assert.equal(ranked.length, 1, 'Same street + house number + locality must not produce duplicate postcode options');
  assert.ok(!/Farmacia/i.test(ranked[0].label), 'Pure building address must win over ground-floor shop at same number');
  assert.ok(!/41058[345]/.test(ranked[0].label), 'Disputed postcodes at the same house number must be stripped when not queried');
  assert.ok(!/Metropolitan/i.test(ranked[0].label), 'Metropolitan area must never appear');
  assert.equal(ranked[0].label, 'Strada Nufărului 12, Oradea, Romania');

  // Explicit postcode in user query keeps the matching postcode intact.
  const rankedWithPostcode = rankJourneySuggestions('Strada Nufărului 12, 410583 Oradea', nufaruluiCandidates, {
    origin: UK_GPS,
    national: false,
  });
  assert.equal(rankedWithPostcode.length, 1);
  assert.match(rankedWithPostcode[0].label, /410583/);

  // UK GPS must NEVER cause City of London to outrank explicit Southampton locality.
  const ukLocalityRanked = rankJourneySuggestions('11 Liverpool Street, Southampton', [
    {
      label: '11 Liverpool Street, London, EC2M 7PD, United Kingdom',
      latitude: 51.5176,
      longitude: -0.0823,
      country_code: 'GB',
      city: 'London',
      suburb: 'City of London',
      street: 'Liverpool Street',
      house_number: '11',
      result_type: 'building',
    },
    {
      label: '11 Liverpool Street, Southampton, SO14 0HU, United Kingdom',
      latitude: 50.9097,
      longitude: -1.4044,
      country_code: 'GB',
      city: 'Southampton',
      street: 'Liverpool Street',
      house_number: '11',
      result_type: 'building',
    },
  ], { origin: UK_GPS, national: true });
  assert.equal(ukLocalityRanked.length, 1);
  assert.match(ukLocalityRanked[0].label, /Southampton/);

  // Distinct London boroughs remain distinct when the user asks only for London.
  const londonBoroughs = rankJourneySuggestions('10 High Street, London', [
    {
      label: '10 High Street, Camden, London, NW1 7JE, United Kingdom',
      latitude: 51.539,
      longitude: -0.142,
      country_code: 'GB',
      city: 'London',
      suburb: 'Camden',
      street: 'High Street',
      house_number: '10',
      result_type: 'building',
      _postcode: 'NW1 7JE',
    },
    {
      label: '10 High Street, Croydon, London, CR0 1YB, United Kingdom',
      latitude: 51.372,
      longitude: -0.101,
      country_code: 'GB',
      city: 'London',
      suburb: 'Croydon',
      street: 'High Street',
      house_number: '10',
      result_type: 'building',
      _postcode: 'CR0 1YB',
    },
  ], { origin: UK_GPS, national: true });
  assert.equal(londonBoroughs.length, 2, 'Distinct boroughs >18 km apart in London must both remain selectable');
}

// --- 3. Backend journey_suggest: POI + locality, bare POI UTF-8, metropolitan blocking, redundant completion suppression ---
{
  const originalFetch = globalThis.fetch;
  const seenUrls = [];
  let aiCalled = 0;
  const env = {
    GEOAPIFY_API_KEY: 'test-geoapify-key',
    AI: { run: async () => { aiCalled++; return { response: 'unexpected' }; } },
  };

  try {
    globalThis.fetch = async input => {
      const url = new URL(typeof input === 'string' ? input : input.url);
      seenUrls.push(url.toString());
      if (url.hostname !== 'api.geoapify.com') {
        throw new Error('Unexpected external call in journey_suggest: ' + url.toString());
      }
      const text = url.searchParams.get('text') || '';

      // Scenario A: "Muzeul Țării Crișurilor, Oradea"
      // Primary ASCII geocode returns 0 Oradea matches and a wrong-city Beiuș feature;
      // Geoapify city-circle /v2/places or UTF-8 search finds the real museum in Oradea.
      if (/Muzeul Tarii Crisurilor,\s*Oradea/i.test(text)) {
        return Response.json({
          features: [
            {
              properties: {
                name: 'Muzeul Municipal Beiuș',
                formatted: 'Muzeul Municipal Beiuș, Piața Samuil Vulcan, Beiuș, Romania',
                city: 'Beiuș',
                country_code: 'ro',
                result_type: 'amenity',
                categories: ['entertainment.museum'],
                lat: 46.669,
                lon: 22.35,
              },
            },
          ],
        });
      }
      if (/Muzeul Țării Crișurilor\s+Oradea/u.test(text)) {
        return Response.json({ features: [] });
      }
      if (/Tarii Crisurilor\s+Oradea/i.test(text)) {
        return Response.json({ features: [] });
      }
      if (url.pathname === '/v1/geocode/search' && text === 'Oradea') {
        return Response.json({
          features: [
            {
              properties: {
                formatted: 'Oradea, Bihor, Romania',
                city: 'Oradea',
                country_code: 'ro',
                result_type: 'city',
                lat: 47.0553,
                lon: 21.9288,
              },
            },
          ],
        });
      }
      if (url.pathname === '/v2/places') {
        return Response.json({
          features: [
            {
              properties: {
                name: 'Muzeul Țării Crișurilor',
                formatted: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, Romania',
                city: 'Oradea',
                municipality: 'Oradea Metropolitan Area',
                street: 'Strada Armatei Române',
                housenumber: '1/A',
                country_code: 'ro',
                categories: ['entertainment.museum', 'tourism.sights'],
                lat: 47.0462,
                lon: 21.9195,
              },
            },
            {
              properties: {
                name: 'Muzeul Memorial Ady Endre',
                formatted: 'Muzeul Memorial Ady Endre, Parcul Traian, Oradea, Romania',
                city: 'Oradea',
                country_code: 'ro',
                categories: ['entertainment.museum'],
                lat: 47.0581,
                lon: 21.9344,
              },
            },
            {
              properties: {
                name: 'Muzeul Satului Sântandrei',
                formatted: 'Muzeul Satului, Sântandrei, Oradea Metropolitan Area, Romania',
                village: 'Sântandrei',
                municipality: 'Oradea Metropolitan Area',
                country_code: 'ro',
                categories: ['entertainment.museum'],
                lat: 47.065,
                lon: 21.855,
              },
            },
          ],
        });
      }

      // Scenario B: Bare "Muzeul Țării Crișurilor" (without ", Oradea")
      // Live Geoapify forward geocoder returns the Beiuș branch while /v2/places
      // (and/or UTF-8 search) has the Oradea headquarters — BOTH must be returned.
      if (text === 'Muzeul Tarii Crisurilor') {
        return Response.json({
          features: [
            {
              properties: {
                name: 'Muzeul Țării Crișurilor',
                formatted: 'Muzeul Țării Crișurilor, Piața Samuil Vulcan 14, Beiuș, Romania',
                city: 'Beiuș',
                street: 'Piața Samuil Vulcan',
                country_code: 'ro',
                result_type: 'amenity',
                categories: ['entertainment.museum'],
                lat: 46.669,
                lon: 22.35,
              },
            },
          ],
        });
      }
      if (text === 'Muzeul Țării Crișurilor') {
        return Response.json({
          features: [
            {
              properties: {
                name: 'Muzeul Țării Crișurilor',
                formatted: 'Muzeul Țării Crișurilor, Piața Samuil Vulcan 14, Beiuș, Romania',
                city: 'Beiuș',
                street: 'Piața Samuil Vulcan',
                country_code: 'ro',
                result_type: 'amenity',
                categories: ['entertainment.museum'],
                lat: 46.669,
                lon: 22.35,
              },
            },
          ],
        });
      }

      // Scenario C: "Strada Nufărului 12, Oradea" with metropolitan pollution + multiple postcodes
      if (/12\s+Strada Nufarului,\s*Oradea|Strada Nufarului 12,\s*Oradea/i.test(text)) {
        return Response.json({
          features: [
            {
              properties: {
                formatted: '12 Strada Nufărului, Oradea Metropolitan Area, Romania',
                municipality: 'Oradea Metropolitan Area',
                street: 'Strada Nufărului',
                country_code: 'ro',
                result_type: 'street',
                lat: 47.039,
                lon: 21.948,
              },
            },
            {
              properties: {
                name: 'Magazin Mixt',
                formatted: 'Magazin Mixt, Strada Nufărului 12, 410584 Oradea, Romania',
                city: 'Oradea',
                municipality: 'Oradea Metropolitan Area',
                street: 'Strada Nufărului',
                housenumber: '12',
                postcode: '410584',
                country_code: 'ro',
                result_type: 'amenity',
                categories: ['commercial.supermarket'],
                lat: 47.03912,
                lon: 21.94851,
              },
            },
            {
              properties: {
                formatted: 'Strada Nufărului 12, 410583 Oradea, Romania',
                city: 'Oradea',
                municipality: 'Oradea Metropolitan Area',
                street: 'Strada Nufărului',
                housenumber: '12',
                postcode: '410583',
                country_code: 'ro',
                result_type: 'building',
                lat: 47.03918,
                lon: 21.94858,
              },
            },
          ],
        });
      }

      // Scenario D: Wrong city only ("Strada Republicii 10, Oradea" when provider only knows Cluj)
      if (/Republicii/i.test(text)) {
        return Response.json({
          features: [
            {
              properties: {
                formatted: 'Strada Republicii 10, Cluj-Napoca, Romania',
                city: 'Cluj-Napoca',
                street: 'Strada Republicii',
                housenumber: '10',
                country_code: 'ro',
                result_type: 'building',
                lat: 46.766,
                lon: 23.589,
              },
            },
          ],
        });
      }

      return Response.json({ features: [] });
    };

    const callSuggest = async query => {
      const res = await worker.fetch(new Request('https://example.com/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ journey_suggest: { query, location: UK_GPS } }),
      }), env);
      assert.equal(res.status, 200);
      return res.json();
    };

    // Test A: Muzeul Țării Crișurilor, Oradea
    seenUrls.length = 0;
    const museumWithCity = await callSuggest('Muzeul Țării Crișurilor, Oradea');
    assert.ok(museumWithCity.candidates.length >= 1, 'Muzeul Țării Crișurilor, Oradea must resolve');
    assert.match(museumWithCity.candidates[0].label, /Muzeul Țării Crișurilor.*Oradea/);
    assert.ok(!museumWithCity.candidates.some(c => /Beiuș|Beius|Sântandrei|Santandrei|Metropolitan/i.test(c.label)));
    assert.equal(museumWithCity.completions.length, 0, 'No redundant locality completion when Oradea is confirmed');
    // Verify UK GPS proximity bias was NOT sent on explicit-locality query
    assert.ok(
      seenUrls.filter(u => u.includes('/v1/geocode/')).every(u => !u.includes('proximity:')),
      'Explicit locality query must not bias Geoapify toward UK phone GPS'
    );

    // Test B: Bare "Muzeul Țării Crișurilor" without ", Oradea" must surface BOTH Oradea AND Beiuș
    const museumBare = await callSuggest('Muzeul Țării Crișurilor');
    assert.ok(museumBare.candidates.length >= 2, 'Bare Muzeul Țării Crișurilor must return both Oradea and Beiuș');
    assert.ok(museumBare.candidates.some(c => /Oradea/i.test(c.label)), 'Oradea branch must be present');
    assert.ok(museumBare.candidates.some(c => /Beiuș|Beius/i.test(c.label)), 'Beiuș branch must also be present');
    assert.match(museumBare.candidates[0].label, /Muzeul Țării Crișurilor.*Oradea/, 'Complete Oradea museum address ranks first');

    // Test C: "Strada Nufărului 12, Oradea"
    const nufarului = await callSuggest('Strada Nufărului 12, Oradea');
    assert.equal(nufarului.completions.length, 0, 'Must NOT emit Completează localitatea when Oradea is already typed and confirmed');
    assert.equal(nufarului.candidates.length, 1, 'Must return a single deduplicated house-number candidate');
    assert.equal(nufarului.candidates[0].label, 'Strada Nufărului 12, Oradea, Romania');
    assert.ok(!JSON.stringify(nufarului).includes('Metropolitan'), 'Metropolitan area must never appear in candidates or completions');
    assert.equal('_postcode' in nufarului.candidates[0], false, 'Internal _postcode must be stripped from public JSON');
    assert.equal('suburb' in nufarului.candidates[0], false, 'Internal suburb must be stripped from public JSON');

    // Test D: Never substitute Cluj-Napoca when user asked for Oradea
    const wrongCity = await callSuggest('Strada Republicii 10, Oradea');
    assert.deepEqual(wrongCity.candidates, []);
    assert.equal(aiCalled, 0, 'journey_suggest must remain pure geocoder/places with zero AI calls');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// --- 4. One-field UI: confirmed destination before completion, visual distinction, "de la A la B" origin flow ---
function makeMockDom() {
  class Element {
    constructor(doc, tag = 'div') {
      this.doc = doc;
      this.tagName = tag.toUpperCase();
      this.parentElement = null;
      this.children = [];
      this.style = {};
      this.value = '';
      this.readOnly = false;
      this.className = '';
      this.events = new Map();
      this._text = '';
      this.attrs = {};
      const classes = new Set();
      this.classList = {
        add: x => classes.add(x),
        remove: x => classes.delete(x),
        contains: x => classes.has(x),
      };
    }
    get isConnected() {
      let cur = this;
      while (cur) {
        if (cur === this.doc.root) return true;
        cur = cur.parentElement;
      }
      return false;
    }
    contains(target) {
      for (let cur = target; cur; cur = cur.parentElement) if (cur === this) return true;
      return false;
    }
    append(...nodes) {
      for (const node of nodes) {
        if (node && typeof node === 'object') {
          node.parentElement = this;
          this.children.push(node);
        }
      }
    }
    replaceChildren(...nodes) {
      for (const child of this.children) child.parentElement = null;
      this.children = [];
      this.append(...nodes);
    }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k] ?? null; }
    addEventListener(type, fn) {
      if (!this.events.has(type)) this.events.set(type, []);
      this.events.get(type).push(fn);
    }
    removeEventListener() {}
    dispatch(type, extra = {}) {
      for (const fn of this.events.get(type) || []) fn({ preventDefault() {}, stopImmediatePropagation() {}, ...extra });
    }
    click() {
      if (typeof this.onclick === 'function') this.onclick({ preventDefault() {} });
      this.dispatch('click');
    }
    focus() {}
    blur() {}
    querySelector(sel) {
      const cls = sel.startsWith('.') ? sel.slice(1) : null;
      const visit = node => {
        for (const ch of node.children) {
          const allCls = new Set(String(ch.className || '').split(/\s+/).filter(Boolean));
          if (cls && (ch.classList.contains(cls) || allCls.has(cls))) return ch;
          const nested = visit(ch);
          if (nested) return nested;
        }
        return null;
      };
      return visit(this);
    }
    set textContent(v) { this._text = String(v ?? ''); this.children = []; }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  }

  const byId = new Map();
  const root = new Element(null, 'div');
  const host = new Element(null, 'div');
  const chatInput = new Element(null, 'input');
  byId.set('moduleLayerBody', host);
  const doc = {
    root,
    byId,
    createElement: tag => new Element(doc, tag),
    querySelector: sel => root.querySelector(sel),
    getElementById: id => byId.get(id) ?? null,
  };
  root.doc = doc;
  host.doc = doc;
  chatInput.doc = doc;
  root.append(host);
  return { doc, root, host, chatInput };
}
{
  const { doc, host, chatInput } = makeMockDom();

  let pendingTimer = null;
  let routedChoices = [];
  let submittedRoadPayloads = [];
  const mockResponses = new Map([
    [
      'Strada Nufărului 12, Ora',
      {
        candidates: [
          {
            label: 'Strada Nufărului 12, Oradea, România',
            latitude: 47.03918,
            longitude: 21.94858,
            country_code: 'RO',
            city: 'Oradea',
            street: 'Strada Nufărului',
            house_number: '12',
          },
        ],
        completions: [
          {
            query: '12 Strada Nufărului, Oradea Metropolitan Area, Romania',
            label: '12 Strada Nufărului, Oradea Metropolitan Area, Romania',
            city: 'Oradea Metropolitan Area',
            country_code: 'RO',
          },
          {
            query: 'Strada Nufărului 12, Oravița, România',
            label: 'Strada Nufărului 12, Oravița, România',
            city: 'Oravița',
            country_code: 'RO',
          },
        ],
      },
    ],
    [
      'Strada Nufărului 12, Oradea',
      {
        candidates: [
          {
            label: 'Strada Nufărului 12, Oradea, România',
            latitude: 47.03918,
            longitude: 21.94858,
            country_code: 'RO',
            city: 'Oradea',
            street: 'Strada Nufărului',
            house_number: '12',
          },
          {
            label: 'Str. Nufărului 12, 410584 Oradea, România',
            latitude: 47.03922,
            longitude: 21.94862,
            country_code: 'RO',
            city: 'Oradea',
            street: 'Str. Nufărului',
            house_number: '12',
          },
        ],
        completions: [
          {
            query: '12 Strada Nufărului, Oradea, Romania',
            label: '12 Strada Nufărului, Oradea, Romania',
            city: 'Oradea',
            country_code: 'RO',
          },
        ],
      },
    ],
    [
      'Gara Orad',
      {
        candidates: [],
        completions: [
          {
            query: 'Gara Oradea',
            label: 'Gara Oradea, România',
            city: 'Oradea',
            country_code: 'RO',
          },
        ],
      },
    ],
    [
      'Gara Oradea',
      {
        candidates: [
          {
            label: 'Gara Oradea, Piața București, Oradea, România',
            latitude: 47.0684,
            longitude: 21.9378,
            country_code: 'RO',
            city: 'Oradea',
          },
        ],
        completions: [],
      },
    ],
    [
      'Muzeul Țării Crișurilor, Oradea',
      {
        candidates: [
          {
            label: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, România',
            latitude: 47.0462,
            longitude: 21.9195,
            country_code: 'RO',
            city: 'Oradea',
          },
        ],
        completions: [],
      },
    ],
  ]);

  const context = vm.createContext({
    state: {
      language: 'ro',
      busy: false,
      moduleSearchBusy: false,
      moduleSearchCategory: null,
      moduleSearchReturnMode: 'root',
      activeModule: 'maps',
      navigationReturnContext: null,
      pendingTravelMode: null,
      pendingRouteDestination: null,
      routeSearchContext: null,
    },
    CLIENT_CONFIG: { apiUrl: 'https://example.test/api/chat' },
    TRAVEL_MODE_TEXT: {
      ro: ['Cum călătorești?', 'Pe jos', 'Transport public', 'Cu mașina'],
      en: ['How do you travel?', 'Walking', 'Public transport', 'Driving'],
    },
    $: id => doc.getElementById(id),
    inputEl: chatInput,
    document: doc,
    AbortController,
    fetch: async (_url, opts) => {
      const { journey_suggest } = JSON.parse(opts.body);
      const payload = mockResponses.get(journey_suggest.query) || { candidates: [], completions: [] };
      return { ok: true, json: async () => payload };
    },
    setTimeout: fn => { pendingTimer = fn; return 1; },
    clearTimeout: () => { pendingTimer = null; },
    setModuleLayerMode: () => {},
    dialogText: (ro, en) => ro || en,
    rememberNavigationSource: () => {},
    enterModuleRouteConversation: () => {},
    submitMessage: async () => {
      submittedRoadPayloads.push({
        message: chatInput.value,
        route_profile: context.state.pendingTravelMode,
        route_destination: context.state.pendingRouteDestination,
        route_context: context.state.routeSearchContext,
      });
    },
    runModuleSearch: async choice => { routedChoices.push(choice); },
    parseJourneyExpression,
    assistantJourneyHandoff,
  });

  vm.runInContext(ONE_FIELD_JOURNEY_SCRIPT, context);
  context.showOneFieldJourney({ id: 'journey', mixedJourney: true });
  const form = host.children[0];
  const [, input, clearBtn, , , results, confirmed] = form.children;
  assert.equal(clearBtn.className, 'journey-clear-field-btn', 'Clear button is placed directly underneath search input');

  // 4a. Partial prefix "Strada Nufărului 12, Ora":
  // Verified Oradea destination renders FIRST; Oradea Metropolitan Area completion is blocked;
  // distinct Oravița completion renders SECOND with completion visual markers.
  input.value = 'Strada Nufărului 12, Ora';
  input.dispatch('input');
  await pendingTimer();
  await new Promise(r => setImmediate(r));

  assert.equal(results.children.length, 2);
  assert.equal(results.children[0].textContent, 'Strada Nufărului 12, Oradea, România');
  assert.equal(results.children[0].getAttribute('data-suggestion-kind'), 'destination');
  assert.match(results.children[1].textContent, /^Completează localitatea: Strada Nufărului 12, Oravița/);
  assert.equal(results.children[1].getAttribute('data-suggestion-kind'), 'completion');
  assert.notEqual(results.children[0].style.cssText, results.children[1].style.cssText, 'Destination and completion buttons must be visually distinct');
  assert.ok(!results.children.some(b => /Metropolitan/i.test(b.textContent)));

  // 4b. Full locality "Strada Nufărului 12, Oradea":
  // Redundant completion suppressed AND client-side same-address duplicate suppressed!
  input.value = 'Strada Nufărului 12, Oradea';
  input.dispatch('input');
  await pendingTimer();
  await new Promise(r => setImmediate(r));

  assert.equal(results.children.length, 1);
  assert.equal(results.children[0].textContent, 'Strada Nufărului 12, Oradea, România');
  assert.equal(results.children[0].getAttribute('data-suggestion-kind'), 'destination');

  // 4c. Origin + destination "de la Gara Orad la Muzeul Țării Crișurilor, Oradea":
  // Origin starts with a completion-only prefix ("Gara Orad" -> "Gara Oradea"), which must NOT
  // be assigned directly to origin without coordinates; tapping the origin completion resolves
  // the real coordinates of Gara Oradea and passes journeyOrigin / route_context.origin!
  input.value = 'de la Gara Orad la Muzeul Țării Crișurilor, Oradea';
  input.dispatch('input');
  await pendingTimer();
  await new Promise(r => setImmediate(r));

  assert.equal(results.children.length, 1);
  assert.match(results.children[0].textContent, /Muzeul Țării Crișurilor/);
  // Tap destination -> triggers origin lookup for "Gara Orad" -> renders completion button, NOT modes with null coords
  results.children[0].click();
  await new Promise(r => setImmediate(r));
  await new Promise(r => setImmediate(r));

  assert.equal(confirmed.children.length, 0, 'Modes must wait until origin has verified coordinates');
  assert.equal(results.children.length, 1);
  assert.equal(results.children[0].getAttribute('data-suggestion-kind'), 'completion');
  assert.match(results.children[0].textContent, /Completează localitatea: Gara Oradea/);

  // Tap origin completion -> resolves verified Gara Oradea coordinates -> shows travel modes!
  results.children[0].click();
  await new Promise(r => setImmediate(r));
  await new Promise(r => setImmediate(r));

  assert.equal(confirmed.children.length, 3, 'Departure banner + Mixed transport + Driving cards must appear');
  assert.match(confirmed.children[0].textContent, /Plecarea: Gara Oradea/);
  assert.ok(!/GPS/i.test(confirmed.children[0].textContent), 'Manual origin must be shown instead of phone GPS');

  // Trigger Driving mode -> verify route_context.origin & route_destination have exact Oradea coordinates
  const driveBtn = confirmed.children[2];
  driveBtn.click();
  await new Promise(r => setImmediate(r));

  assert.equal(submittedRoadPayloads.length, 1);
  assert.equal(submittedRoadPayloads[0].route_profile, 'drive');
  assert.deepEqual(
    { lat: submittedRoadPayloads[0].route_context.origin.latitude, lon: submittedRoadPayloads[0].route_context.origin.longitude },
    { lat: 47.0684, lon: 21.9378 }
  );
  assert.deepEqual(
    { lat: submittedRoadPayloads[0].route_destination.latitude, lon: submittedRoadPayloads[0].route_destination.longitude },
    { lat: 47.0462, lon: 21.9195 }
  );

  // Also verify Mixed transport mode stores journeyOrigin with exact Oradea coordinates
  const transitBtn = confirmed.children[1];
  transitBtn.click();
  assert.deepEqual(
    { lat: context.state.moduleSearchCategory.journeyOrigin.latitude, lon: context.state.moduleSearchCategory.journeyOrigin.longitude },
    { lat: 47.0684, lon: 21.9378 }
  );
  // Step back from departure calendar -> restores modes -> tap input -> restores "de la ... la ..."
  assert.equal(context.backFromOneFieldJourney ? context.backFromOneFieldJourney() : true, true);
  input.click();
  assert.equal(input.value, 'de la Gara Orad la Muzeul Țării Crișurilor, Oradea');
}

// --- 5. Backend manual-origin road/walk route from UK GPS uses Oradea origin, never UK GPS ---
{
  const originalFetch = globalThis.fetch;
  let routingWaypoints = null;
  try {
    globalThis.fetch = async input => {
      const url = new URL(typeof input === 'string' ? input : input.url);
      if (url.pathname === '/v1/routing') {
        routingWaypoints = url.searchParams.get('waypoints');
        return Response.json({
          features: [
            {
              properties: {
                distance: 3100,
                distance_units: 'meters',
                time: 480,
                legs: [
                  {
                    steps: [
                      { distance: 1500, instruction: { text: 'Mergi pe Strada Nufărului.' } },
                      { distance: 1600, instruction: { text: 'Continuă pe Strada Armatei Române.' } },
                    ],
                  },
                ],
              },
              geometry: {
                type: 'MultiLineString',
                coordinates: [[[21.94858, 47.03918], [21.93, 47.043], [21.9195, 47.0462]]],
              },
            },
          ],
        });
      }
      throw new Error('Unexpected fetch during pre-geocoded A-to-B route: ' + url.toString());
    };

    const mockEnv = {
      GEOAPIFY_API_KEY: 'test-geoapify-key',
      AI: { run: async () => ({ response: 'unexpected' }) },
    };

    // 5a. Exact payload emitted by one_field_journey_ui.mjs -> runMode('drive') -> submitMessage()
    const resUi = await worker.fetch(new Request('https://example.com/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Cu mașina',
        language: 'ro',
        module: 'maps',
        location: UK_GPS,
        route_profile: 'drive',
        route_context: {
          destination_query: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, România',
          destination: {
            latitude: 47.0462,
            longitude: 21.9195,
            label: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, România',
            country_code: 'RO',
          },
          origin: {
            latitude: 47.03918,
            longitude: 21.94858,
            label: 'Strada Nufărului 12, Oradea, România',
            country_code: 'RO',
          },
          origin_query: 'Strada Nufărului 12, Oradea, România',
          pending: 'profile',
          profile: null,
        },
        route_destination: {
          latitude: 47.0462,
          longitude: 21.9195,
          label: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, România',
          country_code: 'RO',
        },
      }),
    }), mockEnv);

    const dataUi = await resUi.json();
    assert.equal(dataUi.route_available, true);
    assert.equal(routingWaypoints, '47.03918,21.94858|47.0462,21.9195', 'UI manual-origin drive must use Oradea waypoints, never UK GPS');
    assert.notEqual(dataUi.route.origin.location_source, 'gps');
    assert.equal(dataUi.route.origin.latitude, 47.03918);
    assert.match(dataUi.route.origin.label, /Strada Nufărului 12, Oradea/);

    // 5b. Direct route_origin + route_destination payload also uses manual origin over UK GPS
    routingWaypoints = null;
    const res = await worker.fetch(new Request('https://example.com/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Traseu cu mașina de la Strada Nufărului 12, Oradea, România până la Muzeul Țării Crișurilor, Oradea, România',
        language: 'ro',
        module: 'maps',
        location: UK_GPS,
        route_profile: 'drive',
        route_origin: {
          latitude: 47.03918,
          longitude: 21.94858,
          label: 'Strada Nufărului 12, Oradea, România',
          country_code: 'RO',
        },
        route_destination: {
          latitude: 47.0462,
          longitude: 21.9195,
          label: 'Muzeul Țării Crișurilor, Strada Armatei Române 1/A, Oradea, România',
          country_code: 'RO',
        },
      }),
    }), mockEnv);

    const data = await res.json();
    assert.equal(data.route_available, true);
    assert.equal(routingWaypoints, '47.03918,21.94858|47.0462,21.9195', 'Waypoints must use Oradea origin & destination, never UK GPS');
    assert.notEqual(data.route.origin.location_source, 'gps');
    assert.equal(data.route.origin.latitude, 47.03918);
    assert.match(data.route.origin.label, /Strada Nufărului 12, Oradea/);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// --- 6. Live phone feedback regressions (triplicate station dedup, London Victoria Station, UI controls & map parity) ---
{
  const { readFileSync } = await import('node:fs');
  const { NATIONAL_PUBLIC_TRANSPORT_SCRIPT } = await import('./national_public_transport_ui.mjs');
  const { TRANSIT_VIEWPORT_STYLE } = await import('./transit_viewport_ui.mjs');
  const indexSrc = readFileSync(new URL('./index.js', import.meta.url), 'utf8');

  // 6a. Triplicate unnumbered station at same postcode/destination ("Gara Centrală, Piața București, 410730 Oradea, Romania")
  const garaTriplicates = rankJourneySuggestions('gara, Oradea', [
    {
      label: 'Gara Oradea, Strada Republicii 114, 410730 Oradea, Romania',
      _name: 'Gara Oradea',
      street: 'Strada Republicii',
      house_number: '114',
      _postcode: '410730',
      city: 'Oradea',
      country_code: 'RO',
      kind: 'public_transport',
      latitude: 47.0695,
      longitude: 21.9334,
    },
    {
      label: 'Gara Centrală, Piața București, 410730 Oradea, Romania',
      _name: 'Gara Centrală',
      street: 'Piața București',
      _postcode: '410730',
      city: 'Oradea',
      country_code: 'RO',
      kind: 'public_transport',
      latitude: 47.0691,
      longitude: 21.9331,
    },
    {
      label: 'Gara Centrală, Piața București, 410730 Oradea, Romania',
      _name: 'Gara Centrală',
      street: 'Piața București',
      _postcode: '410730',
      city: 'Oradea',
      country_code: 'RO',
      kind: 'public_transport',
      latitude: 47.0699,
      longitude: 21.9338,
    },
    {
      label: 'Gara Centrală, Piața București, 410730 Oradea, Romania',
      _name: 'Gara Centrală',
      street: 'Piața București',
      _postcode: '410730',
      city: 'Oradea',
      country_code: 'RO',
      kind: 'amenity',
      latitude: 47.0704,
      longitude: 21.9343,
    },
  ]);
  const centralaCount = garaTriplicates.filter(c => /Gara Centrală/i.test(c.label)).length;
  assert.equal(centralaCount, 1, 'Triplicate Gara Centrală cards at 410730 Oradea must collapse to 1');

  // 6b. National Public Transport: "London Victoria Station" resolves Victoria in London without deleting "London"
  const victoriaNational = rankJourneySuggestions('London Victoria Station', [
    {
      label: 'Victoria Underground Station, London, United Kingdom',
      _name: 'Victoria Underground Station',
      city: 'London',
      country_code: 'GB',
      kind: 'public_transport',
      source: 'TfL StopPoint',
      latitude: 51.4965,
      longitude: -0.1447,
    },
    {
      label: 'Victoria Rail Station, London, United Kingdom',
      _name: 'Victoria Rail Station',
      city: 'London',
      country_code: 'GB',
      kind: 'public_transport',
      source: 'TfL StopPoint',
      latitude: 51.4952,
      longitude: -0.1439,
    },
    {
      label: 'Victoria Station, Southend-on-Sea, United Kingdom',
      _name: 'Victoria Station',
      city: 'Southend-on-Sea',
      country_code: 'GB',
      kind: 'public_transport',
      latitude: 51.5418,
      longitude: 0.7077,
    },
  ], { national: true, origin: UK_GPS });
  assert.equal(victoriaNational.length, 2, 'Both London Victoria stations match while Southend is excluded');

  // Also execute national_public_transport_ui.mjs lookup for "London Victoria Station" (after backend strips _name/_categories)
  {
    const { doc: natDoc, host: natHost } = makeMockDom();
    const natBack = natDoc.createElement('button');
    natBack.id = 'moduleLayerBack';
    natDoc.byId.set('moduleLayerBack', natBack);
    let natTimer = null;
    const natCtx = vm.createContext({
      CLIENT_CONFIG: { apiUrl: 'https://unit.test/api/chat' },
      state: { language: 'ro', currentView: 'module', currentModule: 'maps', busy: false, moduleSearchBusy: false },
      $: id => natDoc.getElementById(id),
      document: natDoc,
      Intl,
      AbortController,
      getCurrentCoordinates: async () => UK_GPS,
      setModuleLayerMode: () => {},
      dialogText: (ro, en) => ro || en,
      createTransportDepartureStep: opts => {
        const s = natDoc.createElement('section');
        s.textContent = opts.destination;
        return s;
      },
      runModuleSearch: async () => {},
      setTimeout: fn => { natTimer = fn; return 1; },
      clearTimeout: () => { natTimer = null; },
      fetch: async (_url, opts) => {
        const body = JSON.parse(opts.body);
        if (body.national_transit_country) {
          return { ok: true, json: async () => ({ country_code: 'GB', supported: true }) };
        }
        return {
          ok: true,
          json: async () => ({
            candidates: victoriaNational.map(({ _name, _categories, ...pub }) => pub),
          }),
        };
      },
    });
    vm.runInContext(NATIONAL_PUBLIC_TRANSPORT_SCRIPT, natCtx);
    natCtx.showNationalTransitSearch({ id: 'national', nationalPublicTransport: true });
    await new Promise(r => setImmediate(r));
    await new Promise(r => setImmediate(r));
    const natRoot = natHost.children[0];
    const [, natField, natClear, , , natChoices] = natRoot.children;
    assert.equal(natClear.className, 'journey-clear-field-btn', 'National transport also has clear button underneath field');
    natField.value = 'London Victoria Station';
    natField.dispatch('input');
    await natTimer();
    await new Promise(r => setImmediate(r));
    assert.equal(natChoices.children.length, 2, 'London Victoria Station must show Victoria stations without deleting London');
    natClear.onclick();
    assert.equal(natField.value, '', 'National clear button empties field');
    assert.equal(natChoices.children.length, 0, 'National clear button clears suggestions');
  }

  // 6c. UI styling & final route map parity checks
  assert.match(ONE_FIELD_JOURNEY_SCRIPT, /align-items:center!important;justify-content:center!important;text-align:center!important/, 'Caută trasee button centers text horizontally and vertically');
  assert.match(TRANSIT_VIEWPORT_STYLE, /\.transit-screen-page>\.transit-refresh-action[\s\S]*min-height:48px!important/, 'Actualizează plecările keeps full button height inside paged transit viewport');
  assert.match(indexSrc, /const directMap=!navigate&&\(state\.lastTransitChoice\?\.mixedJourney!==true\|\|mappedJourney\)/, 'Mapped mixed journeys open Traseu pe hartă directly like National Public Transport');
}

console.log('PASS: journey search refinements (POIs, multi-city bare POIs, triplicate dedup, London Victoria Station, clear buttons, centered buttons, and final map parity)');
