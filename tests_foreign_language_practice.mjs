import assert from 'node:assert/strict';
import vm from 'node:vm';
import {FOREIGN_LANGUAGES} from './foreign_languages_curriculum.mjs';
import {foreignPracticeConfig,foreignPracticePrompt,foreignPracticeParse} from './foreign_language_practice.mjs';
import {FOREIGN_LANGUAGE_PRACTICE_SCRIPT} from './foreign_language_practice_ui.mjs';
new vm.Script(FOREIGN_LANGUAGE_PRACTICE_SCRIPT);
let variants=0;
for(const language of FOREIGN_LANGUAGES)for(const variant of language.variants.length?language.variants:['standard']){
 const config=foreignPracticeConfig({language:language.id,variant,level:'B2',topic:'La restaurant',focus:'grammar',interfaceLanguage:'de'});
 variants++;assert.equal(config.classical,language.id==='la'||language.id==='el'&&['ancient','koine'].includes(variant));
 const prompt=foreignPracticePrompt(config,['A previous sentence.']);assert.ok(prompt.includes('A previous sentence.'));assert.ok(prompt.includes('"interfaceLanguage":"de"'));
 if(config.classical)assert.match(prompt,/Do NOT fabricate ancient airport/);
 const value={...config,items:Array.from({length:6},(_,i)=>({target:'Target '+i,phonetic:'',meaning:'Meaning',explanation:'Explanation and common mistake',question:'Word ___',answers:['answer']}))};
 const parsed=foreignPracticeParse('```json\n'+JSON.stringify(value)+'\n```',config);assert.equal(parsed.items.length,6);
 for(const mutate of [x=>x.language='xx',x=>x.variant='wrong',x=>x.level='wrong',x=>x.items.pop(),x=>x.items[0].answers=[],x=>x.items[1].target=x.items[0].target,x=>x.items[0].question='no gap']){const bad=structuredClone(value);mutate(bad);assert.throws(()=>foreignPracticeParse(JSON.stringify(bad),config))}
}
assert.equal(variants,19);assert.throws(()=>foreignPracticeConfig({language:'xx',topic:'x'}));assert.throws(()=>foreignPracticeConfig({language:'en',variant:'GB',topic:' '}));
assert.throws(()=>foreignPracticeParse('<script>alert(1)</script>',{language:'en',variant:'GB',topic:'test'}));
console.log('PASS shared adaptive language engine: all 19 variants, four practice goals, level/identity checks, six-item structured sets, classical context, invalid/truncated/duplicate output rejection; AI not linguistically verified');
