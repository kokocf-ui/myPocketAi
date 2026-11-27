// Bound streamed responses before allocating/parsing them. Used for untrusted
// provider JSON and prepared static assets; no redirects or implicit retries.
export async function readTransportJson(response,maxBytes=2*1024*1024){
 if(!response.body)throw Error('invalid_response');
 const declared=Number(response.headers.get('content-length'));
 if(Number.isFinite(declared)&&declared>maxBytes){await response.body.cancel();throw Error('response_too_large');}
 const reader=response.body.getReader(),chunks=[];let bytes=0;
 try{
  while(true){const {done,value}=await reader.read();if(done)break;
   bytes+=value.byteLength;if(bytes>maxBytes){await reader.cancel();throw Error('response_too_large');}chunks.push(value);
  }
 }finally{reader.releaseLock();}
 const all=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.byteLength;}
 try{return JSON.parse(new TextDecoder().decode(all));}catch{throw Error('invalid_response');}
}
