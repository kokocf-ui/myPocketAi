import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {readFileSync} from 'node:fs';
const html=await(await app.fetch(new Request('https://pdf-regression.test/'))).text();
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source&&source.length>100000,'Web app must render');
new vm.Script(source,{filename:'pocket-documents-a4.js'});
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');

// The selected file list is not polluted with duplicate bin buttons.
const start=source.indexOf('function renderMyDocuments(){');
const end=source.indexOf('\nfunction openExtraTool(key){',start);
assert.ok(start>0&&end>start,'My Documents source must be present');
const screen=source.slice(start,end);
assert.match(screen,/actions\.hidden=!selected\.size/,'No tools appear without selection');
assert.match(screen,/selectedCount\.textContent=selected\.size/,'Show number of selected PDFs');
assert.match(screen,/row\.append\(check,name\);list\.append\(row\)/,'Only checkbox and file name in each row');
assert.doesNotMatch(screen,/row\.append\(check,name,trash\)/,'No individual delete buttons');
assert.match(screen,/share-many:'\+JSON\.stringify\(names\)/,'Share selected PDFs in one operation');
assert.match(screen,/delete-many:'\+JSON\.stringify\(names\)/,'Delete selected PDFs under one confirmation');
assert.match(screen,/if\(names\.length===1\).*?print:/s,'Printing is restricted to one selected document');
assert.match(screen,/my-documents-batch/,'Single toolbar above document list');
assert.match(html,/\.my-documents-batch\[hidden\]\{display:none!important\}/,'The hidden attribute cannot be overridden by display:flex');
assert.match(html,/\.my-documents-row\{\s*display:grid!important;grid-template-columns:26px minmax\(0,1fr\)/,
 'Compact full-width document row with checkbox on the left');

// Only a true PDF viewer inside the same Activity may show the actual A4 printed pages.
assert.match(java,/private void openEducationDocumentByName\(String filename\)/,'Native open action');
const nativeStart=java.indexOf('private void openEducationDocumentByName(String filename)');
const nativeEnd=java.indexOf('private void shareManyEducationDocuments',nativeStart);
const open=java.slice(nativeStart,nativeEnd);
assert.match(open,/new PdfRenderer\(descriptor\)/,'A4 preview is rendered from the saved PDF bytes');
assert.match(open,/android\.app\.Dialog dialog=new android\.app\.Dialog\(this\)/,'Preview stays inside myPocketAI');
assert.match(open,/dialog\.setOnDismissListener/,'PDF and bitmap resources are freed after Back');
assert.doesNotMatch(open,/Intent\.ACTION_VIEW|Intent\.createChooser/,'No external PDF application for preview');
assert.match(java,/Bitmap\.createBitmap\(width,height,Bitmap\.Config\.ARGB_8888\)/,'PDF page is rendered as real high-contrast page image');
assert.match(java,/page\.render\(bitmap,null,null,PdfRenderer\.Page\.RENDER_MODE_FOR_DISPLAY\)/);
assert.match(java,/if\(active\[0\]!=null&&!active\[0\]\.isRecycled\(\)\)active\[0\]\.recycle\(\)/,'Previous page bitmap is released');
assert.match(java,/send\.setType\("application\/pdf"\)/,'PDF MIME type preserved');
assert.match(java,/Intent\.ACTION_SEND_MULTIPLE/,'Multi-document sharing sends genuine PDF attachments');
assert.match(java,/getCanonicalPath\(\)\.startsWith\(folder\.getCanonicalPath\(\)\+File\.separator\)/,'Bulk operations remain inside private folder');

// PDF headings should use typography rather than showing literal ** delimiters.
assert.match(java,/boolean markedHeading=raw\.trim\(\)\.matches/);
assert.match(java,/\.replace\("\*\*",""\)/,'Markdown bold syntax removed from rendered PDF text');
assert.match(java,/Lehul\(\?:a\)\?/,'Confirm typo is corrected only for known corrupted word');
console.log('PASS: selection-only bulk PDF actions, true in-app A4 preview, safe native storage and text formatting');
