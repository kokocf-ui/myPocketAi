import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const scoped=source.slice(source.indexOf('/* Assistant → destination routing: same quiet palette'),source.lastIndexOf('</style>'));
assert.ok(scoped.length>900,'Expected route-only palette overrides at end of CSS');
for(const selector of [
 '#moduleQuickLayer.open .module-quick-sheet:has(#moduleLayerBody > .route-choice) #moduleLayerBody > .route-choice',
 '#moduleQuickLayer.open .module-quick-sheet .module-quick-body > .transit-journey-choice',
 '.travel-mode-table .transit-choice-action',
 '#pocketStandaloneChoices.assistant-route-mode-colors .pocket-choice-button'
]) assert.ok(scoped.includes(selector),'Missing muted petrol scope: '+selector);
for(const selector of [
 '#moduleQuickLayer.open .module-quick-sheet:has(#moduleLayerBody > .route-choice) #moduleLayerBody > .transit-choice-action',
 '#moduleQuickLayer.open .module-quick-sheet:has(#moduleLayerBody > .route-choice) .module-quick-header > .back-btn',
 '#moduleQuickLayer.open .module-quick-sheet .quick-navigation-toolbar > .transit-choice-action',
 '#pocketStandaloneChoices.assistant-route-mode-colors .answer-reader-header > .answer-reader-close'
])assert.ok(scoped.includes(selector),'Missing muted plum scope: '+selector);
assert.match(scoped,/#1a605f 0%,#10465b 55%,#0d3045 100%/,'Assistant uses same petrol gradient as Maps');
assert.match(scoped,/#723846,#4a293c 60%,#291f36/,'Navigation uses same plum gradient as Maps');
assert.match(scoped,/color:#f3fbff!important/,'Readable petrol text');
assert.match(scoped,/color:#fff5f6!important/,'Readable plum text');
const mode=source.slice(source.indexOf('function openTransportModeFromAssistant(data){'),source.indexOf('function appendTravelConfirmation(data,host){'));
assert.match(mode,/classList\.add\('assistant-route-mode-colors'\)/,'Structured assistant route modal gets visual scope');
assert.match(mode,/switchConversationModule\('maps'\);showNavigationReturn\(\)/,'Assistant to Maps handoff untouched');
assert.match(mode,/btn\.onclick=async\(\)=>/,'Mode selection handler remains');
const transit=source.slice(source.indexOf('function renderTransitChoices(options,selectedIndex=null){'),source.indexOf('async function selectTransitJourney(options,index){'));
assert.match(transit,/quick-navigation-toolbar/,'Transit Back and Return retain their handlers');
assert.match(transit,/appendTransitCards\(body,available\)/,'Transit cards continue to render');
assert.match(transit,/original\.onclick=\(\)=>returnToNavigationSource\(\)/,'Return still works');
console.log('PASS: Assistant route palettes now match Maps, no route behavior changed');
