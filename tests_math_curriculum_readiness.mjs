import assert from 'node:assert/strict';
import {mathCurriculumReadiness,MATH_CURRICULUM_SOURCE_REGISTRY} from './math_curriculum_readiness.mjs';
const audit=mathCurriculumReadiness();
assert.ok(audit.total>=600,'Audit all European school-year combinations, not just RO and England');
assert.ok(audit.rows.some(x=>x.country==='RO'&&x.grade==='5'&&x.stage==='lower'&&x.countryYearSpecific));
assert.equal(audit.fullyApproved,0,'Do not report a full Mathematics course closed without pedagogical acceptance');
assert.equal(audit.readiness,'incomplete');
assert.ok(audit.rows.every(x=>x.blockers.length>0));
assert.equal(audit.yearSpecificCandidates,4,'Only four Romanian grade V–VIII source-reviewed annual outlines, not fully approved');
assert.equal(audit.partialSourceReviews,1,'England Y6 has an explicitly partial DfE crosswalk');
assert.ok(audit.rows.filter(x=>x.country==='RO'&&x.stage==='lower'&&['5','6','7','8'].includes(x.grade))
 .every(x=>x.scope==='national-crosswalk-review'&&!x.complete),
 'Romanian source-mapped annual outlines must not masquerade as pedagogically approved courses');
assert.ok(audit.rows.find(x=>x.country==='GB-ENG'&&x.stage==='beginner'&&x.grade==='Y6')
 ?.scope==='partial-year-source-review','England Year 6 is an incomplete statutory mapping');
assert.ok(audit.rows.filter(x=>!(x.country==='RO'&&x.stage==='lower'&&['5','6','7','8'].includes(x.grade))&&
 !(x.country==='GB-ENG'&&x.stage==='beginner'&&x.grade==='Y6'))
 .every(x=>x.scope==='unverified-advisory'),
 'Other European school-years still use generic content and must be marked unverified');
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8.startsWith('https://www.edu.ro/'));
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary.startsWith('https://www.gov.uk/'));
const byCountry=new Set(audit.rows.map(x=>x.country));
assert.ok(byCountry.size>=48);
console.log('MATHEMATICS NOT CLOSED:',audit.total,'country/year combinations,',audit.yearSpecificCandidates,
 'source-mapped annual candidates,',audit.partialSourceReviews,'partial country/year reviews,',audit.fullyApproved,'fully approved. Technical green does not imply curriculum complete.');
