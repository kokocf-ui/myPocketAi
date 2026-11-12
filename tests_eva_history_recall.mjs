import assert from 'node:assert/strict';
import {historyRecallIntent,recallFromSuppliedHistory} from './eva_history_recall.mjs';

assert.equal(historyRecallIntent('Eva, caută în conversațiile noastre transportul Oradea Cluj'),true);
assert.equal(historyRecallIntent('Caută-mi trenuri între Oradea și Cluj'),false);
assert.equal(historyRecallIntent('Spune-mi istoria României'),false);
assert.equal(historyRecallIntent('Ce am discutat despre hotelul din Manchester?'),true);
const history=[
 {role:'user',content:'Am analizat transportul dintre Oradea și Cluj, inclusiv autocare și trenuri.'},
 {role:'assistant',content:'Am menționat variante, dar prețurile trebuie reverificate.'},
 {role:'user',content:'Am căutat hoteluri în Manchester.'}
];
let r=recallFromSuppliedHistory('Eva, caută în conversațiile noastre ce am discutat despre Oradea și Cluj',history);
assert.equal(r.found,true);
assert.equal(r.scope,'supplied_history_only');
assert.match(r.reply,/Oradea/);
assert.doesNotMatch(r.reply,/Am căutat hoteluri/);
assert.equal(r.matches[0].role,'user');
assert.equal(recallFromSuppliedHistory('Caută-mi trenuri între Oradea și Cluj',history),null);
r=recallFromSuppliedHistory('Ce am discutat despre Bratislava?',history);
assert.equal(r.found,false);
r=recallFromSuppliedHistory('Caută în istoric ceva',[]);
assert.equal(r.found,false);
assert.equal(r.reason,'no_supplied_history');
assert.match(recallFromSuppliedHistory('Search our chat history for Oradea',history,{language:'en'}).reply,/available to me/);
console.log('PASS scoped Eva history recall handles matching, uncertainty and ordinary searches');
