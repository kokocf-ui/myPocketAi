import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {THEORY_ENTRIES,searchTheory} from './education_theory.mjs';
import {
 CHEMISTRY_SPECIALIZATIONS,CHEMISTRY_SPECIALTY_TOPICS,CHEMISTRY_SPECIALTY_LESSONS,
 CHEMISTRY_MOLECULES,chemistryVerifiedExercise
} from './chemistry_advanced.mjs';
const chemistry=THEORY_ENTRIES.filter(x=>x.subject==='chemistry');
assert.equal(CHEMISTRY_SPECIALIZATIONS.length,7);
assert.equal(CHEMISTRY_SPECIALTY_TOPICS.length,28);
assert.equal(CHEMISTRY_SPECIALTY_LESSONS.length,84);
assert.equal(chemistry.length,268);
assert.equal(new Set(chemistry.map(x=>x.title)).size,268,'Unique lesson titles');
assert.equal(new Set(chemistry.map(x=>x.id)).size,268,'Unique lesson IDs');
for(const track of CHEMISTRY_SPECIALIZATIONS){
 const chapters=CHEMISTRY_SPECIALTY_TOPICS.filter(x=>x.specialty===track.id);
 assert.equal(chapters.length,4,track.id+' must have four own chapters');
 assert.ok(track.core.length>=2);
 assert.ok(chapters.every(x=>CHEMISTRY_SPECIALTY_LESSONS.filter(e=>e.topic===x.id).length===3));
}
assert.equal(CHEMISTRY_MOLECULES.length,4);
for(const mol of CHEMISTRY_MOLECULES){
 assert.ok(mol.atoms.length>=3&&mol.bonds.length>=2);
 assert.ok(mol.bonds.every(([a,b])=>a<mol.atoms.length&&b<mol.atoms.length));
}
assert.equal(searchTheory('born oppenheimer',{subject:'chemistry',level:'advanced'})[0]?.topic,'comp_quantum');
assert.equal(searchTheory('born oppenheimer',{subject:'chemistry',level:'beginner'}).length,0);
function verify(input,expected,mode='solve'){
 const answer=chemistryVerifiedExercise(input,mode);
 assert.equal(answer?.verified,true,input);
 assert.equal(answer.formula,expected,input);
}
verify('H2 + O2 -> H2O','2 H2 + O2 → 2 H2O');
verify('C2H6 + O2 -> CO2 + H2O','2 C2H6 + 7 O2 → 4 CO2 + 6 H2O');
verify('Ca(OH)2 + HCl -> CaCl2 + H2O','Ca(OH)2 + 2 HCl → CaCl2 + 2 H2O');
verify('Fe + O2 -> Fe2O3','4 Fe + 3 O2 → 2 Fe2O3');
verify('NaCl + AgNO3 -> AgCl + NaNO3','NaCl + AgNO3 → AgCl + NaNO3');
assert.equal(chemistryVerifiedExercise('n=0,5 mol; V=2 L')?.body.includes('0.25 mol/L'),true);
assert.equal(chemistryVerifiedExercise('m=18 g; M=18 g/mol')?.body.includes('n=1 mol'),true);
assert.equal(chemistryVerifiedExercise('C1=2 mol/L; V1=50 mL; C2=0.5 mol/L')?.body.includes('V2=200 mL'),true);
assert.equal(chemistryVerifiedExercise('n=1 mol; V=0 L')?.verified,false,'Invalid volume must never produce a verified calculation');
assert.equal(chemistryVerifiedExercise('Fe3+ + e- -> Fe2+'),null,'Ionic half reactions cannot be mislabelled verified');
assert.equal(chemistryVerifiedExercise('H2 + O2 -> NO'),null,'Element imbalance cannot be invented');
assert.equal(chemistryVerifiedExercise('random college essay'),null,'AI must label unsupported prompts unverified');
assert.equal(chemistryVerifiedExercise('H2 + O2 -> H2O','explain')?.body.includes('Coeficienți întregi minimi'),false,'Explain teaches method without exposing final answer');
const html=await(await frontend.fetch(new Request('https://chemistry-integration.test/'))).text();
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,'Frontend JS must exist');
new vm.Script(js);
assert.match(js,/const CHEMISTRY_SPECIALTY_DATA=/);
assert.match(js,/const CHEMISTRY_MOLECULE_DATA=/);
assert.match(js,/const CHEMISTRY_SOLVE_VERIFIED=/);
assert.match(js,/stage==='specialties'/);
assert.match(js,/function scienceChemMoleculeOpen\(/);
assert.match(js,/scienceJourney\.specialty/);
assert.match(js,/CHEMISTRY_SOLVE_VERIFIED\(source,mode\)/);
assert.match(js,/function scienceEditorGrow\(editor\)/);
assert.match(html,/chemistry-molecule-frame/);
assert.match(html,/\.chemistry-curriculum-dialog\[open\]/);
assert.match(js,/if\(stage==='specialties'\)/);
console.log('PASS chemistry full integration: seven tracks, unique theory, robust local checks, modal molecular geometry, staged navigation');
