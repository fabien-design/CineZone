import { MovieCard } from '../ui/MovieCard';
import { MovieCardSkeleton } from '../ui/MovieCardSkeleton';
import { Button } from '../ui/button';
import type { Movie } from '../../types/movie';

interface DiscoverGridProps {
    movies: Movie[];
    isLoading: boolean;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

const SKELETON_COUNT = 18;

export function DiscoverGrid({
    movies,
    isLoading,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: DiscoverGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-cinema-500 text-sm">
                    Aucun film ne correspond à ces critères.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map(movie => (
                    <MovieCard
                        key={`${movie.source ?? 'tmdb'}-${movie.id}`}
                        movie={movie}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
                        {isLoadingMore ? 'Chargement…' : 'Charger plus'}
                    </Button>
                </div>
            )}
            {isLoadingMore && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                        <MovieCardSkeleton key={`skeleton-${i}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
