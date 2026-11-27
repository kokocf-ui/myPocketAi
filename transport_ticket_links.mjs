// Public ticket destinations, never a claim of stock, a quote or a reservation.
// Static entries are official sites, not invented journey-specific deep links.
export function transportTicketUrl(value){
 if(typeof value!=='string'||value.length>2048)return null;
 try{
  const u=new URL(value),h=u.hostname.toLowerCase();
  if(u.protocol!=='https:'||u.username||u.password||u.port||!h.includes('.')||
    h==='localhost'||h.endsWith('.local')||h.endsWith('.internal')||h.endsWith('.test')||
    /^\d+(?:\.\d+){3}$/.test(h)||h.includes(':'))return null;
  return u.href;
 }catch{return null}
}
export function transportOperatorTicketSite(name){
 const key=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
 return ({'british airways':'https://www.britishairways.com/','wizz air':'https://wizzair.com/',
  'wizz air uk':'https://wizzair.com/','wizzair':'https://wizzair.com/',
  'ryanair':'https://www.ryanair.com/','easyjet':'https://www.easyjet.com/',
  'lufthansa':'https://www.lufthansa.com/','swiss':'https://www.swiss.com/',
  'swiss international air lines':'https://www.swiss.com/','ita':'https://www.ita-airways.com/',
  'ita airways':'https://www.ita-airways.com/','air dolomiti':'https://www.airdolomiti.it/',
  'tarom':'https://www.tarom.ro/','cfr calatori':'https://www.cfrcalatori.ro/',
  'flixbus':'https://www.flixbus.com/','national express':'https://www.nationalexpress.com/',
  'national rail':'https://www.nationalrail.co.uk/','c2c':'https://www.c2c-online.co.uk/',
  'eurostar':'https://www.eurostar.com/','deutsche bahn':'https://www.bahn.de/',
  'obb':'https://www.oebb.at/','regiojet':'https://regiojet.com/',
  'sncf connect':'https://www.sncf-connect.com/'})[key]||null;
}
export function transportTicketLink(leg){
 const mode=String(leg?.mode||'').toLowerCase();
 if(!/^(?:train|rail|national-rail|coach|autocar|flight|airplane|plane|ferry)$/.test(mode))return null;
 const operator=String(leg.operator||leg.airline||'').trim();
 const provider=transportTicketUrl(leg.bookingUrl||leg.booking_url||leg.ticketUrl);
 if(provider)return {url:provider,kind:'provider_link',operator};
 const site=transportTicketUrl(leg.operatorUrl)||transportOperatorTicketSite(operator);
 if(site)return {url:site,kind:'operator_site',operator};
 // Clearly labelled external search, not a discovered service or a dated fare.
 return {url:'https://www.omio.com/',kind:'external_search',operator};
}
