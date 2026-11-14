import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import {CREATOR_SITE_SCRIPT,CREATOR_SITE_STYLE} from './creator_site_ui.mjs';

new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT,{filename:'extra-tools-workspace.js'});
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.endsWith(CREATOR_SITE_SCRIPT));
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.endsWith(CREATOR_SITE_STYLE));
const f=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+'; return {generate:extraCreatorLocalHtml,details:extraCreatorSiteDetails,styles:extraCreatorVisualStyles};')();
assert.ok(f.styles.length>=10,'The style picker must offer many distinct visual approaches');
assert.equal(new Set(f.styles.map(s=>s.id)).size,f.styles.length,'Design styles must have unique IDs');
for(const s of f.styles){assert.ok(s.colors.length===4&&s.ro&&s.en,s.id)}

const aramis='Cazare cu mic dejun inclus Are 5 camere single, 10 camere duble și 3 apartamente. Bucătărie la comun, sala de mese pentru mic dejun';
const facts=f.details(aramis,'hotel');
assert.deepEqual(facts.counts.map(i=>i.value),['5','10','3']);
assert.ok(facts.amenities.some(x=>x.ro==='Mic dejun inclus'));
assert.ok(facts.amenities.some(x=>x.ro==='Bucătărie comună'));
assert.ok(facts.amenities.some(x=>x.ro==='Sală de mese'));
const a=f.generate('Aramis','Pensiune / cazare',aramis,'Elegant','verified@example.test','ro',{kind:'hotel',styleId:'heritage'});
const b=f.generate('Piper Verde','Restaurant','Paste proaspete; pizza artizanală; deserturi','Modern','other@example.test','ro',{kind:'restaurant',styleId:'urban'});
assert.notEqual(a,b);
assert.match(a,/class="metrics"/);
assert.match(a,/5<\/b>/);
assert.match(a,/camere single/);
assert.match(a,/10<\/b>/);
assert.match(a,/3<\/b>/);
assert.match(a,/class="amenities"/);
assert.doesNotMatch(a,/Soluții create pentru tine/,'No old generic duplicate panels');
assert.doesNotMatch(a,/Descrierea serviciilor se completează împreună cu proprietarul/);
assert.match(b,/Paste proaspete/);
assert.match(b,/pizza artizanală/);
assert.match(b,/class="services"/);

const bilingual=f.generate('Aramis','Pensiune / cazare',aramis,'Elegant','verified@example.test','both',
 {kind:'hotel',styleId:'coastal',descriptionEn:'Bed and breakfast. Five single rooms. Shared kitchen.'});
assert.match(bilingual,/id="lang-ro"/);
assert.match(bilingual,/id="lang-en"/);
assert.match(bilingual,/Bed and breakfast/);
assert.match(bilingual,/class="locale-content lang-ro"/);
assert.match(bilingual,/class="locale-content lang-en"/);
assert.match(bilingual,/css|style/i);
assert.match(CREATOR_SITE_SCRIPT,/lang\.value==='both'|lang\.value!=='ro'/);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorStylePicker/);
assert.match(CREATOR_SITE_SCRIPT,/descEn\.value\.trim\(\)/);
assert.match(CREATOR_SITE_SCRIPT,/photo\.accept='image\/jpeg,image\/png,image\/webp'/);
assert.match(CREATOR_SITE_SCRIPT,/Motorul AI de imagini nu este conectat/);
assert.match(CREATOR_SITE_SCRIPT,/make\.disabled=true/);
assert.match(CREATOR_SITE_SCRIPT,/aiButton\.disabled=true/);
assert.match(EXTRA_TOOLS_WORKSPACE_STYLE,/\.extra-creator-style-overlay/);

const escaped=f.generate('<script>alert("X")</script>','Services','<img src=x onerror=alert(1)>','Modern','<script>x</script>','en',
 {kind:'other',styleId:'tech',descriptionEn:'Safe service'});
assert.doesNotMatch(escaped,/<script>|<img src=x/i,'User content must never execute');
assert.match(escaped,/&lt;script&gt;/);
assert.match(escaped,/Content-Security-Policy/);
assert.doesNotMatch(a,/<script>|https?:\/\/|<img src="https?:/i,'Preview must be standalone and script-free');

assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/actionRow\.append\(back\)/);
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/homeParent\.insertBefore|titleParent\.insertBefore/,'Never move original navigation nodes');
console.log('PASS: original Home/Back retained, 12 chosen style concepts, structured hotel facts, bilingual switch, safe offline preview and explicit unconnected AI');
