// "Other points of interest" excludes places with an existing dedicated
// category and removes street/geocoder records mislabelled as POIs.
const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const hotelBrand=/\b(?:hotel|hostel|motel|travelodge|premier inn|ibis|holiday inn|hilton|marriott|novotel|sofitel|ramada|mercure|best western|aparthotel)\b/i;
const streetName=/\b(?:road|rd\.?|street|st\.?|drive|avenue|ave\.?|lane|close|crescent|way|boulevard|highway|motorway|strada|calle|via|rue|ulica)\.?$/i;
const dedicatedTags=/\b(?:hotel|hostel|motel|guest_house|guesthouse|apartment|accommodation|lodging|commercial|shopping_mall|supermarket|convenience|grocery|shop|store|catering|restaurant|fast_food|takeaway|cafe|coffee_shop|pub|bar|biergarten|pharmacy|chemist|healthcare|hospital|clinic|bank|atm|parking|fuel|charging_station|museum|zoo|park|garden|cinema|stadium|public_transport|railway|train_station|bus_station|school|library|post_office)\b/;
const highwayTypes=/^(?:highway|street|road|residential|living_street|service|motorway|primary|secondary|tertiary|footway|path|track|cycleway|pedestrian|construction|unclassified)$/;
export function otherPoiAccepts({name='',categories=[],amenity='',tourism='',shop='',highway='',leisure='',osmKey='',osmValue='',poiTypes=[]}={}){
 const title=String(name||'').trim(),lower=fold(title);
 if(title.length<3||!/\p{L}/u.test(title))return false;
 if(streetName.test(lower)||hotelBrand.test(lower))return false;
 const k=fold(osmKey),v=fold(osmValue);
 if(k==='highway'||highwayTypes.test(v)||highway)return false;
 const providers=[
  ...(Array.isArray(categories)?categories:[]),
  ...(Array.isArray(poiTypes)?poiTypes:[]),
  amenity,tourism,shop,leisure,k==='tourism'?v:'',
  k==='amenity'?v:'',k==='shop'?v:'',k==='leisure'?v:''
 ].map(fold).join(' ').replace(/[._-]/g,' ');
 // Do not classify all POIs as attractions; named hotels/shops already have
 // their own lists. Unknown attraction classes remain eligible.
 if(dedicatedTags.test(providers))return false;
 return true;
}
