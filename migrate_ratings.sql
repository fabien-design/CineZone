-- Migration: ratings.tmdb_id → ratings.movie_id (FK to movies.id)
-- Run once: mysql -u root cinezone < migrate_ratings.sql

USE cinezone;

-- 1. For any existing rating whose tmdb_id doesn't yet have a movies row, create one
INSERT IGNORE INTO movies (tmdb_id)
SELECT DISTINCT tmdb_id FROM ratings;

-- 2. Add the new column
ALTER TABLE ratings
  ADD COLUMN movie_id INT UNSIGNED NULL AFTER user_id;

-- 3. Populate it from the movies table
UPDATE ratings r
JOIN movies m ON m.tmdb_id = r.tmdb_id
SET r.movie_id = m.id;

-- 4. Make it NOT NULL, drop old column, update constraints
ALTER TABLE ratings
  MODIFY COLUMN movie_id INT UNSIGNED NOT NULL,
  DROP COLUMN tmdb_id,
  DROP INDEX uq_rating,
  ADD UNIQUE KEY uq_rating (user_id, movie_id),
  ADD CONSTRAINT fk_rat_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE;
