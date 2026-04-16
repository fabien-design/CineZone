import { useRef } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useParams, Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMovieById, useLocalMovieById } from '../hooks/useMovies';
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
import { useRating } from '@/hooks/useRating';
import { useListStatus, useToggleList } from '@/hooks/useUserLists';
import { ReviewList } from '@/components/movie/ReviewList';
import type { MovieRef } from '@/types/movie';
import BottomBar from '@/components/layout/BottomBar';

interface DetailPageProps {
  source?: 'tmdb' | 'local';
}

export function DetailPage({ source = 'tmdb' }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { isAuthenticated } = useAuth();
  const tmdbQuery = useMovieById(movieId, source === 'tmdb');
  const localQuery = useLocalMovieById(movieId, source === 'local');
  const { data: movie, isLoading: isLoadingMovie, isError } =
    source === 'local' ? localQuery : tmdbQuery;

  const movieRef: MovieRef = { source, id: movieId };
  useDocumentTitle(movie?.title ?? '');
  const { movieRatings, isLoadingRatings, myRating, upsert: upsertRating, remove: removeRating } = useRating(movieRef, isAuthenticated);

  const { data: favStatus }       = useListStatus('favorites', movieRef, isAuthenticated);
  const { data: watchlistStatus } = useListStatus('watchlist',  movieRef, isAuthenticated);
  const { data: watchedStatus }   = useListStatus('watched',    movieRef, isAuthenticated);

  const toggleFavorite  = useToggleList('favorites', movieRef);
  const toggleWatchlist = useToggleList('watchlist',  movieRef);
  const toggleWatched   = useToggleList('watched',    movieRef);

  const trailerRef = useRef<HTMLDivElement>(null);
  const scrollToTrailer = () =>
    trailerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-cinema-950">
        <Navbar />
        <HeroBannerSkeleton />
        <BottomBar />
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
        <BottomBar />
      </div>
    );
  }

  // Narrow to MovieDetail for TMDB-only fields
  const tmdbMovie = source === 'tmdb' ? tmdbQuery.data : undefined;

  const heroData = source === 'local' && localQuery.data
    ? {
        id: movieId,
        source: 'local' as const,
        title:         localQuery.data.title,
        poster_path:   localQuery.data.poster_url,
        backdrop_path: localQuery.data.backdrop_url,
        vote_average:  localQuery.data.vote_average ?? 0,
        release_date:  localQuery.data.release_date,
        genres:        localQuery.data.genres,
      }
    : tmdbMovie;

  const cast            = tmdbMovie?.credits?.cast?.slice(0, 15) ?? [];
  const recommendations = tmdbMovie?.recommendations?.results?.slice(0, 12) ?? [];
  const hasTrailerSection = tmdbMovie?.videos?.results?.some(v => v.site === 'YouTube') ?? false;

  const extraInfo: { label: string; value: string }[] = [
    { label: 'Status',            value: tmdbMovie?.status ?? '' },
    { label: 'Budget',            value: tmdbMovie ? formatMoney(tmdbMovie.budget) : '' },
    { label: 'Revenue',           value: tmdbMovie ? formatMoney(tmdbMovie.revenue) : '' },
    { label: 'Original Language', value: tmdbMovie?.original_language?.toUpperCase() ?? '' },
  ].filter(item => item.value && item.value !== 'N/A');

  if (!heroData) return null;

  return (
    <div className="min-h-screen bg-cinema-950">
      <Navbar />

      <MovieDetailHero
        movie={heroData}
        isAuthenticated={isAuthenticated}
        isFavorite={favStatus?.inList ?? false}
        isInWatchlist={watchlistStatus?.inList ?? false}
        isWatched={watchedStatus?.inList ?? false}
        onToggleFavorite={() => toggleFavorite.mutate(favStatus?.inList ?? false)}
        onToggleWatchlist={() => toggleWatchlist.mutate(watchlistStatus?.inList ?? false)}
        onToggleWatched={() => toggleWatched.mutate(watchedStatus?.inList ?? false)}
        onWatchTrailer={scrollToTrailer}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-14">
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

        {/* User activity: rating, review */}
        <UserActions
          isAuthenticated={isAuthenticated}
          initialRating={myRating?.score ?? 0}
          initialComment={myRating?.comment ?? ''}
          onSubmitRating={async (values) => { await upsertRating(values); }}
          onDeleteReview={async () => { await removeRating(); }}
        />

        {/* Community reviews */}
        <section aria-labelledby="reviews-heading">
          <SectionHeader title="Community Reviews" id="reviews-heading" />
          <ReviewList ratings={movieRatings} isLoading={isLoadingRatings} />
        </section>
        


        {/* Cast */}
        {cast.length > 0 && <CastSection cast={cast} />}

        {/* Trailer */}
        {hasTrailerSection && tmdbMovie && (
          <div ref={trailerRef}>
            <TrailerSection videos={tmdbMovie.videos.results} />
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
      <BottomBar />
    </div>
  );
}
