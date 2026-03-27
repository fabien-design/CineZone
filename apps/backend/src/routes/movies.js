import express from 'express';
import {
  getTrendingMovies,
  getLatestMovies,
  getMovieById,
  searchMulti,
  getGenres,
  discoverMovies,
} from '../services/tmdb.js';
import { movieLists } from '../controllers/movieController.js';

const router = express.Router();

router.get('/test', async (req, res, next) => {
  try {
    await movieLists(req, res);
  } catch (err) {
    console.error('Error in /test route:', err);
    next(err);
  }
});

router.get('/trending/:timeWindow', async (req, res, next) => {
  try {
    const data = await getTrendingMovies(req.params.timeWindow);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/latest', async (_req, res, next) => {
  try {
    const data = await getLatestMovies();
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/genres', async (_req, res, next) => {
  try {
    const data = await getGenres();
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/discover', async (req, res, next) => {
  try {
    const data = await discoverMovies(req.query);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'query param is required' });
    const data = await searchMulti(query);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = await getMovieById(req.params.id);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
