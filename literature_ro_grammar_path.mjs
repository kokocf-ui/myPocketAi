// Romanian grammar choices named after the lessons pupils can actually open.
// Grades I–VIII use the distinct authored chapters in literature_ro_grade_progression.mjs.
// Upper-secondary chapters are pupil-facing pedagogical groups, not a single
// mandatory textbook table of contents; class IX changes in 2026/27.
export const RO_SECONDARY_GRAMMAR=Object.freeze({
 '9':[
  ['norme','Exprimare corectă și punctuație','Exersează normele limbii române în texte scrise și vorbite: ortografie, punctuație și claritatea enunțurilor.','grammar'],
  ['vocabular','Cuvinte, sensuri și registre','Studiază sinonimia, polisemia, sensul contextual și adecvarea vocabularului la situația de comunicare.','vocabulary'],
  ['sintaxa','Propoziții, fraze și coerență','Recunoaște relațiile dintre idei și propoziții din texte reale; explică alegerea construcțiilor și a conectorilor.','grammar'],
  ['analiza','Analiza limbajului într-un text','Analizează formele, sensurile și efectele expresive ale limbii într-un fragment ales explicit de elev.','analysis']
 ],
 '10':[
  ['norme','Normele limbii și exprimarea clară','Corectează fraze și texte autentice, explicând acordul, normele de scriere și punctuația în contexte.','grammar'],
  ['sens','Sensuri, nuanțe și expresivitate','Explică sensul propriu și figurat, valoarea expresivă a alegerii cuvintelor și registrul într-un text concret.','vocabulary'],
  ['fraza','Construcția frazei și a paragrafului','Analizează cum se leagă propozițiile și paragrafele într-un text clar, logic, cu conectori potriviți.','grammar'],
  ['discurs','Analiza unui discurs','Observă destinatarul, scopul, vocabularul și mijloacele lingvistice prin care un text își produce efectul.','analysis']
 ],
 '11':[
  ['argument','Limba argumentării','Construiește o teză și argumente susținute prin exemple; analizează rolul conectorilor, al nuanțelor și al adresării.','grammar'],
  ['stil','Stil, vocabular și registre','Compară formulări neutre, familiare și formale și explică modul în care sensul depinde de context.','vocabulary'],
  ['sintaxa','Sintaxa și organizarea ideilor','Aplică regulile de acord, relațiile sintactice și coerența în interpretarea și rescrierea unor fraze.','grammar'],
  ['discurs','Analiză de text și discurs','Identifică strategiile retorice și lingvistice ale unui text verificabil, fără să inventeze o operă literară.','analysis']
 ],
 '12':[
  ['revizuire','Exprimare corectă și revizuire','Verifică și îmbunătățește formulări dintr-un eseu, explicând greșeli de sens, acord și punctuație.','grammar'],
  ['vocabular','Vocabular și precizia exprimării','Alege termenii potriviți, explică sinonime, sensuri contextuale și registre în redactarea și comentarea textelor.','vocabulary'],
  ['fraza','Fraza și coerența argumentelor','Analizează construcții sintactice și legături logice în texte argumentative; rescrie pasaje pentru claritate.','grammar'],
  ['analiza','Analiză lingvistică aplicată','Analizează un fragment furnizat de elev: forme, relații între cuvinte, construcția ideilor și efectele expresive.','analysis']
 ]
});
export function roGrammarTopicsForYear(grade,authored={}){
 const year=String(grade);
 if(Number(year)>=1&&Number(year)<=8){
  return (authored[year]||[]).map(chapter=>[chapter.id,chapter.ro,chapter.en,chapter.intro]);
 }
 return (RO_SECONDARY_GRAMMAR[year]||[]).map(([id,label,focus,area])=>
  ['ro-g'+year+'-'+id,label,label,focus+' Arie de studiu: '+area+'.']);
}
