// This small, reviewable patch is applied to the generated/copied 3D avatar
// by both Android Gradle and Cloudflare deployment. The 16 MB embedded GLB
// stays byte-identical; only lip timing code is modified.
import fs from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function patchAvatarLipSync(html){
 let source=String(html||'');
 const originalStop="function stopSpeech(){state.speaking=false;state.targetWeights.set(shapes.X);setStatus('Avatar pregătit · repaus');}";
 const replacedStop=String.raw`function stopSpeech(){
 state.speaking=false;state.wordBoundarySeen=false;state.words=[];state.speechText='';state.wordIndex=0;
 // Close lips immediately at the authoritative TTS completion or stop.
 state.targetWeights.set(shapes.X);state.morphWeights.set(shapes.X);
 for(const m of meshes){
  const dict=m.morphTargetDictionary,weights=m.morphTargetInfluences;
  if(!dict||!weights)continue;
  for(let k=0;k<7;k++){const index=dict[names[k]];if(index!==undefined)weights[index]=state.morphWeights[k]}
 }
 setStatus('Avatar pregătit · repaus');
}`;
 const oldTail=String.raw`   if(idx===words.length-1&&delta>Math.max(180,words[idx].length*70+90)){
      // A missing Android speech boundary should not stop the mouth while TTS is still playing.
      idx=Math.max(0,words.length-3);state.wordIndex=idx;state.wordStart=ms;
   }`;
 const newTail=String.raw`   if(idx===words.length-1&&delta>Math.max(220,words[idx].length*105+110)){
      // Never recycle the last two/three words after speech is exhausted.
      state.targetWeights.set(shapes.X);return;
   }`;
 const oldWord=" const word=words[Math.max(0,Math.min(state.wordIndex,words.length-1))];";
 const guardedWord=String.raw` if(state.wordBoundarySeen&&state.wordIndex>=words.length-1&&
    ms-state.wordStart>Math.max(220,words[words.length-1].length*105+110)){
  state.targetWeights.set(shapes.X);return;
 }
 const word=words[Math.max(0,Math.min(state.wordIndex,words.length-1))];`;
 const rules=[[originalStop,replacedStop],[oldTail,newTail],[oldWord,guardedWord]];
 const already=source.includes(replacedStop)&&source.includes(newTail)&&source.includes(guardedWord);
 if(already)return source;
 for(const [before,after] of rules){
  if(source.split(before).length!==2)throw Error('Unexpected avatar lip-sync source. Review patch before deploy.');
  source=source.replace(before,after);
 }
 return source;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const file=process.argv[2];
 if(!file)throw Error('Usage: node scripts/patch-avatar-lipsync.mjs <generated avatar file>');
 const input=fs.readFileSync(file,'utf8');
 const output=patchAvatarLipSync(input);
 if(output!==input)fs.writeFileSync(file,output,'utf8');
 console.info('Avatar lipsync: TTS-stop closure and no final-word replay are active');
}
