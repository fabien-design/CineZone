import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { DiscoverFilters } from "../components/discover/DiscoverFilters";
import { DiscoverGrid } from "../components/discover/DiscoverGrid";
import {
    useGenres,
    usePublicLocalMovies,
    useDiscover,
    useSearch,
} from "../hooks/useMovies";
import { RATING_FILTERS, localToMovie } from "../lib/discover";
import type { Movie } from "../types/movie";
import type { RatingKey, SourceFilter } from "../types/discover";
import { useSearchParams } from "react-router";
import BottomBar from "@/components/layout/BottomBar";

export function DiscoverPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [debouncedQuery, setDebounced] = useState("");
    const [source, setSource] = useState<SourceFilter>(searchParams.get("source") as SourceFilter ?? "all");
    const [rating, setRating] = useState<RatingKey | null>(searchParams.get("rating") as RatingKey ?? null);
    const [selectedGenres, setGenres] = useState<number[]>(searchParams.get("genres")?.split(",").map(Number) ?? []);
    const [page, setPage] = useState(1);
    const [accTmdb, setAccTmdb] = useState<Movie[]>([]);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(query), 400);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        const params: Record<string, string> = {};
        if (query) params.q = query;
        if (source !== "all") params.source = source;
        if (rating) params.rating = rating;
        if (selectedGenres.length) params.genres = selectedGenres.join(",");
        setSearchParams(params);
    }, [debouncedQuery, source, rating, selectedGenres]);

    const genreKey = selectedGenres.join(",");
    useEffect(() => {
        setPage(1);
        setAccTmdb([]);
    }, [debouncedQuery, source, rating, genreKey]);

    const isSearchMode = debouncedQuery.length >= 2;
    const showTmdb = source !== "local";
    const showLocal = source !== "tmdb";

    const ratingRange = useMemo(
        () =>
            rating ? RATING_FILTERS.find((r) => r.key === rating) : undefined,
        [rating],
    );

    const discoverParams = useMemo<Record<string, unknown>>(
        () => ({
            page,
            sort_by: "popularity.desc",
            ...(selectedGenres.length && { with_genres: genreKey }),
            ...(ratingRange && {
                "vote_average.gte": ratingRange.gte,
                "vote_average.lte": ratingRange.lte,
            }),
        }),
        [page, genreKey, ratingRange],
    );

    const { data: discoverData, isFetching: discoverFetching } = useDiscover(
        discoverParams,
        showTmdb && !isSearchMode,
    );
    const { data: searchData, isFetching: searchFetching } =
        useSearch(debouncedQuery);
    const { data: localMovies } = usePublicLocalMovies(
        showLocal && !isSearchMode,
    );
    const { data: genresData } = useGenres();
    const genres = genresData?.genres ?? [];

    useEffect(() => {
        if (!discoverData?.results || isSearchMode) return;
        setAccTmdb((prev) =>
            page === 1
                ? discoverData.results
                : [...prev, ...discoverData.results],
        );
    }, [discoverData, source]);

    const tmdbMovies: Movie[] = useMemo(() => {
        if (!showTmdb) return [];
        if (isSearchMode) {
            return (searchData?.tmdb?.results ?? [])
                .filter((m: Movie) => m.media_type !== "tv")
                .filter(
                    (m: Movie) =>
                        !ratingRange ||
                        (m.vote_average >= ratingRange.gte &&
                            m.vote_average <= ratingRange.lte),
                )
                .filter(
                    (m: Movie) =>
                        selectedGenres.length === 0 ||
                        selectedGenres.some((g) => m.genre_ids.includes(g)),
                );
        }
        return accTmdb;
    }, [
        showTmdb,
        isSearchMode,
        searchData,
        accTmdb,
        ratingRange,
        selectedGenres,
    ]);

    const localMoviesConverted: Movie[] = useMemo(() => {
        if (!showLocal) return [];
        const base = isSearchMode
            ? (searchData?.local ?? [])
            : (localMovies ?? []).filter(
                  (m) =>
                      !debouncedQuery ||
                      m.title
                          .toLowerCase()
                          .includes(debouncedQuery.toLowerCase()),
              );
        return base
            .filter(
                (m) =>
                    !ratingRange ||
                    (m.vote_average != null &&
                        m.vote_average >= ratingRange.gte &&
                        m.vote_average <= ratingRange.lte),
            )
            .filter(
                (m) =>
                    selectedGenres.length === 0 ||
                    selectedGenres.some((g) =>
                        m.genres.some((mg) => mg.id === g),
                    ),
            )
            .map(localToMovie);
    }, [
        showLocal,
        isSearchMode,
        searchData,
        localMovies,
        debouncedQuery,
        ratingRange,
        selectedGenres,
    ]);

    const results: Movie[] = useMemo(() => {
        if (source === "local") return localMoviesConverted;
        if (source === "tmdb") return tmdbMovies;
        return [...localMoviesConverted, ...tmdbMovies];
    }, [source, localMoviesConverted, tmdbMovies]);

    // ── UI state ──────────────────────────────────────────────────────────────
    const isLoading =
        (showTmdb &&
            !isSearchMode &&
            discoverFetching &&
            accTmdb.length === 0) ||
        (isSearchMode && searchFetching);

    const hasMore =
        !isSearchMode && showTmdb && page < (discoverData?.total_pages ?? 1);

    const hasActiveFilters =
        rating !== null ||
        selectedGenres.length > 0 ||
        source !== "all" ||
        query !== "";

    const handleGenreToggle = (id: number) =>
        setGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
        );

    const handleGenresClear = () => setGenres([]);

    const handleClearAll = () => {
        setRating(null);
        setGenres([]);
        setSource("all");
        setQuery("");
    };

    return (
        <div className="min-h-screen bg-cinema-950">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 flex flex-col gap-5">
                {/* Search bar */}
                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-cinema-400 pointer-events-none"
                        size={18}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher un film..."
                        className="w-full bg-cinema-900 border border-border/40 rounded-xl pl-11 pr-10 py-3 text-screen-100 placeholder:text-cinema-500 focus:outline-none focus:border-reel-400/50 focus:ring-1 focus:ring-reel-400/20 transition-colors text-sm"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-400 hover:text-screen-100 transition-colors p-1"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <DiscoverFilters
                    source={source}
                    onSourceChange={setSource}
                    rating={rating}
                    onRatingChange={setRating}
                    selectedGenres={selectedGenres}
                    onGenreToggle={handleGenreToggle}
                    onGenresClear={handleGenresClear}
                    onClearAll={handleClearAll}
                    genres={genres}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Result count */}
                {!isLoading && (
                    <p className="text-cinema-500 text-xs">
                        {results.length > 0
                            ? `${results.length} film${results.length > 1 ? "s" : ""}`
                            : null}
                    </p>
                )}

                {/* Grid */}
                <DiscoverGrid
                    movies={results}
                    isLoading={isLoading}
                    hasMore={hasMore}
                    isLoadingMore={discoverFetching}
                    onLoadMore={() => setPage((p) => p + 1)}
                />
            </main>

            <BottomBar />
        </div>
    );
}
