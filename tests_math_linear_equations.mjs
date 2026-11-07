import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const embedded=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(embedded,'embedded mathematics script exists');
new vm.Script(embedded);
const from=embedded.indexOf('function mathArithmeticValue(');
const to=embedded.indexOf('function mathResultPage(',from);
assert.ok(from>0&&to>from,'verified local maths engine available');
const api=vm.runInNewContext(embedded.slice(from,to)+
 '\n({parse:mathLinearEquation,solve:mathLinearSolution,method:mathLinearMethodGuide})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});

for(const [equation,answer] of [
 ['3(2x-1)+5=20',3],
 ['Rezolvă ecuația:\n3(2x−1)+5=20',3],
 ['Rezolvă ecuația: 3(2x−1)+5=20',3],
 ['2x+4=10',3],
 ['-x+3=1',2],
 ['2(x-3)=8',7],
 ['2x+1=x+4',3],
 ['x/2+1=3',4],
 ['(x+1)/2=3',5],
 ['3(x+1)-2(x-1)=8',3],
 ['2(3x-1)+3=2x+13',3],
 ['0,5x+1,5=2,5',2]
]){
 const parsed=api.parse(equation);
 const solution=api.solve(equation);
 assert.ok(parsed&&solution,equation);
 assert.equal(parsed.kind,'unique',equation);
 assert.ok(Math.abs(parsed.value-answer)<1e-9,equation+': correct answer');
 assert.ok(Math.abs(solution.solution-answer)<1e-9,equation+': displayed answer');
 assert.ok(solution.steps.length>=4,equation+': show complete lesson including verification');
 assert.match(solution.steps.at(-1).fullAfter,/ = /,'numerical proof is displayed');
 assert.match(solution.conclusion,/verificată/i,'no unverified conclusion');
 const guide=api.method(equation);
 assert.ok(guide,'general method available');
 assert.ok(guide.rules.length>=5,'method has clear reusable rules');
 assert.ok(!guide.intro.includes('Soluția verificată'),'method is not a duplicate solution');
}
const reported=api.solve('Rezolvă ecuația:\n3(2x−1)+5=20');
assert.match(reported.steps[0].fullAfter,/6x \+ 2 = 20/,'distributive property is applied to both terms');
assert.match(reported.steps[1].fullAfter,/6x = 18/,'constants are moved correctly');
assert.match(reported.steps[2].fullAfter,/x = 3/,'not 3.5');
assert.match(reported.steps[3].fullAfter,/20 = 20/,'the original equality checks');
assert.ok(!JSON.stringify(reported).includes('3,5'),'never introduce the incorrect result');
assert.ok(!JSON.stringify(reported).includes('18 + 5 = 20'),'never accept a false arithmetic equality');
assert.equal(api.parse('2(x+1)=2x+2').kind,'identity');
assert.match(api.solve('2(x+1)=2x+2').conclusion,/orice număr real/i);
assert.equal(api.parse('2x+1=2x+2').kind,'contradiction');
assert.match(api.solve('2x+1=2x+2').conclusion,/nu are soluții/i);
for(const invalid of [
 'x*x=4','x^2=9','1/x=2','2(x+1)/0=3',
 'f(x)=2x-3','3(2x-1)+5=20=20','x=Infinity',
 'Arată un graf pentru x în plan'
])assert.equal(api.parse(invalid),null,'unsupported expressions must not be guessed: '+invalid);
assert.ok(embedded.includes("detailed:mode==='solve'?mathAlgebraLocal('solve',text)?.value:null"),
 'Solve uses the verified local linear solver first');
assert.ok(embedded.includes("methodGuide:mode==='explain'?mathAlgebraLocal('explain',text)?.value:null"),
 'Method uses a separate deterministic general explanation');
console.log('PASS deterministic linear equations, identity/contradiction, method separation and regression from screenshots');
