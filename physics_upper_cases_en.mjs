import {physicsUpperTeachingGuide} from './physics_upper_teaching_guides.mjs';

// Original, independently authored English upper-secondary Physics cases.
// These are advisory learning materials, NOT translations claiming official
// recognition by any national school or examination authority.
const methodNotes={"units":"Check every conversion with the physical dimensions, and include both an appropriate unit and a plausible scale for the final result.","kinematics":"Identify initial and final states before calculating, and interpret the result with a defined direction and a time unit.","dynamics":"Begin by drawing all forces on one object, then calculate the net effect rather than treating one applied force as the resultant.","energy":"Keep the mass, speed and height in compatible SI units; report an energy in joules and state the reference if it matters.","fluids":"Identify the relevant contact area, depth or displaced-fluid volume and check whether the final unit is a pascal or a newton.","heat":"Separate warming without phase change from latent heat during a phase change, and use compatible mass and temperature units.","electric":"State the electrical quantities and the configuration in which the current, potential difference or capacitance law holds.","waves":"Check the relation between frequency in hertz, period in seconds and wavelength in metres before interpreting propagation.","optics":"Draw the optical normal or principal axis and name the angle convention before computing or explaining the light ray.","electromagnetism":"Check the orientation of the conductor or surface normal and the magnetic field before computing the force or flux.","thermodynamics":"Use an absolute temperature and declare the sign convention for heat and work before checking the energy balance.","circuits":"Identify each branch and node and confirm whether the elements are in series or parallel before combining resistances.","modern":"Keep physical constants in compatible SI units and verify the order of magnitude or the remaining fraction after decay.","measurement":"Preserve the raw data and examine instrument resolution and systematic errors before presenting a rounded conclusion."};
const chapters={
  "units": [
    [
      "Physical dimensions",
      "A physical equation must be dimensionally consistent. Every additive term has the same physical dimensions, although compatible dimensions alone do not prove a law is correct. State units and assumptions before calculating.",
      "For speed v=d/t, metres divided by seconds produce m/s; multiplying distance by time does not yield speed.",
      "Which unit results from acceleration divided by time?",
      "m/s³, because acceleration is m/s²."
    ],
    [
      "Converting speed",
      "Converting km/h to m/s changes both the distance and time units. Multiply the numerical value by 1000/3600, or divide by 3.6. Always keep the unit attached to the answer.",
      "72 km/h is 72×1000/3600 = 20 m/s.",
      "Convert 108 km/h to m/s.",
      "30 m/s."
    ],
    [
      "Significant figures",
      "A numerical result must reflect the precision of its input measurements. Carry more digits through intermediate calculations and round the final result appropriately. Extra calculator digits are not extra physical accuracy.",
      "12.345 m stated to three significant figures becomes 12.3 m.",
      "Round 0.004567 m to two significant figures.",
      "0.0046 m."
    ]
  ],
  "kinematics": [
    [
      "Distance and displacement",
      "Distance is the length of a travelled path, while displacement is the change in position including direction. A closed journey can have non-zero distance and zero displacement. Specify the reference frame.",
      "A traveller walks 4 m east and then 4 m west: distance 8 m, displacement 0 m.",
      "What is the total distance for 3 m out and 3 m back?",
      "6 m, with zero net displacement."
    ],
    [
      "Mean acceleration",
      "Average acceleration equals the vector change in velocity divided by the time interval. Changing the direction of travel can produce acceleration even if speed remains constant. Use consistent units.",
      "A car increasing velocity from 2 m/s to 10 m/s in 4 s has mean acceleration 2 m/s² in that direction.",
      "Find mean acceleration from rest to 12 m/s in 3 s.",
      "4 m/s²."
    ],
    [
      "Area under a velocity-time graph",
      "For a graph of signed velocity against time, the signed area between the curve and the axis represents displacement. An area below the time axis contributes a negative displacement. A speed-time graph instead shows non-negative path distance.",
      "Constant velocity of 6 m/s for 5 s produces 30 m of displacement.",
      "What displacement results from constant 4 m/s over 7 s?",
      "28 m."
    ]
  ],
  "dynamics": [
    [
      "Combining forces",
      "The resultant force is the vector sum of forces acting on one object. Opposing forces along one axis subtract. Zero resultant acceleration does not necessarily mean zero velocity in an inertial frame.",
      "A 12 N force to the right against a 7 N force to the left gives 5 N rightward.",
      "Find the resultant of 8 N north and 8 N south.",
      "0 N."
    ],
    [
      "Newton's second law",
      "For a body of constant mass in an inertial frame, net force equals mass times acceleration: ΣF=ma. First identify every force on the body; using one applied force alone can be wrong if resistance acts too.",
      "A resultant 8 N on 4 kg creates acceleration 2 m/s².",
      "What acceleration results from 15 N net force on 5 kg?",
      "3 m/s²."
    ],
    [
      "Kinetic friction model",
      "A simple classroom approximation for sliding friction is Ff=μN. Here μ is dimensionless, and the approximation depends on surfaces and conditions. Friction is not a fixed universal fraction for all materials.",
      "If μ=0.3 and normal contact force N=50 N, sliding friction is about 15 N.",
      "Calculate Ff for μ=0.2 and N=40 N.",
      "8 N."
    ]
  ],
  "energy": [
    [
      "Kinetic energy",
      "Classical translational kinetic energy is Ek=mv²/2. Squaring the speed means that doubling speed makes kinetic energy four times larger for the same mass. State when the classical approximation applies.",
      "A 2 kg body moving at 3 m/s has Ek=2×9/2=9 J.",
      "Find kinetic energy for a 4 kg body moving at 5 m/s.",
      "50 J."
    ],
    [
      "Gravitational potential energy",
      "Near Earth's surface the change in potential energy can be approximated by ΔEp=m g Δh. The zero height is conventional; changes in potential energy are meaningful relative to a specified reference.",
      "A 2 kg object raised 3 m with g≈10 N/kg gains 60 J.",
      "Find the potential-energy increase for 3 kg raised 2 m at g=10 N/kg.",
      "60 J."
    ],
    [
      "Average power",
      "Power measures energy transferred per unit time: P=ΔE/Δt. Watts equal joules per second. A shorter interval produces greater average power for the same energy transfer.",
      "Transferring 150 J in 5 s gives mean power 30 W.",
      "Find mean power for 600 J transferred in 20 s.",
      "30 W."
    ]
  ],
  "fluids": [
    [
      "Pressure and contact area",
      "Mean pressure is the perpendicular force per unit area, p=F/A. Force and pressure are different quantities. The same force can produce much higher pressure when concentrated over a smaller area.",
      "100 N distributed over 0.5 m² produces 200 Pa.",
      "Calculate pressure from 80 N over 0.4 m².",
      "200 Pa."
    ],
    [
      "Pressure with depth",
      "In a liquid with approximately constant density at rest, Δp=ρgΔh. The formula gives the pressure difference caused by depth, not necessarily the full absolute pressure. Include liquid density and local gravity.",
      "For water of density 1000 kg/m³ and g≈10 N/kg, a 2 m depth difference gives Δp≈20,000 Pa.",
      "Calculate Δp for a 1 m depth difference in water with g≈10 N/kg.",
      "10,000 Pa."
    ],
    [
      "Buoyancy and displaced fluid",
      "The upward buoyant force equals the weight of fluid displaced by a body: Fb=ρfluid g Vdisplaced. For partly floating objects, use the submerged volume and not automatically the entire object's volume.",
      "Displacing 0.002 m³ of water at 1000 kg/m³ and g=10 N/kg creates a buoyant force of about 20 N.",
      "Find Fb when 0.001 m³ of water is displaced in the same conditions.",
      "10 N."
    ]
  ],
  "heat": [
    [
      "Specific heat capacity",
      "Without a phase change, a simple heating relation is Q=m c ΔT. The energy depends on mass, material-specific heat capacity and temperature change. Keep units consistent and account for unwanted losses when comparing experiments.",
      "For 2 kg of water, c≈4200 J/(kg·K), and warming by 5 K, Q≈42,000 J.",
      "What energy warms 1 kg of water by 2 K under the same model?",
      "8,400 J."
    ],
    [
      "Latent heat",
      "Changing phase requires energy even when temperature stays approximately constant. For one specified phase transition Q=mL, where L is the specific latent heat. Do not combine heating and melting contributions without considering each step.",
      "Melting 0.1 kg of ice at L≈334,000 J/kg needs about 33,400 J.",
      "What energy melts 0.2 kg under this model?",
      "66,800 J."
    ],
    [
      "Conduction and materials",
      "Conduction transfers thermal energy within materials or between objects in contact. Its rate depends on material, geometry and temperature difference. Feeling cold on touch does not establish the material's temperature.",
      "A metal bar usually conducts heat more readily than a similar wooden bar under equivalent conditions.",
      "Can two objects at equal temperature feel different to the touch?",
      "Yes; heat transfers at different rates."
    ]
  ],
  "electric": [
    [
      "Current and charge",
      "Electric current measures charge crossing a section per unit time: I=ΔQ/Δt. Conventional current direction is defined by positive charge flow and is opposite electron drift in common metal conductors.",
      "At 2 A for 5 s, 10 C of charge passes a chosen section.",
      "What charge passes at 3 A for 4 seconds?",
      "12 C."
    ],
    [
      "Potential difference and energy",
      "Potential difference is work or transferred energy per unit charge in a suitable model: V=W/q. Voltage is not current; use volts for the former and amperes for the latter.",
      "A transfer of 12 J per 3 C corresponds to a potential difference of 4 V.",
      "What voltage corresponds to 20 J transferred for 5 C?",
      "4 V."
    ],
    [
      "Capacitance",
      "Capacitance is charge stored per unit potential difference: C=Q/V for a linear capacitor. Its unit is the farad. The relationship depends on geometry and dielectric assumptions.",
      "Charge 6 μC at 3 V corresponds to capacitance 2 μF.",
      "What is C when Q=12 μC and V=4 V?",
      "3 μF."
    ]
  ],
  "waves": [
    [
      "Period and frequency",
      "Frequency is the number of oscillations per second. Period is the time for one cycle. For regular periodic motion f=1/T; hertz is equivalent to s⁻¹.",
      "For a period of 0.25 s, f=4 Hz.",
      "What frequency corresponds to a period of 0.5 s?",
      "2 Hz."
    ],
    [
      "Wave speed",
      "In a periodic wave, propagation speed relates to frequency and wavelength by v=fλ within a specified medium. The wave speed does not equal the local oscillating speed of material particles.",
      "A wave with f=5 Hz and wavelength 2 m travels at 10 m/s.",
      "Find wave speed for f=8 Hz and λ=0.5 m.",
      "4 m/s."
    ],
    [
      "Echoes and distances",
      "An echo is reflected sound reaching an observer after a delay. The measured travel time usually covers an outward and return path, so distance to a flat reflector is approximately d=vt/2 under suitable assumptions.",
      "For v≈340 m/s and a delay of 0.6 s, the reflector is about 102 m away.",
      "How far is the reflector at 0.2 s delay under the same conditions?",
      "34 m."
    ]
  ],
  "optics": [
    [
      "Law of reflection",
      "For a plane mirror reflecting a single ray, incidence and reflection angles are equal when measured relative to the surface normal. Angles measured from the surface must first be converted.",
      "An incidence angle of 30° relative to the normal produces a reflection angle of 30°.",
      "Find the reflection angle for a 25° incidence relative to the normal.",
      "25°."
    ],
    [
      "Refraction across a boundary",
      "Snell's law is n₁ sin θ₁=n₂ sin θ₂ for an applicable optical boundary. The ray may not change direction at normal incidence even when its speed changes in a different transparent material.",
      "At normal incidence θ₁=0°, the transmitted ray remains along the normal at a flat interface.",
      "Why is there no change in the ray direction at normal incidence?",
      "Both incidence and refraction angles to the normal are zero."
    ],
    [
      "Thin-lens formula",
      "With a stated sign convention and a thin-lens approximation, 1/f=1/dobject+1/dimage. Real versus virtual images depend on the ray paths and the interpretation of signed distances.",
      "With f=10 cm and object distance 30 cm, image distance is 15 cm using the real-positive convention.",
      "Find image distance for f=20 cm and object distance 40 cm under the same convention.",
      "40 cm."
    ]
  ],
  "electromagnetism": [
    [
      "Force on a current-carrying conductor",
      "A straight conductor in a uniform magnetic field can experience force with magnitude F=BIL sinθ. The angle is between the conductor's current direction and the field, while force direction depends on orientation.",
      "At B=0.5 T, I=2 A, L=0.3 m and θ=90°, force is 0.3 N.",
      "Find force at B=1 T, I=2 A, L=0.5 m, perpendicular to the field.",
      "1 N."
    ],
    [
      "Magnetic flux",
      "Flux through a flat area in a uniform field is Φ=BA cosθ, where θ is the angle between the field and the surface normal. Confusing the plane with its normal is a common error.",
      "With B=2 T and A=0.1 m², aligned normal gives flux 0.2 Wb.",
      "Find Φ for B=1 T and A=0.5 m² with aligned normal.",
      "0.5 Wb."
    ],
    [
      "Electromagnetic induction",
      "A changing magnetic flux through a conducting loop can induce an electromotive force. For a simple coil, its magnitude may be estimated as |ε|=N|ΔΦ|/Δt, while Lenz's law determines the direction.",
      "Ten turns experiencing flux change 0.2 Wb per turn in 2 s yield |ε|=1 V.",
      "Find |ε| for five turns, ΔΦ=0.4 Wb per turn in 2 s.",
      "1 V."
    ]
  ],
  "thermodynamics": [
    [
      "Ideal-gas equation",
      "For an ideal gas, pV=nRT. The temperature must be absolute (kelvin), and the approximation has limits, especially where real-gas interactions matter.",
      "For 1 mol at 300 K in 0.025 m³ with R=8.31 J/(mol·K), pressure is about 99,720 Pa.",
      "Find pressure for 1 mol at 300 K in 0.05 m³.",
      "About 49,860 Pa."
    ],
    [
      "First law of thermodynamics",
      "One common sign convention writes ΔU=Q−W, where W is work performed by the system. Different books may define W oppositely; state the convention before calculating.",
      "If a system receives 500 J of heat and does 200 J of work, ΔU=300 J.",
      "Find ΔU for Q=700 J received and W=300 J done by the system.",
      "400 J."
    ],
    [
      "Isothermal change",
      "For a fixed quantity of ideal gas at constant absolute temperature, pV remains constant. As volume decreases, pressure increases in inverse proportion within the model.",
      "Halving the gas volume isothermally doubles its pressure.",
      "What happens to pressure when volume becomes four times larger?",
      "Pressure falls to one quarter."
    ]
  ],
  "circuits": [
    [
      "Resistors in series",
      "Series resistors share the same current and their equivalent resistance is the sum: Req=R1+R2+… for ordinary ideal resistors. Voltage differences distribute according to resistance.",
      "A 2 Ω and a 3 Ω resistor in series give Req=5 Ω.",
      "Find Req for 4 Ω and 6 Ω in series.",
      "10 Ω."
    ],
    [
      "Resistors in parallel",
      "Ideal resistors connected in parallel have the same potential difference. Their equivalent resistance follows 1/Req=1/R1+1/R2, giving a result smaller than either resistance for two positive values.",
      "Resistors 2 Ω and 3 Ω in parallel give Req=(2×3)/(2+3)=1.2 Ω.",
      "Find Req for two identical 4 Ω resistors in parallel.",
      "2 Ω."
    ],
    [
      "Kirchhoff's circuit laws",
      "At a circuit junction, total incoming current equals outgoing current in steady state. Around a closed loop, signed voltage changes sum to zero. Clear sign conventions are essential.",
      "A junction with 5 A incoming and 2 A leaving on one branch needs 3 A on another outgoing branch.",
      "Find the second outgoing current if 8 A enters and 3 A exits first.",
      "5 A."
    ]
  ],
  "modern": [
    [
      "Photon energy",
      "For a photon, E=hf where h is Planck's constant and f is light frequency. A higher frequency means more energy per photon, not necessarily more total brightness.",
      "At f=5×10¹⁴ Hz and h≈6.63×10⁻³⁴ J·s, E≈3.315×10⁻¹⁹ J.",
      "How does one photon's energy change if frequency doubles?",
      "It doubles."
    ],
    [
      "Wavelength of electromagnetic radiation",
      "In vacuum, light frequency and wavelength satisfy c=fλ. Different wavelengths correspond to different photon energies; be careful to convert nanometres to metres.",
      "At f=6×10¹⁴ Hz with c≈3×10⁸ m/s, λ≈500 nm.",
      "Find wavelength at f=3×10¹⁴ Hz in vacuum.",
      "About 1000 nm."
    ],
    [
      "Radioactive half-life",
      "For a large population of identical unstable nuclei, half-life is the time over which the expected number remaining halves. The decay time of a particular nucleus cannot be predicted exactly.",
      "From 80 g of a pure radioactive isotope, about 20 g remain after two half-lives.",
      "How much of 64 g remains on average after three half-lives?",
      "8 g."
    ]
  ],
  "measurement": [
    [
      "Random and systematic errors",
      "Random variation causes readings to fluctuate; systematic bias can shift every reading in one direction. Repeating trials helps estimate scatter but does not automatically correct a miscalibrated instrument.",
      "A thermometer always reading 2 °C high remains biased even after ten readings.",
      "Can averaging readings alone remove a calibration error?",
      "No. The systematic error must be identified separately."
    ],
    [
      "Mean and spread",
      "An arithmetic mean describes a central value, but meaningful data analysis also considers the spread. Two data sets with identical means can have very different variation and uncertainty.",
      "Measurements 10.1, 10.3 and 10.2 cm have a mean of 10.2 cm.",
      "Find the mean of 8 s, 9 s and 10 s.",
      "9 s."
    ],
    [
      "Reading graph gradients",
      "A gradient reports how one physical quantity changes with another; its unit comes from the axes. A numerical correlation alone is not proof of causation.",
      "On a position-time graph, a change of 20 m in 4 s corresponds to a slope of 5 m/s.",
      "What is the unit of a velocity-time graph gradient?",
      "m/s², acceleration."
    ]
  ]
};
export const PHYSICS_UPPER_CASES_EN=Object.freeze(Object.fromEntries(
 Object.entries(chapters).map(([topic,items])=>[topic,Object.freeze(items.map(
 ([title,statement,workedExample,exercise,answer],i)=>Object.freeze({
  ...physicsUpperTeachingGuide(topic,i,'en'),
  id:'upper-physics-en-case-'+topic+'-'+(i+1),subject:'physics',topic,
  level:'intermediate',title,statement,workedExample:workedExample+' '+methodNotes[topic],exercise,answer,
  source:'original-english-high-school-physics-advisory',nationallyVerified:false,
  language:'en'
 })))])));
