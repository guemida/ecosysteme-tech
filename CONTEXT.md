# Brief — Présentation interactive Bac+5 École IT

> Document de contexte à coller dans une nouvelle conversation Claude pour analyser, critiquer ou faire évoluer cette app sans avoir à relire le code.

---

## 1. Mission

App web React **single-file** servant d'**outil de présentation interactif** pour visioconférences Teams/Zoom. Le référent pédagogique d'**École IT** partage son écran et présente les **27 métiers IT accessibles** après un Bac+5 RNCP Niveau 7.

C'est à la fois un **outil d'information** (parcours, salaires, mobilité) et un **outil de vente** (effet "wow", choc des chiffres). Remplace un PowerPoint statique par une expérience interactive avec graphe, filtres, navigation clavier.

**Live** : `https://guemida.github.io/ecosysteme-tech/`
**Repo** : `https://github.com/guemida/ecosysteme-tech`

## 2. Cible

- **Prospects étudiants internationaux francophones** : veulent se projeter dans un métier + salaire
- **Parents** qui accompagnent : veulent être rassurés sur reconnaissance du diplôme + employabilité
- **Présentateur** : a besoin d'un outil fluide qui le rend crédible

## 3. Stack technique

| Couche | Choix | Raison |
|---|---|---|
| UI | React 18 single-file `app.jsx` | Contrainte spec : tout en un fichier |
| Build | esbuild → `app.js` minifié (113 KB) | Pas de Babel à la volée (gain ~2s au load) |
| Hosting | GitHub Pages (`index.html` + `app.js` statiques) | Simple, gratuit, fiable |
| Modules CDN | `esm.sh` via importmap : react, react-dom, d3, lucide-react | Pas de `node_modules` à committer |
| Graphe | D3.js v7 (force-directed simulation) | Constellation animée |
| Icônes | lucide-react | Stack icons cohérente |
| Polices | Twemoji Country Flags (78 KB local) + Segoe UI | Drapeaux visibles sur Windows (qui exclut les flags de Segoe UI Emoji) |
| Pas utilisé | Tailwind, Recharts, localStorage, backend | Inline styles partout pour contrôle pixel des tailles ≥16px |

**Build command** :
```bash
npx esbuild app.jsx --bundle --format=esm --outfile=app.js \
  --loader:.jsx=jsx --external:react --external:react/jsx-runtime \
  --external:react-dom --external:react-dom/client \
  --external:d3 --external:lucide-react \
  --target=es2020 --minify
```

## 4. Architecture du fichier `app.jsx` (~2700 lignes)

```
1. Imports (react, d3, lucide-react)
2. Constants (C theme, TITLES, FAMILIES, TENSION)
3. SOFTSKILLS (12 soft skills, chacun lié à un cours source)
4. COURSES (M1 + M2 + matières transversales)
5. EU_COUNTRIES (carte Europe stylisée)
6. JOBS (les 27 métiers, ~700 lignes)
7. Lookups & helpers
8. UI primitives (Card, Badge, TensionBadge, FamilyPill, SectionTitle, Stat, SalaryGauge)
9. EuropeMap (SVG simplifié)
10. SCREENS array + Navbar
11. ConstellationScreen (D3 force graph)
12. GridScreen (recherche + filtres)
13. JobDetailScreen (4 onglets)
14. MatrixScreen (matière → métiers)
15. CompareScreen (2-3 métiers côte à côte)
16. RecognitionScreen (reconnaissance diplôme)
17. AfricaMap + HorizonScreen (prospective)
18. IntroModal (popup au load)
19. App (router + raccourcis clavier)
20. Render (createRoot)
```

## 5. Les 7 écrans

| # | ID | Label | Raccourci | Rôle |
|---|---|---|---|---|
| 1 | `constellation` | Constellation | `1` | Hook visuel — graphe D3 avec 27 nœuds + 5 stats chocs |
| 2 | `grid` | Grille | `2` | Catalogue filtrable (titre, famille, tension, recherche texte) |
| 3 | `detail` | Fiche Métier | `3` | 4 onglets par métier : Aperçu / Parcours / Compétences / Carrière |
| 4 | `matrix` | Matière → Métiers | `4` | Vue croisée : clic sur un cours → métiers qui l'exploitent |
| 5 | `compare` | Comparaison | `5` | 2-3 métiers côte à côte (salaires, skills, mobilité) |
| 6 | `recognition` | Diplôme | `6` | Reconnaissance UE (Bologne 49 pays) + hors UE (CAMES, WES) |
| 7 | `horizon` | Horizon | `7` | Prospective 2026-2036 : forces transformation, gap marché, Afrique |

**Modale d'intro** (au 1er load, dismissible avec Échap/Entrée/clic) : logo École IT + 4 stats clés + grille des 7 écrans + CTA. Réouvrable avec touche `i`.

**Mode présentation** (`F11` ou `Ctrl+F`) : masque la navbar.

## 6. Données — les 27 métiers

Chaque métier (`JOBS[i]`) a :
```js
{
  id: 'j1',                // j1..j27
  name, short,             // long et compact pour constellation
  synonyms_fr, synonyms_en,
  family,                  // data | ia | dev | sec | reseau | cloud | management
  titleIds,                // ['t1'] | ['t2'] | ['t1','t2'] (transverse)
  seniority,
  code_rome,
  description,             // 3-4 phrases
  courseIds_m1,            // refs vers COURSES
  courseIds_m2,
  recommended_project,
  hard_skills: [],         // 5-8 items
  softskillIds,            // refs vers SOFTSKILLS (SS01..SS12)
  certifications,          // 3-4 certifs pro
  salary: { junior, confirmed, senior },  // k€ brut FR
  sectors,
  market_tension,          // 'penurie' | 'tendu' | 'equilibre'
  remote,                  // 'Hybride' | 'Full remote'
  mobility: [{country, flag, salary_median, work_lang, ease}],
  evolution,               // string "Lead → Director → CTO"
  passerelles              // refs vers d'autres jobs
}
```

**Répartition** :
- **Titre 1 — IA/Data (RNCP38822)** : 10 métiers (j1-j10) — Data Scientist, Data Engineer, ML Engineer, AI Engineer, Architecte Big Data, Lead Data Analyst, Consultant IA, Architecte Logiciel, Tech Lead, Full-Stack Senior
- **Titre 2 — CyberSecu (RNCP38823)** : 9 métiers (j11-j19) — Pentester, Analyste SOC, RSSI, Consultant Cyber, Auditeur ISO, Cloud Security, Architecte Réseaux, Ing. Sys/Rés, Expert Forensic
- **Transverses** (T1+T2) : 8 métiers (j20-j27) — Architecte Cloud, DevOps, DevSecOps, Consultant Transfo Num, Chef de Projet IT, DPO, Entrepreneur Tech, Engineering Manager

**Tension** : 12 en pénurie (rouge), 13 tendus (orange), 2 équilibrés (vert).

## 7. Données — Cours

**M1 (19 modules) — extraits du dossier `M1/` (syllabi HTML 2025-2026)** :
- U1 Tronc (7) : M1INTR, M1ARCH, M1QUAL, M1MODE, M1GESTI, M1PISC, M1PROJ
- U2 IA (3) : M1PYML, M1DASC, M1SPAR
- U2 Cyber (3) : M1CRYP, M1PENT, M1APPW
- U3 IA (3) : M1MLOP, M1DISTR, M1INNO
- U3 Cyber (3) : M1BLUR, M1SECUA, M1SPRO

**M2 (14 modules) — extraits du dossier `M2/` (syllabi HTML 2025-2026)** :
- U1 Tronc (6) : M2VEILL, M2GESTP, M2OFFR, M2INDU, M2PCAG, M2WEB3
- U2 IA (2) : M2GOUVD, M2STREA
- U2 Cyber (2) : M2PYTS, M2SECM
- U3 IA (2) : M2ETHI, M2IAAV
- U3 Cyber (2) : M2PENT, M2GOUVI

Tous **5 jours / 35h**. Le code module est **stable**, le nom complet à l'écran. Note : `M2GOUV` a été splité en `M2GOUVD` (Data, U2) et `M2GOUVI` (Infra, U3) pour résoudre une collision de code.

**Soft skills (12)** : SS01 Leadership, SS02 Storytelling Data, SS03 Esprit équipe Cyber, SS04 Innovation, SS05 Réflexion stratégique, SS06 Éthique pro, SS07 Intel. économique, SS08 Communication exécutive, SS09 Conformité, SS10 Gestion projet Agile, SS11 Prise de parole, SS12 Data Storytelling avancé.

## 8. Chiffres clés et sources

**Constellation (écran 1)** — 5 stats hook :
- **12** métiers en pénurie (calculé sur dataset)
- **77k€** salaire senior moyen (calculé)
- **300** crédits ECTS (standard Bac+5 européen)
- **424k** postes cyber à pourvoir en Europe — *ISC2 Workforce Study 2024*
- **+40 %/an** croissance rôles IA d'ici 2030 — *WEF Future of Jobs 2024*

**Reconnaissance (écran 6)** — chiffres factuels vérifiés :
- **49 pays** Processus de Bologne (EHEA, signataires)
- **11 pays** "marchés cibles" sur la carte Europe (UE/EEE/CH)
- **CAMES 19 pays** Afrique francophone — équivalence via procédure **PRED** (pas auto)
- **100+ pays** via ENIC-NARIC + WES + agences d'évaluation

**Horizon (écran 7)** — gap marché 4 chiffres sourcés :
- 424k postes cyber manquants — *ISC2 2024*
- +40 %/an IA — *WEF 2024*
- ~1M postes ICT à créer/an — *Commission UE Digital Decade*
- 12M transitions professionnelles 2030 — *McKinsey Future of Work*

**À vérifier (non-fait)** :
- Codes RNCP38822 / RNCP38823 actifs et non-expirés sur france-competences.fr
- "+15 ans d'expérience" école : à confirmer date de création

## 9. Design system

**Palette principale** :
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#0A0E1F` | Fond principal navy profond |
| `bgDeep` | `#050814` | Fond plus profond (boot, sub-cards) |
| `bgElev` | `#121734` | Cartes flat |
| `border` | `#1E2750` | Bordures |
| `fg` | `#F8FAFC` | Texte principal |
| `fgDim` | `#CBD5E1` | Texte secondaire |
| `muted` | `#8890B0` | Texte tertiaire (gris) |
| `pink` | `#FF2891` | Accent principal (CTA, soulignements headlines) |
| `cyan` | `#00D4FF` | Accent secondaire |
| `t1` | `#3B82F6` | **IA/Data** — bleu |
| `t2` | `#F97316` | **CyberSecu** — orange |
| `trans` | `#8B5CF6` | **Transverse** — violet |
| `success` | `#10B981` | Salaire, équilibré |
| `warn` | `#F59E0B` | Tendu |
| `danger` | `#EF4444` | Pénurie |

**7 familles métier** (couleurs sémantiques distinctes des accents chrome) : data (bleu), ia (violet), dev (cyan), sec (orange), reseau (rouge), cloud (vert), management (rose).

**Style** : flat-modern + accents néon (inspiré ecole-it.com), pas de glassmorphism, soulignements rose/cyan sur mots clés des H1 au lieu de gradient text.

**Typographie** :
- Police : `'Twemoji Country Flags', 'Segoe UI', system-ui, sans-serif`
- H1 : 38-44px, weight 900, lettre-spacing -0.02em
- H2 : 24px, weight 800
- Stats : 30-36px, weight 800-900
- Corps : **minimum 16px partout** (contrainte Teams 720p)
- Interligne : 1.5-1.6

**Composants UI clés** : `Card`, `Badge`, `TensionBadge`, `FamilyPill`, `SectionTitle`, `Stat`, `SalaryGauge`, `EuropeMap`, `AfricaMap`.

## 10. Contraintes spec

1. **Dark mode only** — pas de toggle light
2. **Lisibilité Teams 720p compressé** : font-size minimum 16px (10px-14px interdits)
3. **Couleurs vives saturées** (les pastels disparaissent en compression vidéo)
4. **6-9 éléments visibles à la fois** (pas plus)
5. **Marges généreuses** ≥32px, padding cartes ≥24px
6. **Contraste AAA** ≥7:1
7. **Données en dur** dans le fichier — pas de fetch
8. **Pas de localStorage**, pas de backend, pas de liens externes (logo École IT et drapeaux Twemoji téléchargés en local)
9. **Animations fluides** 300ms (pas de distractions pendant la présentation)
10. **Navigation slideshow** entre fiches (flèches ←/→)

## 11. Décisions importantes (historique)

- **Choix initial** : prompt complet → app entièrement reconstruite (commit `2e349d8`)
- **Performance** : Babel standalone trop lent → pré-transpilation esbuild (commit `3195a9c`, gain ~2s)
- **Branding** : Galaxia Métiers IT abandonné → identité 100% École IT (commit `b04edd7`)
- **Écran 7** : ajouté à la demande (Horizon, prospective 10 ans, commit `efa7044`)
- **Bug drapeaux** : Twemoji polyfill local pour Windows (commit `31eb469`)
- **Stats marché** : ajout 424k cyber + 40%/an IA en hook constellation (commit `cf4c388`)
- **Nomenclature M2** : prompt original obsolète → remap depuis dossier `M2/` (commit `5ccf92f`)
- **CAMES** : reclassé "reconnaissance sur dossier" (PRED), pas un accord bilatéral France

## 12. Red team — points faibles connus

**Risques majeurs (à adresser si possible)** :
1. **RNCP ≠ Master d'État** : objection FR fréquente, l'EQF 7 ne convainc pas toujours
2. **Salaires biaisés Île-de-France** : pas de fourchette régionale (un junior en province = 35k€)
3. **27 métiers = packaging** : Data Scientist / Data Engineer / ML Engineer = spectre continu
4. **CAMES PRED non-automatique** : équivalence cas par cas, taux de refus non-zéro
5. **ISC2 = vendeur de certifs** : biais commercial sur le 424k
6. **Angle mort IA vs juniors** : Cursor/Claude Code/Copilot absorbent les tâches juniors
7. **Aucun chiffre insertion pro** : pas de taux d'emploi à 6 mois, pas de logos d'employeurs
8. **Coût formation absent** : un parent demandera

**Risques modérés** :
9. Certifs senior (CISSP, AWS SAP) inaccessibles en sortie d'école
10. Afrique = opportunité long-terme, pas immédiate (10-15 ans)
11. "Python → Go éco-compatible" : affirmation sans source
12. SPOF sur esm.sh / GitHub Pages

**Risques mineurs** :
13. Pas responsive mobile (layout fixed desktop)
14. Pas d'export PDF / lien partage post-démo
15. Pas de témoignages alumni
16. Compression Teams peut écraser les soulignements 4px et dégradés subtils

## 13. Questions ouvertes / TODO suggérés

- [ ] Ajouter fourchettes salariales régionales (Paris / Province / EU) sur fiche métier
- [ ] Section "Insertion pro" avec taux emploi 6 mois + logos partenaires
- [ ] Paragraphe "IA et vos jobs juniors" : positionner l'école comme formation à *piloter* l'IA
- [ ] Témoignages alumni (3-4 quotes + photo + salaire 1er job)
- [ ] Mode export PDF / lien partage spécifique à un métier
- [ ] Vérifier validité RNCP38822/38823 sur france-competences.fr
- [ ] M1SPRO : nom à confirmer (HTML vide)
- [ ] Mobile/tablette responsive (actuellement desktop-only)
- [ ] Tester rendu Teams réel à 720p compressé

## 14. Convention de travail avec l'équipe

- Toute info sourcée et nuancée (pas de "blabla marketing")
- Distinction stricte **photographie 2-3 ans** (les 27 métiers actuels) vs **horizon 10 ans** (transformations à venir)
- Quand on cite un chiffre : source explicite (ISC2, WEF, McKinsey, Commission UE…)
- Préserver les couleurs sémantiques (bleu = IA/Data, orange = Cyber, violet = transverse)
- Maintenir le code en un seul fichier `app.jsx`
- Rebuild systématique de `app.js` avant push
