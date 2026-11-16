# Schimbarea între mijloace — trasee pietonale (Eva)

## Contract comun (România, Anglia, TfL și TransCAPI)

Unele schimbări între autobuz, tren, metrou sau tramvai se fac între
**stații diferite**, uneori la 5–10 minute de mers pe jos.
Timpul dintre sosire și plecare nu este automat timp de mers.
La fiecare legătură se separă:
1. sosirea primului vehicul;
2. mersul pe jos de la stația/peronul de coborâre până la următoarea stație;
3. așteptarea după sosirea la punctul de îmbarcare;
4. plecarea următorului vehicul.

Motorul reutilizează Geoapify (cheie exclusiv în backend) și geometria
de traseu oferită de operator, atunci când aceasta este exactă.
Nu ghicește străzi, durate, trepte sau ocoluri din distanța în linie dreaptă.
Dacă stațiile sunt aceleași conform ID-ului și coordonatelor, se menține
avertismentul că schimbarea peronului trebuie verificată.

O conexiune este considerată sigură doar când timpul de mers verificat plus
marja de îmbarcare încape între ora de sosire și ora de plecare.
Dacă nu, itinerarul se exclude. Dacă nu există puncte precise sau geometrie,
se arată explicit „traseu pietonal neverificat”, nu o hartă inventată.

## Date disponibile în răspunsul backend

- `journey.transferWalks[]`: `from`, `to`, `status`,
  `walkingMinutes`, `walkingDistanceMeters`, `waitingMinutes`,
  `availableTransferMinutes`, `minimumBoardingBufferMinutes`,
  `pedestrianRouteVerified`, `platformChangeUnverified`, `coordinates`.
- `journey.pedestrianTransferSegments[]`: geometria segmentelor
  pietonale verificate, pentru vizualizarea lor independentă pe hartă.
- `journey.transferFeasible`: `true` când este verificat,
  `false` când este dovedit imposibil, `null` când lipsește dovada.
- `journey.transferWalkingVerified`: nu confundă un timp preluat doar
  din orarul operatorului cu verificarea străzilor.
- `journey.legs[]`: se introduce un `walking` cu durată și geometrie
  **numai** când un traseu este verificat. Etapele WALK deja furnizate
  de operator sunt păstrate, fără dublare.

## Prezentare în aplicația mobilă (UI de conectat)

În lista de etape, fiecare schimbare trebuie să aibă un rând dedicat:
„Pe jos: X min, Y m — stația A → stația B” și un rând distinct:
„Așteptare: Z min — următoarea plecare HH:MM”.
Rândul pietonal are acțiunea „Arată pe hartă”. Harta deschide numai
`pedestrianTransferSegments` pentru etapa selectată, cu poziția GPS,
indicațiile disponibile și stația de îmbarcare. Nu trebuie desenată
o linie artificială între trasee de autobuz și un segment pietonal.

Dacă datele pietonale lipsesc, arată:
„Transfer pietonal neverificat. Verifică stația și peronul”.
Când operatorul oferă o legătură WALK cu timp, dar fără traseu stradal,
afișează acea durată **ca durată furnizată de operator** și nu oferă
buton de navigare bazat pe geometrie lipsă.

Pentru stații mari, accesibilitatea scărilor, lifturilor, barierelor,
platformelor și timpul intern de deplasare nu sunt demonstrate automat.
Nu afirma „îți ajung sigur 3 minute” doar pentru că două linii au
aceeași stație sau distanță GPS mică.

## Status livrare

Backend: modificări izolate în PR draft și teste automate.
Nu s-au instalat versiuni noi pe Oracle, nu s-au configurat chei sau
tunneluri Cloudflare și nu s-a generat un APK nou.
Afișarea interactivă în frontend trebuie conectată și validată pe telefon.
UK / România: pot exista furnizori care nu livrează coordonatele precise
ale stațiilor de schimb; în acest caz nu se fabrică traseul pietonal.
