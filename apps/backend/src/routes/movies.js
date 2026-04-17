import express from "express";
import {
    getTrendingMovies,
    getLatestMovies,
    getMovieById,
    searchMulti,
    getGenres,
    discoverMovies,
    getPopularMovies,
} from "../services/tmdb.js";
import {
    createMovie,
    updateMovie,
    deleteMovie,
    getLocalMovies,
    getLocalMovie,
    searchLocalMovies,
} from "../controllers/localMovieController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validateLocalMovieCreation } from "../middlewares/validateLocalMovie.js";
import { uploadMovieImages } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/trending/:timeWindow", async (req, res, next) => {
    try {
        const data = await getTrendingMovies(req.params.timeWindow);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get("/latest", async (_req, res, next) => {
    try {
        const data = await getLatestMovies();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get("/genres", async (_req, res, next) => {
    try {
        const data = await getGenres();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get("/discover", async (req, res, next) => {
    try {
        const data = await discoverMovies(req.query);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get("/search", async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query)
            return res.status(400).json({ message: "query param is required" });
        const localData = await searchLocalMovies(query);
        const data = await searchMulti(query);
        res.json({ local: localData, tmdb: data });
    } catch (err) {
        next(err);
    }
});

router.get("/random", async (_req, res, next) => {
    try {
        // Use pages 1-5 instead of 1-10 for more reliable data
        const page = Math.floor(Math.random() * 5) + 1;
        const data = await getPopularMovies(page);

        if (!data.results || !data.results.length) {
            return res.status(404).json({ message: "No movie found" });
        }

        const movies = data.results.filter(
            (m) => m.poster_path && m.id && m.title,
        );
        if (!movies.length) {
            return res
                .status(404)
                .json({ message: "No movie with poster found" });
        }

        const movie = movies[Math.floor(Math.random() * movies.length)];
        res.json({ id: movie.id, title: movie.title });
    } catch (err) {
        next(err);
    }
});

// Parse genre_ids JSON string sent via multipart/form-data
const parseGenreIds = (req, _res, next) => {
    if (typeof req.body.genre_ids === "string") {
        try {
            req.body.genre_ids = JSON.parse(req.body.genre_ids);
        } catch {
            req.body.genre_ids = [];
        }
    }
    next();
};

// Local movies CRUD — MUST be before /:id to avoid route conflict
router.get("/local/public", getLocalMovies); // Public: visible in discover for all users
router.get("/local", authenticateUser, isAdmin, getLocalMovies);
router.get("/local/:id", getLocalMovie);
router.post(
    "/local",
    authenticateUser,
    isAdmin,
    uploadMovieImages,
    parseGenreIds,
    validateLocalMovieCreation,
    createMovie,
);
router.put(
    "/local/:id",
    authenticateUser,
    isAdmin,
    uploadMovieImages,
    parseGenreIds,
    validateLocalMovieCreation,
    updateMovie,
);
router.delete("/local/:id", authenticateUser, isAdmin, deleteMovie);

router.get("/:id", async (req, res, next) => {
    try {
        const data = await getMovieById(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

export default router;
