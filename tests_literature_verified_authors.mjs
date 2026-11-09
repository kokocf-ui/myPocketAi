import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {VERIFIED_LITERARY_AUTHORS,verifiedAuthorsByQuery,verifiedAuthorByName,verifiedWorksByQuery} from './literature_verified_authors.mjs';

const matches=verifiedAuthorsByQuery('Stănescu');
assert.equal(matches.length,1,'Surname query must not mix in other named writers');
const author=matches[0];
assert.equal(author.name,'Nichita Stănescu');
assert.equal(verifiedAuthorsByQuery('Nichita Stanescu')[0],author,'Diacritics should be optional');
assert.equal(verifiedAuthorsByQuery('Nichita Stănescu')[0],author);
assert.equal(verifiedAuthorByName('NICHITA STANESCU'),author);
assert.equal(verifiedAuthorByName('Eugen Stănescu'),null);
assert.equal(author.country,'RO');
assert.equal(author.language,'ro');
assert.equal(author.birthYear,1933);
assert.equal(author.deathYear,1983);
assert.ok(author.sourceUrl.startsWith('https://www.icr.ro/'));
assert.ok(author.works.length>=20);
const titleSet=new Set(author.works.map(w=>w.title.toLowerCase()));
assert.equal(titleSet.size,author.works.length,'No duplicate books');
for(const [title,year] of [['Sensul iubirii',1960],['O viziune a sentimentelor',1964],['11 elegii',1966],['Necuvintele',1969],['În dulcele stil clasic',1970],['Epica Magna',1978],['Noduri și semne',1982]]){
 assert.ok(author.works.some(w=>w.title===title&&w.year===year),'Missing sourced title: '+title);
}
for(const wrong of ['La leçon sur le cercle','Im Namen der Vögel','Som krvavá škvrna','Unfinished work']){
 assert.ok(!author.works.some(w=>w.title===wrong),'Reject unrelated Open Library record: '+wrong);
}
assert.equal(verifiedWorksByQuery('necuvintele')[0].author,author);
assert.equal(verifiedWorksByQuery('necuvintele')[0].work.title,'Necuvintele');
assert.equal(verifiedWorksByQuery('leçon sur le cercle').length,0);
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
for(const token of [
 "import {VERIFIED_LITERARY_AUTHORS} from './literature_verified_authors.mjs'",
 'const LIT_VERIFIED_AUTHORS=${JSON.stringify(VERIFIED_LITERARY_AUTHORS)}',
 "if(key==='literature'){litOpen('levels');return}",
 "if(litJourney.stage==='languages'){litOpen('levels');return}",
 "if(litJourney.stage==='countries'||litJourney.stage==='levels')",
 "litChangeLanguageNeverExists" // temporary replaced below
])if(token!=='litChangeLanguageNeverExists')assert.ok(source.includes(token),'Missing literature flow: '+token);
assert.match(source,/Schimbă limba studiată \(opțional\)/);
assert.match(source,/const verifiedAuthors=curatedAuthorMatches\(term\)/);
assert.match(source,/if\(verifiedAuthors\.length\)\{/);
assert.match(source,/const verified=curatedByName\(author\?\.name\)/);
assert.match(source,/showCuratedAuthor\(verified\);return/);
assert.match(source,/const next=author\.works\.slice\(curatedVisible,curatedVisible\+6\)/);
assert.match(source,/work\.dataset\.catalogVerified='true'/);
const result=await app.fetch(new Request('https://literature-verified.test/'));
assert.equal(result.status,200);
const html=await result.text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Embedded app script missing');
new vm.Script(script,{filename:'literature-verified-boot.js'});
assert.ok(script.includes('Nichita Stănescu'));
assert.ok(script.includes('Institutul Cultural Român'));
assert.ok(script.includes("if(key==='literature'){litOpen('levels');return}"));
console.log('PASS: Romanian study-language default and source-verified Nichita Stănescu works');
