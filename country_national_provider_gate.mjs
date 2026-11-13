// The registry controls national adapters; Geoapify, Photon and TomTom
// remain international services, never assigned to a home country.
import {selectCountryProviders} from './smart_country_registry.mjs';
export function nationalProviderAuthorized({provider,country,region,enabled=true}={}){
 if(!enabled)return true; // rollout switch: production unchanged until approved
 if(!provider||!country)return false;
 const category=provider==='tfl'?'urban_transport':
  provider==='uk_national_transit'?'intercity_transport':null;
 if(!category)return false;
 return selectCountryProviders({country,region,category,enabledProviders:[provider]})
  .providers.includes(provider);
}
