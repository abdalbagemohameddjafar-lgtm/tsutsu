// =====================================================================
// Panier click & collect — JavaScript natif, aucune librairie.
// - Ajout depuis n'importe quel bouton [data-ajouter="<id du roll>"]
// - Ouverture par [data-ouvrir-panier], fermeture par [data-fermer-panier] ou Échap
// - Conservé dans localStorage (protégé par try/catch : navigation privée, stockage bloqué…)
// - Envoi : message WhatsApp pré-rempli, ou e-mail via Web3Forms (si la clé est configurée)
// =====================================================================
import { creneaux } from '../lib/horaires';
import { euros } from '../lib/format';

type Article = { id: string; nom: string; prix: number };
type Contenu = Record<string, number>; // id → quantité

const dialog = document.querySelector<HTMLDialogElement>('#panier');

if (dialog) {
  const catalogue: Article[] = JSON.parse(dialog.dataset.catalogue ?? '[]');
  const parId = new Map(catalogue.map((a) => [a.id, a]));
  const numeroWhatsapp = dialog.dataset.whatsapp ?? '';
  const cleWeb3forms = dialog.dataset.cle ?? '';
  const nomResto = dialog.dataset.nom ?? 'TSUTSU';
  const CLE = 'tsutsu-panier';

  const liste = dialog.querySelector<HTMLUListElement>('[data-panier-liste]')!;
  const total = dialog.querySelector<HTMLElement>('[data-panier-total]')!;
  const vide = dialog.querySelector<HTMLElement>('[data-panier-vide]')!;
  const contenuBloc = dialog.querySelector<HTMLElement>('[data-panier-contenu]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-panier-form]')!;
  const choixCreneau = dialog.querySelector<HTMLSelectElement>('[data-creneaux]')!;
  const jourCreneau = dialog.querySelector<HTMLElement>('[data-creneau-jour]')!;
  const retour = dialog.querySelector<HTMLElement>('[data-panier-retour]')!;

  // ---------- Stockage ----------
  function lire(): Contenu {
    try {
      const brut = JSON.parse(localStorage.getItem(CLE) ?? '{}');
      const propre: Contenu = {};
      for (const [id, q] of Object.entries(brut)) {
        if (parId.has(id) && Number.isInteger(q) && (q as number) > 0) propre[id] = Math.min(q as number, 50);
      }
      return propre;
    } catch {
      return {};
    }
  }
  function ecrire(c: Contenu) {
    try {
      localStorage.setItem(CLE, JSON.stringify(c));
    } catch {
      /* stockage indisponible : le panier fonctionne quand même jusqu'au rechargement */
    }
  }
  let panier = lire();

  // ---------- Affichage ----------
  const nbArticles = () => Object.values(panier).reduce((a, b) => a + b, 0);
  const montant = () => Object.entries(panier).reduce((s, [id, q]) => s + (parId.get(id)?.prix ?? 0) * q, 0);

  function rendre() {
    const n = nbArticles();
    document.querySelectorAll<HTMLElement>('[data-compte-panier]').forEach((b) => {
      b.textContent = String(n);
      b.hidden = n === 0;
    });
    document.querySelectorAll<HTMLElement>('[data-compte-panier-texte]').forEach((b) => {
      b.textContent = n ? `, ${n} article${n > 1 ? 's' : ''} dans le panier` : '';
    });

    vide.hidden = n > 0;
    contenuBloc.hidden = n === 0;
    liste.replaceChildren(
      ...Object.entries(panier).map(([id, q]) => {
        const a = parId.get(id)!;
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="ligne-nom"></span>
          <span class="ligne-prix"></span>
          <span class="quantite">
            <button type="button" data-moins aria-label="Retirer un ${a.nom}">−</button>
            <output aria-live="polite"></output>
            <button type="button" data-plus aria-label="Ajouter un ${a.nom}">+</button>
          </span>`;
        li.querySelector('.ligne-nom')!.textContent = a.nom;
        li.querySelector('.ligne-prix')!.textContent = euros(a.prix * q);
        li.querySelector('output')!.textContent = String(q);
        li.querySelector('[data-moins]')!.addEventListener('click', () => changer(id, -1, true));
        li.querySelector('[data-plus]')!.addEventListener('click', () => changer(id, +1, true));
        return li;
      }),
    );
    total.textContent = euros(montant());
  }

  function changer(id: string, delta: number, garderFocus = false) {
    const q = (panier[id] ?? 0) + delta;
    if (q <= 0) delete panier[id];
    else panier[id] = Math.min(q, 50);
    ecrire(panier);
    // On garde le focus clavier sur le même bouton après le nouveau rendu
    const actif = document.activeElement as HTMLElement | null;
    const quel = actif?.hasAttribute('data-plus') ? 'data-plus' : actif?.hasAttribute('data-moins') ? 'data-moins' : null;
    const index = [...liste.children].findIndex((li) => li.contains(actif));
    rendre();
    if (garderFocus && quel && index >= 0) {
      const li = liste.children[Math.min(index, liste.children.length - 1)];
      (li?.querySelector(`[${quel}]`) as HTMLElement | null)?.focus();
      if (!li) dialog!.querySelector<HTMLElement>('[data-fermer-panier]')?.focus();
    }
  }

  function remplirCreneaux() {
    const { jour, liste: options } = creneaux();
    jourCreneau.textContent = jour ? `(${jour.toLowerCase()})` : '';
    const ancien = choixCreneau.value;
    choixCreneau.replaceChildren(
      new Option('Choisir un créneau', ''),
      ...options.map((c) => new Option(c.libelle, c.valeur)),
    );
    if (options.some((o) => o.valeur === ancien)) choixCreneau.value = ancien;
    choixCreneau.dataset.jour = jour;
  }

  // ---------- Ouverture / fermeture ----------
  let declencheur: HTMLElement | null = null;
  function ouvrir(source?: HTMLElement | null) {
    declencheur = source ?? (document.activeElement as HTMLElement);
    remplirCreneaux();
    retour.textContent = '';
    rendre();
    if (!dialog!.open) dialog!.showModal(); // showModal : focus piégé dans le tiroir, Échap ferme
  }
  function fermer() {
    dialog!.close();
  }
  dialog.addEventListener('close', () => declencheur?.focus());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) fermer(); // clic sur le fond assombri
  });
  document.addEventListener('click', (e) => {
    const cible = e.target as HTMLElement;
    const ouvreur = cible.closest<HTMLElement>('[data-ouvrir-panier]');
    if (ouvreur) {
      e.preventDefault();
      ouvrir(ouvreur);
    }
    const ajout = cible.closest<HTMLElement>('[data-ajouter]');
    if (ajout) {
      const id = ajout.dataset.ajouter!;
      if (!parId.has(id)) return;
      changer(id, +1);
      // Retour visuel sur le bouton, sans ouvrir le panier (on continue à choisir)
      const texte = ajout.querySelector('[data-texte-bouton]') ?? ajout;
      const avant = texte.textContent;
      ajout.classList.add('ajoute');
      texte.textContent = 'Ajouté ✓';
      setTimeout(() => {
        ajout.classList.remove('ajoute');
        texte.textContent = avant;
      }, 1200);
      const annonce = document.querySelector('[data-annonce-panier]');
      if (annonce) annonce.textContent = `${parId.get(id)!.nom} ajouté au panier.`;
    }
    if (cible.closest('[data-fermer-panier]')) fermer();
  });

  // ---------- Validation et envoi ----------
  const erreur = (nom: string, message: string) => {
    const champ = form.elements.namedItem(nom) as HTMLInputElement;
    const zone = form.querySelector<HTMLElement>(`[data-erreur="${nom}"]`)!;
    champ.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) champ.setAttribute('aria-describedby', `${nom}-err`);
    zone.id = `${nom}-err`;
    zone.textContent = message;
    zone.hidden = !message;
    return !message;
  };
  function valider() {
    const d = new FormData(form);
    const tel = String(d.get('telephone') ?? '').replace(/[\s.-]/g, '');
    const ok = [
      erreur('creneau', d.get('creneau') ? '' : 'Choisissez un créneau de retrait.'),
      erreur('nom', String(d.get('nom') ?? '').trim().length >= 2 ? '' : 'Indiquez votre nom.'),
      erreur('telephone', /^(\+33|0)[1-9]\d{8}$/.test(tel) ? '' : 'Indiquez un numéro valide (ex. 06 12 34 56 78).'),
    ];
    if (ok.includes(false)) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return null;
    }
    const creneauTexte = choixCreneau.selectedOptions[0]?.text ?? '';
    return {
      nom: String(d.get('nom')).trim(),
      telephone: String(d.get('telephone')).trim(),
      retrait: `${choixCreneau.dataset.jour ?? ''} à ${creneauTexte}`.trim(),
    };
  }
  function recapitulatif(client: { nom: string; telephone: string; retrait: string }) {
    const lignes = Object.entries(panier).map(([id, q]) => {
      const a = parId.get(id)!;
      return `• ${q} × ${a.nom} — ${euros(a.prix * q)}`;
    });
    return [
      `Bonjour ${nomResto} ! Nouvelle commande click & collect :`,
      '',
      ...lignes,
      '',
      `Total : ${euros(montant())} (paiement sur place)`,
      `Retrait : ${client.retrait}`,
      `Nom : ${client.nom}`,
      `Téléphone : ${client.telephone}`,
    ].join('\n');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bouton = (e as SubmitEvent).submitter as HTMLButtonElement | null;
    const mode = bouton?.dataset.envoi ?? 'whatsapp';
    if (!nbArticles()) return;
    const client = valider();
    if (!client) return;
    const message = recapitulatif(client);

    if (mode === 'whatsapp') {
      window.open(`https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      retour.textContent = 'WhatsApp s’est ouvert avec votre commande : il ne reste qu’à appuyer sur « Envoyer ».';
      return;
    }

    // Envoi par e-mail (Web3Forms)
    if (!cleWeb3forms) {
      retour.textContent = 'Envoi par e-mail indisponible sur cette démo (clé Web3Forms non configurée). Utilisez WhatsApp.';
      return;
    }
    bouton!.disabled = true;
    retour.textContent = 'Envoi en cours…';
    try {
      const rep = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: cleWeb3forms,
          subject: `Commande click & collect — ${client.nom} — ${client.retrait}`,
          from_name: `${nomResto} — site web`,
          message,
        }),
      });
      const json = await rep.json().catch(() => ({}));
      if (!rep.ok || json.success === false) throw new Error();
      retour.textContent = 'Commande envoyée ! Nous vous rappelons si besoin. À tout à l’heure.';
      panier = {};
      ecrire(panier);
      form.reset();
      rendre();
    } catch {
      retour.textContent = 'L’envoi n’a pas fonctionné. Réessayez ou passez par WhatsApp.';
    } finally {
      bouton!.disabled = false;
    }
  });

  // Synchronisation entre onglets
  window.addEventListener('storage', (e) => {
    if (e.key === CLE) {
      panier = lire();
      rendre();
    }
  });

  rendre();
}
