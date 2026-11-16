# Eva Alpha — Europa: monetizare și supravegherea costurilor

Obiectiv comercial confirmat 2026-11-16: **lansare pentru toată Europa geografică**, inclusiv țările din afara UE. Eva are un singur abonament Premium; comisioanele de afiliere pot completa veniturile și pot acoperi costurile infrastructurii.

## Status verificat
- Omio: titularul a primit mesaj de bun venit în programul de afiliere Impact. Aceasta **nu** demonstrează obținerea unui token API de căutare, a unui link personal de tracking sau confirmarea vreunui comision.
- Booking.com și Viator: potențiali parteneri; **nu** pretindem că avem aprobarea sau contractul pentru ei.
- Anglia: importul GTFS audit-only continuă pe Oracle, într-o ramură și un proces separate. Nu are legătură cu această etapă.
- `eva_affiliate_registry.mjs` și `eva_alpha_cost_alerts.mjs` sunt logică fără apeluri de rețea, **nu** interfață live sau abonament activ.

## Politica de afiliere
1. Numai parteneri cu aprobare verificată și linkuri de tracking emise de partener, gestionate pe backend, pot fi afișați.
2. Linkurile personalizate nu se inventează, nu se rescriu și nu se construiesc cu un Impact ID presupus.
3. Ofertele de transport prezintă doar plecări/prețuri verificate; un link afiliat **nu** dovedește existența cursei, locurilor sau prețului.
4. Fiecare ofertă are informare vizibilă că Eva poate primi comision; rezervarea/plata se desfășoară la partener.
5. Categoriile: Omio => deplasare mixtă internațională; Booking.com => Hoteluri; Viator => activități. Integrarea trebuie activată doar după revizuirea contractelor și a drepturilor de afișare.

## Panou privat — Alpha Android
Țintă: Setări > Administrare Eva. Acces exclusiv pe un rol de administrator verificat **la server**, nu pe un simplu comutator ascuns în frontend, e-mail din profil, număr de telefon sau flag în APK. Cheile Cloudflare/Impact rămân în backend; nu se livrează în aplicație.

Câmpuri distincte: observație și sursa verificată, neuroni zilnici consumați și alocație, cheltuială AI lunară în USD și buget, utilizatori activi când măsura este implementată, comisioane în așteptare/confirmate/încasate, venit abonamente separat. Nu combina USD/EUR fără conversie datată. Lipsa datelor afișează **Indisponibil**, nu zero. Datele mai vechi de 30 minute sunt marcate învechite până la revalidare.

Praguri propuse pentru alocație zilnică și buget lunar: 70% avertizare, 85% critic, 100% limită. `eva_alpha_cost_alerts.mjs` calculează severitatea fără să fabrice statistici; **nu** blochează cereri și **nu** trimite push. Blocarea reală necesită protecție la nivel de backend și, unde sunt disponibile, limite provider-side. Notificări Android FCM numai după confirmarea configurării și înregistrării tokenului.

## Etapele rămase înainte de activare
1. Obține link real de afiliere Omio/Impact, conform condițiilor programului, și aprobă explicit hostul de redirect.
2. Configurează backend-ul pentru provisioning de linkuri verificate și autorizare administrativă; abia apoi adaugă butoanele în interfețele Hoteluri/Transport mixt/obiective.
3. Conectează interogările statistice Cloudflare la server, cu chei server-side; confirmă schema, facturarea AI reală și granularitatea disponibile înainte de prezentare.
4. Adaugă panou Alpha pe un singur ecran, notificări 70/85/100, verificare de regresie Android și APK semnat de test.
5. Activează doar după teste end-to-end și verificarea că ceilalți utilizatori nu văd panoul sau datele administratorului.

**Nimic în acest PR nu schimbă servicii Cloudflare, Oracle, comunicarea sau APK-ul.**
