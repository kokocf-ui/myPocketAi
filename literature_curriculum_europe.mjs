// Literature pathways for Europe, referenced against official national/jurisdictional
// publications. A verified framework is NOT an exhaustive list of mandatory works.
// The generic path is explicitly advisory when a country, grade or track is not checked.
export const LIT_EU_COMMON={
 beginner:[
  ['oral','Ascultare, conversație și exprimare','Înțelegere orală, vocabular, povestire și dialog.','communication'],
  ['read','Citire și înțelegerea textului','Fluență, idei principale, întrebări și rezumare.','genres'],
  ['stories','Povești, poezii și personaje','Narațiune, poezie, personaje, valori și răspuns personal.','narrative'],
  ['language','Gramatică și exprimare corectă','Cuvinte, propoziții, ortografie și punctuație.','grammar'],
  ['writing','Compunere și revizuire','Plan, ciornă, revizuire și prezentare.','composition']
 ],
 medium:[
  ['comprehension','Lectură critică și înțelegerea textului','Genuri, structuri, context și dovezi din text.','genres'],
  ['language','Limbă, gramatică și stil','Sintaxă, vocabular, registre și mijloace expresive.','grammar'],
  ['literature','Poezie, proză și teatru','Interpretare motivată; nu impune opere neconfirmate.','authors'],
  ['comparison','Curente și comparații','Epoci, contexte, idei și intertextualitate.','periods'],
  ['writing','Argumentare, comentarii și eseuri','Rezumat, sinteză, redactare și autoevaluare.','essay']
 ],
 advanced:[
  ['theory','Teorie și metodologie literară','Narativă, poetică, hermeneutică și abordări critice.','criticism'],
  ['contexts','Istorie și comparatism','Periodizare, circulația operelor, receptare și traducere.','periods'],
  ['close','Analiza textului și interpretarea','Interpretare cu dovezi, limite, lecturi alternative.','commentary'],
  ['research','Documentare, surse și bibliografie','Metodologia cercetării, etică academică și citare verificabilă.','research']
 ]
};
export const LIT_EU_PROGRAMS={
 RO:{source:'https://edu.ro/press_rel_11_2026',sourceTitle:'Ministerul Educației: programe Limba și literatura română, clasa a IX-a (2026)',note:'Pentru clasa a IX-a există trasee diferențiate TC, TC+CS Științe sociale și TC+CS Filologie. Profesorul alege operele dintre recomandări; nu impune automat o listă.',regions:false,
 grades:{beginner:['1','2','3','4'],medium:['5','6','7','8','9','10','11','12']},
 tracks:[['TC','Trunchi comun'],['SOC','Umanist – științe sociale'],['FILO','Umanist – filologie']],
 verified:{medium:['9']},
 byGrade:{'9':[
  ['literary','Literatură: module de conținut și forme literare','Competențe literare și culturale, texte alese de profesor în funcție de profil; nu inventa cele cinci titluri de module.','authors'],
  ['interpretation','Lectură, interpretare și context','Interpretarea motivată a textelor, contexte culturale și compararea perspectivelor.','criticism'],
  ['language','Limbă și comunicare','Gramatică funcțională, limbaj adecvat contextului și comunicare.','grammar'],
  ['writing','Redactare, argumentare și reflecție','Producere de texte, eseu și argumentare, diferențiate în funcție de TC/TC+CS.','essay']
 ]}},
 'GB-ENG':{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study',
 sourceTitle:'Department for Education: English, Key Stages 1–4',note:'Programa națională se aplică în Anglia; în KS4, GCSE Literature are cerințe separate, iar exam boards aleg specificațiile. Nu atribui alte reguli Scoției, Țării Galilor sau Irlandei de Nord.',
 grades:{beginner:['Y1','Y2','Y3','Y4','Y5','Y6'],medium:['Y7','Y8','Y9','Y10','Y11','Y12','Y13']},
 verified:{beginner:['Y1','Y2','Y3','Y4','Y5','Y6'],medium:['Y7','Y8','Y9','Y10','Y11']},
 byLevel:{beginner:[
  ['phonics','Citire, fonetică și vocabular','Decodare, ortografie, fluență și înțelegerea textului.','grammar'],
  ['reading','Lectură de povești, poezii și teatru','Lecturi integrale adecvate vârstei, discuții, inferențe.','genres'],
  ['writing','Compunere, transcriere și revizuire','Planificare, structurare, redactare și gramatică.','composition']
 ],medium:[
  ['read','Reading fiction, non-fiction and texts','Reading across periods and genres; evidence and inference.','genres'],
  ['lit','Prose, poetry, drama and context','Shakespeare and seminal world literature in KS3; for KS4 distinguish GCSE specification.','authors'],
  ['write','Writing, grammar and oral communication','Critical responses, composition, editing and presentation.','essay']
 ]}},
 'GB-SCT':{source:'https://education.gov.scot/curriculum-for-excellence/experiences-and-outcomes/',sourceTitle:'Education Scotland: Curriculum for Excellence',note:'Progres pe Early, First, Second, Third și Fourth levels; școlile pot programa conținutul flexibil. Examinările National 5 / Higher sunt separate.',
 grades:{beginner:['Early','First','Second'],medium:['Third','Fourth','National 5','Higher']},verified:{beginner:['Early','First','Second'],medium:['Third','Fourth']},
 byLevel:{beginner:[['talk','Listening and talking','Experiences and outcomes, dialog and expressive skills.','communication'],['read','Reading and responding','Fluency, comprehension and fiction.','genres'],['write','Writing and creativity','Write for purpose, audience and expression.','composition']],medium:[['talk','Communication and discussion','Express viewpoints and evaluate ideas.','communication'],['reading','Critical literacy and literature','Respond to texts, develop interpretation.','criticism'],['writing','Writing, structuring and editing','Different purposes, evidence, reflection.','essay']]}},
 'GB-WLS':{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/languages-literacy-and-communication/designing-your-curriculum/',sourceTitle:'Welsh Government: Languages, Literacy and Communication',note:'Curriculum for Wales: progresie 1–5, nu listă națională rigidă de opere; limba engleză și galeză au parcursuri relevante.',
 grades:{beginner:['Step 1','Step 2','Step 3'],medium:['Step 4','Step 5']},verified:{beginner:['Step 1','Step 2','Step 3'],medium:['Step 4','Step 5']},
 byLevel:{beginner:[['listen','Understanding languages','Ascultare și înțelegere progresivă.','communication'],['create','Literature and imagination','Povești, poezii și răspuns creativ.','genres'],['express','Expressing ourselves','Citire, scriere, exprimare.','composition']],medium:[['interpret','Literature, form and context','Comparare, interpretare, lectură critică.','criticism'],['communicate','Audience, language and identity','Comunicare, registre și valori culturale.','communication'],['writing','Independent writing','Text argumentativ, creativ și reflexiv.','essay']]}},
 FR:{source:'https://eduscol.education.gouv.fr/4503/francais',sourceTitle:'Éduscol: programmes Français, cycles et lycée',note:'Cycle 4: noul program este introdus eșalonat (5e în 2026, 4e în 2027, 3e în 2028). Première 2026–2027 are un program național de opere distinct. Nu atribui noul program tuturor claselor.',
 grades:{beginner:['CP','CE1','CE2','CM1','CM2','6e'],medium:['5e','4e','3e','2nde','1ere','Terminale']},
 verified:{medium:['5e','1ere']},
 byGrade:{'1ere':[
  ['poetry','Poezie: sec. XIX–XXI','Analizează operele și obiectul de studiu al anului școlar 2026–2027, fără a inventa titlurile obligatorii.','poetry'],
  ['ideas','Literatura de idei: sec. XVI–XVIII','Argumentare, idei și texte în contextul epocii.','criticism'],
  ['novel','Roman și povestire: Evul Mediu–sec. XXI','Interpretarea narațiunii și contexte istorice.','narrative'],
  ['theatre','Teatru: sec. XVII–XXI','Dramaturgie, scene, personaje și interpretare.','theatre']
 ],'5e':[
  ['read','Lecture et compréhension','Înțelegerea și interpretarea textelor prin abordarea actualizată din 2026.','genres'],
  ['language','Étude de la langue','Vocabular, sintaxă și ortografie în contexte.','grammar'],
  ['oral','Expression orale','Exprimare argumentată și ascultare.','communication'],
  ['write','Écriture et révision','Exprimare scrisă, redactare și revizuire.','essay']
 ]}},
 DE:{source:'https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',sourceTitle:'KMK: Bildungsstandards Deutsch',note:'KMK stabilește standarde; programa și selecția literaturii diferă între Länder. Landul trebuie precizat pentru a pretinde aliniere exactă.',regions:true,
 grades:{beginner:['1','2','3','4'],medium:['5','6','7','8','9','10','11','12','13']},
 byLevel:{medium:[['read','Lesen und mit Texten umgehen','Interpretare și comparație între texte.','genres'],['speak','Sprechen und Zuhören','Prezentare și discuție.','communication'],['write','Schreiben','Analiză, argumentare, proces de redactare.','essay'],['language','Sprache und Sprachgebrauch untersuchen','Reflecție lingvistică.','grammar']]}},
 ES:{source:'https://boe.es/buscar/act.php?id=BOE-A-2022-4975',sourceTitle:'BOE: Real Decreto 217/2022, ESO',note:'Sistemul național stabilește competențe și saberes básicos; fiecare comunitate autonomă își detaliază curriculumul. Pentru lecuri obligatorii locale trebuie regiune și an.',
 regions:true,grades:{beginner:['1 Primaria','2 Primaria','3 Primaria','4 Primaria','5 Primaria','6 Primaria'],medium:['1 ESO','2 ESO','3 ESO','4 ESO','1 Bach','2 Bach']},
 byLevel:{medium:[['read','Comprensión e interpretación','Lectură critică și recunoașterea sensurilor.','genres'],['lit','Educación literaria','Lectură, interpretare, repertoriu literar contextualizat.','authors'],['language','Reflexión sobre la lengua','Gramatică în contexte.','grammar'],['write','Producción y argumentación','Scriere argumentativă și creativă.','essay']]}},
 IT:{source:'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=26G00021&atto.dataPubblicazioneGazzetta=2026-01-27&bloccoAggiornamentoBreadCrumb=true&classica=true&dataVigenza=&generaTabId=true&qId=&tabID=&tipoDettaglio=originario&title=lbl.dettaglioAtto',sourceTitle:'Indicazioni nazionali, Decreto 221/2025',note:'Cadrul pentru primul ciclu se aplică potrivit tranziției normative. Liceele au alte documente; nu considera primul ciclu programă liceală.',
 grades:{beginner:['1 Primaria','2 Primaria','3 Primaria','4 Primaria','5 Primaria'],medium:['1 Secondaria I','2 Secondaria I','3 Secondaria I','1 Superiore','2 Superiore','3 Superiore','4 Superiore','5 Superiore']},
 verified:{beginner:['1 Primaria','2 Primaria','3 Primaria','4 Primaria','5 Primaria'],medium:['1 Secondaria I','2 Secondaria I','3 Secondaria I']},
 byLevel:{beginner:[['listen','Ascoltare e parlare','Ascultare, exprimare, conversație.','communication'],['read','Leggere e interpretare','Citire, interpretare și texte literare potrivite vârstei.','genres'],['write','Scrivere e riflettere sulla lingua','Scriere, reguli și revizuire.','grammar']],medium:[['read','Lettura di testi e letteratura','Proză, poezie, interpretare motivată.','authors'],['talk','Comprensione e comunicazione','Exprimare orală, argumentare.','communication'],['write','Scrittura e riflessione linguistica','Gramatică, creație și redactare.','essay']]}},
 PT:{source:'https://dge.mec.pt/aprendizagens-essenciais-ensino-secundario',sourceTitle:'DGE: Aprendizagens Essenciais Português 10.º–12.º',note:'Plan pe ani de studiu; sursele publică AE pentru 10.º, 11.º și 12.º. Nu utiliza programe explicit revocate.',
 grades:{beginner:['1','2','3','4','5','6'],medium:['7','8','9','10','11','12']},verified:{medium:['10','11','12']},
 byLevel:{medium:[['oral','Oralidade','Înțelegere și comunicare orală.','communication'],['read','Leitura','Strategii de lectură și interpretare.','genres'],['lit','Educação literária','Texte și contexte literare potrivite anului.','authors'],['write','Escrita','Argumentare, redactare, revizuire.','essay'],['gram','Gramática','Reflecție și corectitudine lingvistică.','grammar']]}},
 PL:{source:'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane?sfnsn=wa',sourceTitle:'Ministerstwo Edukacji Narodowej: reforma 2026',note:'Noua programă pentru primar este introdusă gradual, din septembrie 2026 pentru clasele I și IV. Pentru alte clase se aplică documentele în vigoare anterior.',
 grades:{beginner:['I','II','III','IV'],medium:['V','VI','VII','VIII','Liceum I','Liceum II','Liceum III','Liceum IV']},
 verified:{beginner:['I','IV']},byLevel:{beginner:[['read','Czytanie i literatura','Lecturi, înțelegere și cultură.','genres'],['language','Kształcenie językowe','Comunicare, gramatică și vocabular.','grammar'],['create','Tworzenie wypowiedzi','Formulare și redactare.','composition']]}},
 NL:{source:'https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/definitieve-conceptkerndoelen-nederlands/',sourceTitle:'SLO: Kerndoelen Nederlands 2026',note:'Noile obiective au intrat în vigoare în august 2026, cu tranziție până în 2031; programarea pe ani este responsabilitatea instituției.',
 grades:{beginner:['Groep 3','Groep 4','Groep 5','Groep 6','Groep 7','Groep 8'],medium:['VO jaar 1','VO jaar 2','VO jaar 3','VO jaar 4','VO jaar 5','VO jaar 6']},
 byLevel:{beginner:[['read','Lezen en begrijpen','Citire și înțelegere.','genres'],['talk','Mondeling taalgebruik','Comunicare și dialog.','communication'],['write','Schrijven en taal','Scriere și funcționarea limbii.','grammar']],medium:[['lit','Literatuur en lezen','Interpretare și expresie literară.','authors'],['language','Taalvaardigheid','Structură, comunicare, analiză.','grammar'],['writing','Schrijven en reflecteren','Scriere argumentativă și reflecție.','essay']]}},
 IE:{source:'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/english/',sourceTitle:'NCCA: Junior Cycle English',note:'Junior Cycle English are trei arii integrate: oral language, reading, writing. Senior Cycle are specificații separate.',
 grades:{beginner:['Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6'],medium:['Junior 1','Junior 2','Junior 3','Senior 5','Senior 6']},
 verified:{medium:['Junior 1','Junior 2','Junior 3']},
 byLevel:{medium:[['oral','Oral language','Comunicare și prezentare.','communication'],['reading','Reading','Lectură, literatură și răspuns critic.','authors'],['writing','Writing','Forme, genuri și redactare.','essay']]}},
 FI:{source:'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education',sourceTitle:'Finnish National Agency for Education: National core curriculum',note:'Programa de bază este națională; autoritățile locale și școlile definesc detalii. Limba maternă și literatura este o disciplină comună, dar variantele de limbă diferă.',
 grades:{beginner:['1','2','3','4','5','6'],medium:['7','8','9','Upper secondary 1','Upper secondary 2','Upper secondary 3']},
 verified:{beginner:['1','2','3','4','5','6'],medium:['7','8','9']},
 byLevel:{beginner:[['communication','Interaction and expression','Comunicare și exprimare.','communication'],['reading','Interpreting texts','Lectură și receptare.','genres'],['writing','Producing texts','Scriere și vocabular.','composition']],medium:[['read','Reading and literature','Interpretarea textelor și cultura literară.','authors'],['produce','Producing and interpreting texts','Texte argumentate și analize.','essay'],['language','Language and cultural awareness','Limba și contextele culturale.','grammar']]}}
};
export function litEuropeanPlan(country, level, grade, track){
 const profile=LIT_EU_PROGRAMS[country]||null;
 const generic=LIT_EU_COMMON[level]||LIT_EU_COMMON.medium;
 const gradeKey=String(grade||'');
 const units=profile?.byGrade?.[gradeKey]||profile?.byLevel?.[level]||generic;
 const verified=Boolean(profile?.source&&profile?.verified?.[level]?.includes(gradeKey));
 const regionalPending=Boolean(profile?.regions);
 const selectedTrack=String(track||'TC');
 return {
  units:units.map((x,i)=>({id:String(x[0])+'-'+i,label:x[1],focus:x[2],topic:x[3],order:i+1})),
  source:profile?.source||null,sourceTitle:profile?.sourceTitle||null,
  verified:verified&&!regionalPending,requiresRegion:regionalPending,
  status:!profile?'orientative':verified&&!regionalPending?'framework-verified':'partial',
  note:profile?.note||'Ordine didactică orientativă; programa oficială a acestei țări și clase nu este încă verificată.',
  grade:gradeKey,track:selectedTrack
 };
}
