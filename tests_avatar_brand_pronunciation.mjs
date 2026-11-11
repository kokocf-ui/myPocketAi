import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java',import.meta.url),'utf8');
for(const marker of ['BRAND_UTTERANCE_ID','END_UTTERANCE_ID','speakEnglishBrand()','speakGreetingAfterBrand()','speech.setLanguage(Locale.UK)','speech.speak("my Pocket A I"']){
 assert.ok(java.includes(marker),'Missing English-brand TTS step: '+marker);
}
assert.match(java,/speech\.setLanguage\(Locale\.forLanguageTag\(speechTagForLanguage\(launchLanguage\)\)\)/,'Restore native greeting locale');
console.log('PASS Android launch TTS switches to English for the brand and restores app locale');