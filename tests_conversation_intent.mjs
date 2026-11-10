import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyConversationTurn,buildConversationEvidence} from './conversation_intent.mjs';

for(const [message,kind] of [
 ['Uită-te în conversația noastră, câte rețete de sarmale am cerut, și câte ai afișat tu?','reference'],
 ['Câte rețete de sarmale am cerut?', 'reference'],
 ['Ce mi-ai răspuns anterior?', 'reference'],
 ['Ai spus că sunt trei rețete, dar ai afișat una','correction'],
 ['Da, dar mi-ai spus că sunt 3 rețete și mi-ai arătat doar una','correction'],
 ['Am cerut trei rețete și tu mi-ai oferit doar una','correction'],
 ['What did I ask for earlier in our conversation?','reference'],
 ['You said three but you showed one','correction'],
 ['Dă-mi trei rețete de guacamole',null],
 ['Caută-mi 3 rețete de sarmale',null],
 ['Arată-mi mai multe rețete de sarmale',null],
 ['Unde este Aldi?',null],
 ['Rețete de guacamole',null],
 ['Câte rețete de sarmale există în România?',null],
 ['Explică istoria României',null]
]){
 assert.equal(classifyConversationTurn(message)?.kind||null,kind,message);
}
const history=[
 {role:'user',content:'Dă-mi 3 rețete de sarmale'},
 {role:'assistant',content:'Rețeta 1 — Sarmale de porc'},
 {role:'user',content:'Ce am cerut?'},
 {role:'assistant',content:'Ai cerut trei rețete'},
 {role:'user',content:'Uită-te în conversația noastră, câte rețete de sarmale am cerut?'}
];
const evidence=buildConversationEvidence(history,history.at(-1).content);
assert.equal(evidence.length,4);
assert.ok(evidence[0].content.includes('3 rețete'));
assert.ok(evidence[1].content.includes('Rețeta 1'));
assert.equal(evidence.some(x=>x.content===history.at(-1).content),false);
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const intent=backend.indexOf('const conversationTurn=classifyConversationTurn(message)');
const correction=backend.indexOf('const cookingCorrection=resolveRecipeFollowupComplaint(message,data.history)');
const recipes=backend.indexOf('const culinaryRequest=parseCulinaryRequest(message)');
assert.ok(intent>0&&intent<correction&&correction<recipes,'Intent gate must execute before keyword routing and searches');
assert.match(backend,/web_search_status:'not_needed',location_received:false/);
assert.match(backend,/max_tokens:550/);
assert.match(backend,/Nu oferi alte rețete, nu căuta pe web/);
console.log('Conversation intent and previous-message evidence routing OK');
