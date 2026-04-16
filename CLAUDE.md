# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CineZone is a movie platform monorepo with an Express.js backend and React 19 + TypeScript frontend. The backend proxies The Movie Database (TMDB) API and manages user data in MySQL. The frontend is fully built with authentication, movie browsing, ratings, user lists, admin CRUD, real-time viewer count, i18n, and more.

## Commands

### Development
```bash
# Start both backend (port 5000) and frontend (port 5173) concurrently
npm run dev

# Start individually
npm run dev:backend
npm run dev:frontend
```

### Install
```bash
npm install    # Install root + all workspace dependencies (npm workspaces)
```

### Lint
```bash
npm run lint --workspace=apps/frontend    # TypeScript type check (tsc --noEmit)
```

### Tests
```bash
# Backend unit tests (Jest + ESM)
npm test --workspace=apps/backend

# Frontend unit tests (Vitest + Testing Library)
npm test --workspace=apps/frontend

# E2E tests (Playwright — requires a build first)
npm run build --workspace=apps/frontend
npm run test:e2e --workspace=apps/frontend

# Playwright interactive UI mode
cd apps/frontend && npx playwright test --ui
```

### Docker
```bash
docker compose up --build          # Start full stack (DB + backend + frontend + phpMyAdmin)
docker compose up -d --build       # Detached mode
docker compose down -v             # Stop + remove volumes (DB reset)
```

---

## Architecture

### Monorepo Structure
- `apps/backend/` — Express.js API (plain JavaScript)
- `apps/frontend/` — React 19 + Vite + TypeScript
- `cinezone.sql` — MySQL database schema + triggers
- `.env` / `.env.example` — Environment variables at root
- `compose.yaml` — Docker Compose (db, backend, frontend, phpmyadmin)
- `.github/workflows/ci.yml` — CI/CD: lint → test → build → E2E

### Backend (`apps/backend/src/`)
- `index.js` — Express entry point, CORS, Socket.IO server, global error handler, `GET /api/health`
- `routes/movies.js` — All movie routes at `/api/movies` (TMDB proxy + local CRUD + random)
- `controllers/`
  - `localMovieController.js` — CRUD local movies (admin only)
  - `userController.js` — register, login, logout, refresh token, `/me`
  - `ratingController.js` — upsert/delete ratings, list per movie
- `middlewares/`
  - `authMiddleware.js` — JWT cookie verification (`authenticateUser`, `refreshTokenValidation`)
  - `isAdmin.js` — checks `req.userIsAdmin === 'admin'`
  - `handleValidationErrors.js` — express-validator error handler
  - `userValidator.js` — validates register fields + hashes password with bcrypt
  - `validateLocalMovie.js` — Zod validation for local movie payloads
- `services/database.js` — MySQL2 connection pool
- `services/tmdb.js` — Axios client for TMDB API v3; exports `getTrendingMovies`, `getLatestMovies`, `getMovieById`, `searchMulti`, `getGenres`, `discoverMovies`, `getPopularMovies`
- `services/movieSync.js` — Syncs a TMDB movie into the local DB with `INSERT IGNORE` + re-fetch fallback to avoid race conditions on duplicate `tmdb_id`
- `config/auth.config.js` — JWT secrets and expiry from env vars

### Backend Routes (`/api/movies`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/trending` | TMDB trending (day/week) |
| GET | `/latest` | TMDB now playing |
| GET | `/discover` | TMDB discover with filters |
| GET | `/search` | TMDB multi-search |
| GET | `/genres` | TMDB genres list |
| GET | `/random` | Random popular TMDB movie |
| GET | `/:id` | TMDB movie detail (credits, videos, recommendations) |
| GET | `/local` | All local movies (public) |
| POST | `/local` | Create local movie (admin) |
| PUT | `/local/:id` | Update local movie (admin) |
| DELETE | `/local/:id` | Delete local movie (admin) |
| GET | `/local/:id` | Local movie detail |
| GET | `/:id/ratings` | Community ratings for a movie |
| POST | `/:id/ratings` | Upsert user rating |
| DELETE | `/:id/ratings` | Delete user rating |

### Socket.IO (real-time viewer count)
- Server initialised in `index.js` with CORS matching frontend origin
- Room naming: `movie:{source}:{id}` (e.g. `movie:tmdb:550`, `movie:local:3`)
- Events:
  - `join-movie` (client→server) — join a room, server broadcasts updated `viewer-count`
  - `leave-movie` (client→server) — leave a room, server broadcasts updated `viewer-count`
  - `disconnecting` (server) — handles browser close, emits count−1 to remaining members
- Frontend: `src/lib/socket.ts` — singleton with `autoConnect: false`
- Frontend hook: `src/hooks/useViewers.ts` — joins room on mount, leaves on unmount
- Frontend component: `src/components/movie/ViewerCount.tsx` — shows "X watching right now" when count > 1, `aria-live="polite"`

### Random Movie Button
- Backend: `GET /api/movies/random` — picks a random movie from TMDB popular pages (random page 1–10), filters movies with poster
- Frontend: `src/components/ui/RandomMovieButton.tsx` — two variants:
  - `"navbar"` — Button outline in the desktop nav
  - `"bottombar"` — plain button styled as nav link in mobile BottomBar
- Navigates to `/movies/:id` on success, shows Sonner error toast on failure

### Frontend (`apps/frontend/src/`)
- `main.tsx` — React Query (24h stale time), React Router 7, i18n init, Sonner Toaster
- `App.tsx` — Routes + skip-to-main-content accessibility link
- `api/axiosInstance.ts` — Axios instance with httpOnly cookie auth, auto-toast on errors/success, `suppressErrorToast` / `suppressSuccessToast` flags on request config
- `lib/i18n.ts` — i18next init, detects browser language (fr/en), reads `localStorage('lang')`
- `lib/socket.ts` — Socket.IO singleton
- `lib/navigation.ts` — imperative navigate helper for axios interceptor
- `lib/utils.ts` — `cn()` Tailwind class merge utility

### Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | `HomePage` | Hero banner + Trending + Now Playing |
| `/movies/:id` | `DetailPage` | TMDB movie detail |
| `/movies/local/:id` | `DetailPage` (source=local) | Local movie detail |
| `/discover` | `DiscoverPage` | Search + filters (source/rating/genre) |
| `/admin` | `AdminPage` | Local movie CRUD (admin only) |
| `/favorites` | `FavoritesPage` | User favorites list |
| `/watchlist` | `WatchlistPage` | User watchlist |
| `/history` | `HistoryPage` | Watched history |
| `/login` | `AuthPage` | Login / Register tabs |
| `/register` | `AuthPage` | Login / Register tabs |

### Key Components
- `MovieDetailHero` — backdrop, title, genres, vote, list buttons (favorite/watchlist/watched), Watch Trailer
- `UserActions` — rating form + unauthenticated prompt with login/signup links
- `RatingForm` — star rating + optional review, delete confirmation dialog
- `ReviewList` — community reviews
- `CastSection` — cast cards
- `TrailerSection` — YouTube embed via nocookie URL
- `ViewerCount` — real-time viewer count (Socket.IO)
- `DiscoverFilters` — source / rating / genre chips with reset
- `MovieFormDialog` — create/edit local movie form (admin)
- `LanguageSwitcher` — FR | EN toggle, persists in localStorage

### i18n
- Library: `i18next` + `react-i18next`
- Locales: `src/locales/en.json` + `src/locales/fr.json`
- Default: browser language detection (`navigator.language`), fallback `en`
- Switcher: visible in Navbar (desktop) and BottomBar (mobile)
- All user-facing strings are translated: nav, auth forms, movie detail, admin, discover, lists, toasts, aria-labels

### Authentication Flow
1. Register: `POST /api/users` — validates input, hashes password (bcrypt), stores in DB
2. Login: `POST /api/users/login` — verifies password, sets httpOnly cookies: `accessToken` (60m) + `refreshToken` (7d)
3. `GET /api/users/me` — returns current user from access token cookie
4. `POST /api/users/refresh` — rotates refresh token, issues new access token
5. `POST /api/users/logout` — clears cookies
6. Frontend: axios interceptor reads cookies automatically (withCredentials); 401 on non-auth routes redirects to `/login`

### Database (MySQL)
Key tables: `users`, `refresh_tokens`, `genres`, `movies`, `movie_genres`, `favorites`, `watchlist`, `ratings`, `watch_history`.
Import schema: `mysql -u root cinezone < cinezone.sql`

### Environment Variables
Copy `.env.example` to `.env`:
- `DB_*` — MySQL connection (default: localhost:3306, database: cinezone)
- `TMDB_API_KEY` — Required for all TMDB endpoints
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Token signing
- `JWT_EXPIRES_IN=60m` / `JWT_REFRESH_EXPIRES_IN=7d`
- `VITE_API_URL=http://localhost:5000` — Frontend API base URL
- `VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p` — TMDB image CDN base

### Path Alias
Frontend uses `@/` as alias for `./src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

### Tests
- **Backend** (`apps/backend/src/__tests__/`): Jest + `@jest/globals` (ESM). Tests: `handleValidationErrors`, `isAdmin`, `authMiddleware`.
- **Frontend unit** (`apps/frontend/src/test/`): Vitest + Testing Library. Tests: `LanguageSwitcher`, `RandomMovieButton`, `LoginForm`. Vitest is scoped to `src/test/**` to avoid picking up Playwright specs.
- **E2E** (`apps/frontend/e2e/`): Playwright (Chromium). Tests: `home.spec.ts`, `auth.spec.ts`, `discover.spec.ts`. Config: `playwright.config.ts` — uses `vite preview` as webServer on port 4173.
