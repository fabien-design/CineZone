import { useAtom } from "jotai";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { trendingWindowAtom } from "../store/uiAtoms";
import { useTrending, useLatestMovies } from "../hooks/useMovies";
import { Navbar } from "../components/layout/Navbar";
import { HeroBanner } from "../components/movie/HeroBanner";
import { HeroBannerSkeleton } from "../components/movie/HeroBannerSkeleton";
import { MovieRow } from "../components/movie/MovieRow";
import { TrendingToggle } from "../components/movie/TrendingToggle";
import { SectionHeader } from "../components/ui/SectionHeader";
import BottomBar from "@/components/layout/BottomBar";

export function HomePage() {
    useDocumentTitle('Home');
    const [trendingWindow, setTrendingWindow] = useAtom(trendingWindowAtom);

    const { data: trending, isLoading: trendingLoading } =
        useTrending(trendingWindow);
    const { data: latest, isLoading: latestLoading } = useLatestMovies();

    const heroMovie = trending?.results?.[0];
    const trendingMovies = trending?.results?.slice(1) ?? [];
    const latestMovies = latest?.results ?? [];

    return (
        <div className="min-h-screen bg-cinema-950">
            <Navbar />

            {trendingLoading || !heroMovie ? (
                <HeroBannerSkeleton />
            ) : (
                <HeroBanner movie={heroMovie} />
            )}

            <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-14">
                <section aria-labelledby="trending-heading">
                    <SectionHeader title="Trending" id="trending-heading">
                        <TrendingToggle
                            value={trendingWindow}
                            onChange={setTrendingWindow}
                        />
                    </SectionHeader>
                    <MovieRow
                        movies={trendingMovies}
                        isLoading={trendingLoading}
                    />
                </section>

                <section aria-labelledby="now-playing-heading">
                    <SectionHeader
                        title="Now Playing"
                        id="now-playing-heading"
                    />
                    <MovieRow movies={latestMovies} isLoading={latestLoading} />
                </section>
            </main>

            <BottomBar />
        </div>
    );
}
