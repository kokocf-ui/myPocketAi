import assert from "node:assert/strict";
import {contextualResearchQuery} from "./conversation_context.mjs";
const h=(...t)=>t.map(content=>({role:"user",content}));
for(const [q,history,expected,contains] of [
 ["Salariul este brut sau net?",h("Care este salariul mediu în Dubai?"),true,"Dubai"],
 ["Este brut sau net?",h("Care este salariul mediu în Dubai?"),true,"Dubai"],
 ["Și în România?",h("Care este salariul mediu în Dubai?"),true,"salariul mediu"],
 ["Dar când?",h("Ce evenimente sunt în Oradea în noiembrie?"),true,"Oradea"],
 ["What about in France?",h("What is the average salary in London?"),true,"France"],
 ["Este brut sau net?",h("Cum va fi vremea în Londra?"),false,""],
 ["Dar cine a inventat telefonul?",h("Care este salariul mediu în Dubai?"),false,""],
 ["Este București capitala României?",h("Care este salariul mediu în Dubai?"),false,""],
 ["Unde este London Bridge?",h("Care este salariul mediu în Dubai?"),false,""],
 ["Nu, mă refeream la Abu Dhabi",h("Care este salariul mediu în Dubai?"),false,""],
 ["Ce evenimente au avut loc ieri în lume?",h("Care este salariul mediu în Dubai?"),false,""],
 ["Este brut sau net?",h("Care este salariul mediu în Dubai?","Este din 2025?","Cum s-a calculat?"),true,"Dubai"],
 ["Este brut sau net?",h("Care este salariul mediu în Dubai?","Salut!"),false,""],
 ["Este brut sau net?",h(),false,""]
]){
 const r=contextualResearchQuery(q,history);
 assert.equal(r.context_applied,expected,q+" "+JSON.stringify(r));
 if(contains)assert.ok(r.query.includes(contains),q+" missing "+contains);
}
const prior=[...h("Care este salariul mediu în Dubai?"),{role:"assistant",content:"Salariul este în România."},{role:"user",content:"Este brut sau net?"}];
assert.ok(contextualResearchQuery("Este brut sau net?",prior).query.includes("Dubai"));
console.log("PASS contextual research follow-ups");
