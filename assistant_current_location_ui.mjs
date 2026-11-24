// Minimal current-location map: address is rendered by the answer reader.
// Basemap itself provides visible place labels even when external POI services fail.
export const ASSISTANT_CURRENT_LOCATION_UI_SCRIPT=String.raw`
// The map has room for the address only. Detailed uncertainty remains in the chat reply.
function currentLocationMapAddress(reply){
 return String(reply||'').split(/\r?\n/).find(line=>line.trim())?.trim()||'';
}
function appendCurrentLocationMap(body,record){
 const point=record&&record.coordinates;
 const latitude=Number(point&&point.latitude),longitude=Number(point&&point.longitude);
 if(!point||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)return ()=>{};
 const ro=state.language==='ro',word=(a,b)=>ro?a:b;
 const panel=document.createElement('section');
 panel.className='current-location-map-panel';
 panel.style.cssText='flex:1 1 0;min-height:0;display:flex;flex-direction:column;width:100%;margin:0;padding:0';
 const mapHost=document.createElement('div');
 mapHost.className='current-location-map-canvas';
 mapHost.style.cssText='flex:1 1 0;min-height:160px;width:100%;border-radius:12px;overflow:hidden;background:#e8ecee;white-space:normal;touch-action:pan-x pan-y';
 mapHost.setAttribute('role','region');
 mapHost.setAttribute('aria-label',word('Harta poziției și obiectivelor din apropiere','Map of your position and nearby places'));
 panel.append(mapHost);body.append(panel);
 let disposed=false,L=null,map=null,markers=null,controller=null,places=[],lastPoiCenter=null;
 function categorySymbol(category){
  const value=String(category||'').toLowerCase();
  if(/fuel|gas_station|petrol/.test(value))return '⛽';
  if(/supermarket|convenience|shop|commercial|retail|mall/.test(value))return '🛒';
  if(/pharmacy|hospital|doctor|healthcare|clinic/.test(value))return '✚';
  if(/bus|tram|train|railway|public_transport|station/.test(value))return '🚉';
  if(/cafe|coffee|catering|restaurant|fast_food|food/.test(value))return '☕';
  if(/hotel|accommodation/.test(value))return '🏨';
  if(/school|education|university/.test(value))return '🏫';
  if(/tourism|museum|historic|heritage/.test(value))return '🏛';
  return '●';
 }
 function redraw(){
  if(!markers||!map||!L)return;
  markers.clearLayers();
  for(const poi of places){
   const lat=Number(poi?.latitude),lon=Number(poi?.longitude),name=String(poi?.name||'').trim();
   if(!name||!Number.isFinite(lat)||!Number.isFinite(lon))continue;
   const symbol=categorySymbol(poi.category);
   const markerIcon=L.divIcon({
    className:'current-location-poi-icon',
    html:'<span style="display:flex;align-items:center;justify-content:center;width:25px;height:25px;border:1px solid #65374d;border-radius:8px;background:#fffdf4;color:#60283e;box-shadow:0 1px 4px #3335;font-size:15px;font-weight:800">'+symbol+'</span>',
    iconSize:[25,25],iconAnchor:[12,12],popupAnchor:[0,-13]
   });
   const popup=document.createElement('div');
   popup.style.cssText='min-width:100px;line-height:1.4';
   const nameEl=document.createElement('strong');nameEl.textContent=name;popup.append(nameEl);
   if(poi.address){const meta=document.createElement('div');meta.textContent=String(poi.address);popup.append(meta)}
   L.marker([lat,lon],{icon:markerIcon,title:name}).bindPopup(popup,{maxWidth:220}).addTo(markers);
  }
 }
 async function updatePois(){
  if(disposed||!map)return;
  const center=map.getCenter();
  // Opening a popup may auto-pan slightly; keep its marker and popup stable.
  if(lastPoiCenter&&map.distance(lastPoiCenter,center)<180)return;
  lastPoiCenter=center;
  controller?.abort();controller=new AbortController();
  const signal=controller.signal;
  try{
   const response=await fetch('/api/location-pois',{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    signal,body:JSON.stringify({location:{latitude:center.lat,longitude:center.lng},radius:1500})
   });
   if(!response.ok)throw Error('POI HTTP '+response.status);
   const data=await response.json();
   if(disposed||signal.aborted)return;
   if(data.status!=='success')throw Error('POI unavailable');
   places=Array.isArray(data.pois)?data.pois.slice(0,150):[];
   redraw();
  }catch(e){
   // Keep the usable OpenStreetMap labels when a POI provider is unavailable.
   // Never replace the map with a POI counter or an error dialog.
   if(!disposed&&!signal.aborted&&markers){places=[];redraw()}
  }
 }
 async function createMap(){
  try{
   L=await loadRouteMapLibrary();
   if(disposed||!mapHost.isConnected)return;
   map=L.map(mapHost,{scrollWheelZoom:false,preferCanvas:true});
   // Public OpenStreetMap standard tiles display shops, petrol stations and
   // other mapped labels. CARTO tiles require a key and cannot be used here.
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,attribution:'&copy; OpenStreetMap contributors'
   }).addTo(map);
   // Canvas circle avoids the broken default Leaflet marker image in Android.
   L.circleMarker([latitude,longitude],{
    radius:9,weight:3,color:'#fff',fillColor:'#852c52',fillOpacity:1
   }).addTo(map).bindPopup(word('Poziția mea','My position'));
   markers=L.layerGroup().addTo(map);
   map.on('moveend',updatePois);
   map.setView([latitude,longitude],16);
   requestAnimationFrame(()=>{if(!disposed&&map){map.invalidateSize();redraw()}});
  }catch(e){
   if(!disposed)mapHost.textContent=word('Harta nu poate fi încărcată.','Map unavailable.');
  }
 }
 createMap();
 return ()=>{disposed=true;controller?.abort();if(map){map.remove();map=null}};
}
`;
