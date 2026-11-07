import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const canonicalStart=frontend.indexOf('function canonicalAddressCityQuery(');
const canonicalEnd=frontend.indexOf('\nfunction renderStructuredAddressPicker(',canonicalStart);
assert.ok(canonicalStart>0&&canonicalEnd>canonicalStart,'Country-localized city lookup must exist');
const cityAlias=new Function(frontend.slice(canonicalStart,canonicalEnd)+'\nreturn canonicalAddressCityQuery')();
assert.equal(cityAlias('GB','Londra'),'London');
assert.equal(cityAlias('gb','Londres'),'London');
assert.equal(cityAlias('GB','London'),'London');
assert.equal(cityAlias('RO','Londra'),'Londra','A UK-specific alias must not silently change other countries');
assert.ok(frontend.includes("stage==='city'?canonicalAddressCityQuery(selected.country?.code,typedQuery):typedQuery"),
 'The UI must send the canonical city name to the mapping provider');

const match=frontend.match(/const countries='([^']+)'\.split\(' '\);/);
assert.ok(match,'Structured address picker should use a fixed ISO country list');
const countries=match[1].split(' ');
assert.equal(new Set(countries).size,countries.length,'Country codes must not repeat');
assert.ok(countries.includes('GB'));
assert.ok(!countries.includes('UK'),'UK is not an ISO 3166-1 country code');
assert.ok(!countries.includes('ZZ'));
assert.ok(countries.includes('RO')&&countries.includes('FR')&&countries.includes('IT'));
const display=new Intl.DisplayNames(['ro'],{type:'region'});
assert.equal(countries.filter(code=>display.of(code)==='Regatul Unit').length,1,
 'UK selector must have exactly one verified Regatul Unit');
assert.equal(countries.filter(code=>display.of(code)==='Regiune necunoscută').length,0,
 'Unknown regions must never appear in the list');

assert.ok(frontend.includes("t('Stradă / stație (opțional)','Street or station (optional)')"),
 'Users need to know the location input accepts a railway station');
assert.ok(frontend.includes("stage==='street'&&point.kind==='station'"),
 'Verified railway station must not ask for a fake house number');
assert.ok(frontend.includes("selected.street?.kind==='station'?null"),
 'Verified station destination should not be marked as approximate street');
assert.ok(frontend.includes("mode==='transit'&&choice.mixedJourney"),
 'Only European mixed-journey selection should be relabeled, not the separate local TfL mode');
assert.ok(frontend.includes("'Transport mixt'"));
assert.ok(frontend.includes("const seenCandidates=new Set()"),
 'Frontend must de-duplicate repeated provider results');

const start=frontend.indexOf('    const seenCandidates=new Set();');
const end=frontend.indexOf('    if(!current())return;',start);
assert.ok(start>0&&end>start);
const selection=frontend.slice(start,end);
const getCandidates=new Function('rawCandidates','stage','normalize','selected',
 selection+'\nreturn candidates;');
const normalized=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim();
const london={city:'London'};
const unique=getCandidates([
 {label:'Oxford Street, London',street:'Oxford Street',postcode:'W1D',city:'London'},
 {label:'Oxford Street, London',street:'Oxford Street',postcode:'W1D',city:'London'},
 {label:'Victoria Street, London',street:'Victoria Street',postcode:'SW1',city:'London'}
],'street',normalized,{city:london});
assert.equal(unique.length,2,'Duplicate street/postcode rows should collapse');
const station=getCandidates([
 {label:'Victoria Rail Station, London',kind:'station',city:'London'},
 {label:'Victoria Rail Station, London',kind:'station',city:'London'}
],'street',normalized,{city:london});
assert.equal(station.length,1,'Duplicate railway station rows should collapse');
const numbers=getCandidates([
 {houseNumber:'1',street:'Oxford Street',postcode:'W1D',city:'London'},
 {houseNumber:'2',street:'Oxford Street',postcode:'W1D',city:'London'}
],'number',normalized,{city:london});
assert.equal(numbers.length,2,'Distinct real house numbers must not be lost');
console.log('PASS mixed selector: ISO countries, station inputs, transport label and address deduplication');
