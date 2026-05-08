/* Cours M1 + M2 — tronc commun et spécialisations IA/Data (t1) et CyberSécu (t2). */

export const COURSES = [
  // M1 Tronc commun (U1)
  { id: 'M1PISC',  name: 'Piscine DevOps & Container',                       year: 'M1', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M1INTR',  name: 'Intro Cybersécurité, E-Réputation & Incidents',    year: 'M1', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M1ARCH',  name: 'Architecture Réseaux (Cloud) & Modèle OSI',        year: 'M1', unit: 'U1', spec: 'common', days: 3 },
  { id: 'M1QUAL',  name: 'Qualité de Service IT, KPI & Normes',              year: 'M1', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M1MODE',  name: 'Modélisation BPMN & Software Patterns',            year: 'M1', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M1GESTI', name: 'Gestion de projet + Soft Skills Leadership',       year: 'M1', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M1PROJ',  name: 'Projet Startup Agile & DevOps',                    year: 'M1', unit: 'U1', spec: 'common', days: 5 },

  // M1 Spé IA/Data (U2+U3)
  { id: 'M1PYML',  name: 'Python ML Pandas/Numpy',                           year: 'M1', unit: 'U2', spec: 't1', days: 5 },
  { id: 'M1DASC',  name: 'Intro BigData + Soft Skills DataScience',          year: 'M1', unit: 'U2', spec: 't1', days: 5 },
  { id: 'M1SPAR',  name: 'Python Spark + Projet IA',                         year: 'M1', unit: 'U2', spec: 't1', days: 5 },
  { id: 'M1MLOP',  name: 'MLOps & NLP',                                      year: 'M1', unit: 'U3', spec: 't1', days: 5 },
  { id: 'M1DISTR', name: 'Big Data Distribué Kafka',                         year: 'M1', unit: 'U3', spec: 't1', days: 5 },
  { id: 'M1INNO',  name: 'Soft Skills + Projet Innovation',                  year: 'M1', unit: 'U3', spec: 't1', days: 5 },

  // M1 Spé Cyber (U2+U3)
  { id: 'M1CRYP',  name: 'Sécu Réseau & Crypto',                             year: 'M1', unit: 'U2', spec: 't2', days: 5 },
  { id: 'M1PENT',  name: 'Vulnérabilités & Pentest',                         year: 'M1', unit: 'U2', spec: 't2', days: 5 },
  { id: 'M1APPW',  name: 'Sécurité Apps Web + Soft Skills Équipe Cyber',     year: 'M1', unit: 'U2', spec: 't2', days: 5 },
  { id: 'M1BLUR',  name: 'Blue/Red Team + Nmap',                             year: 'M1', unit: 'U3', spec: 't2', days: 5 },
  { id: 'M1SECUA', name: 'Sécu Web Avancée & Audit',                         year: 'M1', unit: 'U3', spec: 't2', days: 5 },
  { id: 'M1SPRO',  name: 'Projet + Soft Skills',                             year: 'M1', unit: 'U3', spec: 't2', days: 5 },

  // M2 U1 — Tronc commun (6 semaines, 5j)
  { id: 'M2VEILL', name: 'Veille Technologique et RGPD',                     year: 'M2', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M2GESTP', name: "Gestion de Projet et Management d'Équipe",         year: 'M2', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M2OFFR',  name: "Appel d'offres et urbanisation SI",                year: 'M2', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M2INDU',  name: 'Industrialisation SI et Haute Disponibilité',      year: 'M2', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M2PCAG',  name: 'PCA, PRA et Green IT',                             year: 'M2', unit: 'U1', spec: 'common', days: 5 },
  { id: 'M2WEB3',  name: 'Web3 et Blockchain — Technologies Décentralisées', year: 'M2', unit: 'U1', spec: 'common', days: 5 },

  // M2 U2 — IA/Data
  { id: 'M2GOUVD', name: 'Gouvernance des données et Architecture Cloud',    year: 'M2', unit: 'U2', spec: 't1', days: 5 },
  { id: 'M2STREA', name: 'Streaming Apache Storm & Data Engineering',        year: 'M2', unit: 'U2', spec: 't1', days: 5 },

  // M2 U2 — CyberSécu
  { id: 'M2PYTS',  name: 'Python Scripting Sécurité et Sécurité Cloud',      year: 'M2', unit: 'U2', spec: 't2', days: 5 },
  { id: 'M2SECM',  name: 'Sécurité IoT et Mobile',                           year: 'M2', unit: 'U2', spec: 't2', days: 5 },

  // M2 U3 — IA/Data
  { id: 'M2ETHI',  name: 'Éthique et SoftSkills (Data Science Business)',    year: 'M2', unit: 'U3', spec: 't1', days: 5 },
  { id: 'M2IAAV',  name: 'Intelligence Artificielle et ML Avancés',          year: 'M2', unit: 'U3', spec: 't1', days: 5 },

  // M2 U3 — CyberSécu
  { id: 'M2PENT',  name: 'Pentesting Avancé',                                year: 'M2', unit: 'U3', spec: 't2', days: 5 },
  { id: 'M2GOUVI', name: 'Gouvernance et Sécurité des Infrastructures',      year: 'M2', unit: 'U3', spec: 't2', days: 5 }
];

export const COURSE_BY_ID = Object.fromEntries(COURSES.map(c => [c.id, c]));
