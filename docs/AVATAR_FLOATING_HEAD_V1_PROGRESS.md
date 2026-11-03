# Prototip cap plutitor — v1 (2026-11-03)

Referința vizuală aprobată: față cât mai frontală, doar capul și partea superioară a gulerului, mișcare lentă de plutire, ceață albastră semitransparentă, dispărând la margini, interfața Pocket AI vizibilă în spate.

**Proba HTML autonomă a fost generată ca artefact de conversație:** `PocketAI_avatar_cap_plutitor_v1.html`, livrată și în `PocketAI_avatar_cap_plutitor_v1.zip`. Conține motorul Three.js și exact modelul GLB existent din `public/avatar-v16.html` (SHA-256 GLB: `0cbfd101a96883f20a4d33d09b1cf06f5fc3b126936faaf17ab1c90d464cfaee`). Artefactul mare nu este încă în GitHub.

Implementare în probă: orientare frontală ajustată, decupaj inferior cu alpha gradual, un canvas 3D transparent, două straturi de ceață procedurală cu vălătuci și opacitate mică, plutire la amplitudine mică, model nemanevrabil prin atingere, un singur controler pentru morph-urile buzelor. Vocea de probă e redată de browser; marcajele temporale sunt folosite când există, altfel mișcarea buzelor rămâne estimativă.

Validări: sintaxa JS cu Node.js, model GLB identic cu originalul și integritate ZIP. Redarea vizuală WebGL nu a putut fi confirmată în mediul automat de test — testul pe Chrome/Android rămâne obligatoriu înainte de orice integrare.

**Nu modifica `main` sau deploymentul public** până la aprobarea vizuală și vocală de pe telefon. Păstrează strict această ramură pentru reconstrucția avatarului.
