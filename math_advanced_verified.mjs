// Verified bounded deterministic calculations; never guess when input is unsupported.
export function mathAdvancedVerifiedModel(source){
 const input=String(source||'').trim().replace(/[−–]/g,'-');
 if(input.length>240)return null;
 const n=s=>Number(String(s).replace(',','.'));
 const fmt=x=>Number.isFinite(x)&&Math.abs(x)<=1e13?String(Number(x.toPrecision(12))).replace(/-/g,'−'):null;
 const result=(kind,value,rule)=>{
  if(value===null||value===undefined)return null;
  return {kind,label:input,result:String(value),summary:String(value),details:rule,method:kind,verified:true};
 };
 const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const r=a%b;a=b;b=r}return a};
 let m=input.match(/^(?:cmmdc|gcd)\s*\(?\s*(\d{1,10})\s*[,;]\s*(\d{1,10})\s*\)?$/iu);
 if(m){const a=Number(m[1]),b=Number(m[2]);if(!a&&!b)return null;
  return result('number-theory',gcd(a,b),'Algoritmul lui Euclid: cmmdc(a,b)=cmmdc(b,a mod b).');
 }
 m=input.match(/^(?:cmmmc|lcm)\s*\(?\s*(\d{1,9})\s*[,;]\s*(\d{1,9})\s*\)?$/iu);
 if(m){const a=Number(m[1]),b=Number(m[2]);if(!a||!b)return null;
  const value=(a/gcd(a,b))*b;if(!Number.isSafeInteger(value))return null;
  return result('number-theory',value,'cmmmc(a,b)=a·b/cmmdc(a,b).');
 }
 m=input.match(/^(?:rest(?:ul)?|mod(?:ulo)?)\s*[:=]?\s*(-?\d{1,11})\s*(?:mod|%|la)\s*(\d{1,10})$/iu);
 if(m){const a=Number(m[1]),d=Number(m[2]);if(!d)return null;
  return result('modular',((a%d)+d)%d,'Restul canonic la împărțirea cu un modul pozitiv aparține intervalului [0,m−1].');
 }
 m=input.match(/^(?:suma|sum)\s*(?:de la|from)?\s*1\s*(?:la|to|\.{2}|…)\s*(\d{1,10})$/iu);
 if(m){const end=Number(m[1]);if(!end)return null;
  const value=end*(end+1)/2;if(!Number.isSafeInteger(value))return null;
  return result('sequences',value,'Suma primelor n numere naturale este n(n+1)/2.');
 }
 m=input.match(/^(?:procent|percentage)\s*[:=]?\s*(-?\d+(?:[.,]\d+)?)\s*%?\s*(?:din|of)\s*(-?\d+(?:[.,]\d+)?)$/iu);
 if(m)return result('percentages',fmt(n(m[1])*n(m[2])/100),'p% din N este p·N/100.');
 m=input.match(/^(?:norma|norma vectorului|norm|vector norm)\s*[:=]?\s*\(\s*(-?\d+(?:[.,]\d+)?)\s*;\s*(-?\d+(?:[.,]\d+)?)\s*\)$/iu);
 if(m)return result('vectors',fmt(Math.hypot(n(m[1]),n(m[2]))),'Norma euclidiană este √(x²+y²).');
 m=input.match(/^(?:produs vectorial|cross product)\s*[:=]?\s*\(\s*(-?\d+(?:[.,]\d+)?)\s*;\s*(-?\d+(?:[.,]\d+)?)\s*;\s*(-?\d+(?:[.,]\d+)?)\s*\)\s*[×x*]\s*\(\s*(-?\d+(?:[.,]\d+)?)\s*;\s*(-?\d+(?:[.,]\d+)?)\s*;\s*(-?\d+(?:[.,]\d+)?)\s*\)$/iu);
 if(m){const [a,b,c,d,e,f]=m.slice(1).map(n),v=[b*f-c*e,c*d-a*f,a*e-b*d].map(fmt);
  if(v.some(x=>x===null))return null;
  return result('vectors','('+v.join('; ')+')','Produsul vectorial se calculează din determinantul formal al bazei orientate.');
 }
 m=input.match(/^(?:determinant|det)\s*[:=]?\s*\[\s*\[\s*(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)\s*\]\s*[,;]\s*\[\s*(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)\s*\]\s*\]$/iu);
 if(m){const [a,b,c,d]=m.slice(1).map(n);return result('matrices',fmt(a*d-b*c),'Pentru matricea 2×2 determinantul este ad−bc.');}
 m=input.match(/^(?:varian(?:ț|t)a e(?:ș|s)antion(?:ului)?|sample variance)\s*[:=]\s*([\d\s,;.+-]+)$/iu);
 if(m){const fields=m[1].includes(';')?m[1].split(';'):m[1].split(/[, ]+/);
  const xs=fields.map(x=>x.trim()).filter(Boolean).map(n);
  if(xs.length<2||xs.length>100||xs.some(x=>!Number.isFinite(x)))return null;
  const avg=xs.reduce((a,b)=>a+b,0)/xs.length;
  const verified=result('statistics',fmt(xs.reduce((a,b)=>a+(b-avg)**2,0)/(xs.length-1)),'Varianța eșantionului: suma abaterilor pătratice împărțită la n−1.');
  if(!verified)return null;
  verified.summary='s² = '+verified.result;
  verified.data=xs;
  return verified;
 }
 m=input.match(/^(?:binomiala|binomial|distributie binomiala|distribu(?:ț|t)ie binomiala)\s*:\s*n\s*=\s*(\d{1,3})\s*[,;]\s*k\s*=\s*(\d{1,3})\s*[,;]\s*p\s*=\s*(0(?:[.,]\d+)?|1(?:[.,]0+)?)$/iu);
 if(m){const N=Number(m[1]),k=Number(m[2]),p=n(m[3]);if(N>100||k>N||p<0||p>1)return null;
  let comb=1;const k1=Math.min(k,N-k);for(let i=1;i<=k1;i++)comb=comb*(N-k1+i)/i;
  return result('probability',fmt(comb*p**k*(1-p)**(N-k)),'Distribuția binomială: C(n,k)·p^k·(1−p)^(n−k).');
 }
 m=input.match(/^(?:derivata|derivative)\s*[:=]\s*(sin|cos|exp|ln)\s*\(?\s*x\s*\)?$/iu);
 if(m){const map={sin:['cos(x)','(sin x)′=cos x'],cos:['−sin(x)','(cos x)′=−sin x'],exp:['exp(x)','(eˣ)′=eˣ'],ln:['1/x','(ln x)′=1/x pentru x>0']};
  return result('derivative',map[m[1].toLowerCase()][0],map[m[1].toLowerCase()][1]);
 }
 m=input.match(/^(?:integrala|integral)\s*[:=]\s*(sin|cos|exp)\s*\(?\s*x\s*\)?$/iu);
 if(m){const map={sin:['−cos(x) + C','∫sin x dx=−cos x+C'],cos:['sin(x) + C','∫cos x dx=sin x+C'],exp:['exp(x) + C','∫eˣ dx=eˣ+C']};
  return result('integral',map[m[1].toLowerCase()][0],map[m[1].toLowerCase()][1]);
 }
 m=input.match(/^(?:ecuat(?:ie|ia) diferentiala\s*:?\s*)?y\s*['′]\s*=\s*(-?\d+(?:[.,]\d+)?)\s*\*?\s*x\s*([+-])\s*(\d+(?:[.,]\d+)?)\s*[,;]\s*y\s*\(\s*0\s*\)\s*=\s*(-?\d+(?:[.,]\d+)?)$/iu);
 if(m){const a=n(m[1]),b=n(m[3])*(m[2]==='-'?-1:1),initial=n(m[4]);
  const A=fmt(a/2),B=fmt(b),C=fmt(initial);
  if([A,B,C].some(x=>x===null))return null;
  return result('differential','y(x) = '+A+'x² + ('+B+')x + ('+C+')','Integrăm y′(x)=ax+b termen cu termen și folosim y(0) pentru constanta de integrare.');
 }
 m=input.match(/^(?:varf(?:ul)? parabol(?:ei|a)|vertex)\s*:\s*(?:y|f\(x\))\s*=\s*(-?\d+(?:[.,]\d+)?)\s*\*?\s*x\s*\^\s*2\s*([+-])\s*(\d+(?:[.,]\d+)?)\s*\*?\s*x\s*([+-])\s*(\d+(?:[.,]\d+)?)$/iu);
 if(m){const a=n(m[1]),b=n(m[3])*(m[2]==='-'?-1:1),cc=n(m[5])*(m[4]==='-'?-1:1);
  if(!a)return null;const vx=-b/(2*a),vy=a*vx*vx+b*vx+cc;
  const x=fmt(vx),y=fmt(vy);if(x===null||y===null)return null;
  return result('functions','V('+x+'; '+y+')','Vârful parabolei f(x)=ax²+bx+c are x=−b/(2a) și y=f(x).');
 }
 return null;
}
