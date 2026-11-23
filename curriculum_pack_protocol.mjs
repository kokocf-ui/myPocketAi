// Shared deterministic protocol for decoupled Education curriculum packs.
// Safe for both Cloudflare Workers (Web Crypto, zero node:* imports) and Node 20+.

export const CURRICULUM_PACK_SCHEMA = 'mypocketai-curriculum-pack/v1';
const PACK_DOMAIN_SALT = 'mypocketai-commercial-curriculum-pack-v1:2026-11';
const SAFE_SEGMENT = /^[A-Za-z0-9._-]{1,40}$/;

export function normalizeCurriculumPackTuple(subject, country, grade) {
  const s = String(subject || '').trim().toLowerCase();
  const c = String(country || '').trim().toUpperCase();
  const g = String(grade || '').trim();
  if (!SAFE_SEGMENT.test(s) || !SAFE_SEGMENT.test(c) || !SAFE_SEGMENT.test(g)) {
    return null;
  }
  return { subject: s, country: c, grade: g, key: `${s}|${c}|${g}` };
}

export function curriculumPackKey(subject, country, grade) {
  const tuple = normalizeCurriculumPackTuple(subject, country, grade);
  return tuple ? tuple.key : '';
}

export async function curriculumPackAssetName(subject, country, grade) {
  const tuple = normalizeCurriculumPackTuple(subject, country, grade);
  if (!tuple) return null;
  const input = new TextEncoder().encode(`${PACK_DOMAIN_SALT}|${tuple.key}`);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', input);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < 12; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return `p-${hex}.json`;
}

export async function curriculumPackAssetPath(subject, country, grade) {
  const name = await curriculumPackAssetName(subject, country, grade);
  return name ? `/packs/${name}` : null;
}
