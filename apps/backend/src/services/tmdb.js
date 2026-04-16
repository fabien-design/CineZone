import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const RETRY_CODES = new Set(['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND']);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY },
  timeout: 10000,
});

tmdbClient.interceptors.response.use(
  res => res,
  async err => {
    const config = err.config;
    const isNetworkError = !err.response && RETRY_CODES.has(err.code);

    if (isNetworkError && (config._retries ?? 0) < MAX_RETRIES) {
      config._retries = (config._retries ?? 0) + 1;
      const delay = RETRY_DELAY_MS * config._retries;
      console.warn(`[TMDB] ${err.code} — retry ${config._retries}/${MAX_RETRIES} in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
      return tmdbClient(config);
    }

    if (err.response) {
      console.error(`[TMDB] ${err.response.status}:`, err.response.data?.status_message);
    } else {
      console.error(`[TMDB] Network error: ${err.code} — ${err.message}`);
    }
    return Promise.reject(err);
  }
);

export const getTrendingMovies = (timeWindow = 'week') =>
  tmdbClient.get(`/trending/movie/${timeWindow}`).then(r => r.data);

export const getLatestMovies = () =>
  tmdbClient.get('/movie/now_playing').then(r => r.data);

export const getMovieById = (id) =>
  tmdbClient.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,recommendations' },
  }).then(r => r.data);

export const searchMulti = (query) => 
  tmdbClient.get('/search/multi', { params: { query } }).then(r => r.data);

export const getGenres = () =>
  tmdbClient.get('/genre/movie/list').then(r => r.data);

export const discoverMovies = (options = {}) =>
  tmdbClient.get('/discover/movie', { params: options }).then(r => r.data);

export const getPopularMovies = (page = 1) =>
  tmdbClient.get('/movie/popular', { params: { page } }).then(r => r.data);
