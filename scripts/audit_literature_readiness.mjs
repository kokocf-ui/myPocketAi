#!/usr/bin/env node
// Coverage inventory, not educational accreditation. Exit non-zero with
// --require-complete until independent national review records exist for every
// school route AND all displayed chapters have genuinely specific material.
// University curricula are institution-specific and cannot be certified as
// a universal national course by this script.
import {pathToFileURL} from 'node:url';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from '../education_all_country_subject_matrix.mjs';
import {LIT_EU_PROGRAMS} from '../literature_curriculum_europe.mjs';
import {literatureClientGradeExpand} from '../literature_europe_client_lazy.mjs';
import {romanianExpandedRows,romanianExpandedMaterial} from '../literature_ro_expanded_years.mjs';
import {litRomanianGradeMaterial} from '../literature_ro_grade_progression.mjs';
import {literatureHungaryGrade1Material} from '../literature_hungary_grade1.mjs';
import {literatureHungaryPrimaryMaterial} from '../literature_hungary_primary_batch.mjs';
import {literatureEuropeanAuthoredMaterial} from '../literature_europe_authored_material.mjs';
import {literatureGeneralFallback} from '../literature_general_fallback.mjs';

export function auditLiteratureReadiness(){
 const programs=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
 const countries=[];
 for(const country of EDUCATION_EUROPE_COUNTRIES){
  const routes=[];
  for(const stage of ['beginner','lower','medium'])for(const year of educationCountrySchoolYears(country,stage).years){
   const grade=String(year.id);
   let rows=literatureClientGradeExpand(programs,{country,level:stage,grade})||[];
   if(country==='RO'){
    const prior=rows.filter(row=>!String(row[0]).startsWith('eu-year-'));
    if(prior.length)rows=romanianExpandedRows(grade,prior);
   }
   const counts={authored_exact:0,romanian_year_material:0,shared_european:0,general_fallback:0,online_only:0};
   const details=[];
   for(const [id,title,focus,area] of rows){
    const base={country,stage,grade,topicKey:String(id),title,focus,language:'ro',mode:'lesson'};
    let kind;
    if(literatureHungaryGrade1Material(base)||literatureHungaryPrimaryMaterial(base))kind='authored_exact';
    else if(country==='RO'&&(litRomanianGradeMaterial(base)||romanianExpandedMaterial(base)))kind='romanian_year_material';
    else if(literatureEuropeanAuthoredMaterial(base))kind='shared_european';
    else if(literatureGeneralFallback({...base,area}))kind='general_fallback';
    else kind='online_only';
    counts[kind]++;details.push({id:String(id),kind});
   }
   // Counts measure routing in Romanian only, not correctness, a full syllabus,
   // subject-language fluency, offline correction, or every supported locale.
   // No country is marked reviewed by inference or chapter count alone.
   routes.push({stage,grade,chapters:rows.length,counts,details,reviewed:false});
  }
  countries.push({country,routes,reviewed:false});
 }
 return {generatedAt:'not time-dependent',countries,schoolRoutes:countries.reduce((n,c)=>n+c.routes.length,0),
  ready:false,reason:'Independent source, language, teaching-content, device and completeness reviews remain pending for all systems; university plans remain institution-specific.'};
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){
 const report=auditLiteratureReadiness();
 if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
 else{
  const totals={authored_exact:0,romanian_year_material:0,shared_european:0,general_fallback:0,online_only:0};
  for(const country of report.countries)for(const route of country.routes)
   for(const key of Object.keys(totals))totals[key]+=route.counts[key];
  console.log(`Literature: ${report.countries.length} systems, ${report.schoolRoutes} school routes; NOT RELEASE-READY`);
  console.log('RO lesson routing categories (not curriculum certification):',JSON.stringify(totals));
  console.log(report.reason);
 }
 if(process.argv.includes('--require-complete')&&!report.ready)process.exitCode=1;
}
