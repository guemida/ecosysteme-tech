import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import {
  Database, Brain, Code, Shield, Network, Cloud, Users,
  Sparkles, LayoutGrid, User, BookOpen, GitCompare, Award,
  ChevronLeft, ChevronRight, Search, Presentation, Eye, X,
  Briefcase, TrendingUp, Star, Target, Zap,
  Euro, BadgeCheck, Globe, Rocket, GraduationCap,
  Flame, AlertTriangle, CheckCircle2, Laptop, Trophy, BookOpenCheck,
  Crown, Lightbulb, Scale, Gauge, ArrowRight,
  Compass, Cpu, Leaf, Atom, Anchor
} from 'lucide-react';

/* ============================================================
   CONSTANTS — Theme, Titles, Families
   ============================================================ */

const C = {
  bg: '#0A0E1F',
  bgDeep: '#050814',
  bgElev: '#121734',
  fg: '#F8FAFC',
  fgDim: '#CBD5E1',
  muted: '#8890B0',
  border: '#1E2750',
  t1: '#3B82F6',
  t2: '#F97316',
  trans: '#8B5CF6',
  success: '#10B981',
  warn: '#F59E0B',
  danger: '#EF4444',
  pink: '#FF2891',
  cyan: '#00D4FF'
};

const TITLES = [
  { id: 't1', code: 'RNCP38822', niveau: 7, rome: 'M1805', color: C.t1,
    name: 'Expert en Architecture et Développement Logiciel',
    short: 'IA / Data' },
  { id: 't2', code: 'RNCP38823', niveau: 7, rome: 'M1801 · M1802 · M1810', color: C.t2,
    name: 'Expert en Architectures Systèmes, Réseaux et Sécurité',
    short: 'CyberSecu' }
];

const FAMILIES = {
  data:       { label: 'Data',            color: '#3B82F6', icon: Database },
  ia:         { label: 'IA / ML',         color: '#8B5CF6', icon: Brain },
  dev:        { label: 'Développement',   color: '#06B6D4', icon: Code },
  sec:        { label: 'Cybersécurité',   color: '#F97316', icon: Shield },
  reseau:     { label: 'Réseaux',         color: '#EF4444', icon: Network },
  cloud:      { label: 'Cloud',           color: '#10B981', icon: Cloud },
  management: { label: 'Management IT',   color: '#EC4899', icon: Users }
};

const TENSION = {
  penurie:   { label: 'Pénurie',    color: C.danger,  bg: 'rgba(239,68,68,0.18)', icon: Flame },
  tendu:     { label: 'Tendu',      color: C.warn,    bg: 'rgba(245,158,11,0.18)', icon: AlertTriangle },
  equilibre: { label: 'Équilibré',  color: C.success, bg: 'rgba(16,185,129,0.18)', icon: CheckCircle2 }
};

/* ============================================================
   SOFT SKILLS
   ============================================================ */

const SOFTSKILLS = [
  { id: 'SS01', name: 'Leadership technique',      courseId: 'M1GESTI', desc: "Animer une équipe tech, arbitrer, décider" },
  { id: 'SS02', name: 'Storytelling Data',         courseId: 'M1DASC',  desc: "Vulgariser des insights data auprès de décideurs" },
  { id: 'SS03', name: 'Esprit équipe Cyber',       courseId: 'M1APPW',  desc: "Coordination Blue/Red Team, gestion de crise" },
  { id: 'SS04', name: 'Innovation & pitch',        courseId: 'M1INNO',  desc: "Défendre un projet devant un jury" },
  { id: 'SS05', name: 'Réflexion stratégique',     courseId: 'M2GESTP', desc: "Vision business + tech, leadership de projet" },
  { id: 'SS06', name: 'Éthique professionnelle',   courseId: 'M2ETHI',  desc: "Décisions IA/cyber responsables" },
  { id: 'SS07', name: 'Intelligence économique',   courseId: 'M2VEILL', desc: "Veille concurrentielle, RGPD, influence" },
  { id: 'SS08', name: 'Communication exécutive',   courseId: 'M2GESTP', desc: "Convaincre un comité de direction" },
  { id: 'SS09', name: 'Conformité et droit',       courseId: 'M2VEILL', desc: "RGPD, contrats, responsabilité juridique" },
  { id: 'SS10', name: 'Gestion de projet Agile',   courseId: 'M1PROJ',  desc: "Scrum, sprints, backlog, rétrospectives" },
  { id: 'SS11', name: 'Prise de parole',           courseId: 'M1SPRO',  desc: "Pitch, improvisation, présentation" },
  { id: 'SS12', name: 'Data Storytelling avancé',  courseId: 'M2GOUVD', desc: "Visualisation décisionnelle, gouvernance data" }
];

/* ============================================================
   COURSES — M1 + M2
   ============================================================ */

const COURSES = [
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

/* ============================================================
   EUROPE COUNTRIES — simplified geographic layout
   ============================================================ */

const EU_COUNTRIES = {
  FR: { name: 'France',      flag: '🇫🇷', x: 380, y: 330 },
  DE: { name: 'Allemagne',   flag: '🇩🇪', x: 490, y: 270 },
  BE: { name: 'Belgique',    flag: '🇧🇪', x: 410, y: 275 },
  NL: { name: 'Pays-Bas',    flag: '🇳🇱', x: 445, y: 235 },
  LU: { name: 'Luxembourg',  flag: '🇱🇺', x: 450, y: 300 },
  CH: { name: 'Suisse',      flag: '🇨🇭', x: 475, y: 340 },
  AT: { name: 'Autriche',    flag: '🇦🇹', x: 555, y: 335 },
  IT: { name: 'Italie',      flag: '🇮🇹', x: 520, y: 410 },
  ES: { name: 'Espagne',     flag: '🇪🇸', x: 300, y: 430 },
  PT: { name: 'Portugal',    flag: '🇵🇹', x: 230, y: 440 },
  SE: { name: 'Suède',       flag: '🇸🇪', x: 555, y: 135 },
  DK: { name: 'Danemark',    flag: '🇩🇰', x: 495, y: 180 },
  FI: { name: 'Finlande',    flag: '🇫🇮', x: 640, y: 115 },
  NO: { name: 'Norvège',     flag: '🇳🇴', x: 490, y: 100 },
  GB: { name: 'Royaume-Uni', flag: '🇬🇧', x: 320, y: 215 },
  IE: { name: 'Irlande',     flag: '🇮🇪', x: 240, y: 225 }
};

/* ============================================================
   JOBS — 27 métiers
   helpers:
     sal(j,c,s) = salary triplet
     mob(arr)   = mobility top_countries
     c(country, flag, salary, lang, ease)
   ============================================================ */

const sal = (j, c, s) => ({ junior: j, confirmed: c, senior: s });
const mob = (list) => list;
const m  = (code, flag, salary, lang, ease='vert') => ({ country: code, flag, salary_median: salary, work_lang: lang, ease });

const JOBS = [
/* ============== TITRE 1 — Dev / IA / Data ============== */
{
  id: 'j1', name: 'Data Scientist', short: 'Data Scientist',
  synonyms_fr: ['Scientifique des données'],
  synonyms_en: ['Data Scientist'],
  family: 'data', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1403',
  description: "Le Data Scientist conçoit des modèles statistiques et de machine learning pour extraire de la valeur des données massives. Il transforme des jeux de données complexes en insights actionnables pour la stratégie d'entreprise.",
  courseIds_m1: ['M1PYML','M1DASC','M1SPAR','M1MLOP','M1DISTR'],
  courseIds_m2: ['M2GOUVD','M2STREA','M2IAAV','M2ETHI'],
  recommended_project: "Projet de recherche ML appliqué au business (mémoire M2)",
  hard_skills: ['Python (Pandas, Scikit-learn)','Machine Learning supervisé / non-supervisé','Deep Learning (PyTorch / TensorFlow)','SQL avancé','Statistiques & probabilités','Data Visualization (Matplotlib, Seaborn)','Feature Engineering','MLOps & déploiement de modèles'],
  softskillIds: ['SS02','SS05','SS08','SS06','SS12'],
  certifications: ['Databricks Certified Data Scientist','AWS Certified Machine Learning','Google Professional ML Engineer','IBM Data Science Professional'],
  salary: sal(40,55,75),
  sectors: ['Startup IA','Grand compte','Banque/Assurance','ESN','Santé'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',70,'EN / DE'), m('NL','🇳🇱',72,'EN'), m('CH','🇨🇭',110,'EN / FR')]),
  evolution: 'Lead Data Scientist → Head of Data → Chief Data Officer → AI Director',
  passerelles: ['j4','j5','j7']
},
{
  id: 'j2', name: 'Data Engineer', short: 'Data Engineer',
  synonyms_fr: ['Ingénieur de données'],
  synonyms_en: ['Data Engineer'],
  family: 'data', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "Le Data Engineer conçoit, construit et maintient les pipelines de données et l'infrastructure qui permettent aux Data Scientists et analystes de travailler. Il garantit la qualité, la fiabilité et la scalabilité des flux de données.",
  courseIds_m1: ['M1PYML','M1SPAR','M1DISTR','M1PISC','M1ARCH'],
  courseIds_m2: ['M2STREA','M2GOUVD','M2GESTP','M2INDU'],
  recommended_project: "Pipeline ETL temps réel avec Kafka + Spark (projet M1)",
  hard_skills: ['Python / Scala','Apache Spark & Kafka','SQL / NoSQL avancé','ETL / ELT pipelines','Cloud Data (AWS / GCP / Azure)','Data Warehousing (Snowflake, BigQuery)','Docker & Kubernetes','Airflow / orchestration'],
  softskillIds: ['SS01','SS10','SS05','SS08'],
  certifications: ['Databricks Data Engineer Associate','AWS Data Analytics Specialty','Google Professional Data Engineer','Snowflake SnowPro Core'],
  salary: sal(42,55,72),
  sectors: ['Grand compte','Startup Data','Banque/Assurance','ESN','E-commerce'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',70,'EN'), m('DE','🇩🇪',68,'EN / DE'), m('CH','🇨🇭',105,'EN / FR')]),
  evolution: 'Lead Data Engineer → Architecte Data → Head of Data Platform → CTO Data',
  passerelles: ['j1','j5','j21']
},
{
  id: 'j3', name: 'ML Engineer / MLOps Engineer', short: 'ML Engineer',
  synonyms_fr: ['Ingénieur Machine Learning'],
  synonyms_en: ['ML Engineer','MLOps Engineer'],
  family: 'ia', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "Le ML Engineer met en production les modèles de Machine Learning. Il industrialise le cycle de vie des modèles (entraînement, déploiement, monitoring) et construit les pipelines ML automatisés à grande échelle.",
  courseIds_m1: ['M1PYML','M1SPAR','M1MLOP','M1PISC','M1DISTR'],
  courseIds_m2: ['M2IAAV','M2STREA','M2GOUVD','M2ETHI'],
  recommended_project: "Pipeline MLOps complet : training → déploiement → monitoring (projet M2)",
  hard_skills: ['Python (PyTorch, TensorFlow)','MLOps (MLflow, Kubeflow)','Docker & Kubernetes','CI/CD pour ML','Cloud ML (SageMaker, Vertex AI)','Feature Stores','Model Monitoring','API REST / gRPC'],
  softskillIds: ['SS01','SS10','SS04','SS05'],
  certifications: ['Google Professional ML Engineer','AWS Machine Learning Specialty','Databricks ML Professional','Kubernetes CKAD'],
  salary: sal(43,58,78),
  sectors: ['Startup IA','Grand compte','FinTech','ESN','Industrie 4.0'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',75,'EN'), m('NL','🇳🇱',73,'EN'), m('CH','🇨🇭',115,'EN')]),
  evolution: 'Lead ML Engineer → Staff ML Engineer → Head of ML → VP Engineering AI',
  passerelles: ['j1','j4','j21']
},
{
  id: 'j4', name: 'AI Engineer (GenAI, NLP, LLM)', short: 'AI Engineer',
  synonyms_fr: ['Ingénieur IA','Ingénieur Intelligence Artificielle'],
  synonyms_en: ['AI Engineer','GenAI Engineer'],
  family: 'ia', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "L'AI Engineer conçoit et déploie des solutions d'intelligence artificielle, notamment en IA générative (LLM, NLP, vision). Il maîtrise les architectures Transformer et les techniques de fine-tuning, RAG et prompt engineering.",
  courseIds_m1: ['M1PYML','M1MLOP','M1SPAR','M1DASC'],
  courseIds_m2: ['M2IAAV','M2GOUVD','M2ETHI','M2VEILL'],
  recommended_project: "Application GenAI avec RAG et fine-tuning LLM (projet M2)",
  hard_skills: ['Python (PyTorch, HuggingFace)','LLM & Transformers','RAG & Vector Databases','Prompt Engineering','NLP avancé','Fine-tuning & RLHF','API OpenAI / Anthropic / Mistral','MLOps pour GenAI'],
  softskillIds: ['SS06','SS04','SS05','SS02','SS08'],
  certifications: ['Google Professional ML Engineer','DeepLearning.AI Specialization','AWS AI Practitioner','Databricks GenAI Engineer'],
  salary: sal(45,62,85),
  sectors: ['Startup IA','Grand compte','FinTech','Conseil','Santé/Pharma'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',80,'EN'), m('NL','🇳🇱',78,'EN'), m('CH','🇨🇭',120,'EN')]),
  evolution: 'Lead AI Engineer → AI Architect → Head of AI → Chief AI Officer',
  passerelles: ['j1','j3','j7']
},
{
  id: 'j5', name: 'Architecte Big Data', short: 'Arch. Big Data',
  synonyms_fr: ['Architecte de données massives'],
  synonyms_en: ['Big Data Architect'],
  family: 'data', titleIds: ['t1'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "L'Architecte Big Data définit l'architecture technique des plateformes de données massives. Il choisit les technologies, conçoit les flux de données et garantit la scalabilité et la performance du SI décisionnel.",
  courseIds_m1: ['M1SPAR','M1DISTR','M1ARCH','M1PYML','M1PISC'],
  courseIds_m2: ['M2GOUVD','M2STREA','M2INDU','M2GOUVI'],
  recommended_project: "Architecture data lake sur cloud (AWS / GCP) avec gouvernance (mémoire M2)",
  hard_skills: ['Architecture Data Lake / Lakehouse','Hadoop / Spark / Kafka','Cloud Data Platforms','Data Governance','SQL / NoSQL à grande échelle','Streaming temps réel','Sécurité des données','Modélisation dimensionnelle'],
  softskillIds: ['SS05','SS08','SS01','SS07'],
  certifications: ['AWS Data Analytics Specialty','Google Professional Data Engineer','Cloudera Data Platform','Databricks Data Engineer Professional'],
  salary: sal(48,62,85),
  sectors: ['Grand compte','Banque/Assurance','Télécom','ESN','Industrie'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',80,'EN'), m('DE','🇩🇪',78,'EN / DE'), m('CH','🇨🇭',120,'EN / FR')]),
  evolution: 'Chief Data Architect → VP Data → CTO → Directeur Data',
  passerelles: ['j2','j1','j20']
},
{
  id: 'j6', name: 'Lead Data Analyst', short: 'Lead Data Analyst',
  synonyms_fr: ['Analyste de données senior'],
  synonyms_en: ['Lead Data Analyst','Senior BI Analyst'],
  family: 'data', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1403',
  description: "Le Lead Data Analyst pilote l'analyse décisionnelle de l'entreprise. Il structure les KPI, crée les dashboards stratégiques et accompagne les métiers dans l'interprétation des données pour orienter les décisions business.",
  courseIds_m1: ['M1PYML','M1DASC','M1QUAL','M1MODE'],
  courseIds_m2: ['M2GOUVD','M2ETHI','M2VEILL'],
  recommended_project: "Dashboard décisionnel Power BI / Tanagra pour un cas métier réel (projet M2)",
  hard_skills: ['SQL avancé','Python (Pandas, Matplotlib)','Power BI / Tableau / Tanagra','Statistiques descriptives & inférentielles','Data Modeling','KPI & métriques business','Excel avancé (Power Query)','Data Quality Management'],
  softskillIds: ['SS02','SS12','SS05','SS08','SS07'],
  certifications: ['Microsoft PL-300 (Power BI)','Google Data Analytics','Tableau Desktop Specialist','PCAP (Python)'],
  salary: sal(36,48,62),
  sectors: ['Grand compte','Banque/Assurance','E-commerce','ESN','Conseil'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('BE','🇧🇪',55,'FR / EN'), m('LU','🇱🇺',65,'FR / EN'), m('NL','🇳🇱',58,'EN')]),
  evolution: 'Head of Analytics → Data Manager → Chief Data Officer → Consultant BI Senior',
  passerelles: ['j1','j7','j24']
},
{
  id: 'j7', name: 'Consultant IA / AI Strategy Manager', short: 'Consultant IA',
  synonyms_fr: ['Consultant Intelligence Artificielle'],
  synonyms_en: ['AI Consultant','AI Strategy Manager'],
  family: 'ia', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "Le Consultant IA accompagne les organisations dans leur stratégie d'adoption de l'intelligence artificielle. Il identifie les cas d'usage à forte valeur, cadre les projets IA et fait le pont entre les équipes techniques et la direction.",
  courseIds_m1: ['M1DASC','M1PYML','M1GESTI','M1INNO'],
  courseIds_m2: ['M2IAAV','M2ETHI','M2VEILL','M2OFFR'],
  recommended_project: "Étude de cas : stratégie IA pour un secteur vertical (mémoire M2)",
  hard_skills: ['Cadrage de projets IA','Connaissance des architectures ML / DL','ROI & Business Case IA','Data Strategy',"Éthique de l'IA",'Gestion de la conduite du changement','Veille technologique IA','Frameworks de maturité IA'],
  softskillIds: ['SS05','SS08','SS07','SS04','SS06'],
  certifications: ['Google Professional ML Engineer','AWS AI Practitioner','Certification IAPP (privacy)','PMP / Prince2'],
  salary: sal(42,58,80),
  sectors: ['Cabinet de conseil','ESN','Grand compte','Startup','Secteur public'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('CH','🇨🇭',110,'FR / EN'), m('BE','🇧🇪',65,'FR / EN'), m('LU','🇱🇺',75,'FR / EN')]),
  evolution: 'Director AI Strategy → Partner (cabinet conseil) → Chief AI Officer → VP Innovation',
  passerelles: ['j4','j1','j23']
},
{
  id: 'j8', name: 'Architecte Logiciel', short: 'Arch. Logiciel',
  synonyms_fr: ['Architecte applicatif'],
  synonyms_en: ['Software Architect'],
  family: 'dev', titleIds: ['t1'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "L'Architecte Logiciel conçoit l'architecture technique des applications complexes. Il définit les patterns, les technologies et les standards de développement pour garantir qualité, maintenabilité et scalabilité du code.",
  courseIds_m1: ['M1MODE','M1PISC','M1ARCH','M1QUAL','M1PROJ'],
  courseIds_m2: ['M2INDU','M2OFFR','M2WEB3','M2VEILL'],
  recommended_project: "Architecture microservices avec documentation ADR (mémoire M2)",
  hard_skills: ['Design Patterns (GoF, SOLID)','Architecture microservices','API Design (REST, GraphQL, gRPC)','Cloud Architecture (AWS / Azure / GCP)','CI/CD & DevOps','Modélisation UML / C4','Performance & scalabilité','Sécurité applicative'],
  softskillIds: ['SS01','SS05','SS08','SS10','SS04'],
  certifications: ['AWS Solutions Architect Professional','TOGAF 9','Kubernetes CKA','Azure Solutions Architect Expert'],
  salary: sal(48,62,82),
  sectors: ['Grand compte','ESN','Éditeur logiciel','FinTech','Startup'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',78,'EN / DE'), m('NL','🇳🇱',75,'EN'), m('CH','🇨🇭',115,'EN / FR')]),
  evolution: 'Principal Architect → VP Engineering → CTO → Distinguished Engineer',
  passerelles: ['j9','j10','j20']
},
{
  id: 'j9', name: 'Lead Developer / Tech Lead', short: 'Tech Lead',
  synonyms_fr: ['Développeur principal','Responsable technique'],
  synonyms_en: ['Tech Lead','Lead Developer'],
  family: 'dev', titleIds: ['t1'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "Le Tech Lead est le référent technique d'une équipe de développement. Il code, revoit le code des autres, prend les décisions d'architecture au quotidien et mentore les développeurs juniors. C'est le pont entre le code et le management.",
  courseIds_m1: ['M1MODE','M1PISC','M1PROJ','M1GESTI','M1QUAL'],
  courseIds_m2: ['M2GESTP','M2INDU','M2VEILL'],
  recommended_project: "Lead technique d'un projet full-stack en équipe (projet M1)",
  hard_skills: ['Langages backend (Java, Python, Node.js)','Frontend (React, Angular, Vue)','Code Review & best practices','Git workflow avancé','Tests (TDD, BDD, E2E)','Architecture applicative','CI/CD','Mentoring technique'],
  softskillIds: ['SS01','SS10','SS04','SS11'],
  certifications: ['AWS Developer Associate','Scrum Master PSM I','Kubernetes CKAD','Oracle Java SE'],
  salary: sal(45,58,72),
  sectors: ['Startup','ESN','Éditeur logiciel','Grand compte','FinTech'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',70,'EN / DE'), m('NL','🇳🇱',68,'EN'), m('ES','🇪🇸',50,'EN / ES')]),
  evolution: 'Engineering Manager → Staff Engineer → VP Engineering → CTO',
  passerelles: ['j8','j10','j27']
},
{
  id: 'j10', name: 'Ingénieur Full-Stack Senior', short: 'Full-Stack Senior',
  synonyms_fr: ['Développeur Full-Stack senior'],
  synonyms_en: ['Senior Full-Stack Engineer'],
  family: 'dev', titleIds: ['t1'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "L'Ingénieur Full-Stack Senior maîtrise l'ensemble de la chaîne technique, du frontend au backend en passant par les bases de données et le déploiement. Il intervient sur toute l'architecture d'une application web moderne.",
  courseIds_m1: ['M1PISC','M1MODE','M1PROJ','M1ARCH','M1QUAL'],
  courseIds_m2: ['M2INDU','M2GESTP','M2WEB3'],
  recommended_project: "Application web complète (React + API + BDD + Docker) en autonomie",
  hard_skills: ['React / Vue / Angular','Node.js / Django / Spring Boot','PostgreSQL / MongoDB','API REST & GraphQL','Docker & CI/CD','TypeScript','Tests automatisés','Performance & monitoring'],
  softskillIds: ['SS10','SS01','SS04','SS11'],
  certifications: ['AWS Developer Associate','Meta Front-End Developer','MongoDB Associate Developer','PCAP Python'],
  salary: sal(40,52,68),
  sectors: ['Startup','ESN','Éditeur logiciel','Grand compte','E-commerce'],
  market_tension: 'tendu', remote: 'Full remote',
  mobility: mob([m('DE','🇩🇪',65,'EN'), m('ES','🇪🇸',45,'EN / ES'), m('PT','🇵🇹',38,'EN')]),
  evolution: 'Tech Lead → Architecte Logiciel → CTO Startup → Engineering Manager',
  passerelles: ['j9','j8','j26']
},

/* ============== TITRE 2 — Sys / Rés / Sécu ============== */
{
  id: 'j11', name: 'Pentester Senior / Red Team Lead', short: 'Pentester',
  synonyms_fr: ["Testeur d'intrusion senior"],
  synonyms_en: ['Senior Pentester','Red Team Lead'],
  family: 'sec', titleIds: ['t2'], seniority: 'Senior',
  code_rome: 'M1802',
  description: "Le Pentester Senior simule des cyberattaques pour identifier les vulnérabilités des systèmes. En tant que Red Team Lead, il planifie et dirige des campagnes d'intrusion avancées pour tester la posture de sécurité globale de l'entreprise.",
  courseIds_m1: ['M1PENT','M1BLUR','M1CRYP','M1SECUA','M1APPW'],
  courseIds_m2: ['M2PENT','M2PYTS','M2GOUVI','M2SECM'],
  recommended_project: "Audit de sécurité complet d'une infrastructure (projet M2)",
  hard_skills: ["Tests d'intrusion (Metasploit, Burp Suite)",'Red Team Operations','Exploitation de vulnérabilités','Scripting (Python, Bash)','Analyse réseau (Wireshark, Nmap)','OWASP Top 10','Social Engineering','Rapport d’audit sécurité'],
  softskillIds: ['SS03','SS01','SS06','SS08','SS11'],
  certifications: ['CEH (Certified Ethical Hacker)','OSCP (Offensive Security)','GPEN (GIAC Penetration Tester)','eJPT / eCPPT'],
  salary: sal(42,58,80),
  sectors: ["Cabinet d'audit sécu",'ESN','Grand compte','Défense','Banque/Assurance'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',75,'EN'), m('DE','🇩🇪',72,'EN / DE'), m('CH','🇨🇭',110,'EN / FR')]),
  evolution: "Lead Red Team → Directeur des tests d'intrusion → RSSI → Consultant Sécu indépendant",
  passerelles: ['j12','j14','j19']
},
{
  id: 'j12', name: 'Analyste SOC Senior / Blue Team Lead', short: 'Analyste SOC',
  synonyms_fr: ['Analyste sécurité opérationnelle'],
  synonyms_en: ['Senior SOC Analyst','Blue Team Lead'],
  family: 'sec', titleIds: ['t2'], seniority: 'Senior',
  code_rome: 'M1802',
  description: "L'Analyste SOC Senior surveille et défend le SI en temps réel. Il détecte les incidents de sécurité, coordonne la réponse et améliore en continu les règles de détection. En Blue Team Lead, il manage une équipe de défense.",
  courseIds_m1: ['M1BLUR','M1INTR','M1CRYP','M1APPW','M1SECUA'],
  courseIds_m2: ['M2GOUVI','M2PYTS','M2PENT','M2SECM'],
  recommended_project: "Mise en place d'un SOC lab avec SIEM (ELK/Splunk) et playbooks de réponse",
  hard_skills: ['SIEM (Splunk, ELK, QRadar)','Threat Detection & Hunting','Incident Response','MITRE ATT&CK Framework','Log Analysis','Network Security Monitoring','Malware Analysis (base)','Automatisation SOAR'],
  softskillIds: ['SS03','SS01','SS05','SS08'],
  certifications: ['CompTIA CySA+','GCIA (GIAC Certified Intrusion Analyst)','Splunk Core Certified Power User','Microsoft SC-200'],
  salary: sal(38,52,70),
  sectors: ['SOC / MSSP','Grand compte','Banque/Assurance','Défense','Télécom'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',68,'EN'), m('BE','🇧🇪',58,'FR / EN'), m('LU','🇱🇺',70,'FR / EN')]),
  evolution: 'SOC Manager → Threat Intelligence Lead → RSSI → Consultant Sécu',
  passerelles: ['j11','j13','j19']
},
{
  id: 'j13', name: 'RSSI Junior / Responsable Sécurité', short: 'RSSI',
  synonyms_fr: ['Responsable de la Sécurité des SI'],
  synonyms_en: ['Junior CISO','IT Security Manager'],
  family: 'sec', titleIds: ['t2'], seniority: 'Junior / Confirmé',
  code_rome: 'M1802',
  description: "Le RSSI définit et pilote la politique de sécurité de l'information de l'organisation. Il évalue les risques, met en œuvre les mesures de protection, assure la conformité réglementaire et sensibilise les collaborateurs à la cybersécurité.",
  courseIds_m1: ['M1INTR','M1CRYP','M1GESTI','M1QUAL','M1APPW'],
  courseIds_m2: ['M2GOUVI','M2VEILL','M2PCAG','M2GESTP'],
  recommended_project: "Politique de sécurité ISO 27001 pour une PME (mémoire M2)",
  hard_skills: ['ISO 27001 / 27002','Analyse de risques (EBIOS RM, ISO 27005)','Gouvernance SSI','RGPD & conformité',"Plan de continuité d'activité (PCA / PRA)",'Sensibilisation & formation sécu','Pilotage budgétaire SSI','Gestion de crise cyber'],
  softskillIds: ['SS05','SS09','SS08','SS01','SS07'],
  certifications: ['CISSP (ISC²)','ISO 27001 Lead Implementor','CISM (ISACA)','EBIOS RM'],
  salary: sal(45,60,85),
  sectors: ['Grand compte','Banque/Assurance','Secteur public','Santé','Industrie'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('CH','🇨🇭',110,'FR / EN'), m('LU','🇱🇺',80,'FR / EN'), m('BE','🇧🇪',70,'FR / EN')]),
  evolution: 'RSSI confirmé → DSSI (Directeur SSI) → DPO → Risk Manager',
  passerelles: ['j14','j15','j25']
},
{
  id: 'j14', name: 'Consultant Cybersécurité', short: 'Consultant Cyber',
  synonyms_fr: ['Consultant en sécurité informatique'],
  synonyms_en: ['Cybersecurity Consultant'],
  family: 'sec', titleIds: ['t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "Le Consultant Cybersécurité intervient en mission chez des clients pour auditer, conseiller et implémenter des solutions de sécurité. Il couvre un large spectre : GRC, technique, organisationnel, et accompagne les transformations sécurité.",
  courseIds_m1: ['M1INTR','M1CRYP','M1PENT','M1GESTI','M1QUAL'],
  courseIds_m2: ['M2GOUVI','M2PENT','M2VEILL','M2PCAG'],
  recommended_project: "Audit de maturité cyber chez un client réel (stage M2)",
  hard_skills: ['Audit sécurité (technique & organisationnel)','ISO 27001 / NIST / ANSSI','Analyse de risques','Architecture sécurisée','Rédaction de livrables','Veille vulnérabilités',"Tests d'intrusion (base)",'Conformité RGPD'],
  softskillIds: ['SS08','SS05','SS09','SS07','SS11'],
  certifications: ['CISSP','CEH','ISO 27001 Lead Auditor','CompTIA Security+'],
  salary: sal(40,55,75),
  sectors: ['Cabinet de conseil','ESN','Audit / Compliance','Grand compte','Secteur public'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('CH','🇨🇭',105,'FR / EN'), m('BE','🇧🇪',62,'FR / EN'), m('LU','🇱🇺',72,'FR / EN')]),
  evolution: 'Manager Cyber (cabinet) → RSSI → Associé / Partner → Expert indépendant',
  passerelles: ['j13','j15','j23']
},
{
  id: 'j15', name: 'Auditeur Sécurité ISO 27001', short: 'Auditeur ISO',
  synonyms_fr: ['Auditeur cybersécurité'],
  synonyms_en: ['ISO 27001 Security Auditor'],
  family: 'sec', titleIds: ['t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "L'Auditeur Sécurité ISO 27001 évalue la conformité des systèmes d'information aux normes de sécurité internationales. Il réalise des audits internes et externes, identifie les non-conformités et propose des plans d'action correctifs.",
  courseIds_m1: ['M1QUAL','M1INTR','M1GESTI','M1CRYP'],
  courseIds_m2: ['M2GOUVI','M2VEILL','M2PCAG','M2ETHI'],
  recommended_project: "Audit blanc ISO 27001 sur un périmètre réel (stage M2)",
  hard_skills: ['Audit ISO 27001 / 27002',"ISO 19011 (techniques d'audit)",'EBIOS RM / MEHARI',"Rédaction de rapports d'audit",'Plan d\'action corrective','Cartographie des risques','Conformité RGPD','Contrôle interne SI'],
  softskillIds: ['SS09','SS08','SS07','SS05','SS06'],
  certifications: ['ISO 27001 Lead Auditor','ISO 27001 Lead Implementor','CISA (ISACA)','CRISC'],
  salary: sal(40,55,72),
  sectors: ["Cabinet d'audit",'Grand compte','Banque/Assurance','Secteur public','Santé'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('CH','🇨🇭',100,'FR / EN'), m('LU','🇱🇺',70,'FR / EN'), m('BE','🇧🇪',60,'FR / EN')]),
  evolution: 'Lead Auditor → Responsable Conformité → RSSI → Directeur Audit IT',
  passerelles: ['j13','j14','j25']
},
{
  id: 'j16', name: 'Cloud Security Engineer', short: 'Cloud Security',
  synonyms_fr: ['Ingénieur sécurité cloud'],
  synonyms_en: ['Cloud Security Engineer'],
  family: 'sec', titleIds: ['t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "Le Cloud Security Engineer sécurise les environnements cloud (AWS, Azure, GCP). Il implémente les contrôles de sécurité, gère les identités et accès (IAM), et détecte les configurations à risque dans les architectures cloud.",
  courseIds_m1: ['M1ARCH','M1CRYP','M1PISC','M1INTR','M1APPW'],
  courseIds_m2: ['M2PYTS','M2GOUVI','M2SECM'],
  recommended_project: "Sécurisation d'une infrastructure AWS multi-comptes (projet M2)",
  hard_skills: ['AWS / Azure / GCP Security','IAM & Zero Trust','Cloud Security Posture Management','Container Security (K8s)','Infrastructure as Code (Terraform)','SIEM Cloud (CloudTrail, GuardDuty)','Network Security cloud','Compliance frameworks cloud'],
  softskillIds: ['SS03','SS05','SS01','SS09'],
  certifications: ['AWS Security Specialty','CCSP (ISC²)','Azure Security Engineer AZ-500','Google Professional Cloud Security'],
  salary: sal(45,60,82),
  sectors: ['Grand compte','Cloud providers','FinTech','ESN','Startup'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',78,'EN'), m('DE','🇩🇪',75,'EN'), m('CH','🇨🇭',115,'EN')]),
  evolution: 'Lead Cloud Security → Cloud Architect sécurisé → RSSI cloud-first → CTO sécurité',
  passerelles: ['j20','j22','j13']
},
{
  id: 'j17', name: 'Architecte Réseaux', short: 'Arch. Réseaux',
  synonyms_fr: ['Architecte infrastructure réseau'],
  synonyms_en: ['Network Architect'],
  family: 'reseau', titleIds: ['t2'], seniority: 'Senior',
  code_rome: 'M1801',
  description: "L'Architecte Réseaux conçoit et planifie l'infrastructure réseau de l'entreprise : LAN, WAN, SD-WAN, Wi-Fi, segmentation. Il garantit performance, résilience et sécurité de l'ensemble des communications.",
  courseIds_m1: ['M1ARCH','M1CRYP','M1INTR','M1QUAL'],
  courseIds_m2: ['M2INDU','M2SECM','M2GOUVI','M2PYTS'],
  recommended_project: "Design réseau SD-WAN multi-site sécurisé (mémoire M2)",
  hard_skills: ['Architecture LAN / WAN / SD-WAN','Cisco / Juniper / Fortinet','Protocoles (BGP, OSPF, VXLAN)','Sécurité réseau (firewall, IDS/IPS)','Wi-Fi Enterprise','Network Automation (Ansible)','Monitoring (SNMP, Zabbix)','Virtualisation réseau (NSX)'],
  softskillIds: ['SS05','SS01','SS08','SS09'],
  certifications: ['CCNP Enterprise','CCNA','Fortinet NSE 7','Juniper JNCIS'],
  salary: sal(42,55,75),
  sectors: ['Télécom','Grand compte','ESN','Secteur public','Industrie'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('BE','🇧🇪',60,'FR / EN'), m('LU','🇱🇺',68,'FR / EN'), m('CH','🇨🇭',100,'FR / EN')]),
  evolution: 'Directeur Infrastructure → CTO Réseau → Consultant senior Réseau → VP Infrastructure',
  passerelles: ['j18','j20']
},
{
  id: 'j18', name: 'Ingénieur Systèmes & Réseaux Senior', short: 'Ing. Sys / Rés',
  synonyms_fr: ['Administrateur systèmes senior'],
  synonyms_en: ['Senior Systems & Network Engineer'],
  family: 'reseau', titleIds: ['t2'], seniority: 'Senior',
  code_rome: 'M1810',
  description: "L'Ingénieur Systèmes & Réseaux Senior administre et fait évoluer l'infrastructure IT : serveurs, réseaux, virtualisation, stockage. Il assure la disponibilité, la performance et la sécurité de l'ensemble du SI.",
  courseIds_m1: ['M1ARCH','M1PISC','M1INTR','M1QUAL','M1CRYP'],
  courseIds_m2: ['M2INDU','M2PCAG','M2SECM','M2PYTS'],
  recommended_project: "Migration d'infrastructure on-premise vers hybrid cloud (stage M2)",
  hard_skills: ['Linux / Windows Server','VMware / Hyper-V','Active Directory / LDAP','Scripting (Bash, PowerShell)','Monitoring (Nagios, Zabbix, Grafana)','Backup & disaster recovery','Réseau (switching, routing, VLAN)','Automatisation (Ansible, Puppet)'],
  softskillIds: ['SS10','SS01','SS03','SS09'],
  certifications: ['LPIC-2 / RHCSA','VMware VCP-DCV','CompTIA Server+','CCNA'],
  salary: sal(35,48,62),
  sectors: ['ESN','Grand compte','PME','Secteur public','Industrie'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('BE','🇧🇪',52,'FR / EN'), m('LU','🇱🇺',60,'FR / EN'), m('CH','🇨🇭',90,'FR / EN')]),
  evolution: 'Architecte Infrastructure → Responsable Exploitation → DSI PME → Cloud Architect',
  passerelles: ['j17','j20','j21']
},
{
  id: 'j19', name: 'Expert Forensic / Incident Response', short: 'Expert Forensic',
  synonyms_fr: ['Expert en investigation numérique'],
  synonyms_en: ['Digital Forensics Expert','Incident Response Specialist'],
  family: 'sec', titleIds: ['t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "L'Expert Forensic investigue les incidents de sécurité et les cyberattaques. Il collecte et analyse les preuves numériques, reconstitue la chronologie des attaques et produit des rapports d'investigation exploitables juridiquement.",
  courseIds_m1: ['M1BLUR','M1PENT','M1SECUA','M1INTR','M1CRYP'],
  courseIds_m2: ['M2PENT','M2GOUVI','M2PYTS','M2VEILL'],
  recommended_project: "Investigation forensic sur un scénario de compromission simulé (projet M2)",
  hard_skills: ['Forensic (Autopsy, Volatility, FTK)','Incident Response (NIST SP 800-61)','Malware Analysis','Log Analysis & Timeline','Chain of Custody','Reverse Engineering (base)','OSINT','Rédaction rapport forensic'],
  softskillIds: ['SS03','SS08','SS06','SS09','SS11'],
  certifications: ['GCIH (GIAC Incident Handler)','GCFE (GIAC Forensic Examiner)','EnCE (EnCase)','CHFI (EC-Council)'],
  salary: sal(40,55,75),
  sectors: ['CERT / CSIRT','Grand compte','Défense',"Cabinet d'audit",'Assurance'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',72,'EN'), m('DE','🇩🇪',70,'EN / DE'), m('CH','🇨🇭',105,'EN / FR')]),
  evolution: 'Lead IR → Responsable CERT → RSSI → Expert judiciaire numérique',
  passerelles: ['j11','j12','j14']
},

/* ============== TRANSVERSES (IA/Data ET CyberSecu) ============== */
{
  id: 'j20', name: 'Architecte Cloud / Solutions Architect', short: 'Arch. Cloud',
  synonyms_fr: ['Architecte solutions cloud'],
  synonyms_en: ['Cloud Architect','Solutions Architect'],
  family: 'cloud', titleIds: ['t1','t2'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "L'Architecte Cloud conçoit les architectures cloud complètes (IaaS, PaaS, SaaS) en intégrant sécurité, performance, coûts et scalabilité. Il traduit les besoins métiers en solutions techniques cloud-native.",
  courseIds_m1: ['M1ARCH','M1PISC','M1QUAL','M1INTR'],
  courseIds_m2: ['M2GOUVD','M2PYTS','M2INDU','M2GOUVI'],
  recommended_project: "Architecture cloud multi-region haute disponibilité (mémoire M2)",
  hard_skills: ['AWS / Azure / GCP Architecture','Infrastructure as Code (Terraform, CDK)','Kubernetes & conteneurs','Serverless Architecture','Cloud Networking','Cost Optimization (FinOps)','Haute disponibilité / DR','Well-Architected Framework'],
  softskillIds: ['SS05','SS08','SS01','SS07'],
  certifications: ['AWS Solutions Architect Professional','Azure Solutions Architect Expert','Google Professional Cloud Architect','Kubernetes CKA'],
  salary: sal(48,65,90),
  sectors: ['Grand compte','Cloud providers','ESN','FinTech','Startup'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',85,'EN'), m('DE','🇩🇪',82,'EN'), m('CH','🇨🇭',125,'EN')]),
  evolution: 'Principal Cloud Architect → VP Cloud → CTO → Distinguished Engineer',
  passerelles: ['j8','j16','j21']
},
{
  id: 'j21', name: 'DevOps Engineer Senior / SRE', short: 'DevOps Senior',
  synonyms_fr: ['Ingénieur DevOps senior','Ingénieur fiabilité'],
  synonyms_en: ['Senior DevOps Engineer','Site Reliability Engineer'],
  family: 'cloud', titleIds: ['t1','t2'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "Le DevOps / SRE Engineer automatise les déploiements, gère l'infrastructure as code et garantit la fiabilité des systèmes en production. Il est au carrefour du développement et de l'exploitation, avec un focus sur l'automatisation.",
  courseIds_m1: ['M1PISC','M1ARCH','M1PROJ','M1QUAL','M1INTR'],
  courseIds_m2: ['M2INDU','M2GESTP','M2PCAG','M2PYTS'],
  recommended_project: "Pipeline CI/CD complet avec infra as code et monitoring (projet M1 / M2)",
  hard_skills: ['Docker & Kubernetes','CI/CD (GitLab CI, GitHub Actions, Jenkins)','Terraform / Ansible / Pulumi','Monitoring (Prometheus, Grafana, Datadog)','Linux Administration avancée','Cloud (AWS / GCP / Azure)','Scripting (Bash, Python)','SLO / SLA / Error Budgets'],
  softskillIds: ['SS10','SS01','SS03','SS04'],
  certifications: ['AWS DevOps Engineer Professional','Kubernetes CKA / CKAD','HashiCorp Terraform Associate','Docker Certified Associate'],
  salary: sal(42,55,75),
  sectors: ['Startup','Grand compte','ESN','SaaS / Éditeur','FinTech'],
  market_tension: 'penurie', remote: 'Full remote',
  mobility: mob([m('DE','🇩🇪',72,'EN'), m('NL','🇳🇱',70,'EN'), m('CH','🇨🇭',108,'EN')]),
  evolution: 'Lead DevOps → Platform Engineer → SRE Manager → VP Infrastructure',
  passerelles: ['j20','j22','j9']
},
{
  id: 'j22', name: 'DevSecOps Engineer', short: 'DevSecOps',
  synonyms_fr: ['Ingénieur DevSecOps'],
  synonyms_en: ['DevSecOps Engineer'],
  family: 'cloud', titleIds: ['t1','t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "Le DevSecOps Engineer intègre la sécurité dans chaque étape du cycle de développement et de déploiement. Il automatise les tests de sécurité (SAST, DAST, SCA), sécurise les pipelines CI/CD et forme les développeurs aux bonnes pratiques.",
  courseIds_m1: ['M1PISC','M1APPW','M1PENT','M1PROJ','M1INTR'],
  courseIds_m2: ['M2PYTS','M2PENT','M2GOUVI','M2INDU'],
  recommended_project: "Intégration sécurité dans un pipeline CI/CD existant (projet M2)",
  hard_skills: ['SAST / DAST / SCA (SonarQube, Snyk, OWASP ZAP)','Sécurité des conteneurs','Pipeline sécurisé (GitLab / GitHub)','Secret Management (Vault)','Infrastructure as Code sécurisé','Compliance as Code','Shift-Left Security','Threat Modeling'],
  softskillIds: ['SS03','SS01','SS10','SS06'],
  certifications: ['Certified DevSecOps Professional (CDSP)','AWS Security Specialty','Kubernetes CKS','CompTIA Security+'],
  salary: sal(44,58,78),
  sectors: ['Grand compte','FinTech','Éditeur SaaS','ESN','Banque'],
  market_tension: 'penurie', remote: 'Hybride',
  mobility: mob([m('NL','🇳🇱',75,'EN'), m('DE','🇩🇪',72,'EN'), m('CH','🇨🇭',112,'EN')]),
  evolution: 'Lead DevSecOps → AppSec Manager → Cloud Security Architect → RSSI technique',
  passerelles: ['j21','j16','j11']
},
{
  id: 'j23', name: 'Consultant en Transformation Numérique', short: 'Consult. Transfo',
  synonyms_fr: ['Consultant digital'],
  synonyms_en: ['Digital Transformation Consultant'],
  family: 'management', titleIds: ['t1','t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "Le Consultant en Transformation Numérique accompagne les organisations dans leur mutation digitale. Il définit les roadmaps technologiques, pilote les programmes de changement et aligne la stratégie IT sur les objectifs business.",
  courseIds_m1: ['M1GESTI','M1QUAL','M1MODE','M1INNO','M1PROJ'],
  courseIds_m2: ['M2OFFR','M2GESTP','M2VEILL','M2WEB3','M2ETHI'],
  recommended_project: "Plan de transformation numérique pour une PME / ETI (mémoire M2)",
  hard_skills: ['Stratégie digitale','Gestion du changement','Business Process Reengineering','Architecture SI (urbanisation)','Gestion de programme','Agilité à l\'échelle (SAFe)','ROI & Business Case','Connaissance technos émergentes (IA, Cloud, IoT)'],
  softskillIds: ['SS05','SS08','SS07','SS04','SS06'],
  certifications: ['TOGAF 9','SAFe Agilist','PMP / Prince2','ITIL 4 Foundation'],
  salary: sal(40,55,80),
  sectors: ['Cabinet de conseil','ESN','Grand compte','Secteur public','Startup'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('CH','🇨🇭',105,'FR / EN'), m('BE','🇧🇪',62,'FR / EN'), m('LU','🇱🇺',72,'FR / EN')]),
  evolution: 'Manager Transformation → Partner Conseil → Directeur Digital → CDO (Chief Digital Officer)',
  passerelles: ['j7','j24','j26']
},
{
  id: 'j24', name: 'Chef de Projet IT Senior / Product Manager Technique', short: 'Chef de Projet IT',
  synonyms_fr: ['Responsable de projet IT'],
  synonyms_en: ['Senior IT Project Manager','Technical Product Manager'],
  family: 'management', titleIds: ['t1','t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "Le Chef de Projet IT Senior pilote des projets technologiques complexes de bout en bout. Il manage les équipes, les budgets, les délais et les risques. Le Product Manager technique définit la vision produit et priorise le backlog.",
  courseIds_m1: ['M1GESTI','M1PROJ','M1QUAL','M1MODE','M1INNO'],
  courseIds_m2: ['M2GESTP','M2OFFR','M2VEILL','M2ETHI'],
  recommended_project: "Gestion de projet complet en mode Agile avec livrables réels (projet M1 / M2)",
  hard_skills: ['Gestion de projet Agile (Scrum, Kanban)','Pilotage budgétaire','Gestion des risques','JIRA / Confluence / Notion','Product Management','Méthodes SAFe / Scrum@Scale','Reporting & KPI','Cahier des charges & specs'],
  softskillIds: ['SS01','SS10','SS08','SS04','SS07'],
  certifications: ['Scrum Master PSM I / II','PMP (PMI)','SAFe Product Owner','ITIL 4 Foundation'],
  salary: sal(40,55,72),
  sectors: ['ESN','Grand compte','Startup','Secteur public','Éditeur logiciel'],
  market_tension: 'equilibre', remote: 'Hybride',
  mobility: mob([m('BE','🇧🇪',58,'FR / EN'), m('LU','🇱🇺',68,'FR / EN'), m('CH','🇨🇭',95,'FR / EN')]),
  evolution: 'Directeur de Programme → VP Product → DSI → Directeur Technique',
  passerelles: ['j23','j27','j26']
},
{
  id: 'j25', name: 'DPO (Data Protection Officer)', short: 'DPO',
  synonyms_fr: ['Délégué à la Protection des Données'],
  synonyms_en: ['Data Protection Officer','DPO'],
  family: 'management', titleIds: ['t1','t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1802',
  description: "Le DPO veille au respect du RGPD et des réglementations de protection des données personnelles. Il conseille l'organisation, réalise les analyses d'impact (AIPD), tient le registre des traitements et est l'interlocuteur de la CNIL.",
  courseIds_m1: ['M1INTR','M1QUAL','M1GESTI'],
  courseIds_m2: ['M2VEILL','M2ETHI','M2GOUVI','M2GOUVD'],
  recommended_project: "Mise en conformité RGPD d'une organisation réelle (mémoire M2)",
  hard_skills: ['RGPD (texte, jurisprudence)','Analyse d\'impact (AIPD / PIA)','Registre des traitements','Privacy by Design','Gouvernance des données','Droit du numérique','Gestion des violations de données','Relation CNIL / autorités'],
  softskillIds: ['SS09','SS05','SS08','SS06','SS07'],
  certifications: ['CIPP/E (IAPP)','CIPM (IAPP)','ISO 27701 Lead Implementor','DPO certifié CNIL'],
  salary: sal(40,55,75),
  sectors: ['Grand compte','Santé','Banque/Assurance','Secteur public','ESN'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('BE','🇧🇪',62,'FR / EN'), m('LU','🇱🇺',72,'FR / EN'), m('DE','🇩🇪',68,'EN / DE')]),
  evolution: 'Chief Privacy Officer → Directeur Conformité → Responsable GRC → Consultant Privacy indépendant',
  passerelles: ['j13','j15','j14']
},
{
  id: 'j26', name: 'Entrepreneur Tech / CTO Startup', short: 'Entrepreneur Tech',
  synonyms_fr: ['Fondateur technique','CTO startup'],
  synonyms_en: ['Tech Entrepreneur','Startup CTO'],
  family: 'management', titleIds: ['t1','t2'], seniority: 'Confirmé / Senior',
  code_rome: 'M1805',
  description: "L'Entrepreneur Tech / CTO Startup crée ou co-fonde une startup technologique. Il définit la vision technique, recrute et manage l'équipe tech, fait les choix d'architecture et pilote le produit de l'idée au marché.",
  courseIds_m1: ['M1PROJ','M1GESTI','M1INNO','M1PISC','M1MODE'],
  courseIds_m2: ['M2GESTP','M2WEB3','M2OFFR','M2VEILL','M2ETHI'],
  recommended_project: "Création d'une startup tech (incubateur / projet M1 + mémoire M2)",
  hard_skills: ['Architecture technique full-stack','Product Management','Recrutement tech','Levée de fonds (pitch deck)','Choix technologiques stratégiques','MVP & itérations rapides','Business Model Canvas','Growth hacking technique'],
  softskillIds: ['SS04','SS01','SS05','SS08','SS07'],
  certifications: ['Aucune obligatoire — le terrain prime','AWS / GCP Cloud Practitioner (utile)','Scrum Master PSM I (utile)'],
  salary: sal(35,55,90),
  sectors: ['Startup','Scale-up','Incubateur / Accélérateur','VC / Investissement'],
  market_tension: 'equilibre', remote: 'Full remote',
  mobility: mob([m('NL','🇳🇱',70,'EN'), m('DE','🇩🇪',65,'EN'), m('ES','🇪🇸',45,'EN / ES')]),
  evolution: 'CEO → Serial Entrepreneur → Business Angel → VP Engineering (scale-up)',
  passerelles: ['j9','j8','j27']
},
{
  id: 'j27', name: 'Engineering Manager', short: 'Eng. Manager',
  synonyms_fr: ["Responsable d'équipe technique",'Manager d\'ingénierie'],
  synonyms_en: ['Engineering Manager'],
  family: 'management', titleIds: ['t1','t2'], seniority: 'Senior',
  code_rome: 'M1805',
  description: "L'Engineering Manager manage une ou plusieurs équipes de développement. Il recrute, fait grandir les ingénieurs, garantit la qualité technique et aligne la production tech avec les objectifs business. C'est un rôle à 50% people, 50% tech.",
  courseIds_m1: ['M1GESTI','M1PROJ','M1QUAL','M1MODE','M1INNO'],
  courseIds_m2: ['M2GESTP','M2INDU','M2VEILL','M2ETHI'],
  recommended_project: "Management d'une équipe de 4-6 devs sur un projet réel (stage M2)",
  hard_skills: ['People Management','Recrutement technique','Career Development (IC / Manager)','Architecture (lecture, pas écriture)','Process Engineering (Agile, Kanban)','Métriques DORA','Gestion de la dette technique','Stakeholder Management'],
  softskillIds: ['SS01','SS05','SS08','SS04','SS06'],
  certifications: ['Scrum Master PSM II','Management 3.0','SAFe Program Consultant','PMP'],
  salary: sal(50,65,90),
  sectors: ['Startup / Scale-up','Grand compte','Éditeur SaaS','ESN','FinTech'],
  market_tension: 'tendu', remote: 'Hybride',
  mobility: mob([m('DE','🇩🇪',85,'EN'), m('NL','🇳🇱',82,'EN'), m('CH','🇨🇭',130,'EN')]),
  evolution: 'Director of Engineering → VP Engineering → CTO → Chief of Staff (tech)',
  passerelles: ['j9','j26','j24']
}
];

/* ============================================================
   LOOKUPS
   ============================================================ */

const JOB_BY_ID = Object.fromEntries(JOBS.map(j => [j.id, j]));
const COURSE_BY_ID = Object.fromEntries(COURSES.map(c => [c.id, c]));
const SS_BY_ID = Object.fromEntries(SOFTSKILLS.map(s => [s.id, s]));

const STATS = {
  total: JOBS.length,
  penurie: JOBS.filter(j => j.market_tension === 'penurie').length,
  avgSenior: Math.round(JOBS.reduce((a, j) => a + j.salary.senior, 0) / JOBS.length),
  ects: 300,
  euCountries: 11
};

const jobTitleColor = (job) => {
  const hasT1 = job.titleIds.includes('t1');
  const hasT2 = job.titleIds.includes('t2');
  if (hasT1 && hasT2) return C.trans;
  if (hasT1) return C.t1;
  return C.t2;
};

const jobTitleLabel = (job) => {
  const hasT1 = job.titleIds.includes('t1');
  const hasT2 = job.titleIds.includes('t2');
  if (hasT1 && hasT2) return 'Transverse';
  if (hasT1) return 'IA/Data';
  return 'CyberSecu';
};

/* ============================================================
   UI PRIMITIVES
   ============================================================ */

const FONT = `'Segoe UI', system-ui, -apple-system, sans-serif`;

const Card = ({ children, style, onClick, active, hover=true }) => (
  <div
    onClick={onClick}
    style={{
      background: active ? `${C.pink}10` : C.bgElev,
      border: `1px solid ${active ? C.pink : C.border}`,
      borderRadius: 10,
      padding: 24,
      transition: 'all 180ms ease',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}
    onMouseEnter={(e) => {
      if (!hover || !onClick) return;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = C.pink;
      e.currentTarget.style.boxShadow = `0 10px 28px ${C.pink}26`;
    }}
    onMouseLeave={(e) => {
      if (!hover || !onClick) return;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = active ? C.pink : C.border;
      e.currentTarget.style.boxShadow = 'none';
    }}
  >{children}</div>
);

const Badge = ({ children, color=C.t1, filled=false, size='md', icon:Icon }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: size==='lg' ? '8px 16px' : '6px 12px',
    borderRadius: 999,
    fontSize: size==='lg' ? 18 : 16,
    fontWeight: 600,
    background: filled ? color : `${color}22`,
    color: filled ? '#fff' : color,
    border: filled ? 'none' : `1px solid ${color}55`,
    whiteSpace: 'nowrap'
  }}>
    {Icon && <Icon size={size==='lg' ? 20 : 16} />}
    {children}
  </span>
);

const TensionBadge = ({ tension, size='md' }) => {
  const t = TENSION[tension];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: size==='lg' ? '10px 18px' : '6px 12px',
      borderRadius: 10,
      fontSize: size==='lg' ? 18 : 16,
      fontWeight: 700,
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.color}66`
    }}>
      <t.icon size={size==='lg' ? 20 : 16} />
      {t.label}
    </span>
  );
};

const FamilyPill = ({ family, active=true, onClick, size='md' }) => {
  const f = FAMILIES[family];
  const Icon = f.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: size==='lg' ? '10px 18px' : '6px 14px',
        borderRadius: 999,
        fontSize: size==='lg' ? 18 : 16,
        fontWeight: 600,
        background: active ? `${f.color}22` : 'transparent',
        color: active ? f.color : C.muted,
        border: `1px solid ${active ? f.color+'66' : C.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 150ms',
        fontFamily: FONT
      }}
    >
      <Icon size={size==='lg' ? 18 : 16} />
      {f.label}
    </button>
  );
};

const TitleBadge = ({ titleIds }) => {
  const hasT1 = titleIds.includes('t1');
  const hasT2 = titleIds.includes('t2');
  if (hasT1 && hasT2) return <Badge color={C.trans} filled={false}>Transverse (T1 + T2)</Badge>;
  if (hasT1) return <Badge color={C.t1} filled={false}>IA/Data — RNCP38822</Badge>;
  return <Badge color={C.t2} filled={false}>CyberSecu — RNCP38823</Badge>;
};

const SectionTitle = ({ icon:Icon, children, color=C.t1 }) => (
  <div style={{
    display:'flex', alignItems:'center', gap:12,
    marginBottom: 16, paddingBottom: 12,
    borderBottom: `2px solid ${color}33`
  }}>
    {Icon && <Icon size={24} color={color} />}
    <h3 style={{ fontSize: 24, fontWeight: 700, color: C.fg, margin: 0, letterSpacing: '-0.01em' }}>
      {children}
    </h3>
  </div>
);

const Stat = ({ value, label, color=C.t1, icon:Icon }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '18px 24px',
    background: C.bgDeep,
    border: `1px solid ${color}33`,
    borderRadius: 14, minWidth: 180
  }}>
    {Icon && <Icon size={20} color={color} style={{ marginBottom: 6 }} />}
    <div style={{ fontSize: 36, fontWeight: 800, color, letterSpacing:'-0.02em', lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: 16, color: C.fgDim, marginTop: 6, textAlign:'center', fontWeight: 500 }}>
      {label}
    </div>
  </div>
);

/* ============================================================
   SALARY GAUGE — 3 steps
   ============================================================ */
const SalaryGauge = ({ salary, compact=false }) => {
  const max = 100;
  const steps = [
    { label: 'Junior',   val: salary.junior,    color: '#60A5FA' },
    { label: 'Confirmé', val: salary.confirmed, color: '#3B82F6' },
    { label: 'Senior',   val: salary.senior,    color: '#10B981' }
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
      {steps.map((s, i) => (
        <div key={i}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: compact ? 16 : 18, color: C.fgDim, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: compact ? 22 : 28, fontWeight: 800, color: s.color, letterSpacing:'-0.02em' }}>
              {s.val}k€
            </span>
          </div>
          <div style={{ height: 10, background:'rgba(148,163,184,0.15)', borderRadius: 999, overflow:'hidden' }}>
            <div style={{
              width: `${(s.val/max)*100}%`,
              height:'100%',
              background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
              borderRadius: 999,
              transition: 'width 500ms ease'
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   EUROPE MAP (SVG simplifié)
   ============================================================ */

const EUROPE_BG_PATH = "M180,190 L240,150 L300,130 L380,100 L460,85 L550,90 L640,100 L680,140 L700,190 L690,260 L660,320 L620,380 L580,430 L520,470 L440,490 L360,485 L290,465 L240,430 L200,380 L180,320 L170,260 Z";

const EuropeMap = ({ highlighted = [], size = 'md' }) => {
  const w = size==='lg' ? 760 : 560;
  const h = size==='lg' ? 540 : 400;
  const scale = w / 760;
  return (
    <svg viewBox="0 0 760 540" width={w} height={h} style={{ display:'block' }}>
      <defs>
        <radialGradient id="euBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%"  stopColor="#1E293B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <filter id="countryGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d={EUROPE_BG_PATH} fill="url(#euBg)" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.5"/>
      {Object.entries(EU_COUNTRIES).map(([code, c]) => {
        const on = highlighted.includes(code);
        return (
          <g key={code} transform={`translate(${c.x},${c.y})`}>
            <rect
              x={-30} y={-22} width={60} height={44}
              rx={8}
              fill={on ? 'rgba(16,185,129,0.22)' : 'rgba(51,65,85,0.35)'}
              stroke={on ? '#10B981' : '#475569'}
              strokeWidth={on ? 2 : 1}
              filter={on ? 'url(#countryGlow)' : undefined}
            />
            <text x={0} y={-2} textAnchor="middle" fontSize={22} dominantBaseline="middle">{c.flag}</text>
            <text x={0} y={16} textAnchor="middle" fontSize={11} fontWeight="700" fill={on ? '#10B981' : '#94A3B8'}>{code}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ============================================================
   NAVBAR
   ============================================================ */

const SCREENS = [
  { id: 'constellation', label: 'Constellation', icon: Sparkles, shortcut: '1' },
  { id: 'grid',          label: 'Grille',        icon: LayoutGrid, shortcut: '2' },
  { id: 'detail',        label: 'Fiche Métier',  icon: User, shortcut: '3' },
  { id: 'matrix',        label: 'Matière → Métiers', icon: BookOpen, shortcut: '4' },
  { id: 'compare',       label: 'Comparaison',   icon: GitCompare, shortcut: '5' },
  { id: 'recognition',   label: 'Diplôme',       icon: Award, shortcut: '6' },
  { id: 'horizon',       label: 'Horizon',       icon: Compass, shortcut: '7' }
];

const Navbar = ({ current, onChange, onTogglePresent, presentMode }) => (
  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: C.bgDeep,
    borderBottom: `1px solid ${C.border}`,
    padding: '12px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontFamily: FONT,
    transform: presentMode ? 'translateY(-100%)' : 'translateY(0)',
    transition: 'transform 250ms ease'
  }}>
    <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
      <img src="./logo.svg" alt="École IT" style={{ height: 36, width:'auto', display:'block' }}/>
      <div style={{ lineHeight: 1.2, paddingLeft: 14, borderLeft: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>27 métiers · Bac+5 · RNCP N7</div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 4 }}>
      {SCREENS.map(s => {
        const Icon = s.icon;
        const active = current === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            style={{
              position:'relative',
              display:'flex', alignItems:'center', gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              background: 'transparent',
              color: active ? C.fg : C.fgDim,
              border: 'none',
              borderBottom: `2px solid ${active ? C.pink : 'transparent'}`,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: active ? 700 : 500,
              fontFamily: FONT,
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = C.fg; } }}
            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = C.fgDim; } }}
          >
            <Icon size={18} />
            <span>{s.label}</span>
            <span style={{
              fontSize: 12, padding: '2px 6px', borderRadius: 4,
              background: active ? `${C.pink}22` : `${C.border}`,
              color: active ? C.pink : C.muted, fontWeight: 700
            }}>{s.shortcut}</span>
          </button>
        );
      })}
    </div>

    <button
      onClick={onTogglePresent}
      title="Mode présentation (F11 ou Ctrl+F)"
      style={{
        display:'flex', alignItems:'center', gap: 8,
        padding: '10px 18px', borderRadius: 8,
        background: C.pink,
        color: '#fff',
        border: 'none',
        cursor:'pointer', fontSize: 14, fontWeight: 800,
        fontFamily: FONT,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        boxShadow: `0 4px 14px ${C.pink}55`
      }}
    >
      <Presentation size={16} />
      Présentation
    </button>
  </nav>
);

const PresentModeToggle = ({ show, onClick }) => (
  <button
    onClick={onClick}
    title="Afficher la navigation"
    style={{
      position: 'fixed', top: 16, right: 16, zIndex: 200,
      padding: 10, borderRadius: 10,
      background: C.bgElev,
      border: `1px solid ${C.border}`,
      color: C.fg, cursor:'pointer',
      opacity: show ? 0.5 : 0,
      pointerEvents: show ? 'auto' : 'none',
      transition: 'opacity 200ms'
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
  >
    <Eye size={20} />
  </button>
);

/* ============================================================
   SCREEN 1 — CONSTELLATION
   ============================================================ */

const ConstellationScreen = ({ onSelectJob }) => {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const [filter, setFilter] = useState('all'); // all | t1 | t2 | trans
  const [paused, setPaused] = useState(false);
  const simRef = useRef(null);

  const filterMatch = (d) => {
    if (filter === 'all') return true;
    const t1 = d.titleIds.includes('t1');
    const t2 = d.titleIds.includes('t2');
    if (filter === 't1') return t1 && !t2;
    if (filter === 't2') return t2 && !t1;
    if (filter === 'trans') return t1 && t2;
    return true;
  };

  useEffect(() => {
    if (!svgRef.current || !wrapRef.current) return;

    const width = wrapRef.current.clientWidth;
    const height = 620;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', width).attr('height', height);

    // glow
    const defs = svg.append('defs');
    const f = defs.append('filter').attr('id', 'glowNode').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    f.append('feGaussianBlur').attr('stdDeviation', 5).attr('result', 'b');
    const fm = f.append('feMerge');
    fm.append('feMergeNode').attr('in', 'b');
    fm.append('feMergeNode').attr('in', 'SourceGraphic');

    // stars background
    const starsG = svg.append('g');
    for (let i = 0; i < 80; i++) {
      starsG.append('circle')
        .attr('cx', Math.random()*width)
        .attr('cy', Math.random()*height)
        .attr('r', Math.random()*1.4 + 0.2)
        .attr('fill', '#E2E8F0')
        .attr('opacity', Math.random()*0.5 + 0.1);
    }

    // nodes & links
    const nodes = JOBS.map(j => ({ ...j }));
    const linkSet = new Set();
    const links = [];
    JOBS.forEach(j => (j.passerelles || []).forEach(p => {
      if (!JOB_BY_ID[p]) return;
      const key = [j.id, p].sort().join('|');
      if (linkSet.has(key)) return;
      linkSet.add(key);
      links.push({ source: j.id, target: p });
    }));

    const sizeFn = (d) => d.market_tension === 'penurie' ? 26 : d.market_tension === 'tendu' ? 20 : 15;

    const linkG = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#64748B')
      .attr('stroke-opacity', 0.18)
      .attr('stroke-width', 1);

    const nodeG = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('click', (e, d) => onSelectJob(d.id));

    nodeG.append('circle')
      .attr('r', d => sizeFn(d) + 6)
      .attr('fill', d => FAMILIES[d.family].color)
      .attr('opacity', 0.22)
      .attr('filter', 'url(#glowNode)');

    nodeG.append('circle')
      .attr('r', sizeFn)
      .attr('fill', d => FAMILIES[d.family].color)
      .attr('stroke', '#F8FAFC')
      .attr('stroke-width', 2);

    nodeG.append('text')
      .text(d => d.short)
      .attr('dy', d => sizeFn(d) + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F8FAFC')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('font-family', FONT)
      .style('pointer-events', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(2,6,23,0.85)')
      .style('stroke-width', 3);

    // tooltip
    const tip = d3.select(wrapRef.current).append('div')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('background', 'rgba(2,6,23,0.95)')
      .style('border', `1px solid ${C.border}`)
      .style('border-radius', 10)
      .style('padding', '12px 16px')
      .style('color', C.fg)
      .style('font-family', FONT)
      .style('pointer-events', 'none')
      .style('z-index', 50)
      .style('box-shadow', '0 8px 24px rgba(0,0,0,0.4)');

    nodeG.on('mouseenter', (e, d) => {
      const rect = wrapRef.current.getBoundingClientRect();
      tip.style('display', 'block').html(`
        <div style="font-size:18px;font-weight:700;margin-bottom:6px">${d.name}</div>
        <div style="font-size:16px;color:#94A3B8">Senior : <span style="color:#10B981;font-weight:800;font-size:20px">${d.salary.senior}k€</span></div>
      `);
    })
    .on('mousemove', (e) => {
      const rect = wrapRef.current.getBoundingClientRect();
      tip.style('left', (e.clientX - rect.left + 16)+'px').style('top', (e.clientY - rect.top + 16)+'px');
    })
    .on('mouseleave', () => tip.style('display','none'));

    // staggered appearance
    nodeG.transition()
      .delay((d, i) => i * 60)
      .duration(450)
      .style('opacity', d => filterMatch(d) ? 1 : 0.12);

    // simulation
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(110).strength(0.18))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width/2, height/2))
      .force('x', d3.forceX(d => {
        const t1 = d.titleIds.includes('t1') && !d.titleIds.includes('t2');
        const t2 = d.titleIds.includes('t2') && !d.titleIds.includes('t1');
        if (t1) return width * 0.30;
        if (t2) return width * 0.70;
        return width * 0.50;
      }).strength(0.28))
      .force('y', d3.forceY(height/2).strength(0.08))
      .force('collision', d3.forceCollide(d => sizeFn(d) + 14));

    simRef.current = sim;

    sim.on('tick', () => {
      linkG
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodeG.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // filter effect on opacity
    nodeG.transition().duration(350).style('opacity', d => filterMatch(d) ? 1 : 0.12);
    linkG.transition().duration(350).attr('stroke-opacity', d => {
      const s = typeof d.source === 'object' ? d.source : JOB_BY_ID[d.source];
      const t = typeof d.target === 'object' ? d.target : JOB_BY_ID[d.target];
      return (filterMatch(s) && filterMatch(t)) ? 0.25 : 0.04;
    });

    return () => { sim.stop(); tip.remove(); };
  }, [filter]);

  useEffect(() => {
    if (!simRef.current) return;
    if (paused) simRef.current.stop();
    else simRef.current.alpha(0.3).restart();
  }, [paused]);

  return (
    <div style={{ padding: '32px 48px', fontFamily: FONT, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom: 28 }}>
        <h1 style={{
          fontSize: 44, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: C.fg, lineHeight: 1.15
        }}>
          <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 3 }}>27 métiers</span>{' '}accessibles avec votre Bac+5
        </h1>
        <p style={{ fontSize: 22, color: C.fgDim, marginTop: 14, fontWeight: 500 }}>
          2 spécialisations · <strong style={{ color: C.fg, borderBottom: `2px solid ${C.cyan}` }}>Bac+5</strong> · 300 ECTS · Reconnu dans toute l'Europe
        </p>
      </div>

      {/* Legend top-left + graph */}
      <div ref={wrapRef} style={{ position: 'relative', marginBottom: 24 }}>
        <div style={{
          position:'absolute', top: 16, left: 16, zIndex: 10,
          background: C.bgElev,
          border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 18px'
        }}>
          <div style={{ fontSize: 16, color: C.fgDim, marginBottom: 10, fontWeight: 700 }}>Familles métier</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: '6px 18px' }}>
            {Object.entries(FAMILIES).map(([k, f]) => (
              <div key={k} style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 14 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: f.color, boxShadow: `0 0 8px ${f.color}` }}/>
                <span style={{ color: C.fg }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPaused(p => !p)}
          style={{
            position:'absolute', top: 16, right: 16, zIndex: 10,
            padding: '8px 14px', borderRadius: 8,
            background: C.bgElev,
            border: `1px solid ${C.border}`, color: C.fg, cursor:'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: FONT
          }}
        >
          {paused ? '▶ Reprendre' : '⏸ Pause'}
        </button>

        <svg ref={svgRef} style={{ display:'block', width:'100%', borderRadius: 16 }} />
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap: 12, justifyContent:'center', marginBottom: 24, flexWrap:'wrap' }}>
        {[
          { id:'all',   label: `Tous (${JOBS.length})`, color: C.fg },
          { id:'t1',    label: 'IA / Data', color: C.t1 },
          { id:'t2',    label: 'CyberSecu', color: C.t2 },
          { id:'trans', label: 'Transverses',       color: C.trans }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '10px 22px', borderRadius: 999,
              background: filter === f.id ? `${f.color}2A` : 'transparent',
              color: filter === f.id ? f.color : C.fgDim,
              border: `1px solid ${filter === f.id ? f.color : C.border}`,
              fontSize: 17, fontWeight: 700, fontFamily: FONT, cursor:'pointer',
              transition: 'all 150ms'
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap: 18, justifyContent:'center', flexWrap:'wrap' }}>
        <Stat icon={Flame}    value={STATS.penurie}     label="métiers en pénurie" color={C.danger} />
        <Stat icon={Euro}     value={`${STATS.avgSenior}k€`} label="salaire senior moyen" color={C.success} />
        <Stat icon={GraduationCap} value={STATS.ects}  label="crédits ECTS"       color={C.t1} />
        <Stat icon={Globe}    value={`${STATS.euCountries}+`} label="pays de mobilité"   color={C.trans} />
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 2 — GRID
   ============================================================ */

const GridScreen = ({ onSelectJob }) => {
  const [title, setTitle]     = useState('all');
  const [family, setFamily]   = useState('all');
  const [tension, setTension] = useState('all');
  const [search, setSearch]   = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return JOBS.filter(j => {
      if (title === 't1' && !(j.titleIds.includes('t1') && !j.titleIds.includes('t2'))) return false;
      if (title === 't2' && !(j.titleIds.includes('t2') && !j.titleIds.includes('t1'))) return false;
      if (title === 'trans' && !(j.titleIds.length === 2)) return false;
      if (family !== 'all' && j.family !== family) return false;
      if (tension !== 'all' && j.market_tension !== tension) return false;
      if (q) {
        const hay = [j.name, ...j.synonyms_fr, ...j.synonyms_en, j.description].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [title, family, tension, search]);

  return (
    <div style={{ padding: '32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, margin: 0, color: C.fg, letterSpacing:'-0.02em' }}>
          Les <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 2 }}>27 métiers</span> en un coup d'œil
        </h1>
        <p style={{ fontSize: 19, color: C.fgDim, marginTop: 10 }}>
          Filtrez pour explorer le spectre d'opportunités.
        </p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24, padding: 20 }} hover={false}>
        <div style={{ display:'flex', gap: 24, flexWrap:'wrap', alignItems:'center' }}>
          {/* Search */}
          <div style={{ position:'relative', flex:'1 1 320px', minWidth: 260 }}>
            <Search size={18} color={C.muted} style={{ position:'absolute', left: 14, top: 14 }}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un métier, synonyme FR/EN…"
              style={{
                width: '100%', padding: '12px 14px 12px 42px',
                background: C.bgDeep,
                border: `1px solid ${C.border}`,
                borderRadius: 10, color: C.fg,
                fontSize: 17, fontFamily: FONT, outline: 'none'
              }}
            />
          </div>

          {/* Title */}
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            {[
              { id:'all', label:'Tous titres', color: C.fg },
              { id:'t1', label:'IA/Data', color: C.t1 },
              { id:'t2', label:'CyberSecu', color: C.t2 },
              { id:'trans', label:'Transverses', color: C.trans }
            ].map(f => (
              <button key={f.id} onClick={() => setTitle(f.id)}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  background: title === f.id ? `${f.color}26` : 'transparent',
                  color: title === f.id ? f.color : C.fgDim,
                  border: `1px solid ${title === f.id ? f.color+'88' : C.border}`,
                  fontSize: 16, fontWeight: 600, fontFamily: FONT, cursor:'pointer'
                }}
              >{f.label}</button>
            ))}
          </div>

          {/* Tension */}
          <div style={{ display:'flex', gap: 8 }}>
            {[
              { id:'all', label:'Toutes tensions', color: C.fg },
              { id:'penurie', label:'Pénurie', color: C.danger },
              { id:'tendu', label:'Tendu', color: C.warn },
              { id:'equilibre', label:'Équilibré', color: C.success }
            ].map(f => (
              <button key={f.id} onClick={() => setTension(f.id)}
                style={{
                  padding: '8px 14px', borderRadius: 8,
                  background: tension === f.id ? `${f.color}26` : 'transparent',
                  color: tension === f.id ? f.color : C.fgDim,
                  border: `1px solid ${tension === f.id ? f.color+'88' : C.border}`,
                  fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor:'pointer'
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* Family chips */}
        <div style={{ display:'flex', gap: 10, flexWrap:'wrap', marginTop: 16 }}>
          <FamilyChip active={family==='all'} onClick={() => setFamily('all')} label={`Toutes familles`} color={C.fg} />
          {Object.keys(FAMILIES).map(k => (
            <FamilyPill key={k} family={k} active={family===k}
              onClick={() => setFamily(family===k ? 'all' : k)} />
          ))}
        </div>

        <div style={{ marginTop: 14, color: C.muted, fontSize: 15 }}>
          <strong style={{ color: C.fg }}>{filtered.length}</strong> métier{filtered.length>1?'s':''} affiché{filtered.length>1?'s':''}
        </div>
      </Card>

      {/* Grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: 20
      }}>
        {filtered.map(j => <JobCard key={j.id} job={j} onClick={() => onSelectJob(j.id)} />)}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1', textAlign:'center',
            padding: 48, color: C.muted, fontSize: 18
          }}>
            Aucun métier ne correspond à ces filtres.
          </div>
        )}
      </div>
    </div>
  );
};

const FamilyChip = ({ active, onClick, label, color }) => (
  <button onClick={onClick}
    style={{
      padding: '8px 14px', borderRadius: 999,
      background: active ? `${color}26` : 'transparent',
      color: active ? color : C.muted,
      border: `1px solid ${active ? color+'88' : C.border}`,
      fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor:'pointer'
    }}
  >{label}</button>
);

const JobCard = ({ job, onClick }) => {
  const fam = FAMILIES[job.family];
  const FamIcon = fam.icon;
  const tColor = jobTitleColor(job);
  return (
    <Card onClick={onClick} style={{ position:'relative', overflow:'hidden', borderLeft: `4px solid ${tColor}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14, gap: 8 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${fam.color}26`, color: fam.color,
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <FamIcon size={22} />
          </div>
          <div style={{ fontSize: 13, color: fam.color, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>
            {fam.label}
          </div>
        </div>
        {job.remote === 'Full remote' && (
          <div title="Full remote possible" style={{ display:'flex', alignItems:'center', gap: 4, color: C.success, fontSize: 14, fontWeight: 600 }}>
            <Laptop size={16} /> Remote
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 22, fontWeight: 700, color: C.fg, margin: '0 0 12px 0', letterSpacing:'-0.01em', lineHeight: 1.25 }}>
        {job.name}
      </h3>

      <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 16, flexWrap:'wrap' }}>
        <TensionBadge tension={job.market_tension} />
        <Badge color={tColor}>{jobTitleLabel(job)}</Badge>
      </div>

      <div style={{
        padding: 16, background: C.bgDeep, borderRadius: 12,
        display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 12
      }}>
        <div>
          <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, marginBottom: 2 }}>Salaire senior</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.success, letterSpacing:'-0.02em', lineHeight: 1 }}>
            {job.salary.senior}k€
          </div>
        </div>
        <div style={{ fontSize: 14, color: C.fgDim, textAlign:'right' }}>
          Jr {job.salary.junior}k · Conf {job.salary.confirmed}k
        </div>
      </div>
    </Card>
  );
};

/* ============================================================
   SCREEN 3 — JOB DETAIL (tabs)
   ============================================================ */

const JobDetailScreen = ({ jobId, onSelectJob, onNavigate }) => {
  const [tab, setTab] = useState('apercu');

  useEffect(() => {
    setTab('apercu');
  }, [jobId]);

  const job = JOB_BY_ID[jobId] || JOBS[0];
  const fam = FAMILIES[job.family];
  const FamIcon = fam.icon;
  const tColor = jobTitleColor(job);

  const tabs = [
    { id:'apercu',    label:'Aperçu',         icon: Eye },
    { id:'parcours',  label:'Parcours',       icon: BookOpen },
    { id:'competences', label:'Compétences',  icon: Star },
    { id:'carriere',  label:'Carrière & Mobilité', icon: Rocket }
  ];

  return (
    <div style={{ padding: '32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      {/* Top bar: nav + job title */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 24, marginBottom: 24 }}>
        <button
          onClick={() => onNavigate(-1)}
          style={{
            display:'flex', alignItems:'center', gap: 8,
            padding:'10px 18px', background: C.bgElev,
            border: `1px solid ${C.border}`, borderRadius: 10,
            color: C.fg, cursor:'pointer', fontSize: 16, fontWeight: 600, fontFamily: FONT
          }}
        >
          <ChevronLeft size={20} /> Précédent
        </button>

        <div style={{ flex: 1, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: `${fam.color}26`, color: fam.color,
              display:'flex', alignItems:'center', justifyContent:'center'
            }}><FamIcon size={30} /></div>
            <Badge color={fam.color} size="lg">{fam.label}</Badge>
            <Badge color={tColor} size="lg">{jobTitleLabel(job)}</Badge>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.fg, margin: 0, letterSpacing:'-0.02em' }}>
            {job.name}
          </h1>
          <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>
            {job.synonyms_en.join(' · ')} · ROME {job.code_rome}
          </div>
        </div>

        <button
          onClick={() => onNavigate(1)}
          style={{
            display:'flex', alignItems:'center', gap: 8,
            padding:'10px 18px', background: C.bgElev,
            border: `1px solid ${C.border}`, borderRadius: 10,
            color: C.fg, cursor:'pointer', fontSize: 16, fontWeight: 600, fontFamily: FONT
          }}
        >
          Suivant <ChevronRight size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display:'flex', alignItems:'center', gap: 8,
                padding: '12px 22px',
                background: 'transparent',
                color: active ? C.fg : C.muted,
                border: 'none',
                borderBottom: `3px solid ${active ? tColor : 'transparent'}`,
                cursor:'pointer', fontSize: 17, fontWeight: active ? 700 : 500, fontFamily: FONT,
                marginBottom: -1
              }}
            >
              <Icon size={18}/>{t.label}
            </button>
          );
        })}
      </div>

      {tab === 'apercu'     && <TabOverview job={job} onSelectJob={onSelectJob} />}
      {tab === 'parcours'   && <TabParcours job={job} />}
      {tab === 'competences'&& <TabSkills job={job} />}
      {tab === 'carriere'   && <TabCareer job={job} onSelectJob={onSelectJob} />}
    </div>
  );
};

const TabOverview = ({ job }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap: 24 }}>
    <Card hover={false}>
      <SectionTitle icon={Briefcase} color={C.t1}>Description</SectionTitle>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: C.fgDim, margin: 0 }}>
        {job.description}
      </p>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 15, color: C.muted, fontWeight: 600, marginBottom: 10 }}>Synonymes</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
          {job.synonyms_fr.map((s,i)=>(<Badge key={'fr'+i} color={C.t1}>{s}</Badge>))}
          {job.synonyms_en.map((s,i)=>(<Badge key={'en'+i} color={C.trans}>{s}</Badge>))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 15, color: C.muted, fontWeight: 600, marginBottom: 10 }}>Secteurs employeurs</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
          {job.sectors.map((s,i)=>(<Badge key={i} color={FAMILIES[job.family].color}>{s}</Badge>))}
        </div>
      </div>
    </Card>

    <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
      <Card hover={false}>
        <SectionTitle icon={Euro} color={C.success}>Rémunération</SectionTitle>
        <SalaryGauge salary={job.salary} />
      </Card>

      <Card hover={false}>
        <SectionTitle icon={Gauge} color={C.warn}>Tension marché</SectionTitle>
        <TensionBadge tension={job.market_tension} size="lg" />
        <div style={{ marginTop: 16, display:'flex', alignItems:'center', gap: 10 }}>
          <Laptop size={18} color={C.success}/>
          <span style={{ fontSize: 17, color: C.fgDim, fontWeight: 600 }}>Télétravail · {job.remote}</span>
        </div>
        <div style={{ marginTop: 14, display:'flex', alignItems:'center', gap: 10 }}>
          <Briefcase size={18} color={C.t1}/>
          <span style={{ fontSize: 16, color: C.fgDim }}>{job.seniority}</span>
        </div>
      </Card>
    </div>
  </div>
);

const TabParcours = ({ job }) => {
  const m1 = job.courseIds_m1.map(id => COURSE_BY_ID[id]).filter(Boolean);
  const m2 = job.courseIds_m2.map(id => COURSE_BY_ID[id]).filter(Boolean);
  const ss = job.softskillIds.map(id => SS_BY_ID[id]).filter(Boolean);

  const CourseChip = ({ c }) => (
    <div title={c.name} style={{
      padding: '10px 14px',
      background: c.spec === 'common' ? 'rgba(139,92,246,0.15)' :
                  c.spec === 't1' ? 'rgba(59,130,246,0.18)' : 'rgba(249,115,22,0.18)',
      border: `1px solid ${
        c.spec === 'common' ? C.trans+'66' :
        c.spec === 't1' ? C.t1+'88' : C.t2+'88'
      }`,
      borderRadius: 10, color: C.fg,
      display:'flex', flexDirection:'column', gap: 4, minWidth: 180
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color:
        c.spec === 'common' ? C.trans : c.spec === 't1' ? C.t1 : C.t2, letterSpacing: '0.04em'
      }}>{c.id} · {c.unit}</div>
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{c.name}</div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <Card hover={false}>
        <SectionTitle icon={GraduationCap} color={C.t1}>Parcours de formation</SectionTitle>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 999,
                background: `linear-gradient(135deg, ${C.t1}, ${C.trans})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 18, fontWeight: 800, color:'#fff'
              }}>M1</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.fg }}>Année 1 · 4e année</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
              {m1.map(c => <CourseChip key={c.id} c={c}/>)}
            </div>
          </div>

          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 999,
                background: `linear-gradient(135deg, ${C.trans}, ${C.t2})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 18, fontWeight: 800, color:'#fff'
              }}>M2</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.fg }}>Année 2 · 5e année</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
              {m2.map(c => <CourseChip key={c.id} c={c}/>)}
            </div>
          </div>
        </div>
      </Card>

      <Card hover={false}>
        <SectionTitle icon={Lightbulb} color={C.trans}>Soft skills développés</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {ss.map(s => (
            <div key={s.id} style={{
              padding: 16, borderRadius: 12,
              background: 'rgba(139,92,246,0.12)',
              border: `1px solid ${C.trans}44`
            }}>
              <div style={{ fontSize: 13, color: C.trans, fontWeight: 700, letterSpacing:'0.04em', marginBottom: 6 }}>
                {s.id} · via {s.courseId}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.fg, marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: 15, color: C.fgDim, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card hover={false} style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border:`1px solid ${C.t1}55` }}>
        <SectionTitle icon={Target} color={C.t1}>Projet / stage recommandé</SectionTitle>
        <p style={{ fontSize: 20, color: C.fg, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
          {job.recommended_project}
        </p>
      </Card>
    </div>
  );
};

const TabSkills = ({ job }) => {
  const ss = job.softskillIds.map(id => SS_BY_ID[id]).filter(Boolean);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24 }}>
      <Card hover={false}>
        <SectionTitle icon={Zap} color={C.t1}>Hard skills</SectionTitle>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 10 }}>
          {job.hard_skills.map((s, i) => (
            <div key={i} style={{
              padding:'10px 16px', borderRadius: 10,
              background: `${C.t1}1E`, color: C.fg,
              border: `1px solid ${C.t1}66`,
              fontSize: 17, fontWeight: 600
            }}>{s}</div>
          ))}
        </div>
      </Card>

      <Card hover={false}>
        <SectionTitle icon={Lightbulb} color={C.trans}>Soft skills</SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {ss.map(s => (
            <div key={s.id} style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(139,92,246,0.14)',
              border: `1px solid ${C.trans}55`,
              display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12
            }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.fg }}>{s.name}</div>
                <div style={{ fontSize: 14, color: C.muted }}>{s.desc}</div>
              </div>
              <Badge color={C.trans}>{s.courseId}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card hover={false} style={{ gridColumn: '1 / -1' }}>
        <SectionTitle icon={Trophy} color={C.warn}>Certifications pro recommandées</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap: 12 }}>
          {job.certifications.map((c, i) => (
            <div key={i} style={{
              padding: '14px 18px',
              background: 'rgba(245,158,11,0.12)',
              border: `1px solid ${C.warn}55`,
              borderRadius: 10,
              display:'flex', alignItems:'center', gap: 12
            }}>
              <BadgeCheck size={22} color={C.warn}/>
              <div style={{ fontSize: 17, color: C.fg, fontWeight: 600 }}>{c}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const TabCareer = ({ job, onSelectJob }) => {
  const evoSteps = job.evolution.split('→').map(s => s.trim());
  const countries = job.mobility.map(c => c.country);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <Card hover={false}>
        <SectionTitle icon={TrendingUp} color={C.success}>Évolution de carrière (3-5 ans +)</SectionTitle>
        <div style={{ display:'flex', alignItems:'center', gap: 4, flexWrap:'wrap' }}>
          {evoSteps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{
                padding:'12px 18px', borderRadius: 10,
                background: `linear-gradient(135deg, ${C.success}22, ${C.t1}22)`,
                border: `1px solid ${C.success}55`,
                fontSize: 17, fontWeight: 600, color: C.fg
              }}>{s}</div>
              {i < evoSteps.length-1 && <ArrowRight size={22} color={C.muted}/>}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card hover={false}>
        <SectionTitle icon={ArrowRight} color={C.t1}>Passerelles vers d'autres métiers</SectionTitle>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 10 }}>
          {job.passerelles.map(pid => {
            const p = JOB_BY_ID[pid];
            if (!p) return null;
            const pFam = FAMILIES[p.family];
            return (
              <button key={pid} onClick={() => onSelectJob(pid)}
                style={{
                  padding:'12px 18px', borderRadius: 10,
                  background: `${pFam.color}22`,
                  border: `1px solid ${pFam.color}66`,
                  color: C.fg, fontSize: 17, fontWeight: 600,
                  cursor:'pointer', fontFamily: FONT,
                  display:'flex', alignItems:'center', gap: 8
                }}
              >
                <ArrowRight size={16} color={pFam.color}/>
                {p.name}
              </button>
            );
          })}
        </div>
      </Card>

      <Card hover={false}>
        <SectionTitle icon={Globe} color={C.trans}>Mobilité européenne</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 24, alignItems:'center' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {job.mobility.map((c, i) => {
              const info = EU_COUNTRIES[c.country];
              return (
                <div key={i} style={{
                  display:'grid', gridTemplateColumns:'56px 1fr auto',
                  gap: 14, padding: 16, alignItems:'center',
                  background: C.bgDeep, borderRadius: 12,
                  border: `1px solid ${C.border}`
                }}>
                  <div style={{ fontSize: 36 }}>{c.flag}</div>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: C.fg }}>{info?.name || c.country}</div>
                    <div style={{ fontSize: 14, color: C.muted }}>Langue de travail : {c.work_lang}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: C.success, letterSpacing:'-0.02em' }}>
                      {c.salary_median}k€
                    </div>
                    <Badge color={C.success}>Facile</Badge>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <EuropeMap highlighted={countries} />
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================
   SCREEN 4 — MATRIX (Matière → Métiers)
   ============================================================ */

const MatrixScreen = ({ onSelectJob, preselectedCourseId }) => {
  const [selectedCourse, setSelectedCourse] = useState(preselectedCourseId || 'M1PYML');

  useEffect(() => {
    if (preselectedCourseId) setSelectedCourse(preselectedCourseId);
  }, [preselectedCourseId]);

  const groups = useMemo(() => {
    const m1Common = COURSES.filter(c => c.year==='M1' && c.spec==='common');
    const m1T1     = COURSES.filter(c => c.year==='M1' && c.spec==='t1');
    const m1T2     = COURSES.filter(c => c.year==='M1' && c.spec==='t2');
    const m2Common = COURSES.filter(c => c.year==='M2' && c.spec==='common' && c.unit==='U1');
    const m2U2T1   = COURSES.filter(c => c.year==='M2' && c.spec==='t1' && c.unit==='U2');
    const m2U2T2   = COURSES.filter(c => c.year==='M2' && c.spec==='t2' && c.unit==='U2');
    const m2U3T1   = COURSES.filter(c => c.year==='M2' && c.spec==='t1' && c.unit==='U3');
    const m2U3T2   = COURSES.filter(c => c.year==='M2' && c.spec==='t2' && c.unit==='U3');
    return { m1Common, m1T1, m1T2, m2Common, m2U2T1, m2U2T2, m2U3T1, m2U3T2 };
  }, []);

  const linkedJobs = useMemo(() => {
    return JOBS
      .map(j => {
        const allCourses = [...j.courseIds_m1, ...j.courseIds_m2];
        const count = allCourses.filter(c => c === selectedCourse).length;
        const totalWeight = allCourses.length;
        if (count === 0) return null;
        const importance = count / totalWeight;
        return { job: j, importance };
      })
      .filter(Boolean)
      .sort((a,b) => b.importance - a.importance);
  }, [selectedCourse]);

  const CourseBtn = ({ c }) => {
    const active = selectedCourse === c.id;
    const color = c.spec === 'common' ? C.trans : c.spec === 't1' ? C.t1 : C.t2;
    return (
      <button onClick={() => setSelectedCourse(c.id)}
        style={{
          width: '100%', textAlign:'left', padding:'12px 14px',
          background: active ? `${color}33` : C.bgElev,
          border: `1px solid ${active ? color : C.border}`,
          borderRadius: 10, color: C.fg, cursor:'pointer',
          marginBottom: 6, fontFamily: FONT,
          display:'flex', justifyContent:'space-between', alignItems:'center', gap: 10
        }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color, letterSpacing:'0.03em' }}>
            {c.id} · {c.unit}
          </div>
          <div style={{ fontSize: 16, fontWeight: active ? 700 : 500, marginTop: 2 }}>{c.name}</div>
        </div>
        {c.days > 0 && <div style={{ fontSize: 14, color: C.muted, whiteSpace:'nowrap' }}>{c.days}j</div>}
      </button>
    );
  };

  const SubHead = ({ children, color }) => (
    <div style={{
      fontSize: 16, color, fontWeight: 800, letterSpacing:'0.06em',
      textTransform:'uppercase', margin:'20px 0 10px 0', paddingBottom: 6,
      borderBottom: `1px solid ${color}44`
    }}>{children}</div>
  );

  const selected = COURSE_BY_ID[selectedCourse];

  return (
    <div style={{ padding:'32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, margin: 0, color: C.fg, letterSpacing:'-0.02em' }}>
          D'une <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 2 }}>matière</span> aux métiers
        </h1>
        <p style={{ fontSize: 19, color: C.fgDim, marginTop: 10 }}>
          Cliquez sur une matière pour voir à quels métiers elle prépare.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', gap: 24, alignItems:'start' }}>
        <Card hover={false} style={{ maxHeight:'75vh', overflowY:'auto' }}>
          <SectionTitle icon={BookOpen} color={C.t1}>Matières M1 & M2</SectionTitle>

          <SubHead color={C.trans}>M1 — Tronc commun</SubHead>
          {groups.m1Common.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t1}>M1 — Spé IA / Data (T1)</SubHead>
          {groups.m1T1.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t2}>M1 — Spé Cybersécurité (T2)</SubHead>
          {groups.m1T2.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.trans}>M2 — Tronc commun (U1)</SubHead>
          {groups.m2Common.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t1}>M2 U2 — Spé IA / Data</SubHead>
          {groups.m2U2T1.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t2}>M2 U2 — Spé CyberSécu</SubHead>
          {groups.m2U2T2.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t1}>M2 U3 — IA / Data</SubHead>
          {groups.m2U3T1.map(c => <CourseBtn key={c.id} c={c}/>)}

          <SubHead color={C.t2}>M2 U3 — CyberSécu</SubHead>
          {groups.m2U3T2.map(c => <CourseBtn key={c.id} c={c}/>)}
        </Card>

        <Card hover={false}>
          <SectionTitle icon={Target} color={C.success}>
            Métiers qui exploitent <span style={{ color: C.t1 }}>{selected?.id}</span>
          </SectionTitle>

          <div style={{ padding: 16, background: C.bgDeep, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.fg }}>{selected?.name}</div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
              {selected?.year} · {selected?.unit} · {selected?.days > 0 ? selected?.days+' jours' : 'transversal'}
            </div>
          </div>

          {linkedJobs.length === 0 ? (
            <div style={{ color: C.muted, padding: 24, textAlign:'center' }}>
              Aucun métier n'exploite spécifiquement cette matière dans notre mapping.
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {linkedJobs.map(({ job, importance }) => {
                const fam = FAMILIES[job.family];
                const FamIcon = fam.icon;
                const isMain = importance > 0.15;
                return (
                  <button key={job.id} onClick={() => onSelectJob(job.id)}
                    style={{
                      padding: 14, borderRadius: 12,
                      background: isMain ? `${fam.color}28` : `${fam.color}0F`,
                      border: `1px solid ${fam.color}${isMain?'88':'44'}`,
                      textAlign:'left', cursor:'pointer', fontFamily: FONT,
                      display:'flex', flexDirection:'column', gap: 8,
                      opacity: isMain ? 1 : 0.75
                    }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10, justifyContent:'space-between' }}>
                      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                        <FamIcon size={18} color={fam.color}/>
                        <div style={{ fontSize: 13, fontWeight: 700, color: fam.color, letterSpacing:'0.03em' }}>
                          {fam.label}
                        </div>
                      </div>
                      {isMain && <Star size={16} color={C.warn} fill={C.warn}/>}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.fg }}>{job.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap: 10, fontSize: 14, color: C.fgDim }}>
                      <span style={{ color: C.success, fontWeight: 700 }}>{job.salary.senior}k€</span>
                      <TensionBadge tension={job.market_tension} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 5 — COMPARE (2-3 métiers côte à côte)
   ============================================================ */

const CompareScreen = () => {
  const [picks, setPicks] = useState(['j1', 'j11', 'j20']); // Data Scientist, Pentester, Architecte Cloud

  const cmp = picks.map(id => JOB_BY_ID[id]).filter(Boolean);

  const rows = [
    { label:'Titre RNCP',    get: (j) => jobTitleLabel(j), color: jobTitleColor },
    { label:'Tension',       get: (j) => j.market_tension, render: (j) => <TensionBadge tension={j.market_tension} /> },
    { label:'Télétravail',   get: (j) => j.remote },
    { label:'Top 3 hard skills', get: (j) => j.hard_skills.slice(0,3).join(' · ') },
    { label:'Top 3 certifs',    get: (j) => j.certifications.slice(0,3).join(' · ') },
    { label:'Mobilité EU (top 3)', get: (j) => j.mobility.slice(0,3).map(c => `${c.flag} ${EU_COUNTRIES[c.country]?.name || c.country} (${c.salary_median}k)`).join(' · ') }
  ];

  const maxSalary = Math.max(...cmp.map(j => j.salary.senior), 1);

  return (
    <div style={{ padding:'32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, margin: 0, color: C.fg, letterSpacing:'-0.02em' }}>
          <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 2 }}>Comparer</span> 2 à 3 métiers
        </h1>
        <p style={{ fontSize: 19, color: C.fgDim, marginTop: 10 }}>
          Sélectionnez des métiers pour les comparer côte à côte.
        </p>
      </div>

      {/* Selector row */}
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${picks.length}, 1fr)`, gap: 16, marginBottom: 24 }}>
        {picks.map((pid, idx) => (
          <select key={idx} value={pid}
            onChange={(e) => {
              const next = [...picks]; next[idx] = e.target.value; setPicks(next);
            }}
            style={{
              padding: '14px 16px', borderRadius: 12,
              background: C.bgDeep, color: C.fg,
              border: `1px solid ${C.border}`, fontSize: 17, fontWeight: 600,
              fontFamily: FONT, outline:'none', cursor:'pointer'
            }}>
            {JOBS.map(j => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Columns */}
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${cmp.length}, 1fr)`, gap: 16 }}>
        {cmp.map((j, i) => {
          const fam = FAMILIES[j.family];
          const FamIcon = fam.icon;
          return (
            <Card key={j.id} hover={false} style={{ display:'flex', flexDirection:'column', gap: 16 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
                  <FamIcon size={22} color={fam.color}/>
                  <Badge color={fam.color}>{fam.label}</Badge>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.fg, margin: 0, letterSpacing:'-0.01em', lineHeight: 1.2 }}>
                  {j.name}
                </h3>
              </div>

              {/* Salary */}
              <div style={{ padding: 14, background: C.bgDeep, borderRadius: 12 }}>
                <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, marginBottom: 10 }}>Rémunération</div>
                {[
                  { k:'junior', label:'Junior', color: '#60A5FA' },
                  { k:'confirmed', label:'Confirmé', color: '#3B82F6' },
                  { k:'senior', label:'Senior', color: C.success }
                ].map(s => (
                  <div key={s.k} style={{ marginBottom: 8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize: 15, color: C.fgDim, marginBottom: 4 }}>
                      <span>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: 800 }}>{j.salary[s.k]}k€</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(148,163,184,0.15)', borderRadius: 999 }}>
                      <div style={{
                        width: `${(j.salary[s.k]/maxSalary)*100}%`,
                        height:'100%', background: s.color,
                        borderRadius: 999
                      }}/>
                    </div>
                  </div>
                ))}
              </div>

              {rows.map(r => (
                <div key={r.label}>
                  <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom: 6 }}>
                    {r.label}
                  </div>
                  {r.render ? r.render(j) : (
                    <div style={{ fontSize: 16, color: C.fg, lineHeight: 1.5 }}>{r.get(j)}</div>
                  )}
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN 6 — RECOGNITION (Diplôme)
   ============================================================ */

const RecognitionScreen = () => {
  const euHighlighted = ['DE','BE','ES','IT','PT','NL','LU','CH','SE','DK','FI'];

  const recognitions = [
    { icon: GraduationCap, label: '300 ECTS',        sub: 'Crédits cumulés Bac+5',          color: C.t1 },
    { icon: Globe,         label: 'EQF Niveau 7',    sub: 'Cadre Européen des Certifications', color: C.trans },
    { icon: BookOpenCheck, label: 'Processus Bologne', sub: 'Équivalence Master européen',     color: C.t2 },
    { icon: Scale,         label: 'Référentiel ESCO',sub: 'Compétences reconnues UE',         color: C.success }
  ];

  const credibility = ['CFA','Qualiopi','France Compétences','Campus Cyber','Parcoursup','+15 ans d\'expérience'];

  return (
    <div style={{ padding:'32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      <div style={{ textAlign:'center', marginBottom: 40 }}>
        <h1 style={{
          fontSize: 42, fontWeight: 900, margin: 0, letterSpacing:'-0.02em', color: C.fg
        }}>
          Votre <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 3 }}>Bac+5</span> reconnu en Europe
        </h1>
        <p style={{ fontSize: 22, color: C.fgDim, marginTop: 8 }}>
          Ouvrez-vous les portes du marché européen au niveau Master (Bac+5).
        </p>
      </div>

      {/* Central badge */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom: 40 }}>
        <div style={{
          padding: '28px 56px',
          background: `linear-gradient(135deg, ${C.t1}, ${C.trans}, ${C.t2})`,
          borderRadius: 24,
          boxShadow: `0 12px 48px ${C.trans}44, 0 0 80px ${C.t1}33`,
          display:'flex', alignItems:'center', gap: 20
        }}>
          <Crown size={48} color="#fff" />
          <div>
            <div style={{ fontSize: 18, color:'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
              RNCP Niveau 7
            </div>
            <div style={{ fontSize: 32, color:'#fff', fontWeight: 800, letterSpacing:'-0.02em', marginTop: 2 }}>
              = Master Européen
            </div>
          </div>
        </div>
      </div>

      {/* Reinforcement badge */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom: 36 }}>
        <div style={{
          padding: '14px 28px',
          background: 'rgba(139,92,246,0.14)',
          border: `1px solid ${C.trans}66`,
          borderRadius: 999,
          fontSize: 19, fontWeight: 700, color: C.fg,
          display:'flex', alignItems:'center', gap: 12,
          boxShadow: `0 4px 20px ${C.trans}22`
        }}>
          <Globe size={22} color={C.trans}/>
          Reconnu dans 49 pays · Processus de Bologne + accords internationaux
        </div>
      </div>

      {/* 2x2 grid of recognitions */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(2,1fr)',
        gap: 20, maxWidth: 1000, margin: '0 auto 40px auto'
      }}>
        {recognitions.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} hover={false} style={{
              display:'flex', alignItems:'center', gap: 20,
              background: `linear-gradient(135deg, ${r.color}22, transparent)`,
              border: `1px solid ${r.color}55`
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: `${r.color}33`, color: r.color,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow: `0 0 24px ${r.color}44`
              }}>
                <Icon size={42} />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.fg, letterSpacing:'-0.01em' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 17, color: C.fgDim, marginTop: 4 }}>{r.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Europe map */}
      <Card hover={false} style={{ maxWidth: 900, margin: '0 auto 24px auto' }}>
        <SectionTitle icon={Globe} color={C.trans}>Mobilité directe — 11 marchés cibles IT / francophonie</SectionTitle>
        <p style={{ fontSize: 16, color: C.fgDim, margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Ces pays sont notre shortlist pour l'emploi IT et les salaires connus. Le diplôme reste reconnu dans l'ensemble des 49 pays signataires du Processus de Bologne.
        </p>
        <div style={{ display:'flex', justifyContent:'center' }}>
          <EuropeMap highlighted={euHighlighted} size="lg" />
        </div>
      </Card>

      {/* Beyond Europe */}
      <Card hover={false} style={{ maxWidth: 900, margin: '0 auto 32px auto' }}>
        <SectionTitle icon={Globe} color={C.success}>Au-delà de l'Europe</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 15, color: C.success, fontWeight: 800, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom: 12 }}>
              Accords bilatéraux France
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {[
                { flag: '🇨🇦', name: 'Québec', note: 'Entente France-Québec' },
                { flag: '🇲🇦', name: 'Maroc', note: 'Accord bilatéral' },
                { flag: '🇹🇳', name: 'Tunisie', note: 'Accord bilatéral' },
                { flag: '🇩🇿', name: 'Algérie', note: 'Accord bilatéral' },
                { flag: '🇱🇧', name: 'Liban', note: 'Accord bilatéral' }
              ].map((c, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 12,
                  padding: '10px 14px',
                  background: 'rgba(16,185,129,0.12)',
                  border: `1px solid ${C.success}44`,
                  borderRadius: 10
                }}>
                  <span style={{ fontSize: 26 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.fg }}>{c.name}</div>
                    <div style={{ fontSize: 14, color: C.muted }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 15, color: C.t1, fontWeight: 800, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom: 12 }}>
              Reconnaissance sur dossier
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
              {[
                { flag: '🇺🇸', name: 'États-Unis', note: 'via WES / ECE' },
                { flag: '🇨🇦', name: 'Canada (hors Québec)', note: 'via WES' },
                { flag: '🇦🇺', name: 'Australie', note: 'via AEI-NOOSR' },
                { flag: '🇦🇪', name: 'Émirats Arabes Unis', note: 'Évaluation ministérielle' },
                { flag: '🇸🇬', name: 'Singapour', note: 'Évaluation dossier' },
                { flag: '🌍', name: 'CAMES (19 pays)', note: 'Afrique francophone · procédure PRED' },
                { flag: '🗺️', name: '100+ pays', note: 'ENIC-NARIC + WES + agences d\'évaluation' }
              ].map((c, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap: 12,
                  padding: '10px 14px',
                  background: `${C.t1}1A`,
                  border: `1px solid ${C.t1}44`,
                  borderRadius: 10
                }}>
                  <span style={{ fontSize: 26 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.fg }}>{c.name}</div>
                    <div style={{ fontSize: 14, color: C.muted }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Credibility badges */}
      <div style={{ display:'flex', flexWrap:'wrap', gap: 12, justifyContent:'center', marginBottom: 24 }}>
        {credibility.map((c, i) => (
          <div key={i} style={{
            padding: '12px 22px',
            background: C.bgElev,
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            fontSize: 17, fontWeight: 700, color: C.fg,
            display:'flex', alignItems:'center', gap: 8
          }}>
            <BadgeCheck size={18} color={C.success} />
            {c}
          </div>
        ))}
      </div>

      {/* Sources */}
      <div style={{ textAlign:'center', color: C.muted, fontSize: 14, marginTop: 32 }}>
        Sources salaires : APEC Baromètre 2024 · Syntec Numérique 2024 · Glassdoor FR 2024-2025 · Robert Half 2025.
      </div>
    </div>
  );
};

/* ============================================================
   AFRICA MAP — stylized pastilles of key IT hubs
   ============================================================ */

const AFRICA_COUNTRIES = {
  MA: { name: 'Maroc',          flag: '🇲🇦', x: 150, y: 80,  city: 'Casablanca' },
  DZ: { name: 'Algérie',        flag: '🇩🇿', x: 245, y: 95,  city: 'Alger' },
  TN: { name: 'Tunisie',        flag: '🇹🇳', x: 310, y: 75,  city: 'Tunis' },
  EG: { name: 'Égypte',         flag: '🇪🇬', x: 430, y: 130, city: 'Le Caire' },
  SN: { name: 'Sénégal',        flag: '🇸🇳', x: 85,  y: 270, city: 'Dakar' },
  CI: { name: 'Côte d\'Ivoire', flag: '🇨🇮', x: 175, y: 340, city: 'Abidjan' },
  NG: { name: 'Nigeria',        flag: '🇳🇬', x: 285, y: 345, city: 'Lagos' },
  ET: { name: 'Éthiopie',       flag: '🇪🇹', x: 455, y: 320, city: 'Addis-Abeba' },
  KE: { name: 'Kenya',          flag: '🇰🇪', x: 460, y: 400, city: 'Nairobi' },
  RW: { name: 'Rwanda',         flag: '🇷🇼', x: 410, y: 410, city: 'Kigali' },
  ZA: { name: 'Afrique du Sud', flag: '🇿🇦', x: 355, y: 570, city: 'Johannesburg' },
  CM: { name: 'Cameroun',       flag: '🇨🇲', x: 325, y: 380, city: 'Douala' }
};

const AFRICA_SHAPE = "M130,60 L250,45 L340,55 L440,90 L500,135 L520,210 L525,300 L510,380 L470,460 L420,530 L360,600 L300,620 L240,585 L200,520 L170,440 L140,360 L110,275 L85,195 L95,115 Z";

const AfricaMap = ({ highlighted = [] }) => {
  return (
    <svg viewBox="0 0 600 680" width="100%" style={{ maxWidth: 560, display:'block' }}>
      <defs>
        <radialGradient id="afBg" cx="50%" cy="45%" r="55%">
          <stop offset="0%"  stopColor={C.pink} stopOpacity="0.08" />
          <stop offset="100%" stopColor={C.bgDeep} stopOpacity="0" />
        </radialGradient>
        <filter id="afGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d={AFRICA_SHAPE} fill="url(#afBg)" stroke={C.border} strokeWidth="1" strokeDasharray="4 6" opacity="0.7"/>
      {Object.entries(AFRICA_COUNTRIES).map(([code, c]) => {
        const on = highlighted.includes(code);
        return (
          <g key={code} transform={`translate(${c.x},${c.y})`}>
            <rect
              x={-34} y={-22} width={68} height={44}
              rx={8}
              fill={on ? `${C.pink}33` : `${C.bgElev}cc`}
              stroke={on ? C.pink : C.border}
              strokeWidth={on ? 2 : 1}
              filter={on ? 'url(#afGlow)' : undefined}
            />
            <text x={0} y={-2} textAnchor="middle" fontSize={22} dominantBaseline="middle">{c.flag}</text>
            <text x={0} y={16} textAnchor="middle" fontSize={11} fontWeight="700" fill={on ? C.pink : C.muted}>{code}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ============================================================
   SCREEN 7 — HORIZON (conclusion / prospective)
   ============================================================ */

const HorizonScreen = () => {
  const forces = [
    { icon: Atom,    title: 'Informatique quantique', desc: "Émergence de nouveaux métiers : Quantum Engineer, QML Specialist. Horizon 5-10 ans sur les cas d'usage industriels.", color: C.t1 },
    { icon: Cpu,     title: 'IA générative mature',   desc: "Déjà dans le programme (M2IAAV). La vague continue : agents autonomes, multi-modal, AI engineering à grande échelle.", color: C.trans },
    { icon: Leaf,    title: 'Code éco-responsable',   desc: "Transition du Python vers Go/Rust pour l'automatisation (infra, cyber). Future régulation verte possible.", color: C.success },
    { icon: Anchor,  title: 'Clouds souverains',      desc: "France (S3NS, OVHcloud), UE (Gaia-X), Afrique (SENUM au Sénégal, Cloud Maroc). Nouvelle couche géopolitique du SI.", color: C.pink }
  ];

  const africaPoints = [
    { big: '45 000 km', small: 'fibre (câble Meta 2Africa encercle le continent)' },
    { big: '×2',        small: 'marché data centers d\'ici 2028' },
    { big: '19 pays',   small: 'CAMES — équivalence via procédure PRED' },
    { big: '100 %+',    small: 'croissance des besoins IT / cyber / data' }
  ];

  const ancre = [
    { icon: Gauge,       title: 'Fondamentaux',      desc: 'Maths, algorithmes, réseau, sécurité — transversaux et durables' },
    { icon: Lightbulb,   title: 'Soft skills',       desc: 'Leadership, éthique, communication : ne périment pas' },
    { icon: BookOpenCheck, title: 'Apprendre à apprendre', desc: 'La vraie compétence qui traverse les vagues technologiques' }
  ];

  const africaHubs = ['MA','DZ','TN','EG','SN','CI','NG','KE','ZA','RW','ET','CM'];

  return (
    <div style={{ padding:'32px 48px', fontFamily: FONT, minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ textAlign:'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: C.fg, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Au-delà des 27 métiers — <span style={{ borderBottom: `4px solid ${C.pink}`, paddingBottom: 3 }}>l'horizon à 10 ans</span>
        </h1>
        <p style={{ fontSize: 22, color: C.fgDim, marginTop: 14, fontWeight: 500 }}>
          Cette galaxie est une photographie d'aujourd'hui. Voici ce qui va la transformer.
        </p>
      </div>

      {/* Photographie à 2-3 ans */}
      <Card hover={false} style={{ maxWidth: 1080, margin: '0 auto 28px auto' }}>
        <SectionTitle icon={Gauge} color={C.cyan}>Une photographie à 2-3 ans</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <Stat icon={Target}  value="2-3 ans" label="horizon de pertinence stable"  color={C.t1} />
          <Stat icon={Rocket}  value="5+ ans"  label="transformations majeures attendues" color={C.pink} />
          <Stat icon={Gauge}   value="1×/an"   label="programme ré-aligné par l'école"    color={C.cyan} />
        </div>
        <div style={{
          padding: 18, background: C.bgDeep, borderRadius: 8,
          borderLeft: `3px solid ${C.success}`
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.success, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom: 8 }}>
            Exemple concret
          </div>
          <div style={{ fontSize: 18, color: C.fg, lineHeight: 1.5 }}>
            <strong style={{ color: C.pink }}>Python → Go</strong> pour l'automatisation infra et cyber. Go est éco-compatible, plus performant, et pourrait devenir un standard imposé demain par la réglementation verte.
          </div>
        </div>
      </Card>

      {/* Forces de transformation */}
      <div style={{ maxWidth: 1080, margin: '0 auto 28px auto' }}>
        <div style={{ textAlign:'center', marginBottom: 20 }}>
          <span style={{
            fontSize: 13, color: C.pink, fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            borderBottom: `2px solid ${C.pink}`, paddingBottom: 4
          }}>
            Forces qui transforment les métiers IT
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
          {forces.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{
                padding: 22, borderRadius: 10,
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${f.color}`,
                display:'flex', gap: 16, alignItems:'flex-start'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                  background: `${f.color}22`, color: f.color,
                  display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <Icon size={28}/>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.fg, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 16, color: C.fgDim, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Afrique */}
      <Card hover={false} style={{ maxWidth: 1080, margin: '0 auto 28px auto' }}>
        <SectionTitle icon={Globe} color={C.pink}>L'Afrique — grand terrain d'opportunité</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 28, alignItems:'center' }}>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <AfricaMap highlighted={africaHubs}/>
          </div>
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 20 }}>
              {africaPoints.map((p, i) => (
                <div key={i} style={{
                  padding: 16, borderRadius: 10,
                  background: C.bgDeep,
                  borderLeft: `3px solid ${C.pink}`
                }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.fg, letterSpacing:'-0.02em' }}>{p.big}</div>
                  <div style={{ fontSize: 14, color: C.muted, marginTop: 6, lineHeight: 1.35 }}>{p.small}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: 16, background: C.bgDeep, borderRadius: 8,
              borderLeft: `3px solid ${C.cyan}`
            }}>
              <div style={{ fontSize: 17, color: C.fg, lineHeight: 1.55 }}>
                L'Afrique cumule <strong style={{ color: C.pink }}>énergie renouvelable abondante</strong> (solaire, hydro, éolien), <strong style={{ color: C.pink }}>fibre massive</strong> (Google Equiano, Meta 2Africa) et <strong style={{ color: C.pink }}>forte demande IT non servie</strong> → marché porteur pour les diplômés francophones.
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Ce qui ne change pas */}
      <Card hover={false} style={{ maxWidth: 1080, margin: '0 auto 28px auto' }}>
        <SectionTitle icon={Anchor} color={C.success}>Ce qui ne change pas</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 14 }}>
          {ancre.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{
                padding: 18, borderRadius: 10,
                background: C.bgDeep,
                border: `1px solid ${C.border}`,
                textAlign: 'center'
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: `${C.success}22`, color: C.success,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin: '0 auto 14px auto'
                }}>
                  <Icon size={28}/>
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, color: C.fg, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 15, color: C.fgDim, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Closing */}
      <div style={{ textAlign:'center', maxWidth: 900, margin: '0 auto', padding: '8px 24px 24px 24px' }}>
        <div style={{
          fontSize: 24, fontWeight: 800, color: C.fg, lineHeight: 1.4, letterSpacing:'-0.01em'
        }}>
          Votre <span style={{ borderBottom: `3px solid ${C.pink}`, paddingBottom: 2 }}>Bac+5</span> est une clé qui ouvre bien plus que les 27 portes présentées.
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginTop: 12 }}>
          École IT ré-aligne son programme chaque année pour que cette clé reste valide.
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   INTRO MODAL — first-load overview popup
   ============================================================ */

const IntroModal = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // École IT–inspired neon accents on dark navy
  const PINK = '#FF2891';
  const CYAN = '#00D4FF';
  const NAVY_DEEP = '#0A0E1F';
  const NAVY_CARD = '#121734';
  const NAVY_BORDER = '#1E2750';
  const MUTED = '#8890B0';

  const stats = [
    { value: '27',     label: 'métiers',              accent: PINK, icon: Briefcase },
    { value: 'Bac+5',  label: 'RNCP Niveau 7',        accent: CYAN, icon: GraduationCap },
    { value: '77k€',   label: 'salaire senior moyen', accent: PINK, icon: Euro },
    { value: '49',     label: 'pays reconnus',        accent: CYAN, icon: Globe }
  ];

  const screens = [
    { icon: Sparkles,   title: 'Constellation',       desc: "27 métiers en un coup d'œil",               accent: PINK },
    { icon: LayoutGrid, title: 'Grille',              desc: 'Filtrer par salaire, tension, famille',     accent: CYAN },
    { icon: User,       title: 'Fiche métier',        desc: 'Parcours, compétences, évolution',          accent: PINK },
    { icon: BookOpen,   title: 'Matière → Métiers',   desc: 'Comment les cours préparent chaque métier', accent: CYAN },
    { icon: GitCompare, title: 'Comparaison',         desc: '2-3 métiers côte à côte',                   accent: PINK },
    { icon: Award,      title: 'Reconnaissance',      desc: 'Votre Bac+5 reconnu en Europe',             accent: CYAN },
    { icon: Compass,    title: 'Horizon',             desc: 'Quantique, IA, Afrique, clouds souverains', accent: PINK }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(2,6,23,0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 350ms ease',
        fontFamily: FONT
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960, width: '100%',
          maxHeight: '92vh', overflowY: 'auto',
          background: NAVY_DEEP,
          border: `1px solid ${NAVY_BORDER}`,
          borderRadius: 12,
          position: 'relative',
          boxShadow: '0 32px 100px rgba(0,0,0,0.7)'
        }}
      >
        {/* Top neon accent bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${PINK} 0%, ${PINK} 50%, ${CYAN} 50%, ${CYAN} 100%)`
        }}/>

        {/* Binary pattern decoration strip */}
        <div style={{
          position: 'absolute', top: 4, left: 0, right: 0, height: 80,
          background: `repeating-linear-gradient(90deg, transparent 0 22px, ${CYAN}0A 22px 24px)`,
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent)',
          pointerEvents: 'none'
        }}/>

        <div style={{ padding: '44px 48px 40px 48px', position: 'relative' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            title="Fermer (Échap)"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 38, height: 38, borderRadius: 8,
              background: 'transparent',
              border: `1px solid ${NAVY_BORDER}`,
              color: '#F8FAFC', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.color = PINK; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.color = '#F8FAFC'; }}
          >
            <X size={20}/>
          </button>

          {/* School logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img
              src="./logo.svg"
              alt="École IT"
              style={{ height: 60, width: 'auto', marginBottom: 22, display:'inline-block' }}
            />

            {/* Headline — solid white, pink underline on key word */}
            <h1 style={{
              fontSize: 44, fontWeight: 900, margin: 0, lineHeight: 1.14,
              letterSpacing: '-0.025em', color: '#F8FAFC'
            }}>
              <span style={{
                borderBottom: `4px solid ${PINK}`,
                paddingBottom: 3
              }}>27 métiers</span>{' '}pour construire<br/>votre avenir numérique
            </h1>
            <p style={{ fontSize: 19, color: MUTED, marginTop: 18, fontWeight: 500 }}>
              Bac+5 · Master européen · Reconnu dans{' '}
              <span style={{ color: '#F8FAFC', fontWeight: 700, borderBottom: `2px solid ${CYAN}`, paddingBottom: 1 }}>49 pays</span>
            </p>
          </div>

          {/* Stats — flat cards with left accent bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12, marginBottom: 36
          }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{
                  padding: '18px 16px 18px 18px',
                  borderRadius: 8,
                  background: NAVY_CARD,
                  borderLeft: `3px solid ${s.accent}`,
                  border: `1px solid ${NAVY_BORDER}`,
                  borderLeftWidth: 3,
                  borderLeftColor: s.accent
                }}>
                  <Icon size={18} color={s.accent} style={{ marginBottom: 8 }}/>
                  <div style={{
                    fontSize: 30, fontWeight: 900, color: '#F8FAFC',
                    letterSpacing: '-0.02em', lineHeight: 1
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 6, fontWeight: 500, lineHeight: 1.3 }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section heading with pink underline */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <span style={{
              fontSize: 13, color: PINK, fontWeight: 800,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              borderBottom: `2px solid ${PINK}`, paddingBottom: 4
            }}>
              Ce que vous allez explorer
            </span>
          </div>

          {/* Screen grid — flat cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            marginBottom: 34
          }}>
            {screens.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 8,
                  background: NAVY_CARD,
                  border: `1px solid ${NAVY_BORDER}`,
                  transition: 'border-color 150ms'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = s.accent + '99'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = NAVY_BORDER}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: `${s.accent}18`,
                    border: `1px solid ${s.accent}55`,
                    color: s.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18}/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.35 }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA — solid pink fill, flat */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '17px 40px',
                fontSize: 16, fontWeight: 800, fontFamily: FONT,
                background: PINK,
                color: '#fff', border: 'none', borderRadius: 8,
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                boxShadow: `0 6px 20px ${PINK}66`,
                transition: 'all 180ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 28px ${PINK}AA`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${PINK}66`;
              }}
            >
              Commencer la présentation
              <ChevronRight size={20}/>
            </button>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 18 }}>
              Raccourcis : <strong style={{ color: '#F8FAFC' }}>1-7</strong> naviguer · <strong style={{ color: '#F8FAFC' }}>←/→</strong> entre fiches · <strong style={{ color: '#F8FAFC' }}>i</strong> revoir l'intro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   APP — main container + routing + keyboard
   ============================================================ */

const App = () => {
  const [screen, setScreen] = useState('constellation');
  const [selectedJobId, setSelectedJobId] = useState('j1');
  const [presentMode, setPresentMode] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [matrixCourseId, setMatrixCourseId] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const goto = (id) => { setScreen(id); setFadeKey(k => k+1); };
  const selectJob = (jobId) => {
    setSelectedJobId(jobId);
    goto('detail');
  };
  const navigateJob = (delta) => {
    const idx = JOBS.findIndex(j => j.id === selectedJobId);
    const next = (idx + delta + JOBS.length) % JOBS.length;
    setSelectedJobId(JOBS[next].id);
    setFadeKey(k => k+1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (showIntro) return;
      if (e.key.toLowerCase() === 'i') { setShowIntro(true); return; }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) { goto(SCREENS[num-1].id); return; }
      if (e.key === 'F11' || (e.ctrlKey && e.key.toLowerCase() === 'f')) {
        e.preventDefault();
        setPresentMode(p => !p);
        return;
      }
      if (screen === 'detail') {
        if (e.key === 'ArrowLeft')  navigateJob(-1);
        if (e.key === 'ArrowRight') navigateJob(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, selectedJobId, showIntro]);

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 10% 0%, ${C.pink}0D, transparent 55%),
                   radial-gradient(ellipse at 90% 100%, ${C.cyan}0D, transparent 55%),
                   ${C.bgDeep}`,
      color: C.fg,
      paddingTop: presentMode ? 0 : 74
    }}>
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      <Navbar current={screen} onChange={goto}
        onTogglePresent={() => setPresentMode(p => !p)}
        presentMode={presentMode} />

      <PresentModeToggle show={presentMode} onClick={() => setPresentMode(false)} />

      <div key={fadeKey} style={{ animation: 'fadeIn 300ms ease' }}>
        {screen === 'constellation' && <ConstellationScreen onSelectJob={selectJob} />}
        {screen === 'grid'          && <GridScreen onSelectJob={selectJob} />}
        {screen === 'detail'        && <JobDetailScreen jobId={selectedJobId}
                                         onSelectJob={selectJob}
                                         onNavigate={navigateJob} />}
        {screen === 'matrix'        && <MatrixScreen onSelectJob={selectJob}
                                         preselectedCourseId={matrixCourseId} />}
        {screen === 'compare'       && <CompareScreen />}
        {screen === 'recognition'   && <RecognitionScreen />}
        {screen === 'horizon'       && <HorizonScreen />}
      </div>

      {/* Footer */}
      {!presentMode && (
        <footer style={{
          padding: '24px 48px', marginTop: 32,
          borderTop: `1px solid ${C.border}`,
          fontSize: 13, color: C.muted, textAlign:'center',
          fontFamily: FONT
        }}>
          École IT · 27 métiers · Bac+5 · RNCP N7 · Sources : APEC 2024, Syntec 2024, Glassdoor 2024-2025, Robert Half 2025.
        </footer>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        body { margin: 0; background: ${C.bgDeep}; }
        *::-webkit-scrollbar { width: 10px; height: 10px; }
        *::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        *::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 6px; }
        *::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

/* ============================================================
   MOUNT
   ============================================================ */

const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);

export default App;
