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
