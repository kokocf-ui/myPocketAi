import assert from "node:assert/strict";
import fs from "node:fs";
import {handleMathVisionPilot} from "./math_photo_vision.mjs";

const secret="z".repeat(40);
let calls=0,modelName="",modelInput;
const env={POCKET_MATH_PILOT_TOKEN:secret,POCKET_MATH_VISION_ENABLED:"1",
 AI:{async run(model,input){calls++;modelName=model;modelInput=input;return {answer:"1. a) √5 + x^2\n2. b) -1/(2x)"}}}};
const json=(data,status=200)=>Response.json(data,{status});
const image="data:image/png;base64,"+Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(410,0)]).toString("base64");
const invoke=async({requestImage=image,token=secret,method="POST",targetEnv=env,type="application/json"}={})=>{
 const r=new Request("https://unit.test/api/math-vision",{method,headers:{"Authorization":"Bearer "+token,"Content-Type":type},...method==="POST"?{body:JSON.stringify({image:requestImage})}:{}});
 const response=await handleMathVisionPilot(r,targetEnv,json);
 return {status:response.status,body:await response.json()};
};
assert.equal((await invoke({targetEnv:{AI:env.AI}})).status,503,"pilot off by default");
assert.equal((await invoke({targetEnv:{...env,POCKET_MATH_VISION_ENABLED:"0"}})).status,503);
assert.equal((await invoke({token:"wrong"})).status,401);
assert.equal((await invoke({requestImage:"data:image/jpeg;base64,"+"a".repeat(600)})).status,415);
assert.equal((await invoke({requestImage:"something invalid"})).status,400);
assert.equal((await invoke({method:"GET"})).status,405);
assert.equal((await invoke({type:"text/plain"})).status,415);
const value=await invoke();
assert.equal(value.status,200);
assert.equal(value.body.verified,false);
assert.match(value.body.transcript,/√5/);
assert.equal(modelName,"@cf/moondream/moondream3.1-9B-A2B");
assert.equal(modelInput.stream,false);
assert.equal(modelInput.reasoning,false);
assert.equal(modelInput.task,"query");
assert.equal(calls,1,"only one valid request calls vision inference");
assert.match(fs.readFileSync("backend.js","utf8"),/handleMathVisionPilot\(request,env,json\)/);
console.log("PASS opt-in mathematics image OCR backend gate and shape");
