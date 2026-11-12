import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java',import.meta.url),'utf8');
assert.ok(java.includes('speech.setLanguage(Locale.forLanguageTag(speechTagForLanguage(launchLanguage)))'), 'Set native intro voice');
assert.ok(java.includes('currentGreeting.replace("myPocket AI", "mai pocăt ei ai")'), 'Romanian phonetic brand within one spoken utterance');
assert.ok(java.includes('speech.speak(spokenGreeting, TextToSpeech.QUEUE_FLUSH, null, UTTERANCE_ID)'), 'Single continuous greeting');
assert.ok(!java.includes('speakEnglishBrand()') && !java.includes('speakGreetingAfterBrand()'), 'No mid-sentence locale switches');
assert.ok(!java.includes('speech.setLanguage(Locale.US)') && !java.includes('speech.setLanguage(Locale.UK)'), 'No forced English TTS voice mid-greeting');
console.log('PASS native avatar greeting uses one voice and one continuous utterance');
