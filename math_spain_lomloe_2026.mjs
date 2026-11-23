// Spain-specific Mathematics pathways (LOMLOE), 2026/27.
// IMPORTANT: The national BOE minimum curriculum is NOT a year-by-year
// textbook. Primaria competency standards are set per two-year ciclo;
// autonomous communities publish their own curricular decrees.
// In 4º ESO the student selects Matemáticas A OR Matemáticas B.
// Bachillerato mathematics depends on modality (Ciencias y Tecnología,
// Humanidades/Ciencias Sociales, General); do not create a universal course.
// Sources: official BOE RD 157/2022, 217/2022, 243/2022 (consolidated).
const BOE=Object.freeze({
 primary:'https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296',
 lower:'https://www.boe.es/buscar/act.php?id=BOE-A-2022-4975',
 medium:'https://www.boe.es/buscar/act.php?id=BOE-A-2022-5521',
 regions:'https://educagob.educacionfpydeportes.gob.es/curriculo/curriculo-lomloe/curriculos-ccaa.html'
});
export const SPAIN_MATH_SOURCES=BOE;
const mk=(id,ro,en,es,cycle)=>({id,ro,en,es,cycle,nationalYearVerified:true,
 curriculumVerified:false});
const primaria=Array.from({length:6},(_,i)=>mk(
 'P'+(i+1),'Primaria · anul '+(i+1),'Primary year '+(i+1),
 (i+1)+'º de Educación Primaria',i<2?'primer ciclo':i<4?'segundo ciclo':'tercer ciclo'));
const lower=[
 mk('ESO1','ESO · anul 1','ESO year 1','1º de ESO','ESO'),
 mk('ESO2','ESO · anul 2','ESO year 2','2º de ESO','ESO'),
 mk('ESO3','ESO · anul 3','ESO year 3','3º de ESO','ESO'),
 mk('ESO4-A','ESO · anul 4 · Matematică A','ESO year 4 · Mathematics A','4º ESO · Matemáticas A','ESO option A'),
 mk('ESO4-B','ESO · anul 4 · Matematică B','ESO year 4 · Mathematics B','4º ESO · Matemáticas B','ESO option B')
];
const upper=[
 mk('B1-CYT','Bachillerato I · Științe și tehnologie','Bachillerato I · Science and Technology','1º Bachillerato · Matemáticas I','Ciencias y Tecnología'),
 mk('B1-HCS','Bachillerato I · Științe sociale','Bachillerato I · Social Sciences','1º Bachillerato · Matemáticas Aplicadas a las CC.SS. I','Humanidades y Ciencias Sociales'),
 mk('B1-GEN','Bachillerato I · General','Bachillerato I · General','1º Bachillerato · Matemáticas Generales','General'),
 mk('B2-CYT','Bachillerato II · Științe și tehnologie','Bachillerato II · Science and Technology','2º Bachillerato · Matemáticas II','Ciencias y Tecnología'),
 mk('B2-HCS','Bachillerato II · Științe sociale','Bachillerato II · Social Sciences','2º Bachillerato · Matemáticas Aplicadas a las CC.SS. II','Humanidades y Ciencias Sociales')
];
export const SPAIN_MATH_YEARS=Object.freeze({
 beginner:primaria,lower,medium:upper
});
const area=(id,ro,en,es)=>({id,ro,en,es});
export const SPAIN_MATH_GRADE_AREAS=Object.freeze({
 P1:[area('arithmetic','Numărăm și calculăm în situații reale','Counting in real situations','Sentido numérico: contar y calcular'),
     area('geometry','Poziții și forme familiare','Position and basic shapes','Sentido espacial: figuras y posiciones'),
     area('measurement','Compararea mărimilor','Comparing quantities','Sentido de la medida')],
 P2:[area('arithmetic','Operații și calcul mental','Operations and mental calculation','Sentido numérico: operaciones'),
     area('geometry','Figuri și mișcări','Shapes and movement','Sentido espacial: figuras y movimientos'),
     area('measurement','Timp, lungimi și bani','Time, length and money','Magnitudes: tiempo, longitud y dinero')],
 P3:[area('arithmetic','Înmulțiri, împărțiri și probleme','Multiplication, division and problems','Operaciones y resolución de problemas'),
     area('geometry','Figuri și orientare spațială','Shapes and spatial reasoning','Figuras y orientación espacial'),
     area('measurement','Unități și măsurători','Measurements and units','Medida y estimación')],
 P4:[area('arithmetic','Fracții și numere zecimale','Fractions and decimals','Fracciones y números decimales'),
     area('geometry','Poligoane, unghiuri și simetrie','Polygons, angles and symmetry','Polígonos, ángulos y simetrías'),
     area('measurement','Perimetru, arii și unități','Perimeter, area and units','Perímetros, áreas y unidades')],
 P5:[area('arithmetic','Numere și fracții în probleme','Numbers and fractions in problems','Números y fracciones'),
     area('geometry','Geometrie și transformări','Geometry and transformations','Geometría y transformaciones'),
     area('measurement','Arie, volum și mărimi','Areas and volumes','Superficies, volúmenes y magnitudes')],
 P6:[area('arithmetic','Proporții și procente aplicate','Applied ratios and percentages','Proporcionalidad y porcentajes'),
     area('geometry','Figuri plane și corpuri','Plane and solid geometry','Geometría plana y cuerpos'),
     area('statistics','Date, grafice și medii','Data, charts and averages','Estadística: datos y gráficos')],
 ESO1:[area('algebra','Numere întregi și expresii','Integers and expressions','Sentido numérico y algebraico'),
       area('geometry','Geometrie și măsurare','Geometry and measures','Sentido espacial y medida'),
       area('statistics','Organizarea datelor','Organising data','Sentido estocástico: datos')],
 ESO2:[area('algebra','Rapoarte, proporții și ecuații','Ratios, proportions and equations','Proporcionalidad y ecuaciones'),
       area('geometry','Relații geometrice și arii','Geometric relationships','Relaciones geométricas y áreas'),
       area('statistics','Statistică și probabilitate','Statistics and probability','Datos y probabilidad')],
 ESO3:[area('algebra','Expresii, ecuații și modele','Expressions and equations','Expresiones, ecuaciones y modelos'),
       area('geometry','Geometrie și demonstrații','Geometry and proofs','Geometría y argumentación'),
       area('statistics','Interpretarea statistică','Statistical interpretation','Estadística y probabilidad')],
 'ESO4-A':[area('algebra','Calcul și modelare în viața cotidiană','Applied numerical models','Matemáticas A: modelos de la vida cotidiana'),
       area('geometry','Geometrie practică și măsurare','Practical geometry','Matemáticas A: geometría aplicada'),
       area('statistics','Statistică și decizii','Statistics for decisions','Matemáticas A: datos y decisiones')],
 'ESO4-B':[area('algebra','Algebră și raționament formal','Algebraic reasoning','Matemáticas B: álgebra y razonamiento'),
       area('geometry','Geometrie analitică și demonstrații','Analytic geometry and proof','Matemáticas B: geometría y demostración'),
       area('statistics','Probabilități și analiză de date','Probability and data analysis','Matemáticas B: probabilidad y datos')],
 'B1-CYT':[area('algebra','Expresii și ecuații','Expressions and equations','Matemáticas I: álgebra'),
       area('functions','Funcții și grafice','Functions and graphs','Matemáticas I: funciones'),
       area('geometry','Geometrie analitică','Coordinate geometry','Matemáticas I: geometría'),
       area('statistics','Date și probabilități','Statistics and probability','Matemáticas I: estadística')],
 'B1-HCS':[area('algebra','Modele matematice sociale','Mathematical models for society','Matemáticas CC.SS. I: modelos'),
       area('functions','Funcții în economie și societate','Functions in economics','Matemáticas CC.SS. I: funciones'),
       area('geometry','Reprezentarea spațială a datelor','Spatial data representations','Matemáticas CC.SS. I: representación'),
       area('statistics','Statistica problemelor sociale','Statistics for social data','Matemáticas CC.SS. I: estadística')],
 'B1-GEN':[area('algebra','Raționament numeric în contexte reale','Real-world numerical reasoning','Matemáticas Generales: sentido numérico'),
       area('functions','Modelarea situațiilor','Modelling real situations','Matemáticas Generales: modelización'),
       area('geometry','Măsurători și reprezentări','Measurement and representations','Matemáticas Generales: medida'),
       area('statistics','Date, incertitudine și decizii','Data, uncertainty and decisions','Matemáticas Generales: incertidumbre')],
 'B2-CYT':[area('analysis','Calcul diferențial și integral','Calculus','Matemáticas II: análisis'),
       area('functions','Studiul funcțiilor','Function analysis','Matemáticas II: funciones'),
       area('algebra','Matrici, sisteme și algebră','Matrices and linear systems','Matemáticas II: álgebra'),
       area('geometry','Geometrie vectorială','Vector geometry','Matemáticas II: geometría'),
       area('statistics','Probabilități și modele','Probability and models','Matemáticas II: probabilidad')],
 'B2-HCS':[area('analysis','Analiză matematică aplicată','Applied analysis','Matemáticas CC.SS. II: análisis'),
       area('functions','Funcții în probleme sociale','Functions in social sciences','Matemáticas CC.SS. II: funciones'),
       area('algebra','Matrici și sisteme în aplicații','Matrices for applications','Matemáticas CC.SS. II: álgebra'),
       area('geometry','Reprezentări geometrice','Geometric representations','Matemáticas CC.SS. II: representaciones'),
       area('statistics','Probabilitate și inferență','Probability and inference','Matemáticas CC.SS. II: estadística')]
});
export function spainMathGradeProfile(grade){
 const id=String(grade||'');
 const stage=SPAIN_MATH_YEARS.beginner.some(x=>x.id===id)?'beginner':
  SPAIN_MATH_YEARS.lower.some(x=>x.id===id)?'lower':
  SPAIN_MATH_YEARS.medium.some(x=>x.id===id)?'medium':null;
 if(!stage)return null;
 const source=BOE[stage==='beginner'?'primary':stage==='lower'?'lower':'medium'];
 const school=SPAIN_MATH_YEARS[stage].find(x=>x.id===id);
 const regional=' Pentru programa aplicabilă exact trebuie aleasă comunitatea autonomă și, unde există, limba de predare.';
 const note=stage==='beginner'?'Spania: Educación Primaria, '+school.es+
  '. BOE 157/2022 organizează obiectivele naționale pe cicluri de câte doi ani, nu ca un cuprins oficial anual.'+regional:
  stage==='lower'?'Spania: Educación Secundaria Obligatoria, '+school.es+
   '. BOE 217/2022; în 4º ESO există două variante distincte, Matemáticas A și Matemáticas B.'+regional:
   'Spania: Bachillerato, '+school.es+
   '. BOE 243/2022: disciplina depinde de modalitate; nu există matematică identică pentru toate filierele. Matematicas Generales este opțiune specifică primului an al modalității General.'+regional;
 return {country:'ES',grade:id,stage,source,note,cycle:school.cycle,
  regionSource:BOE.regions,units:SPAIN_MATH_GRADE_AREAS[id]};
}
// These are ORIGINAL worked-topic examples, not official textbook extracts.
// The generic skill bank remains a supplementary aid, not proof of a complete
// autonomous-community syllabus or of a particular school's lesson sequence.
const SPAIN_ORIGINAL_EXAMPLES={
 'P1|arithmetic':['Contamos objetos sin saltar ninguno','Count objects one by one','Para contar correctamente señalamos cada objeto una sola vez. El último número que decimos representa la cantidad total.','● ● ● ● = 4','Colocamos cuatro fichas sobre la mesa. Las señalamos de izquierda a derecha mientras decimos uno, dos, tres, cuatro. Comprobamos que ninguna ficha se contó dos veces.','¿Cuántas fichas hay si tenemos tres y añadimos una?','Cuatro fichas.'],
 'P2|measurement':['Medimos con la misma unidad','Measure using one consistent unit','Para comparar dos longitudes debemos usar la misma unidad y colocar las piezas sin huecos ni superposiciones.','longitud = número de unidades iguales','Una mesa mide siete bloques iguales y un estante mide cinco. En la misma unidad la mesa es más larga por dos bloques.','Si un lápiz mide seis cubos iguales y otro cuatro, ¿cuál es más largo?','El lápiz que mide seis cubos, por dos cubos.'],
 'P3|arithmetic':['División como reparto en partes iguales','Division as equal sharing','Dividir puede significar repartir una cantidad en grupos iguales. Para comprobar la solución multiplicamos el número de grupos por la cantidad de cada grupo.','18 : 3 = 6','Repartimos dieciocho lápices entre tres estudiantes por igual: cada uno recibe seis. Verificamos: tres grupos de seis son dieciocho.','Reparte veinte cromos entre cuatro niños por igual.','Cinco cromos para cada niño.'],
 'P4|arithmetic':['Fracciones equivalentes','Equivalent fractions','Dos fracciones son equivalentes cuando representan la misma parte de un todo. Podemos multiplicar o dividir el numerador y el denominador por el mismo número distinto de cero.','1/2 = 2/4','Partimos una barra en dos mitades y tomamos una. Si dividimos cada mitad en dos, la misma cantidad ahora son dos de cuatro partes: 1/2=2/4.','Completa 3/5 = ?/10.','6/10.'],
 'P5|geometry':['Simetría respecto a una recta','Reflection across a line','Al reflejar un punto respecto a una recta, el punto original y su imagen quedan a igual distancia perpendicular del eje de simetría.','distancia(A,eje) = distancia(A’,eje)','Situamos A a dos centímetros del eje vertical. Marcamos A’ a dos centímetros al otro lado, sobre la misma perpendicular. Comprobamos la igualdad de distancias.','¿Dónde queda la imagen de un punto a 3 cm a la derecha del eje?','A 3 cm a la izquierda, sobre la perpendicular.'],
 'P6|statistics':['Media aritmética de datos sencillos','Arithmetic mean of simple data','La media aritmética es la suma de todos los valores dividida entre el número de observaciones. Siempre comprobamos que usamos la misma unidad.','media = suma / cantidad','Tres lecturas duran 10, 20 y 30 minutos. La suma es 60 minutos y hay tres lecturas. La media es 20 minutos, aunque ninguna lectura tiene por qué durar exactamente esa cantidad.','Calcula la media de 2, 4 y 9.','5.'],
 'ESO1|algebra':['Números enteros y sus signos','Signed integers','Los números enteros incluyen positivos, negativos y el cero. Para comparar valores en la recta numérica, el situado más a la derecha es mayor.','-2 > -5','En un termómetro, -2 °C es una temperatura mayor que -5 °C: están a dos y cinco grados por debajo del cero, respectivamente.','Ordena -3, 1 y -7 de menor a mayor.','-7, -3, 1.'],
 'ESO2|algebra':['Proporcionalidad directa','Direct proportionality','Dos magnitudes son directamente proporcionales cuando el cociente entre valores correspondientes es constante. Si duplicamos una magnitud, duplicamos la otra.','y = kx','Tres entradas iguales cuestan 12 euros. Una cuesta 4 euros; por tanto cinco costarán 20 euros. Verificamos que el precio por entrada sigue siendo 4.','Cuatro cuadernos cuestan 8 €. ¿Cuánto cuestan seis iguales?','12 €.'],
 'ESO3|statistics':['Probabilidades simples y frecuencia','Probability and frequency','En un experimento con resultados equiprobables, la probabilidad es el número de casos favorables entre los casos posibles. En datos reales las frecuencias pueden servir para estimar, no para garantizar el próximo resultado.','P(A) = favorables / posibles','Lanzamos un dado equilibrado. Los resultados pares son 2, 4 y 6, es decir tres de seis casos posibles. Por ello P(par)=3/6=1/2.','¿Cuál es la probabilidad de obtener 5 en un dado equilibrado?','1/6.'],
 'ESO4-A|algebra':['Presupuesto y porcentaje de descuento','Discount percentages in a budget','Las Matemáticas A priorizan problemas contextualizados y decisiones informadas. Un descuento del p por ciento se calcula multiplicando el precio por p/100 y restando esa cantidad.','precio final = precio × (1 - p/100)','Una bicicleta cuesta 250 €. Con descuento del 20%, ahorramos 250×0,2=50 €. El precio final es 200 €. Comprobamos que pagar menos es coherente con un descuento.','Un artículo de 80 € tiene un descuento del 25%. ¿Precio final?','60 €.'],
 'ESO4-B|algebra':['Factorización y raíces de polinomios','Polynomial factorisation','Las Matemáticas B profundizan en el trabajo algebraico. Una raíz de un polinomio es un valor que lo hace cero; factorizar ayuda a localizar las raíces de ecuaciones.','x² - 5x + 6 = (x-2)(x-3)','Buscamos dos números que sumen 5 y cuyo producto sea 6: 2 y 3. Factorizamos x²−5x+6 en (x−2)(x−3). Las soluciones de la ecuación son x=2 y x=3.','Resuelve x²-9=0 por factorización.','x=-3 o x=3.'],
 'B1-CYT|functions':['Funciones para fenómenos físicos','Functions in physical models','En Matemáticas I podemos estudiar una relación entre tiempo y distancia mediante funciones. Hay que indicar el dominio, las unidades y el significado del parámetro.','s(t) = 3t, t ≥ 0','Un objeto avanza a velocidad constante de 3 m/s. Tras 4 segundos ha recorrido 12 m. Dibujamos la función sobre un eje horizontal de tiempo y otro vertical de distancia.','¿Qué distancia recorre en 7 s a 3 m/s?','21 m.'],
 'B1-HCS|statistics':['Media ponderada en datos sociales','Weighted averages in social data','En Ciencias Sociales, si los grupos tienen tamaños diferentes debemos ponderar sus medias por el número de elementos, en lugar de promediar directamente las dos medias.','media = Σ(nᵢ×mᵢ) / Σnᵢ','Un grupo de 10 personas tiene media 5 y otro de 30 tiene media 7. La media total es (10×5+30×7)/40=260/40=6,5.','Dos grupos tienen tamaños 2 y 3 con medias 4 y 9. ¿Media global?','7.'],
 'B1-GEN|statistics':['Evaluamos una encuesta','Assess a survey','Para interpretar una encuesta debemos conocer el tamaño de la muestra, la forma de selección y las preguntas. Una muestra sesgada no permite sacar conclusiones fiables para toda la población.','porcentaje = casos / total × 100','De 50 personas entrevistadas, 30 prefieren el tren. Eso representa 60% de la muestra; sin conocer cómo se eligieron, no afirmamos que el 60% de todo el país lo prefiera.','Si 8 de 20 encuestados responden sí, ¿qué porcentaje representa?','40% de la muestra.'],
 'B2-CYT|analysis':['Derivada y velocidad instantánea','Derivative and instantaneous velocity','La derivada de la función de posición respecto al tiempo representa la velocidad instantánea, siempre que la función sea derivable. Las unidades se obtienen dividiendo posición entre tiempo.','si s(t)=t² entonces v(t)=2t','Para s(t)=t² metros, su derivada es v(t)=2t m/s. En el instante t=3 s, v(3)=6 m/s. El número es velocidad en ese instante, no distancia total.','Si s(t)=3t², calcula v(2).','v(t)=6t y v(2)=12 m/s.'],
 'B2-HCS|algebra':['Sistemas lineales para recursos','Linear systems for resources','En Matemáticas Aplicadas a las Ciencias Sociales II, los sistemas de ecuaciones pueden representar restricciones y precios. Cada variable debe tener un significado y la solución debe comprobarse.','2x+y=10; x+y=6','Restamos la segunda ecuación de la primera: x=4. Sustituimos en x+y=6 y obtenemos y=2. Verificamos 2×4+2=10.','Resuelve 3x+y=11 y x+y=5.','x=3, y=2.']
};
export function spainMathOriginalEntries({grade,topic}={}){
 const id=String(grade||''),t=String(topic||'');
 const p=spainMathGradeProfile(id),entry=SPAIN_ORIGINAL_EXAMPLES[id+'|'+t];
 if(!p||!entry)return [];
 return [{
  id:'math-es-lomloe-'+id.toLowerCase()+'-'+t,
  country:'ES',grade:id,stage:p.stage==='beginner'?'primary':p.stage==='medium'?'intermediate':'lower',
  subject:'math',topic:t,level:p.stage==='medium'?'intermediate':'beginner',
  title:entry[0],enTitle:entry[1],statement:entry[2],formula:entry[3],
  worked:entry[4],practice:entry[5],answers:entry[6],aliases:[],
  source:p.source,sourceStatus:'national-skill-examples-not-textbook',
  curriculumCompletion:'partial-source-review'
 }];
}
