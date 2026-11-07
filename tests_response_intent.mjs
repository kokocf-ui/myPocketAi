import assert from "node:assert/strict";
import {classifyNewsRequest,requiresLiveNewsRetrieval} from "./response_intent.mjs";
import {requestedNewsSourceLanguage} from "./news_discovery.mjs";
const cases=[
 ["Ce evenimente geopolitice au avut loc în ultimele 24 de ore?","article_collection"],
 ["Ce evenimente importante s-au întâmplat ieri în lume?","article_collection"],
 ["Ce evenimente importante s-au întâmplat astăzi la nivel mondial?","article_collection"],
 ["What major events happened yesterday around the world?","article_collection"],
 ["Ce evenimente au avut loc ieri în România?","article_collection"],
 ["Care sunt evenimentele din Oradea în noiembrie?","none"],
 ["Ce concerte au fost ieri în lume?","none"],
 ["Ce evenimente importante s-au întâmplat în anul 2020 în lume?","none"],
 ["Știri geopolitice internaționale","article_collection"],
 ["Latest geopolitical news from the last 24 hours","article_collection"],
 ["Latest news about international diplomacy","article_collection"],
 ["Ce s-a întâmplat în ultimele 24 de ore?","article_collection"],
 ["Analizează conflictul din Orientul Mijlociu","analysis"],
 ["De ce s-a intensificat conflictul dintre aceste țări?","analysis"],
 ["Explain the impact of the war on energy markets","analysis"],
 ["Fă-mi un rezumat al ultimelor știri geopolitice","briefing"],
 ["Summarize today's news in a short briefing","briefing"],
 ["Fă-mi un briefing scurt despre cele mai importante evenimente internaționale de astăzi.","briefing"],
 ["Care sunt cauzele conflictului?","analysis"],
 ["Verifică dacă negocierile dintre Statele Unite și Iran sunt confirmate de surse independente.","analysis"],
 ["Verify the latest Iran claims against independent sources","analysis"],
 ["Cum se face ciorba de burtă?","none"],
 ["Salut!","none"],
 ["România","none"]
];
for(const [query,expected] of cases)assert.equal(classifyNewsRequest(query).mode,expected,query);
const arabicNewsRequest="Caută ultimele 5 știri despre Orientul Mijlociu din surse în limba arabă, inclusiv Al Jazeera Arabic și BBC Arabic. Tradu în română titlul și conținutul disponibil, respectând contextul, fără traduceri literale. Afișează data, sursa și linkul original.";
assert.equal(classifyNewsRequest(arabicNewsRequest).mode,"article_collection","Arabic search plus translate remains a news collection");
assert.equal(requiresLiveNewsRetrieval(arabicNewsRequest),true,"translation clause must not cancel live article retrieval");
assert.equal(requestedNewsSourceLanguage(arabicNewsRequest),"ar","Arabic articles use Arabic-source search rather than Romanian web language");
assert.equal(requestedNewsSourceLanguage("Caută știri din surse în limba persană, traduse în română"),"fa");
assert.equal(requiresLiveNewsRetrieval("Tradu această propoziție din arabă în română."),false,"standalone translation does not search the web");
console.log("PASS contextual intent: articles vs analysis vs explicit briefing and bilingual news search");
