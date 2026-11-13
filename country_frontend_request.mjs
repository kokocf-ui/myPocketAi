// Backend request contract for frontend quick-place searches.
// Does not geocode, call providers, infer nationality, or change transport engines.
// A verified country comes only from trusted geocoding performed by the backend.
import {identifyCountry,selectCountryProviders} from './smart_country_registry.mjs';
export function planFrontendPlaceProviders({
 category,verifiedCountryCode,enabled=false,geoapifyConfigured=false,tomtomConfigured=false
}={}){
 const selected=identifyCountry(verifiedCountryCode);
 // Global providers are independent of the national registry. The registry
 // controls ONLY country-specific adapters (including UK sources).
 const globals=['photon',...(geoapifyConfigured?['geoapify']:[]),
  ...(tomtomConfigured?['tomtom_places']:[])];
 const allowed=[...globals,'uk_food_retailers'];
 if(!enabled)return {mode:'legacy',country:selected,providers:globals,globalProviders:globals,localProviders:[],ukRetailAllowed:true,reason:'feature_disabled'};
 if(!selected)return {
  mode:'common_only',country:null,
  providers:globals,globalProviders:globals,localProviders:[],
  ukRetailAllowed:false,reason:'country_unverified'
 };
 const routing=selectCountryProviders({category,country:selected,enabledProviders:allowed});
 return {
  mode:routing.status==='ready'?'country_scoped':'common_only',
  country:selected,providers:routing.providers,globalProviders:globals,
  localProviders:routing.providers.filter(p=>!globals.includes(p)),
  ukRetailAllowed:routing.providers.includes('uk_food_retailers'),
  reason:routing.status
 };
}
