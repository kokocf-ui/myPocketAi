# Literatură — extindere pe țări și cititor paginat
Data: 2026-11-12

## Starea verificată
- Structura de școală, țară, clasă, profil și regiune există deja, dar nu reprezintă integral programa legală.
- Bibliotecă locală cu autori/opere documentate pentru MD, PL, HR, RS, HU, AT și TR, plus autori RO.
- Căutarea după **titlu complet** trebuie să selecteze o singură operă (când există un singur autor/titlu canonic confirmat), fără rezultate de critică, manuale sau ediții duplicate. Căutarea după **numele autorului** rămâne o listă a operelor sale.
- Open Library reprezintă un index de descoperire la nivel de WORK/EDITION; nu demonstrează singur obligativitatea școlară, textul complet sau drepturile de reproducere.
- Cititorul literar și teoria literaturii sunt paginate cu navigare **sus și jos**, păstrând textul original integral pentru salvare PDF/imprimare.
- Cuprins și text integral doar pentru secțiuni documentate cu text prezent și rightsVerified=true + licență + sursă. Pentru operele fără drepturi/ediție verificată, se oferă fișa bibliografică, nu capitole fabricate.

## Cum extindem în mod repetabil

### A. Sursă curriculară națională
Pentru fiecare țară/jurisdicție (inclusiv provincii, cantoane, curriculum boards și limbi de predare):
1. Minister/autoritate școlară, normă, versiune și perioadă de aplicare/cohortă.
2. Clase/niveluri și filiere realiste; separarea limbii de predare de limba UI.
3. Temele/competențele confirmate, cu status separat de traseul orientativ și de bibliografia recomandată.
4. Test pentru țara × clasă × filieră, revenire și traducere în limba utilizatorului.

### B. Bibliotecă literară și disponibilitatea textului
Pentru fiecare autor: ISO țară, nume original, variante/transliterare, sursă de referință; pentru fiecare operă: titlu exact, autor, an când verificabil, tip (roman, dramă, poezie, antologie), ediție/sursă.
- Început practic: 10–20 opere reprezentative per țară în catalog local; o listă orientativă, **nu** „lecturi obligatorii” fără dovadă.
- Căutarea generală consultă catalogul local întâi; doar lipsa unui rezultat confirmat folosește Open Library.
- Grupare după *work*, nu după fiecare critică, traducere, studiu sau ediție. Căutarea titlului exact are prioritate absolută.
- Manuscrisele, poemele, traducerile și edițiile pot avea drepturi diferite. Verificare pe jurisdicție, text, traducere și ediție înainte de a le afișa integral.
- Doar după validare se adaugă sections: capitol/strofă + text + sourceUrl + license + rightsVerified. La lipsa textului, nu se inventează cuprinsul.

### C. Ordinea extinderii
1. Continuăm restul țărilor europene cu programe oficiale documentabile, grupate după limba de predare și structura sistemului: de exemplu Franța, Germania (landuri), Italia, Spania (comunități), Portugalia, țările nordice, Benelux și restul Europei.
2. Apoi extindem sursele curriculare și bibliografice pe continente și regiuni, folosind infrastructura Worldwide Education. Nu confundăm nivelele UNESCO ISCED cu programa obligatorie națională.
3. Fiecare nouă țară trece testele automate, CI și apoi verificarea practică finală pe APK, fără a cere testări repetate utilizatorului după fiecare mică schimbare.

## Contract UI
- Un singur ecran: Țară → Clasă/Filieră → Literatura → Autor/Operă.
- Titlu complet unic: fișa **unei singure opere**, cu Studiază, Rezumat, Eseu, Analiză pe text și, numai când există drepturi, Cuprins/Lectură.
- Autor complet: bibliografia autorului, în pagini/liste compacte; fără critici din autori terți.
- Material lung: pagini naturale, comenzi identice sus și jos; înapoi nu iese din modul.
- PDF/Imprimă exportă lucrarea **completă**, nu pagina afișată.
- Pentru o bibliotecă încă nepopulată, mesaj clar + căutare internațională, fără a promite disponibilitatea textului integral.

## Performanță și cost
- Bibliografia de țară locală apare imediat; nu există apel AI pentru titlu exact documentat.
- La fallback extern se folosesc doar metadate work-level, fără redeschiderea unei căutări după recenzii.
- Fără API plătit sau servicii externe noi fără acord. Dacă în etapa următoare se adaugă cache, se măsoară separat timpul de catalog, rețea, AI și randare; nu prezentăm îmbunătățiri nemăsurate drept rezultate.
