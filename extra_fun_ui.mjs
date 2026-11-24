export const EXTRA_FUN_UI_SCRIPT=String.raw`function extraFunText(ro,en){return learningLabel(ro,en)}function extraFunNode(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}function extraFunScreen(ro,en){const grid=extraToolsV2Screen(ro,en,()=>extraToolsV2OpenGroup('fun'));grid.classList.add('extra-fun-workspace');grid.parentElement?.classList.add('extra-fun-viewport');extraToolsV2ReturnGroup='fun';return grid;}function extraFunPanel(root,title){const section=extraFunNode('section','extra-fun-panel');if(title)section.append(extraFunNode('h3','',title));root.append(section);return section;}function extraFunControl(parent,label,type,value,placeholder){const holder=extraFunNode('label','extra-fun-label',label);const input=extraFunNode('input','extra-fun-input');input.type=type;input.autocomplete='off';if(value!==undefined)input.value=value;if(placeholder)input.placeholder=placeholder;holder.append(input);parent.append(holder);return input;}function extraFunButton(parent,label,action){const btn=extraFunNode('button','extra-fun-action',label);btn.type='button';btn.onclick=action;parent.append(btn);return btn;}function extraFunSelect(parent,label,opts){const holder=extraFunNode('label','extra-fun-label',label);const el=extraFunNode('select','extra-fun-input');for(const[v,title]of opts){const opt=document.createElement('option');opt.value=v;opt.textContent=title;el.append(opt)}holder.append(el);parent.append(holder);return el;}function extraFunOutput(parent){const p=extraFunNode('div','extra-fun-output');p.setAttribute('role','status');p.setAttribute('aria-live','polite');parent.append(p);return p;}function extraFunLine(out,line){out.append(extraFunNode('p','',line))}function extraFunZodiacWheel(sunLongitude,ascLongitude){const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 320 320');svg.setAttribute('role','img');svg.setAttribute('aria-label',extraFunText('Roata zodiacală simplificată: Soare și ascendent','Simplified zodiac wheel: Sun and ascendant'));svg.classList.add('extra-fun-wheel');const node=(tag,attrs,txt)=>{const x=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs||{}))x.setAttribute(k,String(v));if(txt!==undefined)x.textContent=txt;svg.append(x);return x;};node('circle',{cx:160,cy:160,r:144,fill:'#0a2636',stroke:'#74c8d8','stroke-width':3});node('circle',{cx:160,cy:160,r:112,fill:'none',stroke:'#527d93','stroke-width':2});node('circle',{cx:160,cy:160,r:82,fill:'none',stroke:'#38566d','stroke-width':1});const symbols=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180,b=((i+.5)*30-90)*Math.PI/180;node('path',{d:'M '+(160+112*Math.cos(a))+' '+(160+112*Math.sin(a))+' L '+(160+144*Math.cos(a))+' '+(160+144*Math.sin(a)),stroke:'#638aa1','stroke-width':1.3});node('text',{x:160+128*Math.cos(b),y:160+128*Math.sin(b),'text-anchor':'middle','dominant-baseline':'middle',fill:'#d8e6ed','font-size':18},symbols[i]);}const marker=(lon,fill,label,r)=>{if(!Number.isFinite(lon))return;const a=(lon-90)*Math.PI/180,x=160+r*Math.cos(a),y=160+r*Math.sin(a);node('circle',{cx:x,cy:y,r:8,fill,stroke:'#0c1d2c','stroke-width':2});node('text',{x:x+11,y:y-9,fill,'font-size':12,'font-weight':'bold'},label);};marker(sunLongitude,'#edcc83','☀',98);marker(ascLongitude,'#8ae2ed','ASC',98);node('text',{x:160,y:156,'text-anchor':'middle',fill:'#ecf6fb','font-size':14},'Zodiac tropical');node('text',{x:160,y:175,'text-anchor':'middle',fill:'#adcbd7','font-size':11},'Soare • Ascendent');return svg;}
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
 const dismiss=()=>{document.removeEventListener('keydown',onKey);curtain.remove();if(previous?.isConnected)previous.focus()};
 const onKey=e=>{if(e.key==='Escape'){e.preventDefault();dismiss()}};
 close.onclick=dismiss;curtain.onclick=e=>{if(e.target===curtain)dismiss()};
 document.addEventListener('keydown',onKey);
 head.append(heading,close);windowBox.append(head,content);curtain.append(windowBox);
 document.body.append(curtain);close.focus();
 return {content,close:dismiss};
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
  const lines=funHoroscope(idx,key,humor,period.value);
  for(const line of lines){
   const split=line.indexOf(' — ');
   extraFunPopupLine(pop.content,split>0?line.slice(0,split):'✦',split>0?line.slice(split+3):line);
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
  status.textContent='';const utc=funParseBirth(date.value,time.value,offset.value);
  if(!date.value||!offset.value.trim()||!utc){status.textContent=extraFunText('Completează data, ora și UTC corect.','Enter valid date, time and UTC offset.');return}
  const sun=funSolarLongitude(utc),chinese=funChineseZodiac(utc);
  let latitude=null,longitude=null,place='';
  if(city.value.trim()){
   try{
    status.textContent=extraFunText('Caut orașul…','Looking up the city…');
    const res=await fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(city.value.trim())+'&limit=3');
    if(!res.ok)throw Error('geocoding_http_'+res.status);
    const data=await res.json(),f=data.features?.[0],xy=f?.geometry?.coordinates;
    if(Array.isArray(xy)&&xy.length===2){
     longitude=Number(xy[0]);latitude=Number(xy[1]);
     place=[f.properties?.name,f.properties?.city,f.properties?.country].filter(Boolean).join(', ');
    }
   }catch{status.textContent=extraFunText('Căutarea orașului nu este disponibilă. Zodia solară rămâne calculabilă.','City lookup unavailable; sun sign can still be calculated.')}
  }
  const asc=latitude===null?NaN:funAscendantLongitude(utc,latitude,longitude);
  const pop=extraFunPopup(extraFunText('Astrogramă simplificată','Simplified birth chart'));
  extraFunPopupLine(pop.content,'☀️ Zodia solară',funSignLabel(Math.floor(sun/30))+' · '+sun.toFixed(2)+'°');
  if(chinese)extraFunPopupLine(pop.content,'🐉 Zodiac chinezesc',chinese.animal+' ('+chinese.year+')');
  if(place)extraFunPopupLine(pop.content,'📍 Loc identificat',place);
  if(Number.isFinite(asc))extraFunPopupLine(pop.content,'↗ Ascendent',funSignLabel(Math.floor(asc/30))+' · '+asc.toFixed(2)+'°');
  else extraFunPopupLine(pop.content,'↗ Ascendent','Pentru acesta sunt necesare un oraș identificat corect, ora și UTC exacte; în regiuni polare formula nu se aplică.');
  pop.content.append(extraFunZodiacWheel(sun,asc));
  pop.content.append(extraFunNode('p','extra-fun-note','Reprezentare parțială: Soarele și ascendentul, fără pozițiile Lunii, ale celorlalte planete sau casele astrologice. Calcul aproximativ.'));
  status.textContent='';
 });
 root.append(panel,advanced);
}
function extraFunMaxims(){const root=extraFunScreen('Maxima zilei','Quote of the day'),today=funLocalDateKey(new Date());root.classList.add('extra-fun-library-layout');const main=extraFunPanel(root,extraFunText('Maxima de astăzi · '+today,'Today’s thought · '+today));main.append(extraFunNode('blockquote','extra-fun-quote',funDailyPick(FUN_MAXIMS,today)));const archive=extraFunPanel(root,extraFunText('Colecția de cugetări','Thought collection'));archive.classList.add('extra-fun-library');FUN_MAXIMS.forEach((q,i)=>archive.append(extraFunNode('p','extra-fun-archive',(i+1)+'. '+q)));}function extraFunJokes(){const root=extraFunScreen('Bancul zilei','Joke of the day'),today=funLocalDateKey(new Date());root.classList.add('extra-fun-library-layout');const panel=extraFunPanel(root,extraFunText('Bancul de astăzi · '+today,'Today’s joke · '+today));const line=extraFunNode('blockquote','extra-fun-quote',funDailyPick(FUN_JOKES,today));panel.append(line);let index=funModulo(funDayNumber(today),FUN_JOKES.length);extraFunButton(panel,extraFunText('Următorul banc din colecție','Next joke'),()=>{index=(index+1)%FUN_JOKES.length;line.textContent=FUN_JOKES[index];});const collection=extraFunPanel(root,extraFunText('Colecție','Collection'));collection.classList.add('extra-fun-library');FUN_JOKES.forEach((j,i)=>{const b=extraFunButton(collection,(i+1)+'. '+j.slice(0,58)+(j.length>58?'…':''),()=>{line.textContent=j;});b.classList.add('extra-fun-joke-item');});}function extraFunSudoku(root){root.replaceChildren();const pane=extraFunPanel(root,'Sudoku · offline');extraFunHelp(pane,extraFunText('Cum se joacă Sudoku?','How to play Sudoku?'),['Completează fiecare rând cu cifrele 1–9, fără repetări.','Fiecare coloană trebuie să conțină 1–9 o singură dată.','Fiecare pătrat de 3×3 trebuie să conțină 1–9 o singură dată. Cifrele inițiale nu pot fi schimbate.','Alege Ușor la început, apoi verifică. Căsuțele greșite devin roșii.']);const controls=extraFunNode('div','extra-fun-buttons');pane.append(controls);const level=extraFunSelect(controls,extraFunText('Dificultate','Difficulty'),[['easy',extraFunText('Ușor','Easy')],['medium',extraFunText('Mediu','Medium')],['hard',extraFunText('Dificil','Hard')]]);const grid=extraFunNode('div','extra-fun-sudoku');pane.append(grid);const result=extraFunOutput(pane);let generated,serial=0,fields=[];function create(){generated=funSudokuGenerate(level.value,funLocalDateKey(new Date())+'-'+serial++);grid.replaceChildren();fields=[];for(let i=0;i<81;i++){const el=extraFunNode('input','extra-fun-cell');el.type='text';el.inputMode='numeric';el.maxLength=1;el.setAttribute('aria-label',extraFunText('Rândul ','Row ')+(Math.floor(i/9)+1)+', '+extraFunText('coloana ','column ')+(i%9+1));el.classList.toggle('extra-fun-box-right',i%9===2||i%9===5);el.classList.toggle('extra-fun-box-bottom',Math.floor(i/9)%3===2);if(generated.puzzle[i]){el.value=String(generated.puzzle[i]);el.readOnly=true;el.classList.add('given')}el.addEventListener('input',()=>{el.value=el.value.replace(/[^1-9]/g,'').slice(0,1);el.classList.remove('incorrect');result.replaceChildren()});fields.push(el);grid.append(el);}result.textContent=extraFunText('Completează cifrele 1–9. '+generated.clues+' indicii.','Fill in digits 1–9. '+generated.clues+' clues.');}const buttons=extraFunNode('div','extra-fun-buttons');pane.append(buttons);extraFunButton(buttons,extraFunText('Verifică','Check'),()=>{let blanks=0,wrong=0;fields.forEach((el,i)=>{if(!el.value)blanks++;else if(Number(el.value)!==generated.solution[i]){wrong++;el.classList.add('incorrect')}});result.textContent=wrong?extraFunText('Există ','There are ')+wrong+extraFunText(' cifre greșite.',' incorrect digits.'):blanks?extraFunText('Corect până acum. Mai lipsesc ','Correct so far. Still missing ')+blanks+extraFunText(' celule.',' cells.'):extraFunText('Felicitări! Sudoku este rezolvat.','Congratulations! Sudoku solved.');});extraFunButton(buttons,extraFunText('Joc nou','New puzzle'),create);extraFunButton(buttons,extraFunText('Șterge completările','Clear entries'),()=>{for(const el of fields)if(!el.readOnly){el.value='';el.classList.remove('incorrect')}result.replaceChildren();});create();}
function extraFunHelp(panel,title,lines){
 const details=extraFunNode('details','extra-fun-help');
 details.append(extraFunNode('summary','',title));
 for(const line of lines)details.append(extraFunNode('p','',line));
 panel.append(details);return details;
}
function extraFunCrossword(root,setIndex=0){const set=FUN_CROSSWORD_SETS[setIndex%FUN_CROSSWORD_SETS.length];
 root.replaceChildren();
 const panel=extraFunPanel(root,extraFunText('Rebus clasic · careul ','Classic crossword · puzzle ')+(setIndex%FUN_CROSSWORD_SETS.length+1));
 extraFunHelp(panel,extraFunText('Cum se rezolvă rebusul?','How to play?'),[
 'Numerele mici arată de unde începe fiecare cuvânt; literele se completează orizontal (→) sau vertical (↓).',
 'Căsuțele negre separă cuvintele. Literele comune din intersecții trebuie să fie aceleași.',
 'Coloanele A–I și rândurile 1–7 te ajută să găsești poziția indicată la fiecare definiție.'
 ]);
 const R=7,C=9,letters=Array.from({length:R*C},()=>null),startNums={},wordEntries=set.slice()
 .sort((a,b)=>a.row-b.row||a.col-b.col||a.dir.localeCompare(b.dir));
 wordEntries.forEach((w,i)=>{
  w.number=i+1;startNums[w.row+','+w.col]=(startNums[w.row+','+w.col]||[]).concat(i+1);
  for(let t=0;t<w.word.length;t++){
   const r=w.row+(w.dir==='down'?t:0),c=w.col+(w.dir==='across'?t:0);
   letters[r*C+c]=w.word[t];
  }
 });
 const grid=extraFunNode('div','extra-fun-crossword');panel.append(grid);
 grid.style.gridTemplateColumns='20px repeat('+C+',minmax(0,1fr))';
 grid.append(extraFunNode('span','extra-fun-axis',''));
 for(let c=0;c<C;c++)grid.append(extraFunNode('span','extra-fun-axis',String.fromCharCode(65+c)));
 const inputs=new Map();
 for(let r=0;r<R;r++){
  grid.append(extraFunNode('span','extra-fun-axis',String(r+1)));
  for(let c=0;c<C;c++){
   const key=r+','+c,answer=letters[r*C+c],wrap=extraFunNode('div','extra-fun-cross-cell');
   if(!answer){wrap.classList.add('extra-fun-block');grid.append(wrap);continue}
   const nums=startNums[key];
   if(nums)wrap.append(extraFunNode('span','extra-fun-index',nums.join('/')));
   const el=extraFunNode('input','extra-fun-cell');el.type='text';el.maxLength=1;
   el.inputMode='text';el.autocapitalize='characters';el.autocomplete='off';
   el.setAttribute('aria-label',String.fromCharCode(65+c)+(r+1)+(nums?' început '+nums.join('/'):''));
   el.addEventListener('input',()=>{
    el.value=el.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z]/g,'').slice(0,1);
    wrap.classList.remove('incorrect');
   });
   wrap.append(el);grid.append(wrap);inputs.set(key,{el,wrap,answer});
  }
 }
 const clues=extraFunNode('div','extra-fun-clues');panel.append(clues);
 for(const dir of ['across','down']){
  const h=extraFunNode('h4','',dir==='across'?'→ Orizontal':'↓ Vertical');clues.append(h);
  for(const w of wordEntries.filter(x=>x.dir===dir)){
   const pos=String.fromCharCode(65+w.col)+(w.row+1);
   const b=extraFunNode('button','extra-fun-clue',w.number+'. '+w.clue+' ('+w.word.length+') · '+pos);
   b.type='button';b.onclick=()=>inputs.get(w.row+','+w.col)?.el.focus();
   clues.append(b);
  }
 }
 const result=extraFunOutput(panel),actions=extraFunNode('div','extra-fun-buttons');panel.append(actions);
 extraFunButton(actions,extraFunText('Verifică','Check'),()=>{
  let wrong=0,blank=0;
  for(const x of inputs.values()){x.wrap.classList.remove('incorrect');if(!x.el.value)blank++;else if(x.el.value!==x.answer){wrong++;x.wrap.classList.add('incorrect')}}
  result.textContent=wrong?'De corectat: '+wrong+' litere.':blank?'Corect până acum. Lipsesc '+blank+' litere.':'Felicitări, rebus completat!';
 });
 extraFunButton(actions,extraFunText('Șterge','Clear'),()=>{for(const x of inputs.values()){x.el.value='';x.wrap.classList.remove('incorrect')}result.textContent=''});
 extraFunButton(actions,extraFunText('Alt careu','Another puzzle'),()=>extraFunCrossword(root,setIndex+1));
}
function extraFunIntegrame(root,setIndex=0){const set=FUN_CROSSWORD_SETS[setIndex%FUN_CROSSWORD_SETS.length];
 root.replaceChildren();
 const panel=extraFunPanel(root,extraFunText('Integramă · careul ','Arrowword · puzzle ')+(setIndex%FUN_CROSSWORD_SETS.length+1));
 extraFunHelp(panel,extraFunText('Cum se joacă integra­mele?','How do arrowwords work?'),[
 'Definiția se află în căsuța închisă la culoare. Săgeata → indică un cuvânt scris către dreapta.',
 'Săgeata ↓ indică un cuvânt scris de sus în jos. Literele se întâlnesc în intersecții.',
 'Atinge o căsuță albă și scrie o literă. Verifică la final; pătratele negre nu se completează.'
 ]);
 const R=8,C=10,board=Array.from({length:R*C},()=>null),values=new Map();
 // The vertical word ROMANIA crosses all four horizontal answers.
 const across=set.filter(w=>w.dir==='across');
 for(const w of set){
  const row=w.dir==='down'?1:w.row+1,col=w.dir==='down'?5:w.col+1;
  for(let i=0;i<w.word.length;i++){
   const r=row+(w.dir==='down'?i:0),c=col+(w.dir==='across'?i:0);
   board[r*C+c]=w.word[i];
  }
 }
 const grid=extraFunNode('div','extra-fun-arrow-grid');grid.style.gridTemplateColumns='repeat('+C+',minmax(0,1fr))';panel.append(grid);
 const rowHints=new Map(across.map(w=>[w.row+1,w.clue]));
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  if(r===0&&c===5){
   const clue=extraFunNode('span','extra-fun-arrow-hint', '↓ '+set.find(w=>w.dir==='down').clue);
   clue.style.gridColumn='6 / span 4';grid.append(clue);c+=3;continue;
  }
  if(rowHints.has(r)&&c===0){
   const clue=extraFunNode('span','extra-fun-arrow-hint','→ '+rowHints.get(r));
   clue.style.gridColumn='1 / span 3';grid.append(clue);c+=2;continue;
  }
  const target=board[r*C+c],wrap=extraFunNode('div','extra-fun-cross-cell');
  if(!target){wrap.classList.add('extra-fun-block');grid.append(wrap);continue}
  const el=extraFunNode('input','extra-fun-cell');el.type='text';el.maxLength=1;el.autocapitalize='characters';el.autocomplete='off';
  el.setAttribute('aria-label','Rând '+r+', coloana '+(c+1));
  el.addEventListener('input',()=>{el.value=el.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z]/g,'').slice(0,1);wrap.classList.remove('incorrect')});
  wrap.append(el);grid.append(wrap);values.set(r+','+c,{el,wrap,answer:target});
 }
 const result=extraFunOutput(panel),buttons=extraFunNode('div','extra-fun-buttons');panel.append(buttons);
 extraFunButton(buttons,'Verifică',()=>{
  let wrong=0,empty=0;for(const x of values.values()){x.wrap.classList.remove('incorrect');if(!x.el.value)empty++;else if(x.el.value!==x.answer){wrong++;x.wrap.classList.add('incorrect')}}
  result.textContent=wrong?'Ai '+wrong+' litere de corectat.':empty?'Mai lipsesc '+empty+' litere.':'Integramă rezolvată!';
 });
 extraFunButton(buttons,'Șterge',()=>{for(const x of values.values()){x.el.value='';x.wrap.classList.remove('incorrect')}result.textContent=''});
 extraFunButton(buttons,'Altă integramă',()=>extraFunIntegrame(root,setIndex+1));
}
function extraFunGames(){
 const root=extraFunScreen('Jocuri de cuvinte și Sudoku','Word games and Sudoku');
 root.classList.add('extra-fun-game-layout');
 const menu=extraFunPanel(root,extraFunText('Alege jocul','Choose a game'));
 const content=extraFunNode('div','extra-fun-game-content');root.append(content);
 const tabs=extraFunNode('div','extra-fun-buttons');menu.append(tabs);
 extraFunButton(tabs,'Sudoku',()=>extraFunSudoku(content));
 extraFunButton(tabs,'Rebus',()=>extraFunCrossword(content));
 extraFunButton(tabs,extraFunText('Integrame','Arrowwords'),()=>extraFunIntegrame(content));
 extraFunSudoku(content);
}
function extraFunOpen(key){if(key==='fun-astro')return extraFunAstrology();if(key==='fun-maxim')return extraFunMaxims();if(key==='fun-jokes')return extraFunJokes();if(key==='fun-puzzles')return extraFunGames();return extraToolsV2OpenGroup('fun');}function extraFunDailyGreeting(){let storage;try{storage=window.localStorage}catch{return}if(!storage||!document.body)return;const today=funLocalDateKey(new Date()),key='pocketai.fun.maxim.shown.'+today;if(storage.getItem(key)==='1'||document.getElementById('fun-daily-maxim'))return;const notice=extraFunNode('div','extra-fun-daily-banner');notice.id='fun-daily-maxim';notice.setAttribute('role','status');const copy=extraFunNode('div','',extraFunText('Maxima zilei','Thought of the day')+': '+funDailyPick(FUN_MAXIMS,today));const close=extraFunNode('button','',extraFunText('Închide','Close'));close.type='button';close.setAttribute('aria-label',extraFunText('Închide maxima zilei','Dismiss daily quote'));close.onclick=()=>notice.remove();notice.append(copy,close);document.body.append(notice);storage.setItem(key,'1');}setTimeout(extraFunDailyGreeting,1250);`;
export const EXTRA_FUN_UI_STYLE=String.raw`#view-module.extra-tools-v2 .extra-fun-workspace{display:flex!important;flex-direction:column!important;gap:12px!important;width:min(100%,720px)!important;margin:auto!important;padding:8px!important;box-sizing:border-box!important}#view-module.extra-tools-v2 .extra-fun-panel{display:flex!important;flex-direction:column!important;gap:10px!important;padding:15px!important;min-width:0!important;border:1px solid #5b99ab!important;border-radius:18px!important;background:#102d40!important;color:#f2f9fd!important}.extra-fun-panel h3{font-size:18px;margin:0}.extra-fun-panel p{line-height:1.45;margin:2px 0}.extra-fun-note{font-size:12px;color:#c4d7df}.extra-fun-label{display:flex;flex-direction:column;gap:5px;font-size:13px;color:#cee2e9}.extra-fun-input{display:block;width:100%;min-width:0;box-sizing:border-box;border-radius:12px;padding:12px;font-size:16px;background:#0a2133;color:#fff;border:1px solid #71c3d1}.extra-fun-coordinates{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.extra-fun-buttons{display:flex;flex-wrap:wrap;gap:9px}.extra-fun-action{flex:1 1 145px;padding:11px;min-height:44px;background:#78304b;color:#fff;border:1px solid #d398b0;border-radius:12px;font-size:14px;font-weight:650;white-space:normal}.extra-fun-output{padding:13px;border:1px solid #568ca0;border-radius:12px;background:#0a2434;color:#f3faff;line-height:1.5}.extra-fun-output:empty{display:none}.extra-fun-quote{margin:4px 0;padding:17px;font-size:19px;font-weight:600;line-height:1.5;border-left:3px solid #75d1de;background:#092735;border-radius:10px}.extra-fun-archive{padding:9px;border-bottom:1px solid #326073}.extra-fun-joke-item{flex:1 1 100%;text-align:left;font-size:13px}.extra-fun-wheel{display:block;width:min(100%,320px);height:auto;margin:12px auto}.extra-fun-sudoku,.extra-fun-crossword{display:grid;gap:0;overflow:hidden;margin:4px auto;border:3px solid #78cad6}.extra-fun-sudoku{grid-template-columns:repeat(9,minmax(0,1fr));width:min(100%,420px);aspect-ratio:1}.extra-fun-crossword{grid-template-columns:repeat(6,minmax(0,1fr));width:min(100%,390px)}#view-module.extra-tools-v2 .extra-fun-cell{box-sizing:border-box!important;display:block!important;width:100%!important;min-width:0!important;height:100%!important;min-height:0!important;padding:0!important;margin:0!important;border:1px solid #387286!important;border-radius:0!important;background:#173447!important;color:#fff!important;text-align:center!important;font-size:clamp(13px,4vw,22px)!important}.extra-fun-crossword .extra-fun-cell{aspect-ratio:1}.extra-fun-cell.given{background:#285267!important}.extra-fun-cell.incorrect{background:#813849!important}.extra-fun-cell.void{background:#081b2a!important}.extra-fun-cell.extra-fun-box-right{border-right:2px solid #a5e4e7!important}.extra-fun-cell.extra-fun-box-bottom{border-bottom:2px solid #a5e4e7!important}.extra-fun-clues{font-size:13px}.extra-fun-daily-banner{position:fixed;z-index:100004;top:calc(8px + env(safe-area-inset-top,0px));left:12px;right:12px;max-width:680px;margin:auto;background:#102d40;color:#fff;border:1px solid #79c7d7;border-radius:16px;box-shadow:0 10px 35px #0009;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;font:500 14px/1.45 system-ui,sans-serif}.extra-fun-daily-banner button{background:#163d4f;color:#fff;border:1px solid #a2d6e0;border-radius:10px;padding:9px 12px;min-height:42px}@media(max-width:400px){.extra-fun-coordinates{grid-template-columns:1fr}}#view-module.extra-tools-v2 #moduleContent{min-height:0!important;overflow:hidden!important}#view-module.extra-tools-v2 .extra-fun-viewport{flex:1 1 auto!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;padding:6px 8px!important}#view-module.extra-tools-v2 .extra-fun-workspace{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important;height:100%!important;min-height:0!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;margin:0 auto!important;padding:5px 6px 16px!important}#view-module.extra-tools-v2 .extra-fun-library-layout{overflow:hidden!important}#view-module.extra-tools-v2 .extra-fun-library-layout>.extra-fun-panel:first-child{flex:0 0 auto!important}#view-module.extra-tools-v2 .extra-fun-library-layout>.extra-fun-library{flex:1 1 auto!important;min-height:0!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important}#view-module.extra-tools-v2 .extra-fun-game-layout{overflow-y:auto!important}#view-module.extra-tools-v2 .extra-fun-game-content{flex:0 0 auto!important;min-width:0!important}#view-module.extra-tools-v2 .extra-fun-help{padding:9px 11px;border:1px solid #41788d;border-radius:10px;background:#0b2636;color:#cfeaf2;font-size:13px;line-height:1.5}#view-module.extra-tools-v2 .extra-fun-help summary,#view-module.extra-tools-v2 .extra-fun-advanced summary{cursor:pointer;font-weight:650;color:#a7e5ed}#view-module.extra-tools-v2 .extra-fun-advanced{padding:14px;border:1px solid #639eb0;border-radius:16px;background:#123346;display:flex;flex-direction:column;gap:10px}#view-module.extra-tools-v2 .extra-fun-advanced:not([open]){display:block}#view-module.extra-tools-v2 .extra-fun-advanced[open]>*{margin-bottom:10px}.extra-fun-modal{position:fixed;inset:0;z-index:1000200;background:#020c16d9;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}.extra-fun-dialog{display:flex;flex-direction:column;min-height:0;max-height:calc(100dvh - 24px);width:min(100%,640px);overflow:hidden;border:2px solid #65b8c9;border-radius:20px;background:linear-gradient(165deg,#13384d,#092435);color:#f5fcff;box-shadow:0 16px 45px #000b}.extra-fun-dialog-head{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:14px;border-bottom:1px solid #3d788e;flex:0 0 auto}.extra-fun-dialog-head h2{font-size:clamp(17px,4.6vw,22px);line-height:1.25;margin:0}.extra-fun-close{flex:0 0 46px;min-height:46px;border:1px solid #d49db1;border-radius:13px;background:#762b49;color:#fff;font-size:22px}.extra-fun-dialog-content{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:14px 17px 26px;line-height:1.55}.extra-fun-reading-block{border-bottom:1px solid #335e70;padding:10px 0}.extra-fun-reading-block h3{font-size:15px;color:#9be2ec;margin:0 0 7px}.extra-fun-reading-block p{font-size:15px;color:#f4f9fa;margin:0}.extra-fun-reading-block:last-child{border-bottom:none}#view-module.extra-tools-v2 .extra-fun-crossword,#view-module.extra-tools-v2 .extra-fun-arrow-grid{display:grid!important;gap:1px!important;width:min(100%,425px)!important;height:auto!important;margin:6px auto 12px!important;border:2px solid #8fc7d1!important;background:#396879!important}.extra-fun-cross-cell{position:relative;min-width:0;aspect-ratio:1;background:#f5fafc}.extra-fun-block{background:#092130}#view-module.extra-tools-v2 .extra-fun-cross-cell .extra-fun-cell{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;color:#103347!important;background:#f5fafc!important;font-weight:700!important;font-size:clamp(13px,3.5vw,19px)!important;text-align:center!important;padding:4px 0 0!important;border:0!important}.extra-fun-cross-cell.incorrect .extra-fun-cell{background:#ffa8a8!important}.extra-fun-index{position:absolute;z-index:2;top:1px;left:2px;font-size:clamp(7px,1.7vw,9px);line-height:1;color:#2a5d70;pointer-events:none}.extra-fun-axis{display:flex;align-items:center;justify-content:center;font-size:clamp(9px,2vw,12px);font-weight:700;min-height:21px;color:#d9eef3}.extra-fun-clues{display:flex;flex-direction:column;gap:5px}.extra-fun-clues h4{color:#b0e5eb;margin:8px 0 2px}.extra-fun-clue{min-height:38px;text-align:left;padding:8px 10px;border-radius:9px;border:1px solid #4b8398;background:#18384c;color:#fff;font-size:13px}.extra-fun-arrow-hint{display:flex;justify-content:center;align-items:center;min-width:0;overflow:hidden;padding:2px 3px;background:#22516b;color:#fff;font-size:clamp(8px,2vw,11px);line-height:1.1;text-align:center}`;
