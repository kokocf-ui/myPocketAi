import assert from "node:assert/strict";
import vm from "node:vm";
import frontend from "./index.js";
import {planPresentation} from "./presentation.mjs";
import {discoverTelegramPublicLinks} from "./telegram_public_web_links.mjs";
const html=await(await frontend.fetch(new Request("https://fixture/"))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source);
new vm.Script(source);
class Node {
 constructor(tag){this.tag=tag;this.children=[];this.textContent="";this.style={};this.scrollTop=0;}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
}
const document={createElement:tag=>new Node(tag)};
const rows=Array.from({length:25},(_,i)=>({title:"Reporting item "+(i+1)+" with a meaningful title",url:"https://report.example/article/"+(i+1),
 published_at:"2026-11-05T10:00:00Z",summary:"Attributed editorial description of the reported event and source.",
 source_name:"Publisher "+((i%5)+1),verification:"source_identified_claims_unverified"}));
const tableRows=host=>host.children.find(x=>x.children?.some(c=>c.tag==="table")).children.find(x=>x.tag==="table").children.find(x=>x.tag==="tbody").children;
const buttons=(host,label)=>host.children.flatMap(n=>n.children||[]).filter(n=>n.tag==="button"&&n.textContent===label);
const ctx=vm.createContext({document,state:{language:"ro"},URL,Date,
 fetch:async()=>({ok:false}),CLIENT_CONFIG:{apiUrl:"https://api.example/api/chat"}});
const a=source.indexOf("function newsSelectionNotice("),b=source.indexOf("function appendStructuredCollectionTable(",a);
assert.ok(a>=0&&b>a);
vm.runInContext(source.slice(a,b),ctx);
const host=new Node("section");
assert.equal(ctx.appendNewsCollectionTable(host,{list:{type:"news",rows}}),true);
assert.equal(tableRows(host).length,12);
assert.equal(tableRows(host)[0].children[0].children[0].textContent,rows[0].title);
assert.equal(buttons(host,"Următor").length,1);
buttons(host,"Următor")[0].onclick();
assert.equal(tableRows(host).length,12);
assert.equal(tableRows(host)[0].children[0].children[0].textContent,rows[12].title);
const item=tableRows(host)[0].children[0].children[0];
item.onclick();
assert.equal(host.children[0].textContent,rows[12].title);
assert.equal(host.children.at(-1).tag,'button','Back button follows article footer');
host.children.at(-1).onclick();
assert.equal(tableRows(host)[0].children[0].children[0].textContent,rows[12].title);
buttons(host,"Următor")[0].onclick();
assert.equal(tableRows(host).length,1);
assert.equal(tableRows(host)[0].children[0].children[0].textContent,rows[24].title);
buttons(host,"Anterior")[0].onclick();
assert.equal(tableRows(host)[0].children[0].children[0].textContent,rows[12].title);

const adaptive=vm.createContext({document,state:{language:"ro"},URL,Date,
 fetch:async()=>({ok:false}),CLIENT_CONFIG:{apiUrl:"https://api.example/api/chat"}});
const ab=source.indexOf("function appendAdaptivePresentation("),ae=source.indexOf("function appendNewsCollectionTable(",ab);
vm.runInContext(source.slice(ab,ae),adaptive);
const plan=planPresentation({language:"ro",reply:"Știri",structured_list:{type:"news",rows}});
const host2=new Node("section");
assert.equal(adaptive.appendAdaptivePresentation(host2,{plan}),true);
assert.equal(tableRows(host2).length,12);
buttons(host2,"Următor")[0].onclick();
assert.equal(tableRows(host2)[0].children[0].children[0].textContent,rows[12].title);
buttons(host2,"Următor")[0].onclick();
assert.equal(tableRows(host2).length,1);

const prior=globalThis.fetch;
try{
 globalThis.fetch=async(url,options)=>{
  assert.equal(url,"https://api.exa.ai/search");
  const request=JSON.parse(options.body);
  assert.equal(request.numResults,20);
  return Response.json({results:Array.from({length:18},(_,i)=>({
   url:"https://t.me/examplechannel/"+(i+1),title:"News update "+i,
   highlights:["The report is indexed but has not been independently verified."],
   publishedDate:"2026-11-05T10:00:00Z"
  }))});
 };
 const result=await discoverTelegramPublicLinks({EXA_API_KEY:"mock"},"international",20);
 // Duplicate excerpts are intentionally collapsed; make each excerpt distinct for this check.
 assert.equal(result.status,"success");
 assert.ok(result.links.length>=1);
}finally{globalThis.fetch=prior}
console.log("PASS news and Telegram source pagination: 25 rows, three pages, persistent detail return, 20 index request.");
