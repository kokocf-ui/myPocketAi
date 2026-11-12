import assert from 'node:assert/strict';
import vm from 'node:vm';
import {parseStudyBlocks,renderStudyBlocks,STUDY_TYPOGRAPHY_CSS} from './literature_study_typography.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {COMMUNICATION_STYLE,COMMUNICATION_SCRIPT} from './communication_ui.mjs';
import {NAV_RETURN_ACCENT_CSS,NAV_RETURN_ACCENT_SCRIPT} from './navigation_return_accent.mjs';

const material=[
 'Lecție: Ascultare, conversație și exprimare',
 'Introducere','----------',
 'În cadrul acestei lecții învățăm să comunicăm clar.',
 '',
 'Definiții','==========',
 '• Ascultarea: atenția acordată interlocutorului.',
 '',
 '• Conversația: schimb de idei.',
 '• Exprimarea: transmiterea gândurilor.',
 '',
 'Exerciții','----------',
 '1. Prezintă o situație concretă.',
 '2. Descrie comunicarea.',
 '3. Compară variantele.'
].join('\n');
const blocks=parseStudyBlocks(material);
assert.ok(blocks.some(b=>b.type==='heading'&&b.text==='Definiții'),'Definitions are headings');
assert.ok(blocks.filter(b=>b.type==='rule').length>=2,'Typed dashes and equals become rules');
assert.ok(!blocks.some(b=>b.text==='----------'||b.text==='=========='),'No typed separators remain');
assert.deepEqual(blocks.filter(b=>b.type==='item').map(b=>b.marker),
 ['a.','b.','c.','1.','2.','3.'],'Bold alphabetical options and numbered exercises');
assert.ok(parseStudyBlocks('a. Primul\nb. Al doilea').every(b=>b.type==='item'),'Explicit a. b. options preserved');
assert.ok(STUDY_TYPOGRAPHY_CSS.includes('.lit-study-marker{font-weight:900')&&
 STUDY_TYPOGRAPHY_CSS.includes('color:#91ddeb'),'Numbering bold and headings colored');
assert.ok(STUDY_TYPOGRAPHY_CSS.includes('.lit-study-document'),'Typography is scoped to study materials');

class Element {
 constructor(tag='div',label=''){this.tagName=tag.toUpperCase();this.nodeType=1;this.children=[];this._text=label;this.className='';this.attrs={};this.classes=new Set();this.classList={add:x=>this.classes.add(x),toggle:(x,on)=>{if(on)this.classes.add(x);else this.classes.delete(x)}};}
 get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('')}
 set textContent(v){this._text=String(v);this.children=[]}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes;this._text=''}
 getAttribute(k){return this.attrs[k]||null}
 setAttribute(k,v){this.attrs[k]=v}
 matches(s){return s==='[data-nav]'&&Boolean(this.attrs['data-nav'])}
 closest(s){return s==='.bottom-nav'&&this.bottomNav?{}:null}
 querySelectorAll(s){return s==='button'?this.children.flatMap(x=>x.tagName==='BUTTON'?[x]:x.querySelectorAll(s)):[]}
}
const dom={createElement:tag=>new Element(tag)};
const target=new Element();
vm.runInNewContext('const parseStudyBlocks='+parseStudyBlocks.toString()+';'+
 'const renderStudyBlocks='+renderStudyBlocks.toString()+';renderStudyBlocks(target,material);',{document:dom,target,material});
assert.ok(target.children.some(x=>x.tagName==='HR'),'Real rules rendered');
const labels=target.children.filter(x=>x.className==='lit-study-row').map(x=>x.children[0]);
assert.deepEqual(labels.map(x=>x.textContent),['a.','b.','c.','1.','2.','3.']);
assert.ok(labels.every(x=>x.tagName==='STRONG'),'Every marker is semantically bold');
assert.ok(target.children.some(x=>x.tagName==='H3'&&x.textContent==='Definiții'));

const items=[
 new Element('button','← Acasă'),new Element('button','Înapoi'),new Element('button','← Back'),
 new Element('button','Înapoi la listă'),new Element('button','Caută variante de transport'),
 new Element('button','Salvează PDF'),new Element('button','Următoarea →'),
 new Element('button','Comunicare'),new Element('button','Acasă'),
 new Element('button','❮')
];
items[8].bottomNav=true;items[9].attrs['aria-label']='Înapoi';
const body=new Element('body');body.append(...items);
vm.runInNewContext(NAV_RETURN_ACCENT_SCRIPT,{window:{},document:{body}});
for(const i of [0,1,2,3,9])assert.ok(items[i].classes.has('pocket-nav-return'),'Missing Home/Back accent index '+i);
for(const i of [4,5,6,7,8])assert.ok(!items[i].classes.has('pocket-nav-return'),'Non-navigation button recolored at '+i);
assert.match(NAV_RETURN_ACCENT_CSS,/button\.pocket-nav-return/);
assert.doesNotMatch(NAV_RETURN_ACCENT_CSS,/\.primary-btn\s*,|\.secondary-btn\s*,/,'Do not recolor global buttons');
assert.match(COMMUNICATION_STYLE,/button\.pocket-nav-return/,'Accent CSS included in frontend');
assert.match(COMMUNICATION_SCRIPT,/pocketReturnAccentInstalled/,'Navigation color marker included in frontend');
new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'literature-typography-browser.js'});
assert.match(LITERATURE_TASK_UI_SCRIPT,/renderStudyBlocks\(content,pages\[active\]\|\|body\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/renderStudyBlocks\(out,text\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/eduOpenPrint\('save',material,\(\)=>dialog\.close\(\)\)/);
console.log('PASS: bold a/b/c and 1/2/3, real rules, cyan headings, burgundy only Home/Back');
