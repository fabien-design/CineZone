import database from '../services/database.js';
import { ensureMovieExists } from '../services/movieSync.js';

async function resolveMovieId(tmdbId) {
  return ensureMovieExists(Number(tmdbId));
}

async function getMovieId(source, rawId) {
  if (source === 'tmdb') return resolveMovieId(Number(rawId));

  // local source
  const [[row]] = await database.query(
    'SELECT id FROM movies WHERE id = ? LIMIT 1',
    [Number(rawId)],
  );
  if (!row) return null;
  return row.id;
}

// GET /ratings/:source/:id  — public, all ratings for a movie
export async function getForMovie(req, res) {
  const movieId = await getMovieId(req.params.source, req.params.id);
  if (!movieId) return res.status(404).json({ message: 'Movie not found' });

  const [rows] = await database.query(
    `SELECT r.id, r.user_id, r.movie_id, r.score, r.comment, r.created_at,
            u.username
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.movie_id = ?
     ORDER BY r.created_at DESC`,
    [movieId],
  );
  res.json(rows);
}

// GET /ratings/:source/:id/me  — auth, current user's rating
export async function getMyRating(req, res) {
  const movieId = await getMovieId(req.params.source, req.params.id);
  if (!movieId) return res.status(404).json({ message: 'Movie not found' });

  const [[row]] = await database.query(
    'SELECT id, user_id, movie_id, score, comment, created_at FROM ratings WHERE user_id = ? AND movie_id = ? LIMIT 1',
    [req.userId, movieId],
  );
  if (!row) return res.status(404).json({ message: 'No rating found' });
  res.json(row);
}

// PUT /ratings/:source/:id  — auth, create or update
export async function upsert(req, res) {
  const { score, comment = null } = req.body;

  if (!score || score < 1 || score > 10) {
    return res.status(400).json({ message: 'score must be between 1 and 10' });
  }

  const movieId = await getMovieId(req.params.source, req.params.id);
  if (!movieId) return res.status(404).json({ message: 'Movie not found' });

  await database.query(
    `INSERT INTO ratings (user_id, movie_id, score, comment)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score), comment = VALUES(comment), updated_at = CURRENT_TIMESTAMP`,
    [req.userId, movieId, score, comment],
  );

  const [[row]] = await database.query(
    'SELECT id, user_id, movie_id, score, comment, created_at FROM ratings WHERE user_id = ? AND movie_id = ? LIMIT 1',
    [req.userId, movieId],
  );
  res.status(200).json(row);
}

export async function deleteRating(req, res) {
  const movieId = await getMovieId(req.params.source, req.params.id);
  if (!movieId) return res.status(404).json({ message: 'Movie not found' });

  const [result] = await database.query(
    'DELETE FROM ratings WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Rating not found' });
  }
  res.status(200).json({ message: 'Rating deleted' });
}
