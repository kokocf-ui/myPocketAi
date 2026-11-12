// Resolve only the country of an existing valid device GPS point.
// Never use IP location, account residence, language or nationality.
// Intentional short deadline: POI lookup must remain responsive.
export async function verifiedGpsCountry({latitude,longitude,geoapifyKey,fetcher=fetch,timeoutMs=1800}={}){
 if(latitude===null||latitude===undefined||longitude===null||longitude===undefined||
  String(latitude).trim()===''||String(longitude).trim()==='')return null;
 const lat=Number(latitude),lon=Number(longitude);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180||
  !Number.isFinite(Number(timeoutMs))||!geoapifyKey)return null;
 const url=new URL('https://api.geoapify.com/v1/geocode/reverse');
 url.searchParams.set('lat',String(lat));url.searchParams.set('lon',String(lon));
 url.searchParams.set('type','country');url.searchParams.set('limit','1');
 url.searchParams.set('apiKey',geoapifyKey);
 try{
  const response=await fetcher(url.href,{signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)return null;
  const properties=(await response.json())?.features?.[0]?.properties;
  const code=String(properties?.country_code||'').toUpperCase();
  return /^[A-Z]{2}$/.test(code)?code:null;
 }catch{return null}
}
