#!/usr/bin/env node
// Run after Wrangler dry-run. This complements real browser hydration tests:
// ensure esbuild cannot silently reintroduce the eight editorial JSON imports.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const file=process.argv[2];if(!file)throw Error('Pass the production bundle path');
const bundle=await readFile(file,'utf8');
for(const directory of ['study-v1','science/shared-v2'])assert.ok(!bundle.includes('// public/education/'+directory+'/'),'Static editorial data imported in production bundle: '+directory);
assert.ok(Buffer.byteLength(bundle)<7_600_000,'Production bundle regained the offloaded worksheet payload');
console.log('PASS study bundle: '+Buffer.byteLength(bundle)+' bytes, no static imports of the eight editorial study/shared JSON packs');
