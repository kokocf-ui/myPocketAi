myPocket AI — frontend v1.0.56
Înlocuire: index.js în frontend Worker. Bază: v1.0.55.

Corecții:
- Meniu limbi ordonat alfabetic după denumirea nativă; lista are derulare internă și este încadrată între antet și bara inferioară.
- Italiană: Home -> Casa. Olandeză: Home -> Start. Inclusiv butonul de întoarcere.
- Căutările rapide de locuri trimit intenții canonice în engleză către backend, independent de limba UI; afișajul frontend rămâne în limba aleasă.
- Timeout 25 secunde și mesaj de eroare pentru cereri blocate.

Limitări importante:
- Nu garantează că backend v98 returnează rezultate pentru toate categoriile.
- Backendul primește 'en' pentru căutările rapide de locuri, deci un răspuns textual liber poate fi în engleză; cardurile și etichetele frontend rămân localizate.
- Test de sintaxă JS trecut; test real Android și test backend end-to-end NU au fost efectuate.
