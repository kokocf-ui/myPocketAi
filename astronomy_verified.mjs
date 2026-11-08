// Conservative, SI-aware classroom solvers. Unknown inputs fall through to AI; no false verification.
export function astronomyVerifiedExercise(source,mode='solve'){
 const raw=String(source||'');
 const q=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/,/g,'.');
 const read=(name,unit)=>{const m=q.match(new RegExp('(?:^|[;\\s])'(?:'+name+')\\s*=\\s*(-?\\d+(?:\\.\\d+)?(?:e[+-]?\\d+)?)\\s*'+unit+'(?=$|[;\\s,.])','i'));return m?Number(m[1]):null};
 const fmt=n=>Number(n.toPrecision(9)).toString();
 const answer=(label,formula,data,value,unit,assumption)=>{
  if(!Number.isFinite(value))return {kind:'input'};
  return {verified:true,value,unit,body:mode==='explain'?
   'Metodă: '+label+'\nRelație: '+formula+'\nDate: '+data+'\nIpoteze: '+assumption+'\nAplică formula cu unități coerente.':
   label+'\nRelație: '+formula+'\nDate: '+data+'\nRezultat: '+fmt(value)+' '+unit+'\nIpoteze: '+assumption};
 };
 const p=read('p','(?:arcsec|\\")');
 if(/paralax/.test(q)&&p!==null){
  if(p<=0)return {kind:'input'};
  return answer('Distanță din paralaxă','d(pc)=1/p(arcsec)','p='+p+' arcsec',1/p,'pc','Paralaxă anuală, unghi pozitiv.');
 }
 const m=read('m','kg'),r=read('r','m'),radius=read('raza','m'),T=read('t','k'),D=read('d','m'),lambda=read('lambda|λ','m');
 const G=6.67430e-11,c=299792458,sigma=5.670374419e-8;
 if(/viteza orbitala|orbit.circular/.test(q)&&m!==null&&r!==null){
  if(m<=0||r<=0)return {kind:'input'};
  return answer('Viteză orbitală circulară','v=√(GM/r)','M='+m+' kg; r='+r+' m',Math.sqrt(G*m/r),'m/s','Model newtonian cu masă centrală dominantă.');
 }
 if(/viteza de evadare|evadare/.test(q)&&m!==null&&r!==null){
  if(m<=0||r<=0)return {kind:'input'};
  return answer('Viteză de evadare','v=√(2GM/r)','M='+m+' kg; r='+r+' m',Math.sqrt(2*G*m/r),'m/s','Fără atmosferă, rotație sau propulsie ulterioară.');
 }
 if(/rezolut|difract|telescop/.test(q)&&D!==null&&lambda!==null){
  if(D<=0||lambda<=0)return {kind:'input'};
  return answer('Limită de difracție','θ=1,22λ/D','λ='+lambda+' m; D='+D+' m',1.22*lambda/D,'rad','Apertură circulară ideală; criteriul Rayleigh.');
 }
 if(/stefan|luminozitat/.test(q)&&radius!==null&&T!==null){
  if(radius<=0||T<=0)return {kind:'input'};
  return answer('Luminozitate bolometrică','L=4πR²σT⁴','R='+radius+' m; T='+T+' K',4*Math.PI*radius**2*sigma*T**4,'W','Emisie aproximată prin corp negru, temperatură efectivă.');
 }
 const rp=read('rp','m'),rs=read('rs','m');
 if(/tranzit|adancime/.test(q)&&rp!==null&&rs!==null){
  if(rp<=0||rs<=0||rp>=rs)return {kind:'input'};
  return answer('Adâncime tranzit','δ=(Rp/Rs)²','Rp='+rp+' m; Rs='+rs+' m',(rp/rs)**2*100,'%','Tranzit central, disc uniform, fără diluție ori pete.');
 }
 const ly=read('ly','ly'),au=read('au','au'),pc=read('pc','pc');
 if(/convert|distanta|distante/.test(q)){
  const found=[ly,au,pc].filter(x=>x!==null);
  if(found.length===1){
   const val=ly??au??pc;
   if(val<0)return {kind:'input'};
   if(ly!==null)return answer('Ani-lumină în parseci','d(pc)=d(ly)/3,261563777','ly='+ly,ly/3.261563777,'pc','Unități standard.');
   if(pc!==null)return answer('Parseci în ani-lumină','d(ly)=3,261563777·d(pc)','pc='+pc,pc*3.261563777,'ly','Unități standard.');
   return answer('Unități astronomice în kilometri','d(km)=149597870,7·d(au)','au='+au,au*149597870.7,'km','AU definită exact.');
  }
 }
 return null;
}
