// Map the documented Telegram auth.sentCode.type constructor to a fixed,
// non-sensitive label. NEVER dump raw API responses: they contain phoneCodeHash.
const labels={
 SentCodeTypeApp:"Telegram app on another signed-in session",
 SentCodeTypeSms:"SMS",
 SentCodeTypeCall:"automated phone call",
 SentCodeTypeFlashCall:"flash phone call",
 SentCodeTypeMissedCall:"missed phone call",
 SentCodeTypeEmailCode:"configured login email",
 SentCodeTypeSetUpEmailRequired:"email setup required",
 SentCodeTypeFragmentSms:"Fragment",
 SentCodeTypeFirebaseSms:"official app Firebase SMS authentication",
 SentCodeTypeSmsWord:"SMS containing a code word",
 SentCodeTypeSmsPhrase:"SMS containing a code phrase"
};
export function telegramCodeDelivery(response){
 const kind=response?.type?.className || response?.type?.constructor?.name || "";
 const normalized=String(kind).replace(/^auth\./,"");
 return Object.hasOwn(labels,normalized)?labels[normalized]:"unidentified method";
}
