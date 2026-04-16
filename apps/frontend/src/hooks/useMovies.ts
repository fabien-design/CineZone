import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moviesApi, type TrendingWindow } from "../api/movies";
import type { LocalMovie, LocalMoviePayload, MovieDetail } from "../types/movie";

export const useTrending = (window: TrendingWindow) =>
    useQuery({
        queryKey: ["movies", "trending", window],
        queryFn: () => moviesApi.getTrending(window),
        staleTime: 1000 * 60 * 60 * 24,
    });

export const useLatestMovies = () =>
    useQuery({
        queryKey: ["movies", "latest"],
        queryFn: moviesApi.getLatest,
        staleTime: 1000 * 60 * 60 * 24,
        retry: 1,
    });

export const useGenres = () =>
    useQuery({
        queryKey: ["genres"],
        queryFn: moviesApi.getGenres,
        staleTime: Infinity,
    });

export const useMovieById = (id: number, enabled = true) =>
    useQuery<MovieDetail>({
        queryKey: ["movies", "tmdb", id],
        queryFn: () => moviesApi.getById(id),
        enabled: enabled && id > 0,
        staleTime: 1000 * 60 * 60 * 24,
    });

export const useLocalMovieById = (id: number, enabled = true) =>
    useQuery<LocalMovie>({
        queryKey: ["movies", "local", id],
        queryFn: () => moviesApi.getLocalMovieById(id),
        enabled: enabled && id > 0,
        staleTime: 1000 * 60 * 60 * 24,
    });

export const useSearch = (query: string) =>
    useQuery({
        queryKey: ["movies", "search", query],
        queryFn: () => moviesApi.search(query),
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 60 * 24,
    });

// --- Local movies list + CRUD mutations ---

export const useLocalMovies = (enabled = true) =>
    useQuery<LocalMovie[]>({
        queryKey: ["movies", "local"],
        queryFn: moviesApi.getLocalMovies,
        enabled,
        staleTime: 1000 * 60 * 5,
    });

export const usePublicLocalMovies = (enabled = true) =>
    useQuery<LocalMovie[]>({
        queryKey: ["movies", "local", "public"],
        queryFn: moviesApi.getPublicLocalMovies,
        enabled,
        staleTime: 1000 * 60 * 5,
    });

export const useDiscover = (params: Record<string, unknown>, enabled = true) =>
    useQuery({
        queryKey: ["movies", "discover", params],
        queryFn: () => moviesApi.discover(params),
        enabled,
        staleTime: 1000 * 60 * 30,
    });

export const useCreateLocalMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LocalMoviePayload) => moviesApi.createLocalMovie(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies", "local"] });
        },
    });
};

export const useUpdateLocalMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: LocalMoviePayload }) =>
            moviesApi.updateLocalMovie(id, data),
        onSuccess: (_result, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["movies", "local"] });
            queryClient.invalidateQueries({ queryKey: ["movies", "local", id] });
        },
    });
};

export const useDeleteLocalMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => moviesApi.deleteLocalMovie(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies", "local"] });
        },
    });
};
