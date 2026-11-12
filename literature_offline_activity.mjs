// Authored, offline primary-school practice. The content is deliberately
// not presented as an official compulsory syllabus or AI generated response.
// Do not include copyrighted passages.
const COMMUNICATION_G1=Object.freeze({
 ro:{
 lesson:`# Ascultare, conversație și exprimare

Introducere
Când vorbim cu cineva, ascultăm până la capăt, apoi răspundem. Putem transmite idei prin cuvinte, gesturi și expresia feței.

Definiții
a. **Ascultarea** înseamnă să fim atenți la ceea ce spune o altă persoană, fără să o întrerupem.
b. **Conversația** este un schimb de replici între două sau mai multe persoane.
c. **Exprimarea** înseamnă să spunem clar ce gândim, simțim sau dorim.

Reguli de conversație
a. Îl privim pe cel care vorbește, când este potrivit.
b. Așteptăm să termine și nu vorbim în același timp.
c. Folosim formule de politețe: „Bună ziua”, „Te rog”, „Mulțumesc”.
d. Vorbim pe înțelesul celuilalt și punem întrebări dacă nu am înțeles.

Exemplu
Ana: „Bună, Matei! Vrei să citim împreună?”
Matei: „Da, cu plăcere! Ce poveste ai ales?”
Ana: „O poveste cu animale.”
Matei: „Mulțumesc! Aș vrea să o ascult.”

Ce am învățat
Ascultăm cu atenție, așteptăm rândul și ne exprimăm politicos. Repetă dialogul, apoi schimbă rolurile.`,
 examples:`# Exemple de comunicare

Exemplul 1. Salutul
a. Maria: „Bună dimineața!”
b. David: „Bună dimineața, Maria!”
c. Fiecare a ascultat și a răspuns politicos.

Exemplul 2. O rugăminte
a. „Te rog, îmi împrumuți un creion?”
b. „Sigur, poftim!”
c. „Mulțumesc!”

Exemplul 3. Ascultarea atentă
a. Învățătoarea spune: „Deschideți caietul.”
b. Copiii ascultă și deschid caietul.

Exemplul 4. Cererea unei explicații
a. „Nu am înțeles ultima propoziție. Poți repeta, te rog?”
b. „Sigur. Îți explic din nou.”

Exemplul 5. Prezentarea unei idei
a. „Eu cred că ar fi frumos să desenăm un copac.”
b. „Îmi place ideea. Eu pot colora frunzele.”

Observă cum fiecare exemplu folosește ascultarea, replicile și politețea.`,
 exercises:`# Exerciții — clasa I
Citește cerințele și răspunde singur. Soluțiile nu sunt afișate înainte de răspuns.

1. Scrie două formule de salut pe care le folosești la școală.
2. Ce spui atunci când primești ajutor de la un coleg?
3. Alcătuiește un dialog de patru replici între doi prieteni.
4. Spune ce ai face dacă un coleg vorbește și tu dorești să adaugi ceva.
5. Completează o rugăminte politicoasă: „___, îmi dai cartea?”
6. Povestește în două propoziții ce ai ascultat astăzi la școală.`,
 test:`# Test de antrenament — clasa I
Răspunde la fiecare cerință. Acesta nu este un test oficial.

1. Alege varianta potrivită când un coleg vorbește: a. îl întrerup; b. ascult până termină; c. vorbesc mai tare.
2. Scrie o formulă politicoasă prin care ceri ajutor.
3. Cum arăți că ai înțeles o explicație?
4. Scrie două replici ale unei conversații între tine și un prieten.
5. Corectează această replică pentru a o face politicoasă: „Dă-mi cartea!”
6. Explică într-o propoziție de ce este important să asculți.`
 },
 en:{
 lesson:`# Listening, conversation and expression

Introduction
We listen carefully when another person talks. We wait for our turn, then speak clearly.

Definitions
a. **Listening** means paying attention without interrupting.
b. **Conversation** is sharing words and ideas between people.
c. **Expression** means telling someone what we think, feel or need.

Good conversation
a. Listen until the speaker has finished.
b. Take turns to speak.
c. Use polite words: “Please” and “Thank you”.
d. Ask a question if something is unclear.

Example
Ana: “Hello, Matei! Shall we read together?”
Matei: “Yes, please. Which story?”
Ana: “An animal story.”
Matei: “Thank you! I would love to listen.”

Summary
Good listeners take turns, ask questions and speak kindly.`,
 examples:`# Examples of communication

Example 1. “Good morning!” — “Good morning!”
Example 2. “Please may I borrow your pencil?” — “Of course.” — “Thank you!”
Example 3. The teacher asks the class to open their books, and pupils listen.
Example 4. “I didn't understand. Could you repeat that, please?”
Example 5. “I think we can draw a tree.” — “Good idea! I'll draw the leaves.”`,
 exercises:`# Practice exercises — Year 1
1. Write two polite greetings.
2. What do you say when someone helps you?
3. Write a conversation of four short lines.
4. Explain how you wait for your turn.
5. Complete: “___, may I use your pencil?”
6. Tell a friend about something you listened to today.`,
 test:`# Practice test — Year 1
1. When someone speaks, do you: a. interrupt; b. listen; c. shout?
2. Write a polite request.
3. How do you show that you understand?
4. Write two lines of conversation.
5. Make “Give me the book!” more polite.
6. Why is listening important?`
 }
});
export function literatureOfflineActivity({topicKey='',title='',mode='lesson',grade='',language='ro',notes=null}={}){
 const key=String(topicKey||'').trim().toLowerCase();
 const kind=String(mode||'');
 if(!['lesson','examples','exercises','test'].includes(kind))return null;
 const lang=language==='ro'?'ro':'en';
 if(key==='communication'&&String(grade).trim()==='1')
  return {text:COMMUNICATION_G1[lang][kind],origin:'authored_local',topic:'communication'};
 const entry=Array.isArray(notes)&&notes.length===4?notes:null;
 if(!entry)return null;
 const first=lang==='ro'?entry[0]:entry[1];
 const example=lang==='ro'?entry[2]:entry[3];
 if(!first||!example)return null;
 const subject=String(title||key||'Lesson').trim();
 const titleLine='# '+subject;
 if(kind==='lesson')return {text:titleLine+'\n\n'+(lang==='ro'?'Noțiuni de bază':'Key ideas')+'\n'+first+'\n\n'+(lang==='ro'?'Exemplu explicat':'Worked example')+'\n'+example,origin:'authored_local',topic:key};
 if(kind==='examples')return {text:titleLine+'\n\n'+(lang==='ro'?'Exemplu explicat':'Worked example')+'\n'+example+'\n\n'+(lang==='ro'?'Reține':'Remember')+'\n'+first,origin:'authored_local',topic:key};
 const tasks=lang==='ro'?[
 'Explică în cuvintele tale ideea principală a lecției.',
 'Identifică două noțiuni importante din explicația afișată.',
 'Alcătuiește un exemplu propriu care ilustrează una dintre noțiuni.',
 'Compară exemplul tău cu exemplul explicat și observă o asemănare.',
 'Formulează o întrebare despre acest subiect și încearcă să răspunzi.',
 'Explică în două propoziții ce ai învățat.'
 ]:[
 'Explain the main idea of this lesson in your own words.',
 'Identify two key concepts in the explanation.',
 'Create an original example of one concept.',
 'Compare your example with the worked example.',
 'Write a question about this topic and try answering it.',
 'Summarise what you have learned in two sentences.'
 ];
 const heading=kind==='test'?(lang==='ro'?'Test de antrenament':'Practice test'):(lang==='ro'?'Exerciții':'Practice exercises');
 return {text:titleLine+'\n\n'+heading+'\n'+tasks.map((task,i)=>(i+1)+'. '+task).join('\n')+'\n\n'+
 (lang==='ro'?'Cerințe orientative; răspunsurile nu sunt afișate în această etapă.':'Advisory practice; no answers are shown at this stage.'),
 origin:'authored_local',topic:key};
}
