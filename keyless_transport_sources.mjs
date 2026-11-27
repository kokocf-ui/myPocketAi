import definitions from './keyless_gtfs_sources.json' with {type:'json'};
// Access classification is source-specific: no secret != no terms, no hosting
// cost or verified national coverage. Reading this catalog never loads feeds.
export const KEYLESS_GTFS_SOURCES=Object.freeze(definitions.map(s=>Object.freeze({...s,modes:Object.freeze(s.modes),downloadHosts:Object.freeze(s.downloadHosts)})));
export const keylessGtfsSource=id=>KEYLESS_GTFS_SOURCES.find(s=>s.id===id)||null;
export function configuredKeylessGtfsSources(env={}){
 if(env.PUBLIC_GTFS_ENABLED!=='true'||typeof env.PUBLIC_GTFS_ASSETS?.fetch!=='function')return [];
 const reviewed=new Set(String(env.PUBLIC_GTFS_REVIEWED_SOURCES||'').split(',').map(x=>x.trim()));
 return KEYLESS_GTFS_SOURCES.filter(s=>reviewed.has(s.id)).map(s=>s.id);
}
export function keylessGtfsMetadata(country,enabled=[]){
 return KEYLESS_GTFS_SOURCES.filter(s=>s.country===country).map(s=>({...s,kind:'static_gtfs',access:'no_api_key',status:'implemented_gated',
  configured:enabled.includes(s.id),activation_status:enabled.includes(s.id)?'configured_pending_feed_validation':'disabled',
  countrywide_coverage_verified:false,coverage_status:'requires_loaded_feed_stop_and_date_verification',routing:'prepared_static_index_only',realtime:false}));
}
