// Safe groundwork for a Europe-wide, single-Premium-tier affiliate programme.
// No private Impact ID, click tracking token or booking URL is embedded here.
// Only an owner-authenticated backend may provision the approved partner links.
const PARTNER_META=Object.freeze({
 omio:Object.freeze({category:'mixed_transport',label:'Omio'}),
 booking:Object.freeze({category:'hotels',label:'Booking.com'}),
 viator:Object.freeze({category:'activities',label:'Viator'})
});
export const AFFILIATE_PARTNERS=PARTNER_META;
export const AFFILIATE_DISCLOSURE_RO='Link de parteneriat: Eva poate primi un comision, fără cost suplimentar impus de Eva.';

function validHost(host){
 const value=String(host||'').trim().toLowerCase();
 if(value.length<4||value.length>253||!value.includes('.'))return false;
 if(!/^[a-z0-9.-]+$/.test(value)||value.includes('..')||value.startsWith('.')||value.endsWith('.'))return false;
 // Reject numeric IPs and private/reserved hostnames; only explicitly approved public hosts.
 if(/^\\d+(?:\\.\\d+){3}$/.test(value)||value.endsWith('.local')||value.endsWith('.internal'))return false;
 return value;
}
function exactHostAllowed(host,approvedHosts){
 return Array.isArray(approvedHosts)&&approvedHosts.some(item=>validHost(item)===host);
}
// Partner code, approvals and whitelisted redirect hosts MUST come from trusted
// server configuration, not from the public app or user-entered trip details.
export function validatedAffiliateOffer(config){
 if(!config||typeof config!=='object'||!Object.hasOwn(PARTNER_META,config.partner))return null;
 if(config.approved!==true||config.active!==true)return null;
 const raw=config.trackedUrl;
 if(typeof raw!=='string'||raw.length<12||raw.length>2048||raw!==raw.trim())return null;
 let url;
 try{url=new URL(raw)}catch{return null}
 if(url.protocol!=='https:'||url.username||url.password||url.hash||!validHost(url.hostname))return null;
 if(!exactHostAllowed(url.hostname,config.approvedHosts))return null;
 // Preserve the EXACT partner-issued tracking URL. No guessed click IDs or
 // invented destination/route/date parameters, and no unreviewed redirects.
 return Object.freeze({
  partner:config.partner,
  category:PARTNER_META[config.partner].category,
  label:PARTNER_META[config.partner].label,
  url:raw,
  disclosure:AFFILIATE_DISCLOSURE_RO,
  bookingHandledByPartner:true
 });
}
export function availableAffiliateOffers(configs,category){
 if(!Array.isArray(configs)||typeof category!=='string')return [];
 const allowed=new Set(['mixed_transport','hotels','activities']);
 if(!allowed.has(category))return [];
 return configs.map(validatedAffiliateOffer).filter(offer=>offer&&offer.category===category);
}
