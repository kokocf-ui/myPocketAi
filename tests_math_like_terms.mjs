import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script must be accessible');
new vm.Script(script);
const a=script.indexOf('function mathLikeTermsModel(');
const b=script.indexOf('function mathAlgebraEngines(',a);
assert.ok(a>0&&b>a,'local like-term engine present');
const r=script.indexOf('function mathPhotoOcrRisk(');
const z=script.indexOf('// Educational mathematics: reject obvious OCR fragments',r);
assert.ok(r>0&&z>r,'photo OCR risk detection present');
const engine=vm.runInNewContext(script.slice(a,b)+'\n({parse:mathLikeTermsModel,solve:mathLikeTermsSolution,method:mathLikeTermsMethod})',
 {learningLabel:(ro)=>ro});
const risk=vm.runInNewContext(script.slice(r,z)+'\nmathPhotoOcrRisk');
const examples=[
 ['9x - 3x + 4x','10x'],
 ['2x² - 3x² + 5x²','4x²'],
 ['2√5xy + 9√5xy - 10√5xy','√5xy'],
 ['9abc - 13abc','−4abc'],
 ['6x + 3y - 5z - 5x + 7y - 3z','x + 10y − 8z'],
 ['12x - 8 + 13 - 11x + 9 + 5x','6x + 14'],
 ['14x² - x + 4x² - 10x - 19x² + 12x','−x² + x'],
 ['2√5xy - 2√5xy','0'],
 ['2xy + 3yx','5xy']
];
for(const [input,expected] of examples){
 const model=engine.parse(input);
 assert.ok(model,'should parse exact monomial sum '+input);
 assert.equal(model.result,expected,input);
 assert.equal(engine.solve(input).steps.at(-1).fullAfter,expected);
 assert.equal(engine.method(input).rules.length,4);
}
for(const bad of ['2x2 - 3x2 + 5x2','2V5xy + 9V5xy','2x/(3x)','√(5xy) + 2√(5xy)','x^20 + x^20','2x +','x = 2','(x + 2)(x + 3)'])
 assert.equal(engine.parse(bad),null,'no invented interpretation: '+bad);
assert.equal(risk('2V5xy + 9V5xy'),true);
assert.equal(risk('2x2 - 3x2 + 5x2'),true);
assert.equal(risk('2√5xy + 9√5xy'),false);
assert.equal(risk('2x² - 3x² + 5x²'),false);
assert.ok(script.includes('originalOcr&&candidate===originalOcr&&mathPhotoOcrRisk(candidate)'),
 'ambiguous photo formula requires editing before confirmation');
assert.ok(script.includes("id:'like-terms'"),'local engine registered');
console.log('PASS like terms: integer monomials, radicals, powers, multiple letters and OCR ambiguity checks');
