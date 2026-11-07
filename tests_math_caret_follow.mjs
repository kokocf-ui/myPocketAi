import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math-editor-scroll.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'math frontend exists');
new vm.Script(script);
const start=script.indexOf('function mathEditorFollowCaret(');
const end=script.indexOf('function mathEditorScheduleCaretFollow(',start);
assert.ok(start>0&&end>start,'bounded caret follower exists');
const source=script.slice(start,end)+'\nmathEditorFollowCaret';
function scenario({caretY,scroll=0,height=64,rectBottom=300,viewportHeight=500,keyboard=true,focused=true}){
 const editor={isConnected:true,selectionStart:24,value:'first line\nmore text\nnew text',clientWidth:290,
  scrollTop:scroll,clientHeight:height,getBoundingClientRect:()=>({top:rectBottom-height,bottom:rectBottom})};
 const marker={offsetTop:caretY,style:{},textContent:''};
 const mirror={style:{},append:()=>{},remove:()=>{}};
 let nodes=0;
 const page={scrollTop:0,classList:{contains:key=>key==='math-keyboard-visible'&&keyboard}};
 const document={activeElement:focused?editor:null,
  createElement:()=>++nodes===1?mirror:marker,createTextNode:text=>({text}),
  body:{append:()=>{}},querySelector:selector=>selector==='main.page'?page:null};
 const style={padding:'8px',paddingBottom:'8px',font:'16px sans-serif',fontFamily:'sans-serif',
  fontSize:'16px',fontWeight:'400',fontStyle:'normal',letterSpacing:'normal',
  lineHeight:'20px',wordBreak:'break-word',tabSize:'4'};
 const follow=vm.runInNewContext(source,{document,window:{getComputedStyle:()=>style,
  innerHeight:620,visualViewport:{offsetTop:0,height:viewportHeight}},Number,Object,Math});
 follow(editor);
 return {editor,page,nodes};
}
let v=scenario({caretY:188,height:68});
assert.ok(v.editor.scrollTop>100,'typing below textarea must bring latest line into view');
v=scenario({caretY:20,scroll:150,height:68});
assert.ok(v.editor.scrollTop<40,'moving caret upwards must reveal selected line');
v=scenario({caretY:95,scroll:70,height:68});
assert.equal(v.editor.scrollTop,70,'already visible line must not jump');
v=scenario({caretY:40,rectBottom:470,viewportHeight:380,height:100});
assert.ok(v.page.scrollTop>=90,'active field hidden by Android keyboard should move page');
v=scenario({caretY:40,rectBottom:470,viewportHeight:380,height:100,keyboard:false});
assert.equal(v.page.scrollTop,0,'no page movement without keyboard mode');
v=scenario({caretY:188,focused:false});
assert.equal(v.editor.scrollTop,0,'unfocused editor must not scroll');
assert.match(script,/editor\.addEventListener\('input',\(\)=>\{mathRememberDraft\(editor\.value\);status\.textContent='';mathEditorScheduleCaretFollow\(editor\)\}\)/);
assert.match(script,/\['focus','click','keyup','select','compositionend'\]/);
assert.match(script,/viewport\?viewport\.offsetTop\+viewport\.height:window\.innerHeight/);
assert.match(html,/scroll-padding-block:1lh!important/);
console.log('PASS mathematics editor: caret line follows typing, selection, wrapping and keyboard resize without page jumps');
