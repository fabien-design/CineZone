import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi, watchlistApi, watchedApi } from "../api/userLists";
import type { MovieRef } from "../types/movie";

type ListName = "favorites" | "watchlist" | "watched";

const apis = {
    favorites: favoritesApi,
    watchlist: watchlistApi,
    watched: watchedApi,
};

export const useFavorites = (enabled = true) =>
    useQuery({
        queryKey: ["lists", "favorites"],
        queryFn: favoritesApi.getAll,
        enabled,
        staleTime: 1000 * 60 * 60,
    });
export const useWatchlist = (enabled = true) =>
    useQuery({
        queryKey: ["lists", "watchlist"],
        queryFn: watchlistApi.getAll,
        enabled,
        staleTime: 1000 * 60 * 60,
    });
export const useWatched = (enabled = true) =>
    useQuery({
        queryKey: ["lists", "watched"],
        queryFn: watchedApi.getAll,
        enabled,
        staleTime: 1000 * 60 * 60,
    });

// Status for a specific movie in a specific list
export function useListStatus(list: ListName, ref: MovieRef, enabled = true) {
    return useQuery({
        queryKey: ["lists", list, "status", ref.source, ref.id],
        queryFn: () => apis[list].getStatus(ref),
        enabled: enabled && ref.id > 0,
        staleTime: 1000 * 60 * 60,
    });
}

// Toggle mutation

export function useToggleList(list: ListName, ref: MovieRef) {
    const qc = useQueryClient();
    const statusKey = ["lists", list, "status", ref.source, ref.id];
    const listKey = ["lists", list];

    return useMutation({
        mutationFn: async (currentlyIn: boolean) =>
            currentlyIn ? apis[list].remove(ref) : apis[list].add(ref),
        onMutate: async (currentlyIn) => {
            await qc.cancelQueries({ queryKey: statusKey });
            const prev = qc.getQueryData(statusKey);
            qc.setQueryData(statusKey, { inList: !currentlyIn });
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            qc.setQueryData(statusKey, ctx?.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: statusKey });
            qc.invalidateQueries({ queryKey: listKey });
        },
    });
}
