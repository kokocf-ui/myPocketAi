import assert from 'node:assert/strict';
import {FUN_ASTRO_CORE_SCRIPT} from './extra_fun_core.mjs';
import {FUN_GENERATOR_SCRIPT} from './extra_fun_generator.mjs';
import {EXTRA_FUN_UI_SCRIPT,EXTRA_FUN_UI_STYLE} from './extra_fun_ui.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT} from './extra_tools_workspace.mjs';
const api=new Function(FUN_ASTRO_CORE_SCRIPT+FUN_GENERATOR_SCRIPT+
 'return {FUN_WORDS,funGeneratePuzzle,funDailyMaxim,funDailyJoke,funDailyForecast,funDayNumber,funLocalDateKey};')();
assert.ok(api.FUN_WORDS.length>=120,'Word bank should support varied Romanian puzzles');
assert.equal(new Set(api.FUN_WORDS.map(x=>x[0])).size,api.FUN_WORDS.length,'Word bank words must be unique');
for(const [word,clue] of api.FUN_WORDS){
 assert.match(word,/^[A-Z]+$/,'No accents in grid alphabet');
 assert.ok(clue.length>8,'Each crossword word must have a genuine clue');
}
for(const mode of ['rebus','integrame']){
 const shapes=new Set();
 for(let seed=1;seed<=14;seed++){
  const p=api.funGeneratePuzzle(mode,seed*9173);
  assert.equal(p.mode,mode);
  assert.ok(p.width>=5&&p.height>=5&&p.width<=11&&p.height<=11);
  assert.equal(p.grid.length,p.width*p.height);
  assert.equal(p.entries.length,20,'Default difficult level must contain twenty real clues');
  assert.ok(p.density>=(mode==='rebus'?.88:.72),'Generated grids must not have large dead black areas');
  assert.equal(p.grid.filter(x=>!x.letter&&!x.hint&&!x.bar&&!x.header).length,0,'Every square must be an answer, clue or purposeful separator');
  const occupied=new Map(),directions=new Set(),hints=new Set();
  for(const e of p.entries){
   assert.ok(e.word&&e.clue);
   directions.add(e.dir);
   for(let i=0;i<e.word.length;i++){
    const r=e.row+(e.dir==='down'?i:0),c=e.col+(e.dir==='across'?i:0);
    assert.ok(r>=0&&r<p.height&&c>=0&&c<p.width,'No out-of-bounds letter');
    assert.equal(p.grid[r*p.width+c].letter,e.word[i],'Every letter must match its answer');
    const key=r+','+c;if(occupied.has(key))assert.equal(occupied.get(key),e.word[i]);
    occupied.set(key,e.word[i]);
   }
   if(mode==='integrame'){
    assert.ok(Number.isInteger(e.hintRow)&&Number.isInteger(e.hintCol));
    assert.ok(e.hintRow>=0&&e.hintCol>=0&&e.hintRow<p.height&&e.hintCol<p.width);
    const h=p.grid[e.hintRow*p.width+e.hintCol].hint;
    assert.ok(h&&h.clue===e.clue&&h.dir===e.dir,'Definitions must be placed in grid and point to their answer');
    hints.add(e.hintRow+','+e.hintCol);
   }
  }
  assert.ok(directions.has('across')&&directions.has('down'));
  assert.ok(![...hints].some(k=>occupied.has(k)),'Clue cells and answers must never collide');
  shapes.add(p.entries.map(e=>e.word+':'+e.row+':'+e.col).join('|'));
 }
 assert.ok(shapes.size>=8,'Regenerate must produce new layouts, not cycle through 4 fixed puzzles');
}

const normalArrow=api.funGeneratePuzzle('integrame',2,'dificil');
const rotatedArrow=api.funGeneratePuzzle('integrame',3,'dificil');
assert.notEqual(normalArrow.width,rotatedArrow.width,'Arrowword clues must alternate orientation for visual variety');
for(const board of [normalArrow,rotatedArrow])for(const e of board.entries){
 const cell=board.grid[e.hintRow*board.width+e.hintCol];
 assert.equal(cell.hint?.dir,e.dir,'Arrow must lead toward the proper answer');
}
for(const mode of ['rebus','integrame']){
 const p=api.funGeneratePuzzle(mode,321,'mediu');
 assert.equal(p.entries.length,16,'Medium level must be less complex than difficult');
 assert.ok(p.density>=(mode==='rebus'?.88:.70));
}
const base=new Date(2026,10,24,12),maxims=new Set(),jokes=new Set();
for(let i=0;i<365;i++){
 const d=new Date(base);d.setDate(d.getDate()+i);
 const key=api.funLocalDateKey(d);
 maxims.add(api.funDailyMaxim(key));jokes.add(api.funDailyJoke(key));
}
assert.equal(maxims.size,36,'Vetted finite source-linked collection replaces fabricated combinations');
assert.equal(jokes.size,30,'Only complete coherent dialogues, not randomized question/punchline combinations');
const begin=new Date(2026,10,23,12),readings=new Set();
for(let i=0;i<31;i++){
 const d=new Date(begin);d.setDate(d.getDate()+i);
 const response=api.funDailyForecast(4,api.funLocalDateKey(d),false);
 assert.equal(response.length,2);
 readings.add(response.join('|'));
}
assert.ok(readings.size>=26,'Daily/monthly sections must not be identical between dates');
assert.match(EXTRA_FUN_UI_SCRIPT,/funGeneratePuzzle\(mode,funPuzzleSeed\(\),difficulty\)/);
assert.match(EXTRA_FUN_UI_SCRIPT,/funDailyMaxim\(today\)/);
assert.match(EXTRA_FUN_UI_SCRIPT,/funDailyJoke\(today\)/);
assert.match(EXTRA_FUN_UI_SCRIPT,/funDailyForecast\(idx,dateKey,humor\)/);
assert.match(EXTRA_FUN_UI_SCRIPT,/funDailyMaxim\(key\)/);
assert.match(EXTRA_FUN_UI_SCRIPT,/extraFunMaximMeaning/);
assert.match(EXTRA_FUN_UI_SCRIPT,/extra-fun-in-grid-clue/);
assert.match(EXTRA_FUN_UI_SCRIPT,/Generează alt careu/);
assert.match(EXTRA_FUN_UI_STYLE,/#155b59/,'Entertainment buttons should match Transport teal');
assert.match(EXTRA_FUN_UI_STYLE,/#112f43/,'Data-entry fields must keep the dark blue input style');
assert.doesNotMatch(EXTRA_FUN_UI_SCRIPT,/Explică bancul/,'Do not explain jokes');
assert.doesNotMatch(EXTRA_FUN_UI_SCRIPT,/nu se opresc după 12/,'Do not display internal collection counts');
assert.match(EXTRA_FUN_UI_SCRIPT,/extra-fun-jokes-archive/,'Joke collection must be visible within its own modal');
assert.match(EXTRA_FUN_UI_STYLE,/extra-fun-short-button/);
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes('function funGeneratePuzzle'));
console.log('PASS generated Romanian rebus and arrowword puzzles, continuous daily maxims/jokes, day-specific horoscopes and compact green controls');
