import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {CHEMISTRY_DETAILED_LESSONS} from './chemistry_detailed_lessons.mjs';
import {CHEMISTRY_LESSONS} from './chemistry_curriculum.mjs';

const originals=CHEMISTRY_LESSONS.filter(x=>x.topic==='fundamentals');
assert.equal(originals.length,14,'foundation chapter still has fourteen lessons');
assert.equal(Object.keys(CHEMISTRY_DETAILED_LESSONS).length,14,'all fourteen foundation lessons are covered');
for(const entry of originals){
 const text=CHEMISTRY_DETAILED_LESSONS[entry.id];
 assert.ok(typeof text==='string'&&text.length>=900,entry.title+' must be substantive');
 assert.ok(/DEFINIȚIE|SCOP/.test(text),entry.title+' must begin with educational context');
 assert.ok(/EXEMPL/.test(text),entry.title+' includes a real example');
 assert.ok(/VERIFICĂ-TE/.test(text),entry.title+' includes independent learning checks');
 assert.doesNotMatch(text,/\*\*|^#{1,4} /m,entry.title+' cannot expose raw Markdown');
}
const html=await(await frontend.fetch(new Request('https://chemistry-three-screen.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script,'main script must be embedded');
new vm.Script(script);
for(const stage of ['chemistry-menu','chemistry-lessons','chemistry-lab']){
 assert.ok(script.includes("'"+stage+"'"),stage+' is a real stage');
}
assert.ok(script.includes('function scienceOpenChemistrySection(stage)'));
assert.ok(script.includes('CHEMISTRY_DETAIL_DATA[item.id]'),'opening a lesson uses full offline text');
assert.ok(script.includes('educationOpenPagedLesson(item.title,material);'),'the existing paginated reader is reused');
assert.ok(script.includes("scienceJourney.subject!=='chemistry'&&availableTopics.length>1"),
 'exercise view does not duplicate the chapter list');
assert.ok(script.includes("if(topic&&scienceJourney.subject!=='chemistry')"),
 'exercise view does not duplicate lessons');
assert.ok(script.includes("scienceJourney.subject==='chemistry'?'chemistry-menu':'workspace'"),
 'Chemistry opens the simplified menu; other Sciences retain their route');
assert.ok(html.includes('.chemistry-section-list{padding:4px 5px calc(108px'),
 'lessons scroll with clearance above persistent navigation');
assert.ok(html.includes('.chemistry-primary-solve{background:linear-gradient(180deg,#8a3c54,#651f38)'),
 'solve control uses burgundy, not bright red');
console.log('PASS Chemistry: three independent screens, 14 detailed paginated lessons, compact editor and stable navigation');
