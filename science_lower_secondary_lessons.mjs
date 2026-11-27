import {readNodeEducationSharedPack} from './education_study_node_source.mjs';
const physics=readNodeEducationSharedPack('physics');
const chemistry=readNodeEducationSharedPack('chemistry');
const biology=readNodeEducationSharedPack('biology');
const astronomy=readNodeEducationSharedPack('astronomy');
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
