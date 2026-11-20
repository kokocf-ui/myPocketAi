// One bounded, no-credit live probe against public image indexes.
// Does not use Brave, EXA, AI generation, or image downloads.
import {searchStorybookCommonsPhotos} from '../storybook_commons_photos.mjs';
const checks=[{topic:'Decebal',language:'ro',documentary:true},
 {topic:'Terracotta Army',language:'en',documentary:false}];
const contexts={Decebal:'Decebal, ultimul rege al Daciei, războaiele dacice cu Imperiul Roman'};
const results=[];
for(const check of checks){
 const started=Date.now();
 const result=await searchStorybookCommonsPhotos(check.topic,{
  limit:3,language:check.language,documentary:check.documentary,timeoutMs:9500});
 results.push({
  topic:check.topic,status:result.status,elapsed_ms:Date.now()-started,
  image_count:result.photos?.length||0,
  images:(result.photos||[]).map(p=>({
   title:p.title,provider:p.provider,source:p.source,
   rights_review_required:p.rights_review_required||false
  }))
 });
}
console.log(JSON.stringify({type:'no_credit_live_image_search',results},null,2));
if(results.some(r=>r.images.some(p=>/reme[sș]|ministru|minister/i.test(p.title))))
 throw Error('Unrelated modern politician image selected for Decebal');
if(!results[0].image_count){
 console.log('WARNING: Decebal images not verified in live providers; do not ship as finished illustrated book');
 process.exitCode=2;
}
