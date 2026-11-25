import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {auditEducationCurriculumCoverage} from './scripts/audit_education_curriculum_coverage.mjs';
import {EDUCATION_EUROPE_COUNTRIES,educationCoverageTotals} from './education_all_country_subject_matrix.mjs';
const report=auditEducationCurriculumCoverage();
assert.equal(report.countries.length,50);
assert.deepEqual(report.countries.map(x=>x.country),EDUCATION_EUROPE_COUNTRIES);
assert.deepEqual(report.totals,educationCoverageTotals());
assert.equal(report.literature.schoolRoutes,624);assert.equal(report.literature.ready,false);
assert.equal(report.mathematics.countries,50);assert.equal(report.mathematics.fullyApproved,0);
for(const data of Object.values(report.science.bySubject)){assert.equal(data.countries,50);assert.equal(data.fullyApproved,0)}
const hu=report.countries.find(c=>c.country==='HU'),fr=report.countries.find(c=>c.country==='FR');
assert.equal(hu.literatureRoutingRO.authored_exact,12);assert.equal(fr.literatureRoutingRO.authored_exact,10);
assert.ok(fr.literatureRoutingRO.shared_european>0);
for(const row of report.countries){
 assert.ok(row.literatureSchoolRoutes>0);
 for(const subject of ['history','geography','computing','literature']){
  const v=row.coverage[subject];assert.ok(v.frameworkVerified+v.gradeContentUnverified+v.generalLearning>0);
 }
}
const run=spawnSync(process.execPath,['scripts/audit_education_curriculum_coverage.mjs','--markdown'],{encoding:'utf8'});
assert.equal(run.status,0,run.stderr);assert.equal(run.stdout,readFileSync('EDUCATION_CURRICULUM_COVERAGE_REPORT.md','utf8'),'Coverage report must be refreshed when its sources change');
console.log('PASS 50-system curriculum coverage report: reproducible, technical categories distinct from approval');
