// =====================================================================
// LA CARTE — modifiez ici les temaki : nom, description, prix, ingrédients,
// allergènes, tags et couleurs de l'illustration.
// Le site (section « La carte », page /carte, panier, données Google) se met
// à jour automatiquement.
// =====================================================================

/** Les 14 allergènes à déclarer (règlement UE 1169/2011). */
export const ALLERGENES = {
  gluten: 'Gluten',
  crustaces: 'Crustacés',
  oeufs: 'Œufs',
  poisson: 'Poisson',
  arachides: 'Arachides',
  soja: 'Soja',
  lait: 'Lait',
  fruitsCoque: 'Fruits à coque',
  celeri: 'Céleri',
  moutarde: 'Moutarde',
  sesame: 'Sésame',
  sulfites: 'Sulfites',
  lupin: 'Lupin',
  mollusques: 'Mollusques',
} as const;
export type Allergene = keyof typeof ALLERGENES;

export type Tag = 'vege' | 'epice' | 'bestseller';
export const TAGS: Record<Tag, string> = {
  vege: 'Végé',
  epice: 'Épicé',
  bestseller: 'Best-seller',
};

export type Roll = {
  id: string; // identifiant unique, sans espace (sert au panier)
  nom: string;
  nomJa: string; // nom en japonais, affiché en petit sous le nom (katakana / kanji)
  description: string; // une phrase courte
  prix: number; // en euros
  ingredients: string[];
  allergenes: Allergene[];
  tags: Tag[];
  /** Photo réelle (facultative) : fichier dans public/photos/, ex. '/photos/saumon-avocat.jpg'. Sans photo, l'illustration s'affiche. */
  photo?: string;
  photoWebp?: string;
  /** Illustration (temaki vu de côté) : couleurs de la garniture qui dépasse du cône, de la plus visible à la moins visible */
  visuel: {
    garniture: string[];
    topping?: 'tobiko' | 'sesame' | 'oignon' | 'piment';
  };
};

export const rolls: Roll[] = [
  {
    id: 'saumon-avocat',
    nom: 'Le Classique',
    nomJa: 'サーモンアボカド',
    description: 'Saumon frais, avocat crémeux et sésame grillé. Celui par qui tout commence.',
    prix: 9.9,
    ingredients: ['Riz vinaigré', 'Nori', 'Saumon frais', 'Avocat', 'Sésame grillé'],
    allergenes: ['poisson', 'sesame'],
    tags: ['bestseller'],
    visuel: { garniture: ['#F2845C', '#8DB255'], topping: 'sesame' },
  },
  {
    id: 'spicy-thon',
    nom: 'Le Spicy Thon',
    nomJa: 'スパイシーツナ',
    description: 'Thon, mayo sriracha maison, concombre et tobiko qui croque.',
    prix: 10.5,
    ingredients: ['Riz vinaigré', 'Nori', 'Thon', 'Mayonnaise sriracha', 'Concombre', 'Tobiko'],
    allergenes: ['poisson', 'oeufs'],
    tags: ['epice'],
    visuel: { garniture: ['#C8334A', '#E8763A', '#9CC46A'], topping: 'tobiko' },
  },
  {
    id: 'mangue-avocat',
    nom: 'Le Mango',
    nomJa: 'マンゴーアボカド',
    description: 'Mangue, avocat, concombre et fromage frais. Frais, doux, 100 % végé.',
    prix: 8.9,
    ingredients: ['Riz vinaigré', 'Nori', 'Mangue', 'Avocat', 'Concombre', 'Fromage frais'],
    allergenes: ['lait'],
    tags: ['vege'],
    visuel: { garniture: ['#F5B331', '#8DB255', '#F7F1E3'], topping: 'sesame' },
  },
  {
    id: 'poulet-teriyaki',
    nom: 'Le Teriyaki',
    nomJa: '照り焼きチキン',
    description: 'Poulet halal mariné teriyaki, salade croquante et oignons frits.',
    prix: 10.9,
    ingredients: ['Riz vinaigré', 'Nori', 'Poulet halal', 'Sauce teriyaki', 'Salade', 'Oignons frits', 'Sésame'],
    allergenes: ['gluten', 'soja', 'sesame'],
    tags: ['bestseller'],
    visuel: { garniture: ['#A8642E', '#7FB049'], topping: 'oignon' },
  },
  {
    id: 'crevette-tempura',
    nom: 'Le Tempura',
    nomJa: '海老天',
    description: 'Crevette tempura encore tiède, avocat et sauce sucrée-salée.',
    prix: 10.9,
    ingredients: ['Riz vinaigré', 'Nori', 'Crevette tempura', 'Avocat', 'Sauce sucrée-salée'],
    allergenes: ['crustaces', 'gluten', 'oeufs', 'soja'],
    tags: [],
    visuel: { garniture: ['#F0A066', '#E9C77B', '#8DB255'], topping: 'tobiko' },
  },
  {
    id: 'tofu-spicy',
    nom: 'Le Tofu Fire',
    nomJa: '辛口豆腐',
    description: 'Tofu mariné, carotte, concombre et piment frais. Végé et qui pique.',
    prix: 9.5,
    ingredients: ['Riz vinaigré', 'Nori', 'Tofu mariné', 'Carotte', 'Concombre', 'Piment frais', 'Sésame'],
    allergenes: ['soja', 'sesame'],
    tags: ['vege', 'epice'],
    visuel: { garniture: ['#EFE3C8', '#F08A2E', '#9CC46A'], topping: 'piment' },
  },
];

/** Une recette est « sans gluten » si le gluten ne figure pas dans ses allergènes. */
export const sansGluten = (r: Roll) => !r.allergenes.includes('gluten');

// Ce que tous les temaki ont en commun (section « Ce qu'il y a dans le cône »), 4 éléments maximum.
// Rien de propre à une seule recette ici : la garniture précise de chaque temaki est dans « rolls ».
export const ingredientsVedettes = [
  { nom: 'Riz vinaigré', texte: 'Riz japonais cuit plusieurs fois par service, assaisonné au vinaigre de riz et servi encore tiède.' },
  { nom: 'Nori grillée', texte: 'Une feuille d’algue grillée, roulée au dernier moment : c’est elle qui fait le croquant.' },
  { nom: 'Garniture fraîche', texte: 'Poisson, poulet, tofu ou légumes, coupés à la commande, jamais à l’avance.' },
  { nom: 'Sauces maison', texte: 'Mayo sriracha, teriyaki ou sucrée-salée selon la recette : toutes préparées sur place.' },
] as const;
