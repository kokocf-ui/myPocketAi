// Mathematics learning paths for every European country in the Education picker.
// A progression is *advisory* unless an official country/grade source is attached.
// Stage years are supplied by the shared school-year mapping, never inferred from
// Romanian class numbers (UK year numbering and reform cohorts differ).
const PATHS=Object.freeze({
 beginner:[
  [['arithmetic','Aritmetică: numere și adunare/scădere'],['shapes','Forme geometrice'],['measures','Măsurători']],
  [['arithmetic','Aritmetică: înmulțire și împărțire'],['shapes','Forme și corpuri geometrice'],['measures','Măsurători și probleme']],
  [['arithmetic','Aritmetică: operații și probleme'],['shapes','Figuri, perimetre și spațiu'],['measures','Unități de măsură']],
  [['arithmetic','Aritmetică: fracții și operații'],['shapes','Figuri și corpuri geometrice'],['measures','Măsurători și date']]
 ],
 lower:[
  [['algebra','Algebră: numere, operații și expresii'],['geometry','Geometrie: noțiuni introductive'],['data','Date și reprezentări']],
  [['algebra','Algebră: rapoarte, proporții și ecuații'],['geometry','Geometrie: unghiuri și figuri'],['data','Statistică introductivă']],
  [['algebra','Algebră: expresii și ecuații'],['geometry','Geometrie: proprietăți și demonstrații'],['probability','Probabilități introductive']],
  [['algebra','Algebră: ecuații, inecuații și funcții'],['geometry','Geometrie: teoreme și aplicații'],['data','Statistică și probabilități']]
 ],
 medium:[
  [['algebra','Algebră și ecuații'],['functions','Funcții și grafice'],['geometry','Geometrie']],
  [['functions','Funcții și grafice'],['trigonometry','Trigonometrie'],['algebra','Algebră']],
  [['analysis','Analiză matematică introductivă'],['trigonometry','Trigonometrie'],['probability','Statistică și probabilități']],
  [['analysis','Analiză matematică'],['algebra','Algebră și aplicații'],['probability','Probabilități']]
 ],
 advanced:[
  [['analysis','Analiză matematică'],['linear','Algebră liniară'],['discrete','Matematică discretă']],
  [['analysis','Analiză în mai multe variabile'],['linear','Algebră liniară'],['probability','Probabilități']],
  [['differential','Ecuații diferențiale'],['analysis','Analiză avansată'],['discrete','Matematică discretă']],
  [['analysis','Matematică avansată pe domeniu'],['probability','Statistică matematică'],['discrete','Structuri discrete']]
 ]
});
export function mathCountryGradeAreas({country,stage,grade,years}={}){
 const st=stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
 const yearList=Array.isArray(years)?years:[];
 const index=yearList.findIndex(x=>String(x.id)===String(grade));
 if(!PATHS[st]||index<0)return {status:'invalid-selection',country,stage:st,grade,units:[]};
 const sequence=PATHS[st];
 const row=sequence[Math.min(sequence.length-1,Math.floor(index*sequence.length/Math.max(sequence.length,yearList.length)))];
 return {status:'general-learning',country,stage:st,grade,
  note:'Parcurs matematic orientativ, diferențiat pe etapă și an; nu reprezintă programa națională verificată.',
  units:row.map(([id,ro])=>({id,ro,en:({
   arithmetic:'Arithmetic',shapes:'Shapes and space',measures:'Measurement',
   algebra:'Algebra',geometry:'Geometry',data:'Data and statistics',
   probability:'Probability',functions:'Functions and graphs',
   trigonometry:'Trigonometry',analysis:'Mathematical analysis',
   linear:'Linear algebra',discrete:'Discrete mathematics',
   differential:'Differential equations'})[id]||ro,focus:'',lessonCount:0}))};
}
