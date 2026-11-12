// Structure AI study prose without HTML injection; original raw text stays intact
// for PDF export, printing, and licensing checks.
export function parseStudyBlocks(raw){
 const lines=String(raw||'').replace(/\r\n?/g,'\n').split('\n');
 const blocks=[];let paragraph=[],letter=0;
 const flush=()=>{if(paragraph.length){blocks.push({type:'paragraph',text:paragraph.join('\n').trim()});paragraph=[]}};
 const rules=/^\s*(?:[-_–—]{4,}|={4,})\s*$/;
 const labels=/^(?:introducere|defini(?:ții|tii)|subiecte principale|teorie|exemple?|exerci(?:ții|tii)|recapitulare|concluzii?|rezumat|lectura|context|bibliografie|introduction|definitions?|examples?|exercises?|summary|conclusions?|practice|wprowadzenie|einleitung|beispiele|zusammenfassung|giriş|tanımlar|örnekler)\s*:?$/iu;
 for(let i=0;i<lines.length;i++){
  const line=lines[i].trim();
  if(!line){flush();continue}
  if(rules.test(line)){flush();letter=0;blocks.push({type:'rule'});continue}
  const md=line.match(/^#{1,4}\s+(.+)$/);
  const next=lines[i+1]?.trim()||'';
  if(md||labels.test(line)||(rules.test(next)&&line.length<115)){
   flush();letter=0;
   blocks.push({type:'heading',text:md?md[1].trim():line.replace(/:$/,''),level:md?.[0].startsWith('###')?3:2});
   continue;
  }
  const numbered=line.match(/^(\d{1,3})[.)]\s+(.+)$/);
  const labelled=line.match(/^([a-zA-Z])[.)]\s+(.+)$/);
  const bullet=line.match(/^(?:[•*]|[-–])\s+(.+)$/);
  if(numbered||labelled||bullet){
   flush();
   let marker,body;
   if(numbered){marker=numbered[1]+'.';body=numbered[2];letter=0}
   else if(labelled){marker=labelled[1].toLowerCase()+'.';body=labelled[2];letter=0}
   else {marker=String.fromCharCode(97+(letter%26))+'.';letter++;body=bullet[1]}
   blocks.push({type:'item',marker,text:body});
   continue;
  }
  if(!paragraph.length)letter=0;
  paragraph.push(line);
 }
 flush();
 return blocks;
}

// All content is created with textContent; no AI text is interpreted as HTML.
export function renderStudyBlocks(host,text){
 const blocks=parseStudyBlocks(text);
 host.replaceChildren();
 if(host.classList?.add)host.classList.add('lit-study-document');
 else host.className=(host.className||'')+' lit-study-document';
 const inline=(target,raw)=>{
  const words=String(raw).split(/(\*\*[^*\n]+\*\*)/g);
  for(const word of words){
   if(!word)continue;
   if(/^\*\*[^*\n]+\*\*$/.test(word)){
    const strong=document.createElement('strong');strong.textContent=word.slice(2,-2);target.append(strong);
   }else{
    const span=document.createElement('span');span.textContent=word;target.append(span);
   }
  }
 };
 for(const block of blocks){
  let element;
  if(block.type==='rule'){element=document.createElement('hr');element.className='lit-study-rule';host.append(element);continue}
  if(block.type==='heading'){
   element=document.createElement(block.level===3?'h4':'h3');element.className='lit-study-heading';
   element.textContent=block.text;host.append(element);continue;
  }
  if(block.type==='item'){
   element=document.createElement('div');element.className='lit-study-row';
   const label=document.createElement('strong');label.className='lit-study-marker';label.textContent=block.marker+' ';
   const body=document.createElement('div');body.className='lit-study-item-body';
   const definition=block.text.match(/^([^:\n]{2,54}):\s+(.+)$/s);
   if(definition){
    const name=document.createElement('strong');name.textContent=definition[1]+': ';body.append(name);
    inline(body,definition[2]);
   }else inline(body,block.text);
   element.append(label,body);host.append(element);continue;
  }
  element=document.createElement('p');element.className='lit-study-paragraph';
  inline(element,block.text);host.append(element);
 }
}

export const STUDY_TYPOGRAPHY_CSS=String.raw`
/* ONLY literature study documents; no global heading, list or button colors. */
.lit-study-document{white-space:normal!important;line-height:1.55!important;}
.lit-study-document .lit-study-heading{
 color:#91ddeb!important;font-weight:800!important;font-size:1.1em!important;
 line-height:1.32!important;margin:16px 0 8px!important;letter-spacing:.01em;
}
.lit-study-document .lit-study-heading:first-child{margin-top:0!important}
.lit-study-document .lit-study-rule{display:block;border:0!important;border-top:1px solid #528da3!important;height:0!important;opacity:.72;margin:9px 0 15px!important}
.lit-study-document .lit-study-paragraph{white-space:pre-line!important;line-height:1.58!important;margin:0 0 13px!important;overflow-wrap:anywhere!important}
.lit-study-document .lit-study-row{display:grid!important;grid-template-columns:2rem minmax(0,1fr)!important;gap:8px!important;align-items:start!important;margin:7px 0 11px!important;overflow-wrap:anywhere!important}
.lit-study-document .lit-study-marker{font-weight:900!important;color:#98e0ec!important;min-width:0;text-align:left;font-variant-numeric:tabular-nums!important}
.lit-study-document .lit-study-item-body{min-width:0;line-height:1.57!important;white-space:pre-line!important}
.lit-study-document strong{font-weight:800!important}
`;
