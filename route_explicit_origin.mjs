// A route request with two explicit places must use the given origin rather
// than silently substituting the phone's GPS position.
export function explicitOriginDestinationPair(normalizedText){
 const text=String(normalizedText||'').trim();
 const match=text.match(/(?:\bdin|\bde la|\bfrom)\s+(.+?)\s+(?:pana\s+(?:la|in)|to|la|spre|catre)\s+(.+)$/i);
 return match && match[1]?.trim() && match[2]?.trim() ?match:null;
}