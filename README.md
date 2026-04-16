# CineZone

Plateforme de films — monorepo Express.js (backend) + React 19 + TypeScript (frontend).

---

## Prérequis

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) + Docker Compose (pour le mode conteneurisé)
- Clé API [TMDB](https://www.themoviedb.org/settings/api)

---

## Installation locale

### 1. Cloner & configurer l'environnement

```bash
git clone https://github.com/<user>/cinezone.git
cd cinezone

cp .env.example .env
# Remplir .env : DB_*, TMDB_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET
```

### 2. Installer les dépendances

```bash
npm install          # installe root + tous les workspaces (frontend + backend)
```

### 3. Initialiser la base de données MySQL

```bash
mysql -u root cinezone < cinezone.sql
```

---

## Développement

```bash
# Démarrer backend (port 5000) + frontend (port 5173) en parallèle
npm run dev

# Démarrer séparément
npm run dev:backend
npm run dev:frontend
```

---

## Build

```bash
# Build frontend uniquement
npm run build --workspace=apps/frontend

# Lint (TypeScript type check)
npm run lint --workspace=apps/frontend
```

---

## Tests

### Tests unitaires — Backend (Jest)

```bash
npm test --workspace=apps/backend
```

Couvre :
- `handleValidationErrors` — validation express-validator
- `isAdmin` — contrôle d'accès admin
- `authenticateUser` / `refreshTokenValidation` — vérification JWT

### Tests unitaires — Frontend (Vitest)

```bash
npm test --workspace=apps/frontend
```

Couvre :
- `LanguageSwitcher` — rendu, clic FR/EN, persistance localStorage
- `RandomMovieButton` — variants navbar/bottombar, navigation, état loading
- `LoginForm` — rendu, erreur inline, succès, toggle password

### Tests E2E — Frontend (Playwright)

> Requiert un build frontend préalable.

```bash
# 1. Builder le frontend
npm run build --workspace=apps/frontend

# 2. Lancer les tests E2E (Chromium)
npm run test:e2e --workspace=apps/frontend
```

**Options utiles :**

```bash
# Mode UI interactif — voir les tests s'exécuter dans le navigateur en live
cd apps/frontend && npx playwright test --ui

# Un seul fichier de test
cd apps/frontend && npx playwright test e2e/auth.spec.ts

# Debug pas à pas (ouvre le browser en mode headed)
cd apps/frontend && npx playwright test --debug

# Afficher le rapport HTML du dernier run
cd apps/frontend && npx playwright show-report
```

Couvre :
- **home.spec.ts** — logo, navigation, lien Discover, language switcher
- **auth.spec.ts** — navigation vers /login, formulaire, tabs, erreur inline, changement de langue
- **discover.spec.ts** — barre de recherche, mise à jour URL, bouton clear

### Lancer tous les tests d'un coup

```bash
npm test --workspace=apps/backend && \
npm test --workspace=apps/frontend && \
npm run build --workspace=apps/frontend && \
npm run test:e2e --workspace=apps/frontend
```

---

## Docker

### Démarrer toute la stack (DB + Backend + Frontend + phpMyAdmin)

```bash
docker compose up --build
```

| Service     | URL                    |
|-------------|------------------------|
| Frontend    | http://localhost       |
| Backend API | http://localhost:5000  |
| phpMyAdmin  | http://localhost:8080  |

### Commandes Docker utiles

```bash
# Démarrer en arrière-plan
docker compose up -d --build

# Voir les logs en live
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend

# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (reset complet de la DB)
docker compose down -v

# Rebuild un seul service
docker compose up -d --build backend

# Accéder au shell du conteneur backend
docker compose exec backend sh

# Accéder au shell MySQL
docker compose exec db mysql -u root -p cinezone
```

### Variables d'environnement Docker

Les variables VITE_* sont inlinées au moment du build du frontend. Pour les personnaliser :

```bash
# Exemple avec une IP réseau locale
VITE_API_URL="" docker compose up --build
# (l'URL vide = nginx proxifie /api/ vers le backend automatiquement)
```

---

## CI/CD — GitHub Actions

Le pipeline `.github/workflows/ci.yml` se déclenche sur push vers `main`, `feat/**`, `fix/**` et sur les Pull Requests vers `main`.

| Job        | Étapes                                      |
|------------|---------------------------------------------|
| `frontend` | lint (tsc --noEmit) → test (vitest) → build |
| `backend`  | test (jest)                                 |
| `e2e`      | build → playwright test (Chromium)          |

Le rapport Playwright est uploadé en artifact GitHub Actions (7 jours de rétention).

---

## Architecture

```
cinezone/
├── apps/
│   ├── backend/          # Express.js API (JavaScript)
│   │   └── src/
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── routes/
│   │       └── services/
│   └── frontend/         # React 19 + Vite + TypeScript
│       ├── e2e/          # Tests Playwright
│       └── src/
│           ├── api/
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── locales/  # Traductions i18n (en.json, fr.json)
│           ├── pages/
│           ├── test/     # Tests Vitest
│           └── types/
├── .github/workflows/    # CI/CD
├── compose.yaml          # Docker Compose
├── cinezone.sql          # Schéma MySQL
└── .env.example
```

## Variables d'environnement

Copier `.env.example` vers `.env` et remplir :

| Variable               | Description                              | Exemple                    |
|------------------------|------------------------------------------|----------------------------|
| `DB_HOST`              | Hôte MySQL                               | `localhost`                |
| `DB_PORT`              | Port MySQL                               | `3306`                     |
| `DB_USER`              | Utilisateur MySQL                        | `root`                     |
| `DB_PASSWORD`          | Mot de passe MySQL                       |                            |
| `DB_NAME`              | Nom de la base                           | `cinezone`                 |
| `TMDB_API_KEY`         | Clé API The Movie Database               |                            |
| `JWT_SECRET`           | Secret pour les access tokens            |                            |
| `JWT_EXPIRES_IN`       | Durée de validité access token           | `60m`                      |
| `JWT_REFRESH_SECRET`   | Secret pour les refresh tokens           |                            |
| `JWT_REFRESH_EXPIRES_IN` | Durée de validité refresh token        | `7d`                       |
| `VITE_API_URL`         | URL de l'API backend (frontend)          | `http://localhost:5000`    |
| `VITE_TMDB_IMAGE_BASE` | Base URL images TMDB                     | `https://image.tmdb.org/t/p` |
