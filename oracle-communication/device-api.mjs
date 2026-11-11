import {createHash,createPublicKey,randomUUID,verify as verifySignature} from 'node:crypto';

const hash=s=>createHash('sha256').update(s).digest('hex');
const uuid=s=>typeof s==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const token=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{40,150}$/.test(s);
const b64=s=>typeof s==='string'&&/^[A-Za-z0-9_-]+$/.test(s);
const error=(status,message)=>Object.assign(new Error(message),{status});
const check=(condition,status,message)=>{if(!condition)throw error(status,message)};
const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data))};
const jwkOk=k=>k&&k.kty==='EC'&&k.crv==='P-256'&&b64(k.x)&&b64(k.y)&&!k.d;
function verified(jwk,signature,payload){
 try{return verifySignature('sha256',Buffer.from(payload),{key:createPublicKey({key:jwk,format:'jwk'}),dsaEncoding:'ieee-p1363'},Buffer.from(signature,'base64url'))}catch{return false}
}
async function readBody(req,limit){
 const chunks=[];let total=0;
 for await(const chunk of req){total+=chunk.length;check(total<=limit,413,'Fișier sau cerere prea mare');chunks.push(chunk)}
 try{return JSON.parse(Buffer.concat(chunks).toString())}catch{throw error(400,'JSON invalid')}
}
async function txn(pool,work){
 const db=await pool.connect();
 try{await db.query('BEGIN');const result=await work(db);await db.query('COMMIT');return result}
 catch(e){await db.query('ROLLBACK');throw e}finally{db.release()}
}
async function approved(db,a,b){
 if(!uuid(b)||a===b)return false;
 const q=await db.query(`SELECT EXISTS(SELECT 1 FROM device_contacts WHERE user_id=$1 AND friend_id=$2) AS outgoing,
 EXISTS(SELECT 1 FROM device_contacts WHERE user_id=$2 AND friend_id=$1) AS incoming,
 EXISTS(SELECT 1 FROM device_blocks WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)) AS blocked`,[a,b]);
 return q.rows[0].outgoing&&q.rows[0].incoming&&!q.rows[0].blocked
}
async function listRole(db,list,me){
 check(uuid(list),400,'Listă invalidă');
 const q=await db.query('SELECT l.id,l.title,l.owner_id,l.revision,m.role FROM device_lists l JOIN device_list_members m ON m.list_id=l.id WHERE l.id=$1 AND m.user_id=$2',[list,me]);
 check(q.rowCount===1,403,'Nu ai acces la această listă');
 return q.rows[0]
}
export function createDeviceCommunicationHandler(pool){
 return async function handle(req,res,path){
  if(req.method!=='POST'||!['/api/communication','/communication','/'].includes(path))return false;
  try{
   const data=await readBody(req,req.headers['content-length']>200000?17000000:17000000);
   check(data&&typeof data==='object'&&!Array.isArray(data),400,'Cerere invalidă');
   const action=String(data.action||'');
   check(action.length>0&&action.length<40,400,'Acțiune invalidă');
   if(action==='register'){
    const {timestamp,nonce,name,signPublic,exchangePublic,proof}=data;
    check(Number.isSafeInteger(timestamp)&&Math.abs(Date.now()-timestamp)<300000,401,'Data cererii este expirată');
    check(b64(nonce)&&nonce.length>=16&&nonce.length<=80,400,'Nonce invalid');
    check(typeof name==='string'&&name.trim().length>=2&&name.trim().length<=45,400,'Nume invalid');
    check(jwkOk(signPublic)&&jwkOk(exchangePublic)&&b64(proof),400,'Cheie invalidă');
    const message='register\\n'+timestamp+'\\n'+nonce+'\\n'+JSON.stringify({name,signPublic,exchangePublic});
    check(verified(signPublic,proof,message),401,'Semnătură invalidă');
    const keyHash=hash(JSON.stringify(signPublic));
    const result=await txn(pool,async db=>{
     const found=await db.query('SELECT id,display_name FROM device_users WHERE key_hash=$1',[keyHash]);
     if(found.rowCount)return {ok:true,id:found.rows[0].id};
     const id=randomUUID();
     await db.query('INSERT INTO device_users(id,display_name,key_hash,sign_public,exchange_public) VALUES($1,$2,$3,$4::jsonb,$5::jsonb)',[id,name.trim(),keyHash,JSON.stringify(signPublic),JSON.stringify(exchangePublic)]);
     return {ok:true,id}
    });
    return json(res,200,result),true
   }
   const me=req.headers['x-pocket-id'],stamp=Number(req.headers['x-pocket-timestamp']);
   const nonce=req.headers['x-pocket-nonce'],sig=req.headers['x-pocket-signature'];
   check(uuid(me)&&Number.isSafeInteger(stamp)&&Math.abs(Date.now()-stamp)<300000&&b64(nonce)&&nonce.length>=16&&nonce.length<=80&&b64(sig),401,'Identitate invalidă');
   const current=await pool.query('SELECT sign_public FROM device_users WHERE id=$1 AND disabled_at IS NULL',[me]);
   check(current.rowCount===1,401,'Dispozitiv necunoscut');
   check(verified(current.rows[0].sign_public,sig,stamp+'\\n'+nonce+'\\n'+JSON.stringify(data)),401,'Semnătură invalidă');
   await pool.query('DELETE FROM device_nonces WHERE expires_at<now()');
   const unique=await pool.query("INSERT INTO device_nonces(user_id,nonce,expires_at) VALUES($1,$2,now()+interval '6 minutes') ON CONFLICT DO NOTHING RETURNING nonce",[me,nonce]);
   check(unique.rowCount===1,409,'Cerere repetată');
   const friend=data.friend;
   if(action==='invite'){
    check(token(data.token),400,'Cod invitație invalid');
    const h=hash(data.token);
    await pool.query("INSERT INTO device_invites(code_hash,inviter_id,expires_at) VALUES($1,$2,now()+interval '7 days') ON CONFLICT DO NOTHING",[h,me]);
    return json(res,200,{ok:true}),true
   }
   if(action==='accept'){
    check(token(data.token),400,'Cod invalid');
    const result=await txn(pool,async db=>{
     const q=await db.query('SELECT inviter_id,expires_at,accepted_by FROM device_invites WHERE code_hash=$1 FOR UPDATE',[hash(data.token)]);
     check(q.rowCount===1,404,'Invitație inexistentă');
     const v=q.rows[0];
     check(!v.accepted_by&&new Date(v.expires_at)>new Date(),410,'Invitație folosită sau expirată');
     check(v.inviter_id!==me,400,'Nu te poți invita singur');
     const block=await db.query('SELECT 1 FROM device_blocks WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)',[me,v.inviter_id]);
     check(!block.rowCount,403,'Contact blocat');
     await db.query('INSERT INTO device_contacts(user_id,friend_id) VALUES($1,$2),($2,$1) ON CONFLICT DO NOTHING',[me,v.inviter_id]);
     await db.query('UPDATE device_invites SET accepted_by=$1 WHERE code_hash=$2',[me,hash(data.token)]);
     return {ok:true}
    });
    return json(res,200,result),true
   }
   if(action==='contacts'){
    const q=await pool.query(`SELECT u.id,u.display_name AS name,u.exchange_public AS "exchangePublic"
      FROM device_contacts c JOIN device_contacts r ON r.user_id=c.friend_id AND r.friend_id=c.user_id
      JOIN device_users u ON u.id=c.friend_id AND u.disabled_at IS NULL
      WHERE c.user_id=$1 AND NOT EXISTS(SELECT 1 FROM device_blocks b WHERE
      (b.user_id=$1 AND b.friend_id=u.id) OR (b.user_id=u.id AND b.friend_id=$1))
      ORDER BY u.display_name LIMIT 200`,[me]);
    return json(res,200,{ok:true,contacts:q.rows}),true
   }
   if(action==='remove'){
    check(uuid(friend),400,'Contact invalid');
    await txn(pool,async db=>{
      await db.query('INSERT INTO device_blocks(user_id,friend_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[me,friend]);
      await db.query('DELETE FROM device_contacts WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)',[me,friend]);
      await db.query('DELETE FROM device_list_members m USING device_lists l WHERE m.list_id=l.id AND ((l.owner_id=$1 AND m.user_id=$2) OR (l.owner_id=$2 AND m.user_id=$1))',[me,friend]);
    });
    return json(res,200,{ok:true}),true
   }
   if(['messages','send','upload','attachment'].includes(action)){
    check(await approved(pool,me,friend),403,'Contact neaprobat');
    const pair=[me,friend].sort().join(':');
    if(action==='messages'){
     const q=await pool.query('SELECT id,sender_id AS sender,recipient_id AS recipient,iv,cipher,kind,attachment_id,created_ms FROM device_messages WHERE pair_key=$1 ORDER BY created_ms DESC,id DESC LIMIT 100',[pair]);
     return json(res,200,{ok:true,messages:q.rows.reverse()}),true
    }
    if(action==='attachment'){
     check(uuid(data.attachmentId),400,'Atașament invalid');
     const q=await pool.query('SELECT a.iv,a.cipher,a.kind,a.mime FROM device_attachments a JOIN device_messages m ON m.attachment_id=a.id WHERE a.id=$1 AND m.pair_key=$2',[data.attachmentId,pair]);
     check(q.rowCount===1,404,'Atașament indisponibil');
     return json(res,200,{ok:true,attachment:q.rows[0]}),true
    }
    check(uuid(data.messageId)&&b64(data.iv)&&data.iv.length===16&&b64(data.cipher),400,'Mesaj invalid');
    if(action==='send')check(data.cipher.length<=16000&&data.cipher.length>=24,413,'Mesaj prea mare');
    if(action==='upload'){
     check(['image','video','audio','file'].includes(data.kind)&&typeof data.mime==='string'&&data.mime.length<100,400,'Fișier invalid');
     check(data.cipher.length<=15600000,413,'Fișier prea mare');
    }
    const result=await txn(pool,async db=>{
     const existing=await db.query('SELECT id FROM device_messages WHERE sender_id=$1 AND client_id=$2',[me,data.messageId]);
     if(existing.rowCount)return {ok:true,duplicate:true};
     let attachment=null;
     if(action==='upload'){
      attachment=randomUUID();
      await db.query('INSERT INTO device_attachments(id,iv,cipher,kind,mime) VALUES($1,$2,$3,$4,$5)',[attachment,data.iv,data.cipher,data.kind,data.mime]);
     }
     await db.query('INSERT INTO device_messages(id,pair_key,sender_id,recipient_id,client_id,iv,cipher,kind,attachment_id,created_ms) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[randomUUID(),pair,me,friend,data.messageId,data.iv,action==='upload'?'':data.cipher,action==='upload'?'media':'text',attachment,Date.now()]);
     return {ok:true}
    });
    return json(res,200,result),true
   }
   if(action==='list_create'){
    check(typeof data.title==='string'&&data.title.trim().length>0&&data.title.length<=120,400,'Titlu invalid');
    const listId=randomUUID();
    await txn(pool,async db=>{
     await db.query('INSERT INTO device_lists(id,owner_id,title) VALUES($1,$2,$3)',[listId,me,data.title.trim()]);
     await db.query("INSERT INTO device_list_members(list_id,user_id,role) VALUES($1,$2,'owner')",[listId,me]);
    });
    return json(res,200,{ok:true,listId}),true
   }
   if(action==='lists'){
    const q=await pool.query('SELECT l.id,l.title,l.revision FROM device_lists l JOIN device_list_members m ON m.list_id=l.id WHERE m.user_id=$1 ORDER BY l.created_at DESC LIMIT 100',[me]);
    return json(res,200,{ok:true,lists:q.rows}),true
   }
   if(['list','list_share','list_op'].includes(action)){
    const list=await listRole(pool,data.listId,me);
    if(action==='list'){
     const q=await pool.query('SELECT item_id,kind,detail,revision FROM device_list_ops WHERE list_id=$1 ORDER BY revision LIMIT 10000',[list.id]);
     return json(res,200,{ok:true,list:{id:list.id,title:list.title,owner:list.owner_id,revision:list.revision},operations:q.rows}),true
    }
    if(action==='list_share'){
     check(list.role==='owner'&&await approved(pool,me,friend),403,'Partajare neautorizată');
     await pool.query("INSERT INTO device_list_members(list_id,user_id,role) VALUES($1,$2,$3) ON CONFLICT(list_id,user_id) DO UPDATE SET role=EXCLUDED.role",[list.id,friend,data.role==='viewer'?'viewer':'editor']);
     return json(res,200,{ok:true}),true
    }
    check(['owner','editor'].includes(list.role)&&uuid(data.opId)&&uuid(data.itemId)&&['add','change_quantity','check','uncheck','remove'].includes(data.kind),400,'Operație invalidă');
    const detail=data.detail||{};
    check(detail&&typeof detail==='object'&&!Array.isArray(detail)&&JSON.stringify(detail).length<=2500,400,'Detalii invalide');
    const result=await txn(pool,async db=>{
     const locked=await db.query('SELECT revision FROM device_lists WHERE id=$1 FOR UPDATE',[list.id]);
     const currentRole=await listRole(db,list.id,me);
     check(['owner','editor'].includes(currentRole.role),403,'Acces revocat');
     const previous=await db.query('SELECT revision FROM device_list_ops WHERE list_id=$1 AND user_id=$2 AND op_id=$3',[list.id,me,data.opId]);
     if(previous.rowCount)return {ok:true,revision:previous.rows[0].revision,duplicate:true};
     check(locked.rows[0].revision===data.expectedRevision,409,'revision_conflict');
     const revision=locked.rows[0].revision+1;
     await db.query('INSERT INTO device_list_ops(id,list_id,user_id,op_id,item_id,kind,detail,revision) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8)',[randomUUID(),list.id,me,data.opId,data.itemId,data.kind,JSON.stringify(detail),revision]);
     await db.query('UPDATE device_lists SET revision=$1 WHERE id=$2',[revision,list.id]);
     return {ok:true,revision}
    });
    return json(res,200,result),true
   }
   return json(res,404,{ok:false,error:'Acțiune necunoscută'}),true
  }catch(e){
   const status=Number.isInteger(e.status)?e.status:500;
   if(status===500)console.error('Device communication API:',e.name);
   return json(res,status,{ok:false,error:status===500?'Eroare temporară de server':e.message}),true
  }
 }
}
