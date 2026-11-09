## Prompt 2 : Implémentation des tokens et directives Glassmorphism
 
Une fois que l'agent a généré son rapport à l'étape 1, envoie-lui ce second prompt pour appliquer la surcouche proprement.
 
````markdown
Passe maintenant à l'implémentation de la surcouche **Glassmorphism (Frosted Tonal Elevation)** en te basant sur l'audit précédent.
 
## Règles d'ingénierie SCSS impératives (à respecter sous peine de rejet)
 
1. **INTERDICTION FORMELLE du nommage BEM** (pas de `__` ni de `--` dans les noms de classes). Utilise des classes simples, des sélecteurs d'attributs (`[data-ui-surface="glass"]`, `[data-variant="..."]`) ou mes conventions existantes.
2. **Syntaxe SCSS moderne :** utilise exclusivement `@use` et `@forward` (jamais `@import`).
3. **Imbrication limitée :** maximum 2 niveaux d'imbrication SCSS (3 uniquement pour `:hover`, `:active`, `:focus-visible`, `:disabled`).
4. **Zéro marge externe :** aucun composant ne doit contenir de `margin` externe. Utilise les propriétés logiques CSS (`padding-inline`, `padding-block`, `block-size`, `inline-size`).
5. **Zéro valeur magique :** toutes les couleurs, flous et rayons doivent passer par des variables CSS `--ds-*`.
6. **Transitions ciblées :** n'utilise jamais `transition: all`. Cible explicitement les propriétés avec `--ds-ease-spatial` (mouvement, `border-radius`, `transform`) et `--ds-ease-effects` (`background-color`, `border-color`, `box-shadow`).
 
## 1. Surcharge non destructive des System Tokens
 
Crée ou mets à jour le fichier de surcouche de thème (activable via `:root[data-ui-surface="glass"]` ou en surcouche directe dans le portfolio) en injectant ces primitives de verre et en surchargeant les tokens de surface existants via `color-mix()` :
 
```scss
:root[data-ui-surface="glass"] {
  // 1. Nouvelles primitives de réfraction et spécularité
  --ds-glass-blur-sm: 10px;
  --ds-glass-blur-md: 20px;
  --ds-glass-blur-lg: 32px;
  --ds-glass-saturate: 165%;
 
  // Opacités graduées pour conserver la hiérarchie tonale M3 Expressive
  --ds-glass-opacity-low: 48%;
  --ds-glass-opacity-md: 66%;
  --ds-glass-opacity-high: 80%;
  --ds-glass-opacity-highest: 90%;
 
  // Bordures spéculaires et reflets internes (Light mode)
  --ds-glass-border: color-mix(in srgb, var(--ds-color-on-surface) 12%, rgba(255, 255, 255, 0.55));
  --ds-glass-border-hover: color-mix(in srgb, var(--ds-color-primary) 42%, rgba(255, 255, 255, 0.75));
  --ds-glass-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.65);
  --ds-glass-shadow: 0 12px 32px -8px color-mix(in srgb, var(--ds-color-on-surface) 8%, transparent);
 
  // 2. Surcharge des System Tokens de surface existants (adapte aux noms exacts relevés lors de l'audit)
  --ds-surface-container-low: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-low), transparent);
  --ds-surface-container: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-md), transparent);
  --ds-surface-container-high: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-high), transparent);
  --ds-surface-container-highest: color-mix(in srgb, var(--ds-surface) var(--ds-glass-opacity-highest), transparent);
  --ds-color-outline-variant: var(--ds-glass-border);
}
 
// Calibration spécifique pour le Dark Mode
:root[data-ui-theme="dark"][data-ui-surface="glass"],
[data-ui-surface="glass"] [data-ui-theme="dark"] {
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
 
## 2. Création du mixin d'application (`abstracts/_mixins.scss`)
 
Crée un mixin réutilisable `glass-surface($blur: var(--ds-glass-blur-md))` qui applique :
 
- `backdrop-filter: blur($blur) saturate(var(--ds-glass-saturate));` (avec le préfixe `-webkit-backdrop-filter`)
- `border: 1px solid var(--ds-color-outline-variant);`
- `box-shadow: var(--ds-glass-highlight), var(--ds-glass-shadow);`
- Un fallback propre via `@supports not (backdrop-filter: blur(1px))` qui repasse l'opacité du fond à 96 % pour éviter tout problème de lisibilité.
- Le respect de `@media (prefers-reduced-transparency: reduce)` qui désactive la transparence.
 
## 3. Directives de restylisation par composant
 
Applique ce mixin et ajuste les Component Tokens **uniquement** sur les composants identifiés dans l'audit :
 
- **Navigation / Header / Floating Bars :** utilise `--ds-surface-container-high` + `glass-surface(var(--ds-glass-blur-lg))` pour garantir la lisibilité du texte lors du scroll par-dessus le contenu.
- **Cards (Projets, Bento, Articles) :** utilise `--ds-surface-container` + `glass-surface(var(--ds-glass-blur-md))`. Au `:hover`, fais évoluer la bordure vers `var(--ds-glass-border-hover)` et le fond via un State Layer (`color-mix`). Conserve le Shape Morphing au `:active`.
- **Modales / Drawers / Popovers :** utilise `--ds-surface-container-highest` + `glass-surface(var(--ds-glass-blur-lg))` pour détacher franchement le premier plan.
- **Chips / Filtres / Boutons secondaires (Tonal / Outlined) :** utilise `--ds-surface-container-low` + `glass-surface(var(--ds-glass-blur-sm))`. Garde les boutons Primary (`--ds-color-primary`) 100 % opaques pour créer un point focal fort (contraste franc entre le verre dépoli et les CTA pleins).
- **Inputs / Champs de formulaire :** fond en `--ds-surface-container-low`, bordure fonctionnelle à contraste suffisant, et `:focus-visible` avec `outline: 2px solid var(--ds-color-primary); outline-offset: 2px;`.
 
## Livrable
 
Génère maintenant le code SCSS complet des fichiers de tokens, du mixin et des composants modifiés.
````
 
---