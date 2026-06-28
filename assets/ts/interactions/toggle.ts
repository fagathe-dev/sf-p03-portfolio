// =============================================================================
// interactions/toggle.ts — Gestionnaire d'ouverture des composants interactifs
// =============================================================================

import { openDialog, closeDialog, DialogToggle } from '@/modal';

/**
 * Ouvre le composant ciblé par data-ds-target selon data-ds-toggle.
 * Calqué sur toggleHandler() du design system.
 */
export const toggleHandler = (trigger: HTMLElement): void => {
  const targetSelector = trigger.getAttribute('data-ds-target');
  const targetElement = targetSelector
    ? document.querySelector<HTMLDialogElement>(targetSelector)
    : null;
  const targetType = trigger.getAttribute(
    'data-ds-toggle',
  ) as DialogToggle | null;

  if (!targetElement) {
    console.warn(
      `[Toggle] Aucun élément trouvé pour le sélecteur "${targetSelector}"`,
    );
    return;
  }

  switch (targetType) {
    case 'modal':
      openDialog(targetElement, 'modal');
      break;
    case 'dialog':
      openDialog(targetElement, 'dialog');
      break;
    default:
      break;
  }
};

/**
 * Détecte un clic sur le ::backdrop et ferme le dialog.modal correspondant.
 * Le clic "backdrop" se produit quand event.target est le <dialog> lui-même.
 */
export const handleBackdropClick = (
  event: MouseEvent,
  dialog: HTMLDialogElement,
): void => {
  if (!dialog.classList.contains('modal')) return;
  const container = dialog.querySelector('.dialog-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const { clientX, clientY } = event;
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    closeDialog(dialog);
  }
};
