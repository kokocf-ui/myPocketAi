import {readPracticalNodePack} from './practical_course_node_source.mjs';
export const PRACTICAL_GUIDES=Object.assign({},...["finance","trades","business","digital","career","daily"].map(id=>readPracticalNodePack(id)?.guides||{}));
export function practicalGuide(chapterId){return PRACTICAL_GUIDES[chapterId]||null}
