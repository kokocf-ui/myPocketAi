import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EUROPEAN_UI_LOCALES} from './european_app_locales.mjs';

const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const countryLocales=Object.entries(EUROPEAN_UI_LOCALES);
assert.ok(countryLocales.length>=30,'Keep all European settings languages');
for(const [language,locale] of countryLocales){
 assert.equal(locale.cards?.length,6,language+' must localize six home cards');
 assert.equal(locale.moduleTitle?.travel,locale.cards[2][0],language+' hotel heading');
 assert.equal(locale.moduleTitle?.maps,locale.cards[4][0],language+' maps heading');
 for(const [name,detail] of locale.cards){
  assert.ok(name&&detail&&detail!=='myPocket AI',language+' has a real card label/description');
 }
}
assert.match(ui,/if\(key==='maps'\|\|key==='travel'\)renderModuleLandingChoices\(\)/,'Maps/Hotels must display choices immediately');
assert.match(ui,/function renderModuleLandingChoices\(\)/);
assert.match(ui,/openModuleLandingAction\(choice\)/,'Each landing card opens its selected action directly');
assert.match(ui,/function openModuleLandingAction\(choice\)/,'Single supported landing dispatcher');
assert.doesNotMatch(ui,/function renderModuleQuickChoices\(/,'Legacy quick-choice table must be deleted');
assert.doesNotMatch(ui,/id="moduleQuickTrigger"/,'Remove hidden quick-choice button from DOM');
assert.match(ui,/const translated=window\.__pocketEuropeanUiText\?\.\[lang\]\?\.wordTranslations/,'Screens translate static Ukrainian category labels');
assert.match(ui,/Restore measured full-height subject selection/,'Last stylesheet corrects earlier CSS cap');
assert.match(ui,/function returnToModuleLanding\(\)/,'Back returns to module landing');
assert.match(ui,/if\(state\.moduleSearchResults\.length\)/,'Optional previous results are retained');
const ua=EUROPEAN_UI_LOCALES.uk;
assert.equal(ua.cards[0][0],'ШІ-помічник');
assert.equal(ua.quickChoices['Hoteluri'],'Готелі');
assert.equal(ua.toolsCards.length,6);
assert.ok(ua.wordTranslations['Calendar și evenimente']);
console.log('PASS: Maps/Hotels landing cards, Education viewport and European UI locales');
