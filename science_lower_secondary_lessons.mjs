import physics from './public/education/science/shared-v2/physics.json' with {type:'json'};
import chemistry from './public/education/science/shared-v2/chemistry.json' with {type:'json'};
import biology from './public/education/science/shared-v2/biology.json' with {type:'json'};
import astronomy from './public/education/science/shared-v2/astronomy.json' with {type:'json'};
// Node/build compatibility; the browser loads only the selected subject.
export const SCIENCE_LOWER_TOPIC_LESSONS=Object.freeze(Object.fromEntries(
 [physics,chemistry,biology,astronomy].map(pack=>[pack.subject,pack.topics])
));
export function scienceLowerTopicContent(subject,topic,language='ro'){
 const notes=SCIENCE_LOWER_TOPIC_LESSONS[subject]?.[topic];
 if(!notes)return null;
 // Always return authored source, including when the UI is English.
 const localized=notes.content;
 return {title:localized[0],explanation:localized[1],workedExample:localized[2],
  exercise:localized[3],answer:localized[4],source:'original-advisory',sourceLanguage:notes.sourceLanguage};
}
