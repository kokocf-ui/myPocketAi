// Text-to-image endpoint for Eva. The Cloudflare Workers AI binding is already configured.
// No image or prompt is stored by this module. One request = one generated image.
export const POCKET_IMAGE_STYLES=Object.freeze({
 realistic:"photorealistic professional photography, natural details",
 cinematic:"cinematic film still, dramatic visual storytelling",
 digital:"polished digital painting and concept illustration",
 oil:"traditional oil painting on textured canvas",
 watercolor:"delicate watercolor painting on paper",
 acrylic:"expressive acrylic painting",
 pencil:"detailed graphite pencil sketch",
 ink:"black ink illustration with fine linework",
 charcoal:"hand-drawn charcoal artwork",
 anime:"Japanese anime illustration",
 cartoon:"colorful friendly cartoon illustration",
 comic:"graphic novel comic-book art",
 "3d":"high quality three-dimensional render",
 clay:"handcrafted claymation miniature",
 pixel:"crisp pixel art with deliberately visible pixels",
 retro:"retro 1970s and 1980s visual aesthetic",
 vintage:"vintage print and poster art",
 fantasy:"detailed fantasy illustration",
 scifi:"science fiction concept art",
 surreal:"surrealist dreamlike art",
 impressionist:"impressionist brushwork and light",
 minimal:"minimalist modern graphic design",
 isometric:"clean isometric illustration",
 lowpoly:"stylized low-polygon 3D rendering",
 architecture:"professional architectural visualization",
 product:"premium commercial product photography"
});
const MOODS={neutral:"natural balanced mood",warm:"warm welcoming atmosphere",dramatic:"dramatic expressive atmosphere",calm:"calm gentle atmosphere",playful:"cheerful playful atmosphere",mysterious:"mysterious moody atmosphere",epic:"epic majestic atmosphere"};
const LIGHTS={auto:"balanced professional lighting",daylight:"soft natural daylight",golden:"warm golden hour light",studio:"controlled studio softbox lighting",night:"atmospheric night lighting",neon:"vibrant neon lighting",soft:"soft diffused lighting",contrast:"high-contrast cinematic lighting"};
const SHOTS={auto:"clear balanced composition",portrait:"close-up portrait composition",wide:"wide establishing shot",macro:"macro detailed composition",overhead:"overhead top-down composition",isometric:"isometric viewpoint",center:"centered clean composition"};
const PALETTES={auto:"harmonious color palette",vivid:"rich vivid saturated colors",pastel:"gentle pastel colors",earth:"natural earthy colors",mono:"black and white monochrome",cool:"cool blue and teal tones",warm:"warm orange and amber tones"};
const ASPECTS={"1:1":"square composition","4:3":"landscape four-to-three composition","16:9":"wide cinematic sixteen-to-nine composition","3:4":"portrait three-to-four composition","9:16":"tall vertical nine-to-sixteen composition"};
function choice(dict,key,fallback){return Object.hasOwn(dict,key)?dict[key]:dict[fallback]}
export function composePocketImagePrompt(body){
 const subject=String(body?.prompt||"").trim().slice(0,750);
 if(subject.length<3)throw new Error("image_prompt_required");
 const style=String(body?.style||"realistic");
 const aspect=String(body?.aspect||"1:1");
 const pieces=[
  "Create a single original high quality image, with no surrounding UI or frame.",
  "Subject: "+subject,
  "Visual style: "+choice(POCKET_IMAGE_STYLES,style,"realistic")+".",
  "Atmosphere: "+choice(MOODS,String(body?.mood||"neutral"),"neutral")+".",
  "Lighting: "+choice(LIGHTS,String(body?.lighting||"auto"),"auto")+".",
  "Framing: "+choice(SHOTS,String(body?.composition||"auto"),"auto")+".",
  "Color: "+choice(PALETTES,String(body?.palette||"auto"),"auto")+".",
  "Layout: "+choice(ASPECTS,aspect,"1:1")+", keep the main subject inside the central safe area for cropping."
 ];
 const avoid=String(body?.avoid||"").trim().slice(0,180);
 if(avoid)pieces.push("Avoid these visual elements: "+avoid+".");
 return pieces.join(" ").slice(0,2048);
}
export async function handlePocketImageRequest(request,env,json){
 if(request.method!=="POST")return json({status:"error",error:"method_not_allowed"},405);
 if(Number(request.headers.get("content-length")||0)>12000)return json({status:"error",error:"payload_too_large"},413);
 if(!env?.AI||typeof env.AI.run!=="function")return json({status:"error",error:"image_provider_unavailable"},503);
 let body;try{body=await request.json()}catch{return json({status:"error",error:"invalid_json"},400)}
 if(typeof body?.prompt!=="string"||body.prompt.trim().length<3||body.prompt.length>750||
    String(body?.avoid||"").length>180)return json({status:"error",error:"invalid_image_prompt"},400);
 let prompt;try{prompt=composePocketImagePrompt(body)}catch{return json({status:"error",error:"invalid_image_prompt"},400)}
 const steps=body.quality==="detailed"?8:4;
 const supplied=Number(body.seed);
 const seed=body.seed!==""&&body.seed!==null&&body.seed!==undefined&&
  Number.isSafeInteger(supplied)&&supplied>=0&&supplied<=2147483647
   ?supplied:Math.floor(Math.random()*2147483647);
 try{
  const result=await env.AI.run("@cf/black-forest-labs/flux-1-schnell",{prompt,steps,seed});
  if(typeof result?.image!=="string"||!result.image.length||result.image.length>12000000||
     !/^[A-Za-z0-9+/=\r\n]+$/.test(result.image))
    return json({status:"error",error:"invalid_image_response"},502);
  return json({status:"success",image:result.image,mime_type:"image/jpeg",seed,format:"square_native",model:"flux-1-schnell"});
 }catch(error){
  const message=String(error?.message||"");
  const quota=/4006|quota|neuron|allocation|rate.limit/i.test(message);
  return json({status:"error",error:quota?"image_quota_exceeded":"image_generation_failed"},quota?429:503);
 }
}
