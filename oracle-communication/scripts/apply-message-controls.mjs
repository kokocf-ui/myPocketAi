#!/usr/bin/env node
// Add only authenticated message edit/delete to the existing Oracle deployment.
// Never replace the site's customized FCM, Caddy, or device enrollment code.
import {readFileSync,writeFileSync,copyFileSync,renameSync,mkdirSync,statSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve,dirname,join} from 'node:path';

const target=resolve(process.argv[2]||'oracle-communication/device-api.mjs');
const backupDir=resolve(process.argv[3]||'/home/ubuntu/pocketai-backups');
const original=readFileSync(target,'utf8');
const originalMode=statSync(target).mode&0o777;
const upstream=execFileSync('git',['show','origin/main:oracle-communication/device-api.mjs'],{encoding:'utf8'});
const beforeList="if(['messages','send','upload','attachment'].includes(action))";
const afterList="if(['messages','send','upload','attachment','edit_message','delete_message'].includes(action))";
const anchor="    check(uuid(data.messageId)&&b64(data.iv)&&data.iv.length===16&&b64(data.cipher),400,'Mesaj invalid');";
const startFlag="    // The server never sees plaintext. Only the authenticated original sender";
function requireOnce(haystack,needle,label){
 if(haystack.split(needle).length!==2)throw Error(label+' missing or non-unique; nothing changed.');
}
if(original.includes("if(action==='edit_message'||action==='delete_message')")){
 console.log('ALREADY_PRESENT: edit/delete message actions exist in this checkout.');process.exit(0);
}
requireOnce(original,beforeList,'Old action dispatch');
requireOnce(original,anchor,'Encrypted-message validation');
requireOnce(upstream,afterList,'Upstream action dispatch');
requireOnce(upstream,startFlag,'Upstream source');
requireOnce(upstream,anchor,'Upstream placement');
const start=upstream.indexOf(startFlag),end=upstream.indexOf(anchor,start);
if(end<=start||end-start>4000)throw Error('Unrecognized upstream change; nothing changed.');
const fragment=upstream.slice(start,end);
for(const expected of ["action==='edit_message'||action==='delete_message'","UPDATE device_messages SET iv=","DELETE FROM device_messages WHERE id=","notify(friend,'message',me)"]){
 if(!fragment.includes(expected))throw Error('Upstream operation incomplete: '+expected);
}
const changed=original.replace(beforeList,afterList).replace(anchor,fragment+anchor);
if(!changed.includes('push_register')||!changed.includes('push_unregister'))
 throw Error('Existing Firebase registration code not detected; nothing changed.');
if(!changed.includes("check(await approved(pool,me,friend)"))
 throw Error('Authentication guard missing; nothing changed.');
const temp=join(dirname(target),'.device-api-message-upgrade-'+process.pid+'.mjs');
try{
 writeFileSync(temp,changed,{mode:originalMode,flag:'wx'});
 execFileSync(process.execPath,['--check',temp],{stdio:'pipe'});
 mkdirSync(backupDir,{recursive:true,mode:0o700});
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 const backup=join(backupDir,'device-api-before-message-controls-'+stamp+'.mjs');
 copyFileSync(target,backup);
 renameSync(temp,target);
 console.log('UPDATED: server API now supports authenticated edit_message and delete_message.');
 console.log('BACKUP: '+backup);
 console.log('FCM registration preserved. JavaScript syntax verified.');
}catch(error){
 try{rmSync(temp,{force:true})}catch{}
 throw error;
}
