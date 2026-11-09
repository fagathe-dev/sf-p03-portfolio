// =============================================================================
// services/theme.ts — Mode d'affichage : 'auto' | 'light' | 'dark'
// -----------------------------------------------------------------------------
// - Mémorise le choix dans localStorage (clé "ds-theme").
// - Applique le thème résolu sur <html data-ui-theme="light|dark"> et garantit
//   la surface Glassmorphism <html data-ui-surface="glass">.
// - En mode 'auto', suit le réglage de l'appareil (prefers-color-scheme).
// - Synchronise les onglets ouverts, les sélecteurs [data-ds-theme-switch]
//   et notifie les abonnés.
// =============================================================================

export type ThemeMode = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  theme: ResolvedTheme;
}

type ThemeListener = (state: ThemeState) => void;

export const THEME_STORAGE_KEY = 'ds-theme';
const THEME_ATTRIBUTE = 'data-ui-theme';
const SURFACE_ATTRIBUTE = 'data-ui-surface';
const MODES: readonly ThemeMode[] = ['auto', 'light', 'dark'];

export const isThemeMode = (value: unknown): value is ThemeMode =>
  MODES.includes(value as ThemeMode);

class ThemeService {
  private mode: ThemeMode;
  private readonly systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly listeners = new Set<ThemeListener>();

  constructor() {
    this.mode = this.readStoredMode();
    this.apply();

    // En mode auto, le thème suit les changements de réglage de l'appareil
    this.systemDark.addEventListener('change', () => {
      if (this.mode === 'auto') this.apply();
    });

    // Choix fait dans un autre onglet
    window.addEventListener('storage', (event) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      this.mode = isThemeMode(event.newValue) ? event.newValue : 'auto';
      this.apply();
    });
  }

  /** Préférence choisie : 'auto', 'light' ou 'dark'. */
  getMode(): ThemeMode {
    return this.mode;
  }

  /** Thème réellement affiché ('auto' résolu selon l'appareil). */
  getTheme(): ResolvedTheme {
    if (this.mode === 'auto') return this.systemDark.matches ? 'dark' : 'light';
    return this.mode;
  }

  getState(): ThemeState {
    return { mode: this.mode, theme: this.getTheme() };
  }

  /** Change et mémorise la préférence. */
  setMode(mode: ThemeMode): void {
    if (!isThemeMode(mode) || mode === this.mode) return;
    this.mode = mode;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Stockage indisponible (navigation privée…) : le choix vaut pour la page
    }
    this.apply();
  }

  /** Bascule rapide entre clair et sombre. */
  toggle(): void {
    const next: ThemeMode = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  /** Appelé à chaque changement ; retourne la fonction de désabonnement. */
  subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private readStoredMode(): ThemeMode {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return isThemeMode(stored) ? stored : 'auto';
    } catch {
      return 'auto';
    }
  }

  private apply(): void {
    const state = this.getState();
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, state.theme);
    if (!root.hasAttribute(SURFACE_ATTRIBUTE)) {
      root.setAttribute(SURFACE_ATTRIBUTE, 'glass');
    }
    this.listeners.forEach((listener) => listener(state));
    document.dispatchEvent(
      new CustomEvent<ThemeState>('ds:theme-change', { detail: state }),
    );
  }
}

/** Instance unique, partagée par tous les scripts de la page. */
export const themeService = new ThemeService();

/** Synchronise l'état visuel et ARIA d'un contrôle segmenté de thème. */
const syncSwitchControl = (root: HTMLElement, mode: ThemeMode): void => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-value]');
  buttons.forEach((btn) => {
    const active = btn.dataset.value === mode;
    btn.classList.toggle('is-selected', active);
    btn.setAttribute('aria-checked', String(active));
    btn.tabIndex = active ? 0 : -1;
  });
};

/**
 * Initialise tous les sélecteurs de thème `[data-ds-theme-switch]` présents
 * dans le DOM (compatible avec le SegmentedControl du Design System CDN et en
 * autonome).
 */
export const initThemeSwitcher = (): void => {
  const roots = document.querySelectorAll<HTMLElement>('[data-ds-theme-switch]');
  if (roots.length === 0) return;

  roots.forEach((root) => {
    // Synchronisation initiale avec le mode courant ('auto' | 'light' | 'dark')
    syncSwitchControl(root, themeService.getMode());

    // Écoute de l'événement ds:change émis par SegmentedControl du Design System
    root.addEventListener('ds:change', (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;
      if (detail && isThemeMode(detail.value)) {
        themeService.setMode(detail.value);
      }
    });

    // Gestion directe du clic sur un segment [data-value]
    root.addEventListener('click', (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-value]');
      if (!target || !root.contains(target)) return;
      const value = target.dataset.value;
      if (isThemeMode(value)) {
        themeService.setMode(value);
        syncSwitchControl(root, value);
      }
    });
  });

  // Maintient tous les sélecteurs synchronisés (ex: changement depuis un autre onglet)
  themeService.subscribe(({ mode }) => {
    roots.forEach((root) => syncSwitchControl(root, mode));
  });
};
