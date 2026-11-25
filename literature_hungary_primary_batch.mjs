// Renders the single original-language chapter loaded from the independent pack.
export function literatureHungaryPrimaryMaterial({chapters,country='',stage='',grade='',topicKey='',language='',mode=''}={}){
 const g=String(grade),prefix='hu-beginner-'+g+'-';
 if(country!=='HU'||stage!=='beginner'||!['2','3','4'].includes(g)||
  !['lesson','examples','exercises','test'].includes(mode)||!String(topicKey).startsWith(prefix))return null;
 const chapter=String(topicKey).slice(prefix.length),year=chapters;
 const row=year?.chapters[chapter]?.hu;if(!row)return null;
 const [title,theory,exercises,test]=row;
 const labels=['Saját gyakorlóanyag · Magyarország · ','Mit tanulunk?','Eredeti magyar szöveg','Magyarázat','Gyakorlatok','Gyakorló felmérés','Saját gyakorló feladatok, nem hivatalos felmérő. A megoldásokat a válaszadás előtt nem adjuk meg.'];
 const list=items=>items.map((q,i)=>(i+1)+'. '+q).join('\n');
 let text='# '+title+'\n\n'+labels[0]+g+'\n\n';
 if(mode==='lesson')text+='## '+labels[1]+'\n'+theory+'\n\n## '+labels[2]+'\n'+year.sample+'\n\n## '+labels[3]+'\n'+year.meaning.hu+'\n\n## '+labels[4]+'\n'+list(exercises.slice(0,2));
 else if(mode==='examples')text+='## '+labels[2]+'\n'+year.sample+'\n\n## '+labels[3]+'\n'+year.meaning.hu+'\n\n'+theory+'\n\n## '+labels[4]+'\n'+list(exercises.slice(0,3));
 else text+='## '+labels[2]+'\n'+year.sample+'\n\n## '+(mode==='test'?labels[5]:labels[4])+'\n'+list(mode==='test'?test:exercises)+'\n\n'+labels[6];
 return {origin:'authored_hungary_primary_batch',topic:topicKey,text,sourceLanguage:'hu',protectedTexts:[year.sample]};
}
