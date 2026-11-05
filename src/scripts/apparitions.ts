// Apparitions au scroll : fondu + légère montée, une seule fois par élément.
// Les styles sont dans global.css (actifs seulement avec JS et sans « réduire les animations »).
const elements = document.querySelectorAll<HTMLElement>('[data-apparition]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  elements.forEach((el) => obs.observe(el));
} else {
  elements.forEach((el) => el.classList.add('visible'));
}
