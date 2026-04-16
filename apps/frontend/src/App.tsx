import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { setNavigate } from "./lib/navigation";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<DetailPage />} />
            <Route path="/movies/local/:id" element={<DetailPage source="local" />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
                path="/login"
                element={<AuthPage choosedTab="login" />}
            />
            <Route
                path="/register"
                element={<AuthPage choosedTab="register" />}
            />
        </Routes>
    );
}

export default App;
