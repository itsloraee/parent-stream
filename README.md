# Parent Stream

> Plateforme d'hébergement de vidéos informatives dédiée à la parentalité.
> Construit avec **Next.js 16 (App Router + Turbopack)**, **TypeScript**, **Tailwind CSS** et **Supabase** (Auth, Database, Storage, Realtime).

Maquettes : conçues par [@itsloraee](https://www.behance.net/) sur Figma.

> 📱 Une **app mobile compagnon** existe dans le dossier voisin `parent-stream-mobile/`. C'est un wrapper Expo + WebView qui permet de tester le site sur un vrai téléphone via Expo Go. Voir [`parent-stream-mobile/README.md`](../parent-stream-mobile/README.md) pour les instructions.

---

## 📦 Structure du projet

```
parent-stream/
├── src/
│   ├── app/
│   │   ├── (app)/                  # Routes protégées (authentifié)
│   │   │   ├── home/               # Page d'accueil
│   │   │   ├── search/             # Recherche
│   │   │   ├── my-list/            # Ma Liste (favoris)
│   │   │   ├── video/[id]/         # Player + détails (iframe YouTube ou HTML5)
│   │   │   ├── profile/            # Profil utilisateur
│   │   │   └── layout.tsx          # Layout avec BottomNav
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth callback
│   │   │   └── signout/route.ts    # Déconnexion
│   │   ├── login/                  # Connexion
│   │   ├── register/               # Inscription
│   │   ├── verify/                 # Vérification OTP (8 chiffres)
│   │   ├── layout.tsx              # Root layout (cadre mobile centré sur PC)
│   │   ├── page.tsx                # Redirect /login ou /home
│   │   └── globals.css             # Styles globaux + thème + cadre mobile
│   ├── components/
│   │   ├── BottomNav.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── Logo.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── VideoCard.tsx
│   ├── lib/
│   │   ├── format.ts               # Helpers (durée, count)
│   │   ├── youtube.ts              # Helpers YouTube (extraction ID, embed URL)
│   │   └── supabase/
│   │       ├── client.ts           # Client browser
│   │       ├── server.ts           # Client serveur (RSC) — async cookies
│   │       └── middleware.ts       # Mise à jour session — getAll/setAll
│   ├── types/
│   │   └── database.ts             # Types Supabase
│   └── middleware.ts               # Protection routes
├── supabase/
│   ├── 01_schema.sql               # Tables + indexes + triggers
│   ├── 02_policies.sql             # Row Level Security
│   ├── 03_storage.sql              # Buckets + politiques
│   ├── 04_seed.sql                 # Données démo (optionnel)
│   └── 05_youtube_videos.sql       # Vraies URLs YouTube pour les vidéos seed
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🚀 Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le projet Supabase

> ⚠️ Cette étape doit être faite par vous, manuellement, sur supabase.com.

1. Aller sur **[supabase.com](https://supabase.com)** et se connecter (compte gratuit)
2. Cliquer sur **New project**
3. Choisir une organisation, donner un nom (ex. `parent-stream`)
4. Choisir une région (ex. `West EU - Paris`)
5. Définir un mot de passe DB fort (à conserver dans un gestionnaire)
6. Cliquer sur **Create new project** — attendre 1-2 min que le projet soit prêt

### 3. Récupérer les clés API

Dans votre projet Supabase :

1. Aller dans **Project Settings** (icône engrenage en bas à gauche)
2. Onglet **API**
3. Copier :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret !) → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configurer les variables d'environnement

Copier `.env.local.example` vers `.env.local` et remplir avec vos clés :

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Exécuter les scripts SQL

Dans votre projet Supabase, ouvrir **SQL Editor** (icône `</>` dans la sidebar) et exécuter dans cet ordre :

1. **`supabase/01_schema.sql`** — crée les tables, indexes et triggers
2. **`supabase/02_policies.sql`** — active la RLS et crée les politiques
3. **`supabase/03_storage.sql`** — crée les buckets (avatars, thumbnails, videos)
4. **`supabase/04_seed.sql`** *(optionnel)* — ajoute les catégories, séries et vidéos de démo
5. **`supabase/05_youtube_videos.sql`** *(optionnel)* — associe de vraies URLs YouTube + thumbnails aux vidéos seed, pour pouvoir lancer la lecture en test

> 💡 Astuce : copier-coller le contenu de chaque fichier et cliquer **Run**.
> Les scripts 4 et 5 ne sont nécessaires que si vous voulez des données de test.

### 6. Configurer l'authentification

Dans **Authentication > Providers** :

- **Email** : activé par défaut. Pour la **vérification par code OTP** (au lieu d'un magic link cliquable), aller dans **Auth > Email Templates > Confirm signup** et remplacer le template par quelque chose comme :
  ```html
  <h2>Confirme ton inscription à Parent Stream</h2>
  <p>Voici ton code de vérification :</p>
  <h1>{{ .Token }}</h1>
  ```
  La variable `{{ .Token }}` génère un **code numérique de 8 chiffres** (longueur par défaut Supabase). La page `/verify` est calibrée pour 8 cases.
- **Google** : ajouter Client ID et Client Secret depuis [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Apple** : suivre le guide [Supabase Apple OAuth](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- **Facebook** : ajouter App ID et App Secret depuis [Meta for Developers](https://developers.facebook.com/)

Dans **Authentication > URL Configuration** :
- **Site URL** : `http://localhost:3000` (dev) ou votre URL Vercel (prod)
- **Redirect URLs** : ajouter `http://localhost:3000/auth/callback` et l'URL de prod

### 7. Lancer le projet en dev

```bash
npm run dev
```

Ouvrir **[http://localhost:3000](http://localhost:3000)** — vous serez redirigé vers `/login`.

> 💡 **Pour tester depuis un téléphone sur le même WiFi**, lancez plutôt :
> ```bash
> npm run dev -- -H 0.0.0.0
> ```
> Cela autorise les connexions depuis le réseau local. Trouvez l'IP de votre PC avec `ipconfig` (ex. `192.168.1.42`) et accédez à `http://192.168.1.42:3000` depuis le navigateur du téléphone, ou utilisez le projet `parent-stream-mobile/` pour un wrapper natif via Expo Go.

---

## 📱 App mobile (Expo Go)

Le dossier voisin **`parent-stream-mobile/`** contient une app React Native + Expo qui charge le site Next.js dans une WebView, pour tester sur un vrai téléphone.

```
parent-stream-mobile/
├── App.tsx              # Composant racine + WebView
├── app.json             # Config Expo
├── package.json         # Dépendances Expo SDK 55
├── .env.example         # Template à copier en .env
└── README.md            # Guide pas à pas (à lire avant de lancer)
```

Voir [`parent-stream-mobile/README.md`](../parent-stream-mobile/README.md) pour les étapes détaillées (installation Expo Go, configuration de l'IP, scan du QR code).

---

## 🌐 Déploiement sur Vercel (recommandé)

1. Pousser le code sur GitHub
2. Aller sur [vercel.com/new](https://vercel.com/new) et importer le repo
3. Dans **Environment Variables**, ajouter les 4 variables `.env.local`
4. Cliquer **Deploy**
5. Une fois déployé, mettre à jour la **Site URL** et **Redirect URLs** dans Supabase Auth

---

## 🎬 Vidéos YouTube

Le player vidéo détecte automatiquement si l'URL stockée dans `videos.video_url` est une URL YouTube (formats `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, `youtube.com/embed/`) et bascule sur un **iframe YouTube** avec autoplay et contrôles natifs. Sinon, il utilise le lecteur HTML5 standard.

Pour ajouter une vidéo YouTube en base :

```sql
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=VIDEO_ID',
  thumbnail_url = 'https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg'
where id = '...';
```

> 💡 Toujours utiliser `hqdefault.jpg` (480x360, **toujours générée** par YouTube) plutôt que `maxresdefault.jpg` qui n'existe pas pour toutes les vidéos.

Logique implémentée dans **`src/lib/youtube.ts`** (extraction d'ID, construction d'URL d'embed, génération de thumbnail).

---

## 🎨 Design System

| Élément | Valeur |
|---|---|
| Police | Poppins (Google Fonts) |
| Couleur primaire | `#DC2626` (brand-500) |
| Background | Dégradé `#1A0F1F → #0B0710` (dans `.mobile-frame`) |
| Surface card | `#1A1227` (surface-700) |
| Texte | `#FFFFFF` (primary), `#B8B5C5` (secondary) |
| Border radius | `rounded-2xl` (cards), `rounded-full` (CTA, pills) |
| Cadre PC | `max-w-md` centré avec `shadow-2xl` (preview mobile) |

Couleurs et tokens dans **`tailwind.config.ts`** sous `theme.extend.colors`. Le dégradé radial est appliqué à la classe `.mobile-frame` dans `globals.css` (et non au body), pour qu'il reste contenu dans la zone "écran mobile" même sur desktop.

---

## 🔐 Schéma Supabase

| Table | Rôle |
|---|---|
| `profiles` | Données utilisateur (lié à `auth.users`) |
| `categories` | Famille, Éducation, Santé, Ados… |
| `series` | Séries de vidéos (ex. *L'Art d'Être Parent*) |
| `videos` | Vidéos individuelles ou épisodes |
| `likes` | Likes utilisateur |
| `favorites` | Liste personnelle (Ma Liste) |
| `watch_history` | Continuer à regarder |
| `comments` | Commentaires |
| `notifications` | Notifications temps réel |
| `conversations` / `messages` | Chat temps réel entre parents |

**RLS** activée sur toutes les tables. Voir `supabase/02_policies.sql`.

---

## 🛠️ Scripts disponibles

| Commande | Action |
|---|---|
| `npm run dev` | Lancer en mode développement (Turbopack) |
| `npm run dev -- -H 0.0.0.0` | Lancer en dev accessible depuis le réseau local |
| `npm run build` | Build de production |
| `npm start` | Lancer le serveur de production |
| `npm run lint` | Linter ESLint |
| `npm run type-check` | Vérification TypeScript |

---

## 📱 Pages

| Route | Description |
|---|---|
| `/login` | Connexion (email + OAuth) |
| `/register` | Inscription avec validation force du mot de passe |
| `/verify` | Vérification du code OTP à **8 chiffres** |
| `/home` | Catégories, hero, *Continuer à regarder*, *Recommandé* |
| `/search` | Barre de recherche, tendances, résultats |
| `/my-list` | Vidéos favorites avec filtres |
| `/video/[id]` | Détails (note, vues, satisfaction) + player (YouTube ou HTML5) + épisodes |
| `/profile` | Profil, stats, menu, déconnexion |

---

## 📚 Stack & dépendances clés

- **[Next.js 16](https://nextjs.org/)** — React framework, App Router, Server Components, Turbopack en dev
- **[Supabase JS v2](https://supabase.com/docs/reference/javascript/introduction)** + **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)** — DB, Auth, Storage, Realtime (avec pattern async cookies + getAll/setAll pour Next.js 15+)
- **[Tailwind CSS](https://tailwindcss.com)** — Styling utility-first
- **[Lucide React](https://lucide.dev)** — Icônes

---

## 🐛 Résolution de problèmes

**"Invalid API key"** : vérifier que `.env.local` contient bien les bonnes clés Supabase, puis relancer `npm run dev`.

**"cookieStore.get is not a function" sur Next.js 15+** : assurer que `createClient()` est bien appelé avec `await` dans tous les composants serveur (`const supabase = await createClient()`). Le pattern `getAll/setAll` est utilisé à la place de `get/set/remove`.

**Code OTP trop long ou trop court par rapport aux cases** : la longueur OTP par défaut de Supabase est **8 chiffres** (non configurable depuis le dashboard sur les projets managed). La page `/verify` est calibrée pour 8 cases via la constante `CODE_LENGTH = 8` dans `src/app/verify/page.tsx`.

**Email de confirmation contient un long lien et pas un code court** : le template d'email utilise `{{ .ConfirmationURL }}` au lieu de `{{ .Token }}`. Modifier le template **Auth > Email Templates > Confirm signup** pour utiliser `{{ .Token }}` (voir étape 6).

**Email de confirmation non reçu** : par défaut Supabase utilise un SMTP partagé (limité). Pour la production, configurer SMTP custom dans **Auth > Settings > SMTP Settings**.

**Erreur RLS sur `INSERT`** : vérifier que la session utilisateur est bien active. Tester avec `supabase.auth.getUser()` côté client.

**Vidéo YouTube ne s'affiche pas (juste le son)** : vérifier que l'URL stockée est bien reconnue par `getYouTubeId()` dans `src/lib/youtube.ts` (formats supportés : `watch?v=`, `youtu.be/`, `embed/`, `shorts/`).

**Thumbnail YouTube cassée** : utiliser `hqdefault.jpg` plutôt que `maxresdefault.jpg` (ce dernier n'existe pas pour toutes les vidéos).

**Téléphone ne joint pas le serveur dev** : lancer Next.js avec `npm run dev -- -H 0.0.0.0`, vérifier que pare-feu Windows autorise le port 3000, et que téléphone et PC sont sur le même WiFi.

---

Made with ❤️ pour les parents par **@itsloraee**
