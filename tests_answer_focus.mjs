import assert from "node:assert/strict";
import {planAnswerFocus} from "./answer_focus.mjs";
const plan=(q,opts={})=>planAnswerFocus(q,opts);
assert.equal(plan("Care este salariul mediu în Dubai?").mode,"focused_fact");
assert.equal(plan("Care este salariul mediu în Dubai?").max_tokens,340);
assert.equal(plan("Salariul acesta este brut sau net?",{contextApplied:true}).mode,"focused_followup");
assert.equal(plan("Dar în Dubai, cât ar veni net?",{contextApplied:true}).max_tokens,220);
assert.equal(plan("Și în România cât este?",{contextApplied:true}).mode,"focused_followup");
assert.equal(plan("Nu ai înțeles întrebarea.",{dialogueOnly:true}).mode,"light_conversation");
for(const q of ["Explică pe larg diferențele dintre salariul brut și cel net.","Analizează conflictul geopolitic.","Care sunt ultimele știri internaționale?","Ce medicamente pot lua?","Vreau o listă completă de cheltuieli."]){
 assert.equal(plan(q,{contextApplied:true}).mode,"standard",q);
}
assert.equal(plan("Care este salariul mediu în Dubai?",{recipeInstruction:true}).mode,"standard");
assert.equal(plan("Care sunt evenimentele din Oradea?",{eventResearchIntent:true}).mode,"standard");
assert.equal(plan("Care este salariul mediu în Dubai? Dar explică și cum se calculează salariul median.",{contextApplied:true}).mode,"standard");
console.log("PASS adaptive answer focus: directness, followups, and detailed-answer exemptions");
