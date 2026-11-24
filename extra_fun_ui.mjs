export const EXTRA_FUN_UI_SCRIPT=String.raw`
function extraFunText(ro,en){return learningLabel(ro,en)}
function extraFunNode(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function extraFunScreen(ro,en){
 const grid=extraToolsV2Screen(ro,en,()=>extraToolsV2OpenGroup('fun'));
 grid.classList.add('extra-fun-workspace');
 extraToolsV2ReturnGroup='fun';
 return grid;
}
function extraFunPanel(root,title){
 const section=extraFunNode('section','extra-fun-panel');
 if(title)section.append(extraFunNode('h3','',title));
 root.append(section);return section;
}
function extraFunControl(parent,label,type,value,placeholder){
 const holder=extraFunNode('label','extra-fun-label',label);
 const input=extraFunNode('input','extra-fun-input');
 input.type=type;input.autocomplete='off';
 if(value!==undefined)input.value=value;
 if(placeholder)input.placeholder=placeholder;
 holder.append(input);parent.append(holder);return input;
}
function extraFunButton(parent,label,action){
 const btn=extraFunNode('button','extra-fun-action',label);btn.type='button';btn.onclick=action;parent.append(btn);return btn;
}
function extraFunSelect(parent,label,opts){
 const holder=extraFunNode('label','extra-fun-label',label);
 const el=extraFunNode('select','extra-fun-input');
 for(const [v,title] of opts){const opt=document.createElement('option');opt.value=v;opt.textContent=title;el.append(opt)}
 holder.append(el);parent.append(holder);return el;
}
function extraFunOutput(parent){
 const p=extraFunNode('div','extra-fun-output');p.setAttribute('role','status');p.setAttribute('aria-live','polite');parent.append(p);return p;
}
function extraFunLine(out,line){out.append(extraFunNode('p','',line))}
function extraFunAstrology(){
 const root=extraFunScreen('Astrologie și zodii','Astrology and zodiac');
 const intro=extraFunPanel(root,extraFunText('Calcul astronomic, interpretare pentru divertisment','Astronomical calculation, entertainment interpretation'));
 intro.append(extraFunNode('p','extra-fun-note',extraFunText(
  'Zodiac tropical: longitudinea aparentă a Soarelui, calcul aproximativ. Ascendentul folosește ora UTC, longitudinea și latitudinea nașterii; ora și fusul trebuie cunoscute corect. Interpretările nu sunt predicții științifice.',
  'Tropical zodiac: approximate apparent solar longitude. Rising sign uses UTC birth time, longitude and latitude; enter the correct historic UTC offset. Readings are not scientific predictions.')));
 const controls=extraFunPanel(root,extraFunText('Date pentru calcul','Details for calculation'));
 const date=extraFunControl(controls,extraFunText('Data nașterii','Birth date'),'date','','');
 date.min='1900-01-01';date.max='2100-12-31';
 const time=extraFunControl(controls,extraFunText('Ora locală a nașterii','Local birth time'),'time','12:00');
 const offset=extraFunControl(controls,extraFunText('Diferența UTC la naștere (ore, inclusiv ora de vară)','UTC offset at birth (hours, including daylight saving)'),'number','0','ex. 2 sau -5');
 offset.min='-12';offset.max='14';offset.step='0.25';
 const coords=extraFunNode('div','extra-fun-coordinates');controls.append(coords);
 const lat=extraFunControl(coords,extraFunText('Latitudine (N pozitiv)','Latitude (north positive)'),'number','','ex. 51.5');
 const lon=extraFunControl(coords,extraFunText('Longitudine (E pozitiv)','Longitude (east positive)'),'number','','ex. -0.12');
 lat.step=lon.step='any';lat.min='-66.49';lat.max='66.49';lon.min='-180';lon.max='180';
 const sign=extraFunSelect(controls,extraFunText('Zodie pentru horoscop','Sign for horoscope'),
  FUN_SIGNS.map((s,i)=>[String(i),extraFunText(s[0],s[1])]));
 const partner=extraFunSelect(controls,extraFunText('A doua zodie (compatibilitate)','Second sign (compatibility)'),
  FUN_SIGNS.map((s,i)=>[String(i),extraFunText(s[0],s[1])]));
 const actions=extraFunNode('div','extra-fun-buttons');controls.append(actions);
 const out=extraFunOutput(root);
 extraFunButton(actions,extraFunText('Calculează zodia și ascendentul','Calculate sun sign and ascendant'),()=>{
  out.replaceChildren();const utc=funParseBirth(date.value,time.value||'12:00',offset.value);
  if(!utc){extraFunLine(out,extraFunText('Introdu o dată validă (1900–2100), ora și diferența UTC.','Enter a valid date (1900–2100), time and UTC offset.'));return}
  const solar=funSolarLongitude(utc),idx=funSunSign(utc);
  sign.value=String(idx);
  extraFunLine(out,extraFunText('Zodie solară tropicală: ','Tropical sun sign: ')+
   extraFunText(FUN_SIGNS[idx][0],FUN_SIGNS[idx][1])+' ('+solar.toFixed(2)+'°).');
  if(lat.value.trim()!==''&&lon.value.trim()!==''){
   const asc=funAscendantLongitude(utc,lat.value,lon.value);
   if(Number.isFinite(asc))extraFunLine(out,extraFunText('Ascendent aproximativ: ','Approximate ascendant: ')+
    extraFunText(FUN_SIGNS[Math.floor(asc/30)][0],FUN_SIGNS[Math.floor(asc/30)][1])+' ('+asc.toFixed(2)+'°).');
   else extraFunLine(out,extraFunText('Coordonate în afara intervalului permis; calculul ascendentului nu este disponibil în apropierea regiunilor polare.','Coordinates outside supported range; ascendant unavailable near polar regions.'));
  }else extraFunLine(out,extraFunText('Pentru ascendent introdu și coordonatele locului nașterii.','Add birth coordinates to calculate the ascendant.'));
 });
 const renderReading=humor=>{
  out.replaceChildren();const idx=Number(sign.value),today=funLocalDateKey(new Date());
  extraFunLine(out,(humor?'😄 ':'☀️ ')+extraFunText('Horoscop umoristic','Humorous reading')+' — '+funSignLabel(idx)+' · '+today);
  for(const line of funHoroscope(idx,today,humor))extraFunLine(out,line);
  extraFunLine(out,extraFunText('Text creativ pentru divertisment, nu o prognoză astronomică.','Creative entertainment, not an astronomical forecast.'));
 };
 extraFunButton(actions,extraFunText('Horoscop serios · azi','Daily reading'),()=>renderReading(false));
 extraFunButton(actions,extraFunText('Horoscop umoristic · azi','Humorous daily reading'),()=>renderReading(true));
 extraFunButton(actions,extraFunText('Compatibilitate în dragoste','Romantic compatibility'),()=>{
  out.replaceChildren();
  extraFunLine(out,funSignLabel(Number(sign.value))+' + '+funSignLabel(Number(partner.value))+': '+
    funCompatibility(Number(sign.value),Number(partner.value)));
  extraFunLine(out,extraFunText('Doar joc simbolic, nu evaluare reală a unei relații.','Symbolic entertainment, not a relationship assessment.'));
 });
}
function extraFunMaxims(){
 const root=extraFunScreen('Maxima zilei','Quote of the day'),today=funLocalDateKey(new Date());
 const main=extraFunPanel(root,extraFunText('Maxima de astăzi · '+today,'Today’s thought · '+today));
 main.append(extraFunNode('blockquote','extra-fun-quote',funDailyPick(FUN_MAXIMS,today)));
 const archive=extraFunPanel(root,extraFunText('Colecția de cugetări','Thought collection'));
 FUN_MAXIMS.forEach((q,i)=>archive.append(extraFunNode('p','extra-fun-archive',(i+1)+'. '+q)));
}
function extraFunJokes(){
 const root=extraFunScreen('Bancul zilei','Joke of the day'),today=funLocalDateKey(new Date());
 const panel=extraFunPanel(root,extraFunText('Bancul de astăzi · '+today,'Today’s joke · '+today));
 const line=extraFunNode('blockquote','extra-fun-quote',funDailyPick(FUN_JOKES,today));panel.append(line);
 let index=funModulo(funDayNumber(today),FUN_JOKES.length);
 extraFunButton(panel,extraFunText('Următorul banc din colecție','Next joke'),()=>{
  index=(index+1)%FUN_JOKES.length;line.textContent=FUN_JOKES[index];
 });
 const collection=extraFunPanel(root,extraFunText('Colecție','Collection'));
 FUN_JOKES.forEach((j,i)=>{
  const b=extraFunButton(collection,(i+1)+'. '+j.slice(0,58)+(j.length>58?'…':''),()=>{
   line.textContent=j;panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  });b.classList.add('extra-fun-joke-item');
 });
}
function extraFunSudoku(root){
 root.replaceChildren();
 const pane=extraFunPanel(root,'Sudoku · offline');
 const controls=extraFunNode('div','extra-fun-buttons');pane.append(controls);
 const level=extraFunSelect(controls,extraFunText('Dificultate','Difficulty'),
  [['easy',extraFunText('Ușor','Easy')],['medium',extraFunText('Mediu','Medium')],['hard',extraFunText('Dificil','Hard')]]);
 const grid=extraFunNode('div','extra-fun-sudoku');pane.append(grid);
 const result=extraFunOutput(pane);
 let generated,serial=0,fields=[];
 function create(){
  generated=funSudokuGenerate(level.value,funLocalDateKey(new Date())+'-'+serial++);
  grid.replaceChildren();fields=[];
  for(let i=0;i<81;i++){
   const el=extraFunNode('input','extra-fun-cell');
   el.type='text';el.inputMode='numeric';el.maxLength=1;
   el.setAttribute('aria-label',extraFunText('Rândul ','Row ')+(Math.floor(i/9)+1)+', '+
    extraFunText('coloana ','column ')+(i%9+1));
   el.classList.toggle('extra-fun-box-right',i%9===2||i%9===5);
   el.classList.toggle('extra-fun-box-bottom',Math.floor(i/9)%3===2);
   if(generated.puzzle[i]){el.value=String(generated.puzzle[i]);el.readOnly=true;el.classList.add('given')}
   el.addEventListener('input',()=>{el.value=el.value.replace(/[^1-9]/g,'').slice(0,1);el.classList.remove('incorrect');result.replaceChildren()});
   fields.push(el);grid.append(el);
  }
  result.textContent=extraFunText('Completează cifrele 1–9. '+generated.clues+' indicii.','Fill in digits 1–9. '+generated.clues+' clues.');
 }
 const buttons=extraFunNode('div','extra-fun-buttons');pane.append(buttons);
 extraFunButton(buttons,extraFunText('Verifică','Check'),()=>{
  let blanks=0,wrong=0;
  fields.forEach((el,i)=>{if(!el.value)blanks++;else if(Number(el.value)!==generated.solution[i]){wrong++;el.classList.add('incorrect')}});
  result.textContent=wrong?extraFunText('Există ','There are ')+wrong+extraFunText(' cifre greșite.',' incorrect digits.'):
   blanks?extraFunText('Corect până acum. Mai lipsesc ','Correct so far. Still missing ')+blanks+extraFunText(' celule.',' cells.'):
    extraFunText('Felicitări! Sudoku este rezolvat.','Congratulations! Sudoku solved.');
 });
 extraFunButton(buttons,extraFunText('Joc nou','New puzzle'),create);
 extraFunButton(buttons,extraFunText('Șterge completările','Clear entries'),()=>{
  for(const el of fields)if(!el.readOnly){el.value='';el.classList.remove('incorrect')}
  result.replaceChildren();
 });
 create();
}
function extraFunCrossword(root){
 root.replaceChildren();const pane=extraFunPanel(root,extraFunText('Mini-rebus · offline','Mini crossword · offline'));
 const board=Array.from({length:4},()=>Array(6).fill(null));
 for(const word of FUN_CROSSWORD)for(let i=0;i<word.word.length;i++){
  const r=word.row+(word.dir==='down'?i:0),c=word.col+(word.dir==='across'?i:0);
  if(r<4&&c<6)board[r][c]=word.word[i];
 }
 const grid=extraFunNode('div','extra-fun-crossword');pane.append(grid);const fields=[];
 for(let r=0;r<4;r++)for(let c=0;c<6;c++){
  const letter=board[r][c],el=extraFunNode('input','extra-fun-cell');
  if(letter){
   el.type='text';el.maxLength=1;el.autocomplete='off';el.autocapitalize='characters';
   el.setAttribute('aria-label','r '+(r+1)+' c '+(c+1));
   el.addEventListener('input',()=>{el.value=el.value.replace(/[^A-Za-zĂÂÎȘȚăâîșț]/g,'').toUpperCase().slice(0,1);el.classList.remove('incorrect')});
   fields.push({el,answer:letter});
  }else{el.disabled=true;el.classList.add('void')}
  grid.append(el);
 }
 const clues=extraFunNode('div','extra-fun-clues');pane.append(clues);
 FUN_CROSSWORD.forEach((w,i)=>clues.append(extraFunNode('p','',(i+1)+'. '+
   (w.dir==='across'?'→ ':'↓ ')+w.clue+' ('+w.word.length+')')));
 const result=extraFunOutput(pane);
 const buttons=extraFunNode('div','extra-fun-buttons');pane.append(buttons);
 extraFunButton(buttons,extraFunText('Verifică rebusul','Check crossword'),()=>{
  let blank=0,wrong=0;
  fields.forEach(({el,answer})=>{
   if(!el.value)blank++;else if(el.value!==answer){wrong++;el.classList.add('incorrect')}
  });
  result.textContent=wrong?extraFunText('Există litere de corectat: ','Letters to correct: ')+wrong:
   blank?extraFunText('Mai sunt căsuțe libere: ','Empty cells remaining: ')+blank:
    extraFunText('Bravo! Ai completat rebusul.','Great! Crossword completed.');
 });
 extraFunButton(buttons,extraFunText('Șterge','Clear'),()=>{
  for(const {el} of fields){el.value='';el.classList.remove('incorrect')}
  result.replaceChildren();
 });
 pane.append(extraFunNode('p','extra-fun-note',extraFunText('Prima integramă offline. Colecția de grile va fi extinsă.','First offline crossword; the collection will be expanded.')));
}
function extraFunGames(){
 const root=extraFunScreen('Integrame, rebus și Sudoku','Crosswords and Sudoku');
 const menu=extraFunPanel(root,extraFunText('Alege un joc offline','Choose an offline game'));
 const content=extraFunNode('div','extra-fun-game-content');root.append(content);
 const row=extraFunNode('div','extra-fun-buttons');menu.append(row);
 extraFunButton(row,'Sudoku',()=>extraFunSudoku(content));
 extraFunButton(row,extraFunText('Mini-rebus','Mini crossword'),()=>extraFunCrossword(content));
 extraFunSudoku(content);
}
function extraFunOpen(key){
 if(key==='fun-astro')return extraFunAstrology();
 if(key==='fun-maxim')return extraFunMaxims();
 if(key==='fun-jokes')return extraFunJokes();
 if(key==='fun-puzzles')return extraFunGames();
 return extraToolsV2OpenGroup('fun');
}
function extraFunDailyGreeting(){
 let storage;try{storage=window.localStorage}catch{return}
 if(!storage||!document.body)return;
 const today=funLocalDateKey(new Date()),key='pocketai.fun.maxim.shown.'+today;
 if(storage.getItem(key)==='1'||document.getElementById('fun-daily-maxim'))return;
 const notice=extraFunNode('div','extra-fun-daily-banner');notice.id='fun-daily-maxim';
 notice.setAttribute('role','status');
 const copy=extraFunNode('div','',extraFunText('Maxima zilei','Thought of the day')+': '+funDailyPick(FUN_MAXIMS,today));
 const close=extraFunNode('button','',extraFunText('Închide','Close'));
 close.type='button';close.setAttribute('aria-label',extraFunText('Închide maxima zilei','Dismiss daily quote'));
 close.onclick=()=>notice.remove();notice.append(copy,close);
 document.body.append(notice);storage.setItem(key,'1');
}
setTimeout(extraFunDailyGreeting,1250);
`;
export const EXTRA_FUN_UI_STYLE=String.raw`
#view-module.extra-tools-v2 .extra-fun-workspace{
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 gap:12px!important;width:min(100%,720px)!important;margin:0 auto!important;padding:8px!important;
 box-sizing:border-box!important;
}
#view-module.extra-tools-v2 .extra-fun-panel{
 display:flex;flex-direction:column;gap:10px;padding:15px;
 border:1px solid #5b99ab;border-radius:18px;
 background:linear-gradient(160deg,#15384d,#0c2435);color:#f2f9fd;min-width:0;
}
#view-module.extra-tools-v2 .extra-fun-panel h3{font-size:18px;margin:0 0 4px}
#view-module.extra-tools-v2 .extra-fun-panel p{line-height:1.45;margin:2px 0}
#view-module.extra-tools-v2 .extra-fun-note{font-size:12px;color:#c4d7df}
#view-module.extra-tools-v2 .extra-fun-label{display:flex;flex-direction:column;gap:5px;font-size:13px;color:#cee2e9}
#view-module.extra-tools-v2 .extra-fun-input{
 display:block;width:100%;min-width:0;box-sizing:border-box;border-radius:12px;
 padding:12px;font:inherit;font-size:16px;background:#0a2133;color:#fff;border:1px solid #71c3d1;
}
#view-module.extra-tools-v2 .extra-fun-coordinates{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#view-module.extra-tools-v2 .extra-fun-buttons{display:flex;flex-wrap:wrap;gap:9px;align-items:center}
#view-module.extra-tools-v2 .extra-fun-action{
 min-width:0;flex:1 1 145px;padding:11px 12px;min-height:44px;
 background:linear-gradient(150deg,#78304b,#59243e);color:white;
 border:1px solid #d398b0;border-radius:12px;font-size:14px;font-weight:650;
 text-align:center;white-space:normal;
}
#view-module.extra-tools-v2 .extra-fun-output{
 padding:13px;border:1px solid #568ca0;border-radius:12px;
 background:#0a2434;color:#f3faff;min-height:30px;line-height:1.5;
}
#view-module.extra-tools-v2 .extra-fun-output:empty{display:none}
#view-module.extra-tools-v2 .extra-fun-quote{
 margin:4px 0;padding:17px;font-size:19px;font-weight:600;line-height:1.5;
 border-left:3px solid #75d1de;background:#092735;border-radius:10px;
}
#view-module.extra-tools-v2 .extra-fun-archive{padding:9px;border-bottom:1px solid #326073}
#view-module.extra-tools-v2 .extra-fun-joke-item{display:block;text-align:left;flex:1 1 100%;font-size:13px}
#view-module.extra-tools-v2 .extra-fun-sudoku{
 display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:0;overflow:hidden;
 border:3px solid #78cad6;border-radius:6px;width:min(100%,420px);aspect-ratio:1;margin:4px auto;
}
#view-module.extra-tools-v2 .extra-fun-crossword{
 display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;
 width:min(100%,390px);margin:4px auto;background:#337489;border:2px solid #78cad6;
}
#view-module.extra-tools-v2 .extra-fun-cell{
 display:block!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;
 height:100%!important;min-height:0!important;margin:0!important;padding:0!important;
 border:1px solid #387286!important;border-radius:0!important;
 background:#173447!important;color:#fff!important;text-align:center!important;
 font-size:clamp(13px,4vw,22px)!important;font-weight:650!important;line-height:1!important;
}
#view-module.extra-tools-v2 .extra-fun-crossword .extra-fun-cell{aspect-ratio:1}
#view-module.extra-tools-v2 .extra-fun-cell.given{background:#285267!important;color:#d7f2f6!important}
#view-module.extra-tools-v2 .extra-fun-cell.incorrect{background:#813849!important}
#view-module.extra-tools-v2 .extra-fun-cell.void{background:#081b2a!important;border-color:#081b2a!important}
#view-module.extra-tools-v2 .extra-fun-cell.extra-fun-box-right{border-right:2px solid #a5e4e7!important}
#view-module.extra-tools-v2 .extra-fun-cell.extra-fun-box-bottom{border-bottom:2px solid #a5e4e7!important}
#view-module.extra-tools-v2 .extra-fun-clues{display:flex;flex-direction:column;gap:6px;font-size:13px}
.extra-fun-daily-banner{
 position:fixed;z-index:100004;left:12px;right:12px;top:calc(8px + env(safe-area-inset-top,0px));
 background:#102d40;color:#fff;border:1px solid #79c7d7;border-radius:16px;
 box-shadow:0 10px 35px #0009;padding:14px;
 display:flex;align-items:center;justify-content:space-between;gap:12px;
 max-width:680px;margin:0 auto;font:500 14px/1.45 system-ui,sans-serif;
}
.extra-fun-daily-banner button{border:1px solid #a2d6e0;background:#163d4f;color:#fff;
 border-radius:10px;padding:9px 12px;min-width:72px;min-height:42px}
@media(max-width:400px){
 #view-module.extra-tools-v2 .extra-fun-coordinates{grid-template-columns:1fr}
}
`;
