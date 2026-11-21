// Original advisory study catalogue for upper-secondary Physics. A physical
// law/formula is an individual learning concept; a review pre-requisite is
// labelled as review rather than a new advanced national lesson.
export function physicsUpperYearLessons({country='',grade='',topic='',years=[],lessons=[],reviewBank=null}={}){
 const yr=String(grade);
 if(!years.some(x=>String(x.id)===yr))return [];
 const core=(Array.isArray(lessons)?lessons:[]).filter(item=>
  item.subject==='physics'&&item.topic===topic&&
  ['beginner','intermediate'].includes(item.level)&&item.title&&item.statement);
 const gradeIndex=years.findIndex(y=>String(y.id)===yr);
 const order=core.map((item,n)=>({
  ...item,grade:yr,source:'original-upper-physics-advisory',nationallyVerified:false,
  id:'upper-physics-'+String(country)+'-'+yr+'-'+String(item.id),
  chapterIndex:n+1,
  exercise:'Interpretează noțiunea „'+item.title+'”, formulează ipotezele de aplicare și verifică dimensional relația: '+String(item.formula||'fără formulă numerică')+'.',
  workedExample:'Exemplu de interpretare: '+item.statement+' '+
   (item.formula&&item.formula!=='—'?
    'În relația '+item.formula+', explică semnificația mărimilor și a unităților înainte de a calcula.':
    'Compară două situații fizice și arată când este utilă definiția.'),
  answer:'O rezolvare adecvată trebuie să explice conceptul, să declare ipotezele, unitățile și limitele formulei, fără rezultate numerice inventate.'
 }));
 // Revisions are educationally legitimate, but must not be counted as new
 // upper-year national curriculum or hide the authored upper lessons.
 const revision=(reviewBank?.['8']||[]).filter(x=>x.topic===topic).slice(0,6)
  .map((entry,index)=>({...entry,
   id:'upper-review-'+String(country)+'-'+yr+'-'+entry.id,
   title:'Recapitulare: '+entry.title,source:'original-upper-physics-review',
   grade:yr,chapterIndex:order.length+index+1,reviewOnly:true
  }));
 return order.concat(revision);
}
