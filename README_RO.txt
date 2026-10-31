Frontend v1.0.68 — repară blocarea butoanelor din v1.0.67.
Înlocuiește DOAR frontendul Cloudflare Worker cu conținutul frontend/index.js.
Păstrează backend v100 neschimbat.
Corecție: regex-uri din funcția enrichPlaceMedia, care erau deformate de template literal HTML și blocau întregul script.
Verificat: JavaScript-ul extras din HTML-ul generat trece node --check. Nu a fost testat pe telefon.
