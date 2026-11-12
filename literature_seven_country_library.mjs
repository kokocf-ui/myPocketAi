// Original bibliographic metadata for seven national Language & Literature routes.
// These titles are examples for independent study, NOT compulsory curriculum readings.
// Only rights-verified public-domain or licensed texts can have embedded sections.
// All other works remain bibliographic records with a source link.
// Copyright/licensing and exact editions must be checked before reproducing text.
const item=(title,year,kind,sourceUrl,sections=[])=>Object.freeze({title,year,kind,sourceUrl,sections:Object.freeze(sections.map(s=>Object.freeze(s)))});
const author=(country,language,name,sourceTitle,sourceUrl,works)=>Object.freeze({
 id:country==='RS'?(name==='Десанка Максимовић'?'rs-desanka-maksimovic':'rs-ivo-andric'):country.toLowerCase()+'-'+name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
 name,country,language,sourceTitle,sourceUrl,
 aliases:Object.freeze(country==='RS'?(name==='Десанка Максимовић'?['Desanka Maksimović','Desanka Maksimovic']:['Ivo Andrić','Ivo Andric']):[]),
 works:Object.freeze(works)
});
export const SEVEN_COUNTRY_LITERARY_LIBRARY=Object.freeze([
 author('MD','ro','Grigore Vieru','Muzeul Național al Literaturii Române / registrul patrimoniului Republicii Moldova',
  'https://secbcm.gov.md/eng/car-1/albinu-a-pmc-698',[
   item('Albinuța',null,'literatură pentru copii','https://secbcm.gov.md/eng/car-1/albinu-a-pmc-698'),
   item('Taina care mă apără',2008,'volum de poezie / ediție retrospectivă','https://secbcm.gov.md/eng/carte-curenta/taina-care-ma-apara-opera-poetica')
  ]),
 author('PL','pl','Adam Mickiewicz','Zintegrowana Platforma Edukacyjna — Język polski / Instytut Książki',
  'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/jezyk-polski',[
   item('Pan Tadeusz',1834,'poem epic','https://www.instytutksiazki.pl/programy/program-translatorski-poland/?sitem=6&st=tpl'),
   item('Dziady, część II',1823,'dramă romantică','https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/jezyk-polski')
  ]),
 author('HR','hr','Ivana Brlić-Mažuranić','Hrvatska enciklopedija — Ivana Brlić-Mažuranić',
  'https://enciklopedija.hr/clanak/brlic-mazuranic-ivana',[
   item('Čudnovate zgode šegrta Hlapića',1913,'roman pentru copii','https://enciklopedija.hr/clanak/brlic-mazuranic-ivana'),
   item('Priče iz davnine',1916,'povești / basme literare','https://enciklopedija.hr/clanak/brlic-mazuranic-ivana'),
   item('Valjani i nevaljani',1902,'povestiri și poezii pentru copii','https://enciklopedija.hr/clanak/brlic-mazuranic-ivana')
  ]),
 author('RS','sr','Десанка Максимовић','Народна библиотека Србије — Десанка Максимовић',
  'https://nb.rs/trazim-pomilovanje/',[
   item('Тражим помиловање',1964,'culegere de poezie','https://nb.rs/trazim-pomilovanje/'),
   item('Крвава бајка',null,'poezie','https://www.opsteobrazovanje.in.rs/biografije/desanka-maksimovic/')
  ]),
 author('HU','hu','Petőfi Sándor','Petőfi Irodalmi Múzeum — Digitális Irodalmi Akadémia',
  'https://opac.dia.hu/record/-/record/Petofi_Sandor-Janos_vitez-Az_apostol-00010',[
   item('János vitéz',1845,'poem narativ','https://opac.dia.hu/record/-/record/Petofi_Sandor-Janos_vitez-Az_apostol-00010'),
   item('Az apostol',1848,'poem narativ','https://www.libri.hu/konyv/petofi_sandor.janos-vitez-az-apostol--1.html')
  ]),
 author('AT','de','Ingeborg Bachmann','Österreichischer Kunstsenat — Ingeborg Bachmann, Werke (Auswahl)',
  'https://www.kunstsenat.at/preistraeger/CV/bachmann.htm',[
   item('Die gestundete Zeit',1953,'culegere de poezie','https://www.kunstsenat.at/preistraeger/CV/bachmann.htm'),
   item('Anrufung des Großen Bären',1956,'culegere de poezie','https://www.kunstsenat.at/preistraeger/CV/bachmann.htm'),
   item('Malina',1971,'roman','https://www.kunstsenat.at/preistraeger/CV/bachmann.htm')
  ]),
 author('TR','tr','Yunus Emre','Türk Edebiyatı İsimler Sözlüğü — Ahmet Yesevi Üniversitesi',
  'https://teis.yesevi.edu.tr/madde-detay/yunus-emre-yunus-kul-yunus-asik',[
   item('Risâletü\'n-Nushiyye',null,'poem didactic / tradiție manuscrisă','https://teis.yesevi.edu.tr/madde-detay/yunus-emre-yunus-kul-yunus-asik'),
   item('Dîvân',null,'corpus de poezie cu variante de atribuire','https://teis.yesevi.edu.tr/madde-detay/yunus-emre-yunus-kul-yunus-asik')

  ]),
 author('MD','ro','Spiridon Vangheli','Uniunea Scriitorilor din Moldova — Spiridon Vangheli',
  'https://uniuneascriitorilor.md/membru/vangheli-spiridon',[
   item('În țara fluturilor',1962,'literatură pentru copii','https://uniuneascriitorilor.md/membru/vangheli-spiridon'),
   item('Isprăvile lui Guguță',1967,'povestiri pentru copii','https://uniuneascriitorilor.md/membru/vangheli-spiridon')
  ]),
 author('PL','pl','Henryk Sienkiewicz','Culture.pl — Henryk Sienkiewicz',
  'https://culture.pl/en/artist/henryk-sienkiewicz',[
   item('Ogniem i mieczem',1884,'roman istoric','https://culture.pl/en/artist/henryk-sienkiewicz'),
   item('Quo vadis',1896,'roman istoric','https://culture.pl/en/artist/henryk-sienkiewicz')
  ]),
 author('HR','hr','August Šenoa','Hrvatska enciklopedija — August Šenoa',
  'https://www.enciklopedija.hr/clanak/senoa-august',[
   item('Zlatarovo zlato',1871,'roman istoric','https://www.enciklopedija.hr/clanak/senoa-august'),
   item('Seljačka buna',1877,'roman istoric','https://www.enciklopedija.hr/clanak/senoa-august')
  ]),
 author('RS','sr','Иво Андрић','Hrvatska enciklopedija — Ivo Andrić (bibliografie; literatură sud-slavă)',
  'https://www.enciklopedija.hr/clanak/andric-ivo',[
   item('На Дрини ћуприја',1945,'roman','https://www.enciklopedija.hr/clanak/andric-ivo'),
   item('Проклета авлија',1954,'roman scurt','https://www.enciklopedija.hr/clanak/andric-ivo')
  ]),
 author('HU','hu','Arany János','Petőfi Irodalmi Múzeum — Arany János (material educativ)',
  'https://pim.hu/sites/default/files/page/attachments/aranyut_palyazati_felhivas_x.pdf',[
   item('Toldi',1847,'poem epic','https://pim.hu/sites/default/files/page/attachments/aranyut_palyazati_felhivas_x.pdf'),
   item('A walesi bárdok',1857,'baladă','https://mek.oszk.hu/00500/00593/fulszoveg.html'),
   // Original 1848 poem, author Arany János died in 1882: public-domain text.
   // Source and wording: https://hu.wikisource.org/wiki/Nemzet%C5%91r-dal
   item('Nemzetőr-dal',1848,'poezie','https://hu.wikisource.org/wiki/Nemzet%C5%91r-dal',[
    {title:'Poezia integrală',sourceUrl:'https://hu.wikisource.org/wiki/Nemzet%C5%91r-dal',
     license:'public domain — Arany János (1817–1882)',rightsVerified:true,
     text:[
      'Süvegemen nemzetiszín rózsa,',
      'Ajakamon édes babám csókja;',
      'Ne félj, babám, nem megyek világra:',
      'Nemzetemnek vagyok katonája.',
      '',
      'Nem kerestek engemet kötéllel;',
      'Zászló alá magam csaptam én fel:',
      'Szülőanyám, te szép Magyarország,',
      'Hogyne lennék holtig igaz hozzád!',
      '',
      'Nem is adtam a lelkemet bérbe;',
      'Négy garajcár úgyse sokat érne;',
      'Van nekem még öt-hat garajcárom...',
      'Azt is, ha kell, hazámnak ajánlom.',
      '',
      'Fölnyergelem szürke paripámat;',
      'Fegyveremre senki se tart számot,',
      'Senkié sem, igaz keresményem:',
      'Azt vegye hát el valaki tőlem!',
      '',
      'Olyan marsra lábam se billentem,',
      'Hogy azt bántsam, aki nem bánt engem:',
      'De a szabadságért, ha egy íznyi,',
      'Talpon állok mindhalálig víni.'
     ].join('\\n')}
   ])
  ]),
 author('AT','de','Arthur Schnitzler','Hrvatska enciklopedija — Arthur Schnitzler',
  'https://www.enciklopedija.hr/clanak/schnitzler-arthur',[
   item('Leutnant Gustl',1900,'nuvelă','https://www.enciklopedija.hr/clanak/schnitzler-arthur'),
   item('Traumnovelle',1926,'nuvelă','https://www.enciklopedija.hr/clanak/schnitzler-arthur')
  ]),
 author('TR','tr','Orhan Veli Kanık','Türk Edebiyatı İsimler Sözlüğü — Orhan Veli Kanık',
  'https://teis.yesevi.edu.tr/%2520madde-detay/orhan-veli-kanik',[
   item('Garip',1941,'volum de poezie în colaborare','https://teis.yesevi.edu.tr/%2520madde-detay/orhan-veli-kanik'),
   item('Vazgeçemediğim',1945,'volum de poezie','https://teis.yesevi.edu.tr/%2520madde-detay/orhan-veli-kanik')
  ])
]);
