import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const embedded=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(embedded,'mathematics UI script exists');
new vm.Script(embedded);
const start=embedded.indexOf('function mathArithmeticValue(');
const end=embedded.indexOf('function mathQuadraticEquation(',start);
assert.ok(start>=0&&end>start);
const api=vm.runInNewContext(embedded.slice(start,end)+
 '\n({solve:mathLinearSolution})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});
const original='Rezolvă ecuația:\n3(2x−1)+5=20';
const solved=api.solve(original);
assert.equal(solved.solution,3);
assert.equal(solved.steps.length,4,'algebra steps remain intact');
const proof=Array.from(solved.steps.at(-1).verificationSteps);
assert.deepEqual(proof,[
 '3(2×3−1)+5 = 20',
 '3 × (6 − 1) + 5 = 20',
 '3 × (5) + 5 = 20',
 '15 + 5 = 20',
 '20 = 20'
],'school verification must display each calculation, not jump to conclusion');
assert.match(solved.conclusion,/x = 3/);
for(const [source,answer] of [
 ['2(x-3)=8',7],
 ['3(x+1)-2(x-1)=8',3],
 ['x/2+1=3',4],
 ['0,5x+1,5=2,5',2],
 ['2x+1=x+4',3]
]){
 const solution=api.solve(source);
 assert.equal(solution.solution,answer,'solution remains correct: '+source);
 const lines=solution.steps.at(-1).verificationSteps;
 assert.ok(Array.isArray(lines)&&lines.length>=2,'numeric proof: '+source);
 assert.match(lines.at(-1),/^(.+) = \1$/,'last equality has matching sides: '+source);
}
assert.equal(api.solve('2x+1=2x+2').kind,'contradiction');
assert.equal(api.solve('2x+1=2x+1').kind,'identity');
assert.ok(embedded.includes('if(step.verificationSteps?.length)'),
 'step renderer shows multi-line verification only for the verified substitution');
assert.ok(embedded.includes("step.verificationSteps.slice(0,-1).join('. ')"),
 'spoken lesson includes intermediate verification lines');
console.log('PASS student-facing linear solution verification with all intermediate numeric steps');
