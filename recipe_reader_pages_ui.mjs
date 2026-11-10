export function parseRecipePages(raw){
 const lines=String(raw||'').replace(/\r\n?/g,'\n').split('\n');
 const headings=/^\s*(?:#{1,3}\s*)?(?:\*{0,2})(?:Rețeta|Reteta|Recipe|Recette|Ricetta|Rezept)\s+(\d+)\s*[:.—–-]\s*(.*)/i;
 const pages=[];let intro=[],section=null;
 for(const line of lines){
  const match=line.match(headings);
  if(match){if(section)pages.push(section);section={title:match[2].replace(/\*+/g,'').trim().slice(0,90)||'Rețeta '+match[1],lines:[line]};}
  else if(section)section.lines.push(line);
  else intro.push(line);
 }
 if(section)pages.push(section);
 if(pages.length<2)return {intro:'',pages:[]};
 return {intro:intro.join('\n').trim().replace(/^[─\s]+|[─\s]+$/g,''),
  pages:pages.map((item,i)=>({number:i+1,title:item.title,
   text:item.lines.join('\n').replace(/(?:\n\s*─{3,}\s*)+$/,'').trim()}))};
}
export const RECIPE_READER_PAGES_UI_SCRIPT=parseRecipePages.toString()+'\n'+String.raw`function renderRecipePages(layer,body,rawText,appendRecipeReaderText,appendAnswerText){
 const result=parseRecipePages(rawText);
 if(result.pages.length<2)return false;
 const pages=result.pages;
 const nav=document.createElement('div');nav.className='recipe-reader-pages-nav';
 nav.style.cssText='flex:0 0 auto;display:flex;flex-direction:column;gap:6px;padding:8px 12px;background:#0d293b;border-bottom:1px solid #38788c;max-height:120px;';
 if(result.intro){
  const notice=document.createElement('div');notice.textContent=result.intro;
  notice.style.cssText='font-size:12px;color:#b5d5de;max-height:38px;overflow-y:auto;';
  nav.append(notice);
 }
 const choices=document.createElement('div');
 choices.style.cssText='display:flex;gap:7px;overflow-x:auto;overscroll-behavior-x:contain;padding-bottom:3px;';
 const buttons=[];let active=0;
 pages.forEach((page,i)=>{
  const b=document.createElement('button');b.type='button';
  b.textContent=(i+1)+'. '+page.title;b.title=page.title;
  b.setAttribute('aria-label','Rețeta '+(i+1)+' din '+pages.length+': '+page.title);
  b.style.cssText='flex:0 0 auto;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:9px 12px;border:1px solid #438da2;border-radius:12px;background:#123b52;color:#e4f6fb;font-size:13px;';
  b.onclick=()=>display(i);choices.append(b);buttons.push(b);
 });
 nav.append(choices);layer.insertBefore(nav,body);
 function display(index){
  active=Math.max(0,Math.min(pages.length-1,index));
  const page=pages[active];body.replaceChildren();
  if(!appendRecipeReaderText(body,page.text))appendAnswerText(body,page.text);
  const footer=document.createElement('div');
  footer.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;padding:16px 0 24px;';
  const previous=document.createElement('button');previous.type='button';
  previous.textContent='← Anterioara';previous.disabled=active===0;previous.onclick=()=>display(active-1);
  const counter=document.createElement('span');counter.textContent=(active+1)+' din '+pages.length;
  counter.style.cssText='font-size:14px;color:#b1d8e2;white-space:nowrap;';
  const next=document.createElement('button');next.type='button';
  next.textContent='Următoarea →';next.disabled=active===pages.length-1;next.onclick=()=>display(active+1);
  for(const btn of [previous,next]){
   btn.style.cssText='border:1px solid #4c9fb3;border-radius:12px;padding:10px 11px;background:#10435c;color:#ecfbff;font-size:14px;';
   if(btn.disabled)btn.style.opacity='.35';
  }
  footer.append(previous,counter,next);body.append(footer);
  buttons.forEach((btn,i)=>{
   const selected=i===active;btn.setAttribute('aria-pressed',String(selected));
   btn.style.background=selected?'#1d7486':'#123b52';
   btn.style.borderColor=selected?'#8be9f4':'#438da2';
  });
  body.scrollTop=0;buttons[active]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
 }
 display(0);return true;
}`;
