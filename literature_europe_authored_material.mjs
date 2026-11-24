// Offline, original lesson bodies for the 50-system literature year sequence.
// Never attribute the practice examples to a named writer or reproduce a book.
// Other UI languages continue through the existing translation/AI route.
import {literatureEuropeanPractice} from './literature_europe_practice.mjs';
export function literatureEuropeanAuthoredMaterial({
 topicKey='',title='',focus='',grade='',language='ro',mode='lesson'
}={}){
 const key=String(topicKey||'');
 if(!key.startsWith('eu-year-')||!['lesson','examples','exercises','test'].includes(mode))return null;
 const part=(key.match(/-(parcurs|intelegere|narativ|poezie|dialog|vocabular|exprimare|redactare|interpretare|verificare)(?:-\d+)?$/)||[])[1];
 const stage=(key.match(/-(beginner|lower|medium|advanced)-/)||[])[1];
 if(!part||!stage||!['ro','en'].includes(language))return null;
 const ro=language==='ro',g=String(grade||'');
 const years=stage==='beginner'?(ro?'primar':'primary'):stage==='lower'?(ro?'gimnazial':'lower secondary'):
  stage==='medium'?(ro?'liceal':'upper secondary'):(ro?'universitar':'university');
 const practice=literatureEuropeanPractice(part,language,stage);
 if(!practice)return null;
 const sample=practice.sample;

 // Young pupils need short concrete sentences, not the academic template.
 // The same safety applies to every European system, not only Romania.
 if(stage==='beginner'){
  const primary={
   parcurs:['Ascult o poveste, o citesc și spun ce am înțeles. Încep cu lucruri simple și învăț câte puțin.','Listen to a story, read it and tell someone what happened. Start with small steps.'],
   intelegere:['Într-o poveste aflăm cine apare, unde este și ce face. Citim încet, apoi răspundem la întrebări.','A story tells us who is there, where they are and what they do. Read slowly and answer questions.'],
   narativ:['O poveste are un început, întâmplări și un final. Punem faptele în ordinea corectă.','A story has a beginning, events and an ending. Put the events in order.'],
   poezie:['O poezie poate avea rânduri scurte numite versuri. Unele cuvinte rimează. Ne jucăm cu sunetele.','A poem can have short lines called verses. Some words rhyme. Listen to the sounds.'],
   dialog:['Când două persoane vorbesc una cu alta, avem un dialog. Citim pe rând ce spune fiecare.','When two people speak to each other, that is a dialogue. Take turns reading each line.'],
   vocabular:['Când găsim un cuvânt nou, îl explicăm cu alte cuvinte simple. Îl folosim apoi într-o propoziție.','When you find a new word, explain it in simple words and try it in a sentence.'],
   exprimare:['O propoziție spune ceva. În scris, începem cu literă mare și punem semnul potrivit la final.','A sentence tells us something. Start with a capital letter and finish with the right mark.'],
   redactare:['Înainte să scriu, mă gândesc ce vreau să spun. Scriu propoziții scurte și le citesc încă o dată.','Before writing, think about what to say. Write short sentences and read them again.'],
   interpretare:['După ce citesc o poveste, pot spune ce mi-a plăcut și de ce. Dau un exemplu din poveste.','After a story, say what you liked and why. Give one detail from the story.'],
   verificare:['Citesc, răspund și verific. Dacă nu știu, mai citesc o dată. Învăț și din greșeli.','Read, answer and check. If you do not know, read once more. Mistakes can help you learn.']
  };
  const explanation=primary[part]?.[ro?0:1]||primary.intelegere[ro?0:1];
  const example=practice.sample;
  const year=String(grade||'');
  const questions=practice.questions;
  const shortTask=questions[0];
  const header=String(title||part),yearLine=ro?
   'Clasa / anul: '+year+'. Exemplu original în limba română, orientativ; nu este probă oficială.':
   'Class / year: '+year+'. Original example in English for practice, not an official examination.';
  const reminder=ro?'Nu trebuie să folosești cuvinte grele. Important este să înțelegi și să explici cu vocea ta.':
   'You do not need difficult words. What matters is understanding the story and saying it in your own words.';
  const next=ro?'Mai întâi citesc exemplul. Apoi răspund. La sfârșit recitesc pentru a verifica.':
   'First read the example. Then answer. At the end read it again and check.';
  const list=questions.map((q,i)=>(i+1)+'. '+q).join('\n');
  let body='';
  if(mode==='lesson')body='# '+header+'\n\n'+yearLine+'\n\n'+
   (ro?'## Ce învățăm':'## What we learn')+'\n'+explanation+'\n\n'+
   (ro?'## Exemplu original':'## Original example')+'\n'+example+'\n'+practice.worked+'\n\n'+
   (ro?'## Încerc și eu':'## Your turn')+'\n'+shortTask+'\n\n'+
   (ro?'## Pașii mei':'## My steps')+'\n'+next+'\n'+reminder+'\n\n'+
   (ro?'## Greșeli de evitat':'## Common mistakes')+'\n'+
   (ro?'Dacă nu îmi amintesc o întâmplare, nu o inventez. Revin la propoziție și o citesc încă o dată.':
    'If you cannot remember an event, do not invent it. Read the sentence again.');
  else if(mode==='examples')body='# '+header+'\n\n'+yearLine+'\n\n'+
   (ro?'## Exemplu original':'## Original example')+'\n'+example+'\n\n'+
   (ro?'## Explicație':'## Explanation')+'\n'+practice.worked+'\n'+explanation+'\n\n'+
   (ro?'## Încearcă și tu':'## Your turn')+'\n'+questions.slice(0,3).map((q,i)=>(i+1)+'. '+q).join('\n')+
   '\n\n'+reminder+'\n'+next;
  else body='# '+header+'\n\n'+yearLine+'\n\n'+
   (mode==='test'?(ro?'## Test de antrenament':'## Practice test'):
    (ro?'## Exerciții':'## Exercises'))+'\n'+example+'\n\n'+list+'\n\n'+
   reminder+'\n'+next+'\n'+(ro?'Răspunsurile se verifică după exercițiu.':'Check the answers after the exercise.');
  // Keep a substantive self-contained activity but avoid padding with
  // irrelevant academic terminology.
  if(body.length<510)body+='\n\n'+explanation+'\n'+reminder+'\n'+next;
  return {text:body,topic:key,origin:'authored_european_grade'};
 }

 const goal=ro?(String(focus).match(/Obiectivul lecției: (.*?)\. Rezultat observabil:/)||[])[1]||'învățare progresivă':
  (stage==='beginner'?'clear reading, speaking and writing':stage==='lower'?'evidence-based interpretation of varied texts':
   stage==='medium'?'critical reading, comparison and sustained writing':'source-based critical literary research');
 const target=ro?(String(focus).match(/Rezultat observabil: (.*?)\. /)||[])[1]||'rezolvare independentă':
  'explain an interpretation, support it with evidence and revise a written answer';
 const bank={
  parcurs:{
   ro:['Un parcurs de literatură se construiește pornind de la citire, înțelegere și exprimarea propriilor idei. În această clasă urmărim o competență nouă, fără să repetăm automat lecțiile din anul precedent.',
    'Citește fragmentul cu atenție. Precizează despre cine este vorba, ce se întâmplă și ce cuvinte susțin răspunsul. Pentru clasele mari adaugă perspectiva naratorului și o interpretare alternativă.',
    'Nu confunda un obiectiv de învățare cu o listă obligatorie de opere. O operă este studiată numai când elevul a ales-o sau când există referința curriculară verificată.'],
   en:['A literature course develops reading, comprehension, expression and interpretation. This school year adds new skills instead of recycling the same introductory course.',
    'Read the passage carefully. Identify the participants, events and precise textual evidence. Older learners should also examine narrative perspective and alternative interpretations.',
    'A learning objective is not a compulsory reading list. A work is examined only when selected or when the applicable curriculum identifies it.']
  },
  intelegere:{
   ro:['Înțelegerea unui text presupune recunoașterea informațiilor scrise direct și deducerea ideilor pe care autorul le sugerează. O inferență trebuie justificată; nu este o ghicitoare.',
    'Citește întâi integral, apoi subliniază cuvintele-cheie. Formulează întrebări despre cine, unde, când și de ce. Dovada este o expresie sau un fapt din fragment, nu o impresie fără suport.',
    'Greșeala frecventă este confundarea opiniei personale cu ideea afirmată de text. Verifică fiecare răspuns recitind fragmentul.'],
   en:['Reading comprehension means recognising explicit information and making supported inferences. An inference is reasoned from evidence, not guessed.',
    'Read once for the overall meaning and again for key words. Ask who, where, when, how and why; quote or paraphrase a specific detail to support a response.',
    'A common error is treating a personal opinion as if the passage stated it. Check every answer against what the passage actually says.']
  },
  narativ:{
   ro:['Textul narativ prezintă o succesiune de întâmplări. Urmărim situația inițială, schimbarea sau conflictul, deciziile personajelor și deznodământul, dacă acesta este prezent.',
    'Naratorul este vocea care povestește, nu neapărat autorul. Analizează ce știe naratorul și ce rămâne necunoscut; în gimnaziu și liceu explică efectul perspectivei asupra cititorului.',
    'O caracterizare bună pornește de la fapte, replici și relații, nu de la adjective inventate despre personaj.'],
   en:['Narrative writing presents events in an order. Trace the initial situation, change or conflict, characters’ decisions and the ending if one is supplied.',
    'The narrator is the voice telling the story, not automatically the author. Examine what this voice knows and how its perspective shapes the reader’s understanding.',
    'Character analysis must be based on actions, dialogue and relationships rather than unsupported personality labels.']
  },
  poezie:{
   ro:['Poezia organizează limbajul prin ritm, imagini, sunete și asocieri de sens. Versul și strofa pot fi observate fără a obliga copilul să memoreze definiții prea avansate.',
    'Începe cu emoția sau imaginea centrală și explică de ce un cuvânt este expresiv. La clasele mari compară sensul literal cu cel figurat și discută perspectiva eului liric.',
    'Nu numi automat orice expresie metaforă și nu inventa versuri ale unui poet real. Citează numai textul efectiv consultat.'],
   en:['Poetry shapes language through rhythm, sound, imagery and associations. Younger pupils begin with the feelings and pictures created by words.',
    'Explain why a specific word or image matters. Older students distinguish literal and figurative meaning and consider the voice or speaker of a poem.',
    'Do not label every phrase a metaphor or invent quotations by a real poet. Refer only to text that is actually available.']
  },
  dialog:{
   ro:['Dialogul este un schimb de replici. Într-un text literar, o replică poate dezvălui intențiile unui personaj, relația cu ceilalți sau schimbarea conflictului.',
    'Citește replicile cu intonația potrivită, identifică întrebarea și răspunsul și explică de ce o formulare este politicoasă, ironică ori tensionată, dacă fragmentul permite.',
    'Nu trage concluzii despre caracterul unui personaj dintr-un singur cuvânt rupt din context. Încearcă și o scurtă dramatizare originală.'],
   en:['Dialogue is an exchange of speech. In literature a line can reveal an intention, a relationship or a change in the conflict.',
    'Read the exchange with suitable intonation. Identify questions, answers and any contrast in tone; explain your choice using the surrounding lines.',
    'Avoid judging a character from a single isolated word. Try an original two-person role-play to test your interpretation.']
  },
  vocabular:{
   ro:['Sensul unui cuvânt depinde uneori de context. Sinonimele pot fi apropiate, nu perfect interschimbabile; registrul unui cuvânt trebuie potrivit situației.',
    'Selectează un cuvânt din fragment, explică-l printr-o propoziție proprie și înlocuiește-l cu o variantă apropiată. Compară dacă sensul sau tonul se modifică.',
    'Nu învăța liste de cuvinte fără să le folosești. Pentru clasele mai mari compară conotațiile și efectul alegerii lexicale.'],
   en:['The meaning of a word may depend on context. Synonyms are often close rather than completely interchangeable, and register depends on the audience.',
    'Choose a word in the passage, explain it in your own sentence and try a near-synonym. Decide whether the meaning or tone has shifted.',
    'Memorising isolated word lists is insufficient. Older students should discuss connotation and the effects of lexical choices.']
  },
  exprimare:{
   ro:['O propoziție clară transmite o idee completă și folosește structuri adecvate vârstei. Scrierea corectă include ortografie, punctuație și acord, în măsura cerută de clasa aleasă.',
    'Rescrie o propoziție din fragment și verifică subiectul, acțiunea, ordinea cuvintelor și semnul de punctuație. La liceu observă și efectele sintaxei asupra stilului.',
    'Nu aplica reguli de gramatică ale limbii române ca și cum ar fi identice în toate limbile. Exemplul se adaptează limbii de studiu.'],
   en:['Clear sentences express complete ideas using patterns appropriate to the learner. Accuracy includes relevant spelling, punctuation and grammatical agreement.',
    'Rewrite a sentence and examine its subject, verb, word order and punctuation. At upper levels discuss how sentence structure affects style.',
    'Grammar rules vary between languages. Use the applicable language of instruction rather than treating one national grammar as universal.']
  },
  redactare:{
   ro:['Un text scris are scop, destinatar și ordine logică. Înainte de redactare stabilește ideea centrală și un plan scurt; după redactare revizuiește, nu doar corecta literele.',
    'În primar construim enunțuri și paragrafe scurte. În gimnaziu folosim început, dezvoltare și încheiere. La liceu formulăm o teză, argumente, dovezi și concluzie.',
    'Evită umplerea paginii cu aceeași idee. O explicație sau un exemplu nou trebuie să aducă informație suplimentară.'],
   en:['Every piece of writing has a purpose, audience and logical structure. Before drafting, choose a main idea and a brief plan; afterwards revise meaning and organisation.',
    'Young learners write clear sentences and short paragraphs. Older learners build introductions, developed arguments, textual evidence and conclusions.',
    'Repeating the same claim does not add depth. Each new example or explanation should advance the answer.']
  },
  interpretare:{
   ro:['Interpretarea înseamnă explicarea felului în care detalii ale textului susțin un sens posibil. Ea nu se confundă cu rezumatul, care prezintă doar întâmplările.',
    'Formulează o idee, oferă o dovadă și explică legătura dintre ele. Pentru comparație, identifică o asemănare și o deosebire precise între două texte disponibile.',
    'Nu prezenta interpretarea ca adevăr unic. Dacă un argument nu poate fi susținut din text, marchează-l drept ipoteză.'],
   en:['Interpretation explains how textual details support a plausible meaning. It differs from summary, which primarily recounts events.',
    'State a point, give specific evidence and explain the connection. In a comparison identify one similarity and one precise difference.',
    'Do not present one reading as the only possible truth. Unsupported claims should be qualified as hypotheses.']
  },
  verificare:{
   ro:['Evaluarea verifică ceea ce poți face singur: citești, explici, compari, redactezi și corectezi. Cerințele trebuie să fie potrivite anului, nu doar să repete definiții.',
    'Reia fragmentul, formulează răspunsuri folosind informații exacte și justifică alegerea. Verifică apoi dacă ai răspuns tuturor părților cerinței.',
    'Testele din acest atelier sunt originale, de antrenament. Nu sunt probe oficiale și nici bareme atribuite unui minister.'],
   en:['Assessment checks independent reading, explanation, comparison, writing and revision. It should evaluate skills rather than only memorised definitions.',
    'Return to the sample, answer with exact details and explain your choices. Check that each part of the task has been addressed.',
    'These are original practice activities, not official examination papers or ministry mark schemes.']
  }
 };
 const section=bank[part],words=section[ro?'ro':'en'];
 const heading=String(title||part),intro=ro?
  'Lecție orientativă originală · nivel '+years+' · clasa/anul '+g+'. Exemplul este în română și nu este o probă oficială.':
  'Original advisory lesson · '+years+' · school year '+g+'. The example is in English and is not an official examination.';
 const objective=(ro?'Obiectiv de învățare: ':'Learning objective: ')+goal+'.';
 const result=(ro?'La final pot: ':'By the end I can: ')+target+'.';
 const analyse=practice.worked+' '+(ro?
  'Fragment original creat pentru exercițiu, fără atribuire unei opere sau unui autor real.':
  'An original practice passage, not attributed to a real book or writer.');
 const checks=practice.questions;
 const exerciseHeader=mode==='test'?(ro?'# Test de antrenament':'# Practice test'):
  (ro?'# Exerciții de aplicare':'# Applied exercises');
 const exercises=checks.map((q,i)=>(i+1)+'. '+q).join('\n');
 const passage=(ro?'Fragment original':'Original practice passage')+'\n'+sample;
 let text='';
 if(mode==='lesson'){
  text='# '+heading+'\n\n'+intro+'\n\n'+objective+'\n'+result+'\n\n'+
   (ro?'## Noțiuni explicate':'## Explained concepts')+'\n'+words[0]+'\n\n'+
   (ro?'## Cum lucrez cu textul':'## How to study the passage')+'\n'+words[1]+'\n\n'+
   (ro?'## Exemplu explicat':'## Worked example')+'\n'+passage+'\n'+analyse+'\n\n'+
   (ro?'## Greșeli de evitat':'## Common mistakes')+'\n'+words[2]+'\n\n'+
   (ro?'## Verificare rapidă':'## Quick check')+'\n'+checks.slice(0,3).map((q,i)=>(i+1)+'. '+q).join('\n');
 }else if(mode==='examples'){
  text='# '+heading+'\n\n'+intro+'\n\n'+passage+'\n\n'+
   (ro?'## Exemplu explicat':'## Worked example')+'\n'+analyse+'\n\n'+
   (ro?'## Metodă':'## Method')+'\n'+words[1]+'\n\n'+
   (ro?'## De evitat':'## Avoid')+'\n'+words[2]+'\n\n'+result;
 }else{
  text='# '+heading+'\n\n'+intro+'\n\n'+exerciseHeader+'\n'+passage+'\n\n'+
   objective+'\n\n'+exercises+'\n\n'+
   (ro?'Nu sunt afișate soluțiile înainte de răspuns.':'Answers are not displayed before the learner responds.');
 }
 return {text,topic:key,origin:'authored_european_grade'};
}
