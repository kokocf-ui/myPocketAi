import assert from 'node:assert/strict';
import vm from 'node:vm';
import {splitLiteraturePages} from './literature_reader_pagination.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {VERIFIED_LITERARY_AUTHORS} from './literature_verified_authors.mjs';

const paragraph='Citirea atentă începe cu observația textului și continuă cu argumente clare. ';
const long=Array(95).fill(paragraph).join('\n\n');
const pages=splitLiteraturePages(long,620);
assert.ok(pages.length>3,'Long lesson is split into multiple pages');
assert.ok(pages.every(p=>p.length<=620),'Every page is bounded');
assert.equal(splitLiteraturePages('Poezia mea\n\nPrima strofă\nVers doi').length,1,'Short poetry is kept together');
assert.deepEqual(splitLiteraturePages(''),[]);
new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'literature-reader-ui.js'});

class El{
 constructor(tag='div'){
  this.tagName=tag.toUpperCase();this.children=[];this._text='';this.value='';
  this.attrs={};this.style={};this.classList={add:()=>{}};this.hidden=false;this.isConnected=true;this.disabled=false;
 }
 get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('')}
 set textContent(value){this._text=String(value);this.children=[]}
 append(...nodes){this.children.push(...nodes)}
 insertBefore(child,reference){const i=this.children.indexOf(reference);this.children.splice(i<0?this.children.length:i,0,child)}
 replaceChildren(...nodes){this._text='';this.children=[...nodes]}
 setAttribute(name,value){this.attrs[name]=value}
 addEventListener(){}
 scrollIntoView(){}
 focus(){}
 showModal(){this.open=true}
 close(){this.open=false;this.remove()}
 remove(){this.isConnected=false}
 get lastElementChild(){return this.children.at(-1)}
}
const body=new El('body');
const document={body,createElement:tag=>new El(tag)};
const requests=[];
const cfg={document,learningLabel:(ro,en)=>ro,
 LIT_VERIFIED_AUTHORS:VERIFIED_LITERARY_AUTHORS,
 litJourney:{country:'HU',grade:'8',branch:'literature',topic:null},
 hgDisplayStudyText:(el,value)=>{el.textContent=value},
 eduOpenPrint:(mode,material)=>requests.push({mode,material}),
 fetch:async()=>{throw Error('No network needed for curated exact-title lookup')},
};
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+
 '\n({literature:litSimpleLiterature,reader:litShowMaterialReader})',cfg);
const all=node=>[node,...node.children.flatMap(all)];
const button=(node,label)=>all(node).find(x=>x.tagName==='BUTTON'&&x.textContent===label);
const panel=new El('main');
ui.literature(panel);
const search=all(panel).find(x=>x.tagName==='INPUT');
assert.ok(search,'Study search input exists');
assert.ok(panel.textContent.includes('János vitéz'),'Country works appear immediately');
search.value='János vitéz';button(panel,'Caută autorul / opera').onclick();
await Promise.resolve();
assert.ok(panel.textContent.includes('János vitéz — Petőfi Sándor'),'Exact title opens correct work');
assert.equal(all(panel).filter(x=>x.tagName==='BUTTON'&&x.textContent==='János vitéz — Petőfi Sándor').length,0,
 'The selected work is shown once, not as a related-result list');
assert.ok(button(panel,'Studiază')&&button(panel,'Rezumat')&&button(panel,'Eseu'),
 'One work exposes targeted operations');
assert.ok(button(panel,'Textul integral sau capitolele'),'Unavailable text is marked, not invented');

search.value='Petőfi Sándor';button(panel,'Caută autorul / opera').onclick();
await Promise.resolve();
assert.ok(button(panel,'János vitéz — Petőfi Sándor'),'Author query lists their work');
assert.ok(button(panel,'Az apostol — Petőfi Sándor'),'Author query preserves other work');

// The external catalogue must prefer an original work over same-title
// commentaries when its work-level edition evidence is unambiguous.
let remoteCalls=0;
const remoteCfg={...cfg,fetch:async url=>{
 remoteCalls++;
 assert.match(String(url),/search\.json\?title=Hamlet/);
 return {ok:true,json:async()=>({docs:[
  {key:'/works/OL10W',title:'Hamlet',author_name:['William Shakespeare'],edition_count:230,first_publish_year:1603},
  {key:'/works/OL11W',title:'Hamlet',author_name:['Critical Editor'],edition_count:2,first_publish_year:2018},
  {key:'/works/OL12W',title:'Hamlet: Critical Studies',author_name:['Another Writer'],edition_count:5}
 ]})};
}};
const remoteUI=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+
 '\n({literature:litSimpleLiterature})',remoteCfg);
const remotePanel=new El('main');remoteUI.literature(remotePanel);
const remoteSearch=all(remotePanel).find(x=>x.tagName==='INPUT');
remoteSearch.value='Hamlet';
button(remotePanel,'Caută autorul / opera').onclick();
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(remoteCalls,1,'Exact title uses one work-level metadata call');
assert.ok(remotePanel.textContent.includes('Hamlet — William Shakespeare'),'Original work wins');
assert.ok(!remotePanel.textContent.includes('Critical Editor'),'Critic is not listed as original work');

// A work with a rights-verified complete poem is readable without AI calls.
search.value='Nemzetőr-dal';button(panel,'Caută autorul / opera').onclick();
await Promise.resolve();
assert.ok(button(panel,'Citește opera integral'),'Public-domain poem can be read in full');
assert.ok(button(panel,'Poezia integrală'),'Poetry contents are navigable');
button(panel,'Poezia integrală').onclick();
const poemReader=body.children.filter(x=>x.className==='lit-reader-overlay'&&x.isConnected).at(-1);
assert.ok(poemReader.textContent.includes('Süvegemen nemzetiszín rózsa,'));
// The last verse may be on a later reader page; navigate to the end.
const poemNav=all(poemReader).find(x=>x.tagName==='NAV');
let verseTurns=0;
while(poemNav&& !poemNav.children[2].disabled&&verseTurns++<20)poemNav.children[2].onclick();
assert.ok(poemReader.textContent.includes('Talpon állok mindhalálig víni.'));
button(poemReader,'Înapoi').onclick();

const readerTitle='Teorie: gramatică';
ui.reader(readerTitle,long);
const overlay=body.children.at(-1);
assert.equal(overlay.className,'lit-reader-overlay');
const dialog=overlay.children[0];
assert.equal(dialog.tagName,'SECTION');
assert.equal(dialog.attrs.role,'dialog');
assert.equal(dialog.attrs['aria-modal'],'true');
assert.equal(overlay.children.length,1,'Reader is in its own high stacking layer');
assert.ok(overlay.style.cssText.includes('z-index:2147483000'),'Reader frame is visible even without injected CSS');
const navs=all(dialog).filter(x=>x.tagName==='NAV');
assert.equal(navs.length,2,'Page navigation is mirrored at top and bottom');
assert.equal(navs[0].children[1].textContent,navs[1].children[1].textContent,
 'Counters are synchronized on both controls');
const firstCounter=navs[0].children[1].textContent;
assert.match(firstCounter,/Pagina 1 din /);
assert.equal(navs[0].children[0].disabled,true,'First page has no previous');
navs[1].children[2].onclick();
assert.match(navs[0].children[1].textContent,/Pagina 2 din /);
assert.equal(navs[0].children[1].textContent,navs[1].children[1].textContent);
navs[0].children[0].onclick();
assert.equal(navs[0].children[1].textContent,firstCounter);
button(dialog,'💾 Salvează PDF').onclick();
assert.equal(requests[0].mode,'save');
assert.equal(requests[0].material.text,long.trim(),'PDF uses complete theory, not just the displayed page');

console.log('PASS: exact title opens one work; author lists works; two pagers; full PDF material');
