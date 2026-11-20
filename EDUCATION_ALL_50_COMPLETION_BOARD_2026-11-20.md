# Educație — reorganizare unitară pentru toate cele 50 de sisteme școlare
**Stadiu: în lucru, nu gata de publicare · 20 noiembrie 2026 · an școlar 2026/27**

## Cerința produsului
Educație trebuie tratată ca **un singur capitol**, nu ca o colecție de reparații RO/UK ori APK-uri pe materie. Fiecare domeniu este verificat simultan în TOATE țările din selector. Structura comună este:

**Țară → etapă → clasă/an → disciplină → capitol → subcapitol/lecție → teorie, exemple, exerciții, test**.

Acolo unde sistemul impune: **regiune/land/canton/comunitate, tipul școlii, profil, limbă de predare, cohorta reformei, exam board**. Editura/manualul ales este un câmp separat de programa oficială.

## Domenii inventariate
Matematică; Fizică; Chimie; Biologie; Astronomie; Istorie; Geografie; Informatică; Limbă și literatură; Limbi străine; Pregătirea examenelor — **11** familii.

Cursurile practice sunt un modul independent, nu o materie școlară obligatorie. În celelalte module, păstrăm disciplinele separate, chiar dacă țara le predă integrat sau opțional.

## Țări / jurisdicții din selector: exact 50
AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK GB-ENG GB-SCT GB-WLS GB-NIR

Lista oficială de opțiuni nu se mai dublează în cod; registrul comun este în `education_all_country_subject_matrix.mjs`.

## Rezultatul inventarului automat inițial
Regresie dedicată (GitHub Actions `Education 50-country curriculum coverage`):
- 50 sisteme × 11 domenii, toate etapele și toate clasele definite: **4.598 combinații clasă–materie**
- **36** combinații cu un cadru curricular verificat (nu înseamnă manual complet)
- **121** combinații cu conținut particularizat pe clasă, dar neverificat în raport cu manualul
- **4.441** combinații care au doar o succesiune de învățare generală
- **108** perechi țară–etapă fără ani școlari naționali mapați; nu se inventează clase ISCED ca și cum ar fi nume oficiale.

Valorile sunt *starea catalogului existent*, nu numărul de elevi, manuale ori programa publicată în Europa. Se recalculează din `educationCoverageTotals()`. `educationCompletionGate()` este **false** până la remedierea lipsurilor.

## Modificări de arhitectură făcute pe ramură
1. `education_all_country_subject_matrix.mjs` indexează pentru fiecare selecție sursa, clasa, materia, lecțiile disponibile și statusul real: `framework-verified`, `grade-content-unverified`, `general-learning`, `invalid-selection`.
2. `education_country_ui.mjs` folosește aceeași listă de 50 de țări și păstrează contextul `educationCountrySelection.curriculum` la selectarea clasei. A eliminat presupunerea că toate disciplinele din România și Anglia sunt implicit verificate.
3. `tests_education_all_country_subject_matrix.mjs` enumeră exhaustiv toate clasele și materiile pentru fiecare țară, verifică unicitatea titlurilor și dovezile statutelor.
4. Workflow-ul **test-education-all-countries.yml** testează matricea fără a publica o versiune nouă.

## Ce rămâne necesar pentru finalizarea *efectivă*
| Zonă de verificare | Acceptare obligatorie pentru toate țările |
|---|---|
| Structuri școlare | Ani reali, programe, clase și ramuri; eliminarea celor 108 etape neacoperite |
| Matematică | Capitol → subcapitol → explicație și exercițiu adecvate clasei și țării |
| Științe (Fizică, Chimie, Biologie, Astronomie) | Verificare per disciplină/țară/clasă în paralel, inclusiv discipline integrate sau opționale; nu doar `minLevel` |
| Istorie/Geografie | Țara și clasa dictează epoci, spațiu și conținut; sursele și hărțile sunt autentice |
| Limbă și literatură | Manual recognoscibil elevilor; gramatică, lectură, compunere/eseu; opere fără listă obligatorie inventată |
| Informatică | Diferențiere reală pentru competențe digitale primar, programare gimnaziu, profil liceal |
| Limbi străine | Mod școlar pe țară/clasă separat de progres liber CEFR |
| Examene | Sesiune, profil, probă, sursă; exercițiile originale marcate ca neoficiale |
| Documente și navigare | Paginare cititor, PDF A4, salvare, audio, „Înapoi”, fără dubluri și elemente ascunse |
| Testare | Matrice automată + testare efectivă Android pe primar, gimnaziu și liceu în mai multe țări; câte o versiune finală, nu APK pe fiecare lecție |

## Reguli pentru continuare
- Nu se închide o materie numai fiindcă există un meniu sau trec teste de sintaxă.
- Pentru fiecare materie, revizuirea are loc în toate cele 50 de sisteme simultan (inclusiv excepțiile/limitările documentate).
- Prioritate documentelor oficiale pentru anul școlar și cohorta 2026/27, apoi manualelor aprobate sau școlare; Eurydice este referință pentru structură, nu manual universal.
- Nu se publică un APK din această ramură până la trecerea testului de acceptare integral al Educației.
- Nu se fuzionează `main` fără evidențe că materia este organizată și funcțională pentru elevi; o mapare generică nu reprezintă finalizare.

**Statutul prezentei ramuri: fundația și verificarea transversală, NU toate programele/lecțiile deja finalizate.**
