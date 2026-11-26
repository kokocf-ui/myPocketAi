import {readPracticalNodePack} from './practical_course_node_source.mjs';
export const PRACTICAL_DEPTH=Object.fromEntries(["career-1","career-2","career-3","career-4","career-5","career-6","finance-1","finance-2","finance-3","finance-4","finance-5","finance-6"].flatMap(key=>{const data=readPracticalNodePack(key.split("-")[0])?.depth?.[key];return data?[[key,data]]:[]}));
