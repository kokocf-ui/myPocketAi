// Bounded references to previously displayed news; not independent evidence.
const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const ordinals={"prima":0,"primul":0,"first":0,"a doua":1,"al doilea":1,"second":1,"a treia":2,"al treilea":2,"third":2,"a patra":3,"al patrulea":3,"fourth":3,"a cincea":4,"al cincilea":4,"fifth":4};
const ordinal=/\b(?:prima|primul|first|a doua|al doilea|second|a treia|al treilea|third|a patra|al patrulea|fourth|a cincea|al cincilea|fifth)\b/;
const safeUrl=value=>{try{const u=new URL(value);if(u.protocol!=="https:"||u.username||u.password||!u.hostname||u.hostname==="localhost"||u.hostname.endsWith(".local")||u.hostname.endsWith(".internal"))return null;return u.href;}catch{return null}};
export function sanitizeNewsContext(raw){
 if(!raw||typeof raw!=="object"||raw.type!=="news"||!Array.isArray(raw.rows))return null;
 const rows=raw.rows.slice(0,12).map(v=>{
  if(!v||typeof v!=="object")return null;
  const url=safeUrl(v.url),title=String(v.title||"").slice(0,240).trim();
  return url&&title?{title,url,source_name:String(v.source_name||new URL(url).hostname).slice(0,90),published_at:String(v.published_at||"").slice(0,40),summary:String(v.summary||"").slice(0,500),verification:"source_identified_claims_unverified"}:null;
 }).filter(Boolean);
 return rows.length?{type:"news",rows,selected_index:Number.isInteger(raw.selected_index)&&raw.selected_index>=0&&raw.selected_index<rows.length?raw.selected_index:null}:null;
}
export function resolveNewsFollowup(message,rawContext,history=[]){
 const data=sanitizeNewsContext(rawContext),q=norm(message);
 if(!data||!q||q.length>210)return null;
 const sources=/\b(?:surs\w*|source\w*|link\w*|referint\w*|reference\w*|de unde|original\w*|publisher\w*|publicati\w*|publicat\w*)\b/.test(q);
 const status=/\b(?:confirmat\w*|neclar\w*|verificat\w*|neconfirmat\w*|sigur|incert\w*|adevarat|verified|unverified|confirmed|unclear|uncertain|fact.check)\b/.test(q);
 if(!sources&&!status)return null;
 let index=null,match=q.match(ordinal);
 if(match)index=ordinals[match[0]];
 if(index===null){
  const number=q.match(/\b(?:stirea|articolul|news item|article)\s*(?:nr\.?\s*)?([1-9]|1[0-2])\b/);
  if(number)index=Number(number[1])-1;
 }
 if(index===null){
  const users=(Array.isArray(history)?history:[]).filter(v=>v?.role==="user").map(v=>norm(v.content)).filter(Boolean);
  if(users.at(-1)===q)users.pop();
  for(const previous of users.slice(-4).reverse()){
   const found=previous.match(ordinal);
   if(found&&/\b(?:stir\w*|articol\w*|news|article)\b/.test(previous)){index=ordinals[found[0]];break}
  }
 }
 if(index===null)index=data.selected_index??0;
 return {kind:status?"verification":"sources",index,article:data.rows[index]||null};
}
export function formatNewsFollowup(result,lang="ro"){
 if(!result)return null;
 const ro=lang!=="en";
 if(!result.article)return ro?"Articolul indicat nu mai apare în lista curentă; selectează un articol din tabel.":"The requested article is not in the current list. Please select one.";
 const a=result.article,i=result.index+1;
 if(result.kind==="sources")return ro?
 "Pentru știrea "+i+" („"+a.title+"”), sursa identificată este "+a.source_name+": "+a.url+". Acesta este articolul original, nu o confirmare independentă a afirmațiilor.":
 "For news item "+i+" (“"+a.title+"”), the identified source is "+a.source_name+": "+a.url+". This is the original article, not independent corroboration.";
 return ro?
 "Pentru știrea "+i+" („"+a.title+"”), este identificat articolul publicat de "+a.source_name+": "+a.url+". Afirmațiile și data evenimentului nu au fost verificate independent în această conversație; nu le pot prezenta drept confirmate fără surse suplimentare.":
 "For news item "+i+" (“"+a.title+"”), the original article is identified at "+a.source_name+": "+a.url+". Its claims and the event date have not been independently checked in this conversation; they are not confirmed.";
}
export function publicationDayWindow(message,localDay){
 const q=norm(message);
 if(!/\b(?:ieri|yesterday)\b/.test(q)||!/\b(?:stir\w*|news|eveniment\w*|event\w*|happened|intampl\w*)\b/.test(q))return null;
 const today=/^\d{4}-\d{2}-\d{2}$/.test(String(localDay||""))?String(localDay):new Date().toISOString().slice(0,10);
 const ms=Date.parse(today+"T00:00:00Z");if(!Number.isFinite(ms))return null;
 return {kind:"yesterday_publication",day:new Date(ms-86400000).toISOString().slice(0,10)};
}
export function isWithinPublicationDay(value,window){
 if(!window)return true;
 const original=String(value||"");
 const normalized=/^\d{8}T\d{6}Z$/.test(original)?original.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,"$1-$2-$3T$4:$5:$6Z"):original;
 const parsed=Date.parse(normalized);return Number.isFinite(parsed)&&new Date(parsed).toISOString().slice(0,10)===window.day;
}
