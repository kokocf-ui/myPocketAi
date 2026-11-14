import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import {CREATOR_SITE_SCRIPT,CREATOR_SITE_STYLE} from './creator_site_ui.mjs';
import {CREATOR_DESIGN_SCRIPT,CREATOR_DESIGN_STYLE} from './creator_design_gallery.mjs';

new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT,{filename:'extra-tools-workspace.js'});
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes(CREATOR_SITE_SCRIPT),'Site UI is included in combined Tools JS');
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes(CREATOR_SITE_STYLE),'Site styles are included in Tools');
const f=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+'; return {generate:extraCreatorLocalHtml,details:extraCreatorSiteDetails,styles:extraCreatorVisualStyles};')();
assert.ok(f.styles.length>=10,'The style picker must offer many distinct visual approaches');
assert.equal(new Set(f.styles.map(s=>s.id)).size,f.styles.length,'Design styles must have unique IDs');
for(const s of f.styles){assert.ok(s.colors.length===4&&s.ro&&s.en,s.id)}

const aramis='Cazare cu mic dejun inclus Are 5 camere single, 10 camere duble și 3 apartamente. Bucătărie la comun, sala de mese pentru mic dejun';
const facts=f.details(aramis,'hotel');
assert.deepEqual(facts.counts.map(i=>i.value),['5','10','3']);
assert.deepEqual(f.details('5 camere single, 10 duble și 3 apartamente.','hotel').counts.map(i=>i.value),['5','10','3']);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorGuesthouseControls/);
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

const structuralFamilies=new Set();
for(const style of f.styles){
 const html=f.generate('Aramis','Pensiune / cazare',aramis,style.ro,'verified@example.test','ro',{kind:'hotel',styleId:style.id});
 const family=html.match(/<body class="premium-site theme-([a-z]+)"/)?.[1];
 assert.ok(family,'Missing actual template family for '+style.id);
 structuralFamilies.add(family);
 assert.match(html,/<header class="design-nav">/,'Design contains real site navigation');
 assert.match(html,/<section class="offers"/,'Design still presents real services');
 assert.ok(html.includes('5</b>'),'Layout must preserve user-provided room facts');
}
assert.equal(structuralFamilies.size,12,'Require twelve unique layout architectures, not just different colours');
assert.match(CREATOR_DESIGN_SCRIPT,/Previzualizările nu consumă credite AI|Previzualizările nu consumă/);
assert.ok(CREATOR_DESIGN_SCRIPT.includes('extraCreatorFullscreen(sample)'));
assert.match(CREATOR_DESIGN_STYLE,/extra-design-mini-visual/);
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes(CREATOR_DESIGN_SCRIPT));

const bilingual=f.generate('Aramis','Pensiune / cazare',aramis,'Elegant','verified@example.test','both',
 {kind:'hotel',styleId:'coastal',descriptionEn:'Bed and breakfast. Five single rooms. Shared kitchen.'});
assert.match(bilingual,/id="lang-ro"/);
assert.match(bilingual,/id="lang-en"/);
assert.match(bilingual,/Bed and breakfast/);
assert.match(bilingual,/class="locale-content lang-ro"/);
assert.match(bilingual,/class="locale-content lang-en"/);
assert.match(bilingual,/css|style/i);
assert.match(CREATOR_SITE_SCRIPT,/Eva va traduce automat din română/);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorStylePicker/);
assert.match(CREATOR_SITE_SCRIPT,/Personalizează site-ul/);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorOptionPicker/);
assert.match(CREATOR_SITE_SCRIPT,/getPreferences:/);
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/extraToolsField\(area,extraToolsLocale\('Detalii suplimentare/);
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/const descEn=|Descrierea în engleză/,'AI translates automatically; no duplicate English input');
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
