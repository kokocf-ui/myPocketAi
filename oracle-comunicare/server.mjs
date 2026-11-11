import http from 'node:http';
import {createHash, randomUUID} from 'node:crypto';
import {webcrypto as crypto} from 'node:crypto';
import pg from 'pg';

const APP_ORIGIN = 'https://lifewise-ai-v2.kokocf.workers.dev';
const VERSION = '1.0.0-oracle-beta';
const db = new pg.Pool({host:process.env.PGHOST||'database',database:process.env.PGDATABASE||'pocket_comm',
 user:process.env.PGUSER||'pocket_comm',password:process.env.PGPASSWORD,
 max:8,connectionTimeoutMillis:5000,statement_timeout:15000});
const guid=x=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(x||''));
const codeOk=x=>/^[a-zA-Z0-9_-]{32,150}$/.test(String(x||''));
const b64ok=x=>/^[a-zA-Z0-9_-]+$/.test(String(x||''));
const hash=v=>createHash('sha256').update(v).digest('hex');
const decode=v=>Buffer.from(String(v||'').replace(/-/g,'+').replace(/_/g,'/'),'base64');
const json=(res,obj,status=200,origin='')=>{
 const head={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','vary':'Origin'};
 if(origin===APP_ORIGIN){head['access-control-allow-origin']=APP_ORIGIN;head['access-control-allow-headers']='Content-Type,X-Pocket-Id,X-Pocket-Timestamp,X-Pocket-Nonce,X-Pocket-Signature';head['access-control-allow-methods']='GET,POST,OPTIONS';}
 res.writeHead(status,head);res.end(JSON.stringify(obj));
};
const error=(msg,status=400)=>({ok:false,error:msg,status});
const now=()=>Date.now();
const rounds=new Map();
function limit(key,max=120,windowMs=60000){
 const clock=now(), entry=rounds.get(key);
 const next=!entry||entry.until<=clock?{num:1,until:clock+windowMs}:{num:entry.num+1,until:entry.until};
 rounds.set(key,next);
 if(rounds.size>20000)for(const [k,v] of rounds)if(v.until<clock)rounds.delete(k);
 return next.num<=max;
}
async function rawBody(req,maxBytes=40000){
 const chunks=[];let bytes=0;
 for await(const part of req){bytes+=part.length;if(bytes>maxBytes)throw error('payload_too_large',413);chunks.push(part)}
 return Buffer.concat(chunks).toString('utf8');
}
function keyOk(key){
 return key&&typeof key==='object'&&key.kty==='EC'&&key.crv==='P-256'&&!('d' in key)&&
  /^[a-zA-Z0-9_-]{40,48}$/.test(key.x||'')&&/^[a-zA-Z0-9_-]{40,48}$/.test(key.y||'');
}
async function verify(publicJwk,sig,value){
 try{
  if(!keyOk(publicJwk)||!b64ok(sig))return false;
  const key=await crypto.subtle.importKey('jwk',publicJwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,decode(sig),new TextEncoder().encode(value));
 }catch{return false}
}
async function tx(work){
 const client=await db.connect();
 try{await client.query('BEGIN');const out=await work(client);await client.query('COMMIT');return out;}
 catch(e){await client.query('ROLLBACK');throw e;}finally{client.release()}
}
const pair=(x,y)=>x<y?[x,y]:[y,x];
async function areContacts(q,x,y){
 if(!guid(y)||x===y)return false;
 const [a,b]=pair(x,y);
 const r=await q.query('SELECT EXISTS(SELECT 1 FROM contacts WHERE a=$1 AND b=$2) AS connected, EXISTS(SELECT 1 FROM blocks WHERE (a=$1 AND b=$2) OR (a=$2 AND b=$1)) AS blocked',[a,b]);
 return r.rows[0].connected&&!r.rows[0].blocked;
}
async function userFromSignature(req,body){
 const uid=req.headers['x-pocket-id'], stamp=Number(req.headers['x-pocket-timestamp']),nonce=req.headers['x-pocket-nonce'],signature=req.headers['x-pocket-signature'];
 if(!guid(uid)||!Number.isFinite(stamp)||Math.abs(now()-stamp)>300000||!codeOk(nonce))throw error('authorization_required',401);
 const q=await db.query('SELECT id,display_name,sign_public,exchange_public FROM users WHERE id=$1 AND disabled=FALSE',[uid]);
 if(q.rowCount!==1)throw error('unknown_identity',401);
 if(!await verify(q.rows[0].sign_public,signature,stamp+'\n'+nonce+'\n'+body))throw error('invalid_signature',403);
 const r=await db.query('INSERT INTO request_nonces(uid,nonce,created_ms) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING nonce',[uid,nonce,now()]);
 if(!r.rowCount)throw error('replayed_request',409);
 if(!limit('user:'+uid,180))throw error('rate_limited',429);
 return q.rows[0];
}
async function handleAction(req,res,origin){
 const contentLength=Number(req.headers['content-length']||0);
 if(contentLength>19000000)throw error('payload_too_large',413);
 const body=await rawBody(req,19000000);
 let d;try{d=JSON.parse(body)}catch{throw error('invalid_json',400)}
 if(!d||typeof d.action!=='string')throw error('invalid_action',400);
 const reply=(obj,status=200)=>json(res,obj,status,origin),clock=now();
 if(d.action==='register'){
  if(!limit('register',100,3600000))throw error('registration_limited',429);
  const name=String(d.name||'').trim(),ts=Number(d.timestamp);
  if(name.length<2||name.length>45||!keyOk(d.signPublic)||!keyOk(d.exchangePublic)||!codeOk(d.nonce)||!Number.isFinite(ts)||Math.abs(clock-ts)>300000)throw error('invalid_registration',400);
  const proof='register\n'+ts+'\n'+d.nonce+'\n'+JSON.stringify({name,signPublic:d.signPublic,exchangePublic:d.exchangePublic});
  if(!await verify(d.signPublic,d.proof,proof))throw error('invalid_registration_proof',403);
  // Persist a device registration only after proving control of its private signing key.
  const uid=randomUUID();
  await db.query('INSERT INTO users(id,display_name,sign_public,exchange_public,created_ms) VALUES($1,$2,$3::jsonb,$4::jsonb,$5)',[uid,name,JSON.stringify(d.signPublic),JSON.stringify(d.exchangePublic),clock]);
  return reply({ok:true,id:uid,name});
 }
 const me=await userFromSignature(req,body),uid=me.id;
 if(d.action==='me')return reply({ok:true,id:uid,name:me.display_name});
 if(d.action==='invite'){
  if(!limit('invites:'+uid,12,3600000))throw error('invite_limited',429);
  const token=String(d.token||'');
  if(!codeOk(token)||token.length<60)throw error('invalid_invite_code',400);
  const claimed=await db.query('INSERT INTO invitations(token_hash,inviter,expires_ms,created_ms) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING token_hash',[hash(token),uid,clock+7*86400000,clock]);
  if(!claimed.rowCount)throw error('invite_conflict',409);
  return reply({ok:true,expires_ms:clock+7*86400000,inviter_name:me.display_name});
 }
 if(d.action==='accept'){
  const token=String(d.token||'');
  if(!codeOk(token))throw error('invalid_invite',400);
  if(!limit('accept:'+uid,10,3600000))throw error('too_many_attempts',429);
  const result=await tx(async c=>{
   const q=await c.query('SELECT * FROM invitations WHERE token_hash=$1 FOR UPDATE',[hash(token)]);
   if(!q.rowCount||q.rows[0].expires_ms<clock||q.rows[0].used_by)return error('invitation_expired_or_used',410);
   const invite=q.rows[0];
   if(invite.inviter===uid)return error('cannot_invite_yourself',400);
   const blocked=await c.query('SELECT 1 FROM blocks WHERE (a=$1 AND b=$2) OR (a=$2 AND b=$1)',[uid,invite.inviter]);
   if(blocked.rowCount)return error('blocked',403);
   const [a,b]=pair(uid,invite.inviter);
   await c.query('INSERT INTO contacts(a,b,created_ms) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[a,b,clock]);
   await c.query('UPDATE invitations SET used_by=$1 WHERE token_hash=$2',[uid,hash(token)]);
   return {ok:true,friend_id:invite.inviter};
  });
  return reply(result,result.status||200);
 }
 if(d.action==='contacts'){
  const q=await db.query('SELECT u.id,u.display_name,u.exchange_public FROM contacts c JOIN users u ON u.id=CASE WHEN c.a=$1 THEN c.b ELSE c.a END WHERE (c.a=$1 OR c.b=$1) AND u.disabled=FALSE AND NOT EXISTS(SELECT 1 FROM blocks bl WHERE (bl.a=$1 AND bl.b=u.id) OR (bl.b=$1 AND bl.a=u.id)) ORDER BY u.display_name LIMIT 150',[uid]);
  return reply({ok:true,contacts:q.rows.map(v=>({id:v.id,name:v.display_name,exchangePublic:v.exchange_public}))});
 }
 if(d.action==='remove'||d.action==='block'){
  const friend=String(d.friend||'');
  if(!guid(friend)||friend===uid)throw error('invalid_friend',400);
  const [a,b]=pair(uid,friend);
  await tx(async c=>{
   if(d.action==='block')await c.query('INSERT INTO blocks(a,b,created_ms) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[uid,friend,clock]);
   await c.query('DELETE FROM contacts WHERE a=$1 AND b=$2',[a,b]);
   await c.query('DELETE FROM list_members m USING shared_lists l WHERE m.list_id=l.id AND ((l.owner=$1 AND m.user_id=$2) OR (l.owner=$2 AND m.user_id=$1))',[uid,friend]);
  });
  return reply({ok:true});
 }
 if(d.action==='send'){
  const friend=String(d.friend||''),id=String(d.messageId||''),iv=String(d.iv||''),cipher=String(d.cipher||'');
  if(!await areContacts(db,uid,friend))throw error('not_a_contact',403);
  if(!guid(id)||!b64ok(iv)||iv.length!==16||!b64ok(cipher)||cipher.length<24||cipher.length>16000)throw error('invalid_encrypted_message',400);
  const duplicate=await db.query('SELECT sender,recipient FROM messages WHERE id=$1',[id]);
  if(duplicate.rowCount){
   if(duplicate.rows[0].sender===uid&&duplicate.rows[0].recipient===friend)return reply({ok:true,messageId:id,duplicate:true});
   throw error('message_conflict',409);
  }
  await db.query("INSERT INTO messages(id,sender,recipient,iv,cipher,kind,created_ms) VALUES($1,$2,$3,$4,$5,'text',$6)",[id,uid,friend,iv,cipher,clock]);
  return reply({ok:true,messageId:id,created_ms:clock});
 }
 if(d.action==='messages'){
  const friend=String(d.friend||'');
  if(!await areContacts(db,uid,friend))throw error('not_a_contact',403);
  const q=await db.query('SELECT id,sender,recipient,iv,cipher,kind,attachment_id,created_ms FROM (SELECT * FROM messages WHERE ((sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1)) ORDER BY created_ms DESC,id DESC LIMIT 100) t ORDER BY created_ms,id',[uid,friend]);
  return reply({ok:true,messages:q.rows});
 }
 if(d.action==='upload'){
  const friend=String(d.friend||''),media=String(d.kind||''),mime=String(d.mime||''),iv=String(d.iv||''),cipher=String(d.cipher||''),opaqueName=String(d.encryptedName||''),id=String(d.messageId||'');
  if(!await areContacts(db,uid,friend))throw error('not_a_contact',403);
  if(!['image','video','audio','file'].includes(media)||!guid(id)||!b64ok(iv)||iv.length!==16||!b64ok(cipher)||!b64ok(opaqueName)||opaqueName.length>1500)throw error('invalid_attachment',400);
  const allowedMimes={image:['image/jpeg','image/png','image/webp','image/gif'],video:['video/mp4','video/webm','video/quicktime','video/3gpp'],audio:['audio/mpeg','audio/mp4','audio/ogg','audio/wav','audio/webm'],file:['application/pdf']};
  if(!allowedMimes[media].includes(mime))throw error('invalid_media_type',400);
  if(cipher.length>16800000)throw error('attachment_too_large',413);
  const encrypted=decode(cipher);
  if(encrypted.length<=16||encrypted.length>12582912)throw error('attachment_too_large',413);
  const result=await tx(async c=>{
   const existing=await c.query('SELECT sender,recipient FROM messages WHERE id=$1',[id]);
   if(existing.rowCount){
    if(existing.rows[0].sender===uid&&existing.rows[0].recipient===friend)return {ok:true,messageId:id,duplicate:true};
    return error('message_conflict',409);
   }
   const attachmentId=randomUUID();
   await c.query('INSERT INTO attachments(id,sender,recipient,encrypted,iv,encrypted_name,media_kind,mime_type,size_bytes,created_ms,expires_ms) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[attachmentId,uid,friend,encrypted,iv,opaqueName,media,mime,encrypted.length,clock,clock+30*86400000]);
   await c.query("INSERT INTO messages(id,sender,recipient,iv,cipher,kind,attachment_id,created_ms) VALUES($1,$2,$3,$4,'','media',$5,$6)",[id,uid,friend,iv,attachmentId,clock]);
   return {ok:true,messageId:id,attachmentId,created_ms:clock};
  });
  return reply(result,result.status||200);
 }
 if(d.action==='attachment'){
  const friend=String(d.friend||''),id=String(d.attachmentId||'');
  if(!guid(id)||!await areContacts(db,uid,friend))throw error('not_a_contact',403);
  const q=await db.query('SELECT sender,recipient,encrypted,iv,encrypted_name,media_kind,mime_type FROM attachments WHERE id=$1 AND expires_ms>$2',[id,clock]);
  if(!q.rowCount||!((q.rows[0].sender===uid&&q.rows[0].recipient===friend)||(q.rows[0].sender===friend&&q.rows[0].recipient===uid)))throw error('not_found',404);
  const row=q.rows[0],base64=row.encrypted.toString('base64url');
  return reply({ok:true,attachment:{iv:row.iv,cipher:base64,encryptedName:row.encrypted_name,kind:row.media_kind,mime:row.mime_type}});
 }
 if(d.action==='list_create'){
  const title=String(d.title||'').trim();if(!title||title.length>120)throw error('invalid_list_title',400);
  const listId=randomUUID();
  await tx(async c=>{
   await c.query('INSERT INTO shared_lists(id,owner,title,created_ms) VALUES($1,$2,$3,$4)',[listId,uid,title,clock]);
   await c.query("INSERT INTO list_members(list_id,user_id,role) VALUES($1,$2,'owner')",[listId,uid]);
  });
  return reply({ok:true,listId,revision:0});
 }
 if(d.action==='lists'){
  const q=await db.query('SELECT l.id,l.title,l.revision,l.owner,m.role FROM shared_lists l JOIN list_members m ON m.list_id=l.id WHERE m.user_id=$1 ORDER BY l.created_ms DESC LIMIT 100',[uid]);
  return reply({ok:true,lists:q.rows});
 }
 if(d.action==='list'){
  if(!guid(d.listId))throw error('invalid_list',400);
  const member=await db.query('SELECT role FROM list_members WHERE list_id=$1 AND user_id=$2',[d.listId,uid]);
  if(!member.rowCount)throw error('forbidden',403);
  const info=await db.query('SELECT id,title,revision,owner FROM shared_lists WHERE id=$1',[d.listId]);
  const ops=await db.query('SELECT op_id,item_id,kind,detail,revision,created_ms FROM list_ops WHERE list_id=$1 ORDER BY revision LIMIT 5000',[d.listId]);
  return reply({ok:true,list:info.rows[0],operations:ops.rows});
 }
 if(d.action==='list_share'||d.action==='list_revoke'){
  if(!guid(d.listId)||!guid(d.friend))throw error('invalid_list',400);
  const q=await db.query('SELECT owner FROM shared_lists WHERE id=$1',[d.listId]);
  if(!q.rowCount||q.rows[0].owner!==uid)throw error('forbidden',403);
  if(d.action==='list_share'){
   if(!await areContacts(db,uid,d.friend))throw error('not_a_contact',403);
   const role=d.role==='viewer'?'viewer':'editor';
   await db.query('INSERT INTO list_members(list_id,user_id,role) VALUES($1,$2,$3) ON CONFLICT(list_id,user_id) DO UPDATE SET role=EXCLUDED.role',[d.listId,d.friend,role]);
  }else{
   if(d.friend===uid)throw error('cannot_remove_owner',403);
   await db.query('DELETE FROM list_members WHERE list_id=$1 AND user_id=$2',[d.listId,d.friend]);
  }
  return reply({ok:true});
 }
 if(d.action==='list_op'){
  if(!guid(d.listId)||!guid(d.itemId)||!guid(d.opId)||!['add','check','uncheck','remove','change_quantity'].includes(d.kind)||!Number.isInteger(d.expectedRevision)||d.expectedRevision<0)throw error('invalid_operation',400);
  const detail=d.detail&&typeof d.detail==='object'&&!Array.isArray(d.detail)?d.detail:{};
  if(JSON.stringify(detail).length>1500)throw error('invalid_detail',400);
  const r=await tx(async c=>{
   const list=await c.query('SELECT revision FROM shared_lists WHERE id=$1 FOR UPDATE',[d.listId]);
   if(!list.rowCount)return error('not_found',404);
   const member=await c.query('SELECT role FROM list_members WHERE list_id=$1 AND user_id=$2',[d.listId,uid]);
   if(!member.rowCount||member.rows[0].role==='viewer')return error('forbidden',403);
   const duplicate=await c.query('SELECT revision FROM list_ops WHERE op_id=$1 AND list_id=$2 AND actor=$3',[d.opId,d.listId,uid]);
   if(duplicate.rowCount)return {ok:true,idempotent:true,revision:duplicate.rows[0].revision};
   if(list.rows[0].revision!==d.expectedRevision)return error('revision_conflict',409);
   const revision=d.expectedRevision+1;
   await c.query('INSERT INTO list_ops(op_id,list_id,actor,item_id,kind,detail,revision,created_ms) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8)',[d.opId,d.listId,uid,d.itemId,d.kind,JSON.stringify(detail),revision,clock]);
   await c.query('UPDATE shared_lists SET revision=$1 WHERE id=$2',[revision,d.listId]);
   return {ok:true,revision};
  });
  return reply(r,r.status||200);
 }
 throw error('unknown_action',400);
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function inviteLanding(req,res,token){
 if(!codeOk(token))throw error('invalid_invite',404);
 const q=await db.query('SELECT u.display_name,i.expires_ms,i.used_by FROM invitations i JOIN users u ON u.id=i.inviter WHERE token_hash=$1',[hash(token)]);
 const valid=q.rowCount>0&&q.rows[0].expires_ms>now()&&!q.rows[0].used_by;
 const name=valid?esc(q.rows[0].display_name):'';
 const title=valid?name+' te invită să vă conectați în myPocket AI':'Invitația a expirat sau a fost folosită';
 // No third-party scripts, previews, analytics or external referrers.
 const html='<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Invitație myPocket AI</title><style>body{background:#0d2130;color:#fff;font:17px system-ui;margin:10vh auto;max-width:520px;padding:20px}a{display:block;background:#8c3653;color:white;padding:15px;border-radius:12px;text-align:center;margin-top:20px}code{overflow-wrap:anywhere}</style><h1>myPocket AI</h1><p>'+title+'</p>'+(valid?'<p>Deschide invitația în aplicație și apasă Acceptă.</p><a href="mypocketai://invite/'+encodeURIComponent(token)+'">Deschide în aplicație</a><p>Dacă linkul nu deschide aplicația, copiază acest cod în Comunicare → Invitații:</p><code>'+esc(token)+'</code>':'')+'</html>';
 res.writeHead(valid?200:410,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"});
 res.end(html);
}
export function makeServer(){
 const server=http.createServer(async(req,res)=>{
  const origin=String(req.headers.origin||'');
  try{
   const url=new URL(req.url||'/','http://127.0.0.1');
   if(origin&&origin!==APP_ORIGIN){json(res,error('origin_forbidden',403),403,origin);return}
   if(req.method==='OPTIONS'&&url.pathname==='/api/communication'){json(res,{ok:true},204,origin);return}
   if(req.method==='GET'&&url.pathname==='/healthz'&&!url.search){json(res,{status:'ok',service:'pocketai-comunicare-oracle',version:VERSION});return}
   if(req.method==='GET'&&url.pathname==='/readyz'&&!url.search){
    try{await db.query('SELECT 1');json(res,{ready:true});}catch{json(res,{ready:false},503)}
    return;
   }
   if(req.method==='GET'&&/^\/i\/[A-Za-z0-9_-]{32,150}$/.test(url.pathname)&&!url.search){
    await inviteLanding(req,res,url.pathname.slice(3));return;
   }
   if(req.method==='POST'&&url.pathname==='/api/communication'&&!url.search){
    const address=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].slice(0,80);
    if(!limit('source:'+address,150))throw error('rate_limited',429);
    await handleAction(req,res,origin);return;
   }
   json(res,error('not_found',404),404,origin);
  }catch(e){
   const status=Number.isInteger(e?.status)?e.status:500;
   if(status===500)console.error('Oracle Comms request failed:',e?.code||e?.name||'unknown');
   if(!res.headersSent)json(res,{ok:false,error:status===500?'server_unavailable':e.error||'request_failed'},status,origin);
  }
 });
 server.headersTimeout=12000;server.requestTimeout=45000;server.keepAliveTimeout=6000;
 return server;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 if(!process.env.PGPASSWORD||process.env.PGPASSWORD.length<24)throw Error('PGPASSWORD secret missing or too short');
 const server=makeServer();
 const port=Number(process.env.PORT||3000);
 server.listen(port,'0.0.0.0',()=>console.log('Oracle communications v'+VERSION+' listening internally'));
 process.on('SIGTERM',()=>server.close(()=>db.end()));
}
