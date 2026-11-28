import assert from 'node:assert/strict';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import worker from './backend.js';
import { rankJourneySuggestions } from './journey_suggestion_rank.mjs';
import { createMixedLocalPlanner } from './mixed_local_planner.mjs';
import { rankMixedFlightCandidates } from './mixed_serpapi_discovery.mjs';
import { searchMixedIndicativeOptions } from './mixed_indicative_search.mjs';

globalThis.crypto ??= webcrypto;

function haversineMeters(a, b) {
  const rad = Math.PI / 180;
  const dLat = (Number(b.latitude) - Number(a.latitude)) * rad;
  const dLon = (Number(b.longitude) - Number(a.longitude)) * rad;
  const lat1 = Number(a.latitude) * rad;
  const lat2 = Number(b.latitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

const origFetch = globalThis.fetch;

// ---------------------------------------------------------------------------
// 1A. Piața Unirii 1, Oradea: resolve right inside Piața Unirii (<=120 m),
//     NEVER jump ~650 m away onto Strada Tudor Vladimirescu due to OSM mistag.
// ---------------------------------------------------------------------------
{
  globalThis.fetch = async (input) => {
    const u = new URL(String(input?.url || input));
    if (u.hostname === 'api.geoapify.com' && (u.pathname === '/v1/geocode/search' || u.pathname === '/v1/geocode/autocomplete')) {
      const text = String(u.searchParams.get('text') || '');
      const rogueTudorVladimirescu = {
        name: '1 Piața Unirii',
        street: 'Piața Unirii',
        housenumber: '1',
        city: 'Oradea',
        municipality: 'Municipiul Oradea',
        postcode: '410100',
        country: 'Romania',
        country_code: 'ro',
        result_type: 'building',
        lat: 47.05682,
        lon: 21.92081,
        formatted: 'Piața Unirii 1, 410100 Oradea, Romania'
      };
      const primariaOradea = {
        name: 'Primăria Municipiului Oradea',
        street: 'Piața Unirii',
        housenumber: '1-3',
        city: 'Oradea',
        municipality: 'Municipiul Oradea',
        postcode: '410100',
        country: 'Romania',
        country_code: 'ro',
        result_type: 'building',
        lat: 47.05528,
        lon: 21.92832,
        formatted: 'Primăria Municipiului Oradea, Piața Unirii 1-3, 410100 Oradea, Romania'
      };
      const piataUniriiSquare = {
        name: 'Piața Unirii',
        street: 'Piața Unirii',
        city: 'Oradea',
        municipality: 'Municipiul Oradea',
        postcode: '410100',
        country: 'Romania',
        country_code: 'ro',
        result_type: 'street',
        lat: 47.05482,
        lon: 21.92854,
        formatted: 'Piața Unirii, 410100 Oradea, Romania'
      };
      if (/^1\s+Pia/i.test(text)) {
        return Response.json({ results: [rogueTudorVladimirescu] });
      }
      return Response.json({ results: [rogueTudorVladimirescu, primariaOradea, piataUniriiSquare] });
    }
    return Response.json({ results: [], features: [] });
  };

  const res = await worker.fetch(new Request('https://test/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      journey_suggest: { query: 'Piața Unirii 1, Oradea', national_public_transport: false },
      language: 'ro'
    })
  }), { GEOAPIFY_API_KEY: 'test-geo' });
  const data = await res.json();
  assert.ok(Array.isArray(data.candidates) && data.candidates.length >= 1, 'Piața Unirii 1, Oradea must resolve a verified candidate');
  const distFromRealSquare = haversineMeters(data.candidates[0], { latitude: 47.05482, longitude: 21.92854 });
  assert.ok(distFromRealSquare <= 120, `Expected Piața Unirii 1 inside Piața Unirii (<=120 m), got ${Math.round(distFromRealSquare)} m`);
}

// ---------------------------------------------------------------------------
// 1B. Strada Morii 15, Oradea vs neighbouring commune Sânmartin (410100 Oradea):
//     must never return Sânmartin / Băile Felix disguised as Oradea.
// ---------------------------------------------------------------------------
{
  globalThis.fetch = async (input) => {
    const u = new URL(String(input?.url || input));
    if (u.hostname === 'api.geoapify.com') {
      return Response.json({
        results: [
          {
            street: 'Strada Morii',
            housenumber: '15',
            city: 'Oradea', // mistagged addr:city in OSM inside Comuna Sânmartin
            postcode: '410100',
            country: 'Romania',
            country_code: 'ro',
            result_type: 'building',
            lat: 47.00124,
            lon: 21.97348,
            formatted: 'Strada Morii 15, 410100 Oradea, Romania'
          },
          {
            street: 'Strada Morii',
            housenumber: '15',
            city: 'Oradea',
            municipality: 'Municipiul Oradea',
            postcode: '410605',
            country: 'Romania',
            country_code: 'ro',
            result_type: 'building',
            lat: 47.08842,
            lon: 21.91825,
            formatted: 'Strada Morii 15, 410605 Oradea, Romania'
          }
        ]
      });
    }
    return Response.json({ results: [], features: [] });
  };

  const res = await worker.fetch(new Request('https://test/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      journey_suggest: { query: 'Strada Morii 15, Oradea', national_public_transport: false },
      language: 'ro'
    })
  }), { GEOAPIFY_API_KEY: 'test-geo' });
  const data = await res.json();
  assert.equal(data.candidates.length, 1, 'Only Municipiul Oradea Strada Morii 15 may satisfy explicit Oradea locality');
  assert.ok(data.candidates[0].latitude > 47.05, 'Candidate must lie inside Municipiul Oradea, north of Sânmartin border');

  const ranked = rankJourneySuggestions('Strada Morii 15, Oradea', [
    {
      label: 'Strada Morii 15, 410100 Oradea, Romania',
      latitude: 47.00124,
      longitude: 21.97348,
      city: 'Sânmartin',
      country_code: 'RO',
      street: 'Strada Morii',
      house_number: '15',
      kind: 'building',
      _postcode: '410100'
    }
  ]);
  assert.equal(ranked.length, 0, 'rankJourneySuggestions must not let mistagged label override structured city Sânmartin');

  const indexSrc = fs.readFileSync(new URL('./index.js', import.meta.url), 'utf8');
  assert.match(indexSrc, /sameStageEndpoint/, 'openTransitJourneyMap must guard against A -> A walk stage headers');
}

// ---------------------------------------------------------------------------
// 2. Oradea -> Piața Unirii 2, Cluj-Napoca: includes urban CTP Cluj transit leg
//    from Cluj arrival hub to Piața Unirii 2 instead of >2 km pure walking.
// ---------------------------------------------------------------------------
{
  globalThis.fetch = async (input, init) => {
    const u = new URL(String(input?.url || input));
    if (u.hostname === 'mcp.bilo.ro' && u.pathname === '/api/v1/search') {
      return Response.json({
        results: [
          {
            mode: 'bus',
            operator: 'Fany',
            route: 'BUS 101',
            from: 'Autogara Oradea',
            fromLocality: 'Oradea',
            to: 'Autogara Fany Cluj-Napoca',
            toLocality: 'Cluj-Napoca',
            departureTime: '07:00',
            arrivalTime: '09:45',
            durationMinutes: 165
          }
        ]
      });
    }
    if (u.hostname === 'bilo.ro') {
      return Response.json({ results: [] });
    }
    if (u.hostname === 'api.geoapify.com' && u.pathname === '/v1/geocode/search') {
      const text = String(u.searchParams.get('text') || '');
      if (/Oradea/i.test(text)) {
        return Response.json({
          features: [{
            properties: {
              name: 'Autogara Oradea',
              city: 'Oradea',
              country_code: 'ro',
              lat: 47.0695,
              lon: 21.9345,
              formatted: 'Autogara Oradea, Oradea, Romania'
            }
          }]
        });
      }
      if (/Cluj/i.test(text)) {
        return Response.json({
          features: [{
            properties: {
              name: 'Autogara Fany Cluj-Napoca',
              city: 'Cluj-Napoca',
              country_code: 'ro',
              lat: 46.7848,
              lon: 23.5872,
              formatted: 'Autogara Fany, Cluj-Napoca, Romania'
            }
          }]
        });
      }
      return Response.json({ features: [] });
    }
    if (u.hostname === 'api.geoapify.com' && u.pathname === '/v1/routing') {
      const mode = u.searchParams.get('mode');
      const [wpA, wpB] = String(u.searchParams.get('waypoints') || '').split('|').map(p => p.split(',').map(Number));
      const dist = haversineMeters({ latitude: wpA[0], longitude: wpA[1] }, { latitude: wpB[0], longitude: wpB[1] });
      const speed = mode === 'walk' ? 1.3 : 7.5;
      const secs = Math.max(60, Math.round(dist * 1.25 / speed));
      return Response.json({
        features: [{
          properties: {
            distance: Math.round(dist * 1.25),
            distance_units: 'meters',
            time: secs,
            legs: [{ steps: [{ distance: Math.round(dist * 1.25), instruction: { text: 'Mergi înainte.' } }] }]
          },
          geometry: {
            type: 'LineString',
            coordinates: [[wpA[1], wpA[0]], [(wpA[1] + wpB[1]) / 2, (wpA[0] + wpB[0]) / 2], [wpB[1], wpB[0]]]
          }
        }]
      });
    }
    if (u.hostname === 'overpass.kumi.systems' || u.hostname === 'maps.mail.ru') {
      return Response.json({
        elements: [
          { id: 101, type: 'node', lat: 46.7842, lon: 23.5875, tags: { name: 'Gara Cluj-Napoca', highway: 'bus_stop' } },
          { id: 102, type: 'node', lat: 46.7701, lon: 23.5892, tags: { name: 'Memorandumului Sud', highway: 'bus_stop' } },
          {
            id: 9001,
            type: 'relation',
            tags: { type: 'route', route: 'bus', ref: '9', operator: 'CTP Cluj-Napoca' },
            members: [
              { type: 'node', ref: 101, role: 'stop' },
              { type: 'node', ref: 102, role: 'stop' }
            ]
          }
        ]
      });
    }
    return Response.json({ results: [], features: [] });
  };

  const mockRoUrbanVpc = {
    fetch: async () => Response.json({ status: 'no_routes', journeys: [] })
  };

  const res = await worker.fetch(new Request('https://test/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Transport public de la Piața Unirii 1, Oradea la Piața Unirii 2, Cluj-Napoca',
      language: 'ro',
      module: 'maps',
      mixed_journey: true,
      journey_origin: {
        label: 'Piața Unirii 1, Oradea, Romania',
        city: 'Oradea',
        country_code: 'RO',
        latitude: 47.05528,
        longitude: 21.92832
      },
      transit_destination: {
        label: 'Piața Unirii 2, Cluj-Napoca, Romania',
        city: 'Cluj-Napoca',
        country_code: 'RO',
        latitude: 46.7694,
        longitude: 23.5898
      },
      transit_departure_at: '2026-11-29T07:00:00+02:00'
    })
  }), {
    AI: { run: async () => ({ response: '' }) },
    BILO_API_KEY: 'test-bilo',
    GEOAPIFY_API_KEY: 'test-geo',
    RO_URBAN_VPC: mockRoUrbanVpc,
    RO_URBAN_API_TOKEN: 'secret-service-token-12345678901234567890'
  });

  const payload = await res.json();
  assert.equal(payload.transit_available, true, 'Oradea -> Cluj-Napoca must return verified transit journeys');
  const firstJourney = payload.transit[0];
  const clujUrbanLeg = firstJourney.legs.find(l => (l.lineNames || []).includes('9') || /9|CTP/i.test(`${l.line || ''} ${l.operator || ''} ${l.summary || ''}`));
  assert.ok(clujUrbanLeg, `Expected local urban CTP Cluj leg to Piața Unirii 2, got legs: ${JSON.stringify(firstJourney.legs.map(l => ({ mode: l.mode, line: l.line || l.lineNames, from: l.from, to: l.to, urban: l.urban_leg })))}`);
}

// ---------------------------------------------------------------------------
// 3 & 4. Biserica cu Lună, Oradea -> Crângași, Bucharest:
//        - Exonym "Bucharest" resolves to "București" for Bilo rail/coach
//        - Bilo rail/coach suppresses redundant Exa/Brave ground quota error
//        - OMR (4.5 km from Oradea) outranks CLJ (136 km from Oradea)
//        - Flight airport access (Oradea -> OMR) & egress (OTP -> Crângași, 16.5 km)
//          produce verified local ground legs instead of "nu este încă verificat".
// ---------------------------------------------------------------------------
{
  const rankedCandidates = rankMixedFlightCandidates(
    [
      {
        totalFlightDurationMinutes: 55,
        legs: [{ from: 'CLJ', to: 'OTP', startLocal: '2026-11-29T06:15', endLocal: '2026-11-29T07:10', flightNumber: 'RO 650', airline: 'TAROM' }]
      },
      {
        totalFlightDurationMinutes: 70,
        legs: [{ from: 'OMR', to: 'OTP', startLocal: '2026-11-29T09:30', endLocal: '2026-11-29T10:40', flightNumber: 'H4 102', airline: 'HiSky' }]
      }
    ],
    {
      max: 10,
      airportCandidates: {
        origin: [
          { iata: 'OMR', name: 'Oradea Airport', latitude: 47.0253, longitude: 21.9025, distanceMeters: 4500 },
          { iata: 'CLJ', name: 'Cluj Airport', latitude: 46.7852, longitude: 23.6862, distanceMeters: 136000 }
        ],
        destination: [
          { iata: 'OTP', name: 'Henri Coandă Airport', latitude: 44.5711, longitude: 26.085, distanceMeters: 15800 }
        ]
      }
    }
  );
  assert.equal(rankedCandidates[0].legs[0].from, 'OMR', 'Nearby Oradea Airport (OMR) must outrank distant Cluj Airport (CLJ)');

  let exaOrBraveCalls = 0;
  const mixedNoGround = await searchMixedIndicativeOptions(
    { EXA_API_KEY: 'exa-key', BRAVE_SEARCH_API_KEY: 'brave-key' },
    {
      origin: { label: 'Biserica cu Lună, Piața Unirii 2, Oradea, Romania', city: 'Oradea', country_code: 'RO', latitude: 47.0545, longitude: 21.9289 },
      destination: { label: 'Crângași, Bucharest, Romania', city: 'București', country_code: 'RO', latitude: 44.4519, longitude: 26.0478 },
      departureAt: '2026-11-29T03:04:00+02:00',
      includeFlights: false,
      includeGroundDiscovery: false
    },
    {
      fetcher: async (url) => {
        if (/exa\.ai|search\.brave\.com/i.test(String(url))) exaOrBraveCalls++;
        return Response.json({});
      }
    }
  );
  assert.equal(exaOrBraveCalls, 0, 'includeGroundDiscovery: false must not spend subrequests or trigger quota errors on Exa/Brave');
  assert.deepEqual(mixedNoGround.operator_source_errors || [], [], 'No false ground refusal/quota banner may be emitted when Bilo already succeeded');

  const roUrbanMock = {
    fetch: async () => Response.json({ status: 'no_routes', journeys: [] })
  };
  const envWithRoUrban = {
    AI: { run: async () => ({ response: '' }) },
    GEOAPIFY_API_KEY: 'test-geo',
    RO_URBAN_VPC: roUrbanMock,
    RO_URBAN_API_TOKEN: 'secret-service-token-12345678901234567890'
  };
  globalThis.fetch = async (input, init) => {
    const u = new URL(String(input?.url || input));
    if (u.hostname === 'api.geoapify.com' && u.pathname === '/v1/routing') {
      const mode = u.searchParams.get('mode');
      const [wpA, wpB] = String(u.searchParams.get('waypoints') || '').split('|').map(p => p.split(',').map(Number));
      const dist = haversineMeters({ latitude: wpA[0], longitude: wpA[1] }, { latitude: wpB[0], longitude: wpB[1] });
      const speed = mode === 'walk' ? 1.3 : 8.5;
      return Response.json({
        features: [{
          properties: {
            distance: Math.round(dist * 1.2),
            distance_units: 'meters',
            time: Math.max(90, Math.round(dist * 1.2 / speed)),
            legs: [{ steps: [{ distance: Math.round(dist * 1.2), instruction: { text: 'Continue.' } }] }]
          },
          geometry: {
            type: 'LineString',
            coordinates: [[wpA[1], wpA[0]], [wpB[1], wpB[0]]]
          }
        }]
      });
    }
    if (u.hostname === 'overpass.kumi.systems' || u.hostname === 'maps.mail.ru') {
      const body = decodeURIComponent(String(init?.body || input?.body || ''));
      if (body.includes('47.0')) {
        return Response.json({
          elements: [
            { id: 1, type: 'node', lat: 47.0547, lon: 21.9286, tags: { name: 'Piața Unirii', highway: 'bus_stop' } },
            { id: 2, type: 'node', lat: 47.0358, lon: 21.9070, tags: { name: 'Aeroportul Oradea', highway: 'bus_stop' } },
            { id: 28, type: 'relation', tags: { type: 'route', route: 'bus', ref: '28', operator: 'OTL' }, members: [{ type: 'node', ref: 1, role: 'stop' }, { type: 'node', ref: 2, role: 'stop' }] }
          ]
        });
      }
      return Response.json({
        elements: [
          { id: 11, type: 'node', lat: 44.5721, lon: 26.0772, tags: { name: 'Aeroport Henri Coandă Sosiri', highway: 'bus_stop' } },
          { id: 12, type: 'node', lat: 44.4524, lon: 26.0481, tags: { name: 'Crângași', highway: 'bus_stop' } },
          { id: 100, type: 'relation', tags: { type: 'route', route: 'bus', ref: '100', operator: 'STB' }, members: [{ type: 'node', ref: 11, role: 'stop' }, { type: 'node', ref: 12, role: 'stop' }] }
        ]
      });
    }
    return Response.json({ results: [], features: [] });
  };
  const planner = createMixedLocalPlanner({
    env: envWithRoUrban,
    dispatch: (req, e) => worker.fetch(req, e),
    language: 'ro'
  });

  const accessRes = await planner(
    envWithRoUrban,
    { label: 'Biserica cu Lună, Piața Unirii 2, Oradea', city: 'Oradea', country_code: 'RO', latitude: 47.0545, longitude: 21.9289 },
    { iata: 'OMR', label: 'Aeroportul Internațional Oradea', city: 'Oradea', country_code: 'RO', latitude: 47.0253, longitude: 21.9025 },
    4,
    { departureAt: '2026-11-29T07:30:00+02:00' }
  );
  assert.ok(accessRes.journeys.length >= 1, 'Oradea -> OMR airport access must resolve a verified ground journey');
  assert.ok(accessRes.journeys[0].walkToFirstStop, 'Airport access journey must carry walkToFirstStop');
  assert.ok(accessRes.journeys[0].arrivalPoint, 'Airport access journey must carry arrivalPoint');

  const egressRes = await planner(
    envWithRoUrban,
    { iata: 'OTP', label: 'Aeroportul Internațional Henri Coandă', city: 'Otopeni', country_code: 'RO', latitude: 44.5711, longitude: 26.085 },
    { label: 'Crângași, Bucharest, Romania', city: 'București', country_code: 'RO', latitude: 44.4519, longitude: 26.0478 },
    4,
    { departureAt: '2026-11-29T11:10:00+02:00' }
  );
  assert.ok(egressRes.journeys.length >= 1, 'OTP -> Crângași (16.5 km) airport egress must resolve a verified ground journey');
  assert.ok(egressRes.journeys[0].legs.some(l => l.mode !== 'walking'), 'OTP -> Crângași must use transit rather than pure walking');

  let biloBodies = [];
  globalThis.fetch = async (input, init) => {
    const u = new URL(String(input?.url || input));
    if (u.hostname === 'mcp.bilo.ro' && u.pathname === '/api/v1/search') {
      const body = JSON.parse(String(init?.body || '{}'));
      biloBodies.push(body);
      return Response.json({
        results: [
          {
            mode: 'train',
            operator: 'CFR Călători',
            trainNumber: 'IR 1742',
            from: 'Oradea',
            fromLocality: 'Oradea',
            to: 'București Nord',
            toLocality: 'București',
            departureTime: '05:10',
            arrivalTime: '17:35',
            durationMinutes: 745
          },
          {
            mode: 'bus',
            operator: 'FlixBus',
            route: 'BUS 910',
            from: 'Autogara Oradea',
            fromLocality: 'Oradea',
            to: 'Autogara Militari București',
            toLocality: 'București',
            departureTime: '06:30',
            arrivalTime: '16:30',
            durationMinutes: 600
          }
        ]
      });
    }
    if (u.hostname === 'bilo.ro') return Response.json({ results: [] });
    if (u.hostname === 'api.geoapify.com') {
      if (u.pathname === '/v1/geocode/search') {
        const text = String(u.searchParams.get('text') || '');
        if (/Oradea/i.test(text)) return Response.json({ features: [{ properties: { name: 'Gara Oradea', city: 'Oradea', country_code: 'ro', lat: 47.0694, lon: 21.9339, formatted: 'Gara Oradea, Romania' } }] });
        if (/Bucure/i.test(text)) return Response.json({ features: [{ properties: { name: 'Gara București Nord', city: 'București', country_code: 'ro', lat: 44.4468, lon: 26.0744, formatted: 'Gara de Nord, București, Romania' } }] });
        return Response.json({ features: [] });
      }
      if (u.pathname === '/v1/routing') {
        const [wpA, wpB] = String(u.searchParams.get('waypoints') || '').split('|').map(p => p.split(',').map(Number));
        const dist = haversineMeters({ latitude: wpA[0], longitude: wpA[1] }, { latitude: wpB[0], longitude: wpB[1] });
        return Response.json({
          features: [{
            properties: { distance: Math.round(dist * 1.2), distance_units: 'meters', time: Math.max(90, Math.round(dist / 5)), legs: [{ steps: [{ distance: Math.round(dist * 1.2), instruction: { text: 'Mergi.' } }] }] },
            geometry: { type: 'LineString', coordinates: [[wpA[1], wpA[0]], [wpB[1], wpB[0]]] }
          }]
        });
      }
    }
    if (u.hostname === 'overpass.kumi.systems' || u.hostname === 'maps.mail.ru') {
      return Response.json({
        elements: [
          { id: 21, type: 'node', lat: 44.4469, lon: 26.0742, tags: { name: 'Gara de Nord', railway: 'subway_entrance' } },
          { id: 22, type: 'node', lat: 44.4518, lon: 26.0476, tags: { name: 'Crângași', railway: 'subway_entrance' } },
          { id: 501, type: 'relation', tags: { type: 'route', route: 'subway', ref: 'M1', operator: 'Metrorex' }, members: [{ type: 'node', ref: 21, role: 'stop' }, { type: 'node', ref: 22, role: 'stop' }] }
        ]
      });
    }
    return Response.json({ results: [], features: [] });
  };

  const chatRes = await worker.fetch(new Request('https://test/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Transport public de la Biserica cu Lună, Piața Unirii 2, Oradea la Crângași, Bucharest',
      language: 'ro',
      module: 'maps',
      mixed_journey: true,
      journey_origin: {
        label: 'Biserica cu Lună, Piața Unirii 2, Oradea, Romania',
        city: 'Oradea',
        country_code: 'RO',
        latitude: 47.0545,
        longitude: 21.9289
      },
      transit_destination: {
        label: 'Crângași, Bucharest, Romania',
        city: 'Bucharest',
        country_code: 'RO',
        latitude: 44.4519,
        longitude: 26.0478
      },
      transit_departure_at: '2026-11-29T03:04:00+02:00'
    })
  }), {
    AI: { run: async () => ({ response: '' }) },
    BILO_API_KEY: 'test-bilo',
    GEOAPIFY_API_KEY: 'test-geo',
    EXA_API_KEY: 'exa-key',
    BRAVE_SEARCH_API_KEY: 'brave-key',
    RO_URBAN_VPC: roUrbanMock,
    RO_URBAN_API_TOKEN: 'secret-service-token-12345678901234567890'
  });
  const chatPayload = await chatRes.json();
  assert.ok(biloBodies.length >= 1, 'English exonym "Bucharest" must dispatch Romanian national Bilo search');
  assert.equal(biloBodies[0].origin, 'Oradea');
  assert.equal(biloBodies[0].destination, 'București');
  assert.equal(chatPayload.transit_available, true, 'Oradea -> Crângași, Bucharest must return verified rail and coach journeys');
  assert.ok(chatPayload.transit.length >= 2, 'Both train and coach options must be returned');
  assert.deepEqual(chatPayload.operator_source_errors || [], [], 'No ground search refusal/quota error may appear alongside verified Bilo journeys');
}

globalThis.fetch = origFetch;
console.log('PASS Romanian real-device screenshot regressions (Piața Unirii 1 Oradea, Strada Morii Sânmartin isolation, Cluj CTP final leg, Oradea->Bucharest rail/coach + OMR/OTP airport ground connections)');
