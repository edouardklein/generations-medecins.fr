# GM IDF • Book Partenaires 2026 — site en ligne

Version interactive du PDF `GMIDF_2026_Book_Partenaires_PropV2.pdf`, déployée
comme micro-site séparé du site Hugo `generations-medecins.fr`.

- **Stack** : Vite + React + TypeScript + TailwindCSS + Framer Motion
- **DB / auth** : Supabase (Postgres + `pgcrypto` pour bcrypt)
- **PDF export** : html2canvas + jsPDF (côté client, 16:9 natif)
- **Déploiement** : Netlify (site séparé)

## Flow utilisateur

1. Le partenaire arrive sur `https://gm-book.netlify.app` → grille 4×N de logos.
2. Il clique sur son logo → modal mot de passe.
3. Mot de passe validé (RPC `verify_partner_book`) → routage vers `/p/:slug`.
4. Book interactif (slides 16:9, scroll-snap, animations Framer Motion).
5. Bouton "Télécharger en PDF" → capture html2canvas → PDF 1600×900 multi-pages.

## Lancer en local

```bash
cd book
npm install
cp .env.example .env       # remplir VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev
```

Si Supabase n'est pas configuré (`.env` vide), le site bascule en **mode démo** :
- 8 partenaires factices avec logos placeholder
- Mot de passe : `demo` pour tous

## Schéma Supabase

Migration : [`../supabase/migrations/005_book_partners.sql`](../supabase/migrations/005_book_partners.sql).

Tables :
- `partners(id, slug, name, logo_url, password_hash, display_order, active)`
- `partner_books(id, partner_id, title, slides JSONB, theme JSONB)`

RPCs (toutes en `SECURITY DEFINER`) :
- `list_active_partners()` — public, renvoie seulement les colonnes affichables
- `verify_partner_book(p_slug, p_password)` — vérif bcrypt + renvoi du book
- `create_partner(slug, name, logo_url, password, slides, order)` — service_role uniquement

Le hash de mot de passe n'est **jamais** exposé à anon : RLS bloque tout accès
direct aux tables, seules les RPCs sont accessibles.

## Ajouter un partenaire

Depuis l'éditeur SQL Supabase (rôle `service_role`) :

```sql
select public.create_partner(
  p_slug     => 'credit-agricole',
  p_name     => 'Crédit Agricole IDF',
  p_logo_url => 'https://.../credit-agricole.svg',
  p_password => 'mot-de-passe-fort',
  p_slides   => '[]'::jsonb,   -- vide = book par défaut (voir ci-dessous)
  p_order    => 1
);
```

> Astuce : héberger les logos dans un bucket Supabase Storage public
> (`partner-logos`) et passer l'URL publique en `p_logo_url`.

## Construire un book par partenaire

Le `slides JSONB` est une liste ordonnée de slides typées. Chaque slide a la
forme `{ "type": "<slideType>", "props": { ... } }`.

Types disponibles (un par layout du PDF original) :

| `type`          | Layout                                          |
| --------------- | ----------------------------------------------- |
| `cover`         | Couverture (titre + logo partenaire)            |
| `summary`       | Sommaire avec chapitres                         |
| `stats`         | Stats hero avec count-up                        |
| `manifesto`     | Verbes + 3 piliers                              |
| `bureau`        | Grille avatars KOLs                             |
| `benefits`      | 4 bénéfices                                     |
| `audience`      | Segmentation % + reach                          |
| `pillars`       | 3 piliers d'activation                          |
| `events`        | Soirées (key facts + programme + thèmes)        |
| `projects`      | Cartes projets 2026                             |
| `partnersGrid`  | Partenaires actuels                             |
| `visibility`    | Mockups multicanal                              |
| `plan`          | Forfait unique (Bronze / Argent / Or)           |
| `plansCompare`  | Comparatif des 3 forfaits                       |
| `modules`       | Modules cumulables                              |
| `options`       | Options à la carte                              |
| `charter`       | Charte de partenariat                           |
| `contact`       | Page contact                                    |

Voir [`src/data/defaultBook.ts`](src/data/defaultBook.ts) pour le book complet
(c'est aussi la référence utilisée comme fallback dans le mode démo).

Si `partner_books.slides` est vide (`[]`), le frontend bascule automatiquement
sur le book par défaut (`defaultBook`). Pour personnaliser, on copie ce JSON,
on l'édite, et on l'insère dans la colonne `slides`.

### Workflow recommandé

1. Le client envoie les modifications à apporter (ex : "pour CA IDF, retire la
   slide 11 et change le prix du forfait Or à 9 000 €").
2. Je modifie le JSON en local à partir de `defaultBook.ts`.
3. `update public.partner_books set slides = '<json>'::jsonb where partner_id = …;`
4. Le partenaire reçoit immédiatement la nouvelle version (pas de redeploy).

## Export PDF

Le bouton `Télécharger en PDF` (en haut à droite du book) :
- met le DOM en `capture-mode` (les animations sont figées)
- capture chaque slide à 1600×900 natif (`html2canvas` `scale: 2`)
- compile un PDF 16:9 multi-pages via `jsPDF`
- nom de fichier : `<slug>-book-2026.pdf`

Les effets 3D/animations sont **aplatis** dans le PDF — c'est attendu, le PDF
sert d'archive statique. Pour des artefacts visuels propres, on peut passer
des slides spécifiques en variantes "simplifiées" dans le futur.

## Déploiement Netlify

Le fichier [`netlify.toml`](netlify.toml) à la racine de `book/` configure :
- `base = "book"` → Netlify ne build que ce sous-dossier
- `publish = "dist"`
- Redirect SPA `/* → /index.html`

Sur Netlify :
1. Connecter le repo, choisir la branche (`claude/book` puis main une fois mergé).
2. **Build base directory** : `book`
3. **Build command** : `npm ci && npm run build`
4. **Publish directory** : `book/dist`
5. Variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Personnalisation visuelle

- Couleurs : [`tailwind.config.ts`](tailwind.config.ts) (`navy`, `gold`, `accent`)
- Typographies : Inter (sans) + Playfair Display (serif), chargées via Google
  Fonts dans [`index.html`](index.html)
- Animations communes : [`src/components/slides/_anim.ts`](src/components/slides/_anim.ts)

## Sécurité

- Les mots de passe sont stockés en bcrypt via `pgcrypto.crypt()` côté Postgres.
- Le hash n'atteint jamais le client (RLS + RPCs `SECURITY DEFINER`).
- La clé `VITE_SUPABASE_ANON_KEY` est publique (rôle `anon`), c'est attendu.
- Aucune session persistée côté client : à chaque refresh, le mot de passe
  est re-demandé (le book reste en `sessionStorage` pour la durée de l'onglet).
- `<meta name="robots" content="noindex, nofollow">` empêche l'indexation Google.
