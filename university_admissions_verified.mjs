// Institution-specific undergraduate admission reference records. Do not infer requirements for other years.
// An entry with verified-historical documents PAST requirements; never claim they govern a future sitting.
export const UNIVERSITY_PROGRAM_OPTIONS=[
  {
    "id": "medicine-general",
    "domain": "medicine",
    "ro": "Medicină (program de licență)",
    "en": "Medicine (undergraduate)"
  },
  {
    "id": "medicine-graduate",
    "domain": "medicine",
    "ro": "Medicină – intrare pentru absolvenți",
    "en": "Graduate-entry medicine"
  },
  {
    "id": "dentistry",
    "domain": "dentistry",
    "ro": "Medicină dentară",
    "en": "Dentistry"
  },
  {
    "id": "pharmacy",
    "domain": "pharmacy",
    "ro": "Farmacie",
    "en": "Pharmacy"
  },
  {
    "id": "nursing",
    "domain": "health",
    "ro": "Asistență medicală generală",
    "en": "Nursing"
  },
  {
    "id": "radiology",
    "domain": "health",
    "ro": "Radiologie și imagistică",
    "en": "Radiography and imaging"
  },
  {
    "id": "nutrition",
    "domain": "health",
    "ro": "Nutriție și dietetică",
    "en": "Nutrition and dietetics"
  },
  {
    "id": "bioengineering",
    "domain": "engineering",
    "ro": "Bioinginerie",
    "en": "Bioengineering"
  },
  {
    "id": "engineering",
    "domain": "engineering",
    "ro": "Inginerie (specializare de ales la instituție)",
    "en": "Engineering (specialism chosen at institution)"
  },
  {
    "id": "computer-science",
    "domain": "computer-science",
    "ro": "Informatică",
    "en": "Computer science"
  },
  {
    "id": "software-engineering",
    "domain": "computer-science",
    "ro": "Inginerie software",
    "en": "Software engineering"
  },
  {
    "id": "law",
    "domain": "law",
    "ro": "Drept",
    "en": "Law"
  },
  {
    "id": "economics",
    "domain": "economics",
    "ro": "Economie",
    "en": "Economics"
  },
  {
    "id": "business",
    "domain": "economics",
    "ro": "Administrarea afacerilor",
    "en": "Business administration"
  },
  {
    "id": "psychology",
    "domain": "psychology",
    "ro": "Psihologie",
    "en": "Psychology"
  },
  {
    "id": "social",
    "domain": "psychology",
    "ro": "Științe sociale",
    "en": "Social sciences"
  },
  {
    "id": "architecture",
    "domain": "architecture",
    "ro": "Arhitectură",
    "en": "Architecture"
  },
  {
    "id": "design",
    "domain": "architecture",
    "ro": "Design",
    "en": "Design"
  },
  {
    "id": "arts",
    "domain": "arts",
    "ro": "Arte vizuale",
    "en": "Visual arts"
  },
  {
    "id": "music",
    "domain": "arts",
    "ro": "Muzică",
    "en": "Music"
  },
  {
    "id": "literature",
    "domain": "humanities",
    "ro": "Litere",
    "en": "Literature and languages"
  },
  {
    "id": "history",
    "domain": "humanities",
    "ro": "Istorie",
    "en": "History"
  }
];
export const UNIVERSITY_ADMISSION_ENTRIES=[
  {
    "country": "RO",
    "program": "medicine-general",
    "name": "UMF Grigore T. Popa Iași – Medicină",
    "year": 2026,
    "mode": "Concurs scris – probe obligatorii și alternative",
    "required": [
      "Anatomia și fiziologia omului"
    ],
    "optional": [
      [
        "Chimie organică",
        "Fizică"
      ]
    ],
    "subjectIds": [
      "biology",
      "chemistry",
      "physics"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "dentistry",
    "name": "UMF Grigore T. Popa Iași – Medicină Dentară",
    "year": 2026,
    "mode": "Concurs scris – probe obligatorii și alternative",
    "required": [
      "Anatomia și fiziologia omului"
    ],
    "optional": [
      [
        "Chimie organică",
        "Fizică"
      ]
    ],
    "subjectIds": [
      "biology",
      "chemistry",
      "physics"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "pharmacy",
    "name": "UMF Grigore T. Popa Iași – Farmacie",
    "year": 2026,
    "mode": "Concurs scris – probe obligatorii și alternative",
    "required": [
      "Chimie organică"
    ],
    "optional": [
      [
        "Biologie vegetală",
        "Anatomia și fiziologia omului"
      ]
    ],
    "subjectIds": [
      "chemistry",
      "biology"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "nursing",
    "name": "UMF Grigore T. Popa Iași – Asistență Medicală Generală",
    "year": 2026,
    "mode": "Concurs – alternativă între discipline",
    "required": [],
    "optional": [
      [
        "Anatomia și fiziologia omului",
        "Chimie organică"
      ]
    ],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "radiology",
    "name": "UMF Grigore T. Popa Iași – Radiologie și imagistică",
    "year": 2026,
    "mode": "Concurs – alternativă între discipline",
    "required": [],
    "optional": [
      [
        "Anatomia și fiziologia omului",
        "Chimie organică"
      ]
    ],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "nutrition",
    "name": "UMF Grigore T. Popa Iași – Nutriție și dietetică",
    "year": 2026,
    "mode": "Concurs – alternativă între discipline",
    "required": [],
    "optional": [
      [
        "Anatomia și fiziologia omului",
        "Chimie organică"
      ]
    ],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "bioengineering",
    "name": "UMF Grigore T. Popa Iași – Bioinginerie",
    "year": 2026,
    "mode": "Concurs – alternativă între discipline",
    "required": [],
    "optional": [
      [
        "Matematică",
        "Anatomia și fiziologia omului"
      ]
    ],
    "subjectIds": [
      "math",
      "biology"
    ],
    "source": "https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "medicine-general",
    "name": "UMF Iuliu Hațieganu Cluj-Napoca – Medicină",
    "year": 2026,
    "mode": "Probă scrisă unică: Biologie și Chimie",
    "required": [
      "Biologie",
      "Chimie"
    ],
    "optional": [],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://umfcluj.ro/programe-studii/admitere-licenta/admitere-iulie-2026/",
    "status": "verified-historical"
  },
  {
    "country": "RO",
    "program": "dentistry",
    "name": "UMF Iuliu Hațieganu Cluj-Napoca – Medicină dentară",
    "year": 2026,
    "mode": "Probă scrisă unică: Biologie și Chimie",
    "required": [
      "Biologie",
      "Chimie"
    ],
    "optional": [],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://umfcluj.ro/programe-studii/admitere-licenta/admitere-iulie-2026/",
    "status": "verified-historical"
  },
  {
    "country": "GB-ENG",
    "program": "medicine-general",
    "name": "University of Oxford – Medicine BM BCh (A100)",
    "year": 2027,
    "mode": "A-levels + UCAT + proces de selecție; nu concurs scris de tip românesc",
    "required": [
      "A-level Chemistry",
      "Un A-level din Biology / Physics / Mathematics",
      "UCAT"
    ],
    "optional": [],
    "subjectIds": [
      "chemistry",
      "biology",
      "physics",
      "math"
    ],
    "source": "https://www.medschools.ac.uk/courses/oxford-medicine-a100/",
    "status": "verified-2027"
  },
  {
    "country": "GB-ENG",
    "program": "medicine-general",
    "name": "Imperial College London – Medicine MBBS (A100)",
    "year": 2027,
    "mode": "A-levels + UCAT + selecție universitară; verifică sesiunea",
    "required": [
      "Biology A-level",
      "Chemistry A-level",
      "UCAT"
    ],
    "optional": [],
    "subjectIds": [
      "biology",
      "chemistry"
    ],
    "source": "https://www.imperial.ac.uk/study/courses/undergraduate/medicine/",
    "status": "reference-current"
  },
  {
    "country": "GB-ENG",
    "program": "medicine-general",
    "name": "Anglia – catalog Medical Schools Council (mai multe universități)",
    "year": 2027,
    "mode": "Catalog oficial de cerințe universitare; probele depind de fiecare instituție",
    "required": [],
    "optional": [],
    "subjectIds": [
      "biology",
      "chemistry",
      "physics"
    ],
    "source": "https://www.medschools.ac.uk/for-students/applying-to-medical-school/entry-requirements/",
    "status": "directory"
  }
];
export function universityProgramsForDomain(domain){return UNIVERSITY_PROGRAM_OPTIONS.filter(p=>p.domain===domain)}
export function universityAdmissionsFor(country,program){return UNIVERSITY_ADMISSION_ENTRIES.filter(r=>r.country===country&&r.program===program)}
export function universityEntryIsCurrent(record,year){return record&&record.year===year&&(record.status==='verified-2027'||record.status==='reference-current')}
