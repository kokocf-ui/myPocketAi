import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {BIOLOGY_TOPICS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
import {CHEMISTRY_DETAILED_LESSONS} from './chemistry_detailed_lessons.mjs';
import {scienceExtendedTheory,SCIENCE_CHAPTER_GUIDE_COUNT,SCIENCE_GUIDES} from './science_extended_theory.mjs';

assert.equal(SCIENCE_CHAPTER_GUIDE_COUNT,46,'all non-foundation core chapters have authored guidance');
const chapters={chemistry:CHEMISTRY_TOPICS,physics:PHYSICS_TOPICS,biology:BIOLOGY_TOPICS,astronomy:ASTRONOMY_TOPICS};
let checked=0;
for(const [subject,topics] of Object.entries(chapters)){
 for(const topic of topics){
  const lessons=THEORY_ENTRIES.filter(e=>e.subject===subject&&e.topic===topic.id);
  assert.ok(lessons.length>=3,subject+' '+topic.id+' must have content');
  assert.ok(SCIENCE_GUIDES[subject]?.[topic.id]||subject==='chemistry'&&topic.id==='fundamentals',
   subject+' '+topic.id+' missing its curated chapter explanation');
  for(const entry of lessons){
   const rich=subject==='chemistry'?CHEMISTRY_DETAILED_LESSONS[entry.id]:null;
   const expanded=scienceExtendedTheory(entry,topic.ro,rich);
   assert.ok(expanded.length>=430,entry.id+' theory is still too thin');
   assert.ok(expanded.includes(entry.statement)||rich,entry.id+' preserves original subject definition');
   assert.ok(expanded.includes('# '),entry.id+' uses real formatted headings');
   assert.ok(/Exemplu|EXEMPLU|exemplu/.test(expanded),entry.id+' includes a worked or conceptual example');
   checked++;
  }
 }
}
for(const [id,term] of [['chem-new-040','Polaritate'],['physics-units-0','Sistemul Internațional'],
 ['bio-core-cells-1','Teoria celulară'],['astro-solar-1','Soarele']]){
 const entry=THEORY_ENTRIES.find(x=>x.id===id);
 assert.ok(entry,id+' exists');
 const material=scienceExtendedTheory(entry);
 assert.ok(material.length>=900,id+' has a specific in-depth lesson');
 assert.ok(material.includes(term),id+' includes correct named concept');
}
const html=await(await frontend.fetch(new Request('https://science-compact.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const part of [
 'const SCIENCE_GUIDES=','const SCIENCE_FEATURED=','const SCIENCE_METHOD=',
 'const SCIENCE_THEORY_EXPAND=','SCIENCE_THEORY_EXPAND(item,',
 'function scienceOpenChemistrySection(stage)','scienceJourneyShowChoices(\'chemistry-menu\')',
 'actions.replaceChildren(symbolToggle,solve,method,symbolTray)',
 'toolbar.classList.add(\'science-icon-work-toolbar\')',
 "solve.textContent=learningLabel('Rezolvă','Solve')",
 'symbolTray'
])assert.ok(script.includes(part),part+' missing from served frontend');
assert.match(html,/\.science-icon-work-toolbar>button\{/,'microphone and read-aloud have uniform icon dimensions');
assert.match(html,/\.science-compact-actions\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/s,
 'symbols solve and method appear on one row');
assert.match(html,/\.science-compact-actions \.science-symbol-tray:not\(\[hidden\]\)\{[^}]*bottom:calc\(100% \+ 8px\)!important/s,
 'symbols open upward without growing the workspace');
assert.match(html,/\.science-compact-panel\{[^}]*height:auto!important/s,
 'menus shrink to their contents');
console.log('PASS compact Sciences: '+checked+' substantial core lessons; four featured lessons; icon row, action row, upward symbols and short panels');
