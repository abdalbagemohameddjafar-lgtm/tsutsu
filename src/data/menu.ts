// =====================================================================
// LA CARTE — modifiez ici les rolls : nom, description, prix, ingrédients,
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
/** Équivalent japonais des étiquettes : 菜食 (saishoku, végétarien), 辛 (kara, épicé), 人気 (ninki, populaire). */
export const TAGS_JA: Record<Tag, string> = {
  vege: '菜食',
  epice: '辛',
  bestseller: '人気',
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
  /** Illustration (coupe de maki vue de dessus) : couleurs de la garniture, du centre vers l'extérieur */
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

/** Un roll est « sans gluten » si le gluten ne figure pas dans ses allergènes. */
export const sansGluten = (r: Roll) => !r.allergenes.includes('gluten');

// Ingrédients mis en avant (section « Ce qu'on roule dedans »)
// ja : nom japonais (sumeshi = riz vinaigré, nori, saumon, avocat, goma = sésame, kyūri = concombre)
export const ingredientsVedettes = [
  { id: 'riz', nom: 'Riz vinaigré', ja: '酢飯', texte: 'Riz japonais cuit chaque matin, assaisonné au vinaigre de riz.' },
  { id: 'nori', nom: 'Nori', ja: '海苔', texte: 'Feuille d’algue grillée, posée au dernier moment pour rester croquante.' },
  { id: 'saumon', nom: 'Saumon', ja: 'サーモン', texte: 'Saumon frais tranché à la commande, jamais à l’avance.' },
  { id: 'avocat', nom: 'Avocat', ja: 'アボカド', texte: 'Avocat mûr à point, coupé en lamelles fondantes.' },
  { id: 'sesame', nom: 'Sésame', ja: '胡麻', texte: 'Graines blanches et noires torréfiées pour le croquant.' },
  { id: 'concombre', nom: 'Concombre', ja: 'きゅうり', texte: 'Bâtonnets bien frais pour la touche qui croque.' },
] as const;
