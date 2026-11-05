// Réservation : validation côté navigateur puis envoi à Web3Forms (site 100 % statique).
// Sans clé configurée (PUBLIC_WEB3FORMS_KEY), le formulaire indique qu'il s'agit d'une démo.
import { maintenantParis } from '../lib/horaires';

const form = document.querySelector<HTMLFormElement>('[data-reservation]');

if (form) {
  const cle = form.dataset.cle ?? '';
  const retour = form.querySelector<HTMLElement>('[data-reservation-retour]')!;
  const champDate = form.elements.namedItem('date') as HTMLInputElement;

  // Date minimale = aujourd'hui (heure de Paris)
  const ajd = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date()); // AAAA-MM-JJ
  champDate.min = ajd;

  const erreur = (nom: string, message: string) => {
    const champ = form.elements.namedItem(nom) as HTMLInputElement;
    const zone = form.querySelector<HTMLElement>(`[data-erreur="${nom}"]`);
    if (!zone) return !message;
    zone.id = `resa-${nom}-err`;
    zone.textContent = message;
    zone.hidden = !message;
    champ.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) champ.setAttribute('aria-describedby', zone.id);
    else champ.removeAttribute('aria-describedby');
    return !message;
  };

  function valider() {
    const d = new FormData(form!);
    const tel = String(d.get('telephone') ?? '').replace(/[\s.-]/g, '');
    const date = String(d.get('date') ?? '');
    const heure = String(d.get('heure') ?? '');
    let msgHeure = heure ? '' : 'Choisissez une heure.';
    if (heure && date === ajd) {
      const [h, m] = heure.split(':').map(Number);
      if (h * 60 + m <= maintenantParis().minutes + 30) msgHeure = 'Choisissez une heure au moins 30 min plus tard.';
    }
    const resultats = [
      erreur('nom', String(d.get('nom') ?? '').trim().length >= 2 ? '' : 'Indiquez votre nom.'),
      erreur('telephone', /^(\+33|0)[1-9]\d{8}$/.test(tel) ? '' : 'Indiquez un numéro valide (ex. 06 12 34 56 78).'),
      erreur('date', !date ? 'Choisissez une date.' : date < ajd ? 'Cette date est déjà passée.' : ''),
      erreur('heure', msgHeure),
    ];
    if (resultats.includes(false)) {
      form!.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return null;
    }
    return d;
  }

  // On efface l'erreur d'un champ dès qu'il est corrigé
  form.addEventListener('input', (e) => {
    const champ = e.target as HTMLInputElement;
    if (champ.getAttribute('aria-invalid') === 'true') erreur(champ.name, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = valider();
    if (!d) return;
    if (d.get('botcheck')) return; // robot

    if (!cle) {
      retour.textContent =
        'Site de démonstration : la réservation n’est pas envoyée (clé Web3Forms non configurée). Le formulaire et sa validation fonctionnent.';
      return;
    }
    const bouton = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    bouton.disabled = true;
    retour.textContent = 'Envoi en cours…';
    try {
      const date = new Date(`${d.get('date')}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      const rep = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: cle,
          subject: `Réservation — ${d.get('nom')} — ${date} ${d.get('heure')}`,
          from_name: 'TSUTSU — site web',
          nom: d.get('nom'),
          telephone: d.get('telephone'),
          date,
          heure: d.get('heure'),
          personnes: d.get('personnes'),
        }),
      });
      const json = await rep.json().catch(() => ({}));
      if (!rep.ok || json.success === false) throw new Error();
      retour.textContent = `C’est noté pour ${d.get('personnes')} le ${date} à ${String(d.get('heure')).replace(':', 'h')}. Nous vous rappelons pour confirmer.`;
      form.reset();
    } catch {
      retour.textContent = 'L’envoi n’a pas fonctionné. Réessayez ou appelez-nous.';
    } finally {
      bouton.disabled = false;
    }
  });
}
