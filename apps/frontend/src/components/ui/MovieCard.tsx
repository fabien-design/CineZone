import { Link } from 'react-router';
import { cn } from '../../lib/utils';
import { formatRating, formatYear, getPosterUrl } from '../../lib/tmdb';
import type { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Link
      to={movie.source === 'local' ? `/movies/local/${movie.id}` : `/movies/${movie.id}`}
      className={cn(
        'group relative flex flex-col rounded-lg overflow-hidden bg-cinema-800',
        'transition-transform duration-300 hover:-translate-y-1',
        'hover:shadow-xl hover:shadow-cinema-950/60',
        className,
      )}
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-cinema-950/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-reel-400">
          <span aria-hidden>★</span>
          <span>{movie.vote_average ? formatRating(movie.vote_average) : 'N/A'}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-screen-100 text-sm font-medium line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        <span className="text-cinema-400 text-xs">{movie.release_date ? formatYear(movie.release_date) : 'N/A'}</span>
      </div>
    </Link>
  );
}
