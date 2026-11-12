// UK Food Standards Agency: independent public register of food retailers.
// FHRS status represents a historic inspection, not live opening availability.
const radians=n=>n*Math.PI/180;
const meters=(a,b,c,d)=>{const x=Math.sin(radians(c-a)/2)**2+Math.cos(radians(a))*Math.cos(radians(c))*Math.sin(radians(d-b)/2)**2;return 6371000*2*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)))};
// FHRS AddressLine1 can hold a storefront/trading name even when BusinessName
// is the registered operator. Never treat a street/unit/postcode as the shop.
const tradingNameFromAddress=row=>{
 const alias=String(row.AddressLine1||'').trim();
 const registered=String(row.BusinessName||'').trim();
 if(alias.length<3||alias.length>85||!/[a-z]/i.test(alias))return '';
 if(/^(?:\d|unit\s*\d|shop\s*\d|flat\s*\d|floor\s*\d|ground floor|first floor|second floor|rear of|the rear)\b/i.test(alias))return '';
 if(/\b(?:road|street|lane|avenue|drive|crescent|boulevard|postcode|highway|industrial estate)\b/i.test(alias))return '';
 if(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i.test(alias))return '';
 if(alias.toLowerCase()===registered.toLowerCase())return '';
 return alias;
};
export async function nearbyUkRegisteredRetailers(latitude,longitude,radius,{fetcher=fetch}={}){
 if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||latitude<49.7||latitude>59.2||longitude< -8.8||longitude>2.2)return [];
 if(!Number.isFinite(radius)||radius<100||radius>10000)return [];
 const url=new URL('https://api.ratings.food.gov.uk/Establishments');
 url.searchParams.set('latitude',String(latitude));
 url.searchParams.set('longitude',String(longitude));
 url.searchParams.set('maxDistanceLimit',String(Math.min(6.1,radius/1609.344).toFixed(2)));
 // 4613 is the FSA "Retailers - other" group (small food retailers).
 url.searchParams.set('businessTypeId','4613');
 url.searchParams.set('pageNumber','1');
 url.searchParams.set('pageSize','250');
 try{
  // A densely populated area can fill a page before nearby stores are found.
  // Cap retrieval at two pages to avoid slowing mobile searches excessively.
  const rows=[];
  for(let page=1;page<=2;page++){
   url.searchParams.set('pageNumber',String(page));
   const r=await fetcher(url.href,{headers:{Accept:'application/json','x-api-version':'2'},signal:AbortSignal.timeout(4800)});
   if(!r.ok)break;
   const data=await r.json();
   const batch=Array.isArray(data?.establishments)?data.establishments:[];
   rows.push(...batch);
   const totalPages=Number(data?.meta?.totalPages);
   if(Number.isFinite(totalPages)&&totalPages>=1?page>=totalPages:batch.length<250)break;
  }
  return rows.flatMap(item=>{
   if(!/retailer|shop|store|supermarket/i.test(String(item.BusinessType||'')))return [];
   const lat=Number(item.geocode?.latitude),lon=Number(item.geocode?.longitude);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180||meters(latitude,longitude,lat,lon)>radius)return [];
   const registeredName=String(item.BusinessName||'').trim();
   const tradingName=tradingNameFromAddress(item);
   const name=tradingName||registeredName,id=String(item.FHRSID||'');
   if(name.length<3||name.length>120)return [];
   // Address lines vary across councils; retain known address segments.
   const rawAddress=[item.AddressLine1,item.AddressLine2,item.AddressLine3,item.AddressLine4].filter(Boolean).map(String);
   const postcode=String(item.PostCode||'').trim();
   const street=rawAddress.find(x=>/\b(?:road|street|lane|avenue|drive|way|close|crescent|place|high st|rd)\b/i.test(x))||'';
   const city=String(item.AddressLine4||item.AddressLine3||'').trim();
   return [{lat,lon,tags:{
    name,shop:'convenience',street,city,postcode,
    fsa_id:id,fsa_registered_name:registeredName,fsa_trading_name:tradingName,
    fsa_source:'Food Standards Agency food retailer register',
    fsa_address:rawAddress.concat(postcode).join(', ')
   }}];
  });
 }catch{return []}
}
