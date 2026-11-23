// Shared deterministic protocol for decoupled Education curriculum packs.
// Safe for both Cloudflare Workers (Web Crypto, zero node:* imports) and Node 20+.

export const CURRICULUM_PACK_SCHEMA = 'mypocketai-curriculum-pack/v1';
const PACK_DOMAIN_SALT = 'mypocketai-commercial-curriculum-pack-v1:2026-11';
const SAFE_SEGMENT = /^[A-Za-z0-9._-]{1,40}$/;

export function canonicalPackGrade(grade, stage = '') {
  const g = String(grade || '').trim();
  const st = String(stage || '').trim().toLowerCase();
  if (st === 'advanced' && g && !/^(bsc|msc|univ[-_])/i.test(g)) {
    return `univ-${g}`;
  }
  return g;
}

export function normalizeCurriculumPackTuple(subject, country, grade, stage = '') {
  const s = String(subject || '').trim().toLowerCase();
  const c = String(country || '').trim().toUpperCase();
  const g = canonicalPackGrade(grade, stage);
  if (!SAFE_SEGMENT.test(s) || !SAFE_SEGMENT.test(c) || !SAFE_SEGMENT.test(g)) {
    return null;
  }
  return { subject: s, country: c, grade: g, key: `${s}|${c}|${g}` };
}

export function curriculumPackKey(subject, country, grade, stage = '') {
  const tuple = normalizeCurriculumPackTuple(subject, country, grade, stage);
  return tuple ? tuple.key : '';
}

export async function curriculumPackAssetName(subject, country, grade, stage = '') {
  const tuple = normalizeCurriculumPackTuple(subject, country, grade, stage);
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

export async function curriculumPackAssetPath(subject, country, grade, stage = '') {
  const name = await curriculumPackAssetName(subject, country, grade, stage);
  return name ? `/packs/${name}` : null;
}

// Synchronous Node-only reader for unit tests (returns [] in Cloudflare Workers;
// bundles 0 bytes of lesson JSON into the Worker script).
const NODE_PACK_CACHE = new Map();
export function readNodeCurriculumPackLessons(subject, country, stage, grade, topic) {
  if (typeof process === 'undefined' || typeof process.getBuiltinModule !== 'function') {
    return [];
  }
  const tuple = normalizeCurriculumPackTuple(subject, country, grade, stage);
  if (!tuple) return [];
  let pack = NODE_PACK_CACHE.get(tuple.key);
  if (pack === undefined) {
    try {
      const cryptoMod = process.getBuiltinModule('node:crypto');
      const fsMod = process.getBuiltinModule('node:fs');
      const urlMod = process.getBuiltinModule('node:url');
      const hex = cryptoMod
        .createHash('sha256')
        .update(`${PACK_DOMAIN_SALT}|${tuple.key}`)
        .digest('hex')
        .slice(0, 24);
      const fileUrl = new URL(`./public/packs/p-${hex}.json`, import.meta.url);
      const raw = fsMod.readFileSync(urlMod.fileURLToPath(fileUrl), 'utf8');
      pack = JSON.parse(raw);
    } catch {
      pack = null;
    }
    NODE_PACK_CACHE.set(tuple.key, pack);
  }
  return pack?.lessonsByTopic?.[String(topic || '')] || [];
}
