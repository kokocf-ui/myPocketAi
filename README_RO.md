# Pocket AI — update pereche
Frontend v1.0.67 din v1.0.66; backend v100 din v99.

Modificări: sursele OSM/Geoapify/Photon transmit identificatori Wikidata dacă există; la deschiderea detaliilor frontendul cere fotografii oficial asociate identificatorilor Wikidata, folosind Wikimedia Commons. Nu se caută după nume, pentru a evita poze ale altor firme. Site-urile HTTPS se deschid într-o fereastră internă cu închidere și link de deschidere externă. Unele site-uri blochează iframe; folosiți linkul extern.

LIMITĂRI: Identificatorii Wikidata lipsesc pentru multe locații; fotografiile nu pot fi garantate. Nu există prețuri hotel live fără furnizor de rezervări. Nu s-a testat vizual Android și nici live API. Tabelele de rezultate și traducerile existente nu au fost modificate.

Instalare: înlocuiți integral fișierul frontend și backend în Worker-ele corespunzătoare. Mai întâi backend, apoi frontend.
