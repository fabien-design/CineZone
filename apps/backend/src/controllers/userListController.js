import database from "../services/database.js";
import { ensureMovieExists } from "../services/movieSync.js";

async function resolveMovieId(source, rawId) {
    if (source === "tmdb") return ensureMovieExists(Number(rawId));
    const [[row]] = await database.query(
        "SELECT id FROM movies WHERE id = ? AND is_custom = 1 LIMIT 1",
        [Number(rawId)],
    );
    return row?.id ?? null;
}

async function findMovieId(source, rawId) {
    if (source === "tmdb") {
        const [[row]] = await database.query(
            "SELECT id FROM movies WHERE tmdb_id = ? LIMIT 1",
            [Number(rawId)],
        );
        return row?.id ?? null;
    }
    return Number(rawId);
}

const LISTS = {
    favorites: { table: "favorites", timeCol: "added_at" },
    watchlist: { table: "watchlist", timeCol: "added_at" },
    watched: { table: "watch_history", timeCol: "watched_at" },
};

function makeHandlers(listName) {
    const { table, timeCol } = LISTS[listName];

    async function getList(req, res, next) {
        try {
            const [rows] = await database.query(
                `SELECT m.id, m.tmdb_id, m.title, m.poster_url, m.backdrop_url,
                        m.release_date, m.vote_average, m.is_custom,
                        l.${timeCol} AS added_at
                 FROM ${table} l
                 JOIN movies m ON m.id = l.movie_id
                 WHERE l.user_id = ?
                 ORDER BY l.${timeCol} DESC`,
                [req.userId],
            );
            res.json(rows);
        } catch (err) {
            next(err);
        }
    }

    async function addToList(req, res, next) {
        try {
            const { source = "tmdb", id } = req.params;
            const movieId = await resolveMovieId(source, id);
            if (!movieId) {
                return res.status(404).json({ message: "Movie not found" });
            }

            await database.query(
                `INSERT IGNORE INTO ${table} (user_id, movie_id) VALUES (?, ?)`,
                [req.userId, movieId],
            );
            res.status(201).json({ message: `Added to ${table}` });
        } catch (err) {
            next(err);
        }
    }

    async function removeFromList(req, res, next) {
        try {
            const { source = "tmdb", id } = req.params;
            const movieId = await findMovieId(source, id);
            if (!movieId) {
                return res.status(404).json({ message: "Movie not found" });
            }

            const [result] = await database.query(
                `DELETE FROM ${table} WHERE user_id = ? AND movie_id = ?`,
                [req.userId, movieId],
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Not in list" });
            }
            res.json({ message: `Removed from ${table}` });
        } catch (err) {
            next(err);
        }
    }

    async function getStatus(req, res, next) {
        try {
            const { source = "tmdb", id } = req.params;
            const movieId = await findMovieId(source, id);
            if (!movieId) return res.json({ inList: false });

            const [[row]] = await database.query(
                `SELECT id FROM ${table} WHERE user_id = ? AND movie_id = ? LIMIT 1`,
                [req.userId, movieId],
            );
            res.json({ inList: !!row });
        } catch (err) {
            next(err);
        }
    }

    return { getList, addToList, removeFromList, getStatus };
}

export const favorites = makeHandlers("favorites");
export const watchlist = makeHandlers("watchlist");
export const watched = makeHandlers("watched");
