// Browser-only, lazy materialization of a selected Literature school year.
// Keeping year expansions out of the initial Android HTML reduces payload size.
// Data remains original teaching material, never a government reading list.
export function literatureClientGradeExpand(programs,journey){
 if(!programs||!journey?.country||!journey?.grade)return null;
 const country=String(journey.country),grade=String(journey.grade);
 let profile=programs[country];
 if(!profile){
  profile={source:null,sourceTitle:null,verified:{},regions:false,grades:{},
   byGrade:{},byLevel:{},
   note:'Parcurs didactic original orientativ; nu este programa oficială a acestei jurisdicții. Verifică limba de predare, regiunea și filiera.'};
  programs[country]=profile;
 }
 profile.byGrade=profile.byGrade||{};
 profile.grades=profile.grades||{};
 const stageList=['beginner','lower','medium','advanced'];
 const inferred=stageList.find(s=>(profile.grades[s]||[]).includes(grade));
 const stage=inferred||(
  stageList.includes(journey.level)?journey.level:
  stageList.includes(journey.schoolLevel)?journey.schoolLevel:
  /universit|higher.education|university/i.test(grade)?'advanced':
  'medium');
 const names={
  beginner:['Primele texte, cuvinte și personaje','Povestire, întrebări și dialog',
   'Ideea principală și detaliile importante','Compararea poveștilor și a poeziilor',
   'Tipuri de texte și sensuri','Lectură critică și comunicare clară'],
  lower:['Basmul, legenda și naratorul','Poezia și exprimarea figurată',
   'Personajul și punctul de vedere','Dialog dramatic și comparație',
   'Lectura critică și argumentarea','Sinteza și comentariul literar'],
  medium:['Genuri și metode de interpretare','Opera și contextul cultural',
   'Perspectivă, tehnici și limbaj','Curente literare și argumente',
   'Comparație și analiză independentă','Portofoliu și evaluare critică'],
  advanced:['Poetică și cercetare literară','Seminar de critică și receptare',
   'Proiect academic și metodologie']
 };
 const order=(profile.grades[stage]||[]).indexOf(grade);
 const number=Number((grade.match(/\d+/)||[])[0])||1;
 const index=order>=0?order:(number-1);
 const theme=names[stage][Math.min(index,names[stage].length-1)];
 const sections=[
  ['parcurs','Obiective și progresia clasei','genres','identify the key learning goal'],
  ['intelegere','Înțelegerea unui text','genres','explain textual evidence'],
  ['narativ','Proză, narator și personaje','narrative','trace characters and plot'],
  ['poezie','Poezie, vers și expresivitate','poetry','interpret imagery'],
  ['dialog','Dialog și prezentare orală','communication','explain dialogue and tone'],
  ['vocabular','Vocabular în context','grammar','explain contextual meaning'],
  ['exprimare','Construcția frazei','grammar','write clearly'],
  ['redactare','Compunere și revizuire','composition','organise an original text'],
  ['interpretare','Comparație și interpretare','commentary','support interpretation'],
  ['verificare','Exerciții și verificare','essay','demonstrate the learning goal']
 ];
 const texts={
  beginner:['Într-o zi, Mara a găsit o carte în parc și a început să o citească.',
   'Copiii au privit picăturile pe fereastră și au povestit ce au observat.'],
  lower:['La început, nimeni nu credea mărturia călătorului. O scrisoare a schimbat totul.',
   'Fata își păstrase promisiunea, dar cel mai bun prieten nu știa acest lucru.'],
  medium:['Naratorul revine după zece ani și descoperă că amintirea îi schimbă perspectiva.',
   'Două personaje descriu aceeași întâlnire folosind expresii foarte diferite.'],
  advanced:['Două ediții ale poemului păstrează ideea centrală, dar modifică punctuația.',
   'O interpretare critică este confruntată cu pasajele verificabile ale operei.']
 };
 const before=profile.byGrade[grade]||[];
 // Preserve the original national sequences already containing substantial
 // authored lessons (particularly the seven dedicated country packs).
 if(before.length>=15)return before;
 const cap=country==='RO'?12:Number.POSITIVE_INFINITY;
 const ids=new Set(before.map(row=>String(row[0])));
 const titles=new Set(before.map(row=>String(row[1]).toLowerCase()));
 const rows=before.map(row=>row.slice());
 const ordered=country==='RO'?
  ['intelegere','dialog','vocabular','interpretare','verificare',
   'poezie','narativ','redactare','parcurs','exprimare']:
  sections.map(s=>s[0]);
 for(const part of ordered){
  if(rows.length>=cap)break;
  const info=sections.find(s=>s[0]===part);
  const name=part==='parcurs'?theme:info[1]+' · '+grade;
  const id='eu-year-'+country.toLowerCase()+'-'+stage+'-'+
   grade.toLowerCase().replace(/[^a-z0-9-]/g,'-')+'-'+part;
  if(ids.has(id)||titles.has(name.toLowerCase()))continue;
  const original=(texts[stage]||texts.medium)[(index+rows.length)%2];
  const focus='Țara: '+country+'; an/clasă: '+grade+'; '+theme+
   '. Obiectivul lecției: '+info[3]+'. Rezultat observabil: aplic și explic independent.'+
   ' Fragment original creat pentru exercițiu: „'+original+'”.';
  rows.push([id,name,focus,info[2]]);ids.add(id);titles.add(name.toLowerCase());
 }
 profile.byGrade[grade]=rows;
 return rows;
}
