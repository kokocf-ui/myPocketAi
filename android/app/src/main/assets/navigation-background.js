/* Native Android navigation opt-in for an already selected Maps/transit journey.
 * This file is injected only into the app's trusted first-party WebView.
 * No automatic background tracking from route searches or itinerary previews.
 */
(function(){
 if(window.__pocketNavigationBridgeInstalled)return;
 window.__pocketNavigationBridgeInstalled=true;
 const KEY='pocket_navigation_session_v1';
 let activeId=null,scheduled=false;
 const appState=()=>{try{return typeof state==='object'&&state?state:null}catch{return null}};
 const t=(ro,en)=>appState()?.language==='en'?en:ro;
 const getSelected=()=>{
  const s=appState();
  if(s?.currentModule!=='maps')return null;
  const selected=s.selectedTransitJourney;
  if(!selected||typeof selected!=='object')return null;
  return selected.journey&&Array.isArray(selected.journey.legs)?selected.journey:
    Array.isArray(selected.legs)?selected:null;
 };
 const saved=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
 const native=(payload)=>{
  try{
   if(!window.PocketAndroidNavigation?.postMessage)return false;
   window.PocketAndroidNavigation.postMessage(JSON.stringify(payload));
   return true;
  }catch{return false}
 };
 const label=(journey)=>{
  const a=appState()?.lastTransitResponse?.transit_destination_point;
  return String(a?.label||journey?.legs?.at(-1)?.to||'Destinație').slice(0,120);
 };
 const instructions=(journey)=>Array.isArray(journey?.legs)?journey.legs.slice(0,24).map((leg,i)=>{
  const lines=(leg.lineNames||[]).join(' ');
  const mode=String(leg.mode||'').toLowerCase();
  const action=/walk|foot|pedestrian/.test(mode)?'Pe jos':(lines?lines:mode);
  return (i+1)+'. '+action+' · '+String(leg.from||'?')+' → '+String(leg.to||'?')+
   (Number.isFinite(Number(leg.durationMinutes))?' · '+Math.ceil(Number(leg.durationMinutes))+' min':'');
 }).join('\n').slice(0,2700):'';
 const storage=(value)=>{try{if(value)localStorage.setItem(KEY,JSON.stringify(value));else localStorage.removeItem(KEY)}catch{}};
 const activate=()=>{
  const selected=getSelected();
  if(!selected)return;
  const session=(window.crypto?.randomUUID?.().replace(/-/g,'')||('nav'+Date.now().toString(36)+Math.random().toString(36).slice(2))).slice(0,64);
  const record={id:session,destination:label(selected),mode:selected.finalWalkRoute?'walking':'mixed',
   steps:instructions(selected),journey:selected,createdAt:Date.now()};
  // Bound data retained only on device; never persist a full user conversation.
  let serialized='';
  try{serialized=JSON.stringify(record)}catch{return}
  if(serialized.length>24000){record.journey={legs:selected.legs?.slice(0,16)};serialized=JSON.stringify(record)}
  if(serialized.length>24000)return;
  storage(record);
  if(!native({action:'start',sessionId:session,destination:record.destination,
   mode:record.mode,steps:record.steps})){
   storage(null);
   window.alert(t('Navigarea în fundal necesită aplicația Android.',
    'Background navigation requires the Android app.'));
  }
 };
 const stop=()=>{
  native({action:'stop'});
  activeId=null;storage(null);renderButton();
  document.getElementById('pocket-navigation-restore')?.remove();
 };
 const overlay=(record)=>{
  if(!record||!record.id)return;
  document.getElementById('pocket-navigation-restore')?.remove();
  const page=document.createElement('section');
  page.id='pocket-navigation-restore';
  page.setAttribute('role','region');
  page.setAttribute('aria-label',t('Navigația curentă','Current navigation'));
  page.style.cssText='position:fixed;inset:0;z-index:2147482000;overflow-y:auto;'+
   'background:#081d29;color:#f9fafb;padding:28px 18px 100px;box-sizing:border-box;font-size:16px';
  const heading=document.createElement('h2');
  heading.textContent=t('Navigație în desfășurare','Navigation in progress');
  heading.style.cssText='text-align:center;font-size:20px;margin:0 0 20px';
  const dest=document.createElement('h3');dest.textContent=record.destination;
  dest.style.cssText='font-size:17px;margin:0 0 18px';
  const details=document.createElement('div');details.textContent=record.steps||'';
  details.style.cssText='white-space:pre-line;line-height:1.7;overflow-wrap:anywhere';
  const button=(title,callback)=>{
   const b=document.createElement('button');b.type='button';b.textContent=title;
   b.style.cssText='background:#752347;color:#fff;border:0;border-radius:14px;'+
    'padding:12px 16px;margin:16px 7px 0 0;min-height:48px;font-size:15px';
   b.onclick=callback;return b;
  };
  const back=button(t('Arată traseul curent','Show current route'),()=>{
   page.remove();
   const s=appState();
   if(s){
    s.selectedTransitJourney=record.journey;
    if(typeof switchConversationModule==='function')switchConversationModule('maps');
    if(record.journey?.finalWalkRoute&&typeof showPreciseJourney==='function'){
     try{showPreciseJourney(record.journey.finalWalkRoute)}catch{}
    }else if(typeof renderTransitChoices==='function'){
     try{renderTransitChoices([record.journey],0)}catch{}
    }
   }
  });
  const end=button(t('Oprește navigația','Stop navigation'),stop);
  page.append(heading,dest,details,back,end);
  document.body.append(page);
 };
 window.pocketNativeNavigationAck=(success,session)=>{
  if(success){activeId=session;renderButton()}
  else {if(saved()?.id===session)storage(null);activeId=null;renderButton();
   window.alert(t('Nu s-a putut activa navigația în notificări. Verifică permisiunile Android.',
    'Navigation notification could not start. Check Android permissions.'))}
 };
 window.pocketNativeNavigationStopped=()=>{
  activeId=null;storage(null);
  document.getElementById('pocket-navigation-restore')?.remove();
  renderButton();
 };
 window.pocketNativeNavigationResume=(session)=>{
  const record=saved();
  if(record?.id!==session)return false;
  activeId=session;
  const s=appState();
  if(s){s.selectedTransitJourney=record.journey;
    if(typeof switchConversationModule==='function')switchConversationModule('maps');}
  overlay(record);
  renderButton();
  return true;
 };
 const renderButton=()=>{
  let host=null;
  try{
   const s=appState();
   if(s?.currentModule==='maps'&&getSelected())
    host=document.getElementById('moduleLayerBody')||document.getElementById('moduleContent');
  }catch{}
  const old=document.getElementById('pocket-navigation-background-action');
  if(!host){old?.remove();return}
  if(old?.parentNode!==host)old?.remove();
  const button=old?.parentNode===host?old:document.createElement('button');
  button.id='pocket-navigation-background-action';button.type='button';
  button.textContent=activeId?t('Oprește navigația','Stop navigation'):
    t('Pornește navigația în notificări','Start notification navigation');
  button.style.cssText='display:block;width:100%;padding:12px;margin:10px auto;'+
   'background:#752347;color:#fff;border-radius:12px;border:1px solid #aa6681;'+
   'font-weight:700;min-height:48px;max-width:420px';
  button.onclick=activeId?stop:activate;
  if(!button.parentNode)host.append(button);
 };
 const observer=new MutationObserver(()=>{
  if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;renderButton()});
 });
 observer.observe(document.documentElement,{subtree:true,childList:true});
 window.addEventListener('pocket-navigation-changed',renderButton);
 document.addEventListener('DOMContentLoaded',renderButton);
 renderButton();
})();
