/*
 * Direct-surface Android entrance: deliberately NOT used by regular chat,
 * voice interactions, or exit confirmations.
 * The 3D avatar HTML now runs as the top WebView document, not in an iframe.
 * This allows its WebGL alpha pixels to compose directly over Android wallpaper.
 */
(() => {
 'use strict';
 if(window.__pocketNativeEntranceLoaded)return;
 window.__pocketNativeEntranceLoaded=true;
 const doc=document;
 const root=doc.documentElement;
 const body=doc.body;
 if(!body)return;
 root.style.setProperty('background','transparent','important');
 root.style.setProperty('background-color','transparent','important');
 body.style.setProperty('background','transparent','important');
 body.style.setProperty('background-color','transparent','important');
 body.style.setProperty('margin','0','important');
 body.style.setProperty('overflow','hidden','important');
 const style=doc.createElement('style');style.id='pocket-native-enter-alpha';
 style.textContent=[
  'html,body{background:transparent!important;background-color:transparent!important;background-image:none!important;}',
  'html::before,html::after,body::before,body::after{background:transparent!important;background-image:none!important;}',
  'body > div:not(#pocket-native-mist){background-color:transparent!important;background-image:none!important;}',
  '#pocket-native-mist{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;background:transparent!important;pointer-events:none!important;z-index:2147483000!important;}'
 ].join('');
 (doc.head||root).append(style);
 const mist=doc.createElement('canvas');
 mist.id='pocket-native-mist';mist.setAttribute('aria-hidden','true');
 body.appendChild(mist);
 const ctx=mist.getContext('2d',{alpha:true});
 const startedAt=performance.now();
 const particles=[];
 let seed=5139;
 const rand=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<155;i++)particles.push({
  angle:rand()*Math.PI*2,radius:rand(),size:1.4+rand()*4.7,
  speed:.3+rand()*.8,phase:rand()*6.28,alpha:.2+rand()*.6
 });
 let ratio=1,width=0,height=0,ready=false,readyAt=0,finished=false,surface=null;
 function resize(){
  ratio=Math.min(window.devicePixelRatio||1,2);
  width=window.innerWidth;height=window.innerHeight;
  mist.width=Math.max(1,Math.round(width*ratio));
  mist.height=Math.max(1,Math.round(height*ratio));
  if(ctx)ctx.setTransform(ratio,0,0,ratio,0,0);
 }
 resize();window.addEventListener('resize',resize);
 const styles=["background","background-color","background-image"];
 function transparentParentChain(canvas){
  let el=canvas;
  while(el && el.nodeType===1){
   for(const key of styles){
    el.style.setProperty(key,key==='background-image'?'none':'transparent','important');
   }
   el=el.parentElement;
  }
 }
 function findRenderer(){
  return [...doc.querySelectorAll('canvas')].filter(c=>c!==mist)
   .sort((a,b)=>(b.width*b.height)-(a.width*a.height))[0]||null;
 }
 function configureRenderer(){
  const candidate=findRenderer();
  if(!candidate)return false;
  if(surface!==candidate){
   surface=candidate;
   transparentParentChain(surface);
   // The opaque iframe was the rectangular compositor layer. Hide this
   // direct WebGL surface until the mist has begun and the model is ready.
   surface.style.setProperty('opacity','0','important');
   surface.style.setProperty('filter','blur(15px) brightness(.7)','important');
   surface.style.setProperty('transform','translateY(20px) scale(.94)','important');
   surface.style.setProperty('transition','opacity 1.75s ease,filter 1.9s ease,transform 2s ease','important');
   surface.style.setProperty('transform-origin','center center','important');
   surface.style.setProperty('background','transparent','important');
  }
  return true;
 }
 function message(kind){try{window.PocketAvatarLaunch?.postMessage?.(kind)}catch(_){}}
 function animation(now){
  if(finished||!ctx)return;
  ctx.clearRect(0,0,width,height);
  const t=ready?Math.max(0,(now-readyAt)/1000):0;
  const spread=ready?Math.min(1,t/1.9):.05;
  const cloud=ready?Math.max(0,1-t/2.8):.14;
  // Move the mist ring to the face/neck center, not the lower chest.
  // The original 59% center sat noticeably below the head on portrait phones.
  const cx=width*.5,cy=height*.47;
  for(const p of particles){
   const k=.09+p.radius*.19+spread*(.12+p.speed*.17);
   const x=cx+Math.cos(p.angle)*width*k+Math.sin(t*1.6+p.phase)*5;
   const y=cy+Math.sin(p.angle)*height*(.09+p.radius*.17+spread*.1)-t*13*p.speed;
   const alpha=p.alpha*cloud*(.64+.36*Math.sin(t*1.8+p.phase)**2);
   const radius=p.size*(1+spread*.9);
   const gradient=ctx.createRadialGradient(x,y,0,x,y,radius*3.5);
   gradient.addColorStop(0,'rgba(136,240,255,'+Math.min(.87,alpha)+')');
   gradient.addColorStop(.35,'rgba(34,185,225,'+Math.min(.38,alpha*.4)+')');
   gradient.addColorStop(1,'rgba(20,145,203,0)');
   ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,radius*3.5,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(animation);
 }
 requestAnimationFrame(animation);
 function begin(){
  if(ready||!configureRenderer()||!window.PocketAvatarAPI)return false;
  ready=true;readyAt=performance.now();
  try{window.PocketAvatarAPI.setVisible(true)}catch(_){}
  requestAnimationFrame(()=>{
   requestAnimationFrame(()=>{
    if(surface){
     surface.style.setProperty('opacity','1','important');
     surface.style.setProperty('filter','blur(0) brightness(1)','important');
     surface.style.setProperty('transform','translateY(0) scale(1)','important');
    }
   });
  });
  message('ready');
  return true;
 }
 // Top-level 3D document, so no nested iframe compositor or square backdrop.
 let attempts=0;
 const poll=setInterval(()=>{
  if(finished||begin()||++attempts>65)clearInterval(poll);
 },100);
 window.pocketLaunchSpeak=(speaking,text)=>{
  try{
   if(speaking)window.PocketAvatarAPI?.start?.(text||'Salut!');
   else window.PocketAvatarAPI?.stop?.();
  }catch(_){}
 };
 window.pocketLaunchBoundary=(charIndex)=>{
  try{window.PocketAvatarAPI?.boundary?.(charIndex)}catch(_){}
 };
 window.pocketLaunchFinish=()=>{
  finished=true;clearInterval(poll);
  if(surface){surface.style.setProperty('opacity','0','important')}
  mist.style.opacity='0';
 };
})();