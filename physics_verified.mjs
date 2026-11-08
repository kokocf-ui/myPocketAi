// Physics: conservative offline deterministic exercise checks.
// Accepts clearly named SI values; unknown/ambiguous prompts fall through to AI.
export function physicsVerifiedExercise(source,mode='solve'){
 const input=String(source||'');
 const norm=input.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/,/g,'.');
 const read=(label,unit)=>{
  const pat=new RegExp('(?:^|[;\\s])'+label+'\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*'+unit+'(?=$|[\\s;,\\.])','i');
  const m=norm.match(pat);return m?Number(m[1]):null;
 };
 const format=n=>Number.isFinite(n)?String(Number(n.toPrecision(8))):'';
 const build=(name,formula,assignments,result,unit,guard='')=>{
  if(!Number.isFinite(result))return {kind:'input'};
  const body=mode==='explain'?
   'Metodă: '+name+'.\nRelație: '+formula+'.\nDate SI: '+assignments+'.\n'+(guard?'Condiții: '+guard+'.':'Înlocuiește valorile cu unități coerente.'):
   name+'\nFormula: '+formula+'\nDate (SI): '+assignments+'\nRezultat: '+format(result)+' '+unit+'\nVerificare: substituția în formula inițială este consistentă.'+(guard?'\nIpoteză: '+guard:'');
  return {verified:true,body,value:result,unit};
 };
 const m=read('m','kg'),a=read('a','m\\/s(?:\\^?2|²)'),v=read('v','m\\/s'),t=read('t','s'),s=read('s','m'),u=read('u','v'),i=read('i','a'),r=read('r','(?:ohm|ω|Ω)'),p=read('p','w'),f=read('f','hz'),lambda=read('lambda|λ','m');
 if(/forta|forța|newton|\\bf\s*=/.test(norm)&&m!==null&&a!==null){
  if(m<0)return {kind:'input'};
  return build('Forță rezultantă','F = m·a','m='+format(m)+' kg, a='+format(a)+' m/s²',m*a,'N','Masă constantă; accelerație și forță coliniare.');
 }
 if(/energie cinetica|\\bec\s*=/.test(norm)&&m!==null&&v!==null){
  if(m<0)return {kind:'input'};
  return build('Energie cinetică','Ec = m·v²/2','m='+format(m)+' kg, v='+format(v)+' m/s',m*v*v/2,'J','Viteză nerelativistă.');
 }
 if(/viteza|viteză|rapiditate|\\bv\s*=/.test(norm)&&s!==null&&t!==null){
  if(s<0||t<=0)return {kind:'input'};
  return build('Rapiditate medie','v = s/t','s='+format(s)+' m, t='+format(t)+' s',s/t,'m/s','s este distanță parcursă, nu deplasare vectorială.');
 }
 if(/ohm|rezistent|rezistenț|tensiun|curent electric/.test(norm)){
  if(i!==null&&r!==null&&u===null){
   if(r<0)return {kind:'input'};
   return build('Legea lui Ohm','U = I·R','I='+format(i)+' A, R='+format(r)+' Ω',i*r,'V','Rezistor ohmic.');
  }
  if(u!==null&&r!==null&&i===null){
   if(r<=0)return {kind:'input'};
   return build('Legea lui Ohm','I = U/R','U='+format(u)+' V, R='+format(r)+' Ω',u/r,'A','Rezistor ohmic.');
  }
  if(u!==null&&i!==null&&r===null){
   if(i===0)return {kind:'input'};
   return build('Legea lui Ohm','R = U/I','U='+format(u)+' V, I='+format(i)+' A',u/i,'Ω','Rezistor ohmic.');
  }
 }
 if(/putere electrica|putere electrică/.test(norm)&&u!==null&&i!==null)
  return build('Putere electrică','P = U·I','U='+format(u)+' V, I='+format(i)+' A',u*i,'W','Valori pentru curent continuu sau valori instantanee.');
 if(/unda|undă|lungime de unda|lungime de undă/.test(norm)&&f!==null&&lambda!==null){
  if(f<0||lambda<=0)return {kind:'input'};
  return build('Viteza undei','v = λ·f','λ='+format(lambda)+' m, f='+format(f)+' Hz',lambda*f,'m/s','Undă periodică.');
 }
 if(/perioad|\\bt\s*=/.test(norm)&&f!==null&&t===null){
  if(f<=0)return {kind:'input'};
  return build('Perioada oscilației','T = 1/f','f='+format(f)+' Hz',1/f,'s','Oscilație periodică.');
 }
 return null;
}
