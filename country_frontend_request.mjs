// Backend request contract for frontend quick-place searches.
// Does not geocode, call providers, infer nationality, or change transport engines.
// A verified country comes only from trusted geocoding performed by the backend.
import {identifyCountry,selectCountryProviders} from './smart_country_registry.mjs';
export function planFrontendPlaceProviders({
 category,verifiedCountryCode,enabled=false,geoapifyConfigured=false,tomtomConfigured=false
}={}){
 const selected=identifyCountry(verifiedCountryCode);
 const allowed=['photon',...(geoapifyConfigured?['geoapify']:[]),
  ...(tomtomConfigured?['tomtom_places']:[]),'uk_food_retailers'];
 if(!enabled)return {mode:'legacy',country:selected,providers:[],ukRetailAllowed:true,reason:'feature_disabled'};
 if(!selected)return {
  mode:'common_only',country:null,
  providers:allowed.filter(p=>p!=='uk_food_retailers'),
  ukRetailAllowed:false,reason:'country_unverified'
 };
 const routing=selectCountryProviders({category,country:selected,enabledProviders:allowed});
 return {
  mode:routing.status==='ready'?'country_scoped':'common_only',
  country:selected,providers:routing.providers,
  ukRetailAllowed:routing.providers.includes('uk_food_retailers'),
  reason:routing.status
 };
}
