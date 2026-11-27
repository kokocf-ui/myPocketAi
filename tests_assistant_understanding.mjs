import assert from 'node:assert/strict';
import {assistantUnderstandRequest as understand,assistantRepeatsRecentReply as repeats,assistantVariationRequested as varies} from './assistant_understanding.mjs';
import {assistantJourneyHandoff} from './assistant_bare_destination.mjs';
const negatives=[
 'Am o idee','Haz de necaz','Răbdare și curaj','Neuroplasticitate','Caută idei pentru un cadou','Găsește o soluție la problema mea',
 'Explică-mi cum aleg un restaurant bun','Ce înseamnă adresa IP?','Nu caut un restaurant lângă mine, vorbeam despre o glumă',
 'Nu vreau o adresă, explică-mi expresia','Traseu profesional','Calea spre succes','Drumul vieții','De la idee la proiect',
 'De la teorie la practică','Cum funcționează distanța focală?','Spune-mi un banc despre un hotel','Scrie o poveste despre o gară',
 'Alt exemplu, te rog','Nu asta am cerut','Reformulează răspunsul despre Londra','Ajută-mă să înțeleg ce simt',
 'Find ideas for a birthday','Explain how route handlers work','Tell me about a career path','Another example','Cum să gestionez stresul?',
 'Caută','Caută ceva','Vreau altceva','Where does courage come from?'
];
for(const t of negatives){assert.equal(understand(t).allowImplicitLocation,false,t);assert.equal(assistantJourneyHandoff(t),null,t)}
for(const t of ['Unde sunt acum?','Pe ce stradă sunt?','Unde este Lidl?','Caută restaurante în apropierea mea','Vreau un hotel în Oradea','Lidl','Victoria Station','Oxford Street, London','Farmacii','Find hotels near me','Weather in Frankfurt','Cum e vremea azi?','Pe jos','Ce magazine găsești în jurul meu?','Wo ist der Bahnhof?','Où suis-je?'])assert.equal(understand(t).allowImplicitLocation,true,t);
for(const t of ['Cum ajung la gară?','Strada Libertății, Oradea','London to Paris'])assert.ok(assistantJourneyHandoff(t),t);
const old='Poți începe cu un plan simplu: scrie obiectivul, împarte-l în pași și verifică progresul la finalul zilei.';
const history=[{role:'user',content:'Dă-mi idei pentru organizare'},{role:'assistant',content:old}];
assert.equal(repeats(old,history,'Alt exemplu, te rog'),true);
assert.equal(repeats('Încearcă o cutie de intrare pentru toate sarcinile. La ora 18:00 alege doar trei lucruri pentru mâine.',history,'Alt exemplu, te rog'),false);
assert.equal(repeats(old,history,'Repetă exact, cuvânt cu cuvânt'),false);
assert.equal(varies('Cât face 2+2?',history),false);assert.equal(repeats('Paris.',[{role:'assistant',content:'Paris.'}],'Alt răspuns'),false,'Do not force different facts');
console.log('PASS conservative shared understanding: 30 non-place turns, 16 positive geo requests, explicit handoffs, cross-turn variation without changing short factual answers.');
