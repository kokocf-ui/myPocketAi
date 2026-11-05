import assert from "node:assert/strict";
import {classifyDialogueIntent,blocksImplicitPlaceLookup,isStableCapitalQuestion} from "./dialogue_intent.mjs";
const cases=[["Sunt bine","social_checkin",null],["Bine, mulțumesc","social_checkin",null],["Foarte bine, mersi!","social_checkin",null],["Nu sunt bine","social_checkin",null],["I am fine, thanks.","social_checkin",null],["Bine, caută restaurante în Grays","none",null],["Sunt Farm","none",null],["Unde este Sunt Farm?","none",null],["Parcă astăzi ești cam serioasă!","social_feedback",null],["Glumeam, voiam doar să văd dacă ai simțul umorului. 😄","social_feedback",null],["Ești tare amuzantă!","social_feedback",null],["Răspunde într-o singură propoziție.","reformat_previous",1],["Răspunde în două propoziții.","reformat_previous",2],["Please answer in one sentence.","reformat_previous",1],["Explică-mi în două propoziții diferența dintre salariul brut și cel net.","explanation",2],["Explain the difference between gross and net salaries in two sentences.","explanation",2],["Alba","none",null],["Aldi","none",null],["Decathlon Lakeside","none",null],["Decathlon, Lakeside","none",null],["Vreau să ajung la London Victoria.","none",null],["Unde este supermarketul Aldi?","none",null],["Caută un restaurant din Grays.","none",null],["Cum ajung la Victoria Station cu trenul?","none",null],["Care este capitala Franței?","none",null],["Spune-mi despre Londra.","none",null],["Testează vocea, apoi schimbă limba aplicației în engleză.","app_control",null],["Închide complet aplicația și redeschide-o.","app_control",null],["Schimbă limba aplicației în engleză.","app_control",null],["Cum schimb limba aplicației?","app_control",null],["Test voice, then change app language.","app_control",null],["Alba, Tulcea","none",null],["Vreau să ajung la West Dulwich din Grays.","none",null],["Vreau să merg în Beiuș, județul Bihor.","none",null]];
for(const [text,kind,count] of cases){
 const actual=classifyDialogueIntent(text);
 assert.equal(actual.kind,kind,text);
 assert.equal(actual.sentence_count,count,text);
 assert.equal(blocksImplicitPlaceLookup(text),kind!=="none",text);
}
assert.equal(isStableCapitalQuestion("Care este capitala Franței?"),true);
assert.equal(isStableCapitalQuestion("Care este capitala Franței în 2026?"),false);
console.log("PASS dialogue and geocoding guard for "+cases.length+" cases");
