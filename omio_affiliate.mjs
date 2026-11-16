// Omio referral URL adapter; no private API access, no scraping, no ticket purchases.
// User-provided Impact tracking link; use verbatim (no fabricated partner ID).
export const OMIO_TRACKING_LINK='https://omio.sjv.io/WOoqQn';
// A generic referral link cannot pre-fill departure, destination or dates.
// Explicitly approved Android channel required before rendering this action.
export function omioGeneralReferralUrl({mobileAppApproved=false}={}){
 return mobileAppApproved===true?OMIO_TRACKING_LINK:null;
}
// Source: https://www.omio.com/affiliate/search-widget (redirect link instructions).
// Do not enable Android referral traffic until the Omio affiliate team approves the app.
const OMIO_LINK_BASE='https://www.omio.com/links/626fa8a9-f982-43d0-ace9-9a13f6b14612';
const IMPACT_ADVERTISER='4057579';
const IMPACT_CAMPAIGN='7385';
const TRANSPORT_MODES=new Set(['TRAIN','BUS','FLIGHT','FERRY']);

function validDate(value){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return false;
 const [y,m,d]=value.split('-').map(Number);
 const day=new Date(Date.UTC(y,m-1,d));
 return day.getUTCFullYear()===y&&day.getUTCMonth()===m-1&&day.getUTCDate()===d;
}
function place(value){
 const raw=String(value||'');
 if(/[\r\n<>]/.test(raw))return null;
 const result=raw.replace(/\s+/g,' ').trim();
 // City or station only; never forward precise latitude/longitude.
 if(/^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/.test(result))return null;
 return result.length>0&&result.length<=120?result:null;
}
export function omioAffiliateReady({impactPartnerId,mobileAppApproved}={}){
 // Advertiser/program numbers are NOT the partner ID. Require an explicit app approval.
 return mobileAppApproved===true&&/^\d{1,18}$/.test(String(impactPartnerId||''));
}
export function buildOmioAffiliateUrl({
 impactPartnerId,mobileAppApproved,departure,arrival,departureDate,
 returnDate,travelMode,locale,currency
}={}){
 if(!omioAffiliateReady({impactPartnerId,mobileAppApproved}))return null;
 const from=place(departure),to=place(arrival);
 if(!from||!to||!validDate(departureDate))return null;
 if(returnDate&&(!validDate(returnDate)||returnDate<departureDate))return null;
 const target=new URL(OMIO_LINK_BASE);
 target.searchParams.set('departurePosTerm',from);
 target.searchParams.set('arrivalPosTerm',to);
 target.searchParams.set('departureDate',departureDate);
 if(returnDate)target.searchParams.set('returnDate',returnDate);
 if(travelMode){
  const mode=String(travelMode).toUpperCase();
  if(!TRANSPORT_MODES.has(mode))return null;
  target.searchParams.set('travelMode',mode);
 }
 if(locale){
  if(!/^[a-z]{2}(?:-[A-Za-z]{2})?$/.test(locale))return null;
  target.searchParams.set('locale',locale);
 }
 if(currency){
  if(!/^[A-Z]{3}$/.test(currency))return null;
  target.searchParams.set('currency',currency);
 }
 const outbound=new URL('https://omio.sjv.io/c/'+impactPartnerId+'/'+IMPACT_ADVERTISER+'/'+IMPACT_CAMPAIGN);
 outbound.searchParams.set('u',target.toString());
 return outbound.toString();
}
