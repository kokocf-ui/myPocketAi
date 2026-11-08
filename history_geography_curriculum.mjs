// History & Geography curricula: educational pathways, NOT a claim of full national accreditation.
// The country choice is independent of physical location, language and subject.
export const HG_SUBJECTS=[
 {id:'history',ro:'Istorie',en:'History',icon:'🏛️'},
 {id:'geography',ro:'Geografie',en:'Geography',icon:'🌍'}
];
export const HG_LEVELS=[
 {id:'beginner',ro:'Începător · primar',en:'Beginner · primary',focus:'Recunoaștere, cronologie, descrieri și orientare'},
 {id:'lower',ro:'Începător · gimnaziu',en:'Beginner · lower secondary',focus:'Cronologie, surse și interpretare la nivel de gimnaziu'},
 {id:'medium',ro:'Mediu · liceu',en:'Intermediate · upper secondary',focus:'Analiză de surse, comparație și argumentare la nivel de liceu'},
 {id:'advanced',ro:'Avansat · universitar',en:'Advanced · university',focus:'Metode de cercetare, GIS, izvoare, interpretări și argumentare'}
];
export const HG_SCOPES=[
 {id:'world',ro:'Universală / internațională',en:'Global / international'},
 {id:'national',ro:'Națională',en:'National'},
 {id:'regional',ro:'Regională / locală',en:'Regional / local'}
];
export const HG_COUNTRIES=[
 {id:'GB-ENG',ro:'Anglia',en:'England',parent:'GB',source:'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study'},
 {id:'GB-SCT',ro:'Scoția',en:'Scotland',parent:'GB',source:'https://education.gov.scot/'},
 {id:'GB-WLS',ro:'Țara Galilor',en:'Wales',parent:'GB',source:'https://hwb.gov.wales/'},
 {id:'GB-NIR',ro:'Irlanda de Nord',en:'Northern Ireland',parent:'GB',source:'https://ccea.org.uk/'},
 {id:'RO',ro:'România',en:'Romania',parent:'RO',source:'https://www.edu.ro/'},
 {id:'FR',ro:'Franța',en:'France',parent:'FR',source:'https://www.education.gouv.fr/'},
 {id:'DE',ro:'Germania',en:'Germany',parent:'DE',source:'https://www.kmk.org/'},
 {id:'IT',ro:'Italia',en:'Italy',parent:'IT',source:'https://www.mim.gov.it/'},
 {id:'ES',ro:'Spania',en:'Spain',parent:'ES',source:'https://educagob.educacionfpydeportes.gob.es/'},
 {id:'OTHER',ro:'Altă țară (introdu manual)',en:'Other country (enter manually)',parent:null,source:null}
];
export const HG_HISTORY_TOPICS=[
 {id:'prehistory',ro:'Preistorie și primele comunități',en:'Prehistory and first societies',period:"Înainte de 3000 î.Hr.",periodEn:"Before 3000 BCE",query:'preistorie, paleolitic, neolitic, arheologie'},
 {id:'antiquity',ro:'Antichitate și civilizații',en:'Antiquity and civilizations',period:"3000 î.Hr. – 500 d.Hr.",periodEn:"3000 BCE – 500 CE",query:'Egipt, Mesopotamia, Grecia, Roma, Persia, India, China'},
 {id:'medieval',ro:'Evul Mediu',en:'Middle Ages',period:"500–1500",periodEn:"500–1500",query:'state, imperii, religii, societate medievală'},
 {id:'earlymodern',ro:'Renaștere și epoca modernă',en:'Renaissance and early modern',period:"1450–1800",periodEn:"1450–1800",query:'explorări, Renaștere, Reformă, revoluții'},
 {id:'industrial',ro:'Revoluții și industrializare',en:'Revolutions and industrialisation',period:"1750–1914",periodEn:"1750–1914",query:'revoluții, industrializare, colonialism'},
 {id:'twentieth',ro:'Războaie mondiale și secolul XX',en:'World wars and the 20th century',period:"1914–1991",periodEn:"1914–1991",query:'fronturi, genocid, decolonizare, Războiul Rece'},
 {id:'contemporary',ro:'Lumea contemporană',en:'Contemporary world',period:"1991–prezent",periodEn:"1991–present",query:'globalizare, integrare, transformări geopolitice'},
 {id:'civilisations',ro:'Civilizații, cultură și știință',en:'Civilizations, culture and science',period:"Toate epocile",periodEn:"All periods",query:'cultură, artă, economie, religii, descoperiri'},
 {id:'methods',ro:'Istoriografie și surse',en:'Historiography and sources',period:"Toate epocile",periodEn:"All periods",query:'izvoare primare, arheologie, bibliografie, cauzalitate'},
 {id:'national',ro:'Istorie națională',en:'National history',period:"Toate epocile",periodEn:"All periods",query:'istoria statului selectat'},
 {id:'regional',ro:'Istorie regională și locală',en:'Regional and local history',period:"Toate epocile",periodEn:"All periods",query:'istorie locală, patrimoniu, monumente'}
];
export const HG_GEOGRAPHY_TOPICS=[
 {id:'earth',ro:'Pământul, coordonate și orientare',en:'Earth, coordinates and navigation',query:'glob, coordonate geografice, fusuri orare'},
 {id:'physical',ro:'Relief, geologie și soluri',en:'Landforms, geology and soils',query:'relief, plăci tectonice, roci, soluri'},
 {id:'climate',ro:'Atmosferă, climă și vreme',en:'Atmosphere, climate and weather',query:'circulație atmosferică, zone climatice'},
 {id:'water',ro:'Ape, oceane și hidrologie',en:'Water, oceans and hydrology',query:'râuri, bazine hidrografice, oceane'},
 {id:'biomes',ro:'Biosferă și ecosisteme',en:'Biosphere and ecosystems',query:'biomuri, biogeografie, biodiversitate'},
 {id:'human',ro:'Populație și migrații',en:'Population and migration',query:'demografie, urbanizare, migrație'},
 {id:'economic',ro:'Economie, agricultură și resurse',en:'Economy, agriculture and resources',query:'energie, industrie, economie'},
 {id:'political',ro:'State, granițe și geopolitică',en:'Countries, borders and geopolitics',query:'state, organizații și regiuni'},
 {id:'continents',ro:'Continente și regiuni ale lumii',en:'Continents and world regions',query:'Europa, Asia, Africa, Americi, Oceania, Antarctica'},
 {id:'cartography',ro:'Cartografie și GIS',en:'Cartography and GIS',query:'scară, proiecții, GIS, teledetecție'},
 {id:'environment',ro:'Mediu și sustenabilitate',en:'Environment and sustainability',query:'resurse, poluare, schimbări climatice'},
 {id:'national',ro:'Geografie națională',en:'National geography',query:'relief, populație, rețea hidrografică națională'},
 {id:'regional',ro:'Geografie regională și locală',en:'Regional and local geography',query:'unități administrative, localități, vecinătăți'}
];
export const HG_SPECIALISATIONS={
 history:[
  ['archaeology','Arheologie','Archaeology'],['ancient','Istorie antică','Ancient history'],
  ['medieval','Medievistică','Medieval studies'],['military','Istorie militară','Military history'],
  ['social','Istorie socială și economică','Social and economic history'],
  ['religions','Istoria religiilor','History of religions'],
  ['political','Istorie politică și diplomatică','Political and diplomatic history'],
  ['heritage','Patrimoniu și muzeologie','Heritage and museology'],
  ['historiography','Istoriografie și arhivistică','Historiography and archival methods']
 ],
 geography:[
  ['geomorphology','Geomorfologie','Geomorphology'],['climatology','Climatologie','Climatology'],
  ['hydrology','Hidrologie','Hydrology'],['urban','Geografie urbană','Urban geography'],
  ['population','Geografia populației','Population geography'],
  ['economics','Geografie economică','Economic geography'],
  ['gis','GIS și cartografie digitală','GIS and digital cartography'],
  ['remote','Teledetecție','Remote sensing'],
  ['environment','Geografie ambientală','Environmental geography']
 ]
};
// Maps show exact time-of-study source reference; NEVER substitute present-day borders.
// A map not available for the selected year and topic must remain unavailable, not be invented.
export const HG_VERIFIED_MAPS=[
 {id:'rome117',topic:'antiquity',year:117,countries:['Italia','Italy'],label:'Imperiul Roman în 117 d.Hr.',kind:'political',
  source:'https://commons.wikimedia.org/wiki/File:Roman_Empire-117AD.png',certainty:'schematic',region:'Europe',credit:'Wikimedia Commons: Roman Empire-117AD.png'},
 {id:'rome395',topic:'antiquity',year:395,countries:['Italia','Italy'],label:'Împărțirea Imperiului Roman în 395 d.Hr.',kind:'political',
  source:'https://commons.wikimedia.org/wiki/File:Partition_of_the_Roman_Empire_in_395_AD.png',certainty:'schematic',region:'Europe',credit:'Wikimedia Commons: Partition of the Roman Empire in 395 AD.png'},
 {id:'romanian1916',topic:'twentieth',year:1916,countries:['România','Romania'],label:'Campania din România: contraofensivele din septembrie–octombrie 1916',kind:'military',certainty:'period',region:'Romania',
  source:'https://commons.wikimedia.org/wiki/File:CampañaRumanaSeptiembreOctubre1916.svg',image:'https://commons.wikimedia.org/wiki/Special:FilePath/CampañaRumanaSeptiembreOctubre1916.svg',credit:'United States Military Academy / Wikimedia Commons',period:'septembrie–octombrie 1916'},
 {id:'levant1300bce',topic:'antiquity',year:-1300,countries:['Levant'],label:'Rute comerciale în Levant, aproximativ 1300 î.Hr.',kind:'economic',certainty:'approximate',region:'Levant',
  source:'https://commons.wikimedia.org/wiki/File:Ancient_Levant_routes.png',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Ancient_Levant_routes.png',credit:'Wikimedia Commons, hartă de sinteză',period:'circa 1300 î.Hr.'},
 {id:'schism1054',topic:'medieval',year:1054,countries:['Italia','Italy','Grecia','Greece'],label:'Marea Schismă: arii religioase în jurul anului 1054',kind:'cultural',certainty:'approximate',region:'Europe',
  source:'https://commons.wikimedia.org/wiki/File:Great_Schism_1054.svg',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Great_Schism_1054.svg',credit:'Wikimedia Commons, reconstrucție istorică',period:'circa 1054 d.Hr.'},
 {id:'europe1918',topic:'twentieth',year:1918,countries:['România','Romania','Italia','Italy','France','Franța','England','Anglia'],label:'Europa în 1918 (reconstituire)',kind:'political',
  source:'https://commons.wikimedia.org/wiki/File:Europe_1918.PNG',certainty:'schematic',region:'Europe',credit:'Wikimedia Commons: Europe 1918.PNG'}
];
export function hgMapsFor(year,topic,kind='political'){
 const y=Number(year);
 if(!Number.isInteger(y)||!Number.isFinite(y))return [];
 return HG_VERIFIED_MAPS.filter(m=>m.year===y&&m.topic===topic&&m.kind===kind);
}
export function hgCountrySuggestion(lat,lon){
 // Rough geographic hint only, never a claim of reverse-geocoded country.
 const a=Number(lat),b=Number(lon);
 if(!Number.isFinite(a)||!Number.isFinite(b))return null;
 if(a>=49.8&&a<=59&&b>=-8.8&&b<=2.1)return 'GB-ENG';
 if(a>=43.5&&a<=48.3&&b>=20.2&&b<=29.8)return 'RO';
 return null;
}
