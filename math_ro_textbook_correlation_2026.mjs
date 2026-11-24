// Authoritative Romanian school Mathematics textbook reference correlation (2026/27).
// Covers Clasa I – Clasa a XII-a (excluding track-specific 9-SCI handled in
// math_ro9_science_2026.mjs; university years stay at ARACIS / Bologna standards
// without a single mandatory textbook).
//
// COPYRIGHT & HONESTY POLICY:
// - Stores ONLY bibliographic / ministerial approval metadata (title, authors,
//   publisher, approval order, national syllabus order, official URL).
// - Contains ZERO copied text, exercises, figures, or prose from any textbook.
// - Referencing an approved textbook does NOT claim exhaustive chapter-by-chapter
//   pedagogical certification (mathCurriculumReadiness stays at 0 fullyApproved).

import { RO_FULL_MATH_SOURCES } from './math_romania_full_2026.mjs';

export const RO_TEXTBOOK_CORRELATION_2026 = Object.freeze({
  '1': Object.freeze({
    id: 'ro-tb-math-1-edp-2018',
    country: 'RO',
    stage: 'beginner',
    grade: '1',
    title: 'Matematică și explorarea mediului — Manual pentru clasa I',
    authors: 'Tudora Pițilă, Cleopatra Mihăilescu',
    publisher: 'Editura Didactică și Pedagogică (E.D.P.)',
    approvalOrder: 'OMEN nr. 3970/15.06.2018',
    syllabus: 'OMEN nr. 3418/19.03.2013',
    syllabusUrl: RO_FULL_MATH_SOURCES.primary12,
    url: 'https://www.edituradp.ro/',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '2': Object.freeze({
    id: 'ro-tb-math-2-edp-2018',
    country: 'RO',
    stage: 'beginner',
    grade: '2',
    title: 'Matematică și explorarea mediului — Manual pentru clasa a II-a',
    authors: 'Cleopatra Mihăilescu, Tudora Pițilă',
    publisher: 'Editura Didactică și Pedagogică (E.D.P.)',
    approvalOrder: 'OMEN nr. 3970/15.06.2018',
    syllabus: 'OMEN nr. 3418/19.03.2013',
    syllabusUrl: RO_FULL_MATH_SOURCES.primary12,
    url: 'https://www.edituradp.ro/',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '3': Object.freeze({
    id: 'ro-tb-math-3-edp-2021',
    country: 'RO',
    stage: 'beginner',
    grade: '3',
    title: 'Matematică — Manual pentru clasa a III-a',
    authors: 'Tudora Pițilă, Cleopatra Mihăilescu, Camelia Coman',
    publisher: 'Editura Didactică și Pedagogică (E.D.P.)',
    approvalOrder: 'OME nr. 5348/06.10.2021',
    syllabus: 'OMEN nr. 5003/02.12.2014',
    syllabusUrl: RO_FULL_MATH_SOURCES.primary34,
    url: 'https://www.edituradp.ro/carte/matematica-caietul-elevului-pentru-clasa-a-iii-a--i1459',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '4': Object.freeze({
    id: 'ro-tb-math-4-edp-2021',
    country: 'RO',
    stage: 'beginner',
    grade: '4',
    title: 'Matematică — Manual pentru clasa a IV-a',
    authors: 'Cleopatra Mihăilescu, Tudora Pițilă, Camelia Coman',
    publisher: 'Editura Didactică și Pedagogică (E.D.P.)',
    approvalOrder: 'OME nr. 5348/06.10.2021',
    syllabus: 'OMEN nr. 5003/02.12.2014',
    syllabusUrl: RO_FULL_MATH_SOURCES.primary34,
    url: 'https://manuale.edu.ro/manuale/Clasa%20a%20IV-a/Matematica/RURJVFVSQSBESURBQ1RJ/files/basic-html/page1.html',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '5': Object.freeze({
    id: 'ro-tb-math-5-artklett-2022',
    country: 'RO',
    stage: 'lower',
    grade: '5',
    title: 'Matematică — Manual pentru clasa a V-a',
    authors: 'Marius Perianu, Ștefan Smărăndoiu, Cătălin Stănică',
    publisher: 'Art Klett',
    approvalOrder: 'OM nr. 5293/2017; reeditare OME nr. 4065/16.06.2022',
    syllabus: 'OMEN nr. 3393/28.02.2017',
    syllabusUrl: 'https://www.edu.ro/Ordin_ministru_3393_2017',
    url: 'https://catalog.manualedigitaleart.ro/art-matematica-5-2022/v1/',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '6': Object.freeze({
    id: 'ro-tb-math-6-paralela45-2023',
    country: 'RO',
    stage: 'lower',
    grade: '6',
    title: 'Matematică — Manual pentru clasa a VI-a',
    authors: 'Maria Zaharia',
    publisher: 'Editura Paralela 45',
    approvalOrder: 'OME nr. 5022/06.07.2023',
    syllabus: 'OMEN nr. 3393/28.02.2017',
    syllabusUrl: 'https://www.edu.ro/Ordin_ministru_3393_2017',
    url: 'https://www.libraronline.ro/carte/matematica-manual-pentru-clasa-a-vi-a-ordin-de-ministru-nr-5022-06-07-2023-maria-zaharia--i72840',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '7': Object.freeze({
    id: 'ro-tb-math-7-artklett-2024',
    country: 'RO',
    stage: 'lower',
    grade: '7',
    title: 'Matematică — Manual pentru clasa a VII-a',
    authors: 'Marius Perianu, Dana Heuberger, Ștefan Smărăndoiu, Cătălin Stănică, Ioan Balica',
    publisher: 'Art Klett',
    approvalOrder: 'OME nr. 5420/2024',
    syllabus: 'OMEN nr. 3393/28.02.2017',
    syllabusUrl: 'https://www.edu.ro/Ordin_ministru_3393_2017',
    url: 'https://manualedigitaleart.ro/',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '8': Object.freeze({
    id: 'ro-tb-math-8-artklett-2025',
    country: 'RO',
    stage: 'lower',
    grade: '8',
    title: 'Matematică — Manual pentru clasa a VIII-a',
    authors: 'Marius Perianu, Dana Heuberger, Ștefan Smărăndoiu, Gabriel Popa, Cătălin Stănică',
    publisher: 'Art Klett',
    approvalOrder: 'OMEC nr. 6400/22.09.2025',
    syllabus: 'OMEN nr. 3393/28.02.2017',
    syllabusUrl: 'https://www.edu.ro/Ordin_ministru_3393_2017',
    url: 'https://manualedigitaleart.ro/biblioteca/art-matematica-8-2025',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '9': Object.freeze({
    id: 'ro-tb-math-9-intuitext-2026',
    country: 'RO',
    stage: 'medium',
    grade: '9',
    title: 'Matematică — Manual pentru clasa a IX-a (TC+CS, matematică-informatică)',
    authors: 'Gabriel Ciupală, Dan Dumitrescu, Cătălin Gherghe',
    publisher: 'Editura Intuitext',
    approvalOrder: 'OMEC nr. 5779/09.10.2026 (locul 1 licitația MEC 2026)',
    syllabus: 'OMEC nr. 6930/19.12.2025',
    syllabusUrl: RO_FULL_MATH_SOURCES.lycee9_2026,
    url: 'https://www.intuitext.ro/matematica-real-manual-pentru-clasa-a-ix-a-2026',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '10': Object.freeze({
    id: 'ro-tb-math-10-carminis-cnee',
    country: 'RO',
    stage: 'medium',
    grade: '10',
    title: 'Matematică — Manual pentru clasa a X-a (TC+CD, M1/M2)',
    authors: 'Marius Burtea, Georgeta Burtea',
    publisher: 'Editura Carminis',
    approvalOrder: 'Catalog CNEE manuale aprobate în uz (OMEdC nr. 3787/05.04.2005)',
    syllabus: 'OMECI nr. 5099/2009 & OMEC nr. 4598/2004',
    syllabusUrl: RO_FULL_MATH_SOURCES.lycee10_12,
    url: 'https://www.carminis.ro/nvmntul-liceal-c18',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '11': Object.freeze({
    id: 'ro-tb-math-11-carminis-cnee',
    country: 'RO',
    stage: 'medium',
    grade: '11',
    title: 'Matematică M1 — Manual pentru clasa a XI-a (TC+CD)',
    authors: 'Marius Burtea, Georgeta Burtea',
    publisher: 'Editura Carminis',
    approvalOrder: 'Catalog CNEE manuale aprobate în uz (OMEdC nr. 4446/19.06.2006)',
    syllabus: 'OMECI nr. 5099/2009 & OMEdC nr. 3252/13.02.2006',
    syllabusUrl: RO_FULL_MATH_SOURCES.lycee10_12,
    url: 'https://manuale.edu.ro/manuale/Clasa%20a%20XI-a/Matematica/Carminis/A196.pdf',
    portalUrl: 'https://manuale.edu.ro/'
  }),
  '12': Object.freeze({
    id: 'ro-tb-math-12-carminis-cnee',
    country: 'RO',
    stage: 'medium',
    grade: '12',
    title: 'Matematică M1 — Manual pentru clasa a XII-a (TC+CD)',
    authors: 'Marius Burtea, Georgeta Burtea',
    publisher: 'Editura Carminis',
    approvalOrder: 'Catalog CNEE manuale aprobate în uz (OMECT nr. 1342/18.06.2007)',
    syllabus: 'OMECI nr. 5099/2009 & OMEdC nr. 5959/22.12.2006',
    syllabusUrl: RO_FULL_MATH_SOURCES.lycee10_12,
    url: 'https://manuale.edu.ro/manuale/Clasa%20a%20XII-a/Matematica/Carminis1/A197.pdf',
    portalUrl: 'https://manuale.edu.ro/'
  })
});

export function roMathTextbookEntry(grade) {
  const g = String(grade || '').trim();
  if (!g || g === '9-SCI') return null;
  return RO_TEXTBOOK_CORRELATION_2026[g] || null;
}

export function roMathManualExample(stage, grade) {
  if (stage === 'advanced') return null;
  const entry = roMathTextbookEntry(grade);
  return entry ? entry.url : null;
}

export function roMathPackTextbooks(stage, grade) {
  if (stage === 'advanced') {
    return [{
      id: `ro-univ-bologna-${grade}`,
      labelRo: `Standarde ARACIS / Bologna · Licență Matematică Anul ${grade}`,
      labelEn: `ARACIS / Bologna reference · Mathematics BSc Year ${grade}`,
      url: RO_FULL_MATH_SOURCES.universityBologna
    }];
  }
  const entry = roMathTextbookEntry(grade);
  if (!entry) return [];
  return [{
    id: entry.id,
    title: entry.title,
    authors: entry.authors,
    publisher: entry.publisher,
    approvalOrder: entry.approvalOrder,
    syllabus: entry.syllabus,
    labelRo: `${entry.title} · ${entry.authors} (${entry.publisher}, ${entry.approvalOrder})`,
    labelEn: `${entry.title} · ${entry.authors} (${entry.publisher}, ${entry.approvalOrder})`,
    url: entry.url
  }];
}
