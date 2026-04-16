import { Navbar } from '../layout/Navbar';
import { MovieCard } from '../ui/MovieCard';
import type { UserListMovie } from '../../api/userLists';
import type { Movie } from '../../types/movie';
import { MovieCardSkeleton } from '../ui/MovieCardSkeleton';

function listMovieToMovie(movie: UserListMovie): Movie {
    return {
        id: movie.is_custom ? movie.id : (movie.tmdb_id ?? movie.id),
        source: movie.is_custom ? 'local' : 'tmdb',
        title: movie.title,
        overview: '',
        poster_path: movie.poster_url,
        backdrop_path: movie.backdrop_url,
        release_date: movie.release_date ?? '',
        vote_average: Number(movie.vote_average) || 0,
        vote_count: 0,
        popularity: 0,
        genre_ids: [],
    };
}

interface UserListPageProps {
    title: string;
    icon: React.ReactNode;
    movies: UserListMovie[] | undefined;
    isLoading: boolean;
    emptyMessage: string;
}

export function UserListPage({ title, icon, movies, isLoading, emptyMessage }: UserListPageProps) {
    return (
        <div className="min-h-screen bg-cinema-950">
            <Navbar />
            <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-reel-400">{icon}</span>
                    <h1 className="text-2xl font-bold text-screen-100">{title}</h1>
                    {movies && movies.length > 0 && (
                        <span className="text-cinema-400 text-sm ml-1">
                            ({movies.length} film{movies.length > 1 ? 's' : ''})
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <MovieCardSkeleton key={`movie-skeleton-${i}`} />
                        ))}
                    </div>
                ) : !movies || movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-cinema-500">
                        <span className="text-4xl opacity-30">{icon}</span>
                        <p className="text-sm">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map(movie => (
                            <MovieCard key={`movie-${movie.id}`} movie={listMovieToMovie(movie)} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
