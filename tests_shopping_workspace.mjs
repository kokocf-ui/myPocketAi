import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const page=await(await frontend.fetch(new Request('https://shopping.test/'))).text();
const inline=page.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'main frontend script must exist');
new vm.Script(inline);

assert.match(page,/id="pocketUnifiedModal"/,'one reusable Pocket AI dialog is present');
assert.match(inline,/function pocketConfirm\(/,'confirmations use the shared Pocket AI dialog');
assert.match(inline,/function pocketEdit\(/,'editing uses the shared Pocket AI dialog');
assert.doesNotMatch(inline,/\b(?:window\.)?(?:confirm|prompt|alert)\s*\(/,'no unstyled native browser message dialogs');
assert.match(inline,/const shared=tasksParseSpokenDeadline\(/,'agenda reuses the task date-time parser');

assert.doesNotMatch(inline,/webkitSpeechRecognition|window\.SpeechRecognition|new SpeechRecognition\(/,'no browser speech recognizer in the APK frontend');
assert.match(inline,/function tasksVoiceStart\(\)[\s\S]*?mode:'tasks'/,'tasks speech uses Android bridge');
assert.match(inline,/function agendaVoiceStart\(\)[\s\S]*?mode:'agenda'/,'agenda speech uses Android bridge');
assert.match(inline,/function shopVoiceListen\(\)[\s\S]*?mode:'shopping'/,'shopping speech uses Android bridge');
assert.match(inline,/function startRecognition\(mode\)[\s\S]*?pocketNativeVoiceSend\(\{action:'listen',mode,language:locale\}\)/,'general dictation uses Android bridge');


const style=page.match(/<style id="pocket-adaptive-workspaces">([\s\S]*?)<\/style>/)?.[1];
assert.ok(style,'shared adaptive-workspace stylesheet must exist');
assert.match(style,/#view-module\.adaptive-workspace-view\.active\s*\{[^}]*grid-template-rows:auto minmax\(0,1fr\)!important/s);
assert.match(style,/\.adaptive-workspace\s*\{[^}]*grid-template-rows:auto minmax\(0,1fr\) auto/s);
assert.match(style,/\.adaptive-workspace__scroll\s*\{[^}]*overflow-y:auto/s);
assert.doesNotMatch(style,/(top|bottom):\s*\d{3}px/i,'new layout should not use phone-specific absolute positioning');
const shoppingStyle=page.match(/<style id="shopping-single-screen">([\s\S]*?)<\/style>/)?.[1];
assert.ok(shoppingStyle,'shopping-only responsive style exists');
assert.match(shoppingStyle,/\.shop-navigation\{[^}]*grid-template-columns:minmax\(6\.5rem,\.82fr\) minmax\(0,1\.18fr\)/s);
assert.match(shoppingStyle,/\.shop-navigation>button\{[^}]*margin:0!important/s,'top buttons have no staggered offset');
assert.match(shoppingStyle,/\.shop-active-footer\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/s);
assert.match(shoppingStyle,/\.shop-active-footer>button\{[^}]*height:clamp\(2\.75rem,5\.6dvh,3\.15rem\)!important/s);
assert.match(inline,/footer\.classList\.add\('shop-active-footer'\)/);
assert.match(inline,/root\.classList\.add\('adaptive-workspace-view'\)/);
assert.match(inline,/root\.classList\.remove\('organize-active','organize-chat','adaptive-workspace-view','tasks-workspace'\)/);
assert.match(inline,/next\.checked=checkbox\.checked/,'only user checkbox handler changes bought status');
assert.match(inline,/if\(!shoppingWrite\(data\)\)\{checkbox\.checked=!checkbox\.checked/,'checkbox writes without rebuilding the entire list');
assert.match(inline,/info\.classList\.toggle\('is-checked',checkbox\.checked\)/,'checkbox updates its row in place');
assert.match(shoppingStyle,/\.adaptive-workspace__scroll>\.shop-voice-button\{[^}]*position:sticky;top:0;z-index:3/s,'microphone stays visible while rows scroll');

assert.match(inline,/shopArchive\(data,'archived',false\)/);
assert.match(inline,/shoppingWrite\(data\)/);
assert.ok(shoppingStyle,'shopping scoped styles found');
assert.match(shoppingStyle,/--shopping-action-height:clamp/);
assert.match(shoppingStyle,/\.adaptive-fields--product>button\{/);
assert.match(shoppingStyle,/\.adaptive-workspace__actions:not\(\.adaptive-workspace__actions--confirm\)>button\{/);
assert.match(inline,/Bifează și editează produsele din/);
assert.match(inline,/function shopVoiceStart\(\)/);
assert.match(inline,/function shopVoiceStop\(\)/);
assert.match(inline,/function shopVoiceWatchdog\(session\)/);
assert.match(inline,/function shopVoiceRestart\(session,delay\)/);
assert.match(inline,/shopVoiceClearWatchdog\(session\)/);
assert.match(inline,/session\.status='restarting'/);
assert.match(inline,/session\.missed>3/);
assert.match(inline,/shopVoiceHandleAndroid\(data\)/);
assert.match(inline,/mode:'shopping'/);
assert.match(inline,/shopButton\('🎙 Dictează produse','🎙 Dictate items'/);
assert.match(inline,/function shopGeneratedListName\(date=new Date\(\)\)/);
assert.match(inline,/function shopBeginFreshList\(data,date=new Date\(\)\)/);
assert.match(inline,/if\(data.items.length\)shopArchive\(data,'voice_saved',false\)/);
assert.match(inline,/shopBeginFreshList\(data\)/);
assert.match(inline,/title.textContent=data.items.length\?data.currentName/);
assert.match(inline,/let shoppingMode='entry'/);
assert.match(inline,/shopButton\('Finalizează','Finish'/);
assert.match(inline,/shopButton\('Arhivează','Archive'/);
assert.match(inline,/data\.completedAt=new Date\(\)\.toISOString\(\)/);
assert.match(inline,/shoppingMode==='active'/);
assert.match(inline,/SHOPPING_STORAGE_KEY='mypocketai\.shopping\.v1'/,'preserve existing storage key');


/* New personal organisation workspace must stay isolated from the proven agenda/shop. */
assert.match(inline,/if\(key==='tasks'\)\{if\(tasksListening\)tasksVoiceStop\(\);tasksSection='home';renderTasks\(\);return\}/);
assert.match(inline,/POCKET_TASKS_KEY='mypocketai\.tasks\.v1'/);
assert.match(inline,/function tasksCreate\(title,goal=false,due='',priority='normal',fromVoice=false,time=''\)/);
assert.match(inline,/function tasksConfirmDelete\(item\)/);
assert.match(inline,/function tasksToAgenda\(item,automatic=false\)/);
assert.match(inline,/function tasksParseSpokenDeadline\(value,now=new Date\(\)\)/,'voice date parser exists');

const taskParserBegin=inline.indexOf('function tasksParseSpokenDeadline(');
const taskParserEnd=inline.indexOf('function tasksRepairLegacyVoiceDates(',taskParserBegin);
assert.ok(taskParserBegin>=0&&taskParserEnd>taskParserBegin,'task parser extractable from rendered JS');
const taskParserCode=inline.slice(taskParserBegin,taskParserEnd);
const parsedContext=vm.createContext({Date,shopVoiceFold:s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()});
vm.runInContext(taskParserCode,parsedContext);
for(const [spoken,title,date,time] of [
 ['mâine ședință la ora 10:00','ședință','2026-11-07','10:00'],
 ['ședință mâine la ora 10','ședință','2026-11-07','10:00'],
 ['mâine la 10 ședință','ședință','2026-11-07','10:00'],
 ['cumpărare cartofi Mâine ora 10:00','cumpărare cartofi','2026-11-07','10:00'],
 ['cumpără filtre mâine','cumpără filtre','2026-11-07',''],
 ['ședință poimâine la 13:30','ședință','2026-11-08','13:30'],
 ['mâine','mâine','','']
]){
 const entry=vm.runInContext('tasksParseSpokenDeadline('+JSON.stringify(spoken)+',new Date(2026,10,6,7,40))',parsedContext);
 assert.equal(entry.title,title,'spoken title: '+spoken);
 assert.equal(entry.due,date,'spoken date: '+spoken);
 assert.equal(entry.time,time,'spoken time: '+spoken);
}

assert.match(inline,/function tasksRepairLegacyVoiceDates\(\)/,'existing voice tasks with times in title are migrated');

const taskStorage=new Map(),taskAgenda=[];
let taskIdSequence=0;
const taskCtx=vm.createContext({
 Date,JSON,
 localStorage:{getItem:key=>taskStorage.get(key)||null,setItem:(key,value)=>taskStorage.set(key,value)},
 shopVoiceFold:s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),
 learningLabel:(ro,en)=>ro,shopId:()=>String(++taskIdSequence),
 agendaRead:()=>taskAgenda.slice(),
 agendaWrite:items=>{taskAgenda.splice(0,taskAgenda.length,...items);return true},
 state:{language:'ro'},notify:()=>{},document:{},window:{}
});
const taskModuleStart=inline.indexOf("const POCKET_TASKS_KEY='mypocketai.tasks.v1'");
const taskModuleEnd=inline.indexOf('/* Calendar workspace:',taskModuleStart);
assert.ok(taskModuleStart>0&&taskModuleEnd>taskModuleStart);
vm.runInContext(inline.slice(taskModuleStart,taskModuleEnd),taskCtx);
vm.runInContext("renderTasks=()=>{}",taskCtx);
const taskEval=expression=>vm.runInContext(expression,taskCtx);
assert.equal(taskEval("tasksCreate('.',false,'','normal',true)"),false,'punctuation-only voice entry is rejected');
assert.equal(taskEval("tasksCreate('Ședință',false,'2026-11-07','normal',true,'10:00')"),true,'voice task is created');
assert.equal(taskAgenda.length,1,'voice creation directly links agenda');
assert.equal(taskAgenda[0].title,'Ședință');
assert.equal(taskAgenda[0].when,'2026-11-07T10:00:00.000Z');
assert.equal(taskAgenda[0].allDay,false,'spoken hour is preserved');
const initialAgendaId=taskAgenda[0].id;
const taskEntry=taskEval("tasksRead()[0]");
taskCtx.changedTask={...taskEntry,time:'11:30'};
assert.equal(taskEval("tasksToAgenda(changedTask,true)"),true,'reschedule same task');
assert.equal(taskAgenda.length,1,'no duplicated agenda entries');
assert.equal(taskAgenda[0].id,initialAgendaId,'reschedule preserves agenda identity');
assert.equal(taskAgenda[0].when,'2026-11-07T11:30:00.000Z','linked time is updated');
taskStorage.set('mypocketai.tasks.v1',JSON.stringify([
 {id:'legacy',title:'mâine ședință la ora 10:00',source:'voice',due:'',time:'',goal:false,done:false,archived:false,priority:'normal',createdAt:'2026-11-06T07:50:00.000Z'}
]));
taskEval("tasksRepairLegacyVoiceDates()");
assert.equal(taskEval("tasksRead()[0].title"),'ședință','legacy task title is repaired');
assert.equal(taskEval("tasksRead()[0].due"),'2026-11-07','legacy task date is repaired relative to creation date');
assert.equal(taskEval("tasksRead()[0].time"),'10:00','legacy task time is repaired');
assert.equal(taskAgenda.length,2,'repaired task also appears in agenda');

assert.match(inline,/const spokenTask=tasksParseSpokenDeadline\(spoken\)/,'date-first voice commands create tasks without an imperative verb');
assert.match(inline,/async function tasksSuggestGoal\(title\)/,'goal suggestions are requested from Pocket AI');
assert.match(inline,/tasksSuggestGoal\(goalName\)/,'manual goal creation opens suggestions');
assert.match(inline,/tasksSuggestGoal\(parsed\.title\)/,'voice goal creation opens suggestions');
assert.match(inline,/hasTime\?item\.time\+':00':'12:00:00'/,'spoken time is preserved');

assert.match(inline,/if\(fromVoice&&due\)tasksToAgenda\(item,true\)/,'voice task with date syncs automatically');
assert.match(inline,/tasksCreate\(parsed.title,goal,parsed.due,priority,true,parsed.time\)/,'spoken tasks preserve date and hour');
assert.match(inline,/source:fromVoice\?'voice':'manual'/,'task source persisted');
assert.match(inline,/if\(item.due&&item.source!=='voice'\)/,'manual agenda button is not duplicated on voice tasks');
assert.match(inline,/events\.findIndex\(e=>e\.linkedTaskId===item\.id\)/,'linked agenda entries are updated without duplicates');
assert.match(inline,/existing\.title===event\.title&&existing\.when===event\.when/,'identical agenda entries are not rewritten');
assert.match(inline,/allDay:!hasTime,linkedTaskId:item\.id/,'only tasks without a spoken hour remain all-day');
assert.match(inline,/events:events\.filter\(e=>!e\.allDay\)/,'all-day tasks do not schedule invented Android alarm');
assert.match(page,/\.tasks-item\{[^}]*flex-direction:column!important/s,'task title keeps full width above action buttons');
assert.match(page,/\.tasks-item-text\{[^}]*width:100%!important/s,'task title is not squeezed letter by letter');
assert.match(inline,/function tasksVoiceHandleAndroid\(data\)/,'Android tasks voice callback exists');
assert.match(inline,/if\(tasksVoiceHandleAndroid\(data\)\)return/,'Android dispatcher forwards tasks speech');
assert.match(inline,/mode:'tasks'/,'tasks microphone calls native recognizer');
assert.match(inline,/tasksVoiceStatus\(learningLabel\('Microfon activ/,'tasks show immediate listening status');
assert.match(inline,/speechStatus\.setAttribute\('aria-live','polite'\)/,'accessible voice status');
assert.match(inline,/pocketVoiceHelp\('tasks',\$\('moduleTitle'\)\)/,'tasks voice guide uses shared top heading');
assert.doesNotMatch(inline,/const heading=el\('h3','tasks-title'/,'tasks title is not duplicated');
assert.doesNotMatch(inline,/window\.alert\(learningLabel\('„Adaugă sarcină/,'tasks guide does not use browser alerts');
assert.match(inline,/nav\.append\(btn\(learningLabel\('← Înapoi'/,'back action occupies the left slot');
assert.match(inline,/btn\(learningLabel\('🎙 Dictare'/,'dictation occupies the right slot');
assert.match(inline,/linkedTaskId===item\.id/,'agenda transfer does not duplicate a task');
assert.match(inline,/tasksWrite\(data\.filter\(t=>t\.id!==id\)\)/,'only selected task is removed');
assert.match(inline,/if\(tasksListening\)tasksVoiceStop\(\)/,'recognizer stops on navigation');
for(const art of ['list','goal','calendar','archive'])assert.ok(inline.includes(art+":'"), 'drawing is present: '+art);
assert.match(page,/\.tasks-tiles\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s,'illustrations are on a responsive 2x2 grid');
assert.match(page,/\.tasks-scroll\{[^}]*overflow-y:auto/s,'only inner list scrolls');

const agendaStart=inline.indexOf("const POCKET_AGENDA_KEY='mypocketai.agenda.v1'");
const agendaEnd=inline.indexOf('/* Shopping workspace:',agendaStart);
assert.ok(agendaStart>0&&agendaEnd>agendaStart,'agenda module isolated from shopping storage');
assert.match(inline,/if\(key==='calendar'\)\{renderAgenda\(\);return\}/);
assert.match(inline,/if\(agendaVoiceHandleAndroid\(data\)\)return/);
assert.match(inline,/className='primary-btn agenda-microphone'/);
assert.match(inline,/controls\.append\(back,mic\);panel\.insertBefore\(controls,scroll\)/,'equal Back and dictation controls stay outside scroll');
assert.match(inline,/if\(agendaSelectedId\)\{/,'Back from event details returns to calendar');
assert.match(inline,/else renderOrganizeChoices\(\)/,'Back from calendar returns to Personal organisation');
assert.match(inline,/\$\('moduleTitle'\)\.parentElement\?\.querySelector\('\.pocket-voice-info'\)\?\.remove\(\)/,'Personal organisation removes stale info control');
assert.match(inline,/\['Ștergere produs','Șterge laptele'\]/,'shopping voice guide contains an executable deletion example');
assert.match(page,/\.agenda-voice-controls\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'Back and dictation share equal adaptive columns');
assert.doesNotMatch(inline,/returnButton\.classList\.add\('agenda-detail-back'\)/,'detail view reuses the shared Back button');


assert.match(inline,/if\(!\['calendar','tasks','reminders','notes','daily','budget'\]\.includes\(cat\[0\]\)\)panel\.append\(bar\)/,'voice workspaces omit the legacy duplicate toolbar');
assert.match(inline,/function pocketVoiceHelp\(mode,title\)/,'shared voice command guide exists');

/* New voice-enabled organiser pages must inherit the shared layout from day one. */
assert.match(inline,/function organizeVoiceWorkspace\(cat,/,'shared organiser voice layout factory exists');
assert.match(inline,/function renderReminders\(\)\{[\s\S]*?organizeVoiceWorkspace\(cat,/,'reminders use the shared layout');
assert.match(inline,/pocketVoiceHelp\(mode,\$\('moduleTitle'\)\)/,'shared title gets contextual info button');
assert.match(inline,/organize-voice-controls/,'back and dictation are paired within one toolbar');
assert.match(page,/<style id="organize-voice-workspace-style">/,'responsive voice toolbar styles exist');
assert.match(page,/\.organize-voice-controls\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'two equally sized controls on one row');
assert.match(inline,/if\(!\['calendar','tasks','reminders','notes','daily','budget'\]\.includes\(cat\[0\]\)\)bar\.append\(back,title\)/,'avoid duplicating reminder title and Categories button');
assert.match(inline,/reminders:\[[\s\S]*?Șterge mementoul/,'reminder info help has examples');

assert.match(inline,/pocketVoiceHelp\('agenda',\$\('moduleTitle'\)\)/,'agenda guide attached to title');
assert.match(inline,/pocketVoiceHelp\('shopping',\$\('moduleTitle'\)\)/,'shopping guide attached to title');
assert.match(inline,/pocketVoiceHelp\('assistant',document\.querySelector/,'assistant uses the same voice guide');

assert.match(inline,/title\.parentElement\?\.append\(icon\)/,'info icon is a sibling aligned with module title');
assert.match(page,/#view-module\.organize-active>\.module-heading-row\{[\s\S]*?display:flex!important/,'heading uses vertical alignment for info');
assert.match(page,/\.agenda-detail>\.agenda-detail-back\{/,'details return action is compact');
assert.match(page,/\.agenda-detail-actions\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'event edit and delete actions balanced');
assert.match(inline,/voiceStatus\.setAttribute\('aria-live','polite'\)/,'agenda voice status is accessible');
assert.match(inline,/panel\.insertBefore\(voiceStatus,scroll\)/,'agenda status remains visible outside calendar scroll');
assert.match(inline,/data\.status==='partial'/,'native agenda recognition displays partial speech');
assert.match(inline,/agendaRetryCount<2/,'native agenda recognizer retries transient failures only twice');
assert.match(inline,/agendaSpeechStatus\(learningLabel\('Te ascult/,'native recognizer reports listening state');

assert.match(inline,/dialog\.showModal\(\)/,'voice help opens as an overlay without leaving module');
assert.match(page,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/,'calendar view selectors use four equal adaptive columns');
assert.match(page,/grid-template-columns:minmax\(2\.5rem,auto\) minmax\(0,1fr\) minmax\(2\.5rem,auto\) minmax\(4\.5rem,auto\)/,'calendar navigation row has balanced controls');

assert.doesNotMatch(inline,/mic\.onclick=\(\)=>agendaVoiceStart\(\);scroll\.append\(mic\)/,'do not put agenda microphone inside scroll area');
const agendaCss=page.match(/<style id="agenda-voice-workspace">([\s\S]*?)<\/style>/)?.[1];
assert.ok(agendaCss,'agenda stylesheet exists');
assert.match(agendaCss,/\.agenda-workspace\{[^}]*grid-template-rows:auto minmax\(0,1fr\)!important/s);

assert.match(inline,/all\.slice\(\)\.sort\(\(a,b\)=>agendaNextDate\(a\)-agendaNextDate\(b\)\)/,'all events sorted by next occurrence, including annual birthdays');
assert.doesNotMatch(inline.slice(agendaStart,agendaEnd),/SHOPPING_STORAGE_KEY/,'agenda cannot overwrite shopping lists');
const ctxAgenda=vm.createContext({Date,Math,Intl,learningLabel:(ro,en)=>ro,shopVoiceFold:s=>String(s).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim(),localStorage:{getItem:()=>null,setItem:()=>{}},state:{language:'ro'},shopId:()=> 'abc',window:{},document:{}});
vm.runInContext(taskParserCode,ctxAgenda);
vm.runInContext(inline.slice(agendaStart,agendaEnd),ctxAgenda);
const agendaEval=expr=>vm.runInContext(expr,ctxAgenda);
const fixedDay=new Date('2026-11-05T12:00:00');
const tomorrow=agendaEval("agendaDate('Programează dentistul mâine la ora 10',new Date('2026-11-05T12:00:00'))");
assert.ok(tomorrow,'tomorrow with explicit hour parses');
assert.equal(new Date(tomorrow.when).getHours(),10);
assert.equal(new Date(tomorrow.when).getDate(),6);
assert.equal(agendaEval("agendaDate('Programează dentistul mâine',new Date('2026-11-05T12:00:00'))"),null,'do not invent appointment hour');
assert.equal(agendaEval("agendaExtractTitle('Programează dentistul mâine la ora 10')"),'dentistul');
assert.equal(agendaEval("agendaDate('Programează dentistul 32.11.2026 la ora 10',new Date('2026-11-05T12:00:00'))"),null,'invalid calendar date rejected');
const birthday=agendaEval("agendaBirthdayFields(29,2,null)");
assert.equal(birthday.birthdayDay,29);
assert.equal(birthday.birthdayMonth,2);
assert.equal(agendaEval("agendaBirthdayFields(31,4,null)"),null,'invalid day/month rejected');
assert.equal(agendaEval("agendaBirthdayFields(29,2,2025)"),null,'birth year must be a valid leap year');
ctxAgenda.birthday={kind:'birthday',title:'Maria',birthdayDay:29,birthdayMonth:2,birthYear:2000};
assert.equal(agendaEval("agendaNextDate(birthday,new Date(2027,0,1)).getDate()"),28,'Feb 29 annual policy: Feb 28 in non-leap year');
assert.equal(agendaEval("agendaNextDate(birthday,new Date(2028,0,1)).getDate()"),29,'Leap year preserves Feb 29');
assert.equal(agendaEval("agendaBirthdaySpoken('Adaugă ziua de naștere a Mariei pe 12 mai').fields.birthdayMonth"),5);
assert.equal(agendaEval("agendaBirthdaySpoken('Adaugă ziua de naștere a Mariei pe 12 mai').title"),'Mariei');
assert.equal(agendaEval("agendaBirthdaySpoken('Adaugă ziua de naștere a lui Andrei pe 12 mai').title"),'Andrei');
assert.equal(agendaEval("agendaBirthdaySpoken('Adaugă ziua de naștere a lui Andrei pe 12 mai').fields.birthdayDay"),12);
assert.equal(agendaEval("agendaBirthdaySpoken('Ziua de naștere a lui Andrei pe 12 mai').fields.birthdayMonth"),5);

assert.match(inline,/if\(birthday\)\{if\(!birthday.fields/,'voice birthday branch is handled before appointment parsing');
assert.match(inline,/agendaBirthdaySave\(person.value,fields\)/,'manual yearly birthday form is wired');
assert.match(inline,/Object\.assign\(change,valid\)/,'birthday editing preserves original id and annual recurrence');

assert.match(inline,/agendaCalendarItems\(all,agendaCursor\)/,'selected calendar date filters appointments');
assert.match(inline,/agendaSelectedId=item\.id/,'tap opens existing appointment');
assert.match(inline,/agendaWrite\(list\)/,'existing event editing persists changes');
assert.match(inline,/agendaDeleteEvent\(selected\.id\)/,'confirmation invokes deletion by stable event id');
assert.match(inline,/agendaPendingDelete=candidates\[0\]\.id/,'voice deletion targets a unique matching appointment');
assert.match(inline,/agendaSelectedId=candidates\[0\]\.id/,'voice deletion opens confirmation for the selected event');
assert.match(inline,/className='agenda-delete-confirm'|element\('section','agenda-delete-confirm'\)/,'confirmation has dedicated responsive layout');
assert.match(page,/\.agenda-delete-choices\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'confirmation buttons use two equal columns');
assert.match(page,/#view-module\.organize-active>\.module-heading-row \.pocket-voice-info\{[\s\S]*?background:transparent!important/,'info control is not a gray filled square');
const agendaStorage=new Map();
ctxAgenda.localStorage={getItem:key=>agendaStorage.get(key)||null,setItem:(key,value)=>agendaStorage.set(key,value)};
agendaStorage.set('mypocketai.agenda.v1',JSON.stringify([
 {id:'dentist-1',title:'Dentist',when:'2026-11-06T10:00:00.000Z'},
 {id:'garage-1',title:'Mecanic',when:'2026-11-09T10:00:00.000Z'},
 {id:'birthday-1',kind:'birthday',title:'Andrei',birthdayDay:12,birthdayMonth:5,birthYear:null}
]));
assert.equal(agendaEval("agendaDeleteEvent('dentist-1')"),true,'confirmed delete persists the selected appointment');
assert.deepEqual(JSON.parse(agendaStorage.get('mypocketai.agenda.v1')).map(e=>e.id),['garage-1','birthday-1'],'unrelated appointments and annual birthdays remain intact');
assert.equal(agendaEval("agendaDeleteEvent('not-present')"),false,'unknown ids cannot delete anything');
assert.equal(agendaEval("agendaDeleteEvent('garage-1')"),true);
assert.equal(JSON.parse(agendaStorage.get('mypocketai.agenda.v1')).length,1,'second delete persists without clearing other records');
assert.match(inline,/agendaVoiceOpen\(spoken\)/,'voice can open existing appointments');
const agendaDay=agendaEval("agendaCalendarItems([{id:'1',title:'Test',when:'2026-11-06T10:00:00Z'},{id:'2',title:'Maria',kind:'birthday',birthdayDay:6,birthdayMonth:11,birthYear:null}],new Date(2026,10,6))");
assert.equal(agendaDay.length,2,'calendar day contains appointment and annual birthday');
assert.equal(agendaEval("agendaCalendarItems([{id:'3',title:'Maria',kind:'birthday',birthdayDay:29,birthdayMonth:2,birthYear:2000}],new Date(2027,1,28)).length"),1,'Feb 29 birthday appears on Feb 28 of non-leap years');
assert.equal(agendaEval("agendaDateTimeLocal('2026-11-06T10:00:00Z').length"),16,'edit form uses local datetime');
const start=inline.indexOf('function shopId(){');
const end=inline.indexOf('function renderShoppingList(){',start);
assert.ok(start>=0&&end>start,'shopping logic boundaries present');
const ctx=vm.createContext({Math,Date,learningLabel:(ro,en)=>ro,localStorage:{},document:{}});
vm.runInContext(inline.slice(start,end),ctx);
const evalIn=expression=>vm.runInContext(expression,ctx);

ctx.state={language:'ro'};
const spoken=evalIn("shopVoiceItems('două kilograme de cartofi zece ouă un litru de lapte o jumătate de kilogram de roșii')");
assert.equal(spoken.length,4,'one unpunctuated dictation produces four distinct products');
assert.deepEqual(Array.from(spoken,x=>x.name),['cartofi','ouă','lapte','roșii']);
assert.deepEqual(Array.from(spoken,x=>x.quantity),['2','10','1','0.5']);
assert.deepEqual(Array.from(spoken,x=>x.unit),['kg','buc','l','kg']);
assert.equal(evalIn("shopVoiceEnd('trei pâini atât').ended"),true);
assert.equal(evalIn("shopVoiceEnd('arată lista').showList"),true);
assert.equal(evalIn("shopVoiceEnd('arată lista').text"),'');
assert.equal(evalIn("shopVoiceEnd('două kilograme de cartofi arată lista').showList"),true);
assert.equal(evalIn("shopVoiceEnd('două kilograme de cartofi arată lista').text"),'două kilograme de cartofi');
assert.equal(evalIn("shopVoiceEnd('zece ouă').ended"),false);
assert.match(inline,/if\(ending.showList\)/);

assert.equal(evalIn("shopVoiceDiacritics('faina capsuni patrunjel')"),'făină căpșuni pătrunjel');
const observed=evalIn("shopVoiceItems('2 kg de cartofi 1 L de lapte 1 L de ulei 10 ouă o jumătate de kilogram de roșii')");
assert.equal(observed.length,5,'spoken quantities in screenshot must split into five products');
assert.deepEqual(Array.from(observed,x=>x.name),['cartofi','lapte','ulei','ouă','roșii']);
assert.deepEqual(Array.from(observed,x=>x.quantity),['2','1','1','10','0.5']);
assert.deepEqual(Array.from(observed,x=>x.unit),['kg','l','l','buc','kg']);
assert.match(shoppingStyle,/\.shop-active-footer\.adaptive-workspace__actions--confirm\{/,
 'confirmation expands across the complete active-footer width');
const shoppingActions=evalIn("shopNormalizeData({items:[{id:'eggs',name:'ouă',quantity:'10',unit:'buc',checked:false},{id:'oil',name:'ulei',quantity:'1',unit:'l',checked:false},{id:'potatoes',name:'cartofi',quantity:'2',unit:'kg',checked:false}]})");
ctx.actionData=shoppingActions;
assert.equal(evalIn("shopVoiceApplyAction('am cumpărat ouăle',actionData).ok"),true);
assert.equal(shoppingActions.items.find(i=>i.id==='eggs').checked,true);
assert.equal(evalIn("shopVoiceApplyAction('am cumpărat cartofi și ulei',actionData).ok"),true);
assert.equal(shoppingActions.items.find(i=>i.id==='potatoes').checked,true);
assert.equal(shoppingActions.items.find(i=>i.id==='oil').checked,true);
shoppingActions.items.find(i=>i.id==='potatoes').checked=false;
shoppingActions.items.find(i=>i.id==='oil').checked=false;
assert.equal(evalIn("shopVoiceApplyAction('am cumpărat cartofi și produs necunoscut',actionData).ok"),false);
assert.equal(shoppingActions.items.find(i=>i.id==='potatoes').checked,false,'multi-check is atomic for unknown products');

assert.equal(evalIn("shopVoiceApplyAction('modifică cartofii la 5 kilograme',actionData).ok"),true);
assert.equal(shoppingActions.items.find(i=>i.id==='potatoes').quantity,'5');
assert.equal(evalIn("shopVoiceApplyAction('înlocuiește uleiul cu unt',actionData).ok"),false,'do not silently turn liters into butter');
assert.equal(shoppingActions.items.find(i=>i.id==='oil').name,'ulei');
assert.equal(evalIn("shopVoiceApplyAction('înlocuiește uleiul cu 200 grame de unt',actionData).ok"),true);
assert.equal(shoppingActions.items.find(i=>i.id==='oil').name,'unt');
assert.equal(shoppingActions.items.find(i=>i.id==='oil').quantity,'200');
assert.equal(shoppingActions.items.find(i=>i.id==='oil').unit,'g');
assert.equal(evalIn("shopVoiceApplyAction('mai adaugă 2 litri de lapte',actionData).ok"),true);
assert.equal(shoppingActions.items.at(-1).name,'lapte');
assert.equal(evalIn("shopVoiceApplyAction('șterge ouăle',actionData).ok"),true);
assert.equal(shoppingActions.items.some(i=>i.id==='eggs'),false);
assert.equal(evalIn("shopVoiceApplyAction('șterge roșiile',actionData).ok"),false,'unknown item is not removed');
const subtraction=evalIn("shopNormalizeData({items:[{id:'a',name:'cartofi',quantity:'5',unit:'kg',checked:false},{id:'b',name:'lapte',quantity:'1',unit:'l',checked:false}]})");
ctx.subtraction=subtraction;
assert.equal(evalIn("shopVoiceApplyAction('scoate 3 kg de cartofi',subtraction).ok"),true);
assert.equal(subtraction.items[0].quantity,'2');
assert.equal(subtraction.items.length,2);
assert.equal(evalIn("shopVoiceApplyAction('scade 1 kg de cartofi',subtraction).ok"),true);
assert.equal(subtraction.items[0].quantity,'1');
assert.equal(evalIn("shopVoiceApplyAction('scoate 2 kg de cartofi',subtraction).ok"),false);
assert.equal(subtraction.items[0].quantity,'1','oversubtraction cannot delete product');
assert.equal(evalIn("shopVoiceApplyAction('scoate 1 litru de cartofi',subtraction).ok"),false);
assert.equal(subtraction.items[0].quantity,'1','unit mismatch cannot mutate quantity');
const mergedCartofi=evalIn("shopNormalizeData({items:[{id:'a',name:'cartofi',quantity:'2',unit:'kg',checked:false},{id:'b',name:'cartofi',quantity:'3',unit:'kg',checked:false}]})");
ctx.mergedCartofi=mergedCartofi;
assert.equal(evalIn("shopVoiceApplyAction('mai adaugă 1 kilogram de cartofi',mergedCartofi).ok"),true);
assert.equal(mergedCartofi.items.length,1,'matching unchecked duplicate rows consolidate');
assert.equal(mergedCartofi.items[0].quantity,'6','2 + 3 + 1 = 6 kg');
const incompatible=evalIn("shopNormalizeData({items:[{name:'lapte',quantity:'1',unit:'l',checked:false}]})");
ctx.incompatible=incompatible;
assert.equal(evalIn("shopVoiceApplyAction('mai adaugă 200 mililitri de lapte',incompatible).ok"),false,'never mix liters and milliliters without explicit conversion');
assert.equal(incompatible.items.length,1);
const purchased=evalIn("shopNormalizeData({items:[{name:'ouă',quantity:'10',unit:'buc',checked:true}]})");
ctx.purchased=purchased;
assert.equal(evalIn("shopVoiceApplyAction('mai adaugă 6 ouă',purchased).ok"),true);
assert.equal(purchased.items.length,2,'bought quantity remains unchanged; new eggs are unchecked');
assert.equal(purchased.items[0].quantity,'10');
assert.equal(purchased.items[1].quantity,'6');
assert.equal(evalIn("shopVoiceApplyAction('arhivează lista',mergedCartofi).archive"),true);
assert.equal(evalIn("shopVoiceApplyAction('pune în arhivă lista',mergedCartofi).archive"),true);
assert.match(inline,/if\(archiveRequested\)\{/);
assert.match(inline,/shopArchiveActiveImmediately\(data\)/);
assert.match(inline,/archive\.onclick=\(\)=>\{shopArchiveActiveImmediately\(data\)\}/);
assert.doesNotMatch(inline,/shoppingPendingAction=\{type:'archive'\}/,'no extra confirmation for archiving');
assert.match(inline,/shoppingPendingAction=\{type:'deleteArchived',historyIndex,entryId:/,
 'permanent archived-list deletion still requires confirmation');
assert.match(inline,/kind:shoppingMode==='active'\?'actions':'entry'/);
assert.match(inline,/if\(session.kind==='actions'\)/);
assert.match(inline,/session.kind==='actions'&&isFinal&&phrase/);
assert.match(inline,/shopVoiceAccept\(String\(data.text\|\|''\),true\)/);
assert.match(inline,/shopVoiceAccept\(String\(data.text\|\|''\),true\)/,'Android recognition passes finalized text to shopping');
assert.match(inline,/shoppingMode==='active'\?shopLabel\('Spune o comandă/);
assert.match(inline,/shopButton\('🎙 Comenzi vocale','🎙 Voice commands'\)/);
const migrated=evalIn("shopNormalizeData({items:[{id:'milk',name:'Lapte',checked:true,checkedAt:'2026-11-05T12:00:00Z'},{id:'bread',name:'Pâine',checked:false}],history:[{finishedAt:'2026-11-04T12:00:00Z',items:[{name:'Cartofi',checked:false}]}]})");
assert.equal(migrated.currentName,'Lista mea');
assert.equal(migrated.items.length,2);
assert.equal(migrated.items[0].checked,true);
assert.equal(migrated.items[0].checkedAt,'2026-11-05T12:00:00Z');
assert.equal(migrated.items[1].checked,false);
assert.equal(migrated.history.length,1,'older archived lists preserved');
assert.equal(migrated.history[0].items[0].name,'Cartofi');

ctx.data=migrated;
evalIn("shopArchive(data,'completed',true,'Următoarea')");
assert.equal(migrated.history.length,2);
assert.equal(migrated.history[0].status,'completed');
assert.equal(migrated.history[0].name,'Lista mea');
assert.equal(migrated.history[0].items[0].checked,true,'archive does not rewrite user decisions');
assert.equal(migrated.history[0].items[1].checked,false);
assert.equal(migrated.items.length,1,'only unbought carried forward');
assert.equal(migrated.items[0].name,'Pâine');
assert.equal(migrated.items[0].checked,false,'new list never automatically marks as purchased');
assert.equal(migrated.currentName,'Următoarea');
assert.equal(evalIn('shopValidateQuantity("2,5")'),true);
assert.equal(evalIn('shopValidateQuantity("0")'),false);
assert.equal(evalIn('shopValidateQuantity("-1")'),false);
assert.equal(evalIn('shopValidateQuantity("1.5")'),true);

/* Notes: isolated storage, unified design, speech actions, no unprompted notifications. */
assert.match(inline,/if\(key==='notes'\)\{renderNotes\(\);return\}/);
assert.match(inline,/function renderNotes\(\)/);
assert.match(inline,/organizeVoiceWorkspace\(cat,\{[\s\S]*?mode:'notes'/);
assert.match(inline,/pocketVoiceHelp\(mode,\$\('moduleTitle'\)\)/);
assert.match(inline,/notes:\[[\s\S]*?Șterge avatar/);
assert.match(inline,/if\(notesVoiceHandleAndroid\(data\)\)return/);
assert.match(inline,/mode:'notes'/);
assert.match(inline,/POCKET_NOTES_KEY='mypocketai\.notes\.v1'/);
assert.match(page,/<style id="personal-notes-workspace-style">/);

assert.match(page,/<style id="organize-notes-unified-layout">/,'one shared responsive header and note layout stylesheet');
assert.match(page,/#view-module\.organize-active\.adaptive-workspace-view>\.module-heading-row\{[\s\S]*?grid-template-columns:minmax\(0,1fr\)/,'heading reserves title space and info column');
assert.match(page,/#view-module\.organize-active\.adaptive-workspace-view>\.module-heading-row \.section-title\{[\s\S]*?text-align:center!important/,'module title is centered between Home and Info');
assert.match(page,/#view-module \.notes-list-item\{[\s\S]*?height:auto!important/,'note cards grow with contents');
assert.match(inline,/const sameText=notesFold\(compactBody\)===notesFold\(heading\)/,'same title and body are not duplicated on note cards');
assert.match(inline,/if\(remainder\)row\.append\(make\('span','notes-list-preview'/,'preview is suppressed for exact title repeats');
assert.match(inline,/notes-list-date/,'date stays within its note card');

const startNotes=inline.indexOf("const POCKET_NOTES_KEY='mypocketai.notes.v1'");
const endNotes=inline.indexOf('function notesVoiceStop(',startNotes);
assert.ok(startNotes>=0&&endNotes>startNotes,'isolated notes storage and matching helpers');
const notesMemory=new Map();
const notesContext=vm.createContext({Date,JSON,shopId:()=>String(notesMemory.size+1),
 localStorage:{getItem:key=>notesMemory.get(key)||null,setItem:(key,val)=>notesMemory.set(key,val)},
 notify:()=>{},learningLabel:(ro,en)=>ro,renderNotes:()=>{},notesSelectedId:null});
vm.runInContext(inline.slice(startNotes,endNotes),notesContext);
const notesEval=code=>vm.runInContext(code,notesContext);
assert.equal(notesEval("notesSave('Să verificăm vocea avatarului')"),true);
assert.equal(notesEval("notesRead().length"),1);
assert.equal(notesEval("notesMatch('notița despre avatar').title"),'Să verificăm vocea avatarului');
assert.equal(notesEval("notesMatch('avatar').id"),notesEval("notesRead()[0].id"));
assert.equal(notesEval("notesMatch('necunoscut')"),null);
assert.equal(notesEval("notesSave('Test notiță nouă')"),true);
assert.equal(notesEval("notesRead().length"),2);
assert.equal(notesEval("notesAutosave(notesRead()[0].id,'Text completat automat')"),true,'note edit persists automatically');
assert.equal(notesEval("notesRead()[0].body"),'Text completat automat','input changes are preserved');
assert.match(inline,/input\.addEventListener\('input',persistDraft\)/,'new note auto-saves on typing');
assert.match(inline,/editor\.addEventListener\('input'/,'existing notes auto-save on typing');
assert.doesNotMatch(inline.slice(inline.indexOf('function renderNotes(){'),inline.indexOf('const TASKS_DRAWINGS=',inline.indexOf('function renderNotes(){'))),/Salvează modificările/,'no manual save button in notes');
assert.match(inline,/agendaEventOrigin\(selected\)/,'agenda displays source of event');
assert.match(inline,/if\(item\.linkedTaskId\)/,'agenda deletion also removes linked source task');
assert.match(inline,/Pentru notificări folosește Mementouri inteligente/,'notes do not create agenda alerts');
assert.equal(notesEval("notesRead().some(item=>item.title==='Test notiță nouă')"),true);
assert.match(inline,/pocketConfirm\(learningLabel\('Ștergi notița/,'note deletion requires a styled confirmation');
assert.doesNotMatch(inline.slice(startNotes,endNotes),/agendaSyncAndroid\(/,'notes do not directly schedule notifications');


/* Daily planning reuses existing records: no second calendar or separate notifications. */
assert.match(inline,/if\(key==='daily'\)\{renderDailyPlan\(\);return\}/,'daily option opens dedicated planner');
assert.match(inline,/function renderDailyPlan\(\)/,'daily planner is rendered');
assert.match(inline,/organizeVoiceWorkspace\(cat,\{[\s\S]*?mode:'daily'/,'daily uses shared UI header and dictation');
assert.match(inline,/if\(dailyVoiceHandleAndroid\(data\)\)return/,'native Android daily dictation is connected');
assert.match(inline,/function dailyPlanItems\(/,'daily planner combines calendar and tasks');
assert.match(inline,/linked\.has\(task\.id\)/,'calendar-linked tasks never appear twice');
assert.match(inline,/sourceModule:'daily'/,'daily-created appointment is tagged with source');
assert.match(inline,/if\(agendaWrite\(all\)\)/,'daily creation uses the existing agenda store');
assert.match(inline,/daily:[\s\S]*?Planifică mâine/,'daily help offers speech examples');
assert.match(page,/<style id="daily-planning-layout">/,'daily layout has responsive controls');
assert.match(inline,/dailyDateKey\(agendaLocalDate\(event,day\.getFullYear\(\)\)\)/,'annual birthdays and scheduled events use agenda dates');
const dailyStart=inline.indexOf('let dailyPlanDate=new Date(),dailyListening=false;');
const dailyEnd=inline.indexOf('function dailyVoiceStop(',dailyStart);
assert.ok(dailyStart>0&&dailyEnd>dailyStart,'daily view selectors are testable');
const today=new Date(2026,10,7);
const dailyContext=vm.createContext({
 Date,String,Number,Math,Set,Boolean,
 learningLabel:(ro,en)=>ro,
 agendaRead:()=>[
  {id:'evt1',title:'Consult medical',when:'2026-11-07T11:00:00',linkedTaskId:'task1'},
  {id:'evt2',title:'Sună la service',when:'2026-11-07T15:00:00',kind:'reminder'}
 ],
 tasksRead:()=>[
  {id:'task1',title:'Consult medical',due:'2026-11-07',time:'11:00'},
  {id:'task2',title:'Cumpără cafea',due:'2026-11-07',time:'10:00'},
  {id:'task3',title:'Altă zi',due:'2026-11-08',time:'09:00'}
 ],
 agendaLocalDate:e=>new Date(e.when),
 agendaEventOrigin:e=>e.kind==='reminder'?'Mementouri':'Agendă',
 renderDailyPlan:()=>{},
 state:{language:'ro'}
});
vm.runInContext(inline.slice(dailyStart,dailyEnd),dailyContext);
const dailyResults=vm.runInContext('dailyPlanItems(new Date(2026,10,7))',dailyContext);
assert.deepEqual(Array.from(dailyResults,entry=>entry.title),['Cumpără cafea','Consult medical','Sună la service'],'daily planner is chronological and de-duplicates linked tasks');
assert.equal(dailyResults.filter(e=>e.title==='Consult medical').length,1);


/* Budget V1: local money arithmetic, FX provenance and shared voice-first layout. */
assert.match(inline,/if\(key==='budget'\)\{renderBudget\(\);return\}/,'budget category has its own screen');
assert.match(inline,/budget:[\s\S]*?Convertește 100 de lire în lei/,'budget info includes commands');
assert.match(inline,/if\(budgetVoiceHandleAndroid\(data\)\)return/,'budget Android dictation is integrated');
assert.match(inline,/function budgetMonthly\(/,'financial month totals');
assert.match(inline,/function budgetTotals\(/,'financial balance totals');
assert.match(inline,/openingBalance===null\?null/,'unknown balance is not invented');
assert.match(inline,/function budgetExchangeRate\(/,'currency conversion is live source-backed');
assert.match(inline,/api\.frankfurter\.dev\/v2\/rate/,'source URL is explicit');
assert.match(inline,/rateDate:reference\.date,rateSource:reference\.source/,'FX date and rate snapshot persist per transaction');
assert.match(inline,/if\(!saved\.currencyLocked&&!saved\.entries\.length&&saved\.openingBalance===null\)/,'country does not overwrite user budget after entries');
assert.match(inline,/if\(!budgetFxManual\)budgetFxFrom=currency/,'location defaults converter but respects manual choice');
assert.match(inline,/mode:'budget'/,'shared organiser voice UI');
assert.match(page,/<style id="professional-finance-workspace">/,'responsive finance layout exists');
const budgetStart=inline.indexOf("const POCKET_BUDGET_KEY='mypocketai.budget.v1'");
const budgetEnd=inline.indexOf('const TASKS_DRAWINGS=',budgetStart);
assert.ok(budgetStart>=0&&budgetEnd>budgetStart,'finance source is isolated');
const ctx=vm.createContext({
 Date,String,Number,Math,Boolean,Set,Map,Array,Intl,
 navigator:{language:'en-GB'},state:{language:'ro'},
 learningLabel:(a,b)=>a,shopVoiceFold:s=>String(s).toLowerCase(),localStorage:{
 getItem:key=>key==='mypocketai.budget.v1'?JSON.stringify({baseCurrency:'GBP',openingBalance:null,entries:[
 {id:'a',type:'income',title:'Wages',date:'2026-11-06',amount:3500,baseAmount:3500,currency:'GBP'},
 {id:'b',type:'expense',title:'Tesco',date:'2026-11-06',amount:45,baseAmount:45,currency:'GBP'},
 {id:'c',type:'expense',title:'Old',date:'2026-10-30',amount:10,baseAmount:10,currency:'GBP'}
 ]}):null
 },notify:()=>{}
});
vm.runInContext(inline.slice(budgetStart,inline.indexOf('function budgetVoiceStop()',budgetStart)),ctx);
const totals=vm.runInContext('budgetTotals(budgetRead())',ctx);
assert.equal(totals.balance,null,'without opening balance financial balance remains unknown');
assert.equal(totals.income,3500);
assert.equal(totals.expenses,45);
assert.equal(totals.totalChange,3445,'overall change includes prior month');
assert.equal(vm.runInContext("budgetCurrency('GB')",ctx),'GBP');
assert.equal(vm.runInContext("budgetCurrency('RO')",ctx),'RON');
assert.equal(vm.runInContext("budgetCurrency('DE')",ctx),'EUR');

console.log('PASS shopping: fluid workspace, manual checks, legacy lists, archive and carry-over');
