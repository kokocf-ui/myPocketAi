import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {LIT_SEVEN_COUNTRY_PROGRAMS,LIT_SEVEN_COUNTRY_META} from './literature_seven_country_tracks.mjs';
import {LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EUROPEAN_UI_LOCALES,EUROPEAN_LANGUAGE_LABELS} from './european_app_locales.mjs';
import {POCKET_LANGUAGES,pocketLanguageFromCountry} from './language_first_install.mjs';

const expected={MD:'ro',PL:'pl',HR:'hr',RS:'sr',HU:'hu',AT:'de',TR:'tr'};
assert.deepEqual(Object.keys(LIT_SEVEN_COUNTRY_PROGRAMS).sort(),Object.keys(expected).sort());
for(const [country,language] of Object.entries(expected)){
 const national=LIT_SEVEN_COUNTRY_PROGRAMS[country];
 const merged=LIT_EU_PROGRAMS[country];
 assert.equal(national,merged,country+' national pack must be used by production renderer');
 assert.equal(LIT_SEVEN_COUNTRY_META[country].language,language);
 assert.ok(national.source.startsWith('https://'),country+' authoritative source');
 assert.ok(national.note.length>90,country+' scope and reform limitations');
 assert.ok(national.tracks.length>=2,country+' selectable school track/alphabet');
 assert.equal(pocketLanguageFromCountry(country,'en-GB'),language,country+' native auto-language');
 for(const stage of ['beginner','lower','medium']){
  const grades=worldwideSchoolYears(country,stage,'literature');
  assert.ok(grades.length>=3,country+' '+stage+' school years must be mapped');
  assert.equal(grades.length,national.grades[stage].length,country+' '+stage+' grade counts differ');
  for(const row of grades){
   assert.ok(national.byGrade[row.id],country+' missing actual chapter route for '+row.id);
   const planned=litEuropeanPlan(country,stage,row.id,national.tracks[0][0]);
   const frameworkVerified=(country==='PL'&&stage==='beginner'&&['I','IV'].includes(row.id));
   assert.equal(planned.verified,frameworkVerified,'Verify only documented national framework and grade');
   assert.ok(planned.note.includes('program')||planned.note.length>90,'Advisory national grade sequence must be explained');
   assert.ok(planned.units.length>=13,country+' '+row.id+' has only '+planned.units.length+' study units');
   assert.ok(planned.units.filter(x=>x.id.startsWith(country.toLowerCase()+'-')).every(x=>x.focus.length>=85),country+' '+row.id+' country-specific unit focus not teachable');
   assert.equal(new Set(planned.units.map(x=>x.label)).size,planned.units.length,country+' duplicate unit title');
   assert.ok(planned.units.some(x=>x.topic==='authors')&&planned.units.some(x=>x.topic==='essay'),
    country+' missing reading or essay units');
  }
 }
}
for(const code of ['hr','sr','hu','tr','cs','sk','sl','bg','el','fi','sv','no','da','is','et','lv','lt','uk','bs','mk','sq','be','ca','ga','cy','mt']){
 assert.ok(POCKET_LANGUAGES.includes(code),'Missing UI language '+code);
 assert.ok(EUROPEAN_UI_LOCALES[code].homeTitle,'Untranslated home '+code);
 assert.ok(EUROPEAN_LANGUAGE_LABELS[code],'Missing selector label '+code);
}
assert.equal(POCKET_LANGUAGES.length,36);
const gateFactory=new Function('HG_COUNTRY_PICKER_DATA','state',EDUCATION_COUNTRY_UI_SCRIPT+';return eduCountryOptions;');
const countries=gateFactory(
 [{id:'OM',ro:'Oman',en:'Oman'},{id:'RO'},{id:'MD'},{id:'PL'},{id:'HR'},
  {id:'RS'},{id:'HU'},{id:'AT'},{id:'TR'},{id:'GB-ENG'},{id:'OTHER'}],{language:'ro'})().map(x=>x.id);
assert.ok(!countries.includes('OM'),'Oman must not be in the European Education selection');
assert.ok(!countries.includes('OTHER'),'Generic Other option is not a jurisdiction');
for(const country of [...Object.keys(expected),'GB-ENG','RO'])assert.ok(countries.includes(country),'Missing European country '+country);

const html=await(await app.fetch(new Request('https://europe-languages.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend boot script');
new vm.Script(script,{filename:'european-language-literature-ui.js'});
assert.match(script,/const EUROPEAN_UI_TEXT=/,'European locales are rendered');
assert.match(script,/LIT_BRANCHES=\[\{id:'program'/,'Grade programme visible in Literature menu');
assert.match(script,/litNeedsTrack\(\)\?'tracks'/,'Seven systems choose school tracks');
for(const lang of ['hr','sr','hu','tr'])assert.ok(html.includes('<option value="'+lang+'">'),'UI language dropdown missing '+lang);
const native=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
for(const lang of ['hr','sr','hu','tr'])assert.ok(native.includes('case "'+lang+'":'),'Native locale missing '+lang);
console.log('PASS seven EU national literature courses (all grade ranges), 36 UI locales, Europe-only school picker and study flow');
