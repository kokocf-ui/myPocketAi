# Pocket AI — avatar 3D: plan de stabilizare (3 noiembrie 2026)

## Regula de siguranță
Această ramură este pentru dezvoltare și testare. **Nu** se modifică `main` și nu se publică automat variantele experimentale în aplicația publică. Modelul existent (`public/avatar-v16.html`) rămâne referință pentru aspect, nu pentru arhitectură.

## Reconstrucție
1. Separă geometria GLB de pagina demonstrativă; creează un viewer dedicat cu renderer WebGL `alpha:true`, scenă fără fundal și încărcare confirmată.
2. Elimină DOM-ul demonstrației, butoanele, UI de test, fundalul opac; integrează un singur canvas transparent deasupra aplicației, fără blocarea atingerilor.
3. Încadrează constant capul, umerii și bustul la dimensiunea convenită, atât pe Android cât și desktop; fără navigație orbit.
4. Inventariază morf-urile reale existente; pentru clipit, cap și gât construiește un rig verificat în model, nu roti tot bustul în loc de gât.
5. Folosește un singur `AvatarController` pentru stările `loading/ready/idle/speaking/error` și `start/viseme/stop`. Un singur motor actualizează morph targets. Nicio animație de vorbire înainte de începerea audio sau după terminarea lui.
6. Pentru lip-sync fonetic autentic, cere o sursă TTS care furnizează audio și marcaje temporale pentru cuvinte/viseme. Dacă lipsesc, marchează modul ca estimativ și evită pretenția de sincronizare precisă.

## Acceptare (pe dispozitivul utilizatorului)
- Un singur avatar; încărcare discretă, fără imaginea veche în paralel.
- Fundal alpha/transparență reală: interfața Pocket AI rămâne vizibilă în spatele modelului.
- Fără fereastră demonstrativă, buton X sau controale de rotire/zoom accidental.
- Bust și umeri vizibili, fără tăierea modelului sau zoom excesiv.
- Fața și coloritul aprobate; clipire și mișcare naturală cap/gât, fără distorsiuni.
- Vorbirea pornește și se termină odată cu audio; nu îngheață după două secunde.
- Mobile: performanță acceptabilă, fără blocarea chatului sau a navigației.
- Testare și aprobare înainte de integrare în `main`.

## Auditul aplicației
Separat de avatar: reproducere documentată pentru Beiuș/Bihor vs România, West Dulwich; corectarea testelor de regresie astfel încât să execute întregul flux, nu doar să caute șiruri de cod.

## Starea inițială
Ramura a fost creată din commitul `4a36225a7268c412a2b0dff1fcb0ca672d7945e6`. Nu este o versiune gata de publicare.
