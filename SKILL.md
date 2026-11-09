---
name: ds-m3-expressive-glassmorphism
description: >-
  Architecture SCSS Material Design 3 Expressive, règles d'ingénierie CSS/SCSS (Zéro BEM,
  3 niveaux de tokens, propriétés logiques, State Layers) et surcouche Glassmorphism
  (Frosted Tonal Elevation) pour la migration et le développement UI du projet sf-p03-portfolio
  aligné sur sf-p05-design-system.
---

# SKILL — Design System M3 Expressive & Surcouche Glassmorphism (`sf-p03-portfolio`)

Ce document définit les règles d'architecture, de nommage et de stylisation à appliquer impérativement lors de toute création ou migration de composants SCSS / Twig dans **`sf-p03-portfolio`**, en alignement strict avec le Design System de référence (**`sf-p05-design-system`**).

---

## 1. Environnement & Liaison au Design System (Mode CDN + Surcharge Locale)

- **URL du Design System (`DESIGN_SYSTEM_URL`) :** exposée via la variable d'environnement `DESIGN_SYSTEM_URL` (déclarée dans `.env` / `.env.local`) et injectée globalement dans Twig via `config/packages/twig.yaml` :
  ```yaml
  twig:
      globals:
          DESIGN_SYSTEM_URL: '%env(DESIGN_SYSTEM_URL)%'
  ```
- **Sécurité & Confidentialité :** **Ne jamais ouvrir ni lire le fichier `.env.local`**. Toujours se référer à `.env` pour connaître les clés disponibles ou utiliser `DESIGN_SYSTEM_URL` via la configuration Symfony / variables d'environnement.
- **Chargement CDN dans `templates/base.html.twig` :**
  - Icônes du Design System : `<link rel="stylesheet" href="{{ DESIGN_SYSTEM_URL }}/assets/ds-icons.css" type="text/css" />`
  - UI Kit complet du Design System : `<link rel="stylesheet" href="{{ DESIGN_SYSTEM_URL }}/css/ds-ui-kit.css" type="text/css" />`
  - Surcharge locale du Portfolio : `<link rel="stylesheet" href="{{ asset('css/ds-portfolio.css') }}" type="text/css" />`
  - Scripts du Design System + scripts locaux :
    ```twig
    <script type="module" src="{{ DESIGN_SYSTEM_URL }}/js/main.js"></script>
    <script type="module" src="{{ asset('js/main.js') }}"></script>
    ```
- **Architecture SCSS locale du Portfolio (`assets/scss/`) :**
  Ne duplique jamais le code source du Design System ; elle surcharge uniquement les System Tokens `--ds-*` et ajoute les variables/composants propres au Portfolio (aspect brut/industriel Olive & Taupe + Glassmorphism) :
  1. `abstracts/` (`_primitives.scss`, `_functions.scss`, `_mixins.scss`, `_index.scss`) — **aucune sortie CSS** (palettes industrielles `olive`, `taupe`, `slate`, rayons anguleux `$radii-industrial`, `@mixin glass-surface`).
  2. `_tokens.scss` — surcharge des System Tokens `:root` et `[data-ui-theme='dark']` (identité Olive & Taupe, police `DM Mono`, variables industrielles `--ds-shadow-brutal`, `--ds-grid-line-color`) et surcouche `:root[data-ui-surface='glass']`.
  3. `_glass-overrides.scss` — application de `@include glass-surface` par niveau d'élévation tonale et préservation des éléments 100 % opaques (`.btn-primary`, `.badge`, `.code-content`).
  4. `_portfolio.scss` — composants métiers spécifiques au portfolio (`.hero-portfolio`, `.stat-card`, `.skill-card`, `.project-card`, `.timeline`, `.timeline-card`, `.contact-form`, `.contact-info`, `.legal-container`).
  5. `ds-portfolio.scss` — point d'entrée compilé par `scripts/compile-scss.js` vers `public/css/ds-portfolio.css`.

---

## 2. Règles d'Ingénierie SCSS Impératives

### 2.1. Zéro BEM (Interdiction formelle)
- **Interdiction absolue** d'utiliser la notation BEM (`.block__element` ou `.block--modifier`) dans les classes CSS et les templates Twig.
- Utiliser exclusivement :
  - Des **classes simples à tirets simples** : `.card`, `.card-header`, `.card-body`, `.card-title`, `.navbar`, `.navbar-brand`, `.navbar-nav`, `.nav-link`, `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-soft-primary`, `.btn-sm`.
  - Des **classes d'état courtes** : `.active`, `.show`, `.hide`, `.disabled`, `.is-open`, `.is-selected`, `.is-valid`, `.is-invalid`.
  - Des **sélecteurs d'attributs HTML / ARIA** : `[open]`, `[hidden]`, `[aria-expanded="true"]`, `[aria-checked="true"]`, `[aria-selected="true"]`, `[data-ui-theme="dark"]`, `[data-ui-surface="glass"]`.

### 2.2. Syntaxe SCSS Moderne & Imbrication
- Utiliser exclusivement `@use` et `@forward` (**jamais `@import`**, à l'exception de l'URL Google Fonts dans `foundation/_fonts.scss`).
- Chaque fichier de composant charge uniquement les outils sans sortie CSS en tête de fichier :
  ```scss
  @use '../abstracts' as *;
  ```
- **Imbrication limitée :**
  - Maximum **2 niveaux** d'imbrication SCSS pour la structure.
  - Un **3e niveau** est toléré uniquement pour les pseudo-classes d'état (`:hover`, `:active`, `:focus-visible`, `:disabled`), les pseudo-éléments (`::before`, `::after`, `::backdrop`) et `@include reduced-motion`.

### 2.3. Hiérarchie des Tokens à 3 Niveaux
Aucun composant ne doit contenir de valeur magique (couleur hexadécimale, `rgba()`, taille en `px` ou durée en `ms` en dur) :
1. **Niveau 1 — Reference Tokens (`abstracts/_primitives.scss`)** : variables Sass (`$palettes`, `$spacing`, `$radii`, `$type-scale`, `$easings`, `$durations`, `$breakpoints`). **Jamais appelées directement dans un composant** (sauf `$roles`, `$brand-roles`, `$breakpoints` pour les boucles de génération).
2. **Niveau 2 — System Tokens (`foundation/_tokens.scss`)** : variables CSS globales préfixées par `--ds-*` déclarées sur `:root` et surchargées sur `[data-ui-theme='dark']` (et `:root[data-ui-surface='glass']`).
3. **Niveau 3 — Component Tokens (en tête de chaque composant)** : variables CSS locales (ex. `--card-bg`, `--btn-bg`, `--navbar-bg`) mappées sur les System Tokens `--ds-*`. Les variantes (`.card-primary`, `.btn-soft-secondary`, `.btn-sm`) ne font **que surcharger ces Component Tokens**, sans réécrire les propriétés CSS.

### 2.4. Propriétés Logiques & Zéro Marge Externe
- **Zéro marge externe** sur les composants autonomes (`.btn`, `.card`, `.badge`, `.alert`, `.form-control`, `.box`, `.list-group`) : l'espacement entre composants est toujours géré par le conteneur parent via `gap` (`.d-flex`, `.grid`, `.row`) ou les utilitaires d'espacement.
- Utiliser systématiquement les **propriétés logiques CSS** :
  - Dimensions : `inline-size`, `min-inline-size`, `max-inline-size`, `block-size`, `min-block-size`, `max-block-size` (exception : `height` sur `.collapse` / `.collapsing` piloté en JS).
  - Paddings & Marges internes : `padding-inline`, `padding-block`, `padding-inline-start`, `padding-inline-end`, `margin-inline`, `margin-block-start`, `margin-block-end`.
  - Bordures & Rayons : `border-block-start`, `border-block-end`, `border-inline-start`, `border-inline-end`, `border-start-start-radius`, `border-end-end-radius`.
  - Positionnement & Alignement : `inset-block-start`, `inset-inline-start`, `text-align: start`, `text-align: end`.

### 2.5. États Interactifs (State Layers), Focus & Motion
- **State Layers M3 :** ne jamais inventer de couleur de survol arbitraire. Utiliser la fonction `state-layer($bg, $content, $layer: 'hover')` qui génère `color-mix(in srgb, $bg, $content var(--ds-state-hover))` (`8%` au `:hover`, `12%` au `:active` avec `'pressed'`).
- **États désactivés :** utiliser `disabled-container()` (`12%` de `--ds-color-on-surface`) et `disabled-content()` (`38%` de `--ds-color-on-surface`).
- **Focus accessible :** utiliser `@include focus-ring` dans `:focus-visible` (ou `@include focus-ring(calc(var(--ds-focus-ring-width) * -1))` lorsque le parent a `overflow: hidden`).
- **Cibles tactiles :** garantir une zone cliquable d'au moins `44px` (`--ds-touch-target: 2.75rem`) sur les petits contrôles via `@include touch-target`.
- **Transitions ciblées :** **interdiction formelle de `transition: all`**. Utiliser les fonctions d'aide :
  - `effects(background-color, color, border-color, box-shadow, opacity)` → `--ds-duration-effects` (`150ms`) + `--ds-ease-effects` (`cubic-bezier(0, 0, 0.2, 1)`).
  - `spatial(transform, border-radius, inline-size)` → `--ds-duration-spatial` (`250ms`) + `--ds-ease-spatial` (`cubic-bezier(0.2, 0, 0, 1)`).
  - `spring(transform)` → `--ds-duration-spatial` (`250ms`) + `--ds-ease-spring` (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
  - Toujours prévoir `@include reduced-motion` lorsque des animations de transformation ou de déplacement sont appliquées.

---

## 3. Référence des System Tokens (`--ds-*`)

### 3.1. Couleurs de Rôles & Surfaces
- **Rôles (`primary`, `secondary`, `tertiary`, `success`, `warning`, `info`, `error`)** :
  - Plein : `--ds-color-{role}` / Texte dessus : `--ds-color-on-{role}`
  - Conteneur tonal : `--ds-color-{role}-container` / Texte dessus : `--ds-color-on-{role}-container`
  - Fonction SCSS : `role-color($role)` | `role-color($role, 'on')` | `role-color($role, 'container')` | `role-color($role, 'on-container')` (note : le rôle public `'danger'` mappe automatiquement vers `'error'`).
- **Surfaces (Hiérarchie d'élévation tonale M3)** :
  - `--ds-surface` : fond de page principal
  - `--ds-surface-container-low` : cartes au survol léger, champs de saisie, contrôles segmentés, sections teintées
  - `--ds-surface-container` : cartes standards, boîtes (`.box`), panneaux latéraux (`.sidebar`), pied de page (`.footer`), blocs de code
  - `--ds-surface-container-high` : barres de navigation flottantes/collantes, en-têtes de blocs, barres d'outils, toasts
  - `--ds-surface-container-highest` : modales (`dialog`), menus déroulants (`.dropdown-menu`), pistes de switch
- **Textes & Contours sur surface** :
  - `--ds-color-on-surface` : texte principal et titres
  - `--ds-color-on-surface-variant` : texte secondaire (`.text-muted`), icônes discrètes, légendes
  - `--ds-color-outline` : bordure fonctionnelle (contraste ≥ 3:1 : champs de formulaire, boutons outline, chips)
  - `--ds-color-outline-variant` : bordure décorative et séparateurs (cartes, modales, listes, tableaux, filets)

### 3.2. Typographie, Espacements, Formes & Profondeur
- **Typographie (`@include type($role, $size)`)** :
  - Rôles : `display` (`lg`, `md`, `sm`), `headline` (`lg`, `md`, `sm`), `title` (`lg`, `md`, `sm`), `body` (`lg`, `md`, `sm`), `label` (`lg`, `md`, `sm`).
  - Familles : `--ds-font-sans`, `--ds-font-mono`.
- **Espacements (grille de 4px)** :
  - `--ds-space-0`, `--ds-space-0_5` (`2px`), `--ds-space-1` (`4px`), `--ds-space-1_5` (`6px`), `--ds-space-2` (`8px`), `--ds-space-2_5` (`10px`), `--ds-space-3` (`12px`), `--ds-space-3_5` (`14px`), `--ds-space-4` (`16px`), `--ds-space-5` (`20px`), `--ds-space-6` (`24px`), `--ds-space-7` (`28px`), `--ds-space-8` (`32px`), `--ds-space-9` (`36px`), `--ds-space-10` (`40px`), `--ds-space-12` (`48px`), `--ds-space-16` (`64px`), `--ds-space-20` (`80px`), `--ds-space-24` (`96px`).
- **Rayons (`--ds-radius-*`)** :
  - `none` (`0`), `xs` (`0.25rem`), `sm` (`0.5rem`), `md` (`0.75rem`), `lg` (`1rem`), `xl` (`1.75rem`), `full` (`9999px`).
- **Ombres (`--ds-shadow-*`)** :
  - `xs` (contrôles, boutons), `sm` (cartes), `md` (cartes survolées, toasts), `lg` (modales, dropdowns, drawers), `inset`.
- **Z-index (`--ds-z-*`)** :
  - `dropdown` (`1000`), `sticky` (`1020`), `overlay` (`1030`), `drawer` (`1040`), `modal` (`1050`), `toast` (`1060`).

---

## 4. Surcouche Glassmorphism (Frosted Tonal Elevation)

### 4.1. Surcharge Non Destructive des System Tokens (`foundation/_tokens.scss` ou `_glass.scss`)
Activée via l'attribut `:root[data-ui-surface="glass"]` :

```scss
:root[data-ui-surface='glass'] {
  // 1. Primitives de réfraction et spécularité
  --ds-glass-blur-sm: 10px;
  --ds-glass-blur-md: 20px;
  --ds-glass-blur-lg: 32px;
  --ds-glass-saturate: 165%;

  // Opacités graduées (Light Mode)
  --ds-glass-opacity-low: 48%;
  --ds-glass-opacity-md: 66%;
  --ds-glass-opacity-high: 80%;
  --ds-glass-opacity-highest: 90%;

  // Bordures spéculaires et reflets internes (Light Mode)
  --ds-glass-border: color-mix(in srgb, var(--ds-color-on-surface) 12%, rgba(255, 255, 255, 0.55));
  --ds-glass-border-hover: color-mix(in srgb, var(--ds-color-primary) 42%, rgba(255, 255, 255, 0.75));
  --ds-glass-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.65);
  --ds-glass-shadow: 0 12px 32px -8px color-mix(in srgb, var(--ds-color-on-surface) 8%, transparent);

  // 2. Surcharge des System Tokens de surface existants
  --ds-surface-container-low: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-low), transparent);
  --ds-surface-container: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-md), transparent);
  --ds-surface-container-high: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-high), transparent);
  --ds-surface-container-highest: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-highest), transparent);
  --ds-color-outline-variant: var(--ds-glass-border);
}

:root[data-ui-theme='dark'][data-ui-surface='glass'],
[data-ui-surface='glass'] [data-ui-theme='dark'] {
  --ds-glass-opacity-low: 38%;
  --ds-glass-opacity-md: 56%;
  --ds-glass-opacity-high: 72%;
  --ds-glass-opacity-highest: 86%;

  --ds-glass-border: color-mix(in srgb, var(--ds-color-on-surface) 14%, rgba(255, 255, 255, 0.08));
  --ds-glass-border-hover: color-mix(in srgb, var(--ds-color-primary) 50%, rgba(255, 255, 255, 0.22));
  --ds-glass-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --ds-glass-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.48);
}
```

### 4.2. Mixin `@mixin glass-surface` (`abstracts/_mixins.scss`)
```scss
@mixin glass-surface($blur: var(--ds-glass-blur-md)) {
  -webkit-backdrop-filter: blur($blur) saturate(var(--ds-glass-saturate, 165%));
  backdrop-filter: blur($blur) saturate(var(--ds-glass-saturate, 165%));
  border: var(--ds-border-width) solid var(--ds-color-outline-variant);
  box-shadow: var(--ds-glass-highlight), var(--ds-glass-shadow);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: color-mix(in srgb, var(--ds-surface) 96%, transparent);
  }

  @media (prefers-reduced-transparency: reduce) {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    background-color: var(--ds-surface);
  }
}
```

### 4.3. Règles d'Application par Niveau de Profondeur
- **Navigation / Header / Floating Bars (`.navbar`, `.toast`)** : `--ds-surface-container-high` + `@include glass-surface(var(--ds-glass-blur-lg))`
- **Cards, Boxes, Panels (`.card`, `.box`, `.accordion`, `.list-group`, `.auth-card`, `.project-card`, `.skill-card`, `.timeline-card`)** : `--ds-surface-container` + `@include glass-surface(var(--ds-glass-blur-md))`. Au `:hover` sur les cartes interactives : `border-color: var(--ds-glass-border-hover)` et State Layer.
- **Modales / Menus flottants (`dialog`, `.dropdown-menu`)** : `--ds-surface-container-highest` + `@include glass-surface(var(--ds-glass-blur-lg))`
- **Chips / Filtres / Boutons secondaires (`.chip`, `.btn-soft-*`, `.btn-outline-*`, `.segmented-control`)** : `--ds-surface-container-low` + `@include glass-surface(var(--ds-glass-blur-sm))`
- **Inputs (`.form-control`, `.form-select`)** : `--input-bg: var(--ds-surface-container-low)`, bordure `--ds-color-outline` (contraste ≥ 3:1), `@include focus-ring` au `:focus-visible`.
- **Exclusions strictes (100 % opaques — Catégorie C)** : `.btn-primary` et tous les `.btn-solid-*`, `.badge` (toutes variantes), `.chip.is-selected`, `.code-content`, textes/titres, checkboxes/radios cochés.

---

## 5. Mapping de Migration du Portfolio (`sf-p03-portfolio`)

Lors de la refonte des templates Twig (`templates/pages/homepage.html.twig`, `templates/partials/*.html.twig`, `templates/pages/legales.html.twig`) et des feuilles SCSS du portfolio, remplacer systématiquement les anciens sélecteurs BEM par les composants normalisés du Design System :

| Élément Portfolio | Ancien sélecteur (BEM à proscrire) | Sélecteur cible (Design System Zéro BEM) |
| :--- | :--- | :--- |
| Barre de navigation | `.navbar--home`, `.navbar__inner`, `.navbar__brand`, `.navbar__links`, `.navbar__link`, `.navbar__actions`, `.navbar__burger`, `.navbar__menu-mobile` | `.navbar .navbar-expand-md`, `.container`, `.navbar-brand`, `.navbar-collapse .collapse`, `.navbar-nav`, `.nav-link`, `.navbar-actions`, `.navbar-toggler` |
| Boutons | `.btn--primary`, `.btn--outline`, `.btn--sm` | `.btn .btn-primary`, `.btn .btn-outline-primary` (ou `.btn-soft-secondary`), `.btn-sm` |
| Hero | `.hero__inner`, `.hero__content`, `.hero__badge`, `.hero__name`, `.hero__title`, `.hero__tagline`, `.hero__ctas`, `.hero__socials`, `.hero__social-link`, `.hero__visual`, `.hero__avatar` | `.hero`, `.hero-content`, `.badge .badge-soft-primary .badge-pill`, `.hero-title`, `.lead`, `.hero-actions`, `.hero-socials`, `.btn .btn-icon .btn-outline-secondary`, `.hero-visual`, `.avatar .avatar-xl` |
| Sections | `.section`, `.section--alt`, `.section__inner`, `.section__title` | `.section`, `.section-tinted` (ou `.bg-surface-container-low`), `.container`, `.section-title` |
| À propos & Stats | `.about__content`, `.about__bio`, `.about__actions`, `.about__stats`, `.about__stat`, `.about__stat-value`, `.about__stat-label` | `.about-grid`, `.about-content`, `.about-bio`, `.about-actions`, `.about-stats`, `.card .stat-card`, `.stat-value`, `.stat-label` |
| Compétences | `.skills__group`, `.skills__group-title`, `.skills__grid`, `.skill-card--highlight`, `.skill-card__icon`, `.skill-card__label`, `.skill-card__level` | `.skills-group`, `.skills-group-title`, `.skills-grid`, `.card .skill-card .is-highlighted`, `.skill-icon`, `.skill-label`, `.badge .badge-soft-primary` |
| Projets | `.projects__grid`, `.project-card__thumbnail`, `.project-card__img`, `.project-card__body`, `.project-card__meta`, `.project-card__date`, `.project-card__name`, `.project-card__excerpt`, `.project-card__stack`, `.project-card__tag`, `.project-card__actions` | `.projects-grid`, `.card .card-elevated .project-card`, `.card-img-top`, `.card-body`, `.project-meta`, `.project-date`, `.card-title`, `.card-text`, `.project-stack`, `.chip .chip-sm` (ou `.badge`), `.card-footer` |
| Parcours (Timeline) | `.timeline__item`, `.timeline__marker`, `.timeline__content`, `.timeline__header`, `.timeline__type-badge`, `.timeline__dates`, `.timeline__title`, `.timeline__org`, `.timeline__stack-tag` | `.timeline`, `.timeline-item`, `.timeline-marker`, `.card .timeline-card`, `.timeline-header`, `.badge .badge-soft-primary`, `.timeline-dates`, `.timeline-title`, `.timeline-org`, `.badge` |
| Contact | `.contact__intro`, `.contact__layout`, `.contact__form`, `.contact__row`, `.contact__field`, `.contact__feedback`, `.contact__info`, `.contact__social-link` | `.contact-intro`, `.contact-layout`, `.contact-form`, `.row`, `.contact-field`, `.alert` (`.alert-success` / `.alert-danger`), `.box .contact-info`, `.nav-link` |
| Footer | `.footer__inner`, `.footer__copy`, `.footer__socials` | `.footer`, `.container .footer-content`, `.footer-copy`, `.footer-links` |
