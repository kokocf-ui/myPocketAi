// Shared depth contract for teacher-generated material. Does not alter general chat.
const subjectGuides=Object.freeze({
 foreign_language:'Teach actual material in the TARGET language, not a speech about why learning matters. Provide at least 8 accurate target-language words or useful sentences, with Romanian or selected-UI-language translations, context and reliable pronunciation notation only where confident. Give phonetic contrasts or syllabification when relevant, a short original dialogue, five graded practice prompts and an answer key with explanations. For listening exercises provide readable audio SCRIPT that the device can speak; never claim audio was played or score spoken phonemes from STT. Keep UK/US, historic/modern scripts and variants distinct. Avoid repeating the lesson title as content.',
 math:'State definitions and valid conditions, explain the reason for each formula, solve at least two distinct worked numerical or symbolic examples with intermediate transformations and verification, then give four progressively harder practice problems and answers. Never invent measurements. Do not skip steps or state a result without deriving it.',
 physics:'Explain the law, physical model, symbol meanings and SI units. Derive or justify the relation where suitable, solve two concrete examples showing unit conversions and checks, discuss assumptions and common misconceptions, then give practice questions with worked answers.',
 chemistry:'Define the chemical terms and explain mechanisms or bonding using accurate species and conditions. Include balanced equations when relevant, explain conservation of atoms and charge, give concrete worked examples and multiple practice questions with reasoning. Do not fabricate lab observations or dangerous experimental instructions.',
 biology:'Explain the named structure or process and its biological function and mechanisms, using correct terminology, a concrete organism or system example, a comparison where appropriate, frequent misconceptions, and practice questions with explained answers. No invented clinical facts or diagnosis.',
 astronomy:'Explain the astronomical object or process, distinguish observation from inference, use meaningful units and physical examples, demonstrate calculations when relevant, note observational limitations and provide practice questions with explained answers.',
 history:'Teach named events and actors with dates and chronology when supported, geographic and political context, several important causes and consequences, different interpretations where relevant, and a concrete primary-versus-secondary evidence example. Never fabricate historical quotations or exact dates.',
 geography:'Describe the actual named region and the relevant relief, climate, waters, settlements, economic and human patterns. Use concrete place examples and meaningful comparisons, explain processes and uncertainty, and give practice questions with explained answers. Do not invent current statistics or maps.',
 language_literature:'Teach the requested linguistic rule or named literary work with precise examples, text-grounded interpretation, devices and their effects where relevant, multiple substantive examples and practice questions. Never invent passages, author attributions or quotations.',
 school_admission:'Teach named school subject and required grade-level concepts using concrete worked examples, varied practice problems and correct methods, and explicit reasoning. Never invent a schools admission policy or official syllabus.',
 computing:'Teach the actual programming or computing concept, show small complete correct examples and explain each operation, include realistic input/output and common errors, plus graded exercises and solutions. Never claim code was executed unless verified.',
 practical:'Teach the selected skill through a concrete, safe, lawful step-by-step example, tools or prerequisites, common errors, safety checks and verification, with applied exercises. Never invent regulatory requirements or provide dangerous professional procedures.',
 general:'Explain the exact selected concept in depth with precise definitions, at least two relevant examples, a demonstration or case study, common mistakes, practice questions and answers. Distinguish established facts from assumptions.'
});
const lessonActivities=new Set(['lesson','study','explanation','method','solve','examples','analysis','review','practice','conversation','assessment','test','exercises','correction','essay','summary','write']);
export function educationDepthInstruction(subject,activity='lesson'){
 const kind=subjectGuides[subject]?subject:'general';
 const mode=lessonActivities.has(activity)?activity:'lesson';
 const core='This is a real teaching task, not a generic chatbot answer. Respect the requested country, class, topic and difficulty; do not invent verified curricula, sources or facts. Write in the requested EXPLANATION language and preserve the subject original language for examples. Use clear headings, normal paragraphs and readable numbered steps rather than raw Markdown ** or ##. Start with the subject-specific content immediately; remove motivational filler, repetitive introductions and vague definitions. Be accurate rather than verbose; if information cannot be verified, explicitly say so. ';
 if(['test','assessment','exercises'].includes(mode))return core+'Give varied, specific, well-defined tasks in the selected subject with appropriate difficulty. Do NOT reveal answers or an answer key until the learner asks for correction.';
 if(mode==='correction')return core+'Correct the actual supplied answers against the original question, point out exact errors and show the valid method; do not invent absent student work.';
 if(mode==='conversation')return core+'Be interactive and ask ONE short question per turn, then correct a learner reply and continue. Do not generate a long textbook chapter during chat.';
 if(mode==='solve'||mode==='method')return core+'Solve only the actual exercise; show intermediate steps, mathematical or logical validity checks and a concise final conclusion. Do not add unrelated exercises or introduce imagined numbers.';
 if(mode==='essay'||mode==='summary'||mode==='write')return core+'Fulfil the requested document length and structure without padding or invented passages or citations. '+(kind==='language_literature'?'Ground literary claims in supplied text; never fabricate quotations.':'Use correct subject terminology and meaningful evidence.');
 return core+'Create a COMPLETE study lesson with subject-specific concepts, examples and applied practice, not merely an introduction or a few objectives. '+subjectGuides[kind];
}
export function educationDepthAudit(reply,subject,activity='lesson'){
 const text=String(reply||'').trim();
 const chars=text.length;
 const repeating=/^(.{90,}?)\n\s*\1\n\s*\1/m.test(text);
 const substantive=activity!=='lesson'||chars>=700;
 return {sufficient:substantive&&!repeating,characters:chars,
  reason:!substantive?'too_short':repeating?'repeated_content':null,
  subject:subjectGuides[subject]?subject:'general'};
}
