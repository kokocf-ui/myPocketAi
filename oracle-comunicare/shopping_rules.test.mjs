import assert from 'node:assert/strict';
import {test} from 'node:test';
import {applyShoppingOperation} from './shopping_rules.mjs';
const listId='1199da28-2b46-44d1-bc84-a7fa04bcdfad';
const productId='ea4acf1c-b133-48d1-8ff5-eccdb4332104';
const idemId='eca517cf-583f-4c89-bc33-7bfbd60b0010';
const owner={verified:true, role:'owner'};
const editor={verified:true, role:'editor'};
const base={id:listId,version:0,items:[]};
const op=(type='add',v=0)=>({
 type,item_id:productId,idempotency_key:idemId,expected_version:v,
 name:'Cartofi',quantity:2,unit:'kg'
});

test('verified owner can add and editor can check without mutating input',()=>{
 const original=structuredClone(base);
 const added=applyShoppingOperation({list:base,membership:owner,operation:op()});
 assert.equal(base.version,0);
 assert.deepEqual(base,original);
 assert.equal(added.version,1);
 assert.deepEqual(added.items[0],{id:productId,name:'Cartofi',quantity:2,unit:'kg',checked:false});
 const checked=applyShoppingOperation({list:added,membership:editor,operation:op('check',1)});
 assert.equal(checked.items[0].checked,true);
 assert.equal(added.items[0].checked,false);
 const removed=applyShoppingOperation({list:checked,membership:owner,operation:op('remove',2)});
 assert.deepEqual(removed.items,[]);
 assert.equal(removed.version,3);
});

test('viewer and unverified sessions cannot write',()=>{
 for(const membership of [{verified:true,role:'viewer'},{verified:false,role:'owner'},null]){
  assert.throws(()=>applyShoppingOperation({list:base,membership,operation:op()}),/forbidden/);
 }
});

test('version mismatches reject lost updates',()=>{
 const changed=applyShoppingOperation({list:base,membership:owner,operation:op()});
 assert.throws(()=>applyShoppingOperation({list:changed,membership:owner,operation:op('check',0)}),/revision_conflict/);
});

test('reject malformed input, oversized quantities and unsupported units',()=>{
 assert.throws(()=>applyShoppingOperation({list:base,membership:owner,operation:{...op(),quantity:-1}}),/invalid_quantity/);
 assert.throws(()=>applyShoppingOperation({list:base,membership:owner,operation:{...op(),unit:'cups'}}),/invalid_unit/);
 assert.throws(()=>applyShoppingOperation({list:base,membership:owner,operation:{...op(),item_id:'bad'}}),/invalid_item_id/);
 assert.throws(()=>applyShoppingOperation({list:base,membership:owner,operation:{...op(),idempotency_key:'bad'}}),/invalid_idempotency_key/);
});

test('same item ID cannot be added twice',()=>{
 const changed=applyShoppingOperation({list:base,membership:owner,operation:op()});
 assert.throws(()=>applyShoppingOperation({list:changed,membership:owner,operation:op('add',1)}),/item_already_exists_or_full/);
});
