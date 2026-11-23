import assert from 'node:assert/strict';
import {mathCurriculumReadiness,MATH_CURRICULUM_SOURCE_REGISTRY} from './math_curriculum_readiness.mjs';
const audit=mathCurriculumReadiness();
assert.ok(audit.total>=600,'Audit all European school-year combinations, not just RO and England');
assert.ok(audit.rows.some(x=>x.country==='RO'&&x.grade==='5'&&x.stage==='lower'&&x.countryYearSpecific));
assert.equal(audit.fullyApproved,0,'Do not report a full Mathematics course closed without pedagogical acceptance');
assert.equal(audit.readiness,'incomplete');
assert.ok(audit.rows.every(x=>x.blockers.length>0));
assert.equal(audit.yearSpecificCandidates,4,'Only four Romanian grade V–VIII source-reviewed annual outlines, not fully approved');
assert.equal(audit.partialSourceReviews,6,'Poland grade IV plus England Y3/Y4, Y6 and KS4 Y10/Y11 remain partial, NOT complete');
const plIV=audit.rows.find(x=>x.country==='PL'&&x.grade==='IV'&&x.stage==='lower');
assert.ok(plIV?.officialYearSourceMapped);
assert.equal(plIV.scope,'partial-year-source-review');
assert.ok(plIV.source.includes('eli.gov.pl'));
assert.ok(plIV.manualExample.includes('podreczniki.men.gov.pl'));
assert.equal(plIV.complete,false);
for(const grade of ['Y3','Y4']){
 const row=audit.rows.find(x=>x.country==='GB-ENG'&&x.stage==='beginner'&&x.grade===grade);
 assert.ok(row?.officialYearSourceMapped,'DfE original annual lessons are actually routed');
 assert.ok(row.independentCourseSequence?.includes('thenational.academy'));
 assert.ok(row.blockers.some(b=>b.includes('bullet-to-lesson')),
  'A source reference is not an exhaustive annual textbook crosswalk');
 assert.equal(row.complete,false);
}
assert.ok(audit.rows.filter(x=>x.country==='RO'&&x.stage==='lower'&&['5','6','7','8'].includes(x.grade))
 .every(x=>x.scope==='national-crosswalk-review'&&!x.complete),
 'Romanian source-mapped annual outlines must not masquerade as pedagogically approved courses');
assert.ok(audit.rows.find(x=>x.country==='GB-ENG'&&x.stage==='beginner'&&x.grade==='Y6')
 ?.scope==='partial-year-source-review','England Year 6 is an incomplete statutory mapping');
assert.ok(audit.rows.filter(x=>!(x.country==='RO'&&x.stage==='lower'&&['5','6','7','8'].includes(x.grade))&&
 !(x.country==='PL'&&x.stage==='lower'&&x.grade==='IV')&&
 !(x.country==='GB-ENG'&&x.stage==='beginner'&&['Y3','Y4','Y6'].includes(x.grade))&&
 !(x.country==='GB-ENG'&&x.stage==='medium'&&['Y10','Y11'].includes(x.grade)))
 .every(x=>x.scope==='unverified-advisory'),
 'Other European school-years still use generic content and must be marked unverified');
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8.startsWith('https://www.edu.ro/'));
assert.ok(MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary.startsWith('https://www.gov.uk/'));
for(const grade of ['Y10','Y11']){
 const row=audit.rows.find(x=>x.country==='GB-ENG'&&x.stage==='medium'&&x.grade===grade);
 assert.ok(row?.partialSourceReview&&!row.complete&&row.scope==='partial-year-source-review');
 assert.ok(row.blockers.some(x=>x.includes('not official Year 10/11')));
 assert.ok(row.source.includes('gov.uk'));
}
const byCountry=new Set(audit.rows.map(x=>x.country));
assert.ok(byCountry.size>=48);
console.log('MATHEMATICS NOT CLOSED:',audit.total,'country/year combinations,',audit.yearSpecificCandidates,
 'source-mapped annual candidates,',audit.partialSourceReviews,'partial country/year reviews,',audit.fullyApproved,'fully approved. Technical green does not imply curriculum complete.');
