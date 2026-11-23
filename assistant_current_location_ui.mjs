// Location answer map. Injected into the existing HTML frontend after the shared Leaflet loader.
export const ASSISTANT_CURRENT_LOCATION_UI_SCRIPT=String.raw`
function appendCurrentLocationMap(body,record){
 const point=record&&record.coordinates,latitude=Number(point&&point.latitude),longitude=Number(point&&point.longitude);
 if(!point||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)return ()=>{};
 const ro=state.language==='ro';
 const word=(a,b)=>ro?a:b;
 const panel=document.createElement('section');
 panel.className='current-location-map-panel';
 panel.style.cssText='margin:4px 0 6px;white-space:normal;border:0;border-radius:10px;background:#0b293c;padding:4px;color:#eaf6ff';
 const title=document.createElement('h3');
 title.textContent=word('Harta poziției și POI din apropiere','Your position and nearby POIs');
 title.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';
 const toolbar=document.createElement('div');
 toolbar.style.cssText='display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:0 0 5px';
 const radiusLabel=document.createElement('label');radiusLabel.textContent=word('Rază: ','Radius: ');
 const radiusSelect=document.createElement('select');radiusSelect.setAttribute('aria-label',word('Raza POI','POI radius'));
 for(const r of [350,750,1500]){const option=document.createElement('option');option.value=String(r);option.textContent=r<1000?r+' m':'1.5 km';radiusSelect.append(option)}
 radiusSelect.value='750';radiusLabel.append(radiusSelect);
 const refresh=document.createElement('button');refresh.type='button';refresh.textContent=word('Actualizează POI','Refresh POIs');
 radiusSelect.style.cssText=refresh.style.cssText='background:#16374b;color:#fff;border:1px solid #68aabc;border-radius:9px;min-height:40px;padding:7px;font:inherit;font-size:14px';
 toolbar.append(radiusLabel,refresh);
 const mapHost=document.createElement('div');
 mapHost.style.cssText='height:clamp(320px,63dvh,620px);max-height:calc(100dvh - 160px);min-height:260px;width:100%;border-radius:12px;overflow:hidden;background:#d9e1e5;touch-action:pan-x pan-y;white-space:normal';
 mapHost.setAttribute('role','region');mapHost.setAttribute('aria-label',title.textContent);
 const status=document.createElement('p');
 status.setAttribute('role','status');
 status.style.cssText='font-size:12px;line-height:1.3;color:#c6e4ed;margin:4px 0';
 status.textContent=word('Caut punctele de interes cartografiate…','Finding mapped points of interest…');
 const note=document.createElement('p');
 note.textContent=word('Poziția din momentul întrebării. Marcajele sunt aproximative; unele POI-uri pot lipsi din hartă.','Position at the time of the question. Pins are approximate; some POIs may not be mapped.');
 note.style.cssText=status.style.cssText;
 const details=document.createElement('details');
 details.style.cssText='margin-top:10px;border-top:1px solid #365b6e;padding-top:10px';
 const summary=document.createElement('summary');
 summary.style.cssText='font-weight:750;cursor:pointer;min-height:40px';
 summary.textContent=word('Puncte de interes','Points of interest');
 const list=document.createElement('div');details.append(summary,list);
 note.hidden=true;status.hidden=true;details.open=false;
 panel.append(title,toolbar,mapHost,status,note,details);body.append(panel);
 let disposed=false,L=null,map=null,markers=null,controller=null,places=[];
 const formatDistance=v=>Number(v)<1000?Math.round(Number(v))+' m':(Number(v)/1000).toFixed(1)+' km';
 function routeToPoi(item){
  const a=Number(item.latitude),o=Number(item.longitude);
  if(!Number.isFinite(a)||!Number.isFinite(o))return;
  closeAnswerReader(false);
  offerAssistantLocalityTravelMode({latitude:a,longitude:o,label:[String(item.name||''),String(item.address||'')].filter(Boolean).join(', '),entity_kind:'place'});
 }
 function redraw(){
  if(markers)markers.clearLayers();list.replaceChildren();
  for(const poi of places){
   const a=Number(poi?.latitude),o=Number(poi?.longitude),name=String(poi?.name||'').trim();
   if(!name||!Number.isFinite(a)||!Number.isFinite(o))continue;
   const item=document.createElement('div');
   item.style.cssText='padding:8px 0;border-bottom:1px solid #375366;display:flex;flex-direction:column;gap:4px';
   const btn=document.createElement('button');btn.type='button';btn.textContent=name+' · '+formatDistance(poi.distance_m);
   btn.style.cssText='background:transparent;border:0;color:#d5ffff;text-align:left;padding:5px 2px;font-weight:700;font-size:14px';
   const meta=document.createElement('small');meta.textContent=String(poi.category||'POI')+(poi.address?' · '+String(poi.address):'');
   meta.style.cssText='font-size:12px;color:#c0d9e6;overflow-wrap:anywhere';
   item.append(btn,meta);list.append(item);
   let pin=null;
   if(map&&markers){
    pin=L.circleMarker([a,o],{radius:6,color:'#6b294b',weight:2,fillColor:'#e7b3c6',fillOpacity:.95});
    const popup=document.createElement('div');
    const strong=document.createElement('strong');strong.textContent=name;popup.append(strong);
    if(poi.address){const p=document.createElement('p');p.textContent=String(poi.address);popup.append(p)}
    const action=document.createElement('button');action.type='button';action.textContent=word('Vreau să merg','Take me there');
    action.onclick=()=>routeToPoi(poi);popup.append(action);
    pin.bindPopup(popup);pin.addTo(markers);
   }
   btn.onclick=()=>{if(map&&pin){map.setView([a,o],Math.max(map.getZoom(),17));pin.openPopup()}else routeToPoi(poi)};
  }
  summary.textContent=word('Puncte de interes','Points of interest')+' ('+places.length+')';
 }
 async function updatePois(){
  if(disposed)return;
  controller?.abort();controller=new AbortController();const signal=controller.signal;
  refresh.disabled=true;status.hidden=true;status.textContent=word('Actualizez punctele de interes…','Refreshing points of interest…');
  try{
   const response=await fetch('/api/location-pois',{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal,
    body:JSON.stringify({location:{latitude,longitude},radius:Number(radiusSelect.value)})
   });
   if(!response.ok)throw Error('POI HTTP '+response.status);
   const data=await response.json();
   if(disposed||signal.aborted)return;
   if(data.status!=='success')throw Error('POIs unavailable');
   places=Array.isArray(data.pois)?data.pois.slice(0,150):[];redraw();
   status.hidden=places.length>0;
   status.textContent=places.length
    ?word('POI cartografiate: ','Mapped POIs: ')+places.length+' · '+String(data.source||'OpenStreetMap')+(data.truncated?word(' · primele 150',' · first 150'):'')
    :word('Nu s-au găsit POI cartografiate în această rază.','No mapped POIs found in this radius.');
  }catch(e){if(disposed||signal.aborted)return;places=[];redraw();status.hidden=false;status.textContent=word('POI-urile nu pot fi încărcate momentan.','POIs cannot be loaded right now.')}
  finally{if(!disposed&&!signal.aborted)refresh.disabled=false}
 }
 async function createMap(){
  try{
   L=await loadRouteMapLibrary();if(disposed||!mapHost.isConnected)return;
   map=L.map(mapHost,{scrollWheelZoom:false});
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
   L.marker([latitude,longitude],{title:word('Poziția mea GPS','My GPS position')}).addTo(map).bindPopup(word('Poziția mea GPS','My GPS position'));
   const accuracy=Number(point.accuracy);
   // GPS accuracy circle deliberately omitted: it resembled a navigation overlay.
   markers=L.layerGroup().addTo(map);map.setView([latitude,longitude],16);
   requestAnimationFrame(()=>{if(!disposed&&map){map.invalidateSize();redraw()}});
  }catch(e){if(!disposed)mapHost.textContent=word('Harta nu poate fi încărcată momentan.','The map cannot be loaded right now.')}
 }
 radiusSelect.addEventListener('change',updatePois);
 refresh.addEventListener('click',updatePois);
 createMap();updatePois();
 return ()=>{disposed=true;controller?.abort();if(map){map.remove();map=null}};
}
`;
