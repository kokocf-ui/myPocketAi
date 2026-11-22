import assert from 'node:assert/strict';
import {mathCurriculumReadiness,MATH_CURRICULUM_SOURCE_REGISTRY} from './math_curriculum_readiness.mjs';
const audit=mathCurriculumReadiness();
assert.ok(audit.total>=600,'Audit all European school-year combinations, not just RO and England');
assert.ok(audit.rows.some(x=>x.country==='RO'&&x.grade==='5'&&x.stage==='lower'&&x.countryYearSpecific));
assert.equal(audit.fullyApproved,0,'Do not report a full Mathematics course closed without pedagogical acceptance');
assert.equal(audit.readiness,'incomplete');
assert.ok(audit.rows.every(x=>x.blockers.length>0));
assert.ok(audit.rows.filter(x=>x.country!=='RO'||x.stage!=='lower'||x.grade!=='5')
 .every(x=>x.scope==='unverified-advisory'),
 'Shared generic math chapters must never be presented as national validated lessons');
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8.startsWith('https://www.edu.ro/'));
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary.startsWith('https://www.gov.uk/'));
const byCountry=new Set(audit.rows.map(x=>x.country));
assert.ok(byCountry.size>=48);
console.log('MATHEMATICS NOT CLOSED:',audit.total,'country/year combinations,',audit.yearSpecificCandidates,
 'source-mapped candidates,',audit.fullyApproved,'fully approved. Technical green does not imply curriculum complete.');
