# Feedback fizic: Eva, vreme, locație și creator de site-uri

Cerere: utilizatorul autorizează explicit publicarea îmbunătățirilor serverului și cere un APK final cu toate modificările. Eva este feminină; numele utilizatorului Costi nu implică identitatea cântărețului. Prognoza: sfat condițional, umbrelă la ploaie, localitate fără suburbie; locație fără liste de coduri neconfirmate; atingere avatar → oprește vocea și închide suprapunerea. Apoi creatorul trebuie diferențiat pe tipuri de afaceri și profesionalizat.

## Subetapa Eva / meteo / locație

- `assistant_personal_identity.mjs`: recunoaștere conservatoare nume preferat, inclusiv replica exactă din captură după întrebarea de nume. Confirmare fără model sau cercetare; nu poate deveni biografie de persoană publică. Instrucțiuni feminine/Eva/nume≠identitate publică în dialog și în asistentul general.
- `weather_practical_advice.mjs`: recomandări din următoarele maximum6ore disponibile: haină groasă<5°Cresimțite, strat/jachetă<15°C, fără haine recomandate automat la cald; umbrelă la precipitații/codmeteo de ploaie/probabilitate≥60%; impermeabil în vânt puternic, avertizare ninsori/furtună/căldură. Nu se declară observație directă; rămâne prognoză/model.
- Localitate meteo `town/city/village` fără suburbie dacă există oraș. Coordonatele prognozei nu sunt schimbate de simplificarea etichetei.
- Codurile poștale candidate nu mai sunt în text/TTS sau payload de locație; `postcode:null`, `nearby_postcodes:[]`. Numărul aproximativ rămâne explicit estimat; precizia GPS este afișată onest. Nu promisiune de adresă exactă.
- Avatar: atingere suprafață/× sau Enter/Space → dezactivează bucla de conversație vocală/dictarea, oprește recunoașterea, trimite stop nativ și browser, oprește animația și ascunde suprapunerea. Confirmarea ieșirii păstrează butoanele proprii. Corectat `pointer-events:none` care împiedica suprafața să primească atingerea; iframe-ul rămâne non-interactiv. Fereastra de locație de dedesubt nu se închide.
- Teste noi pure+Worker cu providerisimulați pentru cazul Costi, rece/cald/ploaie și Grays; actualizate contractele vechi ce cereau afișarea codurilor candidate. Nu sunt dovezi de test fizic al sunetului/locației.

## Creator / publicare / APK

În lucru. Nu declara publicat sau livrat până la confirmarea workflow-urilor și versionCode>501883. Publicarea va fi manuală, din ramura curentă, fără merge și fără schimbarea schemei Oracle. Traducerea APK rămâne în afara scopului.
