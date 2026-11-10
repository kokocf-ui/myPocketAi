import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isRecipeHistoryQuestion,summarizePriorRecipeRequests} from './recipe_history_recall.mjs';
import {classifyConversationTurn} from './conversation_intent.mjs';
const messages=[
 {role:'user',content:'Arată mai multe rețete cu piept de pui'},
 {role:'assistant',content:'Rețeta 1 — Piept de pui cu legume'},
 {role:'user',content:'De ce îmi arăți o rețetă cu piept de rață?'},
 {role:'assistant',content:'Am greșit, cererea era despre pui.'},
 {role:'user',content:'Dă-mi 4 rețete de guacamole'},
 {role:'assistant',content:'Rețeta 1 — Guacamole clasic'},
 {role:'user',content:'Vroiam să te întreb ce rețete culinare am cerut azi?'}
];
assert.ok(isRecipeHistoryQuestion(messages.at(-1).content));
const reply=summarizePriorRecipeRequests(messages,messages.at(-1).content);
assert.match(reply,/piept pui/);
assert.match(reply,/guacamole/);
assert.match(reply,/4 cerute/);
assert.doesNotMatch(reply,/piept rata/);
assert.match(reply,/istoricul disponibil/);
assert.equal(summarizePriorRecipeRequests([],messages.at(-1).content)
 .includes('nu găsesc o cerere culinară'),true);
assert.equal(summarizePriorRecipeRequests(messages,'Arată 3 rețete de sarmale'),null);
for(const social of ['La revedere!','Pa','Noapte bună','Salut']){
 assert.equal(classifyConversationTurn(social)?.kind,'social',social);
}
assert.equal(classifyConversationTurn('La revedere, dar explică istoria'),null);
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const summarizer=backend.indexOf('const recipeHistorySummary=summarizePriorRecipeRequests(');
const narrow=backend.indexOf('const recipeRecall=resolveRecipeRequestRecall(');
const dialogue=backend.indexOf('const conversationTurn=classifyConversationTurn(');
assert.ok(summarizer>0&&summarizer<narrow&&narrow<dialogue);
assert.match(backend,/conversationTurn\.kind==='social'\?\[\]:buildConversationEvidence/);
assert.match(backend,/\.slice\(-20\)\s*\/\/ Do not carry a previous reverse-geocoding answer/);
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(frontend,/historyLimit:20/);
console.log('Conversation history recall and social-turn isolation checks passed');
