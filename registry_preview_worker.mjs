// Isolated, read-only registry test harness. NOT the production Eva frontend.
// Only place discovery requests are forwarded to the real feature-branch backend.
import worker from './backend.js';
export {PocketCommunicationHub} from './pocket_communication_hub.mjs';
const allowed=new Set(['restaurant','pharmacy','corner_shop','supermarket','parking','zoo','cafe','hotel','fast_food','park','museum']);
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'};
const html=`<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Eva — Registru TEST</title><style>body{font:16px system-ui;background:#0d1b28;color:#edf4ff;margin:0;padding:18px;max-width:650px}h1{font-size:21px}label{display:block;margin:16px 0 5px}input,select,button{box-sizing:border-box;width:100%;padding:13px;font:inherit;border-radius:11px;border:1px solid #6e839e}input,select{background:#142b3f;color:white}button{margin-top:15px;background:#813452;color:white;border:0;font-weight:bold}button:disabled{opacity:.45}.note{color:#c2cfe0;font-size:13px}.item{padding:12px 0;border-top:1px solid #425568}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px system-ui}</style>
<h1>Eva — Test registru geografic</h1><p class="note">Mediu separat. Nu este aplicația instalată și nu modifică producția. Numai căutări de locuri; fără cont sau date personale.</p>
<label for="cat">Ce căutăm?</label><select id="cat"><option value="restaurant">Restaurante</option><option value="pharmacy">Farmacii</option><option value="corner_shop">Băcănii</option><option value="supermarket">Supermarketuri</option><option value="parking">Parcări</option><option value="zoo">Zoo</option><option value="hotel">Hoteluri</option><option value="fast_food">Fast-food</option></select>
<label for="place">Localitate (opțional; gol = poziția dispozitivului)</label><input id="place" placeholder="De exemplu: Oradea, România">
<button id="search">Caută</button><div id="message" role="status"></div><div id="results"></div>
<script>
const $=id=>document.getElementById(id);
$('search').onclick=async()=>{
 $('search').disabled=true;$('results').replaceChildren();$('message').textContent='Caut...';
 try{
  const place=$('place').value.trim(),cat=$('cat').value;
  let location;
  if(!place){
   if(!navigator.geolocation)throw Error('Geolocalizarea nu este disponibilă. Introdu localitatea.');
   const p=await new Promise((ok,no)=>navigator.geolocation.getCurrentPosition(ok,no,{enableHighAccuracy:true,timeout:9000,maximumAge:0}));
   location={latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy,updatedAt:Date.now()};
  }
  const body={quick_place_search:true,place_category:cat,module:'travel',language:'ro',
   message:'Caută '+({restaurant:'restaurante',pharmacy:'farmacii',corner_shop:'băcănii',supermarket:'supermarketuri',parking:'parcări',zoo:'grădini zoologice',hotel:'hoteluri',fast_food:'fast-food-uri'}[cat]||cat)+(place?' în '+place:' în apropierea mea'),history:[],...(location?{location}:{}),
   ...(place?{location_query:place}: {})};
  const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  const data=await response.json();
  $('message').textContent=data.reply||data.error||'Nu a venit un răspuns.';
  if(Array.isArray(data.destination_candidates)&&data.destination_candidates.length){
   const title=document.createElement('p');title.textContent='Alege localitatea pentru a continua căutarea:';$('results').append(title);
   for(const candidate of data.destination_candidates){
    const b=document.createElement('button');b.textContent=candidate.label||candidate.query;
    b.onclick=async()=>{
     b.disabled=true;$('message').textContent='Continui cererea inițială...';$('results').replaceChildren();
     const follow={...body,message:candidate.query||candidate.label,history:[{role:'user',content:body.message}],place_context:data.place_context,location_query:''};
     const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(follow)});
     render(await r.json());
    };
    $('results').append(b);
   }
  }else render(data);
 }catch(e){$('message').textContent='Eroare: '+(e.message||e);}
 finally{$('search').disabled=false}
};
function render(data){
 $('message').textContent=data.reply||data.error||'Fără răspuns.';
 $('results').replaceChildren();
 const p=document.createElement('p');p.className='note';p.textContent='Țara verificată: '+(data.place_context?.country_routing?.country||'neconfirmată')+' · Surse: '+(data.source||'neprecizate');$('results').append(p);
 for(const place of (data.places||[])){
  const item=document.createElement('div');item.className='item';item.textContent=place.name+' — '+(place.address||place.formatted||'');$('results').append(item);
 }
}
</script></html>`;
export default {
 async fetch(request,env,ctx){
  const u=new URL(request.url);
  if(request.method==='GET'&&u.pathname==='/')
   return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
  if(request.method==='GET'&&u.pathname==='/health')
   return new Response(JSON.stringify({status:'preview',registry:true,geoapifyConfigured:Boolean(env.GEOAPIFY_API_KEY)}),{headers});
  if(request.method==='POST'&&u.pathname==='/api/chat'){
   const d=await request.clone().json().catch(()=>null);
   if(!d||!allowed.has(d.place_category)||d.quick_place_search!==true||
       !['travel','maps'].includes(d.module)||JSON.stringify(d).length>12000)
    return new Response(JSON.stringify({error:'preview_place_search_only'}),{status:400,headers});
   // Avoid letting this public preview serve arbitrary conversational AI calls.
   const clean={...d,language:'ro',quick_place_search:true,history:Array.isArray(d.history)?d.history.slice(-3):[]};
   return worker.fetch(new Request(request.url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(clean)}),env,ctx);
  }
  return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 }
};
