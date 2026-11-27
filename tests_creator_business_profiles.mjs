import assert from 'node:assert/strict';
import {CREATOR_BUSINESS_PROFILES as profiles} from './creator_business_profiles.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT} from './extra_tools_workspace.mjs';
const api=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+';return {make:extraCreatorLocalHtml,facts:extraCreatorBusinessFacts,profile:extraCreatorBusinessProfile,categories:extraCreatorGalleryCategoryOptions};')();
assert.equal(Object.keys(profiles).length,10);
for(const kind of Object.keys(profiles)){
 const p=profiles[kind],details=Object.fromEntries(p.fields.map(([id])=>[id,'Date verificate '+id]));
 const html=api.make('Afacerea Test',p.ro,'Descriere oferită de proprietar, fără alte presupuneri.','design','contact@example.org +40 721 111 222','ro',{kind,styleId:'urban',businessDetails:details});
 assert.match(html,new RegExp('data-business-kind="'+kind+'"'));assert.ok(html.includes(p.offer[0]));assert.ok(html.includes(p.cta[0]));
 assert.match(html,/mailto:contact@example.org/);assert.match(html,/tel:\+40721111222/);
 for(const [id,ro] of p.fields){assert.ok(html.includes('data-field="'+id+'"'));assert.ok(html.includes(ro));assert.ok(html.includes('Date verificate '+id))}
 const empty=api.make('Test',p.ro,'Descriere reală fără date suplimentare.','','','ro',{kind,businessDetails:{notAField:'injected'},styleId:'urban'});
 assert.ok(!empty.includes('class="business-fact"'));assert.ok(!empty.includes('injected'));assert.doesNotMatch(empty,/5 stele|Recenzie|24\/7|Wi-Fi gratuit|href="tel:/);
 const evil=api.make('Test',p.ro,'Descriere reală fără date suplimentare.','','','ro',{kind,businessDetails:{[p.fields[0][0]]:'<img src=x onerror=alert(1)>'}});
 assert.ok(evil.includes('&lt;img'));assert.doesNotMatch(evil,/<img src=x/);
}
assert.notDeepEqual(profiles.guesthouse.fields,profiles.hotel.fields);assert.notDeepEqual(profiles.restaurant.fields,profiles.cafe.fields);assert.notDeepEqual(profiles.cafe.fields,profiles.bar.fields);
for(const kind of ['guesthouse','hotel'])assert.ok(api.categories(kind,'3 camere duble').some(c=>c.group==='room'));
assert.ok(api.categories('cafe','Cafea de origine').some(c=>c.id.includes('coffee')));assert.ok(api.categories('bar','Bar de cartier').some(c=>c.id.includes('cocktails')));
console.log('PASS 10 distinct business schemas, guesthouse≠hotel and restaurant≠café≠bar, 40 specific owner-fact fields, contact actions, category galleries and safe offline HTML with no invented details.');
