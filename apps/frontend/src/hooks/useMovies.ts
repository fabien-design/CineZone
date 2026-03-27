import { useQuery } from '@tanstack/react-query';
import { moviesApi, type TrendingWindow } from '../api/movies';
import type { MovieDetail } from '../types/movie';

export const useTrending = (window: TrendingWindow) =>
  useQuery({
    queryKey: ['movies', 'trending', window],
    queryFn: () => moviesApi.getTrending(window),
  });

export const useLatestMovies = () =>
  useQuery({
    queryKey: ['movies', 'latest'],
    queryFn: moviesApi.getLatest,
  });

export const useGenres = () =>
  useQuery({
    queryKey: ['genres'],
    queryFn: moviesApi.getGenres,
    staleTime: Infinity,
  });

export const useMovieById = (id: number) =>
  useQuery<MovieDetail>({
    queryKey: ['movies', id],
    queryFn: () => moviesApi.getById(id),
    enabled: id > 0,
  });

export const useSearch = (query: string) =>
  useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => moviesApi.search(query),
    enabled: query.length >= 2,
  });
