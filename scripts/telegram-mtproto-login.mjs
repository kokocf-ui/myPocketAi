// Run only on your own trusted device; never in GitHub Actions.
// Do not share Telegram API credentials, login codes or session strings.
import {createInterface} from "node:readline/promises";
import {stdin as input,stdout as output} from "node:process";
import {writeFile} from "node:fs/promises";
import {TelegramClient} from "teleproto";
import {StringSession} from "teleproto/sessions";
// readline normally echoes input, including Telegram verification codes and 2FA.
// Suppress terminal echo through its output hook; never log the collected value.
const rl=createInterface({input,output});
const askHidden=async(question)=>{
 if(!input.isTTY||!output.isTTY||typeof rl._writeToOutput!=="function")
  throw new Error("A trusted interactive terminal is required for private login.");
 const original=rl._writeToOutput;
 output.write(question);
 rl._writeToOutput=()=>{};
 try{return await rl.question("");}
 finally{rl._writeToOutput=original;output.write("\n");}
};
let client;
try{
 // Ask locally instead of requiring shell exports that expose API secrets
 // to terminal history or user-shared screenshots. Existing env vars remain
 // supported for advanced users; neither secret is written to disk.
 const rawId=process.env.TELEGRAM_API_ID||await askHidden("Telegram API ID (from my.telegram.org): ");
 const rawHash=process.env.TELEGRAM_API_HASH||await askHidden("Telegram API Hash (from my.telegram.org): ");
 const apiId=Number(rawId);
 const apiHash=String(rawHash||"").trim();
 if(!Number.isSafeInteger(apiId)||apiId<=0||!/^[a-f0-9]{32}$/i.test(apiHash))
  throw new Error("Invalid API ID/hash format.");
 client=new TelegramClient(new StringSession(""),apiId,apiHash,{
  connectionRetries:2,requestRetries:1,autoReconnect:false});
 await client.start({
  phoneNumber:()=>askHidden("Telegram phone number, with country code: "),
  phoneCode:()=>askHidden("Telegram verification code (never send it to anyone): "),
  password:()=>askHidden("Telegram two-step verification password, if required: "),
  onError:error=>process.stderr.write("Login step failed. Verify credentials and try again.\n")
 });
 if(!await client.isUserAuthorized())throw Error("Authorization did not complete");
 const session=client.session.save();
 if(!session||session.length<50)throw Error("No authorized Telegram session was created");
 await writeFile(".telegram-mtproto-session",session,{encoding:"utf8",mode:0o600,flag:"wx"});
 process.stdout.write("Authorized session written to .telegram-mtproto-session.\nCopy it ONLY to the TELEGRAM_SESSION Cloudflare secret, then securely delete the local copy. Never upload this file or share it in chat.\n");
}catch(error){
 process.stderr.write("Telegram sign-in incomplete. No session has been uploaded.\n");
 process.exitCode=1;
}finally{
 if(client)try{await client.disconnect()}catch{}
 rl.close();
}
