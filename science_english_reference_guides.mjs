// Original English-reference chapter guides for the four Sciences.
// They are not translations certified against any national curriculum.
// Every entry has a concept, worked example, misconception and check question.
export const SCIENCE_GUIDES_EN=Object.freeze({
  "chemistry": {
    "fundamentals": [
      "Matter has mass and occupies space. Pure substances have characteristic compositions; a mixture contains more than one substance.",
      "Ice melting is a physical change: both ice and liquid water consist of H₂O. Salt water remains a mixture.",
      "A visible change does not by itself prove that a new substance formed.",
      "How can you distinguish a mixture from a pure substance using observations and safe separation methods?"
    ],
    "atomic": [
      "The atomic number Z is the number of protons in a nucleus. Neutral atoms have the same number of electrons as protons; isotopes of one element differ in neutron count.",
      "Neutral sodium has Z=11, so it has 11 protons and 11 electrons. Na⁺ still has 11 protons but has lost one electron.",
      "Do not confuse mass number with the average atomic mass listed in a periodic table.",
      "Which particles change when sodium becomes a positive ion?"
    ],
    "periodic": [
      "The periodic table is ordered by increasing atomic number. Groups and periods reveal recurring patterns linked to electron structure.",
      "Sodium and potassium belong to the same group and commonly form +1 ions, but occupy different periods.",
      "Elements in one group are similar, not identical; trends have exceptions.",
      "What does atomic number tell you, and what does group membership suggest?"
    ],
    "bonding": [
      "Chemical bonds depend on how electrons are distributed or shared. Ionic, covalent and metallic models describe different structures.",
      "The two hydrogen atoms in H₂ share an electron pair. Solid NaCl instead forms an extended ionic lattice.",
      "A polar bond does not automatically mean the whole molecule has a permanent dipole.",
      "Why are H₂O and CO₂ different in molecular polarity despite polar bonds?"
    ],
    "reactions": [
      "Chemical equations describe reactants forming products. A balanced equation preserves the numbers of atoms of every element and total charge.",
      "2H₂ + O₂ → 2H₂O has four hydrogen atoms and two oxygen atoms on each side.",
      "Balancing coefficients cannot be substituted by changing the chemical subscripts in formulas.",
      "Why is H₂ + O₂ → H₂O not balanced, and which atoms are missing on the product side?"
    ],
    "inorganic": [
      "Inorganic chemistry includes salts, oxides, acids, bases and many other compounds. Classification combines composition, bonding and observed properties.",
      "Solid NaCl contains an ionic lattice. CO₂ is a molecular oxide; these materials have very different structures.",
      "Not all oxides behave as acids or bases, and classification alone does not establish safety.",
      "What evidence would let you classify a compound as an oxide or a salt?"
    ],
    "solutions": [
      "A solution is a homogeneous mixture of solute and solvent. Molar concentration is c=n/V when n is in moles and V is the solution volume in litres.",
      "Dissolving 0.50 mol and making the final volume 2.0 L gives c=0.25 mol/L.",
      "The volume of solvent added is not necessarily equal to the final solution volume.",
      "Which measurements do you need to calculate molar concentration?"
    ],
    "acids": [
      "Brønsted–Lowry acids donate protons and bases accept protons. In dilute aqueous solutions pH describes acidity using hydrogen-ion activity.",
      "In an ideal dilute solution with [H₃O⁺]≈10⁻³ mol/L, pH is approximately 3.",
      "Strong versus weak describes ionisation behaviour; concentrated versus dilute describes amount in solution.",
      "Explain why a concentrated weak acid and a dilute strong acid are not contradictory terms."
    ],
    "organic": [
      "Organic chemistry connects molecular structure to reactivity. Carbon chains, rings and functional groups allow structural isomers.",
      "Ethanol CH₃CH₂OH and dimethyl ether CH₃OCH₃ both have formula C₂H₆O but different connectivity.",
      "A molecular formula alone is not enough to determine all chemical properties.",
      "How can two isomers have different boiling points?"
    ],
    "physical": [
      "Thermochemistry examines energy changes and kinetics examines reaction rates. Enthalpy change and activation energy describe different properties.",
      "An exothermic process has negative reaction enthalpy in the stated convention. A catalyst may increase rate without changing the equilibrium constant.",
      "A reaction being energetically favourable does not guarantee that it happens rapidly.",
      "What changes when a catalyst is added, and what remains unchanged?"
    ],
    "electrochem": [
      "Oxidation is loss of electrons and reduction is gain. Electrochemical cells couple redox reactions to charge transfer.",
      "In the half-reaction Zn → Zn²⁺ + 2e⁻, zinc is oxidised. The electrons must be balanced with the reduction half-reaction.",
      "Oxidation is not limited to reactions involving oxygen.",
      "Which species is oxidised in Zn → Zn²⁺ + 2e⁻, and how can you tell?"
    ],
    "analytical": [
      "Analytical chemistry identifies substances and estimates their amounts using measurements, calibration and uncertainty.",
      "A calibration graph relates known concentrations to a detector response; an unknown is estimated only within an appropriate validated range.",
      "A single instrument reading is not proof of exact concentration; interferences and uncertainty matter.",
      "Why must a calibration range and blank measurement be considered?"
    ],
    "biochemistry": [
      "Biochemistry studies molecular processes of life, including proteins, nucleic acids, enzymes and metabolic pathways.",
      "An enzyme can speed up a reaction by lowering activation energy without being consumed in the overall catalytic cycle.",
      "Biological pathways are regulated and depend on temperature, pH and available substrates.",
      "How does an enzyme affect reaction rate without changing the overall reaction balance?"
    ],
    "advanced": [
      "Advanced chemistry connects atomic-scale models to thermodynamics, kinetics, spectroscopy and material structure. Conclusions depend on assumptions and measured conditions.",
      "For a proposed mechanism, compare its predicted rate law with data rather than claiming that an equation alone proves the mechanism.",
      "Complex reactions rarely follow a single universal rule; a model needs a stated domain of validity.",
      "Which observations could distinguish between two competing reaction mechanisms?"
    ]
  },
  "physics": {
    "units": [
      "Physics describes quantities with numerical values and units. SI base and derived units allow dimensional consistency.",
      "Convert 72 km/h to metres per second: 72×1000/3600 = 20 m/s.",
      "A numeric result without the correct unit can be physically misleading.",
      "How would you test that an equation is dimensionally consistent?"
    ],
    "kinematics": [
      "Displacement and velocity include direction; distance and speed are scalar quantities. Acceleration is a change of velocity per unit time.",
      "For constant acceleration from rest, a=2 m/s² over 4 s gives v=8 m/s.",
      "Average speed and average velocity need not be equal on a return trip.",
      "What is the average velocity after travelling out and returning to the starting point?"
    ],
    "dynamics": [
      "Newton's laws relate resultant force, mass and acceleration in inertial reference frames.",
      "For a 2 kg body with net force 6 N, a=F/m=3 m/s².",
      "A moving body need not have a forward net force to continue moving uniformly.",
      "Which forces must be included before applying F=ma?"
    ],
    "energy": [
      "Work transfers energy when a force acts through a displacement. Energy conservation accounts for transformations and transfers.",
      "Lifting a 2 kg mass through 3 m adds roughly mgh=2×9.8×3=58.8 J of gravitational potential energy.",
      "Conserved energy does not mean every form remains equally useful.",
      "Where does mechanical energy go when friction acts?"
    ],
    "fluids": [
      "Pressure is force per unit area. Fluid pressure and buoyancy depend on depth, density and the applied forces.",
      "For force 20 N over area 0.01 m², the pressure is 2000 Pa.",
      "Pressure and force are not interchangeable, and pressure does not act only downwards.",
      "What happens to pressure when the same force acts on half the area?"
    ],
    "heat": [
      "Temperature is related to thermal state; heat is energy transferred because of a temperature difference.",
      "A warm metal spoon placed in cooler water transfers thermal energy until the temperatures approach equilibrium.",
      "A large quantity of moderately warm material can contain more internal energy than a small very hot one.",
      "Why are temperature and heat not the same quantity?"
    ],
    "electric": [
      "Charge flow constitutes electric current. Voltage is potential difference and resistance relates voltage and current for ohmic components.",
      "Across a 4 Ω resistor supplied at 12 V, the model gives I=V/R=12/4=3 A.",
      "Ohm's law should not be applied blindly to all materials or operating conditions.",
      "How does current change if resistance doubles at fixed voltage?"
    ],
    "waves": [
      "Waves transport energy and information while material often oscillates about an equilibrium position. Frequency, period, wavelength and speed are related.",
      "A wave with frequency 50 Hz and wavelength 2 m travels at v=fλ=100 m/s.",
      "Medium particles do not necessarily travel along with the advancing wave.",
      "What happens to wavelength if frequency doubles while wave speed stays fixed?"
    ],
    "optics": [
      "Reflection and refraction describe how light behaves at boundaries; wave optics also explains interference and diffraction.",
      "When light passes from air into glass at an angle, its direction changes according to Snell's law.",
      "Refraction need not occur at normal incidence as a direction change; speed still changes.",
      "How do refractive index and incident angle influence the refracted ray?"
    ],
    "electromagnetism": [
      "Electric and magnetic fields are related; changing magnetic flux through a circuit can induce electromotive force.",
      "Moving a magnet toward a coil can produce an induced current in a closed circuit.",
      "A steady magnetic field does not automatically imply a changing induced voltage in a fixed loop.",
      "What must change for electromagnetic induction to occur?"
    ],
    "thermodynamics": [
      "Thermodynamics describes energy, work, heat and entropy in systems. The first law relates changes of internal energy to transfers.",
      "If 100 J of heat enters a gas and it performs 40 J of work, ΔU=60 J using ΔU=Q−W.",
      "Heat and work describe transfers, not substances stored inside the gas.",
      "How would the answer change if the gas performed 80 J of work?"
    ],
    "circuits": [
      "Circuit analysis uses conservation of charge and energy. Kirchhoff's junction and loop rules apply under their usual lumped-circuit assumptions.",
      "Two 3 Ω resistors in series give 6 Ω, while two in parallel give 1.5 Ω.",
      "Equivalent resistance depends on connection topology, not simply the number of components.",
      "How do current and voltage differ between series and parallel branches?"
    ],
    "modern": [
      "Modern physics describes phenomena where classical approximations are insufficient, including quantum and relativistic effects.",
      "A photon's energy is E=hf, so doubling its frequency doubles its energy.",
      "Quantum theory does not imply that ordinary macroscopic objects randomly violate conservation laws.",
      "What quantity sets the energy of an individual photon?"
    ],
    "measurement": [
      "Experimental measurement requires units, uncertainty, appropriate instruments and repeatability. Reporting more digits than the data justify is misleading.",
      "For readings 10.1, 10.2 and 10.1 cm, report a representative result with an uncertainty appropriate to instrument resolution.",
      "High precision is not proof of accuracy; systematic bias may remain.",
      "How can repeated measurements expose random variation but miss a calibration error?"
    ]
  },
  "biology": {
    "cells": [
      "Cell theory connects organisms to cellular structure. Cell membranes regulate exchange; eukaryotic and prokaryotic cells differ in compartmentalisation.",
      "A leaf cell may contain chloroplasts for photosynthesis and mitochondria for respiration.",
      "Not every cell contains every textbook organelle; specialised cells can lack typical structures.",
      "Which structure is shared by all living cells, including bacteria and eukaryotes?"
    ],
    "biomolecules": [
      "Proteins, nucleic acids, carbohydrates and lipids have distinct roles in cellular structures and processes.",
      "Enzymes are proteins or catalytic RNA that increase reaction rates through specific interactions.",
      "Not every carbohydrate is a quick energy source and not every lipid is merely an energy store.",
      "How can molecular shape affect enzyme specificity?"
    ],
    "anatomy": [
      "Organs interact through body systems. Structure and function explain circulation, respiration, digestion and coordination.",
      "Oxygen diffuses across alveolar surfaces, then circulates bound largely to haemoglobin.",
      "A single organ cannot be understood fully without its interactions with other systems.",
      "How are respiratory and circulatory systems linked during exercise?"
    ],
    "genetics": [
      "DNA stores hereditary information and genes influence traits through biological processes. Inheritance is shaped by alleles, environment and chance.",
      "Two heterozygous parents Aa×Aa yield the model genotype ratio 1 AA : 2 Aa : 1 aa for a simple Mendelian locus.",
      "Many real traits are polygenic or influenced by environment; a Punnett square is a model, not a universal prediction.",
      "Under which assumptions does a 1:2:1 genotype ratio apply?"
    ],
    "evolution": [
      "Evolution describes changes in inherited characteristics of populations across generations. Natural selection depends on heritable variation and differential reproduction.",
      "When a heritable trait improves survival and reproduction in a given environment, its frequency may rise over generations.",
      "Individuals do not evolve genetically because they need to; populations change over generations.",
      "How do variation, inheritance and selection interact?"
    ],
    "ecology": [
      "Ecology examines organisms and their environment, including energy flow, nutrient cycles and population interactions.",
      "Grass → rabbit → fox is a simplified food chain; a real ecosystem has a network of interactions.",
      "An ecosystem cannot be described fully by one simple food chain.",
      "How could a decline in one species affect several others indirectly?"
    ],
    "microbes": [
      "Microorganisms include bacteria, microscopic eukaryotes and other microbes; viruses require host cells to replicate.",
      "Bacterial growth can be affected by nutrients and temperature, while viral replication uses host-cell machinery.",
      "Antibiotics do not treat viral infections simply by the same mechanism used against bacteria.",
      "What is a key biological difference between a bacterium and a virus?"
    ],
    "plants": [
      "Plant roots, stems and leaves support transport, growth and photosynthesis. Plants also respire and respond to their environment.",
      "A leaf uses light energy to build organic molecules from carbon dioxide and water in photosynthetic processes.",
      "Plants do not obtain most of their dry biomass by consuming soil.",
      "How does photosynthesis differ from cellular respiration?"
    ],
    "homeostasis": [
      "Homeostasis uses feedback systems to regulate conditions such as temperature and blood glucose within suitable ranges.",
      "After a rise in blood glucose, insulin-mediated processes can promote uptake and storage under normal physiological conditions.",
      "Homeostasis is dynamic regulation, not a guarantee that internal values never fluctuate.",
      "Why is negative feedback effective for maintaining a regulated variable?"
    ],
    "methods": [
      "Biological investigations require controlled variables, careful observation and statistical reasoning. Conclusions should reflect sample size and possible confounders.",
      "When comparing plant growth, hold water, light and soil conditions constant except for the chosen factor.",
      "Correlation alone does not establish a biological cause.",
      "What controls and replication would strengthen an experimental conclusion?"
    ]
  },
  "astronomy": {
    "solar": [
      "The Solar System contains the Sun, planets, moons and smaller bodies bound by gravity. Orbital models describe motion with simplifying assumptions.",
      "Earth takes roughly one year to orbit the Sun; the Moon completes an orbit around Earth in about a month.",
      "Illustrations usually exaggerate the size of planets relative to orbital distances.",
      "Why must scale be stated in a Solar System model?"
    ],
    "sky": [
      "Apparent motions of the sky result from Earth's rotation and orbital motion. Coordinates specify where an object appears to an observer.",
      "A star appears to move across the night sky as Earth rotates, even though it remains far beyond the Solar System.",
      "Apparent motion is not always the object's actual motion in space.",
      "What evidence distinguishes Earth's rotation from an apparent motion of the Sun?"
    ],
    "distances": [
      "Astronomy uses astronomical units, light-years and parsecs to describe very large distances. Light takes finite time to travel.",
      "At about 300,000 km/s, light crosses the roughly 150 million km Sun–Earth distance in about 500 seconds.",
      "A light-year is a unit of distance travelled by light, not a unit of duration.",
      "What does observing a galaxy millions of light-years away reveal about its light?"
    ],
    "gravity": [
      "Gravitational attraction and motion combine to produce orbits. Keplerian approximations describe many systems but have limits.",
      "In a nearly circular orbit, gravity provides the centripetal acceleration needed to keep a body changing direction.",
      "An orbiting body is not free from gravity; gravity helps maintain the orbit.",
      "What prevents an orbiting satellite from following a straight line?"
    ],
    "stars": [
      "Stars form from collapsing gas clouds and evolve through stages governed chiefly by mass and composition.",
      "The Sun generates energy through nuclear fusion in its core; a more massive star can have a much shorter main-sequence lifetime.",
      "Not every star ends as a black hole; the outcome depends strongly on initial mass.",
      "Why is stellar mass an important predictor of stellar evolution?"
    ],
    "galaxies": [
      "Galaxies are gravitationally bound systems of stars, gas, dust and dark matter. Their morphology and histories vary.",
      "The Milky Way is a barred spiral galaxy containing our Solar System; many galaxies interact or merge.",
      "A galaxy is not a single star cluster, and not every galaxy is spiral.",
      "What kinds of observations help estimate a galaxy's structure?"
    ],
    "observations": [
      "Astronomical observations depend on instrumentation, wavelength, exposure and uncertainty. Telescopes collect radiation rather than simply magnify scenes.",
      "Longer exposures can detect fainter sources but may require tracking to avoid image trailing.",
      "Not every telescope detects visible light; radio and X-ray observations reveal different processes.",
      "Why might two telescopes observing at different wavelengths see different structures?"
    ],
    "cosmology": [
      "Cosmology studies the large-scale structure and expansion of the universe using observations and physical models.",
      "The redshift of light from distant galaxies is evidence used to study cosmic expansion, interpreted in a model-dependent way.",
      "The Big Bang model does not describe an explosion outward from a single point into pre-existing space.",
      "Which observations support cosmic expansion, and what are the model's limits?"
    ],
    "exoplanets": [
      "Exoplanets orbit stars beyond the Sun. Transit and radial-velocity methods infer their presence from measured changes.",
      "A repeating small decrease in a star's brightness can indicate a planet crossing its disc, after alternatives are checked.",
      "A planet detection does not by itself prove habitability or the presence of life.",
      "What other explanations must be ruled out before interpreting a transit-like signal?"
    ]
  }
});
