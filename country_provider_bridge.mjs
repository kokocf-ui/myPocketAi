// Bridge between country registry and existing provider adapters.
// Intentionally not imported by backend.js until regression checks pass.
// The backend supplies already-configured adapters; no credentials here.
import {selectCountryProviders} from './smart_country_registry.mjs';
export async function dispatchCountrySources(request,{adapters={},enabledProviders=[],onDiagnostic=()=>{}}={}){
 const choice=selectCountryProviders({...request,enabledProviders});
 if(choice.status!=='ready')return {...choice,results:[]};
 const results=[];
 for(const provider of choice.providers){
   const invoke=adapters[provider];
   if(typeof invoke!=='function')continue;
   try{
     const rows=await invoke(request);
     if(Array.isArray(rows))results.push(...rows.map(row=>({...row,sourceProvider:provider})));
     onDiagnostic({provider,status:'ok',count:Array.isArray(rows)?rows.length:0});
   }catch(error){
     onDiagnostic({provider,status:'failed'});
   }
 }
 return {...choice,results};
}
