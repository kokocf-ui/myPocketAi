// Public transport alternative choices are paged to the available viewport.
// Selected itineraries use continuous directions in route_navigation_ui.mjs.
export const TRANSIT_VIEWPORT_STYLE=String.raw`
.transit-full-journey-map.transit-viewport-screen{display:flex!important;flex-direction:column!important;overflow:hidden!important;box-sizing:border-box;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)!important;min-height:0!important;z-index:1200!important}
.transit-viewport-screen .route-map-header{flex:none;padding:4px 6px;gap:4px}
.transit-viewport-screen .route-map-header h2{font-size:15px!important}
.transit-viewport-screen .route-map-header button{min-height:40px!important}
.transit-viewport-screen .route-map-status{flex:none;margin:3px 10px!important;font-size:12px!important;line-height:1.2!important;height:2.5em;min-height:2.5em;max-height:2.5em;overflow:hidden}
.transit-viewport-screen .route-map-canvas{height:auto!important;min-height:85px!important;max-height:none!important;flex:1 1 42%!important}
.transit-viewport-screen .transit-full-journey-details{position:relative;display:block!important;flex:1 1 48%!important;min-height:0!important;max-height:none!important;padding:6px 10px!important;overflow:hidden!important;box-sizing:border-box}
.transit-viewport-screen .transit-page-panel{position:relative;width:100%;height:100%;min-height:0;overflow:hidden!important}
.transit-screen-page{box-sizing:border-box;width:100%;height:100%;overflow:hidden!important;overflow-wrap:anywhere;font-size:14px;line-height:1.25}
.transit-screen-page>*{margin:0 0 5px!important;padding-top:0!important;padding-bottom:0!important;font-size:inherit!important;line-height:inherit!important;max-width:100%;box-sizing:border-box}
.transit-screen-page a{display:block;min-height:30px;padding:4px 0!important}
.transit-screen-pager,.transit-fixed-controls{display:flex;flex:none;align-items:center;gap:6px;padding:4px 8px;min-height:44px;box-sizing:border-box}
.transit-screen-pager button,.transit-fixed-controls button{flex:1 1 0;min-width:0;min-height:40px!important;height:auto;margin:0!important;padding:5px 7px!important;font-size:13px!important;line-height:1.15!important;border:1px solid #5597ac;border-radius:10px;background:#12354b;color:#e4ffff}
.transit-screen-pager .transit-page-count{flex:1.5;min-width:0;text-align:center;font-size:12px;line-height:1.15}
.transit-screen-pager button:disabled{opacity:.45}
.transit-viewport-screen [hidden]{display:none!important}
.transit-viewport-screen .transit-template-store{display:none!important}
.transit-options-viewport{overflow:hidden!important;padding-bottom:8px!important;gap:6px!important}
.transit-options-viewport>.transit-template-store{display:none!important}
.transit-options-viewport>.ro-transport-page-tabs{flex:none}
.transit-options-viewport>h3{flex:none;margin:0;font-size:18px}
.transit-options-viewport>.quick-navigation-toolbar{flex:none}
#moduleLayerBody.transit-options-viewport>.transit-page-panel{flex:1 1 0!important;min-height:0;height:auto}
.transit-options-viewport .transit-screen-page>.transit-journey-choice{width:100%;margin:0 0 8px!important;padding:10px!important;min-height:80px}
.transit-options-viewport .transit-screen-page>.transit-journey-choice strong{font-size:15px!important;line-height:1.2!important}
`;
export const TRANSIT_VIEWPORT_SCRIPT=String.raw`
function mountTransitScreenPager(panel,sourceGroups,nav,onPage){
 panel.classList.add('transit-page-panel');nav.className='transit-screen-pager';
 const previous=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
 previous.type=next.type='button';previous.textContent='‹';next.textContent='›';
 previous.setAttribute('aria-label',dialogText('Pagina anterioară','Previous page'));
 next.setAttribute('aria-label',dialogText('Pagina următoare','Next page'));
 count.className='transit-page-count';count.setAttribute('role','status');count.setAttribute('aria-live','polite');
 nav.append(previous,count,next);
 let pages=[],index=0,frame=0,closed=false;
 const copy=node=>{
  const clone=node.cloneNode(true),originals=[node,...(node.querySelectorAll?.('*')||[])],clones=[clone,...(clone.querySelectorAll?.('*')||[])];
  clones.forEach((el,i)=>{el.removeAttribute?.('id');if(originals[i]?.onclick)el.onclick=originals[i].onclick});
  return clone;
 };
 const show=()=>{
  if(!pages.length)return;
  index=Math.max(0,Math.min(index,pages.length-1));
  const page=pages[index],host=document.createElement('div');host.className='transit-screen-page';
  host.dataset.group=String(page.group);host.append(...page.nodes);panel.replaceChildren(host);
  count.textContent=page.label+' · '+(index+1)+'/'+pages.length;
  previous.disabled=index===0;next.disabled=index===pages.length-1;
  onPage?.(page.group);panel.scrollTop=0;
 };
 const rebuild=()=>{
  frame=0;if(closed||!panel.isConnected||panel.clientHeight<20||panel.clientWidth<20)return;
  const oldGroup=pages[index]?.group,oldInGroup=pages.slice(0,index).filter(p=>p.group===oldGroup).length;
  const probe=document.createElement('div');probe.className='transit-screen-page';
  probe.style.cssText='position:absolute;top:0;left:0;height:auto!important;visibility:hidden;pointer-events:none;overflow:visible!important';
  panel.append(probe);const height=panel.clientHeight-2;pages=[];
  sourceGroups().forEach((group,groupIndex)=>{
   let nodes=[];
   const flush=()=>{if(nodes.length){pages.push({group:group.id??groupIndex,label:group.label,nodes});nodes=[];probe.replaceChildren()}};
   const fits=()=>probe.scrollHeight<=height;
   const add=node=>{
    if(!node.textContent?.trim()&&!node.matches?.('button,a'))return;
    const clone=copy(node);probe.append(clone);
    if(fits()){nodes.push(clone);return}
    clone.remove();if(nodes.length)flush();probe.append(clone);
    if(fits()){nodes.push(clone);return}
    clone.remove();
    // Split compound presentation blocks into their original semantic leaves.
    // Interactive cards/links stay actionable even when their text needs pages.
    if(node.children?.length>1&&!node.matches('a,button')){for(const child of node.children)add(child);return}
    const words=node.textContent.trim().split(/\s+/);let offset=0;
    while(offset<words.length){
     let lo=1,hi=words.length-offset,best=0;
     while(lo<=hi){const n=(lo+hi)>>1;clone.textContent=words.slice(offset,offset+n).join(' ');probe.append(clone);
      const ok=fits();clone.remove();if(ok){best=n;lo=n+1}else hi=n-1}
     if(!best){
      // A long identifier/address token is also paged, never ellipsized.
      const chars=Array.from(words[offset]);if(chars.length<2)break;
      words.splice(offset,1,chars.slice(0,Math.ceil(chars.length/2)).join(''),chars.slice(Math.ceil(chars.length/2)).join(''));continue;
     }
     const part=copy(node);part.textContent=words.slice(offset,offset+best).join(' ');probe.append(part);nodes.push(part);offset+=best;
     if(offset<words.length)flush();
    }
   };
   for(const node of group.nodes)add(node);flush();
  });
  probe.remove();
  const first=pages.findIndex(p=>p.group===oldGroup);
  if(first>=0){const n=pages.filter(p=>p.group===oldGroup).length;index=first+Math.min(oldInGroup,n-1)}
  else index=Math.min(index,Math.max(0,pages.length-1));
  show();
 };
 const refresh=()=>{if(!closed&&!frame)frame=requestAnimationFrame(rebuild)};
 previous.onclick=()=>{index--;show()};next.onclick=()=>{index++;show()};
 const observer=new ResizeObserver(refresh);observer.observe(panel);refresh();
 return {refresh,first(){index=0;show()},goGroup(group){const target=pages.findIndex(p=>p.group===group);if(target>=0){index=target;show()}},close(){closed=true;cancelAnimationFrame(frame);observer.disconnect()}};
}
function clearTransitOptionsViewport(){
 state.transitOptionsPager?.close();state.transitOptionsPager=null;$('moduleLayerBody')?.classList.remove('transit-options-viewport');
}
function mountPublicTransitOptionsViewport(body){
 if(state.lastTransitChoice?.mixedJourney||!body.querySelector('.transit-journey-choice'))return;
 body.classList.add('transit-options-viewport');body.style.setProperty('overflow','hidden','important');
 const fixed=[...body.children].filter(el=>el.matches('h3,.quick-navigation-toolbar,.ro-transport-page-tabs'));
 const source=document.createElement('div');source.className='transit-template-store';source.hidden=true;
 source.append(...[...body.children].filter(el=>!fixed.includes(el)));
 const panel=document.createElement('div'),nav=document.createElement('div');body.replaceChildren(...fixed,panel,nav,source);
 const pager=mountTransitScreenPager(panel,()=>[{
  label:dialogText('Variante','Options'),nodes:[...source.children].flatMap(el=>el.matches('.ro-transport-page-content')?[...el.children]:[el])
 }],nav);
 const observer=new MutationObserver(()=>{pager.first();pager.refresh()});observer.observe(source,{childList:true,subtree:true,characterData:true});
 const close=pager.close;pager.close=()=>{observer.disconnect();close()};
 const old=state.transitOptionsPager;state.transitOptionsPager=pager;old?.close();
}
`;
