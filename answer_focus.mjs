// Model response length follows the *requested answer*, not earlier verbose turns.
// This is only the general-assistant text path; recipes, events and transport
// retain their specialized contracts and token budgets.
const normalized = value => String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
export function planAnswerFocus(message,options={}){
 const text=normalized(message);
 const standard={mode:"standard",max_tokens:768};
 if(!text||options.recipeInstruction||options.eventResearchIntent)return standard;
 const detailed=/\b(?:detaliaz\w*|detaliat\w*|pe larg|pas cu pas|in profunzime|explica in detaliu|analiz\w*|exhaustiv\w*|elaboreaz\w*|write (?:a |an )?(?:detailed|long)|in depth|step by step|comprehensive|compare\w*|compar\w*|argumenteaza|argument\w*|fa (?:o |un )?(?:lista|tabel)|list\w*|enumera\w*|intreg\w*|complet\w*|multiple examples)\b/.test(text);
 const complex=/\b(?:medical|medicin\w*|simptom\w*|tratament\w*|health|medication|diagnos\w*|surgery|juridic\w*|legal|drept\w*|statut\w*|reglement\w*|lege\w*|law|conflict\w*|razboi|war|politic\w*|geopolitic\w*|international\w*|eveniment\w*|stiri\w*|news|calculeaza\w*|calcule\w*|calcul\w*|program\w*|cod\b|code\b|retet\w*|recipe\w*)\b/.test(text);
 if(detailed||complex||text.length>150)return standard;
 if(options.dialogueOnly)return {mode:"light_conversation",max_tokens:200};
 // A follow-up inherits subject from history, but should not repeat old paragraphs.
 if(options.contextApplied && text.length<=100 && !/\b(?:mai multe|more (?:details|information)|examples|exemple)\b/.test(text))
  return {mode:"focused_followup",max_tokens:255};
 // General one-fact questions deserve one concise answer, not an encyclopedia page.
 const simple=/^(?:care (?:este|e|a fost)|cat (?:este|e|ar|costa)|cati|cate|cine (?:este|e|a fost)|unde (?:este|e)|cand (?:este|a fost)|what (?:is|was)|who (?:is|was)|where (?:is|was)|when (?:is|was)|how much|how many)\b/.test(text);
 if(simple&&text.length<=100)return {mode:"focused_fact",max_tokens:400};
 return standard;
}
