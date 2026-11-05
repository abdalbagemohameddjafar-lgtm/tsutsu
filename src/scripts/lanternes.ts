// Lanternes cliquables : un clic (ou Entrée / Espace au clavier) les éteint ou les rallume.
document.querySelectorAll<HTMLButtonElement>('[data-lanterne]').forEach((b) => {
  b.addEventListener('click', () => {
    const eteinte = b.classList.toggle('eteinte');
    b.setAttribute('aria-pressed', String(!eteinte));
    b.setAttribute('aria-label', eteinte ? 'Lanterne éteinte : appuyer pour l’allumer' : 'Lanterne allumée : appuyer pour l’éteindre');
  });
});
