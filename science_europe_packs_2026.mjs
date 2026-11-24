// Authoritative decoupled curriculum packs (`mypocketai-curriculum-pack/v1`) for all 4 Sciences
// (`physics`, `chemistry`, `biology`, `astronomy`) across all 50 European countries (2026/27).
//
// Coverage remains strictly GENERAL (primary -> lower -> upper -> university core/foundations)
// without narrow vocational/track subdivisions, per product architecture.
// All prose and quantitative worked examples are 100% original clean-room educational material.

import {
  EDUCATION_EUROPE_COUNTRIES,
  educationCountrySchoolYears
} from './education_all_country_subject_matrix.mjs';
import { canonicalPackGrade } from './curriculum_pack_protocol.mjs';
import { scienceGradeTopicPlan } from './science_grade_progression.mjs';
import { PHYSICS_EUROPE_REFERENCE, PHYSICS_EUROPE_REFERENCES } from './physics_europe_frameworks.mjs';
import { CHEMISTRY_EUROPE_REFERENCES } from './chemistry_country_alignment.mjs';
import { chemistryGradeTopicPlan } from './chemistry_school_years.mjs';
import { BIOLOGY_COUNTRY_REFERENCES, BIOLOGY_EUROPE_FALLBACK_SOURCE } from './biology_country_alignment.mjs';
import { ASTRONOMY_COUNTRY_EVIDENCE } from './astronomy_country_alignment.mjs';
import { PHYSICS_TOPICS } from './physics_curriculum.mjs';
import { CHEMISTRY_TOPICS } from './chemistry_curriculum.mjs';
import { CHEMISTRY_SPECIALTY_TOPICS } from './chemistry_advanced.mjs';
import { BIOLOGY_TOPICS, BIOLOGY_SPECIALTY_TOPICS } from './biology_curriculum.mjs';
import { ASTRONOMY_TOPICS } from './astronomy_curriculum.mjs';
import { physicsUniversityRoutes, physicsUniversityYears, PHYSICS_UNIVERSITY_EHEA_SOURCE } from './physics_university_europe.mjs';
import { PHYSICS_UNIVERSITY_ALL_COURSES, physicsUniversityCourseChoices } from './physics_university_study.mjs';
import { chemistryUniversityRoutes, chemistryUniversityYears } from './chemistry_university_europe.mjs';
import { CHEMISTRY_UNIVERSITY_CORE } from './chemistry_university_core.mjs';
import { CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS } from './chemistry_university_study.mjs';
import { biologyUniversityRoutes, biologyUniversityYears, biologyUniversityCourseChoices, BIOLOGY_UNIVERSITY_CYCLE_REFERENCE } from './biology_university_years.mjs';
import { astronomyUniversityRoutes, astronomyUniversityYears, astronomyUniversityCourseChoices } from './astronomy_university_courses.mjs';
import { PHYSICS_SPECIALIZATIONS } from './physics_curriculum.mjs';
import { CHEMISTRY_SPECIALIZATIONS } from './chemistry_advanced.mjs';
import { BIOLOGY_SPECIALIZATIONS } from './biology_curriculum.mjs';
import { ASTRONOMY_SPECIALIZATIONS } from './astronomy_curriculum.mjs';
import {
  scienceSchoolManualExample,
  scienceCorrelatedPackTextbooks
} from './science_textbook_correlation_2026.mjs';

const TOPIC_SPEC = Object.freeze({
  // Physics
  units: { ro: 'Mărimi fizice, unități SI și estimări', formula: 'x = x̄ ± Δx;  [v] = m·s⁻¹, [F] = kg·m·s⁻² = N', example: 'Conversia 72 km/h = 72 × 1000 m / 3600 s = 20 m/s; verificare dimensională înainte de calculul numeric.', lab: 'Măsurarea repetată a lungimii și timpului, media aritmetică și abaterea absolută medie.' },
  measurement: { ro: 'Măsurare experimentală, incertitudini și grafice', formula: 'σ_x̄ = s / √N;  y = a·x + b (pantă fizică cu unități)', example: 'Din Δx = 0,80 ± 0,02 m și Δt = 0,40 ± 0,01 s rezultă v = 2,00 m/s cu incertitudine relativă ≈ 3,5%.', lab: 'Trasarea dreptei de regresie cu bare de eroare și identificarea erorilor sistematice de zero.' },
  kinematics: { ro: 'Cinematică: poziție, viteză și accelerație', formula: 'x(t) = x₀ + v₀·t + ½a·t²;  v² = v₀² + 2a·Δx', example: 'Un mobil cu v₀ = 4 m/s și a = 2 m/s² parcurge în t = 5 s distanța Δx = 4·5 + ½·2·25 = 45 m (v = 14 m/s).', lab: 'Analiza graficelor x(t) și v(t): panta dă viteza/accelerația, iar aria de sub v(t) dă deplasarea.' },
  dynamics: { ro: 'Dinamică: legile lui Newton și impulsul', formula: '∑F⃗ = m·a⃗;  p⃗ = m·v⃗;  F_f ≤ μ_s·N', example: 'Pe plan orizontal, F = 18 N și F_f = 6 N pe m = 4 kg dau ∑F = 12 N ⇒ a = 12 / 4 = 3,0 m/s².', lab: 'Diagrama corpului liber (forțe reale pe axe ortogonale) și verificarea proporționalității a ∝ F/m.' },
  energy: { ro: 'Lucru mecanic, putere și conservarea energiei', formula: 'L = F·d·cos α;  E_c = ½m·v²;  E_p = m·g·h;  P = L/Δt', example: 'Căderea liberă fără frecări de la h = 5,0 m (g ≈ 9,8 m/s²) dă v = √(2gh) ≈ √98 ≈ 9,9 m/s, independent de masă.', lab: 'Bilanțul energetic pe plan înclinat: diferența E_p,i − E_c,f măsoară lucrul mecanic disipat prin frecare.' },
  fluids: { ro: 'Statica și dinamica fluidelor', formula: 'p = p₀ + ρ·g·h;  F_A = ρ_f·V_dez·g;  A₁v₁ = A₂v₂', example: 'La adâncimea h = 10 m în apă (ρ = 1000 kg/m³), suprapresiunea hidrostatică este ρgh ≈ 9,8×10⁴ Pa ≈ 0,97 atm.', lab: 'Determinarea densității unui solid prin dublă cântărire (în aer și scufundat complet în apă).' },
  heat: { ro: 'Fenomene termice, calorimetrie și schimbări de stare', formula: 'Q = m·c·ΔT;  Q_lat = m·L;  ∑Q_cedat + ∑Q_primit = 0', example: 'Încălzirea a m = 0,50 kg apă (c = 4180 J·kg⁻¹·K⁻¹) cu ΔT = 20 K cere Q = 0,50 × 4180 × 20 = 41,8 kJ.', lab: 'Bilanț calorimetric în vas izolat și identificarea palierului izoterm la topire sau fierbere.' },
  thermodynamics: { ro: 'Termodinamică: gazul ideal și principiile I–II', formula: 'p·V = ν·R·T;  ΔU = Q − L;  η_Carnot = 1 − T_r / T_c', example: 'Pentru ν = 2,0 mol gaz ideal la T = 300 K și V = 0,050 m³, p = 2·8,314·300 / 0,050 ≈ 9,98×10⁴ Pa.', lab: 'Reprezentarea transformărilor izoterme, izobare și izocore în coordonate (p, V) și calculul ariei L.' },
  electric: { ro: 'Electrostatică: câmp, potențial și capacitate', formula: 'F = k·|q₁q₂|/r²;  E⃗ = F⃗/q;  C = Q/U;  W_C = ½C·U²', example: 'Un condensator cu C = 100 μF încărcat la U = 20 V stochează Q = 2,0 mC și energia W = ½·10⁻⁴·400 = 0,020 J.', lab: 'Studiul curbei de descărcare RC și estimarea constantei de timp τ = R·C.' },
  circuits: { ro: 'Circuite de curent continuu și legile lui Kirchhoff', formula: 'I = U/R;  I = E/(R + r);  P = U·I = I²R;  ∑I_in = ∑I_out', example: 'Două rezistoare R₁ = 6 Ω și R₂ = 3 Ω în paralel au R_p = (6·3)/(6+3) = 2 Ω; la U = 12 V curentul total este 6 A.', lab: 'Caracteristica U–I a unui rezistor ohmic vs bec cu filament și măsurarea tensiunii electromotoare E și rezistenței interne r.' },
  electromagnetism: { ro: 'Câmp magnetic, forța Lorentz și inducția electromagnetică', formula: 'F⃗ = q·v⃗×B⃗;  F_Laplace = B·I·ℓ·sin α;  e = −dΦ_B/dt', example: 'O variație ΔΦ_B = 0,040 Wb în Δt = 0,020 s într-o bobină cu N = 50 spire induce |e_med| = 50·0,040/0,020 = 100 V.', lab: 'Verificarea regulii lui Lenz la apropierea și îndepărtarea unui magnet față de o bobină conectată la galvanometru.' },
  waves: { ro: 'Oscilații mecanice, unde și acustică', formula: 'T = 2π√(m/k);  T_p = 2π√(ℓ/g);  v = λ·f = λ/T', example: 'O undă sonoră în aer (v ≈ 340 m/s) de frecvență f = 680 Hz are lungimea de undă λ = 340 / 680 = 0,50 m.', lab: 'Determinarea accelerației gravitaționale g din panta graficului T² în funcție de lungimea pendulului ℓ.' },
  optics: { ro: 'Optică geometrică și ondulatorie', formula: 'n₁·sin i = n₂·sin r;  1/f = 1/d_o + 1/d_i;  d·sin θ = m·λ', example: 'O lentilă convergentă cu f = +10 cm și obiect la d_o = 30 cm formează imagine reală la d_i = 15 cm (mărire −0,5).', lab: 'Verificarea relației lentilelor subțiri pe bancul optic și observarea franjelor de difracție cu laser.' },
  modern: { ro: 'Fizică modernă: cuante, relativitate și nucleu', formula: 'E_foton = h·f = h·c/λ;  E_c,max = h·f − L_extr;  N(t) = N₀·2^(−t/T_½)', example: 'După 3 timpi de înjumătățire (t = 3·T_½), fracțiunea de nuclee radioactive rămase este 2⁻³ = 1/8 = 12,5%.', lab: 'Determinarea constantei lui Planck din tensiunea de stopare în efectul fotoelectric sau analiza spectrelor cu linii.' },

  // Chemistry
  fundamentals: { ro: 'Substanțe, amestecuri, mol și stoechiometrie de bază', formula: 'n = m / M = N / N_A;  w% = (m_diz / m_sol)·100', example: 'În m = 36,0 g de apă (M = 18,0 g/mol) se află n = 36,0 / 18,0 = 2,00 mol molecule H₂O (≈ 1,204×10²⁴ molecule).', lab: 'Separarea unui amestec eterogen/omogen prin filtrare și cristalizare, cu verificarea bilanțului de masă.' },
  atomic: { ro: 'Structura atomului, izotopi și configurații electronice', formula: 'A = Z + N;  A_r = ∑ x_i · A_i;  capacitate strat = 2n²', example: 'Clorul natural (75,8% ³⁵Cl și 24,2% ³⁷Cl) are masa atomică relativă A_r ≈ 0,758·35 + 0,242·37 ≈ 35,48.', lab: 'Interpretarea culorilor în flacără și corelarea tranzițiilor electronice cu poziția în sistemul periodic.' },
  periodic: { ro: 'Tabelul periodic și variația proprietăților periodice', formula: 'Z_ef = Z − σ;  tendințe pe perioadă/grupă pentru r_at, E_i, χ', example: 'În perioada a 3-a (Na → Cl), raza atomică scade, iar energia primară de ionizare crește în general cu Z_ef.', lab: 'Compararea reactivității metalelor și a caracterului acido-bazic al oxizilor de-a lungul unei perioade.' },
  bonding: { ro: 'Legături chimice, geometrie VSEPR și forțe intermoleculare', formula: 'Ordin de legătură;  μ⃗ = q·d⃗;  geometrii AX₂, AX₃, AX₄, AX₃E, AX₂E₂', example: 'CO₂ (AX₂ liniar) are legături polare dar moment dipolar total nul, pe când H₂O (AX₂E₂ unghiular, ~104,5°) este polară.', lab: 'Corelarea punctelor de fierbere, solubilității și conductibilității electrice cu tipul de rețea cristalină sau moleculară.' },
  reactions: { ro: 'Tipuri de reacții chimice, bilanț redox și calcul stoechiometric', formula: '∑ m_reactanți = ∑ m_produși;  n_e⁻(cedați) = n_e⁻(acceptați)', example: 'În arderea CH₄ + 2O₂ → CO₂ + 2H₂O, 0,50 mol CH₄ consumă 1,00 mol O₂ și produc 22,0 g CO₂.', lab: 'Identificarea reactivului limitant și calculul randamentului η = (m_practic / m_teoretic)·100%.' },
  inorganic: { ro: 'Chimie anorganică: oxizi, acizi, baze, săruri și complecși', formula: 'M_xO_y, hidroxizi, oxoacizi și reacții de schimb / precipitare', example: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq); ecuația ionică netă este Ag⁺(aq) + Cl⁻(aq) → AgCl(s).', lab: 'Recunoașterea ionilor în soluție apoasă prin reacții selective de precipitare și reguli de solubilitate.' },
  solutions: { ro: 'Soluții apoase, concentrație molară și diluție', formula: 'c_M = n / V_sol;  c₁·V₁ = c₂·V₂;  ρ = m_sol / V_sol', example: 'Diluarea a V₁ = 25,0 mL soluție 2,00 M la V₂ = 250,0 mL conduce la c₂ = 2,00 × 25,0 / 250,0 = 0,200 M.', lab: 'Prepararea exactă a unei soluții de concentrație molară cunoscută în balon cotat la menisc.' },
  acids: { ro: 'Acizi, baze, scara pH, soluții tampon și titrare', formula: 'pH = −log₁₀[H₃O⁺];  pH + pOH = 14 (25 °C);  pH = pK_a + log([A⁻]/[HA])', example: 'La neutralizarea a 20,0 mL HCl cu 25,0 mL NaOH 0,100 M, c(HCl) = 0,100 × 25,0 / 20,0 = 0,125 mol/L.', lab: 'Curba de titrare acido-bazică, determinarea punctului de echivalență și alegerea indicatorului potrivit.' },
  organic: { ro: 'Chimie organică: hidrocarburi, grupe funcționale și izomerie', formula: 'NES = (2C + 2 + N − H − X)/2;  serii omoloage și mecanisme de bază', example: 'Formula C₄H₈ are NES = 1, corespunzând alchenelor (1-butenă, cis/trans-2-butenă, izobutenă) sau cicloalcanilor.', lab: 'Distincția experimentală între hidrocarburi saturate și nesaturate și identificarea grupelor funcționale uzuale.' },
  physical: { ro: 'Termochimie, cinetică chimică și echilibru chimic', formula: 'ΔG° = ΔH° − T·ΔS° = −R·T·ln K;  v = k·[A]^m[B]^n;  k = A·e^(−E_a/RT)', example: 'Pentru N₂ + 3H₂ ⇌ 2NH₃ (ΔH° < 0), creșterea presiunii și scăderea moderată a temperaturii deplasează echilibrul spre NH₃.', lab: 'Măsurarea influenței concentrației și temperaturii asupra vitezei de reacție și verificarea principiului Le Chatelier.' },
  electrochem: { ro: 'Electrochimie: pile galvanice, potențial Nernst și electroliză', formula: 'E_cel° = E_catod° − E_anod°;  m = (M·I·t) / (z·F),  F ≈ 96 485 C/mol', example: 'În pila Daniell Zn|Zn²⁺||Cu²⁺|Cu, E° = +0,34 − (−0,76) = 1,10 V; la electroliza Cu²⁺ (z = 2), 0,10 mol e⁻ depun 0,050 mol Cu.', lab: 'Construirea unei micropile galvanice cu punte salină și compararea tensiunii măsurate cu seria potențialelor standard.' },
  analytical: { ro: 'Chimie analitică: gravimetrie, volumetrie și spectrofotometrie', formula: 'A = ε·b·c (Lambert–Beer);  eroare relativă și limită de detecție', example: 'Dacă la b = 1,00 cm și ε = 1,20×10⁴ L·mol⁻¹·cm⁻¹ se măsoară absorbanța A = 0,600, rezultă c = 5,00×10⁻⁵ mol/L.', lab: 'Construirea dreptei de etalonare A = f(c) cu martor (blank) și verificarea domeniului de liniaritate.' },
  biochemistry: { ro: 'Biochimie chimică: aminoacizi, glucide, lipide și cinetică enzimatică', formula: 'Legătura peptidică −CO−NH−;  v₀ = V_max·[S] / (K_M + [S])', example: 'Când concentrația substratului este [S] = K_M, viteza inițială a reacției enzimatice atinge exact v₀ = ½ V_max.', lab: 'Reacții de recunoaștere pentru glucide reducătoare și proteine și efectul pH/temperaturii asupra activității enzimatice.' },
  advanced: { ro: 'Sinteză chimică, chimie verde și structură moleculară avansată', formula: 'Economia atomică EA% = (M_produs_dorit / ∑ M_reactanți)·100', example: 'O reacție de adiție A + B → C are economie atomică teoretică de 100%, superioară substituțiilor cu subproduși stoechiometrici.', lab: 'Evaluarea unei rute de sinteză după randament, economie atomică, selectivitate și siguranță de laborator (GHS).' },

  // Biology
  cells: { ro: 'Biologie celulară: membrane, organite și diviziune celulară', formula: 'Raport arie/volum A/V = 3/r (sferă);  mitoză (2n → 2n) vs meioză (2n → n)', example: 'La o specie cu 2n = 46 cromozomi, celulele somatice rezultate prin mitoză păstrează 46 cromozomi, iar gameții au n = 23.', lab: 'Observarea microscopică a celulelor vegetale/animale, calculul măririi M = M_ob × M_oc și studiul plasmolizei.' },
  biomolecules: { ro: 'Biomolecule, bioenergetică celulară, respirație și fotosinteză', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O (ΔG°′ < 0, cuplaj ATP/ADP)', example: 'Oxidarea aerobă completă a glucozei furnizează de ~15 ori mai mult ATP per mol de glucoză decât fermentația anaerobă.', lab: 'Măsurarea ratei fotosintezei în funcție de iluminare sau a producerii de CO₂ în respirația celulară cu lot martor.' },
  anatomy: { ro: 'Anatomie și fiziologie integrată a sistemelor de organe', formula: 'DC = FC × VS (debit cardiac);  schimb gazos prin difuziune Fick J ∝ A·Δp/d', example: 'La FC = 70 bătăi/min și volum sistolic VS = 70 mL, debitul cardiac de repaus este DC = 4900 mL/min ≈ 4,9 L/min.', lab: 'Corelarea frecvenței cardiace și respiratorii înainte și după efort dozat, cu revenirea la linia de bază.' },
  genetics: { ro: 'Genetică mendeliană, moleculară și expresia genelor', formula: 'ADN → ARN → proteină;  Hardy–Weinberg p + q = 1,  p² + 2pq + q² = 1', example: 'Într-o încrucișare monohibridă Aa × Aa cu dominanță completă, raportul genotipic așteptat este 1 AA : 2 Aa : 1 aa (fenotipic 3:1).', lab: 'Construirea pătratului Punnett și a arborilor genealogici și testarea concordanței frecvențelor observate.' },
  evolution: { ro: 'Evoluție biologică, selecție naturală, speciație și filogenie', formula: 'Δp pe generații sub selecție, drift genetic, mutație și migrație', example: 'Dacă într-o populație la echilibru frecvența fenotipului recesiv q² = 0,04, atunci q = 0,20, p = 0,80 și heterozigoții 2pq = 0,32.', lab: 'Interpretarea arborilor filogenetici pe baza caracterelor derivate partajate (sinapomorfii) și a datelor moleculare.' },
  ecology: { ro: 'Ecologie: ecosisteme, cicluri biogeochimice și dinamica populațiilor', formula: 'dN/dt = r·N·(1 − N/K);  eficiența trofică η_trofic ≈ 10%', example: 'Dacă producătorii fixează 10 000 kJ/m²·an, consumatorii primari rețin ordinul a ~1000 kJ/m²·an, iar cei secundari ~100 kJ/m²·an.', lab: 'Eșantionarea biodiversității prin metoda pătratelor (quadrats) sau captura–marcare–recaptură (Lincoln–Petersen).' },
  microbes: { ro: 'Microbiologie, virusologie și mecanisme de imunitate', formula: 'N(t) = N₀ · 2^(t/g) (faza exponențială);  răspuns imun înnăscut și adaptativ', example: 'O cultură bacteriană cu timp de generație g = 30 min crește în 3 ore (6 diviziuni) de 2⁶ = 64 ori față de N₀.', lab: 'Interpretarea antibiogramei (diametrul zonei de inhibiție) și regulile stricte de asepsie și control negativ.' },
  plants: { ro: 'Biologia plantelor: structură, transport xilemic/floemic și fototropism', formula: 'Potențialul apei Ψ = Ψ_s + Ψ_p (apa circulă spre Ψ mai negativ)', example: 'Transpirația stomatală creează tensiune negativă în xilem (coeziune–tensiune), asigurând ascensiunea sevei brute.', lab: 'Estimarea ratei transpirației cu potometrul în condiții controlate de lumină, umiditate și curent de aer.' },
  homeostasis: { ro: 'Homeostazie, reglare neuro-endocrină și bucle de feedback', formula: 'Eroare e(t) = x(t) − x_setpoint ⇒ răspuns efector de semn opus (feedback negativ)', example: 'După o masă glucidică, insulina stimulează preluarea glucozei și glicogenogeneza; la post, glucagonul mobilizează glucoza hepatică.', lab: 'Analiza curbelor glicemice și a reflexelor somatice/vegetative ca sisteme biologice cu reglare în buclă închisă.' },
  methods: { ro: 'Metoda științifică în biologie, design experimental și biostatistică', formula: 'Ipoteză nulă H₀ vs H₁;  medie x̄, deviație standard s și loturi martor', example: 'Un experiment valid izolează variabila independentă, menține constante variabilele confuze și folosește replici biologice independente.', lab: 'Proiectarea unui protocol reproductibil (orbire, martor pozitiv/negativ, dimensiunea eșantionului și etica cercetării).' },

  // Astronomy
  solar: { ro: 'Sistemul Solar: planete telurice, gigante, corpuri mici și comparare fizică', formula: 'ρ = M / (4/3·πR³);  T_eq ≈ T_☉·√(R_☉/(2a))·(1 − A)^(1/4)', example: 'Densitatea medie a Pământului (≈ 5,51 g/cm³) indică nucleu metalic și manta silicatică, spre deosebire de Saturn (≈ 0,69 g/cm³).', lab: 'Construirea la scară dublă (mărimi vs distanțe orbitale în UA) și compararea temperaturii de echilibru cu efectul de seră.' },
  sky: { ro: 'Sfera cerească, coordonate, mișcări aparente, faze și eclipse', formula: 'h_max = 90° − |φ − δ|;  1/P_sin = |1/P_⊕ − 1/P_sid|', example: 'La latitudinea φ = 45° N, la solstițiul de vară (δ ≈ +23,4°), înălțimea meridiană maximă a Soarelui este h_max ≈ 68,4°.', lab: 'Măsurarea umbrei unui gnomon la amiaza solară locală pentru determinarea înălțimii Soarelui și a latitudinii.' },
  distances: { ro: 'Scara distanțelor cosmice: paralaxă, fotometrie și lumânări standard', formula: 'd(pc) = 1 / p(″);  m − M = 5·log₁₀(d / 10 pc) + A', example: 'O stea cu paralaxa p = 0,040″ se află la d = 25 pc (≈ 81,5 ani-lumină), cu modul de distanță neafectat de extincție m − M ≈ 1,99 mag.', lab: 'Calibrarea în trepte a scării distanțelor: radar planetar → paralaxă trigonometrică → cefeide → supernove Ia.' },
  gravity: { ro: 'Mecanică cerească: legile lui Kepler, gravitația și viteze orbitale', formula: 'T² = [4π² / G(M + m)]·a³;  v_c = √(GM/r);  v_ev = √2·v_c', example: 'Un satelit al lui Jupiter cu a = 4,22×10⁸ m și T = 1,77 zile permite determinarea masei lui Jupiter M_J ≈ 1,90×10²⁷ kg.', lab: 'Verificarea liniarității graficului log T în funcție de log a (panta 3/2) pentru sateliții galileeni sau planete.' },
  stars: { ro: 'Fizică stelară: spectre, diagrama Hertzsprung–Russell și evoluție', formula: 'L = 4πR²σT_ef⁴;  λ_max·T = 2,898×10⁻³ m·K;  τ_SP ∝ M / L', example: 'O stea cu aceeași T_ef ca Soarele dar L = 100 L☉ are raza R = √100 R☉ = 10 R☉, situându-se în regiunea gigantelor pe diagrama H–R.', lab: 'Clasificarea unei populații stelare în diagrama culoare–magnitudine și estimarea vârstei roiului din punctul de desprindere.' },
  galaxies: { ro: 'Calea Lactee, morfologia galaxiilor, curbe de rotație și materie întunecată', formula: 'M(<r) ≈ r·v²(r) / G;  clasificare Hubble și dinamică galactică', example: 'La r = 8,2 kpc și v_c ≈ 230 km/s în Calea Lactee, masa cuprinsă în interiorul orbitei solare este de ordinul ~10¹¹ M☉.', lab: 'Compararea curbei de rotație kepleriene (v ∝ r⁻¹/²) cu curba plată observată în discul exterior al galaxiilor spirale.' },
  observations: { ro: 'Instrumente astronomice: telescoape, rezoluție, detectoare CCD și raport S/N', formula: 'θ_min = 1,22·λ/D;  M_tel = f_ob / f_oc;  SNR ∝ √t_exp (regim dominat de fotoni)', example: 'Dublarea diametrului D al obiectivului crește aria colectoare de 4 ori și îmbunătățește limita teoretică de difracție de 2 ori.', lab: 'Reducerea fotometrică de bază a unei imagini CCD (bias, dark, flat-field) și fotometrie diferențială cu stele de comparație.' },
  cosmology: { ro: 'Cosmologie observațională: legea Hubble–Lemaître, CMB și evoluția Universului', formula: 'v ≈ H₀·d (z ≪ 1);  1 + z = λ_obs / λ_em = a(t₀)/a(t_em);  ρ_c = 3H²/(8πG)', example: 'Radiația cosmică de fond (T₀ ≈ 2,725 K astăzi) avea la epoca recombinării (z ≈ 1100) temperatura T ≈ 2,725 × 1101 ≈ 3000 K.', lab: 'Construirea diagramei Hubble din deplasări spectrale spre roșu și distanțe de luminozitate și discutarea incertitudinii lui H₀.' },
  exoplanets: { ro: 'Exoplanete: metoda tranzitului, viteze radiale și caracterizare atmosferică', formula: 'ΔF/F ≈ (R_p / R_*)²;  K_* ∝ M_p·sin i · M_*^(−2/3) · P^(−1/3)', example: 'O planetă de dimensiunea lui Jupiter (R_p ≈ 0,10 R☉) produce în fața unei stele solare o scădere relativă de flux ΔF/F ≈ 1,0%.', lab: 'Determinarea perioadei P și a raportului R_p/R_* dintr-o curbă de lumină de tranzit și combinarea cu viteza radială pentru densitatea ρ_p.' }
});

function resolveTopicSpec(subject, topicKey) {
  if (TOPIC_SPEC[topicKey]) return TOPIC_SPEC[topicKey];
  if (subject === 'physics') {
    if (/quantum|modern/.test(topicKey)) return TOPIC_SPEC.modern;
    if (/relativity|astro/.test(topicKey)) return TOPIC_SPEC.kinematics;
    if (/therm|stat|condensed/.test(topicKey)) return TOPIC_SPEC.thermodynamics;
    if (/elec|mag|circuit/.test(topicKey)) return TOPIC_SPEC.electromagnetism;
    if (/opt|wave|osc/.test(topicKey)) return TOPIC_SPEC.optics;
    if (/lab|measure/.test(topicKey)) return TOPIC_SPEC.measurement;
    return TOPIC_SPEC.dynamics;
  }
  if (subject === 'chemistry') {
    if (/org|poly|bio/.test(topicKey)) return TOPIC_SPEC.organic;
    if (/phys|therm|kin|quant/.test(topicKey)) return TOPIC_SPEC.physical;
    if (/anal|spec|lab/.test(topicKey)) return TOPIC_SPEC.analytical;
    if (/elec/.test(topicKey)) return TOPIC_SPEC.electrochem;
    if (/acid|sol/.test(topicKey)) return TOPIC_SPEC.acids;
    return TOPIC_SPEC.bonding;
  }
  if (subject === 'biology') {
    if (/gen|mol|evol/.test(topicKey)) return TOPIC_SPEC.genetics;
    if (/eco|env/.test(topicKey)) return TOPIC_SPEC.ecology;
    if (/anat|phys|neuro|homeo/.test(topicKey)) return TOPIC_SPEC.anatomy;
    if (/micr|imm/.test(topicKey)) return TOPIC_SPEC.microbes;
    if (/plant/.test(topicKey)) return TOPIC_SPEC.plants;
    return TOPIC_SPEC.cells;
  }
  if (/cosmo/.test(topicKey)) return TOPIC_SPEC.cosmology;
  if (/galax/.test(topicKey)) return TOPIC_SPEC.galaxies;
  if (/exo|planet/.test(topicKey)) return TOPIC_SPEC.exoplanets;
  if (/instr|obs/.test(topicKey)) return TOPIC_SPEC.observations;
  if (/dyn|grav/.test(topicKey)) return TOPIC_SPEC.gravity;
  return TOPIC_SPEC.stars;
}

function resolvePackSource(subject, country, stage) {
  if (stage === 'advanced') {
    if (subject === 'physics') return PHYSICS_UNIVERSITY_EHEA_SOURCE;
    if (subject === 'biology') return BIOLOGY_UNIVERSITY_CYCLE_REFERENCE;
    return 'https://ehea.info/page-three-cycle-system';
  }
  if (subject === 'physics') return PHYSICS_EUROPE_REFERENCES[country]?.source || PHYSICS_EUROPE_REFERENCE;
  if (subject === 'chemistry') return CHEMISTRY_EUROPE_REFERENCES[country]?.source || PHYSICS_EUROPE_REFERENCE;
  if (subject === 'biology') return BIOLOGY_COUNTRY_REFERENCES[country]?.source || BIOLOGY_EUROPE_FALLBACK_SOURCE;
  return ASTRONOMY_COUNTRY_EVIDENCE[country]?.source || PHYSICS_EUROPE_REFERENCE;
}

function stagePedagogicalCalibration(stage, grade) {
  if (stage === 'beginner') {
    return `Calibrare pentru învățământul primar (${grade}): observație directă, vocabular accesibil vârstei, măsurări simple cu instrumente uzuale și explicații cauzale clare fără formalism algebric excesiv.`;
  }
  if (stage === 'lower') {
    return `Calibrare pentru gimnaziu / secundar inferior (${grade}): definirea riguroasă a mărimilor și unităților SI, proporționalități, reprezentări grafice și rezolvarea pas cu pas a problemelor cu un singur model dominant.`;
  }
  if (stage === 'medium') {
    return `Calibrare pentru liceu / secundar superior (${grade}): modelare cantitativă completă, condiții de aplicabilitate ale legilor, propagarea raționamentului pe mai multe etape și interpretarea critică a datelor experimentale.`;
  }
  return `Calibrare universitară de licență (${grade}, ciclul I EHEA): fundamentare teoretică generală, deducție din principii de conservare/echilibru, analiză dimensională, estimare de ordin de mărime și reproductibilitate experimentală.`;
}

function buildPackTopicLesson({ subject, country, stage, displayGrade, topicKey, programmeName, textbookTitle }) {
  const spec = resolveTopicSpec(subject, topicKey);
  const calibration = stagePedagogicalCalibration(stage, displayGrade);
  const bibLine = textbookTitle
    ? `Reper bibliografic și curricular (${country} · ${displayGrade}): ${textbookTitle}. Materialul de mai jos este redactat integral original și urmărește competențele generale ale temei, fără a reproduce text din manuale comerciale.`
    : `Reper academic general (${country} · ${displayGrade}, ${programmeName}): sinteză universitară originală pentru trunchiul comun de științe, independentă de un curs comercial unic.`;

  const title = `${spec.ro} · Sinteză și aplicații (${country} ${displayGrade})`;
  const summary = `Fișă completă pentru ${spec.ro.toLowerCase()} (${country}, ${displayGrade}): formulă și unități SI, exemplu rezolvat și investigație.`;
  const body = [
    `1. Încadrare și calibrare (${country} · ${displayGrade})`,
    bibLine,
    calibration,
    '',
    `2. Concepte, formulă, simboluri și unități SI`,
    `Temă: ${spec.ro}.`,
    `Formulă / relație: ${spec.formula}.`,
    `Regulă: precizează sistemul studiat, condițiile de valabilitate ale modelului, semnificația fiecărui simbol și unitățile coerente în Sistemul Internațional (SI) înainte de substituția numerică.`,
    '',
    `3. Exemplu cantitativ rezolvat și controlul rezultatului`,
    `Aplicație: ${spec.example}`,
    `Verificare: controlează ordinul de mărime, semnul fizic/chimic sau sensul biologic/astronomic, comportarea la limită și cifrele semnificative.`,
    '',
    `4. Investigație practică și erori de evitat`,
    `Activitate: ${spec.lab}`,
    `Atenție: nu confunda unitățile uzuale cu SI, nu aplica formula în afara ipotezelor modelului și păstrează martorul experimental / incertitudinea.`,
    '',
    `5. Autoverificare rapidă`,
    `• Explică ce fenomen descrie relația „${spec.formula}” și când nu se aplică forma simplificată.`,
    `• Recalculează exemplul dublând o dată de intrare și compară cu predicția calitativă.`,
    `• Indică mărimea măsurată direct, mărimea dedusă și sursa principală de eroare.`
  ].join('\n');

  return {
    id: `${subject}-${country.toLowerCase()}-${String(displayGrade).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${topicKey}-pack`,
    title,
    summary,
    body
  };
}

function universityTopicKeysForSubjectYear(subject, yearNum) {
  const y = Number(yearNum) || 1;
  if (subject === 'physics') {
    const keys = new Set(PHYSICS_TOPICS.map(t => t.id));
    for (const sp of PHYSICS_SPECIALIZATIONS) {
      for (const c of physicsUniversityCourseChoices({ year: y, specialty: sp.id })) {
        if (c?.topic) keys.add(c.topic);
      }
    }
    return [...keys];
  }
  if (subject === 'chemistry') {
    const keys = new Set(CHEMISTRY_TOPICS.filter(t => !t.specialty).map(t => t.id));
    for (const c of CHEMISTRY_UNIVERSITY_CORE.filter(x => x.year === y)) {
      if (c.topic) keys.add(c.topic);
    }
    for (const sp of CHEMISTRY_SPECIALIZATIONS) {
      const specList = CHEMISTRY_SPECIALTY_TOPICS.filter(x => x.specialty === sp.id);
      specList.forEach((x, idx) => {
        if (CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS[idx] === y) keys.add(x.id);
      });
    }
    return [...keys];
  }
  if (subject === 'biology') {
    const keys = new Set(BIOLOGY_TOPICS.filter(t => !t.specialty).map(t => t.id));
    const allBioTopics = [...BIOLOGY_TOPICS, ...BIOLOGY_SPECIALTY_TOPICS];
    for (const sp of BIOLOGY_SPECIALIZATIONS) {
      for (const c of biologyUniversityCourseChoices({
        year: y,
        years: Math.max(4, y),
        specialty: sp.id,
        topics: allBioTopics,
        specializations: BIOLOGY_SPECIALIZATIONS
      })) {
        if (c?.id) keys.add(c.id);
      }
    }
    if (y >= 3) keys.add('biology-capstone');
    return [...keys];
  }
  const keys = new Set(ASTRONOMY_TOPICS.filter(t => !t.specialty).map(t => t.id));
  for (const sp of ASTRONOMY_SPECIALIZATIONS) {
    for (const c of astronomyUniversityCourseChoices({
      year: y,
      years: Math.max(4, y),
      specialty: sp.id,
      topics: ASTRONOMY_TOPICS,
      specializations: ASTRONOMY_SPECIALIZATIONS
    })) {
      if (c?.id) keys.add(c.id);
    }
  }
  if (y >= 3) keys.add('astronomy-capstone');
  return [...keys];
}

function universityYearsForSubjectCountry(subject, country) {
  const pair = subject === 'physics'
    ? [physicsUniversityRoutes, physicsUniversityYears]
    : subject === 'chemistry'
      ? [chemistryUniversityRoutes, chemistryUniversityYears]
      : subject === 'biology'
        ? [biologyUniversityRoutes, biologyUniversityYears]
        : [astronomyUniversityRoutes, astronomyUniversityYears];
  const [routesFn, yearsFn] = pair;
  const seen = new Map();
  for (const r of routesFn(country)) {
    for (const y of yearsFn(country, r.id)) {
      if (y?.id && !seen.has(y.id)) seen.set(y.id, y);
    }
  }
  return [...seen.values()];
}

export function buildAllScienceDecoupledPacks() {
  const packs = [];

  for (const subject of ['physics', 'chemistry', 'biology', 'astronomy']) {
    const schoolStagePairs = (subject === 'physics' || subject === 'chemistry')
      ? [['lower', 'lower'], ['medium', 'upper']]
      : [['beginner', 'primary'], ['lower', 'lower'], ['medium', 'upper']];

    const subjectTopics = subject === 'physics'
      ? PHYSICS_TOPICS
      : subject === 'chemistry'
        ? CHEMISTRY_TOPICS
        : subject === 'biology'
          ? BIOLOGY_TOPICS
          : ASTRONOMY_TOPICS;
    const fallbackSchoolTopics = subjectTopics.filter(t => !t.specialty).slice(0, 5).map(t => t.id);

    // 1. School-stage packs across all 49 national European school systems (`VA` stays external-curriculum)
    for (const country of EDUCATION_EUROPE_COUNTRIES) {
      if (country === 'VA') continue;
      for (const [packStage, schoolStage] of schoolStagePairs) {
        const years = educationCountrySchoolYears(country, packStage)?.years || [];
        for (const yearObj of years) {
          const displayGrade = String(yearObj.id);
          const plan = scienceGradeTopicPlan({
            country,
            subject,
            stage: schoolStage,
            grade: displayGrade,
            years,
            topics: subjectTopics
          });
          if (plan?.status === 'not-offered' || plan?.status === 'invalid-selection') continue;
          if (!Array.isArray(plan?.topics) || !plan.topics.length) continue;

          const topicSet = new Set(plan.topics.map(t => t.id).filter(Boolean));
          if (subject === 'chemistry' && schoolStage === 'upper') {
            const upperChem = chemistryGradeTopicPlan(
              { country, stage: 'upper', grade: displayGrade, years, topics: CHEMISTRY_TOPICS },
              scienceGradeTopicPlan
            );
            for (const t of upperChem?.topics || []) if (t?.id) topicSet.add(t.id);
          } else if (subject === 'chemistry' && schoolStage === 'lower' && country !== 'RO') {
            for (const t of CHEMISTRY_TOPICS.filter(x => !x.specialty && x.minLevel === 'beginner')) topicSet.add(t.id);
          } else if (subject === 'physics' && schoolStage === 'upper') {
            for (const t of PHYSICS_TOPICS.filter(x => !x.specialty)) topicSet.add(t.id);
          }
          const topicIds = [...topicSet];
          const textbooks = scienceCorrelatedPackTextbooks(subject, country, packStage, displayGrade);
          const manualExample = scienceSchoolManualExample(subject, country, packStage, displayGrade);
          const textbookTitle = textbooks[0]?.title || '';
          const programmeName = textbooks[0]?.syllabus || `${subject} (${country})`;

          const lessonsByTopic = {};
          for (const topicKey of topicIds) {
            lessonsByTopic[topicKey] = [
              buildPackTopicLesson({
                subject,
                country,
                stage: packStage,
                displayGrade,
                topicKey,
                programmeName,
                textbookTitle
              })
            ];
          }

          packs.push({
            schema: 'mypocketai-curriculum-pack/v1',
            schoolYear: '2026/27',
            subject,
            country,
            stage: packStage,
            grade: canonicalPackGrade(displayGrade, packStage),
            displayGrade,
            status: plan?.status || 'advisory-progression',
            source: resolvePackSource(subject, country, packStage),
            manualExample,
            textbooks,
            lessonsByTopic
          });
        }
      }
    }

    // 2. University (`advanced`) general undergraduate packs across all 50 / 50 European countries
    for (const country of EDUCATION_EUROPE_COUNTRIES) {
      const uniYears = universityYearsForSubjectCountry(subject, country);
      for (const y of uniYears) {
        const displayGrade = String(y.id);
        const yearNum = Number(displayGrade.replace('univ-', '')) || 1;
        const uniTopicKeys = universityTopicKeysForSubjectYear(subject, yearNum);
        const lessonsByTopic = {};
        for (const topicKey of uniTopicKeys) {
          lessonsByTopic[topicKey] = [
            buildPackTopicLesson({
              subject,
              country,
              stage: 'advanced',
              displayGrade,
              topicKey,
              programmeName: 'EHEA First-Cycle Bachelor Science Core',
              textbookTitle: ''
            })
          ];
        }
        packs.push({
          schema: 'mypocketai-curriculum-pack/v1',
          schoolYear: '2026/27',
          subject,
          country,
          stage: 'advanced',
          grade: canonicalPackGrade(displayGrade, 'advanced'),
          displayGrade,
          status: 'ehea-general-bachelor-core',
          source: resolvePackSource(subject, country, 'advanced'),
          manualExample: null,
          textbooks: [],
          lessonsByTopic
        });
      }
    }
  }

  return packs;
}

export const SCIENCE_DECOUPLED_CURRICULUM_PACKS = Object.freeze(buildAllScienceDecoupledPacks());
