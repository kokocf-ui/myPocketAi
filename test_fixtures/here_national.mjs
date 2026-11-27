// Deliberately synthetic; shape follows HERE v8, not evidence of DE coverage.
export {from,to,at,now,options} from './germany_national.mjs';
import {from,to} from './germany_national.mjs';
const place=(p,id)=>({type:'station',id,name:'Synthetic '+id,location:{lat:p.latitude,lng:p.longitude}});
export function route(){return {id:'fixture',sections:[{id:'s1',type:'transit',
 departure:{time:'2026-11-27T08:10:00Z',place:place(from,'A')},arrival:{time:'2026-11-27T08:30:00Z',place:place(to,'B')},
 transport:{mode:'bus',name:'TEST 42'},agency:{id:'fixture',name:'Synthetic Operator',website:'https://operator.example/'},
 intermediateStops:[{departure:{place:place({latitude:50.111,longitude:8.67},'MID')}}],
 attributions:[{id:'attr',text:'Synthetic attribution '+'.'.repeat(900)+' END',href:'https://operator.example/license'}]}]};}
export const payload=()=>({routes:[route()]});
export function environment(reserve=async()=>Response.json({allowed:true})){
 return {HERE_TRANSIT_ENABLED:'true',HERE_TRANSIT_TERMS_REVIEWED:'true',HERE_TRANSIT_FREE_TIER_REVIEWED:'true',HERE_TRANSIT_EXCLUSIVE_ACCOUNT:'true',HERE_TRANSIT_UTC_MONTH_REVIEWED:'true',
 HERE_TRANSIT_API_KEY:'synthetic-not-a-real-key',HERE_TRANSIT_MONTHLY_LIMIT:'3',
 HERE_TRANSIT_BUDGET:{idFromName:name=>name,get:id=>{if(id!=='here-public-transit-account-budget-v1')throw Error('wrong singleton');return {fetch:reserve};}}};
}
