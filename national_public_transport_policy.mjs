import {selectCountryProviders} from './smart_country_registry.mjs';
/* Maps -> Transport public national only. Never used by Deplasare spre. */
export function nationalPublicTransportPolicy({originCountry='',destinationCountry='',urbanRoute=false,localRoute=false,londonRoute=false,englandLocalRoute=false,enabledProviders=[]}={}){
 const from=String(originCountry||'').toUpperCase(),to=String(destinationCountry||'').toUpperCase();
 if(!/^[A-Z]{2}$/.test(from))return {status:'origin_country_unverified',provider:null};
 if(!/^[A-Z]{2}$/.test(to))return {status:'destination_country_unverified',provider:null,country:from};
 if(from!==to)return {status:'international_destination',provider:null,country:from};
 if(from==='RO'&&localRoute&&!urbanRoute)return {status:'local_provider_not_connected',provider:null,country:from,category:'urban_transport'};
 const permitted={RO:urbanRoute?['urban_transport','ro_urban_gtfs']:['intercity_transport','ro_national_transit'],
  GB:londonRoute?['urban_transport','tfl']:englandLocalRoute&&enabledProviders.includes('en_urban_gtfs')?['urban_transport','en_urban_gtfs']:['intercity_transport','uk_national_transit']}[from];
 if(!permitted)return {status:'country_provider_not_connected',provider:null,country:from};
 const result=selectCountryProviders({country:from,category:permitted[0],region:from==='GB'&&londonRoute?'london':'',enabledProviders});
 if(result.status!=='ready'||!result.providers.includes(permitted[1]))
  return {status:'national_provider_not_connected',provider:null,country:from,category:permitted[0]};
 return {status:'ready',provider:permitted[1],country:from,category:permitted[0]};
}
