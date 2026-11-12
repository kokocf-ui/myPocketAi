// Shared classification for all nearby venue providers. Category names are
// not inferred merely from the quick-search button that was pressed.
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// Keep distinct dining and takeaway categories across native scripts.
// Names help only when the source identifies a food venue as a restaurant.
const fastTerms=new Set([
 'kebab','kebap','kebabownia','doner','donerci','donerladen','durum',
 'shawarma','shawerma','shaorma','shaormerie','shaormerii',
 'gyro','gyros','souvlaki','falafel','pita','pizza','pizzeria','pizzerie',
 'pizzaria','burger','hamburger','burgers','chicken',
 'sandwich','sandwiches','sandwicherie','paninoteca','panini',
 'bocadillo','bocadillos','bocadilleria','tacos','taco','burrito',
 'wrap','wraps','takeaway','takeout','fastfood','imbiss',
 'schnellimbiss','rosticceria','rotiserie','rotisserie',
 'covrigarie','covrigaria','simigerie','snackbar',
 'пицца','пиццерия','шаурма','шаверма','кебаб','бургер','фастфуд',
 'πιτσα','πιτσαρια','γυρος','γυραδικο','σουβλακι','κεμπαπ',
 'بيتزا','شاورما','كباب'
]);
const fastPhrases=['fast food','fried chicken','fish and chips','snack bar','pollos asados'];
const words=x=>norm(x).replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);
const isFastFoodName=name=>{
 const tokens=words(name),padded=' '+tokens.join(' ')+' ';
 return tokens.some(token=>fastTerms.has(token))||
  fastPhrases.some(p=>padded.includes(' '+p+' '));
};
const isFastCuisine=cuisine=>{
 const tokens=words(cuisine);
 return tokens.some(x=>['kebab','shawarma','doner','pizza','burger','chicken',
 'sandwich','falafel','taco','burrito','souvlaki','gyro','gyros','fastfood'].includes(x))||
 tokens.includes('fast_food');
};
export function foodVenueKind({name='',amenity='',categories=[],cuisine='',businessType='',takeaway=''}={}){
 const cat=(Array.isArray(categories)?categories:[]).join(' ').toLowerCase();
 const kind=norm(amenity);
 const register=norm(businessType);
 if(kind==='fast_food'||/catering\.fast_food|\bfast_food\b/.test(cat)||/takeaway|sandwich shop/.test(register))return 'fast_food';
 if(norm(takeaway)==='only')return 'fast_food';
 if(kind==='cafe'||/catering\.cafe/.test(cat))return 'cafe';
 if(kind==='pub'||kind==='bar'||/catering\.(pub|bar|biergarten)/.test(cat))return 'other';
 if(kind==='restaurant'||/catering\.restaurant/.test(cat)){
  return isFastFoodName(name)||isFastCuisine(cuisine)?'fast_food':'restaurant';
 }
 return 'other';
}
export const foodCategoryAccepts=(category,details)=>foodVenueKind(details)===category;

const fold=x=>norm(x).replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const nameTokens=x=>fold(x).split(' ').filter(x=>x&&!['and','the','&','at','of','de','la','si','restaurant','takeaway','ltd','limited'].includes(x));
const similarNames=(a,b)=>{
 const left=fold(a),right=fold(b);
 if(!left||!right)return false;
 if(left===right)return true;
 if(left.length>=6&&right.length>=6&&(left.startsWith(right+' ')||right.startsWith(left+' ')))return true;
 const l=nameTokens(a),r=nameTokens(b),short=l.length<=r.length?l:r,long=l.length<=r.length?r:l;
 return short.length>=2&&short.every(t=>long.includes(t))&&long.length-short.length<=2;
};
const ukPostcode=address=>String(address||'').match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i)?.[0].replace(/\s+/g,'').toUpperCase()||'';
const streetFromAddress=text=>{
 const v=fold(text);
 const m=v.match(/\b(\d{1,5}[a-z]?)\s+([\p{L}0-9\s.'-]{3,65}?\b(?:road|street|lane|avenue|drive|way|close|crescent|boulevard|rd|strada|str|calle|via|rue|rua|ulica))\b/iu);
 return m?{house:m[1],street:fold(m[2])}:null;
};
const addrInfo=p=>{
 const address=String(p.address||''),joined=[p.houseNumber,p.street].filter(Boolean).join(' ');
 const extracted=streetFromAddress(joined)||streetFromAddress(address);
 const postcode=ukPostcode(p.postcode||address);
 // Some providers put a comma between the house number and street.
 const segments=address.split(',').map(x=>fold(x)).filter(Boolean);
 const standaloneNumber=segments[0]?.match(/^(\d{1,5}[a-z]?)$/i)?.[1]||'';
 const road=segments.find(x=>/\b(road|street|rd|lane|avenue|drive|strada|calle|via|rue|ulica)\b/i.test(x))||'';
 const house=extracted?.house||fold(p.houseNumber)||standaloneNumber;
 const street=extracted?.street||fold(p.street)||road;
 return {postcode,house,street,city:fold(p.city),full:fold(address)};
};
const addressSame=(a,b)=>{
 const x=addrInfo(a),y=addrInfo(b);
 if(x.postcode&&y.postcode&&x.postcode!==y.postcode)return false;
 if(x.house&&y.house&&x.house!==y.house)return false;
 if(x.house&&y.house&&x.street&&y.street&&x.house===y.house&&x.street===y.street)
  return x.postcode&&y.postcode?x.postcode===y.postcode:(!x.city||!y.city||x.city===y.city);
 return Boolean(x.full&&x.full===y.full&&x.full.length>=12);
};
const compatibleAliases=(a,b,distance)=>{
 const x=addrInfo(a),y=addrInfo(b);
 if(x.postcode&&y.postcode&&x.postcode!==y.postcode)return false;
 if(x.house&&y.house&&x.house!==y.house)return false;
 if(x.street&&y.street&&x.street!==y.street&&x.house&&y.house)return false;
 // Do not combine distinct chain branches just because their names match.
 if((x.house&&y.house&&x.house===y.house&&x.street&&y.street&&x.street===y.street)
   ||(x.postcode&&y.postcode&&x.postcode===y.postcode&&(!x.house||!y.house||x.house===y.house)))
    return distance<=350;
 return distance<=70;
};
const haversine=(a,b)=>{
 const deg=Math.PI/180,dLat=(a.lat-b.lat)*deg,dLon=(a.lon-b.lon)*deg;
 const h=Math.sin(dLat/2)**2+Math.cos(a.lat*deg)*Math.cos(b.lat*deg)*Math.sin(dLon/2)**2;
 return 12742000*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
};
export function reconcileNearbyPlaces(places){
 const unique=[];
 for(const place of [...places].sort((a,b)=>a.distanceMeters-b.distanceMeters)){
  const duplicate=unique.find(other=>{
   const d=haversine(other,place),alias=similarNames(other.name,place.name);
   const sameAddress=addressSame(other,place);
   const samePhone=Boolean(other.phone&&place.phone&&fold(other.phone)===fold(place.phone));
   // Do not merge separate businesses sharing a supermarket/food-court address.
   // Same postal address can be geocoded at different doors or centroids.
   // Incomplete source addresses must not recreate a second result.
   return (sameAddress&&d<=400&&(alias||samePhone))
     ||(samePhone&&d<=350&&compatibleAliases(other,place,d))
     ||(alias&&compatibleAliases(other,place,d));
  });
  if(!duplicate){unique.push({...place});continue}
  // Prefer the more complete trading name, but preserve the nearest mapped pin.
  if(similarNames(duplicate.name,place.name)&&fold(place.name).length>fold(duplicate.name).length)
   duplicate.name=place.name;
  for(const field of ['stars','cuisine','website','imageUrl','wikidata','brandWikidata','phone','street','houseNumber','city','postcode'])
   if(!duplicate[field]&&place[field])duplicate[field]=place[field];
  if(String(place.address||'').length>String(duplicate.address||'').length)duplicate.address=place.address;
 }
 return unique.sort((a,b)=>a.distanceMeters-b.distanceMeters);
}
