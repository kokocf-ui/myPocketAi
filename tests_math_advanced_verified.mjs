import assert from 'node:assert/strict';
import frontend from './index.js';
import {mathAdvancedVerifiedModel as solve} from './math_advanced_verified.mjs';
const cases=[
 ['cmmdc(36,60)','12'],['cmmmc(12,18)','36'],['rest 17 mod 5','2'],
 ['suma de la 1 la 100','5050'],['procent: 15 din 200','30'],
 ['norma vectorului: (3;4)','5'],['produs vectorial: (1;0;0)×(0;1;0)','(0; 0; 1)'],
 ['determinant: [[1,2],[3,4]]','−2'],['varianța eșantion: 1,2,3','1'],
 ['binomiala: n=5, k=2, p=0.5','0.3125'],['derivata: sin(x)','cos(x)'],
 ['derivata: cos(x)','−sin(x)'],['integrala: sin(x)','−cos(x) + C'],
 ["y'=2x+3, y(0)=4",'y(x) = 1x² + (3)x + (4)'],
 ['varf parabola: y=1x^2-4x+3','V(2; −1)']
];
for(const [input,expected] of cases){
 const got=solve(input);
 assert.ok(got, 'deterministic model should recognize: '+input);
 assert.equal(got.result,expected,'incorrect answer for '+input);
 assert.equal(got.verified,true);
}
for(const malformed of ['cmmdc(0,0)','cmmmc(0,2)','rest 17 mod 0','binomiala: n=3, k=5, p=0.5','determinant: [[1,2],[3]]', 'integrala: unknown(x)',''])assert.equal(solve(malformed),null,malformed);
const html=await(await frontend.fetch(new Request('https://math-engine-check.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.match(script,/const mathAdvancedVerifiedBrowserModel = function mathAdvancedVerifiedModel\(/);
assert.match(script,/const extension=typeof mathAdvancedVerifiedBrowserModel==='function'\?mathAdvancedVerifiedBrowserModel\(source\):null/);
console.log('PASS verified advanced mathematics solvers: '+cases.length+' positive cases, '+7+' invalid guards, wired in HTML');
