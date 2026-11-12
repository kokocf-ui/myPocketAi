// Original bibliographic metadata for seven national Language & Literature routes.
// These titles are examples for independent study, NOT compulsory curriculum readings.
// No book text is bundled. Every work is linked to an identified bibliographic source.
// Copyright/licensing and exact editions must be checked before reproducing text.
const item=(title,year,kind,sourceUrl)=>Object.freeze({title,year,kind,sourceUrl});
const author=(country,language,name,sourceTitle,sourceUrl,works)=>Object.freeze({
 id:country.toLowerCase()+'-'+name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
 name,country,language,sourceTitle,sourceUrl,works:Object.freeze(works)
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
  ])
]);
