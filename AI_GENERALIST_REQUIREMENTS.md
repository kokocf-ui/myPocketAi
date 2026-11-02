# Pocket AI — Reguli obligatorii pentru asistentul AI generalist

Data cerinței: 2026-11-02. Stare: specificație aprobată pentru următoarea actualizare; nu reprezintă o funcționalitate implementată.

## Principiu general
Pocket AI trebuie să poată înțelege, cerceta și răspunde la cereri factuale din orice domeniu, fără ca utilizatorul să fie obligat să selecteze o categorie sau să folosească un anumit cuvânt-cheie. Categoriile și „Selecții rapide” sunt scurtături UI, nu restricții de cunoaștere.

Cererile trebuie rezolvate în secțiunea activă, fără transfer automat între ecrane. Asistentul alege singur în fundal căutarea sau instrumentul potrivit. Pentru întrebări obișnuite, explicații, creativitate sau conversație, nu forțează căutarea web inutilă. Pentru fapte recente, programe, evenimente, reglementări și alte informații care se schimbă, caută și verifică sursele, dacă acestea sunt disponibile. Nu inventează rezultate când căutarea eșuează.

## Legislație: regulă globală pentru toate țările
Suportul pentru legislație se aplică tuturor țărilor și jurisdicțiilor, fără listă restrictivă de țări prestabilite. Include, fără limitare, dreptul muncii, circulație, taxe, imigrație, drepturi și obligații, drept civil/comercial/penal, protecția consumatorului și norme administrative.

- Identifică țara indicată de utilizator și, dacă este necesar, statul/regiunea/provincia, nivelul federal/local și data la care se aplică întrebarea. Nu deduce jurisdicția din limba interfeței, naționalitatea presupusă ori răspunsurile anterioare.
- Dacă jurisdicția lipsește și schimbă substanțial răspunsul, pune o singură întrebare de clarificare; altfel menționează explicit presupunerea.
- Prioritizează surse oficiale actuale: portaluri legislative, gazete/monitoare oficiale, instanțe, ministere, autorități de reglementare. Verifică articolul, numărul actului, data publicării, intrării în vigoare, modificării ori abrogării dacă sunt relevante.
- Distinge între legislația în vigoare, proiecte legislative, reguli istorice, interpretări, practici de aplicare și sancțiuni. Nu inventa cuantumuri, articole, excepții sau termene.
- Oferă explicații inteligibile și surse verificabile/linkuri către texte oficiale; semnalează clar ce nu a putut fi confirmat. Nu prezintă informația generală drept consultanță juridică individuală.

## Domenii generaliste, fără limitare la exemple
- Istorie, cultură, geografie, muzee, obiective, evenimente istorice și patrimoniu.
- Filme: titlu, distribuție, gen, anul apariției, disponibilitatea verificabilă, proiecții locale și ore (dacă sunt disponibile).
- Teatru, concerte, spectacole, festivaluri: oraș, perioadă, loc, program, organizator, preț/bilete și pagina oficială atunci când pot fi confirmate.
- Știință, educație, economie, tehnologie, sport, servicii, produse, sănătate și alte subiecte accesibile legitim. Ajustează rigoarea la riscul domeniului.

## Cerințe de cercetare și prezentare
1. Decide semantic dacă cererea necesită date actuale/căutare externă. Nu condiționa căutarea numai de „?” sau o listă închisă de cuvinte; exemple de interogări fără semn de întrebare: „Caută festivaluri în Oradea”, „Codul muncii în Japonia”, „Filme la cinema în Londra”.
2. Folosește motoarele de căutare existente (Exa, Brave, Tavily unde sunt configurate) și servicii specifice domeniului când există, fără să promită o disponibilitate neverificată.
3. Identifică limba răspunsului separat de țară/locație; datele verificate provin din sursele destinației, în limba adecvată.
4. Pentru rezultate sensibile la timp, afișează data verificării, data desfășurării și fusul orar după caz. Nu prezenta programe trecute ca evenimente viitoare.
5. Afișează concise datele esențiale, linkuri de sursă relevante, și, unde există și este permis, imagini/media verificate. Dacă nu există rezultate sau sursele nu sunt concludente, spune precis acest lucru.
6. Refolosește contextul conversației, dar nu schimba ecranul activ și nu transforma automat o căutare de informații într-o cerere de traseu.

## Probleme observate la auditul din 2026-11-02
- backend.js, în zona ~3090–3095: declanșarea cercetării web depinde de semnul întrebării ori de o listă de termeni; comenzi imperative pentru filme/festivaluri/alte teme pot fi ratate.
- backend.js, în zona ~3096: lista de țări explicit recunoscute pentru filtrare nu este globală; trebuie extinsă strategia internațională, nu doar lista.
- backend.js, în zona ~3231: sursele sunt ținute în metadata și ascunse implicit; pentru legislație și evenimente sursele verificabile trebuie să poată fi accesate clar de utilizator.
- Frontend index.js: auditul a identificat un bug separat al expresiilor regulate insuficient escapate în HTML-ul generat, cu dispariția literei „s” în prezentări și transcriere. Corecția este programată pentru următorul update; nu se modifică acum codul.

## Criterii de acceptare pentru următoarele teste
- „Ce prevede Codul muncii în Japonia despre concediu?” -> determină jurisdicția, găsește surse oficiale și semnalează necunoscutele.
- „Reguli pentru șoferi în Germania” -> caută regulile actuale fără a cere schimbarea modulului.
- „Caută festivaluri în Oradea luna viitoare” -> caută chiar fără semn de întrebare, verifică datele și oferă surse.
- „Filme la cinema în Londra în weekend” -> diferențiază programul actual de informațiile generale despre filme.
- „Povestește-mi istoria Oradei” -> prezentare corectă, lizibilă, fără detalii fabricate.
- Cererile de traseu care afișează deja trei opțiuni trebuie să continue să funcționeze identic după introducerea regulilor de cercetare.

## Limite oneste
„Din orice domeniu” înseamnă domenii legale și informații accesibile în mod legitim, nu promisiunea că orice informație există sau este disponibilă în timp real. Informațiile neverificate se marchează clar, iar aplicația nu inventează acces, orare, acte normative ori prețuri.
