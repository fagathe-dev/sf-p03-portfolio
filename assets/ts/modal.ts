// =============================================================================
// modal.ts — Primitives et API impérative pour les <dialog> natifs
// =============================================================================

export type DialogToggle = 'modal' | 'dialog';

export const openDialog = (
  dialog: HTMLDialogElement,
  toggle: DialogToggle,
): void => {
  if (toggle === 'modal') {
    dialog.showModal();
  } else {
    dialog.show();
  }
  dialog.dispatchEvent(new CustomEvent('ds:open', { bubbles: true }));
};

export const closeDialog = (dialog: HTMLDialogElement): void => {
  dialog.close();
  dialog.dispatchEvent(new CustomEvent('ds:close', { bubbles: true }));
};

// --- API impérative ----------------------------------------------------------

export const Modal = {
  open(selector: string, toggle: DialogToggle = 'modal'): void {
    const dialog = document.querySelector<HTMLDialogElement>(selector);
    if (!dialog) {
      console.warn(
        `[Modal] Aucun <dialog> trouvé pour le sélecteur "${selector}"`,
      );
      return;
    }
    openDialog(dialog, toggle);
  },

  close(selector: string): void {
    const dialog = document.querySelector<HTMLDialogElement>(selector);
    if (!dialog) {
      console.warn(
        `[Modal] Aucun <dialog> trouvé pour le sélecteur "${selector}"`,
      );
      return;
    }
    closeDialog(dialog);
  },

  toggle(selector: string, toggle: DialogToggle = 'modal'): void {
    const dialog = document.querySelector<HTMLDialogElement>(selector);
    if (!dialog) {
      console.warn(
        `[Modal] Aucun <dialog> trouvé pour le sélecteur "${selector}"`,
      );
      return;
    }
    if (dialog.open) {
      closeDialog(dialog);
    } else {
      openDialog(dialog, toggle);
    }
  },
};
