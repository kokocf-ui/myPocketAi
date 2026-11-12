const base='https://lifewise-ai-registry-preview.kokocf.workers.dev/api/chat';
const payload={message:'Caută restaurante în Grays, United Kingdom',quick_place_search:true,place_category:'restaurant',module:'travel',language:'ro',history:[],location_query:'Grays, United Kingdom'};
async function run(body){const response=await fetch(base,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const text=await response.text();let data;try{data=JSON.parse(text)}catch{data={raw:text.slice(0,350)}};return {status:response.status,data}}
const first=await run(payload);
console.log('FIRST',JSON.stringify({status:first.status,reply:first.data.reply?.slice(0,280),candidates:first.data.destination_candidates?.length,context:first.data.place_context,error:first.data.error}));
if(first.status!==200||!first.data.destination_candidates?.length)process.exit(1);
const candidate=first.data.destination_candidates.find(x=>x.label?.includes('Thurrock'))||first.data.destination_candidates[0];
const follow={...payload,message:candidate.query||candidate.label,history:[{role:'user',content:payload.message}],place_context:first.data.place_context,location_query:''};
const second=await run(follow);
console.log('FOLLOW',JSON.stringify({status:second.status,reply:second.data.reply?.slice(0,300),error:second.data.error,search_ok:second.data.search_ok,places:second.data.places?.length,context:second.data.place_context,location_source:second.data.location_source}));
if(second.status!==200||second.data.search_ok!==true||!Array.isArray(second.data.places))process.exit(2);
console.log('PASS Grays selection and resume');
