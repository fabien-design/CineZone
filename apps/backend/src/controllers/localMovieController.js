import database from "../services/database.js";

export async function createMovie(req, res) {
    const {
        title,
        overview,
        poster_url,
        backdrop_url,
        release_date,
        vote_average,
        genre_ids,
    } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });

    try {
        const [result] = await database.query(
            `INSERT INTO movies (title, overview, poster_url, backdrop_url, release_date, vote_average, is_custom)
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [
                title,
                overview ?? null,
                poster_url ?? null,
                backdrop_url ?? null,
                release_date ?? null,
                vote_average ?? null,
            ],
        );

        const localId = result.insertId;

        if (genre_ids?.length) {
            const genreValues = genre_ids.map((gId) => [localId, gId]);
            await database.query(
                "INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES ?",
                [genreValues],
            );
        }

        const [[movie]] = await database.query(
            "SELECT * FROM movies WHERE id = ?",
            [localId],
        );
        return res.status(201).json(movie);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error has occurred" });
    }
}

export async function updateMovie(req, res) {
    const id = parseInt(req.params.id);
    const {
        title,
        overview,
        poster_url,
        backdrop_url,
        release_date,
        vote_average,
        genre_ids,
    } = req.body;

    try {
        const [[existing]] = await database.query(
            "SELECT id FROM movies WHERE id = ? AND is_custom = 1",
            [id],
        );
        if (!existing)
            return res.status(404).json({ message: "Local movie not found" });

        await database.query(
            `UPDATE movies SET title = ?, overview = ?, poster_url = ?, backdrop_url = ?, release_date = ?, vote_average = ?
             WHERE id = ?`,
            [
                title,
                overview ?? null,
                poster_url ?? null,
                backdrop_url ?? null,
                release_date ?? null,
                vote_average ?? null,
                id,
            ],
        );

        if (genre_ids) {
            await database.query(
                "DELETE FROM movie_genres WHERE movie_id = ?",
                [id],
            );
            if (genre_ids.length) {
                const genreValues = genre_ids.map((gId) => [id, gId]);
                await database.query(
                    "INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES ?",
                    [genreValues],
                );
            }
        }

        const [[movie]] = await database.query(
            "SELECT * FROM movies WHERE id = ?",
            [id],
        );
        return res.status(200).json(movie);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error has occurred" });
    }
}

export async function deleteMovie(req, res) {
    const id = parseInt(req.params.id);

    try {
        const [result] = await database.query(
            "DELETE FROM movies WHERE id = ? AND is_custom = 1",
            [id],
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Local movie not found" });
        }
        return res.status(200).json({ message: "Movie deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error has occurred" });
    }
}

export async function getLocalMovies(req, res) {
    try {
        const [movies] = await database.query(
            "SELECT * FROM movies WHERE is_custom = 1 ORDER BY created_at DESC",
        );
        return res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error has occurred" });
    }
}
