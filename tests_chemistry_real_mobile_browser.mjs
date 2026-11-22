// End-to-end mobile Chromium test of real Chemistry year routing and teaching.
import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES} from './education_all_country_subject_matrix.mjs';
import http from 'node:http';
import fs from 'node:fs';
import {chromium} from 'playwright';
fs.mkdirSync('chemistry-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const answer=await frontend.fetch(new Request('http://localhost:3881'+req.url),
   {COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(answer.status,Object.fromEntries(answer.headers));
  res.end(Buffer.from(await answer.arrayBuffer()));
 }catch(err){res.writeHead(500);res.end(String(err))}
});
await new Promise(resolve=>server.listen(3881,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const open=async(target)=>{
 await target.waitFor({state:'attached',timeout:12000});
 await target.evaluate(element=>element.click());
};
const navigate=async(page,code)=>{
 await page.goto('http://127.0.0.1:3881/?nativeLaunch=1&chemistryQa=1',
  {waitUntil:'domcontentloaded',timeout:30000});
 await open(page.locator('[data-module="learning"]').first());
 await open(page.locator('#view-module .education-card:has-text("Științe")').first());
 const field=page.locator('#eduCountryInput');
 if(await field.count()&&await field.isVisible()){
  await field.fill(code);
  await open(page.locator('#view-module button:has-text("Continuă")').first());
 }
 if(!((await page.locator('#view-module').innerText()).includes('Chimie'))){
  const science=page.locator('#view-module button:has-text("Științe")').first();
  if(await science.count())await open(science);
 }
 await open(page.locator('#view-module .science-subject-tile:has-text("Chimie")').first());
 const tiles=page.locator('#view-module .science-year-tile');
 await tiles.first().waitFor({state:'attached',timeout:12000});
 return tiles;
};
let checked=0,roLessons=0,roEnquiries=0;
const exceptions=[];
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,
 isMobile:true,hasTouch:true,locale:'ro-RO'});
page.on('pageerror',e=>exceptions.push(String(e)));
const dialog=page.locator('#educationPagedLessonDialog');
try{
 const tiles=await navigate(page,'RO');
 let labels=await tiles.allTextContents();
 assert.ok(!labels.some(x=>/Clasa\s+(?:a\s+)?(?:5|6)\b|Grade\s+(?:5|6)\b/i.test(x)),
  'Romanian Chemistry must not fabricate standalone grade V or VI');
 const back=async()=>open(page.locator('#view-module .science-stage-back').first());
 let lastChapters=null;
 for(const grade of [7,8,9,12]){
  labels=await tiles.allTextContents();
  const regexp=new RegExp('(?:Clasa\\s+(?:a\\s+)?|Grade\\s+)'+grade+'\\b','i');
  const index=labels.findIndex(x=>regexp.test(x));
  assert.ok(index>=0,'Missing Chemistry in actual Romanian grade '+grade);
  await open(tiles.nth(index));
  const chapters=page.locator('#view-module .science-choice-list > .science-choice-row');
  const chapterLabels=await chapters.allTextContents();
  assert.ok(chapterLabels.length>=3,'Chemistry must have several real chapters in grade '+grade);
  assert.equal(new Set(chapterLabels).size,chapterLabels.length);
  if(lastChapters&&grade===8)assert.notDeepEqual(chapterLabels,lastChapters,
   'Romanian Chemistry VII/VIII cannot show the exact same chapter list');
  lastChapters=chapterLabels;
  await open(chapters.first());
  const options=page.locator('#view-module .chemistry-section-tile');
  assert.equal(await options.count(),3,'Chemistry chapter needs study, exercises, lab');
  await open(options.first());
  const cards=page.locator('#view-module .science-inline-theory-item');
  assert.ok(await cards.count()>=1,'Chemistry lesson cards missing for grade '+grade);
  const titles=await cards.allTextContents();
  assert.equal(new Set(titles).size,titles.length,'Repeated Chemistry chapter lessons');
  await open(cards.first());
  await dialog.waitFor({state:'visible',timeout:9000});
  const body=await dialog.locator('.education-paged-text').innerText();
  assert.ok(body.length>=200,'One-paragraph Chemistry lesson '+grade);
  assert.match(await dialog.locator('.education-paged-controls').innerText(),/Pagina\s+1\s*\/\s*\d+/);
  if(grade===7||grade===12)await dialog.screenshot({path:'chemistry-browser-audit/lesson-'+grade+'.png'});
  roLessons++;
  await open(dialog.locator('.education-theory-head button').first());
  await back();
  await open(page.locator('#view-module .chemistry-section-tile').nth(2));
  const labOptions=page.locator('#view-module .chemistry-section-tile');
  assert.ok(await labOptions.count()>=1,'Chemistry has no authentic investigation');
  await open(labOptions.first());
  await dialog.waitFor({state:'visible',timeout:9000});
  const lab=await dialog.locator('.education-paged-text').innerText();
  assert.ok(lab.length>=160,'Chemistry investigation is empty or not explained');
  assert.ok(/siguran|safety|date|observa/i.test(lab),
   'Chemistry investigation lacks evidence or safety discussion');
  roEnquiries++;
  await open(dialog.locator('.education-theory-head button').first());
  await back();await back();await back();
  await tiles.first().waitFor({state:'attached',timeout:10000});
 }
 // Exercise all national entry choices in a fresh mobile profile and click
 // into a real Chemistry chapter. This catches a country with no actual
 // browser-visible lessons despite a populated server-side registry.
 for(const code of EDUCATION_EUROPE_COUNTRIES){
  const p=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,
   isMobile:true,hasTouch:true,locale:'ro-RO'});
  try{
   const countryTiles=await navigate(p,code);
   assert.ok(await countryTiles.count()>=2,code+' Chemistry missing school years');
   await open(countryTiles.first());
   const chapters=p.locator('#view-module .science-choice-list > .science-choice-row');
   assert.ok(await chapters.count()>=1,code+' Chemistry has no chapter in first offered school year');
   await open(chapters.first());
   assert.equal(await p.locator('#view-module .chemistry-section-tile').count(),3,
    code+' Chemistry chapter menu is missing expected actions');
   checked++;
  }catch(e){
   await p.screenshot({path:'chemistry-browser-audit/failure-'+code+'.png',fullPage:true}).catch(()=>{});
   throw Error('Chemistry real mobile navigation '+code+': '+String(e)+' | screen: '+
    (await p.locator('#view-module').innerText().catch(()=>'')).slice(0,450));
  }finally{await p.close()}
 }
 assert.equal(checked,50);
 assert.equal(roLessons,4);
 assert.equal(roEnquiries,4);
 assert.deepEqual(exceptions,[],'Uncaught real Chromium errors in Chemistry');
 console.log('PASS Chemistry mobile: 50 country-to-chapter paths, four Romanian school grade lessons and practical investigations, fully paged reader and stable navigation.');
}catch(e){
 await page.screenshot({path:'chemistry-browser-audit/failure.png',fullPage:true}).catch(()=>{});
 fs.writeFileSync('chemistry-browser-audit/failure.txt',JSON.stringify({
  message:String(e),exceptions,visible:await page.locator('#view-module').innerText().catch(()=>null)
 },null,2));
 throw e;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
