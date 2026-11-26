import {EUROPE_COUNTRIES,europeanCountrySources} from './europe_country_sources.mjs';
// One domestic-transport record per country. A catalog entry is NOT an adapter,
// an imported timetable, an active feed, or evidence of countrywide coverage.
const implemented={
 RO:{urban_transport:['ro_urban_gtfs'],intercity_transport:['ro_national_transit']},
 GB:{urban_transport:['tfl','en_urban_gtfs'],intercity_transport:['uk_national_transit']}
};
export const NATIONAL_TRANSPORT_COUNTRIES=Object.freeze(Object.fromEntries(
 EUROPE_COUNTRIES.map(country=>[country,Object.freeze({
  country,domesticOnly:true,gpsCountryRequired:true,
  urban_transport:Object.freeze(implemented[country]?.urban_transport||[]),
  intercity_transport:Object.freeze(implemented[country]?.intercity_transport||[]),
  timetableCoverage:'not_verified_countrywide',
  integrationStatus:implemented[country]?'implemented_adapters':'sources_require_integration'
 })])
));
export function configuredNationalTransportProviders(env={}){
 const privateReady=(binding,url,token)=>{
  if(String(token||'').trim().length<32)return false;
  if(binding)return typeof binding.fetch==='function';
  try{const u=new URL(String(url||'').trim());return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/';}catch{return false;}
 };
 return [
  String(env.BILO_API_KEY||'').trim()?'ro_national_transit':null,
  privateReady(env.RO_URBAN_VPC,env.RO_URBAN_API_URL,env.RO_URBAN_API_TOKEN)?'ro_urban_gtfs':null,
  String(env.TRANSCAPI_API_KEY||'').trim()?'uk_national_transit':null,
  privateReady(env.EN_URBAN_VPC,env.EN_URBAN_API_URL,env.EN_URBAN_API_TOKEN)?'en_urban_gtfs':null,
  String(env.TFL_APP_KEY||'').trim()||env.TFL_PUBLIC_FALLBACK!=='false'?'tfl':null
 ].filter(Boolean);
}
export function nationalTransportCoverage(country,enabledProviders=[]){
 const code=String(country||'').toUpperCase(),profile=NATIONAL_TRANSPORT_COUNTRIES[code];
 if(!profile)return null;
 const enabled=new Set(enabledProviders);
 const urban=profile.urban_transport.filter(id=>enabled.has(id)),intercity=profile.intercity_transport.filter(id=>enabled.has(id));
 return {country:code,domestic_only:true,gps_country_required:true,
  urban_configured:urban.length>0,intercity_configured:intercity.length>0,
  configured_adapters:[...urban,...intercity],
  integration_status:profile.integrationStatus,
  coverage_status:urban.length||intercity.length?'configured_adapters_coverage_not_verified':'not_connected',
  countrywide_coverage_verified:false,
  source_catalog: europeanCountrySources(code)?.transport||[]};
}
