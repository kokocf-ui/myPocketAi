// Italy-only Mathematics school framework for 2026/27.
// Do not copy the Romanian 4+4+4 or English KS stage model.
// IT: primaria 5 years, secondaria di I grado 3, secondaria di II grado 5.
// Source: DM 221/2025 (GU 27 January 2026); the new first-cycle guidelines
// begin ONLY with P1 and M1 in school year 2026/27, phasing in by cohort.
// https://www.gazzettaufficiale.it/eli/id/2026/01/27/26G00021/sg
// https://umi.dm.unibo.it/indicazioni-nazionali-prima-del-2026/
// Second-cycle licei are distinct from technical/professional pathways.
// https://www.indire.it/lucabas/lkmw_file/licei2010/indicazioni_nuovo_impaginato/_decreto_indicazioni_nazionali.pdf
// Sources define national/cycle objectives; the proposed per-year lesson order
// below is intentionally ADVISORY, not certified as a state-mandated year syllabus.
const current='https://www.gazzettaufficiale.it/eli/id/2026/01/27/26G00021/sg';
const previous='https://umi.dm.unibo.it/indicazioni-nazionali-prima-del-2026/';
const upper='https://www.indire.it/lucabas/lkmw_file/licei2010/indicazioni_nuovo_impaginato/_decreto_indicazioni_nazionali.pdf';
const ordinal=['prima','seconda','terza','quarta','quinta'];
const primary=Array.from({length:5},(_,i)=>({
 id:'P'+(i+1),ro:'Școala primară italiană · anul '+(i+1),
 en:'Italian primary school · year '+(i+1),
 it:'Classe '+ordinal[i]+' · scuola primaria',
 nationalYearVerified:true,curriculumVerified:false
}));
const lower=Array.from({length:3},(_,i)=>({
 id:'M'+(i+1),ro:'Secundar I italian · anul '+(i+1),
 en:'Italian lower secondary · year '+(i+1),
 it:'Classe '+ordinal[i]+' · secondaria di I grado',
 nationalYearVerified:true,curriculumVerified:false
}));
const secondary=Array.from({length:5},(_,i)=>({
 id:'S'+(i+1),ro:'Secundar II italian · anul '+(i+1),
 en:'Italian upper secondary · year '+(i+1),
 it:(i<2?'Primo biennio':i<4?'Secondo biennio':'Quinto anno')+' · '+(i+1)+'º anno',
 nationalYearVerified:true,curriculumVerified:false
}));
export const ITALY_MATH_YEARS=Object.freeze({
 beginner:primary,lower,medium:secondary
});
export const ITALY_MATH_SOURCES=Object.freeze({current,previous,upper});
const a=(id,ro,en,it)=>({id,ro,en,it});
export const ITALY_MATH_GRADE_AREAS=Object.freeze({
 P1:[a('arithmetic','Numerație și operații intuitive','Counting and intuitive calculation','Numeri e prime operazioni'),
     a('geometry','Spațiu și forme simple','Space and basic shapes','Spazio e figure'),
     a('measurement','Comparații și măsurări concrete','Concrete comparisons and measurement','Confronti e misure')],
 P2:[a('arithmetic','Valoarea pozițională și calcule','Place value and calculation','Valore posizionale e calcolo'),
     a('geometry','Figuri și poziții în plan','Shapes and positions','Figure e posizioni'),
     a('measurement','Lungimi, timp și bani','Length, time and money','Lunghezze, tempo e denaro')],
 P3:[a('arithmetic','Operații și probleme în contexte reale','Operations and real-world problems','Operazioni e problemi'),
     a('geometry','Figuri și simetrii','Shapes and symmetry','Figure e simmetrie'),
     a('measurement','Măsurători și unități uzuale','Common measures and units','Misure e unità')],
 P4:[a('arithmetic','Fracții, zecimale și probleme','Fractions, decimals and problems','Frazioni, decimali e problemi'),
     a('geometry','Poligoane, unghiuri și contururi','Polygons, angles and boundaries','Poligoni, angoli e contorni'),
     a('measurement','Perimetru și măsurări','Perimeter and measurement','Perimetro e misure')],
 P5:[a('arithmetic','Numere raționale și operații','Rational numbers and calculation','Numeri razionali e calcolo'),
     a('geometry','Figuri plane și spațiu','Plane and spatial shapes','Figure piane e spazio'),
     a('measurement','Arii, volume și date măsurate','Area, volume and measured data','Aree, volumi e misure')],
 M1:[a('algebra','Numere, calcule și limbaj matematic','Numbers, operations and symbols','Numeri e linguaggio matematico'),
     a('geometry','Geometria plană: construcții și unghiuri','Plane geometry and angles','Geometria piana'),
     a('statistics','Date, tabele și grafice','Data, tables and charts','Dati, tabelle e grafici')],
 M2:[a('algebra','Numere raționale, rapoarte și proporții','Rational numbers, ratios and proportions','Razionali, rapporti e proporzioni'),
     a('geometry','Arii, patrulatere și relații geometrice','Areas and quadrilaterals','Aree e quadrilateri'),
     a('statistics','Distribuții, medii și probabilități','Distributions, averages and probability','Dati e probabilità')],
 M3:[a('algebra','Ecuații și relații între mărimi','Equations and quantitative relations','Equazioni e relazioni'),
     a('geometry','Geometrie în spațiu și demonstrații','Solids and geometric reasoning','Geometria solida e argomentazione'),
     a('statistics','Probabilități și interpretarea datelor','Probability and data interpretation','Probabilità e interpretazione dati')],
 S1:[a('algebra','Mulțimi numerice și expresii algebrice','Number systems and algebraic expressions','Insiemi numerici e algebra'),
     a('functions','Relații și funcții elementare','Relations and early functions','Relazioni e funzioni'),
     a('geometry','Geometrie euclidiană și demonstrații','Euclidean geometry and proof','Geometria euclidea'),
     a('statistics','Date și reprezentări statistice','Statistics and data displays','Dati e rappresentazioni')],
 S2:[a('algebra','Ecuații, inecuații și sisteme','Equations, inequalities and systems','Equazioni, disequazioni e sistemi'),
     a('functions','Grafice și relații algebrice','Graphs and algebraic relations','Grafici e relazioni'),
     a('geometry','Plan cartezian și transformări','Coordinate geometry and transformations','Piano cartesiano e trasformazioni'),
     a('statistics','Statistică și probabilități introductive','Statistics and basic probability','Statistica e probabilità')],
 S3:[a('algebra','Polinoame și ecuații de grad superior','Polynomials and higher-degree equations','Polinomi ed equazioni'),
     a('functions','Funcții și transformări de grafice','Functions and graph transformations','Funzioni e grafici'),
     a('trigonometry','Trigonometrie în triunghiuri','Triangle trigonometry','Trigonometria'),
     a('geometry','Geometrie analitică','Analytic geometry','Geometria analitica'),
     a('statistics','Probabilități și combinatorică','Probability and counting','Probabilità e calcolo combinatorio')],
 S4:[a('analysis','Limite și analiza variației','Limits and change','Limiti e variazioni'),
     a('trigonometry','Funcții și identități trigonometrice','Trigonometric functions','Funzioni trigonometriche'),
     a('statistics','Probabilitate și modele statistice','Probability and statistical models','Probabilità e modelli'),
     a('algebra','Numere complexe și algebră','Complex numbers and algebra','Numeri complessi e algebra'),
     a('functions','Funcții și comportamentul graficelor','Function behaviour','Studio delle funzioni'),
     a('geometry','Vectori și geometrie','Vectors and geometry','Vettori e geometria')],
 S5:[a('analysis','Derivate, integrale și aplicații','Derivatives and integrals','Derivate, integrali e applicazioni'),
     a('algebra','Algebră și modele matematice','Algebra and mathematical models','Algebra e modelli'),
     a('statistics','Probabilități și inferență introductivă','Probability and introductory inference','Probabilità e inferenza'),
     a('functions','Studiul funcțiilor și graficelor','Function analysis','Studio di funzioni e grafici'),
     a('trigonometry','Funcții trigonometrice și ecuații','Trigonometric equations','Equazioni trigonometriche'),
     a('geometry','Geometrie și reprezentări spațiale','Geometry and spatial models','Geometria e spazio')]
});
export function italyMathGradeProfile(grade){
 const id=String(grade||'');
 const stage=id.startsWith('P')?'beginner':id.startsWith('M')?'lower':id.startsWith('S')?'medium':null;
 if(!stage||!ITALY_MATH_GRADE_AREAS[id])return null;
 const number=Number(id.slice(1));
 const newCohort=(stage==='beginner'||stage==='lower')&&number===1;
 const source=stage==='medium'?upper:newCohort?current:previous;
 const cohort=stage==='medium'?'second-cycle-pathway-required':
  newCohort?'dm-221-2025-entry-2026':'previous-first-cycle-cohort';
 const note=stage==='medium'?
  'Italia, scuola secondaria di II grado, '+number+'º anno: primul/al doilea bieniu și anul terminal au trasee diferite între Liceo scientifico, alte licee și Istituti tecnici/professionali. Fără filieră selectată, distribuția lecțiilor este orientativă; niciun plan unic de liceu nu este certificat.':
  'Italia, '+(stage==='beginner'?'scuola primaria':'secondaria di I grado')+
  ', anul '+number+': '+(newCohort?
   'cohortă intrată în 2026/27 sub DM 221/2025; obiectivele sunt definite pe cicluri, nu ca un cuprins național anual.':
   'cohortă care în 2026/27 urmează încă indicațiile precedente; reforma DM 221/2025 nu se aplică retroactiv.');
 return {country:'IT',grade:id,stage,source,cohort,note,units:ITALY_MATH_GRADE_AREAS[id]};
}
// A small set of original Italian entry lessons. Additional lessons currently
// remain general learning aids and are NOT labelled as Italian textbook chapters.
const FOCAL={
 'P1|arithmetic':['Contiamo oggetti reali','Count real objects','Pentru a număra corect, asociem fiecărui obiect un singur număr și nu sărim peste niciun obiect. Ultimul număr rostit arată câte obiecte sunt în total.','● ● ● = 3','Așezăm 3 pietricele; atingem fiecare pe rând, spunând unu, doi, trei. Verificăm că nu am numărat vreun obiect de două ori.','Câte creioane sunt în grupa cu 2 creioane și încă 1 creion?','3 creioane.'],
 'P1|geometry':['Destra, sinistra, sopra, sotto','Position and direction','Putem descrie poziția obiectelor folosind dreapta, stânga, deasupra și dedesubt. Comparăm locuri reale, nu calcule geometrice abstracte.','A la dreapta lui B','Punem un cub pe masă și un al doilea în dreapta sa. Îi cerem elevului să spună unde se află al doilea cub.','Pune o carte sub un caiet. Unde este cartea?','Sub caiet.'],
 'P1|measurement':['Confrontiamo lunghezze','Compare lengths','Pentru a compara două lungimi, aliniem obiectele la unul dintre capete. Cel care se întinde mai departe este mai lung; nu ghicim după culoare.','lung > scurt','Așezăm două creioane cu vârfurile aliniate. Dacă unul ajunge mai departe, acela este mai lung.','Cum compari două panglici de lungimi diferite?','Le aliniez la un capăt și observ care este mai lungă.'],
 'M1|algebra':['Numeri naturali e operazioni','Natural numbers and operations','Operațiile cu numere naturale respectă ordinea convenită: parantezele, apoi înmulțirea și împărțirea, apoi adunarea și scăderea. Verificăm rezultatul prin estimare.','6 + 2 × 4 = 14','Întâi efectuăm 2×4=8, apoi 6+8=14. Un rezultat de 32 ar proveni dintr-o ordine greșită a operațiilor.','Calculează 9 + 3×2.','15.'],
 'M1|geometry':['Segmenti e angoli','Segments and angles','Segmentul are două capete și lungime măsurabilă. Unghiul este format de două semidrepte cu aceeași origine; în grade îi măsurăm deschiderea.','unghi drept = 90°','Desenăm segmentul AB de 5 cm, apoi două semidrepte cu origine comună O. Folosim raportorul pentru a măsura unghiul dintre ele.','Cât măsoară un unghi drept?','90°.'],
 'M1|statistics':['Raccogliamo e leggiamo i dati','Collect and read data','Datele pot fi grupate în tabele. Frecvența arată de câte ori apare o valoare. Reprezentăm datele cu aceeași scară și explicăm unitățile.','2, 3, 2, 4 → f(2)=2','Din lista 2,3,2,4, numărul 2 apare de două ori; 3 și 4 apar o singură dată. Totalul frecvențelor este 4.','Câte apariții are 5 în 5,2,5,3,5?','3.'],
 'S1|algebra':['Espressioni e insiemi numerici','Expressions and number sets','Expresiile algebrice conțin variabile pentru numere necunoscute. La substituție folosim paranteze când valoarea variabilei este negativă.','2x+3, x=-2 → -1','Înlocuim x cu -2: 2×(-2)+3=-4+3=-1. Nu interpretăm „2x” ca lipire a cifrei 2 de număr.','Calculează 3x−1 pentru x=−2.','−7.'],
 'S1|functions':['Relazioni e funzioni','Relations and functions','O funcție asociază fiecărui element din domeniu o singură valoare în codomeniu. Putem descrie regula prin expresie, tabel sau puncte pe grafic.','f(x)=2x+1','Pentru x=0,1,2 obținem f(x)=1,3,5. Marcăm punctele (0,1),(1,3),(2,5) și verificăm fiecare pereche prin regulă.','Cât este f(3) când f(x)=2x+1?','7.'],
 'S1|geometry':['Dimostrazioni di geometria euclidea','Euclidean geometry proofs','Într-o demonstrație folosim ipoteze explicit date și proprietăți cunoscute. Un desen sugerează o idee, dar nu dovedește singur lungimi ori unghiuri.','unghiuri opuse la vârf = egale','Două drepte se intersectează în O. Unghiurile opuse la vârf au aceeași măsură deoarece fiecare este suplimentar aceluiași unghi adiacent.','Dacă un unghi are 70°, cât are cel opus la vârf?','70°.']
};
export function italyMathFocalLessons({grade,topic}={}){
 const id=String(grade||''),t=String(topic||'');
 const row=FOCAL[id+'|'+t],profile=italyMathGradeProfile(id);
 if(!row||!profile)return [];
 return [{id:'math-it-2026-'+id.toLowerCase()+'-'+t,
  country:'IT',grade:id,topic:t,subject:'math',stage:profile.stage==='beginner'?'primary':profile.stage==='medium'?'intermediate':'lower',
  level:profile.stage==='medium'?'intermediate':'beginner',
  title:row[0],enTitle:row[1],statement:row[2],formula:row[3],
  worked:row[4],practice:row[5],answers:row[6],aliases:[],
  source:profile.source,sourceStatus:'italian-cycle-topic-reviewed',
  curriculumCompletion:'partial-source-review'}];
}
