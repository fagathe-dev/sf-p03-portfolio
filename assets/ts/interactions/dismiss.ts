// =============================================================================
// interactions/dismiss.ts — Gestionnaire de fermeture des composants interactifs
// =============================================================================

import { closeDialog } from '@/modal';

/**
 * Ferme le composant désigné par data-ds-dismiss + data-ds-target (ou closest).
 * Calqué sur dismissHandler() du design system.
 */
export const dismissHandler = (trigger: HTMLElement): void => {
  const targetSelector = trigger.getAttribute('data-ds-target');
  const targetElement = targetSelector
    ? document.querySelector<HTMLDialogElement>(targetSelector)
    : null;
  const targetType =
    trigger.getAttribute('data-ds-dismiss') ||
    trigger.getAttribute('data-dismiss');

  switch (targetType) {
    case 'modal':
    case 'dialog': {
      const dialog =
        (trigger.closest('dialog') as HTMLDialogElement | null) ??
        targetElement;
      if (dialog) closeDialog(dialog);
      break;
    }
    default:
      break;
  }
};

/**
 * Ferme tous les dialog.dialog[open] à la touche Escape.
 * Nécessaire car show() ne bénéficie pas du comportement natif d'Escape.
 */
export const handleEscapeKey = (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') return;
  const openDialogs = document.querySelectorAll<HTMLDialogElement>(
    'dialog.dialog[open]',
  );
  openDialogs.forEach((d) => closeDialog(d));
};
