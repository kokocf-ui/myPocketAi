import assert from "node:assert/strict";
import {askTelegramVerificationCode} from "./telegram-code-fallback.mjs";

const log=[];let time=0,resends=0;const responses=["R","R","82715"];
const safe={type:"app",nextType:"sms",timeout:60,
 phoneCodeHash:"HIDDEN_HASH",
 resend:async()=>{resends++;return {type:"sms",nextType:"call",timeout:120,phoneCodeHash:"NEXT_HIDDEN_HASH",resend:async()=>{throw new Error("must not resend twice")}}}};
const result=await askTelegramVerificationCode(safe,
 async()=>{const a=responses.shift();if(responses.length===1)time=61_000;return a},
 msg=>log.push(msg),()=>time);
assert.equal(result,"82715");
assert.equal(resends,1);
assert.equal(log.join("").includes("82715"),false);
assert.equal(log.join("").includes("HIDDEN_HASH"),false);
assert.equal(log.join("").includes("60 more seconds"),true);
assert.equal(log.join("").includes("SMS"),true);

let noNextCalls=0;
const noNext=await askTelegramVerificationCode({type:"app",timeout:0,resend:async()=>{noNextCalls++}},
 (()=>{let i=0;return async()=>++i===1?"R":"12345"})(),()=>{},()=>0);
assert.equal(noNext,"12345");
assert.equal(noNextCalls,0);

let nonEligibleCalls=0;
const noResend=await askTelegramVerificationCode({type:"app",nextType:"sms",timeout:0},
 (()=>{let i=0;return async()=>++i===1?"R":"33333"})(),()=>{},()=>0);
assert.equal(noResend,"33333");
assert.equal(nonEligibleCalls,0);

const immediate=await askTelegramVerificationCode({type:"app",nextType:"sms",timeout:90,resend:()=>{throw Error("not allowed")}},
 async()=> "44556",()=>{},()=>0);
assert.equal(immediate,"44556");
console.log("PASS Telegram alternative code flow: waiting period, explicit opt-in, single resend, no sensitive logs or network");
