import api from './axiosInstance';
import type { Genre, LocalMovie, LocalMoviePayload, Movie, MovieDetail, PagedResponse } from '../types/movie';

export type TrendingWindow = 'day' | 'week';

export const moviesApi = {
  getTrending: (window: TrendingWindow) =>
    api.get<PagedResponse<Movie>>(`/movies/trending/${window}`).then(r => r.data),

  getLatest: () =>
    api.get<PagedResponse<Movie>>('/movies/latest').then(r => r.data),

  getGenres: () =>
    api.get<{ genres: Genre[] }>('/movies/genres').then(r => r.data),

  getById: (id: number) =>
    api.get<MovieDetail>(`/movies/${id}`).then(r => r.data),

  search: (query: string) =>
    api.get<{ local: LocalMovie[]; tmdb: PagedResponse<Movie> }>('/movies/search', { params: { query } }).then(r => r.data),

  discover: (params?: Record<string, unknown>) =>
    api.get<PagedResponse<Movie>>('/movies/discover', { params }).then(r => r.data),

  // --- Local movies ---
  getPublicLocalMovies: () =>
    api.get<LocalMovie[]>('/movies/local/public').then(r => r.data),

  getLocalMovies: () =>
    api.get<LocalMovie[]>('/movies/local').then(r => r.data),

  getLocalMovieById: (id: number) =>
    api.get<LocalMovie>(`/movies/local/${id}`).then(r => r.data),

  createLocalMovie: (data: LocalMoviePayload) =>
    api.post<LocalMovie>('/movies/local', data).then(r => r.data),

  updateLocalMovie: (id: number, data: LocalMoviePayload) =>
    api.put<LocalMovie>(`/movies/local/${id}`, data).then(r => r.data),

  deleteLocalMovie: (id: number) =>
    api.delete(`/movies/local/${id}`).then(r => r.data),

  getRandom: () =>
    api.get<{ id: number; title: string }>('/movies/random', { suppressErrorToast: true }).then(r => r.data),
};
