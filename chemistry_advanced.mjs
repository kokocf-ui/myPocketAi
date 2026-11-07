// University-level Chemistry: curated theory, specialist pathways and independently verified calculations.
// Educational use only. Clinical examples are not prescriptions or patient-specific advice.
// Each advanced pathway has four distinct chapters and reuses shared chemistry chapters without copying them.
export const CHEMISTRY_SPECIALIZATIONS = Object.freeze([
 {id:'general',ro:'Chimie generală avansată',en:'Advanced general chemistry',core:['advanced','physical','analytical']},
 {id:'pharmacy',ro:'Chimie farmaceutică',en:'Pharmaceutical chemistry',core:['organic','analytical','biochemistry']},
 {id:'medical',ro:'Chimie medicinală și biochimie clinică',en:'Medicinal and clinical biochemistry',core:['biochemistry','acids','analytical']},
 {id:'analytical',ro:'Chimie analitică instrumentală',en:'Instrumental analytical chemistry',core:['analytical','solutions','electrochem']},
 {id:'industrial',ro:'Chimie industrială și materiale',en:'Industrial and materials chemistry',core:['physical','organic','electrochem']},
 {id:'environment',ro:'Chimia mediului',en:'Environmental chemistry',core:['inorganic','solutions','analytical']},
 {id:'computational',ro:'Chimie computațională',en:'Computational chemistry',core:['advanced','bonding','physical']}
]);
// Chapter rows: title, scientifically bounded explanation, governing formula or scientific notation.
// Equations are educational relations with all implicit conditions described in their explanation.
const CHAPTERS = [
 {id:'gen_quantum',specialty:'general',ro:'Structură cuantică și spectre',en:'Quantum structure and spectra',lessons:[
 ['Funcția de undă','Starea cuantică este reprezentată de o funcție de undă; modulul său pătrat descrie densitatea de probabilitate.','ρ=|ψ|²'],
 ['Relația de Broglie','Lungimea de undă asociată unei particule cu impuls p este invers proporțională cu impulsul.','λ=h/p'],
 ['Principiul de incertitudine','Dispersionarea poziției și impulsului pe aceeași direcție are o limită inferioară.','Δx·Δp≥ℏ/2']
 ]},
 {id:'gen_thermo',specialty:'general',ro:'Termodinamică chimică avansată',en:'Advanced chemical thermodynamics',lessons:[
 ['Energia liberă Gibbs în procese spontane','La temperatură și presiune constante, ΔG negativ indică direcția spontană în condițiile considerate.','ΔG=ΔH−TΔS'],
 ['Legătura Gibbs și echilibru','La echilibru, energia standard Gibbs este legată de constanta de echilibru K pentru aceeași temperatură.','ΔG°=−RT ln K'],
 ['Potențialul chimic și activitatea','Potențialul chimic al unei specii depinde de activitatea sa, nu doar de concentrația brută.','μ=μ°+RT ln a']
 ]},
 {id:'gen_kinetics',specialty:'general',ro:'Cinetică și mecanisme',en:'Kinetics and mechanisms',lessons:[
 ['Legea Arrhenius','Pentru un comportament Arrhenius pe un interval de temperatură, constanta vitezei depinde exponențial de 1/T.','k=A·exp(−Ea/RT)'],
 ['Legea integrată de ordin întâi','Pentru consumul unui reactant cu cinetică de ordin întâi, logaritmul concentrației variază liniar în timp.','ln([A]t/[A]0)=−kt'],
 ['Etapa determinantă de viteză','Un mecanism trebuie dedus din dovezi experimentale; ecuația globală nu determină singură legea vitezei.','v=k·[A]^m·[B]^n (experimental)']
 ]},
 {id:'gen_coordination',specialty:'general',ro:'Compuși de coordinație',en:'Coordination compounds',lessons:[
 ['Ligand și sferă de coordinație','Un ligand donează o pereche de electroni către un centru metalic; numărul de coordinație reflectă vecinii donori.','M←:L'],
 ['Despicarea câmpului cristalin','Într-un complex octaedric, orbitalii d se separă energetic în seturile t₂g și e_g.','Δo=E(e_g)−E(t₂g)'],
 ['Izomeria de coordinație','Geometriile diferite pot genera izomeri cis/trans și izomeri optici, în funcție de structura complexului.','cis / trans']
 ]},
 {id:'pharm_design',specialty:'pharmacy',ro:'Descoperirea și proiectarea moleculelor',en:'Drug discovery and molecular design',lessons:[
 ['Relații structură–activitate','Schimbarea unei grupe funcționale poate modifica afinitatea, selectivitatea sau proprietățile fizico-chimice; efectul se verifică experimental.','SAR: structură ↔ activitate'],
 ['Lipofilicitate și distribuție','Coeficientul de partiție octanol–apă descrie un echilibru; logP nu substituie testarea absorbției.','logP=log10([X]octanol/[X]apă)'],
 ['Aciditate și ionizare','Pentru un acid monoprotic, raportul dintre baza conjugată și acid depinde de pH și pKa.','pH=pKa+log10([A⁻]/[HA])']
 ]},
 {id:'pharm_adme',specialty:'pharmacy',ro:'Proprietăți ADME',en:'ADME properties',lessons:[
 ['Absorbție și biodisponibilitate','Biodisponibilitatea sistemică este influențată de formulare, absorbție și metabolizare presistemică.','F=AUCpo·Div/(AUCiv·Dpo) (condiții comparabile)'],
 ['Legarea de proteine','Fracția liberă este proporția nelegată de proteine în compartimentul examinat, la echilibru.','fu=C_liber/C_total'],
 ['Clearance farmacocinetic','Clearance-ul este o relație de flux/concentrație într-un model farmacocinetic definit.','CL=R_eliminare/C_plasmatică']
 ]},
 {id:'pharm_quality',specialty:'pharmacy',ro:'Controlul calității medicamentelor',en:'Medicinal product quality control',lessons:[
 ['Testarea identității','Identificarea unui compus necesită metode discriminatorii validate și substanțe de referință adecvate.','identitate ≠ puritate'],
 ['Puritate cromatografică','Aria unui vârf cromatografic nu este automat concentrație fără calibrare și corecții de răspuns.','A≈k·c (în domeniul calibrat)'],
 ['Validarea metodei','Precizia, acuratețea, selectivitatea și domeniul de măsură se evaluează distinct.','recuperare%=100·măsurat/referință']
 ]},
 {id:'pharm_stability',specialty:'pharmacy',ro:'Stabilitate și formulare',en:'Stability and formulation',lessons:[
 ['Degradare de ordin întâi','Pentru o degradare de ordin întâi, concentrația se reduce exponențial în timp.','C(t)=C0·e^(−kt)'],
 ['Timpul de înjumătățire','Pentru degradare de ordin întâi, timpul de înjumătățire nu depinde de concentrația inițială.','t½=ln2/k'],
 ['Excipienți și compatibilitate','Compatibilitatea excipient–substanță activă trebuie evaluată experimental la condiții de depozitare definite.','compatibilitate: studiu experimental']
 ]},
 {id:'med_enzyme',specialty:'medical',ro:'Enzime și metabolism',en:'Enzymes and metabolism',lessons:[
 ['Modelul Michaelis–Menten','Pentru o enzimă cu cinetică Michaelis–Menten în regim inițial și condițiile modelului, viteza crește până la saturație.','v=Vmax·[S]/(Km+[S])'],
 ['Inhibiție competitivă','Un inhibitor competitiv ideal crește Km aparent fără modificarea Vmax în modelul clasic.','Km,app=Km·(1+[I]/Ki)'],
 ['Cuplarea reacțiilor','O reacție nefavorabilă poate fi cuplată cu una favorabilă; energia liberă totală este aditivă.','ΔG_total=ΣΔGi']
 ]},
 {id:'med_acidbase',specialty:'medical',ro:'Echilibre acido-bazice biologice',en:'Biological acid-base equilibria',lessons:[
 ['Tamponul bicarbonat','Perechea CO₂ dizolvat/HCO₃⁻ contribuie major la controlul pH-ului sanguin în condiții fiziologice.','pH=pKa+log([HCO₃⁻]/[CO₂ dizolvat])'],
 ['Capacitatea tampon','O soluție tampon rezistă variației de pH în jurul pKa, cu limite dependente de concentrație.','β=dn_bază/dpH'],
 ['Interpretarea gazelor sanguine','Evaluarea pH, CO₂ și bicarbonatului este clinică și necesită date pacient, intervale de referință și context.','pH, pCO₂, [HCO₃⁻]']
 ]},
 {id:'med_biomarkers',specialty:'medical',ro:'Biomarkeri și chimie clinică',en:'Biomarkers and clinical chemistry',lessons:[
 ['Intervale de referință','Un interval de referință descrie distribuția într-o populație definită; nu stabilește singur diagnosticul.','referință ≠ prag diagnostic'],
 ['Calibrarea analizorului','Un rezultat biochimic se raportează folosind trasabilitate metrologică, control intern și unități standard.','y=a·x+b (calibrare liniară)'],
 ['Sensibilitate și specificitate','Sensibilitatea și specificitatea sunt măsuri distincte de clasificare ale unui test într-o populație definită.','Se=TP/(TP+FN); Sp=TN/(TN+FP)']
 ]},
 {id:'med_redox',specialty:'medical',ro:'Stres oxidativ și semnalizare',en:'Oxidative stress and signalling',lessons:[
 ['Perechi redox','Potențialul unei perechi redox depinde de activități și de temperatură prin ecuația Nernst.','E=E°−(RT/nF)·ln Q'],
 ['Glutation redus și oxidat','Raportul dintre formele GSH și GSSG este un indicator redox în condiții experimentale definite.','2GSH ⇌ GSSG+2H⁺+2e⁻'],
 ['Radicali liberi','Un radical conține cel puțin un electron nepereche; reactivitatea depinde de specie și contextul molecular.','R·']
 ]},
 {id:'ana_spectra',specialty:'analytical',ro:'Spectroscopie și metode instrumentale',en:'Spectroscopy and instrumentation',lessons:[
 ['Legea Beer–Lambert','În soluții omogene în domeniu liniar, absorbanța depinde de concentrație și lungimea traseului optic.','A=ε·b·c'],
 ['Spectroscopie IR','Benzile IR corespund tranzițiilor vibraționale active pentru variația momentului dipolar.','ν≈(1/2π)·√(k/μ)'],
 ['Rezonanță magnetică nucleară','Deplasarea chimică RMN este raportată relativ la o referință și depinde de mediul electronic local.','δ(ppm)=10⁶·(ν−νref)/ν0']
 ]},
 {id:'ana_chrom',specialty:'analytical',ro:'Cromatografie și separări',en:'Chromatography and separations',lessons:[
 ['Factorul de retenție','În cromatografie, k exprimă retenția relativă la timpul mort tM al sistemului.','k=(tR−tM)/tM'],
 ['Rezoluție cromatografică','Rezoluția aproximată prin timpii de retenție și lățimile vârfurilor exprimă separarea a două benzi.','Rs=2(tR2−tR1)/(w1+w2)'],
 ['Curba de calibrare','O calibrare validată transformă un semnal în concentrație într-un domeniu justificat.','semnal=a·c+b']
 ]},
 {id:'ana_titration',specialty:'analytical',ro:'Titrări și echilibre analitice',en:'Titrations and equilibria',lessons:[
 ['Punct de echivalență','La echivalență, cantitățile de titrant și analit respectă raportul stoechiometric al reacției.','nA/νA=nB/νB'],
 ['Standardizare','Concentrația unui titrant poate fi stabilită față de un standard primar stabil și pur.','c=n/V'],
 ['Erori sistematice','Un efect constant al instrumentului sau metodei poate produce un bias ce nu dispare prin repetare.','bias=medie−valoare_referință']
 ]},
 {id:'ana_quality',specialty:'analytical',ro:'Metrologie și validare',en:'Metrology and validation',lessons:[
 ['Incertitudine de măsurare','Incertitudinea cuantifică dispersia valorilor ce pot fi atribuite măsurandului într-un model declarat.','u_c²=Σ(cᵢ·uᵢ)² (variabile necorelate)'],
 ['Limită de detecție','LOD indică un semnal detectabil potrivit procedurii; nu garantează cuantificare precisă.','LOD≈3.3σ/S (model convențional)'],
 ['Repetabilitate','Deviația standard relativă poate descrie precizia unei serii de măsurări pozitive comparabile.','RSD%=100·s/x̄']
 ]},
 {id:'ind_reactors',specialty:'industrial',ro:'Reactoare și bilanțuri',en:'Reactors and balances',lessons:[
 ['Bilanțul de materie','Într-un volum de control, acumularea este egală cu intrările minus ieșirile plus generarea netă.','acumulare=in−out+generare'],
 ['Reactor continuu ideal amestecat','La staționar, bilanțul CSTR pentru reactantul A ține seama de debit și viteza de reacție.','F_A0−F_A+V·r_A=0'],
 ['Conversie chimică','Conversia unui reactant definește fracția din alimentare care a reacționat.','X_A=(F_A0−F_A)/F_A0']
 ]},
 {id:'ind_catalysis',specialty:'industrial',ro:'Cataliză și procese',en:'Catalysis and processes',lessons:[
 ['Rolul catalizatorului','Catalizatorul modifică viteza printr-o cale cinetică alternativă, fără să schimbe constanta de echilibru la aceeași temperatură.','K_eq neschimbat la T fixă'],
 ['Selectivitate','Selectivitatea compară formarea produsului dorit cu produșii concurenți, pe o bază definită.','S=mol produs dorit/mol produs secundar'],
 ['Transfer de masă','Difuzia moleculară într-un mediu simplu poate fi aproximată prin prima lege a lui Fick.','J=−D·∂c/∂x']
 ]},
 {id:'ind_polymers',specialty:'industrial',ro:'Polimeri și macromolecule',en:'Polymers and macromolecules',lessons:[
 ['Grad de polimerizare','Numărul mediu de unități repetitive reprezintă un descriptor al lanțului macromolecular.','DP_n≈M_n/M_0'],
 ['Dispersitate','Dispersitatea descrie distribuția maselor molare ale lanțurilor, nu puritatea materialului.','Đ=M_w/M_n'],
 ['Tranziția vitroasă','Tg descrie o tranziție de mobilitate în regiunile amorfe; depinde de compoziție și istoric termic.','Tg (temperatură de tranziție vitroasă)']
 ]},
 {id:'ind_materials',specialty:'industrial',ro:'Chimia materialelor',en:'Materials chemistry',lessons:[
 ['Defecte cristaline','Vacanțele și interstițialii influențează difuzia, proprietățile electrice și mecanice.','defecte punctuale: V, I'],
 ['Semiconductori dopați','Impuritățile dopante pot schimba densitatea purtătorilor într-un semiconductor.','n·p≈n_i² (echilibru nedegenerat)'],
 ['Corodarea electrochimică','Corodarea poate rezulta din reacții anodice și catodice cu transfer de electroni.','M→Mⁿ⁺+ne⁻']
 ]},
 {id:'env_water',specialty:'environment',ro:'Chimia apei',en:'Water chemistry',lessons:[
 ['Duritatea apei','Duritatea totală este asociată predominant cu Ca²⁺ și Mg²⁺ și se exprimă prin convenții de echivalență.','duritate ≈ contribuții Ca²⁺+Mg²⁺'],
 ['Oxigen dizolvat','Concentrația oxigenului dizolvat depinde de temperatură, presiune și transfer de masă.','C_O2=f(T,p,salinitate)'],
 ['Cererea chimică de oxigen','CCO cuantifică echivalentul oxidabil în condițiile metodei analitice definite.','CCO: mg O₂/L']
 ]},
 {id:'env_air',specialty:'environment',ro:'Chimie atmosferică',en:'Atmospheric chemistry',lessons:[
 ['Formarea ozonului troposferic','Ozonul la nivelul solului se formează prin reacții fotochimice cu NOx și compuși organici volatili.','NO₂+hν→NO+O'],
 ['Aerosoli secundari','Oxidarea precursorilor gazoși poate forma compuși cu volatilitate mică ce contribuie la aerosol.','gaze → condensabili → particule'],
 ['Depunere acidă','Precursorii SO₂ și NOx se pot oxida spre specii acide și depuneri umede sau uscate.','SO₂, NOx → acizi']
 ]},
 {id:'env_soil',specialty:'environment',ro:'Soluri și contaminanți',en:'Soils and contaminants',lessons:[
 ['Sorbție pe particule','Coeficientul de distribuție solid–apă depinde de proprietățile solului și ale contaminantului.','Kd=C_solid/C_apă (unități definite)'],
 ['Speciația metalelor','Mobilitatea metalelor depinde de pH, potențial redox și specii de complexare.','M²⁺+L ⇌ ML²⁺ (exemplu de complexare neutră)'],
 ['Bioacumulare','Bioacumularea este preluarea netă a unei substanțe în organism din mediu și hrană.','BAF=C_organism/C_mediu (definiție operațională)']
 ]},
 {id:'env_risk',specialty:'environment',ro:'Monitorizare și evaluarea expunerii',en:'Environmental monitoring and exposure',lessons:[
 ['Prelevare reprezentativă','Strategia de prelevare trebuie să țină cont de spațiu, timp și heterogenitatea mediului.','plan de eșantionare'],
 ['Lanț de custodie','Trasabilitatea probelor necesită identitate, timp, sigilare și operațiuni documentate.','probă → analiză → raport'],
 ['Interpretarea riscului','Riscul nu se deduce din simpla prezență a unui contaminant; contează concentrația și expunerea.','risc ≠ identificare pericol']
 ]},
 {id:'comp_quantum',specialty:'computational',ro:'Metode de structură electronică',en:'Electronic structure methods',lessons:[
 ['Ecuația Schrödinger pentru stări staționare','Operatorul Hamiltonian acționând asupra unei stări staționare dă energia acelei stări.','Ĥψ=Eψ'],
 ['Aproximația Born–Oppenheimer','Mișcarea electronică se poate aproxima separat de cea nucleară, datorită diferenței de masă.','E≈E_electronic(R)+E_nuclear(R)'],
 ['Teoria funcționalei densității','DFT folosește densitatea electronică drept variabilă centrală pentru energia stării fundamentale.','E=E[ρ]']
 ]},
 {id:'comp_forcefields',specialty:'computational',ro:'Mecanică moleculară',en:'Molecular mechanics',lessons:[
 ['Câmpuri de forță','Energia moleculară poate fi aproximată prin termeni empirici de legături, unghiuri și interacții nelegate.','E≈E_legături+E_unghiuri+E_torsiuni+E_nelegate'],
 ['Potențial Lennard–Jones','Modelul 12–6 descrie repulsia scurtă și atracția dispersivă dintre particule neutre.','V(r)=4ε[(σ/r)^12−(σ/r)^6]'],
 ['Dinamica moleculară','Simularea clasică integrează ecuațiile de mișcare pentru particule sub forțe modelate.','Fᵢ=mᵢaᵢ']
 ]},
 {id:'comp_docking',specialty:'computational',ro:'Modelare moleculară și docking',en:'Molecular modelling and docking',lessons:[
 ['Scorul de docking','Un scor de docking este o estimare dependentă de algoritm, nu o măsură experimentală a afinității.','scor ≠ ΔG experimental'],
 ['Conformații și energie','O moleculă poate avea conformații distincte cu energii apropiate; o imagine 3D nu stabilește conformația biologică.','E=E(coordonate)'],
 ['Solvatare','Solventul poate modifica stabilitatea conformațiilor și interacțiunile dintre molecule.','ΔG_solvatare']
 ]},
 {id:'comp_validation',specialty:'computational',ro:'Validarea rezultatelor digitale',en:'Computational validation',lessons:[
 ['Convergența numerică','O soluție iterativă trebuie verificată față de praguri de energie, gradient și număr de iterații.','|ΔE|<ε (criteriu ales)'],
 ['Sensibilitatea la metodă','Rezultatele depind de model, bază, parametrizare și condiții de calcul; trebuie documentate.','rezultat=f(metodă, parametri)'],
 ['Reproductibilitatea','Geometria inițială, versiunile software, parametrii și sămânța aleatoare trebuie consemnate.','intrări + versiuni + parametri']
 ]}
];
export const CHEMISTRY_SPECIALTY_TOPICS=Object.freeze(CHAPTERS.map(({id,specialty,ro,en})=>Object.freeze({id,specialty,ro,en,minLevel:'advanced'})));
export const CHEMISTRY_SPECIALTY_LESSONS=Object.freeze(CHAPTERS.flatMap(ch=>ch.lessons.map(([title,statement,formula],i)=>Object.freeze({
 id:'chem-spec-'+ch.id+'-'+(i+1),subject:'chemistry',level:'advanced',topic:ch.id,
 title,statement,formula,aliases:[title.toLowerCase()]
}))));
// Only known idealised molecular coordinates. No invented structure for arbitrary formulas.
export const CHEMISTRY_MOLECULES=Object.freeze([
 {formula:'H2O',name:'Apă',atoms:[['O',0,0,0],['H',-.76,.59,0],['H',.76,.59,0]],bonds:[[0,1],[0,2]]},
 {formula:'CO2',name:'Dioxid de carbon',atoms:[['O',-1.16,0,0],['C',0,0,0],['O',1.16,0,0]],bonds:[[0,1],[1,2]]},
 {formula:'CH4',name:'Metan',atoms:[['C',0,0,0],['H',.63,.63,.63],['H',-.63,-.63,.63],['H',-.63,.63,-.63],['H',.63,-.63,-.63]],bonds:[[0,1],[0,2],[0,3],[0,4]]},
 {formula:'NH3',name:'Amoniac',atoms:[['N',0,0,.25],['H',.94,0,-.25],['H',-.47,.81,-.25],['H',-.47,-.81,-.25]],bonds:[[0,1],[0,2],[0,3]]}
]);
// This function is deliberately self-contained so it can run both in Node regression tests
// and in the offline-first embedded Android WebView without a second JS module loader.
export function chemistryVerifiedExercise(input,mode='solve'){
 const text=String(input||'').trim();
 if(!text||text.length>3500)return null;
 const num=s=>Number(String(s).replace(',','.'));
 const pretty=n=>Number.isFinite(n)?String(Number(n.toPrecision(10))):'';
 const find=(name,unit)=>{const r=new RegExp('(?:^|[;\\s,])'+name+'\\s*=\\s*(\\d+(?:[.,]\\d+)?)\\s*'+unit,'i').exec(text);return r?num(r[1]):null};
 const build=(kind,lines,formula)=>({kind,verified:true,formula,body:(mode==='explain'?lines.slice(0,-1):lines).join('\n')});
 let a,b,c;
 // Inputs explicitly named with units only. Never infer measurement from free text.
 a=find('n','mol\\b');b=find('V','L\\b');
 if(a!==null&&b!==null&&!/V1|C1|C2/i.test(text)){
  if(b<=0||a<0)return {kind:'input',verified:false,body:'Volume must be positive and amount cannot be negative.'};
  return build('molarity',['Concentrație molară: c=n/V.','Date: n='+pretty(a)+' mol; V='+pretty(b)+' L.','c='+pretty(a/b)+' mol/L.'],'c=n/V');
 }
 a=find('m','g\\b');b=find('M','g\\s*\\/\\s*mol\\b');
 if(a!==null&&b!==null){
  if(a<0||b<=0)return {kind:'input',verified:false,body:'Mass must be nonnegative; molar mass must be positive.'};
  return build('moles',['Cantitate de substanță: n=m/M.','Date: m='+pretty(a)+' g; M='+pretty(b)+' g/mol.','n='+pretty(a/b)+' mol.'],'n=m/M');
 }
 a=find('C1','mol\\s*\\/\\s*L\\b');b=find('V1','mL\\b');c=find('C2','mol\\s*\\/\\s*L\\b');
 if(a!==null&&b!==null&&c!==null){
  if(a<0||b<=0||c<=0)return {kind:'input',verified:false,body:'Dilution requires C1≥0, V1>0 and C2>0.'};
  return build('dilution',['Diluție (fără reacție chimică): C1·V1=C2·V2.','Date: C1='+pretty(a)+' mol/L; V1='+pretty(b)+' mL; C2='+pretty(c)+' mol/L.','V2='+pretty(a*b/c)+' mL.'],'C1·V1=C2·V2');
 }
 // Charge-conserving balancing for neutral formulae. Charged ions and half reactions
 // are intentionally excluded until an explicitly validated ionic parser is available.
 if(!/(?:->|→|=)/.test(text))return null;
 const eq=text.match(/^\s*(.*?)\s*(?:->|→|=)\s*(.*?)\s*$/);
 if(!eq)return null;
 const pieces=side=>side.split(/\s+\+\s+|\s*\+\s*(?=[A-Z(])/).map(s=>s.trim()).filter(Boolean);
 const lhs=pieces(eq[1]),rhs=pieces(eq[2]),all=[...lhs,...rhs];
 if(lhs.length<1||rhs.length<1||all.length>12||/[⁺⁻^•·]/u.test(text))return null;
 const elements='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
 function parseFormula(source){
  const formula=source.replace(/^\d+\s*/,'').replace(/\((aq|s|l|g)\)$/i,'');
  let i=0;const read=closing=>{
   const count={};let any=false;
   while(i<formula.length){
    if(closing&&formula[i]===closing){i++;return any?count:null}
    const ch=formula[i],close=ch==='('?')':ch==='['?']':null;
    let part;
    if(close){i++;part=read(close);if(!part)return null}
    else{
     if(!/[A-Z]/.test(ch)||ch===undefined)return null;
     let sym=ch;i++;if(i<formula.length&&/[a-z]/.test(formula[i]))sym+=formula[i++];
     if(!elements.includes(sym))return null;
     part={[sym]:1};
    }
    let digits='';while(i<formula.length&&/[0-9]/.test(formula[i]))digits+=formula[i++];
    const mult=digits?Number(digits):1;if(mult<1||mult>100000)return null;
    for(const [key,val] of Object.entries(part))count[key]=(count[key]||0)+val*mult;
    any=true;
   }
   return closing?null:any?count:null;
  };
  const result=read(null);return result&&i===formula.length?result:null;
 }
 const parsed=all.map(parseFormula);if(parsed.some(x=>!x))return null;
 const species=[...new Set(parsed.flatMap(x=>Object.keys(x)))];
 if(species.length>12)return null;
 // Exact fractions represented as finite-sized rational numbers via BigInt.
 const gcd=(x,y)=>{x=x<0n?-x:x;y=y<0n?-y:y;while(y){const t=x%y;x=y;y=t}return x||1n};
 const rat=(n,d=1n)=>{n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d}const g=gcd(n,d);return [n/g,d/g]};
 const add=(x,y)=>rat(x[0]*y[1]+y[0]*x[1],x[1]*y[1]);
 const neg=x=>[-x[0],x[1]];
 const mul=(x,y)=>rat(x[0]*y[0],x[1]*y[1]);
 const div=(x,y)=>y[0]===0n?null:rat(x[0]*y[1],x[1]*y[0]);
 const mat=species.map(el=>parsed.map((p,j)=>rat((p[el]||0)*(j<lhs.length?1:-1))));
 let row=0;const pivots=[];
 for(let col=0;col<all.length&&row<mat.length;col++){
  const selected=mat.findIndex((r,k)=>k>=row&&r[col][0]!==0n);
  if(selected<0)continue;
  [mat[row],mat[selected]]=[mat[selected],mat[row]];
  const pivot=mat[row][col];for(let k=col;k<all.length;k++)mat[row][k]=div(mat[row][k],pivot);
  for(let r=0;r<mat.length;r++)if(r!==row&&mat[r][col][0]!==0n){
   const factor=mat[r][col];
   for(let k=col;k<all.length;k++)mat[r][k]=add(mat[r][k],neg(mul(factor,mat[row][k])));
  }
  pivots.push(col);row++;
 }
 const free=Array.from({length:all.length},(_,i)=>i).filter(i=>!pivots.includes(i));
 if(free.length!==1)return null; // ambiguous equation: do not pick arbitrary stoichiometry
 const x=Array.from({length:all.length},()=>rat(0));x[free[0]]=rat(1);
 for(let r=pivots.length-1;r>=0;r--){const col=pivots[r];let sum=rat(0);
  for(let k=col+1;k<all.length;k++)sum=add(sum,mul(mat[r][k],x[k]));
  x[col]=neg(sum);
 }
 const lcm=(a,b)=>(a/gcd(a,b))*b;
 let den=1n;for(const v of x)den=lcm(den,v[1]);
 let coefficients=x.map(v=>v[0]*(den/v[1]));
 if(coefficients.every(v=>v<0n))coefficients=coefficients.map(v=>-v);
 if(coefficients.some(v=>v<=0n||v>10000n))return null;
 let common=coefficients.reduce((g,v)=>gcd(g,v),0n);coefficients=coefficients.map(v=>v/common);
 if(species.some(el=>coefficients.reduce((sum,v,i)=>sum+v*BigInt((parsed[i][el]||0)*(i<lhs.length?1:-1)),0n)!==0n))return null;
 const format=(side,offset)=>side.map((formula,i)=>(coefficients[offset+i]===1n?'':coefficients[offset+i]+' ')+formula).join(' + ');
 const result=format(lhs,0)+' → '+format(rhs,lhs.length);
 return build('balance',['Ecuație chimică verificată prin conservarea atomilor.','Reactanți: '+lhs.join(', ')+'; produși: '+rhs.join(', ')+'.','Coeficienți întregi minimi: '+result],result);
}
