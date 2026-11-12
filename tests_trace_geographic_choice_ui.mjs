import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ui=readFileSync('index.js','utf8');
for(const needle of ['function appendConversationChoices(', 'appendConversationChoices(data', 'data.destination_candidates', 'needs_location_clarification', 'choice_options', 'function sendMessage(']){
 let i=ui.indexOf(needle);
 console.log('====',needle,'idx=',i);
 if(i>=0)console.log(ui.slice(Math.max(0,i-240),Math.min(ui.length,i+3600)));
}
assert.ok(ui.includes('appendConversationChoices'));
