import { MovieCard } from '../ui/MovieCard';
import { MovieCardSkeleton } from '../ui/MovieCardSkeleton';
import type { Movie } from '../../types/movie';

interface MovieRowProps {
  movies: Movie[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function MovieRow({ movies, isLoading = false, skeletonCount = 6 }: MovieRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <p className="text-cinema-400 text-sm py-8 text-center">No movies found.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
