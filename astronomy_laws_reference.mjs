// Content lives only in the independently published single-source pack.
import pack from './public/education/science/shared-v2/astronomy.json' with {type:'json'};
// General Astronomy & Astrophysics reference: accessible directly from the year selector.
// Independent of any national school curriculum; includes laws, observational relations and IAU constants.
export const ASTRONOMY_LAWS_GROUPS = Object.freeze([
  { id: 'celestial', ro: 'Mecanică cerească și gravitație', en: 'Celestial mechanics and gravity' },
  { id: 'radiation', ro: 'Radiație și fotometrie', en: 'Radiation and photometry' },
  { id: 'distances', ro: 'Distanțe și astrometrie', en: 'Distances and astrometry' },
  { id: 'spectroscopy', ro: 'Spectre și astrofizică stelară', en: 'Spectra and stellar astrophysics' },
  { id: 'cosmology', ro: 'Galaxii și cosmologie', en: 'Galaxies and cosmology' },
  { id: 'constants', ro: 'Constante și unități IAU', en: 'IAU constants and units' }
]);

export const ASTRONOMY_LAWS=Object.freeze(pack.references);
