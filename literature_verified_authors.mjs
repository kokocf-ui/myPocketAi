import {SEVEN_COUNTRY_LITERARY_LIBRARY} from './literature_seven_country_library.mjs';
// Verified author bibliography, original metadata only (no copyrighted text).
// The Open Library search index is useful for discovery, not reliable enough
// on its own to establish attribution or a complete author's bibliography.
// Reference: Institutul Cultural Român, Nichita Stănescu at age 80:
// https://www.icr.ro/pagini/nichita-stanescu-80-de-ani-de-la-nastere-7723
export const VERIFIED_LITERARY_AUTHORS=Object.freeze([
 Object.freeze({
  id:'ro-nichita-stanescu',name:'Nichita Stănescu',birthYear:1933,deathYear:1983,
  country:'RO',language:'ro',sourceTitle:'Institutul Cultural Român — Nichita Stănescu',
  sourceUrl:'https://www.icr.ro/pagini/nichita-stanescu-80-de-ani-de-la-nastere-7723',
  works:Object.freeze([
   ['Sensul iubirii',1960,'volum de poezie'],
   ['O viziune a sentimentelor',1964,'volum de poezie'],
   ['Dreptul la timp',1965,'volum de poezie'],
   ['11 elegii',1966,'volum de poezie'],
   ['Roșu vertical',1967,'volum de poezie'],
   ['Alfa',1967,'volum de poezie'],
   ['Oul și sfera',1967,'volum de poezie'],
   ['Laus Ptolemaei',1968,'volum de poezie'],
   ['Necuvintele',1969,'volum de poezie'],
   ['Un pământ numit România',1969,'volum de poezie'],
   ['În dulcele stil clasic',1970,'volum de poezie'],
   ['Poezii',1970,'antologie'],
   ['Belgradul în cinci prieteni',1972,'volum de poezie'],
   ['Cartea de recitire',1972,'proză și eseuri'],
   ['Măreția frigului',1972,'volum de poezie'],
   ['Clar de inimă',1973,'antologie'],
   ['Starea poeziei',1975,'antologie'],
   ['Epica Magna',1978,'volum de poezie'],
   ['Opere imperfecte',1979,'volum de poezie'],
   ['Noduri și semne',1982,'volum de poezie'],
   ['Oase plângând',1982,'volum de poezie'],
   ['Respirări',1982,'publicistică și proză eseistică'],
   ['Strigarea numelui',1983,'volum de poezie']
  ].map(([title,year,kind])=>Object.freeze({title,year,kind})))
 }),
 ...SEVEN_COUNTRY_LITERARY_LIBRARY
]);
export const literatureFold=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('ro-RO')
 .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function verifiedAuthorsByQuery(query){
 const needle=literatureFold(query);
 if(needle.length<3)return [];
 const terms=needle.split(/\s+/).filter(Boolean);
 return VERIFIED_LITERARY_AUTHORS.filter(author=>{
  const names=[author.name,...(author.aliases||[])].map(literatureFold);
  return names.some(full=>terms.every(term=>full.split(' ').some(part=>part.startsWith(term))));
 });
}
export function verifiedAuthorByName(name){
 const target=literatureFold(name);
 return VERIFIED_LITERARY_AUTHORS.find(author=>[author.name,...(author.aliases||[])]
  .some(name=>literatureFold(name)===target))||null;
}
export function verifiedWorksByQuery(query){
 const needle=literatureFold(query);
 if(needle.length<4)return [];
 const rows=[];
 for(const author of VERIFIED_LITERARY_AUTHORS){
  for(const work of author.works)if(literatureFold(work.title).includes(needle))
   rows.push({author,work});
 }
 return rows.slice(0,30);
}
