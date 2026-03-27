import { Heart, Bookmark, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { formatRating, formatRuntime, formatYear, getBackdropUrl, getPosterUrl } from '../../lib/tmdb';
import { GenreBadge } from '../ui/GenreBadge';
import type { MovieDetail } from '../../types/movie';

interface MovieDetailHeroProps {
  movie: MovieDetail;
  isAuthenticated: boolean;
  isFavorite: boolean;
  isInWatchlist: boolean;
  onToggleFavorite: () => void;
  onToggleWatchlist: () => void;
  onWatchTrailer: () => void;
}

export function MovieDetailHero({
  movie,
  isAuthenticated,
  isFavorite,
  isInWatchlist,
  onToggleFavorite,
  onToggleWatchlist,
  onWatchTrailer,
}: MovieDetailHeroProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path, 'w342');
  const hasTrailer = movie.videos?.results?.some(
    v => v.type === 'Trailer' && v.site === 'YouTube',
  );

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
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(g => (
                <GenreBadge key={g.id} id={g.id} name={g.name} asLink />
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
              <span aria-label={`Rated ${formatRating(movie.vote_average)} out of 10`}>
                {formatRating(movie.vote_average)}
              </span>
              <span className="text-muted-foreground font-normal">
                ({movie.vote_count.toLocaleString()})
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>{formatYear(movie.release_date)}</span>
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
                Watch Trailer
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onToggleFavorite}
              disabled={!isAuthenticated}
              aria-pressed={isFavorite}
              className={cn(
                'gap-2',
                isFavorite && 'border-curtain-500 text-curtain-300 bg-curtain-600/10',
              )}
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Favorite'}
            </Button>

            <Button
              variant="outline"
              onClick={onToggleWatchlist}
              disabled={!isAuthenticated}
              aria-pressed={isInWatchlist}
              className={cn(
                'gap-2',
                isInWatchlist && 'border-reel-500 text-reel-300 bg-reel-500/10',
              )}
            >
              <Bookmark size={15} fill={isInWatchlist ? 'currentColor' : 'none'} />
              {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
