#!/usr/bin/env node
/**
 * Eva Site Studio — client-owned Cloudflare installer.
 * This tool never receives or stores Cloudflare access tokens.
 * Wrangler opens Cloudflare's own login and uses its native OAuth flow.
 */
import {randomBytes} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
import {stdin as input,stdout as output} from 'node:process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const dir=path.dirname(fileURLToPath(import.meta.url));
const original='wrangler.eva-client.jsonc';
const local='wrangler.eva-installed.jsonc';
const configPath=path.join(dir,local);
const nodeVersion=Number(process.versions.node.split('.')[0]);
export function validWorkerName(name){
 return typeof name==='string'&&/^[a-z0-9](?:[a-z0-9-]{2,48}[a-z0-9])$/.test(name)&&!name.includes('--');
}
export function safeStudioUrl(url){
 try{
  const v=new URL(url);
  return v.protocol==='https:'&&!v.username&&!v.password&&v.pathname==='/'&&
   v.hostname.includes('.')?v.origin:null;
 }catch{return null}
}
export function withClientName(config,name){
 if(!validWorkerName(name))throw Error('Numele Worker trebuie să aibă 4–50 litere mici, cifre sau cratime.');
 const copy=structuredClone(config);
 copy.name=name;
 return copy;
}
async function prompt(rl,question){
 return (await rl.question(question)).trim();
}
function wrangler(args,secret){
 const cmd=process.platform==='win32'?'npx.cmd':'npx';
 const opts={cwd:dir,shell:process.platform==='win32',
  stdio:secret===undefined?'inherit':['pipe','inherit','inherit'],
  ...(secret===undefined?{}:{input:secret+'\n'}),env:{...process.env}};
 const res=spawnSync(cmd,['--yes','wrangler@latest',...args],opts);
 if(res.error)throw Error('Wrangler nu a putut fi pornit: '+res.error.message);
 if(res.status!==0)throw Error('Comanda Wrangler a eșuat. Nu continua fără verificare.');
}
async function verify(url){
 const base=safeStudioUrl(url);
 if(!base)throw Error('Introdu adresa HTTPS completă a Workerului.');
 const response=await fetch(base+'/health',{redirect:'error',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error('Endpointul /health a răspuns cu '+response.status);
 const body=await response.json();
 if(body?.ok!==true||body?.status!=='studio_independent')
  throw Error('Adresa nu este o instalare Eva Site Studio compatibilă.');
 console.log('\n✓ Backend Eva accesibil la '+base+'\n✓ Administrare: '+base+'/\n✓ AI dezactivat implicit.');
 return base;
}
async function main(){
 if(nodeVersion<20)throw Error('Instalează mai întâi Node.js LTS versiunea 20 sau mai nouă.');
 const argv=process.argv.slice(2);
 if(argv[0]==='--check'){if(!argv[1])throw Error('Exemplu: node instalare-eva.mjs --check https://site.workers.dev');await verify(argv[1]);return}
 const rl=createInterface({input,output});
 try{
  console.log('\nEva — instalare ghidată pe Cloudflare\n');
  console.log('Clientul deține contul, domeniul și datele. Instalarea necesită autorizarea sa.');
  const source=JSON.parse(await readFile(path.join(dir,original),'utf8'));
  const workerName=await prompt(rl,'Nume unic pentru site (ex.: eva-pensiunea-aramis): ');
  const conf=withClientName(source,workerName);
  // One folder = one customer. Never overwrite a previous customer's deployment config.
  try{await readFile(configPath,'utf8');throw Error('Acest folder conține deja un site instalat. Pentru un client nou, extrage un pachet ZIP într-un folder separat.')}catch(error){if(error.code!=='ENOENT')throw error}
  console.log('\nDeschide Cloudflare în contul CLIENTULUI, nu în contul creatorului.');
  console.log('Wrangler va afișa mai jos identitatea contului folosit.');
  try{wrangler(['whoami'])}catch{
   console.log('\nWrangler va deschide autentificarea Cloudflare.');
   wrangler(['login']);
   wrangler(['whoami']);
  }
  const accept=await prompt(rl,'Confirmi că acesta este contul de găzduire al CLIENTULUI? (scrie DA): ');
  if(accept!=='DA')throw Error('Instalare anulată; contul clientului nu a fost confirmat.');
  await writeFile(configPath,JSON.stringify(conf,null,2)+'\n',{mode:0o600,flag:'wx'});
  console.log('\nPublic backendul în contul autorizat. Confirma în Cloudflare dacă ți se cere.');
  wrangler(['deploy','--config',local]);
  const bootstrap=randomBytes(32).toString('hex');
  console.log('\nConfigurez cheia temporară de inițializare pe Worker.');
  wrangler(['secret','put','STUDIO_BOOTSTRAP_SECRET','--config',local],bootstrap);
  console.log('\n✓ Backendul a fost publicat. Pentru prima configurare:');
  console.log('1. Copiază adresa HTTPS *.workers.dev afișată de Wrangler la deploy.');
  console.log('2. Deschide pagina în browser; apasă «Prima configurare».');
  console.log('3. Clientul introduce propriul e-mail, parola și această CHEIE TEMPORARĂ:');
  console.log('\n'+bootstrap+'\n');
  console.log('4. Clientul se conectează și importă fișierul .pocket-site.json creat în Eva.');
  console.log('5. După crearea contului, revino la acest folder și rulează:');
  console.log('   node instalare-eva.mjs --finish');
  console.log('   pentru a revoca cheia inițială. Nu distribui cheia prin mesaje.');
  console.log('\n✓ Fișierul '+local+' păstrează NUMAI numele Workerului; nu conține chei.');
  console.log('   Păstrează acest fișier pentru actualizări ale Workerului.');
 }finally{rl.close()}
}
async function finish(){
 const rl=createInterface({input,output});
 try{
  console.log('Revocarea cheii bootstrap. Fă asta doar DUPĂ ce clientul a creat contul administrator.');
  const confirm=await prompt(rl,'Confirmi că administratorul s-a conectat cu succes? (DA): ');
  if(confirm!=='DA')throw Error('Cheia nu a fost revocată.');
  wrangler(['secret','delete','STUDIO_BOOTSTRAP_SECRET','--config',local]);
  console.log('✓ Cheia inițială a fost revocată. Contul clientului rămâne activ.');
 }finally{rl.close()}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const runner=process.argv.includes('--finish')?finish:main;
 runner().catch(e=>{console.error('\nInstalarea nu a fost finalizată: '+e.message);process.exitCode=1});
}
