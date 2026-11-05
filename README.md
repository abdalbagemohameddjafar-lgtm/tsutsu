# TSUTSU 筒 — site de démonstration

Site vitrine d'un restaurant **fictif** : un comptoir à temaki (cônes de nori roulés à la main) à Metz, ambiance izakaya du soir, réalisé par **Pyke Studio** pour son portfolio
(offre « Vitrine + »). Astro + TypeScript + CSS natif, 100 % statique, prêt pour Cloudflare Pages.

## Lancer le site sur votre ordinateur

```bash
npm install        # une seule fois
npm run dev        # aperçu en direct pendant que vous modifiez : http://localhost:4321
npm run build      # fabrique le site final dans le dossier dist/
npm run preview    # affiche le site final : http://localhost:4321
```

## Modifier la carte

Tout est dans **`src/data/menu.ts`**. Chaque temaki ressemble à ceci :

```ts
{
  id: 'saumon-avocat',            // identifiant unique, sans espace (sert au panier)
  nom: 'Le Classique',
  description: 'Saumon frais, avocat crémeux…',
  prix: 9.9,                      // en euros, avec un point
  ingredients: ['Riz vinaigré', 'Nori', 'Saumon frais'],
  allergenes: ['poisson', 'sesame'],   // liste ALLERGENES en haut du fichier
  tags: ['bestseller'],           // 'vege', 'epice', 'bestseller'
  visuel: { garniture: ['#F2845C', '#8DB255'], topping: 'sesame' }, // couleurs du dessin
},
```

- **Ajouter un temaki** : copiez un bloc, changez l'`id` et les textes.
- **« Sans gluten »** est calculé tout seul : une recette sans `'gluten'` dans ses allergènes reçoit l'étiquette.
- La section « La carte », la page `/carte` (imprimable), le panier et les données Google se mettent à jour automatiquement.

## Modifier les horaires, l'adresse, le téléphone, WhatsApp

Tout est dans **`src/config/restaurant.ts`** :

- `horaires` : jours (0 = dimanche … 6 = samedi) et heures d'ouverture. Ils servent au badge
  « Ouvert maintenant / Fermé », aux créneaux de retrait et aux données Google.
- `horairesTexte` : le texte affiché sur le site (gardez-le identique aux horaires).
- `whatsapp` : numéro au format international **sans le +** (ex. `33612345678`). C'est lui qui reçoit les commandes.
- `telephone`, `adresse`, `instagram`, `offreEtudiante`.
- `COORDONNEES_PLAN` : position du plan OpenStreetMap — **à remplacer par l'adresse réelle du client**.
- `retrait` : intervalle entre deux créneaux (15 min), délai de préparation.

> Le numéro actuel (01 23 45 67 89) est un numéro d'exemple, le même sur toutes les démos Pyke Studio.
> Pensez à le remplacer pour un vrai restaurant.

## Formulaires (réservation et commande par e-mail)

Le site est statique : les formulaires passent par **Web3Forms** (gratuit).

1. Créez une clé sur <https://web3forms.com> avec l'adresse e-mail qui doit recevoir les messages.
2. En local : copiez `.env.example` en `.env` et collez la clé dans `PUBLIC_WEB3FORMS_KEY`.
3. Sur Cloudflare Pages : *Settings → Environment variables*, ajoutez `PUBLIC_WEB3FORMS_KEY`, puis redéployez.

Sans clé, tout fonctionne (validation, panier, WhatsApp) mais la réservation et l'envoi par e-mail
affichent « site de démonstration » au lieu d'envoyer.

## Photos du client

Le composant **`src/components/Photo.astro`** affiche une illustration tant qu'il n'y a pas de photo.
Pour mettre les vraies photos : déposez-les dans `public/photos/` (JPG + WebP), puis :

- **hero** et **comptoir** : ajoutez `src="/photos/hero.jpg" webp="/photos/hero.webp"` sur le `<Photo>` correspondant dans `src/pages/index.astro` ;
- **produits** : ajoutez `photo: '/photos/<id>.jpg'` (et `photoWebp`) au temaki dans `src/data/menu.ts`.

Le texte `alt` est obligatoire : décrivez ce qu'on voit.

## Polices

Shippori Mincho B1 (titres), Zen Kaku Gothic New (texte), DM Mono (prix et chiffres), auto-hébergées via fontsource.
Les caractères japonais utilisent une version allégée de Shippori Mincho B1 (`public/fonts/`, ~10 Ko) :
après un ajout de texte japonais, relancez `python outils/police-japonaise.py` (nécessite `pip install fonttools brotli`).

## Fonctions « Vitrine + »

- **Panier click & collect** (`src/components/Panier.astro`, `src/scripts/panier.ts`) : tiroir latéral
  (plein écran sur mobile), quantités, total, créneaux de 15 min dans les horaires, nom et téléphone.
  « Envoyer ma commande » ouvre WhatsApp avec le récapitulatif ; option « Envoyer par e-mail ».
  Le panier est gardé dans le navigateur (localStorage, protégé si le stockage est bloqué).
- **Statut ouvert / fermé** en temps réel, à l'heure de Paris (`src/lib/horaires.ts`).
- **Page `/carte`** complète avec tableau des allergènes, bouton « Imprimer ».
- Pages `/mentions-legales` et `/confidentialite` (contenu générique de démo).

## Déployer sur Cloudflare Pages

1. Envoyez le projet sur GitHub.
2. Cloudflare → *Workers & Pages → Create → Pages → Connect to Git*, choisissez le dépôt.
3. Réglages de build : **Framework preset** `Astro`, **Build command** `npm run build`,
   **Build output directory** `dist`. Variable `NODE_VERSION` = `22` (ou plus).
4. Ajoutez `PUBLIC_WEB3FORMS_KEY` (voir plus haut), puis *Save and Deploy*.
5. Si l'adresse finale n'est pas `https://tsutsu.pages.dev`, changez `site` dans `astro.config.mjs`,
   `site` dans `src/config/restaurant.ts` et la ligne `Sitemap:` de `public/robots.txt`.

Chaque envoi sur GitHub redéploie le site automatiquement.

## Organisation des fichiers

```
src/
  config/restaurant.ts   coordonnées, horaires, WhatsApp, offre étudiante
  data/menu.ts           la carte (temaki, allergènes, ingrédients)
  lib/                   horaires (ouvert/fermé, créneaux) et format des prix
  layouts/               gabarit commun (SEO, JSON-LD Restaurant) et pages de texte
  components/            en-tête, Photo, Temaki et Lanterne (SVG), carte, panier, réservation, infos, pied de page…
  scripts/               JavaScript natif : panier, filtres, réservation, apparitions
  styles/global.css      couleurs, typographies, boutons
  pages/                 accueil, /carte, mentions légales, confidentialité, 404
public/                  icônes, image de partage, robots.txt
```

Polices : voir la section « Polices » plus haut.

Sans cette étape, le nouveau caractère s'affiche quand même, dans la police japonaise du système.
Animations désactivées si l'appareil demande de réduire les mouvements.
