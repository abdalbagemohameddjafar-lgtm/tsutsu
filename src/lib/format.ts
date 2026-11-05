// Mise en forme des prix : 9.9 → « 9,90 € » (espace insécable avant l'euro).
const formateur = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const euros = (n: number) => `${formateur.format(n)}\u00a0€`;
