/* SKILLS — taxonomie atomique pour la MAQUETTE simulateur de parcours pro.
   V4 — 38 skills, 8 métiers (j2, j4, j9, j10, j18, j20, j24, j27).

   Évolution :
     V3 (30) → V4 (38) : +8 skills mono-métier identitaires.
       ai     +3 : pytorch, rag, vector-databases (j4)
       data   +3 : kafka, airflow-orchestration, data-warehousing (j2)
       framework +2 : typescript, rest-api (j10)
     Raison : les skills mono-métier ne sont pas peu discriminantes,
     elles sont identitaires. Sans pytorch/rag, j4 est creux ; sans
     kafka/airflow, j2 est trop générique cloud.

   ─── Format des entrées dans JOBS_SKILLS_ATOMIC ───
     { id, level, confidence }
       level: 1 = notion, 2 = opérationnel, 3 = expert
       confidence: 'high' = explicite dans la string d'origine
                   'inferred' = déduite par contexte ou ombrelle

   ─── Distribution par catégorie (V4) ───
     language: 1 | framework: 5 | data: 5 | ai: 6
     infra: 7    | cloud: 5     | methodology: 6 | soft: 3
*/

export const SKILLS = [
  // ─── language (1) ───
  { id: 'python',                name: 'Python',                category: 'language' },

  // ─── framework (5) ───
  { id: 'react',                 name: 'React',                 category: 'framework' },
  { id: 'angular',               name: 'Angular',               category: 'framework' },
  { id: 'nodejs',                name: 'Node.js',               category: 'framework' },
  { id: 'typescript',            name: 'TypeScript',            category: 'framework' },
  { id: 'rest-api',              name: 'API REST',              category: 'framework' },

  // ─── data (5) ───
  { id: 'sql',                   name: 'SQL',                   category: 'data' },
  { id: 'spark',                 name: 'Apache Spark',          category: 'data' },
  { id: 'kafka',                 name: 'Apache Kafka',          category: 'data' },
  { id: 'airflow-orchestration', name: 'Airflow / Orchestration de pipelines', category: 'data' },
  { id: 'data-warehousing',      name: 'Data Warehousing',      category: 'data' },

  // ─── ai (6) ───
  { id: 'llm',                   name: 'LLM (concepts)',        category: 'ai' },
  { id: 'mlops',                 name: 'MLOps',                 category: 'ai' },
  { id: 'prompt-engineering',    name: 'Prompt Engineering',    category: 'ai' },
  { id: 'pytorch',               name: 'PyTorch',               category: 'ai' },
  { id: 'rag',                   name: 'RAG',                   category: 'ai' },
  { id: 'vector-databases',      name: 'Vector Databases',      category: 'ai' },

  // ─── infra (7) ───
  { id: 'linux',                 name: 'Linux',                          category: 'infra' },
  { id: 'networking',            name: 'Réseau (switching/routing/VLAN)', category: 'infra' },
  { id: 'config-management',     name: 'Config Management (Ansible/Puppet)', category: 'infra' },
  { id: 'docker',                name: 'Docker',                         category: 'infra' },
  { id: 'kubernetes',            name: 'Kubernetes',                     category: 'infra' },
  { id: 'monitoring',            name: 'Monitoring (Nagios/Zabbix/Grafana)', category: 'infra' },
  { id: 'resilience-recovery',   name: 'Backup & Disaster Recovery',     category: 'infra' },

  // ─── cloud (5) ───
  { id: 'cloud-fundamentals',    name: 'Fondamentaux Cloud',    category: 'cloud' },
  { id: 'aws',                   name: 'AWS',                   category: 'cloud' },
  { id: 'azure',                 name: 'Azure',                 category: 'cloud' },
  { id: 'gcp',                   name: 'GCP',                   category: 'cloud' },
  { id: 'cloud-architecture',    name: 'Architecture cloud',    category: 'cloud' },

  // ─── methodology (6) ───
  { id: 'automated-testing',     name: 'Tests automatisés (TDD/BDD/E2E)', category: 'methodology' },
  { id: 'app-architecture',      name: 'Architecture applicative', category: 'methodology' },
  { id: 'cicd',                  name: 'CI/CD',                 category: 'methodology' },
  { id: 'agile',                 name: 'Agile (incl. Scrum/Kanban)', category: 'methodology' },
  { id: 'scaled-agile',          name: 'SAFe / Scrum@Scale',    category: 'methodology' },
  { id: 'eng-quality-mgmt',      name: 'Métriques DORA & Dette technique', category: 'methodology' },

  // ─── soft (3) ───
  { id: 'team-leadership',       name: 'People Mgmt / Recrutement / Career Dev', category: 'soft' },
  { id: 'product-management',    name: 'Product Management',    category: 'soft' },
  { id: 'project-governance',    name: 'Pilotage projet (budget/risque/KPI)', category: 'soft' }
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map(s => [s.id, s]));

/* JOBS_SKILLS_ATOMIC — pour chaque métier du périmètre, liste des skills requises.
   Niveaux : 1 = notion | 2 = opérationnel | 3 = expert
   L'ordre suit l'ordre des hard_skills d'origine (cf. /data/jobs.js). */

export const JOBS_SKILLS_ATOMIC = {

  // j2 Data Engineer (Confirmé / Senior) — 12 atoms
  j2: [
    { id: 'python',                level: 3, confidence: 'high' },     // langage principal
    { id: 'spark',                 level: 3, confidence: 'high' },     // outil big data principal
    { id: 'kafka',                 level: 3, confidence: 'high' },     // streaming, core DE 2026
    { id: 'sql',                   level: 3, confidence: 'high' },     // fondamental
    { id: 'aws',                   level: 2, confidence: 'high' },     // multi-cloud opérationnel
    { id: 'gcp',                   level: 2, confidence: 'high' },     // idem
    { id: 'azure',                 level: 2, confidence: 'high' },     // idem
    { id: 'cloud-fundamentals',    level: 3, confidence: 'inferred' }, // ombrelle, senior DE = forte culture cloud
    { id: 'data-warehousing',      level: 3, confidence: 'high' },     // conçoit des warehouses, signature DE senior
    { id: 'docker',                level: 2, confidence: 'high' },     // packaging des pipelines
    { id: 'kubernetes',            level: 2, confidence: 'high' },     // déploie sans être archi k8s
    { id: 'airflow-orchestration', level: 3, confidence: 'high' }      // orchestration quotidienne, signature
  ],

  // j4 AI Engineer (Confirmé / Senior) — 7 atoms
  j4: [
    { id: 'python',                level: 3, confidence: 'high' },     // seul langage en production GenAI
    { id: 'pytorch',               level: 3, confidence: 'high' },     // framework ML utilisé au quotidien
    { id: 'llm',                   level: 3, confidence: 'high' },     // concept central, signature 2026
    { id: 'rag',                   level: 3, confidence: 'high' },     // pattern dominant GenAI 2026
    { id: 'vector-databases',      level: 2, confidence: 'high' },     // utilise Pinecone/Qdrant sans être DBA
    { id: 'prompt-engineering',    level: 3, confidence: 'high' },     // signature, expert attendu
    { id: 'mlops',                 level: 2, confidence: 'high' }      // opérationnel — pas tous mlops experts
  ],

  // j9 Lead Developer / Tech Lead (Confirmé / Senior) — 7 atoms
  j9: [
    { id: 'python',                level: 2, confidence: 'high' },     // un des langages backend
    { id: 'nodejs',                level: 2, confidence: 'high' },     // un des langages backend
    { id: 'react',                 level: 2, confidence: 'high' },     // connaît, pas spécialiste frontend
    { id: 'angular',               level: 2, confidence: 'high' },     // idem
    { id: 'automated-testing',     level: 3, confidence: 'high' },     // Tech Lead enforce les tests
    { id: 'app-architecture',      level: 3, confidence: 'high' },     // décisions d'architecture
    { id: 'cicd',                  level: 3, confidence: 'high' }      // owner du pipeline
  ],

  // j10 Full-Stack Senior (Senior) — 9 atoms
  j10: [
    { id: 'react',                 level: 3, confidence: 'high' },     // Senior frontend, react dominant
    { id: 'angular',               level: 2, confidence: 'high' },     // connaît, spécialisation sur 1 fw
    { id: 'nodejs',                level: 3, confidence: 'high' },     // Senior backend Node
    { id: 'rest-api',              level: 3, confidence: 'high' },     // design d'APIs au quotidien
    { id: 'docker',                level: 2, confidence: 'high' },     // dev / déploiement
    { id: 'cicd',                  level: 2, confidence: 'high' },     // utilise les pipelines
    { id: 'typescript',            level: 3, confidence: 'high' },     // standard moderne, Senior maîtrise
    { id: 'automated-testing',     level: 2, confidence: 'high' },     // écrit des tests sans être l'enforcer
    { id: 'monitoring',            level: 2, confidence: 'inferred' }  // "Performance & monitoring" — opérationnel
  ],

  // j18 Sys/Rés Senior (Senior) — 5 atoms
  j18: [
    { id: 'linux',                 level: 3, confidence: 'high' },     // core sysadmin
    { id: 'networking',            level: 3, confidence: 'high' },     // core (switching/routing/VLAN)
    { id: 'config-management',     level: 2, confidence: 'high' },     // opérationnel sur Ansible/Puppet
    { id: 'monitoring',            level: 2, confidence: 'high' },     // met en place mais pas observabilité expert
    { id: 'resilience-recovery',   level: 2, confidence: 'high' }      // backup/DR opérationnel
  ],

  // j20 Architecte Cloud (Senior) — 8 atoms
  j20: [
    { id: 'aws',                   level: 3, confidence: 'high' },     // cloud principal (architect-level)
    { id: 'azure',                 level: 2, confidence: 'high' },     // multi-cloud opérationnel
    { id: 'gcp',                   level: 2, confidence: 'high' },     // multi-cloud opérationnel
    { id: 'cloud-fundamentals',    level: 3, confidence: 'inferred' }, // architecte = culture cloud forte
    { id: 'cloud-architecture',    level: 3, confidence: 'high' },     // signature du métier
    { id: 'docker',                level: 2, confidence: 'inferred' }, // "conteneurs" — connaît sans coder Dockerfile
    { id: 'kubernetes',            level: 2, confidence: 'high' },     // patterns k8s opérationnels
    { id: 'resilience-recovery',   level: 2, confidence: 'high' }      // DR fait partie des concerns d'architecte
  ],

  // j24 Chef de Projet IT / Product Manager Technique (Confirmé / Senior) — 4 atoms
  j24: [
    { id: 'agile',                 level: 3, confidence: 'high' },     // méthodo PM principale
    { id: 'scaled-agile',          level: 2, confidence: 'high' },     // SAFe seulement dans certaines orgs
    { id: 'product-management',    level: 3, confidence: 'high' },     // PM technique = vrai PM dans le titre
    { id: 'project-governance',    level: 3, confidence: 'high' }      // pilotage budget/risque/KPI = cœur
  ],

  // j27 Engineering Manager (Senior) — 4 atoms
  j27: [
    { id: 'app-architecture',      level: 1, confidence: 'high' },     // "lecture, pas écriture" → notion
    { id: 'agile',                 level: 2, confidence: 'high' },     // process engineering, pas coach
    { id: 'eng-quality-mgmt',      level: 3, confidence: 'high' },     // signature : DORA + dette tech
    { id: 'team-leadership',       level: 3, confidence: 'high' }      // signature : 50 % people mgmt
  ]
};
