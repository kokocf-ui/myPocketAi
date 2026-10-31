myPocket AI — detalii locații
Frontend v1.0.66 (bază stabilă v1.0.65); backend v99 (bază v98).

Implementat:
- Nume, adresă, categorie, distanță, telefon, website, hartă.
- Galerie cu miniaturi și fereastră foto mărită, închidere cu buton, fundal sau Escape.
- Imagine reală numai când există URL HTTPS din datele OSM/Geoapify/Photon, inclusiv tag Wikimedia Commons File.
- Câmpurile de preț și camere se afișează numai când furnizorul le trimite explicit.
- Traduceri etichete detalii în 10 limbi.
- Nu sunt modificate CSS-ul și comportamentul tabelelor de rezultate, navigarea sau căutarea.

LIMITĂRI: backendul v99 nu are încă furnizor autorizat pentru prețuri/disponibilitate hotelieră sau galerie de camere; aceste câmpuri rămân absente până la integrarea unui furnizor real. Majoritatea locurilor OSM nu au imagini, caz în care fotografia este omisă. Teste live Android/API neefectuate.

Instalare: actualizați separat Worker frontend cu frontend/index.js și Worker backend cu backend/backend.js. Păstrați copii ale versiunilor stabile.
