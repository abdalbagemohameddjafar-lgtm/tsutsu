# TSUTSU 筒 — site de démonstration

Site vitrine d'un restaurant **fictif** de sushis en tube, réalisé par **Pyke Studio** pour son portfolio
(offre « Vitrine + »). Astro + TypeScript + CSS natif, 100 % statique, prêt pour Cloudflare Pages.

## Lancer le site sur votre ordinateur

```bash
npm install        # une seule fois
npm run dev        # aperçu en direct pendant que vous modifiez : http://localhost:4321
npm run build      # fabrique le site final dans le dossier dist/
npm run preview    # affiche le site final : http://localhost:4321
```

## Modifier la carte

Tout est dans **`src/data/menu.ts`**. Chaque roll ressemble à ceci :

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

- **Ajouter un roll** : copiez un bloc, changez l'`id` et les textes.
- **« Sans gluten »** est calculé tout seul : un roll sans `'gluten'` dans ses allergènes reçoit l'étiquette.
- La section « La carte », la page `/carte` (imprimable), le panier et les données Google se mettent à jour automatiquement.

## Modifier les horaires, l'adresse, le téléphone, WhatsApp

Tout est dans **`src/config/restaurant.ts`** :

- `horaires` : jours (0 = dimanche … 6 = samedi) et heures d'ouverture. Ils servent au badge
  « Ouvert maintenant / Fermé », aux créneaux de retrait et aux données Google.
- `horairesTexte` : le texte affiché sur le site (gardez-le identique aux horaires).
- `whatsapp` : numéro au format international **sans le +** (ex. `33612345678`). C'est lui qui reçoit les commandes.
- `telephone`, `adresse`, `carte` (position du plan), `instagram`, `offreEtudiante`.
- `retrait` : intervalle entre deux créneaux (15 min), délai de préparation.

> Les numéros actuels (06 39 98 …) sont dans la plage réservée par l'ARCEP à la fiction : ils ne
> sonnent chez personne. Pensez à les remplacer pour un vrai restaurant.

## Formulaires (réservation et commande par e-mail)

Le site est statique : les formulaires passent par **Web3Forms** (gratuit).

1. Créez une clé sur <https://web3forms.com> avec l'adresse e-mail qui doit recevoir les messages.
2. En local : copiez `.env.example` en `.env` et collez la clé dans `PUBLIC_WEB3FORMS_KEY`.
3. Sur Cloudflare Pages : *Settings → Environment variables*, ajoutez `PUBLIC_WEB3FORMS_KEY`, puis redéployez.

Sans clé, tout fonctionne (validation, panier, WhatsApp) mais la réservation et l'envoi par e-mail
affichent « site de démonstration » au lieu d'envoyer.

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
  data/menu.ts           la carte (rolls, allergènes, ingrédients)
  lib/                   horaires (ouvert/fermé, créneaux) et format des prix
  layouts/               gabarit commun (SEO, JSON-LD Restaurant) et pages de texte
  components/            en-tête, tube SVG, rolls SVG, carte, panier, réservation, pied de page…
  scripts/               JavaScript natif : panier, filtres, réservation, apparitions, tube
  styles/global.css      couleurs, typographies, boutons
  pages/                 accueil, /carte, mentions légales, confidentialité, 404
public/                  icônes, image de partage, robots.txt
```

Polices : Archivo Black (titres), Inter (texte) et Dela Gothic One (grands caractères japonais),
hébergées avec le site. Les petits textes japonais utilisent la police japonaise du système.

## Ajouter du texte japonais

La police japonaise est **allégée** : elle ne contient que les caractères déjà présents sur le site
(11 Ko au lieu de 920 Ko). Après avoir ajouté un mot japonais, régénérez-la :

```bash
pip install fonttools brotli          # une seule fois
python outils/police-japonaise.py
```

Sans cette étape, le nouveau caractère s'affiche quand même, dans la police japonaise du système.
Animations désactivées si l'appareil demande de réduire les mouvements.
