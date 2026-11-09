# Prompts Glassmorphism — Design System M3 Expressive
 
Surcharger les System Tokens existants plutôt que de réécrire les composants est l'approche la plus saine : les composants consomment déjà ces variables, ce qui permet de basculer l'UI en mode Glassmorphism sans toucher à la structure DOM ni casser la rétrocompatibilité.

Les deux prompts ci-dessous sont prêts à être copiés-collés dans ton agent IA (Claude ou GitHub Copilot Workspace) ouvert sur le workspace contenant `sf-p05-design-system` (et/ou `sf-p03-portfolio`).

portfolio_dir: `/d/workspace/sf-p03-portfolio`
design_system_dir: `/d/workspace/sf-p05-design-system`

---
 
## Prompt 1 : Audit SCSS, cartographie des tokens et liste des composants
 
Ce premier prompt force l'agent à analyser l'existant sans modifier de code, afin d'identifier exactement quelles variables CSS et quels composants doivent être ciblés.
 
Tu es un Architecte Frontend Senior spécialisé en SCSS modulaire et Design Systems (Material Design 3 Expressive).
 
## Objectif de la mission
 
Analyser l'intégralité de l'architecture SCSS de mon Design System (`sf-p05-design-system`) afin de préparer une surcouche **Glassmorphism (Frosted Tonal Elevation)** non destructive pour mon portfolio (`sf-p03-portfolio`).
 
Pour ne rien casser, la stratégie consiste à **surcharger les tokens existants** plutôt que de réécrire la structure des composants.
 
**IMPORTANT : Ne modifie aucun fichier pour l'instant.** Produis uniquement un rapport d'audit technique structuré.
 
## Contraintes architecturales strictes à respecter
 
- **Zéro BEM :** je n'utilise jamais la nomenclature BEM (`.block__element--modifier`). Respecte strictement mes sélecteurs actuels.
- **Hiérarchie à 3 niveaux :** Primitives (`abstracts/`) → System Tokens (`foundation/`, préfixe `--ds-*`) → Component Tokens (variables locales en tête de chaque composant).
- **Thématisation :** gestion du thème clair/sombre via `[data-ui-theme="dark"]` et manipulation des couleurs via `color-mix(in srgb, ...)`.
 
## Étapes de l'analyse attendue
 
### 1. Cartographie des fichiers de fondation
 
Scanne les dossiers de styles (`abstracts/`, `foundation/`, `tokens/`, etc.) et liste les fichiers exacts qui déclarent les primitives SCSS et les variables CSS `:root` / `[data-ui-theme="dark"]`.
 
### 2. Inventaire des tokens existants à surcharger
 
Relève les noms exacts des variables CSS (`--ds-*`) actuellement utilisées dans le code pour :
 
- **Les surfaces et conteneurs :** fonds de page, cartes, sections, modales, menus (ex : `--ds-surface`, `--ds-surface-container-*`).
- **Les bordures et séparateurs :** contours fonctionnels et décoratifs (ex : `--ds-color-outline`, `--ds-color-outline-variant`).
- **Les ombres et élévations :** variables de `box-shadow` ou niveaux d'élévation existants.
- **Les états interactifs :** variables ou mécanismes utilisés pour `:hover`, `:active`, `:focus-visible`.
 
### 3. Diagnostic des composants à restyliser
 
Analyse tous les fichiers SCSS des composants (`atoms/`, `molecules/`, `organisms/`, `layout/`, etc.) et classe-les en 3 catégories :
 
- **Catégorie A (prêts par simple surcharge de tokens) :** composants qui utilisent déjà les tokens de surface et de bordure et qui deviendront translucides automatiquement dès que les System Tokens seront surchargés (il suffira d'ajouter `backdrop-filter`).
- **Catégorie B (nécessitent un ajustement des Component Tokens) :** composants qui utilisent des couleurs opaques en dur, des primitives SCSS directes, ou qui manquent de bordure spéculaire (`border: 1px solid ...`) pour que l'effet verre ressorte.
- **Catégorie C (à exclure du Glassmorphism) :** éléments qui doivent impérativement rester opaques pour préserver le contraste WCAG AA et la lisibilité (textes, badges pleins, boutons CTA primaires, tooltips, etc.).
 
### 4. Plan d'exécution priorisé
 
Fournis un tableau récapitulatif avec, pour chaque composant :
 
| Fichier SCSS | Sélecteur principal | Component Tokens impactés | Propriétés CSS à ajouter (`backdrop-filter`, `box-shadow` spéculaire) |
| --- | --- | --- | --- |