// Registry metadata/configuration only. No feed loading, provider call, quota
// use or countrywide coverage inference. Countries still need actual stop and
// date evidence from the loaded dataset before any journey can be offered.
export const OPEN_SURFACE_TRANSPORT_SOURCE=Object.freeze({
 id:'open_surface_gtfs',name:'FlixBus / FlixTrain European open GTFS',
 categories:Object.freeze(['intercity_transport','international_transport']),
 modes:Object.freeze(['coach','train']),scope:'selected_european_operator_network',
 sourceUrl:'https://gtfs.gis.flix.tech/gtfs_generic_eu.zip',
 publisherUrl:'https://transport.data.gouv.fr/datasets/flixbus-horaires-theoriques-du-reseau-europeen-1',
 license:'ODbL-1.0 + PAN particular conditions',
 integrationStatus:'implemented_gated',defaultEnabled:false,
 activationRequirements:Object.freeze(['explicit_feature_flag','compiled_asset_binding','fresh_valid_feed',
  'free_worker_resource_fit','licence_redistribution_and_refresh_packaging']),
 // Observations from the actual source path inspection and endpoint/replay
 // runs; NOT a list of all supported countries or domestic service rights.
 observedStopCountries:Object.freeze(['GB','FR','CZ','DE','RO']),
 observedDoorToDoorPairs:Object.freeze(['GB>RO']),
 evidenceStatus:'real_source_and_local_responses_offline_replay',
 evidenceRun:'45992442387',
 countrywideCoverageVerified:false,urbanCoverageVerified:false,
 seatAvailabilityVerified:false,transferProtectionVerified:false
});
export function openSurfaceConfigurationStatus(env={}){
 if(String(env.OPEN_SURFACE_ENABLED||'')!=='true')return 'disabled';
 return typeof env.OPEN_SURFACE_ASSETS?.fetch==='function'?'configured_pending_feed_validation':'index_not_configured';
}
export const openSurfaceConfigured=env=>openSurfaceConfigurationStatus(env)==='configured_pending_feed_validation';
export function publicSurfaceSourceForCountry(country,enabledProviders=[]){
 const source=OPEN_SURFACE_TRANSPORT_SOURCE,code=String(country||'').toUpperCase();
 return {id:source.id,name:source.name,categories:[...source.categories],modes:[...source.modes],scope:source.scope,
  integration_status:source.integrationStatus,configured:enabledProviders.includes(source.id),default_enabled:false,
  activation_status:enabledProviders.includes(source.id)?'configured_pending_feed_validation':'disabled',
  coverage_status:'requires_loaded_feed_stop_and_date_verification',countrywide_coverage_verified:false,
  urban_coverage_verified:false,observed_source_stops:source.observedStopCountries.includes(code),
  // A successful synthetic international path says nothing about all domestic
  // services, cabotage rights, currently available seats or a country's cities.
  domestic_service_verified:false,source_url:source.sourceUrl,publisher_url:source.publisherUrl,licence:source.license,
  evidence_status:source.observedStopCountries.includes(code)?'source_stops_observed_not_countrywide':'country_coverage_not_verified',
  source_evidence_status:source.evidenceStatus,evidence_run:source.evidenceRun,
  activation_requirements:[...source.activationRequirements]};
}
