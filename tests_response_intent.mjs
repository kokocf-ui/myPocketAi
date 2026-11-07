import assert from "node:assert/strict";
import {classifyNewsRequest,requiresLiveNewsRetrieval} from "./response_intent.mjs";
import {requestedNewsSourceLanguage,requestedNewsSourceLanguages,requestedNewsArticleLimit,newsFreshnessHours,isNewsComparisonRequest,newsSearchTopic,newsSearchQuery,cleanNewsExcerpt,looksLikeNewsArticle} from "./news_discovery.mjs";
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
const multilingualCases=[
 {name:"T1 Arabic",query:"Caută ultimele 5 știri despre Orientul Mijlociu din surse în limba arabă, inclusiv Al Jazeera Arabic și BBC Arabic. Tradu în română titlul și conținutul disponibil, respectând contextul, fără traduceri literale. Afișează data, sursa și linkul original.",count:5,languages:["ar"]},
 {name:"T2 Farsi",query:"Caută ultimele 5 știri despre Iran publicate în limba persană. Tradu informațiile în română naturală, păstrând numele, cifrele și contextul politic. Precizează sursa și data publicării.",count:5,languages:["fa"]},
 {name:"T3 Ukraine",query:"Caută cele mai recente știri despre Ucraina din surse în limba ucraineană și rusă. Tradu în română și separă informațiile confirmate de afirmațiile neverificate. Arată sursa și data fiecărui articol.",count:30,languages:["uk","ru"]},
 {name:"T4 French/German",query:"Prezintă 6 știri recente importante din Franța și Germania, provenite din publicații în limbile franceză și germană. Tradu titlurile și informațiile disponibile într-o română fluentă, cu dată și sursă.",count:6,languages:["fr","de"]},
 {name:"T5 English",query:"Caută 5 știri internaționale recente din surse în engleză, inclusiv Reuters și BBC, dacă sunt disponibile. Prezintă-le în română, cu titlu, descriere, sursă și dată. La deschiderea unei știri, afișează conținutul disponibil fără a inventa pasaje lipsă.",count:5,languages:["en"]},
 {name:"T6 Comparison",query:"Caută relatări recente despre același eveniment internațional în surse arabe, engleze și franceze. Compară informațiile, identifică ce este confirmat și ce diferă între relatări, apoi prezintă o sinteză clară în română cu sursele originale.",count:30,languages:["ar","en","fr"]}
];
for(const c of multilingualCases){
 assert.equal(requiresLiveNewsRetrieval(c.query),true,c.name+": must search live, not return unsourced model narration");
 assert.deepEqual(requestedNewsSourceLanguages(c.query),c.languages,c.name+": must detect all requested source languages in order");
 assert.equal(requestedNewsArticleLimit(c.query),c.count,c.name+": respect requested article count");
 assert.equal(newsFreshnessHours(c.query),168,c.name+": recent means verified date within one week");
 for(const language of c.languages)assert.ok(newsSearchQuery(c.query,language).length>=10);
}
assert.equal(isNewsComparisonRequest(multilingualCases[5].query),true);
assert.equal(isNewsComparisonRequest(multilingualCases[0].query),false);
assert.equal(looksLikeNewsArticle("Who we are - BBC","https://www.bbc.com/about"),false);
assert.equal(looksLikeNewsArticle("Nu există nicio informație disponibilă despre un articol", "https://example.org/old-story"),false);
assert.equal(looksLikeNewsArticle("Factual report from government ministry", "https://example.org/world/report"),true);
assert.equal(cleanNewsExcerpt("Propoziția unu. Propoziția doi, care este foarte lungă și nu se încheie",35),"Propoziția unu.");
console.log("PASS all six real-device news requests: routing, language groups, counts, recency and source filters");

console.log("PASS contextual intent: articles vs analysis vs explicit briefing and bilingual news search");
