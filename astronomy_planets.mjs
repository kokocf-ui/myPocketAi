// NASA/JPL approximate orbital-distance reference values. Classroom rendering is NOT to scale.
// https://science.nasa.gov/solar-system/planets/
// https://science.nasa.gov/learn/basics-of-space-flight/chapter1-2/
// The mean orbital distances below are rounded to two decimal places.
export const ASTRONOMY_PLANETS=Object.freeze([
 {id:'mercury',ro:'Mercur',en:'Mercury',au:.39,color:'#a6abb2',size:4,phase:.2,
  factRo:'Cea mai apropiată planetă de Soare; suprafață stâncoasă cu multe cratere.',
  factEn:'Closest to the Sun; rocky surface with many impact craters.'},
 {id:'venus',ro:'Venus',en:'Venus',au:.72,color:'#e7c98c',size:6,phase:1.4,
  factRo:'Planetă stâncoasă cu atmosferă densă și temperaturi foarte ridicate.',
  factEn:'Rocky planet with a dense atmosphere and extremely high surface temperatures.'},
 {id:'earth',ro:'Pământ',en:'Earth',au:1,color:'#55b5e8',size:7,phase:2.5,
  factRo:'Are oceane de apă lichidă la suprafață și susține viața cunoscută.',
  factEn:'Has liquid-water oceans and supports the life currently known to us.'},
 {id:'mars',ro:'Marte',en:'Mars',au:1.52,color:'#e28c6a',size:5,phase:3.5,
  factRo:'Planetă stâncoasă roșiatică, cu calote polare și atmosferă subțire.',
  factEn:'Reddish rocky planet with polar ice caps and a thin atmosphere.'},
 {id:'jupiter',ro:'Jupiter',en:'Jupiter',au:5.20,color:'#d9ae8c',size:14,phase:4.2,
  factRo:'Cea mai mare planetă; gigant gazos cu benzi de nori și Marea Pată Roșie.',
  factEn:'Largest planet; gas giant with cloud bands and the Great Red Spot.'},
 {id:'saturn',ro:'Saturn',en:'Saturn',au:9.58,color:'#ecd293',size:12,phase:5.5,
  factRo:'Gigant gazos cunoscut pentru sistemul său extins de inele.',
  factEn:'Gas giant best known for its extensive ring system.'},
 {id:'uranus',ro:'Uranus',en:'Uranus',au:19.20,color:'#96d8d8',size:9,phase:.9,
  factRo:'Gigant de gheață cu axa de rotație foarte înclinată.',
  factEn:'Ice giant with an unusually tilted rotation axis.'},
 {id:'neptune',ro:'Neptun',en:'Neptune',au:30.05,color:'#547dc7',size:9,phase:5.9,
  factRo:'Gigant de gheață foarte îndepărtat, cu vânturi atmosferice puternice.',
  factEn:'Distant ice giant with powerful atmospheric winds.'}
].map(planet=>Object.freeze(planet)));

export const ASTRONOMY_PLANET_REFERENCE=Object.freeze({
 url:'https://science.nasa.gov/learn/basics-of-space-flight/chapter1-2/',
 distances:'Approximate mean Sun-planet distances in astronomical units (AU).',
 disclaimerRo:'Planetele, orbitele și distanțele din desen NU sunt la scară; pozițiile sunt ilustrative, nu poziții astronomice actuale.',
 disclaimerEn:'Planets, orbits and spacing are NOT to scale; positions are illustrative, not current ephemerides.',
 astronomicalUnitMeters:149597870700
});
