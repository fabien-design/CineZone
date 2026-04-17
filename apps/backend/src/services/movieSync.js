import database from './database.js';
import { getMovieById } from './tmdb.js';

/**
 * Finds or creates a local movie row for a given TMDB id.
 * Fetches full details from TMDB if the movie doesn't exist locally.
 * Returns the local movies.id.
 */
export async function ensureMovieExists(tmdbId) {
    const [[existing]] = await database.query(
        'SELECT id FROM movies WHERE tmdb_id = ? LIMIT 1',
        [tmdbId],
    );

    if (existing) return existing.id;

    const movie = await getMovieById(tmdbId);

    const [result] = await database.query(
        `INSERT IGNORE INTO movies (tmdb_id, title, overview, poster_url, backdrop_url, release_date, vote_average, vote_count, is_custom)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
            movie.id,
            movie.title,
            movie.overview ?? null,
            movie.poster_path ?? null,
            movie.backdrop_path ?? null,
            movie.release_date ?? null,
            movie.vote_average ?? null,
            movie.vote_count ?? 0,
        ],
    );

    // insertId === 0 means INSERT IGNORE skipped a duplicate (race condition)
    const localId = result.insertId || (await database.query(
        'SELECT id FROM movies WHERE tmdb_id = ? LIMIT 1',
        [movie.id],
    ).then(([[row]]) => row.id));

    if (movie.genres?.length) {
        const genreValues = movie.genres.map(g => [localId, g.id]);
        await database.query(
            'INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES ?',
            [genreValues],
        );
    }

    return localId;
}
