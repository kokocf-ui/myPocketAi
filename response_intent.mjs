// Context-sensitive request routing for news. Classifies the user's goal,
// not the appearance of the eventual model answer. Does not invent evidence.
const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
export function classifyNewsRequest(message) {
  const text = normalize(message);
  if (!text) return {mode:"none", reason:"empty"};
  const subject = /\b(?:news|headlines|breaking|geopolitic\w*|politic\w*|conflict\w*|war|wars|razbo\w*|stiri|actualitat\w*|noutat\w*|diplomac\w*|international\w*|iran|ucraina|ukraine|israel|nato|sanctiun\w*|sanction\w*|recent events|latest developments)\b/.test(text);
  const current = /\b(?:ultim\w*|recent\w*|azi|astazi|ieri|today|yesterday|latest|current|breaking|last|past|acum|in prezent|24 de ore|24 hours|saptaman\w*|week)\b/.test(text);
  const happening = /\b(?:ce s.a intamplat|ce se intampla|what happened|what is happening|what's happening)\b/.test(text);
  const evidenceRequest = /\b(?:surse|sources|articole|articles|titluri|headlines|stiri|news|noutati|actualitati|evenimente geopolitice)\b/.test(text);
  const briefing = /\b(?:rezum\w*|sumar\w*|sintez\w*|briefing|summary|summari\w*|pe scurt|in cateva cuvinte|short overview|tldr)\b/.test(text);
  // Source-check requests are analytical verification, not headline collections.
  const verification = /\\b(?:verific\\w*|confirm\\w*|corobor\\w*|fact.check\\w*|verify|verification|corroborat\\w*|independent sources|surse independente)\\b/.test(text);
  const analysis = /\b(?:analiz\w*|analyse|analyze|analysis|explic\w*|explain|de ce|why|cauz\w*|cause\w*|consecint\w*|implicati\w*|impact|compar\w*|compare|perspectiv\w*|predict\w*|what if|cum influenteaza|how does)\b/.test(text);
  // Retrospective world/national happenings are news, not calendar programmes.
  // Keep concerts, performances and local schedules on the event-discovery path.
  const retrospectiveNewsEvents =
    /\b(?:eveniment\w*|events?|developments?)\b/.test(text) &&
    /\b(?:ieri|alaltaieri|azi|astazi|yesterday|today|last week|saptamana trecuta|ultimele\s+(?:zile|24\s+de\s+ore))\b/.test(text) &&
    /\b(?:lume|mondial\w*|glob\w*|international\w*|world|worldwide|romania|europa|europe)\b/.test(text) &&
    !/\b(?:concert\w*|festival\w*|spectacol\w*|teatru|theatre|theater|tickets?|bilete|programul)\b/.test(text);
  const asksNews = retrospectiveNewsEvents || evidenceRequest || (subject && (current || happening)) || (happening && current);
  if (!subject && !asksNews) return {mode:"none",reason:"not_current_affairs"};
  // Explicit answer-style requests take precedence over article collection.
  if (verification && subject) return {mode:"analysis",reason:"verification_requested"};
  if (analysis) return {mode:"analysis",reason:"explanation_requested"};
  if (briefing) return {mode:"briefing",reason:"summary_requested"};
  if (asksNews || (subject && /\b(?:ce s.a intamplat|ce se intampla|what happened)\b/.test(text)))
    return {mode:"article_collection",reason:"current_reporting_requested"};
  return {mode:"none",reason:"topic_without_news_request"};
}
