// Voice-message authorization policy only. NOT an HTTP endpoint or E2EE implementation.
// Call with an authenticated server-verified actor and server-loaded relationships.
// Do not accept any of these authorization records from an Android request body.
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const MAX_AUDIO_MS=3*60*1000;
const MAX_AUDIO_BYTES=10*1024*1024;
const AUDIO_TYPES=new Set(['audio/ogg','audio/webm','audio/mp4']);
function requireRule(ok,code) {
  if (!ok) throw Object.assign(new Error(code),{code});
}
function isUuid(v) { return typeof v==='string' && UUID.test(v); }

/**
 * Only a server-established relationship allows voice messaging:
 * - Direct: exactly two verified, mutually accepted chat participants.
 * - Group: sender must have accepted a group invitation, with chat enabled.
 * Being a customer, sharing a shopping list, or merely knowing an email
 * never automatically establishes private chat permission.
 */
export function authorizeVoiceAction({actor,thread,members,action='send'}) {
  requireRule(actor?.verified===true && isUuid(actor.userId), 'unauthenticated');
  requireRule(thread && isUuid(thread.id) &&
    (thread.kind==='direct'||thread.kind==='group') && thread.status==='active','invalid_thread');
  requireRule(action==='send'||action==='read', 'invalid_action');
  requireRule(Array.isArray(members) && members.length>=2, 'invalid_memberships');
  const ids=members.map(m=>m.userId);
  requireRule(ids.every(isUuid) && new Set(ids).size===ids.length, 'invalid_memberships');
  if (thread.kind==='direct') {
    requireRule(Array.isArray(thread.participantIds) && thread.participantIds.length===2 &&
      thread.participantIds.every(isUuid) && new Set(thread.participantIds).size===2 &&
      members.length===2 && members.every(m=>thread.participantIds.includes(m.userId)),
      'invalid_thread_participants');
  }
  const me=members.find(m=>m.userId===actor.userId);
  requireRule(me && me.status==='accepted' && me.chatAllowed===true &&
    me.blocked!==true, 'chat_not_authorized');
  if (thread.kind==='direct') {
    requireRule(members.length===2 && members.every(m=>
      m.status==='accepted' && m.chatAllowed===true && m.blocked!==true &&
      m.verifiedContact===true), 'mutual_chat_consent_required');
  } else {
    requireRule(thread.voiceEnabled===true && members.some(m=>m.userId!==actor.userId &&
      m.status==='accepted' && m.chatAllowed===true && m.blocked!==true), 'group_voice_not_allowed');
  }
  return { threadId:thread.id, actorId:actor.userId, action };
}

/** Upload limits; MIME bytes and audio duration must be independently
 * validated server-side; client-provided claims alone are untrusted. */
export function validateVoiceUploadClaim({mime,bytes,durationMs}) {
  requireRule(AUDIO_TYPES.has(mime),'unsupported_audio_type');
  requireRule(Number.isSafeInteger(bytes)&&bytes>0&&bytes<=MAX_AUDIO_BYTES,'invalid_audio_size');
  requireRule(Number.isSafeInteger(durationMs)&&durationMs>0&&durationMs<=MAX_AUDIO_MS,
    'invalid_audio_duration');
  return {mime,bytes,durationMs};
}
