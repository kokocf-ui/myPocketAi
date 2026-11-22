// School-stage evidence for Biology in European curricula.
// Only the listed source's general framework is evidenced; no source below
// establishes a mandatory chapter-by-year order throughout a country.
export const BIOLOGY_COUNTRY_REFERENCES=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',name:'Biologie V–VIII / Științe ale naturii la primar',kind:'separate-lower',scope:'grades-5-8',
  note:'Biologia este disciplină separată în clasele V–VIII; la primar noțiunile despre viețuitoare apar în alte discipline. Materialele de liceu depind de filieră, profil și programa aplicabilă.'},
 'GB-ENG':{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',
  name:'Science — Biology strand',kind:'integrated',scope:'key-stage-3',
  note:'Biologia este inclusă în Science la KS3; școala publică propriul plan anual. La GCSE/A-level, combinația și opțiunile depind de exam board și școală.'},
 'GB-SCT':{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',
  name:'Curriculum for Excellence — Sciences',kind:'integrated',scope:'BGE-to-S3',
  note:'Experiences and outcomes din Sciences sunt organizate pe niveluri CfE, nu pe o ordine națională a lecțiilor pentru fiecare an S1–S3.'},
 'GB-WLS':{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/',
  name:'Science and Technology',kind:'integrated',scope:'progression-steps',
  note:'Țara Galilor folosește progresie în Science and Technology; școlile stabilesc distribuția locală a conținutului biologic.'},
 'GB-NIR':{source:'https://ccea.org.uk/key-stage-3/curriculum/science-and-technology',
  name:'Science and Technology',kind:'integrated',scope:'KS3',
  note:'Conținutul biologic este parte din Science and Technology; examenele și secvența în liceu necesită specificația instituției.'},
 IE:{source:'https://www.curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/',
  name:'Junior Cycle Science — Biological world',kind:'integrated',scope:'junior-cycle-three-years',
  note:'Junior Cycle Science are domeniul Biological world, dar rezultatele de învățare nu stabilesc o ordine națională obligatorie J1/J2/J3.'},
 FR:{source:'https://www.education.gouv.fr/l-enseignement-des-sciences-7076',
  name:'Sciences et technologie / SVT',kind:'mixed',scope:'cycles-3-and-4',
  note:'În primar și cycle 3 științele sunt integrate; SVT din collège este organizată pe cicluri, cu ordinea anuală stabilită de școală și de reformele aplicabile.'},
 ES:{source:'https://www.boe.es/buscar/act.php?id=BOE-A-2022-4975',
  name:'Biología y Geología — ESO',kind:'region-dependent',scope:'ESO-minimum-curriculum',
  note:'Biología y Geología are cerințe de bază în ESO, dar comunitatea autonomă, traseul și anul definesc programa efectivă.'},
 PT:{source:'https://www.dge.mec.pt/aprendizagens-essenciais-ensino-basico',
  name:'Ciências Naturais',kind:'combined',scope:'basic-education',
  note:'Noțiunile biologice sunt studiate în Ciências Naturais; repartizarea anuală și opțiunile liceale trebuie verificate pentru nivel și filieră.'},
 DE:{source:'https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',
  name:'Biologie — Länder',kind:'region-dependent',scope:'common-standards',
  note:'Programele sunt stabilite de Land, tipul școlii și filieră; nu există o succesiune națională unică obligatorie pentru fiecare clasă.'},
 AT:{source:'https://www.bmb.gv.at/',name:'Biologie und Umweltbildung',kind:'region-dependent',scope:'school-type',
  note:'Traseul Biologie und Umweltbildung diferă după tipul de școală și anul de studiu; programele trebuie confruntate cu școala.'},
 CH:{source:'https://www.edk.ch/',name:'Natur und Technik / Biologie',kind:'region-dependent',scope:'canton',
  note:'Cantonul și limba predării determină obiectivele biologice; traseul propus nu este un curriculum cantonal certificat.'},
 IT:{source:'https://www.mim.gov.it/',name:'Scienze / Biologia',kind:'integrated',scope:'school-stream',
  note:'La școala secundară inferioară, biologia este parte a Scienze; la liceu repartizarea depinde de tipul școlii și filieră.'},
 NL:{source:'https://www.slo.nl/',name:'Natuur en techniek / Biologie',kind:'mixed',scope:'core-goals',
  note:'Țintele de învățare și cursurile pot fi integrate; tipul de școală și traseul secundar stabilesc predarea distinctă.'},
 NO:{source:'https://www.udir.no/lk20/nat01-05?lang=eng',name:'Naturfag',kind:'integrated',scope:'natural-science-competence-goals',
  note:'Naturfag este disciplina integrată; competențele sunt stabilite pe niveluri de progres, nu ca plan biologic anual universal.'},
 FI:{source:'https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education',
  name:'Environmental studies / Biology',kind:'mixed',scope:'national-core-education',
  note:'La primar științele vieții sunt integrate, apoi pot apărea obiective separate; organizarea locală poate varia.'},
 SE:{source:'https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan',
  name:'Biologi — grundskolan',kind:'separate',scope:'content-bands',
  note:'Biologi are obiective pe benzi de clase; nu presupunem că fiecare temă aparține unui singur an din banda respectivă.'},
 DK:{source:'https://eng.uvm.dk/primary-and-lower-secondary-education/the-folkeskole/subjects-and-curriculum',
  name:'Biologi — folkeskole',kind:'mixed',scope:'folkeskole-bands',
  note:'Natur/teknologi este integrată anterior, iar Biologi apare ulterior; distribuția exactă pe ani depinde de planificarea școlii.'},
 HU:{source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',
  name:'Természettudomány / Biológia',kind:'mixed',scope:'NAT-2020-framework',
  note:'Biologia poate fi combinată cu științele naturale în unele clase; traseul și anul obligatoriu depind de programul aplicat și de tipul școlii.'},
 PL:{source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/biologia',
  name:'Biologia — szkoła podstawowa',kind:'separate',scope:'basic-school',
  note:'Programul Biologia diferă între clase și cohorte; materialul este o secvență originală, nu o transcriere a fiecărei lecții din programa poloneză.'},
 TR:{source:'https://mufredat.meb.gov.tr/',name:'Fen Bilimleri / Biyoloji',kind:'mixed',scope:'cohort-dependent',
  note:'Fen Bilimleri integrează noțiuni biologice în gimnaziu; Biyoloji este distinctă în liceu, cu reforme aplicate progresiv pe cohorte.'}
});
export const BIOLOGY_EUROPE_FALLBACK_SOURCE='https://eurydice.eacea.ec.europa.eu/national-education-systems';
export function biologyCountryStageInfo({country='',stage='lower',grade='',years=[]}={}){
 const code=String(country||'').toUpperCase(),year=String(grade||'');
 const list=Array.isArray(years)?years:[];
 const pos=list.findIndex(y=>String(y?.id)===year);
 if(!year||pos<0)return {country:code,stage,grade:year,status:'invalid-selection',
  kind:'unknown',source:null,verifiedAnnual:false,yearPosition:-1};
 const reference=BIOLOGY_COUNTRY_REFERENCES[code]||null;
 const primary=stage==='primary',university=stage==='advanced',upper=stage==='upper';
 const kind=primary?'integrated':upper?'track-dependent':university?'university-dependent':
  reference?.kind==='separate-lower'?'separate':reference?.kind||'unverified';
 const note=primary?'Biologia la nivel primar reprezintă învățarea despre viețuitoare, integrată în Științe sau discipline echivalente; nu este prezentată ca Biologie separată.':
  upper?'Ordinea lecțiilor este orientativă; materiile de liceu diferă după filieră, profil, exam board și cohortă.':
  university?'Cursurile variază după universitate, program și specializare; verifică planul de învățământ al instituției.':
  reference?.note||'Nu există verificare oficială anuală pentru această țară. Lecțiile sunt originale, orientative; nu reprezintă programa obligatorie sau un manual național.';
 return {
  country:code,stage,grade:year,kind,
  status:reference?'framework-stage-advisory-year':'curriculum-unverified',
  source:reference?.source||BIOLOGY_EUROPE_FALLBACK_SOURCE,
  sourceScope:reference?.scope||'structure-only / no annual Biology evidence',
  programme:reference?.name||'Biology / life science — advisory',
  yearPosition:pos,yearCount:list.length,verifiedAnnual:false,note
 };
}
