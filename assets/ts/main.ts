// =============================================================================
// main.ts — Orchestrateur : initialisation des interactions globales
// =============================================================================

import { toggleHandler, handleBackdropClick, dismissHandler, handleEscapeKey } from '@/interactions';

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as Element;

    // Ouverture : [data-ds-toggle]
    const toggleTrigger = target.closest<HTMLElement>('[data-ds-toggle]');
    if (toggleTrigger) {
      toggleHandler(toggleTrigger);
    }

    // Fermeture : [data-ds-dismiss]
    const dismissTrigger = target.closest<HTMLElement>('[data-ds-dismiss]');
    if (dismissTrigger) {
      dismissHandler(dismissTrigger);
    }

    // Fermeture par clic sur le backdrop (dialog.modal uniquement)
    if (event.target instanceof HTMLDialogElement) {
      handleBackdropClick(event, event.target);
    }
  });

  // Fermeture par Escape pour dialog.dialog (non géré nativement via show())
  document.addEventListener('keydown', handleEscapeKey);
});

