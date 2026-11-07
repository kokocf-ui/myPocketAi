import assert from "node:assert/strict";
import vm from "node:vm";
import frontend from "./index.js";

const html=await(await frontend.fetch(new Request("https://fixture/"))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source,"reader must exist in frontend script");
new vm.Script(source);

const from=source.indexOf("function attachNewsReaderBack(host,label,onBack){");
const to=source.indexOf("// Shared renderer. Backend decides",from);
assert.ok(from>=0&&to>from,"shared persistent back control found");
const document={createElement(tag){return {tag,type:"",className:"",textContent:"",style:{cssText:""},onclick:null}}};
const ctx={document};
vm.createContext(ctx);
vm.runInContext(source.slice(from,to),ctx);
const host={children:[],append(node){this.children.push(node)},scrollTop:163};
let calls=0;
const back=ctx.attachNewsReaderBack(host,"Înapoi la știri",()=>{calls++});
assert.equal(host.children[0],back,"back is the first child before article content");
assert.equal(back.tag,"button");assert.equal(back.type,"button");
assert.match(back.textContent,/Înapoi la știri/);
assert.match(back.style.cssText,/position:sticky/);
assert.match(back.style.cssText,/top:0/);
assert.match(back.style.cssText,/z-index:3/);
back.onclick();assert.equal(calls,1);

const paths=[
 ["adaptive news detail",/const showDetail=row=>\{\s*newsScrollPosition=host\.scrollTop;host\.replaceChildren\(\);host\.scrollTop=0;\s*attachNewsReaderBack\(host,labels\.back,[\s\S]{0,115}showTable/],
 ["structured news detail",/const renderDetail=item=>\{\s*newsScrollPosition=host\.scrollTop;host\.replaceChildren\(\);host\.scrollTop=0;\s*attachNewsReaderBack\(host,t\[4\],[\s\S]{0,115}renderList/]
];
for(const [name,pattern] of paths)assert.match(source,pattern,name+" uses persistent top navigation");
assert.doesNotMatch(source,/back\.type="button";back\.onclick=renderList;/,
 "old bottom-only news back button is removed");
assert.doesNotMatch(source,/back\.type="button";back\.onclick=showTable;/,
 "old bottom-only adaptive back button is removed");
assert.match(source,/host\.scrollTop=newsScrollPosition/,"return remembers previous list scroll position");
console.log("PASS fixed-position news back button and list scroll restoration for both presentation paths");
