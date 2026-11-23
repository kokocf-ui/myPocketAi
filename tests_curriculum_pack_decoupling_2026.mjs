import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './index.js';
import {
  CURRICULUM_PACK_SCHEMA,
  curriculumPackAssetName,
  curriculumPackAssetPath,
  curriculumPackKey
} from './curriculum_pack_protocol.mjs';
import { ALL_DECOUPLED_CURRICULUM_PACKS } from './curriculum_pack_catalog.mjs';
import {
  CURRICULUM_PACK_BUNDLE_VERSION,
  CURRICULUM_REMOTE_PACK_KEYS
} from './curriculum_pack_manifest.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const packsDir = path.join(rootDir, 'public', 'packs');

// 1. Manifest & disk packs must match authoritative catalog
assert.ok(ALL_DECOUPLED_CURRICULUM_PACKS.length >= 39, 'Expected at least 39 decoupled packs');
assert.equal(CURRICULUM_REMOTE_PACK_KEYS.length, ALL_DECOUPLED_CURRICULUM_PACKS.length);

for (const pack of ALL_DECOUPLED_CURRICULUM_PACKS) {
  const key = curriculumPackKey(pack.subject, pack.country, pack.grade);
  assert.ok(CURRICULUM_REMOTE_PACK_KEYS.includes(key), `Missing manifest key ${key}`);
  const fileName = await curriculumPackAssetName(pack.subject, pack.country, pack.grade);
  assert.match(fileName, /^p-[0-9a-f]{24}\.json$/);
  const diskRaw = await fs.readFile(path.join(packsDir, fileName), 'utf8');
  const parsed = JSON.parse(diskRaw);
  assert.equal(parsed.schema, CURRICULUM_PACK_SCHEMA);
  assert.equal(parsed.packVersion, CURRICULUM_PACK_BUNDLE_VERSION);
  assert.equal(parsed.country, pack.country);
  assert.equal(parsed.grade, pack.grade);
  assert.ok(Object.keys(parsed.lessonsByTopic || {}).length > 0);
}

// 2. Anti-scraping & validation checks on /api/curriculum-pack
{
  const noHeader = await app.fetch(
    new Request('https://test.local/api/curriculum-pack?subject=mathematics&country=HU&grade=5')
  );
  assert.equal(noHeader.status, 403, 'Direct scraper request without client header must be rejected');

  const crossSite = await app.fetch(
    new Request('https://test.local/api/curriculum-pack?subject=mathematics&country=HU&grade=5', {
      headers: { 'X-Pocket-Client': '1', 'Sec-Fetch-Site': 'cross-site' }
    })
  );
  assert.equal(crossSite.status, 403, 'Cross-site hotlink must be rejected');

  const traversal = await app.fetch(
    new Request('https://test.local/api/curriculum-pack?subject=mathematics&country=HU&grade=..%2Findex.js', {
      headers: { 'X-Pocket-Client': '1' }
    })
  );
  assert.equal(traversal.status, 400, 'Path traversal attempt must be rejected');

  const wrongMethod = await app.fetch(
    new Request('https://test.local/api/curriculum-pack?subject=mathematics&country=HU&grade=5', {
      method: 'POST',
      headers: { 'X-Pocket-Client': '1' }
    })
  );
  assert.equal(wrongMethod.status, 405);
}

// 3. Verify both Cloudflare env.ASSETS path and local Node disk fallback
for (const [country, grade, topic, expectedFragment] of [
  ['HU', '5', 'algebra', 'Valoarea pozițională'],
  ['HU', 'BSC1', 'linear-algebra', 'Subspații vectoriale'],
  ['ES', 'ESO4-A', 'algebra', 'Presupuesto y porcentaje'],
  ['IT', 'M1', 'geometry', 'Segmenti e angoli'],
  ['PT', '5', 'algebra', 'Multiplii și divizorii']
]) {
  const url = `https://test.local/api/curriculum-pack?subject=mathematics&country=${country}&grade=${encodeURIComponent(grade)}`;
  // Node fallback (!env.ASSETS)
  const resNode = await app.fetch(new Request(url, { headers: { 'X-Pocket-Client': '1' } }));
  assert.equal(resNode.status, 200);
  const bodyNode = await resNode.json();
  assert.ok(
    bodyNode.lessonsByTopic[topic]?.some(x => x.title.includes(expectedFragment)),
    `Node pack missing ${expectedFragment} for ${country}/${grade}/${topic}`
  );

  // Simulated Cloudflare Workers Static Assets binding (env.ASSETS)
  const expectedAssetPath = await curriculumPackAssetPath('mathematics', country, grade);
  let assetFetchedPath = null;
  const mockEnv = {
    ASSETS: {
      async fetch(assetReq) {
        assetFetchedPath = new URL(assetReq.url).pathname;
        const disk = await fs.readFile(path.join(rootDir, 'public', assetFetchedPath), 'utf8');
        return new Response(disk, { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }
  };
  const resAssets = await app.fetch(new Request(url, { headers: { 'X-Pocket-Client': '1' } }), mockEnv);
  assert.equal(resAssets.status, 200);
  assert.equal(assetFetchedPath, expectedAssetPath, 'Worker must resolve exact hashed static asset');
  const bodyAssets = await resAssets.json();
  assert.deepEqual(bodyAssets, bodyNode);
}

// 4. Verify HTML no longer inlines decoupled lesson JSON blobs, nor exposes server salt
const html = await (await app.fetch(new Request('https://test.local/'))).text();
assert.ok(!html.includes('mypocketai-commercial-curriculum-pack-v1'), 'Server pack salt must never leak to HTML');
assert.ok(!html.includes('const HUNGARY_G5_LESSONS='), 'Decoupled HU G5 blob must not be inlined in HTML');
assert.ok(!html.includes('const PORTUGAL_MATH_2026_LESSONS='), 'Decoupled PT blob must not be inlined in HTML');
for (const token of [
  'const EDU_REMOTE_PACK_KEYS=new Set(',
  'async function eduEnsureCurriculumPack(',
  'function eduRunWithCurriculumPack(',
  'function eduPackTopicLessons('
]) {
  assert.ok(html.includes(token), `Client bundle missing decoupled loader token: ${token}`);
}

console.log(`PASS decoupled curriculum pack architecture: ${ALL_DECOUPLED_CURRICULUM_PACKS.length} hashed packs, anti-scraping API, Cloudflare ASSETS + offline client loader`);
