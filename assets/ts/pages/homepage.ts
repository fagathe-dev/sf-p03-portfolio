// =============================================================================
// homepage.ts — Interactions de la page d'accueil
// =============================================================================
import { $, FormManager, fetchAPI, ApiError } from 'core-ts';
 
// ── initNavbarScroll ──────────────────────────────────────────────────────────
// IntersectionObserver sur #hero — bascule .navbar--scrolled dès que le hero
// sort du viewport. Le CSS gère la transition visuelle.
const initNavbarScroll = (): void => {
  const navbar = $('#navbar') as HTMLElement;
  const hero = $('#hero') as HTMLElement;
 
  if (!navbar || !hero) return;
 
  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 },
  );
 
  observer.observe(hero);
};
 
// ── initBurger ────────────────────────────────────────────────────────────────
// Toggle .is-open sur #navbar-menu-mobile, sync aria-expanded / aria-hidden.
// Fermeture : clic sur lien mobile, clic en dehors du #navbar.
const initBurger = (): void => {
  const burger = $('#navbar-burger') as HTMLButtonElement;
  const menu = $('#navbar-menu-mobile') as HTMLElement;
  const navbar = $('#navbar') as HTMLElement;
 
  if (!burger || !menu) return;
 
  const closeMenu = (): void => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
  };
 
  const openMenu = (): void => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
  };
 
  burger.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
 
  const mobileLinks = $<HTMLAnchorElement>(
    '.navbar__mobile-link',
    true,
  ) as NodeListOf<HTMLAnchorElement> | null;
 
  mobileLinks?.forEach((link) => link.addEventListener('click', closeMenu));
 
  document.addEventListener('click', (event: MouseEvent) => {
    if (navbar && !navbar.contains(event.target as Node)) closeMenu();
  });
};
 
// ── initSmoothScroll ──────────────────────────────────────────────────────────
// Intercept a[href^="#"], scrollIntoView smooth + history.pushState.
// Le scroll-margin-top est géré en CSS — aucun calcul JS.
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
  const formEl = $('#contact-form') as HTMLFormElement;
  if (!formEl) return;
 
  const submitBtn = $('#contact-submit') as HTMLButtonElement;
  const feedback = $('#contact-feedback') as HTMLElement;
  const action = formEl.dataset['action'] ?? '';
 
  // ── FormManager ─────────────────────────────────────────────────────────────
  const manager = new FormManager({ form: formEl });
 
  // ── Champ conditionnel link_proposition (UX uniquement) ─────────────────────
  const subjectSelect = $('#contact-subject') as HTMLSelectElement;
  const linkWrapper = $('#contact-link-wrapper') as HTMLElement;
  const linkInput = $('#contact-link') as HTMLInputElement;
 
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
    subjectSelect.addEventListener('change', () => toggleLinkField(subjectSelect.value));
  }
 
  // ── Helpers feedback ────────────────────────────────────────────────────────
  const setFeedback = (text: string, type: 'success' | 'error'): void => {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `contact__feedback is-${type}`;
  };
 
  const clearFeedback = (): void => {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className = 'contact__feedback';
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
      payload.consent_data_usage = ($('[name="consent_data_usage"]') as HTMLInputElement)?.checked ?? false;
 
      // Retire link_proposition si le champ est masqué pour ne pas polluer le DTO
      if (linkWrapper?.hidden) {
        delete (payload as Record<string, unknown>)['link_proposition'];
      }
 
      const response = await fetchAPI<{ success: boolean; message?: string }>(
        action,
        { method: 'POST', body: payload as unknown as BodyInit },
      );
 
      if (response.data.success) {
        setFeedback(
          response.data.message ?? 'Votre message a bien été envoyé. Je vous répondrai rapidement !',
          'success',
        );
        manager.reset();
        if (subjectSelect) toggleLinkField('');
      } else {
        setFeedback(
          response.data.message ?? 'Une erreur est survenue. Veuillez réessayer.',
          'error',
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // 422 — violations retournées par le Validator Symfony
        // La clé des errors correspond au nom du champ HTML (snake_case)
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
        setFeedback('Erreur réseau. Vérifiez votre connexion et réessayez.', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  });
};
 
// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initBurger();
  initSmoothScroll();
  initContactForm();

  const formContactSubjectEl = $('#contact-subject') as HTMLSelectElement;
  const formContactPropositionLinkEl = $(
    '#contact-link-wrapper',
  ) as HTMLElement;

  formContactPropositionLinkEl.style.display = 'none';

  formContactSubjectEl.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (['job_offer', 'project_proposition'].includes(selectedValue)) {
      formContactPropositionLinkEl.style.display = 'block';
    } else {
      formContactPropositionLinkEl.style.display = 'none';
      const formContactPropositionLinkInputEl = $(
        '#contact-link',
      ) as HTMLInputElement;
      if (formContactPropositionLinkInputEl) {
        formContactPropositionLinkInputEl.value = '';
      }
    }
  });
});
