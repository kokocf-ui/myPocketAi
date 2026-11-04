import assert from "node:assert/strict";
import {planPresentation} from "./presentation.mjs";
const news=planPresentation({language:"ro",reply:"Iată știrile",structured_list:{type:"news",rows:[
{title:"Știrea A",summary:"Detaliu",source_name:"Digi24",published_at:"2026-11-04",url:"https://example.com/a",original_title:"News A",verification:"source_identified_claims_unverified"},
{title:"Știrea B",summary:"Detaliu 2",source_name:"Interfax",published_at:"2026-11-04",url:"https://example.com/b",verification:"source_identified_claims_unverified"}]}});
assert.equal(news.layout,"collection");
assert.equal(news.blocks[0].kind,"table");
assert.ok(news.blocks[0].columns.some(x=>x.key==="source_name"));
assert.ok(news.blocks[0].rows[0].source_url==="https://example.com/a");
assert.ok(!Object.keys(news.blocks[0].rows[0].cells).includes("original_title"));
const list=planPresentation({language:"ro",reply:"- Unu\n- Doi\n- Trei"});
assert.equal(list.layout,"list");
assert.equal(list.blocks[0].items.length,3);
const prose=planPresentation({language:"en",reply:"Hello.\n\nHow are you?"});
assert.equal(prose.layout,"prose");
assert.equal(prose.blocks[0].paragraphs.length,2);
const malicious=planPresentation({language:"en",reply:"safe",structured_list:{type:"generic",rows:[{name:"ok",url:"javascript:alert(1)",extra:{html:"<script>bad</script>"}}]}});
assert.equal(malicious.blocks[0].rows[0].source_url,undefined);
assert.ok(!Object.keys(malicious.blocks[0].rows[0].cells).includes("extra"));
console.log("PASS generic presentation planner tables/lists/prose and safety checks");
