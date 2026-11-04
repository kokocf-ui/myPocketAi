import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const eventParserAt=source.indexOf('function eventRowsFromReply(');
const eventSourcesAt=source.indexOf('function sourceBackedEventRows(');
const finish=source.indexOf('// Culinary publishers',eventSourcesAt);
assert.ok(eventParserAt>=0&&eventSourcesAt>eventParserAt&&finish>eventSourcesAt);
const sandbox={Intl,Date,URL,console,Set,Map};vm.createContext(sandbox);
vm.runInContext(source.slice(eventParserAt,finish),sandbox);
const records=[
 {title:'Evenimente culturale în Bihor | noiembrie 2026',url:'https://example.org/calendar',snippets:['Concert Satoshi 7 noiembrie 2026 ... Formația Masterpiece cântă pe 7 noiembrie 2026'],publishedDate:'2026-11-04'},
 {title:'Concert Masterpiece în Oradea',url:'https://example.org/combined',snippets:['Masterpiece cântă în 7 noiembrie 2026 ... Satoshi cântă pe 12 noiembrie 2026'],publishedDate:'2026-11-04'},
 {title:'Festival IFESZT 2026 la Oradea: 10–21 noiembrie 2026',url:'https://example.org/festival',snippets:[],publishedDate:'2026-11-04'},
 {title:'Concert simfonic 12 noiembrie 2026 Oradea',url:'https://example.org/concert',snippets:[],publishedDate:'2026-11-04'},
 {title:'Bilete la concerte și evenimente Oradea 27 noiembrie 2026',url:'https://example.org/tickets',snippets:[],publishedDate:'2026-11-04'}
];
const out=sandbox.sourceBackedEventRows(records,'Ce evenimente au loc în Oradea în noiembrie 2026?','ro');
const rows=out.structured_list.rows;
assert.equal(rows.length,2,'Only distinct events with a date in their own headline are safe');
assert.match(rows[0].description,/IFESZT/);
assert.match(rows[1].description,/simfonic/);
assert.ok(rows.every(r=>!r.description.includes('...')&&!r.description.includes('<strong>')));
assert.equal(out.diagnostics.rejected_generic>=2,true);
console.log('Event source integrity: no concatenated calendar snippets, ranges sorted by start date PASS');
