// =====================================================================
// CONFIGURATION DU RESTAURANT — tout ce qu'on modifie souvent est ici.
// TSUTSU est une marque FICTIVE (site de démonstration Pyke Studio).
// =====================================================================

// ---------------------------------------------------------------------
// POSITION DU PLAN (OpenStreetMap) — utilisée par le plan, le lien « Agrandir le plan »
// et les données Google. À REMPLACER par les coordonnées de l'adresse réelle du client
// (sur openstreetmap.org : clic droit sur l'adresse → « Afficher l'adresse »).
// Valeur actuelle : centre-ville de Metz (place Saint-Louis), position indicative.
// ---------------------------------------------------------------------
export const COORDONNEES_PLAN = { lat: 49.1167, lon: 6.1778 };

export const restaurant = {
  nom: 'TSUTSU',
  kanji: '筒', // tsutsu : « cylindre », la forme d'une feuille roulée
  slogan: 'Roulé à la main. Mangé dans la minute.',
  description:
    'TSUTSU, comptoir à temaki à Metz : des cônes de nori roulés à la main devant vous, à manger tout de suite tant que l’algue croque. 100 % halal, sur place ou en click & collect.',

  // Adresse fictive (la rue n'existe pas)
  adresse: {
    rue: '14 rue des Makis',
    codePostal: '57000',
    ville: 'Metz',
    pays: 'FR',
  },
  // Point affiché sur le plan : voir COORDONNEES_PLAN ci-dessous
  carte: COORDONNEES_PLAN,

  // Numéros FICTIFS : plage 06 39 98 xx xx réservée par l'ARCEP aux œuvres de fiction
  telephone: { affichage: '06 39 98 00 12', lien: '+33639980012' },
  whatsapp: '33639980012', // format international sans « + » (pour wa.me)
  email: 'bonjour@tsutsu.example',

  instagram: { pseudo: '@tsutsu.metz', url: 'https://www.instagram.com/tsutsu.metz' },

  site: 'https://tsutsu.pages.dev',
  realisePar: { nom: 'Pyke Studio', url: 'https://pykestudio.fr' },
};

// ---------------------------------------------------------------------
// HORAIRES — heure de Paris. jours : 0 = dimanche, 1 = lundi … 6 = samedi.
// Pour fermer un jour : retirez-le de « jours ». Format des heures : « HH:MM ».
// ---------------------------------------------------------------------
export const fuseau = 'Europe/Paris';

export const horaires = [
  { jours: [1, 2, 3, 4, 5, 6, 0], ouverture: '11:00', fermeture: '22:00' },
];

/** Texte affiché pour les horaires (doit correspondre au tableau ci-dessus). */
export const horairesTexte = [{ jours: 'Tous les jours', heures: '11h – 22h' }];

// Click & collect : créneaux de retrait
export const retrait = {
  pas: 15, // un créneau toutes les 15 minutes
  delaiPreparation: 15, // premier créneau au plus tôt 15 min après la commande
  dernierAvantFermeture: 15, // dernier créneau 15 min avant la fermeture
};

// Offre étudiante
export const offreEtudiante = {
  prix: 9.9,
  contenu: 'Un temaki + une boisson, sur présentation de la carte étudiante',
};

// Formulaires : clé Web3Forms lue dans la variable d'environnement PUBLIC_WEB3FORMS_KEY
export const web3formsKey: string = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
