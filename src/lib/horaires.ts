// Calculs d'horaires (heure de Paris), utilisés dans le navigateur :
// statut « Ouvert maintenant / Fermé · ouvre à 11h » et créneaux de retrait du panier.
import { fuseau, horaires, retrait } from '../config/restaurant';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

/** « 11:00 » → 660 (minutes depuis minuit) */
const enMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
/** 660 → « 11h », 690 → « 11h30 » */
export const enTexte = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h}h${m ? String(m).padStart(2, '0') : ''}`;
};
/** 660 → « 11:00 » */
const enHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Jour de la semaine (0 = dimanche) et minutes écoulées, à l'heure de Paris. */
export function maintenantParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: fuseau,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const val = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const jour = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
  return { jour, minutes: Number(val('hour')) * 60 + Number(val('minute')) };
}

/** Plages d'ouverture d'un jour donné, en minutes. */
function plages(jour: number) {
  return horaires
    .filter((h) => h.jours.includes(jour))
    .map((h) => ({ debut: enMinutes(h.ouverture), fin: enMinutes(h.fermeture) }))
    .sort((a, b) => a.debut - b.debut);
}

/** ja : mention des enseignes japonaises — 営業中 (eigyō-chū, « ouvert ») / 準備中 (junbi-chū, « en préparation »). */
export type Statut = { ouvert: boolean; texte: string; ja: string };

/** « Ouvert maintenant · jusqu'à 22h » ou « Fermé · ouvre à 11h » (ou « … ouvre mardi à 11h »). */
export function statut(date = new Date()): Statut {
  const { jour, minutes } = maintenantParis(date);
  const enCours = plages(jour).find((p) => minutes >= p.debut && minutes < p.fin);
  if (enCours) return { ouvert: true, ja: '営業中', texte: `Ouvert maintenant · jusqu’à ${enTexte(enCours.fin)}` };

  const plusTard = plages(jour).find((p) => p.debut > minutes);
  if (plusTard) return { ouvert: false, ja: '準備中', texte: `Fermé · ouvre à ${enTexte(plusTard.debut)}` };
  for (let i = 1; i <= 7; i++) {
    const j = (jour + i) % 7;
    const p = plages(j)[0];
    if (p) return { ouvert: false, ja: '準備中', texte: `Fermé · ouvre ${i === 1 ? 'demain' : JOURS[j]} à ${enTexte(p.debut)}` };
  }
  return { ouvert: false, ja: '準備中', texte: 'Fermé' };
}

export type Creneau = { valeur: string; libelle: string };

/** Créneaux de retrait toutes les 15 min : aujourd'hui s'il en reste, sinon le prochain jour ouvert. */
export function creneaux(date = new Date()): { jour: string; liste: Creneau[] } {
  const { jour, minutes } = maintenantParis(date);
  for (let i = 0; i <= 7; i++) {
    const j = (jour + i) % 7;
    const liste: Creneau[] = [];
    const auPlusTot = i === 0 ? minutes + retrait.delaiPreparation : 0;
    for (const p of plages(j)) {
      const dernier = p.fin - retrait.dernierAvantFermeture;
      let m = Math.max(p.debut, Math.ceil(auPlusTot / retrait.pas) * retrait.pas);
      for (; m <= dernier; m += retrait.pas) liste.push({ valeur: enHHMM(m), libelle: enTexte(m) });
    }
    if (liste.length) {
      const nomJour = i === 0 ? 'Aujourd’hui' : i === 1 ? 'Demain' : JOURS[j][0].toUpperCase() + JOURS[j].slice(1);
      return { jour: nomJour, liste };
    }
  }
  return { jour: '', liste: [] };
}
