// =====================================================================
// Centrage des rubriques (même principe que sur Maison Ambre).
//
// 1. Un clic sur un lien vers une rubrique de l'accueil (« La carte », « Réserver »…) l'affiche
//    centrée dans la partie visible de l'écran, sous l'en-tête. Si elle est plus haute que l'écran,
//    elle s'affiche à partir de son début.
// 2. « Aimant » : quand on arrête de défiler tout près d'une rubrique marquée data-aimant, la page
//    finit de la centrer en douceur. Jamais de retenue du défilement, jamais pour les rubriques
//    plus hautes que l'écran (sauf data-haut), jamais si « réduire les animations » est activé.
//
// Repères dans le HTML :
//   data-centre  → l'élément précis à placer (dans la section visée par le lien)
//   data-haut    → l'élément se cale en haut, juste sous l'en-tête (au lieu d'être centré)
//   data-aimant  → l'élément participe à l'aimant
// Pas de CSS scroll-snap : il bloquait le défilement dans les longues listes (expérience Maison Ambre).
// =====================================================================

const entete = document.querySelector<HTMLElement>('.entete');
const hauteurEntete = () => entete?.getBoundingClientRect().height ?? 0;
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ESPACE_SOUS_MENU = 24;

/** Position réelle dans la page, sans tenir compte des animations d'apparition (décalages temporaires). */
const hautDansLaPage = (el: HTMLElement) => {
  let y = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
  return y;
};

const positionIdeale = (el: HTMLElement) => {
  const haut = hauteurEntete();
  const visible = innerHeight - haut;
  const debut = hautDansLaPage(el);
  if (el.hasAttribute('data-haut')) return debut - haut - ESPACE_SOUS_MENU;
  const hauteur = el.offsetHeight;
  const marge = hauteur < visible ? (visible - hauteur) / 2 : ESPACE_SOUS_MENU;
  return debut - haut - marge;
};

const centrer = (section: HTMLElement, douceur: ScrollBehavior = calme ? 'auto' : 'smooth') => {
  const cible = section.querySelector<HTMLElement>('[data-centre]') ?? section;
  scrollTo({ top: Math.max(0, positionIdeale(cible)), behavior: douceur });
};

const surAccueil = location.pathname === '/';
document.addEventListener('click', (e) => {
  const lien = (e.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
  if (!lien || !surAccueil) return;
  const url = new URL(lien.href);
  if (url.pathname !== '/' || !url.hash || url.hash === '#contenu') return;
  if (url.hash === '#top') return; // le logo remonte tout en haut normalement
  const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!section) return;
  e.preventDefault();
  history.pushState(null, '', url.hash);
  centrer(section);
});

// Arrivée depuis une autre page avec une adresse comme /#reserver
if (surAccueil && location.hash.length > 1 && location.hash !== '#top') {
  const section = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (section) addEventListener('load', () => centrer(section, 'auto'));
}

// ---------- Aimant ----------
const aimants = [...document.querySelectorAll<HTMLElement>('[data-aimant]')];
if (aimants.length && !calme) {
  let minuteur = 0;
  let doigtPose = false;
  let dernierePosition = scrollY;
  let sens = 0; // 1 = on descend, -1 = on remonte
  addEventListener('touchstart', () => (doigtPose = true), { passive: true });
  addEventListener('touchend', () => (doigtPose = false), { passive: true });

  const ajuster = () => {
    if (doigtPose || document.documentElement.classList.contains('menu-ouvert')) return;
    if (document.querySelector('dialog[open]')) return; // panier ou fiche produit ouverte
    const visible = innerHeight - hauteurEntete();
    for (const el of aimants) {
      if (!el.hasAttribute('data-haut') && el.offsetHeight >= visible * 0.95) continue;
      const ecart = positionIdeale(el) - scrollY;
      const distance = Math.abs(ecart);
      // Seulement si on est déjà proche (moins d'un cinquième d'écran), dans le sens du défilement ;
      // en arrière, seulement pour rattraper un tout petit dépassement.
      const memeSens = Math.sign(ecart) === sens;
      if (distance > 3 && distance < visible * 0.2 && (memeSens || distance < visible * 0.1)) {
        scrollTo({ top: scrollY + ecart, behavior: 'smooth' });
        return;
      }
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (scrollY !== dernierePosition) sens = Math.sign(scrollY - dernierePosition);
      dernierePosition = scrollY;
      clearTimeout(minuteur);
      minuteur = window.setTimeout(ajuster, 220); // la personne a arrêté de défiler
    },
    { passive: true },
  );
}
