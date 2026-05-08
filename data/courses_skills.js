/* COURSES_SKILLS — mapping cours → skills atomiques enseignées.
   Maquette simulateur de parcours pro · périmètre 27 cours / 8 métiers / 38 skills.

   Format :
     COURSE_SKILLS[courseId] = {
       skills_taught: [
         { id, target_level, confidence }, ...
       ]
     }
       target_level : niveau atteint EN SORTIE du module (1=notion, 2=opérationnel, 3=expert)
       confidence   : 'high' = explicite dans le titre / 'inferred' = déduite du contexte

   Règles :
     - 2 à 5 skills max par cours (au-delà = fourre-tout)
     - L3 rare en M1 (cours intro), plus fréquent en M2
     - Une skill peut apparaître dans plusieurs cours à des niveaux différents
       → l'algo prendra le niveau max disponible

   Cours hors périmètre (non mappés) :
     M1PENT, M1APPW, M1BLUR, M1SECUA, M1SPRO, M2PENT (cyber spécifiques,
     non référencés par les 8 métiers du simulateur).

   Skills sans cours qui les enseigne (gaps connus du curriculum vis-à-vis du périmètre) :
     gcp, azure (cloud providers spécifiques)
     angular (le curriculum ne forme pas spécifiquement Angular)
   → ces skills apparaîtront en `uncoveredSkills` côté algo de sélection.
*/

export const COURSE_SKILLS = {

  // ─── M1 — Tronc commun ───
  // Architecture Réseaux (Cloud) & Modèle OSI · 3j · pose les bases réseau + culture cloud
  M1ARCH: {
    skills_taught: [
      { id: 'networking',         target_level: 1, confidence: 'high' },
      { id: 'cloud-fundamentals', target_level: 1, confidence: 'high' },
      { id: 'cloud-architecture', target_level: 1, confidence: 'inferred' }
    ]
  },

  // Intro Cybersécurité, E-Réputation & Incidents · 5j · sensibilisation cyber, pas de skill V4 directe
  M1INTR: {
    skills_taught: [
      { id: 'linux',      target_level: 1, confidence: 'inferred' },  // admin Linux pour cyber
      { id: 'networking', target_level: 1, confidence: 'inferred' }   // sécu réseau
    ]
  },

  // Qualité de Service IT, KPI & Normes · 5j · pratiques de mesure et pilotage qualité
  M1QUAL: {
    skills_taught: [
      { id: 'monitoring',         target_level: 1, confidence: 'high' },     // SLA, monitoring
      { id: 'automated-testing',  target_level: 1, confidence: 'inferred' }, // qualité = tests
      { id: 'eng-quality-mgmt',   target_level: 1, confidence: 'inferred' }, // KPI = mesure qualité eng
      { id: 'project-governance', target_level: 1, confidence: 'inferred' }  // KPI = pilotage
    ]
  },

  // Modélisation BPMN & Software Patterns · 5j · introduit l'architecture applicative
  M1MODE: {
    skills_taught: [
      { id: 'app-architecture', target_level: 2, confidence: 'high' },
      { id: 'agile',            target_level: 1, confidence: 'inferred' }    // BPMN dans contexte agile
    ]
  },

  // Gestion de projet + Soft Skills Leadership · 5j · fondations management
  M1GESTI: {
    skills_taught: [
      { id: 'project-governance', target_level: 1, confidence: 'high' },
      { id: 'team-leadership',    target_level: 1, confidence: 'high' },
      { id: 'agile',              target_level: 1, confidence: 'inferred' }
    ]
  },

  // Projet Startup Agile & DevOps · 5j · projet web full-stack moderne
  M1PROJ: {
    skills_taught: [
      { id: 'agile',      target_level: 2, confidence: 'high' },
      { id: 'nodejs',     target_level: 1, confidence: 'inferred' },  // stack startup
      { id: 'react',      target_level: 1, confidence: 'inferred' },  // frontend moderne
      { id: 'typescript', target_level: 1, confidence: 'inferred' },  // standard 2026
      { id: 'rest-api',   target_level: 1, confidence: 'inferred' }   // tout projet web
    ]
  },

  // Piscine DevOps & Container · 5j · cours pratique central DevOps/conteneurs
  M1PISC: {
    skills_taught: [
      { id: 'docker',     target_level: 2, confidence: 'high' },
      { id: 'kubernetes', target_level: 2, confidence: 'high' },      // Container moderne = K8s
      { id: 'linux',      target_level: 2, confidence: 'inferred' },  // DevOps sur Linux
      { id: 'cicd',       target_level: 2, confidence: 'high' }
    ]
  },

  // ─── M1 — Spécialité IA / Data ───
  // Python ML Pandas/Numpy · 5j · entrée en programmation data
  M1PYML: {
    skills_taught: [
      { id: 'python',  target_level: 2, confidence: 'high' },
      { id: 'pytorch', target_level: 1, confidence: 'inferred' }      // intro frameworks ML modernes
    ]
  },

  // Intro BigData + Soft Skills DataScience · 5j · sensibilisation data
  M1DASC: {
    skills_taught: [
      { id: 'spark',            target_level: 1, confidence: 'high' },     // BigData → Spark
      { id: 'python',           target_level: 1, confidence: 'inferred' }, // langage data
      { id: 'data-warehousing', target_level: 1, confidence: 'inferred' }  // notion stockage
    ]
  },

  // Python Spark + Projet IA · 5j · met en pratique Spark et un projet ML
  M1SPAR: {
    skills_taught: [
      { id: 'python',  target_level: 2, confidence: 'high' },
      { id: 'spark',   target_level: 2, confidence: 'high' },
      { id: 'pytorch', target_level: 1, confidence: 'inferred' }      // Projet IA → framework DL
    ]
  },

  // MLOps & NLP · 5j · industrialisation ML + intro langage
  M1MLOP: {
    skills_taught: [
      { id: 'mlops',   target_level: 2, confidence: 'high' },
      { id: 'llm',     target_level: 1, confidence: 'inferred' },     // NLP en 2026 = LLM
      { id: 'pytorch', target_level: 1, confidence: 'inferred' }      // framework MLOps standard
    ]
  },

  // Big Data Distribué Kafka · 5j · streaming et orchestration distribuée
  M1DISTR: {
    skills_taught: [
      { id: 'kafka',                 target_level: 2, confidence: 'high' },
      { id: 'spark',                 target_level: 2, confidence: 'inferred' },  // distribué = Spark
      { id: 'airflow-orchestration', target_level: 1, confidence: 'inferred' }
    ]
  },

  // Soft Skills + Projet Innovation · 5j · culture innovation/produit
  M1INNO: {
    skills_taught: [
      { id: 'product-management', target_level: 1, confidence: 'inferred' },  // projet d'innovation
      { id: 'team-leadership',    target_level: 1, confidence: 'inferred' }
    ]
  },

  // ─── M1 — Spécialité Cyber (1 seul cours dans le périmètre) ───
  // Sécu Réseau & Crypto · 5j · uniquement utilisé par j18
  M1CRYP: {
    skills_taught: [
      { id: 'networking', target_level: 1, confidence: 'inferred' },  // sécu réseau touche networking
      { id: 'linux',      target_level: 1, confidence: 'inferred' }   // crypto en CLI Linux
    ]
  },

  // ─── M2 — Tronc commun ───
  // Veille Technologique et RGPD · 5j · culture conformité + veille
  M2VEILL: {
    skills_taught: [
      { id: 'project-governance', target_level: 2, confidence: 'inferred' },  // RGPD = gouvernance
      { id: 'product-management', target_level: 1, confidence: 'inferred' }   // veille = vision produit
    ]
  },

  // Gestion de Projet et Management d'Équipe · 5j · approfondit M1GESTI
  M2GESTP: {
    skills_taught: [
      { id: 'project-governance', target_level: 2, confidence: 'high' },
      { id: 'team-leadership',    target_level: 2, confidence: 'high' },
      { id: 'agile',              target_level: 1, confidence: 'inferred' },
      { id: 'scaled-agile',       target_level: 1, confidence: 'inferred' }   // M2 = orgs plus grandes
    ]
  },

  // Appel d'offres et urbanisation SI · 5j · achats IT et architecture d'entreprise
  M2OFFR: {
    skills_taught: [
      { id: 'product-management', target_level: 2, confidence: 'inferred' },  // AO = définir besoin
      { id: 'project-governance', target_level: 2, confidence: 'inferred' },
      { id: 'app-architecture',   target_level: 1, confidence: 'inferred' }   // urbanisation = archi
    ]
  },

  // Industrialisation SI et Haute Disponibilité · 5j · ops modernes
  M2INDU: {
    skills_taught: [
      { id: 'resilience-recovery', target_level: 2, confidence: 'high' },     // HA explicite
      { id: 'cicd',                target_level: 2, confidence: 'inferred' }, // industrialisation
      { id: 'monitoring',          target_level: 2, confidence: 'inferred' },
      { id: 'kubernetes',          target_level: 1, confidence: 'inferred' },
      { id: 'config-management',   target_level: 2, confidence: 'inferred' }  // automation infra
    ]
  },

  // PCA, PRA et Green IT · 5j · cœur disaster-recovery
  M2PCAG: {
    skills_taught: [
      { id: 'resilience-recovery', target_level: 3, confidence: 'high' },     // PCA/PRA = backup/DR expert
      { id: 'monitoring',          target_level: 1, confidence: 'inferred' }  // Green IT = mesure conso
    ]
  },

  // Web3 et Blockchain · 5j · niche, mappe peu sur le V4
  M2WEB3: {
    skills_taught: [
      { id: 'nodejs',     target_level: 1, confidence: 'inferred' },  // smart contracts en JS souvent
      { id: 'typescript', target_level: 1, confidence: 'inferred' }
    ]
  },

  // ─── M2 — Spécialité IA / Data ───
  // Gouvernance des données et Architecture Cloud · 5j · pivot data + cloud
  M2GOUVD: {
    skills_taught: [
      { id: 'data-warehousing',   target_level: 2, confidence: 'high' },
      { id: 'cloud-architecture', target_level: 2, confidence: 'high' },
      { id: 'cloud-fundamentals', target_level: 2, confidence: 'inferred' },
      { id: 'sql',                target_level: 2, confidence: 'inferred' },  // gouvernance = SQL
      { id: 'aws',                target_level: 1, confidence: 'inferred' }   // exemple cloud usuel
    ]
  },

  // Streaming Apache Storm & Data Engineering · 5j · DE avancé
  M2STREA: {
    skills_taught: [
      { id: 'kafka',                 target_level: 3, confidence: 'high' },
      { id: 'spark',                 target_level: 3, confidence: 'inferred' },  // DE avancé
      { id: 'airflow-orchestration', target_level: 2, confidence: 'inferred' }
    ]
  },

  // Éthique et SoftSkills (Data Science Business) · 5j · réflexion + soft skills DS
  M2ETHI: {
    skills_taught: [
      { id: 'llm',                target_level: 1, confidence: 'inferred' },  // éthique IA 2026 = LLM
      { id: 'product-management', target_level: 1, confidence: 'inferred' },  // DS Business
      { id: 'team-leadership',    target_level: 1, confidence: 'inferred' }
    ]
  },

  // Intelligence Artificielle et ML Avancés · 5j · LE cours GenAI/ML expert
  M2IAAV: {
    skills_taught: [
      { id: 'llm',                target_level: 3, confidence: 'high' },
      { id: 'pytorch',            target_level: 3, confidence: 'high' },
      { id: 'rag',                target_level: 2, confidence: 'inferred' },
      { id: 'vector-databases',   target_level: 2, confidence: 'inferred' },
      { id: 'prompt-engineering', target_level: 2, confidence: 'inferred' }
    ]
  },

  // ─── M2 — Spécialité Cyber (utilisé par j18 et j20) ───
  // Python Scripting Sécurité et Sécurité Cloud · 5j · scripting cyber + cloud security
  M2PYTS: {
    skills_taught: [
      { id: 'python', target_level: 2, confidence: 'high' },
      { id: 'aws',    target_level: 1, confidence: 'inferred' }       // sécu cloud = AWS souvent
    ]
  },

  // Sécurité IoT et Mobile · 5j · seul utilisé par j18
  M2SECM: {
    skills_taught: [
      { id: 'networking', target_level: 1, confidence: 'inferred' },  // IoT = networking
      { id: 'linux',      target_level: 1, confidence: 'inferred' }   // IoT = embedded Linux
    ]
  },

  // Gouvernance et Sécurité des Infrastructures · 5j · pour j20
  M2GOUVI: {
    skills_taught: [
      { id: 'cloud-architecture',  target_level: 1, confidence: 'inferred' },  // gouvernance archi
      { id: 'resilience-recovery', target_level: 1, confidence: 'inferred' },  // gouvernance infra
      { id: 'monitoring',          target_level: 1, confidence: 'inferred' }
    ]
  }

};

export const COURSE_IDS_IN_PERIMETER = Object.keys(COURSE_SKILLS);
