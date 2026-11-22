// Advisory Biology bank: distribute every authored learning unit over the
// school stage's REAL year count, without skipping chapters or replaying them
// across adjacent grades. A national annual curriculum is not implied.
const frozen=rows=>Object.freeze(rows.map(row=>Object.freeze([...row])));
export const BIOLOGY_LOWER_YEAR_SEQUENCE=frozen([
 ['plants','ecology','cells'],
 ['cells','anatomy','plants','ecology'],
 ['genetics','evolution','cells','ecology'],
 ['anatomy','genetics','ecology','evolution']
]);
export const BIOLOGY_UPPER_YEAR_SEQUENCE=frozen([
 ['cells','biomolecules','genetics','ecology'],
 ['anatomy','homeostasis','microbes'],
 ['genetics','evolution','methods','ecology'],
 ['biomolecules','homeostasis','methods','microbes']
]);
export function biologyYearUnits({stage='',grade='',years=[]}={}){
 const groups=stage==='lower'?BIOLOGY_LOWER_YEAR_SEQUENCE:
  stage==='upper'?BIOLOGY_UPPER_YEAR_SEQUENCE:null;
 if(!groups||!Array.isArray(years)||!years.length)return [];
 const index=years.findIndex(y=>String(y?.id)===String(grade));
 if(index<0)return [];
 // Preserve the complete established four-year syllabus, including RO.
 if(years.length===4)return groups[index].map(topic=>({tier:index,topic}));
 const units=groups.flatMap((topics,tier)=>topics.map(topic=>({tier,topic})));
 if(years.length<=units.length){
  const start=Math.floor(index*units.length/years.length);
  const end=Math.floor((index+1)*units.length/years.length);
  return units.slice(start,end);
 }
 // Extremely long/unmapped stages remain advisory, never an official claim.
 const tier=Math.min(groups.length-1,Math.floor(index*groups.length/years.length));
 return groups[tier].map(topic=>({tier,topic}));
}
export function biologyYearTopicIds(args={}){
 return [...new Set(biologyYearUnits(args).map(row=>row.topic))];
}
