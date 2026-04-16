/**
 * Identifies where a movie lives, used to route rating/watchlist/favorite requests.
 * - tmdb   → movie only exists on TMDB (no local DB row)
 * - local  → movie exists in local DB (local-only OR hybrid TMDB copy)
 *            hybrid movies always use their local id so ratings stay in one place
 */
export type MovieRef =
    | { source: "tmdb"; id: number }
    | { source: "local"; id: number };

/** Movie stored in the local DB (is_custom = 1). */
export interface LocalMovie {
    id: number;
    source: "local";
    title: string;
    overview: string | null;
    poster_url: string | null;
    backdrop_url: string | null;
    release_date: string | null;
    vote_average: number | null;
    is_custom: 1;
    created_at: string;
    genres: Genre[];
}

/** Payload sent to create or update a local movie. */
export interface LocalMoviePayload {
    title: string;
    overview?: string | null;
    poster_url?: string | null;
    backdrop_url?: string | null;
    release_date?: string | null;
    vote_average?: number | null;
    genre_ids?: number[];
}

export interface Movie {
    id: number;
    source?: "tmdb" | "local";
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genre_ids: number[];
    media_type?: "movie" | "tv";
    adult?: boolean;
    original_language?: string;
    original_title?: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface PagedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: "YouTube" | "Vimeo" | string;
    type: "Trailer" | "Teaser" | "Clip" | "Featurette" | string;
    official: boolean;
}

/**
 * Minimal shape required by MovieDetailHero.
 * Both MovieDetail and LocalMovie can be adapted to this type.
 */
export interface HeroMovieData {
    source?: "tmdb" | "local";
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count?: number;
    release_date: string | null;
    runtime?: number | null;
    tagline?: string | null;
    genres: Genre[];
    videos?: { results: Video[] };
}

export interface MovieDetail extends Movie {
    source: "tmdb";
    genres: Genre[];
    runtime: number | null;
    tagline: string | null;
    status: string;
    budget: number;
    revenue: number;
    homepage: string | null;
    imdb_id: string | null;
    credits: {
        cast: CastMember[];
        crew: CrewMember[];
    };
    videos: {
        results: Video[];
    };
    recommendations: PagedResponse<Movie>;
}
