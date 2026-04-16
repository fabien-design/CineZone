import api from "./axiosInstance";
import type { MovieRef } from "../types/movie";

export interface UserListMovie {
    id: number;
    tmdb_id: number | null;
    title: string;
    poster_url: string | null;
    backdrop_url: string | null;
    release_date: string | null;
    vote_average: number | null;
    is_custom: 0 | 1;
    added_at: string;
}

type ListName = "favorites" | "watchlist" | "watched";

function refToPath({ source, id }: MovieRef) {
    return `${source}/${id}`;
}

function makeListApi(list: ListName) {
    return {
        getAll: () =>
            api.get<UserListMovie[]>(`/lists/${list}`).then((r) => r.data),

        add: (ref: MovieRef) =>
            api.post(`/lists/${list}/${refToPath(ref)}`).then((r) => r.data),

        remove: (ref: MovieRef) =>
            api.delete(`/lists/${list}/${refToPath(ref)}`).then((r) => r.data),

        getStatus: (ref: MovieRef) =>
            api.get<{
                    inList: boolean;
                }>(`/lists/${list}/${refToPath(ref)}/status`)
                .then((r) => r.data),
    };
}

export const favoritesApi = makeListApi("favorites");
export const watchlistApi = makeListApi("watchlist");
export const watchedApi = makeListApi("watched");
