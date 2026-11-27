import {readPracticalNodePack} from './practical_course_node_source.mjs';
export const PRACTICAL_SYLLABI=["finance","trades","business","digital","career","daily"].map(id=>readPracticalNodePack(id)?.syllabus).filter(Boolean);
export function practicalSyllabus(id){return PRACTICAL_SYLLABI.find(x=>x.id===id)||null}
