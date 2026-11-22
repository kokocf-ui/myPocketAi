// One-time, offline education curriculum disclosure.
// State belongs to the installation (localStorage), never to an individual subject.
// This is an informational notice, not a claim of nationally verified school programmes.
export const EDUCATION_FIRST_USE_NOTICE_SCRIPT = String.raw`
const EDU_FIRST_NOTICE_KEY='pocketai.education.curriculumNotice.v1';
let eduFirstNoticeAcknowledged=false;
const EDU_FIRST_NOTICE_COPY={
 ro:['Informare privind conținutul educațional',
 'Materialele din myPocketAI sprijină învățarea și sunt adaptate, în măsura informațiilor disponibile, sistemelor de învățământ incluse.',
 'Programele școlare pot varia după țară, regiune, instituție și an de studiu. Unele lecții pot diferi de programa școlii din cauza modificărilor curriculare sau a disponibilității limitate a surselor oficiale.',
 'Pentru examene și evaluări, consultă programa oficială și recomandările profesorilor.','Am înțeles'],
 en:['About the educational content',
 'myPocketAI provides learning support adapted, where reliable information is available, to the education systems included.',
 'Curricula may vary by country, region, institution and school year. Some lessons may differ from your school syllabus because curricula change and official information may be limited.',
 'For exams and assessments, consult the official syllabus and your teachers.','I understand'],
 fr:['Information sur les contenus éducatifs',
 'myPocketAI propose des ressources pour apprendre, adaptées dans la mesure des informations disponibles aux systèmes éducatifs concernés.',
 'Les programmes peuvent varier selon le pays, la région, l’établissement et l’année scolaire. Certaines leçons peuvent différer du programme de votre école en raison de réformes ou de sources officielles limitées.',
 'Pour les examens et évaluations, consultez le programme officiel et vos enseignants.','J’ai compris'],
 de:['Hinweis zu den Lerninhalten',
 'myPocketAI unterstützt das Lernen und berücksichtigt, soweit verlässliche Informationen vorliegen, die jeweiligen Bildungssysteme.',
 'Lehrpläne unterscheiden sich je nach Land, Region, Schule und Jahrgang. Einzelne Lektionen können wegen Änderungen oder begrenzt verfügbarer amtlicher Quellen vom Schulstoff abweichen.',
 'Prüfen Sie für Prüfungen und Bewertungen den offiziellen Lehrplan und die Hinweise Ihrer Lehrkräfte.','Verstanden'],
 it:['Informazioni sui contenuti didattici',
 'myPocketAI offre supporto allo studio adattato, nei limiti delle informazioni disponibili, ai sistemi scolastici inclusi.',
 'I programmi variano per paese, regione, istituto e anno di studio. Alcune lezioni potrebbero non coincidere con il programma della scuola per aggiornamenti o per la disponibilità limitata di fonti ufficiali.',
 'Per esami e verifiche consulta il programma ufficiale e le indicazioni degli insegnanti.','Ho capito'],
 es:['Información sobre los contenidos educativos',
 'myPocketAI ofrece apoyo al aprendizaje adaptado, según la información disponible, a los sistemas educativos incluidos.',
 'Los planes de estudio pueden variar según el país, la región, el centro y el curso. Algunas lecciones pueden diferir del programa escolar debido a cambios o a la disponibilidad limitada de fuentes oficiales.',
 'Para exámenes y evaluaciones, consulta el programa oficial y las indicaciones del profesorado.','Entendido'],
 pt:['Informação sobre os conteúdos educativos',
 'O myPocketAI apoia a aprendizagem e adapta os materiais, dentro da informação disponível, aos sistemas de ensino abrangidos.',
 'Os programas variam por país, região, escola e ano de escolaridade. Algumas lições podem diferir do programa da escola devido a alterações ou à disponibilidade limitada de fontes oficiais.',
 'Para exames e avaliações, consulta o programa oficial e as orientações dos professores.','Compreendi'],
 nl:['Informatie over de lesinhoud',
 'myPocketAI ondersteunt het leren met materiaal dat waar mogelijk op de betrokken onderwijssystemen is afgestemd.',
 'Leerplannen verschillen per land, regio, instelling en leerjaar. Lessen kunnen afwijken van het schoolprogramma door wijzigingen of beperkte officiële informatie.',
 'Raadpleeg voor toetsen en examens het officiële programma en je docenten.','Begrepen'],
 hu:['Tájékoztatás az oktatási tartalomról',
 'A myPocketAI a tanulást támogatja, és a rendelkezésre álló információk alapján igazodik az érintett oktatási rendszerekhez.',
 'A tantervek ország, régió, intézmény és évfolyam szerint eltérhetnek. Egyes leckék a tantervi változások vagy a korlátozott hivatalos források miatt eltérhetnek az iskolai tananyagtól.',
 'Vizsgákhoz és értékelésekhez ellenőrizd a hivatalos tantervet és a tanárok útmutatását.','Értem'],
 pl:['Informacja o treściach edukacyjnych',
 'myPocketAI wspiera naukę i dostosowuje materiały do uwzględnionych systemów edukacji w zakresie dostępnych informacji.',
 'Programy różnią się zależnie od kraju, regionu, szkoły i klasy. Lekcje mogą odbiegać od programu szkolnego z powodu zmian lub ograniczonej dostępności źródeł urzędowych.',
 'Przed egzaminem sprawdź oficjalną podstawę programową i wskazówki nauczycieli.','Rozumiem'],
 ru:['Информация об учебных материалах',
 'myPocketAI помогает в обучении и по мере доступности надёжных сведений учитывает особенности образовательных систем.',
 'Учебные программы различаются по странам, регионам, учреждениям и классам. Некоторые уроки могут не совпадать со школьной программой из-за изменений или недостатка официальных источников.',
 'При подготовке к экзаменам сверяйтесь с официальной программой и рекомендациями учителей.','Понятно'],
 tr:['Eğitim içeriği hakkında bilgilendirme',
 'myPocketAI öğrenmeyi destekler ve mevcut güvenilir bilgilere göre kapsanan eğitim sistemlerine uyarlanır.',
 'Müfredatlar ülkeye, bölgeye, okula ve sınıfa göre değişebilir. Bazı dersler güncellemeler veya sınırlı resmî kaynaklar nedeniyle okulunuzun programından farklı olabilir.',
 'Sınavlar için resmî müfredatı ve öğretmenlerinizin yönlendirmelerini kontrol edin.','Anladım'],
 cs:['Informace o vzdělávacím obsahu',
 'myPocketAI podporuje učení a podle dostupných informací přizpůsobuje materiály jednotlivým vzdělávacím systémům.',
 'Osnovy se liší podle země, regionu, školy a ročníku. Některé lekce se mohou kvůli změnám či omezeným oficiálním zdrojům lišit od výuky ve vaší škole.',
 'Před zkouškami se řiďte oficiálními osnovami a pokyny učitelů.','Rozumím'],
 sk:['Informácie o vzdelávacom obsahu',
 'myPocketAI podporuje učenie a podľa dostupných informácií prispôsobuje materiály jednotlivým vzdelávacím systémom.',
 'Učebné osnovy sa môžu líšiť podľa krajiny, regiónu, školy a ročníka. Niektoré lekcie sa môžu odlišovať pre zmeny alebo obmedzené oficiálne zdroje.',
 'Pri skúškach sa riaďte oficiálnymi osnovami a odporúčaniami učiteľov.','Rozumiem']
};
function educationShowFirstUseNotice(){
 if(eduFirstNoticeAcknowledged)return false;
 try{if(localStorage.getItem(EDU_FIRST_NOTICE_KEY)==='acknowledged'){
  eduFirstNoticeAcknowledged=true;return false;
 }}catch{}
 if(document.getElementById('education-first-use-notice'))return false;
 const c=EDU_FIRST_NOTICE_COPY[String(state?.language||'ro').toLowerCase()]||EDU_FIRST_NOTICE_COPY.en;
 const overlay=document.createElement('div');
 overlay.id='education-first-use-notice';
 overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(12,15,23,.72);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;';
 const panel=document.createElement('section');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
 panel.setAttribute('aria-labelledby','education-first-use-notice-title');
 panel.style.cssText='width:min(100%,540px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;overflow:hidden;border-radius:16px;background:#fff;color:#18212e;box-shadow:0 15px 45px rgba(0,0,0,.3);box-sizing:border-box;';
 const title=document.createElement('h2');
 title.id='education-first-use-notice-title';title.textContent=c[0];
 title.style.cssText='font-size:1.06rem;line-height:1.3;margin:0;padding:20px 20px 12px;';
 const content=document.createElement('div');
 content.style.cssText='overflow-y:auto;overscroll-behavior:contain;padding:0 20px 8px;flex:1;min-height:0;line-height:1.5;font-size:.93rem;';
 for(let i=1;i<=3;i++){const p=document.createElement('p');p.textContent=c[i];p.style.margin='0 0 12px';content.append(p);}
 const footer=document.createElement('div');
 footer.style.cssText='padding:12px 20px 18px;flex-shrink:0;display:flex;justify-content:flex-end;';
 const agree=document.createElement('button');
 agree.type='button';agree.textContent=c[4];
 agree.style.cssText='background:#792744;color:#fff;border:0;border-radius:9px;padding:11px 22px;font-weight:700;min-height:44px;cursor:pointer;';
 agree.onclick=()=>{
  eduFirstNoticeAcknowledged=true;
  try{localStorage.setItem(EDU_FIRST_NOTICE_KEY,'acknowledged')}catch{}
  overlay.remove();
 };
 footer.append(agree);panel.append(title,content,footer);overlay.append(panel);
 document.body.append(overlay);agree.focus();
 return true;
}
`;
