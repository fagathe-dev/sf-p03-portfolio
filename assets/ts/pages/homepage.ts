// =============================================================================
// homepage.ts — Interactions de la page d'accueil (Design System Zéro BEM)
// =============================================================================
import { $, ApiError, FormManager, fetchAPI } from 'core-ts';

// ── initNavbarScroll ──────────────────────────────────────────────────────────
// IntersectionObserver sur #hero — bascule .is-scrolled sur #navbar dès que le
// hero sort du viewport. Le CSS gère la transition visuelle.
const initNavbarScroll = (): void => {
  const navbar = $('#navbar') as HTMLElement | null;
  const hero = $('#hero') as HTMLElement | null;

  if (!navbar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('is-scrolled', !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  observer.observe(hero);
};

// ── initMobileNavClose ────────────────────────────────────────────────────────
// L'ouverture du menu mobile est gérée par data-ds-toggle="collapse" dans main.ts.
// Ce handler referme le panneau repliable lorsqu'un lien de section est cliqué.
const initMobileNavClose = (): void => {
  const burger = $('#navbar-burger') as HTMLButtonElement | null;
  const collapse = $('#navbar-collapse') as HTMLElement | null;

  if (!burger || !collapse) return;

  const navLinks = collapse.querySelectorAll<HTMLAnchorElement>('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (collapse.classList.contains('show')) {
        collapse.classList.remove('show');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });
};

// ── initSmoothScroll ──────────────────────────────────────────────────────────
// Intercept a[href^="#"], scrollIntoView smooth + history.pushState.
// Le scroll-margin-block-start est géré en CSS — aucun calcul JS.
const initSmoothScroll = (): void => {
  const anchors = $<HTMLAnchorElement>(
    'a[href^="#"]',
    true,
  ) as NodeListOf<HTMLAnchorElement> | null;

  if (!anchors) return;

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (event: MouseEvent) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });
};

// ── initContactForm ───────────────────────────────────────────────────────────
// Validation déléguée intégralement à Symfony (backend).
// Côté client :
//   - FormManager gère l'affichage des erreurs retournées par le serveur (422)
//   - toggleLinkField assure l'UX du champ conditionnel link_proposition
//   - fetchAPI envoie le payload JSON et reçoit la réponse structurée

// Subjects qui affichent le champ link_proposition — miroir de ContactSubject::requiresLink()
const SUBJECTS_WITH_LINK = new Set(['job_offer', 'project_proposition']);

const initContactForm = (): void => {
  const formEl = $('#contact-form') as HTMLFormElement | null;
  if (!formEl) return;

  const submitBtn = $('#contact-submit') as HTMLButtonElement | null;
  const feedback = $('#contact-feedback') as HTMLElement | null;
  const action = formEl.dataset['action'] ?? '';

  // ── FormManager ─────────────────────────────────────────────────────────────
  const manager = new FormManager({ form: formEl });

  // ── Champ conditionnel link_proposition (UX uniquement) ─────────────────────
  const subjectSelect = $('#contact-subject') as HTMLSelectElement | null;
  const linkWrapper = $('#contact-link-wrapper') as HTMLElement | null;
  const linkInput = $('#contact-link') as HTMLInputElement | null;

  const toggleLinkField = (subject: string): void => {
    if (!linkWrapper || !linkInput) return;

    const isRequired = SUBJECTS_WITH_LINK.has(subject);

    if (isRequired) {
      linkWrapper.hidden = false;
      linkWrapper.setAttribute('aria-hidden', 'false');
      linkInput.setAttribute('required', '');
      linkInput.setAttribute('aria-required', 'true');
    } else {
      linkWrapper.hidden = true;
      linkWrapper.setAttribute('aria-hidden', 'true');
      linkInput.removeAttribute('required');
      linkInput.removeAttribute('aria-required');
      linkInput.value = '';
      linkInput.classList.remove('is-invalid', 'is-valid');
    }
  };

  if (subjectSelect) {
    toggleLinkField(subjectSelect.value);
    subjectSelect.addEventListener('change', () =>
      toggleLinkField(subjectSelect.value),
    );
  }

  // ── Helpers feedback ────────────────────────────────────────────────────────
  const setFeedback = (text: string, type: 'success' | 'error'): void => {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `contact-feedback is-${type}`;
  };

  const clearFeedback = (): void => {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className = 'contact-feedback';
  };

  const setSubmitLoading = (loading: boolean): void => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Envoi en cours…' : 'Envoyer le message';
  };

  // ── Soumission ───────────────────────────────────────────────────────────────
  formEl.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();
    clearFeedback();
    setSubmitLoading(true);

    try {
      const payload = manager.getData();
      payload.consent_data_usage =
        ($('[name="consent_data_usage"]') as HTMLInputElement)?.checked ??
        false;

      // Retire link_proposition si le champ est masqué pour ne pas polluer le DTO
      if (linkWrapper?.hidden) {
        delete (payload as Record<string, unknown>)['link_proposition'];
      }

      // retries: 0 — un POST qui envoie des e-mails n'est pas idempotent : fetchAPI
      // retente par défaut toute réponse non 2xx (422, 500…), soit 3 envois par clic
      const response = await fetchAPI<{ success: boolean; message?: string }>(
        action,
        { method: 'POST', body: payload as unknown as BodyInit, retries: 0 },
      );

      if (response.data.success) {
        setFeedback(
          response.data.message ??
            'Votre message a bien été envoyé. Je vous répondrai rapidement !',
          'success',
        );
        manager.reset();
        if (subjectSelect) toggleLinkField('');
      } else {
        setFeedback(
          response.data.message ??
            'Une erreur est survenue. Veuillez réessayer.',
          'error',
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // 422 — violations retournées par le Validator Symfony
        const serverViolations = error.getValidationErrors();
        if (serverViolations) {
          manager.validateData(serverViolations);
          setFeedback('Veuillez corriger les erreurs ci-dessus.', 'error');
          return;
        }
        setFeedback(
          error.getErrorMessage() ?? 'Une erreur serveur est survenue.',
          'error',
        );
      } else {
        setFeedback(
          'Erreur réseau. Vérifiez votre connexion et réessayez.',
          'error',
        );
      }
    } finally {
      setSubmitLoading(false);
    }
  });
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNavClose();
  initSmoothScroll();
  initContactForm();
});
