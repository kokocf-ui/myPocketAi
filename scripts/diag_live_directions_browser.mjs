import {chromium} from 'playwright';
// Production regression check after __name fix, commit 5602ac8.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},locale:'ro-RO'});
const events=[];
page.on('pageerror',e=>events.push({type:'pageerror',message:String(e).slice(0,650),stack:String(e.stack).slice(0,2400)}));
page.on('console',m=>{if(m.type()==='error')events.push({type:'console',message:m.text().slice(0,450)})});
page.on('request',req=>{
 if(req.url().includes('/api/chat')&&req.method()==='POST')
  events.push({type:'outgoing',url:req.url(),body:req.postData()?.slice(0,260)});
});
page.on('requestfailed',req=>{if(req.url().includes('/api/chat'))events.push({type:'requestfailed',reason:req.failure()?.errorText})});
page.on('response',async res=>{
 if(res.url().includes('/api/chat')){
  let summary='';
  try{const t=await res.text();const j=JSON.parse(t);
    summary=JSON.stringify({count:j.candidates?.length,error:j.error,first:j.candidates?.[0]?.label}).slice(0,500);
  }catch(e){summary='parse_error='+String(e)}
  events.push({type:'incoming',http:res.status(),summary});
 }
});
try{
 const response=await page.goto('https://lifewise-ai-v2.kokocf.workers.dev/?uiFresh='+Date.now(),{waitUntil:'domcontentloaded',timeout:35000});
 console.log('HTTP_FRONTEND',response?.status());
 console.log('DOM_BOOT',await page.locator('#view-home .feature-card').count());
 await page.locator('#view-home .feature-card[data-module="maps"]').click({timeout:12000});
 console.log('MAPS_CARDS',await page.locator('.module-landing-choice').count());
 await page.locator('.module-landing-choice').first().click({timeout:12000});
 await page.locator('.journey-one-field-input').waitFor({timeout:10000});
 for(const address of ['Basildon, UK','Nufărului 1, Oradea, România']){
  events.length=0;
  const input=page.locator('.journey-one-field-input');
  await input.fill(address);
  let status='';
  for(let i=0;i<19;i++){
   await page.waitForTimeout(1000);
   const result=await page.evaluate(()=>{
    const root=document.querySelector('.journey-one-field');
    return {
      status:root?.querySelector('[aria-live]')?.textContent,
      choices:root?.querySelectorAll('.journey-live-suggestions button')?.length,
      visible:root?.isConnected,
      input:root?.querySelector('input')?.value,
      html:root?.outerHTML.slice(0,160)
    }
   });
   status=result.status||'';
   if(i===0||i===5||i===12||i===18||result.choices)console.log('POLL',address,i+1,JSON.stringify(result));
   if(result.choices||/indisponibil|eroare|retry|încearcă|fără|găsit/i.test(status))break;
  }
  console.log('FINISHED',address,'STATUS',status,'EVENTS',JSON.stringify(events).slice(0,7000));
  await page.screenshot({path:'directions-'+(address.startsWith('B')?'basildon':'oradea')+'.png',fullPage:true});
 }
}catch(err){console.log('TEST_FAILED',String(err),String(err.stack).slice(0,1300));
 console.log('FAIL_EVENTS',JSON.stringify(events).slice(0,6000));
 console.log('FAIL_DOM',await page.locator('body').innerText().then(x=>x.slice(0,1400)).catch(()=>'(none)'));
 await page.screenshot({path:'directions-failure.png',fullPage:true}).catch(()=>{});
 process.exitCode=1}
finally{await browser.close()}
