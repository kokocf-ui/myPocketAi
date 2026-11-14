import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import {CREATOR_SITE_SCRIPT} from './creator_site_ui.mjs';
import {CREATOR_SITE_AI_SCRIPT} from './creator_site_ai.mjs';
import {CREATOR_MANAGEMENT_SCRIPT,CREATOR_MANAGEMENT_STYLE} from './creator_management_ui.mjs';
new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT,{filename:'creator-combined.js'});
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes(CREATOR_MANAGEMENT_SCRIPT));
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes(CREATOR_MANAGEMENT_STYLE));
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes('const management=extraCreatorManagementForm(area)'));
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/Descrierea în engleză|English description|const descEn=/);
assert.match(CREATOR_SITE_SCRIPT,/Eva va traduce automat din română/);
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/completează descrierea în engleză/i);
assert.doesNotMatch(CREATOR_SITE_AI_SCRIPT,/f\.descEn/);
assert.match(CREATOR_SITE_AI_SCRIPT,/validateManagement\?\.\(\)/,'Managed sites require completed maintenance terms');
globalThis.learningLabel=(ro,en)=>ro;
const functions=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+';return {generate:extraCreatorLocalHtml,validate:extraCreatorManagementValidate,agreement:extraCreatorManagementAgreement};')();
assert.equal(functions.validate({mode:'owner'}),'','Owner-admin does not require a paid maintenance contract');
const contract={
 mode:'shared',client:'Pensiunea Aramis',creator:'Firma Demo',monthly:'45',currency:'GBP',edits:'4',
 response:'3',extras:'10',notice:'30',hosting:'owner',backups:'monthly'
};
assert.equal(functions.validate(contract),'');
assert.ok(functions.validate({...contract,edits:''}),'Missing allowance must be rejected');
assert.ok(functions.validate({...contract,monthly:'-45'}),'Negative amount must be rejected');
const html=functions.agreement(contract);
for(const fact of ['Pensiunea Aramis','Firma Demo','45 GBP','4 solicitări','3 zile lucrătoare','10 GBP','30 zile','Administrare mixtă','Domeniul și găzduirea','O copie de siguranță pe lună','Servicii excluse','Acest document este o propunere'])assert.ok(html.includes(fact),fact);
const evil=functions.agreement({...contract,creator:'<script>alert(1)</script>'});
assert.ok(evil.includes('&lt;script&gt;'));
assert.ok(!evil.includes('<script>'),'Agreement must escape client content');
const enOnly=functions.generate('Aramis','Pensiune / cazare','Cazare cu mic dejun inclus. 5 camere single.',
 'Coastal','Tel: 000','en',{styleId:'coastal',kind:'hotel'});
assert.ok(enOnly.includes('Translation into English will be prepared by Eva'));
assert.ok(!enOnly.includes('Cazare cu mic dejun inclus.'),'English layout must not masquerade Romanian text as translation');
const withAI=functions.generate('Aramis','Pensiune / cazare','Cazare cu mic dejun inclus. 5 camere single.',
 'Coastal','Tel: 000','both',{styleId:'coastal',kind:'hotel',
 descriptionEn:'Breakfast included; 5 single rooms',
 aiCopy:{en:{headline:'Stay at Aramis',intro:'Welcome to Aramis',about:'Comfortable accommodation',services:[{title:'Rooms',detail:'5 single rooms'}]},
 ro:{headline:'Cazare Aramis',intro:'Bine ați venit',about:'Cazare plăcută',services:[]}}});
assert.ok(withAI.includes('Breakfast included'));
assert.ok(withAI.includes('Stay at Aramis'));
assert.ok(withAI.includes('lang-ro'));
assert.ok(withAI.includes('lang-en'));
console.log('PASS: automatic bilingual AI translation, no English input, prior management selection and detailed safe agreement');
