import { useRef } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMovieById } from '../hooks/useMovies';
import { formatMoney } from '../lib/tmdb';
import { Navbar } from '../components/layout/Navbar';
import { HeroBannerSkeleton } from '../components/movie/HeroBannerSkeleton';
import { MovieDetailHero } from '../components/movie/MovieDetailHero';
import { CastSection } from '../components/movie/CastSection';
import { TrailerSection } from '../components/movie/TrailerSection';
import { UserActions } from '../components/movie/UserActions';
import { MovieRow } from '../components/movie/MovieRow';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useAuth } from '@/hooks/useAuth';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { isAuthenticated } = useAuth(); 
  const { data: movie, isLoading: isLoadingMovie, isError } = useMovieById(movieId);

  const trailerRef = useRef<HTMLDivElement>(null);
  const scrollToTrailer = () =>
    trailerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-cinema-950">
        <Navbar />
        <HeroBannerSkeleton />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-cinema-950 flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-screen-300 text-lg">Movie not found.</p>
        <Link to="/" className="text-reel-400 hover:text-reel-300 text-sm underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const cast = movie.credits?.cast?.slice(0, 15) ?? [];
  const recommendations = movie.recommendations?.results?.slice(0, 12) ?? [];
  const hasTrailerSection = movie.videos?.results?.some(v => v.site === 'YouTube');

  const extraInfo: { label: string; value: string }[] = [
    { label: 'Status', value: movie.status },
    { label: 'Budget', value: formatMoney(movie.budget) },
    { label: 'Revenue', value: formatMoney(movie.revenue) },
    { label: 'Original Language', value: movie.original_language?.toUpperCase() ?? 'N/A' },
  ].filter(item => item.value && item.value !== 'N/A');

  return (
    <div className="min-h-screen bg-cinema-950">
      <Navbar />

      <MovieDetailHero
        movie={movie}
        isAuthenticated={isAuthenticated}
        isFavorite={false}       // TODO: wire up when auth is ready
        isInWatchlist={false}    // TODO: wire up when auth is ready
        onToggleFavorite={() => {}}
        onToggleWatchlist={() => {}}
        onWatchTrailer={scrollToTrailer}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-14">
        {/* Back link */}
        <Link
          to="/"
          className="self-start flex items-center gap-1 text-sm text-cinema-400 hover:text-screen-100 transition-colors duration-200 -mt-6"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        {/* Overview */}
        <section aria-labelledby="overview-heading">
          <SectionHeader title="Overview" id="overview-heading" />
          <div className="flex flex-col md:flex-row gap-8">
            <p className="text-screen-300 text-base leading-relaxed flex-1">
              {movie.overview || 'No overview available.'}
            </p>
            {/* Extra info sidebar */}
            {extraInfo.length > 0 && (
              <dl className="flex flex-col gap-3 md:w-56 shrink-0">
                {extraInfo.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-cinema-400 text-xs uppercase tracking-wide mb-0.5">{label}</dt>
                    <dd className="text-screen-200 text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        {/* User activity: favorites, watchlist, rating, review */}
        <UserActions
          isAuthenticated={isAuthenticated}
          isFavorite={false}
          isInWatchlist={false}
          userRating={0}
          onToggleFavorite={() => {}}
          onToggleWatchlist={() => {}}
          onSubmitRating={(_rating, _comment) => {}}
        />

        {/* Cast */}
        {cast.length > 0 && <CastSection cast={cast} />}

        {/* Trailer */}
        {hasTrailerSection && (
          <div ref={trailerRef}>
            <TrailerSection videos={movie.videos.results} />
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section aria-labelledby="recommendations-heading">
            <SectionHeader title="You Might Also Like" id="recommendations-heading" />
            <MovieRow movies={recommendations} />
          </section>
        )}
      </main>
    </div>
  );
}
