import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {COMMUNICATION_HTML,COMMUNICATION_STYLE,COMMUNICATION_SCRIPT} from './communication_ui.mjs';
const html=await (await frontend.fetch(new Request('https://communication-test.invalid/'))).text();
assert.match(html,/data-nav="communication"/,'Communication replaces Tools in bottom navigation');
const bottom=html.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0]||'';
assert.ok(!bottom.includes('data-nav="tools"'),'Tools removed only from bottom nav');
assert.match(html,/data-module="tools"/,'Tools remain accessible from Home');
assert.match(html,/id="view-tools"/,'Existing tools are not removed');
assert.match(html,/id="view-communication"/,'Communication has a dedicated screen');
for(const section of ['messages','contacts','invites','shared']){
 assert.match(COMMUNICATION_HTML,new RegExp('data-comm-panel="'+section+'"'));
}
assert.match(COMMUNICATION_HTML,/id="commNewMessage" disabled|disabled id="commNewMessage"/,'Unverified messages are disabled');
assert.match(COMMUNICATION_HTML,/id="commQR" disabled|disabled id="commQR"/,'Unverified invitations are disabled');
assert.match(COMMUNICATION_SCRIPT,/pocketCommunicationSetLanguage/);
assert.match(COMMUNICATION_SCRIPT,/pocketCommunicationLabel/);
assert.match(COMMUNICATION_STYLE,/comm-tabs/);
assert.ok(html.includes('Conectarea serviciului de mesagerie este în pregătire.'),'No fake live messaging claims');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
new vm.Script(script,{filename:'communication-front.js'});
console.log('PASS Communication nav, privacy gates, tools access, four tabs and compiled JS');