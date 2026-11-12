// Strictly separate retail categories when querying different POI providers.
// Do not infer shop type from which category a user selected.
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9_]+/g,' ').trim();
const small=new Set(['convenience','grocery','general','greengrocer','newsagent','kiosk','deli','butcher','seafood','dairy','farm','food','alcohol']);
const large=new Set(['supermarket','hypermarket','wholesale','cash_and_carry']);
const otherRetail=new Set(['department_store','clothes','electronics','hardware','books','bakery','chemist','florist','shoes','furniture','mall']);
const counter=/\b(hot deli|cold deli|butchery|customer restaurant|cafe|restaurant|food court|canteen|takeaway)\b/i;
const format=/\b(tesco express|sainsburys local|sainsbury s local|co op food|spar express|mini market|corner shop|convenience store|local shop|mini market)\b/i;
export function retailKind({shop='',categories=[],osmKey='',name='',registry=''}={}){
 const label=norm(name),key=norm(osmKey),value=norm(shop).replace(/\s+/g,'_');
 if(!label||counter.test(label))return 'not_retail';
 if(registry==='fsa_other_retailer')return 'corner_shop';
 if(key&&key!=='shop'&&key!=='commercial')return 'not_retail';
 const cats=(Array.isArray(categories)?categories:[]).join(' ').toLowerCase();
 if(small.has(value))return 'corner_shop';
 if(large.has(value))return format.test(label)?'corner_shop':'supermarket';
 if(otherRetail.has(value))return 'other_shop';
 if(value&&value!=='shop')return 'other_shop';
 if(/commercial\.(?:supermarket|hypermarket)(?:\b|\.)/.test(cats))return format.test(label)?'corner_shop':'supermarket';
 if(/commercial\.(?:convenience|food_and_drink\.(?:grocery|greengrocer|butcher|deli))/.test(cats))return 'corner_shop';
 if(/commercial\./.test(cats)&&value==='shop')return 'other_shop';
 return 'not_retail';
}
export function retailCategoryAccepts(request,details){
 const actual=retailKind(details);
 if(request==='corner_shop')return actual==='corner_shop';
 if(request==='supermarket')return actual==='supermarket';
 if(request==='shop')return actual!=='not_retail';
 if(request==='market_bakery')return actual==='corner_shop'||actual==='supermarket'||actual==='other_shop'&&/(?:bakery|pastry|confectionery)/i.test(String(details.shop||''));
 return true;
}
export function sortedDistinctRetail(a,b){
 const order={corner_shop:1,supermarket:1,other_shop:2,not_retail:3};
 return (order[a]??9)-(order[b]??9);
}
