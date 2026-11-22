// Mathematics learning paths for every European country in the Education picker.
// A progression is *advisory* unless an official country/grade source is attached.
// Stage years are supplied by the shared school-year mapping, never inferred from
// Romanian class numbers (UK year numbering and reform cohorts differ).
const PATHS=Object.freeze({
 beginner:[
  [['arithmetic','Aritmetică: numere și adunare/scădere'],['geometry','Forme geometrice'],['measurement','Măsurători']],
  [['arithmetic','Aritmetică: înmulțire și împărțire'],['geometry','Forme și corpuri geometrice'],['measurement','Măsurători și probleme']],
  [['arithmetic','Aritmetică: operații și probleme'],['geometry','Figuri, perimetre și spațiu'],['measurement','Unități de măsură']],
  [['arithmetic','Aritmetică: fracții și operații'],['geometry','Figuri și corpuri geometrice'],['measurement','Măsurători și date']]
 ],
 lower:[
  [['algebra','Algebră: numere, operații și expresii'],['geometry','Geometrie: noțiuni introductive'],['statistics','Date și reprezentări']],
  [['algebra','Algebră: rapoarte, proporții și ecuații'],['geometry','Geometrie: unghiuri și figuri'],['statistics','Statistică introductivă']],
  [['algebra','Algebră: expresii și ecuații'],['geometry','Geometrie: proprietăți și demonstrații'],['statistics','Probabilități introductive']],
  [['algebra','Algebră: ecuații, inecuații și funcții'],['geometry','Geometrie: teoreme și aplicații'],['statistics','Statistică și probabilități']]
 ],
 medium:[
  [['algebra','Algebră și ecuații'],['functions','Funcții și grafice'],['geometry','Geometrie']],
  [['functions','Funcții și grafice'],['trigonometry','Trigonometrie'],['algebra','Algebră']],
  [['analysis','Analiză matematică introductivă'],['trigonometry','Trigonometrie'],['statistics','Statistică și probabilități']],
  [['analysis','Analiză matematică'],['algebra','Algebră și aplicații'],['statistics','Probabilități']]
 ],
 advanced:[
  [['analysis','Analiză matematică'],['linear-algebra','Algebră liniară'],['discrete','Matematică discretă']],
  [['analysis','Analiză în mai multe variabile'],['linear-algebra','Algebră liniară'],['statistics','Probabilități']],
  [['differential','Ecuații diferențiale'],['analysis','Analiză avansată'],['discrete','Matematică discretă']],
  [['analysis','Matematică avansată pe domeniu'],['statistics','Statistică matematică'],['discrete','Structuri discrete']]
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
   arithmetic:'Arithmetic',geometry:'Geometry and shapes',measurement:'Measurement',
   algebra:'Algebra',statistics:'Statistics and probability',functions:'Functions and graphs',
   trigonometry:'Trigonometry',analysis:'Mathematical analysis',
   'linear-algebra':'Linear algebra',discrete:'Discrete mathematics',
   differential:'Differential equations'})[id]||ro,focus:'',lessonCount:0}))};
}
