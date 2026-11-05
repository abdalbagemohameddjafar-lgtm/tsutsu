// Le tube « sticky » : il change d'état selon le bloc de la section « Un tube » visible
// (étui → rouleau → enrobage) et tourne / se déplace légèrement pendant le défilement.
const tube = document.querySelector<HTMLElement>('#tube-collant');
const zone = document.querySelector<HTMLElement>('[data-zone-tube]');
const blocs = [...document.querySelectorAll<HTMLElement>('[data-etape]')];
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (tube && zone) {
  zone.dataset.etat = 'repos';
  // ---------- État selon le bloc au centre de l'écran ----------
  const obs = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        const bloc = e.target as HTMLElement;
        if (e.isIntersecting) {
          tube.dataset.etat = bloc.dataset.etape ?? 'repos';
          zone.dataset.etat = tube.dataset.etat; // l'ensō et la phrase verticale suivent l'état
          blocs.forEach((b) => b.classList.toggle('actif', b === bloc));
        }
      }
    },
    { rootMargin: '-45% 0px -45% 0px' }, // une bande fine au milieu de l'écran
  );
  blocs.forEach((b) => obs.observe(b));

  // Retour à l'état « repos » quand on remonte dans la bannière
  const hero = document.querySelector('.hero');
  if (hero) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.5) {
        tube.dataset.etat = 'repos';
        zone.dataset.etat = 'repos';
        blocs.forEach((b) => b.classList.remove('actif'));
      }
    }, { threshold: [0.5] }).observe(hero);
  }

  // ---------- Légère rotation au défilement ----------
  if (!calme) {
    let attente = false;
    const maj = () => {
      attente = false;
      const r = zone.getBoundingClientRect();
      const progres = Math.min(Math.max(-r.top / Math.max(r.height - innerHeight, 1), 0), 1);
      tube.style.setProperty('--tube-rotation', `${(progres - 0.5) * 14}deg`);
      tube.style.setProperty('--tube-decalage', `${Math.sin(progres * Math.PI) * -18}px`);
    };
    addEventListener('scroll', () => {
      if (!attente) {
        attente = true;
        requestAnimationFrame(maj);
      }
    }, { passive: true });
    maj();
  }
}
