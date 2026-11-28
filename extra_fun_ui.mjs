export const EXTRA_FUN_UI_SCRIPT=String.raw`function extraFunText(ro,en){return learningLabel(ro,en)}function extraFunNode(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}function extraFunScreen(ro,en){document.querySelector('.extra-fun-daily-banner')?.remove();const grid=extraToolsV2Screen(ro,en,()=>extraToolsV2OpenGroup('fun'));grid.classList.add('extra-fun-workspace');grid.parentElement?.classList.add('extra-fun-viewport');extraToolsV2ReturnGroup='fun';return grid;}function extraFunPanel(root,title){const section=extraFunNode('section','extra-fun-panel');if(title)section.append(extraFunNode('h3','',title));root.append(section);return section;}function extraFunControl(parent,label,type,value,placeholder){const holder=extraFunNode('label','extra-fun-label',label);const input=extraFunNode('input','extra-fun-input');input.type=type;input.setAttribute('aria-label',label);input.autocomplete='off';if(value!==undefined)input.value=value;if(placeholder)input.placeholder=placeholder;holder.append(input);parent.append(holder);return input;}function extraFunButton(parent,label,action){const btn=extraFunNode('button','extra-fun-action',label);btn.type='button';btn.onclick=action;parent.append(btn);return btn;}function extraFunSelect(parent,label,opts){const holder=extraFunNode('label','extra-fun-label',label);const el=extraFunNode('select','extra-fun-input');el.setAttribute('aria-label',label);for(const[v,title]of opts){const opt=document.createElement('option');opt.value=v;opt.textContent=title;el.append(opt)}holder.append(el);parent.append(holder);return el;}function extraFunOutput(parent){const p=extraFunNode('div','extra-fun-output');p.setAttribute('role','status');p.setAttribute('aria-live','polite');parent.append(p);return p;}function extraFunLine(out,line){out.append(extraFunNode('p','',line))}function extraFunZodiacWheel(sunLongitude,ascLongitude){const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 320 320');svg.setAttribute('role','img');svg.setAttribute('aria-label',extraFunText('Roata zodiacală simplificată: Soare și ascendent','Simplified zodiac wheel: Sun and ascendant'));svg.classList.add('extra-fun-wheel');const node=(tag,attrs,txt)=>{const x=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs||{}))x.setAttribute(k,String(v));if(txt!==undefined)x.textContent=txt;svg.append(x);return x;};node('circle',{cx:160,cy:160,r:144,fill:'#0a2636',stroke:'#74c8d8','stroke-width':3});node('circle',{cx:160,cy:160,r:112,fill:'none',stroke:'#527d93','stroke-width':2});node('circle',{cx:160,cy:160,r:82,fill:'none',stroke:'#38566d','stroke-width':1});const symbols=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180,b=((i+.5)*30-90)*Math.PI/180;node('path',{d:'M '+(160+112*Math.cos(a))+' '+(160+112*Math.sin(a))+' L '+(160+144*Math.cos(a))+' '+(160+144*Math.sin(a)),stroke:'#638aa1','stroke-width':1.3});node('text',{x:160+128*Math.cos(b),y:160+128*Math.sin(b),'text-anchor':'middle','dominant-baseline':'middle',fill:'#d8e6ed','font-size':18},symbols[i]);}const marker=(lon,fill,label,r)=>{if(!Number.isFinite(lon))return;const a=(lon-90)*Math.PI/180,x=160+r*Math.cos(a),y=160+r*Math.sin(a);node('circle',{cx:x,cy:y,r:8,fill,stroke:'#0c1d2c','stroke-width':2});node('text',{x:x+11,y:y-9,fill,'font-size':12,'font-weight':'bold'},label);};marker(sunLongitude,'#edcc83','☀',98);marker(ascLongitude,'#8ae2ed','ASC',98);node('text',{x:160,y:156,'text-anchor':'middle',fill:'#ecf6fb','font-size':14},'Zodiac tropical');node('text',{x:160,y:175,'text-anchor':'middle',fill:'#adcbd7','font-size':11},'Soare • Ascendent');return svg;}
function extraFunPopup(title){
 const curtain=extraFunNode('div','extra-fun-modal');
 curtain.setAttribute('role','presentation');
 const windowBox=extraFunNode('section','extra-fun-dialog');
 windowBox.setAttribute('role','dialog');windowBox.setAttribute('aria-modal','true');
 const head=extraFunNode('div','extra-fun-dialog-head');
 const heading=extraFunNode('h2','',title),close=extraFunNode('button','extra-fun-close','✕');
 close.type='button';close.setAttribute('aria-label',extraFunText('Închide','Close'));
 const content=extraFunNode('div','extra-fun-dialog-content');
 const previous=document.activeElement;
 const viewport=window.visualViewport;
 const resize=()=>{curtain.style.top=(viewport?.offsetTop||0)+'px';curtain.style.height=(viewport?.height||window.innerHeight)+'px';curtain.style.bottom='auto'};
 const dismiss=()=>{document.removeEventListener('keydown',onKey);viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);curtain.remove();if(previous?.isConnected)previous.focus({preventScroll:true})};
 curtain.pocketDismiss=dismiss;viewport?.addEventListener('resize',resize);viewport?.addEventListener('scroll',resize);resize();
 const onKey=e=>{if(e.key==='Escape'){e.preventDefault();dismiss()}else if(e.key==='Tab'){const fields=[...windowBox.querySelectorAll('button,input,select,[tabindex="0"]')].filter(x=>!x.disabled&&!x.hidden);const first=fields[0],last=fields.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}};
 close.onclick=dismiss;curtain.onclick=e=>{if(e.target===curtain)dismiss()};
 document.addEventListener('keydown',onKey);
 head.append(heading,close);windowBox.append(head,content);curtain.append(windowBox);
 document.body.append(curtain);close.focus();
 return {content,curtain,windowBox,close:dismiss};
}
function extraFunPopupLine(parent,label,text){
 const panel=extraFunNode('section','extra-fun-reading-block');
 panel.append(extraFunNode('h3','',label),extraFunNode('p','',text));
 parent.append(panel);
}
function extraFunAstrology(){
 const root=extraFunScreen('Astrologie și zodii','Astrology and zodiac');
 root.classList.add('extra-fun-form-page');
 const panel=extraFunPanel(root,extraFunText('Horoscop','Horoscope'));
 panel.append(extraFunNode('p','extra-fun-note',extraFunText(
 'Alegi doar zodia și perioada. Nicio coordonată nu este necesară. Interpretări simbolice, pentru divertisment.',
 'Just select a zodiac sign and period. No coordinates needed. Symbolic entertainment readings.')));
 const sign=extraFunSelect(panel,extraFunText('Zodia ta','Your zodiac sign'),FUN_SIGNS.map((s,i)=>[String(i),extraFunText(s[0],s[1])]));
 const period=extraFunSelect(panel,extraFunText('Perioada','Period'),[
 ['day',extraFunText('Astăzi','Today')],['week',extraFunText('Săptămâna aceasta','This week')],['month',extraFunText('Luna aceasta','This month')]]);
 const actions=extraFunNode('div','extra-fun-buttons');panel.append(actions);
 const reading=humor=>{
  const now=new Date(),today=funLocalDateKey(now);
  const key=period.value==='month'?today.slice(0,7)+'-01':
    period.value==='week'?funLocalDateKey(new Date(now.getFullYear(),now.getMonth(),now.getDate()-((now.getDay()+6)%7))):today;
  const idx=Number(sign.value),mode=humor?extraFunText('Horoscop umoristic','Funny horoscope'):extraFunText('Horoscop','Horoscope');
  const pop=extraFunPopup(mode+' · '+FUN_SIGNS[idx][0]);
  const lead=period.value==='day'?'Zilnic':period.value==='week'?'Săptămânal':'Lunar';
  pop.content.append(extraFunNode('p','extra-fun-note',lead+' · '+key+' · '+extraFunText(
   'Previziune simbolică, nu informație științifică despre viitor.','A symbolic reading, not a scientific prediction.')));
  const sun=funSolarLongitude(now),aspect=funSolarAspect(idx*30+15,sun);
  extraFunPopupLine(pop.content,'☀️ Context astronomic','Longitudinea tropicală aproximativă a Soarelui astăzi: '+sun.toFixed(1)+'°. Distanța unghiulară față de mijlocul zodiei selectate: '+aspect.separation.toFixed(1)+'°. Sunt valori astronomice; interpretarea de mai jos rămâne simbolică.');
  if(period.value==='day'){
   for(const line of funHoroscope(idx,key,humor,'day')){
    const split=line.indexOf(' — ');
    extraFunPopupLine(pop.content,split>0?line.slice(0,split):'✦',split>0?line.slice(split+3):line);
   }
  }else{
   const first=new Date(key+'T12:00:00'),days=period.value==='week'?7:
    new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
   const weekday=new Intl.DateTimeFormat('ro-RO',{weekday:'long',day:'numeric',month:'long'});
   pop.content.append(extraFunNode('p','extra-fun-note',
    period.value==='week'?'Horoscopul săptămânal este separat pe fiecare dintre cele 7 zile.':
    'Horoscopul lunar este separat pe fiecare zi a lunii.'));
   for(let d=0;d<days;d++){
    const day=new Date(first.getFullYear(),first.getMonth(),first.getDate()+d,12);
    const dateKey=funLocalDateKey(day),dayBlock=extraFunNode('section','extra-fun-forecast-day');
    dayBlock.append(extraFunNode('h3','',weekday.format(day)));
    for(const part of funDailyForecast(idx,dateKey,humor)){
     const split=part.indexOf(' — ');
     extraFunPopupLine(dayBlock,part.slice(0,split),part.slice(split+3));
    }
    pop.content.append(dayBlock);
   }
  }
  pop.content.append(extraFunNode('p','extra-fun-note',extraFunText(
   'Textele sunt pentru amuzament și reflecție; nu sunt sfaturi medicale sau financiare.',
   'For entertainment and reflection only; not medical or financial advice.')));
 };
 extraFunButton(actions,extraFunText('Citește horoscopul','Read horoscope'),()=>reading(false));
 extraFunButton(actions,extraFunText('Horoscop umoristic','Humorous horoscope'),()=>reading(true));
 const partner=extraFunSelect(panel,extraFunText('Zodia partenerului (opțional)','Partner sign (optional)'),
 FUN_SIGNS.map((s,i)=>[String(i),extraFunText(s[0],s[1])]));
 extraFunButton(panel,extraFunText('Compatibilitate în dragoste','Love compatibility'),()=>{
  const pop=extraFunPopup('❤️ '+funSignLabel(Number(sign.value))+' + '+funSignLabel(Number(partner.value)));
  extraFunPopupLine(pop.content,'Compatibilitate',funCompatibility(Number(sign.value),Number(partner.value)));
  pop.content.append(extraFunNode('p','extra-fun-note','Doar pentru divertisment: compatibilitatea reală ține de oameni, nu de zodii.'));
 });
 const advanced=extraFunNode('details','extra-fun-advanced');
 const summary=extraFunNode('summary','',extraFunText('Astrogramă simplificată / ascendent (opțional)','Simplified birth chart / ascendant (optional)'));
 advanced.append(summary);
 advanced.append(extraFunNode('p','extra-fun-note',extraFunText(
  'Pentru ascendent: data și ora nașterii, orașul nașterii și diferența UTC din acea zi. Coordonatele sunt căutate automat după oraș; nu trebuie să le cunoști.',
  'For rising sign: date and time, birth town and UTC offset on that date. Coordinates are looked up automatically.')));
 const date=extraFunControl(advanced,extraFunText('Data nașterii','Birth date'),'date','');
 date.min='1900-01-01';date.max='2100-12-31';
 const time=extraFunControl(advanced,extraFunText('Ora nașterii','Birth time'),'time','12:00');
 const city=extraFunControl(advanced,extraFunText('Orașul și țara nașterii','Birth city and country'),'text','','ex. Oradea, România');
 const offset=extraFunControl(advanced,extraFunText('UTC la naștere, inclusiv ora de vară','UTC offset at birth, including DST'),'number','');
 offset.step='0.5';offset.min='-12';offset.max='14';
 const note=extraFunNode('p','extra-fun-note',extraFunText(
  'Ora oficială istorică depinde de loc și dată. Dacă nu știi fusul orar, calculează doar zodia sau verifică-l înainte de ascendent.',
  'Historical local time varies by place and date. Verify the UTC offset before relying on the rising sign.'));
 advanced.append(note);
 const status=extraFunOutput(advanced);
 const compute=extraFunButton(advanced,extraFunText('Calculează astrograma simplificată','Calculate simplified birth chart'),async()=>{
  if(compute.disabled)return;
  status.textContent='';const utc=funParseBirth(date.value,time.value,offset.value);
  if(!date.value||!offset.value.trim()||!utc){status.textContent=extraFunText('Completează data, ora și UTC corect.','Enter valid date, time and UTC offset.');return}
  compute.disabled=true;
  const sun=funSolarLongitude(utc),chinese=funChineseZodiac(utc);
  let latitude=null,longitude=null,place='';
  if(city.value.trim()){
   try{
    status.textContent=extraFunText('Caut orașul…','Looking up the city…');
    const res=await fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(city.value.trim())+'&limit=3',{signal:AbortSignal.timeout(8000)});
    if(!res.ok)throw Error('geocoding_http_'+res.status);
    const data=await res.json(),f=data.features?.[0],xy=f?.geometry?.coordinates;
    if(Array.isArray(xy)&&xy.length===2){
     longitude=Number(xy[0]);latitude=Number(xy[1]);
     place=[f.properties?.name,f.properties?.city,f.properties?.country].filter(Boolean).join(', ');
    }
   }catch{status.textContent=extraFunText('Căutarea orașului nu este disponibilă. Zodia solară rămâne calculabilă.','City lookup unavailable; sun sign can still be calculated.')}
  }
  if(!root.isConnected||!compute.isConnected)return;
  const asc=latitude===null?NaN:funAscendantLongitude(utc,latitude,longitude);
  const pop=extraFunPopup(extraFunText('Astrogramă simplificată','Simplified birth chart'));
  extraFunPopupLine(pop.content,'☀️ Zodia solară',funSignLabel(Math.floor(sun/30))+' · '+sun.toFixed(2)+'°');
  if(chinese)extraFunPopupLine(pop.content,'🐉 Zodiac chinezesc',chinese.animal+' ('+chinese.year+')');
  if(place)extraFunPopupLine(pop.content,'📍 Loc identificat',place);
  if(Number.isFinite(asc))extraFunPopupLine(pop.content,'↗ Ascendent',funSignLabel(Math.floor(asc/30))+' · '+asc.toFixed(2)+'°');
  else extraFunPopupLine(pop.content,'↗ Ascendent','Pentru acesta sunt necesare un oraș identificat corect, ora și UTC exacte; în regiuni polare formula nu se aplică.');
  for(const [heading,text]of funBirthReading(Math.floor(sun/30),Number.isFinite(asc)?Math.floor(asc/30):null))extraFunPopupLine(pop.content,heading,text);
  pop.content.append(extraFunZodiacWheel(sun,asc));
  pop.content.append(extraFunNode('p','extra-fun-note','Reprezentare parțială: Soarele și ascendentul, fără pozițiile Lunii, ale celorlalte planete sau casele astrologice. Calcul aproximativ.'));
  status.textContent='';compute.disabled=false;
 });
 root.append(panel,advanced);
}

function extraFunQuoteAttribution(parent,entry){
 if(!entry?.author)return;
 const author=extraFunNode('cite','extra-fun-quote-author',entry.author);author.translate=false;parent.append(author);
}
function extraFunMaximMeaning(text,dateKey){
 const entry=funQuoteEntry(text);if(!entry)return;
 const pop=extraFunPopup(extraFunText('Maxime și aforisme','Maxims and aphorisms'));
 const quote=extraFunNode('blockquote','extra-fun-quote',entry.text);pop.content.append(quote);extraFunQuoteAttribution(pop.content,entry);
 extraFunPopupLine(pop.content,'Ce înseamnă?',entry.meaning);
 extraFunPopupLine(pop.content,'Întrebare pentru tine','În ce situație ți se pare potrivit acest gând? Există și o împrejurare în care nu se aplică?');
 extraFunPopupLine(pop.content,'Colecție','Maxime · aforisme · cugetări · vorbe de duh · proverbe');
 const source=extraFunNode('details','extra-fun-quote-source');source.append(extraFunNode('summary','','Sursă și context'));
 source.append(extraFunNode('p','',entry.source.work+' · '+entry.source.locator));
 if(entry.translation==='own-ro-from-public-domain')source.append(extraFunNode('p','','Traducere proprie în română după textul din sursa indicată; nu o traducere românească publicată atribuită altcuiva.'));
 source.append(extraFunNode('p','','Explicația este o notă editorială, nu face parte din citat.'));
 if(entry.source.url){const link=extraFunNode('a','','Consultă textul-sursă');link.href=entry.source.url;link.target='_blank';link.rel='noopener noreferrer';source.append(link)}
 pop.content.append(source);
}
function extraFunMaxims(){
 const today=funLocalDateKey(new Date()),root=extraFunScreen('Maxima zilei','Thought of the day');
 root.classList.add('extra-fun-library-layout');
 const main=extraFunPanel(root,extraFunText('Maxima de astăzi · ','Today’s thought · ')+today);
 const quote=funDailyMaxim(today),show=extraFunButton(main,'📜 '+quote,()=>extraFunMaximMeaning(quote,today));
 extraFunQuoteAttribution(main,funDailyMaximEntry(today));
 show.classList.add('extra-fun-quote-button');

 const archive=extraFunPanel(root,extraFunText('Zilele anterioare','Previous days'));
 archive.classList.add('extra-fun-library');
 for(let offset=1;offset<=35;offset++){
  const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-offset);
  const key=funLocalDateKey(d),q=funDailyMaxim(key);
  const b=extraFunButton(archive,key+' · '+q,()=>extraFunMaximMeaning(q,key));
  extraFunQuoteAttribution(b,funDailyMaximEntry(key));
  b.classList.add('extra-fun-library-item');
 }
}

function extraFunJokes(){
 const today=funLocalDateKey(new Date()),root=extraFunScreen('Bancul zilei','Joke of the day');
 root.classList.add('extra-fun-jokes-layout');
 const panel=extraFunPanel(root,extraFunText('Bancul zilei · ','Today’s joke · ')+today);
 let index=0;
 const line=extraFunNode('blockquote','extra-fun-quote',funDailyJoke(today));
 panel.append(line);
 panel.classList.add('extra-fun-joke-main');
 const actions=extraFunNode('div','extra-fun-buttons');
 panel.append(actions);
 const itemAt=(offset)=>{
  const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);
  return {date:funLocalDateKey(d),text:funDailyJoke(funLocalDateKey(d))};
 };
 extraFunButton(actions,extraFunText('Alt banc','Another joke'),()=>{
  const item=itemAt(++index);line.textContent=item.text;
 });
 extraFunButton(actions,extraFunText('Colecția de bancuri','Joke collection'),()=>{
  const pop=extraFunPopup(extraFunText('Colecția de bancuri','Joke collection'));
  const selected=extraFunNode('blockquote','extra-fun-quote',line.textContent);
  const list=extraFunNode('div','extra-fun-jokes-archive');
  pop.content.classList.add('extra-fun-joke-reader');pop.content.parentElement.classList.add('extra-fun-joke-dialog');
  pop.content.append(selected,list);
  let shown=0;
  const appendBatch=()=>{
   for(let i=shown;i<Math.min(shown+12,FUN_JOKES.length);i++){
    const item=itemAt(-i);
    const b=extraFunButton(list,String(i+1)+' · '+item.text.slice(0,70)+(item.text.length>70?'…':''),()=>{
     selected.textContent=item.text;
     line.textContent=item.text;
     for(const other of list.querySelectorAll('button'))other.setAttribute('aria-pressed',String(other===b));
    });
    b.classList.add('extra-fun-library-item');
   }
   shown+=12;more.hidden=shown>=FUN_JOKES.length;
  };
  const more=extraFunButton(pop.content,extraFunText('Mai multe bancuri','More jokes'),appendBatch);
  more.classList.add('extra-fun-short-button');
  appendBatch();
 });
}
function extraFunSudoku(root){root.replaceChildren();const pane=extraFunPanel(root,'Sudoku · offline');extraFunHelp(pane,extraFunText('Cum se joacă Sudoku?','How to play Sudoku?'),['Completează fiecare rând cu cifrele 1–9, fără repetări.','Fiecare coloană trebuie să conțină 1–9 o singură dată.','Fiecare pătrat de 3×3 trebuie să conțină 1–9 o singură dată. Cifrele inițiale nu pot fi schimbate.','Alege Ușor la început, apoi verifică. Căsuțele greșite devin roșii.']);const controls=extraFunNode('div','extra-fun-buttons');pane.append(controls);const level=extraFunSelect(controls,extraFunText('Dificultate','Difficulty'),[['easy',extraFunText('Ușor','Easy')],['medium',extraFunText('Mediu','Medium')],['hard',extraFunText('Dificil','Hard')]]);const grid=extraFunNode('div','extra-fun-sudoku');pane.append(grid);const result=extraFunOutput(pane);let generated,serial=0,fields=[],selectedCell=null,history=[];function create(){generated=funSudokuGenerate(level.value,funLocalDateKey(new Date())+'-'+serial++);grid.replaceChildren();fields=[];selectedCell=null;history=[];for(let i=0;i<81;i++){const el=extraFunNode('input','extra-fun-cell');el.type='text';el.inputMode='none';el.readOnly=true;el.maxLength=1;el.dataset.given=String(!!generated.puzzle[i]);el.onclick=()=>{selectedCell=i;fields.forEach((x,j)=>x.classList.toggle('extra-fun-active-cell',j===i));};el.setAttribute('aria-label',extraFunText('Rândul ','Row ')+(Math.floor(i/9)+1)+', '+extraFunText('coloana ','column ')+(i%9+1));el.classList.toggle('extra-fun-box-right',i%9===2||i%9===5);el.classList.toggle('extra-fun-box-bottom',Math.floor(i/9)%3===2);if(generated.puzzle[i]){el.value=String(generated.puzzle[i]);el.readOnly=true;el.classList.add('given')}el.addEventListener('input',()=>{el.value=el.value.replace(/[^1-9]/g,'').slice(0,1);el.classList.remove('incorrect');result.replaceChildren()});fields.push(el);grid.append(el);}result.textContent=extraFunText('Completează cifrele 1–9. '+generated.clues+' indicii.','Fill in digits 1–9. '+generated.clues+' clues.');}const buttons=extraFunNode('div','extra-fun-buttons');pane.append(buttons);extraFunButton(buttons,extraFunText('Verifică','Check'),()=>{let blanks=0,wrong=0;fields.forEach((el,i)=>{if(!el.value)blanks++;else if(Number(el.value)!==generated.solution[i]){wrong++;el.classList.add('incorrect')}});result.textContent=wrong?extraFunText('Există ','There are ')+wrong+extraFunText(' cifre greșite.',' incorrect digits.'):blanks?extraFunText('Corect până acum. Mai lipsesc ','Correct so far. Still missing ')+blanks+extraFunText(' celule.',' cells.'):extraFunText('Felicitări! Sudoku este rezolvat.','Congratulations! Sudoku solved.');});extraFunButton(buttons,extraFunText('Joc nou','New puzzle'),create);extraFunButton(buttons,extraFunText('Șterge completările','Clear entries'),()=>{for(const el of fields)if(el.dataset.given!=='true'){el.value='';el.classList.remove('incorrect')}result.replaceChildren();});const keypad=extraFunNode('div','extra-fun-keypad');pane.insertBefore(keypad,result);function enter(value){if(selectedCell===null||fields[selectedCell].dataset.given==='true'){result.textContent='Atinge întâi o căsuță liberă.';return}const cell=fields[selectedCell];history.push([selectedCell,cell.value]);cell.value=value;cell.classList.remove('incorrect');result.textContent='';}for(let n=1;n<=9;n++)extraFunButton(keypad,String(n),()=>enter(String(n)));extraFunButton(keypad,'⌫',()=>enter(''));extraFunButton(keypad,'↶',()=>{const old=history.pop();if(old){fields[old[0]].value=old[1];fields[old[0]].classList.remove('incorrect')}});level.onchange=create;create();}
function extraFunHelp(panel,title,lines){
 return extraFunButton(panel,'? '+title,()=>{const pop=extraFunPopup(title);for(const line of lines)extraFunPopupLine(pop.content,'',line)});
}

function extraFunWordGame(root,mode,difficulty='dificil'){
 root.replaceChildren();
 const puzzle=funGeneratePuzzle(mode,funPuzzleSeed(),difficulty);
 const arrow=mode==='integrame',title=arrow?'Integramă generată':'Rebus generat';
 const panel=extraFunPanel(root,title);
 panel.classList.add('extra-fun-puzzle-panel');
 const info=extraFunNode('div','extra-fun-game-head');
 info.append(extraFunNode('span','',puzzle.entries.length+' definiții · '+puzzle.width+'×'+puzzle.height));
 const level=extraFunSelect(info,'Complexitate',[['mediu','Mediu · 16 definiții'],['dificil','Dificil · 20 definiții']]);
 level.value=difficulty;
 level.onchange=()=>extraFunWordGame(root,mode,level.value);
 const help=extraFunButton(info,'? Reguli',()=>{
  const pop=extraFunPopup('Cum se joacă '+(arrow?'integrama':'rebusul')+'?');
  const rules=arrow?
   ['Citește definițiile din căsuțele colorate. Săgeata → înseamnă scriere spre dreapta; săgeata ↓ indică scriere în jos.',
   'Atinge definiția colorată: săgeata selectează direcția. Scrie cuvântul întreg în fereastra de răspuns, apoi apasă Aplică. Intersecțiile se completează împreună.',
   'Nu se scrie în căsuțele întunecate; ele separă cuvintele sau conțin definiții.']:
   ['Fiecare număr mic arată începutul unui cuvânt. Definițiile sunt sub careu, separate în Orizontal și Vertical.',
   'Atinge definiția ca să activezi prima căsuță. Cuvintele se întretaie, deci literele comune trebuie să coincidă.',
   'Pătratele negre separă cuvintele. Dacă ai greșit, folosește Verifică pentru a evidenția literele.'];
  for(const line of rules)extraFunPopupLine(pop.content,'',line);
 });
 help.classList.add('extra-fun-short-button');panel.append(info);
 const grid=extraFunNode('div','extra-fun-generated-grid');
 grid.classList.add(arrow?'extra-fun-arrow-layout':'extra-fun-barred-layout');
 grid.style.gridTemplateColumns=arrow?'repeat('+puzzle.width+',minmax(0,1fr))':'repeat(4,minmax(0,1fr)) 5px repeat(5,minmax(0,1fr))';
 grid.style.setProperty('--fun-cols',puzzle.width);
 grid.setAttribute('role','group');grid.setAttribute('aria-label',title);
 panel.append(grid);
 const inputs=new Map(),clueEntries=new Map();
 for(const e of puzzle.entries)clueEntries.set(e.hintRow+','+e.hintCol,e);
 let activeEntry=null;
 const entryCells=e=>Array.from({length:e.word.length},(_,i)=>inputs.get((e.row+(e.dir==='down'?i:0))+','+(e.col+(e.dir==='across'?i:0))));
 function selectEntry(entry){
  activeEntry=entry;
  for(const x of inputs.values())x.wrap.classList.remove('extra-fun-selected-word');
  const cells=entryCells(entry);for(const x of cells)x?.wrap.classList.add('extra-fun-selected-word');
  const pop=extraFunPopup((entry.dir==='across'?'→ Orizontal':'↓ Vertical')+' · '+entry.word.length+' litere');
  pop.content.classList.add('extra-fun-word-editor');
  extraFunPopupLine(pop.content,'Definiție',entry.clue);
  const form=extraFunNode('form','extra-fun-word-form');pop.content.append(form);
  const letters=cells.map(x=>x?.el.value||'·').join('');
  form.append(extraFunNode('p','extra-fun-word-pattern',letters));
  const input=extraFunControl(form,'Răspuns întreg','text',cells.every(x=>x?.el.value)?letters:'');
  input.classList.add('extra-fun-word-answer');input.autocapitalize='characters';input.maxLength=entry.word.length;input.spellcheck=false;
  const feedback=extraFunOutput(form);input.oninput=()=>feedback.textContent='';
  const apply=extraFunButton(form,'Aplică în careu',()=>{});apply.type='submit';
  form.onsubmit=event=>{
   event.preventDefault();
   const value=input.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,'');
   if(value.length!==entry.word.length){feedback.textContent='Scrie exact '+entry.word.length+' litere.';return}
   cells.forEach((x,i)=>{x.el.value=value[i];x.wrap.classList.remove('incorrect')});pop.close();
  };
  input.focus();
 }
 const ordinal=new Map();
 for(const e of puzzle.entries){const key=e.row+','+e.col;if(!ordinal.has(key))ordinal.set(key,e.number)}
 for(let r=0;r<puzzle.height;r++)for(let c=0;c<puzzle.width;c++){
  const cell=puzzle.grid[r*puzzle.width+c],key=r+','+c,wrap=extraFunNode('div','extra-fun-cross-cell');
  if(cell.hint){
   wrap.classList.add('extra-fun-clue-cell');
   const entry=clueEntries.get(key),label=(cell.hint.dir==='across'?'→ ':'↓ ')+cell.hint.clue;
   const b=extraFunNode('button','extra-fun-in-grid-clue',(cell.hint.dir==='across'?'→ ':'↓ ')+cell.hint.clue.slice(0,15));
   b.type='button';b.setAttribute('aria-label',label);
   b.onclick=()=>{if(entry)selectEntry(entry)};
   wrap.append(b);grid.append(wrap);continue;
  }
  if(!cell.letter){wrap.classList.add(cell.bar?'extra-fun-bar-cell':cell.header?'extra-fun-empty-header':'extra-fun-block');grid.append(wrap);continue}
  if(cell.barBottom)wrap.classList.add('extra-fun-bar-bottom');
  if(cell.barRight)wrap.classList.add('extra-fun-bar-right');
  if(!arrow&&ordinal.has(key))wrap.append(extraFunNode('span','extra-fun-index',String(ordinal.get(key))));
  const input=extraFunNode('input','extra-fun-cell');
  input.type='text';input.readOnly=true;input.tabIndex=-1;
  input.onclick=()=>{const candidates=puzzle.entries.filter(e=>Array.from({length:e.word.length},(_,i)=>(e.row+(e.dir==='down'?i:0))+','+(e.col+(e.dir==='across'?i:0))).includes(key));if(candidates.length)selectEntry(candidates.find(e=>e!==activeEntry)||candidates[0])};
  input.maxLength=1;input.autocapitalize='characters';input.autocomplete='off';input.inputMode='text';
  input.setAttribute('aria-label','Rând '+(r+1)+' coloana '+(c+1));
  input.addEventListener('input',()=>{
   input.value=input.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,'').slice(0,1);
   wrap.classList.remove('incorrect');
  });
  wrap.append(input);grid.append(wrap);inputs.set(key,{el:input,wrap,answer:cell.letter});
 }
 if(!arrow){
  const clueBox=extraFunNode('div','extra-fun-clues');panel.append(clueBox);
  for(const dir of ['across','down']){
   clueBox.append(extraFunNode('h4','',dir==='across'?'→ Orizontal':'↓ Vertical'));
   for(const entry of puzzle.entries.filter(x=>x.dir===dir).sort((a,b)=>a.number-b.number)){
    const button=extraFunNode('button','extra-fun-clue',entry.number+'. '+entry.clue+' ('+entry.word.length+')');
    button.type='button';button.onclick=()=>inputs.get(entry.row+','+entry.col)?.el.focus();clueBox.append(button);
   }
  }
 }else{
  panel.append(extraFunNode('p','extra-fun-note','Atinge o definiție → / ↓ pentru direcție și răspuns întreg. Literele comune rămân vizibile în model; atingerea unei intersecții schimbă direcția.'));
 }
 const status=extraFunOutput(panel),buttons=extraFunNode('div','extra-fun-buttons');panel.append(buttons);
 const check=extraFunButton(buttons,'Verifică',()=>{
  let bad=0,empty=0;
  for(const item of inputs.values()){
   item.wrap.classList.remove('incorrect');
   if(!item.el.value)empty++;
   else if(item.el.value!==item.answer){bad++;item.wrap.classList.add('incorrect')}
  }
  status.textContent=bad?'De corectat: '+bad+' litere.':empty?'Corect până acum. Mai lipsesc '+empty+' litere.':'Felicitări, ai rezolvat careul!';
 });
 const clear=extraFunButton(buttons,'Șterge',()=>{
  for(const item of inputs.values()){item.el.value='';item.wrap.classList.remove('incorrect')}
  status.textContent='';
 });
 const fresh=extraFunButton(buttons,'Generează alt careu',()=>extraFunWordGame(root,mode,difficulty));
 for(const b of [check,clear,fresh])b.classList.add('extra-fun-short-button');
}
function extraFunIntegrame(root){return extraFunWordGame(root,'integrame')}
function extraFunGames(){
 const root=extraFunScreen('Jocuri de cuvinte și Sudoku','Word games and Sudoku');
 root.classList.add('extra-fun-game-layout');
 const menu=extraFunPanel(root,extraFunText('Alege jocul','Choose a game'));
 menu.append(extraFunNode('p','extra-fun-note','Fiecare joc se deschide separat. Închide fereastra pentru a schimba jocul.'));
 const launch=(name,render)=>{
  const pop=extraFunPopup(name);pop.curtain.classList.add('extra-fun-game-overlay');
  $('view-module').append(pop.curtain);pop.windowBox.classList.add('extra-fun-game-dialog');
  const content=extraFunNode('div','extra-fun-game-content');pop.content.append(content);render(content);
 };
 extraFunButton(menu,'Sudoku',()=>launch('Sudoku',extraFunSudoku));
 extraFunButton(menu,'Integrame',()=>launch('Integrame',extraFunIntegrame));
}
function extraFunOpen(key){if(key==='fun-astro')return extraFunAstrology();if(key==='fun-maxim')return extraFunMaxims();if(key==='fun-jokes')return extraFunJokes();if(key==='fun-puzzles')return extraFunGames();return extraToolsV2OpenGroup('fun');}function extraFunDailyGreeting(){let storage;try{storage=window.localStorage}catch{return}if(!storage||!document.body)return;if(document.body.classList.contains('pocket-navigation-fullscreen')||document.querySelector('.route-unified-preview,#moduleQuickLayer.open,dialog[open]'))return;const today=funLocalDateKey(new Date()),key='pocketai.fun.maxim.shown.'+today;if(storage.getItem(key)==='1'||document.getElementById('fun-daily-maxim'))return;const notice=extraFunNode('div','extra-fun-daily-banner');notice.id='fun-daily-maxim';notice.setAttribute('role','status');const copy=extraFunNode('div','',extraFunText('Maxima zilei','Thought of the day')+': '+funDailyMaxim(today));extraFunQuoteAttribution(copy,funDailyMaximEntry(today));const close=extraFunNode('button','',extraFunText('Închide','Close'));close.type='button';close.setAttribute('aria-label',extraFunText('Închide maxima zilei','Dismiss daily quote'));close.onclick=()=>notice.remove();notice.append(copy,close);document.body.append(notice);storage.setItem(key,'1');}setTimeout(extraFunDailyGreeting,1250);`;
export const EXTRA_FUN_UI_STYLE=String.raw`#view-module.extra-tools-v2 .extra-fun-workspace{display:flex!important;flex-direction:column!important;gap:12px!important;width:min(100%,720px)!important;margin:auto!important;padding:8px!important;box-sizing:border-box!important}#view-module.extra-tools-v2 .extra-fun-panel{display:flex!important;flex-direction:column!important;gap:10px!important;padding:15px!important;min-width:0!important;border:1px solid #5b99ab!important;border-radius:18px!important;background:#102d40!important;color:#f2f9fd!important}.extra-fun-panel h3{font-size:18px;margin:0}.extra-fun-panel p{line-height:1.45;margin:2px 0}.extra-fun-note{font-size:12px;color:#c4d7df}.extra-fun-label{display:flex;flex-direction:column;gap:5px;font-size:13px;color:#cee2e9}.extra-fun-input{display:block;width:100%;min-width:0;box-sizing:border-box;border-radius:12px;padding:12px;font-size:16px;background:#0a2133;color:#fff;border:1px solid #71c3d1}.extra-fun-coordinates{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.extra-fun-buttons{display:flex;flex-wrap:wrap;gap:9px}.extra-fun-action{flex:1 1 145px;padding:11px;min-height:44px;background:#78304b;color:#fff;border:1px solid #d398b0;border-radius:12px;font-size:14px;font-weight:650;white-space:normal}.extra-fun-output{padding:13px;border:1px solid #568ca0;border-radius:12px;background:#0a2434;color:#f3faff;line-height:1.5}.extra-fun-output:empty{display:none}.extra-fun-quote{margin:4px 0;padding:17px;font-size:19px;font-weight:600;line-height:1.5;border-left:3px solid #75d1de;background:#092735;border-radius:10px}.extra-fun-archive{padding:9px;border-bottom:1px solid #326073}.extra-fun-joke-item{flex:1 1 100%;text-align:left;font-size:13px}.extra-fun-wheel{display:block;width:min(100%,320px);height:auto;margin:12px auto}.extra-fun-sudoku,.extra-fun-crossword{display:grid;gap:0;overflow:hidden;margin:4px auto;border:3px solid #78cad6}.extra-fun-sudoku{grid-template-columns:repeat(9,minmax(0,1fr));width:min(100%,420px);aspect-ratio:1}.extra-fun-crossword{grid-template-columns:repeat(6,minmax(0,1fr));width:min(100%,390px)}#view-module.extra-tools-v2 .extra-fun-cell{box-sizing:border-box!important;display:block!important;width:100%!important;min-width:0!important;height:100%!important;min-height:0!important;padding:0!important;margin:0!important;border:1px solid #387286!important;border-radius:0!important;background:#173447!important;color:#fff!important;text-align:center!important;font-size:clamp(13px,4vw,22px)!important}.extra-fun-crossword .extra-fun-cell{aspect-ratio:1}.extra-fun-cell.given{background:#285267!important}.extra-fun-cell.incorrect{background:#813849!important}.extra-fun-cell.void{background:#081b2a!important}.extra-fun-cell.extra-fun-box-right{border-right:2px solid #a5e4e7!important}.extra-fun-cell.extra-fun-box-bottom{border-bottom:2px solid #a5e4e7!important}.extra-fun-clues{font-size:13px}.extra-fun-daily-banner{position:fixed;z-index:100004;top:calc(8px + env(safe-area-inset-top,0px));left:12px;right:12px;max-width:680px;margin:auto;background:#102d40;color:#fff;border:1px solid #79c7d7;border-radius:16px;box-shadow:0 10px 35px #0009;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;font:500 14px/1.45 system-ui,sans-serif}body.pocket-navigation-fullscreen .extra-fun-daily-banner,body:has(.route-unified-preview) .extra-fun-daily-banner,body:has(#moduleQuickLayer.open) .extra-fun-daily-banner{display:none!important}.extra-fun-daily-banner button{background:#163d4f;color:#fff;border:1px solid #a2d6e0;border-radius:10px;padding:9px 12px;min-height:42px}@media(max-width:400px){.extra-fun-coordinates{grid-template-columns:1fr}}#view-module.extra-tools-v2 #moduleContent{min-height:0!important;overflow:hidden!important}#view-module.extra-tools-v2 .extra-fun-viewport{flex:1 1 auto!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;padding:6px 8px!important}#view-module.extra-tools-v2 .extra-fun-workspace{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important;height:100%!important;min-height:0!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;margin:0 auto!important;padding:5px 6px 16px!important}#view-module.extra-tools-v2 .extra-fun-library-layout{overflow:hidden!important}#view-module.extra-tools-v2 .extra-fun-library-layout>.extra-fun-panel:first-child{flex:0 0 auto!important}#view-module.extra-tools-v2 .extra-fun-library-layout>.extra-fun-library{flex:1 1 auto!important;min-height:0!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important}#view-module.extra-tools-v2 .extra-fun-game-layout{overflow-y:auto!important}#view-module.extra-tools-v2 .extra-fun-game-content{flex:0 0 auto!important;min-width:0!important}#view-module.extra-tools-v2 .extra-fun-help{padding:9px 11px;border:1px solid #41788d;border-radius:10px;background:#0b2636;color:#cfeaf2;font-size:13px;line-height:1.5}#view-module.extra-tools-v2 .extra-fun-help summary,#view-module.extra-tools-v2 .extra-fun-advanced summary{cursor:pointer;font-weight:650;color:#a7e5ed}#view-module.extra-tools-v2 .extra-fun-advanced{padding:14px;border:1px solid #639eb0;border-radius:16px;background:#123346;display:flex;flex-direction:column;gap:10px}#view-module.extra-tools-v2 .extra-fun-advanced:not([open]){display:block}#view-module.extra-tools-v2 .extra-fun-advanced[open]>*{margin-bottom:10px}.extra-fun-modal{position:fixed;inset:0;z-index:1000200;background:#020c16d9;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}.extra-fun-dialog{display:flex;flex-direction:column;min-height:0;max-height:calc(100dvh - 24px);width:min(100%,640px);overflow:hidden;border:2px solid #65b8c9;border-radius:20px;background:linear-gradient(165deg,#13384d,#092435);color:#f5fcff;box-shadow:0 16px 45px #000b}.extra-fun-dialog-head{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:14px;border-bottom:1px solid #3d788e;flex:0 0 auto}.extra-fun-dialog-head h2{font-size:clamp(17px,4.6vw,22px);line-height:1.25;margin:0}.extra-fun-close{flex:0 0 46px;min-height:46px;border:1px solid #d49db1;border-radius:13px;background:#762b49;color:#fff;font-size:22px}.extra-fun-dialog-content{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:14px 17px 26px;line-height:1.55}.extra-fun-reading-block{border-bottom:1px solid #335e70;padding:10px 0}.extra-fun-reading-block h3{font-size:15px;color:#9be2ec;margin:0 0 7px}.extra-fun-reading-block p{font-size:15px;color:#f4f9fa;margin:0}.extra-fun-reading-block:last-child{border-bottom:none}#view-module.extra-tools-v2 .extra-fun-crossword,#view-module.extra-tools-v2 .extra-fun-arrow-grid{display:grid!important;gap:1px!important;width:min(100%,425px)!important;height:auto!important;margin:6px auto 12px!important;border:2px solid #8fc7d1!important;background:#396879!important}.extra-fun-cross-cell{position:relative;min-width:0;aspect-ratio:1;background:#f5fafc}.extra-fun-block{background:#092130}#view-module.extra-tools-v2 .extra-fun-cross-cell .extra-fun-cell{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;color:#103347!important;background:#f5fafc!important;font-weight:700!important;font-size:clamp(13px,3.5vw,19px)!important;text-align:center!important;padding:4px 0 0!important;border:0!important}.extra-fun-cross-cell.incorrect .extra-fun-cell{background:#ffa8a8!important}.extra-fun-index{position:absolute;z-index:2;top:1px;left:2px;font-size:clamp(7px,1.7vw,9px);line-height:1;color:#2a5d70;pointer-events:none}.extra-fun-axis{display:flex;align-items:center;justify-content:center;font-size:clamp(9px,2vw,12px);font-weight:700;min-height:21px;color:#d9eef3}.extra-fun-clues{display:flex;flex-direction:column;gap:5px}.extra-fun-clues h4{color:#b0e5eb;margin:8px 0 2px}.extra-fun-clue{min-height:38px;text-align:left;padding:8px 10px;border-radius:9px;border:1px solid #4b8398;background:#18384c;color:#fff;font-size:13px}.extra-fun-arrow-hint{display:flex;justify-content:center;align-items:center;min-width:0;overflow:hidden;padding:2px 3px;background:#22516b;color:#fff;font-size:clamp(8px,2vw,11px);line-height:1.1;text-align:center}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-action,#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-clue,#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-library-item,.extra-fun-modal .extra-fun-action,.extra-fun-modal .extra-fun-close,.extra-fun-daily-banner button{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;align-self:flex-start!important;min-height:40px!important;max-height:none!important;width:auto!important;max-width:100%!important;margin:0!important;padding:9px 14px!important;background:linear-gradient(155deg,#15715e,#0d493e)!important;border:1px solid #4bd2b6!important;border-radius:12px!important;color:#f2fff9!important;font-size:13px!important;font-weight:650!important;box-shadow:0 2px 0 #062d28!important;white-space:normal!important;line-height:1.3!important;text-align:center!important;}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-buttons{justify-content:flex-start!important;gap:8px!important}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-short-button{flex:0 0 auto!important;min-width:88px!important}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-quote-button{display:block!important;width:100%!important;text-align:left!important;min-height:68px!important;font-size:16px!important;line-height:1.5!important;padding:14px 16px!important;}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-library-item{justify-content:flex-start!important;text-align:left!important;width:100%!important;min-height:48px!important;margin-bottom:7px!important;font-size:13px!important;line-height:1.4!important;}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-library{overflow-y:auto!important;overscroll-behavior:contain!important}#view-module.extra-tools-v2 .extra-fun-game-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:12px;color:#b8e4de}#view-module.extra-tools-v2 .extra-fun-puzzle-panel{padding:10px 8px!important}#view-module.extra-tools-v2 .extra-fun-generated-grid{display:grid!important;gap:1px!important;width:min(100%,420px)!important;max-width:420px!important;margin:6px auto 12px!important;padding:1px!important;box-sizing:border-box!important;background:#286457!important;border:2px solid #51bba6!important;border-radius:3px!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-cross-cell{aspect-ratio:1!important;min-width:0!important;overflow:hidden!important}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-block{background:#0a2630!important}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-clue-cell{background:#165947!important}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-in-grid-clue{display:block!important;position:absolute!important;inset:0!important;overflow:hidden!important;width:100%!important;height:100%!important;min-height:0!important;padding:1px!important;margin:0!important;border:0!important;border-radius:0!important;background:#1b6954!important;color:#fff!important;font:650 clamp(6px,1.5vw,9px)/1.05 sans-serif!important;word-break:break-word!important;text-align:center!important;box-sizing:border-box!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-cross-cell .extra-fun-cell{font-size:clamp(12px,3.5vw,20px)!important;padding:4px 0 0!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-index{font-size:8px!important}.extra-fun-forecast-day{padding:13px 0;border-top:1px solid #4a8997}.extra-fun-forecast-day h3{margin:0 0 9px!important;color:#9ce8d6!important;font-size:17px!important;text-transform:capitalize}.extra-fun-forecast-day .extra-fun-reading-block{padding:6px 0!important;border-bottom:0!important}.extra-fun-modal .extra-fun-close{flex:0 0 45px!important;padding:5px!important;font-size:19px!important}#view-module.extra-tools-v2 .extra-fun-workspace select.extra-fun-input{background:#114c3e!important;border-color:#53c5aa!important;color:#f7fff9!important}#view-module.extra-tools-v2 .extra-fun-workspace select.extra-fun-input option{background:#114c3e;color:#fff}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-action,#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-clue,#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-library-item,.extra-fun-modal .extra-fun-action,.extra-fun-modal .extra-fun-close,.extra-fun-daily-banner button{background:linear-gradient(130deg,#155b59 0%,#103a4b 100%)!important;border:1.5px solid #66bdc3!important;color:#f6fdff!important;box-shadow:0 3px 4px #03162477!important;}#view-module.extra-tools-v2 .extra-fun-workspace .extra-fun-input,#view-module.extra-tools-v2 .extra-fun-workspace select.extra-fun-input,#view-module.extra-tools-v2 .extra-fun-workspace input.extra-fun-input{width:100%!important;box-sizing:border-box!important;background:#112f43!important;color:#eef9fc!important;border:2px solid #6bbdd1!important;border-radius:13px!important;box-shadow:inset 0 1px 3px #07182580!important;}#view-module.extra-tools-v2 .extra-fun-workspace select.extra-fun-input option{background:#112f43!important;color:#f1fcff!important}#view-module.extra-tools-v2 .extra-fun-game-head{flex-wrap:wrap;align-items:flex-end!important;gap:10px!important}#view-module.extra-tools-v2 .extra-fun-game-head .extra-fun-label{display:flex!important;max-width:240px!important;flex:1 1 145px!important}#view-module.extra-tools-v2 .extra-fun-game-head .extra-fun-input{padding:8px 10px!important;font-size:13px!important}#view-module.extra-tools-v2 .extra-fun-generated-grid{gap:1px!important;background:#6fbfc2!important;border:2px solid #5eafb9!important;max-width:430px!important;}#view-module.extra-tools-v2 .extra-fun-barred-layout{grid-auto-flow:row!important}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-bar-cell{background:linear-gradient(90deg,#0e4250,#2b7071)!important;border-left:1px solid #72c2c1!important;border-right:1px solid #72c2c1!important;aspect-ratio:auto!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-empty-header{background:#19445a!important;border:1px solid #285d70!important;aspect-ratio:1!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-bar-bottom{border-bottom:3px solid #2b7980!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-clue-cell{background:#175e5e!important;border:1px solid #62b4b6!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-in-grid-clue{background:#176567!important;color:#faffff!important;font:650 clamp(6px,1.6vw,9px)/1.1 sans-serif!important;overflow:hidden!important;overflow-wrap:anywhere!important;}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-cross-cell .extra-fun-cell{background:#f3fbfe!important;color:#173e52!important;font-weight:750!important;}#view-module.extra-tools-v2 .extra-fun-jokes-layout{overflow-y:auto!important;}.extra-fun-modal .extra-fun-jokes-archive{display:flex;flex-direction:column;gap:9px;margin:14px 0!important;}.extra-fun-modal .extra-fun-jokes-archive .extra-fun-library-item{display:block!important;width:100%!important;text-align:left!important;min-height:48px!important;}.extra-fun-modal .extra-fun-dialog-content{overscroll-behavior:contain!important}#view-module.extra-tools-v2 .extra-fun-generated-grid .extra-fun-bar-right{border-right:3px solid #2b7980!important}
/* Final mobile constraints: separate scroll frames, not page hunting. */
#view-module.extra-tools-v2 .extra-fun-jokes-layout{overflow:hidden!important;display:flex!important;flex-direction:column!important;min-height:0!important}
#view-module.extra-tools-v2 .extra-fun-joke-main{display:flex!important;flex-direction:column!important;min-height:0!important;flex:1!important;overflow:hidden!important}
#view-module.extra-tools-v2 .extra-fun-joke-main .extra-fun-quote{min-height:0!important;flex:1!important;overflow:auto!important;font-size:18px!important;line-height:1.6!important;white-space:pre-line!important}
.extra-fun-modal .extra-fun-joke-reader{display:flex!important;flex-direction:column!important;overflow:hidden!important;min-height:0!important}
.extra-fun-modal .extra-fun-joke-reader>.extra-fun-quote{flex:0 1 48%!important;min-height:90px!important;overflow:auto!important;margin:0!important;font-size:18px!important;line-height:1.6!important;white-space:pre-line!important}
.extra-fun-modal .extra-fun-joke-reader>.extra-fun-jokes-archive{flex:1!important;min-height:55px!important;overflow-y:auto!important;margin:8px 0!important;overscroll-behavior:contain!important}
.extra-fun-modal .extra-fun-joke-reader>button{flex-shrink:0!important}
.extra-fun-modal .extra-fun-word-answer{font-size:20px!important;letter-spacing:2px;text-transform:uppercase}
.extra-fun-modal .extra-fun-word-pattern{font:600 22px monospace;letter-spacing:3px;overflow-wrap:anywhere}
#view-module.extra-tools-v2 .extra-fun-selected-word{outline:2px solid #f4b959!important;outline-offset:-2px}
#view-module.extra-tools-v2 .extra-fun-keypad{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:4px!important;margin:8px 0!important}
#view-module.extra-tools-v2 .extra-fun-keypad button{min-width:0!important;min-height:38px!important;padding:4px!important;font-size:18px!important}
#view-module.extra-tools-v2 .extra-fun-active-cell{outline:3px solid #efa92e!important;outline-offset:-3px}
.extra-fun-modal .extra-fun-word-editor{scroll-padding-bottom:12px!important}

.extra-fun-modal .extra-fun-joke-dialog{height:min(720px,100%)!important;max-height:100%!important}
.extra-fun-modal .extra-fun-dialog{max-height:100%!important}
#view-module.extra-tools-v2 .extra-fun-game-layout{overflow:hidden!important}
#view-module.extra-tools-v2 .extra-fun-game-layout>.extra-fun-panel{flex:0 0 auto!important;padding:9px!important;gap:5px!important}
#view-module.extra-tools-v2 .extra-fun-game-content{flex:1 1 0!important;min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important}
#view-module.extra-tools-v2 .extra-fun-sudoku{width:min(100%,340px,max(225px,calc(100dvh - 390px)))!important}

.extra-fun-modal button[hidden]{display:none!important}

/* Dedicated games: grid, keypad and actions share one bounded window. */
#view-module.extra-tools-v2 .extra-fun-game-dialog{height:100%!important;max-width:510px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog>.extra-fun-dialog-content{padding:6px!important;overflow:auto!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-game-content{overflow:visible!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-panel{padding:6px!important;gap:5px!important;border:0!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-panel>h3{display:none!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-sudoku{width:min(100%,340px,max(216px,calc(100dvh - 330px)))!important;margin:0 auto!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-buttons{gap:5px!important;flex-wrap:wrap!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-action{min-height:32px!important;padding:5px 7px!important;font-size:12px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-keypad{margin:0!important;grid-template-columns:repeat(11,minmax(0,1fr))!important;gap:2px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-keypad button{font-size:16px!important;padding:4px 1px!important;min-height:38px!important;width:100%!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-output{padding:4px 7px!important;font-size:12px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-label{flex-direction:row!important;align-items:center!important;gap:8px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-input{padding:5px!important;font-size:14px!important}
#view-module.extra-tools-v2 .extra-fun-game-dialog .extra-fun-generated-grid{width:min(100%,380px)!important;margin:0 auto!important}

#view-module.extra-tools-v2 .extra-fun-sudoku .extra-fun-cell.given{background:#315c70!important;font-weight:800!important;color:#fff!important}
#view-module.extra-tools-v2 .extra-fun-sudoku .extra-fun-cell.extra-fun-box-right{border-right:3px solid #b4edf2!important}
#view-module.extra-tools-v2 .extra-fun-sudoku .extra-fun-cell.extra-fun-box-bottom{border-bottom:3px solid #b4edf2!important}

.extra-fun-quote-author{display:block!important;font-style:normal!important;font-weight:650!important;color:#9ee5dc!important;font-size:14px!important;line-height:1.4!important;margin:6px 0 0!important;white-space:normal!important}
.extra-fun-quote-source{padding:12px;border:1px solid #497c8f;border-radius:12px;font-size:13px;margin:10px 0}
.extra-fun-quote-source a{color:#a6eaff;text-decoration:underline}
#view-module.extra-tools-v2 .extra-fun-quote-button{white-space:pre-line!important}
#view-module.extra-tools-v2 .extra-fun-library-item:has(.extra-fun-quote-author){display:block!important}

.extra-fun-modal .extra-fun-quote{white-space:pre-line!important}
`;
