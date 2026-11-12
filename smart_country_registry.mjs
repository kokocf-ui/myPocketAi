// Smart Country Registry v1. Source selection only; no network calls.
// Provider adapters live in existing modules and retain their own permissions.
const names={
 RO:['romania','românia'],GB:['united kingdom','uk','great britain','anglia','england','scotland','wales'],
 HU:['hungary','ungaria','magyarorszag'],FR:['france','franța','franta'],
 DE:['germany','germania','deutschland'],IT:['italy','italia'],ES:['spain','spania','españa']
};
const clean=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const aliases=new Map(Object.entries(names).flatMap(([code,values])=>[[clean(code),code],...values.map(v=>[clean(v),code])]));
export const identifyCountry=value=>aliases.get(clean(value))??null;
const placeCategories=new Set(['restaurant','pub','cafe','hotel','pharmacy','supermarket','parking','zoo','park','museum','market','shop','fuel','car_repair','fast_food','confectionery','corner_shop','lounge']);
const providers={
 global:{places:['geoapify','photon','tomtom_places'],geocode:['geoapify','photon']},
 RO:{urban_transport:['ro_urban_gtfs'],intercity_transport:['ro_national_transit']},
 GB:{urban_transport:['tfl'],intercity_transport:['uk_national_transit']},
 HU:{},FR:{},DE:{},IT:{},ES:{}
};
const canonicalCategory=v=>placeCategories.has(clean(v))?'places':clean(v);
// enabledProviders is the caller's verified configured and authorized provider IDs.
// It is intentionally NOT inferred from the country, to avoid chargeable API calls.
export function selectCountryProviders({category,country,originCountry,destinationCountry,region='',enabledProviders=[]}={}){
 const type=canonicalCategory(category);
 if(!type)return {countries:[],providers:[],status:'missing_category'};
 const origin=identifyCountry(originCountry),destination=identifyCountry(destinationCountry),target=identifyCountry(country);
 const crossBorder=type.endsWith('_transport')&&origin&&destination;
 const countries=crossBorder?[...new Set([origin,destination])]:[target||destination||origin].filter(Boolean);
 if(!countries.length)return {countries:[],providers:[],status:'country_unresolved'};
 const candidates=[...(providers.global[type]||[])];
 for(const c of countries){
   for(const id of providers[c]?.[type]||[]){
     if(id==='tfl'&&clean(region)!=='london')continue;
     candidates.push(id);
   }
 }
 const allowed=new Set(enabledProviders);
 const selected=[...new Set(candidates)].filter(id=>allowed.has(id));
 return {countries,providers:selected,status:selected.length?'ready':'no_configured_provider'};
}
export const COUNTRY_REGISTRY_VERSION=1;
