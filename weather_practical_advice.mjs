// Deterministic, bounded advice from the relevant forecast, never a fixed coat line.
export function weatherPracticalAdvice(rows=[],language='ro'){
 const ro=language==='ro',valid=rows.slice(0,6).filter(x=>x&&Number.isFinite(x.temperature));
 if(!valid.length)return [];
 const values=valid.map(x=>Number.isFinite(x.feels_like)?x.feels_like:x.temperature),cold=Math.min(...values),hot=Math.max(...values);
 const wind=Math.max(0,...valid.map(x=>Number.isFinite(x.wind_kmh)?x.wind_kmh:0));
 const snow=valid.some(x=>[71,73,75,77,85,86].includes(x.weather_code));
 const storm=valid.some(x=>[95,96,99].includes(x.weather_code));
 const rain=valid.some(x=>(Number.isFinite(x.precipitation_mm)&&x.precipitation_mm>=0.1)||[51,53,55,56,57,61,63,65,66,67,80,81,82].includes(x.weather_code));
 const risk=valid.some(x=>Number.isFinite(x.precipitation_probability)&&x.precipitation_probability>=60&&x.precipitation_probability<=100);
 const advice=[];
 if(storm)advice.push(ro?'Sunt prognozate furtuni în următoarele ore; caută adăpost dacă începe să tune.':'Thunderstorms are forecast in the next hours; seek shelter if thunder starts.');
 if(snow)advice.push(ro?'Sunt prognozate ninsori; alege încălțăminte cu aderență și haine impermeabile.':'Snow is forecast; choose grippy footwear and waterproof outerwear.');
 else if(rain||risk)advice.push(wind>=40?(ro?'Sunt posibile precipitații și vânt puternic; o haină impermeabilă este mai potrivită decât umbrela.':'Rain and strong wind are possible; waterproof outerwear is more suitable than an umbrella.'):(ro?(rain?'Ia și o umbrelă: sunt prognozate precipitații în următoarele ore.':'Ia o umbrelă: probabilitatea de precipitații ajunge la cel puțin 60% în următoarele ore.'):(rain?'Take an umbrella: precipitation is forecast in the next hours.':'Take an umbrella: precipitation probability reaches at least 60% in the next hours.')));
 if(cold<5)advice.push(ro?'Va fi frig în următoarele ore; alege o haină groasă și îmbrăcăminte în straturi.':'It will be cold in the next hours; choose a warm coat and layers.');
 else if(cold<15)advice.push(ro?'În următoarele ore va fi răcoare; o jachetă sau un strat în plus poate fi util.':'It will be cool in the next hours; a jacket or an extra layer may help.');
 else if(hot>=28)advice.push(ro?'Va fi cald în următoarele ore; ia apă și evită efortul prelungit în soare.':'It will be hot in the next hours; carry water and avoid prolonged exertion in the sun.');
 return advice;
}
export function weatherLocalityLabel(address={}){return address.town||address.city||address.village||address.municipality||address.suburb||address.county||'';}
