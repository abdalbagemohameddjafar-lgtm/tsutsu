// Carte : filtres en pastilles + fenêtres détaillées (<dialog> natif : focus piégé, Échap ferme).

// ---------- Filtres ----------
const boutons = [...document.querySelectorAll<HTMLButtonElement>('[data-filtre]')];
const cartes = [...document.querySelectorAll<HTMLElement>('.roll-carte')];
const annonce = document.querySelector<HTMLElement>('[data-filtre-annonce]');
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

function filtrer(filtre: string) {
  boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === filtre)));
  let n = 0;
  cartes.forEach((c, i) => {
    const garde = filtre === 'tous' || (c.dataset.tags ?? '').split(' ').includes(filtre);
    c.hidden = !garde;
    if (garde) {
      n++;
      // petite réapparition décalée des cartes gardées
      if (!calme) {
        c.animate(
          [
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 420, delay: (n - 1) * 50, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
        );
      }
    }
    void i;
  });
  if (annonce) annonce.textContent = `${n} roll${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
}
boutons.forEach((b) => b.addEventListener('click', () => filtrer(b.dataset.filtre ?? 'tous')));

// ---------- Fenêtres détaillées ----------
let declencheur: HTMLElement | null = null;
document.querySelectorAll<HTMLButtonElement>('[data-ouvrir-roll]').forEach((b) =>
  b.addEventListener('click', () => {
    const d = document.getElementById(`roll-${b.dataset.ouvrirRoll}`) as HTMLDialogElement | null;
    if (!d) return;
    declencheur = b;
    d.showModal();
  }),
);
document.querySelectorAll<HTMLDialogElement>('dialog.modale').forEach((d) => {
  d.addEventListener('click', (e) => {
    const cible = e.target as HTMLElement;
    if (e.target === d || cible.closest('[data-fermer-modale]')) d.close();
  });
  d.addEventListener('close', () => declencheur?.focus());
});
