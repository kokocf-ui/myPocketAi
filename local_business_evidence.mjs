// Verified on-demand research for a named local business. No hidden GPS use.
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const tokens=x=>norm(x).split(' ').filter(Boolean);
export function isStreetOnlyPlace(name,street=''){
 const n=norm(name),s=norm(street);
 if(!n||(s&&s===n))return true;
 return /^(?:strada|str|street|st|road|rd|bulevardul|bulevard|bd|calea|drumul|rue|avenue|via|viale|calle|rua|ulica|ulitsa)\s+[a-z0-9]/i.test(n)
  && !/(?:hotel|shop|store|supermarket|magazin|farmacie|market|cafe|restaurant|boutique|books)/.test(n);
}
export function parseNamedBusinessInformation(text){
 const query=String(text||'').trim().replace(/[?!.;]+$/,'');
 const n=norm(query);
 if(!/^(?:vorbesc despre|spune mi despre|ce stii despre|informatii despre|detalii despre|vreau detalii despre|tell me about|what do you know about|information about|details about)\b/.test(n))return null;
 const m=query.match(/\b(?:magazin(?:ul)?|market(?:ul)?|supermarket(?:ul)?|bacania|bacanie|shop|store|convenience store|restaurant(?:ul)?|cafenea(?:ua)?|hotel(?:ul)?)\s+(.+?)\s+(?:din|de pe|pe|in|on|at)\s+([^?!]{3,160})$/iu);
 if(!m)return null;
 const name=m[1].trim(),parts=m[2].split(/\s*,\s*/).map(s=>s.trim()).filter(Boolean);
 if(name.length<3||name.length>85||parts.length<1||parts.length>3||parts.some(s=>s.length>80))return null;
 const city=parts.length>=2?parts[1]:parts[0],street=parts.length>=2?parts[0]:'';
 return {name,street,city,country:parts.length>=3?parts[2]:''};
}
const matchName=(target,text)=>{
 const ignored=new Set('premier premiere store shop magazinul magazin market supermarket convenience ltd limited the and local');
 const keys=tokens(target).filter(t=>t.length>=4&&!ignored.has(t));
 const found=tokens(text);
 return keys.length>0&&keys.some(t=>found.some(w=>w===t||w===t+'s'||(t.length>=6&&w.startsWith(t))));
};
const contains=(hay,needle)=>tokens(needle).length>0&&norm(hay).includes(tokens(needle).join(' '));
const secure=url=>{try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.length>4}catch{return false}};
function extractPublicDetails(text,street,city){
 const raw=String(text||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,9000),info={};
 const postcode=raw.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i);
 if(postcode)info.postcode=postcode[0].toUpperCase();
 const phone=raw.match(/(?:^|[^\d])((?:\+44\s?(?:\(0\)\s?)?|0)(?:\d[\s-]?){9,11}\d)(?!\d)/);
 if(phone)info.phone=phone[1].trim().replace(/\s+/g,' ');
 const hours={};
 for(const day of ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']){
  const rx=new RegExp('\\b'+day+'\\s*:?\\s*(\\d{1,2}[:.]\\d{2}\\s*(?:am|pm)?\\s*[-–]\\s*\\d{1,2}[:.]\\d{2}\\s*(?:am|pm)?)','i');
  const match=raw.match(rx);
  if(match)hours[day]=match[1].trim();
 }
 if(Object.keys(hours).length>=2)info.hours=hours;
 // Full street + city is verified by caller; never infer a house number.
 if(street&&city){
  const i=raw.toLowerCase().indexOf(street.toLowerCase());
  const preceding=i>=0?raw.slice(Math.max(0,i-9),i):'';
  const number=preceding.match(/(\d{1,5}[a-z]?)\s*$/i);
  const verifiedStreet=(number?number[1]+' ':'')+street;
  info.address=[verifiedStreet,city,info.postcode].filter(Boolean).join(', ');
 }
 const categories=[
  ['food to go','mâncare la pachet'],['fresh bread','pâine proaspătă'],
  ['fresh fruit','fructe proaspete'],['fresh vegetables','legume proaspete'],
  ['fresh meat','carne proaspătă'],['frozen food','produse congelate'],
  ['newspapers','ziare'],['magazines','reviste']
 ];
 info.products=categories.filter(([word])=>raw.toLowerCase().includes(word)).map(([,label])=>label);
 if(!info.products.length)delete info.products;
 return info;
}
// Fallback independent of Exa credits: official FSA and Geoapify branch records.
const addressWords=x=>norm(x).split(' ').filter(x=>x.length>=3&&
 !['road','street','avenue','lane','drive','strada','the','and'].includes(x));
const sameStreet=(hay,street)=>!street||tokens(street).filter(w=>w.length>=4).every(w=>tokens(hay).includes(w));
const streetAddress=row=>[row.AddressLine1,row.AddressLine2,row.AddressLine3,row.AddressLine4,row.PostCode].filter(Boolean).join(', ');
const geoTown=row=>[row.city,row.town,row.village,row.municipality,row.county,row.state,row.formatted].filter(Boolean).join(', ');
const sourceRecord=(name,url,details={})=>({
 verified:true,name,details,sources:[{title:'Public business record: '+name,url,official:true}],
 reason:'public_business_record'
});
export async function fallbackNamedBusiness(target,{geoapifyKey='',fetcher=fetch}={}){
 if(!target?.name||!target?.city)return {verified:false,sources:[],reason:'invalid_target'};
 // FSA supports name/address filters, unlike OSM; it also works without any key.
 // Do not query a UK regulator for a country explicitly outside the UK.
 const outsideUk=Boolean(target.country)&&!/(?:uk|gb|united kingdom|great britain|anglia|england|scotland|wales|marea britanie)/.test(norm(target.country));
 if(!outsideUk){
  const key=tokens(target.name).find(w=>w.length>=4&&!['premier','premiere','market','store','shop','supermarket','magazinul'].includes(w));
  if(key){
   try{
    const u=new URL('https://api.ratings.food.gov.uk/Establishments');
    u.searchParams.set('name',key);
    u.searchParams.set('address',target.city);
    u.searchParams.set('businessTypeId','4613');
    u.searchParams.set('pageNumber','1');u.searchParams.set('pageSize','100');
    const response=await fetcher(u.href,{headers:{Accept:'application/json','x-api-version':'2'},signal:AbortSignal.timeout(4300)});
    if(response.ok){
     const data=await response.json();
     const records=(Array.isArray(data.establishments)?data.establishments:[]).filter(row=>{
      const addr=streetAddress(row);
      return row?.BusinessName&&matchName(target.name,row.BusinessName)&&contains(addr,target.city)&&sameStreet(addr,target.street);
     });
     if(records.length===1){
      const row=records[0],id=String(row.FHRSID||'');
      const details={address:streetAddress(row)};
      if(String(row.Phone||'').trim())details.phone=String(row.Phone).trim();
      const url=/^\d{1,12}$/.test(id)?'https://api.ratings.food.gov.uk/Establishments/'+id:'https://api.ratings.food.gov.uk/help';
      return sourceRecord(String(row.BusinessName),url,details);
     }
    }
   }catch{/* Continue to independent geocode evidence. */}
  }
 }
 if(geoapifyKey){
  try{
   const u=new URL('https://api.geoapify.com/v1/geocode/search');
   u.searchParams.set('text',[target.name,target.street,target.city,target.country].filter(Boolean).join(', '));
   u.searchParams.set('limit','10');
   u.searchParams.set('apiKey',geoapifyKey);
   const response=await fetcher(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(6000)});
   if(response.ok){
    const data=await response.json();
    const matched=(Array.isArray(data.features)?data.features:[]).filter(x=>{
     const p=x?.properties||{},tags=p.datasource?.raw||{},name=p.name||tags.name||'';
     const address=[p.street,p.formatted,p.address_line1,p.address_line2].filter(Boolean).join(' ');
     return matchName(target.name,name)&&contains(geoTown(p),target.city)&&sameStreet(address,target.street);
    });
    if(matched.length===1){
     const p=matched[0].properties||{},tags=p.datasource?.raw||{},detail={};
     detail.address=String(p.formatted||[p.address_line1,p.city||target.city,p.postcode].filter(Boolean).join(', ')).slice(0,220);
     detail.phone=String(p.contact?.phone||tags['contact:phone']||tags.phone||'').slice(0,80);
     if(!detail.phone)delete detail.phone;
     const url='https://api.geoapify.com/'; // Provider homepage; no unverified branch URL.
     return sourceRecord(String(p.name),url,detail);
    }
   }
  }catch{}
 }
 return {verified:false,sources:[],reason:'no_independent_address_match'};
}
let exaBlockedUntil=0,exaBlockedFor='';
export async function researchNamedBusiness(target,{apiKey='',geoapifyKey='',fetcher=fetch}={}){
 if(!target?.name||!target?.city)return {verified:false,sources:[],reason:'invalid_target'};
 if(!apiKey||(Date.now()<exaBlockedUntil&&exaBlockedFor===apiKey))return fallbackNamedBusiness(target,{geoapifyKey,fetcher});
 const query=[target.name,target.street,target.city,target.country,'official shop address contact opening hours'].filter(Boolean).join(' ');
 let payload;
 try{
  const response=await fetcher('https://api.exa.ai/search',{
   method:'POST',headers:{'Content-Type':'application/json','x-api-key':apiKey},
   body:JSON.stringify({query,type:'auto',numResults:7,contents:{text:{maxCharacters:6500},highlights:{numSentences:4}}}),
   signal:AbortSignal.timeout(7500)
  });
  if(!response.ok){
   if(response.status===402){exaBlockedFor=apiKey;exaBlockedUntil=Date.now()+30*60*1000;}
   return fallbackNamedBusiness(target,{geoapifyKey,fetcher});
  }
  payload=await response.json();
 }catch{return fallbackNamedBusiness(target,{geoapifyKey,fetcher})}
 const sources=[];
 for(const entry of (Array.isArray(payload?.results)?payload.results:[])){
  if(!secure(entry?.url))continue;
  const text=[entry.title,...(Array.isArray(entry.highlights)?entry.highlights:[]),entry.text].filter(Boolean).join(' ');
  if(!matchName(target.name,text)||!contains(text,target.city))continue;
  if(target.street&&!contains(text,target.street))continue;
  if(target.country&&!contains(text,target.country)&&!/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i.test(text))continue;
  const u=new URL(entry.url);
  sources.push({title:String(entry.title||'Business listing').slice(0,140),url:entry.url,
   details:extractPublicDetails(text,target.street,target.city),
   official:/premier-stores|londis|tesco|sainsburys|coop/.test(u.hostname)});
  if(sources.length>=3)break;
 }
 sources.sort((a,b)=>Number(b.official)-Number(a.official));
 if(!sources.length)return fallbackNamedBusiness(target,{geoapifyKey,fetcher});
 const details=sources.find(x=>x.details.phone||x.details.hours)?.details||sources[0].details;
 return {verified:true,name:target.name,street:target.street,city:target.city,
  sources:sources.map(({title,url,official})=>({title,url,official})),
  details,reason:'verified_address_matched_web'};
}
export function businessResearchReply(r,language='ro'){
 const ro=language!=='en';
 if(!r?.verified)return ro
  ?'Nu am putut verifica acest magazin la adresa indicată din surse publice. Nu voi inventa produsele, programul sau telefonul.'
  :'I could not verify this shop at the given address in public sources. I will not invent its products, hours or phone.';
 const d=r.details||{},lines=[
  ro?'Am găsit surse publice pentru acest magazin, verificate după nume și localitate:'
    :'I found public sources matching this shop name and location:',
  (ro?'Magazin: ':'Shop: ')+r.name,
  (ro?'Adresă verificată până la nivelul: ':'Location matched: ')+(d.address||[r.street,r.city].filter(Boolean).join(', '))
 ];
 if(d.phone)lines.push((ro?'Telefon publicat: ':'Published phone: ')+d.phone);
 if(d.hours)lines.push((ro?'Program publicat: ':'Published hours: ')+Object.entries(d.hours).map(([k,v])=>k+': '+v).join('; '));
 if(d.products?.length)lines.push((ro?'Produse enumerate de sursă: ':'Products listed by source: ')+d.products.join(', '));
 if(!d.phone&&!d.hours)lines.push(ro?'Nu am verificat încă telefonul și orarul.':'Phone and hours could not be verified.');
 lines.push(ro?'Surse:':'Sources:');
 for(const src of r.sources)lines.push(src.title+' — '+src.url);
 return lines.join('\n');
}
