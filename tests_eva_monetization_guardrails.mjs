import assert from 'node:assert/strict';
import {test} from 'node:test';
import {availableAffiliateOffers,validatedAffiliateOffer} from './eva_affiliate_registry.mjs';
import {EVA_ALERT_THRESHOLDS,evaluateEvaUsage,newEvaAlert} from './eva_alpha_cost_alerts.mjs';
test('unapproved, missing or forged affiliate offers never open',()=>{
 const cfg={partner:'omio',active:true,approved:true,
   trackedUrl:'https://omio.sjv.io/legitimate-sample?u=sample',
   approvedHosts:['omio.sjv.io']};
 assert.equal(validatedAffiliateOffer({...cfg,approved:false}),null);
 assert.equal(validatedAffiliateOffer({...cfg,trackedUrl:'http://omio.sjv.io/tracking'}),null);
 assert.equal(validatedAffiliateOffer({...cfg,trackedUrl:'https://omio.sjv.io.evil.test/tracking'}),null);
 assert.equal(validatedAffiliateOffer({...cfg,trackedUrl:'https://omio.sjv.io@evil.test/path'}),null);
 assert.equal(validatedAffiliateOffer({...cfg,trackedUrl:'https://omio.sjv.io/path#token'}),null);
 assert.equal(validatedAffiliateOffer({...cfg,approvedHosts:[]}),null);
 assert.equal(validatedAffiliateOffer({...cfg,partner:'unknown'}),null);
 assert.equal(validatedAffiliateOffer({...cfg,trackedUrl:''}),null);
 assert.equal(validatedAffiliateOffer(cfg).url,cfg.trackedUrl);
 assert.match(validatedAffiliateOffer(cfg).disclosure,/comision/i);
 assert.equal(availableAffiliateOffers([cfg],'hotels').length,0);
 assert.equal(availableAffiliateOffers([cfg],'mixed_transport').length,1);
});
test('alpha alerts are explicit, timestamped and do not invent usage',()=>{
 const when='2026-11-16T14:00:00Z';
 const base={observedAt:when,neuronsToday:6200,includedNeuronsPerDay:10000,
   spentUsdMonth:12,budgetUsdMonth:20};
 assert.deepEqual(EVA_ALERT_THRESHOLDS,[70,85,100]);
 assert.equal(evaluateEvaUsage(null,{now:when}).status,'unavailable');
 assert.equal(evaluateEvaUsage({}, {now:when}).status,'unavailable');
 assert.equal(evaluateEvaUsage(base,{now:'2026-11-16T15:00:00Z'}).status,'unavailable');
 assert.equal(evaluateEvaUsage({...base,neuronsToday:-1},{now:when}).status,'unavailable');
 let snapshot=evaluateEvaUsage(base,{now:when});
 assert.equal(snapshot.status,'measured');
 assert.equal(snapshot.severity,'normal');
 assert.equal(snapshot.affiliatePaidUsd,null);
 assert.equal(snapshot.affiliatePendingUsd,null);
 snapshot=evaluateEvaUsage({...base,neuronsToday:7200},{now:when});
 assert.equal(snapshot.severity,'warning');
 assert.equal(newEvaAlert(null,snapshot).level,'warning');
 const more=evaluateEvaUsage({...base,neuronsToday:9000},{now:when});
 assert.equal(more.severity,'critical');
 assert.equal(newEvaAlert(snapshot,more).level,'critical');
 assert.equal(newEvaAlert(more,snapshot),null);
 const spent=evaluateEvaUsage({...base,spentUsdMonth:20},{now:when});
 assert.equal(spent.severity,'limit');
 assert.equal(newEvaAlert(more,spent).reason,'monthly_budget');
 // Budget alerts are advisory here; server-side enforcement is separate.
});
