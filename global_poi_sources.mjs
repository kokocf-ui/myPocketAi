// Country-neutral, explicitly opt-in TomTom Places Search API v3 provider.
import {foodCategoryAccepts} from './food_location_quality.mjs';
// Not active without TOMTOM_PLACES_ENABLED=true: no unexpected API charges.
// Reference: https://docs.tomtom.com/places-search-api/documentation/places-search/discover
const fold=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const terms=x=>fold(x).split(' ').filter(Boolean);
const nonNames=new Set(['store','shop','local','magazin','magazinul','market','supermarket','premier','premiere','the','and','de','din','in','la','do']);
const valid=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
function distance(lat1,lon1,lat2,lon2){
 const rad=Math.PI/180,dLat=(lat2-lat1)*rad,dLon=(lon2-lon1)*rad;
 const a=Math.sin(dLat/2)**2+Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLon/2)**2;
 return 12742000*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
}
const poiTypes={
 corner_shop:['convenience_store','delicatessen','grocery_store','greengrocer'],
 supermarket:['supermarket'],
 shop:['convenience_store','grocery_store','shop_or_store','supermarket'],
 market_bakery:['convenience_store','grocery_store','supermarket','food_market'],
 confectionery:['food_and_drinks_shop','ice_cream_shop'],
 restaurant:['restaurant'],
 fast_food:['fast_food'],
 cafe:['cafe','coffee_shop','tea_house'],
 lounge:['cafe','coffee_shop','pub','tea_house','bar'],
 pub:['pub','bar'],
 hotel:['hotel_or_motel','bandb_or_guest_house','hostel'],
 pharmacy:['pharmacy','drug_store'],
 fuel:['fuel_station'],
 parking:['parking_facility'],
 car_wash:['vehicle_wash'],
 car_repair:['vehicle_repair'],
 museum:['museum'],
 park:['park_and_recreation_area'],
 zoo:['zoo_or_aquarium'],
 atm:['atm'],
 bank:['bank'],
 post_office:['post_office'],
 library:['public_library']
};
export function globalPoiTypesFor(category){
 return Array.isArray(poiTypes[category])?poiTypes[category]:[];
}
const categoryShop=(category,types)=>{
 const ids=types.map(x=>String(x.id||'').toLowerCase());
 if(category==='corner_shop')return 'convenience';
 if(category==='supermarket')return 'supermarket';
 if(ids.includes('supermarket'))return 'supermarket';
 if(ids.some(x=>['convenience_store','grocery_store','greengrocer','delicatessen'].includes(x)))return 'convenience';
 return category==='shop'?'shop':'';
};
async function discover({query='',latitude,longitude,radius=3000,category='',apiKey='',enabled=false,fetcher=fetch,maxResults=25}){
 if(!enabled||!apiKey||!valid(latitude,longitude))return [];
 const categoryTypes=globalPoiTypesFor(category);
 if(category&&!categoryTypes.length)return [];
 const geometry={type:'circle',center:[longitude,latitude],radiusInMeters:Math.max(100,Math.min(10000,Math.round(radius)))};
 const filters={types:['poi'],geometry};
 if(categoryTypes.length)filters.poiTypes=categoryTypes;
 const body={query,maxResults:Math.min(25,Math.max(1,maxResults)),filters,
  origin:{type:'point',coordinates:[longitude,latitude]}};
 try{
  const response=await fetcher('https://api.tomtom.com/maps/orbis/places/discover',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',
   'TomTom-Api-Version':'3','TomTom-Api-Key':apiKey,
   // Explicit fields avoid the provider's potentially variable-cost "results" wildcard.
   'Attributes':'results(id,type,title,position,address,poiTypes)'},
   body:JSON.stringify(body),signal:AbortSignal.timeout(6000)
  });
  if(!response.ok)return [];
  const data=await response.json();
  return (Array.isArray(data.results)?data.results:[]).filter(x=>x?.type==='poi')
   .filter(x=>x.position?.type==='Point'&&Array.isArray(x.position.coordinates)&&x.position.coordinates.length===2)
   .filter(x=>valid(Number(x.position.coordinates[1]),Number(x.position.coordinates[0])))
   .filter(x=>distance(latitude,longitude,Number(x.position.coordinates[1]),Number(x.position.coordinates[0]))<=geometry.radiusInMeters);
 }catch{return []}
}
function addressText(r){
 const a=r.address||{};
 return [a.houseNumber,a.street,a.municipality,a.countrySubdivision,a.postalCode,a.country].filter(Boolean).join(', ');
}
function matchingName(wanted,actual){
 const keys=terms(wanted).filter(x=>x.length>=3&&!nonNames.has(x));
 const found=terms(actual);
 return keys.length>0&&keys.every(k=>found.some(x=>x===k||x===k+'s'||(k.length>5&&x.startsWith(k))));
}
function sameStreet(actual,expected){
 const words=terms(expected).filter(x=>x.length>=4&&!['strada','street','road','strasse','avenue','bulevard','boulevard','calle'].includes(x));
 return words.length===0||words.every(x=>terms(actual).includes(x));
}
export async function globalNamedBusiness(target,{apiKey='',enabled=false,fetcher=fetch}={}){
 if(!enabled||!apiKey||!target?.name||!target?.city)return {verified:false,reason:'international_provider_disabled'};
 // No GPS is necessary for a business named by city. Use full explicit text
 // without biasing toward the phone's country or current GPS.
 let rows=[];
 try{
  const response=await fetcher('https://api.tomtom.com/maps/orbis/places/discover',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',
    'TomTom-Api-Key':apiKey,'TomTom-Api-Version':'3',
    'Attributes':'results(id,type,title,position,address,poiTypes)'},
   body:JSON.stringify({query:[target.name,target.street,target.city,target.country].filter(Boolean).join(', '),
    maxResults:10,filters:{types:['poi']}}),
   signal:AbortSignal.timeout(6000)
  });
  if(response.ok)rows=(await response.json()).results||[];
 }catch{}
 const matches=(Array.isArray(rows)?rows:[]).filter(row=>{
  const a=row?.address||{};
  if(row?.type!=='poi'||!matchingName(target.name,row.title))return false;
  if(![a.municipality,a.municipalitySubdivision].some(x=>fold(x)===fold(target.city)))return false;
  if(target.street&&!sameStreet(a.street,target.street))return false;
  if(target.country && fold(target.country)!==fold(a.country) && fold(target.country)!==fold(a.countryCodeIso2) && (!target.countryCode||target.countryCode.toUpperCase()!==String(a.countryCodeIso2||'').toUpperCase())){
   // Do not infer that an unexpected country is equivalent.
   return false;
  }
  return row.position?.type==='Point'&&valid(Number(row.position.coordinates?.[1]),Number(row.position.coordinates?.[0]));
 });
 if(matches.length!==1)return {verified:false,reason:matches.length?'ambiguous_provider_results':'no_verified_provider_match'};
 const row=matches[0],address=addressText(row);
 return {verified:true,name:row.title,street:target.street,city:target.city,
  details:{address},reason:'tomtom_address_matched_poi',
  sources:[{title:'TomTom Places — înregistrare geografică (nu pagina oficială a magazinului)',
   url:'https://www.tomtom.com/products/places-apis/',official:false}]};
}
export async function globalNearbyPlaces({latitude,longitude,radius=3000,category='',apiKey='',enabled=false,fetcher=fetch}={}){
 const rows=await discover({latitude,longitude,radius,category,apiKey,enabled,fetcher});
 return rows.flatMap(r=>{
  const lat=Number(r.position?.coordinates?.[1]),lon=Number(r.position?.coordinates?.[0]);
  const title=String(r.title||'').trim(),a=r.address||{};
  if(!title||!valid(lat,lon))return [];
  if(/^(?:strada|street|road|rue|calle|via)\s+/i.test(title))return [];
  // The same food category policy must also hold for optional TomTom Places.
  if(category==='restaurant'&&!foodCategoryAccepts(category,{name:title,amenity:'restaurant'}))return [];
  const ids=Array.isArray(r.poiTypes)?r.poiTypes:[];
  return [{lat,lon,tags:{
   name:title,shop:categoryShop(category,ids),amenity:category==='cafe'?'cafe':category==='restaurant'?'restaurant':category==='fast_food'?'fast_food':'',
   street:String(a.street||''),housenumber:String(a.houseNumber||''),
   city:String(a.municipality||''),postcode:String(a.postalCode||''),
   tomtom_place_id:String(r.id||'').slice(0,120),
   poi_source:'TomTom Places'
  }}];
 });
}
