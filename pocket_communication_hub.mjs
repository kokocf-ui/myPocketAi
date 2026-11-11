// Cloudflare SQLite Durable Object: invitation-only device-to-device communication pilot.
// Authentication: signed P-256 device keys; identity never derived from unverified email.
// Content: encrypted by devices before upload. No AI access and no public directory.
const j=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const bytes=v=>new TextEncoder().encode(v);
const b64decode=value=>{try{const str=atob(value.replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(str,c=>c.charCodeAt(0))}catch{return null}};
async function digest(value){const h=new Uint8Array(await crypto.subtle.digest("SHA-256",bytes(value)));return [...h].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function verifyP256(jwk,signature,message){
 try{
  if(jwk?.kty!=="EC"||jwk.crv!=="P-256"||typeof jwk.x!=="string"||typeof jwk.y!=="string")return false;
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);
  const sig=b64decode(signature);return !!sig&&sig.length===64&&await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},key,sig,bytes(message));
 }catch{return false}
}
function keyOk(jwk){return jwk?.kty==="EC"&&jwk.crv==="P-256"&&typeof jwk.x==="string"&&typeof jwk.y==="string"&&jwk.x.length<100&&jwk.y.length<100}
export class PocketCommunicationHub {
 constructor(state,env){
  this.storage=state.storage;
  this.db=this.storage.sql;
  this.db.exec("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, display_name TEXT NOT NULL, sign_key TEXT NOT NULL, exchange_key TEXT NOT NULL, created_ms INTEGER NOT NULL, disabled INTEGER NOT NULL DEFAULT 0)");
  this.db.exec("CREATE TABLE IF NOT EXISTS invitations (token_hash TEXT PRIMARY KEY, inviter TEXT NOT NULL, expires_ms INTEGER NOT NULL, used_by TEXT, created_ms INTEGER NOT NULL)");
  this.db.exec("CREATE TABLE IF NOT EXISTS contacts (a TEXT NOT NULL, b TEXT NOT NULL, created_ms INTEGER NOT NULL, PRIMARY KEY(a,b))");
  this.db.exec("CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, sender TEXT NOT NULL, recipient TEXT NOT NULL, iv TEXT NOT NULL, cipher TEXT NOT NULL, created_ms INTEGER NOT NULL)");
  this.db.exec("CREATE INDEX IF NOT EXISTS msg_pair_idx ON messages(sender,recipient,created_ms)");
  this.db.exec("CREATE TABLE IF NOT EXISTS request_nonces (uid TEXT NOT NULL, nonce TEXT NOT NULL, created_ms INTEGER NOT NULL, PRIMARY KEY(uid,nonce))");
  this.db.exec("CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, amount INTEGER NOT NULL, expires_ms INTEGER NOT NULL)");
 }
 record(sql,...args){return [...this.db.exec(sql,...args)][0]||null}
 rows(sql,...args){return [...this.db.exec(sql,...args)]}
 limit(key,max,now,windowMs=60000){
  const entry=this.record("SELECT amount,expires_ms FROM limits WHERE id=?",key);
  if(!entry||entry.expires_ms<now){this.db.exec("INSERT OR REPLACE INTO limits(id,amount,expires_ms) VALUES(?,?,?)",key,1,now+windowMs);return true}
  if(entry.amount>=max)return false;
  this.db.exec("UPDATE limits SET amount=amount+1 WHERE id=?",key);return true;
 }
 async fetch(request){
  if(request.method!=="POST")return j({error:"method_not_allowed"},405);
  const len=Number(request.headers.get("content-length")||0);
  if(len>30000)return j({error:"payload_too_large"},413);
  let text;try{text=await request.text()}catch{return j({error:"invalid_body"},400)}
  if(text.length>30000)return j({error:"payload_too_large"},413);
  let data;try{data=JSON.parse(text)}catch{return j({error:"invalid_json"},400)}
  if(!data||typeof data.action!=="string")return j({error:"invalid_action"},400);
  const now=Date.now();
  if(data.action==="health")return j({ok:true,ready:true,service:"PocketCommunicationHub"});
  this.db.exec("DELETE FROM request_nonces WHERE created_ms<?",now-420000);
  this.db.exec("DELETE FROM limits WHERE expires_ms<?",now-3600000);
  if(data.action==="register"){
   const name=String(data.name||"").trim().slice(0,45);
   const ts=Number(data.timestamp),nonce=String(data.nonce||"");
   if(name.length<2||!keyOk(data.signPublic)||!keyOk(data.exchangePublic)||Math.abs(now-ts)>300000||!/^[A-Za-z0-9_-]{16,80}$/.test(nonce))return j({error:"invalid_registration"},400);
   if(!this.limit("register_global",90,now,3600000))return j({error:"registration_limited"},429);
   const msg="register\n"+ts+"\n"+nonce+"\n"+JSON.stringify({name,signPublic:data.signPublic,exchangePublic:data.exchangePublic});
   if(!await verifyP256(data.signPublic,String(data.proof||""),msg))return j({error:"invalid_registration_proof"},403);
   const id=crypto.randomUUID();
   this.db.exec("INSERT INTO users(id,display_name,sign_key,exchange_key,created_ms) VALUES(?,?,?,?,?)",id,name,JSON.stringify(data.signPublic),JSON.stringify(data.exchangePublic),now);
   return j({ok:true,id,name});
  }
  const uid=String(request.headers.get("x-pocket-id")||"");
  const ts=Number(request.headers.get("x-pocket-timestamp"));
  const nonce=String(request.headers.get("x-pocket-nonce")||"");
  const signature=String(request.headers.get("x-pocket-signature")||"");
  if(!/^[0-9a-f-]{36}$/.test(uid)||!Number.isFinite(ts)||Math.abs(now-ts)>300000||!/^[A-Za-z0-9_-]{16,80}$/.test(nonce))return j({error:"authorization_required"},401);
  const account=this.record("SELECT * FROM users WHERE id=? AND disabled=0",uid);
  if(!account)return j({error:"unknown_identity"},401);
  if(!await verifyP256(JSON.parse(account.sign_key),signature,ts+"\n"+nonce+"\n"+text))return j({error:"invalid_signature"},403);
  const inserted=this.rows("INSERT INTO request_nonces(uid,nonce,created_ms) VALUES(?,?,?) ON CONFLICT DO NOTHING RETURNING nonce",uid,nonce,now);
  if(inserted.length!==1)return j({error:"replayed_request"},409);
  if(!this.limit("user:"+uid,180,now))return j({error:"rate_limited"},429);
  const pair=(a,b)=>a<b?[a,b]:[b,a];
  const isContact=other=>{const [a,b]=pair(uid,other);return !!this.record("SELECT 1 as found FROM contacts WHERE a=? AND b=?",a,b)};
  if(data.action==="me")return j({ok:true,id:uid,name:account.display_name});
  if(data.action==="invite"){
   if(!this.limit("invite:"+uid,12,now,3600000))return j({error:"invite_limited"},429);
   const token=String(data.token||"");
   if(!/^[A-Za-z0-9_-]{32,150}$/.test(token))return j({error:"invalid_invite_code"},400);
   const hash=await digest(token);
   this.db.exec("INSERT OR IGNORE INTO invitations(token_hash,inviter,expires_ms,created_ms) VALUES(?,?,?,?)",hash,uid,now+48*3600000,now);
   return j({ok:true,expires_ms:now+48*3600000});
  }
  if(data.action==="accept"){
   const code=String(data.token||"");
   if(!/^[A-Za-z0-9_-]{32,150}$/.test(code))return j({error:"invalid_invite"},400);
   if(!this.limit("accept:"+uid,12,now,3600000))return j({error:"too_many_attempts"},429);
   const hash=await digest(code);
   const invite=this.record("SELECT * FROM invitations WHERE token_hash=?",hash);
   if(!invite||invite.expires_ms<now||invite.used_by)return j({error:"invitation_expired_or_used"},404);
   if(invite.inviter===uid)return j({error:"cannot_invite_yourself"},400);
   const friend=this.record("SELECT id FROM users WHERE id=? AND disabled=0",invite.inviter);
   if(!friend)return j({error:"invitation_unavailable"},404);
   // No asynchronous statements between the atomic consume and membership.
   const claim=this.rows("UPDATE invitations SET used_by=? WHERE token_hash=? AND used_by IS NULL RETURNING token_hash",uid,hash);
   if(!claim.length)return j({error:"already_used"},409);
   const [a,b]=pair(uid,invite.inviter);
   this.db.exec("INSERT OR IGNORE INTO contacts(a,b,created_ms) VALUES(?,?,?)",a,b,now);
   return j({ok:true,friend_id:invite.inviter});
  }
  if(data.action==="contacts"){
   const contacts=this.rows("SELECT u.id,u.display_name,u.exchange_key FROM contacts c JOIN users u ON u.id=CASE WHEN c.a=? THEN c.b ELSE c.a END WHERE (c.a=? OR c.b=?) AND u.disabled=0 ORDER BY u.display_name LIMIT 100",uid,uid,uid)
     .map(x=>({id:x.id,name:x.display_name,exchangePublic:JSON.parse(x.exchange_key)}));
   return j({ok:true,contacts});
  }
  if(data.action==="remove"){
   const other=String(data.friend||"");if(!isContact(other))return j({error:"not_a_contact"},404);
   const [a,b]=pair(uid,other);
   this.db.exec("DELETE FROM contacts WHERE a=? AND b=?",a,b);
   return j({ok:true});
  }
  if(data.action==="send"){
   const other=String(data.friend||"");
   if(!isContact(other))return j({error:"not_a_contact"},403);
   const iv=String(data.iv||""),cipher=String(data.cipher||""),id=String(data.messageId||"");
   if(!/^[0-9a-f-]{36}$/.test(id)||!/^[A-Za-z0-9_-]{16}$/.test(iv)||!cipher||cipher.length>16000||!/^[A-Za-z0-9_-]+$/.test(cipher))return j({error:"invalid_encrypted_message"},400);
   const existing=this.record("SELECT sender,recipient FROM messages WHERE id=?",id);
   if(existing){if(existing.sender===uid&&existing.recipient===other)return j({ok:true,messageId:id,duplicate:true});return j({error:"message_conflict"},409)}
   this.db.exec("INSERT INTO messages(id,sender,recipient,iv,cipher,created_ms) VALUES(?,?,?,?,?,?)",id,uid,other,iv,cipher,now);
   return j({ok:true,messageId:id,created_ms:now});
  }
  if(data.action==="messages"){
   const other=String(data.friend||"");
   if(!isContact(other))return j({error:"not_a_contact"},403);
   const after=Math.max(0,Number(data.after)||0);
   const messages=this.rows("SELECT id,sender,recipient,iv,cipher,created_ms FROM messages WHERE ((sender=? AND recipient=?) OR (sender=? AND recipient=?)) AND created_ms>? ORDER BY created_ms,id LIMIT 100",uid,other,other,uid,after);
   return j({ok:true,messages});
  }
  return j({error:"unknown_action"},400);
 }
}
