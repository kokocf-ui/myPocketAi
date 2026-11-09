// Compact national/advisory programme browser shared by Maths, Sciences and Computing.
// Shown on demand, without replacing their established subject workspaces.
// Every listing is tagged as advisory unless a validated per-year source exists.
export const EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT=String.raw`
function educationInternationalOpen(subject,level,grade,onBack){
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 const code=educationCountrySelection.code||'WORLD';
 const countryName=educationCountrySelection.label||code;
 const rows=worldwideStudyChapters(code,subject,level,grade,countryName,countryName,HG_SCHOOL_GENERAL_DATA);
 if(!rows.length){if(typeof onBack==='function')onBack();return}
 root.classList.add('learning-intl-curriculum');
 host.replaceChildren();
 const mk=(tag,text,cls='')=>{const element=document.createElement(tag);element.textContent=text||'';if(cls)element.className=cls;return element};
 const local=(ro,en)=>state.language==='ro'?ro:en;
 const bar=mk('div','','education-toolbar');
 const back=mk('button',local('← Înapoi','← Back'),'secondary-btn');back.type='button';
 back.onclick=()=>{root.classList.remove('learning-intl-curriculum');if(typeof onBack==='function')onBack()};
 bar.append(back);host.append(bar);
 const panel=mk('section','','math-choice-panel science-choice-panel edu-intl-programme');
 panel.style.cssText='min-width:0;width:100%;max-width:100%;box-sizing:border-box;overflow-y:auto;overscroll-behavior:contain;padding:12px 14px 18px;';
 panel.append(mk('h2',local('Programa de studiu · '+countryName,'Study programme · '+countryName)));
 const info=mk('p',local('Clasa / anul: ','School year: ')+String(grade||'')+' · '+local('nivelul: ','level: ')+String(level||''));
 info.style.cssText='margin:5px 0 10px;overflow-wrap:anywhere;';
 const advisory=mk('p',local('Parcurs orientativ: capitole naționale documentate unde există, urmate de fundamentele materiei. Nu reprezintă o programă oficială obligatorie.','Advisory path: documented country-focused topics where available, followed by subject foundations. This is not a mandatory national syllabus.'));
 advisory.style.cssText='font-size:.86em;opacity:.83;line-height:1.35;margin:4px 0 8px;';
 panel.append(info,advisory);
 const url=NATIONAL_UNIT_SOURCES?.[code];
 if(url){
  const link=mk('a',local('Sursă educațională a țării','Country education source'));
  link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:block;font-size:.86em;margin:4px 0 9px;';
  panel.append(link);
 }
 const search=mk('input');search.type='search';search.className='lit-input';
 search.autocomplete='off';search.placeholder=local('Caută un capitol…','Find a chapter…');
 search.setAttribute('aria-label',search.placeholder);search.style.cssText='width:100%;max-width:100%;box-sizing:border-box;min-height:46px;font-size:16px;';
 const list=mk('div','','edu-intl-chapter-list');list.style.cssText='display:flex;flex-direction:column;gap:6px;margin:8px 0;';
 const body=mk('article','','edu-intl-reader');body.style.cssText='display:none;min-width:0;overflow-wrap:anywhere;';
 panel.append(search,list,body);host.append(panel);
 let page=0;
 const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function choose(item){
  list.style.display='none';search.style.display='none';body.style.display='block';body.replaceChildren();
  const title=mk('h3',local(item[1],item[2]));body.append(title);
  const details=mk('p',state.language==='ro'?item[3]:local('','Study focus: ')+item[2]+'. '+local('','Examine evidence, explain the method and test your understanding with an example.'));
  details.style.cssText='line-height:1.55;white-space:normal;';
  body.append(details);
  const tasks=mk('section','','edu-intl-lesson-activity');
  tasks.append(mk('h4',local('Activitate și verificare','Practice and review')));
  const prompt=subject==='history'?local('Realizează o cronologie și menționează sursele pentru fiecare eveniment.','Build a timeline and cite the source for each event.'):
   subject==='geography'?local('Compară două locuri folosind o hartă, date și ani de referință.','Compare two places using a map, dated data and sources.'):
   subject==='literature'?local('Alege un fragment, identifică tema și argumentează interpretarea.','Choose a passage, identify the theme and support your interpretation.'):
   local('Rezolvă un exemplu și explică fiecare pas. Verifică rezultatul.','Work through an example, explain each step and check your answer.');
  tasks.append(mk('p',prompt));body.append(tasks);
  const backToList=mk('button',local('← Capitole','← Chapters'),'secondary-btn');
  backToList.type='button';backToList.onclick=()=>{body.style.display='none';list.style.display='flex';search.style.display='block';draw()};
  body.append(backToList);
  body.scrollIntoView({block:'nearest'});
 }
 function draw(){
  const q=fold(search.value.trim());
  const filtered=rows.filter(row=>!q||fold(row[1]).includes(q)||fold(row[2]).includes(q)||fold(row[3]).includes(q));
  if(page>=filtered.length)page=0;
  list.replaceChildren();
  filtered.slice(page,page+4).forEach(item=>{
   const b=mk('button',local(item[1],item[2]),'secondary-btn');
   b.type='button';b.style.cssText='width:100%;min-height:47px;text-align:left;white-space:normal;overflow-wrap:anywhere;';
   b.onclick=()=>choose(item);list.append(b);
  });
  if(!filtered.length)list.append(mk('p',local('Niciun capitol găsit.','No chapters found.')));
  if(page>0){
   const prev=mk('button',local('← Anterior','← Previous'),'secondary-btn');
   prev.onclick=()=>{page=Math.max(0,page-4);draw()};list.append(prev);
  }
  if(page+4<filtered.length){
   const more=mk('button',local('Mai multe →','More →'),'secondary-btn');
   more.onclick=()=>{page+=4;draw()};list.append(more);
  }
 }
 search.oninput=()=>{page=0;draw()};draw();
}
`;
