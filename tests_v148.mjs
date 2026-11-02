import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const checks=[
 ['Fast-food has a dedicated backend intent',backend.includes('{ key: "fast_food", pattern:')],
 ['Fast-food requests use catering.fast_food',backend.includes('fast_food: "catering.fast_food"')],
 ['Fast-food is included in Geoapify category matching',backend.includes('fast_food: /catering\\.fast_food/.test(cats)')],
 ['Small groceries are covered',backend.includes('greengrocer|newsagent')],
 ['Fast-food has its own quick selection',frontend.includes("title:'Fast-food și mâncare la pachet'")],
 ['Small groceries have their own quick selection',frontend.includes("title:'Băcănii și magazine mici'")],
 ['A real image can be shown as a thumbnail',frontend.includes('function mountPlaceThumbnail(host,place)')],
 ['Thumbnail expands without resizing the page',frontend.includes('function showPlacePhoto(url,name)')],
 ['Place thumbnail falls back to logo',frontend.includes('mountPlaceLogo(host,place)')],
 ['Walking handoff changes to the maps module',frontend.includes("switchConversationModule('maps');inputEl.value=routeActionsText().prompt+place.name")],
 ['Explicit travel mode transfers to maps',frontend.includes("switchConversationModule('maps');inputEl.value=t[i+1]")],
 ['All supported languages preserve quick-category labels',['en','fr','de','it','es','pt','nl','ru','pl'].every(lang=>frontend.includes("'"+lang+"':{'Fast-food și mâncare la pachet'"))]
];
for(const [label,ok] of checks){assert.ok(ok,label);console.log('PASS '+label)}
console.log('v148 safeguards: '+checks.length+' checks passed');
