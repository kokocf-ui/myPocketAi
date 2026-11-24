// Offline daily entertainment and solar/ascendant calculations.
// Astronomical calculations are approximate; horoscope prose is entertainment,
// never a scientific forecast or a claim of planetary prediction.
export const FUN_ASTRO_CORE_SCRIPT=String.raw`
const FUN_SIGNS=[
 ['Berbec','Aries','foc'],['Taur','Taurus','pământ'],['Gemeni','Gemini','aer'],
 ['Rac','Cancer','apă'],['Leu','Leo','foc'],['Fecioară','Virgo','pământ'],
 ['Balanță','Libra','aer'],['Scorpion','Scorpio','apă'],['Săgetător','Sagittarius','foc'],
 ['Capricorn','Capricorn','pământ'],['Vărsător','Aquarius','aer'],['Pești','Pisces','apă']
];
const FUN_MAXIMS=[
 'O idee bună capătă valoare când faci primul pas către ea.',
 'Graba umple ziua; atenția îi dă sens.',
 'Lucrurile mari se construiesc din lucruri mici făcute bine.',
 'Curiozitatea nu cere permisiune să deschidă o ușă.',
 'Un plan simplu, urmat, valorează mai mult decât zece planuri perfecte.',
 'Când înveți ceva nou, lumea capătă încă o fereastră.',
 'Nu toate drumurile scurte duc mai repede la răspuns.',
 'Un cuvânt potrivit poate lumina o zi obișnuită.',
 'Răbdarea nu înlocuiește acțiunea; îi oferă direcție.',
 'Fiecare întrebare bună conține începutul unei descoperiri.',
 'Măsoară progresul în pași reali, nu în promisiuni.',
 'O pauză bună este cea din care revii cu o idee mai clară.'
];
const FUN_JOKES=[
 'De ce nu se ceartă două calendare? Pentru că au zilele numărate.',
 'Profesorul: Care este opusul cuvântului „aproape”? Elevul: „Am ajuns!”',
 'De ce și-a luat calculatorul umbrelă? Se anunțau nori de date.',
 'Am întrebat ceasul dacă are timp. Mi-a răspuns: „Din păcate, numai pentru alții.”',
 'De ce s-a dus creionul la doctor? Avea vârful slăbit.',
 'Un bec îi spune altuia: „Mă simt inspirat!” „Se vede, strălucești!”',
 'La librărie: „Aveți o carte despre amânare?” „Da, dar vi-o arăt mâine.”',
 'De ce râde tastatura? Cineva i-a apăsat tasta de umor.',
 'Ce spune un zero unui opt? „Frumoasă curea!”',
 'De ce a fugit compasul de la ore? Se învârtea mereu în cerc.',
 'Un astronaut și-a uitat cheile. Acum are o problemă… spațială.',
 'De ce nu minte rigla? Pentru că are toate măsurile la vedere.'
];
function funModulo(n,m){return ((n%m)+m)%m}
function funLocalDateKey(d){const p=x=>String(x).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
function funDayNumber(key){const ms=Date.parse(key+'T12:00:00Z');return Number.isFinite(ms)?Math.floor(ms/86400000):0}
function funDailyPick(bank,dateKey){return bank[funModulo(funDayNumber(dateKey),bank.length)]}
function funParseBirth(dateText,timeText='12:00',offsetHours=0){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateText||''));
 const time=/^(\d{2}):(\d{2})$/.exec(String(timeText||''));
 const offset=Number(offsetHours);
 if(!match||!time||!Number.isFinite(offset)||offset< -12||offset>14)return null;
 const y=Number(match[1]),m=Number(match[2]),d=Number(match[3]);
 const hh=Number(time[1]),mm=Number(time[2]);
 if(y<1900||y>2100||hh>23||mm>59)return null;
 const local=new Date(Date.UTC(y,m-1,d,hh,mm));
 if(local.getUTCFullYear()!==y||local.getUTCMonth()+1!==m||local.getUTCDate()!==d)return null;
 return new Date(local.getTime()-offset*3600000);
}
function funSolarLongitude(utc){
 if(!(utc instanceof Date)||!Number.isFinite(utc.getTime()))return NaN;
 const jd=utc.getTime()/86400000+2440587.5,T=(jd-2451545)/36525;
 const rad=Math.PI/180;
 const L0=funModulo(280.46646+T*(36000.76983+0.0003032*T),360);
 const M=funModulo(357.52911+T*(35999.05029-0.0001537*T),360);
 const C=(1.914602-T*(0.004817+0.000014*T))*Math.sin(M*rad)+
  (0.019993-0.000101*T)*Math.sin(2*M*rad)+0.000289*Math.sin(3*M*rad);
 return funModulo(L0+C-0.00569-0.00478*Math.sin((125.04-1934.136*T)*rad),360);
}
function funSunSign(utc){const lon=funSolarLongitude(utc);return Number.isFinite(lon)?Math.floor(lon/30):null}
function funSolarAspect(natalLongitude,currentLongitude){
 const a=Number(natalLongitude),b=Number(currentLongitude);
 if(!Number.isFinite(a)||!Number.isFinite(b))return null;
 const separation=Math.abs(funModulo(b-a+180,360)-180);
 const aspects=[[0,'conjuncție'],[60,'sextil'],[90,'cuadratură'],[120,'trigon'],[180,'opoziție']];
 let closest=aspects[0];
 for(const x of aspects)if(Math.abs(x[0]-separation)<Math.abs(closest[0]-separation))closest=x;
 return {separation,orb:Math.abs(closest[0]-separation),name:Math.abs(closest[0]-separation)<=6?closest[1]:null};
}

function funAscendantLongitude(utc,lat,lon){
 if(!(utc instanceof Date)||!Number.isFinite(utc.getTime()))return NaN;
 lat=Number(lat);lon=Number(lon);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>=66.5||Math.abs(lon)>180)return NaN;
 const rad=Math.PI/180,jd=utc.getTime()/86400000+2440587.5;
 const T=(jd-2451545)/36525;
 const gmst=280.46061837+360.98564736629*(jd-2451545)+0.000387933*T*T-T*T*T/38710000;
 const theta=funModulo(gmst+lon,360)*rad,eps=(23.439291-0.0130042*T)*rad;
 const asc=Math.atan2(Math.cos(theta),-Math.sin(theta)*Math.cos(eps)-Math.tan(lat*rad)*Math.sin(eps));
 return funModulo(asc/rad,360);
}
function funSignLabel(idx){return FUN_SIGNS[idx]?.[0]||'—'}
function funHoroscope(idx,dateKey,humor=false){
 const descriptions={
  'foc':['Alege un pas important și concentrează-ți energia asupra lui.','În relații, inițiativa ajută când este însoțită de ascultare.','Lasă loc și pentru odihnă: entuziasmul are nevoie de ritm.'],
  'pământ':['O prioritate concretă îți poate aduce mai multă claritate.','În relații, gesturile simple comunică mai bine decât presupunerile.','Revizuiește o rutină înainte să adaugi încă una.'],
  'aer':['O conversație bine pregătită poate deschide o perspectivă.','În relații, întreabă înainte să tragi concluzii.','Notează o idee utilă înainte să începi alta.'],
  'apă':['Observă ce îți dă energie și ce te epuizează.','În relații, exprimă direct ceea ce ai nevoie.','Alege o activitate care îți oferă liniște.']
 };
 const funny={
  'foc':['Astăzi ai energie să cucerești lumea. Începe cu găsirea cheilor.','La capitolul amor: un compliment sincer bate zece emoji cu flăcări.','Înainte să schimbi universul, încarcă telefonul.'],
  'pământ':['Planetele recomandă ordine. Sertarul cu cabluri nu este de acord.','La capitolul amor: romantismul începe când împarți ultima felie.','Bugetul tău are nevoie de tandrețe, nu de încă un coș online.'],
  'aer':['Ai atâtea idei încât până și lista de cumpărături cere ședință.','La capitolul amor: comunică; telepatia are semnal slab.','Mercur n-a pierdut nimic. Tu ai pus din nou ochelarii pe cap.'],
  'apă':['Intuiția spune să te relaxezi. Frigiderul confirmă solemn.','La capitolul amor: o cină romantică merge și fără efecte speciale.','Dacă emoțiile devin furtunoase, caută mai întâi umbrela.']
 };
 const type=FUN_SIGNS[idx]?.[2]||'aer',bank=humor?funny[type]:descriptions[type];
 const step=funModulo(funDayNumber(dateKey)+idx,bank.length);
 return [bank[step],bank[(step+1)%3],bank[(step+2)%3]];
}
function funCompatibility(a,b){
 if(!FUN_SIGNS[a]||!FUN_SIGNS[b])return null;
 const x=FUN_SIGNS[a][2],y=FUN_SIGNS[b][2],partners={'foc':'aer','aer':'foc','pământ':'apă','apă':'pământ'};
 return x===y?'Elemente asemănătoare: puteți porni de la obiceiurile comune, fără să presupuneți că sunteți identici.':
 partners[x]===y?'Elemente complementare în tradiția astrologică: comunicați despre preferințele diferite.':
 'Elemente cu stiluri diferite în tradiția astrologică: negocierea și umorul pot conta mai mult decât etichetele.';
}
function funSeed(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function funRng(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function funShuffle(arr,rng){for(let i=arr.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function funSudokuUnique(board,limit=2){
 let found=0,grid=board.slice();
 function solve(){
  if(found>=limit)return;
  let target=-1,candidates=null;
  for(let i=0;i<81;i++)if(!grid[i]){
   const r=Math.floor(i/9),c=i%9,used=new Set();
   for(let j=0;j<9;j++){used.add(grid[9*r+j]);used.add(grid[9*j+c])}
   const br=3*Math.floor(r/3),bc=3*Math.floor(c/3);
   for(let j=0;j<3;j++)for(let k=0;k<3;k++)used.add(grid[9*(br+j)+bc+k]);
   const free=[1,2,3,4,5,6,7,8,9].filter(v=>!used.has(v));
   if(!free.length)return;
   if(candidates===null||free.length<candidates.length){target=i;candidates=free}
  }
  if(target<0){found++;return}
  for(const n of candidates){grid[target]=n;solve();if(found>=limit)break}
  grid[target]=0;
 }
 solve();return found;
}
function funSudokuGenerate(level='easy',salt=''){
 const rng=funRng(funSeed(level+'-'+salt));
 const groups=[0,1,2];
 const rowOrder=funShuffle(groups.slice(),rng).flatMap(g=>funShuffle([0,1,2],rng).map(x=>g*3+x));
 const colOrder=funShuffle(groups.slice(),rng).flatMap(g=>funShuffle([0,1,2],rng).map(x=>g*3+x));
 const digits=funShuffle([1,2,3,4,5,6,7,8,9],rng);
 const full=Array.from({length:81},(_,i)=>digits[(rowOrder[Math.floor(i/9)]*3+
  Math.floor(rowOrder[Math.floor(i/9)]/3)+colOrder[i%9])%9]);
 const puzzle=full.slice(),order=funShuffle(Array.from({length:81},(_,i)=>i),rng);
 const remove={easy:37,medium:45,hard:52}[level]||37;
 let removed=0;
 for(const cell of order){
  if(removed>=remove)break;
  const keep=puzzle[cell];puzzle[cell]=0;
  if(funSudokuUnique(puzzle)!==1)puzzle[cell]=keep;
  else removed++;
 }
 return {puzzle,solution:full,clues:81-removed,level};
}
const FUN_CROSSWORD=[
 {word:'SOARE',row:0,col:1,dir:'across',clue:'Steaua din centrul Sistemului Solar'},
 {word:'ARCA',row:1,col:1,dir:'across',clue:'Corabie dintr-o povestire biblică'},
 {word:'RAMA',row:2,col:1,dir:'across',clue:'Încadrează un tablou'},
 {word:'ERA',row:3,col:1,dir:'across',clue:'Perioadă întinsă din istorie'},
 {word:'SARE',row:0,col:1,dir:'down',clue:'Condiment alb folosit în bucătărie'}
];
`;
