// Genuine mobile Chromium acceptance of the production-generated Physics
// WebView (separate from deterministic unit tests and Gradle compilation).
import assert from 'node:assert/strict';
import frontend from './index.js';
import http from 'node:http';
import fs from 'node:fs';
import {chromium} from 'playwright';

fs.mkdirSync('physics-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const response=await frontend.fetch(new Request('http://localhost:3880'+req.url),
   {COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(String(e));}
});
await new Promise(resolve=>server.listen(3880,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},
 deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
let lessons=0,practicals=0;
const dialog=page.locator('#educationPagedLessonDialog');
const open=async(button)=>{await button.waitFor({state:'attached',timeout:10000});await button.evaluate(e=>e.click());};
const closeDialog=async()=>{await dialog.locator('.education-theory-head button').first().evaluate(e=>e.click());};
const back=async()=>{await open(page.locator('#view-module .science-stage-back').first());};
try{
 await page.goto('http://127.0.0.1:3880/?nativeLaunch=1&physicsQa=1',
  {waitUntil:'domcontentloaded',timeout:30000});
 await open(page.locator('[data-module="learning"]').first());
 await open(page.locator('#view-module .education-card:has-text("Științe")').first());
 const country=page.locator('#eduCountryInput');
 if(await country.count()&&await country.isVisible()){
  await country.fill('România');
  await open(page.locator('#view-module .edu-country-matches button:has-text("România")').first());
  const continueButton=page.locator('#view-module button:has-text("Continuă")').first();
  if(await continueButton.count())await open(continueButton);
 }
 if(!((await page.locator('#view-module').innerText()).includes('Fizică'))){
  const science=page.locator('#view-module button:has-text("Științe")').first();
  if(await science.count())await open(science);
 }
 await open(page.locator('#view-module .science-subject-tile:has-text("Fizică")').first());
 const tiles=page.locator('#view-module .science-year-tile');
 await tiles.first().waitFor({state:'attached',timeout:10000});
 let all=await tiles.allTextContents();
 assert.ok(!all.some(x=>/Clasa\\s+(?:a\\s+)?5\\b|Grade\\s+5\\b/i.test(x)),
  'Romanian Grade V must not be offered as standalone Physics');
 for(const grade of [6,7,8,9,10,11,12]){
  all=await tiles.allTextContents();
  const matcher=new RegExp('(?:Clasa\\s+(?:a\\s+)?|Grade\\s+)'+grade+'\\b','i');
  const found=all.findIndex(x=>matcher.test(x));
  assert.ok(found>=0,'Missing real Romanian Physics grade '+grade+' from '+all.join(' | '));
  await open(tiles.nth(found));
  const chapters=page.locator('#view-module .science-choice-list > .science-choice-row');
  const chapterTexts=await chapters.allTextContents();
  assert.ok(chapterTexts.length>=3,'Too few actual Physics chapters in Grade '+grade);
  assert.equal(new Set(chapterTexts).size,chapterTexts.length,'Repeated Physics chapter cards');
  await open(chapters.first());
  const actions=page.locator('#view-module .chemistry-section-tile');
  assert.equal(await actions.count(),3,'Physics must offer study, practice and activities');
  await open(actions.first());
  const cards=page.locator('#view-module .science-inline-theory-item');
  assert.ok(await cards.count()>=2,'No actual Physics study cards in '+grade);
  const titles=await cards.allTextContents();
  assert.ok(new Set(titles).size>=2,'Repeated identical study cards in '+grade);
  await open(cards.first());
  await dialog.waitFor({state:'visible',timeout:8000});
  const text=await dialog.locator('.education-paged-text').innerText();
  assert.ok(text.length>=160,'Empty or one-paragraph Physics explanation in '+grade);
  assert.ok((await dialog.locator('.education-paged-controls').innerText()).match(/Pagina\\s+1\\s*\\/\\s*\\d+/),
   'Missing actual paginated PDF/lesson reader');
  lessons++;
  if(grade===6||grade===9||grade===12)
   await dialog.screenshot({path:'physics-browser-audit/lesson-'+grade+'.png'});
  await closeDialog();
  await back(); // study list -> chapter action menu
  await open(page.locator('#view-module .chemistry-section-tile').nth(2));
  const labRows=page.locator('#view-module .chemistry-section-tile');
  assert.ok(await labRows.count()>=2,'No Physics practical activities for '+grade);
  const labLabels=await labRows.allTextContents();
  assert.equal(new Set(labLabels).size,labLabels.length,
   'Practical menu repeats identical actions for grade '+grade);
  await open(labRows.first());
  await dialog.waitFor({state:'visible',timeout:8000});
  const practical=await dialog.locator('.education-paged-text').innerText();
  assert.ok(practical.length>=150,'Empty Physics practical for '+grade);
  practicals++;
  if(grade===6||grade===12)
   await dialog.screenshot({path:'physics-browser-audit/practical-'+grade+'.png'});
  await closeDialog();
  await back();await back();await back(); // activity -> chapter -> grade picker
  await tiles.first().waitFor({state:'attached',timeout:8000});
 }
 assert.equal(lessons,7);
 assert.equal(practicals,7);
 assert.ok(!errors.length,'Frontend console exceptions: '+errors.slice(0,3).join('; '));
 console.log('PASS mobile Chromium Physics: grades VI–XII, seven detailed lessons, seven activity readers, paginated dialogs and navigation');
}catch(error){
 try{
  await page.screenshot({path:'physics-browser-audit/failure.png',fullPage:true});
  fs.writeFileSync('physics-browser-audit/failure.txt',JSON.stringify({
   error:String(error),exceptions:errors,screen:await page.locator('#view-module').innerText().catch(()=>null)
  },null,2));
 }catch{}
 throw error;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
