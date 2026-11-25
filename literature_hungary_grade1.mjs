// Renders the single original-language chapter loaded from the independent pack.
export function literatureHungaryGrade1Material({chapters,country='',stage='',grade='',topicKey='',language='',mode=''}={}){
 if(country!=='HU'||stage!=='beginner'||String(grade)!=='1'||
    !['lesson','examples','exercises','test'].includes(mode))return null;
 const row=chapters?.[String(topicKey)]?.hu;if(!row)return null;
 const t={heading:'Saját gyakorlóanyag · Magyarország · 1. osztály',theory:'Mit tanulunk?',sample:'Példa',worked:'Magyarázat',steps:'Hogyan dolgozzunk?',practice:'Próbáld ki!',test:'Gyakorló felmérés',exercises:'Gyakorlatok',note:'Saját gyakorló feladatok, nem hivatalos felmérő. A megoldások nincsenek előre megadva.'};
 const list=items=>items.map((q,i)=>(i+1)+'. '+q).join('\n');
 let text='# '+row.title+'\n\n'+t.heading+'\n\n';
 if(mode==='lesson')text+='## '+t.theory+'\n'+row.theory+'\n\n## '+t.sample+'\n'+row.sample+'\n\n## '+t.worked+'\n'+row.worked+'\n\n## '+t.steps+'\n'+row.steps+'\n\n## '+t.practice+'\n'+list(row.exercises.slice(0,2));
 else if(mode==='examples')text+='## '+t.sample+'\n'+row.sample+'\n\n## '+t.worked+'\n'+row.worked+'\n\n## '+t.steps+'\n'+row.steps+'\n\n## '+t.practice+'\n'+list(row.exercises.slice(0,3));
 else text+='## '+t.sample+'\n'+row.sample+'\n\n## '+(mode==='test'?t.test:t.exercises)+'\n'+list(mode==='test'?row.test:row.exercises)+'\n\n'+t.note;
 return {origin:'authored_hungary_grade1',topic:topicKey,text,sourceLanguage:'hu',protectedTexts:[row.sample]};
}
