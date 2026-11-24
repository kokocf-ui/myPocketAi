// Authoritative bibliographic & ministerial framework correlation for all 4 Sciences
// (`physics`, `chemistry`, `biology`, `astronomy`) across all 50 European jurisdictions (2026/27).
//
// COPYRIGHT & HONESTY POLICY:
// - Stores ONLY bibliographic / ministerial reference metadata (title, authority/authors,
//   publisher or state catalog, approval/framework reference, syllabus, official https URL).
// - Contains ZERO copied prose, exercises, or figures from any commercial or state textbook.
// - University packs (`stage === 'advanced'`) and Vatican City school stages (`country === 'VA'`)
//   never claim a mandatory school textbook (`manualExample === null`).

import { PHYSICS_EUROPE_REFERENCES } from './physics_europe_frameworks.mjs';
import { CHEMISTRY_EUROPE_REFERENCES } from './chemistry_country_alignment.mjs';
import { BIOLOGY_COUNTRY_REFERENCES } from './biology_country_alignment.mjs';
import { ASTRONOMY_COUNTRY_EVIDENCE } from './astronomy_country_alignment.mjs';

export const SCIENCE_CORE_SUBJECTS = Object.freeze(['physics', 'chemistry', 'biology', 'astronomy']);

const RO_SCIENCE_TEXTBOOKS = Object.freeze({
  physics: Object.freeze({
    '6': { title: 'Fizică — Manual pentru clasa a VI-a', authors: 'Victor Stoica, Corina Dobrescu, Florin Măceșanu, Ion Băraru', publisher: 'Art Klett / Ministerul Educației (manuale.edu.ro)', approvalOrder: 'OMEN nr. 4862/06.09.2018; reeditare OME', syllabus: 'OMEN nr. 3393/28.02.2017 — Fizică VI–VIII', url: 'https://manuale.edu.ro/' },
    '7': { title: 'Fizică — Manual pentru clasa a VII-a', authors: 'Victor Stoica, Corina Dobrescu, Florin Măceșanu, Ion Băraru', publisher: 'Art Klett / Ministerul Educației (manuale.edu.ro)', approvalOrder: 'OMEN nr. 4951/26.08.2019; catalog oficial ME', syllabus: 'OMEN nr. 3393/28.02.2017 — Fizică VI–VIII', url: 'https://manuale.edu.ro/' },
    '8': { title: 'Fizică — Manual pentru clasa a VIII-a', authors: 'Victor Stoica, Corina Dobrescu, Ion Băraru, Florin Măceșanu', publisher: 'Art Klett / Ministerul Educației (manuale.edu.ro)', approvalOrder: 'OMEC nr. 4430/29.05.2020; catalog oficial ME', syllabus: 'OMEN nr. 3393/28.02.2017 — Fizică VI–VIII', url: 'https://manuale.edu.ro/' },
    '9': { title: 'Fizică — Manual pentru clasa a IX-a (mecanică și optică geometrică)', authors: 'Constantin Mantea, Mihaela Garabet / Seryl Talpalaru, Dorel Haralamb', publisher: 'Editura Didactică și Pedagogică / Bic All / Corint', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 3458/09.03.2004 — Fizică clasa a IX-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '10': { title: 'Fizică — Manual pentru clasa a X-a (termodinamică și electricitate)', authors: 'Constantin Mantea, Mihaela Garabet / Anatolie Hristev, Vasile Fălie', publisher: 'Editura Didactică și Pedagogică / Bic All / Corint', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 4598/31.08.2004 — Fizică clasa a X-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '11': { title: 'Fizică — Manual pentru clasa a XI-a (oscilații, unde și optică ondulatorie)', authors: 'Octavian Rusu, Constantin Traian / Seryl Talpalaru, Dorel Haralamb', publisher: 'Editura Corint / Editura Didactică și Pedagogică', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 3252/13.02.2006 — Fizică clasa a XI-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '12': { title: 'Fizică — Manual pentru clasa a XII-a (relativitate, fizică cuantică și nucleară)', authors: 'Cristian Presură, Seryl Talpalaru, Dorel Haralamb / Octavian Rusu', publisher: 'Editura Didactică și Pedagogică / Corint', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 5959/22.12.2006 — Fizică clasa a XII-a', url: 'https://www.edu.ro/programe_scolare_liceu' }
  }),
  chemistry: Object.freeze({
    '7': { title: 'Chimie — Manual pentru clasa a VII-a', authors: 'Luminița Vlădescu, Luminița Irinel Doicin, Corneliu Tărăbășanu-Mihăilă', publisher: 'Art Klett / Intuitext (manuale.edu.ro)', approvalOrder: 'OMEN nr. 4951/26.08.2019; catalog oficial ME', syllabus: 'OMEN nr. 3393/28.02.2017 — Chimie VII–VIII', url: 'https://manuale.edu.ro/' },
    '8': { title: 'Chimie — Manual pentru clasa a VIII-a', authors: 'Luminița Vlădescu, Luminița Irinel Doicin, Corneliu Tărăbășanu-Mihăilă', publisher: 'Art Klett / Litera (manuale.edu.ro)', approvalOrder: 'OMEC nr. 4430/29.05.2020; catalog oficial ME', syllabus: 'OMEN nr. 3393/28.02.2017 — Chimie VII–VIII', url: 'https://manuale.edu.ro/' },
    '9': { title: 'Chimie — Manual pentru clasa a IX-a (structura atomului, legături, soluții, echilibre)', authors: 'Sanda Fătu, Felicia Stroe, Constantin Stroe / Marius Andruh', publisher: 'Editura Corint / Crepuscul / EDP', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 3458/09.03.2004 — Chimie clasa a IX-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '10': { title: 'Chimie — Manual pentru clasa a X-a (chimie organică introductivă)', authors: 'Luminița Vlădescu, Corneliu Tărăbășanu-Mihăilă / Elena Alexandrescu', publisher: 'Art Klett / Crepuscul / EDP', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 4598/31.08.2004 — Chimie clasa a X-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '11': { title: 'Chimie — Manual pentru clasa a XI-a (compuși organici cu funcțiuni și mecanisme)', authors: 'Elena Alexandrescu, Viorica Zaharia, Mariana Nedelcu', publisher: 'Editura Crepuscul / Art / EDP', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 3252/13.02.2006 — Chimie clasa a XI-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '12': { title: 'Chimie — Manual pentru clasa a XII-a (termochimie, cinetică și echilibre chimice)', authors: 'Luminița Vlădescu, Irinel Adriana Badea, Luminița Irinel Doicin', publisher: 'Art / Editura Didactică și Pedagogică', approvalOrder: 'OMEC — Catalogul manualelor școlare valabile în învățământul liceal', syllabus: 'OMEC nr. 5959/22.12.2006 — Chimie clasa a XII-a', url: 'https://www.edu.ro/programe_scolare_liceu' }
  }),
  biology: Object.freeze({
    '1': { title: 'Matematică și explorarea mediului — Manual pentru clasa I (științele vieții integrate)', authors: 'Tudora Pițilă, Cleopatra Mihăilescu', publisher: 'Editura Didactică și Pedagogică (manuale.edu.ro)', approvalOrder: 'OMEN nr. 3970/15.06.2018', syllabus: 'OMEN nr. 3418/19.03.2013 — MEM I–II', url: 'https://manuale.edu.ro/' },
    '2': { title: 'Matematică și explorarea mediului — Manual pentru clasa a II-a (științele vieții integrate)', authors: 'Cleopatra Mihăilescu, Tudora Pițilă', publisher: 'Editura Didactică și Pedagogică (manuale.edu.ro)', approvalOrder: 'OMEN nr. 3970/15.06.2018', syllabus: 'OMEN nr. 3418/19.03.2013 — MEM I–II', url: 'https://manuale.edu.ro/' },
    '3': { title: 'Științe ale naturii — Manual pentru clasa a III-a', authors: 'Tudora Pițilă, Cleopatra Mihăilescu', publisher: 'Art Klett / EDP (manuale.edu.ro)', approvalOrder: 'OME nr. 5348/06.10.2021', syllabus: 'OMEN nr. 5003/02.12.2014 — Științe ale naturii III–IV', url: 'https://manuale.edu.ro/' },
    '4': { title: 'Științe ale naturii — Manual pentru clasa a IV-a', authors: 'Cleopatra Mihăilescu, Tudora Pițilă', publisher: 'Art Klett / EDP (manuale.edu.ro)', approvalOrder: 'OME nr. 5348/06.10.2021', syllabus: 'OMEN nr. 5003/02.12.2014 — Științe ale naturii III–IV', url: 'https://manuale.edu.ro/' },
    '5': { title: 'Biologie — Manual pentru clasa a V-a', authors: 'Jeanina Cîrstoiu, Silvia Olteanu, Ștefania Giersch, Camelia Manea', publisher: 'Editura Litera / Art Klett (manuale.edu.ro)', approvalOrder: 'OME nr. 4065/16.06.2022', syllabus: 'OMEN nr. 3393/28.02.2017 — Biologie V–VIII', url: 'https://manuale.edu.ro/' },
    '6': { title: 'Biologie — Manual pentru clasa a VI-a', authors: 'Silvia Olteanu, Iuliana Tanur, Camelia Manea, Afrim Camelia', publisher: 'Editura Litera / Corint (manuale.edu.ro)', approvalOrder: 'OMEC — Catalogul manualelor gimnaziale aprobate', syllabus: 'OMEN nr. 3393/28.02.2017 — Biologie V–VIII', url: 'https://manuale.edu.ro/' },
    '7': { title: 'Biologie — Manual pentru clasa a VII-a', authors: 'Floarea Dobran, Jeanina Cîrstoiu / Traian Șăitan, Adriana Simona Popescu', publisher: 'Editura Litera / EDP (manuale.edu.ro)', approvalOrder: 'OMEN nr. 4951/26.08.2019', syllabus: 'OMEN nr. 3393/28.02.2017 — Biologie V–VIII', url: 'https://manuale.edu.ro/' },
    '8': { title: 'Biologie — Manual pentru clasa a VIII-a', authors: 'Silvia Olteanu, Jeanina Cîrstoiu, Iuliana Tanur, Mirabela-Ecaterina Păun', publisher: 'Editura Litera / EDP (manuale.edu.ro)', approvalOrder: 'OMEC nr. 4430/29.05.2020', syllabus: 'OMEN nr. 3393/28.02.2017 — Biologie V–VIII', url: 'https://manuale.edu.ro/' },
    '9': { title: 'Biologie — Manual pentru clasa a IX-a (citologie, ereditate și biodiversitate)', authors: 'Elena Huțanu, Ioana Ariniș, Aurora Mihail', publisher: 'Editura Didactică și Pedagogică / Corint / All', approvalOrder: 'OMEC — Catalogul manualelor liceale valabile', syllabus: 'OMEC nr. 3458/09.03.2004 — Biologie clasa a IX-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '10': { title: 'Biologie — Manual pentru clasa a X-a (țesuturi, organe și funcții vitale)', authors: 'Aurel Ardelean, Ionel Roșu, Călin Istrate', publisher: 'Editura Corint / EDP', approvalOrder: 'OMEC — Catalogul manualelor liceale valabile', syllabus: 'OMEC nr. 4598/31.08.2004 — Biologie clasa a X-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '11': { title: 'Biologie — Manual pentru clasa a XI-a (anatomie și fiziologie umană)', authors: 'Dan Cristescu, Carmen Sălăvăstru, Bogdan Voiculescu, Cezar Th. Niculescu', publisher: 'Editura Corint / EDP', approvalOrder: 'OMEC — Catalogul manualelor liceale valabile', syllabus: 'OMEC nr. 3252/13.02.2006 — Biologie clasa a XI-a', url: 'https://www.edu.ro/programe_scolare_liceu' },
    '12': { title: 'Biologie — Manual pentru clasa a XII-a (genetică moleculară și ecologie umană)', authors: 'Gavrila Lucian, Nicolae Toma, Elena Huțanu / Aurel Ardelean', publisher: 'Editura Corint / EDP', approvalOrder: 'OMEC — Catalogul manualelor liceale valabile', syllabus: 'OMEC nr. 5959/22.12.2006 — Biologie clasa a XII-a', url: 'https://www.edu.ro/programe_scolare_liceu' }
  }),
  astronomy: Object.freeze({
    beginner: { title: 'Explorarea mediului & Științe ale naturii (I–IV) — Pământul, Soarele și Luna (teme integrate)', authors: 'Ministerul Educației — Comisia națională pentru învățământ primar', publisher: 'Editura Didactică și Pedagogică (manuale.edu.ro)', approvalOrder: 'OMEN nr. 3418/2013 & OMEN nr. 5003/2014 (teme astronomice integrate)', syllabus: 'Programele școlare MEM I–II și Științe ale naturii III–IV', url: 'https://manuale.edu.ro/' },
    lower: { title: 'Geografie & Fizică gimnazială / CDEOȘ Astronomie (V–VIII) — Sistemul Solar și fenomene cerești', authors: 'Ministerul Educației (CNPEE) & resurse didactice OAE / IAU', publisher: 'Ministerul Educației — manuale.edu.ro (conținut integrat + opțional CDEOȘ)', approvalOrder: 'OMEN nr. 3393/2017 (module integrate Geografie/Fizică + opțional CDEOȘ)', syllabus: 'OMEN nr. 3393/2017 — Domenii astronomice integrate în gimnaziu', url: 'https://manuale.edu.ro/' },
    medium: { title: 'Fizică liceală & CDEOȘ Astronomie și astrofizică (IX–XII) — Gravitație, radiație și cosmologie', authors: 'Ministerul Educației (CNPEE) — Comisia națională de Fizică și Astronomie', publisher: 'Editura Didactică și Pedagogică / Programe școlare liceale și opționale CDEOȘ', approvalOrder: 'Programele liceale de Fizică (IX–XII) și oferta națională CDEOȘ Astronomie', syllabus: 'Programele școlare de Fizică și opționalele de Astronomie (edu.ro)', url: 'https://www.edu.ro/programe_scolare_liceu' }
  })
});

const COUNTRY_AUTHORITIES = Object.freeze({
  HU: { publisher: 'Oktatási Hivatal (OH) — Hivatalos tankönyvjegyzék', authors: 'Oktatási Hivatal tananyagfejlesztő munkacsoport (NAT 2020)', order: 'NAT 2020 (5/2020. (I. 31.) Korm. rendelet) · OH tankönyvkatalógus', portal: 'https://www.tankonyvkatalogus.hu/' },
  MD: { publisher: 'Ministerul Educației și Cercetării (MEC) · CTICE Manuale școlare', authors: 'Grupul național de autori aprobat de MEC Republica Moldova', order: 'Plan-cadru MEC 2026/27 & Catalogul oficial ctice.gov.md', portal: 'https://ctice.gov.md/manuale-scolare/' },
  PL: { publisher: 'MEN — Wykaz podręczników dopuszczonych do użytku szkolnego & ZPE', authors: 'Ministerstwo Edukacji Narodowej (MEN) / Zintegrowana Platforma Edukacyjna', order: 'Podstawa programowa kształcenia ogólnego (MEN)', portal: 'https://zpe.gov.pl/' },
  'GB-ENG': { publisher: 'Department for Education (DfE) & Ofqual Accredited Specifications', authors: 'DfE National Curriculum Science Panel & Exam Boards (AQA / Edexcel / OCR)', order: 'National Curriculum in England: Science Programmes of Study & Ofqual GCSE/GCE', portal: 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study' },
  'GB-SCT': { publisher: 'Education Scotland & Scottish Qualifications Authority (SQA)', authors: 'Education Scotland Sciences Team & SQA Subject Panels', order: 'Curriculum for Excellence (Sciences) & SQA National / Higher Specifications', portal: 'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/' },
  'GB-WLS': { publisher: 'Welsh Government (Hwb) & WJEC / Qualifications Wales', authors: 'Curriculum for Wales Science and Technology AoLE & WJEC', order: 'Curriculum for Wales — Science and Technology & WJEC Specifications', portal: 'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/' },
  'GB-NIR': { publisher: 'CCEA (Council for the Curriculum, Examinations and Assessment)', authors: 'CCEA Science and Technology Curriculum & Examinations Team', order: 'Northern Ireland Curriculum (KS1–KS4) & CCEA GCE/GCSE Specifications', portal: 'https://ccea.org.uk/key-stage-3/curriculum/science-and-technology' },
  IE: { publisher: 'NCCA (National Council for Curriculum and Assessment) & SEC', authors: 'NCCA Science Development Group & State Examinations Commission', order: 'Primary SESE / Junior Cycle Science / Leaving Certificate Specifications', portal: 'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/' },
  FR: { publisher: 'MENJ Éduscol & manuels scolaires libres de choix pédagogique', authors: 'Ministère de l’Éducation nationale et de la Jeunesse (DGESCO)', order: 'Bulletin officiel MENJ — Programmes officiels Sciences / Physique-Chimie / SVT', portal: 'https://eduscol.education.fr/' },
  DE: { publisher: 'Kultusministerkonferenz (KMK) · Lernmittelverzeichnisse der Länder', authors: 'Sekretariat der Kultusministerkonferenz (KMK) & IQB', order: 'KMK Bildungsstandards (Physik, Chemie, Biologie) & Kerncurricula der Länder', portal: 'https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html' },
  AT: { publisher: 'BMBWF · Österreichische Schulbuchaktion (Schulbuchliste)', authors: 'Bundesministerium für Bildung, Wissenschaft und Forschung (BMBWF)', order: 'BGBl. II Lehrpläne (VS / MS / AHS) & BMBWF Schulbuchaktion', portal: 'https://www.schulbuchaktion.at/' },
  CH: { publisher: 'D-EDK / CIIP / EDK · Kantonale Lehrmittelverzeichnisse', authors: 'D-EDK (Lehrplan 21) · CIIP (PER) · EDK Maturitätskommission', order: 'Lehrplan 21 (NMG / NT) · Plan d’études romand · Rahmenlehrplan EDK', portal: 'https://www.edk.ch/' },
  BE: { publisher: 'Fédération Wallonie-Bruxelles & Vlaams Ministerie van Onderwijs', authors: 'FWB Référentiels Sciences & AHOVOKS Vlaanderen', order: 'Référentiel Sciences du tronc commun (FWB) & Vlaamse onderwijsdoelen', portal: 'https://eurydice.eacea.ec.europa.eu/national-education-systems' },
  NL: { publisher: 'SLO (Nationaal Expertisecentrum Leerplanontwikkeling) & CvTE', authors: 'SLO Natuur & Techniek / Mens & Natuur & CvTE Examenblad', order: 'SLO Kerndoelen & CvTE Examenprogramma’s (NaSk, Natuurkunde, Scheikunde, Biologie)', portal: 'https://www.slo.nl/' },
  LU: { publisher: 'MENJE / SCRIPT — Catalogue officiel des manuels scolaires', authors: 'MENJE Commissions nationales des programmes & SCRIPT', order: 'Plan d’études fondamental & Programmes nationaux de l’enseignement secondaire', portal: 'https://men.public.lu/fr/systeme-educatif/secondaire/apprentissages-evaluation/apprentissages.html' },
  ES: { publisher: 'Ministerio de Educación (MEFD) — BOE LOMLOE & catálogos autonómicos', authors: 'MEFD & Consejerías de Educación de las Comunidades Autónomas', order: 'Real Decreto LOMLOE (Primaria, ESO y Bachillerato — BOE)', portal: 'https://www.boe.es/eli/es/rd/2022/03/29/217/con' },
  IT: { publisher: 'Ministero dell’Istruzione e del Merito (MIM) — Adozioni libri di testo', authors: 'MIM — Indicazioni nazionali & Linee guida per i Licei / Istituti', order: 'Indicazioni nazionali I ciclo & Indicazioni nazionali per i Licei / Tecnici', portal: 'https://www.mim.gov.it/' },
  PT: { publisher: 'Direção-Geral da Educação (DGE) — Manuais escolares certificados', authors: 'Ministério da Educação — DGE Aprendizagens Essenciais', order: 'Aprendizagens Essenciais (Estudo do Meio, Ciências Naturais, Físico-Química, Biologia)', portal: 'https://www.dge.mec.pt/aprendizagens-essenciais-ensino-basico' },
  DK: { publisher: 'Børne- og Undervisningsministeriet (UVM) — Fælles Mål', authors: 'UVM Styrelsen for Undervisning og Kvalitet (STUK)', order: 'Folkeskolens Fælles Mål (Natur/teknologi, Fysik/kemi, Biologi) & Gymnasiale læreplaner', portal: 'https://eng.uvm.dk/primary-and-lower-secondary-education/the-folkeskole/subjects-and-curriculum' },
  FI: { publisher: 'Opetushallitus (OPH / EDUFI) — ePerusteet', authors: 'Finnish National Agency for Education (OPH)', order: 'Perusopetuksen & Lukion opetussuunnitelman perusteet (Ympäristöoppi, Fysiikka, Kemia, Biologia)', portal: 'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education' },
  SE: { publisher: 'Skolverket — Kursplaner (Lgr22) & Ämnesplaner (Gy11/Gy25)', authors: 'Statens skolverk (Swedish National Agency for Education)', order: 'Lgr22 (Fysik, Kemi, Biologi) & Gymnasieskolans ämnesplaner', portal: 'https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan' },
  NO: { publisher: 'Utdanningsdirektoratet (Udir) — Kunnskapsløftet LK20', authors: 'Utdanningsdirektoratet (Udir)', order: 'Læreplan i naturfag (NAT01-05) & programfag Fysikk / Kjemi / Biologi / Geofag', portal: 'https://www.udir.no/lk20/nat01-05' },
  IS: { publisher: 'Mennta- og barnamálaráðuneytið & Miðstöð menntunar og skólaþjónustu (MMS)', authors: 'Ministry of Education and Children & MMS Námsgagnastofnun', order: 'Aðalnámskrá grunnskóla og framhaldsskóla — Náttúrugreinar', portal: 'https://www.government.is/library/01-Ministries/Ministry-of-Education/Curriculum/adskr_grsk_ens_2012.pdf' },
  EE: { publisher: 'Haridus- ja Teadusministeerium (HTM) — E-koolikott & Riigi Teataja', authors: 'HTM & Haridus- ja Noorteamet (HARNO)', order: 'Põhikooli ja gümnaasiumi riiklikud õppekavad (Loodusvaldkond)', portal: 'https://www.riigiteataja.ee/et/akt/123122025007' },
  LV: { publisher: 'Valsts izglītības satura centrs (VISC) — Skola2030 / Mapa.gov.lv', authors: 'VISC Skola2030 Dabaszinātņu mācību joma', order: 'MK noteikumi — Pamatizglītības un vispārējās vidējās izglītības standarti', portal: 'https://skola2030.lv/' },
  LT: { publisher: 'ŠMSM & Nacionalinė švietimo agentūra (NŠA — eMokykla)', authors: 'NŠA Gamtamokslinio ugdymo bendrųjų programų grupė', order: ' Atnaujintos bendrosios programos (Gamtos mokslai, Fizika, Chemija, Biologija)', portal: 'https://emokykla.lt/bendrosios-programos/vidurinis-ugdymas/12' },
  CZ: { publisher: 'MŠMT — Seznam učebnic se schvalovací doložkou & NPI ČR', authors: 'Ministerstvo školství, mládeže a tělovýchovy (MŠMT) & NPI ČR', order: 'Rámcový vzdělávací program (RVP ZV / RVP G) — Člověk a příroda', portal: 'https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani' },
  SK: { publisher: 'MŠVVaM SR — Edičný portál & NIVaM', authors: 'Ministerstvo školstva SR & Národný inštitút vzdelávania a mládeže', order: 'Štátny vzdelávací program (Človek a príroda: Fyzika, Chémia, Biológia)', portal: 'https://www.minedu.sk/40737-sk/statny-vzdelavaci-program/' },
  SI: { publisher: 'MVI & Zavod RS za šolstvo — Katalog potrjenih učbenikov', authors: 'Strokovni svet RS za splošno izobraževanje & ZRSŠ', order: 'Učni načrti za osnovno šolo in gimnazijo (Naravoslovje, Fizika, Kemija, Biologija)', portal: 'https://www.gov.si/podrocja/izobrazevanje-znanost-in-sport/osnovnosolsko-izobrazevanje/' },
  HR: { publisher: 'Ministarstvo znanosti, obrazovanja i mladih (MZOM) — Katalog udžbenika', authors: 'MZOM Stručne radne skupine za Prirodu, Fiziku, Kemiju i Biologiju', order: 'Odluke o donošenju kurikuluma nastavnih predmeta (Narodne novine)', portal: 'https://narodne-novine.nn.hr/clanci/sluzbeni/full/2019_01_10_210.html' },
  BG: { publisher: 'МОН (Министерство на образованието и науката) — Познавателни книжки и учебници', authors: 'МОН — Дирекция „Съдържание на предучилищното и училищното образование“', order: 'Учебни програми на МОН по природни науки, физика и астрономия, химия и биология', portal: 'https://www.mon.bg/obshto-obrazovanie/uchebni-planove-i-programi-2/' },
  GR: { publisher: 'ΥΠΑΙΘΑ & ΙΤΥΕ «Διόφαντος» — Διαδραστικά Σχολικά Βιβλία (ebooks.edu.gr)', authors: 'Ινστιτούτο Εκπαιδευτικής Πολιτικής (ΙΕΠ) & ΥΠΑΙΘΑ', order: 'Προγράμματα Σπουδών Φυσικών Επιστημών (Δημοτικό, Γυμνάσιο, Λύκειο)', portal: 'https://www.minedu.gov.gr/protovathmia-defterovathmia/orologio-programma-gymnasiou' },
  CY: { publisher: 'ΥΠΑΝ Κύπρου — Υπηρεσία Ανάπτυξης Προγραμμάτων', authors: 'Υπουργείο Παιδείας, Αθλητισμού και Νεολαίας (ΥΠΑΝ)', order: 'Αναλυτικά Προγράμματα Φυσικών Επιστημών, Φυσικής, Χημείας και Βιολογίας', portal: 'https://www.moec.gov.cy/dme/en/gymnasium.html' },
  MT: { publisher: 'Ministry for Education, Sport, Youth, Research and Innovation (MEYR)', authors: 'Directorate for Learning and Assessment Programmes (DLAP) & MATSEC', order: 'National Curriculum Framework & Learning Outcomes / SEC Syllabi', portal: 'https://curriculum.gov.mt/syllabi-years-9-10-11-new/' },
  BA: { publisher: 'Ministarstva obrazovanja entiteta i kantona BiH & APOSO', authors: 'Agencija za predškolsko, osnovno i srednje obrazovanje (APOSO) & kantonalni zavodi', order: 'Zajednička jezgra nastavnih planova i programa (Prirodne nauke) & kantonalni kurikulumi', portal: 'https://mo.ks.gov.ba/nastavni-planovip-r-e-d-m-e-t-n-i-k-u-r-i-k-u-l-u-m-i' },
  ME: { publisher: 'Zavod za udžbenike i nastavna sredstva Podgorica (ZUNS) & Zavod za školstvo', authors: 'Ministarstvo prosvjete, nauke i inovacija Crne Gore & Zavod za školstvo', order: 'Predmetni programi za osnovnu školu i opštu gimnaziju (Priroda, Fizika, Hemija, Biologija)', portal: 'https://www.gov.me/mps' },
  MK: { publisher: 'МОН & Биро за развој на образованието (БРО — е-учебници)', authors: 'Биро за развој на образованието (БРО)', order: 'Наставни програми по Природни науки, Физика, Хемија и Биологија', portal: 'https://www.bro.gov.mk/' },
  RS: { publisher: 'Завод за унапређивање образовања и васпитања (ЗУОВ) — Каталог уџбеника', authors: 'Министарство просвете Републике Србије & ЗУОВ', order: 'Правилници о плану и програму наставе и учења (Физика, Хемија, Биологија)', portal: 'https://zuov.gov.rs/' },
  AL: { publisher: 'MAS & Agjencia e Sigurimit të Cilësisë së Arsimit Parauniversitar (ASCAP)', authors: 'ASCAP — Grupet e punës për Shkencat e natyrës', order: 'Katalogu zyrtar i teksteve shkollore & programet lëndore ASCAP', portal: 'https://www.ascap.edu.al/' },
  XK: { publisher: 'MASHTI — Katalogu i teksteve shkollore të aprovuara', authors: 'Ministria e Arsimit, Shkencës, Teknologjisë dhe Inovacionit (MASHTI)', order: 'Kurrikula Bërthamë e Kosovës — Fusha Shkencat e Natyrës', portal: 'https://mash.rks-gov.net/' },
  UA: { publisher: 'МОН України & ІМЗО — Електронна бібліотека підручників (lib.imzo.gov.ua)', authors: 'Міністерство освіти і науки України (НУШ)', order: 'Державні стандарти та модельні навчальні програми НУШ (Природнича галузь)', portal: 'https://mon.gov.ua/osvita-2/zagalna-serednya-osvita/osvitni-programi' },
  BY: { publisher: 'Міністэрства адукацыі Рэспублікі Беларусь — Нацыянальны адукацыйны партал', authors: 'Акадэмія адукацыі Рэспублікі Беларусь', order: 'Вучэбныя праграмы і зацверджаныя вучэбныя выданні па прыродазнаўчых прадметах', portal: 'https://adu.by/' },
  RU: { publisher: 'Минпросвещения России — Федеральный перечень учебников (ФПУ) & ЕДСОО', authors: 'Институт стратегии развития образования (ЕДСОО)', order: 'Федеральные рабочие программы по физике, химии, биологии и окружающему миру', portal: 'https://edsoo.ru/' },
  TR: { publisher: 'MEB Talim ve Terbiye Kurulu Başkanlığı & EBA Ders Kitapları', authors: 'Milli Eğitim Bakanlığı (MEB) Komisyonu', order: 'Türkiye Yüzyılı Maarif Modeli & MEB Öğretim Programları (Fen Bilimleri, Fizik, Kimya, Biyoloji, Astronomi)', portal: 'https://mufredat.meb.gov.tr/' },
  AD: { publisher: 'Ministeri de Relacions Institucionals, Educació i Universitats (Govern d’Andorra)', authors: 'Àrea d’Ordenament Curricular — Escola Andorrana', order: 'Programes de Ciències físiques i de la natura (Segona Ensenyança i Batxillerat)', portal: 'https://www.govern.ad/en/tematiques/educacio-formacio-investigacio-i-divulgacio-del-coneixement' },
  LI: { publisher: 'Schulamt des Fürstentums Liechtenstein — LiLe Lehrmittelverzeichnis', authors: 'Schulamt Liechtenstein (Liechtensteiner Lehrplan LiLe)', order: 'Liechtensteiner Lehrplan (LiLe) — Fachbereich Natur, Mensch, Gesellschaft / Natur und Technik', portal: 'https://www.llv.li/de/landesverwaltung/schulamt/bildungsbereiche/lehrplaene' },
  MC: { publisher: 'Direction de l’Éducation Nationale, de la Jeunesse et des Sports (DENJS Monaco)', authors: 'DENJS Principauté de Monaco (programmes alignés Éduscol)', order: 'Programmes scolaires DENJS — Sciences, Physique-Chimie et SVT', portal: 'https://www.gouv.mc/' },
  SM: { publisher: 'Segreteria di Stato per l’Istruzione e la Cultura — Repubblica di San Marino', authors: 'Dipartimento Istruzione — Curricoli di Scienze', order: 'Indicazioni curricolari per la Scuola Elementare, Scuola Media e Scuola Superiore', portal: 'https://www.educazione.sm/' }
});

const SUBJECT_LABELS = Object.freeze({
  physics: { ro: 'Fizică', en: 'Physics', huCode: 'OH-FIZ' },
  chemistry: { ro: 'Chimie', en: 'Chemistry', huCode: 'OH-KEM' },
  biology: { ro: 'Biologie', en: 'Biology', huCode: 'OH-BIO' },
  astronomy: { ro: 'Astronomie și științe spațiale', en: 'Astronomy & Space Science', huCode: 'OH-TER' }
});

function resolveSubjectFrameworkUrl(subject, country, fallbackPortal) {
  if (subject === 'physics') return PHYSICS_EUROPE_REFERENCES[country]?.source || fallbackPortal;
  if (subject === 'chemistry') return CHEMISTRY_EUROPE_REFERENCES[country]?.source || fallbackPortal;
  if (subject === 'biology') return BIOLOGY_COUNTRY_REFERENCES[country]?.source || fallbackPortal;
  if (subject === 'astronomy') return ASTRONOMY_COUNTRY_EVIDENCE[country]?.source || fallbackPortal;
  return fallbackPortal;
}

function resolveSubjectProgrammeName(subject, country) {
  if (subject === 'physics') return PHYSICS_EUROPE_REFERENCES[country]?.name || 'Physics / Integrated Science';
  if (subject === 'chemistry') return CHEMISTRY_EUROPE_REFERENCES[country]?.name || 'Chemistry / Integrated Science';
  if (subject === 'biology') return BIOLOGY_COUNTRY_REFERENCES[country]?.name || 'Biology / Life Science';
  if (subject === 'astronomy') return 'Astronomy / Earth & Space strand (advisory or integrated)';
  return SUBJECT_LABELS[subject]?.en || subject;
}

export function scienceTextbookCorrelationEntry(subject, country, stage, grade) {
  const s = String(subject || '').toLowerCase();
  const code = String(country || '').toUpperCase();
  const st = String(stage || '');
  const g = String(grade || '');
  if (!SCIENCE_CORE_SUBJECTS.includes(s)) return null;
  if (st === 'advanced' || code === 'VA') return null;

  if (code === 'RO') {
    const table = RO_SCIENCE_TEXTBOOKS[s];
    const entry = s === 'astronomy' ? table?.[st] : table?.[g];
    if (!entry) return null;
    return {
      id: `ro-tb-${s}-${g.toLowerCase()}`,
      country: 'RO',
      subject: s,
      stage: st,
      grade: g,
      title: entry.title,
      authors: entry.authors,
      publisher: entry.publisher,
      approvalOrder: entry.approvalOrder,
      syllabus: entry.syllabus,
      url: entry.url,
      manualExample: entry.url
    };
  }

  const auth = COUNTRY_AUTHORITIES[code];
  if (!auth) return null;
  const subj = SUBJECT_LABELS[s];
  const prog = resolveSubjectProgrammeName(s, code);
  const url = resolveSubjectFrameworkUrl(s, code, auth.portal);
  const manualUrl = code === 'HU' || code === 'MD' || code === 'AT' ? auth.portal : url;
  return {
    id: `${code.toLowerCase()}-tb-${s}-${g.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`,
    country: code,
    subject: s,
    stage: st,
    grade: g,
    title: `${prog} (${g}) — ${subj.en} Official Framework & School Reference`.slice(0, 220),
    authors: auth.authors.slice(0, 220),
    publisher: auth.publisher.slice(0, 220),
    approvalOrder: auth.order.slice(0, 220),
    syllabus: `${prog} · ${code} (${st})`.slice(0, 220),
    url,
    manualExample: manualUrl
  };
}

export function scienceSchoolManualExample(subject, country, stage, grade) {
  return scienceTextbookCorrelationEntry(subject, country, stage, grade)?.manualExample || null;
}

export function scienceCorrelatedPackTextbooks(subject, country, stage, grade) {
  const entry = scienceTextbookCorrelationEntry(subject, country, stage, grade);
  if (!entry) return [];
  const { manualExample: _omit, ...bib } = entry;
  return [bib];
}
