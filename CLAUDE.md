# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CineZone is a movie platform monorepo with an Express.js backend and React + TypeScript frontend. The backend proxies The Movie Database (TMDB) API and manages user data in MySQL. The frontend is mostly scaffold — components, pages, hooks, context, and types directories are empty and ready to be built.
The instructions are in the file "Plan fil rouge N4.docx.pdf"

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
npm run install:all   # Install root + all workspace dependencies
```

### Lint
```bash
npm run lint          # Lint all workspaces
```

## Architecture

### Monorepo Structure
- `apps/backend/` — Express.js API (plain JavaScript)
- `apps/frontend/` — React 19 + Vite + TypeScript
- `cinezone.sql` — MySQL database schema
- `.env` / `.env.example` — Environment variables at root

### Backend (`apps/backend/src/`)
- `index.js` — Express entry point, CORS config, global error handler, health check at `GET /api/health`
- `routes/movies.js` — All movie routes mounted at `/api/movies`
- `controllers/` — `movieController.js` (local DB queries), `userController.js` (register/login)
- `middlewares/` — `userValidator.js` (email uniqueness + bcrypt hashing), `handleValidationErrors.js`
- `services/database.js` — MySQL2 connection pool
- `services/tmdb.js` — Axios client for TMDB API v3; exports `getTrendingMovies`, `getLatestMovies`, `getMovieById`, `searchMulti`, `getGenres`, `discoverMovies`

### Frontend (`apps/frontend/src/`)
- `main.tsx` — React Query setup (5 min stale time) + React Router 7
- `App.tsx` — Root routing component (currently one route: `/ → <div>CineZone</div>`)
- `api/axiosInstance.ts` — Axios instance with Bearer token injection (from localStorage) and 401 → redirect to `/login`
- `lib/utils.ts` — `cn()` Tailwind class merge utility

### Authentication Flow
1. Register: `POST /api/users` — validates input, hashes password with bcrypt, stores in DB
2. Login: `POST /api/users/login` — verifies password, returns JWT (24h) + refresh token (7d)
3. Frontend stores token in localStorage; axios interceptor adds it as `Authorization: Bearer`
4. 401 responses clear token and redirect to `/login`

### Database (MySQL)
Key tables: `users`, `refresh_tokens`, `genres`, `movies`, `movie_genres`, `favorites`, `watchlist`, `ratings`, `watch_history`. Import schema with `mysql -u root cinezone < cinezone.sql`.

### Environment Variables
Copy `.env.example` to `.env` and fill in:
- `DB_*` — MySQL connection (default: localhost:3306, database: cinezone)
- `TMDB_API_KEY` — Required for all movie endpoints
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Token signing
- `VITE_API_URL=http://localhost:5000` — Frontend API base

### Path Alias
Frontend uses `@/` as alias for `./src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
