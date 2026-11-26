// Bound optional enrichment, including providers that ignore AbortSignal.
// Never start new work after cancellation; real adapters receive the signal too.
export async function beforeTransitAbort(work,signal,fallback,onError=fallback){
 if(signal.aborted)return fallback;
 let cancel;
 const stopped=new Promise(resolve=>{
  cancel=()=>resolve(fallback);signal.addEventListener('abort',cancel,{once:true});
 });
 try{return await Promise.race([
  Promise.resolve().then(()=>signal.aborted?fallback:work()),stopped
 ]);}catch{return onError;}
 finally{signal.removeEventListener('abort',cancel);}
}
