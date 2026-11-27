import {irailNationalConfigured} from './irail_national_transit.mjs';
import {KEYLESS_GTFS_SOURCES,configuredKeylessGtfsSources,keylessGtfsMetadata} from './keyless_transport_sources.mjs';
import {OPEN_SURFACE_TRANSPORT_SOURCE,openSurfaceConfigured,publicSurfaceSourceForCountry} from './public_transport_sources.mjs';
import {hereNationalConfigured} from './here_national_transit.mjs';
import {germanyNationalConfigured} from './germany_national_transit.mjs';
import {digitransitNationalConfigured} from './digitransit_national_transit.mjs';
import {enturNationalConfigured} from './entur_national_transit.mjs';
import {EUROPE_COUNTRIES,europeanCountrySources} from './europe_country_sources.mjs';
// One domestic-transport record per country. A catalog entry is NOT an adapter,
// an imported timetable, an active feed, or evidence of countrywide coverage.
const implemented={
 BE:{urban_transport:[],intercity_transport:['irail_national_transit'],domesticPlanner:'irail_national_transit'},
 DE:{urban_transport:['here_national_transit','germany_motis_national_transit'],intercity_transport:['here_national_transit','germany_motis_national_transit'],domesticPlanner:'germany_motis_national_transit',domesticPlanners:['here_national_transit','germany_motis_national_transit']},
 RO:{urban_transport:['ro_urban_gtfs'],intercity_transport:['ro_national_transit']},
 GB:{urban_transport:['tfl','en_urban_gtfs'],intercity_transport:['uk_national_transit']},
 NO:{urban_transport:['entur_national_transit'],intercity_transport:['entur_national_transit'],domesticPlanner:'entur_national_transit'},
 FI:{urban_transport:['digitransit_national_transit'],intercity_transport:['digitransit_national_transit'],domesticPlanner:'digitransit_national_transit'},
 EE:{urban_transport:['digitransit_national_transit'],intercity_transport:['digitransit_national_transit'],domesticPlanner:'digitransit_national_transit'}
};
export const NATIONAL_TRANSPORT_COUNTRIES=Object.freeze(Object.fromEntries(
 EUROPE_COUNTRIES.map(country=>[country,Object.freeze({
  country,domesticOnly:true,gpsCountryRequired:true,
  // Supplementary network candidates are NOT domestic national planners.
  supplementary_transport:Object.freeze([OPEN_SURFACE_TRANSPORT_SOURCE.id]),
  international_transport:Object.freeze([OPEN_SURFACE_TRANSPORT_SOURCE.id]),
  urban_transport:Object.freeze(implemented[country]?.urban_transport||[]),
  intercity_transport:Object.freeze([...(implemented[country]?.intercity_transport||[]),...KEYLESS_GTFS_SOURCES.filter(s=>s.country===country).map(s=>s.id)]),
  domesticPlanner:implemented[country]?.domesticPlanner||null,
  domesticPlanners:Object.freeze([...(implemented[country]?.domesticPlanners||[implemented[country]?.domesticPlanner].filter(Boolean)),...KEYLESS_GTFS_SOURCES.filter(s=>s.country===country).map(s=>s.id)]),
  timetableCoverage:'not_verified_countrywide',
  validationStatus:['NO','FI','EE','DE','BE',...KEYLESS_GTFS_SOURCES.map(s=>s.country)].includes(country)?'contract_tests_only':implemented[country]?'live_coverage_not_reverified':'not_implemented',
  integrationStatus:implemented[country]||KEYLESS_GTFS_SOURCES.some(s=>s.country===country)?'implemented_adapters':'sources_require_integration'
 })])
));
export function configuredNationalTransportProviders(env={}){
 const privateReady=(binding,url,token)=>{
  if(String(token||'').trim().length<32)return false;
  if(binding)return typeof binding.fetch==='function';
  try{const u=new URL(String(url||'').trim());return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/';}catch{return false;}
 };
 return [
  ...configuredKeylessGtfsSources(env),
  irailNationalConfigured(env)?'irail_national_transit':null,
  openSurfaceConfigured(env)?OPEN_SURFACE_TRANSPORT_SOURCE.id:null,
  hereNationalConfigured(env)?'here_national_transit':null,
  germanyNationalConfigured(env)?'germany_motis_national_transit':null,
  enturNationalConfigured(env)?'entur_national_transit':null,
  digitransitNationalConfigured(env)?'digitransit_national_transit':null,
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
  configured_adapters:[...new Set([...urban,...intercity])],
  validation_status:profile.validationStatus,
  integration_status:profile.integrationStatus,
  coverage_status:urban.length||intercity.length?'configured_adapters_coverage_not_verified':'not_connected',
  countrywide_coverage_verified:false,
  public_transport_registered:true,
  supplementary_sources:[publicSurfaceSourceForCountry(code,enabledProviders)],
  prepared_static_sources:keylessGtfsMetadata(code,enabledProviders),
  service_scope:code==='BE'?'Belgian rail station-to-station only; no urban or last-mile coverage':null,
  international_sources:profile.international_transport.filter(id=>enabled.has(id)),
  source_catalog: europeanCountrySources(code)?.transport||[]};
}
