// Stage-specific, original astronomy learning activities. Values below are
// teaching simulations or rounded model calculations, never live ephemerides.
// School activities do not assert that Astronomy is compulsory in a jurisdiction.
export const ASTRONOMY_GRAPH_SERIES=Object.freeze({
 solar:{titleRo:'Perioada orbitală și semiaxa',titleEn:'Orbital period and semimajor axis',
  xRo:'Semiaxa (UA)',xEn:'Semimajor axis (AU)',yRo:'Perioada (ani)',yEn:'Period (years)',
  x:[.5,1,1.5,2,3],y:[.35,1,1.84,2.83,5.2],model:'T²/a³≈constantă, pentru aceeași stea'},
 sky:{titleRo:'Înălțime aparentă și timp (simulare)',titleEn:'Apparent altitude vs time (simulation)',
  xRo:'Ore simulate (h)',xEn:'Simulated hours (h)',yRo:'Altitudine (°)',yEn:'Altitude (°)',
  x:[0,1,2,3,4,5],y:[15,28,39,45,42,30],model:'Valorile sunt fictive: nu descriu cerul real fără loc și dată'},
 distances:{titleRo:'Timp de propagare a luminii',titleEn:'Light travel time',
  xRo:'Distanța (UA)',xEn:'Distance (AU)',yRo:'Timp (minute)',yEn:'Time (minutes)',
  x:[.5,1,1.5,2,3],y:[4.16,8.32,12.48,16.64,24.96],model:'t=d/c; 1 UA≈8,32 minute-lumină'},
 gravity:{titleRo:'Perioade orbitale kepleriene',titleEn:'Keplerian orbital periods',
  xRo:'Semiaxa (UA)',xEn:'Semimajor axis (AU)',yRo:'Perioadă (ani)',yEn:'Period (years)',
  x:[.5,1,1.5,2,3],y:[.35,1,1.84,2.83,5.2],model:'T≈a^(3/2), unități orbitale solare în modelul simplificat'},
 stars:{titleRo:'Exemple de stele pe diagrama H–R',titleEn:'Illustrative stars on H–R',
  xRo:'Temperatură (K)',xEn:'Temperature (K)',yRo:'Luminozitate (L☉)',yEn:'Luminosity (L☉)',
  x:[3000,4000,5800,7000,8500],y:[.09,.3,1,2.9,7],model:'Stele fictive pentru exercițiu; nu reprezintă o secvență universală'},
 galaxies:{titleRo:'Curba de rotație – două modele',titleEn:'Galaxy rotation: two models',
  xRo:'Rază (kpc)',xEn:'Radius (kpc)',yRo:'Viteză (km/s)',yEn:'Speed (km/s)',
  x:[1,2,3,4,5,6],y:[110,160,192,200,203,204],
  model:'Date fictive; profilul exterior aproape plat poate indica masă suplimentară'},
 observations:{titleRo:'Apertură și limită de difracție',titleEn:'Aperture and diffraction limit',
  xRo:'Diametru (m)',xEn:'Diameter (m)',yRo:'Rezoluție (arcsec)',yEn:'Resolution (arcsec)',
  x:[.05,.1,.15,.2,.4],y:[2.52,1.26,.84,.63,.315],
  model:'θ≈1,22λ/D pentru λ≈500 nm, fără turbulență atmosferică'},
 cosmology:{titleRo:'Legea Hubble–Lemaître – model local',titleEn:'Hubble–Lemaître local model',
  xRo:'Distanță (Mpc)',xEn:'Distance (Mpc)',yRo:'Viteză (km/s)',yEn:'Velocity (km/s)',
  x:[20,40,60,80,100],y:[1400,2800,4200,5600,7000],
  model:'Simulare cu H₀=70 km/s/Mpc; numai regimul cu redshift mic'},
 exoplanets:{titleRo:'Curbă de tranzit simulată',titleEn:'Simulated transit light curve',
  xRo:'Timp relativ (h)',xEn:'Relative time (h)',yRo:'Flux normalizat',yEn:'Normalised flux',
  x:[-3,-2,-1,0,1,2,3],y:[1,1,.998,.9975,.998,1,1],
  model:'Raportul de raze Rp/Rs=0,05 implică δ≈0,0025'},
 'special-stellar':{titleRo:'Temperatură și luminozitate – eșantion simulat',
  titleEn:'Temperature and luminosity – simulated sample',
  xRo:'Temperatură (K)',xEn:'Temperature (K)',yRo:'Luminozitate (L☉)',yEn:'Luminosity (L☉)',
  x:[3000,4200,5800,6800,8000],y:[.08,.4,1,3.1,8.2],model:'Model de populație, nu catalog real; comparați intervalele de incertitudine'},
 'special-dynamics':{titleRo:'Energie și rază orbitală (model)',
  titleEn:'Orbital radius and energy (model)',
  xRo:'Rază (unități)',xEn:'Radius (units)',yRo:'Modul energie specifică',yEn:'Magnitude of specific energy',
  x:[1,2,3,4,5],y:[1,.5,.33,.25,.2],model:'Dependență idealizată inversă de rază'},
 'special-galactic':{titleRo:'Viteza de rotație galactică – profil simulat',
  titleEn:'Galactic rotation profile – simulated',
  xRo:'Rază (kpc)',xEn:'Radius (kpc)',yRo:'Viteză (km/s)',yEn:'Speed (km/s)',
  x:[1,2,3,4,5,6],y:[100,155,184,205,209,210],model:'Curbă de rotație sintetică; datele reale cer modelarea înclinației'},
 'special-cosmo':{titleRo:'Redshift și viteza locală (simulare)',
  titleEn:'Redshift and local velocity (simulation)',
  xRo:'z simulat',xEn:'Simulated z',yRo:'v (km/s)',yEn:'v (km/s)',
  x:[.002,.005,.01,.015,.02],y:[600,1500,3000,4500,6000],
  model:'v≈cz este valabil doar pentru z mic; nu extrapola la redshift mare'},
 'special-planetary':{titleRo:'Atmosferă: densitatea relativă și altitudinea',
  titleEn:'Atmosphere: relative density and altitude',
  xRo:'Altitudine (km)',xEn:'Altitude (km)',yRo:'Densitate relativă',yEn:'Relative density',
  x:[0,5,10,15,20],y:[1,.61,.37,.22,.14],model:'Profil exponențial sintetic, nu atmosferă măsurată a unei planete'},
 'special-instruments':{titleRo:'Interferometrie: bază și rezoluție',
  titleEn:'Interferometry: baseline and resolution',
  xRo:'Bază (m)',xEn:'Baseline (m)',yRo:'Rezoluție (arcsec)',yEn:'Resolution (arcsec)',
  x:[10,20,40,60,80],y:[.0103,.00516,.00258,.00172,.00129],
  model:'λ/B la λ≈500 nm; rezoluția depinde și de calibrare și de acoperirea (u,v)'},
 'special-highenergy':{titleRo:'Spectru energetic sintetic',
  titleEn:'Synthetic high-energy spectrum',
  xRo:'Energie (keV)',xEn:'Energy (keV)',yRo:'Număr relativ de fotoni',yEn:'Relative photon counts',
  x:[1,2,3,4,5,6],y:[96,65,43,31,24,18],
  model:'Număr fictiv de fotoni; comparația cu zgomotul de fond este esențială'}
});
export const ASTRONOMY_LOWER_SERIES=Object.freeze({
 solar:{titleRo:'Planetele apropiate și perioadele lor',titleEn:'Inner planets and their orbital periods',
  xRo:'Planeta (Mercur=1, Venus=2, Pământ=3, Marte=4)',
  xEn:'Planet index (Mercury=1, Venus=2, Earth=3, Mars=4)',
  yRo:'Perioada orbitală (zile)',yEn:'Orbital period (days)',
  x:[1,2,3,4],y:[88,225,365,687],
  model:'Perioade aproximative, rotunjite, pentru comparația planetelor interioare; nu sunt orele plecărilor lor în timp real'}
});
export const ASTRONOMY_ACTIVITY_DIAGRAM_BY_STAGE=Object.freeze({
 primary:{
  solar:['solar','daynight','phases','seasons'],
  sky:['skycoords','daynight','constellations','diurnal'],
  distances:['scalecomparison','solar','lighttravel','scalecomparison'],
  observations:['telescope','moonlog','constellations','startrail'],
  stars:['solar','constellations','spectrum','stellarlife']
 },
 lower:{
  solar:['daynight','phases','solar','orbit'],sky:['skycoords','diurnal','constellations','skycoords'],
  distances:['lighttravel','parallax','lighttravel','parallax'],
  gravity:['orbit','orbit','orbittransfer','orbittransfer'],
  stars:['stellarlife','spectrum','stellarlife','hr'],
  galaxies:['galaxy','galaxy','rotationcurve','rotationcurve'],
  observations:['moonlog','telescope','spectrum','startrail'],
  cosmology:['cosmos','redshift','redshift','cosmos'],
  exoplanets:['transit','lightcurve','transit','lightcurve']
 },
 upper:{
  solar:['orbit','orbit','orbittransfer','orbittransfer'],
  sky:['skycoords','skycoords','spectrum','skycoords'],
  distances:['lighttravel','parallax','parallax','parallax'],
  gravity:['orbit','orbit','orbittransfer','orbittransfer'],
  stars:['spectrum','hr','hr','stellarlife'],
  galaxies:['galaxy','rotationcurve','rotationcurve','rotationcurve'],
  observations:['telescope','spectrum','spectrum','interferometer'],
  cosmology:['redshift','redshift','redshift','redshift'],
  exoplanets:['transit','lightcurve','lightcurve','spectrum']
 },
 advanced:{
  solar:['orbit','orbittransfer','orbittransfer','orbittransfer'],
  sky:['skycoords','spectrum','skycoords','spectrum'],
  distances:['parallax','lighttravel','parallax','parallax'],
  gravity:['orbit','orbittransfer','orbittransfer','orbittransfer'],
  stars:['hr','spectrum','hr','spectrum'],
  galaxies:['rotationcurve','rotationcurve','galaxy','rotationcurve'],
  observations:['telescope','spectrum','interferometer','interferometer'],
  cosmology:['redshift','redshift','redshift','redshift'],
  exoplanets:['lightcurve','lightcurve','transit','spectrum'],
  'special-stellar':['hr','spectrum','hr','spectrum'],
  'special-dynamics':['orbit','orbittransfer','orbittransfer','orbittransfer'],
  'special-galactic':['rotationcurve','rotationcurve','galaxy','rotationcurve'],
  'special-cosmo':['redshift','redshift','redshift','redshift'],
  'special-planetary':['atmosphere','transit','atmosphere','spectrum'],
  'special-instruments':['telescope','spectrum','interferometer','interferometer'],
  'special-highenergy':['spectrum','accretion','spectrum','accretion']
 }
});
export function astronomyActivityProgression({topic='',stage='primary',grade='',years=[],language='ro',specialty=''}={}){
 if(!ASTRONOMY_GRAPH_SERIES[topic])return [];
 const all=Array.isArray(years)?years:[],idx=all.findIndex(x=>String(x?.id)===String(grade));
 const uni=Number(String(grade).replace('univ-',''));
 if(stage==='advanced'&&!(uni>=1&&uni<=4))return [];
 if(stage!=='advanced'&&idx<0)return [];
 const pos=stage==='advanced'?uni-1:idx;
 const tier=stage==='advanced'?Math.min(3,pos):Math.min(3,Math.floor(pos*4/Math.max(1,all.length)));
 const ro=language==='ro',source=(stage==='lower'&&ASTRONOMY_LOWER_SERIES[topic])||ASTRONOMY_GRAPH_SERIES[topic];
 const cfg=ASTRONOMY_ACTIVITY_DIAGRAM_BY_STAGE[stage]||{};
 const selected=(cfg[topic]||[])[tier]||null;
 const gradeName=(stage==='advanced'?(ro?'Anul universitar ':'University year ')+uni:
  (ro?'Clasa / anul ':'Grade / year ')+grade);
 const label=ro?source.titleRo:source.titleEn;
 const intro=ro?
  'Model educațional. Valorile sunt aproximări ori date simulate, nu o observație în timp real.':
  'Educational model. Figures are rounded or simulated, not real-time observations.';
 const methods={
  primary:['Identificare și desen','Observație și comparație','Model și limite','Jurnalul cerului'],
  lower:['Recunoaștere și variabile','Comparație controlată','Măsurare și interpretare','Argumentare și concluzie'],
  upper:['Fundamente și explicații','Relații fizice și calcule','Date și ipoteze','Cercetare și incertitudini'],
  advanced:['Date, surse și calibrare','Modele și reziduuri','Ipoteze concurente','Analiză reproductibilă']
 };
 const yearFocus=methods[stage]?.[tier]||'Studiu adaptat';
 // Sample complexity grows with the study year; it is not a repeated set of
 // identical data points merely captioned with a different grade.
 const allPoints=source.x.map((x,i)=>({x,y:source.y[i]}));
 const indices=tier===0?[0,1,2]:tier===1?[0,1,2,3]:
  tier===2?[0,2,3,allPoints.length-1]:allPoints.map((_,i)=>i);
 const unique=[...new Set(indices)].filter(i=>i>=0&&i<allPoints.length);
 const x=unique.map(i=>allPoints[i].x),y=unique.map(i=>allPoints[i].y);
 const base=stage==='primary'?[
   {kind:'activity',step:0,topic,stage,grade,tier, title:(ro?yearFocus+' · Observă: ':'Observation: ')+label,
    subtitle:ro?'Desen, comparație și explicație potrivite vârstei':'Age-appropriate drawing and comparison',
    question:ro?'Ce poți observa direct și ce reprezintă numai un model?':'What can you observe directly, and what is only a model?'}
  ]:[
  {kind:'activity',step:0,topic,stage,grade,tier, title:(ro?yearFocus+' · Investigație: ':'Guided investigation: ')+label,
   subtitle:(ro?yearFocus+' · Obiectiv, ipoteză, protocol și concluzii':'Objective, hypothesis, method and conclusions'),
   question:ro?'Care variabilă poate schimba rezultatul și cum verifici ipoteza?':'What changes the outcome and how is the hypothesis tested?'},
  {kind:'graph',step:1,topic,stage,grade,tier, title:(ro?yearFocus+' · Grafic: ':'Data and graph: ')+label,
   subtitle:(ro?yearFocus+' · Valori numerice, axe, unități și explicație':'Numeric data, axes, units and explanation'),
   question:ro?'Ce relație indică punctele și ce limite are modelul?':'What trend does the plot show and what are the model limitations?',
   x,y,xLabel:ro?source.xRo:source.xEn,yLabel:ro?source.yRo:source.yEn,
   model:source.model,seriesTitle:label,advanced:stage==='advanced'}
  ];
 // A primary student gets observation + one picture, not an advanced data chart.
 if(selected)base.push({kind:'diagram',step:2,topic,stage,grade,tier,
   title:(ro?yearFocus+' · Model explicat: ':'Explained illustration: ')+label,
  subtitle:(ro?yearFocus+' · Explicația fenomenului și limitele desenului':'Explaining the phenomenon and drawing limitations'),
  question:ro?'De ce desenul este doar o reprezentare, nu o măsurare?':'Why is the figure a model rather than a measurement?',
  diagram:selected});
 if(stage==='advanced')base.push({
  kind:'analysis',step:3,topic,stage,grade,tier, title:(ro?yearFocus+' · Analiza reziduurilor: ':'Residuals and uncertainty analysis: ')+label,
  subtitle:ro?'Comparație de modele, reziduuri și incertitudini':'Compare models, residuals and uncertainty',
  question:ro?'Cum ar schimba eroarea sistematică interpretarea măsurărilor?':'How could systematic error change the interpretation?',
  x,y,xLabel:ro?source.xRo:source.xEn,yLabel:ro?source.yRo:source.yEn,
  model:source.model,seriesTitle:label,advanced:true});
 return base.map(a=>({...a,id:'astronomy-practical-'+stage+'-'+grade+'-'+topic+'-'+a.kind,
  gradeName,intro,yearFocus,dataSource:source,mode:stage==='primary'?'observație':stage==='lower'?'comparație':
   stage==='upper'?'model cantitativ':'analiză cu incertitudini',specialty}));
}
