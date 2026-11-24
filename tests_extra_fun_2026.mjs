import assert from 'node:assert/strict';
import vm from 'node:vm';
import {FUN_ASTRO_CORE_SCRIPT} from './extra_fun_core.mjs';
import {EXTRA_FUN_UI_SCRIPT,EXTRA_FUN_UI_STYLE} from './extra_fun_ui.mjs';
import {EXTRA_TOOLS_SIX_NAV_SCRIPT,EXTRA_TOOLS_SIX_NAV_STYLE} from './extra_tools_six_nav.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import frontend from './index.js';

for(const [name,script] of [['astro',FUN_ASTRO_CORE_SCRIPT],['fun ui',EXTRA_FUN_UI_SCRIPT],
 ['navigation',EXTRA_TOOLS_SIX_NAV_SCRIPT],['tools bundle',EXTRA_TOOLS_WORKSPACE_SCRIPT]]){
 assert.doesNotThrow(()=>new vm.Script(script,{filename:name+'.js'}),name+' must parse as JS');
}
const f=new Function(FUN_ASTRO_CORE_SCRIPT+';return {funParseBirth,funSunSign,funSolarLongitude,funAscendantLongitude,funChineseZodiac,funSolarAspect,funSudokuGenerate,funSudokuUnique,funDailyPick,funHoroscope,FUN_MAXIMS,FUN_JOKES,FUN_CROSSWORD};')();
assert.equal(f.funParseBirth('2026-02-30','12:00',0),null,'Invalid leap date must not normalize');
assert.equal(f.funParseBirth('2024-02-29','12:00',2).toISOString(),'2024-02-29T10:00:00.000Z');
assert.equal(f.funParseBirth('1899-01-01','12:00',0),null);
assert.equal(f.funParseBirth('2026-05-21','12:00',25),null);
for(const [date,sign] of [
 ['2026-01-15',9],['2026-03-21',0],['2026-04-25',1],
 ['2026-08-15',4],['2026-11-23',8],['2026-12-25',9]
]){
 assert.equal(f.funSunSign(new Date(date+'T12:00:00Z')),sign,'Sun sign for '+date);
}
const utc=f.funParseBirth('1990-08-20','12:00',2);
assert.ok(Number.isFinite(f.funAscendantLongitude(utc,51.5,-0.13)));
assert.equal(f.funChineseZodiac(new Date('2026-01-15T12:00:00Z')).animal,'Șarpe',
 'Chinese zodiac must use Lunar New Year, not 1 January');
assert.equal(f.funChineseZodiac(new Date('2026-03-15T12:00:00Z')).animal,'Cal');
assert.equal(f.funSolarAspect(0,120).name,'trigon');
assert.equal(f.funSolarAspect(0,180).name,'opoziție');
assert.ok(Number.isNaN(f.funAscendantLongitude(utc,90,-0.13)),
 'Unsupported polar coordinates must not invent a rising sign');
assert.ok(Number.isNaN(f.funAscendantLongitude(utc,51,250)),
 'Invalid longitude must be rejected');
assert.notEqual(f.funAscendantLongitude(utc,51.5,-0.13),
 f.funAscendantLongitude(new Date(utc.getTime()+3600000),51.5,-0.13));
assert.ok(f.FUN_MAXIMS.length>=10&&f.FUN_JOKES.length>=10);
assert.equal(f.funDailyPick(f.FUN_MAXIMS,'2026-11-24'),f.funDailyPick(f.FUN_MAXIMS,'2026-11-24'),
 'Daily maxim must stay stable on one calendar date');
assert.ok(f.funHoroscope(0,'2026-11-24',true).some(line=>line.includes('amor')),
 'Humorous horoscope must include a love-life line');
const filled=Array.from({length:9},()=>new Set());
for(const level of ['easy','medium','hard']){
 const p=f.funSudokuGenerate(level,'offline-test');
 assert.equal(p.puzzle.length,81);assert.equal(p.solution.length,81);
 assert.equal(f.funSudokuUnique(p.puzzle),1,'Each Sudoku must have one unique solution');
 assert.ok(p.clues>=25&&p.clues<=50,'Clue range must remain usable');
 for(let row=0;row<9;row++){
  const a=p.solution.slice(row*9,row*9+9);
  assert.equal(new Set(a).size,9,'Solved Sudoku row invalid');
  const b=Array.from({length:9},(_,i)=>p.solution[9*i+row]);
  assert.equal(new Set(b).size,9,'Solved Sudoku column invalid');
 }
 for(let boxr=0;boxr<9;boxr+=3)for(let boxc=0;boxc<9;boxc+=3){
  const values=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)
   values.push(p.solution[(boxr+r)*9+boxc+c]);
  assert.equal(new Set(values).size,9);
 }
 assert.ok(p.puzzle.every((v,i)=>v===0||v===p.solution[i]));
}
for(const w of f.FUN_CROSSWORD)assert.ok(w.word&&w.clue&&w.dir);
assert.match(EXTRA_FUN_UI_SCRIPT,/fun-daily-maxim/);
assert.match(EXTRA_FUN_UI_SCRIPT,/storage\.setItem\(key,'1'\)/,'Maxim only once per calendar date');
assert.match(EXTRA_FUN_UI_SCRIPT,/extraFunAstrology/);
assert.match(EXTRA_FUN_UI_SCRIPT,/extraFunZodiacWheel/);
assert.match(EXTRA_FUN_UI_SCRIPT,/funSolarAspect/);
assert.match(EXTRA_FUN_UI_SCRIPT,/extraFunSudoku/);
assert.match(EXTRA_TOOLS_SIX_NAV_SCRIPT,/if\(key\.startsWith\('fun-'\)\)return extraFunOpen\(key\)/);
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/grid-template-columns:minmax\(0,1fr\)!important/);
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/extra-tools-v2-artwork/);
assert.match(EXTRA_FUN_UI_STYLE,/extra-fun-sudoku/);
const html=await (await frontend.fetch(new Request('https://fun-ui-test.invalid/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'New tools must be injected into Android frontend');
assert.doesNotThrow(()=>new vm.Script(script),'Android frontend must compile');
for(const name of ['extraFunAstrology','extraFunMaxims','extraFunJokes','extraFunGames',
 'funSolarLongitude','funAscendantLongitude','funChineseZodiac','extraFunZodiacWheel','extraToolsV2Icon']){
 assert.ok(script.includes(name),'Missing in bundled frontend: '+name);
}
console.log('PASS: Tools illustrated single-column UX, astrology calculations, 4 fun screens, daily content, unique Sudoku and crossword');
