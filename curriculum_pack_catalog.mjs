// Authoritative builder & registry for decoupled country-year curriculum packs.
// Packs built here are served from ./public/packs/ via /api/curriculum-pack
// (Cloudflare Workers Static Assets) with 0 KB added to the Worker JS bundle.

import { CURRICULUM_PACK_SCHEMA, curriculumPackKey } from './curriculum_pack_protocol.mjs';
import { EDUCATION_SCHOOL_STAGES, educationCountrySchoolYears } from './education_all_country_subject_matrix.mjs';
import { mathCountryStudyYears, mathCountryGradeAreas } from './math_country_grade_areas.mjs';
import { HUNGARY_MATH_GRADES, hungaryMathOriginalLessons } from './math_hungary_full_track_2026.mjs';
import { hungaryGrade5Lessons } from './math_hungary_grade5_2026.mjs';
import { spainMathOriginalEntries } from './math_spain_lomloe_2026.mjs';
import { italyMathFocalLessons } from './math_italy_framework_2026.mjs';
import { portugalMath2026Lessons } from './math_portugal_2026.mjs';

function fnv1aHash(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return (hash >>> 0).toString(36);
}

function buildMathCountryPacks() {
  const packs = [];

  // 1. Hungary (HU) — Grades 1..13 + BSc 1..3 + MSc 1..2
  for (const stage of EDUCATION_SCHOOL_STAGES) {
    const baseYears = educationCountrySchoolYears('HU', stage).years;
    const years = mathCountryStudyYears({ country: 'HU', stage, years: baseYears });
    for (const year of years) {
      const grade = String(year.id);
      const profile = mathCountryGradeAreas({ country: 'HU', stage, grade, years });
      const lessonsByTopic = {};
      let count = 0;
      for (const unit of profile.units) {
        const items = grade === '5'
          ? hungaryGrade5Lessons(unit.id)
          : hungaryMathOriginalLessons({ grade, topic: unit.id });
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
          country: 'HU',
          stage,
          grade,
          status: profile.status,
          source: profile.source,
          manualExample: profile.manualExample || null,
          textbooks: profile.manualExample ? [{
            id: 'oh-mat05ta',
            labelRo: 'Referință Oktatási Hivatal · OH-MAT05TA (NAT 2020)',
            labelEn: 'Oktatási Hivatal reference · OH-MAT05TA (NAT 2020)',
            url: profile.manualExample
          }] : [],
          lessonsByTopic
        });
      }
    }
  }

  // 2. Spain (ES) — LOMLOE Primaria, ESO (incl. 4º A/B), Bachillerato (CT/CS)
  for (const stage of EDUCATION_SCHOOL_STAGES) {
    const baseYears = educationCountrySchoolYears('ES', stage).years;
    const years = mathCountryStudyYears({ country: 'ES', stage, years: baseYears });
    for (const year of years) {
      const grade = String(year.id);
      const profile = mathCountryGradeAreas({ country: 'ES', stage, grade, years });
      const lessonsByTopic = {};
      let count = 0;
      for (const unit of profile.units) {
        const items = spainMathOriginalEntries({ grade, topic: unit.id });
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
          country: 'ES',
          stage,
          grade,
          status: profile.status,
          source: profile.source,
          manualExample: profile.manualExample || null,
          textbooks: [],
          lessonsByTopic
        });
      }
    }
  }

  // 3. Italy (IT) — Primaria (P1..P5), Secondaria I grado (M1..M3), II grado (S1..S5)
  for (const stage of EDUCATION_SCHOOL_STAGES) {
    const baseYears = educationCountrySchoolYears('IT', stage).years;
    const years = mathCountryStudyYears({ country: 'IT', stage, years: baseYears });
    for (const year of years) {
      const grade = String(year.id);
      const profile = mathCountryGradeAreas({ country: 'IT', stage, grade, years });
      const lessonsByTopic = {};
      let count = 0;
      for (const unit of profile.units) {
        const items = italyMathFocalLessons({ grade, topic: unit.id });
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
          country: 'IT',
          stage,
          grade,
          status: profile.status,
          source: profile.source,
          manualExample: profile.manualExample || null,
          textbooks: [],
          lessonsByTopic
        });
      }
    }
  }

  // 4. Portugal (PT) — 2.º Ciclo (5.º / 6.º ano Aprendizagens Essenciais)
  {
    const stage = 'lower';
    const baseYears = educationCountrySchoolYears('PT', stage).years;
    const years = mathCountryStudyYears({ country: 'PT', stage, years: baseYears });
    for (const year of years) {
      const grade = String(year.id);
      const profile = mathCountryGradeAreas({ country: 'PT', stage, grade, years });
      const lessonsByTopic = {};
      let count = 0;
      for (const unit of profile.units) {
        const items = portugalMath2026Lessons({ grade, topic: unit.id });
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
          country: 'PT',
          stage,
          grade,
          status: profile.status,
          source: profile.source,
          manualExample: profile.manualExample || null,
          textbooks: [],
          lessonsByTopic
        });
      }
    }
  }

  return packs;
}

export const ALL_DECOUPLED_CURRICULUM_PACKS = Object.freeze(buildMathCountryPacks());

export const CURRICULUM_REMOTE_PACK_KEYS = Object.freeze(
  ALL_DECOUPLED_CURRICULUM_PACKS.map(p => curriculumPackKey(p.subject, p.country, p.grade))
);

export const CURRICULUM_PACK_BUNDLE_VERSION = fnv1aHash(
  JSON.stringify(ALL_DECOUPLED_CURRICULUM_PACKS)
);

// Lightweight grade->stage/phase lookup (~600 bytes) needed synchronously by mathCountryCourseEntries
export const HUNGARY_CLIENT_GRADE_META = Object.freeze(
  Object.fromEntries(
    Object.entries(HUNGARY_MATH_GRADES).map(([grade, entry]) => [
      grade,
      { stage: entry.stage, phase: entry.phase }
    ])
  )
);
