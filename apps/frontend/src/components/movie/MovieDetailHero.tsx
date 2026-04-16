import { Bookmark, Play, ClockPlus, Eye } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
    formatRating,
    formatRuntime,
    formatYear,
    getBackdropUrl,
    getPosterUrl,
} from "../../lib/tmdb";
import { GenreBadge } from "../ui/GenreBadge";
import type { HeroMovieData, MovieRef } from "../../types/movie";
import { useState } from "react";
import { ViewerCount } from "./ViewerCount";
import { useTranslation } from "react-i18next";

interface MovieDetailHeroProps {
    movie: HeroMovieData;
    isAuthenticated: boolean;
    isFavorite: boolean;
    isInWatchlist: boolean;
    isWatched: boolean;
    onToggleFavorite: () => void;
    onToggleWatchlist: () => void;
    onToggleWatched: () => void;
    onWatchTrailer: () => void;
}

export function MovieDetailHero({
    movie,
    isAuthenticated,
    isFavorite,
    isInWatchlist,
    isWatched,
    onToggleFavorite,
    onToggleWatchlist,
    onToggleWatched,
    onWatchTrailer,
}: MovieDetailHeroProps) {
    const { t } = useTranslation();

    const backdropUrl = movie.source === "local" ? movie.backdrop_path : getBackdropUrl(movie.backdrop_path);
    const posterUrl = getPosterUrl(movie.poster_path, "w342");
    const hasTrailer = movie.videos?.results?.some(
        (v) => v.type === "Trailer" && v.site === "YouTube",
    );

    const movieRef: MovieRef = {
        source: movie.source ?? "tmdb",
        id: movie.id ?? 0,
    }

    const [optimisticFav, setOptimisticFav] = useState<boolean>(isFavorite);
    const [optimisticWatchlist, setOptimisticWatchlist] =
        useState<boolean>(isInWatchlist);
    const [optimisticWatched, setOptimisticWatched] =
        useState<boolean>(isWatched);

    return (
        <section className="relative h-[65vh] min-h-[520px] flex items-end overflow-hidden">
            {backdropUrl && (
                <img
                    src={backdropUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/75 to-cinema-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/40 to-transparent" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-10 flex items-end gap-6 md:gap-8">
                {/* Poster */}
                <img
                    src={posterUrl}
                    alt={`${movie.title} poster`}
                    className="hidden md:block w-40 lg:w-48 rounded-xl shadow-2xl shadow-cinema-950 shrink-0 border border-border/50"
                />

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <ViewerCount movieRef={movieRef} />
                    
                    {movie.genres?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((g) => (
                                <GenreBadge
                                    key={g.id}
                                    id={g.id}
                                    name={g.name}
                                    asLink
                                />
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl font-bold text-screen-50 leading-tight">
                        {movie.title}
                    </h1>

                    {movie.tagline && (
                        <p className="text-muted-foreground italic text-sm md:text-base">
                            "{movie.tagline}"
                        </p>
                    )}

                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1 text-reel-400 font-semibold">
                            <span aria-hidden>★</span>
                            <span
                                aria-label={`Rated ${formatRating(movie.vote_average)} out of 10`}
                            >
                                {formatRating(movie.vote_average)}
                            </span>
                            {movie.vote_count != null && (
                                <span className="text-muted-foreground font-normal">
                                    ({movie.vote_count.toLocaleString()})
                                </span>
                            )}
                        </span>
                        <span aria-hidden>·</span>
                        <span>
                            {formatYear(movie.release_date ?? undefined)}
                        </span>
                        {movie.runtime && (
                            <>
                                <span aria-hidden>·</span>
                                <span>{formatRuntime(movie.runtime)}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pt-1">
                        {hasTrailer && (
                            <Button onClick={onWatchTrailer} className="gap-2">
                                <Play size={15} fill="currentColor" />
                                {t("detail.watchTrailer")}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => {
                                setOptimisticFav(!optimisticFav);
                                onToggleFavorite();
                            }}
                            disabled={!isAuthenticated}
                            aria-pressed={optimisticFav}
                            className={cn(
                                "gap-2",
                                optimisticFav &&
                                    "border-curtain-500 text-curtain-300 bg-curtain-600/10",
                            )}
                        >
                            <Bookmark
                                size={15}
                                fill={optimisticFav ? "currentColor" : "none"}
                            />
                            {optimisticFav ? t("detail.isFavorite") : t("detail.favorite")}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setOptimisticWatchlist(!optimisticWatchlist);
                                onToggleWatchlist();
                            }}
                            disabled={!isAuthenticated}
                            aria-pressed={optimisticWatchlist}
                            className={cn(
                                "gap-2",
                                optimisticWatchlist &&
                                    "border-reel-500 text-reel-300 bg-reel-500/10",
                            )}
                        >
                            <ClockPlus size={15} color="currentColor" />
                            {isInWatchlist ? t("detail.isWatchlist") : t("detail.watchlist")}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setOptimisticWatched(!optimisticWatched);
                                onToggleWatched();
                            }}
                            disabled={!isAuthenticated}
                            aria-pressed={optimisticWatched}
                            className={cn(
                                "gap-2",
                                optimisticWatched &&
                                    "border-reel-500 text-reel-300 bg-reel-500/10",
                            )}
                        >
                            <Eye size={15} color="currentColor" />
                            {optimisticWatched ? t("detail.isWatched") : t("detail.watched")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
