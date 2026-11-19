import assert from 'node:assert/strict';
import {evaCreativeIntent,evaCreativeGuide,enhanceEvaCreativeOptions,evaCreativeQualityIssue} from './eva_creative_quality.mjs';
import {EVA_AI_MODELS,planEvaAI} from './eva_ai_orchestrator.mjs';

const positive=[
 ['Scrie o poveste pentru copii de 10 ani cu un mister și un final surprinzător.','story','children',false],
 ['Creează o poveste pentru adulți despre un violonist și o promisiune.','story','general',false],
 ['Compune o poezie despre dorul de casă.','poetry','general',false],
 ['Redactează un eseu despre rolul educației în societate.','essay','general',false],
 ['Pregătește-mi un discurs despre libertatea de exprimare.','speech','general',false],
 ['Scrie un documentar despre implicarea României în Al Doilea Război Mondial.','documentary','general',true],
 ['Generează un scenariu cu dialog și conflicte autentice.','script','general',false],
 ['Creează un text publicitar pentru un mic magazin local.','marketing','general',false],
 ['Write a story about a lighthouse keeper and a secret letter.','story','general',false]
];
for(const [message,kind,audience,factual] of positive){
 const got=evaCreativeIntent({module:'assistant',message});
 assert.equal(got.requested,true,message);
 assert.equal(got.kind,kind,message);
 assert.equal(got.audience,audience,message);
 assert.equal(got.factual,factual,message);
}
for(const message of [
 'Cum scriu o poveste pentru copii?',
 'Analizează povestea despre Decebal.',
 'Nu scrie o poveste, explică mai întâi ce s-a întâmplat.',
 'Caută documentare despre istoricul Daciei.',
 'Verifică prețurile autobuzelor spre Oradea.',
 'Rezolvă ecuația 2x+3=7.',
 'Unde găsesc povestea despre Decebal?'
]){
 assert.equal(evaCreativeIntent({module:'assistant',message}).requested,false,message);
}
const book=evaCreativeIntent({module:'creative_storybook',story_type:'documentary',
 story_seed:'Prezintă cronologic Decebal și Dacia, în trei capitole.'});
assert.equal(book.requested,true);
assert.equal(book.factual,true);
assert.equal(book.long,true);
assert.equal(planEvaAI({module:'creative_storybook',creativeIntent:book},{enabled:true}).model,EVA_AI_MODELS.deep);
const simple=evaCreativeIntent({module:'assistant',message:'Compune o poezie pentru prietena mea.'});
assert.equal(planEvaAI({module:'assistant',creativeIntent:simple},{enabled:true}).model,EVA_AI_MODELS.balanced);
const lesson=evaCreativeIntent({module:'education_study',education_activity:'lesson',message:'Descrie figurile de stil.'});
assert.equal(lesson.requested,false);
const essay=evaCreativeIntent({module:'education_study',education_activity:'essay',message:'Analizează textul dat.'});
assert.equal(essay.requested,true);
assert.equal(essay.factual,true);
assert.equal(planEvaAI({module:'education_study',creativeIntent:essay},{enabled:true}).model,EVA_AI_MODELS.deep);
assert.match(evaCreativeGuide(essay),/defensible thesis/);
assert.match(evaCreativeGuide(book),/NEVER|Never invent|Never/);
const original={messages:[{role:'system',content:'Speak Romanian.'},{role:'user',content:'Scrie o poveste.'}],
 max_tokens:120,temperature:0.18};
const result=enhanceEvaCreativeOptions({module:'assistant',message:positive[0][0]},original);
assert.equal(result.intent.kind,'story');
assert.ok(result.options.max_tokens>=1400);
assert.ok(result.options.temperature>=0.6);
assert.match(result.options.messages[0].content,/Build scenes/);
assert.equal(original.max_tokens,120,'Do not mutate original options');
assert.equal(original.messages[0].content,'Speak Romanian.');
const document=enhanceEvaCreativeOptions({module:'creative_storybook',story_type:'documentary',
 message:'documentar',story_seed:'Scrie documentar despre Decebal'},original);
assert.equal(document.intent.kind,'documentary');
assert.ok(document.options.max_tokens>=2300);
assert.equal(document.options.temperature,0.25);
const noChange=enhanceEvaCreativeOptions({module:'maps',message:'Cum ajung la stație?'},original);
assert.equal(noChange.options,original);
const repeated='Această scenă are detalii precise și legături care definesc acțiunea personajului.';
assert.equal(evaCreativeQualityIssue([repeated,repeated,repeated,repeated].join('\n\n'),result.intent),'repetition_loop');
assert.equal(evaCreativeQualityIssue('Mara a deschis ușa și a descoperit o scrisoare. '.repeat(6)+'Apoi a simțit',result.intent),'unfinished_ending');
assert.equal(evaCreativeQualityIssue('Mara a deschis ușa și a descoperit o scrisoare. '.repeat(6),result.intent),null);
assert.equal(evaCreativeQualityIssue('Vântul bate\nFerestrele plâng',simple),null,'Poetry does not require full stop');
console.log('PASS: Eva shared creative quality: genres, mature defaults, no false matches, model tiers and response checks');
