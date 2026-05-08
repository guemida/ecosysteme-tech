/* Taxonomy — Titres RNCP, familles métier, tension marché. */

import {
  Database, Brain, Code, Shield, Network, Cloud, Users,
  Flame, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { C } from '../theme.js';

export const TITLES = [
  { id: 't1', code: 'RNCP38822', niveau: 7, rome: 'M1805', color: C.t1,
    name: 'Expert en Architecture et Développement Logiciel',
    short: 'IA / Data' },
  { id: 't2', code: 'RNCP38823', niveau: 7, rome: 'M1801 · M1802 · M1810', color: C.t2,
    name: 'Expert en Architectures Systèmes, Réseaux et Sécurité',
    short: 'CyberSecu' }
];

export const FAMILIES = {
  data:       { label: 'Data',            color: '#3B82F6', icon: Database },
  ia:         { label: 'IA / ML',         color: '#8B5CF6', icon: Brain },
  dev:        { label: 'Développement',   color: '#06B6D4', icon: Code },
  sec:        { label: 'Cybersécurité',   color: '#F97316', icon: Shield },
  reseau:     { label: 'Réseaux',         color: '#EF4444', icon: Network },
  cloud:      { label: 'Cloud',           color: '#10B981', icon: Cloud },
  management: { label: 'Management IT',   color: '#EC4899', icon: Users }
};

export const TENSION = {
  penurie:   { label: 'Pénurie',    color: C.danger,  bg: 'rgba(239,68,68,0.18)',  icon: Flame },
  tendu:     { label: 'Tendu',      color: C.warn,    bg: 'rgba(245,158,11,0.18)', icon: AlertTriangle },
  equilibre: { label: 'Équilibré',  color: C.success, bg: 'rgba(16,185,129,0.18)', icon: CheckCircle2 }
};
