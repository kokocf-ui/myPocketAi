// Renders original, individually authored year/chapter records received from
// a pack. No lesson text is bundled into this function or the frontend Worker.
export function literatureNationalAuthoredMaterial({chapters,country='',stage='',grade='',topicKey='',language='',mode=''}={}){
 if(country!=='FR'||stage!=='beginner'||String(grade)!=='CP'||
  !['lesson','examples','exercises','test'].includes(mode))return null;
 const row=chapters?.[String(topicKey)]?.fr;
 if(!row)return null;
 const labels=['Activité originale indicative · France · CP','Pour apprendre','Exemple original','Explication','Exercices','Test d’entraînement','Activités originales, pas une épreuve officielle. Lis ou écris avec l’aide d’un adulte si besoin.'];
 const list=items=>items.map((item,i)=>(i+1)+'. '+item).join('\n');
 let text='# '+row.title+'\n\n'+labels[0]+'\n\n';
 if(mode==='lesson')text+='## '+labels[1]+'\n'+row.theory+'\n\n## '+labels[2]+'\n'+row.sample+'\n\n## '+labels[3]+'\n'+row.worked+'\n\n## '+labels[4]+'\n'+list(row.exercises.slice(0,2));
 else if(mode==='examples')text+='## '+labels[2]+'\n'+row.sample+'\n\n## '+labels[3]+'\n'+row.worked+'\n\n'+row.theory+'\n\n## '+labels[4]+'\n'+list(row.exercises.slice(0,3));
 else text+='## '+labels[2]+'\n'+row.sample+'\n\n## '+(mode==='test'?labels[5]:labels[4])+'\n'+list(mode==='test'?row.test:row.exercises)+'\n\n'+labels[6];
 return {origin:'authored_france_cp',topic:topicKey,text,sourceLanguage:'fr',protectedTexts:[row.sample]};
}
