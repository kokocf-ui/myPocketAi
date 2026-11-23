// Authoritative builder & registry for decoupled country-year curriculum packs.
// Packs built here are served from ./public/packs/ via /api/curriculum-pack
// (Cloudflare Workers Static Assets) with 0 KB added to the Worker JS bundle.

import { CURRICULUM_PACK_SCHEMA, canonicalPackGrade, curriculumPackKey } from './curriculum_pack_protocol.mjs';
import { EDUCATION_SCHOOL_STAGES, educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { HUNGARY_MATH_GRADES, hungaryMathOriginalLessons } from './math_hungary_full_track_2026.mjs';
import { hungaryGrade5Lessons } from './math_hungary_grade5_2026.mjs';
import { spainMathOriginalEntries } from './math_spain_lomloe_2026.mjs';
import { italyMathFocalLessons } from './math_italy_framework_2026.mjs';
import { portugalMath2026Lessons } from './math_portugal_2026.mjs';
import { RO_FULL_MATH_SOURCES, romaniaMathGapLessons } from './math_romania_full_2026.mjs';

function fnv1aHash(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return (hash >>> 0).toString(36);
}

function buildCountryStagePacks(country, stages, lessonResolver, textbooksForGrade = () => []) {
  const packs = [];
  for (const stage of stages) {
    const baseYears = educationCountrySchoolYears(country, stage).years;
    const years = mathCountryStudyYears({ country, stage, years: baseYears });
    for (const year of years) {
      const rawGrade = String(year.id);
      const packGrade = canonicalPackGrade(rawGrade, stage);
      const profile = mathCountryGradeAreas({ country, stage, grade: rawGrade, years });
      const lessonsByTopic = {};
      let count = 0;
      for (const unit of profile.units) {
        const items = lessonResolver({ stage, grade: rawGrade, topic: unit.id });
        if (items.length) {
          lessonsByTopic[unit.id] = items;
          count += items.length;
        }
      }
      if (count > 0) {
        packs.push({
          schema: CURRICULUM_PACK_SCHEMA,
          schoolYear: '2026/27',
          subject: 'mathematics',
          country,
          stage,
          grade: packGrade,
          displayGrade: rawGrade,
          status: profile.status,
          source: profile.source || null,
          manualExample: profile.manualExample || null,
          textbooks: textbooksForGrade(stage, rawGrade, profile),
          lessonsByTopic
        });
      }
    }
  }
  return packs;
}

function buildMathCountryPacks() {
  return [
    // 1. Romania (RO) — Primary I–IV, Lycée IX/X/XI/XII, University BSc 1–3
    ...buildCountryStagePacks(
      'RO',
      ['beginner', 'medium', 'advanced'],
      ({ stage, grade, topic }) => romaniaMathGapLessons({ stage, grade, topic }),
      (stage, grade) => {
        if (stage === 'beginner') {
          return [{
            id: `ro-manuale-primar-${grade}`,
            labelRo: `Manuale aprobate MEN (manuale.edu.ro) · Clasa a ${grade}-a`,
            labelEn: `MEN approved textbooks (manuale.edu.ro) · Grade ${grade}`,
            url: RO_FULL_MATH_SOURCES.manualsPortal
          }];
        }
        if (stage === 'medium' && grade !== '9-SCI') {
          return [{
            id: `ro-manuale-liceu-${grade}`,
            labelRo: `Programa liceală România & manuale de referință · Clasa a ${grade}-a`,
            labelEn: `Romanian upper-secondary syllabus & reference textbooks · Grade ${grade}`,
            url: grade === '9' ? RO_FULL_MATH_SOURCES.lycee9_2026 : RO_FULL_MATH_SOURCES.lycee10_12
          }];
        }
        if (stage === 'advanced') {
          return [{
            id: `ro-univ-bologna-${grade}`,
            labelRo: `Standarde ARACIS / Bologna · Licență Matematică Anul ${grade}`,
            labelEn: `ARACIS / Bologna reference · Mathematics BSc Year ${grade}`,
            url: RO_FULL_MATH_SOURCES.universityBologna
          }];
        }
        return [];
      }
    ),

    // 2. Hungary (HU) — Grades 1..13 + BSc 1..3 + MSc 1..2
    ...buildCountryStagePacks(
      'HU',
      EDUCATION_SCHOOL_STAGES,
      ({ grade, topic }) => (grade === '5' ? hungaryGrade5Lessons(topic) : hungaryMathOriginalLessons({ grade, topic })),
      (_stage, _grade, profile) => (profile.manualExample ? [{
        id: 'oh-mat05ta',
        labelRo: 'Referință Oktatási Hivatal · OH-MAT05TA (NAT 2020)',
        labelEn: 'Oktatási Hivatal reference · OH-MAT05TA (NAT 2020)',
        url: profile.manualExample
      }] : [])
    ),

    // 3. Spain (ES) — LOMLOE Primaria, ESO, Bachillerato
    ...buildCountryStagePacks(
      'ES',
      EDUCATION_SCHOOL_STAGES,
      ({ grade, topic }) => spainMathOriginalEntries({ grade, topic })
    ),

    // 4. Italy (IT) — Primaria, Secondaria I & II grado
    ...buildCountryStagePacks(
      'IT',
      EDUCATION_SCHOOL_STAGES,
      ({ grade, topic }) => italyMathFocalLessons({ grade, topic })
    ),

    // 5. Portugal (PT) — 2.º Ciclo (5.º & 6.º ano)
    ...buildCountryStagePacks(
      'PT',
      ['lower'],
      ({ grade, topic }) => portugalMath2026Lessons({ grade, topic })
    )
  ];
}

export const ALL_DECOUPLED_CURRICULUM_PACKS = Object.freeze(buildMathCountryPacks());

export const CURRICULUM_REMOTE_PACK_KEYS = Object.freeze(
  ALL_DECOUPLED_CURRICULUM_PACKS.map(p => curriculumPackKey(p.subject, p.country, p.grade))
);

export const CURRICULUM_PACK_BUNDLE_VERSION = fnv1aHash(
  JSON.stringify(ALL_DECOUPLED_CURRICULUM_PACKS)
);

export const HUNGARY_CLIENT_GRADE_META = Object.freeze(
  Object.fromEntries(
    Object.entries(HUNGARY_MATH_GRADES).map(([grade, entry]) => [
      grade,
      { stage: entry.stage, phase: entry.phase }
    ])
  )
);
