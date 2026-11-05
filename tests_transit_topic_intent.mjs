import assert from "node:assert/strict";
import {isTransitJourneyRequest, correctedResearchTopic} from "./transit_intent.mjs";
const cases=[["Nu, eu mă refeream la transportul public din Londra.",{},false],["Spune-mi despre transportul public din Londra.",{},false],["Cum funcționează metroul în Londra?",{},false],["Ce tipuri de transport public există în Londra?",{},false],["Transportul public din Londra",{},false],["Transport public",{},false],["Transport public",{"pendingRouteProfile":true},true],["Transport public",{"history":[{"role":"user","content":"Cum ajung la Victoria Station?"}]},true],["Cu trenul",{"pendingRouteProfile":true},true],["Vreau să ajung la London Victoria cu transport public.",{},true],["Cum ajung cu trenul la London Liverpool Street?",{},true],["Transport public până la Victoria Station",{},true],["Transport public spre London Bridge",{},true],["Planifică un traseu cu autobuzul spre Victoria",{},true],["What is public transport in London?",{},false],["Tell me about the London Underground.",{},false],["How do I get to Victoria Station by tube?",{},true],["Mă refeream la traseul cu transport public până la Victoria.",{},true],["Cât costă un bilet de metrou în Londra?",{},false],["Ce variante de transport public am până la Victoria?",{},true],["What transport options to London Victoria?",{},true]];
for(const [query,options,expected] of cases){
 const actual=isTransitJourneyRequest(query,options);
 assert.equal(actual.is_journey,expected,query+" "+JSON.stringify(actual));
}
assert.equal(correctedResearchTopic("Nu, eu mă refeream la transportul public din Londra."),"transportul public din Londra");
assert.equal(correctedResearchTopic("I meant public transport in London."),"public transport in London");
assert.equal(correctedResearchTopic("Cum ajung la London Victoria?"),null);
console.log("PASS transport explanation vs journey: "+cases.length+" cases");
