// Machine-readable Sciences (`physics`, `chemistry`, `biology`, `astronomy`)
// curriculum & decoupled-pack readiness audit across all 50 European countries.
// Preserves the strict honesty contract: technical/general-coverage readiness
// never claims official state-accredited whole-year textbook equivalence (`fullyApproved === 0`).

import { EDUCATION_EUROPE_COUNTRIES } from './education_all_country_subject_matrix.mjs';
import { PHYSICS_EUROPE_REFERENCES } from './physics_europe_frameworks.mjs';
import { CHEMISTRY_EUROPE_REFERENCES } from './chemistry_country_alignment.mjs';
import { BIOLOGY_COUNTRY_REFERENCES } from './biology_country_alignment.mjs';
import { ASTRONOMY_COUNTRY_EVIDENCE } from './astronomy_country_alignment.mjs';
import { PHYSICS_LAWS } from './physics_laws_reference.mjs';
import { CHEMISTRY_LAWS } from './chemistry_laws_reference.mjs';
import { BIOLOGY_REFERENCE } from './biology_reference.mjs';
import { ASTRONOMY_LAWS } from './astronomy_laws_reference.mjs';
import { SCIENCE_CORE_SUBJECTS } from './science_textbook_correlation_2026.mjs';
import { SCIENCE_DECOUPLED_CURRICULUM_PACKS } from './science_europe_packs_2026.mjs';

export function scienceCurriculumReadiness() {
  const bySubject = {};
  for (const subject of SCIENCE_CORE_SUBJECTS) {
    const subjectPacks = SCIENCE_DECOUPLED_CURRICULUM_PACKS.filter(p => p.subject === subject);
    const schoolPacks = subjectPacks.filter(p => p.stage !== 'advanced');
    const universityPacks = subjectPacks.filter(p => p.stage === 'advanced');
    const countriesWithPacks = new Set(subjectPacks.map(p => p.country));
    const frameworkMap = subject === 'physics'
      ? PHYSICS_EUROPE_REFERENCES
      : subject === 'chemistry'
        ? CHEMISTRY_EUROPE_REFERENCES
        : subject === 'biology'
          ? BIOLOGY_COUNTRY_REFERENCES
          : ASTRONOMY_COUNTRY_EVIDENCE;
    const frameworkCountries = EDUCATION_EUROPE_COUNTRIES.filter(c => Boolean(frameworkMap[c]));
    const lawsCount = subject === 'physics'
      ? PHYSICS_LAWS.length
      : subject === 'chemistry'
        ? CHEMISTRY_LAWS.length
        : subject === 'biology'
          ? BIOLOGY_REFERENCE.length
          : ASTRONOMY_LAWS.length;
    const lessonCount = subjectPacks.reduce(
      (sum, p) => sum + Object.values(p.lessonsByTopic).reduce((a, list) => a + list.length, 0),
      0
    );
    bySubject[subject] = {
      subject,
      countries: countriesWithPacks.size,
      frameworkCountries: frameworkCountries.length,
      totalPacks: subjectPacks.length,
      schoolPacks: schoolPacks.length,
      universityPacks: universityPacks.length,
      correlatedSchoolPacks: schoolPacks.filter(p => Array.isArray(p.textbooks) && p.textbooks.length >= 1 && p.manualExample).length,
      packLessons: lessonCount,
      lawsAndPrinciples: lawsCount,
      fullyApproved: 0
    };
  }

  const rows = SCIENCE_DECOUPLED_CURRICULUM_PACKS.map(p => ({
    subject: p.subject,
    country: p.country,
    stage: p.stage,
    grade: p.grade,
    displayGrade: p.displayGrade,
    status: p.status,
    source: p.source,
    hasTextbookCorrelation: Array.isArray(p.textbooks) && p.textbooks.length >= 1,
    topicCount: Object.keys(p.lessonsByTopic || {}).length,
    pedagogicalStatus: 'general-coverage-original-pack'
  }));

  return {
    countries: EDUCATION_EUROPE_COUNTRIES.length,
    subjects: SCIENCE_CORE_SUBJECTS,
    totalPacks: SCIENCE_DECOUPLED_CURRICULUM_PACKS.length,
    schoolPacks: SCIENCE_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage !== 'advanced').length,
    universityPacks: SCIENCE_DECOUPLED_CURRICULUM_PACKS.filter(p => p.stage === 'advanced').length,
    fullyApproved: 0,
    bySubject,
    rows
  };
}
