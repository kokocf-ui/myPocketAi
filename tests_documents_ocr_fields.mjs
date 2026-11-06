import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';

const page=await(await frontend.fetch(new Request('https://documents.test/'))).text();
const source=page.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'frontend JS exists');
new vm.Script(source);
const start=source.indexOf('function documentsScanExtract(raw,geometry=[])');
const end=source.indexOf('function documentsScanReview(host,item){',start);
assert.ok(start>=0&&end>start,'OCR field parser available');
const context=vm.createContext({budgetISO:d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')});
vm.runInContext(source.slice(start,end),context);
const result=vm.runInContext('documentsScanExtract('+JSON.stringify('PASSPORT NUMBER: AB123456\nSurname: POPESCU\nGiven names: ANDREI\nDate of expiry: 11.06.2034\nDate of issue: 12.06.2024')+')',context);
assert.equal(result.number,'AB123456');
assert.equal(result.holder,'POPESCU');
assert.equal(result.given,'ANDREI');
assert.equal(result.expires,'2034-06-11');
assert.equal(result.issued,'2024-06-12');
assert.equal(Object.keys(vm.runInContext("documentsScanExtract('random 1234')",context)).length,0,'do not guess unlabeled identifiers');
const mrz='P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<\nL898902C36UTO7408122F1204159ZE184226B<<<<<10';
const passport=vm.runInContext('documentsScanExtract('+JSON.stringify(mrz)+')',context);
assert.equal(passport.number,'L898902C3');
assert.equal(passport.holder,'ERIKSSON');
assert.equal(passport.given,'ANNA MARIA');
assert.equal(passport.birth,'1974-08-12');
assert.equal(passport.expires,'2012-04-15');
assert.equal(vm.runInContext('documentsScanExtract('+JSON.stringify(mrz.replace('L898902C36','L898902C35'))+')',context).number,undefined,'reject bad MRZ check digit');
const run=(text,layout)=>vm.runInContext('documentsScanExtract('+JSON.stringify(text)+','+JSON.stringify(layout||[])+')',context);
const danishText='Efternavn/Nom/Last name\nJENSEN\nFornavne/Prénom/First name\nANNA MARIA\nUdløbsdato/Date of expiry\n12.07.2032\nPasnummer/Passport number\nAB1234567';
const danish=run(danishText);
assert.equal(danish.holder,'JENSEN','surname must be a value, never the translation label');
assert.equal(danish.given,'ANNA MARIA');
assert.equal(danish.expires,'2032-07-12');
assert.equal(danish.number,'AB1234567');
assert.equal(run('Efternavn/Nom/Last name').holder,undefined,'a label alone does not produce a fake value');
const geometryText='Efternavn/Nom/Last name\nFornavne/Prénom/First name\nJENSEN\nANNA MARIA';
const geometryRows=[
 {text:'Efternavn/Nom/Last name',left:40,right:225,top:50,bottom:75},
 {text:'Fornavne/Prénom/First name',left:40,right:225,top:170,bottom:195},
 {text:'JENSEN',left:50,right:145,top:92,bottom:115},
 {text:'ANNA MARIA',left:50,right:195,top:212,bottom:235}
];
const aligned=run(geometryText,geometryRows);
assert.equal(aligned.holder,'JENSEN','layout associates name below surname label');
assert.equal(aligned.given,'ANNA MARIA','layout associates given name below given-name label');
assert.equal(passport.country,'UTO','MRZ issuing country comes from first line');

const duplicates=run('Nume\nEXEMPLU\nPrenume\nEXEMPLU');
assert.equal(duplicates.holder,'EXEMPLU','CI surname still extracted');
assert.equal(duplicates.given,undefined,'CI must not duplicate surname as given name');
const onlyOne=run('Nume\nPrenume\nEXEMPLU',[
 {text:'Nume',left:20,right:85,top:10,bottom:28},
 {text:'Prenume',left:20,right:100,top:60,bottom:78},
 {text:'EXEMPLU',left:120,right:230,top:62,bottom:80}
]);
assert.equal(onlyOne.holder,undefined,'surname must not borrow a given-name value');
assert.equal(onlyOne.given,'EXEMPLU','line belongs to nearest caption');
const verifiedLabelPair=run('Nume\nEXEMPLU\nPrenume\nANA');
assert.equal(verifiedLabelPair.holder,'EXEMPLU');
assert.equal(verifiedLabelPair.given,'ANA');

const rightSide=run('Nume\nEXEMPLU\nPrenume\nANA',[
 {text:'Nume',left:20,right:85,top:10,bottom:28},
 {text:'EXEMPLU',left:110,right:200,top:11,bottom:29},
 {text:'Prenume',left:20,right:100,top:55,bottom:73},
 {text:'ANA',left:125,right:180,top:56,bottom:74}
]);
assert.equal(rightSide.holder,'EXEMPLU','same-row surname value recognized');
assert.equal(rightSide.given,'ANA','same-row given name value recognized');
const mrzCheck=data=>{
 const weights=[7,3,1];
 return String(Array.from(data).reduce((sum,ch,i)=>{
  const n=ch==='<'?0:/[0-9]/.test(ch)?Number(ch):ch.charCodeAt(0)-55;
  return sum+n*weights[i%3];
 },0)%10);
};
const idNumber='A12345678';
const identityRow1='I<UTO'+idNumber+mrzCheck(idNumber)+'<'.repeat(15);
const born='740812',expiry='320415';
const identityRow2=born+mrzCheck(born)+'F'+expiry+mrzCheck(expiry)+'UTO'+'<'.repeat(11)+'0';
const identityRow3='ERIKSSON<<ANNA<MARIA'.padEnd(30,'<');
const identity=run([identityRow1,identityRow2,identityRow3].join('\n'));
assert.equal(identity.number,idNumber,'TD1 identity MRZ number verified');
assert.equal(identity.holder,'ERIKSSON','TD1 identity MRZ surname');
assert.equal(identity.given,'ANNA MARIA','TD1 identity MRZ given names');
assert.equal(identity.expires,'2032-04-15','TD1 expiry checked');
assert.equal(identity.birth,'1974-08-12','TD1 birth checked');
assert.equal(identity.country,'UTO','TD1 issuing country');
const invalidRow1=identityRow1.slice(0,14)+(identityRow1[14]==='0'?'1':'0')+identityRow1.slice(15);
const invalidIdentity=run([invalidRow1,identityRow2,identityRow3].join('\n'));
assert.equal(invalidIdentity.number,undefined,'bad TD1 number check digit must reject MRZ');

assert.match(page,/documents-scan-review \.documents-field>\.budget-input/,'document fields have responsive compact height');
const android=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(android,/PocketAndroidDocumentScan/);
assert.match(android,/scanDocumentBytes\(payload\)/,'native bridge receives actual photograph bytes');
assert.match(android,/InputImage\.fromBitmap\(bitmap,0\)/,'ML Kit gets decoded image');
assert.match(android,/result\.getTextBlocks\(\)/,'ML Kit layout lines are extracted');
assert.match(android,/result\.put\("lines",lines\)/,'layout lines returned to local frontend');
assert.match(source,/bridge\.postMessage\(JSON\.stringify\(\{action:'scan',id,base64\}\)\)/,'frontend sends photo bytes after saving');
assert.match(source,/documentsPhotoScan\(blob,id\)/,'scan invoked from photo save');
assert.match(source,/function documentsScanReview\(/);
assert.match(source,/window\.pocketAndroidDocumentScanResult/);
console.log('Document OCR field recognition and review wiring tests passed');
