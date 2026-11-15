import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
import {normalizeCommercial,bookingAvailability,validateOrderDraft,orderAvailability,stripeSignatureValid} from './studio_commerce.mjs';
import {renderStudioSite} from './studio_site_renderer.mjs';
import {mailConfigured,notificationForCustomer} from './studio_notifications.mjs';

const draft={kind:'hotel',rooms:[{label:'camere duble',count:1}],
 features:{booking:true,contact:true,shop:true,privacyUrl:'https://example.org/privacy'},
 commerce:normalizeCommercial({currency:'GBP',products:[{id:'p-1',title:'Voucher',priceMinor:5000,inventory:2}]})};
const stay={type:'booking',bookingType:'stay',roomLabel:'camere duble',start:'2026-12-10',end:'2026-12-12'};
assert.equal(bookingAvailability(draft,[],stay).available,true);
const closure={...draft,commerce:{...draft.commerce,blocked:[{type:'stay',roomLabel:'camere duble',start:'2026-12-09',end:'2026-12-15',quantity:0}]}};
assert.equal(bookingAvailability(closure,[],stay).available,false);
const open={...draft,commerce:{...draft.commerce,blocked:[{type:'stay',roomLabel:'camere duble',start:'2026-12-14',end:'2026-12-16',quantity:0}]}};
assert.equal(bookingAvailability(open,[],stay).available,true);
assert.equal(bookingAvailability(draft,[{...stay,status:'confirmed'}],stay).available,false);
const table={...draft,kind:'restaurant',commerce:{...draft.commerce,slotCapacity:5,slotMinutes:60}};
const seat={type:'booking',bookingType:'table',date:'2026-12-10',time:'19:00',partySize:4};
assert.equal(bookingAvailability(table,[{...seat,status:'confirmed'}],{...seat,partySize:2}).available,false);
assert.equal(bookingAvailability(table,[{...seat,status:'confirmed'}],{...seat,time:'20:00',partySize:2}).available,true);
const order=validateOrderDraft({productId:'p-1',quantity:'2',name:'Client Test',email:'client@example.org',privacy_ack:'yes'},draft);
assert.equal(order.totalMinor,10000);
assert.throws(()=>validateOrderDraft({productId:'p-1',quantity:3,name:'Client Test',email:'client@example.org',privacy_ack:'yes'},draft),/out_of_stock/);
assert.equal(orderAvailability([{...order,status:'paid'}],draft,{...order,quantity:1}).available,false);
assert.equal(mailConfigured({EMAIL:{send(){}},STUDIO_MAIL_FROM:'owner@example.org'}),true);
assert.match(notificationForCustomer({name:'Test'},{email:'guest@example.org',type:'booking'},'confirmed').body,/confirmată/);
const html=renderStudioSite({name:'Pensiune',description:'Cazare, produse, rezervări și camere',
 kind:'hotel',styleId:'heritage',lang:'ro',rooms:draft.rooms,features:draft.features,commerce:draft.commerce,
 content:{ro:{headline:'Pensiune',intro:'Test',about:'Despre noi',services:[]}},
 photos:[]},{publicId:'a'.repeat(32)});
assert.match(html,/name="productId"/);
assert.match(html,/name="roomLabel"/);
assert.match(html,/Voucher/);
assert.match(html,/privacy/);
const body=JSON.stringify({event:'test'}),timestamp=Math.floor(Date.now()/1000);
const keyName='whsec_'+'example_placeholder';
const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(keyName),{name:'HMAC',hash:'SHA-256'},false,['sign']);
const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(timestamp+'.'+body));
const hex=[...new Uint8Array(signature)].map(b=>b.toString(16).padStart(2,'0')).join('');
assert.equal(await stripeSignatureValid(body,'t='+timestamp+',v1='+hex,keyName),true);
assert.equal(await stripeSignatureValid(body+'!', 't='+timestamp+',v1='+hex,keyName),false);
assert.equal(await stripeSignatureValid(body,'t='+(timestamp-500)+',v1='+hex,keyName),false);
console.log('PASS: Eva commercial calendar, inventory, real catalog, privacy and verified payment signatures');
