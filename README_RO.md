# myPocket AI frontend v1.0.64
Bază: v1.0.63. Înlocuiește integral `index.js` în Cloudflare Worker frontend.

Corecții:
- Un singur contract de dimensionare pentru ferestrele Selecții rapide din Hărți și Călătorii. Poziția este calculată din marginea reală de jos a antetului și marginea reală de sus a barei fixe.
- Lista rezultatelor utilizează înălțimea rămasă și are derulare internă.
- Extindere universală a normalizării categoriilor primite în română de la backend; denumirile proprii ale firmelor rămân nemodificate.
- Text localizat pentru distanță indisponibilă și format numeric conform celor 10 limbi.
- Selectorul de limbi, cardurile Instrumente, GPS și cererile de căutare rămân pe mecanismul v1.0.63.

Limitări:
- Audit static, fără verificare vizuală Android. Nu s-a demonstrat că TOATE textele dinamice ale aplicației sunt traduse. Backend v98 poate trimite texte libere în română.
- Modificările nu includ backendul și nu garantează rezultate de la furnizorii externi.
