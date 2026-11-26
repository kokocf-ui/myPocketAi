// Explicit, read-only provider smoke check. NEVER deploys or changes secrets.
// Default is offline planning only. Actual requests need --allow-network,
// reviewed provider config and a GEOAPIFY_API_KEY already in the environment.
import {mkdirSync,writeFileSync} from 'node:fs';
import {planEnturNationalJourney,enturNationalConfigured} from '../entur_national_transit.mjs';
import {planDigitransitNationalJourney,digitransitNationalConfigured} from '../digitransit_national_transit.mjs';
import {verifiedGpsCountry} from '../country_gps_resolution.mjs';
const args=process.argv.slice(2),country=args.find(a=>a.startsWith('--country='))?.slice(10)||'NO';
if(!['NO','FI','EE'].includes(country))throw Error('Only NO, FI and EE have implemented live verifiers; other countries are never silently mapped to them.');
const plan=country!=='NO'?planDigitransitNationalJourney:planEnturNationalJourney;
const configured=country!=='NO'?digitransitNationalConfigured:enturNationalConfigured;
const live=args.includes('--allow-network');
const cases=country==='EE'?[
 {id:'tallinn-local',from:{latitude:59.439,longitude:24.737},to:{latitude:59.437,longitude:24.755}},
 {id:'tallinn-tartu-intercity',from:{latitude:59.439,longitude:24.737},to:{latitude:58.373,longitude:26.707}}
]:country==='FI'?[
 {id:'helsinki-local',from:{latitude:60.171,longitude:24.941},to:{latitude:60.178,longitude:24.95}},
 {id:'helsinki-tampere-intercity',from:{latitude:60.171,longitude:24.941},to:{latitude:61.498,longitude:23.773}}
]:[
 {id:'oslo-local',from:{latitude:59.9109,longitude:10.7526},to:{latitude:59.914,longitude:10.732}},
 {id:'oslo-lillehammer-intercity',from:{latitude:59.9109,longitude:10.7526},to:{latitude:61.1145,longitude:10.4664}}
];
const report={country,run_at:new Date().toISOString(),status:'not_run',live_requests:false,
 countrywide_coverage_verified:false,physical_navigation_verified:false,cases:cases.map(c=>({id:c.id,status:'not_run'}))};
if(!live){
 report.reason='offline_only_use_allow_network_after_access_and_terms_review';
}else if(!configured(process.env)||!process.env.GEOAPIFY_API_KEY){
 report.reason='reviewed_provider_configuration_and_geocoder_key_required';process.exitCode=2;
}else{
 report.live_requests=true;
 const at=new Date();at.setUTCDate(at.getUTCDate()+1);at.setUTCHours(8,0,0,0);
 const verifyCountry=p=>verifiedGpsCountry({...p,geoapifyKey:process.env.GEOAPIFY_API_KEY,timeoutMs:1800});
 for(const [i,c] of cases.entries()){
  const [originCountry,destinationCountry]=await Promise.all([verifyCountry(c.from),verifyCountry(c.to)]);
  const result=await plan(process.env,{...c,originCountry,destinationCountry,departureAt:at.toISOString(),limit:3},{verifyCountry});
  report.cases[i]={id:c.id,status:result.status,verified_itineraries:result.journeys.length,
   all_returned_stop_countries_checked:result.journeys.length>0&&result.journeys.every(j=>j.stop_countries_verified),source_status:result.source_status||null};
 }
 report.status=report.cases.every(c=>c.status==='ok'&&c.verified_itineraries>0)?'live_smoke_pass':'live_smoke_incomplete';
 if(report.status!=='live_smoke_pass')process.exitCode=1;
}
mkdirSync('.bundle-check',{recursive:true});
writeFileSync('.bundle-check/national-live-'+country+'.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
