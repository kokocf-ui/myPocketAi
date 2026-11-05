import assert from "node:assert/strict";
import {telegramCodeDelivery} from "./telegram-code-delivery.mjs";
const cases={
 SentCodeTypeApp:"Telegram app on another signed-in session",
 SentCodeTypeSms:"SMS",
 SentCodeTypeEmailCode:"configured login email",
 SentCodeTypeSetUpEmailRequired:"email setup required",
 SentCodeTypeCall:"automated phone call",
 SentCodeTypeFirebaseSms:"official app Firebase SMS authentication",
 SentCodeTypeFragmentSms:"Fragment",
};
for(const [type,expected] of Object.entries(cases)){
 assert.equal(telegramCodeDelivery({type:{className:"auth."+type},phoneCodeHash:"SENSITIVE"}),expected);
 assert.equal(telegramCodeDelivery({type:{constructor:{name:type}},phoneCodeHash:"SENSITIVE"}),expected);
}
assert.equal(telegramCodeDelivery({type:{className:"SENSITIVE_SECRET"},phoneCodeHash:"SENSITIVE"}),"unidentified method");
assert.equal(telegramCodeDelivery(null),"unidentified method");
console.log("PASS Telegram code delivery labels without exposing verification secrets");
