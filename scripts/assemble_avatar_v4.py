from pathlib import Path
import hashlib

ROOT=Path(__file__).resolve().parent.parent
folder=ROOT/'avatar-v4-upload'
parts=sorted(folder.glob('part-*.txt'))
assert len(parts)==29, f'Expected 29 parts, found {len(parts)}'
assert [p.name for p in parts]==[f'part-{i:03d}.txt' for i in range(29)]
source=(folder/'prefix.txt').read_text(encoding='utf-8') + ''.join(p.read_text(encoding='utf-8') for p in parts) + (folder/'suffix.txt').read_text(encoding='utf-8')
expected='681079abc57799ef0d6fa47cb1a6bb30c024db6102c1f080432d4528807eb58b'
assert hashlib.sha256(source.encode()).hexdigest()==expected, 'Original approved v4 source checksum mismatch'
s=source
def replace_once(before,after):
 global s
 assert s.count(before)==1, f'Expected a single patch anchor: {before[:75]}'
 s=s.replace(before,after,1)
replace_once("state.ready=true;window.PocketAvatarAPI={start:startSpeech,stop:stopSpeech,boundary:setWordBoundary,ready:true};", """state.ready=true;window.PocketAvatarAPI={start:startSpeech,stop:stopSpeech,boundary:setWordBoundary,ready:true};
  if(window.parent!==window){requestAnimationFrame(()=>window.parent.postMessage({channel:'pocket-avatar-v4',action:'ready'},location.origin));}""")
replace_once("if(!state.wordBoundarySeen){", "if(!state.wordBoundarySeen||delta>Math.max(180,words[idx].length*70+90)){")
replace_once("document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech()}});", """document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech()}});
window.addEventListener('message',(event)=>{
 if(window.parent===window||event.source!==window.parent||event.origin!==location.origin)return;
 const msg=event.data;if(!msg||msg.channel!=='pocket-avatar-v4')return;
 if(msg.action==='start'){if(state.ready)startSpeech(msg.text);return}
 if(msg.action==='boundary'){setWordBoundary(msg.charIndex);return}
 if(msg.action==='stop'){stopSpeech();return}
 if(msg.action==='pause'){state.stopped=true;cancelAnimationFrame(state.animationId);stopSpeech();return}
 if(msg.action==='resume'&&state.stopped){state.stopped=false;state.lastMs=performance.now();resize();requestAnimationFrame(renderFrame);return}
});""")
replace_once("}catch(e){state.error=String(e?.message||e);setStatus('Eroare 3D: '+state.error);console.error('Pocket AI avatar',e)}", """}catch(e){state.error=String(e?.message||e);setStatus('Eroare 3D: '+state.error);console.error('Pocket AI avatar',e);
  if(window.parent!==window)window.parent.postMessage({channel:'pocket-avatar-v4',action:'error',message:state.error.slice(0,140)},location.origin)}""")
dest=ROOT/'public'/'avatar-v4.html'
dest.write_text(s,encoding='utf-8')
assert hashlib.sha256(dest.read_bytes()).hexdigest()=='37b032b9ec77ff0a8b27d00c321c733684283eac522ccb3a89a3844f12c34d39', 'Production HTML checksum mismatch'
print('Assembled and verified approved Pocket AI avatar v4:',dest.stat().st_size,'bytes')
