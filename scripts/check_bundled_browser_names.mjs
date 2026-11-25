// Guards the production Worker bundle (wrangler/esbuild) against renamed
// browser functions. esbuild renames a module-level declaration (foo -> foo2)
// when the same name is also used as a free/global identifier elsewhere; a
// function serialized with .toString() then no longer defines `foo` in the
// page and every browser call fails, while unbundled Node tests still pass.
// Usage: wrangler deploy --dry-run --outdir <dir> && node scripts/check_bundled_browser_names.mjs <dir>/index.js
import {copyFile} from 'node:fs/promises';
const bundle=process.argv[2];
if(!bundle){console.error('usage: node scripts/check_bundled_browser_names.mjs <bundled index.js>');process.exit(2)}
const target=bundle.replace(/\.js$/,'')+'.check.mjs';
await copyFile(bundle,target);
const mod=await import(new URL('file://'+target).href);
const html=await (await mod.default.fetch(new Request('https://pocket.example/?nativeLaunch=1'),{},{waitUntil(){},passThroughOnException(){}})).text();
const esc=s=>s.replace(/\$/g,'\\$');
const bad=[];
const seen=new Set();
for(const m of html.matchAll(/function\s+([A-Za-z_$][\w$]*?)(\d+)\s*\(/g)){
 const base=m[1],full=m[1]+m[2];if(seen.has(full))continue;seen.add(full);
 const defined=new RegExp('(?:function\\s+|(?:var|let|const)\\s+)'+esc(base)+'\\s*[(=]').test(html);
 const calls=(html.match(new RegExp('(?<![\\w$.])'+esc(base)+'\\s*\\(','g'))||[]).length;
 const renamedCalls=(html.match(new RegExp('(?<![\\w$.]|function\\s)'+esc(full)+'\\s*\\(','g'))||[]).length;
 if(!defined&&calls>0)bad.push(full+': page calls '+base+'() '+calls+'x but only '+full+' is defined');
 // A call to the renamed name is only valid where the declaration itself is visible.
 if(defined&&renamedCalls>0&&!new RegExp('function\\s+'+esc(full)+'\\s*\\(').test(html.replace(new RegExp('=\\s*(?:async\\s+)?function\\s+'+esc(full),'g'),'')))
  bad.push(full+': page calls '+full+'() but it exists only as a named function expression');
}
if(bad.length){console.error('Renamed browser functions in the Worker bundle:\n'+bad.join('\n'));process.exit(1)}
console.log('PASS bundled browser names: '+html.length+' chars, no renamed browser functions');
