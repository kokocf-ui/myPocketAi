import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script exists');
new vm.Script(script);
const a=script.indexOf('function mathPhotoCandidates(');
const b=script.indexOf('// Educational mathematics: reject obvious OCR fragments',a);
assert.ok(a>0&&b>a);
const parse=vm.runInNewContext(script.slice(a,b)+'\nmathPhotoCandidates');
const noisy=[
'EXERCITII REZOLVATE:',
'EX. 1) Efectuati:',
'a) 9X - 3X + 4 X = 6X + 4X = oX 2',
'b) 2x - 3X + 5X = -X + 5X = 4x',
'EX. 2) Reduceti termenii asemenea:',
'a) 6X + 3y - 5Z - 5X + 7y - 3Z =',
'6X -5X +34 +14 -5Z -3Z =',
'profesorjitaruionel.com'
].join('\n');
const candidates=parse(noisy);
assert.equal(candidates.length,3,'find exercise starts only');
assert.equal(candidates[0].text,'9X - 3X + 4 X','strip worked results');
assert.equal(candidates[2].text,'6X + 3y - 5Z - 5X + 7y - 3Z');
assert.ok(!candidates.some(x=>x.text.includes('profesor')));
assert.ok(script.includes('mathPhotoNeedsReview=true;'));
assert.ok(script.includes('if(mathPhotoNeedsReview){'));
assert.ok(script.includes('mathPhotoNeedsReview=false;mathRememberDraft(candidate);'));
assert.ok(script.includes("dialog.className='math-photo-review-dialog'"));
assert.ok(script.includes('dialog.showModal()'));
assert.ok(script.includes('overflow-y:auto;overscroll-behavior:contain'));
assert.ok(script.includes('footer.append(confirmation)'));
assert.ok(script.includes('editor.value=candidate;'));
assert.ok(!script.includes("if(text){editor.value=text;mathRememberDraft(text)}"),'never auto-copy photo page into solve editor');

const primary=['a) 9x - 3x + 4x','b) 2x2 - 3x2 + 5x2','c) 2V5xy + 9V5xy - 10V5xy'].join('\n');
const secondary=['a) 9x - 3x + 4x','b) 2x² - 3x² + 5x²','d) 9abc - 13abc'].join('\n');
const merged=parse(primary,secondary);
assert.equal(merged.map(x=>x.label.slice(0,2)).join(','),'a),b),c),d)','merge missing subpoint from alternate OCR pass');
assert.equal(merged[1].text,'2x2 - 3x2 + 5x2','do not silently substitute a conflicting alternate formula');
const many=Array.from({length:15},(_,i)=>String.fromCharCode(97+i)+') '+(i+2)+'x + 3').join('\n');
assert.equal(parse(many).length,15,'no three- or twelve-row list truncation');
assert.ok(script.includes('mathPhotoCandidates(text,data?.alternative)'),'pass enhanced OCR reading to candidate selection');
const seven=[
 'Exercițiul 1 — Reduceți termenii asemenea:',
 'a) 9x - 3x + 4x =',
 'b) 2x² - 3x² + 5x² =',
 'c) 2√5xy + 9√5xy - 10√5xy =',
 'd)',
 '9abc - 13abc =',
 'Exercițiul 2 — Reduceți termenii asemenea:',
 'a) 6x + 3y - 5z - 5x + 7y - 3z =',
 'b) 12x - 8 + 13 - 11x + 9 + 5x =',
 'c) 14x² - x + 4x² - 10x - 19x² + 12x ='
].join('\n');
const sevenCandidates=parse(seven);
assert.equal(sevenCandidates.length,7,'all 7 subpoints, including reused labels, are detected');
assert.equal(sevenCandidates[3].text,'9abc - 13abc','detect label on separate line');
assert.match(sevenCandidates[0].label,/Ex\. 1/);
assert.match(sevenCandidates[6].label,/Ex\. 2/);
const twoPasses=parse(
 'Exercițiul 1\n a) 9x - 3x + 4x\n b) 2x² - 3x² + 5x²\n c) 2√5xy + 9√5xy - 10√5xy',
 'Exercițiul 1\n d)\n 9abc - 13abc\n Exercițiul 2\n a) 6x + 3y - 5z - 5x + 7y - 3z');
assert.equal(twoPasses.length,5,'recover d and second-section a from alternate reading');
assert.ok(script.includes('const countNote=document.createElement('),'render OCR candidate recovery counts');


const repeatedWithoutSection=[
 'a) 9x − 3x + 4x',
 'Exercițiul 1 — Reduceți termenii asemenea:',
 'a) 9x - 3x + 4x',
 'b) 2x² - 3x² + 5x²',
 'Exercițiul 2 — Reduceți termenii asemenea:',
 'a) 6x + 3y - 5z - 5x + 7y - 3z'
].join('\n');
const deduplicated=parse(repeatedWithoutSection);
assert.equal(deduplicated.length,3,'same formula and subpoint with a lost section heading is deduplicated');
assert.match(deduplicated[2].label,/Ex\. 2/,'different exercise section is preserved');
const repeatedActual=[
 'Exercițiul 1',
 'a) 3x + 3x',
 'Exercițiul 2',
 'a) 3x + 3x'
].join('\n');
assert.equal(parse(repeatedActual).length,2,'identical exercises in distinct known sections remain distinct');
assert.ok(script.includes("search.type='search'"),'filter control is visible inside review modal');
assert.ok(script.includes("choices.style.cssText="),'inline scrollable OCR list replaces native select');
assert.ok(script.includes("max-height:min(31dvh,232px)"),'list height is bounded to four rows on mobile');
assert.ok(script.includes('if(mathPhotoOcrRisk(candidate))'),'photo OCR ambiguity must block confirmation');
assert.ok(script.includes('selectedCandidateIndex=i;'),'track the currently selected OCR candidate');
assert.ok(!script.includes("const selection=document.createElement('select');selection.className='text-field';"),
 'do not use Android popup that hides all but three choices');


const falseCrop=parse('Exercițiul 2\nl) (46');
assert.equal(falseCrop.length,0,'reject unbalanced OCR fragments such as l) (46');
const crossCrop=parse(
 'Exercițiul 1\nd) 9abc - 13abc',
 'Exercițiul 2\nd) 9abC - 13abC');
assert.equal(crossCrop.length,1,'do not duplicate exactly the same d) after a wrongly detected crop section');
const ordered=parse('Exercițiul 1\nd) 9abc - 13abc\nb) 2x²-3x²+5x²\nc) 2√5xy+9√5xy-10√5xy\na) 9x-3x+4x');
assert.equal(ordered.map(x=>x.letter).join(''),'abcd','present OCR candidates in natural textbook order');

const selectionBegin=script.indexOf('  let selectedCandidateIndex=-1;');
const selectionEnd=script.indexOf('  content.append(candidateInput);',selectionBegin);
assert.ok(selectionBegin>0&&selectionEnd>selectionBegin,'candidate selection UI exists');
const uiSource=script.slice(selectionBegin,selectionEnd);
assert.ok(!uiSource.includes('button.onclick=()=>{'),'do not rebuild the list from a tap handler');
assert.ok(uiSource.includes('button.onclick=()=>selectCandidate(i)'),'selection uses stable nodes');

class FakeEl {
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.dataset={};this.attrs={};this.listeners={};this.value='';this.scrollTop=0;this.textContent='';}
 setAttribute(name,val){this.attrs[name]=val;}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=[...items];}
 addEventListener(name,fn){this.listeners[name]=fn;}
 querySelectorAll(selector){return selector==='button[data-math-photo-index]'?this.children.filter(x=>x.tag==='button'&&x.dataset.mathPhotoIndex!==undefined):[];}
}
const content=new FakeEl('div');
const candidateInput=new FakeEl('textarea');
const feedback=new FakeEl('small');
const document={createElement:tag=>new FakeEl(tag)};
const uiCandidates=[
 {label:'Ex. 1 · a) 9x - 3x + 4x',text:'9x - 3x + 4x'},
 {label:'Ex. 1 · b) 2x2 - 3x2 + 5x2',text:'2x2 - 3x2 + 5x2'},
 {label:'Ex. 1 · c) 2V5xy + 9V5xy - 10V5xy',text:'2V5xy + 9V5xy - 10V5xy'},
 {label:'Ex. 1 · d) 9abc - 13abc',text:'9abc - 13abc'},
 {label:'Ex. 2 · a) 6x + 3y - 5z',text:'6x + 3y - 5z'}
];
vm.runInNewContext(uiSource,{document,content,candidateInput,feedback,candidates:uiCandidates,mathPhotoOcrRisk:()=>false,learningLabel:(ro)=>ro});
const choices=content.children.find(x=>x.attrs.role==='group');
const status=content.children.find(x=>x.attrs['aria-live']==='polite');
assert.ok(choices&&status,'selection feedback is visible and accessible');
choices.scrollTop=100;
const first=choices.children[0];
first.onclick();
assert.equal(candidateInput.value,uiCandidates[0].text,'first exercise can be selected');
assert.equal(choices.children[0],first,'tap must not replace the button being touched');
assert.equal(choices.scrollTop,100,'selection preserves scroll position');
assert.equal(first.attrs['aria-pressed'],'true','selected button gets active state');
choices.children[2].onclick();
assert.equal(candidateInput.value,uiCandidates[2].text,'middle exercise can be selected');
assert.equal(choices.children[2].attrs['aria-pressed'],'true');
assert.equal(first.attrs['aria-pressed'],'false');
choices.children[4].onclick();
assert.equal(candidateInput.value,uiCandidates[4].text,'last exercise can be selected');
assert.match(status.textContent,/Ex\. 2/,'visible selection status follows chosen row');

console.log('PASS photo OCR requires single exercise review and rejects entire-page auto-solving');
