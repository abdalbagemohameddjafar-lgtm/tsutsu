// Apparitions au scroll : fondu + légère montée (0,35 s), une seule fois par élément.
// - L'animation part un peu AVANT que l'élément entre à l'écran (marge positive) : pas d'attente au scroll.
// - Ce qui est déjà visible au chargement, ou dans la rubrique visée par l'adresse (ex. /#infos),
//   s'affiche immédiatement, sans animation.
// Les styles sont dans global.css (actifs seulement avec JS et sans « réduire les animations »).
const elements = [...document.querySelectorAll<HTMLElement>('[data-apparition]')];

const montrer = (el: HTMLElement, immediat = false) => {
  if (immediat) el.classList.add('immediat');
  el.classList.add('visible');
};
const aLEcran = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
};
/** Tout ce qui est visible maintenant, plus la rubrique de l'ancre, s'affiche sans attendre. */
const afficherLeVisible = () => {
  const cible = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  elements.forEach((el) => {
    if (!el.classList.contains('visible') && (aLEcran(el) || cible?.contains(el))) montrer(el, true);
  });
};

if ('IntersectionObserver' in window) {
  afficherLeVisible();
  const obs = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        montrer(e.target as HTMLElement);
        obs.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px 12% 0px', threshold: 0 },
  );
  elements.forEach((el) => !el.classList.contains('visible') && obs.observe(el));
  // Après le chargement (et le recentrage éventuel sur une ancre), on revérifie ce qui est à l'écran.
  addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(afficherLeVisible)));
  addEventListener('hashchange', afficherLeVisible);
} else {
  elements.forEach((el) => montrer(el, true));
}
