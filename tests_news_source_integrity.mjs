import assert from 'node:assert/strict';
import {detectActualNewsLanguage,validateNewsArticleLead,languageCoverage} from './news_source_integrity.mjs';

const languages=[
 ['fa','ایران اعلام کرد که مذاکرات برای توافق جدید ادامه دارد'],
 ['ar','أعلنت الوزارة عن استمرار المفاوضات في المنطقة'],
 ['uk','Україна повідомила про нову зустріч уряду у Києві'],
 ['ru','России сообщили о новых переговорах с Украиной сегодня'],
 ['fr','La France annonce de nouvelles mesures pour la sécurité'],
 ['de','Deutschland und Frankreich beraten über neue Sanktionen'],
 ['en','The United States announces new measures after talks']
];
for(const [expected,headline] of languages)
 assert.equal(detectActualNewsLanguage(headline),expected,expected+' must be grounded in source headline');
assert.equal(detectActualNewsLanguage('Washington allocates millions for Iran nuclear information'),'en');
assert.notEqual(detectActualNewsLanguage('United States conducts limited attacks against Iran'),'fa');
assert.equal(detectActualNewsLanguage('Statele Unite anunță măsuri noi după discuții cu Iranul'),null);

const reject=[
 ['News and current affairs from Germany and around the world','https://www.dw.com/en/top-stories/s-9097'],
 ['Nu am primit niciun text de la tine. Vrei să îl introduci?','https://apnews.com/article/prompt-text'],
 ['Live World Map 2026 — Real-Time Conflicts, Disasters & Global Events','https://the-world-now.com/live-world-map-2026'],
 ['Стрічка новин онлайн – всі новини про останні події в Україні та світі | Цензор.НЕТ','https://censor.net/ua/news/all'],
 ['Noutăți din lume: Cele mai importante știri din lume de azi | AP News','https://apnews.com/hub/world-news'],
 ['Actualizare Economică Globală Săptămânală | Deloitte Insights','https://www.deloitte.com/insights/weekly-global-economic-update'],
 ['Cele mai importante evenimente','https://example.org/news']
];
for(const [title,url] of reject)
 assert.equal(validateNewsArticleLead({title,url}).valid,false,'not a source-backed individual news article: '+title);
assert.equal(validateNewsArticleLead({title:'Parlamentul francez anunță o nouă rundă de negocieri',url:'https://example.org/2026/11/07/negocieri-parlament',summary:'Parlamentul a votat pentru continuarea discuțiilor.'}).valid,true);
const rows=[{source_language:'fa'},{source_language:'en'},{source_language:'ar'}];
assert.deepEqual(languageCoverage(rows,['fa','uk','ru']).missing,['uk','ru']);
assert.deepEqual(languageCoverage(rows,['fa','en','ar']).missing,[]);
console.log('PASS T2-T6 source language truth, article-only selection, false page and error rejection');
