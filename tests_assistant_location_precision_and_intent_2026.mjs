import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import worker from './backend.js';
import { assistantJourneyHandoff } from './assistant_bare_destination.mjs';
import { romanianNationalQuery } from './ro_national_transit.mjs';

const originalFetch = globalThis.fetch;

try {
  // 1. Issue #1a: At ±4 m GPS accuracy, when Nominatim snaps to a bare highway way (no house_number
  // and road-centroid postcode), Geoapify, Nominatim and postcodes.io can suggest nearby candidates,
  // but cannot confirm the user's building or postal address.
  let scenario = 'uk_rooftop_and_postcode';
  let requests = [];
  globalThis.fetch = async (input) => {
    const url = new URL(typeof input === 'string' ? input : input.url || String(input));
    requests.push(url);
    if (scenario === 'uk_rooftop_and_postcode') {
      if (url.hostname === 'nominatim.openstreetmap.org' && url.searchParams.get('layer') !== 'address') {
        return Response.json({
          category: 'highway',
          type: 'residential',
          addresstype: 'road',
          lat: '51.47610',
          lon: '0.32100',
          address: {
            road: 'London Road',
            suburb: 'West Thurrock',
            town: 'Grays',
            postcode: 'RM17 5AA', // imprecise road-centroid postcode
            country: 'United Kingdom',
            country_code: 'gb'
          }
        });
      }
      if (url.hostname === 'nominatim.openstreetmap.org' && url.searchParams.get('layer') === 'address') {
        return Response.json({
          category: 'place',
          type: 'house',
          lat: '51.47614',
          lon: '0.32105',
          address: { house_number: '42', road: 'London Road', town: 'Grays', postcode: 'RM17 6JL', country_code: 'gb' }
        });
      }
      if (url.hostname === 'api.geoapify.com' && url.pathname === '/v1/geocode/reverse') {
        assert.equal(url.searchParams.get('type'), 'building');
        return Response.json({
          results: [{
            housenumber: '42',
            street: 'London Road',
            city: 'Grays',
            postcode: 'RM17 6JL',
            country: 'United Kingdom',
            country_code: 'gb',
            lat: 51.47614,
            lon: 0.32104,
            distance: 5.4
          }]
        });
      }
      if (url.hostname === 'api.postcodes.io') {
        return Response.json({
          status: 200,
          result: [
            { postcode: 'RM17 6JL', distance: 7.8 },
            { postcode: 'RM17 5AA', distance: 92.0 }
          ]
        });
      }
    }
    if (scenario === 'uk_far_building_no_hallucination') {
      if (url.hostname === 'nominatim.openstreetmap.org') {
        return Response.json({
          category: 'highway',
          type: 'residential',
          addresstype: 'road',
          lat: '51.47610',
          lon: '0.32100',
          address: {
            road: ' Arterial Road',
            town: 'Grays',
            postcode: 'RM16 1AA',
            country: 'United Kingdom',
            country_code: 'gb'
          }
        });
      }
      if (url.hostname === 'api.geoapify.com') {
        return Response.json({
          results: [{
            housenumber: '199',
            street: 'Arterial Road',
            city: 'Grays',
            postcode: 'RM16 2ZZ',
            country_code: 'gb',
            lat: 51.47690,
            lon: 0.32200,
            distance: 84.0 // too far to attribute to user
          }]
        });
      }
      if (url.hostname === 'api.postcodes.io') {
        return Response.json({
          status: 200,
          result: [{ postcode: 'RM16 6AB', distance: 14.2 }]
        });
      }
    }
    if (scenario === 'non_location_ai') {
      throw new Error('Non-location question must NOT call geocoding/weather/POI provider: ' + url.href);
    }
    throw new Error('Unexpected fetch in test: ' + url.href);
  };

  const askLocation = async (accuracy = 4, withGeoapify = true) => {
    const res = await worker.fetch(new Request('https://test.invalid/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Unde mă aflu?',
        language: 'ro',
        module: 'assistant',
        history: [],
        location_requested: true,
        location: { latitude: 51.47611, longitude: 0.32101, accuracy, updatedAt: Date.now() }
      })
    }), {
      ...(withGeoapify ? { GEOAPIFY_API_KEY: 'test-geoapify-key' } : {}),
      AI: { run: async () => { throw new Error('Self-location must never invoke AI'); } }
    });
    assert.equal(res.status, 200);
    return res.json();
  };

  const precise = await askLocation(4, true);
  assert.equal(precise.house_number, '42', 'Nearby mapped building can be offered as an estimate');
  assert.equal(precise.postcode, 'RM17 6JL', 'Nearby postcode candidate should be retained as an estimate');
  assert.match(precise.reply, /Locație aproximativă: 42 London Road, Grays, United Kingdom/);
  assert.match(precise.reply, /Coduri poștale din apropiere \(neconfirmate\): RM17 6JL/);
  assert.match(precise.reply, /estimări/);
  assert.equal(precise.address_is_estimate, true);

  // Even without GEOAPIFY_API_KEY, Nominatim layer=address + postcodes.io still recover house number & postcode
  const osmAndOnsOnly = await askLocation(5, false);
  assert.equal(osmAndOnsOnly.house_number, '42');
  assert.equal(osmAndOnsOnly.postcode, 'RM17 6JL');

  const mediumAccuracy = await askLocation(75, true);
  assert.equal(mediumAccuracy.house_number, null, 'Coarse GPS must not attribute a nearby house number');
  requests = [];
  const coarse = await askLocation(150, true);
  assert.equal(coarse.house_number, null);
  assert.equal(coarse.street, null);
  assert.equal(coarse.postcode, null);
  assert.ok(!requests.some(u => (u.hostname === 'api.geoapify.com' && u.pathname === '/v1/geocode/reverse') || u.hostname === 'api.postcodes.io' || u.searchParams.get('layer') === 'address'), 'Low precision must not cause address enrichment: ' + requests.map(String).join(', '));

  // Anti-hallucination: when nearest mapped building is 84 m away, never invent house_number, but still fix postcode
  scenario = 'uk_far_building_no_hallucination';
  const unnumberedSpot = await askLocation(4, true);
  assert.equal(unnumberedSpot.house_number, null, 'Must never borrow a house number 84 m away');
  assert.equal(unnumberedSpot.postcode, 'RM16 6AB', 'Nearby postcode candidate may be shown only as unconfirmed');

  // 2. Issue #2: Non-location questions must NEVER trigger "nu am putut identifica / precizează localitatea sau țara"
  scenario = 'non_location_ai';
  const nonLocationQuestions = [
    // Weather false-positive traps
    'Cum trăiau oamenii pe vremea romanilor?',
    'În ultima vreme dorm mai greu, ce sfaturi ai?',
    'La câte grade se coace cozonacul în cuptor?',
    'Câte grade are suma unghiurilor într-un triunghi?',
    'La ce temperatură fierbe apa la nivelul mării?',
    'Care este prognoza economică pentru inflație în 2027?',
    // Place/POI false-positive traps
    'Caută informații despre regimul alimentar în diabet',
    'Unde găsesc baremul la matematică?',
    'Recomandă-mi cărți despre marketing în engleză',
    'Găsește idei de postare în limba română',
    'Arată-mi parcursul istoric din Evul Mediu',
    'Ce materii se studiază la școală în Franța?',
    // Distance false-positive traps
    'Care este distanța de la Pământ până la Lună?',
    'Ce este distanța focală la o lentilă convergentă?',
    'Care sunt avantajele muncii la distanță în IT?',
    // Self-location / Street / Route false-positive traps
    'Explică sistemul de coordonate carteziene',
    'Unde este localizat ficatul în corpul uman?',
    'Cum funcționează sistemul GPS?',
    'Ce înseamnă Wall Street în economie?',
    'Beneficiile mersului pe jos în fiecare zi',
    'Cum funcționează transportul activ prin membrana celulară?'
  ];

  for (const question of nonLocationQuestions) {
    // Also verify assistantJourneyHandoff & romanianNationalQuery never hijack these
    assert.equal(assistantJourneyHandoff(question), null, 'assistantJourneyHandoff false positive: ' + question);
    assert.equal(
      romanianNationalQuery(question, { location: { latitude: 47.06, longitude: 21.93 } }),
      null,
      'romanianNationalQuery false positive: ' + question
    );

    let aiCalled = false;
    const res = await worker.fetch(new Request('https://test.invalid/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: question,
        language: 'ro',
        module: 'assistant',
        history: [],
        // Simulate lingering place/weather/distance contexts from earlier turns too!
        place_context: { category: 'restaurant', destination: 'Oradea', stars: null, central: false },
        weather_context: { query: 'Oradea', period: 'daily', offset: 0, pending: true }
      })
    }), {
      AI: {
        run: async () => {
          aiCalled = true;
          return { response: 'Răspuns enciclopedic normal pentru: ' + question };
        }
      }
    });
    const body = await res.json();
    assert.equal(res.status, 200, 'HTTP 200 expected for: ' + question);
    assert.equal(body.needs_location_clarification, undefined, 'Must not ask for town/country on: ' + question + ' -> ' + body.reply);
    assert.equal(body.needs_destination_clarification, undefined, 'Must not ask for destination on: ' + question + ' -> ' + body.reply);
    assert.doesNotMatch(
      body.reply || '',
      /Precizează (?:localitatea|orașul) și țara|Nu am primit coordonate GPS|spune-mi orașul de plecare/i,
      'Geolocation error leaked on non-location question: ' + question + ' -> ' + body.reply
    );
    assert.equal(aiCalled, true, 'General AI should answer non-location question: ' + question);
  }

  // English & multilingual handoff false-positive guards
  for (const nonRoute of [
    'How to cook pasta al dente',
    'Convert 10 miles to km',
    'Translate good morning to French',
    'Numără de la 1 până la 10',
    'Care este ruta metabolică a glicolizei?'
  ]) {
    assert.equal(assistantJourneyHandoff(nonRoute), null, 'Must not handoff to navigation: ' + nonRoute);
  }
} finally {
  globalThis.fetch = originalFetch;
}

// 3. Verify frontend HTML ceiling and requestUsesLocation / needsLocation guards
const html = await (await frontend.fetch(new Request('https://precision-test.invalid/'))).text();
assert.ok(html.length < 8_000_000, `HTML bundle exceeded 8,000,000 chars: ${html.length}`);
const script = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] || '';
const fnStart = script.indexOf('function isRecipeQuestion(text){');
const fnEnd = script.indexOf('function requestedTransitCountInMessage(value){', fnStart);
assert.ok(fnStart > 0 && fnEnd > fnStart, 'Expected frontend location intent helpers');
const ctx = vm.createContext({
  state: { currentView: 'assistant', pendingTravelMode: null },
  assistantBareDestinationQuery: () => null,
  cachedCoordinates: () => null,
  getCurrentCoordinates: async () => null,
  setTimeout,
  clearTimeout
});
vm.runInContext(script.slice(fnStart, fnEnd), ctx);
for (const nonGps of [
  'Unde este localizat ficatul în corpul uman?',
  'Cum trăiau oamenii pe vremea romanilor?',
  'Care sunt avantajele muncii la distanță?',
  'Explică sistemul de coordonate carteziene',
  'Caută informații despre regimul alimentar',
  'Cine a scris Luceafărul?'
]) {
  assert.equal(ctx.requestUsesLocation(nonGps), false, 'Frontend must not stall for GPS on: ' + nonGps);
}
for (const realGps of [
  'Unde mă aflu?',
  'Pe ce stradă sunt?',
  'Restaurante în apropiere',
  'Cum e vremea azi?'
]) {
  assert.equal(ctx.requestUsesLocation(realGps), true, 'Frontend must still attach GPS for: ' + realGps);
}

console.log(`PASS nearby-address estimates, precision guards and sampled non-location queries (HTML=${html.length})`);
