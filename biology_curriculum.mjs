// Offline-first Biology syllabus and safe, validated educational models.
// Does not constitute professional medical diagnosis or laboratory accreditation.
export const BIOLOGY_TOPICS=Object.freeze([
 {id:'cells',ro:'Celula și organizarea vieții',en:'Cells and organization',minLevel:'beginner'},
 {id:'biomolecules',ro:'Biomolecule și metabolism',en:'Biomolecules and metabolism',minLevel:'beginner'},
 {id:'anatomy',ro:'Anatomie și fiziologie',en:'Anatomy and physiology',minLevel:'beginner'},
 {id:'genetics',ro:'Genetică și ereditate',en:'Genetics and inheritance',minLevel:'beginner'},
 {id:'evolution',ro:'Evoluție și diversitate',en:'Evolution and diversity',minLevel:'beginner'},
 {id:'ecology',ro:'Ecologie și ecosisteme',en:'Ecology and ecosystems',minLevel:'beginner'},
 {id:'microbes',ro:'Microorganisme și virologie',en:'Microbiology and virology',minLevel:'intermediate'},
 {id:'plants',ro:'Biologie vegetală',en:'Plant biology',minLevel:'beginner'},
 {id:'homeostasis',ro:'Reglare și homeostazie',en:'Regulation and homeostasis',minLevel:'intermediate'},
 {id:'methods',ro:'Metode și date biologice',en:'Biological methods and data',minLevel:'intermediate'}
]);
export const BIOLOGY_SPECIALIZATIONS=Object.freeze([
 {id:'cellular',ro:'Biologie celulară',en:'Cell biology',core:['cells','biomolecules','methods']},
 {id:'molecular',ro:'Biologie moleculară și genetică',en:'Molecular biology and genetics',core:['genetics','cells','methods']},
 {id:'anatomy',ro:'Anatomie și fiziologie',en:'Anatomy and physiology',core:['anatomy','homeostasis','cells']},
 {id:'microbiology',ro:'Microbiologie și virusologie',en:'Microbiology and virology',core:['microbes','genetics','methods']},
 {id:'biomedical',ro:'Biologie medicală',en:'Biomedical science',core:['anatomy','homeostasis','microbes']},
 {id:'biotech',ro:'Biotehnologie',en:'Biotechnology',core:['biomolecules','genetics','methods']},
 {id:'ecology',ro:'Ecologie și conservare',en:'Ecology and conservation',core:['ecology','evolution','methods']},
 {id:'bioinformatics',ro:'Bioinformatică',en:'Bioinformatics',core:['genetics','methods','evolution']},
 {id:'neurobiology',ro:'Neurobiologie',en:'Neurobiology',core:['anatomy','cells','homeostasis']}
]);
// Each concise theory card is written explicitly: no synthetic headings or fabricated facts.
// [chapter, level, [title, statement, formula]...]
const BASIC=[
 ['cells','beginner',[
 ['Teoria celulară','Organismele sunt alcătuite din una sau mai multe celule; celulele noi provin din alte celule.','celulă → celule-fiice'],
 ['Membrana plasmatică','Bistratul lipidic reglează schimburile de materie dintre interiorul și exteriorul celulei.','fosfolipide + proteine'],
 ['Citoplasma','Citoplasma include citosolul și structuri celulare în care se desfășoară reacții metabolice.','citosol + organite'],
 ['Nucleul celular','La eucariote, nucleul adăpostește o mare parte din ADN și este delimitat de un înveliș dublu.','nucleu → ADN'],
 ['Mitocondria','Mitocondriile participă la respirația celulară aerobă și producerea ATP.','ADP+Pi → ATP (cuplare energetică)'],
 ['Ribozomul','Ribozomii traduc informația ARN mesager în lanțuri polipeptidice.','ARNm → proteină']
 ]],
 ['biomolecules','beginner',[
 ['Apa în organisme','Apa este solvent, mediu de transport și participant la multe reacții biologice.','H₂O'],
 ['Glucide','Monozaharidele sunt unități pentru carbohidrați complecși; glucoza este o sursă metabolică importantă.','C₆H₁₂O₆'],
 ['Lipide','Lipidele includ molecule de rezervă, structurale și de semnalizare; nu sunt toate polimeri.','trigliceride, fosfolipide'],
 ['Proteine','Proteinele sunt lanțuri de aminoacizi cu structură și funcție dependente de secvență și mediu.','aminoacizi → polipeptidă'],
 ['Enzime','Enzimele accelerează reacții prin reducerea barierei energetice, fără consum net în reacția catalizată.','E+S ⇌ ES → E+P'],
 ['ATP','ATP funcționează ca intermediar energetic în numeroase procese celulare.','ATP+H₂O → ADP+Pi']
 ]],
 ['anatomy','beginner',[
 ['Țesuturi','Celulele organizate cu matrice extracelulară formează țesuturi specializate în organismele pluricelulare.','celule → țesut → organ'],
 ['Sistemul circulator','Circulația transportă gaze, nutrienți și produși metabolici între țesuturi.','inimă → artere → capilare → vene'],
 ['Sistemul respirator','Schimbul de gaze la mamifere implică ventilația și difuzia la nivel alveolar.','O₂ intră; CO₂ iese'],
 ['Digestie','Digestia mecanică și chimică transformă alimentele în nutrienți absorbabili.','macromolecule → subunități'],
 ['Sistemul nervos','Neuronii și celulele gliale coordonează percepția, transmiterea semnalelor și controlul organismului.','neuroni + glie'],
 ['Sistemul locomotor','Mușchii, oasele, articulațiile și tendoanele susțin mișcarea și postura.','forță musculară → mișcare']
 ]],
 ['genetics','beginner',[
 ['ADN','ADN-ul este un polimer de nucleotide care poartă informație genetică în majoritatea organismelor.','A–T; C–G'],
 ['ARN','ARN-ul este compus din ribonucleotide; în ARN uracilul înlocuiește timina.','A–U; C–G'],
 ['Genă','O genă este o secvență asociată unui produs funcțional de ARN sau proteină.','ADN → ARN'],
 ['Cromozomi','Cromozomii organizează ADN-ul cu proteinele aferente și se distribuie la diviziunea celulară.','ADN + proteine'],
 ['Alelă','Alelele sunt variante ale aceleiași regiuni genetice.','A / a (model simplificat)'],
 ['Ereditate mendeliană','Pentru un singur locus autosomal, unele trăsături urmează segregarea alelelor în meioză.','Aa × Aa (caz simplu)']
 ]],
 ['evolution','beginner',[
 ['Evoluție biologică','Evoluția înseamnă schimbarea frecvențelor variantelor ereditare în populații de-a lungul generațiilor.','frecvențe alelice(t)'],
 ['Selecție naturală','Diferențele ereditare de supraviețuire și reproducere pot modifica frecvența trăsăturilor.','fitness relativ'],
 ['Mutații','Mutațiile sunt schimbări ale secvenței ADN; efectele lor pot fi neutre, nocive sau avantajoase contextual.','secvență ADN modificată'],
 ['Specie','Există mai multe concepte operaționale de specie; izolarea reproductivă este relevantă pentru multe organisme sexuale.','concept biologic / filogenetic'],
 ['Arbore filogenetic','Un arbore filogenetic ilustrează ipoteze de înrudire evolutivă, deduse din date.','strămoș comun → ramuri'],
 ['Diversitate biologică','Biodiversitatea include diversitate genetică, de specii și de ecosisteme.','gene + specii + ecosisteme']
 ]],
 ['ecology','beginner',[
 ['Ecosistem','Un ecosistem include organismele și mediul lor fizic, cu schimburi de energie și materie.','biocenoză + biotop'],
 ['Lanț trofic','Transferul de energie între niveluri trofice este incomplet, cu pierderi sub formă de căldură.','producător → consumator'],
 ['Producători primari','Organismele autotrofe transformă energia luminii sau a reacțiilor chimice în materie organică.','CO₂ → carbon organic'],
 ['Populație','Populația reunește indivizi ai aceleiași specii într-un spațiu și interval definite.','N(t)'],
 ['Habitat','Habitatul este mediul în care trăiește o specie, distinct de rolul său ecologic.','habitat ≠ nișă'],
 ['Ciclul carbonului','Carbonul se transferă între atmosferă, biosferă, hidrosferă și geosferă.','CO₂ ⇌ carbon biologic']
 ]],
 ['microbes','intermediate',[
 ['Bacterii','Bacteriile sunt organisme procariote fără nucleu delimitat de membrană.','procariot'],
 ['Arhee','Arheele sunt un domeniu distinct de bacterii, cu particularități moleculare și metabolice.','Archaea ≠ Bacteria'],
 ['Virusuri','Virusurile necesită celule gazdă pentru replicare și nu au metabolism autonom complet.','genom + capsidă'],
 ['Microbiom','Microbiomul reprezintă comunitățile microbiene și contextul lor genetic și ecologic, în funcție de definiție.','microbiotă + context'],
 ['Rezistență antimicrobiană','Rezistența poate apărea prin mutații și transfer orizontal de gene, sub presiuni selective.','selecție + variante rezistente'],
 ['Fermentație','Fermentația permite regenerarea NAD⁺ în anumite căi metabolice fără lanț respirator aerob.','NADH → NAD⁺']
 ]],
 ['plants','beginner',[
 ['Fotosinteză','Fotosinteza oxigenică transformă energia luminoasă în energie chimică, eliberând oxigen din apă.','6CO₂+6H₂O → C₆H₁₂O₆+6O₂ (bilanț simplificat)'],
 ['Cloroplast','Cloroplastele plantelor și algelor conțin aparatul fotosintetic membranar.','tilacoide + stromă'],
 ['Xilem','Xilemul transportă apă și solviți minerali și poate asigura susținere structurală.','rădăcină → frunze'],
 ['Floem','Floemul transportă asimilate organice între surse și consumatori.','sursă → sink'],
 ['Stomate','Stomatele reglează schimbul de CO₂ și pierderea apei prin transpirație.','conductanță stomatică'],
 ['Germinare','Germinarea implică reluarea creșterii embrionului în condiții adecvate de apă, oxigen și temperatură.','sămânță → plantulă']
 ]],
 ['homeostasis','intermediate',[
 ['Homeostazie','Homeostazia menține variabilele interne în intervale compatibile cu funcționarea prin mecanisme de reglare.','stimul → receptor → răspuns'],
 ['Feedback negativ','Feedbackul negativ reduce abaterea unei variabile față de intervalul ei țintă.','eroare = valoare−țintă'],
 ['Sistem endocrin','Hormonii acționează ca semnale chimice asupra celulelor cu receptori corespunzători.','hormon → receptor'],
 ['Osmoreglare','Osmoreglarea controlează echilibrul apei și solviților în organism.','flux osmotic'],
 ['Potențial de membrană','Separarea ionilor și permeabilitatea diferențială creează o tensiune electrică transmembranară.','Vm=Vin−Vout'],
 ['Răspuns imun','Sistemul imunitar include mecanisme înnăscute și adaptative, cu memorie specifică în anumite răspunsuri.','înnăscut + adaptativ']
 ]],
 ['methods','intermediate',[
 ['Ipoteza testabilă','O ipoteză științifică formulează o explicație ce poate fi confruntată cu observații și experimente.','ipoteză → predicție → test'],
 ['Martor experimental','Un grup martor permite separarea unui efect investigat de alți factori, în limitele designului.','tratament / martor'],
 ['Replicare biologică','Replicatele biologice sunt eșantioane independente, spre deosebire de măsurări repetate ale aceleiași probe.','n biologic ≠ n tehnic'],
 ['Microscopie optică','Limita de rezoluție depinde de lungimea de undă și de apertura numerică.','d≈0.61λ/NA'],
 ['PCR','Reacția PCR amplifică selectiv secvențe de ADN prin cicluri de temperatură și primeri.','N≈N₀·2^c (ideal)'],
 ['Interpreta­re statistică','O asociere observată nu dovedește singură o cauză; analiza trebuie să includă incertitudine și designul studiului.','corelație ≠ cauzalitate']
 ]]
];
export const BIOLOGY_LESSONS=Object.freeze(BASIC.flatMap(([topic,level,rows])=>rows.map(([title,statement,formula],i)=>Object.freeze({
 id:'bio-core-'+topic+'-'+(i+1),subject:'biology',topic,level,title,statement,formula,aliases:[title.toLowerCase()]
}))));
const SPECIAL_CHAPTERS=[
 ['cellular','cell-imaging','Microscopie celulară avansată','Advanced cell imaging',[
 ['Rezoluție și contrast','Contrastul și rezoluția descriu proprietăți diferite ale imaginii; mărirea nu recuperează detalii sub limita de rezoluție.','rezoluție ≠ mărire'],
 ['Microscopie de fluorescență','Fluoroforii permit urmărirea localizării moleculare; fotodecolorarea și autofluorescența limitează interpretarea.','excitație → emisie'],
 ['Colocalizare','Suprapunerea semnalelor poate sugera proximitate, dar nu demonstrează direct legarea moleculară.','colocalizare ≠ interacțiune']
 ]],
 ['cellular','cell-cycle','Ciclul celular și control','Cell cycle and control',[
 ['Fazele ciclului celular','Interfaza cuprinde G1, S și G2, urmate de mitoză și citokineză.','G1 → S → G2 → M'],
 ['Puncte de control','Punctele de control detectează probleme ale replicării sau atașării cromozomilor.','cicline + CDK'],
 ['Apoptoză','Moartea celulară programată implică rețele moleculare și morfologie caracteristice, distincte de necroza accidentală.','caspaze (anumite căi)']
 ]],
 ['cellular','cell-transport','Trafic vezicular și membrane','Membrane trafficking',[
 ['Endocitoză','Celula internalizează material prin formarea de vezicule din membrană.','membrană → veziculă'],
 ['Exocitoză','Veziculele pot fuziona cu membrana plasmatică și elibera conținut extracelular.','veziculă → fuziune'],
 ['Transport activ','Transportul împotriva gradientului electrochimic necesită cuplare energetică.','ΔG_transport>0 (necuplat)']
 ]],
 ['cellular','cell-signals','Semnalizare și diferențiere','Cell signalling and differentiation',[
 ['Receptor și ligand','Legarea ligandului poate altera activitatea unui receptor și declanșa un răspuns celular.','L+R ⇌ LR'],
 ['Fosforilare','Kinazele transferă grupări fosfat și reglează funcția proteinelor.','proteină+ATP → proteină-P+ADP'],
 ['Diferențiere celulară','Celulele pot dobândi funcții specifice prin programe de exprimare genică și semnale de mediu.','expresie genică selectivă']
 ]],
 ['molecular','mol-replication','Replicare și repararea ADN','DNA replication and repair',[
 ['Replicare semiconservativă','Fiecare moleculă fiică păstrează un lanț parental și unul nou sintetizat.','ADN → 2 ADN'],
 ['Polaritatea replicării','ADN-polimerazele adaugă nucleotide la capătul 3′ al catenei în creștere.','sinteză 5′→3′'],
 ['Repararea prin excizie','Unele leziuni ale ADN-ului sunt eliminate prin recunoaștere, excizie și resinteză.','leziune → excizie → reparare']
 ]],
 ['molecular','mol-expression','Exprimare genică','Gene expression',[
 ['Transcripție','ARN-polimeraza sintetizează ARN complementar catenei matriță de ADN.','ADN matriță → ARN'],
 ['Splicing','La multe gene eucariote, intronii sunt eliminați din pre-ARNm, reunind exonii.','pre-ARNm → ARNm'],
 ['Reglare epigenetică','Modificările cromatinei pot influența expresia fără a altera secvența ADN.','cromatină ↔ accesibilitate']
 ]],
 ['molecular','mol-inheritance','Genetică moleculară și variație','Molecular genetics and variation',[
 ['Variantă genetică','O variantă este o diferență de secvență între genomuri sau alele; impactul necesită dovezi.','substituție / inserție / deleție'],
 ['Recombinare','Schimbul genetic în meioză poate produce combinații noi de alele.','crossing-over'],
 ['Penetranță','Penetranța este proporția purtătorilor unui genotip care manifestă fenotipul definit.','penetranță=P(fenotip|genotip)']
 ]],
 ['molecular','mol-population','Genetică de populații','Population genetics',[
 ['Legea Hardy–Weinberg','Într-un model ideal de populație diploidă cu două alele, frecvențele genotipurilor sunt p², 2pq și q².','p+q=1; p²+2pq+q²=1'],
 ['Derivă genetică','Variațiile întâmplătoare ale frecvenței alelelor sunt importante în populații mici.','derivă ≠ selecție'],
 ['Dezechilibru de legătură','Asocierea nealeatoare între variante genetice depinde de istoria populației și recombinare.','D=P(AB)−P(A)P(B)']
 ]],
 ['anatomy','anat-tissues','Histologie și țesuturi','Histology and tissues',[
 ['Epiteliu','Țesutul epitelial formează bariere și suprafețe de absorbție, secreție ori schimb.','polaritate apicală/bazală'],
 ['Țesut conjunctiv','Matricea extracelulară și celulele asociate definesc proprietățile mecanice ale țesutului.','colagen + matrice'],
 ['Țesut muscular','Filamentele de actină și miozină produc forță prin cicluri de punți transversale.','actină ↔ miozină']
 ]],
 ['anatomy','anat-cardio','Fiziologie cardiovasculară','Cardiovascular physiology',[
 ['Debit cardiac','Într-un model fiziologic simplu, debitul cardiac este produsul volumului sistolic și frecvenței cardiace.','DC=VS·FC'],
 ['Legea lui Fick pentru difuzie','Fluxul de substanță printr-o membrană crește cu gradientul și suprafața, depinzând de grosime.','J=−D·∂c/∂x'],
 ['Baroreflex','Baroreceptorii pot regla pe termen scurt funcția cardiovasculară prin bucle reflexe.','presiune → reflex → răspuns']
 ]],
 ['anatomy','anat-resp','Fiziologie respiratorie','Respiratory physiology',[
 ['Ventilație alveolară','Ventilația alveolară scade prin contribuția volumului mort, la frecvență dată.','VA=(VT−VD)·f'],
 ['Schimb alveolocapilar','Gazele difuzează conform gradientului presiunii parțiale și caracteristicilor membranei.','flux ∝ Δp'],
 ['Hemoglobină','Afinitatea hemoglobinei pentru O₂ este influențată de pH, temperatură și liganzi.','Hb+O₂ ⇌ HbO₂']
 ]],
 ['anatomy','anat-renal','Rinichi și echilibru intern','Renal physiology',[
 ['Filtrare glomerulară','Rata de filtrare glomerulară este un parametru fiziologic estimat sau măsurat prin metode definite.','GFR (mL/min)'],
 ['Reabsorbție tubulară','Apa și solviții pot reveni din filtrat în sânge prin mecanisme selectiv controlate.','filtrare − excreție = reabsorbție netă (simplificat)'],
 ['Reglarea osmolarității','Rinichiul și semnalele hormonale contribuie la menținerea concentrației solviților.','ADH; aldosteron']
 ]],
 ['microbiology','mic-prok','Genetică și structură procariotă','Prokaryotic genetics',[
 ['Plasmide','Plasmidele sunt repliconi extracromozomali în multe microorganisme.','replicon extracromozomal'],
 ['Conjugare bacteriană','Transferul genetic prin contact poate implica elemente conjugative.','celulă donor → receptor'],
 ['Biofilm','Biofilmul este o comunitate microbiană asociată cu suprafața și matricea extracelulară.','celule + matrice']
 ]],
 ['microbiology','mic-virology','Virologie moleculară','Molecular virology',[
 ['Ciclul replicativ viral','Un ciclu viral include atașare, intrare, expresie și asamblare, cu variații între virusuri.','intrare → replicare → eliberare'],
 ['Virus ADN versus ARN','Tipul genomului influențează mecanismele de replicare; există virusuri cu retrotranscripție.','ADN / ARN viral'],
 ['Tropism viral','Tropismul este influențat de receptorii gazdei și de factori intracelulari.','virus + receptor compatibil']
 ]],
 ['microbiology','mic-pop','Ecologie microbiană','Microbial ecology',[
 ['Interacțiuni microbiene','Microorganismele pot concura, coopera sau forma relații mutualiste.','competiție / mutualism'],
 ['Ciclul azotului','Microorganismele mediază nitrificarea, denitrificarea și fixarea azotului.','N₂ ↔ NH₄⁺ ↔ NO₃⁻'],
 ['Metagenomică','Metagenomica studiază ADN din comunități fără a necesita cultivarea tuturor membrilor.','ADN comunitar → secvențiere']
 ]],
 ['microbiology','mic-resistance','Rezistență și control antimicrobian','Antimicrobial resistance and stewardship',[
 ['Selecția rezistenței','Expunerea la antimicrobiene poate modifica proporția variantelor rezistente.','selecție ≠ inducere obligatorie'],
 ['Transfer orizontal','Genele se pot transmite prin conjugare, transformare sau transducție.','conjugare / transformare / transducție'],
 ['Interpretarea antibiogramei','Categoriile de sensibilitate depind de metodă, organism și praguri actualizate; nu stabilesc singure tratamentul.','interpretare după standard validat']
 ]],
 ['biomedical','biom-immuno','Imunologie fundamentală','Fundamental immunology',[
 ['Prezentare antigenică','Moleculele MHC prezintă fragmente peptidice limfocitelor T în contexte celulare specifice.','MHC + peptidă'],
 ['Memorie imunologică','Unele limfocite persistă după expunere și permit răspunsuri adaptative mai rapide.','celule de memorie'],
 ['Anticorpi','Anticorpii recunosc epitopi, dar afinitatea și specificitatea trebuie evaluate experimental.','Ag+Ab ⇌ complex']
 ]],
 ['biomedical','biom-pathology','Patologie celulară','Cell pathology',[
 ['Leziune celulară','Stresurile pot produce adaptare, disfuncție reversibilă sau moarte celulară.','stres → adaptare / leziune'],
 ['Inflamație','Răspunsul inflamator implică mediatori, celule și vase; rolul depinde de cauză și țesut.','mediatori + leucocite'],
 ['Neoplazie','Neoplazia presupune proliferare anormală; caracterele diagnostice necesită analiză histopatologică.','proliferare necontrolată']
 ]],
 ['biomedical','biom-diagnostics','Metode de laborator biomedical','Biomedical laboratory methods',[
 ['Sensibilitatea unui test','Sensibilitatea este proporția cazurilor reale identificate pozitiv în populația validată.','Se=TP/(TP+FN)'],
 ['Specificitatea unui test','Specificitatea este proporția cazurilor reale negative identificate negativ.','Sp=TN/(TN+FP)'],
 ['Valoare predictivă pozitivă','VPP depinde de performanța testului și prevalența afecțiunii în populație.','VPP=TP/(TP+FP)']
 ]],
 ['biomedical','biom-ethics','Bioetică și interpretare','Ethics and interpretation',[
 ['Consimțământ informat','Utilizarea datelor sau probelor umane necesită un temei etic și legal adecvat.','informare + consimțământ'],
 ['Interval de referință','Intervalele populaționale nu sunt echivalente cu praguri diagnostice universale.','referință ≠ diagnostic'],
 ['Risc și cauzalitate','Relațiile statistice trebuie interpretate împreună cu factorii de confuzie și designul studiului.','asociere ≠ cauzalitate']
 ]],
 ['biotech','bio-process','Bioprocesare și fermentație','Bioprocessing',[
 ['Randament bioproces','Randamentul de produs raportat la substrat depinde de convenția și domeniul bilanțului.','Yp/s=ΔP/−ΔS'],
 ['Creștere microbiană','În faza exponențială idealizată, densitatea poate crește cu o rată specifică constantă.','N(t)=N₀e^(μt)'],
 ['Bioreactor','Transferul de oxigen și amestecarea influențează performanța culturilor aerobe.','OTR=kLa(C*−C)']
 ]],
 ['biotech','bio-recombinant','Biologie recombinantă','Recombinant biology',[
 ['Vector de expresie','Un vector poate include elemente pentru introducerea și exprimarea unei secvențe într-o gazdă.','vector + secvență țintă'],
 ['Transcriere și traducere','Exprimarea unei gene depinde de gazdă, promotori, codoni și condiții.','ADN → ARN → proteină'],
 ['Validarea constructului','Identitatea secvenței și expresia produsului trebuie confirmate prin metode adecvate.','design ≠ validare']
 ]],
 ['biotech','bio-editing','Editare și etica genomului','Genome editing and ethics',[
 ['Principiul CRISPR','Sistemele CRISPR pot direcționa nucleaze sau alte funcții către regiuni specifice ale acidului nucleic.','ARN ghid + efector'],
 ['Efecte off-target','Modificările nedorite în alte poziții trebuie investigate prin metode de validare.','specificitate imperfectă'],
 ['Etică și reglementare','Aplicațiile genomice, mai ales clinice, impun evaluare etică, legală și de siguranță.','risc + beneficiu + supraveghere']
 ]],
 ['biotech','bio-products','Proteine și biomateriale','Proteins and biomaterials',[
 ['Proteine recombinante','Un produs biologic recombinant necesită control al identității, structurii și purității.','calitate = mai multe atribute'],
 ['Glicozilare','Modificările zaharidice pot afecta stabilitatea și funcția proteinelor biologice.','proteină + glicani'],
 ['Biomateriale','Biocompatibilitatea depinde de material, aplicație, organism și durata contactului.','biocompatibilitate contextuală']
 ]],
 ['ecology','eco-pop','Ecologie cantitativă a populațiilor','Quantitative population ecology',[
 ['Creștere exponențială','În condiții idealizate, creșterea continuă la rată r constantă urmează o exponențială.','N(t)=N₀e^(rt)'],
 ['Creștere logistică','O populație cu limitare de resurse poate fi aproximată printr-un model cu capacitatea K.','dN/dt=rN(1−N/K)'],
 ['Eșantionare de populație','Estimările densității depind de detectabilitate, efort și designul eșantionării.','N/A (cu incertitudine)']
 ]],
 ['ecology','eco-community','Comunități și rețele trofice','Communities and food webs',[
 ['Biodiversitate alfa','Diversitatea alfa descrie diversitatea într-o unitate locală de eșantionare.','H′=−Σpi ln pi'],
 ['Competiție interspecifică','Speciile pot limita reciproc accesul la resurse; rezultatul depinde de nișe și mediu.','competiție între specii'],
 ['Cascade trofice','Schimbarea abundenței prădătorilor poate produce efecte indirecte asupra nivelurilor inferioare.','efecte indirecte']
 ]],
 ['ecology','eco-conservation','Biologia conservării','Conservation biology',[
 ['Diversitate genetică','Variabilitatea genetică poate influența adaptabilitatea și vulnerabilitatea populațiilor mici.','heterozigozitate H'],
 ['Fragmentarea habitatelor','Fragmentarea poate modifica dispersia, conectivitatea și dinamica locală.','conectivitate ecologică'],
 ['Conservare bazată pe dovezi','Intervențiile trebuie evaluate prin monitorizare și comparații adecvate.','măsurare → evaluare']
 ]],
 ['ecology','eco-climate','Schimbări globale','Global change biology',[
 ['Fenologie','Calendarul etapelor biologice poate răspunde la schimbarea temperaturii și fotoperioadei.','t_eveniment=f(mediu)'],
 ['Schimbări de areal','Distribuțiile speciilor pot varia sub influența climei, utilizării terenului și interacțiunilor biologice.','areal(t)'],
 ['Rezistență și reziliență','Rezistența este răspunsul inițial la perturbare; reziliența descrie revenirea după perturbare.','rezistență ≠ reziliență']
 ]],
 ['bioinformatics','info-align','Alinierea secvențelor','Sequence alignment',[
 ['Aliniere globală','Alinierea globală compară secvențe pe întreaga lungime cu o funcție de scor.','scor=substituții+penalizări'],
 ['Aliniere locală','Alinierea locală identifică regiuni similare într-o pereche de secvențe.','similaritate locală'],
 ['E-value','În căutări de similaritate, E-value estimează numărul de potriviri cu scor cel puțin egal cu cel observat în modelul nul.','E≈Kmn·e^(−λS)']
 ]],
 ['bioinformatics','info-reads','Date de secvențiere','Sequencing data',[
 ['Calitatea bazelor','Scorurile Phred codifică probabilitatea estimată a unei citiri incorecte.','Q=−10log₁₀P(eroare)'],
 ['Acoperire genomică','Acoperirea medie este numărul total de baze secvențiate împărțit la lungimea regiunii țintă.','coverage≈N·L/G'],
 ['Filtrarea datelor','Preprocesarea elimină adaptori și citiri sub standardele justificate, cu trasabilitate.','date brute → QC → analiză']
 ]],
 ['bioinformatics','info-omics','Date omice','Omics and multiomics',[
 ['Transcriptomică','Transcriptomica estimează expresia transcrierilor ARN într-un context experimental.','expresie ARNm'],
 ['Proteomică','Proteomica caracterizează proteine și variații de abundență sau modificări post-traducere.','proteom'],
 ['Corecție multiplă','Numeroase teste simultane necesită controlul descoperirilor false sau al erorilor de familie.','FDR (metodă specificată)']
 ]],
 ['bioinformatics','info-repro','Statistică și reproductibilitate','Statistics and reproducibility',[
 ['Metadate biologice','Metadatele descriu recoltarea, instrumentele, condițiile și prelucrarea probelor.','date + proveniență'],
 ['Supraadaptare','Un model poate memoriza date de antrenare fără a generaliza la date noi.','antrenare ≠ validare'],
 ['Partajare reproductibilă','Versiunile instrumentelor, parametrii și datele permise trebuie documentate pentru reproducere.','pipeline + versiuni + input']
 ]],
 ['neurobiology','neuro-electric','Electrofiziologie neuronală','Neuronal electrophysiology',[
 ['Potențial de repaus','Potențialul de repaus apare din gradiente ionice și conductanțe de membrană.','Vm=Vin−Vout'],
 ['Potențial de acțiune','Canalele ionice voltaj-dependente pot produce semnale electrice regenerative.','depolarizare → repolarizare'],
 ['Ecuația Nernst','Potențialul de echilibru al unui ion depinde de temperatură, valență și raportul activităților.','E=(RT/zF)ln(a_out/a_in)']
 ]],
 ['neurobiology','neuro-synapses','Sinapse și plasticitate','Synapses and plasticity',[
 ['Sinapsă chimică','Neurotransmițătorul eliberat de neuroni presinaptici acționează asupra receptorilor postsinaptici.','eliberare → receptor → răspuns'],
 ['LTP','Potențarea pe termen lung este o creștere persistentă a eficienței sinaptice după anumite tipare de activare.','plasticitate sinaptică'],
 ['Inhibiție sinaptică','Sinapsele inhibitoare pot reduce probabilitatea declanșării potențialelor de acțiune.','GABA (receptor dependent)']
 ]],
 ['neurobiology','neuro-circuits','Circuite și integrare','Neural circuits and integration',[
 ['Integrare dendritică','Semnalele postsinaptice se însumează spațial și temporal într-un neuron.','Σ intrări postsinaptice'],
 ['Rețele neuronale biologice','Circuitele realizează transformări ale informației prin conectivitate și dinamica temporală.','intrare → rețea → ieșire'],
 ['Oscilații neuronale','Ritmurile colective reflectă dinamica circuitelor și nu pot fi interpretate clinic izolat.','frecvență / fază']
 ]],
 ['neurobiology','neuro-sensory','Sisteme senzoriale și comportament','Sensory systems and behaviour',[
 ['Transducție senzorială','Receptorii senzoriali convertesc forme de energie în semnale biologice.','stimul → semnal electric'],
 ['Căi senzoriale','Informația este prelucrată în etape dinspre receptori către circuite centrale.','receptor → circuit'],
 ['Învățare și memorie','Procesele de învățare implică schimbări funcționale sau structurale în multiple circuite.','plasticitate + experiență']
 ]]
];
export const BIOLOGY_SPECIALTY_TOPICS=Object.freeze(SPECIAL_CHAPTERS.map(([specialty,id,ro,en])=>Object.freeze({id,specialty,ro,en,minLevel:'advanced'})));
export const BIOLOGY_SPECIALTY_LESSONS=Object.freeze(SPECIAL_CHAPTERS.flatMap(([specialty,topic,ro,en,rows])=>rows.map(([title,statement,formula],i)=>Object.freeze({
 id:'bio-spec-'+topic+'-'+(i+1),subject:'biology',topic,level:'advanced',title,statement,formula,
 aliases:[title.toLowerCase(),ro.toLowerCase()]
}))));
// Verified basic models require explicit, completely bounded input. Any ambiguity -> null.
export function biologyVerifiedExercise(input,mode='solve'){
 const raw=String(input||'').trim();if(!raw||raw.length>3500)return null;
 const form=n=>Number(n.toPrecision(10)).toString();
 const ok=(kind,formula,steps)=>({kind,verified:true,formula,body:(mode==='explain'?steps.slice(0,-1):steps).join('\n')});
 let m=raw.match(/^(?:ADN|DNA)\s*:\s*([ACGTacgt]{2,200})$/);
 if(m){const seq=m[1].toUpperCase(),map={A:'T',T:'A',C:'G',G:'C'};
  const complement=seq.split('').map(x=>map[x]).join('');
  return ok('dna',complement,['Complementaritatea bazelor ADN: A↔T, C↔G.','Catena dată (5′→3′): '+seq+'.','Complementara antiparalelă (3′→5′): '+complement+'.']);
 }
 m=raw.match(/^GC%\s*:\s*([ACGTacgt]{2,2000})$/);
 if(m){const seq=m[1].toUpperCase(),gc=(seq.match(/[GC]/g)||[]).length;
  return ok('gc',form(100*gc/seq.length)+'%', ['Conținut GC = 100·(G+C)/lungime.','G+C='+gc+'; lungime='+seq.length+'.','GC='+form(100*gc/seq.length)+'%.']);
 }
 m=raw.match(/^(?:ARN|RNA)\s*:\s*([ACGTacgt]{2,200})$/);
 if(m){const seq=m[1].toUpperCase();const transcript=seq.replaceAll('T','U');
  return ok('rna',transcript,['Transcriere din catena codantă ADN (5′→3′); în ARNm T devine U.','ADN codant: '+seq+'.','ARNm (5′→3′): '+transcript+'.']);
 }
 m=raw.match(/^(?:HW|Hardy[-\s]?Weinberg)\s*:\s*q(?:²|\^2|2)\s*=\s*(0(?:[.,]\d+)?|1(?:[.,]0+)?)$/i);
 if(m){const q2=Number(m[1].replace(',','.')),q=Math.sqrt(q2),p=1-q;
  return ok('hardy-weinberg','p²='+form(p*p)+'; 2pq='+form(2*p*q)+'; q²='+form(q2),
  ['Model Hardy–Weinberg ideal cu două alele: p+q=1, genotipuri p², 2pq, q².','Date: q²='+form(q2)+' ⇒ q='+form(q)+'; p='+form(p)+'.','Frecvențe: AA='+form(p*p)+', Aa='+form(2*p*q)+', aa='+form(q2)+'.']);
 }
 m=raw.match(/^(?:Punnett\s*:\s*)?([Aa]{2})\s*[x×]\s*([Aa]{2})$/);
 if(m){const parental=m[1].toUpperCase()==='AA'?'AA':m[1].toLowerCase()==='aa'?'aa':'Aa';
  const partner=m[2].toUpperCase()==='AA'?'AA':m[2].toLowerCase()==='aa'?'aa':'Aa';
  const gametes=gen=>gen.split('');
  const products=gametes(parental).flatMap(x=>gametes(partner).map(y=>[x,y].sort((a,b)=>a==='A'?-1:1).join('')));
  const counts={AA:0,Aa:0,aa:0};for(const g of products)counts[g]++;
  const result='AA='+form(counts.AA/4*100)+'%; Aa='+form(counts.Aa/4*100)+'%; aa='+form(counts.aa/4*100)+'%';
  return ok('punnett',result,['Model monogenic mendelian, doi părinți diploizi cu alelele A și a.','Împerecheri de gameți: '+products.join(', ')+'.',result+' (dominanta fenotipică necesită ipoteze suplimentare).']);
 }
 m=raw.match(/^(?:populație|population)\s*:\s*N0\s*=\s*(\d+(?:[.,]\d+)?)\s*;\s*r\s*=\s*(\d+(?:[.,]\d+)?)\s*;\s*t\s*=\s*(\d+(?:[.,]\d+)?)$/i);
 if(m){const [n,r,t]=m.slice(1).map(x=>Number(x.replace(',','.')));
  if(n<=0||r>20||t>100||r*t>50)return null;
  return ok('growth','N='+form(n*Math.exp(r*t)),['Model ideal continuu N(t)=N₀·e^(rt), r pe unitate de timp.','N₀='+form(n)+', r='+form(r)+', t='+form(t)+'.','N(t)='+form(n*Math.exp(r*t))+' (valoare modelată, nu observație).']);
 }
 return null;
}
