import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {auditLiteratureReadiness} from './scripts/audit_literature_readiness.mjs';
const report=auditLiteratureReadiness();
assert.equal(report.countries.length,50);
assert.equal(report.schoolRoutes,624);
assert.equal(report.ready,false,'A list of country/year labels is not proof of completion');
assert.ok(report.countries.every(country=>!country.reviewed),'Do not infer national approval from lesson count');
const hu=report.countries.find(country=>country.country==='HU').routes.find(route=>route.stage==='beginner'&&route.grade==='1');
assert.equal(hu.counts.authored_exact,3,'Track just the three HU grade 1 chapters actually authored');
assert.ok(hu.counts.general_fallback>0,'Other Hungarian national chapters remain general support');
for(const grade of ['2','3','4']){
 const route=report.countries.find(country=>country.country==='HU').routes.find(row=>row.stage==='beginner'&&row.grade===grade);
 assert.equal(route.counts.authored_exact,3,'Three specific HU primary lessons are implemented for grade '+grade);
 assert.ok(route.counts.general_fallback>0,'Do not treat the entire grade as complete: '+grade);
}
const fr=report.countries.find(country=>country.country==='FR').routes.find(route=>route.stage==='lower'&&route.grade==='6e');
assert.ok(fr.counts.shared_european>0,'Shared practice must not count as specific national teaching material');
const franceCP=report.countries.find(country=>country.country==='FR').routes.find(route=>route.stage==='beginner'&&route.grade==='CP');
assert.equal(franceCP.counts.authored_exact,5,'Five authored French CP chapters are specific');
assert.ok(franceCP.counts.shared_european>0,'Other France CP chapters are not yet individually authored');
for(const country of report.countries)for(const route of country.routes){
 assert.equal(route.chapters,Object.values(route.counts).reduce((a,b)=>a+b,0));
 assert.equal(route.chapters,route.details.length);
 assert.equal(route.reviewed,false);
}
const gate=spawnSync(process.execPath,['scripts/audit_literature_readiness.mjs','--require-complete'],{encoding:'utf8'});
assert.equal(gate.status,1,'Release-readiness gate must remain closed until real completion and review');
assert.match(gate.stdout,/NOT RELEASE-READY/);
console.log('PASS honest 50-system readiness inventory and closed release gate');
