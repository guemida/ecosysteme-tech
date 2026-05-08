/* PharmaCorp — cas d'étude fictif (écran 8 Entreprise).
   Statistiques globales, directions de l'entreprise, pôles de la DSI. */

import {
  Brain, Code, Shield, Cloud, Target,
  FlaskConical, Factory, ShoppingCart, Truck, Banknote, UsersRound, ServerCog
} from 'lucide-react';

export const PHARMA_STATS = [
  { value: '3 500',  label: 'collaborateurs',     color: '#3B82F6' },
  { value: '800 M€', label: 'CA annuel',          color: '#10B981' },
  { value: '50+',    label: 'pays',               color: '#8B5CF6' },
  { value: '350',    label: 'collaborateurs DSI', color: '#FF2891' }
];

export const PHARMA_DIRS = [
  { id: 'rd',  name: 'R&D',          icon: FlaskConical, color: '#06B6D4',
    desc: 'Recherche de nouvelles molécules, essais cliniques, brevets. C\'est le moteur d\'innovation du laboratoire.',
    headcount: '~900' },
  { id: 'prod',name: 'Production',   icon: Factory,      color: '#F97316',
    desc: 'Usines de fabrication des médicaments, contrôle qualité, conformité réglementaire (BPF, FDA).',
    headcount: '~1100' },
  { id: 'com', name: 'Commercial & Marketing', icon: ShoppingCart, color: '#EC4899',
    desc: 'Force de vente médicale, promotion, accès au marché, prix et remboursement.',
    headcount: '~600' },
  { id: 'sc',  name: 'Supply Chain', icon: Truck,        color: '#10B981',
    desc: 'Logistique mondiale, chaîne du froid, distribution, traçabilité des lots.',
    headcount: '~250' },
  { id: 'fin', name: 'Finance',      icon: Banknote,     color: '#F59E0B',
    desc: 'Comptabilité, contrôle de gestion, audit, relations investisseurs.',
    headcount: '~150' },
  { id: 'rh',  name: 'Ressources Humaines', icon: UsersRound, color: '#8B5CF6',
    desc: 'Recrutement, formation, paye, mobilité internationale, relations sociales.',
    headcount: '~150' },
  { id: 'dsi', name: 'DSI',          icon: ServerCog,    color: '#FF2891',
    desc: 'Direction des Systèmes d\'Information. Le système nerveux numérique : sans elle, plus rien ne tourne.',
    headcount: '350', isFocus: true }
];

export const DSI_POLES = [
  {
    id: 'infra', name: 'Infrastructure & Cloud', icon: Cloud, color: '#10B981',
    headcount: '~80',
    pitch: "Les fondations techniques : serveurs, réseaux, cloud AWS/Azure, data centers. Sans eux, aucune application ne tourne.",
    examples: [
      "Migration de 200 applications historiques vers le cloud (économie 30 % d'infra/an)",
      "Réseau international : 50 sites connectés en SD-WAN, latence <50 ms",
      "Cloud hybride pour la R&D : capacité de calcul élastique pour les essais cliniques"
    ],
    jobIds: ['j17','j18','j20','j21']
  },
  {
    id: 'data', name: 'Data & IA', icon: Brain, color: '#3B82F6',
    headcount: '~70',
    pitch: "L'or du laboratoire : valoriser les données cliniques, R&D, production pour accélérer la découverte de médicaments et personnaliser les traitements.",
    examples: [
      "IA de criblage : analyse 10 000 molécules par jour, identifie les candidats prometteurs en 1/10e du temps",
      "Plateforme data unifiée : 50 To de données cliniques exploitables temps réel",
      "ML pour la médecine personnalisée : prédire la réponse d'un patient au traitement"
    ],
    jobIds: ['j1','j2','j3','j4','j5','j6']
  },
  {
    id: 'cyber', name: 'Cybersécurité', icon: Shield, color: '#F97316',
    headcount: '~60',
    pitch: "Le rempart : protège la R&D (brevets), les données patients (RGPD), la production (sabotage) et la marque (réputation).",
    examples: [
      "SOC 24/7 : surveille 1,5 milliard d'événements/jour, neutralise 200+ attaques/mois",
      "Une fuite de données patients = jusqu'à 20 M€ d'amende RGPD + perte de confiance",
      "Brevets molécules : un vol = des années de R&D à la concurrence (valeur ~500 M€)"
    ],
    jobIds: ['j11','j12','j13','j14','j15','j16','j19','j22']
  },
  {
    id: 'dev', name: 'Développement & Applications', icon: Code, color: '#06B6D4',
    headcount: '~60',
    pitch: "Les bâtisseurs : conçoivent et maintiennent les applications métier (R&D, production, commercial, finance) qui font tourner l'entreprise.",
    examples: [
      "Portail visiteurs médicaux : 3 000 commerciaux équipés en mobilité",
      "ERP pharmaceutique sur mesure : suivi de chaque lot du laboratoire à la pharmacie",
      "Application essais cliniques : capture data multi-pays, conforme FDA"
    ],
    jobIds: ['j8','j9','j10']
  },
  {
    id: 'pmo', name: 'Projets & Transformation', icon: Target, color: '#8B5CF6',
    headcount: '~80',
    pitch: "Les chefs d'orchestre : pilotent les grands programmes IT, alignent la tech sur la stratégie, accompagnent le changement humain.",
    examples: [
      "Programme transformation digitale 50 M€ sur 3 ans",
      "DPO : conformité RGPD, registre des traitements, relations CNIL",
      "Engineering Manager : recrute et fait grandir les équipes tech (350 personnes)"
    ],
    jobIds: ['j7','j23','j24','j25','j27']
  }
];
