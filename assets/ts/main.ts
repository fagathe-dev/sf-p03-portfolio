// =============================================================================
// main.ts — Point d'entrée TypeScript global du Portfolio
// -----------------------------------------------------------------------------
// Initialise immédiatement le thème (clair / sombre / auto + surface glass)
// et connecte le sélecteur de thème [data-ds-theme-switch].
// Les interactions génériques du Design System (collapse, dropdown, modal,
// segmented-control) sont prises en charge par {{ DESIGN_SYSTEM_URL }}/js/main.js.
// =============================================================================

import { themeService, initThemeSwitcher } from '@/services/theme';

const initPortfolioUI = (): void => {
  // Assure l'application du thème courant sur <html>
  document.documentElement.setAttribute('data-ui-theme', themeService.getTheme());

  // Connecte le sélecteur de thème de la navbar
  initThemeSwitcher();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioUI);
} else {
  initPortfolioUI();
}

