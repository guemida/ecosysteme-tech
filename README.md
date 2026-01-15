# 🎓 Écosystème Technologique IT

[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Standards](https://img.shields.io/badge/standards-W3C%20%7C%20WCAG%202.1-green.svg)](STANDARDS_ANALYSIS.md)

> Visualisation interactive de l'écosystème des technologies IT avec plus de 100 technologies mappées et leurs interconnexions.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Protection anti-copie](#protection-anti-copie)
- [Conformité](#conformité)
- [Performance](#performance)
- [Licence](#licence)

## 🎯 Aperçu

Cette application web interactive permet d'explorer l'écosystème des technologies IT à travers une visualisation graphique dynamique. Elle présente :

- **100+ technologies** couvrant frontend, backend, bases de données, DevOps, sécurité, etc.
- **300+ connexions** montrant les relations entre technologies
- **15 catégories** organisées par domaine
- **Interface accessible** conforme WCAG 2.1 AA
- **Architecture modulaire** séparant données, code et présentation

## ✨ Fonctionnalités

### Visualisation interactive
- Graphe D3.js force-directed avec zoom et pan
- Mise en évidence des connexions au survol/clic
- Animation fluide et responsive

### Filtrage et recherche
- Filtres par catégorie (15 domaines)
- Recherche en temps réel avec debouncing
- Statistiques dynamiques

### Détails des technologies
- Description complète de chaque technologie
- Cas d'usage et exemples d'application
- Difficulté, temps d'apprentissage, part de marché
- Technologies connectées cliquables

### Accessibilité (WCAG 2.1 AA)
- Navigation au clavier complète
- ARIA labels et roles
- Labels pour lecteurs d'écran
- Support prefers-reduced-motion
- Contraste des couleurs conforme

### Performance
- Chargement asynchrone des données (JSON)
- Debouncing de la recherche (300ms)
- Mise en cache des calculs
- Code minifiable et optimisable

## 🛠️ Technologies utilisées

- **D3.js v7.8.5** - Visualisation de données
- **JavaScript ES6+** - Logique applicative (mode strict, IIFE)
- **CSS3** - Styles avec variables CSS et préfixes vendeurs
- **HTML5** - Structure sémantique
- **JSON** - Stockage des données

## 📦 Installation

### Pré-requis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Serveur HTTP local (recommandé) ou simplement ouvrir `index.html`

### Option 1 : Serveur HTTP simple (recommandé)

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : `http://localhost:8000`

### Option 2 : Fichier direct

Double-cliquer sur `index.html` (certaines fonctionnalités peuvent être limitées par CORS)

## 📁 Structure du projet

```
ecosysteme-tech/
├── index.html                 # Point d'entrée de l'application
├── index_old.html             # Ancienne version monolithique (backup)
├── src/
│   ├── css/
│   │   └── styles.css         # Styles CSS avec variables
│   ├── js/
│   │   └── app.js             # Logique JavaScript (mode strict, IIFE)
│   └── data/
│       ├── techdata.json      # Données des technologies (100+ nodes)
│       ├── techlinks.json     # Connexions entre technologies (300+ links)
│       └── config.json        # Configuration (couleurs, labels, icônes)
├── CODE_ANALYSIS.md           # Analyse technique du code
├── STANDARDS_ANALYSIS.md      # Analyse de conformité aux standards
├── README.md                  # Ce fichier
└── LICENSE                    # Licence (Tous droits réservés)
```

## 🚀 Utilisation

### Navigation

- **Clic** sur un nœud pour afficher les détails
- **Survol** pour prévisualiser
- **Molette** pour zoomer/dézoomer
- **Glisser-déposer** pour réorganiser
- **Clavier** : Tab pour naviguer, Entrée/Espace pour sélectionner

### Filtrage

- Utilisez les boutons de catégorie pour filtrer par domaine
- Tapez dans la barre de recherche pour trouver une technologie
- Cliquez sur une technologie connectée pour naviguer

### Raccourcis clavier

- `Tab` : Naviguer entre les éléments
- `Entrée` / `Espace` : Activer un bouton ou sélectionner un nœud
- `Échap` : Désélectionner (si implémenté)

## 🔒 Protection anti-copie

Ce projet inclut plusieurs mesures de protection :

### 1. Séparation des données
Les données sont dans des fichiers JSON séparés, permettant :
- Minification facile des données
- Obfuscation optionnelle
- Chargement asynchrone

### 2. Copyright intégré
- Notices de copyright dans tous les fichiers
- Métadonnées protégées
- Footer avec informations légales

### 3. Architecture modulaire
- Code séparé en modules
- Difficile à copier-coller en un bloc
- Dépendances explicites

### 4. Licence restrictive
- **Tous droits réservés**
- Reproduction non autorisée interdite
- Voir [LICENSE](LICENSE) pour détails

## ✅ Conformité

### Standards Web
- ✅ HTML5 valide (W3C)
- ✅ CSS3 avec préfixes vendeurs
- ✅ JavaScript ES6+ en mode strict
- ✅ Sémantique HTML correcte

### Accessibilité (WCAG 2.1 AA)
- ✅ ARIA labels et roles
- ✅ Navigation au clavier
- ✅ Contrastes des couleurs (4.5:1 minimum)
- ✅ Support prefers-reduced-motion
- ✅ Labels pour lecteurs d'écran
- ✅ Skip link pour navigation

### Sécurité
- ✅ Content Security Policy (CSP)
- ✅ Subresource Integrity (SRI) sur CDN
- ✅ Sanitization des entrées
- ✅ Protection XSS
- ✅ Headers de sécurité

### SEO
- ✅ Meta tags complets
- ✅ Open Graph (Facebook)
- ✅ Twitter Cards
- ✅ Structured Data (JSON-LD Schema.org)

### Performance
- ✅ Preconnect vers CDN
- ✅ Scripts avec `defer`
- ✅ Debouncing de la recherche
- ✅ Code modulaire et minifiable

## ⚡ Performance

### Optimisations implémentées
- Chargement parallèle des données (Promise.all)
- Debouncing de la recherche (300ms)
- Rendu incrémental D3.js
- Transitions CSS avec GPU
- Code séparé pour mise en cache navigateur

### Métriques cibles
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Lighthouse Score** : > 90

## 📊 Données

### Format des données

**techdata.json** (nodes)
```json
{
  "version": "1.0.0",
  "copyright": "© 2026 Écosystème Tech",
  "nodes": [
    {
      "id": "React",
      "group": "frontend",
      "shortDesc": "Framework UI Facebook",
      "fullDesc": "...",
      "useCases": ["Apps modernes", "Dashboards"],
      "difficulty": "Intermédiaire",
      "marketShare": "#1 framework",
      "learnTime": "1-2 mois"
    }
  ]
}
```

**techlinks.json** (edges)
```json
{
  "version": "1.0.0",
  "links": [
    {
      "source": "React",
      "target": "JavaScript",
      "strength": 1
    }
  ]
}
```

### Catégories (15)
- Frontend, Backend, Database
- Conception Front/Back/BDD
- Practices, DevOps, Security
- Data, Architecture, Méthodologie
- Tools, Testing, Design

## 🤝 Contribution

Ce projet est **propriétaire** et **tous droits réservés**. Les contributions ne sont pas acceptées.

Pour toute question ou demande de licence commerciale, contactez : [contact@ecosysteme-tech.app](mailto:contact@ecosysteme-tech.app)

## 📄 Licence

**© 2026 Écosystème Technologique IT. Tous droits réservés.**

Ce code est protégé par copyright. Toute reproduction, distribution, modification ou utilisation non autorisée est strictement interdite.

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📚 Documentation technique

- **Analyse du code** : Voir [CODE_ANALYSIS.md](CODE_ANALYSIS.md)
- **Conformité aux standards** : Voir [STANDARDS_ANALYSIS.md](STANDARDS_ANALYSIS.md)

## 🐛 Problèmes connus

Aucun problème connu actuellement.

## 🔄 Changelog

### Version 1.0.0 (2026-01-15)
- ✨ Refonte complète de l'architecture
- ✅ Séparation du code en modules (HTML/CSS/JS/JSON)
- ✅ Conformité WCAG 2.1 AA
- ✅ Amélioration des performances
- ✅ Protection anti-copie renforcée
- ✅ Standards W3C respectés
- ✅ SRI sur les dépendances CDN
- ✅ Gestion d'erreurs complète

---

**Développé avec ❤️ par Écosystème Tech**
