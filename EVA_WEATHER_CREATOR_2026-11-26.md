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

## Creator: implementare

- Sursă unică `creator_business_profiles.mjs`: 10 domenii separate, câte4grupuri de detalii. **Pensiune≠Hotel** (gazde/mese/spații comune vs recepție/servicii hoteliere/clasificare oficială); **Restaurant≠Cafenea≠Bar** (bucătărie/meniu/mese vs cafea/patiserie/pauze vs băuturi/acces/evenimente). Servicii/salon/magazin/portofoliu/altul au propriile câmpuri.
- Editor separat, derulabil intern, cu Salvează/Anulează mereu accesibile, focus+Escape/AndroidBack. Drafturile sunt separate pe domeniu în sesiunea formularului; nu se transferă camere la cafenea. Nu se promit salvare durabilă sau restaurare după închiderea aplicației.
- Datele structurale reale apar ca secțiuni distincte; câmpurile goale/necunoscute se omit. Fără stele, tarife, recenzii sau servicii inventate. Datele se escapează HTML. Linkuri mailto/tel numai din contactul furnizat. Controalele fără backend rămân solicitări, nu rezervări confirmate.
- 12familii de compoziție păstrate, dar titluri proporționate pe telefon, mai puțin jargon decorativ, secțiuni practice și contact accesibil. Ilustrații proprii distincte pensiune/hotel/cafea/bar/restaurant, etichetate concept; fotografiile proprietarului au prioritate. Nicio ilustrație nu este prezentată drept fotografia afacerii.
- Alegerea domeniului se reflectă în galeriile foto, preview-ul modelelor, HTML final și cerereaAI. ServiciulAIexistent primește kind distinct și detalii relevante în limitele sale; HTMLpăstrează textulintegralal câmpurilor. Nicio schimbare de cote/plăți/serviciu creator. Schimbarea datelor invalidează copyulvechi și rezultatulAIîntârziat nu se aplică altui domeniu. ProiectuleditabilpăstreazăbusinessDetails și câmpurile în fallbackservicii. StudioindependentNUeste redeployat înaceastăetapă; nus-aaprobat/publicatautomatniciunsiteclient.

## Verificări

- `tests_eva_identity_weather`, `tests_eva_weather_backend`, `tests_creator_business_profiles`: PASS, AI/providerisimulați. 10scheme/40câmpuri, siguranțăHTML, contact, galerii.
- Browserbundleproducție360/393/430: toate10formularele/categorii/drafturi, secțiuni reale, fereastră400pxpentru tastatură, atingereavatar/×→stopnativsimulat/voiceModefalse/ascundere, fereastralocațiepăstrată PASS. Nu dovedește sunetul fizic.
- CreatorPremium12compoziții/liveUI/management/traducere/previewservice/creationUI/v2 PASS. `tests_studio_portal_and_handoff`arefailvechi înassertimagine `FULL SCENE,FULL BODY`; motorulimagineșiaserțiunearespectivănuschimbateînaceastăetapă. Nu pretinde totsuiteStudioverde.
- Preflightbackend: **57/57comenzi PASS**. Testliteraturetutoraveaasertvechi2800deși bugetul3200existadejape0f0d020; harnessulizolatnuinjectaeducationExerciseInstruction. Actualizatnumaitestul, nucurriculum/buget/lecții; rerunPASS.
- Map/current-address/live-location/precisionactualizatecerințeipentrucodurineconfirmatePASS. Gatecomunextinspentruexpresiiledeauto-adresăexistenteînainteaexplicațiilorgenerale; clientnouNUtaieGPScererilorlegitime.
- `npm run check`, bootsyntax, Wranglerv4.168backenddryrunPASS. Snapshotintermediar6980672B<8MB; cel final reverificat înainte de APK.
- Publicarebackendmanualăautorizarăprininput`backend_only=true`, fărămainmerge/fărăfrontenddeploy. VersiuneaAPIv183; workflowincludepostdeployliveprobes cu scenariulsinteticCosti/meteoGrays/locație/conversație. Nu declarapublicareaînainteasuccesuluipașilor.
