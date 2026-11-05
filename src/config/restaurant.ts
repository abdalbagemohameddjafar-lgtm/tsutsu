// =====================================================================
// CONFIGURATION DU RESTAURANT — tout ce qu'on modifie souvent est ici.
// TSUTSU est une marque FICTIVE (site de démonstration Pyke Studio).
// =====================================================================

export const restaurant = {
  nom: 'TSUTSU',
  kanji: '筒', // « tube » en japonais
  slogan: 'Le sushi qui tient dans la main',
  description:
    'TSUTSU, sushis roulés minute et glissés dans un étui kraft, à manger dans la rue sans baguettes. 100 % halal, click & collect, Metz.',

  // Adresse fictive (la rue n'existe pas)
  adresse: {
    rue: '14 rue des Makis',
    codePostal: '57000',
    ville: 'Metz',
    pays: 'FR',
  },
  // Point affiché sur la carte : centre-ville de Metz (place Saint-Louis), position indicative
  carte: { lat: 49.1167, lon: 6.1778 },

  // Numéros FICTIFS : plage 06 39 98 xx xx réservée par l'ARCEP aux œuvres de fiction
  telephone: { affichage: '06 39 98 00 12', lien: '+33639980012' },
  whatsapp: '33639980012', // format international sans « + » (pour wa.me)
  email: 'bonjour@tsutsu.example',

  instagram: { pseudo: '@tsutsu.metz', url: 'https://www.instagram.com/tsutsu.metz' },

  site: 'https://tsutsu.pages.dev',
  realisePar: { nom: 'Pyke Studio', url: 'https://pyke-studio.netlify.app' },
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
  contenu: 'Un roll + une boisson, sur présentation de la carte étudiante',
};

// Formulaires : clé Web3Forms lue dans la variable d'environnement PUBLIC_WEB3FORMS_KEY
export const web3formsKey: string = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
