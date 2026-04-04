-- ============================================================
--  CineZone – Schéma base de données
-- ============================================================

CREATE DATABASE IF NOT EXISTS cinezone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinezone;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  username     VARCHAR(50)     NOT NULL UNIQUE,
  email        VARCHAR(255)    NOT NULL UNIQUE,
  password     VARCHAR(255)    NOT NULL,               -- hash bcrypt
  role         ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar_url   VARCHAR(500)    NULL,
  refresh_token VARCHAR(512)    NULL,               -- token de rafraîchissement JWT
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- GENRES  (synchronisés depuis TMDB ou gérés en admin)
-- ------------------------------------------------------------
CREATE TABLE genres (
  id           INT UNSIGNED    NOT NULL,               -- id TMDB (ex: 28 = Action)
  name         VARCHAR(100)    NOT NULL,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- MOVIES  (cache local + films ajoutés par l'admin)
-- ------------------------------------------------------------
CREATE TABLE movies (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  tmdb_id      INT UNSIGNED    NULL UNIQUE,            -- NULL si film créé en back-office
  title        VARCHAR(255)    NOT NULL,
  overview     TEXT            NULL,
  poster_url   VARCHAR(500)    NULL,
  backdrop_url VARCHAR(500)    NULL,
  release_date DATE            NULL,
  vote_average DECIMAL(4,2)    NULL,
  vote_count   INT UNSIGNED    NOT NULL DEFAULT 0,
  is_custom    TINYINT(1)      NOT NULL DEFAULT 0,     -- 1 = créé via back-office admin
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- MOVIE_GENRES  (liaison N:N)
-- ------------------------------------------------------------
CREATE TABLE movie_genres (
  movie_id     INT UNSIGNED    NOT NULL,
  genre_id     INT UNSIGNED    NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  CONSTRAINT fk_mg_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  CONSTRAINT fk_mg_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- FAVORITES
-- ------------------------------------------------------------
CREATE TABLE favorites (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL,
  tmdb_id      INT UNSIGNED    NOT NULL,               -- on stocke l'id TMDB directement
  added_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_fav (user_id, tmdb_id),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- WATCHLIST
-- ------------------------------------------------------------
CREATE TABLE watchlist (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL,
  tmdb_id      INT UNSIGNED    NOT NULL,
  added_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wl (user_id, tmdb_id),
  CONSTRAINT fk_wl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- RATINGS  (notes utilisateur sur un film)
-- ------------------------------------------------------------
CREATE TABLE ratings (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL,
  tmdb_id      INT UNSIGNED    NOT NULL,
  score        TINYINT UNSIGNED NOT NULL,              -- 1 à 10
  comment      TEXT            NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rating (user_id, tmdb_id),
  CONSTRAINT fk_rat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 10)
);

-- ------------------------------------------------------------
-- WATCH_HISTORY  (historique de visionnage)
-- ------------------------------------------------------------
CREATE TABLE watch_history (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL,
  tmdb_id      INT UNSIGNED    NOT NULL,
  watched_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_wh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_wh_user ON watch_history(user_id);
