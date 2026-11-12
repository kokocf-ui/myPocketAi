import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const native=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java',import.meta.url),'utf8');
const bridge=readFileSync(new URL('./android/app/src/main/assets/avatar-enter.js',import.meta.url),'utf8');
assert.match(native,/onBeginSynthesis\(String utteranceId, int sampleRateInHz, int audioFormat, int channelCount\)/,
 'Lip synchronization begins during synthesis, before late audio playback callback');
assert.match(native,/avatarLipSyncStarted = true/,'Only one avatar start per greeting');
assert.match(native,/runOnUiThread\(AvatarLaunchActivity\.this::startAvatarLipSyncOnce\)/,
 'Synthesis and onStart use same guarded UI bridge');
assert.match(native,/onRangeStart\(String utteranceId, int start, int end, int frame\)/);
assert.match(native,/window\.pocketLaunchBoundary/);
assert.match(native,/JSONObject\.quote\(spokenGreeting\)/);
assert.match(native,/speech\.speak\(spokenGreeting, TextToSpeech\.QUEUE_FLUSH/);
assert.match(bridge,/window\.pocketLaunchBoundary=\(charIndex\)/);
assert.match(bridge,/PocketAvatarAPI\?\.boundary\?\.\(charIndex\)/);
assert.match(native,/speech\.isSpeaking\(\)/,'Monitor actual TTS playback instead of guessing duration');
assert.match(native,/silentPlaybackChecks >= 2/,'Verify stopped playback before closing');
assert.match(native,/handler\.removeCallbacks\(playbackWatchdog\)/,'Stop watchdog when greeting completes');
assert.match(native,/if\(finishingLaunch \|\| greetingFinished\)return;/,'Stop command is idempotent');
assert.match(native,/if \(!greetingFinished && !finishingLaunch\)/,'Late word boundaries cannot reopen mouth');
console.log('PASS Android intro TTS word boundaries feed avatar matching spoken text');
