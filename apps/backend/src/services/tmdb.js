import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY },
});

tmdbClient.interceptors.response.use(
  res => res,
  err => {
    console.error(`[TMDB] ${err.response?.status}:`, err.response?.data?.status_message);
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
