// Worldwide Education: one country-first school-year selection for all
// subjects, without presenting an international approximation as the national
// legally prescribed syllabus. ISCED is a comparison framework, NOT a syllabus.
// https://www.uis.unesco.org/en/methods-and-tools/isced
// Countries with different regional or exam-board provisions require the
// region/board before a national-specific programme can be verified.
const seq=(start,end,prefix,labelRo,labelEn)=>Array.from({length:end-start+1},(_,i)=>{
 const n=start+i;
 return {id:prefix+n,ro:labelRo+' '+n,en:labelEn+' '+n};
});
const names=(names,roPrefix='',enPrefix='')=>names.map(([id,ro,en])=>({id,ro:roPrefix+ro,en:enPrefix+en}));
const scheme=(beginner,lower,medium,note,source=null)=>({beginner,lower,medium,advanced:[{id:'higher-education',ro:'Universitate · specializare',en:'Higher education · specialisation'}],note,source,verifiedCurriculum:false});
const fallbackNote='Clasele sunt trepte ISCED de orientare. Sistemul național, anii, profilurile și programa clasei nu au fost verificate. Poți schimba țara și nivelul.';
const fallback=scheme(
 seq(1,6,'P','Primar · anul','Primary · year'),
 seq(1,3,'L','Secundar inferior · anul','Lower secondary · year'),
 seq(1,3,'U','Secundar superior · anul','Upper secondary · year'),
 fallbackNote,
 'https://www.uis.unesco.org/en/methods-and-tools/isced'
);
const grades=(a,b,ro='Clasa',en='Grade')=>seq(a,b,'',ro,en);
const years=(a,b)=>seq(a,b,'Y','Year','Year');
const lv=(c,d,ro,en)=>seq(c,d,'',ro,en);
export const EDUCATION_WORLDWIDE_SCHEMES={
 // Grade names are national; these entries are not claims that all school
 // streams or national lesson plans have been legally verified.
 MD:scheme(grades(1,4,'Clasa','Grade'),grades(5,9,'Clasa','Grade'),grades(10,12,'Clasa','Grade'),
  'Republica Moldova: primar I–IV, gimnaziu V–IX, liceu X–XII. Programa de română diferă de România; consultarea pentru reforma 2026 nu este încă echivalentă cu aprobarea.',
  'https://www.edu.gov.md/ro/content/invatamint-general'),
 HR:scheme(grades(1,4,'Razred','Grade'),grades(5,8,'Razred','Grade'),seq(1,4,'G','Gimnazija · anul','Gymnasium · year'),
  'Croația: osnovna škola are opt clase; gimnazija și strukovna škola sunt trasee diferite.',
  'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_01_10_215.html'),
 RS:scheme(grades(1,4,'Razred','Grade'),grades(5,8,'Razred','Grade'),seq(1,4,'G','Gimnazija · anul','Gymnasium · year'),
  'Serbia: curriculumul pentru clasele I, V și unele clase de gimnaziu are actualizări în 2026. Alege alfabetul și filiera.',
  'https://zuov.gov.rs/zakoni-i-pravilnici/'),
 HU:scheme(grades(1,4,'Évfolyam','Grade'),grades(5,8,'Évfolyam','Grade'),grades(9,13,'Évfolyam','Grade'),
  'Ungaria: gimnázium 8 ani de la clasa 5, 6 ani de la clasa 7, 4 ani de la clasa 9; technikum poate continua până la 13. Alte școli profesionale au trasee distincte.',
  'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat'),

 'GB-SCT':scheme(seq(1,7,'P','Primary','Primary'),seq(1,3,'S','Secondary','Secondary'),seq(4,6,'S','Secondary','Secondary'),'Stadiile școlare sunt orientative; specializările și S4–S6 se aleg potrivit școlii și calificării.','https://education.gov.scot/'),
 'GB-WLS':scheme(years(1,6),years(7,9),years(10,13),'Curriculum for Wales este organizat pe etape de progres și programe; anii nu sunt capitole obligatorii.','https://hwb.gov.wales/'),
 'GB-NIR':scheme(years(1,7),years(8,10),years(11,14),'Anii sunt orientativi pentru Irlanda de Nord; examenele și traseele diferă după calificare.','https://ccea.org.uk/'),
 'IE':scheme(names([['1C','Class 1','Class 1'],['2C','Class 2','Class 2'],['3C','Class 3','Class 3'],['4C','Class 4','Class 4'],['5C','Class 5','Class 5'],['6C','Class 6','Class 6']]),seq(1,3,'J','Junior Cycle · anul','Junior Cycle · year'),seq(1,3,'S','Senior Cycle · anul','Senior Cycle · year'),'Pot exista Transition Year, programe și opțiuni diferite.','https://www.gov.ie/en/organisation/department-of-education-and-youth/'),
 FR:scheme(names([['CP','CP','CP'],['CE1','CE1','CE1'],['CE2','CE2','CE2'],['CM1','CM1','CM1'],['CM2','CM2','CM2']]),names([['6e','6e','6e'],['5e','5e','5e'],['4e','4e','4e'],['3e','3e','3e']]),names([['2nde','Seconde','Seconde'],['1re','Première','Première'],['terminale','Terminale','Terminale']]),'Clasele urmează denumirile uzuale; programa și opțiunile depind de ciclul și traseul ales.','https://www.education.gouv.fr/'),
 ES:scheme(seq(1,6,'P','Primaria · anul','Primaria · year'),seq(1,4,'ESO','ESO · anul','ESO · year'),seq(1,2,'B','Bachillerato · anul','Bachillerato · year'),'Programele diferă în funcție de comunitatea autonomă; fără comunitate nu confirmăm programa locală.','https://www.educacionfpydeportes.gob.es/'),
 IT:scheme(seq(1,5,'P','Scuola primaria · anul','Scuola primaria · year'),seq(1,3,'M','Secondaria I · anul','Lower secondary · year'),seq(1,5,'S','Secondaria II · anul','Upper secondary · year'),'În liceu și școli tehnice/profesionale există trasee distincte.','https://www.mim.gov.it/'),
 PT:scheme(grades(1,4,'Ano','Year'),grades(5,9,'Ano','Year'),grades(10,12,'Ano','Year'),'Împărțirea în cicluri școlare portugheze este diferită de nivelurile generale ale meniului.','https://www.dge.mec.pt/'),
 DE:scheme(grades(1,4,'Klasse','Grade'),grades(5,10,'Klasse','Grade'),grades(11,13,'Klasse','Grade'),'Durata Grundschule și clasele secundare diferă între landuri și trasee; configurație orientativă până la alegerea landului.','https://www.kmk.org/'),
 AT:scheme(grades(1,4,'Klasse','Grade'),grades(5,8,'Klasse','Grade'),grades(9,13,'Klasse','Grade'),'Traseele și durata școlarizării diferă între AHS (până în clasa 12) și BHS (până în clasa 13); anul suplimentar nu este obligatoriu tuturor.'),
 PL:scheme(names([['I','Klasa I','Grade I'],['II','Klasa II','Grade II'],['III','Klasa III','Grade III'],['IV','Klasa IV','Grade IV']]),names([['V','Klasa V','Grade V'],['VI','Klasa VI','Grade VI'],['VII','Klasa VII','Grade VII'],['VIII','Klasa VIII','Grade VIII']]),seq(1,4,'L','Liceu · anul','Upper secondary · year'),'Clasele 1–8 pot aparține aceleiași școli; separarea în aplicație este didactică.'),
 NL:scheme(seq(1,8,'G','Groep','Group'),seq(1,3,'V','Voortgezet · anul','Secondary · year'),seq(4,6,'V','Voortgezet · anul','Secondary · year'),'Traseele VMBO/HAVO/VWO au durate și programe diferite; anii nu reprezintă un program unic.'),
 BE:scheme(grades(1,6,'Primar · anul','Primary · year'),seq(1,3,'S','Secundar · anul','Secondary · year'),seq(4,6,'S','Secundar · anul','Secondary · year'),'Învățământul este organizat de comunități lingvistice; trebuie aleasă comunitatea pentru programă exactă.'),
 GR:scheme(grades(1,6,'Dimotiko · clasa','Primary · grade'),seq(1,3,'G','Gymnasio · anul','Lower secondary · year'),seq(1,3,'L','Lykeio · anul','Upper secondary · year'),'Traseele și opționalele trebuie confirmate cu școala.'),
 TR:scheme(grades(1,4,'Sınıf','Grade'),grades(5,8,'Sınıf','Grade'),grades(9,12,'Sınıf','Grade'),'Conținutul exact diferă după anul școlar și programul școlii.'),
 US:scheme(names([['K','Kindergarten','Kindergarten'],...Array.from({length:5},(_,i)=>[String(i+1),'Grade '+(i+1),'Grade '+(i+1)])]),grades(6,8),grades(9,12),'Standardele și materiile sunt stabilite de state și districte; niciun plan federal unic nu este afirmat.'),
 CA:scheme(grades(1,6),grades(7,9),grades(10,12),'Provincia/teritoriul stabilește programele; clasele sunt o orientare, nu un curriculum național unic.'),
 AU:scheme(names([['F','Foundation','Foundation'],...Array.from({length:6},(_,i)=>['Y'+(i+1),'Year '+(i+1),'Year '+(i+1)])]),years(7,9),years(10,12),'Denumirea Foundation și calificările pot varia între state/teritorii.'),
 NZ:scheme(years(1,6),years(7,10),years(11,13),'Traseele și evaluările variază în funcție de școală și calificare.'),
 JP:scheme(seq(1,6,'P','Shōgakkō · anul','Elementary · year'),seq(1,3,'J','Chūgakkō · anul','Junior high · year'),seq(1,3,'H','Kōkō · anul','Senior high · year'),'Distribuția exactă a materiilor și opționalelor nu este verificată.'),
 CN:scheme(grades(1,6),seq(1,3,'J','Junior · anul','Junior secondary · year'),seq(1,3,'H','Senior · anul','Senior secondary · year'),'Structura și materia pot varia regional și după tipul școlii; cere programa locală.'),
 KR:scheme(grades(1,6),seq(1,3,'M','Middle · anul','Middle · year'),seq(1,3,'H','High · anul','High · year'),'Curriculumul exact depinde de revizuirea națională și traseul liceal.'),
 IN:scheme(grades(1,5),grades(6,8),grades(9,12),'Cerințele variază în funcție de stat și de board (CBSE/ICSE/stat); nu presupunem o singură programă.'),
 BR:scheme(seq(1,5,'F','Fundamental · anul','Elementary · year'),seq(6,9,'F','Fundamental · anul','Lower secondary · year'),seq(1,3,'M','Ensino médio · anul','Upper secondary · year'),'Implementarea BNCC și conținutul local diferă la nivel de stat și școală.'),
 MX:scheme(seq(1,6,'P','Primaria · anul','Primary · year'),seq(1,3,'S','Secundaria · anul','Secondary · year'),seq(1,3,'B','Bachillerato · anul','Upper secondary · year'),'Parcurs orientativ; programele și subsistemele de liceu diferă.'),
 ZA:scheme(grades(1,7),grades(8,9),grades(10,12),'Conținutul și cerințele CAPS trebuie verificate pentru anul școlar și disciplina aleasă.'),
 EG:scheme(grades(1,6),grades(7,9),grades(10,12),'Traseu orientativ; verifică școala, limba de predare și programa națională actuală.'),
 KE:scheme(grades(1,6),seq(1,3,'J','Junior secondary · anul','Junior secondary · year'),seq(1,3,'S','Senior school · anul','Senior school · year'),'Reforma curriculumului și schimbarea structurii școlare necesită confirmare pentru cohorta curentă.'),
 AR:scheme(grades(1,6),grades(7,9),grades(10,12),'Provincia stabilește structura și adaptările curriculare; selecția este orientativă.'),
 CH:scheme(grades(1,6),grades(7,9),grades(10,12),'Elveția are organizare cantonală; pentru programa exactă trebuie cantonul și limba de predare.'),
 AE:scheme(grades(1,5),grades(6,9),grades(10,12),'Educația publică și privată poate urma sisteme curriculare diferite; parcurs orientativ.'),
 SG:scheme(grades(1,6,'Primary','Primary'),seq(1,4,'S','Secondary · anul','Secondary · year'),seq(1,3,'P','Post-secondary · anul','Post-secondary · year'),'Traseele secundare/postsecundare nu sunt identice pentru toate școlile.'),
 PH:scheme(grades(1,6),grades(7,10),grades(11,12),'Curriculumul și calendarul tranzițiilor trebuie confirmate pentru cohorta curentă.'),
 ID:scheme(grades(1,6),grades(7,9),grades(10,12),'Conținutul național și specializările pot diferi după tipul școlii.'),
 TH:scheme(grades(1,6),grades(7,9),grades(10,12),'Anotimpul școlar și programele locale pot necesita ajustare.'),
 VN:scheme(grades(1,5),grades(6,9),grades(10,12),'Programă orientativă; programele și numărul de ani pot varia în timp.'),
 PK:scheme(grades(1,5),grades(6,8),grades(9,12),'Programele variază în funcție de provincie și board.'),
 NG:scheme(grades(1,6),grades(7,9),grades(10,12),'Programele pot diferi după stat și instituție.'),
 UA:scheme(grades(1,4),grades(5,9),grades(10,12),'Tranziția către noile structuri poate diferi după cohortă; verifică programa actuală.'),
 IL:scheme(grades(1,6),grades(7,9),grades(10,12),'Diferite sisteme și limbi de predare; configurație orientativă.')
};
export const EDUCATION_WORLDWIDE_FALLBACK=fallback;
export function worldwideSchoolYears(country,level,subject=''){
 const lv=level==='intermediate'?'medium':level;
 const map=EDUCATION_WORLDWIDE_SCHEMES[String(country||'').toUpperCase()]||fallback;
 if(!['beginner','lower','medium','advanced'].includes(lv))return [];
 return map[lv].map(x=>({...x,verifiedCurriculum:false,stage:lv}));
}
export function worldwideSchoolNotice(country){
 const map=EDUCATION_WORLDWIDE_SCHEMES[String(country||'').toUpperCase()]||fallback;
 return {verifiedCurriculum:false,note:map.note,source:map.source,schemeMapped:map!==fallback};
}
export function worldwideStudyChapters(country,subject,level,grade,countryRo,countryEn,generalPaths){
 const lv=level==='intermediate'?'medium':level;
 if(subject!=='history'&&subject!=='geography')return [];
 const base=generalPaths?.[subject]?.[lv]||[];
 const code=String(country||'').replace(/[^A-Z0-9-]/g,'').slice(0,12)||'WORLD';
 const yr=String(grade||'').replace(/[^A-Za-z0-9-]/g,'').slice(0,16)||lv;
 const regionRo=String(countryRo||country||'țara selectată').slice(0,90);
 const regionEn=String(countryEn||country||'selected country').slice(0,90);
 const common=base.map(([ro,en,focus],i)=>[
  'intl-'+code+'-'+subject+'-'+lv+'-'+yr+'-'+(i+1),
  ro,en,focus+' '+(subject==='history'?
  'Examinează izvoare datate și distinge faptele documentate de interpretări.':
  'Localizează și verifică hărți, unități de măsură, surse și ani.')
 ]);
 const local=subject==='history'?
 [
  ['Istoria locală și sursele din '+regionRo,'Local history and sources in '+regionEn,'Caută surse oficiale, muzee, arhive și documente datate despre regiuni, nu afirmații inventate.'],
  ['Transformări politice și comunități din '+regionRo,'Communities and political changes in '+regionEn,'Identifică perioade, schimbări instituționale și interpretări concurente cu dovezi independente.'],
  ['Patrimoniu cultural și situri istorice din '+regionRo,'Cultural heritage in '+regionEn,'Analizează monumente și patrimoniu din surse catalogate, fără atribuiri neconfirmate.'],
  ['Relații regionale, migrații și schimburi','Regional relations, migration and exchange','Compară istorii regionale și mișcări de populație în surse documentate.'],
  ['Proiect istoric: cronologie verificabilă','Historical enquiry: evidence-based timeline','Construiește o cronologie locală, notează sursa fiecărui fapt și limitele dovezilor.']
 ]:
 [
  ['Harta fizică și politică a '+regionRo,'Physical and political maps of '+regionEn,'Localizează regiuni, frontiere și forme de relief pe hărți datate, fără a inventa date.'],
  ['Clima, apele și peisajele din '+regionRo,'Climate, waters and landscapes of '+regionEn,'Compară seturi de date meteorologice și hidrografice cu unități și perioade explicite.'],
  ['Populație, orașe și așezări din '+regionRo,'Population and settlements in '+regionEn,'Folosește recensăminte și date instituționale cu anul de referință.'],
  ['Economia, resursele și transporturile din '+regionRo,'Economy, resources and transport in '+regionEn,'Compară sectoare economice și rețele de transport cu surse actualizate.'],
  ['Proiect geografic: observație și hartă','Geographical enquiry: fieldwork and map','Formulează o întrebare, analizează o hartă și compară date, cu limitele metodei.']
 ];
 return [...common,...local.map(([ro,en,focus],i)=>['intl-'+code+'-'+subject+'-'+lv+'-'+yr+'-local'+(i+1),ro,en,focus])];
}
