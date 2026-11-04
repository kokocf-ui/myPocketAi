// A single safe presentation contract for all Pocket AI responses.
// This module never generates facts, HTML or arbitrary CSS.
// Sources, routes and dates remain controlled by upstream evidence providers.
export const PRESENTATION_VERSION=1;
const MAX_ROWS=40,MAX_BLOCKS=12;
const text=(v,max=700)=>String(v??"").trim().slice(0,max);
const cleanCell=v=>typeof v==="string"||typeof v==="number"||typeof v==="boolean"?text(v,400):"";
const titleFor=(key)=>String(key).replace(/_/g," ").replace(/\b[a-z]/g,m=>m.toUpperCase()).slice(0,42);
const unsafeKeys=new Set(["url","uri","href","link","id","provider","providers","source_domain","original_title","translation_status","verification","corroborating_source_count","recency_status","source_url"]);
function validUrl(value){try{const x=new URL(String(value));return x.protocol==="https:"&&!x.username&&!x.password?x.href:null}catch{return null}}
function rowsFromStructured(structured){
 const source=Array.isArray(structured?.rows)?structured.rows:[];
 if(!source.length)return null;
 const rows=source.filter(x=>x&&typeof x==="object"&&!Array.isArray(x)).slice(0,MAX_ROWS);
 if(!rows.length)return null;
 // Shared column inference: prefer meaningful, populated visible fields,
 // excluding transport identifiers, source URLs and other machine metadata.
 const keys=[...new Set(rows.flatMap(row=>Object.keys(row)))].filter(k=>!unsafeKeys.has(k)&&!k.startsWith("_"));
 const scored=keys.map(k=>({key:k,score:rows.reduce((n,r)=>n+(cleanCell(r[k]).length>0?1:0),0)}))
   .filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 const preferred=["title","name","description","summary","date","time","source_name","published_at","location","distance","duration","price","status"];
 const ordered=[...preferred.filter(k=>scored.some(x=>x.key===k)),...scored.map(x=>x.key).filter(k=>!preferred.includes(k))].slice(0,4);
 if(!ordered.length)return null;
 const columns=ordered.map(k=>({key:k,label:titleFor(k)}));
 const safeRows=rows.map((r,i)=>({
   index:i,
   cells:Object.fromEntries(ordered.map(k=>[k,cleanCell(r[k])])),
   ...(validUrl(r.url||r.source_url)?{source_url:validUrl(r.url||r.source_url)}:{})
 }));
 return {kind:"table",columns,rows:safeRows,interactive:true};
}
function splitReply(reply){
 const str=text(reply,12000);
 if(!str)return [];
 return str.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean).slice(0,MAX_BLOCKS);
}
export function planPresentation(payload){
 const language=text(payload?.language||"en",5);
 const source=payload?.structured_list;
 const reply=typeof payload?.reply==="string"?payload.reply:"";
 const blocks=[];
 const structured=rowsFromStructured(source);
 if(structured){
   blocks.push(structured);
 }else{
   const paras=splitReply(reply);
   const lines=reply.split(/\n/).map(x=>x.trim()).filter(Boolean);
   const numbered=lines.length>=3&&lines.filter(x=>/^(?:\d+[.)]|[-*•])\s+/.test(x)).length/lines.length>=.65;
   if(numbered)blocks.push({kind:"list",items:lines.slice(0,35).map(x=>x.replace(/^(?:\d+[.)]|[-*•])\s+/,"").slice(0,700))});
   else blocks.push({kind:"text",paragraphs:paras.length?paras:[text(reply,12000)]});
 }
 return {
   version:PRESENTATION_VERSION,language,
   layout:structured?"collection":blocks[0]?.kind==="list"?"list":"prose",
   blocks:blocks.slice(0,MAX_BLOCKS),
   source_type:text(source?.type||"general",50),
   generated_from:"validated_response",
   // This describes presentation, not the factual reliability of content.
   source_verification:source?.verification||"not_independently_verified"
 };
}
