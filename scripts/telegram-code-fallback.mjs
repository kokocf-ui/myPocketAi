// Explicit user-controlled fallback within an EXISTING Telegram auth.sendCode
// session. Requires server-provided nextType and timeout; never guesses SMS.
// Secrets (phone, phoneCodeHash, login codes) are never logged.
const types=Object.freeze({
  sms:"SMS",call:"phone call",flashCall:"flash call",
  missedCall:"missed call",fragment:"Fragment"
});
function alternative(info){
  const type=String(info?.nextType||"");
  return typeof info?.resend==="function" && Object.hasOwn(types,type)
    ?types[type] : null;
}
export async function askTelegramVerificationCode(info,askHidden,write,now=()=>Date.now()){
  let current=info;
  let started=now();
  let attemptedAlternative=false;
  for(;;){
    const next=attemptedAlternative?null:alternative(current);
    const timeout=Number.isFinite(Number(current?.timeout))
       ?Math.max(0,Math.min(3600,Math.ceil(Number(current.timeout)))):0;
    const remaining=next?Math.max(0,timeout-Math.floor((now()-started)/1000)):0;
    if(next){
      write("Telegram may offer an alternative via "+next+
       " after its waiting period. Type R only if you did not receive a code; this requests ONE alternative code.\n");
    } else {
      write("Telegram has not offered another code-delivery method for this login.\n");
    }
    const input=String(await askHidden("Verification code (or R to request the offered alternative): ")).trim();
    if(input.toUpperCase()!=="R"){
      if(!input){write("Empty code; no login request sent.\n");continue;}
      return input;
    }
    if(!next){
      write("No alternative method available from Telegram. No request sent.\n");
      continue;
    }
    const remainingNow=Math.max(0,timeout-Math.floor((now()-started)/1000));
    if(remainingNow>0){
      write("Telegram requires waiting at least "+remainingNow+
       " more seconds before trying the alternative. No request sent.\n");
      continue;
    }
    attemptedAlternative=true;
    // The library reuses the phone_code_hash from this authorization flow
    // and updates it when Telegram returns another auth.SentCode.
    current=await current.resend();
    started=now();
    const delivered=String(current?.type||"");
    write("Telegram alternative requested; new delivery method: "+
      (Object.hasOwn(types,delivered)?types[delivered]:
       delivered==="app"?"Telegram app":"server-defined")+
      ". Check that channel for the NEW code.\n");
  }
}
