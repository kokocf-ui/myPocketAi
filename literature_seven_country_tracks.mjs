// Seven country-specific Language & Literature study routes, 2026/27.
// Sources confirm a national curricular FRAMEWORK, not a mandatory list of works.
// Each grade's topics are original teaching sequences, NOT verbatim regulations.
// Literary authors are examples to investigate, never falsely mandatory readings.
const range=(from,to)=>Array.from({length:to-from+1},(_,i)=>String(from+i));
const upper=prefix=>Array.from({length:4},(_,i)=>prefix+(i+1));
const profiles={
 MD:{
  title:'Limba și literatura română · Republica Moldova',language:'ro',
  source:'https://www.edu.gov.md/ro/content/invatamint-general',
  sourceTitle:'MEC Moldova — Curriculum Limba și literatura română, gimnaziu și liceu',
  note:'Moldova are curriculum propriu, distinct de România. Curriculumul 2026 publicat spre consultare nu este prezentat automat ca aprobat. Alege limba de instruire; lista autorilor este de explorare, nu lectură obligatorie.',
  tracks:[['NAT','Școală cu predare în română'],['ALO','Școală cu predare în limba minorităților']],
  stages:{beginner:range(1,4),lower:range(5,9),medium:range(10,12)},
  chapters:{language:['Fonetică, vocabular și exprimare în limba română','Ortografie, punctuație și redactare','Părțile de vorbire și flexiunea','Sintaxa propoziției și a frazei'],
   literature:['Lectură și interpretare în literatura română din Moldova','Poezie: eul liric, imaginile artistice, ritmul','Proză: naratorul, personajul, spațiul și timpul','Text dramatic: conflictul, scena și dialogul'],
   authors:['Grigore Vieru — poezie, limbă și identitate','Ion Druță — proză, comunitate și tradiții','Spiridon Vangheli — literatură pentru copii'],
   composition:['Rezumat, caracterizare și plan de idei','Eseu argumentativ și analiza unui fragment']}},
 PL:{
  title:'Język polski i literatura',language:'pl',
  source:'https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane',
  sourceTitle:'MEN — nowe podstawy programowe 2026; reforma wdrażana etapowo',
  note:'În 2026/27 reforma pentru școala primară se aplică treptat; clasele neincluse în cohortele reformei nu trebuie tratate ca având programa nouă. Pentru liceu și technikum se alege traseul.',
  tracks:[['LICEUM','Liceum ogólnokształcące'],['TECH','Technikum']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:upper('L')},
  chapters:{language:['Fonetyka, ortografia i interpunkcja','Części mowy i odmiana wyrazów','Składnia zdania i wypowiedzenia','Słowotwórstwo, style i frazeologia'],
   literature:['Czytanie ze zrozumieniem i argumentacja','Liryka: podmiot liryczny i środki stylistyczne','Epika: narracja, bohater, czas i przestrzeń','Dramat: dialog, konflikt i interpretacja'],
   authors:['Adam Mickiewicz — romantyzm i interpretacja','Bolesław Prus — narracja realistyczna','Henryk Sienkiewicz — powieść historyczna'],
   composition:['Streszczenie, opis i charakterystyka','Rozprawka i analiza tekstu']}},
 HR:{
  title:'Hrvatski jezik i književnost',language:'hr',
  source:'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_215.html',
  sourceTitle:'Narodne novine NN 10/2019 — Hrvatski jezik, osnovna škola i gimnazija',
  note:'Kurikulum croat structurează domeniile comunicare, literatură și cultură, inclusiv gimnaziul. Titlurile de opere sunt exemple, nu lecturi impuse pentru fiecare clasă.',
  tracks:[['GIM','Gimnazija'],['STR','Strukovna škola']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:upper('G')},
  chapters:{language:['Hrvatski jezik i komunikacija','Glasovi, pravopis i interpunkcija','Vrste riječi i njihovi oblici','Rečenica, sintaksa i funkcionalni stilovi'],
   literature:['Književnost i stvaralaštvo','Lirika: pjesnički subjekt i stilske figure','Epika: pripovjedač, likovi, kompozicija','Drama: sukob, dijalog i kazalište'],
   authors:['Ivana Brlić-Mažuranić — priče i pripovijedanje','August Šenoa — povijesni roman','Miroslav Krleža — književnost dvadesetog stoljeća'],
   composition:['Sažetak, opis i karakterizacija lika','Argumentacijski esej i interpretacija ulomka']}},
 RS:{
  title:'Српски језик и књижевност',language:'sr',
  source:'https://zuov.gov.rs/novi-pravilnici-programi-nastave-i-ucenja-za-1-i-5-razred-os-program-nastave-i-ucenja-za-1-razred-gimnazije-izmene-planova-nastave-za-os-izmene-i-dopune-srednje-strucno/',
  sourceTitle:'ZUOV — izmene programa nastave i učenja, mart 2026',
  note:'Serbia a revizuit reglementări pentru anumite clase în 2026. Limba sârbă folosește chirilică și latină; școala/profilul determină secvența de studiu.',
  tracks:[['CYR','Ћирилица'],['LAT','Latinica']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:upper('G')},
  chapters:{language:['Српски језик: гласови и правопис','Врсте речи и граматички облици','Синтакса реченице','Језичка култура, стил и изражавање'],
   literature:['Читање, разумевање и тумачење','Лирика: песничке слике и стилске фигуре','Епика: приповедач, лик, време и простор','Драма: дијалог, сукоб и сценски текст'],
   authors:['Вук Караџић — језик и народна књижевност','Иво Андрић — приповедање и историја','Десанка Максимовић — лирска поезија'],
   composition:['Сажетак, опис и карактеризација','Аргументативни есеј и анализа одломка']}},
 HU:{
  title:'Magyar nyelv és irodalom',language:'hu',
  source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',
  sourceTitle:'Oktatási Hivatal — NAT 2020 kerettantervek',
  note:'Structura maghiară 1–8 + liceu de patru ani este un traseu uzual, dar există gimnázium de 6/8 ani. Operele exemplificate trebuie confirmate după programa școlii.',
  tracks:[['G4','Négyévfolyamos gimnázium'],['G6','Hatévfolyamos gimnázium'],['G8','Nyolcévfolyamos gimnázium']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:upper('G')},
  chapters:{language:['Hangtan, helyesírás és írásjelek','Szófajok, alaktan és toldalékolás','Mondattan és mondatfajták','Szókincs, jelentés és nyelvváltozatok'],
   literature:['Szövegértés és műértelmezés','Líra: beszélő, ritmus és képek','Epika: elbeszélő és szereplők','Dráma: konfliktus, párbeszéd és jelenet'],
   authors:['Petőfi Sándor — líra és romantika','Arany János — balladák és elbeszélés','Jókai Mór — regény és elbeszélő technika'],
   composition:['Összefoglalás és szereplőjellemzés','Érvelő esszé és szövegelemzés']}},
 AT:{
  title:'Deutsch · Österreich',language:'de',
  source:'https://www.bmb.gv.at/Themen/schule/schulpraxis/lp/lp_ms.html',
  sourceTitle:'BMB — Lehrplan der Mittelschule (Einführung 2023/24 aufsteigend)',
  note:'AHS-Unterstufe, Mittelschule și traseele superioare diferă. Reforma AHS-Oberstufe anunțată pentru septembrie 2027 nu se aplică retroactiv anului școlar 2026/27.',
  tracks:[['MS','Mittelschule'],['AHS','AHS'],['BHS','Berufsbildende höhere Schule']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:range(9,13)},
  chapters:{language:['Deutsch: Lesen, Sprechen und Zuhören','Rechtschreibung, Zeichensetzung und Wortbildung','Wortarten, Flexion und Satzbau','Sprachregister und Medienkompetenz'],
   literature:['Textverständnis und Lesestrategien','Lyrik: lyrisches Ich, Rhythmus und Bildsprache','Epik: Erzähler, Figuren und Handlung','Drama: Figurenkonflikt und Szenenanalyse'],
   authors:['Franz Grillparzer — Drama und Figurenkonflikt','Arthur Schnitzler — Erzähltechnik und Moderne','Ingeborg Bachmann — Lyrik und Sprache'],
   composition:['Zusammenfassung und Charakterisierung','Erörterung, Textinterpretation und Essay']}},
 TR:{
  title:'Türkçe / Türk Dili ve Edebiyatı',language:'tr',
  source:'https://tymm.meb.gov.tr/ogretim-programlari/ders/turk-dili-ve-edebiyati-dersi',
  sourceTitle:'MEB — Türkiye Yüzyılı Maarif Modeli, Türk Dili ve Edebiyatı',
  note:'Programul MEB a fost revizuit în 2026 și se aplică pe cohorte; pentru clasa a XII-a în 2026/27 pot exista prevederi de tranziție. Programa de Türkçe pentru 1–8 nu se confundă cu programa liceală de literatură.',
  tracks:[['AN','Anadolu Lisesi'],['FEN','Fen Lisesi'],['MES','Meslek Lisesi']],
  stages:{beginner:range(1,4),lower:range(5,8),medium:range(9,12)},
  chapters:{language:['Türkçe: dinleme, konuşma, okuma, yazma','Ses bilgisi, yazım ve noktalama','Sözcük türleri ve biçim bilgisi','Cümle bilgisi, anlatım ve üslup'],
   literature:['Metin anlama, yorumlama ve eleştiri','Şiir: imge, ölçü, kafiye ve ses','Hikâye ve roman: anlatıcı, olay örgüsü','Tiyatro: diyalog, çatışma ve sahne'],
   authors:['Yunus Emre — şiir geleneği ve anlam','Namık Kemal — edebiyat ve düşünce','Orhan Veli Kanık — modern Türk şiiri'],
   composition:['Özet, betimleme ve karakter incelemesi','Tartışmacı yazı, deneme ve metin çözümlemesi']}
 }
};
const level=(stage)=>stage==='beginner'?'primar':stage==='lower'?'secundar inferior':'secundar superior';
function focusInstruction(title,code,grade,stage,kind){
 const profile=profiles[code];
 const assignment=kind==='authors'
  ?'Caută în bibliografii verificabile o operă a autorului, distinge opera originală de interpretare și nu afișa text integral fără licență sau domeniu public.'
  :kind==='literature'
  ?'Explică termenii, alege un fragment disponibil legal, pune trei întrebări despre text și justifică interpretarea prin dovezi.'
  :kind==='language'
  ?'Predă regula, oferă exemple originale, un exercițiu gradual, rezolvare justificată și verificarea greșelilor.'
  :'Propune un plan, scrie un exemplu original, explică argumentele și oferă un exercițiu de revizuire.';
 return 'Țara: '+code+'; clasa/anul: '+grade+'; nivel: '+level(stage)+'; limba materiei: '+profile.language+'. Tema: '+title+'. '+assignment+' Respectă diferențele dintre cohortele 2026/27, profilul ales și programa locală. Nu pretinde că un autor sau o operă este obligatorie fără dovadă.';
}
// Distinct year progression per country. These are pedagogical, not asserted
// as a ministry-mandated ordering of literature or compulsory book titles.
const GRADE_PROGRESSIONS={
 MD:{beginner:['Sunete, silabe și primele povestiri','Cuvinte, propoziții și dialoguri','Povestirea pe baza textului citit','Personaje, idei principale și scurt rezumat'],
 lower:['Basme populare și limbaj figurat','Fabule, narațiune și dialog','Poezie: imagini și voce lirică','Proză: perspectiva narativă și personajul','Interpretare comparativă și eseu'],
 medium:['Literatura română din Moldova: contexte și genuri','Curente literare și comparația interpretărilor','Eseu argumentativ, sinteză și evaluare']},
 PL:{beginner:['Czytanie sylabowe i słuchanie opowiadań','Opowiadanie i plan wydarzeń','Postacie, dialogi i opisy','Interpretacja tekstów i krótkie wypracowanie'],
 lower:['Baśnie i legendy: symbol i morał','Narrator i punkt widzenia','Liryka i analiza środków językowych','Porównanie tekstów i rozprawka'],
 medium:['Romantyzm i interpretacja utworu','Pozytywizm, realizm i analiza narracji','Literatura XX wieku i świadectwa','Matura: rozprawka, konteksty i argumentacja']},
 HR:{beginner:['Čitanje i razumijevanje kratkog teksta','Pričanje događaja i jezična pravila','Opis lika i pripovijedanje','Književni tekst i sažetak'],
 lower:['Usmena književnost i pripovijetka','Lirska pjesma i pjesničke slike','Pripovjedač i likovi u prozi','Povezivanje književnosti i kulturnog konteksta'],
 medium:['Književni rodovi i povijesni kontekst','Romantizam i realizam','Moderna i suvremena književnost','Esej, interpretacija i matura']},
 RS:{beginner:['Почетно читање, писање и ћирилица','Приче, реченица и правилан изговор','Препричавање и опис','Разумевање текста и главне идеје'],
 lower:['Народна књижевност и мотиви','Лирика, рима и слике','Приповедач, ликови и дијалог','Аргументовање и поређење дела'],
 medium:['Књижевни родови и историјски контекст','Романтизам и реализам','Модерна књижевност и тумачење','Есеј, критика и матурска припрема']},
 HU:{beginner:['Betűk, hangok és rövid történetek','Szövegértés és eseményrend','Szereplők és párbeszéd','Összefoglalás és szövegalkotás'],
 lower:['Népmesék és elbeszélő formák','Versritmus és költői képek','Elbeszélés és jellemábrázolás','Szövegek összehasonlítása és érvelés'],
 medium:['Romantika és magyar líra','Realizmus, elbeszélés és műfajok','Modern irodalom és kritikus olvasás','Érettségi: érvelés és műelemzés']},
 AT:{beginner:['Lesenlernen, Laut und Buchstabe','Erzählfolge und eigenes Schreiben','Figuren und Textverständnis','Beschreibung und Zusammenfassung'],
 lower:['Sagen, Erzählung und Textsorten','Lyrik, Klang und Sprache','Erzählperspektiven und Charakterisierung','Argumentation und kritische Medienlektüre'],
 medium:['Literaturgeschichte und Interpretation','Drama, Konflikt und rhetorische Mittel','Moderne, Erzähltechnik und Perspektive','Textvergleich und Erörterung','Vertiefung: wissenschaftsorientierte Interpretation']},
 TR:{beginner:['Harf, hece ve ilk okuma','Olay sırası ve kısa hikâye','Karakter, betimleme ve diyalog','Metin yorumlama ve özet'],
 lower:['Masal ve geleneksel anlatı','Şiirde ses ve imge','Hikâyede anlatıcı ve karakter','Karşılaştırmalı okuma ve tartışma'],
 medium:['Metin türleri ve şiirin yapısı','Hikâye, roman ve anlatım','Edebî dönemler ve metinler arası ilişki','Yorum, eleştiri ve sınava hazırlık']}
};
const categories=[
 ['language','Limbă, gramatică și comunicare','grammar'],
 ['literature','Literatură și interpretare','genres'],
 ['authors','Autori și opere de explorat','authors'],
 ['composition','Redactare și argumentare','essay']
];
function rowsForGrade(code,stage,grade){
 const p=profiles[code],rows=[];
 const yearIndex=p.stages[stage].indexOf(grade);
 const yearTheme=GRADE_PROGRESSIONS[code][stage][yearIndex];
 if(!yearTheme)throw Error('Missing national year progression for '+code+'/'+stage+'/'+grade);
 rows.push([code.toLowerCase()+'-'+stage+'-'+grade+'-year-focus',
  yearTheme,
  focusInstruction(yearTheme,code,grade,stage,'literature')+
  ' În această clasă dezvoltă progresiv vocabularul, lectura și scrierea, cu obiective măsurabile și o evaluare finală adaptată vârstei.','genres']);
 rows.push([code.toLowerCase()+'-'+stage+'-'+grade+'-year-reading',
  'Atelier de lectură · '+yearTheme,
  focusInstruction(yearTheme,code,grade,stage,'literature')+
  ' Analizează un fragment verificabil ales de elev, identifică sursa, motivează ideea principală și răspunde la întrebări de comprehensiune.','commentary']);
 rows.push([code.toLowerCase()+'-'+stage+'-'+grade+'-year-writing',
  'Atelier de redactare · '+yearTheme,
  focusInstruction(yearTheme,code,grade,stage,'composition')+
  ' Scrie un text original adaptat clasei, urmărește coerența, ortografia și revizuirea prin criterii transparente.','essay']);
 for(const [type,_section,area] of categories){
  for(let i=0;i<p.chapters[type].length;i++){
   const title=p.chapters[type][i];
   rows.push([code.toLowerCase()+'-'+stage+'-'+grade+'-'+type+'-'+(i+1),title,
      focusInstruction(title,code,grade,stage,type),area]);
  }
 }
 return rows;
}
export const LIT_SEVEN_COUNTRY_PROGRAMS=Object.freeze(Object.fromEntries(
 Object.entries(profiles).map(([code,p])=>{
  const grades=Object.fromEntries(Object.entries(p.stages).map(([stage,ids])=>[stage,ids.slice()]));
  const byGrade=Object.fromEntries(Object.entries(p.stages).flatMap(([stage,ids])=>ids.map(grade=>[
   grade,rowsForGrade(code,stage,grade)
  ])));
  return [code,Object.freeze({
   source:p.source,sourceTitle:p.sourceTitle,note:p.note,regions:false,
   language:p.language,tracks:p.tracks,grades,
   verified:{}, // official framework located, detailed grade-by-grade sequence is advisory
   byGrade
  })];
 })
));
export const LIT_SEVEN_COUNTRY_META=Object.freeze(Object.fromEntries(
 Object.entries(profiles).map(([code,p])=>[code,{title:p.title,language:p.language,source:p.source,
  grades:p.stages,tracks:p.tracks}])
));
