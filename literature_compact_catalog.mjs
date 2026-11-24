// Encode repeated curriculum string values once without changing any values,
// keys or array order. A small synchronous decoder keeps the Android offline
// HTML self-contained and avoids changing network/cache behavior. This is not
// curriculum-pack decoupling: future year-specific packs are still needed.
export function serializeCompactLiteratureCatalog(value){
 const data=JSON.parse(JSON.stringify(value));
 const frequency=new Map();
 function visit(item){
  if(typeof item==='string')frequency.set(item,(frequency.get(item)||0)+1);
  else if(item&&typeof item==='object')for(const child of Object.values(item))visit(child);
 }
 visit(data);
 const marker='§';
 const entries=[...frequency.entries()].filter(([text,count])=>text.startsWith(marker)||(text.length>=10&&count>=2));
 entries.sort((a,b)=>((b[1]-1)*b[0].length)-((a[1]-1)*a[0].length)||(a[0]<b[0]?-1:a[0]>b[0]?1:0));
 const pool=entries.map(([text])=>text);
 const lookup=new Map(pool.map((text,index)=>[text,index.toString(36)]));
 function encode(item){
  if(typeof item==='string')return lookup.has(item)?marker+lookup.get(item):item;
  if(Array.isArray(item))return item.map(encode);
  if(item&&typeof item==='object')return Object.fromEntries(Object.entries(item).map(([key,child])=>[key,encode(child)]));
  return item;
 }
 // Protect the surrounding inline <script> even if curriculum text includes
 // the literal closing-tag sequence in a future update.
 const safe=x=>JSON.stringify(x).replace(/</g,'\\u003c');
 // JSON.parse preserves an own "__proto__" key, unlike a JavaScript object
 // literal. The extra string layer is escaped for the surrounding script.
 return '((p,v)=>{const d=x=>typeof x==="string"&&x.startsWith("§")?p[parseInt(x.slice(1),36)]:Array.isArray(x)?x.map(d):x&&typeof x==="object"?Object.fromEntries(Object.entries(x).map(([k,y])=>[k,d(y)])):x;return d(v)})('+safe(pool)+',JSON.parse('+safe(JSON.stringify(encode(data)))+'))';
}
