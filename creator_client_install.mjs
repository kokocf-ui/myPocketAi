export const CREATOR_CLIENT_INSTALL_SCRIPT=String.raw`
function extraCreatorClientInstallWizard(area,form,hostingMode){
 const panel=extraToolsEl('details','extra-creator-deploy-wizard');
 panel.append(extraToolsEl('summary','',extraToolsLocale('🚀 Instalează backendul clientului — ghid pas cu pas','🚀 Install the client backend — step by step')));
 const intro=extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Fără parole în Eva. Instalarea folosește autentificarea oficială Cloudflare pe calculatorul clientului. Această aplicație doar te ghidează și verifică adresa finală.',
  'No passwords in Eva. Install through Cloudflare’s own sign-in on the client’s computer. Eva guides you and verifies the resulting URL.'));
 const steps=[
  ['1','Creează proiectul în Eva, selectează funcțiile și descarcă fișierul .pocket-site.json.',
   'Create your project in Eva, select features and download the .pocket-site.json file.'],
  ['2','Descarcă pachetul independent Eva Client Backend din GitHub Actions, apoi extrage ZIP-ul într-un folder pe calculator. Linkul GitHub necesită accesul creatorului.',
   'Download the standalone Eva Client Backend ZIP from GitHub Actions and extract it on a computer. The creator must have access to that GitHub repository.'],
  ['3','Clientul se conectează în propriul cont Cloudflare. Instalează Node.js LTS pe calculator.',
   'The owner signs into their Cloudflare account and installs Node.js LTS on the computer.'],
  ['4','Deschide terminalul în folderul extras și execută comanda de mai jos. Instalatorul cere numele site-ului, confirmă contul Cloudflare și publică Workerul.',
   'Open a terminal in the extracted folder and run the command below. The installer asks for the site name, confirms the Cloudflare account and deploys the Worker.'],
  ['5','Deschide adresa *.workers.dev, alege Prima configurare și creează contul administratorului folosind cheia temporară afișată de instalator.',
   'Open the *.workers.dev URL, choose First setup and create the owner account using the temporary setup key shown by the installer.'],
  ['6','În panoul Studio importă fișierul .pocket-site.json, verifică politica de confidențialitate și publică site-ul. Revocă cheia de instalare cu node instalare-eva.mjs --finish.',
   'Import the .pocket-site.json project in Studio, review the privacy policy and publish. Revoke the setup secret with node instalare-eva.mjs --finish.'],
  ['7','Testează mesajele, solicitările de rezervare, inboxul privat, HTTPS și fotografia principală înainte să predai site-ul.',
   'Test contact messages, booking requests, the private inbox, HTTPS and the cover photo before handover.']
 ];
 const list=extraToolsEl('ol','extra-creator-deploy-steps');
 for(const [number,ro,en] of steps){
  const li=extraToolsEl('li','',extraToolsLocale(ro,en));
  li.setAttribute('data-step',number);list.append(li);
 }
 const links=extraToolsEl('div','extra-creator-deploy-links');
 const link=(title,url)=>{
  const a=extraToolsEl('a','extra-creator-deploy-link',title);
  a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;
 };
 links.append(
  link(extraToolsLocale('📦 Pachetul backend (GitHub)','📦 Backend ZIP (GitHub)'),
   'https://github.com/kokocf-ui/myPocketAi/actions/workflows/eva-client-backend-package.yml'),
  link(extraToolsLocale('☁ Cont Cloudflare','☁ Cloudflare account'),'https://dash.cloudflare.com/'),
  link(extraToolsLocale('💻 Node.js LTS','💻 Node.js LTS'),'https://nodejs.org/en/download'),
  link(extraToolsLocale('📖 Documentație oficială','📖 Official documentation'),
   'https://developers.cloudflare.com/workers/get-started/guide/')
 );
 const commands=extraToolsEl('div','extra-creator-deploy-commands');
 for(const command of ['node instalare-eva.mjs','node instalare-eva.mjs --finish']){
  const line=extraToolsEl('div','extra-creator-deploy-command');
  const code=extraToolsEl('code','',command);
  const copy=extraToolsBtn(extraToolsLocale('Copiază','Copy'),()=>{
   if(navigator.clipboard?.writeText)navigator.clipboard.writeText(command).catch(()=>{});
   else extraToolsStatus(extraToolsLocale('Selectează comanda afișată pentru a o copia.','Select and copy the displayed command.'));
  });
  line.append(code,copy);commands.append(line);
 }
 const verifier=extraToolsEl('section','extra-creator-deploy-verify');
 verifier.append(extraToolsEl('h4','',extraToolsLocale('Verifică instalarea','Verify deployment')));
 verifier.append(extraToolsEl('p','extra-work-note',extraToolsLocale(
  'După instalare, copiază doar adresa publică HTTPS a Workerului. Nu introduce parola, cheia de instalare sau un token aici.',
  'After installation, paste only the public HTTPS Worker address. Never enter passwords, setup secrets or tokens here.')));
 const url=extraToolsEl('input','extra-work-input');url.type='url';
 url.placeholder='https://eva-client.example.workers.dev';url.autocomplete='off';
 const status=extraToolsEl('p','extra-work-note');
 const verify=extraToolsBtn(extraToolsLocale('✓ Verifică backendul','✓ Verify backend'),async()=>{
  const value=url.value.trim();let parsed;
  try{
   parsed=new URL(value);
   if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.pathname!=='/'||!parsed.hostname.includes('.'))
    throw Error('invalid_url');
  }catch{status.textContent=extraToolsLocale('Introdu adresa HTTPS a Workerului, fără cale suplimentară sau parolă.',
   'Enter the Worker HTTPS origin, without a path or credentials.');return}
  verify.disabled=true;status.textContent=extraToolsLocale('Verific conexiunea…','Checking connectivity…');
  try{
   const resp=await fetch(parsed.origin+'/health',{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(12000)});
   const data=await resp.json();
   if(!resp.ok||data?.ok!==true||data.status!=='studio_independent')throw Error('not_eva_backend');
   status.textContent=extraToolsLocale('✓ Backend Eva disponibil. Deschide panoul, importă proiectul și verifică funcțiile publice.',
    '✓ Eva backend is online. Open Studio, import the project and test public functions.');
   const a=link(extraToolsLocale('Deschide panoul administratorului','Open the admin portal'),parsed.origin+'/');
   a.classList.add('extra-creator-deploy-open');
   const previous=verifier.querySelector('.extra-creator-deploy-open');if(previous)previous.remove();
   verifier.append(a);
  }catch{
   status.textContent=extraToolsLocale('Nu am putut verifica această adresă. Controlează instalarea și conexiunea sau încearcă din browser.',
    'Could not verify the URL. Check deployment and connection or open it in your browser.');
  }finally{verify.disabled=false}
 });
 verifier.append(url,verify,status);
 panel.append(intro,list,links,commands,verifier);
 area.append(panel);
 const sync=()=>{panel.hidden=hostingMode.value!=='dynamic'};
 hostingMode.addEventListener('change',sync);
 if(form.backendChoices){
  for(const input of [form.backendChoices.contact,form.backendChoices.booking])input.addEventListener('change',()=>{
   if(form.backendChoices.contact.checked||form.backendChoices.booking.checked){
    hostingMode.value='dynamic';
    hostingMode.dispatchEvent(new Event('change'));
   }
  });
  if(form.getFeatures?.().contact||form.getFeatures?.().booking){
   hostingMode.value='dynamic';hostingMode.dispatchEvent(new Event('change'));
  }
 }
 sync();
 return {panel,url,status};
}
`;
export const CREATOR_CLIENT_INSTALL_STYLE=String.raw`
#view-module.extra-tools-workspace .extra-creator-deploy-wizard{border:1px solid #5b869b!important;background:#112f40!important;border-radius:14px!important;margin:12px 0!important;padding:12px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-wizard>summary{font-size:15px!important;font-weight:800!important;cursor:pointer!important;line-height:1.4!important}
#view-module.extra-tools-workspace .extra-creator-deploy-steps{padding-left:24px!important;margin:12px 0!important}
#view-module.extra-tools-workspace .extra-creator-deploy-steps li{font-size:13px!important;line-height:1.5!important;margin:0 0 9px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-links{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin:10px 0!important}
#view-module.extra-tools-workspace .extra-creator-deploy-link{display:flex!important;align-items:center!important;min-height:45px!important;padding:9px!important;border:1px solid #4b7186!important;border-radius:9px!important;font-size:12px!important;color:#c6f6ff!important}
#view-module.extra-tools-workspace .extra-creator-deploy-command{display:flex!important;align-items:center!important;gap:7px!important;margin:7px 0!important}
#view-module.extra-tools-workspace .extra-creator-deploy-command code{overflow:auto!important;flex:1!important;font-size:12px!important;white-space:nowrap!important}
#view-module.extra-tools-workspace .extra-creator-deploy-command button{width:auto!important;min-height:36px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-verify{padding-top:10px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-verify h4{font-size:15px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-verify input{width:100%!important;box-sizing:border-box!important}
#view-module.extra-tools-workspace .extra-creator-deploy-verify button{max-width:100%!important;margin-top:8px!important}
#view-module.extra-tools-workspace .extra-creator-deploy-open{margin:8px 0!important}
`;
