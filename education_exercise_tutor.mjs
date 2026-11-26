// One teaching contract for exercise workspaces, not for full study lessons.
// Also serialized into the browser; keep the instruction function closed.
export function educationExerciseInstruction(activity='solve'){
 const mode=activity==='review'?'correction':activity==='explain'?'method':activity;
 if(!['solve','method','correction'].includes(mode))return '';
 const common='EXERCISE-ANCHORED TEACHING. Explain the supplied exercise itself, not a general lesson about its topic. Use the learner’s requested language and grade. Start by briefly stating what THIS question gives and asks. Then explain why the chosen method fits THESE data or this exact text/code. Limit introductory theory to one or two useful sentences; explain a rule just before applying it. Spend most of the answer on the actual working. Use readable numbered teaching steps: in each step show (a) the actual operation or evidence from the question, (b) WHY it is valid here in simple words, and (c) the resulting expression, value, inference or code state. Do not replace these with headings such as “apply the formula” or “calculate” without doing it. Show substitutions before arithmetic, unit conversions, sign changes, intermediate expressions and relevant conditions; introduce unfamiliar symbols where they occur. For a short problem use only the steps it needs, but do not collapse the whole solution into one line. For several exercises, give each its own method, worked steps and check, not shared theory followed by bare answers. End with a clearly identified answer and a concrete check using the original data or task, not just “check the result”. Include at most one likely mistake, tied to an actual step. Do not add a second invented exercise, unrelated definitions, a history of the topic or motivational filler. If necessary data or the text/diagram are missing, identify exactly what is missing and explain what can be established; do not fabricate values, passages, student work or a verdict. Reference answers may themselves be wrong: verify rather than blindly repeat them. These are student-facing teaching steps, not a request for hidden internal deliberation. ';
 const focus=mode==='method'?
  'METHOD ON THIS EXERCISE: teach how to start and WHY, then demonstrate the method on the supplied numbers, symbols, passage or code through to the answer. A generic recipe with no application is not sufficient. Do not prohibit calculations on the learner’s exercise. ':mode==='correction'?
  'CORRECTION: first give a supported Correct / Partly correct / Incorrect / Indeterminate verdict. Refer to the learner’s actual answer. Locate the first incorrect or missing step, explain precisely why it fails here, and rebuild the working from that point; if only a final answer was supplied, say that its working is unknown rather than inventing a mistake. If the answer is correct, explain the valid steps without inventing an error. Do not merely display the answer key or award an official grade. ':
  'WORKED SOLUTION: solve the exact question in small meaningful steps; make the transition from one expression or statement to the next explicit, instead of hiding several operations under “therefore”. ';
 return common+focus+'Subject adaptation: for mathematics use the original expressions and valid transformations; for sciences use the actual quantities, units, model and assumptions; for programming trace the given input and variables, explain the changed code and edge cases without claiming execution; for history, geography and literature use the supplied source, map data or precise wording as evidence, explaining how it supports each conclusion without inventing quotations or observations.';
}

// Structural warning only, NOT a mathematical, factual or pedagogical certificate.
export function educationExerciseNeedsExpansion(reply,activity){
 if(!['solve','method','correction','review','explain'].includes(activity))return false;
 const text=String(reply||'').trim();
 if(!text)return false;
 // A legitimate clarification must not be expanded into an invented solution.
 if(/(?:(?:lipsește|lipsesc) (?:date|informații|textul|figura)|nu (?:sunt|avem) suficiente (?:date|informații)|enunț(?:ul)? (?:este )?incomplet|missing (?:data|information|diagram|text)|not enough (?:data|information)|insufficient (?:data|information))/i.test(text))return false;
 const steps=text.match(/(?:^|\n)\s*(?:(?:pas(?:ul)?|step)\s*)?\d+[.)\s:–-]+/gim)||[];
 return text.length<180||(text.length>900&&steps.length<2);
}

// At most one pedagogical expansion. Keep a useful first answer if the second
// call fails; never recursively retry or claim this validates correctness.
export async function educationTutorResponse(generate,options,{activity='lesson'}={}){
 const first=await generate(options);
 const draft=String(first?.response||first?.result?.response||'').trim();
 if(!educationExerciseNeedsExpansion(draft,activity))return first;
 try{
  const expanded=await generate({...options,max_tokens:Math.min(3400,Math.max(2800,Number(options.max_tokens)||0)),
   messages:[...(options.messages||[]),{role:'assistant',content:draft},{role:'user',content:'Rewrite your answer in the same requested language, anchored to the ORIGINAL exercise above. The draft is too terse or lacks explicit worked steps. Keep any correct result, but verify it. Remove general theory not used in the exercise. Explain each operation/evidence, why it applies here and its intermediate result; finish with a concrete check. Use numbered teaching steps. If the task is underspecified, state exactly what is missing instead of inventing data. Do not mention this editorial request.'}]});
  const reply=String(expanded?.response||expanded?.result?.response||'').trim();
  if(reply&&!educationExerciseNeedsExpansion(reply,activity))return expanded;
 }catch{/* The original explanation is still available; no unbounded retry. */}
 return first;
}
export const EDUCATION_EXERCISE_TUTOR_SCRIPT='var educationExerciseInstruction='+educationExerciseInstruction.toString()+';';
