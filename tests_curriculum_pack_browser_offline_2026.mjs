import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import app from './index.js';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4396';
let packRequests = 0;
let updatedPT = false;

const server = http.createServer(async (req, res) => {
  try {
    const asset=req.url.match(/^\/education\/math\/supplements\/([A-Z-]+)\.json$/);
    if(asset){res.writeHead(200,{'Content-Type':'application/json'});res.end(await readFile(new URL('./public/education/math/supplements/'+asset[1]+'.json',import.meta.url)));return}
    if (req.url.startsWith('/api/curriculum-pack')) packRequests++;
    const result = await app.fetch(new Request(origin + req.url, { headers: req.headers }), {
      COMMUNICATION_ORACLE_ORIGIN: ''
    });
    let body=Buffer.from(await result.arrayBuffer());
    const query=new URL(origin+req.url).searchParams;
    if(updatedPT&&req.url.startsWith('/api/curriculum-pack')&&query.get('subject')==='mathematics'&&query.get('country')==='PT'&&query.get('grade')==='5'){
      const pack=JSON.parse(body.toString());
      const row=pack.lessonsByTopic.algebra.find(x=>x.title.includes('Multiplii și divizorii unui număr'));
      assert.ok(row);row.title='Actualizare independentă: '+row.title;pack.packVersion='test-independent-update';
      body=Buffer.from(JSON.stringify(pack));
    }
    res.writeHead(result.status, Object.fromEntries(result.headers));
    res.end(body);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

await new Promise(ok => server.listen(4396, '127.0.0.1', ok));
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], ...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{}) });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  locale: 'ro-RO'
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

const click = async loc => {
  await loc.waitFor({ state: 'attached', timeout: 12000 });
  await loc.evaluate(el => el.click());
};

try {
  // Phase 1: Online load of decoupled packs across RO (Primary + Lycée + Univ), HU, ES, IT, PT
  for (const [countryName, stageIdx, gradeQuery, branchQuery, expectedTitle] of [
    ['România', 0, '4', 'Aritmetică', '1.000.000'],
    ['România', 2, '12', 'Analiză', 'Leibniz-Newton'],
    ['România', 3, '1', 'Analiză', 'Banach'],
    ['Ungaria', 1, '5', 'Algebră', 'Valoarea pozițională și ordonarea numerelor naturale'],
    ['Ungaria', 3, 'BSc · anul I', 'Algebră liniară', 'Subspații vectoriale și condițiile de închidere'],
    ['Spania', 1, 'ESO4-A', 'Algebră', 'Presupuesto y porcentaje de descuento'],
    ['Italia', 1, 'M1', 'Geometrie', 'Segmenti e angoli'],
    ['Portugalia', 1, '5', 'Algebră', 'Multiplii și divizorii unui număr']
  ]) {
    await page.goto(origin + '/?nativeLaunch=1&mathQa=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await click(page.locator('[data-module="learning"]').first());
    const notice = page.locator('#education-first-use-notice');
    if (await notice.count()) {
      await notice.locator('button').first().click();
      await notice.waitFor({ state: 'detached', timeout: 5000 });
    }
    await click(page.locator('#view-module .education-card').filter({ hasText: 'Matematică' }).first());
    await page.locator('#eduCountryInput').fill(countryName);
    await click(page.locator('#view-module .edu-country-matches button').filter({ hasText: countryName }).first());
    await click(page.locator('#view-module button').filter({ hasText: 'Continuă' }).first());
    await click(page.locator('#view-module .math-choice-row').nth(stageIdx));
    await page.locator('#view-module .edu-grade-panel input').fill(gradeQuery);
    await click(page.locator('#view-module .edu-grade-choice-grid button').first());
    await click(page.locator('#view-module .math-choice-row').filter({ hasText: branchQuery }).first());
    const titles = await page.locator('#view-module .math-choice-row strong').allTextContents();
    assert.ok(
      titles.some(t => t.includes(expectedTitle)),
      `Online decoupled pack missing "${expectedTitle}" for ${countryName} (${gradeQuery}); got ${JSON.stringify(titles.slice(0, 5))}`
    );
  }
  assert.ok(packRequests >= 1, 'Decoupled curriculum pack API must be invoked on first grade visit');

  // Open an authored lesson reader while online
  await click(page.locator('#view-module .math-choice-row').filter({ hasText: 'Multiplii și divizorii unui număr' }).first());
  const reader = page.locator('#educationPagedLessonDialog');
  await reader.waitFor({ state: 'visible', timeout: 10000 });
  assert.ok((await reader.innerText()).includes('Definiție și explicație'));
  await click(reader.locator('.education-theory-head button').first());

  // Republish just one asset while the exact same frontend is running.
  updatedPT=true;
  await page.goto(origin+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded'});
  await click(page.locator('[data-module="learning"]').first());
  await click(page.locator('#view-module .education-card').filter({hasText:'Matematică'}).first());
  if(await page.locator('#eduCountryInput').isVisible()){
    await page.locator('#eduCountryInput').fill('Portugalia');
    await click(page.locator('#view-module .edu-country-matches button').filter({hasText:'Portugalia'}).first());
    await click(page.locator('#view-module button').filter({hasText:'Continuă'}).first());
  }
  await click(page.locator('#view-module .math-choice-row').nth(1));
  await page.locator('#view-module .edu-grade-panel input').fill('5');
  await click(page.locator('#view-module .edu-grade-choice-grid button').first());
  await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
  assert.ok((await page.locator('#view-module .math-choice-row strong').allTextContents()).some(t=>t.includes('Actualizare independentă: Multiplii și divizorii')),'Reader navigation must use the updated pack without changing the frontend');

  // A known but missing year pack is disclosed, not silently presented as complete.
  const missingContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ro-RO'});
  const missingPage=await missingContext.newPage();let blockHU=true;
  await missingPage.route('**/api/curriculum-pack?**',async route=>{
    const q=new URL(route.request().url()).searchParams;
    if(blockHU&&q.get('subject')==='mathematics'&&q.get('country')==='HU'&&q.get('grade')==='5')return route.abort();
    return route.continue();
  });
  await missingPage.goto(origin+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded'});
  await click(missingPage.locator('[data-module="learning"]').first());
  const missingNotice=missingPage.locator('#education-first-use-notice');
  if(await missingNotice.count()){await missingNotice.locator('button').first().click();await missingNotice.waitFor({state:'detached'})}
  await click(missingPage.locator('#view-module .education-card').filter({hasText:'Matematică'}).first());
  await missingPage.locator('#eduCountryInput').fill('Ungaria');
  await click(missingPage.locator('#view-module .edu-country-matches button').filter({hasText:'Ungaria'}).first());
  await click(missingPage.locator('#view-module button').filter({hasText:'Continuă'}).first());
  await click(missingPage.locator('#view-module .math-choice-row').nth(1));
  await missingPage.locator('#view-module .edu-grade-panel input').fill('5');
  await click(missingPage.locator('#view-module .edu-grade-choice-grid button').first());
  const missingWarning=missingPage.locator('.edu-pack-unavailable');
  await missingWarning.waitFor({state:'visible',timeout:10000});
  assert.match(await missingWarning.innerText(),/generale sau incomplete/);
  blockHU=false;await click(missingWarning.locator('button'));await missingWarning.waitFor({state:'detached',timeout:10000});
  await click(missingPage.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
  assert.ok((await missingPage.locator('#view-module .math-choice-row strong').allTextContents()).some(t=>t.includes('Valoarea pozițională și ordonarea numerelor naturale')),'Retry must restore the actual year-pack reader');
  await missingContext.close();

  // Phase 2: Disconnect network completely (airplane mode) and verify cached HU Grade 5 works 100% offline!
  const beforeOfflinePackRequests = packRequests;
  await context.setOffline(true);
  // Clear in-memory cache so it MUST restore from persistent localStorage/CacheStorage while offline!
  await page.evaluate(() => window.pocketResetCurriculumMemoryCache && window.pocketResetCurriculumMemoryCache());
  // Navigate back to Education landing using real mobile taps while offline
  await click(page.locator('[data-module="learning"]').first());
  await click(page.locator('#view-module .education-card').filter({ hasText: 'Matematică' }).first());
  // Change country from Portugalia back to Ungaria while offline
  const changeCountryBtn = page.locator('#view-module button').filter({ hasText: /Schimbă țara|Țară|Ungaria|Portugalia/i }).first();
  if (!(await page.locator('#eduCountryInput').isVisible()) && (await changeCountryBtn.count())) {
    await click(changeCountryBtn);
  }
  const countryInput = page.locator('#eduCountryInput');
  if (await countryInput.isVisible()) {
    await countryInput.fill('Ungaria');
    await click(page.locator('#view-module .edu-country-matches button').filter({ hasText: 'Ungaria' }).first());
    await click(page.locator('#view-module button').filter({ hasText: 'Continuă' }).first());
  }
  await click(page.locator('#view-module .math-choice-row').nth(1));
  await page.locator('#view-module .edu-grade-panel input').fill('5');
  await click(page.locator('#view-module .edu-grade-choice-grid button').first());
  await click(page.locator('#view-module .math-choice-row').filter({ hasText: 'Algebră' }).first());
  const offlineTitles = await page.locator('#view-module .math-choice-row strong').allTextContents();
  assert.ok(
    offlineTitles.some(t => t.includes('Valoarea pozițională și ordonarea numerelor naturale')),
    'Offline phone cache must preserve full Hungarian Grade 5 chapters without network'
  );
  await click(page.locator('#view-module .math-choice-row').filter({ hasText: 'Valoarea pozițională și ordonarea numerelor naturale' }).first());
  await reader.waitFor({ state: 'visible', timeout: 10000 });
  assert.ok((await reader.innerText()).includes('Exersează singur'), 'Offline lesson reader must show full worked lesson');
  assert.equal(packRequests, beforeOfflinePackRequests, 'No server request possible while offline');
  assert.equal(errors.length, 0, 'Unexpected page errors: ' + errors.join(' | '));
  console.log('PASS mobile Chromium online + airplane-mode offline decoupled curriculum packs (HU, ES, IT, PT)');
} finally {
  await browser.close();
  await new Promise(ok => server.close(ok));
}
