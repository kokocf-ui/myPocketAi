// Course-specific verified reference links. Never present an unrelated country homepage as a source for every lesson.
export const PRACTICAL_REFERENCES={
 career:{
  general:{title:'Europass — CV și profil profesional',url:'https://europass.europa.eu/ro/create-europass-cv?lang=en',scope:'EU guidance: CV and applications'},
  RO:{title:'ANOFM — informare și consiliere profesională',url:'https://www.anofm.ro/informarea-si-consilierea-profesionala/',scope:'Romania employment support'},
  'GB-ENG':{title:'National Careers Service — redactarea CV-ului',url:'https://nationalcareers.service.gov.uk/careers-advice/cv-sections',scope:'England CV guidance'},
  'GB-WLS':{title:'Careers Wales — redactarea CV-ului',url:'https://careerswales.gov.wales/my-future/looking-for-work/writing-a-cv',scope:'Wales CV guidance'}
 },
 finance:{
  general:{title:'Comisia Europeană — educație financiară',url:'https://finance.ec.europa.eu/consumer-finance-and-payments/financial-literacy_en',scope:'European financial education'},
  RO:{title:'ASF — educație financiară',url:'https://www.asfromania.ro/',scope:'Romania, finance education'},
  'GB-ENG':{title:'MoneyHelper — instrument de buget personal',url:'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',scope:'UK, budgeting'},
  'GB-SCT':{title:'MoneyHelper — instrument de buget personal',url:'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',scope:'UK, budgeting'},
  'GB-WLS':{title:'MoneyHelper — instrument de buget personal',url:'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',scope:'UK, budgeting'},
  'GB-NIR':{title:'MoneyHelper — instrument de buget personal',url:'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',scope:'UK, budgeting'}
 },
 trades:{
  general:{title:'Agenția Europeană pentru Securitate și Sănătate în Muncă',url:'https://osha.europa.eu/en',scope:'EU workplace safety'},
  RO:{title:'Inspecția Muncii — securitatea și sănătatea în muncă',url:'https://www.inspectiamuncii.ro/securitatea-si-sanatatea-in-munca1',scope:'Romania workplace safety'},
  'GB-ENG':{title:'HSE — principii de securitate la locul de muncă',url:'https://www.hse.gov.uk/simple-health-safety/index.htm',scope:'Great Britain workplace safety'},
  'GB-SCT':{title:'HSE — principii de securitate la locul de muncă',url:'https://www.hse.gov.uk/simple-health-safety/index.htm',scope:'Great Britain workplace safety'},
  'GB-WLS':{title:'HSE — principii de securitate la locul de muncă',url:'https://www.hse.gov.uk/simple-health-safety/index.htm',scope:'Great Britain workplace safety'}
 },
 business:{
  general:{title:'Your Europe — pornirea unei afaceri',url:'https://europa.eu/youreurope/business/lifecycle/starting/index_en.htm',scope:'EU business registration overview'},
  'GB-ENG':{title:'GOV.UK — pornirea unei afaceri',url:'https://www.gov.uk/browse/business/start-your-business',scope:'UK business setup'},
  'GB-SCT':{title:'GOV.UK — pornirea unei afaceri',url:'https://www.gov.uk/browse/business/start-your-business',scope:'UK business setup'},
  'GB-WLS':{title:'GOV.UK — pornirea unei afaceri',url:'https://www.gov.uk/browse/business/start-your-business',scope:'UK business setup'},
  'GB-NIR':{title:'GOV.UK — pornirea unei afaceri',url:'https://www.gov.uk/browse/business/start-your-business',scope:'UK business setup'}
 },
 digital:{
  general:{title:'Comisia Europeană — DigComp 3.0',url:'https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en',scope:'EU digital competencies framework'}
 },
 daily:{
  shopping:{title:'Your Europe — drepturile consumatorilor',url:'https://europa.eu/youreurope/citizens/consumers/unfair-treatment/index_en.htm',scope:'EU consumer rights'},
  'GB-ENG-food':{title:'Food Standards Agency — prevenirea contaminării alimentare',url:'https://www.gov.uk/government/publications/avoiding-cross-contamination-in-your-food-business',scope:'England food safety guidance (business setting)'},
  'GB-WLS-food':{title:'Food Standards Agency — prevenirea contaminării alimentare',url:'https://www.gov.uk/government/publications/avoiding-cross-contamination-in-your-food-business',scope:'Wales food safety guidance (business setting)'},
  'GB-NIR-food':{title:'Food Standards Agency — prevenirea contaminării alimentare',url:'https://www.gov.uk/government/publications/avoiding-cross-contamination-in-your-food-business',scope:'Northern Ireland food safety guidance (business setting)'}
 }
};
export function practicalReferences(country,course,chapter){
 const refs=PRACTICAL_REFERENCES[course];if(!refs)return[];
 if(course==='daily'){
   if(chapter==='daily-2')return [refs.shopping];
   if(chapter==='daily-4'&&refs[country+'-food'])return [refs[country+'-food']];
   return [];
 }
 if(course==='career'){
   if(chapter==='career-2')return [refs.general,...(refs[country]?[refs[country]]:[])];
   if(chapter==='career-5')return [];
   if(refs[country])return [refs[country]];
   return [];
 }
 if(course==='trades'){
   if(chapter==='trades-1'||chapter==='trades-4')return [{title:'BIPM — Sistemul internațional de unități (SI)',url:'https://www.bipm.org/en/measurement-units',scope:'Global measurement units'}];
   if(chapter==='trades-2')return [refs[country]||refs.general].filter(Boolean);
   return [];
 }
 if(course==='business'){
   if(chapter==='business-5')return [refs[country]||refs.general].filter(Boolean);
   if(chapter==='business-1'&&country.startsWith('GB-'))return [refs[country]||refs.general].filter(Boolean);
   return [];
 }
 return [refs[country]||refs.general].filter(Boolean);
}
