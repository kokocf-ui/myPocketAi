// Integrated primary-life-science study, age-scoped and year-scoped.
// RO uses class 1-4; GB-ENG uses Year 1-6. Others are advisory, never
// presented as a nationally certified syllabus.
export const BIOLOGY_PRIMARY_YEAR_TOPICS=Object.freeze({
 RO:{'1':['plants','ecology'],'2':['plants','ecology','anatomy'],
  '3':['plants','anatomy','ecology'],'4':['ecology','anatomy','plants']},
 'GB-ENG':{Y1:['plants','anatomy'],Y2:['plants','ecology','anatomy'],
  Y3:['plants','anatomy'],Y4:['ecology','anatomy','plants'],
  Y5:['plants','ecology','anatomy'],Y6:['anatomy','ecology','evolution']}
});
// One self-contained, illustrated-by-an-example lesson per scheduled branch.
// Additional practical exercises are inside each lesson, not invented generic
// cell/DNA slides. Other science subjects have their own separate banks.
export const BIOLOGY_PRIMARY_YEAR_ROWS=[
 [0,'plants','Plantele pe care le observăm','O plantă este o viețuitoare. Multe plante au rădăcină, tulpină și frunze, dar forma lor poate fi diferită. Observăm fără să rupem părțile plantei.','Comparați o plantă mică și un arbust, apoi desenați ceea ce vedeți, fără să deteriorați plantele.','Ce două părți ale unei plante poți observa?','Tulpina și frunzele.'],
 [0,'ecology','Viețuitoare și obiecte din jur','În grădină întâlnim viețuitoare, apă, pietre și obiecte fabricate. O viețuitoare crește și desfășoară procese ale vieții, în timp ce o piatră nu.','Observați o furnică, o floare, un bolovan și o stropitoare și grupați-le după ceea ce sunt.','Care două exemple din grădină sunt viețuitoare?','Furnica și floarea.'],
 [0,'anatomy','Corpul și cele cinci simțuri','Văzul, auzul, mirosul, gustul și pipăitul ne aduc informații diferite. Nu gustăm obiecte sau substanțe necunoscute ca să le identificăm.','Descrieți un clopoțel prin ceea ce vedeți și auziți, fără să-l gustați.','Cu ce simț recunoști sunetul clopoțelului?','Cu auzul.'],
 [1,'plants','De ce au nevoie plantele','Plantele au nevoie de apă, lumină și aer, în cantități potrivite pentru fiecare specie. Prea puțină apă sau lumină poate afecta creșterea.','Urmăriți aceeași plantă o săptămână și notați când primește apă și dacă apar frunze noi.','Numiți două resurse de care plantele au nevoie.','Apă și lumină.'],
 [1,'ecology','Habitatele animalelor','Habitatul este locul în care trăiește un organism. Iazul și grădina au condiții diferite și pot adăposti specii diferite.','Comparați un pește din iaz cu o râmă din pământ, explicând unde găsește fiecare condiții potrivite.','De ce nu trăiesc toate animalele în același loc?','Au nevoi și adaptări diferite.'],
 [1,'anatomy','Igiena și respirația','Spălarea mâinilor cu apă și săpun este o măsură de igienă importantă. Respirăm și când stăm pe loc, și când ne mișcăm; după efort ritmul respirației se poate schimba.','Observați respirația înainte și după o plimbare ușoară, fără să țineți respirația.','Când trebuie să ne spălăm pe mâini?','Înainte de masă și după folosirea toaletei.'],
 [2,'plants','Părțile plantei și rolurile lor','Rădăcina absoarbe apă și minerale, tulpina susține planta, iar frunzele participă la producerea substanțelor organice. Nu toate plantele au exact aceeași formă.','Priviți o plantă cu rădăcini, tulpină și frunze și indicați ce rol are fiecare parte.','Ce parte a plantei absoarbe apa din sol?','Rădăcina.'],
 [2,'anatomy','Oase, articulații și mișcare','Oasele alcătuiesc scheletul și susțin corpul. Articulațiile permit mișcări, iar mușchii lucrează cu scheletul pentru deplasare.','Îndoiți ușor brațul și observați unde are loc mișcarea, fără să forțați articulațiile.','Ce rol au articulațiile?','Permit mișcarea între părți ale scheletului.'],
 [2,'ecology','Lanțuri simple de hrănire','Un lanț de hrănire arată transferul de hrană și energie între organisme. Săgeata merge de la organismul consumat către consumator, nu invers.','Construiți din imagini lanțul iarbă → lăcustă → pasăre, apoi explicați săgețile.','În ce sens merge săgeata dintre iarbă și lăcustă?','De la iarbă la lăcustă.'],
 [3,'ecology','Clasificarea viețuitoarelor','Organismele se pot grupa după caracteristici comparabile. Faptul că două animale zboară nu înseamnă că aparțin aceluiași grup.','Comparați un liliac și o pasăre: ambele zboară, dar pasărea are pene și liliacul este mamifer.','Este zborul suficient pentru a recunoaște o pasăre?','Nu, sunt necesare și alte caracteristici.'],
 [3,'anatomy','Digestia și dinții','Dinții mărunțesc hrana, iar în stomac și intestine au loc alte etape de digestie. Majoritatea nutrienților sunt absorbiți în intestinul subțire.','Urmăriți traseul alimentelor într-o planșă corectă, de la gură spre stomac și intestin.','Unde începe mărunțirea mecanică a alimentelor?','În gură, prin mestecare.'],
 [3,'plants','Flori, fructe și plante fără flori','Multe plante cu flori produc fructe cu semințe, însă nu toate plantele au flori. Ferigile formează spori în ciclul lor de viață.','Comparați imagini ale unui măr și ale unei ferigi și notați diferențele.','Face feriga fructe precum mărul?','Nu, ferigile se reproduc prin spori.'],
 [4,'plants','Ciclul de viață al plantei','La multe plante cu flori, polenizarea precedă fecundația, iar ulterior se pot forma semințe. Polenizarea și fecundația sunt procese distincte.','Observați o floare și un fruct al aceleiași specii și explicați în ordine etapele cunoscute.','Este polenizarea identică cu fecundația?','Nu, sunt procese diferite.'],
 [4,'ecology','Cicluri de viață și relații în natură','Animalele au cicluri de viață diferite. La fluturi există metamorfoză, iar între viețuitoare apar atât relații de hrănire, cât și de concurență sau ajutor.','Comparați imaginile ou–omidă–crisalidă–fluture cu dezvoltarea unui pui de mamifer.','Au toate animalele aceleași etape de creștere?','Nu, ciclurile diferă între grupe.'],
 [4,'anatomy','Creștere, somn și sănătate','Ritmul creșterii diferă de la un copil la altul. Somnul, alimentația variată și mișcarea potrivită vârstei ajută la buna funcționare a corpului.','Descrieți o zi echilibrată cu mișcare, timp pentru masă și odihnă, fără a compara corpurile colegilor.','De ce nu cresc toți copiii în același ritm?','Dezvoltarea diferă între persoane.'],
 [5,'anatomy','Inima și circulația sângelui','Inima pompează sânge prin vase. Circulația pulmonară trece prin plămâni, iar cea sistemică aprovizionează țesuturile; arterele nu conțin întotdeauna sânge bogat în oxigen.','Urmăriți traseul simplificat inimă → plămâni → inimă → organe → inimă, într-un desen potrivit lecției.','Care este rolul principal al inimii?','Pompează sângele prin vase.'],
 [5,'ecology','Grupe și metode de clasificare','Organismele se grupează după caracteristici verificabile. Plantele, animalele și microorganismele sunt diverse, iar clasificarea cere mai mult decât o asemănare superficială.','Construiți o cheie simplă de recunoaștere pentru trei plante pe baza formei frunzelor.','De ce trebuie să precizăm criteriul de clasificare?','Pentru ca gruparea să poată fi verificată.'],
 [5,'evolution','Fosile, ereditate și variație','Fosilele sunt dovezi despre viața din trecut. Puii seamănă adesea cu părinții, fără a fi identici, iar trăsăturile pot depinde de ereditate și de mediu.','Comparați o ilustrație de fosilă cu un animal actual și separați observația de presupuneri.','Sunt toți indivizii dintr-o specie identici?','Nu, există variații.'],
 [0,'plants','Cum se schimbă o plantă','Plantele cresc și se modifică în timp. Unele frunze apar, se măresc, își schimbă culoarea sau cad, în funcție de specie și anotimp.','Desenăm aceeași plantă la începutul și sfârșitul săptămânii pentru a compara schimbările.','De ce comparăm o plantă în zile diferite?','Pentru a observa schimbarea în timp.'],
 [0,'ecology','Cum observăm animale fără să le rănim','O observație bună notează ceea ce vedem, nu ceea ce presupunem. Nu trebuie să atingem insectele, cuiburile sau alte vietăți pentru a învăța despre ele.','Privim de la distanță o pasăre și notăm câte mișcări putem observa fără să o speriem.','Este sigur să atingem o vietate necunoscută?','Nu; o observăm fără contact.'],
 [0,'anatomy','Mișcare și odihnă','Oamenii au nevoie atât de mișcare potrivită vârstei, cât și de somn și pauze. Oboseala este un semnal că trebuie să ne odihnim.','Comparam o plimbare liniștită cu o perioadă de odihnă și explicăm ce observăm.','De ce facem pauze între jocuri active?','Pentru a ne odihni.'],
 [1,'plants','Semințe care germinează','În condiții bune de apă, oxigen și temperatură, din unele semințe răsare o plantă nouă. Rădăcina tânără începe de regulă să crească înaintea frunzelor.','Punem semințe de fasole pe vată umedă, cu ajutorul unui adult, și urmărim apariția rădăcinii.','Ce parte se poate observa la începutul germinării?','Rădăcina tânără.'],
 [1,'ecology','Hrană și adăpost pentru animale','Animalele folosesc resurse diferite și locuri diferite pentru adăpost. Unele se hrănesc cu plante, altele cu animale sau cu ambele.','Comparăm hrana unei omizi cu hrana unei păsări care poate consuma insecte.','Au toate animalele aceeași hrană?','Nu, depinde de specie.'],
 [1,'anatomy','Respirația în timpul jocului','Respirăm și când suntem liniștiți, și când ne mișcăm. După o plimbare, respirația poate deveni mai rapidă deoarece corpul are alte nevoi în timpul activității.','Observăm respirația înainte și după mers ușor, fără să forțăm corpul și fără exerciții de ținut respirația.','Poate deveni respirația mai rapidă după mișcare?','Da, este un răspuns normal la efort.'],
 [2,'plants','Floarea și semințele','Multe plante cu flori formează semințe după reproducere, iar semințele pot ajunge în alte locuri prin vânt, apă sau animale. Nu toate plantele fac semințe.','Comparăm un fruct cu semințe și o frunză de ferigă pentru a vedea structuri diferite.','Pot toate plantele să facă fructe?','Nu; fructe formează angiospermele.'],
 [2,'ecology','Factorii nevii ai mediului','Apa, lumina și temperatura influențează modul în care trăiesc organismele. Sunt factori abiotici, deoarece nu sunt ființe vii.','Comparam plantele dintr-o porțiune însorită a grădinii cu cele dintr-un loc umbros.','Este lumina un factor viu sau neviu?','Este un factor abiotic, neviu.'],
 [2,'anatomy','Mestecarea și drumul alimentelor','Hrana este mărunțită în gură, apoi ajunge în stomac și intestine. Aceste structuri au roluri diferite în digestie și absorbția nutrienților.','Urmărim într-o planșă traseul hranei, fără experimente pe corpul colegilor.','Unde începe mărunțirea mecanică a hranei?','În gură, cu ajutorul dinților.'],
 [3,'plants','Transportul apei în tulpină','Apa absorbită prin rădăcină se poate deplasa prin țesuturile plantei până la frunze. Transportul poate fi observat indirect prin experimente simple, supravegheate.','Punem o tulpină de țelină în apă colorată și observăm unde apare colorantul.','Cum ajunge apa la frunze?','Prin țesuturile conducătoare.'],
 [3,'ecology','Protejăm locurile unde trăiesc organismele','Deșeurile și schimbarea habitatelor pot afecta plantele și animalele. Protecția mediului începe cu observația și comportamentul responsabil.','Comparăm fotografii ale unui parc curat și ale unui loc plin de gunoaie și discutăm efectele.','Cum putem ajuta un habitat?','Păstrăm curățenia și nu deranjăm viețuitoarele.'],
 [3,'anatomy','Mușchii și oasele lucrează împreună','Mușchii se contractă pentru a produce mișcare, iar oasele și articulațiile oferă sprijin și mobilitate. Mușchii acționează prin tragere, nu prin împingerea oaselor.','Îndoim ușor brațul și observăm rolul articulației cotului în mișcare.','Ce structuri lucrează împreună pentru a mișca brațul?','Mușchii, oasele și articulațiile.'],
 [4,'plants','Înmulțirea prin butași','Unele plante se pot înmulți din părți vegetative, fără formarea unei semințe. Această înmulțire diferă de reproducerea sexuală care produce semințe.','Urmărim un butaș de mentă în apă, cu sprijinul unui adult, și notăm dacă formează rădăcini.','Este butașul o sămânță?','Nu, este o parte vegetativă a plantei.'],
 [4,'ecology','Relații diferite între viețuitoare','Organismele se pot hrăni unele cu altele, concura pentru resurse sau contribui la polenizare. O relație de prădare nu descrie toate legăturile din natură.','Comparăm două plante care concurează pentru lumină cu o albină ce transportă polen.','Sunt toate relațiile din natură de prădare?','Nu, există multe tipuri de interacțiuni.'],
 [4,'anatomy','Somnul și dezvoltarea corpului','Corpul se schimbă pe măsură ce creștem, iar ritmul schimbărilor este diferit pentru fiecare persoană. Somnul, hrana și activitatea potrivită vârstei sunt importante.','Descriem o zi cu timp pentru odihnă și mișcare, fără comparații despre corpurile colegilor.','Au toate persoanele același ritm de creștere?','Nu, există variații normale.'],
 [5,'anatomy','Respirația și sângele','Plămânii participă la schimbul gazelor, iar sângele transportă oxigen către țesuturi. Respirația, circulația și activitatea celulelor au roluri diferite, dar legate între ele.','Explicăm într-o schemă plămân → sânge → țesut fără a confunda circulația cu ventilația.','Ce transportă sângele către țesuturi?','Printre altele, oxigen.'],
 [5,'ecology','Investigații cu observații repetate','O investigație biologică pornește de la o întrebare, notează condițiile și compară datele. O singură observație nu este suficientă pentru a susține orice concluzie.','Observăm insecte în două locuri ale grădinii și înregistrăm ora și vremea, fără să le capturăm.','De ce notăm condițiile unei observații?','Pentru a interpreta și compara datele.'],
 [5,'evolution','Variație și moștenire','Descendenții pot semăna cu părinții fără să fie identici. Unele trăsături au componente ereditare, iar mediul poate influența exprimarea lor.','Comparam flori ale aceleiași specii și notăm asemănări și deosebiri fără a atribui gene inventate.','Sunt toți indivizii unei specii identici?','Nu, există variații.']
];
export function biologyPrimaryYearPosition({country='',grade='',years=[]}={}){
 const code=String(country).toUpperCase(),id=String(grade);
 if(code==='RO'&&/^[1-4]$/.test(id))return Number(id)-1;
 if(code==='GB-ENG'&&/^Y[1-6]$/.test(id))return Number(id.slice(1))-1;
 const list=Array.isArray(years)?years:[],p=list.findIndex(x=>String(x?.id)===id);
 return p<0?-1:list.length===1?0:Math.round(p*5/(list.length-1));
}
export function biologyPrimaryTopics(args={}){
 const code=String(args.country||'').toUpperCase(),id=String(args.grade||'');
 const exact=BIOLOGY_PRIMARY_YEAR_TOPICS[code]?.[id];
 if(exact)return [...exact];
 const idx=biologyPrimaryYearPosition(args);
 return idx<0?[]:[...new Set(BIOLOGY_PRIMARY_YEAR_ROWS.filter(x=>x[0]===idx).map(x=>x[1]))];
}
export function biologyPrimaryYearLessons(args={}){
 const {country='',grade='',topic=''}=args,code=String(country).toUpperCase(),id=String(grade);
 if(!biologyPrimaryTopics(args).includes(topic))return [];
 const idx=biologyPrimaryYearPosition(args);
 return BIOLOGY_PRIMARY_YEAR_ROWS.filter(x=>x[0]===idx&&x[1]===topic).map((x,i)=>({
  id:'biology-primary-'+code+'-'+id+'-'+topic+'-'+(i+1),
  subject:'biology',topic,grade:id,stage:'primary',
  title:x[2],statement:x[3],workedExample:x[4],exercise:x[5],answer:x[6],
  formula:'',language:'ro',diagramId:null,laboratoryType:'observation',
  curriculumScope:code==='RO'?'Integrated Romanian primary science':
    code==='GB-ENG'?'Integrated England primary science':
    'Advisory integrated science; national curriculum unverified'
 }));
}
