// Owner-only, consent-based Math photograph vision pilot.
// Never call this endpoint automatically after an on-device ML Kit scan.
export async function handleMathVisionPilot(request,env,json){
 const reply=(value,status=200)=>json(value,status);
 if(request.method!=="POST")return reply({error:"method_not_allowed"},405);
 const secret=String(env.POCKET_MATH_PILOT_TOKEN||"");
 if(env.POCKET_MATH_VISION_ENABLED!=="1"||secret.length<32||!env.AI||typeof env.AI.run!=="function")
  return reply({status:"unavailable",error:"math_vision_not_configured"},503);
 const given=String(request.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"");
 const digest=async value=>new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));
 const [expected,received]=await Promise.all([digest(secret),digest(given)]);
 let difference=0;for(let i=0;i<expected.length;i++)difference|=expected[i]^received[i];
 if(!given||difference!==0)return reply({error:"unauthorized"},401);
 if(Number(request.headers.get("Content-Length")||0)>1650000)return reply({error:"image_too_large"},413);
 if(!String(request.headers.get("Content-Type")||"").toLowerCase().startsWith("application/json"))
  return reply({error:"expected_json"},415);
 const body=await request.text().catch(()=>"");
 if(body.length>1650000)return reply({error:"image_too_large"},413);
 let payload;try{payload=JSON.parse(body)}catch{return reply({error:"invalid_json"},400)}
 const image=payload?.image;
 if(typeof image!=="string"||image.length>1450000)return reply({error:"invalid_image"},400);
 const match=/^data:image\/(jpeg|png);base64,([a-zA-Z0-9+/]+={0,2})$/.exec(image);
 if(!match||match[2].length<160||match[2].length>1350000)return reply({error:"invalid_image"},400);
 const estimate=Math.floor(match[2].length*3/4);
 if(estimate>1000000)return reply({error:"image_too_large"},413);
 let signature;try{signature=atob(match[2].slice(0,32))}catch{return reply({error:"invalid_image"},400)}
 const jpeg=signature.charCodeAt(0)===255&&signature.charCodeAt(1)===216&&signature.charCodeAt(2)===255;
 const png=signature.slice(0,8)==="\x89PNG\r\n\x1a\n";
 if((match[1]==="jpeg"&&!jpeg)||(match[1]==="png"&&!png))return reply({error:"invalid_image_magic"},415);
 try{
  const result=await env.AI.run("@cf/moondream/moondream3.1-9B-A2B",{
   task:"query",image,
   question:"Transcribe the mathematics printed in this photograph, not the worked solutions. Include EVERY visible problem and subproblem in reading order without guessing missing characters. Format each exercise number on its own line as Exercițiul 1, Exercițiul 2, etc. Format each subproblem on its own line as a) expression, b) expression. Never merge different subproblems. Copy the mathematics exactly: square root as √, exponents as ^2 or ^3, negatives as -, parentheses and fractions as (numerator)/(denominator). If a glyph is unclear, write [?], not an invented digit or symbol. Do not solve, simplify, explain, or add Markdown code fences. Return only the transcription.",
   reasoning:false,stream:false,temperature:0,max_tokens:2300
  });
  const transcript=String(result?.answer||"").trim().slice(0,8000);
  if(!transcript)return reply({status:"unavailable",error:"math_vision_no_transcription"},502);
  return reply({status:"success",transcript,model:"moondream3.1",verified:false});
 }catch{
  // No image, credential, or model output must enter logs.
  return reply({status:"unavailable",error:"math_vision_inference_failed"},503);
 }
}
