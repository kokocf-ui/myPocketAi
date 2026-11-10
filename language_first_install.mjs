// First-install language selection. The phone's geographical country is
// preferred when available (existing permission/GPS or a network-country
// estimate); the user's explicit language choice always wins.
// Language labels are restricted to the translations actually shipped in UI_TEXT.
export const POCKET_LANGUAGES=Object.freeze(["ro","en","fr","de","it","es","pt","nl","ru","pl","hr","sr","hu","tr","cs","sk","sl","bg","el","fi","sv","no","da","is","et","lv","lt","uk","bs","mk","sq","be","ca","ga","cy","mt"]);
export const POCKET_COUNTRY_LANGUAGES=Object.freeze({
 RO:'ro',MD:'ro',GB:'en',UK:'en',IE:'en',US:'en',CA:'en',AU:'en',NZ:'en',ZA:'en',IN:'en',
 FR:'fr',MC:'fr',DE:'de',AT:'de',LI:'de',IT:'it',SM:'it',VA:'it',
 ES:'es',MX:'es',AR:'es',CL:'es',CO:'es',PE:'es',UY:'es',EC:'es',VE:'es',BO:'es',PY:'es',
 PT:'pt',BR:'pt',AO:'pt',MZ:'pt',NL:'nl',BE:'nl',RU:'ru',PL:'pl',
 HR:'hr',RS:'sr',ME:'sr',HU:'hu',TR:'tr',CZ:'cs',SK:'sk',SI:'sl',BG:'bg',GR:'el',CY:'el',
 FI:'fi',SE:'sv',NO:'no',DK:'da',IS:'is',EE:'et',LV:'lv',LT:'lt',UA:'uk',
 BA:'bs',MK:'mk',AL:'sq',XK:'sq',BY:'be',AD:'ca',MT:'mt',
 LU:'fr',CH:'de'
});
export function pocketLanguageFromLocale(locale){
 const text=String(locale||'').replace('_','-').trim();
 const parts=text.split('-');
 const region=parts.slice(1).find(p=>/^[A-Za-z]{2}$/.test(p))?.toUpperCase()||'';
 const fromRegion=POCKET_COUNTRY_LANGUAGES[region];
 if(fromRegion)return fromRegion;
 const language=parts[0].toLowerCase();
 return POCKET_LANGUAGES.includes(language)?language:'en';
}
export function pocketLanguageFromCountry(country,locale=''){
 const code=String(country||'').toUpperCase().trim();
 if(POCKET_COUNTRY_LANGUAGES[code])return POCKET_COUNTRY_LANGUAGES[code];
 // In a country without a supported native language, prefer the device's
 // preferred supported language, otherwise show English instead of Romanian.
 return pocketLanguageFromLocale(locale);
}
export function pocketPreferredLanguage(saved,deviceLocale,available=POCKET_LANGUAGES){
 const lang=String(saved||'').toLowerCase();
 if(available.includes(lang))return {language:lang,allowAutomaticDetection:false};
 const fallback=pocketLanguageFromLocale(deviceLocale);
 return {language:available.includes(fallback)?fallback:available.includes('en')?'en':available[0]||'ro',
  allowAutomaticDetection:true};
}
