import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const checks=[
 ['Fast-food has a dedicated backend intent',backend.includes('{ key: "fast_food", pattern:')],
 ['Fast-food requests use catering.fast_food',backend.includes('fast_food: "catering.fast_food"')],
 ['Fast-food is included in Geoapify category matching',backend.includes('fast_food: /catering\\.fast_food/.test(cats)')],
 ['Small groceries have a separate backend category',backend.includes('{ key: "corner_shop", pattern:') && backend.includes('corner_shop: "commercial.convenience,commercial.food_and_drink"')],
 ['Fast-food has its own quick selection',frontend.includes("title:'Fast-food și mâncare la pachet'")],
 ['Small groceries have their own quick selection',frontend.includes("title:'Băcănii și magazine mici'")],
 ['A real image can be shown as a thumbnail',frontend.includes('function mountPlaceThumbnail(host,place)')],
 ['Thumbnail expands without resizing the page',frontend.includes('function showPlacePhoto(url,name)')],
 ['Place thumbnail falls back to logo',frontend.includes('mountPlaceLogo(host,place)')],
 ['Place details offer a mode selector before handoff',frontend.includes('function offerPlaceTravelModes(place)') && frontend.includes('offerPlaceTravelModes(place)')],
 ['Place selection preserves origin module',frontend.includes('rememberNavigationSource(place)')],
  ['Transport variants have one paired navigation toolbar',frontend.includes("actions.className='quick-navigation-toolbar'")&&frontend.includes("original.textContent=state.language==='ro'?'Revenire'")],
 ['Transport cards cannot shrink and overlap their text',frontend.includes('.module-quick-body .transit-journey-choice{display:block!important;flex:0 0 auto!important;')],
 ['Map close returns Assistant to its source',frontend.includes("if(state.navigationReturnContext?.view==='assistant')returnToNavigationSource()")],
 ['Return action remains responsive during pending requests',frontend.includes('if(state.busy){state.conversationGeneration++;state.busy=false}')],
 ['Choice buttons use luminous cyan',frontend.includes('.bubble .transit-choice-action,.answer-reader .transit-choice-action')],
['Back returns to previous search results',frontend.includes('state.navigationReturnContext=null;') && frontend.includes('renderModulePlaces(state.moduleSearchResults)')],
 ['Walking routes beyond 5 km are omitted',frontend.includes("data.straight_line_distance_km>5")],
 ['Explicit travel mode transfers to maps',frontend.includes("switchConversationModule('maps');showNavigationReturn();inputEl.value=t[i+1]")],
 ['Assistant transit sends verified coordinates',frontend.includes("transit_destination:travelMode==='transit'?routeDestination:undefined")],
 ['Viewport sizing is shared across categories',frontend.includes('#moduleQuickLayer.open .module-quick-sheet{height:100%!important')],
 ['All supported languages preserve quick-category labels',['en','fr','de','it','es','pt','nl','ru','pl'].every(lang=>frontend.includes("'"+lang+"':{'Fast-food și mâncare la pachet'"))]
];
for(const [label,ok] of checks){assert.ok(ok,label);console.log('PASS '+label)}
console.log('v148-v149 safeguards: '+checks.length+' checks passed');
