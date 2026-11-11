import http from 'node:http';
import {randomBytes,randomInt,randomUUID,createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {Pool} from 'pg';
import nodemailer from 'nodemailer';

// Runs on Oracle VM ONLY. Neither D1 nor the Eva/AI Worker stores communication data.
const required=['PGHOST','PGDATABASE','PGUSER','PGPASSWORD','OTP_SECRET','APP_ORIGIN','SMTP_HOST','SMTP_USER','SMTP_PASSWORD','MAIL_FROM'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length)throw Error('Missing Oracle communication env: '+missing.join(', '));
if(process.env.OTP_SECRET.length<32)throw Error('OTP_SECRET must have at least 32 characters');
const pool=new Pool({max:8,connectionTimeoutMillis:6000});
const smtp=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),
 secure:Number(process.env.SMTP_PORT||587)===465,
 auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});
const originAllowed=String(process.env.APP_ORIGIN).replace(/\/$/,'');
if(!/^https:\/\/[^/]+$/.test(originAllowed))throw Error('APP_ORIGIN must be HTTPS');
const hash=v=>createHash('sha256').update(v).digest('hex');
const sign=(a,b)=>createHmac('sha256',process.env.OTP_SECRET).update(a+'|'+b).digest('hex');
const safeEq=(a,b)=>a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const id=()=>randomUUID();
const txt=v=>String(v??'').trim();
const email=v=>txt(v).toLowerCase();
const validMail=v=>/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,63}$/i.test(v)&&v.length<=254;
const validId=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
class ApiError extends Error{constructor(code,message){super(message);this.code=code;}}
function requireThat(test,code,message){if(!test)throw new ApiError(code,message)}
function send(res,status,data,origin){
 const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','vary':'Origin','referrer-policy':'no-referrer'};
 if(origin===originAllowed){headers['access-control-allow-origin']=originAllowed;headers['access-control-allow-headers']='authorization, content-type';headers['access-control-allow-methods']='GET, POST, DELETE, OPTIONS';}
 res.writeHead(status,headers);res.end(JSON.stringify(data));
}
async function body(req){
 const chunks=[];let size=0;
 for await(const c of req){size+=c.length;requireThat(size<=32768,413,'Cerere prea mare');chunks.push(c);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new ApiError(400,'JSON invalid')}
}
const quotas=new Map();
function rate(key,max=10,windowMs=60000){
 const now=Date.now();let r=quotas.get(key)||{count:0,until:now+windowMs};
 if(r.until<now)r={count:0,until:now+windowMs};r.count++;quotas.set(key,r);
 requireThat(r.count<=max,429,'Prea multe cereri. Reîncearcă mai târziu.');
 if(quotas.size>10000)for(const [k,v] of quotas)if(v.until<now)quotas.delete(k);
}
async function transaction(work){
 const c=await pool.connect();
 try{await c.query('BEGIN');const out=await work(c);await c.query('COMMIT');return out;}
 catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
}
async function currentUser(req){
 const header=String(req.headers.authorization||'');
 requireThat(/^Bearer [A-Za-z0-9_-]{35,128}$/.test(header),401,'Conectează-te');
 const token=hash(header.substring(7));
 const r=await pool.query('SELECT u.id,u.display_name,u.email FROM comm_sessions s JOIN comm_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now() AND u.disabled_at IS NULL',[token]);
 requireThat(r.rowCount===1,401,'Sesiune expirată');
 return r.rows[0];
}
async function approved(q,a,b){
 if(!validId(b)||a===b)return false;
 const x=await q.query('SELECT EXISTS(SELECT 1 FROM comm_contacts WHERE user_id=$1 AND contact_id=$2) AS forward, EXISTS(SELECT 1 FROM comm_contacts WHERE user_id=$2 AND contact_id=$1) AS reverse, EXISTS(SELECT 1 FROM comm_blocks WHERE (user_id=$1 AND blocked_id=$2) OR (user_id=$2 AND blocked_id=$1)) AS blocked',[a,b]);
 return x.rows[0].forward&&x.rows[0].reverse&&!x.rows[0].blocked;
}
async function roleInList(q,list,user){
 requireThat(validId(list),400,'Listă invalidă');
 const x=await q.query('SELECT role FROM comm_list_members WHERE list_id=$1 AND user_id=$2',[list,user]);
 requireThat(x.rowCount===1,403,'Lista nu este partajată cu tine');return x.rows[0].role;
}
async function route(req,res,url,origin){
 const path=url.pathname,method=req.method,answer=(code,value)=>send(res,code,value,origin);
 if(method==='OPTIONS')return answer(204,{});
 if(method==='GET'&&path==='/healthz')return answer(200,{status:'ok',service:'oracle-communication',version:'0.2'});
 requireThat(!origin||origin===originAllowed,403,'Origine neautorizată');
 // Only the Oracle TLS reverse proxy can access this internal service.
 const remote=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim().slice(0,64);
 rate('ip:'+remote,100);
 if(method==='POST'&&path==='/v1/auth/request-code'){
  const d=await body(req),mail=email(d.email),name=txt(d.displayName);
  requireThat(validMail(mail),400,'E-mail invalid');
  requireThat(name.length>=2&&name.length<=60,400,'Prenume invalid');
  rate('signup:'+remote,6,3600000);
  const old=await pool.query('SELECT created_at FROM comm_otp WHERE email=$1 ORDER BY created_at DESC LIMIT 1',[mail]);
  if(old.rowCount)requireThat(Date.now()-new Date(old.rows[0].created_at).getTime()>=60000,429,'Așteaptă un minut înainte de alt cod');
  const code=String(randomInt(0,1000000)).padStart(6,'0'),challenge=id();
  await pool.query("INSERT INTO comm_otp(id,email,code_hash,expires_at) VALUES($1,$2,$3,now()+interval '10 minutes')",[challenge,mail,sign(mail,code)]);
  try{await smtp.sendMail({from:process.env.MAIL_FROM,to:mail,subject:'myPocket AI — verificarea contului',text:'Codul tău myPocket AI: '+code+'\nExpiră în 10 minute. Nu îl comunica nimănui.'});}
  catch{await pool.query('DELETE FROM comm_otp WHERE id=$1',[challenge]);throw new ApiError(503,'E-mailul nu a putut fi trimis')}
  return answer(200,{ok:true,expiresInSeconds:600});
 }
 if(method==='POST'&&path==='/v1/auth/verify'){
  const d=await body(req),mail=email(d.email),name=txt(d.displayName),code=txt(d.code);
  requireThat(validMail(mail)&&name.length>=2&&name.length<=60&&/^\d{6}$/.test(code),400,'Date de verificare invalide');
  rate('verify:'+remote,12,3600000);
  const data=await transaction(async c=>{
   const q=await c.query('SELECT * FROM comm_otp WHERE email=$1 AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1 FOR UPDATE',[mail]);
   requireThat(q.rowCount===1,401,'Cod incorect sau expirat');
   const challenge=q.rows[0];
   requireThat(new Date(challenge.expires_at).getTime()>Date.now()&&challenge.attempts<5,401,'Cod incorect sau expirat');
   if(!safeEq(sign(mail,code),challenge.code_hash)){
     // Wrong attempts must COMMIT, not be rolled back by an exception.
     await c.query('UPDATE comm_otp SET attempts=attempts+1 WHERE id=$1',[challenge.id]);
     return {invalid:true};
   }
   await c.query('UPDATE comm_otp SET consumed_at=now() WHERE email=$1 AND consumed_at IS NULL',[mail]);
   const u=await c.query('INSERT INTO comm_users(id,email,display_name) VALUES($1,$2,$3) ON CONFLICT(email) DO UPDATE SET display_name=EXCLUDED.display_name RETURNING id,email,display_name',[id(),mail,name]);
   const token=randomBytes(32).toString('base64url');
   await c.query("INSERT INTO comm_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 days')",[hash(token),u.rows[0].id]);
   return {token,user:u.rows[0],expiresInSeconds:30*86400};
  });
  requireThat(!data.invalid,401,'Cod incorect sau expirat');
  return answer(200,data);
 }
 const me=await currentUser(req);
 if(method==='GET'&&path==='/v1/me')return answer(200,{id:me.id,displayName:me.display_name,email:me.email});
 if(method==='POST'&&path==='/v1/auth/logout'){
  await pool.query('UPDATE comm_sessions SET revoked_at=now() WHERE token_hash=$1',[hash(req.headers.authorization.substring(7))]);
  return answer(200,{ok:true});
 }
 if(method==='POST'&&path==='/v1/invites'){
  rate('invite:'+me.id,20,86400000);
  const secret=randomBytes(32).toString('base64url');
  await pool.query("INSERT INTO comm_invites(id,token_hash,inviter_id,expires_at) VALUES($1,$2,$3,now()+interval '7 days')",[id(),hash(secret),me.id]);
  return answer(201,{inviteUrl:originAllowed+'/?commInvite='+encodeURIComponent(secret),expiresInSeconds:604800});
 }
 if(method==='GET'&&path==='/v1/invites'){
  const r=await pool.query('SELECT id,status,created_at,expires_at FROM comm_invites WHERE inviter_id=$1 ORDER BY created_at DESC LIMIT 40',[me.id]);
  return answer(200,{invites:r.rows});
 }
 if(method==='POST'&&path==='/v1/invites/accept'){
  const d=await body(req),secret=txt(d.token);
  requireThat(/^[A-Za-z0-9_-]{40,100}$/.test(secret),400,'Invitație invalidă');
  const result=await transaction(async c=>{
   const q=await c.query('SELECT * FROM comm_invites WHERE token_hash=$1 FOR UPDATE',[hash(secret)]);
   requireThat(q.rowCount===1,404,'Invitație necunoscută');
   const invite=q.rows[0];
   requireThat(invite.status==='pending'&&new Date(invite.expires_at)>new Date(),410,'Invitație expirată sau folosită');
   requireThat(invite.inviter_id!==me.id,400,'Nu te poți invita singur');
   const blocked=await c.query('SELECT 1 FROM comm_blocks WHERE (user_id=$1 AND blocked_id=$2) OR (user_id=$2 AND blocked_id=$1)',[me.id,invite.inviter_id]);
   requireThat(!blocked.rowCount,403,'Contact blocat');
   await c.query('INSERT INTO comm_contacts(user_id,contact_id) VALUES($1,$2),($2,$1) ON CONFLICT DO NOTHING',[me.id,invite.inviter_id]);
   await c.query("UPDATE comm_invites SET status='accepted',accepted_by=$1 WHERE id=$2",[me.id,invite.id]);
   return {ok:true,contactId:invite.inviter_id};
  });
  return answer(200,result);
 }
 if(method==='GET'&&path==='/v1/contacts'){
  const r=await pool.query('SELECT u.id,u.display_name AS "displayName", k.exchange_public AS "exchangePublic" FROM comm_contacts c JOIN comm_contacts r ON r.user_id=c.contact_id AND r.contact_id=c.user_id JOIN comm_users u ON u.id=c.contact_id AND u.disabled_at IS NULL LEFT JOIN comm_device_keys k ON k.user_id=u.id WHERE c.user_id=$1 AND NOT EXISTS(SELECT 1 FROM comm_blocks b WHERE (b.user_id=$1 AND b.blocked_id=u.id) OR (b.user_id=u.id AND b.blocked_id=$1)) ORDER BY u.display_name LIMIT 200',[me.id]);
  return answer(200,{contacts:r.rows});
 }
 if(method==='POST'&&path==='/v1/blocks'){
  const d=await body(req),other=txt(d.contactId);
  requireThat(validId(other)&&other!==me.id,400,'Contact invalid');
  await transaction(async c=>{
   await c.query('INSERT INTO comm_blocks(user_id,blocked_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[me.id,other]);
   await c.query('DELETE FROM comm_contacts WHERE (user_id=$1 AND contact_id=$2) OR (user_id=$2 AND contact_id=$1)',[me.id,other]);
  });
  return answer(200,{ok:true});
 }
 const unblock=path.match(/^\/v1\/blocks\/([0-9a-f-]{36})$/i);
 if(method==='DELETE'&&unblock){
  await pool.query('DELETE FROM comm_blocks WHERE user_id=$1 AND blocked_id=$2',[me.id,unblock[1]]);
  return answer(200,{ok:true});
 }
 if(method==='POST'&&path==='/v1/device-key'){
  const d=await body(req),key=d.exchangePublic;
  requireThat(key&&typeof key==='object'&&key.kty==='EC'&&key.crv==='P-256'&&
    /^[A-Za-z0-9_-]{40,50}$/.test(String(key.x||''))&&
    /^[A-Za-z0-9_-]{40,50}$/.test(String(key.y||''))&&!('d' in key),
    400,'Cheie publică invalidă');
  // Preserve the original device key. Reinstall/key recovery requires an
  // explicit authenticated reset flow, never silent replacement.
  const q=await pool.query('INSERT INTO comm_device_keys(user_id,exchange_public) VALUES($1,$2::jsonb) ON CONFLICT(user_id) DO NOTHING RETURNING user_id',[me.id,JSON.stringify(key)]);
  const stored=await pool.query('SELECT exchange_public FROM comm_device_keys WHERE user_id=$1',[me.id]);
  requireThat(JSON.stringify(stored.rows[0].exchange_public)===JSON.stringify(key)||q.rowCount===1,409,'Această identitate are deja altă cheie de dispozitiv');
  return answer(200,{ok:true});
 }
 if(method==='POST'&&path==='/v1/threads'){
  const d=await body(req),other=txt(d.contactId);
  requireThat(await approved(pool,me.id,other),403,'Contact neaprobat');
  const pair=[me.id,other].sort().join(':');
  const result=await transaction(async c=>{
   await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[pair]);
   const q=await c.query('SELECT thread_id FROM comm_direct_threads WHERE pair_key=$1',[pair]);
   if(q.rowCount)return {threadId:q.rows[0].thread_id};
   const thread=id();
   await c.query('INSERT INTO comm_threads(id,created_by) VALUES($1,$2)',[thread,me.id]);
   await c.query('INSERT INTO comm_thread_members(thread_id,user_id) VALUES($1,$2),($1,$3)',[thread,me.id,other]);
   await c.query('INSERT INTO comm_direct_threads(pair_key,thread_id) VALUES($1,$2)',[pair,thread]);
   return {threadId:thread};
  });
  return answer(200,result);
 }
 const threadMsg=path.match(/^\/v1\/threads\/([0-9a-f-]{36})\/messages$/i);
 if(threadMsg){
  const thread=threadMsg[1];
  const p=await pool.query('SELECT user_id FROM comm_thread_members WHERE thread_id=$1',[thread]);
  requireThat(p.rowCount===2&&p.rows.some(v=>v.user_id===me.id),403,'Nu ai acces la conversație');
  const friend=p.rows.find(v=>v.user_id!==me.id)?.user_id;
  requireThat(await approved(pool,me.id,friend),403,'Contact blocat sau neaprobat');
  if(method==='GET'){
   const r=await pool.query('SELECT id,sender_id,nonce,ciphertext,created_at,client_id FROM comm_messages WHERE thread_id=$1 ORDER BY created_at DESC,id DESC LIMIT 100',[thread]);
   return answer(200,{messages:r.rows.reverse()});
  }
  if(method==='POST'){
   const d=await body(req),ciphertext=txt(d.ciphertext),nonce=txt(d.nonce),clientId=txt(d.clientId);
   requireThat(!('text' in d)&&!('plaintext' in d),400,'Mesajele în clar sunt interzise');
   requireThat(/^[A-Za-z0-9_-]{16}$/.test(nonce)&&/^[A-Za-z0-9_-]{24,16000}$/.test(ciphertext),400,'Mesaj criptat invalid');
   requireThat(/^[A-Za-z0-9_-]{8,100}$/.test(clientId),400,'Identificator invalid');
   rate('message:'+me.id,60,60000);
   const q=await pool.query('INSERT INTO comm_messages(id,thread_id,sender_id,ciphertext,nonce,client_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(sender_id,client_id) DO UPDATE SET client_id=EXCLUDED.client_id RETURNING id,created_at',[id(),thread,me.id,ciphertext,nonce,clientId]);
   return answer(201,{ok:true,message:q.rows[0]});
  }
 }
 if(method==='POST'&&path==='/v1/lists'){
  const d=await body(req),title=txt(d.title);
  requireThat(title.length>0&&title.length<=120,400,'Titlu invalid');
  const result=await transaction(async c=>{
   const list=id();
   await c.query('INSERT INTO comm_lists(id,title,owner_id) VALUES($1,$2,$3)',[list,title,me.id]);
   await c.query("INSERT INTO comm_list_members(list_id,user_id,role) VALUES($1,$2,'owner')",[list,me.id]);
   return {listId:list,revision:0};
  });
  return answer(201,result);
 }
 if(method==='GET'&&path==='/v1/lists'){
  const r=await pool.query('SELECT l.id,l.title,l.revision,m.role FROM comm_lists l JOIN comm_list_members m ON m.list_id=l.id WHERE m.user_id=$1 ORDER BY l.created_at DESC LIMIT 100',[me.id]);
  return answer(200,{lists:r.rows});
 }
 const list=path.match(/^\/v1\/lists\/([0-9a-f-]{36})$/i);
 if(method==='GET'&&list){
  await roleInList(pool,list[1],me.id);
  const info=await pool.query('SELECT id,title,revision FROM comm_lists WHERE id=$1',[list[1]]);
  const ops=await pool.query('SELECT id,actor_id,client_id,revision,kind,item_id,detail,created_at FROM comm_list_ops WHERE list_id=$1 ORDER BY revision LIMIT 10000',[list[1]]);
  return answer(200,{list:info.rows[0],operations:ops.rows});
 }
 const share=path.match(/^\/v1\/lists\/([0-9a-f-]{36})\/share$/i);
 if(method==='POST'&&share){
  requireThat((await roleInList(pool,share[1],me.id))==='owner',403,'Doar proprietarul poate partaja');
  const d=await body(req),other=txt(d.contactId),role=d.role==='viewer'?'viewer':'editor';
  requireThat(await approved(pool,me.id,other),403,'Contact neaprobat');
  await pool.query('INSERT INTO comm_list_members(list_id,user_id,role) VALUES($1,$2,$3) ON CONFLICT(list_id,user_id) DO UPDATE SET role=EXCLUDED.role',[share[1],other,role]);
  return answer(200,{ok:true});
 }
 const revoke=path.match(/^\/v1\/lists\/([0-9a-f-]{36})\/members\/([0-9a-f-]{36})$/i);
 if(method==='DELETE'&&revoke){
  requireThat((await roleInList(pool,revoke[1],me.id))==='owner'&&revoke[2]!==me.id,403,'Permisiune refuzată');
  await pool.query('DELETE FROM comm_list_members WHERE list_id=$1 AND user_id=$2',[revoke[1],revoke[2]]);
  return answer(200,{ok:true});
 }
 const op=path.match(/^\/v1\/lists\/([0-9a-f-]{36})\/ops$/i);
 if(method==='POST'&&op){
  const d=await body(req),kind=txt(d.kind),item=txt(d.itemId),clientId=txt(d.clientId);
  requireThat(['add','change_quantity','check','uncheck','remove'].includes(kind)&&item.length>0&&item.length<=100,400,'Operație invalidă');
  requireThat(/^[A-Za-z0-9_-]{8,100}$/.test(clientId),400,'Identificator operație invalid');
  requireThat(Number.isInteger(d.expectedRevision)&&d.expectedRevision>=0,400,'Revizie invalidă');
  const details=d.detail&&typeof d.detail==='object'&&!Array.isArray(d.detail)?d.detail:{};
  requireThat(JSON.stringify(details).length<=2500,413,'Detalii prea mari');
  const result=await transaction(async c=>{
   const q=await c.query('SELECT revision FROM comm_lists WHERE id=$1 FOR UPDATE',[op[1]]);
   requireThat(q.rowCount===1,404,'Listă inexistentă');
   const role=await roleInList(c,op[1],me.id);
   requireThat(role==='owner'||role==='editor',403,'Fără drept de modificare');
   const same=await c.query('SELECT id,revision FROM comm_list_ops WHERE list_id=$1 AND actor_id=$2 AND client_id=$3',[op[1],me.id,clientId]);
   if(same.rowCount)return {ok:true,idempotent:true,...same.rows[0]};
   requireThat(q.rows[0].revision===d.expectedRevision,409,'Lista a fost modificată; sincronizează întâi.');
   const revision=d.expectedRevision+1,operation=id();
   await c.query('INSERT INTO comm_list_ops(id,list_id,actor_id,client_id,revision,kind,item_id,detail) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb)',[operation,op[1],me.id,clientId,revision,kind,item,JSON.stringify(details)]);
   await c.query('UPDATE comm_lists SET revision=$1 WHERE id=$2',[revision,op[1]]);
   return {ok:true,id:operation,revision};
  });
  return answer(201,result);
 }
 // Only opaque encrypted message envelopes are accepted, never plaintext.
 return answer(404,{error:'Rută necunoscută sau funcție indisponibilă'});
}
const server=http.createServer((req,res)=>{
 const origin=String(req.headers.origin||'');
 const url=new URL(req.url,'http://127.0.0.1');
 Promise.resolve().then(()=>route(req,res,url,origin)).catch(e=>{
  const status=e instanceof ApiError?e.code:500;
  if(status===500)console.error('Oracle communication error:',e.name);
  if(!res.headersSent)send(res,status,{error:status===500?'Eroare temporară de server':e.message},origin);
 });
});
server.headersTimeout=12000;server.requestTimeout=20000;server.keepAliveTimeout=5000;
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Oracle communication API ready'));
process.on('SIGTERM',()=>server.close(()=>pool.end()));
