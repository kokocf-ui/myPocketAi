// Europe-only development scope. Existing world-country records remain intact
// but are not part of the current Education library-completion milestone.
// Territory list: 46 Council of Europe members, 4 UK constituent systems,
// and geographical/other selectable European jurisdictions (BY/RU/VA/XK).
// Not an assertion of the statehood or international recognition of any entry.
export const EUROPE_EDUCATION_COUNTRIES=Object.freeze(["AL","AD","AM","AT","AZ","BE","BA","BG","HR","CY","CZ","DK","EE","FI","FR","GE","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","MD","MC","ME","NL","MK","NO","PL","PT","RO","SM","RS","SK","SI","ES","SE","CH","TR","UA","GB","GB-ENG","GB-SCT","GB-WLS","GB-NIR","BY","RU","VA","XK"]);
export const EUROPE_EDUCATION_SOURCES=Object.freeze(
 Object.fromEntries([["AL","Albania","Albania","https://arsimi.gov.al/","national-education-portal"],["AD","Andorra","Andorra","","education-system-comparison"],["AM","Armenia","Armenia","https://escs.am/","national-education-portal"],["AT","Austria","Austria","https://www.bmb.gv.at/","national-education-portal"],["AZ","Azerbaidjan","Azerbaijan","https://edu.gov.az/","national-education-portal"],["BE","Belgia","Belgium","https://www.belgium.be/en/education","multi-jurisdiction-overview"],["BA","Bosnia și Herțegovina","Bosnia and Herzegovina","","multi-jurisdiction-overview"],["BG","Bulgaria","Bulgaria","https://www.mon.bg/","national-education-portal"],["HR","Croația","Croatia","https://mzo.gov.hr/","national-education-portal"],["CY","Cipru","Cyprus","https://www.moec.gov.cy/","national-education-portal"],["CZ","Cehia","Czechia","https://msmt.gov.cz/","national-education-portal"],["DK","Danemarca","Denmark","https://www.uvm.dk/","national-education-portal"],["EE","Estonia","Estonia","https://hm.ee/","national-education-portal"],["FI","Finlanda","Finland","https://www.oph.fi/en","national-education-portal"],["FR","Franța","France","https://eduscol.education.gouv.fr/","national-education-portal"],["GE","Georgia","Georgia","https://mes.gov.ge/","national-education-portal"],["DE","Germania","Germany","https://www.kmk.org/","federal-education-overview"],["GR","Grecia","Greece","https://www.minedu.gov.gr/","national-education-portal"],["HU","Ungaria","Hungary","","education-system-comparison"],["IS","Islanda","Iceland","https://www.government.is/topics/education/","national-education-portal"],["IE","Irlanda","Ireland","https://www.curriculumonline.ie/","national-curriculum-index"],["IT","Italia","Italy","https://www.mim.gov.it/","national-education-portal"],["LV","Letonia","Latvia","https://www.izm.gov.lv/","national-education-portal"],["LI","Liechtenstein","Liechtenstein","https://www.llv.li/","national-education-portal"],["LT","Lituania","Lithuania","https://smsm.lrv.lt/","national-education-portal"],["LU","Luxemburg","Luxembourg","https://men.public.lu/","national-education-portal"],["MT","Malta","Malta","https://education.gov.mt/","national-education-portal"],["MD","Republica Moldova","Republic of Moldova","https://mec.gov.md/","national-education-portal"],["MC","Monaco","Monaco","https://www.gouv.mc/","national-education-portal"],["ME","Muntenegru","Montenegro","https://www.gov.me/","national-education-portal"],["NL","Țările de Jos","Netherlands","https://www.slo.nl/","national-curriculum-index"],["MK","Macedonia de Nord","North Macedonia","https://mon.gov.mk/","national-education-portal"],["NO","Norvegia","Norway","https://www.udir.no/","national-curriculum-index"],["PL","Polonia","Poland","https://www.gov.pl/web/edukacja","national-education-portal"],["PT","Portugalia","Portugal","https://www.dge.mec.pt/","national-curriculum-index"],["RO","România","Romania","https://www.edu.ro/","national-education-portal"],["SM","San Marino","San Marino","","education-system-comparison"],["RS","Serbia","Serbia","https://prosveta.gov.rs/","national-education-portal"],["SK","Slovacia","Slovakia","https://www.statpedu.sk/","national-curriculum-index"],["SI","Slovenia","Slovenia","https://www.gov.si/en/state-authorities/ministries/ministry-of-education/","national-education-portal"],["ES","Spania","Spain","https://educagob.educacionfpydeportes.gob.es/","multi-jurisdiction-overview"],["SE","Suedia","Sweden","https://www.skolverket.se/","national-curriculum-index"],["CH","Elveția","Switzerland","https://www.edk.ch/","multi-jurisdiction-overview"],["TR","Turcia","Türkiye","https://www.meb.gov.tr/","national-education-portal"],["UA","Ucraina","Ukraine","https://mon.gov.ua/","national-education-portal"],["GB","Regatul Unit","United Kingdom","https://www.gov.uk/browse/education","multi-jurisdiction-overview"],["GB-ENG","Anglia","England","https://www.gov.uk/national-curriculum","national-curriculum-index"],["GB-SCT","Scoția","Scotland","https://education.gov.scot/","national-curriculum-index"],["GB-WLS","Țara Galilor","Wales","https://hwb.gov.wales/curriculum-for-wales","national-curriculum-index"],["GB-NIR","Irlanda de Nord","Northern Ireland","https://ccea.org.uk/","national-curriculum-index"],["BY","Belarus","Belarus","","education-system-comparison"],["RU","Rusia","Russia","","education-system-comparison"],["VA","Vatican","Vatican City","","not-national-school-system"],["XK","Kosovo","Kosovo","","education-system-comparison"]].map(([code,ro,en,url,kind])=>
  [code,Object.freeze({code,ro,en,url:url||null,kind,
   sourceStatus:kind==='not-national-school-system'?'not-applicable':
    url?'general-portal':'general-reference'})]))
);
// Conservative subset of countries with Eurydice national units; a global
// Europe publication must not be presented as a source about every territory.
export const EUROPE_EURYDICE_COUNTRIES=Object.freeze([
 'AL','AT','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
 'HU','IS','IE','IT','LV','LI','LT','LU','MT','ME','NL','MK','NO','PL',
 'PT','RO','RS','SK','SI','ES','SE','CH'
]);
export const EUROPE_EURYDICE_REFERENCE='https://eurydice.eacea.ec.europa.eu/national-education-systems';
export const EUROPE_EURYDICE_STRUCTURE_2026='https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en';
const STAGE_RANGES={"AL":[[1,5],[6,9],[10,12]],"AM":[[1,4],[5,9],[10,12]],"AZ":[[1,4],[5,9],[10,11]],"BA":[[1,5],[6,9],[10,13]],"BG":[[1,4],[5,7],[8,12]],"HR":[[1,4],[5,8],[9,12]],"CY":[[1,6],[7,9],[10,12]],"CZ":[[1,5],[6,9],[10,13]],"EE":[[1,6],[7,9],[10,12]],"FI":[[1,6],[7,9],[10,12]],"GE":[[1,6],[7,9],[10,12]],"HU":[[1,4],[5,8],[9,12]],"IS":[[1,6],[7,10],[11,14]],"LV":[[1,6],[7,9],[10,12]],"LT":[[1,4],[5,10],[11,12]],"MD":[[1,4],[5,9],[10,12]],"ME":[[1,5],[6,9],[10,13]],"MK":[[1,5],[6,9],[10,13]],"NO":[[1,7],[8,10],[11,13]],"RS":[[1,4],[5,8],[9,12]],"SK":[[1,4],[5,9],[10,13]],"SI":[[1,5],[6,9],[10,13]],"SE":[[1,6],[7,9],[10,12]],"UA":[[1,4],[5,9],[10,12]],"BY":[[1,4],[5,9],[10,11]],"RU":[[1,4],[5,9],[10,11]],"XK":[[1,5],[6,9],[10,12]],"PL":[[1,4],[5,8],[9,12]],"AT":[[1,4],[5,8],[9,12]],"GR":[[1,6],[7,9],[10,12]],"PT":[[1,4],[5,9],[10,12]],"TR":[[1,4],[5,8],[9,12]],"FR":[[1,5],[6,9],[10,12]],"IT":[[1,5],[6,8],[9,13]],"DE":[[1,4],[5,10],[11,13]],"ES":[[1,6],[7,10],[11,12]],"DK":[[1,6],[7,9],[10,12]],"NL":[[1,8],[9,11],[12,14]]};
export const EUROPE_ADVISORY_SCHOOL_SCHEMES=Object.fromEntries(
 Object.entries(STAGE_RANGES).map(([code,ranges])=>{
 const make=([a,b],stage)=>Array.from({length:b-a+1},(_,i)=>{
  const n=a+i;
  return {id:String(n),ro:'Clasa '+n,en:'Grade '+n,stage,verifiedCurriculum:false,
   note:'Încadrare orientativă; învățământul regional, filiera și programa de anul curent necesită verificare.'};
 });
 return [code,{beginner:make(ranges[0],'beginner'),
  lower:make(ranges[1],'lower'),medium:make(ranges[2],'medium'),
  advanced:[{id:'higher-education',ro:'Universitate · specializare',en:'Higher education · specialisation'}],
  verifiedCurriculum:false,
  note:'Grupare orientativă a claselor pentru navigare, nu curriculum național certificat; verifică filiera și anul.',
  source:EUROPE_EDUCATION_SOURCES[code]?.url||EUROPE_EURYDICE_REFERENCE}];
 })
);
export function isEuropeanEducationCountry(code){
 return Object.hasOwn(EUROPE_EDUCATION_SOURCES,String(code||'').toUpperCase());
}
export function europeSourceForCountry(code){
 return EUROPE_EDUCATION_SOURCES[String(code||'').toUpperCase()]||null;
}
