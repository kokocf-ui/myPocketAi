export const FUN_GENERATOR_SCRIPT=String.raw`// Generative offline entertainment. Every "new puzzle" is composed afresh from definitions.
const FUN_WORDS=[
['APA','Lichid fără culoare, necesar vieții'],['AER','Amestecul de gaze pe care îl respirăm'],['SOARE','Steaua Sistemului Solar'],['LUNA','Satelitul natural al Pământului'],['CER','Bolta pe care vedem norii'],['NOR','Masă de picături suspendate'],['PLOAIE','Apă care cade din nori'],['FULG','Cristal mic de zăpadă'],['VANT','Aer pus în mișcare'],['NINSOARE','Cădere de fulgi din nori'],['IARNA','Anotimpul zăpezii'],['VARA','Anotimpul cel mai cald'],['TOAMNA','Anotimpul recoltei'],['MARTIE','Prima lună de primăvară'],['APRILIE','Luna care urmează după martie'],['MAI','Luna dintre aprilie și iunie'],['IUNIE','Prima lună de vară'],['IULIE','Luna dintre iunie și august'],['AUGUST','Ultima lună de vară'],['OCTOMBRIE','Luna dintre septembrie și noiembrie'],
['CARTE','Volum cu pagini pentru lectură'],['PAGINA','O față a unei file'],['STILOU','Instrument de scris cu cerneală'],['CREION','Instrument de scris cu mină'],['CAIET','File legate pentru notițe'],['PENAR','Etui pentru instrumente de scris'],['RIGLA','Instrument pentru trasarea liniilor drepte'],['HARTA','Reprezentare a unui teritoriu'],['CLASA','Grupă de elevi care învață împreună'],['SCOALA','Instituție pentru învățământ'],['LECTIE','Unitate de învățare'],['PROFESOR','Persoană care predă la școală'],['ELEV','Copil ori tânăr care frecventează școala'],['LITERA','Semn folosit pentru a scrie un sunet'],['CIFRA','Semn pentru scrierea numerelor'],['NUMAR','Expresie a unei cantități'],['CERC','Figură rotundă delimitată de o circumferință'],['PATRAT','Figură cu patru laturi egale și unghiuri drepte'],['UNGHI','Deschidere formată de două semidrepte'],
['CASA','Clădire pentru locuit'],['USA','Se deschide pentru a intra într-o cameră'],['GEAM','Sticlă fixată într-o fereastră'],['MASA','Mobilă la care mâncăm'],['SCAUN','Mobilă pe care ședem'],['PAT','Mobilă pentru dormit'],['PERNA','Obiect moale pe care sprijinim capul'],['COVOR','Țesătură întinsă pe podea'],['CEAS','Instrument care arată ora'],['OGLINDA','Suprafață în care ne vedem chipul'],['CHEIE','Obiect cu care deschidem o încuietoare'],['BUCATARIE','Încăpere pentru pregătirea mâncării'],['CAMERA','Încăpere dintr-o locuință'],['ACOPERIS','Partea de sus care apără casa de ploaie'],['LUMINA','Face obiectele vizibile'],['LUMANARE','Obiect cu fitil care arde și luminează'],
['MUNTE','Formă înaltă de relief'],['DEAL','Ridicătură de pământ mai mică decât muntele'],['VALE','Depresiune alungită între înălțimi'],['RAU','Apă curgătoare naturală'],['LAC','Întindere de apă înconjurată de uscat'],['MARE','Întindere mare de apă sărată'],['OCEAN','Cea mai mare întindere de apă sărată'],['PADURE','Loc acoperit cu mulți copaci'],['COPAC','Plantă cu trunchi lemnos și coroană'],['FRUNZA','Parte verde a unei plante'],['FLOARE','Parte colorată a multor plante'],['RADACINA','Parte a plantei care absoarbe apa din sol'],['SAMANTA','Poate da naștere unei noi plante'],['GRADINA','Teren unde cultivăm flori sau legume'],['MAR','Fruct rotund care crește în pom'],['PARA','Fruct cu partea de jos mai lată'],['PRUNA','Fruct de prun'],['NUCA','Fruct cu miez în coajă tare'],['LAMAIE','Citrus galben și acru'],['PORTOCALA','Fruct citric de culoare portocalie'],
['PISICA','Animal domestic care miaună'],['CAINE','Animal domestic care latră'],['CAL','Animal folosit și la călărie'],['VACA','Animal de fermă care dă lapte'],['OAIE','Animal domestic crescut pentru lână'],['CAPRA','Animal domestic care behăie'],['URS','Animal mare care hibernează uneori'],['VULPE','Animal roșcat cu coadă stufoasă'],['LUP','Animal sălbatic înrudit cu câinele'],['ARICI','Animal mic acoperit cu țepi'],['IEPURE','Animal cu urechi lungi'],['LEU','Felina numită regele animalelor'],['TIGRU','Felina cu dungi'],['ZEBRA','Animal african cu dungi albe și negre'],['ELEFANT','Animal mare cu trompă'],['ALBINA','Insectă care produce miere'],['FLUTURE','Insectă cu aripi colorate'],['PASARE','Animal cu pene și cioc'],['CIOARA','Pasăre de obicei neagră care croncăne'],['BARZA','Pasăre călătoare cu picioare lungi'],['RANDUNICA','Pasăre migratoare cu coadă despicată'],['PESTE','Animal care trăiește în apă și respiră prin branhii'],['DELFIN','Mamifer marin inteligent'],['BALENA','Mamifer marin foarte mare'],
['TREN','Vehicul pe șine'],['AVION','Vehicul care zboară cu aripi fixe'],['MASINA','Autovehicul pentru drumuri'],['AUTOBUZ','Vehicul rutier cu multe locuri'],['BICICLETA','Vehicul cu două roți și pedale'],['BARCA','Ambarcațiune mică'],['VAPOR','Navă care transportă pasageri sau marfă'],['DRUM','Cale amenajată pentru deplasare'],['POD','Construcție care trece peste un obstacol'],['STATIE','Loc unde opresc vehiculele publice'],['GARA','Clădire și loc de plecare a trenurilor'],['AEROPORT','Loc amenajat pentru decolări și aterizări'],
['ORAS','Așezare cu multe clădiri și străzi'],['SAT','Așezare rurală'],['STRADA','Drum în interiorul unei localități'],['PIATA','Spațiu public unde se pot vinde produse'],['PARC','Loc public amenajat cu alei și copaci'],['MUZEU','Instituție care expune obiecte de patrimoniu'],['TEATRU','Loc în care se joacă spectacole'],['CINEMA','Loc unde se proiectează filme'],['BIBLIOTECA','Loc cu cărți pentru citit și împrumutat'],['SPITAL','Instituție pentru îngrijiri medicale'],['FARMACIE','Loc de unde se cumpără medicamente'],['RESTAURANT','Local în care se servește mâncare'],
['MUZICA','Arta de a combina sunetele'],['CANTEC','Compoziție muzicală vocală'],['PIAN','Instrument muzical cu clape'],['VIOARA','Instrument cu coarde și arcuș'],['CHITARA','Instrument cu coarde ciupite'],['TOBA','Instrument de percuție'],['NOTA','Semn folosit în scrierea muzicii'],['DANS','Mișcare ritmică pe muzică'],['FILM','Operă cinematografică'],['ACTOR','Persoană care interpretează un rol'],['POEZIE','Operă literară în versuri'],['ROMAN','Operă literară narativă de întindere mare'],['POVESTE','Relatare reală ori imaginară'],
['TIMP','Succesiunea momentelor și duratelor'],['ZI','Interval dintre două nopți'],['NOAPTE','Interval în care este întuneric'],['DIMINEATA','Prima parte a zilei'],['SEARA','Parte a zilei înaintea nopții'],['SAMBATA','Zi a săptămânii dinainte de duminică'],['DUMINICA','Ultima zi a săptămânii'],['SAPTAMANA','Interval de șapte zile'],['AN','Interval de douăsprezece luni'],['MINUT','Unitate de timp cu șaizeci de secunde'],['SECUNDA','A șaizecea parte a unui minut'],
['PRIETEN','Persoană de care te leagă o relație de prietenie'],['FAMILIE','Grup de oameni înrudiți'],['MAMA','Părinte de gen feminin'],['TATA','Părinte de gen masculin'],['FRATE','Fiul acelorași părinți'],['SORA','Fiica acelorași părinți'],['COPIL','Persoană aflată la vârsta copilăriei'],['BUNICA','Mama unuia dintre părinți'],['BUNIC','Tatăl unuia dintre părinți'],['VECIN','Persoană care locuiește aproape'],['ZAMBET','Expresie a feței când ne bucurăm'],['BUCURIE','Stare de mare mulțumire']
];
function funPuzzleSeed(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]}catch{return (Date.now()^Math.floor(Math.random()*4294967295))>>>0}}

let FUN_DENSE_CACHE={};
function funDenseProfiles(n){
 if(FUN_DENSE_CACHE[n])return FUN_DENSE_CACHE[n];
 const masters=FUN_WORDS.filter(w=>w[0].length===n);
 const words4=FUN_WORDS.filter(w=>w[0].length===4),words5=FUN_WORDS.filter(w=>w[0].length===5);
 const configs=[];
 const feasible=opts=>{
  const order=opts.map((o,i)=>({o,i})).sort((a,b)=>a.o.length-b.o.length),taken=new Set();
  function go(i){
   if(i===order.length)return true;
   for(const item of order[i].o)if(!taken.has(item[0])){
    taken.add(item[0]);if(go(i+1))return true;taken.delete(item[0]);
   }
   return false;
  }
  return go(0);
 };
 for(const a of masters)for(const b of masters){
  if(a===b)continue;
  for(let li=0;li<4;li++){
   const left=Array.from({length:n},(_,r)=>words4.filter(w=>w[0][li]===a[0][r]));
   if(left.some(x=>!x.length)||!feasible(left))continue;
   for(let ri=0;ri<5;ri++){
    const right=Array.from({length:n},(_,r)=>words5.filter(w=>w[0][ri]===b[0][r]));
    if(right.some(x=>!x.length)||!feasible(right))continue;
    configs.push({a,b,li,ri,left,right});
   }
  }
 }
 if(!configs.length)throw Error('No dense crossword profiles for '+n);
 return FUN_DENSE_CACHE[n]=configs;
}
function funDenseMatching(opts,rng){
 const ordered=opts.map((o,i)=>({i,values:funShuffle(o.slice(),rng)}))
  .sort((a,b)=>a.values.length-b.values.length);
 const used=new Set(),result=Array(opts.length);
 function rec(i){
  if(i===ordered.length)return true;
  const item=ordered[i];
  for(const w of item.values)if(!used.has(w[0])){
   used.add(w[0]);result[item.i]=w;
   if(rec(i+1))return true;
   used.delete(w[0]);
  }
  return false;
 }
 return rec(0)?result:null;
}

function funTransposePuzzle(p){
 const h=p.height,w=p.width,grid=Array.from({length:p.grid.length},()=>({letter:'',hint:null}));
 for(let r=0;r<h;r++)for(let c=0;c<w;c++){
  const x=p.grid[r*w+c],y={...x};
  if(x.hint)y.hint={...x.hint,dir:x.hint.dir==='across'?'down':'across'};
  delete y.barBottom;delete y.barRight;
  if(x.barBottom)y.barRight=true;
  if(x.barRight)y.barBottom=true;
  grid[c*h+r]=y;
 }
 const entries=p.entries.map(e=>{
  const x={...e,row:e.col,col:e.row,dir:e.dir==='across'?'down':'across'};
  if(e.hintRow!==undefined){x.hintRow=e.hintCol;x.hintCol=e.hintRow}
  return x;
 });
 const map=new Map();
 entries.slice().sort((a,b)=>a.row-b.row||a.col-b.col).forEach(e=>{
  const k=e.row+','+e.col;if(!map.has(k))map.set(k,map.size+1);e.number=map.get(k);
 });
 return {...p,height:w,width:h,grid,entries};
}
function funGeneratePuzzle(mode='rebus',seed=funPuzzleSeed(),difficulty='dificil'){
 const arrow=mode==='integrame',n=difficulty==='mediu'?7:9,rng=funRng(seed>>>0);
 const profiles=funShuffle(funDenseProfiles(n).slice(),rng);
 let selected=null,leftWords=null,rightWords=null;
 for(const p of profiles){
  const left=funDenseMatching(p.left,rng),right=funDenseMatching(p.right,rng);
  if(left&&right){selected=p;leftWords=left;rightWords=right;break}
 }
 if(!selected)throw Error('Dense puzzle matching failed');
 const R=n+(arrow?1:0),C=arrow?11:10,first=arrow?1:0,grid=Array.from({length:R*C},()=>({letter:'',hint:null}));
 const at=(r,c)=>grid[r*C+c];
 if(arrow)for(let c=0;c<C;c++)at(0,c).header=true;
 const entries=[];
 function add(word,clue,row,col,dir,hintRow,hintCol){
  const ent={word,clue,row,col,dir,number:entries.length+1};
  if(arrow){ent.hintRow=hintRow;ent.hintCol=hintCol;at(hintRow,hintCol).header=false;at(hintRow,hintCol).hint={clue,dir}}
  for(let i=0;i<word.length;i++){
   const r=row+(dir==='down'?i:0),c=col+(dir==='across'?i:0);
   const cell=at(r,c);
   if(cell.letter&&cell.letter!==word[i])throw Error('Generator crossing mismatch');
   cell.letter=word[i];
  }
  entries.push(ent);
 }
 for(let r=0;r<n;r++){
  const row=r+first;
  if(!arrow)at(row,4).bar=true;
  add(leftWords[r][0],leftWords[r][1],row,arrow?1:0,'across',row,0);
  add(rightWords[r][0],rightWords[r][1],row,arrow?6:5,'across',row,5);
 }
 add(selected.a[0],selected.a[1],first,arrow?1+selected.li:selected.li,'down',0,arrow?1+selected.li:selected.li);
 add(selected.b[0],selected.b[1],first,arrow?6+selected.ri:5+selected.ri,'down',0,arrow?6+selected.ri:5+selected.ri);
 const numbered=new Map();
 entries.slice().sort((x,y)=>x.row-y.row||x.col-y.col||(x.dir==='across'?-1:1)).forEach(e=>{
  const k=e.row+','+e.col;
  if(!numbered.has(k))numbered.set(k,numbered.size+1);
  e.number=numbered.get(k);
 });
 const colA=arrow?1+selected.li:selected.li,colB=arrow?6+selected.ri:5+selected.ri;
 for(let r=first;r<R-1;r++)for(let c=0;c<C;c++){
  if(c!==colA&&c!==colB&&at(r,c).letter)at(r,c).barBottom=true;
 }
 const answered=grid.filter(cell=>cell.letter).length;
 const board={mode,seed,difficulty,width:C,height:R,grid,entries,density:answered/grid.length,style:'dense-barred'};
 return arrow&&funModulo(seed,2)===1?funTransposePuzzle(board):board;
}
function funDailyMaxim(dateKey){
 const first=['Un pas mic făcut azi','O întrebare pusă cu sinceritate','O idee notată la timp','O conversație cu atenție','Un lucru învățat azi','O greșeală privită cu calm','Un plan simplu și clar','Un gest de bunătate','O clipă de liniște','O alegere curajoasă','O privire nouă asupra lucrurilor','O promisiune respectată','Un început modest','O secundă de răbdare','Un răspuns căutat cu grijă','O încercare repetată','O carte deschisă la întâmplare','O lecție primită cu umor','O zi organizată cu răbdare','Un drum parcurs cu încredere','O observație atentă','O idee împărtășită','Un gând luminos','O întrebare dificilă'];
 const second=['poate schimba ritmul unei săptămâni','deschide o ușă pe care nu o vedeai','îți dă curaj pentru următorul pas','aduce ordine într-un plan complicat','lasă loc unei descoperiri','îți amintește ce contează','poate deveni începutul unei schimbări','face mai ușor un drum dificil','așază lucrurile într-o lumină nouă','îți oferă un motiv să continui','aduce un strop de curiozitate','poate însemna mai mult decât o promisiune','te învață ceva despre oameni','îți dă un moment de claritate','transformă efortul în experiență','lasă în urmă ceva folositor','îți pune imaginația la lucru','îți amintește să asculți','transformă așteptarea în pregătire'];
 const day=funDayNumber(dateKey),n=first.length*second.length,index=funModulo(day*37,n);
 return first[Math.floor(index/second.length)]+' '+second[index%second.length]+'.';
}
function funDailyJoke(dateKey){
 const jobs=['profesorul','medicul','șeful','bibliotecarul','mecanicul','vecinul','taximetristul','bucătarul'];
 const places=['la școală','la cabinet','la birou','la bibliotecă','în garaj','în lift','în taxi','la restaurant'];
 const prompts=['— De ce te uiți atât la ceas?','— Ai terminat tot ce aveai de făcut?','— Ce ai învățat azi?','— De ce ai luat un caiet gol?','— De ce ai venit atât de devreme?','— Ai un plan pentru mâine?','— Ce faci când nu știi răspunsul?','— De ce zâmbești singur?'];
 const punch=['— Ca să văd dacă și el se grăbește ca mine.','— Sigur. Mai rămâne doar să încep.','— Că unele întrebări au nevoie de cafea înainte de răspuns.','— Ca să nu se plângă ideile că nu au spațiu.','— Ca să prind loc la coada celor întârziați.','— Da: să-l fac după ce mă trezesc.','— Întreb pe cineva care are mai multă încredere în sine.','— Mi-am amintit cât de serios iau uneori lucrurile simple.'];
 const day=funDayNumber(dateKey);
 if(funModulo(day,3)===0)return FUN_JOKES[funModulo(Math.floor(day/3)*13,FUN_JOKES.length)];
 const ix=funModulo(day*17,64),p=Math.floor(ix/8),q=ix%8;
 return 'Întreabă '+jobs[p]+' '+places[p]+':\n'+prompts[q]+'\n'+punch[funModulo(q+p*3,punch.length)];
}
function funDailyForecast(idx,dateKey,humor=false){
 const areas=[
 ['❤️ Dragoste','💼 Planuri'],['💰 Bani','🌿 Echilibru'],['👥 Familie','❤️ Dragoste'],
 ['💼 Muncă','💰 Bani'],['🌿 Energie','👥 Relații'],['❤️ Dragoste','💰 Buget'],['💼 Proiecte','🌿 Odihnă']
 ];
 const ideas=[
 ['Un dialog direct poate lămuri ceva ce ai amânat.','Mai bine o inițiativă mică decât trei promisiuni mari.','Un detaliu uitat merită verificat înainte de o decizie.','O persoană apropiată poate avea nevoie de timp și răbdare.','Pune o limită clară între muncă și odihnă.','Alege un lucru util și termină-l înainte de altul.','Nu trata presupunerile ca pe certitudini.','O întrebare bine pusă poate rezolva o neînțelegere.'],
 ['La amor, stelele spun să fii romantic; frigiderul cere să cumperi și pâine.','La serviciu, cafeaua a propus să devină coordonator de proiect.','Cardul bancar ar vrea o zi liberă de la cumpărături.','Un mesaj cu inimioare nu înlocuiește spălatul vaselor.','GPS-ul interior spune să te odihnești, dar canapeaua cere rezervare.','Azi ai inspirație; încearcă să nu o folosești doar pentru scuze.','Mercur nu a pierdut cheile: verifică buzunarul de ieri.','Partenerul citește gânduri numai în filme; vorbește în propoziții.']
 ];
 const index=funModulo(funDayNumber(dateKey)*31+idx*7+(humor?19:0),64),a=areas[index%7],list=ideas[humor?1:0];
 return [a[0]+' — '+list[index%8],a[1]+' — '+list[(Math.floor(index/8)*3+idx)%8]];
}
`;
