import { Link } from 'react-router';
import { Button } from '../ui/button';
import { formatRating, formatYear, getBackdropUrl } from '../../lib/tmdb';
import type { Movie } from '../../types/movie';
import { useTranslation } from 'react-i18next';

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const { t } = useTranslation();

  return (
    <section className="relative h-[90vh] min-h-[540px] flex items-end overflow-hidden">
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/30 to-transparent" />

      <div className="relative z-10 px-6 pb-20 md:px-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1 text-reel-400 font-semibold text-sm">
            <span aria-hidden>★</span>
            <span aria-label={`Rated ${formatRating(movie.vote_average)} out of 10`}>
              {formatRating(movie.vote_average)}
            </span>
          </span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" aria-hidden />
          <span className="text-muted-foreground text-sm">{formatYear(movie.release_date)}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-screen-50 mb-4 leading-tight">
          {movie.title}
        </h1>

        <p className="text-muted-foreground text-base md:text-lg line-clamp-3 mb-8 max-w-xl leading-relaxed">
          {movie.overview}
        </p>

        <Button size="lg">
          <Link to={`/movies/${movie.id}`}>{t('detail.showMore')}</Link>
        </Button>
      </div>
    </section>
  );
}
