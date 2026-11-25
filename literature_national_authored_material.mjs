// Renders original, individually authored year/chapter records received from
// a pack. No lesson text is bundled into this function or the frontend Worker.
export function literatureNationalAuthoredMaterial({chapters,country='',stage='',grade='',topicKey='',language='',mode=''}={}){
 if(country!=='FR'||stage!=='beginner'||String(grade)!=='CP'||!['fr','ro','en'].includes(language)||
  !['lesson','examples','exercises','test'].includes(mode))return null;
 const row=chapters?.[String(topicKey)]?.[language];
 if(!row)return null;
 const labels=language==='fr'?['Activité originale indicative · France · CP','Pour apprendre','Exemple original','Explication','Exercices','Test d’entraînement','Activités originales, pas une épreuve officielle. Lis ou écris avec l’aide d’un adulte si besoin.']:
  language==='ro'?['Activitate originală orientativă · Franța · CP','Ce învățăm','Exemplu original în franceză','Explicație','Exerciții','Test de antrenament','Activități originale, nu probă oficială. Citește sau scrie cu ajutorul unui adult dacă ai nevoie.']:
  ['Original advisory activity · France · CP','What we learn','Original French example','Explanation','Exercises','Practice test','Original practice, not an official examination. Read or write with adult support if needed.'];
 const list=items=>items.map((item,i)=>(i+1)+'. '+item).join('\n');
 let text='# '+row.title+'\n\n'+labels[0]+'\n\n';
 if(mode==='lesson')text+='## '+labels[1]+'\n'+row.theory+'\n\n## '+labels[2]+'\n'+row.sample+'\n\n## '+labels[3]+'\n'+row.worked+'\n\n## '+labels[4]+'\n'+list(row.exercises.slice(0,2));
 else if(mode==='examples')text+='## '+labels[2]+'\n'+row.sample+'\n\n## '+labels[3]+'\n'+row.worked+'\n\n'+row.theory+'\n\n## '+labels[4]+'\n'+list(row.exercises.slice(0,3));
 else text+='## '+labels[2]+'\n'+row.sample+'\n\n## '+(mode==='test'?labels[5]:labels[4])+'\n'+list(mode==='test'?row.test:row.exercises)+'\n\n'+labels[6];
 return {origin:'authored_france_cp',topic:topicKey,text};
}
