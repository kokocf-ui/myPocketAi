import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';

const page=await(await frontend.fetch(new Request('https://documents.test/'))).text();
const source=page.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'frontend JS exists');
new vm.Script(source);
const start=source.indexOf("function documentsScanExtract(raw,geometry=[],documentType='other')");
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
const noisyPassport=vm.runInContext('documentsScanExtract('+JSON.stringify('Surname: PP')+',[],'+JSON.stringify('passport')+')',context);
assert.equal(noisyPassport.holder,undefined,'reject two-character OCR noise rather than inventing passport surname');
const mrzAfterFull=vm.runInContext('documentsScanExtract('+JSON.stringify('Date of issue: 10.03.2024\\nSURNAME: RANDOM\\n'+mrz)+',[],'+JSON.stringify('passport')+')',context);
assert.equal(mrzAfterFull.holder,'ERIKSSON','verified MRZ overrides low-confidence full-page OCR label');
const mrzParts=mrz.split('\n');
const splitMrz=[mrzParts[0].slice(0,18),mrzParts[0].slice(18),mrzParts[1].slice(0,26),mrzParts[1].slice(26)].join('\n');
const recovered=vm.runInContext('documentsScanExtract('+JSON.stringify(splitMrz)+')',context);
assert.equal(recovered.number,'L898902C3','reconstruct split MRZ lines');
assert.equal(recovered.holder,'ERIKSSON','restore surname from split MRZ');
assert.equal(recovered.expires,'2012-04-15','recheck expiration after merging fragments');

assert.equal(vm.runInContext('documentsScanExtract('+JSON.stringify(mrz.replace('L898902C36','L898902C35'))+')',context).number,undefined,'reject bad MRZ check digit');
const run=(text,layout,type)=>vm.runInContext('documentsScanExtract('+JSON.stringify(text)+','+JSON.stringify(layout||[])+','+JSON.stringify(type||'other')+')',context);
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
// TD2: 105x74mm identity documents with two 36-character OCR lines.
const td2DocNo='AB1234567',td2Birth='740812',td2Expiry='320415';
const td2Line1='I<UTOERIKSSON<<ANNA<MARIA'.padEnd(36,'<');
const td2Line2=td2DocNo+mrzCheck(td2DocNo)+'UTO'+td2Birth+mrzCheck(td2Birth)+
  'F'+td2Expiry+mrzCheck(td2Expiry)+'<<<<<<<'+'0';
assert.equal(td2Line1.length,36);assert.equal(td2Line2.length,36);
const td2=run(td2Line1+'\n'+td2Line2,[],'identity');
assert.equal(td2.number,'AB1234567','TD2 extracts checked identity number');
assert.equal(td2.holder,'ERIKSSON','TD2 extracts surname');
assert.equal(td2.given,'ANNA MARIA','TD2 extracts given names');
assert.equal(td2.birth,'1974-08-12','TD2 checks birth');
assert.equal(td2.expires,'2032-04-15','TD2 checks expiry');
const fragmentTD2=[
  td2Line1.slice(0,20),td2Line1.slice(20),
  td2Line2.slice(0,18),td2Line2.slice(18)
].join('\n');
assert.equal(run(fragmentTD2,[],'identity').number,'AB1234567','TD2 reconstructed from four OCR fragments');
const badTd2Row=td2Line2.slice(0,9)+(td2Line2[9]==='0'?'1':'0')+td2Line2.slice(10);
assert.equal(run(td2Line1+'\n'+badTd2Row,[],'identity').number,undefined,'TD2 number check digit rejects incorrect OCR');
const romanianClassic=run('SERIA AB NR 123456\nValabilitate 02.01.2023 - 01.01.2033',[],'identity');
assert.equal(romanianClassic.number,'AB123456','classic Romanian ID series and number recognized');
assert.equal(romanianClassic.expires,'2033-01-01','validity end date mapped to expiry');
assert.equal(romanianClassic.issued,undefined,'validity start is not assumed to be issue date');
assert.equal(run('CNP 1990101123456',[],'identity').number,undefined,'do not use personal code as document number');
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
const headings=run("CARTE\nD'IDENTITE\nNume\nCARTE\nPrenume\nD'IDENTITE\nAutoritate emitenta\nnaissance");
assert.equal(headings.holder,undefined,'identity-card title CARTE cannot be a surname');
assert.equal(headings.given,undefined,'D IDENTITE cannot be a given name');
assert.equal(headings.issuer,undefined,'naissance cannot be an issuing authority');
const headingWithValues=run("CARTE D'IDENTITE\nNume\nPOPESCU\nPrenume\nANA\nAutoritate emitenta\nSPCLEP Oradea");
assert.equal(headingWithValues.holder,'POPESCU','valid surname follows its caption');
assert.equal(headingWithValues.given,'ANA','valid given name follows its caption');
assert.equal(headingWithValues.issuer,'SPCLEP Oradea','issuing office remains recognized');
assert.match(source,/input.value=Object.prototype.hasOwnProperty.call\(draft.fields,key\)\?draft.fields\[key\]:''/,'stale saved values not mixed into rescans');
const android=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(android,/PocketAndroidDocumentScan/);
assert.match(android,/scanDocumentBytes\(payload\)/,'native bridge receives actual photograph bytes');
assert.match(android,/InputImage\.fromBitmap\(bitmap,rotations\[attempt\]\)/,'ML Kit gets decoded image with tested orientation');
assert.match(android,/result\.getTextBlocks\(\)/,'ML Kit layout lines are extracted');
assert.match(android,/documentHasCompletePassportMrz\(result\)/,'scanner ranks checked passport MRZ');
assert.match(android,/documentHasValidPassportMrz\(String raw\)/,'Android validates OCR MRZ with ICAO checks');
assert.match(android,/passportMrzDigit\(lower.substring\(21,27\)\)/,'Android checks expiry checksum');
assert.match(android,/scanPassportMrzCrop\(recognizer,bitmap,id,chosen,0,"",-1\)/,'crop retry after poor full-page scan');
assert.match(android,/Bitmap.createBitmap\(rotated,x,y,width,height\)/,'OCR uses lower page crop');
assert.match(android,/finishDocumentScan\(recogni(?:zer|z)er,bitmap,id,fullResult,mrzText\)/,'verified crop feeds parser');
assert.match(android,/final int\[\] rotations=\{0,90,270,180\}/,'OCR retries photo orientation');
assert.match(android,/scanDocumentOrientation\(recognizer,bitmap,docId,0,null,-1,passportRequested,identityRequested\)/,'native OCR starts type-aware orientation fallback');
assert.match(android,/documentHasCompleteIdentityMrz\(result\)/,'Android prioritizes TD1 and TD2 MRZ');
assert.match(source,/td2Candidates/,'frontend checks TD2 identity MRZ');
assert.match(android,/result\.put\("lines",lines\)/,'layout lines returned to local frontend');
assert.match(source,/bridge\.postMessage\(JSON\.stringify\(\{action:'scan',id,base64,type\}\)\)/,'frontend sends photo bytes and type to native scanner');
assert.match(source,/documentsPhotoScan\(file,id\)/,'scan uses original photo, not stored downsized copy');
assert.match(source,/documentsPhotoCompress\(originalFile,edge,quality\)/,'OCR creates independent high-resolution photo');
assert.match(source,/\[3000,\.91\]/,'OCR begins at higher scan resolution');
assert.match(source,/function documentsScanReview\(/);
assert.match(source,/window\.pocketAndroidDocumentScanResult/);
console.log('Document OCR field recognition and review wiring tests passed');
