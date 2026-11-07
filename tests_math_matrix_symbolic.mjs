import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);new vm.Script(script);
const a=script.indexOf('function mathMatrixRead(');
const b=script.indexOf('function mathAlgebraEngines(',a);
assert.ok(a>0&&b>a);
const api=vm.runInNewContext(script.slice(a,b)+
 '\n({matrix:mathMatrixExercise,det:mathMatrixDet,symbolic:mathSymbolicPoly,format:mathSymbolicFormat,matrixSolve:mathMatrixSolution,symbolicSolve:mathSymbolicSolution})',{
 learningLabel:(ro,en)=>ro,
 mathMatrix3Det:r=>r[0][0]*(r[1][1]*r[2][2]-r[1][2]*r[2][1])-r[0][1]*(r[1][0]*r[2][2]-r[1][2]*r[2][0])+r[0][2]*(r[1][0]*r[2][1]-r[1][1]*r[2][0]),
 mathLinearNotation:()=>({number:n=>String(n)}),Math,Number,JSON
});
const m=api.matrix('A=[[1,2],[3,4]]\nB=[[5,6],[7,8]]\nA+B');
assert.equal(JSON.stringify(m.result),'[[6,8],[10,12]]');
assert.equal(JSON.stringify(api.matrix('A=[[1,2],[3,4]]\nB=[[5,6],[7,8]]\nA*B').result),'[[19,22],[43,50]]');
assert.equal(JSON.stringify(api.matrix('A=[[1,2],[3,4]]\nB=[[5,6],[7,8]]\nA-B').result),'[[-4,-4],[-4,-4]]');
assert.equal(JSON.stringify(api.matrix('A=[[1,2],[3,4]]\ntranspose(A)').result),'[[1,3],[2,4]]');
assert.equal(api.matrix('det([[1,2],[3,4]])').result,-2);
assert.equal(api.matrix('det([[1,2,3],[0,1,4],[5,6,0]])').result,1);
assert.equal(api.matrix('A=[[1,2,3],[4,5,6]]\nB=[[1,2],[3,4]]\nA+B'),null);
assert.equal(api.matrix('det([[1,2,3],[4,5,6]])'),null);
assert.equal(api.matrix('det([[1,"a"],[2,3]])'),null);
assert.ok(api.matrixSolve('det([[1,2],[3,4]])').conclusion.includes('-2'));
const poly=api.symbolic('simplifică: 2(x+3)+3(x-1)');
assert.equal(JSON.stringify(poly.coefficients),'[3,5]');
assert.equal(api.format(poly.coefficients),'5x + 3');
assert.equal(api.format(api.symbolic('(x+1)^2').coefficients),'x^2 + 2x + 1');
assert.equal(api.format(api.symbolic('x(x-3)+2x').coefficients),'x^2 − x');
assert.equal(api.format(api.symbolic('(x-1)*(x+1)').coefficients),'x^2 − 1');
assert.equal(api.symbolic('x^5'),null);
assert.equal(api.symbolic('x+y'),null);
assert.equal(api.symbolic('x=2'),null);
assert.ok(api.symbolicSolve('x*(x+1)').conclusion.includes('x^2 + x'));
assert.ok(script.includes("id:'matrix-operations'"));
assert.ok(script.includes("id:'symbolic-polynomials'"));
assert.ok(script.includes('Object.assign(angles,initialView)'));
console.log('PASS matrix arithmetic/determinants, symbolic polynomials and 3D reset');
