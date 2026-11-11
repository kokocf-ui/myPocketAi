import assert from 'node:assert/strict';
import {hasAssistantRepetitionLoop} from './ai_response_quality.mjs';
const bad='Înțeleg că ai nevoie de informații despre cum să începi și ce trebuie să faci pentru a crea un site web.';
assert.equal(hasAssistantRepetitionLoop([bad,bad,bad,bad].join('\n\n')),true,'four duplicated paragraphs are a loop');
assert.equal(hasAssistantRepetitionLoop([bad,bad,bad].join(' ')),true,'three duplicated sentences are a loop');
assert.equal(hasAssistantRepetitionLoop('Da, te pot ajuta să construiești un site web. Putem începe cu structura paginilor, apoi codul HTML, CSS și JavaScript. Îți pot explica cum îl testezi și publici.'),false,'useful concise answer passes');
assert.equal(hasAssistantRepetitionLoop('1. Creează o pagină HTML.\n2. Adaugă CSS.\n3. Testează site-ul pe telefon.'),false,'list passes');
assert.equal(hasAssistantRepetitionLoop('Atenție: verifică parola!'),false,'short text passes');
console.log('PASS: duplicate model phrases are rejected without altering normal replies');