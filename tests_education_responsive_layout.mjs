import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

// All checks run against the actual served HTML, offline, without AI requests.
const html=await(await frontend.fetch(new Request('https://layout.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'frontend script is embedded');
new vm.Script(inline);

const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]).join('\n');
assert.equal((html.match(/id="education-responsive-layout"/g)||[]).length,1,'only one authoritative responsive stylesheet');
assert.doesNotMatch(html,/id="education-mobile-layout-v[23]"/,'old contradictory styles removed');
const educationCSS=html.match(/<style id="education-responsive-layout">([\s\S]*?)<\/style>/)?.[1] || '';
assert.doesNotMatch(educationCSS,/height:calc\(100dvh\s*-\s*285px\)!important;\s*max-height:calc\(100dvh\s*-\s*285px\)!important/,'no hardcoded viewport for subject chooser');

assert.match(styles,/main\.page:has\(#view-module\.learning-choose\.active\)\s*\{[^}]*overflow-x:hidden!important;overflow-y:hidden!important/s,'main page does not scroll during normal selection');
assert.match(styles,/#view-module\.learning-choose\.active\s*\{[^}]*display:grid!important;[^}]*grid-template-columns:[^}]*grid-template-rows:auto minmax\(0,1fr\)!important/s,'subject header and grid share the actual free viewport');
assert.match(styles,/#view-module\.learning-choose \.module-actions-row\s*\{[^}]*display:contents!important/s,'Home and the title are sibling cells without DOM reparenting');
assert.match(styles,/#view-module\.learning-choose \.module-home-btn\s*\{[^}]*grid-column:1!important;grid-row:1!important/s);
assert.match(styles,/#view-module\.learning-choose \.module-heading-row\s*\{[^}]*grid-column:2!important;grid-row:1!important;[^}]*align-items:center!important/s,'heading aligned to Home button centre');
assert.match(styles,/#view-module\.learning-choose #moduleContent\s*\{[^}]*grid-column:1\/-1!important;grid-row:2!important/s);
assert.match(styles,/#view-module\.learning-choose \.education-grid\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important;[^}]*grid-template-rows:repeat\(4,minmax\(108px,1fr\)\)!important/s,'all eight subjects retain usable size in a two-column scrollable grid');
assert.match(styles,/#view-module\.learning-choose #moduleContent\s*\{[^}]*overflow-y:auto!important/s,'only the content area scrolls, not the screen header or bottom dock');
assert.match(styles,/@media \(max-height:600px\), \(max-width:320px\)\s*\{[^}]*#view-module\.learning-choose \.education-grid\s*\{[^}]*grid-template-rows:repeat\(4,minmax\(108px,1fr\)\)!important/s,'short screens retain the bounded layout and readable rows');
assert.doesNotMatch(styles,/main\.page:has\(#view-module\.learning-choose\.active\),\s*main\.page:has\(#view-module\.learning-languages\.active\)/s,'old combined full-page scroll override has been removed');
assert.doesNotMatch(styles,/height:clamp\(350px,53dvh,475px\)!important/s,'no competing 53dvh subject grid');
assert.doesNotMatch(html,/Restore measured full-height subject selection/,'late contradictory education overrides removed');
assert.match(inline,/function renderLearningSubjects\(\)\{[\s\S]*?educationPage\.scrollTop=0/,'entering Education resets the previous page scrolling position');
assert.match(inline,/LEARNING_SUBJECTS\s*=\s*\[/,'the eight subject cards remain registered');
assert.match(styles,/#view-module\.learning-active\.active\s*\{[^}]*overflow:visible!important/s,'subject exercises remain visible and scroll within the main page');
console.log('PASS education fixed Home/title/footer and independently scrollable, full-height subject options');
