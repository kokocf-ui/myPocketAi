import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const extract=(start,end)=>{const a=backend.indexOf(start),b=backend.indexOf(end,a);assert.ok(a>=0&&b>a,start+' helper not found');return backend.slice(a,b);};

const listCode=extract('function sortNumberedDatedEvents(','function removeRepeatedRecipeIngredients(');
const ingredientCode=extract('function removeRepeatedRecipeIngredients(','function formatJourneyDurationMinutes(');
const context=vm.createContext({Intl,Date});
vm.runInContext(listCode+ingredientCode,context);
const list=context.sortNumberedDatedEvents;
const clean=context.removeRepeatedRecipeIngredients;

const sample='În Oradea:\n- 5 decembrie: Regal Vienez\n- 6 decembrie: Moroșenii\n- 10 decembrie: Madrigal\n- 19 decembrie: Georgiana\n- 20 decembrie: Spectacol\n- 12 decembrie: EMABISZ\n- 5 decembrie: Regal Vienez';
const actual=list(sample,'ro');
const dates=actual.split('\n').filter(x=>x.startsWith('- '));
assert.equal(dates.length,6,'duplicate same event/date should be removed');
assert.deepEqual(dates.map(x=>Number(x.match(/\d+/)?.[0])),[5,6,10,12,19,20]);
const description='Evenimente:\n* Madrigal pe 10 decembrie 2026\n* Concert pe 5 decembrie 2026\n* Turneu pe 6 decembrie 2026';
assert.match(list(description,'ro'),/5 decembrie 2026\n- Turneu pe 6 decembrie 2026\n- Madrigal pe 10 decembrie/);
const numbered='Evenimente:\n1. 19 decembrie: concert\n2. 5 decembrie: concert\n3. 10 decembrie: festival';
assert.match(list(numbered,'ro'),/1\. 5 decembrie: concert\n2\. 10 decembrie: festival\n3\. 19 decembrie/);
const instructions='Preparare:\n1. Taie ceapa\n2. Umple foile\n3. Fierbe sarmalele';
assert.equal(list(instructions,'ro'),instructions,'recipe steps must not be rearranged');
const ingredients='**Ingredientele:**\n* 1 kg carne\n* 1 cană orez\n* 1 kg carne\n* 1 cană orez\n**Mod de preparare:**\n1. Toacă ceapa\n2. Fierbe orezul';
const cleaned=clean(ingredients);
assert.equal(cleaned.duplicates,2);
assert.match(cleaned.text,/1\. Toacă ceapa\n2\. Fierbe orezul/);

const stationCode=extract('const cityFirstStation=String(targetName).match(','const unqualifiedStation=');
const station=vm.runInNewContext("(function(){ const targetName='west dulwich, london'; "+stationCode+
 " return {qualified:Boolean(londonQualifiedName),lookedUp:tryVerifiedStation,core:londonQualifiedName?.[1]};})()");
assert.equal(station.qualified,true);
assert.equal(station.lookedUp,true);
assert.equal(station.core,'west dulwich');
assert.ok(backend.includes("reason:'exact_london_destination_unverified'"),'do not substitute unrelated POIs when station lookup fails');
assert.ok(backend.includes("actual!==wanted"),'London candidate must match full station/district name');

console.log('PASS: dated lists (bullet/numbered/text), duplicates, recipe ingredients and steps, London railway station handling.');
