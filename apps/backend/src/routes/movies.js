import express from 'express';
import {
  getTrendingMovies,
  getLatestMovies,
  getMovieById,
  searchMulti,
  getGenres,
  discoverMovies,
} from '../services/tmdb.js';
import { createMovie, updateMovie, deleteMovie, getLocalMovies } from '../controllers/localMovieController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateLocalMovieCreation } from '../middlewares/validateLocalMovie.js';

const router = express.Router();

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

// Local movies CRUD
router.get('/local', authenticateUser, isAdmin, getLocalMovies);
router.post('/local', authenticateUser, isAdmin, validateLocalMovieCreation, createMovie);
router.put('/local/:id', authenticateUser, isAdmin, updateMovie);
router.delete('/local/:id', authenticateUser, isAdmin, deleteMovie);

export default router;
