import api from './axiosInstance';
import type { Genre, Movie, MovieDetail, PagedResponse } from '../types/movie';

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
    api.get<PagedResponse<Movie>>('/movies/search', { params: { query } }).then(r => r.data),

  discover: (params?: Record<string, unknown>) =>
    api.get<PagedResponse<Movie>>('/movies/discover', { params }).then(r => r.data),
};
