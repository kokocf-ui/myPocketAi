// Run only on your own trusted device; never in GitHub Actions.
// Do not share Telegram API credentials, login codes or session strings.
import {createInterface} from "node:readline/promises";
import {stdin as input,stdout as output} from "node:process";
import {Writable} from "node:stream";
import {writeFile} from "node:fs/promises";
import {TelegramClient} from "teleproto";
import {StringSession} from "teleproto/sessions";
// Portable prompt: readline writes typed characters to its output stream.
// Send all editing/echo output to a discard-only stream instead of relying
// on undocumented Node.js internals (unsupported on Termux Node 22/24).
const mutedOutput=new Writable({write(_chunk,_encoding,done){done();}});
const rl=createInterface({input,output:mutedOutput,terminal:true,historySize:0});
const askHidden=async(question)=>{
 if(!input.isTTY||!output.isTTY)
  throw new Error("A trusted interactive terminal is required for private login.");
 output.write(question);
 try{return await rl.question("");}
 finally{output.write("\n");}
};
// Validate only the shape, never print or persist the phone number.
const askPhone=async()=>{
 const candidate=(await askHidden("Telegram phone number (+country code, e.g. +44...): ")).replace(/[\s()-]/g,"");
 if(!/^\+[1-9]\d{7,14}$/.test(candidate)){
  process.stderr.write("Phone format invalid or empty. Use +countrycode followed by digits; do not share your number here.\n");
  throw new Error("PHONE_FORMAT_INVALID");
 }
 process.stdout.write("Phone format OK ("+candidate.length+" characters including +). The number was not displayed.\n");
 return candidate;
};
let lastSafeAuthError="";
const authErrorCode=error=>{
 // Only allow known Telegram error identifiers; do not print error.message,
 // phone, code, password, keys or complete error objects.
 const raw=[error?.errorMessage,error?.code,error?.name,error?.message,error?.constructor?.name].map(x=>String(x||"")).join(" ");
 if(/RECAPTCHA_CHECK|CAPTCHA/i.test(raw))return "TELEGRAM_RECAPTCHA_REQUIRED";
 if(/FLOOD_WAIT|FLOOD_PREMIUM_WAIT|TOO_MANY_REQUESTS/i.test(raw))return "TELEGRAM_RATE_LIMIT";
 if(/EMAIL|SET_UP_EMAIL/i.test(raw))return "TELEGRAM_EMAIL_VERIFICATION_REQUIRED";
 if(/TYPEERROR|IS NOT A FUNCTION|CANNOT READ PROPERTIES/i.test(raw))return "TELEGRAM_LOGIN_LIBRARY_ERROR";
 const matched=raw.match(/(?:PHONE_NUMBER_INVALID|PHONE_NUMBER_BANNED|PHONE_CODE_INVALID|PHONE_CODE_EXPIRED|PHONE_CODE_EMPTY|PHONE_PASSWORD_FLOOD|SESSION_PASSWORD_NEEDED|PASSWORD_HASH_INVALID|API_ID_INVALID|API_ID_PUBLISHED_FLOOD|FLOOD_WAIT|NETWORK_ERROR|ECONNABORTED|ETIMEDOUT|CONNECTION_NOT_INITED)/i);
 return matched?matched[0].toUpperCase():"UNCLASSIFIED_AUTH_ERROR";
};
let client;
try{
 // Ask locally instead of requiring shell exports that expose API secrets
 // to terminal history or user-shared screenshots. Existing env vars remain
 // supported for advanced users; neither secret is written to disk.
 const rawId=process.env.TELEGRAM_API_ID||await askHidden("Telegram API ID (from my.telegram.org): ");
 const rawHash=process.env.TELEGRAM_API_HASH||await askHidden("Telegram API Hash (from my.telegram.org): ");
 const apiId=Number(String(rawId).trim());
 const apiHash=String(rawHash||"").trim();
 if(!Number.isSafeInteger(apiId)||apiId<=0||!/^[a-f0-9]{32}$/i.test(apiHash))
  throw new Error("INVALID_API_CREDENTIAL_FORMAT");
 process.stdout.write("API ID and Hash format OK (values hidden).\n");
 client=new TelegramClient(new StringSession(""),apiId,apiHash,{
  connectionRetries:2,requestRetries:1,autoReconnect:false});
 await client.start({
  phoneNumber:()=>askPhone(),
  phoneCode:()=>askHidden("Telegram verification code (never send it to anyone): "),
  password:()=>askHidden("Telegram two-step verification password, if required: "),
  onError:error=>{lastSafeAuthError=authErrorCode(error);process.stderr.write("Telegram login error code: "+lastSafeAuthError+" (no credentials shown).\n");return true;}
 });
 if(!await client.isUserAuthorized())throw Error("Authorization did not complete");
 const session=client.session.save();
 if(!session||session.length<50)throw Error("No authorized Telegram session was created");
 await writeFile(".telegram-mtproto-session",session,{encoding:"utf8",mode:0o600,flag:"wx"});
 process.stdout.write("Authorized session written to .telegram-mtproto-session.\nCopy it ONLY to the TELEGRAM_SESSION Cloudflare secret, then securely delete the local copy. Never upload this file or share it in chat.\n");
}catch(error){
 const code=error?.message==="PHONE_FORMAT_INVALID"?"PHONE_FORMAT_INVALID":error?.message==="INVALID_API_CREDENTIAL_FORMAT"?"INVALID_API_CREDENTIAL_FORMAT":lastSafeAuthError||authErrorCode(error);
 process.stderr.write("Telegram sign-in incomplete ["+code+"]. No session has been uploaded.\n");
 process.exitCode=1;
}finally{
 if(client)try{await client.disconnect()}catch{}
 rl.close();
}
