myPocket AI frontend v1.0.60 — bază v1.0.59.
Înlocuiește index.js în Cloudflare Worker frontend.
Cauze identificate:
1. Stilul din v1.0.58 ascundea .language-menu-button cu display:none!important, suprascriind stilul din v1.0.59.
2. applyUiLanguage apela refreshToolTranslations înainte de inițializarea const localizedTools, producând o eroare JavaScript de inițializare.
Corecții:
- Butonul selectorului este vizibil; fereastra custom rămâne încadrată între antet și bara de jos.
- Traducerile Instrumente sunt actualizate doar după crearea cardurilor.
- Instrumente folosește 3 rânduri flexibile în spațiul disponibil, fără derulare verticală a paginii.
Backend v98 nemodificat; căutările rapide încă necesită depanare separată.
Teste: node --check PASS; ZIP integrity PASS. Test Android vizual: NEEXECUTAT.
