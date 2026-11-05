// Run only on your own trusted device; never in GitHub Actions.
// Do not share Telegram API credentials, login codes or session strings.
import {createInterface} from "node:readline/promises";
import {stdin as input,stdout as output} from "node:process";
import {writeFile} from "node:fs/promises";
import {TelegramClient} from "teleproto";
import {StringSession} from "teleproto/sessions";
const apiId=Number(process.env.TELEGRAM_API_ID);
const apiHash=String(process.env.TELEGRAM_API_HASH||"");
if(!Number.isSafeInteger(apiId)||apiId<=0||!/^[a-f0-9]{32}$/i.test(apiHash)){
 process.stderr.write("Set TELEGRAM_API_ID and TELEGRAM_API_HASH in this device's environment first.\n");
 process.exit(2);
}
const rl=createInterface({input,output}),ask=question=>rl.question(question);
const client=new TelegramClient(new StringSession(""),apiId,apiHash,{
 connectionRetries:2,requestRetries:1,autoReconnect:false});
try{
 await client.start({
  phoneNumber:()=>ask("Telegram phone number, with country code: "),
  phoneCode:()=>ask("Telegram verification code (never send it to anyone): "),
  password:()=>ask("Telegram two-step verification password, if required: "),
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
 try{await client.disconnect()}catch{}
 rl.close();
}
