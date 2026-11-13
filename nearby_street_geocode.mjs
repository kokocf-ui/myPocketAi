// Resolve explicit street-centred POI searches without changing the user's GPS.
// A street name alone is never sufficient: require an explicit town and check
// the returned street, town and supplied country before accepting coordinates.
const fold=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
const clean=value=>String(value||'').trim().replace(/[?!.;]+$/,'').trim();
const streetPrefix=/(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)/i;
function makeTarget(streetName,city,country){
 const name=clean(streetName),town=clean(city),nation=clean(country);
 if(!name||!town||name.length>75||town.length>75||nation.length>65)return null;
 if(/^(?:mea|me|here|aici|acasa)$/i.test(town))return null;
 const street=/^(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+/i.test(name)?name:'Strada '+name;
 return {street,city:town,country:nation,query:[street,town,nation].filter(Boolean).join(', ')};
}
export function parseNearbyStreetQuery(value){
 const t=clean(String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,''));
 // "Ce magazine găsești în jurul străzii Morii din Oradea, România?"
 const spatial=t.match(/\b(?:in jurul|din jurul|in apropierea|in apropiere de|aproape de|langa|pe langa|around|near)\s+(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+(.+?)\s+(?:din|in|of)\s+([^,]+?)(?:,\s*(.+))?$/i);
 if(spatial)return makeTarget(spatial[1],spatial[2],spatial[3]);
 // Already extracted "Strada Morii, Oradea, România".
 const full=t.match(/^(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+([^,]{2,75}),\s*([^,]{2,75})(?:,\s*([^,]{2,65}))?$/i);
 if(full)return makeTarget(full[1],full[2],full[3]);
 // "Restaurante în Oradea pe strada Nufărului" — city comes before street.
 const cityFirst=t.match(/\b(?:in|din)\s+([^,]{2,75}?)\s+pe\s+(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+(.+?)(?:,\s*(.+))?$/i);
 if(cityFirst)return makeTarget(cityFirst[2],cityFirst[1],cityFirst[3]);
 // "Restaurante pe strada Nufărului din Oradea" — street comes before city.
 const streetFirst=t.match(/\bpe\s+(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+(.+?)\s+(?:din|in|of)\s+([^,]+?)(?:,\s*(.+))?$/i);
 if(streetFirst)return makeTarget(streetFirst[1],streetFirst[2],streetFirst[3]);
 // Extracted destination: "Oradea pe strada Nufărului".
 const compactCityFirst=t.match(/^([^,]{2,75}?)\s+pe\s+(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+(.+?)(?:,\s*(.+))?$/i);
 if(compactCityFirst&&!/^(?:restaurante?|restaurant|magazine?|shops?|hoteluri|hotels?|cafenele|cafes?|baruri|bars?|pizzerii|farmacii|pharmacies|parcari|parking|zoo)$/i.test(compactCityFirst[1].trim()))
  return makeTarget(compactCityFirst[2],compactCityFirst[1],compactCityFirst[3]);
 // "strada Morii din Oradea" or "street Morii in London".
 const suffix=t.match(/^(?:strada|strazii|strazi|str\.?|street|st\.?|road|rd\.?)\s+(.+?)\s+(?:din|in|of)\s+([^,]+?)(?:,\s*(.+))?$/i);
 return suffix?makeTarget(suffix[1],suffix[2],suffix[3]):null;
}
function streetKey(value){
 return fold(value).replace(/^(?:strada|strazii|strazi|str|street|st|road|rd)\s+/,'').trim();
}
function hasLocality(locality,label,city){
 if(locality)return fold(locality)===fold(city);
 const text=' '+fold(label)+' ';
 return text.includes(' '+fold(city)+' ');
}
function checkedPoint(target,record,source,countryCode){
 const p=record?.properties||record||{};
 const addr=p.address||{};
 const isNominatim=source==='nominatim';
 const name=p.street||addr.road||addr.pedestrian||addr.residential||
  ((p.result_type==='street'||p.type==='road'||p.type==='residential'||p.class==='highway')?p.name:'');
 if(!name||streetKey(name)!==streetKey(target.street))return null;
 const label=String(p.formatted||p.display_name||p.name||'');
 const town=p.city||p.town||p.village||p.municipality||
  addr.city||addr.town||addr.village||addr.municipality||'';
 if(!hasLocality(town,label,target.city))return null;
 const returnedCountry=String(p.country_code||addr.country_code||'').toUpperCase();
 if(countryCode&&returnedCountry!==countryCode.toUpperCase())return null;
 if(target.country&&!countryCode && !(' '+fold(label||p.country||addr.country)+' ').includes(' '+fold(target.country)+' '))return null;
 const lat=Number(p.lat??record?.geometry?.coordinates?.[1]);
 const lon=Number(p.lon??record?.geometry?.coordinates?.[0]);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return null;
 return {latitude:lat,longitude:lon,label:target.query,street_verified:true,source};
}
export async function geocodeNearbyStreet(target,{apiKey='',countryCode='',fetcher=fetch}={}){
 if(!target?.street||!target?.city)throw Error('street_query_incomplete');
 if(apiKey){
  try{
   const url=new URL('https://api.geoapify.com/v1/geocode/search');
   url.searchParams.set('text',target.query);
   url.searchParams.set('limit','10');
   if(countryCode)url.searchParams.set('filter','countrycode:'+countryCode.toLowerCase());
   url.searchParams.set('apiKey',apiKey);
   const r=await fetcher(url.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(9000)});
   if(r.ok){
    const json=await r.json();
    for(const row of Array.isArray(json?.features)?json.features:[]){
     const match=checkedPoint(target,row,'geoapify',countryCode);
     if(match)return match;
    }
   }
  }catch{/* Try a separately verified street from Nominatim. */}
 }
 try{
  const url=new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('street',target.street);
  url.searchParams.set('city',target.city);
  if(target.country)url.searchParams.set('country',target.country);
  url.searchParams.set('format','jsonv2');
  url.searchParams.set('addressdetails','1');
  url.searchParams.set('limit','10');
  const r=await fetcher(url.href,{headers:{Accept:'application/json','User-Agent':'PocketAI/105 (explicit street POI)'},signal:AbortSignal.timeout(9000)});
  if(r.ok){
   const rows=await r.json();
   for(const row of Array.isArray(rows)?rows:[]){
    const match=checkedPoint(target,row,'nominatim',countryCode);
    if(match)return match;
   }
  }
 }catch{/* Do not silently substitute the phone's country or city centre. */}
 throw Error('street_not_verified');
}
