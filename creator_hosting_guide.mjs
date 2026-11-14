export const SITE_HOSTING_GUIDES=Object.freeze([{"id":"cloudflare-pages","mode":"static","title":"Cloudflare Pages","best":true,"doc":"https://developers.cloudflare.com/pages/get-started/direct-upload/","ro":"Site-uri de prezentare, portofolii și galerii. Încărcare directă de fișiere, cu domeniu propriu opțional.","en":"Business websites, portfolios and static galleries. Direct file uploads and optional custom domain.","stepsRo":["Creează un cont Cloudflare pe numele clientului.","În Eva, exportă site-ul HTML și verifică dacă fișierul index.html conține toate fotografiile.","În Workers & Pages alege Create application > Pages > Direct Upload.","Încarcă folderul sau arhiva cu fișierele site-ului și publică proiectul.","În Custom domains conectează domeniul clientului, configurează DNS și verifică HTTPS.","Verifică site-ul public pe telefon și desktop; salvează o copie locală."],"stepsEn":["Create a Cloudflare account owned by the client.","Export the HTML website from Eva and confirm index.html includes all images.","In Workers & Pages choose Create application > Pages > Direct Upload.","Upload the website files/folder or supported ZIP and deploy.","Add the client's domain under Custom domains, configure DNS and check HTTPS.","Test on mobile and desktop and keep an independent backup."]},{"id":"netlify","mode":"static","title":"Netlify","best":false,"doc":"https://docs.netlify.com/start/choose-your-path/","ro":"Publicare simplă prin încărcarea folderului site-ului. Bun pentru pagini statice fără backend.","en":"Simple folder upload. Good for static websites without a backend.","stepsRo":["Clientul își deschide un cont Netlify.","Exportă site-ul și pregătește un folder cu index.html și toate resursele.","În Netlify, alege Add new project > Deploy manually sau Netlify Drop.","Trage folderul site-ului în zona de încărcare și verifică adresa temporară.","Adaugă domeniul în Domain management, configurează DNS și HTTPS.","Testează linkurile și fotografiile. Pentru modificări, publică o versiune actualizată."],"stepsEn":["Client creates a Netlify account.","Export the website and prepare a folder with index.html and all assets.","In Netlify select Add new project > Deploy manually, or use Netlify Drop.","Drop the website folder and inspect the generated preview URL.","Add a custom domain, configure DNS and HTTPS.","Test links and images. Redeploy updated files for future changes."]},{"id":"cpanel","mode":"static","title":"Găzduire clasică (cPanel)","best":false,"doc":"https://docs.cpanel.net/cpanel/files/file-manager/","ro":"Pentru clienții care preferă un furnizor tradițional de hosting, domeniu și e-mail în același cont (dacă planul le include).","en":"For clients who prefer traditional web hosting with domain and email in one account, if included in the plan.","stepsRo":["Clientul cumpără domeniul și un plan de găzduire în numele lui; verifică ce include prețul.","Deschide panoul cPanel > File Manager.","Intră în document root pentru domeniul ales (de regulă public_html).","Încarcă un ZIP cu fișierele site-ului, apoi folosește Extract; index.html trebuie să fie în rădăcina publică.","Configurează domeniul/DNS și certificatul HTTPS (SSL).","Verifică fotografiile, linkurile și actualizările; păstrează backup și datele contului la proprietar."],"stepsEn":["Client buys hosting and a domain under their own account; check included services.","Open cPanel > File Manager.","Open the site's document root, usually public_html.","Upload the site ZIP, Extract it and verify index.html is in the public root.","Configure domain DNS and HTTPS certificate.","Test pages and images, retain backups and keep credentials with the owner."]},{"id":"cloudflare-app","mode":"dynamic","title":"Cloudflare Workers + date + imagini","best":true,"doc":"https://developers.cloudflare.com/workers/get-started/guide/","ro":"Pentru site-uri cu rezervări, mesaje, conturi și galerii administrate online. Necesită un backend complet, compatibil și testat; este o etapă tehnică separată.","en":"For bookings, messages, user accounts and online photo administration. Requires a complete, compatible, tested backend and separate technical deployment.","stepsRo":["Clientul deschide propriul cont Cloudflare și verifică costurile planului ales.","Dezvoltatorul finalizează și testează backendul real pentru rezervări, mesagerie și autentificare.","Configurează Workers, baza de date potrivită arhitecturii (de exemplu Durable Objects / D1) și stocarea imaginilor (de exemplu R2).","Configurează secretele și permisiunile în contul clientului, fără trimiterea lor prin chat.","Publică frontendul și API-ul, conectează domeniul și activează HTTPS.","Testează cu date de probă: rezervare, confirmare, mesaj, autentificare, fotografii și restaurare backup."],"stepsEn":["Client creates a Cloudflare account and reviews plan costs.","Developer completes and tests the real bookings/messages/login backend.","Configure Workers, the database suitable for the architecture (such as Durable Objects / D1), and image storage (such as R2).","Set secrets and permissions in the client's account without sending credentials by chat.","Deploy frontend and API, connect the domain and enable HTTPS.","Test sample booking, confirmation, message, login, photo upload and backup restoration."]},{"id":"managed-app","mode":"dynamic","title":"Găzduire administrată / server gestionat","best":false,"doc":"https://docs.cpanel.net/cpanel/files/file-manager/","ro":"Pentru clientul care vrea un furnizor să administreze serverul. Cere confirmare scrisă că furnizorul suportă tehnologia backendului și baza de date necesară.","en":"For clients who want a provider to manage the server. Confirm in writing that the host supports the app's exact backend and database stack.","stepsRo":["Cere furnizorului o ofertă cu backend, bază de date, stocare foto, HTTPS și backup incluse ori tarifate separat.","Verifică împreună cu dezvoltatorul compatibilitatea tehnologiei folosite (nu este suficient simplul hosting HTML).","Clientul încheie contractul și plătește direct furnizorului.","Dezvoltatorul instalează backendul și baza de date compatibile, apoi încarcă frontendul și fotografiile.","Configurează domeniul, conturile, e-mailurile tranzacționale și regulile de protecție a datelor.","Testează toate fluxurile și backupul înainte de lansarea publică."],"stepsEn":["Request hosting with backend/database, image storage, HTTPS and backups, with separate costs explained.","Ask the developer to confirm compatibility with the application's exact backend stack; static HTML hosting is not enough.","Client signs the hosting contract and pays the provider directly.","Developer deploys the compatible backend, database, frontend and media.","Set up domain, accounts, transactional email and data protection.","Test all functions and restore from backup before launching."]}]);
export const CREATOR_HOSTING_SCRIPT="const extraCreatorHostingCatalog="+JSON.stringify(SITE_HOSTING_GUIDES)+";\n"+String.raw`
function extraCreatorHostingPlans(mode){
 return extraCreatorHostingCatalog.filter(p=>p.mode===mode);
}
function extraCreatorHostingGuide(area,form){
 const panel=extraToolsEl('details','extra-creator-hosting-panel');
 panel.append(extraToolsEl('summary','',extraToolsLocale('🌍 Unde găzduiesc site-ul? Ghid pentru client','🌍 Where should I host my website? Client guide')));
 const intro=extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Alege o variantă potrivită. Clientul deține contul, domeniul și plătește furnizorul. Eva oferă recomandări, nu cumpără și nu publică automat.',
  'Choose a suitable option. The client owns and pays for hosting/domain. Eva recommends but does not buy or automatically deploy.'));
 const label=extraToolsEl('label','extra-work-label',extraToolsLocale('Ce tip de site dorește clientul?','What type of website does the client need?'));
 const mode=extraToolsEl('select','extra-work-input');
 for(const [id,ro,en] of [['static','Prezentare / galerie (fără rezervări active)','Static presentation / gallery (no live bookings)'],
 ['dynamic','Rezervări, mesagerie, conturi sau administrare online','Bookings, messages, logins or online administration']]){
  const op=extraToolsEl('option','',extraToolsLocale(ro,en));op.value=id;mode.append(op);
 }
 label.append(mode);
 const warning=extraToolsEl('p','extra-work-note');
 const list=extraToolsEl('div','extra-creator-hosting-options');
 const result=extraToolsEl('p','extra-work-note');
 const buttons=extraToolsEl('div','extra-creator-hosting-actions');
 const download=extraToolsBtn(extraToolsLocale('💾 Descarcă pașii pentru client','💾 Download client instructions'),()=>{
  const en=extraToolsLocale('ro','en')==='en';
  const pick=(ro,enText)=>en?enText:ro;
  const rows=[pick('GHID DE GĂZDUIRE — PROIECT EVA','HOSTING GUIDE — EVA PROJECT'),
   pick('Site: ','Website: ')+(form?.name?.value?.trim()||pick('fără nume','unnamed')),
   pick('Tip site: ','Site type: ')+(mode.value==='dynamic'?pick('Cu funcții interactive','Interactive website'):pick('Prezentare statică','Static website')),
   '',pick('Proprietarul site-ului creează și plătește contul de găzduire.','The website owner creates and pays for hosting.'),
   pick('Domeniul, accesul și copiile de siguranță rămân la client.','Domain, access and backups remain with the client.'),
   pick('Ghid orientativ; costurile și planurile trebuie verificate la furnizor.','Guidance only; confirm current prices and plan limits with provider.'),'',
   pick('ATENȚIE: exportul HTML este static; rezervările, mesajele și administrarea live cer un backend complet instalat separat.',
    'IMPORTANT: HTML export is static; bookings, messages and live administration need a separately deployed complete backend.'),''];
  for(const p of extraCreatorHostingPlans(mode.value)){
   rows.push(p.title, en?p.en:p.ro,p.doc);
   (en?p.stepsEn:p.stepsRo).forEach((step,i)=>rows.push((i+1)+'. '+step));
   rows.push('');
  }
  if(mode.value==='dynamic')rows.push(
   pick('INSTALARE GHIDATĂ CLOUDFLARE (pe calculatorul clientului)','GUIDED CLOUDFLARE INSTALL (on the owner’s computer)'),
   'https://github.com/kokocf-ui/myPocketAi/actions/workflows/eva-client-backend-package.yml',
   pick('Creatorul descarcă ZIP-ul independent din GitHub Actions și îl predă clientului.',
    'The creator downloads the independent ZIP from GitHub Actions and hands it to the owner.'),
   'node instalare-eva.mjs',
   pick('Proprietarul își autorizează contul Cloudflare; instalatorul publică backendul.',
    'The owner authorizes their Cloudflare account; the installer deploys the backend.'),
   pick('Importă fișierul .pocket-site.json din Eva în Studio, verifică politica de confidențialitate și publică.',
    'Import Eva’s .pocket-site.json project into Studio, verify the privacy notice and publish.'),
   'node instalare-eva.mjs --finish',
   pick('Revocă cheia temporară de instalare după conectarea administratorului.',
    'Revoke the one-time setup key after administrator login.'),
   '');
  rows.push(pick('VERIFICĂ LA FINAL: domeniu, HTTPS, fotografii, mobil, contact, backup, costuri și drept de administrare.',
   'FINAL CHECK: domain, HTTPS, photos, mobile, contact, backup, costs and administration permissions.'));
  const txt=rows.join('\n'),blob=new Blob([txt],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
  const a=extraToolsEl('a');a.href=url;a.download='eva-ghid-gazduire.txt';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  result.textContent=extraToolsLocale('Ghidul a fost pregătit.','Guide prepared.');
 });
 buttons.append(download);
 function refresh(){
  list.replaceChildren();
  warning.textContent=mode.value==='dynamic'?
   extraToolsLocale('Atenție: un fișier HTML nu oferă singur rezervări, mesagerie sau panou live. Se recomandă un backend testat și găzduit pe contul clientului.',
    'An HTML file alone cannot provide bookings, messaging or a live admin panel. A tested backend is required in the client account.'):
   extraToolsLocale('Pentru site-uri statice poți începe cu o variantă simplă. Formularul de contact și rezervările active nu funcționează doar din HTML.',
    'Static sites can use simpler hosting. Contact forms and live bookings do not work from HTML alone.');
  for(const p of extraCreatorHostingPlans(mode.value)){
   const card=extraToolsEl('details','extra-creator-hosting-card');
   const summary=extraToolsEl('summary','',p.title);
   if(p.best)summary.append(extraToolsEl('span','extra-creator-hosting-recommendation',extraToolsLocale('Recomandare de pornire','Suggested start')));
   card.append(summary,extraToolsEl('p','extra-work-note',extraToolsLocale(p.ro,p.en)));
   const ol=extraToolsEl('ol','extra-creator-hosting-steps');
   const inEnglish=extraToolsLocale('ro','en')==='en';
   for(const step of (inEnglish?p.stepsEn:p.stepsRo)){const li=extraToolsEl('li','',step);ol.append(li)}
   card.append(ol);
   const a=extraToolsEl('a','extra-creator-hosting-doc',extraToolsLocale('Documentația oficială','Official setup guide'));
   a.href=p.doc;a.target='_blank';a.rel='noopener noreferrer';card.append(a);
   list.append(card);
  }
 }
 mode.addEventListener('change',refresh);refresh();
 panel.append(intro,label,warning,list,buttons,result);area.append(panel);
 return {panel,mode};
}
`;
export const CREATOR_HOSTING_STYLE=String.raw`
#view-module.extra-tools-workspace .extra-creator-hosting-panel{border:1px solid #6396a8!important;background:#0d283c!important;border-radius:13px!important;margin:14px 0!important;padding:12px!important}
#view-module.extra-tools-workspace .extra-creator-hosting-panel>summary{font-weight:750!important;cursor:pointer!important;font-size:15px!important;line-height:1.4!important}
#view-module.extra-tools-workspace .extra-creator-hosting-card{border:1px solid #32667d!important;background:#14394e!important;padding:11px!important;margin:8px 0!important;border-radius:11px!important}
#view-module.extra-tools-workspace .extra-creator-hosting-card>summary{font-weight:700!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:6px!important;flex-wrap:wrap!important}
#view-module.extra-tools-workspace .extra-creator-hosting-recommendation{font-weight:500!important;font-size:11px!important;color:#d7f6e6!important}
#view-module.extra-tools-workspace .extra-creator-hosting-steps{padding-left:21px!important;margin:8px 0!important}
#view-module.extra-tools-workspace .extra-creator-hosting-steps li{margin:0 0 8px!important;line-height:1.4!important;font-size:13px!important}
#view-module.extra-tools-workspace .extra-creator-hosting-doc{display:inline-block!important;color:#a7efff!important;text-decoration:underline!important;padding:6px!important;font-size:12px!important}
#view-module.extra-tools-workspace .extra-creator-hosting-actions button{min-height:44px!important;width:100%!important;max-width:none!important;white-space:normal!important}
`;
