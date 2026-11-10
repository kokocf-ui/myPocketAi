import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectPublisherRecipeEvidence,repairRecipeFromPublisher} from './recipe_source_integrity.mjs';

const sourceIngredients=[
'3 L apă','1 ceapă medie','1 morcov mare','1 păstârnac',
'1 rădăcină mică de țelină','1 ardei gras roșu',
'3 linguri de orez spălat','2 linguri bulion pastă','sare și piper după gust',
'borș după gust (300–500 ml)','600–700 g pulpă de pui tocată','1 ou',
'1 lingură griș (opțional)','1-2 linguri pătrunjel verde tocat',
'1 legătură pătrunjel verde','1 legătură leuștean verde'
];
const steps=[
'1. Curăță și toacă ceapa, morcovul, țelina și păstârnacul; pregătește separat orezul clătit și condimentele.',
'2. Fierbe legumele cu apa și bulionul, amestecând din când în când, până când legumele se înmoaie suficient.',
'3. Amestecă atent carnea tocată cu oul, grișul și verdeața, formează perișoare și fierbe-le împreună cu baza de ciorbă până sunt pătrunse.',
'4. Potrivește zeama cu borș, gustă înainte de servire și adaugă verdeață proaspătă spre sfârșit.'
];
const html='<html lang="ro"><h3>Ciorbă de perișoare – rețetă originală ingrediente</h3><ul>'+
 sourceIngredients.map(x=>'<li><span>'+x+'</span></li>').join('')+
 '</ul><h2>Mod de preparare ciorbă de perișoare</h2>'+
 steps.map(x=>'<h3>'+x+'</h3>').join('')+'<h2>Nutriție</h2><p>12 kcal</p></html>';
const evidence=inspectPublisherRecipeEvidence(html,{html:true});
assert.equal(evidence.ingredients.length,16,'All 16 original ingredients must be recovered');
assert.equal(evidence.methodVerified,true);
assert.equal(evidence.videoOnly,false);
assert.match(evidence.excerpt,/600–700 g pulpă de pui tocată/);
const base=[
 'Rețeta 1 — Ciorbă de perișoare','Ingrediente:',
 '- 3 L apă','- 1 ceapă medie','- 1 morcov mare','Mod de preparare:',
 ...steps
].join('\n');
const corrected=repairRecipeFromPublisher(base,{pageLanguage:'ro',recipeCoverage:evidence},'ro','ciorbă de perișoare');
assert.ok(corrected,'Complete written methods should be accepted');
assert.equal((corrected.match(/^- /gm)||[]).length,16,'Never render a 3-ingredient subset when 16 are known');
assert.equal((corrected.match(/^\d+\. /gm)||[]).length,4);
assert.equal(repairRecipeFromPublisher(base,{pageLanguage:'ro',recipeCoverage:evidence},'en','ciorbă de perișoare'),'',
 'An English translation must not silently lose 13 publisher ingredients');
assert.equal(repairRecipeFromPublisher(base,{pageLanguage:'ro',recipeCoverage:evidence},'ro','ciorbă de perișoare').includes('1 ou'),true);
const jamila='<h2>Ingrediente</h2><h3>Pentru ciorba:</h3><ul>'+
 ['3 rosii taiate cubulete','1 dovlecel taiat cubulete','1 telina mica taiata cubulete',
  '2 ardei grasi taiati cubulete','1 morcov mare taiat cubulete','2 cepe taiate cubulete',
  'cateva oase de vita','1/2 litru bors','500 g carne de vita tocata','1 ou',
  'putin patrunjel tocat','1 ceapa mica tocata marunt','sare','piper'].map(x=>'<li>'+x+'</li>').join('')+
 '</ul><h2>Mod de preparare</h2><p>Instructiunile si modul de preparare pentru reteta de ciorba de perisoare le gasiti in clipul de mai jos! Urmariti-l cu atentie!</p><h2>Nutritie pe portie/bucata</h2>';
const video=inspectPublisherRecipeEvidence(jamila,{html:true});
assert.equal(video.ingredients.length,14);
assert.equal(video.videoOnly,true);
assert.equal(video.methodVerified,false);
assert.equal(repairRecipeFromPublisher(base,{pageLanguage:'ro',recipeCoverage:video},'ro','ciorbă de perișoare'),'');
const markdown=[
 '# Ciorba de perisoare','## Ingrediente',
 '* Pentru ciorba:','* 3 L apa','* 1 ceapa mare','* 1 morcov mare','* 1 pastarnac',
 '* 1 telina mica','* 500 g carne tocata','* 50 g orez','* 1 ou','* 1 cana bors',
 '## Mod de preparare','1. Curata si toaca legumele, apoi fierbe-le in apa.',
 '2. Pune carnea tocata, oul si orezul intr-un castron si amesteca bine.',
 '3. Formeaza perisoarele, fierbe-le in zeama si potriveste gustul cu bors.'
].join('\n');
const extracted=inspectPublisherRecipeEvidence(markdown);
assert.equal(extracted.ingredients.length,9,'Markdown/Exa list is not just a three-item summary');
assert.equal(extracted.methodVerified,true);
const shortGeneric=[
 'Rețeta 1 — Ciorbă de perișoare','Ingrediente:',
 '- 3 L apă','- 1 morcov','- 1 ceapă','Mod de preparare:',
 '1. Pregătește ingredientele pentru ciorbă și perișoare.',
 '2. Fierbe ingredientele până la gata.'
].join('\n');
assert.equal(repairRecipeFromPublisher(shortGeneric,{pageLanguage:'ro',recipeCoverage:evidence},'ro','ciorbă de perișoare'),'');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/source\.recipeCoverage=inspectPublisherRecipeEvidence\(body,\{html:true\}\)/);
assert.match(backend,/repairRecipeFromPublisher\(normalizeSingleCulinaryAnswer\(raw,lang\)/);
assert.match(backend,/if\(recipeInstruction&&recipeRequestCount>=1\)/);
console.log('Publisher ingredient count, full recipe repair, Exa extraction and video-only rejection passed');
