# myPocketAI — Divertisment / Just for fun
Data: 24 noiembrie 2026

## Cerințe convenite cu utilizatorul
- În „Mai multe instrumente”: casete mari, pe un singur rând, similare cu „Deplasare spre…”; fiecare opțiune să aibă o ilustrație vectorială proprie. Menține Acasă/Înapoi, bara de navigare și modulele existente.
- „Astrologie și zodii”: zodie solară după longitudinea solară tropicală; ascendent calculat cu ora UTC la naștere și coordonatele nașterii; astrogramă, compatibilitate și zodiac chinezesc; horoscop serios și umoristic, inclusiv viața amoroasă. Criterii astronomice reale pentru calculele pozițiilor, fără prezentarea previziunilor astrologice ca știință.
- „Maxima zilei”: afișată o singură dată pe zi la prima pornire, cu revedere din meniu.
- „Bancul zilei”: unul pe zi, plus colecție accesibilă oricând.
- „Integrame, rebus și Sudoku”: funcționalitate offline.

## Implementat în cod (fără confirmare de APK)
- `extra_tools_six_nav.mjs`: a patra categorie „Divertisment”, patru subopțiuni, carduri mari pe lățime, SVG-uri pe categorii și subopțiuni.
- `extra_fun_core.mjs`: longitudine aparentă solară aproximată din JD (formula convențională NOAA/USNO); zodiac tropical; ascendent aproximativ din timpul sideral local și latitudine; aspecte simplificate Soare natal–Soare curent; zodiac chinezesc cu anul lunar din calendarul `Intl` (ICU, dacă disponibil); maxime, bancuri; Sudoku offline generat cu verificarea unicității soluției; mic rebus offline.
- `extra_fun_ui.mjs`: interfața pentru dată, oră locală, offset UTC, latitudine/longitudine, zodie și compatibilitate; roată zodiacală simplificată (Soare/ASC); horoscop zilnic/săptămânal/lunar serios și umoristic; banner de maximă o dată pe dată locală folosind localStorage; colecții și jocuri.
- `extra_tools_workspace.mjs`: înregistrarea noilor scripturi și stiluri în pachetul existent.
- Teste: `tests_extra_fun_2026.mjs`, `tests_tools_six_navigation.mjs`, înregistrate în `package.json`.

## Limitări de precizie și de completitudine
- Roata Soare/ASC **nu este** o hartă natală completă (Lună, planete, case, efemeride de mare precizie). Nu se inventează aceste poziții.
- Horoscopul combină un context solar astronomic calculat cu text simbolic creativ, **nu** inferențe fizice despre destin. Nu afirmăm că este o predicție verificată.
- Ascendentul necesită ora nașterii, offset UTC istoric introdus de utilizator și loc; la latitudini aproape polare se refuză estimarea.
- Sudoku are verificare automată a unicității; colecția de rebus conține momentan o singură grilă ilustrativă. Urmează extinderea colecțiilor și localizările.
- Nu a fost testat pe telefon sau compilat într-un APK pentru această modificare. Nicio declarație de livrare finală până la testare pe Android și verificarea regresiilor.

## Surse de calcul
- US Naval Observatory, *Approximate Solar Coordinates*: https://aa.usno.navy.mil/faq/sun_approx
- NOAA, *Solar Calculator*: https://gml.noaa.gov/grad/solcalc/
- Swiss Ephemeris, note privind formulele ascendentului: https://www.astro.com/swisseph/Table_Arctic_Placidus_readme.pdf
- Calendarul chinezesc: `Intl.DateTimeFormat('en-u-ca-chinese')` / `relatedYear` și Anul Nou lunar; disponibilitatea depinde de ICU/Android WebView.

## Regresii de evitat
- Nu reveni la grila cu două coloane din „Mai multe instrumente”.
- Nu afecta fluxurile „Documente și fișiere”, „Creare pagini și imagini”, „Idei și proiecte”, transportul, educația sau navigația generală.
- Nu repeta maxima zilei la fiecare revenire în aplicație în aceeași zi calendaristică.
