// Chemistry subject-entry evidence and non-statutory year-by-year teaching pathways.
// A country's school-year label is provided by the existing Education country
// registry. An official stage framework is NOT proof of an official annual order.
// Unknown national rules remain explicitly advisory; never silently borrow RO.
export const CHEMISTRY_EUROPE_REFERENCES=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',kind:'separate',scope:'lower-secondary-stage',name:'Chimie, VII–VIII'},
 'GB-ENG':{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study',kind:'combined',scope:'key-stage-3',name:'Science · Chemistry component'},
 FR:{source:'https://www.education.gouv.fr/l-enseignement-des-sciences-7076',kind:'combined',scope:'college-cycle-4',name:'Sciences et technologie / Physique-chimie'},
 PT:{source:'https://www.dge.mec.pt/fisico-quimica',kind:'combined',scope:'third-cycle-7-to-9',name:'Físico-Química'},
 PL:{source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/chemia',kind:'separate',scope:'grades-vii-viii-cohort-dependent',name:'Chemia'},
 HU:{source:'https://njt.jog.gov.hu/jogszabaly/2012-110-20-22.4',kind:'mixed',scope:'grades-7-to-8-local-option',name:'Kémia / integrated science module'},
 CZ:{source:'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani',kind:'separate',scope:'basic-school-grade-8-9-school-schedule',name:'Chemie (RVP ZV)'},
 FI:{source:'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education',kind:'separate',scope:'grades-7-to-9',name:'Kemia'},
 SE:{source:'https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan/subjects/GRGRKEM01',kind:'separate',scope:'grades-7-to-9',name:'Kemi'},
 NO:{source:'https://www.udir.no/lk20/nat01-05',kind:'integrated',scope:'lower-secondary-naturfag',name:'Naturfag'},
 SK:{source:'https://www.minedu.sk/40737-sk/statny-vzdelavaci-program/',kind:'mixed',scope:'2026-2027-progressive-rollout',name:'Chémia / integrated natural science'},
 DK:{source:'https://eng.uvm.dk/primary-and-lower-secondary-education/the-folkeskole/subjects-and-curriculum',kind:'combined',scope:'grades-7-to-9',name:'Fysik/kemi'}
});
// Only years positively established as *lacking standalone Chemistry* in the
// selected lower-secondary system are excluded from its separate-subject
// selector. Integrated science is retained when it actually teaches chemical
// phenomena; grade VII can be either integrated or separate in Hungary.
export const CHEMISTRY_NOT_OFFERED_LOWER_YEARS=Object.freeze({
 RO:Object.freeze(['5','6']),
 PL:Object.freeze(['V','VI']),
 PT:Object.freeze(['5','6']),
 HU:Object.freeze(['5','6']),
 CZ:Object.freeze(['6','7'])
});
const lowerSteps=Object.freeze([
 ['fundamentals','solutions','atomic','periodic','bonding'],
 ['atomic','periodic','bonding','reactions','inorganic','fundamentals'],
 ['reactions','inorganic','solutions','acids','bonding','periodic'],
 ['solutions','acids','reactions','inorganic','bonding','fundamentals']
]);
const specified=Object.freeze({
 RO:{'7':['fundamentals','solutions','atomic','periodic','bonding'],
     '8':['reactions','inorganic','acids','solutions','bonding']},
 'GB-ENG':{'Y7':['fundamentals','atomic','solutions','periodic'],
           'Y8':['bonding','reactions','inorganic','acids'],
           'Y9':['atomic','bonding','reactions','acids','solutions']},
 FR:{'6e':['fundamentals','solutions','reactions'],
     '5e':['fundamentals','solutions','atomic','reactions','periodic'],
     '4e':['atomic','bonding','reactions','solutions','acids','inorganic'],
     '3e':['reactions','acids','bonding','atomic','inorganic','solutions']},
 PT:{'7':['fundamentals','solutions','atomic','periodic'],
     '8':['reactions','atomic','solutions','acids','bonding'],
     '9':['periodic','bonding','reactions','inorganic','acids','solutions']},
 PL:{'VII':['fundamentals','atomic','periodic','bonding','reactions','solutions'],
     'VIII':['inorganic','acids','solutions','reactions','bonding','fundamentals']},
 HU:{'7':['fundamentals','solutions','atomic','periodic','bonding'],
     '8':['reactions','inorganic','acids','solutions','bonding','periodic']},
 CZ:{'8':['fundamentals','atomic','solutions','periodic','bonding','reactions'],
     '9':['reactions','inorganic','acids','solutions','bonding','fundamentals']}
});
const genericSource='https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en';
export function chemistryCountryGradePlan({country='',stage='lower',grade='',years=[]}={}){
 const code=String(country||'').toUpperCase(),id=String(grade||'');
 const list=Array.isArray(years)?years:[];
 const index=list.findIndex(y=>String(y?.id)===id);
 if(!id||index<0)return {country:code,stage,grade:id,status:'invalid-selection',
  topics:[],source:null,verifiedAnnual:false,subjectYearIndex:-1};
 const excluded=stage==='lower'?(CHEMISTRY_NOT_OFFERED_LOWER_YEARS[code]||[]):[];
 const offered=list.filter(y=>!excluded.includes(String(y.id)));
 const subjectIndex=offered.findIndex(y=>String(y.id)===id);
 const reference=CHEMISTRY_EUROPE_REFERENCES[code]||null;
 const kind=stage==='primary'?'integrated':reference?.kind||'advisory';
 if(stage==='lower'&&subjectIndex<0)return {
  country:code,stage,grade:id,status:'not-offered',topics:[],
  kind:'not-offered',source:reference?.source||genericSource,
  subjectYearIndex:-1,subjectYearCount:offered.length,verifiedAnnual:false,
  note:'Acest an nu are Chimie ca disciplină separată în sistemul verificat. Nu afișăm un curs inventat.'
 };
 if(stage==='primary')return {country:code,stage,grade:id,status:'integrated',
  topics:['fundamentals','solutions'],kind:'integrated',
  source:reference?.source||genericSource,subjectYearIndex:index,
  subjectYearCount:list.length,verifiedAnnual:false,
  note:'Noțiuni de materiale și transformări în Științe integrate; NU Chimie separată.'};
 if(stage==='upper')return {country:code,stage,grade:id,status:'advisory',topics:[],
  kind:'track-dependent',source:reference?.source||genericSource,
  subjectYearIndex:index,subjectYearCount:list.length,verifiedAnnual:false,
  note:'Profilul, filiera, opțiunile și cohorta trebuie cunoscute pentru o programă oficială.'};
 const indexAmong=subjectIndex<0?0:subjectIndex;
 const progression=offered.length<=1?0:Math.round(indexAmong*3/(offered.length-1));
 const topics=specified[code]?.[id]||lowerSteps[progression];
 return {country:code,stage,grade:id,
  status:reference?'framework-stage-advisory-year':'advisory',
  kind:code==='FR'&&id==='6e'?'integrated':kind,
  source:reference?.source||genericSource,
  programme:reference?.name||'Chemistry / integrated chemical sciences · advisory',
  sourceScope:reference?.scope||'European school structure, not a local chemistry syllabus',
  topics:[...topics],subjectYearIndex:indexAmong,
  subjectYearCount:offered.length,verifiedAnnual:false,
  note:reference?
   'Documentul susține cadrul și denumirea materiei, nu ordinea obligatorie a lecțiilor în acest an. Secvența propusă este originală și orientativă.':
   'Programă chimică anuală neverificată pentru această țară. Materia este un parcurs original orientativ, nu o transcriere de manual.'};
}
