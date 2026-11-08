import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const android=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
const paths=readFileSync(new URL('./android/app/src/main/res/xml/file_paths.xml',import.meta.url),'utf8');

assert.match(frontend,/special:'my-documents'/,'My Documents appears in the visible Tools cards');
assert.match(frontend,/openModule\('tools'\);renderMyDocuments\(\)/,'Tools card opens native PDF library');
assert.match(frontend,/PocketAndroidDocuments\?\.postMessage\('share:'/,'PDF share action is wired to native bridge');
assert.match(android,/request\.startsWith\("share:"\)/,'share command received on Android');
assert.match(android,/Intent\.ACTION_SEND/,'native share chooser');
assert.match(android,/Intent\.EXTRA_STREAM/,'share real PDF attachment, not text');
assert.match(paths,/files-path name="education_documents" path="documentele_mele\/"\//,'FileProvider exposes only internal PDF library');
assert.match(frontend,/id='litPageCount'/,'literature page selector');
assert.match(frontend,/id='litPdfColor'/,'literature color selector');
assert.match(frontend,/Lungimea țintă: /,'literature AI uses target page guidance');
assert.match(frontend,/async function eduPdfFigures\(/,'graphics captured for PDFs');
assert.match(android,/ColorMatrixColorFilter/,'grayscale diagram support');
assert.match(android,/canvas\.drawBitmap\(bitmap/,'figures embedded in native PDF');
assert.match(android,/canvas\.drawText\("Pagina "/,'native PDF page numbering');
console.log('PDF library and literature export integration checks passed');
