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
function funGeneratePuzzle(mode='rebus',seed=funPuzzleSeed()){
 const isArrow=mode==='integrame',N=11;
 let best=null;
 for(let trial=0;trial<14;trial++){
  const rand=funRng((seed+trial*2654435761)>>>0),cells=Array(N*N).fill(''),mask=Array(N*N).fill(0),hints=new Map(),entries=[];
  const words=funShuffle(FUN_WORDS.filter(x=>x[0].length>=3&&x[0].length<=8).slice(),rand);
  const at=(r,c)=>r*N+c;
  function test(word,r,c,dir){
   let n=word.length,dr=dir==='down'?1:0,dc=dir==='across'?1:0,bit=dr?2:1;
   let hr=r-dr,hc=c-dc,tr=r+dr*n,tc=c+dc*n;
   if(r<0||c<0||r+dr*(n-1)>=N||c+dc*(n-1)>=N)return null;
   if(hr>=0&&hc>=0&&cells[at(hr,hc)])return null;
   if(tr<N&&tc<N&&cells[at(tr,tc)])return null;
   if(isArrow&&(hr<0||hc<0||cells[at(hr,hc)]||hints.has(at(hr,hc))))return null;
   let crosses=0,newCells=0;
   for(let i=0;i<n;i++){
    const y=r+i*dr,x=c+i*dc,p=at(y,x),existing=cells[p];
    if(hints.has(p))return null;
    if(existing){
     if(existing!==word[i]||(mask[p]&bit))return null;
     crosses++;
    } else {
     newCells++;
     for(const [sy,sx] of (dr?[[0,-1],[0,1]]:[[-1,0],[1,0]])){
      let ny=y+sy,nx=x+sx;
      if(ny>=0&&nx>=0&&ny<N&&nx<N&&cells[at(ny,nx)])return null;
     }
    }
   }
   if(entries.length&&!crosses)return null;
   if(!newCells)return null;
   const area=(Math.max(...entries.flatMap(e=>[e.row,e.row+(e.dir==='down'?e.word.length-1:0)]),r+dr*(n-1))-Math.min(...entries.map(e=>e.row),r)+1)*
     (Math.max(...entries.flatMap(e=>[e.col,e.col+(e.dir==='across'?e.word.length-1:0)]),c+dc*(n-1))-Math.min(...entries.map(e=>e.col),c)+1);
   return {crosses,score:crosses*11-area*.055+rand()*2,newCells};
  }
  function add(word,clue,r,c,dir){
   const dr=dir==='down'?1:0,dc=dir==='across'?1:0,bit=dr?2:1;
   for(let i=0;i<word.length;i++){let p=at(r+dr*i,c+dc*i);cells[p]=word[i];mask[p]|=bit}
   const entry={word,clue,row:r,col:c,dir};
   if(isArrow){entry.hintRow=r-dr;entry.hintCol=c-dc;hints.set(at(entry.hintRow,entry.hintCol),entry)}
   entries.push(entry);
  }
  const first=words.splice(Math.floor(rand()*Math.min(24,words.length)),1)[0];
  const startR=4+Math.floor(rand()*3),startC=Math.min(2+Math.floor(rand()*3),N-first[0].length);
  add(first[0],first[1],startR,startC,'across');
  for(let iteration=0;iteration<words.length&&entries.length<20;iteration++){
   let chosen=null,wordIndex=-1;
   for(let wi=0;wi<words.length;wi++){
    const [word,clue]=words[wi];
    for(let i=0;i<word.length;i++){
     for(let p=0;p<cells.length;p++){
      if(cells[p]!==word[i])continue;
      const y=Math.floor(p/N),x=p%N;
      for(const dir of ['across','down']){
       if(mask[p]&(dir==='across'?1:2))continue;
       const row=y-(dir==='down'?i:0),col=x-(dir==='across'?i:0),fit=test(word,row,col,dir);
       if(fit&&(!chosen||fit.score>chosen.score)){chosen={word,clue,row,col,dir,score:fit.score};wordIndex=wi}
      }
     }
    }
   }
   if(!chosen)break;
   add(chosen.word,chosen.clue,chosen.row,chosen.col,chosen.dir);
   words.splice(wordIndex,1);
  }
  let minR=N,minC=N,maxR=-1,maxC=-1,used=0;
  for(let p=0;p<cells.length;p++)if(cells[p]||hints.has(p)){let r=Math.floor(p/N),c=p%N;minR=Math.min(minR,r);minC=Math.min(minC,c);maxR=Math.max(maxR,r);maxC=Math.max(maxC,c);if(cells[p])used++}
  const height=maxR-minR+1,width=maxC-minC+1,density=used/(width*height);
  const score=entries.length*5+density*20-(width*height)*.05;
  if(!best||score>best.score)best={score,entries:entries.map(e=>({...e})),cells:cells.slice(),minR,minC,height,width,density,seed};
  if(entries.length>=12&&density>=.54)break;
 }
 if(!best||best.entries.length<3)throw Error('puzzle_generation_failed');
 const {entries,cells,minR,minC,height,width}=best;
 const normalized=entries.map(e=>({
  ...e,row:e.row-minR,col:e.col-minC,
  hintRow:e.hintRow===undefined?undefined:e.hintRow-minR,
  hintCol:e.hintCol===undefined?undefined:e.hintCol-minC
 }));
 const ordered=normalized.slice().sort((a,b)=>a.row-b.row||a.col-b.col);
 const starts=new Map();
 ordered.forEach((e,i)=>{
  const key=e.row+','+e.col;
  if(!starts.has(key))starts.set(key,i+1);
  e.number=starts.get(key);
 });
 const grid=Array.from({length:height*width},(_,p)=>{
  const r=Math.floor(p/width)+minR,c=p%width+minC;
  return {letter:cells[r*N+c]||'',hint:null};
 });
 for(const e of normalized)if(isArrow){
  const p=e.hintRow*width+e.hintCol;
  grid[p].hint={clue:e.clue,dir:e.dir};
 }
 return {mode,width,height,grid,entries:normalized,seed:best.seed,density:best.density};
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
