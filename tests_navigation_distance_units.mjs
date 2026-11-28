import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const index=fs.readFileSync(new URL('./index.js',import.meta.url),'utf8');
const java=fs.readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/PocketNavigationService.java',import.meta.url),'utf8');
const start=index.indexOf('function formatNavigationKilometers('),end=index.indexOf('function projectWalkingPosition(',start);
assert.ok(start>=0&&end>start,'navigation distance formatter exists');
const ctx={Intl,Number,Math};
vm.createContext(ctx);vm.runInContext(index.slice(start,end),ctx);
const format=ctx.formatNavigationKilometers;
assert.equal(format(2101572,'ro'),'2.101,6 km');
assert.equal(format(1900,'ro'),'1,9 km');
assert.equal(format(300,'ro'),'0,30 km');
assert.equal(format(2101572,'en'),'2,101.6 km');
assert.equal(format(-20,'ro'),'—');
assert.match(index,/t\[6\]\+': '\+formatNavigationKilometers\(projected.remaining,state.language\)\+accuracy/);
assert.doesNotMatch(index,/Math\.round\(projected\.remaining\)\.toLocaleString\(state\.language\)\+' m'/);
assert.match(java,/String spokenRouteLengthKm\(double meters\)/);
assert.match(java,/spokenRouteLengthKm\(closest\.reportedMeters\)/);
assert.match(java,/raw\.optDouble\("distanceMeters",Double\.NaN\)/);
assert.match(java,/long scaled=Math\.round\(km\*unit\)/);
assert.match(index,/distanceMeters:Number\(route\.distanceMeters\)\|\|0/);
assert.doesNotMatch(java,/Math\.round\(closest\.totalMeters\)\+" metri\."/);
assert.match(java,/Math\.round\(remaining\/10\)\*10/,'metres kept for manoeuvre guidance');
assert.doesNotMatch(index,/Math\.round\(selected\.accessRoute\.distanceMeters\|\|0\)\+' m'/,
 'Transit access stage displays km, not metres');
assert.doesNotMatch(index,/Math\.round\(verified\.distanceMeters\|\|0\)\+' m'/,
 'Verified transit walking stage displays km, not metres');
assert.doesNotMatch(index,/Math\.round\(meters\)\+' m'/,
 'Transit boarding advice displays km, not metres');
assert.match(index,/current\.remoteOriginPreview=true/,
 'Navigation anchors at route departure point when physical GPS is in another locality (>5 km away)');
console.log('PASS: navigation displays and speaks kilometres while preserving GPS metres');
