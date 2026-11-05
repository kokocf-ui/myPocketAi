// Deterministic, offline tests: absolutely no Telegram or Workers AI calls.
import assert from "node:assert/strict";
import {parsePhoneMigration,makePhoneMigrationHandler} from "./telegram-login-dc.mjs";

assert.equal(parsePhoneMigration({code:303,errorMessage:"PHONE_MIGRATE_4"}),4);
assert.equal(parsePhoneMigration({code:303,errorMessage:"PHONE_MIGRATE_1"}),1);
assert.equal(parsePhoneMigration({code:303,errorMessage:"PHONE_MIGRATE_5"}),5);
assert.equal(parsePhoneMigration({code:303,errorMessage:"PHONE_MIGRATE_6"}),null);
assert.equal(parsePhoneMigration({code:400,errorMessage:"PHONE_MIGRATE_4"}),null);
assert.equal(parsePhoneMigration({code:303,errorMessage:"USER_MIGRATE_4"}),null);
assert.equal(parsePhoneMigration({code:303,errorMessage:"PHONE_MIGRATE_4 EXTRA"}),null);
assert.equal(parsePhoneMigration(null),null);

let calls=[],stops=[],notice=[];
const onError=makePhoneMigrationHandler({
 switchDC:async dc=>calls.push(dc),
 onRedirect:dc=>notice.push(dc),
 onOtherError:async e=>{stops.push(e.errorMessage);return true;}
});
const migration={code:303,errorMessage:"PHONE_MIGRATE_4"};
assert.equal(await onError(migration),false);
assert.deepEqual(calls,[4]);
assert.deepEqual(notice,[4]);
assert.deepEqual(stops,[]);
assert.equal(await onError(migration),true,"Never migrate or retry more than once");
assert.deepEqual(calls,[4]);
assert.deepEqual(stops,["PHONE_MIGRATE_4"]);

let failures=0,secondary=0;
const fails=makePhoneMigrationHandler({
 switchDC:async()=>{throw new Error("fake network private token")},
 onSwitchFailed:()=>{failures++},
 onOtherError:()=>{secondary++;return true;}
});
assert.equal(await fails(migration),true);
assert.equal(failures,1);
assert.equal(await fails(migration),true);
assert.equal(secondary,1);

const bad=makePhoneMigrationHandler({
 switchDC:()=>{throw new Error("should not redirect")},
 onOtherError:()=>true
});
assert.equal(await bad({code:420,errorMessage:"FLOOD_WAIT_30"}),true);
console.log("PASS Telegram phone migration: one bounded redirect on 303, no secret exposure or network requests");
