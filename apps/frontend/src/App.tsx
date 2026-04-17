import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { HomePage } from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { HistoryPage } from "./pages/HistoryPage";
import { setNavigate } from "./lib/navigation";

function App() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:rounded-lg focus:bg-cinema-900 focus:px-4 focus:py-2 focus:text-sm focus:text-screen-100 focus:ring-2 focus:ring-reel-400"
            >
                {t('skipToContent')}
            </a>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<DetailPage />} />
                <Route path="/movies/local/:id" element={<DetailPage source="local" />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/login" element={<AuthPage choosedTab="login" />} />
                <Route path="/register" element={<AuthPage choosedTab="register" />} />
            </Routes>
        </>
    );
}

export default App;
