// Small curated conceptual anchors for Romanian language/literature lessons.
// These are original definitions and examples, NOT quotations from authors.
// Only relevant concepts are passed to the model; no forced topic-specific essay.
const DEVICES=Object.freeze([
 {id:'epitet',tokens:['epitet','epitete'],
  fact:'EPITET: un determinant cu valoare expresivă care evidențiază o însușire într-un context artistic; nu orice adjectiv este automat epitet. Contează efectul produs în text.',
  example:'Exemplu ORIGINAL: „tăcerea grea a serii” – „grea” sugerează apăsarea liniștii, nu o greutate fizică.'},
 {id:'comparatie',tokens:['comparatie','comparatii','compararea'],
  fact:'COMPARAȚIE: punerea explicită în relație a două elemente printr-o asemănare relevantă, adesea cu „ca”, „precum”, „asemenea”. Nu orice comparație cantitativă este figură de stil.',
  example:'Exemplu ORIGINAL: „glasul ei era limpede ca apa izvorului” – asemănarea sugerează claritate și prospețime.'},
 {id:'metafora',tokens:['metafora','metafore','metaforica'],
  fact:'METAFORĂ: transfer de sens între domenii pentru a crea o imagine nouă; descrierea ei drept simplă comparație fără „ca” este incompletă.',
  example:'Exemplu ORIGINAL: „orașul era un stup neliniștit” – imaginea sugerează agitație colectivă.'},
 {id:'personificare',tokens:['personificare','personificarea','personificari'],
  fact:'PERSONIFICARE: atribuirea unor acțiuni, trăsături sau intenții umane unui element nonuman.',
  example:'Exemplu ORIGINAL: „vântul îmi bate nerăbdător la fereastră” – vântului i se atribuie o intenție umană.'},
 {id:'antiteza',tokens:['antiteza','antiteze'],
  fact:'ANTITEZĂ: opoziție construită între două imagini, situații, atitudini ori idei pentru accentuarea contrastului. Nu confunda antiteza cu OXIMORONUL, care alătură termeni contradictorii în aceeași expresie (de exemplu, „tăcere zgomotoasă”).',
  example:'Exemplu ORIGINAL: „Afară era zarvă; în camera ei domnea liniștea.” – două cadre opuse evidențiază singurătatea.'}
]);
const normalise=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function literatureGrounding(message,activity='lesson',language='ro'){
 if(!['lesson','study','examples','analysis'].includes(activity)||language!=='ro')return '';
 const topic=normalise(message);
 const whole=/\bfigur(?:a|i|ile|ilor)\s+de\s+stil\b|\bprocedee(?:le)?\s+(?:artistice|stilistice)\b/u.test(topic);
 const selected=whole?DEVICES:DEVICES.filter(entry=>entry.tokens.some(token=>topic.includes(token)));
 if(!selected.length)return '';
 const rules=selected.map(item=>item.fact+' '+item.example).join('\n');
 return 'CURATED DIDACTIC REFERENCE — Use this as a correctness constraint for the named topics. '+
  'All quoted samples below are ORIGINAL teaching examples, not citations from literature. '+
  'Explain and analyse the identified rhetorical devices precisely, without fabricating any excerpts from named poets or works. '+
  'If the user did not supply a verified literary excerpt, attribute NO invented wording to any author. '+
  'Distinguish grammatical forms from rhetorical effects. Do not treat oxymoron and antithesis as interchangeable.\n'+rules;
}
export function literatureUnsupportedAttribution(reply,message,activity='lesson'){
 if(!['lesson','study','examples','analysis'].includes(activity))return false;
 const request=normalise(message);
 const text=String(reply||'');
 // A work cited as an example that the user never mentioned is not evidenced by
 // a generic lesson prompt. A known title alone cannot verify a purported quote.
 const regex=/\b(?:poezia|poemul|romanul|nuvela|opera|basmul)\s+[„"“]([^„”"“]{3,100})[”"“]/giu;
 for(const match of text.matchAll(regex)){
  const title=normalise(match[1]).trim();
  if(title&&!request.includes(title))return true;
 }
 return false;
}
