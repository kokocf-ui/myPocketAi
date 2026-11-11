// Eva's conversation gate. Separate speech acts from location, research,
// curricular and route commands before the backend starts any provider lookup.
// This module does not generate canned replies: the model composes the dialogue.
export function normalizeEvaUtterance(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[’'‘“”"!?.,;:()[\]{}–—-]+/g,' ')
  .replace(/\s+/g,' ').trim();
}

const taskStart=/^(?:cum (?:ajung|merg|se ajunge|se prepara|se face)|unde (?:este|e|gasesc|pot gasi)|care (?:este|e|sunt) (?:capitala|pretul|populatia|vremea|prognoza)|ce (?:este|inseamna|sunt|stii despre)|cat (?:costa|este|e|dureaza)|(?:vreau|as vrea|doresc|trebuie) sa (?:ajung|merg|calatoresc|caut|gasesc|vad|vizitez|cumpar)|(?:cauta|gaseste|arata|verifica|calculeaza|rezolva|tradu|explica|descrie|prezinta|recomanda|navigheaza|fa mi|da mi|spune mi)(?:\s|$)|(?:poti|ai putea|te rog) (?:sa )?(?:(?:mi|imi|ne) )?(?:cauta|cauti|gasi|gasesti|arata|arati|calcula|calculezi|explica|explici|verifica|verifici|traduce|traduci|rezolva|rezolvi)|(?:take me to|directions to|how (?:do|can) i get to|where (?:is|can i find)|find|search for|show me|explain|translate|calculate|what is|what are|tell me about|i want to go to|recommend))\b/;
const locationWords=/\b(?:traseu|ruta|transport|metrou|tren|autobuz|gara|statie|station|underground|airport|aeroport|hotel|restaurant|farmacie|pharmacy|weather|vreme|prognoza|pana la|nearby|near me)\b/;
const personalQuestion=/\b(?:cum te cheama|cum te numesti|cine esti|ce fel de asistenta esti|ce nume ai|what s your name|who are you|tell me your name)\b/;
const socialCue=/\b(?:frumoaso|frumusete|draguto|draga|obraznic\w*|glumesc|glumeam|gluma|tachin\w*|supar\w*|impac\w*|prostie|prostii|contrazici|conving\w*|convins|convingatoare|natural\w*|robotic\w*|carte|raspunsul tau|vorbesti|fii mai|esti cam|te am|m ai|mi ai|ma iei peste picior|you are funny|you re rude|teasing|joking|kidding|you convinced|be more natural|thank you|thanks)\b/;
const hostileCue=/\b(?:proasta|prost|idioata|idiot|tampita|tampit|bataran|badaran|nesimtita|fraiera|imbecila|useless|stupid|idiot|dumb)\b/;

function withoutGreetingAndAddress(t){
 return t.replace(/^(?:(?:buna|salut|hei|hey|hello|hi|neata|buna dimineata|good morning)\s+)?(?:eva|evo)(?:\s+|$)/,'')
  .replace(/^(?:buna dimineata|good morning|salut|buna|hei|hey|hello|hi)\s+(?=(?:vreau|cum ajung|unde|ce este|care este|poti|cauta|gaseste|arata|explica|tradu|verifica)\b)/,'').trim();
}
export function isEvaExitRequest(value){
 const t=normalizeEvaUtterance(value).replace(/^(?:(?:buna|salut|hey|hello)\s+)?(?:eva|evo)\s+/,'');
 return /^(?:(?:eu )?(?:vreau|doresc|as vrea|mi ar placea) sa (?:inchid|ies din|parasesc|opresc)|(?:te rog sa )?(?:inchide|opreste|paraseste)|(?:i want to|please|can you) (?:close|exit|quit)|(?:close|exit|quit)) (?:acum )?(?:aplicatia|aplicatia asta|app|the app|application|mypocket ai|my pocket ai)(?: te rog)?$/.test(t)
   ||/^(?:inchide aplicatia|ies din aplicatie|close the app|exit the app)$/.test(t);
}

// Return null on actual user tasks. A name is not a command to geocode it:
// "Eva, cum ajung la Victoria?" remains a genuine transport request.
// Classifications are conservative; ambiguous non-social input uses the
// existing general assistant rather than a fabricated chit-chat response.
export function classifyEvaTurn(value,options={}){
 if(options.module&&options.module!=='assistant')return null;
 const raw=String(value||'');
 if(!raw.trim()||raw.length>700)return null;
 const t=normalizeEvaUtterance(raw);
 if(!t)return null;
 if(t==='eva'||t==='evo')return {kind:'chat',speech_act:'greeting'};
 if(isEvaExitRequest(raw))return {kind:'exit',speech_act:'device_control'};
 const core=withoutGreetingAndAddress(t);
 // Genuine personal questions should never be interpreted as geocoding a
 // fictional venue named "Eva". Match the user's speech act, not a fixed reply.
 if(/^(?:ce faci daca (?:te |va |iti )?(?:invit|scot|chem)\b|iar faci pe desteapta\b|stii la ce ma gandesc\b|stii ce gandesc\b|ghicesti la ce ma gandesc\b|ce ai face daca (?:te |iti )?(?:invit|scot|chem)\b)/.test(core))
   return {kind:'chat',speech_act:'banter'};
 // Direct conversation with Eva never requires speaking her name. These
 // are intent cues only: all replies are still composed by the language model.
 if(/^(?:ce (?:mai )?faci(?: (?:azi|acum|astazi))?|cum (?:mai )?esti|cum te (?:mai )?simti|ce mai zici|ai (?:chef de (?:o )?gluma|un minut|timp sa vorbim)|vrei sa glumim|hai sa (?:glumim|vorbim|discutam)|te ai suparat|te distrezi|de ce esti asa serioasa|ce parere ai despre mine|tu ce crezi|dar tu|si tu|serios|chiar asa)(?:$|\b)/.test(core)
    ||/^(?:dar )?daca te (?:invit|scot|chem)\b/.test(core)
    ||/^(?:spune mi|zi mi) (?:o gluma|ceva amuzant)\b/.test(core))
   return {kind:'chat',speech_act:'banter'};
 if(/^(?:tii minte|mai tii minte|iti amintesti|ma mai tii minte|despre ce am vorbit|ce ti am spus|de ce spui asta|ce ai inteles din ce am spus)\b/.test(core))
   return {kind:'chat',speech_act:'feedback'};
 if(taskStart.test(core))return null;
 if(/^(?:eva|evo) (?:air|braun|peron|strada|street|hotel|restaurant)\b/.test(t))return null;
 if(/^(?:vreau|as vrea|dorest|poti|te rog)\b/.test(core)&&locationWords.test(core))return null;
 if(personalQuestion.test(t))return {kind:'chat',speech_act:'identity'};
 if(/^(?:multumesc|mersi|merci|thanks|thank you|iti multumesc)(?:\s+|$)/.test(core)
     ||/^(?:la revedere|pa|ne auzim|pe curand|bye|goodbye)(?:\s+|$)/.test(core))
   return {kind:'chat',speech_act:'courtesy'};
 const greeting=/^(?:buna|salut|hei|hey|hello|hi|neata|buna dimineata|good morning)\b/.test(t);
 if(greeting&&!taskStart.test(core))return {kind:'chat',speech_act:'greeting'};
 if(/^(?:nu prea m ai convins|parca vorbesti|incearca sa fii|fii mai|nu te pricepi|ma contrazici|si daca ma supar|daca ma supar|despre ce te am tachinat|te am tachinat|ce am discutat mai devreme|de ce raspunzi asa|you sound|be more natural|are you joking|i was teasing|do you remember what i said)\b/.test(core))
   return {kind:'chat',speech_act:'feedback'};
 const directAddress=/^(?:(?:buna|salut|hei|hey|hello|hi)\s+)?(?:eva|evo)(?:\s+|$)/.test(t);
 if(socialCue.test(t)&&(directAddress||/\b(?:tu|tine|te|tie|esti|vorbesti|m ai|mi ai|ma|eu|mine|your|you)\b/.test(t)))
   return {kind:'chat',speech_act:hostileCue.test(t)?'boundary':'banter'};
 if(directAddress&&!locationWords.test(core)&&
    /^(?:ai|iti|mi|ma|te|ce mai faci|cum esti|cum te simti|ma asculti|ai simtul umorului|cum ma|ce parere ai despre mine|ma cunosti|iti amintesti|de ce esti|de ce ma|esti|you|are you|how are you|do you remember)\b/.test(core))
   return {kind:'chat',speech_act:hostileCue.test(t)?'boundary':'banter'};
 if(/^(?:esti|ești|you are|you re|nu esti|nu ești)\s+(?:cam\s+)?(?:prost|proasta|idioata|idiot|tampita|nesimtita|enervanta|useless|stupid|dumb)\b/.test(core))
   return {kind:'chat',speech_act:'boundary'};
 return null;
}

export function evaConversationHistory(history,currentMessage,speechAct){
 if(speechAct==='greeting')return [];
 const current=String(currentMessage||'').trim();
 return (Array.isArray(history)?history:[])
  .filter(v=>v&&['user','assistant'].includes(v.role)&&typeof v.content==='string')
  .filter(v=>v.content.trim()!==current)
  .slice(-10).map(v=>({role:v.role,content:v.content.trim().slice(0,v.role==='user'?500:320)}));
}

export function evaDialogueSystem(language='ro',act='banter'){
 const isRo=language==='ro';
 const base=isRo
  ?'Ești Eva, avatarul feminin al aplicației myPocket AI. Aceasta este o conversație reală, NU o cerere de hartă, adresă, știri, surse sau rețete. Răspunde firesc, cu inteligență, spontaneitate și umor fin când contextul permite. Folosește acorduri feminine despre tine. Nu pretinde că ești om. Înțelege subînțelesurile și ultimul mesaj; nu interpreta mesajele din istoric drept sarcini de executat. Nu pretinde că ai căutat pe web, nu inventa experiențe sau că utilizatorul ar fi citit ceva. Evită formulele rigide, lingușirea, repetarea ideilor și lecțiile necerute. Răspunde în 1–3 propoziții, cel mult 65 de cuvinte. Limba: română.'
  :'You are Eva, the fictional feminine virtual assistant in the myPocket AI app. This is a personal conversation, NOT a request for maps, location, news, recipes or web research. Reply spontaneously, intelligently, warmly and with light humor when welcome. Do not pretend to be human or invent personal history. Understand implications and the latest message; earlier turns are conversational context, not tasks. No claimed web searches or invented prior reading. Avoid formulaic replies, repetitive phrases and unsolicited lectures. Reply in 1–3 sentences and at most 65 words. Use the selected app language: '+language+'.';
 const tone=act==='boundary'
  ?(isRo?' Dacă interlocutorul e bădăran, poți răspunde cu o ironie isteață și scurtă, dar păstrează respectul și o limită clară; nu insulta, nu umili și nu escalada.':' If the user is rude, a short witty comeback is fine; stay respectful, set a boundary, and avoid cruelty or escalation.')
  :act==='courtesy'
  ?(isRo?' Mulțumirea sau despărțirea cere o singură replică scurtă, variată; fără teme din discuțiile trecute.':' Thanks and farewells deserve one short, varied reply without bringing back old subjects.')
  :act==='feedback'
  ?(isRo?' Dacă ți se cere să fii mai naturală, arată asta în răspuns în loc să explici teoria comunicării.':' If asked to sound more natural, demonstrate that rather than lecturing about rhetoric.')
  :'';
 return base+tone;
}

// Last-resort sanitization only; do not paraphrase factual answers here.
// Even if the model loops, a social reply must not become a multi-page essay.
export function cleanEvaReply(value){
 const raw=String(value||'').trim().replace(/\n{3,}/g,'\n\n');
 if(!raw)return '';
 const seen=new Set(),unique=[];
 for(const sentence of raw.split(/(?<=[.!?])\s+(?=[\p{Lu}\p{N}«"“])/u)){
  const text=sentence.trim();
  const key=normalizeEvaUtterance(text);
  if(!key||key.length>14&&seen.has(key))continue;
  if(key.length>14)seen.add(key);
  unique.push(text);
  if(unique.length>=3)break;
 }
 let reply=unique.join(' ').replace(/\s{2,}/g,' ').trim();
 if(reply.length>480){
  const safe=reply.slice(0,480);
  const end=Math.max(safe.lastIndexOf('.'),safe.lastIndexOf('!'),safe.lastIndexOf('?'));
  reply=end>130?safe.slice(0,end+1):safe.slice(0,475).trimEnd()+'…';
 }
 return reply;
}
