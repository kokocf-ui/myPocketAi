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
- Știri și actualitate politică internațională, națională și locală: evenimente politice, alegeri, declarații, instituții, decizii și analize neutre. Verifică data publicării și data evenimentului, compară mai multe surse credibile, separă afirmațiile politice de faptele confirmate și expune perspective relevante fără partizanat, propagandă sau echivalență falsă.
- Rețete culinare din bucătăriile tuturor țărilor: descriere, numărul de porții, ingrediente cu unități și cantități, timp de pregătire, timp de gătire, temperaturi în °C/°F când sunt relevante, ustensile esențiale, instrucțiuni clare, cronologice și verificabile, timpi pentru fiecare etapă, sugestii de servire, înlocuiri și alergeni când sunt relevanți. Pentru o rețetă generală cunoscută nu este obligatorie căutarea web; pentru rețeta unui bucătar, restaurant sau pentru noutăți specifice, verifică sursa.
- Știință, educație, economie, tehnologie, sport, servicii, produse, sănătate și alte subiecte accesibile legitim. Ajustează rigoarea la riscul domeniului.

## Cerințe de cercetare și prezentare
1. Decide semantic dacă cererea necesită date actuale/căutare externă. Nu condiționa căutarea numai de „?” sau o listă închisă de cuvinte; exemple de interogări fără semn de întrebare: „Caută festivaluri în Oradea”, „Codul muncii în Japonia”, „Filme la cinema în Londra”.
2. Folosește motoarele de căutare existente (Exa, Brave, Tavily unde sunt configurate) și servicii specifice domeniului când există, fără să promită o disponibilitate neverificată.
3. Identifică limba răspunsului separat de țară/locație; datele verificate provin din sursele destinației, în limba adecvată.
4. Pentru rezultate sensibile la timp, afișează data verificării, data desfășurării și fusul orar după caz. Nu prezenta programe trecute ca evenimente viitoare.
5. Afișează concise datele esențiale, linkuri de sursă relevante, și, unde există și este permis, imagini/media verificate. Dacă nu există rezultate sau sursele nu sunt concludente, spune precis acest lucru.
6. Refolosește contextul conversației, dar nu schimba ecranul activ și nu transforma automat o căutare de informații într-o cerere de traseu.

## Standard de afișare a duratelor traseelor (toate tipurile de transport)
Duratele se calculează în continuare în unități numerice (secunde/minute) pentru precizie, comparare, alegere de trasee, calculul plecărilor și verificarea fezabilității; se schimbă numai formatarea vizibilă utilizatorului. Aplică aceeași regulă în răspunsurile din backend și în toate ecranele, tabelele cu variante, ferestrele de hartă, traseele pietonale/rutiere și variantele de transport public, inclusiv plimbarea până la prima stație și durata segmentelor, unde se afișează o durată.

- Sub 60 de minute: afișează numai minutele (ex. 45 minute).
- De la 60 de minute la sub 24 de ore: afișează ore și minute (ex. 135 minute → 2 ore 15 minute; 120 minute → 2 ore).
- De la 24 de ore în sus: afișează zile, ore și minute (ex. 1.575 minute → 1 zi 2 ore 15 minute; 2.880 minute → 2 zile).
- Omite componentele cu valoare zero, dar afișează „0 minute” la durata zero. Rotunjește la minute numai la afișare, cu păstrarea unităților interne originale. Folosește singular/plural corect pentru fiecare limbă selectată în aplicație (toate cele zece limbi).
- Formatarea duratei NU schimbă orele de plecare/sosire, timpii de transfer, algoritmul rutelor, sortarea alternativelor, numărul de opțiuni, zonele orare sau API-ul brut. Pentru traversări de fus orar, durata rămâne timpul scurs real, independent de ora locală.
- Verifică expres prezentarea duratelor în backend.js (ex.: ~1088, ~1359–1360, ~1522, ~1532) și frontend index.js (~1755, ~1757, ~2001, ~2114), fără a modifica algoritmii de rutare.

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
- „Știri politice din Canada din ultima săptămână” -> rezumat neutru, evenimente și date clare, surse și fapte verificate.
- „Dă-mi o rețetă de sarmale pentru 6 persoane” -> ingredientele și cantitățile, pașii, timpii, temperatura și porțiile, fără a forța un apel web inutil.
- „Traseu de 45 de minute” -> 45 minute; „Traseu de 135 de minute” -> 2 ore 15 minute; „Traseu de 1.575 de minute” -> 1 zi 2 ore 15 minute. Verificare în RO, EN și celelalte opt limbi.
- Cererile de traseu care afișează deja trei opțiuni trebuie să continue să funcționeze identic după introducerea regulilor de cercetare.

## Limite oneste
„Din orice domeniu” înseamnă domenii legale și informații accesibile în mod legitim, nu promisiunea că orice informație există sau este disponibilă în timp real. Informațiile neverificate se marchează clar, iar aplicația nu inventează acces, orare, acte normative ori prețuri.
