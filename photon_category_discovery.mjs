// Worldwide Photon POI discovery, independent of the name's language.
// A bounded geographic category query is more suitable than searching a
// phrase such as "fast food takeaway" (which misses non-English businesses).
// Public photon.komoot.io is only a bounded prototype source.
const categoryFilters={
 restaurant:['osm.amenity.restaurant','osm.amenity.fast_food'],
 fast_food:['osm.amenity.fast_food','osm.amenity.restaurant'],
 corner_shop:['osm.shop.convenience','osm.shop.grocery','osm.shop.general','osm.shop.greengrocer','osm.shop.newsagent','osm.shop.kiosk','osm.shop.deli','osm.shop.butcher'],
 supermarket:['osm.shop.supermarket','osm.shop.hypermarket'],
 market_bakery:['osm.shop.supermarket','osm.shop.convenience','osm.shop.grocery','osm.shop.bakery'],
 confectionery:['osm.shop.bakery','osm.shop.pastry','osm.shop.confectionery','osm.shop.ice_cream','osm.amenity.ice_cream'],
 shop:['osm.shop'],
 hotel:['osm.tourism.hotel','osm.tourism.hostel','osm.tourism.motel','osm.tourism.guest_house','osm.tourism.apartment'],
 lounge:['osm.amenity.pub','osm.amenity.bar','osm.amenity.biergarten','osm.amenity.cafe'],
 cafe:['osm.amenity.cafe'],pharmacy:['osm.amenity.pharmacy','osm.shop.chemist'],
 poi:['osm.tourism','osm.historic','osm.natural'],
 shopping_fashion:['osm.shop.mall','osm.shop.clothes','osm.shop.shoes','osm.shop.fashion_accessories','osm.shop.bag','osm.shop.jewelry'],
 beauty_services:['osm.shop.hairdresser','osm.shop.beauty','osm.shop.nail_salon','osm.amenity.spa','osm.shop.massage'],
 home_goods:['osm.shop.houseware','osm.shop.homeware','osm.shop.kitchenware','osm.shop.interior_decoration','osm.shop.bedlinen','osm.shop.curtain','osm.shop.carpet','osm.shop.lighting'],
 appliances:['osm.shop.appliance','osm.shop.electronics','osm.shop.electrical','osm.shop.department_store','osm.shop.wholesale'],
 furniture:['osm.shop.furniture','osm.shop.bed','osm.shop.bedroom','osm.shop.bathroom_furnishing'],
 diy_garden:['osm.shop.doityourself','osm.shop.hardware','osm.shop.trade','osm.shop.building_materials','osm.shop.garden_centre','osm.shop.agrarian'],
 mall:['osm.shop.mall','osm.shop.department_store'],museum:['osm.tourism.museum'],
 park:['osm.leisure.park','osm.leisure.garden','osm.leisure.playground','osm.leisure.nature_reserve'],
 cinema:['osm.amenity.cinema'],zoo:['osm.tourism.zoo'],stadium:['osm.leisure.stadium'],
 fuel:['osm.amenity.fuel'],charging:['osm.amenity.charging_station'],
 parking:['osm.amenity.parking'],car_wash:['osm.amenity.car_wash'],
 car_repair:['osm.shop.car_repair'],car_dealers:['osm.shop.car','osm.shop.car_dealer','osm.shop.car_sales','osm.shop.motor_vehicle'],hospital:['osm.amenity.hospital','osm.amenity.clinic','osm.amenity.doctors'],hospital_only:['osm.amenity.hospital','osm.healthcare.hospital'],currency_exchange:['osm.amenity.bureau_de_change'],
 school:['osm.amenity.school','osm.amenity.university','osm.amenity.college'],
 library:['osm.amenity.library'],atm:['osm.amenity.atm'],bank:['osm.amenity.bank'],
 post_office:['osm.amenity.post_office'],toilets:['osm.amenity.toilets'],
 transport:['osm.public_transport.station','osm.railway.station','osm.amenity.bus_station'],
 town_hall:['osm.amenity.townhall'],police:['osm.amenity.police'],fire_station:['osm.amenity.fire_station']
};
const fallbackTerms={
 restaurant:'restaurant',fast_food:'fast food',corner_shop:'convenience',
 supermarket:'supermarket',market_bakery:'grocery',confectionery:'bakery',
 shop:'shop',hotel:'hotel',lounge:'pub',cafe:'cafe',poi:'attraction'
};
export const photonCategoryFilters=category=>categoryFilters[category]||[];
export function photonNearbyUrl({latitude,longitude,radius=5000,category='',query='',
 useCategories=true,base='https://photon.komoot.io'}={}){
 const url=new URL('/api/',base);
 const filters=photonCategoryFilters(category);
 if(useCategories&&filters.length)url.searchParams.set('include',filters.join(','));
 else url.searchParams.set('q',String(query||fallbackTerms[category]||category||'places').slice(0,100));
 url.searchParams.set('lat',String(latitude));
 url.searchParams.set('lon',String(longitude));
 url.searchParams.set('limit','100');
 url.searchParams.set('location_bias_scale','0.1');
 if(Number.isFinite(latitude)&&Number.isFinite(longitude)&&Number.isFinite(radius)&&
 radius>0&&radius<=10000){
  const dy=radius/110574,dx=radius/(111320*Math.max(0.02,Math.abs(Math.cos(latitude*Math.PI/180))));
  const minLat=latitude-dy,maxLat=latitude+dy,minLon=longitude-dx,maxLon=longitude+dx;
  if(minLat>=-90&&maxLat<=90&&minLon>=-180&&maxLon<=180)
   url.searchParams.set('bbox',[minLon,minLat,maxLon,maxLat].map(v=>v.toFixed(6)).join(','));
 }
 return url;
}
