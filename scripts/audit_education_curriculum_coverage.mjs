#!/usr/bin/env node
// Evidence inventory, not pedagogical accreditation. Counts and status labels
// come from current machine registries, not claims of complete national courses.
import {pathToFileURL} from 'node:url';
import {EDUCATION_EUROPE_COUNTRIES,EDUCATION_SCHOOL_STAGES,educationCountrySchoolYears,educationSubjectSchoolPlan,educationCoverageTotals} from '../education_all_country_subject_matrix.mjs';
import {mathCurriculumReadiness} from '../math_curriculum_readiness.mjs';
import {scienceCurriculumReadiness} from '../science_curriculum_readiness.mjs';
import {MATH_DECOUPLED_CURRICULUM_PACKS} from '../curriculum_pack_catalog.mjs';
import {auditLiteratureReadiness} from './audit_literature_readiness.mjs';
export function auditEducationCurriculumCoverage(){
 const literature=auditLiteratureReadiness(),litByCountry=new Map(literature.countries.map(c=>[c.country,c]));
 const subjects=['history','geography','computing','literature'];
 const countries=EDUCATION_EUROPE_COUNTRIES.map(country=>{
  const coverage=Object.fromEntries(subjects.map(s=>[s,{frameworkVerified:0,gradeContentUnverified:0,generalLearning:0,missingUnits:0}]));
  for(const stage of EDUCATION_SCHOOL_STAGES)for(const year of educationCountrySchoolYears(country,stage).years)for(const subject of subjects){
   const p=educationSubjectSchoolPlan({country,stage,grade:year.id,subject});
   if(p.status==='framework-verified')coverage[subject].frameworkVerified++;
   else if(p.status==='grade-content-unverified')coverage[subject].gradeContentUnverified++;
   else if(p.status==='general-learning')coverage[subject].generalLearning++;
   if(p.status!=='invalid-selection'&&!p.units.length)coverage[subject].missingUnits++;
  }
  const lit=litByCountry.get(country);
  const routing={authored_exact:0,romanian_year_material:0,shared_european:0,general_fallback:0,online_only:0};
  for(const route of lit.routes)for(const k of Object.keys(routing))routing[k]+=route.counts[k];
  return {country,coverage,literatureSchoolRoutes:lit.routes.length,literatureRoutingRO:routing};
 });
 const math=mathCurriculumReadiness(),science=scienceCurriculumReadiness();
 return {countries,totals:educationCoverageTotals(),
  mathematics:{packs:MATH_DECOUPLED_CURRICULUM_PACKS.length,countries:new Set(MATH_DECOUPLED_CURRICULUM_PACKS.map(p=>p.country)).size,years:math.total,yearSpecificCandidates:math.yearSpecificCandidates,partialSourceReviews:math.partialSourceReviews,fullyApproved:math.fullyApproved},
  science:{totalPacks:science.totalPacks,fullyApproved:science.fullyApproved,bySubject:science.bySubject},
  literature:{schoolRoutes:literature.schoolRoutes,ready:literature.ready,reviewedCountries:literature.countries.filter(c=>c.reviewed).length}};
}
function markdown(report){
 const out=['# Educație — inventar reproducibil al acoperirii curriculare','',
  'Acest raport descrie registrele existente, nu certifică manuale complete, competențe ale elevilor sau verificare pedagogică. Reproduce-l cu `node scripts/audit_education_curriculum_coverage.mjs --markdown`. Anii universitari sunt incluși în matricea pe materii, dar nu în rutele școlare Literatura. Sursele și programele se pot schimba; nu deduce valabilitatea lor doar din existența unui link.','',
  '## Imagine de ansamblu','',
  `- Matematică: ${report.mathematics.packs} pachete în ${report.mathematics.countries} sisteme; auditul de pregătire enumeră ${report.mathematics.years} trasee, ${report.mathematics.yearSpecificCandidates} candidați anuali și ${report.mathematics.partialSourceReviews} revizuiri parțiale; ${report.mathematics.fullyApproved} aprobate integral. Categorii ale auditului, nu număr de programe certificate.`,
  `- Fizică, Chimie, Biologie, Astronomie: ${report.science.totalPacks} pachete în total; numărul de ani cu aprobare pedagogică integrală în registru este ${report.science.fullyApproved}. Materialele și notele comune rămân parțial în HTML și Worker.`,
  `- Matricea generală: ${report.totals.countries} sisteme, ${report.totals.subjects} materii, ${report.totals.combinations} selecții valide: ${report.totals.frameworkVerified} încadrări de tip cadru verificat, ${report.totals.gradeContentUnverified} cu conținut pe clasă neverificat și ${report.totals.generalLearning} generale; ${report.totals.missingUnits} selecții fără unități. Această matrice folosește o clasificare conservatoare diferită de inventarele pachetelor de Matematică/Științe: nu deduce absența pachetelor din eticheta „general”.`,
  `- Literatura: ${report.literature.schoolRoutes} rute școlare, ${report.literature.reviewedCountries} țări cu revizuire independentă în registru. Eticheta de material exact este un rezultat tehnic de rutare, nu o aprobare curriculară.`, '',
  '| Materie Științe | Sisteme cu pachet | Pachete școlare | Pachete universitare | Lecții în pachete | Revizuite integral |', '|---|---:|---:|---:|---:|---:|'];
 for(const v of Object.values(report.science.bySubject))out.push(`| ${v.subject} | ${v.countries} | ${v.schoolPacks} | ${v.universityPacks} | ${v.packLessons} | ${v.fullyApproved} |`);
 out.push('','## 50 de sisteme: Istorie, Geografie, Informatică și Literatură','',
  'Istorie/Geografie/Informatică: `C/N/G` înseamnă număr de selecții în matrice cu cadru identificat / conținut de clasă neverificat / parcurs general (inclusiv universitate). `G` nu dovedește un curs național complet. Pentru Literatură: `E/R/S/F/O` sunt capitole școlare rutate în limba română către material exact / material românesc pe an / practică europeană comună / suport general / numai online; nu sunt ani compleți, nu includ toate limbile sau universitatea și nu măsoară calitatea lecțiilor.','',
  '| Sistem | Istorie C/N/G | Geografie C/N/G | Informatică C/N/G | Literatură: rute școlare | Literatură E/R/S/F/O |','|---|---:|---:|---:|---:|---:|');
 const fmt=x=>[x.frameworkVerified,x.gradeContentUnverified,x.generalLearning].join('/');
 for(const c of report.countries){const r=c.literatureRoutingRO;out.push(`| ${c.country} | ${fmt(c.coverage.history)} | ${fmt(c.coverage.geography)} | ${fmt(c.coverage.computing)} | ${c.literatureSchoolRoutes} | ${r.authored_exact}/${r.romanian_year_material}/${r.shared_european}/${r.general_fallback}/${r.online_only} |`)}
 out.push('','## Limitări și următorii pași','',
  '- Nu considera domeniile închise doar pentru că există un selector, un cadru sau un pachet; sunt necesare verificări pe surse oficiale, an/cohortă, limbă, capitol, exerciții și cititor.',
  '- Literatura: materiale naționale exacte există pentru capitole selectate HU I–IV și FR CP; acestea rămân parțiale și necesită revizuire pedagogică și lingvistică independentă.',
  '- Istorie, Geografie și Informatică necesită conținut național/anual și integrarea cititorului. Limbi străine, examene și cursuri practice rămân și ele în scopul Educației.',
  '- Pachetele coexistă cu conținut încorporat; publicarea independentă este un pilot local, nu funcționalitate activată în producție. Cache-ul nu demonstrează pornirea complet offline.');
 return out.join('\n')+'\n';
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){const r=auditEducationCurriculumCoverage();process.stdout.write(process.argv.includes('--json')?JSON.stringify(r,null,2)+'\n':markdown(r))}
