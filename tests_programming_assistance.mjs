import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyProgrammingRequest,programmingAssistantInstruction} from './programming_assistance.mjs';
for(const q of ['Poți să creezi pagini web?', 'Vreau să scriu un progrămel în Python', 'Fă-mi un site HTML și CSS', 'Scrie cod JavaScript pentru un calculator', 'How do I build a web page?', 'Ajută-mă să depanez acest script']){
 assert.equal(classifyProgrammingRequest(q).kind,'coding',q);
}
for(const q of ['Salutare!', 'Ce vreme este azi?', 'Găsește un restaurant aproape', 'Caută traseul spre Londra']){
 assert.equal(classifyProgrammingRequest(q).kind,'none',q);
}
assert.equal(classifyProgrammingRequest('Continuă',[{role:'user',content:'Scrie un program Python'}]).kind,'coding');
assert.match(programmingAssistantInstruction('ro'),/poate SCRIE/);
assert.match(programmingAssistantInstruction('en'),/cannot claim to execute/);
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/classifyProgrammingRequest\(message,history\)/);
assert.match(backend,/programmingAssistantInstruction\(lang\)/);
assert.match(backend,/programmingIntent.kind==="coding"\?2600/);
console.log('PASS coding requests retain source-authoring capability, learner guidance and output budget');
